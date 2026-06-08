# MOD-DOWODY — Hierarchia i Łańcuch Dowodowy

*Ładuj gdy: użytkownik dostarczył dokumenty / akta / dowody do analizy*
*Powiązany skill: `analizator-dowodow-v3` — użyj gdy dużo dowodów lub potrzebna pełna ocena*

---

## D1 — Hierarchia dowodów (4 poziomy)

### Poziom A — Dokumenty urzędowe (moc najwyższa)
Protokoły sądowe z sygnaturą/datą/godziną, wyniki kontroli organów państwowych,
wpisy do rejestrów, orzeczenia prawomocne, potwierdzenia z metadanymi
elektronicznymi, akty notarialne, decyzje administracyjne.

**Jak powoływać:** "(protokół z dnia [data], godz. [X], str. [Y])"

### Poziom B — Zeznania pod rygorem odpowiedzialności
Zeznania świadków z protokołu sądowego lub prokuratorskiego.
**Oceniaj:** spójność wewnętrzna, spójność zewnętrzna (z A), interes procesowy,
spontaniczność odpowiedzi.

**Jak powoływać:** "(zeznanie świadka [imię], protokół z dnia [data], godz. [X])"

### Poziom C — Dokumenty prywatne stron
Pisma, maile, wiadomości, nagrania, zdjęcia, faktury, umowy prywatne.
**Wartość:** gdy strona sama je złożyła (działa przeciw niej) lub są niesprzeczne z A i B.

**Jak powoływać:** "(pismo z dnia [data], zał. nr [X])"

### Poziom D — Twierdzenia bez dowodu
Zdania strony bez poparcia dowodowego.
**Reakcja:** wskazuj brak dowodu → żądaj przedstawienia (art. 248 KPC)
lub stosuj art. 233 §2 KPC (odmowa oceniana na niekorzyść).

---

## D2 — Budowa łańcucha dowodowego

Dla każdego roszczenia/tezy:

```
ROSZCZENIE / TEZA:
[treść]
  ↓
PRZEPIS PRAWNY (zweryfikowany — patrz MOD-PRAWO):
[art. X §Y — co wymaga udowodnienia]
  ↓
DOWÓD Z AKT (poziom A lub B):
[nazwa, data, str./godz.]
  ↓
ORZECZENIE ANALOGICZNE (opcjonalnie — via orzeczenia-sadowe-v2):
[sąd, data, sygnatura, podobieństwo X/5]
  ↓
WNIOSEK DLA SĄDU:
[konkretna konkluzja]
```

---

## D3 — Weryfikacja kompletności łańcucha

Przed napisaniem pisma sprawdź dla każdego roszczenia:

```
ROSZCZENIE: [treść]
┌─ Przepis: [zweryfikowany online]              → OK / BRAK
├─ Dowód A/B: [z akt, str./data]                → OK / BRAK
├─ Podobna sprawa: [sygnatura, podobień. X/5]   → OK / BRAK / ZBĘDNE
├─ Twierdzenie przeciwnika: [zidentyfikowane]   → OK / BRAK / N/D
└─ Obalenie twierdzenia: [typ A/B/C/D/E/F]      → OK / BRAK / N/D

STATUS:
✓ KOMPLETNY → można pisać
⚠ NIEKOMPLETNY → wskaż lukę i sposób jej uzupełnienia
✗ BRAK PODSTAWY → nie umieszczaj w piśmie
```

---

## D4 — Sekcja "Na dowód" w piśmie

Format obligatoryjny:

```
Na dowód powyższego powołuję:
1. [Nazwa dowodu] — [lokalizacja: str. X akt / zał. nr Y]
   na okoliczność: [co konkretnie wykazuje]
2. [Kolejny dowód] — [lokalizacja]
   na okoliczność: [...]
```

> ⚠ Brak wskazania okoliczności → sąd może oddalić wniosek dowodowy
> ⚠ Dowód bez faktu w stanie faktycznym → nieaktywny procesowo

---

## D5 — Kiedy delegować do analizatora-dowodow-v3

Deleguj do `analizator-dowodow-v3` gdy:
- Akta liczą więcej niż 10 dokumentów
- Istnieją sprzeczności między dowodami
- Użytkownik prosi o pełną ocenę wartości dowodowej
- Potrzebna jest ocena 0–10 i hierarchia A–D dla każdego dowodu

Wyniki z `analizatora-dowodow-v3` integruj wg reguł:
- Alerty LEGAL (zakaz dowodowy, prekluzja) → pomiń dowód w sekcji "Na dowód"
- Alerty FORM (brak oryginału, brak daty) → wyjaśnij lub pomiń
- Alerty SPOJ (konflikty) → wyjaśnij w stanie faktycznym lub pomiń słabszy
- Dowody 0–3/10 → nie powoływać (obniżają wiarygodność)
