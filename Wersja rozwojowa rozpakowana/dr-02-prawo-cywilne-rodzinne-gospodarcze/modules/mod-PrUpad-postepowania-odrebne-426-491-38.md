# Upadłość — postępowania odrębne: banki, SKOK, banki hipoteczne, instytucje transgraniczne, ubezpieczyciele, emitenci obligacji, układ konsumencki (PrUp art. 426–491, 491²⁵–491³⁸)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535), s. 85–99 i 108–111
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** [DU/2026/1206](https://api.sejm.gov.pl/eli/acts/DU/2026/1206/text.pdf) art. 7 — **art. 452 ust. 1 i art. 456 ust. 1** w nowym brzmieniu **od 11.01.2027** (art. 57 nowelizacji); do tej daty stosuj brzmienie z t.j. → `references/insolvency/wersje-i-przepisy-przejsciowe.md`. Art. 440 ust. 2 pkt 1 w brzmieniu nadanym DU/2026/340 (od 31.03.2026) — ujęty w t.j.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article 440 --verify-online`. Akty sektorowe (Prawo bankowe, ustawa o BFG, ustawa o listach zastawnych, ustawa o obligacjach, ustawa o działalności ubezpieczeniowej, rozp. 575/2013) odczytuj osobno z ELI/EUR-Lex — nie z pamięci. Upadłość konsumencka (art. 491¹–491²⁴) → `mod-PrUpad-konsument-workflow`.

---

## FAZA 0 — INTAKE

```
□ Typ dłużnika → tytuł: bank (426–441) / SKOK (441a) / bank hipoteczny (442–450a) / bank lub firma inwestycyjna z elementem EOG (451–470) /
  zakład ubezpieczeń lub reasekuracji (471–482) / emitent obligacji zabezpieczonych (483–491) / konsument — układ na zgromadzeniu (491²⁵–491³⁸)
□ Legitymacja do wniosku: tylko KNF/BFG (bank, SKOK), tylko dłużnik/KNF (ubezpieczyciel)
□ Wcześniejsze postępowanie układowe / przymusowa restrukturyzacja (433, 434, 440 ust. 3)?
□ Masy osobne: listy zastawne (442), rezerwy techniczno-ubezpieczeniowe (477, 477¹), zabezpieczenie obligacji (488)
□ Kuratorzy: banku (429), posiadaczy listów zastawnych (443), ubezpieczonych (473), obligatariuszy (484) — albo administrator hipoteki (484 ust. 2)
□ Kategorie zaspokojenia w banku — art. 440 (10 kategorii), nie art. 342
□ Element EOG: oddziały, państwo siedziby, prawo właściwe (460–470), obwieszczenia w Dz.Urz. i językach (456–457)
□ Bank hipoteczny: terminy testów (3 i 4 mies.), przedłużenie wymagalności (12 mies. / 3 lata)
□ Ubezpieczyciel: przeniesienie portfela — 3 mies. (obowiązkowe, życie) / 1 mies. (inne) od ogłoszenia (476)
□ Konsument-układ: zdolność zarobkowa, zaliczka 1× GUS III kw., terminy 30 dni / 3–4 mies. / 21 dni / 6 mies.
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 426–441 | bank: niewypłacalność bilansowa, wnioskodawcy, wysłuchanie, kurator, skutki, układ, sprzedaż przedsiębiorstwa, kategorie zaspokojenia | A |
| 441a | SKOK | A |
| 442–450a | bank hipoteczny: osobna masa listów zastawnych, kurator, testy, przedłużenie wymagalności, kolejność zaspokojenia | B |
| 451–470 | instytucje kredytowe, firmy inwestycyjne, banki z elementem EOG: zakres, jurysdykcja, uznanie, obwieszczenia, prawo właściwe | C |
| 471–482 | zakłady ubezpieczeń i reasekuracji: wnioskodawcy, syndyk, kurator, portfel, osobne masy, element EOG | D |
| 483–491 | emitenci obligacji zabezpieczonych: kurator / administrator hipoteki, osobna masa | E |
| 491²⁵–491³⁸ | konsument — postępowanie o zawarcie układu na zgromadzeniu wierzycieli (tytuł VI) | F |
| uchylone | 428, 430, 431, 435, 447 (oraz 427 ust. 4, 429 ust. 1–2, 437 ust. 1, 474 ust. 3) | — |

---

## A. Banki i SKOK (art. 426–441a)

- **Art. 426:** bank jest niewypłacalny także, gdy według **bilansu na koniec okresu sprawozdawczego aktywa nie wystarczają na zobowiązania** (ust. 1), bez zobowiązań z art. 11 ust. 4a (ust. 1a). Wniosek — **wyłącznie KNF albo BFG** (ust. 2); we wniosku można wskazać **bank jako syndyka** (ust. 2a). Nie stosuje się art. 11 ust. 3, 4 i 5–7 oraz **art. 38–43** (zabezpieczenie) (ust. 3).
- **Art. 427:** przed ogłoszeniem sąd wysłuchuje co do podstaw i osoby syndyka: KNF, BFG, banku wskazanego na syndyka, prezesa i członków ostatniego zarządu / zarządu komisarycznego / likwidatora (ust. 1); przy banku zależnym od Skarbu Państwa — także podmiotu wykonującego prawa z akcji SP (ust. 1a); można odstąpić od wysłuchania zarządu, gdy spowodowałoby zwłokę (ust. 2). Syndykiem może być bank wskazany we wniosku po **pozytywnej opinii** KNF (wniosek BFG) albo BFG (wniosek KNF) (ust. 3; ust. 4 uchylony).
- **Art. 428:** uchylony.
- **Art. 429:** sąd w postanowieniu ustanawia **kuratora do reprezentowania banku** (art. 187 ust. 3–4) (ust. 3); **BFG** ustanawia się kuratorem na jego wniosek (ust. 4); ust. 1–2 uchylone.
- **Art. 430, 431:** uchylone.
- **Art. 432:** sprawozdania syndyka z art. 168 przekazuje się do wiadomości **KNF**.
- **Art. 433:** z ogłoszeniem (o ile nie wcześniej wskutek postępowania układowego): **rozwiązanie organów** zarządzających i nadzorczych (pkt 1); wygaśnięcie zarządu komisarycznego, powołania likwidatora i kuratora z art. 144 ust. 1 Prawa bankowego (pkt 2); wygaśnięcie uprawnień członków organów do **odpraw** i wynagrodzenia po ogłoszeniu (pkt 3).
- **Art. 434:** z ogłoszeniem rozwiązują się: **umowy rachunku bankowego** (oprocentowanie do dnia ogłoszenia) (pkt 1); umowy kredytu i pożyczki, jeżeli środków nie oddano do dyspozycji (pkt 2); poręczenia, gwarancje, akredytywy, jeżeli bank nie otrzymał prowizji (pkt 3); umowy skrytek sejfowych i przechowania — wydanie w terminie uzgodnionym (pkt 4).
- **Art. 434a:** zgoda banku/SKOK z art. 25 ust. 1 pkt 1–2 ustawy o ochronie nabywcy (lub zobowiązanie do niej — art. 76 ust. 4 zd. 2 ustawy o KW i hipotece) dla nieruchomości przedsięwzięcia deweloperskiego **pozostaje w mocy**; art. 425c pkt 2 odpowiednio.
- **Art. 435:** uchylony.
- **Art. 436:** propozycje układowe mogą złożyć także akcjonariusze (członkowie) reprezentujący **2/3 kapitału zakładowego** (funduszu udziałowego banku spółdzielczego) oraz bank zrzeszający (ust. 1); przed zatwierdzeniem układu — **opinia KNF** (ust. 2).
- **Art. 437:** warunki nabycia przedsiębiorstwa bankowego przez inne banki i termin ofert ustala sędzia-komisarz po opinii **KNF i BFG** (ust. 2); zatwierdzenie wyboru oferty — po opinii KNF i BFG (ust. 3); **bez pre-packu** (art. 56a–56h) (ust. 4); ust. 1 uchylony.
- **Art. 438:** nabywca przedsiębiorstwa bankowego **przejmuje zobowiązania z rachunków bankowych** (ust. 1). Gdy cena nie pozwoliłaby na pełne pokrycie należności z art. 39 ust. 1 ustawy o BFG — sprzedaż z przejęciem tych należności albo bez przejęcia zobowiązań z rachunków (ust. 1a); wybór sposobu i warunków — sędzia-komisarz, zażalenie (ust. 1b); syndyk zgłasza sprzedaż do rejestru (ust. 2).
- **Art. 439:** przy braku sprzedaży w całości — sprzedaż poszczególnych składników za zezwoleniem sędziego-komisarza.
- **Art. 440 — kategorie zaspokojenia w banku** (ust. 1–2):
  - **I** — należności z art. 39 ust. 1 ustawy o BFG z odsetkami i kosztami egzekucji; należności ze stosunku pracy sprzed ogłoszenia (bez reprezentantów i osób zarządzających/nadzorujących); należności rolników z dostaw z własnego gospodarstwa; alimenty; renty odszkodowawcze i z zamiany dożywocia; należności instytucji zabezpieczenia społecznego (rozp. 883/2004 art. 3 ust. 1), w tym PFRON, ubezpieczenia zdrowotnego i pomocy społecznej;
  - **II** — należności osób fizycznych, mikro-, małych i średnich przedsiębiorców ze środków objętych ochroną gwarancyjną innych niż środki gwarantowane (art. 2 pkt 65 ustawy o BFG);
  - **III** — a) pozostałe należności ze środków objętych ochroną gwarancyjną innych niż gwarantowane, b) pozostałe należności z umów rachunku bankowego, c) odsetki od należności z kat. I, II i podkat. a–b, d) inne należności, w tym podatki i daniny oraz pozostałe składki;
  - **IV** — a) odsetki od III d, sądowe grzywny i administracyjne kary pieniężne, darowizny i zapisy, b) należności jednostki zarządzającej systemem ochrony (art. 130e ust. 1 Prawa bankowego; art. 22d ust. 1 pkt 2 ustawy o bankach spółdzielczych);
  - **V** — pożyczki wspólników/akcjonariuszy spółki kapitałowej z **5 lat** przed ogłoszeniem;
  - **VI** — obligacje i instrumenty dłużne (z wyłączeniem kat. IX) przy łącznym spełnieniu: zapadalność pierwotna **≥ rok**, wyraźne określenie kategorii w dokumentacji emisji, brak instrumentów pochodnych i produktów strukturyzowanych (rozp. 600/2014), wartość nominalna **≥ 400 000 zł** (kurs średni NBP z dnia decyzji o emisji); ust. 2a — także instrumenty o zmiennym oprocentowaniu opartym na wskaźniku referencyjnym (rozp. 2016/1011) i denominowane w walucie obcej;
  - **VII** — zobowiązania podporządkowane niezaliczane do funduszy własnych;
  - **VIII / IX / X** — zobowiązania zaliczane do funduszy własnych z art. **62 / 51 / 26** rozp. 575/2013; ust. 2b — instrument częściowo uznany za fundusze własne — w całości w kategorii przypisanej instrumentowi.
  - Ust. 3 — najpierw **koszty postępowania**, potem **koszty przymusowej restrukturyzacji** niepokryte z jej przychodów, następnie inne zobowiązania masy (art. 230 ust. 2); art. 343 ust. 1a i 2 oraz 344 stosuje się. Ust. 4 — należności **BFG** z wypłaty środków gwarantowanych **bez zgłoszenia**, na liście z urzędu. Ust. 5 — przy kat. V art. 342 ust. 5 pkt 2–3 i ust. 6. Ust. 6 — roszczenia **FGŚP** jak należności ze stosunku pracy.
- **Art. 441:** wierzytelności zabezpieczone ograniczonymi prawami rzeczowymi — według art. 345 i 346.
- **Art. 441a (SKOK):** wniosek **wyłącznie KNF albo BFG** (ust. 1); na syndyka można wskazać bank albo SKOK (ust. 1a) — po pozytywnej opinii KNF (wniosek BFG) albo BFG (wniosek KNF) (ust. 2); propozycje układowe mogą złożyć członkowie reprezentujący **2/3 funduszu udziałowego** (ust. 3); w pozostałym zakresie art. 426–441 odpowiednio (ust. 4).

## B. Banki hipoteczne (art. 442–450a)

- **Art. 442:** **osobna masa** na zaspokojenie wierzycieli z **listów zastawnych** i z instrumentów pochodnych wpisanych do rejestru zabezpieczenia: wierzytelności oraz prawa i środki z art. 18 ust. 3, 3a i 4 ustawy o listach zastawnych wpisane do rejestru (pkt 1), spłaty tych wierzytelności (pkt 2), składniki uzyskane w zamian (pkt 3) (ust. 1); w razie wątpliwości — należą do masy osobnej do wartości ujawnionej w rejestrze (ust. 2); **nadwyżka** po zaspokojeniu — do masy ogólnej (ust. 3).
- **Art. 442a:** **zakaz potrącenia** z wierzytelnościami należącymi do masy osobnej (ust. 1); wyjątki: instrumenty pochodne spełniające art. 18a ust. 1 ustawy o listach zastawnych (zaspokajane jak listy) (ust. 2), rozliczenia w systemach płatności i rozrachunku oraz zabezpieczenia finansowe (ust. 3).
- **Art. 443:** sąd ustanawia **kuratora posiadaczy listów zastawnych** po opinii KNF (ust. 1); art. 187 ust. 3–4 i przepisy o sprawozdaniach syndyka (ust. 2); posiadacze mogą działać osobiście/przez pełnomocnika po **dopuszczeniu przez sędziego-komisarza** (ust. 3).
- **Art. 444:** kurator w **21 dni** od ogłoszenia zgłasza: sumę nominalną listów wymagalnych przed ogłoszeniem i niezapłacone odsetki (pkt 1); sumę listów i odsetek płatnych po ogłoszeniu oraz premii (pkt 2).
- **Art. 445:** prawo kuratora do informacji i wglądu w księgi (ust. 1); głos na zgromadzeniu tylko w sprawach wpływających na prawa posiadaczy listów (ust. 2).
- **Art. 445a:** **zgromadzenie wierzycieli z listów zastawnych** na wniosek **≥ 10%** wartości nominalnej listów w obrocie (ust. 1); uchwały bez kworum, większością **> 50%** wartości nominalnej (ust. 2); zgoda zgromadzenia na sprzedaż składników z rejestru: w całości, gdy wpływy nie pokryją kosztów i roszczeń; w części — poniżej **wartości godziwej** (ust. 3).
- **Art. 445b:** likwidacja masy osobnej z udziałem kuratora (ust. 1); sprzedaż z wolnej ręki wymaga też **zgody kuratora** (ust. 2); składniki z rejestru sprzedaje się **innemu bankowi hipotecznemu** z przejściem zobowiązań wobec wierzycieli z listów bez ich zgody; obwieszczenie (ust. 3); umowa sprzedaży wierzytelności hipotecznej — podstawa wpisu w KW (ust. 4); sprzedaż części przedsiębiorstwa obejmującej masę osobną — uchwała **2/3** wartości nominalnej; listy nie są objęte sprzedażą, syndyk określa udział w cenie dla wierzycieli z listów (ust. 5).
- **Art. 446:** z ogłoszeniem terminy wymagalności wobec wierzycieli z listów **przedłużają się o 12 miesięcy** (ust. 1); zobowiązania wymagalne przed ogłoszeniem — zaspokojenie w 12 miesięcy, nie wcześniej niż po pierwszym obwieszczeniu wyników testów (z zastrzeżeniem 446c ust. 1 pkt 1) (ust. 2); odsetki według warunków emisji (ust. 3).
- **Art. 446a:** syndyk w **3 miesiące** od ogłoszenia przeprowadza **test równowagi pokrycia** (art. 25 ust. 2 pkt 1 ustawy o listach zastawnych), a przy wyniku pozytywnym — **test płynności** (pkt 2) (ust. 1); kolejne: płynności co ≤ 3 mies., równowagi co ≤ 6 mies.; po negatywnym teście równowagi — koniec testów (ust. 2); uwzględnia się zobowiązania z art. 446 ust. 2 (ust. 3); nadzór kuratora, odrębnie dla hipotecznych i publicznych listów (ust. 4); wynik pozytywny = masa osobna wystarcza na pełne zaspokojenie (ust. 5); wyniki do **KNF** — uwagi w **2 tygodnie** (ust. 6); do sędziego-komisarza — pierwsze najpóźniej w **4 miesiące** od ogłoszenia (ust. 7); sędzia-komisarz obwieszcza wyniki i postanowienie o sposobie prowadzenia postępowania (ust. 8).
- **Art. 446b (oba testy pozytywne):** zaspokojenie według warunków emisji (z przedłużeniem z 446 ust. 1); syndyk może zawierać umowy pochodne (ust. 1). Zgromadzenie w **2 miesiące** od obwieszczenia wyników, większością **2/3**, może zobowiązać syndyka do sprzedaży całej masy osobnej: bankowi hipotecznemu z przejściem zobowiązań albo bankowi bez przejścia (ust. 2); wniosek o zwołanie w **miesiąc** (ust. 3); przy sprzedaży bez przejścia — odsetki do dnia sprzedaży (ust. 4). Wcześniejsze proporcjonalne zaspokojenie, gdy wpływy pomniejszone o odsetki za **6 miesięcy** i kwoty z 446 ust. 2 wynoszą **≥ 5%** wartości nominalnej listów w obrocie; bez art. 356 ust. 3 (ust. 5); umorzenie listów w części zaspokojonej (ust. 6); wypłata w najbliższym terminie odsetkowym, nie wcześniej niż **2 miesiące** po sprawozdaniu syndyka, a przy postanowieniu z art. 168 ust. 5b — **14 dni** po jego uprawomocnieniu (ust. 7).
- **Art. 446c (równowaga pozytywna, płynność negatywna):** przedłużenie wymagalności nominału (także wymagalnego przed ogłoszeniem) **o 3 lata od najpóźniejszego terminu wymagalności wierzytelności w rejestrze** (ust. 1 pkt 1); wcześniejsze proporcjonalne zaspokojenie przy progu **5%** po potrąceniu odsetek za 6 miesięcy i kosztów masy osobnej; umorzenie listów w części zaspokojonej (pkt 2); wypłaty jak 446b ust. 7 (ust. 2); zgromadzenie w **3 miesiące**, większością 2/3, może wyłączyć ust. 1 albo przejść do procedury z 446d (ust. 3).
- **Art. 446d (równowaga negatywna):** odpowiednio art. 446b ust. 7 i 446c ust. 1, chyba że zgromadzenie (2/3) zgodzi się na **likwidację masy osobnej** (ust. 1); z dniem uchwały zobowiązania **stają się wymagalne** (ust. 2); sprzedaż bankowi niebędącemu bankiem hipotecznym bez przejścia zobowiązań albo podmiotowi niebędącemu bankiem (składniki niezastrzeżone dla banków) (ust. 3); przy sprzedaży bez przejścia — odsetki do dnia sprzedaży (ust. 4).
- **Art. 447:** uchylony.
- **Art. 448:** kolejność z masy osobnej: (1) koszty likwidacji masy (z wynagrodzeniem kuratora), odsetki i należności uboczne z listów i okresowe płatności odsetkowe z pochodnych; (2) roszczenia z listów według wartości nominalnej i z instrumentów pochodnych.
- **Art. 449:** niedobór masy osobnej → zaspokojenie w podziale **funduszów masy ogólnej**; kwotę przekazuje się do funduszu masy osobnej.
- **Art. 450:** listy zastawne będące **własnością upadłego** nie mogą wejść do obiegu — umorzenie.
- **Art. 450a:** do upadłości banków hipotecznych **nie stosuje się tytułu Va części I**.

## C. Instytucje kredytowe, firmy inwestycyjne, banki z elementem EOG (art. 451–470)

- **Art. 451 — zakres:** upadłość banku krajowego działającego też w innym państwie UE/EFTA-EOG (pkt 1); upadłość, układ lub podobne postępowanie wobec **instytucji kredytowej** działającej też w PL (pkt 2); wobec **banku zagranicznego** działającego w PL i w innym państwie UE/EOG (pkt 3); upadłość **domu maklerskiego** działającego w PL i innym państwie UE/EOG (pkt 4); wobec **zagranicznej firmy inwestycyjnej** działającej w PL (pkt 5).
- **Art. 452:** definicje instytucji bankowych — według Prawa bankowego (ust. 1; **nowe brzmienie od 11.01.2027 — DU/2026/1206**); firm inwestycyjnych i domu maklerskiego — według ustawy o obrocie instrumentami finansowymi (ust. 1a); „sąd zagraniczny” i „zarządca zagraniczny” — w państwach UE/EFTA-EOG (ust. 2).
- **Art. 453:** **brak jurysdykcji** sądów polskich w sprawach upadłościowych instytucji kredytowych i zagranicznych firm inwestycyjnych działających lub mających majątek w PL; art. 405 ust. 1 nie stosuje się (brak wtórnego postępowania).
- **Art. 454:** orzeczenie o wszczęciu postępowania wobec instytucji kredytowej / zagranicznej firmy inwestycyjnej w państwie jej **siedziby** w UE/EOG podlega uznaniu **z mocy prawa**.
- **Art. 455:** masa banku krajowego i domu maklerskiego obejmuje mienie na terytorium państw UE/EOG.
- **Art. 456:** sąd niezwłocznie powiadamia organy państw, w których są oddziały, o upadłości i jej skutkach (ust. 1; **nowe brzmienie od 11.01.2027 — DU/2026/1206**). Gdy postępowanie może wpływać na prawa osób trzecich w UE/EOG lub przysługuje im zażalenie — obwieszczenie w **Dzienniku Urzędowym Wspólnot Europejskich** (brzmienie t.j.) i w **dwóch czasopismach ogólnokrajowych** w każdym państwie oddziału; termin zażalenia od obwieszczenia w Dzienniku Urzędowym (ust. 2); w języku urzędowym państwa, z celem, podstawami, terminem i adresem sądu (ust. 3).
- **Art. 457:** wezwanie wierzycieli z UE/EOG z nagłówkiem „Wezwanie do zgłaszania wierzytelności. Termin zgłoszenia” **we wszystkich językach urzędowych UE oraz norweskim i islandzkim**; termin, skutki uchybienia, informacja, czy uprzywilejowani i zabezpieczeni muszą zgłaszać, obowiązek dowodów (ust. 1); art. 176 ust. 1 i 1a odpowiednio (ust. 1a); zgłoszenie w języku państwa wierzyciela z nagłówkiem po polsku „Zgłoszenie wierzytelności”; sąd może żądać tłumaczenia (ust. 2).
- **Art. 458:** wierzyciele z UE/EOG mają **takie same prawa** jak krajowi (ust. 1); zagraniczne należności publicznoprawne — **kat. III podkat. 4** (ust. 2).
- **Art. 459:** zarządca zagraniczny instytucji kredytowej z oddziałem w PL / zagranicznej firmy inwestycyjnej wykazuje umocowanie poświadczonym odpisem z **tłumaczeniem** (ust. 1); ma w PL uprawnienia z państwa powołania (ust. 2); obowiązek wniosku o **ujawnienie** postępowania w KW, KRS i rejestrach; koszty — koszty postępowania (ust. 3).
- **Art. 459¹:** syndyk informuje wierzycieli z innych państw UE/EOG o czynnościach **nie rzadziej niż co 6 miesięcy**.
- **Art. 460:** w postępowaniu wszczętym w PL — **prawo polskie**, chyba że rozdział stanowi inaczej.
- **Art. 461:** stosunki pracy za granicą UE/EOG — prawo umowy o pracę (ust. 1); kwalifikacja nieruchomości — lex rei sitae (ust. 2); umowy o korzystanie/nabycie nieruchomości za granicą — prawo państwa położenia (ust. 3); prawa do nieruchomości, statków i statków powietrznych w rejestrze — prawo państwa rejestru (ust. 4).
- **Art. 462:** upadłość **nie narusza praw rzeczowych** wierzycieli i osób trzecich na mieniu w innym państwie UE/EOG (zastaw, hipoteka, prawo zaspokojenia z pożytków, windykacja, korzystanie powiernicze) (ust. 1) i praw osobistych wpisanych do rejestrów (ust. 2); możliwa skarga o nieważność / bezskuteczność czynności krzywdzących (ust. 3).
- **Art. 463:** **zastrzeżenie własności** nie wygasa przy upadłości banku-kupującego, gdy rzecz była w innym państwie UE/EOG (ust. 1); upadłość banku-sprzedawcy nie uzasadnia odstąpienia, jeżeli rzecz wydano przed ogłoszeniem i była za granicą (ust. 2); ust. 3 jak 462 ust. 3.
- **Art. 464:** wykonywanie praw wymagających wpisu do ksiąg/rejestrów, zapisu na rachunku lub depozytu centralnego — prawo państwa ich prowadzenia.
- **Art. 465:** prawo **odkupu** — prawo właściwe dla umowy (z zastrzeżeniem 464).
- **Art. 466:** transakcje na **rynku regulowanym** — prawo właściwe dla transakcji na tym rynku (z zastrzeżeniem 464).
- **Art. 467:** **kompensowanie** (netting) — prawo właściwe dla umowy o kompensowanie.
- **Art. 467¹:** upadłość nie narusza prawa do **potrącenia**, jeżeli dopuszcza je prawo właściwe dla wierzytelności upadłego.
- **Art. 468:** skuteczność rozporządzeń upadłego **po ogłoszeniu** nieruchomością, statkiem, prawami rejestrowymi — prawo państwa położenia / rejestru.
- **Art. 469:** przepisów o bezskuteczności nie stosuje się, gdy **prawo właściwe dla czynności** nie przewiduje bezskuteczności czynności krzywdzących.
- **Art. 470:** wpływ upadłości na **postępowanie sądowe** w innym państwie UE/EOG — prawo państwa, w którym się toczy.

## D. Zakłady ubezpieczeń i reasekuracji (art. 471–482)

- **Art. 471:** wniosek — **tylko dłużnik lub KNF** (ust. 1); KNF jest uczestnikiem (ust. 2).
- **Art. 472:** opinia KNF co do syndyka; syndyk ze znajomością działalności ubezpieczeniowej; może nim być inny zakład (ust. 1); **sprawozdania dla KNF co najmniej co 3 miesiące** (masa, wierzytelności, wpływy i wydatki, czynności) i sprawozdanie ostateczne (ust. 2); zawiadomienie znanych kredytodawców (ust. 3).
- **Art. 473:** w zakładzie ubezpieczeń — **kurator interesów ubezpieczających, ubezpieczonych, uposażonych i uprawnionych**, po opinii KNF (ust. 1); art. 187 ust. 3–4 i sprawozdania (ust. 2); wynagrodzenie ustala sędzia-komisarz na wniosek KNF — koszt postępowania (ust. 3).
- **Art. 474:** informacje i wgląd; głos tylko w sprawach praw ubezpieczonych (ust. 1); kurator wnosi środki zaskarżenia we własnym imieniu i może zawrzeć **umowę o przeniesienie portfela** z możliwością obniżenia sum lub świadczeń; po zatwierdzeniu przez KNF — ogłoszenie **trzykrotnie w dzienniku ogólnopolskim** (ust. 2); przepisy odrębne o przeniesieniu portfela (ust. 4); ust. 3 uchylony.
- **Art. 475:** do ubezpieczonych, uposażonych i uprawnionych **nie stosuje się art. 232**.
- **Art. 476:** umowy ubezpieczenia **wygasają**, jeżeli kurator nie przeniósł portfela: obowiązkowe i na życie — w **3 miesiące**, inne — w **miesiąc** od ogłoszenia.
- **Art. 477:** aktywa pokrycia **rezerw techniczno-ubezpieczeniowych** zakładu ubezpieczeń tworzą **osobną masę** dla roszczeń z umów ubezpieczenia, reasekuracji i kosztów jej likwidacji (ust. 1); likwidacja z udziałem kuratora (ust. 2); sprzedaż z wolnej ręki — także zgoda kuratora (ust. 3).
- **Art. 477¹:** to samo dla **zakładu reasekuracji** (roszczenia z reasekuracji); likwiduje syndyk.
- **Art. 478:** kolejność z masy osobnej zakładu ubezpieczeń: koszty likwidacji → wierzytelności z umów ubezpieczenia → z reasekuracji (ust. 1); niedobór z umów ubezpieczenia — **kat. I** w planie podziału masy ogólnej (ust. 2); roszczenia z ubezpieczeń obowiązkowych i na życie zaspokajają **UFG i PBUK** według odrębnych przepisów (ust. 3).
- **Art. 478¹:** kolejność z masy osobnej zakładu reasekuracji: koszty → wierzytelności z reasekuracji.
- **Art. 479:** przy oddaleniu wniosku z art. 13 ust. 1 lub umorzeniu — roszczenia zaspokaja **UFG** według odrębnych przepisów.
- **Art. 480:** przy układzie kurator głosuje sumą niezaspokojonych wierzytelności ubezpieczonych; liczba głosów = suma / (suma innych wierzytelności uprawnionych do głosu ÷ liczba ich wierzycieli).
- **Art. 481:** art. 452 ust. 2, 453–466 i 467¹–470 stosuje się odpowiednio do: krajowego zakładu działającego w innym państwie UE/EOG (pkt 1); zagranicznego zakładu z siedzibą w UE/EOG działającego w PL (pkt 2); zakładu z państwa trzeciego działającego w PL i innym państwie UE/EOG (pkt 3).
- **Art. 482:** definicje: krajowy zakład ubezpieczeń / reasekuracji (pkt 1, 1a), ich oddziały (pkt 2, 2a), zagraniczny zakład ubezpieczeń / reasekuracji (pkt 3, 3a), oddziały zagraniczne (pkt 4, 5).

## E. Emitenci obligacji (art. 483–491)

- **Art. 483:** tytuł stosuje się, gdy prawa z obligacji **zabezpieczono na majątku emitenta** (ust. 1); nie stosuje się do **obligacji przychodowych** z ograniczoną odpowiedzialnością — środki na ich zaspokojenie nie wchodzą do masy, a obligatariusze nie są zaspokajani w upadłości (ust. 2).
- **Art. 484:** sąd ustanawia **kuratora obligatariuszy** (może nim być bank-reprezentant); obligatariusze osobiście po dopuszczeniu przez sędziego-komisarza (ust. 1); przy **hipotece** — bez kuratora; prawa wykonuje **administrator hipoteki** (art. 31 ust. 4 ustawy o obligacjach) (ust. 2).
- **Art. 485:** do kuratora art. 187 ust. 3–4 i przepisy o sprawozdaniach.
- **Art. 486:** informacje, wgląd; głos tylko w sprawach praw obligatariuszy.
- **Art. 487:** kurator zgłasza sumę obligacji wymagalnych przed ogłoszeniem i odsetek (pkt 1) oraz obligacji i odsetek płatnych później (pkt 2) (ust. 1), wskazując składniki zabezpieczenia (ust. 2).
- **Art. 488:** przedmiot zabezpieczenia = **osobna masa** (ust. 1); likwidacja z udziałem kuratora (ust. 2); sprzedaż z wolnej ręki — zgoda kuratora (ust. 3). (Przy deweloperze z zabezpieczeniem na nieruchomości przedsięwzięcia art. 488–490 nie stosuje się — art. 425d.)
- **Art. 489:** kolejność: koszty likwidacji (z wynagrodzeniem kuratora) → nominał → odsetki (kupony).
- **Art. 490:** niedobór — z funduszu masy ogólnej.
- **Art. 491:** obligacje własne upadłego — zakaz obiegu, umorzenie.

## F. Konsument — układ na zgromadzeniu wierzycieli (art. 491²⁵–491³⁸)

- **Art. 491²⁵:** niewypłacalna osoba fizyczna nieprowadząca działalności może wnieść o **otwarcie postępowania o zawarcie układu** (ust. 1); sąd może **skierować** do niego dłużnika, który złożył wniosek o upadłość, chyba że ten we wniosku **nie wyraził zgody** (ust. 2); przesłanka: możliwości zarobkowe i sytuacja zawodowa wskazują na zdolność pokrycia kosztów oraz zawarcia i wykonania układu (ust. 3); art. 216aa, formularz (ust. 4); wymogi jak art. 491² ust. 4 + **wstępne propozycje układowe** (ust. 5); rozporządzenie MS (ust. 6).
- **Art. 491²⁶:** zaliczka = **przeciętne miesięczne wynagrodzenie** (sektor przedsiębiorstw, **III kw. roku poprzedniego**) wraz z wnioskiem pod rygorem **zwrotu** (ust. 1); przy skierowaniu — nadzorcy w **30 dni** od otwarcia pod rygorem umorzenia i rozpoznania wniosku o upadłość (ust. 2).
- **Art. 491²⁷:** postanowienie o otwarciu: dane dłużnika (PESEL lub dane z 491² ust. 5c), **wyznaczenie nadzorcy sądowego**.
- **Art. 491²⁸:** obwieszczenie (ust. 1); doręczenie dłużnikowi i nadzorcy (ust. 2); zawiadomienie izby administracji skarbowej i ZUS/KRUS (ust. 3).
- **Art. 491²⁹:** zaliczka dla nadzorcy z zaliczki dłużnika — wypłata niezwłoczna.
- **Art. 491³⁰:** nadzorca w **30 dni** od doręczenia postanowienia: propozycje układowe z dłużnikiem, spis wierzytelności, spis spornych, zwołanie zgromadzenia.
- **Art. 491³¹:** termin ustala nadzorca z dłużnikiem (ust. 1); zgromadzenie najpóźniej **3 miesiące** od otwarcia (przy skierowaniu — **4 miesiące**) pod rygorem umorzenia (ust. 2); zawiadomienie **przesyłką poleconą ≥ 2 tygodnie** przed zgromadzeniem z propozycjami (ust. 3).
- **Art. 491³²:** przewodniczy nadzorca (ust. 1); protokół z treścią układu i listą głosujących (ust. 2); wniosek o zatwierdzenie albo umorzenie w **21 dni** (ust. 3).
- **Art. 491³³:** układ na **≤ 5 lat** (ust. 1); dłużej — w części wierzytelności z art. 151 ust. 2 PrRestr (ust. 2) albo gdy przewiduje **zachowanie nieruchomości mieszkalnej** dłużnika (ust. 3).
- **Art. 491³⁴:** wykonanie przez **nadzorcę wykonania układu**.
- **Art. 491³⁵:** wynagrodzenie nadzorcy = **15%** zaspokojenia według układu: **opłata wstępna ½** przeciętnego wynagrodzenia (III kw. roku poprzedniego) + do 15% każdej wypłaty (ust. 1); nadwyżka ponad **100 000 zł — 3%** (ust. 2), ponad **500 000 zł — 1%** (ust. 3); opłata wstępna po doręczeniu postanowienia, reszta przy wypłatach (ust. 4); minimum = opłata wstępna (ust. 5).
- **Art. 491³⁶:** umorzenie, gdy dłużnik nie wykonuje obowiązków, zdolność nie jest uprawdopodobniona albo nadzorca nie złoży wniosku o zatwierdzenie w **6 miesięcy** od otwarcia (ust. 1); przy skierowaniu — po prawomocnym umorzeniu sąd rozpoznaje wniosek o upadłość (ust. 2).
- **Art. 491³⁷:** akta w systemie teleinformatycznym prowadzi nadzorca; biuro czynne **≥ 4 kolejne godziny między 8.00 a 20.00**; reguły jak w 491²⁴ (ust. 1–7).
- **Art. 491³⁸:** w zakresie nieuregulowanym — odpowiednio przepisy PrRestr o **przyspieszonym postępowaniu układowym**, **bez sędziego-komisarza**.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| 2/3 kapitału / funduszu udziałowego | propozycje układowe akcjonariuszy banku / członków SKOK | art. 436 ust. 1; 441a ust. 3 |
| 5 lat; ≥ 1 rok; ≥ 400 000 zł | kat. V; warunki kat. VI | art. 440 ust. 2 pkt 5–6 |
| 21 dni | zgłoszenie kuratora listów zastawnych | art. 444 |
| ≥ 10% / > 50% / 2/3 | zwołanie / uchwały / uchwały kwalifikowane zgromadzenia z listów zastawnych | art. 445a, 445b ust. 5, 446b–446d |
| +12 mies.; +3 lata | przedłużenie wymagalności listów | art. 446 ust. 1; 446c ust. 1 pkt 1 |
| 3 mies. / 4 mies. / 2 tyg. | pierwszy test / przekazanie sędziemu-komisarzowi / uwagi KNF | art. 446a ust. 1, 6, 7 |
| 2 mies. / 1 mies. / 3 mies. | uchwała / wniosek o zwołanie / uchwała przy braku płynności | art. 446b ust. 2–3; 446c ust. 3 |
| ≥ 5%; 6 mies. odsetek | próg wcześniejszego zaspokojenia | art. 446b ust. 5; 446c ust. 1 pkt 2 |
| co ≤ 6 mies. | informacja dla wierzycieli z UE/EOG | art. 459¹ |
| co ≤ 3 mies. | sprawozdanie syndyka ubezpieczyciela dla KNF | art. 472 ust. 2 |
| 3 mies. / 1 mies. | przeniesienie portfela, inaczej wygaśnięcie umów | art. 476 |
| 1× / ½× GUS III kw.; 30 dni | zaliczka; opłata wstępna nadzorcy; zaliczka po skierowaniu | art. 491²⁶; 491³⁵ ust. 1 |
| 30 dni / 3–4 mies. / 2 tyg. / 21 dni / 6 mies. | czynności nadzorcy; zgromadzenie; zawiadomienie; wniosek; umorzenie | art. 491³⁰–491³², 491³⁶ |
| ≤ 5 lat | okres układu konsumenckiego (wyjątki ust. 2–3) | art. 491³³ |
| 15% / 3% > 100 000 zł / 1% > 500 000 zł | wynagrodzenie nadzorcy | art. 491³⁵ |
| 11.01.2027 | nowe brzmienie art. 452 ust. 1 i 456 ust. 1 | DU/2026/1206 art. 7, 57 |

## PUŁAPKI

- Bank i SKOK: wniosek tylko KNF/BFG; wierzyciel nie ma legitymacji (426 ust. 2, 441a ust. 1). Ubezpieczyciel: tylko dłużnik lub KNF (471).
- W banku brak zabezpieczenia z art. 38–43 (426 ust. 3) i pre-packu (437 ust. 4).
- Kategorie art. 440 zastępują art. 342; koszty przymusowej restrukturyzacji idą po kosztach postępowania (440 ust. 3); BFG bez zgłoszenia (440 ust. 4).
- Art. 440 ust. 2 pkt 1 — brzmienie od 31.03.2026 (DU/2026/340); dla planów sprzed tej daty sprawdź przepisy przejściowe.
- Masy osobne (442, 477, 477¹, 488) nie mieszają się z masą ogólną; niedobór idzie do planu ogólnego (449, 478 ust. 2, 490).
- Potrącenie z masą listów zastawnych zakazane (442a) — wyjątki tylko dla pochodnych z art. 18a, systemów płatności i zabezpieczeń finansowych.
- Instytucja kredytowa z UE: brak jurysdykcji polskiej i brak postępowania wtórnego (453); uznanie z mocy prawa (454).
- Prawo właściwe w części C: polskie jako zasada (460), ale prawa rzeczowe za granicą nienaruszone (462), bezskuteczność wyłączona, gdy nie zna jej prawo właściwe dla czynności (469).
- Art. 452 ust. 1 i 456 ust. 1 — przed 11.01.2027 stosuj brzmienie z t.j.; po tej dacie odczytaj nowelizację.
- Umowy ubezpieczenia wygasają z mocy prawa po 1 / 3 miesiącach bez przeniesienia portfela (476).
- Obligacje z hipoteką: zamiast kuratora — administrator hipoteki (484 ust. 2); obligacje przychodowe poza tytułem (483 ust. 2).
- Układ konsumencki: brak sędziego-komisarza (491³⁸); nieprzedstawienie wniosku w 6 miesięcy = umorzenie (491³⁶ ust. 1 pkt 3); przy skierowaniu wracasz do wniosku o upadłość (491³⁶ ust. 2).

## POWIĄZANIA

- Upadłość konsumencka (491¹–491²⁴) → `mod-PrUpad-konsument-workflow`
- Kategorie art. 342, art. 343–346, 356 → `mod-PrUpad-podzial-335-360`
- Kurator art. 187, sprawozdania art. 168, koszty art. 230–232 → `mod-PrUpad-organy-procedura`, `mod-PrUpad-syndyk-likwidacja`
- Zgłoszenia, art. 176 → `mod-PrUpad-wierzytelnosci-235-266`
- Zabezpieczenie (art. 38–43), pre-pack (art. 56a–56h), oddalenie art. 13 → `mod-PrUpad-wniosek-ogloszenie`
- Deweloper (art. 425c, 425d), postępowanie międzynarodowe (art. 378–417) → `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne`
- Przyspieszone postępowanie układowe, art. 151 ust. 2 PrRestr → `mod-PrRestr-ppu-pu`, `mod-PrRestr-dzial-VI-uklad`
- Przestępstwa upadłościowe (art. 522–523) → `mod-PrUpad-zakonczenie-zakaz-karne`
- Wersje i nowelizacje → `references/insolvency/wersje-i-przepisy-przejsciowe.md`

## WYNIK

Kwalifikacja dłużnika → tytuł i legitymacja → organy (KNF, BFG, kuratorzy) → masa ogólna i masy osobne → kategorie zaspokojenia właściwe dla sektora (440 / 448 / 478 / 489) → element EOG i prawo właściwe (451–470, 481) → terminy sektorowe; dla konsumenta: zdolność i zaliczka (491²⁵–491²⁶) → czynności nadzorcy w 30 dni → zgromadzenie w 3–4 mies. → wniosek w 21 dni → układ ≤ 5 lat i wykonanie przez nadzorcę.
