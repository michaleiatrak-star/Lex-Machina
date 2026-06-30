# mod-ustawa-rynek-kapitalowy-fundusze

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Fundusze inwestycyjne — Dz.U. 2024 poz. 1034 t.j. ze zm. | Obrót instrumentami — Dz.U. 2023 poz. 646 t.j. ze zm. | Oferta publiczna — Dz.U. 2024 poz. 620 t.j. ze zm. | Obligacje — Dz.U. 2022 poz. 2218 t.j. ze zm.
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
| Ustawa o obligacjach | Dz.U. 2022 poz. 2218 t.j. ze zm. — weryfikuj | |

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
Prospekt emisyjny (Rozp. UE 2017/1129):
  → Obowiązkowy przy ofercie publicznej przekraczającej 2,5 mln EUR w 12 miesiącach
  → WYJĄTEK: oferta do < 150 osób lub < 1 mln EUR — bez prospektu
  → Zatwierdza: KNF lub właściwy organ UE

Zgromadzenie obligatariuszy (art. 46–51 ustawy o obligacjach — weryfikuj w ISAP):
  → Przy naruszeniu warunków emisji przez emitenta
  → Może: zmienić warunki, ustanowić administrora, wymagać wcześniejszego wykupu

Insider trading (art. 154 ustawy o obrocie — weryfikuj w ISAP):
  → Zakaz obrotu na podstawie informacji poufnej niepodanej do publicznej wiadomości
  → Sankcja: kara pieniężna KNF + odpowiedzialność karna
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
