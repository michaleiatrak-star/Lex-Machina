---
name: mod-UCC-clo-taryfa-celna

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł prawa celnego UE. Wydzielony z mod-ustawa-akcyzowa-i-clo-UCC (2026-06-14).
  Stosuj ZAWSZE gdy użytkownik pyta o:
  - Nomenklaturę Scaloną (CN) i klasyfikację taryfową towarów (TARIC)
  - Kodeks celny UE (UCC, rozp. 952/2013) — procedury celne, zgłoszenia celne
  - wiążącą informację taryfową (WIT) i wiążącą informację o pochodzeniu (WIP)
  - cło, wartość celna (metody wyceny), preferencje taryfowe (FTA, GSP)
  - odprawy celne, tranzyt (T1/T2), skład celny, uszlachetnianie czynne/bierne
  - zwrot cła, dług celny, zabezpieczenie celne
  Powiązane: mod-ustawa-akcyzowa-i-clo-UCC (podatek akcyzowy, WIA, KKS),
  mod-Q (PIT/VAT/CIT), mod-AC (REACH/chemikalia).
compatibility:
  tools:
    - web_search
    - web_fetch
---

# mod-UCC — Cło: Taryfa Celna / Kodeks Celny UE (UCC)

**Status:** moduł uzupełniający do `mod-ustawa-akcyzowa-i-clo-UCC.md`
**Wydzielony:** 2026-06-14 (audyt — podział tematyczny: akcyza domestic vs. cło UE)

## AKTY PRAWNE — WERYFIKUJ NA EUR-LEX

| Akt | Oznaczenie | Przedmiot |
|-----|-----------|-----------|
| Kodeks celny UE (UCC) | Rozp. (UE) 952/2013 | Postępowanie celne w UE |
| Taryfa celna UE | Rozp. (EWG) 2658/87 + Zał. I | Nomenklatura Scalona CN |
| Rozp. delegowane UCC | (UE) 2015/2446 | Przepisy uzupełniające |
| Rozp. wykonawcze UCC | (UE) 2015/2447 | Procedury celne (szczegóły) |

> ⚠ Taryfy celne zmieniają się — weryfikuj zawsze przed powołaniem.

---

## 1. NOMENKLATURA SCALONA (CN) — KLASYFIKACJA TARYFOWA

### Struktura kodu CN (8 cyfr + 2 cyfry dla TARIC)

```
Rozdział 84 — Reaktory jądrowe, kotły, maszyny
  8471       — Maszyny do automatycznego przetw. danych
    8471 30  — Przenośne maszyny (laptop)
      8471 30 00 — Kod CN 8-cyfrowy
        8471 30 00 10 — Kod TARIC 10-cyfrowy (ceł preferencyjne, kontyngenty)
```

### Reguły klasyfikacji (Ogólne Reguły Interpretacyjne — ORI)

1. **ORI 1** — Tytuły działów, sekcji mają charakter orientacyjny; klasyfikacja wg not i tytułów pozycji
2. **ORI 2a** — Wyroby niekompletne klasyfikować jak kompletne, jeśli mają charakter wyrobu gotowego
3. **ORI 3** — Gdy możliwe dwie pozycje → ta bardziej szczegółowa; lub ta dająca najwyższe cło
4. **ORI 6** — Klasyfikacja podpozycji według ich treści i not do podpozycji

### Wiążąca Informacja Taryfowa (WIT)

- Wiążąca przez **3 lata** od wydania (art. 33 UCC)
- Wydaje: **Dyrektor Izby Administracji Skarbowej** właściwy dla wnioskodawcy
- Wniosek: formularz BTI w EBTI-3 (system TAXUD)
- Weryfikuj wydane WIT: https://taxation-customs.ec.europa.eu/

---

## 2. PROCEDURY CELNE (UCC art. 201–272)

| Procedura | Opis | Typowe zastosowanie |
|-----------|------|---------------------|
| **Dopuszczenie do obrotu** | Nadanie statusu celnego unijnego | Import standardowy |
| **Tranzyt (T1/T2)** | Przemieszczanie pod nadzorem celnym | Przewóz przez UE |
| **Skład celny** | Składowanie bez uiszczania cła | Magazyn buforowy |
| **Odprawa czasowa** | Tymczasowy wwóz z pełnym/częściowym zwolnieniem | Targi, naprawa |
| **Uszlachetnianie czynne** | Przetwarzanie towarów spoza UE → reeksport | Produkcja pod zamówienie |
| **Uszlachetnianie bierne** | Wwóz towarów UE za granicę → powrót | Naprawa, obróbka |
| **Powrotne wywiezienie** | Wywóz towarów nieunijnych ze składu | Korekta dostawy |

---

## 3. WARTOŚĆ CELNA

### Metody wyceny (art. 70–74 UCC) — hierarchia

```
Metoda 1 — Wartość transakcyjna (cena zapłacona/należna + korekty)
  ↓ jeśli niemożliwa
Metoda 2 — Wartość transakcyjna towarów identycznych
  ↓ jeśli niemożliwa
Metoda 3 — Wartość transakcyjna towarów podobnych
  ↓ jeśli niemożliwa
Metoda 4 — Metoda dedukcyjna (cena sprzedaży w UE minus marża)
  ↓ jeśli niemożliwa
Metoda 5 — Metoda kalkulacyjna (koszty produkcji + zysk)
  ↓ jeśli niemożliwa
Metoda 6 — Metoda ostateczna (elastyczne zastosowanie powyższych)
```

**Korekty do wartości transakcyjnej (dodawane do ceny CIF granica UE):**
- Koszty transportu do granicy UE
- Ubezpieczenie
- Prowizje zakupu (nie sprzedaży)
- Tantiemy i opłaty licencyjne

---

## 4. PREFERENCJE TARYFOWE I UMOWY FTA

### Główne umowy / systemy preferencyjne dla PL (jako państwa UE)

| System | Zakres |
|--------|--------|
| **GSP** (Ogólny System Preferencji) | Kraje rozwijające się → zerowe/obniżone cło |
| **GSP+** | Kraje spełniające normy pracy/środowiska |
| **EBA** (Everything But Arms) | Kraje najsłabiej rozwinięte |
| **CETA** (UE–Kanada) | Obustronnie zniesione/obniżone cła |
| **JEEPA** (UE–Japonia) | Obustronnie obniżone cła |
| **Strefy Wolnego Handlu UE** | Ukraina, Maroko, Gruzja, Mołdawia i in. |

**Reguły pochodzenia** — warunek korzystania z preferencji:
- Kumulacja (dwustronna / diagonalna / pełna)
- Obróbka wystarczająca (zmiana kodu CN, wartość dodana %)
- Dowód: świadectwo EUR.1, deklaracja na fakturze, REX (Registered Exporter)

---

## 5. ORGANY I ŚCIEŻKA ODWOŁAWCZA

```
Urząd Celno-Skarbowy (UCS)
  ↓ decyzja I instancji (cło, klasyfikacja taryfowa)
Dyrektor Izby Administracji Skarbowej (IAS)
  ↓ odwołanie (14 dni od doręczenia decyzji UCS)
Wojewódzki Sąd Administracyjny (WSA)
  ↓ skarga (30 dni od doręczenia decyzji IAS)
Naczelny Sąd Administracyjny (NSA)
  ↓ skarga kasacyjna (30 dni od doręczenia wyroku WSA)
```

**WIĄŻĄCA INFORMACJA TARYFOWA (WIT) — ścieżka:**
- Wniosek → Dyrektor IAS → decyzja WIT (90 dni) → wiążąca przez 3 lata

> Naruszenia celne (KKS), czynny żal, kwalifikator karny: `mod-ustawa-akcyzowa-i-clo-UCC.md` sekcja 6.

---

## 6. ŚCIEŻKA WERYFIKACJI ONLINE (obowiązkowa)

```
1. Sprawdź kod CN/TARIC:
   https://taxation-customs.ec.europa.eu/customs-4/calculation-customs-duties/customs-tariff/eu-customs-tariff-taric_en
   (TARIC online — pełna baza kodów CN z cłami i środkami)

2. Sprawdź wydane WIT:
   https://ec.europa.eu/taxation_customs/dds2/ebti/ebti_home.jsp

3. Sprawdź umowy FTA i zasady origin:
   https://taxation-customs.ec.europa.eu/customs-4/rules-origin/rules-origin-preferential-trade_en
```

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| Podatek akcyzowy, WIA, KKS, czynny żal | `mod-ustawa-akcyzowa-i-clo-UCC.md` |
| VAT przy imporcie | `mod-Q` (PIT/VAT/CIT) |
| Substancje chemiczne / REACH | `mod-AC` (REACH/chemikalia) |
| Pismo: odwołanie / skarga do WSA | `pisma-procesowe-v3` / `pisma-proste-v2` |

---

*mod-UCC-clo-taryfa-celna · v1.0 · 2026-06-14*
*Weryfikacja: taxation-customs.ec.europa.eu*

## ⚖️ DISCLAIMER

Po zakończeniu analizy: `view /mnt/skills/user/shared/DISCLAIMER.md` — wariant wg trybu (PRAWNIK/LAIK).
