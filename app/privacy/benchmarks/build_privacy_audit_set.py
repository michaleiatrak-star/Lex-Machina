"""Build the anonymization / deanonymization audit set.

500 documents, each with one person, one address, identification numbers
and decoys (courts, statutes, institutions, amounts, case numbers) that must
NOT be anonymized. Every mention carries its gold span and its gold form, so
the audit can measure leaks, false positives, one-token-per-entity and the
correctness of every case restored from a model answer.

Persons: 450 with Polish given names (Cenzor list) and frequent PESEL surnames
(Parawan list), gold forms from SGJP; 50 with surnames SGJP does not know
(adjectival -ski/-ska built from real stems), gold forms by the regular
adjectival paradigm. Addresses: street names written the way Polish address
lines are written, gold forms by independent rules (adjective agreement with
ulica/aleja/plac/osiedle; genitive names invariant) - not by Morfeusz.
Identifiers are synthetic numbers with valid check digits; none is real.

Run: python build_privacy_audit_set.py [--documents 500] [--seed 11]
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))

from person_inflection_benchmark import feminine_surname, sgjp_paradigm  # noqa: E402
from polish_person_morphology import PersonMorphology  # noqa: E402

CASES = ["NOM", "GEN", "DAT", "ACC", "INS", "LOC", "VOC"]
SGJP_CASE = {"NOM": "nom", "GEN": "gen", "DAT": "dat", "ACC": "acc", "INS": "inst", "LOC": "loc", "VOC": "voc"}

# Street names that agree with the street type (adjectives) ...
ADJECTIVE_STREETS = [
    "Długa", "Krótka", "Polna", "Leśna", "Słoneczna", "Szkolna", "Ogrodowa", "Lipowa", "Łąkowa",
    "Brzozowa", "Kwiatowa", "Kościelna", "Sportowa", "Parkowa", "Zielona", "Spacerowa", "Kolejowa",
    "Wiśniowa", "Akacjowa", "Klonowa", "Dębowa", "Sosnowa", "Świerkowa", "Wrzosowa", "Różana",
    "Jaśminowa", "Makowa", "Malinowa", "Topolowa", "Cicha", "Spokojna", "Wesoła", "Jasna", "Rzeczna",
    "Wodna", "Mostowa", "Młyńska", "Kasztanowa", "Orzechowa", "Jarzębinowa", "Stawowa", "Graniczna",
    "Środkowa", "Boczna", "Wąska", "Szeroka", "Nowa", "Stara", "Poprzeczna", "Przemysłowa",
    "Fabryczna", "Handlowa", "Targowa", "Krakowska", "Warszawska", "Poznańska", "Gdańska",
    "Toruńska", "Lubelska", "Wrocławska", "Grunwaldzka", "Jagiellońska", "Piastowska", "Górna",
    "Dolna", "Wiejska", "Miejska", "Ogrodnicza", "Rolnicza", "Pogodna", "Radosna", "Letnia",
    "Zimowa", "Wiosenna", "Jesienna", "Morska", "Plażowa", "Południowa", "Północna", "Wschodnia",
    "Zachodnia", "Bukowa", "Grabowa", "Jodłowa", "Modrzewiowa", "Olszowa", "Wierzbowa", "Cisowa",
]
# ... and names in the genitive, which never change.
GENITIVE_STREETS = [
    "Mickiewicza", "Słowackiego", "Sienkiewicza", "Kościuszki", "Reymonta", "Konopnickiej", "Prusa",
    "Żeromskiego", "Chopina", "Moniuszki", "Piłsudskiego", "Kilińskiego", "Pułaskiego", "Traugutta",
    "Matejki", "Wyspiańskiego", "Kochanowskiego", "Orzeszkowej", "Norwida", "Fredry", "Staszica",
    "Kopernika", "Armii Krajowej", "Wojska Polskiego", "Powstańców Warszawskich", "Niepodległości",
    "Wolności", "Zwycięstwa", "Solidarności", "3 Maja", "11 Listopada", "Jana Pawła II",
    "Bohaterów Westerplatte", "Batorego", "Chrobrego",
]
CITIES = [
    ("00-950", "Warszawa"), ("30-001", "Kraków"), ("50-001", "Wrocław"), ("60-101", "Poznań"),
    ("80-001", "Gdańsk"), ("90-001", "Łódź"), ("20-001", "Lublin"), ("40-001", "Katowice"),
    ("70-001", "Szczecin"), ("15-001", "Białystok"), ("87-100", "Toruń"), ("35-001", "Rzeszów"),
    ("25-001", "Kielce"), ("10-001", "Olsztyn"), ("45-001", "Opole"), ("65-001", "Zielona Góra"),
    ("05-500", "Piaseczno"), ("05-800", "Pruszków"), ("33-100", "Tarnów"), ("43-300", "Bielsko-Biała"),
]
ULICA = {"NOM": "ulica", "GEN": "ulicy", "DAT": "ulicy", "ACC": "ulicę", "INS": "ulicą", "LOC": "ulicy", "VOC": "ulico"}
ALEJA = {"NOM": "aleja", "GEN": "alei", "DAT": "alei", "ACC": "aleję", "INS": "aleją", "LOC": "alei", "VOC": "alejo"}


def adjective_forms(word: str, gender: str) -> dict[str, str]:
    """Regular Polish adjective paradigm, independent of Morfeusz."""
    stem = word[:-1]
    soft = stem[-1:] in ("k", "g")
    if gender == "f":
        ej = stem + ("iej" if soft else "ej")
        if stem.endswith("i"):
            ej = stem + "ej"
        return {"NOM": word, "GEN": ej, "DAT": ej, "ACC": stem + "ą", "INS": stem + "ą", "LOC": ej, "VOC": word}
    if gender == "m3":  # plac Grunwaldzki, plac Kościelny
        base = word[:-1] + ("i" if word.endswith("i") else "")
        return {"NOM": word, "GEN": base + "ego", "DAT": base + "emu", "ACC": word,
                "INS": word[:-1] + ("im" if word.endswith("i") else "ym"),
                "LOC": word[:-1] + ("im" if word.endswith("i") else "ym"), "VOC": word}
    # osiedle Słoneczne
    i = "i" if soft else ""
    return {"NOM": word, "GEN": stem + i + "ego", "DAT": stem + i + "emu", "ACC": word,
            "INS": stem + ("im" if soft else "ym"), "LOC": stem + ("im" if soft else "ym"), "VOC": word}


def house_number(rng: random.Random) -> str:
    number = str(rng.randint(1, 180))
    roll = rng.random()
    if roll < 0.25:
        return f"{number}/{rng.randint(1, 60)}"
    if roll < 0.35:
        return number + rng.choice("ABC")
    if roll < 0.45:
        return f"{number} m. {rng.randint(1, 40)}"
    return number


def make_address(rng: random.Random) -> dict:
    kind = rng.random()
    number = house_number(rng)
    with_town = rng.random() < 0.5
    postal, city = rng.choice(CITIES)
    tail = f" {number}" + (f", {postal} {city}" if with_town else "")
    if kind < 0.6:
        # "ul. X" - the abbreviation stays, an adjective name agrees with ulica.
        if rng.random() < 0.7:
            name = rng.choice(ADJECTIVE_STREETS)
            forms = {c: f"ul. {f}{tail}" for c, f in adjective_forms(name, "f").items()}
        else:
            name = rng.choice(GENITIVE_STREETS)
            forms = {c: f"ul. {name}{tail}" for c in CASES}
    elif kind < 0.75:
        name = rng.choice(ADJECTIVE_STREETS)
        adjective = adjective_forms(name, "f")
        forms = {c: f"{ULICA[c]} {adjective[c]}{tail}" for c in CASES}
    elif kind < 0.85:
        name = rng.choice(ADJECTIVE_STREETS + GENITIVE_STREETS)
        if name in ADJECTIVE_STREETS:
            forms = {c: f"al. {f}{tail}" for c, f in adjective_forms(name, "f").items()}
        else:
            forms = {c: f"al. {name}{tail}" for c in CASES}
    elif kind < 0.93:
        name = rng.choice(["Słoneczne", "Leśne", "Zielone", "Parkowe", "Nowe", "Młodych", "Kościuszki", "Tysiąclecia"])
        if name.endswith("e"):
            forms = {c: f"os. {f}{tail}" for c, f in adjective_forms(name, "n").items()}
        else:
            forms = {c: f"os. {name}{tail}" for c in CASES}
    else:
        name = rng.choice(["Grunwaldzki", "Wolności", "Kościelny", "Rynkowy", "Zwycięstwa"])
        if name in ("Grunwaldzki", "Kościelny", "Rynkowy"):
            forms = {c: f"pl. {f}{tail}" for c, f in adjective_forms(name, "m3").items()}
        else:
            forms = {c: f"pl. {name}{tail}" for c in CASES}
    return {"forms": forms}


def invented_surname(rng: random.Random, female: bool) -> tuple[str, dict[str, str]]:
    stems = ["Zbroż", "Wąchal", "Krzemiń", "Pstrokoń", "Grzybow", "Lipiń", "Brzezin", "Dziewul",
             "Kołodziej", "Szczepań", "Wróblew", "Ostrow", "Czarnow", "Trzebiń", "Mrozow", "Kępiń"]
    stem = rng.choice(stems) + rng.choice(["", "ow", "in", "ar", "el"])
    base = stem + "ski"
    if female:
        name = base[:-1] + "a"
        s = name[:-1]
        forms = {"NOM": name, "GEN": s + "iej", "DAT": s + "iej", "ACC": s + "ą", "INS": s + "ą", "LOC": s + "iej", "VOC": name}
    else:
        name = base
        s = name[:-1]
        forms = {"NOM": name, "GEN": s + "iego", "DAT": s + "iemu", "ACC": s + "iego", "INS": s + "im", "LOC": s + "im", "VOC": name}
    return name, forms


def pesel(rng: random.Random, female: bool) -> str:
    year = rng.randint(1950, 1999)
    digits = f"{year % 100:02d}{rng.randint(1, 12):02d}{rng.randint(1, 28):02d}{rng.randint(0, 999):03d}"
    sex = rng.choice([0, 2, 4, 6, 8]) if female else rng.choice([1, 3, 5, 7, 9])
    digits += str(sex)
    weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
    check = (10 - sum(int(d) * w for d, w in zip(digits, weights)) % 10) % 10
    return digits + str(check)


def nip(rng: random.Random) -> str:
    while True:
        digits = f"{rng.randint(100, 999)}{rng.randint(0, 999999):06d}"
        check = sum(int(d) * w for d, w in zip(digits, [6, 5, 7, 2, 3, 4, 5, 6, 7])) % 11
        if check < 10:
            raw = digits + str(check)
            return f"{raw[:3]}-{raw[3:6]}-{raw[6:8]}-{raw[8:]}"


def regon(rng: random.Random) -> str:
    digits = f"{rng.randint(10000000, 99999999)}"
    check = sum(int(d) * w for d, w in zip(digits, [8, 9, 2, 3, 4, 5, 6, 7])) % 11 % 10
    return digits + str(check)


def iban(rng: random.Random) -> str:
    bban = "".join(str(rng.randint(0, 9)) for _ in range(24))
    number = int(bban + "2521" + "00")  # PL = 25 21
    check = 98 - number % 97
    raw = f"{check:02d}{bban}"
    return "PL" + raw[:2] + " " + " ".join(raw[i:i + 4] for i in range(2, 26, 4))


def id_card(rng: random.Random) -> str:
    letters = "".join(rng.choice("ABCDEFGHJKLMNPRSTUWXYZ") for _ in range(3))
    tail = "".join(str(rng.randint(0, 9)) for _ in range(5))
    values = [ord(c) - 55 for c in letters] + [int(d) for d in tail]
    weights = [7, 3, 1, 7, 3, 1, 7, 3]
    check = sum(v * w for v, w in zip(values, weights)) % 10
    return letters + str(check) + tail


def build(documents: int, seed: int, variant: str = "standard") -> dict:
    rng = random.Random(seed)
    engine = PersonMorphology().engine
    lists = json.loads((HERE / "polish-name-lists.json").read_text(encoding="utf-8"))
    male, female = [], []
    for name in lists["given"]:
        if sgjp_paradigm(engine, name, "m1", "imię"):
            male.append(name)
        elif sgjp_paradigm(engine, name, "f", "imię"):
            female.append(name)
    surnames = [s.capitalize() for s in lists["surnames"]]
    rng.shuffle(surnames)
    docs = []
    docs_people: list[dict] = []
    surname_index = 0
    for index in range(documents):
        female_person = index % 2 == 1
        gender = "f" if female_person else "m1"
        given = rng.choice(female if female_person else male)
        g_forms = sgjp_paradigm(engine, given, gender, "imię")
        invented = index % 10 == 9
        if invented:
            surname, s_gold = invented_surname(rng, female_person)
            s_forms = {SGJP_CASE[c]: {f} for c, f in s_gold.items()}
        else:
            while True:
                surname = surnames[surname_index % len(surnames)]
                surname_index += 1
                surname = feminine_surname(surname) if female_person else surname
                s_forms = sgjp_paradigm(engine, surname, gender, "nazwisko")
                if s_forms:
                    break
        person = {
            case: sorted(f"{g} {s}" for g in g_forms[SGJP_CASE[case]] for s in s_forms[SGJP_CASE[case]])
            for case in CASES
        }
        surname_alone = {case: sorted(s_forms[SGJP_CASE[case]]) for case in CASES}
        address = make_address(rng)
        ids = {
            "PESEL": pesel(rng, female_person),
            "NIP": nip(rng),
            "REGON": regon(rng),
            "IBAN": iban(rng),
            "ID_CARD": id_card(rng),
            "PHONE": f"{rng.choice([5, 6, 7, 8])}{rng.randint(0, 99):02d} {rng.randint(100, 999)} {rng.randint(100, 999)}",
            "EMAIL": f"kontakt{index}@example.pl",
        }
        city = rng.choice(CITIES)[1]
        verb = "podpisała" if female_person else "podpisał"
        living = "zamieszkała" if female_person else "zamieszkały"
        parts: list[tuple[str, str | None, str | None]] = []  # (text, kind, gold key)

        def add(text: str, kind: str | None = None, key: str | None = None) -> None:
            parts.append((text, kind, key))

        pick = lambda forms: rng.choice(forms)  # noqa: E731
        add("Sąd Rejonowy w Krakowie, I Wydział Cywilny, sygn. akt I C 1234/25.\n", "DECOY")
        add("POZEW O ZAPŁATĘ\n\nPowód: ")
        add(pick(person["NOM"]), "PERSON", "NOM")
        add(f", {living} przy ")
        add(address["forms"]["LOC"], "ADDRESS", "LOC")
        add(", PESEL: ")
        add(ids["PESEL"], "PESEL")
        add(", dowód osobisty ")
        add(ids["ID_CARD"], "ID_CARD")
        add(".\nPozwany: Bank Przykładowy S.A. z siedzibą w Warszawie, NIP ")
        add(ids["NIP"], "NIP")
        add(", REGON ")
        add(ids["REGON"], "REGON")
        add(".\nWartość przedmiotu sporu: 15 000 zł. Na podstawie art. 471 Kodeksu cywilnego wnoszę o zasądzenie na rzecz ")
        add(pick(person["GEN"]), "PERSON", "GEN")
        add(" kwoty 15 000 zł na rachunek ")
        add(ids["IBAN"], "IBAN")
        add(". Pozwany doręczył ")
        add(pick(person["DAT"]), "PERSON", "DAT")
        add(" wezwanie do zapłaty. Skarb Państwa oraz Rzecznik Praw Obywatelskich nie są stronami. Sąd wezwał ")
        add(pick(person["ACC"]), "PERSON", "ACC")
        add(" do uzupełnienia braków. Z ")
        add(pick(person["INS"]), "PERSON", "INS")
        add(" kontaktowano się pod numerem tel. ")
        add(ids["PHONE"], "PHONE")
        add(" oraz e-mail ")
        add(ids["EMAIL"], "EMAIL")
        add(". O ")
        add(pick(person["LOC"]), "PERSON", "LOC")
        add(" wspomniano w piśmie z dnia 3 maja 2025 r. ")
        add(pick(surname_alone["NOM"]), "PERSON", "SURNAME")
        add(f" {verb} pełnomocnictwo. Adres do doręczeń: ")
        add(address["forms"]["NOM"], "ADDRESS", "NOM")
        add(". Mieszkańcy ")
        add(address["forms"]["GEN"], "ADDRESS", "GEN")
        add(f" potwierdzili. Pismo złożono w sekretariacie sądu przy ulicy Mickiewicza w mieście {city}. Ustawa z dnia 23 kwietnia 1964 r. Kodeks cywilny (Dz.U. 2025 poz. 1071).\n")
        if variant == "stress":
            parts.clear()
            other = rng.choice(docs_people) if docs_people else None
            upper = rng.random() < 0.3
            add("Maj 2024 był dla kancelarii pracowity. W dniu 12 marca 2024 r. zgłosiła się sprawa, w której ")
            add(pick(person["NOM"]).upper() if upper else pick(person["NOM"]), "PERSON", "NOM_UPPER" if upper else "NOM")
            add(" wskazał(a), że lokal przy ")
            add(address["forms"]["LOC"], "ADDRESS", "LOC")
            add(" zajmuje bez tytułu prawnego. Szpital im. Jana Pawła II w Krakowie wystawił zaświadczenie.", None)
            add(" Urząd Miasta Krakowa, Trybunał Konstytucyjny i Polska Grupa Energetyczna S.A. nie brały udziału w sprawie.", None)
            if other:
                add(" Według ")
                add(rng.choice(other["GEN"]), "PERSON", "OTHER")
                add(" sprawa jest przedawniona, a ")
                add(pick(person["DAT"]), "PERSON", "DAT")
                add(" nie przysługuje roszczenie.")
            add(" Zgodnie z Kodeksem postępowania cywilnego (Dz.U. 2024 poz. 1568) oraz orzeczeniem sygn. II CSK 45/24 wezwano ")
            add(pick(person["ACC"]), "PERSON", "ACC")
            add(" do zapłaty 123456789 zł tytułem faktury nr 2024/03/15. Rozmowa z ")
            add(pick(person["INS"]), "PERSON", "INS")
            add(" odbyła się w Nowym Sączu przy ulicy Mickiewicza. Korespondencję kierować na adres: ")
            add(address["forms"]["NOM"], "ADDRESS", "NOM")
            add(". Adam Mickiewicz w „Panu Tadeuszu” opisał podobny spór o zamek.", None)
            add(" Nr PESEL ")
            add(ids["PESEL"], "PESEL")
            add(", konto ")
            add(ids["IBAN"].replace(" ", ""), "IBAN")
            add(".")
        docs_people.append(person)
        text = ""
        mentions = []
        for chunk, kind, key in parts:
            if kind:
                mentions.append({"start": len(text), "end": len(text) + len(chunk), "kind": kind, "key": key, "text": chunk})
            text += chunk
        docs.append({
            "text": text,
            "mentions": mentions,
            "person": {"forms": person, "gender": gender, "invented": invented},
            "address": {"forms": address["forms"]},
        })
    return {"seed": seed, "variant": variant, "documents": docs}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--documents", type=int, default=500)
    parser.add_argument("--seed", type=int, default=11)
    parser.add_argument("--variant", choices=["standard", "stress"], default="standard")
    parser.add_argument("--output", default=str(HERE / "privacy-audit-set.json"))
    args = parser.parse_args()
    data = build(args.documents, args.seed, args.variant)
    Path(args.output).write_text(json.dumps(data, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"documents={len(data['documents'])} -> {args.output}")


if __name__ == "__main__":
    main()
