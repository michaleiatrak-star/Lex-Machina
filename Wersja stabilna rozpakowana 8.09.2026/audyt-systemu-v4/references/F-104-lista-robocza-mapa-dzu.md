# F-104 — LISTA ROBOCZA: akty do wpisania do centralnej mapy Dz.U.

**Utworzona:** 2026-08-21 (AUDYT-2026-08-21zf) | **Flaga:** F-104 | **Rocznik:** 2026

## ⛔ Dlaczego ta lista ma 16 pozycji, a T11 raportuje 82

Surowy wynik T11 (`check_sync_aktow.py`) NIE jest listą braków — miesza trzy rzeczy:

| Kategoria | Co to jest | Działanie |
|---|---|---|
| Numer GŁÓWNY aktu, brak w mapie | pierwszy numer w komórce metryki modułu | ✅ wpisać wiersz |
| Numer POBOCZNY | nowelizacja / akt powiązany / rozporządzenie wykonawcze cytowane W TEJ SAMEJ komórce | ⛔ NIE wpisywać jako osobny wiersz |
| Fałszywy brak | numer JEST w mapie, ale w formacie kolumn tabeli `\| 2026 \| 47 \|`, nie prozą `poz. 47` | ⛔ brak działania |

⚠️ **Trzecia kategoria kosztowała ten audyt fałszywą listę 48 pozycji.** Pierwsze
podejście kwalifikacyjne czytało mapę wyłącznie wyrażeniem `poz. N` i nie widziało
wierszy tabeli, gdzie rok i pozycja są w OSOBNYCH kolumnach. Efekt: PIT (2026 poz. 592)
i KRO (2026 poz. 236) trafiły na listę „brakujących", choć są w mapie od dawna —
wykryte dopiero przy ręcznym oglądzie formatu tabeli, po zweryfikowaniu obu online.
⭐ **Lekcja przenośna:** przy każdym porównywaniu rejestrów sprawdź NAJPIERW, w ilu
formatach zapisany jest numer w każdym z nich. Ta sama klasa błędu co F-82 (zgodność
rejestrów nie dowodzi poprawności), tylko odwrotna: NIEzgodność też nie dowodzi braku.

## Protokół transzy

1. Weź ~8 pozycji od góry (najświeższe numery pierwsze).
2. Zweryfikuj wg ZASADY 14: Rząd 1 (ISAP/ELI) zawsze pierwsza próba → Rząd 2A/2B →
   Rząd 3 wyłącznie jako zbieżność. ⛔ Znacznik „VER lokalnie" NIE zwalnia z weryfikacji
   (ZASADA 8, lekcja F-82: zgodność dwóch rejestrów wewnętrznych nie jest dowodem).
3. Wpisz wiersz do NOWEJ generacji `mapa_dzu_YYYY-MM-DD.md` (FAZA 7B) — nie doklejaj
   do pliku z 15.07. Format: `| Rok | Poz. | Akt | Typ | Status | Skille | Uwagi |`.
4. Skreśl pozycję tutaj (☐ → ✅) i odnotuj Rząd źródła potwierdzenia.
5. Po wyczerpaniu rocznika 2026 — powtórz kwalifikację POPRAWIONYM parserem dla
   roczników starszych (wynik poprzedniej, błędnej kwalifikacji nie nadaje się do użycia).

## Lista — rocznik 2026

| Status | Dz.U. | Akt | Moduł | DR | Znacznik lokalny |
|---|---|---|---|---|---|
## Lista — rocznik 2026

**Razem do wpisania: 16** — ✅ **16/16 rozpatrzone (3 w transzy 1 + 8 w transzy 2 +
5 w transzy 3, 2026-08-21)**. 15 wpisane do mapy z pełną weryfikacją; **1 pozycja
(poz. 110) wpisana z jawną flagą ⚠️ [NIEWERYFIKOWANE]** — lista robocza nie miała
wystarczającego kontekstu, a temat (rejestr sprawców przestępstw na tle seksualnym)
wymaga precyzyjnej weryfikacji Rząd 1 przed jakimkolwiek powołaniem w piśmie
procesowym, nie zgadywania na podstawie samego tytułu.

**Rocznik 2026 ZAMKNIĘTY.** Zgodnie z protokołem (pkt 5), następny krok: powtórzyć
kwalifikację POPRAWIONYM parserem dla roczników starszych (2025 i wstecz) — wynik
poprzedniej, błędnej kwalifikacji (48 pozycji, patrz nota na początku tego pliku)
nie nadaje się do użycia i wymaga ponownego przebiegu.

## Transza 1 (2026-08-21) — wpisane do `mapa_dzu_2026-08-21.md`

| Dz.U. | Akt | Potwierdzenie |
|---|---|---|
| 2026 poz. 913 | Prawo upadłościowe, t.j. | RZĄD 1: ISAP PDF `D20260913L`, ELI `DU/2026/913/ogl` (obwieszczenie 12.06.2026, publikacja 7.07.2026, stan prawny 10.06.2026) + RZĄD 2B. Zastępuje 2025 poz. 614 → PREV |
| 2026 poz. 820 | Prawo oświatowe, t.j. | RZĄD 1: `api.sejm.gov.pl/eli/acts/DU/2026/820/text.pdf`, ELI, kuratorium + RZĄD 2B. Obwieszczenie 12.06.2026, publikacja 22.06.2026. Zastępuje 2025 poz. 1043 → PREV. ⚠️ zm. po t.j.: 904, 1036 |
| 2026 poz. 522 | Ustawa o rachunkowości, t.j. | RZĄD 1: ELI `DU/2026/522/ogl`, dziennikustaw.gov.pl za PIBR + RZĄD 2B. Obwieszczenie 30.03.2026, publikacja 16.04.2026. ⚠️ zm. po t.j.: 640, 644 |

## Transza 2 (2026-08-21) — wpisane do `mapa_dzu_2026-08-21.md`

| Dz.U. | Akt | Potwierdzenie |
|---|---|---|
| 2026 poz. 985 | Ustawa frankowa — spory ws. kredytów CHF | RZĄD 1: `api.sejm.gov.pl/eli/acts/DU/2026/985/text.pdf` + RZĄD 2/3. Ustawa 29.05.2026, w życie 7.08.2026 |
| 2026 poz. 1046 | Ustawa antymobbingowa — zmiana KP/KPC | RZĄD 1: ISAP DocDetails `id=WDU20260001046` + RZĄD 2/3. Ustawa 19.06.2026, w życie 5.11.2026 |
| 2026 poz. 1005 | Ustawa łańcuchowa — zmiana o ochronie zwierząt | RZĄD 1: ISAP PDF `D20261005.pdf` + RZĄD 2/3. Ustawa 3.07.2026, w życie ~28.07.2027 |
| 2026 poz. 909 | Rozp. MRiF ws. rachunkowości/planów kont budżetu — t.j. | RZĄD 2B WYŁĄCZNIE. Obwieszczenie 24.06.2026 |
| 2026 poz. 724 | Rozp. MSWiA ws. ewidencji kierujących — taryfikator punktów karnych | RZĄD 1: ISAP PDF `D20260724.pdf`. Rozp. 29.05.2026, w życie 3.06.2026 |
| 2026 poz. 662 | Ustawa o samorządzie gminnym — t.j. | RZĄD 1: ISAP PDF `D20260662.pdf` + RZĄD 2B. Obwieszczenie 15.05.2026 |
| 2026 poz. 619 | Ustawa o gospodarce opakowaniami i odpadami opakowaniowymi — t.j. | RZĄD 1: ISAP PDF `D20260619.pdf` + RZĄD 2B. Obwieszczenie 30.04.2026 |
| 2026 poz. 412 | Ustawa o podatku akcyzowym — t.j. | RZĄD 1: ISAP PDF `D20260412.pdf` + RZĄD 2B. Obwieszczenie 12.03.2026 |

## Transza 3 (2026-08-21) — wpisane do `mapa_dzu_2026-08-21.md`, ZAMYKA rocznik 2026

| Dz.U. | Akt | Potwierdzenie |
|---|---|---|
| 2026 poz. 300 | Zasady techniki prawodawczej, t.j. | RZĄD 1: ISAP PDF `D20260300.pdf`, WDU20260000300. Publikacja 10.03.2026. Lista robocza opisywała nieprecyzyjnie jako "specustawy" — moduł dr-01 już miał poprawną identyfikację |
| 2026 poz. 188 | Rozp. MFiG ws. wydłużenia terminu JPK_KR_PD | RZĄD 2B (podatki.gov.pl). Rozp. 16.02.2026, publikacja 19.02.2026 |
| 2026 poz. 157 | Ustawa o SKW oraz SWW, t.j. | RZĄD 1: ISAP PDF `D20260157.pdf`, WDU20260000157. Obwieszczenie 5.02.2026 |
| 2026 poz. 125 | Ustawa o zawodzie lekarza weterynarii i izbach lekarsko-weterynaryjnych, t.j. | RZĄD 1: ISAP WDU20260000125 + RZĄD 2B. Obwieszczenie 26.01.2026 |
| 2026 poz. 110 | Ustawa o przeciwdziałaniu przestępczości na tle seksualnym/ochronie małoletnich | ⚠️ NIEWERYFIKOWANE — wpisana z jawną flagą, brak czasu na weryfikację Rząd 1 w tej sesji. Priorytet do transzy 4 lub dedykowanej sesji dr-03 |

## 🔴 Znalezisko uboczne transzy 1 — błąd klasy F-82 w mapie

Wiersz `2025 | 468` opisywał **ustawę o emeryturach pomostowych**, choć ten numer
należy do t.j. **ustawy o postępowaniu w sprawach dotyczących pomocy publicznej**
(obwieszczenie 24.03.2025). Prawidłowy t.j. emerytur pomostowych: **2024 poz. 1696**.
Oba wiersze naprawione i oznaczone `⚠️ ALERT`. ⭐ Błąd wyszedł tylko dlatego, że
numer weryfikowano ZEWNĘTRZNIE przy innym zadaniu — trzy rejestry wewnętrzne były
ze sobą zgodne, więc kontrola krzyżowa nigdy by go nie ujawniła.

## Zweryfikowane w sesji 2026-08-21 — ⛔ BEZ działania, były już w mapie

| Dz.U. | Akt | Ustalenie |
|---|---|---|
| 2026 poz. 592 | Ustawa o PIT, t.j. | ✅ RZĄD 1 (ISAP PDF D20260592, eli.gov.pl, dziennikustaw.gov.pl, podatki.gov.pl) + RZĄD 2B (gofin, infor). Obwieszczenie 17.04.2026, stan prawny na 1.04.2026. ⭐ Nowelizacje PO t.j.: 2026 poz. 779, 846, 1079 — do sprawdzenia przy powołaniu |
| 2026 poz. 236 | Kodeks rodzinny i opiekuńczy, t.j. | ✅ RZĄD 1 (ISAP PDF D20260236L, ELI DU/2026/236/ogl) + RZĄD 2B (gofin, infor). Obwieszczenie 20.02.2026, konsoliduje 2023 poz. 2809 ze zm. 2025 poz. 897 |

Weryfikacja nie poszła na marne mimo błędu kwalifikacji: oba numery są dziś
potwierdzone Rzędem 1, czego mapa wcześniej nie odnotowywała.

## Artefakt parsowania — NIE jest aktem

- `Dz.U. 2026 poz. 0` (dr-02, `mod-sklad-sadu-liczba-sedziow.md`) — dopasowanie
  regexu do numeracji artykułu, nie metryka. Odfiltrowany (`poz. 0` odrzucane).
