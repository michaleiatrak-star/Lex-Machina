---
name: MOD-ADMIN
description: |
  Moduł pism w postępowaniach administracyjnych i sądowoadministracyjnych.
  Stosuj ZAWSZE gdy użytkownik chce sporządzić: wniosek do organu, odwołanie od decyzji,
  zażalenie na postanowienie, ponaglenie, skargę na bezczynność/przewlekłość,
  skargę do WSA, skargę kasacyjną do NSA, wniosek o wznowienie, nieważność,
  uchylenie/zmianę decyzji, wniosek dowodowy, wgląd do akt, uzupełnienie braków.
compatibility:
  tools: [web_search, web_fetch]
---

# MOD-ADMIN — Pisma Administracyjne / KPA / PPSA

## KIEDY ŁADOWAĆ

Ładuj oprócz `MOD-PRAWO`, `MOD-DOWODY`, `MOD-WALIDACJA`, a przy obszernych aktach także `MOD-ETAPY`.

## MAPA PISM

| Pismo | Podstawa/tryb | Termin kontrolny | Cel |
|---|---|---|---|
| Wniosek wszczynający | KPA / ustawa szczególna | zależy od sprawy | uruchomienie postępowania |
| Uzupełnienie braków | wezwanie organu | termin z wezwania | uniknięcie pozostawienia bez rozpoznania |
| Wniosek dowodowy | KPA | przed decyzją | wykazanie faktów |
| Wgląd do akt | KPA | w toku sprawy | kontrola materiału dowodowego |
| Odwołanie od decyzji | KPA art. 127 i n. | co do zasady 14 dni | kontrola instancyjna |
| Zażalenie | KPA / ustawa szczególna | zwykle 7 dni, weryfikuj | kontrola postanowienia |
| Ponaglenie | KPA art. 37 | po bezczynności/przewlekłości | warunek skargi do WSA |
| Skarga do WSA | PPSA | co do zasady 30 dni | kontrola legalności |
| Skarga na bezczynność | PPSA | po ponagleniu, bez klasycznego 30-dniowego rygoru w wielu sprawach — weryfikuj | zobowiązanie organu |
| Wznowienie | KPA art. 145 i n. | zwykle 1 miesiąc od dowiedzenia się o przesłance | ponowne rozpoznanie |
| Nieważność | KPA art. 156 | limity 10/30 lat | eliminacja decyzji kwalifikowanie wadliwej |

> ⚠ Terminy zawsze weryfikuj w ustawie szczególnej. Niektóre postępowania mają odrębne terminy i organy.

## ETAPY PRACY NAD PISMEM ADMINISTRACYJNYM

```
ETAP 1 — identyfikacja aktu/czynności organu
ETAP 2 — właściwy środek prawny i termin
ETAP 3 — rekonstrukcja stanu faktycznego z akt
ETAP 4 — zarzuty proceduralne KPA/PPSA
ETAP 5 — zarzuty materialnoprawne
ETAP 6 — wnioski dowodowe / wniosek o wstrzymanie wykonania
ETAP 7 — projekt pisma
ETAP 8 — audyt formalny: adresat, podpis, załączniki, odpisy, termin
ETAP 9 — audyt merytoryczny: zarzuty, dowody, ryzyka, kontrargumenty organu
```

## SZABLON — ODWOŁANIE OD DECYZJI

```
[Miejscowość], dnia [data]

[Organ II instancji]
za pośrednictwem:
[Organ I instancji]

Strona: [dane]
Sygn./znak sprawy: [znak]

ODWOŁANIE OD DECYZJI

Działając jako strona postępowania, wnoszę odwołanie od decyzji [organ] z dnia [data], znak [znak], doręczonej dnia [data].

Wnoszę o:
1. uchylenie decyzji w całości i orzeczenie co do istoty sprawy poprzez [żądanie], ewentualnie
2. uchylenie decyzji w całości i przekazanie sprawy organowi I instancji do ponownego rozpoznania,
3. przeprowadzenie dowodów wskazanych w niniejszym odwołaniu,
4. [opcjonalnie] wstrzymanie wykonania decyzji.

Zarzuty:
1. naruszenie przepisów postępowania, tj. [przepis], przez [opis], co miało istotny wpływ na wynik sprawy;
2. naruszenie prawa materialnego, tj. [przepis], przez błędną wykładnię/niewłaściwe zastosowanie;
3. błąd w ustaleniach faktycznych polegający na [opis].

Uzasadnienie:
I. Stan faktyczny
II. Naruszenia proceduralne
III. Naruszenia prawa materialnego
IV. Wnioski dowodowe
V. Wniosek końcowy

Załączniki: [lista]
[podpis]
```

## SZABLON — PONAGLENIE

```
PONAGLENIE

Na podstawie art. 37 KPA wnoszę ponaglenie z powodu [bezczynności / przewlekłego prowadzenia postępowania] przez [organ] w sprawie [opis].

Uzasadnienie:
1. Wniosek został złożony dnia [data].
2. Ustawowy/wyznaczony termin załatwienia sprawy upłynął dnia [data].
3. Organ nie wydał rozstrzygnięcia / prowadzi sprawę w sposób przewlekły, ponieważ [opis].

Wnoszę o:
1. stwierdzenie bezczynności/przewlekłości,
2. zobowiązanie organu do załatwienia sprawy w wyznaczonym terminie,
3. wyjaśnienie przyczyn i ustalenie osób odpowiedzialnych, jeżeli zachodzą podstawy.
```

## SZABLON — SKARGA DO WSA

```
[WSA właściwy]
za pośrednictwem:
[organ]

SKARGA NA DECYZJĘ / POSTANOWIENIE

Zaskarżam [decyzję/postanowienie] [organ] z dnia [data], znak [znak], doręczone dnia [data].

Wnoszę o:
1. uchylenie zaskarżonego aktu w całości,
2. [opcjonalnie] wstrzymanie wykonania aktu,
3. zasądzenie kosztów postępowania,
4. przeprowadzenie dowodów z dokumentów wskazanych w uzasadnieniu.

Zarzuty:
1. naruszenie prawa materialnego przez błędną wykładnię/niewłaściwe zastosowanie;
2. naruszenie przepisów postępowania, jeżeli mogło mieć istotny wpływ na wynik sprawy;
3. błąd w ustaleniach faktycznych wynikający z wadliwej oceny materiału dowodowego.

Uzasadnienie:
I. Dopuszczalność i terminowość skargi
II. Stan sprawy
III. Zarzuty proceduralne
IV. Zarzuty materialnoprawne
V. Wniosek o wstrzymanie wykonania — jeśli składany
```

## AUDYT ADMINISTRACYJNY

Przed finałem sprawdź:

```
□ Czy pismo idzie do właściwego organu i za pośrednictwem właściwego organu?
□ Czy termin liczony jest od doręczenia, a nie od daty wydania?
□ Czy jest dowód doręczenia?
□ Czy wskazano znak sprawy?
□ Czy żądanie odpowiada kompetencjom organu?
□ Czy zarzuty proceduralne mają wpływ na wynik sprawy?
□ Czy powołano właściwą ustawę szczególną?
□ Czy załączono odpisy i pełnomocnictwo, jeśli potrzebne?
```
