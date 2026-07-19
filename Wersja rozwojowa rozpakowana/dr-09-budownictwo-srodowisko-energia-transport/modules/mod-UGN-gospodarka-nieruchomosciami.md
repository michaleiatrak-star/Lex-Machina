# Moduł [M] — Prawo Nieruchomości

**Zakres:** Zakup nieruchomości (due diligence KW, hipoteka), rękojmia przy
nieruchomościach, umowa deweloperska (ustawa 2021 ze zm.), mieszkaniowy rachunek
powierniczy (MRP), Deweloperski Fundusz Gwarancyjny (DFG), wspólnota mieszkaniowa
(uchwały, zarząd, fundusz remontowy), najem (ochrona lokatorów), zasiedzenie,
służebności.

**Weryfikacja:** 22.05.2026
**Akty w wersji obowiązującej — weryfikuj przed każdym powołaniem:**
- Ustawa deweloperska: **Dz.U.2024.695 t.j.** (zm. Dz.U.2025.758, Dz.U.2026.27)
- Ustawa o własności lokali: **Dz.U.2021.1048** — weryfikuj aktualną wersję w isap
- Ustawa o ochronie praw lokatorów: **Dz.U.2023.725** (zm. Dz.U.2025.413)
- KC (zasiedzenie, rękojmia, służebności): **Dz.U.2025.1071 t.j.**
- Ustawa o KW i hipotece: **Dz.U.2025.341**

---

## ZASADY ABSOLUTNE

1. **UMOWA DEWELOPERSKA = AKT NOTARIALNY** (art. 35 ust. 1 ustawy deweloperskiej
   Dz.U.2024.695). Brak aktu = nieważność bezwzględna.
   MRP (mieszkaniowy rachunek powierniczy) — obowiązek od 01.07.2022.
   Deweloperski Fundusz Gwarancyjny (DFG) — dodatkowe zabezpieczenie nabywcy.

2. **KSIĘGA WIECZYSTA — SPRAWDŹ ZAWSZE PRZED ZAKUPEM:**
   ekw.ms.gov.pl → Dział III (obciążenia, roszczenia, ograniczenia) · Dział IV (hipoteki).
   Rękojmia wiary publicznej KW chroni nabywcę działającego w dobrej wierze.

3. **EKSMISJA LOKATORA — ZAKAZ ZIMOWY (art. 16 ustawy o ochronie lokatorów):**
   Wyroki nakazujące opróżnienie lokalu NIE podlegają wykonaniu od 1 listopada
   do 31 marca roku następnego **włącznie**, jeżeli eksmitowanemu nie wskazano lokalu
   do przekwaterowania.
   **Wyjątki — zakaz NIE dotyczy:**
   - stosowania przemocy w rodzinie
   - rażącego lub uporczywego naruszania porządku domowego
   - zajęcia lokalu bez tytułu prawnego

4. **WSPÓLNOTA MIESZKANIOWA — UCHWAŁY (art. 23 ust. 2 uWŁ):**
   Zapadają większością głosów **liczoną udziałami** (nie głowami właścicieli).
   Zaskarżenie uchwały — **art. 25 ust. 1a uWŁ:**
   Termin **6 tygodni** od:
   - dnia podjęcia uchwały na zebraniu ogółu właścicieli, ALBO
   - dnia powiadomienia o treści uchwały podjętej w trybie indywidualnego zbierania głosów
   ⚠️ Termin zawity — nieprzywracalny. Po upływie uchwała wiąże.

5. **ODSTĄPIENIE OD UMOWY DEWELOPERSKIEJ — 12 PRZYPADKÓW (art. 43 ust. 1 ustawy):**
   Nie 5 przypadków, lecz **12** — w tym m.in.:
   - brak wymaganych elementów umowy (pkt 1)
   - niezgodność z prospektem informacyjnym (pkt 2)
   - brak lub niezgodny prospekt (pkt 3, 4, 5)
   - **nieprzenie­sienie praw w terminie** → nabywca wyznacza **120 dni** (pkt 6)
   - brak lub utrata MRP (pkt 7, 9)
   - brak zgody wierzyciela hipotecznego (pkt 8)
   - wada istotna nieusunięta przez dewelopera (pkt 10, 11)
   - żądanie syndyka wykonania umowy (pkt 12)
   Dla pkt 1–5: prawo odstąpienia w ciągu **30 dni** od zawarcia umowy.

---

## KLUCZOWE AKTY PRAWNE — AKTUALNE SYGNATURY

| Akt | Tekst jednolity | Uwagi |
|---|---|---|
| Ustawa deweloperska (2021) | Dz.U.2024.695 t.j. | Zm. Dz.U.2025.758 (jawność cen), Dz.U.2026.27 |
| Ustawa o własności lokali | Dz.U.2021.1048 | Weryfikuj w isap — brak nowszego t.j. potwierdzony |
| Ustawa o ochronie lokatorów | Dz.U.2023.725 | Zm. Dz.U.2025.413 |
| KC (rękojmia, zasiedzenie) | Dz.U.2025.1071 t.j. | Art. 172 (zasiedzenie), art. 568 (rękojmia) |
| Ustawa o KW i hipotece | Dz.U.2025.341 | Art. 5 (rękojmia wiary publ. KW) |

---

## SZCZEGÓŁOWY FRAMEWORK

Poszczególne zagadnienia obsługują istniejące moduły kanoniczne (lazy loading —
wczytaj wg potrzeby sprawy):

- due diligence nieruchomości (4 działy KW, EGIB, MPZP) — `mod-PrGeodezyjne-kartografia-wywlaszczenia.md`
  (ten skill) oraz `dr-08/modules/mod-MPZP-WZ-planowanie-przestrzenne.md`
- umowa deweloperska (12 przypadków odstąpienia, MRP, DFG, roszczenia nabywcy) —
  `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-ustawa-deweloperska.md`
- rękojmia (wady fizyczne i prawne — termin 5 lat od wydania/stwierdzenia wady),
  zasiedzenie (20/30 lat + ograniczenia dla nieruchomości rolnych — PEŁNE
  opracowanie: `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-
  rzeczy-znalezione-zasiedzenie.md`, dodane 2026-07-18), służebności —
  KC, sekcja powyżej w tym module + `shared/ROSZCZENIA.md`
- wspólnota mieszkaniowa (uchwały, zarząd, windykacja zaległości) i najem
  (umowa, wypowiedzenie, ochrona lokatora, eksmisja + wyjątki od zakazu zimowego) —
  `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-ustawa-spoldzielnie-wlasnosc-lokali.md`
  oraz KC (najem) w module powyżej

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Analiza umowy deweloperskiej / najmu / WM | `analizator-umow-v1` |
| Pozew / wniosek o eksmisję / zasiedzenie | `pisma-procesowe-v3` |
| Zaskarżenie uchwały WM (prosta) | `pisma-proste-v2` |
| Orzecznictwo SN o KW / nieruchomościach | `orzeczenia-sadowe-v2` |
| Nieruchomość w spadku | `mod-D-spadkowe.md` |
| Spółka deweloperska / upadłość dewelopera | `mod-L-gospodarcze.md` |
