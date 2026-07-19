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
  ⚠️ UBEZWŁASNOWOLNIENIE (naprawa 2026-07-15 — wcześniej tylko wzmianka
  bez treści): pełna procedura (KC art. 12-16, przesłanki całkowite/
  częściowe, KPC, kurator, PROJEKT LIKWIDACJI z 4 nowymi instrumentami
  wspieranego podejmowania decyzji — status: skierowany do Sejmu) →
  view /mnt/skills/user/shared/mod-niepelnosprawnosc-intelektualna-gluchota.md
  sekcja "BLOK I — NIEPEŁNOSPRAWNOŚĆ INTELEKTUALNA" / I.3 — NIE zatrzymuj
  się na tej checkliście, ta treść żyje w module współdzielonym.
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

T7 — PRÓBA ZMIANY SYSTEMOWEJ — ZAWETOWANA (VER 2026-07-13, TRYB DZU):
  ❌ Projekt rozwodu rejestrowego (rozwiązanie małżeństwa przez oświadczenie
  przed kierownikiem USC, wyłącznie dla małżonków BEZ wspólnych małoletnich
  dzieci) NIE wejdzie w życie w tym kształcie: Sejm uchwalił ustawę 13.03.2026,
  Senat poparł 8.04.2026 (60:32), ale Prezydent RP Karol Nawrocki ZAWETOWAŁ ją
  30.04.2026 — ustawa nie została opublikowana w Dz.U. Postępowanie rozwodowe
  w 2026 r. i nadal WYŁĄCZNIE przed sądem okręgowym, KRO t.j. 2026.236 bez
  zmian w tym zakresie. ⚠️ Jeśli w przyszłości pojawi się nowy/podobny projekt
  (np. po ew. ponownym uchwaleniu przez Sejm większością odrzucającą weto, lub
  nowa inicjatywa), status WYMAGA odrębnej weryfikacji w ISAP przed użyciem —
  nie zakładać automatycznie powrotu tego samego kształtu projektu.
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

## ⭐ EKSMISJA MAŁŻONKA ZE WSPÓLNEGO MIESZKANIA (art. 58 §2-4 KRO) — dodane 2026-07-19

```
ZASADA: rozwód SAM W SOBIE NIE eksmituje drugiej strony — sąd DĄŻY do
tego, by NIKOGO nie eksmitować. DOMYŚLNIE sąd orzeka wyłącznie o
SPOSOBIE KORZYSTANIA ze wspólnego mieszkania (art. 58 §2 zd. 1).

PRZESŁANKA EKSMISJI (art. 58 §2 zd. 2, wąska/wyjątkowa):
  □ NA ŻĄDANIE jednej ze stron (NIGDY z urzędu)
  □ W WYPADKACH WYJĄTKOWYCH
  □ Gdy JEDEN z małżonków SWOIM RAŻĄCO NAGANNYM POSTĘPOWANIEM
    UNIEMOŻLIWIA wspólne zamieszkiwanie

⭐ ZAKRES (SN, wyrok II CKN 670/2000): przepis obejmuje WSZYSTKIE
przypadki takiego zachowania i NIE UZALEŻNIA eksmisji od TYTUŁU
PRAWNEGO do lokalu — można eksmitować NAWET współwłaściciela mieszkania.

DOWODY KLUCZOWE: Niebieska Karta, notatki policyjne, zeznania świadków
— BEZ tego sąd zwykle uznaje sprawę za "słowo przeciwko słowu" i oddala
wniosek.

DWIE ŚCIEŻKI:
  WOLNA — eksmisja W WYROKU ROZWODOWYM — trwa tyle co cały proces
  SZYBKA — zabezpieczenie w toku sprawy LUB ustawa antyprzemocowa
    (Policja/ŻW może wydać natychmiastowy nakaz opuszczenia + zakaz
    zbliżania się na 14 dni, przy zagrożeniu życia/zdrowia)

SKUTEK przy WSPÓŁWŁASNOŚCI lokalu: eksmisja NIE POZBAWIA wyeksmitowanego
tytułu prawnego (nadal współwłaściciel) — dotyczy WYŁĄCZNIE fizycznego
korzystania, nie własności.

⚠️ ZASTRZEŻENIE ORZECZNICZE (SN I CSK 190/06; uchwała III CZP 73/08):
eksmisja PO rozwodzie NIE POWINNA zastępować rozstrzygnięcia z
ODRĘBNEGO postępowania o PODZIAŁ MAJĄTKU — inaczej grozi niespójność
orzeczeń.

ALTERNATYWA: na zgodny wniosek stron, sąd może zamiast eksmisji orzec o
FIZYCZNYM PODZIALE mieszkania lub przyznaniu go jednemu małżonkowi
(gdy drugi zgadza się je opuścić bez lokalu zamiennego).
```

---

## ⭐ OBOWIĄZEK ALIMENTACYJNY SZERSZEGO KRĘGU KREWNYCH (art. 128-144¹ KRO) — dodane 2026-07-19

```
KRĄG ZOBOWIĄZANYCH (art. 128 KRO) NIE OGRANICZA SIĘ do rodziców i dzieci
— obejmuje KREWNYCH W LINII PROSTEJ (dziadkowie ↔ wnuki, w obie strony)
ORAZ RODZEŃSTWO.

ZASADA POMOCNICZOŚCI: obowiązek DALSZYCH krewnych (np. dziadków)
AKTUALIZUJE SIĘ dopiero, gdy BLIŻSI krewni (rodzice) NIE ISTNIEJĄ lub
NIE SĄ W STANIE zaspokoić potrzeb uprawnionego — dziadkowie NIE
odpowiadają "równolegle" z rodzicami, lecz SUBSYDIARNIE.

PRZYKŁAD: wnuk może dochodzić alimentów od dziadków, gdy rodzice są
niewypłacalni/nieznani z miejsca pobytu/bez środków.

PRZESŁANKA OGÓLNA (jak w sekcji ALIMENTY): niedostatek uprawnionego +
możliwości zarobkowe/majątkowe zobowiązanego.
```

---

## ⭐ MACIERZYŃSTWO ZASTĘPCZE / SUROGACJA — dodane 2026-07-19

```
STATUS: PRAWNA "SZARA STREFA" — NIE zakazana wprost, ale NIE uregulowana
ani zalegalizowana.

ZASADA NADRZĘDNA "MATER SEMPER CERTA EST": matką dziecka jest ZAWSZE
kobieta, która je URODZIŁA (surogatka), niezależnie od materiału
genetycznego — rodzice INTENCJONALNI nie mają automatycznego statusu.

SKUTKI: umowa o macierzyństwo zastępcze — wg dominującego poglądu
BEZWZGLĘDNIE NIEWAŻNA (art. 58 §1 KC). Możliwy zbieg z art. 211a §2 KK
("nielegalna adopcja") — głównie przy surogacji KOMERCYJNEJ; surogacja
ALTRUISTYCZNA (bez korzyści majątkowej) prawdopodobnie poza tym
przepisem. Surogacja dobrowolna NIE mieści się, wg dominującego
poglądu, w definicji handlu ludźmi (art. 115 §22 KK).

PRAKTYCZNE KONSEKWENCJE: OJCIEC biologiczny MOŻE ustalić ojcostwo
(sekcja USTALENIE OJCOSTWA wyżej). MATKA intencjonalna BEZ ZGODY
surogatki NIE MOŻE uregulować macierzyństwa — to NAJWIĘKSZE ryzyko
praktyczne. Droga: zwykle przysposobienie (patrz `mod-KRO-
przysposobienie-adopcja-miedzynarodowa.md`).

⚠️ Temat szybko ewoluuje (ETPCz rozpatruje sprawy uznawania zagranicznych
aktów urodzenia po surogacji) — zweryfikuj aktualny stan przy sprawie
transgranicznej.
```

---

## ⭐ KONKUBINAT / ZWIĄZKI NIEFORMALNE — PRAKTYCZNE KONSEKWENCJE — dodane 2026-07-19

```
BRAK REGULACJI: polskie prawo NIE PRZEWIDUJE żadnej odrębnej instytucji
dla konkubinatu (niezależnie od płci partnerów) — brak "związku
partnerskiego" w prawie krajowym.

KLUCZOWE BRAKI względem małżeństwa:
  □ Brak wspólności majątkowej — każdy partner ma własny majątek
  □ Brak automatycznego dziedziczenia ustawowego (tylko testament)
  □ Brak obowiązku alimentacyjnego między partnerami
  □ Brak renty rodzinnej po zmarłym partnerze
  □ Brak domniemania ojcostwa (art. 62 KRO dotyczy wyłącznie mężów)

NARZĘDZIA OCHRONY mimo braku regulacji:
  □ Współwłasność w częściach ułamkowych (świadomie udokumentowana)
  □ Testament na rzecz partnera (w tym zapis windykacyjny)
  □ Umowa o wspólnym zamieszkiwaniu
  □ Pełnomocnictwa (w tym medyczne — partner BEZ formalnego związku
    NIE MA automatycznego prawa do informacji/decyzji medycznych)
  □ Ubezpieczenie na życie ze wskazaniem partnera jako uposażonego

Checklist: przy KAŻDEJ konsultacji z parą w konkubinacie zapytaj wprost
o te narzędzia — brak ustawowej ochrony często zaskakuje klientów.
```

---

## ⭐ ZMIANA IMIENIA I NAZWISKA (ustawa z 17.10.2008) — dodane 2026-07-19

```
Odrębna od zmiany nazwiska PRZY ROZWODZIE (art. 59 KRO, patrz sekcja
OPŁATY SĄDOWE niżej) — dotyczy zmiany z INNYCH powodów, w KAŻDYM
momencie życia.

ORGAN: kierownik USC właściwy dla miejsca zamieszkania — DECYZJA
administracyjna.

WAŻNE POWODY (katalog przykładowy): imię/nazwisko śmieszne/nielicujące
z godnością, brzmienie niepolskie/trudne do zapisania, zmiana na
nazwisko faktycznie UŻYWANE od dawna, powrót do nazwiska sprzed błędnej
czynności stanu cywilnego.

ROZRÓŻNIENIE: zmiana PRZY ROZWODZIE (art. 59 KRO) jest BEZPŁATNA,
dostępna TYLKO w ciągu 3 miesięcy od uprawomocnienia rozwodu, WYŁĄCZNIE
powrót do nazwiska sprzed małżeństwa. Ustawa z 2008 r. jest szerszym
mechanizmem, dostępnym zawsze, dla każdego ważnego powodu.

⚠️ Dokładna procedura (termin, koszty, odwołanie) niepotwierdzona w
pełni w tej sesji — punkt startowy.
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
web_search: "rozwód rejestrowy USC weto Prezydenta status" (VER 2026-07-13: projekt zawetowany 30.04.2026 — sprawdzać wyłącznie czy pojawiła się NOWA inicjatywa, nie tę samą ustawę)
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
| Zawarcie małżeństwa, przeszkody małżeńskie, bigamia, uznanie małżeństwa zagranicznego/jednopłciowego (dodane 2026-07-19) | `mod-KRO-zawarcie-malzenstwa-bigamia-transgraniczne.md` (ten sam DR-02) |

---

## ŹRÓDŁA ONLINE

- KRO: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000236
- SN (orzeczenia cywilne): https://www.sn.pl
- Orzeczenia sądów powszechnych: https://orzeczenia.ms.gov.pl

---

## ⭐ SEPARACJA (art. 61¹-61⁶ KRO) — dodane 2026-07-19

> Odrębna instytucja od rozwodu — dotąd tylko wzmiankowana jako
> alternatywna ścieżka bez własnej treści.

```
PRZESŁANKA POZYTYWNA: ZUPEŁNY (NIE musi być TRWAŁY, w przeciwieństwie
  do rozwodu!) rozkład pożycia małżeńskiego — TO KLUCZOWA RÓŻNICA:
  □ ROZWÓD wymaga rozkładu ZUPEŁNEGO i TRWAŁEGO
  □ SEPARACJA wymaga TYLKO rozkładu ZUPEŁNEGO — separacji może żądać
    także małżonek, u którego nie ma pewności co do TRWAŁOŚCI rozpadu
    (np. rozstanie może być odwracalne) — separacja pozwala
    "rozłączyć się formalnie" bez przesądzania ostateczności

PRZESŁANKI NEGATYWNE (WĘŻSZE niż przy rozwodzie — TYLKO 2, nie 3):
  □ Ucierpiałoby DOBRO wspólnych MAŁOLETNICH DZIECI
  □ Orzeczenie byłoby SPRZECZNE z zasadami współżycia społecznego
  ⭐ BRAK trzeciej przesłanki negatywnej z rozwodu (sprzeciw małżonka
    niewinnego, gdy żąda separacji małżonek WYŁĄCZNIE winny) — separacji
    MOŻE żądać NAWET małżonek WYŁĄCZNIE WINNY rozkładu, sąd rozważa
    interesy obu stron, ale brak drugiej strony NIE BLOKUJE automatycznie

ZGODNE ŻĄDANIE: gdy małżonkowie NIE MAJĄ wspólnych małoletnich dzieci,
  sąd MOŻE orzec separację na ZGODNY WNIOSEK, bez badania winy (analogicznie
  do rozwodu bez orzekania o winie)

SKUTKI (art. 61⁴ KRO) — TAKIE SAME jak przy rozwodzie, Z WYJĄTKAMI:
  □ Powstaje ROZDZIELNOŚĆ MAJĄTKOWA (jak przy rozwodzie)
  □ ⭐ Małżonek W SEPARACJI NIE MOŻE zawrzeć NOWEGO małżeństwa (małżeństwo
    formalnie TRWA — to NAJWAŻNIEJSZA różnica od rozwodu)
  □ ⭐ OBOWIĄZEK WZAJEMNEJ POMOCY między małżonkami "jeżeli wymagają
    tego względy słuszności" (art. 61⁴ §3) — TEN obowiązek NIE ISTNIEJE
    po rozwodzie
  □ Obowiązek ALIMENTACYJNY analogiczny do art. 60 (jak wobec byłego
    małżonka), ALE bez wyjątku §3 tego przepisu
  □ ⭐ BRAK powrotu do nazwiska sprzed małżeństwa (art. 59 KRO NIE
    STOSUJE SIĘ) — logiczne, bo małżeństwo formalnie trwa
  □ Skutki ustalenia WINY — IDENTYCZNE jak przy rozwodzie (wpływają na
    alimenty)
  □ MAŁŻONKOWIE NIE DZIEDZICZĄ po sobie z mocy USTAWY w separacji (tak
    jak rozwiedzieni) — dziedziczenie możliwe TYLKO z testamentu

ZNIESIENIE SEPARACJI (art. 61⁶ KRO):
  □ NA ZGODNE ŻĄDANIE małżonków — sąd ORZEKA o zniesieniu
  □ Z CHWILĄ zniesienia — USTAJĄ jej skutki (małżeństwo "wraca" do
    normalnego funkcjonowania)
  □ WYJĄTEK: sąd ROZSTRZYGA PRZY ZNOSZENIU o władzy rodzicielskiej nad
    wspólnym małoletnim dzieckiem — TO NIE ustaje automatycznie
  □ Na ZGODNY wniosek małżonków, znosząc separację, sąd MOŻE orzec o
    UTRZYMANIU rozdzielności majątkowej (mimo zniesienia separacji) —
    kolejny wyjątek od zasady automatycznego powrotu do stanu sprzed
    separacji

SEPARACJA FAKTYCZNA vs PRAWNA — NIE MYLIĆ: separacja FAKTYCZNA (samo
  rozstanie bez orzeczenia sądu) NIE WYWOŁUJE żadnych z powyższych
  skutków prawnych — TYLKO separacja PRAWNA (orzeczona przez sąd) ma
  znaczenie dla majątku, dziedziczenia, alimentów itd.
```

**Checklist — kiedy separacja zamiast rozwodu:**
```
□ Klient NIE JEST pewien, czy rozpad jest OSTATECZNY (możliwość pojednania)
□ Klient ma powody RELIGIJNE/ŚWIATOPOGLĄDOWE przeciw rozwodowi, ale
  potrzebuje formalnego rozdzielenia majątkowego/uregulowania sytuacji
□ Klient jest WYŁĄCZNIE WINNY rozkładu i obawia się, że przy rozwodzie
  drugi małżonek mógłby (choć to rzadkie) skutecznie się sprzeciwić —
  przy separacji ten dodatkowy "bufor" nie istnieje
□ Ustalić, czy klient rozumie, że separacja NIE POZWALA zawrzeć nowego
  małżeństwa — to częsta przyczyna rozczarowania klientów
```

---

## ⭐ USTRÓJ MAJĄTKOWY MAŁŻEŃSKI I INTERCYZA (art. 31-54 KRO) — dodane 2026-07-19

```
USTRÓJ USTAWOWY (domyślny, powstaje Z MOCY PRAWA z chwilą ślubu) —
  WSPÓLNOŚĆ USTAWOWA: majątek WSPÓLNY (nabyty w czasie trwania wspólności
  przez oboje/jedno z małżonków) + majątki OSOBISTE każdego z małżonków
  (katalog ZAMKNIĘTY, art. 33 KRO: m.in. majątek nabyty PRZED powstaniem
  wspólności, nabyty przez DZIEDZICZENIE/ZAPIS/DAROWIZNĘ — chyba że
  spadkodawca/darczyńca postanowił inaczej, przedmioty ŚCIŚLE OSOBISTEGO
  użytku) — przedmioty NIEWYMIENIONE w tym katalogu wchodzą do majątku
  WSPÓLNEGO, nie osobistego

USTROJE UMOWNE (art. 47-51¹ KRO) — wymagają UMOWY MAJĄTKOWEJ MAŁŻEŃSKIEJ
  ("intercyza") w formie AKTU NOTARIALNEGO (rygor nieważności), może
  poprzedzać ślub LUB być zawarta w trakcie małżeństwa:
  □ ROZSZERZONA WSPÓLNOŚĆ — włączenie do wspólności składników, które
    normalnie byłyby majątkiem osobistym
  □ OGRANICZONA WSPÓLNOŚĆ — wyłączenie niektórych składników ze
    wspólności (bez pełnej rozdzielności)
  □ ROZDZIELNOŚĆ MAJĄTKOWA (pełna) — KAŻDY z małżonków zachowuje
    ZARÓWNO majątek nabyty PRZED umową, JAK I nabyty PÓŹNIEJ — NIE
    POWSTAJE majątek wspólny W OGÓLE (jeśli umowa zawarta przed ślubem)
    lub dotychczasowa wspólność USTAJE (jeśli zawarta w trakcie
    małżeństwa) — każdy zarządza SAMODZIELNIE swoim majątkiem (art. 51¹)
  □ ROZDZIELNOŚĆ Z WYRÓWNANIEM DOROBKÓW — wariant pośredni: majątki
    odrębne w trakcie trwania, ale przy ustaniu ustroju NASTĘPUJE
    rozliczenie różnicy w przyroście majątków obojga małżonków

⭐ ZAKAZ "MIESZANIA" USTROJÓW: niedopuszczalne jest zawarcie umowy
  tworzącej USTRÓJ NIEZNANY ustawie lub KOMPILACJĘ elementów różnych
  ustrojów — taka umowa byłaby NIEWAŻNA z mocy prawa (art. 58 KC w zw.
  z art. 47 KRO) jako sprzeczna z ustawą — KATALOG ustrojów jest ZAMKNIĘTY

PRZYMUSOWA ROZDZIELNOŚĆ MAJĄTKOWA (z mocy prawa LUB orzeczenia sądu,
  BEZ potrzeby umowy):
  □ Z MOCY PRAWA — np. przy OGŁOSZENIU UPADŁOŚCI KONSUMENCKIEJ przez
    jednego z małżonków (automatyczne powstanie rozdzielności)
  □ Z ORZECZENIA SĄDU — na żądanie JEDNEGO z małżonków z WAŻNYCH powodów
    (np. drugi małżonek trwoni majątek wspólny) — ⚠️ dokładne przesłanki
    NIE zweryfikowane w pełni w tej sesji

ROZWIĄZANIE/ZMIANA UMOWY MAJĄTKOWEJ: MOŻLIWA w każdym czasie (ta sama
  forma — akt notarialny) — w razie ROZWIĄZANIA W TRAKCIE małżeństwa,
  między małżonkami PONOWNIE POWSTAJE wspólność USTAWOWA, CHYBA że
  strony postanowiły inaczej (art. 47 §2 KRO)

SKUTECZNOŚĆ WOBEC OSÓB TRZECICH: małżonek MOŻE powoływać się na umowę
  majątkową wobec innych osób TYLKO gdy jej ZAWARCIE oraz RODZAJ były
  tym osobom WIADOME (art. 47¹ KRO) — istotne dla WIERZYCIELI: jeśli
  wierzyciel NIE WIEDZIAŁ o intercyzie, może dochodzić zaspokojenia
  tak, jakby wspólność ustawowa nadal istniała
```

**Checklist praktyczny:**
```
□ Czy klient prowadzi DZIAŁALNOŚĆ GOSPODARCZĄ o podwyższonym ryzyku —
  rozważ rekomendację rozdzielności majątkowej dla ochrony majątku
  współmałżonka
□ Czy planowana intercyza ma zostać zawarta PRZED czy PO ślubie — obie
  opcje dopuszczalne, ta sama forma (akt notarialny)
□ Czy umowa NIE PRÓBUJE stworzyć nieznanego ustawie "hybrydowego"
  ustroju — sprawdź zgodność z zamkniętym katalogiem art. 47-51¹
□ Przy rozwodzie/separacji — USTAL, jaki ustrój majątkowy OBOWIĄZYWAŁ
  i OD KIEDY (sąd MUSI to ustalić na rozprawie rozwodowej) — kluczowe
  dla podziału majątku wspólnego
□ Czy druga strona (np. wierzyciel) WIEDZIAŁA o intercyzie — jeśli NIE,
  może to nie chronić majątku osobistego małżonka przed jej roszczeniami
```

---

## ⭐ USTALENIE OJCOSTWA (art. 62, 72-86 KRO) — dodane 2026-07-19

> Odrębne od ZAPRZECZENIA ojcostwa (sekcja niżej) — to ustalenie
> POCHODZENIA dziecka, wobec którego domniemanie z art. 62 NIE działa
> (dziecko pozamałżeńskie) lub zostało już obalone.

### Trzy sposoby ustalenia pochodzenia dziecka

```
1. DOMNIEMANIE POCHODZENIA OD MĘŻA MATKI (art. 62 KRO) — dla dzieci
   MAŁŻEŃSKICH: mąż matki jest domniemanym ojcem, gdy dziecko urodziło
   się W CZASIE MAŁŻEŃSTWA lub przed upływem 300 DNI od jego ustania/
   unieważnienia/separacji. Domniemanie WZRUSZALNE — obala się je
   POWÓDZTWEM O ZAPRZECZENIE OJCOSTWA (patrz sekcja niżej), NIE przez
   samo ustalenie ojcostwa innej osoby
   ⚠️ Domniemanie NIE DZIAŁA, gdy dziecko urodziło się PO UPŁYWIE 300 DNI
   od ORZECZENIA SEPARACJI (nie samego jej wniosku)
   ⚠️ Jeśli matka zawarła DRUGIE małżeństwo przed upływem 300 dni od
   ustania pierwszego — domniemywa się ojcostwo DRUGIEGO męża

2. UZNANIE OJCOSTWA (art. 72-83 KRO) — dla dzieci POZAMAŁŻEŃSKICH,
   DOBROWOLNE:
   □ Mężczyzna SKŁADA OŚWIADCZENIE przed KIEROWNIKIEM USC (lub sądem
     opiekuńczym; za granicą — przed polskim KONSULEM), że JEST ojcem
   □ MATKA POTWIERDZA jednocześnie LUB w ciągu 3 MIESIĘCY od oświadczenia
     mężczyzny — bez potwierdzenia matki uznanie NIE JEST skuteczne
   □ MOŻLIWE PRZED URODZENIEM dziecka już POCZĘTEGO (art. 75 KRO)
   □ BEZPŁATNE (opłata sądowa dotyczy TYLKO ścieżki sądowej)
   □ Szczególny wariant przy PROKREACJI MEDYCZNIE WSPOMAGANEJ z użyciem
     komórek/zarodka od ANONIMOWEGO DAWCY — mężczyzna może oświadczyć
     PRZED poczęciem, że będzie ojcem, z potwierdzeniem kobiety

3. SĄDOWE USTALENIE OJCOSTWA (art. 84-86 KRO) — gdy NIE DOSZŁO do
   uznania (spór/odmowa/brak porozumienia):
   □ UPRAWNIENI do powództwa: DZIECKO, MATKA, DOMNIEMANY OJCIEC,
     PROKURATOR (gdy wymaga tego dobro dziecka lub interes społeczny,
     art. 86 KRO) — ⚠️ BIOLOGICZNY ojciec sam NIE MA legitymacji do
     wytoczenia powództwa, może jedynie ZWRÓCIĆ SIĘ do prokuratora o
     zainicjowanie sprawy
   □ DOMNIEMANIE z art. 85 KRO: ojcem dziecka jest TEN, KTO OBCOWAŁ z
     matką NIE WCZEŚNIEJ niż w 300., a NIE PÓŹNIEJ niż w 181. dniu
     PRZED urodzeniem dziecka — obalane, gdy z okoliczności wynika, że
     ojcostwo INNEGO mężczyzny jest BARDZIEJ prawdopodobne
   □ DOWÓD: badanie DNA (praktyczny standard — profile 15-24 markerów
     STR, prawdopodobieństwo zwykle >99,99% przy zgodności, 0% przy
     niezgodności ≥3 niezależnych loci)
   □ BRAK krótkiego terminu zawitego dla powództwa O USTALENIE (w
     PRZECIWIEŃSTWIE do zaprzeczenia — patrz różnica niżej)
   □ TRYB: procesowy, sąd REJONOWY (wydział rodzinny) właściwy dla
     miejsca zamieszkania dziecka
   □ OPŁATA: 200 zł od pozwu (⚠️ zweryfikuj aktualność kwoty)
```

### ⚡ ZAPOWIEDZIANA REFORMA (2026, status: PROJEKT, NIE uchwalone)

Ministerstwo Sprawiedliwości ROZWAŻA (stan na wczesne 2026, ⚠️ zweryfikuj
AKTUALNY status projektu przed użyciem) ZNIESIENIE domniemania ojcostwa
z art. 62 KRO dla dzieci urodzonych PO UPRAWOMOCNIENIU SIĘ WYROKU
ROZWODOWEGO (nie po samym orzeczeniu separacji, co już jest wyłączone) —
w takim przypadku ojcostwo byłoby ustalane WYŁĄCZNIE przez uznanie
biologicznego ojca lub sądowe ustalenie, NIE przez automatyczną fikcję
łączącą dziecko z byłym mężem. Rzecznik Praw Obywatelskich od lat
POSTULUJE tę zmianę, wskazując na systemową niesprawiedliwość wobec
dzieci urodzonych w toku wieloletnich postępowań rozwodowych. **TO
PROJEKT, NIE OBOWIĄZUJĄCE PRAWO — nie stosuj tej reformy jako aktualnego
stanu prawnego, zweryfikuj status legislacyjny PRZED każdym użyciem.**

### Checklist praktyczny
```
□ Czy dziecko jest MAŁŻEŃSKIE (domniemanie art. 62 działa) czy
  POZAMAŁŻEŃSKIE (wymaga uznania lub sądowego ustalenia)?
□ Czy doszło już do UZNANIA — jeśli TAK, dalsze "ustalanie" jest zbędne
  (chyba że kwestionuje się samo uznanie — inny tryb)
□ Kto wytacza powództwo o USTALENIE — sprawdź legitymację (dziecko,
  matka, domniemany ojciec, prokurator — NIE sam biologiczny ojciec
  bezpośrednio)
□ Czy klientowi zależy na SZYBKIEJ, bezpłatnej ścieżce (uznanie w USC
  za zgodą obu stron) czy sytuacja WYMAGA postępowania sądowego (spór)?
□ ⚠️ Sprawdź AKTUALNY status projektu reformy art. 62 KRO — może zmienić
  zasady dla dzieci urodzonych po rozwodzie
```

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
