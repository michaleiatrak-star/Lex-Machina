# DR-05 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa zawiera tylko aktualny stan pokrycia wykorzystywany przez system. Historia audytów i dawnych braków nie jest częścią mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 B/B+ — pokrycie operacyjne, ale niepełne artykuł-po-artykule;
- 🔴 — brak realnej treści;
- ⚪ — zakres techniczny/przejściowy.

## KPA

**Baza operacyjna:** Dz.U. 2025 poz. 1691 t.j., stan prawny tekstu jednolitego 3.11.2025; przed użyciem konkretnej jednostki obowiązuje świeża kontrola ELI/ISAP.

| Zakres | Status bieżący | Główny nośnik |
|---|---|---|
| current-state indeks całego KPA | 🟢 B+ / COV | `mod-KPA-current-state-COV.md` |
| Dział I — zasady ogólne / właściwość / strony / terminy / doręczenia | 🟢 B+ / COV | indeks COV + `mod-KPA-postepowanie-administracyjne.md` |
| Dział II — wszczęcie / akta / dowody / mediacja / decyzje / środki | 🟢 B+ / COV | indeks COV + moduły KPA tematyczne |
| decyzje / postanowienia / odwołania | 🟢 B+ / COV | `mod-KPA-decyzja-i-odwolanie.md` |
| zawieszenie / dowody / rozprawa / mechanizmy w toku | 🟢 B+ / COV | `mod-KPA-mechanizmy-w-toku-sprawy.md` |
| tryby nadzwyczajne / bezczynność / kary administracyjne | 🟢 B+ / COV | `mod-KPA-tryby-nadzwyczajne-i-strategia.md` |
| sprawy ubezpieczeń społecznych | 🟢/🟡 B+ | KPA + routing DR-04/KPC; nie każda kontrola prowadzi do WSA |
| udział prokuratora / skargi i wnioski / koszty | 🟢/🟡 B+ | indeks COV + właściwe moduły tematyczne |

## PPSA

**Baza operacyjna:** Dz.U. 2026 poz. 143 t.j.; fresh gate przed cytowaniem konkretnej jednostki.

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| przepisy ogólne / właściwość / skład | 🟡 B+ | `mod-PPSA-uzupelnienie-pokrycia-2026.md` |
| strony / uczestnicy / pełnomocnicy | 🟡 B+ | jw. |
| pisma / doręczenia / terminy | 🟡 B+ | jw. + moduły szczegółowe |
| skarga do WSA | 🟢 | moduły KPA/PPSA |
| sprzeciw od decyzji/postanowienia | 🟢 | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` |
| przywrócenie terminu | 🟢 | jw. |
| posiedzenia sądowe | 🟢 | `mod-PPSA-posiedzenia-sadowe-rozdzial-7.md` |
| mediacja / tryb uproszczony / zawieszenie | 🟡 B+ | `mod-PPSA-uzupelnienie-pokrycia-2026.md` |
| orzeczenia sądowe | 🟢 | `mod-PPSA-orzeczenia-sadowe-rozdzial-10.md` |
| prawomocność | 🟡 B+ | `mod-PPSA-uzupelnienie-pokrycia-2026.md` |
| skarga kasacyjna | 🟢 | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` |
| zażalenie | 🟡 B+ | `mod-PPSA-uzupelnienie-pokrycia-2026.md` |
| koszty / wpis / prawo pomocy | 🟢 | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` |
| uchwały NSA | 🟡 B+ | `mod-PPSA-uzupelnienie-pokrycia-2026.md` |
| wznowienie | 🟢 | `mod-PPSA-terminy-kasacja-prawo-pomocy.md` |
| skarga o stwierdzenie niezgodności z prawem | 🟡 B+ | `mod-PPSA-uzupelnienie-pokrycia-2026.md` |
| wykonywanie orzeczeń | 🟡 B+ | jw. |

## RPO / RPD

| Akt / zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| Rzecznik Praw Obywatelskich — Dz.U. 2024 poz. 1264 | 🟢 B+ / COV | `mod-ustawa-RPO.md`; aktualny zakres kompetencji zmapowany w ELI |
| Rzecznik Praw Dziecka — Dz.U. 2023 poz. 292 | 🟢 B+ / COV | `mod-ustawa-RPD.md`; aktualny zakres kompetencji zmapowany w ELI |

## Cudzoziemcy / legalizacja

| Zakres | Status bieżący |
|---|---|
| ustawa o cudzoziemcach — tor administracyjny | 🟢/🟡; kanonicznie DR-05, `mod-ustawa-cudzoziemcy.md` |
| perspektywa prywatno-pracownicza | routing pomocniczy do DR-02 |

## Aktywne luki

1. KPA ma bieżący status B+/COV dla całej struktury, ale nie status `FULL` artykuł-po-artykule.
2. PPSA ma pełne pokrycie operacyjne wszystkich głównych działów, ale część pozostaje na poziomie B+ zamiast pełnego COV/FULL.
3. RPO i RPD mają bieżące mapy kompetencji B+/COV; konkretny środek procesowy zawsze wymaga dodatkowej kontroli właściwego kodeksu proceduralnego.
4. Każda jednostka prawna i termin wymagają świeżego odczytu ELI/ISAP przed użyciem.
