# PKPiR i ewidencje uproszczone — moduł podstawowy
v1.0.0 (dodany 2026-08-11 — audyt pokrycia tematów rachunkowo-księgowych)

Zweryfikowano 2026-08-11 (ZASADA 14, gradacja źródeł):
- **Rząd 1:** isap.sejm.gov.pl (metryki WDU20190002544, WDU20240001744,
  WDU20250001299), api.sejm.gov.pl (tekst Dz.U. 2025 poz. 1299 — dostęp
  przez snippet wyszukiwarki, bezpośredni `web_fetch` = ROBOTS_DISALLOWED)
- **Rząd 2A:** prawo.pl (×2), lex.pl, pit.pl, inforlex.pl
- **Rząd 2B:** infor.pl, przepisy.gofin.pl, doradca.lublin.pl,
  poradnikksiegowego.pl
- **Rząd 3 (tylko jako potwierdzenie zbieżności):** firmino.pl,
  biurorachunkowe.kielce.pl

⚠️⚠️ ZNALEZISKO AUDYTOWE: PKPiR — podstawowa forma ewidencji dla
WIĘKSZOŚCI mikro- i małych firm w Polsce — NIE MIAŁA w systemie
samodzielnego modułu. Występowała WYŁĄCZNIE jako wzmianka w
`mod-ustawa-rachunkowosci.md` (kontekst sankcji KKS) i jednozdaniowo w
`mod-ustawa-ryczalt-przychody.md`. Skutek: system znał SANKCJĘ za wadliwe
prowadzenie PKPiR, nie znając ZASAD jej prowadzenia.

---

## 1. PODSTAWA PRAWNA — ⭐⭐ ZMIANA STANU PRAWNEGO OD 1.01.2026

```
⭐⭐⭐ AKT OBOWIĄZUJĄCY: Rozporządzenie Ministra Finansów i Gospodarki
  z 6 września 2025 r. w sprawie prowadzenia podatkowej księgi
  przychodów i rozchodów — Dz.U. 2025 poz. 1299
  → WEJŚCIE W ŻYCIE: 1 stycznia 2026 r.
  → ISAP: WDU20250001299 (metryka potwierdzona)

⛔ AKT UCHYLONY — NIE CYTOWAĆ JAKO OBOWIĄZUJĄCEGO: rozporządzenie MF
  z 23 grudnia 2019 r. (Dz.U. 2019 poz. 2544, ostatnia zmiana Dz.U.
  2024 poz. 1744) — UTRACIŁO MOC z dniem 1.01.2026
  ⚠️ TO JEST TYPOWA PUŁAPKA: większość materiałów w sieci sprzed 2026 r.
  odsyła do poz. 2544. Przy sprawach dotyczących lat 2020-2025 stan
  prawny z poz. 2544 POZOSTAJE właściwy (zasada tempus regit actum dla
  obowiązków ewidencyjnych danego roku) — przy 2026 r. i późniejszych
  właściwa jest poz. 1299

DELEGACJA USTAWOWA: art. 24a ust. 7 ustawy o PIT
OBOWIĄZEK PROWADZENIA: art. 24a ust. 1 ustawy o PIT — osoby fizyczne,
  przedsiębiorstwa w spadku, spółki cywilne osób fizycznych, spółki
  cywilne osób fizycznych i przedsiębiorstwa w spadku, spółki jawne
  osób fizycznych, spółki partnerskie — prowadzą PKPiR ALBO księgi
  rachunkowe
```

## 2. ⭐⭐⭐ PRÓG ROZGRANICZAJĄCY PKPiR / PEŁNE KSIĘGI — HISTORIA ZMIANY

(uzupełnienie luki #20 z mapy pokrycia w `mod-ustawa-rachunkowosci.md`)

```
⭐ STAN OBECNY: 2 500 000 EURO (art. 2 ust. 1 pkt 2 u.o.r.)
⭐ STAN POPRZEDNI: 2 000 000 EURO
⭐ AKT ZMIENIAJĄCY: ustawa z 6 grudnia 2024 r. o zmianie ustawy o
  rachunkowości, ustawy o biegłych rewidentach, firmach audytorskich
  oraz nadzorze publicznym oraz niektórych innych ustaw —
  **Dz.U. 2024 poz. 1863**
⭐ OD KIEDY: do roku obrotowego rozpoczynającego się PO 31 grudnia 2024 r.
  (czyli praktycznie: od 1.01.2025 dla roku = kalendarzowemu)

⭐⭐ DRUGA, MNIEJ ZNANA ZMIANA W TEJ SAMEJ NOWELIZACJI — ZMIENIŁA SIĘ
  NIE TYLKO KWOTA, ALE I SPOSÓB LICZENIA: z podstawy limitu WYŁĄCZONO
  przychody z operacji finansowych oraz ze sprzedaży materiałów. Liczą
  się WYŁĄCZNIE przychody netto ze sprzedaży TOWARÓW i PRODUKTÓW w
  rozumieniu art. 3 pkt 30a u.o.r. (z uwzględnieniem dotacji, opustów,
  rabatów; bez VAT i innych podatków bezpośrednio związanych z obrotem)
  → ⭐ SKUTEK PRAKTYCZNY: podmiot, który przed 2025 r. przekraczał próg
    dzięki przychodom finansowym lub sprzedaży materiałów, MOŻE dziś
    być poniżej progu MIMO identycznej skali działalności
  (potwierdzone: rachunkowosc.com.pl — pismo Stowarzyszenia Księgowych
  w Polsce, Rząd 2A/2B)

⭐ PRZELICZENIE NA ZŁOTE: średni kurs EUR NBP na PIERWSZY DZIEŃ ROBOCZY
  PAŹDZIERNIKA roku poprzedzającego rok obrotowy
  → dla 2025 r.: kurs 4,2846 zł → próg 10 711 500 zł
  → dla 2026 r.: ⚠️ [DO WERYFIKACJI PRZED CYTOWANIEM] źródła Rządu 2B/3
    podają 10 646 500 zł — kwota NIE potwierdzona w źródle Rządu 1;
    PRZELICZ SAMODZIELNIE wg tabeli NBP z 1.10.2025 przed użyciem w
    piśmie. Sam PRÓG W EURO (2,5 mln) jest niesporny — zmienność wynika
    WYŁĄCZNIE z kursu, nie ze zmiany przepisu

⭐ WYBÓR DOBROWOLNY: mimo nieprzekroczenia progu można wybrać pełne
  księgi — wymaga zawiadomienia naczelnika US; może być złożone przez
  CEIDG (art. 2 ust. 2 u.o.r.)
```

## 3. ⭐⭐⭐ OBOWIĄZKOWA POSTAĆ ELEKTRONICZNA I JPK_PKPIR — HARMONOGRAM

```
PODSTAWA: art. 24a ust. 1e ustawy o PIT w brzmieniu od 1.01.2026
PRZEPIS PRZEJŚCIOWY: art. 66 ust. 1 ustawy zmieniającej z 29 października
  2021 r. (Dz.U. 2021 poz. 2105 ze zm.)

⭐ HARMONOGRAM (dwie tury):
  → OD 1.01.2026 — podatnicy PIT obowiązani do przesyłania ewidencji
    JPK_VAT (czynni podatnicy VAT składający JPK_V7M). Pierwsze pliki
    za rok 2026, składane z zeznaniem rocznym PIT za 2026 (co do zasady
    do 30 kwietnia 2027 — art. 45 ust. 1 ustawy o PIT)
  → OD 1.01.2027 — pozostali podatnicy PIT, w tym rozliczający VAT
    kwartalnie (JPK_V7K) i opodatkowani ryczałtem

⭐ DWIE STRUKTURY, NIE JEDNA:
  → JPK_PKPIR — sama podatkowa księga przychodów i rozchodów
  → JPK_ST — ewidencja środków trwałych oraz wartości niematerialnych
    i prawnych (dla podmiotów składających JPK_PKPIR)
  ⚠️ NIE MYLIĆ z JPK_KR_PD / JPK_ST_KR — to struktury dla podmiotów
    prowadzących PEŁNE KSIĘGI (patrz: mod-JPK-ksiegi-elektroniczne-
    e-sprawozdania.md)

⭐ FORMA PAPIEROWA — PRAKTYCZNIE ZLIKWIDOWANA: podstawowym sposobem
  prowadzenia księgi jest użycie programów komputerowych. Papierowo
  od 1.01.2026 mogą prowadzić księgę WYŁĄCZNIE wąskie kategorie —
  wg zgodnych źródeł Rządu 2A (prawo.pl): osoby wykonujące działalność
  na podstawie umów agencyjnych i umów na warunkach zlecenia zawartych
  na podstawie odrębnych przepisów oraz duchowni
  ⚠️ [ZAKRES WYJĄTKU DO POTWIERDZENIA W ISAP przed powołaniem w piśmie —
  potwierdzony w Rzędzie 2A, nie w tekście źródłowym]

⭐ ZNIESIONE UPROSZCZENIE: od 1.01.2026 zlikwidowano uproszczoną księgę
  dla rolników prowadzących gospodarstwo rolne bez zatrudnienia
  pracowników (limit 10 000 zł przychodu rocznie) — uproszczony wzór
  usunięty z nowego rozporządzenia
```

## 4. ⭐⭐ NOWY WZÓR KSIĘGI — 19 KOLUMN ZAMIAST 17

```
⭐ ZMIANA STRUKTURALNA: dotychczasowy wzór miał 17 kolumn, nowy ma 19
⭐ NAJWAŻNIEJSZA NOWA POZYCJA — KOLUMNA NR 3: numer identyfikujący
  fakturę wystawioną przy użyciu Krajowego Systemu e-Faktur (KSeF)
  → ⭐⭐ TO JEST SPOIWO MIĘDZY KSeF A EWIDENCJĄ PODATKOWĄ: od 2026 r.
    numer KSeF przestaje być wyłącznie atrybutem faktury, a staje się
    elementem WPISU DO KSIĘGI — czyli przedmiotem kontroli rzetelności
    księgi, nie tylko poprawności faktury
  → powiązanie: mod-VAT-podatek-od-towarow-i-uslug.md (sekcja KSeF)

⭐ POZOSTAŁE ZMIANY sygnalizowane zgodnie przez źródła Rządu 2A/2B:
  zmiana terminu księgowania kosztów, zmiany redakcyjne w definicji
  księgi rzetelnej i niewadliwej, zmiany w zasadach dokumentowania
  ⚠️ [SZCZEGÓŁY POSZCZEGÓLNYCH PARAGRAFÓW — DO WERYFIKACJI W ISAP przy
  konkretnej sprawie; w tej sesji potwierdzono FAKT zmian, nie pełną
  treść każdego przepisu]
```

## 5. ⭐⭐⭐ RZETELNOŚĆ I NIEWADLIWOŚĆ KSIĘGI — OŚ SPORU Z ORGANEM

```
⭐ PRZEPIS: § 4 nowego rozporządzenia (Dz.U. 2025 poz. 1299)
  — ODPOWIEDNIK § 10 starego rozporządzenia (Dz.U. 2019 poz. 2544).
  ⚠️ PRZY SPRAWACH Z LAT 2020-2025 POWOŁUJ § 10 STAREGO ROZPORZĄDZENIA,
  NIE § 4 NOWEGO — to najczęstszy błąd redakcyjny w pismach na
  przełomie stanów prawnych

⭐⭐ ROZRÓŻNIENIE, KTÓRE DECYDUJE O KWALIFIKACJI KARNOSKARBOWEJ
  (art. 53 § 22-23 KKS — patrz mod-ustawa-rachunkowosci.md, sekcja
  sankcji, oraz dr-03/mod-KKS-karny-skarbowy-i-AML.md):
  → KSIĘGA NIERZETELNA = prowadzona NIEZGODNIE ZE STANEM RZECZYWISTYM
    (zdarzenia, których nie było; zdarzenia pominięte; kwoty inne niż
    rzeczywiste) — kategoria POWAŻNIEJSZA, bliższa fałszerstwu
  → KSIĘGA WADLIWA = prowadzona niezgodnie z PRZEPISAMI (uchybienia
    formalne) — kategoria LŻEJSZA, dotyczy FORMY, nie TREŚCI
  → ⭐ ZNACZENIE PROCESOWE: nierzetelność księgi otwiera organowi drogę
    do NIEUZNANIA księgi za dowód i szacowania podstawy opodatkowania
    (art. 193 i 23 Ordynacji podatkowej — ⚠️ zweryfikuj brzmienie w
    ISAP przed powołaniem); wadliwość NIEISTOTNA dla rozliczenia co do
    zasady takiego skutku nie wywołuje

⭐ TRZECIA KATEGORIA — NIEPROWADZENIE (art. 60 § 1 KKS): prowadzenie
  PKPiR w sytuacji, gdy wymagane były PEŁNE KSIĘGI (przekroczony próg
  2,5 mln EUR), jest traktowane jako NIEPROWADZENIE właściwej księgi,
  a NIE jako jej wadliwe prowadzenie — patrz mod-ustawa-rachunkowosci.md
```

## 6. EWIDENCJE TOWARZYSZĄCE

```
⭐ EWIDENCJA SPRZEDAŻY: podatnicy niestosujący kas rejestrujących
  (odesłanie do art. 111 ust. 1 ustawy o VAT) są obowiązani prowadzić
  ewidencję sprzedaży za dany dzień — nie później niż PRZED dokonaniem
  sprzedaży w dniu następnym
⭐ ZAŁOŻENIE KSIĘGI: na dzień 1 stycznia roku podatkowego LUB na dzień
  rozpoczęcia działalności w trakcie roku (zasada niezmieniona)
⭐ EWIDENCJA ŚRODKÓW TRWAŁYCH I WNiP: od 1.01.2026 prowadzona przy
  użyciu programów komputerowych obligatoryjnie przez podatników
  objętych JPK_VAT (art. 24a ust. 1e PIT); struktura JPK_ST
⭐ BIURO RACHUNKOWE: zasady prowadzenia księgi stosuje się odpowiednio,
  gdy księgę prowadzi w imieniu podatnika biuro rachunkowe
  → wymogi wobec samego biura: mod-ustawa-rachunkowosci.md, sekcja 5c
    (usługowe prowadzenie ksiąg, rozdz. 8a u.o.r.)
```

## 7. RYCZAŁT — EWIDENCJA PRZYCHODÓW (odesłanie)

```
Ewidencja przychodów przy ryczałcie od przychodów ewidencjonowanych
oraz struktura JPK_EWP → mod-ustawa-ryczalt-przychody.md
⚠️ NIE MYLIĆ: ryczałtowiec NIE prowadzi PKPiR — prowadzi EWIDENCJĘ
PRZYCHODÓW (bez kosztów). To odrębny reżim, odrębna struktura JPK
```

---

## CROSS-REFERENCJE
- Pełne księgi rachunkowe, próg, zasady rachunkowości, sankcje →
  `mod-ustawa-rachunkowosci.md`
- JPK_KR_PD / JPK_ST_KR / e-sprawozdania →
  `mod-JPK-ksiegi-elektroniczne-e-sprawozdania.md`
- Kasy rejestrujące, ewidencja sprzedaży detalicznej →
  `mod-kasy-rejestrujace-fiskalizacja.md`
- KSeF, faktury → `mod-VAT-podatek-od-towarow-i-uslug.md`
- Szacowanie podstawy opodatkowania, kontrola →
  `mod-OP-ordynacja-podatkowa.md`, `mod-KAS-kontrola-celno-skarbowa.md`
- Sankcje KKS → `dr-03-prawo-karne-wykroczenia-egzekucja/modules/
  mod-KKS-karny-skarbowy-i-AML.md`
