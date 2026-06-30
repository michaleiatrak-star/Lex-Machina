# Moduł [P] — RODO i Ochrona Danych Osobowych

**Zakres:** RODO (GDPR), UODO, naruszenia przetwarzania, skargi do UODO, prawo do bycia zapomnianym,
zgody marketingowe, monitoring pracowników, administrator vs. podmiot przetwarzający.

---

## ZASADY ABSOLUTNE

1. **UODO.GOV.PL** → organ nadzorczy w Polsce = Prezes UODO (nie sąd administracyjny w pierwszej kolejności).
2. **Skarga do UODO** → bezpłatna, nie wymaga pełnomocnika, termin ograniczony tylko przedawnieniem.
3. **Prawo do usunięcia danych ("bycia zapomnianym")** → art. 17 RODO — nie jest bezwzględne
   (wyjątki: interes publiczny, obowiązki prawne, roszczenia).
4. **Monitoring pracowników** → wymaga: podstawy prawnej + poinformowania pracownika + proporcjonalności.
5. **Zgoda marketingowa** → musi być dobrowolna, konkretna, świadoma i jednoznaczna (art. 7 RODO).
6. **Naruszenie ochrony danych** → administrator ma 72h na zgłoszenie do UODO (art. 33 RODO).

---

## KLUCZOWE AKTY PRAWNE — WERYFIKUJ W ISAP / EUR-LEX PRZED POWOŁANIEM

- Rozporządzenie RODO (UE) 2016/679 → eur-lex.europa.eu
- Ustawa o ochronie danych osobowych (UODO) → isap.sejm.gov.pl
- Kodeks pracy — monitoring (art. 22²–22³ KP) → isap.sejm.gov.pl

⚠️ RODO to rozporządzenie UE — tekst weryfikuj w EUR-LEX, nie tylko ISAP.

---

## INTAKE — PYTANIA WSTĘPNE

```
□ Kto jest administratorem danych (firma, organ, osoba)?
□ Jakie dane są przetwarzane i w jakim celu?
□ Co konkretnie naruszono? (brak zgody, bezprawne udostępnienie, odmowa usunięcia, wyciek)
□ Czy jest podmiot przetwarzający (procesor) — np. firma IT, call center?
□ Czy naruszenie dotyczy pracownika (monitoring) czy klienta/osoby trzeciej?
□ Jakiego efektu oczekuje klient? (usunięcie danych, odszkodowanie, decyzja UODO)
```

---

## ŚCIEŻKI DZIAŁANIA

```
A. Skarga do Prezesa UODO (uodo.gov.pl)
   → Bezpłatna, pisemna lub elektroniczna
   → Prezes UODO wydaje decyzję administracyjną
   → Od decyzji → skarga do WSA (nie SO!)

B. Pozew cywilny o odszkodowanie (art. 82 RODO)
   → Sąd powszechny (SO lub SR zależnie od WPS)
   → Niezależnie od postępowania przed UODO

C. Oba równocześnie (A + B)
   → Dozwolone — różne tryby, różne organy
```

---

## SZCZEGÓŁOWY FRAMEWORK

Dla pogłębionej analizy, INTAKE, map postępowań, kalkulatorów i predykcji → wczytaj
odpowiednie moduły wspólne (lazy loading — tylko właściwy do sprawy):

```
view /mnt/skills/user/shared/INTAKE-GAP.md
view /mnt/skills/user/shared/ROSZCZENIA.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
```

Dla BENCHMARKINGU orzeczniczego i predykcji wyniku wywołaj skill `orzeczenia-sadowe-v2`.

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Pozew o odszkodowanie RODO | `pisma-procesowe-v3` |
| Skarga do UODO | `pisma-proste-v2` |
| Naruszenie wizerunku + IP | `mod-O-wlasnosc-intelektualna.md` |
| Monitoring w miejscu pracy | `mod-A-prawo-pracy.md` |
| Analiza szans procesowych | `analiza-sadowa-v6` |
| Redakcja/audyt: polityka prywatności, RCP/RCO, PBI, upoważnienia, IOD, procedura naruszeń, archiwizacja/retencja, regulamin pracy/wynagradzania/ZFŚS | `analizator-umow-v1` → `mod-J21-rodo-archiwizacja-regulaminy.md` (J21) |
| Klauzule RODO/DPA w umowie z kontrahentem | `analizator-umow-v1` → `mod-shared-rodo.md` |

*⚠️ Moduł strategiczny — wszystkie przepisy i orzecznictwo wymagają weryfikacji online przed powołaniem.*

---

## AKTUALIZACJA ISAP / UODO — 2026-05-28

Sprawy administracyjne przed Prezesem UODO prowadź przez moduł:

```text
view /mnt/skills/user/dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-UODO-postepowanie-ochrona-danych.md
```

Nie mieszaj: skarga do UODO, skarga do WSA na decyzję UODO i powództwo cywilne o odszkodowanie z art. 82 RODO to trzy różne warstwy ochrony.
---

## AKTUALIZACJA ISAP / UODO — 2026-05-28

Sprawy administracyjne przed Prezesem UODO prowadź przez moduł:

```text
view /mnt/skills/user/dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-UODO-postepowanie-ochrona-danych.md
```

Nie mieszaj: skarga do UODO, skarga do WSA na decyzję UODO i powództwo cywilne o odszkodowanie z art. 82 RODO to trzy różne warstwy ochrony.
