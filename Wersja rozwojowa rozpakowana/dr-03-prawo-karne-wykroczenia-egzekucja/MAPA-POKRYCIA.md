# DR-03 — Mapa Pokrycia Treściowego

## F-108/8 — opłaty w sprawach karnych (2026-08-27)

Moduł: `modules/mod-ustawa-oplaty-w-sprawach-karnych.md`, poziom B+.
Źródło: urzędowy ELI, Dz.U. 2023 poz. 123, z uwzględnieniem aktualnego
brzmienia art. 2 obowiązującego od 14.03.2023.

| Zakres | Materia | Status |
|---|---|---|
| art. 1 | zasada opłat | 🟢 |
| art. 2–7 | opłaty w I instancji | 🟢 |
| art. 8–12 | postępowanie odwoławcze | 🟢 |
| art. 13–14 | oskarżyciel posiłkowy/prywatny | 🟢 |
| art. 15 | opłaty od wniosków i próśb | 🟢 |
| art. 16–18 | określenie, zwolnienie, zażalenie | 🟢 |
| art. 19 | opłata kancelaryjna | 🟢 |
| art. 20 | przedawnienie | 🟢 |
| art. 21 | KKS/wykroczenia/sprawy wojskowe | 🟢 |
| art. 22–23 | uchylone | ⚪ |

F-108 P1/8: **poziom B+ osiągnięty**. Moduł rozdziela ustawę o opłatach
karnych od KSCU oraz od wydatków/kosztów procesu z KPK.

---

**Utworzona:** 2026-08-22 (F-83, zasilenie jednorazowe z `audyt-systemu-v4/
references/raporty-pokrycia-2026-08-13/`) | **Format ustalony przez F-83.**

## Cel i różnica względem MAPA-AKTOW.md

`MAPA-AKTOW.md` (ten sam katalog) odpowiada na pytanie "**który moduł
odpowiada za który akt prawny**" — rejestr akt→moduł, jeden wiersz na
akt/temat.

Ten plik odpowiada na inne pytanie: "**w obrębie danego aktu, które
konkretne rozdziały/zakresy artykułów są rzeczywiście opracowane
treściowo, a które są lukami**" — rejestr rozdział/zakres→status
pokrycia, wiele wierszy na jeden akt.

## Legenda statusu

| Symbol | Znaczenie |
|---|---|
| 🟢 | Pełne/przeważające pokrycie — większość artykułów zakresu ma rzeczywistą treść |
| 🟡 | Częściowe pokrycie — część artykułów opracowana, część brakuje |
| 🔴 | Śladowe/brak — zero lub pojedyncze artykuły wzmiankowane przy okazji innego tematu; **NIE ISTNIEJE plik dedykowany temu zakresowi** |
| 🟣 | **MODUŁ-WIDMO — plik ISTNIEJE, ale jest generyczny/szablonowy, bez rzeczywistej treści merytorycznej danego aktu.** Traktować jak 🔴 pod względem pilności uzupełnienia (wymaga pracy jak każda inna luka), ale z dodatkowym zastrzeżeniem: PRZED dopisaniem treści sprawdzić, czy istniejący plik nadaje się do rozbudowy punktowej, czy wymaga przepisania od podstaw — myląca nazwa/istnienie pliku nie oznacza gotowego punktu zaczepienia |

⚠️ **Ten rejestr opisuje ILOŚĆ i ZAKRES treści w modułach, nie jej
AKTUALNOŚĆ prawną.** Każdy przepis nadal wymaga weryfikacji ISAP przed
użyciem w piśmie (HARD GATE), niezależnie od statusu 🟢/🟡/🔴 tutaj.

---

## Kodeks wykroczeń (KW)

**Stan prawny bazowy w chwili audytu źródłowego:** Dz.U. 2025 poz. 734 t.j.
**Data ostatniej weryfikacji treści (zasilenie z raportu):** 2026-08-13

### Część ogólna (art. 1–48)

| Zakres | Status | Moduł | Uwagi |
|---|---|---|---|
| Art. 1–17 — zasady odpowiedzialności, lex mitior, wiek, zbieg, usiłowanie, formy zjawiskowe, kontratypy, niepoczytalność | 🟢 NAPRAWIONE | `mod-KW-art1-48-czesc-ogolna` | Dedykowany, systematyczny moduł części ogólnej |
| Art. 18–39 — kary, środki karne i wymiar | 🟢 NAPRAWIONE | `mod-KW-art1-48-czesc-ogolna` | Katalog, zasady wymiaru i relacje do przepisów szczególnych |
| Art. 40–48 — środki wychowawcze, zawieszenie aresztu, przedawnienie, zatarcie, definicje i ustawy szczególne | 🟢 NAPRAWIONE | `mod-KW-art1-48-czesc-ogolna` | Art. 45–46 opracowane materialnoprawnie; HARD GATE przed użyciem |

### Część szczególna, rozdziały I–XIX

| Rozdz. | Materia | Art. | Status | Moduł |
|---|---|---|---|---|
| VII | Bezpieczeństwo osób i mienia (fragment) | 82 | 🟢 NAPRAWIONE 2026-08-27 | `mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie.md` — art. 82 zweryfikowany w ELI; uwzględniono Dz.U. 2025 poz. 1814 |
| VIII | Porządek publiczny | 49–64 | 🟢 | `mod-KW-art49-64-porzadek-publiczny` — pełne: 49, 49a, 50, 50a, 51, 52, 52a, 52b, 54, 63a, 64. Brak/niepewne: 55–58, 60¹ |
| X | Bezpieczeństwo osób i mienia | 70–83 | 🟡 | `mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie` — pełne: 70, 71, 77–78, 79, 83. Brak: 72–76, 80–82 |
| XI | Bezpieczeństwo i porządek w komunikacji | 84–103a | 🟡 | Tylko taryfikatorowo (86, 87, 92a, 94, 96, 86c). Brak: 85, 88–91, 97–103a |
| XII | Przeciwko osobie | 104–108 | 🟢 | `mod-KW-art70-118...` — pełne: 104, 105, 106, 107 (z orzecznictwem SN), 107a i 108; art. 107a zweryfikowany w ELI 2026-08-25 |
| XIII | Przeciwko zdrowiu | 109–118 | 🟡 | Pełne: 109, 115, 116, 118. Skrócone: 110, 111, 113, 114. Brak: 112, 117 |
| XIV | Przeciwko mieniu | 119–131 | 🟢 | `mod-KW-art119-131-przeciwko-mieniu` — pełne: 119–129, 131. Najdokładniej opracowany rozdział |
| XV | Przeciwko interesom konsumentów | 132–139c | 🟡 | `mod-KW-art132-166-pozostale-rozdzialy`: rozdział ma punkt startowy; 133–134 opisane, 132/139 uchylone, 137–139c nadal wymagają świeżej pełnej weryfikacji |
| XVI | Przeciwko obyczajności publicznej | 140–142 | 🟢 | `mod-KW-art132-166-pozostale-rozdzialy` — kompletny rozdział |
| XVII | Przeciwko urządzeniom użytku publicznego | 143–145 | 🟡 | `mod-KW-art132-166-pozostale-rozdzialy`: 144–145 opisane; art. 143 pozostaje punktem do pełnej weryfikacji |
| XVIII | Przeciwko obowiązkowi ewidencji | 146–147a | 🟡 | `mod-KW-art132-166-pozostale-rozdzialy`: 146 i 147a opisane; 147 pozostaje do pełnej weryfikacji |
| XIX | Szkodnictwo leśne, polne i ogrodowe | 148–166 | 🟢 NAPRAWIONE F-67 | `mod-KW-art132-166-pozostale-rozdzialy` — 19/19 artykułów; art. 151–166 zweryfikowane 2026-08-14, wcześniejsze 148–150 również opracowane |

**Rekomendowana kolejność uzupełniania (wg raportu źródłowego):**
1. ~~Rozdz. XIX art. 151–166~~ ✅ NAPRAWIONE F-67
2. ~~Część ogólna art. 1–48~~ ✅ NAPRAWIONE (`mod-KW-art1-48-czesc-ogolna`)
3. Rozdz. XI poza taryfikatorem
4. Rozdz. XV art. 137–139c
5. Rozdz. X i XIII (domknięcie brakujących artykułów)

---

## Kodeks karny wykonawczy (KKW)

**Aktualizacja 2026-08-27 — KKW:** dawne pozycje 🟣/🔴 mają teraz co najmniej pokrycie operacyjne B w `mod-KKW-uzupelnienie-pokrycia-2026.md`; status 🟡 oznacza brak pełnego komentarza artykuł-po-artykule, nie brak treści.

**Stan prawny bazowy:** Dz.U. 2025 poz. 911 t.j. (obwieszczenie 11.06.2025)
**Data ostatniej weryfikacji treści:** 2026-08-22 (⛔ NAPRAWIONE — poprzednia
wersja tej sekcji, z 2026-08-21, opierała się wyłącznie na raporcie
źródłowym z 2026-08-13 i pomijała naprawę F-75 z 2026-08-14/20, która w
międzyczasie dodała realną treść do pięciu podsekcji modułu; PONADTO przy
weryfikacji dogłębnej art. 161 §3-4 w tej sesji wykryto i naprawiono
BŁĘDNY stan prawny — moduł cytował próg 3 lata/3+6 mies. zamiast aktualnego
5 lat/6 mies.+rok, patrz uwaga w module)

⚠️ **Historia tego rozdziału mapy jest pouczającym przykładem, dlaczego
mapy pokrycia same wymagają okresowej weryfikacji, nie tylko jednorazowego
zasilenia** — moduł KKW był rzeczywiście modułem-widmem w chwili audytu
źródłowego (13.08), ALE naprawiono go krótko potem (F-75, 14–20.08), a
mapa pokrycia zbudowana 21.08 na podstawie starego raportu tej naprawy nie
uwzględniła. **Pięć podsekcji (0.1–0.5) modułu ma dziś realną, dobrą
treść z konkretnymi numerami artykułów** — reszta modułu (poza sekcją 0)
nadal jest generycznym szablonem proceduralnym bez numeracji KKW.

| Część / Rozdz. | Materia | Art. (orientacyjnie) | Status | Moduł |
|---|---|---|---|---|
| Ogólna I–III | Zakres obowiązywania, organy, skazany (prawa ogólne) | 1–8b | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Ogólna IV | **Postępowanie wykonawcze** (Oddz. 1 wykonywanie orzeczeń, Oddz. 2 postępowanie przed sądem, Oddz. 3 postępowanie egzekucyjne) | 9–31 | 🟢 NAPRAWIONE 2026-08-22 | Sekcja 0.6 modułu — art. 9 (wykonalność orzeczeń), 19-20 (orzekanie jednoosobowe, zażalenie 21 dni), 22 (udział w posiedzeniu), 24 (zmiana/uchylenie postanowienia, limit 6 mies. na niekorzyść), 25-26 (dwa tryby egzekucji: KPC vs administracyjny), 31 (skarga pauliańska SP). ⚠️ Górna granica poprawiona: to 25-31, NIE 25-43 jak wcześniej błędnie w tej mapie — art. 32+ to już Rozdział V |
| Ogólna V | Nadzór penitencjarny | 32–36 | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Ogólna VI | Zatarcie skazania (wykonawcze) | 37 | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Ogólna VII | Uczestnictwo społeczeństwa, Fundusz Pomocy Pokrzywdzonym | 38–43 | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Ogólna VIIa | **System dozoru elektronicznego** | 43a–43zf | 🟢 NAPRAWIONE F-75 | Sekcja 0.3 modułu — 3 formy dozoru (stacjonarny/zbliżeniowy/mobilny), struktura 5 oddziałów, warunki rozpoczęcia, zaliczenie na poczet kary, krąg wnioskodawców. ⚠️ Oddziały 2/2a/3 pozostają do pogłębienia wg jawnej notatki w module |
| Szczególna IX | Kara ograniczenia wolności | ok. 53–66 | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Szczególna X, Oddz. 1–2 | Cele kary pozbawienia wolności, zakłady karne | 67–78 | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Szczególna X, Oddz. 3 | Wykonywanie kary, indywidualizacja | 79–100 | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Szczególna X, Oddz. 4 | **Prawa i obowiązki skazanego** (widzenia, korespondencja, opieka zdrowotna) | 101–120 | 🟢 NAPRAWIONE F-75 | Sekcja 0.4 modułu — katalog praw art. 102 i dalsze (treść pełna, patrz moduł) |
| Szczególna X, Oddz. 5–7 | Zatrudnienie, nauczanie, działalność kulturalno-oświatowa | 121–136a | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Szczególna X, Oddz. 8 | Nagrody i ulgi | 137–141a | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Szczególna X, Oddz. 9 | **Kary dyscyplinarne** | 142–149 | 🟡 NAPRAWIONE F-75, częściowo | Sekcja 0.5 modułu — treść dobra, ale sam moduł jawnie odnotowuje otwarte pytania (pełny katalog art. 143 §1 pkt 4-7, dokładna treść art. 148-149, tryb skargi z art. 144 §5 niejednoznaczny) |
| Szczególna X, Oddz. 10 | **Odroczenie i przerwa wykonania kary** | 150–158a | 🟢 NAPRAWIONE F-75 | Sekcja 0.2 modułu — rozróżnienie odroczenie/przerwa, przesłanki obligatoryjne (art. 150) i fakultatywne (art. 151) z limitem roku, przerwa (art. 153) ze szczegółami. ⚠️ Katalog wyłączeń podmiotowych i pełna procedura wniosku (art. 153a i n.) pozostają do pogłębienia wg jawnej notatki w module |
| Szczególna X, Oddz. 11 | **Warunkowe przedterminowe zwolnienie** | 159–163 | 🟢 NAPRAWIONE F-75, ⛔ POPRAWIONE 2026-08-22 | Sekcja 0.1 modułu — TERAZ w samym module KKW (poprzednia wersja tej mapy błędnie wskazywała treść jako obecną tylko w module KK). Krąg wnioskodawców (161 §1-2), **termin karencji po odmowie (161 §3-4) NAPRAWIONY w tej sesji — był błędny (stara wersja przepisu), teraz poprawny: ≤5 lat→6 mies., >5 lat→rok**, przebieg posiedzenia (161 §1, 162), zaskarżalność (162 §2-3), odwołanie zwolnienia (art. 160). Przesłanki materialne (art. 77-82 KK) świadomie POZA zakresem tego modułu — w `mod-KK-art69-84-warunkowe-zawieszenie-zwolnienie.md` |
| Szczególna X, Oddz. 12–13 | Zwalnianie z zakładów karnych | 164–168a | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Szczególna XI | Kurator sądowy, dozór, warunkowe umorzenie/zawieszenie (wykonawcze) | ok. 169–182 | 🟡 | Tylko art. 182a (blokada alkoholowa) w `mod-KK-KPK-framework-szczegolowy` i `mod-PRD-nowe-przestepstwa-drogowe-BRD`, NIE w module KKW — NIE dotknięte naprawą F-75 |
| Szczególna XII | Środki karne, kompensacyjne, przepadek (wykonanie) | ok. 183–201 | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Szczególna, dalsze | Środki zabezpieczające, kary porządkowe, koszty, tymczasowe aresztowanie (wykonanie) | ok. 202–223 | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Szczególna XVa | Umieszczanie w wydzielonych pomieszczeniach | — | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Wojskowa | Wykonywanie kar wobec żołnierzy | — | 🟡 B — uzupełnione 2026-08-27 | `mod-KKW-uzupelnienie-pokrycia-2026.md` — pokrycie operacyjne; moduł szczegółowy KKW ma pierwszeństwo dla zakresów już pogłębionych |
| Końcowa | Przepisy przejściowe i końcowe | 243–259 | ⚪ | Techniczne, niski priorytet |

**Zaktualizowana rekomendowana kolejność uzupełniania** (5 z 7 oryginalnych
pozycji już naprawione — pozostają 2 + reszta struktury generycznej):
1. ~~Oddz. 11 — warunkowe przedterminowe zwolnienie~~ ✅ NAPRAWIONE F-75 + poprawione 2026-08-22
2. ~~Oddz. 10 — odroczenie i przerwa wykonania kary~~ ✅ NAPRAWIONE F-75
3. ~~Rozdz. VIIa — system dozoru elektronicznego~~ ✅ NAPRAWIONE F-75
4. ~~Oddz. 9 — kary dyscyplinarne~~ 🟡 NAPRAWIONE F-75 częściowo, otwarte pytania pozostają
5. ~~Oddz. 4 — prawa i obowiązki skazanego~~ ✅ NAPRAWIONE F-75
6. ~~Rozdz. IV — postępowanie wykonawcze (art. 9–31)~~ ✅ NAPRAWIONE 2026-08-22
7. **Reszta struktury generycznej** (Ogólna I-III, V-VII, Szczególna IX, X Oddz. 1-3/5-8/12-13, XII i dalsze) — przepisanie modułu poza sekcją 0 pozostaje aktualne jako cel długoterminowy

---

## Akty NIE objęte tym rejestrem (brak materiału źródłowego)

Indeks raportów źródłowych (`00-indeks-raportow-pokrycia.md`) wymienia
**KK, KP, KRO, KPW** jako badane w tej samej sesji audytowej z 2026-08-13
— sekcja "Najpilniejsze braki łącznie" cytuje je ze szczegółami (np. "KPW
apelacja art. 103–109", "KK rozdz. XXI art. 173–176, 179–180", "KW część
ogólna" — już ujęte wyżej). **Jednak odpowiadające pliki
`raport-pokrycia-KK.md`, `raport-pokrycia-KP.md`, `raport-pokrycia-KRO.md`,
`raport-pokrycia-KPW.md` NIE ISTNIEJĄ w katalogu źródłowym** — nieciągłość
odnotowana przy tworzeniu tego rejestru (2026-08-22), nie zmyślona treść
zastępcza. KK i KPW dotyczą wprost DR-03 — ich brak jest istotną luką
tego rejestru, do uzupełnienia gdy/jeśli oryginalne raporty się odnajdą
lub zostaną odtworzone nowym audytem.
