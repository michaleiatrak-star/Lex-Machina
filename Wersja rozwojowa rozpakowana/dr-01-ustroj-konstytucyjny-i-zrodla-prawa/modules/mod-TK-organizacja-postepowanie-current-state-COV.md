---
module: TK-organizacja-postepowanie-current-state-COV
version: "1.0"
verified_on: "2026-08-28"
coverage: "B+/COV — pełna mapa Działów I–III i 10 rozdziałów procesowych Działu II"
source_policy: "RZĄD 1 only"
---

# Organizacja i tryb postępowania przed Trybunałem Konstytucyjnym — current-state COV

## Źródło kanoniczne

Ustawa z 30 listopada 2016 r. o organizacji i trybie postępowania przed Trybunałem Konstytucyjnym.

**Tekst jednolity:** Dz.U. 2019 poz. 2393.  
**Status ELI sprawdzony 2026-08-28:** obowiązujący.

RZĄD 1:
- https://eli.gov.pl/eli/DU/2019/2393/ogl
- https://api.sejm.gov.pl/eli/acts/DU/2019/2393/text.html

Tekst jednolity ogłoszono według stanu prawnego na 13.11.2019. Przed zastosowaniem konkretnej jednostki zawsze sprawdź w ELI późniejsze akty zmieniające i aktualne brzmienie przepisu.

## Mapa aktu

| Dział / rozdział | Zakres | Routing |
|---|---|---|
| Dział I, rozdz. 1 | przepisy ogólne | pozycja TK, skład, relacja do odrębnej ustawy o statusie sędziów TK |
| Dział I, rozdz. 2 | organy Trybunału | właściwość organu i kompetencja ustrojowa |
| Dział I, rozdz. 3 | Kancelaria TK i Biuro Służby Prawnej TK | obsługa organizacyjna |
| Dział II, rozdz. 1 | przepisy ogólne postępowania | kwalifikacja rodzaju sprawy + Konstytucja |
| Dział II, rozdz. 2 | składy orzekające | dobór składu wyłącznie z aktualnego przepisu |
| Dział II, rozdz. 3 | wyłączenie sędziego TK | przesłanki i tryb wyłączenia |
| Dział II, rozdz. 4 | uczestnicy postępowania | ustalenie uczestników dla konkretnego trybu |
| Dział II, rozdz. 5 | pisma procesowe | wymogi pisma + wymogi szczególne właściwego środka |
| Dział II, rozdz. 6 | koszty postępowania | aktualny przepis, bez wartości z pamięci |
| Dział II, rozdz. 7 | przebieg postępowania | badanie wstępne, przygotowanie i tok sprawy według aktualnej jednostki |
| Dział II, rozdz. 8 | przepisy szczególne | aktywować zależnie od rodzaju kompetencji TK |
| Dział II, rozdz. 9 | rozprawy i posiedzenia | forma rozpoznania, jawność i czynności procesowe z aktualnego przepisu |
| Dział II, rozdz. 10 | orzeczenia Trybunału | rodzaj rozstrzygnięcia, ogłoszenie i skutki łącznie z Konstytucją |
| Dział III | przepis końcowy | kontrola temporalna |

## Kwalifikator wejścia

Przed zastosowaniem procedury ustal, z jakiej kompetencji TK wynika sprawa:

```text
□ kontrola hierarchiczna norm
□ skarga konstytucyjna
□ pytanie prawne sądu
□ spór kompetencyjny
□ zgodność z Konstytucją celów lub działalności partii politycznych
□ przeszkoda w sprawowaniu urzędu przez Prezydenta RP
□ inna kompetencja ustawowa TK
```

Najpierw ustal podstawę konstytucyjną i legitymację, dopiero potem stosuj przepisy proceduralne tej ustawy.

## Rozgraniczenie z innymi modułami

- Konstytucja, skarga konstytucyjna i standard kontroli → `mod-Konstytucja-TK-skarga-konstytucyjna.md`;
- status sędziego TK → odrębna ustawa ustrojowa/statusowa, jeżeli zagadnienie tego wymaga;
- partie polityczne → `mod-partie-polityczne-current-state-COV.md` + Konstytucja;
- procedura sądowa będąca źródłem pytania prawnego → właściwy KPC/KPK/PPSA/KPW;
- publikacja orzeczenia i skutek derogacyjny → Konstytucja + aktualne przepisy o ogłaszaniu aktów normatywnych.

## Fresh gate

Przed podaniem terminu, wymogu formalnego, składu, uczestnika, dopuszczalności środka albo skutku orzeczenia:
1. pobierz aktualne brzmienie właściwej jednostki z ELI/ISAP;
2. sprawdź podstawę konstytucyjną;
3. ustal właściwy tryb i legitymację;
4. oddziel obowiązujące prawo od projektu lub przyszłej zmiany.

## Status

**B+/COV.** Cała aktualna struktura aktu jest jawnie zmapowana i ma routing operacyjny. Status nie oznacza `FULL` artykuł-po-artykule.