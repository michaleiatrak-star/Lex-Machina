---
name: mod-AN-karne-gospodarcze-aml

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł prawa karnego gospodarczego, KKS i AML. Stosuj przy oszustwie gospodarczym,
  działaniu na szkodę spółki, przywłaszczeniu, fałszywych fakturach, praniu pieniędzy,
  odpowiedzialności zarządu, czynach karnoskarbowych, zawiadomieniu do prokuratury.
compatibility:
  tools: [web_search, web_fetch]
---

# mod-AN — Karne Gospodarcze / KKS / AML

## AKTY PRAWNE

| Akt | Zakres |
|---|---|
| Kodeks karny | oszustwo, przywłaszczenie, szkoda spółki, dokumenty |
| KKS | podatki, faktury, deklaracje, uszczuplenia |
| Ustawa AML | instytucje obowiązane, GIIF, procedury |
| KSH | obowiązki organów spółek |

## KWALIFIKATOR CZYNU

```
1. Czynność: co dokładnie zrobiono albo zaniechano?
2. Sprawca: kto miał obowiązek działania?
3. Pokrzywdzony: spółka, kontrahent, Skarb Państwa, wierzyciel?
4. Szkoda: kwota, utracone korzyści, uszczuplenie publicznoprawne.
5. Zamiar: dowody świadomości, korespondencja, ostrzeżenia, podpisy.
6. Dokumenty: faktury, umowy, uchwały, księgi, przelewy.
```

## WYJŚCIE

Nie przesądzaj winy. Wskaż najbardziej prawdopodobną kwalifikację, braki dowodowe, ryzyka zniesławienia i bezpieczny język zawiadomienia.

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- czyn zarzucany;
- rola osoby/podmiotu;
- obieg środków;
- compliance AML;
- zawiadomienia GIIF;
- ryzyko zabezpieczenia;

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
- dokumenty księgowe;
- korespondencja zarządu;
- procedury AML;
- analizy transakcji;
- zeznania;
- opinie biegłych;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- samoinkryminacja;
- zabezpieczenie majątkowe;
- brak kontroli nad dokumentami;
- równoległe postępowania podatkowe;

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
