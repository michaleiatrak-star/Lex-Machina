---
name: dr-02-prawo-cywilne-rodzinne-gospodarcze
version: 3.6
description: |
  DR-02: Prawo Cywilne, Rodzinne i Gospodarcze
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

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

## Moduły (27 łącznie — ✓ 27 OK, ☐ 0 STUB)

```
  [✓] OK    mod-KC-cywilne-zobowiazania-odpowiedzialnosc
  [✓] OK    mod-KC-spadki
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
  [✓] OK    mod-KSH-wrogie-przejecie-obrona-bialy-rycerz
              (dodany 2026-07-18: brak definicji ustawowej "wrogiego
               przejęcia" — termin ekonomiczny; techniki obrony
               prewencyjne (zapisy statutowe, akcje nieme/uprzywilejowane,
               złote spadochrony) i reaktywne (biały rycerz — z
               zastrzeżeniem że to wciąż przejęcie, tylko friendly;
               zatruta pigułka, MBO). Odpowiedź na pytanie użytkownika)
  [✓] OK    mod-PrUpad-upadlosc-restrukturyzacja
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
view /mnt/skills/user/dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-02-prawo-cywilne-rodzinne-gospodarcze/MAPA-AKTOW.md
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
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
