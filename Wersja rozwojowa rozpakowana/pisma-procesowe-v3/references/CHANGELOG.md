# CHANGELOG — pisma-procesowe-v3

- 5.26 (2026-09-16, F-189): ODTWORZENIE utraconego wydania 5.25 (F-189): markery T28-OK na dwóch liniach opisujących naprawy w modules/MOD-OPLATY.md. Treść merytoryczna bez zmian.
- 5.25 — LUKA JAWNA: wydanie AUDYT-2026-09-12f nieobecne na dysku — odtworzone w 5.26
- 5.24 (2026-09-12d, O-11 rodzina TERMINY): MOD-SZABLONY — szablon sprzeciwu opierał termin na UCHYLONYM art. 503 § 1 KPC; teraz art. 480[2] § 2 pkt 1-2 KPC z rozróżnieniem miejsca doręczenia, dopuszczalność art. 505 § 1, skutek art. 505 § 2. ⛔ SZÓSTE wystąpienie "art. 328[1] KPC" — poprawione na art. 328 § 1 i § 2 KPC. SKILL.md: katalog pism prostych powoływał art. 503 KPC oraz art. 328[1] KPC — oba poprawione
- 5.23 (2026-09-12c, O-11 c.d.): MOD-OPLATY - nowa sekcja OP-1a z rodzinami oplat poza KSCU (komornicze Dz.U. 2024 poz. 377, skarbowe Dz.U. 2025 poz. 1154, notarialne Dz.U. 2024 poz. 1566, koszty procesu karnego KPK Dz.U. 2026 poz. 490, wieczystoksiegowe art. 42-48 KSCU) oraz wiersz doreczenia przez komornika Z PODSTAWA art. 41 ust. 1 ustawy o kosztach komorniczych. Odnotowana zmiana kwoty: zryczaltowana rownowartosc wydatkow przy oskarzeniu prywatnym to 1000 zl od 1.07.2025, nie 300 zl
- 5.22 (2026-09-12, O-11 c.d.): MOD-OPLATY przebudowany z ODCZYTU TRESCI KSCU Dz.U. 2025 poz. 1228. OBALONE: progi WPS jako "art. 27 pkt 1-6 KSCU" (art. 27 to oplata stala 200 zl od enumerowanych pozwow), "art. 19 par. 2b" i wzor EPU 1,25% (jest 1/4 oplaty, art. 19 ust. 2 pkt 2 + art. 20 ust. 1), zarzuty "art. 19 par. 3" (jest art. 19 ust. 4, z konsumenckim capem 750 zl), zabezpieczenie art. 69 (jest art. 68 pkt 1), "apelacja karna 0 zl art. 620 KPK" (art. 620 KPK dotyczy wykladania wydatkow; oplaty karne reguluje ustawa z 23.06.1973 i powstaja w orzeczeniu). Dopisane: OP-0 KROK 0 z art. 104a (w EPU i S24 NIE MA zwolnienia na wniosek), OP-2 pelny katalog zwolnien art. 95/96/100-107, OP-2a ZWROT OPLATY art. 79 (w tym polowa oplaty od pozwu o rozwod bez orzekania o winie i calosc przy pojednaniu), rozwod 600 zl i sprawy rodzinne, art. 13a-13f w tym premia mediacyjna art. 13e. NAPRAWA TERMINU ZAWITEGO: zarzuty od nakazu nakazowego podawane jako 7 dni z art. 493 par. 1 KPC - art. 493 par. 1 NIE ZAWIERA terminu; termin ustanawia art. 480[2] par. 2 KPC i wynosi MIESIAC przy doreczeniu na terytorium UE, 2 tygodnie dla nakazu upominawczego w kraju, 3 miesiace poza UE. Poprawione takze "art. 328[1] KPC" -> art. 328 par. 1 KPC (ta sama usterka co 5.16.2 w analizator-dowodow-v3 - propagacja niewykonana). MOD-SZABLONY: "zwolnienie z oplaty do WPS 50 000 zl" -> pracownik zwolniony niezaleznie od WPS
- 5.21 (2026-09-10x, O-11): MOD-SZABLONY: pole "Oplata sadowa" w szablonie pisma opatrzone ostrzezeniem o zwolnieniach i o capie 100 000 zl
- 5.20 (2026-08-26): skorygowano metrykę podstawy prawnej w module pracodawcy
  rzeczywistego.

> Pełna historia napraw i zmian wersji. Wyniesiona z SKILL.md 2026-07-12
> (runda 2 — redukcja kosztu kontekstu) — treść skopiowana 1:1, bez zmian,
> żeby nie tracić żadnej informacji z historii audytów. Wczytuj TYLKO gdy
> potrzebujesz historii konkretnej naprawy (np. przy audycie, przy pytaniu
> 'dlaczego to tak działa', przy regresji). Nie jest potrzebna w normalnym
> toku pracy nad pismem.

- 5.19 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-126**): sekcja `## CHANGELOG` usunięta z korpusu `SKILL.md`, wpisy przeniesione 1:1 do tego pliku (ZASADA 15 — jedna lokalizacja kanoniczna historii). W korpusie zostało wyłącznie odesłanie. Treści NIE odtwarzano z pamięci — przeniesiony został istniejący tekst. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24.

- 5.18 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, kopia treści zastąpiona wywołaniem. Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

## CHANGELOG

**5.7 (2026-06-26) — NAPRAWA KRYTYCZNA: MOD-MACIERZ-DOWOD-TEZA przeniesiona z W2.1 do W1.2c + WBUDOWANIE W PISMO**

Root cause (sprawa VII P 94/25, sesja 2026-06-26):
Dwa niezależne błędy powodowały, że tabela D×T nigdy nie trafiała do pisma:

BŁĄD 1 — Zła pozycja w pipeline:
  Macierz była wczytywana w W2.1 (przed redakcją pisma).
  Własny nagłówek modułu mówi: "Pozycja: po W1.2a, przed W1.3".
  Skutek: pismo redagowane bez wiedzy o lukach i wielofunkcyjności dowodów;
  mapa przesłanka→dowód (W1.3) budowana bez gotowych wyników MT.

BŁĄD 2 — Brak instrukcji wbudowania w pismo:
  Macierz traktowana jako wewnętrzny krok roboczy, nie jako sekcja pisma.
  Skutek: tabela D×T istniała tylko w pamięci modelu; do dokumentu trafiała
  lista dowodów en bloc bez powiązania z tezami (niezgodnie z art. 227, 232 k.p.c.).

Naprawy:
  1. KROK MT dodany w W1.2c-PRE po KROK ŁD — sekwencja MT1→MT2→MT3→MT4→MT5.
  2. Cztery nowe zakazy na końcu bloku W1.2c (w tym: ZAKAZ W1.3 bez macierzy,
     ZAKAZ wniosków dowodowych jako lista en bloc).
  3. Klauzula ⛔ WBUDOWANIE W PISMO: tabela D×T z MT4 WCHODZI do treści pisma
     jako sekcja widoczna dla sądu; wnioski dowodowe formułowane PER TEZA.
  4. Duplikat view() w W2.1 zastąpiony przypomnieniem (macierz gotowa z W1.2c)
     z instrukcjami użycia w redakcji (PER TEZA, MT5-MANDATE-ALL-EVIDENCE).

**5.9 (2026-06-27) — NAPRAWA: FSL-D (Fact-Source-Lock Dokumentów) — per-teza weryfikacja z zakazem cytowania z pamięci**

Root cause (sprawa VII P 94/25, sesja 2026-06-27):
Po SD-VER = KOMPLET (wszystkie pliki odczytane) macierz D×T była budowana
z pamięci modelu, nie z per-teza przeszukania SD-FAKTY. Pliki o mylących
nazwach (Szef.odt → wiadomości RCS z gotowością, Zatrudnienie.odt → WhatsApp
z kartami pobytu, Pracownicy13.08.2024.xlsx → status powoda jako aktywny
pracownik HPG) były pomijane w skanowaniu tez bo „intuicyjnie nie pasowały".
Skutek: teza gotowości do pracy — 1 dowód zamiast 4. Teza pracodawcy
faktycznego — argumenty ogólne zamiast dowodów dokumentowych.

Naprawa:
1. Nowy plik: `shared/MOD-FSL-DOKUMENTY.md` (v1.0.0)
   Hard gate między SD-VER a macierzą D×T. Per każdą tezę: przeszukanie
   WSZYSTKICH D[id] (niezależnie od nazwy pliku) z zakazem cytowania z pamięci.
   Każde twierdzenie atomowe = D[id] + lokalizacja (str/zakładka/obraz/godz).
   Luki 🔴/🟠 = blokada .docx lub żądanie ewentualne.
2. W1.2c-PRE: dodano sekcję W1.2c-FSL-D z KROK FSL-D przed KROK KD.

---

**5.10 (2026-07-05b) — NAPRAWA: hard gate W3.2 orzeczenia — gradient TREŚĆ zamiast samej ISTNIENIA (NSA I FZ 104/26)**

Root cause (postanowienie NSA z 23.06.2026, sygn. I FZ 104/26): pełnomocnik
powołał w zażaleniu postanowienia NSA jako poparcie tezy o przesłankach
wstrzymania wykonania decyzji — NSA ustalił, że powołane orzeczenia zapadły
w innych datach niż podane i żadne nie dotyczyło w ogóle tej instytucji
procesowej; ocenił to jako "bezrefleksyjne korzystanie z AI" i brak
profesjonalizmu. Diagnoza w tym systemie: hard gate W3 w SKILL.md wymagał
tylko "sygnatury + URL" (poziom ISTNIENIE) dla każdego ⚠️On, a KROK 2 w
W3.2 (`references/W3-WERYFIKACJA.md`) nie wymuszał jawnie weryfikacji
DOKŁADNEJ DATY niezależnie od sygnatury.

Naprawa:
1. Hard gate W3 (SKILL.md): ⚠️On wymaga teraz statusu GRAD z
   `shared/WERYFIKACJA-SLAD.md` (GRAD-1..4), nie samego URL — 🔴/kotwica
   nierozwiązana = usunięcie powołania, nie "naprawa" innym pinpointem.
2. W3.2 KROK 1: kanał strukturalny (SYGNATURY.md FOUND/NOT_FOUND/AMBIGUOUS/
   OUT_OF_SCOPE) jako pierwszy wybór, web_search jako fallback.
3. W3.2 KROK 2: jawna weryfikacja DATY WYDANIA niezależnie od sygnatury i
   tezy — rozbieżność daty = traktuj jak NOT_FOUND dla tej pary (K-SYG-2).
4. W3.2 KROK 3a (ZAKRES-STOSOWANIA): dodano pytanie wprost o TĘ SAMĄ
   INSTYTUCJĘ PROCESOWĄ (nie tylko "ten sam przepis") — zmapowano status
   ZAKRES-OK/WARN-ZAKRES/ZAKAZ-ZAKRES na gradient 🟢/🟠/🔴 dla spójności
   z audit-bundle (bez duplikowania logiki — patrz shared/WERYFIKACJA-SLAD.md
   GRAD-3b).
5. W3.2 KROK 6 (nowy): zwroty "ugruntowana/utrwalona linia orzecznicza"
   wymagają uruchomienia Zasady 10 (BILANS) z `orzeczenia-sadowe-v2` przed
   W3.6a — twierdzenie o całej linii, nie o pojedynczym wyroku.
6. `shared/DISCLAIMER.md` v2.1: nowy WARIANT PISMO SĄDOWE — jawne
   przypomnienie o niedelegowalnym obowiązku pełnomocnika do samodzielnej
   weryfikacji przed podpisaniem, dołączane po wariancie PRAWNIK dla
   każdego projektu pisma.
7. `shared/WERYFIKACJA-SLAD.md` v1.2: GRAD-1 zamyka lukę "gołe powołanie
   na poparcie tezy = tylko ISTNIENIE" → teraz minimum TREŚĆ; nowy GRAD-3b
   (GUARD INSTYTUCJA/PRZEDMIOT) jako wersja ogólna dla skilli bez własnej
   kontroli zakresu.

Plik: `audyt-systemu-v4/references/AUDIT-JOURNAL.md` → AUDYT-2026-07-05b.
   ⛔ ZAKAZ-FSL-D: nie przystępuj do macierzy bez FSL-D-REPORT.
3. Trzy poziomy gwarancji (L1 strony → L2 tezy → L3 przepisy) kompletne.

**5.8 (2026-06-26) — NAPRAWA: format sądowy tabeli dowód×teza — zakaz symboli wewnętrznych**

Root cause: tabela D×T generowana z symbolami wewnętrznymi pipeline'u (●●●[K], ★★★, RK)
nieczytelna dla sędziego. Symbole te mają sens wyłącznie w kontekście MT1–MT5
(wewnętrzna klasyfikacja modelu), ale nie niosą żadnej wartości procesowej dla sądu.

Naprawa w KROK MT (W1.2c):
- Dodana klauzula ⛔ FORMAT SĄDOWY — ZAKAZ SYMBOLI
- Tabela w piśmie: wyłącznie kolumny Lp. | Dowód | Lokalizacja w aktach |
  Roszczenie | Na okoliczność
- Obowiązkowe: strona protokołu i godzina dla zeznań; numer załącznika dla dokumentów
- Symbole ●/★/[K]/[W]/RK — tylko do użytku wewnętrznego modelu, nie trafiają do pisma

---

## Wpisy przeniesione z korpusu SKILL.md (F-126, 2026-08-24)

> Tekst poniżej przeniesiony 1:1 z sekcji `## CHANGELOG` w `SKILL.md`.
> Nic nie przeredagowano ani nie odtworzono z pamięci — przeniesienie
> istniejącego tekstu, zgodnie z zakazem z wiersza flagi F-126.

> **5.15 (2026-07-25, naprawa systemowa F-13 — częściowa):** zarejestrowano
> `shared/ZAZALENIE-ADRESAT-GATE.md` jako HARD GATE (obok MOD-ADMIN.md w
> sekwencji W2). `modules/MOD-PRAWO.md`: dodano adresat dla art. 306 KPK
> (sąd rejonowy — wyjątek od reguły ogólnej). Dopiski `⚠️ adresat` dodane
> w trzech plikach `references/engines/` (admin-pleading-engine-v8.md,
> pleading-engine-v8.md, prosecution-complaint-engine-v8.md). Pełny opis
> zakresu i tego, co POZOSTAJE nienaprawione: audyt-systemu-v4/references/
> AUDIT-JOURNAL.md, wpis AUDYT-2026-07-25d.

> **5.14 (2026-07-25, audyt adresatów zażalenia/odwołania — CRIT-TREŚĆ):**
> `modules/MOD-ADMIN.md` — dodano wyjaśnienie, że odwołanie i zażalenie w KPA
> wnosi się **za pośrednictwem organu I instancji do organu wyższego stopnia**
> (art. 129 §1 / art. 141 §1 KPA), czego tabela pism wcześniej nie
> precyzowała. `shared/terminy.md` — dodano przypis rozróżniający zażalenie
> **dewolutywne/pionowe** (do sądu II instancji, art. 394 §1 KPC) od
> **poziomego** (do innego składu tego samego sądu, art. 394¹ᵃ/394² KPC) —
> wcześniej wiersz "Zażalenie (KPC)" sugerował jeden, uniwersalny adresat.
> Ten sam wzorzec braku wykryto i naprawiono równolegle w pisma-proste-v2
> (v2.4) i dr-01/mod-USP (v3.3). Pełny opis: audyt-systemu-v4/references/
> AUDIT-JOURNAL.md, wpis 2026-07-25.

> **5.13 (2026-07-15, F-7 / ZASADA 11 — audyt proceduralny):** dodano
> R.1b TEZA-GATE do `modules/MOD-REDAKCJA.md`, obowiązkowy przed KROK 2
> (diagnoza stylu) — rekonstrukcja jednym zdaniem tezy centralnej
> dostarczonego gotowego pisma, przed jakąkolwiek redakcją stylu/tonu.
> Przyczyna: ścieżka Test A (redakcja gotowego pisma) jawnie omija W1-W2-W3
> ("NIE wykonuj W1-W2-W3" — routing KROK 0), a MOD-REDAKCJA nie miała
> NIGDZIE (grep 0 wyników na "teza"/"rekonstrukcja"/"CLAIM") mechanizmu
> ustalenia, czego pismo faktycznie broni, zanim zaczęto poprawiać jego
> formę — ryzyko wzmacniania tonu twierdzeń bez uważnego czytania ich
> zasadności. Analogiczny wzorzec braku jak w przesluchanie-swiadkow-v2
> przed naprawą 3.6 (IMPORTED-QUESTIONS-GATE). Pozostałe 3 wzorce z
> ZASADY 11 były już dobrze pokryte w tym skillu (HARD GATE MRG/SD-GATE
> od startu, CG-GATE z jawną akceptacją, ST-INIT z jawnym zgłaszaniem
> pominięć) — nie wymagały zmian. Pełny opis: audyt-systemu-v4/
> AUDIT-JOURNAL.md, AUDYT-2026-07-15e.

> **5.12 (2026-07-14, sprawa XI P 27/26 — dziedziczenie naprawy SD-GATE-TRUNC):**
> Ten skill pobiera SD-REJ z `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` jako HARD
> GATE (patrz linia ~471, blok PRZED-MACIERZ). Naprawa wprowadzona w module
> współdzielonym (1.4.0 → 1.5.0: bramka SD-GATE-TRUNC — obowiązkowe domykanie
> znaczników `< truncated lines X-Y >` zwracanych przez `view` przed
> ekstrakcją faktów) jest dziedziczona automatycznie, bez zmian w logice tego
> pliku — zgodnie z zasadą unikania duplikacji (CHECKLIST-DEDUP). Wersja
> podbita wyłącznie dla odnotowania zależności. Pełny opis incydentu:
> `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-07-14b.

> Pełna historia napraw (5.7...5.11, każda z root cause i opisem naprawy)
> wyniesiona do `references/CHANGELOG.md` (redukcja kosztu kontekstu,
> 2026-07-12 runda 2) — treść zachowana w 100%, tylko przeniesiona:
> `view /mnt/skills/user/pisma-procesowe-v3/references/CHANGELOG.md`
>
> Najnowsza pozycja (kontekst do bieżącej pracy): **5.11 (2026-07-12)** —
> naprawiono 7 martwych odwołań do modułów ⛔ obowiązkowych w W2.2
> (MOD-BUDOWA-ARGUMENTU, MOD-ELIMINACJA-TEZ, MOD-KARTA-DOWODU,
> MOD-KOSZT-ODPOWIEDZI, MOD-MIKROPODSUMOWANIA, MOD-SKUTEK-PROCESOWY,
> MOD-STRESS-TEST — odzyskane do shared/), naprawiono nazwę pliku
> MOD-DOKUMENT-ANOMALIE_v1.1.0.md w MODULY-MAPA.md i AUTOMAT-STANOW.md,
> oraz wyniesiono tę sekcję CHANGELOG do osobnego pliku.
