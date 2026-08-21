# MOD-WARIANTY-POZWU — warianty strategiczne pisma w W1

> Status: shared canonical. Osadzony w `pisma-procesowe-v3` WIADOMOŚĆ 1
> (W1), jako krok W1.2b — PO W1.2 (teza centralna) i W1.2a (CLAIM-VALIDATION),
> PRZED W1.3 (mapa cel→przesłanka→dowód).
>
> Zależności: `MOD-PRIORYTETY-ASPEKTOW.md` (filtr roszczeń głównych),
> `MOD-MAPA-PRZEPISOW.md` (kandydaci przepisów z głębokością/zgodnością —
> pole "Podstawa"/"Ryzyko" §2.2), `MOD-HISTORIA-STRATEGII.md` (zapis
> wariantów), `shared/MOD-REDAKCJA.md` (parametr TON — derywacja stylu §3).

---

## 1. Kiedy aktywować (warunek wejścia)

```
AKTYWACJA W1.2b następuje, gdy:
  ✓ Test C (pisma-procesowe-v3 KROK 0) zakwalifikował sprawę do modelu
    trzech wiadomości (NIE pisma-proste-v2), ORAZ
  ✓ co najmniej JEDNO z:
    - sprawa ma ≥2 aspekty_glowne z MOD-PRIORYTETY-ASPEKTOW (alternatywne
      podstawy roszczenia), LUB
    - ROUTING-MAP wykryła wieloznaczność strategii (np. spór o własność z
      roszczeniem alternatywnym z bezpodstawnego wzbogacenia — zgodnie z
      shared/CROSS-DOMAIN-CONFLICT-ROUTER.md), LUB
    - użytkownik explicite pyta o "warianty"/"opcje"/"strategie" pisma.

NIE AKTYWUJ, gdy:
  - jedno roszczenie, jedna podstawa prawna (sprawa prosta — analogicznie do
    Test B pisma-proste-v2),
  - MOD-PRIORYTETY-ASPEKTOW zwróciło aspekty_glowne.length <= 1 i nie wykryto
    sygnałów wieloznaczności.

W przypadku NIE AKTYWUJ — W1 kontynuuje normalnie do W1.3 bez tego kroku.
```

---

## 2. Generowanie wariantów

### 2.1 Liczba wariantów

```
2-4 warianty, zależnie od liczby aspektów_glowne i typu sprawy:
  - 1 aspekt_glowne + sygnał wieloznaczności proceduralnej → 2 warianty
    (np. "merytoryczny" vs "proceduralny — uchybienia strony przeciwnej")
  - ≥2 aspekty_glowne (alternatywne podstawy) → 1 wariant per aspekt + opcjonalnie
    wariant negocjacyjny = max 4
```

### 2.2 Karta wariantu (format)

Każdy wariant — 2-4 sentencje, struktura:

```
WARIANT [X]: [nazwa krótka]
  Podstawa:     [aspekt_id z MOD-PRIORYTETY-ASPEKTOW + ⚠️ przepis z
                 mapa_przepisow (MOD-MAPA-PRZEPISOW §6) o głębokość=
                 BEZPOŚREDNIE i zgodność=ZGODNA dla tego aspektu — jeśli
                 istnieje. Jeśli brak takiego kandydata, podstawa = ⚠️
                 najgłębszy dostępny kandydat + adnotacja "wymaga sprawdzenia
                 w W3/analizator-przepisow-v2"]
  Ryzyko:       [P1/P2/P3 — zgodnie z konwencją raport-sytuacyjny-v2
                 PROCESS-RISK-MAP. PODNIEŚ o jeden poziom (np. P2→P1), jeśli
                 WSZYSCY kandydaci z mapa_przepisow dla aspektu_glowne tego
                 wariantu mają zgodność=SPRZECZNA — sygnał, że podstawa
                 prawna wariantu wymaga weryfikacji lub dodatkowych dowodów]
  Koszt:        ⚠️ orientacyjny — weryfikacja KSCU w W3 (nigdy liczba z pamięci)
  Szansa:       [opis: "wysoka/umiarkowana/niska" na podstawie siły dowodowej
                 z analizator-dowodow-v3 — NIGDY % wymyślony; jeśli analizator
                 nie podał oceny, pisz "do oceny w W3 po weryfikacji orzecznictwa".
                 Skoreluj z mapa_przepisow: zgodność=ZGODNA + głębokość=
                 BEZPOŚREDNIE → nie niżej niż "umiarkowana"; zgodność=SPRZECZNA
                 dla wszystkich kandydatów → nie wyżej niż "niska", o ile
                 inne dowody (poza mapa_przepisow) nie wskazują inaczej]
  Styl pisma:   [derywacja — patrz §3]
  Argumenty poboczne: [lista aspektów_poboczne dodanych do tego wariantu —
                 wspólne dla wszystkich wariantów, patrz MOD-PRIORYTETY-ASPEKTOW §5]
  Wzmocnienia z analizy głębokiej: [jeśli metody_gleboka z MOD-PRIORYTETY-ASPEKTOW
                 zawiera wynik istotny dla tego wariantu (np. MET-ACH wskazało
                 najsłabszą hipotezę przeciwnika, MET-FA wykazało rozbieżność
                 kwot) — 1 zdanie referencji; w przeciwnym razie pomiń pole]
```

### 2.3 Typowe nazwy wariantów (katalog, nie zamknięty)

```
- "Roszczenie maksymalne + ryzyko kosztowe"
- "Roszczenie ostrożne + wysoka szansa uwzględnienia"
- "Wariant negocjacyjny z opcją ugody"
- "Wariant proceduralny — nacisk na uchybienia formalne strony przeciwnej"
- "Wariant alternatywny — podstawa [X] zamiast [Y]" (gdy ≥2 aspekty_glowne
  są podstawami alternatywnymi tego samego stanu faktycznego)
```

---

## 3. Derywacja stylu pisma — styl jako konsekwencja wariantu

> Cel: styl (MOD-REDAKCJA: stanowczy/neutralny/negocjacyjny/zwięzły) NIE jest
> osobnym pytaniem do użytkownika w W1. Jest polem `styl_sugerowany` karty
> wariantu, ustalanym automatycznie wg tabeli:

| Wariant (typ) | Styl sugerowany | Uzasadnienie |
|---|---|---|
| Negocjacyjny / opcja ugody | negocjacyjny | sprzeczność stylu i wariantu byłaby błędem strategicznym |
| Roszczenie maksymalne | stanowczy | konsekwentne z celem wariantu |
| Proceduralny — uchybienia strony przeciwnej | stanowczy | nacisk na błąd formalny wymaga jednoznaczności |
| Roszczenie ostrożne | neutralny lub zwięzły | zależnie od objętości materiału — zwięzły gdy materiał obszerny |
| Alternatywny (podstawa zamienna) | neutralny | otwiera pole na obie kwalifikacje prawne |

```
PO WYBORZE WARIANTU PRZEZ UŻYTKOWNIKA (checkpoint W1→W2):
  styl_sugerowany staje się parametrem TON dla W2/MOD-REDAKCJA — automatycznie,
  bez dodatkowego pytania.

UŻYTKOWNIK MOŻE NADPISAĆ:
  W checkpoint W1→W2 lub później przez MOD-REDAKCJA (Test A, pisma-procesowe-v3)
  — istniejąca ścieżka redakcji pozostaje dostępna bez zmian.
```

---

## 4. Wybór wariantu przez użytkownika

```
PREZENTACJA: karty wariantów (§2.2) jako tekst w W1 (NIE jako osobny widget —
  W1 jest tekstową ramą, zgodnie z istniejącą strukturą pisma-procesowe-v3).

PYTANIE:
  "Który wariant rozwijamy w W2? Możesz też poprosić o modyfikację wariantu
   przed wyborem."

PO WYBORZE:
  - wybrany wariant → kontynuacja W1.3 (mapa cel→przesłanka→dowód) TYLKO dla
    tego wariantu,
  - pozostałe warianty → zapis do historii strategii jako "odrzucone" z
    `powod_odrzucenia` (jeśli użytkownik podał powód — opcjonalnie; jeśli nie
    podał, pole pozostaje null, NIE wymuszaj uzasadnienia),
  - zapis całości (wszystkie warianty + wybór) wg MOD-HISTORIA-STRATEGII §2,
    PRZED przejściem do W1.3.
```

---

## 5. Integracja z checkpoint W1→W2

Istniejący checkpoint W1→W2 (pisma-procesowe-v3) rozszerzony o jedną linię:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ RAMA GOTOWA — [typ pisma] dla [strona] przeciwko [strona]
Teza: [jedno zdanie]
Wariant: [nazwa wybranego wariantu] | Styl: [styl_sugerowany]
Żądań: [n] | Przepisów do weryfikacji: [n] ⚠️ | Orzeczeń do weryfikacji: [n]
Braków krytycznych: [n] 🔴

Czy rama jest poprawna? Mogę przejść do redakcji pisma (W2)?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 6. Self-check przed W1.3

```
□ Czy warunek aktywacji §1 sprawdzony — jeśli NIE, ten krok pominięty
  (brak wpływu na resztę W1)?
□ Czy każdy wariant ma pole "Ryzyko" zgodne z PROCESS-RISK-MAP
  (raport-sytuacyjny-v2), nie wymyślone ad hoc?
□ Czy "Koszt" i "Szansa" nie zawierają liczb z pamięci — tylko ⚠️ lub opis
  jakościowy?
□ Czy styl_sugerowany przypisany wg tabeli §3, nie zapytany osobno?
□ Czy wynik (warianty + wybór) zapisany wg MOD-HISTORIA-STRATEGII PRZED W1.3?
□ Czy aspekty_poboczne z MOD-PRIORYTETY-ASPEKTOW dodane jako argumenty
  wspólne dla wszystkich wariantów (nie generują własnych wariantów)?
□ Czy pole "Podstawa" wykorzystuje kandydata z mapa_przepisow o głębokość=
  BEZPOŚREDNIE i zgodność=ZGODNA (jeśli istnieje), a "Ryzyko" podniesione
  gdy wszyscy kandydaci aspektu_glowne mają zgodność=SPRZECZNA
  (MOD-MAPA-PRZEPISOW §6)?
Którykolwiek = NIE → uzupełnij przed przejściem do W1.3.
```
