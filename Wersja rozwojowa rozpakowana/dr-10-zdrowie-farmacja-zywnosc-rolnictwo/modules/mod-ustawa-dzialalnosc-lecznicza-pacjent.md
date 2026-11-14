---
name: mod-AO-prawo-medyczne-pacjent

**Standard jakości:** stosuj `prawo-polskie-v2/krajowe/shared/MODULE-STANDARD-POLISH-LAW.md` oraz `prawo-polskie-v2/krajowe/shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł prawa medycznego i praw pacjenta. Stosuj przy błędach medycznych,
  dokumentacji medycznej, zgodzie pacjenta, tajemnicy lekarskiej, RPP, NFZ,
  podmiotach leczniczych, odszkodowaniach i zadośćuczynieniach medycznych.
compatibility:
  tools: [web_search, web_fetch]
---

# mod-AO — Prawo Medyczne / Prawa Pacjenta / Błąd Medyczny

**Akt:** UDL (ustawa o działalności leczniczej) — t.j. Dz.U. 2026 poz. 156 (zm. po t.j.: 2026/972 od 2026-08-05 — art. 27a).
**Akt:** UPP (ustawa o prawach pacjenta i Rzeczniku Praw Pacjenta) — t.j. Dz.U. 2024 poz. 581 (zm. po t.j.: 2026/791 od 2026-07-01 — art. 7, 10, 14, 26, 30a, 30b, 35; 2026/26 [OD 2027-01-01: 2026/26] — art. 28).
**Akt:** USOZ (ustawa o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych) — t.j. Dz.U. 2025 poz. 1461 (zm. po t.j.: 2025/1537 od 2026-01-01 — art. 2, 4, 7, 7a, 19a, 20, 22, 23, 23b, 23c, 23e, 23h, 30, 31d, 40, 42d, 42f, 42i, 42j, 47c; 2025/1739 od 2026-01-01 — art. 97, 116, 132c, 132d; 2026/203 od 2026-03-05 — art. 12, 50, 87; 2026/791 od 2026-07-01 — art. 49, 50, 51, 188e, 240; 2026/972 od 2026-08-05 — art. 31lc, 31n, 31o; 2026/986 od 2026-08-07 — art. 42b, 159a, 189a, 189b; 2026/1007 od 2026-08-11 — art. 23e, 97, 102; 2026/26 [OD 2027-01-01: 2026/26] — art. 87a).
**Akt:** KC (Kodeks cywilny) — t.j. Dz.U. 2026 poz. 795.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1: terminy, progi i kwoty porównane z t.j.).

## AKTY PRAWNE

| Akt | Zakres |
|---|---|
| Ustawa o prawach pacjenta i RPP — t.j. `Dz.U. 2024 poz. 581` | prawa pacjenta, dokumentacja, RPP |
| Ustawa o działalności leczniczej — t.j. `Dz.U. 2026 poz. 156` | podmioty lecznicze |
| Kodeks cywilny — t.j. `Dz.U. 2026 poz. 795` | szkoda, zadośćuczynienie, odpowiedzialność |

✅ [VER] RZĄD 1 2026-09-16 — statusy trzech t.j. (ELI: obowiązujące). Numery dopisane po T5
(F-190): ROUTING-MAP wskazywał ten moduł, ale żaden moduł dr-10 nie cytował numeru t.j.
ustawy o działalności leczniczej. KROK 2C (nowelizacje po t.j.) — przy sprawie.
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
Walidacja formalna: prawo-polskie-v2/krajowe/shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
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
□ Czy użyto prawo-polskie-v2/krajowe/shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 8. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `prawo-polskie-v2/krajowe/shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `prawo-polskie-v2/krajowe/shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| analiza sądowa | `analiza-sadowa-v6` |
