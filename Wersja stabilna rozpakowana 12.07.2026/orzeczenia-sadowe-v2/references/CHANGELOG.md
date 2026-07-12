# CHANGELOG — orzeczenia-sadowe-v2

> Pełna historia napraw i zmian wersji. Wyniesiona z SKILL.md 2026-07-12
> (runda 2 — redukcja kosztu kontekstu) — treść skopiowana 1:1, bez zmian.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy.

**2.7 (2026-07-12, runda 2):** wyniesienie tej sekcji CHANGELOG (112 linii,
wersje 2.1–2.6) z SKILL.md do osobnego pliku referencyjnego — SKILL.md
skrócony z 940 do 836 linii bez utraty ani jednej informacji. Powód: SKILL.md
jest wczytywany w całości przy każdym wywołaniu tego skilla, a historia
napraw jest potrzebna wyłącznie przy audycie/debugowaniu regresji, nie w
normalnym toku wyszukiwania orzeczeń.

## CHANGELOG

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
