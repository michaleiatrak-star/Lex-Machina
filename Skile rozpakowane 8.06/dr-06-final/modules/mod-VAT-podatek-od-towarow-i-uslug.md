# mod-VAT-podatek-od-towarow-i-uslug

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** VAT — Dz.U. 2025 poz. 775 t.j. z 21.05.2025 (poprzedni t.j.: Dz.U. 2024 poz. 361)
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## ⚡ ALERT — KSeF OBOWIĄZKOWY OD 2026

```
KSeF (Krajowy System e-Faktur) — HARMONOGRAM WDROŻENIA:
  01.02.2026: obowiązkowy dla firm z obrotem > 200 mln zł w 2025 r.
  01.04.2026: obowiązkowy dla pozostałych podatników VAT (JDG, MŚP)
  01.01.2027: dla najmniejszych firm (sprzedaż fakturami ≤ 10 tys. zł/mies.)

  UWAGA: Odbiór faktur przez KSeF obowiązkowy dla wszystkich od 01.02.2026 r.
  (nawet jeśli dana firma jeszcze nie wystawia w KSeF)

  Certyfikat wystawcy faktury: dostępny od 01.11.2025 (ważny 2 lata)
  Tryb offline (awaryjny): umożliwia wystawienie poza systemem + przesłanie do następnego dnia roboczego

  Podstawa: Ustawa z 5.08.2025 r. o KSeF — weryfikuj w ISAP
  web_search: "KSeF obowiązkowy termin 2026 ustawa Dz.U. 2025 MF aktualna"
```

---

## 1. CORE

### Zakres
VAT — podatek od towarów i usług, rejestracja, odliczenie VAT naliczonego, zwrot VAT, JPK_V7M/K, split payment (MPP), WIS (wiążąca informacja stawkowa), biała lista podatników VAT, solidarna odpowiedzialność nabywcy, KSeF.

### Akt

| Akt | Dz.U. |
|---|---|
| Ustawa o VAT | Dz.U. 2025 poz. 775 t.j. z 21.05.2025 |

---

## 2. INTAKE

```
□ Jaki problem: odmowa odliczenia / nieuzasadniony zwrot / rejestracja / stawka / KSeF?
□ Rok podatkowy i okres rozliczeniowy?
□ Czy spór z organem (decyzja US) czy optymalizacja?
□ Data decyzji → termin 14 dni!
□ Czy operator KSeF jest wdrożony? (dla firm od 01.02.2026 lub 01.04.2026)
□ Czy split payment był stosowany dla transakcji z zał. 15?
□ Czy kontrahent figuruje na białej liście w dacie transakcji?
```

---

## 3. STAWKI VAT (ORIENTACYJNE — weryfikuj aktualnie!)

```
⚠️ Stawki zmieniane ustawami i rozporządzeniami — weryfikuj przed podaniem:
web_search: "stawki VAT 2025 2026 tabela Polska"

23%: Stawka podstawowa (co do zasady)
8%:  Usługi budowlane, gastronomia (do weryfikacji), leki gotowe, niektóre towary spożywcze
5%:  Żywność nieprzetworzona, książki, e-publikacje, produkty dla dzieci
0%:  Eksport towarów, WDT (wewnątrzwspólnotowa dostawa towarów)
ZW:  Zwolnione: usługi finansowe, ubezpieczeniowe, edukacyjne, opieka medyczna (weryfikuj zakres)
```

---

## 4. KLUCZOWE MECHANIZMY VAT

### Odliczenie VAT naliczonego (art. 86 ustawy)

```
ZASADA: VAT naliczony odlicza się gdy zakup związany ze sprzedażą opodatkowaną

Odmowa odliczenia — typowe zarzuty organu:
  → Brak dobrej wiary (uczestnictwo w karuzeli VAT — nawet nieświadome)
  → Zakup od podmiotu nieistniejącego / pustego
  → Niezachowanie należytej staranności (brak weryfikacji kontrahenta)

OBRONA:
  → Dowód weryfikacji kontrahenta (biała lista, KRS, VAT-R)
  → Rzeczywistość transakcji (dokumenty odbioru, WZ, CMR, zapłata)
  → Dobra wiara — dołożono wszelkiej staranności
  → Orzecznictwo TSUE: wiedza lub możliwość wiedzy o oszustwie VAT

web_search: "dobra wiara odliczenie VAT TSUE NSA orzecznictwo 2025"
```

### Split payment (MPP) — mechanizm podzielonej płatności

```
OBOWIĄZKOWY przy fakturach:
  → Wartość > 15 000 PLN brutto ORAZ
  → Towar/usługa z załącznika 15 do ustawy VAT
  → ⚠️ Weryfikuj aktualny zał. 15 w ISAP — katalog uzupełniany

Konto VAT (rachunek VAT):
  → Środki zablokowane — można przeznaczyć wyłącznie na VAT/ZUS/CIT/akcyzę
  → Wniosek o uwolnienie: do US w 60 dniach

Naruszenie MPP: sankcja 100% podatku (art. 108a ust. 7 VAT) — weryfikuj w ISAP
```

### Zwrot VAT — terminy

```
60 dni: Podstawowy termin od złożenia deklaracji (art. 87 ust. 2 VAT)
25 dni: Przyspieszony (płatność na rachunek VAT + warunki — weryfikuj w ISAP)
15 dni: Przy zapłacie z konta VAT
⚠️ Weryfikuj aktualne warunki i terminy w art. 87 VAT w ISAP.
```

### Biała lista podatników VAT

```
Obowiązek weryfikacji rachunku kontrahenta przed płatnością ≥ 15 000 PLN:
  → baza: https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka
  → Zapłata na niezarejestrowany rachunek → odpowiedzialność solidarna za VAT!
  → Zgłoszenie do US (ZAW-NR) do 7 dni — może zwolnić od odpowiedzialności
```

### WIS — Wiążąca Informacja Stawkowa

```
Wniosek: do Dyrektora KIS
Termin na wydanie: 3 miesiące (art. 42b ust. 1 VAT — weryfikuj w ISAP)
Wiążąca: dla organu i podatnika (przez 5 lat — weryfikuj aktualne przepisy)
```

---

## 5. JPK_V7M / JPK_V7K

```
Obowiązkowe dla wszystkich czynnych podatników VAT
Składane elektronicznie: do 25. dnia miesiąca następnego
JPK_V7M: rozliczenie miesięczne
JPK_V7K: rozliczenie kwartalne (ale część ewidencyjna co miesiąc)

Błędy w JPK:
  → Korekta: złożona przed wszczęciem kontroli → skuteczna
  → Sankcja: korekta wymuszona (po wezwaniu organu) może nie zwolnić od sankcji
  → Weryfikuj aktualny sankcyjny art. 109a VAT w ISAP
```

---

## 6. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Dobra wiara przy odliczeniu | Wydruk z białej listy z daty transakcji + KRS kontrahenta | podatki.gov.pl | wysoka | stary wydruk | data weryfikacji musi być ≤ data transakcji |
| Rzeczywistość transakcji | Faktury, WZ, CMR, potwierdzenia odbioru | strony | wysoka | brak dokumentów transportu | uzupełnij archiwum |
| MPP zastosowany | Potwierdzenia przelewów split | bank | wysoka | — | wyciąg bankowy z kodu MPP |
| KSeF — wystawienie faktury | Numer KSeF + status UPO | KSeF | wysoka (od 01.02/04.2026) | brak wdrożenia | plan wdrożenia + certyfikat |

---

## 7. STRATEGIA / QUALITY GATE / OUTPUT

**Strategia:** Weryfikuj kontrahentów na białej liście ZANIM dokonasz płatności. Przy odmowie odliczenia — udowodnij dobrą wiarę i należytą staranność. Przy KSeF — sprawdź termin obowiązku dla swojej firmy.

**Quality gate:** Stawka zweryfikowana (nie z pamięci)? Zał. 15 sprawdzony przy MPP? Biała lista weryfikowana w dacie transakcji? KSeF — termin obowiązku ustalony?

**Output:** Kwalifikacja VAT → stawka → odliczenie/zwrot → MPP → KSeF (termin) → spór (termin 14 dni).

**Powiązania:** `mod-OP-ordynacja-podatkowa` | `mod-KAS-kontrola-celno-skarbowa` | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000775 | https://ksef.podatki.gov.pl | https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka

---

## ANEKS — REJESTRACJA VAT I SOLIDARNA ODPOWIEDZIALNOŚĆ

### Rejestracja VAT

```
Formularz: VAT-R — złożony elektronicznie do US właściwego dla podatnika
Odmowa rejestracji: decyzja → odwołanie 14 dni (Op)
Wykreślenie z rejestru: organ może wykreślić z urzędu (weryfikuj przesłanki w ustawie)
Weryfikacja statusu VAT kontrahenta:
  → Biała lista: https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka
  → API (masowa weryfikacja): https://wl-api.mf.gov.pl
```

### Solidarna odpowiedzialność nabywcy (art. 105a VAT)

```
Warunki solidarnej odpowiedzialności nabywcy za VAT sprzedawcy:
  □ Towar z załącznika 15 do ustawy VAT (tzw. „towary wrażliwe")
  □ Nabywca wiedział lub miał uzasadnione podstawy do przypuszczenia, że
    podatek nie zostanie zapłacony przez sprzedawcę

OBRONA NABYWCY:
  □ Zapłata na rachunek z białej listy podatników VAT
  □ Zastosowanie split payment (MPP) — zwalnia z odpowiedzialności
  □ Należyta staranność (weryfikacja sprzedawcy, cena rynkowa)
  ⚠️ Weryfikuj aktualne przepisy art. 105a VAT w ISAP.
```
