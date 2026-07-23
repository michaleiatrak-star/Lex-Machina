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

## 4. PODATEK MINIMALNY (art. 24ca CIT) — POPRAWIONE I ROZBUDOWANE 2026-07-19

```
⚠️ Weryfikuj aktualne przepisy — art. 24ca był modyfikowany

⭐ KOREKTA BŁĘDU: STAWKA PODATKU MINIMALNEGO WYNOSI 10% podstawy
opodatkowania — NIE 1,5%. Wartość "1,5% przychodów" to tylko JEDEN z
TRZECH składników sumowanych przy obliczaniu SAMEJ PODSTAWY (patrz
niżej) — nie należy jej mylić ze stawką podatku.

HISTORIA: przepis miał obowiązywać od 2022 r. (Polski Ład), ale jego
  stosowanie ZAWIESZONO na 2 lata (2022-2023) — PIERWSZYM rokiem
  faktycznego obowiązku zapłaty jest ROK PODATKOWY ROZPOCZYNAJĄCY SIĘ
  PO 31.12.2023 r. (czyli w praktyce po raz pierwszy rozliczany w
  deklaracjach składanych w 2025 r. za rok 2024)

KTO PODLEGA (art. 24ca ust. 1) — spółki (i podatkowe grupy kapitałowe)
  będące podatnikami CIT od CAŁOŚCI dochodów, które w danym roku:
  □ PONIOSŁY STRATĘ ze źródła przychodów INNYCH niż zyski kapitałowe,
    ALBO
  □ Osiągnęły UDZIAŁ DOCHODÓW w przychodach (z działalności operacyjnej)
    NIE WYŻSZY niż 2%

STAWKA: 10% podstawy opodatkowania (⭐ POPRAWIONE — nie 1,5%)

PODSTAWA OPODATKOWANIA — DWIE ALTERNATYWNE METODY (podatnik WYBIERA):
  METODA 1 (art. 24ca ust. 3) — suma TRZECH składników:
    1) 1,5% wartości PRZYCHODÓW (innych niż zyski kapitałowe)
    2) Koszty FINANSOWANIA DŁUŻNEGO na rzecz podmiotów powiązanych,
       w części przewyższającej określony we wzorze próg
    3) Koszty USŁUG/OPŁAT za korzystanie z wartości niematerialnych/
       prawnych lub przeniesienia ryzyka niewypłacalności pożyczek,
       poniesione na rzecz podmiotów powiązanych
  METODA 2 (art. 24ca ust. 3a) — UPROSZCZONA, alternatywna formuła
    (⚠️ dokładny wzór niepotwierdzony w pełni w tej sesji)

MECHANIZM ROZLICZENIA (art. 24ca ust. 12) — ZAPOBIEGANIE PODWÓJNEMU
  OPODATKOWANIU: jeśli oprócz podatku minimalnego wystąpi RÓWNIEŻ
  "zwykły" CIT (na zasadach ogólnych) — kwotę podatku MINIMALNEGO
  podlegającą wpłacie POMNIEJSZA SIĘ o należny za ten sam rok "zwykły"
  CIT
  □ BRAK obowiązku wpłacania miesięcznych ZALICZEK na podatek minimalny
    — rozliczenie następuje JEDNORAZOWO w deklaracji rocznej

WYŁĄCZENIA (katalog w art. 24ca ust. 14, NIE zamknięty w tym module —
  weryfikuj pełną listę na ISAP), obejmujące m.in.:
  □ Mali podatnicy (przychód ≤ 2 mln EUR)
  □ Podatnicy w PIERWSZYCH 3 latach działalności
  □ Przedsiębiorcy ROLNI
  □ Grupy VAT
  □ Podatnicy, których UDZIAŁ dochodów w przychodach w JEDNYM z 3 lat
    PODATKOWYCH poprzedzających rok podatku minimalnego wyniósł CO
    NAJMNIEJ 2% (potwierdzone interpretacją KIS 0114-KDIP2-2.4010.247.
    2024.1.ASK — wystarczy osiągnięcie progu w JEDNYM z trzech
    poprzednich lat, nie w KAŻDYM)
  □ Spółka w LIKWIDACJI, która poniosła stratę (interpretacja KIS
    0111-KDIB1-1.4010.588.2024.1.MF)

web_search: "podatek minimalny CIT art 24ca 2026 wyłączenia stawka"
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

## 5a. ⭐ PODATEK U ŹRÓDŁA (WHT) — MECHANIZM PAY AND REFUND — dodane 2026-07-19

> Odpowiedź na audyt pokrycia prawa podatkowego — dotąd tylko przelotna
> wzmianka przy definicji "rzeczywistego właściciela".

```
PRZEDMIOT: dywidendy, odsetki, należności licencyjne oraz niektóre
  usługi niematerialne wypłacane PODMIOTOM ZAGRANICZNYM (nierezydentom)
STAWKI USTAWOWE (art. 21-22 CIT): 19% (dywidendy) lub 20% (odsetki,
  należności licencyjne, wybrane usługi niematerialne) — ⚠️ zweryfikuj
  aktualne stawki i katalog na ISAP

⭐⭐ MECHANIZM "PAY AND REFUND" (art. 26 ust. 2e CIT) — KLUCZOWY dla
praktyki od 2022 r.:
  □ URUCHAMIA SIĘ, gdy ŁĄCZNA wartość wypłat (dywidendy + odsetki +
    należności licencyjne ŁĄCZNIE) na rzecz TEGO SAMEGO zagranicznego
    PODMIOTU POWIĄZANEGO przekroczy w roku podatkowym płatnika PRÓG
    2 MLN ZŁ
  □ SKUTEK: płatnik MUSI pobrać podatek wg PEŁNEJ stawki USTAWOWEJ
    (19%/20%) OD NADWYŻKI ponad 2 mln zł — NIEZALEŻNIE od tego, czy
    przysługuje preferencja z umowy o unikaniu podwójnego opodatkowania
    (UPO) lub zwolnienia z CIT — to etap "PAY"
  □ Odbiorca (lub płatnik) MOŻE następnie wystąpić o ZWROT nadpłaty,
    jeśli preferencja faktycznie przysługiwała — etap "REFUND"

DWA SPOSOBY UNIKNIĘCIA obowiązkowego poboru pełnej stawki (mimo
  przekroczenia progu 2 mln zł):
  1) OPINIA O STOSOWANIU PREFERENCJI — wydawana przez organ podatkowy,
     WAŻNA przez 36 MIESIĘCY (o ile brak istotnych zmian stanu
     faktycznego) — WYMAGA złożenia wniosku z dokumentacją (przepisy
     NIE precyzują dokładnie jaką — proces bywa złożony/długotrwały)
  2) OŚWIADCZENIE WH-OSC (dla CIT) / WH-OSP (dla PIT) — składane
     ELEKTRONICZNIE przez ZARZĄD płatnika, potwierdzające że:
     (a) płatnik POSIADA dokumenty wymagane do zastosowania preferencji,
     (b) po WERYFIKACJI nie ma wiedzy o okolicznościach WYKLUCZAJĄCYCH
         zastosowanie preferencji
     TERMIN złożenia: NIE PÓŹNIEJ niż OSTATNIEGO DNIA DRUGIEGO miesiąca
     po miesiącu przekroczenia progu 2 mln zł — złożenie PO dokonaniu
     wypłaty NIE ZWALNIA z obowiązku dochowania należytej staranności

NALEŻYTA STARANNOŚ�Ć — WYMÓG WERYFIKACYJNY niezależny od progu 2 mln zł:
  płatnik ZAWSZE musi zweryfikować warunki zastosowania preferencji
  (rzeczywisty właściciel, certyfikat rezydencji, substancja biznesowa
  odbiorcy) — również przy wypłatach PONIŻEJ progu

SANKCJE za nieprawidłowe niepobranie WHT:
  □ Obowiązek zapłaty PODSTAWOWEJ stawki (19%/20%) + ODSETKI za zwłokę
  □ DODATKOWE zobowiązanie podatkowe z Ordynacji podatkowej — 10%
    WARTOŚCI BRUTTO należności podlegających WHT
  □ MOŻLIWA odpowiedzialność KARNA SKARBOWA osób indywidualnych
    odpowiedzialnych za rozliczenie WHT (patrz DR-03, ustawa KKS)

REKOMENDACJA PRAKTYCZNA: płatnik WHT powinien wdrożyć WEWNĘTRZNĄ
  PROCEDURĘ weryfikacji warunków każdej płatności (dokumentacyjną) i
  PRZYPISAĆ odpowiedzialność konkretnym pracownikom — istotne przy
  ewentualnej obronie przed sankcjami (wykazanie należytej staranności
  jako procesu, nie jednorazowej czynności)

Checklist praktyczny:
□ Czy odbiorca jest PODMIOTEM POWIĄZANYM i czy łączna wartość wypłat
  na jego rzecz w roku podatkowym PRZEKROCZYŁA 2 mln zł — jeśli TAK,
  mechanizm pay and refund się AKTUALIZUJE dla NADWYŻKI
□ Czy płatnik POSIADA ważną OPINIĘ o stosowaniu preferencji (sprawdź
  DATĘ WYDANIA — ważność tylko 36 miesięcy) LUB złożył WH-OSC/WH-OSP w
  TERMINIE
□ Czy przeprowadzono i UDOKUMENTOWANO weryfikację należytej staranności
  (certyfikat rezydencji, rzeczywisty właściciel, substancja biznesowa)
  — NIEZALEŻNIE od tego, czy próg 2 mln zł został przekroczony
□ Czy wewnętrzna procedura WHT jest WDROŻONA i przypisana konkretnym
  osobom — istotne dla obrony przed sankcją 10% i odpowiedzialnością
  karną skarbową

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
