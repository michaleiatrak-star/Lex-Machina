# mod-BK-niepelnosprawnosc-pfron-swiadczenie-wspierajace — NIEPEŁNOSPRAWNOŚĆ — PZON/WZON/PFRON/świadczenie wspierające

**Status:** moduł klasy kancelaryjnej — poziom DR-03

Status: moduł prawa polskiego klasy wzorcowej, uzupełniony do standardu prawa pracy i prawa karnego.
Data wdrożenia: 2026-05-28.
Zakres: orzeczenia o niepełnosprawności, stopnie, symbole, wsparcie, PFRON, dostępność.

## Wspólne moduły obowiązkowe

Zawsze stosuj razem z:

- `shared/MODULE-STANDARD-POLISH-LAW.md`,
- `shared/ISAP-AUDIT-PROTOCOL.md`,
- `shared/TEMPORAL-LAW-CHECK.md`,
- `shared/LEGAL-LIFECYCLE-MANAGEMENT.md`,
- `shared/LEGAL-QUALITY-GATE.md`,
- `shared/RISK-ASSESSMENT.md`,
- `shared/QUALITY-CHECK.md`.

## 1. Zakaz pracy z pamięci

Dziennik Ustaw, status aktu, data wejścia w życie, brzmienie przepisu i przepisy przejściowe muszą być sprawdzone w ISAP na dzień użycia. Jeżeli ISAP nie daje bezpośredniego dostępu do tekstu aktu albo aktu wykonawczego, wolno użyć LEX/Legalis wyłącznie pomocniczo i oznaczyć źródło w raporcie. Nie wolno rekonstruować brzmienia przepisu z pamięci.

## 2. Intake obowiązkowy

Ustal:

1. typ sprawy i tryb;
2. organ/sąd/właściwy samorząd;
3. daty zdarzeń, decyzji, doręczeń i terminów;
4. stan prawny na dzień zdarzenia, decyzji i wniesienia środka;
5. interes prawny i legitymację;
6. rozstrzygnięcie zaskarżane lub czynność kwestionowaną;
7. dowody podstawowe i brakujące;
8. możliwe równoległe tryby: cywilny, karny, administracyjny, dyscyplinarny, pracowniczy.

## 3. Warstwa normatywna CORE

Dla każdego używanego przepisu wygeneruj tabelę:

| Akt | Dz.U./tekst jednolity | Przepis | Brzmienie z ISAP/LEX/Legalis | Znaczenie | Skutek procesowy |
|---|---|---|---|---|---|
| do uzupełnienia po kontroli źródła | do uzupełnienia | art. ... | cytuj tylko po weryfikacji | przesłanka/tryb/termin | zwrot/oddalenie/uchylenie/odpowiedzialność |

Nie wpisuj literalnego brzmienia, jeżeli nie zostało pobrane z aktualnego źródła urzędowego albo wskazanego systemu prawniczego.

## 4. Procedura

Wybierz właściwy tor:

- wniosek pierwotny;
- odwołanie/zażalenie/sprzeciw;
- skarga do WSA;
- środek do sądu powszechnego;
- skarga kasacyjna/kasacja;
- skarga dyscyplinarna;
- wniosek dowodowy;
- skarga administracyjna;
- skarga na przewlekłość;
- zawiadomienie karne albo deliktowe, jeżeli zachowanie przekracza zwykłe naruszenie proceduralne.

## 5. Dowody

Każda teza musi mieć przypisany dowód. Obowiązkowa tabela:

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| przesłanka ustawowa | dokument/zeznanie/opinia | akta/organ/sąd | wysoka/średnia/niska | co nieudowodnione | uzupełnić/wnioskować/atakować |

## 6. Biegli i opinie

Jeżeli sprawa zawiera element specjalistyczny, zastosuj `shared/EXPERT-OPINION-AUDIT.md`.

W szczególności sprawdź:

- zakres tezy dowodowej;
- kwalifikacje biegłego;
- kompletność dokumentacji;
- metodologię;
- odpowiedź na pytania sądu/organu;
- funkcjonalne skutki ustaleń;
- możliwość opinii uzupełniającej albo innego biegłego.

## 7. Strategia

Zawsze wygeneruj:

1. najkorzystniejszą konstrukcję roszczenia/wniosku/środka;
2. argument podstawowy;
3. argument ewentualny;
4. najsilniejszy kontrargument organu/przeciwnika;
5. odpowiedź na kontrargument;
6. ryzyka formalne;
7. ryzyka dowodowe;
8. ryzyka kosztowe;
9. rekomendowane następne pismo.

## 8. Orzecznictwo

Nie twórz fikcyjnych sygnatur. Orzecznictwo pobieraj z oficjalnych baz sądów, SN, NSA/CBOSA albo wiarygodnych systemów prawniczych. Dla każdego orzeczenia wskaż:

- sąd;
- datę;
- sygnaturę;
- tezę użyteczną;
- relację do stanu faktycznego;
- aktualność linii orzeczniczej;
- czy jest to argument główny, pomocniczy, czy ryzykowny.

## 9. Quality gate

Nie kończ analizy bez odpowiedzi:

- czy sprawdzono aktualność aktu;
- czy stan prawny jest właściwy temporalnie;
- czy wskazano pełną podstawę prawną;
- czy znane jest brzmienie przepisu z aktualnego źródła;
- czy każda przesłanka ma dowód;
- czy istnieje termin i czy nie upłynął;
- czy dobrano właściwy tryb;
- czy wnioski są procesowo wykonalne.

## 10. Output

Standard odpowiedzi/pisma:

1. stan faktyczny;
2. stan prawny i źródła;
3. przesłanki;
4. dowody;
5. zarzuty;
6. analiza ryzyk;
7. strategia;
8. wnioski;
9. załączniki;
10. kontrola ISAP/temporalności.

## 11. Specjalizacja niepełnosprawność

Stosuj bezwzględnie `shared/DISABILITY-FUNCTIONAL-ASSESSMENT.md`.

### Akty do kontroli ISAP

- ustawa o rehabilitacji zawodowej i społecznej oraz zatrudnianiu osób niepełnosprawnych;
- rozporządzenie w sprawie orzekania o niepełnosprawności i stopniu niepełnosprawności;
- ustawa o świadczeniu wspierającym;
- akty PFRON;
- ustawa o zapewnianiu dostępności osobom ze szczególnymi potrzebami;
- KPA, jeżeli procedura administracyjna;
- KPC, jeżeli odwołanie do sądu pracy i ubezpieczeń społecznych.

### Matryca funkcjonalna

| Obszar | Ustalenia | Dowody | Znaczenie |
|---|---|---|---|
| poruszanie się | samodzielnie / z pomocą / niemożliwe | dokumentacja, opinia, świadkowie | stopień wsparcia |
| komunikacja | wzrok, słuch, mowa, AAC | orzeczenia, badania, zaświadczenia | dostępność, wsparcie |
| samoobsługa | higiena, jedzenie, leki | dokumentacja, zeznania | samodzielna egzystencja |
| praca/nauka | realne ograniczenia | historia pracy, opinie | zdolność do pracy |
| życie społeczne | bariery, izolacja | świadkowie, dokumenty | rehabilitacja społeczna |

### Typowe błędy orzeczeń

- lakoniczne uzasadnienie;
- brak analizy funkcjonalnej;
- pominięcie schorzeń współistniejących;
- nieuwzględnienie stałości schorzenia;
- pominięcie dokumentacji specjalistycznej;
- pominięcie potrzeby pomocy osoby trzeciej.


---

## QUALITY GATE

- [ ] Aktualny tekst t.j. aktu zweryfikowany w ISAP?
- [ ] Stan prawny właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Każda przesłanka ma przypisany dowód?
- [ ] Termin nie upłynął?
- [ ] Właściwy organ / sąd wskazany?
- [ ] Ryzyka formalne i dowodowe ocenione?
- [ ] Brzmienie przepisów ze źródeł, nie z pamięci modelu?

## OUTPUT

1. Stan faktyczny; 2. Stan prawny i źródła; 3. Kwalifikacja trybu i właściwość;
4. Terminy (obliczone, daty graniczne); 5. Przesłanki (spełnione / wątpliwe / niespełnione);
6. Matryca dowodowa (teza → dowód → siła → luka); 7. Zarzuty i kontrargumenty;
8. Analiza ryzyk; 9. Strategia (podstawowy + ewentualny); 10. Rekomendacja;
11. Kontrola ISAP/temporalności.

---

## ANEKS — ŚWIADCZENIE UZUPEŁNIAJĄCE (500+ dla niepełnosprawnych)

**Akt:** Ustawa z 31.07.2019 r. o świadczeniu uzupełniającym — Dz.U. 2025 poz. 913 t.j.
**⚠️ Kwoty zmieniane rokrocznie — ZAWSZE weryfikuj przed cytowaniem:**
```
web_search: "świadczenie uzupełniające 500+ kwota kryterium dochodowe 2025 2026 ZUS"
```

### Warunki nabycia prawa

```
□ Ukończone 18 lat
□ Orzeczenie o niezdolności do samodzielnej egzystencji
  LUB o całkowitej niezdolności do pracy i niezdolności do samodzielnej egzystencji
□ Łączna wysokość świadczeń emerytalno-rentowych ≤ kryterium dochodowego
  (kryterium: weryfikuj aktualną kwotę przez web_search — zmienia się rokrocznie)
```

### Kwoty i mechanizm redukcji

```
Świadczenie uzupełniające: max 500 zł miesięcznie
Zasada złotówka za złotówkę: przekroczenie kryterium → redukcja o kwotę przekroczenia
Organ: ZUS (ubezpieczeni) / KRUS (rolnicy)
Wniosek: formularz ZUS SU lub KRUS SU
Odwołanie: do SO wydziału pracy i ubezpieczeń społecznych (przez ZUS) — termin 1 miesiąc
```

---

## ANEKS — LIKWIDACJA WYPOŻYCZALNI PFRON (dodane 2026-07-20)

> ⛔ TEMAT BARDZO ŚWIEŻY I W TOKU — sytuacja rozwija się w czasie
> rzeczywistym (ostatnie źródła sprzed ~4-7 dni w chwili tej sesji).
> ZWERYFIKUJ AKTUALNY STAN przed każdym użyciem — poniższy opis to
> ZDJĘCIE SYTUACJI na 20.07.2026, NIE ostateczny stan prawny.

### 1. Historia programu — kontekst niezbędny do zrozumienia obecnej sytuacji

```
□ Program "Wypożyczalnia technologii wspomagających dla osób
  z niepełnosprawnością" — zatwierdzony przez Radę Nadzorczą PFRON na
  początku lutego 2023 r., URUCHOMIONY we wrześniu 2023 r.
□ CEL: centralna wypożyczalnia NOWOCZESNEGO, DROGIEGO sprzętu/
  oprogramowania wspomagającego, bezpłatnie udostępnianego osobom
  z niepełnosprawnością, których NIE STAĆ na własny zakup
□ LOGISTYKA: Rządowa Agencja Rezerw Strategicznych (RARS) zarządzała
  magazynem NA ZLECENIE PFRON; PFRON prowadził nabór/weryfikację
  wniosków; Poczta Polska — dostarczanie sprzętu
□ ⭐ FIASKO: wg informacji przedstawionej w Sejmie (posiedzenie
  Podkomisji stałej ds. osób z niepełnosprawnościami) — 73% sprzętu
  zakupionego za ~96 MLN ZŁ NIGDY nie trafiło do użytkowników —
  ponad 80% z tego sprzętu, wskutek NIEŁADOWANIA akumulatorów podczas
  składowania, nie nadaje się już do użytku BEZ ich wymiany
□ SPRAWĘ BADAJĄ DWIE PROKURATURY (⚠️ status/wynik postępowań
  nieznany w tej sesji — sprawdź aktualności)
□ Program w DOTYCHCZASOWEJ formule FORMALNIE zamknięty 31.12.2025 r.
  — od 1.01.2026 r. BRAK możliwości składania nowych wniosków
```

### 2. Problem prawny uniemożliwiający proste rozwiązanie

```
⭐ Sprzęt zakupiony za PRAWIE 100 MLN ZŁ stanowi REZERWĘ STRATEGICZNĄ i
FORMALNIE należy do SKARBU PAŃSTWA — PFRON NIE MÓGŁ go po prostu
PRZEKAZAĆ osobom z niepełnosprawnością bez PODSTAWY PRAWNEJ do
NIEODPŁATNEGO przekazania mienia będącego rezerwą strategiczną —
STĄD konieczność UCHWALENIA nowych przepisów przez Sejm
```

### 3. ⭐⭐ "REAKTYWACJA LIKWIDACYJNA" — mechanizm od 10.06.2026 r.

```
□ 10.06.2026 r. PFRON PONOWNIE URUCHOMIŁ wypożyczalnię — MIMO że
  program formalnie pozostaje W TRAKCIE LIKWIDACJI (stąd potoczne
  określenie "reaktywacja likwidacyjna" — sprzeczne pozornie, ale
  celowe: TO WCIĄŻ jest "działalność likwidacyjna", tylko inną drogą)
□ LOGIKA MECHANIZMU: wypożyczalnia WYPOŻYCZY zalegający w magazynie
  sprzęt (generujący koszty przechowania) osobom z niepełnosprawnością
  → RÓWNOLEGLE w Sejmie procedowana jest nowelizacja ustawy o
  rehabilitacji zawodowej i społecznej (komisyjny projekt, druk nr
  2701), która ma dać PFRON podstawę prawną do NIEODPŁATNEGO przekazania
  tego sprzętu NA WŁASNOŚĆ osobom, które go WYPOŻYCZYŁY → po uchwaleniu
  przepisów: umowy WYPOŻYCZENIA zostaną zastąpione umowami PRZEKAZANIA
  NA WŁASNOŚĆ

□ SKALA: 4000 jednostek sprzętu/oprogramowania (z możliwością
  zwiększenia/zmniejszenia o 20%) + DODATKOWO ok. 1700 jednostek już
  WCZEŚNIEJ wypożyczonych (przed 2025 r.)

□ WARUNEK dla nowych beneficjentów: "zainwestowanie" w KAUCJĘ w
  wysokości 2% wartości sprzętu, na okres POTRZEBNY do uchwalenia
  przepisów likwidacyjnych przez Sejm — kaucja jest ZWROTNA (po
  przekazaniu sprzętu na własność, kaucja wraca do osoby
  z niepełnosprawnością)

□ WARUNEK KWALIFIKACYJNY: osoba z niepełnosprawnością MOŻE wypożyczyć
  sprzęt, POD WARUNKIEM że w ciągu OSTATNICH 12 MIESIĘCY NIE
  OTRZYMAŁA ze środków PFRON ANI NFZ dofinansowania na zakup TEGO
  SAMEGO sprzętu (zakaz podwójnego finansowania)

□ BRAK SERWISU NAPRAWCZEGO w ramach programu: przy usterce/awarii —
  osoba MOŻE oddać sprzęt do naprawy NA WŁASNY KOSZT, PO uprzedniej
  ZGODZIE PFRON — LUB zrezygnować z dalszego wypożyczania

□ DLA OSÓB, KTÓRE JUŻ WYPOŻYCZYŁY sprzęt PRZED 2025 r.: zamiast
  zwracać sprzęt (pierwotny termin: koniec września 2026 r.), MOGĄ
  ANEKSOWAĆ umowy DO KOŃCA 2028 r. i w tym okresie PRZEJĄĆ sprzęt na
  własność, analogicznie do nowych beneficjentów

□ STATUS NOWELIZACJI (druk 2701): ⚠️ NA DZIEŃ TEJ SESJI (20.07.2026)
  — projekt WCIĄŻ PROCEDOWANY w Sejmie, NIE uchwalony — WEDŁUG
  zapowiedzi ma zostać uchwalony DO KOŃCA 2027 r. (⚠️ inne źródło
  wskazuje termin "do końca 2026 r." dla WYGASZENIA programu — MOŻLIWA
  ROZBIEŻNOŚĆ dat między "wygaszeniem" a "uchwaleniem przepisów
  likwidacyjnych" — te to DWA RÓŻNE terminy, NIE mylić)

□ WYPOŻYCZANIE W PIERWSZEJ KOLEJNOŚCI: wózki o napędzie RĘCZNYM
  (rozważano też uruchomienie wypożyczania wózków/skuterów/napędów
  ELEKTRYCZNYCH — ⚠️ status tego rozszerzenia niepotwierdzony w tej
  sesji)
```

### 4. Checklist praktyczny

```
□ Czy klient MIAŁ już wypożyczony sprzęt PRZED 2025 r. — sprawdź czy
  zaanektował umowę do 2028 r. zamiast zwracać sprzęt we wrześniu 2026 r.
□ Czy klient chce SKORZYSTAĆ z reaktywowanej wypożyczalni od 10.06.2026 —
  sprawdź warunek 12-miesięcznego braku wcześniejszego dofinansowania
  na TEN SAM sprzęt
□ Czy klient rozumie mechanizm KAUCJI 2% jako ZWROTNEJ, nie opłaty
  bezzwrotnej
□ Czy klient ma ZEPSUTY sprzęt z wcześniejszej partii (ryzyko
  akumulatorów) — ustal czy to jego sprzęt jest objęty ryzykiem
  wskazanym w informacji sejmowej (80% niesprawnych bez wymiany baterii)
□ ZAWSZE zweryfikuj AKTUALNY status legislacyjny druku 2701 PRZED
  doradzaniem klientowi w oparciu o mechanizm "reaktywacji
  likwidacyjnej" — sytuacja jest W TOKU i może się zmienić
```

### 5. Literatura i źródła (zweryfikowane online 2026-07-20)

- infor.pl (2×) — mechanizm reaktywacji likwidacyjnej, warunki kaucji,
  przedłużenie do 2028 r., "7 reguł" programu.
- rp.pl (2×) — reaktywacja 10.06.2026, warunek 12 miesięcy, brak
  serwisu naprawczego.
- bip.brpo.gov.pl — interwencje RPO, historia sporu, liczba wniosków
  (5470 na dzień aktualizacji), postępowania prokuratorskie.
- prawo.pl — "wielkie fiasko", zamknięcie "po cichu", stan na
  1.01.2026.
- gazetaprawna.pl — wystąpienie wiceprezes PFRON w Sejmie (73%
  niewykorzystanego sprzętu, 96 mln zł, 80% niesprawnych baterii).
- lex.media.pl — szczegóły projektu (4000 jednostek + ok. 1700
  wcześniej wypożyczonych).
- kadry.infor.pl — kontekst prawny (rezerwa strategiczna, Skarb
  Państwa, druk sejmowy 2701).
