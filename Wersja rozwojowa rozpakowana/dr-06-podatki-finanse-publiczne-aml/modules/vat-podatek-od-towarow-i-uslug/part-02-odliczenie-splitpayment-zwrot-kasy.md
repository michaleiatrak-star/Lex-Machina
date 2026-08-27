# VAT — część 2: odliczenie, split payment, zwrot różnicy podatku, kasy fiskalne

> Część modułu `mod-VAT-podatek-od-towarow-i-uslug.md` (podział
> 2026-08-20, naprawa F-78, priorytet 3). Alerty legislacyjne [PKWiU
> 2025, KSeF obowiązkowy], CORE i INTAKE — zobacz plik nadrzędny
> (indeks). Ten plik ładowany WYŁĄCZNIE na żądanie konkretnego
> zagadnienia przez indeks nadrzędny.

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

✅ [VER: lexlege.pl — pełny tekst art. 87 ustawy o VAT, Dz.U. 2025 poz. 775
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

