# CHANGELOG — Analizator Umów v1

Historia zmian i uzasadnienia metodologiczne. Nie wczytywać rutynowo —
wyłącznie do wglądu przy audycie lub pytaniu o pochodzenie metodologii.

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
