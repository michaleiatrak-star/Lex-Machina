# mod-KRO-rodzinne

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Wersja:** 1.1.0 (2026-07-02) — dodano: trudności praktyczne w sprawach rozwodowych,
mediacja pozasądowa (art. 436/445² KPC), OZSS rozszerzone, świadkowie w sprawach
rozwodowych (wiarygodność + art. 233 KPC/KK) z pointerem do shared/MOD-ATAK-NA-SWIADKA.md

**Źródło weryfikacji:** KRO — Dz.U. 2026 poz. 236 t.j. | KPC — Dz.U. 2026 poz. 468 t.j.
**Data weryfikacji online:** 2026-07-02 (rozszerzenie); baza 2026-06-05
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
**ZASADA (świadkowie):** techniki ataku na wiarygodność świadka (SW-A1..SW-A8) i obrona
ante-cross (AC1-AC4) są KANONICZNE w `shared/MOD-ATAK-NA-SWIADKA.md` — ten moduł
NIE duplikuje tych technik, tylko dodaje specyfikę dziedzinową spraw rozwodowych
(krąg świadków rodzinnych, OZSS, art. 233 KPC/KK w kontekście KRO).

---

## ⚡ ALERT LEGISLACYJNY

**Dz.U. 2025 poz. 897 (wejście w życie: 08.10.2025) — zmiana art. 59 KRO:**
- Termin na powrót do nazwiska po rozwodzie: **było 3 miesiące → jest 12 miesięcy** od uprawomocnienia wyroku
- Przepis przejściowy: jeśli 3-miesięczny termin nie upłynął przed 08.10.2025 → automatycznie wydłużony do 1 roku

**Projekt zniesienia orzekania o winie (Komisja Kodyfikacyjna, 2025):**
- STATUS na 2026-06-05: **wyłącznie projekt — NIE uchwalony, NIE podpisany.**
- Orzekanie o winie wciąż obowiązuje (art. 57 KRO, Dz.U. 2026 poz. 236).

---

## FAZA 0 — INTAKE

```
□ Jaki problem: rozwód / separacja / alimenty / władza rodzicielska /
  kontakty / podział majątku / ubezwłasnowolnienie / ustalenie ojcostwa?
□ Czy są małoletnie dzieci? → kluczowe dla sądu i trybu
□ Jaka właściwość sądu? (SO / SR — zależy od rodzaju sprawy)
□ Czy strony mają wspólny majątek do podziału?
□ Ostatnie wspólne miejsce zamieszkania (właściwość SO w rozwodzie)?
□ Czy zachodzą przesłanki do zabezpieczenia (alimenty, kontakty)?
□ Czy istnieją widoki na ugodowe załatwienie sprawy → rozważ mediację
  (art. 436 §1 KPC, zob. sekcję MEDIACJA) — zwłaszcza PRZED eskalacją sporu
□ Czy przemoc domowa w relacji? → JEŚLI TAK: mediacja PRZECIWWSKAZANA
□ Czy planowane powołanie świadków rodzinnych/bliskich? → zaplanuj profil
  wiarygodności z wyprzedzeniem (zob. sekcję ŚWIADKOWIE + shared/MOD-ATAK-
  NA-SWIADKA.md)
```

---

## TRYBY POSTĘPOWANIA — KWALIFIKATOR

> ⚠️ Błędny tryb = odrzucenie pisma bez merytorycznego rozpoznania.

| Sprawa | Tryb | Właściwy sąd |
|---|---|---|
| Rozwód / separacja | Procesowy | Sąd **Okręgowy** (ostatnie wspólne miejsce zamieszkania) |
| Alimenty (pierwotne) | Procesowy | Sąd **Rejonowy** (miejsce zamieszkania pozwanego LUB uprawnionego — wybór powoda) |
| Ustalenie ojcostwa | Procesowy | Sąd Rejonowy |
| Zaprzeczenie ojcostwa | Procesowy | Sąd Rejonowy |
| Władza rodzicielska | Nieprocesowy | Sąd Rejonowy — sąd opiekuńczy |
| Kontakty z dzieckiem | Nieprocesowy | Sąd Rejonowy — sąd opiekuńczy |
| Podział majątku | Nieprocesowy | Sąd Rejonowy (właściwy wg miejsca położenia majątku) |
| Ubezwłasnowolnienie | Nieprocesowy | Sąd **Okręgowy** |
| Adopcja | Nieprocesowy | Sąd Rejonowy — sąd opiekuńczy |

**Zasada nadrzędna: dobro dziecka** — art. 56 §2, art. 95 KRO.

---

## ROZWÓD — QUICK CHECK

### Przesłanki (art. 56 KRO — weryfikuj w ISAP)
```
POZYTYWNA: Trwały i zupełny rozkład pożycia małżeńskiego
  (brak więzi uczuciowej, fizycznej i gospodarczej)

NEGATYWNE (stoi na przeszkodzie):
  □ Wskutek rozwodu ucierpi dobro małoletnich dzieci
  □ Żąda rozwodu małżonek wyłącznie winny (zasada clean hands) —
    chyba że drugi małżonek wyraził zgodę LUB odmowa jest sprzeczna z ZWS
```

### Orzekanie o winie
```
Domyślnie: sąd orzeka o winie (z urzędu)
Na zgodny wniosek: sąd zaniecha orzekania o winie
  → brak orzeczenia o winie = traktowani jak oboje bez winy

Skutki orzeczenia o winie:
  → wyłącznie winny NIE ma prawa do alimentów od drugiego małżonka
  → niewinny może żądać alimentów niezależnie od pogorszenia sytuacji majątkowej
    (art. 60 §2 KRO — weryfikuj w ISAP)
```

---

## NAJWIĘKSZE TRUDNOŚCI PRAKTYCZNE — PERSPEKTYWA EKSPERCKA

> Źródło: synteza praktyki procesowej i orzecznictwa (weryfikacja online 2026-07-02).
> Wykorzystaj przy KROK 0 (INTAKE) do wczesnej identyfikacji ryzyk sprawy.

```
T1 — TRWAŁOŚĆ ROZKŁADU PRZY OKRESOWYM POJEDNANIU:
  Ryzyko: strony formalnie mieszkają razem / okresowo się godzą → sąd może
  zakwestionować trwałość. Zaradczo: dokumentuj chronologię rozstań/powrotów
  (→ chronologia-sprawy-v1), akcentuj brak wszystkich 3 więzi na dzień zamknięcia
  rozprawy, nie tylko na dzień złożenia pozwu.

T2 — WINA ROZKŁADU POŻYCIA:
  Ryzyko: eskalacja konfliktu, wydłużenie postępowania (szerokie postępowanie
  dowodowe: świadkowie, korespondencja, nagrania), koszt psychologiczny stron.
  Zaradczo: rozważ z klientem realny bilans zysk/strata orzeczenia o winie
  (skutek: art. 60 §2 KRO) vs. czas/koszt/eskalacja. SN: obowiązek wszechstronnego
  wyjaśnienia przyczyn rozkładu niezależnie od stanowiska stron co do winy
  (uchwała SN z 18.03.1968 r., III CZP 70/66 — weryfikuj sn.pl) — nawet zgodny
  wniosek bez orzekania o winie NIE zwalnia sądu z tego obowiązku dowodowego.

T3 — DOBRO MAŁOLETNICH DZIECI / OPINIA OZSS:
  Zob. sekcję "OPINIA OZSS — ROZSZERZONE" poniżej. Główne ryzyko: opinia trudna
  do skutecznego zakwestionowania (wymaga wykazania wad metodologicznych, nie
  tylko polemiki) + długi czas oczekiwania wydłużający całe postępowanie.

T4 — MAJĄTEK I ALIMENTY:
  Ryzyko: ukrywanie dochodów/majątku (działalność gospodarcza, praca nieformalna).
  Zaradczo: wniosek o wyjawienie majątku (art. 913 KPC — weryfikuj ISAP),
  dowód z dokumentów ZUS/US, świadkowie na okoliczność stylu życia.

T5 — CZYNNIK EMOCJONALNY / ESKALACJA:
  Ryzyko: instrumentalne wykorzystywanie dzieci (konflikt lojalności, ryzyko
  alienacji rodzicielskiej), nadmiar wniosków dowodowych "na wszelki wypadek"
  (w tym nadmiar świadków — osłabia wiarygodność całej strategii, zob. sekcję
  ŚWIADKOWIE poniżej), angażowanie osób trzecich jako świadków.
  Zaradczo: wczesna propozycja mediacji (zob. sekcję MEDIACJA poniżej) — zanim
  konflikt się utrwali.

T6 — PRZEWLEKŁOŚĆ I KOSZTY:
  Opłata od pozwu 600 zł (zwrot 300 zł przy zgodnym wniosku bez orzekania
  o winie — weryfikuj KSCU Dz.U. 2025 poz. 1228). Sprawy z orzekaniem o winie
  i z udziałem OZSS trwają zauważalnie dłużej. Zaradczo: wniosek o zabezpieczenie
  (art. 753 KPC) na czas trwania postępowania.

T7 — ZMIANA SYSTEMOWA OD 2027 R. (MONITORING):
  ⏳ Od 1 stycznia 2027 r. planowana możliwość rozwiązania małżeństwa przez
  oświadczenie przed kierownikiem USC (rozwód rejestrowy) — WYŁĄCZNIE dla
  małżonków BEZ wspólnych małoletnich dzieci. W 2026 r. NIE obowiązuje —
  wyłącznie postępowanie przed sądem okręgowym. ⚠️ Status projektu/aktu
  i dokładna data wejścia w życie WYMAGAJĄ odrębnej weryfikacji w ISAP przed
  każdym użyciem tej informacji w piśmie lub poradzie (informacja o horyzoncie
  >90 dni — kandydat do wpisu w mapa_dzu MONITORING, patrz audyt-systemu-v4).
```

---

## ALIMENTY — QUICK CHECK

### Przesłanki (art. 128, 133 KRO — weryfikuj w ISAP)
```
Na dziecko:    obowiązek rodziców do ukończenia samodzielności przez dziecko
               → brak górnej granicy wiekowej, liczy się zdolność do utrzymania
Na małżonka:   po rozwodzie — zależne od winy i sytuacji majątkowej
               termin przedawnienia alimentów: 3 lata
```

### Zmiana / uchylenie (art. 138 KRO)
```
Zmiana stosunków → można żądać zmiany orzeczenia o alimentach
  Wzrost potrzeb uprawnionego → podwyższenie
  Poprawa sytuacji zobowiązanego → podwyższenie
  Pogorszenie sytuacji zobowiązanego → obniżenie
  Usamodzielnienie uprawnionego → uchylenie
```

---

## PODZIAŁ MAJĄTKU WSPÓLNEGO — QUICK CHECK

```
Domyślna wspólność majątkowa: od zawarcia małżeństwa
Ustanie: z chwilą uprawomocnienia wyroku rozwodowego (lub separacji, lub umowy)

Skład majątku wspólnego:
  + pobrane wynagrodzenia za pracę
  + dochody z majątku wspólnego i osobistego
  + inne nabyte w trakcie małżeństwa

Majątek osobisty (art. 33 KRO — weryfikuj w ISAP):
  + nabyty przed małżeństwem
  + darowizny i spadki (jeśli darczyńca/spadkodawca nie postanowił inaczej)
  + prawa niezbywalne

Termin na podział: brak — można żądać w każdym czasie po ustaniu wspólności
  ⚠️ Nieruchomości → podział w formie aktu notarialnego lub przez sąd
```

---

## WŁADZA RODZICIELSKA I KONTAKTY

```
Zasada: oboje rodzice mają pełną władzę rodzicielską
Sąd może ją ograniczyć / zawiesić / pozbawić (art. 107, 110, 111 KRO)
  → tylko gdy dobro dziecka tego wymaga

Kontakty (art. 113 i n. KRO — weryfikuj w ISAP):
  → prawo i obowiązek niezależnie od władzy rodzicielskiej
  → sąd może uregulować, ograniczyć lub zakazać kontaktów
  → wykonanie kontaktów: wniosek do sądu opiekuńczego
  → sankcja za utrudnianie kontaktów: zagrożenie zapłatą sumy pieniężnej
```

---

## MEDIACJA W SPRAWACH ROZWODOWYCH — QUICK CHECK

> Podstawa prawna zweryfikowana online 2026-07-02: art. 436, 445² KPC (Dz.U. 2026
> poz. 468 t.j.) w zw. z przepisami ogólnymi o mediacji art. 183¹–183¹⁵ KPC.
> ⚠️ Przed powołaniem w piśmie — zweryfikuj aktualne brzmienie w ISAP.

```
PODSTAWA (weryfikuj ISAP przed cytowaniem):
  art. 436 §1 KPC  — sąd MOŻE skierować strony do mediacji, jeżeli istnieją
                     widoki na utrzymanie małżeństwa (możliwe też przy
                     zawieszonym postępowaniu). NIE jest obligatoryjne.
  art. 436 §2 KPC  — odpowiednie stosowanie przepisów ogólnych o mediacji;
                     przedmiotem może być również POJEDNANIE małżonków.
  art. 436 §4 KPC  — brak zgody stron co do mediatora → sąd kieruje do
                     stałego mediatora rodzinnego (psychologia/pedagogika/
                     socjologia/prawo).
  art. 445² KPC    — zakres przedmiotowy: potrzeby rodziny, alimenty,
                     władza rodzicielska, kontakty, kwestie majątkowe
                     podlegające rozstrzygnięciu w wyroku rozwodowym.
  art. 1833–1834 KPC — bezstronność mediatora + NIEJAWNOŚĆ (poufność)
                     postępowania mediacyjnego.
  art. 1838 §2 KPC — brak zgody strony w terminie 7 dni od doręczenia
                     postanowienia → mediacji się nie prowadzi (dobrowolność).

PRZEBIEG:
  □ Skierowanie: na każdym etapie — z urzędu lub na wniosek — do zamknięcia
    1. posiedzenia na rozprawę; za zgodnym wnioskiem stron także później.
  □ Czas trwania: ≤3 miesiące (przedłużalny na zgodny wniosek); NIE wlicza się
    do czasu trwania postępowania sądowego.
  □ Protokół + ewentualna ugoda → sąd zatwierdza, chyba że sprzeczna z prawem/
    ZWS/obejściem prawa/niezrozumiała.
  □ Propozycje ugodowe z mediacji NIE mogą być dowodem w dalszym postępowaniu.
  □ Mediator NIE może być świadkiem co do faktów z mediacji (chyba że strony
    zwolnią go z poufności).

KIEDY REKOMENDOWAĆ (zaleta praktyczna):
  + własne, dopasowane rozwiązania (np. plan opieki) zamiast rozstrzygnięcia
    narzuconego przez sąd
  + obniżenie eskalacji konfliktu → lepsze relacje rodzicielskie po rozwodzie
  + skrócenie czasu trwania sporu w zakresie kwestii ugodowych + niższe koszty
  + poufność chroni szczerość negocjacji

KIEDY ODRADZAĆ (ograniczenie):
  ⛔ przemoc domowa w relacji / wyraźna dysproporcja sił między stronami
    (ryzyko akceptacji niekorzystnych warunków pod presją)
  ⛔ mediacja NIE rozstrzyga winy rozkładu pożycia — to wyłącznie sąd w wyroku
  ⛔ skuteczność maleje po eskalacji sporu (silna narracja "walki",
    zaangażowanie licznych świadków po obu stronach) — proponuj wcześnie

WNIOSEK PROCESOWY (wzór do pisma — weryfikuj art. w ISAP przed użyciem):
  "Wnoszę o skierowanie stron do mediacji na podstawie art. 436 §1 k.p.c.
   celem [pojednania małżonków / uregulowania kwestii władzy rodzicielskiej,
   kontaktów i spraw majątkowych — art. 445² k.p.c.], wskazując, że istnieją
   widoki na utrzymanie małżeństwa / na ugodowe uregulowanie spornych kwestii."
```

---

## OPINIA OZSS — ROZSZERZONE

> Podstawa: ustawa z dnia 5 sierpnia 2015 r. o opiniodawczych zespołach sądowych
> specjalistów — t.j. Dz.U. z 2018 r. poz. 708 ze zm. ⚠️ [NIEWERYFIKOWANE — data
> ostatniego t.j. wymaga potwierdzenia w ISAP przed cytowaniem w piśmie].
> OZSS zastąpiły dawne Rodzinne Ośrodki Diagnostyczno-Konsultacyjne (RODK) od
> 1.01.2016. Standardy metodologii opiniowania: zarządzenie MS z 1.02.2016 r.
> (weryfikuj aktualność w ISAP).

```
KIEDY SĄD KIERUJE:
  Brak porozumienia rodziców co do władzy rodzicielskiej, miejsca zamieszkania
  dziecka lub kontaktów; podejrzenie zagrożenia dobra dziecka (zaniedbanie,
  przemoc, alienacja rodzicielska). Podstawa dowodowa: art. 290¹ KPC
  (opinia OZSS w sprawach rodzinnych i opiekuńczych — weryfikuj ISAP).

SKŁAD: psycholog, pedagog, niekiedy pediatra/psychiatra — co najmniej
  2 specjalistów na opinię.

ZAKRES: ściśle wyznaczony postanowieniem sądu (tezy dowodowe) — OZSS NIE może
  wykraczać poza pytania sądu. Strony mogą wnosić o rozszerzenie zakresu pytań.

PRZYGOTOWANIE KLIENTA (checklist):
  □ Analiza akt sprawy i dotychczasowego przebiegu postępowania
  □ Dokumentacja szkolna/medyczna dziecka świadcząca o więzi z klientem
  □ Spójna, autentyczna narracja o kontaktach i planach opiekuńczych
    (⚠️ sztuczność/negatywne nastawienie do drugiego rodzica jest łatwo
    rozpoznawalne przez specjalistów i działa na niekorzyść)
  □ Badanie trwa zwykle 3-8 godzin; możliwa odmowa udziału (wtedy opinia
    na podstawie dostępnego materiału)

KWESTIONOWANIE OPINII (trudne, ale możliwe):
  □ Zastrzeżenia formalne: wykroczenie poza tezę dowodową, brak wymaganej
    liczby specjalistów, wady metodologii badania
  □ Wniosek o wezwanie biegłych OZSS na rozprawę celem zadania pytań
  □ Wniosek o opinię uzupełniającą lub opinię innego zespołu (uzasadnienie:
    stronniczość, nierówne traktowanie badanych — wymaga konkretnych
    okoliczności, NIE tylko niekorzystnego wyniku)
  ⚠️ Sama polemika z wnioskami opinii bez wykazania wad metodologicznych
    jest z reguły nieskuteczna — analogicznie do standardu z art. 233 §1 KPC
    (zob. sekcję ŚWIADKOWIE poniżej).
```

---

## WERYFIKACJA ONLINE

```
web_search: "KRO Kodeks rodzinny opiekuńczy isap.sejm.gov.pl Dz.U. 2026 poz. 236"
web_search: "rozwód przesłanki wina orzecznictwo SN sn.pl"
web_search: "alimenty zmiana stosunków art 138 KRO orzecznictwo"
web_search: "podział majątku wspólnego art 31 KRO składniki orzecznictwo SN"
web_search: "mediacja rozwodowa art 436 445(2) KPC isap.sejm.gov.pl"
web_search: "ustawa o opiniodawczych zespołach sądowych specjalistów tekst jednolity isap"
web_search: "art 233 KPC ocena wiarygodności świadka orzecznictwo SN"
web_search: "art 233 KK fałszywe zeznania orzecznictwo"
web_search: "rozwód rejestrowy USC 2027 status projektu ustawy"
```

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Pismo: pozew o rozwód, o alimenty | `pisma-procesowe-v3` |
| Orzecznictwo SN rodzinne | `orzeczenia-sadowe-v2` |
| Analiza szans w sądzie | `analiza-sadowa-v6` |
| Analiza dokumentów majątkowych | `analizator-dowodow-v3` |
| Chronologia zdarzeń (np. rozkład pożycia) | `chronologia-sprawy-v1` |
| Techniki ataku na wiarygodność świadka (SW-A1..SW-A8) + obrona ante-cross (AC1-AC4) — KANONICZNE | `shared/MOD-ATAK-NA-SWIADKA.md` |
| Przygotowanie pytań / cross-examination świadka | `przesluchanie-swiadkow-v2-min90` |
| Ustalenie kręgu dziedzin sprawy mieszanej (np. rozwód + wątek karny gróźb) | `analizator-dowodow-v3` (MX: 25 dziedzin) |

---

## ŹRÓDŁA ONLINE

- KRO: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000236
- SN (orzeczenia cywilne): https://www.sn.pl
- Orzeczenia sądów powszechnych: https://orzeczenia.ms.gov.pl

---

## ZAPRZECZENIE OJCOSTWA — TERMINY ZAWITE

> ⚠️ Weryfikuj aktualne brzmienie art. 63–70 KRO (Dz.U. 2026 poz. 236) w ISAP.

```
Domniemanie ojcostwa (art. 62 KRO):
  Mąż matki = domniemany ojciec gdy dziecko urodziło się w czasie trwania małżeństwa
  LUB przed upływem 300 dni od ustania/unieważnienia/separacji

TERMINY NA ZAPRZECZENIE:
  Mąż matki (art. 63 KRO — po nowelizacji Dz.U.2019.2089):
    → 1 ROK od dowiedzenia się, że dziecko od niego NIE POCHODZI
    → NIE od daty urodzenia dziecka (zmiana od 30.11.2019!)
    → Nie później niż do pełnoletności dziecka
    → ⚠️ TK zakwestionował ograniczenie datą pełnoletności — weryfikuj status

  Matka (art. 69 KRO): 6 miesięcy od urodzenia dziecka lub dowiedzenia się
  Dziecko (art. 70 KRO): 3 lata od osiągnięcia pełnoletności
  Prokurator (art. 86 KRO): brak terminu zawitego
```

---

## OPŁATY SĄDOWE

> ⚠️ Weryfikuj aktualne opłaty w KSCU (Dz.U. 2025 poz. 1228) w ISAP.

```
Pozew o rozwód: 600 zł
  → Zwrot 300 zł przy orzeczeniu bez orzekania o winie (na zgodny wniosek)
  → Zwrot 600 zł przy cofnięciu pozwu przed doręczeniem odpisu pozwanemu

Podział majątku:
  Sporny: 1 000 zł
  Zgodny projekt: 300 zł
```

---

## ALIMENTY — NIUANSE (art. 135 §3 KRO)

```
Na zakres alimentów NIE wpływają (nie zaliczają się):
  □ Świadczenia z pomocy społecznej / funduszu alimentacyjnego
  □ Wydatki na pieczę zastępczą
  □ Świadczenie wychowawcze (800+) — irrelewantne dla alimentów!
  □ Świadczenia rodzinne (zasiłek rodzinny)
  □ Rodzicielskie świadczenie uzupełniające (mama 4+ / tata 4+)
⚠️ Weryfikuj aktualne brzmienie art. 135 §3 KRO w ISAP.
```

---

## KALKULATOR KLUCZOWYCH TERMINÓW KRO

| Czynność | Termin | Podstawa |
|---|---|---|
| Zaprzeczenie ojcostwa (mąż) | 1 rok od dowiedzenia się | art. 63 KRO (po nowelizacji 2019) |
| Zaprzeczenie ojcostwa (matka) | 6 miesięcy | art. 69 KRO |
| Zaprzeczenie ojcostwa (dziecko) | 3 lata od pełnoletności | art. 70 KRO |
| Powrót do nazwiska po rozwodzie | **12 miesięcy** od uprawomocnienia | art. 59 KRO (zm. od 08.10.2025) |
| Wygaśnięcie alimentów między małżonkami | 5 lat (gdy zobowiązany nie był wyłącznie winny) | art. 60 §3 KRO |
| Zabezpieczenie alimentów | złóż z pismem głównym | art. 753 KPC |


---

## ŚWIADKOWIE W SPRAWACH ROZWODOWYCH — WIARYGODNOŚĆ I ART. 233 KPC/KK

> ⛔ POINTER OBOWIĄZKOWY: techniki podważania/obrony wiarygodności świadka
> (SW-A1..SW-A8, profil SW-P1..SW-P5, priorytetyzacja SW-PRIOR, wnioski
> procesowe SW-W1..SW-W4, obrona ante-cross AC1-AC4) są KANONICZNE w
> `shared/MOD-ATAK-NA-SWIADKA.md` — wywołaj ten moduł PRZED sporządzeniem
> pisma zawierającego ocenę zeznań świadka. Poniżej WYŁĄCZNIE specyfika
> dziedzinowa spraw rozwodowych, nieduplikująca modułu kanonicznego.

```
S1 — SPECYFIKA KRĘGU ŚWIADKÓW W SPRAWACH ROZWODOWYCH:
  W odróżnieniu od typowych spraw cywilnych, świadkowie to najczęściej osoby
  bliskie stronom (rodzice, rodzeństwo, przyjaciele, sąsiedzi, nowi partnerzy).
  → Podwyższone ryzyko SW-A1 (konflikt interesu/stronniczość) z MOD-ATAK-NA-
    SWIADKA — traktuj jako STRUKTURALNE, nie wyjątkowe, przy każdym świadku
    powołanym przez stronę na okoliczność winy rozkładu pożycia.
  → Podwyższone ryzyko SW-A3 (źródło wtórne) — świadkowie rodzinni często
    znają przebieg zdarzeń wyłącznie z relacji strony, która ich powołała.
  → Sygnał ostrzegawczy: nadmierna spójność / "wyuczony" charakter relacji
    kilku świadków powołanych przez tę samą stronę — wskazuje na możliwe
    przygotowanie świadków; wykorzystaj przy SW-P4/SW-P5 (sprzeczności) jako
    element budowania wniosku o konfrontację (SW-W1).

S2 — ART. 233 §1 KPC (SWOBODNA OCENA DOWODÓW) — STANDARD ZASKARŻENIA:
  Ocena wiarygodności zeznań należy WYŁĄCZNIE do sądu. Skuteczny zarzut
  wymaga wykazania oceny "rażąco wadliwej lub oczywiście błędnej" — NIE
  wystarczy przedstawić odmienną, korzystną dla strony wersję zdarzeń.
  Formuła zarzutu (do apelacji/pisma):
    1) wskaż KONKRETNY dowód uznany za wiarygodny/niewiarygodny,
    2) wykaż BRAK logicznego powiązania między dowodem a ustaleniem sądu
       LUB sprzeczność z zasadami doświadczenia życiowego,
    3) wskaż przepis procesowy naruszony przy dokonywaniu ustaleń.
  ⚠️ Sama polemika = zarzut nieskuteczny (linia orzecznicza jednolita —
  weryfikuj aktualne orzecznictwo przez orzeczenia-sadowe-v2 przed pismem).

S3 — ART. 233 KK (FAŁSZYWE ZEZNANIA) — GRANICE ODPOWIEDZIALNOŚCI:
  Kara: pozbawienie wolności od 6 miesięcy do 8 lat — WYMAGA winy umyślnej
  i prawidłowego pouczenia (art. 233 §1 KK w zw. z art. 266 §1 KPC — weryfikuj
  ISAP). Świadek mylący się w dobrej wierze NIE popełnia przestępstwa.
  "Nie pamiętam" jest dopuszczalne, jeśli prawdziwe. Bezpodstawna ODMOWA
  zeznań ≠ "zatajenie prawdy" w rozumieniu art. 233 §1 KK (uchwała SN
  z 22.01.2003 r., I KZP 39/02 — weryfikuj sn.pl).
  ⚠️ WSKAZÓWKA STRATEGICZNA: zawiadomienie o podejrzeniu popełnienia
  przestępstwa z art. 233 KK bywa procesowo SŁABSZE niż metodyczne
  podważenie wiarygodności zeznania w toku samej sprawy rozwodowej
  (S2 + shared/MOD-ATAK-NA-SWIADKA.md) — wysoki próg dowodowy (umyślność)
  + ryzyko dalszej eskalacji konfliktu. Rozważ z klientem oba warianty.

S4 — INTEGRACJA Z FAZĄ 0 (SW-DETECT) shared/MOD-ATAK-NA-SWIADKA.md:
  Trigger dodatkowy specyficzny dla DR-02: KAŻDY świadek powoływany na
  okoliczność WINY rozkładu pożycia LUB kompetencji rodzicielskich →
  automatycznie AKTYWNY SW-DETECT, niezależnie od ogólnych triggerów modułu.
```

---

## QUALITY GATE

- [ ] Aktualny tekst t.j. aktu zweryfikowany w ISAP?
- [ ] Stan prawny właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Każda przesłanka ma przypisany dowód?
- [ ] Termin nie upłynął?
- [ ] Właściwy organ / sąd wskazany?
- [ ] Ryzyka formalne i dowodowe ocenione?
- [ ] Brzmienie przepisów pobrane ze źródeł, nie z pamięci modelu?

## OUTPUT

Wynik pracy modułu:
1. Stan faktyczny;
2. Stan prawny i źródła (Dz.U. z ISAP);
3. Kwalifikacja trybu i właściwość;
4. Terminy (obliczone, z datami granicznymi);
5. Przesłanki (spełnione / wątpliwe / niespełnione);
6. Matryca dowodowa (teza → dowód → siła → luka);
7. Zarzuty i kontrargumenty;
8. Analiza ryzyk;
9. Strategia (wariant podstawowy + ewentualny);
10. Rekomendacja + kolejne kroki;
11. Kontrola ISAP/temporalności.

---

## STRATEGIA

### Perspektywa powoda (strony inicjującej)

1. Ustal tryb postępowania (procesowy vs nieprocesowy) — błąd trybu = odrzucenie pisma.
2. Złóż wniosek o zabezpieczenie alimentów RAZEM z pozwem o rozwód / alimenty (sąd może orzec przed wysłuchaniem pozwanego — art. 753 KPC).
3. Jeśli jest kwestia winy w rozkładzie pożycia — zgromadź dowody przed złożeniem pozwu (wiadomości, zeznania świadków, nagrania).
4. W sprawach o kontakty / władzę rodzicielską: postaw dobro dziecka jako oś argumentacji (art. 56 §2, art. 95 KRO).

### Perspektywa pozwanego

1. Zakwestionuj trwałość rozkładu pożycia jeśli możliwe.
2. Wniosek o zaniechanie orzekania o winie (jeśli obu stronom zależy na szybkim rozwodzie bez kosztów).
3. Zgłoś wniosek o OZSS (Opiniodawczy Zespół Specjalistów Sądowych) jeśli sporna jest kwestia władzy rodzicielskiej lub kontaktów — zob. sekcję "OPINIA OZSS — ROZSZERZONE".
4. Rozważ wniosek o skierowanie do mediacji (art. 436 §1 KPC) — zwłaszcza gdy spór dotyczy głównie kwestii majątkowych/opiekuńczych, a nie samego faktu rozstania — zob. sekcję "MEDIACJA W SPRAWACH ROZWODOWYCH".
5. Przy świadkach strony przeciwnej: wywołaj `shared/MOD-ATAK-NA-SWIADKA.md` (SW-DETECT → profil → wektory ataku) i sekcję "ŚWIADKOWIE W SPRAWACH ROZWODOWYCH" tego modułu dla specyfiki dziedzinowej.

### Kontrargumenty / ryzyka

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Brak dowodów winy | Twierdzenia nieudowodnione | Dokumenty, świadkowie, e-maile, nagrania |
| Negatywna opinia OZSS | Biegły niekorzystny dla strony | Wniosek o uzupełnienie / inny biegły — zob. "OPINIA OZSS — ROZSZERZONE" |
| Przewlekłość | Sprawy rodzinne trwają długo | Wniosek o zabezpieczenie na czas trwania (art. 753 KPC); rozważ mediację dla kwestii ugodowych |
| Ukrycie majątku przez dru. stronę | Zaniżenie majątku wspólnego | Wniosek o wyjawienie majątku (art. 913 KPC) |
| Upływ terminu na zaprzeczenie ojcostwa | Termin zawity — niemożność przywrócenia | Prokurator (art. 86 KRO) jako ścieżka pomocnicza |
| Stronniczy/niewiarygodny świadek strony przeciwnej | Świadek rodzinny/bliski, wiedza "ze słyszenia" | `shared/MOD-ATAK-NA-SWIADKA.md` (SW-A1/SW-A3) + sekcja ŚWIADKOWIE (S1-S4) tego modułu; formuła zarzutu wg art. 233 §1 KPC (S2) |
| Podejrzenie fałszywych zeznań świadka | Zeznanie sprzeczne z dowodami | Rozważ S3 — metodyczne podważenie wiarygodności (S2) często skuteczniejsze procesowo niż zawiadomienie z art. 233 KK |
| Eskalacja konfliktu utrudnia porozumienie ws. dzieci | Wysoki poziom emocji, alienacja rodzicielska | Wczesny wniosek o mediację (art. 436 §1 KPC) — zob. T5 i sekcję MEDIACJA |
