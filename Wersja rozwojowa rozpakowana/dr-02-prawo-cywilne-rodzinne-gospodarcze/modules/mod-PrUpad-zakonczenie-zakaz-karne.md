# Upadłość — umorzenie, zakończenie, oddłużenie po upadłości przedsiębiorcy, uchylenie, zakaz działalności, karne i przejściowe (PrUp art. 361–377, 522–523, 536–546)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone i pominięte oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535)
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article NUMER --verify-online`; reżim temporalny — `references/insolvency/wersje-i-przepisy-przejsciowe.md`. Moduł streszcza — nie zastępuje brzmienia.
**Sprawy karne:** dr-03 + kwalifikator karnomaterialny.

---

## FAZA 0 — INTAKE

```
□ Jak kończy się postępowanie: umorzenie (361) / zakończenie po ostatecznym planie podziału
  albo zaspokojeniu wszystkich (368) / uchylenie po odrzuceniu lub oddaleniu wniosku (371)?
□ Upadły — osoba fizyczna (przedsiębiorca w trybie ogólnym)? → oddłużenie z art. 369–370f
  (konsument w trybie 491¹ i n. → mod-PrUpad-konsument-workflow)
□ Data obwieszczenia postanowienia o zakończeniu → 30 dni na wniosek o plan spłaty
□ Czy upadły celowo doprowadził do niewypłacalności? Czy w ostatnich 10 latach (przed wnioskiem)
  umorzono mu zobowiązania w upadłości?
□ Sytuacja osobista: trwała / przemijająca niezdolność do spłat?
□ Zakaz działalności: kto (upadły, reprezentant, faktycznie zarządzający), która przesłanka,
  kiedy ogłoszono / oddalono / zakończono — czy nie upłynął termin z art. 377?
□ Czyny z art. 522–523 (nieprawdziwe dane we wniosku, niewydanie majątku / dokumentów)
□ Upadłość ogłoszona przed 1.10.2003? (art. 536–540)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 361–367 | umorzenie i jego skutki (wydanie majątku, dokumenty, likwidacja, procesy) | A |
| 368 | zakończenie postępowania | A |
| 369–370f | oddłużenie upadłego osoby fizycznej: plan spłaty, umorzenie bez planu, warunkowe umorzenie | B |
| 371–372 | uchylenie postępowania; trwałość zmian stosunków prawnych | C |
| 373–377 | zakaz prowadzenia działalności gospodarczej | D |
| 522–523 | przepisy karne | E |
| 536–546 | przepisy przejściowe i końcowe ustawy z 2003 r. | F |
| uchylone / pominięte | 370 (uchylony); 524–535 i 541–542 (pominięte w t.j. — zmiany innych ustaw; treść w `references/insolvency/sources/original-prup.pdf`) | — |

---

## A. Umorzenie i zakończenie (art. 361–368)

**Umorzenie — obligatoryjne przesłanki (art. 361 ust. 1):**
```
1) majątek po wyłączeniu przedmiotów obciążonych hipoteką/zastawem/zastawem rejestrowym/
   skarbowym/hipoteką morską NIE wystarcza na koszty postępowania
2) wierzyciele zobowiązani uchwałą zgromadzenia albo postanowieniem s.-k. nie złożyli
   w terminie zaliczki na koszty (art. 232), a brak płynnych funduszów
3) WSZYSCY wierzyciele, którzy zgłosili wierzytelności, żądają umorzenia, a upadły się zgadza
ust. 2: przy pkt 1 sąd ustala, czy jest podstawa rozwiązania podmiotu z KRS bez likwidacji
ust. 3: po sprzedaży wymagającej oddzielnego planu podziału (art. 348 ust. 1) — umorzenie
        dopiero po wykonaniu tego planu
```

| Art. | Skutek / procedura |
|---|---|
| 362 | doręczenie upadłemu, syndykowi, członkom rady; zażalenie; obwieszczenie postanowienia, orzeczenia II instancji i prawomocności |
| 363 | prawomocne umorzenie — podstawa wykreślenia wpisów o upadłości w KW i rejestrach |
| 364 | od prawomocności upadły **odzyskuje zarząd i rozporządzanie**; syndyk niezwłocznie wydaje majątek, księgi, korespondencję, dokumenty; przymusowe odebranie — postanowienie sądu z mocą tytułu wykonawczego |
| 365 | nieodebranie dokumentów w terminie syndyka → przechowanie na koszt upadłego (syndyk może wstrzymać wydanie majątku na pokrycie); koszty z płynnych funduszów masy, w braku — likwidacja za zgodą sądu; brak majątku → sąd zasądza od upadłego (przy osobie prawnej / spółce osobowej możliwie od reprezentantów) na rzecz przechowawcy; zażalenie upadłemu, zobowiązanemu, przechowawcy; niemożność przechowania → archiwum na koszt upadłego (dokumentacja osobowa i płacowa — art. 51u ust. 3 ustawy o narodowym zasobie archiwalnym), ściąganie jak opłat sądowych |
| 366 | nieodebranie majątku → sąd zarządza likwidację i określa sposób; gdy niemożliwa lub nadmiernie utrudniona — np. przekazanie na cele dobroczynne na koszt upadłego; zażalenie |
| 367 | po umorzeniu **umarza się procesy syndyka o bezskuteczność** (koszty wzajemne wygasają); w innych sprawach cywilnych upadły wstępuje w miejsce syndyka |
| 368 | sąd **stwierdza zakończenie** po wykonaniu ostatecznego planu podziału albo gdy wszyscy wierzyciele zaspokojeni w toku postępowania; art. 362–367 odpowiednio |

## B. Oddłużenie upadłego osoby fizycznej (art. 369–370f)

**Wnioski (art. 369):**
```
Termin: 30 DNI od obwieszczenia postanowienia o zakończeniu postępowania
Wnioski: (ust. 1) o ustalenie planu spłaty i umorzenie reszty zobowiązań niezaspokojonych
         (ust. 1a) o umorzenie BEZ planu — gdy osobista sytuacja w oczywisty sposób wskazuje
         na TRWAŁĄ niezdolność do jakichkolwiek spłat (art. 370f ust. 2 — wyłączenia z umorzenia)
Rozprawa; wierzyciele zawiadamiani przez obwieszczenie (ust. 1b)
Niezdolność NIETRWAŁA → warunkowe umorzenie bez planu (ust. 2): umorzenie nastąpi, jeśli
  w 5 LAT od prawomocności nikt (upadły / wierzyciel) nie złoży skutecznego wniosku o plan;
  sąd może uchylić i ustalić plan także po 5 latach, gdy wniosek złożono w terminie (ust. 2a)
W okresie 5 lat: zakaz czynności pogarszających sytuację majątkową (zgoda / zatwierdzenie sądu
  w szczególnie uzasadnionych przypadkach) (ust. 2b–2c); coroczne sprawozdanie do końca
  KWIETNIA (przychody, składniki > przeciętne wynagrodzenie za ostatni kwartał okresu,
  możliwości zarobkowe, wydatki, potrzeby mieszkaniowe + kopia zeznania PIT) (ust. 2d);
  zakaz wszczynania egzekucji jak w art. 370c ust. 1 (ust. 2e)
Uchylenie warunkowego umorzenia (ust. 2f): brak sprawozdania w terminie; nieprawda / zatajenie;
  czynność bez zgody; ukrywanie majątku albo prawomocnie uznana czynność z pokrzywdzeniem —
  chyba że uchybienie nieznaczne lub względy słuszności/humanitarne; po uchyleniu — brak
  umorzenia (ust. 2g)
Brak wniosku → umorzenie z upływem 5 lat; postanowienie stwierdzające z datą umorzenia (ust. 2h)
Oddalenie wniosku (ust. 3): upadły CELOWO doprowadził do niewypłacalności lub istotnie
  zwiększył jej stopień (trwonienie majątku, celowe nieregulowanie) ALBO w 10 LAT przed
  wnioskiem o upadłość umorzono mu (całość lub część) zobowiązania w upadłości —
  chyba że względy słuszności lub humanitarne
```

**Plan spłaty (art. 370a):**

| Element | Reguła |
|---|---|
| treść postanowienia | czy upadły doprowadził do niewypłacalności umyślnie lub rażącym niedbalstwem; zakres i okres spłaty zobowiązań z listy niewykonanych w planach podziału; jaka część zobowiązań sprzed ogłoszenia zostanie umorzona po wykonaniu (ust. 1) |
| okres podstawowy | maks. **36 miesięcy** (ust. 1) |
| wina umyślna / rażące niedbalstwo | **36–84 miesiące** (ust. 2) |
| spłata ≥ 70% listy (plany podziału + plan spłaty) | maks. **1 rok** (ust. 3) |
| spłata ≥ 50% listy | maks. **2 lata** (ust. 4) |
| zaliczenie | okres od upływu **6 miesięcy od ogłoszenia** do zakończenia; nie wlicza się okresu warunkowego umorzenia (ust. 5) |
| syndyk | na żądanie sądu w **14 dni** opis przyczyn niewypłacalności (ust. 6) |
| koszty i zobowiązania masy | w planie w pełnej wysokości, chyba że możliwości zarobkowe i utrzymanie nie pozwalają (ust. 7) |
| swoboda sądu | niezwiązany stanowiskami; bierze pod uwagę możliwości zarobkowe, utrzymanie, potrzeby mieszkaniowe, wysokość niezaspokojonych wierzytelności, stopień zaspokojenia (ust. 8); art. 336 i 340–346 odpowiednio (ust. 9) |
| zaskarżenie | obwieszczenie; zażalenie; obwieszczenie orzeczenia II instancji (ust. 10); **skarga kasacyjna** od II instancji, możliwe wstrzymanie postanowienia o umorzeniu, uchylenie umorzenia po uchyleniu planu przez SN (art. 370b) |
| osoby trzecie | plan nie narusza praw wobec poręczyciela, współdłużnika ani zabezpieczeń na mieniu osoby trzeciej; plan i umorzenie skuteczne w stosunkach upadły – poręczyciel / gwarant / współdłużnik (ust. 11) |

**Wykonywanie planu (art. 370c–370f):**
```
Zakaz wszczynania egzekucji wierzytelności z art. 369 ust. 1 (poza nieumarzalnymi z 370f ust. 2) (370c ust. 1)
Zakaz czynności pogarszających zdolność wykonania planu; zgoda / zatwierdzenie sądu (370c ust. 2–3)
Sprawozdanie roczne do końca KWIETNIA: przychody, spłaty, składniki > przeciętne wynagrodzenie
  za III kw. roku poprzedniego + kopia zeznania (370c ust. 4)
Zmiana planu na wniosek upadłego niemogącego go wykonać — przedłużenie maks. o 18 MIESIĘCY;
  zażalenie, skarga kasacyjna (370d ust. 1)
Trwała niemożność z przyczyn niezależnych → uchylenie planu i umorzenie (370d ust. 1a)
Istotna poprawa sytuacji z innych przyczyn niż wzrost wynagrodzenia / dochodów z pracy własnej
  → wniosek wierzyciela lub upadłego o zmianę (370d ust. 2); dotyczy też wierzycieli
  z wierzytelnościami stwierdzonymi po ustaleniu planu (ust. 3); obwieszczenia (ust. 4)
Uchylenie planu (370e): niewykonywanie (z urzędu / wniosek wierzyciela), brak / nieprawdziwe
  sprawozdanie, czynność bez zgody, ukrywanie majątku albo prawomocnie uznana czynność
  z pokrzywdzeniem — chyba że nieznaczne lub słuszność/humanitarne; po uchyleniu brak umorzenia
Sprawy z 370d–370e — na rozprawie, wierzyciele przez obwieszczenie (370ea)
Wykonanie → postanowienie o stwierdzeniu wykonania i umorzeniu (370f ust. 1); zakaz egzekucji
  umorzonych wierzytelności (ust. 4); zażalenie (ust. 3)
```

**Nie podlegają umorzeniu (art. 370f ust. 2):** alimenty; renty odszkodowawcze (choroba, niezdolność do pracy, kalectwo, śmierć); grzywny orzeczone przez sąd; obowiązek naprawienia szkody i zadośćuczynienia; nawiązka i świadczenie pieniężne jako środek karny lub związany z poddaniem próbie; naprawienie szkody z przestępstwa lub wykroczenia stwierdzonego prawomocnie; zobowiązania **umyślnie nieujawnione**, jeżeli wierzyciel nie brał udziału w postępowaniu.

## C. Uchylenie postępowania i trwałość skutków (art. 371–372)

- **Art. 371:** uchylenie postępowania przy prawomocnym **odrzuceniu albo oddaleniu** wniosku o ogłoszenie (np. po zażaleniu) oraz przy umorzeniu postępowania w przedmiocie ogłoszenia; art. 362–367 odpowiednio; zażalenie.
- **Art. 372:** zmiany stosunków prawnych dokonane na podstawie ustawy **trwają** po umorzeniu lub zakończeniu (chyba że odrębna ustawa inaczej); przy uchyleniu upadły może cofnąć wypowiedzenia syndyka, jeżeli nie upłynął okres wypowiedzenia, i w **30 dni** od ogłoszenia/doręczenia postanowienia o uchyleniu odstąpić od niewykonanych lub częściowo wykonanych umów syndyka.

## D. Zakaz prowadzenia działalności gospodarczej (art. 373–377)

**Zakres zakazu:** **od 1 do 10 lat** — prowadzenie działalności na własny rachunek lub w spółce cywilnej oraz funkcje: zarządcy sukcesyjnego, członka rady nadzorczej, członka komisji rewizyjnej, reprezentanta lub pełnomocnika przedsiębiorcy osoby fizycznej (w zakresie działalności), spółki handlowej, przedsiębiorstwa państwowego, spółdzielni, fundacji lub stowarzyszenia.

| Podstawa | Osoba / zachowanie (z winy) |
|---|---|
| 373 ust. 1 pkt 1 | zobowiązany ustawowo nie złożył wniosku o upadłość w ustawowym terminie (art. 21) |
| 373 ust. 1 pkt 1a | faktycznie zarządzający istotnie przyczynił się do niezłożenia wniosku w terminie |
| 373 ust. 1 pkt 2 | po ogłoszeniu nie wydał / nie wskazał majątku, ksiąg, korespondencji, dokumentów, danych elektronicznych |
| 373 ust. 1 pkt 3 | upadły ukrywał, niszczył lub obciążał majątek masy |
| 373 ust. 1 pkt 4 | upadły nie wykonywał innych obowiązków z ustawy lub orzeczenia albo utrudniał postępowanie |
| 373 ust. 3 | osoba, wobec której już raz ogłoszono upadłość z umorzeniem długów, albo której upadłość ogłoszono nie dawniej niż **5 lat** przed ponowną |
| 374 | dłużnik osoba fizyczna — niewypłacalność następstwem celowego działania lub rażącego niedbalstwa; odpowiednio reprezentanci osoby prawnej / spółki handlowej i faktycznie zarządzający, gdy niewypłacalność lub pogorszenie sytuacji jest następstwem ich celowego działania lub rażącego niedbalstwa |

- **Łagodzenie (373 ust. 1a):** mimo przesłanki z pkt 1 sąd może oddalić wniosek, gdy złożono wniosek o otwarcie PPU, PU lub sanacji, a pokrzywdzenie wierzycieli jest nieznaczne.
- **Wymiar (373 ust. 2):** stopień winy i skutki — zwłaszcza obniżenie wartości przedsiębiorstwa i rozmiar pokrzywdzenia wierzycieli.
- **Sąd (375):** sąd upadłościowy; gdy postępowania nie wszczęto, wniosek oddalono lub postępowanie umorzono — sąd właściwy dla ogłoszenia upadłości.
- **Tryb (376):** **wyłącznie na wniosek**: wierzyciela, tymczasowego nadzorcy, zarządcy przymusowego, syndyka, prokuratora, Prezesa UOKiK, KNF; wygaśnięcie funkcji wnioskodawcy lub zaspokojenie wierzyciela-wnioskodawcy nie wpływa na bieg; postępowanie nieprocesowe; odpowiednio art. 12a, 29–30, 34, 216a–216ab, 219 ust. 1a–1c, 220 ust. 2–6, 221, 228; **rozprawa obowiązkowa**; **skarga kasacyjna** od II instancji; prawomocne orzeczenie obwieszcza się (ust. 4 uchylony).

**Terminy wszczęcia (art. 377):**
```
Przesłanki 373 ust. 1 pkt 1, 1a i 374 ust. 1: ROK od ogłoszenia upadłości albo oddalenia wniosku
  na podstawie art. 13; gdy wniosku nie złożono — 3 LATA od ustania niewypłacalności albo
  wygaśnięcia obowiązku złożenia wniosku przez tę osobę
Przesłanki 373 ust. 1 pkt 2–4: ROK od zakończenia lub umorzenia postępowania upadłościowego
```
⚠️ Termin z art. 21 (30 dni na wniosek o upadłość) ≠ terminy z art. 377 (wszczęcie sprawy o zakaz).

## E. Przepisy karne (art. 522–523)

| Art. | Znamiona | Zagrożenie |
|---|---|---|
| 522 ust. 1 | dłużnik albo reprezentant dłużnika (osoba prawna / spółka handlowa bez osobowości) podaje we **wniosku o ogłoszenie upadłości** nieprawdziwe dane | pozbawienie wolności **od 3 miesięcy do 5 lat** |
| 522 ust. 2 | ten sam podmiot podaje sądowi w postępowaniu o ogłoszenie nieprawdziwe informacje o stanie majątku | jw. |
| 523 ust. 1 | upadły albo jego reprezentant nie wydaje syndykowi **całego majątku masy, ksiąg lub dokumentów** | jw. |
| 523 ust. 2 | upadły albo reprezentant nie udziela syndykowi / s.-k. informacji o majątku lub nie udostępnia danych potrzebnych do obowiązków informacyjnych spółki publicznej (art. 56 ust. 1 pkt 2 i ust. 7 oraz art. 70 ustawy o ofercie publicznej; art. 17 ust. 1–2 i art. 19 ust. 3 rozporządzenia nr 596/2014) | jw. |

Powiązane: KSH art. 586 i KK art. 302 (zweryfikowane w ELI — zob. `mod-PrUpad-wniosek-ogloszenie`). Kwalifikację, zbieg i przedawnienie ustala dr-03 z kwalifikatorem; braki w dokumentacji same nie przesądzają winy.

## F. Przepisy przejściowe i końcowe ustawy z 2003 r. (art. 536–546)

| Art. | Reguła |
|---|---|
| 536 | upadłość ogłoszona **przed wejściem w życie ustawy** (1.10.2003) — przepisy dotychczasowe |
| 537 | wniosek złożony przed wejściem, bez postanowienia — postępowanie wg nowej ustawy |
| 538 | podanie o układ przed wejściem bez otwarcia — wg nowej ustawy (sąd może zobowiązać do wniosku o upadłość z możliwością układu); układ otwarty wcześniej — Prawo o postępowaniu układowym z 1934 r. (bez art. 31 § 5 zd. 2) |
| 539 | wpisy do KRS w sprawach z 536 i 538 ust. 2 — wg przepisów dotychczasowych |
| 540 | postępowania wszczęte na podstawie art. 17² rozporządzenia z art. 545 pkt 1 — przepisy dotychczasowe |
| 541–542 | **pominięte** w t.j. |
| 543 | „postępowanie upadłościowe” w przepisach odrębnych = postępowanie obejmujące likwidację majątku |
| 544 | „postępowanie układowe” w przepisach odrębnych = także upadłość z możliwością zawarcia układu |
| 545 | tracą moc rozporządzenia Prezydenta RP z 24.10.1934 r.: Prawo upadłościowe, przepisy wprowadzające, Prawo o postępowaniu układowym |
| 546 | wejście w życie **1.10.2003**; wyjątki: postępowanie naprawcze dla wskazanych przedsiębiorców — po 14 dniach od ogłoszenia ustawy (ogłoszona 9.04.2003); art. 451, 454–470, 481, 482 — od akcesji RP do UE (1.05.2004) |

⛔ Art. 536–546 dotyczą przejścia z reżimu 1934 r. na ustawę z 2003 r. Dla zmian późniejszych stosuj przepisy przejściowe ustaw zmieniających (np. art. 4 DU/2025/1085) — `references/insolvency/wersje-i-przepisy-przejsciowe.md`.

---

## TERMINY — ZESTAWIENIE

| Termin | Zdarzenie początkowe | Podstawa |
|---|---|---|
| 30 dni | obwieszczenie postanowienia o zakończeniu — wniosek o plan spłaty / umorzenie bez planu | art. 369 ust. 1–1a |
| 5 lat | prawomocność warunkowego umorzenia bez planu | art. 369 ust. 2, 2h |
| do końca kwietnia | sprawozdanie roczne (warunkowe umorzenie / plan spłaty) | art. 369 ust. 2d, 370c ust. 4 |
| 10 lat przed wnioskiem | wcześniejsze umorzenie zobowiązań w upadłości — przesłanka oddalenia | art. 369 ust. 3 pkt 2 |
| 36 / 36–84 mies. | okres planu spłaty (zwykły / przy winie) | art. 370a ust. 1–2 |
| 1 rok / 2 lata | maks. plan przy spłacie ≥ 70% / ≥ 50% | art. 370a ust. 3–4 |
| 6 mies. od ogłoszenia | początek zaliczania okresu do planu | art. 370a ust. 5 |
| 14 dni | opis przyczyn niewypłacalności przez syndyka | art. 370a ust. 6 |
| 18 mies. | maks. przedłużenie planu | art. 370d ust. 1 |
| 30 dni | odstąpienie od umów syndyka po uchyleniu postępowania | art. 372 ust. 2 pkt 2 |
| 1–10 lat | wymiar zakazu działalności | art. 373 |
| 5 lat | poprzednia upadłość przed ponowną — przesłanka zakazu | art. 373 ust. 3 pkt 2 |
| rok / 3 lata | wszczęcie sprawy o zakaz (przesłanki 1, 1a, 374 ust. 1) | art. 377 ust. 1 |
| rok | wszczęcie sprawy o zakaz (przesłanki 2–4) od zakończenia / umorzenia | art. 377 ust. 2 |

## PUŁAPKI

- Umorzenie z art. 361 ust. 1 pkt 1 bada majątek **po wyłączeniu przedmiotów obciążonych**.
- Po umorzeniu procesy syndyka o bezskuteczność są umarzane (367 ust. 1) — oceń to przed złożeniem wniosku wierzycieli o umorzenie (361 ust. 1 pkt 3).
- Termin 30 dni z art. 369 liczy się od **obwieszczenia** zakończenia, nie od doręczenia.
- Wyłączenia z umorzenia (370f ust. 2) obejmują zobowiązania umyślnie nieujawnione, jeżeli wierzyciel nie uczestniczył.
- Plan spłaty nie zwalnia poręczyciela ani współdłużnika wobec wierzyciela (370a ust. 11 zd. 1).
- Zakaz działalności wymaga winy i wniosku uprawnionego; sąd nie orzeka go z urzędu (376 ust. 1).
- Art. 541–542 i 524–535 są pominięte w t.j. — nie twórz ich treści; art. 370 uchylony.

## POWIĄZANIA

- Obowiązek wniosku (art. 21), KSH 299/586, KK 302 → `mod-PrUpad-wniosek-ogloszenie`
- Bezskuteczność czynności → `mod-PrUpad-skutki-masa-bezskutecznosc`
- Plany podziału, kategorie (art. 336, 340–348) → `mod-PrUpad-podzial-335-360`
- Konsument (491¹ i n.) → `mod-PrUpad-konsument-workflow`
- Sąd, s.-k., koszty, zaliczki (art. 232) → `mod-PrUpad-organy-procedura`
- Prawo karne → dr-03 + kwalifikator

## WYNIK

Podstawa zakończenia (361 / 368 / 371) z listą skutków (362–367, 372); dla osoby fizycznej — wybór wniosku (plan / bez planu / warunkowe), kalkulacja okresu planu (370a), lista zobowiązań nieumarzalnych i kalendarz sprawozdań; dla zakazu — tabela przesłanek, wnioskodawca, termin z art. 377, argumenty wymiaru (373 ust. 2).
