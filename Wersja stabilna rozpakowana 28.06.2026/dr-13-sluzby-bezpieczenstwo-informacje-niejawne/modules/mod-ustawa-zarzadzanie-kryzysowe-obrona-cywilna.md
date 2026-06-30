# mod-BH — Ochrona ludności i obrona cywilna

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
Status modułu: produkcyjny `.md skill`, stan kontrolny 2026-05-28. Źródła prawa: wyłącznie ISAP dla aktów krajowych oraz oficjalne źródła UE dla prawa UE.

## Kiedy używać

ochrona ludności, obrona cywilna, obowiązki JST, przedsiębiorców i podmiotów realizujących zadania publiczne, magazyny, plany, ćwiczenia, decyzje i finansowanie.

## Źródła i metryki kontrolne

| Akt | Metryka kontrolna |
|---|---|
| Ustawa o ochronie ludności i obronie cywilnej | Dz.U. 2024 poz. 1907 |
| Zmiana ustawy o ochronie ludności i obronie cywilnej (zm. 2025) | Dz.U. 2025 poz. 1705 |
| Zmiana ustawy o ochronie ludności i obronie cywilnej (zm. 2026) | Dz.U. 2026 poz. 646 |
| Program Ochrony Ludności i Obrony Cywilnej 2025–2026 | M.P. 2025 poz. 541 |
| KPA | Dz.U. 2025 poz. 1691 |

**Zakaz:** nie cytuj przepisów z tego modułu jako literalnego brzmienia. Ten plik wskazuje akty, tryb, ryzyka i workflow. Brzmienie przepisu pobierz z ISAP na dzień użycia.

## Moduły wspólne wymagane

Przed analizą użyj:

- `shared/ISAP-AUDIT-PROTOCOL.md`
- `shared/LEGAL-REGISTRY.md`
- `shared/LEGAL-LIFECYCLE-MANAGEMENT.md`
- `shared/TEMPORAL-LAW-CHECK.md`
- `shared/LEGAL-QUALITY-GATE.md`
- `shared/RISK-ASSESSMENT.md`
- `shared/FORMAL-CHECK.md` — jeżeli wynikiem ma być pismo.

## Workflow kancelaryjny

1. Ustal, czy obowiązek wynika z ustawy, programu, decyzji, umowy czy finansowania.
2. Sprawdź organ właściwy i charakter czynności: akt generalny/decyzja/czynność materialno-techniczna.
3. Oceń terminy wejścia w życie zmian 2026.
4. Zweryfikuj możliwość zaskarżenia albo wniesienia zastrzeżeń.

## Minimalne dane wejściowe

- organ / sąd / regulator,
- etap sprawy,
- data zdarzenia,
- data doręczenia,
- decyzja/pismo/wezwanie,
- żądanie strony,
- termin procesowy/materialny,
- dowody,
- informacja czy występuje pełnomocnik profesjonalny.

## Kontrola temporalna

Ustal osobno:

1. stan prawny w dacie zdarzenia,
2. stan prawny w dacie wszczęcia postępowania,
3. stan prawny w dacie pisma,
4. przepisy przejściowe,
5. wejście w życie nowelizacji po tekście jednolitym.

## Ryzyka

- nowe i niestabilne regulacje,
- akty wykonawcze i programowe zamiast klasycznej decyzji,
- finansowanie i obowiązki rzeczowe,
- trudność w kwalifikacji środka zaskarżenia.

## Wynik modułu

Zwróć:

- stan faktyczny,
- właściwy tryb,
- podstawy prawne po weryfikacji ISAP,
- terminy,
- dowody,
- ryzyka formalne,
- strategię,
- projekt pisma tylko po przejściu `LEGAL-QUALITY-GATE`.

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- organ;
- obowiązek publiczny;
- decyzja/zarządzenie;
- adresat obowiązku;
- tryb odwoławczy;
- skutki niewykonania;

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
- decyzje/zarządzenia;
- wezwania;
- plany ochrony;
- korespondencja z organem;
- dowody wykonania;
- opinie techniczne;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- nieustalenie podstawy kompetencyjnej;
- ryzyko natychmiastowej wykonalności;
- brak dokumentacji wykonania;
- kolizja z prawami majątkowymi;

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
