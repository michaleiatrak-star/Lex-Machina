# MD7 — BLOKI STRATEGICZNE (konsekwencje, atak, negacja, proweniencja, DTA-ID)

**Wersja:** 1.0.0 | **Utworzony:** 2026-08-20z | **Moduł skilla:** `analizator-dowodow-v3`
**Powstanie:** wydzielony z `analizator-dowodow-v3/SKILL.md` (w. 858-1119) w ramach
flagi **F-100 (B)**. Treść przeniesiona **1:1, bez zmiany ani jednego zdania** —
wyzwalacze, progi i procedury działają dokładnie tak jak przed przeniesieniem.

## Kiedy ten moduł jest wczytywany

| Blok | Wyzwalacz | Charakter |
|---|---|---|
| BLOK-KONSEKWENCJE | ZAWSZE po ustaleniu tez (MODE A/B/C) | bezwarunkowy |
| BLOK-NEGACJA | ZAWSZE przy ≥1 dowodzie i ≥1 tezie | bezwarunkowy |
| BLOK-ATAK-NA-DOWOD | dowody przeciwnika (MP5=TAK) LUB alert P! z proweniencji | warunkowy |
| BLOK-PROWENIENCJA | ≥3 dowody klasy C/D LUB ≥2 świadkowie z tego samego miejsca LUB DTA-ID aktywny | warunkowy |
| DTA-ID-MODE | ≥5 plików LUB ≥5 tez LUB TRYB ETAPOWY; opcjonalnie na żądanie | warunkowy |

⚠️ **Uczciwe postawienie sprawy:** dwa z pięciu bloków są bezwarunkowe, więc
przy pełnej analizie ten moduł i tak zostanie wczytany. Wydzielenie NIE jest
więc oszczędnością „zawsze" — daje trzy konkretne rzeczy: (1) tryb minimalny
z BLOKU G routera i wczesne zakończenia ścieżki nie płacą już za 262 linie
treści strategicznej; (2) SKILL.md wraca do roli routera, a treść
specjalistyczna leży tam, gdzie reszta modułów MP*/MD*; (3) trzy z pięciu
bloków to streszczenia plików kanonicznych w `shared/` — trzymanie ich
w entrypoincie zwiększało ryzyko dryfu streszczenia względem kanonu.

## Relacja do plików kanonicznych `shared/`

Bloki ATAK, NEGACJA i PROWENIENCJA są **skrótami operacyjnymi** — pełne
taksonomie żyją w:
`shared/MOD-ATAK-NA-DOWOD.md` (692 linie), `shared/MOD-NEGACJA-DOWODOW.md` (684),
`shared/MOD-PROWENIENCJA-DOWODOW.md` (457). Przy realnej pracy na dowodach
wczytuj kanon; skrót służy rozpoznaniu, że blok się aktywował, i szybkiemu
przypomnieniu struktury.

---

## BLOK-KONSEKWENCJE — warstwa skutków prawnych tezy

> **Trigger:** ZAWSZE po ustaleniu tez procesowych (MODE A/B/C).
> **Cel:** każda teza musi generować ≥2 automatyczne skutki prawne.
> **Zasada:** bez tej warstwy pismo broni tez, ale nie buduje strategii.
> **Źródło:** DTA W6 (warstwa konsekwencji).

Dla każdej tezy T-X z dashboardu wykonaj trzy kroki:

```
KROK KC1 — Skutek bezpośredni:
  "Co ta teza UDOWADNIA w sensie prawnym?"
  → wskaż normę prawną którą teza realizuje (z W1.4 / ISAP ⚠ HARDGATE)
  → format: C-X.1: [skutek] → [norma]

KROK KC2 — Skutek pośredni:
  "Jakie INNE ROSZCZENIA lub ARGUMENTY wzmacnia udowodnienie tej tezy?"
  → myśl o tezie jako środku do celu, nie celu samym w sobie
  → format: C-X.2: [skutek wtórny] → [roszczenie / argument]

KROK KC3 — Skutek strategiczny (gdy nieoczywisty):
  "Jak udowodnienie tej tezy ZMIENIA pozycję procesową?"
  → wpływ na ciężar dowodu, zakres pism, orzecznictwo, ugodę
  → format: C-X.3: [zmiana pozycji] (opcjonalny)
```

Przykład (sprawa pracownicza — wzorzec VII P 94/25):

```
T-1: Ciągłość stosunku pracy / tożsamość pracodawcy rzeczywistego
  C-1.1: Pracodawca rzeczywisty = HPG → żądanie zapłaty od HPG (art. 22 §1 KP)
  C-1.2: Ciągłość umów = czwarta umowa terminowa → art. 25¹ KP (bezterminowa)
  C-1.3: Obciąża HPG całością roszczeń: wynagrodzenie, PFRON, gotowość

T-2: Gotowość do pracy — niedopuszczenie po stronie pracodawcy
  C-2.1: Prawo do wynagrodzenia za przestój (art. 81 §1 KP) od daty niedopuszczenia
  C-2.2: Przelicza ciężar dowodu — pracodawca musi wykazać brak gotowości powoda
  C-2.3: Wzmacnia T-1: osobisty akt Prezesa = organ z art. 31 KP → tożsamość podmiotu
```

**Zasada:** Bez ≥2 konsekwencji per teza → BLOK-KONSEKWENCJE niekompletny.
Teza bez konsekwencji nie trafia do W1.3 pisma-procesowe-v3 jako GOTOWA.

**Integracja:**
- Konsekwencje C-X.1 → sekcja petitum pisma (co żądamy i od kogo)
- Konsekwencje C-X.2 → sekcja uzasadnienia (alternatywne podstawy)
- Konsekwencje C-X.3 → W2.1 MOD-TIMING / MOD-STRATEGIA-WYBOR

**Dashboard:** nowa tablica `consequences[]` per teza (id tezy, C-X.1, C-X.2, C-X.3, norma).

## BLOK-ATAK-NA-DOWOD — Atak na dowód jako obiekt procesowy

> **Trigger:** gdy w sprawie są dowody przeciwnika (MP5 perspektywa = TAK)
>   LUB gdy BLOK-PROWENIENCJA wykrył P! (alert autentyczności/custody)
> **Plik kanoniczny:** `view /mnt/skills/user/shared/MOD-ATAK-NA-DOWOD.md`
> **Cel:** systematyczna analiza 12 wektorów ataku na dowody przeciwnika
>   + procedura obrony własnych dowodów przed tymi samymi atakami.

```
12 WEKTORÓW ATAKU (AD-1..AD-12) — skrót (szczegóły w MOD-ATAK-NA-DOWOD.md):
  [AD-1]  Autentyczność: metadane, podpis, fałszerstwo, deepfake
  [AD-2]  Łańcuch przechowywania (custody): przerwy, dostęp, integralność
  [AD-3]  Relewantność: fakt bez znaczenia / już udowodniony (art. 227 KPC)
  [AD-4]  Forma: kopia bez oryginału / bez poświadczenia (art. 129 §1 KPC)
  [AD-5]  Zakaz ustawowy: nagrania (art. 168a KPK), tajemnica, RODO, art. 174 KPK
  [AD-6]  Wiarygodność treści: retrospektywne, interes autora, sprzeczność
  [AD-7]  Zakres wniosku: nieokreślony, nieprzydatny (art. 235¹ KPC)
  [AD-8]  Prekluzja: spóźniony (art. 235² KPC / art. 170 §1 pkt 5-6 KPK)
  [AD-9]  Kontrdowód aktywny: KD-1 dokument, KD-2 biegły, KD-3 świadek...
  [AD-10] Dowody elektroniczne: brak metadanych, hash, kontekst, AI/deepfake
  [AD-11] Jednostronny ex parte: wytworzony przez stronę na potrzeby sporu
  [AD-12] Systemowy: sprzeczność, cherry-picking, koordynacja, luki

PROCEDURA ADIS (ofensywna — atakowanie dowodów przeciwnika):
  ADIS-1 → inwentaryzacja dowodów przeciwnika
  ADIS-2 → screening AD-1..AD-12 per dowód
  ADIS-3 → priorytety 🔴/🟠/🟡/🟢
  ADIS-4 → instrument procesowy (wniosek o oddalenie / biegły / oryginał)
  ADIS-5 → sekcja w piśmie "ZARZUTY CO DO MATERIAŁU DOWODOWEGO"

PROCEDURA SHIELD (obronna — szczepienie własnych dowodów):
  S Secure → oryginał + metadane + hash
  H Harden → triangulacja ≥2 klas (P+ z MOD-PROWENIENCJA)
  I Integrate → każdy dowód = konkretna przesłanka art. X §Y
  E Enumerate → wszystkie dowody w pozwie / odpowiedzi (prekluzja)
  L Link → chronologia MP3 + wyjaśnienie pozornych sprzeczności
  D Document → proweniencja per dowód (MOD-PROWENIENCJA §PR1)

INTEGRACJA:
  P! z BLOK-PROWENIENCJA → automatycznie AD-1 + AD-2
  [ZAW] proweniencja → AD-11 + AD-12 SY-3
  MP5 §5.2 "typ: dowodowe" → rozwiń na AD-X z siłą N/10
```

---

## BLOK-NEGACJA — Siła dowodów, techniki negacji i odporność pisma

> **Trigger:** ZAWSZE — automatyczny dla każdej sprawy z ≥1 dowodem i ≥1 tezą.
> **Plik kanoniczny:** `view /mnt/skills/user/shared/MOD-NEGACJA-DOWODOW.md`
> **Cel:** ocenić siłę każdego dowodu wobec technik negacji przeciwnika,
> zidentyfikować milczące przyznania i zbudować odporne pismo.

```
BLOK N1 — CIĘŻAR DOWODU (per teza T-X):
  KR1: kto wywodzi skutki z faktu? → ten ma ciężar (art. 6 KC)
  KR2: czy istnieje przepis odwracający ciężar?
       OD-1 mobbing | OD-2 dyskryminacja | OD-3 dyscyplinarne
       OD-4 wypowiedzenie | OD-5 wypadek | OD-6 probatio diabolica
  KR3: czy fakt jest negatywny? → rozważ art. 231 KPC
  KR4: co wystarczy do SPEŁNIENIA ciężaru przez nas?
  KR5: co wystarczy przeciwnikowi do ZNIWECZENIA?

BLOK N2 — ODPORNOŚĆ DOWODÓW (per klasa A-G):
  A (urz.) → obalenie: wymaga klasy A lub G + dowód błędu/fałszu
  B (pryw.) → obalenie: żądanie oryginału + twierdzenie o przeróbce
  C (koresp.) → obalenie: zaprzeczenie + wniosek o metadane
  D (świad. bezp.) → obalenie: motyw stronniczości + zeznanie przeciwne
  E (świad. pośr.) → samo wskazanie pośredniości obniża do 1/10
  F (strona) → zaprzeczenie strony p. rodzi sprzeczność (art. 233 §1)
  G (biegły) → obalenie: atak na metodologię + wniosek o 2. biegłego

12 TECHNIK NEGACJI (N1-N12) — pełna taksonomia w MOD-NEGACJA-DOWODOW.md:
  [N1]  Gołosłowne zaprzeczenie
  [N2]  Twierdzenie o nieistnieniu faktu pozytywnego
  [N3]  Twierdzenie o nieistnieniu elementu prawnego
  [N4]  Ogólnikowe zaprzeczenie "wszystkiemu"
  [N5]  Atak na autentyczność dokumentu
  [N6]  Odmowa przedłożenia dokumentu (art. 233 §2 KPC)
  [N7]  Zarzut braku formy / wadliwości formalnej
  [N8]  Atak na wiarygodność świadka
  [N9]  Zarzut prekluzji dowodowej
  [N10] Cherry-picking — selektywne cytowanie (MAN-05)
  [N11] Antycypacja zarzutu / immunizacja twierdzenia
  [N12] Zniszczenie lub ukrycie dowodu (spoliation / art. 233 §2)

BLOK N4 — MILCZENIE JAKO PRZYZNANIE:
  Per każde kluczowe twierdzenie faktyczne:
    M1: czy pismo przeciwnika odnosi się wprost? → NIE → M2
    M2: czy objęte ogólnym zaprzeczeniem? → jeśli nie → PRZYZ-MIL
    M3: waga: H (kluczowe) / M (istotne) / L (poboczne)
    M4: formularz: "T-X pozostaje niezaprzeczone. Art. 230 KPC."
  Rejestr [PRZYZ-MIL-H/M/L] → sekcja "Fakty bezsporne" pisma.

PROCEDURA NG1-NG6:
  NG1 mapowanie ciężaru → NG2 odporność → NG3 prognoza N1-N12
  → NG4 milczenie → NG5 raport BLOK-NEGACJA → NG6 integracja pipeline
```

---

## BLOK-PROWENIENCJA — Wykrywanie wspólnego pochodzenia dowodów

> **Trigger OBOWIĄZKOWY:**
>   ≥3 dowodów klasy C lub D (korespondencja, zeznania)
>   LUB ≥2 świadkowie z tego samego miejsca pracy / działu
>   LUB DTA-ID-MODE aktywny (≥5 plików)
> **Trigger na żądanie:** "sprawdź czy z jednego systemu", "czy zeznania skoordynowane",
>   "skąd pochodzi", "czy ten sam autor", "proweniencja"
> **Plik kanoniczny:** `view /mnt/skills/user/shared/MOD-PROWENIENCJA-DOWODOW.md`
> **Cel:** wykryć wspólne źródło ≥2 pozornie niezależnych dowodów i ocenić konsekwencje.

```
7 TYPÓW PROWENIENCJI (pełna taksonomia w MOD-PROWENIENCJA-DOWODOW.md):

  [SYS]   Wspólny system IT  — format/numeracja/metadane systemowe identyczne
  [KOM]   Wspólny komunikator — ten sam nadawca/odbiorca/wątek/kanał
  [ZAW]   Wspólne środowisko zawodowe — ten sam pracodawca/dział/przełożony
  [AUT]   Wspólny autor — metadane, nawyki typograficzne, identyczne błędy
  [URZ]   Wspólne urządzenie — EXIF, adres IP, artefakty skanera
  [LIN]   Podobieństwo tekstu — identyczne zdania, schematy, błędy merytoryczne
  [CHAIN] Wspólny custody — stemple, braki numeracji, kolejność skanowania

4 KLASY KONSEKWENCJI:

  P+  Wzmacniająca: wspólne niezależne źródło → fakt awansuje do BEZSPORNE/PEWNE
  P-  Osłabiająca:  pozorna niezależność → oba dokumenty traktuj jak jeden
  P0  Neutralna:    wspólne źródło znane obu stronom, bez wpływu na siłę
  P!  Alert:        nieoczekiwane wspólne źródło → [H-PROW] + wniosek dowodowy

PROCEDURA (szczegółowa w MOD-PROWENIENCJA-DOWODOW.md §PR1-PR5):
  PR1 Inwentaryzacja proweniencyjna (autor/system/kanał per dowód)
  PR2 Skan par (Di, Dj) pod wszystkie 7 typów
  PR3 Klasyfikacja P+/P-/P0/P!
  PR4 Raport proweniencji (klastry + fakty awansowane/zdegradowane + alerty P!)
  PR5 Integracja: → DTA-ID-MODE → macierz D×T → BLOK-KONSEKWENCJE

INTEGRACJA Z PIPELINE:
  Fakty awansowane P+ → BEZSPORNE w BLOK-KONSEKWENCJE C-X.1
  Alerty P! → wnioski dowodowe art. 248 KPC / biegły art. 278 KPC
  Obniżona wiarygodność P- → RS (ryzyko sporności) w macierzy D×T
  Hipotezy [H-PROW] → MP6-sledczy §6.12 lista pytań śledczych
```

---

---

## DTA-ID-MODE — Numeracja krzyżowa D/F/T (tryb dużych spraw)
> **Trigger opcjonalny:** na żądanie użytkownika przy każdej sprawie.
> **Cel:** cross-referencja Dowód → Fakt → Teza w raportach i pismach.
> **Źródło:** DTA Warstwa 1–5 (identyfikacja + ekstrakcja + numeracja).

```
FORMAT IDENTYFIKATORÓW:

  D-NNN  = Dowód (dokument / plik)
    Format: D-[numer trzycyfrowy]
    Przykład: D-001 = Pracownicy13_08_2024.xlsx
              D-002 = Protokół rozprawy 27.01.2026

  F-NNN  = Fakt (wyekstrahowany z dowodu — TYLKO opis zdarzenia, NIE wniosek)
    Format: F-[numer trzycyfrowy]
    Zasada DTA W2: F-NNN zawiera WYŁĄCZNIE fakty, NIGDY wnioski prawne.
    Przykład: F-101 = "Arkusze HP i HPG w jednym pliku XLS"
              F-102 = "Numeracja pracowników ciągła — brak resetu po 1.07.2023"
    ⛔ ZAKAZ: F-101 = "Spółki stanowią jeden organizm" → to wniosek, nie fakt → [LA-WNIOSEK-W-FAKCIE]

  T-NN   = Teza procesowa (wniosek prawny z faktów)
    Format: T-[numer dwucyfrowy]
    Przykład: T-01 = "HP i HPG korzystały ze wspólnego systemu kadrowego"
              T-02 = "Powód manifestował gotowość do pracy"

CROSS-REFERENCE w raportach i pismach:
  "Jak wynika z D-001 (xlsx), fakt F-102 (ciągła numeracja) potwierdza T-01."
  "D-007 (RCS Park 21.03.2026) → F-301 (osobiste żądanie zaprzestania kontaktu) → T-02 + T-05"
```

```
KIEDY AKTYWOWAĆ DTA-ID-MODE:

  ⛔ OBOWIĄZKOWY (auto-trigger):
     ≥5 plików dostarczonych przez użytkownika
     LUB ≥5 tez w CLAIM-VALIDATION
     LUB TRYB ETAPOWY (>30 plików — HARD GATE z MOD-PORCJOWANIA)

  Opcjonalny (na żądanie):
     Użytkownik mówi: "numeruj", "D-NNN", "DTA", "cross-reference"

  Nieaktywny (domyślny dla małych spraw):
     <5 plików i <5 tez → używaj Lp. (prostsze, wystarczające)
```

```
PROCEDURA INICJALIZACJI DTA-ID-MODE:

KROK DTA-1: Utwórz rejestr D-NNN
  D-001: [nazwa pliku] | [typ wg MT1.2 DOK-URZ/DOK-PRY/etc.] | [klasa A-G z DOWODY-METODOLOGIA §5]
  D-002: ...

KROK DTA-2: Ekstrakcja faktów F-NNN per dowód
  Dla D-001: wylistuj fakty F-101, F-102, F-103...
  Zasada: jeden fakt = jedno zdanie opisowe zdarzenia/stanu (bez ocen prawnych)

KROK DTA-3: Budowanie tez T-NN z faktów
  T-01 wynika z: F-101, F-102, F-103 (D-001), F-205 (D-002)
  T-02 wynika z: F-301 (D-007), F-302 (D-008), F-303 (D-018)

KROK DTA-4: Zasilenie macierzy D×T (MOD-MACIERZ-DOWOD-TEZA)
  Macierz używa D-NNN zamiast D1/D2 → pełna cross-referencja
```

---

## Historia

- **1.0.0 (2026-08-20z)** — wydzielenie z `SKILL.md` (F-100 B). Zero zmian
  treści; weryfikacja bajtowa wykonana przed dostawą. SKILL.md: 1174 → 933 linie.
  Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-20z`.
