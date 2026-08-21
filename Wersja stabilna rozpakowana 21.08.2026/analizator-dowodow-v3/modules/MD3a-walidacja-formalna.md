# MD3a — Walidacja formalna

## KROK 0 — SKAN BŁĘDÓW DAT I NAZW (przed analizą merytoryczną)

Przed przystąpieniem do oceny treści dokumentów wykonaj szybki skan oczywistych
błędów pisarskich w datach i nazwach własnych, które mogłyby zostać przypadkowo
przeniesione do analizy lub pisma:

```
[ ] Czy w dokumencie występują daty z rokiem przyszłym względem daty samego pisma
    lub pozostałych dokumentów (np. pismo z 2025 r. odnosi się do "9.10.2025"
    podczas gdy z kontekstu wynika 2024 r.)? → odnotuj jako PRAWDOPODOBNY BŁĄD
    PISARSKI, nie jako nowe zdarzenie; przyjmij datę wynikającą z kontekstu, ale
    zaznacz obie wersje.
[ ] Czy to samo imię/nazwisko/nazwa występuje w różnych zapisach w różnych
    dokumentach lub fragmentach (literówki, OCR, inna osoba)? → odnotuj do MD3c
    jako kandydat [DOUBT][IDENT] / [CROSS][IDENT], nie poprawiaj automatycznie.
```

Wynik tego skanu raportuj na początku analizy jako krótką sekcję
"Uwagi do materiału przed analizą" — to zapobiega błędnemu cytowaniu dat lub
nazw w dalszej części i w ewentualnym piśmie procesowym.

---

## Lista kontrolna

```
□ ORYGINAŁ vs KOPIA niepoświadczona → art. 129 §1 KPC
□ CIĄGŁOŚĆ stron / parafowanie wielostronicowych
□ METADANE: data modyfikacji ≠ data dokumentu → ryzyko antydatowania
□ TŁUMACZENIE PRZYSIĘGŁE dla dokumentów obcojęzycznych → art. 256 KPC
□ PIECZĘCIE / SYGNATURY urzędowe (brak = obniżenie z A do B)
□ PODPIS osoby uprawnionej + pieczęć imienna
□ KOMPLETNOŚĆ: brak stron, brak załączników wymienionych w treści
□ PAGINACJA: brak ciągłości numerowania stron
```

## Format alertu

```
[⚠ FORMAL-N] DOWÓD: [nazwa]
Problem: [uchybienie] · Ryzyko: [działanie strony przeciwnej]
Rekomendacja: [jak naprawić] · Podstawa: [art. X ustawy Y]
Pilność: KRYTYCZNE / OSTRZEGAWCZE
```
