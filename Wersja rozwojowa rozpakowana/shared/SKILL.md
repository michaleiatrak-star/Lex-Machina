---
name: shared
version: "3.81"   # ⛔ CUDZYSŁÓW OBOWIĄZKOWY: niecytowane `3.17` YAML parsuje
                  # jako float 3.17, a 3.17 < 3.9 — porządek wersji odwraca się
                  # dla każdego narzędzia porównującego liczbowo. Wykryte
                  # testem T12 (check_wersje_changelog.py), 2026-08-20z.
type: library
entrypoint: SKILL.md
compatibility: "wszystkie skille prawne systemu"
description: "Kanoniczna biblioteka Lex Machina: hardgate, walidacja, definicje, terminy i moduły wspólne. Nie odpowiada użytkownikowi samodzielnie; zasoby wczytują inne skille."
dependencies:
  requires: []
  # `shared` z definicji powinien być warstwą bazową bez zależności
  # zwrotnych do skili nadrzędnych — patrz limitations poniżej dla
  # ODSTĘPSTWA znanego i zweryfikowanego ręcznie 2026-07-04.
  called_by:
    - wszystkie 31 pozostałych skille systemu (in-degree najwyższy w systemie)
inputs:
  - żadne bezpośrednie — pliki wczytywane (`view`) przez inne skille w
    trakcie ich własnych pipeline'ów
outputs:
  - treść modułu wczytana do kontekstu skilla wywołującego (nie generuje
    samodzielnego outputu)
confidence: n/a
  # moduły proceduralne (walidacja, hardgate, śledzenie kroków) — nie
  # zawierają samodzielnych twierdzeń merytorycznych podlegających ocenie
  # wiarygodności; PRAWO-HARDGATE.md wymusza weryfikację online dla treści
  # dodawanej PRZEZ skille wywołujące, nie przez shared samo
escalation:
  - plik kanoniczny nieznaleziony/uszkodzony → skill wywołujący MUSI
    zatrzymać się i zgłosić błąd, nie kontynuować z pamięci
limitations:
  - "ZNANE ODSTĘPSTWO od zasady 'shared = warstwa bazowa bez zależności
    zwrotnych', zweryfikowane ręcznie 2026-07-04 (FAZA 2E audyt-systemu-v4):
    5 plików zawiera instrukcję `view` wprost do konkretnego skilla
    nadrzędnego — MOD-METODY-BADAWCZE.md → analizator-dowodow-v3/SKILL.md;
    PRE-W2-VERIFICATION-GATE.md i MOD-IDENTYFIKACJA-STRONY-UMOWY.md →
    pisma-procesowe-v3/modules/MOD-PRACODAWCA-RZECZYWISTY.md;
    MOD-MAPA-PRZEPISOW.md → analizator-przepisow-v2/SKILL.md;
    ORZECZENIA-OUTPUT-SCHEMA.md → orzeczenia-sadowe-v2/SKILL.md;
    raport-sytuacyjny-integracja.md → raport-sytuacyjny-v2/SKILL.md.
    NIE scalone/wydzielone w tej sesji — pole `dependencies.requires`
    zostawione jako [] (zgodnie z zasadą architektoniczną), ODSTĘPSTWO
    opisane tu jawnie, żeby FAZA 2E w trybie deklarowanym go NIE zgubiła.
    Decyzja architektoniczna (uznać jako świadomy wzorzec 'plik-most' czy
    wydzielić poza shared/) pozostaje OTWARTA — do następnego audytu."
  - rozmiar (173 pliki, ~2,0 MB — stan 2026-09-14) — każda zmiana pliku kanonicznego ma
    potencjalnie systemowy promień rażenia; edytować tylko przez
    audyt-systemu-v4 z pełną weryfikacją CHECKLIST-DEDUP.md
required_modules: []
  # nie ma zastosowania — shared jest wczytywany, nie wczytuje sam siebie
changelog: |
  Wersja bieżąca: 3.81 (2026-09-23, AUDYT-2026-09-23c): HIERARCHIA-ZRODEL 1.11 i PRAWO-HARDGATE: E-3 uruchamia BRAK-AKTU (obowiązkowo), przy awarii ELI próba ISAP; ISAP-AUDIT-PROTOCOL analogicznie. DOSTEP-MASZYNOWY-API 1.9: §0…
  Pełna historia: references/CHANGELOG.md (ZASADA 15).
---

> **Universal runtime:** przed wykonaniem zastosuj kanoniczny `shared/UNIVERSAL-RUNTIME-ADAPTER.md` z osobnego skilla `shared`. Lokalna sekcja adaptera poniżej jedynie go doprecyzowuje.


## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

`shared` pozostaje JEDYNYM kanonicznym SSOT. Adapter nie zmienia treści modułów prawnych, tylko sposób rozumienia operacji technicznych.

1. `view shared/<plik>` oznacza świeży odczyt `<plik>` z rootu zainstalowanego skilla `shared`. Literalna ścieżka `/mnt/skills/user` nie jest wymagana. Obowiązkowego odczytu nie zastępuj pamięcią modelu.
2. Udokumentowane pliki-mosty mogą wskazywać inny osobny skill. `view <skill>/<plik>` oznacza świeży odczyt zasobu z tego skilla przez mechanizm hosta. Brak obowiązkowego zasobu = fail-closed; NIE kopiuj go do `shared`.
3. `web_search` / `web_fetch` oznaczają świeże wyszukanie lub odczyt źródła. Jeśli host ma inną nazwę narzędzia, użyj równoważnej funkcji. PRAWO-HARDGATE, hierarchia źródeł i statusy pozostają bez zmian.
4. `/mnt/user-data/...` oznacza rzeczywiste pliki użytkownika dostępne w hoście; wymagany ponowny odczyt jest faktycznym odczytem źródła.
5. `show_widget`, `present_files`, `create_file`, shell/Python i podobne operacje wykonuj równoważną natywną funkcją hosta, jeśli literalna nazwa nie istnieje. Nie pomijaj bramek jakości.
6. `tools/` to kod integracyjny portalu. `extract_api_verification_log.py` przyjmuje neutralne `events` i zachowuje zgodność z Claude legacy, generycznymi tool-call oraz Responses-style.
7. Ze względu na twardy limit 200 plików, 42 technicznych plików przykładowych serwerów MCP jest zachowanych bezstratnie w `tools/mcp-servers/mcp-servers-examples.zip` (SHA-256 `6b16d446e08ec5a3c401b371a7bf697e2b898bf2b903e2a1531a2ec818642756`). Gdy potrzebujesz kodu przykładowego serwera, rozpakuj ten plik; moduły promptowe nie zależą od jego rozwinięcia.

**Zasada nadrzędna:** jeśli istniejąca instrukcja jest zrozumiała i wykonalna w bieżącym hoście, wykonaj ją bez konwersji. Adapter działa tylko na granicy runtime.

# shared/ — Wspólne moduły systemu prawnych skilli

Katalog zawiera pliki kanoniczne współdzielone przez wszystkie skille prawne.
Nie jest samodzielnym skillem — pełni rolę biblioteki referencji.

## Zawartość katalogu

| Plik | Rola |
|------|------|
| `UNIVERSAL-RUNTIME-ADAPTER.md` | Wspólny kontrakt runtime ChatGPT/Claude/Codex: zasoby, narzędzia, prywatność, fallbacki |
| `TABELE-OPLAT.md` | ⛔ **RDZEŃ NAWIGACYJNY od 2.0 (2026-09-12q) — nie zawiera tabel.** Trzyma REGUŁĘ KOLEJNOŚCI (tabela ustanawiająca → baza katalogująca → RZĄD 2A/2B), **MAPĘ WŁASNOŚCI SEKCJI** i rejestry (sekcja 7 — tabele satelickie w innych skillach; sekcja 8 — zakres nieobjęty). Materia w 7 satelitach `oplaty/`. **Wczytać JAKO PIERWSZY**, przed jakąkolwiek kwotą — mapa wskaże właściwy satelita. Integralności podziału pilnuje T29 (`check_oplaty_mapa.py`). |
| `oplaty/01-KSCU-cywilne-rodzinne-pracownicze.md` | Sekcje 1, 1a, 1b, 1c. Progi WPS (art. 13), opłaty ogólne KSCU (art. 14–25b, 68–78), **rozwód 600 zł** (art. 26) i sprawy rodzinne (art. 27, 37, 38), prawo pracy i ubezpieczenia (art. 35, 36). ⛔ Pułapka dwóch brzmień art. 13 ust. 2: cap **100 000 zł** od 23.09.2025, nie 200 000 zł. |
| `oplaty/02-zwolnienia-zwrot-alimenty.md` | Sekcje 2, 2a, 2b, 2c, 2d, 2e. ⛔ **KROK 0 — czy strona w ogóle płaci**: art. 95, 96, 100–107. Alimenty. **Zwrot opłaty — art. 79** (m.in. połowa przy rozwodzie bez orzekania o winie). ⛔⛔ **art. 104a: w EPU i S24 NIE MA zwolnienia na wniosek.** Ryzyko kosztowe z KPC (art. 98–103, 520) — art. 102 KPC ≠ art. 102 KSCU. |
| `oplaty/03-koszty-zastepstwa-taksy.md` | Sekcje 3, 3a. Taksy adwokacka (`Dz.U. 2026 poz. 215`) i radcowska (`Dz.U. 2026 poz. 118`) — § 2, 3, 4, 9, 10, 11, 17; brzmienie porównane między aktami. |
| `oplaty/04-wartosci-powtarzalne-kotwice.md` | Sekcja 4 z 4a–4g. ⛔ **DOKTRYNA „formuła zamiast procentu"** — wartości zakotwiczonych w stopach NBP NIE WOLNO utrwalać jako procentu. Odsetki cywilne, handlowe, podatkowe i ZUS; stopy składek; skala PIT; **trzy kotwice** (stopy NBP, minimalne wynagrodzenie, przeciętne wynagrodzenie w sektorze przedsiębiorstw). |
| `oplaty/05-sprawy-karne.md` | Sekcje 5, 6e. Ustawa z 23.06.1973 (`Dz.U. 2023 poz. 123`) — ⛔ pułapka dwóch brzmień art. 2 ust. 1 pkt 6 (od 14.03.2023). Koszty procesu z KPK. ⛔ Zryczałtowana równowartość wydatków: **1000 zł od 1.07.2025** (kwota sprzed tej daty jest NIEAKTUALNA). |
| `oplaty/06-administracyjne-wieczystoksiegowe-KIO.md` | Sekcje 6, 6a. Wpis do WSA (`Dz.U. 2021 poz. 535`) — procent z podłogą, nie ryczałt. Postępowanie wieczystoksięgowe (art. 42–48 KSCU). Skarga na KIO (art. 34 — trzykrotność wpisu z PZP). |
| `oplaty/07-komornicze-skarbowe-notarialne.md` | Sekcje 6b, 6c, 6d. Koszty komornicze (`Dz.U. 2024 poz. 377`) — ⛔ art. 47: zwolnienie NIE zwalnia z opłaty egzekucyjnej. Opłata skarbowa (`Dz.U. 2025 poz. 1154`) — 17 zł od KAŻDEGO stosunku pełnomocnictwa. Taksa notarialna (`Dz.U. 2024 poz. 1566`) — stawki MAKSYMALNE, nie minimalne. |
| `PRAWO-HARDGATE.md` | ⛔ Globalny zakaz cytowania prawa/orzeczeń z pamięci — RDZEŃ, wczytaj przed każdym przepisem (zasada absolutna, PERMANENT GATE, hierarchia statusów, ŹRÓDŁO-0, KROK 2B/2C). Podzielony 2026-08-23h (F-111: 967 → 501 l.) i 2026-09-10b (F-180: 704 → 510 l., gałęzie warunkowe wydzielone niżej). |
| `PRAWO-HARDGATE-BLOKADA.md` | ⛔ Gałąź niedostępnego źródła RZĘDU 1 — BRAMKA ANTY-FASADOWA + KOTWICA URZĘDOWA. **Wyzwalacz:** B-1/B-2 zwrócił blokadę i kanał kodu też zawiódł. Bez tego odczytu znacznik 🟨 i ⚠️ jest nieważny. |
| `PRAWO-HARDGATE-AKT-MIEJSCOWY.md` | Ścieżka B-L. **Wyzwalacz:** przedmiotem sprawy jest akt prawa miejscowego. Aktów tych NIE MA w ELI Kancelarii Sejmu — weryfikacja tam zwraca fałszywy negatyw. |
| `DOSTEP-MASZYNOWY-API.md` | ⛔ **JAK** wywołać API/serwis, żeby odpowiedział — nagłówki (neutralny UA, `Accept`), ścieżki robocze zamiast rootów, limity tempa, konkretne endpointy ELI/SAOS/KRS/UODO/HUDOC/eZamówienia i ich wymogi (token CEIDG, `pageSize`≥10, anonimizacja odpisu KRS). Wczytaj, gdy weryfikacja idzie kanałem kodu, nie `web_fetch`. ⚠️ NIE rozstrzyga mocy źródła — to `HIERARCHIA-ZRODEL.md`. Dodane 2026-09-04c, F-159: instrukcje istniały wyłącznie w `audyt-systemu-v4`, którego żaden skill produkcyjny nie wczytuje |
| `PRAWO-HARDGATE-ORZECZENIA.md` | ⛔ ZAŁĄCZNIK orzeczniczy tej samej bramki — wczytaj ZAWSZE, gdy w tekście ma stanąć SYGNATURA (procedura przed orzeczeniem, WTÓRNE-ŹRÓDŁO-STOP, KROK 5A/5B, warstwy uzasadnienia [1]/[2]/[3], self-check orzeczniczy). NIE jest samodzielny — rdzeń obowiązuje równolegle (dodane 2026-08-23h, F-111) |
| `DOMAIN-LOCK.md` | ⛔ Bramka izolacji dziedzinowej — kontrola na WYJŚCIU, zakaz kwalifikacji spoza PRIMARY bez podstawy faktycznej (dodane 2026-08-23) |
| `RATE-COMPLETENESS.md` | ⛔ Bramka kompletności szeregu stawek — odsetki/waloryzacja jako funkcja czasu, nie pojedyncza liczba (dodane 2026-08-23) |
| `MOD-GENERATOR-AKTU.md` | Procedura budowy modułu aktu prawnego G-1…G-8 — od spisu treści aktu, nie od pytania (dodane 2026-08-23) |
| `HYBRID-VALIDATION.md` | Walidacja hybrydowa — auto-raport braków po piśmie (Fazy 1–3) |
| `INTAKE-GAP.md` | Zarządzanie brakami danych faktycznych (⬛ pola, tryby 1–3) |
| `POST-VALIDATION.md` | Walidacja spójności po wygenerowaniu gotowego pisma |
| `MOD-WALIDACJA_v2.md` | ⭐ Walidacja formalna i prawnicza pisma (bloki A–J) — **JEDYNE ŹRÓDŁO PRAWDY** |
| `FACT-SOURCE-LOCK.md` | Klasyfikacja faktów FSL-A/B/C — wywoływany przez MOD-WALIDACJA_v2 (Blok J) |
| `LEGAL-STATUS-LOCK.md` | Weryfikacja statusów aktów LSL-1..6 — wywoływany przez MOD-WALIDACJA_v2 (Blok J) |
| `terminy.md` | Tabela terminów zawitych i przedawnień (KPC, KPK, KPW, KPA, KP, PPSA) |
| `FAKTY_v2.md`                        | Weryfikacja zgodności faktycznej pisma ze źródłem (MOD-FAKTY) |
| `raport-sytuacyjny-integracja.md` | Sekwencja wywołania widgetu Raportu Sytuacyjnego v2 |
| `MOD-STEP-TRACKER.md` | ⛔ Śledzenie kroków i raportowanie pominięć — inicjowany w KROK 0-TRACKER routera; każde pominięcie = obowiązek poinformowania użytkownika + czekanie na decyzję |
| `MOD-REJESTR-POKRYCIA-JEDNOSTEK.md` | ⛔ Rejestr plikowy (RPK) pokrycia zbiorów ≥10 ponumerowanych jednostek (kazusy, dokumenty, świadkowie...) w sesji wieloturowej — inicjowany PRZED podziałem na partie, commit po KAŻDEJ partii, obowiązkowy odczyt po kompaktowaniu; zapobiega cichemu pominięciu pojedynczych jednostek |
| `MOD-OS-CZASU-PRZESLANEK.md` | ⛔ Bramka rozjazdu czasowego (OŚ-GATE) — wyzwalacz MECHANICZNY: ≥2 daty w stanie faktycznym. Siatka interwałów n(n−1)/2, punkty przełączenia, tablica CHWIL OCENY przesłanek i tablica cezur reżimowych. Zamyka wzorzec „przesłanka oceniona na datę zdarzenia zamiast na chwilę wskazaną przez prawo" (KAZUS 111). Blok wyjściowy widoczny w odpowiedzi; tablice NIE są źródłem prawa (dodane 2026-08-31, F-142) |
| `MOD-WYJATEK-GATE.md` | ⛔ Bramka wyjątków i przepisów szczególnych (WYJ-GATE) — wyzwalacz MECHANICZNY: każde powołanie jednostki redakcyjnej. Cztery policzalne zamiatania: S1 sąsiedztwo (art. X¹ to osobna jednostka), S2 krawędzie jednostki (klauzule „nie stosuje się"), S3 akty powiązane z ELI — lex specialis poza aktem, S4 przepisy przejściowe. Blok WYJ-GATE widoczny w odpowiedzi. Zamyka wzorzec „sprawdzono dokładnie to, o co model sam siebie zapytał" (KAZUS 111, art. 770¹ k.c.). Reguła brzmi „zamiataj zakres", nie „szukaj wyjątku" — warunek ocenny to tryb awarii F-113 (dodane 2026-08-31b jako MOD-UNIT-SWEEP, przemianowane i rozszerzone 2026-08-31d, F-144) |
| `MOD-CN-GATE.md` | ⛔ Bramka normy centralnej (CN-GATE) — wyzwalacz MECHANICZNY: każde rozstrzygnięcie, roszczenie, zarzut lub kwalifikacja. Wskazuje JEDNĄ jednostkę redakcyjną per oś sporu i sprawdza trzy zakresy: CN-1 czasowy, CN-2 podmiotowy, CN-3 przedmiotowy. Wykonuje się PRZED OŚ-GATE i WYJ-GATE. Wynik „NIE" jest BLOKUJĄCY; override wymaga normy wyższego rzędu zweryfikowanej w tej turze i jest ZAKAZANY w prawie karnym. Zamyka wzorzec „poprawnie odczytany przepis, który nie ma zastosowania" — groźniejszy od niezweryfikowanego, bo cała dalsza analiza wygląda na rzetelną. Wzorce opisane jako klasy strukturalne (nowelizacja o ograniczonym skutku podmiotowym, wyłączenie definicyjne in fine, przepisy-bliźniaki o różnym reżimie), bez przykładów powiązanych z konkretnymi kazusami testowymi (F-168). Dodane 2026-09-05, F-163 |
| `MOD-REM-GATE.md` | ⛔ Bramka środka naprawczego i pokrycia (REM-GATE) — wyzwalacz MECHANICZNY: oddanie analizy, raportu lub pisma; wykonuje się PRZED HYBRID-VALIDATION. REM-0 próba pobrania DWUKANAŁOWA przed nadaniem znacznika ⚠️ (curl ORAZ web_fetch — kanały mają różne listy domen), REM-1 zakaz sierocego oddalenia (alternatywa na tej samej głębokości albo lista sprawdzonych reżimów), REM-2 zakaz non liquet (⬛ → rozstrzygnięcie warunkowe z podstawą i środkiem), REM-3 znacznik źródła zmienia STATUS powołania, nigdy objętości i stanowczości argumentu, REM-4 budżet pokrycia PEŁNA/CIENKA/⬛. Nie nakazuje uwzględnienia roszczenia — oddalenie w całości jest prawidłowe, jeżeli przeszło REM-1. Wzorce awarii opisane strukturalnie, bez etykiet kazusów testowych (F-168). Dodane 2026-09-05, F-161; REM-0 dodany 2026-09-05b, F-164 |
| `MIEDZYNARODOWE-GATES.md` | ⛔ Bramki spraw międzynarodowych (MG-1, MG-2) — wywoływane przez UP-5 i DR-14. MG-1 zastępuje OŚ-GATE: cztery daty osobno dla każdego państwa, reżim nowelizacji o ograniczonym skutku podmiotowym, rozróżnienie Państwo-Strona / związanie aktem jednostronnym, zastrzeżenia, retroakcja (KWPT art. 28). MG-2 zastępuje WYJ-GATE: reguła bazowa KWPT art. 31–33 plus cztery zamiatania S1 definicje i sąsiedztwo, S2 krawędzie jednostki, S3 instrumenty powiązane, S4 nowelizacje. CN-GATE i REM-GATE NIE są podmieniane. Wzorce opisane strukturalnie, bez par akt+artykuł+rozstrzygnięcie odpowiadających kazusom testowym (F-168). Plik był wymagany fail-closed przez UP-5, ale NIE ISTNIAŁ — dodany 2026-09-05, F-162 |
| `HIERARCHIA-ZRODEL-MIEDZYNARODOWE.md` | Hierarchia rzędów i kanałów dostępu dla UP-5: RZĄD 1 publikator/depozytariusz (EUR-Lex CELEX, legal.un.org, treaties.un.org, HUDOC), 2A baza akademicka odtwarzająca tekst autentyczny, 2B dokument organu cytowany pośrednio, 3 komentarz — nigdy jako jedyna podstawa materialna. Zawiera ZMIERZONĄ tabelę kanałów: curl DZIAŁA dla eur-lex i legal.un.org (korekta fałszywego twierdzenia w UP-5, klasa błędu F-151), blokada dla unoosa/cites/icsid/uncitral. Rząd źródła NIE zmienia siły argumentu (REM-3). Dodane 2026-09-05, F-162 |
| `DEFINICJE-KLUCZOWE.md` | Router do 10 plików w `definicje/`: DEF-PODMIOTY-WLASNOSC, DEF-ODPOWIEDZIALNOSC-SZKODA, DEF-PRACA, DEF-PROCEDURA, DEF-BUDOWLANE-DROGOWE, DEF-PODATKOWE, DEF-CYWILNE-WYKLADNIA, DEF-ADMINISTRACYJNE, DEF-INTERES-WLASNY-WYLACZENIA, METODOLOGIA-ORKA2 |
| `MOD-DOKUMENT-GATES.md` | ⛔ Osiem bramek pracy na dokumentach (§1 DOCUMENT-SCAN-PROMPT, §2 FOUNDATION-VERIFICATION-GATE, §3 EXHAUSTIVE-EXTRACTION-GATE, §4 IMMEDIATE-LOGICAL-SCAN, §5 CROSS-DOCUMENT-CONSISTENCY-CHECK, §6 ENTITY-DISAMBIGUATION-TABLE, §7 EVIDENCE-THREAD-LINKING, §8 QUOTE-VERIFICATION-DEFAULT). Konsumenci: `przesluchanie-swiadkow-v2-min90` (PRE-W1a.5 DG-LOAD) i `analizator-dowodow-v3` (KROK 0d DG-LOAD). Utworzony 2026-08-20z przez wydzielenie z pierwszego z nich (F-100 A) — treść przeniesiona 1:1 |
| `mod-niewidomy-prawa-prawne.md` | Osoba niewidoma: prawa procesowe KPK/KPC, ulgi, stopnie niepełnosprawności, Konwencja ONZ o prawach osób niepełnosprawnych |

Pliki w `prawny-router-v3/references/` (nie w shared, ale powiązane):
| `pokrycie-dziedzinowe.md` | Pełna mapa dziedzin → modułów → powiązanych skilli (28 dziedzin) |

Wszystkie pliki są kanoniczne — nie istnieją stuby ani kopie w innych lokalizacjach.

## tools/ — narzędzia produkcyjne (kod, nie markdown)

`shared/tools/` zawiera skrypty uruchamiane przez portal poza sesją modelu
— nie wczytuj ich przez `view()`, to nie są moduły promptowe:

| Plik | Rola |
|------|------|
| `tools/walidator_cytowan.py` | Deterministyczna bramka: sprawdza, czy każde powołanie w gotowym piśmie ma odpowiadający log web_fetch. Pełny opis: `tools/README.md` |

## Jak korzystać

Każdy skill wczytuje pliki z tego katalogu bezpośrednio przez `view`:

```
view shared/MOD-STEP-TRACKER.md  ← KROK 0-TRACKER (przed wszystkim — ST-INIT)
view shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md  ← RPK-INIT (gdy zbiór ≥10 ponumerowanych jednostek, np. seria kazusów)
view shared/MOD-OS-CZASU-PRZESLANEK.md  ← OŚ-GATE (gdy w stanie faktycznym ≥2 daty)
view shared/MOD-WYJATEK-GATE.md  ← WYJ-GATE (gdy powołujesz jakikolwiek artykuł)
view shared/MOD-CN-GATE.md  ← CN-GATE (zawsze, PRZED OŚ-GATE i WYJ-GATE)
view shared/MOD-REM-GATE.md  ← REM-GATE (zawsze, przed oddaniem)
view shared/MIEDZYNARODOWE-GATES.md  ← MG-1/MG-2 (sprawa międzynarodowa, UP-5)
view shared/HIERARCHIA-ZRODEL-MIEDZYNARODOWE.md  ← źródła i kanały (UP-5)
view shared/PRAWO-HARDGATE.md  ← wymagane przed każdym przepisem
view shared/PRAWO-HARDGATE-ORZECZENIA.md  ← DODATKOWO, zawsze gdy pada SYGNATURA orzeczenia (F-111)
view shared/HYBRID-VALIDATION.md
view shared/INTAKE-GAP.md
view shared/POST-VALIDATION.md
view shared/terminy.md
view shared/FAKTY_v2.md
view shared/raport-sytuacyjny-integracja.md
```

Nie wczytuj wszystkich naraz — tylko te potrzebne dla danego kroku.

> **Uwaga:** `raport-sytuacyjny-integracja.md` jest wywoływany przez `prawny-router-v3`
> opisowo (punkty self-check [A]/[B]/[C]). Skille dziedzinowe nie wywołują go przez `view` —
> logika wyzwalania jest w routerze. `FAKTY_v2.md` jest wbudowany bezpośrednio w `pisma-procesowe-v3`
> i `pisma-proste-v2` (sekcje MOD-FAKTY / M-FAKTY) — wywołanie przez `view` możliwe gdy potrzebna
> jest pełna wersja modułu.

## Zasada utrzymania (v2.1 — 2026-06-04)

- `DEPENDENCY-GRAPH.md` — pełna mapa zależności: który skill wywołuje który moduł; aktualizuj przy każdej zmianie
- ⚠️ Katalog `archive/` NIE istnieje na dysku (zweryfikowano 2026-06-14) — wcześniejsze
  wzmianki o "43 plikach nieaktywnych" są nieaktualne.
- ⛔ **Oznaczanie in-situ przestało być polityką (2026-08-23, v3.19).** Wcześniej pliki
  wycofane zostawały na dysku z nagłówkiem „⛔ DEPRECATED" (tak leżał `AKTY-PRAWNE-MASTER.md`
  przez dwa i pół miesiąca). Wynik: plik bez roli, który mimo to trzeba było czytać przy
  każdym audycie, żeby stwierdzić, że nie ma roli. Od v3.19 plik wycofany jest **usuwany**,
  a uzasadnienie i data trafiają do `references/CHANGELOG.md` — historia zostaje, plik nie.

- Wszystkie pliki w tym katalogu są **kanoniczne** — jedyna kopia w systemie
- Stuby lokalne w katalogach poszczególnych skilli zostały usunięte
- Skille wywołują pliki bezpośrednio przez `view shared/X.md`
- Nie twórz lokalnych kopii ani stubów — aktualizuj tylko ten katalog

## Moduły kancelaryjne v3.0 — obowiązkowe moduły współdzielone

| Plik | Rola |
|------|------|
| `FORMAL-CHECK.md` | Centralna walidacja formalna pisma i decyzja: gotowe / uzupełnić / nie składać |
| `BRAKI-FORMALNE.md` | Klasyfikacja braków krytycznych, istotnych i technicznych |
| `WARUNKI-SKUTECZNOSCI.md` | Warunki procesowej skuteczności pozwu, apelacji, zażalenia, sprzeciwu, KPA itd. |
| `TRYBY-PROCESOWE.md` | Centralny rejestr trybów, etapów, rygorów i modułów do wczytania |
| `PREKLUZJA-DOWODOWA.md` | Kontrola spóźnionych twierdzeń i dowodów |
| `TERM-CALC.md` | Metodologia kontroli terminów; nie zastępuje kalendarza sądowego |
| `ZAZALENIE-ADRESAT-GATE.md` | Bramka: adresat zażalenia/odwołania/skargi (poziome vs dewolutywne, za pośrednictwem) — obowiązkowa przy każdym środku zaskarżenia (dodano 2026-07-25) |
| `WLASCIWOSC-GATE.md` | Bramka siostrzana: właściwość rzeczowa/miejscowa/funkcjonalna sądu/organu przy WNOSZENIU sprawy (pozew/wniosek) — obowiązkowa przy każdym piśmie inicjującym postępowanie (dodano 2026-07-27, na pytanie użytkownika) |
| `ZAWIADOMIENIA-KRZYZOWE.md` | Obowiązek instytucji (PIP, KAS, sąd) do zawiadamiania prokuratury/Policji o przestępstwie ujawnionym przy okazji własnego postępowania (art. 304 KPK) — kontrole krzyżowe między organami (dodano 2026-07-27, na pytanie użytkownika) |
| `RISK-ASSESSMENT.md` | Matryca ryzyka formalnego, dowodowego, prawnego i kosztowego |
| `ORZECZENIA-HIERARCHIA.md` | Hierarchia orzecznictwa, test aktualności i karta orzeczenia |
| `DOWODY-METODOLOGIA.md` | Matryca dowodowa i test wiarygodności dowodu |
| `ROSZCZENIA.md` | Konstrukcja roszczeń głównych, ewentualnych i alternatywnych |
| `STRATEGIA-PROCESOWA.md` | Taktyka procesowa i wybór następnego ruchu |
| `QUALITY-CHECK.md` | Kontrola jakości pisma: logika, struktura, nadmiar, emocjonalność |
| `KANCELARIA-WORKFLOW.md` | Sekwencja pracy kancelaryjnej możliwa w `.md skills` |
| `MOD-TIMING.md` | Strategia timing składania pism — macierz T1–T5, 6 modeli (T-EARLY…T-ADVANCE-NOTICE) |
| `MOD-PEER-REVIEW.md` | Weryfikacja krzyżowa pisma — 4 role (adwokat diabła, sędzia, klient, spójność) |
| `MOD-INTRO.md` | Executive summary pisma (str. 1) — 2–5 zdań, max 150 słów, killer argument na str. 1 |
| `MOD-KONCENTRACJA.md` | Metryka długości pisma per typ — limity orientacyjne, algorytm K1–K4, reguły skracania |
| `MOD-DOKTRYNA.md` | Polityka cytowania komentarzy i doktryny — hierarchia D-1–D-4, formaty, HARDGATEs |
| `MOD-WIDGET-IO.md` | ⭐ Obligatoryjny pasek Import/Export dla widgetów analitycznych — matryca per skill, wzorzec HTML/CSS/JS, reguły IO-1–IO-8 |
| `MOD-KARTA-DOWODU.md` | ⛔ Karta dowodowa i graf faktów — pisma-procesowe-v3 W1.2c-PRE (po SD-SKAN, przed macierzą MT1); analizator-dowodow-v3 BLOK-B2 |
| `MOD-ELIMINACJA-TEZ.md` | ⛔ Eliminacja tez, żądań i przepisów bez pokrycia prawnego — pisma-procesowe-v3 W1.2a-POST (po CLAIM-VALIDATION, przed W1.3); analizator-dowodow-v3 BLOK-C |
| `MOD-BUDOWA-ARGUMENTU.md` | ⛔ Obowiązkowy schemat budowy każdego argumentu — W2.2, każdy akapit uzasadnienia |
| `MOD-KOSZT-ODPOWIEDZI.md` | ⛔ Optymalizacja kosztu procesowego dla przeciwnika — W2.2 dla każdego głównego twierdzenia + W3.6a AUDYT-KOŃCOWY |
| `MOD-MIKROPODSUMOWANIA.md` | ⛔ Obowiązkowe podsumowanie każdego rozdziału uzasadnienia — W2.2, koniec każdej sekcji numerowanej |
| `MOD-SKUTEK-PROCESOWY.md` | ⛔ Obowiązkowy blok skutku procesowego — W2.2, koniec każdego bloku uzasadnienia klasy A/B |
| `MOD-STRESS-TEST.md` | ⛔ Symulacja odpowiedzi pełnomocnika pozwanego — po W2 (projekt pisma), przed W3 / AUDYT-KOŃCOWY |

### Obowiązkowe wywołania dla generatorów pism

Przy każdym piśmie gotowym do złożenia generator musi co najmniej wczytać:

```text
view shared/TRYBY-PROCESOWE.md
view shared/FORMAL-CHECK.md
view shared/BRAKI-FORMALNE.md
view shared/WARUNKI-SKUTECZNOSCI.md
view shared/RISK-ASSESSMENT.md
view shared/QUALITY-CHECK.md
```

Gdy występują terminy, dowody, orzecznictwo albo strategia, dodatkowo:

```text
view shared/TERM-CALC.md
view shared/PREKLUZJA-DOWODOWA.md
view shared/DOWODY-METODOLOGIA.md
view shared/ORZECZENIA-HIERARCHIA.md
view shared/ROSZCZENIA.md
view shared/STRATEGIA-PROCESOWA.md
```

Gdy pismo wymaga executive summary, metryki długości lub peer review:

```text
view shared/MOD-INTRO.md           (pozew/apelacja/pismo >3 str.)
view shared/MOD-KONCENTRACJA.md    (kontrola długości — zawsze)
view shared/MOD-PEER-REVIEW.md     (gdy WPS>50k / ≥3 żądania / apelacja)
view shared/MOD-DOKTRYNA.md        (gdy cytowanie komentarzy w W2)
view shared/MOD-TIMING.md          (gdy pytanie o timing złożenia)
```

Przed W1.3 (eliminacja tez bez pokrycia) i w trakcie W1.2c-PRE (karta dowodowa), obowiązkowo:

```text
view shared/MOD-ELIMINACJA-TEZ.md  (⛔ W1.2a-POST, po CLAIM-VALIDATION)
view shared/MOD-KARTA-DOWODU.md    (⛔ W1.2c-PRE, po SD-SKAN)
```

W W2.2 (redakcja każdego bloku uzasadnienia), obowiązkowo w tej kolejności:

```text
view shared/MOD-BUDOWA-ARGUMENTU.md    (⛔ każdy akapit uzasadnienia)
view shared/MOD-KOSZT-ODPOWIEDZI.md    (⛔ każde główne twierdzenie)
view shared/MOD-SKUTEK-PROCESOWY.md    (⛔ koniec bloku klasy A/B)
view shared/MOD-MIKROPODSUMOWANIA.md   (⛔ koniec każdego rozdziału)
```

Po W2 (projekt pisma gotowy), przed W3/AUDYT-KOŃCOWY, obowiązkowo:

```text
view shared/MOD-STRESS-TEST.md     (⛔ symulacja odpowiedzi pełnomocnika pozwanego)
```
