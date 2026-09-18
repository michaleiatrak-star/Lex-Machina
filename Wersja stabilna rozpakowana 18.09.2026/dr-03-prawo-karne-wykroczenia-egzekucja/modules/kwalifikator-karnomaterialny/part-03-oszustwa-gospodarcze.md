# Kwalifikator karnomaterialny — część 3: oszustwa, przestępstwa gospodarcze/informatyczne

> Część modułu `mod-KK-kwalifikator-karnomaterialny.md` (podział 2026-08-20,
> naprawa F-78 — plik źródłowy przekroczył 2000 linii). Pełny indeks i
> zasady użycia: zobacz plik nadrzędny w katalogu `modules/`. To NIE jest
> samodzielny skill — ładowany WYŁĄCZNIE przez indeks nadrzędny na żądanie
> konkretnego bloku.

---

## BLOK C — PRZESTĘPSTWA OSZUKAŃCZE

### DRZEWO C.1 — OSZUSTWO / WYŁUDZENIE / NIEWYWIĄZANIE Z UMOWY

```
START: Czy ktoś poniósł szkodę majątkową?
│
└─ TAK ↓

JAK SPRAWCA UZYSKAŁ KORZYŚĆ LUB SPOWODOWAŁ SZKODĘ?
│
├─ Przez WPROWADZENIE W BŁĄD lub WYZYSKANIE BŁĘDU
│   (pokrzywdzony sam wydał mienie / rozporządził nim)
│   └─ → ART. 286 §1 KK — OSZUSTWO
│        Kara: 6 miesięcy – 8 lat PW
│        Próg: BRAK (nawet 1 zł to przestępstwo, jeśli znamiona spełnione)
│        Kluczowe: zamiar bezpośredni kierunkowy (cel = korzyść majątkowa)
│
├─ Przez NIEWYWIĄZANIE SIĘ Z UMOWY (brak zamiaru niewykonania od początku)
│   └─ → ART. 471 KC — ODPOWIEDZIALNOŚĆ KONTRAKTOWA (cywilna, nie karna)
│        Kara: BRAK — to spór cywilny, nie przestępstwo
│        ⚠️ TEST ZAMIARU: Czy sprawca miał zamiar niewykonania umowy
│        JUŻ W CHWILI JEJ ZAWIERANIA?
│        ├─ TAK → art. 286 §1 KK (oszustwo)
│        └─ NIE → art. 471 KC (niewykonanie zobowiązania — droga cywilna)
│
├─ Przez WYŁUDZENIE KREDYTU / POŻYCZKI (podanie nieprawdy w dokumentach)
│   └─ → ART. 297 §1 KK — OSZUSTWO KREDYTOWE
│        Kara: 3 miesiące – 5 lat PW
│
└─ Przez KRADZIEŻ TOŻSAMOŚCI / UŻYCIE DOKUMENTÓW INNEJ OSOBY
    └─ → ART. 275 KK (kradzież dokumentu) + ART. 286 KK (oszustwo)
         Zbieg przepisów — kumulatywna kwalifikacja (art. 11 §2 KK)

NIUANS KLUCZOWY:
  Oszustwo (art. 286) ≠ Niewykonanie umowy (art. 471 KC)
  Różnica: MOMENT POWSTANIA ZAMIARU
  → Zamiar przed lub w chwili zawierania umowy = OSZUSTWO (KK)
  → Zamiar po zawarciu umowy (zmieniły się okoliczności) = SPÓR CYWILNY (KC)

POSZLAKI ZAMIARU PIERWOTNEGO (art. 286):
  → Brak środków finansowych w chwili zawarcia umowy
  → Fałszywa firma / sfałszowane dokumenty rejestrowe
  → Wiele pokrzywdzonych tą samą metodą
  → Natychmiastowe zerwanie kontaktu po otrzymaniu pieniędzy
  → Krótki czas działalności przed zniknięciem
```

---


---

## BLOK G — PRZESTĘPSTWA INFORMATYCZNE I GOSPODARCZE

### DRZEWO G.1 — HACKING / NARUSZENIE TAJEMNICY / OSZUSTWO INFORMATYCZNE

```
START: Czy czyn dotyczył systemów informatycznych lub danych?
│
├─ NIEUPRAWNIONY DOSTĘP do systemu / sieci
│   └─ → ART. 267 §1 KK — HACKING
│       Kara: do 2 lat PW
│       ⚠️ Tryb: prywatnoskargowy (§4) — weryfikuj aktualny stan
│       ⚠️ Dostęp osoby uprawnionej (np. pracownik) — może nie być 267
│       → Sprawdź zakres uprawnień + cel działania (RODO / prawo pracy)
│
├─ PODSŁUCH / NAGRANIE bez zgody / ujawnienie (⚠️ ROZBUDOWANE 2026-07-15,
│  część 5/6 naprawy — POPRAWIONO błędne przypisanie paragrafów poniżej,
│  wcześniej §2/3/4 były pomylone; dodano kluczowe rozróżnienie
│  uczestnik/osoba trzecia, wcześniej całkowicie nieobecne)
│   │
│   ├─ ⛔ START — KLUCZOWE PYTANIE: czy nagrywający/podsłuchujący BYŁ
│   │  UCZESTNIKIEM danej rozmowy, czy osobą TRZECIĄ?
│   │
│   ├─ UCZESTNIK NAGRYWA WŁASNĄ ROZMOWĘ (w której bierze udział) →
│   │  CO DO ZASADY NIE JEST PRZESTĘPSTWEM z art. 267 KK — uczestnik
│   │  otrzymuje informację w sposób naturalny (druga strona zwraca się
│   │  bezpośrednio do niego), więc nie "uzyskuje dostępu do informacji
│   │  dla niego nieprzeznaczonej". Dotyczy też rozmów telefonicznych,
│   │  wideokonferencji, rozmów z przełożonym/lekarzem/urzędnikiem.
│   │  ⚠️ RYZYKA MIMO LEGALNOŚCI SAMEGO NAGRANIA:
│   │    - publikacja/rozpowszechnienie nagrania → narusza dobra osobiste
│   │      (art. 23-24 KC — prywatność, wizerunek głosowy, godność) i może
│   │      podlegać RODO (nagranie identyfikujące osobę = dane osobowe)
│   │    - w procesie CYWILNYM: dopuszczalność dowodu z nagrania (art. 308
│   │      KPC) oceniana każdorazowo przez sąd — orzecznictwo NIEJEDNOLITE:
│   │      część sądów uznaje potajemne nagranie za "dowód niedopuszczalny"
│   │      sprzeczny z zasadami współżycia społecznego (SA Warszawa I ACa
│   │      380/99, SA Kraków I ACa 1431/17), inne dopuszczają z oceną
│   │      wiarygodności (autentyczność, kontekst, sposób uzyskania)
│   │
│   └─ OSOBA TRZECIA nagrywa/podsłuchuje CUDZĄ rozmowę (nie bierze w niej
│      udziału) → ART. 267 §3 KK — zakłada LUB posługuje się urządzeniem
│      podsłuchowym/wizualnym/innym urządzeniem/oprogramowaniem W CELU
│      uzyskania informacji, do której nie jest uprawniony
│      Kara: grzywna, ograniczenie wolności albo PW do 2 lat
│      Ściganie: NA WNIOSEK pokrzywdzonego
│      ⛔ PRZESTĘPSTWO Z NARAŻENIA — nie wymaga faktycznego uzyskania
│      informacji, wystarczy podjęcie czynności w tym celu (SN, cytowane
│      w komentarzach: "nie jest koniecznym... rzeczywiste uzyskanie...
│      wystarczy, że sprawca podejmuje czynności... choćby jej nie uzyskał")
│      Chroniony jest DOROZUMIANY poufny charakter wypowiedzi uczestników
│      — bez znaczenia INTENCJE nagrywającego (SN, III KK 265/15: cel
│      obrony w sprawie rozwodowej NIE wyłącza odpowiedzialności karnej)
│      PRZYKŁADY Z ORZECZNICTWA: ukryty dyktafon w biurze/mieszkaniu/
│      samochodzie (wyrok opisany w komentarzach), urządzenie GPS w
│      cudzym pojeździe do śledzenia trasy/miejsca pobytu — SN V KK 505/18:
│      "pojęcie »informacja« obejmuje m.in. skonkretyzowaną wiedzę o
│      miejscu przebywania osoby pokrzywdzonej" — GPS też objęty §3
│      ⚠️ WYJĄTEK (kontratyp): stan wyższej konieczności (art. 26 KK —
│      patrz BLOK K w pliku `part-07-kontratypy-zbieg-sankcje.md`)
│      przy BEZPOŚREDNIM zagrożeniu życia/zdrowia, gdy
│      podsłuch jest JEDYNYM sposobem uzyskania dowodu przestępstwa —
│      ocena bardzo restrykcyjna, nie dla zwykłych sporów rodzinnych/
│      rozwodowych (SA Warszawa I ACa 380/99 — "nie można realizować
│      prawa do obrony w procesie w sposób podstępny")
│
├─ NIEUPRAWNIONY DOSTĘP do CAŁOŚCI LUB CZĘŚCI SYSTEMU INFORMATYCZNEGO
│   └─ → ART. 267 §2 KK (do 2 lat PW) — odrębny od hackingu z §1 (który
│       dotyczy PISMA/SIECI/ZABEZPIECZENIA, nie systemu jako całości)
│
├─ UJAWNIENIE informacji uzyskanej w sposób z §1-3 innej osobie
│   └─ → ART. 267 §4 KK — TA SAMA kara co §1-3 (nie automatyczne
│       zaostrzenie — odrębny czyn za sam fakt ujawnienia)
│
├─ DOWÓD W POSTĘPOWANIU KARNYM z nielegalnego nagrania (⛔ inny standard
│  niż w cywilnym): art. 168a KPK — sąd MOŻE, ale NIE MUSI wykluczyć
│  dowód zdobyty czynem zabronionym; ocena każdorazowa, "owoc zatrutego
│  drzewa" nie jest automatycznie wykluczony w polskim prawie karnym
│  (odmiennie niż w niektórych systemach common law)
│
├─ KONTROLA OPERACYJNA SŁUŻB (podsłuch LEGALNY, prowadzony przez
│  Policję/ABW/CBA i in.) → WYMAGA uprzedniej zgody sądu okręgowego
│  (na wniosek Prokuratora Generalnego/właściwego prokuratora, art. 19
│  ustawy o Policji i analogiczne przepisy w ustawach o służbach) —
│  ⛔ INNY reżim niż art. 267 KK, nie stosuj tego drzewa do służb
│  działających w ramach uprawnień — patrz dr-13 (służby, informacje
│  niejawne) dla szczegółów kontroli operacyjnej
│
├─ SABOTAŻ DANYCH / SYSTEMÓW → ART. 268a KK
│   Kara: do 3 lat PW; znaczna szkoda → do 5 lat PW
│
└─ PHISHING / PRZEJĘCIE DANYCH LOGOWANIA → mienie
    └─ → ART. 287 §1 KK — OSZUSTWO INFORMATYCZNE
         Kara: do 5 lat PW
         Zbieg z art. 286 KK gdy nastąpiło rozporządzenie mieniem
         → Kumulatywna kwalifikacja (art. 11 §2 KK) — kara z przepisu surowszego
```

---

