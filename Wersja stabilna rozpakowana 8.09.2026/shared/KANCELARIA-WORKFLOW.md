# KANCELARIA-WORKFLOW — workflow kancelaryjny w granicach `.md skills`

## 1. Zakres możliwy bez backendu

Można wdrożyć:

- routing spraw,
- intake,
- kwalifikację trybu,
- checklisty formalne,
- matryce dowodowe,
- ocenę ryzyka,
- strategię,
- generator pism,
- kontrolę jakości,
- raport klienta,
- raport sytuacyjny,
- rejestr braków i zadań.

Nie można wiarygodnie wdrożyć wyłącznie w `.md`:

- automatycznego DMS,
- automatycznej aktualizacji przepisów,
- pełnego kalendarza sądowego,
- OCR,
- walidacji podpisów,
- pobierania akt z portali,
- automatycznej kontroli ePUAP / Portalu Informacyjnego.

## 2. Sekwencja kancelaryjna

```text
1. Router sprawy
2. Intake i braki danych
3. Ustalenie trybu
4. Terminy i opłaty
5. Fakty i chronologia
6. Dowody
7. Roszczenia / zarzuty
8. Ryzyka
9. Strategia
10. Projekt pisma
11. Formal-check
12. Quality-check
13. Raport dla klienta / raport sytuacyjny
```

## 3. Zasada współdzielenia

Każdy moduł używany przez więcej niż jeden skill musi znajdować się w `shared`. Lokalne pliki mogą być tylko adapterami specyficznymi dla danego skilla.
