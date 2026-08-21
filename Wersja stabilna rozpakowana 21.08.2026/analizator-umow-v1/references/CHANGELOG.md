# CHANGELOG — Analizator Umów v1

> ⛔ **WPISY ODTWORZONE 2026-08-20z3 (flaga F-102, test T12).** Poniższe pozycje
> nie istniały w żadnym changelogu — `version:` był podbijany bez wpisu przez
> 5 kolejnych sesji. Treść odtworzona z `audyt-systemu-v4/references/AUDIT-JOURNAL.md`,
> gdzie każde podbicie zostało odnotowane w sekcji Rejestracja wraz z opisem
> sesji. Wpisy są zatem WTÓRNE wobec dziennika — przy wątpliwości źródłem
> rozstrzygającym jest dziennik, nie ten plik. Nic nie zostało zmyślone:
> pozycje bez śladu w dzienniku oznaczono wprost jako lukę.

## v1.30 (2026-08-09h) — odtworzone

FAZA 3E: CRIT w `mod-shared-regulatory-horizon.md` — AI Act, Digital Omnibus
przesunął termin o ponad rok. Źródło: AUDIT-JOURNAL, wpis AUDYT-2026-08-09h.

## v1.29 (2026-08-09e) — odtworzone

FAZA 3E: CRIT w `mod-shared-esg.md` — CSDDD, przestarzały termin transpozycji
i zakres po pakiecie Omnibus I. Źródło: AUDYT-2026-08-09e.

## v1.28 (2026-08-09b) — odtworzone

Rozstrzygnięcie otwartej kwestii: podstawa prawna obowiązku przypomnienia
przed odnowieniem subskrypcji. Źródło: AUDYT-2026-08-09b.

## v1.27 (2026-08-09a) — odtworzone

FAZA 3E: CRIT w `mod-shared-abusive-clauses.md` — art. 17a upk przywołany
w całkowicie błędnym kontekście. Źródło: AUDYT-2026-08-09a.

## v1.26 (2026-08-08y) — odtworzone

Zamknięcie flagi F-19: odwołanie od decyzji PIP WSTRZYMUJE wykonanie
(zasada, nie wyjątek). Źródło: AUDYT-2026-08-08y.

## v1.25 (2026-08-02)

**Kontekst:** użytkownik dopytał wprost, czy reguły w `mod-shared-zlote-
reguly.md` zostały rzeczywiście zweryfikowane wobec opracowań eksperckich
online. Poprzednia weryfikacja (v1.22) opierała się na jednym źródle
(Adams MSCD) i jednym ogólnym wyszukiwaniu. Ten przebieg: 2 dodatkowe,
celowane wyszukiwania per reguła (osierocone załączniki/schedules, oraz
Weagree drafting principles).

**Znalezione i dodane:**
- Weagree, *Drafting Contracts* (weagree.com) — druga, niezależna od Adamsa,
  szeroko rozpoznawana w praktyce contract management baza wiedzy o
  redakcji kontraktów. Potwierdza Regułę 1 (definicje) i Regułę 2 (spójna
  terminologia) tymi samymi zjawiskami co u mnie, ale z dodatkowym testem
  dla Reguły 1: **sprawdzaj też odwrotność — termin zdefiniowany, ale
  nieużyty, to też błąd**, nie tylko wielka litera bez definicji. Dodane do
  treści Reguły 1, nie tylko do przypisu.
- Weagree „Numbers in contracts — 18 best practice rules" — niezależne
  potwierdzenie konwencji cyfra+słownie już obecnej w
  `style-format-generowania.md` S.1.

**Uczciwa korekta:** Reguła 4 („zakaz osieroconych załączników") — nazwa
tej reguły to moja synteza, nie cytat z żadnego źródła. Sama praktyka jest
potwierdzona (Adams, „Schedules and Exhibits as Part of a Contract";
Weagree, sekcja o schedules/annexes), ale odnotowane wprost w pliku, żeby
nie sugerować cytatu tam, gdzie jest parafraza.

**Nie znaleziono** — nadal brak jednego, kompletnego „złotych zasad"
dokumentu od pojedynczej uznanej firmy/instytucji obejmującego wszystkie
12 reguł naraz; potwierdzenie jest rozproszone (Adams + Weagree razem
pokrywają reguły 1, 2, 4, 6, 10–12; reguły 7–9 mają podstawę w polskim KC,
nie w źródłach common law, i nie szukano dla nich odrębnego potwierdzenia
zagranicznego, bo to inny reżim prawny).

## v1.24 (2026-08-02)

**Kontekst:** usunięcie identyfikatora konkretnej kancelarii („KTZR") z tego
skilla + zbadanie, czy uznane kancelarie publikują online porównywalne
„złote zasady" redakcji umów.

**Usunięto:** 4 wystąpienia „KTZR" (`mod-shared-zlote-reguly.md`,
`CHANGELOG.md` ×2, `SKILL.md`, `workflows/generator-umowy.md`) —
zastąpione neutralnymi sformułowaniami („wzorzec zewnętrzny", „uznane
wzorce branżowe") bez utraty treści merytorycznej reguł (same reguły,
zweryfikowane wcześniej wobec Adams MSCD, zostały bez zmian).

**Research — uznane kancelarie i „złote zasady" redakcji umów:**
Sprawdzono (a) frazę „golden rules of contract drafting" + duże kancelarie
(Allen & Overy/Clifford Chance/White & Case), (b) polskie kancelarie +
„złote zasady redakcji umów". Wynik: **żadna duża/rozpoznawalna kancelaria
(„magic circle" ani polski Big Law) nie publikuje kompletnego, numerowanego
dokumentu „złotych zasad" porównywalnego z tym, co ma ten skill.** To, co
istnieje publicznie: (1) pojedyncze wpisy blogowe prawników-praktyków
(LinkedIn, osobiste, nie firmowe stanowisko), (2) polskie kancelarie
lokalne/średnie z ogólnymi poradami SEO, bez usystematyzowanej listy reguł,
(3) jeden wąski, ale realnie użyteczny i firmowo podpisany fragment:
Trinity International LLP (rzeczywista kancelaria, private capital/M&A),
„Legalese: Golden rules for drafting indemnities" — dwie konkretne reguły
(obowiązek minimalizacji szkody trzeba wyłączyć wyraźnie; indemnity nie
obejmuje zaniedbania żądającego bez wyraźnego zapisu).

**Dodano:** oba testy z Trinity International LLP włączone do
`mod-shared-antywzorce-jezykowe.md` (wiersz indemnity, AJ.5) — z wyraźnym
zastrzeżeniem, że to reguły common law wymagające kwalifikacji przez art.
353¹/473 KC przed zastosowaniem w polskim reżimie, nie automatyczny import.

**Nie dodano nic więcej z tego researchu** — reszta trafień była zbyt ogólna
(„bądź jasny", „zacznij od precedensu") albo już pokryta w
`mod-shared-zlote-reguly.md`/`style-format-generowania.md`. Najsilniejszym
publicznie dostępnym, rzeczywiście autorytatywnym źródłem dla reguł
kardynalnych pozostaje Adams, *A Manual of Style for Contract Drafting*
(wyd. ABA) — już wykorzystane w v1.22, nie kancelaria, tylko podręcznik
uznawany w branży za standard i cytowany przez prawników z dużych kancelarii.

## v1.23 (2026-08-02)

**Kontekst:** dokończenie audytu z v1.22 — poprzedni przebieg nie objął
wszystkich plików konkurenta (przyznane wprost użytkownikowi). Ten przebieg
przeszedł przez pozostałe pliki: `references/normy-bezwzglednie.md`,
`antywzorce-jezykowe.md`, `essentialia-mapowanie.md`, `checklist-15.md`,
`kategorie-klauzul.md`, `legal-design.md`, `format-checklist.md`, całość
`references/baza-wiedzy/` (14 plików, przez INDEX + spot-checki), całość
`workflows/` (9 plików), `tools/legal-cite/` (mikroserwis Python) i
`examples/testowe-akta/`.

**Dodano (2 nowe moduły — realne luki, niezweryfikowane w v1.22):**
- `references/mod-shared-ius-cogens.md` — katalog konkretnych norm
  bezwzględnie obowiązujących w B2B (art. 473 § 2, 483 § 1, 484 § 2, 119 KC;
  16, 41 ust. 2 PrAut; ustawa o zatorach; art. 28 RODO), trigger
  mikroprzedsiębiorcy (art. 385⁵ KC) i pięciopunktowy test efektu
  kumulatywnego dla klauzul granicznych. `mod-shared-abusive-clauses.md`
  pokrywał wyłącznie abuzywność B2C (385¹–385³) — nic nie konsolidowało
  granic swobody umów w B2B, mimo że to główny przypadek użycia tego
  systemu (większość modułów J* to B2B). `mod-core-checklist.md` C.2 miał
  już generyczną hierarchię 4 poziomów naruszenia, ale bez konkretnego
  katalogu do poziomu 1 — ten moduł go dostarcza. Wpięty w Moduł C.
- `references/mod-shared-antywzorce-jezykowe.md` — skan **po brzmieniu**
  (frazy typu „dołoży starań", „wedle wyłącznego uznania", „wszelkie/
  jakiekolwiek", indemnity bez limitu), prostopadły do analizy po kategorii
  klauzuli (Moduł B). Grunt merytoryczny: Adams MSCD, rozdziały „Sources of
  Uncertain Meaning" i „Reasonable Efforts and Its Variants" — potwierdzone
  jako realny rozdział podręcznika (nie sparafrazowane z konkurenta, tylko
  z tego samego źródła doktrynalnego). System miał wcześniej tylko
  pojedynczą wzmiankę o „niezwłocznie" w checkliście — bez systematycznego
  skanu. Wpięty w Moduł B.

**Sprawdzone i POTWIERDZONE jako już pokryte (bez działania):**
- `baza-wiedzy/01-04, 06-07, 11, 13-14` (maintenance art. 750 KC, cap/lucrum
  cessans/wina umyślna, siła wyższa/podwykonawcy, indemnifikacja, open
  source/copyleft, wizerunek, notice&action DSA, Polityka AI) — wszystkie
  potwierdzone grepem jako już obecne w `mod-J6-it-konsorcjum.md`,
  `mod-shared-fallback-library.md` FL.2, `generator/doktryna-uzupelnienie.md`
  D.1–D.4, `mod-shared-fm-hardship.md`.
- `workflows/konfiguracja-kancelarii.md` (`practice-profile.md` per
  kancelaria) — **świadomie nieprzenoszone**, i to już udokumentowana
  decyzja architektoniczna sprzed tego audytu (`rdzen-generowania.md` R4:
  „ten system nie zakłada jednej kancelarii z jednym plikiem profilu").
  Weryfikacja potwierdziła spójność z resztą systemu, nie odkryła nowej luki.
- `workflows/cold-start-klienta.md` (trwały profil klienta między sesjami)
  — ten sam powód co wyżej: system nie zakłada trwałości pliku między
  sesjami dla pojedynczego klienta/kancelarii. Brak działania.
- `workflows/ocena-2-strony.md`, `generator-umow.md`,
  `weryfikacja-spojnosci-odeslan.md` — odpowiedniki już istnieją
  (`ocena-drugiej-strony.md`, `generator-umowy.md`,
  `weryfikacja-spojnosci-odeslan.md` — ten ostatni nawet pod tą samą nazwą).
- `checklist-15.md` — funkcjonalny odpowiednik `mod-J0-routing.md` MASTER
  CHECKLISTA + `mod-shared-missing-clause.md`. Brak działania (uniknięcie
  duplikacji, Reguła 5 z `mod-shared-zlote-reguly.md`).
- `tools/legal-cite/` (mikroserwis Python pobierający dokładny tekst
  przepisu z api.sejm.gov.pl/EUR-Lex) — **rozważone i odrzucone z powodu
  niedopasowania architektury**, nie z powodu słabości pomysłu. Ten skill to
  zestaw plików markdown czytanych przez model, nie wdrożenie z własnym
  serwerem MCP; a nawet gdyby uruchomić skrypt przez bash_tool, środowisko
  wykonawcze tego audytu ma allowlistę sieciową bez `api.sejm.gov.pl` i
  `eur-lex.europa.eu` — próba użycia skończyłaby się cichym błędem sieci.
  Ten sam cel (dokładny tekst przepisu z oficjalnego źródła) realizuje już
  R1 HARD GATE przez `web_search`/`web_fetch`, które nie mają tego
  ograniczenia w normalnej sesji użytkownika.

## v1.22 (2026-08-02)

**Kontekst:** audyt porównawczy na podstawie realnych plików konkurenta
`commercial-legal-pl` (przesłane .zip, ~40 plików) + niezależna analiza
tekstowa proponująca 8 kategorii zmian. Każdą kategorię zweryfikowano wobec
(a) faktycznego stanu tego skilla (nie deklaracji), (b) źródeł eksperckich
(Adams, *A Manual of Style for Contract Drafting*), (c) ryzyka duplikacji
sprzecznej z własną zasadą DRY.

**Dodano:**
- `references/mod-shared-zlote-reguly.md` — **realna luka, nie kosmetyka.**
  `generator/boilerplate-strukturalne.md` cytował od dawna „Złota Reguła #4"
  i „Złota Reguła #11"/„SKILL.md Zasada nadrzędna #11" — plik z takimi
  regułami nigdy nie istniał (martwe odniesienie, potwierdzone grep). Nowy
  plik koduje 12 reguł kardynalnych (definicje/wielka litera, spójna
  terminologia, odesłania, zakaz osieroconych załączników, DRY, § 1 =
  Przedmiot) + regułę nadrzędną (interes klienta vs akceptowalność dla
  drugiej strony — już realizowaną filozoficznie przez FL.1 w
  `mod-shared-fallback-library.md`, teraz sformalizowaną jako zasada
  wiążąca cały generator). Numeracja dopasowana do istniejących martwych
  odniesień, żeby je naprawić bez przepisywania. Wpięto jako BRAMKA 0 w
  `rdzen-generowania.md` i jako obowiązkowy punkt w `popraw-fragment.md`
  (edycja fragmentu = najczęstsze miejsce naruszenia reguł 2/3/5).
- `generator/boilerplate-strukturalne.md` § B.7 — warianty bazowe
  wynagrodzenia (ryczałt, T&M, abonament/SaaS, waloryzacja GUS, kamienie
  milowe). Realna luka: fallback-library ma playbook dla klauzul **spornych
  negocjacyjnie**, ale nie dla mechaniki rozliczeń jako essentialium. Treść
  napisana od zera (generyczne wzorce, nie kopiowane z żadnego źródła).

**Świadomie ODRZUCONO (zweryfikowano jako już zaimplementowane lub
niekorzystne):**
- *Pełna baza klauzul 01–19/21 wzorowana na strukturze konkurenta* — w
  większości już pokryta: klauzule strukturalne (strony, preambuła,
  definicje, końcowe, cesja, zwrot materiałów) już w
  `boilerplate-strukturalne.md`; klauzule sporne negocjacyjnie
  (odpowiedzialność, kary, wypowiedzenie, poufność, FM, zakaz konkurencji)
  już w `mod-shared-fallback-library.md`/`mod-shared-alt-drafts.md`,
  zorganizowane wg zagadnienia prawnego zamiast numeru paragrafu — to inny,
  ale nie gorszy, sposób dostępu przy analizie (analiza zaczyna się od
  problemu, nie od numeru sekcji wzorca). Realna przewaga konkurenta to
  **rzeczywiste klauzule z konkretnych umów jednej, konkretnej kancelarii**
  — tego nie da się uczciwie odtworzyć bez dostępu do cudzych,
  prawdopodobnie zastrzeżonych dokumentów; kopiowanie ich treści byłoby też
  nieuczciwe wobec źródła. Zaadresowano tylko realną, niezależną od tego
  lukę: wynagrodzenie/terminy (B.7, powyżej).
- *Style-redakcyjny-umowy jako nowy plik* — już istnieje niemal 1:1 jako
  `generator/style-format-generowania.md` (S.1–S.4), z tym samym zakresem
  (bez łaciny, „W przypadku" vs „Jeżeli", kwoty cyfrą+słownie, cudzysłowy
  typograficzne). Brak działania.
- *Model umowy jako graf zależności* — już zaimplementowane w v1.21
  (`mod-shared-model-umowy.md` MU.2 graf zależności/konfliktów reżimów,
  MU.3 wykrywanie klauzul martwych/redundantnych). Zweryfikowano obecność
  sekcji grep — potwierdzone. Brak działania.
- *Ujednolicenie triage + progi wartościowe + bramki STOP* — już obecne:
  `triage-szybki.md` ma progi (>100 000 PLN → obowiązkowe F.1 z FAZA 0
  SKILL.md) i jawne przejście 🟡/🔴 → pełna analiza. Brak działania.
- *Krótkie karty essentialia (5–8 pkt) na górze każdego modułu J** — od-
  rzucono świadomie: `mod-J0-routing.md` ma już generyczną MASTER
  CHECKLISTĘ essentialia stosowaną niezależnie od typu umowy. Dodanie 21
  zduplikowanych mini-list w każdym J* naruszałoby własną Regułę 5 (DRY,
  „jedna regulacja — jedno miejsce") z nowo dodanego `mod-shared-zlote-
  reguly.md w dniu, w którym go dodano — sprzeczność, której nie da się
  uzasadnić.

**Metodologiczna uwaga:** dokument źródłowy z rekomendacjami częściowo
opisywał stan skilla sprzed v1.21 (np. rekomendacja „brak modelu umowy jako
grafu" — nieaktualna). Weryfikacja wobec faktycznego stanu plików, nie
wobec opisu, jest właśnie tym, o co poproszono; potwierdza to sens
trzymania audytów jako osobnego kroku przed wdrożeniem jakiejkolwiek
rekomendacji „bo tak robi konkurent".


Historia zmian i uzasadnienia metodologiczne. Nie wczytywać rutynowo —
wyłącznie do wglądu przy audycie lub pytaniu o pochodzenie metodologii.

## v1.21 (2026-08-02)

**Kontekst:** dwie niezależne analizy porównawcze (własna + zewnętrzna,
"Grok") zestawiające ten skill z komercyjnym narzędziem LegalTech, 12
proponowanych funkcji. Oceniono każdą pod kątem: (a) czy to realna luka,
czy duplikat czegoś już obsłużonego, (b) czy da się to zrobić uczciwie w
architekturze markdown+LLM, bez udawania pomiaru, którego system nie ma.

**Dodano (3 nowe moduły + 1 rozszerzenie):**
- `references/mod-shared-model-umowy.md` — **Kontrakt jako obiekt danych**
  (BRAMKA 0). Ekstrakcja umowy do jednej tabeli (strony/przedmiot/
  wynagrodzenie/terminy/odpowiedzialność/rozwiązanie/poufność/IP/RODO/
  zabezpieczenia) z odesłaniami do §, czytanej przez wszystkie moduły
  PRIMARY/DOMAIN zamiast ponownego skanu całego tekstu — adresuje
  *attention dilution* opisany już w `weryfikacja-spojnosci-odeslan.md`.
  Zawiera też: MU.2 formalny graf zależności klauzul i konfliktów reżimów
  prawnych (spina istniejące WYKLADNIA/RODO/AI-ACT/ORZECZ zamiast
  dublować), MU.3 wykrywanie klauzul martwych/redundantnych/wewnętrznie
  sprzecznych (uzupełnienie mod-shared-missing-clause.md, który wykrywa
  wyłącznie braki), MU.4 — zasada stała: zakaz wskaźników liczbowych typu
  "87% egzekwowalności" czy "8.7/10 ogólnie" (patrz niżej, "Odrzucono").
- `references/mod-shared-diff-intelligence.md` — **Contract Diff
  Intelligence**. Porównanie dwóch wersji umowy z analizą konsekwencji
  zmiany na poziomie pola tabeli MU.1, klasyfikacja DODANO/USUNIĘTO/
  ZMODYFIKOWANO/PRZENIESIONO, poziom istotności na tej samej skali
  🔴🟠🟡🟢 co reszta systemu. Realna, dotąd nieobsłużona luka — różni się
  od `workflows/popraw-fragment.md` (redakcja na żądanie, nie analiza
  różnicy dwóch już istniejących wersji).
- `references/mod-core-checklist.md § D.4` — **Risk Heatmap**. Wyłącznie
  warstwa prezentacyjna (wykres przez Visualizer) nad kategoriami ryzyka
  już wyliczonymi w B.1/D.2/MCD/RYZYKO. Zero nowej treści merytorycznej,
  zero ryzyka fabrykacji liczb.

**Świadomie ODRZUCONO (fałszywa precyzja / duplikaty):**
- *Contract Health Score* i *Clause Confidence* (wynik % / X.X/10) — model
  językowy nie ma skalibrowanego rozkładu prawdopodobieństwa; taka liczba
  wygląda na pomiar, a jest sformatowanym wrażeniem modelu. System już ma
  uczciwsze, jakościowe odpowiedniki (🔴🟠🟡🟢 dla ryzyka, BEZSPORNE/PEWNE/
  WYDEDUKOWANE/SPORNE dla pewności faktu w chronologia-sprawy-v1) —
  rozszerzone na klauzule i diff zamiast wprowadzania % obok nich.
  Zasada zapisana jako MU.4 (stała, nie jednorazowa decyzja).
- *Contract Timeline* jako osobny moduł — już `mod-shared-lifecycle.md`
  (LC.1). Nowość ograniczona do wizualizacji, nie nowej logiki.
- *Clause Library 2.0* (profil klauzuli: cel/kiedy/ryzyko/alternatywy/
  orzecznictwo/wpływ na negocjacje) — już rozproszone celowo (progressive
  disclosure) po `mod-shared-alt-drafts.md` / `mod-shared-orzecznictwo-
  umow.md` / `mod-shared-neg-strategia.md`. Scalenie w megaplik zwiększa
  zużycie kontekstu bez zysku merytorycznego — sprzeczne z zasadą lazy
  loading tego systemu.
- *Negotiation Simulator* (drzewo decyzyjne ofert) — już robi to
  `mod-shared-alt-drafts.md` + `mod-shared-neg-strategia.md`; formalizacja
  jako diagram to kwestia prezentacji, nie nowej wiedzy.
- *Precedensy "najczęściej kwestionowane przez sądy"* — już PLAN MINIMUM
  5+5 orzeczeń w `mod-shared-orzecznictwo-umow.md`; dodatkowa etykieta
  częstotliwości byłaby statystyką niemożliwą do zweryfikowania pojedynczym
  wyszukiwaniem — objęta tą samą zasadą MU.4 co Health Score.

## v1.20
KROK 0-ST podniesiony z rekomendacji do jawnego ⛔ HARD GATE (ST-GATE), na
wyraźne żądanie użytkownika. Wcześniejsza wersja (v1.19) opisywała ST-INIT/
ST-TRACK/ST-FINAL jako "obowiązkowe", ale bez formalnych warunków STOP
blokujących przejście — ryzyko, że model przeczyta zalecenie i mimo to
przejdzie dalej bez inicjalizacji/aktualizacji rejestru, tak jak zdarzyło
się to w pisma-procesowe-v3 przed wdrożeniem PRE-DELIVERY-COMPLETENESS-CHECK.
Naprawa: trzy jawne bramki blokujące — ST-GATE-INIT (blokuje ROUTING DO
MODUŁÓW dopóki rejestr AU-* nie istnieje), ST-GATE-TRACK (blokuje ciche
przejście AU-x→AU-(x+1) bez wpisu w rejestrze, wymusza natychmiastowy
raport przy ⚠️ POMINIĘTY), ST-GATE-FINAL (blokuje present_files dokumentu
lub wydanie raportu F, gdy gałąź FINALIZACJA ma pominięcia bez potwierdzenia
użytkownika a/b).

## v1.19
KROK 0-ST — integracja STEP-TRACKER (shared/MOD-STEP-TRACKER.md), analogicznie
do pisma-procesowe-v3 i analizator-dowodow-v3. Wzorzec systemowy: skill
definiował 13+ etapów obowiązkowych (FAZA 0 → POV-B/C → routing → Moduł
A/B/C/D/F w trybie ANALIZA, lub GENCORE/GENBUILD/GENSHARED w trybie
REDAKCJA/DRAFT/UZUPEŁNIENIE → HYBRID-VALIDATION → STRIP-VER-GATE →
POST-VALIDATION → DISCLAIMER), ale bez mechanizmu wymuszającego informowanie
użytkownika o pominięciu etapu. Dodano rejestr AU-* (17 pozycji) w shared,
inicjalizację ST-INIT zaraz po HARD GATE GLOBALNY, ST-TRACK po każdym etapie
oraz ST-FINAL blokujący present_files dokumentu/raportu, gdy pominięto etap
finalizacji (HYBRID/STRIP/POST/DISC) bez potwierdzenia użytkownika.

## v1.18
Kwantyfikacja ryzyka wg PERT/decision-tree analysis (Marc Victor, Marjorie
Corman Aaron) zamiast ad-hoc heurystyki. Klauzule FM/hardship zakotwiczone
w ICC Force Majeure/Hardship Clause 2020 i UNIDROIT Principles art.
7.1.7/6.2.1-6.2.3. Strategia negocjacyjna uzupełniona o ZOPA i principled
negotiation (Fisher/Ury/Patton, Harvard Negotiation Project) — wszystkie
zweryfikowane w literaturze eksperckiej przed wdrożeniem.

## v1.16–1.17
Narzędzia poziomu branżowego: taksonomia klauzul wg Adams MSCD, bank
klauzul strukturalnych/boilerplate, doktryna open source/copyleft,
wizerunek, notice&action DSA, Polityka AI, standard produkcyjny legal
design (WorldCC/Hagan/Haapio) dla eksportu .docx, workflow weryfikacji
spójności odesłań, triage szybki 🟢/🟡/🔴, ocena adwersarialna z
perspektywy drugiej strony (6 kategorii ataków), ustandaryzowany workflow
poprawy pojedynczego fragmentu.

## v1.15
Rozszerzenie o GENEROWANIE OD ZERA umów i dokumentów korporacyjnych/HR/RODO:
- workflows/generator-umowy.md
- workflows/generator-regulaminu.md (usługi elektroniczne/e-commerce/SaaS)
- workflows/generator-dokumentow-korporacyjnych.md (statuty, uchwały+protokoły,
  pełnomocnictwa/prokura)
- workflows/generator-dokumentow-hr-rodo.md (regulamin pracy, polityka
  prywatności/klauzula informacyjna, Polityka AI)
- workflows/weryfikacja-spojnosci-odeslan.md
- workflows/triage-szybki.md
- workflows/ocena-drugiej-strony.md
- workflows/popraw-fragment.md
(patrz references/generator/ i workflows/)

## Mapa domenowa (J-routing)
J0 routing, J1 najem, J2 nieruchomości/UUDE, J3 dystrybucja, J4
finansowanie, J5 wykonawcze, J6 IT/SaaS/agile, J7 PZP/FIDIC, J8
konsumenckie B2C, J9 IP/prawa autorskie (art. 41-68 PrAut), J10
ubezpieczenia (OWU poza B2C), J20 founders'/spółka/statut/organy, J21
RODO/archiwizacja/regulaminy pracy-wynagradzania-ZFŚS, MA transakcje.

## Moduły współdzielone (SHARED)
NEG, ALT, WYKLADNIA, RYZYKO-KWANT, FM-HARDSHIP, RODO, LIFECYCLE, ESG,
AI-ACT, CORE-CHECKLIST, TRIAGE, SO, DA + systemowe shared/.
