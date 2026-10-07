# Historia zmian plików — dr-06-podatki-finanse-publiczne-aml

> Plik historyczny: historia zmian SKILL.md i modułów, przeniesiona z plików roboczych
> (AUDYT-2026-10-04n). Model nie czyta go podczas pracy; bieżący stan jest w plikach roboczych,
> historia wersji skilla — w `references/CHANGELOG.md`.


## modules/mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci.md (przeniesione 2026-10-04n)

## CHANGELOG

**1.0 (2026-07-19):** Utworzenie modułu na wyraźne żądanie użytkownika
— zbudowanie "bazy" produktów, gdzie stawka VAT zależy od niejednoznacznej
klasyfikacji tego samego fizycznego towaru. Skorygowano terminologię:
mechanizm dotyczy PKWiU/CN i statusu prawnego towaru (wyrób medyczny wg
MDR), NIE kodu PKD (który klasyfikuje działalność podatnika, nie towar).
W PEŁNI opracowano na konkretnym przykładzie rękawic nitrylowych
(diagnostyczne/medyczne 8% vs robocze/BHP 23%, z realnym przykładem WIS
i interpretacji podatkowych pokazujących, że TA SAMA fizyczna partia
towaru może wymagać różnych stawek zależnie od odbiorcy/przeznaczenia
KONKRETNEJ transakcji). Rozszerzono na 3 dodatkowe, w pełni udokumentowane
przypadki (maseczki, płyny dezynfekujące, podkłady chłonne) oraz
zasygnalizowano 5 dalszych kategorii jako punkt startowy do przyszłego
pogłębienia.


## modules/mod-VAT-podatek-od-towarow-i-uslug.md (przeniesione 2026-10-04n)

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
Źródła: lexlege.pl (Rząd 2B, t.j. Dz.U. 2025 poz. 775, stan prawny
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


## modules/mod-alkohol-tyton-regulacja-sprzedazy.md (przeniesione 2026-10-04n)

## CHANGELOG

**1.2 (2026-07-20):** Dodano sekcję "DO MONITOROWANIA" na wstępie
Części A — cztery RÓWNOLEGŁE, KONKURENCYJNE projekty zmian ustawy
o wychowaniu w trzeźwości (poselski PSL z 26.01.2026 — blokujący
projekty Lewicy i Polski 2050; rządowy UD 147 — pełnoletność/opakowania
"małpki"/kary do 750 000 zł). ŻADEN NIE JEST jeszcze prawem —
oznaczone WYRAŹNIE jako materiał do śledzenia, nie stan obowiązujący,
na wyraźne żądanie użytkownika o monitorowanie tego obszaru.

**1.1 (2026-07-20):** Dodano Część C — BIMBROWNICTWO (nielegalny wyrób
alkoholu etylowego, art. 12a ustawy z 2.03.2001 r.), na wyraźne żądanie
użytkownika. KLUCZOWE ustalenie: uchwała SN z 30.11.2004 (I KZP 23/04)
rozstrzygnęła, że w polskim prawie NIE ISTNIEJE "legalny bimber na
własny użytek" — produkcja BEZ wpisu do rejestru KOWR jest przestępstwem
NIEZALEŻNIE od ilości i braku zamiaru sprzedaży. Opisano wymogi
rejestracyjne, sankcje (z odnotowaną, nierozstrzygniętą rozbieżnością
źródeł co do górnej granicy kary — 1 vs 3 lata), zbieg z KKS, rozróżnienie
od legalnego posiadania aparatury destylacyjnej do innych celów, oraz
kontekst historyczny (penalizacja nieprzerwana od 1926 r., związana z
monopolem Skarbu Państwa na wyroby spirytusowe).

**1.0 (2026-07-19):** Utworzenie modułu na wyraźne żądanie użytkownika
("alkohole, papierosy"). Potwierdzono, że przemyt/kontrabanda (art.
86-91 KKS) były JUŻ dobrze opracowane w `mod-ustawa-akcyzowa-i-clo-
UCC.md` — bez potrzeby zmian. Zweryfikowano online i w pełni opracowano
REGULACJĘ SPRZEDAŻY: alkohol (trzy kategorie zezwoleń wg mocy wydawane
osobno przez wójta/burmistrza, czas trwania min. 2/4 lata, odrębny
reżim obrotu hurtowego >18% przez ministra, przesłanki cofnięcia
zezwolenia z potwierdzonym przez TK charakterem praktycznie obiektywnej
odpowiedzialności za sprzedaż nieletnim, kompetencja gminy do
ograniczeń godzinowych); tytoń i wyroby nikotynowe (zakaz sprzedaży
nieletnim, zakaz palenia w miejscach publicznych, wymogi opakowaniowe,
sankcje) — ze SZCZEGÓLNYM naciskiem na BARDZO ŚWIEŻĄ nowelizację z
5.07.2025 r. zrównującą e-papierosy (w tym beznikotynowe) i woreczki
nikotynowe z tradycyjnym tytoniem, zamykającą wcześniejszą lukę prawną
pozwalającą na obchodzenie zakazów dla wariantów bez nikotyny.


## modules/mod-clo-podroznych-limity-towary-zabronione.md (przeniesione 2026-10-04n)

## CHANGELOG

**1.0 (2026-07-19):** Utworzenie modułu na wyraźne żądanie użytkownika
("cło, limity przewozu i towary zabronione w ruchu transgranicznym").
Potwierdzono, że dotychczasowy `mod-UCC-clo-taryfa-celna.md` pokrywa
WYŁĄCZNIE stronę komercyjną (B2B) — ten moduł uzupełnia stronę
KONSUMENCKĄ/podróżnych. Zweryfikowano online i w pełni opracowano: limit
przewozu gotówki (rozporządzenie UE 2018/1672, próg 10 000 EUR,
rozszerzona definicja środków pieniężnych obejmująca złoto/platynę BEZ
progu kwotowego oraz karty przedpłacone, procedura zgłoszenia z opcją
elektroniczną przez PUESC, sankcja czasowego zatrzymania z postępowaniem
do 90 dni); zwolnienia celne dla podróżnych (limity wartościowe 300/430
EUR zależne od transportu, szczegółowe normy ilościowe alkoholu/tytoniu/
e-papierosów z możliwością proporcjonalnego łączenia, całkowity zakaz
żywności pochodzenia zwierzęcego, limit 5 opakowań leków); towary
zabronione (CITES z konkretnymi przykładami — kość słoniowa, dzikie
koty — i surową sankcją karną 3 miesiące-5 lat, sygnalizacja innych
kategorii — broń, zabytki, podróbki — z odesłaniem do już istniejących
modułów bez duplikacji).


## modules/mod-odliczenia-uzytek-mieszany-firma-prywatny-KUP.md (przeniesione 2026-10-04n)

## CHANGELOG

**1.0 (2026-07-21):** Utworzenie modułu w odpowiedzi na audyt
kompletności prawa podatkowego w zakresie firm/konsumentów/użytku
własnego/odliczeń/odsprzedaży. Zweryfikowano online i w pełni
opracowano: zasady VAT od samochodów osobowych (domyślne 50%, ścieżka
do 100% z trzema łącznymi warunkami — wyłączny użytek służbowy,
ewidencja przebiegu, regulamin — plus formalne zgłoszenie VAT-26 z
krytycznym terminem 25. dnia miesiąca po PIERWSZYM wydatku, ryzyko
kontroli poprzez zestawienie danych ANPR z ewidencją, konsekwencje
wykrycia naruszenia — korekta wsteczna do 5 lat); ryczałt PIT za
użytek prywatny samochodu służbowego (250/400 zł wg MOCY silnika od
2022, proporcjonalne obniżenie, utrwalone i jednolite orzecznictwo NSA
że ryczałt obejmuje WSZYSTKIE koszty eksploatacyjne w tym paliwo,
rozszerzenie na ładowanie pojazdów elektrycznych); ogólne zasady KUP
(klauzula generalna, wymogi, przykłady kategorii mieszanych — limity
samochodowe, reprezentacja, IP Box). Dodano SYNTEZĘ w postaci macierzy
decyzyjnej (firma/konsument/odsprzedaż/niejednoznaczna klasyfikacja) z
KLUCZOWYM ustaleniem, że VAT i KUP to DWA NIEZALEŻNE reżimy prawne,
często błędnie utożsamiane w praktyce.


## modules/mod-podatki-sektorowe-bankowy-gry-tonazowy-cukrowy-detaliczny.md (przeniesione 2026-10-04n)

## CHANGELOG

**1.2 (2026-08-13) — ETAP 3 uzupełniania luk DR-06:** DOMKNIĘTO
w pełni Część B (podatek od gier) i Część C (podatek tonażowy),
dotąd punkt startowy — WSZYSTKIE PIĘĆ podatków sektorowych w tym
module jest teraz w pełni opracowanych.
- **Część B (podatek od gier):** pełny katalog 7 stawek (art. 74,
  10%-50% zależnie od typu gry), podstawa opodatkowania per rodzaj
  gry z zasadą niepodlegania sumowaniu (art. 73), obowiązki
  podatników (art. 75), odrębny mechanizm dopłat do 4 funduszy
  celowych (art. 80-84), reżim internetowy (art. 15d-15j) i kary
  pieniężne pozostawione nawigacyjnie jako niski priorytet.
- **Część C (podatek tonażowy):** pełna definicja przedsiębiorcy
  żeglugowego, zakres przedmiotowy z katalogiem wyłączeń, mechanizm
  stawki dobowej i stawki podstawowej 19% (bez pomniejszenia o
  koszty), stawka szczególna 15% dla przychodów ze sprzedaży statków,
  ✅ zweryfikowany bezpośrednio (sip.lex.pl) 10-letni okres związania
  wyborem — najdłuższy spośród wszystkich mechanizmów opcjonalnych
  w systemie, warunek unijnej decyzji KE, relacja do CIT/PIT.
  Odnotowano potencjalne regionalne znaczenie praktyczne (bliskość
  portów Szczecin/Świnoujście).
- Źródła: sip.lex.pl (Rząd 2B, bezpośrednie potwierdzenie art. 10),
  finanse-arch.mf.gov.pl, biznes.gov.pl, ifirma.pl, gazetaprawna.pl,
  arslege.pl, poradnikprzedsiebiorcy.pl, lexlege.pl, pitax.pl,
  przepisy.gofin.pl, prawnik.cc, dlajurysty.pl, infor.pl,
  isap.sejm.gov.pl (pośrednio, przez PDF ustawy w wynikach
  wyszukiwania), wikipedia.pl (z odniesieniem do t.j.), gov.pl
  (Informacja MF o realizacji ustawy o grach hazardowych, dane 2024).
- ⚠️ [NIEWERYFIKOWANE BEZPOŚREDNIO W ISAP] — pełny akt niedostępny
  do web_fetch w tej sesji; przed pismem procesowym potwierdź
  aktualny t.j. obu ustaw wprost na ISAP.

**1.1 (2026-08-13) — ETAP 1 uzupełniania luk DR-06:** DOMKNIĘTO w
pełni Części D i E, dotąd oznaczone jako "punkt startowy":
- **Część D (opłata cukrowa):** skorygowano błędną podstawę prawną
  (było ogólnikowo "nowelizacja z 2020"; POPRAWNIE: art. 12a-12g
  ustawy o zdrowiu publicznym, t.j. Dz.U. 2026 poz. 149), dodano
  BRAKUJĄCĄ dotąd stawkę dodatkową za kofeinę/taurynę (0,10 zł/l),
  pełny katalog wyłączeń przedmiotowych (wyroby medyczne, soki >20%,
  roztwory elektrolitowe, produkty mleczne, substancje naturalne),
  mechanizm "jednorazowego poboru" w łańcuchu odsprzedaży, termin
  25. dnia miesiąca, sankcję 50% za brak terminowej zapłaty, wzmiankę
  orzeczniczą o rozróżnieniu cukru dodanego od naturalnego, oraz
  AKTUALNY status projektu podwyżki UD417 (III kw. 2026, planowane
  1.01.2027, POPRZEDNIA wersja zawetowana XII.2025).
- **Część E (podatek od sprzedaży detalicznej):** JEDNOZNACZNIE
  POTWIERDZONO ciągłość obowiązywania od 1.01.2021 r. bez przerwy
  (usunięto niepewność sugerującą możliwe kolejne zawieszenie),
  potwierdzono t.j. Dz.U. 2023 poz. 148, dodano definicję "konsumenta"
  na gruncie ustawy (szerszą niż KC), zasady ustalania podstawy
  opodatkowania (ewidencja kasowa, pomniejszenie o zwroty), pełny
  tryb rozliczenia (deklaracja PSD-1, termin 25. dnia, brak obowiązku
  przy nieprzekroczeniu progu), kompletną tabelę właściwości organu
  wg formy prawnej podatnika, oraz sygnał praktyczny o wykorzystaniu
  PSD w analizie GAAR przez Szefa KAS.
- Część C (tonażowy) i pozostałe fragmenty Części B (gry — szczegółowe
  stawki, hazard internetowy) ŚWIADOMIE POZOSTAWIONE jako punkt
  startowy — poza zakresem Etapu 1, do dalszych sesji.
- Metodologia: Rząd 1 (ISAP) niedostępny bezpośrednio w tej sesji
  (blokada robots) — zastosowano Rząd 2B/3 z progiem min. 2-3 źródeł
  zgodnych (ZASADA 14). Żadna stawka NIE została przyjęta na
  podstawie jednego źródła.

**1.0 (2026-07-19):** Utworzenie modułu na wyraźne żądanie użytkownika
po audycie pokrycia prawa podatkowego. W PEŁNI zweryfikowano i
opracowano: podatek od niektórych instytucji finansowych ("podatek
bankowy" — stawka 0,0366% miesięcznie, progi 4 mld/2 mld zł, pełny
katalog pomniejszeń i zwolnień). CZĘŚCIOWO opracowano (punkt startowy,
wymaga pogłębienia): podatek od gier, podatek tonażowy, opłatę cukrową,
podatek od sprzedaży detalicznej (w tym odnotowana burzliwa historia
zawieszeń tego ostatniego w związku ze sporem przed Komisją Europejską).


## references/BAZA-AKTOW-OKOLOAKCYZOWYCH.md (przeniesione 2026-10-04n)

## 6. Changelog

- **1.2.0 (2026-08-11):** Dodano sekcję 6 (synchronizacja z MAPA-AKTOW.md
  i ROUTING-MAP.md) po tym, jak użytkownik zapytał, czy zweryfikowane akty
  zostały też dodane do mapy aktów prawnych w `prawo-polskie-v2` i
  odpowiednim module DR — okazało się, że nie, i że te same nieaktualne
  oznaczenia Dz.U. (ustawa akcyzowa: 2025 poz. 126) występowały
  niezależnie w obu tych plikach. Poprawiono wszystkie trzy miejsca
  równocześnie, patrz AUDYT-2026-08-11c/d w AUDIT-JOURNAL.md.
- **1.1.0 (2026-08-11):** Kontrola aktualności zgodnie z REGUŁĄ
  AKTUALNOŚCI (`shared/PRAWO-HARDGATE.md`). Wynik: **ustawa akcyzowa
  była oznaczona nieaktualnym t.j.** (Dz.U. 2025 poz. 126 zamiast
  aktualnego Dz.U. 2026 poz. 412) — poprawiono w sekcji 0 i 1, oraz
  równolegle w `mod-ustawa-akcyzowa-i-clo-UCC.md`. Dodano zweryfikowane
  oznaczenia Dz.U. dla ustawy o wyrobie alkoholu etylowego (Dz.U. 2025
  poz. 1893 t.j.) i ustawy SENT (Dz.U. 2024 poz. 1218 t.j.), wcześniej
  wymienionych bez konkretnego oznaczenia. Odnotowano nowelizacje
  post-t.j. do sprawdzenia punktowo (KKS: poz. 347/421/846/901 z 2026;
  u.p.a.: poz. 414 z 2026) oraz projekt legislacyjny w toku (zaostrzenie
  przepisów alkoholowych) — nieobowiązujący, wymaga odrębnej weryfikacji
  statusu przed użyciem.
- **1.0.0 (2026-08-11):** Utworzenie bazy w ramach naprawy AUDYT-2026-08-11
  (błędne oznaczenie ✅ dla art. 100 u.p.a. w sprawie dot. produkcji poza
  składem podatkowym). Pierwsza wersja — pokrycie: rdzeń akcyzowy, mapa
  KKS art. 54-91, akty powiązane. Do rozbudowy w miarę kolejnych spraw
  (np. szczegółowa mapa rozporządzeń wykonawczych do u.p.a., jeśli
  okaże się potrzebna praktycznie).


## references/BAZA-AKTOW-OKOLOPODATKOWYCH.md (przeniesione 2026-10-04n)

## 3. Changelog

- **1.1.0 (2026-08-11):** Druga tura (sekcja 0a): spadki i darowizny,
  PCC, podatki lokalne, ryczałt, gry hazardowe. Znaleziono i naprawiono:
  (a) nieaktualny t.j. ustawy o spadkach i darowiznach (2024 poz. 1837 →
  2026 poz. 478) — ten sam wzorzec co akcyza, z dodatkową komplikacją,
  że w MAPA-AKTOW.md wiersz tej ustawy W OGÓLE NIE ISTNIAŁ (był tylko w
  ROUTING-MAP.md, i to z błędnym numerem) — dodano brakujący wiersz;
  (b) brak numeru Dz.U. dla ustawy o grach hazardowych w ramach wiersza
  "podatki sektorowe" — ustalono i dodano (Dz.U. 2025 poz. 595 t.j.).
  Pozostałe trzy podatki sektorowe (tonażowy, cukrowa, detaliczna) oraz
  UFP, obligacje, usługi płatnicze, biegli rewidenci, doradztwo
  podatkowe — nadal NIE zweryfikowane, jawnie odnotowane do kolejnej tury.
- **1.0.0 (2026-08-11):** Utworzenie bazy analogicznie do
  BAZA-AKTOW-OKOLOAKCYZOWYCH.md, na żądanie użytkownika. Zweryfikowano
  5 głównych aktów podatkowych (VAT, PIT, CIT, Ordynacja podatkowa, KAS)
  bezpośrednio na ISAP/obwieszczeniach. Wynik: t.j. wszystkich pięciu
  były aktualne (w przeciwieństwie do akcyzy), ale brakowało odnotowania
  nowelizacji post-t.j., w tym jednej wspólnej dla wszystkich pięciu
  (Dz.U. 2026 poz. 846 (⛔ w życie 1.10.2026 — do tej daty NIE stosować)). Znaleziono i poprawiono jedną rozbieżność
  liczbową w MAPA-AKTOW/ROUTING-MAP (KAS: poz. 395 → poprawnie poz. 415).
  Pozostałe akty okołopodatkowe (PCC, spadki/darowizny, lokalne, ryczałt
  szczegółowo, sektorowe, obligacje, usługi płatnicze, zawody: biegli
  rewidenci/doradcy podatkowi, UFP) NIE zostały ponownie zweryfikowane
  w tej sesji — do zrobienia w kolejnej turze.
