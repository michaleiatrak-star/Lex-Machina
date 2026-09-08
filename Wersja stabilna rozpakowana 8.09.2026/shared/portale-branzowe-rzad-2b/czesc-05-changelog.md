# PORTALE — część 5: changelog

> Część pliku `PORTALE-BRANZOWE-RZAD-2B.md` (podział 2026-08-20, naprawa
> F-78 — plik źródłowy przekroczył 1000 linii). Pełny indeks i zasady
> użycia: zobacz plik nadrzędny w katalogu `shared/`. To NIE jest
> samodzielny skill — ładowany WYŁĄCZNIE przez indeks nadrzędny na
> żądanie właściwej grupy DR.

---

## CHANGELOG

**2.9 (2026-07-24c):** ⛔ Na wyraźne polecenie użytkownika ("usuń
pojedyncze przypisane pdf jako źródła... i pozostałe bezpośrednie linki
do pdf") zamknięto flagę F-12: rejestr `nexto_free_files_registry.json`
wyczyszczony do `[]`, wiersz F-12 usunięty z tabeli otwartych flag w
`audyt-systemu-v4/references/WARN-OTWARTE.md`. Wiersz w tabeli DR-03
powyżej zaktualizowany, żeby to odzwierciedlić. Wiersz "nexto.pl —
PRÓBKI/fragmenty książek" (3B-i/3B-ii) NIE jest tym dotknięty — dotyczy
odrębnego, legalnego mechanizmu podglądu/próbki.

**2.8 (2026-07-24b):** ⭐ Na uwagę użytkownika ("czy nie powinny być w 2,
szczególnie w odniesieniu do literatury Beck, Kluwer?") doprecyzowano
wiersz nexto.pl PRÓBKI: kryterium 2B to marka wydawnicza + redakcja
zawodowa, nie kanał dystrybucji — C.H.Beck i Wolters Kluwer są już w 2B
przez legalis.pl/lex.pl, więc próbka na nexto.pl jednoznacznie
identyfikowalna jako publikacja tych wydawnictw dziedziczy status 2B
(podtyp 3B-ii w `shared/HIERARCHIA-ZRODEL.md`), z zachowaniem wymogów
fragmentu/linku/aktualności wydania. Inne/nieustalone wydawnictwo
pozostaje Rząd 3 (3B-i).

**2.7 (2026-07-24):** ⭐ Na polecenie użytkownika dodano ODRĘBNY wiersz
`nexto.pl — PRÓBKI/fragmenty książek` w tabeli DR-03, celowo
oddzielony od istniejącego wiersza F-12. Rozróżnienie: F-12 = pełne,
nieautoryzowane pliki PDF (`.../free/[hash].pdf`), pod aktywnym
monitorowaniem, nie do cytowania; nowy wiersz = standardowa funkcja
próbki księgarni cyfrowej (spis treści + ograniczone strony),
dozwolona jako Rząd 3 WYŁĄCZNIE jako fragment/pogląd doktrynalny, z
obowiązkową weryfikacją ważności linku przed każdym użyciem — pełna
procedura w nowej sekcji 3B `shared/HIERARCHIA-ZRODEL.md` (wersja 1.1).

**2.6 (2026-07-21):** ⭐ KOREKTA na uwagę użytkownika: "nie reklamujemy
księgarni, więc nie powinny być dodane, tylko wskazane jako źródło
darmowych zasobów do monitorowania". USUNIĘTO wpis nexto.pl/profinfo.pl
jako "legalna księgarnia" z tabeli DR-03 — TEN rejestr ma na celu
wskazywanie źródeł do PRZESZUKIWANIA (`site:` dla treści prawnej), nie
katalogowanie miejsc zakupu, niezależnie od tego, jak legalne i godne
zaufania by nie były. Domena nexto.pl POZOSTAJE wspomniana WYŁĄCZNIE
jako źródło PIĘCIU konkretnych, monitorowanych plików (flaga F-12/T10
w audyt-systemu-v4) — BEZ rekomendowania jej jako ogólnego portalu do
przeszukiwania.

**2.5 (2026-07-21):** [WPIS UZUPEŁNIONY WSTECZNIE 2026-07-21 — w
oryginalnej turze zaktualizowano WYŁĄCZNIE nagłówek wersji pliku, bez
odpowiadającego wpisu w tej sekcji, co jest NIESPÓJNOŚCIĄ naprawioną
teraz] Zarejestrowano (BŁĘDNIE, patrz KOREKTA 2.6 powyżej) nexto.pl i
profinfo.pl jako "legalne księgarnie" w DR-03, w kontekście dyskusji o
znalezionym na Nexto pełnym pliku komentarza do KK o niepewnym statusie
prawnym (patrz flaga F-12).

**2.4 (2026-07-21):** Na wskazanie użytkownika sprawdzono link
https://www.gov.pl/web/kgpsp — POTWIERDZONO (pobrano stronę
bezpośrednio) jako oficjalny (Rząd 1) portal Komendy Głównej Państwowej
Straży Pożarnej, z dedykowaną sekcją "Prawo" i systemem KSRG — treść W
WIĘKSZOŚCI aktualnościowo-wizerunkowa, sama sekcja "Prawo" NIE zbadana
szczegółowo (punkt startowy). Przy poszukiwaniu ANALOGICZNYCH portali
rządowych dla służb znaleziono **bip.kgp.policja.gov.pl** — oficjalny
portal Komendy Głównej Policji z WŁASNYM Dziennikiem Urzędowym
(edziennik.policja.gov.pl, elektroniczny od 2012 r.) i zarządzeniami
Komendanta Głównego. Dodano OBA do DR-13 jako źródła Rządu 1, z NOWĄ
uwagą o strukturze systemowej: dla służb mundurowych/agencji
bezpieczeństwa właściwym wzorcem jest STRUKTURA gov.pl/web/[skrót]
(każda służba ma własny portal w tej rodzinie), nie komercyjny portal
2B — ale treść tych portali jest w przeważającej części
wizerunkowo-informacyjna, wymagająca odrębnego zbadania sekcji
prawnych/zarządzeń dla oceny faktycznej przydatności merytorycznej.

**2.3 (2026-07-21):** Na polecenie użytkownika ("sprawdź niebezpiecznik
i szukaj dalej, a następnie zajmij się badaniem i dodawaniem kandydatów
do listy po ich weryfikacji"): **niebezpiecznik.pl** (✅✅, DR-11) —
bardzo znany, wieloletni portal cyberbezpieczeństwa, MOCNE pokrycie
NIS2/KSC2 z cytatami artykułów, śledzi głośne sprawy (Morele.net/UODO
z wyrokiem NSA) — UZUPEŁNIA poradyodo.pl (ten silniejszy w
cyberbezpieczeństwie, tamten w samym RODO). NASTĘPNIE zweryfikowano
WSZYSTKIE TRZY kandydatów z listy rekomendacji z wersji 2.2 —
**WSZYSTKIE TRAFIONE**: **e-prawnik.pl** (✅✅) — ROZWIĄZUJE wcześniej
odnotowaną lukę DR-03 (pełny Kodeks wykroczeń z komentarzem
artykuł-po-artykule, WCZEŚNIEJSZY wniosek o "braku dominującego
portalu" SKORYGOWANY w sekcji DR-03); **wirtualnemedia.pl** (✅✅) —
NOWA nisza prawa medialnego/prasowego (analogicznie do wcześniej
odkrytej niszy NGO), dodana do DR-11; **praca.pl** (✅✅) — wypełnia
lukę PERSPEKTYWY PRACOWNIKA w DR-04 (wcześniejsze portale tej sekcji
pisane były z perspektywy pracodawcy/kadr). Odnotowano METODOLOGICZNY
wniosek: WSZYSTKIE trzy kandydaty wybrane na podstawie KONKRETNEJ
analizy luk okazały się trafione, w przeciwieństwie do wcześniejszych
przypadkowych prób (wyborcza.pl, pb.pl, medonet.pl) — potwierdza to
wartość METODYCZNEGO podejścia. Zaktualizowano sekcję rekomendacji:
DR-03 usunięte z listy "wciąż niepokrytych" (pozostają DR-05, DR-15).

**2.2 (2026-07-21):** Na pytanie użytkownika "czy są jeszcze jakieś
ważne portale, których brakuje?" — WYKONANO WŁASNĄ analizę luk (nie
czekano na kolejne wskazania). Przetestowano **bezprawnik.pl** (✅✅,
DR-02) — jeden z NAJBARDZIEJ rozpoznawalnych ogólnie portali prawnych
w Polsce, dotąd nieobecny mimo wielu tur budowy tego rejestru — wynik
DOSKONAŁY (cytaty art. 563 KC, art. 45 ustawy o kredycie konsumenckim,
wyrok SN II CK 291/05). Dodano NOWĄ sekcję "REKOMENDACJE DO ZBADANIA
W PRZYSZŁOŚCI" — przemyślana, WŁASNA lista kandydatów z uzasadnieniem
(nie przypadkowe nazwy), podzielona wg priorytetu: WYSOKI (kandydaci
dla wciąż niepokrytych DR-03/DR-05/DR-15), ŚREDNI (redundancja dla
już pokrytych dziedzin), NISKI (specjalistyczne nisze: nieruchomości
deweloperskie, perspektywa pracownika zamiast pracodawcy w DR-04,
prawo medialne jako możliwa nowa nisza analogiczna do NGO).

**2.1 (2026-07-21):** ⭐⭐⭐ NAJWAŻNIEJSZE ustalenie tej tury — na
pytanie użytkownika "czy wszystkie DR wiedzą o tej bazie portali?"
sprawdzono SYSTEMATYCZNIE (grep) WSZYSTKIE 16 DR-skilli: ŻADEN nie
odwoływał się do tego rejestru, ANI DO shared/HIERARCHIA-ZRODEL.md.
Sprawdzono również orkiestrator prawny-router-v3 — RÓWNIEŻ nie ładował
żadnego z tych plików. NAPRAWIONO: dodano OBA pliki do required_modules
w prawny-router-v3/SKILL.md — TERAZ każde wywołanie routera (a więc
każdy DR-skill uruchamiany przez router) ma dostęp do kategoryzacji
wiarygodności źródeł i rejestru portali. Dodatkowo zbadano portale:
**prawakonsumenta.uokik.gov.pl** (✅, Rząd 1 — oficjalny portal UOKiK,
GOTOWE wzory pism reklamacyjnych, potencjalnie przydatne dla pisma-
proste-v2) oraz **medonet.pl** — ⚠️ TEST NIEUDANY dwukrotnie (różne
frazy), zero wyników z tej domeny mimo że to znana marka ogólnie —
odnotowano UCZCIWIE bez fabrykowania wartości portalu.

**2.0 (2026-07-21):** Na polecenie użytkownika: zbadano cztery portale.
**epodatnik.pl** (✅, DR-06) — ⭐ ODMIENNA funkcja od reszty sekcji:
PRZESZUKIWALNE ARCHIWUM rzeczywistych interpretacji podatkowych (nie
serwis komentarzowy), z wyszukiwarką wg przepisu/PKWiU/hasła —
wartościowe jako alternatywa dla oficjalnej bazy EUREKA. **ngo.pl**
(✅✅, DR-02) — WYPEŁNIA CAŁKOWICIE NOWĄ niszę, dotąd nieobecną w
rejestrze: prawo organizacji pozarządowych (fundacje, stowarzyszenia),
z precyzyjnymi cytatami (art. 7 ustawy o fundacjach, art. 10a Prawa o
stowarzyszeniach). **parp.gov.pl** (✅, Rząd 1) — potwierdzona oficjalna
agencja rządowa (Polska Agencja Rozwoju Przedsiębiorczości), NIE 2B —
dotacje/dofinansowania dla firm, bardzo aktualne nabory z konkretnymi
terminami do 2026/2027.

**1.9 (2026-07-21):** Na polecenie użytkownika: zbadano trzy wskazane
portale. **egospodarka.pl** (✅✅, DR-06/02) — bardzo szeroka oferta
(Podatki/Firma/Finanse/Prawo), komentarze nazwanych ekspertów
kancelaryjnych — ⚠️ ODNOTOWANO ZASTRZEŻENIE: jeden znaleziony artykuł
oznaczony wprost "wygenerowane przez AI", wymaga tej samej ostrożności
co inne źródła AI-generowane w rejestrze. **farmer.pl** (✅✅, DR-10) i
**wiescirolnicze.pl** (✅✅, DR-10) — OBA WYPEŁNIAJĄ dotąd niepokryty
aspekt "ROLNICTWA" (czwarty człon nazwy DR-10, wcześniej reprezentowany
wyłącznie przez rynekzdrowia.pl skupione na zdrowiu/farmacji) — oba
mają dedykowane sekcje prawne, śledzą na bieżąco dopłaty ARiMR, KRUS,
oraz PEŁNĄ, aktualną sagę legislacyjną ustawy "Aktywny Rolnik" (projekt
→ Sejm → weto prezydenta → obowiązujące zasady 2026).

**1.8 (2026-07-21):** Kontynuacja poszukiwań na polecenie użytkownika,
w tym zbadanie wskazanego linku https://problemykryminalistyki.
policja.pl/. POTWIERDZONO (pobrano stronę bezpośrednio): to OFICJALNY
(Rząd 1) kwartalnik naukowy Centralnego Laboratorium Kryminalistycznego
Policji — NISZA ODMIENNA od reszty rejestru (kryminalistyka/metodologia
dowodowa, NIE ogólne prawo karne), ze STRUKTURĄ w pełni akademicką (rada
naukowa, recenzenci, kodeks etyki). Dodano do DR-16, ze SZCZEGÓLNYM
odesłaniem do `analizator-dowodow-v3`. Przy poszukiwaniu kolejnych
dużych portali prawnych ODKRYTO **palestra.pl** (✅✅, oficjalne
czasopismo Naczelnej Rady Adwokackiej, archiwum od co najmniej 2013 r.)
i **temidium.pl** (✅, Okręgowa Izba Radców Prawnych w Warszawie) — OBA
WYPEŁNIAJĄ konkretnie brakujący aspekt "ZAWODY PRAWNICZE" w DR-12
(etyka, forma wykonywania zawodu, relacje adwokat/radca), którego
wcześniej zweryfikowane rp.pl/gazetaprawna.pl (skupione na SĄDOWNICTWIE/
TK) nie pokrywały — DR-12 ma TERAZ podwójne, komplementarne pokrycie
obu aspektów dziedziny.

**1.7 (2026-07-21):** Na polecenie użytkownika o portalach dla służb
oraz kolejnych dużych, uznanych portalach prawnych: **defence24.pl**
(✅ zweryfikowany, DR-13 — ale z ISTOTNYM zastrzeżeniem: treści w
większości STARSZE [2013-2017], profil dziennikarsko-analityczny, NIE
głęboki komentarz prawny). DR-13 potwierdzone jako CZWARTA dziedzina
bez dominującego portalu 2B (dołącza do DR-03/05/15) — nisza
zdominowana przez oficjalne strony ABW/SKW. Przy okazji testowania
wyborcza.pl (⚠️ TEST NIEUDANY — zero wyników z tej domeny) ODKRYTO
**curia.europa.eu** — oficjalną bazę orzeczeń TSUE w języku polskim
(Rząd 1), która WYPEŁNIA częściowo DR-14, analogicznie do sytuacji
DR-16 (treść orzeczeń → źródło urzędowe, nie komentarz 2B). Dodano
**bankier.pl** (✅✅ zweryfikowany, DR-06 — silne śledzenie procesu
legislacyjnego na bieżąco, artykuły z dni nie tygodni). PO tej turze:
WSZYSTKIE 16 dziedzin DR + sekcja specjalna niepełnosprawności zostały
przebadane co najmniej raz — brak dziedzin całkowicie nietkniętych w
tym rejestrze.

**1.6 (2026-07-21):** Na wskazanie użytkownika (szukanie dużych,
autorytatywnych źródeł jak "Dziennik Gazeta Prawna" o wyrobionej
pozycji): zweryfikowano EMPIRYCZNIE dwa GENERALISTYCZNE, prestiżowe
dzienniki. **gazetaprawna.pl** (wydawca INFOR PL S.A.) — status
PODNIESIONY z 📚 (znane) na ✅✅ (w pełni zweryfikowane) — test na
"wyrok SN 2026" dał wynik doskonały, artykuły z BIEŻĄCEGO tygodnia,
precyzyjne sygnatury spraw. **rp.pl** (Rzeczpospolita) — NOWO dodane,
✅✅ — test na "wyrok TK" ujawnił GŁĘBOKĄ, wieloartykułową analizę
sporu ustrojowego wokół legitymacji Trybunału Konstytucyjnego
(sędziowie "dublerzy", publikacja wyroków w Dz.U.), z aktualizacjami
do czerwca 2026 i precyzyjnymi sygnaturami (SK 50/22, I KZP 5/23).
rp.pl WYPEŁNIA częściowo DR-12 (Sądownictwo/Prokuratura/Zawody
Prawnicze) — dziedzina PRZENIESIONA z "brak testu" do "potwierdzone".
Zaktualizowano podsumowanie: TYLKO DWIE dziedziny (DR-13, DR-14)
pozostają bez żadnego świeżego testu, zamiast trzech.

**1.5 (2026-07-21):** Na polecenie użytkownika o zbadaniu kolejnych DR
bez bazy portali: przetestowano TRZY dziedziny. DR-05 (Administracyjne)
— UCZCIWIE odnotowano BRAK dominującego portalu 2B (nisza zdominowana
przez firmy szkoleniowe i sklep Wolters Kluwer), analogicznie do DR-03.
DR-15 (Compliance) — RÓWNIEŻ brak dominującego portalu (nisza
zdominowana przez firmy doradcze typu "Wielka Czwórka" i treści
międzynarodowe; zgadywana domena "compliance.com.pl" okazała się
przypadkowym biurem księgowym). DR-16 (Orzecznictwo) — ODMIENNE,
WAŻNE ustalenie: brak portalu 2B TU NIE JEST luką — dla treści
orzeczeń WŁAŚCIWYM źródłem SĄ oficjalne bazy Rzędu 2A
(orzeczenia.ms.gov.pl, saos.org.pl), już znane systemowi — komentarz
2B przychodzi dopiero PO ustaleniu treści z wyższego rzędu.
Zaktualizowano podsumowanie: teraz TYLKO TRZY dziedziny (DR-12, 13, 14)
pozostają bez ŻADNEGO świeżego testu — WSZYSTKIE pozostałe 13 z 16 DR
mają już albo potwierdzony portal, albo uczciwie odnotowany, świadomy
brak dominującego źródła w danej niszy.

**1.4 (2026-07-21):** Na wskazanie użytkownika sprawdzono link
portal-sow.pfron.org.pl — POTWIERDZONO jako oficjalny portal PFRON
(Rząd 1, System Obsługi Wsparcia). Zbadano IPON i POPON: POPON
(popon.pl) potwierdzono jako realną organizację pracodawców osób
niepełnosprawnych (od 1995 r.) — ✅ dodano jako Rząd 2B z zastrzeżeniem
charakteru rzeczniczego (advocacy); przy okazji odkryto OBPON.org
(analogiczna organizacja). IPON (ipon.pl/ipon.org.pl) zweryfikowano
jako REALNY, długoletni portal (od 2002 r.), ALE UCZCIWIE odnotowano,
że to portal SPOŁECZNOŚCIOWY/RANDKOWY, NIE serwis prawny — NIE
kwalifikuje się jako źródło 2B dla analizy prawnej. Kontynuowano
poszukiwanie kolejnych portali 2B — dla DR-11 znaleziono ZDECYDOWANIE
lepszego kandydata niż wcześniejsze di.com.pl: **poradyodo.pl** (✅✅,
autorstwo radców prawnych, cytaty art. 37-39 RODO, treści datowane
czerwiec/lipiec 2026) — DR-11 PRZENIESIONE z kategorii "wynik mieszany"
do "potwierdzone". Zaktualizowano sekcję podsumowującą stan pokrycia:
teraz TYLKO SZEŚĆ dziedzin (DR-05, 12, 13, 14, 15, 16) pozostaje bez
świeżego testu, zamiast siedmiu.

**1.3 (2026-07-21):** Na polecenie użytkownika: dodano/potwierdzono
infor.pl (✅✅ doskonały wynik dla DR-06 przez subdomenę
ksiegowosc.infor.pl — bardzo aktualne, wyrok NSA z lutego 2026 r.,
KSeF, JPK_VAT — DRUGI, równoważny filar obok gofin.pl), podatki.biz
(✅ potwierdzony, DR-06, portal TaxNet). Przy okazji szerszego
wyszukiwania ODKRYTO organicznie DWA dedykowane portale dla DR-08
(samorzad.infor.pl, prawodlasamorzadu.pl) — RZADKI przypadek dziedziny
z DWOMA wyspecjalizowanymi portalami. Dodano OBSZERNĄ sekcję
"STAN POKRYCIA WSZYSTKICH 16 DR" — bezpośrednia, uczciwa odpowiedź na
pytanie użytkownika, KTÓRE dziedziny mają potwierdzony portal (DR-02,
04, 06, 07, 08, 09, 10 + niepełnosprawność), które mają wynik mieszany
(DR-04 dodatkowo, DR-11), która ŚWIADOMIE nie ma dominującego portalu
(DR-03), oraz KTÓRE siedem dziedzin (DR-05, 11, 12, 13, 14, 15, 16)
NADAL nie mają ŻADNEGO świeżego testu w tej sesji — wskazane jako
priorytet dla ewentualnej kolejnej tury.

**1.2 (2026-07-21):** Kontynuacja budowy na polecenie użytkownika —
prawo pracy, prawo karne/wykroczeniowe, budownictwo, gospodarka i
firmy. Zweryfikowano EMPIRYCZNIE: kodekspracy.pl (✅ doskonały, DR-04,
prawdopodobnie część rodziny GOFIN), muratorplus.pl (✅ doskonały,
DR-09, strona REGULACYJNA/proceduralna — komplementarna do
prawniknabudowie.com, które pokrywa spory KONTRAKTOWE), poradnik-
przedsiebiorcy.pl (✅ doskonały, DR-02, zakładanie spółek/JDG z
konkretnymi kwotami i terminami — UPGRADE statusu z 📚 na ✅). DLA
DR-03 (prawo karne/wykroczenia) — UCZCIWIE odnotowano BRAK jednego,
dominującego portalu redakcyjnego analogicznego do gofin.pl — niszę
zdominowały indywidualne blogi kancelaryjne (Rząd 3) i strony-rankingi
o wątpliwej wiarygodności — zalecono korzystanie z GENERALISTYCZNYCH
portali 2B z zawężonym zapytaniem zamiast poszukiwania jednego
specjalisty. Odnotowano RÓWNIEŻ nieudany test pb.pl (Puls Biznesu,
DR-02) — zapytanie zwróciło wyłącznie niepowiązane wyniki (Wikipedia,
baza LEI, szablony umów).

**1.1 (2026-07-21):** Dodano SEKCJĘ SPECJALNĄ dla osób niepełnosprawnych
(priorytet użytkownika) — zweryfikowano EMPIRYCZNIE niepelnosprawni.pl
(✅✅ wynik DOSKONAŁY — sekcja "Prawnik radzi" z cytatami konkretnych
sygnatur TK/SN i artykułów ustaw, np. TK SK 2/17) oraz integracja.org
(✅ ta sama platforma redakcyjna, dodatkowo audyty dostępności i
nazwany ekspert prawny). Odnotowano WYRAŹNE ostrzeżenie: niepelnosprawni.gov.pl
i gov.pl/web/rodzina to ORGANY RZĄDOWE (Rząd 1), NIE mylić z portalami
2B mimo podobnych nazw. Dodano też portalzp.pl (✅ zweryfikowane, DR-07
zamówienia publiczne, z zastrzeżeniem częściowej płatności treści).

**1.0 (2026-07-21):** Utworzenie rejestru na wyraźne żądanie
użytkownika. Przetestowano EMPIRYCZNIE (zapytania `site:` na żywo) sześć
portali: prawo.pl (✅ doskonały, ogólny), gofin.pl + 4 subdomeny (✅
doskonały, DR-06), prawniknabudowie.com (✅ dobry, DR-09, spory
kontraktowe), prawnikpodpowienabudowie.pl (✅ dobry, DR-09, ODRĘBNY od
DR-04, prawdopodobnie zorientowany na szkolenia/kalkulatory nie
artykuły), rynekzdrowia.pl (✅ doskonały, DR-10, bardzo aktualny),
di.com.pl (⚠️ ogólny wynik pozytywny, ale artykuły częściowo datowane
na 2018 r., DR-11, traktować jako kontekst nie główne źródło). Dla
POZOSTAŁYCH dziedzin (DR-02, DR-03, DR-05, DR-07, DR-08, DR-12, DR-13,
DR-14, DR-15, DR-16) wykorzystano ISTNIEJĄCĄ listę z `HIERARCHIA-
ZRODEL.md` (oznaczone 📚) oraz DODANO przykładowe wzorce nazw domen
typowych dla danej branży jako PUNKTY STARTOWE (oznaczone ⚠️ NIE
testowane) — UCZCIWIE nierozróżniane od faktycznie zweryfikowanych,
zgodnie z zasadą braku fabrykowania pewności.
