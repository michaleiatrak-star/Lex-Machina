# mod-CIT-podatek-dochodowy-prawne

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** CIT — Dz.U. **2026 poz. 554** t.j. (Obwieszczenie Marszałka Sejmu z 27 marca 2026 r., stan prawny na dzień 18 marca 2026 r.)
**Data weryfikacji online:** 2026-06-07
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
**⚠️ Stawki, progi, warunki — weryfikuj aktualne wartości przez web_search**

---

## 1. CORE

### Zakres
CIT — podatek dochodowy od osób prawnych, estoński CIT, podatek minimalny (od 2024), ceny transferowe (TP), cienka kapitalizacja, odpisy amortyzacyjne, koszty uzyskania przychodu, CFC (kontrolowane spółki zagraniczne).

### Akt

| Akt | Dz.U. |
|---|---|
| Ustawa o CIT | Dz.U. **2026 poz. 554** t.j. |

---

## 2. INTAKE

```
□ Rok podatkowy i forma organizacyjna (sp. z o.o. / S.A. / spółka osobowa)?
□ Spór z organem czy optymalizacja / compliance?
□ Data decyzji → termin 14 dni na odwołanie!
□ Czy zastosowano estoński CIT? Jakie warunki spełnione?
□ Czy grozi podatek minimalny?
□ Czy są transakcje z podmiotami powiązanymi (TP)?
□ Czy organ powołał GAAR lub klauzulę TP?
```

---

## 3. STAWKI I FORMY OPODATKOWANIA

```
19%: Stawka standardowa
9%:  Mali podatnicy (przychód ≤ 2 mln EUR) i podatnicy w pierwszym roku
     ⚠️ Weryfikuj aktualny próg 2 mln EUR w ustawie
Estoński CIT (ryczałt od dochodów spółek):
     Brak podatku do momentu dystrybucji zysku
     Warunki wstępne — weryfikuj aktualnie w art. 28j i n. CIT
web_search: "estoński CIT warunki 2025 2026 stawka weryfikacja"
```

---

## 4. PODATEK MINIMALNY (art. 24ca CIT — od 01.01.2024 r.)

```
⚠️ Weryfikuj aktualne przepisy — art. 24ca był modyfikowany

Kto: Spółki z zerowym lub ujemnym dochodem LUB marżą < 2% przychodów
Stawka: 1,5% od podstawy
  Podstawa uproszczona: 1,5% przychodów
  Podstawa rozbudowana: 1,5% × (przychody − koszty z wyłączeniami)

Wyłączenia (weryfikuj aktualne w ISAP):
  → Mali podatnicy (przychód ≤ 2 mln EUR)
  → Podatnicy w pierwszym 3 latach
  → Przedsiębiorcy rolni
  → Grupy VAT
  → i inne — weryfikuj pełny katalog w art. 24ca ust. 14 CIT

web_search: "podatek minimalny CIT art 24ca 2025 2026 wyłączenia stawka"
```

---

## 5. CENY TRANSFEROWE (art. 11a–11t CIT)

```
OBOWIĄZEK DOKUMENTACJI gdy transakcje z podmiotami powiązanymi przekraczają:
  Transakcje krajowe: ≥ 10 mln PLN
  Transakcje zagraniczne: ≥ 10 mln PLN
  Pożyczka/gwarancja: ≥ 20 mln PLN
  ⚠️ Weryfikuj aktualne progi w ISAP

DOKUMENTACJA:
  Local file (dokumentacja lokalna)
  Master file (przy grupach > 200 mln EUR przychodów konsolidowanych)
  TPR (raport do US o cenach transferowych) — termin jak zeznanie CIT

Korekta ceny transferowej:
  → Organ może zakwestionować ceny i doszacować dochód
  → Obrona: dokumentacja TP + zasada ceny rynkowej (arm's length)
```

---

## 6. CIENKA KAPITALIZACJA (art. 15c CIT)

```
Limit kosztów finansowania dłużnego:
  30% EBITDA (wynik z działalności + amortyzacja)
  lub
  3 mln PLN — wartość bezpieczna (bez ograniczeń do tej kwoty)

  Koszty powyżej limitu: nie stanowią KUP w danym roku
  Możliwość rozliczenia nadwyżki w 5 kolejnych latach

⚠️ Weryfikuj aktualny art. 15c CIT w ISAP — przepis był zmieniany.
```

---

## 7. ESTOŃSKI CIT — WARUNKI (weryfikuj aktualnie!)

```
Warunki do spełnienia łącznie (art. 28j CIT — weryfikuj w ISAP):
  □ Brak udziałów w innych spółkach
  □ Zatrudnienie co najmniej 3 pracowników (lub kontrakt B2B z 3 osobami)
  □ Przychody pasywne < 50% przychodów ogółem
  □ Prosta struktura właścicielska (tylko osoby fizyczne)
  □ Złożenie zawiadomienia do US o wyborze estońskiego CIT

Opodatkowanie: wyłącznie przy dystrybucji (dywidenda, nagroda, zaliczka)
Stawki: 10% (mały podatnik) / 20% (pozostali) — weryfikuj aktualne!
Efektywna stawka przy wypłacie + PIT: ok. 20% / 25% — weryfikuj

INTERPRETACJA OGÓLNA MF DD8.8203.1.2023 z 25.01.2024:
  → Przejście na estoński CIT możliwe w trakcie roku (nie tylko od 1 stycznia)
  → Wymagane: zamknięcie ksiąg + zawiadomienie + SF w 3 miesiące
  → Weryfikuj: web_search "DD8.8203.1.2023 estoński CIT przejście w trakcie roku"

⚠️ PUŁAPKA — ZYSK NA KAPITALE ZAPASOWYM (KIS 0111-KDIB2-1.4010.342.2021):
  → Zysk przekazany na kapitał zapasowy w czasie estońskiego CIT podlega CIT
    przy rezygnacji z estońskiego opodatkowania
  → Weryfikuj: web_search "zysk kapitał zapasowy estoński CIT rezygnacja KIS"

⚠️ UKRYTY ZYSK (art. 28m ust. 3 CIT):
  → Transakcje z podmiotami powiązanymi na warunkach nierynkowych = dystrybucja
  → Linia KIS: kara umowna za pijanego pracownika = ukryty zysk!
  → Weryfikuj: web_search "ukryty zysk estoński CIT definicja KIS 2024 2025"

web_search: "estoński CIT 2025 2026 stawka warunki wybór MF"
```

> Pełne zestawienie definicji estońskiego CIT, IP Box (CIT), MDR, PKWiU 2025:
> ```
> view /mnt/skills/user/dr-06-podatki-finanse-publiczne-aml/modules/mod-interpretacje-definicje-podatkowe.md
> ```

---

## 8. QUALITY GATE / OUTPUT

**Quality gate:** Rok podatkowy? Stawka zweryfikowana (nie z pamięci)? Podatek minimalny obliczony? TP dokumentacja kompletna? Aktualne brzmienie z ISAP?

**Output:** Kwalifikacja → stawka → estoński / standardowy → podatek minimalny (tak/nie) → TP → koszty → zeznanie CIT → spór (termin 14 dni).

**Powiązania:** `mod-OP-ordynacja-podatkowa` | `mod-KAS-kontrola-celno-skarbowa` | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000554

---

## ANEKS — AMORTYZACJA I KOSZTY UZYSKANIA PRZYCHODU

### Amortyzacja środków trwałych (art. 16a–16m CIT — weryfikuj w ISAP)

```
Środek trwały: wartość > 10 000 zł (weryfikuj aktualny próg w ISAP)

Metody amortyzacji:
  Liniowa: stałe odpisy wg stawek z załącznika do ustawy CIT
  Degresywna: 2× stawka liniowa do momentu zrównania z liniową (środki ruchome)
  Jednorazowa: małe przedsiębiorstwa do limitu 50 000 EUR rocznie (weryfikuj aktualny limit)
  Indywidualna: dla używanych / ulepszonych środków trwałych

⚠️ Nieruchomości: amortyzacja budynków mieszkalnych ZAWIESZONA (weryfikuj aktualny stan)
web_search: "amortyzacja nieruchomości mieszkalnych CIT zakaz 2025 2026"
```

### Koszty uzyskania przychodu (art. 15 CIT)

```
ZASADA: Koszt musi być poniesiony w celu uzyskania przychodu lub zachowania/zabezpieczenia
        jego źródła oraz nie może być wymieniony w art. 16 CIT (katalog wydatków niestanowiących KUP)

Typowe wyłączenia z KUP (art. 16 CIT — weryfikuj w ISAP):
  → Kary umowne z określonych tytułów (weryfikuj katalog)
  → Koszty reprezentacji (np. alkohol na spotkaniach, drogie restauracje)
  → Darowizny (z wyjątkami)
  → Wierzytelności przedawnione
  → Odsetki po terminie wymagalności (do wpłaty)
  → Przekroczenie limitu cienkiej kapitalizacji
```
