# Upadłość — skutki ogłoszenia: upadły, masa, umowy, małżeństwo, bezskuteczność, procesy (PrUp art. 57–147a)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535)
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Brzmienia z przypisów t.j.:** art. 65a — DU/2026/331 (w życiu od 28.03.2026). Zmian po t.j. w tym zakresie brak.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article NUMER --verify-online`; dla dat sprawy — `references/insolvency/wersje-i-przepisy-przejsciowe.md`. Moduł streszcza — nie zastępuje brzmienia.

---

## FAZA 0 — INTAKE

```
□ Data upadłości (= data wydania postanowienia, art. 52) i data obwieszczenia w KRZ
□ Data złożenia wniosku o ogłoszenie upadłości — od niej liczą się okresy „wstecz”
  (art. 116, 124–130); przy wcześniejszej restrukturyzacji → art. 131a
□ Upadły: osoba fizyczna (utrzymywane osoby, mieszkanie) / spółka / uczestnik systemu płatności
□ Majątek: spis (art. 69); rzeczy w posiadaniu upadłego; mienie cudze (wyłączenia)
□ Umowy w toku: wzajemne niewykonane, najem/dzierżawa, leasing, kredyt, zlecenie, agencja,
  rachunki, skrytki, ubezpieczenia, zakaz konkurencji, przelewy wierzytelności przyszłych
□ Potrącenie: kiedy powstały obie wierzytelności; nabycie przez przelew; wiedza
□ Małżeństwo: ustrój, umowy majątkowe (daty), wyroki o rozdzielność, rozwód/separacja
□ Czynności z ostatnich 2 lat: darowizny, sprzedaże poniżej wartości, zabezpieczenia,
  spłaty niewymagalnych długów, czynności z osobami bliskimi i spółkami powiązanymi,
  wynagrodzenia zarządu, kary umowne
□ Toczące się sprawy, egzekucje, zabezpieczenia, zapisy na sąd polubowny
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 57–60¹ | obowiązki upadłego, przymus, firma „w upadłości” | A |
| 61–67a | masa upadłości i wyłączenia ustawowe | B |
| 69 | ustalanie składu masy (spisy, inwentarz, domniemanie posiadania) | B |
| 70–74 | wyłączenie mienia cudzego | C |
| 75–80 | utrata zarządu, nieważność czynności upadłego, świadczenia do rąk upadłego, systemy płatności | D |
| 81–82 | zakaz obciążania masy | D |
| 83–86 | klauzule umowne, przewłaszczenie na zabezpieczenie, umowy ramowe, close-out netting, spółdzielnie mieszkaniowe | E |
| 91–97 | wymagalność, odsetki, potrącenie, przyjęcie oferty | F |
| 98–116 | umowy w toku (wzajemne i nazwane) | G |
| 119–123 | spadki i zapisy | H |
| 124–126 | stosunki majątkowe małżeńskie | I |
| 127–135 | bezskuteczność i zaskarżanie czynności | J |
| 136–137 | rozrachunek w systemach płatności | K |
| 144–147a | postępowania sądowe, administracyjne, egzekucyjne, sąd polubowny | L |
| uchylone | 59, 60, 65, 68, 76, 87–90, 117, 118, 148 — nie są podstawą działania | — |

---

## A. Upadły (art. 57–60¹)

- **Art. 57:** upadły wskazuje i wydaje syndykowi **cały majątek** i dokumenty (księgi, ewidencje podatkowe, korespondencję); wykonanie potwierdza **pisemnym oświadczeniem** składanym sędziemu-komisarzowi (ust. 1); obowiązek wyjaśnień wobec sędziego-komisarza i syndyka (ust. 2). Sędzia-komisarz może zakazać opuszczania RP bez zezwolenia — upadłemu osobie fizycznej (ust. 3) i członkom organu zarządzającego upadłego niebędącego osobą fizyczną (ust. 4); zażalenie (ust. 5).
- **Art. 58:** środki przymusu z KPC dla egzekucji świadczeń niepieniężnych — gdy upadły ukrywa się lub ukrywa majątek (ust. 1) albo uchybia obowiązkom, ukrywa majątek, obciąża go pozornymi zobowiązaniami lub utrudnia ustalenie masy (ust. 2); uchylenie, gdy ustanie potrzeba (ust. 3); zażalenie (ust. 4).
- **Art. 60¹:** przedsiębiorca występuje pod dotychczasową firmą z dodatkiem **„w upadłości”**.

## B. Masa upadłości (art. 61–69)

**Zasada:** z dniem ogłoszenia majątek staje się masą służącą zaspokojeniu wierzycieli (61); obejmuje majątek z dnia ogłoszenia **i nabyty w toku** postępowania, z wyjątkami art. 63–67a (62).

**Wyłączenia (art. 63):**
```
ust. 1: 1) mienie wyłączone od egzekucji wg KPC
        2) wynagrodzenie za pracę w części niepodlegającej zajęciu
        3) kwota z realizacji zastawu rejestrowego/hipoteki, gdy upadły był administratorem
           zastawu/hipoteki — część należna pozostałym wierzycielom wg umowy
        4) środki na rachunku objętym blokadą rachunku podmiotu kwalifikowanego
           (art. 119zg pkt 2 Ordynacji podatkowej)
ust. 1a: osoba fizyczna BEZ osób na utrzymaniu — część dochodu, która łącznie z dochodami
         z ust. 1 odpowiada 150% kwoty z art. 8 ust. 1 pkt 1 ustawy o pomocy społecznej
ust. 1b: osoba fizyczna Z osobami na utrzymaniu — iloczyn (liczba osób na utrzymaniu + upadły)
         × 150% kwoty z art. 8 ust. 1 pkt 2 ustawy o pomocy społecznej
ust. 1c: sędzia-komisarz na wniosek upadłego lub syndyka może określić tę część inaczej
         (zdrowie, potrzeby mieszkaniowe, możliwości ich zaspokojenia); zażalenie upadłemu
         i wierzycielom
ust. 1d: część dochodu wyłączona z ust. 1a–1c nie podlega egzekucji
ust. 2:  uchwała zgromadzenia wierzycieli może wyłączyć inne składniki
```
⚠️ Kwoty kryteriów z ustawy o pomocy społecznej ustala się na dzień sprawy z aktualnego aktu (rozporządzenie weryfikujące) — nie wpisuj kwoty z pamięci.

| Art. | Wyłączenie / reguła |
|---|---|
| 63a | wątpliwości co do składu masy rozstrzyga sędzia-komisarz (wniosek syndyka, upadłego, wierzyciela); zażalenie wnioskodawcy, upadłemu, wierzycielom |
| 64 | środki **ZFŚS** na odrębnym rachunku (+ zwroty pożyczek mieszkaniowych, odsetki, opłaty) poza masą; składniki oznacza sędzia-komisarz; zarządza syndyk wg przepisów o ZFŚS; niewykorzystane → FGŚP |
| 65a | wierzytelności objęte **umową o subpartycypację** (ustawa o funduszach inwestycyjnych / ustawa o bankach spółdzielczych) poza masą; fundusz wierzytelności albo podmiot systemu ochrony wstępuje w prawa; syndyk przekazuje otrzymane świadczenia |
| 66 | uczestnik systemu płatności/rozrachunku: mienie z art. 80 i aktywa niezbędne do obowiązków systemowych (sprzed ogłoszenia) poza masą; dysponuje podmiot prowadzący system; nadwyżka wraca do masy |
| 67 | zabezpieczenia ustanowione w związku z systemem płatności/rozrachunku oraz na rzecz NBP, innych banków centralnych UE lub EBC poza masą; upadłość nie ogranicza zaspokojenia; upadły wykonuje zobowiązania na warunkach z dnia poprzedzającego ogłoszenie; art. 102 nie stosuje się |
| 67a | środki **funduszu pomocowego systemu ochrony** banków spółdzielczych poza masą; zarządza upadły (chyba że likwidator, kurator, przedstawiciel); przekazanie uczestnikom lub nowemu systemowi; zażalenie upadłemu, wierzycielom i uczestnikom systemu |

**Ustalanie składu masy (art. 69):**
```
ust. 1:   spis w systemie teleinformatycznym wg wzorca: objęte ruchomości, nieruchomości, środki,
          prawa majątkowe + spis należności
ust. 1a:  spis składników nieobjętych (z ksiąg i dokumentów bezspornych), ze wskazaniem tych
          nieobjętych wskutek czynności bezskutecznych
ust. 1c:  spisy na bieżąco; usuwanie błędnych pozycji
ust. 1ca: każdorazowy stan spisu objętych składników jawny w KRZ; dane o wierzytelnościach
          upadłego — dopiero po obwieszczeniu zgody (rada wierzycieli / sędzia-komisarz)
          na sprzedaż wierzytelności
ust. 1d:  po ustaleniu składu — spis inwentarza (raporty trzech spisów na dzień ogłoszenia)
ust. 1f:  uzupełnienie spisu inwentarza o składniki pominięte
ust. 2:   oszacowanie wraz ze spisem inwentarza
ust. 3:   DOMNIEMANIE — rzeczy w posiadaniu upadłego w dniu ogłoszenia należą do upadłego
(ust. 1b, 1e uchylone)
```

## C. Wyłączenie mienia cudzego (art. 70–74)

- **Art. 70:** mienie nienależące do upadłego podlega wyłączeniu z masy.
- **Art. 70¹:** **przewłaszczenie na zabezpieczenie i przelew na zabezpieczenie NIE podlegają wyłączeniu** — stosuje się odpowiednio przepisy o zastawie i wierzytelnościach zabezpieczonych zastawem (zaspokojenie w trybie dla zabezpieczonych). Warunek skuteczności wobec masy: forma pisemna z datą pewną (art. 84 ust. 2).
- **Art. 71:** mienie zbyte przez upadłego — wydaje się świadczenie wzajemne, jeżeli jest wyodrębnione w masie (ust. 1); zbyte przez syndyka — uprawniony żąda świadczenia wzajemnego (ust. 2); niespełnione świadczenie przechodzi na uprawnionego (ust. 3).
- **Art. 72:** wydanie mienia lub świadczenia za jednoczesnym zwrotem wydatków na utrzymanie mienia / uzyskanie świadczenia.

**Procedura:**
```
Wniosek do sędziego-komisarza — WSZYSTKIE twierdzenia, zarzuty i dowody pod rygorem
  prekluzji (chyba że wcześniej niemożliwe) (73 ust. 1)
Rozpoznanie w 1 miesiąc od złożenia, po wysłuchaniu syndyka / nadzorcy / zarządcy (73 ust. 2)
Postanowienie z uzasadnieniem; zażalenie na WYŁĄCZENIE — upadły i wierzyciele (73 ust. 6)
Oddalenie → powództwo do sądu upadłościowego w 1 miesiąc od doręczenia postanowienia (74 ust. 1–2)
  tylko twierdzenia i zarzuty z wniosku (chyba że wcześniej niemożliwe); nowe istotne dowody
  → koszty procesu na powoda niezależnie od wyniku (74 ust. 3)
  zabezpieczenie: zakaz zbywania lub obciążania mienia (74 ust. 4)
(73 ust. 3–5 uchylone)
```

## D. Czynności upadłego i zakaz obciążania (art. 75–82)

- **Art. 75:** z dniem ogłoszenia upadły **traci zarząd**, korzystanie i rozporządzanie masą (ust. 1); sędzia-komisarz określa zakres i czas korzystania z mieszkania w lokalu/budynku z masy przez upadłego i osoby bliskie zamieszkujące tam w dniu ogłoszenia (ust. 2).
- **Art. 77:** czynności prawne upadłego dotyczące masy są **nieważne** (ust. 1). Zwrot świadczenia wzajemnego osobie trzeciej (wg przepisów o nienależnym świadczeniu) — tylko gdy czynność między ogłoszeniem a obwieszczeniem w KRZ i osoba trzecia przy należytej staranności nie mogła wiedzieć; zażalenie (ust. 2–3). Wyjątki: zabezpieczenie finansowe ustanowione w dniu ogłoszenia bez wiedzy uprawnionego oraz zabezpieczenia z art. 67 (ust. 4).
- **Art. 78:** zapłata do rąk upadłego **po obwieszczeniu w KRZ** nie zwalnia z obowiązku zapłaty do masy, chyba że upadły przekazał równowartość do masy.
- **Art. 79:** art. 77–78 dotyczą też czynności podlegających ujawnieniu w KW i rejestrach, jeżeli przepisy szczególne nie stanowią inaczej.
- **Art. 80:** uczestnik systemu płatności — środki i instrumenty na rachunku rozliczeniowym (nieobciążone) oraz instrumenty jako zabezpieczenie kredytu systemowego mogą być użyte do zleceń wprowadzonych najpóźniej w dniu roboczym systemu rozpoczynającym się w dniu ogłoszenia; definicja dnia roboczego systemu (ust. 2).
- **Art. 81:** po ogłoszeniu **zakaz obciążania** masy hipoteką, zastawem, zastawem rejestrowym, skarbowym, hipoteką morską dla długu **sprzed** upadłości (ust. 1); **hipoteki przymusowej i zastawu skarbowego nie można ustanowić nawet dla długu powstałego po** upadłości (ust. 1a); wyjątek — wniosek o wpis hipoteki złożony co najmniej **6 miesięcy** przed wnioskiem o ogłoszenie upadłości (ust. 2).
- **Art. 82:** wpis z naruszeniem art. 81 wykreśla się z urzędu na podstawie postanowienia sędziego-komisarza; zażalenie.

## E. Klauzule i umowy szczególne (art. 83–86)

| Art. | Reguła |
|---|---|
| 83 | klauzule o zmianie lub rozwiązaniu stosunku na wypadek **wniosku** o upadłość lub **ogłoszenia** upadłości — **nieważne** |
| 84 ust. 1 | postanowienie uniemożliwiające albo utrudniające osiągnięcie celu postępowania — **bezskuteczne wobec masy** |
| 84 ust. 2 | przewłaszczenie rzeczy / przelew wierzytelności / przeniesienie prawa na zabezpieczenie skuteczne wobec masy tylko w **formie pisemnej z datą pewną** |
| 84 ust. 3 | zabezpieczenie finansowe — data pewna niepotrzebna |
| 85 | umowa ramowa z close-out (operacje terminowe, pożyczki instrumentów, repo): wierzytelności z umów szczegółowych nie są objęte układem; syndyk nie może odstąpić (art. 98); każda strona może wypowiedzieć z umownym rozliczeniem; potrącenie wierzytelności z rozliczenia dopuszczalne; do umów szczegółowych nie stosuje się art. 98–99 nawet bez umowy ramowej; definicje ust. 2–2a |
| 85a | klauzula kompensacyjna z ustawy o zabezpieczeniach finansowych nienaruszona — umowa przed dniem ogłoszenia, w dniu ogłoszenia przed wydaniem postanowienia albo po wydaniu, jeżeli przyjmujący zabezpieczenie nie wiedział i nie mógł wiedzieć |
| 86 | upadłość spółdzielni mieszkaniowej: czynności z art. 41–43 ustawy o spółdzielniach mieszkaniowych wykonuje syndyk; obowiązek zawarcia umów z art. 12, 17¹⁴, 17¹⁵, 39, 48 tej ustawy, gdy żądanie złożono przed ogłoszeniem albo po nim na podstawie art. 54¹ ust. 2 |

## F. Zobowiązania i potrącenie (art. 91–97)

- **Art. 91:** zobowiązania pieniężne **stają się wymagalne** z dniem ogłoszenia (ust. 1); niepieniężne majątkowe **zamieniają się na pieniężne** i stają się płatne (ust. 2).
- **Art. 92:** odsetki z masy — tylko **za okres do dnia ogłoszenia** (ust. 1); odsetki od wierzytelności zabezpieczonych rzeczowo / wpisem w rejestrze — **tylko z przedmiotu zabezpieczenia** (ust. 2).

**Potrącenie:**
```
Dopuszczalne: obie wierzytelności istniały w dniu ogłoszenia, choćby jedna niewymagalna (93 ust. 1)
  — wierzytelność upadłego w całości; wierzytelność wierzyciela: należność główna + odsetki
    do dnia ogłoszenia (93 ust. 2)
  — nieoprocentowany niewymagalny dług upadłego: minus odsetki ustawowe, nie wyżej niż 6%,
    od dnia ogłoszenia do płatności, maks. za 2 lata (93 ust. 3)
Niedopuszczalne:
  — dłużnik upadłego nabył wierzytelność przelewem/indosem PO ogłoszeniu albo w ostatnim
    ROKU przed ogłoszeniem, wiedząc o podstawie upadłości (94 ust. 1)
  — wierzyciel stał się dłużnikiem upadłego PO dniu ogłoszenia (95)
Wyjątek (94 ust. 2): nabywca stał się wierzycielem, spłacając dług upadłego, za który
  odpowiadał osobiście lub rzeczowo, bez wiedzy o podstawie upadłości w chwili przyjęcia
  odpowiedzialności; zawsze dopuszczalne, gdy przyjęcie odpowiedzialności rok przed ogłoszeniem
Oświadczenie o potrąceniu — najpóźniej przy zgłoszeniu wierzytelności (96)
```
- **Art. 97:** roszczenie z umowy zawartej przez przyjęcie oferty upadłego — w postępowaniu tylko, gdy oświadczenie o przyjęciu złożono **przed dniem ogłoszenia**.

## G. Umowy w toku (art. 98–116)

**Reguła ogólna — umowa wzajemna niewykonana (art. 98–99):**
```
Syndyk, za zgodą sędziego-komisarza: wykonuje i żąda świadczenia wzajemnego ALBO odstępuje
  ze skutkiem na dzień ogłoszenia (98 ust. 1); kryterium zgody — cel postępowania + ważny
  interes drugiej strony (ust. 1a); zażalenie upadłemu i drugiej stronie (ust. 1b)
Umowa inna niż wzajemna — syndyk może odstąpić, chyba że ustawa przewiduje inny skutek (ust. 1c)
Żądanie drugiej strony (pisemne, data pewna) → syndyk w 3 MIESIĄCE oświadcza na piśmie;
  milczenie = ODSTĄPIENIE (ust. 2)
Strona zobowiązana świadczyć pierwsza może wstrzymać się do spełnienia lub zabezpieczenia
  świadczenia wzajemnego — chyba że przy zawarciu wiedziała / powinna wiedzieć o podstawie
  upadłości (ust. 3)
Po odstąpieniu: brak zwrotu spełnionego świadczenia (nawet gdy jest w masie); należności
  i straty — zgłoszenie wierzytelności syndykowi (99)
```

**Umowy nazwane — skutek ogłoszenia:**

| Art. | Umowa | Skutek |
|---|---|---|
| 100 | sprzedaż — rzecz wysłana upadłemu bez zapłaty, nieobjęta przed ogłoszeniem | sprzedawca/komisant żąda zwrotu (zwraca koszty i zaliczki); syndyk może zatrzymać, płacąc lub zabezpieczając cenę i koszty w **1 miesiąc** od żądania |
| 101 | zastrzeżenie własności | nie wygasa, jeżeli skuteczne wobec wierzycieli wg KC (ust. 2 uchylony) |
| 102 | zlecenie / komis / zarządzanie papierami (upadły dającym zlecenie lub komitentem) | **wygasają**; strata — w postępowaniu; upadły przyjmującym zlecenie / komisantem — można odstąpić bez odszkodowania |
| 103 | agencja | wygasa przy upadłości którejkolwiek strony; agent zgłasza stratę przy upadłości dającego zlecenie |
| 104 | użyczenie | rzecz wydana — rozwiązanie na żądanie strony; niewydana — wygasa |
| 105 | pożyczka | wygasa, gdy przedmiot niewydany |
| 106 | najem ruchomości | czynsz pobrany z góry za > **6 mies.** od ogłoszenia nie zwalnia najemcy z zapłaty do masy |
| 107 | najem/dzierżawa nieruchomości upadłego (wydana) | wiąże; czynsz z góry za > **3 mies.** (najem) / > **6 mies.** (dzierżawa) oraz rozporządzenie czynszem nie zwalnia z zapłaty do masy |
| 108 | sprzedaż nieruchomości przez syndyka | skutki dla najmu/dzierżawy jak przy sprzedaży egzekucyjnej |
| 109 | najem/dzierżawa nieruchomości upadłego | wypowiedzenie przez syndyka na podstawie postanowienia s.-k. z **3-mies.** okresem, także gdy upadłemu było niedopuszczalne (utrudnia likwidację lub czynsz odbiega od przeciętnego); odszkodowanie — zgłoszenie; zażalenie; odpowiednio najem/dzierżawa przedsiębiorstwa lub ZCP |
| 110 | upadły najemcą/dzierżawcą nieruchomości | niewydana: odstąpienie każdej strony w **2 mies.** od ogłoszenia, bez odszkodowania; wydana: wypowiedzenie przez syndyka — **3 mies.** dla nieruchomości z przedsiębiorstwem, w innych przypadkach ustawowy (lub krótszy umowny); nie przed okresem czynszu zapłaconego z góry, chyba że postanowienie s.-k. (koszty); odszkodowanie wynajmującego maks. za **2 lata**, pomniejszone o nakłady upadłego |
| 110a | zakaz konkurencji (art. 101² KP) | syndyk może odstąpić z dniem ogłoszenia bez odszkodowania; przy sprzedaży przedsiębiorstwa w całości zobowiązanie przechodzi na nabywcę, chyba że syndyk wcześniej odstąpił |
| 111 | kredyt | środki nieprzekazane — umowa **wygasa**, szkoda kredytodawcy — zgłoszenie; częściowo przekazane — upadły traci prawo do reszty |
| 112 | rachunek bankowy, rachunek papierów, derywatów, konto rozliczeniowe, rachunek zbiorczy | **bez wpływu** |
| 113 | skrytki sejfowe, przechowanie w banku | wygasają; wydanie w terminie uzgodnionym z syndykiem, najpóźniej **3 mies.** od ogłoszenia; opłaty wg stawek z ostatniego miesiąca — jak koszty postępowania |
| 114 | leasing — upadły korzystającym | syndyk za zgodą s.-k. może odstąpić z dniem ogłoszenia (art. 98 ust. 2, 99 odpowiednio); upadły finansującym — syndyk nie odstępuje |
| 115 | ubezpieczenia | obowiązkowe majątkowe — bez wpływu; inne majątkowe — art. 98–99 odpowiednio |
| 116 | umowa majątkowa małżeńska | roszczenia małżonka z umowy — tylko gdy zawarta co najmniej **2 lata** przed wnioskiem o upadłość |

⛔ Nie przyjmuj, że ogłoszenie upadłości rozwiązuje każdą umowę: część wygasa z mocy prawa (102, 103, 105, 111, 113), część trwa (107, 112, 115 ust. 1), w pozostałych decyduje syndyk (98, 109, 110, 110a, 114).

## H. Spadki (art. 119–123)

- **Art. 119:** spadek otwarty **po** ogłoszeniu wchodzi do masy; syndyk nie składa oświadczenia — przyjęcie **z dobrodziejstwem inwentarza**; to samo, gdy spadek otwarto przed ogłoszeniem, a termin na oświadczenie nie upłynął i nie złożono go; odpowiednio zapisy.
- **Art. 120:** zbycie spadku/udziału spadkowego oraz rozporządzenie udziałem w przedmiocie spadku przez upadłego po ogłoszeniu (i jego zgoda na takie rozporządzenie innego spadkobiercy) — **nieważne**.
- **Art. 121:** sędzia-komisarz z urzędu wyłącza spadek z masy, gdy wierzytelności i prawa wątpliwe (ust. 1 — „można”) albo składniki trudno zbywalne / wejście niekorzystne (ust. 2 — „podlega”); zażalenie upadłemu i wierzycielom.
- **Art. 122:** po wyłączeniu oświadczenie składa spadkobierca; termin biegnie od uprawomocnienia się postanowienia o wyłączeniu.
- **Art. 123:** odrzucenie spadku lub zapisu windykacyjnego po ogłoszeniu — **bezskuteczne wobec masy**.

## I. Małżeństwo (art. 124–126)

```
Z dniem ogłoszenia — rozdzielność majątkowa (art. 53 § 1 KRO); majątek wspólny wchodzi
  do masy, podział niedopuszczalny (124 ust. 1)
Małżonek zgłasza należność z tytułu udziału w majątku wspólnym syndykowi (124 ust. 3)
Domniemanie: majątek wspólny z okresu prowadzenia przedsiębiorstwa nabyty z jego dochodów (124 ust. 4)
Poza masą: przedmioty służące wyłącznie małżonkowi do jego działalności, choćby wspólne —
  chyba że nabyte do majątku wspólnego w 2 LATA przed wnioskiem (124 ust. 5)
(124 ust. 2 uchylony)
```

| Rozdzielność | Skuteczna wobec masy, gdy… | Podstawa |
|---|---|---|
| wyrok sądu | ustanowiona wcześniej niż **rok** przed wnioskiem albo pozew złożony co najmniej **2 lata** przed wnioskiem | 125 ust. 1 |
| po ogłoszeniu | nie można ustanowić z datą wcześniejszą niż data upadłości | 125 ust. 2 |
| z mocy prawa (rozwód, separacja, ubezwłasnowolnienie) | jak wyżej (rok / pozew lub wniosek 2 lata wcześniej); ponadto małżonek może powództwem lub zarzutem żądać uznania skuteczności — brak wiedzy o podstawie upadłości i brak pokrzywdzenia; powództwo do sądu upadłościowego, zabezpieczenie zakazem zbywania/obciążania | 125 ust. 3 |
| umowa majątkowa (także ograniczenie wspólności) | zawarta co najmniej **2 lata** przed wnioskiem | 126 |

## J. Bezskuteczność i zaskarżanie (art. 127–135)

**Daty:** okresy liczy się wstecz **od dnia złożenia wniosku o ogłoszenie upadłości**. Art. 131a: upadłość z wniosku złożonego w **3 miesiące** od zakończenia albo prawomocnego umorzenia restrukturyzacji → liczy się od **wniosku restrukturyzacyjnego**; gdy wcześniej odrzucono wniosek upadłościowy zgodnie z art. 9a — od tego odrzuconego wniosku.

| Podstawa | Czynność | Okres | Tryb / obrona |
|---|---|---|---|
| 127 ust. 1–2 | rozporządzenie nieodpłatne lub odpłatne z rażącą nieekwiwalentnością na niekorzyść upadłego; także ugoda sądowa, uznanie powództwa, zrzeczenie się roszczenia | **1 rok** | **z mocy prawa** |
| 127 ust. 3 | zabezpieczenie i zapłata długu **niewymagalnego** | **6 mies.** | z mocy prawa; odbiorca może powództwem lub zarzutem żądać uznania za skuteczne — brak wiedzy o podstawie upadłości |
| 127 ust. 4 | wyłączenie: zabezpieczenia operacji z art. 85 ust. 1 | — | — |
| 128 ust. 1 | **odpłatna** czynność z małżonkiem, krewnymi/powinowatymi w linii prostej, w linii bocznej do 2. stopnia, konkubentem, osobą prowadzącą wspólne gospodarstwo, przysposobionym/przysposabiającym | **6 mies.** | postanowienie s.-k. z urzędu / na wniosek syndyka; obrona — wykazanie braku pokrzywdzenia; zażalenie |
| 128 ust. 1a–3 | spółka, w której upadły (lub osoby z ust. 1) jest członkiem zarządu / jedynym wspólnikiem lub akcjonariuszem; upadła spółka ze wspólnikami, reprezentantami, ich małżonkami, spółkami powiązanymi; spółka dominująca – zależna, wspólna dominująca | **6 mies.** | jak 128 ust. 1 |
| 128a | przelew wierzytelności **przyszłej** powstającej po ogłoszeniu | — | z mocy prawa, chyba że umowa pisemna z datą pewną co najmniej **6 mies.** przed wnioskiem |
| 129 | wynagrodzenie zarządu / pracownika zarządzającego / usług zarządu lub nadzoru rażąco wyższe od przeciętnego i nieuzasadnione nakładem pracy | część za okres przed ogłoszeniem, maks. **6 mies.** przed wnioskiem; także za okres po ogłoszeniu, gdy syndyk objął zarząd | postanowienie s.-k. (z urzędu / syndyk), po wysłuchaniu; s.-k. ustala wynagrodzenie odpowiednie; odpowiednio odprawy i świadczenia przy rozwiązaniu (do zasad powszechnych); zażalenie |
| 130 | hipoteka / zastaw / zastaw rejestrowy / hipoteka morska, gdy upadły **nie był dłużnikiem osobistym** i nie otrzymał świadczenia (ust. 1) albo świadczenie niewspółmiernie niskie (ust. 2); zabezpieczenie długów osób z art. 128 — bez względu na świadczenie (ust. 3) | **1 rok** | postanowienie s.-k. na wniosek syndyka; przy ust. 3 obrona — brak pokrzywdzenia; zażalenie |
| 130a | kary umowne przy znacznym wykonaniu zobowiązania przez upadłego lub rażąco wygórowane | — | postanowienie s.-k. na wniosek syndyka (całość lub część); zażalenie |
| 131 | pozostałe czynności z pokrzywdzeniem wierzycieli | wg KC | art. 132–134 + przepisy KC o ochronie wierzyciela przy niewypłacalności dłużnika (skarga pauliańska) → `kc-zobowiazania/czesc-02-skarga-paulianska.md` |

**Dochodzenie i skutki:**
```
Powództwo wytacza syndyk; bez opłat sądowych (132 ust. 1–2)
Termin: nie później niż 2 LATA od dnia ogłoszenia upadłości (chyba że uprawnienie z KC wygasło
  wcześniej); w drodze ZARZUTU — bez terminu (132 ust. 3)
Syndyk może wstąpić do sprawy pauliańskiej wierzyciela; postępowanie wobec upadłego umarza się
  po uprawomocnieniu ogłoszenia; koszty wierzyciela zwraca z odzyskanej części; po umorzeniu
  lub uchyleniu upadłości wierzyciel może w 2 TYGODNIE przystąpić jako powód; świadczenie
  otrzymane przez wierzyciela przed ogłoszeniem na podstawie wyroku pauliańskiego zostaje
  przy nim (133)
Skutek: to, co ubyło lub nie weszło — do masy w naturze, a gdy niemożliwe — równowartość;
  za zgodą s.-k. druga strona może zapłacić różnicę między wartością rynkową świadczenia
  upadłego z dnia umowy a otrzymanym świadczeniem (zażalenie) (134 ust. 1)
Brak dobrowolnego wydania i brak prawomocnego orzeczenia → powództwo syndyka do sądu
  upadłościowego; zabezpieczenie zakazem zbywania/obciążania (134 ust. 1a–1b)
Świadczenie wzajemne osoby trzeciej — zwrot, jeżeli wyodrębnione w masie lub masa wzbogacona;
  inaczej zgłoszenie wierzytelności (134 ust. 2)
Wyłączenia: kompensowanie z art. 136–137 i jego wyniki; umowy zabezpieczenia finansowego
  i ich wykonanie (135)
```
⛔ Bezskuteczność wobec masy ≠ nieważność. Rozdziel: z mocy prawa (127, 128a) / postanowienie sędziego-komisarza (128, 129, 130, 130a) / wyrok (131–132, powództwo z 134 ust. 1a).

## K. Systemy płatności (art. 136–137)

- **Art. 136:** zlecenie rozrachunku wprowadzone **przed** ogłoszeniem i wyniki kompensowania — niepodważalne i wiążące dla osób trzecich.
- **Art. 137:** zlecenie wprowadzone **po** ogłoszeniu i wykonane w dniu roboczym systemu rozpoczynającym się w dniu ogłoszenia — wiążące tylko, gdy podmiot prowadzący system wykaże brak wiedzy i możliwości wiedzy w chwili nieodwołalności zlecenia.

## L. Postępowania sądowe, administracyjne i egzekucyjne (art. 144–147a)

- **Art. 144:** postępowania dotyczące masy wszczyna i prowadzi **wyłącznie syndyk albo przeciwko niemu**, na rzecz upadłego, w imieniu własnym; wyjątek — alimenty, renty za uszkodzenie ciała/rozstrój zdrowia/utratę żywiciela, renty z zamiany dożywocia; syndyk może żądać zmiany orzeczenia lub umowy alimentacyjnej.
- **Art. 145:** sprawa przeciwko upadłemu o wierzytelność podlegającą zgłoszeniu, wszczęta przed ogłoszeniem — podjęcie przeciwko syndykowi **tylko** gdy wierzytelność po wyczerpaniu trybu nie trafi na listę (ust. 2 uchylony). → zgłoszenie i sprzeciw: `mod-PrUpad-wierzytelnosci-235-266`.
- **Art. 146:**
```
Egzekucja do masy wszczęta przed ogłoszeniem: ZAWIESZENIE z mocy prawa z dniem ogłoszenia;
  UMORZENIE z mocy prawa po uprawomocnieniu się postanowienia o ogłoszeniu (ust. 1)
  — przysądzenie własności nieruchomości dopuszczalne, gdy przybicie prawomocne przed
    ogłoszeniem i nabywca wpłaci cenę w terminie
Sumy uzyskane i niewydane → do masy po uprawomocnieniu (ust. 2); sumy ze sprzedaży
  składników obciążonych rzeczowo — jak z likwidacji obciążonych składników masy (ust. 2a)
Po ogłoszeniu: niedopuszczalna egzekucja do masy i wykonanie zabezpieczenia, z wyjątkiem
  zabezpieczenia alimentów, rent odszkodowawczych i renty z zamiany dożywocia (ust. 3)
(ust. 4 uchylony)
```
- **Art. 147:** sąd polubowny — odpowiednio art. 174 § 1 pkt 4–5 i 180 § 1 pkt 5 KPC oraz art. 144–145.
- **Art. 147a:** postępowanie polubowne niewszczęte w dniu ogłoszenia — syndyk za zgodą s.-k. może **odstąpić od zapisu**, gdy utrudnia likwidację (zwłaszcza brak środków na koszty); na pisemne żądanie drugiej strony oświadcza w **30 dni**, milczenie = odstąpienie; druga strona może odstąpić, gdy syndyk odmówi udziału w kosztach; po odstąpieniu zapis traci moc.

---

## TERMINY — ZESTAWIENIE

| Termin | Zdarzenie początkowe | Podstawa |
|---|---|---|
| 1 mies. | złożenie wniosku o wyłączenie z masy — rozpoznanie | art. 73 ust. 2 |
| 1 mies. | doręczenie odmowy wyłączenia — powództwo | art. 74 ust. 2 |
| 6 mies. przed wnioskiem | wniosek o wpis hipoteki — wyjątek od zakazu obciążania | art. 81 ust. 2 |
| 6% / 2 lata | dyskonto nieoprocentowanego długu przy potrąceniu | art. 93 ust. 3 |
| 1 rok przed ogłoszeniem | nabycie wierzytelności do potrącenia (wiedza) | art. 94 |
| 3 mies. | żądanie drugiej strony — oświadczenie syndyka (milczenie = odstąpienie) | art. 98 ust. 2 |
| 1 mies. | żądanie zwrotu rzeczy przez sprzedawcę — zatrzymanie przez syndyka | art. 100 ust. 3 |
| 3 / 6 mies. | czynsz pobrany z góry (najem nieruchomości / dzierżawa, najem ruchomości) | art. 106–107 |
| 3 mies. | okres wypowiedzenia najmu/dzierżawy | art. 109, 110 ust. 3 |
| 2 mies. | odstąpienie od niewydanego najmu/dzierżawy (upadły najemcą) | art. 110 ust. 1 |
| 2 lata | limit odszkodowania wynajmującego | art. 110 ust. 5 |
| 3 mies. | wydanie zawartości skrytek | art. 113 ust. 1 |
| 2 lata przed wnioskiem | umowa majątkowa małżeńska / rozdzielność umowna / przedmioty małżonka | art. 116, 124 ust. 5, 126 |
| 1 rok / 2 lata | rozdzielność sądowa lub z mocy prawa / pozew | art. 125 |
| 1 rok przed wnioskiem | czynności nieodpłatne/nieekwiwalentne, obciążenia za cudzy dług | art. 127 ust. 1, 130 |
| 6 mies. przed wnioskiem | dług niewymagalny, osoby bliskie i powiązane, przelew przyszłej wierzytelności, wynagrodzenia | art. 127 ust. 3, 128, 128a, 129 |
| 3 mies. | od zakończenia/umorzenia restrukturyzacji — przesunięcie daty odniesienia | art. 131a |
| 2 lata od ogłoszenia | powództwo o bezskuteczność (zarzut bez terminu) | art. 132 ust. 3 |
| 2 tyg. | przystąpienie wierzyciela do sprawy pauliańskiej po umorzeniu/uchyleniu upadłości | art. 133 ust. 3 |
| 30 dni | oświadczenie syndyka co do zapisu na sąd polubowny | art. 147a ust. 2 |

## PUŁAPKI

- Uchylone 59, 60, 65, 68, 76, 87–90, 117, 118, 148 — nie powołuj; wcześniejsza wersja modułu podawała je w przedziałach jako aktywne.
- Przewłaszczenie na zabezpieczenie nie daje wyłączenia z masy (70¹) — zaspokojenie jak zastawnik; bez daty pewnej nieskuteczne wobec masy (84 ust. 2).
- Wniosek o wyłączenie: wszystkie dowody od razu — prekluzja (73 ust. 1, 74 ust. 3).
- Zapłata do rąk upadłego przed obwieszczeniem w KRZ zwalnia; po obwieszczeniu — nie (78).
- Hipoteka przymusowa i zastaw skarbowy po ogłoszeniu są niedopuszczalne także dla długów masy (81 ust. 1a).
- Milczenie syndyka na żądanie z art. 98 ust. 2 = odstąpienie; milczenie na żądanie z art. 147a ust. 2 = odstąpienie od zapisu.
- Okresy „wstecz” liczone od wniosku o upadłość, nie od ogłoszenia — chyba że art. 131a (restrukturyzacja).
- Art. 128 to postanowienie sędziego-komisarza z przerzuconym ciężarem dowodu (brak pokrzywdzenia), a nie bezskuteczność z mocy prawa.
- Termin 2 lat z art. 132 ust. 3 nie dotyczy zarzutu.
- Egzekucja: zawieszenie od ogłoszenia, umorzenie dopiero od prawomocności (146 ust. 1).

## POWIĄZANIA

- Wniosek, zabezpieczenie, data upadłości → `mod-PrUpad-wniosek-ogloszenie`
- Sędzia-komisarz, syndyk, rada wierzycieli → `mod-PrUpad-organy-procedura`
- Zgłoszenia i lista wierzytelności → `mod-PrUpad-wierzytelnosci-235-266`; likwidacja → `mod-PrUpad-syndyk-likwidacja`; plan podziału → `mod-PrUpad-podzial-335-360`
- Konsument (wyłączenia dochodu, mieszkanie) → `mod-PrUpad-konsument-workflow`
- Skarga pauliańska (KC) → `kc-zobowiazania/czesc-02-skarga-paulianska.md`; ustroje majątkowe → `kro-rodzinne/czesc-01-malzenstwo-ustroj-konkubinat.md`
- Karne (ukrywanie majątku, faworyzowanie wierzycieli) → dr-03 + kwalifikator; KK art. 302 opisany w `mod-PrUpad-wniosek-ogloszenie` (zweryfikowany w ELI)

## WYNIK

Rejestr składników masy i wyłączeń (63–67a, 70–74), tabela umów z decyzją syndyka i terminami (98–116), rejestr potrąceń (93–96), rejestr czynności do zaskarżenia z podstawą, okresem liczonym od właściwej daty, trybem i terminem 2 lat (127–134), wykaz spraw i egzekucji z legitymacją (144–147a).
