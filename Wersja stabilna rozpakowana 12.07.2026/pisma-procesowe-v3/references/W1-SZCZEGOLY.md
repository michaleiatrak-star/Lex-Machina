# W1-SZCZEGOLY — Szczegóły kroków W1.3–W1.6

> Wydzielono z pisma-procesowe-v3/SKILL.md — redukcja NOTA-4 (>600 linii)
> Wywołanie: `view /mnt/skills/user/pisma-procesowe-v3/references/W1-SZCZEGOLY.md`
> Zawiera: W1.3 (mapa przesłanka→dowód + tabela), W1.4 (lista przepisów),
>   W1.4b (roszczenia narastające + tabela-petitum + podwójne żądanie ustalenia),
>   W1.5 (braki krytyczne), W1.6 (MOD-RED-TEAM-WLASNY), Checkpoint W1→W2.

---

### W1.3 — Mapa: cel → przesłanka → dowód → łańcuch

> TRYB AUTO-WYPEŁNIENIA: jeśli przed W1 wykonano KROK 3B.3 (analizator-dowodow-v3
> → MOD-SELEKCJA-DOWODOW), ta mapa jest WSTĘPNIE WYPEŁNIONA automatycznie —
> zatwierdź lub zmień konkretne pola (np. inny DOC-ID). Możesz też oznaczyć
> przesłankę jako "pomijam świadomie" (decyzja strategiczna). Puste pole
> "Dowód" = LUKA — patrz W1.5. Przepisy jako ⚠️ do weryfikacji w W3.
>
> TRYB RĘCZNY: jeśli KROK 3B.3 nie był wykonany (brak analizatora) — wypełnij
> mapę ręcznie jak dotychczas.
>
> ⛔ ŁAŃCUCHY PIERWSZE (W1.2c-PRE obowiązkowe gdy ≥2 dokumenty):
> Przed wypełnieniem mapy pobierz łańcuchy ŁD-XX z W1.2c-PRE
> (MOD-KARTA-DOWODU + MOD-LANCUCH-DOWODOWY).
> Pole "Dowód" = ogniwa łańcucha ŁD-XX i fakty F-nn z rejestru.
> Pole "Siła" = scoring ★-★★★★★ łańcucha (nie klasa pojedynczego dowodu).
> Generator pisma pyta "jakie FAKTY F-nn prowadzą do TEZY?" — nie "jakie pliki mam?"
>
> ⛔ BRAMKA D6 (OBOWIĄZKOWA gdy dostarczone tabele/XLS/zrzuty komunikatorów):
> Przed wypełnieniem mapy wykonaj D6.1–D6.5 z MOD-DOWODY:
>   D6.1 — ciągłość numeracji / wspólna kadra w arkuszach XLS
>   D6.2 — daty w tabelach zezwoleń / opłat po dacie spornej
>   D6.3 — tabelaryzacja korespondencji komunikatorami
>   D6.4 — spis zdawczo-odbiorczy akt jako dowód jednego archiwum
> Wynik D6 zasila przesłanki i dowody W1.3 bezpośrednio.
>
> ⛔ ANTYCYPACJA ZARZUTÓW (OBOWIĄZKOWA przy ≥2 ścieżkach lub ataku 🔴/🟠):
> Dla każdego przewidywanego zarzutu przeciwnika — dopisz sekcję antycypacji
> do uzasadnienia W2 (wzór: MOD-DOWODY D7). Antycypacja w piśmie głównym
> jest silniejsza procesowo niż obalenie w replice.

Dla każdego żądania:

```
┌─────────────────────────────────────────────────────────────────┐
│ ŻĄDANIE [nr]: [treść żądania]                                   │
├─────────────────────────────────────────────────────────────────┤
│ Przesłanka A: [co musimy udowodnić]                             │
│   Dowód:      [ogniwa łańcucha ŁD-XX / F-nn z rejestru]        │
│   Siła:       [★-★★★★★ łańcucha / A/B/C per dowód]            │
│   Lokalizator:[str. N / zakładka X / godz. HH:MM:SS]           │
│   Przepis:    [art. X §Y ustawa — zweryfikowany online / ⚠️]    │
│ Przesłanka B: [co musimy udowodnić]                             │
│   Dowód:      [...]                                             │
│   Siła:       [...]                                             │
│   Lokalizator:[...]                                             │
│   Przepis:    [...]                                             │
├─────────────────────────────────────────────────────────────────┤
│ Łańcuch ŁD-XX: [typ: Ł-SEK/Ł-RÓW/Ł-DOM/Ł-NEG/Ł-CIĄ]         │
│   Ogniwo 1 [ŁO-BASE]: F-nn ← D[nn] (kl. A/B)                  │
│   Ogniwo 2 [ŁO-POŚR]: F-nn + art. 231 KPC → F-nn              │
│   Ogniwo 3 [ŁO-NEG]:  odmowa D[nn] → art. 233 §2 KPC           │
│   Scoring: ★★★★ / Podatność: [AD-X]                            │
├─────────────────────────────────────────────────────────────────┤
│ Słabe punkty: [co przeciwnik może zaatakować]                   │
│ Luki:         [czego brakuje]                                   │
└─────────────────────────────────────────────────────────────────┘
```

> ⛔ REGUŁA ŁAŃCUCHÓW: Pole "Dowód" = fakty F-nn z KD-2 (MOD-KARTA-DOWODU),
> nie lista nazw plików. Łańcuch ŁD-XX pokazuje logikę przejścia między faktami.
>
> ⛔ REGUŁA LOKALIZATORÓW (SD-LOC z MOD-SKAN-DOWODOW-KOMPLETNY):
> Każde pole "Dowód" MUSI mieć wypełniony "Lokalizator" — stronę, zakładkę,
> godzinę nagrania lub wiersz tabeli. Lokalizator zbierany w SD-READ.2 (FAZA 2).
> Puste pole Lokalizator = ⬛ LUKA — pismo nie może być wygenerowane.
>
> ⛔ REGUŁA WERYFIKACJI PRZEPISÓW (LOC-CHECK-1 z SD-LOC.4):
> Każde pole "Przepis" pochodzi WYŁĄCZNIE z weryfikacji online (W3.1/ISAP).
> Przepis z pamięci = ⚠️ placeholder. ZAKAZ użycia jako zweryfikowanego.
> Wytyczną jest prawo — błąd w piśmie korygujemy wg prawa, nie odwrotnie.

---

### W1.4 — Lista robocza przepisów (⚠️ nieweryfikowane)

```
⚠️ [ustawa / kodeks] art. [X] §[Y] — cel użycia: [po co w piśmie]
⚠️ [ustawa / kodeks] art. [X] §[Y] — cel użycia: [po co w piśmie]
⚠️ [orzeczenie opisowo: "wyrok SN dot. X"] — cel użycia: [teza do wsparcia]

UWAGA: Wszystkie pozycje oznaczone ⚠️ wymagają weryfikacji w W3.
Numery Dz.U., daty aktów i sygnatury zostaną ustalone dopiero w W3.
```

---

### W1.4b — Tabela szczegółowa dla roszczeń pieniężnych narastających

> AKTYWUJ gdy: roszczenie pieniężne obejmuje wiele miesięcy, narasta do daty wyroku,
> LUB powiązane jest z konkretnymi zdarzeniami zewnętrznymi.

```
Dla każdego roszczenia pieniężnego narastającego:

  KOLUMNY TABELI:
  Okres | Stawka/mc | Liczba miesięcy | Kwota brutto | Odsetki od (data wymagalności)

  PRZYKŁAD:
  XI 2024  | 6 900 zł | 1 | 6 900 zł  | od 11.12.2024
  XII 2024 | 6 900 zł | 1 | 6 900 zł  | od 11.01.2025
  ...

  SUMA: [kwota łączna] zł brutto

  WALIDACJA:
  → Sprawdź czy kwota bazowa = wynagrodzenie umowne / 70% GUS
  → Sprawdź czy daty wymagalności = art. 85 §2 KP (do 10. następnego miesiąca)
  → Sprawdź czy okres zaczyna się od dnia następnego po ostatniej wypłacie
```

---

### W1.5 — Braki krytyczne i istotne

```
Per każde roszczenie:

BRAK KRYTYCZNY [⬛]: brak dowodu dla przesłanki koniecznej
  → Nie umieszczaj roszczenia w petitum bez tego dowodu
  → LUB złóż wniosek art. 248 KPC o zobowiązanie do ujawnienia
  → LUB przesuń do żądań ewentualnych

BRAK ISTOTNY [⚠️]: brak dowodu dla przesłanki pomocniczej
  → Zaznacz lukę; nie blokuje roszczenia
  → Uzupełnij domniemaniem faktycznym (art. 231 KPC) jeśli możliwe

FORMAT:
  ⬛ BRAK KRYTYCZNY: [co brakuje] → [jak uzupełnić / czy blokuje]
  ⚠️ BRAK ISTOTNY:   [co brakuje] → [domniemanie / wniosek / zaznaczenie]
```

---

### W1.6 — MOD-RED-TEAM-WLASNY

> Wywołaj: `view /mnt/skills/user/shared/MOD-RED-TEAM-WLASNY.md`
>
> Przed przejściem do W2: przejrzyj wszystkie tezy przez pryzmat
> najsilniejszego możliwego zarzutu przeciwnika. Per każda teza:
>   R1: Czy teza ma atak bez kontrargumentu? → PORZUĆ lub EWENTUALNA
>   R2: Czy łańcuch ŁD-XX ma ogniwo ★ bez wzmocnienia? → WZMOCNIJ lub USUŃ
>   R3: Czy antycypacja jest wbudowana dla tez 🔴/🟠? → DODAJ do W2
>   R4: Czy stress-test (MOD-STRESS-TEST) zaplanowany po W2? → ZAPLANUJ

---

### Checkpoint W1 → W2

```
⛔ PRZED PRZEJŚCIEM DO W2 SPRAWDŹ:

□ W1.2c-PRE: karty KD-1 wypełnione per D[nn]?
□ W1.2c-PRE: rejestr F-nn zbudowany?
□ W1.2c-PRE: łańcuchy ŁD-XX zbudowane per teza główna?
□ W1.3: mapa przesłanka→dowód→łańcuch wypełniona?
□ W1.3: każde pole "Dowód" ma lokalizator?
□ W1.3: każde pole "Przepis" = ⚠️ placeholder (weryfikacja w W3)?
□ W1.4: lista przepisów do weryfikacji gotowa?
□ W1.5: braki krytyczne i istotne zidentyfikowane?
□ W1.6: RED-TEAM-WLASNY wykonany?

STATUS:
  Wszystkie = TAK → przejdź do PRE-W2-VERIFICATION-GATE
  Którykolwiek = NIE → wróć do brakującego kroku
```
