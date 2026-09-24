"""Dictionary and pattern recognizer for Polish person names and addresses.

Persons come from SGJP through Morfeusz2 (the same dictionary the morphology
engine uses): every given name and surname SGJP knows, in every inflected
form. A span is a person when it looks like one in context:

- given name(s) followed by a surname or an unknown capitalized word
  ("Jan Kowalski", "Annie Marii Nowak", "Jan Xyzowski"),
- surname followed by a given name ("Kowalski Jan"),
- an initial and a surname ("J. Kowalski"),
- a role or title before a surname ("pozwany Kowalski", "pani Nowak"),
- a later mention of the surname alone once the full name was found.

Addresses are recognized by structure: a street marker (ul., al., pl., os.,
ulica, aleja, plac, osiedle, rondo ...) with a name and a house number,
optionally followed by a postal code and town; a village address with a
number and postal code; a postal code with a town.

Input: text file. Output: JSON list of {start, end, kind, value}.
The recognizer never sees the network and never writes the text anywhere.
"""

from __future__ import annotations

import argparse
import json
import re
from functools import lru_cache
from pathlib import Path

import morfeusz2

UPPER = "A-ZĄĆĘŁŃÓŚŹŻÄÖÜÉÈÁÍÚÝČŠŽŘ"
WORD_RE = re.compile(r"[^\W\d_]+(?:[-'’][^\W\d_]+)*")

TRIGGERS = {
    "pan", "pana", "panu", "panem", "panie", "pani", "panią", "państwo",
    "powód", "powoda", "powodowi", "powodem", "powódka", "powódki", "powódce", "powódką",
    "pozwany", "pozwanego", "pozwanemu", "pozwanym", "pozwana", "pozwanej", "pozwaną",
    "świadek", "świadka", "świadkowi", "świadkiem",
    "oskarżony", "oskarżonego", "oskarżonemu", "oskarżonym", "oskarżona", "oskarżonej", "oskarżoną",
    "podejrzany", "podejrzanego", "podejrzana", "podejrzanej",
    "pokrzywdzony", "pokrzywdzonego", "pokrzywdzona", "pokrzywdzonej",
    "wnioskodawca", "wnioskodawcy", "wnioskodawczyni", "uczestnik", "uczestnika", "uczestniczka",
    "dłużnik", "dłużnika", "dłużniczka", "wierzyciel", "wierzyciela", "wierzycielka",
    "skarżący", "skarżącego", "skarżąca", "skarżącej", "obwiniony", "obwinionego", "obwiniona",
    "adwokat", "adwokata", "adw", "radca", "radcy", "mec", "sędzia", "sędziego", "prokurator",
    "prokuratora", "notariusz", "notariusza", "komornik", "komornika", "dr", "prof", "mgr", "inż",
    "syn", "córka", "żona", "mąż", "ojciec", "matka", "brat", "siostra",
}

# Nouns that head an institution name or name a party role, in every case form
# (generate_generic_words.py). Several are also SGJP surnames ("Bank", "Rada",
# "Skarb"): such a word starting a span is an institution or a role, not a
# person, unless a person-only word precedes it ("pani Rada").
_GENERIC = json.loads(Path(__file__).with_name("generic_words.json").read_text(encoding="utf-8"))
GENERIC_WORDS = frozenset(_GENERIC["institutions"]) | frozenset(_GENERIC["partyRoles"])
PARTY_ROLES = frozenset(_GENERIC["partyRoles"])
PERSON_ONLY_TRIGGERS = frozenset(_GENERIC["personOnlyTriggers"])


def is_generic(word: str) -> bool:
    return word.lower() in GENERIC_WORDS


STREET_MARKER = (
    r"(?i:ul\.|ulic(?:a|ą|ę|y|i)|al\.|alej(?:a|ą|ę|i)|alei|pl\.|plac(?:u|em)?|"
    r"os\.|osiedl(?:e|a|u|em)|rond(?:o|a|zie|em)|skwer(?:u|ze|em)?|"
    r"bulwar(?:u|ze|em)?|wybrzeż(?:e|a|u|em))"
)
NAME_TOKEN = (
    rf"(?:[{UPPER}][\w’'\-]*\.?|\d{{1,2}}(?=\s+[{UPPER}])|[IVX]{{1,4}}\b|"
    r"(?:św|gen|ks|kard|marsz|płk|mjr|prof|dr|bpa|bp|abp|im|kpt|por|ppor|hetm|króla|kr)\.)"
)
HOUSE_NUMBER = (
    r"(?:nr\s*)?\d{1,4}[A-Za-z]?(?:\s*[/\-]\s*\d{1,4}[A-Za-z]?)?"
    r"(?:\s*(?:m\.|lok\.|lokal|m)\s*\d{1,4}[A-Za-z]?)?"
)
TOWN = rf"[{UPPER}][\w\-]+(?:[ \-][{UPPER}][\w\-]+){{0,2}}"
POSTAL = rf"\d{{2}}-\d{{3}}\s+{TOWN}"

STREET_ADDRESS_RE = re.compile(
    rf"(?<![\w.@/-]){STREET_MARKER}\s+{NAME_TOKEN}(?:\s+{NAME_TOKEN}){{0,5}}\s+{HOUSE_NUMBER}(?![\w/])"
    rf"(?:\s*,?\s*{POSTAL})?"
)
VILLAGE_ADDRESS_RE = re.compile(
    rf"\b[{UPPER}][\w\-]+(?:\s+[{UPPER}][\w\-]+)?\s+\d{{1,4}}[A-Za-z]?(?:/\d{{1,4}})?,\s*{POSTAL}"
)
POSTAL_RE = re.compile(rf"(?<![\d-]){POSTAL}")

ANALYZER = morfeusz2.Morfeusz(generate=False)


@lru_cache(maxsize=200_000)
def word_class(word: str) -> tuple[bool, bool, bool, bool, bool, frozenset[str]]:
    """(given, surname, unknown, common, geographic, surname lemmas)."""
    forms = {word}
    if word.isupper() and len(word) > 1:
        forms.add(word.capitalize())
    given = surname = common = geographic = False
    unknown = True
    lemmas: set[str] = set()
    for form in forms:
        for _start, _end, (_orth, lemma, tag, name_types, _q) in ANALYZER.analyse(form):
            pos = tag.split(":", 1)[0]
            if pos == "ign":
                continue
            unknown = False
            types = set(name_types)
            if "imię" in types:
                given = True
            if "nazwisko" in types:
                surname = True
                lemmas.add(lemma.split(":", 1)[0])
            if "nazwa_geograficzna" in types:
                geographic = True
            if not (types & {"imię", "nazwisko", "nazwa_geograficzna"}) and pos not in {"brev", "interp"}:
                common = True
    return given, surname, unknown, common, geographic, frozenset(lemmas)


ADJECTIVAL = re.compile(r"^(.{2,}(?:sk|ck|dzk))(?:i|iego|iemu|im|a|iej|ą)$", re.IGNORECASE)


def surname_keys(word: str, in_surname_position: bool = False) -> set[str]:
    """Keys shared by every case form of a surname.

    A word that is also a given name ("Kondrat", "Bogusz") counts only when it
    stood in the surname position of a full name.
    """
    g, s, u, c, _geo, lemmas = word_class(word)
    if s and (not g or in_surname_position):
        return set(lemmas)
    if u or (c and in_surname_position and ADJECTIVAL.match(word)):
        match = ADJECTIVAL.match(word)
        # Unknown adjectival surname: the stem is shared by all cases and genders.
        return {"adj:" + (match.group(1) if match else word).lower()}
    return set()


def is_capitalized(word: str) -> bool:
    if not word[:1].isupper() or word.lower() in TRIGGERS:
        return False
    if word.isupper() and len(word) <= 3:
        # Short all-caps words are acronyms (SA, RP) unless SGJP knows them as
        # a given name or surname ("JAN", "EWA").
        given, surname, *_rest = word_class(word)
        return given or surname
    return True


# Names that are not about a party: a street or institution named after
# someone ("ulicy Mickiewicza", "Szpital im. Jana Pawła II") and quoted titles.
NAMED_AFTER_RE = re.compile(
    rf"(?:(?<![\w.@/-])(?:im\.|imienia|{STREET_MARKER}))\s+((?:[{UPPER}][^\s,.;:]*\.?\s?){{1,4}})"
)
QUOTED_RE = re.compile(r"[„\"«][^”\"»\n]{1,120}[”\"»]")


def not_person_spans(text: str) -> list[tuple[int, int]]:
    spans = [(m.start(1), m.end(1)) for m in NAMED_AFTER_RE.finditer(text)]
    spans += [(m.start(), m.end()) for m in QUOTED_RE.finditer(text)]
    return spans


ROMAN_AFTER = re.compile(r"\s+[IVX]{1,4}\b")


def tokens(text: str) -> list[tuple[int, int, str]]:
    return [(m.start(), m.end(), m.group()) for m in WORD_RE.finditer(text)]


def adjacent(text: str, left: tuple[int, int, str], right: tuple[int, int, str]) -> bool:
    gap = text[left[1]:right[0]]
    return gap in {" ", " "} or (gap == "" and False)


def find_addresses(text: str) -> list[tuple[int, int]]:
    spans: list[tuple[int, int]] = []
    for regex in (STREET_ADDRESS_RE, VILLAGE_ADDRESS_RE, POSTAL_RE):
        for match in regex.finditer(text):
            start, end = match.start(), match.end()
            if any(start < e and s < end for s, e in spans):
                continue
            spans.append((start, end))
    return spans


def find_persons(text: str, blocked: list[tuple[int, int]]) -> list[tuple[int, int]]:
    words = tokens(text)
    taken = [False] * len(words)

    def free(index: int) -> bool:
        s, e, _ = words[index]
        return not taken[index] and not any(s < be and bs < e for bs, be in blocked)

    spans: list[tuple[int, int]] = []
    # Words that stood in the surname position of a full name found above.
    surname_positions: list[int] = []

    def take(first: int, last: int) -> None:
        for index in range(first, last + 1):
            taken[index] = True
        spans.append((words[first][0], words[last][1]))

    def cls(index: int):
        return word_class(words[index][2])

    def cap(index: int) -> bool:
        return 0 <= index < len(words) and is_capitalized(words[index][2]) and free(index)

    def linked(a: int, b: int) -> bool:
        return adjacent(text, words[a], words[b])

    # 1. Given name(s) + surname or unknown word.
    index = 0
    while index < len(words):
        if cap(index) and cls(index)[0]:
            end = index
            given_count = 1
            while cap(end + 1) and linked(end, end + 1) and cls(end + 1)[0] and given_count < 3:
                end += 1
                given_count += 1
            nxt = end + 1
            # Saints and monarchs ("Jana Pawła II", "Kazimierza III") are not parties.
            if ROMAN_AFTER.match(text, words[end][1]):
                index = end + 1
                continue
            if cap(nxt) and linked(end, nxt):
                g, s, u, c, geo, _ = cls(nxt)
                # An adjectival word after a given name is a surname even when
                # SGJP also reads it as an adjective ("Ewa Czarnowelska").
                if s or u or (not c and not geo) or ADJECTIVAL.match(words[nxt][2]):
                    take(index, nxt)
                    surname_positions.append(nxt)
                    index = nxt + 1
                    continue
            # "Jan Maria" + surname already consumed above; two given names where
            # the second is also a surname ("Anna Jan") are accepted as a name.
            if end > index and cls(end)[1]:
                take(index, end)
                surname_positions.append(end)
                index = end + 1
                continue
        index += 1

    # 2. Surname + given name ("Kowalski Jan").
    for index in range(len(words) - 1):
        if cap(index) and cap(index + 1) and linked(index, index + 1):
            g, s, u, c, geo, _ = cls(index)
            if (
                s and not geo and cls(index + 1)[0]
                and not is_generic(words[index][2])
                and not ROMAN_AFTER.match(text, words[index + 1][1])
            ):
                take(index, index + 1)
                surname_positions.append(index)

    # 3. Initial(s) + surname ("J. Kowalski", "J.M. Nowak").
    for match in re.finditer(rf"\b(?:[{UPPER}]\.\s?){{1,2}}\s?([{UPPER}][^\W\d_]+(?:-[{UPPER}][^\W\d_]+)?)", text):
        surname = match.group(1)
        g, s, u, c, geo, _ = word_class(surname)
        if (s or u) and not any(match.start() < be and bs < match.end() for bs, be in blocked + spans):
            spans.append((match.start(), match.end()))
            for i, (ws, we, _) in enumerate(words):
                if match.start() <= ws and we <= match.end():
                    taken[i] = True

    # 4. Role or title before a surname ("pozwany Kowalski", "pani Nowak").
    for index in range(len(words) - 1):
        trigger = words[index][2].lower()
        # Party roles of contracts ("Najemca Kowalski") point at a person too.
        if trigger not in TRIGGERS and trigger not in PARTY_ROLES:
            continue
        gap = text[words[index][1]:words[index + 1][0]]
        if gap.strip() not in {"", "."}:
            continue
        first = index + 1
        if not cap(first):
            continue
        # "pozwany Bank", "Wierzyciel Skarb Państwa": an institution, not a person.
        if is_generic(words[first][2]) and trigger not in PERSON_ONLY_TRIGGERS:
            continue
        last = first
        while last - first < 2 and cap(last + 1) and linked(last, last + 1):
            g, s, u, c, geo, _ = cls(last + 1)
            if not (g or s or u):
                break
            last += 1
        g, s, u, c, geo, _ = cls(first)
        if (s or u or g) and not (c and not s and not g):
            take(first, last)

    # 5. The surname alone after the full name was found.
    # Only real surnames of full names found above; a word that is also a given
    # name ("Jan", "Maria") is never propagated on its own.
    known: set[str] = set()
    for position in surname_positions:
        known |= surname_keys(words[position][2], in_surname_position=True)
    for start, end in spans:
        for ws, we, word in words:
            if start <= ws and we <= end:
                known |= surname_keys(word)
    if known:
        for index in range(len(words)):
            # "Bank Pekao" after "Jan Bank": the institution name, not the person.
            if (
                is_generic(words[index][2])
                and index + 1 < len(words)
                and linked(index, index + 1)
                and is_capitalized(words[index + 1][2])
            ):
                continue
            if cap(index) and surname_keys(words[index][2], in_surname_position=True) & known:
                take(index, index)

    return spans


def is_ambiguous(value: str) -> bool:
    """A person span a local model should confirm from the sentence: one word,
    a generic noun in it, or only words that are also common nouns."""
    words = [word for _s, _e, word in tokens(value)]
    if len(words) <= 1 or any(is_generic(word) for word in words):
        return True
    classes = [word_class(word) for word in words]
    return all(c and not g for g, _s, _u, c, _geo, _l in classes)


def recognize(text: str) -> list[dict]:
    addresses = find_addresses(text)
    persons = find_persons(text, addresses + not_person_spans(text))
    result = [
        {"start": s, "end": e, "kind": "ADDRESS", "value": text[s:e]} for s, e in addresses
    ] + [
        {"start": s, "end": e, "kind": "PERSON", "value": text[s:e], "ambiguous": is_ambiguous(text[s:e])}
        for s, e in persons
    ]
    return sorted(result, key=lambda item: item["start"])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    text = Path(args.input).read_text(encoding="utf-8")
    Path(args.output).write_text(json.dumps(recognize(text), ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    main()
