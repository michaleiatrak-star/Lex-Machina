---
name: dr-03-prawo-karne-wykroczenia-egzekucja
version: "3.29"
description: |
  DR-03: Prawo Karne, Wykroczenia, Egzekucja
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-03 — Prawo Karne, Wykroczenia, Egzekucja

## ⛔ OBOWIĄZKOWY KWALIFIKATOR — dla każdej sprawy karnej/wykroczeniowej

> Dodano: 2026-07-06 (utrwalenie preferencji użytkownika "Karne:
> +kwalifikator"). UWAGA DEDUP: zasada i pełne drzewo decyzyjne JUŻ
> istnieją jako `prawny-router-v3` UP-3 (sekcja "PREFERENCJE UŻYTKOWNIKA")
> + moduł kanoniczny poniżej — ten wpis to tylko punkt wejścia z poziomu
> DR-03, NIE nowa treść (nie duplikować dalej).

Dla KAŻDEJ sprawy karnej/wykroczeniowej (nie tylko na wyraźne żądanie
użytkownika) obowiązkowe jest przejście przez drzewo decyzyjne kwalifikacji
przed podaniem jakiejkolwiek analizy lub pisma:

```
view /mnt/skills/user/dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-kwalifikator-karnomaterialny.md
```

Zasada naczelna modułu (skrót): nigdy nie kwalifikuj czynu bez przejścia
przez drzewo; kwalifikacja oparta na chronologii faktów, nie na pierwszym
pasującym przepisie; każdy przepis weryfikowany w ISAP przed użyciem
(zgodnie z zasadą 2 `prawo-polskie-v2/SKILL.md` / UP-2 routera). Jeśli czyn
wyczerpuje znamiona więcej niż jednego przepisu — kwalifikacja kumulatywna
(art. 11 § 2 KK), nie wybór arbitralny.

⚡ **STRUKTURA 2026-08-20 (F-78):** powyższy plik to teraz LEKKI INDEKSATOR
(104 linie) z tabelą nawigacyjną — treść merytoryczna 8 bloków tematycznych
znajduje się w podkatalogu `modules/kwalifikator-karnomaterialny/`. Wczytaj
najpierw indeks, potem WYŁĄCZNIE właściwy plik części wg tabeli. Ścieżka
`view` powyżej NIE wymagała zmiany — to zamierzona korzyść tej struktury.

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.


> ⛔ **SELF-CHECK ANTY-FASADA — obowiązkowy przed wysłaniem odpowiedzi/pisma**
> (podłączone 2026-08-24, flaga F-115 P3 — zamknięcie zakresu 16 skilli DR):
>
> ```
> view /mnt/skills/user/shared/SELF-CHECK-ANTY-FASADA.md
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

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-PROCEDURA.md` — termin zawity vs przedawnienie vs instrukcyjny
  (KRYTYCZNE: terminy zawite w KPK — apelacje, zażalenia 14 dni)
- `definicje/DEF-PRACA.md` — niealimentacja (art. 209 KK) — sekcja dolna pliku

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE: świadek a interes
  własny (KPK art. 182-186 — prawo odmowy zeznań/odpowiedzi, "osoba najbliższa"
  z faktycznym wspólnym pożyciem — BAS-112)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-013 Treści pornograficzne (art. 202 KK — brak definicji legalnej, ocenne)
- BAS-103 Uprawdopodobnienie (≠ udowodnienie — ORKA-REG-02)
- BAS-114 Mobbing a prawo karne (zbieg z art. 190/191/216/217/218 KK)
- BAS-118 Mowa nienawiści (art. 256-257 KK — brak definicji + zmiana 2024/2025)
- BAS-121 Handel ludźmi (art. 115 §22 KK — zgoda ofiary irrelewantna)
- BAS-129 Recydywa szczególna i multirecydywa (art. 64 KK — przesłanki łączne)
- BAS-130 Warunkowe umorzenie (art. 66 KK — 6 przesłanek + wykluczenia)
- BAS-134 Środki karne + zatarcie skazania (→ mod-prawa-obywatelskie-srodki-karne.md)
- BAS-W22 Czyn ciągły / "z góry powzięty zamiar" (art. 12 KK)
- BAS-W23 Mienie znacznej/wielkiej wartości (art. 115 §5-6 KK — progi zamrożone od 2010!)
- BAS-W24 Nieznaczna ilość narkotyku (art. 62a ustawy PN — brak definicji)
- BAS-131/132/133 Niewidomy / niepełnosprawność intelektualna / głuchota —
  obrona obligatoryjna art. 79 §1 pkt 2-4 KPK (→ mod-niewidomy-prawa-prawne.md,
  mod-niepelnosprawnosc-intelektualna-gluchota.md)

## Moduły (60 łącznie — ✓ 60 OK, ☐ 0 STUB; 1 przeniesiony do shared/)

**NAPRAWA 2026-08-15:** dodano `mod-KPK-podstawy-odwolawcze-przeslanki-
zarzuty-biegli.md` — naprawa CZĘŚCIOWA F-66 (priorytet 1/3: art. 17,
193-206, 313, 438-440). Pełny opis: `audyt-systemu-v4/references/
AUDIT-JOURNAL.md`.

**NAPRAWA 2026-08-13:** dodano `mod-KPK-srodki-zapobiegawcze-
tymczasowe-aresztowanie.md` — zamyka F-23 (audyt zewnętrzny) i F-66
(raport pokrycia KPK), obie dot. całkowitego braku pokrycia tematu
tymczasowego aresztowania. Pełny opis: `audyt-systemu-v4/references/
AUDIT-JOURNAL.md`.
## ⚡ NOWY 2026-08-04: mod-podmiana-czesci-naprawa-oszustwo — na
## żądanie użytkownika: art. 286 KK (oszustwo — z realnym wyrokiem
## SAOS II K 282/16, mechanik zamontował używane części zamiast
## nowych dostarczonych przez klienta), art. 284 KK (przywłaszczenie
## oryginalnej części), ścieżka karna/cywilna
## ⚡ NOWY 2026-08-04: mod-przerobki-modyfikacje-pojazdow — na żądanie
## użytkownika: odblokowanie hulajnóg elektrycznych (projekt ustawy
## MI), przyciemnianie szyb (progi VLT 75%/70%), pojazdy marki "SAM"
## (świadectwo indywidualnego dopuszczenia, procedura TDT/starosta)
## ⚡ NOWY 2026-08-04: mod-lincz-ochrona-swiadkow-lowcy-pedofili — na
## żądanie użytkownika: art. 158-159 KK (lincz/odpowiedzialność
## zbiorowa), statusy więźniów N/szczególnie chroniony, zmowa
## milczenia (art. 233 KK), łowcy pedofili (spór doktrynalny, RPO)
## ⚠️ 2026-07-15: naprawiono niezgodność dysk↔lista — 4 pliki istniały na
## dysku, ale nie były wpisane poniżej: mod-KK-art291-pranie-pieniedzy,
## mod-ustawa-fundusz-pomocy-pokrzywdzonym, mod-ustawa-narkomania,
## mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych — dodane na końcu listy.

```
  [✓] OK    mod-KK-KPK-framework-karne
              (nowe przestępstwa drogowe: brawurowa jazda, nielegalne wyścigi, art. 115 §26 KK
               przepadek pojazdu ≥1,5‰, dożywotni zakaz — Dz.U. 2025 poz. 1872)
  [✓] OK    mod-KK-KPK-framework-szczegolowy
  [✓] OK    mod-KKW-kodeks-karny-wykonawczy
              (Kodeks karny wykonawczy — warunkowe przedterminowe zwolnienie (159-163), odroczenie/przerwa (150-158a), dozór elektroniczny (43a-43zf); ZAREJESTROWANY 2026-08-14e (F-77 rozszerzona) — moduł istniał od naprawy F-75, bez wpisu w checkliście)
  [✓] OK    mod-przerobki-modyfikacje-pojazdow
              (v1.1.0 — dopuszczalne modyfikacje pojazdów, homologacja, motocykle, tachografy; ⚠️ zawiera flagę F-14 (projekt ws. UTO/hulajnóg); ZAREJESTROWANY 2026-08-14e (F-77 rozszerzona))
  [✓] OK    mod-podmiana-czesci-naprawa-oszustwo
              (Podmiana części przy naprawie jako oszustwo; ⚠️ wątek przywłaszczenia oryginalnej części (284 KK) — punkt otwarty w F-26; ZAREJESTROWANY 2026-08-14e (F-77 rozszerzona))
  [✓] OK    mod-lincz-ochrona-swiadkow-lowcy-pedofili
              (Samosąd/lincz, ochrona świadków, tzw. „łowcy pedofilów” — granice legalności działań obywatelskich; ZAREJESTROWANY 2026-08-14e (F-77 rozszerzona))
  [✓] OK    mod-KK-art190a-stalking
  [✓] OK    mod-KK-art207-przemoc-domowa
  [✓] OK    mod-KK-art267-269c-cyberprzestepstwa
  [✓] OK    mod-KK-cyberprzestepstwa-szczegolowy
  [✓] OK    mod-KK-kodeks-karny
  [✓] OK    mod-KK-kwalifikator-karnomaterialny
              (✅ PODZIELONY 2026-08-20 — naprawa F-78, priorytet 1
               [2109 linii, największy plik systemu]: plik pod
               NIEZMIENIONĄ nazwą stał się lekkim indeksatorem [104
               linie, tabela nawigacyjna], treść 24 bloków/sekcji
               przeniesiona do 8 plików w podkatalogu
               `kwalifikator-karnomaterialny/` [max 537 linii/plik].
               Decyzja architektoniczna: NIE edytowano ~30 zewnętrznych
               plików odsyłających do tego modułu — nazwa pliku
               niezmieniona, więc wszystkie odesłania nadal działają.
               Zweryfikowano 100% integralność treści [suma linii
               części = oryginał minus nagłówek]. NAPRAWIONO PRZY
               OKAZJI: (1) realna luka merytoryczna — DRZEWO B.1 nie
               ostrzegało o konieczności przekierowania do DRZEWO I.2
               przy ≥2 napastnikach/≥3 uczestnikach [pobicie/bójka to
               inny reżim dowodowy — odpowiedzialność zbiorowa]; (2) 5
               odesłań krzyżowych między blokami zaktualizowanych o
               wskazanie pliku docelowego; (3) 1 PRZEDTEM ISTNIEJĄCE
               martwe odesłanie "BLOK poniżej dot. KW" — nigdy nie
               istniał taki blok, przekierowano do właściwego
               zewnętrznego modułu mod-KW-kodeks-wykroczen.md. ⚠️
               Pozostaje nieopracowane: art. 160 KK [narażenie na
               niebezpieczeństwo] i art. 157a KK [uszkodzenie ciała
               dziecka poczętego] bez własnych drzew decyzyjnych)
  [✓] OK    mod-czynny-zal-KK-KKS-samooskarzenie
              (dodany 2026-07-21: czynny żal KK [art. 15, dwie formy]
               i KKS [art. 16-16a, KLUCZOWE — nie tylko samo-donos,
               wymaga ujawnienia współdziałających] + korekta
               terminologiczna "samooskarżenie" [nie jest odrębną
               instytucją]. Dotąd hasło w 9+ modułach bez treści.
               Odpowiedź na pytanie użytkownika)
  [✓] OK    mod-dobrowolne-poddanie-sie-karze-KPK
              (dodany 2026-07-21: dwa tryby art. 335 [prokurator,
               postępowanie przygotowawcze] i art. 387 KPK [oskarżony,
               etap sądowy] — dotąd całkowita luka. Odpowiedź na
               pytanie użytkownika)
  [✓] OK    mod-KK-art18-22-formy-popelnienia
              (nadrobienie 2026-07-21: sprawstwo/współsprawstwo/
               podżeganie/pomocnictwo, dodany 2026-07-16)
  [✓] OK    mod-KK-art10-odpowiedzialnosc-nieletnich
              (nadrobienie 2026-07-21: trzy reżimy wiekowe — art. 10
               KK vs ustawa o wspieraniu i resocjalizacji nieletnich,
               dodany 2026-07-16)
  [✓] OK    mod-KK-art64-recydywa
              (nadrobienie 2026-07-21: recydywa specjalna podstawowa
               i wielokrotna, art. 64-65 KK, dodany 2026-07-16)
  [✓] OK    mod-KK-art69-84-warunkowe-zawieszenie-zwolnienie
              (nadrobienie 2026-07-21: dwie różne instytucje —
               zawieszenie wykonania kary vs warunkowe przedterminowe
               zwolnienie, dodany 2026-07-16)
  [✓] OK    mod-KK-art101-105-przedawnienie-karalnosci
              (nadrobienie 2026-07-21: przedawnienie karalności vs
               przedawnienie wykonania kary, dodany 2026-07-16)
  [✓] OK    mod-KK-art148-162-przeciwko-zyciu-zdrowiu
              (nadrobienie 2026-07-21 + ROZBUDOWA tego samego dnia:
               typy zabójstwa, uszczerbek na zdrowiu — dotąd BRAKOWAŁO
               art. 158-162 mimo obietnicy w tytule, uzupełniono
               NIEUDZIELENIE POMOCY [art. 162] i sąsiednie przepisy,
               odpowiedź na pytanie użytkownika)
  [✓] OK    mod-KK-art212-216-przeciwko-czci
              (nadrobienie 2026-07-21: zniesławienie i zniewaga,
               dodany 2026-07-16)
  [✓] OK    mod-KK-art222-226-ochrona-funkcjonariusza
              (nadrobienie 2026-07-21, rozbudowany 2026-07-20 o art.
               217a — ochrona osób interweniujących cywilnie)
  [✓] OK    mod-KK-art228-231-korupcja-urzednicza
              (nadrobienie 2026-07-21: łapownictwo bierne/czynne,
               płatna protekcja, nadużycie funkcji publicznej — cztery
               odrębne przestępstwa, dodany 2026-07-16)
  [✓] OK    mod-KK-art250a-korupcja-wyborcza
              (nadrobienie 2026-07-21: przekupstwo wyborcze, dodany
               2026-07-16)
  [✓] OK    mod-KK-art255b-patostreaming
              (nadrobienie 2026-07-21, dodany 2026-07-18)
  [✓] OK    mod-KK-art270-310-falszerstwa-dokumentow
              (nadrobienie 2026-07-21: trzy różne "fałszerstwa"
               [dokumentów/pieniędzy/papierów wartościowych], dodany
               2026-07-16)
  [✓] OK    mod-KK-art296-naduzycie-zaufania
              (nadrobienie 2026-07-21: działanie na szkodę majątkową,
               dodany 2026-07-16)
  [✓] OK    mod-KK-art296a-korupcja-sektor-prywatny
              (nadrobienie 2026-07-21: łapownictwo menadżerskie, dodany
               2026-07-16)
  [✓] OK    mod-KK-art305-zmowa-przetargowa-karna
              (nadrobienie 2026-07-21: udaremnienie/utrudnienie
               przetargu publicznego, ujęcie karne, dodany 2026-07-16)
              (⚠️ 2026-07-15: dodano BLOK 0 — Część Ogólna KK (klasyfikacja
               zbrodnia/występek/materialne/formalne/kontratypy — odpowiedź
               na pytanie o zgodność z doktrynalnym podziałem przestępstw;
               obrona konieczna art. 25 i stan wyższej konieczności art. 26
               w pełni, wcześniej jedno zdanie bez treści); BLOK H —
               przestępczość zorganizowana art. 258 KK; BLOK I —
               zabójstwa/pobicia art. 148/158-159 KK; BLOK J — przestępstwa
               seksualne art. 197-205 KK w tym wobec dzieci/niepełnosprawnych
               + Rejestr Sprawców Dz.U. 2026 poz. 110; BLOK L — uszkodzenie
               mienia art. 288 KK / art. 124 KW z progiem 800 zł (część
               2/6 naprawy); BLOK G rozbudowany — podsłuch/nagrania,
               rozróżnienie uczestnik/osoba trzecia art. 267 §2-4 KK,
               GPS (SN V KK 505/18), kontrola operacyjna służb (część
               5/6 naprawy); wszystkie wcześniej
               całkowicie nieobecne lub tylko wzmiankowane w tabelach)
  [✓] OK    mod-KK-przemoc-domowa-szczegolowy
  [✓] OK    mod-KKS-karny-skarbowy-i-AML
              (⚠️ 2026-07-15: rozbudowany o konkretne artykuły KKS —
               art. 54/55/56/62/76, czynny żal art. 16 KKS, zbieg z KK
               przy karuzelach VAT — wcześniej sam szkielet proceduralny)
  [✓] NAPRAWIONY 2026-08-14 (F-75)
              mod-KKW-kodeks-karny-wykonawczy
              (dotąd generyczny szablon BEZ żadnego artykułu KKW —
               najgorszy wynik pokrycia z 13 zbadanych aktów w raporcie
               zewnętrznym. Dodano sekcję 0: warunkowe przedterminowe
               zwolnienie [159-163, w tym kluczowy art. 161 §3-4 —
               karencja 3/6 mies. wg wymiaru kary, bezpośrednio
               wykorzystuje doświadczenie kancelaryjne sprawy Marek
               Petelski], odroczenie/przerwa wykonania kary [150-158a,
               rozróżnienie odroczenie vs przerwa, obligatoryjne vs
               fakultatywne], dozór elektroniczny [43a-43zf, 3 formy,
               struktura 5 oddziałów]. Naprawiono też niezgodność
               nazwy wewnętrznej pliku. ✅ ROZSZERZONY 2026-08-20 —
               F-75 ZAMKNIĘTA W CAŁOŚCI: sekcja 0.4 prawa i obowiązki
               skazanego [101-120, w tym art. 102 katalog praw, art.
               105/105a widzenia i korespondencja, art. 116 §2-6
               kontrola osobista ze skargą 7-dniową do sądu
               penitencjarnego]; sekcja 0.5 kary dyscyplinarne
               [142-149, katalog kar z art. 143 w tym izolacja pkt 8,
               gwarancje proceduralne art. 145, przedawnienie
               dwutorowe 14/30 dni z art. 147, kontrola sędziego
               penitencjarnego]. ⚠️ [NIEWERYFIKOWANE RZĄD 1] większość
               nowej treści)
  [✓] OK    mod-KPK-tryby-scigania
  [✓] NOWY  mod-tajemnica-zawodowa-poufnosc
              (utworzony 2026-07-15, część 4/6 naprawy; art. 266 KK —
               naruszenie tajemnicy zawodowej/służbowej, zbieg z art. 23
               UZNK, konsolidująca mapa 12 kategorii poufności w systemie;
               wcześniej temat całkowicie nieobecny od strony karnej)
  [✓] NOWY  mod-przymusowe-leczenie-odwykowe
              (utworzony 2026-07-15, część 3/6 naprawy; alkohol — ustawa
               o wychowaniu w trzeźwości art. 24-36, GKRPA→sąd rodzinny;
               narkotyki — ustawa o przeciwdziałaniu narkomanii art. 25-30
               nieletni, art. 71-73a dorośli sprawcy przestępstw; wcześniej
               temat całkowicie nieobecny)
  [✓] NOWY  mod-KPK-wspolpraca-miedzynarodowa-karna
              (utworzony 2026-07-15; ENA — KPK rozdz. 65a-65d; EPPO —
               Dział XIIa KPK, Polska przystąpiła po pierwotnym opt-out;
               Europol/Eurojust — rola pomocnicza, nie śledcza; Konwencja
               Palermska Dz.U. 2005 nr 18 poz. 158)
  [✓] OK    mod-KW-KPW-framework-szczegolowy
              (nowe art. 86c KW — celowy drift/poślizg od 29.01.2026; zloty bez zgłoszenia;
               taryfikator: rozp. Dz.U. 2026 poz. 724 — weryfikuj kody)
  [✓] OK    mod-KW-kodeks-wykroczen
  [✓] OK    mod-KW-art1-48-czesc-ogolna
              (dodany 2026-08-14, F-67: pierwszy systematyczny moduł części
               ogólnej KW — zasady odpowiedzialności (1-17, w tym zbieg
               przepisów art. 9, kontratypy 15-16), kary i środki karne
               (18-39, w tym katalog kar art. 18 i środków karnych art. 28),
               przedawnienie i zatarcie (45-46, TERMIN KRYTYCZNY: 1 rok),
               stosunek do ustaw szczególnych (48). Dz.U. 2025 poz. 734 t.j.
               ze zm. 1676/1814)
  [✓] OK    mod-KW-art119-131-przeciwko-mieniu
              (dodany 2026-07-17: Rozdz. XIV KW — kradzież/przywłaszczenie
               (art. 119, próg 800 zł), paserstwo (122), zniszczenie mienia
               (124) + KLUCZOWE wyłączenia progu kwotowego (broń/amunicja,
               szczególna zuchwałość/włamanie, przemoc/groźba — zawsze
               przestępstwo niezależnie od wartości). Najwyższy priorytet
               z audytu pokrycia KW — dotąd tylko sam próg bez treści)
  [✓] OK    mod-KW-art49-64-porzadek-publiczny
              (dodany 2026-07-17: Rozdz. VIII KW — art. 51 (zakłócanie
               spokoju/porządku/spoczynku nocnego, JEDEN Z NAJCZĘŚCIEJ
               STOSOWANYCH przepisów KW), charakter chuligański i jego
               konsekwencje, art. 49/49a/50/52. Drugi priorytet z audytu
               pokrycia KW)
  [✓] OK    mod-KK-art127-139-przeciwko-RP
              (dodany 2026-07-17: Rozdz. XVII KK — szpiegostwo (art. 130,
               radykalnie zaostrzone reformą 17.08.2023 w reakcji na wojnę
               Rosji przeciw Ukrainie), czynny żal (131), dezinformacja
               wywiadowcza (132, ⚠️ zakres węższy niż nazwa sugeruje),
               zasada wzajemności rozszerzona na PAŃSTWO SOJUSZNICZE (138).
               Priorytet podniesiony przez użytkownika ze względu na
               obecną sytuację bezpieczeństwa)
  [✓] OK    mod-KK-art163-172-bezpieczenstwo-powszechne
              (dodany 2026-07-17: Rozdz. XX KK — sprowadzenie zdarzenia
               niebezpiecznego (163), OCHRONA INFRASTRUKTURY KRYTYCZNEJ
               fizycznej i cyfrowej (165 §1 pkt 3-4 — sieci energia/woda/
               gaz/ciepło + systemy informatyczne), finansowanie
               terroryzmu (165a). Priorytet podniesiony przez użytkownika
               — bezpieczeństwo infrastruktury krytycznej)
  [✓] OK    mod-KK-art181-188a-przeciwko-srodowisku
              (dodany 2026-07-17: Rozdz. XXII KK — zanieczyszczenie
               środowiska (182), gospodarka odpadami (183, najczęstsza
               podstawa odpowiedzialności przedsiębiorców), typ
               kwalifikowany ze skutkiem śmiertelnym (185), czynny żal
               przez naprawienie szkody. Priorytet wskazany przez
               użytkownika — "jeden z powszechniejszych tematów")
  [✓] OK    mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie
              (dodany 2026-07-17: Rozdz. X, XII, XIII KW — bezpieczeństwo
               osób/mienia (art. 70-71, 77-79, 83), przeciwko osobie w
               tym CENTRALNY art. 107 złośliwe niepokojenie (104-108),
               przeciwko zdrowiu w tym szczepienia i choroby zakaźne
               (109-118). Kontynuacja uzupełniania KW)
  [✓] OK    mod-KW-art132-166-pozostale-rozdzialy
              (dodany 2026-07-17, zaktualizowany 2026-08-14 F-67 część 2:
               Rozdz. XV-XIX KW — konsumenci (132-139c), obyczajność
               publiczna (140-142), urządzenia użytku publicznego
               (143-145), obowiązek ewidencji (146-147a), szkodnictwo
               leśne/polne/ogrodowe (148-166, OD 2026-08-14 W PEŁNI:
               19/19 artykułów, w tym art. 158 wyrąb drzewa niezgodny
               z planem urządzenia lasu — przepis centralny dotąd
               CAŁKOWICIE nieopisany). DOMYKA pokrycie części szczególnej
               KW — wszystkie 12 rozdziałów mają teraz pełne pokrycie)
  [✓] OK    mod-grzywny-mandaty-szczegolowe
              (systematyka: grzywna sądowa/mandat/kara adm./grzywna porządkowa/UPEA;
               uchylenie mandatu art.101 KPSW; KPA Dział IVa kary adm.; egzekucja UPEA;
               taryfikator mandatów Dz.U. 2026 poz. 724; przedawnienie; orzecznictwo SN)
  [✓] OK    mod-PRD-prawo-jazdy-punkty-karne
              (PRD + u.k.p. + rozp. ewidencji Dz.U. 2026 poz. 724; punkty karne,
               limity, taryfikator, zatrzymanie/cofnięcie uprawnień przez starostę)
  [✓] OK    mod-PRD-nowe-przestepstwa-drogowe-BRD
              (wydzielony 2026-06-14 z mod-PRD >400 linii: BRD I Dz.U. 2025 poz. 1676
               + BRD II Dz.U. 2025 poz. 1872; brawurowa jazda, nielegalne wyścigi,
               drift art. 86c KW, sądowy zakaz/dożywotni zakaz/przepadek, pj od 17 lat)
  [✓] OK    mod-KK-art291-pranie-pieniedzy
              (2026-07-18: dodano sekcję "fikcyjne firmy jako technika
               prania pieniędzy" — firmy krzaki, słupy, rachunki
               fikcyjne, orzecznictwo SA Katowice o sekwencji przelew→
               wypłata gotówkowa za fikcyjną fakturę)
  [✓] OK    mod-swiadek-koronny-duzy-maly
              (dodany 2026-07-18: pełne opracowanie — duży świadek
               koronny [ustawa 1997, immunitet, program ochrony,
               ryzyko wznowienia w ciągu 5 lat] vs mały świadek koronny
               [art. 60 §3-4 KK, tylko złagodzenie kary, brak ochrony],
               tabela porównawcza, rozróżnienie od świadka incognito.
               Odpowiedź na pytanie użytkownika)
              (paserstwo art. 291-293 KK + pranie pieniędzy art. 299 KK — dopisany do
               listy 2026-07-15, plik istniał wcześniej, patrz naprawa wyżej)
  [✓] OK    mod-ustawa-fundusz-pomocy-pokrzywdzonym
              (dopisany do listy 2026-07-15, plik istniał wcześniej)
  [✓] OK    mod-ustawa-narkomania
              (rozbudowany 2026-07-20: MARIHUANA LECZNICZA [art. 33a,
               recepta Rpw, brak refundacji, zakaz uprawy nawet dla
               pacjenta, rozróżnienie od konopi włóknistych CBD],
               LECZENIE SUBSTYTUCYJNE metadon [zezwolenie marszałka,
               centralny wykaz, ŚWIEŻA nowelizacja 11.06.2026 —
               terminy niestawiennictwa], PREKURSORY [rozporządzenia
               UE 273/2004 i 111/2005, punkt startowy]. Odpowiedź na
               pytanie użytkownika)
              (dopisany do listy 2026-07-15, plik istniał wcześniej — powiązany z
               nowym mod-przymusowe-leczenie-odwykowe.md, sekcja B tego modułu)
  [✓] OK    mod-KPK-mediacja-sprawiedliwosc-naprawcza
              (dodany 2026-07-17: art. 23a KPK §1-7, mediacja karna od 2003,
               rozszerzona na wykroczenia od 2015, idea sprawiedliwości
               naprawczej, przesłanki kwalifikacji, poufność/art. 178a KPK.
               Wypełnia lukę zidentyfikowaną w audycie mediacji — komplementarny
               z dr-12/mod-techniki-mediacyjne-negocjacyjne, nie duplikuje
               ogólnych technik)
  [✓] OK    mod-ustawa-odpowiedzialnosc-podmiotow-zbiorowych
  [✓] OK    mod-KK-art233-244b-przeciwko-wymiarowi-sprawiedliwosci
              (nadrobienie zaległości rejestracyjnej + rozbudowa
               2026-07-21: wymóg UMYŚLNOŚCI w poplecznictwie [brak
               wiedzy = brak przestępstwa, wystarczy zamiar ewentualny,
               nieoczywisty przykład uniewinnienia osoby ukrywanej],
               NOWY art. 240 KK [zamknięty katalog najcięższych
               zbrodni, kolizja z tajemnicami zawodowymi], NOWY list
               gończy krajowy art. 278-280 KPK [odróżnienie od ENA].
               Odpowiedź na pytanie użytkownika)
  [✓] OK    mod-KK-slupy-fikcyjna-reprezentacja-spolki
  [✓] OK    mod-poreczenie-majatkowe-kaucja-karna
  [✓] NOWY  mod-KPK-srodki-zapobiegawcze-tymczasowe-aresztowanie
              (dodany 2026-08-13 — naprawa luki strukturalnej F-23/F-66:
               KPK Dział VI Rozdz. 28, art. 249-263. Przesłanka ogólna
               [249 §1] + szczególne [258 §1-4, w tym najczęstsza w
               praktyce — obawa matactwa] + negatywne [259, sytuacja
               rodzinna] + tryb [250-252, wyłączność sądowa, zażalenie
               7 dni] + maksymalne okresy [263, 3/12/24 mies. + skutek
               przekroczenia]. Rozgraniczone od poręczenia majątkowego
               [już opisanego wyżej] i od KKW/wykonania aresztu [F-75,
               poza zakresem])
  [✓] NOWY  mod-KPK-podstawy-odwolawcze-przeslanki-zarzuty-biegli
              (dodany 2026-08-15 — naprawa CZĘŚCIOWA F-66. Zakres po
               7 sesjach tego samego dnia: art. 17 [przesłanki procesowe]
               + art. 156 Dział IV Rozdz. 17 [dostęp do akt] + art.
               193-206 Rozdz. 22 [biegli, część] + art. 313 [przedstawienie
               zarzutów] + art. 425-440 Dział IX Rozdz. 48 [CAŁY rozdział
               "Przepisy ogólne" postępowania odwoławczego — gravamen 425,
               zaskarżanie orzeczeń odwoławczych 426, elementy środka 427,
               wniesienie 428, odmowa przyjęcia 429, pozostawienie bez
               rozpoznania 430, cofnięcie 431-432, granice rozpoznania
               433, zakaz reformationis in peius 434, 435-436, PEŁNA
               treść rodzajów rozstrzygnięć 437 §1-2 [dopełniona w tej
               sesji, ⚠️ 3. rozbieżność wersji §1 zd.2], PEŁNY katalog
               podstaw odwoławczych 438-440] + art. 485-499 Dział X
               Rozdz. 52 [oskarżenie prywatne] + art. 568a-577 Dział XII
               Rozdz. 60 [wyrok łączny].
               UWAGA: NAZWA PLIKU nie odzwierciedla już pełnego zakresu
               (7 sesji tego samego dnia, 8 sekcji) — pełny zakres w
               spisie treści modułu.
               ⚠️ POZOSTAJE OTWARTE w F-66: dokładne verbatim kilku
               przepisów Rozdz. 48 (427§2-3/430/431/432/433/435/436),
               liczne odesłania, art. 198/199/203-205 Rozdz. 22, art.
               498 (status niejasny), TRZY rozbieżności wersji czasowych
               (575§1, 156§5, 437§1) — patrz sekcja "Pozostają otwarte"
               w samym module)
              (dodany 2026-07-19: poręczenie majątkowe/"kaucja karna"
               [art. 266-269 KPK — alternatywa dla tymczasowego
               aresztowania, zakaz przysporzenia specjalnie na ten cel,
               brak sztywnych widełek kwotowych, przepadek, cofnięcie].
               Odpowiedź na pytanie użytkownika o "kaucję")
  [✓] OK    mod-KK-art263-bron-nielegalna
              (dodany 2026-07-18: art. 263 KK — wyrób/handel/posiadanie
               broni palnej i amunicji bez zezwolenia. Pułapki: broń
               gazowa/alarmowa >6mm = broń palna (uchwała SN I KZP 39/03),
               istotne części traktowane jak cała broń, jeden czyn dla
               długotrwałego posiadania, obligatoryjna grzywna 5000/
               10000 zł. Odpowiedź na pytanie o handel/wyrób broni)
              (dodany 2026-07-17: odpowiedzialność karna "słupów" jako
               prezesów/wspólników — współsprawstwo/pomocnictwo art. 18,
               rozbieżność orzecznictwa co do świadomości, powiązanie z
               art. 296 KK i art. 586-590 KSH; fikcyjna reprezentacja
               spółki — falsus procurator art. 103 KC, fałszywy organ
               art. 39 KC per analogiam, bezskuteczność zawieszona,
               ochrona przez wpis w KRS. Potwierdzono, że korupcja i
               poplecznictwo są już dobrze pokryte — bez duplikacji)
              (odpowiedzialność karna spółek — dopisany do listy 2026-07-15, plik
               istniał wcześniej)
```

> **Przeniesiony do shared/ (2026-07-12):** `mod-KK-stalking-szczegolowy` był
> bajt-w-bajt identyczny z `prawny-router-v3/references/stalking-nekanie.md`
> (wykryte przez `ci_check_shared.py`). Scalony pod jedną kanoniczną lokalizacją:
> `view /mnt/skills/user/shared/STALKING-NEKANIE.md`. Ładuj stamtąd bezpośrednio —
> `mod-KK-art190a-stalking.md` zawiera odesłanie. Pełny opis:
> `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` NOTA-12.

## Jak wywołać

```
view /mnt/skills/user/dr-03-prawo-karne-wykroczenia-egzekucja/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-03-prawo-karne-wykroczenia-egzekucja/MAPA-AKTOW.md
```

## Mapa pokrycia treściowego (planowanie rozwoju skilla)

Rejestr informacyjny — NIE krok obowiązkowy przy obsłudze konkretnej sprawy.
Przydatny przy planowaniu, które luki uzupełnić w pierwszej kolejności
(F-83, zasilony 2026-08-22 z audytu źródłowego 2026-08-13):

```
view /mnt/skills/user/dr-03-prawo-karne-wykroczenia-egzekucja/MAPA-POKRYCIA.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.ms.gov.pl, sn.pl, nsa.gov.pl

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
