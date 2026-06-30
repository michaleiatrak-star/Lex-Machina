# MOD-ROUTE — Pomocnicza matryca modułów (tylko informacyjna)

> ⛔ DEPRECATED jako główny router — NIE wywołuj tego pliku jako pierwszego kroku.
> Routing odbywa się wyłącznie przez KROK 0 (Testy A/B/C) w SKILL.md.
> Kolejność ładowania modułów jest określona przez MODUŁY-MAPA w SKILL.md — nie przez ten plik.
> Ten plik zachowano jako pomocnicze przypomnienie matrycy decyzyjnej — bez sekwencji ładowania.

---

## Matryca wyboru modułów (pomocnicza — patrz MODUŁY-MAPA w SKILL.md)

```
PYTANIE                                          ODPOWIEDŹ    MODUŁ
1. Czy użytkownik dostarczył dowody/dokumenty?   TAK/NIE  →  MOD-DOWODY + MOD-FAKTY (gdy TAK)
2. Czy trzeba obalić twierdzenia przeciwnika?    TAK/NIE  →  MOD-OBAL (gdy TAK)
3. Czy potrzebne orzecznictwo SN/SA?             TAK/NIE  →  MOD-ORZE (gdy TAK)
4. Czy piszemy konkretne pismo (nie plan)?       TAK/NIE  →  MOD-SZABLONY (gdy TAK) — w W2
5. Czy pismo wszczyna postępowanie?              TAK/NIE  →  MOD-OPLATY (gdy TAK)
6. Czy pismo dotyczy KPA/WSA/NSA?               TAK/NIE  →  MOD-ADMIN (gdy TAK)
7. Czy to analiza pisma przeciwnika / riposta?   TAK/NIE  →  MOD-OBAL + V10 engines (gdy TAK)
8. Czy to apelacja?                              TAK/NIE  →  appellate-engine-v8 aktywny (gdy TAK)
9. Czy to zażalenie do prokuratury?              TAK/NIE  →  prosecution-complaint-engine-v8 (gdy TAK)
```

Uwaga: MOD-PRAWO jest wbudowany w W3.1 (nie ładuje się w W1/W2).
Uwaga: MOD-WALIDACJA bloki A–J ładuje się w W3.4 (zawsze).

## Sygnały eskalacji do innych skilli

```
SYGNAŁ                              → SKILL
────────────────────────────────────────────────────────
Pismo proste z katalogu Test B     → pisma-proste-v2
Potrzeba głębokiej analizy sprawy  → analiza-sadowa-v6
Potrzeba orzecznictwa              → orzeczenia-sadowe-v2
Duże akta, wiele dowodów           → analizator-dowodow-v3
Użytkownik zagubiony w pojęciach   → przewodnik-prawny-v2
────────────────────────────────────────────────────────
Zasada: pisma-procesowe-v3 koordynuje, nie duplikuje innych skilli.
```
