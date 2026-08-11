# mod-VAT-podatek-od-towarow-i-uslug

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** VAT — Dz.U. 2025 poz. 775 t.j. z 21.05.2025 (poprzedni t.j.: Dz.U. 2024 poz. 361)
**Data weryfikacji online:** 2026-06-05
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

⭐ SAMOCHODY OSOBOWE — ograniczenie 50%/100% (art. 86a) I użytek
  mieszany/prywatny (w tym ryczałt PIT pracownika) — PEŁNE opracowanie
  w `mod-odliczenia-uzytek-mieszany-firma-prywatny-KUP.md` (dodane
  2026-07-21), NIE duplikuj tutaj.

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
