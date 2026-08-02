# CHANGELOG — Analizator Umów v1

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
