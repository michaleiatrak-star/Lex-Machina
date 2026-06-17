# Moduł [BA] — Postępowanie przed UODO i ochrona danych osobowych

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/ISAP-AUDIT-PROTOCOL.md`;
- metryki aktów sprawdzaj w `shared/ISAP-METRYKI-AKTOW.md`;
- jeżeli sprawa jest procesowa, uruchom `shared/FORMAL-CHECK.md`, `shared/WARUNKI-SKUTECZNOSCI.md`, `shared/TERM-CALC.md`, `shared/RISK-ASSESSMENT.md`;
- nie mieszaj trybów: KPA, Ordynacja podatkowa, KAS, PPSA i egzekucja administracyjna mają odrębne rygory.
---

**Zakres:** skarga do Prezesa UODO, naruszenie ochrony danych, prawa osoby, administrator, procesor, monitoring, dostęp do danych, usunięcie danych, odszkodowanie z art. 82 RODO, kontrola i kara administracyjna.

## ZASADY ABSOLUTNE

1. Oddziel roszczenie administracyjne przed UODO od roszczenia cywilnego o odszkodowanie.
2. RODO jest bezpośrednio stosowane, ale postępowanie krajowe wymaga ustawy o ochronie danych osobowych i KPA w zakresie nieuregulowanym.
3. W skardze do UODO kluczowe są: administrator, dane, czynność przetwarzania, naruszone prawo, dowód żądania do administratora.
4. Kara dla administratora nie jest automatycznie odszkodowaniem dla osoby fizycznej.

## KLUCZOWE AKTY PRAWNE — ISAP / UE

| Akt | Metryka robocza |
|---|---|
| RODO | rozporządzenie UE 2016/679 — sprawdzić EUR-Lex przy cytowaniu |
| Ustawa o ochronie danych osobowych | tekst ujednolicony ISAP `D20181000Lj.pdf`; sprawdzić Dz.U. przed cytowaniem |
| KPA | Dz.U. 2025 poz. 1691 według rejestru ISAP |
| PPSA | Dz.U. 2026 poz. 143 według rejestru ISAP |

## WALIDACJA

```text
□ administrator danych
□ kategorie danych i osób
□ podstawa przetwarzania
□ żądanie do administratora i odpowiedź/brak odpowiedzi
□ naruszone prawo z RODO
□ szkoda i związek przyczynowy — jeśli roszczenie cywilne
□ termin i właściwy tryb skargi
```

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- administrator/podmiot przetwarzający;
- naruszone prawa;
- żądanie do administratora;
- skarga do UODO;
- terminy i dowody;
- równoległe roszczenia cywilne;

## 2. Mapa proceduralna

```text
Identyfikacja trybu i organu/sądu
  ↓
Kontrola terminu, doręczenia, właściwości i legitymacji
  ↓
Ustalenie faktów materialnych i proceduralnych
  ↓
Matryca dowodowa: fakt → dowód → ciężar dowodu → luka
  ↓
Dobór pisma/środka: wniosek / odwołanie / zażalenie / skarga / pozew / zawiadomienie
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: minimum, optimum, wariant eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb
□ właściwy organ albo sąd
□ termin liczony od prawidłowego zdarzenia
□ legitymacja strony
□ żądanie możliwe prawnie
□ fakty powiązane z podstawą prawną
□ dowody przypisane do każdej tezy
□ kontrola opłat, odpisów, pełnomocnictw i podpisu
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz na dzień orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- wnioski RODO;
- odpowiedzi administratora;
- logi/korespondencja;
- polityki prywatności;
- decyzja UODO;
- dowody szkody;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- brak wcześniejszego żądania;
- mieszanie skargi UODO z odszkodowaniem;
- niewykazanie naruszenia;
- brak związku przyczynowego;

## 6. Strategia procesowa

Zastosuj trzy warianty:

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje naruszenia proceduralne, wadliwość ustaleń, niewłaściwą wykładnię, naruszenie zasady proporcjonalności albo praw strony.

### Wariant eskalacyjny
Zakłada przejście do organu II instancji, WSA/NSA, sądu powszechnego, SN, TSUE, ETPC albo organu sektorowego — tylko gdy wynika to z trybu.

## 7. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy moduł działa praktycznie, a nie opisowo?
□ Czy wskazano decydujący element prawny?
□ Czy oddzielono fakty od interpretacji?
□ Czy podano ryzyka przeciwnika/organu?
□ Czy wskazano słabe punkty klienta?
□ Czy każdy przepis i Dz.U. ma kontrolę ISAP albo oznaczenie braku weryfikacji?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 8. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| analiza sądowa | `analiza-sadowa-v6` |
