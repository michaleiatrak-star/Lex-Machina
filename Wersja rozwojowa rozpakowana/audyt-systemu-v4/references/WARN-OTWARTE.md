# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Plik:** `WARN-OTWARTE.md`
**Opis:** Rejestr WYŁĄCZNIE otwartych flag audytowych (WARN numerowane +
flagi strukturalne bez numeru). Zawiera TYLKO to, co jest jeszcze do
zrobienia — bez narracji historycznej, bez wpisów o zamkniętych flagach.
**Plik siostrzany:** `AUDIT-JOURNAL.md` — dziennik chronologiczny pełnej
historii sesji (otwarcia, zamknięcia, naprawy, wnioski). Zamknięcie flagi
NIE zostaje w tym pliku — trafia wyłącznie do AUDIT-JOURNAL jako część
historii. Ten plik po zamknięciu flagi traci odpowiedni wiersz.

> **Zasada podziału (wprowadzona 2026-07-07, ZASADA 10 w SKILL.md):**
> - Otwarcie nowej flagi → dodaj wiersz TUTAJ + wpis w AUDIT-JOURNAL.md.
> - Zamknięcie flagi → USUŃ wiersz STĄD + odnotuj zamknięcie WYŁĄCZNIE
>   w AUDIT-JOURNAL.md (z pełnym opisem naprawy, jak dotychczas).
> - Ten plik nie rośnie w nieskończoność — to jest "TODO", nie archiwum.
> - Przed odpowiedzią na pytanie "co jest jeszcze otwarte" / "czy wszystkie
>   WARN zamknięte" — czytaj TEN plik, nie grepuj całego AUDIT-JOURNAL.md.

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



**WARN numerowane otwarte: 0.** Wszystkie WARN-1 do WARN-29 zamknięte —
pełna historia w `AUDIT-JOURNAL.md`, wpisy AUDYT-2026-07-07a i 07-07b.

**Flagi strukturalne bez numeru WARN — otwarte:**

| # | Flaga | Skill / dziedzina | Priorytet | Otwarta od | Opis | Wymaga |
|---|---|---|---|---|---|---|
| F-5 | Ustawa ESAP (Dz.U. 2026 poz. 644) skatalogowana, bez modułu dedykowanego | dr-06-podatki-finanse-publiczne-aml | niski | 2026-07-07 (próba weryfikacji 2026-08-05: BEZ ROZSTRZYGNIĘCIA — wyszukiwanie znalazło głównie materiał o obowiązkach sprawozdawczych sektora finansowego wobec ESAP, BEZ jednoznacznego potwierdzenia konkretnego zakresu zmiany w samym KSH; NIE zgadywano odpowiedzi) | Omnibus ~17 ustaw sektora finansowego (rachunkowość, KRS, fundusze emerytalne, Prawo bankowe, KSH incydentalnie, oferta publiczna, obrót instrumentami finansowymi, ubezpieczenia, BFG, biegli rewidenci) — niska aktywność tematyczna w typowych sprawach systemu. UWAGA (2026-07-15): przy okazji naprawy F-6 nie udało się jednoznacznie potwierdzić źródłowo, na czym polega dotknięcie KSH przez tę ustawę — wymaga odrębnej weryfikacji, jeśli temat stanie się aktywny | Moduł dedykowany tylko jeśli sprawy z zakresu rynku kapitałowego/nadzoru finansowego staną się aktywne; przy tej okazji też zweryfikować konkretny zakres zmiany w KSH |
| F-8 | Żaden realny connector MCP nie jest podłączony do rozmów silnika — protokół (shared/MCP-INTEGRACJA.md) i logika klasyfikacji przetestowane w pełni, w tym od 2026-07-13h realnym serwerem referencyjnym (isap-eli-example) zweryfikowanym prawdziwym klientem MCP przez stdio, ale bez podłączenia w środowisku produkcyjnym i bez testu wobec żywego api.sejm.gov.pl | shared/MCP-INTEGRACJA.md, shared/tools/mcp-servers/isap-eli-example | średni | 2026-07-13 (zaktualizowana 2026-07-13b, 2026-07-13f, 2026-07-13h) | `test_mcp_protocol.py` (6 testów), `connector_health_check.py --self-test` (mock-serwer) — PASS. Od 2026-07-13h: `isap-eli-example/test_protokol_mcp.mjs` — prawdziwy klient MCP (`@modelcontextprotocol/sdk`) połączył się z serwerem przez stdio, wykonał handshake, `tools/list`, `tools/call` — PASS, `isap_lookup` poprawnie zwrócił ERROR przy braku dostępu sieciowego do domen .gov.pl (środowisko audytowe nie ma tego dostępu). Pozostaje: (a) wdrożenie tego lub innego connectora w środowisku developera z dostępem do api.sejm.gov.pl, (b) weryfikacja realnego kształtu odpowiedzi JSON, (c) podłączenie w klencie MCP (Claude Desktop/Code) | Developer uruchamia `npm install && node test_protokol_mcp.mjs` w `shared/tools/mcp-servers/isap-eli-example/`, potwierdza kształt odpowiedzi API, podłącza serwer w konfiguracji klienta MCP |
| F-9 | audit-trail-portal-v1 to specyfikacja + referencyjne skrypty, konwencja znacznika AUDIT_EVENT nie wdrożona w żadnym prawdziwym prompcie portalu | audit-trail-portal-v1 | niski (odpowiedzialność poza silnikiem) | 2026-07-13 (zaktualizowana 2026-07-13b) | `hash_chain_verify.py`, `append_event.py` (self-test + test integracyjny append→verify na wspólnym pliku) i `router_event_parser.py` (self-test na 4 znacznikach, 2 poprawne/2 celowo błędne) przechodzą w całości. Pozostaje: (a) wdrożenie konwencji znacznika w system promptcie portalu, (b) podłączenie parsera do realnego przepływu odpowiedzi routera, (c) polityka retencji logu | Portal implementuje konwencję znacznika + podłącza pipeline zapisu wg DOKUMENTACJA-WDROZENIOWA-2026-07-13.md, sekcja 3 |
| F-10 | sync_dzu_eli.py nie przetestowany wobec żywego Sejm ELI API | sync-dzu-automatyczny-v1 | średni | 2026-07-13 (zaktualizowana 2026-07-13b) | Logika parsowania mapy, budowy raportu ORAZ pełny przepływ end-to-end (pobierz→porównaj→raport) przetestowane przez `mock_eli_server_test.py` wobec lokalnego mock-serwera HTTP symulującego Sejm ELI — wszystko przechodzi poprawnie. Dodano też `bootstrap_last_sync_date.py` (idempotentna inicjalizacja stanu, przetestowana). Jedyny pozostały krok: zweryfikować, czy PRAWDZIWE api.sejm.gov.pl ma dokładnie taki kształt odpowiedzi (endpoint/pola JSON) jak założono — środowisko audytowe nie ma dostępu do domen .gov.pl | Developer uruchamia sync_dzu_eli.py wobec żywego API, koryguje `pobierz_nowe_pozycje_eli()` jeśli kształt się różni |
| F-11 | extract_api_verification_log.py zakłada kształt bloków server_tool_use/*_tool_result wg dokumentacji, nie wobec realnej odpowiedzi API | shared/tools | średni | 2026-07-13d | Logika ekstrakcji przetestowana w pełni na danych syntetycznych (self-test + test end-to-end na fixture `konwersacja_api_przyklad.json` → poprawne 2/4 dopasowania na realnym przykładowym piśmie systemu). Format bloków content[] nie był nigdy skonfrontowany z prawdziwą odpowiedzią Claude API z tego środowiska (sandbox audytowy nie wywołuje API bezpośrednio w ten sposób) | Developer zapisuje jedną prawdziwą odpowiedź API z wywołaniami web_search/web_fetch i uruchamia `extract_api_verification_log.py` wobec niej jako pierwszy test integracyjny przed produkcją |
| F-13 | Rozróżnienie zażalenie poziome/pionowe — CZĘŚCIOWO naprawione 2026-07-25d: (a) utworzono `shared/ZAZALENIE-ADRESAT-GATE.md` jako HARD GATE, zarejestrowaną w pisma-proste-v2 (KROK 9d) i pisma-procesowe-v3 (sekwencja W2) — wymusza weryfikację adresata przy KAŻDYM piśmie zawierającym środek zaskarżenia, niezależnie od tego, co mówi moduł dziedzinowy; (b) konkretne poprawki treściowe w 7 plikach (MOD-PRAWO.md, mod-UPEA, 3× engines, mod-KSCU, mod-UODO). **NIE zrobiono:** indywidualnej adnotacji pozostałych ok. 58 z 69 plików wspominających "zażalenie" w DR-02, 03, 06-10, 13-16 — te polegają WYŁĄCZNIE na bramce ogólnej, nie na specyficznej wiedzy dziedzinowej wpisanej do pliku | cały system | średni (obniżony z wysokiego — mechanizm systemowy teraz istnieje) | 2026-07-25 (zaktualizowana 2026-07-25d) | Bramka wymusza weryfikację NA BIEŻĄCO przy generowaniu pisma — nie eliminuje ryzyka błędu w SAMEJ tabeli DR-xx, tylko dodaje krok kontrolny przed wydaniem pisma. To złagodzenie ryzyka, nie zamknięcie luki źródłowej w każdym pliku | Jeśli zależy na pełnym pokryciu STATYCZNYM (nie tylko przez bramkę): przejść przez pozostałe ok. 58 plików per dziedzina, w kolejności wg aktywności spraw — DR-02 (cywilne) i DR-03 (karne) najpierw jako najczęściej używane |

| F-18 | Znaczniki weryfikacji w nowych sekcjach modułu VAT oparte na ŹRÓDLE-3 (web-fallback), nie na ISAP/ELI — `isap.sejm.gov.pl` blokuje `web_fetch` (ROBOTS_DISALLOWED), a `api.sejm.gov.pl/eli/.../text.pdf` dla ustawy o VAT to dokument 228-stronicowy, niemożliwy do odczytu fragmentarycznego dostępnymi narzędziami | dr-06-podatki-finanse-publiczne-aml | średni | 2026-08-12 | Treść przepisów pobrano z serwisu reprodukującego tekst jednolity Dz.U.2025.0.775 (stan na 12.08.2026), krzyżowo potwierdzoną w 2-4 niezależnych źródłach na przepis. Każda nowa sekcja nosi `✅ [VER: ...]` + `⚠️ [ZALECANA WERYFIKACJA ISAP]` zgodnie z procedurą ŹRÓDŁO-3 z PRAWO-HARDGATE. To NIE jest naruszenie hard gate'u (przepisy NIE pochodzą z pamięci modelu), ale poziom pewności jest niższy niż przy ŹRÓDLE-0/1 | Przed użyciem którejkolwiek nowej sekcji w piśmie procesowym — potwierdzić brzmienie powoływanej jednostki redakcyjnej w ISAP lub LEX/Legalis. Docelowo: rozwiązać problem fragmentarycznego odczytu dużych aktów przez ELI (np. przez konektor MCP z flagi F-8) |
| F-19 | Dług weryfikacyjny orzeczeń w nowych modułach VAT (iteracje VI-VII): kilka orzeczeń i interpretacji wskazano BEZ ustalonej albo BEZ zweryfikowanej u źródła sygnatury | dr-06-podatki-finanse-publiczne-aml | średni | 2026-08-12 | Pozycje: (a) TSUE ws. niezgodności art. 52 ust. 1 ustawy o VAT (warunek „odbiorcy przebywającego na terytorium kraju") — sygnatura NIEUSTALONA; (b) TSUE ws. przekazania środków z rachunku VAT na wniosek syndyka masy upadłości — sygnatura NIEUSTALONA; (c) linia NSA ws. fakultatywności decyzji o pozbawieniu prawa do art. 33a na 36 miesięcy — NIEZWERYFIKOWANA; (d) WSA w Łodzi I SA/Łd 190/20 i I SA/Łd 417/20 (charakter czynności wykreślenia z art. 96 ust. 9) — podane za źródłem RZĄD 2, NIEZWERYFIKOWANE u źródła; (e) interpretacje KIS 0114-KDIP1-3.4012.200.2019.2.JF oraz 0114-KDIP1-2.4012.141.2025.1.RM — podane za źródłem wtórnym. ⭐ ŁAGODZENIE: każda z tych pozycji jest w module opatrzona wyraźnym zakazem powoływania bez uprzedniej weryfikacji przez orzeczenia-sadowe-v2 / EUREKA — ryzyko wprowadzenia błędnej sygnatury do pisma jest zablokowane bramką, ale nie u źródła | Sesja dedykowana: przejść pozycje (a)-(e) przez `orzeczenia-sadowe-v2` (orzeczenia.nsa.gov.pl, curia.europa.eu, EUREKA), ustalić sygnatury i tezy, wpisać do modułów albo USUNĄĆ odesłanie, jeśli orzeczenie nie zostanie potwierdzone |





## ♾️ MONITORING — FLAGA PERMANENTNA, NIGDY NIE ZAMYKANA (dodano 2026-08-14; MON-3 dodany 2026-08-15 — oba na żądanie użytkownika)

> ⚠️ W ODRÓŻNIENIU od wszystkich pozostałych flag F- w tym rejestrze —
> TA flaga NIE JEST przeznaczona do zamknięcia. Jej "zamknięcie" byłoby
> błędem koncepcyjnym: monitorowanie zmian legislacyjnych to zadanie
> CIĄGŁE z definicji, nie jednorazowa naprawa. NIE usuwać tego wiersza
> przy porządkowaniu rejestru, NIE liczyć go do "aktywnych flag do
> zamknięcia" przy raportowaniu postępu cyklu WARN.

| # | Flaga | Zakres | Częstotliwość | Ostatnie wykonanie | Metoda | Co robić przy trafieniu |
|---|---|---|---|---|---|---|
| MON-1 | Monitoring nowelizacji aktów prawnych już pokrytych przez moduły — badanie, czy którykolwiek z ~200+ aktów bazowych śledzonych w 16 lokalnych MAPA-AKTOW.md doczekał się nowej nowelizacji/t.j. od ostatniej weryfikacji | Cały system, wszystkie DR-skille | Patrz "PROPOZYCJA HARMONOGRAMU" niżej | 2026-08-14 (ustanowienie tej flagi; wcześniejsze pojedyncze przypadki: SKD/II CSKP 89/26, system MOS/cudzoziemcy — oba wykryte NA ŻĄDANIE użytkownika, nie przez systematyczny monitoring) | web_search per akt, ze szczególnym naciskiem na akty oznaczone w mapach jako "⚠️ WYMAGA AKTUALIZACJI MODUŁU" (numer już raz się zmienił — statystycznie wyższe ryzyko kolejnej zmiany) oraz akty "żywe" (nowelizowane >3×/rok — KKW, KPK, ustawa o cudzoziemcach, PIT/VAT) | Patrz "PROTOKÓŁ PRZY TRAFIENIU" niżej |
| MON-2 | Monitoring nowych projektów ustaw / procesu legislacyjnego dla tematów o wysokim prawdopodobieństwie wejścia w życie w najbliższych 6-12 miesiącach | Cały system — priorytet dla tematów już zasygnalizowanych w sekcji "👁️ OBSERWOWANE" powyżej (obecnie: OBS-1, nowelizacja PIT/CIT/ryczałt 2027) oraz w istniejących flagach F-14/F-15 (UTO/hulajnogi, status neosędziów) | Patrz "PROPOZYCJA HARMONOGRAMU" niżej | 2026-08-14 (OBS-1 sprawdzone po raz pierwszy) | web_search per temat, sejm.gov.pl (proces legislacyjny, numery druków), RCL (Rządowe Centrum Legislacji) dla projektów rządowych | Patrz "PROTOKÓŁ PRZY TRAFIENIU" niżej |
| MON-3 | **Monitoring KWOTOWYCH stawek opłat i podatków** — dodany 2026-08-15 na żądanie użytkownika („dodaj do monitorowania informacje o opłatach od podatku"). ⭐ UZASADNIENIE ODRĘBNOŚCI OD MON-1: kwoty opłat i progi podatkowe zmieniają się w PRZEWAŻAJĄCEJ WIĘKSZOŚCI **nie nowelizacją ustawy, lecz aktem podustawowym albo obwieszczeniem waloryzacyjnym** (obwieszczenie MF o górnych granicach stawek kwotowych podatków i opłat lokalnych, rozporządzenia o stawkach opłat, komunikaty o wskaźnikach). MON-1 śledzi NOWELIZACJE aktów bazowych — takiej zmiany NIE WYKRYJE, bo numer Dz.U. ustawy pozostaje ten sam, a moduł cytujący kwotę cicho się dezaktualizuje. To jest udokumentowana ślepa plamka, nie duplikat. | (1) OPŁATY SĄDOWE — KSCU (dr-16, dr-02); (2) OPŁATA SKARBOWA + opłaty administracyjne (dr-05); (3) OPŁATY EGZEKUCYJNE — komornicze i w egzekucji administracyjnej, w tym kwota wolna od egzekucji (dr-02, dr-03, dr-05); (4) PODATKI I OPŁATY LOKALNE — coroczne obwieszczenie MF o górnych granicach stawek kwotowych (dr-06, dr-08), w tym ⭐ **OPŁATY OD POBYTU/NOCLEGU: opłata miejscowa („klimatyczna"), opłata uzdrowiskowa oraz projektowana opłata turystyczna** — DOPISANE 2026-08-15 na uwagę użytkownika, pierwotnie pominięte; ta podgrupa ma sprzężenie z MON-2/OBS-2, bo równolegle do corocznej waloryzacji stawek toczą się DWA projekty zmiany konstrukcji tych opłat; (5) PROGI I KWOTY W PIT/CIT/RYCZAŁCIE — skala, kwota wolna, limity ryczałtu, limit zwolnienia podmiotowego VAT (dr-06); (6) OPŁATY SEKTOROWE o charakterze sankcyjnym — m.in. opłata produktowa i kaucja (dr-09), opłaty koncesyjne (dr-09); (7) GRZYWNY I MANDATY — kwoty w KW/KPSW (dr-03) | **Rytm ROCZNY, nie 4-tygodniowy** — kluczowe okno: **październik–grudzień** (obwieszczenia MF i rozporządzenia na kolejny rok kalendarzowy) oraz **styczeń** (kontrola, co faktycznie weszło). Poza tym oknem — sprawdzać wyłącznie reaktywnie, przy sprawie dotyczącej konkretnej opłaty | — (ustanowiona 2026-08-15, pierwszy przegląd planowany na okno X–XII.2026) | web_search per grupa opłat + `podatki.gov.pl` i `mf.gov.pl` (obwieszczenia), `isap.sejm.gov.pl` dla rozporządzeń wykonawczych; przy podatkach lokalnych — obwieszczenie MF w Monitorze Polskim, NIE w Dz.U. (⚠️ częsty błąd wyszukiwania) | **PROTOKÓŁ ODRĘBNY OD MON-1/MON-2:** zmiana samej KWOTY zwykle NIE uzasadnia nowej flagi F- — wystarczy punktowa korekta liczby w module + wpis w AUDIT-JOURNAL. Nową flagę F- otwierać TYLKO gdy: (a) zmienia się KONSTRUKCJA opłaty (nowa przesłanka, nowy podmiot zobowiązany, nowy tryb zwolnienia), albo (b) kwota jest cytowana w >3 modułach (koszt propagacji uzasadnia śledzenie). ⛔ Kwoty NIGDY z pamięci — każda liczba wymaga odczytu ze źródła w tej samej sesji, w której trafia do modułu |

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

### 🗓️ PROPOZYCJA HARMONOGRAMU (dodano 2026-08-14, na żądanie użytkownika)

**Decyzja: JEDEN zunifikowany harmonogram dla MON-1 i MON-2 razem, NIE
dwa osobne.** Uzasadnienie: oba mechanizmy używają tej samej metody
(web_search + przegląd konkretnej listy tematów priorytetowych) i
naturalnie współdzielą tę samą sesję przeglądową — rozdzielenie na dwa
osobne zaplanowane zadania podwoiłoby narzut organizacyjny bez realnej
korzyści (nie ma powodu, dla którego sprawdzanie nowelizacji już
pokrytych aktów i sprawdzanie nowych projektów miałoby się odbywać w
INNYCH momentach — oba są tańsze i skuteczniejsze wykonywane razem,
jedną sesją web_search).

Rekomendowany zakres JEDNEGO cyklicznego zadania (do skonfigurowania
przez użytkownika jako zadanie cykliczne, np. funkcją harmonogramu
Claude, jeśli dostępna w używanym interfejsie):
- **Częstotliwość:** co 4 tygodnie jako cykl bazowy, z WYJĄTKIEM
  tematów oznaczonych priorytetem WYSOKIM w sekcji OBSERWOWANE lub w
  aktywnych flagach F- (np. F-15, status neosędziów) — te sprawdzać
  częściej, co 2 tygodnie, w RAMACH tego samego zadania (dodatkowa runda
  dla samej podgrupy wysokiego priorytetu).
- **Zakres jednej sesji:** (1) MON-2 najpierw — przejrzeć sekcję
  OBSERWOWANE + F-14/F-15 pod kątem zmiany statusu; (2) MON-1 — wybrać
  do 5-8 aktów z najwyższym ryzykiem (kryteria w kolumnie "Metoda"
  wyżej) do sprawdzenia w TEJ sesji, rotacyjnie (nie da się sprawdzić
  wszystkich ~200 aktów co 4 tygodnie — priorytetyzacja rotacyjna jest
  konieczna); (3) każde trafienie → PROTOKÓŁ PRZY TRAFIENIU wyżej.
- **Dlaczego NIE częściej:** ryzyko nadmiernego zużycia budżetu
  narzędzi (web_search) na powtarzalne, w większości negatywne
  wyniki ("brak zmian") — 4 tygodnie to rozsądny kompromis między
  aktualnością a kosztem, ZGODNY z rzeczywistym tempem publikacji
  nowelizacji w polskim systemie prawnym (rzadko coś istotnego zmienia
  się częściej niż raz na kilka tygodni dla pojedynczego aktu).



**Odróżnienie MON-1/MON-2 od zwykłych flag F-:** F- oznacza KONKRETNĄ,
already-zidentyfikowaną lukę o określonym zakresie (da się opisać "co
dokładnie brakuje" i "kiedy będzie zamknięta"). MON- oznacza SAM
MECHANIZM/NAWYK sprawdzania — nie ma zakresu, który dałoby się
"wyczerpać". Analogia: F- to konkretne zadanie na liście TODO; MON- to
nawyk sprawdzania poczty — nigdy nie jest "zrobiony", tylko wykonywany
cyklicznie.



Katalog zawiera 13 plików (12 raportów pokrycia + 1 indeks zbiorczy, dostarczonych przez użytkownika 2026-08-13 w trzech turach) — materiał źródłowy dla flag **F-64 do F-75**. To materiał ROBOCZY/TYMCZASOWY, nie kanoniczna dokumentacja systemu — w przeciwieństwie do `MAPA-AKTOW.md` czy modułów, raporty te są migawką stanu na dzień analizy i staną się nieaktualne, gdy odpowiadające im luki zostaną wypełnione.

**Zasada usuwania — per plik, nie zbiorczo:**
- Gdy WSZYSTKIE punkty z danej flagi (np. F-75/KKW) zostaną naprawione i flaga zostanie formalnie ZAMKNIĘTA w tabeli powyżej (wpis przeniesiony do sekcji zamkniętych / usunięty z aktywnego rejestru) → odpowiadający plik raportu (np. `raport-pokrycia-KKW.md`) **można usunąć**.
- **NIE usuwać pliku, jeśli flaga jest tylko CZĘŚCIOWO naprawiona** (np. domknięto 2 z 4 rekomendowanych punktów) — raport nadal ma wartość jako mapa pozostałych, niedomkniętych fragmentów aktu; dopiero pełne zamknięcie flagi czyni raport zbędnym.
- Plik `00-indeks-raportow-pokrycia.md` usunąć dopiero, gdy WSZYSTKIE flagi F-64–F-75 są zamknięte (indeks odnosi się zbiorczo do całego zestawu).
- Przy usuwaniu pliku raportu — dopisać w AUDIT-JOURNAL.md jedno zdanie potwierdzające usunięcie i przyczynę (flaga zamknięta, data), żeby ZASADA 7 (ślad audytowy) była zachowana mimo usunięcia samego pliku źródłowego.

**Mapowanie plik → flaga (do sprawdzania przy każdym zamknięciu):**

| Plik | Flaga(i) |
|---|---|
| `raport-pokrycia-PPSA.md` | F-64 |
| `raport-pokrycia-KPC.md` | F-65 |
| `raport-pokrycia-KPK.md` | F-66 (powiązana z F-23) |
| `raport-pokrycia-KW.md` | F-67 |
| `raport-pokrycia-KSH.md` | F-68 |
| `raport-pokrycia-PrUp-PrRestr.md` | F-69 |
| `raport-pokrycia-OP.md` | F-70 |
| `raport-pokrycia-PZP.md` | F-71 |
| `raport-pokrycia-SUS-FUS.md` | F-72 |
| `raport-pokrycia-KRO.md` | F-73 |
| `raport-pokrycia-PrBud.md` | F-74 |
| `raport-pokrycia-KKW.md` | F-75 |

## DR-02 (naprawa 2026-08-13b/c) — flaga rezydualna

✅ Sekcja bez otwartych flag F-. Dawna **F-22** przeniesiona 2026-08-15n
do rejestru **🔁 REAKTYWNE (REACT-1)** — treść punktów zachowana tam w całości.


## DR-03 (badanie 2026-08-13)

> 🔁 Dawna **F-26** przeniesiona 2026-08-15n do rejestru **REACT-1**
> (7 punktów „punkt startowy"). W tej sekcji pozostaje wyłącznie F-24.

| F-24 | DR-03 — nowelizacja narkomanii: ✅ METRYKA I ZAKRES DOPRECYZOWANE 2026-08-14c u źródła Rzędu 1 (orka.sejm.gov.pl, tekst ustawy, druk 2499) — ustawa z 11.06.2026 o zmianie ustawy o przeciwdziałaniu narkomanii oraz niektórych innych ustaw, podpisana 24.07.2026, zmienia t.j. Dz.U. 2023 poz. 1939; potwierdzono nową definicję leczenia substytucyjnego (art. 28), art. 28g (Wykaz KCPU), art. 15h ustawy o Policji, zmianę Kodeksu morskiego. ⛔ **NUMER Dz.U. SAMEJ NOWELIZACJI NADAL NIEUSTALONY — 5 nieudanych prób** (08-13, 08-14c, 08-15: 3 zapytania web_search po tytule aktu, treści merytorycznej i formule cytowania „Dz. U. z 2023 r. poz. 1939 oraz z 2026 r. poz. …"; eli.gov.pl/eli/DU/2026 zwraca ROBOTS_DISALLOWED przy web_fetch); NIE interpolowano mimo znanych pozycji 1003 i 1005 z tego samego dnia (zakaz — ZASADA 3). ⭐ **PRÓBY 4-5 i USTALENIA UBOCZNE 2026-08-15n** (Rząd 1: orka.sejm.gov.pl/proc10.nsf/ustawy/2499_u.htm oraz druk 10-RPW-15291-2026): numeru nadal NIE ustalono (3 kolejne zapytania web_search — po tytule z frazą "Dz.U. 2026 poz.", po formule cytowania i po dacie ogłoszenia), ale potwierdzono u źródła: (a) ZAMKNIĘTY katalog aktów zmienianych — **TRZY**: ustawa o Policji (nowy art. 15h), Prawo farmaceutyczne (art. 72 ust. 8 pkt 5) i Kodeks morski; (b) art. 11 aktu: wchodzi w życie **po upływie 30 dni od ogłoszenia** — data wejścia w życie pozostaje nieustalona dopóki nieznany numer/data promulgacji; (c) ⚠️ w samym tekście uchwalonym widnieje luka redakcyjna "(Dz. U. z 2023 r. poz. 1939 oraz z …)" — potwierdza, że numer nadawano po uchwaleniu, więc źródła sejmowe go NIE zawierają z definicji; ⭐ (d) KROSWERYFIKACJA MAPY Dz.U. (efekt uboczny, wartość samodzielna): tekst aktu cytuje **PrFarm Dz.U. 2026 poz. 612** i **KPA Dz.U. 2025 poz. 1691** — oba ZGODNE z `mapa_dzu_2026-07-15.md` (wiersze 205 i 260) → niezależne potwierdzenie Rzędu 1 dla dwóch kluczowych tekstów jednolitych | dr-03-prawo-karne-wykroczenia-egzekucja (`mod-ustawa-narkomania.md`) | niski (obniżony — brakuje wyłącznie technicznego numeru promulgacji, treść i status pewne) | 2026-07-04, aktualizacje: 2026-08-13, 2026-08-14c, 2026-08-15n | ⚠️ NOWA ROZBIEŻNOŚĆ: Sejm datuje akt na 11.06.2026, LEX podaje uchwalenie 3.07.2026 (61. posiedzenie) — prawdopodobnie poprawki Senatu, NIEPOTWIERDZONE | ISAP wyszukiwanie po tytule aktu zmieniającego; alternatywnie eli.gov.pl/eli/DU/2026/ w okolicy poz. 1000-1010 — ale NUMER MUSI być ODCZYTANY, nie wyliczony |

**Flaga cross-DR odkryta 2026-08-15c przy zamykaniu F-25:**

| # | Flaga | Skill / dziedzina | Priorytet | Otwarta od | Opis | Wymaga |
|---|---|---|---|---|---|---|
| F-79 | **✅ CZĘŚCIOWO ZWERYFIKOWANE (sesja 2026-08-15u) — wpływ na KSCU i Ordynację podatkową POTWIERDZONY FAKTYCZNIE, dokładny zakres artykułów NADAL nieustalony.** Ustawa z 2026 r. o zmianie ustawy o PIP oraz niektórych innych ustaw (Dz.U. 2026 poz. 473, w życie 8.07.2026) — zmienia SIEDEM aktów, a system odnotował skutki tylko dla CZĘŚCI z nich. Odkryte 2026-08-15 przy zamykaniu F-25. Akt zmienia: ustawę o PIP, Kodeks pracy, Ordynację podatkową, ustawę o warunkach dopuszczalności powierzania pracy cudzoziemcom, KPSW, KSCU oraz ustawę o SUS. ✅ ODNOTOWANE JUŻ WCZEŚNIEJ: PIP i KP (dr-04, wpis 2026-07-18), KPSW (dr-03). ✅ **POTWIERDZONE JAKO FAKTYCZNE (nie tylko przypuszczenie) w sesji 2026-08-15u:** (a) **KSCU** — poz. 473 figuruje DWUKROTNIE w amendment trail ustawy o kosztach sądowych w sprawach cywilnych na przepisy.gofin.pl, więc wpływ na KSCU jest realny, ale KONKRETNY zakres artykułów NIE został ustalony (dostępne źródła — Rząd 2/3 — nie podają numerów zmienianych artykułów KSCU wprost, tylko potwierdzają sam fakt nowelizacji; oficjalny komunikat prezydent.pl blokuje automatyczny dostęp — ROBOTS_DISALLOWED); (b) **Ordynacja podatkowa** — infor.pl (obwieszczenie ws. t.j. Ordynacji, Dz.U. 2026.622) WPROST wymienia poz. 473 jako pozycję 14 na liście aktów zmieniających Ordynację, niezależnie potwierdzone przez podatkowyreferat.online — wpływ potwierdzony faktycznie, zakres artykułów nadal nieustalony. ⛔ **NADAL NIEZBADANE:** dokładny zakres zmian w KSCU i Ordynacji podatkowej (mimo potwierdzenia SAMEGO FAKTU zmiany), wpływ na ustawę o SUS, wpływ na ustawę o powierzaniu pracy cudzoziemcom. ⭐ Odrębnie: nowe uprawnienie PIP do stwierdzania istnienia stosunku pracy w drodze DECYZJI (nowy art. 11 pkt 7a ustawy o PIP) + interpretacje indywidualne GIP (nowy art. 14b) — sprawdzić, czy moduł dr-04 opisuje oba | cross-DR: dr-02, dr-04, dr-05, dr-06, dr-16 | **średni** (obniżony z średni-wysoki — fakt wpływu na KSCU/Ordynację potwierdzony, ryzyko "moduł milczy o czymś nieistniejącym" wykluczone; pozostaje ryzyko "moduł milczy o czymś realnym") | 2026-08-15, częściowa weryfikacja: 2026-08-15u | Tekst aktu: ISAP `WDU20260000473` (Rząd 1, PDF, dostęp zablokowany bezpośrednio przez ROBOTS_DISALLOWED — dane z infor.pl/przepisy.gofin.pl jako Rząd 2 pośredniczące); wykaz zmienianych ustaw potwierdzony w infor.pl (DZU.2026.097.0000473); KSCU — przepisy.gofin.pl (amendment trail); Ordynacja podatkowa — infor.pl (DZU.2026.131.0000622) + podatkowyreferat.online (niezależne potwierdzenie) | 1) Uzyskać pełny tekst ustawy 473 spoza ISAP (np. orka.sejm.gov.pl, druk 2250, lub sip.lex.pl) — dotychczasowe źródła Rządu 2/3 potwierdzają FAKT zmiany, nie PODAJĄ numerów artykułów KSCU/Ordynacji; 2) dr-04 — czy moduł PIP opisuje art. 11 pkt 7a (decyzja o stosunku pracy) i art. 14b (interpretacje GIP); 3) SUS i ustawa o powierzaniu pracy cudzoziemcom — zakres zmiany wciąż całkowicie nieustalony |

## 👁️ OBSERWOWANE — ZMIANY LEGISLACYJNE W TOKU (nie są flagami błędów — projekty ustaw jeszcze nieuchwalone, śledzone proaktywnie żeby nie przeoczyć wejścia w życie)

| ID | Projekt | Zakres dotknięty | Priorytet monitorowania | Status na 2026-08-14 | Źródło | Akcja przy zmianie statusu |
|---|---|---|---|---|---|---|
| OBS-1 | **Nowelizacja PIT/CIT/ryczałt na 2027 r.** (projekt UD116, Rządowe Centrum Legislacji, pilotowany przez MF/Andrzej Domański) | dr-06-podatki-finanse-publiczne-aml (`mod-PIT-podatek-dochodowy-fizyczne.md` i pokrewne, `mod-VAT-*` NIE dotyczy — to PIT/CIT/ryczałt) | średni-wysoki (planowane wejście 1.01.2027, ale zakres ISTOTNIE ZMNIEJSZONY między wersją kwietniową a lipcową — z 30+ do ~15 zmian; projekt NADAL na etapie opiniowania, może się zmienić ponownie) | Projekt opublikowany na RCL 16.03.2026, przyjęty przez Radę Ministrów (data dokładna niepotwierdzona w tym badaniu). Wersja z końca lipca 2026 (analiza pokazuje "zeszło z 30+ do ~15 modyfikacji") — kilka pierwotnych, radykalnych pomysłów WYCOFANYCH: podwyżka ryczałtu 8,5%→17% dla usług na rzecz podmiotów powiązanych — WYCOFANA (zostaje 8,5%); podwyżka ryczałtu od najmu >100 tys. zł, 12%→15% — WYCOFANA (zostaje 12%). Pozostałe w projekcie: (1) ulga mieszkaniowa (zwolnienie ze sprzedaży nieruchomości przed 5 lat) — ponowne skorzystanie możliwe dopiero po 3 latach od poprzedniego (obecnie: bez ograniczenia częstotliwości); (2) sprzedaż składników majątku wycofanych z działalności na rzecz rodziny — okres zwolnienia z PIT wydłużony z 6 miesięcy do 3 lat; (3) PIT-11/PIT-8C — zapowiadana "rewolucja" w obiegu informacji rocznych, pełna cyfryzacja (analiza pitax.pl sygnalizuje ryzyko osłabienia pozycji podatnika); (4) automatyczne udostępnianie danych — od 1.12.2026; nowe zasady korekty ksiąg/JPK — od 1.01.2027; (5) CIT: ograniczenie "ukrytej dywidendy" (dzierżawa znaku towarowego/nieruchomości wspólnika dla własnej spółki), datio in solutum jako odpłatne zbycie. **ODRĘBNY, LUŹNIEJSZY wątek** (na wcześniejszym etapie, nie część UD116): rozważana gruntowna reforma SKALI PIT — dodatkowe, pośrednie progi podatkowe zamiast podniesienia kwoty wolnej do 60 tys. zł (obietnica wyborcza WYCOFANA ze względu na koszt 45-50 mld zł/rok) — rząd deklaruje projekt do Sejmu JESIENIĄ 2026, z półrocznym vacatio legis (czyli NIE wejdzie 1.01.2027, raczej w trakcie 2027) | web_search 2026-08-14, 6+ źródeł (zero.pl, akademialtca.pl, goniec.pl, pitax.pl, pit.pl, wprawieni.pl, taxcoach.pl, stronymonki.pl) | Sprawdzić status co 4-6 tygodni (projekt w aktywnej fazie legislacyjnej, zakres już raz istotnie się zmienił). Gdy ustawa zostanie UCHWALONA — przenieść z tej sekcji do standardowej naprawy (nowa flaga F- lub bezpośrednia aktualizacja modułu PIT), z priorytetem WYSOKIM (wejście w życie 1.01.2027 lub w trakcie 2027 przy reformie skali) |
| OBS-2 | **Opłaty od pobytu/noclegu — DWA równoległe projekty zmiany** (dodane 2026-08-15 na uwagę użytkownika): **(A) RZĄDOWY** — projekt ustawy o zmianie ustawy o podatkach i opłatach lokalnych z 28.05.2026 (RCL); **(B) POSELSKI (Lewica)** — zastąpienie opłaty miejscowej „opłatą turystyczną" przy zachowaniu opłaty uzdrowiskowej bez zmian | dr-06-podatki-finanse-publiczne-aml oraz dr-08-samorzad-terytorialny-prawo-lokalne (ustawa z 12.01.1991 o podatkach i opłatach lokalnych); pośrednio dr-02 (umowy najmu krótkoterminowego / usługi hotelarskie) | **WYSOKI** — projekt (A) zakłada wejście w życie **1.01.2027**, a zmienia PODMIOT ZOBOWIĄZANY, nie tylko stawkę | Stan na 2026-08-15: **(A)** — projekt z 28.05.2026 opublikowany na RCL. ⭐ ISTOTA: opłaty miejscowa i uzdrowiskowa mają być powiązane ze **świadczeniem usług zakwaterowania** (nowa definicja w słowniczku ustawy: usługi hotelarskie w rozumieniu art. 3 ust. 1 pkt 8 ustawy o usługach hotelarskich + noclegi w sanatoriach), a **prowadzący obiekt noclegowy ma stać się PŁATNIKIEM zamiast inkasentem** — to przesunięcie odpowiedzialności publicznoprawnej na hotelarza/wynajmującego, nie kosmetyka. Celem jest likwidacja sporów o CEL pobytu (turystyczny vs służbowy). RPO zgłaszał wątpliwości interpretacyjne (m.in. od kiedy liczy się „doba"/„noc"). **(B)** — projekt poselski: rezygnacja z kryteriów klimatycznych i krajobrazowych, każda gmina mogłaby wprowadzić opłatę turystyczną, także dla wybranych jednostek pomocniczych; opłata uzdrowiskowa bez zmian; samorządy popierają kierunek, zgłaszają uwagi szczegółowe. ⚠️ Oba projekty dotyczą TEJ SAMEJ materii i mogą się wykluczać — śledzić, KTÓRY wejdzie | web_search 2026-08-15: prawo.pl, Serwis Samorządowy PAP, Gazeta Prawna, infor.pl, podatkowyreferat.online (Rząd 2B/3); tekst projektu (A) na RCL, projektu (B) w drukach sejmowych — ⚠️ NUMERY DRUKU/POZYCJI RCL NIEUSTALONE, nie zgadywano | Gdy którykolwiek zostanie UCHWALONY: nowa flaga F- wg PROTOKOŁU PRZY TRAFIENIU, priorytet WYSOKI (zmiana konstrukcji opłaty, nie kwoty — to przypadek, w którym MON-3 NAKAZUJE otwarcie flagi). Sprawdzać co 4 tygodnie, częściej po 1.10.2026 (okno przed planowanym wejściem 1.01.2027) |
| OBS-3 | **Regulacja UTO/hulajnóg elektrycznych i e-rowerów** (przeniesione 2026-08-15 z flagi **F-14**, otwartej 2026-08-04 — patrz uzasadnienie migracji w AUDIT-JOURNAL, wpis 2026-08-15c). ⚠️ To NIE JEST „delegalizacja UTO" (błędne uproszczenie medialne), lecz REGULACYJNE ZAOSTRZENIE | dr-03-prawo-karne-wykroczenia-egzekucja (`mod-przerobki-modyfikacje-pojazdow.md`, sekcja 1) | niski | Stan na 2026-08-05 (bez zmian do 2026-08-15): komunikat MI z 10.07.2026 — DWIE ustawy do zmiany (o systemach homologacji pojazdów ORAZ o kierujących pojazdami) + rozporządzenie ws. warunków technicznych pojazdów. TDT ma decydować, jakie urządzenia wejdą na rynek; Straż Miejska ma dostać uprawnienia do kontroli parametrów na miejscu (hamownie dla policji do pomiaru mocy/prędkości); ⭐ e-ROWERY powyżej 25 km/h mają wymagać REJESTRACJI jak motorowery. Planowane wejście: 1.01.2027 wg JEDNEGO źródła — NIEPOTWIERDZONE. ⛔ ODRZUCONE ŹRÓDŁO: dane „18 lat, konfiskata 30 dni" (forsal.pl) dotyczą MACEDONII PÓŁNOCNEJ (109. sesja parlamentu, 30.06.2026), NIE Polski | web_search 2026-08-04/05, komunikat MI | Sprawdzać bliżej 1.01.2027; przy uchwaleniu — nowa flaga F- wg PROTOKOŁU PRZY TRAFIENIU |
| OBS-4 | **Pakiet „praworządnościowy": status neosędziów, KRS, reforma USP** (przeniesione 2026-08-15 z flagi **F-15**, otwartej 2026-08-07). ⚠️ Jedyna pozycja OBSERWOWANA o bezpośrednim wpływie na WAŻNOŚĆ ORZECZEŃ — traktować priorytetowo mimo przeniesienia z rejestru flag | dr-01-ustroj-konstytucyjny-i-zrodla-prawa (`mod-ustawa-KRS-i-ustroj-wladzy.md`, `mod-USP-ustroj-sadow-powszechnych.md`) | **WYSOKI** | Stan zweryfikowany 2026-08-14. ROZSTRZYGNIĘTE: (1) nowelizacja ustawy o KRS (wybór 15 sędziów-członków przez sędziów) uchwalona 23.01.2026, Senat 28.01.2026, **ZAWETOWANA przez Prezydenta 19.02.2026** (zarzut „segregacji sędziów"); (2) „plan B" — uchwała Sejmu z 27.02.2026 o uwzględnieniu woli sędziów wyrażonej w zgromadzeniach, na podstawie wciąż obowiązującej ustawy z 12.05.2011; (3) **15.05.2026 Sejm WYBRAŁ nową KRS** (235 głosów, wymagane 3/5), kadencja od 16.05.2026, pierwsze posiedzenie 9-10.06.2026; (4) węższa nowelizacja USP (asesorzy w wydziałach rodzinnych/nieletnich) UCHWALONA — **Dz.U. 2026 poz. 370**. NADAL W TOKU: (a) szersza ustawa Żurka o STATUSIE neosędziów (kategorie zielona/żółta, unieważnienie części uchwał dawnej KRS, powtórzenie konkursów) — UTKNĘŁA w komisji z braku kworum, odłożona „po wakacjach"; TO JEST główne źródło ryzyka dla ważności orzeczeń; (b) duża reforma USP (UD322/UD323 — spłaszczenie struktury, jednolity status sędziego, szersze kompetencje MS) na etapie opiniowania, RPO zgłosił 34-stronicową opinię z zastrzeżeniami konstytucyjnymi; (c) deadline ETPC (wyrok pilotażowy Wałęsa p. Polsce): listopad 2026 | web_search 2026-08-14 | Sprawdzać **co 2-3 tygodnie** (najkrótszy interwał w całej sekcji), priorytet na powrót prac komisji sejmowej po wakacjach. Przy uchwaleniu ustawy o statusie neosędziów — natychmiast nowa flaga F- o priorytecie NAJWYŻSZYM |

## 🗺️ ZADANIE ODŁOŻONE — WYKONAĆ PO ZAMKNIĘCIU WSZYSTKICH FLAG F- (na żądanie użytkownika, 2026-08-13)

> 🔗 POWIĄZANIE (dodano 2026-08-14): ta mapa jest BEZPOŚREDNIO
> wykorzystywana przez "📋 PROTOKÓŁ PRZY TRAFIENIU" w sekcji
> "♾️ MONITORING" wyżej — po jej powstaniu STAJE SIĘ pierwszym,
> najszybszym źródłem przy lokalizowaniu modułów dotkniętych nową
> nowelizacją. DOPÓKI nie powstanie, protokół MON korzysta z
> zapasowej ścieżki (16× lokalna MAPA-AKTOW.md + centralna
> ROUTING-MAP.md równolegle).

**Cel:** dla każdego modułu w każdym DR-skillu — zwięzła, ustandaryzowana
mapa "czym moduł się zajmuje + jakie konkretne akty/przepisy pokrywa",
żeby przy nowelizacji ustawy dało się OD RAZU znaleźć wszystkie moduły
do aktualizacji, zamiast przeszukiwać treść każdego z osobna.

**Dlaczego na końcu, nie teraz:** tworzenie tej mapy PRZED zamknięciem
otwartych flag oznaczałoby mapowanie modułów, których treść i tak się
zmieni (nowe moduły jak F-64/PPSA, F-75/KKW, przepisany od podstaw;
istniejące moduły uzupełniane o nowe artykuły) — mapa musiałaby być
tworzona dwa razy. Czekamy, aż stan modułów się ustabilizuje.

**Zakres (roboczy szkic, do doprecyzowania przy realizacji):**
- Per moduł: nazwa aktu + numer Dz.U. (już częściowo w MAPA-AKTOW.md
  per-DR, ale ROZPROSZONE po 16 osobnych plików) + lista artykułów/
  rozdziałów faktycznie opracowanych (nie całego aktu) + data ostatniej
  weryfikacji treści (odróżnić od daty poprawki samego numeru — patrz
  wzorzec ryzyka z F-25/F-28/F-31/F-40/F-45/F-49/F-57, gdzie numer był
  poprawny, ale treść nie zdążyła być re-zweryfikowana)
- Format: prawdopodobnie JEDEN zbiorczy plik (np. `references/
  MAPA-MODULOW-GLOBALNA.md` w audyt-systemu-v4) zamiast 16 rozproszonych,
  żeby przy nowelizacji jednego aktu (np. KPC, używanego w 4+ DR) dało
  się go znaleźć JEDNYM wyszukiwaniem, nie przeglądaniem 16 plików
- Rozważyć czy to ma być statyczny plik czy wygenerowany skryptem
  (bash/python przeszukujący wszystkie MAPA-AKTOW.md + nagłówki modułów)
  — automatyzacja zmniejszy ryzyko, że mapa sama stanie się nieaktualna
  (ten sam wzorzec ryzyka co "stara notatka", F-44/F-49/F-52/F-58)

**Status:** ODŁOŻONE — nie rozpoczynać przed zamknięciem wszystkich
aktywnych flag F- w tym rejestrze.

## DR-04 (badanie 2026-08-13)

> 🔁 Dawna **F-29** przeniesiona 2026-08-15n do rejestru **REACT-1**.

| F-28 | DR-04 — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14: najpilniejszy punkt (6, ustawa antymobbingowa) NAPRAWIONY — Dz.U. 2026 poz. 1046, w życie 5.11.2026. **Pozostaje 5 flag** ⚠️ istniejących WYŁĄCZNIE lokalnie w `MAPA-AKTOW.md` DR-04 | dr-04-prawo-pracy-zus-swiadczenia | niski-średni (obniżony — najpilniejszy punkt zamknięty) | 2026-07-02 do 2026-07-30, migracja: 2026-08-13, częściowa naprawa: 2026-08-14 | (1) `mod-KRUS-rolnicze-ubezpieczenia` — numer poprawiony (2024.90→2025.1770), TREŚĆ niezweryfikowana; (2) `mod-ustawa-pomoc-spoleczna` — numer poprawiony (2025.1214→2026.639), TREŚĆ niezweryfikowana; (3) `mod-SUS-ZUS-ubezpieczenia-spoleczne` — niepotwierdzona ewentualna zmiana Dz.U. 2026 poz. 507; (4) `mod-ustawa-zwiazki-zawodowe-spory-zbiorowe` — NAZWA modułu myląca (dotyczy układów zbiorowych, nie sporów zbiorowych); (5) `mod-KP-dzial-III-wynagrodzenie-swiadczenia-jawnosc` — status ustawy implementującej Etap 2-3 dyrektywy UE 2023/970 niepotwierdzony | Web_search per punkt |

## DR-05 (badanie 2026-08-13)

✅ Wszystkie flagi tej sekcji zamknięte — F-31 (2026-08-14o) i F-32
(2026-08-15b). DR-05 ma 0 otwartych flag F-.

## DR-06 (badanie 2026-08-13)

✅ Sekcja bez otwartych flag F-. Dawna **F-35** przeniesiona 2026-08-15n
do rejestru **REACT-1**.


## DR-07 (badanie 2026-08-13)

> 🔁 Dawna **F-38** przeniesiona 2026-08-15n do rejestru **REACT-1**.

| F-36 | DR-07 — nietypowo WYSOKA koncentracja flag "WYMAGA AKTUALIZACJI MODUŁU": 4 z 16 modułów (25%) + moduł GŁÓWNY (PZP) z własnym zastrzeżeniem częściowej re-weryfikacji | dr-07-zamowienia-publiczne-fundusze-ue | średni-wysoki | 2026-07-02, migracja: 2026-08-13 | (1) `mod-PZP-zamowienia-publiczne-KIO.md` (moduł GŁÓWNY) — numer poprawiony (2024.1320→2026.793), reszta modułu nieweryfikowana; (2) `mod-ustawa-Prokuratorii-Generalnej.md` — numer poprawiony (2023.1109→2024.1192); (3) `mod-ustawa-RIO-regionalne-izby.md` — numer poprawiony (2023.1325→2025.7); (4) `mod-ustawa-dyscyplina-finansow-publicznych.md` — numer poprawiony (2024.104→2025.1484); (5) `mod-ustawa-fundusze-UE-pomoc-publiczna.md` — numer poprawiony (2024.1655→2025.1733) | Priorytet: PZP jako moduł główny w pierwszej kolejności |

## DR-09 (badanie 2026-08-13)

> 🔁 Dawna **F-42** przeniesiona 2026-08-15n do rejestru **REACT-1**.

| F-40 | DR-09 — 3 flagi ⚠️ "WYMAGA AKTUALIZACJI MODUŁU" istniejące wyłącznie lokalnie | dr-09-budownictwo-srodowisko-energia-transport | średni | 2026-07-02, migracja: 2026-08-13 | (1) `mod-PrGeodezyjne-kartografia-wywlaszczenia.md` — numer poprawiony (2023.1752→2024.1151); (2) `mod-UGN-gospodarka-nieruchomosciami.md` — numer poprawiony (2024.1899→2026.399); (3) `mod-prawo-geologiczne-gornicze.md` — numer poprawiony (2024.1290→2026.69) | Web_search per punkt |

## DR-10 (badanie 2026-08-13)

> 🔁 Dawna **F-47** przeniesiona 2026-08-15n do rejestru **REACT-1**.

| F-45 | DR-10 — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-13: rejestracyjna część naprawiona — dodano 2 wpisy `[✓]` i 1 wiersz mapy. **Pozostają 3 flagi treściowe "WYMAGA AKTUALIZACJI MODUŁU"** | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | niski-średni (obniżony po zamknięciu części rejestracyjnej) | 2026-07-02 do 2026-08-12, częściowa naprawa: 2026-08-13 | (1) GIS w `mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny.md` — numer poprawiony, treść niezweryfikowana; (2) Prawo oświatowe w `mod-ustawa-oswiata-szkolnictwo-wyzsze.md` — numer poprawiony, treść niezweryfikowana; (3) oba składniki `mod-ustawa-edukacja-specjalna-dostepnosc.md` — POTWIERDZONE: ten sam błędny numer źródłowy 2022.2240 co w DR-05 (F-31, wciąż otwarta) | FAZA 3E dla wszystkich 3 — rozważyć naprawić razem z F-31 (ten sam akt) |

## DR-11 (badanie 2026-08-13)

| F-48 | DR-11 — `mod-ustawa-certyfikacja-cyberbezpieczenstwa.md` jest UCZCIWIE oznaczony jako STUB (nie ukryty "moduł-widmo"), nigdy nierozbudowany. ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14b: lit. (b) — 3 moduły rodziny RODO (DPIA, DSAR, RCP-DPA) DOPISANE do MAPA-AKTOW.md, mapa DR-11 kompletna (22/22) | dr-11-cyfrowe-cyber-ai-dane-ip | niski — świadomie odłożone | 2026-06-05 (STUB), 2026-08-13 (migracja), częściowa naprawa: 2026-08-14b | STUB: akt bazowy (Dz.U. 2025 poz. 1017) już potwierdzony | Rozbudować STUB gdy przepisy wejdą w życie |
| F-49 | DR-11 — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-13: sprzeczna notatka (KSC/NIS2 wciąż wymieniana jako otwarta mimo zamknięcia 2026-07-26) NAPRAWIONA — usunięta z notatki podsumowującej. **Pozostają 3 standardowe flagi "WYMAGA AKTUALIZACJI MODUŁU"** | dr-11-cyfrowe-cyber-ai-dane-ip | niski-średni (obniżony po naprawie notatki) | 2026-07-02, częściowa naprawa: 2026-08-13 | (1) `mod-PrTelekom-poczta-UKE.md` — numer poprawiony (1220→1221) + NAZWA myląca; (2) `mod-ustawa-informatyzacja-podmiotow-publicznych.md` — numer poprawiony (2024.1557→2025.1703); (3) `mod-ustawa-podpis-elektroniczny.md` — numer poprawiony (2016.147→2016.1579), eIDAS 2.0 w toku | FAZA 3E dla 3 pozostałych |

## DR-12 (badanie 2026-08-13)

✅ Sekcja bez otwartych flag F-. **F-56 ZAMKNIĘTA 2026-08-15n** decyzją
audytową (wątek adwokatura zamknięty formalnie — patrz AUDIT-JOURNAL.md,
wpis AUDYT-2026-08-15n). Metodologia i wyniki wątku radcowskiego
pozostają w dzienniku i mogą zostać odtworzone, jeśli temat wróci.


## DR-13 (badanie 2026-08-13)

✅ Wszystkie flagi tej sekcji zamknięte — patrz `AUDIT-JOURNAL.md`, wpis
AUDYT-2026-08-14aa-F57-ZAMKNIĘTA. DR-13 ma 0 otwartych flag F-.

## DR-14 (badanie 2026-08-13)

| F-60 | DR-14 — luka strukturalna: Konwencje Wiedeńskie o stosunkach dyplomatycznych (1961) i konsularnych (1963) — ZERO wzmianek | dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka | średni | 2026-08-13 | Brak — temat nigdy nie był opracowany | Nowy moduł/rozszerzenie mod-NATO / mod-ONZ |
| F-61 | DR-14 — luka strukturalna: Konwencja genewska 1951 o statusie uchodźców + Protokół 1967 — ZERO wzmianek w DR-14 I DR-05 | dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka (możliwie też dr-05) | średni | 2026-08-13 | Historycznie sprawdzone razem z F-30 (DR-05, cudzoziemcy/Ukraina — ZAMKNIĘTA 2026-08-13, była tylko przestarzałą notatką, nie realną treściową luką) — TA flaga (F-61) pozostaje otwarta jako ODRĘBNA, REALNA luka: fundament traktatowy (definicja uchodźcy, non-refoulement) wciąż nieobecny w żadnym module | Ustalić właściwy DR dla tego traktatu (prawdopodobnie DR-14 jako fundament + odesłanie z DR-05) |

## DR-15 (badanie 2026-08-13)



## RAPORTY POKRYCIA 2026-08-13 (materiał zewnętrzny, dostarczony przez użytkownika)

> Pełne raporty (metodologia, tabela rozdział-po-rozdziale, uzasadnienia) zachowane trwale w `references/raporty-pokrycia-2026-08-13/`. Poniższe wiersze to skrócone streszczenia z odniesieniem do pliku źródłowego — przy naprawie zawsze wczytać pełny raport, nie polegać wyłącznie na tym wierszu. Priorytety wg indeksu zbiorczego (`00-indeks-raportow-pokrycia.md`) — patrz też sekcja "Najpilniejsze braki łącznie" w tym pliku dla rankingu cross-kodeksowego.

| F-64 | **PPSA — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-13:** pierwszy dedykowany moduł PPSA UTWORZONY (`mod-PPSA-terminy-kasacja-prawo-pomocy.md`), naprawiając 3 z 5 pierwotnie wskazanych priorytetów: uchybienie/przywrócenie terminu (85-89), skarga kasacyjna do NSA (173-193), prawo pomocy (245-259). Jedna wyspa była już wcześniej dobrze opracowana: kwalifikacja skargi (art. 3 §2, 50–62, 145/147/148/152), NIE dotknięta tą naprawą. **Pozostają otwarte:** sprzeciw od decyzji/postanowienia (64a–64e), wznowienie postępowania sądowoadministracyjnego (270–285), posiedzenia sądowe (90-114), pełne opracowanie orzeczeń poza wąskim wycinkiem (132-144) | dr-05-prawo-administracyjne-sadowoadministracyjne | średni (obniżony z "najwyższy" — rdzeń praktyczny naprawiony, pozostają tematy drugorzędne) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-13 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PPSA.md` | 1) Sprzeciw od decyzji/postanowienia (64a-64e) — dopełnienie już dobrze opracowanego milczącego załatwienia z KPA; 2) Wznowienie postępowania sądowoadministracyjnego (270-285) — domknięcie asymetrii względem KPA; 3) Posiedzenia sądowe (90-114) |
| F-65 | **KPC — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14d (cz. II):** utworzono `mod-KPC-nieproces-czesc-ogolna.md` — PIERWSZY moduł KSIĘGI II w systemie, domykający wynik 0×/6× z raportu pokrycia. Tytuł I (506-525): wszczęcie, właściwość rzeczowa i ⛔ MIEJSCOWA WYŁĄCZNA wg wnioskodawcy, ⭐⭐ zainteresowany vs uczestnik (510), wniosek (511), odrębności dowodowe, apelacja vs zażalenie (518), skarga kasacyjna (519(1), katalog częściowy) + mapa nawigacyjna Tytułu II. Wcześniej (cz. I, 08-14) naprawiono prawomocność (365-366) i granice apelacji (378, 380-386). **POZOSTAJĄ OTWARTE:** w Księdze II — sprawy spadkowe (680-691), rzeczowe (zasiedzenie, zniesienie współwłasności, rozgraniczenie), wieczystoksięgowe, ubezwłasnowolnienie (544-560(12)), depozyt sądowy (692-693(17)), pełny katalog 519(1); w Księdze I — organizacja postępowania/prekluzja (205(1)-205(12)), sprawy gospodarcze (458(1)-458(13)), ograniczenia egzekucji (829, 833), egzekucja świadczeń niepieniężnych/eksmisja (1041-1059), alimenty (1081-1088), skarga kasacyjna do SN (398(1)-398(21)), zażalenie, wznowienie cywilne | cross-DR (dr-02, dr-05, dr-12, dr-16) | **średni (obniżony z WYSOKIEGO** — całkowita luka strukturalna Księgi II przestała istnieć; pozostałe braki są rozległe, ale każdy ma już ramę ogólną, w której można go osadzić) | 2026-08-13 (raport zewn.), naprawy częściowe: 2026-08-14 (cz. I), 2026-08-14d (cz. II) | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KPC.md`; szczegóły naprawy: AUDIT-JOURNAL.md, wpis AUDYT-2026-08-14w | 1) Sprawy SPADKOWE w nieprocesie (680-691) — najczęstsza kategoria, ⚠️ sprzężenie: mod-KC-spadki pokrywa stronę materialną, proceduralnej brak; 2) prawo RZECZOWE w nieprocesie; 3) organizacja postępowania/prekluzja (205(1)-205(12)); 4) ograniczenia egzekucji (829, 833) |
| F-81 | **KPK — reszta po zamknięciu F-66 (2026-08-15, 7 sesji).** F-66 FORMALNIE ZAMKNIĘTA — rdzeń praktyczny modułu `mod-KPK-podstawy-odwolawcze-przeslanki-zarzuty-biegli.md` uznany za wystarczająco solidny (8 sekcji, CAŁY Rozdział 48 postępowania odwoławczego z pełną treścią najważniejszych przepisów praktycznych — 425/426/428/429/430/434/437; art. 17, 156, 193-206 częściowo, 313, 485-499, 568a-577). Ta flaga zbiera WYŁĄCZNIE pozostałe, węższe punkty jako świadomie odłożone drobne doprecyzowania, nie realne luki blokujące użycie modułu: (1) dokładne verbatim brzmienie art. 427 §2-3, 430, 431, 432, 433 §1-2, 435, 436 (obecnie w module: tytuły + kontekst doktrynalny, nie cytat verbatim); (2) odesłania sygnalizowane ale nie sprawdzone: art. 441, 443, 60, 119, 308, 332, 470, 422 §2, 85 KK, 573 §3, 156 §3-4/§6, 159, 250 §2b, 454, 517i §1, 443a (relacja do już opracowanego fragmentu niejasna); (3) art. 198, 199, 203-205 Rozdz. 22 (biegli — pozycje pominięte); (4) art. 498 (status niejasny — możliwe uchylenie analogicznie do 486); (5) TRZY nierozstrzygnięte rozbieżności wersji czasowych — art. 575 §1 (wyrok łączny, uprawomocnienie vs wydanie), art. 156 §5 (dostęp do akt, kolejność klauzuli), art. 437 §1 zd. 2 (możliwe usunięcie nowelizacją 2019 r.) — wszystkie WYMAGAJĄ weryfikacji bezpośrednio w ISAP/eli.gov.pl; (6) spór doktrynalny nierozstrzygnięty: obligatoryjność zgody prokuratora na odpisy w ramach 156 §5a; (7) stary wiersz bazowy KPK w `dr-03/MAPA-AKTOW.md` nadal pomija nowelizacje Dz.U. 2026.421/2026.638 | dr-03-prawo-karne-wykroczenia-egzekucja | niski (żaden punkt nie blokuje typowego użycia modułu w praktyce kancelaryjnej — to doprecyzowania i rozbieżności do wyjaśnienia, nie luki strukturalne) | 2026-08-15 (przy zamknięciu F-66) | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KPK.md`; pełna historia poprzedniczki: AUDIT-JOURNAL.md, wpisy AUDYT-2026-08-15e do l oraz wpis zamykający AUDYT-2026-08-15m | 1) TRZY rozbieżności wersji czasowych — sesja dedykowana wyłącznie ISAP/eli.gov.pl, rozstrzygająca wszystkie trzy naraz; 2) dokończyć verbatim pozostałych 7 przepisów Rozdz. 48; 3) art. 498 status; 4) reszta Rozdz. 22 (198/199/203-205) i odesłania — niski priorytet, web_search wyłącznie na żądanie konkretnej sprawy |
| F-68 | **KSH — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14 i 2026-08-15v.** Organy sp. z o.o. (Tytuł III, Dział I, Rozdz. 3, art. 201-254) NAPRAWIONE 14.08 modułem `mod-KSH-organy-spolki-zoo.md`. ✅ **NAPRAWIONE 2026-08-15v — Tytuł IV, łączenie/podział/przekształcanie (491-584¹³):** dodano sekcję w `mod-KSH-spolki-handlowe.md` obejmującą Dział I Łączenie (dwie metody — przejęcie i zawiązanie nowej spółki, sukcesja uniwersalna art. 494, dopłaty do 10%), Dział II Podział (⭐ PIĘĆ sposobów, nie cztery — nowelizacja 15.09.2023 dodała podział przez wyodrębnienie, art. 529 § 1 pkt 5, rozróżniony od wydzielenia tym, kto obejmuje udziały), Dział III Przekształcenia (ogólna zasada, przekształcenie przedsiębiorcy w spółkę kapitałową). Z praktyczną adnotacją o due diligence przy sukcesji uniwersalnej. ~600 artykułów KSH ogółem — **pozostaje otwarte:** Tytuł I i Tytuł II (spółki osobowe, 129 art.) praktycznie zerowe; Oddział 2 Rozdziału 3 (nadzór/rada nadzorcza, 212-226); Dział Ia (PSA) i Dział II (S.A.) prawie puste (339 art. łącznie) | dr-02-prawo-cywilne-rodzinne-gospodarcze | średni (obniżony z "średni-wysoki" — dwie z trzech głównych wskazanych luk naprawione: organy sp. z o.o. i Tytuł IV) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14, naprawa Tytułu IV: 2026-08-15v | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KSH.md` — ⚠️ nieaktualny co do Tytułu IV, naprawiony, raport tego nie pokazuje | 1) Tytuł II — sp. jawna/komandytowa (22-66, 102-124); 2) Rozdz. 3 Oddz. 2 — nadzór/rada nadzorcza (212-226), dopełnienie już opracowanego Rozdziału 3; 3) odświeżyć raport pokrycia co do Tytułu IV; 4) ⚠️ moduł `mod-KSH-spolki-handlowe.md` osiągnął 850 linii (próg ZASADY 13 to 1000) — kolejna znaczna rozbudowa powinna rozważyć wydzielenie do osobnego modułu zamiast dalszego wzrostu tego pliku |
| F-86 | **⛔ ROZDZIELONA Z F-69 (sesja 2026-08-15v).** Prawo upadłościowe (PrUp), rozdział-po-rozdziale zmapowane. ✅ **CZĘŚCIOWO ZAMKNIĘTE 2026-08-15v — Tytuł IV, kompetencje syndyka (149–235), NAPRAWIONE:** dodano pełną treść (powołanie i wymogi art. 156–157a, podstawowe kompetencje i status prawny art. 160/161/173, obowiązki sprawozdawcze art. 168/176, odwołanie/sankcje art. 169a–172, pięcioskładnikowy system wynagrodzenia art. 162–167b z zaliczkami). ⭐ **Przy naprawie wykryta i skorygowana NIEAKTUALNA podstawa prawna całego modułu (klasa błędu F-84):** moduł wskazywał PrUp jako Dz.U. 2025 poz. 614 t.j., ale ISAP potwierdza nowszy t.j. — **Dz.U. 2026 poz. 913** (obwieszczenie 12.06.2026) — wszystkie odwołania w module skorygowane (metryka, sekcja testu niewypłacalności, źródła online). **🟢 Dobrze pokryte:** test niewypłacalności (art. 11), zgłoszenie wierzytelności (art. 239), czynności bezskuteczne (art. 127–128), **kompetencje syndyka (Tytuł IV, 149–235 — nowe)**, KRZ jako narzędzie proceduralne. **🟡 Częściowo:** wniosek o ogłoszenie upadłości (20–25a, brak elementów formalnych), skutki ogłoszenia upadłości (57–148, tylko czynności bezskuteczne), podział funduszów masy (335–361, tylko art. 336), upadłość konsumencka (opisana ogólnie, bez numerów artykułów). **🔴 Całkowity brak — pozostaje otwarte:** przepisy wstępne i podmiotowy zakres (1–9b), właściwość sądu (18–19), postępowanie zabezpieczające (36–43, wysoka waga praktyczna), przygotowana likwidacja/pre-pack (56a–56h), układ w upadłości (267–305), likwidacja masy (306–334), zakończenie/umorzenie postępowania (361–372), **zakaz prowadzenia działalności gospodarczej (Tytuł X, 373–377 — naturalne dopełnienie art. 299 KSH)**, postępowanie międzynarodowe (378–417), postępowania szczególne wobec banków/ubezpieczycieli/deweloperów (418–425+) | dr-02-prawo-cywilne-rodzinne-gospodarcze | średni (obniżony z "średni-wysoki" — najważniejsza praktycznie luka, rola syndyka, naprawiona) | 2026-08-13 (raport zewnętrzny), rozdzielenie z F-69: 2026-08-15v, naprawa Tytułu IV + korekta t.j.: 2026-08-15v | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrUp-PrRestr.md`, sekcja 1 (PrUp) — ⚠️ nieaktualna co do Tytułu IV, patrz wyżej | ✅ **CZĘŚCIOWO ZAMKNIĘTE 2026-08-15v — postępowanie zabezpieczające (36–43), NAPRAWIONE:** dodano treść: charakter fakultatywny zabezpieczenia (art. 36), tymczasowy nadzorca sądowy (art. 38), granica zwykłego zarządu dłużnika pod rygorem nieważności (art. 38a), zawieszenie egzekucji (art. 39), zarząd przymusowy jako środek wzmocniony (art. 40), upadek zabezpieczenia (art. 43). Zweryfikowano też, że rozbieżność brzmienia art. 36/38 między starszymi i nowszymi kopiami źródeł (obligatoryjne vs fakultatywne) NIE jest świeżą nowelizacją — nawet t.j. 2024.794 miał już brzmienie fakultatywne; starsze źródła (orka.sejm.gov.pl) pokazywały PIERWOTNY tekst ustawy z 2003 r. sprzed dawnych nowelizacji, nie aktualny stan. **Pozostaje otwarte:** Tytuł X — zakaz prowadzenia działalności gospodarczej (373–377, dopełnienie art. 299 KSH); przygotowana likwidacja/pre-pack (56a–56h); układ w upadłości (267–305); likwidacja masy (306–334); zakończenie/umorzenie postępowania (361–372); postępowanie międzynarodowe (378–417); postępowania szczególne (418–425+) | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski-średni (obniżony z "średni" — dwie najważniejsze praktycznie luki, rola syndyka i postępowanie zabezpieczające, obie naprawione) | 2026-08-13 (raport zewnętrzny), rozdzielenie z F-69: 2026-08-15v, naprawa Tytułu IV + postępowania zabezpieczającego + korekta t.j.: 2026-08-15v | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrUp-PrRestr.md`, sekcja 1 (PrUp) — ⚠️ nieaktualna co do Tytułu IV i postępowania zabezpieczającego, oba naprawione, raport tego nie pokazuje | ✅ **CZĘŚCIOWO ZAMKNIĘTE 2026-08-15v — Tytuł X, zakaz prowadzenia działalności gospodarczej (373–377), NAPRAWIONY:** dodano treść: okres 1–10 lat (art. 373 ust. 1), przesłanki w tym "faktyczny zarządca"/słup (ust. 1a), wyjątek przy złożonym wniosku restrukturyzacyjnym z nieznacznym pokrzywdzeniem, dodatkowa przesłanka dla osób fizycznych (art. 374), recydywa (ust. 3), procedura wyłącznie na wniosek z zamkniętym katalogiem uprawnionych (art. 376), terminy prekluzyjne 1 rok / 3 lata (art. 377) — z adnotacją o sprzężeniu z art. 299 KSH. ⭐ **Przy naprawie skorygowano JEDNO przestarzałe źródło** (2022, "3 do 10 lat") na rzecz aktualnego "1 do 10 lat", potwierdzonego 5+ zgodnymi źródłami — dolna granica została obniżona wcześniejszą nowelizacją. **Pozostaje otwarte:** przygotowana likwidacja/pre-pack (56a–56h); układ w upadłości (267–305); likwidacja masy (306–334); zakończenie/umorzenie postępowania (361–372); postępowanie międzynarodowe (378–417); postępowania szczególne wobec banków/ubezpieczycieli/deweloperów (418–425+) | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski (obniżony z "niski-średni" — trzy najważniejsze praktycznie luki PrUp naprawione: rola syndyka, postępowanie zabezpieczające, zakaz prowadzenia działalności) | 2026-08-13 (raport zewnętrzny), rozdzielenie z F-69: 2026-08-15v, naprawa Tytułu IV + postępowania zabezpieczającego + Tytułu X + korekta t.j.: 2026-08-15v | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrUp-PrRestr.md`, sekcja 1 (PrUp) — ⚠️ nieaktualna co do Tytułu IV, postępowania zabezpieczającego i Tytułu X, wszystkie naprawione, raport tego nie pokazuje | ✅ **CZĘŚCIOWO ZAMKNIĘTE 2026-08-15v — przygotowana likwidacja/pre-pack (56a–56h), NAPRAWIONE:** dodano treść: istota (wniosek razem z wnioskiem o upadłość, art. 56a), zasady dla podmiotów powiązanych (art. 56b), przesłanki zatwierdzenia obligatoryjne/fakultatywne z terminami i aukcją (art. 56c–56ca), procedura i zażalenia (art. 56d–56e), skutki sprzedaży analogiczne do egzekucyjnej (art. 56f). **Pozostaje otwarte — niższy priorytet praktyczny:** układ w upadłości (267–305, instytucja odrębna od PrRestr); likwidacja masy (306–334); zakończenie/umorzenie postępowania (361–372); postępowanie międzynarodowe (378–417); postępowania szczególne wobec banków/ubezpieczycieli/deweloperów/emitentów obligacji (418–425+) | dr-02-prawo-cywilne-rodzinne-gospodarcze | bardzo niski (obniżony z "niski" — cztery z pięciu wskazanych priorytetów PrUp naprawione; pozostałe luki dotyczą rzadszych sytuacji praktycznych) | 2026-08-13 (raport zewnętrzny), rozdzielenie z F-69: 2026-08-15v, naprawa Tytułu IV + postępowania zabezpieczającego + Tytułu X + pre-pack + korekta t.j.: 2026-08-15v | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrUp-PrRestr.md`, sekcja 1 (PrUp) — ⚠️ nieaktualna co do czterech naprawionych sekcji, patrz wyżej | 1) układ w upadłości (267–305) — jeśli pojawi się sprawa; 2) likwidacja masy (306–334); 3) odświeżyć raport pokrycia co do wszystkich czterech naprawionych sekcji |
| F-87 | **⛔ ROZDZIELONA Z F-69 (sesja 2026-08-15v) — Prawo restrukturyzacyjne (PrRestr), rozdział-po-rozdziale zmapowane, pokrycie znacznie słabsze niż PrUp.** ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14 (naprawa wykonana pod dawnym numerem F-69, przeniesiona tutaj): Dział VI — Układ (art. 150–179), JEDYNA centralna instytucja całej ustawy, NAPRAWIONY nowym modułem `mod-PrRestr-dzial-VI-uklad.md` (przepisy ogólne, propozycje układowe, głosowanie/zatwierdzenie z art. 119 — próg 50%/2/3, test zaspokojenia z nowelizacji 2025.1085, skutki układu) — zweryfikowane na dysku: moduł istnieje (242 linie), poprawnie zarejestrowany w SKILL.md i MAPA-AKTOW.md. ⚠️ **Raport `raport-pokrycia-PrUp-PrRestr.md` z 2026-08-13 jest NIEAKTUALNY w tym jednym punkcie** — wciąż pokazuje Dział VI jako 🔴, mimo naprawy z 14.08; wymaga odświeżenia przy najbliższej okazji, żeby nie wprowadzać w błąd przy kolejnym odczycie. ✅ **CZĘŚCIOWO ZAMKNIĘTE 2026-08-15v — Tytuł II, cztery tryby restrukturyzacji (210–337), NAPRAWIONY:** tabela "TRYBY RESTRUKTURYZACJI" w module dostała podstawę prawną po raz pierwszy — PZU (Dział I, 210–226h), PPU (Dział II, 227–264), PU (Dział III, 265–282), sanacja (Dział IV, 283–323), z progiem 15% wierzytelności spornych (art. 3 ust. 4 pkt 2) rozdzielającym PZU/PPU od PU, potwierdzonym 7 niezależnymi źródłami. ⭐ **Przy naprawie wykryto i skorygowano pułapkę nieaktualnego źródła:** termin dnia układowego (art. 211 ust. 2) zmieniony nowelizacją Dz.U. 2025 poz. 1085 (w życie 23.08.2025) z trzech na CZTERY miesiące — kilka kopii Rządu 2 wciąż pokazywało "trzy miesiące" mimo poprawnego wpisu nowelizacji we własnym rejestrze zmian; rozstrzygnięte porównaniem wersji datowanych przed/po 23.08.2025 (ta sama klasa błędu co F-82/F-84 — zgodność między kopiami źródła nie jest dowodem aktualności bez sprawdzenia daty). **Pozostaje otwarte — reszta ~400-artykułowej ustawy:** przepisy ogólne, cel ustawy, podstawy otwarcia postępowania (1–13), sąd i sędzia-komisarz (14–22), nadzorca i zarządca z perspektywy samej ustawy restrukturyzacyjnej (23–64 — temat pokrewny jest w `mod-ustawa-doradca-restrukturyzacyjny-zawod`, ale z perspektywy ustawy o licencji, nie art. 23–64 PrRestr), uczestnicy postępowania — spis wierzytelności, zgromadzenie i rada wierzycieli (65–139), pomoc publiczna (139a–149), układ częściowy (180–188), przepisy ogólne o postępowaniu (189–209), postępowanie międzynarodowe (335–380), postępowania odrębne — deweloperzy/emitenci obligacji/banki/SKOK-i (381–433) | dr-02-prawo-cywilne-rodzinne-gospodarcze | średni (obniżony z "wysoki" — praktyczne serce ustawy, cztery tryby z podstawą prawną, naprawione; pozostałe luki dotyczą etapów poprzedzających wybór trybu lub obszarów rzadziej używanych) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 (Dział VI Układ), 2026-08-15v (Tytuł II, cztery tryby), rozdzielenie z F-69: 2026-08-15v | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrUp-PrRestr.md`, sekcja 2 (PrRestr) — ⚠️ nieaktualna co do Działu VI i Tytułu II, oba już naprawione, raport tego nie pokazuje | 1) odświeżyć raport pokrycia co do Działu VI i Tytułu II (oba naprawione, raport z 13.08 tego nie pokazuje); 2) nadzorca/zarządca z perspektywy PrRestr (23–64), dopełnienie ustawy o licencji; 3) uczestnicy postępowania — wierzyciele, spis wierzytelności (65–139); 4) postępowanie sanacyjne — pozostałe rozdziały poza samym otwarciem (Rozdz. 2 pełny zakres skutków, Rozdz. 3 plan restrukturyzacyjny, 313–319) |
| F-70 | **OP — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14:** Dział IV Rozdz. 11 — dowody w postępowaniu podatkowym (180-200), etap decydujący o wyniku większości sporów, NAPRAWIONY nowym modułem `mod-OP-dzial-IV-rozdzial-11-dowody.md` (zasady ogólne, zasada inkwizycyjności organu art. 187, otwarty katalog dowodów art. 181, swobodna ocena art. 191, KSIĘGI PODATKOWE art. 193 — domniemanie mocy dowodowej z ciężarem obalenia na organie). **Pozostają otwarte:** kontrola podatkowa (281-292) i czynności sprawdzające (272-280) — całkowicie nieobecne | dr-06-podatki-finanse-publiczne-aml | średni (obniżony z "wysoki" — najważniejszy z 3 punktów naprawiony) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-OP.md` | 1) Dział VI — kontrola podatkowa (281-292, pierwszy kontakt podatnika z organem); 2) Dział V — czynności sprawdzające (272-280, najczęstsza forma weryfikacji deklaracji) |
| F-71 | **PZP — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14:** Dział II (183 art., >1/4 ustawy) — kwalifikacja podmiotowa wykonawców (warunki udziału art. 112, JEDZ i mechanizm dwuetapowy art. 125/126 — pełne dokumenty żąda się TYLKO od zwycięzcy), kryteria oceny ofert (239-243, wymóg jednoznaczności art. 240), unieważnienie postępowania (255-258, katalog obligatoryjny zamknięty + fakultatywne NIE jako "wytrych") NAPRAWIONE nowym modułem `mod-PZP-dzial-II-kwalifikacja-kryteria-uniewaznienie.md`. **Pozostają otwarte:** procedura otwarcia i BADANIA ofert krok po kroku (poza samymi kryteriami), Dział IV (umowa ramowa, DSZ, konkurs, partnerstwo innowacyjne — tylko nazwy), przebieg postępowania przed KIO (dowody 531-543, rozprawa, orzeczenia Izby) | dr-07-zamowienia-publiczne-fundusze-ue | średni (obniżony z "średni-wysoki" — sam rdzeń kwalifikacji/kryteriów/unieważnienia naprawiony) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PZP.md` | 1) Otwarcie/badanie ofert — procedura krok po kroku; 2) Dział IX dokończenie — przebieg postępowania przed KIO (531-568a); 3) Dział IV — instrumenty szczególne (311-361) |
| F-73 | **KRO — najlepiej pokryty akt spośród wszystkich zbadanych.** Potwierdza wcześniejszą naprawę tej sesji (2026-08-13b/c). Pozostałe realne luki: art. 87–91 (obowiązki rodzice-dzieci — poz. 27 indeksu zbiorczego), przepisy ogólne o pokrewieństwie (61⁷–618), macierzyństwo jako instytucja | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski-średni | 2026-08-13 (raport zewnętrzny) | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KRO.md` | 1) art. 87–91 (niska pracochłonność); 2) art. 61⁷–618; 3) macierzyństwo |
| F-74 | **PrBud — moduł "żywy", iteracyjnie rozbudowywany, ale nierówny.** Mocne strony: samowola budowlana (Rozdz. 5b, 48–53a — najlepiej opracowany fragment całego aktu), postępowanie poprzedzające roboty (Rozdz. 4), zmiana sposobu użytkowania (71/71a), ścieżka odwoławcza. **Zero treści:** Rozdz. 5/5a/5d (rozpoczęcie robót, dziennik budowy, książka obiektu), Rozdz. 7 (katastrofa budowlana), Rozdz. 8 (organy PINB/WINB — kompetencje znane tylko pośrednio), Rozdz. 10 (odpowiedzialność zawodowa). Rozdz. 3 (prawa/obowiązki uczestników procesu budowlanego, 17–27a) i Rozdz. 9 (przepisy karne) — zadeklarowane w zakresie modułu, ale bez rzeczywistej treści (ta sama rozbieżność deklaracja/wykonanie co przy rencie rodzinnej FUS) | dr-09-budownictwo-srodowisko-energia-transport | średni-wysoki | 2026-08-13 (raport zewnętrzny) | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrBud.md` | 1) Rozdz. 3 — uczestnicy procesu budowlanego (17–27a, dokończenie już zadeklarowanego tematu); 2) Rozdz. 8 — organy PINB/WINB (80–89c); 3) Rozdz. 9 — przepisy karne pełna treść (90–94) |

| F-75 | **KKW — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14:** dodano realną treść merytoryczną (sekcja 0) do modułu, dotąd czysto generycznego szablonu — naprawiono WSZYSTKIE 3 pierwotnie wskazane priorytety: warunkowe przedterminowe zwolnienie (159-163, w tym kluczowy art. 161 §3-4 wykorzystujący doświadczenie sprawy Marek Petelski), odroczenie/przerwa wykonania kary (150-158a), dozór elektroniczny (43a-43zf). Naprawiono też niezgodność nazwy wewnętrznej pliku. Oryginalny szablon strategiczny (12 sekcji) ZACHOWANY jako warstwa uzupełniająca. **Pozostaje otwarte:** cała reszta struktury KKW nadal bez treści — Rozdz. IV postępowanie wykonawcze (9-31), Oddz. 4 prawa/obowiązki skazanego (101-120), Oddz. 9 kary dyscyplinarne (142-149), Rozdz. XI dozór kuratora (169-178a), środki karne/kompensacyjne (179-223n) i dalsze | dr-03-prawo-karne-wykroczenia-egzekucja | średni (obniżony z "najwyższy" — 3 najczęściej używane w praktyce instytucje naprawione, reszta struktury mniej pilna) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KKW.md` | 1) Oddz. 4 — prawa i obowiązki skazanego (101-120, widzenia/korespondencja/opieka zdrowotna); 2) Oddz. 9 — kary dyscyplinarne (142-149); 3) Rozdz. IV — postępowanie wykonawcze (9-31), fundament proceduralny |
| F-78 | **10 modułów w systemie przekracza limit 1000 linii (ZASADA 13, SKILL.md, dodana 2026-08-14) — wymagają podziału wg rozdziałów aktu.** Wykryte pełnym skanowaniem `wc -l` po ustanowieniu zasady | cross-DR: dr-03 (1), dr-06 (3), dr-02 (2), dr-05 (1), dr-09 (2 — po korekcie 2026-08-15n), shared (2) | średni — żaden moduł nie jest błędny merytorycznie, ryzyko jest WYŁĄCZNIE narzędziowe (trudność nawigacji `view`, ryzyko niejednoznacznego `str_replace`, trudność utrzymania spójności przy częściowych edycjach odległych rozdziałów) | 2026-08-14 | Pełna lista (linie wg `wc -l` na 2026-08-14): (1) `dr-03/modules/mod-KK-kwalifikator-karnomaterialny.md` — 2084; (2) `shared/ORKA-BAS-LEKSYKON.md` — 1975; (3) `dr-06/modules/mod-VAT-podatek-od-towarow-i-uslug.md` — 1901; (4) `dr-06/modules/mod-ustawa-rachunkowosci.md` — 1539; (5) `dr-06/modules/mod-ustawa-akcyzowa-i-clo-UCC.md` — 1493; (6) `dr-02/modules/mod-KRO-rodzinne.md` — 1470; (7) `dr-05/modules/mod-KPA-tryby-nadzwyczajne-i-strategia.md` — 1303; (8) `shared/PORTALE-BRANZOWE-RZAD-2B.md` — 1088; (9) `dr-02/modules/mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md` — 1036; ⛔ **KOREKTA 2026-08-15n:** pozycja `dr-09/modules/mod-ochrona-zabytkow-obiekty-uzytecznosci-publicznej.md` — **1008 linii** — była błędnie opisana jako „blisko progu (nie flagowane)"; **1008 > 1000, więc PRZEKRACZA próg** i jest pozycją **(10)** listy, nie obserwacją. Ponowny pełny skan `wc -l` 2026-08-15n potwierdził wszystkie 9 pozostałych wartości BEZ ZMIAN. ⭐ **NOWE USTALENIE 2026-08-15n — pierwotny skan pomijał pliki spoza `modules/`.** Skan całego drzewa `*.md` ujawnił 3 dalsze pliki >1000 linii: `przesluchanie-swiadkow-v2-min90/SKILL.md` (1809), `analizator-dowodow-v3/SKILL.md` (1203), `audyt-systemu-v4/SKILL.md` (1170) oraz `audyt-systemu-v4/references/AUDIT-JOURNAL.md` (40 483). Rozstrzygnięcie zakresu wpisane do ZASADY 13 (SKILL.md, sekcja „Zakres stosowania"): pliki `SKILL.md` — DO ROZSTRZYGNIĘCIA przez użytkownika (podział wg rozdziałów aktu nie ma zastosowania; SKILL.md musi zostać jednym plikiem wejściowym — ewentualny zabieg to wydzielenie sekcji do `modules/`); `AUDIT-JOURNAL.md` i mapy archiwalne — **WYŁĄCZONE TRWALE** (rejestry przyrostowe). | Podzielić każdy wg rozdziałów aktu źródłowego, zaczynając od najbardziej przekraczających próg (`mod-KK-kwalifikator-karnomaterialny` 2084, `ORKA-BAS-LEKSYKON` 1975, `mod-VAT-...` 1901) — każdy podział to osobna sesja z pełną rejestracją nowych plików (Reguła 2/3 HARDGATE) |

| F-82 | ⛔ **NAPRAWIONE W SESJI ODKRYCIA (2026-08-15n) — wiersz pozostawiony jako OSTRZEŻENIE METODOLOGICZNE, nie jako otwarte zadanie.** Kodeks morski figurował w TRZECH rejestrach jednocześnie pod **błędnym numerem Dz.U. 2023 poz. 1523**; poz. 1523/2023 to **ustawa z 28.07.2023 o delegowaniu kierowców w transporcie drogowym** (ISAP `WDU20230001523`) — akt z TEJ SAMEJ dziedziny transportowej, co maskowało pomyłkę przed wykryciem po nazwie. Poprawny t.j.: **Dz.U. 2023 poz. 1309** (obwieszczenie Marszałka Sejmu z 25.05.2023). ⚠️ **DLACZEGO TO WAŻNE:** błąd przetrwał wszystkie dotychczasowe audyty TRYB DZU, bo wszystkie trzy rejestry były ze sobą ZGODNE — spójność wewnętrzna systemu potwierdzała błąd zamiast go ujawniać. Kroswalidacja `test_cross_map_dzu.py` porównuje rejestry MIĘDZY SOBĄ, więc z definicji tej klasy błędu nie wykryje. ⭐ **OKOLICZNOŚĆ WYKRYCIA:** przypadkowa — przy piątej próbie ustalenia numeru z F-24 tekst ustawy z 11.06.2026 (Rząd 1) zacytował Kodeks morski z numerem 1309, co nie zgadzało się z mapą. | cross-DR: audyt-systemu-v4 (mapa_dzu), prawo-polskie-v2 (ROUTING-MAP), dr-09 (moduł transportowy) | ⛔ **CRIT w chwili odkrycia** (błędny numer aktu w rejestrze kanonicznym) → **naprawiony w tej samej sesji**, pozostaje jako lekcja metodologiczna o priorytecie informacyjnym | 2026-08-15n (otwarta i naprawiona tego samego dnia) | ✅ VER 2026-08-15n, 4 niezależne źródła: dwa PDF-y ISAP cytujące „Kodeks morski (Dz. U. z 2023 r. poz. 1309)", tekst ustawy na orka.sejm.gov.pl, infor.pl dla identyfikacji poz. 1523 | **DO WYKONANIA W PRZYSZŁEJ SESJI (samo źródło błędu, nie ten akt):** 1) przeskanować mapę Dz.U. pod kątem tego samego wzorca — akty, których numer nigdy nie był weryfikowany PRZECIW ŹRÓDŁU ZEWNĘTRZNEMU, a tylko „zgadzał się" między rejestrami; priorytet dla aktów o statusie „ze zm. — brak nowszego t.j." (jak Kodeks morski), bo ten opis sugeruje, że nikt nie sprawdzał od dawna; 2) rozważyć wpisanie do `test_cross_map_dzu.py` ostrzeżenia, że zgodność rejestrów NIE jest weryfikacją merytoryczną; 3) osobno: sprawdzić, czy ustawa o delegowaniu kierowców (Dz.U. 2023 poz. 1523) zasługuje na własny wiersz w dr-09 — obecnie nieobecna w systemie |

| F-83 | **System map pokrycia — BRAMKA AKTYWACJI bloku § 3 zadania cyklicznego Cowork** (`references/SCHEDULED-TASK-COWORK.md`). Odtworzono 2026-08-15o mechanizm pozycji 11 menu audytu (scheduled task „Cotygodniowa weryfikacja ISAP"), którego docelowym elementem jest monitorowanie **map pokrycia** — trwałego rejestru wskazującego, w jakim zakresie rozdziały i akty prawne są pokryte treścią modułów. ⛔ **Taki rejestr NIE ISTNIEJE.** To, co system ma dzisiaj, to `references/raporty-pokrycia-2026-08-13/` — 13 plików jednorazowej analizy zewnętrznej, dostarczonej przez użytkownika, opisanej w tym rejestrze jako materiał ROBOCZY/TYMCZASOWY do skasowania po zamknięciu F-64…F-75. Migawka z jednego dnia nie jest systemem monitorowania: nie odświeża się, nie ma statusów per rozdział, nie reaguje na zmianę Dz.U. ⭐ **Dlaczego to jest bramka, a nie zwykłe zadanie:** dopóki F-83 jest otwarta, sesja wykonawcza zadania cyklicznego MA POMIJAĆ blok map pokrycia i odnotować to jednym zdaniem — bez tej bramki cotygodniowe zadanie improwizowałoby badanie pokrycia „przy okazji", co jest osobną, kosztowną klasą pracy i rozsadziłoby zadanie. | cross-DR (docelowo DR-01…DR-16) + audyt-systemu-v4 | średni — nie blokuje samego zadania cyklicznego (działa bez § 3), blokuje wyłącznie jego rozszerzenie o pokrycie | 2026-08-15o | Stan faktyczny potwierdzony na dysku: `find references/raporty-pokrycia-2026-08-13 -type f | wc -l` = 13 (12 raportów + indeks), brak jakiegokolwiek generowanego rejestru pokrycia | **Do wykonania (sesja dedykowana, na akceptację użytkownika):** 1) ustalić format mapy pokrycia — per akt, wiersz = rozdział/zakres artykułów, kolumny: status (PEŁNE/CZĘŚCIOWE/BRAK), moduł pokrywający, data ostatniej weryfikacji treści; 2) rozstrzygnąć, czy mapy żyją w DR-skillach (przy MAPA-AKTOW.md) czy centralnie — rekomendacja: przy DR, bo tam następuje edycja modułu; 3) zasilić je JEDNORAZOWO z istniejących 12 raportów pokrycia (materiał już jest, nie trzeba go odtwarzać); 4) dopiero po tym ZAMKNĄĆ F-83 i dopisać punkt 8 do promptu zadania wg § 3 SCHEDULED-TASK-COWORK.md |

| F-85 | **✅ ROZSTRZYGNIĘTA CO DO TYTUŁÓW (sesja 2026-08-15s) — TYLKO poz. 779 dotyczy PIT/CIT.** Pierwotny wpis zakładał, że poz. 846 i 912 to "akty zmieniające CIT" — weryfikacja ISAP wykazała, że OBIE pozycje są BŁĘDNIE zidentyfikowane: ⛔ `Dz.U. 2026 poz. 846` to `ustawa z 29.05.2026 o zmianie ustawy – Ordynacja podatkowa oraz niektórych innych ustaw` (ISAP WDU20260000846) — dotyczy Ordynacji podatkowej, NIE CIT (choć CIT może być jedną z "niektórych innych ustaw" — tytuł tego nie precyzuje, wymaga dalszej weryfikacji treści, nie tylko tytułu). ⛔ `Dz.U. 2026 poz. 912` to w ogóle NIE ustawa podatkowa — to nowelizacja ustawy z 20.07.2000 o ogłaszaniu aktów normatywnych (widoczna jako podstawa formalna w obwieszczeniach z 2026 r., np. poz. 913 ws. Prawa upadłościowego cytuje ją jako "Dz. U. z 2019 r. poz. 1461 oraz z 2026 r. poz. 912"), ZERO związku z CIT. ✅ **ZASADA 3 ZADZIAŁAŁA POPRAWNIE** — dyscyplina "nie wpisuj bez potwierdzenia u źródła" w poprzedniej sesji zapobiegła wpisaniu dwóch błędnych aktów do mapy DZU. **Potwierdzone poz. 779** (PIT, jak pierwotnie ustalono — prawo.pl, podatki.gov.pl). | audyt-systemu-v4 (mapa_dzu), dr-06 | niski-średni (obniżony — fałszywy trop 846/912 wyjaśniony, realna praca to tylko poz. 779 + ew. weryfikacja treści 846 pod kątem CIT jako "innej ustawy") | 2026-08-15p, rozstrzygnięcie tytułów: 2026-08-15s | ✅ poz. 779: prawo.pl + podatki.gov.pl. ✅ poz. 846: ISAP WDU20260000846 (pełny tekst, tytuł potwierdzony — Ordynacja podatkowa). ✅ poz. 912: wzorzec cytowań w obwieszczeniach 2026 r. (np. WDU20260000913) potwierdza, że to nowelizacja ustawy o ogłaszaniu aktów normatywnych, nie akt podatkowy | 1) dopisać poz. 779 do mapy DZU (PIT — nowelizacja terminologii art. 24a, "podatkowa księga przychodów i rozchodów"); 2) ✅ CZĘŚCIOWO ROZSTRZYGNIĘTE — przepisy.gofin.pl potwierdza poz. 846 w amendment trails ZARÓWNO PIT jak i CIT jednocześnie, więc główny tytuł aktu to zmiana Ordynacji podatkowej, ale akt rzeczywiście nowelizuje "niektóre inne ustawy" obejmujące i PIT, i CIT — dopisać poz. 846 do mapy DZU pod WŁAŚCIWYM tytułem (Ordynacja podatkowa jako akt główny), z odnotowaniem wtórnego wpływu na PIT/CIT, nie jako samodzielną "nowelizację CIT"; 3) poz. 912 NIE dotyczy dr-06 (to nowelizacja ustawy o ogłaszaniu aktów normatywnych) — zamknąć ten wątek bez dalszej akcji w dr-06; 4) sprawdzić, czy zmiana terminologii z poz. 779 ("podatkowa księga przychodów i rozchodów") nie unieważnia sformułowań w modułach dr-06 — FAZA 3E |

**Obserwacje informacyjne (nie są formalnymi flagami, nie blokują, ale warto pamiętać):**


| # | Obserwacja | Skill | Opis |
|---|---|---|---|
| O-1 | Nowelizacja ABW/AW ws. treści terrorystycznych (Dz.U. 2024 poz. 1684) nieopisana w module | dr-13-sluzby-bezpieczenstwo-informacje-niejawne | Uprawnienia Szefa ABW do nakazów usunięcia treści terrorystycznych (implementacja rozp. UE 2021/784) nie są opisane w `mod-ustawa-ABW-AW-CBA-sluzby-specjalne.md`. Odkryte przy okazji naprawy WARN-28/29 (2026-07-07a). Wąska kompetencja, rzadko aktywna w typowej sprawie DR-13. |
| O-2 | F-80 (ZAMKNIĘTA 2026-08-15h) — 15 plików-sierot w audyt-systemu-v4 samym | audyt-systemu-v4 | `check_rejestracja_modulow.py` wykrywa sieroctwo dla modułów DR (4 rejestry: dysk/SKILL.md/MAPA-AKTOW.md/ROUTING-MAP.md), ale NIE ma odpowiednika dla plików `references/`/`scripts/` samego audyt-systemu-v4 — stąd 15 plików (w tym sam `check_rejestracja_modulow.py`) mogło pozostać niezarejestrowanych niewykryte przez rutynowe audyty. Rozważyć w przyszłości: rozszerzenie skryptu lub dodanie kroku FAZA 0/2 sprawdzającego `find references/ scripts/ -type f` vs YAML frontmatter tego właśnie skilla. |

---

## Jak korzystać z tego pliku

- **Pytanie "co jest jeszcze otwarte?"** → odpowiedz na podstawie tabel powyżej, nie grepuj AUDIT-JOURNAL.md.
- **Zamykasz flagę F-N?** → usuń jej wiersz z tabeli powyżej, dodaj pełny opis naprawy jako nowy wpis w `AUDIT-JOURNAL.md` (z numerem/kodem flagi w tytule wpisu dla identyfikowalności).
- **Otwierasz nową flagę?** → dodaj wiersz tutaj (kolejny wolny numer F-N lub WARN-N zgodnie z konwencją) ORAZ krótki wpis w AUDIT-JOURNAL.md dokumentujący odkrycie.
- **Numeracja WARN-N vs F-N:** WARN-N zarezerwowane dla flag odkrytych w toku klasycznego trybu audytowego (TRYB DZU, TRYB WARN-CLOSE). F-N dla flag strukturalnych odkrytych przy innych okazjach (audyty kompletności, sesje tematyczne). Oba typy są "otwartymi flagami" w rozumieniu tego rejestru — nie różnicuj ważności po prefiksie, tylko po kolumnie Priorytet.

---
## 🔁 REAKTYWNE (REACT-1) — punkty uruchamiane WYŁĄCZNIE sprawą, nie sesją audytową
*(utworzone 2026-08-15n. **To jest RECLASYFIKACJA, nie naprawa merytoryczna** —
żaden z poniższych punktów nie został zbadany ani zamknięty; przeniesiono
JEDYNIE sposób ich ewidencjonowania. Precedens: migracja F-14/F-15 →
OBS-3/OBS-4 z 2026-08-15c.)*

**Powód wydzielenia:** siedem flag F- miało w kolumnie „Wymaga" identyczną
treść operacyjną — *„web_search per punkt, wyłącznie na żądanie konkretnej
sprawy"* — czyli z definicji NIE dawały się zamknąć sesją audytową, bo
warunkiem ich uruchomienia jest pojawienie się sprawy klienta dotykającej
danego punktu. Trzymane w rejestrze flag F- zawyżały licznik „otwartych
flag" i konkurowały o uwagę z flagami realnie wykonalnymi (numer Dz.U. do
ustalenia, luka strukturalna do wypełnienia). To ta sama patologia, którą
ZASADA 9 opisuje jako „gubienie flag drugorzędnych" — tyle że w odwrotną
stronę: tu flagi nie giną, lecz zaśmiecają listę zadań wykonalnych.

⚠️ **Zastrzeżenie do dwóch pozycji:** dawne **F-35** i **F-42** miały w
kolumnie „Wymaga" samo *„Web_search per punkt"*, BEZ dopisku „wyłącznie na
żądanie" — włączone do REACT-1 przez analogię (ta sama klasa: „drobne
punkty startowe", priorytet niski, brak wpływu na macierzystą sekcję).
Jeśli przy przeglądzie okaże się, że któryś ich punkt jednak zasługuje na
sesję dedykowaną — przywrócić jako osobną flagę F- z nowym numerem.

**Protokół użycia:** przy przyjęciu sprawy dotykającej któregokolwiek
punktu — wykonać web_search wg PRAWO-HARDGATE (nigdy z pamięci) W TEJ
SAMEJ sesji, wpisać ustalenie do właściwego modułu, odnotować w
AUDIT-JOURNAL.md i skreślić punkt z poniższej tabeli. Punkty NIE są
przedmiotem cyklicznego przeglądu WARN (ZASADA 9) — nie liczyć ich do
„aktywnych flag do zamknięcia" przy raportowaniu postępu.

| Dawna flaga | Skill | Priorytet | Otwarta od | Punkty (treść przeniesiona 1:1 z rejestru flag) |
|---|---|---|---|---|
| **F-22** (zmigrowana) | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski | 2026-08-13c | (1) `mod-KC-spadki.md` EPS: szczegółowe zasady jurysdykcji rozp. 650/2012 (art. 4-19) przy rzeczywistym zbiegu elementów z kilku państw UE (np. professio iuris + zwykły pobyt za granicą) — główna procedura EPS już opisana; (2) `mod-KC-spadki.md` Tytuł X KC: praktyczne znaczenie pojedynczych przepisów, które PRZETRWAŁY wyrok TK P.4/99 (art. 1058, 1063, 1067, 1070, 1070¹, 1079, 1081, 1082, 1086) — sama cezura 14.02.2001 już ustalona i jest wystarczająca dla zdecydowanej większości spraw; (3) `mod-KC-spadki.md` spis inwentarza: dokładne stawki kosztów KOMORNICZYCH (opłata sądowa 300 zł już nie dotyczy tej ścieżki — to inna taksa); (4) `mod-piecza-zastepcza-rodzina-zastepcza.md`: limit 14/30 dzieci w placówkach opiekuńczo-wychowawczych oparty WYŁĄCZNIE na 1 źródle Rządu 3 (domydziecka.org) — wymaga potwierdzenia w art. 95/105 ustawy przed powołaniem w piśmie (ZASADA 12 — poniżej progu 2-3 źródeł); (5) `mod-piecza-zastepcza-rodzina-zastepcza.md`: regionalne placówki opiekuńczo-terapeutyczne i interwencyjne ośrodki preadopcyjne nadal całkowicie nieopracowane (rzadkie formy) |
| **F-26** (zmigrowana) | dr-03-prawo-karne-wykroczenia-egzekucja | niski (żadna nie blokuje macierzystej, w większości już opracowanej sekcji) | 2026-08-13 | (1) `mod-KK-KPK-framework-szczegolowy.md` — orzeczenie SN V KK 412/21 (obrona konieczna) niezweryfikowana sygnatura; (2) `mod-KK-art148-162-przeciwko-zyciu-zdrowiu.md` — art. 159 KK (typ kwalifikowany bójki/pobicia przez użycie niebezpiecznego narzędzia) treść i zagrożenie karą niezweryfikowane; (3) tamże — art. 161 §2 (narażenie na HIV jako typ odrębny) treść niezweryfikowana; (4) `mod-czynny-zal-KK-KKS-samooskarzenie.md` — art. 17 KK (czynny żal przy przygotowaniu) i art. 23 KK (czynny żal przy współdziałaniu) warunki niepotwierdzone; (5) `mod-KK-art233-244b-przeciwko-wymiarowi-sprawiedliwosci.md` — czy istnieje odrębny obowiązek zatrzymania się po wypadku (art. 44 PRD) poza już opisanym kontekstem ucieczki jako obostrzenia karnego; (6) `mod-podmiana-czesci-naprawa-oszustwo.md` — wątek przywłaszczenia oryginalnej części klienta (art. 284 KK) jako odrębna, równoległa kwalifikacja; (7) `mod-ustawa-narkomania.md` — dokładny katalog kategorii prekursorów (1/2/3 wg rozp. UE) i obowiązki przedsiębiorców |
| **F-29** (zmigrowana) | dr-04-prawo-pracy-zus-swiadczenia | niski | 2026-08-13 | (1) `mod-KP-dzial-V-XIV-odpowiedzialnosc-materialna-przedawnienie.md` — art. 292-295 KP niezbadane; (2) `mod-dodatek-pielegnacyjny-swiadczenie-rehabilitacyjne-wyrownawcze.md` — DWIE jawnie oznaczone "GENUINE LUKA": ulga rehabilitacyjna PIT i zwolnienie z opłaty abonamentowej RTV; (3) `mod-reforma-stazu-pracy-2025-2026.md` — tryb sporu przy zaliczaniu okresów B2B/zlecenia niezweryfikowany; (4) emerytury pomostowe — ZERO wzmianek w całym DR-04 |
| **F-35** (zmigrowana) | dr-06-podatki-finanse-publiczne-aml | niski | 2026-08-13 | (1) mod-PIT — breaker rules rezydencji; (2) mod-VAT-klasyfikacja-produktow — 5 dalszych kategorii; (3) mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci — weryfikacja celna; (4) mod-clo-podroznych — katalog niewyczerpujący + rozp. 608/2013; (5) mod-odliczenia-uzytek-mieszany-KUP — rejestr CRP-26; (6) mod-ustawa-rachunkowosci — cross-check KSH ×2; (7) mod-ustawa-uslugi-platnicze — zakres PSD3 |
| **F-38** (zmigrowana) | dr-07-zamowienia-publiczne-fundusze-ue | bardzo niski | 2026-08-13, częściowa naprawa: 2026-08-13 | `mod-PZP-dzial-I...` — Rozdziały 7-8 (komunikacja elektroniczna, dokumentowanie postępowania) niezbadane szczegółowo |
| **F-42** (zmigrowana) | dr-09-budownictwo-srodowisko-energia-transport | niski | 2026-08-13 | (1) GDDKiA — wycena nieruchomości; (2) formy ochrony przyrody — ochrona gatunkowa; (3) inspekcja GIOŚ/WIOŚ — dodatkowy wątek; (4) ochrona zabytków — status finalizacji nowelizacji rozp. warunków technicznych + projekt zmiany ustawy o własności lokali |
| **F-47** (zmigrowana) | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | bardzo niski | 2026-08-13 | (1) mod-rzadkie-choroby-genetyczne — odesłanie do sprawdzenia odrębnie; (2) mod-ustawa-hodowla-zdrowie-zwierzat — wątek niezweryfikowany |

**Bilans migracji:** 7 wierszy usuniętych z rejestru flag F-, 0 punktów
merytorycznych utraconych (kolumna „Punkty" zawiera pełną, niezmienioną
treść kolumny „Opis" z pierwotnych wierszy).
