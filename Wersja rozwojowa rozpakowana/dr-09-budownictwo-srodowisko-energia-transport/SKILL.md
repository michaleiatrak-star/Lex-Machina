---
name: dr-09-budownictwo-srodowisko-energia-transport
version: "3.25"
description: "Budownictwo, środowisko, energia i transport: prawo budowlane, planowanie, odpady, ochrona środowiska, energetyka, drogi i regulacje transportowe."
---

> **Universal runtime:** przed wykonaniem zastosuj kanoniczny `shared/UNIVERSAL-RUNTIME-ADAPTER.md` z osobnego skilla `shared`. Lokalna sekcja adaptera poniżej jedynie go doprecyzowuje.


## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

Ta sekcja zmienia wyłącznie wykonanie operacji technicznych. Merytoryka dziedzinowa, mapy aktów, hard gate’y, kolejność modułów i kryteria jakości tego DR-skilla pozostają bez zmian.

1. `view dr-09-budownictwo-srodowisko-energia-transport/<plik>` oraz `view modules/...` / `view references/...` oznaczają świeży odczyt odpowiedniego lokalnego pliku tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.
2. `view shared/<plik>` oznacza świeży odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do tej paczki. Brak obowiązkowego zasobu shared = fail-closed, nie substytucja pamięcią modelu.
3. `view <inny-skill>/<plik>` oznacza aktywację/odczyt wskazanego osobnego skilla. Nie vendoryzuj innych skilli do tego ZIP-a.
4. `web_search` / `web_fetch` i podobne nazwy oznaczają świeże wyszukanie/odczyt online przez równoważną funkcję hosta. Zachowaj wymagane źródła oficjalne, statusy weryfikacji i zakaz cytowania prawa z pamięci.
5. `show_widget`, `visualize:read_me`, `present_files`, `create_file`, shell/Python i podobne operacje są nazwami semantycznymi. Jeśli host nie ma literalnego narzędzia, użyj równoważnej funkcji natywnej bez omijania bramek jakości.
6. `/mnt/user-data/...` oznacza rzeczywiste załączniki użytkownika dostępne w bieżącym hoście; wymagany ponowny odczyt ma być faktycznym odczytem źródła.

**Zasada nadrzędna:** instrukcje, które są już zrozumiałe i wykonalne w bieżącym hoście, wykonuj bez konwersji. Adapter działa wyłącznie na granicy runtime.


# DR-09 — Budownictwo, Środowisko, Energia, Transport

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, kary, terminu ani sygnatury wyłącznie z pamięci modelu.

Akty DR-09 (zwłaszcza Prawo budowlane, POŚ, Prawo wodne) są **bardzo często nowelizowane** —
tekst sprzed 6 miesięcy może być już nieaktualny. Zawsze pobieraj aktualny t.j. przed użyciem.


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
- **Zakaz cytowania przepisów z pamięci — każde brzmienie weryfikuj w ISAP**
- **Dz.U. DR-09 zmieniają się bardzo często — przed każdym powołaniem weryfikuj t.j.**

---

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-BUDOWLANE-DROGOWE.md` — obiekt liniowy (kable w kanalizacji
  ≠ obiekt budowlany), samowola budowlana, decyzja WZ, definicje ministerialne
  prawa budowlanego (H.2) — PLIK GŁÓWNY dla tej dziedziny

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-007 Gospodarstwo rolne
- BAS-105 Zabudowa zagrodowa na gruntach leśnych (ORKA-REG-05 — def. techniczna
  nie tworzy prawa do zabudowy)
- BAS-108 Odbiorca wrażliwy energii (PE art. 3 pkt 13c + zmiana dyr. 2024/1711)
- BAS-109 Względy techniczne — podatek od nieruchomości (art. 1a ust. 1 pkt 3 upol)
- BAS-111 Strona postępowania w sprawach WZ
- BAS-115 Wolnostojące ogniwa fotowoltaiczne (kwalifikacja: zgłoszenie vs pozwolenie)
- BAS-W09 Samowola budowlana po nowelizacji 2023 (abolicja, brak przedawnienia)
- BAS-W10 Obiekt liniowy (art. 3 pkt 3a PrBud — kable w kanalizacji ≠ obiekt!)
- BAS-W14 ⚠️ Reforma upol 2025 — nowe definicje budynek/budowla (dot. też DR-06)

## Moduły (35 łącznie — ✓ 35 OK, ☐ 0 STUB)

```
BUDOWNICTWO:
  [✓] NOWY  mod-ochrona-zabytkow-obiekty-uzytecznosci-publicznej
              (dodany 2026-07-30, na żądanie użytkownika — ochrona
               zabytków: katalog czynności wymagających pozwolenia
               WKZ, podwójny wymóg pozwolenie WKZ+PrBud, nakaz/
               wstrzymanie konserwatorskie; obiekty użyteczności
               publicznej: bezwzględny wymóg dostępności dla
               niepełnosprawnych, dane NIK o realnej niezgodności.
               ✅ PODZIELONY 2026-08-20 — naprawa F-78, priorytet 10
               [OSTATNI Z LISTY 10 PRIORYTETOWYCH, 1008 linii]: plik
               pod NIEZMIENIONĄ nazwą stał się indeksatorem [44 linie],
               treść 15 sekcji przeniesiona do 6 plików w podkatalogu
               `ochrona-zabytkow/` [max 219 linii/plik]. Zweryfikowano
               100% integralność [15 nagłówków = 15]. Naprawiono 2
               odesłania cross-file [dostępność → część 1, stacje
               transformatorowe → część 3])
  [✓] OK    mod-PrBud-prawo-budowlane
  [✓] NOWY  mod-PrBud-uzupelnienie-pokrycia-2026
              (funkcje techniczne, roboty, EDB/c-KOB, katastrofa, e-Budownictwo, organy i odpowiedzialność zawodowa)
              (samowola, PINB/WINB, pozwolenie, zgłoszenie, WZ/MPZP, umowa z wykonawcą,
               uchwała NSA 7 sędziów luty 2026 — art. 49f i wcześniejszy nakaz rozbiórki)
  [✓] OK    mod-UGN-gospodarka-nieruchomosciami
              (deweloper, MRP, DFG, WM, najem, zasiedzenie, KW, służebności)
  [✓] OK    mod-PrGeodezyjne-kartografia-wywlaszczenia
              (ewidencja gruntów, podziały, wywłaszczenie, ZRID, specustawy)
  [✓] OK    mod-ustawa-planowanie-przestrzenne
              (Plan Ogólny Gminy, MPZP, WZ, ZPI — reforma 2023)
  [✓] NOWY  mod-ustawa-architekci-inzynierowie-budownictwa-zawod
              (Dz.U. 2025 poz. 1783 t.j.; zawody zaufania publicznego —
               samorządy IARP/PIIB; uprawnienia budowlane art. 14 PrBud,
               tytuł rzeczoznawcy budowlanego; ⚠️ URBANISTA — samorząd
               zniesiony 2014, obecnie tylko dobrowolne stowarzyszenia)

ŚRODOWISKO:
  [✓] OK    mod-POS-prawo-ochrony-srodowiska
              (POŚ, pozwolenia, IPPC, emisje, kary WIOŚ, KK 181-188a)
  [✓] OK    mod-inspekcja-ochrony-srodowiska-GIOS-WIOS
              (dodany 2026-07-21: struktura dwuinstancyjna GIOŚ + 16
               WIOŚ, powołanie [premier/wojewoda za zgodą GIOŚ],
               kompetencje kontrolne, Departament Inspekcji GIOŚ jako
               II instancja szczególnie dla emisji. Odpowiedź na
               pytanie użytkownika)
  [✓] OK    mod-formy-ochrony-przyrody-obszary-chronione
              (dodany 2026-07-21: 10 form ochrony przyrody z podziałem
               na typy [obszarowe najsurowsze — park narodowy/rezerwat;
               pośrednie — park krajobrazowy/obszar chronionego
               krajobrazu ze STREFAMI/Natura 2000; punktowe najłagodniejsze
               — pomniki/stanowiska/użytki/zespoły; gatunkowa jako
               jedyna nieobszarowa] + tabela organów ustanawiających.
               Odpowiedź na pytanie użytkownika)
  [✓] OK    mod-POS-prawo-ochrony-srodowiska-szczegoly
              (szczegółowy framework OOŚ: intake, screening, Natura 2000, predykcja,
               kary administracyjne WIOŚ, odpowiedzialność szkodowa)
  [✓] OK    mod-ustawa-OOS-oceny-srodowiskowe
              (DŚU, OOŚ, RDOŚ/GDOŚ, udział społeczeństwa, organy)
  [✓] OK    mod-ustawa-odpadach-gospodarka-komunalna
              (BDO, zezwolenia, kary, nielegalne składowanie, rekultywacja)
  [✓] OK    mod-ustawa-lesna-lowiecka-ochrona-przyrody
  [✓] OK    mod-lowiectwo-klusownictwo
  [✓] OK    mod-PrBud-patodeweloperka-uzytkowanie-male-obiekty-ograniczenia
              (dodany 2026-07-18: zmiana sposobu użytkowania (art. 71/71a),
               reforma "antypatodeweloperska" 2024 [odległość 5 m dla
               budynków >4 kondygnacji, 30 m od przemysłu, tereny zielone
               25%/20%], niewielkie obiekty (domy do 70 m² bez pozwolenia),
               strefy ochronne linii wysokiego napięcia, obszary
               szczególnego zagrożenia powodzią (Prawo wodne art. 77))
  [✓] OK    mod-srodowisko-wycinka-odpady-niebezpieczne-rekultywacja
  [✓] OK    mod-system-kaucyjny-opakowania
              (dodany 2026-07-19: system kaucyjny opakowań po napojach
               [obowiązuje od 1.10.2025 — 3 kategorie: PET do 3l/puszki
               do 1l/szkło zwrotne do 1,5l, kaucja 0,50/1,00 zł, cele
               77%/90%, wyjątek dla browarów od lutego 2026]. Odpowiedź
               na pytanie użytkownika o "kaucję")
              (dodany 2026-07-18, DOKOŃCZONY 2026-07-18: wycinka drzew
               [progi obwodu pnia, wyjątki rolnicy/drzewa owocowe, kary],
               odpady niebezpieczne [katalog odpadów, zakaz obchodzenia
               klasyfikacji przez rozcieńczanie], tereny skażone/
               rekultywacja [POŚ art. 101a-101m, 3 scenariusze
               odpowiedzialności: władający/inny sprawca/solidarna],
               dopalacze/NPS [kluczowe rozróżnienie: środek zastępczy =
               reżim administracyjny vs NSP na liście = reżim karny
               art. 62b])
              (dodany 2026-07-18; KOREKTA 2.0 z 2026-08-16, F-91:
               kłusownictwo — TRZY odrębne reżimy (Prawo łowieckie
               art. 42aa + 51-54 z TRÓJSTOPNIOWĄ gradacją: art. 51
               WYKROCZENIE/grzywna/tryb KPW, art. 52 do ROKU, art. 53
               do 5 lat — wersja 1.0 miała tu 6 błędów, w tym fałszywą
               tezę o wyłącznie przestępczym charakterze kłusownictwa
               i błędną sankcję art. 53; ustawa o rybactwie śródlądowym
               art. 27a, przestępstwo/wykroczenie wg metody; gatunki
               chronione — odesłanie do art. 181 KK, NIE do art. 53).
               Przepadek obejmujący też przedmioty osób trzecich.
               Rozdz. 1-8 i 11 Prawa łowieckiego BEZ POKRYCIA — flaga F-91;
               Rozdz. 9 pokryty od 2026-08-16 osobnym modułem niżej)
  [✓] NOWY  mod-szkody-lowieckie-szacowanie-odszkodowanie
              (dodany 2026-08-16 — zamknięcie punktu 1 flagi F-91: temat
               ZADEKLAROWANY w mod-ustawa-lesna-lowiecka-ochrona-przyrody
               bez ani jednego przepisu. Prawo łowieckie Rozdz. 9,
               art. 46-50, t.j. Dz.U. 2025 poz. 539:
               podmiot odpowiedzialny i ZAMKNIĘTY katalog 5 gatunków
               [dzik, łoś, jeleń, daniel, sarna] vs odpowiedzialność
               SKARBU PAŃSTWA za zwierzynę pod całoroczną ochroną i poza
               obwodami [art. 50]; trzyosobowy zespół szacujący i skutek
               niestawiennictwa; dwuetapowe szacowanie [oględziny 7 dni,
               szacowanie ostateczne w dzień sprzętu] z wymogami protokołu
               i szkicem sytuacyjnym; odwołanie do NADLEŚNICZEGO w 7 dni
               od PODPISANIA protokołu; decyzja OSTATECZNA w 14 dni;
               ⭐ powództwo do sądu CYWILNEGO w 3 MIESIĄCE, NIE skarga do
               WSA; wyłączenie nadleśniczego będącego członkiem koła
               łowieckiego [art. 49a ust. 2]; 7 wyłączeń z art. 48, w tym
               próg 100 kg żyta/ha i utrata roszczenia po oświadczeniu
               o zakazie polowania [art. 27b].
               ⚠️ PUŁAPKA ŹRÓDŁOWA udokumentowana w module: art. 46b jest
               UCHYLONY, a serwisy Rząd 2 renderują jego archiwalną treść
               o rzeczoznawcach izb rolniczych — zakaz powoływania)
  [✓] NOWY  mod-lowieckie-obwody-dzierzawa-odszkodowania
              (dodany 2026-08-16c — naprawa punktu priorytetowego flagi
               F-91 (Rozdz. 5 obwody łowieckie). Prawo łowieckie
               art. 23-31, t.j. Dz.U. 2025 poz. 539: definicja i typy
               obwodu [leśny/polny, próg 40% gruntów leśnych, min. 3000 ha];
               kategoryzacja 5-stopniowa wg punktacji [art. 26a]; procedura
               uchwały sejmiku [art. 27, w tym uwagi właściciela z ust. 12];
               ⭐ art. 27a — odszkodowanie za SAMO OBJĘCIE nieruchomości
               obwodem, dłużnik: WOJEWÓDZTWO, termin 3 lata — odrębne od
               szkód łowieckich z art. 46 i n.; ⭐⭐ art. 27b — oświadczenie
               o zakazie polowania [tylko os. fizyczna, prawo osobiste do
               śmierci, forma pisemna przed starostą, cofnięcie nie
               wcześniej niż po zakończeniu roku gospodarczego] —
               bezpośrednie powiązanie z art. 48 pkt 7 w module szkód
               łowieckich (utrata roszczenia); dzierżawa [art. 28-29b,
               PZŁ, min. 10 lat, właściwość wg leśny/polny]; czynsz
               [art. 31, wskaźnik żyta max 0,07 q/ha]. Bramka rozróżniająca
               3 odrębne roszczenia właściciela [§ 8 modułu]. 7 punktów
               ⚠️ NIEWERYFIKOWANE odnotowanych zamiast zgadywania.
               Rozdz. 6a, 8, 1-4/6/7/11 wciąż BEZ POKRYCIA — F-91 pozostaje
               otwarta, zawężona)
  [✓] NOWY  mod-lowieckie-wykonywanie-polowania-uprawnienia
              (dodany 2026-08-16d — naprawa kolejnego punktu priorytetowego
               flagi F-91 (Rozdz. 8 wykonywanie polowania). Prawo łowieckie
               art. 42-45, poza już opisanym 42aa, t.j. Dz.U. 2025 poz. 539:
               3 stopnie uprawnień [podstawowe/selekcjonerskie/sokolnicze],
               zwolnienia ze stażu, ⭐ IGO odstrzał bez limitu liczby
               [art. 42 ust. 8a]; obywatele UE [art. 42a, egzamin
               uzupełniający, ważność 5 lat]; książka ewidencji pobytu
               [art. 42b — kluczowy dowód w sporach]; kary porządkowe za
               naruszenie selekcji [art. 42da: nagana/zawieszenie do 2 lat,
               tryb odwoławczy zarząd okręgowy→Zarząd Główny 14 dni→WSA
               14 dni — JEDYNA droga do WSA w Rozdz. 8]; zezwolenia
               szczególne [art. 44 nauka/edukacja, art. 44a odłów
               drapieżników — NIE JEST polowaniem]; ⭐ art. 45 odstrzał
               redukcyjny — 3 odrębne podstawy/organy [nadleśniczy ust.1-2
               vs starosta ust.3 w porozumieniu z PZŁ, zadanie zlecone wg
               NSA II OW 131/15]. Odkryto częściowe dane o ustawie z
               21.11.2025 o zdrowiu zwierząt [data potwierdzona, metryka
               Dz.U. nadal nieustalona]. 7 punktów ⚠️ NIEWERYFIKOWANE.
               Rozdz. 6a, 1-4/6/7/11 wciąż BEZ POKRYCIA — F-91 pozostaje
               otwarta, dalej zawężona)
  [✓] NOWY  mod-lowieckie-odpowiedzialnosc-dyscyplinarna-PZL
              (dodany 2026-08-16e — zamknięcie PUNKTU 1 priorytetowego
               flagi F-91 (Rozdz. 6a odpowiedzialność dyscyplinarna).
               Prawo łowieckie art. 35b-35t w CAŁOŚCI, t.j. Dz.U. 2025
               poz. 539: przewinienie łowieckie [3 postacie + pomocnictwo
               i podżeganie, art. 35b]; ZAMKNIĘTY katalog kar [nagana /
               zawieszenie 6 mies.-3 lata / wykluczenie + kara dodatkowa
               zakaz funkcji do 5 lat, art. 35c]; niezależność od
               postępowania karnego [art. 35d, zawieszenie FAKULTATYWNE];
               3 etapy postępowania [art. 35e]; ⭐ obrońca NIE musi być
               adwokatem — wykształcenie prawnicze LUB członek PZŁ
               [art. 35f ust. 4]; skargowość [art. 35g ust. 2]; ⭐ utrata
               członkostwa NIE kończy sprawy [art. 35h ust. 2];
               przedawnienie 5 lat / wg karalności przestępstwa
               [art. 35i]; dwuinstancyjność, orzeczenie TYLKO na rozprawie,
               uzasadnienie z urzędu [art. 35j]; właściwość OSŁ vs Główny
               Sąd Łowiecki [art. 35k]; skład 3-osobowy [art. 35l];
               odwołanie wewnętrzne 14 dni [art. 35m]; kadencja 5 lat
               i wygaśnięcie [art. 35o]; koszty [art. 35p]; zatarcie
               5 lat [art. 35r]; ⭐⭐ ODPOWIEDNIE STOSOWANIE KPK
               [art. 35s ust. 2 — najmocniejsze narzędzie obrony].
               ⛔ USTALENIE KORYGUJĄCE: odwołanie do sądu okręgowego NIE
               jest w Rozdz. 6a — wynika z art. 33 ust. 6 (Rozdz. 6),
               14 dni, BRAK kasacji, postępowanie JEDNOINSTANCYJNE,
               wyłączone powództwa o uchylenie uchwał; dopisane do modułu
               wraz z linią SN. Kontekst: TK K 21/11 [test sankcji
               wyłącznie wewnątrzorganizacyjnej] i geneza rozdziału
               [ustawa z 12.12.2013, Dz.U. 2014 poz. 228, w życie
               21.04.2014]. Odnotowano BRAK art. 35q w numeracji ustawy
               [35p → 35r] — nie zgłaszać jako luki. 6 punktów
               ⚠️ NIEWERYFIKOWANE. Rozdz. 1-4/6/7/11 wciąż BEZ POKRYCIA —
               F-91 pozostaje otwarta, dalej zawężona)
  [✓] NOWY  mod-lowieckie-PZL-kola-nadzor-ministra
              (dodany 2026-08-16f — naprawa kolejnego punktu priorytetowego
               flagi F-91 (Rozdz. 6 Polski Związek Łowiecki). Prawo łowieckie
               art. 32-35a ORAZ 32b, t.j. Dz.U. 2025 poz. 539: status i
               statut PZŁ [12 obligatoryjnych pozycji], 5 przesłanek
               członkostwa, obowiązkowe ubezpieczenie NNW/OC [art. 32];
               8 organów PZŁ, ⭐ limit DWÓCH rozpoczętych kadencji, ⛔ Zarząd
               Główny i zarządy okręgowe POZA tym limitem — Łowczy Krajowy
               z nominacji MINISTRA, nie z wyboru [art. 32a]; ⭐ art. 32b —
               PZŁ jako podmiot ochrony ludności [ustawa z 5.12.2024,
               Dz.U. 2024 poz. 1907, w życie 1.01.2025 — akt już w systemie:
               dr-01/dr-08/dr-13, NIE luka rejestrowa]; koła łowieckie —
               ⭐⭐ art. 33 ust. 2a-2d ODPOWIEDZIALNOŚĆ PZŁ za odszkodowania
               koła [subsydiarna przy likwidacji, SOLIDARNA przy uchybieniu
               terminom art. 46c ust. 8 / 46e ust. 3] + regres do członków
               ZARZĄDU koła z ekskulpacją; min. 10 członków i pierwszeństwo
               miejscowych [art. 33a]; organy koła 4-7 / 3-5, kadencja 5 lat
               [art. 33b]; ⭐ art. 33c ust. 1 pkt 2 — KAŻDE ukaranie
               dyscyplinarne wyklucza z organów [wzmacnia argument z TK
               K 21/11: skutek NIE wyłącznie wewnątrzorganizacyjny];
               lustracja [art. 33d]; przedłużenie kadencji w stanie
               nadzwyczajnym [art. 33e]; 12 zadań PZŁ, w tym pkt 4-5 jako
               ustawowa podstawa klauzuli ETYKI ŁOWIECKIEJ z art. 35b
               [art. 34]; zakaz podziału majątku między członków
               [art. 35 ust. 2]; ⭐⭐ art. 35a — nadzór ministra, sprawozdanie
               do 31 lipca, kontrola WYŁĄCZNIE pod względem legalności,
               środki nadzorcze W FORMIE DECYZJI ADMINISTRACYJNEJ [uchylenie
               / stwierdzenie nieważności / upomnienie] → DRUGA droga na WSA
               w tej ustawie. Odnotowano rozbieżność: spis treści podaje
               zakres "32-35a", a rozdział zawiera także art. 32b.
               7 punktów ⚠️ NIEWERYFIKOWANE. Rozdz. 7 i 1-4/11 wciąż BEZ
               POKRYCIA — F-91 pozostaje otwarta, dalej zawężona)
  [✓] NOWY  mod-lowieckie-straz-lowiecka-PSL-uprawnienia
              (dodany 2026-08-16g — naprawa kolejnego punktu priorytetowego
               flagi F-91 (Rozdz. 7 straż łowiecka). Prawo łowieckie
               art. 36-41, w tym 38a, t.j. Dz.U. 2025 poz. 539.
               ⭐ OŚ MODUŁU — DWIE ODRĘBNE STRAŻE: (a) Państwowa Straż
               Łowiecka — formacja umundurowana i uzbrojona PODLEGŁA
               WOJEWODZIE, strażnicy to PRACOWNICY URZĘDÓW WOJEWÓDZKICH,
               komendant wojewódzki [art. 36 ust. 1-1a, 38 ust. 2]; (b)
               strażnik łowiecki koła — powoływany/zatrudniany przez
               dzierżawcę, ⛔ obowiązek koła zatrudnienia CO NAJMNIEJ
               JEDNEGO [art. 36 ust. 2]. Zadania PSŁ w 5 punktach, współpraca
               z Szefem KCIK [art. 37]; wymogi wspólne dla obu straży: 21 lat,
               niekaralność SĄDOWA (⚠️ TRZECI, najszerszy standard
               niekaralności w ustawie — inny niż art. 32 ust. 5 pkt 3 i
               art. 33c ust. 1 pkt 2), przeszkolenie [art. 38]; bezpłatne
               umundurowanie z OBOWIĄZKIEM noszenia [art. 38a];
               ⭐⭐ RDZEŃ — art. 39: legitymowanie, MANDATY, kontrola
               pojazdów w obwodzie i bezpośrednim sąsiedztwie, przeszukanie
               wg KPK, ujęcie i doprowadzenie do Policji, ⭐ PROWADZENIE
               DOCHODZEŃ I WNOSZENIE AKTU OSKARŻENIA gdy przedmiotem
               przestępstwa jest zwierzyna [ust. 2 pkt 7], OSKARŻYCIEL
               PUBLICZNY w sprawach o wykroczenia [pkt 8 — ⚠️ relikt:
               odesłanie do zniesionego kolegium ds. wykroczeń], kontrole
               skupu/obrotu/usług dla cudzoziemców, broń palna bojowa, pałka,
               kajdanek, paralizator; ŚPB i BROŃ PALNA przez odesłanie do
               ustawy z 24.05.2013 [ust. 3-5 — ⛔ jednostek redakcyjnej tej
               ustawy NIE odczytano, zakaz powoływania bez weryfikacji];
               uprawnienia SOP/PSRyb/strażników leśnych [ust. 8];
               ⭐⭐ ZAŻALENIE DO PROKURATORA na sposób przeprowadzenia
               czynności [ust. 10 — nietypowy adresat, odnotowane dla F-13];
               ochrona jak FUNKCJONARIUSZ PUBLICZNY [ust. 11].
               ⛔ Art. 40 — strażnik koła ma WYŁĄCZNIE art. 39 ust. 2 pkt 1,
               5, 6, 9, 11 + ust. 5 i 11; NIE MA mandatów, kontroli pojazdów,
               przeszukania, dochodzeń, oskarżyciela publicznego ani broni
               palnej bojowej — najczęstsze pole zarzutu przekroczenia
               uprawnień; broń myśliwska tylko na drapieżniki z listy
               zwierząt łownych, zgodnie z rocznym planem, o ile członek PZŁ
               [ust. 1 pkt 2], na zasadach przepisów o broni i amunicji
               [ust. 3 — styk z F-92]. 3 delegacje rozporządzeniowe
               [art. 41 — ⚠️ metryki NIEUSTALONE]. Odnotowano TRZECI
               przypadek rozbieżności spisu treści wobec zawartości
               rozdziału: spis podaje "36-41", rozdział zawiera też art. 38a.
               8 punktów ⚠️ NIEWERYFIKOWANE. Rozdz. 3, 1-2, 4, 11 wciąż BEZ
               POKRYCIA — F-91 pozostaje otwarta, dalej zawężona)
  [✓] NOWY  mod-lowieckie-zasady-gospodarki-lowieckiej-plany
              (dodany 2026-08-17 — naprawa kolejnego punktu priorytetowego
               flagi F-91 (Rozdz. 3 zasady gospodarki łowieckiej), wskazanego
               w tablicy sterującej jako "najczęściej powoływany rozdział
               w sporach". Prawo łowieckie art. 8, 8a-8e, 9, 9a, 10-16a,
               t.j. Dz.U. 2025 poz. 539: podział na blok planowania
               (art. 8, 8a-8e) i blok zasad/ochrony (art. 9-16a); ⭐⭐ art. 8a
               roczny plan łowiecki — dwie ścieżki zatwierdzania [nadleśniczy
               vs dyrektor RDLP wg dzierżawa/zarząd], przedziały pozyskania
               90-110%/85-115%, rozróżnienie ZMIANA (pełna procedura, 7
               przesłanek) vs KOREKTA (tylko dane pozyskania, termin do 30
               kwietnia, bez pełnej procedury); art. 8c wieloletni łowiecki
               plan hodowlany — odwołanie do MINISTRA (jedyny taki przypadek
               w rozdziale); ⭐⭐⭐ art. 8d — WYŁĄCZENIE KPA przy zatwierdzaniu
               planów, własny tryb odwoławczy, NIEUSTALONE czy przysługuje
               droga do WSA po wyczerpaniu odwołania wewnętrznego [styk
               dr-05]; art. 8 — rozróżnienie odstrzału REDUKCYJNEGO [parki
               narodowe/rezerwaty, wyłączenie przepisów o ochronie przyrody
               w zakresie niezbędnym] od SANITARNEGO [wszędzie, na podstawie
               ustawy o zdrowiu zwierząt]; ⭐⭐⭐ art. 15 własność pozyskanej
               zwierzyny — dzierżawca/zarządca [legalnie] vs Skarb Państwa
               [bezprawnie] vs zakaz ODPRZEDAŻY przez myśliwego zwierzyny mu
               odstąpionej; art. 10 charty rasowe — KPA STOSUJE SIĘ w pełni
               [kontrast z art. 8d]; art. 16a wprowadzenie bażanta/daniela/
               muflona — reżim MILCZĄCEJ ZGODY/sprzeciwu w 45 dni, nie
               zezwolenia. ⭐ UBOCZNIE ROZSTRZYGNIĘTA metryka ustawy z
               21.11.2025 o zdrowiu zwierząt, NIEUSTALONA w sesji 16d
               [Rozdz. 8]: **Dz.U. 2025 poz. 1795**, potwierdzona w 5
               niezależnych źródłach (ISAP bezpośrednio + eli.gov.pl +
               2 BIP gmin + portal branżowy) — zadanie propagacyjne do
               mod-lowieckie-wykonywanie-polowania-uprawnienia odnotowane
               w WARN-OTWARTE, NIE wykonane w tej sesji. 5 punktów
               ⚠️ NIEWERYFIKOWANE. Rozdz. 1-2, 4, 11 wciąż BEZ POKRYCIA —
               F-91 pozostaje otwarta, dalej zawężona)
  [✓] NOWY  mod-lowieckie-przepisy-ogolne-organy-administracji
              (dodany 2026-08-17 — naprawa kolejnego punktu priorytetowego
               flagi F-91 (Rozdz. 1-2, art. 1-7). Prawo łowieckie art. 1, 2,
               3, 3a, 4, 5, 6, 7, t.j. Dz.U. 2025 poz. 539: art. 1 definicja
               łowiectwa jako element ochrony środowiska; art. 2 własność
               zwierząt łownych w stanie wolnym — Skarb Państwa, punkt
               wyjścia dla art. 15 [Rozdz. 3]; art. 3 cztery cele łowiectwa
               [katalog zamknięty]; art. 3a — 3 kategorie IGO [Unia/Polska/
               "prawdopodobnie spełniające kryteria"], eliminacja przez
               polowania LUB działania zaradcze; ⭐⭐⭐ art. 4 — TRZY DEFINICJE
               FUNDAMENTALNE: gospodarka łowiecka [ochrona+hodowla+
               pozyskiwanie], polowanie [3 formy zamknięte, zawsze "zmierzające
               do wejścia w posiadanie"], ⭐⭐⭐ KŁUSOWNICTWO [DWA alternatywne
               warianty: (A) sposób niebędący polowaniem w ogóle, (B) polowanie
               Z NARUSZENIEM warunków dopuszczalności — wariant B obejmuje
               KAŻDE naruszenie formalne przez uprawnionego myśliwego, nie
               tylko działanie osoby bez uprawnień]; art. 5 delegacja — lista
               gatunków łownych; art. 6 minister środowiska jako organ
               naczelny; ⛔⛔ art. 7 — KOREKTA ŹRÓDŁOWA KRYTYCZNA: aktualny
               organ to SAMORZĄD WOJEWÓDZTWA jako zadanie zlecone [nie
               wojewoda — starsze źródła/archiwalny t.j. 2023.1082 podawały
               nieaktualne brzmienie sprzed nowelizacji, rozstrzygnięcie
               potwierdzone w 6 niezależnych źródłach w tym prawo.pl/Wolters
               Kluwer]; klauzula subsydiarności "jeżeli ustawa nie stanowi
               inaczej" — metodologia: szukać przepisu szczególnego PRZED
               sięgnięciem do reguły ogólnej z art. 7. 3 punkty
               ⚠️ NIEWERYFIKOWANE. Zadanie propagacyjne do modułu kłusownictwo
               [rozróżnienie 2 wariantów z art. 4 ust. 3] odnotowane osobno.
               Rozdz. 4, 11 wciąż BEZ POKRYCIA — F-91 pozostaje otwarta,
               dalej zawężona)
  [✓] NOWY  mod-lowieckie-dzialalnosc-gospodarcza-turystyka-obrot
              (dodany 2026-08-17 — naprawa kolejnego punktu priorytetowego
               flagi F-91 (Rozdz. 4, art. 17-22b). Prawo łowieckie t.j.
               Dz.U. 2025 poz. 539: ⭐⭐⭐ USTALENIE STRUKTURALNE — art. 17,
               19, 20 UCHYLONE [dawny "rejestr polowań" już nie istnieje],
               rozdział ma tylko 6 aktywnych przepisów [18, 21, 21a, 22,
               22a, 22b] mimo pozornie 9-artykułowej numeracji; ⭐⭐ art. 18 —
               3 warunki kumulatywne działalności turystycznej z polowaniami
               [zabezpieczenie majątkowe / egzamin / terminowe dokumenty]
               + niekaralność za przestępstwa z art. 52-53 i przeciw
               obrotowi gospodarczemu [ust. 2] + ⭐⭐⭐ 3 alternatywne formy
               zabezpieczenia [OC / gwarancja bankowa-ubezpieczeniowa /
               blokada 4% przychodu min. 20.000 EUR na rzecz samorządu
               województwa]; art. 21-21a — odrębny egzamin turystyczny
               [NIE tożsamy z uprawnieniami myśliwskimi z Rozdz. 8], komisja
               6-osobowa; art. 22 — obowiązki przedsiębiorcy w obrocie
               zwierzyną/tuszami [ewidencja skupu + badania sanitarne],
               wyłączenie dla dzierżawców/zarządców sprzedających własną
               zwierzynę [odesłanie do art. 15 Rozdz. 3]; ⭐⭐ art. 22a —
               dwuetapowa sankcja [wezwanie → decyzja o zakazie na SZTYWNE
               3 lata]; art. 22b — odesłanie do Prawa przedsiębiorców,
               ⭐ ROZSTRZYGNIĘTA aktualna metryka **Dz.U. 2025 poz. 1480**
               [potwierdzona bezpośrednio w ISAP i dziennikustaw.gov.pl]
               wobec rozbieżnych starszych metryk cytowanych przez różne
               źródła Rządu 2B. 5 punktów ⚠️ NIEWERYFIKOWANE, w tym możliwa
               rozbieżność brzmienia art. 22 ust. 1 pkt 2 względem wcześniej
               ustalonej formuły w module Rozdz. 7 — do weryfikacji w ISAP.
               Rozdz. 11 wciąż BEZ POKRYCIA — F-91 pozostaje otwarta, dalej
               zawężona)
  [✓] NOWY  mod-lowieckie-przepisy-przejsciowe-koncowe-derogacja
              (dodany 2026-08-17d — ZAMKNIĘCIE flagi F-91 W CAŁOŚCI:
               OSTATNI rozdział ustawy, Rozdz. 11 art. 55-64. Prawo
               łowieckie t.j. Dz.U. 2025 poz. 539: ⭐⭐⭐ ROZSTRZYGNIĘTY
               zakres numeracji oznaczony w tablicy sterującej jako
               ⚠️ NIEPOTWIERDZONY — potwierdzone 55-64, BEZ kolizji
               z Rozdz. 10 [51-54], bez artykułów uchylonych [10 pozycji,
               wszystkie formalnie obowiązujące]; ⛔⛔ ostrzeżenie
               interpretacyjne "OBOWIĄZUJE ≠ WYWOŁUJE SKUTKI" — podział
               na 3 kategorie skutku: [A] przepisy zmieniające 55-57
               [treść pominięta w t.j., ustawy zmieniane: o działalności
               gospodarczej z 1988 — już nie obowiązuje, o lasach,
               o ochronie przyrody z 1991 — uchylona], [B] przepisy
               SKONSUMOWANE 58, 60 ust. 2, 61, 62, [C] przepisy o SKUTKU
               TRWAŁYM 59 i 60 ust. 1; ⭐⭐⭐ art. 59 ust. 3 — uprawnienia
               do wykonywania polowania nabyte przed cezurą ZACHOWUJĄ MOC
               [realna podstawa procesowa do dziś: myśliwy z długim stażem
               nie musi wykazywać nabycia w trybie obecnego art. 42];
               art. 59 ust. 1-2 — ciągłość bytu PZŁ i kół łowieckich;
               art. 60 ust. 1 — obwody utworzone przed cezurą stają się
               obwodami w rozumieniu ustawy, ust. 2 — OHZ pod warunkiem
               zawitym 1 roku; art. 61 — dawne umowy dzierżawy wygasły
               ex lege 31.03.1997 [jedyna data sztywna w rozdziale];
               art. 62 — akty wykonawcze z reżimu 1959 r. NIE obowiązują;
               art. 63 — derogacja ustawy z 17.06.1959 [tempus regit actum
               dla zdarzeń sprzed cezury]; ⭐ art. 64 + Rząd 1 [ELI Sejm
               DU/1995/713]: ustawa ogłoszona 18.12.1995, w życie
               **17.02.1996** — cezura dla całego rozdziału. ⛔ MARTWY
               PRZEPIS oznaczony: art. 58 ust. 2 ["koncesja"] sprzężony
               z uchylonym art. 17 — powołanie go jako aktualnej podstawy
               reglamentacji = rażący błąd kwalifikacji. 4 punkty
               ⚠️ NIEUSTALONE. Pokrycie Prawa łowieckiego: 12/12
               rozdziałów — F-91 ZAMKNIĘTA)
  ⚠️ UWAGA: szkody od gatunków CHRONIONYCH (żubr, wilk, ryś, niedźwiedź,
     bóbr) to INNY REŻIM — art. 126 ustawy o ochronie przyrody →
     mod-formy-ochrony-przyrody-obszary-chronione
              (ochrona przyrody, Natura 2000, wycinka)

ENERGIA I ZASOBY:
  [✓] OK    mod-PrEnergetyczne-URE-OZE
              (koncesje, taryfy, przyłączenia, prosument, OZE, gaz, URE)
  [✓] OK    mod-ustawa-charakterystyka-energetyczna
              (certyfikaty energetyczne, EPBD recast 2024, NZEB)
  [✓] OK    mod-PrWodne-gospodarka-sciekowa
              (Prawo wodne, Wody Polskie, pozwolenia wodnoprawne, opłaty)
  [✓] OK    mod-prawo-geologiczne-gornicze
              (koncesje wydobywcze, opłaty eksploatacyjne, WUG)

TRANSPORT:
  [✓] OK    mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski
  [✓] OK    mod-GDDKiA-specustawa-drogowa-ZRID
              (dodany 2026-07-21: GDDKiA i mechanizm ZRID [decyzja
               zintegrowana — projekt/pozwolenie/podział/wywłaszczenie
               w jednym akcie; przejście własności Z MOCY PRAWA;
               terminy odszkodowania 30/60 dni; dodatek 10 000 zł dla
               zamieszkałych nieruchomości]. Odpowiedź na pytanie
               użytkownika)
              (scalony kanceryjski: drogowy ITD, kolejowy UTK, lotniczy ULC, morski,
               drogi publ., specustawa drogowa ZRID, elektromobilność, drony, pasażerowie)
  [✓] OK    mod-ustawa-prawo-gazowe
              (Prawo energetyczne — część gazowa, URE, TGE, odbiorca wrażliwy)
```

---

## Jak wywołać

```
view dr-09-budownictwo-srodowisko-energia-transport/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view dr-09-budownictwo-srodowisko-energia-transport/MAPA-AKTOW.md
```

---

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Planowanie przestrzenne (MPZP, WZ) → też `dr-08` → `mod-MPZP-WZ-planowanie-przestrzenne`
- Podatek od nieruchomości (reforma 2025) → `dr-06`
- Zamówienia publiczne (budowlane) → `dr-07`
- Samorząd terytorialny (MPZP, gospodarka komunalna) → `dr-08`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja: isap.sejm.gov.pl | orzeczenia.nsa.gov.pl | sn.pl | kio.gov.pl (zamówienia budowlane)

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
