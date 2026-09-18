# CHANGELOG — orzeczenia-sadowe-v2

**2.17 (2026-09-14) — retrieval/snapshot CBOSA jako materiał badawczy z jawnym provenance:**
- fallback V-SYG-0.5 nie jest już redukowany do samego ISTNIENIA, gdy host
  faktycznie zwraca oficjalny snapshot `/doc/{ID}`;
- obowiązkowe: POST-CHECK HOSTA → exact-match → content_scope;
- `site:` nie jest filtrem bezpieczeństwa;
- snapshot może dostarczyć metrykę, sentencję i uzasadnienie, ale pozostaje
  `CRAWLED_OR_INDEXED` i sam nie uzyskuje ✅ [VER];
- direct parser i jego testy 22/22 pozostają bez zmian.
**2.16 (2026-09-14) — integracja adaptera CBOSA z kanonicznym routingiem źródeł:**
- CBOSA powiązana z `shared/HIERARCHIA-ZRODEL.md` jako RZĄD 2A oraz z
  `SYGNATURY`, `DOSTEP-MASZYNOWY-API`, `PRAWO-HARDGATE-ORZECZENIA` i MCP fallback.
- Parser hardened fail-closed: krytyczny drift HTML, nieznany licznik, przerwany
  transport, Content-Length mismatch i błąd kandydata → OUT_OF_SCOPE.
- Dodano sesyjną kontrolę paginacji i wykrywanie zapętlenia/duplikatów.
- Brak opublikowanego uzasadnienia = FOUND dla metryki/sentencji z
  `reasoning_available=false`; nie wolno wtedy przypisywać tezy z uzasadnienia.
- Zestaw regresyjny rozszerzony do **22/22 PASS**.
- Reguła 7: pełny skill wydawany jako ZIP, nie sam diff.

> Pełna historia napraw i zmian wersji. Wyniesiona z SKILL.md 2026-07-12
> (runda 2 — redukcja kosztu kontekstu) — treść skopiowana 1:1, bez zmian.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy.

**2.15 (2026-09-14) — bezpośredni adapter HTML CBOSA + exact-match NSA/WSA:**
- Dodano `references/CBOSA-ADAPTER.md`: odtworzony kontrakt formularza
  `POST /cbo/search`, sesyjnej paginacji `GET /cbo/find?p=N` i pełnego
  dokumentu `GET /doc/{ID}`. Dostępność CBOSA jest od tej wersji mierzona
  świeżo w bieżącym runtime; historyczny pomiar 503 nie jest globalnym stanem.
  Przy niedostępności pozostaje kanoniczny fallback `shared/SYGNATURY.md`,
  V-SYG-0.5.
- Dodano własny, bez-zależnościowy parser `tools/cbosa_parser.py`. Wyciąga
  `/doc/{ID}`, sygnaturę, sąd, datę, sentencję i pełne uzasadnienie; filtruje
  CAŁY zbiór po znormalizowanym exact-match. Wynik: `FOUND` / `NOT_FOUND` /
  `AMBIGUOUS` / `OUT_OF_SCOPE`; „blisko pasujące” sygnatury są jawnie
  odrzucane i raportowane.
- Fail-closed rozszerzono na kompletność wyniku: niepełna paginacja, zmiana
  kontraktu HTML albo błąd odczytu któregokolwiek kandydata blokują negatywny
  wniosek i dają `OUT_OF_SCOPE`.
- Zakres `FOUND` z direct CBOSA podniesiono do `ISTNIENIE+TREŚĆ` po faktycznym
  odczycie `/doc/{ID}`; poziom `FRAGMENT` nadal wymaga pinpointu zgodnie z
  `shared/WERYFIKACJA-SLAD.md`.
- Dodano `tests/test_cbosa_parser.py`. Test lokalny: **6/6 PASS** — deduplikacja
  doc-id, pełna treść, FOUND + odrzucenie near-match, NOT_FOUND, AMBIGUOUS,
  OUT_OF_SCOPE przy wymaganej paginacji. W trakcie testu wykryto i naprawiono
  dwa realne tryby regresji parsera: kropki w skrócie repertorium
  (`f.s.k.` → `FSK`) oraz `<br>` jako element pusty, który nie może
  zwiększać głębokości parsera sekcji.
- Kontrolę struktury wykonano dodatkowo na publicznym fixture CBOSA
  `II FSK 2870/18` z projektu `matematicsolutions/mcp-nsa`: rzeczywisty
  dokument zawiera tytuł, Sąd, Datę orzeczenia, Sentencję i ponad 51 tys.
  znaków HTML uzasadnienia; fixture listy wyników zawiera realne linki
  `/doc/{ID}`. To kontrola struktury realnego HTML, nie własny test live
  sieciowy.
- ⛔ Ograniczenie pomiaru tej sesji: środowisko kontenerowe nie miało DNS do
  CBOSA, więc nie raportuje się fikcyjnego „live socket testu”. Kształt requestu
  został niezależnie potwierdzony przez publiczne implementacje
  `matematicsolutions/mcp-nsa` i `worldwidelaw/legal-sources`, a runtime
  skilla ma obowiązek wykonać fresh probe.
- **Reguła 7 OUTPUT-COMPLETENESS:** zmiana jest wydawana jako cały
  `orzeczenia-sadowe-v2` ze wszystkimi plikami i podfolderami oraz
  zaktualizowanym manifestem/checksumami, nie jako sam diff.
- Wykryto pre-existing drift: `SKILL.md` był już w wersji 2.14, podczas gdy
  lokalny CHANGELOG kończył się na 2.11 (a stopka wskazywała 2.6). Wersja 2.15
  przywraca poprawny bieżący wpis bez wymyślania nieudokumentowanej historii
  wersji 2.12–2.14.

**2.7 (2026-07-12, runda 2):** wyniesienie tej sekcji CHANGELOG (112 linii,
wersje 2.1–2.6) z SKILL.md do osobnego pliku referencyjnego — SKILL.md
skrócony z 940 do 836 linii bez utraty ani jednej informacji. Powód: SKILL.md
jest wczytywany w całości przy każdym wywołaniu tego skilla, a historia
napraw jest potrzebna wyłącznie przy audycie/debugowaniu regresji, nie w
normalnym toku wyszukiwania orzeczeń.

- 2.11 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-127**): NAPRAWA wstawki F-115 z sesji 08-23i — blok `SELF-CHECK ANTY-FASADA` był wstawiony W ŚRODEK ZDANIA akapitu AKTUALIZACJA 2026-07-15 — rozerwał frazę „— jako HARD GATE ⟨blok⟩ aktywny w całym systemie", przez co zdanie o nadrzędności PRAWO-HARDGATE było nieczytelne. Blok przeniesiony za zamknięty akapit; zdanie sklejone i przywrócone do pierwotnego brzmienia. Klasa błędu: REGUŁA 5 bloku HARDGATE-AUDYT (`audyt-systemu-v4/references/WARN-OTWARTE.md`) — wstawianie treści bez kontroli struktury docelowej. Kontrola po naprawie: parzystość znaczników ``` zachowana, spis nagłówków identyczny przed/po. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24.

- 2.10 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, bramka dodana — skill jej NIE MIAŁ mimo że cytuje orzeczenia najczęściej w systemie (P1). Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

## CHANGELOG

**2.9.1 (2026-07-17, naprawa YAML):** Usunięto z pola `description` w
`SKILL.md` wpisy changelog (v2.9/v2.7/v2.6/v2.5), które od wersji 2.7
(migracja CHANGELOG do tego pliku) błędnie pozostawały RÓWNIEŻ w opisie
wyzwalającym skilla, mimo że migracja miała je stamtąd usunąć — zamiast
tego kolejne wersje (2.9) dopisywały nowe wpisy w tym samym miejscu,
powtarzając błąd. Skutek: opis skilla (kluczowy dla trafności triggerowania
wg zasad skill-creator) był rozwadniany historią zmian zamiast zwięzłym
opisem funkcji. Poprawiono: `description` zawiera teraz wyłącznie
funkcjonalny opis + jedno zdanie odsyłające do tego pliku po pełną
historię. Żadna informacja nie została utracona — wszystkie 4 wpisy
(2.5, 2.6, 2.7, 2.9) już istniały w tym pliku przed naprawą. Zgłoszone
przez użytkownika jako "napraw yaml" po przesłaniu zip z poprzedniej tury.

**2.9 (2026-07-17):** Dodano Zasadę 5B — `otkzu.trybunal.gov.pl` (Zbiór
Urzędowy TK, oficjalne archiwum pełnych tekstów wyroków/postanowień) wpięty
jako źródło Tier 1, RÓWNOWAŻNE `trybunal.gov.pl/orzeczenia` (ten sam organ,
inny punkt dostępu do tej samej treści urzędowej — nie osobna instytucja).
Kontekst: użytkownik zapytał, czy baza orzeczeń TK jest wpięta jako źródło
do przeszukiwania; odpowiedź brzmiała "częściowo" — trybunal.gov.pl/orzeczenia
(wyszukiwarka) był już Tier 1 #4 od wcześniejszych wersji skilla, ale
otkzu.trybunal.gov.pl (archiwum pełnych tekstów, faktycznie użyte przy
weryfikacji orzeczeń wpiętych do DR-01 w tej samej sesji: P 31/02, K 8/98,
K 4/10, SK 37/19) nie był nigdzie osobno wymieniony. Dodano: wpis w opisie
skilla (nagłówek), Zasada 5 (rozszerzona), nowa Zasada 5B (pełny opis: kiedy
sięgać, format oznaczenia OTK ZU nr X/Rok poz. Y / OTK-A RRRR/N/poz., wzorzec
URL `downloadOTK?mpo=`), Zasada 7 (drzewo hierarchii Tier 1), Faza 1-T.4
(pełnotekstowe wyszukiwanie). Wzorowano na istniejącym wzorcu Zasady 5A
(sieć lokalna SA/SO/SR jako sub-źródło pod parasolem Tier 1 głównego portalu).

**2.6 (2026-07-06):**
- **Nowa Zasada 11 — PLAN MINIMUM: 5 orzeczeń wspierających + 5 linii
  przeciwnej (o ile istnieje), zawsze z przesłankami rozstrzygnięcia.**
  Wdrożone na wyraźne polecenie użytkownika, zgodnie z zaleceniem audytu:
  dotychczasowa Zasada 10 (BILANS) wymuszała UJAWNIENIE liczebnej przewagi
  linii przeciwnej, ale nie ustanawiała docelowej liczby orzeczeń do
  zaprezentowania ani obowiązku wskazania przesłanek/czynnika odróżniającego
  per orzeczenie — sama sygnatura + jednozdaniowa teza nie dawały pełnego
  obrazu, dlaczego sąd rozstrzygnął tak, a nie inaczej.
- Rozszerzono Fazę 1-D (Krok 2) o cel ilościowy: 5 orzeczeń linii przeciwnej,
  z instrukcją kontynuacji wyszukiwania (kolejne portale/frazy), jeśli po
  2 obowiązkowych zapytaniach jest ich mniej.
- Rozszerzono szablon Raportu końcowego (Faza 4) o sekcje [A]/[B] z listą do
  5+5 orzeczeń, przesłankami (2–4 zdania, parafraza, limit cytatu Zasada 3
  nadal obowiązuje) oraz — dla linii przeciwnej — obowiązkowym czynnikiem
  odróżniającym.
- Zaktualizowano sekwencję działania: nowy krok 9 „Zrealizuj PLAN MINIMUM"
  przed generowaniem raportu (poprzedni krok 9 → 10, poprzedni krok 10 → 11).
- Jakość ponad ilość: Zasada 11 wyraźnie zastrzega, że dopasowanie (Zasada 9)
  ma pierwszeństwo przed liczbą — zakaz „dopychania" do 5 orzeczeniem
  niedopasowanym lub o odwrotnym kierunku; gdy faktycznie istnieje mniej niż
  5, raport ma to wprost odnotować, nie ukrywać.
- **Poprawki z audytu audyt-systemu-v4 (2026-07-06, sesja WARN-DESC-ORZ):**
  description skrócone z 990/1020 (⚠️ WARN, blisko limitu 1024) do 835 znaków
  (✅ OK) — usunięto historyczny wpis v2.4 z description (pozostaje w
  CHANGELOG); `references/widget.md` uzupełniony o pole `.orz-przeslanki`
  (obie karty: Kat. 6A i zwykła) + styl CSS — bez tego widget nie odzwierciedlał
  nowego wymogu Zasady 11 (naruszenie ZASADY 7 OUTPUT-COMPLETENESS z
  audyt-systemu-v4 4.5, gdyby pozostało niescalone); zweryfikowano 2A (13/13
  ścieżek `view` istnieje na dysku), 2D-1 (0 zbędnych interlini), 2D-2 (0
  wstawek opisowych) — brak CRIT/WARN po naprawie.

**2.5 (2026-07-05d):**
- **Nowa Faza 1-K — orzecznictwo KIO / zamówienia publiczne.** Luka wykryta
  podczas oceny zewnętrznego repo `kio-orzeczenia-mcp`: portal `orzeczenia.
  uzp.gov.pl` (KIO + skargi SO/SA/SN) nie występował dotąd nigdzie w
  hierarchii portali tego skilla. Procedura wyszukiwania i cytowania
  zweryfikowana bezpośrednim fetchem (nie skopiowana z żadnego repo):
  `Home/Search?Phrase=...&Fle=...&SCnt=...`, strona szczegółów z pełnymi
  metadanymi (w tym otagowane pole "Sposób rozstrzygnięcia" — tańszy test
  GUARD INSTYTUCJA niż czytanie uzasadnienia), `Home/ContentHtml/{id}` /
  `Home/PdfContent/{id}` dla pełnej treści.
- **Korekta:** `kio.gov.pl` (używane w `dr-07/modules/mod-PZP-...-KIO.md`
  jako "wyszukiwarka wyroków") przekierowuje na strony informacyjne
  `uzp.gov.pl/kio`, NIE hostuje wyszukiwarki — poprawiono w obu miejscach.
- Zasada 5 i Zasada 7 (hierarchia Tier) rozszerzone o KIO/orzeczenia.uzp.gov.pl.
- Uczciwie odnotowano: rozbieżność endpointów względem `kio-orzeczenia-mcp`
  (ten POC deklaruje `/Home/HtmlContent/{id}`, żywy portal zwrócił
  `/Home/Details/{id}` + `/Home/ContentHtml/{id}`) — spójne z jego własnym
  zgłoszeniem 4/4 nieudanych testów live w CHANGELOG tamtego repo.

**2.4 (2026-07-05c) — SCALENIE dwóch rozgałęzionych dostaw 2.3:**
- Wykryto podczas przesłania pliku przez użytkownika: żywy system miał
  wersję 2.2 (bez Fazy 1-T i bez Zasady 2A) — obie poprzednie dostawy 2.3
  (ta niżej: Faza 1-T/SAOS-CBOSA; oraz równoległa: Zasada 2A/NSA I FZ 104/26)
  powstały NIEZALEŻNIE na tej samej bazie 2.2 i nigdy nie zostały scalone
  ani wdrożone — stąd kolizja numeru wersji 2.3 użytego dwukrotnie dla
  różnej treści.
- Ten plik = Faza 1-T (poniżej) + wstawiona Zasada 2A (w sekcji "Zasady
  fundamentalne", po Zasadzie 2) + zdanie łączące oba mechanizmy (gradient
  TREŚĆ stosuje się też do kandydatów z SAOS/CBOSA, nie tylko z web_search).
- Opis (`description`) przebudowany pod limit MOD-DESCRIPTION (864 znaki —
  status OK), skróceniu uległy szczegóły v2.1 (już nieaktualne priorytetowo).
- Od tej wersji: **każda przyszła zmiana wchodzi na TEN plik**, nie na
  równoległą kopię — zapobiega to powtórce tej kolizji.

**2.3 (2026-07-05):**
- **Naprawa CRIT (MOD-DESCRIPTION):** pierwsza wersja opisu v2.3 miała 1256 znaków
  (limit 1024) — skrócono do 888 znaków, zachowując triggery, wersję i kluczowe
  ograniczenia; szczegóły techniczne (parametry SAOS API, procedura CBOSA) przeniesione
  wyłącznie do treści skilla (Faza 1-T), zgodnie z procedurą naprawy MOD-DESCRIPTION.
- Dodano Fazę 1-T (wyszukiwanie pełnotekstowe po treści tezy) — na wyraźny wniosek
  użytkownika o zastąpienie pośredniego wyszukiwania (przez agregatory/web_search)
  bezpośrednim zapytaniem do źródeł indeksujących pełny tekst:
  - **SAOS REST API bezpośrednio** (`https://www.saos.org.pl/api/search/judgments`,
    parametr `all` do przeszukania treści/tezy/uzasadnienia + filtry
    `judgmentDateFrom/To`, `courtType`, `ccCourtType`, `ccCourtName`, `judgmentTypes`,
    `keywords`) — zweryfikowane wg oficjalnej dokumentacji API (CeON/saos,
    saos.org.pl/help).
  - **CBOSA (orzeczenia.nsa.gov.pl)** — udokumentowano, że NIE ma publicznego API
    (wniosek KIDP o jego udostępnienie pozostał bez odpowiedzi) i że dostęp do
    pola pełnotekstowego „Treść wyroku" jest wyłącznie przez formularz WWW
    (w odróżnieniu od pola „Powołane przepisy", które przeszukuje tylko słownik
    kontrolowany) — z zastrzeżeniem o blokadzie automatyzacji (captcha).
  - Procedura dwuetapowa dla obu źródeł: [1] zapytanie pełnotekstowe → kandydaci,
    [2] V-SYG + potwierdzenie w portalu Tier 1 dopiero przed cytowaniem (1-T.3) —
    SAOS/CBOSA jako etap wyszukania nie zwalnia z Zasady 1/5.
  - Zasada rozszerzona (1-T.4) na inne portale z polem pełnotekstowym (sn.pl,
    trybunal.gov.pl, część portali lokalnych SA/SO/SR).
  - Zaktualizowano „Strategię" w Fazie 1 i sekwencję działania (krok 5), by
    kierować do Fazy 1-T, gdy celem jest dopasowanie dosłownej tezy.

**2.2 (2026-07-01):**
- Rozszerzono bazę portali o sieć lokalną sądów apelacyjnych/okręgowych/rejonowych
  (Zasada 5A, Faza 1-L) — nowy plik `references/PORTALE-LOKALNE.md` ze wzorcem URL
  i listą portali głównych sądów.
- Doprecyzowano, że CBOSA (orzeczenia.nsa.gov.pl) obejmuje NSA oraz wszystkie 16 WSA
  jedną bazą (Zasada 7).
- Dodano Fazę 0-C (profil oczekiwanego rozstrzygnięcia) i Fazę 1-D (dopasowanie
  tezy + obowiązkowy test kierunku przeciwnego) — Zasada 9.
- Dodano ilościowy mechanizm BILANS LINII ORZECZNICZEJ z progami i alertem
  krytycznym 🔴 BILANS NIEKORZYSTNY przy przewadze lub równowadze linii
  przeciwnej — Zasada 10, Faza 2, Faza 4.
- Zaktualizowano tabelę obsługi błędów/fallback i sekwencję działania (10 kroków).
- `references/widget.md`: dodano mapowanie alertu BILANS oraz szablon bloku
  „Bilans linii orzeczniczej" w zakładce Raport.

**2.1:** uchwały 7 SN jako Kat. 6A z priorytetem; obsługa jurysdykcji zagranicznych
(Tier 4); fallback przy niedostępności narzędzi sieciowych; dziedzinowe progi
alertu STARE; szablon zakładki Alerty; integracja SYGNATURY.
