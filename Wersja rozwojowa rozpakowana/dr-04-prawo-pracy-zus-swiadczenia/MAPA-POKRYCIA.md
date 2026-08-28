# DR-04 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia zmian jest poza mapą runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 B/B+ — pokrycie operacyjne, niepełne artykuł-po-artykule;
- 🔴 — brak treści;
- ⚪ — zakres techniczny/przejściowy.

## Ustawa o systemie ubezpieczeń społecznych (SUS)

**Baza operacyjna:** Dz.U. 2026 poz. 199 t.j.; fresh gate przed cytowaniem jednostki.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| przepisy ogólne | 🟡 B | `mod-SUS-uzupelnienie-pokrycia-2026.md` |
| podleganie ubezpieczeniom społecznym | 🟢 | `mod-SUS-dzial-2-podleganie-ubezpieczeniom.md` |
| ustalanie składek | 🟡 B | `mod-SUS-uzupelnienie-pokrycia-2026.md` |
| zgłoszenia, konta, rozliczenia | 🟡 B | jw. |
| FUS / FRD jako fundusze | 🟡 B | jw. |
| organizacja i zadania ZUS | 🟡 B | jw. |
| obowiązki ubezpieczonych / odwołania | 🟢/🟡 B+ | `mod-SUS-ZUS-ubezpieczenia-spoleczne.md` + KPC w DR-02 |
| nienależne świadczenia / odsetki | 🟡 B | `mod-SUS-uzupelnienie-pokrycia-2026.md` |
| orzecznictwo dla celów świadczeń | 🟢/🟡 B+ | `mod-SUS-ZUS-ubezpieczenia-spoleczne.md` |
| kontrola ZUS | 🟡 B | `mod-SUS-uzupelnienie-pokrycia-2026.md` |
| odpowiedzialność wykroczeniowa | 🟡 B | jw. + routing DR-03 |

## Ustawa o emeryturach i rentach z FUS

**Baza operacyjna:** Dz.U. 2025 poz. 1749 t.j.; fresh gate przed cytowaniem jednostki.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| zakres / okresy / niezdolność / podstawa wymiaru | 🟡 B/B+ | moduł główny + `mod-FUS-uzupelnienie-pokrycia-2026.md` |
| emerytury — systemy i wysokość | 🟡 B | `mod-FUS-uzupelnienie-pokrycia-2026.md` |
| renta z tytułu niezdolności do pracy | 🟢 | moduł główny / aneks rentowy |
| renta rodzinna | 🟢 | `mod-FUS-zasilek-pogrzebowy-renta-rodzinna-waloryzacja.md` |
| dodatki do emerytur i rent | 🟢 | `mod-dodatek-pielegnacyjny-swiadczenie-rehabilitacyjne-wyrownawcze.md` |
| zasiłek pogrzebowy | 🟢 | `mod-FUS-zasilek-pogrzebowy-renta-rodzinna-waloryzacja.md` |
| świadczenia w szczególnym trybie | 🟡 B | `mod-FUS-uzupelnienie-pokrycia-2026.md` |
| waloryzacja | 🟢 | `mod-FUS-zasilek-pogrzebowy-renta-rodzinna-waloryzacja.md` |
| zbieg świadczeń / powstanie i ustanie prawa / zawieszanie | 🟡 B | `mod-FUS-uzupelnienie-pokrycia-2026.md` |
| postępowanie i wypłata | 🟢/🟡 B+ | moduł główny + KPC DR-02 |

## Prawo pracy i świadczenia

| Akt / temat | Status bieżący |
|---|---|
| Kodeks pracy — rdzeń stosunku pracy | 🟢/🟡; moduł `mod-KP-prawo-pracy.md` i moduły tematyczne |
| mobbing / dyskryminacja | 🟢 | `mod-KP-mobbing-dyskryminacja.md` |
| zwolnienia grupowe | 🟢/🟡 B+; dedykowany moduł i procedura art. 2–6 |
| ustawa zasiłkowa | 🟢/🟡 B+; Dz.U. 2026 poz. 854 t.j. |
| handel w niedziele | 🟢/🟡; bieżąca metryka w MAPA-AKTOW |
| „Za życiem” i świadczenia szczególne | 🟢/🟡; bieżące metryki w MAPA-AKTOW |

## Aktywne luki

1. SUS i FUS są szeroko zmapowane operacyjnie, ale bez statusu `FULL` dla całych ustaw.
2. Największy obszar pogłębiania to materialne reguły składkowe, szczegółowe warianty świadczeń i wyjątki.
3. Przed użyciem kwot, progów, terminów lub konkretnego artykułu obowiązuje świeża weryfikacja ELI/ISAP i właściwego obwieszczenia.
