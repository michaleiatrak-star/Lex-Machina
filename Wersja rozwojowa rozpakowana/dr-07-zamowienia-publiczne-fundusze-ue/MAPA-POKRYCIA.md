# DR-07 — Mapa Pokrycia Treściowego

**Utworzona:** 2026-08-22 (F-83, zasilenie z `audyt-systemu-v4/references/
raporty-pokrycia-2026-08-13/`) | **Format ustalony przez F-83.**

## Cel i różnica względem MAPA-AKTOW.md

`MAPA-AKTOW.md` (ten sam katalog) odpowiada na pytanie "**który moduł
odpowiada za który akt prawny**" — rejestr akt→moduł.

Ten plik odpowiada na inne pytanie: "**które konkretne działy/rozdziały/
zakresy artykułów danego aktu są rzeczywiście opracowane treściowo, a
które są lukami**". Kluczowy mechanizm przy nowelizacji: pokazuje od razu,
czy dotknięty fragment ma już treść do zaktualizowania, czy to obszar
dotąd nieopracowany.

## Legenda statusu

| Symbol | Znaczenie |
|---|---|
| 🟢 | Pełne/dobrze pokryte — rzeczywista, praktycznie użyteczna treść |
| 🟡 | Częściowe pokrycie — część artykułów opracowana, część brakuje |
| 🔴 | Brak — zero treści merytorycznej, brak dedykowanego pliku dla tego zakresu |
| 🟣 | MODUŁ-WIDMO — plik istnieje, ale jest generyczny/szablonowy, bez rzeczywistej treści danego aktu; wymaga przepisania od podstaw, nie punktowej rozbudowy |
| ⚪ | Nie dotyczy (przepis techniczny/końcowy) |

⚠️ Ten rejestr opisuje ILOŚĆ i ZAKRES treści, nie jej AKTUALNOŚĆ prawną.
Każdy przepis nadal wymaga weryfikacji ISAP przed użyciem (HARD GATE).

---

## Prawo zamówień publicznych (PZP)

**Stan prawny bazowy:** Dz.U. 2026 poz. 793 t.j.
**Data ostatniej weryfikacji treści:** 2026-08-22 (⛔ NAPRAWIONE — piąta
naprawa tego typu w tej sesji; DWA nowe moduły powstały 22.08 i nie były
znane poprzedniej wersji zbudowanej dzień wcześniej)
**Moduły:** DZIESIĘĆ modułów dedykowanych (osiem oryginalnych +
`mod-PZP-dzial-II-kwalifikacja-kryteria-uniewaznienie.md`,
`mod-PZP-otwarcie-badanie-ofert-przebieg-KIO.md`)

⭐ **Był już drugim najlepiej pokrytym aktem w audycie źródłowym — po
naprawie jest jeszcze lepszy.** Dawna największa liczbowo luka (Dział II,
183 artykuły, "sam rdzeń klasycznego postępowania bez systematycznej
treści") jest dziś w większości opracowana. **Brak modułów-widm** —
wszystkie dziesięć plików ma realną, specyficzną dla PZP treść.

| Dział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| I, Rozdz. 1, Odd. 1 | Zakres spraw regulowanych ustawą | 1–8 | 🟡 | `mod-PZP-dzial-I-podstawy-wylaczenia-szacowanie` — art. 2 (rodzaje zamawiających) |
| I, Rozdz. 1, Odd. 2 | **Wyłączenia stosowania przepisów ustawy** | 9–15 | 🟢 | Ten sam moduł — sekcja "pierwsze pytanie w każdej sprawie", katalog najważniejszych wyłączeń |
| I, Rozdz. 2 | Zasady udzielania zamówień | 16–20 | 🟢 | Art. 16 (zasady ogólne) w module Działu I |
| I, Rozdz. 3 | Polityka zakupowa państwa, plan postępowań | 21–23 | 🔴 | — |
| I, Rozdz. 4 | Zamówienia o charakterze mieszanym | 24–27 | 🔴 | — |
| I, Rozdz. 5 | **Szacowanie wartości zamówienia — zakaz dzielenia** | 28–36 | 🟢 | Sekcja dedykowana w module Działu I |
| I, Rozdz. 6, Odd. 1–2 | Zamawiający i wykonawcy, konflikt interesów | 37–60 | 🟡 | Moduł Działu I, "skrócony przegląd"; **konflikt interesów (art. 56-57) opracowany szczegółowo** — osobna podsekcja z 2026-07-18 |
| I, Rozdz. 7 | Komunikacja zamawiającego z wykonawcami | 61–70 | 🔴 | Tylko pojedyncza wzmianka art. 61 |
| I, Rozdz. 8 | Dokumentowanie przebiegu postępowania | 71–82 | 🔴 | Tylko art. 71 wzmiankowany |
| II, cz. ogólna | Postępowanie klasyczne ≥ progi UE — tryby udzielania, opis przedmiotu, wykluczenie wykonawcy | 83–132, 108-110 | 🟢 | Tryby udzielania (132,135,150,152,214) w module KIO; wykluczenie wykonawcy (108-110) pełne z self-cleaningiem; opis przedmiotu/zakaz znaków towarowych (art. 99) osobny moduł |
| II, Rozdz. 2, Odd. 1-2 | **Kwalifikacja podmiotowa wykonawców** (warunki udziału, podmiotowe środki dowodowe, JEDZ) | 112-118, 124-128 | 🟢 NAPRAWIONE 2026-08-22 (znaleziona przy weryfikacji), ⭐⭐⭐ | `mod-PZP-dzial-II-kwalifikacja-kryteria-uniewaznienie.md` sekcja 1-2 — dawny "sam rdzeń klasycznego postępowania" bez treści, teraz opracowany |
| II, Rozdz. 4-5 | **Otwarcie i badanie ofert** | 218-226 | 🟢 NAPRAWIONE 2026-08-22 (znaleziona przy weryfikacji) | `mod-PZP-otwarcie-badanie-ofert-przebieg-KIO.md` Część A |
| II, Rozdz. 5 cd. | **Kryteria oceny ofert, rażąco niska cena** | 224-226, 228, 239-243 | 🟢 NAPRAWIONE 2026-08-22 | `mod-PZP-dzial-II-kwalifikacja-kryteria-uniewaznienie.md` sekcja 3 + rażąco niska cena w module KIO |
| II, Rozdz. 6 | **Unieważnienie postępowania** | 255-258 | 🟢 NAPRAWIONE 2026-08-22 | `mod-PZP-dzial-II-kwalifikacja-kryteria-uniewaznienie.md` sekcja 4 |
| II, pozostałe | Wybór najkorzystniejszej oferty poza kryteriami (formalności wyboru) | ok. 244-254, 259-265 | 🔴 | Ostatnia pozostała luka w Dziale II — sam wybór (rozstrzygnięcie, zawiadomienie o wyborze) nadal bez treści |
| III | Postępowanie klasyczne < progi UE | 266–310 | 🟡 | Tryb podstawowy z 3 wariantami (275,276,281,286,296,297) opisany; procedura krok po kroku dla podprogowych nieopracowana |
| IV | Szczególne instrumenty (umowa ramowa, DSZ, konkurs, partnerstwo innowacyjne) | 311–361 | 🔴 śladowo | Tylko wzmiankowane nazwy, bez treści proceduralnej |
| V | **Zamówienia sektorowe** | 362–394 | 🟢 | `mod-PZP-dzial-V-VI-sektorowe-obronne-infrastruktura-krytyczna` Część A — definicja zamawiającego sektorowego, zakres, wyższe progi |
| VI | **Obronność/bezpieczeństwo + infrastruktura krytyczna** | 395–430 | 🟢 | Ten sam moduł, Część B — w tym art. 131a |
| VII | **Umowa i jej wykonanie** | 431–465 | 🟢 | `mod-PZP-wykonanie-umowy-compliance` — compliance SWZ/OPZ, podwykonawstwo (462-475), zabezpieczenie (449-453); + moduł KIO: art. 450,454,455,457,459,464,465 |
| VIII | Organy właściwe (Prezes UZP, KRZP, Komitet, Rada Zamówień Publicznych) | 466–504 | 🔴 | Nieobecne jako samodzielny temat, wzmiankowane tylko przy kontroli |
| IX | **Środki ochrony prawnej** (odwołanie do KIO, dowody, rozprawa, orzeczenia, skarga do SZP, skarga kasacyjna) | 505–590 | 🟢 NAPRAWIONE 2026-08-22 (dokończone) | Moduł KIO — terminy zawite (515), wpis (519), treść odwołania (516), termin rozpoznania (544), skarga do SZP (579-580), skarga kasacyjna SN (590). **DOPEŁNIONE:** `mod-PZP-otwarcie-badanie-ofert-przebieg-KIO.md` Część B — szczegółowy przebieg postępowania odwoławczego (dowody 531-543, rozprawa 548-551, rodzaje orzeczeń Izby 552-568a), dawna ostatnia duża luka tego działu |
| X | Pozasądowe rozwiązywanie sporów (mediacja) | 591–595 | 🔴 | — |
| XI | **Kontrola udzielania zamówień** | 596–617 | 🟢 | `mod-PZP-dzial-XI-XII-kontrola-kary-UZP` — dwa rodzaje kontroli, zakres, przebieg, skutki, katalog organów (art. 596) |
| XII | **Kary pieniężne** | 618–622 | 🟢 | Ten sam moduł — wysokość kar wg wartości zamówienia, checklist reakcji |
| XIII | Przepis końcowy | 623 | ⚪ | Techniczny |

**Tematy przekrojowe (dobrze pokryte):** fundusze UE — podwójny reżim
(zasada konkurencyjności, kwalifikowalność, korekty/"taryfikator") 🟢;
certyfikacja wykonawców (nowa instytucja, Dz.U. 2025 poz. 1235, od 12.07.2026)
🟢; progi wartości zamówień (aktualizowana tabela 2026-2027) 🟢; zdalne
rozprawy przed KIO 🟢.

**Zaktualizowana rekomendowana kolejność uzupełniania:**
1. ~~Dział II — kwalifikacja podmiotowa, otwarcie/badanie ofert, kryteria oceny, unieważnienie~~ ✅ NAPRAWIONE 2026-08-22 (poza wyborem oferty poza kryteriami — pozostaje mała luka)
2. ~~Dział IX dokończenie — przebieg postępowania odwoławczego przed KIO~~ ✅ NAPRAWIONE 2026-08-22
3. **Dział IV — szczególne instrumenty (umowa ramowa, DSZ, konkurs, partnerstwo innowacyjne)** — następny w kolejności
4. Dział III — pełna procedura postępowań podprogowych (266-310)
5. Dział VIII — organy właściwe (Prezes UZP, KRZP, Rada Zamówień Publicznych)
6. Dział I, Rozdz. 7-8 — komunikacja i dokumentowanie postępowania
7. Dział X — pozasądowe rozwiązywanie sporów

---

## Akty NIE objęte tym rejestrem (brak materiału źródłowego)

Ten skill (dr-07) może obejmować też inne akty związane z funduszami UE i
pomocą publiczną poza samym PZP — audyt źródłowy z 2026-08-13 objął w tym
skillu wyłącznie PZP. Pozostałe ewentualne akty NIE mają dotąd
odpowiadającego raportu pokrycia w tym rejestrze.
