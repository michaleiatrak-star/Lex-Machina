# Kasy rejestrujące (fiskalne) — moduł podstawowy
v1.0.0 (dodany 2026-08-11 — audyt pokrycia tematów rachunkowo-księgowych)

Zweryfikowano 2026-08-11 (ZASADA 14):
- **Rząd 2A:** prawo.pl, sip.lex.pl (metryka art. 111 ustawy o VAT,
  Dz.U. 2025 poz. 775 t.j.)
- **Rząd 2B:** poradnikprzedsiebiorcy.pl (×3), streamsoft.pl,
  wfirma.pl, kasafiskalna.pl, infor.pl
- **Rząd 3 (potwierdzenie zbieżności):** mico.pl, salesystem.pl,
  taxmachine.pl, artbiznes.pl

⚠️⚠️⚠️ ZNALEZISKO AUDYTOWE — NAJPOWAŻNIEJSZE Z TEJ SESJI: fraza „kasa
fiskalna" / „kasa rejestrująca" NIE WYSTĘPOWAŁA ANI RAZ w CAŁYM systemie
(grep po wszystkich 30+ skillach, `*.md`). Dziedzina dotycząca
praktycznie KAŻDEGO podmiotu sprzedającego konsumentom — fryzjer,
gastronomia, sklep, warsztat, gabinet — miała pokrycie ZEROWE, mimo że
sąsiednie tematy (VAT, akcyza, PKPiR) były opracowane szeroko.

---

## 1. PODSTAWA PRAWNA

```
⭐ OBOWIĄZEK USTAWOWY: art. 111 ust. 1 ustawy z 11 marca 2004 r. o
  podatku od towarów i usług — t.j. Dz.U. 2025 poz. 775 (numer zgodny z
  MAPA-AKTOW.md DR-06, VER 2026-07-02g)

⭐ ROZPORZĄDZENIE O ZWOLNIENIACH: rozporządzenie MF z 17 grudnia 2024 r.
  w sprawie zwolnień z obowiązku prowadzenia ewidencji sprzedaży przy
  zastosowaniu kas rejestrujących
  → ⚠️⚠️ ROZBIEŻNOŚĆ ŹRÓDŁOWA NIEROZSTRZYGNIĘTA W TEJ SESJI (ZASADA 13):
    większość źródeł (streamsoft.pl, mico.pl — zgodnie) podaje
    **Dz.U. 2024 poz. 1902**; jedno źródło (taxmachine.pl, Rząd 3)
    podaje **Dz.U. 2024 poz. 1949**. NIE ROZSTRZYGNIĘTO, który numer
    jest prawidłowy — ⛔ ZWERYFIKUJ W ISAP PRZED POWOŁANIEM W PIŚMIE.
    NIE zgadywano. Numer 1902 ma przewagę liczby zgodnych źródeł, co
    NIE jest dowodem poprawności (patrz ZASADA 8 — weryfikuj NUMER
    niezależnie od nazwy)

⭐ ROZPORZĄDZENIE TECHNICZNE: rozporządzenie MF z 25 czerwca 2025 r. w
  sprawie kas rejestrujących (Dz.U. 2025 poz. 998) — fiskalizacja,
  wymagania techniczne, przeglądy
  → ⚠️ [NIEWERYFIKOWANE] — pojedyncze źródło Rządu 3 (taxmachine.pl),
    brak potwierdzenia w Rzędzie 1/2A. NIE POWOŁUJ tego numeru bez
    sprawdzenia w ISAP
```

## 2. ⭐⭐ ZAKRES PODMIOTOWY — KTO MUSI EWIDENCJONOWAĆ

```
⭐ REGUŁA (art. 111 ust. 1): obowiązek dotyczy podatników dokonujących
  sprzedaży na rzecz:
  → OSÓB FIZYCZNYCH NIEPROWADZĄCYCH DZIAŁALNOŚCI GOSPODARCZEJ, oraz
  → ROLNIKÓW RYCZAŁTOWYCH

⭐⭐ KLUCZOWE NIEPOROZUMIENIE DO WYPROSTOWANIA: obowiązek NIE zależy od
  bycia czynnym podatnikiem VAT. Podatnik ZWOLNIONY z VAT (art. 113)
  MOŻE mieć obowiązek kasy — to DWA NIEZALEŻNE reżimy. Zwolnienie
  podmiotowe z VAT ≠ zwolnienie z kasy

⭐ SPRZEDAŻ B2B (na rzecz firm) — co do zasady POZA obowiązkiem
  kasowym; dokumentowana fakturą
```

## 3. ⭐⭐⭐ ZWOLNIENIA — TRZY WARSTWY, KTÓRE TRZEBA CZYTAĆ ŁĄCZNIE

```
WARSTWA 1 — ZWOLNIENIE PODMIOTOWE (limit obrotu), § 3 ust. 1 pkt 1
  rozporządzenia:
  → LIMIT: 20 000 zł obrotu na rzecz osób fizycznych nieprowadzących
    działalności i rolników ryczałtowych w POPRZEDNIM roku podatkowym
  → OBOWIĄZUJE nie dłużej niż do 31 GRUDNIA 2027 r.
  → ⭐ ROZPOCZYNAJĄCY SPRZEDAŻ W TRAKCIE ROKU: limit liczony W PROPORCJI
    do okresu wykonywania czynności
    wzór: 20 000 zł × (liczba dni prowadzenia sprzedaży do końca roku /
    liczba dni w roku podatkowym)
  → ⚠️ NAJCZĘSTSZY BŁĄD KLIENTA: przekonanie, że limit ZAWSZE wynosi
    pełne 20 000 zł. Przy starcie w połowie roku realny limit to ok.
    połowa tej kwoty

WARSTWA 2 — ZWOLNIENIA PRZEDMIOTOWE (załącznik do rozporządzenia):
  katalog czynności i towarów zwolnionych niezależnie od obrotu —
  m.in. przy płatnościach w całości bezgotówkowych, na rachunek
  bankowy, z udokumentowaniem, jakiej transakcji dotyczyły
  ⚠️ [KONKRETNE POZYCJE ZAŁĄCZNIKA — DO WERYFIKACJI W ISAP przy
  konkretnej sprawie; potwierdzono ISTNIENIE i mechanizm załącznika,
  nie jego pełną treść]

WARSTWA 3 — ⛔ KATALOG BEZWZGLĘDNY (§ 4) — WYŁĄCZA WSZYSTKIE ZWOLNIENIA:
  ⭐⭐⭐ MECHANIZM KRYTYCZNY: sprzedaż CHOĆBY JEDNEJ pozycji z katalogu
  § 4 powoduje utratę prawa do WSZYSTKICH zwolnień — także limitu
  20 000 zł. Obrót 500 zł rocznie nie chroni, jeśli przedmiot sprzedaży
  jest w § 4
  → Kategorie sygnalizowane zgodnie przez źródła Rządu 2B/3 (usługi
    fryzjerskie, kosmetyczne i kosmetologiczne; wstęp do wesołych
    miasteczek i na dyskoteki; sprzedaż przez automaty; e-papierosy,
    wyroby węglowe, alkohol niespożywczy — te ostatnie z okresami
    przejściowymi)
  ⚠️ [PEŁNY KATALOG § 4 — DO ODCZYTANIA Z ISAP przy każdej sprawie.
  Katalog jest zmieniany co edycję rozporządzenia i to najczęstsze
  źródło błędnej porady]
```

## 4. ⭐⭐ SANKCJE ZA BRAK EWIDENCJONOWANIA

```
(A) ⭐ SANKCJA VAT — art. 111 ust. 2 ustawy o VAT: utrata prawa do
  obniżenia podatku należnego o kwotę stanowiącą równowartość
  **30% podatku naliczonego** przy nabyciu towarów i usług

  ⭐⭐ OGRANICZENIE ZAKRESU — UCHWAŁA NSA z 16 listopada 1998 r.,
    sygn. **FPS 7/98**: sankcja dotyczy WYŁĄCZNIE tej części obrotu,
    która PODLEGA ewidencjonowaniu przy zastosowaniu kas — nie całości
    zakupów podatnika
    → ⚠️ [WERYFIKUJ SYGNATURĘ I AKTUALNOŚĆ TEZY w orzeczenia.nsa.gov.pl
      przed powołaniem w piśmie — uchwała z 1998 r., zapadła na gruncie
      POPRZEDNIEJ ustawy o VAT z 1993 r.; jej aktualność pod rządami
      ustawy z 2004 r. wymaga sprawdzenia, mimo że źródła Rządu 2B
      powołują ją jako nadal miarodajną. To jest dokładnie ten wzorzec
      ryzyka, przed którym ostrzega PRAWO-HARDGATE]

(B) ODPOWIEDZIALNOŚĆ KARNOSKARBOWA — niewydanie paragonu / prowadzenie
  sprzedaży z pominięciem kasy: KKS
  ⚠️ [KONKRETNY PRZEPIS KKS DO USTALENIA — art. 62 KKS dotyczy
  dokumentowania; NIE POTWIERDZONO w tej sesji, który ustęp obejmuje
  paragon. Sprawdź w dr-03/mod-KKS-karny-skarbowy-i-AML.md oraz ISAP]

(C) ⚠️ TWIERDZENIE ODRZUCONE JAKO NIEPOTWIERDZONE: jedno źródło Rządu 3
  wskazywało art. 112b ustawy o VAT jako „sankcję za brak kasy".
  Art. 112b dotyczy dodatkowego zobowiązania podatkowego w VAT ogólnie —
  powiązanie go wprost z kasami NIE zostało potwierdzone w żadnym
  źródle Rządu 1/2A. NIE UŻYWAJ tego powiązania bez weryfikacji
```

## 5. ULGA NA ZAKUP KASY — I JEJ UTRATA

```
⭐ PODSTAWA: art. 111 ust. 4 ustawy o VAT
⭐ WYSOKOŚĆ: 90% ceny zakupu netto, NIE WIĘCEJ NIŻ 700 zł na kasę
⭐ WARUNKI (łącznie):
  → rozpoczęcie ewidencjonowania w OBOWIĄZUJĄCYCH terminach przy użyciu
    kas ONLINE (kasy, o których mowa w art. 111 ust. 6a)
  → albo — przy braku obowiązku — dobrowolne rozpoczęcie ewidencji na
    kasie online, jeżeli podatnik NIE UŻYWAŁ wcześniej kas
  → posiadanie faktury i dowodu zapłaty całości należności
  → zakup nie później niż w terminie 6 miesięcy od dnia rozpoczęcia
    ewidencjonowania

⭐ ROZLICZENIE:
  → czynny podatnik VAT — wykazanie ulgi w pliku JPK_V7
  → podatnik zwolniony z VAT (art. 113 ust. 1 i 9) — WNIOSEK do
    naczelnika US (art. 111 ust. 5), składany najwcześniej w miesiącu
    następującym po miesiącu rozpoczęcia ewidencji; wniosek wskazuje
    kwotę i numer rachunku bankowego

⭐⭐ OBOWIĄZEK ZWROTU ULGI (art. 111 ust. 6) — PUŁAPKA PRZY LIKWIDACJI
  DZIAŁALNOŚCI: podatnik zwraca odliczone/zwrócone kwoty, jeżeli w
  okresie **3 LAT** od dnia rozpoczęcia ewidencjonowania:
  → zakończy działalność gospodarczą, LUB
  → nie podda kas obowiązkowemu przeglądowi technicznemu w terminie,
    LUB
  → naruszy obowiązki dot. kas online (m.in. brak połączenia z
    Centralnym Repozytorium Kas — art. 111 ust. 3a pkt 12 / ust. 3ab)
  → utratę ulgi wykazuje się w JPK_V7
  ⭐ RYZYKO PRAKTYCZNE: szybka likwidacja działalności po skorzystaniu
    z ulgi + niewyrejestrowana kasa = argument organu o niespełnieniu
    warunku 3-letniego używania
```

## 6. POWIĄZANIA OPERACYJNE

```
⭐ TERMINAL PŁATNICZY: art. 19a ustawy z 6 marca 2018 r. — Prawo
  przedsiębiorców (obowiązek od 1.01.2022)
  ⚠️ [DO WERYFIKACJI W ISAP — pojedyncze źródło Rządu 3; sprawdź też,
  czy przepis nie został zmieniony/uchylony]
⭐ PARAGON Z NIP DO 450 zł = FAKTURA UPROSZCZONA: art. 106e ust. 5 pkt 3
  ustawy o VAT
  ⚠️ [DO WERYFIKACJI — pojedyncze źródło Rządu 3; kwota i przepis
  wymagają potwierdzenia w ISAP, zwłaszcza wobec zmian KSeF 2026]
⭐ EWIDENCJA SPRZEDAŻY BEZ KASY: podatnicy zwolnieni z kasy prowadzą
  ewidencję sprzedaży za dany dzień → mod-PKPiR-ewidencje-uproszczone.md
⭐ WPŁYWY ZE SPRZEDAŻY DETALICZNEJ — TERMIN PRZECHOWYWANIA DOWODÓW:
  art. 74 ust. 2 pkt 3 u.o.r. → mod-ustawa-rachunkowosci.md, sekcja 5b
```

---

## CROSS-REFERENCJE
- VAT, JPK_V7, KSeF → `mod-VAT-podatek-od-towarow-i-uslug.md`
- Ewidencje uproszczone, PKPiR → `mod-PKPiR-ewidencje-uproszczone.md`
- Kontrola, ujawnienie nieewidencjonowanej sprzedaży →
  `mod-KAS-kontrola-celno-skarbowa.md`
- Sankcje karnoskarbowe → `dr-03-prawo-karne-wykroczenia-egzekucja/
  modules/mod-KKS-karny-skarbowy-i-AML.md`
- Limit płatności gotówkowych → `mod-limit-platnosci-gotowkowych.md`
