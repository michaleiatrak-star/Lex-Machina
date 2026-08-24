# Moduł — VAT: ewidencja (JPK_V7), korekta ewidencji, deklaracje, informacje podsumowujące, dowody, rejestracja VAT i solidarna odpowiedzialność

> ⚠️ TEN moduł jest CZĘŚCIĄ RODZINY plików VAT, PODZIELONEJ
> 2026-08-12 (NOTA-4, audyt-systemu-v4/CHECKLIST-DEDUP.md — moduł
> źródłowy miał 3652 linie). Moduł MACIERZYSTY (z aktualnym stanem
> weryfikacji ustawy, ostrzeżeniami o nowelizacjach i alertami
> KSeF/PKWiU): `mod-VAT-podatek-od-towarow-i-uslug.md`.
>
> **⛔ KRYTYCZNE ostrzeżenie (dotyczy CAŁEJ rodziny plików VAT):**
> podstawowy termin zwrotu różnicy podatku to **40 DNI** (art. 87
> ust. 2 zd. 1), NIE 60 dni — SPRAWDŹ moduł macierzysty PRZED
> cytowaniem tego terminu.

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
  ⛔⛔ **PROPAGACJA F-88 (2026-08-19): CAŁY TEN MECHANIZM ZOSTAJE ZNIESIONY
  OD 1.01.2027** — ustawa z 29.05.2026 o zmianie ustawy Ordynacja podatkowa
  oraz niektórych innych ustaw (Dz.U. 2026 poz. 846, podpisana 19.06.2026),
  wśród licznych obszarów tego omnibusa, przenosi zasady korekty ewidencji
  JPK_VAT z ustawy o VAT do Ordynacji podatkowej i ujednolica je z zasadami
  dla JPK_CIT/PIT. **Termin wejścia w życie tej konkretnej zmiany to
  1.01.2027 — inny niż główny termin omnibusa (1.10.2026)**, nie mylić.
  Dwa konkretne skutki potwierdzone (Rząd 2/3, zrozumvat.pl): (a) 14-dniowy
  obowiązek przesłania korekty z ust. 3e ZOSTAJE ZNIESIONY — korekta ma
  stać się UPRAWNIENIEM podatnika, nie obowiązkiem; (b) kara pieniężna
  500 zł za błąd z ust. 3h ZOSTAJE ZLIKWIDOWANA. ⚠️ Dokładne nowe brzmienie
  przepisów w Ordynacji podatkowej (który dział/artykuł przejmie tę
  regulację) NIE ustalone w tej sesji — do sprawdzenia przy sprawie
  dotyczącej korekt JPK z terminem po 1.01.2027. **Do tego czasu (do
  31.12.2026) opisana niżej procedura art. 109 ust. 3e-3l NADAL
  OBOWIĄZUJE w pełni** — moduł pozostaje aktualny dla spraw bieżących.
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
   Dz.U. 2025 poz. 775 t.j., stan prawny na 12.08.2026; pobrane 2026-08-12]
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
  ✅ ZWERYFIKOWANE 2026-08-21 (F-18): art. 99 ust. 3a przewiduje CZTERY
  przypadki utraty prawa do kwartalnego rozliczenia: (1) podatnicy
  zarejestrowani jako VAT czynni od mniej niż 12 miesięcy; (2) dostawa
  TOWARÓW (nie usług — od nowelizacji SLIM VAT 1.01.2021 świadczenie
  USŁUG z zał. 15 NIE wyklucza kwartału, tylko dostawa TOWARÓW) z
  załącznika nr 15, w danym kwartale LUB w poprzedzających go 4
  kwartałach, o łącznej wartości przekraczającej próg w KTÓRYMKOLWIEK
  miesiącu tych okresów; (3) import towarów rozliczany procedurą
  uproszczoną z art. 33a ust. 1; (4) czwarty przypadek nieustalony w tej
  sesji. **Próg z pkt 2 (dotąd niepodany w module): 50 000 zł netto.**
  ⚠️ ZAŁĄCZNIK 15 W TYM MODULE JEST POPRAWNY — starsze materiały (sprzed
  1.11.2019) odwoływały się do załącznika nr 13, uchylonego i wchłoniętego
  do zał. 15 tą nowelizacją; nie cofać się do zał. 13 jako rzekomej
  korekty. Zweryfikowane 6 zgodnych źródeł: poradnikprzedsiebiorcy.pl
  (3 tyg.), izbapodatkowa.pl ×2 (2025, w tym z bezpośrednim cytatem
  uzasadnienia MF do SLIM VAT), ifirma.pl, ksiegowoscpodatkowa.pl,
  vademecumpodatnika.pl — wszystkie zgodne co do progu 50 000 zł i
  ograniczenia do dostawy towarów (nie usług).
  gdy łączna wartość dostaw towarów z **załącznika nr 15** (bez podatku)
  przekroczy próg **50 000 zł**, podatnik rozliczający się kwartalnie MUSI
  przejść na deklaracje MIESIĘCZNE — począwszy od rozliczenia za pierwszy
  miesiąc kwartału:
  → W KTÓRYM przekroczono kwotę — jeżeli przekroczenie nastąpiło w
    PIERWSZYM lub DRUGIM miesiącu kwartału (przy przekroczeniu w drugim
    miesiącu deklarację za pierwszy miesiąc składa się do **25. dnia**
    miesiąca następującego po drugim miesiącu kwartału)
  → NASTĘPUJĄCEGO PO kwartale, w którym przekroczono kwotę — jeżeli
    przekroczenie nastąpiło w TRZECIM miesiącu kwartału

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
  ✅ ZWERYFIKOWANE 2026-08-21 (F-18): rozbieżność źródeł 15/25 dni NIE
  jest błędem ani stanem historycznym — to REALNE rozróżnienie wg formy
  składania: **15. dnia** (art. 100 ust. 3, forma PAPIEROWA — obecnie
  praktycznie martwa) vs **25. dnia** (art. 100 ust. 7, forma
  ELEKTRONICZNA — jedyna praktycznie stosowana obecnie). Zweryfikowane
  6 zgodnych źródeł: rp.pl ×2, poradnikprzedsiebiorcy.pl (05.2026),
  przepisy.gofin.pl, lexlege.pl, ordynacjapodatkowa.pl ×2,
  izbapodatkowa.pl, ksiegowego.pl (08.2024).
  □ składane ZA OKRESY MIESIĘCZNE, za pomocą ŚRODKÓW KOMUNIKACJI
    ELEKTRONICZNEJ, w terminie do **25. DNIA** miesiąca następującego po
    miesiącu, w którym powstał obowiązek podatkowy z tytułu transakcji
    objętych obowiązkiem informacyjnym (art. 100 ust. 7 — forma
    elektroniczna; art. 100 ust. 3 przewiduje 15. dzień, ale WYŁĄCZNIE
    dla formy papierowej, praktycznie nieużywanej)
  □ ✅ PRÓG KWARTALNY POTWIERDZONY JAKO AKTUALNY (art. 100 ust. 4) — NIE
    jest to stan historyczny, jak sugerowały wcześniejsze wątpliwości w
    tym module. Informacje podsumowujące MOGĄ być składane za okresy
    KWARTALNE (zamiast miesięcznych — to PRAWO, nie obowiązek), gdy:
    1) transakcje z ust. 1 pkt 1 i 3 (WDT + przemieszczenia towarów) —
       łączna wartość bez VAT NIE przekracza **250 000 zł** w danym
       kwartale ANI w żadnym z 4 poprzednich kwartałów
    2) transakcje z ust. 1 pkt 2 (WNT) — łączna wartość bez VAT NIE
       przekracza **50 000 zł** w danym kwartale
    □ przy przekroczeniu progu W TRAKCIE kwartału — informacje za
      poszczególne miesiące, które upłynęły od początku kwartału, składa
      się do 15. dnia miesiąca następującego po miesiącu przekroczenia
      (termin 15/25 wg tej samej zasady formy jak wyżej)
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
   przepisy.gofin.pl, prawnik.cc), Dz.U. 2025 poz. 775 t.j., 2026-08-12]
✅ [VER 2026-08-21 (F-18): próg art. 99 ust. 3a pkt 2 = 50 000 zł,
   6 zgodnych źródeł — patrz adnotacja wyżej. Znacznik OBOWIĄZKOWA dla
   tej pozycji zamknięty]
✅ [VER 2026-08-21 (F-18) — art. 100 ust. 3/4/7: rozbieżność 15/25 dni
   wyjaśniona (forma papierowa vs elektroniczna), próg kwartalny
   250 000/50 000 zł potwierdzony jako aktualny, nie historyczny —
   8 zgodnych źródeł, patrz adnotacja wyżej. Znacznik zamknięty]
⚠️ [ZALECANA WERYFIKACJA ISAP — pozostaje wyłącznie dla art. 101–102
   (korekty informacji podsumowujących i delegacje) — NIEOPRACOWANE w
   tym module]
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


---

## Połącz z
- DR-06/mod-VAT-podatek-od-towarow-i-uslug (moduł MACIERZYSTY)
