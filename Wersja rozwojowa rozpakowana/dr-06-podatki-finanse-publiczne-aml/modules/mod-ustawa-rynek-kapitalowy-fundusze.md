# mod-ustawa-rynek-kapitalowy-fundusze

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Fundusze inwestycyjne — Dz.U. 2024 poz. 1034 t.j. ze zm. | Obrót instrumentami — Dz.U. 2023 poz. 646 t.j. ze zm. | Oferta publiczna — Dz.U. 2024 poz. 620 t.j. ze zm. | Obligacje — Dz.U. 2024 poz. 708 t.j. ze zm. (POPRAWKA 2026-07-02g: było błędnie 2022.2218)
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Fundusze inwestycyjne (FIO, SFIO, FIZ, ASI), TFI, rynek kapitałowy (GPW, Catalyst), obligacje korporacyjne i komunalne, obrót instrumentami finansowymi (MiFID II), oferta publiczna (prospekt emisyjny), insider trading, AIFMD II (implementacja 2024).

### Akty

| Akt | Dz.U. | Uwaga |
|---|---|---|
| Ustawa o funduszach inwestycyjnych | Dz.U. 2024 poz. 1034 t.j. ze zm. | AIFMD II — implementacja 2024 |
| Ustawa o obrocie instrumentami finansowymi | Dz.U. 2023 poz. 646 t.j. ze zm. — weryfikuj | MiFID II |
| Ustawa o ofercie publicznej | Dz.U. 2024 poz. 620 t.j. ze zm. — weryfikuj | Rozp. Prospektowy UE 2017/1129 |
| Ustawa o obligacjach | Dz.U. 2024 poz. 708 t.j. ze zm. (POPRAWKA 2026-07-02g) | zastępuje nieaktualny 2022.2218 |

---

## 2. FUNDUSZE INWESTYCYJNE — TYPY

```
FIO (Fundusz Inwestycyjny Otwarty):
  → Zbywanie i odkupywanie jednostek na żądanie (płynność codzienna)
  → Głównie UCITS — rynek masowy; nadzór KNF

SFIO (Specjalistyczny FIO):
  → Ograniczony krąg uczestników (np. pracownicy, klienci kwalifikowani)

FIZ (Fundusz Inwestycyjny Zamknięty):
  → Emituje certyfikaty inwestycyjne (giełda lub rynek niepubliczny)
  → Używany w PE, real estate, sekurytyzacji

ASI (Alternatywna Spółka Inwestycyjna):
  → Uproszczona forma dla niemasowych inwestorów (PE, VC)
  → Po AIFMD II: wyższe wymogi raportowe, ESG (SFDR)
```

---

## 3. OBLIGACJE KORPORACYJNE — ZASADY ABSOLUTNE

```
⚠️⚠️ POPRAWIONE 2026-08-12 (na żądanie użytkownika) — POPRZEDNIA
  wersja tej sekcji BYŁA ZNACZĄCO UPROSZCZONA/NIEDOKŁADNA (twierdziła
  "próg 2,5 mln EUR + wyjątek <150 osób LUB <1 mln EUR" — TO NIE
  ODDAWAŁO rzeczywistej, WIELOPOZIOMOWEJ struktury progów)

⭐⭐⭐ RZECZYWISTA, WIELOPOZIOMOWA STRUKTURA (Rozporządzenie Prospektowe
  UE 2017/1129 + ustawa o ofercie publicznej, art. 3/37a/37b):
  → PONIŻEJ 1 MLN EUR (łącznie z ofertami z OSTATNICH 12 miesięcy):
    Rozporządzenie UE W OGÓLE NIE MA zastosowania (art. 1 ust. 3) —
    ANI prospekt, ANI unijny wymóg dokumentu — ⭐ ALE Polska
    SKORZYSTAŁA z opcji narodowej: DLA ofert 100 000-1 000 000 EUR
    WYMAGANY jest UPROSZCZONY "dokument informacyjny" (art. 37a
    ustawy o ofercie) — NIE prospekt, NIE memorandum — LŻEJSZY
    dokument z podstawowymi informacjami o emitencie/papierach
  → 1 MLN — do progu KRAJOWEGO (⚠️ patrz "REFORMA 2026" niżej):
    WYMAGANE memorandum INFORMACYJNE (art. 37b) — OBSZERNIEJSZY
    dokument NIŻ art. 37a, ALE NADAL NIE pełny prospekt
  → POWYŻEJ progu krajowego: PEŁNY PROSPEKT wymagany, ZATWIERDZANY
    przez KNF lub właściwy organ UE

⭐⭐ WYJĄTEK "150 OSÓB" — NIEZALEŻNY od WARTOŚCI oferty: JEŚLI oferta
  SKIEROWANA jest DO MNIEJ niż 150 ADRESATÓW (Z WYŁĄCZENIEM
  inwestorów KWALIFIKOWANYCH) — ANI prospekt, ANI memorandum, ANI
  dokument art. 37a NIE SĄ wymagane, NIEZALEŻNIE OD wartości oferty
  — ⚠️ WAŻNE zastrzeżenie: PRZY KOLEJNYCH ofertach W OKRESIE 12
  miesięcy NALEŻY SUMOWAĆ łączną LICZBĘ adresatów — JEŚLI PRZEKROCZY
  149 osób ŁĄCZNIE, powstaje OBOWIĄZEK publikacji memorandum
  — ⭐ JEDYNY BEZWZGLĘDNY wyjątek: oferta DO JEDNEGO inwestora NIGDY
  nie jest "ofertą PUBLICZNĄ" w ogóle

⭐⭐⭐ ⚡ REFORMA 2026 — "LISTING ACT" (BARDZO ŚWIEŻA, weszła W ŻYCIE
  **5 CZERWCA 2026 R.**, ok. 2 MIESIĄCE przed tą weryfikacją):
  → CEL: UJEDNOLICENIE dotychczasowej, DWUPOZIOMOWEJ struktury
    (dokument informacyjny + memorandum) W JEDEN, PROSTSZY próg
  → NOWY art. 3 ust. 2 lit. b Rozporządzenia Prospektowego: UNIJNY
    pułap PODNIESIONY do **12 MLN EUR** (znacząco WYŻEJ niż
    wcześniejszy, NIŻSZY unijny domyślny próg)
  → ⚠️ PAŃSTWA członkowskie MOGĄ jednak ZAOSTRZYĆ ten unijny pułap —
    Polska ROZWAŻAŁA (wg doniesień z PARP) OGRANICZENIE do **PONIŻEJ
    5 MLN EUR** na EMITENTA/oferującego w OKRESIE 12 miesięcy — ⚠️⚠️
    NIE ZWERYFIKOWANO W TEJ SESJI, czy TA konkretna wartość (5 mln
    EUR) ZOSTAŁA już OSTATECZNIE WDROŻONA W polskiej ustawie o
    ofercie, CZY POZOSTAJE jeszcze na etapie PROJEKTU/ROZWAŻAŃ UKNF
    — SPRAWDŹ AKTUALNY stan WDROŻENIA przed cytowaniem KONKRETNEGO
    progu w sprawie
  → PRAKTYCZNY SKUTEK docelowy: PONIŻEJ nowego, JEDNOLITEGO progu —
    WYSTARCZY JEDEN, ujednolicony dokument INFORMACYJNY (zamiast
    obecnego rozróżnienia dokument/memorandum), BEZ obowiązku
    ZATWIERDzania przez KNF

Zgromadzenie obligatariuszy (art. 46–51 ustawy o obligacjach — weryfikuj w ISAP):
  → Przy naruszeniu warunków emisji przez emitenta
  → Może: zmienić warunki, ustanowić administrora, wymagać wcześniejszego wykupu

Insider trading (art. 154 ustawy o obrocie — weryfikuj w ISAP):
  → Zakaz obrotu na podstawie informacji poufnej niepodanej do publicznej wiadomości
  → Sankcja: kara pieniężna KNF + odpowiedzialność karna

Potwierdzone w 7+ zgodnych źródeł, w tym BEZPOŚREDNIO KNF (Rząd 1,
Q&A "Oferty publiczne o wartości poniżej 5.000.000 euro") oraz PARP
[×2, z omówieniem reformy Listing Act i DOKŁADNĄ datą 5.06.2026],
seg.org.pl [Stowarzyszenie Emitentów Giełdowych, ×2], ck-legal.pl,
prawainwestora.pl.
```

---

## 4. QUALITY GATE / OUTPUT

**Quality gate:** Aktualne Dz.U. zweryfikowane? AIFMD II (transpozycja 2024) uwzględniona? Wymogi ESG (SFDR) sprawdzone?

**Output:** Kwalifikacja (typ funduszu / instrument) → wymogi regulacyjne → nadzór KNF → ryzyka → rekomendacja.

**Powiązania:** `mod-prawo-bankowe-KNF-BFG` | `mod-ustawa-AML-instytucje-obowiazkowe` | `dr-11` → `mod-AI-Act-framework`

**Źródła:**
- Fundusze: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20241034
- KNF (nadzór): https://knf.gov.pl
- ESMA (regulacje UE): https://www.esma.europa.eu
