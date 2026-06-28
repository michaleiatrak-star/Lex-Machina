# AUDYT-KONCOWY — Punktowy Audyt Jakości Pisma (gate przed .docx)

*Ładuj: W3.6a, po W3.6 (Pismo finalne — zamknięcie ⚠️), przed generowaniem .docx*
*Wersja: 1.0 | Wprowadzono: v3.7*

> Cel: zamknięcie jakościowe odrębne od HYBRID-VALIDATION/QUALITY-CHECK —
> te moduły sprawdzają BRAKI i BŁĘDY (binarnie), ten moduł ocenia JAKOŚĆ
> całego dokumentu w skali 0–10, z twardą blokadą poniżej progu.

## Procedura

Oceń pismo finalne (po zamknięciu wszystkich ⚠️ w W3) w sześciu kategoriach.
Każda ocena wymaga jednozdaniowego uzasadnienia — zakaz oceny bez uzasadnienia.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDYT KOŃCOWY — [typ pisma] / [sygnatura lub "sprawa nowa"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kryterium                              Ocena   Uzasadnienie
─────────────────────────────────────────────────────────
Poprawność faktów                       __/10   [...]
Poprawność prawna                       __/10   [...]
Odporność na kontrargumenty (R2/R3)     __/10   [...]
Dowodowość                              __/10   [...]
Realizm sądowy                          __/10   [...]
Spójność petitum z uzasadnieniem        __/10   [...]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ŚREDNIA: __ /10
STATUS: ✅ ZAMKNIĘTE (wszystkie ≥7/10) / 🔴 BLOKADA (≥1 kategoria <7/10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Zasada blokady

Jeśli KTÓRAKOLWIEK kategoria <7/10 → pismo NIE może być oznaczone jako
finalne, NIE generuj .docx. Wskaż konkretną poprawkę wymaganą do podniesienia
oceny, wykonaj ją, powtórz audyt tej kategorii (nie całego audytu od zera).

Punkty odniesienia przy ocenie:

```
Poprawność faktów      → MOD-FAKTY / CLAIM-VALIDATION: czy 0 wpisów ⛔ FIKCJA?
Poprawność prawna      → MOD-PRAWO/MOD-ORZE: czy wszystkie ⚠️ zamknięte ✅?
Odporność na kontrarg. → R2/R3 (MOD-RED-TEAM-WLASNY): czy 0 tez nieprzepisanych?
Dowodowość             → W1.3 mapa: czy luki BRAK KRYTYCZNY = 0?
Realizm sądowy         → RISK-ASSESSMENT: czy poziom ryzyka ≠ Krytyczne?
Spójność petitum       → czy każde żądanie petitum ma odpowiadający rozdział
                          uzasadnienia i odwrotnie (brak żądań "z powietrza")?
```

## Zasada uczciwości oceny

Nie zawyżaj oceny dla uspokojenia użytkownika. Ocena 10/10 powinna być
rzadkością — jeśli wszystkie kategorie wypadają ≥9, zweryfikuj ponownie
R1–R6 (MOD-RED-TEAM-WLASNY), zwykle oznacza to niedostateczny stress-test.
