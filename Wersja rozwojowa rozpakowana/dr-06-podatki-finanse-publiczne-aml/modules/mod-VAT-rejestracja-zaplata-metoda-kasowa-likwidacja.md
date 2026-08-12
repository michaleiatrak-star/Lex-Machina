# Moduł — VAT: rejestracja i wykreślenie (Dział X rozdz. 1), zapłata podatku (Dział X rozdz. 4), metoda kasowa małego podatnika (art. 21), likwidacja działalności i remanent (art. 14)

> **Akt:** ustawa z 11.03.2004 o podatku od towarów i usług — **t.j. Dz.U. 2025 poz. 775**
> (obwieszczenie Marszałka Sejmu z 21.05.2025). ⚠️ NOWELIZACJE PO t.j.: Dz.U. 2025 poz.
> 894, 896, 1203, 1811; Dz.U. 2026 poz. 507, 846 — sprawdź przed każdym powołaniem.
>
> ⛔ **HARD GATE — patrz `shared/PRAWO-HARDGATE.md`.** Żaden przepis, próg, limit,
> termin ani stawka z tego modułu NIE jest podstawą rozliczenia bez weryfikacji
> w ISAP na datę czynności. Limity kwotowe (mały podatnik, ulga na kasę) zmieniają
> się **co roku** — kwoty poniżej są punktem startowym, nie źródłem.
>
> ⚠️ **PRZYPOMNIENIE GLOBALNE RODZINY mod-VAT-*:** termin podstawowy zwrotu
> różnicy podatku wynosi **40 dni** (art. 87 ust. 2 zd. 1), **NIE 60**.

**Utworzony 2026-08-12** (audyt pokrycia VAT, iteracja VI — domknięcie luk P1
z mapy pokrycia działami: Dział X rozdz. 1 i 4, Dział IV rozdz. 3, Dział II rozdz. 4).

---

## 6a. ⭐⭐⭐ REJESTRACJA VAT I WYKREŚLENIE Z REJESTRU (art. 96–98)

> **Dotąd w systemie: aneks ~10 linii w `mod-VAT-ewidencja-deklaracje.md`.**
> Brakowało KATALOGU przesłanek wykreślenia i — co ważniejsze procesowo —
> ŚCIEŻKI PRZYWRÓCENIA. Wykreślenie z rejestru VAT to jeden z najdotkliwszych
> skutków w praktyce (kontrahenci tracą prawo do odliczenia, biała lista
> pokazuje brak statusu), a podatnicy zwykle dowiadują się o nim za późno.

```
⭐ ZGŁOSZENIE REJESTRACYJNE (art. 96 ust. 1): VAT-R, PRZED dniem wykonania
  pierwszej czynności opodatkowanej. Statusy: „podatnik VAT czynny" /
  „podatnik VAT zwolniony" (art. 96 ust. 4).

⭐ art. 96 ust. 6 — ZAPRZESTANIE działalności → zgłoszenie VAT-Z.
  ⚠️ TERMIN 7 DNI od dnia zaprzestania czynności opodatkowanych.
  Zgłoszenie VAT-Z jest dla organu PODSTAWĄ wykreślenia z rejestru.
  ⭐ SPRZĘŻENIE: VAT-Z to TYLKO strona rejestrowa — obowiązek remanentowy
  z art. 14 jest ODRĘBNY (patrz sekcja 6d). Złożenie VAT-Z nie zwalnia
  ze spisu z natury.
```

### ⭐⭐⭐ WYKREŚLENIE Z URZĘDU — DWIE ODRĘBNE PODSTAWY (nie mylić)

```
⛔ art. 96 ust. 9 — wykreślenie BEZ ZAWIADAMIANIA podatnika, m.in. gdy:
  pkt 1 — podatnik NIE ISTNIEJE
  pkt 2 — mimo UDOKUMENTOWANYCH prób BRAK MOŻLIWOŚCI KONTAKTU
          z podatnikiem albo jego pełnomocnikiem
  pkt 3 — dane w zgłoszeniu rejestracyjnym NIEZGODNE Z PRAWDĄ
  pkt 4 — podatnik/pełnomocnik nie stawia się na wezwania
  pkt 5 — informacja o zamiarze wykorzystania działalności banków/SKOK
          do celów mających związek z WYŁUDZENIAMI SKARBOWYMI
  ⚠️ Zweryfikuj PEŁNĄ, aktualną redakcję ust. 9 w ISAP — katalog był
  wielokrotnie nowelizowany.

⛔ art. 96 ust. 9a — wykreślenie z INNYCH przesłanek, m.in.:
  pkt 1 — ZAWIESZENIE działalności na co najmniej 6 KOLEJNYCH MIESIĘCY
          ⭐ WYJĄTEK praktyczny: jeżeli w okresie zawieszenia podatnik
          wykonuje czynności opodatkowane, MUSI zawiadomić naczelnika US
          i wskazać okres ich wykonywania
  pkt 2 — NIEZŁOŻENIE deklaracji za kolejne okresy (mimo obowiązku)
  pkt 3 — złożenie przez 6 KOLEJNYCH MIESIĘCY lub 2 KOLEJNE KWARTAŁY
          deklaracji, w których NIE WYKAZANO sprzedaży/nabyć z kwotami
          podatku do odliczenia
          ⭐ KONTRA: art. 96 ust. 9e — NIE wykreśla się, jeżeli brak
          wykazania wynika ze SPECYFIKI prowadzonej działalności
          (to jest ARGUMENT OBRONNY nr 1 — np. faza inwestycyjna,
          sezonowość, projekt długoterminowy)
  pkt 4 — wystawianie FAKTUR/faktur korygujących dokumentujących
          czynności, które NIE ZOSTAŁY DOKONANE
```

### ⭐⭐⭐ PRZYWRÓCENIE ZAREJESTROWANIA — ŚCIEŻKA OBRONY

```
⭐⭐⭐ art. 96 ust. 9h — WNIOSEK o przywrócenie:
  □ TERMIN: **2 MIESIĄCE od dnia wykreślenia** ⚠️ TERMIN KLUCZOWY
  □ ZAKRES: dotyczy wykreślonych na podstawie ust. 9 pkt 1–4
    ORAZ ust. 9a pkt 2
  □ SKUTEK: przywrócenie jako podatnik VAT CZYNNY **BEZ konieczności
    ponownego składania VAT-R**
  □ WARUNKI: podatnik UDOWODNI, że prowadzi opodatkowaną działalność
    gospodarczą, a przy nieskładaniu deklaracji — najpóźniej WRAZ
    z wnioskiem złoży BRAKUJĄCE DEKLARACJE

⭐ art. 96 ust. 9ha — stosuje się ODPOWIEDNIO, gdy w deklaracjach nie
  wykazano sprzedaży/nabyć, a wynika to ze SPECYFIKI działalności
  (ścieżka dla wykreślenia z ust. 9a pkt 3)

⭐ art. 96 ust. 9j — ścieżka dla wykreślenia z ust. 9 pkt 5 (wyłudzenia):
  przywrócenie, gdy podatnik udowodni, że jego działania NIE są związane
  z wyłudzeniami skarbowymi, albo wyjdą na jaw inne okoliczności/dowody,
  z których wynika brak takiego zamiaru

⛔ art. 96 ust. 9 pkt 5 → wykreślenie ma charakter kwalifikowany —
  ścieżka przywrócenia jest ODRĘBNA (ust. 9j), NIE ust. 9h
```

### ⚖️ CHARAKTER PRAWNY CZYNNOŚCI — ISTOTNE DLA WYBORU ŚRODKA ZASKARŻENIA

```
⭐⭐⭐ Linia sądowoadministracyjna: wykreślenie z urzędu na podstawie
  art. 96 ust. 9 jest traktowane jako **CZYNNOŚĆ MATERIALNO-TECHNICZNA**,
  a nie decyzja — organ nie wydaje decyzji ani postanowienia
  (m.in. WSA w Łodzi, I SA/Łd 190/20, wyrok prawomocny).

⛔ KONSEKWENCJA PROCESOWA — TO JEST PUŁAPKA:
  skoro to nie decyzja, to ŚRODKIEM nie jest odwołanie w trybie Ordynacji,
  lecz — w zależności od ustalonego charakteru czynności — SKARGA do WSA
  na inną czynność z zakresu administracji publicznej (art. 3 § 2 pkt 4
  PPSA), poprzedzona wyczerpaniem trybu z art. 52 PPSA.
  ⚠️ NIE przyjmuj tej kwalifikacji automatycznie — zweryfikuj AKTUALNĄ
  linię w `orzeczenia.nsa.gov.pl` NA DATĘ SPRAWY i skonsultuj z
  `dr-05` → `mod-PPSA` przed wyborem środka. Błąd w wyborze środka =
  utrata terminu.
  ⭐ RÓWNOLEGLE zawsze rozważ wniosek z art. 96 ust. 9h — jest szybszy,
  tańszy i nie wyklucza drogi sądowej.

⭐ Zmiana od SLIM VAT 3: organ ma obowiązek NIEZWŁOCZNEGO zawiadomienia
  o wykreśleniu — weryfikuj aktualną redakcję ust. 9a i n. w ISAP,
  bo praktyka przed nowelizacją była niejednolita.
```

### ⭐⭐ REJESTRACJA VAT-UE (art. 97) — ODRĘBNA OD REJESTRACJI KRAJOWEJ

```
⭐ art. 97 ust. 1 — obowiązek zawiadomienia naczelnika US o zamiarze
  rozpoczęcia WNT/WDT **PRZED dokonaniem pierwszej takiej czynności**
⭐ art. 97 ust. 10 — numer VAT UE (prefiks PL) — TEN numer jest
  używany m.in. w procedurze uproszczonej transakcji trójstronnej
  (art. 136 — patrz `mod-VAT-platnicy-egzekucja-kasy-trojstronne.md`)
⛔ art. 97 ust. 15 i n. — wykreślenie z rejestru VAT UE; wykreślenie
  na podstawie art. 96 ust. 6, 7, 7b–7bb i 8–9a jest RÓWNOZNACZNE
  z wykreśleniem jako podatnika VAT UE (przepisy art. 96 ust. 8b
  i 9g–9k stosuje się odpowiednio)
  ⭐ TO JEST EFEKT KASKADOWY: utrata statusu krajowego = utrata VAT-UE
  = utrata stawki 0% przy WDT (art. 42 ust. 1 pkt 3) → weryfikuj
  ŁĄCZNIE, nie osobno
⭐ WERYFIKACJA KONTRAHENTA UE: system VIES (ec.europa.eu) —
  ZAWSZE z zapisem daty i wyniku weryfikacji (dowód należytej staranności)
```

---

## 6b. ⭐⭐⭐ ZAPŁATA PODATKU (Dział X rozdz. 4, art. 103–105d)

> **Dotąd CAŁKOWICIE nieobecne w systemie** mimo że to podstawowy
> obowiązek każdego podatnika i punkt startowy naliczania odsetek.

```
⭐⭐⭐ ZASADA OGÓLNA (art. 103 ust. 1): podatnicy ORAZ podmioty wymienione
  w art. 108 (⭐ czyli także wystawcy PUSTYCH FAKTUR — patrz
  `mod-VAT-sankcje-bony-odliczenia.md` sekcja 4g) są obowiązani
  **BEZ WEZWANIA** naczelnika US obliczać i wpłacać podatek za okresy
  MIESIĘCZNE w terminie do **25. DNIA MIESIĄCA NASTĘPUJĄCEGO** po
  miesiącu powstania obowiązku podatkowego — z zastrzeżeniem ust. 1a–4
  oraz art. 33 (podatek w zgłoszeniu celnym) i art. 33b (deklaracja
  importowa).

⭐ art. 103 ust. 2 i n. — rozliczenie KWARTALNE (mali podatnicy):
  do 25. dnia miesiąca następującego po kwartale.
  ⚠️ Rozliczenie kwartalne ≠ metoda kasowa — to DWIE ODRĘBNE instytucje
  (patrz sekcja 6c).

⛔⛔ art. 103 ust. 5a — „PAKIET PALIWOWY": WNT PALIW SILNIKOWYCH —
  ⚠️ TERMIN DRASTYCZNIE SKRÓCONY: **5 DNI** od określonych zdarzeń
  (m.in. wprowadzenia towarów do składu podatkowego / przemieszczenia).
  ⭐ TO JEST NAJCZĘŚCIEJ PRZEOCZANY TERMIN W CAŁEJ USTAWIE — podatnik
  rozliczający się miesięcznie zakłada 25. dzień i wpada w zaległość
  z odsetkami po kilku dniach.
  ⭐ Zweryfikuj DOKŁADNE brzmienie ust. 5a–5d w ISAP (definicja paliw
  silnikowych odsyła do ustawy akcyzowej → `mod-ustawa-akcyzowa-i-clo-UCC`)
  ⭐ art. 17a — PŁATNIK podatku od WNT paliw silnikowych
  ⭐ art. 103a — wpłata kwoty z art. 103 ust. 5a MOŻE być dokonana
    na RACHUNEK VAT PŁATNIKA komunikatem przelewu z art. 108a ust. 3
    (specjalne wypełnienie pól komunikatu)

⭐ art. 103b — korekta kwoty podatku do zapłaty w związku z art. 5c
  rozporządzenia 282/2011 (interfejsy elektroniczne ułatwiające
  dostawy, art. 7a ust. 1 i 2) — organ OKREŚLA kwotę do zapłaty
  podmiotowi dokonującemu dostawy na rzecz operatora platformy
```

### ⭐⭐ SOLIDARNA ODPOWIEDZIALNOŚĆ I KAUCJA GWARANCYJNA (art. 105a–105d)

```
⭐ art. 105a — solidarna odpowiedzialność nabywcy za zaległości
  dostawcy (towary z zał. 15) — PEŁNE omówienie i katalog obrony:
  `mod-VAT-ewidencja-deklaracje.md`, ANEKS.

⭐⭐ art. 105b — KAUCJA GWARANCYJNA (dotąd nieobecna w systemie):
  □ podmiot dokonujący dostawy towarów z **załącznika nr 13** może
    złożyć kaucję gwarancyjną i zostać wpisany do wykazu prowadzonego
    przez Szefa KAS — skutek: WYŁĄCZENIE solidarnej odpowiedzialności
    nabywcy przy zachowaniu pozostałych warunków
  □ kaucja: BEZTERMINOWO albo z określonym terminem ważności
    (liczonym w miesiącach)
  □ ⭐ MECHANIZM RYZYKA: w razie powstania zaległości podatkowej po
    wniesieniu kaucji — kaucję PRZEZNACZA SIĘ na pokrycie zaległości
    (odpowiednie stosowanie przepisów Ordynacji o zaliczaniu nadpłat);
    zaliczenie następuje Z DNIEM POWSTANIA ZALEGŁOŚCI
  □ ⭐ BLOKADA ZWROTU kaucji m.in. w razie wszczęcia kontroli/
    postępowania w zakresie rozliczenia objętego kaucją (terminy
    liczone od zakończenia kontroli) — zweryfikuj aktualne ustępy
    art. 105b w ISAP przed doradzaniem klientowi terminu odzyskania
  ⚠️ UWAGA NA ZAŁĄCZNIKI: art. 105a odsyła do **zał. 15**,
    art. 105b do **zał. 13** — TO SĄ RÓŻNE ZAŁĄCZNIKI. Nie mylić.
⭐ art. 105c–105d — wykaz podmiotów, wykreślenie z wykazu, przesłanki
```

---

## 6c. ⭐⭐⭐ METODA KASOWA MAŁEGO PODATNIKA (art. 21) + ROZLICZENIE KWARTALNE

> **Dotąd CAŁKOWICIE nieobecna** — Dział IV rozdz. 3 ustawy.
> Instytucja bardzo popularna u mikrofirm, a przy tym generująca
> systematyczne błędy w dacie odliczenia u KONTRAHENTA.

```
⭐⭐⭐ DWIE ODRĘBNE INSTYTUCJE — NAJCZĘSTSZY BŁĄD POJĘCIOWY:
  1) METODA KASOWA (art. 21) — zmienia MOMENT POWSTANIA OBOWIĄZKU
     PODATKOWEGO (powiązany z uregulowaniem należności)
  2) ROZLICZENIE KWARTALNE (art. 99 ust. 2–3) — zmienia tylko
     CZĘSTOTLIWOŚĆ deklaracji
  ⭐ Metoda kasowa POCIĄGA za sobą kwartalne deklaracje; kwartalne
  deklaracje NIE pociągają za sobą metody kasowej. Można mieć (2)
  bez (1), nie odwrotnie.

⭐⭐ WARUNEK WEJŚCIA — status MAŁEGO PODATNIKA (art. 2 pkt 25):
  wartość sprzedaży wraz z kwotą podatku w POPRZEDNIM roku podatkowym
  nieprzekraczająca równowartości **2 000 000 EUR**
  ⛔ LIMIT ZŁOTOWY ZMIENIA SIĘ CO ROKU (przeliczenie wg kursu NBP
  z 1. dnia roboczego października roku poprzedniego, zaokrąglenie
  do 1000 zł). PUNKT STARTOWY, NIE ŹRÓDŁO:
    • na 2026 r.: **8 517 000 zł** (spadek wobec 8 569 000 zł na 2025 r.
      — ⭐ NIETYPOWE: limit SPADŁ, więc podatnik „na granicy" mógł
      STRACIĆ status mimo braku wzrostu sprzedaży)
  ⛔ ZAWSZE zweryfikuj limit na dany rok przed użyciem.
  ⭐ Rozpoczynający działalność w trakcie roku — limit W PROPORCJI
    do okresu prowadzenia działalności.

⭐ WYBÓR: zawiadomienie naczelnika US przez **VAT-R** — najpóźniej
  do końca miesiąca poprzedzającego okres, od którego metoda ma być
  stosowana.

⭐⭐⭐ SKUTEK U SPRZEDAWCY (art. 21 ust. 1): obowiązek podatkowy
  powstaje z dniem OTRZYMANIA CAŁOŚCI LUB CZĘŚCI ZAPŁATY —
  ⚠️ przy sprzedaży na rzecz CZYNNEGO podatnika VAT oraz — na innych
  zasadach terminowych — przy sprzedaży na rzecz pozostałych podmiotów.
  ⛔ Zweryfikuj ust. 1 pkt 1 i 2 w ISAP: reżim dla nabywcy NIEBĘDĄCEGO
  czynnym podatnikiem VAT zawiera TERMIN GRANICZNY liczony od dnia
  wydania towaru/wykonania usługi — to jest odrębna zasada.

⭐⭐⭐ SKUTEK U NABYWCY — TU POWSTAJE NAJWIĘCEJ SZKÓD:
  art. 86 ust. 10e — podatnik stosujący metodę kasową odlicza podatek
  naliczony NIE WCZEŚNIEJ niż w rozliczeniu za okres, w którym
  DOKONAŁ ZAPŁATY. Uregulowanie CZĘŚCI należności → odliczenie CZĘŚCI
  podatku.
  ⭐ Jeżeli nie odliczy w tym okresie — może w jednym z DWÓCH
  następnych okresów rozliczeniowych (rozliczenie kwartalne).

⭐⭐⭐ OBOWIĄZEK OZNACZENIA FAKTURY: wyrazy **„metoda kasowa"**
  (art. 106e ust. 1 pkt 16). ⛔ TO JEST SYGNAŁ DLA KONTRAHENTA —
  odbiorca takiej faktury MUSI sprawdzić własne zasady odliczenia.
  W JPK_V7 obowiązuje oznaczenie w części ewidencyjnej — weryfikuj
  aktualny zakres oznaczeń w rozporządzeniu JPK
  (`mod-VAT-ewidencja-deklaracje.md`).

⛔ WYJĄTKI — obowiązek podatkowy NA ZASADACH OGÓLNYCH mimo metody
  kasowej: WNT, import usług, dostawy, dla których podatnikiem jest
  nabywca (odwrotne obciążenie). Metoda kasowa ICH NIE OBEJMUJE.

⭐ REZYGNACJA (art. 21 ust. 3): nie wcześniej niż po upływie
  **12 MIESIĘCY** stosowania metody, po uprzednim pisemnym
  zawiadomieniu naczelnika US w terminie do końca kwartału,
  w którym metoda była stosowana.

⛔ UTRATA PRAWA: począwszy od rozliczenia za MIESIĄC NASTĘPUJĄCY
  PO KWARTALE, w którym przekroczono kwotę z art. 2 pkt 25.

⛔ WYŁĄCZENIA Z ROZLICZENIA KWARTALNEGO (art. 99 ust. 3a) — m.in.
  podatnicy zarejestrowani jako czynni przez okres **12 MIESIĘCY**
  od miesiąca rejestracji. ⭐ Zweryfikuj pełny katalog ust. 3a
  w ISAP — obejmuje też m.in. dostawców towarów z zał. 15 powyżej
  progów.
  ⭐ Nawet przy rozliczeniu kwartalnym istnieje obowiązek składania
  MIESIĘCZNYCH CZĘŚCI EWIDENCYJNYCH JPK_V7K.
```

---

## 6d. ⭐⭐⭐ LIKWIDACJA DZIAŁALNOŚCI I REMANENT (art. 14) — Dział II rozdz. 4

> **Dotąd CAŁKOWICIE nieobecne.** Kluczowa luka w osi „cykl życia
> podatnika": system opisywał rejestrację szczątkowo, a zakończenie
> działalności — wcale.

```
⭐⭐⭐ ZAKRES PODMIOTOWY (art. 14 ust. 1): opodatkowaniu podlegają
  towary własnej produkcji i towary, które po nabyciu nie były
  przedmiotem dostawy, w przypadku:
  □ ROZWIĄZANIA spółki cywilnej lub handlowej NIEMAJĄCEJ osobowości
    prawnej
  □ ZAPRZESTANIA przez podatnika będącego OSOBĄ FIZYCZNĄ wykonywania
    czynności podlegających opodatkowaniu
  ⛔ WYŁĄCZENIE PODMIOTOWE — spisem NIE są objęte spółki kapitałowe
  (sp. z o.o., P.S.A., S.A.). Dla nich likwidacja przebiega według
  innego reżimu (KSH + dostawa/wycofanie majątku na zasadach ogólnych).
  ⭐ Sprawdź także reżim PRZEDSIĘBIORSTWA W SPADKU (wygaśnięcie zarządu
  sukcesyjnego / uprawnienia do jego powołania) — art. 14 ust. 1 pkt 3
  i n., zweryfikuj aktualne brzmienie.

⭐⭐ ZAKRES PRZEDMIOTOWY: spis obejmuje towary, przy nabyciu/wytworzeniu
  których przysługiwało PRAWO DO ODLICZENIA — w tym towary handlowe,
  materiały, wyroby gotowe, WYPOSAŻENIE i ŚRODKI TRWAŁE, a także
  grunty.
  ⛔ NAJCZĘSTSZY BŁĄD: pominięcie ŚRODKÓW TRWAŁYCH w spisie.
  ⭐ SPRZĘŻENIE Z KOREKTĄ WIELOLETNIĄ: przy środkach trwałych sprawdź
  RÓWNOLEGLE art. 91 ust. 4–6 (`mod-VAT-sankcje-bony-odliczenia.md`
  sekcja 4i) — likwidacja w okresie korekty 5/10 lat może generować
  ODRĘBNY obowiązek korekty. NIE ZAKŁADAJ, że remanent go konsumuje.

⭐ MOMENT (art. 14 ust. 5): spis z natury sporządza się NA DZIEŃ
  rozwiązania spółki lub zaprzestania wykonywania czynności
  podlegających opodatkowaniu.

⭐ OBOWIĄZEK PODATKOWY (art. 14 ust. 6): powstaje W DNIU rozwiązania
  spółki lub zaprzestania wykonywania czynności.

⭐⭐ PODSTAWA OPODATKOWANIA (art. 14 ust. 8 w zw. z art. 29a ust. 2):
  cena NABYCIA towarów lub towarów podobnych, a gdy nie ma ceny
  nabycia — KOSZT WYTWORZENIA, określone w momencie dostawy.
  ⛔ NIE jest to cena historyczna z faktury zakupu automatycznie —
  jest to wartość określona NA MOMENT dostawy (w praktyce: wartość
  rynkowa netto; jeżeli cena nie uległa zmianie — cena netto nabycia).

⭐⭐ WYKAZANIE: kwotę podatku należnego wykazuje się w OSTATNIM
  JPK_V7 — w pozycji dotyczącej podatku należnego od towarów objętych
  spisem z natury, o którym mowa w art. 14 ust. 5 ustawy.

⭐⭐ INFORMACJA O SPISIE: składana nie później niż w DNIU złożenia
  deklaracji za okres obejmujący dzień zaprzestania czynności.
  ⭐ Formularze VAT-S1M / VAT-S1K przez e-Urząd Skarbowy (podatki.gov.pl).
  ⚠️ DO MONITOROWANIA: MF zapowiedziało LIKWIDACJĘ obowiązku składania
  VAT-S1M/VAT-S1K (dane dostępne już w JPK_VAT) — projekt nowelizacji
  ustawy o VAT i ustawy o NIP (nr **UD314**) był w konsultacjach.
  ⛔ SPRAWDŹ STATUS TEGO PROJEKTU przed doradzaniem klientowi —
  na dzień budowy modułu NIE był prawem.

⭐ „SPIS ZEROWY": gdy przed likwidacją sprzedano/wycofano wszystkie
  składniki — wartość spisu 0 zł, ale OBOWIĄZEK ZAWIADOMIENIA POZOSTAJE.

⭐⭐⭐ ZWOLNIENIE POLIKWIDACYJNE — MECHANIZM ANTY-PODWÓJNY:
  dostawa towarów objętych spisem z natury dokonana przez byłych
  wspólników/osobę fizyczną jest ZWOLNIONA przez **12 MIESIĘCY** od
  dnia rozwiązania spółki / zaprzestania działalności — pod warunkami
  określonymi w art. 14 ust. 7 (m.in. rozliczenie podatku ze spisu).
  ⛔ Zweryfikuj DOKŁADNE brzmienie i warunki ust. 7 w ISAP.

⭐ ZWROT RÓŻNICY: osobom fizycznym zaprzestającym działalności oraz
  byłym wspólnikom przysługuje prawo zwrotu różnicy podatku
  wykazanej w deklaracji — art. 14 ust. 9a i n., zweryfikuj warunki
  i wymagane załączniki.

⭐⭐ SPRZĘŻENIE Z ULGĄ NA KASĘ: likwidacja działalności w okresie
  3 LAT od rozpoczęcia ewidencjonowania rodzi obowiązek ZWROTU ulgi
  na zakup kasy — patrz
  `mod-VAT-platnicy-egzekucja-kasy-trojstronne.md`, sekcja 7b.
```

### ⭐ CHECKLIST LIKWIDACYJNY — KOLEJNOŚĆ CZYNNOŚCI

```
□ 1. Ustal DZIEŃ zaprzestania czynności opodatkowanych (data graniczna)
□ 2. Sporządź SPIS Z NATURY na ten dzień (art. 14 ust. 5) — w tym ŚT
□ 3. Wyceń wg art. 29a ust. 2 (cena nabycia / koszt wytworzenia
     na moment dostawy)
□ 4. Sprawdź RÓWNOLEGLE korektę wieloletnią art. 91 ust. 4–6 dla ŚT
□ 5. Sprawdź obowiązek ZWROTU ULGI NA KASĘ (3 lata)
□ 6. Wykaż podatek w OSTATNIM JPK_V7
□ 7. Złóż INFORMACJĘ o spisie (nie później niż w dniu złożenia
     deklaracji) — status VAT-S1M/S1K zweryfikuj (projekt UD314)
□ 8. Złóż VAT-Z — ⚠️ 7 DNI od zaprzestania czynności
□ 9. Zachowaj spis w dokumentacji (terminy przechowywania — art. 112)
□ 10. Przy sprzedaży majątku po likwidacji — sprawdź zwolnienie
     12-miesięczne (art. 14 ust. 7), by nie opodatkować dwukrotnie
```

---

## 7. STRATEGIA / QUALITY GATE

```
□ Każdy przepis z tego modułu zweryfikowany w ISAP NA DATĘ CZYNNOŚCI?
□ Limit małego podatnika ustalony NA DANY ROK (nie z modułu)?
□ Przy wykreśleniu z rejestru — sprawdzono, czy termin 2 MIESIĘCY
  z art. 96 ust. 9h jeszcze biegnie? (to jest pierwsze pytanie w intake)
□ Przy wykreśleniu — ustalono PODSTAWĘ (ust. 9 pkt 1-4 / 9 pkt 5 /
  9a pkt 2 / 9a pkt 3)? Od tego zależy, KTÓRA ścieżka przywrócenia
  (9h / 9ha / 9j) jest właściwa
□ Przy WNT paliw — sprawdzono termin 5 DNI z art. 103 ust. 5a, a nie 25.?
□ Przy metodzie kasowej — sprawdzono, czy transakcja nie jest WNT/
  importem usług/odwrotnym obciążeniem (wyjątki na zasadach ogólnych)?
□ Przy likwidacji — spis objął ŚRODKI TRWAŁE i sprawdzono art. 91
  ust. 4-6 ODRĘBNIE?
□ Przy likwidacji — sprawdzono status projektu UD314 (VAT-S1M/S1K)?
□ Załączniki: art. 105a → zał. 15; art. 105b → zał. 13 — nie pomylone?
```

---

## Połącz z
- DR-06/`mod-VAT-podatek-od-towarow-i-uslug` (moduł MACIERZYSTY rodziny)
- DR-06/`mod-VAT-platnicy-egzekucja-kasy-trojstronne` (moduł SIOSTRZANY,
  utworzony w tej samej iteracji: art. 18/106c, art. 111, art. 135–138)
- DR-06/`mod-VAT-ewidencja-deklaracje` (JPK_V7, art. 99, art. 105a, VAT-R)
- DR-06/`mod-VAT-sankcje-bony-odliczenia` (art. 91 korekta wieloletnia — ŚT
  przy likwidacji; art. 108 pusta faktura — art. 103 ust. 1 obejmuje też
  podmioty z art. 108)
- DR-06/`mod-VAT-miejsce-swiadczenia-zwolnienia` (art. 113 zwolnienie
  podmiotowe — inny reżim niż wykreślenie z rejestru)
- DR-06/`mod-ustawa-akcyzowa-i-clo-UCC` (definicja paliw silnikowych
  dla art. 103 ust. 5a)
- DR-06/`mod-OP-ordynacja-podatkowa` (płatnik — art. 8 OP; odsetki za
  zwłokę od zaległości z art. 103)
- DR-05/`mod-PPSA` (środek zaskarżenia na czynność materialno-techniczną
  wykreślenia — ⚠️ zweryfikuj kwalifikację przed wyborem środka)
- `orzeczenia-sadowe-v2` (linia WSA/NSA ws. wykreślenia i przywrócenia)

---

## ŹRÓDŁA WERYFIKACJI (zweryfikowane online 2026-08-12)

```
RZĄD 1 — isap.sejm.gov.pl: t.j. Dz.U. 2025 poz. 775 (potwierdzono brak
  nowszego tekstu jednolitego na 12.08.2026)
RZĄD 2 — struktura ustawy i brzmienie art. 103 ust. 1, art. 96 ust. 9h,
  art. 105b: arslege.pl / lexlege.pl (stan 12.08.2026), przepisy.gofin.pl
RZĄD 2 — praktyka: prawo.pl, gofin.pl, inforlex.pl, pit.pl,
  poradnikprzedsiebiorcy.pl, biznes.gov.pl (art. 14, spis z natury),
  interpretacje KIS
RZĄD 2 — orzecznictwo: WSA w Łodzi I SA/Łd 190/20, I SA/Łd 417/20
  (charakter czynności wykreślenia) — ⛔ PRZED CYTOWANIEM w piśmie
  zweryfikuj sygnatury i tezy w orzeczenia.nsa.gov.pl przez
  `orzeczenia-sadowe-v2`
```
