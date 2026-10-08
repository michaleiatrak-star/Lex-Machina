# Upadłość — syndyk (powołanie, wynagrodzenie, sprawozdania, nadzór) i likwidacja masy (PrUp art. 156–178, 306–334)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535)
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Brzmienia z przypisów t.j.:** art. 178 ust. 5 — DU/2025/1170 (w życiu od 9.09.2025). Zmian po t.j. w tym zakresie brak.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article NUMER --verify-online`. Kwoty z „podstawy wynagrodzenia” wyliczaj z aktualnego obwieszczenia Prezesa GUS (III kw. roku poprzedniego) — nie z pamięci. Tryb konsumencki ma własne zasady (np. art. 491⁹, 491¹¹ᵃ) → `mod-PrUpad-konsument-workflow`.

---

## FAZA 0 — INTAKE

```
□ Postanowienie: syndyk (licencja / KRS spółki), data ogłoszenia, s.-k., rada wierzycieli
□ Ubezpieczenie OC syndyka i oświadczenie o braku przeszkód — złożone przy pierwszej czynności?
□ Czy wymagany kwalifikowany doradca restrukturyzacyjny (art. 157¹ ust. 3)?
□ Majątek: objęcie, przeszkody (komornik), ujawnienie w KW/rejestrach, zawiadomienia
□ Pracownicy, FGŚP; banki, SKOK, skrytki; poczta i e-doręczenia upadłego
□ Termin 30 dni na spis inwentarza i plan likwidacyjny (art. 306) — od daty ogłoszenia
□ Przedmiot sprzedaży: przedsiębiorstwo / ZCP / nieruchomość / ruchomości / wierzytelności /
  prawa / instrumenty finansowe; obciążenia; zastaw rejestrowy z umownym zaspokojeniem?
□ Składniki obronności (prawo wykupu MON)?
□ Wymagane zezwolenia rady (art. 206) i terminy rozpatrzenia (art. 308 ust. 2)
□ Wynagrodzenie: dane do pięciu składników (art. 162), etapy zaliczek (art. 164)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 156–157a | powołanie, ubezpieczenie, kwalifikacje, wybór, przeszkody, zakaz nabycia | A |
| 159–161 | zastępca, działanie w imieniu własnym, odpowiedzialność, rejestr wpływów i wydatków, pełnomocnicy | A |
| 162–167b | wynagrodzenie: składniki, wstępne, zaliczki, ostateczne, zwrot, kilku syndyków, VAT, śmierć | B |
| 168–169 | sprawozdania okresowe i ostateczne, zarzuty, obowiązki sprawozdawcze upadłego, koncesje | C |
| 169a–172 | upomnienie, grzywna, odwołanie, zmiana, wygaśnięcie, zastępca, zażalenie | C |
| 173–178 | objęcie majątku, komornik, ujawnienie, zawiadomienia, FGŚP, informacje o majątku | D |
| 306–315 | plan likwidacyjny, sprawozdania, terminy, sposoby likwidacji, prowadzenie przedsiębiorstwa, skutki sprzedaży, wyłączenie z masy | E |
| 316–324 | sprzedaż przedsiębiorstwa i nieruchomości, opis i oszacowanie, przetarg/aukcja, umowa, spółka pracownicza | F |
| 325–330a | ruchomości i zastaw rejestrowy | G |
| 331–334 | wierzytelności i prawa majątkowe, instrumenty finansowe | H |
| uchylone | 156¹, 158, 322, 323, 326 — nie są podstawą działania | — |

---

## A. Powołanie i status syndyka (art. 156–161)

- **Art. 156:** przy ogłoszeniu upadłości powołuje się syndyka (ust. 1); **najpóźniej przy pierwszej czynności** przed sądem lub s.-k. syndyk składa dowód **ubezpieczenia OC** za szkody związane z funkcją — koszt nie jest kosztem postępowania i nie podlega zwrotowi z masy (ust. 4). Ust. 2, 3, 5 uchylone.
- **Art. 157 — kto może być syndykiem:** osoba fizyczna z pełną zdolnością do czynności prawnych, **licencją doradcy restrukturyzacyjnego** i kontem doradcy w systemie (ust. 1); spółka handlowa, której wspólnicy odpowiadający bez ograniczenia albo członkowie zarządu reprezentujący mają licencję, z kontem w systemie (ust. 2–2a); licencja — odrębna ustawa (ust. 3); w postanowieniu numer licencji albo KRS spółki (ust. 5); gdy ustawa wymaga tytułu kwalifikowanego doradcy — spółka, której te osoby go mają (ust. 6).
- **Art. 157¹ — wybór:** sąd uwzględnia liczbę spraw, w których kandydat pełni funkcje (nadzorca, zarządca, syndyk), doświadczenie i dodatkowe kwalifikacje (ust. 1–2). **Kwalifikowany doradca restrukturyzacyjny obowiązkowo** (ust. 3) dla: przedsiębiorcy, który w jednym z 2 ostatnich lat obrotowych zatrudniał średniorocznie ≥ 250 pracowników lub miał obrót netto > równowartość 50 mln euro lub sumę aktywów > równowartość 43 mln euro; spółki o istotnym znaczeniu dla gospodarki (wykaz z ustawy o zasadach zarządzania mieniem państwowym); przedsiębiorcy realizującego zadania na rzecz Sił Zbrojnych (art. 648 ustawy o obronie Ojczyzny).
- **Art. 157a — przeszkody (ust. 1):** wierzyciel lub dłużnik upadłego; małżonek, wstępny, zstępny, rodzeństwo, powinowaty upadłego lub jego wierzyciela w tej samej linii lub stopniu, przysposobienie i małżonek takiej osoby, konkubent prowadzący wspólne gospodarstwo; obecny lub były pracownik, zleceniobiorca, usługodawca upadłego; obecny lub były członek organu, prokurent, pełnomocnik upadłego albo wspólnik/akcjonariusz > **5%** kapitału (PSA — akcji) dłużnika lub wierzyciela w **2 lata** przed wnioskiem; to samo wobec spółki powiązanej; nadzorca lub zarządca we wcześniejszej restrukturyzacji upadłego. Przeszkoda rodzinna trwa mimo ustania małżeństwa lub przysposobienia (ust. 3). **Zakaz nabycia** rzeczy i praw ze sprzedaży w tym postępowaniu przez syndyka i jego bliskich (ust. 2); odpowiednio inne umowy syndyka, chyba że s.-k. postanowi inaczej (ust. 2a). **Oświadczenie o braku przeszkód** — najpóźniej przy pierwszej czynności (ust. 4).
- **Art. 159:** s.-k. może powołać **zastępcę syndyka** (z urzędu lub na wniosek), zwłaszcza dla czynności w innym okręgu; określa jego zakres; przepisy o syndyku odpowiednio.
- **Art. 160:** syndyk działa **w imieniu własnym na rachunek upadłego**; nie odpowiada za zobowiązania zaciągnięte w sprawach masy; odpowiada za szkodę z nienależytego wykonywania obowiązków (standard art. 179 → `mod-PrUpad-organy-procedura`).
- **Art. 160a:** bieżąca rejestracja wpływów i wydatków masy w systemie teleinformatycznym.
- **Art. 161:** pełnomocnictwa do czynności prawnych i procesowe (sądy, administracja, sądy polubowne); za pełnomocników odpowiada jak za własne działanie.

## B. Wynagrodzenie syndyka (art. 162–167b)

**Podstawa wynagrodzenia (art. 162 ust. 3):** przeciętne miesięczne wynagrodzenie w sektorze przedsiębiorstw bez nagród z zysku w **III kwartale roku poprzedniego** (obwieszczenie Prezesa GUS). **Granice:** od **2-** do **260-krotności** podstawy; suma pięciu składników (ust. 1).

| Składnik (art. 162 ust. 2) | Progi → liczba podstaw |
|---|---|
| 1) suma wypłacona wierzycielom w planach podziału + koszty rozwiązania stosunków pracy z pracownikami zatrudnionymi w dniu ogłoszenia | do 100 000 zł → 1; 100 000,01–1 000 000 → 4; 1 000 000,01–10 000 000 → 10; 10 000 000,01–100 000 000 → 30; > 100 000 000 → 80 |
| 2) pracownicy zatrudnieni w dniu ogłoszenia | 1–10 → 0,5; 11–50 → 3; 51–200 → 10; 201–400 → 20; > 400 → 30 |
| 3) wierzyciele biorący udział | do 10 → 0,5; 11–100 → 2; 101–500 → 4; 501–1000 → 20; > 1000 → 40 |
| 4) czas od ogłoszenia do wykonania ostatecznego planu podziału | suma pkt 1–3 ≤ 8: ≤ 6 mies. → 4, > 6 do 12 → 2, > 12 → 0; suma > 8 do 40: ≤ 12 mies. → 8, > 12 do 24 → 4, > 24 → 0; suma > 40: ≤ 18 mies. → 40, > 18 do 36 → 20, > 36 → 0 |
| 5) uznaniowa | do **70** podstaw — trudność i efektywność (skomplikowanie, rozproszenie majątku, optymalizacja kosztów) |

**Przebieg:**
```
Wynagrodzenie WSTĘPNE (163): wniosek syndyka PO złożeniu planu likwidacyjnego; sąd ustala w 30 DNI
  od wniosku; we wniosku: przewidywane zaspokojenie w kategoriach, pracownicy, wierzyciele,
  przewidywany czas wg planu, skomplikowanie i stan majątku; sąd stosuje art. 162 i ocenia
  prawdopodobieństwo realizacji planu; zażalenie TYLKO upadłemu i syndykowi
ZALICZKI (164): łącznie do 75% wynagrodzenia wstępnego, w 4 ratach:
  10% — po uprawomocnieniu postanowienia o wynagrodzeniu wstępnym
  25% — po złożeniu listy wierzytelności
  15% — po złożeniu pierwszego planu podziału
  25% — po pełnej likwidacji masy
  wypłata na podstawie rachunku syndyka
Wynagrodzenie OSTATECZNE (165): wniosek w TYDZIEŃ od złożenia ostatecznego planu podziału albo
  doręczenia postanowienia o odwołaniu / zmianie / umorzeniu; spóźnienie → wynagrodzenie
  w wysokości pobranych zaliczek (sąd może przyznać mniej i nakazać zwrot); przywrócenie
  terminu do czasu postanowienia przy braku winy; we wniosku dane jak w art. 162 (wypłaty,
  pracownicy, wierzyciele zgłoszeni i z urzędu, czas, trudności, koszty)
Stanowiska (166): odpis do upadłego i rady; stanowisko w TYDZIEŃ; sąd orzeka niezwłocznie;
  pobranie po zatwierdzeniu ostatecznego planu podziału; przy obowiązku wydania majątku przed
  prawomocnością — depozyt różnicy (sąd może ograniczyć do kwoty z nieprawomocnego
  postanowienia); ostateczne < 75% wstępnego → zwrot nadwyżki zaliczek do masy; zażalenie
  (także syndyk); prawomocne postanowienie — tytuł egzekucyjny przeciw syndykowi i upadłemu
Odwołanie / zmiana (167): zaliczki zachowane do ustalenia ostatecznego; kilku syndyków —
  podział proporcjonalny do czasu, z możliwą korektą (wpływ na pkt 1, nakład pracy);
  umorzenie / uchylenie — wg okoliczności z art. 162, nakładu pracy i czasu
VAT (167a): wynagrodzenie i zaliczki + VAT, gdy syndyk jest podatnikiem
Śmierć (167b): roszczenie wchodzi do spadku; sąd orzeka z urzędu
```

## C. Sprawozdania i nadzór (art. 168–172)

- **Art. 168 — sprawozdania:** w terminach s.-k., **co najmniej co 3 miesiące**: zmiany stanu i składu masy (środki na początek i koniec), zmiany stanu wierzytelności i niezaspokojonych zobowiązań masy, wpływy i wydatki, stan kasy i rachunków, opis czynności z uzasadnieniem (ust. 1); zastępca — syndykowi (ust. 2). **Sprawozdanie ostateczne** po zakończeniu funkcji: łączny wpływ z likwidacji, stopień zaspokojenia w kategoriach, niezaspokojone zobowiązania masy, wpływy i wydatki, opis czynności, **miejsce archiwizacji dokumentów**; niezłożenie mimo wezwania w **tydzień** → s.-k. zawiadamia Ministra Sprawiedliwości (ust. 4). **Zarzuty** upadłego i wierzycieli do wydatków — **30 dni** (spóźnione lub z brakami formalnymi — bez rozpoznania, bez wezwania z art. 130 § 1 KPC) (ust. 5); s.-k. w **2 miesiące** od złożenia sprawozdania może odmówić uznania wydatku i nakazać zwrot do masy (ust. 5b); zatwierdza albo odmawia zatwierdzenia sprawozdania ostatecznego (czynności niezgodne z prawem, pokrzywdzenie, niewykonane obowiązki); prawomocna odmowa — do MS (ust. 5c); zażalenie, także syndyk; postanowienie o zwrocie — tytuł egzekucyjny (ust. 5d); przepisy o rachunkowości nie mają zastosowania (ust. 6). Ust. 3, 5a, 7, 8 uchylone.
- **Art. 169:** syndyk wykonuje **obowiązki sprawozdawcze upadłego** (bez odpowiedzialności za opóźnienia z winy upadłego — brak lub nierzetelna dokumentacja); obowiązki informacyjne spółki publicznej (ustawa o ofercie publicznej, MAR) ciążą na syndyku; upadły (albo kurator) niezwłocznie udostępnia dane; syndyk prowadzący przedsiębiorstwo może prowadzić działalność koncesjonowaną, chyba że odrębne ustawy inaczej.
- **Art. 169a:** s.-k. **upomina** syndyka; przy istotnym uchybieniu lub braku poprawy — **grzywna 1 000–30 000 zł** (stopień i waga uchybienia).
- **Art. 170 — odwołanie / zmiana / wygaśnięcie:** sąd **odwołuje** przy rażącym uchybieniu, braku poprawy mimo grzywny albo niezłożeniu dowodu OC lub oświadczenia o przeszkodach mimo wezwania w **tydzień** (ust. 1); wniosek może złożyć prokurator (ust. 1a); obowiązkowe wysłuchanie; zawieszenie i syndyk tymczasowy przy uprawdopodobnieniu podstaw (ust. 2); **zmiana** na wniosek syndyka albo uchwałą rady z art. 207a (ust. 3); **wygaśnięcie** — śmierć, utrata zdolności, braki w organach spółki-syndyka (ust. 4); zmiana przy cofnięciu lub zawieszeniu licencji (ust. 5); odpisy do MS (ust. 6); obwieszczenia (ust. 7).
- **Art. 171:** o zastępcy orzeka s.-k.; odwołanie z powodu zbędności — bez zażalenia (ust. 2 uchylony).
- **Art. 172:** zażalenie na odwołanie syndyka i na upomnienie / grzywnę — także syndykowi (bez art. 222 ust. 1 zd. 2); nowy syndyk po uprawomocnieniu odwołania, do tego czasu syndyk tymczasowy.

## D. Objęcie majątku i czynności początkowe (art. 173–178)

```
Niezwłocznie: objęcie, zarząd, zabezpieczenie przed zniszczeniem i zabraniem, przystąpienie
  do likwidacji (173)
Przeszkody ze strony upadłego → wprowadzenie w posiadanie przez KOMORNIKA na podstawie
  postanowienia o ogłoszeniu lub powołaniu, bez klauzuli wykonalności (174 ust. 1); koszty
  tymczasowo Skarb Państwa → koszt postępowania; przy upadłym niebędącym osobą fizyczną —
  na reprezentantach, którzy przeszkadzali (solidarnie), w razie nieściągalności z masy;
  orzeka s.-k.; ściągane jak opłaty sądowe (174 ust. 2–4)
Ujawnienie upadłości w KW i innych księgach / rejestrach (175)
Zawiadomienia (176): znani wierzyciele, komornicy, małżonek (z pouczeniem z art. 220 ust. 2, 5, 6);
  wierzycielom — pouczenia z art. 54a, 216a–216ab, 235–237, 239a–241, sąd dla zażalenia
  z art. 54a, dane syndyka, adres zgłoszeń dla wierzycieli z art. 216aa, termin zgłoszeń,
  rachunek na zryczałtowane koszty z art. 235; małżonkowi — pouczenie z art. 124–126;
  placówki pocztowe (przesyłki do syndyka; zawiadomienie upadłego w 7 DNI o przesyłkach
  niedotyczących masy; doręczenie upadłemu — z upływem 30 DNI od doręczenia syndykowi);
  minister ds. informatyzacji przy adresie e-doręczeń upadłego (korespondencja także do
  syndyka); banki i instytucje (skrytki, depozyty); wezwanie przewoźników, spedytorów,
  domów składowych do wydania towarów i niewykonywania poleceń upadłego
FGŚP (177): niezwłoczne wykonanie obowiązków z przepisów o ochronie roszczeń pracowniczych;
  środki z FGŚP nie wchodzą do masy i służą wyłącznie uprawnionym
Informacje (178): żądanie od organów administracji; wniosek o poszukiwanie majątku przez
  komornika w dostępnych mu bazach (bez art. 801 i 801¹ KPC); pisma wierzycieli z 216aa
  i 216ab — art. 165 § 1–3 KPC odpowiednio; doręczenia syndyka dla wierzycieli z 216aa —
  art. 131–139, 140–142 KPC odpowiednio; banki i SKOK po obwieszczeniu zawiadamiają syndyka
  o rachunkach, sejfach, skrytkach upadłego (ust. 5)
```

## E. Likwidacja — zasady ogólne (art. 306–315)

| Art. | Reguła |
|---|---|
| 306 | niezwłocznie spis inwentarza, oszacowanie, plan likwidacyjny; **spis z planem do s.-k. w 30 dni od ogłoszenia**; plan: proponowane sposoby sprzedaży (w szczególności przedsiębiorstwa), termin sprzedaży, preliminarz wydatków, ekonomiczne uzasadnienie dalszego prowadzenia działalności |
| 307 | sprawozdanie finansowe na dzień poprzedzający ogłoszenie, niezwłocznie do s.-k.; niemożność w terminie z art. 306 → **sprawozdanie ogólne w miesiąc od ogłoszenia** o stanie masy i możliwości zaspokojenia; obowiązek sporządzenia dokumentów trwa |
| 308 | likwidacja po spisie i sprawozdaniu finansowym albo po sprawozdaniu ogólnym; działania umożliwiające zakończenie likwidacji w **6 miesięcy** od ogłoszenia; s.-k. i rada rozpoznają wniosek o zgodę na sposób likwidacji w **2 tygodnie** od przedstawienia |
| 309 | s.-k. może wstrzymać likwidację do uprawomocnienia postanowienia o ogłoszeniu |
| 310 | przed likwidacją — sprzedaż z wolnej ręki **bez zezwolenia rady** ruchomości potrzebnych na koszty postępowania oraz szybko psujących się, tracących wartość lub zbyt kosztownych w przechowaniu; przy wstrzymaniu — w zakresie określonym przez s.-k. |
| 311 | sposoby: sprzedaż z wolnej ręki, przetarg lub aukcja (przedsiębiorstwo, ZCP, nieruchomości, ruchomości, wierzytelności, prawa) albo ściągnięcie wierzytelności i wykonanie praw (ust. 1); **prawo wykupu MON** dla składników obronności: zawiadomienie MON, opinia w **tydzień**, oświadczenie o wykupie w **30 dni**; cena z opinii biegłego, nie niższa niż kwota z likwidacji na zasadach ogólnych minus koszty; opinię opłaca Skarb Państwa; zażalenie MON, wierzycieli, upadłego; przy zastawie rejestrowym bez art. 327–328 — wydzielenie wartości wg art. 336 i 340 (ust. 1a–1ad); przejęcie przedmiotu zastawu rejestrowego / finansowego przez zastawnika, gdy umowa to przewiduje (ust. 2); odpowiednio zwierzęta, zgodnie z ochroną zwierząt (ust. 3); ust. 1b–1c uchylone |
| 312 | dalsze prowadzenie przedsiębiorstwa — gdy możliwy układ albo sprzedaż w całości / ZCP; obowiązek utrzymania w niepogorszonym stanie; **zakaz** przy obowiązku zwrotu pomocy publicznej, chyba że rada zezwoli na zwrot pomocy niezgodnej z prawem i dalsze prowadzenie przy uprawdopodobnieniu lepszego zaspokojenia (ponad 3 miesiące — zezwolenie rady z art. 206 ust. 1 pkt 1) |
| 313 | sprzedaż w upadłości ma **skutki sprzedaży egzekucyjnej**; nabywca nie odpowiada za zobowiązania podatkowe upadłego, także powstałe po ogłoszeniu (ust. 1); nieruchomość: wygasają prawa i roszczenia osobiste wpisane do KW albo zgłoszone syndykowi w terminie z art. 51 ust. 1 pkt 5 — uprawniony zaspokaja wartość z ceny; skutek z chwilą umowy; wykreślenie praw — na podstawie prawomocnego planu podziału, hipoteki — na podstawie umowy (ust. 2); **pozostają** bez potrącenia z ceny: służebność drogi koniecznej, przesyłu, z przekroczenia granicy; użytkowanie i dożywocie — przy pierwszeństwie przed hipotekami, braku hipotek lub pełnym pokryciu (wtedy wartość zaliczana na cenę) (ust. 3); s.-k. może utrzymać służebność gruntową niepokrytą w cenie, gdy konieczna i nie obniża istotnie wartości — wniosek najpóźniej w zarzutach do planu podziału; zażalenie (ust. 4); odpowiednio użytkowanie wieczyste, spółdzielcze własnościowe prawo do lokalu, statek morski (ust. 5); udział ułamkowy — art. 1004, 1005, 1007, 1009, 1012, 1013 KPC (ust. 6) |
| 314 | sprzedaż przedsiębiorstwa (ZCP) z obciążonymi składnikami — wartość obciążonych składników ujawnia się w umowie, cenę dzieli się wg art. 336 i 340 |
| 315 | s.-k. może **wyłączyć z masy** składniki (także nieruchomość lub udział), których nie można zbyć zgodnie z ustawą, gdy ich utrzymanie w masie jest niekorzystne z powodu kosztów; zażalenie |

## F. Sprzedaż przedsiębiorstwa i nieruchomości (art. 316–324)

```
Pierwszeństwo sprzedaży przedsiębiorstwa jako CAŁOŚCI, chyba że niemożliwe (316 ust. 1)
Za zgodą s.-k. — dzierżawa na czas określony z prawem pierwokupu, gdy uzasadniają to względy
  ekonomiczne (316 ust. 2); obwieszczenie o sprzedaży (ust. 4); ust. 3 uchylony
Nabywca przedsiębiorstwa (317): przechodzą koncesje, zezwolenia, licencje, ulgi (chyba że odrębne
  ustawy inaczej); oznaczenie z nazwiskiem upadłego — tylko za jego zgodą; nabycie WOLNE OD
  OBCIĄŻEŃ i bez odpowiedzialności za zobowiązania upadłego — obciążenia wygasają poza
  wymienionymi w art. 313 ust. 3–4; art. 23¹ KP odpowiednio; po zawiadomieniu sądu / sądu
  polubownego / organu nabywca wstępuje z mocy prawa do postępowań dotyczących przedsiębiorstwa
  lub składników, bez zgody przeciwnika
ZCP, gdy całość niemożliwa (318 ust. 1); odpowiednio zbiór rzeczy lub praw obciążony zastawem
  rejestrowym — podział wg art. 336 i 340 (ust. 2)
Opis i oszacowanie przedsiębiorstwa (319): biegły wybrany przez syndyka; przedmiot działalności,
  nieruchomości (obszar, KW), środki trwałe, prawa, obciążenia; wartość całości i ZCP osobno;
  przy obciążeniach — które pozostają, ich wartość, wartość składników obciążonych i ich
  udział w wartości przedsiębiorstwa; ZARZUTY w TYDZIEŃ od obwieszczenia o przekazaniu
  opisu s.-k.; wątpliwości → nowy biegły wskazany przez s.-k.; odpowiednio przewłaszczenie
  na zabezpieczenie sprzedawane w ramach przedsiębiorstwa
Przetarg / aukcja (320) — KC odpowiednio, z tym że: warunki zatwierdza s.-k.; obwieszczenie
  co najmniej 2 TYGODNIE przed posiedzeniem (przedsiębiorstwo spółki publicznej — 6 TYGODNI);
  posiedzenie jawne; prowadzi syndyk pod nadzorem s.-k.; wybór oferenta przez syndyka
  wymaga zatwierdzenia s.-k. (możliwe na niejawnym; odroczenie o tydzień — wtedy obwieszczenie);
  zażalenie na zatwierdzenie; przy nieruchomościach, użytkowaniu wieczystym, spółdzielczym
  prawie, statku — art. 317 ust. 3 i 319 odpowiednio
Umowa (321): w terminie s.-k., maks. 4 MIESIĄCE od zatwierdzenia wyboru; niezawarcie z winy
  oferenta → nowy przetarg / aukcja bez jego udziału
Spółka pracownicza (324): przy zezwoleniu rady na sprzedaż z wolnej ręki — pierwszeństwo spółki
  z udziałem ponad połowy pracowników upadłego będącego spółką handlową z udziałem Skarbu Państwa;
  syndyk najpierw jej składa ofertę
(322–323 uchylone)
```

## G. Ruchomości i zastaw rejestrowy (art. 325–330a)

- **Art. 325:** do sprzedaży ruchomości odpowiednio art. 320–321, jeżeli dział III nie stanowi inaczej (art. 326 uchylony).
- **Art. 327:** zastawnik zastawu rejestrowego może zaspokoić się przez **przejęcie** albo **zbycie w trybie art. 24 ustawy o zastawie rejestrowym**, jeżeli umowa to przewiduje (ust. 1); rzecz u zastawnika lub osoby trzeciej — zawiadomienie syndyka; s.-k. może wyznaczyć termin; po bezczynności rzecz wydaje się syndykowi, który sprzedaje, a sumę dzieli wg art. 336 i 340 (ust. 2); postanowienie o wydaniu wykonalne bez klauzuli (ust. 3).
- **Art. 328:** rzecz u syndyka i prawo przejęcia na własność → s.-k. wyznacza termin **nie krótszy niż miesiąc**, potem sprzedaż wg ustawy (ust. 1); rzecz u syndyka i umowa przewiduje tryb art. 24 — sprzedaje syndyk wg PrUp (ust. 2).
- **Art. 329:** zastawnik rozlicza się z syndykiem wg ustawy o zastawie rejestrowym.
- **Art. 330:** przedmiot zastawu jako składnik przedsiębiorstwa, gdy sprzedaż łączna korzystniejsza — art. 327–328 nie stosuje się; wydzielenie wartości z ceny i zaspokojenie zastawnika wg art. 336 i 340.
- **Art. 330a:** ruchomości niezbywalne zgodnie z ustawą — wierzyciel może je przejąć za cenę **nie niższą niż połowa ceny oszacowania**; pierwszeństwo — wierzyciel zabezpieczony zastawem / zastawem rejestrowym / skarbowym na tej rzeczy, potem najwyższa oferta; oświadczenie skuteczne tylko z jednoczesną wpłatą całej ceny; własność z chwilą zawiadomienia przez syndyka; zaliczenie wierzytelności na cenę, gdy fundusze masy wystarczą na wszystkich z wyższej i równej kategorii oraz zobowiązania z art. 230; art. 317 ust. 3 odpowiednio.

## H. Wierzytelności i prawa majątkowe (art. 331–334)

- **Art. 331:** likwidacja wierzytelności przez **zbycie albo ściągnięcie**; wybór poprzedza ocena, który sposób da największe zaspokojenie przy uwzględnieniu kosztów, ryzyka niepowodzenia i zobowiązań z art. 230 wynikających z przedłużenia postępowania.
- **Art. 332:** prawa majątkowe — wykonanie albo zbycie.
- **Art. 333:** obciążone zastawem rejestrowym — art. 327–330 odpowiednio; zastawem finansowym — art. 327–330 i ustawa o niektórych zabezpieczeniach finansowych.
- **Art. 334:** do sprzedaży wierzytelności i praw — art. 315, 320, 321 odpowiednio; rada może zgodzić się na inną formę poszukiwania nabywcy z warunkami sprzedaży; ogłoszenie o sprzedaży papierów wartościowych przez syndyka nie jest ofertą publiczną (rozp. 2017/1129), bez art. 19 ust. 1 pkt 2 ustawy o obrocie; instrumenty na rynku regulowanym — s.-k. może zezwolić na sprzedaż przez firmę inwestycyjną, wyznaczyć rynek i cenę minimalną; art. 317 ust. 3 odpowiednio.

---

## TERMINY — ZESTAWIENIE

| Termin | Zdarzenie początkowe | Podstawa |
|---|---|---|
| pierwsza czynność | dowód OC i oświadczenie o braku przeszkód | art. 156 ust. 4, 157a ust. 4 |
| 2 lata przed wnioskiem | udział > 5% — przeszkoda | art. 157a ust. 1 pkt 3–4 |
| 30 dni | wniosek o wynagrodzenie wstępne — ustalenie przez sąd | art. 163 ust. 1 |
| tydzień | złożenie ostatecznego planu podziału / doręczenie odwołania — wniosek o wynagrodzenie ostateczne | art. 165 ust. 1 |
| tydzień | stanowisko upadłego i rady co do wynagrodzenia | art. 166 ust. 1 |
| co 3 mies. | sprawozdanie okresowe | art. 168 ust. 1 |
| 30 dni | zarzuty do wydatków w sprawozdaniu | art. 168 ust. 5 |
| 2 mies. | złożenie sprawozdania — odmowa uznania wydatku | art. 168 ust. 5b |
| tydzień | wezwanie do złożenia OC / oświadczenia / sprawozdania ostatecznego | art. 168 ust. 4, 170 ust. 1 |
| 7 dni / 30 dni | zawiadomienie upadłego o przesyłkach / fikcja doręczenia | art. 176 ust. 2 |
| 30 dni | ogłoszenie — spis inwentarza i plan likwidacyjny | art. 306 |
| miesiąc | ogłoszenie — sprawozdanie ogólne | art. 307 ust. 2 |
| 6 mies. | ogłoszenie — cel zakończenia likwidacji | art. 308 ust. 2 |
| 2 tyg. | wniosek syndyka — decyzja s.-k. i rady o sposobie likwidacji | art. 308 ust. 2 |
| tydzień / 30 dni | zawiadomienie MON — opinia / oświadczenie o wykupie | art. 311 ust. 1aa |
| tydzień | obwieszczenie o przekazaniu opisu i oszacowania — zarzuty | art. 319 ust. 5 |
| 2 / 6 tyg. | obwieszczenie przetargu / aukcji (spółka publiczna) | art. 320 ust. 1 pkt 2 |
| 4 mies. | zatwierdzenie oferenta — maks. termin umowy | art. 321 ust. 1 |
| ≥ miesiąc | termin dla zastawnika na przejęcie | art. 328 ust. 1 |

## PUŁAPKI

- Koszt OC syndyka nie obciąża masy (156 ust. 4).
- Zakaz nabycia mienia ze sprzedaży obejmuje syndyka i jego bliskich także po zakończeniu funkcji w tym postępowaniu (157a ust. 2).
- Zaliczki nie zależą od upływu czasu, tylko od etapów (164); suma zaliczek maks. 75% wstępnego.
- Spóźniony wniosek o wynagrodzenie ostateczne = wynagrodzenie równe zaliczkom (165 ust. 1).
- „Miesiąc” (307 ust. 2) ≠ „30 dni” (306) — licz wg jednostki z przepisu.
- 6 miesięcy z art. 308 ust. 2 to obowiązek starań, nie termin zawity nieważności sprzedaży.
- Nabywca przedsiębiorstwa nie odpowiada za zobowiązania upadłego, ale służebności z art. 313 ust. 3–4 trwają (317 ust. 2).
- Zastaw rejestrowy z umownym przejęciem nie wyłącza sprzedaży łącznej z przedsiębiorstwem, gdy jest korzystniejsza (330).
- Środki FGŚP nie są funduszami masy (177 ust. 2).
- Uchylone 156¹, 158, 322, 323, 326; wcześniejsza wersja modułu sugerowała, że „wiele jednostek 179–188” jest uchylonych — art. 179 i 185–188 obowiązują (→ `mod-PrUpad-organy-procedura`).

## POWIĄZANIA

- Sąd, s.-k., rada (art. 206, 207a, 210, 213), standard art. 179 → `mod-PrUpad-organy-procedura`
- Masa, wyłączenia, spis (art. 61–69), umowy → `mod-PrUpad-skutki-masa-bezskutecznosc`
- Pre-pack (art. 56a–56h) → `mod-PrUpad-wniosek-ogloszenie`
- Plan podziału (art. 335–360, w tym 336 i 340) → `mod-PrUpad-podzial-335-360`
- Układ i wstrzymanie likwidacji → `mod-PrUpad-uklad-likwidacja-zakonczenie`
- Konsument (491⁹, 491¹¹ᵃ) → `mod-PrUpad-konsument-workflow`
- Doradca restrukturyzacyjny (licencja) → `mod-ustawa-doradca-restrukturyzacyjny-zawod`

## WYNIK

Kontrola powołania (licencja, kwalifikacja, OC, przeszkody), kalkulator wynagrodzenia (pięć składników, wstępne, zaliczki, ostateczne), kalendarz sprawozdań i zarzutów, lista czynności początkowych (173–178), plan likwidacyjny z preliminarzem, ścieżka sprzedaży per składnik (sposób, zgody, obwieszczenia, terminy, skutki dla obciążeń, podział ceny).
