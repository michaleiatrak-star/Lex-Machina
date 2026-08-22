# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Plik:** `WARN-OTWARTE.md`
**Zawiera:** WYŁĄCZNIE to, co jeszcze DO ZROBIENIA — bez narracji, bez opisów
napraw już wykonanych, bez sekcji „zamknięte".
**Plik siostrzany:** `AUDIT-JOURNAL.md` — pełna historia (odkrycia, naprawy,
zamknięcia, wnioski). Nic z niego nie jest usuwane.
**Ostatnia sesja:** 2026-08-22 (Reguła 3 sprawdzona na żądanie użytkownika — 2 luki znalezione w prawo-polskie-v2/ROUTING-MAP: Op Dział V brakujący wiersz, KKW wiersz z nieaktualnym błędnym stanem prawnym art. 161 propagującym wcześniej naprawiony błąd; oba naprawione. Pozostałe 8 modułów z dzisiejszej/wczorajszej fazy potwierdzone jako już zsynchronizowane). ⛔ Kronika sesji NIE mieszka w tym pliku — pełna historia: `AUDIT-JOURNAL.md`, wpisy `AUDYT-YYYY-MM-DD[litera]`.

> **Zasada podziału (ZASADA 10 w SKILL.md):**
> - Otwarcie flagi → wiersz TUTAJ + wpis w `AUDIT-JOURNAL.md`.
> - Zamknięcie flagi → USUŃ wiersz STĄD + pełny opis naprawy WYŁĄCZNIE w dzienniku.
> - Naprawa CZĘŚCIOWA → NIE opisuj jej tutaj; skróć wiersz do tego, co ZOSTAŁO,
>   a opis wykonanej części zapisz w dzienniku. Ten plik nie jest kroniką postępu.
> - Pytanie „co jest otwarte" → czytaj TEN plik, nie grepuj dziennika.

---

## ⚡ TABLICA STERUJĄCA — CO JEST DO ZROBIENIA (czytaj to najpierw)

**Stan na 2026-08-21 (po sesji porządkowania rejestru i synchronizacji rejestrów modułów):**

| Kategoria | Liczba | Pozycje |
|---|---|---|
| WARN numerowane otwarte | **0** | WARN-1…WARN-29 zamknięte |
| Flagi F- wykonalne sesją audytową | **9** | F-88, F-13, F-83, F-104, F-86, F-102, F-48, F-5, F-82 |
| Flagi F- zależne od dewelopera/środowiska | **5** | F-8, F-10, F-11, F-9, F-94 |
| **Razem flag F- otwartych** | **14** | — |
| MON (permanentne, nigdy nie zamykane) | 3 | MON-1, MON-2, MON-3 |
| OBS (projekty w toku) | 7 | OBS-1…OBS-7 |
| REACT-1 (uruchamiane sprawą) | 8 | patrz sekcja 4 |
| O (obserwacje informacyjne) | 3 | O-1, O-2, O-3 |

> ⛔ **Ten licznik rozjechał się ze stanem faktycznym o 4 pozycje** (deklarował 17 flag przy 13 wierszach
> w tablicy) i utrzymywał wiersze flag zamkniętych w sekcji 1 wbrew ZASADZIE 10. Naprawione 2026-08-21;
> usunięta treść i pełna lista zweryfikowanych zamknięć — `AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-21zc.
> **Przy KAŻDEJ zmianie liczby flag aktualizuj tę tabelę — jest jedynym miejscem licznika.**

⛔ **PRZED jakąkolwiek edycją skilla przeczytaj blok HARDGATE-AUDYT niżej.**

### A. WYKONALNE SESJĄ AUDYTOWĄ — kolejność wg priorytetu

| Flaga | Prio | Dziedzina | Następny krok (jedno zdanie) |
|---|---|---|---|
| F-102 | niski | cross: 10 skilli | **Zawężona 2026-08-20z3 — zostało tylko ryzyko PRZYSZŁE.** Historia 18 wersji odtworzona z dziennika, pułapka float naprawiona w 16 skillach, duplikaty numeru poza YAML zlikwidowane. Pozostaje cudzysłów profilaktyczny w 10 skillach — przy najbliższej edycji każdego z nich, NIE hurtem |
| F-88 | średni-wysoki | cross (7 DR) | ✅ MDR, VAT, opłata skarbowa, PIT/CIT, KKS zamknięte (patrz AUDIT-JOURNAL dla historii). **Sesja 19w-19y:** adwokatura/radcowie (RZĄD 1 potwierdzony), Prawo bankowe (hipoteza automatycznego zwolnienia MDR ODRZUCONA), SKOK/ubezpieczenia (hipoteza średniej pewności, nieprzypisana do artykułu) — `mod-OP-ordynacja-podatkowa.md` sekcja 6b. **Sesja 20d:** PPSA — CZĘŚCIOWO dotknięty (Dz.U. 2026.846, w życie 1.10.2026), sekcja 7 mod-PPSA; ⚠️ [NIEWERYFIKOWANE RZĄD 1] dokładny artykuł. **Sesja 2026-08-21 (kontynuacja): SKOK i ubezpieczenia — POTWIERDZONE RZĄD 1, NIE zamknięte.** Bezpośredni cytat stopki (footnote wyliczający ustawy nowelizowane) z `dziennikustaw.gov.pl/D2026000084601.pdf` (indeksowany fragment): "...ustawę z dnia 5 listopada 2009 r. o spółdzielczych kasach oszczędnościowo-kredytowych, ustawę z dnia 11 września 2015 r. o działalności ubezpieczeniowej i reasekuracyjnej, ustawę z dnia 16 listopada 2016 r. o Krajowej Administracji Skarbowej oraz ustawę z dnia 9 marca 2017 r. o wymianie informacji podatkowych z innymi państwami" — TA SAMA metoda potwierdzenia (stopka aktu, nie tylko tag ELI) co dla funduszy/instrumentów. Rozstrzyga hipotezę średniej pewności z sesji 19w-19y na TAK — obie ustawy SĄ nowelizowane. **Fundusze inwestycyjne/instrumenty finansowe** — potwierdzone RZĄD 1 (eli.gov.pl, tagi tematyczne) w tej samej sesji; odrębna ustawa OKI (3.07.2026) też je zmienia, ale to INNY akt — nie mylić. **Pozostaje NIEUSTALONE dla WSZYSTKICH CZTERECH obszarów** (SKOK, ubezpieczenia, fundusze inwestycyjne, instrumenty finansowe): dokładny numer artykułu i treść zmiany wprowadzonej przez SAMĄ 2026.846. Hipoteza robocza (niepotwierdzona): ten sam mechanizm MDR co adwokatura/radcowie/doradztwo podatkowe — rozszerzenie zwolnienia z raportowania dla podmiotów objętych tajemnicą zawodową/branżową, LUB (alternatywnie, wg EY 07.2026) konsekwencja ogólnego zwężenia MDR do schematów wyłącznie transgranicznych (zniesienie obowiązku dla schematów krajowych) — te 4 ustawy mogą być zmieniane wyłącznie KONSEKWENCYJNIE (odesłania do zmienionych definicji OP), nie merytorycznie. **Ograniczenie narzędziowe:** web_fetch na isap.sejm.gov.pl/api.sejm.gov.pl/dziennikustaw.gov.pl zablokowany (ROBOTS_DISALLOWED) — pełny tekst dostępny wyłącznie jako fragmenty indeksowane przez web_search, niewystarczające do zlokalizowania konkretnego artykułu wśród ~40 nowelizowanych ustaw. Dalszy postęp wymaga F-8/F-10 (connector deweloperski) lub kontynuacji wielokrotnych ukierunkowanych zapytań o malejącym zwrocie. |
| F-13 | średni | cross | Zażalenie poziome/pionowe. **SESJA 2026-08-20:** wzorzec art. 795 KPC do bramki. **SESJA 2026-08-21 (6 tur):** tura 1 — 21 plików DR-06/08/09/10/13/14/16, 1 luka (nadzór budowlany). Tura 2 — 17 plików dr-02/dr-03, para pułapek PrRestr/PrUpad (art. 200/222) + 2 luki naprawione. Tura 3 — 19 plików DR-04/05/11/12, ZERO nowych luk. Tura 4 — 28 plików pisma-procesowe-v3+shared, ZERO nowych luk. **Tura 5 — 13 plików: dr-12 (8), dr-01 (3), prawny-router-v3 (2), prawo-polskie-v2 (1), pisma-proste-v2 (2), audyt-systemu-v4 (1) — 1 NOWA LUKA naprawiona.**  (SPH-B, przywrócenie terminu): poprzednia wersja pozostawiała pytanie jawnie otwarte jako [NIEWERYFIKOWANE — SPORNE] (błędny cytat art. 394 §1 pkt 2 KPC dot. zwrotu pozwu, nie przywrócenia terminu). Rozstrzygnięte RZĄD 2B (rp.pl, cytujące jednolite orzecznictwo SN): odmowa przywrócenia terminu jest w ogóle NIEZASKARŻALNA WPROST — nie mieści się w katalogu art. 394 §1 KPC (nie jest postanowieniem kończącym postępowanie); kontrola następuje pośrednio przez art. 380 KPC przy zaskarżeniu KOLEJNEGO postanowienia (np. odrzucenia spóźnionej apelacji). Naprawiono z pełnym wyjaśnieniem mechanizmu i odesłaniem do bramki dla właściwego, kolejnego postanowienia. Pozostałe 12 plików tej tury: ZERO nowych luk — wszystkie poprawnie odsyłają do bramki lub są czysto nawigacyjne (mapy aktów, raporty pokrycia). **STAN F-13 SKUMULOWANY:** baza 96 plików, **98 przejrzanych łącznie w tej rozmowie (21+17+19+28+13, z małą nadwyżką bo niektóre pliki miały >1 wystąpienie liczone osobno w różnych turach)** — F-13 PRAKTYCZNIE ZAMKNIĘTA dla statycznego przeglądu całego systemu; 4 genuine luki znalezione i naprawione łącznie (nadzór budowlany, PrRestr art.188, PrUpad art.56d, SPH-B przywrócenie terminu). Bramka  dynamicznie łagodzi ryzyko dla przyszłych, jeszcze nienapisanych pism niezależnie od stanu przeglądu statycznego |
| F-83 | niski | audyt-systemu-v4, dr-02, dr-03, dr-04, dr-05, dr-06, dr-07, dr-09 | **ZASILONA + ZWERYFIKOWANA POD KĄTEM AKTUALNOŚCI 2026-08-22.** 8/9 raportów przeniesionych (KPC świadomie odłożony). **KLUCZOWE ODKRYCIE (druga faza sesji, po zleceniu użytkownika "kontynuuj" i uwadze o mechanizmie nowelizacyjnym): 6 z 7 zasilonych map było CZĘŚCIOWO PRZESTARZAŁYCH już w chwili budowy** — każda mapa bazowała na raporcie źródłowym z 13.08 bez sprawdzenia pełnej, bieżącej listy plików modułów, a system był naprawiany szybciej niż nadążały mapy. Naprawiono wszystkie 6: **dr-03/KKW** (5 podsekcji już opracowanych w F-75, mylnie 🟣; + błędny stan prawny art. 161 §3-4 naprawiony wprost w module). **dr-02/PrUp-PrRestr** (PrRestr miało 5 modułów nie 1; PrUp Tytuł VI art. 267-305 CAŁKOWICIE UCHYLONY, zastąpiony Va 266a-266f; ocena PrRestr zmieniona z najsłabszej na jedną z lepszych w systemie). **dr-06/Op** (2 nowe moduły: dowody Dz.IV Rozdz.11, kontrola podatkowa Dz.VI — priorytety #1 i #2). **dr-05/PPSA** (1 nowy moduł pokrywający 5 rekomendowanych luk naraz: terminy, kasacja, prawo pomocy, sprzeciw, wznowienie — F-64 zamknięta). **dr-07/PZP** (2 nowe moduły domykające Dział II niemal w całości + dopełniające przebieg KIO). **dr-04/SUS-FUS** (1 nowy moduł: SUS Rozdz.2 podleganie ubezpieczeniom, priorytet #1). **dr-09/PrBud jedyna mapa POTWIERDZONA jako aktualna** bez zmian. Wniosek metodyczny: przy każdym zasilaniu/weryfikacji mapy pokrycia ZAWSZE sprawdzać pełną listę plików przez find/grep w MAPA-AKTOW, nie tylko treść znanego pliku.
| F-104 | średni | audyt-systemu-v4 + cross-DR | **Rocznik 2026 ZAMKNIĘTY.** Roczniki starsze (2013-2025) w toku: T11 wygenerowało 70 pozycji. **TRANSZA 1 ZAKOŃCZONA: 6 potwierdzonych i wpisane** (2025.1891, 1882, 1872, 1814, 1783, 1760), **1 świadomie NIE wpisana** (2025.1863, niejednoznaczna). 1 pozostaje (2025.1696) — próba w kolejnej transzy. Odpowiedź na pytanie zakresu zmian (2026-08-22): wszystkie zmiany tej sesji F-104 dotyczą WYŁĄCZNIE audyt-systemu-v4/references/mapa_dzu_*.md — sprawdzono przez T11, że dr-XX i prawo-polskie-v2/ROUTING-MAP.md NIE wymagają korekty, bo wpisywane pozycje już miały tam poprawne, wcześniej zweryfikowane wiersze (REGUŁA 3 była już spełniona) — mapa centralna była jedynym brakującym rogiem trójkąta synchronizacji |
| F-86 | bardzo niski | dr-02 (PrUp) | Bariera długości usunięta podziałem 2026-08-21. Pozostaje treść: likwidacja masy Dział II-IV (316-334), postępowanie międzynarodowe (378-417), postępowania szczególne (418-425+) — dopisywać do `mod-PrUpad-uklad-likwidacja-zakonczenie.md` |
| F-48 | niski | dr-11 | Rozbudować STUB certyfikacji cyberbezpieczeństwa, gdy przepisy wejdą w życie |
| F-5 | niski | dr-06 | Moduł ESAP — dopiero gdy pojawi się sprawa z rynku kapitałowego |
| F-82 | średni | audyt-systemu-v4, dr-02, dr-07, dr-09, dr-10 | **Skan 2026-08-21 ZAKOŃCZONY dla wierszy statusu OK: 16 z 22 wierszy sprawdzonych, 4 błędy naprawione.** Ostatnia tura: szkody w środowisku (2007.75→PREV/2020.2187 dodane — NAJBARDZIEJ RAŻĄCY przypadek: mapa pominęła 5 kolejnych generacji t.j.) i timeshare (2018.513 — DWIE nieudane próby weryfikacji, oznaczone jako potencjalnie BŁĘDNY numer, nie tylko niepotwierdzony — wymaga dedykowanej sesji). Pozostają WYŁĄCZNIE 3 pozycje statusu PREV (niższe ryzyko — już mają potwierdzonego następcę w mapie): 2023/1317, 2023/1284, 2023/1109 — do weryfikacji przy okazji, nie priorytetowo. Współczynnik trafień na wierszach OK: 4/16 ≈ 25% — bardzo wysoki, potwierdza że cały mechanizm "brak VER + status OK" trafnie identyfikował ryzykowne wiersze |

### B. ZALEŻNE OD DEWELOPERA / ŚRODOWISKA — sesja audytowa ICH NIE ZAMKNIE

| Flaga | Prio | Zakres | Kto musi wykonać |
|---|---|---|---|
| F-8 | średni | Podłączenie realnego connectora MCP do api.sejm.gov.pl | Deweloper w środowisku z dostępem do domen .gov.pl |
| F-10 | średni | Uruchomienie `sync_dzu_eli.py` wobec żywego ELI API | j.w. |
| F-11 | średni | Uruchomienie `extract_api_verification_log.py` na prawdziwej odpowiedzi API | Deweloper |
| F-9 | niski | Wdrożenie konwencji znacznika `AUDIT_EVENT` w prompcie portalu | Zespół portalu (poza silnikiem) |
| F-94 | niski | shared + audyt-systemu-v4 | **Nowe odkrycie 2026-08-18:** `KONEKTORY-REKOMENDOWANE.md` nigdzie niewskazany z żadnego SKILL.md w systemie (sam odsyła do `tools/mcp-servers/`); całe `shared/tools/mcp-servers/` (7 folderów, ~42 pliki) osierocone transitywnie. Dodatkowo `shared/checklists/contradiction-intelligence-checklist-v10.md` — możliwy dryf nazwy względem realnie wołanego `pisma-procesowe-v3/references/engines/contradiction-intelligence-engine-v10.md` (inny plik, inna lokalizacja). Do zrobienia: (1) zdecydować, czy KONEKTORY-REKOMENDOWANE.md ma być wpisany do shared/SKILL.md czy do MCP-INTEGRACJA.md; (2) sprawdzić czy checklist v10 to zamierzony duplikat czy pozostawiony po refaktoryzacji; (3) rozstrzygnąć, czy 42 pliki mcp-servers to żywy kod (F-8/F-10 dot. tego samego obszaru) czy do usunięcia. |

### C. POZOSTAŁE REJESTRY W TYM PLIKU

| Rejestr | Czym jest | Czy liczy się do „flag do zamknięcia" |
|---|---|---|
| MON-1, MON-2, MON-3 | Mechanizmy monitorowania — permanentne | ⛔ NIE — nigdy nie zamykane |
| OBS-1…OBS-7 | Projekty ustaw w toku, śledzone proaktywnie | ⛔ NIE — dopóki nieuchwalone |
| REACT-1 (7 pozycji) | Punkty uruchamiane wyłącznie sprawą klienta | ⛔ NIE — brak sesji, która je zamknie |
| O-1, O-2 | Obserwacje informacyjne | ⛔ NIE |

---

## ⛔ HARDGATE-AUDYT — ZASADY OPERACYJNE, AUTOMATYCZNIE WCZYTYWANE PRZED KAŻDĄ SESJĄ NAPRAWCZĄ

*(dodano 2026-08-14, na żądanie użytkownika — konsolidacja zasad wypracowanych
metodą prób i błędów w toku sesji naprawczej cyklu WARN. Ten blok MUSI być
przeczytany PRZED rozpoczęciem jakiejkolwiek pracy nad WARN/flagami F-,
analogicznie do sposobu, w jaki `shared/PRAWO-HARDGATE.md` jest wczytywany
przed cytowaniem przepisów/orzeczeń. Naruszenie = ryzyko utraty pracy z
poprzednich tur lub niespójności rejestrów.)*

```
REGUŁA 1 — ŹRÓDŁO KOPII ROBOCZEJ (odkryta po nadpisaniu naprawy F-58):
  Przed EDYCJĄ jakiegokolwiek skilla w ramach WIELOTUROWEJ sesji:
  KROK A: sprawdź `ls /mnt/user-data/outputs/` — czy istnieje ZIP dla
    tego skilla z WCZEŚNIEJSZEJ tury TEJ SAMEJ rozmowy?
  KROK B: JEŻELI TAK → przywróć kopię roboczą Z TEGO ZIP-a
    (rm -rf + unzip), NIGDY z /mnt/skills/user (źródło pierwotne,
    statyczne, nieaktualizowane w trakcie rozmowy).
  KROK C: JEŻELI NIE (skill nigdy dotąd nietknięty w tej rozmowie) →
    kopiuj bezpiecznie z /mnt/skills/user.
  ⚠️ Kopiowanie z /mnt/skills/user dla skilla JUŻ edytowanego w tej
  rozmowie = CICHA UTRATA całej poprzedniej naprawy, bez błędu/
  ostrzeżenia systemowego. Zawsze weryfikuj grep-em kluczowego markera
  PRZED kontynuacją (np. "czy F-XX fix nadal obecny?").

REGUŁA 2 — WERYFIKACJA PER-MODUŁOWA REJESTRACJI (lekcja z F-33, DR-06):
  Po dodaniu NOWEGO modułu, PRZED przejściem dalej:
  grep -c "\[✓\].*NAZWA-MODUŁU" SKILL.md   (oczekiwane: dokładnie 1)
  grep -c "NAZWA-MODUŁU" MAPA-AKTOW.md      (oczekiwane: co najmniej 1)
  ⚠️ Sama wzmianka modułu w PROZIE nagłówka SKILL.md ("Aktualizacja
  2026-...: dodano...") NIE JEST wystarczająca — wymagany jest
  FORMALNY wpis w bloku checklisty `[✓]` ORAZ osobny wiersz w
  MAPA-AKTOW.md. Zbiorczy `comm`/przegląd całej sekcji NIE wykrywa
  tej różnicy — wymagana weryfikacja PER MODUŁ, z osobna.

REGUŁA 3 — SYNCHRONIZACJA Z CENTRALNĄ MAPĄ prawo-polskie-v2 (dodano
  2026-08-14, na żądanie użytkownika — luka wykryta: 12 nowych modułów
  z tej sesji nie trafiło do `prawo-polskie-v2/ROUTING-MAP.md` mimo
  poprawnej rejestracji lokalnej):
  Po synchronizacji z lokalnym MAPA-AKTOW.md (Reguła 2), DODATKOWO:
  KROK A: sprawdź `ls /mnt/user-data/outputs/ | grep prawo-polskie-v2`
    — zastosuj Regułę 1 (ZIP z poprzedniej tury vs pristine).
  KROK B: znajdź właściwą sekcję `## DR-XX — <nazwa>` w ROUTING-MAP.md.
  KROK C: dodaj wiersz WEWNĄTRZ tej sekcji (między jej nagłówkiem `##`
    a NASTĘPNYM nagłówkiem `## DR-`) — NIE przed pierwszym trafionym
    stringiem przez `str_replace`, bo ten sam tekst wiersza-kotwicy
    może występować w WIĘCEJ niż jednym miejscu pliku (odkryte:
    orphan-rows z DR-12 sklejone tuż przed nagłówkiem DR-13 zamiast
    wewnątrz właściwej sekcji DR-07) — zawsze WERYFIKUJ Python/grep
    że nowy wiersz wylądował between poprawnych nagłówków `## DR-`.
  KROK D: PO wstawieniu wszystkich wierszy — jednym skryptem (python
    re.split po `^## DR-\\d+`) potwierdź, że KAŻDY nowy moduł occurs
    w SEKCJI odpowiadającej jego prawdziwemu DR, nie w sąsiedniej.
  ⚠️ ROUTING-MAP.md to PLIK ~780 linii z WIELOMA sekcjami o podobnych
  wzorcach tekstowych — ręczne "wstaw po tym wierszu" jest ZAWODNE bez
  automatycznej weryfikacji końcowej.

REGUŁA 4 — WERYFIKACJA BAJTOWA PRZED DOSTAWĄ (już ugruntowana, ZASADA 7
  w audyt-systemu-v4/SKILL.md, tu przypomniana jako część tego samego
  łańcucha): KROK 1 licz pliki PRZED, KROK 4 licz PO, KROK 5 zip, KROK
  4b rozpakuj i `diff -rq` zip vs drzewo robocze (MUSI być exit=0),
  ORAZ `diff -rq` zip vs poprzednia dostarczona wersja (potwierdź że
  RÓŻNICE to DOKŁADNIE zamierzone zmiany, nic więcej/mniej).

REGUŁA 5 — NATYCHMIASTOWA WERYFIKACJA PO KAŻDYM str_replace PRZY
  WSTAWIANIU TUŻ PRZED STAŁYM MARKEREM (3 incydenty w tej sesji: F-75
  skasowało marker "Obserwacje informacyjne"; sekcja SKD skasowała
  nagłówek "SPÓR O WYKONANIE UMOWY"; nagłówek "Moduły (X łącznie)"
  zduplikowany przy FUS): jeśli `new_str` wstawia treść TUŻ PRZED
  stałym elementem strukturalnym (nagłówek, marker sekcji), element
  ten MUSI być jawnie zawarty w `new_str` — NIE polegać na tym, że
  "zostanie" w pliku. PO każdej takiej edycji: `grep -n "^## "` (lub
  analogiczny wzorzec) na cały plik, porównaj spis treści przed/po.

REGUŁA 6 — DOSTAWA WYŁĄCZNIE ZGODNIE Z REGUŁĄ 7 (dodano 2026-08-14, na
  żądanie użytkownika — konsoliduje istniejącą procedurę Reguły 7
  [audyt-systemu-v4/SKILL.md] jako WARUNEK KOŃCOWY każdej sesji
  naprawczej, nie tylko dobrą praktykę): ŻADNA naprawa NIE JEST
  ukończona bez przejścia PEŁNEGO łańcucha: KROK 1 (policz pliki
  PRZED) → KROK 2 (kopia robocza wg Reguły 1) → edycja → KROK 4
  (policz PO, porównaj z KROK 1 — różnica MUSI być DOKŁADNIE
  zamierzona, np. "+1 nowy moduł" lub "0, tylko treść") → KROK 5
  (zip) → KROK 4b (rozpakuj, `diff -rq` zip vs drzewo robocze — MUSI
  być exit=0; `diff -rq` zip vs poprzednia wersja — potwierdź że
  różnice to WYŁĄCZNIE zamierzone zmiany) → `present_files`. ⛔ ZAKAZ
  kończenia tury bez dostawy — jeśli sesja się urwie PRZED KROK 5,
  NASTĘPNA tura MUSI dokończyć dostawę PRZED podjęciem nowej pracy
  (incydent z tej sesji: tura z F-24/F-38/F-62 zakończyła się bez
  present_files, naprawiona dopiero w NASTĘPNEJ turze na wyraźne
  zwrócenie uwagi przez użytkownika — NIE powtarzać).
```

*Powyższe reguły stosuje się ŁĄCZNIE z istniejącymi ZASADAMI 1-13 w
`audyt-systemu-v4/SKILL.md` (ten plik je uzupełnia specyficznie dla
kontekstu wieloturowej pracy nad WARN w ramach jednej rozmowy — ZASADY
w SKILL.md są bardziej ogólne/międzysesyjne).*

---

## 1. FLAGI F- OTWARTE — SZCZEGÓŁY

> Kolumna „Pozostały zakres" zawiera WYŁĄCZNIE to, czego jeszcze NIE zrobiono.
> Historia napraw częściowych — w `AUDIT-JOURNAL.md` pod wskazanym wpisem.

### 1A. Luki treściowe w aktach prawnych (raporty pokrycia 2026-08-13)

| # | Pozostały zakres — DO ZROBIENIA | Skill | Prio | Otwarta od | Historia / źródło |
|---|---|---|---|---|---|
| F-86 | PrUp — pozostałe zakresy: likwidacja masy Dział II-IV (art. 316-334); postępowanie międzynarodowe (art. 378-417); postępowania szczególne wobec banków/ubezpieczycieli/deweloperów (art. 418-425+). ⭐ **Bariera długości USUNIĘTA 2026-08-21** — moduł podzielony (659 + 307 l.), nową treść dopisywać do `mod-PrUpad-uklad-likwidacja-zakonczenie.md`, NIE do pliku macierzystego. Dodatkowo: odświeżyć raport pokrycia | dr-02 | bardzo niski | 2026-08-21 | raport PrUp-PrRestr sekcja 1 (⚠️ nieaktualny); naprawy: AUDYT-2026-08-15v(3)–(6), 08-21r, 08-21y, 08-21z, 08-21zd |


### 1B. Luki strukturalne i treściowe poza raportami pokrycia

| # | Pozostały zakres — DO ZROBIENIA | Skill | Prio | Otwarta od | Historia / źródło |
|---|---|---|---|---|---|
| F-5 | Moduł dedykowany ustawie ESAP (Dz.U. 2026 poz. 644) — omnibus ~17 ustaw sektora finansowego. Przy tej okazji ustalić, na czym polega dotknięcie KSH (dwie próby bez rozstrzygnięcia: 2026-07-15, 2026-08-05). ⚠️ Uruchamiać wyłącznie, gdy pojawi się sprawa z rynku kapitałowego/nadzoru finansowego | dr-06 | niski | 2026-07-07 | AUDIT-JOURNAL 2026-07-15, 2026-08-05 |
| F-13 | Zażalenie poziome vs pionowe — indywidualna adnotacja pozostałych ~58 z 69 plików wspominających „zażalenie" (DR-02, 03, 06–10, 13–16). Kolejność wg aktywności spraw: DR-02 i DR-03 najpierw. ⭐ Bramka `shared/ZAZALENIE-ADRESAT-GATE.md` już działa i wymusza weryfikację adresata przy każdym piśmie — to złagodzenie ryzyka, nie zamknięcie luki statycznej | cały system | średni | 2026-07-25 | naprawa częściowa: 2026-07-25d |
| F-48 | Rozbudować `mod-ustawa-certyfikacja-cyberbezpieczenstwa.md` (uczciwie oznaczony STUB) — dopiero gdy przepisy wejdą w życie. Akt bazowy Dz.U. 2025 poz. 1017 potwierdzony | dr-11 | niski | 2026-06-05 | naprawa mapy RODO: 2026-08-14b |



| F-102 | **POZOSTAŁA 1 POZYCJA — cudzysłów profilaktyczny w 10 skillach nieedytowanych w sesji 08-20z3.** ✅ ZAMKNIĘTE 2026-08-20z3 (T12 na `/mnt/skills/user` przed: **7 ⛔ + 20 ⚠️**; na naprawionym drzewie: **0 ⛔ + 0 ⚠️**): **(A) siedem czynnych rozjazdów** — historia odtworzona z `AUDIT-JOURNAL.md` (sekcje „Rejestracja") i dopisana do właściwych changelogów: `prawny-router-v3` 3.14-3.21 (osiem wersji, największa luka w systemie — z zastrzeżeniem, że dziennik nie rozdziela, co przypadło na 3.14/3.15/3.16, bo powstały w jednej sesji), `analizator-umow-v1` 1.26-1.30 (pięć), `pisma-procesowe-v3` 5.16-5.17, `dr-01` 3.4; `orzeczenia-sadowe-v2` — rozjazd ODWROTNY naprawiony przez podbicie `version: 2.9 → "2.9.1"` (changelog miał wpis, którego pole nie odnotowało); `przesluchanie-swiadkow-v2-min90` i `analizator-dowodow-v3` — zamknięte wcześniej, w sesji 08-20z. Wszystkie wpisy oznaczone jako WTÓRNE wobec dziennika i odsyłają do konkretnego wpisu-źródła; **nic nie zostało zmyślone** — `dr-01` 3.5 i 3.6 nie mają śladu w żadnym pliku systemu i są odnotowane jako „LUKA JAWNA". **(B) pułapka float** — `version` ujęty w cudzysłów w 16 skillach (13 z realną pułapką: `analizator-umow-v1` 1.30, `dr-02` 3.35, `dr-03` 3.28, `dr-04` 3.23, `dr-05` 3.19, `dr-06` 3.72, `dr-09` 3.21, `dr-10` 3.35, `dr-11` 3.10, `dr-12` 4.10, `dr-15` 3.10, `pisma-proste-v2` 2.10, `prawny-router-v3` 3.21; + 3 profilaktycznie, bo i tak były edytowane). **(C) DECYZJA GENERALNA o duplikatach numeru poza YAML: usuwać, nie synchronizować.** Nagłówki H1 noszą teraz sam MAJOR (`prawny-router-v3` v3, `raport-sytuacyjny-v2` v2, `orzeczenia-sadowe-v2` v2, `analizator-dowodow-v3` v5), a stopka `prawo-polskie-v2` odsyła do pola `version:` i nosi wyłącznie datę zmiany treści. Uzasadnienie: dwa źródła prawdy o wersji ZAWSZE się rozjeżdżają — pięć niezależnych wystąpień w trzech sesjach; major w tytule nie dryfuje, bo zmienia się raz na kilkanaście wersji. ⛔ **POZOSTAJE:** 10 skilli z niecytowanym jednocyfrowym minor (`analiza-sadowa-v6`, `analizator-przepisow-v2`, `chronologia-sprawy-v1`, `dr-07`, `dr-08`, `dr-13`, `dr-14`, `dr-16`, `przewodnik-prawny-v2`, `raport-klienta-v1`) — ryzyko wyłącznie PRZYSZŁE (uaktywni się przy przejściu na X.10). Świadomie NIE naprawiane hurtem: edycja dziesięciu skilli wyłącznie po to, by dodać cudzysłów, generuje dziesięć dostaw i dziesięć okazji do pomyłki przy zerowym zysku dzisiaj. **Do zrobienia:** przy NAJBLIŻSZEJ edycji każdego z tych skilli — z dowolnego powodu — ująć `version` w cudzysłów przy okazji; listę na bieżąco pokazuje `python3 scripts/check_wersje_changelog.py --profilaktyka` | cross: 10 skilli | niski (ryzyko wyłącznie przyszłe) | 2026-08-20z | zawężona 2026-08-20z3 — (A), (B) i (C) wykonane w całości |


| F-88 | **Propagacja ustawy z 29.05.2026 o zmianie ustawy — Ordynacja podatkowa oraz niektórych innych ustaw (Dz.U. 2026 poz. 846, w życie 1.10.2026).** ZAMKNIĘTE: OP rdzeń, MDR (sekcja 6a), katalog wyłączeń MDR, VAT (art. 109 ust. 3e/3h → OP, w życie 1.01.2027), opłata skarbowa (nowy moduł), PIT/CIT (odesłania konsekwencyjne), KKS (sekcja w mod-KKS). **Sesja 19w (adwokatura/radcowie prawni):** RZĄD 1 [fragment PDF ISAP, isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20260000846] potwierdza że ustawa 2026.846 zmienia WŁASNĄ TREŚCIĄ (nie tylko odesłaniem) Prawo o adwokaturze i ustawę o radcach prawnych — hipoteza robocza z sesji 19k ("prawdopodobnie tylko odesłanie, analogicznie do PIT/CIT") ODRZUCONA. RZĄD 2/3 [5+ źródeł: Deloitte, Gekko Taxens x2, PARP, studio.pwc.pl] wskazuje prawdopodobny mechanizm: zwolnienie z obowiązku raportowania MDR dla podmiotów objętych tajemnicą zawodową (doradcy podatkowi, adwokaci, radcowie prawni, rzecznicy patentowi, notariusze, biegli rewidenci), o ile raportowanie naruszałoby tajemnicę zawodową. ⚠️ [NIEWERYFIKOWANE] dokładny numer artykułu/paragrafu w Prawie o adwokaturze i ustawie o radcach prawnych — ISAP i api.sejm.gov.pl zwracają ROBOTS_DISALLOWED dla web_fetch w tym środowisku (potwierdzone ponownie, ta sama bariera co F-91/F-92). Ta sama lista RZĄD 1 wskazuje, że Prawo bankowe, doradztwo podatkowe i rzecznicy patentowi RÓWNIEŻ mają własną treść nowelizacyjną (nie tylko odesłanie) — DO ZWERYFIKOWANIA per ustawa w kolejnej sesji, nie zakładać automatycznie że to ten sam mechanizm MDR. Zapisane `mod-OP-ordynacja-podatkowa.md` (dr-06) nowa sekcja 6b. **Pozostaje W CAŁOŚCI nieopracowane:** SKOK, fundusze inwestycyjne, instrumenty finansowe, ubezpieczenia, sądy administracyjne (PPSA) — 5 obszarów bez żadnego ustalenia. Ścieżka dalsza: MOD-PROPAGACJA-NOWELIZACJI, jeden obszar na sesję, LUB eskalacja do F-8/F-10 (connector deweloperski z dostępem do .gov.pl) jeśli bariera web_fetch nadal blokuje postęp | cross: dr-06, dr-02, dr-05, dr-12, dr-16, dr-03 (KKS), dr-08 (podatki lokalne) | średni-wysoki (data wejścia w życie 1.10.2026 — coraz bliżej) | 2026-08-15x | ISAP/dziennikustaw.gov.pl/api.sejm.gov.pl blokują web_fetch (robots disallowed) — mapowanie przez web_search wieloźródłowy; ⚠️ ta sama klasa co F-79 (omnibus, system odnotował tylko część skutków) |


### 1C. Flagi narzędziowe i metodologiczne (audyt-systemu-v4)

| # | Pozostały zakres — DO ZROBIENIA | Skill | Prio | Otwarta od | Historia / źródło |
|---|---|---|---|---|---|
| F-82 | ⚠️ Sam błąd (Kodeks morski pod numerem Dz.U. 2023 poz. 1523 zamiast 1309) NAPRAWIONY 2026-08-15n. ✅ Pkt 2 i 3 ZAMKNIĘTE 2026-08-15y: do `test_cross_map_dzu.py` dopisano ostrzeżenie (docstring + komunikat w wyniku), że zgodność rejestrów NIE jest weryfikacją merytoryczną, wraz z opisem techniki wykrywania tej klasy błędu; ustawa o delegowaniu kierowców (Dz.U. 2023 poz. 1523) dostała własny wiersz w mapie centralnej — decyzja: skatalogowana BEZ modułu, temat reaktywny. ⛔ POZOSTAJE 1 PUNKT: przeskanować mapę Dz.U. pod kątem aktów, których numer nigdy nie był weryfikowany PRZECIW ŹRÓDŁU ZEWNĘTRZNEMU — priorytet dla aktów o statusie „ze zm. — brak nowszego t.j.", bo ten opis sugeruje, że nikt nie sprawdzał od dawna | cross: audyt-systemu-v4, prawo-polskie-v2, dr-09 | informacyjny | 2026-08-15n | ⭐ LEKCJA: błąd przetrwał wszystkie audyty TRYB DZU, bo trzy rejestry były ze sobą ZGODNE — kroswalidacja tej klasy błędu nie wykryje. Technika kontrolna: porównywać metryki aktów zmienianych, cytowane w tekstach nowelizacji, z mapą |
| F-104 | **Pozostało 13 aktów GŁÓWNYCH rocznika 2026 bez wiersza w mapie centralnej** (poz. 1046 antymobbingowa, 1005 łańcuchowa, 985 frankowa, 909 rachunkowość budżetowa, 724 ewidencja kierujących, 662 USG, 619 opakowania, 412 akcyza, 300 specustawy, 188 JPK, 157 SKW/SWW, 125 lekarz weterynarii, 110 przestępczość seksualna). Pełna lista z modułem, DR i protokołem transzy: `references/F-104-lista-robocza-mapa-dzu.md`. ⛔ Każdą pozycję weryfikować Rząd 1 → 2 per akt (ZASADA 8 — znacznik VER w mapie lokalnej NIE wystarcza; transza 1 udowodniła to, wykrywając przy okazji błąd klasy F-82 w wierszu 2025 poz. 468). Po wyczerpaniu rocznika 2026 — powtórzyć kwalifikację POPRAWIONYM parserem dla starszych roczników | audyt-systemu-v4 + cross-DR | średni | 2026-08-21 | transza 1: AUDYT-2026-08-21zg |
| F-83 | ⛔ BRAMKA: dopóki otwarta, sesja zadania cyklicznego POMIJA blok § 3 (`SCHEDULED-TASK-COWORK.md`) i odnotowuje to jednym zdaniem. **DRUGA FAZA ZAKOŃCZONA 2026-08-22: weryfikacja aktualności wszystkich zasilonych map.** (1) Format ustalony na 8 przypadkach, dodatkowo wzbogacony o wzorzec "NAPRAWIONE [data] (znaleziona przy weryfikacji)" dla przypadków, gdy mapa była przestarzała względem stanu bieżącego. (2) Lokalizacja niezmieniona. (3) Zasilanie: 8/9 raportów przeniesionych, KPC nadal świadomie odłożony. (4) **NOWY WYNIK: 6/7 zasilonych map wymagało korekty aktualności** — patrz wiersz główny dla pełnej listy. Tylko dr-09/PrBud potwierdzona jako aktualna bez zmian. (5) DECYZJA NADAL DO PODJĘCIA: format i mechanizm F-83 są teraz w pełni dojrzałe i sprawdzone na 9 przypadkach (w tym korektach) — czy uznać F-83 za funkcjonalnie zamkniętą (z notatką o KPC i zaleceniem okresowej rewalidacji map) i odblokować § 3, czy trzymać otwartą | cross-DR + audyt-systemu-v4 | niski | 2026-08-22 | Odkrycie przy zasilaniu dr-03: indeks źródłowy deklaruje 13 zbadanych aktów, tylko 10 plików fizycznie istnieje — brak KK/KP/KRO/KPW, odnotowane jawnie, nie zmyślono treści. NOWE odkrycie tej fazy: mapy pokrycia same wymagają okresowej rewalidacji, nie tylko jednorazowego zasilenia — tempo napraw systemu wyprzedza tempo budowy map o kilka dni |

### 1D. Flagi zależne od dewelopera / środowiska

> ⛔ Tych czterech flag NIE DA SIĘ zamknąć sesją audytową — wymagają dostępu
> do domen `.gov.pl`, prawdziwej odpowiedzi API albo wdrożenia po stronie
> portalu. Logika i testy po stronie systemu przechodzą w całości.

| # | Pozostały zakres — DO WYKONANIA PRZEZ CZŁOWIEKA | Skill | Prio | Otwarta od |
|---|---|---|---|---|
| F-8 | (a) Wdrożyć connector w środowisku z dostępem do api.sejm.gov.pl; (b) zweryfikować realny kształt odpowiedzi JSON; (c) podłączyć w kliencie MCP. Start: `npm install && node test_protokol_mcp.mjs` w `shared/tools/mcp-servers/isap-eli-example/` | shared/MCP-INTEGRACJA.md | średni | 2026-07-13 |
| F-9 | (a) Wdrożyć konwencję znacznika `AUDIT_EVENT` w system prompcie portalu; (b) podłączyć parser do realnego przepływu odpowiedzi routera; (c) ustalić politykę retencji logu. Wg `DOKUMENTACJA-WDROZENIOWA-2026-07-13.md`, sekcja 3 | audit-trail-portal-v1 | niski | 2026-07-13 |
| F-10 | Uruchomić `sync_dzu_eli.py` wobec żywego api.sejm.gov.pl i skorygować `pobierz_nowe_pozycje_eli()`, jeśli kształt odpowiedzi różni się od założonego | sync-dzu-automatyczny-v1 | średni | 2026-07-13 |
| F-11 | Zapisać jedną prawdziwą odpowiedź Claude API z wywołaniami web_search/web_fetch i uruchomić na niej `extract_api_verification_log.py` jako pierwszy test integracyjny | shared/tools | średni | 2026-07-13d |

---

## 2. ♾️ MONITORING — FLAGI PERMANENTNE, NIGDY NIE ZAMYKANE

> ⚠️ Te trzy pozycje NIE SĄ przeznaczone do zamknięcia — monitorowanie zmian
> legislacyjnych jest zadaniem CIĄGŁYM. NIE usuwać przy porządkowaniu rejestru,
> NIE liczyć do „aktywnych flag do zamknięcia". F- to konkretne zadanie na
> liście TODO; MON- to nawyk sprawdzania — nigdy nie jest „zrobiony".

| # | Co monitorujemy | Zakres | Rytm | Ostatnie wykonanie | Metoda |
|---|---|---|---|---|---|
| MON-1 | Nowelizacje i nowe t.j. aktów JUŻ pokrytych przez moduły | ~200+ aktów w 16 lokalnych `MAPA-AKTOW.md` | co 4 tyg., rotacyjnie 5–8 aktów na sesję | 2026-08-14 | web_search per akt; priorytet dla aktów z flagą „⚠️ WYMAGA AKTUALIZACJI MODUŁU" oraz aktów żywych (KKW, KPK, ustawa o cudzoziemcach, PIT/VAT) |
| MON-2 | Nowe projekty ustaw / proces legislacyjny, horyzont 6–12 mies. | pozycje z sekcji OBSERWOWANE (OBS-1…OBS-7) | co 4 tyg.; OBS o priorytecie WYSOKIM — co 2 tyg. | 2026-08-14 | web_search, sejm.gov.pl (druki), RCL |
| MON-3 | KWOTOWE stawki opłat i podatków — zmieniane aktem podustawowym lub obwieszczeniem waloryzacyjnym, więc MON-1 ich NIE WYKRYJE (numer Dz.U. ustawy się nie zmienia, a moduł cicho się dezaktualizuje) | (1) opłaty sądowe KSCU (dr-16, dr-02); (2) opłata skarbowa i administracyjne (dr-05); (3) opłaty egzekucyjne, w tym kwota wolna od egzekucji (dr-02, dr-03, dr-05); (4) podatki i opłaty lokalne — obwieszczenie MF, w tym ⭐ opłata miejscowa, uzdrowiskowa i projektowana turystyczna (dr-06, dr-08; sprzężenie z OBS-2); (5) progi i kwoty PIT/CIT/ryczałt, limit zwolnienia VAT (dr-06); (6) opłaty sektorowe — produktowa, kaucja, koncesyjne (dr-09); (7) grzywny i mandaty KW/KPSW (dr-03) | ROCZNY: okno X–XII (obwieszczenia na kolejny rok) + I (kontrola); poza oknem — wyłącznie reaktywnie | — (pierwszy przegląd: X–XII.2026) | web_search + podatki.gov.pl, mf.gov.pl; ISAP dla rozporządzeń. ⚠️ podatki lokalne — obwieszczenie MF w **Monitorze Polskim**, NIE w Dz.U. |

**Protokół MON-3 (odrębny od MON-1/MON-2):** zmiana samej KWOTY zwykle NIE
uzasadnia nowej flagi F- — wystarczy punktowa korekta liczby w module + wpis
w dzienniku. Nową flagę F- otwierać TYLKO gdy: (a) zmienia się KONSTRUKCJA
opłaty (nowa przesłanka, nowy podmiot zobowiązany, nowy tryb zwolnienia), albo
(b) kwota jest cytowana w >3 modułach. ⛔ Kwoty NIGDY z pamięci — każda liczba
wymaga odczytu ze źródła w tej samej sesji, w której trafia do modułu.

**Harmonogram:** JEDEN zunifikowany przegląd dla MON-1 i MON-2 razem (ta sama
metoda, ta sama sesja web_search), cykl bazowy 4 tygodnie, dodatkowa runda co
2 tygodnie wyłącznie dla pozycji o priorytecie WYSOKIM. Zakres jednej sesji:
(1) MON-2 — przejrzeć OBS-1…OBS-7 pod kątem zmiany statusu; (2) MON-1 — 5–8
aktów najwyższego ryzyka, rotacyjnie; (3) każde trafienie → protokół niżej.
Częściej niż co 4 tygodnie = zużywanie budżetu web_search na wyniki „brak zmian".

### 📋 PROTOKÓŁ PRZY TRAFIENIU (dodano 2026-08-14, na żądanie użytkownika — obowiązkowy dla MON-1 i MON-2 jednakowo)

Gdy MON-1 lub MON-2 wykryje realną zmianę (uchwaloną nowelizację, nowy
akt, LUB projekt na tyle zaawansowany, że wymaga przejścia z sekcji
"OBSERWOWANE" do aktywnej naprawy) — **UTWÓRZ NOWĄ FLAGĘ F-** (kolejny
wolny numer) o następującej, WYMAGANEJ strukturze:

```
1. NAZWA AKTU + DOKŁADNY zakres zmiany — co konkretnie się zmieniło
   (nowy przepis / zmiana istniejącego / uchylenie), z numerem Dz.U.
   nowelizacji i datą wejścia w życie.

2. LOKALIZACJA DOTKNIĘTYCH MODUŁÓW — ustal, KTÓRE moduły/DR wymagają
   aktualizacji, W TEJ KOLEJNOŚCI źródeł (od najbardziej wiarygodnego):
   a) MAPA-MODULOW-GLOBALNA.md (zbiorcza mapa moduł→akty z oznaczeniem
      GENERYCZNY/MERYTORYCZNY/MIESZANY) — patrz sekcja "🗺️ ZADANIE
      ODŁOŻONE" niżej — JEŻELI już powstała w chwili trafienia. To
      NAJSZYBSZE źródło: jedno wyszukiwanie zamiast przeglądania 16
      plików.
   b) JEŻELI mapa zbiorcza JESZCZE nie istnieje (zadanie odłożone do
      czasu zamknięcia wszystkich F- — patrz niżej) → PRZESZUKAJ
      RÓWNOLEGLE: (i) wszystkie 16 lokalnych `dr-XX/MAPA-AKTOW.md`
      (grep po nazwie aktu/numerze Dz.U.), ORAZ (ii) centralną
      `prawo-polskie-v2/ROUTING-MAP.md` (jeden plik, 16 sekcji,
      grep po nazwie aktu obejmuje WSZYSTKIE DR naraz — z zastrzeżeniem
      REGUŁY 3 wyżej: ROUTING-MAP.md bywał NIESYNCHRONIZOWANY względem
      lokalnych map, więc traktuj go jako PIERWSZY, szybki punkt
      orientacyjny, NIE jako jedyne, rozstrzygające źródło — zawsze
      potwierdź w lokalnej MAPA-AKTOW.md danego DR).

3. DLA KAŻDEGO zidentyfikowanego modułu: określ, czy zmiana dotyka
   (a) wyłącznie numeru Dz.U./metryki, czy (b) rzeczywistej TREŚCI
   opisanej w module (patrz wzorzec z naprawy SKD — wyrok SN II CSKP
   89/26 — i systemu MOS — oba wymagały zmiany TREŚCI, nie tylko
   numeru). Rozróżnienie decyduje o zakresie naprawy.

4. Priorytet nowej flagi F- ustal wg praktycznej częstości użycia
   dotkniętego tematu — NIE automatycznie "wysoki" tylko dlatego, że
   zmiana jest świeża.
```

⚠️ MON-1/MON-2 same NIGDY nie przechowują treści konkretnego odkrycia
— są punktem WEJŚCIA (uruchamiają protokół), nowo utworzona F-
przechowuje ustalenia. Dzięki temu obie flagi permanentne pozostają
czytelne i "puste" (jako mechanizm), niezależnie od tego, ile razy
zostały już uruchomione.

---

## 3. 👁️ OBSERWOWANE — projekty ustaw w toku (nie są flagami błędów)

> Śledzone proaktywnie przez MON-2, żeby nie przeoczyć wejścia w życie.
> Po UCHWALENIU → nowa flaga F- wg PROTOKOŁU PRZY TRAFIENIU. Pełny opis
> stanu prac i źródeł — w `AUDIT-JOURNAL.md` (wpisy 2026-08-14, 08-15c, 08-15w).

| ID | Projekt | Dotyka | Prio | Istota — co się zmieni | Kiedy sprawdzać |
|---|---|---|---|---|---|
| OBS-1 | Nowelizacja PIT/CIT/ryczałt na 2027 (UD116, RCL/MF) | dr-06 (`mod-PIT-*`, CIT; NIE dotyczy VAT) | średni-wysoki | Zakres zmniejszony z 30+ do ~15 zmian (podwyżki ryczałtu 8,5%→17% i najmu 12%→15% WYCOFANE). Zostają: ulga mieszkaniowa raz na 3 lata; zbycie majątku wycofanego z działalności — 6 mies. → 3 lata; cyfryzacja PIT-11/PIT-8C; korekty ksiąg/JPK od 1.01.2027; CIT — ukryta dywidenda, datio in solutum. ODRĘBNIE: reforma skali PIT (pośrednie progi zamiast kwoty wolnej 60 tys.) — projekt zapowiadany na jesień 2026 | co 4–6 tyg. |
| OBS-2 | Opłaty od pobytu/noclegu — DWA równoległe projekty: (A) rządowy z 28.05.2026 (RCL), (B) poselski (Lewica) | dr-06, dr-08 (ustawa o podatkach i opłatach lokalnych); pośrednio dr-02 (najem krótkoterminowy) | **WYSOKI** | (A) opłaty miejscowa i uzdrowiskowa powiązane ze świadczeniem usług zakwaterowania, a prowadzący obiekt staje się **PŁATNIKIEM zamiast inkasenta** — przesunięcie odpowiedzialności publicznoprawnej, nie kosmetyka; wejście planowane 1.01.2027. (B) opłata turystyczna zamiast miejscowej, bez kryteriów klimatycznych, uzdrowiskowa bez zmian. ⚠️ Projekty mogą się wykluczać — śledzić, KTÓRY wejdzie. ⚠️ Numery druku/pozycji RCL NIEUSTALONE | co 4 tyg., częściej po 1.10.2026 |
| OBS-3 | Regulacja UTO/hulajnóg i e-rowerów (dawna F-14) | dr-03 (`mod-przerobki-modyfikacje-pojazdow.md`) | niski | ⚠️ To NIE „delegalizacja UTO", lecz zaostrzenie regulacyjne: zmiana dwóch ustaw (homologacja, kierujący) + rozporządzenie techniczne; TDT decyduje o dopuszczeniu urządzeń; Straż Miejska z uprawnieniem kontroli parametrów; ⭐ e-rowery >25 km/h — rejestracja jak motorowery. Wejście 1.01.2027 wg JEDNEGO źródła, NIEPOTWIERDZONE. ⛔ Dane „18 lat, konfiskata 30 dni" dotyczą Macedonii Północnej, NIE Polski | bliżej 1.01.2027 |
| OBS-4 | Pakiet praworządnościowy: status neosędziów, KRS, reforma USP (dawna F-15) | dr-01 (`mod-ustawa-KRS-i-ustroj-wladzy.md`, `mod-USP-ustroj-sadow-powszechnych.md`) | **WYSOKI** ⚠️ jedyna pozycja o bezpośrednim wpływie na WAŻNOŚĆ ORZECZEŃ | ROZSTRZYGNIĘTE: nowelizacja KRS zawetowana 19.02.2026; nowa KRS wybrana przez Sejm 15.05.2026; węższa nowelizacja USP (asesorzy) — Dz.U. 2026 poz. 370. W TOKU: (a) ustawa o STATUSIE neosędziów — utknęła w komisji, główne źródło ryzyka; (b) duża reforma USP (UD322/UD323) w opiniowaniu, RPO z zastrzeżeniami konstytucyjnymi; (c) deadline ETPC (Wałęsa p. Polsce) — listopad 2026 | **co 2–3 tyg.** — przy uchwaleniu ustawy o statusie neosędziów natychmiast flaga F- o priorytecie NAJWYŻSZYM |
| OBS-5 | Implementacja dyrektywy UE 2023/970 (jawność wynagrodzeń), Etap 2-3 — projekt UC127 (MRPiPS, RCL) | dr-04 (`mod-KP-dzial-III-wynagrodzenie-swiadczenia-jawnosc.md`) | średni-wysoki | Wpisana do monitorowania 2026-08-15 (naprawa F-28 pkt 5). Etap 1 (jawność rekrutacyjna) JUŻ OBOWIĄZUJE od 24.12.2025 (Dz.U. 2025.807), poza zakresem OBS. Etap 2-3: termin transpozycji dyrektywy 7.06.2026 MINĄŁ bez ustawy; projekt UC127 (status "otwarty" na RCL, wersja z 29.04.2026/publ. 4.05.2026) WYRAŹNIE odracza wejście w życie na "6 miesięcy od ogłoszenia" zamiast sztywnej daty — faktycznie NIE WCZEŚNIEJ niż I kw. 2027. Kluczowe elementy projektu do śledzenia: zniesienie tajemnicy wynagrodzeń, obowiązkowe wartościowanie stanowisk (odwołanie do art. 183c §3 KP), odwrócony ciężar dowodu w sporach o dyskryminację płacową, raportowanie luki płacowej (≥100 prac. wg jednej wersji), sankcje (widełki grzywien niespójne między źródłami: 2000-60000 zł vs 3000-50000 zł — do potwierdzenia przy uchwaleniu). ⚠️ Opóźnienie NIE zwalnia Polski z obowiązku transpozycji — ryzyko postępowania KE trwa | co 4–6 tyg. — częściej przy zbliżaniu się do zapowiadanego I kw. 2027 |

| OBS-6 | Areszt elektroniczny (AE) jako nowy środek zapobiegawczy w KPK | dr-03 (`mod-KPK-*` środki zapobiegawcze/tymczasowe aresztowanie — punkt startowy do połączenia po uchwaleniu) | **wysoki** | Nowy, SAMODZIELNY środek zapobiegawczy między dozorem policyjnym a tymczasowym aresztowaniem: zamiast aresztu śledczego — pobyt we WŁASNYM miejscu zamieszkania pod kontrolą Systemu Dozoru Elektronicznego (elektroniczna bransoletka). WYMAGA zgody zarówno oskarżonego/podejrzanego, JAK I jego pełnoletnich domowników. Dwuetapowe zastosowanie: (1) wczesna faza postępowania przygotowawczego — na wniosek prokuratora o tymczasowe aresztowanie LUB jego zamianę na AE; (2) faza późniejsza — gdy dalsze tymczasowe aresztowanie nie jest konieczne. Nadzór: sąd albo prokurator (zależnie od etapu), z możliwością zmiany miejsca/przedziałów czasowych oddalania się w uzasadnionych przypadkach. Projekt Komisji Kodyfikacyjnej Prawa Karnego, nowelizuje KPK + KKW + ustawę o SDE. ⚠️ ROZBIEŻNOŚĆ ŹRÓDEŁ co do statusu: (a) gazetaprawna.pl [archiwalna data cache ok. marca 2026] wskazuje, że Rada Ministrów JUŻ PRZYJĘŁA projekt nowelizacji KK/KPK/ustawy o SDE; (b) rp.pl [publikacja dzisiejsza, 20.08.2026] wskazuje, że projekt NIE ZOSTAŁ opublikowany, BEZ konsultacji/opiniowania, przyjęcie przez rząd zapowiadane na jesień 2026 jest "niemal pewne, że się NIE stanie" — wiceminister Maria Ejchart (MS) deklaruje gotowy projekt "do końca roku" [2026]. ⚠️ NIE rozstrzygnięto tej rozbieżności w tej sesji — możliwe, że gazetaprawna dotyczy INNEGO, wcześniejszego/węższego projektu (rozszerzenie progu SDE z 1 roku do 1,5 roku dla already-skazanych, śledzone jako odrębny wątek techniczny, MNIEJ istotny niż sam AE jako nowy środek zapobiegawczy). ⭐ Kontekst: ~90% wniosków o tymczasowe aresztowanie jest uwzględnianych (raport Fundacji Court Watch) — AE ma to ograniczyć | co 4-6 tyg., częściej pod koniec 2026 przy zbliżaniu się do zapowiadanego terminu |
| OBS-7 | "Lex szarlatan" — nowelizacja ustawy o prawach pacjenta i RPP (dawna F-97) | dr-10 (zdrowie/prawa pacjenta) — brak modułu, ZASADNIE, dopóki TK się nie wypowie | średni | **ROZSTRZYGNIĘTE 2026-08-21 (dzień terminu, 21 dni od 31.07.2026):** Prezydent Nawrocki OGŁOSIŁ 20.08.2026, że NIE PODPISUJE ustawy i kieruje ją do Trybunału Konstytucyjnego w trybie KONTROLI PREWENCYJNEJ (art. 122 ust. 3 Konstytucji RP) — zapowiedział też własną inicjatywę ustawodawczą w tym temacie. To NIE jest klasyczne weto (zwrot do Sejmu) ani podpis — ustawa NIE WCHODZI W ŻYCIE i nie otrzyma numeru Dz.U., dopóki TK nie orzeknie o zgodności z Konstytucją (termin orzeczenia TK nieznany, potencjalnie miesiące/lata). Zweryfikowane 4+ zgodnymi źródłami z 20-21.08.2026 (polsatnews.pl, portalsamorzadowy.pl, rynekzdrowia.pl, zwrotnikraka.pl). Brak modułu w systemie pozostaje zasadny do czasu orzeczenia TK | co 2-3 mies. — sprawdzać status w TK, nie co sesję (niski tempo zmian oczekiwane) |

---

## 4. 🔁 REAKTYWNE (REACT-1) — uruchamiane WYŁĄCZNIE sprawą, nie sesją audytową

> 7 pozycji przeniesionych 2026-08-15n z rejestru flag F- (reklasyfikacja, NIE
> naprawa — żaden punkt nie został zbadany). Powód: wszystkie miały w kolumnie
> „Wymaga" tę samą treść — *„web_search per punkt, wyłącznie na żądanie konkretnej
> sprawy"* — więc z definicji nie dają się zamknąć sesją audytową, a zawyżały
> licznik flag i konkurowały o uwagę z zadaniami realnie wykonalnymi.
>
> **Protokół użycia:** przy sprawie dotykającej punktu — web_search wg
> PRAWO-HARDGATE (nigdy z pamięci) W TEJ SAMEJ sesji → wpis do modułu → wpis
> w `AUDIT-JOURNAL.md` → skreślenie punktu z tabeli. NIE liczyć do „aktywnych
> flag do zamknięcia" (ZASADA 9).
>
> ⚠️ Dawne **F-35** i **F-42** trafiły tu przez analogię (miały „web_search per
> punkt" bez dopisku „wyłącznie na żądanie"). Jeśli któryś ich punkt zasłuży na
> sesję dedykowaną — przywrócić jako flagę F- z nowym numerem.

| Dawna flaga | Skill | Priorytet | Otwarta od | Punkty (treść przeniesiona 1:1 z rejestru flag) |
|---|---|---|---|---|
| **F-22** (zmigrowana) | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski | 2026-08-13c | (1) `mod-KC-spadki.md` EPS: szczegółowe zasady jurysdykcji rozp. 650/2012 (art. 4-19) przy rzeczywistym zbiegu elementów z kilku państw UE (np. professio iuris + zwykły pobyt za granicą) — główna procedura EPS już opisana; (2) `mod-KC-spadki.md` Tytuł X KC: praktyczne znaczenie pojedynczych przepisów, które PRZETRWAŁY wyrok TK P.4/99 (art. 1058, 1063, 1067, 1070, 1070¹, 1079, 1081, 1082, 1086) — sama cezura 14.02.2001 już ustalona i jest wystarczająca dla zdecydowanej większości spraw; (3) `mod-KC-spadki.md` spis inwentarza: dokładne stawki kosztów KOMORNICZYCH (opłata sądowa 300 zł już nie dotyczy tej ścieżki — to inna taksa); (4) `mod-piecza-zastepcza-rodzina-zastepcza.md`: limit 14/30 dzieci w placówkach opiekuńczo-wychowawczych oparty WYŁĄCZNIE na 1 źródle Rządu 3 (domydziecka.org) — wymaga potwierdzenia w art. 95/105 ustawy przed powołaniem w piśmie (ZASADA 12 — poniżej progu 2-3 źródeł); (5) `mod-piecza-zastepcza-rodzina-zastepcza.md`: regionalne placówki opiekuńczo-terapeutyczne i interwencyjne ośrodki preadopcyjne nadal całkowicie nieopracowane (rzadkie formy) |
| **F-47** (zmigrowana) | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | bardzo niski | 2026-08-13, **pkt 1 zamknięty 2026-08-19** | ✅(1) `mod-rzadkie-choroby-genetyczne-plan-leki-sieroce.md` — Plan dla Chorób Rzadkich W PEŁNI ZWERYFIKOWANY: aktualna edycja to Plan na 2026 r. (uchwała RM 179/2025), przedłużony do końca 2026, ALE System dla Chorób Rzadkich (rejestr+karta pacjenta) NIE jest jeszcze operacyjny — czeka na ustawę SIOZ ("martwy punkt" wg mzdrowie.pl czerwiec 2026); rozróżnienie prawo-na-papierze vs praktyka istotne dla realnej oceny praw pacjenta. (2) `mod-ustawa-hodowla-zdrowie-zwierzat.md` — dokładny status propozycji ograniczenia eksportu żywych zwierząt NIE potwierdzony w tej sesji (sprawdzono, brak jednoznacznego źródła) — pozostaje uczciwie otwarte, wymaga dedykowanej weryfikacji ISAP przy konkretnej sprawie |
| **F-91** (zmigrowana, 2026-08-17d) | dr-09-budownictwo-srodowisko-energia-transport | niski | 2026-08-16, pokrycie rozdziałów zamknięte 2026-08-17d | Punktowy ogon po zamknięciu pokrycia 12/12 — każdy punkt = osobny web_search przy trafieniu sprawą. **Sesja 2026-08-18: pkt 3, 4, 5 ZAMKNIĘTE, pkt 1, 2, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16 CZĘŚCIOWO/W WIĘKSZOŚCI, pkt 7 SPRAWDZONY-NIE-ZAMKNIĘTY.** Wszystkie 16 punktów ogona dotknięte w tej sesji — pełny bilans w AUDIT-JOURNAL.md, wpisy AUDYT-2026-08-18 do AUDYT-2026-08-18k. **Pkt 7 ZAMKNIĘTY 2026-08-18 (korekta własnego błędu z wcześniejszej tury tej samej sesji):** sygnatura II CSK 170/12 jest PRAWDZIWA — pierwsze sprawdzenie w SAOS/sn.pl (generyczne zapytania) dało fałszywy negatyw; potwierdzenie znalezione w rp.pl, art. z 25.01.2013 "Sąd cywilny skontroluje łowieckie dyscyplinarki", cytujący sygnaturę wprost wraz z tezą zgodną z opisem w module. Wcześniejsza sugestia zastąpienia sygnaturą IV CSK 473/16 była błędna i wycofana. Pozostają: (1) rozporządzenia z delegacji art. 49 ust. 1 oraz art. 41 ust. 1-3 (3 akty, metryki nieustalone); (2) metryka rozporządzenia z art. 15 ust. 4 (ekwiwalent) oraz z art. 18 ust. 4-5 (2 akty) i art. 22 ust. 2 (wzór ewidencji skupu); (6) treść statutu PZŁ i regulaminu sądów łowieckich (akty wewnątrzkorporacyjne, poza Dz.U.); (7) patrz wyżej — korekta/potwierdzenie sygnatury, NIE zamknięte; (8) orzecznictwo do art. 33 ust. 2a-2d, art. 39, art. 8a (odmowa zatwierdzenia RPŁ) i art. 59 ust. 3 (uprawnienia nabyte przed 17.02.1996); (9) czy zatarcie z art. 35r usuwa przeszkodę z art. 33c ust. 1 pkt 2; (10) tryb zaskarżenia decyzji z art. 35a ust. 9; (11) moduł Rozdz. 5 — katalog wyłączeń art. 26, art. 28 ust. 2 i n., art. 29a, art. 30, art. 31, obwody <3000 ha; (12) moduł Rozdz. 8 — art. 43, 42c, 42e, katalog tematów egzaminu, bioasekuracja, stawka opłaty skarbowej art. 45 ust. 3, aktualność opisu art. 42b; (13) moduł Rozdz. 3 — droga do WSA po wyłączeniu KPA z art. 8d (styk dr-05), aktualność oznaczenia Dz.U. KPA w art. 8d, katalog zwierząt gospodarskich z art. 16 ust. 1; (14) moduł Rozdz. 1-2 — metryka nowelizacji zmieniającej art. 7, rozporządzenie z art. 5, aktualność krajowej listy IGO; (15) moduł Rozdz. 4 — metryka nowelizacji uchylającej art. 17/19/20, standard długości terminu w wezwaniu z art. 22a ust. 1; (16) moduł Rozdz. 11 — treść zmian pominiętych w art. 55-57 (odtworzenie z pierwotnego Dz.U. 1995 poz. 713), dokładne dni upływu terminów z art. 58 ust. 1, art. 60 ust. 2 i art. 62 (w module podane jako miesiąc, wyliczenie własne z cezury 17.02.1996). ⛔ **Ograniczenie narzędziowe odkryte 2026-08-18:** `web_fetch` na `isap.sejm.gov.pl` i `api.sejm.gov.pl` zwraca ROBOTS_DISALLOWED w tym środowisku — punkty wymagające odczytu pełnego tekstu jednolitego wprost z RZĄD 1 (zwł. pkt 16 — odtworzenie art. 55-57 z Dz.U. 1995 poz. 713) będą wymagały źródeł pochodnych (lexlege/arslege/prawo.pl) z krzyżową weryfikacją, nie bezpośredniego fetch ISAP. |

**Bilans migracji:** 8 wierszy usuniętych z rejestru flag F- (7 w migracji
pierwotnej + F-91 w dniu 2026-08-17d), 0 punktów merytorycznych utraconych
(kolumna „Punkty" zawiera pełną, niezmienioną treść kolumny „Opis"
z pierwotnych wierszy). Przy F-91 dodatkowo: część merytoryczna o wyższej
wadze NIE została zmigrowana, lecz przeniesiona do nowej flagi **F-93**
(sekcja 1) — migracja objęła wyłącznie punkty typu „web_search per punkt".
---

## 5. Obserwacje informacyjne (nie są flagami, nie blokują)

| # | Obserwacja | Skill | Co ewentualnie zrobić |
|---|---|---|---|
| O-1 | Nowelizacja ABW/AW ws. treści terrorystycznych (Dz.U. 2024 poz. 1684) — uprawnienia Szefa ABW do nakazów usunięcia treści (implementacja rozp. UE 2021/784) nieopisane w `mod-ustawa-ABW-AW-CBA-sluzby-specjalne.md` | dr-13 | Wąska kompetencja, rzadko aktywna — opracować przy sprawie |
| O-2 | `check_rejestracja_modulow.py` wykrywa sieroctwo plików dla modułów DR (4 rejestry), ale NIE ma odpowiednika dla `references/` i `scripts/` samego audyt-systemu-v4 — stąd 15 plików mogło pozostać niezarejestrowanych (F-80, zamknięta 2026-08-15h) | audyt-systemu-v4 | Rozszerzyć skrypt albo dodać krok FAZA 0/2: `find references/ scripts/ -type f` vs YAML frontmatter |
| O-3 | ✅ **ZREALIZOWANA 2026-08-21** — test **T13** (`scripts/check_dlugosc_modulow.py`) powstał i jest zarejestrowany w YAML `scripts:`, drzewie STRUKTURA KATALOGU i `REGRESSION-TEST-PLAN.md` sekcja 13. Pierwszy przebieg: 1 ⛔ + 6 ⚠️ przed naprawami, **0 ⛔ + 5 ⚠️** po. Pozostaje wyłącznie jako pozycja informacyjna — strefę 800-1000 (5 plików) obserwuje odtąd test, nie pamięć audytora | audyt-systemu-v4 | Nic — mechanizm działa; przy najbliższej edycji któregoś z 5 plików strefy rozważyć podział przy okazji |

---

## 6. 🗺️ ZADANIE ODŁOŻONE — MAPA-MODULOW-GLOBALNA (po zamknięciu flag F-)

**Cel:** jeden zbiorczy plik (roboczo `references/MAPA-MODULOW-GLOBALNA.md`)
odwzorowujący moduł → akty i przepisy faktycznie opracowane + data ostatniej
weryfikacji TREŚCI (odrębna od daty poprawki numeru), żeby przy nowelizacji
znaleźć wszystkie moduły do aktualizacji JEDNYM wyszukiwaniem zamiast
przeglądania 16 plików.

**Powiązanie:** po powstaniu staje się pierwszym krokiem PROTOKOŁU PRZY
TRAFIENIU (sekcja 2). Dopóki nie istnieje — protokół używa ścieżki zapasowej
(16× lokalna `MAPA-AKTOW.md` + centralna `ROUTING-MAP.md` równolegle).

**Dlaczego nie teraz:** treść modułów wciąż się zmienia (nowe moduły z F-64…F-87),
mapa musiałaby powstać dwa razy. Rozważyć generowanie skryptem zamiast pliku
statycznego — inaczej sama się zdezaktualizuje.

**Status:** ODŁOŻONE — nie rozpoczynać przed zamknięciem aktywnych flag F-.

---

## 7. Raporty pokrycia 2026-08-13 — zasady usuwania

`references/raporty-pokrycia-2026-08-13/` to **11 plików (10 raportów + indeks)**
— stan na 2026-08-20y po usunięciu KPK (F-81) i KRO (F-73); pierwotnie 13 —
materiału ROBOCZEGO dostarczonego przez użytkownika — migawka z jednego dnia,
nie kanoniczna dokumentacja (⚠️ część raportów jest już nieaktualna wobec
napraw z 14–15.08 — patrz kolumna „Historia" w sekcji 1A).

- Plik raportu usuwać **dopiero po PEŁNYM zamknięciu** odpowiadającej flagi.
- Przy naprawie CZĘŚCIOWEJ — NIE usuwać: raport nadal mapuje niedomknięte fragmenty.
- `00-indeks-raportow-pokrycia.md` — usunąć dopiero, gdy wszystkie flagi zamknięte.
- Każde usunięcie → jedno zdanie w `AUDIT-JOURNAL.md` (ślad audytowy, ZASADA 7).

| Plik | Flaga |
|---|---|
| `raport-pokrycia-PPSA.md` | F-64 |
| `raport-pokrycia-KPC.md` | F-65 |
| `raport-pokrycia-KPK.md` | F-81 — USUNIĘTY 2026-08-15 (flaga zamknięta w całości) |
| `raport-pokrycia-KW.md` | F-67 — brak w rejestrze otwartych; przed usunięciem potwierdzić zamknięcie w dzienniku |
| `raport-pokrycia-KSH.md` | F-68 |
| `raport-pokrycia-PrUp-PrRestr.md` | F-86 (sekcja 1), F-87 (sekcja 2) |
| `raport-pokrycia-OP.md` | F-70 |
| `raport-pokrycia-PZP.md` | F-71 |
| `raport-pokrycia-SUS-FUS.md` | F-72 — zamknięta (AUDYT-2026-08-14h); plik do usunięcia po kontroli |
| `raport-pokrycia-KRO.md` | F-73 — USUNIĘTY 2026-08-15 (flaga zamknięta w całości) |
| `raport-pokrycia-PrBud.md` | F-74 |
| `raport-pokrycia-KKW.md` | F-75 |

---

## 8. Jak korzystać z tego pliku

- **„Co jest jeszcze otwarte?"** → sekcja ⚡ TABLICA STERUJĄCA. Nie grepuj dziennika.
- **Zaczynasz naprawę?** → najpierw HARDGATE-AUDYT (Reguły 1–6), potem wiersz flagi
  w sekcji 1, dopiero potem wskazany wpis dziennika po historię.
- **Zamykasz flagę?** → usuń jej wiersz z TABLICY i z sekcji 1, dopisz pełny opis
  naprawy do `AUDIT-JOURNAL.md` **na końcu pliku** (z numerem flagi w tytule wpisu).
- **Naprawiłeś część?** → skróć wiersz do tego, co ZOSTAŁO. Nie dopisuj tu opisu
  tego, co zrobione — to jest jedyne źródło rozrostu tego pliku.
- **Otwierasz flagę?** → wiersz w TABLICY + wiersz w sekcji 1 + wpis w dzienniku.
- **Numeracja:** WARN-N — flagi z klasycznego trybu audytowego (TRYB DZU,
  TRYB WARN-CLOSE); F-N — flagi strukturalne z sesji tematycznych. Kolejny wolny
  numer: **F-106**.
- **Aktualizuj licznik** w TABLICY STERUJĄCEJ przy każdej zmianie liczby flag.
