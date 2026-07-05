---
name: mod-AO-prawo-medyczne-pacjent

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł prawa medycznego i praw pacjenta. Stosuj przy błędach medycznych,
  dokumentacji medycznej, zgodzie pacjenta, tajemnicy lekarskiej, RPP, NFZ,
  podmiotach leczniczych, odszkodowaniach i zadośćuczynieniach medycznych.
compatibility:
  tools: [web_search, web_fetch]
---

# mod-AO — Prawo Medyczne / Prawa Pacjenta / Błąd Medyczny

## AKTY PRAWNE

| Akt | Zakres |
|---|---|
| Ustawa o prawach pacjenta i RPP | prawa pacjenta, dokumentacja, RPP |
| Ustawa o działalności leczniczej | podmioty lecznicze |
| Kodeks cywilny | szkoda, zadośćuczynienie, odpowiedzialność |
| Kodeks karny | narażenie, uszczerbek, nieumyślne spowodowanie śmierci |

## ANALIZA BŁĘDU MEDYCZNEGO

```
□ Zdarzenie medyczne i data
□ Standard postępowania medycznego na ten dzień
□ Naruszenie standardu
□ Szkoda biologiczna/psychiczna/majątkowa
□ Związek przyczynowy
□ Dokumentacja medyczna i opinia biegłego
```

## PIERWSZE KROKI

1. Wniosek o pełną dokumentację medyczną.
2. Chronologia leczenia.
3. Identyfikacja punktu decydującego.
4. Konsultacja prywatna/opinia wstępna.
5. Wybór ścieżki: reklamacja, RPP, NFZ, komisja, sąd, prokuratura.

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- świadczenie;
- podmiot leczniczy;
- szkoda/zdarzenie;
- dokumentacja medyczna;
- RPP/NFZ/sąd;
- biegli;

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
- dokumentacja medyczna;
- zgody;
- opinie biegłych;
- korespondencja z placówką;
- decyzje RPP/NFZ;
- rachunki/szkoda;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- brak dokumentacji źródłowej;
- niewykazanie związku przyczynowego;
- przedawnienie;
- zbyt słaba opinia medyczna;

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
