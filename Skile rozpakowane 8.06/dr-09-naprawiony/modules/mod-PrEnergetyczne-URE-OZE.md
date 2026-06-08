---
name: mod-AK-energetyczne-oze-ure

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł prawa energetycznego i OZE. Stosuj przy URE, koncesjach, taryfach, prosumentach,
  fotowoltaice, przyłączeniach, odmowie przyłączenia, reklamacji energii/gazu/ciepła,
  wspólnotach energetycznych, magazynach energii.
compatibility:
  tools: [web_search, web_fetch]
---

# mod-AK — Prawo Energetyczne / OZE / URE

## AKTY PRAWNE — WERYFIKUJ

| Akt | Zakres |
|---|---|
| Prawo energetyczne | koncesje, taryfy, przyłączenia, URE |
| Ustawa o OZE | prosumenci, aukcje, instalacje OZE |
| Instrukcje IRiESD/IRiESP | warunki sieciowe |
| KPA/PPSA | decyzje URE i skargi |

## ODMOWA PRZYŁĄCZENIA — ANALIZA

```
□ Czy złożono kompletny wniosek?
□ Czy operator wskazał techniczne lub ekonomiczne podstawy odmowy?
□ Czy odmowa zawiera uzasadnienie i pouczenie?
□ Czy możliwy jest spór do Prezesa URE?
□ Jakie dowody: warunki, korespondencja, mapa, moc, ekspertyza sieciowa.
```

## PROSUMENT / PV

Sprawdzaj: data zgłoszenia, system rozliczeń, moc instalacji, umowa kompleksowa, reklamacje faktur, błędy licznika, niedotrzymanie terminów.

## WYJŚCIE

Wskaż organ/tryb: reklamacja do sprzedawcy/operatora, spór do URE, sąd powszechny, WSA.

---

## AKTUALIZACJA ISAP / URE — 2026-05-28

Dla koncesji, taryf, przyłączeń, kar Prezesa URE i rynku energii wczytaj:

```text
view /mnt/skills/user/prawny-router-v3/references/modules/mod-AU-regulacyjne-uokik-ure-uke-knf.md
```

Metryka kontrolna Prawa energetycznego: Dz.U. 2026 poz. 43.

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- koncesja/rejestr;
- instalacja;
- taryfa/umowa;
- organ URE;
- przyłączenie;
- sankcja;

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
- koncesje;
- umowy przyłączeniowe;
- taryfy;
- pomiary;
- decyzje URE;
- ekspertyzy techniczne;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- ryzyko kar URE;
- brak dokumentacji pomiarowej;
- terminy przyłączeniowe;
- spory techniczne;

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
