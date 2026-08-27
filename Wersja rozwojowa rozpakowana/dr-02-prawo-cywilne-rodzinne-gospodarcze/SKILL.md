---
name: dr-02-prawo-cywilne-rodzinne-gospodarcze
version: "3.39"
description: "Prawo cywilne, rodzinne i gospodarcze: KC, KPC, spadki, rodzina, spółki, upadłość, restrukturyzacja, windykacja i odpowiedzialność kontraktowa/deliktowa."
---

> **Universal runtime:** przed wykonaniem zastosuj kanoniczny `shared/UNIVERSAL-RUNTIME-ADAPTER.md` z osobnego skilla `shared`. Lokalna sekcja adaptera poniżej jedynie go doprecyzowuje.


## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

Ta sekcja zmienia wyłącznie wykonanie operacji technicznych. Merytoryka dziedzinowa, mapy aktów, hard gate’y, kolejność modułów i kryteria jakości tego DR-skilla pozostają bez zmian.

1. `view dr-02-prawo-cywilne-rodzinne-gospodarcze/<plik>` oraz `view modules/...` / `view references/...` oznaczają świeży odczyt odpowiedniego lokalnego pliku tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.
2. `view shared/<plik>` oznacza świeży odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do tej paczki. Brak obowiązkowego zasobu shared = fail-closed, nie substytucja pamięcią modelu.
3. `view <inny-skill>/<plik>` oznacza aktywację/odczyt wskazanego osobnego skilla. Nie vendoryzuj innych skilli do tego ZIP-a.
4. `web_search` / `web_fetch` i podobne nazwy oznaczają świeże wyszukanie/odczyt online przez równoważną funkcję hosta. Zachowaj wymagane źródła oficjalne, statusy weryfikacji i zakaz cytowania prawa z pamięci.
5. `show_widget`, `visualize:read_me`, `present_files`, `create_file`, shell/Python i podobne operacje są nazwami semantycznymi. Jeśli host nie ma literalnego narzędzia, użyj równoważnej funkcji natywnej bez omijania bramek jakości.
6. `/mnt/user-data/...` oznacza rzeczywiste załączniki użytkownika dostępne w bieżącym hoście; wymagany ponowny odczyt ma być faktycznym odczytem źródła.

**Zasada nadrzędna:** instrukcje, które są już zrozumiałe i wykonalne w bieżącym hoście, wykonuj bez konwersji. Adapter działa wyłącznie na granicy runtime.


# DR-02 — Prawo Cywilne, Rodzinne i Gospodarcze

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

> Procedura szczegółowa (warstwa strukturalna SAOS/MCP, kontrakt sygnatur,
> gradient weryfikacji cytatu): `view shared/PRAWO-HARDGATE.md` — wczytaj
> PRZED pierwszym przepisem w każdej odpowiedzi. Integruje się z
> `shared/ISAP-AUDIT-PROTOCOL.md`.


> ⛔ **SELF-CHECK ANTY-FASADA — obowiązkowy przed wysłaniem odpowiedzi/pisma**
> (podłączone 2026-08-24, flaga F-115 P3 — zamknięcie zakresu 16 skilli DR):
>
> ```
> view shared/SELF-CHECK-ANTY-FASADA.md
> ```
>
> Sprawdza dwie rzeczy: (1) czy w tekście stoi „zweryfikowano", data weryfikacji
> albo URL przy przepisie, dla którego NIE wywołano narzędzia W TEJ ODPOWIEDZI;
> (2) czy znacznik statusu nie został nadany treści WYGENEROWANEJ w tej odpowiedzi
> (AF-6). Treść listy jest w module, nie tutaj — celowo, żeby nie powstało kolejne
> miejsce dryfu (7 wcześniejszych kopii rozjechało się ze źródłem przy pierwszej
> zmianie brzmienia).
>
> ⛔ Wyzwalaczem jest BRAK WYWOŁANIA NARZĘDZIA dla danego twierdzenia w danej
> odpowiedzi — nie brak narzędzi w sesji. Niedostępność ISAP nie zwalnia z
> oznaczenia, tylko je wymusza.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci modelu podczas sesji — każde brzmienie weryfikuj w ISAP**
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-PODMIOTY-WLASNOSC.md` — osoba fizyczna/prawna, przedsiębiorca,
  konsument, nieruchomość, posiadanie, własność, "rzecz" (art. 45 KC)
- `definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` — szkoda (damnum emergens/lucrum
  cessans), odpowiedzialność cywilna, odszkodowanie; ⚠️ NOWE: siła wyższa
  (brak def. ustawowej, 3 przesłanki SN) + rebus sic stantibus / art. 357¹ KC
  (4 przesłanki nieostre, tryb wyłącznie powództwem, granice modyfikacji umowy)
- `definicje/DEF-PROCEDURA.md` — termin zawity vs przedawnienie vs instrukcyjny,
  strona postępowania
- `definicje/DEF-CYWILNE-WYKLADNIA.md` — rękojmia vs gwarancja (reforma 2023)

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE: czynność prawna
  ukryta/pozorna (art. 83 KC — symulacja, dysymulacja, ochrona osoby trzeciej
  w dobrej wierze), wyłączenie sędziego/biegłego z powodu interesu własnego
  (art. 48-49/281 KPC + TK P 10/19), świadek i jego interes (art. 233/261 KPC)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-112 Faktyczne wspólne pożycie (art. 115 §11 KK — osoba najbliższa)
- BAS-119 Przedsiębiorca (Prawo przedsiębiorców art. 4)
- BAS-126 Zasiedzenie nieruchomości (art. 172 KC — przesłanki, dobra/zła wiara)
- BAS-127 Hipoteka (akcesoryjność, pierwszeństwo, wpis do KW)
- BAS-128 Bezpodstawne wzbogacenie (art. 405 KC — 4 przesłanki)
- BAS-W13 Niezgodność towaru z umową B2C (od 01.01.2023 — u.p.k. art. 43a-43n)
- BAS-W26 Szkoda / damnum emergens / lucrum cessans (art. 361 §2 KC)
- BAS-W27 Termin zawity vs przedawnienie vs instrukcyjny (KRYTYCZNE rozróżnienie)
- BAS-W28 Nadużycie prawa (art. 5 KC — zasada "czystych rąk")
- BAS-W30 Moc dowodowa dokumentu urzędowego vs prywatnego (art. 243-245 KPC)
- BAS-W31 Właściwość miejscowa sądu (ogólna, przemienna, wyłączna)
- BAS-W32 Przedawnienie po reformie 2018 (6 lat ogólny, terminy szczególne)
- BAS-W33 Kara umowna — miarkowanie (art. 484 §2 KC)
- BAS-W34 Odsetki: kapitałowe vs za opóźnienie vs handlowe (różne stopy!)
- BAS-W35 Nakaz zapłaty: sprzeciw vs zarzuty vs EPU (różne terminy/skutki)

## Moduły (56 łącznie — ✓ 56 OK, ☐ 0 STUB)

```
  [✓] OK    mod-transakcje-handlowe-opoznienia
              (F-108/46: rdzeń cywilny B; gałęzie administracyjne/historyczne częściowe)
  [✓] OK    mod-KPC-art162-zastrzezenie-protokol
              (art. 162 KPC oraz powiązania z art. 172 § 2¹ i art. 380)
  [✓] OK    mod-kaucja-najem-lokalu
              (kaucja przy najmie zwykłym i okazjonalnym)
```

**KOREKTA LICZNIKA 2026-08-14d:** poprzednia wartość („43” przy 42 modułach na dysku) była ZAWYŻONA O 1 JUŻ PRZED dodaniem mod-KPC-nieproces-czesc-ogolna — wykryte przy mechanicznej kontroli dysk/checklista. Po dodaniu nowego modułu rzeczywisty stan to 43 moduły i 43 wpisy [✓], zero modułów-widm.

**NAPRAWA 2026-08-14c:** dodano `mod-KPC-prawomocnosc-granice-
apelacji.md` — zamyka część F-65: prawomocność orzeczeń (365-366) i
granice apelacji (378, 380-386), dotąd bez podstawy prawnej mimo że
engine appellate-v8 z nich operacyjnie korzystał. PRZY OKAZJI
zweryfikowano: "deklaracja bez pokrycia" ws. sprzeciwu od referendarza
okazała się fałszywym alarmem — treść istnieje w pisma-proste-v2.

**NAPRAWA 2026-08-14b:** dodano `mod-KSH-organy-spolki-zoo.md` — zamyka
rdzeń F-68: organy sp. z o.o. (art. 201-254), najwyższy priorytet z
raportu KSH, najpopularniejsza forma spółki w praktyce.

**NAPRAWA 2026-08-14:** dodano `mod-PrRestr-dzial-VI-uklad.md` — zamyka
rdzeń F-69: Dział VI Prawa restrukturyzacyjnego (Układ, art. 150-179)
nie miał ani jednego numeru artykułu w systemie. Pełny opis: `audyt-
systemu-v4/references/AUDIT-JOURNAL.md`.

**NAPRAWA 2026-08-13b:** dodano `mod-ustawa-ochrona-praw-lokatorow-
najem-eksmisja.md` — wypełnienie luki strukturalnej wykrytej w audycie
zewnętrznym (standardowa procedura eksmisji dla 3 rodzajów najmu, dotąd
bez żadnego dedykowanego modułu). Jednocześnie uzupełniono treść
`mod-KRO-opieka-i-kuratela.md` (Dział I rozdz. III-IV + Dział II —
wcześniej oznaczone "punkt startowy", teraz pełne opracowanie art.
165-177 KRO). Pełny opis: `AUDIT-JOURNAL.md`, wpis
AUDYT-2026-08-13-DR02-WYPELNIENIE-LUK.

**NAPRAWA 2026-08-13:** poprzedni licznik "38 łącznie" już zliczał plik
`mod-KRO-opieka-i-kuratela.md` fizycznie na dysku, ale sam moduł nie był
wpisany do checklisty `[✓]` poniżej ani do `MAPA-AKTOW.md` — niespójność
wykryta w audycie zewnętrznym (nie przez `audyt-systemu-v4`), naprawiona
w tej sesji zgodnie z ZASADĄ 7 (kompletność dostawy).

**Aktualizacja 2026-08-12 (NOWY MODUŁ):** `mod-KRO-opieka-i-kuratela.md`
— Tytuł III KRO (art. 145-184), dotąd CAŁKOWICIE nieobecny —
ODRĘBNY od pieczy zastępczej (inna ustawa). Obejmuje: opiekę nad
małoletnim (hierarchia wyboru opiekuna art. 149, wymóg zezwolenia
sądu art. 156), opiekę nad ubezwłasnowolnionym całkowicie, oraz
SIEDEM rodzajów kurateli (art. 178-184, w tym rzadko omawiany
⭐⭐⭐ kurator dla dziecka poczętego art. 182, i kurator osoby
nieobecnej art. 184). Rozgraniczenie od kuratora sądowego
(ustawa z 2001 — inny zawód/funkcja).

```
  [✓] NOWY  mod-KRO-opieka-i-kuratela
              (dodany 2026-08-12 — NAPRAWA 2026-08-13: moduł istniał jako
               plik i był opisany w prozie powyżej, ale brakowało go w tej
               checkliście i w MAPA-AKTOW.md — status "widmowy", wykryty i
               zamknięty w ramach naprawy dokumentacji. Tytuł III KRO
               [art. 145-184]: opieka nad małoletnim [Dział I, hierarchia
               wyboru opiekuna art. 149, wymóg zezwolenia sądu art. 156],
               opieka nad ubezwłasnowolnionym całkowicie [Dział II, art.
               175-177 — treść SZCZEGÓŁOWA celowo NIE zbadana w tej
               transzy, oznaczona jako punkt startowy], siedem rodzajów
               kurateli [Dział III, art. 178-184, w tym kurator dla
               dziecka poczętego art. 182 i kurator osoby nieobecnej art.
               184]. ✅ UZUPEŁNIONE 2026-08-13b: Dział I rozdz. III-IV
               [art. 165-174, nadzór nad opiekunem, obowiązek
               sprawozdawczy roczny, zwolnienie opiekuna, rachunek
               końcowy] oraz Dział II [art. 175-177, odesłanie do
               Działu I, hierarchia opiekuna art. 176, ustanie z mocy
               prawa] — wcześniej oznaczone "punkt startowy", teraz
               pełne opracowanie. ⚠️ ROZGRANICZENIE: NIE dubluje mod-ubezwlasnowolnienie-
               opieka-kuratela.md [ten ostatni pokrywa PROCEDURĘ
               ubezwłasnowolnienia z KC/KPC oraz hierarchię opiekunów
               z art. 176 KRO w PEŁNYM opracowaniu] — mod-KRO-opieka-i-
               kuratela.md jest szerszym opracowaniem STRUKTURY całego
               Tytułu III KRO i explicite odsyła do tamtego modułu przy
               Dziale II, bez powielania treści. Rozgraniczenie także od
               mod-piecza-zastepcza-rodzina-zastepcza.md [odrębna ustawa,
               nie KRO] — zaznaczone już w treści modułu.)
  [✓] NOWY  mod-ustawa-ochrona-praw-lokatorow-najem-eksmisja
              (dodany 2026-08-13 — naprawa luki strukturalnej: pełna
               regulacja najmu zwykłego/okazjonalnego/instytucjonalnego,
               trzy różne limity kaucji [12x zwykły, 6x okazjonalny/
               instytucjonalny — POPRAWKA względem wcześniejszej
               uproszczonej wzmianki w mod-KW], art. 16 okres ochronny
               1.11-31.03 i jego wyjątki, art. 1046 §5¹ KPC, art. 678
               KC. Rozgraniczone od "dzikiego lokatora" [już pokryte w
               mod-KC-cywilne-zobowiazania-odpowiedzialnosc, bez
               duplikacji])
  [✓] NOWY  mod-KW-ksiega-wieczysta-zakup-nieruchomosci
              (dodany 2026-08-12, na żądanie użytkownika — dotąd
               CAŁKOWICIE nieobecny temat: rękojmia wiary publicznej
               ksiąg wieczystych (art. 5-9 KWiH), struktura 4 działów,
               mechanizm wzmianki, przedawnienie roszczeń z najmu
               art. 677/118 KC. Zbadany na podstawie materiałów
               zewnętrznej kancelarii marketingowej — TRAKTOWANYCH
               wyłącznie jako lista tematów, NIE źródło prawa —
               wszystko zweryfikowane niezależnie.)
  [✓] NOWY  mod-ustawa-frankowa-2026-procedura
              (dodany 2026-08-07, na żądanie użytkownika — ustawa z
               29.05.2026, weszła w życie 7.08.2026, łapie sprawy w
               toku, posiedzenia niejawne fakultatywne, decyzja
               każdorazowo sędziego referenta)
  [✓] NOWY  mod-sklad-sadu-liczba-sedziow
              (dodany 2026-08-07, na żądanie użytkownika — pełne
               zestawienie składów wieloosobowych KPC/KPK, w tym
               JEDYNY stały skład 5-osobowy: apelacja/kasacja od
               wyroku dożywocia, art. 30 §2 KPK)
  [✓] NOWY  mod-liczba-pelnomocnikow-strona-samodzielna
              (dodany 2026-08-05, na żądanie użytkownika — KPC bez
               limitu liczby pełnomocników [niezależnie od szczebla
               sądu], KPK max 3 obrońców, strona samodzielna od
               reformy 2005 r. — osłabione pouczenia sądu)
  [✓] NOWY  mod-parabanki-chwilowki-lombardy-lichwa
              (dodany 2026-08-05, na żądanie użytkownika — parabanki
               bez definicji prawnej, nadzór KNF od 1.01.2024, MPKK
               art. 36a ukk, ⚡ nowa ustawa lombardowa/projekt, lichwa
               art. 304 KK trzy typy + wyzysk art. 388 KC)
  [✓] NOWY  mod-pies-droga-rowerowa-odpowiedzialnosc
              (dodany 2026-08-04, na żądanie użytkownika — art. 431
               KC, odpowiedzialność właściciela psa za kolizję na
               drodze rowerowej niezależnie od smyczy, przyczynienie
               się rowerzysty, zasady pierwszeństwa C-13/C-16 —
               patrz WARN-OTWARTE.md F-15 dla nierozstrzygniętej
               rozbieżności źródeł co do jednego aspektu)
  [✓] NOWY  mod-ustawa-kredyt-konsumencki-SKD
              (dodany 2026-08-04, Reguła 7 audyt-systemu-v4, na wniosek
               użytkownika: Sankcja Kredytu Darmowego, art. 45 u.k.k.
               — katalog naruszeń art. 30/29/31-33/33a/36a-36c, spór
               o "wykonanie umowy" art. 45 ust. 5 [TSUE C-744/24,
               C-828/25 w toku], procedura 2-etapowa oświadczenie+pozew,
               integracja z pisma-proste-v2 [SPM], analizator-umow-v1
               [J4] i analizator-dowodow-v3 [MX KREDYT-SKD]. AUDYT
               DODATKOWY: naprawiono phantom mapping w ROUTING-MAP.md —
               "Ustawa o kredycie konsumenckim" wskazywała błędnie na
               mod-ustawa-deweloperska)
  [✓] OK    mod-KC-cywilne-zobowiazania-odpowiedzialnosc
              (✅ PODZIELONY 2026-08-20 — naprawa F-78, priorytet 9
               [1395 linii, urosło z pierwotnych 1036 przy skanie F-78]:
               plik pod NIEZMIENIONĄ nazwą stał się indeksatorem [183
               linie, zachowuje CORE/INTAKE/PROCEDURA stosowane zawsze],
               treść 22 sekcji przeniesiona do 8 plików w podkatalogu
               `kc-zobowiazania/` [max 329 linii/plik: Aneks D
               służebności]. Zweryfikowano 100% integralność [22
               nagłówki = 25 oryginału minus 3 pozostające w indeksie].
               Naprawiono 1 odesłanie cross-file [bezumowne korzystanie
               → osobny plik po podziale])
              (✅ ROZBUDOWANO 2026-08-20 — sekcja 8, skarga pauliańska:
               dodano 5 zweryfikowanych orzeczeń SN 2021-2025 na
               podstawie materiału Wolters Kluwer, każde potwierdzone
               niezależnie w 3+ źródłach [Rząd 2] przed wpisaniem: III
               CZP 9/24 [model bilansowy, hipoteka NIE wyklucza skargi],
               I CSK 3618/23 [wielokrotne rozporządzenia], III CZP 60/19
               [REWOLUCJA — wyrok pauliański jako tytuł egzekucyjny
               przeciwko osobie trzeciej wprost, zmiana redakcji
               sentencji], III CZP 32/22 [osłabienie pozycji wobec
               wierzycieli hipotecznych osoby trzeciej], III CZP 84/22
               [legitymacja wierzyciela mimo upadłości dłużnika —
               konkurencja z syndykiem]. ⚠️ 3 pozycje z materiału
               źródłowego jawnie NIE dopisane — niezweryfikowane
               niezależnie w tej sesji [I CSK 1119/23, V CSK 13/18, V
               CSK 321/15] — plus art. 13f KSCU potwierdzony, ale nie
               zintegrowany z regułami kosztów w tym module)
  [✓] OK    mod-KC-spadki
              (⭐ PODZIELONY 2026-08-21, ZASADA 13 / F-105 — 1036 l. przekraczało
               próg; plik zachowuje nazwę jako indeksator, zostaje z dziedziczeniem
               ustawowym, formami testamentu, przyjęciem/odrzuceniem i STRATEGIĄ)
  [✓] NOWY  mod-KC-spadki-zachowek-dzial-rozrzadzenia
              (wydzielony 2026-08-21 — zachowek [991-1011], dział spadku
               [1035-1046 KC + 680-689 KPC], zapis zwykły i windykacyjny,
               polecenie, wykonawca testamentu, wydziedziczenie, niegodność)
  [✓] NOWY  mod-KC-spadki-dlugi-umowy-transgraniczne
              (wydzielony 2026-08-21 — odpowiedzialność za długi [1030-1034³],
               umowy o spadek i zrzeczenie [1047-1057], gmina/Skarb Państwa [935],
               spadki transgraniczne i EPS, gospodarstwa rolne, spis inwentarza)
              (v2.0, rozbudowane 2026-07-19: zapis zwykły/windykacyjny,
               polecenie testamentowe, wykonawca testamentu,
               wydziedziczenie [odróżnione od niegodności dziedziczenia],
               pełna odpowiedzialność za długi spadkowe, zrzeczenie się
               dziedziczenia, BRAK SPADKOBIERCÓW — dziedziczenie przez
               gminę/Skarb Państwa art. 935 KC [odpowiedź na pytanie
               użytkownika]; spadki transgraniczne/EPS i dziedziczenie
               gospodarstw rolnych oznaczone jako punkt startowy)
  [✓] OK    mod-KC-konsumenckie
  [✓] OK    mod-KC-ubezpieczenia
  [✓] NOWY  mod-KC-kredyty-frankowe
  [✓] OK    mod-KRO-rodzinne
              (✅ PODZIELONY 2026-08-20 — naprawa F-78, priorytet 6
               [1647 linii]: plik pod NIEZMIENIONĄ nazwą stał się
               indeksatorem [110 linii, zachowuje ALERT LEGISLACYJNY +
               FAZĘ 0 + TRYBY KWALIFIKATOR stosowane zawsze], treść 32
               sekcji przeniesiona do 8 plików w podkatalogu
               `kro-rodzinne/` [max 341 linii/plik], pogrupowanych
               tematycznie: małżeństwo/ustrój majątkowy, rozwód/
               separacja/eksmisja, podział majątku, alimenty [5
               kategorii razem], pochodzenie dziecka [macierzyństwo/
               ojcostwo/surogacja razem], rodzice-dzieci/władza/OZSS,
               procedura/dowody/zmiana danych, referencje/strategia.
               Zweryfikowano 100% integralność [32 nagłówki = 35
               oryginału minus 3 pozostające w indeksie]. Naprawiono
               przy okazji: 1 odesłanie cross-file [POKREWIEŃSTWO →
               OBOWIĄZEK ALIMENTACYJNY] i 1 PRZEDTEM ISTNIEJĄCĄ
               nieścisłość nazwy sekcji [odesłanie do "OPŁATY SĄDOWE"
               zamiast właściwej "KALKULATOR" — treść była zawsze w tym
               samym pliku, więc lokalizacja nie była błędna, tylko
               nazwa])
              (rozbudowany 2026-07-19: dodano EKSMISJĘ MAŁŻONKA [art. 58
               §2-4, z zastrzeżeniem SN że nie zastępuje podziału
               majątku], OBOWIĄZEK ALIMENTACYJNY szerszego kręgu
               [dziadkowie-wnuki, rodzeństwo, zasada pomocniczości],
               SUROGACJĘ [zasada mater semper certa est, szara strefa
               prawna], KONKUBINAT [praktyczne braki i narzędzia
               ochrony], ZMIANĘ IMIENIA I NAZWISKA [ustawa 2008,
               odrębna od art. 59 KRO])
  [✓] OK    mod-ubezwlasnowolnienie-opieka-kuratela
              (dodany 2026-07-19: ubezwłasnowolnienie całkowite/
               częściowe [art. 13/16 KC], procedura, hierarchia
               opiekunów [art. 176 KRO], SYTUACJA BRAKU RODZINY —
               mechanizm przerzucenia poszukiwania opiekuna na OPS/MOPS
               [stały nabór kandydatów], kuratela dla osoby
               niepełnosprawnej art. 183 KRO jako instytucja odrębna.
               Odpowiedź na szczegółowe pytanie użytkownika)
  [✓] OK    mod-KRO-zawarcie-malzenstwa-bigamia-transgraniczne
              (rozbudowany 2026-07-19: dodano sekcje SEPARACJA
               [art. 61¹-61⁶, różnice od rozwodu — rozkład tylko
               zupełny nie trwały, brak zakazu ponownego małżeństwa
               NIE działa — działa ODWROTNIE], USTRÓJ MAJĄTKOWY
               MAŁŻEŃSKI/INTERCYZA [art. 31-54, katalog zamknięty
               ustrojów], USTALENIE OJCOSTWA [uznanie + sądowe,
               odrębne od zaprzeczenia, + zapowiedziana reforma 2026
               domniemania z art. 62] — w pliku mod-KRO-rodzinne.md)
  [✓] OK    mod-KRO-przysposobienie-adopcja-miedzynarodowa
              (nadrobienie zaległości w SKILL.md — moduł już istniał:
               przysposobienie krajowe [3 rodzaje: pełne/niepełne/
               całkowite], przysposobienie międzynarodowe wg Konwencji
               haskiej 1993 [zasada subsydiarności, oba kierunki —
               cudzoziemiec w Polsce / Polacy za granicą], pasierb
               transgraniczny)
  [✓] OK    mod-piecza-zastepcza-rodzina-zastepcza
              (dodany 2026-07-19: piecza zastępcza jako instytucja
               ODRĘBNA od przysposobienia [opieka czasowa, więź prawna
               z rodziną biologiczną trwa], rodzaje [spokrewniona —
               "adopcja przez rodzinę" w potocznym rozumieniu,
               niezawodowa, zawodowa w 3 wariantach, rodzinny dom
               dziecka], procedura umieszczenia, zasada nierozdzielania
               rodzeństwa nawet transgranicznie. Odpowiedź na pytanie
               użytkownika o "opiekę zastępczą")
              (dodany 2026-07-19: zawarcie małżeństwa [forma cywilna/
               konkordatowa, przeszkody małżeńskie], bigamia [pełne
               opracowanie cywilne + karne, konwalidacja], małżeństwo
               zagraniczne [locus regit actum, transkrypcja, klauzula
               porządku publicznego], bigamia zagraniczna w kraju
               dopuszczającym, małżeństwo jednopłciowe [PRZEŁOMOWY
               wyrok TSUE C-713/23 z 25.11.2025 + NSA z 20.03.2026 —
               obowiązek transkrypcji dla par UE, temat żywy/sporny
               politycznie]. Odpowiedź na pytanie użytkownika)
              (v1.1.0 2026-07-02: +mediacja rozwodowa art.436/445² KPC,
               +OZSS rozszerzone, +świadkowie w sprawach rozwodowych —
               pointer do shared/MOD-ATAK-NA-SWIADKA.md, bez duplikacji)
  [✓] OK    mod-KSH-spolki-handlowe
  [✓] NOWY  mod-KSH-organy-spolki-zoo
              (dodany 2026-08-14 — naprawa F-68: KSH Tytuł III, Dział
               I, Rozdz. 3, art. 201-254. Zarząd [201-211 — dwie
               funkcje: prowadzenie spraw + reprezentacja, zakaz
               ograniczenia reprezentacji wobec osób trzecich art.
               204 §2, konflikt interesów art. 209], zgromadzenie
               wspólników [227-254 — tryb obiegowy, kompetencje
               zastrzeżone art. 228/absolutorium, progi uchwał 229/
               230, zwyczajne vs nadzwyczajne, zastępcze zwołanie
               przez radę nadzorczą art. 235 §2]. Rozgraniczone od
               mod-KSH-spolki-handlowe [art. 299, zaskarżanie uchwał
               — NIE duplikować])
              (rozbudowany 2026-07-19: KONTROLA PRZEDSIĘBIORCY [Rozdział
               5 Prawa przedsiębiorców — zawiadomienie 7-30 dni, sprzeciw
               3 dni robocze, zakaz podwójnej kontroli] + REGLAMENTACJA
               DZIAŁALNOŚCI [koncesja/zezwolenie/wpis do rejestru
               regulowanego — z kluczową różnicą: koncesja jest UZNANIOWA,
               pozostałe dwie NIE])
  [✓] OK    mod-reklama-wobec-nieletnich
              (nadrobienie zaległości w SKILL.md — moduł już istniał)
  [✓] OK    mod-prawo-wekslowe-czekowe
              (dodany 2026-07-19: struktura Prawa wekslowego/czekowego
               1936, elementy konieczne weksla własnego/trasowanego,
               weksel in blanco i deklaracja wekslowa [ciężar dowodu na
               dłużniku], indos, awal, protest, TRZY różne terminy
               przedawnienia wg adresata roszczenia, różnice weksel/czek.
               Odpowiedź na audyt pokrycia prawa gospodarczego)
  [✓] OK    mod-wekslowe-kontrola-przedsiebiorcy-koncesje
              (dodany 2026-07-19: Prawo wekslowe/czekowe 1936
               [essentialia negotii, indos, aval, protest, weksel in
               blanco], kontrola przedsiębiorcy [Rozdział 5 Prawa
               przedsiębiorców — terminy 7-30 dni, katalog wyjątków,
               książka kontroli, sprzeciw], działalność regulowana/
               koncesjonowana [3 poziomy reglamentacji, zasada
               subsydiarności koncesji]. Odpowiedź na audyt pokrycia
               prawa gospodarczego)
  [✓] OK    mod-KSH-wrogie-przejecie-obrona-bialy-rycerz
              (dodany 2026-07-18: brak definicji ustawowej "wrogiego
               przejęcia" — termin ekonomiczny; techniki obrony
               prewencyjne (zapisy statutowe, akcje nieme/uprzywilejowane,
               złote spadochrony) i reaktywne (biały rycerz — z
               zastrzeżeniem że to wciąż przejęcie, tylko friendly;
               zatruta pigułka, MBO). Odpowiedź na pytanie użytkownika)
  [✓] NOWY  mod-KSH-spolki-osobowe-rada-nadzorcza
              (dodany 2026-08-20 — naprawa F-68: spółki osobowe [art.
               22-124] i rada nadzorcza sp. z o.o. [art. 212-226],
               dotąd opisane wyłącznie 1-wierszową tabelą bez podstawy
               prawnej. Spółka jawna: odpowiedzialność solidarno-
               subsydiarna [art. 22, 31], prowadzenie spraw vs
               reprezentacja [art. 37-47, rozróżnienie wewnętrzne/
               zewnętrzne], zakaz konkurencji [art. 56-57], rozwiązanie
               i wystąpienie wspólnika [art. 58-66, mechanizm przejęcia
               majątku przy 2 wspólnikach]. Spółka komandytowa: dwie
               role wspólników [art. 102], odesłanie do spółki jawnej
               [art. 103], sankcja firmy za nazwisko komandytariusza
               [art. 104], suma komandytowa i wolność w granicach
               wkładu [art. 111-112], komandytariusz WYŁĄCZNIE jako
               pełnomocnik + sankcja art. 118 §2. Rada nadzorcza sp.
               z o.o.: próg obligatoryjności 500k zł/25 wspólników
               [art. 213], zakaz łączenia funkcji, zakaz wiążących
               poleceń zarządowi [art. 219 §2], rozszerzenie uprawnień
               i zawieszenie członka zarządu [art. 220]. ⚠️
               [NIEWERYFIKOWANE RZĄD 1] większość treści)
  [✓] OK    mod-PrUpad-upadlosc-restrukturyzacja
              (⭐ PODZIELONY 2026-08-21, ZASADA 13 — plik zachowuje nazwę
               jako indeksator; Tytuł Va + Tytuł VII Dział I + Tytuł IX
               wydzielone do mod-PrUpad-uklad-likwidacja-zakonczenie)
  [✓] NOWY  mod-PrUpad-uklad-likwidacja-zakonczenie
              (wydzielony 2026-08-21 z modułu wyżej — podział WYPRZEDZAJĄCY
               przed dalszymi transzami F-86: układ w upadłości [266a-266f],
               likwidacja masy Dział I [306-315], zakończenie i umorzenie
               postępowania [361-372])
  [✓] NOWY  mod-PrUpad-likwidacja-miedzynarodowe-szczegolne
              (dodany 2026-08-26 — częściowe uzupełnienie F-86: likwidacja [316-334],
               postępowanie międzynarodowe [378-417], postępowania po
               śmierci dłużnika i wobec deweloperów [418-425s])
  [✓] NOWY  mod-PrRestr-dzial-III-nadzorca-zarzadca
              (dodany 2026-08-19 — naprawa F-87 priorytet 1: Dział III
               PrRestr, art. 23-64. Struktura 4 rozdziałów + tabela
               kwalifikatora organu wg trybu postępowania; Rozdz. 1
               przepisy ogólne [wymogi licencji, odpowiedzialność
               cywilna + obowiązkowe OC, czas trwania funkcji,
               mediacja]; Rozdz. 2 nadzorca układu [wynagrodzenie
               umowne z limitem dla mikroprzedsiębiorców]; Rozdz. 3
               nadzorca sądowy [art. 39 — sankcja NIEWAŻNOŚCI za
               czynność bez zgody, katalog obowiązków, wzór
               wynagrodzenia 2x-44x podstawy, redukcja do 40% przy
               niepowodzeniu]; Rozdz. 4 zarządca [art. 52-53 — pełne
               przejęcie zarządu masą sanacyjną, działanie we własnym
               imieniu na rachunek dłużnika]. ⚠️ Oddział 2 Rozdz. 4
               [wynagrodzenie zarządcy] — luka całkowita, świadomie
               oznaczona, priorytet dla kolejnej sesji)
  [✓] NOWY  mod-PrRestr-dzial-IV-uczestnicy-wierzyciele
              (dodany 2026-08-19 — naprawa F-87 priorytet 2: Dział IV
               i V PrRestr, art. 65-149. ⭐ Fundamentalna różnica vs
               PrUp: BRAK instytucji zgłoszenia wierzytelności — spis
               sporządzany Z URZĘDU przez nadzorcę/zarządcę; Rozdz. 1
               definicje [wierzytelność bezsporna/sporna, art. 65 ust.
               7 sankcja utraty uprawnień]; Rozdz. 2 spis wierzytelności
               [art. 90-94 sprzeciw dłużnika/wierzyciela, termin 14 dni,
               art. 102 spis z klauzulą wykonalności = tytuł wykonawczy];
               Rozdz. 3 zgromadzenie wierzycieli [art. 104-105 zwołanie,
               art. 107 prawo głosu i waga kapitałowa, art. 113 quorum
               1/5 i próg 2/3 przyjęcia układu]; Rozdz. 4 rada
               wierzycieli [skład 5+2, art. 128 szeroki katalog
               kompetencji w tym zezwolenie na kredyt/sprzedaż
               nieruchomości pod rygorem nieważności, art. 133 uchwała
               w pełnym składzie może wymusić zmianę nadzorcy/zarządcy].
               ⚠️ Dział V [pomoc publiczna] — luka niemal całkowita,
               PLUS wykryte ryzyko przestarzałego odesłania do
               uchylonego rozporządzenia UE 659/1999, priorytet WYSOKI
               dla kolejnej sesji)
  [✓] NOWY  mod-PrRestr-dzial-V-pomoc-publiczna
              (dodany 2026-08-20 — naprawa F-87 priorytet 3: Dział V
               PrRestr, art. 140-149 [139a uchylony 2020]. Test
               prywatnego wierzyciela/inwestora [art. 140]; cele i
               warunki pomocy [art. 141-142, 4 przesłanki kumulatywne];
               zasada "one time, last time" — limit 10 lat z 3
               wyjątkami [art. 143]; wkład własny i środki wyrównujące
               [art. 144-145]; wyjątek dla usług w ogólnym interesie
               gospodarczym [art. 146]; próg 10 mln EUR zwalniający z
               notyfikacji KE dla MŚP [art. 148, przesłanki
               kumulatywne]. ⚠️ [NIEWERYFIKOWANE RZĄD 1] — ISAP
               niedostępny w tym środowisku, treść oparta na 4
               zgodnych źródłach RZĄD 2/3. ⚠️ Ryzyko przestarzałego
               odesłania do uchylonego rozporządzenia UE 659/1999
               [odnotowane wcześniej przy mod-dzial-IV] — NIE
               zweryfikowane w tej sesji, priorytet dla kolejnej.
               ⚠️ Ustawa z 16.07.2020 o pomocy publicznej w celu
               ratowania/restrukturyzacji [dawna materia art. 139a]
               — CAŁKOWICIE nieobecna w systemie, kandydat na nową
               flagę)
  [✓] NOWY  mod-ustawa-pomoc-ratowanie-restrukturyzacja-przedsiebiorcow
              (dodany 2026-08-20 — naprawa F-98: ustawa z 16.07.2020
               [Dz.U. 2020 poz. 1298], akt CAŁKOWICIE nieobecny w
               systemie mimo bezpośredniego związku z Działem V PrRestr
               [art. 50 tej ustawy uchyla dawny art. 139a PrRestr].
               5 rozdziałów, art. 1-53: pomoc na ratowanie [pożyczka,
               oprocentowanie stopa bazowa KE +4pp], tymczasowe wsparcie
               restrukturyzacyjne [WYŁĄCZNIE MŚP, eskalacja do 18 mies.],
               pomoc na restrukturyzację [formy debt-to-equity, limit
               wynagrodzeń zarządu 400% średniej, odesłanie wprost do
               art. 145 PrRestr]. ⚠️ [NIEWERYFIKOWANE RZĄD 1] — ISAP
               niedostępny, treść oparta na 4 zgodnych źródłach RZĄD 2/3.
               ⚠️ Numer aktualnego t.j. NIE potwierdzony)
  [✓] NOWY  mod-PrRestr-dzial-VII-uklad-czesciowy
              (dodany 2026-08-20 — naprawa F-87, ostatni priorytet z
               pierwotnego zakresu: Dział VII PrRestr, art. 180-188.
               Kryteria wyodrębnienia wierzycieli [art. 180, trójwarunkowy
               test + zakaz manipulacji]; katalog przykładowy
               wierzytelności [art. 181]; zakaz pokrzywdzenia wierzycieli
               nieobjętych + bezskuteczność zabezpieczeń przy upadłości
               w ciągu roku [art. 183]; zastrzeżenia wierzyciela
               nieobjętego [art. 185]; próg głosowania 2/3, bardziej
               restrykcyjny niż art. 119 wg doktryny [art. 186]; zakres
               podmiotowy — art. 166 ust. 1 NIE stosuje się, inaczej niż
               przy układzie zwykłym [art. 187]; zażalenie wierzyciela
               nieobjętego ograniczone do zarzutów art. 180/183 [art.
               188]. ⚠️ [NIEWERYFIKOWANE RZĄD 1]. Rekomendacja: F-87
               pierwotny zakres W CAŁOŚCI zamknięty — pozostałe segmenty
               PrRestr [Dział VIII, Tytuł III-IV] kandydują na NOWĄ
               flagę zamiast rozszerzania F-87)
  [✓] NOWY  mod-PrRestr-dzial-VI-uklad
              (dodany 2026-08-14 — naprawa F-69: Dział VI PrRestr,
               art. 150-179. Przepisy ogólne [150-154, wierzytelności
               wyłączone z układu — stosunek pracy wymaga zgody],
               propozycje układowe [155-163, katalog technik
               restrukturyzacji, ochrona minimum wynagrodzenia],
               głosowanie i zatwierdzenie [art. 119 — podwójny próg
               50%/2/3, mechanizm cramdown, test zaspokojenia — nowość
               23.08.2025, art. 165 — przesłanki odmowy zatwierdzenia
               w tym kryterium ochrony najlepszych interesów
               wierzycieli], skutki układu [166 — moc wiążąca mimo
               pominięcia w spisie])
  [✓] NOWY  mod-ustawa-doradca-restrukturyzacyjny-zawod
              (Dz.U. 2022 poz. 1007 [licencja, sprawdź nowszy t.j.] +
               Pr. upadłościowe Dz.U. 2025 poz. 614 art. 157 + Pr.
               restrukturyzacyjne Dz.U. 2022 poz. 2309 [sprawdź nowszy] +
               nowelizacja Dz.U. 2025 poz. 1085; zawód regulowany —
               licencja MS, BEZ samorządu/izby; syndyk/nadzorca/zarządca
               jako posiadacz jednej licencji; rozgraniczenie od
               mod-PrUpad-upadlosc-restrukturyzacja — status osoby vs
               przebieg postępowania)
  [✓] OK    mod-KPC-egzekucja-windykacja
  [✓] NOWY  mod-KPC-nieproces-czesc-ogolna
              (dodany 2026-08-14d — naprawa F-65, CZĘŚĆ II: PIERWSZY
               moduł KSIĘGI II KPC w systemie — dotąd cała Księga II
               nie miała żadnego pokrycia. Tytuł I, art. 506-525:
               wszczęcie na wniosek [506], właściwość rzeczowa — sądy
               rejonowe [507], WAŻNE: WŁAŚCIWOŚĆ MIEJSCOWA WYŁĄCZNA
               wg miejsca zamieszkania WNIOSKODAWCY [508 par. 1 —
               ODWROTNIE niż w procesie, gdzie decyduje pozwany],
               przekazanie sprawy [508 par. 2], ZAINTERESOWANY vs
               UCZESTNIK [510 — rdzeń konstrukcyjny nieprocesu:
               obowiązek wezwania przez sąd, zażalenie na odmowę
               dopuszczenia, kurator z urzędu], wymogi wniosku [511 —
               jak pozew, ale zamiast pozwanego wymienia się
               zainteresowanych], odrębności dowodowe (przesłuchanie
               bez przyrzeczenia, pod nieobecność uczestników),
               apelacja vs zażalenie [518 — kryterium ISTOTY SPRAWY],
               skarga kasacyjna [519(1) — katalog CZĘŚCIOWY].
               UWAGA: źródło Rzędu 2 (5 niezależnych serwisów),
               znacznik [ZALECANA WERYFIKACJA ISAP]; jednostki, których
               NUMERU nie odczytano, oznaczone w module jako [NR ?].
               v1.0.0 = TYLKO część ogólna — sprawy spadkowe, rzeczowe,
               wieczystoksięgowe i ubezwłasnowolnienie NADAL NIEPOKRYTE)
  [✓] NOWY  mod-KPC-prawomocnosc-granice-apelacji
              (dodany 2026-08-14 — naprawa F-65: prawomocność orzeczeń
               [363-366 — formalna vs materialna, tryb stwierdzenia,
               moc wiążąca, powaga rzeczy osądzonej z dwoma
               ograniczeniami przedmiotowym/podmiotowym] i granice
               apelacji [378, 380-386 — związanie granicami
               zaskarżenia, apelacja pełna art. 382, zakaz
               reformationis in peius art. 384 z niuansami dla
               postępowania nieprocesowego]. Weryfikacja: "deklaracja
               bez pokrycia" ws. sprzeciwu od referendarza okazała
               się fałszywym alarmem, treść realnie istnieje w
               pisma-proste-v2/references/SPH-inne.md)
  [✓] OK    mod-ustawa-prawa-konsumenta
  [✓] OK    mod-ustawa-UZNK-nieuczciwa-konkurencja
  [✓] OK    mod-ustawa-UOKIK-antymonopolowe
  [✓] OK    mod-ustawa-monopole-panstwowe
  [✓] OK    mod-rzeczy-znalezione-zasiedzenie
              (dodany 2026-07-18: ustawa o rzeczach znalezionych 2015
               [obowiązki znalazcy, znaleźne 1/10 wartości, nabycie
               własności po roku/2 latach, kategorie szczególne — broń,
               wojskowe, zabytki]; PEŁNE opracowanie zasiedzenia [art.
               172-176 KC — zastępuje dotychczasowy 5-linijkowy szkielet
               w ANEKS D mod-KC-cywilne-zobowiazania]: kryteria dobrej/
               złej wiary, doliczanie posiadania poprzednika, ograniczenie
               rolne 300 ha, pułapka współwłasności SN IV CSK 117/12;
               potwierdzenie że przywłaszczenie mienia [karne] już dobrze
               pokryte — bez duplikacji)
              (dodany 2026-07-18: podstawa konstytucyjna art. 216 ust. 3
               [ustawa + ważny interes społeczny], monopol na gry
               hazardowe [Totalizator Sportowy], operator wyznaczony
               [Poczta Polska] — w tym WAŻNE ZNALEZISKO: sporna,
               wielokrotnie nowelizowana kwestia art. 165 §2 KPC dot.
               skutku nadania pisma procesowego u różnych operatorów
               pocztowych, ostrzeżenie dodane też w pisma-procesowe-v3.
               Komplementarny do mod-ustawa-UOKIK — monopol PAŃSTWOWY
               [celowy, ustawowy] vs pozycja dominująca [rynkowa])
              (dodany 2026-07-18: rozgraniczenie od UZNK — struktura
               rynku [monopol, pozycja dominująca, koncentracje] vs
               uczciwość praktyk. Kontrola koncentracji z mocy ustawy,
               3 rodzaje decyzji Prezesa UOKiK, kary i program leniency.
               Odpowiedź na pytanie o "kwestie monopoli")
  [✓] OK    mod-ustawa-deweloperska
  [✓] OK    mod-ustawa-KRS-rejestr-sadowy
  [✓] OK    mod-ustawa-fundacje-stowarzyszenia
  [✓] OK    mod-ustawa-spoldzielnie-wlasnosc-lokali
  [✓] OK    mod-KP-art943-mobbing-dyskryminacja
  [✓] OK    mod-ustawa-cudzoziemcy
  [✓] OK    mod-ustawa-timeshare-zastaw-rejestrowy
```

## Jak wywołać

```
view dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view dr-02-prawo-cywilne-rodzinne-gospodarcze/MAPA-AKTOW.md
```

## Mapa pokrycia treściowego (planowanie rozwoju skilla)

Rejestr informacyjny — NIE krok obowiązkowy przy obsłudze konkretnej sprawy.
Przydatny przy planowaniu, które luki uzupełnić w pierwszej kolejności, oraz
przy nowelizacjach — pokazuje od razu czy dotknięty fragment ma treść do
zaktualizowania. (F-83, zasilony 2026-08-22 z KSH i PrUp/PrRestr; KPC
świadomie pominięty jako częściowo przestarzały względem stanu po F-65):

```
view dr-02-prawo-cywilne-rodzinne-gospodarcze/MAPA-POKRYCIA.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2` / `analizator-umow-v1`
- mod-KRO-rodzinne (sprawy rozwodowe, świadkowie) → `shared/MOD-ATAK-NA-SWIADKA.md` (kanoniczne techniki
  ataku/obrony wiarygodności świadka) oraz `przesluchanie-swiadkow-v2-min90` (przygotowanie przesłuchania)
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.ms.gov.pl, sn.pl

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
