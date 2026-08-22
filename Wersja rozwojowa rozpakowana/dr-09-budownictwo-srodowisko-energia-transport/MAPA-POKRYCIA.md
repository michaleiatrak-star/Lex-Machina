# DR-09 — Mapa Pokrycia Treściowego

**Utworzona:** 2026-08-22 (F-83, zasilenie z `audyt-systemu-v4/references/
raporty-pokrycia-2026-08-13/`) | **Format ustalony przez F-83.**

## Cel i różnica względem MAPA-AKTOW.md

`MAPA-AKTOW.md` (ten sam katalog) odpowiada na pytanie "**który moduł
odpowiada za który akt prawny**" — rejestr akt→moduł.

Ten plik odpowiada na inne pytanie: "**które konkretne rozdziały/zakresy
artykułów danego aktu są rzeczywiście opracowane treściowo, a które są
lukami**". Kluczowy mechanizm przy nowelizacji: pokazuje od razu, czy
dotknięty fragment ma już treść do zaktualizowania, czy to obszar dotąd
nieopracowany.

## Legenda statusu

| Symbol | Znaczenie |
|---|---|
| 🟢 | Pełne/dobrze pokryte — rzeczywista, praktycznie użyteczna treść |
| 🟡 | Częściowe pokrycie — część artykułów opracowana, część brakuje |
| 🔴 | Brak — zero treści merytorycznej, brak dedykowanego pliku dla tego zakresu |
| 🟣 | MODUŁ-WIDMO — plik istnieje, ale jest generyczny/szablonowy, bez rzeczywistej treści danego aktu; wymaga przepisania od podstaw, nie punktowej rozbudowy |

⚠️ Ten rejestr opisuje ILOŚĆ i ZAKRES treści, nie jej AKTUALNOŚĆ prawną.
Każdy przepis nadal wymaga weryfikacji ISAP przed użyciem (HARD GATE).

---

## Prawo budowlane (PrBud)

**Stan prawny bazowy w chwili audytu źródłowego:** Dz.U. 2026 poz. 524 t.j.
(obwieszczenie Marszałka Sejmu 27.03.2026)
**Data ostatniej weryfikacji treści (zasilenie z raportu):** 2026-08-13
**Moduły badane:** `mod-PrBud-prawo-budowlane.md` (ogólny/strategiczny),
`mod-PrBud-patodeweloperka-uzytkowanie-male-obiekty-ograniczenia.md`
(tematyczny), plus punktowe odniesienia w `mod-ochrona-zabytkow-obiekty-
uzytecznosci-publicznej.md`

⭐ **Najbardziej aktualizowany, "żywy" moduł spośród wszystkich zbadanych
aktów w audycie źródłowym** — wyraźne ślady systematycznej, wielokrotnej
rozbudowy na konkretne żądania użytkownika (np. sesja 2026-07-27 dodająca
termin wydania decyzji, mechanizm istotnego odstępstwa, samowolę
budowlaną, małą architekturę). **Brak modułów-widm** — treść jest
rzeczywista tam, gdzie istnieje, tylko nierówna względem pełnej struktury
ustawy.

| Rozdział | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| 1 | **Przepisy ogólne** (definicje, zasady projektowania/budowy/użytkowania) | 1–11 | 🟡 | Art. 3 (definicje — obiekt budowlany, mała architektura), art. 9 (odstępstwo od warunków technicznych) opisane w kontekście konkretnych tematów; art. 5 wzmiankowany przy zabytkach. **Brak: art. 1-2, 4, 5a-8, 10-11** |
| 2 | Samodzielne funkcje techniczne (uprawnienia budowlane) | 12–12b | 🔴 | Nieobecne w samym module PrBud — temat zawodowy architektów/inżynierów pokryty gdzie indziej (`mod-ustawa-architekci-inzynierowie-budownictwa-zawod`), ale to inna ustawa |
| 3 | **Prawa i obowiązki uczestników procesu budowlanego** (inwestor, kierownik budowy, projektant, inspektor nadzoru) | 17–27a | 🟡 | Zakres modułu DEKLARUJE ten temat, ale bez konkretnych artykułów — deklaracja szersza niż rzeczywista treść |
| 4 | **Postępowanie poprzedzające rozpoczęcie robót** (pozwolenie, zgłoszenie, WZ/MPZP) | 28–40a | 🟢 | Art. 29-30 (zwolnienia, progi metrażowe), art. 35 (termin 65/30 dni, sankcja 500 zł/dzień), art. 36a (istotne odstępstwo od projektu, z kryterium z orzecznictwa) — jeden z najlepiej opracowanych rozdziałów |
| 5 | Rozpoczęcie i prowadzenie robót budowlanych | 41–47 | 🔴 | — |
| 5a | Dziennik budowy | 47a–47v | 🔴 | — |
| 5b | **Samowola budowlana** (postępowanie z naruszeniem ustawy) | 48–53a | 🟢 najlepsze | Najlepiej opracowany fragment całego modułu: art. 48 (nakaz rozbiórki), art. 49f-49i (uproszczona legalizacja, próg 20→10 lat, bez opłaty), dwie ścieżki legalizacji, wzór opłaty legalizacyjnej, "żółta kartka" (reforma 2026), uchwała NSA 7 sędziów z lutego 2026 |
| 5c | Zakończenie budowy (zawiadomienie, pozwolenie na użytkowanie) | 54–60 | 🟡 | Pozwolenie na użytkowanie wzmiankowane jako "Zasada absolutna nr 4", bez konkretnych artykułów proceduralnych (zawiadomienie, terminy na sprzeciw) |
| 5d | Książka obiektu budowlanego | 60a–60r | 🔴 | Nowa instytucja, zero treści |
| 6 | **Utrzymanie obiektów budowlanych** (zmiana sposobu użytkowania) | 61–72a | 🟢 | `mod-PrBud-patodeweloperka...` Część A — art. 71/71a (definicja zmiany sposobu użytkowania, procedura zgłoszenia, przesłanki sprzeciwu, konsekwencje bez zgłoszenia); reszta rozdziału (kontrole okresowe, obowiązki właściciela — art. 61-66) nieopracowana |
| 7 | Katastrofa budowlana | 73–79 | 🔴 | — |
| 7a | Portal e-Budownictwo | 79a–79k | 🔴 | — |
| 8 | Organy administracji architektoniczno-budowlanej i nadzoru budowlanego | 80–89c | 🔴 | Nieobecne jako samodzielny temat — organy (PINB, WINB, Starosta, Wojewoda) wzmiankowane przy ścieżce odwoławczej, bez opisania kompetencji |
| 9 | Przepisy karne | 90–94 | 🟡 | Jedno zdanie ogólne, bez rozbicia na typy czynów (art. 90 samowola, 91 udaremnienie kontroli, 91a niewłaściwe użytkowanie) |
| 10 | Odpowiedzialność zawodowa w budownictwie | 95–103 | 🔴 | — |

**Tematy przekrojowe (dobrze pokryte, spoza samego PrBud):** ścieżka
odwoławcza (PINB→WINB→WSA→NSA, Starosta→Wojewoda→WSA→NSA) 🟢; umowa o
roboty budowlane/rękojmia (KC art. 568, 471) 🟢; mała architektura (3
progi metrażowe) 🟢; "patodeweloperka" — reforma warunków technicznych
2024 (rozporządzenie) 🟢; strefy ochronne linii wysokiego napięcia 🟢;
strefa powodziowa (Prawo wodne art. 77) 🟢; ochrona zabytków i dostępność
(art. 5/6/16/39/43/45/57/59a PrBud + ustawa o zabytkach) 🟢; MPZP/WZ —
odesłanie do dedykowanego modułu DR-08.

**Rekomendowana kolejność uzupełniania (wg raportu źródłowego):**
1. Rozdział 3 — prawa i obowiązki uczestników procesu budowlanego (art. 17–27a) — dokończenie już zadeklarowanego tematu
2. Rozdział 8 — organy administracji architektoniczno-budowlanej (art. 80–89c) — uzupełnienie ścieżki odwoławczej o kompetencje
3. Rozdział 9 — przepisy karne, pełna treść (art. 90–94)
4. Rozdział 5c — zakończenie budowy, pozwolenie na użytkowanie (art. 54–60)
5. Rozdział 7 — katastrofa budowlana (art. 73–79)
6. Rozdział 10 — odpowiedzialność zawodowa w budownictwie (art. 95–103)
7. Rozdział 5a, 5d — dziennik budowy i książka obiektu budowlanego

---

## Akty NIE objęte tym rejestrem (brak materiału źródłowego)

Ten skill (dr-09) obejmuje też środowisko, energię i transport poza
Prawem budowlanym (m.in. Prawo ochrony środowiska, ustawę o zapobieganiu
szkodom w środowisku — patrz F-82) — audyt źródłowy z 2026-08-13 objął w
tym skillu wyłącznie PrBud. Pozostałe akty NIE mają dotąd odpowiadającego
raportu pokrycia w tym rejestrze.
