# PORTALE — część 3: DR-10 do DR-16

> Część pliku `PORTALE-BRANZOWE-RZAD-2B.md` (podział 2026-08-20, naprawa
> F-78 — plik źródłowy przekroczył 1000 linii). Pełny indeks i zasady
> użycia: zobacz plik nadrzędny w katalogu `shared/`. To NIE jest
> samodzielny skill — ładowany WYŁĄCZNIE przez indeks nadrzędny na
> żądanie właściwej grupy DR.

---

## DR-10 — Zdrowie, Farmacja, Żywność, Rolnictwo

| Portal | Specjalizacja | Status |
|---|---|---|
| rynekzdrowia.pl | Polityka zdrowotna, REFUNDACJA LEKÓW, farmacja — redakcja BARDZO aktualna (śledzi zmiany list refundacyjnych na bieżąco) | ✅ ZWERYFIKOWANE 2026-07-21 (test: refundacja leków — liczne, świeże, konkretne artykuły z nazwami substancji/dat wejścia w życie) |
| **farmer.pl** | ROLNICTWO — dedykowane sekcje "Prawo"/"Finanse i prawo"/"Przepisy i regulacje", dopłaty ARiMR, sankcje, interwencje RPO w sprawach warunkowości płatności | ✅✅ ZWERYFIKOWANE 2026-07-21 (test: dopłaty rolne ARiMR — wynik DOSKONAŁY, konkretne mechanizmy prawne [konflikt kontroli krzyżowej, warunkowość społeczna od 2025, sankcje BHP], cytaty stanowisk RPO) |
| **wiescirolnicze.pl** | ROLNICTWO — dedykowane sekcje "Prawo i finanse"/"Prawo dla rolnika", KRUS, ubezpieczenia upraw/zwierząt gospodarskich — redakcja BARDZO aktualna, śledzi PROCES LEGISLACYJNY na bieżąco | ✅✅ ZWERYFIKOWANE 2026-07-21 (test: ustawa dopłaty — wynik DOSKONAŁY, artykuły z marca 2026, PEŁNA saga ustawy "Aktywny Rolnik" [projekt→Sejm→WETO PREZYDENTA→aktualne zasady] śledzona krok po kroku) |
| termedia.pl (przykładowy wzorzec dla medycyny/prawa medycznego) | Prawo medyczne, czasopisma branżowe | ⚠️ NIE testowane w tej sesji, punkt startowy |
| medonet.pl | Zdrowie ogólnie — portal ZNANY z ogólnej wiedzy jako duży, popularny serwis medyczny | ⚠️ TEST NIEUDANY 2026-07-21 (DWUKROTNIE, różne frazy: "prawa pacjenta ubezpieczenie zdrowotne" i "NFZ refundacja recepta") — OBA razy zapytanie `site:medonet.pl` zwróciło ZERO wyników z tej domeny (wyłącznie źródła niepowiązane: dokumenty HHS.gov, Trustpilot, OpenStreetMap) — NIE POTWIERDZONO wartości tego portalu dla treści PRAWNEJ, mimo że jest znaną marką ogólnie — MOŻLIWE że medonet.pl NIE MA znaczącej treści prawnej/regulacyjnej (skupia się raczej na poradach zdrowotnych/lifestyle niż prawie), LUB indeksacja jest słaba — NIE polegaj na tym portalu bez POTWIERDZENIA innym sposobem |

### ⭐ Uwaga praktyczna

```
DR-10 miało DOTĄD tylko rynekzdrowia.pl (zdrowie/farmacja) — BRAKOWAŁO
dedykowanego pokrycia dla "ROLNICTWA" (czwarty człon nazwy dziedziny).
TERAZ farmer.pl i wiescirolnicze.pl WYPEŁNIAJĄ konkretnie ten aspekt —
oba śledzą NAJBARDZIEJ aktualne zagadnienia (ustawa "Aktywny Rolnik",
warunkowość społeczna WPR, KRUS) z PORÓWNYWALNĄ głębią do rynekzdrowia.pl
dla swojej niszy.
```

## DR-11 — Cyfrowe, Cyberbezpieczeństwo, AI, Dane, IP

| Portal | Specjalizacja | Status |
|---|---|---|
| **poradyodo.pl** | RODO/ochrona danych osobowych — portal DEDYKOWANY, kategoryzacja SEKTOROWA (RODO w IT, RODO w kadrach, RODO w oświacie, RODO w służbie zdrowia itd.), artykuły AUTORSTWA radców prawnych z cytatami konkretnych artykułów RODO (art. 37-39), BARDZO aktualna redakcja (treści datowane czerwiec/lipiec 2026) | ✅✅ ZWERYFIKOWANE 2026-07-21 (test: obowiązki inspektora ochrony danych — wynik DOSKONAŁY, ZDECYDOWANIE lepszy niż di.com.pl — ZASTĘPUJE di.com.pl jako GŁÓWNE źródło dla tej dziedziny) |
| **niebezpiecznik.pl** | Cyberbezpieczeństwo — BARDZO ZNANY, wieloletni polski portal (Marcin Maj i zespół), MOCNE pokrycie prawne: NIS2/KSC2 (Ustawa o Krajowym Systemie Cyberbezpieczeństwa) z cytatami artykułów (art. 49 kontrola, art. 37 RODO), śledzi GŁOŚNE sprawy (Morele.net/UODO z wyrokiem NSA) | ✅✅ ZWERYFIKOWANE 2026-07-21 (test: RODO/cyberbezpieczeństwo/prawo — wynik DOSKONAŁY, BARDZO aktualny, świadomość "mamy 2026 rok") — UZUPEŁNIA poradyodo.pl: TEN portal SILNIEJSZY w NIS2/cyberbezpieczeństwo, poradyodo.pl SILNIEJSZY w samym RODO |
| **wirtualnemedia.pl** (dział/tag "Prawo prasowe") | ⭐ NOWA NISZA — prawo MEDIALNE/prasowe/reklamowe: Prawo prasowe, relacja RODO↔działalność dziennikarska (WYJĄTEK art. 5-9 RODO dla dziennikarzy), orzecznictwo TSUE o reklamie śledzącej (IAB Europe/TCF) | ✅✅ ZWERYFIKOWANE 2026-07-21 (test: prawo prasowe/reklama/RODO — wynik DOSKONAŁY, BARDZO aktualny [wyrok TSUE 2024/2025], dedykowany tag tematyczny) — analogicznie do ngo.pl: WYPEŁNIA CAŁKOWICIE NOWĄ niszę (prawo medialne), dotąd nieobecną |
| gdpr.pl | RODO/IOD — portal z systemem TAGÓW tematycznych, ⚠️ NIE testowany bezpośrednio `site:` w tej sesji, ZNALEZIONY przy tym samym wyszukiwaniu co poradyodo.pl | 📚 znaleziony 2026-07-21, wymaga świeżego testu przed pierwszym użyciem |
| portalodo.com | RODO — blog kancelaryjny z NAZWANYMI autorami (adwokaci/radcy), format bardziej eseistyczny niż poradyodo.pl | 📚 znaleziony 2026-07-21, NIE testowany bezpośrednio |
| di.com.pl (Dziennik Internautów) | Tech ogólnie, w tym RODO/ochrona danych — ⚠️ UWAGA: część znalezionych artykułów DATOWANA na 2018 r. (moment wejścia RODO w życie) — ogólny ton dla SZEROKIEGO odbiorcy, NIE głęboka analiza prawnicza | ⚠️ ZWERYFIKOWANE 2026-07-21, ALE ZASTĄPIONE przez poradyodo.pl jako preferowane źródło — di.com.pl zachowaj JEDYNIE jako dodatkowy kontekst ogólnoinformacyjny |
| uke.gov.pl | Oficjalne (Rząd 1, organ) | patrz `shared/INTERPRETACJE-URZEDOWE.md` |

## DR-12 — Sądownictwo, Prokuratura, Zawody Prawnicze

| Portal | Specjalizacja | Status |
|---|---|---|
| **palestra.pl** | OFICJALNE czasopismo Naczelnej Rady Adwokackiej — WYPEŁNIA konkretnie "ZAWODY PRAWNICZE" (adwokatura), czego rp.pl/gazetaprawna.pl NIE pokrywały: relacje adwokat/radca prawny, etyka zawodowa, formy wykonywania zawodu (spółki, stosunek pracy), projekty ustaw korporacyjnych | ✅✅ ZWERYFIKOWANE 2026-07-21 — długoletnie czasopismo naukowo-zawodowe (archiwum sięga co najmniej 2013 r.), artykuły AUTORSTWA praktykujących adwokatów/profesorów prawa, z pełnymi przypisami naukowymi |
| **temidium.pl** | Serwis Okręgowej Izby Radców Prawnych w Warszawie — analogicznie do palestra.pl, ale dla ŚRODOWISKA radców prawnych (tajemnica zawodowa, przegląd prasy prawniczej) | ✅ ZWERYFIKOWANE 2026-07-21 |
| **rp.pl** (Rzeczpospolita) | Ustrój sądownictwa, TK, spory o legitymację sędziowską, orzecznictwo SN dot. wymiaru sprawiedliwości | ✅✅ ZWERYFIKOWANE 2026-07-21 (patrz sekcja "OGÓLNE, MIĘDZYDZIEDZINOWE" w `czesc-04-ogolne-metodologia.md` — szczegóły testu) |
| prawo.pl (dział Sądy/Prokuratura) | Ustrój sądownictwa, zawody prawnicze | 📚 znane, ta sama redakcja co testowana ✅ |
| gazetaprawna.pl | Orzecznictwo SN, sprawy karne/cywilne z udziałem sądów | ✅✅ ZWERYFIKOWANE (patrz sekcja "OGÓLNE" w `czesc-04-ogolne-metodologia.md`) |

### ⭐ Uwaga praktyczna

```
DR-12 ma TERAZ wyraźny PODZIAŁ kompetencyjny między portalami: rp.pl/
gazetaprawna.pl NAJLEPSZE dla SĄDOWNICTWA/TK (ustrój, orzecznictwo),
PODCZAS GDY palestra.pl/temidium.pl NAJLEPSZE dla ZAWODÓW PRAWNICZYCH
(etyka, forma wykonywania zawodu, spory międzykorporacyjne
adwokat/radca) — WYBIERZ portal wg TEGO, KTÓRY z dwóch aspektów
dziedziny dotyczy pytanie.
```

## DR-13 — Służby, Bezpieczeństwo, Informacje Niejawne

| Portal | Specjalizacja | Status |
|---|---|---|
| strazgraniczna.pl (oficjalny, nie 2B) | Rząd 1 — organ | patrz odrębne traktowanie |
| bip.abw.gov.pl, skw.gov.pl | Oficjalne (Rząd 1) — organizacja ochrony informacji niejawnych, spory kompetencyjne ABW/SKW | patrz `shared/INTERPRETACJE-URZEDOWE.md` |
| **gov.pl/web/kgpsp** (Komenda Główna Państwowej Straży Pożarnej) | ⛔ Rząd 1 — OFICJALNY portal PSP, dedykowana sekcja "Prawo" (menu "Co robimy"), KSRG (Krajowy System Ratowniczo-Gaśniczy), Prewencja, zarządzenia Komendanta Głównego | ✅ ZWERYFIKOWANE 2026-07-21 (pobrano stronę bezpośrednio, na wskazanie użytkownika) — TREŚĆ w WIĘKSZOŚCI aktualnościowo-wizerunkowa (zawody sportowe, apele, jubileusze OSP), sekcja "Prawo" NIE zbadana szczegółowo w tej turze — punkt startowy do pogłębienia |
| **bip.kgp.policja.gov.pl / edziennik.policja.gov.pl** (Komenda Główna Policji) | ⛔ Rząd 1 — OFICJALNY portal KGP, WŁASNY Dziennik Urzędowy KGP (od 2012 r. elektroniczny, edziennik.policja.gov.pl), zarządzenia Komendanta Głównego, status prawny | ✅ ZWERYFIKOWANE 2026-07-21 (przy okazji poszukiwania analogicznych portali służb) — WARTOŚCIOWE źródło DLA aktów WEWNĘTRZNYCH Policji (zarządzenia, regulaminy), NIE dla ogólnego prawa karnego (patrz DR-03 w `czesc-01-niepelnosprawni-dr02-dr04.md` dla tego) |
| **defence24.pl** | Bezpieczeństwo, obronność, służby specjalne — dziennikarstwo analityczno-branżowe (NIE głęboki komentarz prawny) | ✅ ZWERYFIKOWANE 2026-07-21 — ⚠️ ZASTRZEŻENIE: znalezione artykuły w WIĘKSZOŚCI STARSZE (2013-2017, dotyczące HISTORYCZNYCH procesów legislacyjnych) — profil BLIŻSZY dziennikarstwu bezpieczeństwa/obronności niż analizie prawnej; TRAKTUJ jako KONTEKST branżowy, NIE główne źródło prawne |

### ⭐ Uwaga o strukturze gov.pl (dodane 2026-07-21)

```
DLA DZIEDZINY DR-13 (i analogicznie dla INNYCH służb mundurowych)
WŁAŚCIWYM wzorcem NIE JEST portal 2B (komercyjny komentarz), lecz
STRUKTURA oficjalna gov.pl/web/[skrót] — KAŻDA służba/agencja RZĄDOWA
ma WŁASNY portal w TEJ strukturze (gov.pl/web/kgpsp, gov.pl/web/kgp
via policja.pl, analogicznie ABW/SKW/CBA) — z WŁASNYMI zarządzeniami,
czasem WŁASNYM Dziennikiem Urzędowym (jak KGP). TREŚĆ tych portali jest
jednak W PRZEWAŻAJĄCEJ części WIZERUNKOWO-INFORMACYJNA (aktualności,
zawody sportowe, jubileusze) — SEKCJA "Prawo"/zarządzenia WYMAGA
odrębnego, GŁĘBSZEGO zbadania niż strona główna, żeby ocenić
FAKTYCZNĄ przydatność merytoryczną.
```

### ⚠️ UCZCIWA OBSERWACJA (dodane 2026-07-21)

```
Test wyszukiwania "portal prawo informacje niejawne komentarz
ekspercki" NIE UJAWNIŁ dominującego portalu 2B — wyniki zdominowane
przez OFICJALNE strony organów (BIP ABW, SKW — Rząd 1) oraz
GENERALISTYCZNE bazy (lexlege.pl, LEX — już znane). JEDEN indywidualny
blog kancelaryjny (adwokatpazdan.pl) pojawił się, ale to Rząd 3.

WNIOSEK PRAKTYCZNY: DR-13 dołącza do DR-03/DR-05/DR-15 jako CZWARTA
dziedzina bez dominującego portalu 2B — PODOBNY wzorzec: dla spraw
службowych/bezpieczeństwa/informacji niejawnych PRIORYTETOWO korzystaj
z OFICJALNYCH źródeł (Rząd 1: BIP ABW, SKW) lub generalistycznych baz
(LEX/lexlege) z zawężonym zapytaniem, ZAMIAST szukać wyspecjalizowanego
komentarza.
```

## DR-14 — Prawo UE, Międzynarodowe, Prawa Człowieka

| Portal | Specjalizacja | Status |
|---|---|---|
| eur-lex.europa.eu | Rząd 1 — tekst prawa UE | (nie 2B, dla porządku) |
| **curia.europa.eu** | Rząd 1 — OFICJALNA baza orzeczeń Trybunału Sprawiedliwości UE (TSUE), z pełnymi tekstami wyroków, w tym w JĘZYKU POLSKIM | ✅ ODKRYTE 2026-07-21 (przy okazji testu innego portalu) — analogiczne do orzeczenia.ms.gov.pl (DR-16), ale dla poziomu UNIJNEGO — WYPEŁNIA CZĘŚCIOWO tę dziedzinę jako źródło TREŚCI orzeczeń (Rząd 1), NIE 2B |
| wyborcza.pl | GENERALISTYCZNY dziennik ogólnopolski | ⚠️ TEST NIEUDANY 2026-07-21 — zapytanie `site:wyborcza.pl wyrok Sąd Najwyższy` zwróciło WYŁĄCZNIE niepowiązane wyniki (dokumenty curia.europa.eu) — NIE potwierdzono wartości tego portalu, WYMAGA ponownego testu z inną frazą przed użyciem |
| euractiv.pl (przykładowy wzorzec) | Polityka UE, kontekst | ⚠️ NIE testowane w tej sesji, punkt startowy |

## DR-15 — Compliance, ISO, Governance, Audyt

| Portal | Specjalizacja | Status |
|---|---|---|
| prawo.pl (dział Compliance/ESG) | Compliance ogólnie | 📚 znane, ta sama redakcja co testowana ✅ |
> ⛔ **USUNIĘTO 2026-07-27** (ZASADA STAŁA): wcześniej tu był wpis sygnalista.pl — status ostatecznie NIEROZSTRZYGNIĘTY (niejasne, czy podmiot niezależny czy powiązany z dostawcą oprogramowania) — poza kategorią, usunięty zgodnie z nową zasadą rejestru.
| nik.gov.pl | Rząd 1 — organ (wystąpienia pokontrolne) | patrz `shared/INTERPRETACJE-URZEDOWE.md` |

### ⚠️ UCZCIWA OBSERWACJA (dodane 2026-07-21)

```
Test wyszukiwania compliance/whistleblowing NIE UJAWNIŁ dedykowanego,
polskiego portalu 2B — niszę zdominowały strony DUŻYCH firm
DORADCZYCH (KPMG, podobne "Wielka Czwórka") oferujące USŁUGI
(nie darmowe artykuły merytoryczne) oraz treści MIĘDZYNARODOWE
(angielskojęzyczne, niekoniecznie o polskim prawie). Zgadywana domena
"compliance.com.pl" okazała się WYŁĄCZNIE biurem księgowym o
przypadkowo pasującej nazwie — NIE portalem tematycznym.

WNIOSEK PRAKTYCZNY: analogicznie do DR-03/DR-05 — TRZECIA dziedzina w
tym rejestrze BEZ dominującego portalu 2B. Dla compliance/ISO/
governance korzystaj z prawo.pl (dział Compliance/ESG) z zawężonym
zapytaniem, oraz PAMIĘTAJ że wiele wartościowych treści o compliance
jest PUBLIKOWANYCH przez firmy doradcze jako MARKETING (materiał
promocyjny), NIE neutralny komentarz — zachowaj szczególną ostrożność
interpretacyjną.
```

## DR-16 — Pisma, Strategia, Dowody, Orzecznictwo

| Portal | Specjalizacja | Status |
|---|---|---|
| **problemykryminalistyki.policja.pl** | KWARTALNIK NAUKOWY Centralnego Laboratorium Kryminalistycznego Policji — NISZA ODMIENNA od reszty rejestru: KRYMINALISTYKA (metodologia dowodowo-śledcza — linie papilarne, badania dokumentów/podpisów biometrycznych, identyfikacja ofiar, metody popełnienia przestępstw), NIE ogólne prawo karne/komentarz przepisów | ✅✅ ZWERYFIKOWANE 2026-07-21 (pobrano stronę bezpośrednio) — Rząd 1 (oficjalna publikacja policyjna), STRUKTURA w pełni akademicka (rada naukowa, recenzenci, kodeks etyki, wskazówki dla autorów) — ⭐ SZCZEGÓLNIE WARTOŚCIOWE dla `analizator-dowodow-v3` (DR-16/moduły dowodowe) przy KONKRETNYCH pytaniach o METODOLOGIĘ badania śladów/dowodów, nie samo prawo dowodowe |
| standardyprawa.pl | Agregator orzeczeń/komentarzy przy przepisach | 📚 znane (HIERARCHIA-ZRODEL) |
| saos.org.pl | Wyszukiwarka orzeczeń sądów powszechnych (pomocnicza) | 📚 znane (HIERARCHIA-ZRODEL, Rząd 2A pomocniczo) |

### ⭐ USTALENIE ODMIENNE OD INNYCH "BRAKUJĄCYCH" DZIEDZIN (dodane 2026-07-21)

```
W PRZECIWIEŃSTWIE do DR-03/DR-05/DR-15 (gdzie brak portalu 2B jest
GENUINE LUKĄ) — DR-16 NIE WYMAGA komercyjnego portalu 2B w TEN SAM
sposób. Dla ORZECZNICTWA właściwym, NAJLEPSZYM źródłem SĄ oficjalne
bazy RZĄDU 2A, już dobrze znane systemowi:
  □ orzeczenia.ms.gov.pl (Portal Orzeczeń Sądów Powszechnych) —
    BEZPŁATNA, BEZWNIOSKOWA publikacja orzeczeń Z UZASADNIENIEM,
    wyszukiwanie wg podstawy prawnej i HASŁA tematycznego
  □ saos.org.pl (System Analizy Orzeczeń Sądowych) — wyszukiwarka
    setek tysięcy orzeczeń wg dowolnych kryteriów
  □ Portale orzeczeń KONKRETNYCH sądów (np. orzeczenia.warszawa.so.gov.pl)

TO NIE JEST luka wymagająca "portalu 2B" — sama NATURA tej dziedziny
(dostęp do TREŚCI orzeczeń) wymaga ŹRÓDŁA URZĘDOWEGO (Rząd 2A), NIE
komercyjnego komentarza (Rząd 2B) — komentarz/interpretacja PRZYCHODZI
DOPIERO PO ustaleniu treści orzeczenia z Rzędu 2A/1.
```

---

