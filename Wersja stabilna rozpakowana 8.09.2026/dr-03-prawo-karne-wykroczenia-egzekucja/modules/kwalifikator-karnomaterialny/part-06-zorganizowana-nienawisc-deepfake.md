# Kwalifikator karnomaterialny — część 6: przestępczość zorganizowana, nienawiść, deepfake

> Część modułu `mod-KK-kwalifikator-karnomaterialny.md` (podział 2026-08-20,
> naprawa F-78 — plik źródłowy przekroczył 2000 linii). Pełny indeks i
> zasady użycia: zobacz plik nadrzędny w katalogu `modules/`. To NIE jest
> samodzielny skill — ładowany WYŁĄCZNIE przez indeks nadrzędny na żądanie
> konkretnego bloku.

---

## BLOK H — PRZESTĘPCZOŚĆ ZORGANIZOWANA (dodany 2026-07-15, naprawa braku)

> ⚠️ Ten blok był CAŁKOWICIE NIEOBECNY do 2026-07-15 (potwierdzone grep-em
> przed dodaniem: 0 wyników na "art. 258"/"zorganizowan" w całym dr-03).
> Rozdział XXXII KK ("Przestępstwa przeciwko porządkowi publicznemu",
> art. 252-264a) — art. 258 to jego centralny przepis.

### DRZEWO H.1 — UDZIAŁ W ZORGANIZOWANEJ GRUPIE / ZWIĄZKU PRZESTĘPCZYM

```
START: Czy w sprawie występuje ≥3 osoby współdziałające w popełnianiu
przestępstw w sposób wykraczający poza zwykłe współsprawstwo?
│
├─ Brak struktury/podziału ról, czyn jednorazowy lub okazjonalny
│   └─ → WSPÓŁSPRAWSTWO (art. 18 §1 KK), NIE art. 258 — orzecznictwo SN
│       konsekwentnie odróżnia "szajkę"/znajomość towarzyską od grupy
│       zorganizowanej (brak automatyzmu: sama znajomość + kontakt
│       telefoniczny + podział zadań NIE przesądza o art. 258)
│
├─ ≥3 osoby, struktura, podział ról, względna trwałość, cel = systematyczne
│  popełnianie przestępstw (KK nie definiuje ustawowo — kryteria z orzecznictwa)
│   ├─ UDZIAŁ (członek szeregowy) → ART. 258 §1 KK
│   │   Kara: od 6 miesięcy do 8 lat PW
│   │   ⚠️ Sam udział jest karalny — NIE wymaga popełnienia dodatkowego
│   │     przestępstwa w ramach grupy (przestępstwo formalne/bezskutkowe)
│   │
│   ├─ Grupa/związek O CHARAKTERZE ZBROJNYM lub w celu terroryzmu
│   │   → ART. 258 §2 KK — od 1 roku do 10 lat PW
│   │
│   ├─ ZAŁOŻENIE lub KIEROWANIE grupą/związkiem (w tym zbrojnym)
│   │   → ART. 258 §3 KK — od 2 do 15 lat PW
│   │
│   └─ ZAŁOŻENIE lub KIEROWANIE grupą o celu terrorystycznym
│       → ART. 258 §4 KK — od 3 do 20 lat PW
│
└─ ZWIĄZEK przestępczy (wyższy stopień zorganizowania niż "grupa" —
   trwała struktura, jawne kierownictwo, zasady przyjmowania członków,
   dyscyplina wewnętrzna, hierarchia) → te same przedziały kar co wyżej,
   ustawa traktuje "grupę" i "związek" łącznie w tych samych paragrafach
```

### ⚠️ NAJCZĘSTSZY BŁĄD KWALIFIKACYJNY (2026) — GOSPODARKA, NIE MAFIA

```
Art. 258 KK coraz częściej stosowany jest w sprawach GOSPODARCZYCH, nie
tylko wobec gangów/kartели — w szczególności przy: karuzelach VAT,
wyłudzeniach paliwowych, praniu pieniędzy zorganizowanym. Typowy zbieg
przy karuzeli VAT: art. 258 KK (udział w grupie) + art. 54/56/62/76 KKS
(oszustwa skarbowe) + art. 270a/271a/277a KK (fałszywe faktury — przy
wartości >10-krotność mienia wielkiej wartości: KARA OD 5 DO 25 LAT,
art. 277a §1 KK — jeden z najsurowszych przepisów w KK).
→ Patrz też mod-KKS-karny-skarbowy-i-AML.md (rozszerzony 2026-07-15).
```

### ⭐ DZIAŁANIE POD PRZYKRYWKĄ LEGALNEGO BIZNESU (dodane 2026-08-04,
na żądanie użytkownika)

```
⚠️ KLUCZOWA ZASADA: LEGALNA REJESTRACJA działalności gospodarczej NIE
DAJE żadnej "immunitetu" przed kwalifikacją z art. 258 KK — decyduje
RZECZYWISTY cel funkcjonowania grupy, NIE formalny status podmiotu:
"Nawet jeśli grupa działa w oparciu o legalnie zarejestrowaną
działalność gospodarczą (np. firma transportowa), ale w rzeczywistości
JEJ CELEM jest ukrywanie towarów akcyzowych lub pranie brudnych
pieniędzy, to może zostać uznana za grupę przestępczą" (potwierdzone
źródłem eksperckim, sierpień 2025)

KONCEPCJA "LBS" (Legal Business Structures / legalne struktury
  biznesowe) — z aktualnej analizy unijnej (infosecurity24.pl, dane
  Europolu, styczeń 2025):
  → Sieć WIELU spółek (CZĘSTO bez faktycznej działalności) z
    PODSTAWIONYMI OSOBAMI w zarządzie (⭐ powiązanie z `mod-KK-slupy-
    fikcyjna-reprezentacja-spolki.md` — SPÓJNE mechanizmy)
  → Rejestrowane w RÓŻNYCH krajach — 70% zidentyfikowanych struktur
    zlokalizowanych WYŁĄCZNIE w UE, 20% mieszanych UE/poza-UE, 10%
    wyłącznie poza UE — sieci działają w ok. **80 KRAJACH** na świecie
  → FIKCYJNE UMOWY I FAKTURY umożliwiają transfer dużych sum przez
    konta należące do tych podmiotów (⭐ POWIĄZANIE z sekcją wyżej —
    art. 270a/271a/277a KK, karuzele VAT)
  → NIERUCHOMOŚCI = NAJPOPULARNIEJSZA lokata dla prania nielegalnych
    zysków — **41%** najgroźniejszych sieci przestępczych w UE
    inwestuje w nieruchomości, z praniem na RÓŻNYCH etapach: zakup
    gruntu, sam proces budowy, komercyjne wykorzystanie

DWA TRYBY INFILTRACJI BIZNESU (rozróżnienie z analizy branżowej):
  → SYSTEMATYCZNA — struktura biznesowa jest STAŁYM, KONIECZNYM
    elementem procederu, bez którego TRUDNO prowadzić działalność
    przestępczą (typowe dla: oszustw VAT/MTIC "znikający podatnik",
    prania pieniędzy w BRANŻY DETALICZNEJ/GASTRONOMICZNEJ — duży
    obrót gotówkowy ułatwia ukrycie nielegalnych wpływów)
  → SPORADYCZNA — większa ELASTYCZNOŚĆ, wykorzystanie legalnej
    struktury OKAZJONALNIE, nie jako stały filar procederu

PRZYKŁADY BRANŻOWE PRZYKRYWEK (z literatury kryminologicznej,
  potwierdzone niezależnie w wielu źródłach): firmy TRANSPORTOWE
  wykorzystywane do PRZEMYTU (towarów, ludzi, narkotyków); legalne
  ZAKŁADY CHEMICZNE wykorzystywane do PRODUKCJI narkotyków (dual-use
  substancji chemicznych); firmy BUDOWLANE/deweloperskie do prania
  przez nieruchomości

TRUDNOŚĆ GRANICZNA (przyznana w doktrynie): "bardzo trudno jest
  sprecyzować dokładnie, kiedy mamy do czynienia z przestępczością
  zorganizowaną, a kiedy zwykła banda [jednorazowa/nieformalna
  grupa] zamienia się w [zorganizowaną strukturę]" — DLATEGO
  orzecznictwo SN (patrz DRZEWO H.1 wyżej) konsekwentnie odróżnia
  zwykłe współsprawstwo/znajomość towarzyską od faktycznej struktury
  organizacyjnej — sama REJESTRACJA firmy jako "przykrywki" NIE
  automatycznie przesądza o art. 258 — liczy się CAŁOŚĆ okoliczności
  (trwałość, podział ról, systematyczność)

NIE MA ZNACZENIA liczba planowanych przestępstw: samo ZAWIĄZANIE
  zorganizowanej struktury w celu popełnienia CHOĆBY JEDNEGO czynu
  karalnego WYSTARCZY do przypisania odpowiedzialności z art. 258 KK
  — grupa NIE MUSI planować wielu przestępstw

MECHANIZMY WYKRYWANIA (kontekst śledczy): analiza przepływów
  finansowych, ustalanie RZECZYWISTYCH beneficjentów (beneficial
  owners) wbrew formalnym "słupom" w KRS, korelacja między
  deklarowanym profilem działalności a RZECZYWISTYM ruchem
  towarów/pieniędzy, współpraca międzynarodowa (Europol, dane o
  strukturach transgranicznych)

Potwierdzone w 6+ zgodnych źródłach, w tym analiza akademicka
(czasopismo.wsb.torun.pl), prawo.pl, infosecurity24.pl [styczeń 2025,
dane Europolu], adwokaci-kmp.pl [sierpień 2025], csp.edu.pl
(Centrum Szkolenia Policji — materiał szkoleniowy).
```

### POWIĄZANE INSTYTUCJE PROCESOWE (⛔ weryfikuj aktualny stan przed sprawą)

```
Świadek koronny — odrębna ustawa (nie KK) — całkowite zwolnienie z
  odpowiedzialności karnej w zamian za ujawnienie istotnych informacji
  o grupie/związku; wąski zakres zastosowania, decyzja prokuratora
  generalnego — sprawdź aktualny tekst ustawy w ISAP, nie cytuj z pamięci.
Mały świadek koronny (art. 60 §3-4 KK) — nadzwyczajne złagodzenie kary
  (nie pełne zwolnienie) w zamian za ujawnienie informacji organom
  ścigania — dostępny szerzej niż "duży" świadek koronny.
Rozszerzona konfiskata (art. 45 §2 KK) — domniemanie, że mienie nabyte
  w okresie działalności w zorganizowanej grupie pochodzi z przestępstwa,
  chyba że sprawca/zainteresowany wykaże legalne pochodzenie — istotne
  narzędzie w sprawach o art. 258 połączonych z przestępstwami majątkowymi.
Przepadek przedsiębiorstwa (art. 44a KK) — możliwy gdy przedsiębiorstwo
  służyło do popełnienia przestępstwa lub ukrycia korzyści z niego —
  weryfikuj przesłanki aktualne w ISAP.
```

---


---

## BLOK Q — PRZESTĘPSTWA Z NIENAWIŚCI / MOWA NIENAWIŚCI (dodany 2026-07-17, naprawa braku)

> Fragment Rozdziału XXXII KK ("Przestępstwa przeciwko porządkowi
> publicznemu") — dotąd w module obecny TYLKO przez odesłanie do art. 258
> (przestępczość zorganizowana, BLOK H) — reszta rozdziału, w tym mowa
> nienawiści (art. 256-257) i przemoc/groźba na tle dyskryminacyjnym
> (art. 119), NIEOBECNA. Zweryfikowano online 2026-07-17.

### Trzy poziomy surowości — od najcięższego do najlżejszego

```
NAJCIĘŻSZY — Art. 119 KK (poza Rozdz. XXXII, ale tematycznie powiązany):
  Stosowanie PRZEMOCY lub GROŹBY BEZPRAWNEJ wobec grupy/osoby z powodu
  przynależności narodowej/etnicznej/rasowej/politycznej/wyznaniowej
  lub bezwyznaniowości → 3 miesiące - 5 lat pozbawienia wolności

ŚREDNI — Art. 256 KK (propagowanie + nawoływanie):
  §1: publiczne propagowanie nazistowskiego/komunistycznego/
      faszystowskiego/innego totalitarnego ustroju PAŃSTWA, LUB
      nawoływanie do nienawiści na tle różnic narodowościowych/
      etnicznych/rasowych/wyznaniowych/bezwyznaniowości
      → do 3 lat pozbawienia wolności
  §1a: propagowanie ideologii nawołującej do PRZEMOCY w celu wpływania
      na życie polityczne/społeczne → ta sama kara
  §2: produkcja/rozpowszechnianie nośników z ww. treścią/symboliką
      totalitarną w celu propagowania → do 2 lat (typ podstawowy
      dystrybucji, łagodniejszy niż propagowanie wprost)
  §3: KONTRATYP — nie popełnia przestępstwa, kto działa w ramach
      działalności ARTYSTYCZNEJ, EDUKACYJNEJ, KOLEKCJONERSKIEJ lub
      NAUKOWEJ (kluczowa linia obrony dla historyków, kolekcjonerów
      militariów, twórców)
  §4: obligatoryjny przepadek przedmiotów (nawet nienależących do sprawcy)

NAJLŻEJSZY (ale wciąż przestępstwo, nie wykroczenie) — Art. 257 KK:
  Publiczne ZNIEWAŻENIE grupy/osoby z powodu przynależności narodowej/
  etnicznej/rasowej/wyznaniowej/bezwyznaniowości LUB naruszenie
  nietykalności cielesnej z tych powodów → do 3 lat pozbawienia wolności
  (⚠️ w praktyce często kara łagodniejsza przez art. 37a, jeśli sprawca
  niekarany i czyn niepoważny)
```

### ⚠️ KATALOG ZAMKNIĘTY — kluczowe ograniczenie praktyczne

Art. 256 i 257 KK chronią WYŁĄCZNIE przed dyskryminacją na tle:
narodowościowym, etnicznym, rasowym, wyznaniowym/bezwyznaniowości
(oraz art. 119: dodatkowo politycznym). **NIE obejmują orientacji
seksualnej, płci, niepełnosprawności ani innych cech** — potwierdzone
wprost w literaturze (mowanienawisci.info): osoba znieważona z powodu
orientacji seksualnej może dochodzić ochrony WYŁĄCZNIE z art. 212 KK
(zniesławienie, tryb PRYWATNOSKARGOWY — zasadnicza różnica proceduralna
względem art. 257, ścigane z urzędu).

### Tryb ścigania i różnica względem zwykłej zniewagi/zniesławienia

| Przepis | Tryb ścigania | Różnica |
|---|---|---|
| Art. 256/257 KK | **Z URZĘDU** | ochrona zbiorowości/grupy chronionej cechy |
| Art. 216 KK (zniewaga zwykła) | Prywatnoskargowy | brak elementu dyskryminacyjnego |
| Art. 212 KK (zniesławienie) | Prywatnoskargowy | jedyna droga dla cech spoza zamkniętego katalogu (np. orientacja seksualna) |

### Checklist kwalifikacji

```
START: Czy wypowiedź/zachowanie dotyczy narodowości/etniczności/rasy/
       wyznania (lub bezwyznaniowości)?
│
├─ NIE (dotyczy orientacji seksualnej, płci, niepełnosprawności i in.)
│  → poza zakresem art. 256/257 → rozważ WYŁĄCZNIE art. 212 KK
│    (zniesławienie, prywatnoskargowe) lub art. 216 KK (zniewaga)
│
└─ TAK → KROK 2: Czy doszło do PRZEMOCY lub GROŹBY BEZPRAWNEJ (nie tylko
         słów)?
   ├─ TAK → art. 119 KK (najsurowszy, 3 m-ce - 5 lat)
   └─ NIE → KROK 3: Czy to PROPAGOWANIE ustroju/ideologii lub NAWOŁYWANIE
            do nienawiści (aktywne działanie o charakterze przekonywania),
            czy tylko ZNIEWAŻENIE (wyrażenie pogardy bez elementu
            "nawoływania")?
      ├─ Propagowanie/nawoływanie → art. 256 KK — sprawdź kontratyp
      │  §3 (działalność artystyczna/edukacyjna/kolekcjonerska/naukowa)
      └─ Znieważenie/naruszenie nietykalności → art. 257 KK
```

---


---

## BLOK R — DEEPFAKE I MANIPULACJA GŁOSEM/OBRAZEM (dodany 2026-07-17, naprawa braku)

> Zidentyfikowane jako brak przez użytkownika ("czy jest obecna kwestia
> deepfake?"). Zweryfikowano online 2026-07-17: **Polska NIE MA
> dedykowanego typu przestępstwa "deepfake"** — organy ścigania i sądy
> stosują KLASYCZNE przepisy KK w zależności od sposobu wykorzystania
> technologii. AI pełni rolę NARZĘDZIA, nie odrębnej podstawy
> odpowiedzialności.

### Mapa kwalifikacji wg sposobu wykorzystania

```
START: W jakim CELU wykorzystano deepfake/klonowanie głosu/manipulację
       obrazem?

├─ WYŁUDZENIE PIENIĘDZY/KORZYŚCI MAJĄTKOWEJ
│  (np. sklonowany głos "wnuczka"/przełożonego proszącego o przelew —
│  tzw. "oszustwo na wnuczka 2.0"; fałszywa reklama z deepfake'iem
│  celebryty/polityka promującym inwestycję)
│  → ART. 286 §1 KK (oszustwo) — wprowadzenie w błąd w celu doprowadzenia
│    do niekorzystnego rozporządzenia mieniem → 6 miesięcy - 8 lat
│  → W ZBIEGU z art. 190a §2 KK (kradzież tożsamości), jeśli deepfake
│    przedstawiał KONKRETNĄ, rozpoznawalną osobę — rekomendowana
│    kwalifikacja kumulatywna: art. 286 §1 w zb. z art. 190a §2 KK
│    (najtrafniejsza wg doktryny — patrz literatura)
│
├─ PODSZYWANIE SIĘ POD OSOBĘ W CELU WYRZĄDZENIA SZKODY (majątkowej LUB
│  osobistej), NIEKONIECZNIE dla korzyści majątkowej sprawcy
│  → ART. 190a §2 KK (kradzież tożsamości) — samodzielna podstawa, gdy
│    brak elementu doprowadzenia do rozporządzenia mieniem (patrz też
│    `mod-KK-art190a-stalking.md` dla pełnej treści art. 190a)
│
├─ TWORZENIE/POSŁUGIWANIE SIĘ SFAŁSZOWANYM DOKUMENTEM przy użyciu AI
│  (np. wygenerowane fałszywe zaświadczenie, certyfikat, nagranie
│  użyte jako "dowód")
│  → ART. 270 KK (fałszerstwo dokumentu) — patrz
│    `mod-KK-art270-310-falszerstwa-dokumentow.md`
│
├─ PRZYPISANIE OSOBIE NIEPRAWDZIWYCH WYPOWIEDZI/ZACHOWAŃ W CELU
│  ZASZKODZENIA REPUTACJI (rozpowszechnianie deepfake'a kompromitującego)
│  → ART. 212 KK (zniesławienie, prywatnoskargowe) lub ART. 216 KK
│    (zniewaga) — patrz `mod-KK-art212-216-przeciwko-czci.md`
│  → Jeśli treść ma charakter SEKSUALNY (np. deepfake pornograficzny
│    przedstawiający realną osobę bez jej zgody) — sprawdź DODATKOWO
│    kwalifikację z Rozdziału XXV KK (BLOK J kwalifikatora) — ⚠️ brak w
│    tej sesji jednoznacznego ustalenia, czy istnieje w KK przepis
│    dedykowany "pornografii deepfake" — prawdopodobnie kwalifikacja
│    przez art. 191a (rozpowszechnianie wizerunku nagiej osoby/w trakcie
│    czynności seksualnej bez zgody) w zb. z art. 190a §2 — ZWERYFIKUJ
│    PRZED UŻYCIEM, nie potwierdzono wprost w tej sesji
│
└─ CYBERATAK/PHISHING z użyciem generowanych przez AI treści
   → sprawdź `mod-KK-art267-269c-cyberprzestepstwa.md` /
     `mod-KK-cyberprzestepstwa-szczegolowy.md`
```

### Kluczowe ustalenie doktrynalne

Cytowana w literaturze (Budyn-Kulik [w:] Kodeks karny. Komentarz
aktualizowany, red. M. Mozgawa, LEX/el. 2024) rekomendacja dla
najczęstszego scenariusza (wyłudzenie z użyciem sklonowanego głosu):
**kwalifikacja kumulatywna z art. 286 §1 KK w zb. z art. 190a §2 KK**
— uznana za najtrafniejszą, bo oddaje ZARÓWNO element oszustwa
(doprowadzenie do niekorzystnego rozporządzenia mieniem), JAK I element
podszycia się pod konkretną, zidentyfikowaną osobę.

### Rozwój regulacyjny — AI Act (nie kryminalizuje, wymaga PRZEJRZYSTOŚCI)

Od **2 sierpnia 2026 r.** obowiązują wymogi przejrzystości wynikające z
unijnego AI Act — treści wygenerowane/zmanipulowane przez AI (obraz,
dźwięk, wideo) muszą być OZNACZONE jako takie. **Deepfake NIE STAJE SIĘ
przez to automatycznie nielegalny** — to obowiązek oznaczenia, nie zakaz
tworzenia. Naruszenie tego obowiązku oznakowania rodzi odpowiedzialność
NA GRUNCIE AI Act (reżim odrębny od KK, administracyjny/regulacyjny) —
nie zastępuje kwalifikacji karnej z mapy powyżej, gdy treść posłużyła do
popełnienia klasycznego przestępstwa.

**Ograniczenie konstytucyjne dla przyszłej regulacji (odnotowane w
doktrynie):** wprowadzenie przepisów zakazujących WSZYSTKICH deepfake'ów
wprost kolidowałoby z konstytucyjnie chronioną wolnością wypowiedzi (art.
54 Konstytucji) — stąd obecne podejście ustawodawcy (klasyczne przepisy
+ obowiązek oznaczenia) zamiast odrębnej penalizacji samej technologii.

### Ochrona cywilnoprawna (równolegle do karnej)

Art. 23-24 oraz art. 44 KC — naruszenie wizerunku, czci lub prywatności
osoby przedstawionej w deepfake'u → podstawa do żądania zaniechania
naruszeń, usunięcia treści lub zadośćuczynienia — DOSTĘPNA RÓWNOLEGLE
z odpowiedzialnością karną, nie zamiast niej.

### Checklist kwalifikacyjny dla pełnomocnika

```
□ Czy był element wprowadzenia w błąd w celu korzyści majątkowej?
  → art. 286 §1 (+ 190a §2 jeśli podszycie pod konkretną osobę)
□ Czy chodziło WYŁĄCZNIE o podszycie się (bez elementu majątkowego)?
  → art. 190a §2 samodzielnie
□ Czy powstał sfałszowany DOKUMENT (nie tylko nagranie/obraz)?
  → dodaj art. 270
□ Czy celem było zaszkodzenie reputacji (bez elementu majątkowego/
  podszycia się w celu wyłudzenia)?
  → art. 212/216 (uwaga: tryb prywatnoskargowy — koszt i inicjatywa
  po stronie pokrzywdzonego)
□ Czy treść ma charakter seksualny/intymny? → ZWERYFIKUJ ODRĘBNIE
  możliwy zbieg z art. 191a — NIE potwierdzono wprost w tej sesji
□ Niezależnie od powyższego — rozważ RÓWNOLEGŁE roszczenie cywilne
  z art. 23-24 KC (nie wyklucza ścieżki karnej)
```

### Literatura BLOK R (zweryfikowana online 2026-07-17)

- Budyn-Kulik [w:] *Kodeks karny. Komentarz aktualizowany*, red. M. Mozgawa,
  LEX/el. 2024 — rekomendacja kwalifikacji kumulatywnej.
- prawo.pl, *Odpowiedzialność karna za deepfake w celu wyłudzenia
  pieniędzy* (2023) — analiza na przykładach medialnych.
- pirozek.pl, *Deepfake, AI i przestępstwa — czy polskie prawo nadąża?*
  (2025) — przegląd zastosowań przestępczych.
- obrona24h.pl, *Sztuczna inteligencja jako narzędzie przestępstw* (2025)
  — mapa kwalifikacji (286, 190a, 270) potwierdzona niezależnie.
- gazetaprawna.pl (2026) — obowiązki przejrzystości AI Act od 2.08.2026.
- ResearchGate, *Deep fake — postęp technologiczny a prawo karne* (2024)
  — ograniczenie konstytucyjne dla przyszłej regulacji.

---

