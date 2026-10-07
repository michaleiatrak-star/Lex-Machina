# MOD-OS-CZASU-PRZESLANEK — Bramka temporalna przesłanek (OŚ-GATE)

> **Plik kanoniczny:** `shared/MOD-OS-CZASU-PRZESLANEK.md`
> **Wersja:** 1.1 | Utworzony: 2026-08-31 (flaga F-142) | Zmieniony: 2026-08-31 (flaga F-144)
> **Wywołują:** `chronologia-sprawy-v1` (OŚ-GATE), `prawny-router-v3`
> (BRAMKA CHRONOLOGICZNA, KROK 4), `analiza-sadowa-v6`, `analizator-przepisow-v2`
> **Moduł siostrzany:** `shared/MOD-WYJATEK-GATE.md` (WYJ-GATE) — wyjątki
> i przepisy szczególne. Ten moduł odpowiada na pytanie KIEDY i KTÓRY REŻIM;
> tamten na pytanie CO TĘ REGUŁĘ WYŁĄCZA. Nie duplikuj między nimi tablic.
> **Nie jest** bramką weryfikacyjną — nie zastępuje `shared/PRAWO-HARDGATE.md`.
> Nie rozstrzyga sprawy; produkuje pytania, na które rozstrzygnięcie musi
> odpowiedzieć.

---

## 1. PROBLEM, KTÓRY TEN MODUŁ ZAMYKA

> ⛔ **Chwila, na którą ocenia się przesłankę, nie jest tożsama z chwilą
> zdarzenia, które ją wywołało.**

Domyślny tryb pracy modelu przy kazusie to „zamrożenie" stanu faktycznego na
dacie zdarzenia głównego i sprawdzenie przesłanek na tę datę. Dla większości
spraw jest to poprawne. Dla całej rodziny spraw jest to **tryb awarii**: stan
faktyczny nie jest zdjęciem, tylko funkcją czasu, a między zdarzeniem a
oceną upływa termin ustawowy, który przesłankę **tworzy albo wygasza bez
udziału i wiedzy stron**.

**Przypadek referencyjny (KAZUS 111, sesja 2026-08-31).** Zakup samochodu
w komisie 20.02.2011; pojazd skradziony 15.01.2009; zatrzymanie 20.07.2012.
Wada prawna istniała w chwili zawarcia umowy i przez jedenaście miesięcy po
niej — ale przestała istnieć w styczniu 2012 r., zanim kupująca w ogóle się
o niej dowiedziała. Rozstrzygnięcie kazusu opiera się WYŁĄCZNIE na relacji
daty kradzieży do daty zatrzymania. Analiza „na datę zakupu" daje odpowiedź
poprawnie uzasadnioną i **merytorycznie błędną**.

**Dlaczego to nie jest luka w wiedzy prawniczej.** W przebiegu referencyjnym
model znał wszystkie właściwe przepisy i wszystkie cztery daty. Zabrakło
kroku, który zadaje jedno pytanie: *ile czasu upłynęło między tymi datami
i czy to jest termin, który sam z siebie coś zmienia*. Dopisanie kolejnych
przepisów tego nie naprawia. Naprawia to wymuszony krok arytmetyczny.

---

## 2. WYZWALACZ — MECHANICZNY, NIE OCENNY

```
⛔ WYZWALACZ: w materiale wejściowym (opis stanu faktycznego, dokument,
   kazus, akta) występują ≥2 daty odnoszące się do zdarzeń sprawy.

⛔ ZAKAZ warunku ocennego. Wyzwalaczem NIE jest:
   „gdy sprawa wydaje się temporalna" / „gdy widać problem z terminem" /
   „gdy analiza tego wymaga" — ocena własnej potrzeby to dokładnie ten tryb
   awarii, który opisuje flaga F-113 (reguła istnieje i nie odpala).

Sprawdzian brzmi: POLICZ DATY. ≥2 → wykonaj OŚ-1…OŚ-4.
Jedna data albo zero → pomiń, odnotuj „OŚ-GATE: nie dotyczy (n dat = …)".
```

Rok bez dnia i miesiąca liczy się jako data (z zakresem niepewności).
Zwroty względne („po trzech latach", „w następnym roku", „przed świętami")
liczą się jako daty i wymagają zakotwiczenia albo oznaczenia ⬛.

---

## 3. PROCEDURA OŚ-1 → OŚ-4

### OŚ-1 — EKSTRAKCJA

Wypisz KAŻDĄ datę z materiału, w kolejności chronologicznej, z etykietą
zdarzenia i statusem kompletności:

```
| # | Data        | Zdarzenie                    | Status |
|---|-------------|------------------------------|--------|
| 1 | 15.01.2009  | kradzież pojazdu             | pełna  |
| 2 | 20.02.2011  | zakup w komisie              | pełna  |
| 3 | 20.07.2012  | zatrzymanie przez Policję    | pełna  |
| 4 | 08.2012     | wydanie właścicielowi        | ⬛ brak dnia |
```

Reguły:
- data niepełna → `⬛ [UZUPEŁNIJ: …]`, ale **NIE blokuje** OŚ-2; licz z
  zakresem (dla `08.2012` przedział 01–31.08.2012);
- data sporna między dokumentami → wpisz OBIE, oznacz `⚠️ sprzeczność`
  i przekaż do `chronologia-sprawy-v1/references/sprzecznosci-dat.md`;
- data przyszła lub hipotetyczna → oznacz `[HIPOTEZA]`, licz osobno.

### OŚ-2 — SIATKA INTERWAŁÓW

Policz odstęp między **każdą parą** dat. Przy n datach par jest n(n−1)/2 —
przy 4 datach 6 par, przy 6 datach 15 par. Nie skracaj siatki intuicją
(„te dwie daty przecież nie mają ze sobą związku") — właśnie tam siedzą
przeoczenia.

Dopasuj każdy odstęp do tablicy progów:

```
PROGI PODSTAWOWE (dni/miesiące):  7 · 14 · 30 · 3 mies. · 6 mies.
PROGI ROCZNE:                     1 · 2 · 3 · 5 · 6 · 10 · 20 · 30 lat
TOLERANCJA TRAFIENIA:             ±10% odstępu lub ±30 dni (co większe)
```

Wynik w formacie:

```
| Para   | Odstęp          | Trafienie      | Flaga |
|--------|-----------------|----------------|-------|
| 1 → 2  | 2 lata 1 mies.  | ~2 lata        | ⚑     |
| 1 → 3  | 3 lata 6 mies.  | 3 lata + 6 m.  | ⚑⚑    |
| 1 → 4  | ~3 lata 7 mies. | 3 lata przekr. | ⚑⚑    |
| 2 → 3  | 1 rok 5 mies.   | 1 rok przekr.  | ⚑     |
| 2 → 4  | ~1 rok 6 mies.  | —              |       |
| 3 → 4  | ~1 mies.        | —              |       |
```

`⚑⚑` = odstęp **przekracza** próg (coś mogło się już dokonać).
`⚑` = odstęp **zbliża się** do progu lub go nieznacznie przekracza.

⚠️ **Fałszywe alarmy są wliczone w koszt.** Przy 6 datach dostaniesz
kilkanaście par i część trafień bez znaczenia. Fałszywy alarm kosztuje
linijkę raportu; przeoczenie kosztuje rozstrzygnięcie. Nie tłum siatki,
żeby wyglądała czyściej.

### OŚ-3 — PUNKTY PRZEŁĄCZENIA

Dla **każdej** flagi ⚑/⚑⚑ wypisz zdanie pytające w stałym szablonie:

```
Między [zdarzenie A, data] a [zdarzenie B, data] upłynęło [odstęp].
Czy w tym oknie mógł zmienić się:
  (a) status własnościowy rzeczy?
  (b) zaskarżalność roszczenia?
  (c) status prawny strony (przedsiębiorca/konsument, zdolność, sukcesja)?
  (d) stan prawny — reżim, właściwa ustawa, brzmienie przepisu?
Jeżeli TAK → nazwij instytucję i przenieś ją do OŚ-4.
Jeżeli NIE → zapisz „sprawdzono — brak" (milczenie NIE jest odpowiedzią
negatywną, dokładnie jak w KROK 2C shared/PRAWO-HARDGATE.md).
```

⛔ Pytanie (d) uruchamia dodatkowo **kontrolę reżimu** — patrz §5.

### OŚ-4 — TABELA CHWIL OCENY

Dla każdego rozważanego roszczenia lub uprawnienia wypełnij:

```
| Roszczenie | Przesłanka | Chwila oceny | Stan na tę chwilę |
|------------|------------|--------------|-------------------|
```

```
⛔ ZAKAZ KONKLUZJI PRZED WYPEŁNIENIEM TABELI.
   Dopóki kolumna „chwila oceny" jest pusta lub wypełniona domyślnie
   („data zdarzenia"), analiza NIE jest gotowa do wniosku.
```

Kolumna „chwila oceny" wypełnia się z tablicy w §4. **Jeżeli instytucji nie
ma w tablicy — nie zgaduj.** Wpisz `⚠️ [CHWILA OCENY NIEUSTALONA]`, ustal ją
z odczytanego przepisu i orzecznictwa w ramach normalnego HARD GATE, a po
rozstrzygnięciu dopisz pozycję do tablicy zgodnie z §6.

---

## 4. TABLICA CHWIL OCENY PRZESŁANEK

> **Polityka wypełniania: WĄSKA I ROSNĄCA** (decyzja wykonawcza modelu,
> 2026-08-31 — pytanie o wybór wariantu zostało użytkownikowi zadane, ale
> polecenie wykonania wpłynęło przed odpowiedzią; wybrano wariant wąski jako
> odwracalny. Rozszerzenie do wariantu szerokiego = decyzja użytkownika,
> nie domyślna trajektoria modułu).
> Tablica startuje z pozycjami wyprowadzonymi z realnych potknięć systemu,
> nie z przeglądu kodeksów. Rośnie zgodnie z §6 — każde kolejne potknięcie
> dopisuje wiersz. Uzasadnienie wyboru: tablica szeroka wygląda lepiej
> w audycie i w większości zawiera pozycje, których nikt nigdy nie otworzy;
> tablica wąska działa od pierwszego dnia i rośnie na dowodach.

> ⛔ **TA TABLICA NIE JEST ŹRÓDŁEM PRAWA.** Kolumna „chwila oceny" jest
> wskazówką, GDZIE patrzeć, nie ustaleniem, CO tam stoi. Każda pozycja
> użyta w odpowiedzi lub piśmie przechodzi normalny HARD GATE
> (`shared/PRAWO-HARDGATE.md`) — świeży odczyt przepisu i, gdy w grę
> wchodzi sygnatura, `shared/PRAWO-HARDGATE-ORZECZENIA.md`.
> Kolumna „źródło ustalenia" mówi, skąd wiadomo — nie zwalnia z weryfikacji.

| # | Instytucja | Przesłanka | Chwila oceny | Źródło ustalenia |
|---|-----------|-----------|--------------|------------------|
| T-01 | rękojmia / odpowiedzialność za wadę prawną | rzecz stanowi własność osoby trzeciej | chwila **korzystania z uprawnienia**, nie zawarcia umowy | wyrok SN 18.10.2023, II CSKP 1771/22 — zweryfikowany w sn.pl 2026-08-31; fragment o hipotezie § 2 czytany z bazy wtórnej, wymaga lektury pełnego uzasadnienia |
| T-02 | nabycie od nieuprawnionego, rzecz utracona wbrew woli właściciela | przejście własności | **upływ trzech lat od utraty**, nie chwila wydania rzeczy | art. 169 § 2 k.c., odczyt 2026-08-31; KAZUS 111 |
| T-03 | nabycie od nieuprawnionego | dobra wiara nabywcy | objęcie w posiadanie — **spór doktrynalny**, czy musi trwać do końca terminu | art. 169 § 1–2 k.c.; rozbieżność opisana w piśmiennictwie, rozstrzygnąć per sprawa |
| T-04 | zasiedzenie ruchomości | dobra wiara posiadacza | **cały okres**, nie tylko jego początek | art. 174 § 1 k.c., odczyt 2026-08-31 |
| T-05 | potrącenie ustawowe | wymagalność obu wierzytelności | powstanie **stanu potrącalności**; oświadczenie działa wstecz do tej chwili | art. 498 § 1, art. 499 k.c., odczyt 2026-08-31; KAZUS 118 |
| T-06 | potrącenie wierzytelności przedawnionej | brak przedawnienia | chwila, w której **potrącenie stało się możliwe**, nie chwila złożenia oświadczenia | art. 502 k.c., odczyt 2026-08-31 |
| T-07 | subrogacja ustawowa poręczyciela | nabycie wierzytelności | chwila **zapłaty**, do wysokości zapłaty; wymagalność przechodzi bez zmiany | art. 518 § 1 pkt 1 k.c., odczyt 2026-08-31; KAZUS 118 |
| T-08 | odpowiedzialność sprzedawcy wobec konsumenta | który reżim w ogóle stosować | **data zawarcia umowy**, nie data reklamacji ani data analizy | patrz §5 (tablica reżimów) |
| T-09 | rękojmia za wadę prawną — przesłanka „rzecz stanowi własność osoby trzeciej" | wada musi istnieć w chwili korzystania z uprawnień; skuteczne nabycie własności (art. 169 k.c.) tę przesłankę **znosi** | chwila **korzystania z uprawnienia**, nie zawarcia umowy | wyrok SN 18.10.2023, II CSKP 1771/22 — teza i fragment uzasadnienia odczytane 2026-08-31 (sn.pl, snippet indeksowany + czasopismo.legeartis.org); pełne uzasadnienie ze strony sn.pl zwróciło 404 przy bezpośrednim pobraniu |

**Kolumna „chwila oceny" — trzy typowe wartości i ich skutek:**

```
CHWILA ZDARZENIA     → stan zamrożony; analiza domyślna wystarcza
CHWILA KORZYSTANIA   → przesłanka mogła w międzyczasie ODPAŚĆ (T-01)
UPŁYW TERMINU        → przesłanka mogła w międzyczasie POWSTAĆ (T-02, T-04)
```

Dwie ostatnie to dokładnie te przypadki, w których analiza „na datę
zdarzenia" daje wynik spójny wewnętrznie i błędny.

---

## 5. KONTROLA REŻIMU (OŚ-3 pytanie (d))

Osobna gałąź, bo błąd ma inny mechanizm: nie zmienia się stan faktyczny,
tylko **właściwa ustawa**. Model cytuje wtedy aktualne brzmienie przepisu do
zdarzenia sprzed nowelizacji — cytat jest prawdziwy i nieadekwatny.

```
OŚ-5.1  Ustal DATĘ ZDARZENIA PRAWNIE DONIOSŁEGO (zawarcie umowy, czyn,
        doręczenie decyzji) — NIE datę analizy i NIE datę sporu.
OŚ-5.2  Ustal POZOSTAŁE OSIE reżimu (§5A). Reżim NIE jest funkcją samej daty.
OŚ-5.3  Sprawdź, czy między datą z OŚ-5.1 a dziś nastąpiła zmiana reżimu
        w tej dziedzinie. Jeżeli tak → wskaż akt właściwy NA TĘ DATĘ.
OŚ-5.4  ⛔ Odczytaj PRZEPIS PRZEJŚCIOWY nowelizacji, która wyznacza cezurę.
        Cezura bez przepisu przejściowego jest datą, nie regułą stosowania.
OŚ-5.5  Zapisz jawnie: „stan prawny na [data] — [akt]; obecne brzmienie
        [aktu] NIE ma tu zastosowania".
OŚ-5.6  Gdy nie ustalisz reżimu → ⚠️ [REŻIM NIEUSTALONY], nie milcz.
```

### §5A — MACIERZ REŻIMU (trzy osie, nie jedna)

> ⛔ Tabela epok („do 2003 tak, 2003–2014 inaczej, od 2023 jeszcze inaczej")
> jest **jednowymiarowa i daje fałszywą pewność**. Ta sama data zawarcia umowy
> prowadzi do różnych reżimów zależnie od tego, kto kupuje i kto zbywa.

```
OŚ 1 — CZAS:     data zdarzenia prawnie doniosłego  → cezura z tablicy §5B
OŚ 2 — STRONA:   status kupującego/uprawnionego
                 (konsument · przedsiębiorca · rolnik · pacjent · pracownik)
OŚ 3 — STOSUNEK: typ zbywcy i umowy
                 (sprzedaż · komis · dostawa · dzieło · sprzedaż egzekucyjna)

⛔ ZAKAZ WARTOŚCI DOMYŚLNEJ NA KTÓREJKOLWIEK OSI.
   Gdy oś nie wynika ze stanu faktycznego → ⬛ [UZUPEŁNIJ: …] i rozpisz
   wariantowo. Ciche przyjęcie „konsument" albo „zwykła sprzedaż" jest
   błędem tej samej klasy co cytat z pamięci: twierdzenie bez źródła.
```

Zapis wyniku — trójka, nie data:

```
REŻIM: [20.02.2011] × [konsument] × [komis]
     → ustawa z 27.07.2002 o szczególnych warunkach sprzedaży konsumenckiej
       (art. 1 ust. 4 wyłącza art. 556–581 k.c.), z odesłaniem art. 770¹ k.c.
REŻIM: [20.02.2011] × [przedsiębiorca] × [komis]
     → k.c. rękojmia w brzmieniu sprzed 25.12.2014 + art. 770 k.c.
```

Obie trójki mają tę samą datę i różne rozstrzygnięcie. To jest cały powód
istnienia §5A.

⛔ Osi 2 i 3 dostarcza stan faktyczny; jednostek redakcyjnych, które te osie
różnicują, dostarcza `shared/MOD-WYJATEK-GATE.md` (WYJ-GATE). Bez zamiatania
wyjątków macierz może mieć poprawne osie i pustą komórkę — dokładnie tak
wypadł art. 770¹ w KAZUSIE 111.


### §5B — TABLICA CEZUR

**Polityka wąska i rosnąca, ta sama co w §4.**
Pozycje pochodzą z realnych potknięć, nie z systematycznego przeglądu.

| # | Dziedzina | Cezura | Co się zmienia | Źródło ustalenia |
|---|-----------|--------|----------------|------------------|
| R-01 | odpowiedzialność za wady wobec konsumenta | **1.01.2003** | wejście w życie ustawy z 27.07.2002 o szczególnych warunkach sprzedaży konsumenckiej (Dz.U. 2002 Nr 141 poz. 1176); jej art. 1 ust. 4 wyłącza art. 556–581 k.c. | odczyt 2026-08-31, snippet urzędowego PDF ISAP + orka.sejm.gov.pl |
| R-02 | j.w. | **25.12.2014** | uchylenie ustawy z 2002 r.; rękojmia wraca do k.c. w brzmieniu nadanym ustawą o prawach konsumenta | ⚠️ data wejścia w życie nie została zweryfikowana w RZĘDZIE 1 — sprawdź przed użyciem |
| R-03 | j.w. | **1.01.2023** | art. 43a ust. 1 zd. 2 u.p.k. wyłącza wobec umów zobowiązujących do przeniesienia własności towaru na konsumenta przepisy **księgi trzeciej tytułu XI działu II k.c.** (dział o rękojmi). ⛔ NIE „k.c. w ogóle" — art. 155, 169, 222, 471 stosuje się dalej i to one rozstrzygają o własności | brzmienie art. 43a odczytane 2026-08-31 (orka.sejm.gov.pl — tekst ustawy z 4.11.2022, Dz.U. poz. 2337; lexlege.pl); korekta zakresu po audycie cudzego materiału, sesja 2026-08-31b |
| R-03a | j.w. — **przepis przejściowy do R-03** | umowy zawarte **przed 1.01.2023** | art. 4 ust. 1 ustawy z 4.11.2022: do umów zobowiązujących do przeniesienia własności towaru zawartych przed wejściem w życie stosuje się przepisy dotychczasowe. Bez tego wiersza cezura R-03 kusi, żeby datę czynności podmienić datą sporu | odczyt 2026-08-31, orka.sejm.gov.pl (tekst ustawy) |
| R-04 | terminy przedawnienia, zasady ogólne | **9.07.2018** | reforma przedawnienia w k.c. wraz z przepisami przejściowymi | ⚠️ NIEZWERYFIKOWANE w tej sesji — pozycja wpisana jako wskazówka kierunkowa, wymaga rozstrzygnięcia przed pierwszym użyciem |
| R-05 | odpowiedzialność zbywcy przy **komisie** wobec konsumenta | **1.01.2003 – 24.12.2014** | art. 770¹ k.c. (dodany ustawą z 27.07.2002, uchylony 25.12.2014): do umowy sprzedaży rzeczy ruchomej zawartej przez komisanta z osobą fizyczną nabywającą w celu niezwiązanym z działalnością — przepisy o sprzedaży konsumenckiej. ⛔ Wypiera art. 770 k.c. na OSI 3 | dodanie art. 770¹: urzędowy PDF ISAP ustawy z 2002 r. (WDU20021411176); brzmienie: e-prawnik.pl; status „uchylony": arslege.pl/lexlege.pl — odczyt 2026-08-31; KAZUS 111, potknięcie referencyjne F-144 |

⛔ Wiersze oznaczone ⚠️ **nie mogą** być użyte jako podstawa twierdzenia bez
uprzedniej weryfikacji. Pozostają w tablicy, bo wskazują miejsce do
sprawdzenia — nie dlatego, że są ustalone.

---

## 6. ROZBUDOWA TABLIC — reguła dopisywania

```
DOPISZ WIERSZ, gdy zachodzi którykolwiek warunek:
  (a) analiza przeszła OŚ-4 z wpisem ⚠️ [CHWILA OCENY NIEUSTALONA]
      i chwila została w tej sesji ustalona;
  (b) użytkownik wskazał błąd polegający na ocenie przesłanki na
      niewłaściwą chwilę;
  (c) recenzja zewnętrzna albo klucz odpowiedzi ujawniły cezurę reżimową,
      której tablica §5 nie zawiera.

FORMAT WPISU — obowiązkowe pola:
  instytucja · przesłanka · chwila oceny · źródło ustalenia (z datą odczytu
  i statusem wg shared/PRAWO-HARDGATE.md) · numer kazusu/sesji

⛔ ZAKAZ dopisywania pozycji „na zapas", z pamięci modelu albo z
   systematycznego przeglądu kodeksu bez odczytu źródła. Wiersz bez pola
   „źródło ustalenia" jest naruszeniem pozycji 14 listy ZASAD
   KRYTYCZNYCH `audyt-systemu-v4/SKILL.md` (AUDIT-CLAIM-GATE) i nie wchodzi
   do tablicy.
```

---

## 7. BLOK WYJŚCIOWY — WIDOCZNY W ODPOWIEDZI

> ⛔ Krok niewidoczny w dostarczonym tekście jest krokiem, który można
> pominąć bez śladu. Ta sama zasada, którą `shared/PRAWO-HARDGATE.md`
> stosuje do znaczników weryfikacji.

Blok umieszcza się **przed** konkluzją prawną, nie po niej:

```
### OŚ-GATE

**Daty (OŚ-1):** [n dat, lista skrócona; ⬛ dla niepełnych]

**Siatka interwałów (OŚ-2):** [n(n−1)/2 par; wypisz WSZYSTKIE trafienia,
liczbę par bez trafienia podaj zbiorczo]

**Punkty przełączenia (OŚ-3):** [zdanie pytające dla każdej flagi + odpowiedź;
„sprawdzono — brak" jest odpowiedzią wymaganą, nie pominięciem]

**Reżim (OŚ-5):** [data zdarzenia → akt właściwy na tę datę]

**Chwile oceny (OŚ-4):**
| Roszczenie | Przesłanka | Chwila oceny | Stan na tę chwilę |
```

Forma skrócona (gdy 2–3 daty i zero trafień) — jedna linia:
`OŚ-GATE: 3 daty, 3 pary, 0 trafień, reżim bez cezury — brak przełączeń.`

---

## 8. GRANICE MODUŁU — nazwane wprost

1. **Nie rozstrzyga.** Produkuje pytanie „tu upłynęły trzy lata, sprawdź".
   Który termin, jaki skutek i czy w ogóle — to routing dziedzinowy plus
   HARD GATE. Moduł, który sam odpowiadałby na te pytania, byłby bazą
   prawa materialnego w `shared` — czego zakazuje zasada odciążenia
   (`prawny-router-v3`, „Router NIE jest bazą prawa materialnego").
2. **Nie naprawia wejścia.** Zniekształcony opis stanu faktycznego
   (OCR, skrót, literówka w dacie) trzeba zrekonstruować osobno; moduł
   liczy to, co dostanie.
3. **Generuje fałszywe alarmy** — świadomie, patrz OŚ-2.
4. **Bez tablic z §4–§5 jest kalkulatorem odstępów.** Cała wartość
   rozstrzygająca siedzi w kolumnie „chwila oceny", która powstaje
   ręcznie i rośnie wolno.
5. ⚠️ **Obecność tego modułu w pliku NIE dowodzi zmiany zachowania.**
   To bramka samo-raportująca tej samej klasy co `KROK 3A` routera
   (F-119) i bramki objęte pomiarem **F-113**. Jedynym dowodem
   skuteczności jest test z grupą kontrolną: ≥10 kazusów w dwóch
   ramionach, pomiar (i) czy blok OŚ-GATE faktycznie się pojawił,
   (ii) w ilu przypadkach zmienił konkluzję. Do czasu tego pomiaru
   deklaracja „system łapie kazusy typu 111" jest nieuprawniona.

---

## 9. WYWOŁANIE

```
view shared/MOD-OS-CZASU-PRZESLANEK.md
```

Konsumenci i punkty wpięcia:

| Skill | Punkt | Warunek | Stan wpięcia |
|---|---|---|---|
| `prawny-router-v3` | BRAMKA CHRONOLOGICZNA, przed KROK 4 | ≥2 daty **lub** ≥2 dokumenty wieloetapowe | ✅ WPIĘTE (3.34) |
| `chronologia-sprawy-v1` | OŚ-GATE, po komunikacie startowym, przed FAZĄ EKSTRAKCJI | ≥2 daty | ✅ WPIĘTE (1.8) |
| `analiza-sadowa-v6` | przebieg 1 (mapa faktów) | ≥2 daty | ⬛ NIEWPIĘTE — zakres pozostały flagi F-143 |
| `analizator-przepisow-v2` | Moduł 3 (analiza spełnienia przesłanek) | stan faktyczny z ≥2 datami | ⬛ NIEWPIĘTE — zakres pozostały flagi F-143 |

⛔ Wiersze `⬛ NIEWPIĘTE` opisują wpięcie **zamierzone, jeszcze niewykonane**.
Dopóki tam stoją, moduł NIE uruchomi się z tych dwóch skilli — nie zakładaj,
że uruchomi. Rozróżnienie jest jawne celowo: „moduł-widmo" (deklarowany
konsument bez faktycznego wywołania) to klasa błędu wykrywana testem T18.

Moduł jest tani: przy zerze trafień kosztuje jedną linię (§7, forma
skrócona). Dlatego wyzwalacz jest mechaniczny, a nie ocenny.
