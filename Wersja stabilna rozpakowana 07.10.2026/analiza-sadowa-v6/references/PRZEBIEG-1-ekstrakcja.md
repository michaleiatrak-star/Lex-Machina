# PRZEBIEG 1 — EKSTRAKCJA FAKTOGRAFICZNA

> **Model:** Kontynentalny — odpowiednik uzasadnienia faktycznego wyroku (KPC art. 327¹ §1 pkt 1 / KPK art. 424 §1 pkt 1)
> **Output:** BAZA FAKTOGRAFICZNA (BF) — wejście do Przebiegu 2
> **Zakaz absolutny:** oceny, kwalifikacje prawne, predykcje, słowa wartościujące

---

## ZASADA NADRZĘDNA PRZEBIEGU 1

BF jest protokołem, nie analizą. Każde zdanie w BF musi dać się zweryfikować
przez bezpośrednie odesłanie do dokumentu źródłowego. Jeśli fakt nie wynika
wprost z dokumentu — nie trafia do BF.

> **Test BF:** „Czy to zdanie zawiera ocenę, interpretację lub przewidywanie?"
> TAK → usuń lub przeformułuj na czysty opis.

Niedopuszczalne w BF:
- „Powód kłamał o..." → ❌ (ocena)
- „To świadczy o złej woli..." → ❌ (interpretacja)
- „Prawdopodobnie porozumienie było wymuszone..." → ❌ (predykcja)

Dopuszczalne w BF:
- „W dokumencie z dnia X powód twierdzi Y" → ✓
- „Pozwana w piśmie z dnia X zaprzecza twierdzeniu Y" → ✓
- „Dokument potwierdzenia nadania z dnia X wskazuje datę odbioru Y" → ✓

---

## E1 — INDEKS DOKUMENTÓW

Dla każdego dokumentu w materiale:

| ID | Dokument | Data | Autor | Adresat | Cel dokumentu | Charakter |
|----|----------|------|-------|---------|---------------|-----------|
| D1 | | | | | | procesowy / kadrowy / dowodowy / korespondencja |

> Nie oceniaj wiarygodności dokumentu. Nie wskazuj „fałszywy" ani „autentyczny" —
> to zadanie Przebiegu 2.

---

## E2 — CHRONOLOGIA ZDARZEŃ

Lista zdarzeń w porządku chronologicznym. Wyłącznie fakty datowane.

| Lp | Data | Zdarzenie (opis neutralny) | Źródło (ID dok.) | Strona zgłaszająca |
|----|------|---------------------------|------------------|--------------------|
| | | | | Powód / Pozwany / Bezsporne |

Reguły:
- Jeśli data jest podana przez tylko jedną stronę — odnotuj jako „wg [strony]"
- Jeśli strony podają różne daty tego samego zdarzenia — dwa wiersze, oba w BF
- Jeśli data jest niesporna — oznacz: (bezsporne)

---

## E3 — TWIERDZENIA STRON

Oddzielne tabele dla każdej strony. Wyłącznie to, co strona twierdzi — bez oceny.

### E3a — Twierdzenia Powoda / Oskarżyciela

| Lp | Twierdzenie (streszczenie neutralne) | Źródło (ID dok.) | Dotyczy zarzutu / roszczenia |
|----|--------------------------------------|------------------|------------------------------|

### E3b — Twierdzenia Pozwanego / Oskarżonego

| Lp | Twierdzenie (streszczenie neutralne) | Źródło (ID dok.) | Odpowiedź na twierdzenie E3a.X |
|----|--------------------------------------|------------------|--------------------------------|

> Nie oceniaj wiarygodności twierdzeń. Nie wskazuj, które są prawdziwe.
> Strona podmiotowa i interes procesowy → Przebieg 2.

---

## E4 — DOWODY MATERIALNE

Wykaz wszystkich dowodów powołanych lub złożonych przez strony.

| ID | Dowód | Typ | Powołany przez | Teza dowodowa (wg strony) | Przeciw któremu twierdzeniu E3 |
|----|-------|-----|----------------|---------------------------|-------------------------------|
| | | dok. / zeznanie / nagranie / opinia / inne | | | |

> Nie klasyfikuj jeszcze waloru (A/B/C/D) — to Przebieg 2.
> Nie oceniaj wiarygodności nagrań, zeznań ani dokumentów.

---

## E5 — FAKTY NIESPORNE

Lista faktów przyznanych przez obie strony lub wynikających z dokumentów
niezakwestionowanych przez żadną stronę.

| Lp | Fakt niesporny | Podstawa (E3a.X i E3b.Y lub D.Z) |
|----|----------------|----------------------------------|

> Fakt niesporny = strona nie zaprzeczyła LUB obie strony przyznały.
> Wątpliwość co do niesporzności → przenieś do E6.

---

## E6 — FAKTY SPORNE

Lista faktów, co do których twierdzenia stron są rozbieżne.

| Lp | Kwestia sporna | Twierdzenie strony A | Twierdzenie strony B | Źródło A | Źródło B |
|----|----------------|----------------------|----------------------|----------|----------|

> Nie rozstrzygaj kto ma rację. Nie wskazuj „bardziej wiarygodne".
> Rozstrzygnięcie → Przebieg 2 (ocena dowodów, Filtr #5).

---

## TWARDY BUFOR — KONTROLA BF PRZED PRZEJŚCIEM DO P2

Przed zamknięciem Przebiegu 1 wykonaj kontrolę:

```
KONTROLA BF:

C1: Czy BF zawiera słowa oceniające (kłamał, manipulował, dobrowolnie,
    wymuszony, fałszywy, autentyczny, wiarygodny)? → usuń
C2: Czy każdy wiersz E2–E6 ma odesłanie do ID dokumentu z E1? → uzupełnij
C3: Czy strony rozbieżnych twierdzeń mają swoje wiersze w E6? → sprawdź
C4: Czy BF.E4 zawiera WSZYSTKIE powołane dowody (w tym niekorzystne
    dla każdej ze stron)? → KPK art. 410 — kompletność
C5: Czy BF.E5 nie zawiera faktów de facto spornych? → przenieś do E6

STATUS BF: KOMPLETNA ✓ / NIEKOMPLETNA ✗ [wskaż brakujące elementy]
```

> Status KOMPLETNA → przejście do Przebiegu 2.
> Status NIEKOMPLETNA → wróć do odpowiednich tabel.

---

## NOTY DO PRZEBIEGU 2

Na końcu BF dołącz listę sygnałów wymagających analizy w P2:

```
SYGNAŁY DO P2 (nie są elementem BF — to wskazówki dla analityka):
- [ID sygnału]: [obserwacja neutralna bez oceny]
  Przykład: „S1: E6.3 — strony podają różne daty tego samego dokumentu"
  Przykład: „S2: E4.5 — to samo zdarzenie opisane w dwóch dokumentach inaczej"
  Przykład: „S3: E3b.7 — twierdzenie pozwanej zmienia się między D3 a D7"
```

> Sygnały to obserwacje strukturalne z BF. Interpretacja → Przebieg 2.
