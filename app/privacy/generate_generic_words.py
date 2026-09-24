"""Regenerates generic_words.json: every case form of nouns that head an
institution name ("Bank Millennium", "Rada Gminy") or name a party role in a
contract ("Najemca", "Pożyczkobiorca"). Several are also SGJP surnames
("Bank", "Rada", "Skarb"), so the recognizers must not read them as persons.

Run with the payload Python (Morfeusz2): python generate_generic_words.py
"""

import json
from pathlib import Path

import morfeusz2

INSTITUTIONS = """
bank sąd trybunał spółka spółdzielnia skarb urząd gmina powiat województwo miasto prokuratura
kancelaria fundacja stowarzyszenie towarzystwo zakład szpital firma biuro przedsiębiorstwo
ministerstwo agencja instytut uniwersytet politechnika akademia szkoła przedszkole parafia kościół
wspólnota fundusz kasa izba komenda policja straż inspektorat inspekcja zarząd rada sejm senat kuria
klinika centrum ośrodek hurtownia sklep apteka hotel grupa holding koncern korporacja poczta kolej
teatr muzeum biblioteka związek partia klub komitet samorząd starostwo kuratorium oddział filia
departament wydział zespół konsorcjum przychodnia huta kopalnia elektrownia stocznia fabryka
drukarnia wydawnictwo redakcja telewizja radio ubezpieczyciel operator
""".split()

PARTY_ROLES = """
pożyczkodawca pożyczkobiorca kredytobiorca kredytodawca wynajmujący najemca wydzierżawiający
dzierżawca sprzedający sprzedawca kupujący zamawiający wykonawca zleceniodawca zleceniobiorca
pracodawca pracownik ubezpieczony ubezpieczający leasingodawca leasingobiorca usługodawca
usługobiorca dostawca odbiorca inwestor deweloper nabywca zbywca darczyńca obdarowany poręczyciel
cedent cesjonariusz spadkodawca spadkobierca zastawca zastawnik przewoźnik agent franczyzodawca
franczyzobiorca licencjodawca licencjobiorca administrator podmiot pełnomocnik mocodawca klient
konsument strona użyczający biorący przyjmujący dający zobowiązany uprawniony
wierzyciel wierzycielka dłużnik dłużniczka powód powódka pozwany wnioskodawca wnioskodawczyni
uczestnik uczestniczka skarżący oskarżyciel pokrzywdzony poszkodowany oskarżony podejrzany obwiniony
interwenient kurator opiekun spadkobierczyni najemczyni pożyczkobiorczyni kredytobiorczyni
pracownica zleceniobiorczyni nabywczyni sprzedawczyni darczyńczyni poręczycielka
""".split()

# Before these a capitalized word is a person even if it is a generic noun ("pani Rada").
PERSON_ONLY_TRIGGERS = """
pan pani państwo świadek adwokat radca mecenas sędzia prokurator notariusz komornik
syn córka żona mąż ojciec matka brat siostra
""".split()


def is_given_name(analyzer: morfeusz2.Morfeusz, word: str) -> bool:
    return any("imię" in item[2][3] for item in analyzer.analyse(word.capitalize()))


def forms(generator: morfeusz2.Morfeusz, analyzer: morfeusz2.Morfeusz, lemmas: list[str]) -> list[str]:
    out: set[str] = set()
    for lemma in lemmas:
        out.add(lemma)
        for item in generator.generate(lemma):
            out.add(item[0].lower())
    # A form that is also a given name ("Kasie") stays a possible person.
    return sorted(word for word in out if not is_given_name(analyzer, word))


def main() -> None:
    generator = morfeusz2.Morfeusz(analyse=False, generate=True)
    analyzer = morfeusz2.Morfeusz(generate=False)
    data = {
        "institutions": forms(generator, analyzer, INSTITUTIONS),
        "partyRoles": forms(generator, analyzer, PARTY_ROLES),
        "personOnlyTriggers": forms(generator, analyzer, PERSON_ONLY_TRIGGERS) + ["adw", "mec", "dr", "prof", "mgr", "inż"],
    }
    target = Path(__file__).with_name("generic_words.json")
    target.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print({key: len(value) for key, value in data.items()})


if __name__ == "__main__":
    main()
