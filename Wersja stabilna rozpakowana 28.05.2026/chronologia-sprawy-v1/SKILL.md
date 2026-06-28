---
name: chronologia-sprawy-v1
version: 1.1
type: executive-chronologia
status: production
compatibility: "web_search, web_fetch, Anthropic API"
description: |
  Chronologia Sprawy v1.1 — wielowarstwowa ekstrakcja i porządkowanie zdarzeń prawnych
  z dokumentów procesowych, akt i dowodów. AUTO-TRIGGER przez prawny-router-v3: ≥2
  dokumenty wieloetapowe LUB słowa kluczowe (chronologia, oś czasu, timeline, kolejność
  zdarzeń, kiedy+potem). Na żądanie: ustalanie kolejności faktów, wykrywanie sprzeczności
  dat, przygotowanie stanu faktycznego do pozwu/apelacji/odpowiedzi.
  v1.1: osobna oś czasu per wątek prawny, cztery klasy pewności zdarzenia (BEZSPORNE /
  PEWNE / WYDEDUKOWANE / SPORNE), proweniencja każdego zdarzenia (dok_id + strona +
  autor twierdzenia), automatyczny indeks sprzeczności (daty ORAZ opisy zdarzeń —
  rozbieżności między zeznaniami, dokumentami i twierdzeniami stron), klasa BEZSPORNE
  jako podstawa faktów niewymagających dowodzenia. Integruje się z raport-sytuacyjny-v2.
---

# Chronologia Sprawy v1.1 — Framework Wielowarstwowy

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Chronologia może zawierać terminy ustawowe, daty wejścia w życie aktów, terminy zawite.
> Przed podaniem jakiegokolwiek przepisu lub sygnatury:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

## ARCHITEKTURA SKILLA

```
chronologia-sprawy-v1/
├── SKILL.md                          ← ten plik — mechanika, tryby, reguły
├── assets/
│   └── widget-timeline.html          ← interaktywny widget osi czasu (Anthropic API)
└── references/
    ├── ekstrakcja-zdarzen.md         ← reguły wyciągania dat i zdarzeń z dokumentów
    └── sprzecznosci-dat.md           ← katalog typowych kolizji dat w sprawach PL
```

**Zasada progressive disclosure:** Zacznij od tego pliku. Widget ładuj tylko w TRYB B.
Dla analizy tekstowej (TRYB A) wystarczy `references/ekstrakcja-zdarzen.md`.

---

## KOMUNIKAT STARTOWY — wyświetl jako PIERWSZY krok

```
WZORZEC (dostosuj do kontekstu):

"Uruchamiam Chronologię Sprawy v1. Wyciągnę zdarzenia z Twoich dokumentów,
ułożę je na osi czasu i oznaczę ewentualne sprzeczności dat między źródłami.

Obsługuję: pisma procesowe, wyroki, protokoły, korespondencję, umowy,
decyzje administracyjne, wyciągi z akt, zeznania z datami.

💡 Jeśli chcesz interaktywny widget osi czasu z możliwością edycji i eksportu
do pisma — napisz 'widget' lub 'pokaż oś czasu'."
```

> ⚠ ZAKAZ pomijania komunikatu startowego.
> ⚠ ZAKAZ autoładowania widget-timeline.html — tylko na jawne żądanie (TRYB B).

---

## TRYBY PRACY

### TRYB A — Analiza tekstowa (domyślny)

Gdy użytkownik dostarcza dokumenty lub opisuje sprawę słownie:

```
KROK A1 — Wczytaj references/ekstrakcja-zdarzen.md
KROK A2 — Inwentaryzacja dokumentów (DOK-01, DOK-02, …)
KROK A3 — Identyfikuj WĄTKI PRAWNE (W1, W2, …)
KROK A4 — Przeprowadź FAZĘ EKSTRAKCJI (patrz niżej) per dokument
KROK A5 — Wczytaj references/sprzecznosci-dat.md → sprawdź kolizje → buduj INDEKS SPRZECZNOŚCI
KROK A6 — Wygeneruj raport chronologiczny (FORMAT RAPORTU niżej):
           osobna oś per wątek + widok zbiorczy + fakty bezsporne + indeks sprzeczności
KROK A7 — Zaproponuj widget jeśli ≥5 zdarzeń lub ≥2 wątki lub użytkownik potrzebuje eksportu
```

### TRYB B — Widget interaktywny

Gdy użytkownik wpisuje "widget" / "pokaż oś czasu" / "timeline" / "aplikację":

> ⚠️ REGUŁA RENDEROWANIA — pliki `.jsx` przez `present_files` NIE renderują się w claude.ai.
> Jedyna poprawna metoda: `show_widget` z HTML (vanilla JS).

```
KROK B1 — Wyciągnij z rozmowy zdarzenia jako strukturę chronologiczną (schemat poniżej)
KROK B2 — Wywołaj visualize:read_me z modules=["interactive","mockup"]
KROK B2a — ⛔ MOD-WIDGET-IO (OBOWIĄZKOWE przed show_widget):
            view /mnt/skills/user/shared/MOD-WIDGET-IO.md
            → wbuduj pasek IO w nagłówek widgetu (powyżej osi czasu)
            → IO_SKILL_ID='chronologia-sprawy-v1', IO_CASE_ID=sygnatura
            → matryca: Export JSON ✅ MD ✅ | Import JSON ✅
            → ioGetState(): { watki, zdarzenia, sprzecznosci }
            → ioSetState(s): odtwórz oś czasu z wczytanego JSON
KROK B3 — Wywołaj show_widget z HTML vanilla JS:
           • zdarzenia i wątki jako literały JS wbudowane bezpośrednio w HTML
           • osobna oś czasu per wątek (zakładki lub sekcje)
           • widok zbiorczy CROSS-WĄTEK jako opcja
           • filtrowanie po klasie pewności, wątku, znaczeniu
           • węzły wspólne wyróżnione wizualnie z linkami między wątkami
           • CSS variables (var(--color-*)) — BEZ React, BEZ importów
           • NIE używaj cp, str_replace ani present_files

SCHEMAT DANYCH (wbuduj jako literały JS w HTML):
  watki: [{ id, nazwa }]
  zdarzenia: [{
    data, pewnosc,          // BEZSPORNE / PEWNE / WYDEDUKOWANE / SPORNE
    dedukacja,              // null lub { podstawa, wniosek, pewnosc_0_10 }
    opis, strona,
    proweniencja: { typ_zrodla, dok_id, strona_dok, autor_twierdzenia },
    watki,                  // tablica id wątków
    wezel_wspolny,
    znaczenie,
    kolizja_id              // null lub "SPRZECZNOŚĆ-01"
  }]
  sprzecznosci: [{
    id,          // "SPRZECZNOŚĆ-01"
    typ,         // DATA / OPIS / DATA_I_OPIS / IDENT
    zdarzenie,
    watek,
    wersja_a: { tresc, dok_id, strona_dok, autor },
    wersja_b: { tresc, dok_id, strona_dok, autor },
    common_ground,       // null lub string — co OBIE strony faktycznie przyznają
                          // w tej kwestii, niezależnie od spornego elementu
                          // (np. "obie strony zgadzają się, że dokument porozumienia
                          // został podpisany 9.10.2024 — sporna jest tylko ocena
                          // okoliczności podpisania")
    roznica_dni,         // null dla TYP=OPIS/IDENT
    kategoria,           // A-KRYTYCZNA / B-ISTOTNA / C-MARGINALNA
    wplyw, rekomendacja
  }]
  Pola null → null. Nie wymyślaj dat.
```

---

## FAZA EKSTRAKCJI ZDARZEŃ (TRYB A)

### Sekwencja dla każdego dokumentu

```
DLA KAŻDEGO DOKUMENTU:
1. Zidentyfikuj TYP: pismo procesowe / wyrok / protokół / korespondencja /
                     umowa / decyzja / zeznanie / dowód rzeczowy
2. Nadaj identyfikator: DOK-01, DOK-02, … (używaj konsekwentnie w całej analizie)
3. Wypisz WSZYSTKIE daty jawne (dd.mm.rrrr lub podobne) — z numerem strony
4. Wypisz daty ukryte (np. "po 3 miesiącach od...") — zakotwicz do daty referencyjnej
5. Dla każdej daty: ustal ZDARZENIE którego dotyczy
6. Oceń PEWNOŚĆ daty: [BEZSPORNE] / [PEWNE] / [WYDEDUKOWANE] / [SPORNE]
7. Wypełnij PROWENIENCJĘ: typ_zrodla, dok_id, strona_dok, autor_twierdzenia
8. Przypisz zdarzenie do WĄTKU PRAWNEGO (lub kilku)
```

---

## CZTERY KLASY PEWNOŚCI ZDARZENIA

### [BEZSPORNE]
```
Kryteria (wszystkie muszą być spełnione):
✓ Fakt potwierdzony przez OBE strony postępowania — lub
✓ Fakt ustalony przez sąd w prawomocnym orzeczeniu — lub
✓ Fakt wynikający z dokumentu urzędowego niekwestionowanego przez żadną stronę

Zastosowanie w piśmie:
→ Prezentuj bez dowodu: "Niespornym jest, że..."
→ NIE poświęcaj zasobów argumentacyjnych na udowadnianie faktów BEZSPORNE
→ W eksporcie do pisma: sekcja "Fakty bezsporne" przed "Faktami spornymi"

Oznaczenie: ✓✓ [BEZSPORNE]
```

### [PEWNE]
```
Kryteria (wszystkie muszą być spełnione):
✓ Data jawna w dokumencie (dd.mm.rrrr)
✓ Dokument urzędowy lub z potwierdzeniem odbioru
✓ Brak sprzeczności z innymi źródłami
✓ Jedna strona twierdzi, druga nie kwestionuje

Oznaczenie: ✓ [PEWNE]
```

### [WYDEDUKOWANE]
```
Kryteria:
• Zdarzenie wnioskowane logicznie z dwóch lub więcej PEWNYCH faktów
• Brak bezpośredniego dokumentu potwierdzającego, ale wniosek wynika
  z łańcucha przyczynowego bez alternatywnego wyjaśnienia

Obowiązkowy opis rozumowania:
  DEDUKUJĘ: "[opis zdarzenia]"
  PODSTAWA: "[fakt A] (DOK-XX, str. N) + [fakt B] (DOK-YY, str. M)"
  WNIOSEK:  "zdarzenie nastąpiło MIĘDZY [data_A] a [data_B]"
            LUB "zdarzenie nastąpiło PRZED [data_X] bo..."
            LUB "zdarzenie nastąpiło PO [data_Y] bo..."
  PEWNOŚĆ:  [0-10] (0 = spekulacja, 10 = jedyne możliwe wyjaśnienie)

→ W piśmie procesowym: "Z całokształtu materiału dowodowego wynika, że..."
→ Eksponuj rozumowanie — sąd musi widzieć łańcuch logiczny

Oznaczenie: ~ [WYDEDUKOWANE / pewność: N/10]
```

### [SPORNE]
```
Kryteria (choć jedno):
• Dwie różne daty dla tego samego zdarzenia w różnych źródłach
• Data kwestionowana wprost przez stronę
• Sprzeczność wewnętrzna w jednym dokumencie

Oznaczenie: ⚠ [SPORNE]  — zawsze z odesłaniem do INDEKSU SPRZECZNOŚCI
```

---

## OSIE CZASU PER WĄTEK PRAWNY

### Zasada wątków

```
KROK W1 — Identyfikuj wątki prawne przed budową chronologii:
  Przykłady:
  • Sprawa pracownicza: [W1] Stosunek pracy, [W2] Wypowiedzenie, [W3] Mobbing, [W4] ZUS
  • Sprawa cywilna:     [W1] Umowa, [W2] Naruszenie, [W3] Szkoda, [W4] Postępowanie sądowe
  • Sprawa karna:       [W1] Czyn, [W2] Postępowanie przygotowawcze, [W3] Sąd I inst.

KROK W2 — Przypisz każde zdarzenie do wątku (lub kilku — węzeł wspólny):
  zdarzenie.watki = ["W1", "W2"]  ← pojawia się na obu osiach z oznaczeniem [WSPÓLNY]

KROK W3 — Buduj osobną oś czasu per wątek:
  Każda oś: tylko zdarzenia należące do danego wątku
  Węzły wspólne: wyróżnione wizualnie, z odesłaniem do innych wątków

KROK W4 — Generuj widok zbiorczy (CROSS-WĄTEK):
  Wszystkie zdarzenia razem — do wykrywania sprzeczności MIĘDZY wątkami
```

### Struktura zdarzenia (v1.1)

```
ZDARZENIE:
  data:              [dd.mm.rrrr lub zakres lub ~miesiąc.rrrr lub "MIĘDZY X a Y"]
  pewnosc:           [BEZSPORNE / PEWNE / WYDEDUKOWANE / SPORNE]
  dedukacja:         [null / opis rozumowania + podstawa + przedział czasowy]
  opis:              [co się wydarzyło — 1 zdanie, faktycznie, bez ocen]
  strona:            [kto działał: powód / pozwany / sąd / organ / osoba trzecia]

  proweniencja:
    typ_zrodla:      [DOKUMENT_URZEDOWY / DOKUMENT_PRYWATNY / ZEZNANIE /
                      KORESPONDENCJA / DEDUKCJA / TWIERDZENIE_STRONY]
    dok_id:          [DOK-01 / DOK-02 / … — identyfikator z inwentaryzacji]
    strona_dok:      [numer strony / akapit / §X / nagłówek / "str. 3, ust. 2"]
    autor_twierdzenia: [powód / pozwany / sąd / biegły / organ / obie_strony]

  watki:             ["W1", "W3"]  — lista wątków prawnych
  wezel_wspolny:     [true / false]
  znaczenie:         [KLUCZOWE / ISTOTNE / TŁO]
  kolizja_id:        [null / "SPRZECZNOŚĆ-01" — odesłanie do Indeksu Sprzeczności]
  typ_kolizji:       [null / DATA / OPIS / DATA_I_OPIS]
```

---

## FORMAT RAPORTU CHRONOLOGICZNEGO (TRYB A)

```
## CHRONOLOGIA SPRAWY — [tytuł sprawy lub opis]
Wygenerowano: [data]  |  Dokumentów: N  |  Wątków: W  |  Zdarzeń: M  |  Sprzeczności: K

### INWENTARYZACJA DOKUMENTÓW
DOK-01: [nazwa / typ / data pisma / autor]
DOK-02: …

### OŚ CZASU — WĄTEK [W1]: [nazwa wątku]

[data]  ✓✓ [BEZSPORNE]
        [opis zdarzenia]
        Strona: [kto] | Prow.: DOK-01, str. 3 | Autor twierdzenia: obie strony
        Wątki: W1

[data]  ✓ [PEWNE]
        [opis zdarzenia]
        Strona: [kto] | Prow.: DOK-02, str. 1, nagłówek | Autor: powód

[data]  ~ [WYDEDUKOWANE / pewność: 8/10]
        [opis zdarzenia]
        Dedukuję: DOK-01 (str. 4) potwierdza X, DOK-03 (str. 2) potwierdza Y
        Wniosek: zdarzenie nastąpiło MIĘDZY 12.03.2023 a 15.04.2023
        Strona: [kto] | Wątki: W1, W2 ← [WSPÓLNY]

[data]  ⚠ [SPORNE] → zob. SPRZECZNOŚĆ-01
        [opis zdarzenia]
        Prow.: DOK-02 str. 5 (powód) vs DOK-04 str. 1 (pozwany)

### OŚ CZASU — WĄTEK [W2]: [nazwa wątku]
…

### OŚ CZASU — WIDOK ZBIORCZY (CROSS-WĄTEK)
[wszystkie zdarzenia posortowane chronologicznie, z oznaczeniem wątku]

### FAKTY BEZSPORNE
✓✓ [lista zdarzeń klasy BEZSPORNE — do prezentacji w piśmie bez dowodzenia]

### INDEKS SPRZECZNOŚCI

Rejestr obejmuje WSZYSTKIE wykryte rozbieżności — zarówno dotyczące dat,
jak i opisów zdarzeń (co się stało, w jaki sposób, kto był sprawcą, jaki był przebieg).

SPRZECZNOŚĆ-[N]:
  Typ:         [DATA / OPIS / DATA_I_OPIS / IDENT]
  Zdarzenie:   [opis zdarzenia którego dotyczy sprzeczność]
  Wątek:       [W1 / W2 / …]

  ── jeśli Typ = DATA lub DATA_I_OPIS ──
  Data wg A:   [data1] | DOK-[XX], str. [N] | Autor: [powód / pozwany / sąd / …]
  Data wg B:   [data2] | DOK-[YY], str. [M] | Autor: [powód / pozwany / sąd / …]
  Różnica:     [N dni]

  ── jeśli Typ = OPIS lub DATA_I_OPIS ──
  Opis wg A:   "[dosłowny opis lub cytat]" | DOK-[XX], str. [N] | Autor: [powód / …]
  Opis wg B:   "[dosłowny opis lub cytat]" | DOK-[YY], str. [M] | Autor: [pozwany / …]
  Rozbieżność: [co dokładnie się różni — przebieg / sprawca / skutek / okoliczności]

  ── jeśli Typ = IDENT ──
  Osoba wg sprawy:     [imię/nazwisko jak w pismach procesowych] | DOK-[XX]
  Osoba wg dokumentu:  [zapis na podpisie/dokumencie] | DOK-[YY], str. [M]
  Rozbieżność:         [literówka / inna osoba / błąd OCR / niewyjaśnione]

  ── wspólne dla wszystkich typów ──
  Common ground: [null lub opis tego, co OBIE strony przyznają w tej kwestii —
                   element niesporny mimo istnienia sprzeczności]
  Kategoria:   [A-KRYTYCZNA / B-ISTOTNA / C-MARGINALNA]
  Wpływ:       [opis konsekwencji procesowych]
  Rekomendacja: [które źródło wiarygodniejsze i dlaczego / co wyjaśnić]

### ZDARZENIA WYDEDUKOWANE — REJESTR
[lista wszystkich zdarzeń WYDEDUKOWANE z pełnym opisem rozumowania i przedziałem czasowym]

### LUKI CZASOWE
  📌 Wątek [W1]: Brak dokumentów z okresu [od] → [do] ([N dni])
     Potencjalnie istotne: [co mogło się wydarzyć]

### ZDARZENIA NIEUSTALONE CHRONOLOGICZNIE
  ? [opis] — brak daty, wzmiankowane w: DOK-XX, str. N

### REKOMENDACJE DO PISMA
  → Fakty bezsporne (nie wymagają dowodzenia): [lista]
  → Fakty pewne kluczowe dla uzasadnienia: [lista]
  → Fakty wydedukowane — rozwinąć łańcuch logiczny: [lista]
  → Daty wymagające weryfikacji lub wyjaśnienia sprzeczności: [lista]
  → Sugerowana kolejność w uzasadnieniu faktycznym: [numerowana lista]
```

---

## REGUŁY EKSTRAKCJI

### Co traktować jako zdarzenie

```
✓ Złożenie pisma / doręczenie (data z prezentatą lub potwierdzeniem)
✓ Zawarcie umowy / aneksu
✓ Zwolnienie / wypowiedzenie / rozwiązanie stosunku
✓ Wyrok / postanowienie / decyzja administracyjna
✓ Przekroczenie terminu
✓ Płatność / brak płatności / wezwanie do zapłaty
✓ Zdarzenie faktyczne (wypadek, incydent, spotkanie)
✓ Zawiadomienie organów (policja, prokuratura, PIP, UOKiK)
✓ Upływ terminu zawitego
✓ Zmiana stanu prawnego lub faktycznego strony
```

### Czego NIE traktować jako zdarzenie

```
✗ Daty pisania pisma procesowego (chyba że = data zdarzenia)
✗ Daty powołanych przepisów (wejście w życie ustaw) — chyba że kluczowe
✗ Daty orzeczeń powoływanych jako precedens
✗ Daty hipotetyczne / warunkowe ("gdyby doszło do...")
```

### Priorytety wiarygodności źródeł

```
1. Dokumenty urzędowe z pieczęcią / prezentata sądu
2. Wyroki i postanowienia z sygnaturą
3. Korespondencja z potwierdzeniem odbioru
4. Zeznania potwierdzone przez ≥2 świadków
5. Korespondencja e-mail / SMS z metadanymi
6. Zeznania jednostronne
7. Twierdzenia w pismach procesowych (bez dowodu)
```

---

## SPRZECZNOŚCI — PROTOKÓŁ OBSŁUGI

Indeks obejmuje dwa typy sprzeczności — obsługuj oba identyczną ścieżką.

### Typy sprzeczności

```
TYP: DATA
  Definicja: różne źródła podają różne daty dla tego samego zdarzenia
  Wykrywanie: porównaj pole `data` dla zdarzeń o tym samym opisie
  Przykłady:
    • Pracodawca datuje wypowiedzenie 10.04, pracownik zeznaje że otrzymał 15.04
    • Wyrok podaje datę zdarzenia 03.03, zeznanie świadka wskazuje 05.03
  Odesłanie do katalogu: references/sprzecznosci-dat.md → kategoria A/B/C

TYP: OPIS
  Definicja: źródła zgodnie (lub w przybliżeniu) co do daty, ale różnią się
             w opisie przebiegu, sprawcy, skutku lub okoliczności zdarzenia
  Wykrywanie: porównaj treść opisów zdarzeń o tej samej lub zbliżonej dacie
  Przykłady:
    • Świadek A zeznaje: "krzyczał wulgarnie", świadek B: "mówił podniesionym głosem"
    • Pozew: "pracownik odmówił wykonania polecenia", protokół: "pracownik poprosił
      o pisemne potwierdzenie polecenia"
    • DOK-01 (umowa): "termin płatności 30 dni", DOK-03 (faktura): "termin 14 dni"
    • Zeznanie pokrzywdzonego: "uderzył mnie", zeznanie świadka: "popchnął go"
  Odesłanie do katalogu: references/sprzecznosci-dat.md → analogicznie kategoria A/B/C

TYP: DATA_I_OPIS
  Definicja: źródła różnią się zarówno datą, jak i opisem — traktuj jako dwie
             sprzeczności wpisane w jeden rekord SPRZECZNOŚĆ-[N]

TYP: IDENT
  Definicja: dokument dowodowy (podpis, pokwitowanie, formularz) zawiera zapis
             imienia/nazwiska/nazwy podmiotu, który różni się od danych tej samej
             osoby/strony/świadka używanych w pismach procesowych
  Wykrywanie: porównaj zapisy imion/nazwisk/nazw dla osób w tej samej roli procesowej
             (strona, świadek, podpisujący) między dokumentem dowodowym a pismami
  Przykłady:
    • Strona w pozwie: "Michał Wiatrak"; pokwitowanie z 9.10.2024: podpis "Michał Wiatr"
    • Świadek w piśmie: "Bishal Poudel"; pokwitowanie z 5.12.2024: "Bishal Paudel"
  Nie zakładaj automatycznie zgodności ani niezgodności — oznacz [SPORNE] i wymagaj
  wyjaśnienia. Jeśli żadna ze stron nigdy nie odniosła się do rozbieżności, podnieś
  kategorię do A-KRYTYCZNA (zob. references/ekstrakcja-zdarzen.md → A-O5).
```

### Protokół obsługi (wspólny dla obu typów)

```
GDY wykryjesz sprzeczność:
1. Nadaj numer: SPRZECZNOŚĆ-[N] — numeruj sekwencyjnie w obrębie sprawy
2. Określ TYP: DATA / OPIS / DATA_I_OPIS
3. Zapisz obie wersje z pełną proweniencją (dok_id, strona_dok, autor_twierdzenia)
4. Oceń WPŁYW PROCESOWY:
   - KRYTYCZNY:
       DATA:  sprzeczność dotyczy terminu zawitego / przedawnienia / skuteczności doręczenia
       OPIS:  sprzeczność zmienia kwalifikację czynu lub zasadność roszczenia głównego
   - ISTOTNY:
       DATA:  sprzeczność zmienia sekwencję przyczynową
       OPIS:  sprzeczność osłabia lub wzmacnia wiarygodność kluczowego świadka / strony
   - MARGINALNY:
       DATA:  różnica nie wpływa na rozstrzygnięcie
       OPIS:  różnica stylistyczna / subiektywna ocena bez wpływu na ustalenia faktyczne
5. Zaproponuj rekomendację:
   DATA:  które źródło wiarygodniejsze (hierarchia z REGUŁY EKSTRAKCJI pkt 7) i dlaczego
   OPIS:  co wyjaśnić, jaki dowód rozstrzygnąłby sprzeczność (konfrontacja, biegły, dokument)
6. Jeśli wpływ KRYTYCZNY → STOP i poinformuj użytkownika przed kontynuacją analizy
7. Oznacz oba (lub wszystkie) zdarzenia flagą: kolizja_id = "SPRZECZNOŚĆ-[N]"
```

---

## EKSPORT DO PISMA PROCESOWEGO

```
Na żądanie "eksportuj do pisma" / "uzasadnienie faktyczne" / "sekcja faktów":

FORMAT EKSPORTU — SEKCJA A: FAKTY BEZSPORNE
"Niespornym jest, że:
[Numer]. W dniu [data] [podmiot] [zdarzenie]. [brak wskazania dowodu — fakt bezsporny]"

FORMAT EKSPORTU — SEKCJA B: FAKTY UDOWODNIONE
"[Numer]. W dniu [data] [podmiot] [zdarzenie opisane w czasie przeszłym,
bezosobowo, bez ocen]. [Dowód: DOK-XX — nazwa dokumentu, str. N]."

FORMAT EKSPORTU — SEKCJA C: FAKTY WYDEDUKOWANE
"[Numer]. Z materiału dowodowego wynika, że [zdarzenie].
[Dowód pośredni: DOK-XX (str. N) oraz DOK-YY (str. M) — rozumowanie: ...]"

FORMAT EKSPORTU — SEKCJA D: FAKTY SPORNE
"[Numer]. Powód twierdzi, że [wersja A]. Pozwany kwestionuje tę okoliczność,
wskazując, że [wersja B]. [Dowód strony powodowej: DOK-XX. Dowód strony pozwanej: DOK-YY]."

ZASADY:
✓ Każde zdarzenie = osobny akapit z numerem
✓ Sekcja A (BEZSPORNE) zawsze pierwsza — skraca pismo i skupia uwagę sądu
✓ Tylko zdarzenia [BEZSPORNE], [PEWNE] lub [WYDEDUKOWANE z adnotacją] w sekcjach A–C
✓ Zdarzenia [SPORNE] → wyłącznie sekcja D
✓ Kolejność: ścisła chronologiczna (od najstarszego) w obrębie każdej sekcji
✓ Styl: bezosobowy, faktyczny, bez ocen prawnych
✓ Proweniencja (dok_id + strona) → przy każdym fakcie w sekcjach B i C
```

---

## INTEGRACJA Z INNYMI SKILLAMI

```
→ raport-sytuacyjny-v2 [NOWE — v1.1]:
   Po zakończeniu ekstrakcji TRYB A lub TRYB B:
   Przekaż dane chronologii jako tablicę JSON do blueprintu raportu sytuacyjnego.
   Format zgodny ze schematem raport-sytuacyjny-v2:
     chronologia: [
       { data, zdarzenie, zrodlo, status_zrodla, znaczenie_procesowe, ryzyko }
     ]
   Wywołanie: raport-sytuacyjny-v2 TRYB [A] odbiera tablicę automatycznie
   z historii rozmowy. Żeby zasilić go danymi z chronologii:
   Po KROK A4 lub B3 — dodaj do odpowiedzi gotową strukturę JSON z zakodowanymi
   zdarzeniami, opatrzoną nagłówkiem:
   ## DANE CHRONOLOGICZNE DLA RAPORTU SYTUACYJNEGO
   [tablica JSON]
   Raport sytuacyjny wyciągnie ją automatycznie przy budowie blueprintu.

→ analizator-dowodow-v3:
   Po ekstrakcji zdarzeń sprawdź czy daty pokrywają się z datami w dowodach
   Moduł M3c (Spójność) — uruchom jeśli wykryto sprzeczności

→ analiza-sadowa-v6:
   Chronologia jako input do Filtru #4 (Kontekst sporu)
   i Filtru #10 (Sprzeczności między-pismowe)

→ pisma-procesowe-v3:
   Eksport sekcji faktów (FORMAT EKSPORTU wyżej) jako gotowy blok
   do uzasadnienia faktycznego pozwu / apelacji

→ analizator-przepisow-v2:
   Jeśli data zdarzenia wpływa na stosowanie przepisu
   (zmiana prawa w trakcie sprawy) → uruchom weryfikację
   Szczególnie gdy wykryto vacatio legis — przekaż datę zdarzenia do MOD-VACATIO-LEGIS
```

---

## SELF-CHECK (przed każdą odpowiedzią)

```
□ Czy wyświetliłem komunikat startowy?
□ Czy wczytałem references/ekstrakcja-zdarzen.md (TRYB A)?
□ Czy zinwentaryzowałem dokumenty (DOK-01, DOK-02, …)?
□ Czy zidentyfikowałem wątki prawne (W1, W2, …)?
□ Czy przetworzyłem WSZYSTKIE dostarczone dokumenty?
□ Czy każde zdarzenie ma: datę, opis, stronę, proweniencję (dok_id + strona_dok + autor)?
□ Czy każde zdarzenie ma klasę pewności: BEZSPORNE / PEWNE / WYDEDUKOWANE / SPORNE?
□ Czy każde [WYDEDUKOWANE] ma jawny opis rozumowania + podstawę + przedział czasowy?
□ Czy sprawdziłem sprzeczności (references/sprzecznosci-dat.md) → INDEKS SPRZECZNOŚCI?
□ Czy sprawdziłem tożsamość osób podpisujących dokumenty dowodowe (pokwitowania,
  formularze, podpisy) względem danych stron/świadków w pismach procesowych —
  rozbieżności zapisu nazwiska oznaczyłem jako SPRZECZNOŚĆ typu IDENT, nie pominąłem
  jako "oczywistą" zgodność lub literówkę bez odnotowania?
□ Czy każda sprzeczność ma wypełnione pole common_ground (lub null), wskazujące co
  obie strony faktycznie przyznają w danej kwestii niezależnie od spornego elementu?
□ Czy oznaczyłem luki czasowe per wątek?
□ Czy wyodrębniłem sekcję FAKTY BEZSPORNE?
□ Czy eksport do pisma jest bezosobowy i bez ocen prawnych?
□ Czy przy ≥5 zdarzeniach lub ≥2 wątkach zaproponowałem widget?
□ Czy sprzeczności KRYTYCZNE zostały wyróżnione przed kontynuacją?
□ Czy zaoferowałem integrację z analiza-sadowa-v6 lub pisma-procesowe-v3?
□ Czy wygenerowałem blok JSON "DANE CHRONOLOGICZNE DLA RAPORTU SYTUACYJNEGO"?
□ Czy nie podałem żadnego przepisu, terminu ustawowego ani sygnatury bez weryfikacji ISAP?
```

---

## ARCHITEKTURA RENDEROWANIA

Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai — użytkownik widzi tylko link.
**Jedyna poprawna metoda:** `show_widget` z HTML (vanilla JS).
NIE używaj: `cp`, `str_replace`, `present_files`, `.jsx`, `window.__INJECTED__`.
Plik `assets/ChronologiaSprawy.jsx` to dokumentacja struktury — nie kopiuj go.

---

## Integracja z kancelaryjnym jądrem shared

Jeżeli wynik tego skilla ma służyć do pisma, strategii procesowej, oceny ryzyka albo decyzji terminowej, wczytaj właściwe moduły shared:

```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Nie dubluj logiki shared w lokalnych plikach. Lokalne moduły mogą tylko doprecyzować analizę dziedzinową.
