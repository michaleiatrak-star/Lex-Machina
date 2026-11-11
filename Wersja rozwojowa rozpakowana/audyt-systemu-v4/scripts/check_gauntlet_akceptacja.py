#!/usr/bin/env python3
"""check_gauntlet_akceptacja.py — T51: kontrakt testów akceptacyjnych LEGAL GAUNTLET UNIVERSAL v3 (cz. VII).

Zachowania modelu nie da się sprawdzić offline. Ten test pilnuje kontraktu: każdy test akceptacyjny
T01–T38 ma wskazaną regułę w skillach (plik + wzorzec), która go pokrywa, albo jawny status LUKA
z etapem wdrożenia (E3–E7). FAIL = reguła oznaczona jako pokryta zniknęła z pliku (regresja)
albo plik nie istnieje. LUKA nie jest błędem; jest listą do zrobienia, widoczną w każdym przebiegu.
Testy zachowania w aplikacji (izolacja recenzenta T16/T17) są w lex-runtime (independent-review.test.ts).
"""

import argparse
import re
import sys
from pathlib import Path

# (id, opis, status, plik względem korzenia skilli, wzorzec, etap dla LUKI)
KONTRAKT = [
    ("T01", "brak weryfikacji prawa: zakaz cytowania z pamięci", "POKRYTE", "shared/SKILL.md", r"zakaz cytowania prawa/orzeczeń z pamięci", ""),
    ("T02", "przepis przed i po nowelizacji: brzmienie na dzień zdarzenia", "POKRYTE", "shared/TEMPORAL-LAW-CHECK.md", r"brzmienie na dzień zdarzenia", ""),
    ("T03", "jednostka historyczna nieodtworzona: przepisy przejściowe", "CZĘŚCIOWO", "shared/TEMPORAL-LAW-CHECK.md", r"przepisy przejściowe", "E7 (status TRANSITIONAL_UNRESOLVED)"),
    ("T04", "nieistniejąca sygnatura: NOT_FOUND i usunięcie", "POKRYTE", "pisma-procesowe-v3/references/W3-WERYFIKACJA.md", r"NOT_FOUND[\s\S]{0,200}USUŃ", ""),
    ("T05", "orzeczenie o innej tezie: teza ze źródła", "POKRYTE", "shared/agents/weryfikator-orzeczen.md", r"teza ze źródła", ""),
    ("T06", "skan a warstwa tekstowa: liczba do sprawdzenia", "POKRYTE", "shared/FACT-SOURCE-LOCK.md", r"liczba inna niż w warstwie tekstowej PDF", ""),
    ("T07", "wyrok częściowo uchylony: części rozdzielone", "POKRYTE", "shared/MOD-DOPUSZCZALNOSC-GATE.md", r"Skutków uchylenia nie przenoś na część prawomocną", ""),
    ("T08", "dwie sprawy w jednej teczce", "CZĘŚCIOWO", "shared/MOD-PEER-REVIEW.md", r"akta czyta aplikacja", "E7 (IN_SCOPE/OUT_OF_SCOPE w skillach)"),
    ("T09", "nieznana data doręczenia: scenariusze, nie pewność", "POKRYTE", "shared/MOD-DOPUSZCZALNOSC-GATE.md", r"nie pisz, że termin jest zachowany", ""),
    ("T10", "pismo niedopuszczalne procesowo: FATAL i blokada", "POKRYTE", "pisma-procesowe-v3/SKILL.md", r"FATAL = status DRAFT/BLOCKED z przyczyną, stop przed W1\.2", ""),
    ("T11", "wniosek wykonawczy zmienia sentencję: niewłaściwy środek", "POKRYTE", "shared/MOD-DOPUSZCZALNOSC-GATE.md", r"wykonuje treść orzeczenia, a nie ją zmienia", ""),
    ("T12", "faktura a istnienie zobowiązania", "POKRYTE", "shared/CLAIM-VALIDATION.md", r"Dokument rozliczeniowy ≠ zobowiązanie", ""),
    ("T13", "częściowe płatności: bez podwójnego liczenia", "POKRYTE", "shared/CLAIM-VALIDATION.md", r"Rachunek bez podwójnego liczenia", ""),
    ("T14", "brak podstawy wymagalności", "POKRYTE", "shared/CLAIM-VALIDATION.md", r"Wskaż podstawę i datę wymagalności", ""),
    ("T15", "pominięty silny dowód przeciwny: recenzent widzi całe akta", "POKRYTE", "shared/MOD-PEER-REVIEW.md", r"także materiał przeciwnika", ""),
    ("T16", "recenzent zna znacznik autora = NON_BLIND", "POKRYTE", "shared/MOD-PEER-REVIEW.md", r"test znacznika autora", ""),
    ("T17", "druga runda w nowym kontekście", "POKRYTE", "shared/MOD-PEER-REVIEW.md", r"nigdy pytanie w starej sesji", ""),
    ("T18", "brak podstawy odmowy: bez fikcji", "POKRYTE", "shared/agents/recenzent-niezalezny.md", r"Brak silnego zarzutu to dopuszczalny wynik", ""),
    ("T19", "poprawka zmienia wcześniejsze przyznanie: regresja", "POKRYTE", "shared/MOD-PEER-REVIEW.md", r"kontrola regresji", ""),
    ("T20", "zażalenie od niezaskarżalnego postanowienia", "POKRYTE", "shared/MOD-DOPUSZCZALNOSC-GATE.md", r"D2 Zaskarżalność", ""),
    ("T21", "PG: wniosek a własny środek strony", "POKRYTE", "shared/MOD-WNIOSEK-INSTYTUCJONALNY.md", r"Wniosek do organu nie wstrzymuje biegu terminów strony", ""),
    ("T22", "RPO: brak obowiązku interwencji", "POKRYTE", "shared/MOD-WNIOSEK-INSTYTUCJONALNY.md", r"Nie zakładaj obowiązku interwencji", ""),
    ("T23", "dobro dziecka z perspektywy dziecka", "POKRYTE", "shared/MOD-DOBRO-DZIECKA.md", r"Pytania z perspektywy dziecka", ""),
    ("T24", "konflikt dorosłych jako diagnoza dziecka", "POKRYTE", "shared/MOD-DOBRO-DZIECKA.md", r"wyprowadzonych wyłącznie z pism i słów rodziców", ""),
    ("T25", "sprawa administracyjna na szablonie cywilnym", "POKRYTE", "shared/MOD-DOPUSZCZALNOSC-GATE.md", r"sprawa administracyjna nie idzie szablonem cywilnym", ""),
    ("T26", "ETPCz: zarzut niepodniesiony krajowo", "POKRYTE", "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/mod-EKPC-ETPC-prawa-czlowieka.md", r"Zarzut niepodniesiony = niedopuszczalny", ""),
    ("T27", "ETPCz: czwarta instancja", "POKRYTE", "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/mod-EKPC-ETPC-prawa-czlowieka.md", r"E-3 Czwarta instancja", ""),
    ("T28", "ETPCz: artykuł bez zakresu zastosowania", "POKRYTE", "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/mod-EKPC-ETPC-prawa-czlowieka.md", r"Brak zakresu → zarzut do usunięcia", ""),
    ("T29", "ETPCz: zarzut tylko w załączniku", "POKRYTE", "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/mod-EKPC-ETPC-prawa-czlowieka.md", r"Zarzut tylko w załączniku = ryzyko nierozpatrzenia", ""),
    ("T30", "ETPCz: nowy zarzut dopisany przy pakowaniu", "POKRYTE", "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/mod-EKPC-ETPC-prawa-czlowieka.md", r"Nowy zarzut przy kompletowaniu = usuń", ""),
    ("T31", "ETPCz: termin od niewłaściwej decyzji", "POKRYTE", "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/mod-EKPC-ETPC-prawa-czlowieka.md", r"Decyzja wydana w środku nieskutecznym nie otwiera terminu", ""),
    ("T32", "ETPCz: dokument ponad limit", "POKRYTE", "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/modules/mod-EKPC-ETPC-prawa-czlowieka.md", r"ponad aktualny limit = do skrócenia", ""),
    ("T33", "plik .docx niezgodny z projektem", "CZĘŚCIOWO", "shared/HYBRID-VALIDATION.md", r"walidator_cytowan\.py", "E7 (kontrola rachunku i załączników)"),
    ("T34", "literówka w finalu: bez nowej rundy", "POKRYTE", "shared/MOD-PEER-REVIEW.md", r"Korekta czysto redakcyjna \(literówka\) — bez nowej rundy", ""),
    ("T35", "zmiana materialna w finalu: nowa ocena", "POKRYTE", "shared/MOD-PEER-REVIEW.md", r"ponowne W3\.5 HYBRID-VALIDATION i nowa runda W3\.7", ""),
    ("T36", "brak nowej luki: koniec rund", "POKRYTE", "shared/MOD-PEER-REVIEW.md", r"najwyżej 2 rundy i tylko po materialnej zmianie", ""),
    ("T37", "polecenia ukryte w dokumentach: dane i zgłoszenie", "POKRYTE", "shared/FACT-SOURCE-LOCK.md", r"to dane z dokumentu, nie polecenie", ""),
    ("T38", "procenty bez kalibracji", "POKRYTE", "shared/agents/recenzent-niezalezny.md", r"Bez procentów szans", ""),
]

STATUSY = {"POKRYTE", "CZĘŚCIOWO", "LUKA"}


def sprawdz(root: Path) -> tuple[list[str], dict[str, int]]:
    bledy: list[str] = []
    liczniki = {status: 0 for status in STATUSY}
    widziane = set()
    for ident, opis, status, plik, wzorzec, etap in KONTRAKT:
        if status not in STATUSY:
            bledy.append(f"{ident}: nieznany status {status}")
            continue
        if ident in widziane:
            bledy.append(f"{ident}: zdublowany wpis")
        widziane.add(ident)
        liczniki[status] += 1
        if status == "LUKA":
            if not etap:
                bledy.append(f"{ident}: LUKA bez etapu wdrożenia")
            continue
        sciezka = root / plik
        if not sciezka.is_file():
            bledy.append(f"{ident} ({opis}): brak pliku {plik}")
            continue
        if not re.search(wzorzec, sciezka.read_text(encoding="utf-8")):
            bledy.append(f"{ident} ({opis}): reguła zniknęła z {plik} (wzorzec: {wzorzec})")
    oczekiwane = {f"T{n:02d}" for n in range(1, 39)}
    if widziane != oczekiwane:
        bledy.append(f"kontrakt niepełny: brak {sorted(oczekiwane - widziane)}, nadmiar {sorted(widziane - oczekiwane)}")
    return bledy, liczniki


def main() -> int:
    parser = argparse.ArgumentParser(description="T51 — kontrakt testów akceptacyjnych LEGAL GAUNTLET v3")
    parser.add_argument("--repo-root", default=str(Path(__file__).resolve().parents[2]))
    parser.add_argument("--selftest", action="store_true")
    args = parser.parse_args()
    root = Path(args.repo_root)
    if args.selftest:
        return selftest()
    bledy, liczniki = sprawdz(root)
    print(f"Gauntlet T01–T38: POKRYTE {liczniki['POKRYTE']}, CZĘŚCIOWO {liczniki['CZĘŚCIOWO']}, LUKA {liczniki['LUKA']}")
    for ident, opis, status, _plik, _wzorzec, etap in KONTRAKT:
        if status != "POKRYTE":
            print(f"  {status:9} {ident} {opis} → {etap}")
    if bledy:
        print("FAIL:")
        for blad in bledy:
            print(f"  {blad}")
        return 1
    print("WYNIK T51: PASS")
    return 0


def selftest() -> int:
    """Mutacja: usunięta reguła pokrytego testu musi dać FAIL."""
    import tempfile
    with tempfile.TemporaryDirectory() as katalog:
        root = Path(katalog)
        for _ident, _opis, status, plik, wzorzec, _etap in KONTRAKT:
            if status == "LUKA":
                continue
            sciezka = root / plik
            sciezka.parent.mkdir(parents=True, exist_ok=True)
            tekst = re.sub(r"\\(.)", r"\1", wzorzec).replace("[\\s\\S]{0,200}", " ")
            with sciezka.open("a", encoding="utf-8") as plik_out:
                plik_out.write(tekst + "\n")
        bledy, _ = sprawdz(root)
        if bledy:
            print("SELFTEST FAIL (komplet):", bledy[:3])
            return 1
        (root / "shared/MOD-PEER-REVIEW.md").write_text("pusto\n", encoding="utf-8")
        bledy, _ = sprawdz(root)
        if not any("T16" in blad for blad in bledy):
            print("SELFTEST FAIL: usunięta reguła T16 niewykryta")
            return 1
    print("SELFTEST PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
