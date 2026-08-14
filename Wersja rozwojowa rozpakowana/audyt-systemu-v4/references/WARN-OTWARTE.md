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
| F-14 | Projekt ustawy Ministerstwa Infrastruktury ws. hulajnóg/UTO/rowerów elektrycznych — NADAL projekt/konsultacje (potwierdzone ponownie 2026-08-05, ROZSZERZONE o szczegóły). ⚠️ UWAGA: to NIE JEST "całkowita delegalizacja" kategorii UTO (błędne uproszczenie medialne) — to REGULACYJNE ZAOSTRZENIE (homologacja TDT, zwalczanie modyfikacji, rejestracja mocnych e-rowerów) | dr-03-prawo-karne-wykroczenia-egzekucja (`mod-przerobki-modyfikacje-pojazdow.md`, sekcja 1) | niski | 2026-08-04 (ROZSZERZONA 2026-08-05) | Komunikat MI z 10.07.2026: DWIE ustawy do zmiany — o systemach homologacji pojazdów ORAZ o kierujących pojazdami — PLUS rozporządzenie ws. warunków technicznych pojazdów. TDT ma decydować, jakie urządzenia mogą wejść na polski rynek. Straż Miejska ma dostać UPRAWNIENIA DO KONTROLI PARAMETRÓW na miejscu (w tym SPECJALNE HAMOWNIE dla policji do pomiaru mocy/prędkości). ⭐ NOWY ELEMENT: e-ROWERY z silnikiem pozwalającym na prędkość >25 km/h MAJĄ WYMAGAĆ REJESTRACJI analogicznie do skuterów/motorowerów. Planowane wejście w życie: "1 stycznia przyszłego roku" (czyli 1.01.2027) wg jednego źródła — NIEPOTWIERDZONE jako pewna data przez inne źródła. ⚠️ ODRZUCONE ŹRÓDŁO POTWIERDZONE JAKO BŁĘDNE DLA POLSKI: dane "18 lat, konfiskata 30 dni" (forsal.pl) DOTYCZĄ MACEDONII PÓŁNOCNEJ (109. sesja parlamentarna, 30.06.2026), NIE Polski — potwierdza to wcześniejszą, słuszną decyzję o odrzuceniu tych danych z treści modułu. | web_search "ustawa hulajnogi UTO homologacja TDT rejestracja e-rower 2026/2027 Sejm uchwalił" — sprawdzić bliżej 1.01.2027 (planowana data wejścia w życie) |
| F-15 | Pakiet "praworządnościowy" ws. statusu neosędziów (KRS 2018-2026) + nowelizacja ustawy o KRS + reforma ustroju sądów powszechnych — WSZYSTKIE w toku, wysokie ryzyko wpływu na WAŻNOŚĆ orzeczeń w toczących się/zakończonych sprawach | dr-01-ustroj-konstytucyjny-i-zrodla-prawa (mod-ustawa-KRS-i-ustroj-wladzy.md, mod-USP-ustroj-sadow-powszechnych.md) | WYSOKI | 2026-08-07 | Rada Ministrów PRZYJĘŁA 3 projekty ustaw (status neosędziów mianowanych przez wadliwie ukształtowaną KRS 2018-2026, uzdrowienie KRS, zmiany KRS/ksiąg wieczystych). Cel: uregulowanie statusu sędziów powołanych w okresie 7.03.2018-13.05.2026 przez nieprawidłowo ukształtowaną KRS — projekt PRZEWIDUJE pozbawienie mocy prawnej uchwał KRS z tego okresu (z wyłączeniem "początkujących sędziów"). Deadline ETPC (wyrok pilotażowy Wałęsa p. Polsce): listopad 2026. Kadencja obecnej KRS: do maja 2026 (już MINĘŁA na dzień weryfikacji — sprawdź, czy nowa KRS została powołana). RPO ZGŁOSIŁ ISTOTNE ZASTRZEŻENIA: nieprecyzyjne/niespójne przepisy grożące wydłużeniem postępowań, utrzymany wadliwy wybór sędziów-członków KRS przez Sejm, nadal funkcjonująca Izba Dyscyplinarna SN, nowe rozwiązania ZWIĘKSZAJĄCE uprawnienia Ministra Sprawiedliwości (kontrowersyjne konstytucyjnie). RÓWNOLEGLE: reforma ustroju sądów powszechnych (asesorzy mogą orzekać w wydziałach rodzinnych/nieletnich, spłaszczenie struktury, reforma odpowiedzialności dyscyplinarnej) w odpowiedzi na wyrok TSUE z 5.06.2023. NIEPEWNOŚĆ: minister liczy na podpis Prezydenta Nawrockiego, ale RELACJE napięte ("nie będzie prezydentem o pseudonimie weto") — REALNE ryzyko weta. ⚠️ BEZPOŚREDNIE ZNACZENIE PRAKTYCZNE: jeśli projekt wejdzie w życie w obecnym kształcie, MOŻE wpływać na WAŻNOŚĆ wyroków wydanych przez sędziów mianowanych przez KRS 2018-2026 w toczących się LUB zakończonych sprawach — WYSOKI priorytet monitorowania dla WSZYSTKICH domen systemu prawnego, nie tylko DR-01/DR-12 | web_search "status neosędziów ustawa KRS 2026 Sejm uchwalił Prezydent podpis weto" — sprawdzać CO NAJMNIEJ co 2-3 tygodnie z uwagi na WYSOKI priorytet i szeroki zasięg potencjalnych skutków |
| F-16 | Nowelizacja ustawy o postępowaniu egzekucyjnym w administracji z 15.05.2026 (druk 2319, podpisana 2.06.2026) — TREŚĆ zmian NIEZWERYFIKOWANA, mogła być JEDNĄ z 3 nowelizacji już odnotowanych jako "poz. 516/739/1003" w ISAP-METRYKI-AKTOW.md (transza 2026-08-08k) | prawny-router-v3 (references/ISAP-METRYKI-AKTOW.md) | niski | 2026-08-08 (próba weryfikacji treści 2026-08-08: BEZ ROZSTRZYGNIĘCIA — wyszukiwanie zwróciło WYŁĄCZNIE starsze, podobne tematycznie nowelizacje z 2019/2020/2023 r., BEZ precyzyjnego potwierdzenia treści TEJ KONKRETNEJ zmiany z druku 2319; NIE zgadywano odpowiedzi) | Ustawa uchwalona 15.05.2026, podpisana przez Prezydenta 2.06.2026 — znaleziona w oficjalnym rejestrze prezydenckim, ale TREŚĆ konkretnych zmian NIE ZBADANA w tej sesji z wystarczającą precyzją — możliwe, że to JEDNA z nowelizacji już zasygnalizowanych ostrzeżeniem w module (Dz.U. 2026 poz. 516/739/1003), ale BRAK bezpośredniego powiązania numeru druku z konkretną pozycją Dziennika Ustaw | web_search "ustawa postępowanie egzekucyjne administracji druk 2319 zakres zmian Dz.U. 2026" — ustalić DOKŁADNIE, KTÓREJ pozycji Dz.U. odpowiada, i CZY treść ma znaczenie dla istniejących modułów dr-05/dr-06 dot. egzekucji administracyjnej |
| F-17 | Pokrycie ustawy o VAT w DR-06 — po SIEDMIU iteracjach **~85%** (było ~55-60% przed iteracją VI). Pozostałe luki to instytucje niszowe i warstwa porządkowa | dr-06-podatki-finanse-publiczne-aml | niski | 2026-08-12 (zaktualizowana po iteracji VII) | **POKRYCIE DZIAŁAMI PO ITERACJI VII:** IX ~90% | V ~85% | II ~85% | IV ~85% | VI ~85% | VIII ~85% | X ~80% | XI ~80% | III ~75% | XII ~75% | VII ~70% | I ~20% | XIII selektywnie. ZAMKNIĘTE W ITERACJI VII: cały Dział VII (art. 26a, 33, 33a, 33b, 34-40 — wzrost z ~5% do ~70%), Dział VIII rozdz. 3 (art. 45-82a, nawigacyjnie), art. 42a-42i (pełny tryb WIS — domknięcie POZIOMU D bazy weryfikacji stawek), art. 31a-31b (kursy walut), art. 108b (uwolnienie środków z rachunku VAT), art. 126-130 (TAX FREE). NADAL OTWARTE: art. 121-125 (złoto inwestycyjne); art. 89 (VAT-REF); art. 110a-110e (CESOP); art. 108c-108g; art. 32 (szczątkowo); art. 13a-13l (call-off stock); art. 114 (taksówki); art. 84-85; art. 134a-134c; art. 138i-138j; art. 2 (systematyczny słownik definicji); art. 3 (właściwość organów); art. 28p; art. 44; art. 92-95; art. 101-102; art. 112-112aa; art. 106a/106d/106f/106l/106m-106q; Dział XIII rozdz. 1b (145c-145d wyroby medyczne)/1ca/1d; art. 43 ust. 3-5; centralizacja rozliczeń JST | Iteracja VIII (opcjonalna, niski priorytet): art. 145c-145d (wyroby medyczne — ⭐ jedyna pozycja o realnym sprzężeniu, wspiera mod-VAT-klasyfikacja) → art. 13a-13l (call-off stock) → art. 32 (szacowanie przy powiązaniach, spięcie z cenami transferowymi w mod-CIT) → art. 110a-110e (CESOP) → art. 89 (VAT-REF). Pozostałe pozycje wyłącznie na żądanie konkretnej sprawy |
| F-18 | Znaczniki weryfikacji w nowych sekcjach modułu VAT oparte na ŹRÓDLE-3 (web-fallback), nie na ISAP/ELI — `isap.sejm.gov.pl` blokuje `web_fetch` (ROBOTS_DISALLOWED), a `api.sejm.gov.pl/eli/.../text.pdf` dla ustawy o VAT to dokument 228-stronicowy, niemożliwy do odczytu fragmentarycznego dostępnymi narzędziami | dr-06-podatki-finanse-publiczne-aml | średni | 2026-08-12 | Treść przepisów pobrano z serwisu reprodukującego tekst jednolity Dz.U.2025.0.775 (stan na 12.08.2026), krzyżowo potwierdzoną w 2-4 niezależnych źródłach na przepis. Każda nowa sekcja nosi `✅ [VER: ...]` + `⚠️ [ZALECANA WERYFIKACJA ISAP]` zgodnie z procedurą ŹRÓDŁO-3 z PRAWO-HARDGATE. To NIE jest naruszenie hard gate'u (przepisy NIE pochodzą z pamięci modelu), ale poziom pewności jest niższy niż przy ŹRÓDLE-0/1 | Przed użyciem którejkolwiek nowej sekcji w piśmie procesowym — potwierdzić brzmienie powoływanej jednostki redakcyjnej w ISAP lub LEX/Legalis. Docelowo: rozwiązać problem fragmentarycznego odczytu dużych aktów przez ELI (np. przez konektor MCP z flagi F-8) |
| F-19 | Dług weryfikacyjny orzeczeń w nowych modułach VAT (iteracje VI-VII): kilka orzeczeń i interpretacji wskazano BEZ ustalonej albo BEZ zweryfikowanej u źródła sygnatury | dr-06-podatki-finanse-publiczne-aml | średni | 2026-08-12 | Pozycje: (a) TSUE ws. niezgodności art. 52 ust. 1 ustawy o VAT (warunek „odbiorcy przebywającego na terytorium kraju") — sygnatura NIEUSTALONA; (b) TSUE ws. przekazania środków z rachunku VAT na wniosek syndyka masy upadłości — sygnatura NIEUSTALONA; (c) linia NSA ws. fakultatywności decyzji o pozbawieniu prawa do art. 33a na 36 miesięcy — NIEZWERYFIKOWANA; (d) WSA w Łodzi I SA/Łd 190/20 i I SA/Łd 417/20 (charakter czynności wykreślenia z art. 96 ust. 9) — podane za źródłem RZĄD 2, NIEZWERYFIKOWANE u źródła; (e) interpretacje KIS 0114-KDIP1-3.4012.200.2019.2.JF oraz 0114-KDIP1-2.4012.141.2025.1.RM — podane za źródłem wtórnym. ⭐ ŁAGODZENIE: każda z tych pozycji jest w module opatrzona wyraźnym zakazem powoływania bez uprzedniej weryfikacji przez orzeczenia-sadowe-v2 / EUREKA — ryzyko wprowadzenia błędnej sygnatury do pisma jest zablokowane bramką, ale nie u źródła | Sesja dedykowana: przejść pozycje (a)-(e) przez `orzeczenia-sadowe-v2` (orzeczenia.nsa.gov.pl, curia.europa.eu, EUREKA), ustalić sygnatury i tezy, wpisać do modułów albo USUNĄĆ odesłanie, jeśli orzeczenie nie zostanie potwierdzone |





## ♾️ MONITORING — FLAGA PERMANENTNA, NIGDY NIE ZAMYKANA (dodano 2026-08-14, na żądanie użytkownika)

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

| F-22 | DR-02 — pięć drobnych, rezydualnych podpunktów pozostałych po wypełnieniu głównej treści F-21 (2026-08-13c) — żaden nie blokuje użycia macierzystej sekcji, każdy dotyczy pobocznego aspektu już w większości opracowanego tematu | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski | 2026-08-13c | (1) `mod-KC-spadki.md` EPS: szczegółowe zasady jurysdykcji rozp. 650/2012 (art. 4-19) przy rzeczywistym zbiegu elementów z kilku państw UE (np. professio iuris + zwykły pobyt za granicą) — główna procedura EPS już opisana; (2) `mod-KC-spadki.md` Tytuł X KC: praktyczne znaczenie pojedynczych przepisów, które PRZETRWAŁY wyrok TK P.4/99 (art. 1058, 1063, 1067, 1070, 1070¹, 1079, 1081, 1082, 1086) — sama cezura 14.02.2001 już ustalona i jest wystarczająca dla zdecydowanej większości spraw; (3) `mod-KC-spadki.md` spis inwentarza: dokładne stawki kosztów KOMORNICZYCH (opłata sądowa 300 zł już nie dotyczy tej ścieżki — to inna taksa); (4) `mod-piecza-zastepcza-rodzina-zastepcza.md`: limit 14/30 dzieci w placówkach opiekuńczo-wychowawczych oparty WYŁĄCZNIE na 1 źródle Rządu 3 (domydziecka.org) — wymaga potwierdzenia w art. 95/105 ustawy przed powołaniem w piśmie (ZASADA 12 — poniżej progu 2-3 źródeł); (5) `mod-piecza-zastepcza-rodzina-zastepcza.md`: regionalne placówki opiekuńczo-terapeutyczne i interwencyjne ośrodki preadopcyjne nadal całkowicie nieopracowane (rzadkie formy) | Web_search per punkt, wyłącznie na żądanie konkretnej sprawy — żaden z tych 5 podpunktów nie uzasadnia samodzielnie odrębnej sesji audytowej |

## DR-03 (badanie 2026-08-13)

| F-24 | DR-03 — nowelizacja ustawy o przeciwdziałaniu narkomanii (11.06.2026, dot. m.in. leczenia substytucyjnego — dostępność buprenorfiny/metadonu, centralny Wykaz wykluczający podwójny udział w programach) — ✅ POSTĘP 2026-08-13: POTWIERDZONE przez web_search (rynekzdrowia.pl, prawo.pl, ~2-3 tygodnie temu), że ustawa została PODPISANA przez Prezydenta. Zmienia bazowy akt Dz.U. 2023 poz. 1939. ⚠️ Dokładny numer Dz.U. SAMEJ nowelizacji (data promulgacji) WCIĄŻ nieustalony — nie znaleziony w dostępnych źródłach | dr-03-prawo-karne-wykroczenia-egzekucja (`mod-ustawa-narkomania.md`) | niski-średni (obniżony — pewność co do treści i statusu "podpisana" wysoka, brakuje tylko technicznego numeru promulgacji) | 2026-07-04, aktualizacja: 2026-08-13 | Treść merytoryczna nowelizacji już opisana w module. Dodatkowo potwierdzono zakres: zmienia też ustawę o Policji (nowy art. 15h dot. CBŚP) i Prawo farmaceutyczne (art. 72 ust. 8 pkt 5) | web_search za 1-2 tygodnie — numer Dz.U. powinien się pojawić po standardowym okresie między podpisaniem a publikacją |
| F-25 | DR-03 — `mod-grzywny-mandaty-szczegolowe.md` wymaga aktualizacji TREŚCI po poprawce numerów Dz.U. dla UPEA (2023.2505→2026.268, poprawiony 2026-07-02p) i KPSW (2025.860→2026.473, poprawiony 2026-07-02q) — numery w mapie już poprawne, ale sama treść modułu (kwoty, progi, procedury) mogła się zmienić między starym a nowym t.j. i NIE była re-weryfikowana pod kątem merytorycznym (ZASADA 11 — treść-po-mapie) | dr-03-prawo-karne-wykroczenia-egzekucja | średni (naruszenie ZASADY 11 jeśli pozostanie otwarte zbyt długo — poprawka numeru bez weryfikacji treści) | 2026-07-02 (poprawka numeru), migracja do rejestru: 2026-08-13 | Numery Dz.U. potwierdzone poprawnie w MAPA-AKTOW.md | Uruchomić FAZA 3E (`MOD-TRESC-MERYTORYCZNA.md`) dla obu aktów — sprawdzić, co konkretnie zmieniły nowelizacje między starym a nowym t.j., zanim moduł zostanie uznany za w pełni zamknięty |
| F-26 | DR-03 — siedem drobnych, punktowych luk "punkt startowy" rozrzuconych po 6 modułach, wykrytych w audycie zewnętrznym 2026-08-13 (analogicznie do dawnej F-21 w DR-02) | dr-03-prawo-karne-wykroczenia-egzekucja | niski (żadna nie blokuje macierzystej, w większości już opracowanej sekcji) | 2026-08-13 | (1) `mod-KK-KPK-framework-szczegolowy.md` — orzeczenie SN V KK 412/21 (obrona konieczna) niezweryfikowana sygnatura; (2) `mod-KK-art148-162-przeciwko-zyciu-zdrowiu.md` — art. 159 KK (typ kwalifikowany bójki/pobicia przez użycie niebezpiecznego narzędzia) treść i zagrożenie karą niezweryfikowane; (3) tamże — art. 161 §2 (narażenie na HIV jako typ odrębny) treść niezweryfikowana; (4) `mod-czynny-zal-KK-KKS-samooskarzenie.md` — art. 17 KK (czynny żal przy przygotowaniu) i art. 23 KK (czynny żal przy współdziałaniu) warunki niepotwierdzone; (5) `mod-KK-art233-244b-przeciwko-wymiarowi-sprawiedliwosci.md` — czy istnieje odrębny obowiązek zatrzymania się po wypadku (art. 44 PRD) poza już opisanym kontekstem ucieczki jako obostrzenia karnego; (6) `mod-podmiana-czesci-naprawa-oszustwo.md` — wątek przywłaszczenia oryginalnej części klienta (art. 284 KK) jako odrębna, równoległa kwalifikacja; (7) `mod-ustawa-narkomania.md` — dokładny katalog kategorii prekursorów (1/2/3 wg rozp. UE) i obowiązki przedsiębiorców | web_search per punkt, wyłącznie na żądanie konkretnej sprawy |

## 👁️ OBSERWOWANE — ZMIANY LEGISLACYJNE W TOKU (nie są flagami błędów — projekty ustaw jeszcze nieuchwalone, śledzone proaktywnie żeby nie przeoczyć wejścia w życie)

| ID | Projekt | Zakres dotknięty | Priorytet monitorowania | Status na 2026-08-14 | Źródło | Akcja przy zmianie statusu |
|---|---|---|---|---|---|---|
| OBS-1 | **Nowelizacja PIT/CIT/ryczałt na 2027 r.** (projekt UD116, Rządowe Centrum Legislacji, pilotowany przez MF/Andrzej Domański) | dr-06-podatki-finanse-publiczne-aml (`mod-PIT-podatek-dochodowy-fizyczne.md` i pokrewne, `mod-VAT-*` NIE dotyczy — to PIT/CIT/ryczałt) | średni-wysoki (planowane wejście 1.01.2027, ale zakres ISTOTNIE ZMNIEJSZONY między wersją kwietniową a lipcową — z 30+ do ~15 zmian; projekt NADAL na etapie opiniowania, może się zmienić ponownie) | Projekt opublikowany na RCL 16.03.2026, przyjęty przez Radę Ministrów (data dokładna niepotwierdzona w tym badaniu). Wersja z końca lipca 2026 (analiza pokazuje "zeszło z 30+ do ~15 modyfikacji") — kilka pierwotnych, radykalnych pomysłów WYCOFANYCH: podwyżka ryczałtu 8,5%→17% dla usług na rzecz podmiotów powiązanych — WYCOFANA (zostaje 8,5%); podwyżka ryczałtu od najmu >100 tys. zł, 12%→15% — WYCOFANA (zostaje 12%). Pozostałe w projekcie: (1) ulga mieszkaniowa (zwolnienie ze sprzedaży nieruchomości przed 5 lat) — ponowne skorzystanie możliwe dopiero po 3 latach od poprzedniego (obecnie: bez ograniczenia częstotliwości); (2) sprzedaż składników majątku wycofanych z działalności na rzecz rodziny — okres zwolnienia z PIT wydłużony z 6 miesięcy do 3 lat; (3) PIT-11/PIT-8C — zapowiadana "rewolucja" w obiegu informacji rocznych, pełna cyfryzacja (analiza pitax.pl sygnalizuje ryzyko osłabienia pozycji podatnika); (4) automatyczne udostępnianie danych — od 1.12.2026; nowe zasady korekty ksiąg/JPK — od 1.01.2027; (5) CIT: ograniczenie "ukrytej dywidendy" (dzierżawa znaku towarowego/nieruchomości wspólnika dla własnej spółki), datio in solutum jako odpłatne zbycie. **ODRĘBNY, LUŹNIEJSZY wątek** (na wcześniejszym etapie, nie część UD116): rozważana gruntowna reforma SKALI PIT — dodatkowe, pośrednie progi podatkowe zamiast podniesienia kwoty wolnej do 60 tys. zł (obietnica wyborcza WYCOFANA ze względu na koszt 45-50 mld zł/rok) — rząd deklaruje projekt do Sejmu JESIENIĄ 2026, z półrocznym vacatio legis (czyli NIE wejdzie 1.01.2027, raczej w trakcie 2027) | web_search 2026-08-14, 6+ źródeł (zero.pl, akademialtca.pl, goniec.pl, pitax.pl, pit.pl, wprawieni.pl, taxcoach.pl, stronymonki.pl) | Sprawdzić status co 4-6 tygodni (projekt w aktywnej fazie legislacyjnej, zakres już raz istotnie się zmienił). Gdy ustawa zostanie UCHWALONA — przenieść z tej sekcji do standardowej naprawy (nowa flaga F- lub bezpośrednia aktualizacja modułu PIT), z priorytetem WYSOKIM (wejście w życie 1.01.2027 lub w trakcie 2027 przy reformie skali) |

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

| F-28 | DR-04 — 6 flag ⚠️ istniejących WYŁĄCZNIE lokalnie w `MAPA-AKTOW.md` DR-04, nigdy niemigrowanych do centralnego rejestru | dr-04-prawo-pracy-zus-swiadczenia | średni | 2026-07-02 do 2026-07-30, migracja: 2026-08-13 | (1) `mod-KRUS-rolnicze-ubezpieczenia` — numer poprawiony (2024.90→2025.1770), TREŚĆ niezweryfikowana; (2) `mod-ustawa-pomoc-spoleczna` — numer poprawiony (2025.1214→2026.639), TREŚĆ niezweryfikowana; (3) `mod-SUS-ZUS-ubezpieczenia-spoleczne` — niepotwierdzona ewentualna zmiana Dz.U. 2026 poz. 507; (4) `mod-ustawa-zwiazki-zawodowe-spory-zbiorowe` — NAZWA modułu myląca (dotyczy układów zbiorowych, nie sporów zbiorowych); (5) `mod-KP-dzial-III-wynagrodzenie-swiadczenia-jawnosc` — status ustawy implementującej Etap 2-3 dyrektywy UE 2023/970 niepotwierdzony; (6) `mod-KP-mobbing-dyskryminacja` — ustawa antymobbingowa podpisana 30.07.2026, dokładny numer Dz.U. NIEZWERYFIKOWANY | Web_search per punkt — (6) najpilniejsze |
| F-29 | DR-04 — cztery drobne punkty "punkt startowy"/niezweryfikowane w treści modułów + 1 lekka luka niszowa (emerytury pomostowe — zero wzmianek w całym DR-04) | dr-04-prawo-pracy-zus-swiadczenia | niski | 2026-08-13 | (1) `mod-KP-dzial-V-XIV-odpowiedzialnosc-materialna-przedawnienie.md` — art. 292-295 KP niezbadane; (2) `mod-dodatek-pielegnacyjny-swiadczenie-rehabilitacyjne-wyrownawcze.md` — DWIE jawnie oznaczone "GENUINE LUKA": ulga rehabilitacyjna PIT i zwolnienie z opłaty abonamentowej RTV; (3) `mod-reforma-stazu-pracy-2025-2026.md` — tryb sporu przy zaliczaniu okresów B2B/zlecenia niezweryfikowany; (4) emerytury pomostowe — ZERO wzmianek w całym DR-04 | Web_search per punkt, wyłącznie na żądanie konkretnej sprawy |

## DR-05 (badanie 2026-08-13)

| F-31 | DR-05 — 2 flagi ⚠️ "WYMAGA AKTUALIZACJI MODUŁU" istniejące wyłącznie lokalnie | dr-05-prawo-administracyjne-sadowoadministracyjne | średni | 2026-07-02, migracja: 2026-08-13 | (1) `mod-ustawa-kontrola-administracji.md` — numer poprawiony (2020.224→2026.158), TREŚĆ niezweryfikowana; (2) `mod-ustawa-dostepnosc-niepelnosprawni.md` — numer poprawiony (2022.2240→2024.1411), TREŚĆ niezweryfikowana — ⚠️ TEN SAM błędny numer źródłowy (2022.2240) był też znaleziony w dr-10/MAPA-AKTOW.md tego samego dnia (POTWIERDZONE w sesji DR-10, patrz F-45) | Web_search per punkt, sprawdzić FAZA 3E dla obu |
| F-32 | DR-05 — 1 drobny punkt "punkt startowy" | dr-05-prawo-administracyjne-sadowoadministracyjne (`mod-ustawa-cudzoziemcy-zatrudnianie.md`) | bardzo niski | 2026-08-13 | Merytoryczne uzasadnienie wyboru akurat 3 państw (Wenezuela, Gruzja, Kolumbia) wyłączonych z pracy w ruchu bezwizowym (Dz.U. 2026.1072) niezweryfikowane. Numer aktu i sama treść listy PEWNE | Web_search wyłącznie na żądanie konkretnej sprawy |

## DR-06 (badanie 2026-08-13)

| F-33 | DR-06 — 12 z 41 modułów (~29%) fizycznie istnieje na dysku i JEST wliczonych do licznika nagłówka "41 łącznie — ✓ 41 OK", ale NIE MA formalnego wpisu `[✓]` w bloku checklisty SKILL.md. Z tych 12: **6 modułów jest DODATKOWO całkowicie nieobecnych też w `MAPA-AKTOW.md`** | dr-06-podatki-finanse-publiczne-aml | **wysoki** | 2026-08-13 | **BRAK wpisu w SKILL.md, obecne w MAPA-AKTOW.md (6):** mod-JPK-ksiegi-elektroniczne-e-sprawozdania, mod-PKPiR-ewidencje-uproszczone, mod-kasy-rejestrujace-fiskalizacja, mod-limit-platnosci-gotowkowych, mod-rachunkowosc-budzetowa-JSFP, mod-ustawa-rachunkowosci. **BRAK wpisu w OBU rejestrach (6):** mod-OP-kontrola-podatkowa-dzial-VI, mod-VAT-ewidencja-deklaracje, mod-VAT-miejsce-swiadczenia-zwolnienia, mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci, mod-VAT-sankcje-bony-odliczenia, mod-VAT-transakcje-fakturowanie | Dopisać wszystkie 12 do bloku `[✓]` w SKILL.md; dopisać brakujący wiersz dla mod-OP-kontrola-podatkowa-dzial-VI i rozbić zbiorczy wiersz VAT na 6 osobnych wierszy w MAPA-AKTOW.md |
| F-34 | DR-06 — centralna flaga **F-17** (pokrycie VAT ~85%) jest ZDEZAKTUALIZOWANA — lokalna mapa dokumentuje DALSZY postęp (ETAP 2a/2b/2c, 2026-08-13) z konkluzją "wszystkie priorytetowe luki VAT domknięte" | dr-06-podatki-finanse-publiczne-aml | średni | F-17 z 2026-08-12, dezaktualizacja: 2026-08-13 | Postęp ETAP 2a/2b/2c udokumentowany szczegółowo w MAPA-AKTOW.md | Zaktualizować treść F-17 |
| F-35 | DR-06 — osiem drobnych, punktowych "punkt startowy" rozrzuconych po 6 modułach spoza głównego kompleksu VAT | dr-06-podatki-finanse-publiczne-aml | niski | 2026-08-13 | (1) mod-PIT — breaker rules rezydencji; (2) mod-VAT-klasyfikacja-produktow — 5 dalszych kategorii; (3) mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci — weryfikacja celna; (4) mod-clo-podroznych — katalog niewyczerpujący + rozp. 608/2013; (5) mod-odliczenia-uzytek-mieszany-KUP — rejestr CRP-26; (6) mod-ustawa-rachunkowosci — cross-check KSH ×2; (7) mod-ustawa-uslugi-platnicze — zakres PSD3 | Web_search per punkt |

## DR-07 (badanie 2026-08-13)

| F-36 | DR-07 — nietypowo WYSOKA koncentracja flag "WYMAGA AKTUALIZACJI MODUŁU": 4 z 16 modułów (25%) + moduł GŁÓWNY (PZP) z własnym zastrzeżeniem częściowej re-weryfikacji | dr-07-zamowienia-publiczne-fundusze-ue | średni-wysoki | 2026-07-02, migracja: 2026-08-13 | (1) `mod-PZP-zamowienia-publiczne-KIO.md` (moduł GŁÓWNY) — numer poprawiony (2024.1320→2026.793), reszta modułu nieweryfikowana; (2) `mod-ustawa-Prokuratorii-Generalnej.md` — numer poprawiony (2023.1109→2024.1192); (3) `mod-ustawa-RIO-regionalne-izby.md` — numer poprawiony (2023.1325→2025.7); (4) `mod-ustawa-dyscyplina-finansow-publicznych.md` — numer poprawiony (2024.104→2025.1484); (5) `mod-ustawa-fundusze-UE-pomoc-publiczna.md` — numer poprawiony (2024.1655→2025.1733) | Priorytet: PZP jako moduł główny w pierwszej kolejności |
| F-38 | DR-07 — 1 drobny punkt (ROZSTRZYGNIĘTO 2/2 — numer PPP już poprawny) | dr-07-zamowienia-publiczne-fundusze-ue | bardzo niski | 2026-08-13, częściowa naprawa: 2026-08-13 | `mod-PZP-dzial-I...` — Rozdziały 7-8 (komunikacja elektroniczna, dokumentowanie postępowania) niezbadane szczegółowo | Web_search na żądanie konkretnej sprawy |

## DR-09 (badanie 2026-08-13)

| F-39 | DR-09 — `mod-POS-prawo-ochrony-srodowiska-szczegoly.md` ma w mapie status **⚠️ SPRAWDŹ** BEZ przypisanego konkretnego aktu prawnego — problem NIE jest do rozwiązania samą weryfikacją Dz.U., tylko wymaga DOPRECYZOWANIA ZAKRESU modułu | dr-09-budownictwo-srodowisko-energia-transport | średni | 2026-07-02, migracja: 2026-08-13 | Moduł fizycznie istnieje i ma wpis w checkliście SKILL.md | Sesja przeglądowa: ustalić czy moduł duplikuje mod-POS-prawo-ochrony-srodowiska |
| F-40 | DR-09 — 3 flagi ⚠️ "WYMAGA AKTUALIZACJI MODUŁU" istniejące wyłącznie lokalnie | dr-09-budownictwo-srodowisko-energia-transport | średni | 2026-07-02, migracja: 2026-08-13 | (1) `mod-PrGeodezyjne-kartografia-wywlaszczenia.md` — numer poprawiony (2023.1752→2024.1151); (2) `mod-UGN-gospodarka-nieruchomosciami.md` — numer poprawiony (2024.1899→2026.399); (3) `mod-prawo-geologiczne-gornicze.md` — numer poprawiony (2024.1290→2026.69) | Web_search per punkt |
| F-41 | DR-09 — SZEŚĆ modułów oznaczonych "✅ NOWY" (2026-07-18 do 2026-07-21), których PODSTAWOWY akt prawny NIGDY nie przeszedł nawet pierwszej weryfikacji numeru Dz.U. w ISAP | dr-09-budownictwo-srodowisko-energia-transport | **wysoki** | 2026-07-18 do 2026-07-21, wykrycie: 2026-08-13 | (1) `mod-GDDKiA-specustawa-drogowa-ZRID.md`; (2) `mod-lowiectwo-klusownictwo.md` — 2 ustawy; (3) `mod-PrBud-patodeweloperka...` — rozp. + Prawo wodne art. 77; (4) `mod-srodowisko-wycinka-odpady-niebezpieczne-rekultywacja.md` — 4 ustawy; (5) `mod-inspekcja-ochrony-srodowiska-GIOS-WIOS.md`; (6) `mod-system-kaucyjny-opakowania.md` | PILNE (relatywnie): sesja TRYB DZU dedykowana tym 6 modułom |
| F-42 | DR-09 — 3 drobne punkty "punkt startowy" + 1 status projektu niezweryfikowany | dr-09-budownictwo-srodowisko-energia-transport | niski | 2026-08-13 | (1) GDDKiA — wycena nieruchomości; (2) formy ochrony przyrody — ochrona gatunkowa; (3) inspekcja GIOŚ/WIOŚ — dodatkowy wątek; (4) ochrona zabytków — status finalizacji nowelizacji rozp. warunków technicznych + projekt zmiany ustawy o własności lokali | Web_search per punkt |

## DR-10 (badanie 2026-08-13)

| F-43 | DR-10 — "ustawa łańcuchowa" (zakaz trzymania psów/kotów na uwięzi) PODPISANA 24.07.2026 — mapa JAWNIE oznacza status "⏳ TODO — treść merytoryczna NIE OPRACOWANA", brak dedykowanej treści w JAKIMKOLWIEK module | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | średni-wysoki | 2026-07-30, migracja: 2026-08-13 | Numer Dz.U. również NIEZWERYFIKOWANY | Nowy moduł/sekcja w mod-ustawa-hodowla-zdrowie-zwierzat |
| F-45 | DR-10 — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-13: rejestracyjna część naprawiona — dodano 2 wpisy `[✓]` i 1 wiersz mapy. **Pozostają 3 flagi treściowe "WYMAGA AKTUALIZACJI MODUŁU"** | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | niski-średni (obniżony po zamknięciu części rejestracyjnej) | 2026-07-02 do 2026-08-12, częściowa naprawa: 2026-08-13 | (1) GIS w `mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny.md` — numer poprawiony, treść niezweryfikowana; (2) Prawo oświatowe w `mod-ustawa-oswiata-szkolnictwo-wyzsze.md` — numer poprawiony, treść niezweryfikowana; (3) oba składniki `mod-ustawa-edukacja-specjalna-dostepnosc.md` — POTWIERDZONE: ten sam błędny numer źródłowy 2022.2240 co w DR-05 (F-31, wciąż otwarta) | FAZA 3E dla wszystkich 3 — rozważyć naprawić razem z F-31 (ten sam akt) |
| F-47 | DR-10 — 2 drobne punkty "punkt startowy" | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | bardzo niski | 2026-08-13 | (1) mod-rzadkie-choroby-genetyczne — odesłanie do sprawdzenia odrębnie; (2) mod-ustawa-hodowla-zdrowie-zwierzat — wątek niezweryfikowany | Web_search wyłącznie na żądanie |

## DR-11 (badanie 2026-08-13)

| F-48 | DR-11 — (a) `mod-ustawa-certyfikacja-cyberbezpieczenstwa.md` jest UCZCIWIE oznaczony jako STUB (nie ukryty "moduł-widmo"), nigdy niescentralizowany; (b) 3 moduły rodziny RODO (DPIA, DSAR, RCP-DPA) brakują w MAPA-AKTOW.md | dr-11-cyfrowe-cyber-ai-dane-ip | (a) niski — świadomie odłożone; (b) bardzo niski | 2026-06-05 (STUB), 2026-08-13 (migracja) | STUB: akt bazowy (Dz.U. 2025 poz. 1017) już potwierdzony | (a) Rozbudować STUB gdy przepisy wejdą w życie; (b) dopisać 3 wiersze do mapy |
| F-49 | DR-11 — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-13: sprzeczna notatka (KSC/NIS2 wciąż wymieniana jako otwarta mimo zamknięcia 2026-07-26) NAPRAWIONA — usunięta z notatki podsumowującej. **Pozostają 3 standardowe flagi "WYMAGA AKTUALIZACJI MODUŁU"** | dr-11-cyfrowe-cyber-ai-dane-ip | niski-średni (obniżony po naprawie notatki) | 2026-07-02, częściowa naprawa: 2026-08-13 | (1) `mod-PrTelekom-poczta-UKE.md` — numer poprawiony (1220→1221) + NAZWA myląca; (2) `mod-ustawa-informatyzacja-podmiotow-publicznych.md` — numer poprawiony (2024.1557→2025.1703); (3) `mod-ustawa-podpis-elektroniczny.md` — numer poprawiony (2016.147→2016.1579), eIDAS 2.0 w toku | FAZA 3E dla 3 pozostałych |
| F-50 | DR-11 — ustawa krajowa o systemach sztucznej inteligencji (KRiBSI) PODPISANA 24.07.2026 — numer Dz.U. NIEZWERYFIKOWANY, wzorzec analogiczny do F-41/F-46 | dr-11-cyfrowe-cyber-ai-dane-ip (`mod-AI-Act-framework.md`) | średni-wysoki (temat bardzo aktywny) | 2026-07-30, migracja: 2026-08-13 | Moduł już zaktualizowany o fakt, że KRiBSI stał się realnym organem | Web_search "ustawa o systemach sztucznej inteligencji Dz.U. 2026" |

## DR-12 (badanie 2026-08-13)

| F-56 | DR-12 — obszerne śledztwo (167 linii) dot. jawności orzeczeń dyscyplinarnych 19 izb radców + 24 izb adwokackich — wątek RADCOWIE zamknięty, wątek ADWOKATURA bez zamknięcia | dr-12-sadownictwo-prokuratura-zawody-prawnicze | niski (informacyjne, nie prawne, ale wartościowe) | 2026-07-16, migracja: 2026-08-13 | Metodologia w pełni udokumentowana | Decyzja: formalnie zamknąć wątek adwokatura albo dokończyć 9 pozostałych izb |

## DR-13 (badanie 2026-08-13)

| F-57 | DR-13 — NAJWYŻSZA dotąd gęstość flag "WYMAGA AKTUALIZACJI MODUŁU": 6 aktów w 5 z 10 modułów (50% domeny) | dr-13-sluzby-bezpieczenstwo-informacje-niejawne | **wysoki** | 2026-07-02, migracja: 2026-08-13 | (1) `mod-ustawa-policja.md` — DWIE flagi (Policja: 2024.1589→2025.636; środki przymusu: 2023.202→2026.244); (2) `mod-ustawa-zandarmeria-wojskowa.md` — 2024.1654→2026.159; (3) `mod-ustawa-ABW-AW-CBA...` (CBA) — 2024.1392→2025.712; (4) `mod-ustawa-obrona-ojczyzny-mobilizacja.md` — błąd jakościowy klasyfikacji; (5) `mod-ustawa-szczegolne-srodki-zabezpieczajace.md` (KOZZiD) — 2020.2001→2022.1689 | FAZA 3E dla wszystkich 6 |

## DR-14 (badanie 2026-08-13)

| F-60 | DR-14 — luka strukturalna: Konwencje Wiedeńskie o stosunkach dyplomatycznych (1961) i konsularnych (1963) — ZERO wzmianek | dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka | średni | 2026-08-13 | Brak — temat nigdy nie był opracowany | Nowy moduł/rozszerzenie mod-NATO / mod-ONZ |
| F-61 | DR-14 — luka strukturalna: Konwencja genewska 1951 o statusie uchodźców + Protokół 1967 — ZERO wzmianek w DR-14 I DR-05 | dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka (możliwie też dr-05) | średni | 2026-08-13 | Historycznie sprawdzone razem z F-30 (DR-05, cudzoziemcy/Ukraina — ZAMKNIĘTA 2026-08-13, była tylko przestarzałą notatką, nie realną treściową luką) — TA flaga (F-61) pozostaje otwarta jako ODRĘBNA, REALNA luka: fundament traktatowy (definicja uchodźcy, non-refoulement) wciąż nieobecny w żadnym module | Ustalić właściwy DR dla tego traktatu (prawdopodobnie DR-14 jako fundament + odesłanie z DR-05) |

## DR-15 (badanie 2026-08-13)



## RAPORTY POKRYCIA 2026-08-13 (materiał zewnętrzny, dostarczony przez użytkownika)

> Pełne raporty (metodologia, tabela rozdział-po-rozdziale, uzasadnienia) zachowane trwale w `references/raporty-pokrycia-2026-08-13/`. Poniższe wiersze to skrócone streszczenia z odniesieniem do pliku źródłowego — przy naprawie zawsze wczytać pełny raport, nie polegać wyłącznie na tym wierszu. Priorytety wg indeksu zbiorczego (`00-indeks-raportow-pokrycia.md`) — patrz też sekcja "Najpilniejsze braki łącznie" w tym pliku dla rankingu cross-kodeksowego.

| F-64 | **PPSA — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-13:** pierwszy dedykowany moduł PPSA UTWORZONY (`mod-PPSA-terminy-kasacja-prawo-pomocy.md`), naprawiając 3 z 5 pierwotnie wskazanych priorytetów: uchybienie/przywrócenie terminu (85-89), skarga kasacyjna do NSA (173-193), prawo pomocy (245-259). Jedna wyspa była już wcześniej dobrze opracowana: kwalifikacja skargi (art. 3 §2, 50–62, 145/147/148/152), NIE dotknięta tą naprawą. **Pozostają otwarte:** sprzeciw od decyzji/postanowienia (64a–64e), wznowienie postępowania sądowoadministracyjnego (270–285), posiedzenia sądowe (90-114), pełne opracowanie orzeczeń poza wąskim wycinkiem (132-144) | dr-05-prawo-administracyjne-sadowoadministracyjne | średni (obniżony z "najwyższy" — rdzeń praktyczny naprawiony, pozostają tematy drugorzędne) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-13 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PPSA.md` | 1) Sprzeciw od decyzji/postanowienia (64a-64e) — dopełnienie już dobrze opracowanego milczącego załatwienia z KPA; 2) Wznowienie postępowania sądowoadministracyjnego (270-285) — domknięcie asymetrii względem KPA; 3) Posiedzenia sądowe (90-114) |
| F-65 | **KPC — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14:** prawomocność orzeczeń (365-366, w tym powaga rzeczy osądzonej z dwoma ograniczeniami) i granice apelacji (378, 380-386, w tym zakaz reformationis in peius) NAPRAWIONE nowym modułem `mod-KPC-prawomocnosc-granice-apelacji.md`. **"DEKLARACJA BEZ POKRYCIA" ROZSTRZYGNIĘTA jako FAŁSZYWY ALARM:** sprzeciw od referendarza (art. 398²²-398²⁴) MA realną treść w `pisma-proste-v2/references/SPH-inne.md` (wzór, cytaty, termin 7 dni) — raport zewnętrzny sprawdzał tylko moduły DR-, nie własne pliki pisma-proste-v2, stąd fałszywy alarm. Mocna strona (dowody, 227-315) BEZ ZMIAN. **Pozostają otwarte:** organizacja postępowania/prekluzja (205¹-205¹², rdzeń reformy 2019), sprawy gospodarcze (458¹-458¹³), ograniczenia egzekucji (829, 833 — kwota wolna od egzekucji), egzekucja świadczeń niepieniężnych/eksmisja (1041-1059), egzekucja alimentów (1081-1088), skarga kasacyjna do SN (398¹-398²¹), zażalenie, wznowienie cywilne, oraz CAŁA Księga II Nieproces (0×🟢/6×🔴 — brak jakiegokolwiek modułu procedury nieprocesowej) | cross-DR (dr-02, dr-05, dr-12, dr-16) | wysoki (obniżony ostrożnie — 2 z 8 punktów naprawione, ale Księga II Nieproces to wciąż całkowita, strukturalna luka porównywalna wagą do F-64/PPSA przed naprawą) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KPC.md` | 1) Księga II Nieproces — CAŁKOWITY brak (analogiczne do dawnego stanu PPSA, priorytet zerowy dla TEJ części); 2) organizacja postępowania/prekluzja (205¹-205¹², rdzeń reformy 2019); 3) ograniczenia egzekucji (829, 833 — kwota wolna, wysoka częstość praktyczna) |
| F-66 | **KPK — 56% rozdziałów 🔴 BRAK, tylko 12% materii artykułowej pokryte.** ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-13: fragment dot. tymczasowego aresztowania (249, 258, 259, 263) NAPRAWIONY nowym modułem `mod-KPK-srodki-zapobiegawcze-tymczasowe-aresztowanie.md` (dawniej wspólnie z F-23, patrz AUDIT-JOURNAL). **Pozostałe otwarte luki krytyczne:** względne przyczyny odwoławcze (438, 425–437), przesłanki procesowe umorzenia (17), przedstawienie zarzutów (313), dostęp do akt (156 §5), biegli w procesie karnym (193–206, zero — mod-KPC-biegli obsługuje wyłącznie stronę cywilną), oskarżenie prywatne (485–499), wyrok łączny (568a–577). **DODATKOWO — nieaktualna metryka:** `dr-03/MAPA-AKTOW.md` cytuje Dz.U. 2026 poz. 490, ale pominięte są 2 późniejsze nowelizacje (2026.421, 2026.638 — zmienia art. 25 §1 pkt 2, w życie 28.05.2026) — ⚠️ ta uwaga TERAZ dopisana do nowego modułu jako ostrzeżenie, ale sama metryka w mapie NADAL niepoprawiona | dr-03-prawo-karne-wykroczenia-egzekucja | średni-wysoki (obniżony z "wysoki" po zamknięciu najpilniejszego fragmentu — aresztowania) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-13 (ta sesja) | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KPK.md` | Priorytet 1: mod-KPK-podstawy-odwolawcze (425–443a); mod-KPK-przeslanki-procesowe (17+22+11); mod-KPK-biegli (193-206). Osobno: dopisać do MAPA-AKTOW.md 2 pominięte nowelizacje (numer bazowy KPK) |
| F-67 | **KW — część ogólna (art. 1–48) całkowicie nieobecna jako moduł.** Rozdz. XIV (mienie) i XVI (obyczajność) pełne. Rozdz. XIX (szkodnictwo leśne/polne, 148–166) — tylko 3 z 19 artykułów, 16 brakujących | dr-03-prawo-karne-wykroczenia-egzekucja | średni-wysoki | 2026-08-13 (raport zewnętrzny) | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KW.md` | 1) Rozdz. XIX art. 151–166; 2) część ogólna art. 1–48; 3) Rozdz. XI poza taryfikatorem |
| F-68 | **KSH — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14:** organy sp. z o.o. (Tytuł III, Dział I, Rozdz. 3, art. 201-254 — najwyższy priorytet z rankingu raportu, najpopularniejsza forma spółki) NAPRAWIONE nowym modułem `mod-KSH-organy-spolki-zoo.md` (zarząd — dwie funkcje, zakaz ograniczenia reprezentacji wobec osób trzecich, konflikt interesów; zgromadzenie wspólników — tryb obiegowy, kompetencje zastrzeżone/absolutorium, progi uchwał art. 229/230, zastępcze zwołanie przez radę nadzorczą). ~600 artykułów KSH ogółem — **pozostaje otwarte:** Tytuł I i Tytuł II (spółki osobowe, 129 art.) praktycznie zerowe; Oddział 2 tego samego Rozdziału 3 (nadzór/rada nadzorcza, 212-226) nadal niezbadany; Dział Ia (PSA) i Dział II (S.A.) prawie puste (339 art. łącznie); **Tytuł IV w całości (łączenie/podział/przekształcanie, ~94 art.) — zero treści** | dr-02-prawo-cywilne-rodzinne-gospodarcze | średni-wysoki (obniżony z "wysoki" — najpopularniejsza forma spółki ma teraz rdzeń organizacyjny, ale reszta aktu wciąż w dużej mierze pusta) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KSH.md` | 1) Tytuł IV — łączenie/podział/przekształcanie (491-584¹³, ~94 art., kompletnie pusta luka przy rosnącym znaczeniu M&A); 2) Tytuł II — sp. jawna/komandytowa (22-66, 102-124); 3) Rozdz. 3 Oddz. 2 — nadzór/rada nadzorcza (212-226), dopełnienie już opracowanego Rozdziału 3 |
| F-69 | **PrUp/PrRestr — asymetria w jednym module.** ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14: Dział VI PrRestr — Układ (150–179), JEDYNA centralna instytucja całej ustawy PrRestr, NAPRAWIONY nowym modułem `mod-PrRestr-dzial-VI-uklad.md` (przepisy ogólne, propozycje układowe, głosowanie/zatwierdzenie z art. 119, test zaspokojenia — nowość 2025, skutki układu). PrUp nadal ma kilka dobrze opracowanych węzłów (niezmienione tą naprawą). **Pozostają otwarte:** PrRestr Tytuł II — 4 tryby restrukturyzacji z podstawą prawną (210–334, tabela porównawcza wciąż bez numerów artykułów); PrUp Tytuł IV — rola syndyka (149–235) | dr-02-prawo-cywilne-rodzinne-gospodarcze | średni (obniżony z "wysoki" — jedyna centralna instytucja PrRestr naprawiona) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrUp-PrRestr.md` | 1) PrRestr Tytuł II — nadanie podstawy prawnej istniejącej tabeli 4 trybów (210–334); 2) PrUp Tytuł IV — rola syndyka (149–235) |
| F-70 | **OP — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14:** Dział IV Rozdz. 11 — dowody w postępowaniu podatkowym (180-200), etap decydujący o wyniku większości sporów, NAPRAWIONY nowym modułem `mod-OP-dzial-IV-rozdzial-11-dowody.md` (zasady ogólne, zasada inkwizycyjności organu art. 187, otwarty katalog dowodów art. 181, swobodna ocena art. 191, KSIĘGI PODATKOWE art. 193 — domniemanie mocy dowodowej z ciężarem obalenia na organie). **Pozostają otwarte:** kontrola podatkowa (281-292) i czynności sprawdzające (272-280) — całkowicie nieobecne | dr-06-podatki-finanse-publiczne-aml | średni (obniżony z "wysoki" — najważniejszy z 3 punktów naprawiony) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-OP.md` | 1) Dział VI — kontrola podatkowa (281-292, pierwszy kontakt podatnika z organem); 2) Dział V — czynności sprawdzające (272-280, najczęstsza forma weryfikacji deklaracji) |
| F-71 | **PZP — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14:** Dział II (183 art., >1/4 ustawy) — kwalifikacja podmiotowa wykonawców (warunki udziału art. 112, JEDZ i mechanizm dwuetapowy art. 125/126 — pełne dokumenty żąda się TYLKO od zwycięzcy), kryteria oceny ofert (239-243, wymóg jednoznaczności art. 240), unieważnienie postępowania (255-258, katalog obligatoryjny zamknięty + fakultatywne NIE jako "wytrych") NAPRAWIONE nowym modułem `mod-PZP-dzial-II-kwalifikacja-kryteria-uniewaznienie.md`. **Pozostają otwarte:** procedura otwarcia i BADANIA ofert krok po kroku (poza samymi kryteriami), Dział IV (umowa ramowa, DSZ, konkurs, partnerstwo innowacyjne — tylko nazwy), przebieg postępowania przed KIO (dowody 531-543, rozprawa, orzeczenia Izby) | dr-07-zamowienia-publiczne-fundusze-ue | średni (obniżony z "średni-wysoki" — sam rdzeń kwalifikacji/kryteriów/unieważnienia naprawiony) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PZP.md` | 1) Otwarcie/badanie ofert — procedura krok po kroku; 2) Dział IX dokończenie — przebieg postępowania przed KIO (531-568a); 3) Dział IV — instrumenty szczególne (311-361) |
| F-73 | **KRO — najlepiej pokryty akt spośród wszystkich zbadanych.** Potwierdza wcześniejszą naprawę tej sesji (2026-08-13b/c). Pozostałe realne luki: art. 87–91 (obowiązki rodzice-dzieci — poz. 27 indeksu zbiorczego), przepisy ogólne o pokrewieństwie (61⁷–618), macierzyństwo jako instytucja | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski-średni | 2026-08-13 (raport zewnętrzny) | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KRO.md` | 1) art. 87–91 (niska pracochłonność); 2) art. 61⁷–618; 3) macierzyństwo |
| F-74 | **PrBud — moduł "żywy", iteracyjnie rozbudowywany, ale nierówny.** Mocne strony: samowola budowlana (Rozdz. 5b, 48–53a — najlepiej opracowany fragment całego aktu), postępowanie poprzedzające roboty (Rozdz. 4), zmiana sposobu użytkowania (71/71a), ścieżka odwoławcza. **Zero treści:** Rozdz. 5/5a/5d (rozpoczęcie robót, dziennik budowy, książka obiektu), Rozdz. 7 (katastrofa budowlana), Rozdz. 8 (organy PINB/WINB — kompetencje znane tylko pośrednio), Rozdz. 10 (odpowiedzialność zawodowa). Rozdz. 3 (prawa/obowiązki uczestników procesu budowlanego, 17–27a) i Rozdz. 9 (przepisy karne) — zadeklarowane w zakresie modułu, ale bez rzeczywistej treści (ta sama rozbieżność deklaracja/wykonanie co przy rencie rodzinnej FUS) | dr-09-budownictwo-srodowisko-energia-transport | średni-wysoki | 2026-08-13 (raport zewnętrzny) | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-PrBud.md` | 1) Rozdz. 3 — uczestnicy procesu budowlanego (17–27a, dokończenie już zadeklarowanego tematu); 2) Rozdz. 8 — organy PINB/WINB (80–89c); 3) Rozdz. 9 — przepisy karne pełna treść (90–94) |

| F-75 | **KKW — ✅ CZĘŚCIOWO ZAMKNIĘTE 2026-08-14:** dodano realną treść merytoryczną (sekcja 0) do modułu, dotąd czysto generycznego szablonu — naprawiono WSZYSTKIE 3 pierwotnie wskazane priorytety: warunkowe przedterminowe zwolnienie (159-163, w tym kluczowy art. 161 §3-4 wykorzystujący doświadczenie sprawy Marek Petelski), odroczenie/przerwa wykonania kary (150-158a), dozór elektroniczny (43a-43zf). Naprawiono też niezgodność nazwy wewnętrznej pliku. Oryginalny szablon strategiczny (12 sekcji) ZACHOWANY jako warstwa uzupełniająca. **Pozostaje otwarte:** cała reszta struktury KKW nadal bez treści — Rozdz. IV postępowanie wykonawcze (9-31), Oddz. 4 prawa/obowiązki skazanego (101-120), Oddz. 9 kary dyscyplinarne (142-149), Rozdz. XI dozór kuratora (169-178a), środki karne/kompensacyjne (179-223n) i dalsze | dr-03-prawo-karne-wykroczenia-egzekucja | średni (obniżony z "najwyższy" — 3 najczęściej używane w praktyce instytucje naprawione, reszta struktury mniej pilna) | 2026-08-13 (raport zewnętrzny), częściowa naprawa: 2026-08-14 | `references/raporty-pokrycia-2026-08-13/raport-pokrycia-KKW.md` | 1) Oddz. 4 — prawa i obowiązki skazanego (101-120, widzenia/korespondencja/opieka zdrowotna); 2) Oddz. 9 — kary dyscyplinarne (142-149); 3) Rozdz. IV — postępowanie wykonawcze (9-31), fundament proceduralny |

**Obserwacje informacyjne (nie są formalnymi flagami, nie blokują, ale warto pamiętać):**


| # | Obserwacja | Skill | Opis |
|---|---|---|---|
| O-1 | Nowelizacja ABW/AW ws. treści terrorystycznych (Dz.U. 2024 poz. 1684) nieopisana w module | dr-13-sluzby-bezpieczenstwo-informacje-niejawne | Uprawnienia Szefa ABW do nakazów usunięcia treści terrorystycznych (implementacja rozp. UE 2021/784) nie są opisane w `mod-ustawa-ABW-AW-CBA-sluzby-specjalne.md`. Odkryte przy okazji naprawy WARN-28/29 (2026-07-07a). Wąska kompetencja, rzadko aktywna w typowej sprawie DR-13. |

---

## Jak korzystać z tego pliku

- **Pytanie "co jest jeszcze otwarte?"** → odpowiedz na podstawie tabel powyżej, nie grepuj AUDIT-JOURNAL.md.
- **Zamykasz flagę F-N?** → usuń jej wiersz z tabeli powyżej, dodaj pełny opis naprawy jako nowy wpis w `AUDIT-JOURNAL.md` (z numerem/kodem flagi w tytule wpisu dla identyfikowalności).
- **Otwierasz nową flagę?** → dodaj wiersz tutaj (kolejny wolny numer F-N lub WARN-N zgodnie z konwencją) ORAZ krótki wpis w AUDIT-JOURNAL.md dokumentujący odkrycie.
- **Numeracja WARN-N vs F-N:** WARN-N zarezerwowane dla flag odkrytych w toku klasycznego trybu audytowego (TRYB DZU, TRYB WARN-CLOSE). F-N dla flag strukturalnych odkrytych przy innych okazjach (audyty kompletności, sesje tematyczne). Oba typy są "otwartymi flagami" w rozumieniu tego rejestru — nie różnicuj ważności po prefiksie, tylko po kolumnie Priorytet.
