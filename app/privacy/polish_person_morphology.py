"""Polish person-name morphology for reversible pseudonymization.

Given one form of a person's name as it occurs in a document (any case), the
engine determines the canonical name (nominative), the person's gender and the
full singular paradigm (7 cases). Sources, in order of authority:

1. exceptions confirmed by the user (JSON file),
2. the SGJP dictionary through Morfeusz2,
3. deterministic rules for names SGJP does not know (foreign surnames),
4. otherwise the form is kept and marked for review - nothing is guessed.

Every generated form carries its source and a confidence so the review screens
can show what was dictionary-backed and what needs a human look.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

CASES = ("nom", "gen", "dat", "acc", "inst", "loc", "voc")
GENDERS = ("m1", "f")
LETTER = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿĄĆĘŁŃÓŚŹŻąćęłńóśźż]")
# Kept as written: academic titles, initials.
FROZEN = re.compile(r"^(?:[A-ZĄĆĘŁŃÓŚŹŻ]\.|dr|dr\.|hab\.|prof\.|mgr|inż\.|adw\.|r\.pr\.|ks\.|płk|gen\.|mec\.)$", re.I)
NAME_TYPES = {"imię": "given", "nazwisko": "surname"}
# The most frequent Polish given names (Cenzor measurement list, MIT): when
# SGJP offers a common and a rare reading (Jacek/Jack, Martyna/Martyn), the
# common one wins.
COMMON_GIVEN = set(["Adam", "Adrian", "Agata", "Agnieszka", "Aleksander", "Aleksandra", "Alicja", "Andrzej", "Aneta", "Anna", "Antoni", "Arkadiusz", "Artur", "Barbara", "Bartosz", "Bartłomiej", "Beata", "Bogdan", "Bogumiła", "Bożena", "Bronisław", "Błażej", "Cezary", "Cyprian", "Czesław", "Dagmara", "Damian", "Daniel", "Danuta", "Dariusz", "Dawid", "Dominik", "Dominika", "Dorota", "Edward", "Elżbieta", "Emilia", "Ewa", "Ewelina", "Filip", "Franciszek", "Gabriela", "Grażyna", "Grzegorz", "Halina", "Hanna", "Henryk", "Ignacy", "Irena", "Iwona", "Izabela", "Jacek", "Jadwiga", "Jakub", "Jan", "Janina", "Janusz", "Jarosław", "Jerzy", "Joanna", "Jolanta", "Julia", "Justyna", "Józef", "Kacper", "Kamil", "Kamila", "Karol", "Karolina", "Katarzyna", "Kazimierz", "Kinga", "Klaudia", "Konrad", "Krystyna", "Krzysztof", "Leszek", "Lidia", "Lucyna", "Maciej", "Maciej", "Magdalena", "Maja", "Malwina", "Marcin", "Marek", "Maria", "Mariola", "Mariusz", "Marta", "Martyna", "Marzena", "Mateusz", "Michał", "Mieczysław", "Mirosław", "Mirosława", "Monika", "Natalia", "Norbert", "Olga", "Oliwia", "Patryk", "Paulina", "Paweł", "Piotr", "Przemysław", "Rafał", "Renata", "Robert", "Roman", "Ryszard", "Sandra", "Sebastian", "Stanisław", "Stanisława", "Stefan", "Sylwia", "Szymon", "Sławomir", "Tadeusz", "Teresa", "Tomasz", "Urszula", "Wanda", "Weronika", "Wiesław", "Wiesława", "Wiktor", "Wiktoria", "Wioletta", "Witold", "Wojciech", "Władysław", "Włodzimierz", "Zbigniew", "Zdzisław", "Zofia", "Zuzanna", "Łukasz"])
# Name particles are written as they are (Jerzy de Vries, Ludwig van Beethoven).
PARTICLES = {"de", "van", "von", "da", "di", "del", "della", "der", "den", "du", "la", "le", "ten", "ter", "bin", "ibn", "al", "el", "y", "zu"}


@dataclass
class Candidate:
    lemma_id: str
    lemma: str
    genders: set[str]
    cases: set[str]
    role: str | None
    penalty: float


@dataclass
class WordPlan:
    surface: str
    frozen: bool = False
    candidates: list[Candidate] = field(default_factory=list)


def _features(tag: str) -> list[set[str]]:
    return [set(part.split(".")) for part in tag.split(":")]


def _match_case(surface: str, value: str) -> str:
    if surface.isupper() and len(surface) > 1:
        return value.upper()
    if surface[:1].isupper():
        return value[:1].upper() + value[1:]
    return value


def _common_prefix(a: str, b: str) -> int:
    count = 0
    for x, y in zip(a.lower(), b.lower()):
        if x != y:
            break
        count += 1
    return count


class Exceptions:
    """User-confirmed paradigms: {"Müller": {"m1": {"gen": "Müllera", ...}}}."""

    def __init__(self, path: Path | None) -> None:
        self.entries: dict[str, dict[str, dict[str, str]]] = {}
        if path and path.is_file():
            self.entries = json.loads(path.read_text(encoding="utf-8"))

    def lookup(self, word: str) -> dict[str, dict[str, str]] | None:
        return self.entries.get(word) or self.entries.get(word.capitalize())

    def reverse(self, surface: str) -> list[tuple[str, str, str]]:
        found = []
        for base, by_gender in self.entries.items():
            for gender, forms in by_gender.items():
                for case, form in forms.items():
                    if form.lower() == surface.lower():
                        found.append((base, gender, case))
        return found


# --- rules for words SGJP does not know ---------------------------------

_LOC_PALATAL = [
    ("str", "strze"), ("st", "ście"), ("zd", "ździe"), ("sł", "śle"),
    ("r", "rze"), ("t", "cie"), ("d", "dzie"), ("n", "nie"), ("s", "sie"),
    ("z", "zie"), ("ł", "le"), ("m", "mie"), ("p", "pie"), ("b", "bie"),
    ("w", "wie"), ("f", "fie"),
]


def _rule_masculine(base: str) -> dict[str, str] | None:
    low = base.lower()
    if low.endswith(("ski", "cki", "dzki")):
        stem = base[:-1]
        return {"nom": base, "gen": stem + "iego", "dat": stem + "iemu", "acc": stem + "iego",
                "inst": stem + "im", "loc": stem + "im", "voc": base}
    if not re.search(r"[bcćdfghjklłmnprsśtwzźż]$", low):
        return None  # vowel-final foreign surnames: no safe rule
    ins = base + ("iem" if low.endswith(("k", "g")) else "em")
    if low.endswith(("k", "g", "ch", "c", "cz", "sz", "rz", "ż", "dż", "j", "l")):
        loc = base + "u"
    else:
        loc = None
        for ending, replacement in _LOC_PALATAL:
            if low.endswith(ending):
                loc = base[: len(base) - len(ending)] + replacement
                break
        if loc is None:
            loc = base + "u"
    return {"nom": base, "gen": base + "a", "dat": base + "owi", "acc": base + "a",
            "inst": ins, "loc": loc, "voc": loc}


_FEM_DAT = [("ka", "ce"), ("ga", "dze"), ("cha", "sze"), ("ra", "rze"), ("ta", "cie"),
            ("da", "dzie"), ("na", "nie"), ("sa", "sie"), ("za", "zie"), ("ła", "le"),
            ("ma", "mie"), ("pa", "pie"), ("ba", "bie"), ("wa", "wie"), ("fa", "fie")]


def _rule_feminine(base: str) -> dict[str, str] | None:
    low = base.lower()
    if low.endswith("a") and not low.endswith(("ska", "cka", "dzka")) and len(low) > 2:
        stem = base[:-1]
        soft = low.endswith(("ia", "ja", "la", "ca", "cza", "sza", "rza", "ża"))
        gen = stem + ("i" if low.endswith(("ka", "ga", "ia", "la", "ja")) else "y")
        if low.endswith(("ia",)):
            gen = stem + "i"
        dat = None
        if soft:
            dat = gen
        else:
            for ending, replacement in _FEM_DAT:
                if low.endswith(ending):
                    dat = base[: len(base) - len(ending)] + replacement
                    break
        if dat is None:
            return None
        return {"nom": base, "gen": gen, "dat": dat, "acc": stem + "ę",
                "inst": stem + "ą", "loc": dat, "voc": stem + "o"}
    if low.endswith(("ska", "cka", "dzka")):
        stem = base[:-1]
        return {"nom": base, "gen": stem + "iej", "dat": stem + "iej", "acc": base[:-1] + "ą",
                "inst": base[:-1] + "ą", "loc": stem + "iej", "voc": base}
    if re.search(r"[bcćdfghjklłmnprsśtwzźż]$", low):
        # Feminine consonant-final surnames do not inflect (Anna Nowak, Anna Smith).
        return {case: base for case in CASES}
    return None


ADJECTIVAL_SURNAME = re.compile(r"^(.{2,}(?:sk|ck|dzk))(i|iego|iemu|im|a|iej|ą)$", re.IGNORECASE)
ADJECTIVAL_ENDINGS = {
    "i": [("m1", ("nom", "voc"))],
    "iego": [("m1", ("gen", "acc"))],
    "iemu": [("m1", ("dat",))],
    "im": [("m1", ("inst", "loc"))],
    "a": [("f", ("nom", "voc"))],
    "iej": [("f", ("gen", "dat", "loc"))],
    "ą": [("f", ("acc", "inst"))],
}


class PersonMorphology:
    def __init__(self, exceptions_path: Path | None = None) -> None:
        import morfeusz2

        self.engine = morfeusz2.Morfeusz()
        self.exceptions = Exceptions(exceptions_path)

    # -- analysis ---------------------------------------------------------

    def _candidates(self, word: str) -> list[Candidate]:
        found: list[Candidate] = []
        for base, gender, case in self.exceptions.reverse(word):
            found.append(Candidate(f"exception:{base}", base, {gender}, {case}, None, -1.0))
        try:
            analyses = self.engine.analyse(word)
        except Exception:
            analyses = []
        for item in analyses:
            _orth, lemma_id, tag, name_types, _qualifiers = item[2]
            parts = _features(tag)
            if parts[0] != {"subst"} or len(parts) < 4:
                continue
            numbers, cases, genders = parts[1], parts[2], parts[3]
            if "sg" not in numbers:
                continue
            genders = genders & set(GENDERS)
            if not genders:
                continue
            lemma = lemma_id.split(":", 1)[0]
            roles = [NAME_TYPES[t] for t in name_types if t in NAME_TYPES]
            capitalized_lemma = lemma[:1].isupper()
            penalty = 0.0 if roles else (0.6 if capitalized_lemma else 2.0)
            if "given" in roles and lemma not in COMMON_GIVEN:
                penalty += 0.1
            # SGJP pairs every surname with an indeclinable feminine lemma; an
            # inflected reading (Siuty -> Siuta) is preferred when one exists.
            if cases >= set(CASES):
                penalty += 0.15
            found.append(Candidate(lemma_id, lemma, genders, cases & set(CASES), roles[0] if roles else None, penalty))
        # Adjectival surnames SGJP does not know (Dziewulinski, Kępińarska) are
        # fully regular: any case form gives the nominative and the gender.
        if not any(c.role == "surname" for c in found):
            match = ADJECTIVAL_SURNAME.match(word)
            if match and match.group(1)[:1].isupper():
                stem, ending = match.group(1), match.group(2).lower()
                for gender, cases in ADJECTIVAL_ENDINGS.get(ending, []):
                    base = stem + ("i" if gender == "m1" else "a")
                    found.append(Candidate(f"adjsurname:{base}", base, {gender}, set(cases), "surname", 0.3))
        return found

    def _plan(self, surface: str) -> list[WordPlan]:
        plans: list[WordPlan] = []
        for token in re.findall(r"\S+", surface):
            if FROZEN.match(token) or token in PARTICLES or not LETTER.search(token):
                plans.append(WordPlan(token, frozen=True))
                continue
            plans.append(WordPlan(token, candidates=self._candidates(token.strip(",;"))))
        return plans

    def analyze(self, surface: str, gender_hint: str | None = None) -> dict[str, Any]:
        """Canonical form, gender and paradigm for one person mention."""
        words = []
        for token in re.findall(r"\S+", surface):
            # Hyphenated surnames inflect part by part (Kowalska-Nowak).
            words.append(token.split("-"))
        flat = [part for word in words for part in word]
        plans = [self._plan(part)[0] for part in flat]

        def reading(gender: str, case: str) -> tuple[float, list[Candidate | None]]:
            score = 0.0
            chosen: list[Candidate | None] = []
            for plan in plans:
                if plan.frozen:
                    chosen.append(None)
                    continue
                matching = [c for c in plan.candidates if gender in c.genders and case in c.cases]
                if matching:
                    pick = min(matching, key=lambda c: (c.penalty, c.role != "given"))
                    score += pick.penalty
                    chosen.append(pick)
                else:
                    # Unknown to SGJP: plausible only as an uninflected nominative.
                    score += 1.5 if case == "nom" else 4.0
                    chosen.append(None)
            # A multi-word person name normally contains a given name; a reading
            # made only of surnames ("Jan" as a feminine surname) is unlikely.
            name_words = [plan for plan in plans if not plan.frozen]
            if len(name_words) > 1 and not any(
                any(other.role == "given" and gender in other.genders and case in other.cases
                    for other in plan.candidates)
                for plan in plans if not plan.frozen
            ):
                score += 0.8
            # A first name unknown to SGJP (Hans, Emma): -a suggests a woman.
            if name_words and not name_words[0].candidates:
                first = name_words[0].surface.lower()
                looks_female = first.endswith("a")
                if (gender == "f") != looks_female:
                    score += 0.3
            # Nominative is the most frequent reading of an ambiguous mention.
            score += 0.0 if case == "nom" else 0.05
            return score, chosen

        best: tuple[float, str, str, list[Candidate | None]] | None = None
        for gender in GENDERS:
            if gender_hint and gender != gender_hint:
                continue
            for case in CASES:
                score, chosen = reading(gender, case)
                if best is None or score < best[0]:
                    best = (score, gender, case, chosen)
        assert best is not None
        score, gender, observed_case, chosen = best

        # Gender is ambiguous when the other gender reads equally well ("Nowak").
        alternatives = []
        if not gender_hint:
            for other in GENDERS:
                # Small preferences (common name, inflected surname) choose a
                # default, but a near-equal reading of the other gender is flagged.
                if other != gender and any(
                    reading(other, case)[0] - score < 0.25 for case in CASES
                ):
                    alternatives.append(other)

        forms: dict[str, dict[str, Any]] = {case: {"parts": []} for case in CASES}
        warnings: list[str] = []
        index = 0
        rendered: dict[str, list[str]] = {case: [] for case in CASES}
        confidence: dict[str, float] = {case: 1.0 for case in CASES}
        sources: dict[str, set[str]] = {case: set() for case in CASES}
        for word in words:
            pieces: dict[str, list[str]] = {case: [] for case in CASES}
            for part in word:
                plan = plans[index]
                candidate = chosen[index]
                index += 1
                paradigm, source, conf = self._paradigm(plan, candidate, gender, observed_case)
                # Single forms the user corrected win over the computed ones.
                corrected = {} if plan.frozen else self._corrected_forms(plan, candidate, gender)
                if source == "unresolved" and len(corrected) < len(CASES):
                    warnings.append(f"NO_PARADIGM:{plan.surface}")
                for case in CASES:
                    if case in corrected:
                        pieces[case].append(_match_case(plan.surface, corrected[case]))
                        sources[case].add("exception")
                        continue
                    pieces[case].append(_match_case(plan.surface, paradigm[case]) if not plan.frozen else plan.surface)
                    confidence[case] = min(confidence[case], conf if case != observed_case else 1.0)
                    sources[case].add(source)
            for case in CASES:
                rendered[case].append("-".join(pieces[case]))

        paradigm_out = {
            case: {
                "text": " ".join(rendered[case]),
                "source": "+".join(sorted(sources[case])) or "frozen",
                "confidence": round(confidence[case], 2),
            }
            for case in CASES
        }
        status = "ok"
        if alternatives:
            status = "gender_ambiguous"
        name_words = [plan for plan in plans if not plan.frozen]
        if not gender_hint and name_words and not any(
            c.role == "given" for plan in name_words for c in plan.candidates
        ) and len(name_words) > 1:
            # Gender came from a heuristic only (unknown first name).
            warnings.append("GENDER_HEURISTIC")
            status = "needs_review"
        if any(w.startswith("NO_PARADIGM") for w in warnings) or min(confidence.values()) < 0.6:
            status = "needs_review"
        return {
            "surface": surface,
            "canonical": paradigm_out["nom"]["text"],
            "gender": gender,
            "genderAlternatives": alternatives,
            "observedCase": observed_case,
            "forms": paradigm_out,
            "status": status,
            "warnings": warnings,
        }

    def _corrected_forms(self, plan: WordPlan, candidate: Candidate | None, gender: str) -> dict[str, str]:
        word = plan.surface.strip(",;")
        base = candidate.lemma if candidate and candidate.lemma_id.startswith("exception:") else word
        entry = self.exceptions.lookup(base)
        if not entry or gender not in entry:
            return {}
        return {case: form for case, form in entry[gender].items() if case in CASES}

    def _paradigm(self, plan: WordPlan, candidate: Candidate | None, gender: str, observed_case: str) -> tuple[dict[str, str], str, float]:
        if plan.frozen:
            return {case: plan.surface for case in CASES}, "frozen", 1.0
        word = plan.surface.strip(",;")
        complete = self._corrected_forms(plan, candidate, gender)
        if len(complete) == len(CASES):
            return complete, "exception", 1.0
        if candidate and candidate.lemma_id.startswith("adjsurname:"):
            rule = _rule_masculine(candidate.lemma) if gender == "m1" else _rule_feminine(candidate.lemma)
            if rule:
                return {case: _match_case(plan.surface, form) for case, form in rule.items()}, "rule", 0.9
        if candidate:
            try:
                generated = self.engine.generate(candidate.lemma_id)
            except Exception:
                generated = []
            by_case: dict[str, list[str]] = {case: [] for case in CASES}
            for orth, _lemma, tag, *_rest in generated:
                parts = _features(tag)
                if parts[0] != {"subst"} or len(parts) < 4 or "sg" not in parts[1] or gender not in parts[3]:
                    continue
                for case in parts[2] & set(CASES):
                    by_case[case].append(orth)
            if all(by_case[case] for case in CASES):
                # Variant forms (Stępnia/Stępienia): follow the stem seen in the document.
                paradigm = {
                    case: max(by_case[case], key=lambda form: (_common_prefix(form, word), -by_case[case].index(form)))
                    for case in CASES
                }
                return paradigm, "sgjp", 1.0
        base = word if observed_case == "nom" else None
        if base is not None:
            rule = _rule_masculine(base) if gender == "m1" else _rule_feminine(base)
            if rule:
                indeclinable = len(set(rule.values())) == 1
                if indeclinable:
                    return rule, "rule", 0.9
                # Feminine -a words may be noun-like (Siuta -> Siucie) or
                # adjectival (Novotna -> Novotnej): never trust the guess.
                if gender == "f" and base.lower().endswith("a"):
                    return rule, "rule", 0.5
                return rule, "rule", 0.75
        return {case: word for case in CASES}, "unresolved", 0.3



# --- addresses -------------------------------------------------------------

# Street type -> (gender the street name agrees with, lemma when written out).
STREET_TYPES = {
    "ul.": ("f", None), "al.": ("f", None), "pl.": ("m3", None), "os.": ("n", None),
    "ulica": ("f", "ulica"), "aleja": ("f", "aleja"), "plac": ("m3", "plac"),
    "osiedle": ("n", "osiedle"), "rondo": ("n", "rondo"), "skwer": ("m3", "skwer"),
    "bulwar": ("m3", "bulwar"), "wybrzeże": ("n", "wybrzeże"),
}
ADDRESS_WORD = re.compile(r"\S+")
# Streets named after women are written with the surname in the genitive, which
# looks exactly like an agreeing adjective ("ul. Konopnickiej" vs "ul. Długiej").
FEMALE_PATRON_STREETS = {
    "konopnickiej", "orzeszkowej", "skłodowskiej", "curie-skłodowskiej", "skłodowskiej-curie",
    "zapolskiej", "dąbrowskiej", "nałkowskiej", "szymborskiej", "żmichowskiej", "pawlikowskiej",
    "pawlikowskiej-jasnorzewskiej", "kossak-szczuckiej", "rodziewiczówny", "gojawiczyńskiej",
    "kuncewiczowej", "bacewiczówny", "grabskiej", "moniuszkowej", "prusowej", "ordonówny",
    "krzywickiej", "świętochowskiej", "sempołowskiej", "kopernikowej", "wańkowiczowej",
}
HOUSE = re.compile(r"^(?:nr|\d{1,4}[A-Za-z]?(?:[/\-]\d{1,4}[A-Za-z]?)?[,.]?)$", re.I)


class AddressMorphology:
    """"ul. Długiej 5" -> canonical "ul. Długa 5" and the seven case forms.

    Only an adjective that agrees with the street type inflects ("Długa",
    "Grunwaldzka", "osiedle Słoneczne"); a noun in the genitive ("Mickiewicza",
    "Armii Krajowej", "3 Maja") and everything after the name (house number,
    postal code, town) stay as written.
    """

    def __init__(self, engine) -> None:
        self.engine = engine

    def _marker(self, word: str):
        low = word.lower()
        if low in STREET_TYPES:
            return STREET_TYPES[low], {"nom"}
        for _key, (gender, lemma) in STREET_TYPES.items():
            if not lemma:
                continue
            cases: set[str] = set()
            for _s, _e, (_orth, lem, tag, _types, _q) in self.engine.analyse(low):
                parts = _features(tag)
                if lem.split(":")[0] == lemma and parts[0] == {"subst"} and "sg" in parts[1]:
                    cases |= parts[2] & set(CASES)
            if cases:
                return (gender, lemma), cases
        return None, set()

    def _adjective(self, word: str, gender: str, cases: set[str] | None):
        for _s, _e, (_orth, lemma, tag, _types, _q) in self.engine.analyse(word):
            parts = _features(tag)
            if parts[0] == {"adj"} and "sg" in parts[1] and gender in parts[3]:
                found = parts[2] & set(CASES)
                if cases is None or found & cases:
                    return lemma.split(":")[0], found if cases is None else found & cases
        return None, set()

    def _forms(self, lemma: str, pos: str, gender: str) -> dict[str, str]:
        forms: dict[str, str] = {}
        for orth, _lemma, tag, *_rest in self.engine.generate(lemma):
            parts = _features(tag)
            if parts[0] != {pos} or "sg" not in parts[1] or gender not in parts[3]:
                continue
            if pos == "adj" and "pos" not in parts[-1]:
                continue
            for case in parts[2] & set(CASES):
                forms.setdefault(case, orth)
        return forms

    def analyze(self, surface: str) -> dict[str, Any]:
        words = ADDRESS_WORD.findall(surface)
        forms_by_case = {case: surface for case in CASES}
        base = {
            "surface": surface,
            "canonical": surface,
            "gender": "n",
            "genderAlternatives": [],
            "observedCase": "nom",
            "status": "ok",
            "warnings": [],
        }
        if not words:
            return {**base, "forms": {c: {"text": surface, "source": "frozen", "confidence": 1.0} for c in CASES}}
        (marker, observed) = self._marker(words[0])
        if not marker:
            # Village or postal address: written the same in every sentence.
            return {**base, "forms": {c: {"text": surface, "source": "frozen", "confidence": 1.0} for c in CASES}}
        gender, marker_lemma = marker
        marker_forms = self._forms(marker_lemma, "subst", gender) if marker_lemma else {}
        # Words of the street name: up to the house number.
        plan: list[tuple[str, str | None]] = []  # (word, adjective lemma or None)
        agreeing = True
        name_done = False
        cases = observed if marker_lemma else None
        for word in words[1:]:
            if name_done or HOUSE.match(word) or re.match(r"^\d{2}-\d{3}$", word):
                name_done = True
                plan.append((word, None))
                continue
            core = word.rstrip(",.")
            lemma = None
            if core.lower() in FEMALE_PATRON_STREETS:
                agreeing = False
            if agreeing and core[:1].isupper():
                lemma, found = self._adjective(core, gender, cases)
                if lemma:
                    cases = found if cases is None else (cases & found or cases)
            if not lemma:
                agreeing = False
            plan.append((word, lemma))
        adjective_forms = {lemma: self._forms(lemma, "adj", gender) for _w, lemma in plan if lemma}
        if not adjective_forms and not marker_forms:
            return {**base, "forms": {c: {"text": surface, "source": "frozen", "confidence": 1.0} for c in CASES}}
        result: dict[str, dict[str, Any]] = {}
        complete = True
        for case in CASES:
            parts = []
            first = words[0]
            if marker_lemma and case in marker_forms:
                parts.append(_match_case(first, marker_forms[case]))
            else:
                parts.append(first)
            for word, lemma in plan:
                if lemma and case in adjective_forms[lemma]:
                    tail = word[len(word.rstrip(",.")):]
                    parts.append(_match_case(word, adjective_forms[lemma][case]) + tail)
                else:
                    if lemma:
                        complete = False
                    parts.append(word)
            result[case] = {"text": " ".join(parts), "source": "sgjp", "confidence": 1.0}
        observed_case = sorted(cases)[0] if cases else "nom"
        return {
            **base,
            "canonical": result["nom"]["text"],
            "gender": gender,
            "observedCase": observed_case,
            "status": "ok" if complete else "needs_review",
            "forms": result,
        }


def main() -> None:
    import argparse
    import os

    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    requests = json.loads(Path(args.input).read_text(encoding="utf-8"))
    exceptions_raw = os.environ.get("LEX_NAME_EXCEPTIONS", "").strip()
    engine = PersonMorphology(Path(exceptions_raw) if exceptions_raw else None)
    results = [
        engine.analyze(item["surface"], item.get("genderHint"))
        for item in requests.get("persons", [])
    ]
    address_engine = AddressMorphology(engine.engine)
    addresses = [address_engine.analyze(item["surface"]) for item in requests.get("addresses", [])]
    # OCR correction: is the word a form known to the SGJP dictionary?
    known = [
        any(interp[2][2] != "ign" for interp in engine.engine.analyse(word))
        for word in requests.get("words", [])
    ]
    Path(args.output).write_text(
        json.dumps({"persons": results, "addresses": addresses, "known": known}, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
