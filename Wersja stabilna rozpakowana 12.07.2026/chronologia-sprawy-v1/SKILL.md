---
name: chronologia-sprawy-v1
version: 1.4
type: executive-chronologia
status: production
compatibility: "web_search, web_fetch, Anthropic API"
description: |
  Chronologia Sprawy v1.3 — wielowarstwowa ekstrakcja i porządkowanie zdarzeń prawnych
  z dokumentów procesowych, akt i dowodów. AUTO-TRIGGER przez prawny-router-v3: ≥2
  dokumenty wieloetapowe LUB słowa kluczowe (chronologia, oś czasu, timeline, kolejność
  zdarzeń, kiedy+potem). Na żądanie: ustalanie kolejności faktów, wykrywanie sprzeczności
  dat, przygotowanie stanu faktycznego do pozwu/apelacji/odpowiedzi. Osobna oś czasu per
  wątek prawny, cztery klasy pewności zdarzenia (BEZSPORNE/PEWNE/WYDEDUKOWANE/SPORNE),
  proweniencja każdego zdarzenia, automatyczny indeks sprzeczności dat i opisów,
  obowiązkowa korelacja finansowa (kwoty, terminy, strony płatności) z zestawieniem
  krzyżowym. Integruje się z raport-sytuacyjny-v2.
---

# Chronologia Sprawy v1.3 — Framework Wielowarstwowy

## Historia wersji

```
v1.1: osobna oś czasu per wątek prawny, cztery klasy pewności zdarzenia (BEZSPORNE /
PEWNE / WYDEDUKOWANE / SPORNE), proweniencja każdego zdarzenia (dok_id + strona +
autor twierdzenia), automatyczny indeks sprzeczności (daty ORAZ opisy zdarzeń —
rozbieżności między zeznaniami, dokumentami i twierdzeniami stron), klasa BEZSPORNE
jako podstawa faktów niewymagających dowodzenia. Integruje się z raport-sytuacyjny-v2.

v1.2 (AUDYT 2026-07-12, naprawa na wyraźne wskazanie użytkownika): dodano OBOWIĄZKOWĄ
KORELACJĘ FINANSOWĄ (sekcja 3B) — ekstrakcja kwot/terminów/stron płatności z KAŻDEGO
dokumentu jako osobna kategoria danych, z obowiązkowym zestawieniem krzyżowym kwot
między dokumentami (kto komu ile winien, co zostało/nie zostało zwrócone, w jakim
terminie).

v1.3 (KOREKTA WŁASNEGO BŁĘDU z naprawy v1.2, na wyraźne wskazanie użytkownika, który
odnalazł i udostępnił starszą wersję skilla z 2026-06 zawierającą pliki nieobecne
już w wersji produkcyjnej v1.1): naprawa v1.2 odtworzyła references/sprzecznosci-dat.md
i assets/widget-timeline.html OD ZERA zamiast na bazie realnej treści, bo w chwili
naprawy oryginał nie był dostępny — po porównaniu z odnalezioną starszą wersją:
(a) references/sprzecznosci-dat.md przywrócony na bazie PRAWDZIWEJ oryginalnej
treści (katalog A1–C3 z konkretnymi podstawami prawnymi i tabelą terminów zawitych,
wcześniej zgubioną w wersji odtworzonej od zera) + dopisana nowa KATEGORIA D (KWOTA);
(b) przywrócono assets/ChronologiaSprawy.jsx — plik nadal jawnie referencjonowany w
sekcji "ARCHITEKTURA RENDEROWANIA" tego SKILL.md ("dokumentacja struktury — nie
kopiuj go"), pominięty w paczce v1.2 mimo że tekst się do niego odwoływał (dokładnie
ten sam typ błędu, który v1.2 miało naprawiać); (c) przywrócono references/
BLUEPRINT-SCHEMA.md i upgrade-min8/{MIN8-UPGRADE.md,QUALITY-CHECKLIST.md} —
zweryfikowano, że żaden z nich NIE jest już referencjonowany w aktualnym SKILL.md
(ich treść merytoryczna została wchłonięta przez rozszerzony schemat "CZTERY KLASY
PEWNOŚCI" i PROWENIENCJĘ w v1.1) — zachowane jako materiał archiwalny dla
przejrzystości, nie jako aktywna zależność pipeline'u. Wniosek na przyszłość:
odtwarzanie zaginionego pliku WYŁĄCZNIE z opisu jego roli (bez dostępu do oryginału)
jest z definicji stratne — należy to jawnie nazwać w chwili naprawy, a nie
przedstawiać rekonstrukcję jako równoważną oryginałowi.

v1.4 (2026-07-12, ta naprawa): pole `description` w YAML frontmatter przekraczało
1024 znaki (2773 znaki) — powyżej limitu pola opisu w metadanych skilla. Skrócono
`description` do wersji zwięzłej (poniżej progu), zachowując wszystkie frazy
wyzwalające AUTO-TRIGGER; pełną treść dziennika zmian (v1.1–v1.3) przeniesiono
bez utraty informacji do niniejszej sekcji "Historia wersji" w treści pliku.
```

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Chronologia może zawierać terminy ustawowe, daty wejścia w życie aktów, terminy zawite.
> Przed podaniem jakiegokolwiek przepisu lub sygnatury:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

## ARCHITEKTURA SKILLA

```
chronologia-sprawy-v1/
├── SKILL.md                          ← ten plik — mechanika, tryby, reguły
├── assets/
│   ├── widget-timeline.html          ← interaktywny widget osi czasu (Anthropic API, TRYB B)
│   └── ChronologiaSprawy.jsx         ← LEGACY: dokumentacja struktury (nie renderuje się
│                                        w claude.ai, nie kopiuj do show_widget — patrz
│                                        "ARCHITEKTURA RENDEROWANIA" niżej)
├── references/
│   ├── ekstrakcja-zdarzen.md         ← reguły wyciągania dat i zdarzeń z dokumentów
│   ├── sprzecznosci-dat.md           ← katalog kolizji dat (A-C) i kwot (D) w sprawach PL
│   └── BLUEPRINT-SCHEMA.md           ← ARCHIWALNE (v1): schemat JSON dla ChronologiaSprawy.jsx,
│                                        zastąpiony przez SCHEMAT DANYCH w sekcji TRYB B niżej;
│                                        nieużywany aktywnie w pipeline v1.3
└── upgrade-min8/                     ← ARCHIWALNE (v1): kontrakt jakości sprzed v1.1,
    ├── MIN8-UPGRADE.md                  treść merytoryczna wchłonięta przez CZTERY KLASY
    └── QUALITY-CHECKLIST.md             PEWNOŚCI + PROWENIENCJĘ; nieużywane aktywnie w v1.3
```

**Zasada progressive disclosure:** Zacznij od tego pliku. Widget ładuj tylko w TRYB B.
Dla analizy tekstowej (TRYB A) wystarczy `references/ekstrakcja-zdarzen.md` +
`references/sprzecznosci-dat.md`. Pliki oznaczone ARCHIWALNE nie są wymagane do
działania — zachowane dla ciągłości historycznej, nie usuwaj ich bez wyraźnej decyzji,
żeby uniknąć powtórki błędu z audytu 2026-07-12 (cichej utraty plików przy migracji wersji).

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
  finanse: [{                // [NOWE v1.2] — sekcja 3B, wypełniane RÓWNOLEGLE ze zdarzeniami
    id,                      // "FIN-01"
    kwota, waluta,
    tytul,
    platnik, odbiorca,       // string lub "[OSOBA-NIEZIDENTYFIKOWANA-N]"
    termin,                  // string lub null — NIE zgaduj, jeśli brak w dokumencie
    status,                  // ZAPŁACONE / DO_ZAPŁATY / ZALEGŁE / SPORNE_CZY_ZWRÓCONE / NIEZNANY
    proweniencja: { typ_zrodla, dok_id, strona_dok, autor_twierdzenia },
    powiazane_dok_id,        // tablica DOK-XX potwierdzających/wzmiankujących tę samą kwotę
    kolizja_id               // null lub "SPRZECZNOŚĆ-01" (typ KWOTA)
  }]
  sprzecznosci: [{
    id,          // "SPRZECZNOŚĆ-01"
    typ,         // DATA / OPIS / DATA_I_OPIS / IDENT / KWOTA [NOWE v1.2]
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
9. ⛔ OBOWIĄZKOWO (v1.2): jeśli dokument zawiera JAKĄKOLWIEK wzmiankę o kwocie
   pieniężnej (zapłata, zwrot, opłata, zadatek, kara umowna, odszkodowanie,
   zaległość, rozliczenie) — wypełnij rekord FINANSE wg sekcji 3B. Nie wolno
   potraktować takiej wzmianki wyłącznie jako "zdarzenie" ogólne bez wypełnienia
   pól kwota/waluta/płatnik/odbiorca/termin/status — patrz KROK-FIN-GATE (3B).
   Dotyczy to również dokumentów nieformalnych (wiadomości, korespondencja
   nieprocesowa, arkusze kalkulacyjne) — one najczęściej NIE trafiają do
   sekcji "daty" bo nie mają formy pisma procesowego, a mimo to zawierają
   kluczowe dane finansowe, które łatwo pominąć.
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

## 3B. KORELACJA FINANSOWA MIĘDZY DOKUMENTAMI (OBOWIĄZKOWA, v1.2)

> ⛔ KROK-FIN-GATE — HARD GATE. Nie wolno zamknąć FAZY EKSTRAKCJI (KROK A4/A6)
> jeśli w materiale występuje ≥1 wzmianka o kwocie pieniężnej, a rekord FINANSE
> nie został wypełniony i skorelowany z pozostałymi dokumentami. Pominięcie tego
> kroku jest traktowane tak samo jak pominięcie ekstrakcji daty — jako niepełna
> analiza, nie jako pominięcie nieistotnego szczegółu.

### Dlaczego to osobna bramka, a nie część ogólnej ekstrakcji zdarzeń

Data i opis zdarzenia odpowiadają na pytanie "co i kiedy się stało". Kwota
odpowiada na trzy DODATKOWE pytania, które model pomija, jeśli kwotę potraktuje
się jako zwykły szczegół zdarzenia: **komu**, **ile dokładnie** i **czy/kiedy
rozliczono**. Te trzy pytania rzadko mają odpowiedź w jednym dokumencie —
odpowiedź składa się z fragmentów rozproszonych po wielu źródłach (arkusz +
korespondencja + zeznanie), więc wymaga jawnego, osobnego kroku korelacji, a nie
tylko ekstrakcji.

### Rekord FINANSE — pola obowiązkowe

```
Dla KAŻDEJ wzmianki o kwocie wypełnij:

kwota:            liczba + waluta (np. "700 zł", "1200 PLN") — nigdy w przybliżeniu,
                  jeśli dokument podaje kwotę dokładną
tytul:            za co (opłata za pozwolenie na pracę, zwrot, kara umowna, …)
plator:           kto płaci / kto ma zapłacić (imię, nazwa, lub "NIEZIDENTYFIKOWANY")
odbiorca:         kto otrzymuje / ma otrzymać
termin:           data lub warunek płatności, jeśli wskazany w dokumencie
                  ("po 1 miesiącu", "do 10. dnia następnego miesiąca") — jeśli brak
                  terminu w dokumencie, pole = null, NIE domyślaj się terminu
status:           ZAPŁACONE / DO_ZAPŁATY / ZALEGŁE / SPORNE_CZY_ZWRÓCONE / NIEZNANY
dok_id:           źródło (jak w proweniencji zdarzeń)
strona_dok:       lokalizacja w dokumencie
powiazane_osoby:  lista identyfikatorów osób/podmiotów, których kwota dotyczy
                  (nawet jeśli w danym dokumencie występują tylko pod pseudonimem,
                  numerem telefonu lub inicjałem — patrz KROK-FIN-3 niżej)
```

### KROK-FIN-1 — Inwentaryzacja kwot per dokument

Dla każdego DOK-XX zawierającego kwotę: wypełnij rekord FINANSE jak wyżej.
Rób to RÓWNOLEGLE z inwentaryzacją dat — nie jako odrębny, późniejszy przebieg,
żeby uniknąć sytuacji, w której dokument bez daty procesowej (np. zrzut czatu,
arkusz kalkulacyjny) zostaje uznany za "niekwalifikujący się" do analizy.

### KROK-FIN-2 — Zestawienie krzyżowe (tabela rekoncyliacji)

Zbuduj tabelę: wiersz = jedna relacja płatnicza (jedna osoba/podmiot ↔ jedna
kwota), kolumny = wszystkie DOK-XX, w których ta relacja występuje. Dla każdej
pary dokumentów dotyczących tej samej osoby/kwoty sprawdź:

```
CZY kwota z DOK-A zgadza się z kwotą z DOK-B?
  TAK → oznacz jako potwierdzoną (podnieś pewność zdarzenia o jeden poziom,
        jeśli wcześniej było [WYDEDUKOWANE])
  NIE → SPRZECZNOŚĆ-[N], TYP: KWOTA (nowy podtyp — patrz references/sprzecznosci-dat.md
        → KATEGORIA D) — nie uśredniaj ani nie wybieraj kwoty "bardziej prawdopodobnej"
        bez jawnego uzasadnienia hierarchią źródeł

CZY status (zapłacone/do zapłaty) jest spójny w czasie?
  Zbuduj mini-oś: kwota zgłoszona jako należna (data X) → kwota potwierdzona
  jako zapłacona (data Y, jeśli istnieje) → jeśli status "do zapłaty"/"zaległe"
  utrzymuje się w najpóźniejszym chronologicznie dokumencie → oznacz jako
  [NIEROZLICZONE NA DZIEŃ NAJPÓŹNIEJSZEGO DOKUMENTU], nie milcz na ten temat
```

### KROK-FIN-3 — Identyfikacja osób przy danych szczątkowych

Dokumenty finansowe nieformalne (czat, WhatsApp, SMS) często identyfikują
osoby przez numer telefonu, pseudonim czy samo imię, bez nazwiska. Nie wolno:
(a) milcząco pominąć takiej kwoty, bo "nie wiadomo czyja", ani
(b) domyślnie przypisać jej do strony postępowania bez wskazania podstawy.

```
JEŻELI tożsamość płatnika/odbiorcy nie jest jednoznaczna z samego dokumentu:
  → oznacz osobę jako [OSOBA-NIEZIDENTYFIKOWANA-N] (numeruj kolejno w obrębie sprawy)
  → wskaż wszystkie poszlaki dostępne w materiale, które mogłyby pomóc w identyfikacji
    (numer telefonu, kontekst rozmowy, zbieżność kwoty z innym, w pełni
    zidentyfikowanym dokumentem)
  → NIE zgaduj tożsamości bez jawnego zaznaczenia, że to dedukcja z przypisaną
    skalą pewności (patrz [WYDEDUKOWANE], sekcja 3 wyżej)
```

### KROK-FIN-4 — Eksport

W eksporcie do pisma (sekcja "Rekoncyliacja finansowa", dodatkowa wobec sekcji
A–D z rozdziału EKSPORT DO PISMA PROCESOWEGO) każda relacja płatnicza ma osobny
akapit z kwotą, tytułem, stronami, terminem, statusem i źródłem — w kolejności
chronologicznej rozliczenia, nie w kolejności występowania w aktach.

### SELF-CHECK (uzupełnienie do sekcji SELF-CHECK głównej)

```
□ Czy KAŻDA wzmianka o kwocie w KAŻDYM dostarczonym dokumencie (w tym w plikach
  nieformalnych — czat, arkusz, SMS) ma wypełniony rekord FINANSE?
□ Czy zbudowano tabelę rekoncyliacji krzyżowej (KROK-FIN-2) zamiast wypisania
  kwot osobno per dokument bez zestawienia ich ze sobą?
□ Czy każda kwota o niejasnym statusie rozliczenia (zapłacone/zaległe) na dzień
  najpóźniejszego dostępnego dokumentu została jawnie oznaczona jako
  NIEROZLICZONE, a nie pominięta milczeniem?
□ Czy tożsamości niepełne (telefon/pseudonim) oznaczono jako
  [OSOBA-NIEZIDENTYFIKOWANA-N] zamiast pominięcia lub domysłu bez zastrzeżenia?
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
□ ⛔ [v1.3, audyt 2026-07-12] Czy PRZED zgłoszeniem jakiejkolwiek sprzeczności dat
  wykonałem KROK 0 z sprzecznosci-dat.md (bramka A0): (a) rozróżniłem dosłowne
  czasowniki/zdarzenia prawne w każdym źródle (np. "dowiedziałem się o" ≠
  "otrzymałem/doręczono mi" — to różne zdarzenia, nie warianty tej samej daty),
  (b) jeśli którakolwiek data była względna ("N miesięcy po zdarzeniu Y") — czy
  wykonałem i pokazałem jawne obliczenie arytmetyczne przed porównaniem dat?
  Brak tej bramki = ryzyko zgłoszenia FAŁSZYWEJ sprzeczności (błąd CRIT).
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
□ ⛔ [v1.2] Czy KAŻDA kwota pieniężna w materiale ma wypełniony rekord FINANSE
  (sekcja 3B) i czy zbudowano tabelę rekoncyliacji krzyżowej między dokumentami
  (kto komu ile, czy i kiedy zwrócone)? Brak tego kroku = analiza niekompletna,
  nawet jeśli oś czasu dat jest kompletna.
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
