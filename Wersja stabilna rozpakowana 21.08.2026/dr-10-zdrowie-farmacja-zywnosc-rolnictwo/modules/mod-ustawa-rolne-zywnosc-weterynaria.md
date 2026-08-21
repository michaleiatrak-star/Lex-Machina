---
name: mod-AH-rolne-zywnosc-weterynaria

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł prawa rolnego, żywnościowego i weterynaryjnego. Stosuj przy ARiMR,
  dopłatach, kontrolach IJHARS/Sanepid/IW, produkcji żywności, HACCP, rolniczym
  handlu detalicznym, weterynarii, paszach, uboju, znakowaniu żywności.
compatibility:
  tools: [web_search, web_fetch]
---

# mod-AH — Prawo Rolne / Żywność / Weterynaria

**Data weryfikacji online:** 2026-07-15 (naprawa F-1 — konkretne numery Dz.U. dla IJHARS/ARiMR/WPR)
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl


## AKTY PRAWNE — WERYFIKUJ

| Akt | Zakres | Numer Dz.U. (VER 2026-07-15) |
|---|---|---|
| Prawo żywnościowe UE 178/2002 | bezpieczeństwo żywności | rozporządzenie UE, stosowane bezpośrednio |
| Rozp. 852/2004 | higiena żywności, HACCP | rozporządzenie UE, stosowane bezpośrednio |
| Rozp. 853/2004 | żywność pochodzenia zwierzęcego | rozporządzenie UE, stosowane bezpośrednio |
| Ustawa o bezpieczeństwie żywności i żywienia | sanepid, produkcja, obrót | Dz.U. 2023 poz. 1448 t.j. — ⚠️ TREŚĆ SZCZEGÓŁOWA w dedykowanym module `mod-ustawa-bezpieczenstwo-zywnosci.md`, nie duplikuj tutaj |
| Ustawa o jakości handlowej artykułów rolno-spożywczych | IJHARS | Dz.U. 2023 poz. 1980 t.j. (obwieszczenie 2.08.2023) |
| Ustawa o Agencji Restrukturyzacji i Modernizacji Rolnictwa (ARiMR) | struktura, zadania, finansowanie agencji | Dz.U. 2025 poz. 1363 t.j. (obwieszczenie 26.09.2025) |
| Ustawa o Planie Strategicznym dla Wspólnej Polityki Rolnej na lata 2023-2027 (WPR/PROW) | dopłaty bezpośrednie, płatności obszarowe, interwencje EFRG/EFRROW, kontrole, zwroty | Dz.U. 2024 poz. 1741 t.j. (obwieszczenie 7.11.2024), zmieniona Dz.U. 2025 poz. 321 |

⚠️ **KOREKTA F-1 (2026-07-15):** poprzednia wersja tabeli nie zawierała żadnych
numerów Dz.U. dla ARiMR i WPR/PROW, a numer "2024.1284" cytowany w
MAPA-AKTOW.md dla tego zbiorczego wiersza faktycznie odnosi się do USTAWY O
OCHRONIE ZDROWIA ZWIERZĄT, skatalogowanej i zweryfikowanej w osobnym module
`mod-ustawa-inspekcja-weterynaryjna.md` — nie do żadnego aktu rolno-żywnościowego
z tej tabeli. Ten moduł (mod-AH) pokrywa WYŁĄCZNIE: jakość handlowa (IJHARS),
ARiMR (struktura agencji) i WPR/PROW (dopłaty) — bezpieczeństwo żywności i
weterynaria mają własne, osobne moduły (patrz wiersz wyżej i SKILL.md).

## PROCEDURA

```
1. Ustal produkt: żywność, pasza, produkt rolny, produkt zwierzęcy.
2. Ustal rolę: producent, rolnik, RHD, przetwórca, dystrybutor, importer.
3. Ustal organ: Sanepid, IW, IJHARS, ARiMR, KOWR.
4. Ustal tryb: rejestracja, kontrola, decyzja, kara, cofnięcie płatności.
5. Ustal dowody: protokół kontroli, próbki, etykiety, dokumentacja HACCP, księgi.
```

## RHD / MAŁA PRODUKCJA

Sprawdzaj oddzielnie:
- limity ilościowe i terytorialne,
- obowiązek rejestracji,
- wymogi higieniczne,
- etykietowanie,
- dokumentację sprzedaży.

## WYJŚCIE

Zawsze wskaż organ właściwy, tryb, termin odwołania, dowody i realne ryzyko administracyjne.

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- produkt/gospodarstwo;
- organ inspekcji;
- wymóg jakości/sanitarny;
- decyzja;
- dopłaty;
- łańcuch dostaw;

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
- protokoły inspekcji;
- badania;
- etykiety;
- umowy dostaw;
- decyzje ARiMR/inspekcji;
- dokumentacja weterynaryjna;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- brak identyfikowalności;
- szybka wykonalność decyzji;
- ryzyko wycofania produktu;
- terminy odwołań;

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
