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
  `dr-06-podatki-finanse-publiczne-aml/modules/mod-VAT-import-towarow-i-zwolnienia-importowe.md` (VAT importowy), `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-REACH-CLP-chemikalia.md` (REACH/CLP).
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

## 2a. ⭐⭐⭐ DŁUG CELNY — POWIADOMIENIE, PRZEDAWNIENIE, PŁATNOŚĆ
(dodano 2026-08-12, na żądanie użytkownika — DOTĄD tylko
WZMIANKOWANY w zakresie modułu, BEZ konkretnej treści)

```
⭐⭐⭐ TERMIN POWIADOMIENIA DŁUŻNIKA (art. 103 UCC) — PODSTAWOWY:
  → O DŁUGU CELNYM NIE POWIADAMIA SIĘ dłużnika PO UPŁYWIE **3 LAT**
    OD dnia POWSTANIA długu celnego — PO tym terminie dług NIE MOŻE
    już zostać SKUTECZNIE zakomunikowany

⭐⭐ WYDŁUŻONY termin — DŁUG POWSTAŁY W ZWIĄZKU Z CZYNEM KARALNYM: JEŻELI
  dług celny POWSTAŁ W WYNIKU czynu, KTÓRY W CZASIE popełnienia
  PODLEGAŁ sądowemu postępowaniu KARNEMU — 3-letni okres
  PRZEDŁUŻA SIĘ (zgodnie Z prawem KRAJOWYM danego państwa
  członkowskiego): MINIMALNIE do **5 LAT**, MAKSYMALNIE do
  **10 LAT** — ⚠️ POLSKA implementacja TEGO przedziału (KONKRETNY
  wybrany termin W polskim prawie) NIE zweryfikowana W tej sesji —
  sprawdź AKTUALNE przepisy krajowe PRZED cytowaniem KONKRETNEJ
  liczby lat W sprawie związanej Z przestępstwem

⭐⭐ ZAWIESZENIE biegu TERMINU — DWA przypadki:
  a) ZŁOŻENIE ODWOŁANIA (art. 44 UCC) — zawieszenie OBOWIĄZUJE OD
     daty złożenia ODWOŁANIA PRZEZ CAŁY okres trwania postępowania
     odwoławczego
  b) ORGANY CELNE poinformowały dłużnika (art. 22 ust. 6 UCC) O
     przyczynach, DLA których ZAMIERZAJĄ powiadomić O długu celnym
     — zawieszenie OD daty tego POWIADOMIENIA DO końca okresu, W
     KTÓRYM dłużnik MA możliwość PRZEDSTAWIENIA swojego punktu
     widzenia

⭐⭐⭐ TERMIN ZAPŁATY (art. 108 UCC) — PO powiadomieniu O długu:
  → **10 DNI** OD daty powiadomienia dłużnika O długu celnym
  → ⭐ SZCZEGÓLNY przypadek: GDY kwota NALEŻNOŚCI odpowiada KWOCIE
    WPISANEJ do zgłoszenia CELNEGO — SAMO zwolnienie TOWARÓW przez
    organ CELNY jest RÓWNOZNACZNE z powiadomieniem dłużnika O długu
    celnym (termin 10 DNI liczy się WIĘC OD dnia zwolnienia
    TOWARÓW, NIE od odrębnej decyzji)
  → W INNYCH przypadkach: organ CELNY wydaje ODRĘBNĄ decyzję
    określającą NALEŻNĄ kwotę
  → ⚠️ ODRĘBNY, DŁUŻSZY termin dotyczy SAMEGO zaksięgowania
    (rejestracji KSIĘGOWEJ) należności PRZEZ organ celny — **14
    DNI** (NIE MYLIĆ z 10-dniowym terminem ZAPŁATY przez dłużnika —
    TO DWA różne, NIEZALEŻNE terminy, dotyczące różnych CZYNNOŚCI)

⭐ MOŻLIWOŚĆ PRZEDŁUŻENIA terminu ZAPŁATY: organy CELNE, NA WNIOSEK
  dłużnika, MOGĄ przedłużyć TERMIN — SZCZEGÓLNIE gdy NALEŻNA kwota
  została OKREŚLONA W TOKU kontroli PO zwolnieniu towarów

Potwierdzone w 6+ zgodnych źródeł, w tym BEZPOŚREDNIO dosłowny
tekst art. 103/108 UCC (lexlege.pl) oraz orzecznictwo TSUE (sprawa
C-39/20, dot. WYKŁADNI art. 103 ust. 1 i 3 lit. b UCC — zawieszenie
terminu, stosowanie W CZASIE przepisów regulujących PRZYCZYNY
zawieszenia).
```

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
- Wniosek → Dyrektor KIS (Krajowej Informacji Skarbowej — ⚠️ ZMIANA
  ORGANU od 1.07.2023, wcześniej Dyrektor IAS Warszawa) → decyzja WIT
  (⚠️ POPRAWKA 2026-07-27, FAZA 3E/ZASADA 14: **120 DNI**, nie 90 —
  potwierdzone jednogłośnie w 7+ źródłach, w tym biznes.gov.pl i KIS;
  termin liczony od PRZYJĘCIA KOMPLETNEGO wniosku, może się wydłużyć o
  dodatkowe max 30 dni przy brakach formalnych) → wiążąca przez 3 lata,
  na całym obszarze celnym UE. Odwołanie: 14 dni od doręczenia, do
  Dyrektora KIS przez PUESC (elektronicznie, plik PDF)

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
| VAT przy imporcie | `dr-06-podatki-finanse-publiczne-aml/modules/mod-VAT-import-towarow-i-zwolnienia-importowe.md` |
| Substancje chemiczne / REACH | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-REACH-CLP-chemikalia.md` |
| Pismo: odwołanie / skarga do WSA | `pisma-procesowe-v3` / `pisma-proste-v2` |

---

*mod-UCC-clo-taryfa-celna · v1.0 · 2026-06-14*
*Weryfikacja: taxation-customs.ec.europa.eu*

## ⚖️ DISCLAIMER

Po zakończeniu analizy: `view shared/DISCLAIMER.md` — wariant wg trybu (PRAWNIK/LAIK).
