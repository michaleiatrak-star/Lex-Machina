# mod-VAT-podatek-od-towarow-i-uslug

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** VAT — Dz.U. 2025 poz. 775 t.j. z 21.05.2025 (poprzedni t.j.: Dz.U. 2024 poz. 361)
**Data weryfikacji online:** 2026-08-12 (poprzednia: 2026-06-05)
**⚠️ NOWELIZACJE PO TEKŚCIE JEDNOLITYM — nałóż przed każdym powołaniem:**
Dz.U. 2025 poz. 894, 896 (art. 113 ust. 1: 200 000 → 240 000 zł), 1203,
1811; Dz.U. 2026 poz. 507, 846. Źródło listy: podatki.gov.pl/podatki-
firmowe/vat/podstawa-prawna [Rząd 1], sprawdzone 2026-08-12.
**⛔ OSTRZEŻENIE PO AUDYCIE 2026-08-12:** w module wykryto i usunięto
BŁĄD MERYTORYCZNY — podstawowy termin zwrotu różnicy podatku podawany
był jako 60 dni, podczas gdy art. 87 ust. 2 zd. 1 przewiduje 40 DNI.
Pisma i wyliczenia odsetkowe oparte na wcześniejszej wersji modułu
wymagają przeliczenia.
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## ⚡ ALERT — PKWiU 2025 — ZMIANA KLASYFIKACJI (ważne dla stawek VAT!)

```
PKWiU 2025 weszła w życie 01.01.2026 r. (statystyka, ewidencja, rachunkowość).
DLA CELÓW VAT: PKWiU 2015 stosuje się NADAL do 31.12.2027 r.
→ Stawki VAT obniżone (zał. 3 i 10 ustawy VAT) oparte na PKWiU 2015 do końca 2027.
→ WIS wydane pod PKWiU 2015 zachowują ważność do 31.12.2027.
→ Od 01.01.2028: obowiązkowe kody PKWiU 2025 dla celów VAT.
⚠️ Weryfikuj kody PKWiU w każdej sprawie WIS/stawki VAT:
   web_search: "PKWiU 2015 do 2027 VAT stawki kod [usługa/towar]"
```

## ⚡ ALERT — KSeF OBOWIĄZKOWY OD 2026

```
KSeF (Krajowy System e-Faktur) — HARMONOGRAM WDROŻENIA:
  01.02.2026: obowiązkowy dla firm z obrotem > 200 mln zł w 2025 r.
  01.04.2026: obowiązkowy dla pozostałych podatników VAT (JDG, MŚP)
  01.01.2027: dla najmniejszych firm — ⚠️ UZUPEŁNIONO 2026-07-27
    (FAZA 3E/ZASADA 14): DWA warunki łącznie, nie jeden — sprzedaż
    fakturami ≤ 10 tys. zł/mies. ORAZ pojedyncza faktura ≤ 450 zł
    (poprzednia wersja pomijała drugi warunek). Potwierdzone w 3+
    źródłach 2026 r. (infakt.pl, delkom.pl)

  UWAGA: Odbiór faktur przez KSeF obowiązkowy dla wszystkich od 01.02.2026 r.
  (nawet jeśli dana firma jeszcze nie wystawia w KSeF)

  Certyfikat wystawcy faktury: dostępny od 01.11.2025 (ważny 2 lata)
  Tryb offline (awaryjny): umożliwia wystawienie poza systemem + przesłanie do następnego dnia roboczego

  Podstawa: Ustawa z 5.08.2025 r. o KSeF — weryfikuj w ISAP
  web_search: "KSeF obowiązkowy termin 2026 ustawa Dz.U. 2025 MF aktualna"
```

## ⭐⭐ WERYFIKACJA FAKTURY W KSeF (dodane 2026-08-09, na żądanie
użytkownika)

```
⭐ DWUETAPOWY MECHANIZM WERYFIKACJI (przez kod QR LUB numer KSeF):
  ETAP 1 — PODSTAWOWE dane (bez logowania): po zeskanowaniu kodu QR
    LUB wejściu na stronę weryfikacyjną KSeF z numerem faktury —
    WYŚWIETLANE są dane IDENTYFIKACYJNE (NIP sprzedawcy, data,
    wyróżnik) ORAZ informacja, CZY dokument w ogóle ISTNIEJE w
    systemie
  ETAP 2 — PEŁNA weryfikacja (wymaga dodatkowych danych, zgodnie z
    rozporządzeniem): standardowo — NUMER faktury, NIP nabywcy,
    KWOTA należności — DOPIERO po podaniu TYCH danych i pozytywnej
    weryfikacji MOŻLIWE jest pobranie PEŁNEJ faktury z załącznikami

⭐⭐ DWA TYPY KODÓW QR — NIE MYLIĆ:
  → KOD I ("weryfikacja/OFFLINE"): umieszczany na KAŻDEJ fakturze
    przekazywanej POZA KSeF w trybie ONLINE — zawiera link
    umożliwiający sprawdzenie, CZY dokument istnieje + podstawowe
    dane — TO jest "zwykły", podstawowy kod weryfikacyjny
  → KOD II ("CERTYFIKAT"): potwierdza AUTENTYCZNOŚĆ POCHODZENIA i
    INTEGRALNOŚĆ TREŚCI faktury ORAZ uprawnienia wystawcy —
    WYMAGA aktywnego certyfikatu KSeF (typu 2) po stronie
    sprzedawcy — stosowany PRZY fakturach wystawionych w trybach
    OFFLINE24 (od 1.02.2026), OFFLINE (niedostępność KSeF) i
    AWARYJNYM — TAKIE faktury MAJĄ OBA kody jednocześnie (Kod I +
    Kod II), NIE tylko jeden

⭐⭐⭐ KLUCZOWE ZASTRZEŻENIE ZAKRESU — CAŁY POWYŻSZY MECHANIZM
WERYFIKACJI DOTYCZY GŁÓWNIE FAKTUR B2B (dodane 2026-08-09, na
żądanie użytkownika — "czy faktury imienne też są weryfikowane w
KSeF, czy tylko na firmy"):

⭐⭐ FAKTURY IMIENNE/B2C (wystawiane na rzecz OSÓB FIZYCZNYCH
  NIEPROWADZĄCYCH działalności gospodarczej — czyli KONSUMENTÓW) —
  NIE SĄ OBJĘTE OBOWIĄZKIEM KSeF — ani PRZED 1.02.2026, ani PO tej
  dacie — TO JEDNOZNACZNIE POTWIERDZONE w 10+ zgodnych, bardzo
  aktualnych źródłach (luty-lipiec 2026), w tym BEZPOŚREDNIO
  podatki.gov.pl (Rząd 1 — oficjalna strona KSeF)
  → PODSTAWA PRAWNA zwolnienia: art. 106ga ust. 2 ustawy o VAT
  → SPRZEDAWCA MOŻE wystawić fakturę B2C W KSeF DOBROWOLNIE, ALE NIE
    MA takiego obowiązku — pozostaje PEŁNA SWOBODA formy: papierowa,
    PDF/e-mail, LUB (opcjonalnie) w KSeF
  → ⭐ KONSUMENT NIE MA ŻADNYCH obowiązków związanych z KSeF — NIE
    musi zakładać konta, logować się DO systemu ani ODBIERAĆ faktur
    przez KSeF — NAWET jeśli sprzedawca DOBROWOLNIE wystawi fakturę
    w systemie, MUSI i TAK udostępnić ją konsumentowi w CZYTELNEJ
    formie (np. PDF) — zgoda konsumenta NIE JEST wymagana do
    WYSTAWIENIA w KSeF, ALE konsument MOŻE odmówić otrzymywania
    faktur AKURAT tą drogą (prawo to NALEŻY respektować)

⭐ PRAKTYCZNY TEST ROZRÓŻNIAJĄCY B2B OD B2C: DECYDUJE PODANIE NUMERU
  NIP przez nabywcę PRZY zakupie:
  → NIP PODANY → transakcja TRAFIA do KSeF (traktowana jako B2B),
    NAWET jeśli nabywcą formalnie jest osoba fizyczna prowadząca
    działalność gospodarczą
  → NIP NIE PODANY → transakcja B2C, POZA KSeF — DOTYCZY to RÓWNIEŻ
    sytuacji, gdy osoba fizyczna PROWADZĄCA JDG kupuje coś
    PRYWATNIE, na WŁASNY użytek (NIE w imieniu swojej firmy) —
    ŚWIADOMIE NIE PODAJĄC NIP w takiej sytuacji, TRANSAKCJA
    POZOSTAJE B2C

⭐ DODATKOWY WYJĄTEK (do 31.12.2026): paragony fiskalne Z NIP DO
  450 ZŁ — mogą być traktowane jako uproszczona faktura BEZ
  konieczności wystawiania w KSeF — NIE WLICZANE do limitu
  miesięcznego 10 000 zł dla faktur B2B wystawianych POZA KSeF w
  okresie przejściowym

⚠️ ODRĘBNA KATEGORIA — B2G (biznes-administracja publiczna): TE
  faktury SĄ objęte PEŁNYM obowiązkiem KSeF, W PRZECIWIEŃSTWIE do
  B2C — NIE MYLIĆ tych dwóch kategorii

⭐ WNIOSEK PRAKTYCZNY dla POWYŻSZEGO mechanizmu weryfikacji (sekcja
  wyżej): CAŁY opisany system dwuetapowej weryfikacji przez kod QR/
  numer KSeF ma PEŁNE, OBOWIĄZKOWE zastosowanie DO faktur B2B (oraz
  B2G) — DLA faktury IMIENNEJ/konsumenckiej TEN mechanizm MOŻE (ale
  NIE MUSI) w ogóle ISTNIEĆ — JEŚLI sprzedawca NIE skorzystał z
  opcji dobrowolnego wystawienia w KSeF, faktura dla konsumenta NIE
  BĘDZIE miała NUMERU KSeF ani kodu QR w OGÓLE — sama JEJ
  autentyczność WERYFIKUJE SIĘ WTEDY na zasadach OGÓLNYCH (nie przez
  system KSeF), analogicznie jak przed reformą

Potwierdzone w 10+ zgodnych, bardzo aktualnych źródeł (luty-lipiec
2026): podatki.gov.pl [Rząd 1 — oficjalna strona KSeF, sekcja
"Konsumenci i osoby fizyczne"], infakt.pl [3.03.2026], oneclick-
workflow.pl [18.04.2026, TYTUŁ artykułu wprost dotyczy "faktur
imiennych"], eztax.pl [19.02.2026], ifirma.pl [13.04.2026],
ksefgpt.pl [26.03.2026], ingksiegowosc.pl [20.03.2026], edk-
consulting.pl [9.03.2026], pioniew.eu [8.07.2026 — NAJŚWIEŻSZE
potwierdzenie].

⚠️⚠️ REALNE, AKTYWNE ZAGROŻENIE — FAŁSZYWE FAKTURY Z KODEM QR:
  oszuści ROZSYŁAJĄ fałszywe faktury PDF z kodami QR IMITUJĄCYMI
  dokumenty KSeF — kody MOGĄ prowadzić DO: (a) NIEISTNIEJĄCYCH
  dokumentów, (b) SFAŁSZOWANYCH stron podszywających się pod KSeF,
  (c) ⚠️ CO GROŹNIEJSZE — PRAWDZIWYCH wpisów w KSeF, KTÓRE JEDNAK
  NIE PRZECHODZĄ pełnej weryfikacji SZCZEGÓŁÓW (np. numer istnieje,
  ale kwota/NIP na wydruku NIE ZGADZA SIĘ z systemem)
  ⭐ REKOMENDOWANA PROCEDURA WERYFIKACJI (dla odbiorcy faktury):
    (1) zalogować się DO Portalu Podatnika KSeF, (2) wyszukać
    dokument NIE TYLKO po numerze KSeF, ALE RÓWNIEŻ po szczegółowych
    danych: KWOCIE należności, DACIE wystawienia, NIP NABYWCY —
    (3) zweryfikować SAMEGO kontrahenta niezależnie: czy firma
    faktycznie współpracuje, czy dane (numer konta, adres, NIP)
    zgadzają się z bazą kontrahentów

⭐ WAŻNE OGRANICZENIE kodu QR jako narzędzia: kod QR to narzędzie
  POMOCNICZE — POZWALA na UPROSZCZONE potwierdzenie obecności i
  podstawowych danych faktury, ALE NIE ZASTĘPUJE jej pełnego
  doręczenia ANI dostępu do CAŁEJ treści dokumentu — NAJPEWNIEJSZY
  sposób weryfikacji to PORÓWNANIE tego, co jest NA WYDRUKU, z tym,
  co JEST w systemie (nie samo zeskanowanie kodu)

⭐⭐ KLUCZOWE OGRANICZENIE PRAKTYCZNE — BRAK MOŻLIWOŚCI ANULOWANIA:
  faktura, KTÓREJ NADANO numer KSeF, NIE MOŻE być anulowana —
  JEDYNYM sposobem naprawienia pomyłki jest faktura KORYGUJĄCA "DO
  ZERA" — DLATEGO zgodność danych (NIP, daty, kwoty: suma netto +
  VAT = brutto) WARTO sprawdzić PRZED wysyłką dokumentu do systemu,
  NIE dopiero po

STAN ZAWIESZENIA KAR: kary za błędy/brak faktury w KSeF SĄ
  ZAWIESZONE do **31 GRUDNIA 2026 R.** — TO NIE OZNACZA braku
  konsekwencji w OGÓLE, TYLKO odroczenie sankcji PIENIĘŻNYCH na
  okres wdrożeniowy

⭐ WYMÓG SCHEMATU: od 1.02.2026 r. WSZYSTKIE faktury w KSeF, W TYM
  KOREKTY do STARSZYCH dokumentów (wystawionych w schemacie FA(1)
  lub FA(2)), MUSZĄ spełniać wymogi NOWEGO schematu **FA(3)**

⚠️ QR NIE JEST FORMALNIE OBOWIĄZKOWY dla faktur POZOSTAJĄCYCH
  WYŁĄCZNIE wewnątrz systemu KSeF (nieopuszczających go) — staje się
  OBOWIĄZKOWY DOPIERO przy PRZEKAZANIU faktury POZA KSeF (np. PDF
  e-mailem do kontrahenta) — Ministerstwo Finansów REKOMENDUJE jego
  stosowanie jako element ułatwiający weryfikację, NAWET gdy nie ma
  formalnego wymogu

Potwierdzone w 9+ zgodnych, EKSTREMALNIE aktualnych źródeł (luty-
czerwiec 2026): assecobs.pl [19.03.2026, z konkretnym opisem
mechanizmu oszustwa], podatki.gov.pl [Rząd 1 — oficjalna strona
KSeF], ksef-dla.pl [15.06.2026], altoadvisory.pl, eztax.pl
[19.02.2026], fakturowo.pl, i-malaksiegowosc.pl [10.02.2026],
oneclick-workflow.pl [maj 2026], rafsoft.net [9.03.2026].
```

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
  daty POWSTANIA OBOWIĄZKU PODATKOWEGO (sekcja 4a), nie z dnia analizy.
  W ISZTAR4 wpisz tę datę jako „datę symulacji"

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
  staranności (patrz sekcja 4h i matryca dowodowa w sekcji 6)
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
  zwolnienia przedmiotowe → art. 43 ust. 1 (sekcja 4c) — NIE JEST STAWKĄ
  ryczałt rolnika         → art. 115 ust. 2 + epizodyczne (sekcja 4p)

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

⭐ SAMOCHODY OSOBOWE — ograniczenie 50%/100% (art. 86a) I użytek
  mieszany/prywatny (w tym ryczałt PIT pracownika) — PEŁNE opracowanie
  w `mod-odliczenia-uzytek-mieszany-firma-prywatny-KUP.md` (dodane
  2026-07-21), NIE duplikuj tutaj.

⛔ PRZESŁANKI NEGATYWNE — art. 88: samo spełnienie art. 86 ust. 1 NIE
  WYSTARCZA. Katalog wyłączeń (podmiot nieistniejący, czynność
  niedokonana, kwoty niezgodne z rzeczywistością, nocleg/gastronomia,
  brak rejestracji) — PEŁNE opracowanie w sekcji **4h** tego modułu
  (dodane 2026-08-12; wcześniej art. 88 był w DR-06 całkowicie nieobecny)

⭐ ODLICZENIE CZĘŚCIOWE — gdy zakup służy także czynnościom zwolnionym
  lub celom spoza działalności gospodarczej: proporcja (art. 90),
  prewspółczynnik (art. 86 ust. 2a-2h), korekta wieloletnia 5/10 lat
  (art. 91) — sekcja **4i** tego modułu

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

### ⭐⭐⭐ ZWROT RÓŻNICY PODATKU — TERMINY I PRZEDŁUŻENIE WERYFIKACJI
(art. 87 ustawy VAT) — PRZEBUDOWANE 2026-08-12 w ramach audytu pokrycia
VAT

```
⛔⛔ KOREKTA BŁĘDU MERYTORYCZNEGO (naprawa 2026-08-12): poprzednia wersja
  tej sekcji podawała **60 DNI** jako "podstawowy termin zwrotu" z
  powołaniem na art. 87 ust. 2. TO BYŁO NIEAKTUALNE. Aktualne brzmienie
  art. 87 ust. 2 zd. 1 przewiduje termin **40 DNI** od dnia złożenia
  rozliczenia. Termin 60-dniowy występuje dziś WYŁĄCZNIE jako termin
  SKRÓCONY w trybie art. 87 ust. 5a zd. 2 (zwrot ze 180 dni do 60 dni po
  złożeniu zabezpieczenia majątkowego) — NIE jako zasada ogólna.
  ⚠️ Każde pismo/wyliczenie odsetek sporządzone wcześniej na podstawie
  tego modułu z terminem 60 dni WYMAGA PONOWNEGO PRZELICZENIA.

⭐⭐⭐ SIATKA TERMINÓW (art. 87):
  □ **40 dni** (ust. 2 zd. 1) — TERMIN PODSTAWOWY, na rachunek bankowy /
    rachunek w SKOK wskazany w zgłoszeniu identyfikacyjnym
  □ **25 dni** (ust. 6) — tryb przyspieszony, warunki ŁĄCZNIE: (a) podatek
    naliczony z faktur ZAPŁACONYCH w całości przez rachunek bankowy/SKOK
    podatnika, albo faktur o łącznej należności ≤ 15 000 zł, albo
    dokumentów celnych/importu z art. 33a/WNT/importu usług/dostawy z
    odwrotnym obciążeniem — jeżeli wykazano podatek należny; (b) kwota
    nierozliczona z poprzednich okresów ≤ 3 000 zł; (c) potwierdzenie
    zapłaty złożone najpóźniej w dniu złożenia deklaracji; (d) przez 12
    poprzedzających miesięcy podatnik był VAT czynny i składał deklaracje
  □ **25 dni** (ust. 6a) — NA WNIOSEK zawarty w deklaracji, zwrot NA
    RACHUNEK VAT (nie na rachunek rozliczeniowy) — tryb odrębny od ust. 6,
    BEZ warunków z ust. 6
  □ **15 dni** (ust. 6d–6e) — tzw. podatnik bezgotówkowy. Warunki
    ŁĄCZNIE m.in.: udział sprzedaży zaewidencjonowanej na kasach online
    ≥ **80%** całej sprzedaży ORAZ udział płatności bezgotówkowych ≥ **80%**
    sprzedaży kasowej (za 3 okresy, a przy rozliczeniu kwartalnym — 1
    okres); sprzedaż kasowa ≥ **40 tys. zł** miesięcznie przez 6 miesięcy;
    kwota zwrotu ≤ 2× podatku ze sprzedaży kasowej; nierozliczona kwota
    ≤ 3000 zł; 12 mies. statusu VAT czynnego; 3 mies. rachunku z wykazu
    art. 96b ust. 1; 6 mies. wyłącznie kas online (art. 111a ust. 3)
  □ **180 dni** (ust. 5a) — brak czynności opodatkowanych w okresie;
    SKRACANY do **60 dni** na wniosek + zabezpieczenie majątkowe

⭐⭐⭐ PRZEDŁUŻENIE TERMINU — OŚ WIĘKSZOŚCI SPORÓW O ZWROT
  (art. 87 ust. 2 zdanie drugie):
  → Przesłanka ustawowa: „jeżeli zasadność zwrotu wymaga dodatkowego
    zweryfikowania" — naczelnik US MOŻE przedłużyć termin DO CZASU
    ZAKOŃCZENIA weryfikacji prowadzonej w ramach: czynności sprawdzających,
    kontroli podatkowej, kontroli celno-skarbowej LUB postępowania
    podatkowego
  → ⭐ USTAWA NIE ZAKREŚLA MAKSYMALNEGO TERMINU przedłużenia — to główne
    pole ataku procesowego; kontrola sądowa idzie przez OCENĘ
    UZASADNIENIA postanowienia (czy organ WYKAZAŁ konkretne wątpliwości,
    czy tylko powołał ogólną formułę)
  → ZAKRES weryfikacji (ust. 2b): obejmuje NIE TYLKO rozliczenie
    podatnika, ale RÓWNIEŻ rozliczenia INNYCH PODMIOTÓW w łańcuchu obrotu
    i zgodność tych rozliczeń z faktycznym przebiegiem transakcji
  → ⭐ ODSETKI PRZY WYGRANEJ (ust. 2 zd. 3): jeżeli czynności organu
    WYKAŻĄ ZASADNOŚĆ zwrotu — US wypłaca kwotę WRAZ Z ODSETKAMI w
    wysokości odpowiadającej OPŁACIE PROLONGACYJNEJ (nie odsetkom za
    zwłokę!). To odrębna, niższa stawka — sprawdź wysokość przed
    wyliczeniem roszczenia
  → ŻĄDANIE SŁUŻB (ust. 2c): naczelnik US przedłuża termin RÓWNIEŻ na
    żądanie Komendanta Głównego Policji, Szefa CBA, Szefa ABW lub
    Prokuratora Generalnego — na okres WSKAZANY w żądaniu, NIE DŁUŻSZY
    NIŻ **3 MIESIĄCE**; żądanie ZAWIERA UZASADNIENIE

⭐⭐ ŚCIEŻKA ODBLOKOWANIA ZWROTU MIMO PRZEDŁUŻENIA (ust. 2a):
  → Podatnik składa WNIOSEK + ZABEZPIECZENIE MAJĄTKOWE w kwocie
    odpowiadającej wnioskowanemu zwrotowi → US zwraca w terminie
    PODSTAWOWYM (40 dni)
  → JEŻELI wniosek z zabezpieczeniem złożono na **13 dni** przed upływem
    terminu LUB PÓŹNIEJ → zwrot w **14 dni** od złożenia zabezpieczenia
  → FORMY zabezpieczenia (ust. 4a): gwarancja bankowa/ubezpieczeniowa,
    poręczenie banku, weksel z poręczeniem wekslowym banku, czek
    potwierdzony przez krajowy bank wystawcy, papiery wartościowe na
    okaziciela o określonym terminie wykupu (SP/NBP, bankowe papiery
    wartościowe, listy zastawne)
  → ⭐ WEKSEL SAM (ust. 4b): dopuszczalny TYLKO do równowartości
    **1 000 EUR** (przeliczenie po średnim kursie NBP na ostatni dzień
    roboczy okresu rozliczeniowego, zaokrąglenie do pełnych złotych)
  → ODMOWA przyjęcia zabezpieczenia (ust. 4d): gdy nie zapewnia pokrycia
    CAŁOŚCI kwoty lub — przy zabezpieczeniu terminowym — pokrycia W
    TERMINIE
  → ZWOLNIENIE zabezpieczenia (ust. 4e–4f) NIE następuje m.in. do
    zakończenia postępowania podatkowego, a przy kontroli podatkowej —
    do upływu **3 miesięcy** od jej zakończenia, jeżeli w tym czasie nie
    wszczęto postępowania

⭐⭐ TERMINY ŚRODKÓW ZASKARŻENIA — NIETYPOWE, ŁATWE DO PRZEGAPIENIA
  (art. 87 ust. 6j–6m): przy doręczeniu zastępczym postanowienia o
  przedłużeniu terminu / decyzji o odmowie zwrotu w trybie 15-dniowym
  (przechowanie w placówce pocztowej, złożenie w urzędzie gminy, adres do
  doręczeń elektronicznych, konto w e-US) doręczenie uważa się za
  dokonane z upływem **4 DNI**, A WÓWCZAS:
  → ZAŻALENIE na postanowienie o przedłużeniu terminu — **17 DNI**
  → ODWOŁANIE od decyzji o odmowie zwrotu w terminie z ust. 6d — **24 DNI**
  ⚠️ To terminy SZCZEGÓLNE względem 7/14 dni z Ordynacji podatkowej —
    licz je OSOBNO, nie z automatu z OP

⚠️ SANKCJA ZA BRAK TERMINALA (ust. 6c): podatnikowi, który wbrew art. 19a
  Prawa przedsiębiorców nie zapewniał możliwości zapłaty instrumentem
  płatniczym, NIE PRZYSŁUGUJE zwrot w terminie 25-dniowym z ust. 6 —
  za okres stwierdzenia naruszenia I ZA 6 KOLEJNYCH okresów

□ SKUTEK NIEZWROTU W TERMINIE (ust. 7): różnicę niezwróconą w terminach
  z ust. 2 zd. 1 i ust. 5a traktuje się jako NADPŁATĘ podlegającą
  oprocentowaniu wg Ordynacji podatkowej

✅ [VER: lexlege.pl — pełny tekst art. 87 ustawy o VAT, Dz.U.2025.0.775
   t.j., stan prawny na 12.08.2026; pobrane 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP przed powołaniem w piśmie — akt ma
   nowelizacje po t.j.: Dz.U. 2025 poz. 894, 896, 1203, 1811; Dz.U. 2026
   poz. 507, 846]
```

### ⭐⭐⭐ KASY FISKALNE — OBOWIĄZEK EWIDENCJONOWANIA — dodane
2026-08-12, na żądanie użytkownika (priorytet #2 z mapy pokrycia
VAT — dotąd CAŁKOWICIE nieobecny, mimo że to EKSTREMALNIE
powszechny temat praktyczny)

```
⭐⭐ PODSTAWA: rozporządzenie MF z 17.12.2024 (Dz.U. 2024 poz. 1902)
  — OBOWIĄZUJE co do ZASADY do **31.12.2027 R.**

⭐⭐⭐ DWA CAŁKOWICIE ODRĘBNE MECHANIZMY zwolnienia — NIE MYLIĆ:
  1) ZWOLNIENIE PODMIOTOWE (limit OBROTU): **20 000 ZŁ** rocznego
     obrotu NA rzecz osób FIZYCZNYCH nieprowadzących działalności
     GOSPODARCZEJ oraz ROLNIKÓW ryczałtowych — ⭐ SPRZEDAŻ B2B
     (faktury DLA firm) W OGÓLE NIE WLICZA się DO tego limitu,
     NIEZALEŻNIE od WYSOKOŚCI
  2) ZWOLNIENIE PRZEDMIOTOWE (rodzaj DZIAŁALNOŚCI, NIEZALEŻNE od
     obrotu): LISTA **58 KATEGORII** czynności zwolnionych (np.
     usługi FINANSOWE, ubezpieczeniowe, edukacyjne, pocztowe,
     kurierskie) — TE dwa mechanizmy DZIAŁAJĄ NIEZALEŻNIE od siebie

⭐ SPOSÓB LICZENIA limitu 20 000 zł: DLA czynnych podatników VAT —
  WARTOŚĆ sprzedaży NETTO; DLA podatników ZWOLNIONYCH z VAT —
  kwota BRUTTO

⭐⭐⭐ "OBOWIĄZEK BEZWZGLĘDNY" — PRAWIE 40 KATEGORII BEZ ŻADNEGO
  zwolnienia, KASA WYMAGANA OD PIERWSZEJ transakcji, NIEZALEŻNIE OD
  obrotu (§ 4 rozporządzenia) — PRZYKŁADY: usługi FRYZJERSKIE,
  kosmetyczne, GASTRONOMICZNE, prawnicze, serwis POJAZDÓW, sprzedaż
  PALIW, RTV/AGD — ⭐ ROZSZERZENIE OD 1.07.2025: RÓWNIEŻ e-papierosy,
  wyroby KONOPNE, płyny ODKAŻAJĄCE, węgiel — ⭐ POWIĄZANIE Z systemem:
  TE SAME kategorie (e-papierosy/wyroby NIKOTYNOWE) OPISANE już
  SZCZEGÓŁOWO W mod-ustawa-akcyzowa-i-clo-UCC.md (reforma 2025-2027,
  wymóg SKŁADU podatkowego) — TERAZ widać, że OBEJMUJE TO RÓWNIEŻ
  ODRĘBNY obowiązek KASOWY, NIE tylko akcyzowy

⭐⭐⭐ TERMIN PO PRZEKROCZENIU limitu 20 000 zł: OBOWIĄZEK zakupu I
  instalacji kasy W CIĄGU **2 MIESIĘCY** OD miesiąca, W KTÓRYM
  nastąpiło PRZEKROCZENIE — PRZYKŁAD Z praktyki: przekroczenie W
  grudniu → obowiązek OD marca kolejnego roku

⭐ PROPORCJONALNY limit DLA nowych podmiotów: LIMIT × (LICZBA dni
  PROWADZENIA sprzedaży pozostała DO końca roku / liczba DNI w
  roku podatkowym)

⭐ WYJĄTEK — SPRZEDAŻ WYSYŁKOWA/internetowa: ZWOLNIONA Z obowiązku
  kasy POD DWOMA warunkami ŁĄCZNIE: (1) PŁATNOŚĆ MUSI W CAŁOŚCI
  wpłynąć NA rachunek BANKOWY firmy, (2) Z OPISU przelewu/ewidencji
  MUSI jasno WYNIKAĆ, CZEGO dotyczyła TRANSAKCJA

Potwierdzone w 9+ zgodnych, BARDZO aktualnych źródeł 2026
(poradnikprzedsiebiorcy.pl [×2, NAJŚWIEŻSZE, sprzed 1-3 tygodni],
bizky.ai [marzec 2026], taxology.co [marzec 2026], superbiz.se.pl
[Z pełną listą 58 kategorii], techsat24.pl [luty 2026], taxclear.pl
[grudzień 2025], mico.pl [luty 2026, Z pełnym odesłaniem DO § 4
rozporządzenia], edk-consulting.pl [styczeń 2026], salesystem.pl).
```

### Biała lista podatników VAT

```
Obowiązek weryfikacji rachunku kontrahenta przed płatnością ≥ 15 000 PLN:
  → baza: https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka
  → Zapłata na niezarejestrowany rachunek → odpowiedzialność solidarna za VAT!
  → Zgłoszenie do US (ZAW-NR) do 7 dni — może zwolnić od odpowiedzialności
```

### ⭐⭐⭐ WNT I IMPORT USŁUG — ODWROTNE OBCIĄŻENIE — dodane
2026-08-12, na żądanie użytkownika (priorytety #3-4 z mapy pokrycia
VAT — dotąd CAŁKOWICIE nieobecne)

```
⭐⭐ MECHANIZM OGÓLNY (odwrotne obciążenie/reverse charge): OBOWIĄZEK
  podatkowy PRZECHODZI ZE sprzedawcy NA nabywcę — nabywca SAM
  nalicza VAT (jako NALEŻNY) i JEDNOCZEŚNIE, JEŚLI ma prawo,
  ODLICZA go (jako NALICZONY) — CO DO ZASADY neutralne PODATKOWO —
  W 2026 R. mechanizm obowiązuje GŁÓWNIE przy IMPORCIE usług, WNT
  oraz CZASOWO przy giełdowych transakcjach GAZEM/energią/
  uprawnieniami CO2 — W obrocie KRAJOWYM większość dawnych
  PRZYPADKÓW reverse charge ZASTĄPIŁ split payment (OD 2019)

⭐⭐⭐ WNT (WEWNĄTRZWSPÓLNOTOWE NABYCIE TOWARÓW):
  → DEFINICJA: nabycie PRAWA do rozporządzania JAK właściciel
    TOWAREM, PRZEWOŻONYM Z innego państwa UE DO Polski (RÓWNIEŻ
    przewóz WŁASNYCH towarów PODATNIKA z UE do PL)
  → OBOWIĄZEK PODATKOWY: Z CHWILĄ wystawienia FAKTURY przez
    sprzedawcę UE, NIE PÓŹNIEJ niż **15. DNIA** miesiąca
    NASTĘPUJĄCEGO PO miesiącu DOSTAWY (art. 20 ust. 5)
  → ⭐⭐⭐ WAŻNA ZMIANA (PO uchyleniu art. 86 ust. 10g): odliczenie
    VAT naliczonego NIE JEST już UZALEŻNIONE od POSIADANIA
    faktury — transakcja W PEŁNI neutralna, JEDNA deklaracja
    JPK_V7 — BRAK otrzymania faktury W terminie 3 MIESIĘCY NIE
    POWODUJE już KONIECZNOŚCI korygowania odliczonego PODATKU
    (⚠️ TO ZMIANA względem STARSZEGO stanu prawnego — STARE
    materiały MOGĄ wciąż OPISYWAĆ obowiązek korekty)
  → DOKUMENT: nabywca WYSTAWIA dokument WEWNĘTRZNY (oznaczony jako
    "WEW"), umożliwiający WYKAZANIE VAT należnego I naliczonego
  → ⭐⭐ WYŁĄCZENIA Z WNT (art. 10 ust. 1 pkt 2) — DOTYCZĄ małych
    nabywców: rolnicy RYCZAŁTOWI (dla działalności ROLNICZEJ),
    podatnicy BEZ prawa odliczenia, PODATNICY zwolnieni Z limitem
    **240 000 ZŁ** (⚠️ zaktualizowana wartość, PATRZ sekcja O
    zwolnieniu podmiotowym WYŻEJ), podatnicy ROZPOCZYNAJĄCY
    działalność Z proporcjonalnym limitem, PODATNICY zagraniczni
    bez SIEDZIBY w PL Z limitem krajowym + DODATKOWYM limitem
    UNIJNYM 100 000 EUR
  → INFORMACJA PODSUMOWUJĄCA VAT-UE: WYMAGANA dla WNT

⭐⭐⭐ IMPORT USŁUG:
  → DEFINICJA: nabycie USŁUG od ZAGRANICZNEGO dostawcy,
    NIEZALEŻNIE OD tego, czy dostawca MA siedzibę W UE, czy POZA
    nią
  → MECHANIZM analogiczny DO WNT — nabywca WYKAZUJE VAT należny I
    (jeśli PRZYSŁUGUJE) naliczony — zagraniczny DOSTAWCA NIE
    uczestniczy W polskim systemie PODATKOWYM
  → ⭐⭐ KLUCZOWA RÓŻNICA względem WNT: import USŁUG NIE MUSI być
    wykazany W informacji PODSUMOWUJĄCEJ VAT-UE (W przeciwieństwie
    DO WNT) — ⚠️ ŁATWO pomylić, PONIEWAŻ EKSPORT usług MUSI być W
    NIEJ ujęty

⭐ FORMALNOŚCI PRZY OBU mechanizmach: PODMIOTY Z krajów
  CZŁONKOWSKICH muszą być ZAREJESTROWANE do VAT-UE — BRAK
  rejestracji NIE WYKLUCZA jednak rozliczenia VAT PRZEZ nabywcę W
  ramach REVERSE CHARGE — FAKTURA od kontrahenta ZAGRANICZNEGO
  ZAWIERA wzmiankę "REVERSE CHARGE"/"odwrotne OBCIĄŻENIE" oraz
  NUMERY VAT-UE OBU stron

⭐ KONTEKST SYSTEMOWY — LUKA VAT: WEDŁUG raportu VAT GAP 2025
  Komisji EUROPEJSKIEJ, Polska ZEBRAŁA W 2023 R. 54 999 MLN EUR
  wpływów Z VAT, LECZ luka WYNIOSŁA 10 453 MLN EUR (**16,0%**
  potencjalnych wpływów) — POWYŻEJ ŚREDNIEJ unijnej (9,5%) —
  WPROWADZENIE split PAYMENT i selektywne STOSOWANIE reverse
  charge MAJĄ NA celu OGRANICZENIE tej luki, poprzez ELIMINACJĘ
  "znikających PODATNIKÓW" i karuzel PODATKOWYCH (⭐ POWIĄZANIE Z
  mechanizmem "FIRM SŁUPÓW" opisanym wcześniej W mod-ustawa-
  akcyzowa-i-clo-UCC.md, sekcja O technikach OBCHODZENIA akcyzy —
  ANALOGICZNY mechanizm KARUZELOWY, TYLKO NA gruncie VAT)

Potwierdzone w 8+ zgodnych, BARDZO aktualnych źródeł 2026, w tym
BEZPOŚREDNIO podatki.gov.pl (Rząd 1, ×2) oraz szybkafaktura.pl
[marzec 2026, Z raportem VAT Gap 2025 KE], poradnikprzedsiebiorcy.pl
[×2, kwiecień-maj 2026], taxology.co, amavat.pl [kwiecień 2026],
medtax.com.pl [sprzed 2 tygodni].
```

### ⭐ VAT OSS / IOSS — e-commerce transgraniczny (dodane 2026-07-19)

```
VAT OSS (One Stop Shop, od 1.07.2021) — uproszczona procedura dla
  SPRZEDAŻY NA ODLEGŁOŚĆ towarów/wybranych usług B2C w UE:
  □ Zamiast rejestracji VAT w KAŻDYM kraju konsumpcji — JEDNA
    kwartalna deklaracja (VIU-DO) w kraju identyfikacji
  □ PRÓG 10 000 EUR NETTO rocznie łącznej sprzedaży B2C do innych
    krajów UE — PO przekroczeniu: obowiązek stosowania stawek VAT
    KRAJU NABYWCY (nie polskich)
  □ REJESTRACJA: formularz VIU-R (e-Urząd Skarbowy / e-Deklaracje)
  □ DEKLARACJA: do KOŃCA miesiąca po każdym kwartale, do Naczelnika
    Drugiego Urzędu Skarbowego Warszawa-Śródmieście — OBOWIĄZKOWA
    nawet przy BRAKU sprzedaży w danym kwartale (deklaracja "zerowa")
  □ Podatek płatny W EURO
  □ EWIDENCJA — obowiązkowa, PRZECHOWYWANA 10 LAT (na wypadek kontroli)
  □ VAT rozliczony w OSS NIE PODLEGA odliczeniu w polskiej deklaracji
    VAT — to podatek NALEŻNY przekazywany innym krajom, nie naliczony
  □ CZEGO OSS NIE OBEJMUJE: przemieszczenia WŁASNYCH towarów do
    magazynu w innym kraju UE (wymaga zwykle LOKALNEJ rejestracji),
    rozliczeń B2B (odwrotne obciążenie/rejestracja lokalna), niektórych
    towarów akcyzowych
  □ PROCEDURA NIEUNIJNA (wariant OSS) — dla przedsiębiorstw SPOZA UE
    bez stałej siedziby w UE, świadczących USŁUGI (cyfrowe, doradcze,
    zawody regulowane) konsumentom w UE — wybór DOWOLNEGO kraju UE do
    rejestracji

VAT IOSS (Import One Stop Shop) — dla SPRZEDAŻY IMPORTOWANEJ:
  □ Dotyczy towarów WYSYŁANYCH SPOZA UE, o wartości PRZESYŁKI ≤ 150 EUR,
    NIEPODLEGAJĄCYCH akcyzie
  □ VAT pobierany od KLIENTA już przy ZAKUPIE (wg stawki kraju
    nabywcy) — przesyłka korzysta ze ZWOLNIENIA z VAT przy imporcie
  □ FAKULTATYWNY — ale po przystąpieniu, WSZYSTKIE kwalifikujące się
    transakcje MUSZĄ być w nim rozliczane (brak wyboru "na sztuki")
  □ Dostępny dla sprzedawców SPOZA UE i Z UE, w tym PLATFORM handlowych

Checklist praktyczny:
□ Czy sprzedaż B2C do innych krajów UE PRZEKROCZYŁA próg 10 000 EUR
  netto rocznie — jeśli TAK, konieczna rejestracja lokalna LUB OSS
□ Czy klient MAGAZYNUJE towary w innym kraju UE (np. Amazon FBA) —
  OSS NIE WYSTARCZY, potrzebna zwykle DODATKOWA rejestracja lokalna
□ Przy IMPORCIE towarów spoza UE o wartości ≤150 EUR — rozważ IOSS
  zamiast płacenia VAT przy odprawie celnej
□ Czy prowadzona jest WYMAGANA 10-LETNIA ewidencja transakcji OSS
```

---

### WIS — Wiążąca Informacja Stawkowa

```
Wniosek: do Dyrektora KIS
Termin na wydanie: 3 miesiące (art. 42b ust. 1 VAT — weryfikuj w ISAP)
Wiążąca: dla organu i podatnika (przez 5 lat — weryfikuj aktualne przepisy)
```

### ⭐⭐⭐ GRUPA VAT (art. 8c–8e, art. 15a, art. 2 pkt 47 ustawy VAT) —
dodane 2026-08-12, uzupełnienie luki zidentyfikowanej w audycie pokrycia
DR-06 (dotąd CAŁKOWICIE nieobecna — instytucja funkcjonująca w Polsce od
1.01.2023 r.)

```
⭐⭐ DEFINICJA (art. 2 pkt 47): grupa VAT to grupa PODMIOTÓW powiązanych
  finansowo, ekonomicznie i organizacyjnie, ZAREJESTROWANA jako
  PODATNIK podatku VAT — sama grupa (NIE poszczególni członkowie)
  STAJE SIĘ odrębnym podatnikiem VAT

⭐⭐⭐ WARUNKI UTWORZENIA (art. 15a ust. 1, 3–5) — WSZYSTKIE TRZY
  powiązania ŁĄCZNIE:
  1) POWIĄZANIE FINANSOWE (ust. 3): JEDEN z podatników POSIADA
     BEZPOŚREDNIO ponad 50% udziałów/akcji W kapitale zakładowym LUB
     ponad 50% praw GŁOSU w organach kontrolnych/stanowiących/
     zarządzających LUB ponad 50% prawa DO udziału w zysku — KAŻDEGO
     z pozostałych członków grupy
  2) POWIĄZANIE EKONOMICZNE (ust. 4): przedmiot GŁÓWNEJ działalności
     członków MA ten SAM charakter, LUB rodzaje działalności
     poszczególnych członków UZUPEŁNIAJĄ się i są WZAJEMNIE
     zależne, LUB członek grupy PROWADZI działalność, Z KTÓREJ W
     CAŁOŚCI lub W DUŻEJ mierze KORZYSTAJĄ inni członkowie
  3) POWIĄZANIE ORGANIZACYJNE: podmioty PRAWNIE LUB faktycznie,
     BEZPOŚREDNIO lub POŚREDNIO, znajdują się POD wspólnym
     KIEROWNICTWEM, LUB organizują swoje działania CAŁKOWICIE lub
     CZĘŚCIOWO W POROZUMIENIU

⭐ KTO MOŻE WEJŚĆ DO GRUPY: podatnicy POSIADAJĄCY siedzibę NA
  terytorium kraju ORAZ podatnicy NIEPOSIADAJĄCY siedziby w kraju —
  W ZAKRESIE, W JAKIM prowadzą działalność NA terytorium kraju ZA
  POŚREDNICTWEM oddziału POŁOŻONEGO w Polsce (art. 15a ust. 2)

⭐⭐ OGRANICZENIA STRUKTURALNE:
  □ Podmiot MOŻE być członkiem TYLKO JEDNEJ grupy VAT jednocześnie
  □ Grupa VAT NIE MOŻE być członkiem INNEJ grupy VAT
  □ W TRAKCIE trwania umowy grupa NIE MOŻE być rozszerzona O nowych
    członków ANI pomniejszona O żadnego Z dotychczasowych — SKŁAD
    jest ZAMROŻONY na cały okres obowiązywania umowy

⭐⭐⭐ SKUTEK PODSTAWOWY — NEUTRALNOŚĆ WEWNĘTRZNA (art. 8c ust. 1):
  dostawy TOWARÓW i świadczenie USŁUG DOKONYWANE POMIĘDZY członkami
  grupy VAT NIE STANOWIĄ czynności OPODATKOWANYCH — transakcje
  WEWNĄTRZGRUPOWE są POZA zakresem VAT (brak faktury Z wykazanym
  podatkiem, WYSTARCZY nota KSIĘGOWA lub inny dokument WEWNĘTRZNY)
  → ⚠️ NIE MYLIĆ Z "grupą kapitałową PIT/CIT" (podatkowa grupa
    kapitałowa, PGK) — TO ODRĘBNA instytucja NA gruncie CIT, Z
    WŁASNYMI, INNYMI warunkami — grupa VAT i PGK MOGĄ, ale NIE MUSZĄ,
    obejmować TE SAME podmioty jednocześnie

⭐⭐ CZYNNOŚCI Z PODMIOTAMI SPOZA GRUPY: dostawy/usługi WYKONANE przez
  CZŁONKA grupy NA rzecz podmiotu SPOZA grupy (lub ODWROTNIE) UWAŻA
  SIĘ za dokonane PRZEZ CAŁĄ grupę VAT — czynności "NA zewnątrz"
  wykazuje się TAK, jakby dokonała ich SAMA grupa jako JEDEN podatnik
  → ⭐ ODDZIAŁ zagranicznego podatnika należący DO grupy: czynności
    dokonane PRZEZ centralę na rzecz TEGO oddziału TRAKTUJE SIĘ jako
    dokonane NA rzecz grupy VAT (art. 8c ust. 2–3 — analiza analogiczna
    DO orzecznictwa TSUE ws. Skandia)

⭐⭐⭐ ODPOWIEDZIALNOŚĆ SOLIDARNA (art. 8e): za ZALEGŁOŚCI podatkowe
  grupy VAT Z tytułu VAT ODPOWIADA SOLIDARNIE CAŁYM swoim MAJĄTKIEM
  KAŻDY Z członków grupy — RÓWNIEŻ PO utracie PRZEZ grupę statusu
  podatnika, ZA okres, W KTÓRYM BYŁ jej członkiem — TO KLUCZOWE
  ryzyko PRZY doradztwie transakcyjnym (np. NABYCIE udziałów W spółce
  będącej CZŁONKIEM grupy VAT — nabywca PRZEJMUJE ryzyko solidarnej
  odpowiedzialności ZA zaległości CAŁEJ grupy z okresu członkostwa)

⭐⭐ PRZEDSTAWICIEL GRUPY VAT (art. 15a ust. 11 i n.):
  □ Członkowie WYZNACZAJĄ spośród siebie PRZEDSTAWICIELA —
    reprezentuje grupę W zakresie JEJ praw i OBOWIĄZKÓW wobec organu
  □ SKŁADA zgłoszenie rejestracyjne VAT-R (Z ZAZNACZENIEM, że
    podatnikiem JEST grupa VAT) WRAZ Z umową o UTWORZENIU grupy —
    naczelnik US WERYFIKUJE przesłanki, PRZED rejestracją
  □ ⚠️ REJESTRACJĘ NALEŻY zgłosić Z ODPOWIEDNIM wyprzedzeniem względem
    daty WSKAZANEJ w umowie — grupa NABYWA status podatnika Z DNIEM
    wskazanym W umowie, NIE WCZEŚNIEJ jednak NIŻ Z dniem FAKTYCZNEJ
    rejestracji (art. 96 ust. 4) — JEŻELI przesłanki NIE zostaną
    POTWIERDZONE, naczelnik ODMAWIA rejestracji, ZAWIADAMIAJĄC
    przedstawiciela
  □ SKŁADA zbiorczy JPK w IMIENIU grupy (JPK_GV) ORAZ ODRĘBNĄ,
    ELEKTRONICZNĄ ewidencję czynności WEWNĄTRZGRUPOWYCH — NA żądanie
    organu udostępnia się JĄ w TERMINIE 7 dni OD doręczenia żądania
  □ OBOWIĄZEK zgłoszenia zmian W stanie faktycznym/prawnym
    SKUTKUJĄCYCH naruszeniem WARUNKÓW uznania grupy ZA podatnika — W
    TERMINIE 14 DNI od ZAISTNIENIA zmiany

⭐⭐ PRZEDŁUŻENIE FUNKCJONOWANIA GRUPY: NOWĄ umowę PRZEDŁUŻAJĄCĄ
  działanie ISTNIEJĄCEJ grupy PRZEDSTAWICIEL składa naczelnikowi W
  TERMINIE 30 DNI PRZED wygaśnięciem DOTYCHCZASOWEJ umowy

⭐⭐⭐ UTRATA STATUSU PODATNIKA — DWIE ODRĘBNE sytuacje:
  1) Z DNIEM POPRZEDZAJĄCYM dzień WYSTĄPIENIA zmian W stanie
     faktycznym/prawnym SKUTKUJĄCYCH naruszeniem WARUNKÓW (np. spadek
     udziału PONIŻEJ 50%, ZERWANIE powiązania ekonomicznego lub
     organizacyjnego) — ⚠️ SKUTEK działa WSTECZ do dnia
     POPRZEDZAJĄCEGO naruszenie, NIE od dnia JEGO stwierdzenia PRZEZ
     organ
  2) Z UPŁYWEM terminu, NA jaki grupa ZOSTAŁA utworzona (JEŚLI umowa
     NIE zostanie PRZEDŁUŻONA w terminie 30 dni)
  → ⭐ ROZLICZENIE PO utracie statusu (art. 8d): W deklaracji ZA
    PIERWSZY okres PO utracie statusu, BYLI członkowie ROZLICZAJĄ SIĘ
    JUŻ indywidualnie — GRUPA składa OSTATNIĄ deklarację ZA okres, W
    KTÓRYM utraciła STATUS; NADWYŻKA podatku naliczonego Z tej
    deklaracji PODLEGA zwrotowi NA rzecz przedstawiciela LUB
    odliczeniu W jego rozliczeniu ZA kolejny okres (art. 87
    stosowany ODPOWIEDNIO); przedstawiciel MOŻE nadal KORYGOWAĆ
    rozliczenia ZA okresy, GDY grupa BYŁA podatnikiem

⭐ PROPORCJA ODLICZENIA VAT (art. 90 ust. 10c) — ISTOTNA komplikacja
  PRAKTYCZNA: przy GRUPACH MIESZANYCH (część członków wykonuje
  sprzedaż OPODATKOWANĄ, część ZWOLNIONĄ lub NIEPODLEGAJĄCĄ VAT) —
  przepisy WYMAGAJĄ liczenia proporcji ODLICZENIA ODRĘBNIE DLA
  KAŻDEGO członka Z osobna (NIE jednej, zbiorczej proporcji DLA
  całej grupy) — USTAWA NIE precyzuje szczegółowej METODOLOGII przy
  zakupach WSPÓLNYCH — W PRAKTYCE rekomenduje się W PIERWSZEJ
  kolejności USTALENIE, jakiego RODZAJU sprzedaży (dającej/
  niedającej prawo DO odliczenia) DOTYCZY dany zakup, NIEZALEŻNIE
  OD tego, KTÓRY członek GO dokonał i KTÓRY dokonuje POWIĄZANEJ
  sprzedaży

⭐ RYZYKO PRAKTYCZNE — UTRATA powiązania EKONOMICZNEGO wskutek
  RESTRUKTURYZACJI: odnotowany W praktyce przypadek (2026), GDZIE
  organ podatkowy UZNAŁ, że W WYNIKU zmian W strukturze DZIAŁALNOŚCI
  członków grupa PRZESTAŁA spełniać PRZESŁANKĘ powiązania
  ekonomicznego — ⚠️ PRZY doradztwie DLA grup VAT KONIECZNE jest
  BIEŻĄCE monitorowanie, CZY planowane zmiany W przedmiocie
  działalności POSZCZEGÓLNYCH członków NIE NARUSZAJĄ warunku Z art.
  15a ust. 4 — SKUTKIEM jest UTRATA statusu ZE skutkiem WSTECZNYM

⭐ KSeF W GRUPIE VAT: grupa VAT jest CZYNNYM podatnikiem VAT, WIĘC
  PODLEGA OBOWIĄZKOWI KSeF na OGÓLNYCH zasadach (patrz sekcja KSeF
  wyżej) — CZŁONEK grupy MOŻE być UPRAWNIONY DO wystawiania faktur
  W IMIENIU grupy OBOK przedstawiciela, jeśli TAK ustalono W
  uprawnieniach NADANYCH W systemie

⭐ DOBROWOLNOŚĆ: zawiązanie grupy VAT MA charakter FAKULTATYWNY —
  BRAK obowiązku DLA podmiotów SPEŁNIAJĄCYCH przesłanki powiązania —
  DECYZJA leży PO stronie PRZEDSIĘBIORSTW (art. 11 dyrektywy
  2006/112/WE jako PODSTAWA unijna, implementowana FAKULTATYWNIE
  przez PAŃSTWA członkowskie)

Checklist praktyczny:
□ Czy WSZYSTKIE TRZY powiązania (finansowe, ekonomiczne, organizacyjne)
  występują ŁĄCZNIE, w dacie ZAWARCIA umowy i W SPOSÓB TRWAŁY — nie
  tylko w momencie rejestracji
□ Czy PRZEDSTAWICIEL złożył VAT-R Z umową Z ODPOWIEDNIM wyprzedzeniem
  przed PLANOWANĄ datą nabycia statusu podatnika
□ Czy PROWADZONA jest wymagana, ODRĘBNA ewidencja elektroniczna
  transakcji WEWNĄTRZGRUPOWYCH (gotowość NA żądanie organu W 7 dni)
□ Przy GRUPACH mieszanych (opodatkowana + zwolniona sprzedaż) — czy
  proporcja ODLICZENIA liczona jest ODRĘBNIE dla KAŻDEGO członka
□ Czy MONITOROWANE są zmiany STRUKTURALNE/własnościowe u członków POD
  kątem ZACHOWANIA warunku powiązania — RYZYKO wstecznej utraty statusu
□ PRZY transakcjach M&A dotyczących spółki będącej CZŁONKIEM grupy VAT
  — czy UWZGLĘDNIONO ryzyko SOLIDARNEJ odpowiedzialności nabywcy ZA
  zaległości CAŁEJ grupy z okresu członkostwa zbywanej spółki
□ Czy termin 30 DNI przed wygaśnięciem umowy NA jej PRZEDŁUŻENIE jest
  PILNOWANY w kalendarzu sprawy

⚠️ Weryfikuj aktualne brzmienie art. 8c–8e i 15a w ISAP — instytucja
  relatywnie MŁODA (od 2023 r.), praktyka INTERPRETACYJNA (KIS, TSUE
  ws. Skandia) NADAL się kształtuje.
```

### ⭐⭐⭐ MIEJSCE ŚWIADCZENIA USŁUG (Dział V Rozdział 3, art. 28a–28o
ustawy VAT) — dodane 2026-08-12, uzupełnienie luki zidentyfikowanej w
audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne — mechanizm
FUNDAMENTALNY, decydujący CZY dana usługa W OGÓLE podlega polskiemu
VAT)

```
⭐⭐⭐ ZNACZENIE PRAKTYCZNE: "miejsce świadczenia" TO w istocie miejsce
  POWSTANIA obowiązku podatkowego — DECYDUJE, CZY usługa PODLEGA
  polskiemu VAT, CZY VAT innego KRAJU (lub W OGÓLE nie podlega VAT w
  UE) — BŁĘDNE ustalenie miejsca świadczenia SKUTKUJE zaniżeniem LUB
  zawyżeniem podatku, NIEZALEŻNIE od PRAWIDŁOWO ustalonej stawki

⭐⭐ DEFINICJA "PODATNIKA" NA POTRZEBY TEGO ROZDZIAŁU (art. 28a) —
  SZERSZA niż ogólna definicja Z art. 15:
  → podmiot SAMODZIELNIE wykonujący działalność GOSPODARCZĄ (art. 15
    ust. 1–2), NIEZALEŻNIE od CELU i REZULTATU tej działalności
  → osoba PRAWNA niebędąca podatnikiem wg powyższego, ALE OBOWIĄZANA
    do IDENTYFIKACJI na potrzeby VAT/podatku o PODOBNYM charakterze
  → OBEJMUJE również podatnika Z INNEGO państwa członkowskiego ORAZ
    podatnika Z kraju TRZECIEGO — status "PODATNIKA" NA gruncie
    Działu V NIE jest ograniczony DO podmiotów polskich

⭐⭐⭐ ZASADA OGÓLNA #1 — USŁUGI B2B (art. 28b ust. 1): miejscem
  świadczenia USŁUG na rzecz PODATNIKA jest miejsce, W KTÓRYM
  usługobiorca POSIADA SIEDZIBĘ działalności gospodarczej — ⚠️
  DECYDUJE siedziba NABYWCY, nie sprzedawcy (odwrotnie NIŻ przy B2C)
  □ WYJĄTEK — STAŁE MIEJSCE PROWADZENIA DZIAŁALNOŚCI (FE, ust. 2):
    JEŚLI usługa jest świadczona DLA stałego miejsca prowadzenia
    działalności usługobiorcy, POŁOŻONEGO w INNYM miejscu niż JEGO
    siedziba — MIEJSCEM świadczenia JEST TO stałe miejsce
  □ WYJĄTEK — BRAK siedziby/FE (ust. 3): miejscem świadczenia jest
    MIEJSCE stałego ZAMIESZKANIA/zwykłego pobytu usługobiorcy
  □ WYJĄTEK — CELE OSOBISTE (ust. 4): usługi PRZEZNACZONE wyłącznie
    NA cele osobiste PODATNIKA/pracowników/wspólników — STOSUJE SIĘ
    odpowiednio zasady Z art. 28c (jak DLA konsumenta)

⭐⭐⭐ ZASADA OGÓLNA #2 — USŁUGI B2C (art. 28c ust. 1): miejscem
  świadczenia USŁUG na rzecz PODMIOTÓW niebędących podatnikami
  (konsumentów) jest miejsce, W KTÓRYM usługodawca POSIADA siedzibę
  działalności GOSPODARCZEJ — ⚠️ DECYDUJE siedziba SPRZEDAWCY (ODWROTNIE
  niż PRZY B2B) — POLSKI usługodawca ŚWIADCZĄCY na rzecz konsumenta
  (np. Z INNEGO kraju UE) CO DO ZASADY rozlicza VAT W Polsce, chyba że
  ZASTOSOWANIE ma jeden Z licznych WYJĄTKÓW poniżej
  □ ANALOGICZNY wyjątek FE PO stronie USŁUGODAWCY (ust. 2)

⭐⭐⭐ KATALOG WYJĄTKÓW OD ZASAD OGÓLNYCH (art. 28d–28n) — DLA
  KAŻDEGO wyjątku sprawdź, CZY dotyczy TYLKO B2C, TYLKO B2B, CZY OBU:

  → art. 28d — POŚREDNICY działający W IMIENIU i NA rzecz osób
    NIEBĘDĄCYCH podatnikami: miejsce, GDZIE dokonano TRANSAKCJI
    podstawowej (dotyczy WYŁĄCZNIE B2C — przy B2B stosuje SIĘ zasadę
    ogólną art. 28b)

  → art. 28e — USŁUGI ZWIĄZANE Z NIERUCHOMOŚCIĄ (rzeczoznawcy,
    pośrednicy W obrocie nieruchomościami, ZAKWATEROWANIE, usługi
    przygotowania/koordynacji ROBÓT budowlanych, UDZIELANIE prawa
    użytkowania NIERUCHOMOŚCI): miejsce POŁOŻENIA nieruchomości —
    ⭐ DOTYCZY OBU (B2B i B2C) — WYJĄTEK BEZWZGLĘDNY, NIEZALEŻNY OD
    statusu nabywcy — ⚠️ CZĘSTY SPÓR: CZY usługa jest "WYSTARCZAJĄCO
    związana" Z KONKRETNĄ nieruchomością (art. 31a rozp. 282/2011
    doprecyzowuje: WYMAGANY bezpośredni ZWIĄZEK z OKREŚLONĄ
    nieruchomością, NIE wystarczy OGÓLNY związek Z branżą
    nieruchomości)

  → art. 28f — TRANSPORT PASAŻERÓW: miejsce, GDZIE OdBYWA SIĘ
    transport, proporcjonalnie DO POKONANYCH odległości (dotyczy OBU)
    | TRANSPORT TOWARÓW: DLA B2B — zasada ogólna art. 28b (siedziba
    nabywcy); DLA B2C — miejsce ROZPOCZĘCIA transportu, Z WYJĄTKIEM
    transportu WEWNĄTRZWSPÓLNOTOWEGO (miejsce ROZPOCZĘCIA, ALE inne
    zasady PRZY podaniu numeru VAT — ⚠️ SZCZEGÓŁOWA analiza WYMAGA
    odrębnej weryfikacji przy TRANSPORCIE międzynarodowym)

  → art. 28g — USŁUGI KULTURALNE, artystyczne, SPORTOWE, naukowe,
    edukacyjne, ROZRYWKOWE i PODOBNE (WSTĘP na imprezy + usługi
    POMOCNICZE): DLA B2C — miejsce, GDZIE usługi SĄ faktycznie
    wykonywane; DLA B2B — WSTĘP na TAKIE imprezy: miejsce, GDZIE
    impreza SIĘ odbywa (POZOSTAŁE usługi B2B ZWIĄZANE Z tą
    działalnością — zasada OGÓLNA art. 28b)

  → art. 28h–28h1 — USŁUGI POMOCNICZE do transportu (załadunek,
    rozładunek, przeładunek) I WYCENA/prace NA rzeczowym majątku
    RUCHOMYM: DLA B2C — miejsce FAKTYCZNEGO wykonania

  → art. 28i — USŁUGI RESTAURACYJNE i CATERINGOWE: miejsce
    FAKTYCZNEGO wykonania (dotyczy OBU) — ⭐ WYJĄTEK: GDY usługi TE są
    faktycznie WYKONYWANE na POKŁADACH statków, statków POWIETRZNYCH
    lub W pociągach PODCZAS części transportu PASAŻERÓW wykonanej NA
    terytorium UE — miejsce ROZPOCZĘCIA transportu PASAŻERÓW (art.
    28i ust. 2, w ZW. z art. 28f ust. 1a) — POWIĄZANIE Z mechanizmem
    "gastronomia/catering" opisanym W module klasyfikacji VAT
    (STAWKA), ALE to ODRĘBNE zagadnienie (MIEJSCE vs STAWKA)

  → art. 28j — KRÓTKOTERMINOWY wynajem ŚRODKÓW transportu (do 30 dni,
    a DLA jednostek pływających DO 90 dni): miejsce, GDZIE środek
    transportu jest FAKTYCZNIE oddawany DO dyspozycji usługobiorcy
    (dotyczy OBU) | DŁUGOTERMINOWY wynajem B2C: miejsce SIEDZIBY/
    zamieszkania usługobiorcy, Z WYJĄTKIEM jednostek pływających
    rekreacyjnych (miejsce ODDANIA do dyspozycji, PRZY dodatkowych
    warunkach)

  → art. 28k — USŁUGI TELEKOMUNIKACYJNE, NADAWCZE i ELEKTRONICZNE
    na rzecz PODMIOTÓW niebędących podatnikami: miejsce, GDZIE
    nabywca POSIADA siedzibę/stałe MIEJSCE zamieszkania/zwykłe
    miejsce POBYTU — ⭐⭐ KLUCZOWE dla e-commerce/usług CYFROWYCH:
    SPRZEDAWCA rozlicza VAT WEDŁUG stawki KRAJU KONSUMENTA, NIE
    własnego kraju — ⭐ POWIĄZANIE z mechanizmem VAT OSS (sekcja
    wyżej W tym module) — REJESTRACJA W OSS pozwala UNIKNĄĆ
    rejestracji LOKALNEJ w KAŻDYM państwie nabywcy

  → art. 28l — "USŁUGI NIEMATERIALNE" (m.in. DORADCZE, prawnicze,
    księgowe, INŻYNIERSKIE, tłumaczeń, REKLAMY, przetwarzania
    danych, dostarczania INFORMACJI, bankowe/finansowe/
    ubezpieczeniowe, UDOSTĘPNIANIA personelu, WYNAJMU rzeczy
    ruchomych — Z WYŁĄCZENIEM środków TRANSPORTU): DLA B2C, GDY
    nabywca MA siedzibę/miejsce zamieszkania POZA terytorium UE —
    miejsce SIEDZIBY/zamieszkania NABYWCY (a NIE usługodawcy) — ⭐
    ISTOTNE dla POLSKICH kancelarii/firm DORADCZYCH świadczących
    USŁUGI dla klientów SPOZA UE (np. USA, Wielka Brytania POZA
    ramami odrębnych umów) — TAKA usługa MOŻE być POZA zakresem
    polskiego VAT

  → art. 28n — USŁUGI TURYSTYKI rozliczane W procedurze MARŻY:
    miejsce SIEDZIBY/stałego miejsca prowadzenia działalności/
    zwykłego miejsca POBYTU usługodawcy — STATUS usługobiorcy NIE MA
    znaczenia (JEDYNY wyjątek W całym katalogu, GDZIE nie ROZRÓŻNIA
    się B2B/B2C)

  → art. 28o — DELEGACJA dla MINISTRA finansów DO określenia W
    rozporządzeniu INNEGO miejsca świadczenia W szczególnych
    przypadkach — SPRAWDŹ aktualne rozporządzenia WYKONAWCZE przy
    nietypowym STANIE faktycznym

⭐⭐⭐ STAŁE MIEJSCE PROWADZENIA DZIAŁALNOŚCI (FE / "Fixed
  Establishment") — KLUCZOWE, SPORNE pojęcie warunkujące ZASTOSOWANIE
  wyjątku Z art. 28b ust. 2:
  □ PODSTAWA: art. 11 rozporządzenia WYKONAWCZEGO Rady (UE) 282/2011
    — brak ODRĘBNEJ definicji W samej ustawie VAT, STOSUJE SIĘ
    BEZPOŚREDNIO przepis UNIJNY
  □ DEFINICJA: miejsce INNE niż siedziba, charakteryzujące SIĘ
    WYSTARCZAJĄCĄ stałością ORAZ odpowiednią STRUKTURĄ zaplecza
    PERSONALNEGO i TECHNICZNEGO, umożliwiającą ODBIÓR/wykorzystanie
    (jako NABYWCA) lub ŚWIADCZENIE (jako sprzedawca) usług
  □ SAM numer VAT NIE JEST wystarczający DO uznania istnienia FE
    (utrwalone orzecznictwo TSUE)
  □ ⭐⭐⭐ ORZECZNICTWO TSUE — LINIA interpretacyjna:
    → C-931/19 Titanium: SAMA nieruchomość BEZ zasobów LUDZKICH
      umożliwiających SAMODZIELNE działanie NIE stanowi FE (WYNAJEM
      nieruchomości bez WŁASNEGO personelu na MIEJSCU — NIE tworzy FE)
    → C-547/18 Dong Yang Electronics: sama KONTROLA kapitałowa nad
      spółką ZALEŻNĄ (spółka-córka) NIE oznacza AUTOMATYCZNIE, że
      spółka MATKA ma FE W kraju spółki córki
    → C-333/20 Berlin Chemie: WŁASNE zaplecze NIE jest konieczne —
      WYSTARCZY, że podatnik jest UPRAWNIONY dysponować cudzym
      zapleczem TAK, jakby BYŁO własne (np. NA podstawie umowy o
      świadczenie USŁUG) — ALE samo ODDELEGOWANIE czynności
      technicznych innemu PODMIOTOWI (podwykonawcy) NIE tworzy
      AUTOMATYCZNIE FE
    → C-232/22 Cabot Plastics (29.06.2023, ⚠️ ZWERYFIKUJ aktualność
      cytowania w konkretnej sprawie): potwierdza, że MINIMALNA
      trwałość W postaci SAMEGO zgromadzenia zasobów, ANI sama
      kontrola EKONOMICZNA nad zapleczem podwykonawcy — NIE
      WYSTARCZAJĄ
    → C-533/22 SC Adient: KONTYNUACJA linii ZAOSTRZAJĄCEJ kryteria —
      usługodawca i JEGO zaplecze u PODWYKONAWCY NIE tworzą
      AUTOMATYCZNIE FE nabywcy TYLKO dlatego, że USŁUGI są
      świadczone WYŁĄCZNIE na jego rzecz
  □ TRZY PRZESŁANKI łącznie (wg praktyki/objaśnień MF): (1)
    ODPOWIEDNIE zaplecze PERSONALNE i techniczne, (2) STRUKTURA
    umożliwiająca SAMODZIELNE wykonywanie czynności opodatkowanych,
    (3) WYSTARCZAJĄCA stałość
  □ ⭐ POWIĄZANIE Z KSeF: OD 1.02.2026 r. posiadanie FE W Polsce
    (przez PODMIOT zagraniczny) MOŻE skutkować OBOWIĄZKIEM
    wystawiania faktur W KSeF — TYLKO GDY FE "CZYNNIE uczestniczy"
    W konkretnej TRANSAKCJI — MF opublikowało OBJAŚNIENIA W tym
    zakresie 28.01.2026 r. — ⚠️ WERYFIKUJ aktualną TREŚĆ objaśnień
    przy SPRAWACH z udziałem podmiotów ZAGRANICZNYCH
  □ ⚠️ ROZBIEŻNOŚĆ: wykładnia TSUE jest OGÓLNIE korzystniejsza DLA
    podatników niż PRAKTYKA polskich organów PODATKOWYCH — choć
    odnotowuje SIĘ (2026) pewne ZŁAGODZENIE podejścia KRAJOWEGO —
    PRZY sporze rozważ powołanie SIĘ wprost na LINIĘ TSUE

⭐ ODRĘBNOŚĆ OD "ZAKŁADU" W PODATKACH DOCHODOWYCH: FE (fixed
  establishment) funkcjonuje WYŁĄCZNIE na gruncie VAT i jest
  NIEZALEŻNE pojęciowo OD "zakładu" (permanent establishment) na
  gruncie CIT/umów O unikaniu podwójnego opodatkowania — ⚠️ ISTNIENIE
  zakładu CIT NIE przesądza AUTOMATYCZNIE o istnieniu FE dla VAT (i
  ODWROTNIE) — WYMAGANA odrębna ANALIZA dla każdego podatku

⭐ POWIĄZANIE Z WNT/IMPORTEM USŁUG (sekcja wyżej w tym module):
  USTALENIE miejsca świadczenia USŁUGI (art. 28b) jest KROKIEM
  POPRZEDZAJĄCYM analizę, CZY dochodzi DO importu usług Z
  odwrotnym obciążeniem — JEŚLI miejscem świadczenia usługi
  nabywanej PRZEZ polskiego podatnika OD zagranicznego usługodawcy
  jest POLSKA (zasada OGÓLNA art. 28b) — DOPIERO wtedy AKTUALIZUJE
  SIĘ mechanizm importu usług OPISANY wyżej

Checklist praktyczny:
□ Czy usługobiorca JEST podatnikiem W rozumieniu art. 28a (SZERSZA
  definicja niż art. 15) — TO PRZESĄDZA, czy STOSOWAĆ zasadę B2B (28b)
  czy B2C (28c) jako PUNKT wyjścia
□ Czy usługa MIEŚCI SIĘ w KTÓRYMŚ z wyjątków art. 28d–28n — PRZEJRZYJ
  KATALOG ZANIM zastosujesz zasadę OGÓLNĄ
□ PRZY usłudze dotyczącej NIERUCHOMOŚCI (art. 28e) — czy ZWIĄZEK z
  KONKRETNĄ nieruchomością jest WYSTARCZAJĄCO bezpośredni (art. 31a
  rozp. 282/2011), CZY to tylko OGÓLNY związek branżowy
□ Przy TRANSAKCJACH z podmiotem ZAGRANICZNYM — czy KONTRAHENT
  POSIADA FE w Polsce (LUB odwrotnie) — ZWERYFIKUJ wg TRZECH
  przesłanek TSUE, nie POPRZESTAWAJ na SAMYM numerze VAT
□ Czy USTALONE miejsce świadczenia jest SPÓJNE z DEKLAROWANYM
  traktowaniem transakcji NA fakturze (stawka KRAJOWA vs "poza
  zakresem VAT w PL"/"odwrotne obciążenie" vs "NP" — wykaz POZA
  terytorium kraju)
□ Przy USŁUGACH cyfrowych/elektronicznych DLA konsumentów w UE —
  czy ROZWAŻONO rejestrację W OSS zamiast rejestracji LOKALNEJ W
  każdym kraju nabywcy

⚠️ Weryfikuj aktualne brzmienie art. 28a–28o w ISAP oraz NAJNOWSZE
  orzecznictwo TSUE dot. FE — TO OBSZAR o WYSOKIEJ dynamice
  interpretacyjnej, SZCZEGÓLNIE przy transakcjach TRANSGRANICZNYCH
  z udziałem PODMIOTÓW powiązanych/podwykonawców.
```

### ⭐⭐⭐ ZWOLNIENIE PODMIOTOWE (art. 113) I PROCEDURA SME — dodane
2026-08-12, na żądanie użytkownika (priorytet #1 z mapy pokrycia
VAT — dotąd TYLKO przelotna wzmianka wewnątrz innej sekcji)

```
⚠️⚠️ WAŻNA ZMIANA OD 1.01.2026 R.: limit PODWYŻSZONY Z 200 000 ZŁ
  NA **240 000 ZŁ** — ⭐ TA zmiana JEST BARDZO ŚWIEŻA (obowiązuje OD
  początku BIEŻĄCEGO roku) — WIELE starszych, wcześniej
  ZWERYFIKOWANYCH źródeł/materiałów W SYSTEMIE MOŻE nadal cytować
  STARY próg 200 000 zł — SPRAWDŹ i SKORYGUJ WSZĘDZIE, gdzie TEN
  próg JEST wspominany

⭐⭐⭐ PODSTAWOWA ZASADA (art. 113 ust. 1): ZWALNIA SIĘ od podatku
  sprzedaż DOKONYWANĄ przez PODATNIKÓW, U KTÓRYCH wartość SPRZEDAŻY
  NIE PRZEKROCZYŁA łącznie W POPRZEDNIM roku podatkowym kwoty
  **240 000 ZŁ** — DO wartości sprzedaży NIE WLICZA się kwoty
  podatku (LICZY SIĘ NETTO)

⭐⭐ CO WLICZA SIĘ DO LIMITU (art. 2 pkt 22 — DEFINICJA "sprzedaży"):
  ODPŁATNA dostawa TOWARÓW + odpłatne ŚWIADCZENIE usług NA
  terytorium KRAJU + EKSPORT towarów + WDT (wewnątrzwspólnotowa
  dostawa TOWARÓW)

⭐⭐⭐ CO NIE WLICZA SIĘ DO LIMITU (art. 113 ust. 2) — CZĘSTY BŁĄD
  praktyczny:
  → IMPORT USŁUG
  → WNT (wewnątrzwspólnotowe NABYCIE towarów)
  → dostawa, DLA KTÓREJ podatnikiem JEST nabywca (odwrotne
    obciążenie)
  → sprzedaż PODLEGAJĄCA opodatkowaniu POZA terytorium POLSKI
  → WSTO (wewnątrzwspólnotowa SPRZEDAŻ towarów NA odległość)
    NIEOPODATKOWANA na terytorium POLSKI

⭐ PROPORCJONALNY LIMIT dla NOWYCH podmiotów (art. 113 ust. 9):
  przedsiębiorca ROZPOCZYNAJĄCY działalność W TRAKCIE roku LICZY
  limit PROPORCJONALNIE do LICZBY dni PROWADZENIA firmy W danym
  roku (NIE pełne 240 000 zł OD razu)

⭐⭐⭐ MOMENT UTRATY ZWOLNIENIA: zwolnienie TRACI MOC POCZĄWSZY OD
  CZYNNOŚCI, KTÓRĄ PRZEKROCZONO limit — ⭐ NIE od POCZĄTKU miesiąca
  ANI od NASTĘPNEGO dnia — DOKŁADNIE OD TEJ konkretnej TRANSAKCJI,
  KTÓRA spowodowała PRZEKROCZENIE — WYMAGA precyzyjnego ŚLEDZENIA
  narastającej sumy SPRZEDAŻY W trakcie roku

⭐⭐⭐ WYŁĄCZENIA — KATALOG PODATNIKÓW BEZ PRAWA do zwolnienia OD
  PIERWSZEJ sprzedaży (art. 113 ust. 13, ⚠️ NIEZALEŻNIE od
  wysokości OBROTU — MUSZĄ być czynnymi PODATNIKAMI VAT od SAMEGO
  początku): ORIENTACYJNIE OBEJMUJE m.in. dostawę WYROBÓW z metali
  SZLACHETNYCH, świadczenie USŁUG prawniczych, doradczych,
  jubilerskich — ⚠️ PEŁNY katalog WYMAGA weryfikacji NA ISAP przy
  KONKRETNEJ branży, TU podane TYLKO PRZYKŁADY

⭐⭐⭐ ⚡ NOWY MECHANIZM — PROCEDURA SME (art. 113b i n., TRANSGRANICZNE
  zwolnienie DLA małych PRZEDSIĘBIORSTW z UE): ⭐ ROZSZERZENIE
  zwolnienia NA podmioty ZAGRANICZNE (Z INNYCH państw UE) — WARUNKI:
  1) POWIADOMIENIE państwa CZŁONKOWSKIEGO, W KTÓRYM podmiot MA
     SIEDZIBĘ, O zamiarze SKORZYSTANIA ze zwolnienia NA terytorium
     Polski
  2) UZYSKANIE W tym PAŃSTWIE indywidualnego NUMERU identyfikacyjnego
     zawierającego KOD "EX" — SPECJALNY numer NA potrzeby
     korzystania ZE zwolnienia TRANSGRANICZNEGO
  → ⭐ TO GENUINE, NOWA instytucja — ROZSZERZAJĄCA logikę zwolnienia
    podmiotowego POZA granice KRAJOWE, ZGODNIE Z unijną dyrektywą O
    procedurze SME (small AND medium enterprises)

Potwierdzone w 8+ zgodnych, BARDZO aktualnych źródeł 2026
(poradnikprzedsiebiorcy.pl [×2, NAJŚWIEŻSZE — jedno sprzed 20 GODZIN,
drugie sprzed DNIA], BEZPOŚREDNIO inforlex.pl [Praktyczny Leksykon
VAT 2026, maj 2026, Z dosłownym cytatem art. 113 ust. 1], fakturownia.pl
[×2], staniekandpartners.pl [maj 2026], symfonia.pl [czerwiec 2026]).
```

### ⭐ PROCEDURA VAT MARŻA (art. 120 ustawy VAT) — dodane 2026-07-19

```
ZAKRES: WYŁĄCZNIE towary UŻYWANE, dzieła sztuki, przedmioty
  kolekcjonerskie, antyki — NABYTE PRZEZ PODATNIKA W CELU ODSPRZEDAŻY
⚠️ NIE MOŻNA stosować VAT marży do towarów NOWYCH — to częsty błąd

WARUNEK KLUCZOWY — OD KOGO NABYTO towar (art. 120 ust. 10):
  □ Od OSOBY FIZYCZNEJ/prawnej/jednostki BEZ osobowości prawnej,
    NIEBĘDĄCEJ podatnikiem VAT (np. sprzedaż od osoby prywatnej —
    STĄD "FB VAT marża": skup towarów używanych od osób sprzedających
    prywatnie np. na Facebook Marketplace, w celu dalszej odsprzedaży
    w ramach działalności — TO KLASYCZNY, podręcznikowy przypadek
    zastosowania procedury VAT marża)
  □ Od podatników, których dostawa BYŁA zwolniona z VAT (art. 43 ust.
    1 pkt 2 — dostawa towarów używanych wykorzystywanych WYŁĄCZNIE na
    cele zwolnione, lub art. 113 — zwolnienie podmiotowe "drobnych"
    przedsiębiorców)
  □ Od podatników, u których dostawa BYŁA JUŻ opodatkowana procedurą
    marży (żeby uniknąć wielokrotnego opodatkowania tego samego towaru)

DEFINICJA "TOWARU UŻYWANEGO" (art. 120 ust. 1 pkt 4): RUCHOME dobro
  materialne, nadające się do DALSZEGO użytku w aktualnym stanie lub po
  naprawie — WYMAGA rzeczywistego wcześniejszego UŻYTKOWANIA (samo
  nabycie/magazynowanie/posiadanie BEZ faktycznego korzystania NIE
  WYSTARCZA, by uznać towar za "używany" w tym rozumieniu) — NIE
  obejmuje nieruchomości

MECHANIZM: podstawą opodatkowania jest MARŻA = różnica między kwotą
  SPRZEDAŻY a kwotą NABYCIA, POMNIEJSZONA o VAT (nie cała wartość
  sprzedaży, jak przy zasadach ogólnych)

FORMALNOŚCI:
  □ FAKTURA oznaczona jako "procedura marży — towary używane" (bez
    wykazanej kwoty VAT — art. 106e ust. 3 ustawy VAT)
  □ EWIDENCJA osobna: cena nabycia + cena sprzedaży dla KAŻDEJ pozycji
    objętej marżą (jeśli podatnik stosuje RÓWNOLEŻNIE zasady ogólne i
    marżę — konieczny PODZIAŁ ewidencji)
  □ Przy BRAKU dowodu nabycia od osoby prywatnej — orzecznictwo/
    interpretacje dopuszczają stosowanie marży MIMO braku dokumentu
    zakupu, PRZY zachowaniu rzetelnej, własnej ewidencji
  □ Przy EKSPORCIE towaru objętego marżą — sama MARŻA (nie cała
    wartość) podlega stawce 0%

⭐ SPRZEDAŻ PRZEZ OSOBĘ PRYWATNĄ (BEZ działalności gospodarczej):
  osoby fizyczne NIEPROWADZĄCE działalności gospodarczej MOGĄ
  sprzedawać używane rzeczy (np. odzież, elektronikę) OKAZJONALNIE, BEZ
  VAT w ogóle — to NIE JEST "procedura VAT marża" (która dotyczy
  PODATNIKA odsprzedającego towar), tylko zwykła sprzedaż PRYWATNA poza
  systemem VAT — rozróżnij te dwie sytuacje: (1) osoba prywatna
  sprzedająca okazjonalnie na FB → brak VAT w ogóle, (2) podatnik
  SKUPUJĄCY takie towary w celu odsprzedaży w ramach działalności → VAT
  marża od jego DALSZEJ sprzedaży

Checklist praktyczny:
□ Czy towar jest UŻYWANY (rzeczywiste wcześniejsze użytkowanie) czy
  NOWY — marża dotyczy TYLKO używanych
□ Czy sprzedawca (podatnik) NABYŁ towar od podmiotu z KRĘGU art. 120
  ust. 10 (osoba prywatna/zwolniony/już opodatkowany marżą)
□ Czy prowadzona jest WYMAGANA odrębna ewidencja cen nabycia/sprzedaży
□ Czy faktura ma PRAWIDŁOWE oznaczenie "procedura marży" i NIE wykazuje
  kwoty VAT osobno
□ Przy sprzedaży MIESZANEJ (marża + zasady ogólne) — czy ewidencja jest
  PODZIELONA
```

### ⭐ EKSPORT TOWARÓW I WDT — ROZBUDOWANE (dodane 2026-07-19)

> Dotychczas tylko jedna linijka ("0%: Eksport towarów, WDT") w sekcji
> stawek — poniżej pełne warunki stosowania stawki 0%.

```
WDT (Wewnątrzwspólnotowa Dostawa Towarów, art. 13 ustawy VAT) — wywóz
  towaru z Polski na terytorium INNEGO kraju UE, na rzecz podatnika
  zidentyfikowanego dla transakcji wewnątrzwspólnotowych w tym kraju

WARUNKI stawki 0% dla WDT (art. 42 ustawy VAT) — WSZYSTKIE łącznie:
  1) Dostawa NA RZECZ nabywcy posiadającego WAŻNY numer VAT-UE (z
     dwuliterowym prefiksem kraju), podany dostawcy
  2) Dostawca PRZED upływem terminu złożenia deklaracji za dany okres
     POSIADA DOWODY, że towar został WYWIEZIONY z Polski i DOSTARCZONY
     do nabywcy w innym kraju UE (dokumenty przewozowe — CMR, list
     przewozowy, specyfikacja ładunku — art. 42 ust. 3 i art. 45a
     Rozporządzenia UE 282/2011)
  3) Dostawca w chwili składania deklaracji jest ZAREJESTROWANY do
     VAT-UE
  4) Dostawca ZŁOŻYŁ w terminie (do 25. dnia miesiąca po miesiącu
     powstania obowiązku) INFORMACJĘ PODSUMOWUJĄCĄ VAT-UE — BRAK tego
     zgłoszenia WYKLUCZA stawkę 0%, nawet gdy pozostałe warunki
     spełnione

⭐ BRAK DOKUMENTACJI W TERMINIE — CO ROBIĆ (art. 42 ust. 12-12a):
  □ Rozliczenie KWARTALNE: jeśli dokumentów brak przed upływem terminu
    złożenia deklaracji za KOLEJNY kwartał — dostawę wykazuje się z
    KRAJOWĄ stawką (zwykle 23%), NIE jako WDT — możliwa KOREKTA po
    późniejszym zebraniu dokumentów
  □ Analogiczny mechanizm przy rozliczeniu MIESIĘCZNYM
  □ NSA (uchwała I FPS 1/10): WYSTARCZY posiadanie TYLKO NIEKTÓRYCH z
    dowodów wymienionych w ustawie — nie wszystkich naraz, jeśli łącznie
    potwierdzają fakt wywozu/dostarczenia

DOMNIEMANIE z art. 45a Rozporządzenia UE 282/2011: w OKREŚLONYCH
  okolicznościach (np. dwa niesprzeczne dowody od niezależnych stron)
  DOMNIEMYWA SIĘ, że towar został wysłany/dostarczony do innego kraju
  UE — ułatwia spełnienie warunku 2) powyżej

WYJĄTEK PODMIOTOWY: podatnik ZWOLNIONY z VAT (korzystający ze
  zwolnienia podmiotowego) sprzedający towary do UE — CO DO ZASADY NIE
  MA obowiązku wykazywania WDT/składania deklaracji w tym zakresie —
  WYJĄTEK: dostawa NOWYCH ŚRODKÓW TRANSPORTU (zawsze WDT, niezależnie
  od statusu stron)

ORZECZNICTWO — ZAKRES ODPOWIEDZIALNOŚCI DOSTAWCY (TSUE, postanowienie
  z 9.01.2023): CO DO ZASADY nie jest rolą podatnika BADANIE, czy
  kontrahenci na WCZEŚNIEJSZYCH etapach łańcucha dostaw przestrzegali
  przepisów — to ORGAN PODATKOWY musi WYKAZAĆ, że podatnik dopuścił się
  oszustwa VAT lub o nim WIEDZIAŁ/mógł wiedzieć — korzystne dla
  uczciwych podatników w łańcuchach dostaw

EKSPORT TOWARÓW (poza UE, odrębnie od WDT) — analogicznie stawka 0%,
  ale WYMAGA innych dowodów (dokument celny SAD/potwierdzenie wywozu
  poza obszar celny UE), NIE dokumentów przewozowych WEWNĄTRZUNIJNYCH

Checklist praktyczny:
□ Czy nabywca ma WAŻNY i AKTYWNY numer VAT-UE — zweryfikuj w systemie
  VIES PRZED transakcją
□ Czy zebrano WYMAGANE dowody wywozu/dostarczenia PRZED terminem
  deklaracji — jeśli NIE, rozważ wykazanie ze stawką krajową z
  możliwością późniejszej korekty
□ Czy złożono INFORMACJĘ PODSUMOWUJĄCĄ VAT-UE w terminie — BRAK tego
  wyklucza 0% nawet przy pozostałych warunkach spełnionych
□ Czy to WDT (do kraju UE) czy EKSPORT (poza UE) — różne wymogi
  dokumentacyjne dla stawki 0% w każdym przypadku
```

---

## 4a. ⭐⭐⭐ OBOWIĄZEK PODATKOWY — ZASADY OGÓLNE (Dział IV Rozdział 1,
art. 19a ustawy VAT) — dodane 2026-08-12, uzupełnienie luki
zidentyfikowanej w audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne
poza momentem dla WNT — mechanizm FUNDAMENTALNY, decydujący w KTÓRYM
okresie rozliczeniowym wykazać podatek NALEŻNY)

```
⭐⭐⭐ ZNACZENIE PRAKTYCZNE: MOMENT powstania obowiązku podatkowego
  PRZESĄDZA, W KTÓREJ deklaracji/JPK_V7 NALEŻY wykazać podatek NALEŻNY
  — BŁĘDNE ustalenie SKUTKUJE albo ZANIŻENIEM (wykazanie ZA późno —
  ryzyko ODSETEK i sankcji), albo NIEPOTRZEBNYM przyspieszeniem
  rozliczenia (wykazanie ZA wcześnie — ryzyko ZAKWESTIONOWANIA przez
  organ z ODWROTNYCH przyczyn, choć rzadsze W praktyce)

⭐⭐⭐ ZASADA OGÓLNA (art. 19a ust. 1): obowiązek PODATKOWY powstaje Z
  CHWILĄ DOKONANIA dostawy towarów LUB wykonania USŁUGI — NIE Z chwilą
  wystawienia FAKTURY ani Z chwilą ZAPŁATY (⚠️ CZĘSTY błąd praktyczny:
  utożsamianie MOMENTU wystawienia faktury Z momentem powstania
  obowiązku — FAKTURA jest jedynie DOKUMENTEM potwierdzającym
  wcześniej POWSTAŁY obowiązek, NIE jego ŹRÓDŁEM, poza WYJĄTKAMI
  wskazanymi niżej)
  □ USŁUGI PRZYJMOWANE częściowo (ust. 2): usługę UZNAJE się za
    wykonaną RÓWNIEŻ w przypadku wykonania JEJ części, DLA KTÓREJ
    określono ZAPŁATĘ (np. ETAPY dużego projektu Z odrębnym
    wynagrodzeniem ZA każdy etap)

⭐⭐⭐ USŁUGI CIĄGŁE/ROZLICZANE OKRESOWO (ust. 3–4) — SZCZEGÓLNIE
  ISTOTNE dla umów O STAŁĄ obsługę (np. USŁUGI prawne AT/miesięczny
  ryczałt, najem, ABONAMENTY):
  □ USŁUGA, DLA KTÓREJ ustalane SĄ następujące PO sobie terminy
    płatności/rozliczeń → UZNAJE się za WYKONANĄ z UPŁYWEM każdego
    okresu, DO KTÓREGO odnoszą się TE płatności/rozliczenia — AŻ do
    ZAKOŃCZENIA świadczenia usługi
  □ USŁUGA świadczona W sposób CIĄGŁY przez okres DŁUŻSZY niż ROK,
    DLA KTÓREJ w DANYM roku NIE upływają terminy płatności/rozliczeń
    → UZNAJE się za wykonaną Z upływem KAŻDEGO roku podatkowego, AŻ
    do zakończenia ŚWIADCZENIA
  □ ⚠️ ORZECZNICTWO (WSA w Poznaniu, I SA/Po 1297/16): przepis TEN
    NIE odnosi się DO wszystkich usług POWTARZAJĄCYCH się, LECZ
    TYLKO do tych O charakterze RZECZYWIŚCIE ciągłym — GDZIE
    poszczególnych CZYNNOŚCI usługodawcy NIE sposób WYODRĘBNIĆ jako
    osobnych ŚWIADCZEŃ — ROZRÓŻNIENIE "usługa ciągła" vs "usługa
    powtarzalna, ale WYODRĘBNIALNA" jest ŹRÓDŁEM licznych sporów Z
    organami
  □ ⭐ TERMIN faktury PRZY usługach ciągłych: art. 106i ust. 1 —
    NIE później NIŻ 15. dnia MIESIĄCA następującego PO upływie
    okresu rozliczeniowego (LUB po otrzymaniu ZALICZKI w trakcie
    okresu) — POTWIERDZONE interpretacją KIS Z 3.06.2025 (sygn.
    0111-KDIB3-1.4012.212.2025.7.KO)

⭐⭐⭐ ZALICZKI, ZADATKI, PRZEDPŁATY (ust. 8) — ZASADA I WYJĄTEK:
  □ ZASADA: JEŻELI PRZED dokonaniem dostawy/wykonaniem usługi
    otrzymano CAŁOŚĆ lub CZĘŚĆ zapłaty (przedpłata, ZALICZKA,
    zadatek, RATA, wkład budowlany/mieszkaniowy) → obowiązek
    podatkowy POWSTAJE z CHWILĄ jej OTRZYMANIA, w ODNIESIENIU do
    otrzymanej KWOTY
  □ ⭐⭐⭐ WYJĄTEK KLUCZOWY (ust. 8 w zw. Z ust. 5 pkt 4) — ZALICZKA
    NIE rodzi obowiązku PODATKOWEGO przy: dostawie ENERGII
    elektrycznej/cieplnej/CHŁODNICZEJ, gazu PRZEWODOWEGO, usługach Z
    poz. 24–37, 50 i 51 ZAŁĄCZNIKA nr 3 (m.in. dostarczanie WODY,
    odprowadzanie ŚCIEKÓW, wywóz ODPADÓW), NAJMIE, dzierżawie,
    LEASINGU lub usługach O podobnym CHARAKTERZE, OCHRONIE osób/
    mienia, USŁUGACH stałej obsługi PRAWNEJ i BIUROWEJ — DLA tych
    świadczeń obowiązek PODATKOWY powstaje DOPIERO Z chwilą
    WYSTAWIENIA faktury (NIE z chwilą otrzymania zaliczki) —
    ⚠️ POTWIERDZONE liniami ORZECZNICZYMI WSA Kraków (I SA/Kr
    528/16) i NSA (I FSK 1842/16): SAMO ustalenie W umowie terminu
    zapłaty ZALICZKI ANI jej FAKTYCZNA zapłata NIE powoduje
    powstania obowiązku — TYLKO wystawienie FAKTURY
    → ⭐ PRAKTYCZNA DONIOSŁOŚĆ dla PRAKTYKI kancelaryjnej: umowy O
      stałą OBSŁUGĘ prawną Z miesięcznym RYCZAŁTEM należą DO tej
      kategorii — otrzymanie ZALICZKI od klienta NIE generuje
      obowiązku, DOPÓKI nie wystawiono FAKTURY

⭐⭐ SZCZEGÓLNE MOMENTY (ust. 5) — NAJWAŻNIEJSZE PRZYPADKI:
  □ pkt 1 — Z chwilą OTRZYMANIA całości/części ZAPŁATY: komis
    (wydanie TOWARU komisantowi), przeniesienie WŁASNOŚCI Z nakazu
    organu władzy W zamian za ODSZKODOWANIE, dostawa W trybie
    EGZEKUCJI (art. 18), usługi NA zlecenie sądów/prokuratury
    związane Z postępowaniem (Z wyjątkiem usług art. 28b
    stanowiących IMPORT usług), usługi ZWOLNIONE z art. 43 ust. 1
    pkt 37–41 (m.in. UBEZPIECZENIOWE/finansowe)
  □ pkt 3–4 — USŁUGI BUDOWLANE/budowlano-montażowe ORAZ dostawa
    KSIĄŻEK/czasopism (Z zastrzeżeniami) — SZCZEGÓLNY reżim ust. 7:
    GDY podatnik NIE wystawił faktury LUB wystawił JĄ Z opóźnieniem
    → obowiązek POWSTAJE z chwilą UPŁYWU terminu wystawienia
    faktury (art. 106i ust. 3–4), A gdy TERMINU nie określono — Z
    chwilą upływu TERMINU płatności
  □ pkt 4 — MEDIA (energia, gaz, woda, ŚCIEKI) i USŁUGI ciągłe
    wymienione WYŻEJ (najem, ochrona itd.) — obowiązek Z chwilą
    WYSTAWIENIA faktury (POWIĄZANE z wyjątkiem OD zaliczek, ust. 8,
    opisanym wyżej)

⭐ MOMENT DLA BONÓW JEDNEGO PRZEZNACZENIA (ust. 1a, 4a; art. 8a) —
  obowiązek PODATKOWY powstaje Z CHWILĄ dokonania TRANSFERU bonu
  jednego PRZEZNACZENIA (NIE z chwilą jego FAKTYCZNEGO wykorzystania)
  — ⭐ POWIĄZANIE z Rozdziałem 2a ustawy (opodatkowanie PRZY
  stosowaniu bonów) — TEMAT dotąd NIEOPISANY w tym module, SYGNAŁ do
  ewentualnego POGŁĘBIENIA przy sprawie Z udziałem bonów/voucherów

⭐ WNT, WDT, IMPORT TOWARÓW — ODESŁANIE: momenty SZCZEGÓLNE DLA tych
  kategorii transakcji SĄ uregulowane ODRĘBNIE (art. 20 dla WNT/WDT —
  patrz sekcja "WNT I IMPORT USŁUG" wyżej w TYM module, gdzie OPISANO
  termin 15. dnia miesiąca NASTĘPUJĄCEGO po dostawie; art. 19a ust. 9
  DLA importu towarów — MOMENT powstania DŁUGU celnego, Z odrębnymi
  zasadami DLA procedury USZLACHETNIANIA czynnego — ⚠️ WYMAGA odrębnej
  weryfikacji przy KONKRETNEJ sprawie celnej, punkt startowy TYLKO)

Checklist praktyczny:
□ Czy USTALONO faktyczną datę DOKONANIA dostawy/wykonania usługi —
  NIE datę wystawienia FAKTURY ani datę ZAPŁATY — jako PUNKT wyjścia
□ Przy USŁUGACH rozliczanych okresowo — czy ŚWIADCZENIE rzeczywiście
  ma CHARAKTER ciągły (brak MOŻLIWOŚCI wyodrębnienia poszczególnych
  czynności), CZY to tylko usługa POWTARZALNA, lecz WYODRĘBNIALNA —
  RÓŻNE traktowanie na gruncie ust. 3–4
□ Przy OTRZYMANEJ zaliczce — czy ŚWIADCZENIE, którego DOTYCZY,
  znajduje SIĘ na LIŚCIE wyjątków ust. 5 pkt 4 (media, NAJEM, ochrona
  itd.) — JEŚLI tak, obowiązek POWSTAJE dopiero PRZY wystawieniu
  faktury, NIE przy wpłacie
□ Przy USŁUGACH budowlanych — czy FAKTURA została wystawiona W
  terminie (art. 106i ust. 3–4) — PRZY opóźnieniu obowiązek I TAK
  powstaje Z upływem tego TERMINU (nie można GO odroczyć przez
  zwłokę w FAKTUROWANIU)
□ Czy TRANSAKCJA nie jest OBJĘTA odrębnym reżimem szczególnym
  (WNT/WDT/import towarów/bony) WYMAGAJĄCYM odrębnej analizy

⚠️ Weryfikuj aktualne brzmienie art. 19a w ISAP — przepis ma LICZNE
  ustępy Z odesłaniami krzyżowymi (1a, 1b, 4a i in.), CZĘSTO
  nowelizowane PRZY okazji zmian W innych obszarach (KSeF, bony,
  interfejsy elektroniczne) — SPRAWDŹ najnowszą WERSJĘ przy
  konkretnej sprawie.
```

```
Obowiązkowe dla wszystkich czynnych podatników VAT
Składane elektronicznie: do 25. dnia miesiąca następnego
JPK_V7M: rozliczenie miesięczne
JPK_V7K: rozliczenie kwartalne (ale część ewidencyjna co miesiąc)

Błędy w JPK:
  → Korekta: złożona przed wszczęciem kontroli → skuteczna
  → Sankcja: korekta wymuszona (po wezwaniu organu) może nie zwolnić od sankcji
  → ⭐ SPROSTOWANE 2026-08-12: art. 109a przewiduje dodatkowe
    zobowiązanie podatkowe w wysokości **100% kwoty podatku** z faktury
    ujętej w ewidencji, gdy dotyczy ona sprzedaży potwierdzonej
    PARAGONEM BEZ NIP nabywcy — pełna treść i wyłączenia: sekcja 5 tego
    modułu (nie mylić z art. 112b–112c, sekcja 4e)
```

---

## 4b. ⭐⭐⭐ PODSTAWA OPODATKOWANIA I FAKTURY KORYGUJĄCE IN MINUS/IN PLUS
(Dział VI, art. 29a) — dodane 2026-08-12, uzupełnienie luki
zidentyfikowanej w audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne
— DRUGI z dwóch czynników, OBOK stawki, decydujących O wysokości VAT)

```
⭐⭐⭐ ZASADA OGÓLNA (art. 29a ust. 1): podstawą OPODATKOWANIA jest
  WSZYSTKO, co STANOWI zapłatę, KTÓRĄ dokonujący dostawy/usługodawca
  OTRZYMAŁ lub MA otrzymać Z tytułu sprzedaży OD nabywcy, usługobiorcy
  LUB osoby trzeciej — WŁĄCZNIE z otrzymanymi DOTACJAMI, subwencjami I
  innymi dopłatami O PODOBNYM charakterze, MAJĄCYMI bezpośredni WPŁYW
  na CENĘ (⭐ dotacja "DO ceny" WLICZA się do podstawy; dotacja NA
  pokrycie OGÓLNYCH kosztów działalności — CO do zasady NIE)
  → ⭐ TERMINOLOGICZNIE: dawne pojęcie "OBROTU" (sprzed 2014 r.) ZOSTAŁO
    zastąpione "PODSTAWĄ opodatkowania" — GDY starsze przepisy
    wykonawcze LUB orzecznictwo POSŁUGUJĄ się nadal SŁOWEM "obrót",
    NALEŻY je ROZUMIEĆ jako podstawę OPODATKOWANIA w OBECNYM stanie
    prawnym

⭐⭐ CO WLICZA SIĘ DO PODSTAWY (ust. 6):
  1) PODATKI, cła, opłaty I inne należności O podobnym charakterze,
     Z WYJĄTKIEM samego podatku VAT
  2) KOSZTY dodatkowe: PROWIZJE, koszty OPAKOWANIA, transportu I
     ubezpieczenia, POBIERANE przez dostawcę/usługodawcę OD nabywcy
     — ⭐ PRAKTYCZNA konsekwencja: KOSZT wysyłki/przesyłki DOLICZONY
     do sprzedaży NIE jest odrębnym ŚWIADCZENIEM opodatkowanym
     osobno — DZIELI stawkę VAT TOWARU głównego (świadczenie
     KOMPLEKSOWE)

⭐⭐⭐ CO NIE WLICZA SIĘ DO PODSTAWY (ust. 7) — CZĘSTY temat SPORNY:
  1) obniżka CEN w formie RABATU z tytułu WCZEŚNIEJSZEJ zapłaty
     (skonto)
  2) UDZIELONE nabywcy OPUSTY i obniżki CEN, uwzględnione W MOMENCIE
     sprzedaży (RABAT natychmiastowy — NIE wchodzi w OGÓLE do
     podstawy, W przeciwieństwie do rabatu UDZIELONEGO później,
     patrz ust. 10 niżej)
  3) kwoty OTRZYMANE od nabywcy jako ZWROT udokumentowanych wydatków
     PONIESIONYCH w IMIENIU i NA rzecz nabywcy, ujmowane
     PRZEJŚCIOWO w EWIDENCJI (tzw. "PRZEJŚCIÓWKI" — np. OPŁATY
     sądowe/skarbowe UISZCZONE przez pełnomocnika W imieniu klienta
     — ⭐ ISTOTNE dla PRAKTYKI kancelaryjnej: TAKIE kwoty NIE
     zwiększają podstawy OPODATKOWANIA honorarium, POD warunkiem
     właściwej DOKUMENTACJI i ewidencji PRZEJŚCIOWEJ)

⭐⭐⭐ OBNIŻENIE PODSTAWY PO SPRZEDAŻY (ust. 10) — RABAT POŚREDNI i
  BEZPOŚREDNI:
  □ podstawę OBNIŻA się o: kwoty UDZIELONYCH PO dokonaniu sprzedaży
    OPUSTÓW i obniżek CEN; WARTOŚĆ zwróconych towarów I opakowań (Z
    zastrzeżeniem ust. 11-12 — patrz OPAKOWANIA zwrotne niżej);
    zwróconą nabywcy CAŁOŚĆ/część zapłaty PRZED dokonaniem sprzedaży,
    jeśli DO niej NIE doszło; wartość ZWRÓCONYCH dotacji/subwencji
  □ ⭐⭐ RABAT POŚREDNI (art. 29a ust. 10 pkt 1, W ZW. z praktyką
    interpretacyjną): DOPUSZCZALNE jest OBNIŻENIE podstawy
    opodatkowania PRZEZ producenta/dystrybutora WYPŁACAJĄCEGO premię
    pieniężną BEZPOŚREDNIO na rzecz ODBIORCY OSTATECZNEGO (np.
    detalisty), Z KTÓRYM producent NIE ma bezpośredniej RELACJI
    sprzedażowej (transakcja PRZESZŁA przez pośrednika) — POD
    warunkiem, że RABAT nie jest WYNAGRODZENIEM za jakiekolwiek
    ŚWIADCZENIE wzajemne (np. SAMO osiągnięcie określonego OBROTU
    lub TERMINOWA zapłata NIE stanowią usługi — potwierdzone
    interpretacjami KIS, m.in. Z 3.06.2025 i 30.06.2023)

⭐⭐⭐ WARUNKI FORMALNE OBNIŻENIA — FAKTURA KORYGUJĄCA IN MINUS (ust.
  13-14) — ⚠️ ZASADNICZO ZMIENIONE OD 1.02.2026 (KSeF):
  □ ZASADA OGÓLNA (ust. 13): obniżenia PODSTAWY dokonuje SIĘ za
    okres, W KTÓRYM wystawiono FAKTURĘ korygującą — POD warunkiem
    POSIADANIA dokumentacji, Z KTÓREJ wynika, że: (a) UZGODNIONO Z
    nabywcą WARUNKI obniżenia oraz (b) WARUNKI te ZOSTAŁY spełnione
  □ ⭐⭐ "UZGODNIENIE" NIE wymaga odrębnego OŚWIADCZENIA — MOŻE
    wynikać z: postanowienia UMOWY handlowej (np. rabat PO
    przekroczeniu obrotu), REGULAMINU współpracy, PRZYJĘCIA zwrotu
    towaru W systemie, uznania REKLAMACJI, korespondencji MAILOWEJ
    — DECYDUJE uzgodnienie TREŚCI ekonomicznej, NIE formalna
    "akceptacja" samego DOKUMENTU faktury
  □ ⭐⭐⭐ NOWY MECHANIZM art. 29a ust. 13a (OD 1.02.2026, ZWIĄZANY z
    obowiązkowym KSeF): DLA faktur korygujących WYSTAWIONYCH jako
    faktura USTRUKTURYZOWANA (W KSeF) — sprzedawca OBNIŻA podstawę
    ZA okres, W KTÓRYM wystawił fakturę KORYGUJĄCĄ w SYSTEMIE (data
    PRZYJĘCIA przez KSeF PO pozytywnej walidacji) — BEZ konieczności
    POSIADANIA odrębnej dokumentacji POTWIERDZAJĄCEJ uzgodnienie —
    ⚠️ UPROSZCZENIE dotyczy TYLKO formy DOKUMENTU, NIE zwalnia z
    materialnego WARUNKU faktycznego ZAISTNIENIA przesłanek korekty
    (rabat, ZWROT, błąd) — SAMA obecność DOKUMENTU w systemie NIE
    tworzy AUTOMATYCZNIE prawa DO obniżenia VAT
  □ FAKTURA NIE-ustrukturyzowana (papierowa/PDF) — STARA zasada
    NADAL obowiązuje: obniżenie ZA okres OTRZYMANIA potwierdzenia
    otrzymania faktury KORYGUJĄCEJ przez nabywcę
  □ BRAK dokumentacji W momencie wystawienia KOREKTY (przy
    fakturach nie-ustrukturyzowanych) → obniżenia DOKONUJE się W
    rozliczeniu ZA okres, w KTÓRYM dokumentację TĘ uzyskano —
    ODROCZENIE, nie UTRATA prawa
  □ ⭐ WYJĄTKI od WYMOGU dokumentacji uzgodnienia (ust. 15): EKSPORT
    towarów i WDT; dostawy/usługi Z miejscem opodatkowania POZA
    Polską; sprzedaż ENERGII elektrycznej/cieplnej/gazu, USŁUGI
    dystrybucji energii, TELEKOMUNIKACYJNE i NIEKTÓRE inne z zał. 3;
    faktura korygująca W formie ustrukturyzowanej (KSeF — pkt WYŻEJ)

⭐⭐ ZWIĘKSZENIE PODSTAWY — KOREKTA IN PLUS (ust. 17) — ODMIENNE
  zasady TIMING niż PRZY in minus:
  □ JEŻELI przyczyną korekty jest BŁĄD w fakturze PIERWOTNEJ →
    księgowanie NASTĘPUJE wstecz, W okresie wystawienia FAKTURY
    pierwotnej (KOREKTA "historyczna")
  □ JEŻELI przyczyną jest NOWE zdarzenie (np. PODWYŻSZENIE ceny po
    fakcie, dodatkowe usługi DOLICZONE później) → korektę UJMUJE się
    NA bieżąco, w dacie JEJ wystawienia (BEZ cofania się do okresu
    pierwotnego)
  □ PRZY eksporcie towarów I WDT: zwiększenie podstawy NASTĘPUJE nie
    wcześniej NIŻ w deklaracji SKŁADANEJ za okres, W KTÓRYM wykazano
    TE transakcje (SPECYFICZNE ograniczenie czasowe)

⭐⭐ OPAKOWANIA ZWROTNE (ust. 11-12) — ⚠️ POWIĄZANE Z systemem
  KAUCYJNYM (nowelizacja OD 1.01.2025, art. 29a ust. 11a):
  □ Do PODSTAWY nie wlicza się WARTOŚCI opakowania, JEŻELI dostawca
    dokonał DOSTAWY w opakowaniu ZWROTNYM, pobierając KAUCJĘ (LUB
    określając ją W umowie) — dopóki OPAKOWANIE nie zostaje TRWALE
    "sprzedane"
  □ Do podstawy NIE wlicza się RÓWNIEŻ kaucji pobieranej ZA
    opakowanie OBJĘTE systemem KAUCYJNYM (butelki/puszki W systemie
    kaucyjnym WPROWADZONYM ustawą o gospodarce OPAKOWANIAMI — ⭐
    NOWY, odrębny REŻIM od "zwykłych" opakowań zwrotnych)
  □ ⭐⭐⭐ FIKCJA PRAWNA przy NIEZWRÓCENIU (ust. 12): jeśli nabywca NIE
    zwróci opakowania → PODSTAWĘ opodatkowania PODWYŻSZA się o
    WARTOŚĆ tego opakowania — W dniu NASTĘPUJĄCYM po dniu, W KTÓRYM
    umowa PRZEWIDYWAŁA zwrot (JEŚLI termin był OKREŚLONY) — traktuje
    SIĘ to jak FIKCYJNĄ dostawę opakowania NABYWCY w TYM dniu
  □ ⭐⭐ ZMIANA OD 1.02.2026 (art. 29a ust. 15c, DODANY nowelizacją Z
    16.06.2023, art. 1 pkt 2 lit. e — WESZŁA w ŻYCIE dopiero
    1.02.2026): dla OPAKOWAŃ objętych SYSTEMEM kaucyjnym —
    WPROWADZAJĄCY produkty W opakowaniach NA napoje PODWYŻSZA
    podstawę opodatkowania NA ostatni dzień ROKU o RÓŻNICĘ w
    wartości KAUCJI wynikającą Z wprowadzonych PRZEZ niego DO obrotu
    w DANYM roku opakowań — MECHANIZM roczny, ODRĘBNY od zasady
    "dzień PO terminie zwrotu" opisanej wyżej — ⚠️ TA regulacja jest
    ŚWIEŻA (weszła w życie w TRAKCIE bieżącej sesji audytowej) —
    SPRAWDŹ aktualne brzmienie PRZY sprawach Z branży NAPOJOWEJ/
    systemu kaucyjnego

⭐ ODESŁANIA DO PRZEPISÓW SZCZEGÓLNYCH (poza art. 29a):
  □ art. 30a — podstawa OPODATKOWANIA dla WNT (odpowiednie
    stosowanie art. 29a ust. 1-1b, 6, 7, 10, 11, 17)
  □ art. 30b — podstawa OPODATKOWANIA dla IMPORTU towarów (odrębny
    mechanizm, POWIĄZANY z wartością CELNĄ — WYMAGA odrębnej
    weryfikacji przy KONKRETNEJ sprawie celnej)
  □ art. 30c — PRZYPADKI, w KTÓRYCH podstawy opodatkowania SIĘ NIE
    ustala (bony RÓŻNEGO przeznaczenia — POWIĄZANIE z Rozdziałem 2a
    ustawy, DOTĄD nieopisanym w TYM module)
  □ art. 32 — SZACOWANIE podstawy PRZEZ organ PODATKOWY przy
    powiązaniach MIĘDZY stronami transakcji WPŁYWAJĄCYCH na CENĘ
    (odesłanie do CEN transferowych — ⭐ POWIĄZANIE Z mod-CIT,
    sekcja cen TRANSFEROWYCH, jeśli ISTNIEJE)

Checklist praktyczny:
□ Czy DANY element ceny/dopłaty WLICZA się do podstawy (ust. 6) CZY
  jest Z niej WYŁĄCZONY (ust. 7) — SZCZEGÓLNIE przy KOSZTACH
  dodatkowych (transport, OPAKOWANIE) i PRZEJŚCIÓWKACH
□ PRZY korekcie IN MINUS — czy POSIADANA jest dokumentacja
  UZGODNIENIA (chyba że FAKTURA jest USTRUKTURYZOWANA w KSeF — WTEDY
  wymóg ODPADA, ale materialne PRZESŁANKI nadal MUSZĄ być SPEŁNIONE)
□ Czy KOREKTA in plus wynika Z BŁĘDU pierwotnego (→ WSTECZ) czy Z
  NOWEGO zdarzenia (→ NA bieżąco) — TO PRZESĄDZA okres ROZLICZENIOWY
□ PRZY OPAKOWANIACH zwrotnych — czy TO "zwykłe" opakowanie CZY
  opakowanie W systemie KAUCYJNYM — RÓŻNE mechanizmy (dzień PO
  terminie ZWROTU vs roczne ROZLICZENIE różnicy od 1.02.2026)
□ Czy RABAT jest bezpośredni (KONTRAHENT bezpośredni) czy POŚREDNI
  (wypłacony DALSZEMU ogniwu łańcucha) — OBA typy MOGĄ obniżać
  podstawę, ALE wymagają INNEJ dokumentacji

⚠️ Weryfikuj aktualne brzmienie art. 29a w ISAP — przepis BYŁ
  WIELOKROTNIE nowelizowany (SLIM VAT, KSeF, system KAUCYJNY) —
  SZCZEGÓLNIE sprawdź, CZY dana zmiana (np. ust. 13a, 15c) JUŻ
  WESZŁA w życie NA dzień analizy KONKRETNEJ sprawy.
```

---

## 4c. ⭐⭐⭐ ZWOLNIENIA PRZEDMIOTOWE (art. 43) I VAT A NIERUCHOMOŚCI —
dodane 2026-08-12, uzupełnienie DWÓCH luk zidentyfikowanych w audycie
pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne poza fragmentaryczną
wzmianką przy VAT marża — połączone W jedną sekcję, bo NIERUCHOMOŚCI
są NAJWAŻNIEJSZYM praktycznie podzbiorem zwolnień przedmiotowych)

```
⭐⭐ ROZRÓŻNIENIE od zwolnienia PODMIOTOWEGO (art. 113, opisanego
  wyżej): zwolnienie PRZEDMIOTOWE zależy OD rodzaju czynności, NIE od
  wysokości OBROTU — status podatnika (mały/duży) NIE ma znaczenia —
  podatnik NIE wybiera zwolnienia przedmiotowego DOBROWOLNIE (poza
  wyjątkami Z opcją opodatkowania, patrz NIŻEJ) — STOSUJE się je
  OBLIGATORYJNIE, gdy czynność MIEŚCI się w katalogu USTAWOWYM
⭐ ZASADA WYKŁADNI: zwolnienia PRZEDMIOTOWE, jako WYJĄTEK od zasady
  POWSZECHNOŚCI opodatkowania, NALEŻY interpretować ŚCIŚLE — bez
  wykładni ROZSZERZAJĄCEJ ani zawężającej WPROWADZAJĄCEJ pozaustawowe
  WARUNKI zwolnienia

⭐⭐⭐ NAJWAŻNIEJSZE KATEGORIE Z KATALOGU art. 43 ust. 1 (⚠️ katalog
  jest OBSZERNY — poniżej NAJCZĘŚCIEJ spotykane W praktyce, NIE
  pełna lista):
  □ pkt 1-2 — dostawa towarów WYKORZYSTYWANYCH wyłącznie NA cele
    działalności ZWOLNIONEJ, jeśli PRZY nabyciu/imporcie/wytworzeniu
    NIE przysługiwało prawo DO odliczenia VAT — ⭐ RYGORYSTYCZNE
    kryteria, W praktyce RZADKO stosowane przy zbywaniu NIERUCHOMOŚCI
  □ pkt 9-10a — DOSTAWA nieruchomości — patrz ROZBUDOWANA sekcja
    niżej
  □ pkt 17-41 — KATALOG opisowy (wprowadzony NOWELIZACJĄ od
    1.01.2011): usługi POCZTOWE powszechne, FINANSOWE (kredyty,
    pożyczki, gwarancje, TRANSAKCJE płatnicze, obrót WALUTAMI,
    zarządzanie FUNDUSZAMI), UBEZPIECZENIOWE i reasekuracyjne,
    EDUKACYJNE (kształcenie W systemie oświaty, w TYM szkoły
    NIEPUBLICZNE wpisane DO ewidencji JST, nauczanie PRYWATNE
    świadczone PRZEZ nauczycieli — pkt 29, m.in. KOREPETYCJE — ⚠️
    NIE obejmuje DORADZTWA), OPIEKA medyczna (świadczona PRZEZ
    podmioty LECZNICZE w RAMACH działalności LECZNICZEJ — pkt 18-19),
    usługi KULTURALNE (świadczone PRZEZ podmioty prawa PUBLICZNEGO
    lub INNE uznane instytucje KULTURY), transakcje DOTYCZĄCE walut/
    banknotów/monet jako PRAWNEGO środka płatniczego, krew/OSOCZE/
    ludzkie ORGANY, znaczki POCZTOWE sprzedawane PO wartości
    nominalnej, złoto DLA Narodowego Banku Polskiego
  □ ⭐ NAJEM lokali MIESZKALNYCH na cele MIESZKANIOWE (pkt 36) —
    ZWOLNIENIE OBLIGATORYJNE (bez opcji rezygnacji) — ⚠️ CZĘSTY
    przedmiot SPORÓW co DO faktycznego CELU najmu (mieszkaniowy VS
    inny, np. najem NA rzecz firmy w celu ZAKWATEROWANIA pracowników
    — WYMAGA odrębnej weryfikacji CELU rzeczywistego użytku)

⭐⭐⭐ VAT A NIERUCHOMOŚCI — art. 43 ust. 1 pkt 10 i 10a (KLUCZOWY,
  NAJCZĘSTSZY temat W praktyce transakcyjnej):
  □ ZASADA (pkt 10): dostawa BUDYNKÓW, budowli LUB ich części jest
    CO do zasady ZWOLNIONA — Z DWOMA WYJĄTKAMI wykluczającymi
    zwolnienie: (a) dostawa DOKONYWANA w RAMACH pierwszego
    zasiedlenia LUB przed NIM; (b) MIĘDZY pierwszym zasiedleniem A
    dostawą upłynął OKRES KRÓTSZY niż 2 LATA
  □ ⭐⭐⭐ DEFINICJA "PIERWSZEGO ZASIEDLENIA" (art. 2 pkt 14) —
    KLUCZOWA dla całej analizy: oddanie DO użytkowania PIERWSZEMU
    nabywcy/użytkownikowi LUB rozpoczęcie użytkowania NA potrzeby
    WŁASNE budynków/budowli/ich CZĘŚCI, PO: (a) wybudowaniu, LUB
    (b) ULEPSZENIU — JEŚLI wydatki na ULEPSZENIE (w rozumieniu
    przepisów O podatku dochodowym) STANOWIŁY co NAJMNIEJ 30%
    wartości POCZĄTKOWEJ — ⭐ ULEPSZENIE przekraczające TEN próg
    "ODNAWIA" pierwsze zasiedlenie — budynek PONOWNIE staje się
    "NOWY" na potrzeby TEGO przepisu, mimo WCZEŚNIEJSZEGO wieloletniego
    użytkowania
  □ ⭐ SZEROKA wykładnia "pierwszego ZASIEDLENIA" (utrwalona linia
    interpretacyjna): OBEJMUJE zarówno ODDANIE budynku w NAJEM PO
    wybudowaniu, JAK i wykorzystywanie NA potrzeby WŁASNEJ
    działalności GOSPODARCZEJ podatnika — W OBU przypadkach dochodzi
    DO "korzystania" Z budynku uruchamiającego BIEG terminu
  □ ⭐⭐⭐ ZWOLNIENIE "REZERWOWE" — pkt 10a: STOSUJE SIĘ TYLKO gdy
    dostawa NIE kwalifikuje się DO zwolnienia z pkt 10 (tj. GDY
    dostawa jest W ramach pierwszego zasiedlenia/przed NIM lub PRZED
    upływem 2 LAT) — WYMAGA łącznego SPEŁNIENIA DWÓCH przesłanek: (a)
    W stosunku DO budynku NIE przysługiwało dokonującemu DOSTAWY
    prawo DO obniżenia VAT naliczonego, (b) dokonujący DOSTAWY nie
    ponosił WYDATKÓW na jego ULEPSZENIE przekraczających 30% wartości
    początkowej (LUB ponosił, ale WYKORZYSTYWAŁ budynek W stanie
    ULEPSZONYM do CZYNNOŚCI opodatkowanych PRZEZ co NAJMNIEJ 5 LAT)
    — ⚠️ dotyczy WYŁĄCZNIE budynków "GOTOWYCH do oddania DO
    użytkowania" — NIE obejmuje OBIEKTÓW w TRAKCIE budowy (np. same
    ŁAWY fundamentowe)
  □ ⭐⭐⭐ OPCJA OPODATKOWANIA — REZYGNACJA ze zwolnienia (art. 43 ust.
    10-11) — DOSTĘPNA WYŁĄCZNIE dla zwolnienia Z pkt 10 (⚠️ NIE dla
    pkt 10a — TAM strony NIE mają możliwości wyboru opodatkowania):
    → WARUNKI: obie STRONY (dostawca I nabywca) SĄ zarejestrowanymi
      czynnymi PODATNIKAMI VAT ORAZ złożą, PRZED dniem dokonania
      dostawy, właściwemu DLA nabywcy naczelnikowi US ZGODNE
      oświadczenie O wyborze opodatkowania — OŚWIADCZENIE musi
      zawierać: dane IDENTYFIKACYJNE obu stron, PLANOWANĄ datę
      zawarcia UMOWY, adres NIERUCHOMOŚCI
    → ⭐⭐ SENS EKONOMICZNY: pozwala NABYWCY na ODLICZENIE VAT
      naliczonego (JEŚLI nieruchomość BĘDZIE wykorzystywana do
      czynności OPODATKOWANYCH) — BEZ opcji, VAT naliczony PRZY
      zakupie zwolnionym byłby KOSZTEM bezpowrotnym — ⭐ POWIĄZANIE Z
      PCC: wybór OPODATKOWANIA VAT WYŁĄCZA obowiązek ZAPŁATY PCC od
      nabycia (PCC I VAT wykluczają SIĘ wzajemnie CO do zasady — PATRZ
      niżej)
    → ⚠️ MOMENT złożenia OŚWIADCZENIA przy ZALICZCE/zadatku: JEŻELI
      strony PLANUJĄ opodatkowanie, oświadczenie MUSI być złożone
      PRZED dniem ZAPŁATY zaliczki, NIE tylko przed samą DOSTAWĄ —
      W PRZECIWNYM razie zaliczka ROZLICZANA jest jako ZWOLNIONA
      (potwierdzone interpretacją KIS Z 31.01.2020, aktualność
      SPRAWDŹ przy konkretnej sprawie)
    → ⭐⭐⭐ ROZBIEŻNOŚĆ ORZECZNICZA co do FORMY oświadczenia: WSA w
      Bydgoszczy (I SA/Bd 419/24, październik 2024) — brak
      FORMALNEGO oświadczenia z ust. 11 NIE dyskwalifikuje wyboru,
      JEŻELI z TREŚCI aktu notarialnego I okoliczności wynika ZGODNA
      wola stron CO do opodatkowania; NSA (I FSK 540/22, czerwiec
      2025) — PRZECIWNE stanowisko: BEZ oświadczenia spełniającego
      WSZYSTKIE ustawowe wymogi NIE MA skutecznej rezygnacji ze
      zwolnienia — ⚠️ ROZBIEŻNOŚĆ istnieje, NIE jest rozstrzygnięta
      jednolicie — PRZY REDAGOWANIU umowy/aktu notarialnego BEZPIECZNIEJ
      jest zawsze SPEŁNIĆ WSZYSTKIE formalne wymogi ust. 11 wprost,
      NIEZALEŻNIE od korzystniejszej linii WSA Bydgoszcz
    → ⭐ RYZYKO PRAKTYCZNE nieskutecznej rezygnacji (ex post):
      GDY organ PO LATACH stwierdzi, że rezygnacja NIE była skuteczna
      — sprzedawca WYKAZAŁ VAT nienależnie (BRAK prostej ścieżki
      zwrotu), nabywca TRACI prawo do odliczenia Z faktury — ⭐
      REKOMENDACJA: umowa/akt POWINIEN zawierać klauzule
      zabezpieczające NA wypadek zmiany KWALIFIKACJI przez organ
      (kto PONOSI dodatkowy VAT/utracone ODLICZENIE, korekta CENY,
      kto POKRYWA ewentualne PCC)
  □ ⭐ GRUNT dzieli LOS podatkowy budynku (art. 29a ust. 8 — POWIĄZANIE
    z sekcją 4b wyżej): PRZY dostawie budynku/budowli WRAZ z gruntem,
    NA którym są POSADOWIONE — wartości GRUNTU NIE wyodrębnia się Z
    podstawy opodatkowania — GRUNT "dzieli byt PRAWNY" budynku:
    JEŻELI budynek KORZYSTA ze zwolnienia, ZWOLNIONA jest RÓWNIEŻ
    dostawa gruntu (I odwrotnie — PRZY opodatkowaniu budynku,
    opodatkowany JEST też grunt)
  □ ⭐ DZIAŁKI NIEZABUDOWANE — odrębny reżim (art. 43 ust. 1 pkt 9):
    zwolniona jest DOSTAWA terenów NIEZABUDOWANYCH, INNYCH niż
    tereny BUDOWLANE — ⚠️ BRAK opcji rezygnacji Z tego zwolnienia
    (w przeciwieństwie DO pkt 10) — DZIAŁKA budowlana (objęta
    planem ZAGOSPODAROWANIA lub DECYZJĄ o warunkach zabudowy) jest
    OPODATKOWANA obligatoryjnie, NIE zwolniona

⭐⭐ VAT A PCC — WZAJEMNA WYŁĄCZNOŚĆ (odesłanie do mod-ustawa-PCC-i-
  podatek-spadkow-darowizn):
  □ ZASADA OGÓLNA: transakcja OPODATKOWANA VAT (w TYM zwolniona Z
    VAT, JEŚLI zwolnienie WYNIKA z przepisów O VAT) CO DO zasady NIE
    podlega RÓWNOCZEŚNIE PCC — sprzedaż NIERUCHOMOŚCI zwolniona Z
    VAT na PODSTAWIE pkt 10/10a (BEZ wyboru opcji opodatkowania) →
    NABYWCA płaci PCC (2% wartości RYNKOWEJ nieruchomości) — sprzedaż
    OPODATKOWANA VAT (w TYM PRZEZ wybór opcji Z ust. 10-11) → BRAK
    PCC po stronie NABYWCY
  □ ⭐ PRAKTYCZNA DECYZJA biznesowa: WYBÓR opodatkowania VAT (zamiast
    zwolnienia) PRZENOSI ciężar Z jednorazowego PCC (2%, KOSZT
    bezzwrotny) NA VAT (23%, ALE PODLEGAJĄCY odliczeniu PRZEZ
    nabywcę będącego CZYNNYM podatnikiem) — DLA nabywcy PROWADZĄCEGO
    działalność OPODATKOWANĄ, opcja VAT jest ZAZWYCZAJ korzystniejsza
  □ ⚠️ Szczegółowa ANALIZA relacji VAT-PCC (w TYM przypadki, GDY OBA
    podatki MOGĄ wystąpić RÓWNOCZEŚNIE przy CZĘŚCIOWYM zwolnieniu) —
    patrz mod-ustawa-PCC-i-podatek-spadkow-darowizn, JEŚLI zawiera
    tę tematykę; W PRZECIWNYM razie WYMAGA odrębnego opracowania

⭐ ODESŁANIE DO WIS: PRZY wątpliwości CO do zwolnienia KONKRETNEJ
  usługi (np. czy DANE świadczenie MIEŚCI się w kategorii
  "EDUKACYJNej" lub "MEDYCZNEJ") — WIS (sekcja wyżej W tym module)
  obejmuje RÓWNIEŻ zwolnienia, NIE tylko stawki obniżone

Checklist praktyczny (nieruchomości):
□ USTAL datę PIERWSZEGO zasiedlenia (art. 2 pkt 14) — sprawdź, czy
  budynek BYŁ kiedykolwiek ODDANY do użytkowania (najem, WŁASNA
  działalność) — I czy PÓŹNIEJSZE ulepszenia PRZEKROCZYŁY 30%
  wartości POCZĄTKOWEJ (co "ODNAWIA" pierwsze zasiedlenie)
□ POLICZ, czy od pierwszego ZASIEDLENIA do PLANOWANEJ dostawy minęły
  PEŁNE 2 LATA — jeśli TAK, zastosowanie ma PKT 10 (zwolnienie ZE
  swobodą wyboru OPODATKOWANIA); jeśli NIE, sprawdź WARUNKI pkt 10a
  (zwolnienie BEZ opcji)
□ JEŻELI planowana jest OPCJA opodatkowania — czy OBIE strony są
  CZYNNYMI podatnikami VAT, czy OŚWIADCZENIE zostanie złożone
  formalnie I przed właściwym TERMINEM (przed dostawą, a JEŚLI jest
  zaliczka — PRZED jej zapłatą)
□ Czy AKT notarialny/umowa zawiera WSZYSTKIE elementy oświadczenia Z
  ust. 11 WPROST (nie tylko OGÓLNĄ wzmiankę o VAT) — BIORĄC pod
  uwagę rozbieżność ORZECZNICZĄ WSA/NSA, bezpieczniej SPEŁNIĆ
  wszystkie wymogi FORMALNE
□ Czy w UMOWIE zabezpieczono strony NA wypadek ZAKWESTIONOWANIA
  kwalifikacji przez ORGAN (kto PONOSI dodatkowy VAT/PCC, korekta
  ceny)
□ Czy TO nieruchomość ZABUDOWANA (pkt 10/10a) czy NIEZABUDOWANA (pkt
  9) — RÓŻNE reżimy, przy DZIAŁCE budowlanej brak ZWOLNIENIA w ogóle

⚠️ Weryfikuj aktualne brzmienie art. 43 w ISAP — KATALOG jest
  OBSZERNY (ust. 1 ma KILKADZIESIĄT punktów) i BYŁ wielokrotnie
  nowelizowany. Śledź TAKŻE projekt DEREGULACYJNY zmian W VAT
  planowanych OD 1.10.2026 (skład VAT, split PAYMENT, limit
  zwolnienia PODMIOTOWEGO, odpowiedzialność SOLIDARNA) — NIE dotyczy
  bezpośrednio art. 43, ALE MOŻE wpływać NA powiązane mechanizmy —
  SPRAWDŹ status prac LEGISLACYJNYCH przy sprawach Z terminem BLISKO
  tej daty.
```

---

## 4d. ⭐⭐⭐ ULGA NA ZŁE DŁUGI (art. 89a–89b ustawy VAT) — dodane
2026-08-12, uzupełnienie luki zidentyfikowanej w audycie pokrycia
DR-06 (dotąd CAŁKOWICIE nieobecne — ISTOTNE narzędzie w sporach Z
niewypłacalnymi kontrahentami, WYSOKA częstotliwość w praktyce
kancelaryjnej przy WINDYKACJI należności handlowych)

```
⭐⭐⭐ ISTOTA MECHANIZMU: obowiązek rozliczenia VAT NALEŻNEGO co DO
  zasady istnieje NIEZALEŻNIE od tego, CZY podatnik OTRZYMAŁ zapłatę
  — ULGA na złe długi POZWALA wierzycielowi ODZYSKAĆ rozliczony
  wcześniej podatek NALEŻNY, gdy KONTRAHENT nie zapłacił — LUSTRZANE
  odbicie PO stronie dłużnika: OBOWIĄZEK skorygowania (ZMNIEJSZENIA)
  podatku NALICZONEGO, który wcześniej ODLICZYŁ, a NIE zapłacił

⭐⭐⭐ WIERZYCIEL — PRAWO do korekty (art. 89a):
  □ WARUNEK PODSTAWOWY (ust. 1a): nieściągalność WIERZYTELNOŚCI
    uważa się za UPRAWDOPODOBNIONĄ, gdy wierzytelność NIE została
    uregulowana LUB zbyta w JAKIEJKOLWIEK formie w CIĄGU 90 DNI od
    dnia UPŁYWU terminu jej PŁATNOŚCI określonego w UMOWIE lub na
    FAKTURZE — ⭐ LICZY się TERMIN płatności (NIE data wystawienia
    faktury ANI data transakcji) — TERMIN 90-dniowy liczony OD tej
    daty
  □ ⭐⭐ WARUNKI aktualne PO nowelizacji 1.10.2021 i wyroku TSUE
    C-335/19 (art. 89a ust. 2, ⚠️ ISTOTNIE ZMIENIONE względem
    starszego stanu prawnego): NA dzień poprzedzający dzień ZŁOŻENIA
    deklaracji, W której dokonuje SIĘ korekty: (a) WIERZYCIEL jest
    podatnikiem ZAREJESTROWANYM jako czynny PODATNIK VAT; (b) OD
    daty wystawienia FAKTURY dokumentującej wierzytelność NIE
    upłynęły 3 LATA, licząc OD końca roku, W KTÓRYM została
    WYSTAWIONA
  □ ⭐⭐⭐ USUNIĘTE wymogi (WYROK TSUE C-335/19 z 15.10.2020,
    STWIERDZAJĄCY niezgodność Z prawem UNIJNYM): DAWNIEJ wymagano
    RÓWNIEŻ, by (a) dłużnik BYŁ zarejestrowanym czynnym PODATNIKIEM
    VAT i (b) dłużnik NIE był W trakcie postępowania
    RESTRUKTURYZACYJNEGO/upadłościowego/likwidacji — OBA te warunki
    ZOSTAŁY USUNIĘTE nowelizacją OD 1.10.2021 — ⚠️ starsze materiały/
    komentarze MOGĄ wciąż BŁĘDNIE wymieniać te WARUNKI jako
    aktualne — SKORYGUJ przy cytowaniu
  □ ⭐⭐ DODATKOWA ścieżka DLA dłużników NIEBĘDĄCYCH podatnikami VAT
    czynnymi (art. 89a ust. 2a, dodany OD 1.10.2021): korekta MOŻLIWA,
    JEŻELI: (1) wierzytelność POTWIERDZONA prawomocnym orzeczeniem
    SĄDU i skierowana NA drogę postępowania EGZEKUCYJNEGO, LUB (2)
    wierzytelność WPISANA do rejestru DŁUGÓW prowadzonego na
    poziomie KRAJOWYM, LUB (3) wobec dłużnika OGŁOSZONO upadłość
    KONSUMENCKĄ — ⭐ ISTOTNE przy WIERZYTELNOŚCIACH wobec konsumentów/
    podmiotów NIEBĘDĄCYCH czynnymi podatnikami VAT
  □ ⭐ MOMENT korekty (ust. 3): W rozliczeniu ZA okres, W KTÓRYM
    nieściągalność UZNAJE się za uprawdopodobnioną (tj. OKRES, w
    KTÓRYM upłynął 90. dzień) — POD warunkiem, że DO dnia złożenia
    deklaracji ZA ten okres wierzytelność NIE została uregulowana/
    zbyta — ⚠️ korekty NIE dokonuje SIĘ wstecznie za OKRES pierwotnego
    wykazania FAKTURY — WYŁĄCZNIE na BIEŻĄCO, w okresie SPEŁNIENIA
    warunku 90 dni
  □ ⭐⭐ ODWRÓCENIE korekty PRZY późniejszej ZAPŁACIE (ust. 4): jeśli
    PO skorzystaniu z ulgi NALEŻNOŚĆ zostanie uregulowana LUB zbyta w
    jakiejkolwiek FORMIE — wierzyciel MA obowiązek zwiększenia
    podstawy OPODATKOWANIA i podatku NALEŻNEGO w rozliczeniu ZA
    okres, w KTÓRYM należność ZOSTAŁA uregulowana/zbyta — PRZY
    częściowym uregulowaniu — ZWIĘKSZENIE proporcjonalnie DO tej
    części
  □ ⭐ NASTĘPCY podatkowi: Z ulgi MOGĄ korzystać RÓWNIEŻ następcy
    podatkowi WIERZYCIELA (sukcesja PRAWNA)
  □ ⭐ BRAK obowiązku INFORMOWANIA dłużnika przez WIERZYCIELA o
    skorzystaniu Z ulgi — TO nie tylko uproszczenie ADMINISTRACYJNE,
    lecz świadome ROZWIĄZANIE ustawowe (dłużnik I TAK ma odrębny,
    SAMOISTNY obowiązek monitorowania WŁASNYCH zaległości płatniczych
    — patrz NIŻEJ)

⭐⭐⭐ DŁUŻNIK — OBOWIĄZEK korekty (art. 89b):
  □ ⭐⭐⭐ ZASADA (ust. 1): W przypadku NIEUREGULOWANIA należności W
    terminie 90 DNI od dnia upływu TERMINU płatności — dłużnik JEST
    OBOWIĄZANY do KOREKTY odliczonej kwoty PODATKU naliczonego
    wynikającej Z tej faktury, W rozliczeniu ZA okres, w KTÓRYM
    upłynął 90. dzień — ⭐⭐ OBOWIĄZEK ten jest NIEZALEŻNY od tego,
    czy WIERZYCIEL faktycznie SKORZYSTAŁ z ulgi PO swojej stronie —
    dłużnik MUSI korygować SAMODZIELNIE, z URZĘDU, niezależnie od
    działań kontrahenta
  □ WYJĄTEK: przepisu NIE stosuje się, GDY dłużnik ureguluje
    należność NAJPÓŹNIEJ w OSTATNIM dniu okresu rozliczeniowego, W
    KTÓRYM upłynął 90. dzień (tj. ZAPŁATA jeszcze W tym samym
    okresie ZWALNIA z obowiązku korekty)
  □ ⭐⭐⭐ ⚠️ NIESPÓJNOŚĆ MIĘDZY art. 89a i 89b PO nowelizacji
    1.10.2021 (sygnalizowana W piśmiennictwie, dotycząca DŁUŻNIKÓW
    w RESTRUKTURYZACJI): art. 89a (STRONA wierzyciela) NIE zawiera
    już WYŁĄCZENIA dla dłużników W restrukturyzacji/upadłości —
    JEDNAK art. 89b (STRONA dłużnika) W DOSŁOWNYM brzmieniu NADAL
    nakłada OBOWIĄZEK korekty NAWET gdy dłużnik jest W trakcie
    postępowania RESTRUKTURYZACYJNEGO w chwili UPŁYWU 90. dnia —
    ⭐ W piśmiennictwie WSKAZUJE się, że przepisy PRAWA
    restrukturyzacyjnego (chroniące MASĘ restrukturyzacyjną przed
    powstawaniem NOWYCH zobowiązań poza planem) MOGĄ mieć
    PIERWSZEŃSTWO przed art. 89b w TAKIEJ sytuacji — ⚠️ KWESTIA
    SPORNA i NIEJEDNOZNACZNIE rozstrzygnięta w PRAKTYCE — przy
    SPRAWIE z udziałem dłużnika W restrukturyzacji WYMAGANA jest
    odrębna, POGŁĘBIONA analiza (POWIĄZANIE z prawem
    RESTRUKTURYZACYJNYM, poza zakresem TEGO modułu)
  □ ⭐⭐ ODWRÓCENIE korekty PRZY późniejszej zapłacie PRZEZ dłużnika
    (ust. 4): PO uregulowaniu należności PO dokonaniu korekty —
    dłużnik MA prawo DO ponownego zwiększenia kwoty PODATKU
    naliczonego W rozliczeniu za OKRES, w KTÓRYM należność
    UREGULOWANO — PRZY częściowym uregulowaniu — zwiększenie
    proporcjonalnie DO tej części
  □ ⭐ PRZYPADEK SZCZEGÓLNY — dłużnik NIGDY nie odliczył podatku Z
    danej faktury (potwierdzone interpretacją KIS Z 14.09.2021, nr
    0113-KDIPT1-1.4012.544.2021.1.MSU): JEŚLI dłużnik NIE dokonał
    ODLICZENIA podatku PRZED upływem 90 dni — art. 89b W OGÓLE nie
    ma ZASTOSOWANIA (BRAK czego korygować) — DŁUŻNIK zachowuje
    PRAWO do odliczenia PO uregulowaniu zobowiązania, Z zastrzeżeniem
    OGÓLNEGO terminu art. 86 ust. 13 (5 LAT od początku roku, w
    KTÓRYM powstało prawo DO odliczenia)

⭐⭐ ASPEKTY TECHNICZNE — JPK_V7 (POWIĄZANIE z sekcją **5 NIŻEJ** w tym
  module — „Ewidencja VAT (JPK_V7), korekta ewidencji i sankcje
  ewidencyjne"; ⚠️ do 2026-08-12 odesłanie wskazywało na „sekcję 5
  wyżej", która NIE ISTNIAŁA — naprawione wraz z utworzeniem sekcji 5):
  □ Korekta ULGI NIE wymaga oznaczeń KODÓW GTU ani OZNACZENIA "WEW"
  □ WIERZYCIEL: pole "KorektaPodstawyOpodt" — art. 89a ust. 1 PRZY
    zaznaczaniu korekty NA minus (nieuregulowana należność), art.
    89a ust. 4 PRZY korekcie NA plus (późniejsza ZAPŁATA)
  □ DŁUŻNIK: pola P_46 (korekta Z art. 89b ust. 1 — TYLKO wartości
    ujemne LUB zero) i P_47 (zwiększenie PO uregulowaniu — art. 89b
    ust. 4) — BEZ standardowych pól ODLICZENIA
  □ OD stycznia 2022: WIERZYCIEL musi wykazywać W części
    ewidencyjnej JPK TERMIN płatności DLA dokumentów objętych ulgą —
    UMOŻLIWIA to organowi WERYFIKACJĘ, czy korekta PO stronie
    dłużnika (OBLIGATORYJNA) rzeczywiście NASTĄPIŁA
  □ ⭐ PRAKTYCZNA rekomendacja Z interpretacji (2026): WYDRUK z
    rejestru VAT NA stronie MF (biała LISTA) na DZIEŃ poprzedzający
    korektę STANOWI akceptowane POTWIERDZENIE statusu VAT dłużnika/
    wierzyciela — WARTO archiwizować JAKO dowód spełnienia warunków

⭐ PRZESUNIĘCIE terminu PŁATNOŚCI: jeśli STRONY (za zgodą OBU) chcą
  USTALIĆ nowy termin PŁATNOŚCI — MUSI to nastąpić W okresie, GDY
  NIE minęło jeszcze 90 dni OD pierwotnego terminu — NIEDOCHOWANIE
  tego (wg STANOWISKA organów) SKUTKUJE obowiązkiem rozliczenia ulgi
  MIMO późniejszej zmiany terminu

⭐ UMORZENIE zobowiązania: NIE stanowi "UREGULOWANIA należności" w
  rozumieniu USTAWY — umorzenie PRZEZ wierzyciela NIE zwalnia go z
  obowiązku WYKAZANIA podatku należnego (wg ulgi), a DŁUŻNIK traci
  PRAWO do odliczenia — SKUTKI SYMETRYCZNE do braku ZAPŁATY, nie
  identyczne Z "uregulowaniem"

Checklist praktyczny (WIERZYCIEL — dochodzenie ulgi):
□ Czy MINĘŁO 90 dni OD terminu płatności OKREŚLONEGO w umowie/na
  fakturze (NIE od daty WYSTAWIENIA faktury)
□ Czy na DZIEŃ poprzedzający złożenie DEKLARACJI wierzyciel jest
  CZYNNYM podatnikiem VAT ORAZ nie upłynęły 3 LATA od końca roku
  wystawienia FAKTURY
□ Jeśli DŁUŻNIK nie jest czynnym PODATNIKIEM VAT — czy SPEŁNIONA
  jest jedna Z alternatywnych przesłanek ust. 2a (WYROK sądu +
  EGZEKUCJA, wpis DO rejestru długów, upadłość KONSUMENCKA)
□ Czy KOREKTA ujęta jest W deklaracji za WŁAŚCIWY okres (moment
  upływu 90 DNI), nie retrospektywnie
□ Czy ARCHIWIZOWANY jest dowód STATUSU VAT kontrahenta (wydruk Z
  białej listy) NA właściwą datę

Checklist praktyczny (DŁUŻNIK — obrona/zgodność):
□ Czy termin 90 DNI od terminu płatności JUŻ upłynął — JEŚLI tak,
  obowiązek korekty JEST niezależny od DZIAŁAŃ wierzyciela
□ Czy DŁUŻNIK w ogóle wcześniej ODLICZYŁ VAT z DANEJ faktury — jeśli
  NIE, art. 89b nie ma ZASTOSOWANIA
□ PRZY dłużniku w RESTRUKTURYZACJI — flaguj JAKO obszar SPORNY,
  wymagający odrębnej analizy Z prawem restrukturyzacyjnym, NIE
  stosuj automatycznie DOSŁOWNEGO brzmienia art. 89b BEZ tej
  weryfikacji

⚠️ Weryfikuj aktualne brzmienie art. 89a-89b w ISAP — SZCZEGÓLNIE
  uważaj na STARSZE materiały cytujące WARUNKI sprzed nowelizacji
  1.10.2021 (WYMÓG statusu VAT dłużnika, WYŁĄCZENIE przy
  restrukturyzacji PO stronie wierzyciela) — TE wymogi ZOSTAŁY
  usunięte w WYNIKU wyroku TSUE C-335/19 i JUŻ NIE obowiązują PO
  stronie art. 89a.
```

---

## 4e. ⭐⭐⭐ SANKCJE VAT — DODATKOWE ZOBOWIĄZANIE PODATKOWE (art. 112b–
112c ustawy VAT) — dodane 2026-08-12, uzupełnienie luki
zidentyfikowanej w audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne
poza JEDNĄ ogólną wzmianką o "aktualnym sankcyjnym art. 109a" przy
JPK — TEN artykuł dotyczy INNEJ sankcji; art. 112b/112c to GŁÓWNY,
systemowy mechanizm sankcyjny VAT)

```
⭐⭐⭐ ISTOTA: dodatkowe ZOBOWIĄZANIE podatkowe (POTOCZNIE "sankcja
  VAT") to ADMINISTRACYJNA kara PIENIĘŻNA nakładana PRZEZ organ, GDY
  podatnik ZANIŻYŁ zobowiązanie PODATKOWE, zawyżył KWOTĘ zwrotu VAT,
  LUB zawyżył kwotę DO przeniesienia na KOLEJNY okres — NIEZALEŻNA
  od odpowiedzialności KARNEJ skarbowej (choć WYKLUCZAJĄCA się z nią
  DLA osób fizycznych — patrz NIŻEJ)
  → OBOWIĄZUJE od 1.01.2017 (przywrócona PO wcześniejszym
    funkcjonowaniu DO 30.11.2008) — NIE stosuje SIĘ do okresów
    rozliczeniowych PRZED tą datą

⭐⭐⭐ ⚡ FUNDAMENTALNA ZMIANA OD 6.06.2023 (nowelizacja W następstwie
  wyroku TSUE C-935/19, Grupa WARZYWNA) — ⚠️ KLUCZOWE dla PRAWIDŁOWEGO
  stosowania:
  → DO 5.06.2023: sankcja BYŁA ustalana SZTYWNO — dokładnie 15%, 20%,
    30% LUB 100%, bez MOŻLIWOŚCI miarkowania PRZEZ organ
  → OD 6.06.2023: sankcja jest ustalana "DO" wysokości — DO 30%, DO
    20% LUB do 15% (art. 112b ust. 1-2a) — organ USTALA wysokość
    ZINDYWIDUALIZOWANIE, uwzględniając OKOLICZNOŚCI konkretnej
    sprawy — SANKCJA 100% (art. 112c) POZOSTAJE sankcją SZTYWNĄ, BEZ
    słowa "do" — DALEJ NIE podlega miarkowaniu
  → ⚠️ STARSZE materiały/komentarze CYTUJĄCE sztywne stawki 15/20/30%
    jako OBOWIĄZUJące SĄ NIEAKTUALNE dla okresów PO 6.06.2023 —
    ZAWSZE weryfikuj, KTÓREGO okresu ROZLICZENIOWEGO dotyczy sprawa

⭐⭐⭐ GENEZA REFORMY — WYROK TSUE C-935/19 "GRUPA WARZYWNA" (15.04.2021):
  TSUE stwierdził NIEZGODNOŚĆ dawnej, SZTYWNEJ 20% sankcji Z zasadą
  PROPORCJONALNOŚCI wynikającą Z dyrektywy VAT — STAN faktyczny:
  podatnik BŁĘDNIE zakwalifikował transakcję ZWOLNIONĄ jako
  OPODATKOWANĄ (błąd W OCENIE, bez cech OSZUSTWA ani uszczuplenia
  wpływów) — TRYBUNAŁ: sankcja NIE MOŻE być stosowana BEZ
  rozróżnienia MIĘDZY sytuacją zwykłego BŁĘDU w ocenie A sytuacją
  faktycznego OSZUSTWA/uszczuplenia — sposób USTALANIA sankcji MUSI
  DAWAĆ organowi możliwość ZINDYWIDUALIZOWANIA kary — ⭐ WYROK miał
  charakter DEFINITYWNY (bez odesłania SPRAWY do sądu krajowego DO
  oceny w świetle KRYTERIÓW) — orzeczenie WPROST rozstrzygnęło o
  niezgodności
  → ⭐ LINIA orzecznicza POLSKICH sądów PRZED formalną nowelizacją
    (np. WSA w Białymstoku, I SA/Bk 1/23): SANKCJA z art. 112b
    możliwa WYŁĄCZNIE, gdy DZIAŁANIE podatnika ŚWIADOMIE zmierza DO
    nadużyć/uszczuplenia — ZWYKŁE zaniedbanie (BEZ cech oszustwa,
    BEZ realnego USZCZUPLENIA budżetu — np. GDY podatnik ZAPŁACIŁ
    odsetki, generując DODATKOWY dochód budżetowy) NIE uzasadnia
    sankcji, NAWET przed formalną korektą PRZEPISÓW

⭐⭐ PRÓG ZAWYŻENIA/ZANIŻENIA I POZIOMY SANKCJI (art. 112b ust. 1-2a):
  □ DO 30% — PODSTAWOWY próg, GDY podatnik NIE koryguje deklaracji
    SAMODZIELNIE (organ SAM stwierdza nieprawidłowość I ustala jej
    wysokość)
  □ DO 20% — GDY podatnik, PO zakończonej kontroli PODATKOWEJ/celno-
    skarbowej, ZŁOŻY korektę deklaracji UWZGLĘDNIAJĄCĄ stwierdzone
    nieprawidłowości I najpóźniej W dniu złożenia TEJ korekty
    WPŁACI kwotę zobowiązania/zwróci NIENALEŻNY zwrot (art. 112b
    ust. 2 pkt 1)
  □ DO 15% — NAJNIŻSZY próg, GDY podatnik ZŁOŻYŁ korektę W TRAKCIE
    kontroli CELNO-skarbowej, W terminie 14 DNI od doręczenia
    UPOWAŻNIENIA do kontroli, I NAJPÓŹNIEJ w dniu jej złożenia
    WPŁACIŁ kwotę zobowiązania/zwrócił NIENALEŻNY zwrot (art. 112b
    ust. 2a) — SZYBKA reakcja podatnika JEST premiowana NAJNIŻSZYM
    progiem

⭐⭐⭐ KRYTERIA MIARKOWANIA (uwzględniane PRZEZ organ PRZY ustalaniu
  konkretnej wysokości W GRANICACH "do X%", wprowadzone nowelizacją
  6.06.2023, art. 112b ust. 2b): RODZAJ i STOPIEŃ naruszenia
  ciążącego NA podatniku obowiązku, KTÓRE skutkowało powstaniem
  nieprawidłowości; WAGA i CZĘSTOTLIWOŚĆ stwierdzanych DOTYCHCZAS
  nieprawidłowości — ⚠️ przepis TEN NIE odwołuje się DO art. 112c
  (sankcja 100% POZOSTAJE poza mechanizmem MIARKOWANIA)

⭐⭐⭐ SANKCJA 100% — art. 112c (SZTYWNA, BEZ miarkowania nawet PO
  nowelizacji 2023):
  □ STOSOWANA wyłącznie GDY podatnik ŚWIADOMIE uczestniczył W
    oszustwie — czyli ODLICZYŁ VAT z FAKTUR, które: (1) zostały
    WYSTAWIONE przez PODMIOT nieistniejący, (2) STWIERDZAJĄ czynności,
    które NIE zostały dokonane (tzw. PUSTE faktury), (3) PODAJĄ
    kwoty NIEZGODNE z rzeczywistością (W części dotyczącej TYCH
    pozycji), (4) POTWIERDZAJĄ czynności OBJĘTE przepisami o
    POZORNOŚCI/obejściu prawa (art. 58, 83 KC)
  □ ⭐⭐ ZMIANA OD 6.06.2023 co DO ZAKRESU zastosowania art. 112c
    (RÓWNIEŻ objęta NOWELIZACJĄ, mimo że wyrok TSUE dotyczył
    BEZPOŚREDNIO art. 112b): sankcja 100% MA zastosowanie WYŁĄCZNIE,
    gdy DZIAŁANIE było SKUTKIEM celowego DZIAŁANIA podatnika LUB
    jego KONTRAHENTA, O KTÓRYM podatnik MIAŁ wiedzę — PRZYPADKI
    odliczenia Z wadliwych faktur ZWIĄZANE Z brakiem NALEŻYTEJ
    staranności (BEZ świadomości udziału W oszustwie) NIE SĄ objęte
    100% sankcją PO tej zmianie
  □ ⭐ ORZECZNICTWO (WSA w Bydgoszczy, I SA/Bd 165/19): PRZY
    przyjęciu do rozliczenia FAKTUR z art. 112c — sankcja WYNOSI
    100%, NIEZALEŻNIE od tego, CZY podatnik SAM koryguje deklarację,
    CZY robi TO organ — BRAK uzasadnienia dla "PREMIOWANIA"
    nieuczciwych podatników UJMUJĄCYCH takie faktury

⭐⭐⭐ WYŁĄCZENIA CAŁKOWITE — KIEDY SANKCJA NIE JEST NAKŁADANA (art.
  112b ust. 3):
  □ pkt 1 lit. a — podatnik ZŁOŻYŁ korektę deklaracji I zapłacił
    UISZCZONE zobowiązanie WRAZ z odsetkami ZA zwłokę — PRZED dniem
    WSZCZĘCIA kontroli podatkowej/celno-skarbowej
  □ pkt 1 lit. b — podatnik ZŁOŻYŁ brakującą DEKLARACJĘ (uprzednio
    niezłożoną), wykazał W niej podatek WE właściwej wysokości I
    zapłacił GO wraz Z odsetkami — PRZED wszczęciem KONTROLI
  □ pkt 2 lit. a — nieprawidłowość WYNIKA z OCZYWISTYCH błędów
    RACHUNKOWYCH lub OCZYWISTYCH omyłek POPEŁNIONYCH w DEKLARACJI
    podatkowej — ⚠️ ⭐ ISTOTNE ograniczenie zakresu: przepis DOTYCZY
    wyłącznie BŁĘDÓW w SAMEJ deklaracji — NIE obejmuje BŁĘDÓW
    popełnionych W EWIDENCJI (JPK), mimo że W praktyce TO WŁAŚNIE W
    ewidencji NAJCZĘŚCIEJ powstają POMYŁKI (deklaracje ELEKTRONICZNE
    zwykle SAME sumują pozycje) — LUKA w OCHRONIE podatnika,
    sygnalizowana W piśmiennictwie
  □ ⭐ RÓWNIEŻ: zaniżenie/zawyżenie ZWIĄZANE z BŁĘDNYM zastosowaniem
    przepisów PRAWA podatkowego, KTÓRE NIE miało NA celu wyłudzenia
    nienależnego ZWROTU ani świadomego ZANIŻENIA zobowiązania — NIE
    MOŻE stanowić PODSTAWY sankcji (linia ORZECZNICZA rozwijająca
    wyrok TSUE Grupa Warzywna — KRYTERIUM subiektywne: BRAK celowego
    działania)

⭐⭐ WYŁĄCZENIE PODMIOTOWE — ZBIEG z ODPOWIEDZIALNOŚCIĄ KARNĄ
  SKARBOWĄ (art. 112b ust. 4, ⭐ POWIĄZANIE z pisma-procesowe-v3/
  reprezentacją W postępowaniach KARNOSKARBOWYCH): dodatkowego
  zobowiązania PODATKOWEGO (15/20/30%/100%) NIE stosuje SIĘ wobec
  OSÓB FIZYCZNYCH, które ZA TEN SAM czyn PONOSZĄ odpowiedzialność ZA
  wykroczenie SKARBOWE albo PRZESTĘPSTWO skarbowe — ⭐ PRAKTYCZNA
  KONSEKWENCJA: JEDNOOSOBOWY przedsiębiorca (osoba FIZYCZNA)
  podlegający ODPOWIEDZIALNOŚCI z KKS za DANY czyn NIE zapłaci
  RÓWNOLEGLE sankcji administracyjnej Z art. 112b — ⚠️ TO wyłączenie
  DOTYCZY osób FIZYCZNYCH — SPÓŁKI (osoby PRAWNE) nie korzystają Z
  tego wyłączenia W ten sam sposób (odpowiedzialność KARNA skarbowa
  DOTYCZY osób fizycznych DZIAŁAJĄCYCH w imieniu spółki, NIE samej
  spółki jako TAKIEJ — sankcja administracyjna Z VAT MOŻE być
  nałożona NA spółkę niezależnie)

⭐ WYŁĄCZENIE PRZY MPP (POWIĄZANIE z sekcją split PAYMENT wyżej w
  tym module, art. 108c ust. 1): JEŻELI nabywca ZAPŁACIŁ zobowiązanie
  wynikające Z otrzymanej faktury Z ZASTOSOWANIEM mechanizmu
  podzielonej PŁATNOŚCI — DO wysokości kwoty ODPOWIADAJĄCEJ kwocie
  podatku Z tej faktury, naczelnik URZĘDU skarbowego/celno-
  skarbowego NIE stosuje przepisów O sankcji (112b ust. 1 pkt 1 —
  30%, ust. 2 pkt 1 — 20%, ust. 2a — 15%, ORAZ 112c — 100%) — ⭐
  DODATKOWY argument PRZEMAWIAJĄCY za STOSOWANIEM MPP przy
  transakcjach Z załącznika 15

Checklist praktyczny:
□ ZWERYFIKUJ, którego OKRESU rozliczeniowego dotyczy sprawa — PRZED/
  PO 6.06.2023 — różne ZASADY (sztywne stawki vs "do X%")
□ Czy NIEPRAWIDŁOWOŚĆ wynika Z celowego działania (→ POTENCJALNIE
  100%, art. 112c) czy Z błędu W ocenie/zaniedbania BEZ cech
  oszustwa (→ NIŻSZY próg LUB brak sankcji w OGÓLE, zgodnie Z linią
  Grupa Warzywna)
□ Czy ZASTOSOWANIE ma KTÓRETKOLWIEK z wyłączeń art. 112b ust. 3
  (korekta PRZED kontrolą + zapłata, OCZYWISTY błąd rachunkowy W
  samej deklaracji)
□ PRZY osobie fizycznej — czy RÓWNOLEGLE toczy się/może TOCZYĆ się
  postępowanie KARNOSKARBOWE za TEN sam czyn — jeśli TAK, sankcja
  administracyjna NIE powinna być STOSOWANA
□ Czy PRZY transakcji z zał. 15 zastosowano MPP — jeśli TAK,
  sprawdź WYŁĄCZENIE z art. 108c ust. 1
□ PRZY negocjacji Z organem/odwołaniu — powołaj się WPROST na
  kryteria MIARKOWANIA z ust. 2b oraz NA linię TSUE Grupa Warzywna,
  JEŚLI okoliczności wskazują NA brak celowego DZIAŁANIA

⚠️ Weryfikuj aktualne brzmienie art. 112b-112c w ISAP — TO obszar Z
  ISTOTNĄ, DOŚĆ ŚWIEŻĄ reformą (2023) — STARSZE orzecznictwo/
  komentarze SPRZED tej daty WYMAGAJĄ ostrożnego STOSOWANIA (część
  argumentacji, np. CO do samej ZASADY proporcjonalności, POZOSTAJE
  aktualna; część DOTYCZĄCA sztywnych stawek — NIE).
```

---

## 4f. ⭐⭐⭐ BONY JEDNEGO I RÓŻNEGO PRZEZNACZENIA — SPV/MPV (Dział II
Rozdział 2a, art. 8a–8b; definicje art. 2 pkt 41-45; podstawa
opodatkowania art. 29a ust. 1a-1c; obowiązek podatkowy art. 19a ust.
1a, 4a) — dodane 2026-08-12, uzupełnienie luki zidentyfikowanej w
audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne, mimo licznych
odesłań DO tego rozdziału Z innych sekcji modułu — POWSZECHNE W
praktyce handlowej: karty PODARUNKOWE, vouchery, bony RABATOWE
sprzedawane ODPŁATNIE)

```
⭐⭐⭐ DEFINICJA "BONU" (art. 2 pkt 41): instrument, Z KTÓRYM wiąże się
  OBOWIĄZEK jego PRZYJĘCIA jako wynagrodzenia LUB części wynagrodzenia
  ZA dostawę towarów/świadczenie USŁUG — GDZIE towary/usługi, KTÓRE
  MAJĄ zostać dostarczone/wykonane, LUB tożsamość POTENCJALNYCH
  dostawców/usługodawców SĄ wskazane W samym instrumencie LUB W
  powiązanej DOKUMENTACJI (w TYM w warunkach jego wykorzystania) —
  ⭐ BON może mieć FORMĘ materialną (papierowy VOUCHER, karta) LUB
  elektroniczną (KOD), być PŁATNY lub BEZPŁATNY — NAZWA instrumentu
  (voucher, TALON, kupon podarunkowy) NIE ma znaczenia — ISTOTNE jest
  WYŁĄCZNIE, czy UPRAWNIA do zakupu OKREŚLONYCH (lub określalnych)
  towarów/usług W przyszłości

⭐⭐⭐ CO NIE JEST BONEM (WYŁĄCZENIE Z definicji) — CZĘSTY błąd
  PRAKTYCZNY:
  □ KARTY i kupony RABATOWE uprawniające DO określonej zniżki PRZY
    nabywaniu towarów/usług, ALE NIE dające PRAWA do uzyskania TYCH
    towarów/usług SAMYCH w sobie — TO NIE jest bon W rozumieniu
    ustawy
  □ KOD rabatowy — WPROST NIE jest bonem NA gruncie ustawy o VAT
  □ ⭐ PRAKTYCZNE rozróżnienie: BON "wymienia się NA towar/usługę"
    (jest SUBSTYTUTEM zapłaty); RABAT/kod rabatowy "OBNIŻA cenę"
    towaru/usługi (NIE zastępuje zapłaty, TYLKO ją zmniejsza) —
    KONSEKWENCJA: rabaty/kody RABATOWE rozliczane są NA zasadach
    OGÓLNYCH obniżenia podstawy OPODATKOWANIA (art. 29a — SEKCJA
    wyżej w TYM module), NIE przez mechanizm ROZDZIAŁU 2a
  □ ⭐ ODESŁANIE: STATUS jako "instrument PŁATNICZY" analizowany PRZY
    okazji INNYCH przepisów (np. USTAWA o usługach płatniczych) —
    NIE jest TOŻSAMY ze statusem "bonu" NA gruncie VAT — TO DWIE
    ODRĘBNE klasyfikacje, MOGĄCE się NAKŁADAĆ, ale niekoniecznie

⭐⭐⭐ DWA RODZAJE BONÓW — KRYTERIUM ROZRÓŻNIAJĄCE (art. 2 pkt 43-44):
  □ BON JEDNEGO PRZEZNACZENIA (SPV — single-purpose voucher): bon, W
    PRZYPADKU którego W CHWILI EMISJI ZNANE są ŁĄCZNIE: (a) MIEJSCE
    dostawy towarów/świadczenia usług, KTÓRYCH bon dotyczy, ORAZ (b)
    KWOTA należnego PODATKU (VAT/podatku o PODOBNYM charakterze) Z
    tytułu tej dostawy/usługi
  □ BON RÓŻNEGO PRZEZNACZENIA (MPV — multi-purpose voucher): KAŻDY
    bon INNY niż SPV — tj. GDY W chwili emisji NIE można ustalić
    MIEJSCA opodatkowania LUB kwoty PODATKU należnego (LUB OBU tych
    elementów) — NAJCZĘSTSZY praktyczny PRZYKŁAD: karta PODARUNKOWA
    do sieci SKLEPÓW oferującej TOWARY objęte RÓŻNYMI stawkami VAT
    (5/8/23%) — W momencie WYDANIA karty NIE wiadomo, JAKIE konkretnie
    towary ZOSTANĄ za nią NABYTE, WIĘC nie da SIĘ ustalić kwoty
    podatku Z GÓRY
  □ ⭐ TEST PRAKTYCZNY: JEDNA stawka VAT + JEDNO, znane MIEJSCE
    dostawy → SPV; RÓŻNE możliwe stawki LUB nieznane miejsce → MPV

⭐⭐⭐ SKUTKI PODATKOWE BONU JEDNEGO PRZEZNACZENIA (SPV, art. 8a) —
  OPODATKOWANY JUŻ NA ETAPIE TRANSFERU:
  □ ZASADA (ust. 1): TRANSFER bonu SPV dokonany PRZEZ podatnika
    działającego WE własnym imieniu UZNAJE się ZA dostawę
    towarów/świadczenie USŁUG, KTÓRYCH bon DOTYCZY — ⭐ EMISJA bonu
    ORAZ KAŻDE jego PÓŹNIEJSZE przekazanie (art. 2 pkt 45 —
    "TRANSFER") SĄ opodatkowane, TAK jakby DOSZŁO do faktycznej
    dostawy/usługi — UZASADNIENIE: W momencie emisji bonu SPV
    DOKŁADNIE znana JEST wysokość podatku NALEŻNEGO, WIĘC NIE MA
    przeszkód, by ROZLICZYĆ VAT już WTEDY
  □ ⭐⭐ FAKTYCZNA realizacja bonu SPV (ust. 2): faktyczne PRZEKAZANIE
    towarów/świadczenie USŁUG w zamian ZA bon SPV przyjęty JAKO
    wynagrodzenie NIE JEST uznawane ZA NIEZALEŻNĄ, ODRĘBNĄ transakcję
    — VAT ZOSTAŁ już ROZLICZONY na etapie TRANSFERU, WIĘC sama
    "REALIZACJA"/wymiana bonu NA towar nie GENERUJE drugiego
    zdarzenia OPODATKOWANEGO
  □ ⭐ TRANSFER PRZEZ POŚREDNIKA (ust. 3-4): JEŻELI transferu DOKONUJE
    podatnik DZIAŁAJĄCY w IMIENIU innego podatnika — TRANSFER
    UZNAJE się za DOSTAWĘ/usługę DOKONANĄ przez TEGO, w KTÓREGO
    imieniu się DZIAŁA; JEŻELI dostawca/usługodawca NIE JEST
    podatnikiem, KTÓRY wyemitował BON — UZNAJE się, że TEN
    dostawca/usługodawca DOKONAŁ dostawy/usługi NA rzecz EMITENTA
    bonu (⭐ ROZLICZENIE "łańcuchowe" W sieciach franczyzowych/
    partnerskich)
  □ ⭐ MOMENT obowiązku PODATKOWEGO (art. 19a ust. 1a, 4a): Z CHWILĄ
    dokonania TRANSFERU bonu SPV (NIE Z chwilą JEGO faktycznego
    wykorzystania PRZEZ konsumenta) — POWIĄZANIE z sekcją "obowiązek
    podatkowy" wyżej W tym module

⭐⭐⭐ SKUTKI PODATKOWE BONU RÓŻNEGO PRZEZNACZENIA (MPV, art. 8b) —
  OPODATKOWANY DOPIERO PRZY REALIZACJI:
  □ ZASADA (ust. 1): OPODATKOWANIU podlega WYŁĄCZNIE faktyczne
    PRZEKAZANIE towarów/świadczenie USŁUG dokonane W ZAMIAN za bon
    MPV przyjęty JAKO wynagrodzenie — WCZEŚNIEJSZY transfer bonu MPV
    (EMISJA i KAŻDE kolejne przekazanie) NIE podlega OPODATKOWANIU
    VAT w OGÓLE — TO logiczna KONSEKWENCJA braku znajomości STAWKI/
    miejsca w MOMENCIE emisji
  □ ⭐⭐ TRANSFER przez POŚREDNIKA innego niż WYSTAWCA świadczenia
    (ust. 2): JEŻELI transferu bonu MPV DOKONUJE podatnik INNY niż
    TEN, który OSTATECZNIE dokonuje OPODATKOWANEJ czynności (ust. 1)
    — OPODATKOWANIU podlegają WYŁĄCZNIE usługi POŚREDNICTWA oraz INNE
    możliwe do ZIDENTYFIKOWANIA usługi (np. DYSTRYBUCJI, promocji)
    DOTYCZĄCE tego bonu — NIE cała WARTOŚĆ bonu — ⭐ ISTOTNE DLA
    dystrybutorów/platform SPRZEDAJĄCYCH bony W imieniu wystawcy
    (np. platformy SPRZEDAJĄCE karty podarunkowe SIECI handlowych)

⭐⭐⭐ PODSTAWA OPODATKOWANIA DLA MPV (art. 29a ust. 1a-1c) —
  SZCZEGÓLNY mechanizm, ODMIENNY od zasady OGÓLNEJ:
  □ BON zrealizowany W CAŁOŚCI (ust. 1a): podstawa OPODATKOWANIA
    RÓWNA się: (1) WYNAGRODZENIU zapłaconemu ZA bon MPV, POMNIEJSZONEMU
    o KWOTĘ podatku ZWIĄZANĄ z dostarczonymi TOWARAMI/usługami; LUB
    (2) — GDY informacje O wynagrodzeniu SĄ niedostępne — WARTOŚCI
    pieniężnej WSKAZANEJ na bonie/W powiązanej DOKUMENTACJI,
    pomniejszonej O kwotę podatku
  □ BON zrealizowany W CZĘŚCI (ust. 1b): PODSTAWA opodatkowania równa
    się ODPOWIEDNIEJ CZĘŚCI powyższych KWOT (proporcjonalnie DO
    wykorzystanej CZĘŚCI bonu)
  □ ⭐ PRZYKŁAD PRAKTYCZNY: karta PODARUNKOWA o wartości 100 ZŁ (MPV)
    wymieniona NA spodnie — PODSTAWĄ opodatkowania JEST wartość
    NOMINALNA bonu W momencie REALIZACJI (100 zł POMNIEJSZONE o VAT
    zawarty W tej kwocie), NIE cena NABYCIA samej karty PRZEZ
    konsumenta (JEŚLI była INNA, np. przy PROMOCYJNEJ sprzedaży
    karty)
  □ ODPOWIEDNIE STOSOWANIE (ust. 1c): DO powyższych przypadków
    stosuje SIĘ odpowiednio ust. 2 i 5 art. 29a (koszt WYTWORZENIA
    przy nieodpłatnym PRZEKAZANIU towarów, koszt świadczenia PRZY
    nieodpłatnych usługach — POWIĄZANIE z sekcją 4b wyżej w TYM
    module)

⭐⭐⭐ NIEZREALIZOWANE BONY MPV — BRAK OPODATKOWANIA (⭐ ISTOTNE
  praktycznie, potwierdzone INTERPRETACJĄ KIS z 30.05.2025): JEŻELI
  bon MPV NIGDY nie zostanie ZREALIZOWANY (np. UTRACI ważność, KLIENT
  go NIE wykorzysta) — ŚRODKI pieniężne OTRZYMANE od klienta PRZY
  emisji NIE STANOWIĄ kwoty Z tytułu czynności PODLEGAJĄCEJ
  opodatkowaniu VAT — PONIEWAŻ NIE dochodzi DO "faktycznego
  świadczenia" WYMAGANEGO przez art. 8b ust. 1 — WNIOSEK: kwoty
  ZATRZYMANE ze sprzedaży NIEWYKORZYSTANYCH bonów MPV (tzw. "BREAKAGE")
  POZOSTAJĄ POZA VAT w CAŁOŚCI — ⚠️ TO ODWROTNIE niż PRZY bonach SPV,
  GDZIE VAT jest ROZLICZANY już PRZY emisji, WIĘC brak realizacji NIE
  ZMIENIA już DOKONANEGO rozliczenia (BRAK mechanizmu "zwrotu" VAT Z
  tego tytułu, chyba że NASTĄPI zwrot ŚRODKÓW klientowi — WTEDY
  zastosowanie MAJĄ zasady OGÓLNE korekty)

⭐ POWIĄZANIE Z INNYMI SEKCJAMI TEGO MODUŁU:
  □ Sekcja "OBOWIĄZEK podatkowy" (4a) — MOMENT dla SPV to CHWILA
    transferu (art. 19a ust. 1a), NIE zasada OGÓLNA "dokonania
    dostawy"
  □ Sekcja "PODSTAWA opodatkowania" (4b) — MECHANIZM dla MPV (art.
    29a ust. 1a-1c) to LEX SPECIALIS względem ZASADY ogólnej Z ust. 1
  □ Sekcja "ZWOLNIENIA przedmiotowe" (4c) — JEŻELI bon DOTYCZY
    świadczenia OBJĘTEGO zwolnieniem (np. USŁUGI medyczne) — analiza
    SPV/MPV MUSI uwzględniać RÓWNIEŻ status ZWOLNIENIA, nie TYLKO
    stawkę
  □ MECHANIZM VAT marża/OSS — bony W handlu TRANSGRANICZNYM (np.
    karty PODARUNKOWE platform e-commerce) MOGĄ wymagać ŁĄCZNEJ
    analizy Z sekcją OSS/IOSS wyżej W module, PRZY sprzedaży
    KONSUMENTOM w innych KRAJACH UE

Checklist praktyczny:
□ Czy INSTRUMENT w OGÓLE spełnia definicję "BONU" (art. 2 pkt 41) —
  CZY to raczej KARTA/kod RABATOWY (POZA zakresem Rozdziału 2a,
  rozliczane NA zasadach ogólnych OBNIŻENIA podstawy)
□ Czy W chwili EMISJI znane SĄ ŁĄCZNIE: miejsce OPODATKOWANIA I
  kwota PODATKU należnego — JEŚLI tak, TO bon SPV (VAT PRZY emisji);
  jeśli NIE (choćby JEDEN element NIEZNANY) — bon MPV (VAT PRZY
  realizacji)
□ PRZY dystrybucji bonów PRZEZ pośrednika/platformę — czy TO
  transfer bonu SPV (OPODATKOWANY w PEŁNEJ wartości NA każdym
  etapie) czy MPV (OPODATKOWANA tylko USŁUGA pośrednictwa/dystrybucji)
□ PRZY realizacji bonu MPV — czy PODSTAWĘ opodatkowania USTALONO wg
  wynagrodzenia ZAPŁACONEGO za bon (art. 29a ust. 1a PKT 1), CZY —
  przy BRAKU tej informacji — wg wartości NOMINALNEJ (pkt 2)
□ Czy PROWADZONA jest ewidencja WYSTARCZAJĄCA do ROZRÓŻNIENIA
  realizacji CAŁOŚCIOWEJ i CZĘŚCIOWEJ bonu MPV (proporcjonalne
  ustalenie PODSTAWY)
□ PRZY bonach NIEZREALIZOWANYCH (breakage) — POTWIERDŹ, że TO MPV
  (SPV rozliczono JUŻ przy emisji, NIEZALEŻNIE od PÓŹNIEJSZEGO losu)

⚠️ Weryfikuj aktualne brzmienie art. 2 pkt 41-45, art. 8a-8b, art.
  29a ust. 1a-1c oraz art. 19a ust. 1a/4a w ISAP — REGULACJA
  bonów WESZŁA w życie 1.01.2019 (implementacja DYREKTYWY UE
  2016/1065) — STOSUNKOWO STABILNA od tego CZASU, ale ZAWSZE
  weryfikuj AKTUALNE brzmienie PRZY konkretnej sprawie, SZCZEGÓLNIE
  przy TRANSAKCJACH transgranicznych/wieloetapowych łańcuchach
  dystrybucji.
```

---

## 4g. ⭐⭐⭐ PUSTA FAKTURA — OBOWIĄZEK ZAPŁATY PODATKU Z SAMEJ FAKTURY
(art. 108 ustawy VAT) — dodane 2026-08-12, uzupełnienie luki #1 z audytu
pokrycia VAT (dotąd moduł zawierał WYŁĄCZNIE art. 108a — MPP — i art.
108c, a SAM art. 108 nie występował ani razu, mimo że jest to jedna z
najczęstszych podstaw decyzji wymiarowych i praktycznie zawsze łączy się
z zarzutem karnoskarbowym)

```
⭐⭐⭐ TREŚĆ NORMY (art. 108 ust. 1–3):
  ust. 1 — gdy osoba prawna, jednostka organizacyjna niemająca osobowości
    prawnej LUB osoba fizyczna WYSTAWI FAKTURĘ, W KTÓREJ WYKAŻE KWOTĘ
    PODATKU — JEST OBOWIĄZANA DO JEGO ZAPŁATY
  ust. 2 — przepis ust. 1 stosuje się ODPOWIEDNIO, gdy podatnik wystawi
    fakturę z kwotą podatku WYŻSZĄ od kwoty podatku należnego
  ust. 3 — w przypadku z art. 43 ust. 12a do zapłaty podatku obowiązana
    jest ORGANIZACJA POŻYTKU PUBLICZNEGO
  ust. 4 — (uchylony)

⭐⭐⭐ TRZY CECHY KONSTRUKCYJNE, KTÓRE DECYDUJĄ O CAŁEJ OBRONIE:
  1) OBOWIĄZEK POWSTAJE Z SAMEGO WYSTAWIENIA faktury — NIEZALEŻNIE od
     tego, czy czynność w ogóle zaistniała, czy podlegała opodatkowaniu i
     czy była zwolniona. To NIE jest podatek od transakcji, lecz
     samoistny obowiązek od DOKUMENTU
  2) ADRESATEM jest KAŻDY WYSTAWCA — także podmiot NIEBĘDĄCY podatnikiem
     VAT (przepis mówi o „osobie prawnej / jednostce organizacyjnej /
     osobie fizycznej", nie o „podatniku" — inaczej niż ust. 2)
  3) ⭐ KWOTY Z ART. 108 NIE ROZLICZA SIĘ W DEKLARACJI na zasadach
     ogólnych i NIE POMNIEJSZA SIĘ jej o podatek naliczony — to
     zobowiązanie odrębne od rozliczenia okresowego

⭐⭐⭐ CHARAKTER PRAWNY — KLUCZOWY ARGUMENT OBRONY:
  → Wyrok TK z 21.04.2015 r., sygn. **P 40/13** — TK badał zgodność art.
    62 § 2 KKS w zakresie, w jakim dopuszcza odpowiedzialność
    karnoskarbową osoby fizycznej, wobec której za TEN SAM CZYN
    (wystawienie nierzetelnej faktury) zastosowano uprzednio obowiązek
    zapłaty z art. 108 ust. 1 ustawy o VAT. TK orzekł o ZGODNOŚCI art. 62
    § 2 KKS z art. 2 Konstytucji — a rozstrzygnięcie oparł na tezie, że
    art. 108 ust. 1 NIE MA charakteru SANKCYJNEGO; jego funkcją jest
    ZAPOBIEŻENIE USZCZUPLENIU wpływów budżetowych (rekompensata ryzyka),
    a nie karanie
  → ⭐ PRAKTYCZNA KONSEKWENCJA: skoro celem normy jest USUNIĘCIE RYZYKA
    USZCZUPLENIA, to TAM, GDZIE RYZYKO ZOSTAŁO W CZASIE WYELIMINOWANE,
    stosowanie art. 108 traci podstawę. To fundament linii obrony
  → ⚠️ UWAGA NA DEZAKTUALIZACJĘ: starsze orzecznictwo NSA (sprzed wyroku
    TK z 2015 r.) opisywało art. 108 jako przepis „sankcyjno-prewencyjny"
    — powoływanie TAKICH tez dziś jest błędem; niektóre WSA nadal
    posługują się terminem „sankcja" i TO WYMAGA SPROSTOWANIA w piśmie
  ✅ [VER: trybunal.gov.pl — komunikat o sprawie P 40/13, rozpoznanie
     21.04.2015; potwierdzone w 3 niezależnych źródłach z przytoczeniem
     sentencji, 2026-08-12]

⭐⭐ LINIA OBRONY — KOLEJNOŚĆ ARGUMENTÓW:
  1. NEGACJA HIPOTEZY: czy dokument jest w ogóle „fakturą" i czy został
     WPROWADZONY DO OBROTU PRAWNEGO? Faktura wystawiona i niewydana
     kontrahentowi (wycofana, zniszczona) — brak ryzyka odliczenia po
     stronie odbiorcy
  2. WYELIMINOWANIE RYZYKA W CZASIE: korekta faktury „do zera" przed
     wykorzystaniem przez odbiorcę; jeżeli odbiorca odliczył — wykazanie,
     że odliczenie zostało cofnięte/skorygowane
  3. DOBRA WIARA I RZECZYWISTA PRZYCZYNA BŁĘDU: błąd w kwalifikacji
     towaru/usługi (np. spór o klasyfikację → patrz
     mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci.md),
     omyłka rachunkowa, przedwczesne wystawienie — to NIE JEST „pusta
     faktura" w rozumieniu praktyki organów
  4. BRAK PRZYMIOTU WYSTAWCY: faktura wystawiona przez PRACOWNIKA z
     wykorzystaniem danych pracodawcy, poza jego wiedzą i kontrolą
     → wyrok TSUE **C-442/22** — obowiązek zapłaty obciąża PRACOWNIKA,
     a nie pracodawcę, POD WARUNKIEM że pracodawca dochował NALEŻYTEJ
     STARANNOŚCI rozsądnie wymaganej w celu KONTROLOWANIA DZIAŁAŃ tego
     pracownika; przy braku takiej staranności (lub złej wierze)
     odpowiedzialność wraca na pracodawcę
     ✅ [VER: opracowanie EY dot. C-442/22, 2026-08-12]
     ⚠️ [ZALECANA WERYFIKACJA pełnego tekstu na curia.europa.eu przed
        powołaniem w piśmie]
  5. ⭐ TEST ORGANIZACYJNY po C-442/22 — DO ZBADANIA W KAŻDEJ SPRAWIE
     PRACOWNICZEJ: czy pracownik miał uprawnienie do wystawiania faktur
     POZA systemem? czy wymagana była zgoda przełożonego? czy istniały
     mechanizmy kontroli wewnętrznej? BRAK tych mechanizmów bywa
     kwalifikowany przez organy jako niedochowanie należytej staranności
     pracodawcy

⛔ SPRZĘŻENIE KARNOSKARBOWE — OBOWIĄZKOWY KWALIFIKATOR:
  → Zastosowanie art. 108 ust. 1 NIE WYKLUCZA odpowiedzialności z art. 62
    § 2 KKS wobec TEJ SAMEJ osoby fizycznej za TEN SAM czyn (wprost
    przesądzone wyrokiem TK P 40/13)
  → Przy fakturach o dużej wartości bada się DODATKOWO kwalifikację z
    Kodeksu karnego (przestępstwa fakturowe) — ⚠️ PRZEPISY KK i KKS
    WERYFIKUJ w module dr-03 (prawo karne) PRZED powołaniem; NIE
    przenoś numerów artykułów karnych z tego modułu z pamięci
  → ⭐ KOLEJNOŚĆ PRACY: ustal najpierw, czy klient jest wystawcą, czy
    odbiorcą pustej faktury — po stronie ODBIORCY podstawą odmowy
    odliczenia jest art. 88 ust. 3a pkt 4 lit. a (patrz sekcja 4h
    niżej), a NIE art. 108

□ POWIĄZANIA WEWNĄTRZ MODUŁU: art. 88 ust. 3a (sekcja 4h) — strona
  nabywcy | art. 112b–112c (sekcja 4e) — dodatkowe zobowiązanie |
  art. 109a (sekcja 5) — odrębna sankcja 100% przy fakturze do paragonu
  bez NIP

✅ [VER: lexlege.pl / arslege.pl / przepisy.gofin.pl — zgodne brzmienie
   art. 108 ust. 1–3, Dz.U.2025.0.775 t.j., 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP]
```

---

## 4h. ⭐⭐⭐ WYŁĄCZENIA PRAWA DO ODLICZENIA — KATALOG NEGATYWNY
(art. 88 ustawy VAT) — dodane 2026-08-12, uzupełnienie luki #2 z audytu
pokrycia VAT (dotąd sekcja o odliczeniu opisywała WYŁĄCZNIE zarzut braku
dobrej wiary; sam art. 88 — czyli przesłanki NEGATYWNE odliczenia — nie
występował w całym DR-06)

```
⭐⭐⭐ UKŁAD NORMY: prawo do odliczenia wymaga spełnienia przesłanek
  POZYTYWNYCH (art. 86 ust. 1 — związek z czynnościami opodatkowanymi)
  ORAZ NIEZAISTNIENIA przesłanek NEGATYWNYCH (art. 88). Organ, który
  odmawia odliczenia, MUSI wskazać KONKRETNĄ jednostkę art. 88 —
  ⭐ brak precyzyjnej podstawy w decyzji to samodzielny zarzut

⭐⭐ ART. 88 UST. 1 — WYŁĄCZENIA PRZEDMIOTOWE (rodzaj nabycia):
  pkt 1–3 — (uchylone)
  pkt 4 — **usługi noclegowe i gastronomiczne**, Z WYJĄTKIEM:
    a) (uchylona)
    b) nabycia GOTOWYCH POSIŁKÓW przeznaczonych DLA PASAŻERÓW przez
       podatników świadczących usługi PRZEWOZU OSÓB
    c) ⭐ usług NOCLEGOWYCH nabywanych W CELU ICH ODPRZEDAŻY,
       opodatkowanych u tego podatnika na podstawie art. 8 ust. 2a
       (refakturowanie) — ⚠️ WYJĄTEK DOTYCZY WYŁĄCZNIE NOCLEGÓW;
       usługi GASTRONOMICZNE nabywane w celu odprzedaży NIE zostały
       objęte tym wyjątkiem
  pkt 5 — (uchylony)

□ ART. 88 UST. 1a — wyłączenie dla wydatków, o których mowa w art. 29a
  ust. 7 pkt 3 (kwoty otrzymane od nabywcy jako zwrot udokumentowanych
  wydatków, ponoszonych w imieniu i na rzecz nabywcy)

⭐⭐⭐ ART. 88 UST. 3a — WYŁĄCZENIA DOKUMENTOWE (najczęstsza podstawa
  odmowy odliczenia w sporach). NIE STANOWIĄ podstawy do obniżenia
  podatku należnego ani zwrotu — faktury i dokumenty celne, gdy:
  pkt 1 lit. a — sprzedaż udokumentowano fakturą/fakturą korygującą
    wystawioną przez **PODMIOT NIEISTNIEJĄCY**; lit. b — (uchylona)
  pkt 2 — transakcja udokumentowana fakturą **NIE PODLEGA OPODATKOWANIU
    ALBO JEST ZWOLNIONA** od podatku
  pkt 3 — (uchylony)
  pkt 4 — wystawione faktury / faktury korygujące / dokumenty celne:
    a) **STWIERDZAJĄ CZYNNOŚCI, KTÓRE NIE ZOSTAŁY DOKONANE** — w części
       dotyczącej tych czynności ⭐ TO JEST PODSTAWOWY ZARZUT PRZY
       PUSTYCH FAKTURACH PO STRONIE NABYWCY (lustrzane odbicie art. 108
       po stronie wystawcy — sekcja 4g wyżej)
    b) **PODAJĄ KWOTY NIEZGODNE Z RZECZYWISTOŚCIĄ** — w części dotyczącej
       tych pozycji ⭐ ZWRÓĆ UWAGĘ: wyłączenie jest CZĘŚCIOWE, nie
       obejmuje całej faktury — organ często stosuje je zbyt szeroko
    c) potwierdzają czynności, do których mają zastosowanie **art. 58 i
       art. 83 Kodeksu cywilnego** (nieważność bezwzględna, pozorność) —
       w części dotyczącej tych czynności
  pkt 5 — faktury/faktury korygujące wystawione PRZEZ NABYWCĘ
    (samofakturowanie) NIE ZOSTAŁY ZAAKCEPTOWANE przez sprzedającego
  pkt 6 — (uchylony)
  pkt 7 — wystawiono faktury z wykazaną kwotą podatku w stosunku do
    czynności opodatkowanych, dla których NIE WYKAZUJE SIĘ kwoty podatku
    na fakturze — w części dotyczącej tych czynności (m.in. odwrotne
    obciążenie / procedura marży)

□ UST. 3b — ust. 3a stosuje się ODPOWIEDNIO do DUPLIKATÓW faktur oraz
  KOLEJNYCH EGZEMPLARZY faktur
□ UST. 4 — wyłączenie dla podatników NIEZAREJESTROWANYCH jako VAT czynni
  zgodnie z art. 96, z wyłączeniem przypadków z art. 86 ust. 2 pkt 7
  ⭐ ORZECZNICTWO TSUE konsekwentnie ogranicza formalizm rejestracyjny —
  sama późniejsza rejestracja bywa uznawana za wystarczającą; ⚠️ zweryfikuj
  aktualną linię PRZED powołaniem
□ UST. 6 — wyłączenie dla podatku naliczonego z art. 86 ust. 2 pkt 4 lit.
  c przy WNT „sankcyjnym" z art. 25 ust. 2 (podanie polskiego numeru VAT
  UE, gdy towary kończą transport w innym państwie członkowskim)

⭐⭐ MAPA ZARZUTÓW I KONTRZARZUTÓW:
  ZARZUT organu: art. 88 ust. 3a pkt 1 lit. a (podmiot nieistniejący)
    → OBRONA: „nieistniejący" ≠ „wykreślony z rejestru"; wykaż FAKTYCZNE
      PROWADZENIE działalności przez kontrahenta w dacie transakcji
      (adres, personel, magazyn, transport, korespondencja)
  ZARZUT: art. 88 ust. 3a pkt 4 lit. a (czynność niedokonana)
    → OBRONA: dowody RZECZYWISTOŚCI świadczenia (WZ, CMR, protokoły,
      zdjęcia, korespondencja, przepływy pieniężne) + dobra wiara i
      należyta staranność wg orzecznictwa TSUE
  ZARZUT: art. 88 ust. 3a pkt 4 lit. b (kwoty niezgodne)
    → OBRONA: żądaj OGRANICZENIA wyłączenia DO POZYCJI zakwestionowanych
      — ustawa mówi „w części dotyczącej tych pozycji"
  ZARZUT: art. 88 ust. 1 pkt 4 (nocleg/gastronomia)
    → OBRONA: sprawdź, czy nie zachodzi wyjątek lit. c (odprzedaż
      noclegów) albo czy świadczenie nie jest elementem USŁUGI
      KOMPLEKSOWEJ o innym charakterze głównym

✅ [VER: lexlege.pl — pełny tekst art. 88 ustawy o VAT, Dz.U.2025.0.775
   t.j., stan prawny na 12.08.2026; pobrane 2026-08-12; brzmienie
   potwierdzone dodatkowo w arslege.pl i eureka.mf.gov.pl]
⚠️ [ZALECANA WERYFIKACJA ISAP]
```

---

## 4i. ⭐⭐⭐ ODLICZENIE CZĘŚCIOWE — PROPORCJA (art. 90), PREWSPÓŁCZYNNIK
(art. 86 ust. 2a–2h) I KOREKTA WIELOLETNIA (art. 91) — dodane 2026-08-12,
uzupełnienie luki #3 z audytu pokrycia VAT (dotąd cały mechanizm
odliczenia częściowego był nieobecny poza JEDNĄ wzmianką o art. 90 ust.
10c przy grupie VAT — dotyczy każdej działalności mieszanej: JST, ochrona
zdrowia, edukacja, finanse, NGO, spółdzielnie)

```
⭐⭐⭐ DWA ODRĘBNE, NAKŁADAJĄCE SIĘ MECHANIZMY — NIE MYLIĆ:
  ETAP 1 — PREWSPÓŁCZYNNIK (art. 86 ust. 2a): dzieli podatek naliczony
    między DZIAŁALNOŚĆ GOSPODARCZĄ a CELE INNE NIŻ działalność
    gospodarcza (np. działalność publicznoprawna gminy, działalność
    statutowa nieodpłatna)
  ETAP 2 — PROPORCJA / WSPÓŁCZYNNIK (art. 90 ust. 2): W RAMACH
    działalności gospodarczej dzieli podatek między czynności
    OPODATKOWANE a ZWOLNIONE
  ⭐ Podatnik może podlegać OBU ETAPOM JEDNOCZEŚNIE (najpierw pre-, potem
    współczynnik) — typowo gmina prowadząca odpłatny najem i sprzedaż
    zwolnioną obok zadań własnych

⭐⭐ ETAP 1 — PREWSPÓŁCZYNNIK (art. 86 ust. 2a–2h):
  □ Przesłanka: nabycia wykorzystywane ZARÓWNO do działalności
    gospodarczej, JAK I do celów innych, gdy PRZYPISANIE w całości do
    działalności gospodarczej NIE JEST MOŻLIWE
  □ Kryterium ustawowe (ust. 2b): sposób określenia proporcji ma
    NAJBARDZIEJ ODPOWIADAĆ SPECYFICE działalności i dokonywanych nabyć —
    zapewniać odliczenie wyłącznie w części przypadającej na działalność
    gospodarczą i obiektywnie odzwierciedlać wykorzystanie
  □ Przykładowe klucze (ust. 2c): OSOBOWY, GODZINOWY, OBROTOWY,
    POWIERZCHNIOWY — katalog OTWARTY
  □ Rozporządzenie MF z 17.12.2015 r. w sprawie sposobu określania
    zakresu wykorzystywania nabywanych towarów i usług do celów
    działalności gospodarczej w przypadku niektórych podatników
    (Dz. U. z 2015 r. poz. 2193) — narzuca klucz obrotowy m.in. JST,
    zakładom budżetowym, uczelniom, instytutom
  □ ⭐⭐⭐ ART. 86 UST. 2h — PRAWO WYJŚCIA POZA ROZPORZĄDZENIE: podatnik,
    dla którego sposób określenia proporcji wskazuje rozporządzenie,
    MOŻE zastosować INNY, BARDZIEJ REPREZENTATYWNY sposób, jeżeli uzna,
    że metoda rozporządzeniowa nie odpowiada specyfice jego działalności
    → CIĘŻAR ARGUMENTACJI PO STRONIE PODATNIKA: musi WYKAZAĆ, że metoda
      alternatywna jest BARDZIEJ WŁAŚCIWA, nie tylko korzystniejsza
    → ⭐ NAJCZĘSTSZY SPÓR PRAKTYCZNY: gospodarka wodno-kanalizacyjna JST
      — klucz metrażowy/ilościowy (m³ dostarczonej wody) zamiast klucza
      obrotowego z rozporządzenia; linia orzecznicza sądów
      administracyjnych jest tu w znacznej części KORZYSTNA dla gmin
    ⚠️ [SPRAWDŹ AKTUALNĄ LINIĘ ORZECZNICZĄ przed sporządzeniem pisma —
       użyj skilla orzeczenia-sadowe-v2; NIE powołuj sygnatur z pamięci]
  □ Korekta roczna prewspółczynnika: art. 90c (odesłanie do art. 91 ust.
    2–9); ust. 3 art. 90c ⭐ POZWALA przy korekcie przyjąć INNY sposób
    określania proporcji niż przyjęty na dany rok, jeżeli byłby bardziej
    reprezentatywny dla zakończonego roku

⭐⭐ ETAP 2 — PROPORCJA (art. 90):
  □ ust. 1 — OBOWIĄZEK odrębnego określenia kwot podatku naliczonego
    związanych z czynnościami dającymi prawo do odliczenia (alokacja
    bezpośrednia MA PIERWSZEŃSTWO przed proporcją)
  □ ust. 3 — proporcja = roczny obrót z czynności z prawem do odliczenia
    / całkowity obrót z czynności z prawem i bez prawa
  □ ust. 4 — ustalana PROCENTOWO w stosunku rocznym na podstawie obrotu
    ROKU POPRZEDNIEGO, ZAOKRĄGLANA W GÓRĘ do liczby całkowitej
  □ ust. 5 — do obrotu NIE WLICZA SIĘ dostawy środków trwałych i WNiP
    podlegających amortyzacji oraz gruntów i praw wieczystego
    użytkowania zaliczonych do środków trwałych — używanych na potrzeby
    działalności podatnika
  □ ust. 6 — NIE WLICZA SIĘ obrotu z transakcji POMOCNICZYCH w zakresie
    nieruchomości i pomocniczych transakcji FINANSOWYCH oraz usług z art.
    43 ust. 1 pkt 7, 12 i 38–41 w zakresie, w jakim mają charakter
    POMOCNICZY ⭐ „pomocniczość" to samodzielne, częste pole sporu
  □ ust. 8–9 — proporcja SZACUNKOWA gdy brak obrotu w roku poprzednim
    albo obrót był niższy niż **30 000 zł**, a także gdy podatnik uzna
    obrót za NIEREPREZENTATYWNY; ZAWIADOMIENIE naczelnika US do **25.
    dnia miesiąca** następującego po miesiącu pierwszego zastosowania,
    nie później niż w dniu przesłania ewidencji z art. 109 ust. 3
  □ ⭐ ust. 10 — PROGI ZAOKRĄGLENIA: proporcja > **98%** ORAZ kwota
    nieodliczona w skali roku < **10 000 zł** → można przyjąć **100%**;
    proporcja ≤ **2%** → można przyjąć **0%**
    ⚠️ WARUNEK KWOTOWY przy 98% JEST ŁATWY DO PRZEOCZENIA — sama
    proporcja powyżej 98% NIE WYSTARCZA
  □ ust. 10a–10b — w JST proporcję ustala się ODRĘBNIE DLA KAŻDEJ
    jednostki organizacyjnej (jednostka budżetowa, zakład budżetowy,
    urząd gminy / starostwo / urząd marszałkowski)
  □ ust. 10c–10g — grupa VAT (proporcja odrębnie dla każdego członka) i
    reguły po utracie statusu przez grupę / przywróceniu rejestracji z
    art. 96 ust. 9k

⭐⭐⭐ KOREKTA (art. 91) — NAJCZĘSTSZE ŹRÓDŁO NIEDOSZACOWANEGO RYZYKA:
  □ ust. 1 — korekta ROCZNA po zakończeniu roku, wg proporcji
    RZECZYWISTEJ dla zakończonego roku
  □ ⭐ ust. 1a–1b — MOŻNA NIE KOREGOWAĆ, gdy różnica proporcji ≤ **2
    PUNKTY PROCENTOWE**; przy proporcji rzeczywistej NIŻSZEJ — dodatkowo
    kwota nieodliczona (z różnicy proporcji + korekty z ust. 2, bez
    środków trwałych ≤ 15 000 zł) nie może przekraczać **10 000 zł**
  □ ⭐⭐⭐ ust. 2 — KOREKTA WIELOLETNIA: środki trwałe i WNiP podlegające
    amortyzacji oraz grunty i prawa wieczystego użytkowania zaliczone do
    środków trwałych, o wartości początkowej POWYŻEJ **15 000 zł**:
    → **5 KOLEJNYCH LAT** (roczna korekta = 1/5)
    → **10 LAT** dla NIERUCHOMOŚCI i praw wieczystego użytkowania
      gruntów (roczna korekta = 1/10), licząc OD ROKU ODDANIA DO
      UŻYTKOWANIA
    → wartość początkowa ≤ 15 000 zł — korekta JEDNORAZOWA po zakończeniu
      roku oddania do użytkowania
  □ ust. 2a — obowiązek korekty 10-letniej NIE dotyczy OPŁAT ROCZNYCH za
    użytkowanie wieczyste (stosuje się ust. 1)
  □ ust. 3 — korektę wykazuje się w deklaracji za PIERWSZY OKRES
    ROZLICZENIOWY roku następnego, a przy zakończeniu działalności — w
    deklaracji za OSTATNI okres
  □ ⭐ ust. 4–6 — SPRZEDAŻ w okresie korekty: przyjmuje się, że towar jest
    nadal wykorzystywany do czynności opodatkowanych AŻ DO KOŃCA okresu
    korekty, a korekty dokonuje się JEDNORAZOWO za cały pozostały okres.
    Jeżeli sprzedaż była ZWOLNIONA lub niepodlegająca — dalsze
    wykorzystanie traktuje się jako związane WYŁĄCZNIE z czynnościami
    zwolnionymi/niepodlegającymi → ⚠️ TO GENERUJE SKOKOWY ZWROT
    ODLICZONEGO VAT przy sprzedaży nieruchomości ze zwolnieniem z art. 43
    ust. 1 pkt 10 — LICZ TO PRZED podjęciem decyzji o opcji opodatkowania
    (patrz sekcja 4c)
  □ ust. 7–7d — korekta przy ZMIANIE PRAWA do odliczenia (nabycie z
    pełnym prawem, potem zmiana przeznaczenia i odwrotnie); ust. 7c —
    korekty NIE dokonuje się, jeżeli od końca okresu rozliczeniowego
    wydania do użytkowania upłynęło **12 MIESIĘCY**; ust. 7d — towary
    handlowe/surowce: korekta w deklaracji za okres, w którym nastąpiła
    zmiana
  □ ⭐ ust. 7e — podatnik korzystający ze zwolnień z art. 43 ust. 1 pkt 3,
    art. 113 ust. 1 albo art. 113a ust. 1 MOŻE skorygować podatek za
    pozostały okres korekty w deklaracji za OSTATNI okres, w którym był
    VAT czynnym
  □ ⭐⭐ ust. 9 — przy ZBYCIU PRZEDSIĘBIORSTWA LUB ZCP korekty z ust. 1–8
    dokonuje **NABYWCA** — to samodzielna, często pomijana pozycja
    ryzyka w due diligence transakcyjnym

□ POKREWNE KOREKTY SZCZEGÓLNE:
  → art. 90a — nieruchomość z art. 86 ust. 7b: zmiana stopnia
    wykorzystania w ciągu **120 MIESIĘCY** od oddania do użytkowania
  → art. 90b — pojazdy samochodowe: **60 MIESIĘCY** (a przy wartości
    początkowej ≤ 15 000 zł — **12 MIESIĘCY**); pełne opracowanie w
    mod-odliczenia-uzytek-mieszany-firma-prywatny-KUP.md

✅ [VER: lexlege.pl — pełny tekst art. 90, 90a, 90b, 90c i 91 ustawy o
   VAT, Dz.U.2025.0.775 t.j.; pobrane 2026-08-12. Art. 86 ust. 2a–2h i
   rozporządzenie Dz.U. 2015 poz. 2193 — potwierdzone w 4 niezależnych
   źródłach, w tym interpretacji KIS i opracowaniu KPMG]
⚠️ [ZALECANA WERYFIKACJA ISAP — w szczególności aktualny status i tekst
   rozporządzenia z 17.12.2015 r., którego metryki NIE potwierdzono w
   źródle urzędowym]
```

---

## 4j. ⭐⭐ NIEODPŁATNE PRZEKAZANIA I ŚWIADCZENIA — art. 7 ust. 2–4 i 7,
art. 8 ust. 2, 2a i 5 — dodane 2026-08-12, uzupełnienie luki #5 z audytu
pokrycia VAT (najczęstszy błąd rozliczeniowy MŚP: darowizny, zużycie
towarów na cele osobiste, świadczenia dla pracowników)

```
⭐⭐⭐ ZASADA (art. 7 ust. 2): za dostawę towarów uznaje się RÓWNIEŻ
  NIEODPŁATNE przekazanie towarów należących do przedsiębiorstwa
  podatnika, w szczególności:
    pkt 1 — przekazanie LUB ZUŻYCIE na cele osobiste podatnika, jego
      pracowników (w tym BYŁYCH pracowników), wspólników, udziałowców,
      akcjonariuszy, członków spółdzielni i ich domowników, członków
      organów stanowiących osób prawnych, członków stowarzyszenia
    pkt 2 — WSZELKIE INNE DAROWIZNY
  ⭐⭐⭐ WARUNEK KLUCZOWY (część wspólna): opodatkowanie następuje TYLKO
    JEŻELI podatnikowi przysługiwało — W CAŁOŚCI LUB W CZĘŚCI — PRAWO DO
    ODLICZENIA z tytułu nabycia, importu lub WYTWORZENIA tych towarów
    LUB ICH **CZĘŚCI SKŁADOWYCH**
    → ⭐ „części składowe" to pułapka: towar nabyty bez prawa do
      odliczenia, ale ULEPSZONY zakupami z odliczeniem, może podlegać
      opodatkowaniu przy nieodpłatnym przekazaniu

⭐⭐ WYŁĄCZENIA (art. 7 ust. 3–4 i 7) — PREZENTY MAŁEJ WARTOŚCI I PRÓBKI:
  □ ust. 3 — ust. 2 NIE STOSUJE SIĘ do prezentów o małej wartości i
    próbek, JEŻELI przekazanie następuje NA CELE ZWIĄZANE Z
    DZIAŁALNOŚCIĄ GOSPODARCZĄ podatnika
  □ ⭐⭐ ust. 4 — DWA ROZŁĄCZNE PROGI „prezentu o małej wartości"
    (na JEDNĄ OSOBĘ):
    pkt 1 — łączna wartość w roku podatkowym ≤ **100 ZŁ** (bez podatku),
      POD WARUNKIEM prowadzenia EWIDENCJI pozwalającej ustalić TOŻSAMOŚĆ
      obdarowanych
    pkt 2 — bez ewidencji: jednostkowa CENA NABYCIA (a gdy brak — koszt
      wytworzenia), określona w momencie przekazania, ≤ **20 ZŁ**
    ⚠️ NAJCZĘSTSZY BŁĄD: stosowanie progu 20 zł „na sztukę" przy
      jednoczesnym prowadzeniu ewidencji imiennej albo mieszanie obu
      reżimów — to DWA ODRĘBNE tryby, wybierane osobno
  □ ust. 7 — PRÓBKA: identyfikowalny jako próbka egzemplarz towaru lub
    jego niewielka ilość, pozwalające ocenić cechy i właściwości towaru w
    postaci końcowej, których przekazanie (1) ma na celu PROMOCJĘ tego
    towaru oraz (2) NIE SŁUŻY zasadniczo zaspokojeniu potrzeb ODBIORCY
    KOŃCOWEGO — chyba że zaspokojenie tych potrzeb jest nieodłącznym
    elementem promocji i ma skłaniać do zakupu

⭐⭐ NIEODPŁATNE ŚWIADCZENIE USŁUG (art. 8 ust. 2) — za ODPŁATNE
  świadczenie usług uznaje się również:
  pkt 1 — UŻYCIE towarów stanowiących część przedsiębiorstwa do celów
    INNYCH NIŻ działalność gospodarcza (w tym na cele osobiste podatnika
    i wymienionego kręgu osób), JEŻELI przysługiwało prawo do odliczenia
    przy nabyciu/imporcie/wytworzeniu tych towarów LUB ich części
    składowych
  pkt 2 — NIEODPŁATNE ŚWIADCZENIE USŁUG na cele osobiste tego kręgu osób
    ORAZ wszelkie inne nieodpłatne świadczenie usług do celów innych niż
    działalność gospodarcza podatnika
    ⭐ RÓŻNICA KONSTRUKCYJNA: przy pkt 2 (usługi) ustawa NIE UZALEŻNIA
      opodatkowania od prawa do odliczenia — inaczej niż przy pkt 1 i
      przy art. 7 ust. 2. Decyduje CEL świadczenia
  □ ust. 5–6 — WYŁĄCZENIE dla użycia POJAZDÓW SAMOCHODOWYCH do celów
    innych niż działalność gospodarcza, gdy przysługiwało odliczenie
    obliczone zgodnie z art. 86a ust. 1 (limit 50%); za „nabycie" uznaje
    się też przyjęcie w używanie na podstawie najmu, dzierżawy, leasingu
    → pełne opracowanie: mod-odliczenia-uzytek-mieszany-firma-prywatny-KUP.md

⭐⭐⭐ REFAKTUROWANIE (art. 8 ust. 2a) — DOTĄD NIEOBECNE W MODULE:
  gdy podatnik, działając WE WŁASNYM IMIENIU, ale NA RZECZ OSOBY
  TRZECIEJ, bierze udział w świadczeniu usług — PRZYJMUJE SIĘ, ŻE TEN
  PODATNIK SAM OTRZYMAŁ I WYŚWIADCZYŁ TE USŁUGI (fikcja prawna dwóch
  świadczeń)
  → KONSEKWENCJE: refakturujący stosuje stawkę i moment powstania
    obowiązku podatkowego WŁAŚCIWE DLA USŁUGI REFAKTUROWANEJ, nie dla
    własnej działalności
  → ⭐ POWIĄZANIE: art. 88 ust. 1 pkt 4 lit. c — odprzedaż usług
    NOCLEGOWYCH opodatkowanych właśnie na podstawie art. 8 ust. 2a jest
    JEDYNYM wyjątkiem przywracającym prawo do odliczenia (sekcja 4h)

□ INTAKE DLA TEJ SEKCJI:
  □ Czy przy nabyciu/wytworzeniu przekazywanego towaru odliczono VAT?
  □ Czy odliczono VAT od CZĘŚCI SKŁADOWYCH (ulepszeń)?
  □ Czy prowadzona jest ewidencja obdarowanych (decyduje o progu 100/20 zł)?
  □ Czy przekazanie ma związek z działalnością gospodarczą?
  □ Czy świadczenie na rzecz pracownika jest nieodpłatne, czy częściowo
    odpłatne (wtedy reżim odpłatności + ewentualnie art. 32)?

✅ [VER: lexlege.pl — pełny tekst art. 7 i art. 8 ustawy o VAT,
   Dz.U.2025.0.775 t.j., stan prawny na 12.08.2026; pobrane 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP]
```

---

## 4k. ⭐⭐⭐ WYŁĄCZENIE ZBYCIA PRZEDSIĘBIORSTWA I ZCP SPOD USTAWY
(art. 6 pkt 1 i 2 ustawy VAT) — dodane 2026-08-12 (iteracja II audytu
pokrycia VAT)

```
⭐⭐⭐ TREŚĆ (art. 6): przepisów ustawy NIE STOSUJE SIĘ do:
  pkt 1 — TRANSAKCJI ZBYCIA PRZEDSIĘBIORSTWA LUB ZORGANIZOWANEJ CZĘŚCI
    PRZEDSIĘBIORSTWA
  pkt 2 — czynności, które NIE MOGĄ BYĆ PRZEDMIOTEM PRAWNIE SKUTECZNEJ
    UMOWY
  pkt 3 — (uchylony)

⭐⭐ CHARAKTER WYŁĄCZENIA: to NIE jest zwolnienie, lecz WYŁĄCZENIE
  PRZEDMIOTOWE — czynność w ogóle POZOSTAJE POZA ZAKRESEM ustawy.
  KONSEKWENCJE praktyczne, których nie daje zwolnienie:
  → sprzedawca NIE wykazuje podatku należnego i NIE wystawia faktury VAT
  → transakcja NIE wchodzi do proporcji z art. 90 (nie jest „obrotem")
  → ⚠️ PRZECHODZI POD PCC — wyłączenie z VAT otwiera opodatkowanie
    czynności cywilnoprawnych (patrz mod-ustawa-PCC-i-podatek-spadkow-
    darowizn.md); to ELEMENT KALKULACJI, nie efekt uboczny

⭐⭐⭐ DEFINICJE — DWA RÓŻNE ŹRÓDŁA, NIE MYLIĆ:
  □ PRZEDSIĘBIORSTWO — ustawa o VAT NIE DEFINIUJE; stosuje się definicję
    z **art. 55(1) Kodeksu cywilnego** (zorganizowany zespół składników
    niematerialnych i materialnych przeznaczony do prowadzenia
    działalności gospodarczej)
  □ ZORGANIZOWANA CZĘŚĆ PRZEDSIĘBIORSTWA — definicja WŁASNA ustawy VAT:
    **art. 2 pkt 27e** ⚠️ [WERYFIKUJ pełne brzmienie w ISAP przed
    powołaniem — wymaga wyodrębnienia ORGANIZACYJNEGO, FINANSOWEGO i
    FUNKCJONALNEGO oraz zdolności do samodzielnego realizowania zadań]

⭐⭐ ZAKRES POJĘCIA „TRANSAKCJA ZBYCIA" — utrwalona wykładnia organów:
  rozumiane SZEROKO, w sposób zbliżony do „dostawy towarów" z art. 7 ust.
  1 — obejmuje WSZELKIE czynności przenoszące prawo do rozporządzania
  przedmiotem jak właściciel: sprzedaż, ZAMIANĘ, DAROWIZNĘ, nieodpłatne
  przekazanie, wniesienie APORTEM
  → ⭐ APORT przedsiębiorstwa/ZCP JEST objęty wyłączeniem
  → ⭐ DAROWIZNA ZCP również pozostaje poza VAT (nie stosuje się art. 7
    ust. 2 — patrz sekcja 4j)

⚠️ ZASADA WYKŁADNI ŚCISŁEJ: ze względu na szczególny charakter art. 6 pkt
  1 interpretuje się go ŚCIŚLE — nie wolno rozszerzać na zbycie
  pojedynczych, choćby wartościowych, składników majątku

⭐⭐⭐ NAJCZĘSTSZE POLE SPORU — CZY TO JUŻ ZCP:
  □ Brak nieruchomości w zbywanym zespole NIE PRZESĄDZA o braku ZCP —
    decyduje zdolność do samodzielnego funkcjonowania (w orzecznictwie
    sądów administracyjnych pogląd ugruntowany)
    ⚠️ [SYGNATURY do potwierdzenia przez orzeczenia-sadowe-v2 przed
       powołaniem w piśmie — NIE cytuj z tego modułu]
  □ Zbycie nieruchomości wraz z umowami najmu — spór „ZCP czy dostawa
    towaru"; ROZSTRZYGA stopień wyodrębnienia i przejęcie umów,
    personelu, rachunków, zobowiązań
  □ ⭐ RYZYKO DWUSTRONNE: błędna kwalifikacja jako ZCP → brak podatku
    należnego u zbywcy (zaległość + odsetki); błędna kwalifikacja jako
    dostawa → u nabywcy odmowa odliczenia na podstawie art. 88 ust. 3a
    pkt 2 („transakcja nie podlega opodatkowaniu") — sekcja 4h
  → ⭐ REKOMENDACJA STANDARDOWA: przy transakcji o istotnej wartości —
    WNIOSEK O INTERPRETACJĘ INDYWIDUALNĄ przed zawarciem umowy; przy
    braku czasu — klauzula umowna o podziale ryzyka podatkowego i
    zabezpieczenie kwoty spornego VAT

⛔ SPRZĘŻENIE Z KOREKTĄ WIELOLETNIĄ: art. 91 ust. 9 — przy zbyciu
  przedsiębiorstwa lub ZCP korekty z art. 91 ust. 1–8 dokonuje **NABYWCA**
  (sekcja 4i). To pozycja OBOWIĄZKOWA w due diligence — nabywca przejmuje
  otwarte okresy korekty 5/10-letniej

✅ [VER: lexlege.pl / arslege.pl / przepisy.gofin.pl — zgodne brzmienie
   art. 6, Dz.U.2025.0.775 t.j.; wykładnia „transakcji zbycia"
   potwierdzona w 4 interpretacjach indywidualnych KIS (2025–2026),
   2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP — w szczególności art. 2 pkt 27e]
```

---

## 4l. ⭐⭐⭐ MIEJSCE DOSTAWY TOWARÓW I TRANSAKCJE ŁAŃCUCHOWE
(art. 22 ustawy VAT) — dodane 2026-08-12 (iteracja II audytu pokrycia
VAT; usuwa ASYMETRIĘ STRUKTURALNĄ modułu: miejsce świadczenia USŁUG miało
ok. 220 linii, miejsce dostawy TOWARÓW — zero)

```
⭐⭐ MIEJSCE DOSTAWY — KATALOG (art. 22 ust. 1):
  pkt 1 — towary WYSYŁANE lub TRANSPORTOWANE → miejsce, w którym towary
    znajdują się w momencie ROZPOCZĘCIA wysyłki lub transportu do nabywcy
    ⚠️ [BRZMIENIE pkt 1 odtworzone z kontekstu przepisu i praktyki —
       ZWERYFIKUJ DOSŁOWNIE W ISAP przed cytowaniem w piśmie]
  pkt 2 — towary INSTALOWANE lub MONTOWANE (z próbnym uruchomieniem lub
    bez) przez dokonującego dostawy lub podmiot działający na jego rzecz
    → miejsce INSTALACJI/MONTAŻU; ⭐ NIE UZNAJE SIĘ za instalację/montaż
    PROSTYCH CZYNNOŚCI umożliwiających funkcjonowanie towaru zgodnie z
    przeznaczeniem (granica sporna przy dostawach maszyn i urządzeń)
  pkt 3 — towary NIEWYSYŁANE ani nietransportowane → miejsce, w którym
    znajdują się W MOMENCIE DOSTAWY
  pkt 4 — dostawa na pokładach STATKÓW, SAMOLOTÓW, POCIĄGÓW w trakcie
    części transportu pasażerów wykonywanej na terytorium UE → miejsce
    ROZPOCZĘCIA TRANSPORTU PASAŻERÓW
  pkt 5 — dostawa GAZU w systemie gazowym, ENERGII ELEKTRYCZNEJ w
    systemie elektroenergetycznym, energii CIEPLNEJ/CHŁODNICZEJ przez
    sieci dystrybucji — do podmiotu będącego podatnikiem
□ ust. 3 — dostawa NASTĘPUJĄCA PO wysyłce/transporcie uznana za dokonaną
  w miejscu ZAKOŃCZENIA wysyłki lub transportu
□ ust. 4 — gdy miejscem rozpoczęcia wysyłki jest terytorium PAŃSTWA
  TRZECIEGO, dostawę dokonaną przez podatnika będącego również podatnikiem
  z tytułu IMPORTU uważa się za dokonaną w państwie członkowskim importu

⭐⭐⭐ TRANSAKCJE ŁAŃCUCHOWE — KLUCZ: „DOSTAWA RUCHOMA" vs „NIERUCHOMA"
  Sytuacja: kilka podmiotów dokonuje dostawy TEGO SAMEGO towaru, a towar
  jest wydawany BEZPOŚREDNIO od pierwszego dostawcy do ostatniego
  nabywcy. Transport można przypisać TYLKO JEDNEJ dostawie w łańcuchu —
  TA JEST „RUCHOMA" (i tylko ona może być WDT ze stawką 0% albo
  eksportem). Pozostałe są „NIERUCHOME" — opodatkowane lokalnie w
  miejscu rozpoczęcia albo zakończenia transportu (ust. 3)

⭐⭐ REGUŁY PRZYPORZĄDKOWANIA:
  □ ust. 2 — REGUŁA OGÓLNA: gdy transport organizuje NABYWCA, który
    dokonuje również dalszej dostawy — przyjmuje się, że transport jest
    przyporządkowany dostawie DOKONANEJ DO TEGO NABYWCY, CHYBA ŻE z
    WARUNKÓW DOSTAWY wynika co innego
    ⚠️ pojęcie „warunków dostawy" NIE JEST zdefiniowane ustawowo — w
    praktyce bada się INCOTERMS, moment przejścia ryzyka, kto zawiera
    umowę przewozu i ponosi jej koszt; TO GŁÓWNE POLE SPORU
  □ ust. 2a — EKSPORT (towary z terytorium kraju na terytorium państwa
    trzeciego przez nabywcę dokonującego również dostawy): transport
    przyporządkowany dostawie DO TEGO NABYWCY, chyba że z warunków
    dostawy wynika, że należy go przyporządkować JEGO dostawie
  □ ⭐⭐⭐ ust. 2b — WEWNĄTRZWSPÓLNOTOWO (towar z jednego państwa
    członkowskiego do innego): wysyłka/transport przyporządkowane
    WYŁĄCZNIE dostawie dokonanej DO PODMIOTU POŚREDNICZĄCEGO
  □ ⭐⭐⭐ ust. 2c — WYJĄTEK OD ust. 2b: jeżeli podmiot pośredniczący
    PRZEKAZAŁ SWOJEMU DOSTAWCY numer identyfikacyjny VAT-UE nadany mu
    przez państwo członkowskie, Z KTÓREGO towary są wysyłane — transport
    przypisuje się dostawie DOKONANEJ PRZEZ TEN PODMIOT
    ⭐ TO JEST JEDYNY, PROSTY „PRZEŁĄCZNIK" W RĘKACH PODATNIKA —
    przekazanie właściwego numeru VAT-UE przesuwa dostawę ruchomą o
    jedno ogniwo. Sprawdź to ZAWSZE przed przyjęciem kwalifikacji organu
  □ ust. 2d — DEFINICJA: PODMIOT POŚREDNICZĄCY to dostawca INNY NIŻ
    PIERWSZY w kolejności, który wysyła lub transportuje towar
    SAMODZIELNIE albo za pośrednictwem osoby trzeciej działającej NA JEGO
    RZECZ
  ⚠️ ust. 2b–2c NIE MAJĄ ZASTOSOWANIA, gdy transport organizuje PIERWSZY
    albo OSTATNI podmiot w łańcuchu — wtedy wraca reguła ogólna z ust. 2

□ POWIĄZANIE — TRANSAKCJE TRÓJSTRONNE, PROCEDURA UPROSZCZONA: Dział XII
  rozdział 8, **art. 135–138** ustawy VAT ⚠️ [DOTĄD NIEOPRACOWANE — nie
  powołuj warunków procedury z pamięci; zweryfikuj w ISAP]

⭐ CHECKLIST DLA SPRAWY ŁAŃCUCHOWEJ:
  □ Ilu podmiotów dotyczy łańcuch i jaka jest kolejność fakturowania?
  □ Kto FAKTYCZNIE organizuje transport (umowa przewozu, koszt, ryzyko)?
  □ Jakie INCOTERMS zastosowano na każdym etapie?
  □ Jaki numer VAT-UE podał podmiot pośredniczący i KOMU (ust. 2c)?
  □ Czy któryś podmiot jest pierwszym/ostatnim organizatorem transportu
    (wyłączenie ust. 2b–2c)?
  □ Czy dokumentacja WDT z art. 42 dotyczy WŁAŚCIWEJ dostawy w łańcuchu?

✅ [VER: art. 22 ust. 1 pkt 2–5 oraz ust. 3–4 — przepisy.gofin.pl;
   art. 22 ust. 2, 2a, 2b, 2c, 2d — zgodnie w 4 niezależnych źródłach
   (gofin.pl, pit.pl, infor.pl, ksiegowego.pl), 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP — w szczególności dosłowne brzmienie
   art. 22 ust. 1 pkt 1 oraz art. 135–138]
```

---

## 4m. ⭐⭐ ORGANY WŁADZY PUBLICZNEJ JAKO PODATNIK — IMPERIUM vs DOMINIUM
(art. 15 ust. 6 ustawy VAT) — dodane 2026-08-12 (iteracja II audytu
pokrycia VAT; brak tego przepisu odcinał cały segment spraw JST mimo
istnienia DR-08)

```
⭐⭐⭐ TREŚĆ (art. 15 ust. 6): NIE UZNAJE SIĘ ZA PODATNIKA organów władzy
  publicznej oraz urzędów obsługujących te organy — W ZAKRESIE
  REALIZOWANYCH ZADAŃ NAŁOŻONYCH ODRĘBNYMI PRZEPISAMI PRAWA, DLA
  REALIZACJI KTÓRYCH ZOSTAŁY ONE POWOŁANE — Z WYŁĄCZENIEM CZYNNOŚCI
  WYKONYWANYCH NA PODSTAWIE ZAWARTYCH UMÓW CYWILNOPRAWNYCH

⭐⭐⭐ TEST DWUSTOPNIOWY — STOSUJ W TEJ KOLEJNOŚCI:
  KROK 1 — czy podmiot jest ORGANEM WŁADZY PUBLICZNEJ lub urzędem go
    obsługującym? (status podmiotowy)
  KROK 2 — czy czynność mieści się w ZADANIACH NAŁOŻONYCH ODRĘBNYMI
    PRZEPISAMI, dla których organ powołano — czy raczej wykonywana jest
    NA PODSTAWIE UMOWY CYWILNOPRAWNEJ?
  → IMPERIUM (władztwo publiczne, decyzje administracyjne, opłaty
    publicznoprawne) → POZA VAT
  → DOMINIUM (umowa cywilnoprawna: najem, dzierżawa, sprzedaż mienia,
    usługi komunalne na podstawie umowy) → PODATNIK NA ZASADACH OGÓLNYCH
  ⭐ DECYDUJE CHARAKTER CZYNNOŚCI, NIE STATUS PODMIOTU — ten sam organ
    jest w części czynności podatnikiem, a w części nie

□ PRZYKŁAD REFERENCYJNY (opłaty za zajęcie pasa drogowego): zarządca
  drogi pobiera je w drodze DECYZJI ADMINISTRACYJNEJ w ramach zadania
  publicznego → poza VAT. Gdyby ten sam teren był udostępniony UMOWĄ
  NAJMU/DZIERŻAWY → czynność opodatkowana
  ⚠️ [potwierdzone w opracowaniach i interpretacjach; SYGNATURY wyroków
     zweryfikuj przez orzeczenia-sadowe-v2 przed powołaniem]

⛔ SPRZĘŻENIE Z PREWSPÓŁCZYNNIKIEM: czynności poza VAT na podstawie art.
  15 ust. 6 to właśnie „cele inne niż działalność gospodarcza" z art. 86
  ust. 2a. JEDNOSTKA, KTÓRA MA CZYNNOŚCI Z OBU STRON TEJ GRANICY,
  OBOWIĄZKOWO stosuje prewspółczynnik — patrz sekcja 4i (w tym prawo
  wyjścia poza rozporządzenie z art. 86 ust. 2h i proporcja odrębna dla
  każdej jednostki organizacyjnej JST z art. 90 ust. 10a–10b)

□ POWIĄZANIA: dr-08 (samorząd terytorialny) — ustrojowa strona zadań
  własnych i zleconych | sekcja 4i tego modułu — mechanizm odliczenia |
  centralizacja rozliczeń JST ⚠️ [odrębna regulacja, NIEOPRACOWANA w tym
  module]

✅ [VER: lexlege.pl oraz przepisy.gofin.pl — zgodne, dosłowne brzmienie
   art. 15 ust. 6, Dz.U.2025.0.775 t.j., 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP]
```

---

## 4n. ⭐⭐⭐ ODWROTNE OBCIĄŻENIE W OBROCIE KRAJOWYM — STAN PO REFORMIE
(art. 17 ustawy VAT + Dział XIII rozdział 1c, art. 145e–145k) — dodane
2026-08-12 (iteracja III audytu pokrycia VAT)

```
⛔⛔⛔ NAJWAŻNIEJSZE USTALENIE — SPROSTOWANIE POWSZECHNEGO BŁĘDU:
  KLASYCZNE krajowe odwrotne obciążenie dla „towarów i usług wrażliwych"
  — **art. 17 ust. 1 pkt 7 i 8 wraz z załącznikami nr 11 i 14** —
  ZOSTAŁO UCHYLONE i ZASTĄPIONE OBOWIĄZKOWYM MECHANIZMEM PODZIELONEJ
  PŁATNOŚCI (zał. 15 — patrz sekcja 4 „Split payment"). Wraz z nim
  zlikwidowano informację podsumowującą **VAT-27**.
  → ⚠️ PUŁAPKA PRAKTYCZNA: w obiegu (starsze wzory umów, szablony
    fakturowe, przestarzałe opracowania) nadal krążą faktury i klauzule
    z adnotacją „odwrotne obciążenie" dla towarów, które DZIŚ podlegają
    MPP. Otrzymanie takiej faktury NIE zwalnia nabywcy z zapłaty w
    mechanizmie podzielonej płatności — a wystawca naraża się na sankcję
    z art. 108a ust. 7
  → ⚠️ SPRAWY HISTORYCZNE: dla okresów sprzed uchylenia stosuje się stan
    prawny z daty czynności — NIE przenoś obecnej kwalifikacji wstecz
    (zasada z shared/TEMPORAL-LAW-CHECK.md)

⭐⭐ CO POZOSTAŁO W ART. 17 — TRANSAKCJE Z ELEMENTEM ZAGRANICZNYM:
  □ ust. 1 pkt 1 — import towarów
  □ ust. 1 pkt 4 — IMPORT USŁUG (usługobiorca podatnikiem)
  □ ust. 1 pkt 5 — NABYCIE TOWARÓW W KRAJU OD PODMIOTU ZAGRANICZNEGO,
    warunki ŁĄCZNIE:
    lit. a) DOKONUJĄCY DOSTAWY nie posiada na terytorium kraju siedziby
      ani stałego miejsca prowadzenia działalności, a przy dostawie
      towarów INNYCH niż gaz w systemie gazowym / energia elektryczna w
      systemie elektroenergetycznym / energia cieplna lub chłodnicza
      przez sieci dystrybucji ORAZ innej niż transfer bonu jednego
      przeznaczenia — dodatkowo NIE JEST zarejestrowany zgodnie z art. 96
      ust. 4
    lit. b) NABYWCĄ jest — przy nabyciu gazu/energii — podmiot
      zarejestrowany zgodnie z art. 96 ust. 4 (⚠️ pełne brzmienie lit. b
      dla pozostałych przypadków: podatnik z siedzibą lub stałym miejscem
      prowadzenia działalności w kraju albo osoba prawna niebędąca
      podatnikiem z siedzibą w kraju zarejestrowana jako podatnik VAT UE
      — ZWERYFIKUJ w ISAP przed powołaniem)
  □ ⭐ ust. 1a — jeżeli dostawca/usługodawca POSIADA stałe miejsce
    prowadzenia działalności w Polsce, to miejsce to NIE MOŻE brać
    udziału w tej konkretnej transakcji, aby odwrotne obciążenie
    zadziałało → ⭐ TO SPINA SIĘ Z SEKCJĄ o miejscu świadczenia usług
    (FE/stałe miejsce) — najczęstszy spór: czy polski oddział/magazyn
    kontrahenta „uczestniczył" w świadczeniu
  □ ust. 2 — w przypadkach z ust. 1 pkt 4 i 5 USŁUGODAWCA LUB DOKONUJĄCY
    DOSTAWY NIE ROZLICZA PODATKU NALEŻNEGO

⭐⭐⭐ CZASOWE ODWROTNE OBCIĄŻENIE — GAZ, ENERGIA, UPRAWNIENIA DO EMISJI
  (Dział XIII rozdział 1c, art. 145e–145k) — TO JEST ODRĘBNA INSTYTUCJA,
  NIE ART. 17:
  □ art. 145e ust. 1 — podatnikami są NABYWCY gazu w systemie gazowym /
    energii elektrycznej w systemie elektroenergetycznym LUB USŁUGOBIORCY
    usług przenoszenia uprawnień do emisji gazów cieplarnianych —
    GDY czynności dokonywane są BEZPOŚREDNIO LUB ZA POŚREDNICTWEM
    UPRAWNIONEGO PODMIOTU na: GIEŁDZIE TOWAROWEJ, RYNKU REGULOWANYM albo
    ZORGANIZOWANEJ PLATFORMIE OBROTU (OTF)
    → warunki po stronie nabywcy m.in.: rejestracja zgodnie z art. 96
      ust. 4; w części przypadków KONCESJA Prezesa URE albo RACHUNEK w
      rejestrze Unii (system handlu uprawnieniami do emisji)
  □ art. 145f — dostawca/usługodawca NIE ROZLICZA podatku należnego
  □ ⭐ art. 145g — FAKTURA dokumentująca te czynności: NIE ZAWIERA danych
    z art. 106e ust. 1 pkt 12–14 (stawka, wartość netto wg stawek, kwota
    podatku) i ZAWIERA wyrazy z art. 106e ust. 1 pkt 18, tj. **„odwrotne
    obciążenie"**
  □ ⭐ art. 145h — do usług przenoszenia uprawnień do emisji NIE STOSUJE
    SIĘ art. 108a ust. 1a (obowiązkowego MPP)
  □ ⛔ art. 145i ust. 1 — OBOWIĄZEK FORMALNY POD RYGOREM: dostawca/
    usługodawca ORAZ nabywca/usługobiorca SKŁADAJĄ naczelnikowi urzędu
    skarbowego **ZAWIADOMIENIE O ROZPOCZĘCIU** dokonywania tych
    czynności — **PRZED DOKONANIEM PIERWSZEJ CZYNNOŚCI**
    ⭐ TO PIERWSZA RZECZ DO SPRAWDZENIA W SPORZE: brak zawiadomienia
      podważa zastosowanie całego mechanizmu
  □ ⏳ CHARAKTER CZASOWY: mechanizm był przedłużany; wg komunikatu
    Ministerstwa Finansów obowiązywał **do 31 grudnia 2026 r.**
    ⚠️⚠️ [TERMIN KOŃCOWY WYMAGA SPRAWDZENIA PRZY KAŻDEJ SPRAWIE — to
       przepis epizodyczny, przedłużany kolejnymi nowelizacjami;
       web_search: „czasowe odwrotne obciążenie gaz energia uprawnienia
       do emisji przedłużone termin" + weryfikacja w ISAP]

□ POWIĄZANIA: sekcja 4 (split payment, zał. 15) | sekcja o WNT/imporcie
  usług | sekcja o miejscu świadczenia usług (FE) | sekcja 4o niżej
  (adnotacje na fakturze)

✅ [VER: art. 17 ust. 1 pkt 5, ust. 1a, ust. 2 — lexlege.pl i mddp.pl;
   uchylenie art. 17 ust. 1 pkt 7-8 i zał. 11/14 + likwidacja VAT-27 —
   poradnikprzedsiebiorcy.pl; art. 145e-145i — przepisy.gofin.pl;
   przedłużenie do 31.12.2026 — gov.pl/web/finanse (Rząd 1). 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP]
```

---

## 4o. ⭐⭐⭐ FAKTUROWANIE — SYSTEMATYKA (art. 106a–106q ustawy VAT)
— dodane 2026-08-12 (iteracja III); dotąd moduł opisywał WYŁĄCZNIE KSeF
i korekty w kontekście art. 29a, bez podstaw fakturowania jako takich

```
⭐⭐⭐ KIEDY FAKTURA JEST OBOWIĄZKOWA (art. 106b ust. 1) — podatnik jest
  obowiązany wystawić fakturę dokumentującą m.in.:
    pkt 1 — sprzedaż, a także dostawę towarów i świadczenie usług na
      rzecz INNEGO PODATNIKA (podatku, podatku od wartości dodanej lub
      o podobnym charakterze) albo OSOBY PRAWNEJ niebędącej podatnikiem
    pkt 4 — OTRZYMANIE CAŁOŚCI LUB CZĘŚCI ZAPŁATY przed dokonaniem
      czynności z pkt 1 (zaliczka)
    ⚠️ [pełne brzmienie pkt 2–3 — ZWERYFIKUJ W ISAP]
  □ ⭐ ust. 1a — NIE MA obowiązku wystawienia faktury zaliczkowej, jeżeli
    całość lub część zapłaty otrzymano W TYM SAMYM MIESIĄCU, w którym
    dokonano czynności, na poczet której zapłatę otrzymano
    (jedna faktura zamiast dwóch)

⭐⭐ FAKTURA NA ŻĄDANIE (art. 106b ust. 3) — TERMIN ZAWITY 3 MIESIĘCY:
  na żądanie nabywcy podatnik ma obowiązek wystawić fakturę
  dokumentującą czynności z ust. 1 pkt 1 (gdy obowiązek nie wynika z ust.
  1 — np. żądanie KONSUMENTA) oraz otrzymanie zapłaty przed ich
  wykonaniem — JEŻELI żądanie zgłoszono w terminie **3 MIESIĘCY, LICZĄC
  OD KOŃCA MIESIĄCA**, w którym dostarczono towar / wykonano usługę /
  otrzymano zapłatę
  → wyjątki przedmiotowe m.in.: czynności z art. 19a ust. 5 pkt 4 (np.
    najem), czynności z art. 106a pkt 3 i 4
  → ⭐ podatnicy ZWOLNIENI (art. 113 ust. 1 i 9 lub rozporządzenia z art.
    82 ust. 3) RÓWNIEŻ mają obowiązek wystawienia faktury na żądanie
    (ust. 3 pkt 2)
  → TERMIN WYSTAWIENIA takiej faktury (art. 106i ust. 6): jeżeli żądanie
    zgłoszono DO KOŃCA miesiąca — zasady ogólne z ust. 1 i 2; jeżeli PO
    upływie tego miesiąca — nie później niż **15. DNIA OD DNIA ZGŁOSZENIA
    ŻĄDANIA**

⛔⛔ PARAGON BEZ NIP — REGUŁA ZAMKNIĘTA (art. 106b ust. 5): przy sprzedaży
  zaewidencjonowanej na kasie i potwierdzonej paragonem fiskalnym fakturę
  NA RZECZ PODATNIKA wystawia się **WYŁĄCZNIE**, jeżeli PARAGON zawiera
  NIP nabywcy
  → ⭐ SPRZĘŻENIE SANKCYJNE: ujęcie w ewidencji faktury wystawionej
    wbrew tej regule → dodatkowe zobowiązanie **100%** kwoty podatku z
    art. 109a (sekcja 5). Sankcja obciąża NABYWCĘ; wystawcę — odrębnie
  → ⭐ FAKTURA UPROSZCZONA: paragon z NIP do **450 zł** (lub 100 euro)
    jest UZNAWANY ZA FAKTURĘ na podstawie art. 106e ust. 5 pkt 3 — wtedy
    NIE wystawia się do niego odrębnej faktury (art. 106h ust. 4)

⭐⭐ ELEMENTY FAKTURY (art. 106e ust. 1) — katalog obligatoryjny, m.in.:
  data wystawienia (pkt 1); kolejny numer w ramach serii jednoznacznie
  identyfikujący fakturę (pkt 2); nazwy i adresy stron (pkt 3); NIP
  sprzedawcy (pkt 4) i nabywcy (pkt 5); data dokonania/zakończenia
  dostawy lub wykonania usługi albo otrzymania zapłaty, o ile określona i
  różna od daty wystawienia (pkt 6); nazwa towaru/usługi, miara, ilość,
  cena jednostkowa netto, opusty (pkt 7–10); wartość sprzedaży netto
  (pkt 11); stawka, wartość netto wg stawek, kwota podatku, kwota
  należności ogółem (pkt 12–15)
  ⭐⭐ ADNOTACJE SZCZEGÓLNE — SPRAWDZAJ ZAWSZE:
    pkt 18 — **„odwrotne obciążenie"** (gdy do rozliczenia obowiązany
      jest nabywca)
    pkt 18a — **„mechanizm podzielonej płatności"** — gdy kwota
      NALEŻNOŚCI OGÓŁEM przekracza **15 000 zł** (lub równowartość w
      walucie obcej) i faktura obejmuje towary/usługi z załącznika nr 15
  □ ust. 3 — PROCEDURA MARŻY (art. 120 ust. 4 i 5): faktura zawiera
    wyłącznie dane z ust. 1 pkt 1–8 i 15–17 oraz wyrazy „procedura marży
    — towary używane" / „— dzieła sztuki" / „— przedmioty kolekcjonerskie
    i antyki"
  □ ust. 5 pkt 3 — faktura UPROSZCZONA (paragon z NIP, patrz wyżej)

⭐⭐⭐ TERMINY WYSTAWIENIA (art. 106i):
  □ ust. 1 — ZASADA: nie później niż **15. DNIA MIESIĄCA NASTĘPUJĄCEGO**
    po miesiącu dokonania dostawy / wykonania usługi
  □ ust. 2 — ZALICZKI: nie później niż 15. dnia miesiąca następującego po
    miesiącu otrzymania zapłaty
  □ ust. 3 — TERMINY SZCZEGÓLNE, m.in.: **30. dnia** od wykonania usług
    budowlanych/budowlano-montażowych (art. 19a ust. 5 pkt 3 lit. a);
    **60. dnia** od wydania towarów przy dostawie książek drukowanych
    (lit. b), a przy umowie przewidującej rozliczenie zwrotów wydawnictw
    — **120. dnia** od pierwszego dnia wydania towarów
    ⚠️ [pozostałe pozycje ust. 3–5 — ZWERYFIKUJ W ISAP]
  □ ⛔ ust. 7 — GRANICA „W PRZÓD": faktury NIE MOGĄ być wystawione
    WCZEŚNIEJ NIŻ **30. DNIA PRZED** dokonaniem dostawy/wykonaniem usługi
    albo otrzymaniem zapłaty; ust. 8 — ograniczenie z ust. 7 pkt 1 nie
    dotyczy m.in. dostaw i usług z art. 19a ust. 3, 4 (świadczenia
    ciągłe/okresowe)
    → ⭐ „PRZEDWCZESNA FAKTURA" to samodzielne pole sporu — powiązać z
      art. 108 (sekcja 4g) oraz z momentem powstania obowiązku
      podatkowego (sekcja 4a)

⭐⭐ KOREKTA DOKUMENTU — DWA RÓŻNE INSTRUMENTY, NIE MYLIĆ:
  □ **FAKTURA KORYGUJĄCA (art. 106j)** — wystawia **SPRZEDAWCA**, gdy po
    wystawieniu faktury: zmieniła się podstawa opodatkowania lub kwota
    podatku (ust. 1 pkt 1), dokonano zwrotu zapłaty z art. 106b ust. 1
    pkt 4 (pkt 4), stwierdzono POMYŁKĘ W JAKIEJKOLWIEK POZYCJI faktury
    (pkt 5)
    → ⭐ ELEMENT KSeF (ust. 2 pkt 2a): faktura korygująca zawiera NUMER
      IDENTYFIKUJĄCY W KSeF fakturę korygowaną — z wyjątkiem korekt do
      faktur, którym numeru KSeF nie nadano (powiązać z alertem KSeF na
      początku modułu i wymogiem schematu FA(3))
    → ust. 3 — KOREKTA ZBIORCZA (opust/obniżka do WSZYSTKICH dostaw dla
      jednego odbiorcy w okresie): musi wskazywać OKRES, może pominąć
      dane z art. 106e ust. 1 pkt 5 i 6 oraz nazwę towaru/usługi
    → SKUTKI ROZLICZENIOWE korekt in minus/in plus: sekcja 4b (art. 29a)
  □ **NOTA KORYGUJĄCA (art. 106k)** — wystawia **NABYWCA**, gdy otrzymał
    fakturę z pomyłkami — ⛔ Z WYŁĄCZENIEM pomyłek w danych z art. 106e
    ust. 1 **pkt 8–15** (miara, ilość, cena, opusty, wartość netto,
    stawka, kwota podatku, należność ogółem)
    → ⭐ WYMAGA AKCEPTACJI WYSTAWCY faktury (ust. 2)
    → zawiera m.in. dane stron, dane faktury korygowanej z art. 106e ust.
      1 pkt 1–6 oraz wskazanie treści korygowanej i treści prawidłowej
    → ⭐ TEST PRAKTYCZNY: pomyłka w KWOCIE/STAWCE → tylko faktura
      korygująca sprzedawcy; pomyłka w NAZWIE/ADRESIE/NIP/dacie → nota

□ POZOSTAŁE JEDNOSTKI ROZDZIAŁU 1 DZIAŁU XI ⚠️ [NIEOPRACOWANE — art. 106a
  (zakres stosowania), 106c (faktury organów egzekucyjnych), 106d
  (samofakturowanie), 106f (faktura zaliczkowa — elementy), 106g
  (egzemplarze), 106h (faktura do paragonu), 106l (duplikaty), 106m–106n
  (autentyczność, integralność, faktury elektroniczne), 106na–106q (KSeF
  — częściowo w alertach na początku modułu). Zweryfikuj w ISAP przed
  powołaniem]

✅ [VER: art. 106b ust. 1, 1a, 3, 5; art. 106e ust. 1 pkt 1-15, 18, 18a,
   ust. 3, ust. 5 pkt 3; art. 106i ust. 1-3, 6-8; art. 106j ust. 1-3;
   art. 106k ust. 1-3 — zgodnie w 4 źródłach (przepisy.gofin.pl,
   ksiegowosc.infor.pl, sip.lex.pl, poradnikprzedsiebiorcy.pl),
   Dz.U.2025.775 t.j., 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP — część źródeł to wersje archiwalne
   artykułów; przy powoływaniu w piśmie sprawdź brzmienie NA DATĘ
   CZYNNOŚCI, zwłaszcza dla przepisów zmienianych pakietem KSeF]
```

---

## 4p. ⭐⭐ PROCEDURY SZCZEGÓLNE — TURYSTYKA (art. 119) I ROLNIK
RYCZAŁTOWY (art. 115–118) — dodane 2026-08-12 (iteracja III)

```
⭐⭐⭐ USŁUGI TURYSTYKI — PROCEDURA MARŻY (art. 119):
  □ ust. 1 — PODSTAWĄ OPODATKOWANIA jest KWOTA MARŻY pomniejszona o kwotę
    należnego podatku (z zastrzeżeniem ust. 5)
  □ ust. 2 — MARŻA = różnica między kwotą, którą ma zapłacić NABYWCA
    usługi, a FAKTYCZNYMI KOSZTAMI poniesionymi przez podatnika z tytułu
    nabycia towarów i usług OD INNYCH PODATNIKÓW **DLA BEZPOŚREDNIEJ
    KORZYŚCI TURYSTY**
    ⭐ „dla bezpośredniej korzyści turysty" to POJĘCIE GRANICZNE i główne
      pole sporu — koszty ogólne biura (najem lokalu, marketing,
      księgowość) NIE wchodzą do rachunku marży
  □ ⛔ ust. 4 — CENA ZA PROCEDURĘ: BRAK PRAWA DO ODLICZENIA podatku
    naliczonego od towarów i usług nabytych dla bezpośredniej korzyści
    turysty. To nie jest opcja — to element konstrukcyjny procedury
  □ ⭐ ust. 5 — ŚWIADCZENIA WŁASNE: gdy przy świadczeniu usługi turystyki
    podatnik wykonuje CZĘŚĆ świadczeń WE WŁASNYM ZAKRESIE, procedura
    marży stosuje się TYLKO do usług nabytych od innych podatników;
    świadczenia własne rozlicza się NA ZASADACH OGÓLNYCH → w praktyce
    JEDNA usługa turystyczna bywa rozliczana DWOMA reżimami równolegle
    ⚠️ [ust. 3, 3a, 6-10 (warunki podmiotowe, ewidencja, stawka 0% dla
       usług poza UE) — NIEOPRACOWANE, zweryfikuj w ISAP]
  □ POWIĄZANIA: art. 28n — miejsce świadczenia usług turystyki w
    procedurze marży (sekcja o miejscu świadczenia usług); art. 106e ust.
    3 — oznaczenia na fakturze marżowej (sekcja 4o); art. 120 — marża
    towary używane (odrębna procedura, sekcja wyżej); art. 88 ust. 1 pkt
    4 — wyłączenie odliczenia od noclegów i gastronomii (sekcja 4h)

⭐⭐ ROLNIK RYCZAŁTOWY — ZRYCZAŁTOWANY ZWROT (art. 115–118):
  □ art. 115 ust. 1 — rolnikowi ryczałtowemu dokonującemu dostawy
    produktów rolnych DLA PODATNIKA, KTÓRY ROZLICZA PODATEK, przysługuje
    ZRYCZAŁTOWANY ZWROT podatku z tytułu nabywania niektórych środków
    produkcji dla rolnictwa. ⭐ KWOTĘ ZWROTU WYPŁACA **NABYWCA** produktów
    rolnych (nie urząd skarbowy)
  □ ⚠️⚠️ STAWKA — DWA RÓŻNE POZIOMY, OBOWIĄZKOWA WERYFIKACJA:
    art. 115 ust. 2 stanowi o **6,5%** kwoty należnej z tytułu dostawy
    produktów rolnych pomniejszonej o kwotę zryczałtowanego zwrotu, ALE
    przepis EPIZODYCZNY (art. 146ea pkt 3 i przepisy pokrewne) podnosił
    ją do **7%**
    ⛔ NIE PODAWAJ STAWKI Z TEGO MODUŁU BEZ SPRAWDZENIA — trzeba ustalić,
      KTÓRY przepis epizodyczny obowiązuje NA DATĘ CZYNNOŚCI i czy nie
      wygasł. web_search: „zryczałtowany zwrot podatku rolnik ryczałtowy
      stawka 7% art. 146 ustawa VAT [rok]" + weryfikacja w ISAP
  □ art. 116 ust. 1 — nabywca będący **VAT CZYNNYM** wystawia FAKTURĘ
    **VAT RR** w DWÓCH EGZEMPLARZACH; ORYGINAŁ przekazuje DOSTAWCY
    (⭐ odwrócenie zwykłego kierunku fakturowania — fakturę wystawia
    KUPUJĄCY)
  □ art. 116 ust. 2–3 — faktura zawiera m.in. OŚWIADCZENIE dostawcy o
    treści: „Oświadczam, że jestem rolnikiem ryczałtowym zwolnionym od
    podatku od towarów i usług na podstawie art. 43 ust. 1 pkt 3 ustawy o
    podatku od towarów i usług"
  □ ⭐ art. 116 ust. 3a — faktura VAT RR MOŻE, ZA ZGODĄ DOSTAWCY, być
    wystawiana, podpisywana i przesyłana W FORMIE ELEKTRONICZNEJ
  □ art. 117 — obowiązki rolnika ryczałtowego ⚠️ [treść NIEZWERYFIKOWANA
    — sprawdź w ISAP]
  □ art. 118 — przepisy art. 115, art. 116 ust. 1–3a i 5–10 oraz art. 117
    stosuje się ODPOWIEDNIO do wykonywania przez rolnika ryczałtowego
    USŁUG ROLNICZYCH na rzecz podatników rozliczających podatek
  □ POWIĄZANIE: zwolnienie rolnika ryczałtowego wynika z art. 43 ust. 1
    pkt 3 (sekcja 4c); rezygnacja ze zwolnienia i powrót — art. 43 ust.
    3–5 ⚠️ [NIEOPRACOWANE]

✅ [VER: art. 119 ust. 1-2 oraz art. 115 ust. 1-2, art. 116 ust. 1-3a,
   art. 118 — zgodnie w 3 źródłach (przepisy.gofin.pl ×2,
   ksiegowosc.infor.pl); charakter procedury z art. 119 ust. 4
   potwierdzony komentarzem INFORLEX. 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP — OBOWIĄZKOWA dla stawki z art. 115 ust. 2
   i przepisów epizodycznych z art. 146x]
```

---

## 5. ⭐⭐⭐ EWIDENCJA VAT (JPK_V7), KOREKTA EWIDENCJI I SANKCJE
EWIDENCYJNE — art. 109, 109a, 110 ustawy VAT

> **NAPRAWA STRUKTURALNA (2026-08-12):** moduł miał LUKĘ W NUMERACJI —
> po sekcji 4f następowała od razu sekcja 6, a sekcja 4d (ulga na złe
> długi) zawierała ODESŁANIE do nieistniejącej „sekcji 5" dotyczącej
> JPK_V7. Sekcja została utworzona i wypełniona treścią; odesłanie w 4d
> poprawiono.

```
⭐⭐ EWIDENCJA UPROSZCZONA — PODATNICY ZWOLNIENI (art. 109 ust. 1):
  podatnicy korzystający ze zwolnienia z art. 113 ust. 1 i 9 prowadzą
  EWIDENCJĘ SPRZEDAŻY ZA DANY DZIEŃ — nie później niż PRZED DOKONANIEM
  SPRZEDAŻY W DNIU NASTĘPNYM
  ⛔ ust. 2 — SANKCJA ZA BRAK LUB NIERZETELNOŚĆ: gdy nie da się ustalić
    wartości sprzedaży z dokumentacji, organ OSZACUJE wartość sprzedaży
    opodatkowanej; ⭐ JEŻELI NIE MOŻNA OKREŚLIĆ PRZEDMIOTU OPODATKOWANIA
    — podatek ustala się przy zastosowaniu stawki **22%** (przepis
    posługuje się stawką historyczną — NIE jest to omyłka modułu)
  → analogiczny mechanizm szacowania: art. 110 (podmioty niezobowiązane
    do ewidencji z ust. 3, które dokonały sprzedaży opodatkowanej i nie
    zapłaciły podatku)

⭐⭐⭐ EWIDENCJA PEŁNA (art. 109 ust. 3) — podstawa JPK_V7. Obowiązek
  obejmuje wszystkich podatników POZA wykonującymi wyłącznie czynności
  zwolnione z art. 43 ust. 1 lub z rozporządzeń wydanych na podstawie
  art. 82 ust. 3 oraz korzystającymi ze zwolnienia z art. 113 ust. 1 i 9
  albo art. 113a ust. 1. Ewidencja ma zawierać dane pozwalające na
  PRAWIDŁOWE ROZLICZENIE PODATKU I SPORZĄDZENIE INFORMACJI
  PODSUMOWUJĄCEJ, w szczególności:
    1) rodzaj sprzedaży, podstawę opodatkowania, podatek należny (w tym
       korekty) z podziałem na stawki
    2) podatek naliczony obniżający podatek należny (w tym korekty)
    3) kontrahentów
    4) dowody sprzedaży i zakupów
  □ ust. 8a — ewidencja prowadzona OBLIGATORYJNIE W POSTACI
    ELEKTRONICZNEJ przy użyciu programów komputerowych
  □ ust. 3a — usługi z miejscem świadczenia poza krajem: w ewidencji
    podaje się NAZWĘ usługi i wartość bez podatku od wartości dodanej,
    z uwzględnieniem momentu powstania obowiązku podatkowego właściwego
    dla takich usług świadczonych w kraju (dla art. 28b — odpowiednio
    art. 19a ust. 1–3 i 8)
  □ ust. 3d — faktury do paragonów (art. 106h ust. 1) ujmuje się w
    ewidencji w okresie ICH WYSTAWIENIA i NIE ZWIĘKSZAJĄ one wartości
    sprzedaży ani podatku należnego za ten okres

⭐⭐ TERMINY PRZESYŁANIA (art. 109 ust. 3b–3c):
  □ ROZLICZENIE MIESIĘCZNE (JPK_V7M) — ewidencja ŁĄCZNIE z deklaracją,
    w terminie do złożenia deklaracji
  □ ROZLICZENIE KWARTALNE (JPK_V7K) — ⭐ CZĘŚĆ EWIDENCYJNA I TAK CO
    MIESIĄC: za pierwszy i drugi miesiąc kwartału do **25. DNIA**
    miesiąca następującego po każdym z nich; za ostatni miesiąc kwartału
    — łącznie z deklaracją

⭐⭐⭐ KOREKTA EWIDENCJI I KARA 500 ZŁ — ŚCIEŻKA KROK PO KROKU
  (art. 109 ust. 3e–3l):
  1) ust. 3e — podatnik ma **14 DNI** na przesłanie korekty ewidencji od
     dnia STWIERDZENIA błędów/niezgodności ze stanem faktycznym LUB od
     dnia ZMIANY danych zawartych w przesłanej ewidencji
  2) ust. 3f — naczelnik US, stwierdziwszy błędy UNIEMOŻLIWIAJĄCE
     weryfikację prawidłowości transakcji, WZYWA do ich skorygowania,
     WSKAZUJĄC TE BŁĘDY ⭐ wezwanie MUSI konkretyzować błędy — wezwanie
     ogólnikowe jest wadliwe i to jest zarzut do wykorzystania
  3) ust. 3g — podatnik ma **14 DNI** od doręczenia wezwania na:
     przesłanie ewidencji SKORYGOWANEJ w zakresie wskazanych błędów ALBO
     złożenie WYJAŚNIEŃ wykazujących, że ewidencja błędów nie zawiera
  4) ⛔ ust. 3h — dopiero przy braku reakcji, reakcji PO TERMINIE albo
     niewykazaniu w wyjaśnieniach braku błędów — naczelnik US **MOŻE**
     (uznaniowo, w drodze DECYZJI) nałożyć karę pieniężną **500 ZŁ ZA
     KAŻDY BŁĄD** wskazany w wezwaniu
     ⭐ TRZY PUNKTY OBRONY: (a) fakultatywność („może") — żądaj
     uzasadnienia uznania; (b) liczba błędów jest liczona wg wezwania —
     kwestionuj zawyżanie; (c) wyjaśnienia złożone W TERMINIE blokują
     karę, nawet jeśli organ ich nie podziela — o ile wykazują brak błędu
  5) ⭐⭐ ust. 3i — KARY NIE STOSUJE SIĘ do podatnika będącego OSOBĄ
     FIZYCZNĄ prowadzącą działalność gospodarczą, który za TEN SAM CZYN
     ponosi odpowiedzialność za wykroczenie skarbowe lub przestępstwo
     skarbowe (wyłączenie kumulacji)
  6) ust. 3k — karę uiszcza się BEZ WEZWANIA w terminie **14 DNI** od
     doręczenia decyzji; ust. 3l — w pozostałym zakresie stosuje się
     odpowiednio dział IV Ordynacji podatkowej; ust. 3j — wpływy stanowią
     dochód budżetu państwa

⛔⛔ ART. 109a — ODRĘBNA SANKCJA 100% (faktura do paragonu bez NIP):
  gdy podatnik prowadzący ewidencję z art. 109 ust. 3 UJMIE W EWIDENCJI
  wystawioną DLA NIEGO fakturę dotyczącą sprzedaży potwierdzonej
  PARAGONEM, KTÓRY NIE ZAWIERA jego NIP — organ USTALA dodatkowe
  zobowiązanie podatkowe w wysokości **100% kwoty podatku wykazanego na
  tej fakturze**
  → wyłączenie: nie ustala się wobec osób fizycznych, które za ten sam
    czyn ponoszą odpowiedzialność za wykroczenie lub przestępstwo skarbowe
  → ⭐ SPROSTOWANIE WEWNĘTRZNE: wcześniejsze wersje modułu odsyłały do
    „aktualnego sankcyjnego art. 109a" bez podania treści — powyżej
    treść ustalona; TO INNA SANKCJA NIŻ art. 112b–112c (sekcja 4e) i
    inna niż kara 500 zł z art. 109 ust. 3h

□ EWIDENCJE SZCZEGÓLNE (art. 109) — mapa, gdy sprawa ich dotyczy:
  ust. 9–10a — towary powierzone/przemieszczane do usług (art. 12, 13)
  ust. 11 — podmioty z art. 10 ust. 1 pkt 2, próg **50 000 zł** WNT
  ust. 11b–11e — magazyn call-off stock (art. 54a rozporządzenia 282/2011)
  ust. 11f — system **TAX FREE** (ewidencja elektroniczna, art. 127 ust. 1)
  ust. 11g–11i — ⭐ GRUPA VAT: ewidencja czynności wewnątrzgrupowych z
    art. 8c ust. 1, przesyłana MIESIĘCZNIE do **25. dnia** miesiąca
    następnego (patrz sekcja o grupie VAT wyżej)
  ust. 11ia–11ic — system kaucyjny (opakowania na napoje), przechowywanie
    **5 lat**
  art. 109b — interfejsy elektroniczne (platformy): ewidencja wg art. 54c
    rozporządzenia 282/2011, udostępnienie w **14 dni** od żądania,
    przechowywanie **10 LAT**

✅ [VER: lexlege.pl — pełny tekst art. 109, 109a, 109b i 110 ustawy o VAT,
   Dz.U.2025.0.775 t.j., stan prawny na 12.08.2026; pobrane 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP]
✅ [LUKA ZAMKNIĘTA 2026-08-12 (iteracja II): deklaracje (art. 99) i
   informacje podsumowujące (art. 100) opracowano w sekcji **5a** niżej.
   Niniejsza sekcja opisuje EWIDENCJĘ, sekcja 5a — DEKLARACJE.
   ⚠️ POZOSTAJE nieopracowane: art. 99 ust. 11c (tryb przesyłania),
   art. 101–102 (korekty informacji podsumowujących)]
```

---

## 5a. ⭐⭐⭐ DEKLARACJE I INFORMACJE PODSUMOWUJĄCE
(art. 99 i art. 100 ustawy VAT) — dodane 2026-08-12 (iteracja II);
DOMYKA lukę wprost oznaczoną w sekcji 5 przy jej tworzeniu tego samego
dnia

```
⭐⭐⭐ DEKLARACJE — ZASADA OGÓLNA (art. 99 ust. 1): podatnicy z art. 15
  składają w urzędzie skarbowym deklaracje podatkowe ZA OKRESY MIESIĘCZNE
  w terminie do **25. DNIA** miesiąca następującego po każdym kolejnym
  miesiącu — z zastrzeżeniem ust. 2–10 oraz art. 130c (procedura unijna
  OSS), art. 133 (procedura nieunijna) i art. 138g ust. 2 (pośrednik
  w IOSS)
  ⭐ DEKLARACJA I EWIDENCJA IDĄ RAZEM: od czasu JPK_V7 deklaracja jest
    częścią tego samego pliku co ewidencja z art. 109 ust. 3 — patrz
    sekcja 5 wyżej (art. 109 ust. 3b–3c)

⭐⭐ ROZLICZENIE KWARTALNE (art. 99 ust. 2–3):
  □ MALI PODATNICY, KTÓRZY WYBRALI METODĘ KASOWĄ — deklaracje ZA OKRESY
    KWARTALNE do **25. dnia** miesiąca następującego po kwartale
  □ powrót do rozliczeń miesięcznych — NIE WCZEŚNIEJ niż po upływie
    **4 KWARTAŁÓW** rozliczanych kwartalnie, po uprzednim pisemnym
    zawiadomieniu naczelnika US
  ⚠️ [dokładne warunki wyboru i utraty prawa do kwartału — ust. 3–3c —
     ZWERYFIKUJ W ISAP; nie odtwarzaj ich z pamięci]

⛔⛔ UTRATA PRAWA DO KWARTAŁU PRZEZ ZAŁĄCZNIK 15 (art. 99 ust. 3a i n.):
  gdy łączna wartość dostaw towarów z **załącznika nr 15** (bez podatku)
  przekroczy próg z ust. 3a, podatnik rozliczający się kwartalnie MUSI
  przejść na deklaracje MIESIĘCZNE — począwszy od rozliczenia za pierwszy
  miesiąc kwartału:
  → W KTÓRYM przekroczono kwotę — jeżeli przekroczenie nastąpiło w
    PIERWSZYM lub DRUGIM miesiącu kwartału (przy przekroczeniu w drugim
    miesiącu deklarację za pierwszy miesiąc składa się do **25. dnia**
    miesiąca następującego po drugim miesiącu kwartału)
  → NASTĘPUJĄCEGO PO kwartale, w którym przekroczono kwotę — jeżeli
    przekroczenie nastąpiło w TRZECIM miesiącu kwartału
  ⚠️ [WYSOKOŚĆ PROGU z ust. 3a — NIE PODANA w tym module, ZWERYFIKUJ W
     ISAP przed użyciem. To ten sam załącznik 15 co przy MPP — sekcja 4]

□ PRZYPADKI SZCZEGÓLNE (art. 99):
  ust. 7a — ZAWIESZENIE DZIAŁALNOŚCI: brak obowiązku składania deklaracji
    za okresy, których zawieszenie dotyczy; ⭐ WYŁĄCZENIA (deklarację I
    TAK trzeba złożyć), m.in.: okres rozliczeniowy niepokryty
    zawieszeniem w całości; okresy, za które podatnik ma rozliczyć
    czynności opodatkowane; okresy, za które ma dokonać KOREKTY PODATKU
    NALICZONEGO (np. korekta roczna z art. 91 — sekcja 4i)
  ust. 8 — podatnicy inni niż VAT czynni oraz osoby prawne niebędące
    podatnikami z art. 15, u których wartość WNT przekroczyła kwotę z
    art. 10 ust. 1 pkt 2 lub którzy skorzystali z opcji z art. 10 ust. 6
    — deklaracje w zakresie nabyć, MIESIĘCZNIE, do **25. dnia**
  ust. 8a — przedstawiciel podatkowy składa deklaracje we własnym imieniu
    na rzecz podatnika, MIESIĘCZNIE, do **25. dnia**
  ust. 9 — podatnicy z art. 17 ust. 1 pkt 4, 5 (i dalszych) niemający
    obowiązku z ust. 1–3 lub 8 — deklaracja do **25. dnia** miesiąca
    następującego po miesiącu POWSTANIA OBOWIĄZKU PODATKOWEGO
  ⭐ DEKLARACJA „ZEROWA": brak czynności w okresie NIE ZWALNIA z
    obowiązku złożenia deklaracji (poza trybem zawieszenia z ust. 7a)

⭐⭐ INFORMACJE PODSUMOWUJĄCE VAT-UE (art. 100):
  □ składane ZA OKRESY MIESIĘCZNE, za pomocą ŚRODKÓW KOMUNIKACJI
    ELEKTRONICZNEJ, w terminie do **25. DNIA** miesiąca następującego po
    miesiącu, w którym powstał obowiązek podatkowy z tytułu transakcji
    objętych obowiązkiem informacyjnym
    ⚠️⚠️ [OSTRZEŻENIE ŹRÓDŁOWE: w obiegu funkcjonują opracowania
       podające termin **15. dnia** (papierowo) obok 25. dnia
       (elektronicznie) — to stan HISTORYCZNY sprzed przejścia na
       wyłącznie elektroniczną formę. TERMIN I PODSTAWĘ (ust. 3 / ust. 7)
       ZWERYFIKUJ W ISAP PRZED KAŻDYM UŻYCIEM — rozbieżność źródeł
       wtórnych jest tu udokumentowana i realna]
  □ ⚠️ [KWARTALNE informacje podsumowujące i próg 250 000 zł — pojawiają
     się w źródłach wtórnych jako stan częściowo historyczny; NIE
     WPISANE do modułu jako obowiązujące. Sprawdź art. 100 ust. 4 w ISAP]
  □ ⭐ SAM STATUS zarejestrowanego podatnika VAT-UE NIE RODZI obowiązku
    składania „zerowych" informacji podsumowujących — obowiązek powstaje
    dopiero przy WYSTĄPIENIU transakcji objętej art. 100 ust. 1
    (odwrotnie niż przy deklaracji z art. 99 ust. 1)
  □ art. 101–102 — korekty informacji podsumowujących i delegacje
    ⚠️ [NIEOPRACOWANE — zweryfikuj w ISAP]

□ SANKCJE ZA UCHYBIENIA DEKLARACYJNE: niezłożenie deklaracji lub
  informacji podsumowującej w terminie to czyn z Kodeksu karnego
  skarbowego ⚠️ [KWALIFIKACJA KARNOSKARBOWA — ustal przez moduł dr-03;
  NIE przenoś numerów artykułów KKS z tego modułu]; odrębnie: kara
  pieniężna 500 zł za błąd w EWIDENCJI (art. 109 ust. 3h — sekcja 5)

✅ [VER: art. 99 ust. 1, 2, 7a, 8, 8a, 9 oraz mechanizm utraty kwartału
   przez zał. 15 — zgodnie w 4 źródłach (lexlege.pl, arslege.pl,
   przepisy.gofin.pl, prawnik.cc), Dz.U.2025.0.775 t.j., 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP — OBOWIĄZKOWA dla: progu z art. 99 ust. 3a,
   terminu i podstawy z art. 100 ust. 3/7, art. 100 ust. 4, art. 101–102]
```

---

## 6. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Dobra wiara przy odliczeniu | Wydruk z białej listy z daty transakcji + KRS kontrahenta | podatki.gov.pl | wysoka | stary wydruk | data weryfikacji musi być ≤ data transakcji |
| Rzeczywistość transakcji | Faktury, WZ, CMR, potwierdzenia odbioru | strony | wysoka | brak dokumentów transportu | uzupełnij archiwum |
| MPP zastosowany | Potwierdzenia przelewów split | bank | wysoka | — | wyciąg bankowy z kodu MPP |
| KSeF — wystawienie faktury | Numer KSeF + status UPO | KSeF | wysoka (od 01.02/04.2026) | brak wdrożenia | plan wdrożenia + certyfikat |
| WDT — stawka 0% | Dokumenty przewozowe (CMR), specyfikacja, potwierdzenie odbioru, numer VAT-UE nabywcy z dnia dostawy | strony / VIES | wysoka | brak potwierdzenia odbioru | oświadczenie nabywcy + korespondencja spedytora |
| Pierwsze zasiedlenie (art. 43 ust. 1 pkt 10) | Pozwolenie na użytkowanie, pierwsza umowa najmu/sprzedaży, ewidencja ulepszeń | inwestor / KW | wysoka | brak dat ulepszeń | zestawienie nakładów z datami i wartością początkową |
| Ulga na złe długi (art. 89a) | Faktura, wezwanie do zapłaty, status VAT dłużnika, wyciąg braku zapłaty | wierzyciel / biała lista | wysoka | dłużnik w restrukturyzacji | sprawdź KRZ w dacie korekty |
| Pusta faktura — brak wprowadzenia do obrotu (art. 108) | Dowód wycofania/zniszczenia egzemplarza, korekta „do zera", potwierdzenie braku odliczenia u odbiorcy | wystawca / odbiorca | średnia–wysoka | faktura już odliczona | wystąp do odbiorcy o korektę + udokumentuj datę |
| Należyta staranność nad pracownikiem (C-442/22) | Zakres czynności, procedury autoryzacji faktur, logi systemu, ślad kontroli wewnętrznej | pracodawca | średnia | brak procedur | rekonstrukcja z regulaminów i korespondencji |
| Prewspółczynnik bardziej reprezentatywny (art. 86 ust. 2h) | Dane ilościowe (m³, m², godziny), kalkulacja porównawcza obu metod | podatnik | średnia | brak ewidencji ilościowej | wdroż ewidencję przed kolejnym rokiem |
| Przedłużenie zwrotu — wadliwość postanowienia (art. 87 ust. 2) | Treść postanowienia, brak konkretyzacji wątpliwości, chronologia czynności organu | akta sprawy | wysoka | postanowienie ogólnikowe | zażalenie — pilnuj terminu 17 dni przy doręczeniu zastępczym |

---

## 7. STRATEGIA / QUALITY GATE / OUTPUT

**Strategia:** Weryfikuj kontrahentów na białej liście ZANIM dokonasz płatności. Przy odmowie odliczenia — udowodnij dobrą wiarę i należytą staranność. Przy KSeF — sprawdź termin obowiązku dla swojej firmy.

**Quality gate:** Stawka ustalona PROCEDURĄ z sekcji 3 (kod CN/PKWiU w ISZTAR4 na datę czynności → zał. 3/10 i rozp. Dz.U. 2023 poz. 2670 → przepisy epizodyczne art. 146x → EUREKA), ze śladem weryfikacji (źródło + data dostępu + data stanu prawnego)? Nigdy z pamięci ani z tabeli w module? Zał. 15 sprawdzony przy MPP? Biała lista weryfikowana w dacie transakcji? KSeF — termin obowiązku ustalony? ⭐ DODANE 2026-08-12: Czy sprawdzono przesłanki NEGATYWNE z art. 88 (nie tylko art. 86 ust. 1)? Czy przy zwrocie użyto terminu 40 dni (NIE 60)? Czy przy sprzedaży środka trwałego policzono korektę wieloletnią z art. 91 ust. 4-6? Czy przy pustej fakturze rozdzielono stronę wystawcy (art. 108) od strony nabywcy (art. 88 ust. 3a pkt 4)? Czy nałożono nowelizacje po t.j. (poz. 894, 896, 1203, 1811, 2026/507, 2026/846)?

**Output:** Kwalifikacja VAT → stawka → odliczenie/zwrot → MPP → KSeF (termin) → spór (termin 14 dni).

**Powiązania:** `mod-OP-ordynacja-podatkowa` | `mod-KAS-kontrola-celno-skarbowa` | `pisma-procesowe-v3` | `mod-CIT-podatek-dochodowy-prawne` (rozróżnienie grupa VAT vs podatkowa grupa kapitałowa PGK — odrębne instytucje, odrębne warunki)

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
