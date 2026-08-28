---
module: ustawa-SN-sad-najwyzszy
version: "1.1"
verified_on: "2026-08-28"
coverage: "B+/COV — aktualna mapa ustawy i routing ustrojowo-procesowy"
source_policy: "RZĄD 1 only"
---

# Ustawa o Sądzie Najwyższym — current-state COV

## Źródło

Ustawa z 8 grudnia 2017 r. o Sądzie Najwyższym.  
**Tekst jednolity:** Dz.U. 2024 poz. 622; status ELI: obowiązujący; stan prawny tekstu jednolitego 27.03.2024.

RZĄD 1: https://eli.gov.pl/eli/DU/2024/622/ogl

ELI wskazuje zmiany po tekście jednolitym. Przed użyciem konkretnej jednostki pobierz aktualny tekst ujednolicony i sprawdź datę wejścia w życie każdej późniejszej zmiany. Przepisów przyszłych nie stosuj przed ich wejściem w życie.

## Struktura bieżąca

| Rozdział | Zakres | Status |
|---|---|---|
| 1 | przepisy ogólne i zadania Sądu Najwyższego | B+/COV |
| 2 | organy Sądu Najwyższego | B+/COV |
| 2a | sędziowie w Izbie Odpowiedzialności Zawodowej | B+/COV |
| 3 | właściwość izb | B+/COV |
| 4 | stosunek służbowy sędziego Sądu Najwyższego | B+/COV |
| 5 | obowiązki i prawa sędziego Sądu Najwyższego | B+/COV |
| 6 | ławnicy Sądu Najwyższego | B+/COV |
| 7 | odpowiedzialność dyscyplinarna | B+/COV |
| 8 | postępowanie przed Sądem Najwyższym | B+/COV |
| 9 | Kancelaria Pierwszego Prezesa SN i Biuro Studiów i Analiz SN | B+/COV |
| przepisy zmieniające, przejściowe i końcowe | temporal gate | nie używać jako prawa bieżącego bez sprawdzenia daty |

## Runtime

Dla każdej sprawy ustal osobno:
1. zadanie lub kompetencję Sądu Najwyższego;
2. właściwą izbę i organ;
3. status osoby, jeżeli sprawa dotyczy sędziego lub ławnika;
4. podstawę proceduralną konkretnego środka w KPC, KPK albo innej właściwej ustawie;
5. stan ustawy o SN na datę czynności.

Ustawa o SN nie zastępuje kodeksu proceduralnego przy badaniu dopuszczalności skargi kasacyjnej, kasacji, skargi nadzwyczajnej ani innego środka.

## Dyscyplinarne

Sprawa dyscyplinarna wymaga równoległego sprawdzenia Rozdziału 2a i 7, przepisów ustrojowych właściwego zawodu lub urzędu oraz aktualnej właściwości Izby Odpowiedzialności Zawodowej.

## Quality gate

- [ ] pobrano aktualny tekst ELI i późniejsze zmiany;
- [ ] wskazano właściwą izbę z aktualnego Rozdziału 3;
- [ ] środek procesowy sprawdzono w właściwym kodeksie;
- [ ] oddzielono przepisy obowiązujące od przyszłych/przejściowych;
- [ ] orzeczenia i sygnatury zweryfikowano w źródle urzędowym;
- [ ] nie nadano statusu FULL bez audytu artykuł-po-artykule.
