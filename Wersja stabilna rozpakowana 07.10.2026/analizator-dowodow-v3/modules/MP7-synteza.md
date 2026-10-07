# M7 — Synteza, raport końcowy i rekomendacje

## Cel
Zamienić wyniki M1–M6/M8/M9/MP13 w raport procesowy, który pozwala podjąć decyzję:
co pisać, co dowodzić, czego unikać.

Jeżeli MP13 był uruchomiony, M7 musi skonsumować blok `[BLOK-MP13→M7]`
i włączyć jego elementy do odpowiednich sekcji raportu.

---

## 7.1 Struktura raportu

```text
1.  Zakres analizy
2.  Dokumenty analizowane
3.  Fakty bezsporne
4.  Fakty sporne
5.  Fakty kluczowe dla rozstrzygnięcia
6.  Kolizje i sprzeczności
7.  Łańcuchy faktyczne i zbieżności          ← z MP13 [BLOK-MP13→M7]
8.  Narracja procesowa (własna + przeciwnika) ← z MP13 [BLOK-MP13→M7]
9.  Ocena prawna per roszczenie / zarzut
10. Ocena dowodów
11. Perspektywa sądu
12. Perspektywa przeciwnika
13. Własna strategia
14. Ryzyka procesowe (+ flagi [RYZYKO-NARRACYJNE] z MP13)
15. Rekomendowane działania
16. Braki do uzupełnienia
17. Predykcja rozstrzygnięcia
```

---

## 7.2 Fakty kluczowe

Dziel na:

- decydujące;
- istotne;
- pomocnicze;
- tło;
- szkodliwe (→ status neutralizacji z MP13 sekcja 13.6).

Każdy fakt musi mieć ID z M1.

---

## 7.3 Łańcuchy faktyczne i zbieżności (z MP13)

Jeżeli MP13 był uruchomiony, wypełnij tę sekcję z bloku `[BLOK-MP13→M7]`:

```text
ŁAŃCUCHY KLUCZOWE:
  Łańcuch ID | Teza | Ogniwa (ID faktów) | Siła | Najsłabsze ogniwo | Riposta
  ──────────────────────────────────────────────────────────────────────────

ZBIEŻNOŚCI KLUCZOWE:
  Zbieżność ID | Teza | Liczba faktów | Siła łączna | Alternatywna interpretacja
  ──────────────────────────────────────────────────────────────────────────────

LUKI NARRACYJNE DO UZUPEŁNIENIA:
  Brak | Jak uzupełnić | Priorytet
  ─────────────────────────────────
```

Jeżeli MP13 nie był uruchomiony, a sprawa ma ≥ 2 dokumenty lub jest złożona,
zanotuj: `[UWAGA: MP13 pominięty — rozważ uruchomienie dla pełnej syntezy faktycznej]`.

---

## 7.4 Narracja procesowa (z MP13)

Jeżeli MP13 był uruchomiony, wstaw tutaj wynik sekcji 13.4–13.5:

```text
NARRACJA WŁASNA (szkielet 5-zdaniowy):
  1.
  2.
  3.
  4.
  5.

Dowody zamykające narrację:
Luki narracyjne:
Ryzyka narracyjne:

──────────────────────────────────────────────────────────────────────

NARRACJA PRZECIWNIKA (szkielet 5-zdaniowy):
  1.
  2.
  3.
  4.
  5.

Najsilniejsze fakty narracji przeciwnika:
Fakty, które przeciwnik przemilczy:
Jak obalić narrację przeciwnika:
```

---

## 7.5 Predykcja jak sąd

```text
Najbardziej prawdopodobne ustalenia faktyczne:
Najbardziej prawdopodobna ocena dowodów:
Najbardziej prawdopodobna ocena prawna:
Najbardziej prawdopodobne rozstrzygnięcie:
Dlaczego sąd może oddalić część żądań:
Dlaczego sąd może uwzględnić część żądań:
Co może zmienić wynik:
```

---

## 7.6 Rekomendacje operacyjne

Nadaj priorytety:

- `PILNE` — wpływa na wynik lub termin;
- `WAŻNE` — wzmacnia roszczenie / obronę;
- `POMOCNICZE` — poprawia narrację;
- `NIE PODNOSIĆ` — szkodzi albo rozprasza.

Uwzględnij flagi `[RYZYKO-NARRACYJNE]` z MP13 sekcja 13.6 jako `PILNE`
lub `WAŻNE` zależnie od oceny ryzyka.

---

## 7.7 Wersja krótka dla użytkownika

Na końcu raportu daj skrót:

```text
Najważniejsze 5 ustaleń:
Największe 3 ryzyka:
Najsilniejsze 3 argumenty:
Najbliższe 5 działań:
```

Jeżeli MP13 był uruchomiony, dodaj:

```text
Narracja w jednym zdaniu (wersja własna):
Najsilniejszy łańcuch faktyczny:
Najgroźniejszy fakt szkodliwy i jego status:
```
