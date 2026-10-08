# Upadłość — organy, uczestnicy, wierzyciele, procedura po ogłoszeniu i koszty (PrUp art. 149–234)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535)
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Brzmienia z przypisów t.j.:** art. 229 ust. 1 — ze zmianą DU/2025/1172 (przypis 11 t.j.). Zmian po t.j. w tym zakresie brak.
**Zakres modułu:** art. 149–155, 179, 185–234. Syndyk (art. 156–178: powołanie, wynagrodzenie, odpowiedzialność, odwołanie) → `mod-PrUpad-syndyk-likwidacja`.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article NUMER --verify-online`. Moduł streszcza — nie zastępuje brzmienia.

---

## FAZA 0 — INTAKE

```
□ Kto pełni funkcję sędziego-komisarza: sędzia czy referendarz (art. 51 ust. 1 pkt 6)?
  → od tego zależy środek zaskarżenia (zażalenie / skarga na referendarza)
□ Czy jest rada wierzycieli? skład, regulamin, przewodniczący
□ Czy sprawa wymaga uchwały zgromadzenia wierzycieli? kto ma prawo głosu i z jaką sumą?
□ Czynność syndyka: czy wymaga zezwolenia rady (art. 206) / sędziego-komisarza / żadnego?
□ Pismo: przez system teleinformatyczny (KRZ) czy wyjątek papierowy (216aa, 216ab)?
□ Zaskarżenie: kto wydał (sąd / s.-k. / referendarz / rada / syndyk), czy przysługuje,
  od jakiego zdarzenia biegnie termin (zamieszczenie / obwieszczenie / doręczenie)?
□ Koszty: koszt postępowania (230 ust. 1) czy inne zobowiązanie masy (230 ust. 2)?
□ Upadły: brak zdolności procesowej / braki w organach / śmierć → kurator
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 149–150 | sąd upadłościowy: właściwość, skład, wyłączenia | A |
| 151–155 | sędzia-komisarz, referendarz, zastępca | A |
| 179 | standard należytej staranności syndyka | B |
| 185–188 | upadły: status, uprawnienia korporacyjne, kurator, spadkobierca | C |
| 189–190 | wierzyciel — definicja, kurator wierzyciela | D |
| 191–200 | zgromadzenie wierzycieli | D |
| 201–213 | rada wierzycieli | E |
| 214–229 | przepisy ogólne postępowania: pisma, dowody, orzeczenia, doręczenia, obwieszczenia, zaskarżenie, akta, KPC | F |
| 230–234 | koszty postępowania i inne zobowiązania masy | G |
| uchylone w zakresie | rozdz. 3–4 działu II (po art. 179); części jednostek oznaczone w tekście jako „(uchylony)” | — |

---

## A. Sąd upadłościowy i sędzia-komisarz (art. 149–155)

- **Art. 149:** po ogłoszeniu postępowanie toczy się w sądzie, który ogłosił upadłość; przy kilku sądach — w tym, który **pierwszy** ogłosił; niewłaściwość → przekazanie bez zażalenia, wiążące, czynności w mocy.
- **Art. 150:** skład **jednego** sędziego zawodowego (ust. 1); **trzech** — w przedmiocie wynagrodzenia syndyka oraz przy zażaleniu na postanowienie s.-k. (ust. 2); s.-k. i jego zastępca nie orzekają o wynagrodzeniu lub odwołaniu syndyka ani o wyłączeniu z masy (ust. 3); po uchyleniu postanowienia s.-k. i przekazaniu — ten s.-k. wyłączony od ponownego rozpoznania (także po kolejnym uchyleniu); rozpoznaje zastępca albo wyznaczony sędzia (ust. 4).

**Sędzia-komisarz — kompetencje i zastępstwo (art. 151–155):**
```
Wykonuje czynności postępowania, poza zastrzeżonymi dla sądu (151 ust. 1)
Referendarz jako s.-k. (151 ust. 1a) — ale czynności z art. 57 ust. 3–4, 58 ust. 1–3, 63a,
  73 ust. 2, 121 ust. 3, 259 ust. 1 i 1a, 315 i 350 ust. 1–2 wykonuje wyznaczony SĘDZIA (ust. 1b)
Skarga na czynności referendarza — gdy na postanowienie s.-k. przysługiwałoby zażalenie;
  nie wstrzymuje mocy postanowienia; przepisy o zażaleniu odpowiednio (ust. 1c);
  po skardze na postanowienie z art. 395 § 2 KPC referendarz nie wydaje go ponownie (ust. 1d);
  sąd jednoosobowo jako II instancja — utrzymuje albo zmienia (ust. 1e)
Zastępca: gdy ustawa stanowi i przy przemijającej przeszkodzie s.-k.; możliwych kilku
  zastępców w szczególnie uzasadnionych przypadkach (ust. 2–4); przeszkoda obu → wyznaczony
  sędzia (ust. 5); czynność po zakończeniu / prawomocnym umorzeniu → sąd jednoosobowy (ust. 6)
Kieruje tokiem postępowania, nadzoruje syndyka, oznacza czynności wymagające jego zezwolenia
  lub zezwolenia rady, zwraca uwagę na uchybienia (152 ust. 1); kontakt z syndykiem także
  telefon/faks/e-mail (ust. 3); po prawomocnym zakończeniu/umorzeniu — sąd (ust. 4)
Rozpoznaje skargi na czynności komornika (153; termin — art. 225)
Ma prawa i obowiązki sądu i przewodniczącego (154)
Organy administracji publicznej obowiązane do pomocy (155 ust. 1; ust. 2 uchylony)
```

## B. Standard działania syndyka (art. 179)

Syndyk działa z **należytą starannością**, tak by optymalnie wykorzystać majątek upadłego dla zaspokojenia wierzycieli w jak najwyższym stopniu, **w szczególności przez minimalizację kosztów**. To miernik przy ocenie zarzutów wobec syndyka, wniosków o odwołanie i odpowiedzialności (art. 156–178 → `mod-PrUpad-syndyk-likwidacja`). Rozdziały 3 i 4 działu II są uchylone.

## C. Upadły (art. 185–188)

- **Art. 185:** upadłym jest ten, wobec kogo wydano postanowienie o ogłoszeniu (ust. 1); ogłoszenie **nie wpływa na zdolność prawną i do czynności prawnych** (ust. 2 — skutki co do masy: art. 75–77); przekształcenia osób prawnych i jednostek po ogłoszeniu — tylko wg PrUp (ust. 3); koszty funkcjonowania organów upadłego ustala każdorazowo s.-k. jako koszty postępowania; zażalenie (ust. 4).
- **Art. 186:** uprawnienia upadłego jako wspólnika/członka **spółek i spółdzielni** wykonuje syndyk.
- **Art. 187:** brak zdolności procesowej bez przedstawiciela albo braki w organach → s.-k. ustanawia **kuratora** działającego w postępowaniu (kurator z art. 42 § 1 KC zostaje nim powołany); uzupełnienie braków → ustanowienie traci moc; wobec kuratora bez środków przymusu, odpowiada jak syndyk; wynagrodzenie wg nakładu pracy (przepisy wykonawcze do art. 9 pkt 3 ustawy o kosztach sądowych), + VAT; zażalenie także kuratorowi.
- **Art. 188:** śmierć upadłego — spadkobierca może uczestniczyć; nieznany lub niewstępujący → kurator (art. 187 odpowiednio); kurator traci umocowanie po wstąpieniu spadkobiercy wykazującego prawa prawomocnym postanowieniem o stwierdzeniu nabycia spadku; prawa i obowiązki upadłego — odpowiednio do spadkobiercy; odpowiednio przy kuratorze spadku.

## D. Wierzyciele i zgromadzenie wierzycieli (art. 189–200)

- **Art. 189:** wierzyciel = każdy uprawniony do zaspokojenia z masy, **choćby wierzytelność nie wymagała zgłoszenia**.
- **Art. 190:** wierzyciel bez zdolności sądowej/procesowej lub z brakami w organach — s.-k. **może** ustanowić kuratora, gdy usprawni to postępowanie; koszty obciążają tego wierzyciela (potrącane z wypłat; przy układzie lub niedoborze — postanowienie zobowiązujące, ściągane jak opłaty sądowe; zażalenie).

**Zgromadzenie wierzycieli:**
```
Zwołanie przez s.-k. (191): gdy ustawa wymaga uchwały / na wniosek co najmniej 2 wierzycieli
  mających łącznie ≥ 1/3 ogólnej sumy UZNANYCH wierzytelności / gdy uzna za potrzebne
Obwieszczenie: termin, miejsce, przedmiot, sposób głosowania — co najmniej 2 TYGODNIE przed (192)
Odroczenie: nowy termin podaje się obecnym, bez obwieszczenia; głos oddany wcześniej zachowuje
  moc przy tych samych lub korzystniejszych uchwałach (192 ust. 3)
Przewodniczy s.-k.; protokół (193)
Obowiązek stawiennictwa: syndyk, członkowie rady, upadły wezwany do wyjaśnień — ich
  niestawiennictwo nie tamuje zgromadzenia (194)
```

| Art. | Prawo głosu / większość |
|---|---|
| 195 | głosują wierzyciele z wierzytelnościami **uznanymi**, z sumą z listy; s.-k. może dopuścić wierzyciela warunkowego lub z wierzytelnością uprawdopodobnioną i oznaczyć sumę głosu |
| 196 | wierzytelność solidarna/niepodzielna — wspólny pełnomocnik (pełnomocnictwo z podpisem notarialnie poświadczonym; adwokat/radca bez poświadczenia; może nim być jeden z wierzycieli; powiadomienie s.-k.); brak wyboru → zarządca wg KC o zarządzie współwłasnością; brak obu nie wstrzymuje wyznaczenia terminu |
| 197 | **brak głosu** z wierzytelności nabytej przelewem/indosem **po** ogłoszeniu — chyba że wskutek spłaty długu, za który nabywca odpowiadał osobiście lub rzeczowo, ze stosunku sprzed ogłoszenia (ust. 2–4 uchylone) |
| 198 | głosowanie ustne lub pisemne; protokół z imieniem i nazwiskiem, kierunkiem głosu i sumą; wstrzymujący się = nieuczestniczący; głos przez pełnomocnika dopuszczalny |
| 199 | uchwały **bez względu na liczbę obecnych**, większością głosów wierzycieli mających ≥ **1/5** ogólnej sumy wierzytelności uprawnionych do uczestnictwa (ust. 1); **wyłączenie mienia z masy** — ≥ **2/3** sumy uznanych wierzytelności (ust. 2) |
| 200 | s.-k. może **uchylić** uchwałę sprzeczną z prawem, naruszającą dobre obyczaje albo rażąco naruszającą interes wierzyciela głosującego przeciw; zażalenie |

## E. Rada wierzycieli (art. 201–213)

**Ustanowienie i skład:**
```
S.-k. z urzędu (gdy potrzebne) albo na wniosek (201 ust. 1)
OBOWIĄZKOWO w TYGODNIU na wniosek: upadłego / co najmniej 3 wierzycieli / wierzyciela(i)
  z ≥ 1/5 sumy wierzytelności (201 ust. 2) — bez wierzycieli z art. 116 PrRestr i nabywców
  wierzytelności po ogłoszeniu (wyjątek: spłata długu jak w art. 197)
  [art. 116 PrRestr — wierzyciele osobiście/kapitałowo powiązani z dłużnikiem: małżonek,
   krewni i powinowaci, reprezentanci, spółki powiązane/dominujące/zależne, osoba fizyczna
   > 25% kapitału spółki kapitałowej — wg urzędowego t.j. DU/2026/533 z korpusu]
Do zatwierdzenia listy uprawnienia wierzycieli ustala się z: spisu wierzycieli dłużnika,
  spisu bezspornych wierzytelności syndyka, tytułów egzekucyjnych, spisu z restrukturyzacji (201 ust. 3)
Skład: 5 członków + 2 zastępców spośród wierzycieli-uczestników; 3 członków, gdy wierzycieli
  < 7 (202 ust. 1); odwołanie za nienależyte pełnienie (prawomocnie odwołany nie wraca);
  na własny wniosek (ust. 1a); można odmówić przyjęcia funkcji (ust. 3); zastępca głosuje
  za nieobecnego, w kolejności z postanowienia (ust. 4)
```

| Art. | Uprawnienie mniejszości / skład |
|---|---|
| 202a | wierzyciel(e) z ≥ **1/5** sumy (bez wyłączonych) wskazują członka rady — s.-k. powołuje, chyba że uzasadnione przypuszczenie nienależytego pełnienia; z ≥ **2/5** — po jednym kandydacie na każdą 1/5; zażalenie na oddalenie tylko wnioskodawcy; kolejny wniosek — tylko po odwołaniu ich członka |
| 203 | analogicznie zmiana składu rady na wniosek ≥ 1/5; członka powołanego z art. 202a/203 nie można odwołać bez żądania tych wierzycieli |
| 204 | członkowie działają osobiście albo przez pełnomocników (pełnomocnictwo — przewodniczącemu, do akt z protokołem) |
| 205 | rada pomaga syndykowi, kontroluje go, bada fundusze masy, udziela zezwoleń, opiniuje na żądanie s.-k./syndyka; kieruje się interesem ogółu wierzycieli; uwagi o syndyku do s.-k.; żądanie wyjaśnień i badanie ksiąg bez naruszania tajemnicy przedsiębiorstwa (spory rozstrzyga s.-k.) |

**Zezwolenie rady pod rygorem NIEWAŻNOŚCI (art. 206 ust. 1):**
```
1) dalsze prowadzenie przedsiębiorstwa ponad 3 MIESIĄCE od ogłoszenia
2) odstąpienie od sprzedaży przedsiębiorstwa jako całości
3) sprzedaż z wolnej ręki mienia masy
4) pożyczki, kredyty, obciążenie ograniczonymi prawami rzeczowymi
6) uznanie, zrzeczenie się, ugoda co do roszczeń spornych, zapis na sąd polubowny
(pkt 5 i ust. 1¹ uchylone)
Wyjątki: czynność niezwłoczna o wartości ≤ 10 000 zł — bez zezwolenia (ust. 2);
  sprzedaż ruchomości, gdy wartość oszacowania WSZYSTKICH ruchomości ≤ 50 000 zł (ust. 3);
  sprzedaż wierzytelności i praw, gdy wartość nominalna wszystkich ≤ 50 000 zł (ust. 4)
Wpis obciążenia bez zezwolenia → wykreślenie z urzędu na podstawie prawomocnego
  postanowienia s.-k.; zażalenie (ust. 5)
Brak rady albo bezczynność w terminie s.-k. lub z art. 308 ust. 2 → czynności rady
  wykonuje s.-k. (213)
```

**Działanie rady (art. 207–212):**
- **207:** uchwały na posiedzeniach (możliwe zdalne), chyba że regulamin inaczej; poza posiedzeniem — głosują **wszyscy członkowie**, bez zastępców; większość głosów w **2 tygodnie** od wniosku do rady; kontrola przez wskazanych członków; badanie ksiąg (koszty nie obciążają masy); sprawozdanie do s.-k.
- **207a:** uchwała w pełnym składzie (≥ **4** głosy) albo zgodna z wnioskiem upadłego → sąd **zmienia syndyka** na osobę wskazaną spełniającą art. 157 ust. 1 lub 2, chyba że niezgodne z prawem, rażąco narusza interes wierzycieli lub przypuszczenie nienależytego pełnienia; rada 3-osobowa — jednomyślnie; zażalenie na odmowę tylko członkom rady i upadłemu.
- **208:** pierwsze posiedzenie zwołuje syndyk niezwłocznie; regulamin, przewodniczący; posiedzenie może zwołać i prowadzić s.-k.
- **209:** protokół (przy zdalnym podpisuje przewodniczący); odpis protokołu i uchwał niezwłocznie s.-k. (i syndykowi nieobecnemu); nie dotyczy posiedzenia zwołanego przez s.-k.
- **210:** **zarzuty** przeciw uchwale — uczestnik i syndyk w **tydzień** (po terminie lub z brakami formalnymi — bez rozpoznania, bez wezwania z art. 130 § 1 KPC); s.-k. rozpoznaje w **tydzień**; może uchylić uchwałę sprzeczną z prawem lub naruszającą interes wierzycieli w **2 tygodnie** od przekazania (z zarzutów lub z urzędu); zażalenie tylko skarżącemu, upadłemu, członkom rady; **wykonanie uchwały najwcześniej po 2 tygodniach** od przekazania s.-k.; s.-k. może wstrzymać wykonanie (ust. 1 uchylony).
- **211:** zwrot koniecznych wydatków; wynagrodzenie do **3%** przeciętnego miesięcznego wynagrodzenia (art. 162 ust. 2) za dzień posiedzenia — koszty postępowania; postanowienie po wysłuchaniu członka i syndyka.
- **212:** członek odpowiada za szkodę z nienależytego pełnienia; za pełnomocnika jak za własne działanie.

## F. Przepisy ogólne postępowania po ogłoszeniu (art. 214–229)

| Art. | Reguła |
|---|---|
| 214 | sąd orzeka na posiedzeniu niejawnym, jeżeli ustawa nie stanowi inaczej |
| 215 | upadłość wszystkich wspólników spółki cywilnej — możliwe połączenie spraw (jeden s.-k., możliwie jeden syndyk, rada, wspólne zgromadzenie); osobne listy i plany podziału z uwzględnieniem solidarności; koszty dzielone przez sąd; odpowiednio spółka osobowa i wspólnicy odpowiadający bez ograniczenia, podmioty powiązane, małżonkowie |
| 216 | pełnomocnictwo — KC, jeżeli ustawa nie stanowi inaczej |
| 216a | pisma i dokumenty **wyłącznie przez system teleinformatyczny** na formularzach; inaczej — brak skutków prawnych (pouczenie; zbędne wobec organów); podpis: kwalifikowany, zaufany, osobisty lub uwierzytelnienie w systemie; załączniki elektroniczne; papierowe → elektronicznie poświadczone odpisy albo kopie elektroniczne (poświadczyć może też uczestnik/pełnomocnik z licencją doradcy restrukturyzacyjnego; protokół i uchwały rady — przewodniczący); przy kopii oryginał lub odpis do sądu w **3 dni** bez wezwania (art. 130 § 2 KPC odpowiednio); dane wnoszącego (PESEL/KRS/inne, firma, adres, NIP); telefon i e-mail fakultatywnie |
| 216aa | **wyjątek papierowy**: wierzyciele ze stosunku pracy (bez wynagrodzeń reprezentantów i zarządu/nadzoru), alimentacyjni, rentowi (odszkodowawczo, z zamiany dożywocia); mogą też ustnie w biurze podawczym **każdego sądu rejonowego** (pracownik wprowadza i podpisuje, osoba podpisuje wydruk); przy wnoszeniu przez system — art. 130 § 6 KPC odpowiednio |
| 216ab | z pominięciem systemu: informacje niejawne oraz **oferty w przetargu lub aukcji** |
| 216ac | delegacja: rozporządzenie MS o sposobie wnoszenia pism |
| 216b | organy postępowań upadłościowych współpracują |
| 217 | przesłuchanie upadłego, syndyka, wierzyciela, członka rady i innych na posiedzeniu (protokół) albo oświadczenia na piśmie (dowód), także z podpisem notarialnie poświadczonym; nieobecność nie tamuje; odpowiednio świadkowie i biegli |
| 218 | syndyk wnosi do s.-k. o przeprowadzenie dowodu; postępowanie dowodowe prowadzi s.-k. |
| 218a | pouczenia uczestnika bez profesjonalnego pełnomocnika przy wyznaczeniu rozprawy (pełnomocnik nieobowiązkowy; zastrzeżenie do protokołu najpóźniej na kolejnym posiedzeniu — skutki jego braku dla reprezentowanego; fakty przyznane; uznanie faktów za przyznane) |
| 219 | orzeczenia — **postanowienia**; z niejawnego posiedzenia uzasadniane z urzędu, gdy zaskarżalne; utrwalane w systemie z kwalifikowanym podpisem; dostęp uczestników do akt przez system; informacja o terminie i sposobie zaskarżenia albo o jego braku; numer składnika masy ze spisu inwentarza (postanowienia o składnikach — obwieszczane); numer zgłoszenia i pozycji listy przy wierzytelnościach; odpowiednio uchwały rady i zgromadzenia; prawomocność ujawnia sekretariat, obwieszczenie — organ |
| 219a | w KRZ rejestr aktualnego składu i stanu masy (dane o wierzytelnościach upadłego — art. 69 ust. 1ca) oraz w aktach rejestr stanu wierzytelności i niezaspokojonych zobowiązań masy |
| 220 | doręczenia postanowień z niejawnego posiedzenia: upadłemu, zainteresowanym, syndykowi; nie wierzycielom przy sprawach ogółu; **przez system** (art. 131¹ § 2 KPC); zaskarżalne — z uzasadnieniem; nie dotyczy osób z 216aa (mogą wybrać e-doręczenie, rezygnacja działa na przyszłość); **pierwsze doręczenie** osobie, która nie wniosła pisma — tradycyjnie; brak konta w systemie → pismo **pozostawia się w aktach ze skutkiem doręczenia** (pouczenie przy pierwszym doręczeniu) |
| 220a | s.-k. może wzywać, zawiadamiać i doręczać w najbardziej celowy sposób, nawet z pominięciem przepisów ogólnych, byle adresat mógł zapoznać się z treścią |
| 221 | obwieszczenia w KRZ (z informacją o zaskarżeniu, gdy termin biegnie od obwieszczenia); także inny sposób (s.-k.), na żądanie i koszt upadłego/wierzyciela; każdy ma dostęp do obwieszczonych danych |
| 222 | zażalenie tylko w przypadkach ustawowych; na postanowienia s.-k. — sąd upadłościowy jako II instancja; na postanowienia sądu upadłościowego — inny skład tego sądu, **wyjątek**: art. 163 ust. 4, 166 ust. 6, 172 ust. 1, 362 ust. 1, 365 ust. 3, 366 ust. 3, 368, 370a ust. 10, 370d ust. 1–2, 370e ust. 1, 370f ust. 3, 371 ust. 3, 491¹ ust. 2, 491⁵ ust. 2, 491¹²ᵃ ust. 8, 491¹⁴ ust. 7, 491¹⁹ ust. 1–3, 491²⁰ ust. 1, 491²¹ ust. 1, 491²² ust. 1–2 → sąd II instancji w składzie 3 sędziów; doręczenia odpisów zażalenia; rozpoznanie w **30 dni** od przedstawienia akt |
| 223 | **brak skargi kasacyjnej** (chyba że ustawa inaczej) i **brak skargi o stwierdzenie niezgodności z prawem** |
| 224 | **zażalenie — tydzień**; bieg: od **zamieszczenia** w systemie (niejawne); od **obwieszczenia** (gdy podlega); od **doręczenia** (dla adresatów obowiązkowego doręczenia); postanowienie ogłoszone na jawnym — wniosek o uzasadnienie w tydzień (od posiedzenia / zamieszczenia / obwieszczenia), termin od doręczenia z uzasadnieniem; czynności rady, syndyka i innych organów — od zamieszczenia pouczenia w systemie |
| 225 | skarga na czynności komornika do s.-k. w **tydzień** od zakończenia czynności |
| 226 | zabezpieczenie przez depozyt sądowy; wydanie — s.-k. po wysłuchaniu; zażalenie (ust. 3 uchylony) |
| 227 | sumy masy i ze zbycia obciążonych składników (jeżeli nie do natychmiastowego wydania) — na **oprocentowany rachunek bankowy** lub rachunek depozytowy Ministra Finansów |
| 228 | dostęp do akt przez system (uczestnicy i każdy, kto usprawiedliwi potrzebę); wydruki weryfikowalne = urzędowe odpisy; **od obwieszczenia w KRZ nie można zasłaniać się nieznajomością**, chyba że mimo należytej staranności nie dało się dowiedzieć |
| 228a | syndyk prowadzi w systemie **akta do zgłoszeń wierzytelności** (wprowadza pisma papierowe z 216aa); udostępnia w biurze — dni powszednie, co najmniej **4 kolejne godziny** między 8.00 a 20.00; część akt sądowych; przejmuje je nowy syndyk; dostęp dla nadzoru MS |
| 229 | odpowiednio księga I część I KPC — **bez** art. 130², 139¹, 205¹, 205², 205⁴–205¹², przepisów o zawieszeniu, wznowieniu i postępowaniu gospodarczym; pouczenia wg wzorów w systemie |

## G. Koszty i zobowiązania masy (art. 230–234)

```
Koszty postępowania (230 ust. 1): wydatki bezpośrednio na ustalenie, zabezpieczenie, zarząd
  i likwidację masy oraz ustalenie wierzytelności — m.in. wynagrodzenie syndyka i zastępcy,
  osób zatrudnionych przez syndyka + składki ZUS, wynagrodzenie i wydatki rady, zgromadzenie
  wierzycieli, archiwizacja, korespondencja, ogłoszenia, pomieszczenia, podatki i daniny
  związane z likwidacją
Inne zobowiązania masy (230 ust. 2): wszystkie pozostałe powstałe PO ogłoszeniu — m.in.
  należności pracownicze za czas po ogłoszeniu, bezpodstawne wzbogacenie masy, umowy, których
  wykonania zażądał syndyk (art. 98), inne z czynności syndyka, renty za czas po ogłoszeniu
Niezaspokojone koszty i zobowiązania masy po zakończeniu ponosi UPADŁY; przy uchyleniu
  postępowania s.-k. może zwolnić z kosztów sądowych; zażalenie (231; ust. 1 uchylony)
Brak płynnych funduszów → zgromadzenie o zaliczkę wierzycieli albo zobowiązanie największych
  wierzycieli (łącznie ≥ 30% sumy) do zaliczki; bez listy — spis dłużnika / spis z restrukturyzacji
  / spis bezspornych wierzytelności syndyka (232)
Wierzyciel nie odzyskuje swoich kosztów — wyjątki: skuteczny sprzeciw wobec cudzej wierzytelności;
  zaliczka złożona na żądanie s.-k. lub z uchwały, jeżeli fundusze masy wystarczą (233)
Od wierzyciela nie żąda się zwrotu do masy kosztów jego czynności; po zakończeniu upadły nie
  żąda zwrotu kosztów od wierzyciela — chyba że uchylenie upadłości i wniosek w złej wierze (234)
```
⛔ Kategorie z art. 230 (koszty / inne zobowiązania masy) to nie kategorie zaspokojenia z art. 342 — kolejność zaspokojenia → `mod-PrUpad-podzial-335-360`.

---

## TERMINY — ZESTAWIENIE

| Termin | Zdarzenie początkowe | Podstawa |
|---|---|---|
| 2 tyg. | obwieszczenie zgromadzenia wierzycieli (przed terminem) | art. 192 ust. 2 |
| tydzień | wniosek uprawnionych — ustanowienie rady przez s.-k. | art. 201 ust. 2 |
| 3 mies. | prowadzenie przedsiębiorstwa bez zezwolenia rady (od ogłoszenia) | art. 206 ust. 1 pkt 1 |
| 2 tyg. | wniosek do rady — podjęcie uchwały | art. 207 ust. 1b |
| tydzień | zarzuty przeciw uchwale rady | art. 210 ust. 2 |
| tydzień | rozpoznanie zarzutów przez s.-k. | art. 210 ust. 3 |
| 2 tyg. | uchylenie uchwały rady / najwcześniejsze wykonanie uchwały (od przekazania s.-k.) | art. 210 ust. 4–5 |
| 3 dni | złożenie oryginału przy kopii elektronicznej dokumentu | art. 216a ust. 1e |
| tydzień | zażalenie (zamieszczenie / obwieszczenie / doręczenie) | art. 224 ust. 1–3 |
| tydzień | wniosek o uzasadnienie postanowienia z posiedzenia jawnego | art. 224 ust. 4 |
| 30 dni | rozpoznanie zażalenia (od przedstawienia akt) | art. 222 ust. 5 |
| tydzień | skarga na czynności komornika (od zakończenia czynności) | art. 225 |

## PUŁAPKI

- Art. 179 obowiązuje (należyta staranność); uchylone są rozdziały 3–4 działu II — wcześniejsza wersja modułu błędnie podawała art. 179 jako uchylony.
- Referendarz jako s.-k.: na jego postanowienie służy **skarga**, nie zażalenie, i nie wykona on czynności z art. 151 ust. 1b.
- Głos na zgromadzeniu — suma z listy; nabywca wierzytelności po ogłoszeniu nie głosuje (197) i nie liczy się do wniosków o radę (201–203).
- Wstrzymanie się od głosu = brak udziału w głosowaniu (198).
- Brak zezwolenia rady z art. 206 = nieważność czynności; uwzględnij progi 10 000 zł / 50 000 zł.
- Uchwała rady nie jest wykonalna przed upływem 2 tygodni od przekazania s.-k. (210 ust. 5).
- Pismo papierowe uczestnika spoza 216aa/216ab nie wywołuje skutków (216a ust. 1) — sprawdź wyjątek przed uznaniem pisma za bezskuteczne.
- Brak konta w systemie = doręczenie przez pozostawienie w aktach (220 ust. 6).
- Termin zażalenia biegnie od różnych zdarzeń (224) — wskaż właściwe.
- Brak skargi kasacyjnej i skargi o niezgodność z prawem (223).

## POWIĄZANIA

- Ogłoszenie i postępowanie przed ogłoszeniem → `mod-PrUpad-wniosek-ogloszenie`
- Syndyk (156–178), likwidacja → `mod-PrUpad-syndyk-likwidacja`
- Lista wierzytelności, sprzeciwy → `mod-PrUpad-wierzytelnosci-235-266`
- Kategorie zaspokojenia, plan podziału → `mod-PrUpad-podzial-335-360`
- Tryb konsumencki (inne kompetencje, wyjątki z art. 222 ust. 1a) → `mod-PrUpad-konsument-workflow`
- Wierzyciele powiązani (art. 116 PrRestr) → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`

## WYNIK

Macierz organ – czynność – podstawa – wymagane zezwolenie – środek zaskarżenia – termin; rejestr doręczeń (sposób i data skutku); kalkulacja głosów i większości (195–199, 202a); kwalifikacja kosztów (230–233).
