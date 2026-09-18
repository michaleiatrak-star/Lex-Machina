# PRZEGLAD-MAP-ELI-2026-09-01i — wynik kontroli 16 map dziedzinowych w żywym rejestrze

> **Plik:** `audyt-systemu-v4/references/PRZEGLAD-MAP-ELI-2026-09-01i.md`
> **Flaga:** F-155 (drugi zakres) · **Data pomiaru:** 2026-09-01
> **Źródło:** `api.sejm.gov.pl/eli` ✅ [VER: 2026-09-01] · RZĄD 1
> **Metoda:** dla każdego numeru z `MAPA-AKTOW.md` — (1) istnienie i status;
> (2) dla obwieszczeń: czy to NAJNOWSZY obowiązujący t.j. swojego aktu, ustalany
> przez sekcję „Tekst jednolity dla aktu" w `/references`; (3) nowelizacje po
> dacie t.j. jako **unia** sekcji API i metody datowej (patrz §3).

---

## 1. WYNIK ZBIORCZY

| Skill | Numerów | W ELI, `obowiązujący` | Nieaktualny t.j. | ⚠️ z nowelizacjami po t.j. |
|---|---:|---:|---:|---:|
| dr-01 | 11 | 11 | 0 | 4 |
| dr-02 | 32 | 32 | 0 | 10 |
| dr-03 | 13 | 13 | 0 | 11 |
| dr-04 | 22 | **20** | 0 | 11 |
| dr-05 | 18 | 18 | 0 | 4 |
| dr-06 | 21 | 21 | 0 | 16 |
| dr-07 | 11 | 11 | 0 | 7 |
| dr-08 | 21 | 21 | 0 | 11 |
| dr-09 | 21 | 21 | 0 | 16 |
| dr-10 | 26 | **25** | 0 | 19 |
| dr-11 | 11 | 11 | 0 | 4 |
| dr-12 | 9 | 9 | 0 | 7 |
| dr-13 | 17 | 17 | 0 | 12 |
| dr-14 | 6 | 6 | 0 | 2 |
| dr-15 | 6 | 6 | 0 | 3 |
| dr-16 | 6 | 6 | 0 | 2 |
| **Razem** | **251** | **248** | **0** | **139** |

⛔ **Zero nieaktualnych tekstów jednolitych w 16 mapach.** To wynik negatywny
i tak go zapisujemy — nie „mapy są poprawne", tylko: kontrola aktualności t.j.
przeszła dla każdej pozycji obwieszczeniowej.

## 2. TRZY POZYCJE WSKAZUJĄCE AKT BAZOWY ZAMIAST t.j. — POPRAWIONE

Status `akt posiada tekst jednolity` znaczy, że mapa cytowała akt pierwotny,
choć obowiązujący tekst jednolity istnieje:

| Skill | Było | Jest | Akt |
|---|---|---|---|
| dr-04 | Dz.U. 2023 poz. 1429 | **Dz.U. 2026 poz. 873 t.j.** | o świadczeniu wspierającym |
| dr-04 | Dz.U. 2024 poz. 858 | **Dz.U. 2026 poz. 532 t.j.** | „Aktywny Rodzic" |
| dr-10 | Dz.U. 2022 poz. 974 | **Dz.U. 2024 poz. 1620 t.j.** | o wyrobach medycznych |

Numer pierwotny zachowano w nawiasie — jest potrzebny do odczytania rejestru
zmian, ale nie jest podstawą do cytowania brzmienia.

## 3. UNIA DWÓCH ŹRÓDEŁ NOWELIZACJI — DLACZEGO NIE SAMA SEKCJA API

Pomiar F-155 na 19 aktach (17 map DR-08 + KC + ustawa o PIP), powtórzony
niezależnie 2026-09-01i:

- **16/19** — sekcja `Nowelizacje po tekście jednolitym` z API zgadza się
  z metodą datową co do joty;
- **3/19** — sekcja jest **właściwym podzbiorem**: brakuje łącznie czterech
  ustaw zmieniających (`DU/2026/864`, `DU/2024/1907`, `DU/2026/875`,
  `DU/2026/982`), **wszystkich ze statusem `obowiązujący`**, w tym
  `DU/2024/1907` obowiązującej od 2025-01-01, czyli od ośmiu miesięcy;
- **0/19** — rozbieżność odwrotna (pozycja w sekcji, brak w metodzie datowej).

⛔ Wniosek, który przesądził o implementacji: sekcja API **nie zastępuje**
metody datowej, tylko ją uzupełnia. Przejście na samą sekcję przywróciłoby
fałszywy negatyw dokładnie tej klasy, dla której bramka F-153 powstała.
`check_wyjatek_gate_eli.py` bierze **unię** obu źródeł i oznacza proweniencję
każdej pozycji: `DATA+API`, `DATA` albo `API`.

## 4. CO TEN PRZEGLĄD ZOSTAWIA OTWARTE

139 pozycji w 16 mapach ma nowelizacje ogłoszone po dacie t.j. Oznaczone są
dotąd **wyłącznie w DR-08** (12 wierszy, wydanie 3.9). Pozostałe 15 map nadal
pokazuje te akty bez sygnału — czyli operator czytający mapę nie wie, że sam
t.j. jest tam niepełny. To zakres flagi **F-156**.

⛔ Ta lista jest fotografią z 2026-09-01. Liczba nowelizacji po t.j. rośnie
z każdą publikacją Dz.U. — przegląd trzeba powtarzać, a nie odczytywać z tego
pliku jako stanu bieżącego. Plik dokumentuje POMIAR, nie stan prawny.
