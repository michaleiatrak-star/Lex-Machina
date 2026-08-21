# VAT — część 1: CORE, INTAKE, stawki VAT (baza weryfikacyjna)

> Część modułu `mod-VAT-podatek-od-towarow-i-uslug.md` (podział
> 2026-08-20, naprawa F-78, priorytet 3). Alerty legislacyjne [PKWiU
> 2025, KSeF obowiązkowy], CORE i INTAKE — zobacz plik nadrzędny
> (indeks). Ten plik ładowany WYŁĄCZNIE na żądanie konkretnego
> zagadnienia przez indeks nadrzędny.

---

## 1. CORE

### Zakres
VAT — podatek od towarów i usług; BAZA WERYFIKACJI STAWEK (sekcja 3: ISAP/zał. 3 i 10 + rozp. Dz.U. 2023 poz. 2670, ISZTAR4 dla kodów CN z datą symulacji, PKWiU 2015 dla usług, EUREKA, WIS); rejestracja, odliczenie VAT naliczonego, zwrot VAT, JPK_V7M/K, split payment (MPP), WIS (wiążąca informacja stawkowa), biała lista podatników VAT, solidarna odpowiedzialność nabywcy, KSeF, grupa VAT (art. 8c-8e, 15a), miejsce świadczenia usług (art. 28a-28o, w tym FE/stałe miejsce prowadzenia działalności), obowiązek podatkowy — zasady ogólne (art. 19a), podstawa opodatkowania i faktury korygujące in minus/in plus (art. 29a), zwolnienia przedmiotowe (art. 43) i VAT a nieruchomości (pierwsze zasiedlenie, opcja opodatkowania, relacja z PCC), ulga na złe długi (art. 89a-89b), sankcje VAT — dodatkowe zobowiązanie podatkowe (art. 112b-112c), bony jednego i różnego przeznaczenia — SPV/MPV (art. 8a-8b, art. 2 pkt 41-45), pusta faktura i obowiązek zapłaty podatku z samej faktury (art. 108), wyłączenia prawa do odliczenia — katalog negatywny (art. 88), odliczenie częściowe: proporcja (art. 90), prewspółczynnik (art. 86 ust. 2a-2h) i korekta wieloletnia 5/10 lat (art. 91, 90a-90c), nieodpłatne przekazania i świadczenia oraz refakturowanie (art. 7 ust. 2-4 i 7, art. 8 ust. 2, 2a, 5), zwrot różnicy podatku i przedłużenie terminu weryfikacji (art. 87), ewidencja JPK_V7 i sankcje ewidencyjne (art. 109, 109a, 110), wyłączenie zbycia przedsiębiorstwa i ZCP (art. 6 pkt 1), miejsce dostawy towarów i transakcje łańcuchowe (art. 22 ust. 1-2d), organy władzy publicznej — imperium vs dominium (art. 15 ust. 6), deklaracje i informacje podsumowujące VAT-UE (art. 99-100), odwrotne obciążenie po reformie (art. 17 + rozdz. 1c: art. 145e-145k), systematyka fakturowania (art. 106b, 106e, 106i, 106j, 106k), procedury szczególne — turystyka (art. 119) i rolnik ryczałtowy (art. 115-118).

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

## 3. ⛔ STAWKI VAT — BAZA WERYFIKACJI (NIE TABELA STAWEK)

> **PRZEBUDOWANE 2026-08-12 (iteracja IV audytu pokrycia VAT), na
> wyraźne polecenie użytkownika: „zamiast tworzenia jakiejś bazy wskaż
> źródło, gdzie należy weryfikować stawki VAT dla poszczególnych towarów
> i wskaż to jako bazę weryfikacyjną".** Poprzednia wersja tej sekcji
> była 5-wierszową tabelą orientacyjną („23% / 8% / 5% / 0% / ZW") —
> przez trzy rundy uzupełnień pozostała najsłabszym punktem modułu.
> Zastąpiona PROCEDURĄ WERYFIKACJI ze wskazaniem konkretnych baz
> źródłowych. Powód decyzji projektowej jest merytoryczny, nie
> oszczędnościowy: patrz „DLACZEGO NIE TABELA" niżej.

```
⛔⛔⛔ ZASADA BEZWZGLĘDNA: TEN MODUŁ NIE PODAJE STAWKI DLA KONKRETNEGO
  TOWARU ANI USŁUGI. Stawki NIE WOLNO odczytać z tego pliku, z pamięci
  modelu ani z ogólnego wyszukiwania w internecie. Stawkę ustala się
  WYŁĄCZNIE przez procedurę opisaną niżej, na źródłach RZĘDU 1.
  Naruszenie = naruszenie PRAWO-HARDGATE.

⭐⭐⭐ DLACZEGO NIE TABELA — DOWÓD Z SAMEGO SYSTEMU ŹRÓDEŁ:
  Rozporządzenie o obniżonych stawkach (Dz.U. 2023 poz. 2670) było
  zmieniane co najmniej DZIEWIĘĆ RAZY: Dz.U. 2024 poz. 387, 1381, 1399,
  1944; Dz.U. 2025 poz. 1253; Dz.U. 2026 poz. 417, 573, 642, 699.
  Sam § 11a (obniżka dla paliw) był przedłużany kolejno do 15.05.2026 →
  31.05.2026 → 15.06.2026 → 30.06.2026, a zakres kodów CN korygowano w
  trakcie (CN 2710 19 43 → CN 2710 19 42 i 2710 19 44).
  → KAŻDA TABELA STAWEK WPISANA DO MODUŁU JEST NIEAKTUALNA W CIĄGU
    TYGODNI. Wpisanie jej tworzy FAŁSZYWE POCZUCIE PEWNOŚCI — groźniejsze
    niż brak informacji, bo zniechęca do sprawdzenia.
```

### 3.1. ⭐⭐⭐ BAZA WERYFIKACYJNA — CZTERY ŹRÓDŁA, W TEJ KOLEJNOŚCI

```
┌─ POZIOM A — TEKST PRAWA (co jest opodatkowane jaką stawką) ─────────┐

A1. USTAWA O VAT — ISAP
    https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000775
    → art. 41 — konstrukcja stawek i odesłania do załączników
    → art. 146a i n. (przepisy epizodyczne, m.in. art. 146ea, 146ef,
      146ej) — CZASOWE poziomy stawek; ⛔ TO TU, A NIE W ART. 41, JEST
      STAWKA FAKTYCZNIE STOSOWANA
    → ZAŁĄCZNIK NR 3 — towary i usługi opodatkowane stawką obniżoną 8%
    → ZAŁĄCZNIK NR 10 — towary i usługi opodatkowane stawką obniżoną 5%
    → art. 83 — szczególne przypadki stawki 0%
    ⭐ SPOSÓB CZYTANIA: załączniki operują KODAMI CN (towary) i PKWiU
      (usługi) — bez ustalenia kodu (POZIOM B) załącznika NIE DA SIĘ
      poprawnie zastosować

A2. ROZPORZĄDZENIE WYKONAWCZE — OBNIŻONE STAWKI
    Rozporządzenie MF z 9.12.2023 r. w sprawie obniżonych stawek podatku
    od towarów i usług — **Dz.U. 2023 poz. 2670, z późn. zm.**
    https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230002670
    Podstawa delegacji: art. 146ej ust. 1 ustawy o VAT
    Struktura: Rozdz. 1 przepisy ogólne (§ 1-2) | Rozdz. 2 stawka 0%
      (§ 3-7) | Rozdz. 3 stawka 8% (§ 8) | Rozdz. 4 przepisy epizodyczne
      (§ 9-11, § 11a) + załącznik z listą towarów
    ⛔ OBOWIĄZKOWO sprawdź AKTUALNY tekst ujednolicony ORAZ datę
      obowiązywania przepisu epizodycznego — patrz lista dziewięciu
      nowelizacji wyżej

└────────────────────────────────────────────────────────────────────┘

┌─ POZIOM B — KLASYFIKACJA (jaki kod ma TEN konkretny towar) ─────────┐

B1. TOWARY — KODY CN: PRZEGLĄDARKA TARYFOWA ISZTAR4 (Ministerstwo
    Finansów, Departament Polityki Celnej)
    https://ext-isztar4.mf.gov.pl/taryfa_celna/home?lang=PL
    wyszukiwarka: https://ext-isztar4.mf.gov.pl/taryfa_celna/Browser?lang=PL
    ⭐⭐ FUNKCJA KLUCZOWA DLA SPRAW SPORNYCH — **DATA SYMULACJI**:
      przeglądarka pokazuje stan prawny NA WSKAZANY DZIEŃ, nie tylko
      bieżący. To JEDYNE łatwo dostępne narzędzie pozwalające odtworzyć
      klasyfikację NA DATĘ CZYNNOŚCI — a w sporze podatkowym liczy się
      właśnie ta data, nie dzisiejsza
    ⭐ ZAWIERA TEŻ (bezcenne przy sporze o klasyfikację): Noty
      wyjaśniające do CN, Rozporządzenia klasyfikacyjne Komisji
      Europejskiej, Wyroki TSUE, Kompendium opinii klasyfikacyjnych,
      Decyzje Komitetu Systemu Zharmonizowanego, Wiążące Informacje
      Taryfowe (WIT)

B2. USŁUGI — PKWiU
    ⚠️ PAMIĘTAJ O ALERCIE Z POCZĄTKU MODUŁU: dla celów VAT stosuje się
      **PKWiU 2015 do 31.12.2027 r.**, mimo że PKWiU 2025 weszła w życie
      1.01.2026 dla statystyki i rachunkowości. Kod z PKWiU 2025
      zastosowany do stawki VAT przed 2028 r. jest BŁĘDEM
    → w razie wątpliwości klasyfikacyjnych: wniosek do GUS o opinię
      interpretacyjną (opinia GUS NIE JEST wiążąca dla organu
      podatkowego — nie zastępuje WIS)

└────────────────────────────────────────────────────────────────────┘

┌─ POZIOM C — PRAKTYKA STOSOWANIA (jak organ kwalifikuje podobne) ────┐

C1. EUREKA — SYSTEM INFORMACYJNY MF/KIS
    https://eureka.mf.gov.pl/
    Publiczna, bezpłatna, bez zakładania konta. Zawiera WIS, WIA,
    interpretacje indywidualne i ogólne, objaśnienia podatkowe,
    wybrane orzeczenia sądów administracyjnych. Wyszukiwanie m.in. PO
    KODZIE CN i PO KODZIE PKWiU
    → PEŁNY opis możliwości i ZASTRZEŻENIA co do skuteczności samej
      wyszukiwarki: `mod-VAT-klasyfikacja-produktow-baza-
      niejednoznacznosci.md`, sekcja 3a
    ⚠️ WIS WYDANA DLA INNEGO PODATNIKA NIE CHRONI TWOJEGO KLIENTA —
      to materiał porównawczy i argumentacyjny, nie ochrona prawna

└────────────────────────────────────────────────────────────────────┘

┌─ POZIOM D — OCHRONA INDYWIDUALNA (gdy stawka jest sporna) ──────────┐

D1. WIS — WIĄŻĄCA INFORMACJA STAWKOWA (art. 42a-42i ustawy VAT)
    Wniosek do Dyrektora Krajowej Informacji Skarbowej.
    ⭐ TO JEDYNY instrument dający OCHRONĘ PRAWNĄ co do stawki
    ⭐ WAŻNOŚĆ WIS wydanych pod PKWiU 2015: do 31.12.2027 (patrz alert
      PKWiU na początku modułu)
    → szczegóły trybu: sekcja o WIS w części 4 tego modułu
    ⚠️ [zakres związania, przesłanki uchylenia i moc ochronna — art.
       42a-42i — NIEOPRACOWANE W PEŁNI; zweryfikuj w ISAP]

└────────────────────────────────────────────────────────────────────┘
```

### 3.2. ⭐⭐ PROCEDURA — SZEŚĆ KROKÓW, KOLEJNOŚĆ OBOWIĄZKOWA

```
KROK 1 — USTAL PRZEDMIOT: czy to TOWAR, USŁUGA, czy ŚWIADCZENIE
  KOMPLEKSOWE? Przy świadczeniu złożonym decyduje świadczenie GŁÓWNE —
  to samodzielny spór, nie formalność (patrz gastronomia/catering w
  `mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci.md`, sekcja 2.6)

KROK 2 — USTAL DATĘ CZYNNOŚCI. Stawkę stosuje się wg stanu prawnego z
  daty POWSTANIA OBOWIĄZKU PODATKOWEGO (art. 19a — pełna treść w
  module siostrzanym `mod-VAT-obowiazek-podstawa-zwolnienia-
  nieruchomosci.md`, sekcja "4a. OBOWIĄZEK PODATKOWY — ZASADY OGÓLNE"),
  nie z dnia analizy. W ISZTAR4 wpisz tę datę jako „datę symulacji"

KROK 3 — USTAL KOD: CN (towar) w ISZTAR4 albo PKWiU 2015 (usługa)

KROK 4 — SPRAWDŹ KOD W ŹRÓDŁACH POZIOMU A: załącznik 3, załącznik 10,
  art. 83, rozporządzenie Dz.U. 2023 poz. 2670 w wersji ujednoliconej

KROK 5 — SPRAWDŹ PRZEPISY EPIZODYCZNE (art. 146x ustawy + Rozdz. 4
  rozporządzenia). ⛔ NIE POMIJAJ TEGO KROKU — to tutaj mieszkają
  obniżki czasowe i tutaj stawka najczęściej „ucieka" analizie

KROK 6 — SPRAWDŹ PRAKTYKĘ W EUREKA (POZIOM C). Jeżeli wynik jest
  niejednoznaczny albo wartość obrotu istotna → REKOMENDUJ WIS (POZIOM D)

⭐ ZAPISZ ŚLAD WERYFIKACJI: źródło + data dostępu + data stanu prawnego,
  na którą sprawdzano. Bez tego nie da się później wykazać należytej
  staranności (✅ ZWERYFIKOWANE 2026-08-20: "sekcja 4h" to moduł
  siostrzany `mod-VAT-sankcje-bony-odliczenia.md`, sekcja "4h.
  WYŁĄCZENIA PRAWA DO ODLICZENIA — KATALOG NEGATYWNY", art. 88 ustawy —
  omawia m.in. niedochowanie należytej staranności jako przesłankę
  odmowy prawa do odliczenia. ⚠️ DRUGA CZĘŚĆ odesłania — "matryca
  dowodowa w sekcji 6" — jest MARTWA: żaden plik w całej rodzinie
  modułów VAT nie zawiera sekcji o tej nazwie; prawdopodobnie
  odesłanie do standardowego szablonu "## X. DOWODY"/"MATRYCA
  DOWODOWA" używanego w innych modułach dr-06, który albo nigdy nie
  powstał w tym module, albo został usunięty przy wcześniejszej
  edycji — NIE naprawiono na siłę fikcyjnym wskazaniem, odnotowane
  jako luka do rozstrzygnięcia)
```

### 3.3. ⚠️ TYLKO ORIENTACJA STRUKTURALNA — NIE PODSTAWA ROZLICZENIA

```
Poniższe służy WYŁĄCZNIE zrozumieniu, GDZIE szukać — NIE wolno tego
używać jako podstawy rozliczenia ani wpisywać do pisma:

  stawka podstawowa       → art. 41 ust. 1 + przepisy epizodyczne (146x)
  pierwsza obniżona       → art. 41 ust. 2 + ZAŁĄCZNIK NR 3 + rozp. § 8
  druga obniżona          → art. 41 ust. 2a + ZAŁĄCZNIK NR 10
  stawka 0% — transakcje  → art. 41 ust. 4-11 (eksport), art. 42 (WDT)
  stawka 0% — szczególne  → art. 83 + rozp. § 3-7
  zwolnienia przedmiotowe → art. 43 ust. 1 — pełna treść w module
    siostrzanym `mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci.md`,
    sekcja "4c. ZWOLNIENIA PRZEDMIOTOWE (art. 43) I VAT A NIERUCHOMOŚCI"
    — NIE JEST STAWKĄ
  ryczałt rolnika         → art. 115 ust. 2 + epizodyczne — pełna treść
    (w tym VAT RR) w module siostrzanym `mod-VAT-transakcje-
    fakturowanie.md`, w ramach sekcji "4o. FAKTUROWANIE — SYSTEMATYKA"
    (podsekcja "ROLNIK RYCZAŁTOWY — ZRYCZAŁTOWANY ZWROT")

⛔ ŚWIADOMIE NIE PODANO TU ŻADNEJ WARTOŚCI PROCENTOWEJ. Wartości
  odczytuje się ze źródeł POZIOMU A na datę czynności.
```

**Powiązania:** `mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci.md`
(przypadki sporne, gastronomia, suplementy, wyroby medyczne, EUREKA) |
`mod-PKWiU-klasyfikacje-statystyczne.md` (ramy klasyfikacji) |
`mod-ustawa-akcyzowa-i-clo-UCC.md` (CN dla wyrobów akcyzowych)

✅ [VER: rozporządzenie Dz.U. 2023 poz. 2670 wraz z wykazem dziewięciu
   nowelizacji i strukturą rozdziałów — przepisy.gofin.pl; nowelizacje
   Dz.U. 2026 poz. 417, 642 z podstawą art. 146ej ust. 1 — prawo.pl
   (pełne teksty); ISZTAR4 (adresy, funkcja daty symulacji, zawartość
   informacji dodatkowych) — ext-isztar4.mf.gov.pl [Rząd 1]; EUREKA —
   eureka.mf.gov.pl [Rząd 1]. Weryfikacja 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP — w szczególności aktualny tekst
   ujednolicony rozporządzenia i status przepisów epizodycznych art. 146x]

---

