# Moduł — VAT: nieodpłatne przekazania, zbycie przedsiębiorstwa/ZCP, miejsce dostawy i transakcje łańcuchowe, organy władzy publicznej, odwrotne obciążenie krajowe, fakturowanie, procedury szczególne

> ⚠️ TEN moduł jest CZĘŚCIĄ RODZINY plików VAT, PODZIELONEJ
> 2026-08-12 (NOTA-4, audyt-systemu-v4/references/CHECKLIST-DEDUP.md — moduł
> źródłowy miał 3652 linie). Moduł MACIERZYSTY (z aktualnym stanem
> weryfikacji ustawy, ostrzeżeniami o nowelizacjach i alertami
> KSeF/PKWiU): `mod-VAT-podatek-od-towarow-i-uslug.md`.
>
> **⛔ KRYTYCZNE ostrzeżenie (dotyczy CAŁEJ rodziny plików VAT):**
> podstawowy termin zwrotu różnicy podatku to **40 DNI** (art. 87
> ust. 2 zd. 1), NIE 60 dni — SPRAWDŹ moduł macierzysty PRZED
> cytowaniem tego terminu.

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
   Dz.U. 2025 poz. 775 t.j., stan prawny na 12.08.2026; pobrane 2026-08-12]
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
    **art. 2 pkt 27e** ✅ ZWERYFIKOWANE 2026-08-21 (F-18) — pełne
    brzmienie: "organizacyjnie i finansowo wyodrębniony w istniejącym
    przedsiębiorstwie zespół składników materialnych i niematerialnych,
    w tym zobowiązania, przeznaczonych do realizacji określonych zadań
    gospodarczych, który zarazem mógłby stanowić niezależne
    przedsiębiorstwo samodzielnie realizujące te zadania" — trzy
    wyodrębnienia potwierdzone (organizacyjne, finansowe, funkcjonalne/
    zdolność do samodzielnego działania), zgodnie z opisem niżej w tej
    sekcji. Zweryfikowane: inforlex.pl (komentarz VAT 2019/2020 i 2024,
    ta sama numeracja w obu edycjach — stabilna od lat), epodatnik.pl
    (rejestr tysięcy interpretacji KIS odwołujących się do tego przepisu
    pod tym samym numerem) — niska zmienność tego przepisu potwierdzona
    powtarzalnością numeracji na przestrzeni 5+ lat.

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
   art. 6, Dz.U. 2025 poz. 775 t.j.; wykładnia „transakcji zbycia"
   potwierdzona w 4 interpretacjach indywidualnych KIS (2025–2026),
   2026-08-12]
✅ [VER 2026-08-21 (F-18): art. 2 pkt 27e w pełni zweryfikowany — patrz
   adnotacja wyżej. Znacznik ZALECANA WERYFIKACJA zamknięty]
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
   art. 15 ust. 6, Dz.U. 2025 poz. 775 t.j., 2026-08-12]
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
   Dz.U. 2025 poz. 775 t.j., 2026-08-12]
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
  □ ✅ STAWKA — ZWERYFIKOWANE 2026-08-21 (F-18): art. 115 ust. 2 stanowi
    o BAZOWEJ **6,5%** kwoty należnej z tytułu dostawy produktów rolnych
    pomniejszonej o kwotę zryczałtowanego zwrotu, ALE obecnie (i od
    1.01.2011 nieprzerwanie) podniesiona do **7%** przez przepis
    EPIZODYCZNY. Ustalony i potwierdzony KONKRETNY, obecnie obowiązujący
    przepis: **art. 146ef ust. 1 pkt 3** (nie art. 146ea — ten dotyczył
    wcześniejszego okresu i już nie obowiązuje; nie mylić też z art. 146a
    [2011-2018] i art. 146aa [2019-2023], oba HISTORYCZNE, ta sama
    stawka 7% powtórzona w kolejnych przepisach epizodycznych od 2011 r.
    bez przerwy). Art. 146ef obowiązuje od 1.01.2024, warunkowany progiem
    wydatków obronnych/PKB (odesłanie do ustawy o obronie Ojczyzny), z
    obowiązkiem ogłoszenia przez ministra finansów końca okresu do 31.10
    danego roku — wersja obowiązująca obecnie: od 1.04.2026 do 31.12.2026
    (sip.lex.pl OpenLEX, wersja czasowa). Zweryfikowane: lexlege.pl,
    przepisy.gofin.pl, qmap.pl, inforlex.pl (komentarz), sip.lex.pl —
    5 zgodnych źródeł Rządu 2B, wszystkie cytujące identyczną treść i
    stawkę 7%.
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
✅ [VER 2026-08-21 (F-18): stawka 7% z art. 115 ust. 2 przez art. 146ef
   ust. 1 pkt 3 — 5 zgodnych źródeł, patrz adnotacja wyżej. Znacznik
   OBOWIĄZKOWA zamknięty]
```

---



---

## Połącz z
- DR-06/mod-VAT-podatek-od-towarow-i-uslug (moduł MACIERZYSTY)
- DR-06/mod-VAT-miejsce-swiadczenia-zwolnienia
