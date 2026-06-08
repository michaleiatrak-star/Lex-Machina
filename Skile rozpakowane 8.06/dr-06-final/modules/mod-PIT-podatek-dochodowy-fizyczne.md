# mod-PIT-podatek-dochodowy-fizyczne

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** PIT — **Dz.U. 2026 poz. 592** (t.j. kwiecień 2026) ze zm.
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
**⚠️ Stawki, progi, kwoty wolne — ZAWSZE weryfikuj aktualne wartości przez web_search lub podatki.gov.pl**

---

## 1. CORE

### Zakres
PIT — podatek dochodowy od osób fizycznych, JDG, najem prywatny, ryczałt ewidencjonowany, IP Box, ulgi podatkowe, zeznania roczne, danina solidarnościowa.

### Akt

| Akt | Dz.U. |
|---|---|
| Ustawa o PIT | **Dz.U. 2026 poz. 592** (t.j. kwiecień 2026) |

---

## 2. INTAKE

```
□ Rok podatkowy i rodzaj przychodów?
□ Forma opodatkowania: zasady ogólne / podatek liniowy / ryczałt / karta (uchylona 2022)?
□ Czy to spór z organem (decyzja US / kontrola) czy optymalizacja?
□ Data decyzji / doręczenia → termin 14 dni na odwołanie!
□ Jakie ulgi stosowane? (dzieci, senior, powracający, IP Box, B+R)
□ Najem prywatny? → wyłącznie ryczałt od 2023 r.
□ JDG czy pracownik — inna podstawa opodatkowania!
```

---

## 3. FORMY OPODATKOWANIA — KWALIFIKATOR

| Forma | Stawka | Kiedy | Kwota wolna |
|---|---|---|---|
| Zasady ogólne (skala) | 12% / 32% | Co do zasady | 30 000 zł |
| Podatek liniowy | 19% | JDG — wybór; brak kwoty wolnej | NIE |
| Ryczałt ewidencjonowany | 2%–17% zależnie od PKD | JDG — wybór | NIE |
| Karta podatkowa | uchylona od 01.01.2022 | Tylko kontynuacja | — |

> ⚠️ Progi i kwoty wolne — weryfikuj AKTUALNIE:
> `web_search: "PIT skala podatkowa progi kwota wolna 2025 2026"`

---

## 4. SKALA PODATKOWA — WARTOŚCI ORIENTACYJNE (weryfikuj!)

```
⚠️ Poniższe wartości są ORIENTACYJNE — zawsze weryfikuj aktualne przed podaniem:
web_search: "PIT skala 2025 2026 progi kwota wolna MF podatki.gov.pl"

Do 120 000 zł podstawy:    12%
Powyżej 120 000 zł:        32%
Kwota wolna od podatku:    30 000 zł (kwota zmniejszająca podatek: 3 600 zł)
Danina solidarnościowa:    4% od dochodu powyżej 1 000 000 zł (art. 30h PIT)
```

---

## 5. MAPA ZAGADNIEŃ PIT

### Najczęstsze spory z organem

| Zagadnienie | Uwaga |
|---|---|
| Ryczałt ewidencjonowany | Stawki 2%–17% zależnie od PKD — weryfikuj ISAP |
| IP Box (art. 30ca–30cb) | 5% PIT/CIT; wymagana ewidencja kwalifikowanego IP; kwalifikowane prawa IP |
| Ulga B+R (art. 26e–26f) | Odliczenie kosztów kwalifikowanych od dochodu |
| Ulga dla młodych (art. 21 ust. 1 pkt 148) | Do 26. roku życia; limit roczny — weryfikuj |
| Najem prywatny (od 2023) | WYŁĄCZNIE ryczałt 8,5% / 12,5% (brak KUP) |
| Odszkodowania i zadośćuczynienia | Zwolnienie art. 21 ust. 1 pkt 3 — zależy od podstawy; weryfikuj |
| Koszty uzyskania przychodu (KUP) | Wykazanie związku z przychodem; dokumentacja |
| Przychody z zagranicy | Metoda wyłączenia z progresją vs odliczenia — zależy od umowy o UPO |

### Kluczowe ulgi — ZAWSZE weryfikuj kwoty przed podaniem

```
Ulga na dziecko:           kwoty zależne od liczby dzieci — weryfikuj MF
Ulga dla seniora:          zwolnienie po 60/65 r.ż. przy kontynuacji pracy
Ulga dla powracających:    zwolnienie przez 4 lata po powrocie z zagranicy
IP Box:                    5% od dochodów z praw własności intelektualnej
Ulga rehabilitacyjna:      wydatki na niepełnosprawność — katalog w ustawie
web_search: "ulgi PIT 2025 2026 kwoty odliczenia MF podatki.gov.pl"
```

### Zeznania roczne

```
PIT-37: Przychody z umowy o pracę / zlecenia (PIT przekazany przez płatnika)
PIT-36: JDG na zasadach ogólnych / inne przychody
PIT-36L: JDG podatek liniowy
PIT-38: Zyski kapitałowe (giełda, dywidendy)
PIT-39: Sprzedaż nieruchomości

Termin: do 30 KWIETNIA roku następnego
Usługa Twój e-PIT: preuzupełniona przez KAS — weryfikuj i zatwierdź/koryguj
```

---

## 6. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| KUP przy IP Box | Ewidencja kwalifikowanego IP (wymagana!) | spółka | wysoka | brak ewidencji | nie można zastosować IP Box |
| Ryczałt — prawidłowa stawka | Klasyfikacja PKD / faktyczne czynności | rejestr CEIDG | wysoka | zmiana zakresu | zaktualizuj PKD |
| Ulga na dziecko | Akty urodzenia, zameldowanie, alimenty | USC | wysoka | dziecko pełnoletnie | weryfikuj art. 27f |
| Koszty faktycznie poniesione | Faktury, rachunki, umowy | dokumenty | wysoka | faktura VAT osoby bliskiej | uwaga na transakcje z podmiotami powiązanymi |

---

## 7. STRATEGIA, QUALITY GATE, OUTPUT

**Strategia:** Weryfikuj stan prawny na dzień osiągnięcia przychodu — nie na dzień analizy. Przy IP Box — ewidencja to warunek sine qua non. Przy sporze z organem — termin 14 dni na odwołanie absolutny priorytet.

**Quality gate:** Stawka aktualna (nie z pamięci)? Stan prawny na rok podatkowy? Ulgi — kwoty zweryfikowane? Forma opodatkowania wybrana w terminie?

**Output:** Kwalifikacja przychodów → forma opodatkowania → stawka → ulgi → zeznanie → spór (termin odwołania).

**Powiązania:** `mod-OP-ordynacja-podatkowa` | `mod-ustawa-ryczalt-przychody` | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000163 | https://podatki.gov.pl

---

## ANEKS — ODLICZENIA I SKŁADKI ZUS

### Składki ZUS a PIT — KRYTYCZNA RÓŻNICA

```
Składki ZUS społeczne (emerytalne, rentowe, chorobowe, wypadkowe):
  → Odlicza się OD DOCHODU (nie od podatku) — art. 26 ust. 1 pkt 2 ustawy o PIT
  → Odliczenie wyłącznie tych, które nie zostały zaliczone do KUP

Składka zdrowotna (NFZ):
  → Od 2022 r. (Nowy Ład): NIE odlicza się od podatku (przełomowa zmiana!)
  → Wyjątek: liniowy (19%) — odliczenie do limitu rocznie — weryfikuj aktualny limit
  → Ryczałt: odliczenie do limitu rocznie — weryfikuj aktualny limit
  ⚠️ ZAWSZE weryfikuj aktualne kwoty odliczenia składki zdrowotnej:
  web_search: "odliczenie składka zdrowotna PIT 2025 2026 limit kwota"
```

### Odliczenie składek przy różnych formach opodatkowania

```
Zasady ogólne (skala 12/32%):
  → Składki społeczne: od dochodu (bez limitu)
  → Składka zdrowotna: brak odliczenia

Podatek liniowy (19%):
  → Składki społeczne: od dochodu
  → Składka zdrowotna: odliczenie do limitu (weryfikuj aktualny) — od dochodu

Ryczałt ewidencjonowany:
  → Składki społeczne: odliczenie 50% od przychodu
  → Składka zdrowotna: odliczenie do limitu (weryfikuj aktualny) — od przychodu
```
