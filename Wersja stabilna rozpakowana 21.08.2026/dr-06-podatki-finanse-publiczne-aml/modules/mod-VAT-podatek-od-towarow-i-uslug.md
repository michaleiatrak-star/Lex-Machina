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

> ⚠️ TEN moduł jest CZĘŚCIĄ RODZINY plików VAT, PODZIELONEJ
> 2026-08-12 (NOTA-4, audyt-systemu-v4/CHECKLIST-DEDUP.md — moduł
> źródłowy miał 3652 linie, ~9x próg 400 linii). RODZINA sześciu
> plików: mod-VAT-podatek-od-towarow-i-uslug.md (rdzeń: alerty,
> KSeF, stawki, podstawowe mechanizmy), mod-VAT-miejsce-swiadczenia-
> zwolnienia.md, mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci.md,
> mod-VAT-sankcje-bony-odliczenia.md, mod-VAT-transakcje-
> fakturowanie.md, mod-VAT-ewidencja-deklaracje.md.
>
> **⛔ KRYTYCZNE, GLOBALNE ostrzeżenie (dotyczy CAŁEJ rodziny
> plików):** audyt z 2026-08-12 wykrył i naprawił błąd merytoryczny
> — podstawowy termin zwrotu różnicy podatku BYŁ błędnie podawany
> jako 60 dni, PRAWIDŁOWO to **40 DNI** (art. 87 ust. 2 zd. 1) —
> pisma/wyliczenia odsetkowe oparte na wcześniejszej wersji WYMAGAJĄ
> przeliczenia.

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

---

## 5. GRUPA SZYBKA — DOMKNIĘCIE LUK PERYFERYJNYCH (ETAP 2a,
2026-08-13, na żądanie użytkownika)

Uzupełnienie art. 2 (słownik), art. 3 (właściwość organów), art. 28p
(zawiadomienie o miejscu opodatkowania), art. 44 (zwolnienia WNT),
art. 84–85 (szczególne metody ustalania podatku należnego) — dotąd
CAŁKOWICIE nieobecne w module. Źródło: lexlege.pl (Rząd 2B, t.j.
Dz.U.2025.0.775, stan prawny wprost oznaczony jako aktualny na
12.08.2026 — zgodność ze stanem wskazanym w MAPA-AKTOW.md dla tej
ustawy), potwierdzone krzyżowo w przepisy.gofin.pl i poltax.pl.
⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO W ISAP] — ISAP niedostępny do
web_fetch w tej sesji (blokada robots); potwierdź numer t.j. wprost
przed pismem procesowym.

### 5.1. Art. 2 — słowniczek ustawowy (52 pozycje)

```
⭐ ROLA SYSTEMOWA: art. 2 jest DEFINICYJNYM fundamentem CAŁEJ ustawy —
  każde posłużenie się pojęciem z tego katalogu w INNYM przepisie
  odsyła TU. Poniżej WYŁĄCZNIE pozycje o PRAKTYCZNYM znaczeniu
  interpretacyjnym, NIE pełna lista 52 punktów (pełny tekst — patrz
  lexlege.pl/ustawa-o-podatku-od-towarow-i-uslug/art-2/).

KLUCZOWE DEFINICJE Z BEZPOŚREDNIM ZASTOSOWANIEM PRAKTYCZNYM:
□ pkt 6 — TOWARY: rzeczy ORAZ ich części, a TAKŻE wszelkie postacie
  ENERGII (⭐ energia elektryczna/cieplna/gaz TRAKTOWANE jak towar —
  konsekwencje dla miejsca dostawy, odmiennego OD usług)
□ pkt 22 — SPRZEDAŻ: odpłatna DOSTAWA towarów i odpłatne ŚWIADCZENIE
  usług NA terytorium kraju, EKSPORT towarów oraz WDT — ⭐⭐ TA
  definicja jest PODSTAWĄ liczenia LIMITU zwolnienia podmiotowego
  (art. 113) — do wartości SPRZEDAŻY NIE wlicza się KWOTY podatku
□ pkt 25 — MAŁY PODATNIK: próg RÓWNOWARTOŚCI 2 000 000 EUR wartości
  sprzedaży (WRAZ z podatkiem) w POPRZEDNIM roku podatkowym; DLA
  pośredników/maklerów/zarządzających funduszami — RÓWNOWARTOŚĆ
  45 000 EUR prowizji — przeliczenie wg ŚREDNIEGO kursu NBP z
  PIERWSZEGO dnia roboczego października ROKU poprzedniego, w
  zaokrągleniu DO 1000 zł (⭐ status "małego podatnika" WARUNKUJE
  dostęp do METODY KASOWEJ z art. 21 — patrz mod-VAT-rejestracja-
  zaplata-metoda-kasowa-likwidacja.md)
□ pkt 27e — ZORGANIZOWANA CZĘŚĆ PRZEDSIĘBIORSTWA: organizacyjnie I
  finansowo WYODRĘBNIONY zespół składników materialnych I
  niematerialnych (W TYM zobowiązania), MOGĄCY stanowić NIEZALEŻNE
  przedsiębiorstwo — ⭐⭐⭐ KLUCZOWE przy transakcjach M&A (zbycie ZCP
  jest POZA zakresem VAT na mocy art. 6 pkt 1 — TRZY przesłanki
  KUMULATYWNE muszą być SPEŁNIONE: wyodrębnienie ORGANIZACYJNE,
  FINANSOWE i FUNKCJONALNE)
□ pkt 33 — TERENY BUDOWLANE: grunty PRZEZNACZONE pod zabudowę wg MPZP,
  a PRZY BRAKU planu — wg DECYZJI o warunkach zabudowy — ⭐ ISTOTNE
  dla zwolnienia z art. 43 ust. 1 pkt 9 (dostawa GRUNTÓW innych niż
  budowlane)
□ pkt 34 — POJAZDY SAMOCHODOWE: DMC NIEPRZEKRACZAJĄCA 3,5 tony —
  próg RELEWANTNY dla całego reżimu odliczeń z art. 86a (50%/100%)
□ pkt 41–45 — BONY (jednego/różnego przeznaczenia): patrz sekcja
  "GRUPA VAT" i mod-VAT-sankcje-bony-odliczenia.md dla PEŁNEGO
  omówienia mechanizmu
□ pkt 47–48 — GRUPA VAT / PRZEDSTAWICIEL grupy VAT: patrz sekcja
  wyżej w TYM module
□ pkt 49a–52 — SYSTEM KAUCYJNY (opakowania na napoje): definicje
  DODANE nowelizacją wdrażającą system kaucyjny — ⭐ NOWY temat,
  wymaga ODRĘBNEGO pogłębienia PRZY sprawie z branży
  opakowaniowej/napojowej (poza zakresem tego etapu)

⚠️ Sekcja NIE wymienia wszystkich 52 pozycji — przy konkretnej
  sprawie wymagającej innej definicji z art. 2, PRZESZUKAJ wprost
  treść przepisu, NIE zakładaj że dana definicja jest TU pominięta
  z powodu jej NIEISTNIENIA.
```

### 5.2. Art. 3 — właściwość organu podatkowego (przypadki szczególne)

```
⚠️ WAŻNE ZASTRZEŻENIE STRUKTURALNE: art. 3 ust. 1–2 SĄ UCHYLONE —
  OGÓLNA zasada właściwości miejscowej (naczelnik US wg miejsca
  wykonywania czynności / siedziby podatnika) WYNIKA DZIŚ z przepisów
  OGÓLNYCH (Ordynacja podatkowa + rozporządzenie MF ws. właściwości
  organów podatkowych), NIE z art. 3 ustawy o VAT — art. 3 W OBECNYM
  BRZMIENIU reguluje WYŁĄCZNIE PRZYPADKI SZCZEGÓLNE, wymienione niżej.

WŁAŚCIWOŚĆ SZCZEGÓLNA (art. 3 ust. 3):
□ Naczelnik DRUGIEGO Urzędu Skarbowego Warszawa-Śródmieście —
  DLA podatników: (a) BEZ siedziby/stałego miejsca prowadzenia
  działalności W POLSCE, (b) UŁATWIAJĄCYCH sprzedaż PRZEZ interfejs
  elektroniczny (art. 109b), (c) KORZYSTAJĄCYCH z procedur
  SZCZEGÓLNYCH — OSS/IOSS/procedura NIEUNIJNA (Dział XII rozdz. 6a,
  7, 9), (d) POŚREDNIKÓW przy procedurze IMPORTU (rozdz. 9), (e)
  KORZYSTAJĄCYCH ze zwolnienia TRANSGRANICZNEGO SME z art. 113b
□ Naczelnik ŁÓDZKIEGO Urzędu Skarbowego — DLA podatników
  ZIDENTYFIKOWANYCH na potrzeby procedur SZCZEGÓLNYCH (OSS/nieunijna/
  import), DLA których państwem KONSUMPCJI jest RZECZPOSPOLITA Polska
  (czyli PODATNICY zagraniczni ROZLICZAJĄCY polski VAT PRZEZ polski
  organ w RAMACH unijnej procedury uproszczonej)
□ Naczelnik Urzędu Skarbowego Łódź-Śródmieście — DLA podatników
  korzystających ZE zwolnienia TRANSGRANICZNEGO SME z art. 113a
  (podatnik Z SIEDZIBĄ w INNYM państwie UE, sprzedający W Polsce)
  — ⚠️ [NIEJEDNOZNACZNOŚĆ ŹRÓDŁOWA] tekst przepisu W dostępnym
  źródle WYMIENIA dwa RÓŻNE organy (Łódzki US ORAZ Łódź-Śródmieście)
  DLA zbliżonych, ale ODMIENNYCH kategorii (art. 113a I 113b) — PRZED
  zastosowaniem W konkretnej sprawie POTWIERDŹ dokładne brzmienie
  wprost NA ISAP, ROZRÓŻNIAJĄC precyzyjnie który przepis (113a CZY
  113b) dotyczy DANEGO podatnika
□ Organ WŁAŚCIWY dla ZMARŁEGO podatnika w dniu ŚMIERCI (art. 3 ust.
  6) — DLA następców w PRZYPADKACH z art. 15 ust. 1a i art. 17 ust. 1i
□ Naczelnik US WŁAŚCIWY dla PRZEDSTAWICIELA grupy VAT (art. 3 ust. 7)
  — DLA całej GRUPY jako jednego podatnika (spójne Z sekcją "GRUPA
  VAT" wyżej W tym module)

⭐ PRAKTYCZNA IMPLIKACJA: przy SPRAWACH z elementem TRANSGRANICZNYM
  (e-commerce, OSS, podatnik zagraniczny) NIE ZAKŁADAJ automatycznie
  właściwości "zwykłego" naczelnika US wg siedziby klienta — SPRAWDŹ
  najpierw, CZY sprawa NIE PODLEGA jednej Z powyższych właściwości
  SZCZEGÓLNYCH Z art. 3.
```

### 5.3. Art. 28p — zawiadomienie o wyborze/rezygnacji z miejsca
opodatkowania

```
ZAKRES ZASTOSOWANIA: dotyczy DWÓCH kategorii podmiotów:
□ Dostawcy Z art. 22a ust. 3 i 6 (WSTO — wewnątrzwspólnotowa sprzedaż
  towarów na ODLEGŁOŚĆ, PONIŻEJ progu 10 000 EUR łącznie DLA usług
  TBE i WSTO — MOŻLIWOŚĆ wyboru opodatkowania W kraju KONSUMPCJI
  zamiast kraju DOSTAWCY)
□ Podatnicy Z art. 28k ust. 4 i 6 (usługi TELEKOMUNIKACYJNE,
  NADAWCZE, ELEKTRONICZNE — TBE — świadczone NA rzecz konsumentów
  W innych państwach UE, PONIŻEJ TEGO SAMEGO progu 10 000 EUR)

OBOWIĄZEK: SKŁADANIE, ZA POMOCĄ środków komunikacji ELEKTRONICZNEJ,
  DO naczelnika urzędu skarbowego, ZAWIADOMIENIA o:
  □ WYBORZE miejsca opodatkowania (REZYGNACJA Z uproszczenia progowego
    NA rzecz opodatkowania W KAŻDYM państwie konsumpcji od PIERWSZEJ
    transakcji), ALBO
  □ REZYGNACJI z DOKONANEGO wcześniej wyboru

⭐ POWIĄZANIE Z art. 28k ust. 4: PO wyborze opodatkowania W kraju
  konsumpcji, PODATNIK NIE MOŻE zmienić miejsca świadczenia usług
  WCZEŚNIEJ niż PO upływie 2 KOLEJNYCH LAT, licząc OD dnia wykonania
  PIERWSZEJ usługi objętej WYBOREM — ⭐⭐ okres ZWIĄZANIA analogiczny
  koncepcyjnie DO okresu związania wyboru OPODATKOWANIA tonażowego
  (Część C mod-podatki-sektorowe) — ZASADA "wybór wiąże na czas
  określony" POWTARZA się W kilku miejscach ustaw podatkowych,
  WARTO o TYM pamiętać przy DORADZTWIE strategicznym

⭐ REZYGNACJA: podatnik Z siedzibą WYŁĄCZNIE W Polsce MOŻE ponownie
  określić miejsce świadczenia PO uprzednim zawiadomieniu O
  rezygnacji (PRZED początkiem miesiąca, W którym REZYGNUJE)

PRAKTYCZNE ZASTOSOWANIE: dotyczy PRZEDE WSZYSTKIM małych i średnich
  sprzedawców e-commerce/usług cyfrowych, DLA których PROSTSZE jest
  opodatkowanie W kraju SIEDZIBY do momentu przekroczenia progu
  10 000 EUR — ALE CZASAMI korzystniejsze jest DOBROWOLNE opodatkowanie
  W kraju konsumpcji OD razu (NP. gdy stawki VAT W kraju konsumpcji
  SĄ niższe niż polskie 23%) — art. 28p JEST narzędziem TEGO wyboru.
```

### 5.4. Art. 44 — zwolnienia WNT (odesłania do zwolnień z art. 43 i
importu)

```
TREŚĆ (przepis KRÓTKI, DWUPUNKTOWY): zwalnia się OD podatku
  wewnątrzwspólnotowe NABYCIE:
  1) towarów, DO których miałyby ZASTOSOWANIE przepisy art. 43 ust. 1
     pkt 5–8 (⭐ ODESŁANIE do zwolnień PRZEDMIOTOWYCH z art. 43 —
     m.in. dostawa CZĘŚCI ciała/organów/krwi/mleka kobiecego,
     zwolnienia DLA rolnika ryczałtowego W określonym zakresie —
     ⚠️ PRZY konkretnej sprawie SPRAWDŹ dokładny zakres pkt 5–8 W
     aktualnym brzmieniu art. 43, gdyż numeracja PUNKTÓW w tym
     przepisie ULEGAŁA zmianom historycznie)
  2) towarów, KTÓRYCH import NA warunkach określonych W przepisach
     dotyczących importu towarów BYŁBY zwolniony OD podatku (⭐⭐
     ODESŁANIE "lustrzane" DO całego Rozdziału 3 Działu VIII —
     zwolnienia Z tytułu IMPORTU, art. 45-82a, OBJĘTE modułem
     mod-VAT-import-towarow-i-zwolnienia-importowe.md) — MECHANIZM
     ZAPEWNIA spójność: JEŚLI dany towar BYŁBY zwolniony PRZY imporcie
     Z PAŃSTWA trzeciego, ANALOGICZNE zwolnienie STOSUJE SIĘ przy
     WNT Z INNEGO państwa UE — ZASADA NEUTRALNOŚCI między dwoma
     kanałami nabycia SPOZA terytorium kraju

⭐ ZNACZENIE PRAKTYCZNE: art. 44 JEST rzadko powoływany SAMODZIELNIE —
  W PRAKTYCE analiza ZWOLNIENIA przy WNT ZAWSZE prowadzi Z POWROTEM
  DO treści art. 43 ust. 1 pkt 5–8 LUB odpowiedniego przepisu Z
  Rozdziału 3 (import) — TRAKTUJ art. 44 jako "PRZEŁĄCZNIK", NIE jako
  SAMODZIELNY katalog przesłanek.
```

### 5.5. Art. 84–85 — szczególne metody ustalania podatku należnego

```
⚠️ ZNACZENIE MALEJĄCE W PRAKTYCE — obie METODY są ALTERNATYWĄ DLA
  standardowej ewidencji PRZY zastosowaniu kas REJESTRUJĄCYCH
  (art. 111) i W praktyce DOTYCZĄ WĄSKIEJ grupy podatników NIE
  objętych obowiązkiem KASY fiskalnej, ALE prowadzących sprzedaż
  MIESZANĄ (opodatkowana + zwolniona LUB różne stawki).

ART. 84 — METODA "STRUKTURY ZAKUPÓW" (handel):
  □ DOTYCZY: podatników świadczących USŁUGI W zakresie HANDLU,
    DOKONUJĄCYCH sprzedaży OPODATKOWANEJ i ZWOLNIONEJ LUB wg RÓŻNYCH
    stawek, NIEOBOWIĄZANYCH do prowadzenia EWIDENCJI kas fiskalnych
    (art. 111 ust. 1)
  □ MECHANIZM: PODZIAŁ sprzedaży W danym okresie ROZLICZENIOWYM W
    PROPORCJACH wynikających Z UDOKUMENTOWANYCH zakupów Z TEGO
    samego okresu (W którym DOKONANO zakupu) — DO obliczenia
    proporcji PRZYJMUJE SIĘ WYŁĄCZNIE towary PRZEZNACZONE do DALSZEJ
    sprzedaży, WEDŁUG cen UWZGLĘDNIAJĄCYCH podatek
  □ PRZY PODJĘCIU/WZNOWIENIU działalności: PODZIAŁ może być DOKONANY
    PRZY zastosowaniu DO obrotu danego okresu PROCENTOWYCH wskaźników
    podziału ZAKUPÓW Z okresu POPRZEDZAJĄCEGO zakończenie

ART. 85 — METODA "W STU" (usługi, W TYM handel i GASTRONOMIA):
  □ MECHANIZM: kwota PODATKU należnego MOŻE być OBLICZANA jako
    ILOCZYN wartości DOSTAWY i STAWKI. ✅ ZWERYFIKOWANE 2026-08-13 —
    aktualne przeliczniki (potwierdzone w ifirma.pl, Z przykładem
    rozliczenia ZA styczeń 2023, WIĘC już PO podwyżce stawek z 2011 r.
    — pierwsza WERSJA tej sekcji błędnie SUGEROWAŁA możliwą
    nieaktualność, POPRAWIONE po dodatkowej weryfikacji):
    • 18,70% — DLA towarów/usług opodatkowanych STAWKĄ 23%
    • 7,41% — DLA towarów/usług opodatkowanych STAWKĄ 8%
    • 4,76% — DLA towarów/usług opodatkowanych STAWKĄ 5%
    ⚠️ [POTWIERDZONE POŚREDNIO, NIE WPROST NA ISAP] — źródło
    (ifirma.pl, Rząd 2B) NIE cytuje wprost numeracji punktów art. 85
    z aktualnymi przelicznikami — PRZED zastosowaniem W piśmie
    procesowym POTWIERDŹ dokładne brzmienie NA ISAP, zwłaszcza
    PRZYPORZĄDKOWANIE konkretnego przelicznika DO konkretnego
    punktu przepisu.

RELACJA DO ART. 106e (przeliczniki "w stu" NA FAKTURZE): ⭐⭐ ISTOTNE
  ROZRÓŻNIENIE wykryte PRZY tej weryfikacji — art. 85 I art. 106e
  ust. 7-11 TO DWA RÓŻNE mechanizmy "w stu", NIE jeden i TEN SAM
  przepis:
  • Art. 106e ust. 7-11 — WZÓR do wyliczenia KWOTY podatku wprost NA
    POJEDYNCZEJ fakturze (KP = WB × SP / (100 + SP), gdzie WB to
    wartość BRUTTO sprzedaży, SP — stawka procentowa) — ZASTOSOWANIE
    POWSZECHNE, DLA każdego podatnika WYSTAWIAJĄCEGO faktury,
    NIEZALEŻNIE od reżimu Z art. 84/85
  • Art. 85 — ODRĘBNA metoda, ZASTRZEŻONA dla WĄSKIEGO kręgu
    podatników ŚWIADCZĄCYCH usługi (W TYM handel/gastronomia) BEZ
    obowiązku EWIDENCJI kasowej Z art. 111 — SŁUŻY do WYLICZENIA
    zbiorczego podatku NALEŻNEGO za CAŁY okres rozliczeniowy, NIE
    pojedynczej transakcji
  ⚠️ NIE MYLIĆ obu mechanizmów PRZY doradztwie — mają RÓŻNY zakres
  zastosowania I różną PODSTAWĘ prawną, mimo POZORNEGO podobieństwa
  nazwy potocznej ("metoda w stu").

RELACJA DO ART. 111 (kasy fiskalne): OBIE metody (art. 84 i 85) SĄ
  wyraźnie skonstruowane JAKO wyjątek DLA podatników NIEOBJĘTYCH
  obowiązkiem ewidencjonowania PRZY użyciu kas rejestrujących —
  ⭐ W PRAKTYCE, WOBEC powszechności OBOWIĄZKU kas fiskalnych PO
  kolejnych nowelizacjach art. 111, KRĄG podatników REALNIE
  mogących SKORZYSTAĆ Z art. 84–85 JEST dziś WĄSKI — SPRAWDŹ
  najpierw, CZY klient W OGÓLE jest zwolniony Z obowiązku KASY
  (patrz sekcja "KASY FISKALNE" wyżej W tym module), ZANIM
  zaproponujesz metodę Z art. 84 lub 85 jako ROZWIĄZANIE.
```

⚠️ Sekcja 5 ZAMYKA grupę "szybką" luk peryferyjnych (ETAP 2a). Grupa
"średnia" (złoto inwestycyjne, taksówki, call-off stock, VAT-REF,
szacowanie, korekty VAT-UE) i grupa "złożona" (CESOP, procedury
szczególne Działu XIII, centralizacja JST) POZOSTAJĄ do kolejnych
etapów — patrz CHANGELOG poniżej i MAPA-AKTOW.md.

---

## 6. GRUPA ŚREDNIA — DOMKNIĘCIE SAMODZIELNYCH MECHANIZMÓW
PERYFERYJNYCH (ETAP 2b, 2026-08-13, na żądanie użytkownika)

### 6.1. Art. 121–125 — złoto inwestycyjne

```
DEFINICJA ZŁOTA INWESTYCYJNEGO (art. 121 ust. 1) — DWIE kategorie:
□ złoto W POSTACI sztabek LUB płytek O PRÓBIE co NAJMNIEJ 995
  TYSIĘCZNYCH ORAZ złoto REPREZENTOWANE przez papiery WARTOŚCIOWE
□ złote MONETY, spełniające ŁĄCZNIE WSZYSTKIE cztery warunki:
  a) próba co NAJMNIEJ 900 tysięcznych
  b) wybite PO roku 1800
  c) SĄ lub BYŁY obowiązującym środkiem PŁATNICZYM w kraju POCHODZENIA
  d) sprzedawane PO cenie NIEPRZEKRACZAJĄCEJ o więcej NIŻ 80% wartości
     rynkowej ZŁOTA zawartego W monecie
  ⭐ Monety Z corocznego SPISU w serii C Dziennika Urzędowego UE
  SPEŁNIAJĄ warunki PRZEZ cały rok OBOWIĄZYWANIA spisu (ust. 2) —
  UŁATWIENIE dowodowe, nie TRZEBA badać KAŻDEJ monety indywidualnie
  ⭐⭐ Monety Z powyższej definicji NIE SĄ traktowane jako PRZEDMIOTY
  kolekcjonerskie O wartości NUMIZMATYCZNEJ (ust. 3) — WYRAŹNE
  rozgraniczenie OD odrębnej procedury MARŻY dla przedmiotów
  kolekcjonerskich Z art. 120

ZWOLNIENIE (art. 122): DOSTAWA, WNT i IMPORT złota INWESTYCYJNEGO —
  W TYM złota reprezentowanego PRZEZ certyfikaty NA złoto asygnowane/
  nieasygnowane, złota Z obrotu NA rachunkach złota, POŻYCZEK w
  złocie, OPERACJI swap, KONTRAKTÓW futures/forward Z przeniesieniem
  własności/roszczenia — SĄ zwolnione OD VAT. Zwolnienie OBEJMUJE
  RÓWNIEŻ usługi AGENTÓW pośredniczących W dostawie złota
  inwestycyjnego W imieniu ZLECENIODAWCY (art. 122 ust. 2)

REZYGNACJA ZE ZWOLNIENIA (art. 123) — DOSTĘPNA TYLKO dla:
  1) podatników WYTWARZAJĄCYCH złoto inwestycyjne LUB przetwarzających
     inne złoto NA inwestycyjne — GDY dostawa NA rzecz innego podatnika
  2) podatników DOKONUJĄCYCH W ramach przedsiębiorstwa DOSTAWY złota
     W celach PRZEMYSŁOWYCH (złoto Z art. 121 ust. 1 pkt 1) — GDY
     dostawa NA rzecz innego podatnika
  TRYB: pisemne ZAWIADOMIENIE naczelnika US PRZED początkiem miesiąca
  rezygnacji (LUB przed PIERWSZĄ czynnością — dla ROZPOCZYNAJĄCYCH
  działalność W trakcie roku)

PRAWO DO ODLICZENIA MIMO ZWOLNIENIA (art. 124) — WYJĄTEK od zasady
  ogólnej: podatnik ZWOLNIONY na podstawie art. 122 ust. 1, KTÓRY
  wytwarza/przetwarza złoto W inwestycyjne, MA prawo ODLICZYĆ VAT
  naliczony OD zakupów ZWIĄZANYCH z tym wytworzeniem/przetworzeniem
  (W TYM WNT/import) — ⭐ RZADKI przypadek "zwolnienia Z PRAWEM do
  odliczenia" W polskim VAT, ANALOGICZNY konstrukcyjnie DO stawki 0%

EWIDENCJA (art. 125) — obowiązek PROWADZENIA ewidencji sprzedaży
  złota inwestycyjnego, Z DANYMI nabywców — ⭐⭐ ISTOTNE Z perspektywy
  AML/przeciwdziałania praniu PIENIĘDZY, gdyż złoto TRADYCYJNIE jest
  instrumentem WYSOKIEGO ryzyka prania — SPRAWDŹ POWIĄZANIE z
  obowiązkami Z mod-ustawa-AML-instytucje-obowiazkowe.md, JEŚLI
  klient PROWADZI DZIAŁALNOŚĆ w OBROCIE złotem inwestycyjnym

PRAKTYCZNE ZASTOSOWANIE: RELEWANTNE przy sprawach DOTYCZĄCYCH firm
  jubilerskich/lombardów/skupów złota — ROZRÓŻNIENIE między złotem
  INWESTYCYJNYM (zwolnionym) a BIŻUTERIĄ/złomem złota (OPODATKOWANYM
  wg zasad OGÓLNYCH, ewentualnie procedurą MARŻY z art. 120) jest
  ŹRÓDŁEM częstych SPORÓW interpretacyjnych — KLUCZOWE kryterium TO
  PRÓBA i FORMA (sztabka/płytka), NIE sama WARTOŚĆ kruszcu.
```

### 6.2. Art. 114 — ryczałt VAT dla taksówek osobowych

```
ISTOTA: FAKULTATYWNA procedura SZCZEGÓLNA — podatnik świadczący usługi
  TAKSÓWEK osobowych (Z WYŁĄCZENIEM wynajmu samochodów osobowych Z
  kierowcą, PKWiU 49.32.11.0) MOŻE wybrać opodatkowanie W FORMIE
  ryczałtu.

⚠️ ROZBIEŻNOŚĆ TEKST-PRAKTYKA (istotna DLA precyzji cytowania):
  □ LITERALNE brzmienie art. 114 ust. 1 WSKAZUJE stawkę 3%
  □ FAKTYCZNIE STOSOWANA stawka TO 4% — NIE na mocy ZMIANY samego
    art. 114, LECZ na PODSTAWIE ODRĘBNEGO przepisu przejściowego
    (art. 146aa ust. 1 pkt 4, WCZEŚNIEJ art. 146a pkt 4), KTÓRY
    PODWYŻSZA stawki O 1 punkt procentowy OD 1.01.2011 r. — MECHANIZM
    analogiczny DO relacji między NOMINALNĄ stawką podstawową 22%
    (Z tekstu ustawy) a FAKTYCZNIE stosowaną 23% (PRZEZ przepisy
    przejściowe) — ⭐⭐ PRZY cytowaniu W piśmie procesowym, WSKAZUJ
    OBA przepisy łącznie (art. 114 ORAZ art. 146aa ust. 1 pkt 4),
    NIE tylko art. 114 samodzielnie, ABY uniknąć ZARZUTU
    nieaktualności powołanej stawki

WARUNKI WYBORU: PISEMNE zawiadomienie NACZELNIKA urzędu skarbowego
  (formularz VAT-R) W TERMINIE do KOŃCA miesiąca POPRZEDZAJĄCEGO
  okres, W KTÓRYM podatnik BĘDZIE stosował ryczałt

SKUTKI WYBORU RYCZAŁTU:
  □ WYŁĄCZENIE prawa DO odliczenia VAT naliczonego (NIE stosuje SIĘ
    art. 86) — koszt STANOWI wydatek W kwocie BRUTTO
  □ obowiązek SKŁADANIA skróconej deklaracji PODATKOWEJ (formularz
    VAT-12) W terminie ANALOGICZNYM do zasad OGÓLNYCH (art. 99 ust. 1)
    — pierwotnie MIESIĘCZNIE do 25. dnia

REZYGNACJA Z RYCZAŁTU: MOŻLIWA NAJWCZEŚNIEJ po UPŁYWIE 12 MIESIĘCY OD
  wyboru — PO uprzednim pisemnym ZAWIADOMIENIU naczelnika, W terminie
  DO końca miesiąca POPRZEDZAJĄCEGO miesiąc, OD którego podatnik
  PRZESTAJE rozliczać się RYCZAŁTEM — ⭐ ANALOGICZNY mechanizm okresu
  ZWIĄZANIA wyborem, jak PRZY art. 28k/28p (2 lata) i PODATKU
  tonażowym — WZORZEC "wybór WIĄŻE na czas OKREŚLONY" powtarza SIĘ
  konsekwentnie W konstrukcji polskiego VAT

⭐ ODRĘBNOŚĆ OD RYCZAŁTU PIT: ⛔ NIE MYLIĆ Z ryczałtem OD przychodów
  ewidencjonowanych DLA taksówkarzy NA gruncie PIT (STAWKA 8,5%,
  ZUPEŁNIE odrębna PODSTAWA — ustawa O zryczałtowanym podatku
  dochodowym) — TAKSÓWKARZ MOŻE (choć NIE musi) łączyć OBA reżimy
  ryczałtowe (VAT-owy Z art. 114 ORAZ PIT-owy), gdyż DOTYCZĄ różnych
  PODATKÓW i mają NIEZALEŻNE od siebie PRZESŁANKI wyboru.
```

### 6.3. Art. 13a–13l — procedura magazynu typu call-off stock

```
GENEZA: implementacja art. 17a DYREKTYWY 2006/112/WE (WPROWADZONA
  dyrektywą 2018/1910), OBOWIĄZUJE OD 1.07.2020 r. — ZASTĄPIŁA
  wcześniejsze, NIEJEDNOLITE krajowe uproszczenia dot. MAGAZYNÓW
  KONSYGNACYJNYCH.

ISTOTA: umożliwia UNIKNIĘCIE tzw. NIETRANSAKCYJNEGO WNT/WDT przy
  PRZEMIESZCZENIU towarów DO magazynu W innym państwie CZŁONKOWSKIM
  Z przeznaczeniem DLA KONKRETNEGO, z GÓRY znanego nabywcy — ZAMIAST
  rejestracji VAT DOSTAWCY w kraju MAGAZYNU, transakcja ROZLICZANA
  jest jako JEDNA, transakcyjna WDT/WNT W MOMENCIE pobrania towaru
  Z magazynu PRZEZ nabywcę.

DWA ODRĘBNE PODROZDZIAŁY:
  □ Rozdział 3a (art. 13a-13g) — procedura NA terytorium KRAJU
    (przemieszczenie Z innego państwa UE DO Polski)
  □ Rozdział 3b (art. 13h-13l) — procedura NA terytorium INNEGO
    państwa członkowskiego (przemieszczenie Z Polski DO innego
    kraju UE)

WARUNKI ŁĄCZNE procedury KRAJOWEJ (art. 13a ust. 2):
  1) towary WYSYŁANE/transportowane PRZEZ podatnika UE (lub OSOBĘ
     trzecią NA jego rzecz) Z innego PAŃSTWA UE DO Polski, W CELU
     dostawy NA późniejszym ETAPIE, DLA z GÓRY oznaczonego nabywcy,
     upoważnionego DO nabycia prawa ROZPORZĄDZANIA jak WŁAŚCICIEL,
     zgodnie Z WCZEŚNIEJSZYM porozumieniem
  2) dostawca ZAGRANICZNY NIE ma siedziby/stałego MIEJSCA prowadzenia
     działalności W Polsce
  3) nabywca JEST zarejestrowany JAKO podatnik VAT-UE, Z NUMEREM NIP
     poprzedzonym KODEM PL, ZNANYM dostawcy W momencie ROZPOCZĘCIA
     transportu

MECHANIZM ROZLICZENIA (art. 13b): WNT UZNAJE SIĘ za DOKONANE przez
  NABYWCĘ na terytorium KRAJU W MOMENCIE przeniesienia PRAWA do
  rozporządzania TOWARAMI jak właściciel — O ILE nastąpi TO w
  TERMINIE 12 MIESIĘCY od dnia WPROWADZENIA towarów do MAGAZYNU.

ZASTĄPIENIE NABYWCY (art. 13c): jeśli W terminie 12 miesięcy
  PIERWOTNIE wskazany nabywca ZOSTAJE zastąpiony PRZEZ innego
  podatnika — UZNAJE się, że W okresie zastąpienia NIE miało miejsca
  WNT — ⭐ MECHANIZM elastyczności PRZY zmianie kontrahenta W trakcie
  przechowywania W magazynie, POD warunkiem spełnienia dodatkowych
  przesłanek FORMALNYCH (ZAWIADOMIENIE, aktualizacja EWIDENCJI)

OBOWIĄZKI EWIDENCYJNE I ZGŁOSZENIOWE:
  □ Podatnik/podatnik UE PROWADZĄCY magazyn SKŁADA, elektronicznie,
    ZAWIADOMIENIE naczelnikowi US O prowadzeniu magazynu W tej
    procedurze
  □ ZMIANY danych Z zawiadomienia — zgłoszenie W terminie 14 DNI od
    zaistnienia ZMIANY
  □ Ewidencja Z art. 109 ust. 11c — ZGODNIE z wymogami art. 54a ust. 1
    rozporządzenia 282/2011 (SZCZEGÓŁOWY zakres DANYCH o PRZEMIESZCZONYCH
    towarach)

SKUTEK PRZEKROCZENIA TERMINU 12 MIESIĘCY (art. 13l): JEŻELI w
  terminie 12 miesięcy NIE dochodzi DO przeniesienia prawa
  rozporządzania — UZNAJE SIĘ, że NIETRANSAKCYJNE WDT MIAŁO miejsce
  W dniu NASTĘPUJĄCYM po upływie TEGO terminu (Z zastrzeżeniem
  wyjątków Z art. 13l ust. 2 i n., NP. powrotny WYWÓZ towarów DO
  kraju wysyłki PRZED upływem terminu) — ⭐⭐ TO jest KLUCZOWY,
  RYZYKOWNY punkt PROCEDURY: brak PILNOWANIA terminu 12-MIESIĘCZNEGO
  SKUTKUJE koniecznością retroaktywnej REJESTRACJI i rozliczenia
  standardowego WNT/WDT, Z możliwymi ODSETKAMI za ZWŁOKĘ.

⭐ PRAKTYCZNE ZASTOSOWANIE: procedura ISTOTNA przy DORADZTWIE dla
  klientów prowadzących MAGAZYNY logistyczne/dystrybucyjne W
  łańcuchach DOSTAW transgranicznych UE — SZCZEGÓLNIE branża
  motoryzacyjna, FMCG, przemysł — GDZIE towar JEST składowany W
  kraju docelowym PRZED ostatecznym przekazaniem znanemu Z GÓRY
  odbiorcy.
```

### 6.4. Art. 89 — zwrot VAT podmiotom zagranicznym (VAT-REF)

```
STRUKTURA PRZEPISU (wg systematyki KOMENTARZOWEJ, art. 89 ust. 1-8):
  1) ust. 1 — KATALOG CZTERECH grup PODMIOTÓW uprawnionych DO zwrotu:
     służby DYPLOMATYCZNE/konsularne, SIŁY zbrojne (NATO i inne
     PRZYPADKI szczególne), PODMIOTY zagraniczne Z państw TRZECICH
     (NA zasadzie WZAJEMNOŚCI) oraz PODATNICY unijni (VAT-REF sensu
     stricto — patrz NIŻEJ)
  2) ust. 1a-1g — ZASADY zwrotu DLA trzeciej GRUPY (podmioty
     zagraniczne SPOZA UE)
  3) ust. 1h-1l — ZASADY składania WNIOSKU przez POLSKICH podatników
     O zwrot ZAGRANICZNEGO VAT (KIERUNEK "wychodzący" — polski
     podatnik ODZYSKUJĄCY VAT zapłacony W innym kraju UE)
  4) ust. 2-8 — DELEGACJE dla ministra FINANSÓW do wydania
     rozporządzeń WYKONAWCZYCH

⭐⭐⭐ DWA KIERUNKI PROCEDURY VAT-REF — NIE MYLIĆ:
  □ KIERUNEK "PRZYCHODZĄCY": podmiot ZAGRANICZNY (UE lub SPOZA UE)
    ODZYSKUJE VAT zapłacony W POLSCE — WARUNKI: (a) BRAK siedziby/
    stałego miejsca DZIAŁALNOŚCI w Polsce, (b) status ZAREJESTROWANEGO
    podatnika VAT/podatku OD wartości dodanej W państwie SIEDZIBY,
    (c) BRAK wykonywania W Polsce SPRZEDAŻY w rozumieniu art. 2 pkt 22
    (Z enumeratywnymi WYJĄTKAMI: usługi transportowe/pomocnicze przy
    imporcie, kontrola RUCHU lotniczego, obsługa STARTU/lądowania/
    parkowania, procedury SZCZEGÓLNE OSS/nieunijna/import)
  □ KIERUNEK "WYCHODZĄCY": POLSKI podatnik ODZYSKUJE VAT zapłacony W
    INNYM państwie UE (art. 89 ust. 1h-1j) — WNIOSEK VAT-REF SKŁADANY
    ELEKTRONICZNIE za POŚREDNICTWEM właściwego DLA podatnika naczelnika
    US DO właściwego państwa CZŁONKOWSKIEGO zwrotu — WARUNEK: status
    CZYNNEGO podatnika VAT (BRAK zwolnień podmiotowych) ORAZ związek
    zakupów Z czynnościami DAJĄCYMI prawo DO odliczenia W państwie,
    gdzie WYDATEK poniesiono

WYŁĄCZENIA ZWROTU: kwoty PODATKU zafakturowane NIEZGODNIE z
  przepisami USTAWY, ORAZ (dla kierunku wychodzącego) OGRANICZENIA
  analogiczne DO art. 88 ust. 1 pkt 4 (USŁUGI noclegowe/gastronomiczne
  — Z WYJĄTKIEM gotowych POSIŁKÓW dla pasażerów PRZY usługach
  przewozu OSÓB) — ⭐ ZASTRZEŻENIE dotyczy WYŁĄCZNIE polskiego podatku
  naliczonego; ODZYSKANIE VAT zapłaconego ZA noclegi/gastronomię W
  INNYM kraju UE PODLEGA przepisom TEGO kraju, NIE polskim WYŁĄCZENIOM

⭐⭐ AKTUALIZACJA WYKONAWCZA (2026): rozporządzenie WYKONAWCZE do
  art. 89 zostało ZMIENIONE rozporządzeniem Ministra Finansów I
  Gospodarki z 27.05.2026 r. (Dz.U. 2026 poz. 736), KTÓRE weszło W
  życie 6.06.2026 r. — ⚠️ [WYMAGA POTWIERDZENIA ZAKRESU ZMIANY] treść
  tej konkretnej NOWELIZACJI nie BYŁA przedmiotem odrębnej, SZCZEGÓŁOWEJ
  weryfikacji w TEJ sesji — PRZED zastosowaniem PRZY konkretnej sprawie
  z zakresu VAT-REF, SPRAWDŹ wprost zakres ZMIAN wprowadzonych tą
  nowelizacją (może DOTYCZYĆ np. terminów, PROGÓW kwotowych, lub
  zakresu DANYCH we wniosku)
```

### 6.5. Art. 32 — szacowanie podstawy opodatkowania przy powiązaniach

```
ISTOTA: WYJĄTEK od zasady OGÓLNEJ (art. 29a ust. 1 — podstawą
  opodatkowania JEST "wszystko, co STANOWI zapłatę NALEŻNĄ lub
  OTRZYMANĄ") — organ PODATKOWY OKREŚLA podstawę opodatkowania WEDŁUG
  wartości RYNKOWEJ, jeśli SPEŁNIONE są ŁĄCZNIE dwie PRZESŁANKI:
  1) MIĘDZY stronami transakcji ISTNIEJĄ powiązania Z art. 32 ust. 2
  2) powiązania TE MIAŁY wpływ NA ustalenie WYNAGRODZENIA (wynagrodzenie
     ODBIEGA od wartości RYNKOWEJ, w KONKRETNYM kierunku opisanym
     niżej)

WARUNEK KIERUNKOWY (art. 32 ust. 1 pkt 1-2) — szacowanie DZIAŁA
  wyłącznie GDY zaniżenie/zawyżenie WYNAGRODZENIA prowadziłoby DO
  UTRATY wpływów PODATKOWYCH:
  □ wynagrodzenie NIŻSZE od RYNKOWEGO, a NABYWCA NIE MA pełnego prawa
    DO odliczenia (Z art. 86, 86a, 88, 90) — ryzyko ZANIŻENIA VAT
    należnego BEZ odpowiadającej UTRATY prawa do ODLICZENIA po stronie
    nabywcy
  □ wynagrodzenie NIŻSZE, a DOSTAWCA/usługodawca NIE MA pełnego prawa
    DO odliczenia — analogiczna LOGIKA z drugiej STRONY transakcji
  ⭐ MECHANIZM NIE działa AUTOMATYCZNIE przy KAŻDYM odstępstwie od ceny
  RYNKOWEJ między PODMIOTAMI powiązanymi — TYLKO gdy ISTNIEJE
  jednocześnie RYZYKO uszczuplenia WPŁYWÓW budżetowych

DEFINICJA POWIĄZAŃ (art. 32 ust. 2) — ⭐⭐⭐ WAŻNA ZMIANA KONSTRUKCYJNA:
  ustawa DZIŚ NIE zawiera WŁASNEGO, autonomicznego katalogu POWIĄZAŃ,
  lecz ODSYŁA do:
  1) powiązań W rozumieniu art. 23m ust. 1 pkt 5 USTAWY o PIT i art.
     11a ust. 1 pkt 5 USTAWY o CIT (a WIĘC do TEJ SAMEJ definicji, KTÓRA
     obowiązuje NA gruncie cen TRANSFEROWYCH w podatkach DOCHODOWYCH —
     powiązania KAPITAŁOWE od progu 25% udziałów/PRAW głosu/udziału
     W zysku, ZARZĄDCZE, funkcjonalne)
  2) powiązań WYNIKAJĄCYCH ze stosunku PRACY
  3) powiązań WYNIKAJĄCYCH z tytułu PRZYSPOSOBIENIA
  ⚠️ USTĘPY 3-4 (dawny AUTONOMICZNY katalog powiązań RODZINNYCH/
  kapitałowych NA gruncie SAMEGO VAT) SĄ DZIŚ UCHYLONE — odesłanie DO
  PIT/CIT ZASTĄPIŁO wcześniejszą, ODRĘBNĄ regulację

WYŁĄCZENIE STOSOWANIA (art. 32 ust. 5): przepis NIE MA zastosowania,
  GDY właściwy organ PODATKOWY WYDAŁ uprzednie POROZUMIENIE CENOWE
  (APA) na PODSTAWIE ustawy Z 16.10.2019 r. O rozstrzyganiu SPORÓW
  dot. podwójnego OPODATKOWANIA oraz zawieraniu UPRZEDNICH porozumień
  cenowych — ⭐ POSIADANIE ważnego APA DAJE podatnikowi OCHRONĘ również
  NA gruncie VAT, NIE tylko podatków DOCHODOWYCH, dla TRANSAKCJI nim
  objętych

⭐⭐ RELACJA DO SZACOWANIA W PODATKACH DOCHODOWYCH: art. 32 ustawy o
  VAT I przepisy o CENACH transferowych W PIT/CIT (art. 11-11t CIT,
  art. 23m i n. PIT) TO ODRĘBNE, RÓWNOLEGŁE reżimy — orzecznictwo
  (przywołane W komentarzu INFORLEX) PODKREŚLA, że ZASADA neutralności
  i POTRĄCALNOŚCI VAT NIE pozwala NA tak SWOBODNE kształtowanie
  podstawy OPODATKOWANIA jak W podatku DOCHODOWYM — mechanizmy CEN
  transferowych PIT/CIT i SZACOWANIE VAT Z art. 32 MOGĄ prowadzić DO
  RÓŻNYCH wyników DLA TEJ SAMEJ transakcji, WYMAGAJĄ odrębnej analizy
  KAŻDY na SWOIM gruncie prawnym

⭐ ORZECZNICTWO: NSA w wyroku z 31.08.2021 r. (sygn. I FSK 230/18)
  potwierdził, że mimo iż przepis GRAMATYCZNIE adresowany jest DO
  organów PODATKOWYCH (nie WPROST do podatników), PODATNICY SĄ
  obowiązani STOSOWAĆ tę regułę SAMODZIELNIE przy USTALANIU podstawy
  opodatkowania DLA częściowo ODPŁATNYCH świadczeń NA rzecz
  PRACOWNIKÓW — ⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO] sygnatura WYMAGA
  potwierdzenia W orzeczenia.nsa.gov.pl PRZED powołaniem W piśmie
  procesowym, ZGODNIE z regułami PRAWO-HARDGATE
```

### 6.6. Art. 101–102 — korekta informacji podsumowującej VAT-UE

```
KONTEKST SYSTEMOWY: art. 101-102 SĄ ściśle POWIĄZANE z art. 100
  (informacja PODSUMOWUJĄCA VAT-UE, OBJĘTA już mod-VAT-ewidencja-
  deklaracje.md) — TA sekcja DOMYKA WYŁĄCZNIE mechanizm KOREKTY,
  dotąd NIEOBECNY.

OBOWIĄZEK KOREKTY (art. 101): W przypadku STWIERDZENIA jakichkolwiek
  BŁĘDÓW w ZŁOŻONEJ informacji podsumowującej, PODMIOT który JĄ
  złożył JEST obowiązany złożyć NIEZWŁOCZNIE korektę TEJ informacji
  ZA pomocą środków komunikacji ELEKTRONICZNEJ.
  ⭐⭐ BRAK SZTYWNEGO TERMINU W DNIACH — ustawa POSŁUGUJE SIĘ pojęciem
  nieostrym "NIEZWŁOCZNIE", NIE precyzując KONKRETNEJ liczby dni —
  W PRAKTYCE oznacza TO obowiązek DZIAŁANIA bez zbędnej ZWŁOKI OD
  momentu WYKRYCIA błędu, NIE od momentu POWSTANIA pierwotnego
  obowiązku

CHARAKTER PRZEPISU: art. 101 STANOWI lex SPECIALIS wobec OGÓLNEJ
  regulacji korekt DEKLARACJI z art. 81 ORDYNACJI podatkowej — ⭐
  ISTOTNA KONSEKWENCJA: W PRZECIWIEŃSTWIE do art. 81 § 2 OP (KTÓRY
  wymaga DOŁĄCZENIA pisemnego uzasadnienia PRZYCZYN korekty), art. 101
  ustawy O VAT NIE przewiduje TAKIEGO wymogu — POTWIERDZONE W
  interpretacji indywidualnej Dyrektora IZBY Skarbowej w Łodzi z
  9.03.2012 r. (nr IPTPP2/443-775/11-4/KW) — ⚠️ [NIEWERYFIKOWANE
  BEZPOŚREDNIO, INTERPRETACJA HISTORYCZNA] sprawdź AKTUALNOŚĆ tej
  linii interpretacyjnej PRZY konkretnej sprawie, gdyż interpretacja
  POCHODZI sprzed ponad DEKADY

FORMULARZ VAT-UEK: struktura IDENTYCZNA jak VAT-UE (7 CZĘŚCI A-G), ALE
  KAŻDA korygowana POZYCJA prezentowana W DWÓCH wierszach: "BYŁO"
  (dane PIERWOTNIE zgłoszone) I "JEST" (dane PRAWIDŁOWE)
  ⛔ WAŻNE ROZGRANICZENIE ZAKRESU: VAT-UEK SŁUŻY WYŁĄCZNIE do korekty
  BŁĘDÓW W pierwotnym RAPORCIE — NIE służy DO raportowania NOWYCH
  zdarzeń (NP. udzielenie RABATU już PO złożeniu informacji, LUB
  PODWYŻSZENIE ceny) — TAKIE zdarzenia UJMUJE SIĘ w BIEŻĄCEJ,
  standardowej informacji VAT-UE ZA okres, W którym ZDARZENIE
  faktycznie WYSTĄPIŁO, a NIE poprzez KOREKTĘ wcześniejszego okresu

DELEGACJA WYKONAWCZA (art. 102 ust. 1): MINISTER właściwy DS. finansów
  publicznych OKREŚLA w drodze ROZPORZĄDZENIA wzór informacji
  PODSUMOWUJĄCEJ (Z objaśnieniami CO do sposobu wypełniania, TERMINU
  i miejsca SKŁADANIA) ORAZ wzór KOREKTY tej informacji — AKTUALNIE
  obowiązujące wzory VAT-UE(5) i VAT-UEK(5) WYNIKAJĄ z rozporządzenia
  MF z 26.06.2020 r. (Dz.U. 2020 poz. 1138), STOSOWANE od rozliczenia
  za CZERWIEC 2020 r. — ⚠️ [WYMAGA WERYFIKACJI AKTUALNOŚCI] SPRAWDŹ,
  czy NIE nastąpiła PÓŹNIEJSZA zmiana wzoru FORMULARZA przy konkretnym
  zastosowaniu, gdyż ŹRÓDŁO tej informacji NIE było datowane NA
  2026 r.

⭐ POWIĄZANIE Z ART. 42 UST. 1a: NIEZŁOŻENIE informacji podsumowującej
  (LUB złożenie Z opóźnieniem) MOŻE skutkować UTRATĄ prawa DO
  zastosowania stawki 0% PRZY WDT — ⭐⭐⭐ STAWKA wysokość praktyczna:
  BŁĄD w informacji PODSUMOWUJĄCEJ, jeśli NIE zostanie SKORYGOWANY
  "niezwłocznie", MOŻE W KONSEKWENCJI zagrażać PRAWU do stawki 0%
  dla CAŁEJ transakcji WDT, KTÓREJ dotyczy — WARTO o TYM pamiętać
  przy OCENIE pilności korekty, NIE traktować obowiązku Z art. 101
  jako WYŁĄCZNIE formalnego.
```

⚠️ Sekcja 6 ZAMYKA grupę "średnią" (ETAP 2b). Grupa "złożona"
(CESOP, procedury szczególne Działu XIII rozdz. 1b/1ca/1d,
centralizacja rozliczeń JST, pozostałe fakturowanie art. 106a/106d/
106f/106l/106m-106q, art. 84 ust. 3-5 wyroby medyczne) POZOSTAJE do
kolejnego etapu.

---

## 7. GRUPA ZŁOŻONA — CESOP, PROCEDURY SZCZEGÓLNE, CENTRALIZACJA
JST (ETAP 2c, 2026-08-13, na żądanie użytkownika)

### 7.1. Art. 110a–110e — CESOP (raportowanie płatności transgranicznych)

```
GENEZA: implementacja unijnego PAKIETU CESOP (Central Electronic
  System of Payment information) — CZĘŚĆ szerszego pakietu VAT
  e-commerce, OBOWIĄZUJE OD 1.01.2024 r. CEL: uszczelnienie VAT W
  handlu transgranicznym B2C przez KRZYŻOWĄ analizę danych O
  płatnościach zbieranych OD dostawców usług PŁATNICZYCH w CAŁEJ UE.

DEFINICJE (art. 110a) — KLUCZOWE pojęcia: AKCEPTANT (odbiorca
  płatności w rozumieniu ustawy O usługach płatniczych), BIC, DOSTAWCA
  usług płatniczych (odesłanie DO art. 4 ust. 2 pkt 1-6 i 9 ustawy O
  usługach płatniczych — a WIĘC KATALOG szerszy niż WYŁĄCZNIE banki:
  obejmuje TAKŻE instytucje płatnicze, MAŁE instytucje płatnicze,
  instytucje PIENIĄDZA elektronicznego), IBAN.

⭐⭐⭐ PRÓG OBOWIĄZKOWEGO RAPORTOWANIA (art. 110b): raportowanie CESOP
  jest OBLIGATORYJNE, jeśli dostawca usług PŁATNICZYCH przeprowadzi
  W danym PAŃSTWIE członkowskim WIĘCEJ niż 25 PŁATNOŚCI transgranicznych
  W trakcie KWARTAŁU wobec TEGO SAMEGO odbiorcy (akceptanta). Płatność
  TRANSGRANICZNA = płatnik ZNAJDUJE SIĘ w UE, a ODBIORCA płatności —
  W UE LUB w państwie TRZECIM.

OBOWIĄZKI DOSTAWCY USŁUG PŁATNICZYCH:
  □ prowadzenie EWIDENCJI odbiorców płatności ORAZ płatności
    transgranicznych (art. 110b ust. 1), Z określonym ZAKRESEM danych
    (m.in. IBAN/BIC odbiorcy, KWOTY, daty, informacja O ewentualnych
    zwrotach, PAŃSTWO pochodzenia/przeznaczenia płatności — art. 110b
    ust. 3 wg PRZYWOŁANIA w materiałach branżowych)
  □ RAPORTOWANIE kwartalne W formacie XML — termin DO KOŃCA miesiąca
    NASTĘPUJĄCEGO po ZAKOŃCZENIU kwartału
  □ PRZECHOWYWANIE ewidencji W postaci ELEKTRONICZNEJ przez OKRES 3
    LAT od zakończenia ROKU podatkowego, w KTÓRYM nastąpiła PŁATNOŚĆ
    (art. 110d)
  □ UDOSTĘPNIANIE ewidencji NA zasadach art. 24b ust. 1 rozp. RADY
    (UE) 904/2010 — CZYLI Szefowi KAS (art. 110e), KTÓRY następnie
    PRZEKAZUJE dane DO unijnego systemu CENTRALNEGO CESOP

⭐ ADRESAT OBOWIĄZKU (właściwość PAŃSTWA): ewidencja UDOSTĘPNIANA jest
  Szefowi KAS, GDY Polska JEST "przyjmującym PAŃSTWEM członkowskim"
  dla DANEGO dostawcy usług płatniczych LUB GDY Polska jest jego
  PAŃSTWEM macierzystym — ⚠️ [NIEWERYFIKOWANE W PEŁNI] dokładne
  kryteria rozgraniczenia OBU tych sytuacji NIE były przedmiotem
  odrębnej, POGŁĘBIONEJ weryfikacji w tej SESJI — przy konkretnej
  sprawie Z udziałem dostawcy USŁUG płatniczych działającego
  transgranicznie, SPRAWDŹ wprost właściwe PRZEPISY wykonawcze.

⭐⭐ ZNACZENIE PRAKTYCZNE: CESOP dotyczy WPROST dostawców usług
  płatniczych (BANKI, instytucje płatnicze), NIE samych SPRZEDAWCÓW
  towarów/usług — ALE POŚREDNIO wpływa NA sytuację sprzedawców
  e-commerce, GDYŻ organy PODATKOWE zyskują NARZĘDZIE do WYKRYWANIA
  niezgłoszonej sprzedaży TRANSGRANICZNEJ (porównanie DANYCH z CESOP
  Z deklaracjami VAT/OSS sprzedawcy) — PRZY doradztwie DLA klientów
  prowadzących sprzedaż TRANSGRANICZNĄ B2C, WARTO uwzględnić TEN
  mechanizm jako CZYNNIK zwiększający RYZYKO wykrycia nieprawidłowości.
```

### 7.2. Dział XIII rozdz. 1b — wyroby medyczne (art. 145c–145d)

```
⛔⛔ PRZEPIS W ZNACZNEJ MIERZE HISTORYCZNY NA DZIEŃ WERYFIKACJI
  (12.08.2026) — WAŻNE ODKRYCIE tej sesji: przepisy PRZEJŚCIOWE Z art.
  145c i 145d, POZWALAJĄCE na STOSOWANIE obniżonej STAWKI 8% dla
  wyrobów MEDYCZNYCH dopuszczonych DO obrotu NA podstawie UCHYLONEJ
  już ustawy Z 2010 r. o WYROBACH medycznych, OBOWIĄZYWAŁY WYŁĄCZNIE
  DO 27 MAJA 2025 R. — TERMIN ten JUŻ MINĄŁ na DZIEŃ sporządzania tej
  sekcji.

GENEZA: ustawa Z 7.04.2022 r. o WYROBACH medycznych ZASTĄPIŁA ustawę Z
  2010 r., IMPLEMENTUJĄC unijne rozporządzenia MDR (2017/745) i IVDR
  (2017/746) — ABY UMOŻLIWIĆ podmiotom PŁYNNE przejście, wprowadzono
  OKRES przejściowy, W KTÓRYM wyroby DOPUSZCZONE do obrotu WEDŁUG
  STAREJ ustawy MOGŁY nadal KORZYSTAĆ z obniżonej stawki 8% (poz. 13
  załącznika NR 3 do ustawy O VAT W BRZMIENIU sprzed zmiany) — art.
  145c dotyczy DOSTAWY takich wyrobów, art. 145d — USŁUG napraw i
  konserwacji.

⚠️ ZNACZENIE PRAKTYCZNE DZIŚ: PO 27.05.2025 r. klasyfikacja stawki
  VAT DLA wyrobów medycznych ODBYWA SIĘ już WYŁĄCZNIE na PODSTAWIE
  AKTUALNIE obowiązującej ustawy Z 2022 r. i ZGODNOŚCI Z rozporządzeniami
  MDR/IVDR (certyfikaty CE) — art. 145c/145d POZOSTAJĄ w USTAWIE jako
  przepis EPIZODYCZNY dot. OKRESU już ZAKOŃCZONEGO, RELEWANTNY
  WYŁĄCZNIE przy analizie STANU prawnego DLA transakcji SPRZED tej
  daty (np. SPORY podatkowe/kontrole DOTYCZĄCE okresów rozliczeniowych
  do maja 2025 r.) — ⭐ PRZY BIEŻĄCYM doradztwie DLA klienta Z branży
  medycznej, SKIERUJ analizę NA aktualne przepisy O wyrobach medycznych
  (2022) i OGÓLNĄ systematykę stawek VAT (poz. 13 załącznika NR 3 W
  aktualnym brzmieniu), NIE na TĘ historyczną już regulację
  przejściową.
```

### 7.3. Centralizacja rozliczeń VAT jednostek samorządu terytorialnego

```
⚠️ WAŻNE ZASTRZEŻENIE STRUKTURALNE: centralizacja VAT JST NIE jest
  regulowana W SAMEJ ustawie o VAT, LECZ W ODRĘBNEJ ustawie z
  5.09.2016 r. O szczególnych zasadach ROZLICZEŃ podatku od TOWARÓW i
  usług ORAZ dokonywania zwrotu ŚRODKÓW publicznych przeznaczonych NA
  realizację projektów FINANSOWANYCH z udziałem środków POCHODZĄCYCH
  z budżetu UE — TZW. "ustawa CENTRALIZACYJNA" (Dz.U. 2016 poz. 1454,
  ⚠️ [NIEWERYFIKOWANE] zweryfikuj AKTUALNY t.j. na ISAP). TEMAT był
  wcześniej BŁĘDNIE traktowany jako "luka W ustawie o VAT" — W
  RZECZYWISTOŚCI to ODRĘBNY akt, jedynie ŚCIŚLE powiązany Z VAT
  tematycznie.

GENEZA: wyrok TSUE z 29.09.2015 r. w sprawie C-276/14 (Gmina Wrocław)
  — Trybunał STWIERDZIŁ, że jednostki BUDŻETOWE gminy NIE MOGĄ być
  uznane ZA odrębnych od GMINY podatników VAT, GDYŻ nie SPEŁNIAJĄ
  kryterium SAMODZIELNOŚCI (brak WŁASNEGO majątku, brak PONOSZENIA
  ryzyka gospodarczego). NASTĘPNIE NSA w uchwale Z 26.10.2015 r. (sygn.
  I FPS 4/15) ROZSZERZYŁ tę zasadę NA samorządowe ZAKŁADY budżetowe
  (mimo WIĘKSZEGO stopnia SAMODZIELNOŚCI niż jednostki budżetowe).

SKUTEK: OBOWIĄZKOWA centralizacja rozliczeń VAT OD 1.01.2017 r. —
  JST (gmina, powiat, WOJEWÓDZTWO) WRAZ ze WSZYSTKIMI swoimi
  jednostkami ORGANIZACYJNYMI staje SIĘ JEDNYM podatnikiem VAT, ZAMIAST
  odrębnej REJESTRACJI każdej jednostki Z osobna.

JEDNOSTKI ORGANIZACYJNE OBJĘTE CENTRALIZACJĄ:
  □ urząd GMINY, starostwo POWIATOWE, urząd MARSZAŁKOWSKI
  □ utworzone PRZEZ JST (lub ZWIĄZKI JST) samorządowe JEDNOSTKI
    budżetowe
  □ utworzone PRZEZ JST (lub ZWIĄZKI JST) samorządowe ZAKŁADY
    budżetowe
  ⭐ centralizacji PODLEGAJĄ RÓWNIEŻ związki MIĘDZYGMINNE, związki
  POWIATÓW i związki POWIATOWO-GMINNE, PRZEJMUJĄCE na PODSTAWIE
  ustaw prawa I obowiązki JST

⛔ ZASADA "WSZYSTKO ALBO NIC": centralizacji NIE MOŻNA dokonać CZĘŚCIOWO
  — NIE MOŻNA rozliczać SIĘ w sposób SCENTRALIZOWANY tylko W wybranych
  obszarach DZIAŁALNOŚCI JST LUB tylko W wybranych OKRESACH
  rozliczeniowych (NP. w miesiącach PARZYSTYCH), a W pozostałych
  KONTYNUOWAĆ dotychczasową PRAKTYKĘ odrębnego rozliczania POSZCZEGÓLNYCH
  jednostek — organ SKARBOWY konsekwentnie EGZEKWUJE pełną, JEDNOLITĄ
  centralizację

PRAKTYCZNE ZNACZENIE PROCESOWE: NIK w kontroli (przywołanej W
  wynikach wyszukiwania) ODNOTOWAŁ, że problematyka CENTRALIZACJI
  generuje wysoką LICZBĘ wniosków O interpretacje indywidualne
  (369 wniosków W skontrolowanych jednostkach) ORAZ długotrwałe spory
  SĄDOWO-ADMINISTRACYJNE (średni CZAS postępowania PRZED WSA — POWYŻEJ
  1000 dni; PRZED NSA — POWYŻEJ 2000 dni) — ⭐⭐ ISTOTNE PRZY doradztwie
  dla KLIENTÓW z sektora SAMORZĄDOWEGO: sprawy VAT DOTYCZĄCE
  centralizacji CZĘSTO wymagają WIELOLETNIEGO horyzontu procesowego,
  co WARTO komunikować klientowi NA wczesnym etapie

⭐ POWIĄZANIE Z GRUPĄ VAT: centralizacja JST i GRUPA VAT (sekcja
  wyżej w TYM module) TO DWIE ODRĘBNE instytucje O odmiennej
  PODSTAWIE prawnej — centralizacja JST jest OBOWIĄZKOWA i wynika Z
  odrębnej ustawy, GRUPA VAT jest FAKULTATYWNA i wynika Z samej
  ustawy o VAT — NIE MYLIĆ obu mechanizmów, mimo iż OBA prowadzą DO
  traktowania wielu PODMIOTÓW jako JEDNEGO podatnika VAT.
```

### 7.4. Art. 43 ust. 3–5 — rezygnacja rolnika ryczałtowego ze zwolnienia

```
MECHANIZM (art. 43 ust. 3): rolnik RYCZAŁTOWY dokonujący dostawy
  produktów ROLNYCH lub świadczący USŁUGI rolnicze, ZWOLNIONE na
  podstawie art. 43 ust. 1 pkt 3, MOŻE zrezygnować Z tego zwolnienia
  POD warunkiem DOKONANIA zgłoszenia rejestracyjnego Z art. 96 ust.
  1 i 2 (formularz VAT-R) — ⭐ UPROSZCZENIE od 1.04.2011 r.: dawniej
  (do 31.03.2011 r.) wymagany BYŁ DODATKOWO próg WARTOŚCI sprzedaży
  W poprzednim roku PODATKOWYM przekraczający 20 000 zł — TEN
  dodatkowy WARUNEK ZOSTAŁ zniesiony, DZIŚ wystarcza SAMO zgłoszenie
  rejestracyjne, BEZ progu kwotowego

SKUTKI REZYGNACJI: rolnik STAJE SIĘ czynnym PODATNIKIEM VAT W
  zakresie prowadzonej DZIAŁALNOŚCI rolniczej — konsekwencje:
  □ obowiązek WYSTAWIANIA faktur WEDŁUG zasad OGÓLNYCH
  □ obowiązek PROWADZENIA ewidencji VAT I składania plików JPK_V7
  □ PRAWO do odliczenia VAT NALICZONEGO od zakupów ZWIĄZANYCH z
    działalnością OPODATKOWANĄ (maszyny ROLNICZE, paliwo, CZĘŚCI,
    usługi remontowe, INWESTYCJE w gospodarstwo) — ⭐ TO jest
    GŁÓWNA praktyczna KORZYŚĆ rezygnacji, zwłaszcza PRZY znaczących
    inwestycjach W gospodarstwie

POWRÓT DO ZWOLNIENIA (art. 43 ust. 5): MOŻLIWY DOPIERO po UPŁYWIE 3
  LAT od DATY rezygnacji — POD warunkiem PISEMNEGO zawiadomienia
  naczelnika US PRZED początkiem miesiąca (KWARTAŁU), OD którego
  rolnik PONOWNIE chce SKORZYSTAĆ ze zwolnienia — ⭐⭐ KOLEJNY przykład
  wzorca "WYBÓR wiąże NA czas określony" (analogicznie DO art. 28k/
  28p — 2 lata, art. 114 taksówki — 12 miesięcy, PODATEK tonażowy —
  OKRES wieloletni) — konsekwentnie POWTARZający się mechanizm W
  konstrukcji polskiego VAT, WART odnotowania PRZY doradztwie
  strategicznym DLA klientów rozważających DOWOLNY z tych wyborów

⭐ PRAKTYCZNE ZASTOSOWANIE: relevantne PRZY doradztwie dla GOSPODARSTW
  rolnych planujących ZNACZĄCE inwestycje (np. modernizacja PARKU
  maszynowego, budowa NOWYCH obiektów gospodarczych) — REZYGNACJA ze
  zwolnienia MOŻE być OPŁACALNA, jeśli SPODZIEWANY VAT naliczony OD
  inwestycji PRZEWYŻSZA utracone UPROSZCZENIA rozliczeniowe — WYMAGA
  jednak KALKULACJI uwzględniającej 3-LETNI okres związania.
```

### 7.5. Pozostałe pozycje grupy złożonej — ujęcie nawigacyjne

```
⚠️ Poniższe pozycje POZOSTAJĄ nieopracowane merytorycznie w TYM
etapie — wskazano WYŁĄCZNIE ich UMIEJSCOWIENIE systemowe I priorytet,
zgodnie z METODOLOGIĄ już zastosowaną przy Dziale VII/VIII rozdz. 3
(iteracja VII) — TAM gdzie temat jest WĄSKI/niszowy, moduł WSKAZUJE
ścieżkę dotarcia zamiast pełnego opracowania NA zapas (ZASADA lazy
loading):

□ Art. 108c-108g (Rozdział 1a — mechanizm PODZIELONEJ płatności,
  dalsza część) — KONTYNUACJA regulacji MPP z art. 108a-108b (JUŻ
  opracowanych we WCZEŚNIEJSZYCH iteracjach) — DOTYCZY szczegółów
  technicznych rachunku VAT PRZY MPP, mniejszy PRIORYTET praktyczny
  niż już OPRACOWANE mechanizmy podstawowe

□ Art. 92-95 (Dział IX rozdz. 2 — DALSZA część odliczania częściowego
  i KOREKTY podatku naliczonego) — UZUPEŁNIENIE już OPRACOWANEJ
  proporcji/prewspółczynnika Z art. 90/90a-90c/91 (patrz MAPA-AKTOW,
  wcześniejsze ITERACJE) — dotyczy SZCZEGÓŁOWYCH przypadków korekty
  wieloletniej

□ Art. 112-112aa (Rozdział 4 — TERMINY przechowywania dokumentów) —
  temat TECHNICZNY, względnie NISKIE ryzyko sporne, WYSOKI priorytet
  TYLKO przy konkretnych sporach DOT. przedawnienia obowiązku
  przechowywania

□ Art. 134a-134c (Rozdział 7a — SZCZEGÓLNA procedura DLA
  międzynarodowego okazjonalnego PRZEWOZU drogowego osób) — TEMAT
  WĄSKI, dotyczy WYŁĄCZNIE przewoźników AUTOKAROWYCH w RUCHU
  międzynarodowym — NISKA częstotliwość W typowej praktyce KANCELARII
  cywilno-karnej

□ Art. 138i-138j (Rozdział 10 — procedura DEKLAROWANIA i zapłaty
  podatku Z tytułu IMPORTU towarów, tzw. "IOSS uproszczony") —
  POWIĄZANE tematycznie Z już OPRACOWANYM w iteracji VII modułem
  mod-VAT-import-towarow-i-zwolnienia-importowe.md — PRZY sprawie Z
  tego zakresu, sprawdź NAJPIERW ten moduł, GDYŻ może JUŻ zawierać
  wystarczające OMÓWIENIE nawigacyjne

□ Art. 106a/106d/106f/106l/106m-106q (SZCZEGÓŁOWE elementy systematyki
  fakturowania, poza JUŻ opracowanymi w iteracji III art. 106b/106e/
  106i/106j/106k) — DROBNE, techniczne PRZEPISY o zakresie STOSOWANIA
  poszczególnych PRZEPISÓW faktur (np. faktury UPROSZCZONE, faktury
  wystawiane PRZEZ nabywcę — "self-billing", elementy FAKTUR w
  procedurach SZCZEGÓLNYCH) — NAJNIŻSZY priorytet W tej grupie, DO
  opracowania PRZY konkretnym stanie FAKTYCZNYM wymagającym analizy
  jednego Z tych szczegółowych PRZEPISÓW, nie NA zapas.

⭐ REKOMENDACJA METODOLOGICZNA: powyższe POZYCJE, w PRZECIWIEŃSTWIE
do sekcji 1-4 tego etapu, MAJĄ NISKĄ częstotliwość WYSTĘPOWANIA w
typowej praktyce kancelaryjnej OBEJMUJĄCEJ prawo cywilne/rodzinne/
karne/gospodarcze (profil UŻYTKOWNIKA systemu) — dalsze POGŁĘBIANIE
tych wątków REKOMENDUJE SIĘ WYŁĄCZNIE reaktywnie, PRZY faktycznym
wystąpieniu sprawy Z danego zakresu, ZAMIAST dalszego wypełniania
"na zapas" wbrew ZASADZIE lazy loading systemu.
```

⚠️ Sekcja 7 ZAMYKA grupę "złożoną" (ETAP 2c) w zakresie tematów
o wyższym priorytecie praktycznym. Pozostałe drobne pozycje z 7.5
pozostają świadomie nawigacyjne.

---

## CHANGELOG (skrócony — pełna historia w MAPA-AKTOW.md)

**ETAP 2a (2026-08-13):** dodano Sekcję 5 — domknięcie grupy "szybkiej"
luk peryferyjnych: art. 2 (słownik, wybrane kluczowe definicje z 52),
art. 3 (właściwość organów — wyłącznie przypadki szczególne, art. 3
ust. 1-2 SĄ uchylone), art. 28p (zawiadomienie o miejscu opodatkowania
WSTO/TBE), art. 44 (zwolnienia WNT — przepis-przełącznik odsyłający do
art. 43 i Rozdziału 3), art. 84-85 (szczególne metody ustalania VAT
należnego — struktura zakupów i metoda "w stu", odróżnione od
mechanizmu przeliczeniowego z art. 106e). W trakcie weryfikacji
wykryto i skorygowano własną wstępną hipotezę o nieaktualności
przeliczników art. 85 — po dodatkowym wyszukiwaniu potwierdzono,
że przeliczniki 18,70%/7,41%/4,76% (stawki 23%/8%/5%) SĄ aktualne.
Źródła: lexlege.pl (Rząd 2B, t.j. Dz.U.2025.0.775, stan prawny
wprost oznaczony jako aktualny na 12.08.2026), przepisy.gofin.pl,
poltax.pl, ifirma.pl. ⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO W ISAP] —
ISAP niedostępny do web_fetch w tej sesji.

**ETAP 2c (2026-08-13):** dodano Sekcję 7 — domknięcie priorytetowej
części grupy "złożonej": CESOP (art. 110a-110e — próg 25 płatności/
kwartał, obowiązki dostawców usług płatniczych, powiązanie z
wykrywalnością nieprawidłowości e-commerce), wyroby medyczne (art.
145c-145d — WAŻNE ODKRYCIE: przepis przejściowy wygasł 27.05.2025 r.,
dziś ma charakter w większości historyczny), centralizacja VAT JST
(WAŻNE ODKRYCIE STRUKTURALNE: to odrębna ustawa z 2016 r., nie luka
w samej ustawie o VAT — geneza z wyroku TSUE C-276/14 Gmina Wrocław
i uchwały NSA I FPS 4/15, zasada "wszystko albo nic"), art. 43 ust.
3-5 (rezygnacja rolnika ryczałtowego — uproszczenie od 2011 r., okres
związania 3 lata, wzorzec powtarzający się w kilku miejscach ustawy).
Pozostałe drobne pozycje (108c-108g, 92-95, 112-112aa, 134a-134c,
138i-138j, szczegółowe fakturowanie 106a/106d/106f/106l/106m-106q)
potraktowane nawigacyjnie zgodnie z zasadą lazy loading — niska
częstotliwość w typowej praktyce kancelaryjnej użytkownika, do
opracowania reaktywnie przy faktycznej sprawie. Źródła: lexlege.pl,
przepisy.gofin.pl, prawo.pl, deloitte.com, cowzdrowiu.pl,
isp-modzelewski.pl, enodo.pl, mf-arch2.mf.gov.pl, infor.pl, rp.pl,
nik.gov.pl, perspektywapodatkowa.com, adwokatpazdan.pl,
egospodarka.pl, vademecumpodatnika.pl, odpowiedziprawne.pl,
konskowola.pl, izbapodatkowa.pl, inforfk.pl, praworolne.info.

**ETAP 2b (2026-08-13):** dodano Sekcję 6 — domknięcie grupy
"średniej": złoto inwestycyjne (art. 121-125), taksówki (art. 114),
call-off stock (art. 13a-13l), VAT-REF (art. 89), szacowanie
podstawy przy powiązaniach (art. 32), korekty informacji
podsumowujących VAT-UE (art. 101-102). Źródła: lexlege.pl, gofin.pl,
ifirma.pl, poltax.pl, ksiegoboty.pl (art. 89 — z aktualnym
rozporządzeniem MF i G z 27.05.2026, Dz.U. 2026 poz. 736, weszło
w życie 6.06.2026), inforlex.pl, bwradwokaci.pl, e-druki.pl.


