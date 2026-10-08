# Restrukturyzacja — układ: zakres, propozycje, grupy, zatwierdzenie, skutki, wykonanie, zmiana, uchylenie (PrRestr art. 150–179)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 40–48
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** [DU/2026/176](https://api.sejm.gov.pl/eli/acts/DU/2026/176/text.pdf) art. 24 — **art. 156 ust. 5 pkt 4** (oznaczenie akcji na okaziciela / imiennych) **uchylony od 18.02.2027**; t.j. zawiera oba warianty pkt 4 (odnośniki 31–32). Liczne jednostki (150 ust. 1 pkt 4 i ust. 3, 151 ust. 2, 155 ust. 4, 161, 161a, 162 ust. 2, 163 ust. 3, 164, 165, 165a, 175 ust. 4) w brzmieniu nowelizacji DU/2025/1085 (od 23.08.2025) — ujęte w t.j.; dla spraw sprzed tej daty → przepisy przejściowe w `mod-PrRestr-zrodla-i-wersje`.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 161a --verify-online`. Większości przy głosowaniu i cram-down — art. 119 (→ `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`).

---

## FAZA 0 — INTAKE

```
□ Każda wierzytelność: powstała przed otwarciem (PZU — przed dniem układowym)? osobista? warunkowa? z umowy wzajemnej (świadczenie podzielne, spełnione przed otwarciem)? (150)
□ Wyłączone z mocy prawa: alimenty i renty, wydanie mienia / zaniechanie naruszeń, długi spadkowe z nabycia po otwarciu (151 ust. 1)
□ Pracownicy: tylko za bezwarunkową, nieodwołalną zgodą przed głosowaniem (151 ust. 2); FGŚP jak pracownicy (153)
□ Zabezpieczone rzeczowo / przewłaszczeniem: objęte układem; „zabezpieczona” część = wartość przedmiotu (150 ust. 3) → obowiązkowa grupa (161 ust. 1a pkt 3) i ochrona z 161a
□ Wierzytelność już objęta innym układem (nieuchylonym) — wyłączona (152)
□ ZUS / KRUS: tylko raty lub odroczenie (160, 154); FGŚP: raty / odroczenie, chyba że zgoda dysponenta (160 ust. 4)
□ Pomoc publiczna w restrukturyzacji — ograniczone formy (156 ust. 3); decyzja KE o zwrocie — zakaz (156 ust. 4)
□ Konwersja na udziały / akcje — obowiązkowa treść (156 ust. 5), zgody UOKiK/KE (art. 118 ust. 3)
□ Grupy: obowiązkowe dla pracowników, rolników, zabezpieczonych (161 ust. 1a); zatwierdzenie podziału przez sąd (poza PZU) (161 ust. 4–7)
□ Zastrzeżenia przeciw układowi — tydzień od przyjęcia (164 ust. 3); test najlepszego interesu (165 ust. 2)
□ Po zatwierdzeniu: nadzorca wykonania, sprawozdania co 3 mies., wykonanie / zmiana / uchylenie / wygaśnięcie (171–179)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 150–154 | wierzytelności objęte i nieobjęte układem, pracownicy, FGŚP, KRUS | A |
| 155–163 | propozycje: wnioskodawcy, sposoby restrukturyzacji, pomoc publiczna, konwersja, zysk, zgody osób trzecich, likwidacja, ZUS/FGŚP, grupy, ochrona zabezpieczonych, równe traktowanie, pracownicy i świadczenia niepieniężne | B |
| 164–165a | zatwierdzenie: posiedzenie, zastrzeżenia, opinia weryfikująca test, odmowa, najlepszy interes, próg 15%, zażalenie, korekta przez sąd | C |
| 166–172 | skutki: związanie, poręczyciele, wpisy, konwersja, zarząd przymusowy, umorzenie egzekucji, nadzorca wykonania, stwierdzenie wykonania | D |
| 173–179 | zmiana układu, uchylenie, zbieg wniosków, wygaśnięcie, skutki uchylenia / wygaśnięcia | E |
| uchylone | 168 (oraz 151 ust. 1 pkt 4, ust. 2a, ust. 3; 156 ust. 5 drugi pkt 4 w t.j.) | — |

---

## A. Zakres układu (art. 150–154)

- **Art. 150:** układ obejmuje: **wierzytelności osobiste sprzed otwarcia**, o ile ustawa nie stanowi inaczej (pkt 1); **odsetki od dnia otwarcia** (pkt 2); wierzytelności **warunkowe**, jeżeli warunek ziścił się w czasie wykonywania układu (pkt 3); wierzytelności zabezpieczone **przewłaszczeniem / przelewem na zabezpieczenie** (pkt 4) (ust. 1). Z **umowy wzajemnej** niewykonanej przed otwarciem — tylko przy **świadczeniu podzielnym** kontrahenta i w zakresie spełnionym przed otwarciem bez świadczenia wzajemnego (ust. 2). Zabezpieczenie rzeczowe (hipoteka, zastaw, zastaw rejestrowy/skarbowy, hipoteka morska, przewłaszczenie) — wierzytelność **zabezpieczona w części odpowiadającej wartości przedmiotu** (ust. 3).
- **Art. 151:** **nie obejmuje**: alimentów i rent odszkodowawczych / z dożywocia (pkt 1), roszczeń o **wydanie mienia** i **zaniechanie naruszeń** (pkt 2), długów spadkowych z **nabycia spadku po otwarciu**, po wejściu spadku do masy (pkt 3) (ust. 1; pkt 4 uchylony); **wierzytelności ze stosunku pracy** — tylko za zgodą wierzyciela, **bezwarunkową i nieodwołalną**, najpóźniej **przed głosowaniem**, także ustnie do protokołu (ust. 2); ust. 2a i 3 uchylone.
- **Art. 152:** wierzytelność objęta **innym układem** — nie może być objęta, chyba że tamten układ uchylono.
- **Art. 153:** wierzytelności **FGŚP** o zwrot świadczeń — jak pracownicze.
- **Art. 154:** wierzytelności **KRUS** — jak wierzytelności **ZUS**.

## B. Propozycje układowe (art. 155–163)

- **Art. 155:** propozycje składa **dłużnik** (ust. 1), a także **rada wierzycieli**, **nadzorca sądowy / zarządca** lub wierzyciele z **> 30%** sumy (bez wyłączonych z art. 80 ust. 3, 109 ust. 1, 116) (ust. 2); określają sposób restrukturyzacji (ust. 3); **zakaz zaspokojenia ponad wysokość wierzytelności** (ust. 4).
- **Art. 156:** sposoby: **odroczenie**, **raty**, **zmniejszenie**, **konwersja na udziały/akcje**, **zmiana, zamiana lub uchylenie zabezpieczenia** (ust. 1); można łączyć (ust. 2). Restrukturyzacja będąca **pomocą publiczną** — wyłącznie: ZUS (160 ust. 1), raty/odroczenie FGŚP, raty/odroczenie podatków oraz zobowiązań z gwarancji/poręczeń SP i JST (ust. 3); **niedopuszczalna** wobec pomocy objętej **decyzją KE o zwrocie** (ust. 4). **Konwersja** — propozycje określają: kwotę podwyższenia kapitału (PSA — liczbę akcji), liczbę i wartość nominalną (lub cenę emisyjną akcji beznominałowych), **wyłączenie prawa pierwszeństwa / poboru** nawet wbrew umowie/statutowi, rodzaj akcji (okaziciela/imienne — **do 18.02.2027**), cenę emisyjną, datę udziału w dywidendzie (ust. 5); propozycja konwersji na akcje **nie jest ofertą publiczną** w rozumieniu rozp. 2017/1129; bez art. 19 ust. 1 pkt 2 ustawy o obrocie (ust. 6).
- **Art. 157:** spłata **z zysku** — określenie części zysku na spłatę.
- **Art. 158:** plan z **kredytem, pożyczką, zmianą stosunków lub zabezpieczeniem** → do propozycji dołącza się **oświadczenie** zobowiązanej osoby w formie prawem przewidzianej.
- **Art. 159:** możliwy **układ likwidacyjny** (ust. 1); sprzedaż w jego wykonaniu **nie wywołuje skutków sprzedaży egzekucyjnej** (ust. 2).
- **Art. 160:** zobowiązania wobec **ZUS** (składki ZUS, FP, FGŚP, FEP, własne i zdrowotne, odsetki, koszty) — **wyłącznie raty lub odroczenie** (ust. 1); przy przejęciu majątku / dopłatach — wskazanie przejmującego obowiązki wobec ZUS; charakter i uprzywilejowanie wierzytelności bez zmian (ust. 2); wyciąg ze spisu (art. 102 ust. 2) — **tytuł wykonawczy** przeciw przejmującemu; możliwa egzekucja administracyjna (ust. 3); **FGŚP** — raty/odroczenie, chyba że **dysponent** zgodzi się inaczej (ust. 4), ust. 2–3 odpowiednio (ust. 5).
- **Art. 161:** **grupy** według **obiektywnych, jednoznacznych, uzasadnionych ekonomicznie lub prawnie** kryteriów stosunków z dłużnikiem (ust. 1); **obowiązkowe grupy**: pracownicy, którzy zgodzili się na objęcie (pkt 1), dostawcy **produktów z własnego gospodarstwa rolnego** (pkt 2), **zabezpieczeni** rzeczowo / przewłaszczeniem w części pokrytej wartością przedmiotu (pkt 3) (ust. 1a); listy grup sporządza nadzorca/zarządca po zatwierdzeniu spisu, gdy podział nie wynika ze spisu lub jest niezgodny z propozycjami (ust. 2); w PZU — nadzorca układu (ust. 3); **sądowe zatwierdzenie podziału** na wniosek podmiotów z art. 155 — zażalenie rozpoznawane w **2 tygodnie** (ust. 4); przy odmowie sąd wskazuje uchybienia i potrzebne zmiany (ust. 5); prawomocny podział **wiąże** sąd zatwierdzający układ (ust. 6); ust. 4–6 **nie dotyczą PZU** (ust. 7).
- **Art. 161a:** zabezpieczeni (161 ust. 1a pkt 3) — zaspokojenie **nie mniej korzystne niż w upadłości**, chyba że zgoda na gorsze (ust. 1); **sposób zaspokojenia** jak w umowie zabezpieczenia, chyba że zgoda (ust. 2); zmiana przedmiotu zabezpieczenia za zgodą lub jego **sprzedaż** — przez nadzorcę wykonania lub **zarządcę przymusowego** (ust. 3), w imieniu własnym na rachunek dłużnika (ust. 4); dłużnik bez zdolności upadłościowej — porównanie z **egzekucją** całego majątku przez wszystkich wierzycieli (ust. 5).
- **Art. 162:** **jednakowe warunki** dla wszystkich, a przy grupach — w ramach grupy, chyba że wierzyciel **wyraźnie zgodzi się** na gorsze (ust. 1); **korzystniejsze warunki** dopuszczalne dla: finansującego po otwarciu (kredyt, obligacje, gwarancje, akredytywy, inne instrumenty niezbędne do wykonania układu) (pkt 1), dostawcy świadczeń koniecznych do kontynuacji działalności (pkt 2), **mikroprzedsiębiorcy** (pkt 3) — jeżeli konieczne dla celów planu i bez niesprawiedliwego traktowania innych (ust. 2).
- **Art. 163:** układ nie może pozbawiać pracowników **minimalnego wynagrodzenia** (ust. 1); restrukturyzacja jednakowo pieniężnych i **niepieniężnych**; sprzeciw wierzyciela w **tydzień** od zawiadomienia lub niemożność → zamiana na **wierzytelność pieniężną** z dniem otwarcia (ust. 2); warunki dla zabezpieczonych mogą być zróżnicowane według **pierwszeństwa** (ust. 3).

## C. Zatwierdzenie (art. 164–165a)

- **Art. 164:** układ przyjęty przez zgromadzenie zatwierdza **sąd**, z treścią układu w sentencji (ust. 1); posiedzenie **nie wcześniej niż tydzień** po zgromadzeniu (ust. 2); w uzasadnionych przypadkach **rozprawa** (ust. 2a); **zastrzeżenia** pisemne uczestników — sąd pomija zgłoszone **po tygodniu** od przyjęcia lub wadliwe formalnie (ust. 3); przy zarzucie naruszenia **najlepszego interesu** lub art. 119 ust. 3 pkt 2 — sąd może zażądać **opinii weryfikującej test zaspokojenia** (określa zakres i podmiot; zleca nadzorca/zarządca) (ust. 3a); zawiadomienie o posiedzeniu przez obwieszczenie, chyba że ogłoszono na zgromadzeniu (ust. 4); obwieszczenie zatwierdzenia (ust. 5).
- **Art. 165:** **odmowa** przy **naruszeniu prawa** (zwłaszcza pomoc publiczna) albo **oczywistej niewykonalności**; domniemanie niewykonalności, gdy dłużnik **nie płaci zobowiązań po otwarciu** (ust. 1). **Kryterium najlepszego interesu**: odmowa, gdy wierzyciel głosujący **przeciw** zgłosił zasadny zarzut, że byłby w **gorszej sytuacji** niż w upadłości (lub egzekucji — 161a ust. 5) albo przy zakończeniu postępowania bez układu (ust. 2). Odmowa w **PZU i PPU**, gdy sporne uprawniające do głosu **> 15%** (ust. 3); w PPU — zatwierdzenie mimo to, jeżeli dłużnik **nie wiedział** o sporach, a ich zaspokojenie nie będzie mniejsze niż w upadłości (ust. 4). Brak wymaganej większości → **umorzenie** na posiedzeniu (ust. 5); obwieszczenia (ust. 6); **zażalenie w 2 tygodnie** (ust. 7); obwieszczenie II instancji i prawomocności (ust. 8).
- **Art. 165a:** sąd może **zmienić układ**, jeżeli zmiany **nie naruszają istotnych postanowień** i pozwalają na zatwierdzenie.

## D. Skutki i wykonanie (art. 166–172)

- **Art. 166:** układ **wiąże** wierzycieli, których wierzytelności są objęte z mocy ustawy, **nawet spoza spisu** (ust. 1); **nie wiąże** wierzycieli **nieujawnionych przez dłużnika**, którzy nie uczestniczyli w postępowaniu (ust. 2).
- **Art. 167:** układ **nie narusza** praw wobec **poręczyciela i współdłużnika** ani zabezpieczeń rzeczowych na **mieniu osoby trzeciej** (ust. 1); odpowiednio przewłaszczenie (ust. 2).
- **Art. 168:** uchylony.
- **Art. 169:** prawomocne zatwierdzenie — podstawa **wpisu w KW i rejestrach** (ust. 1); **zarząd przymusowy** — odpis postanowienia jako tytuł wykonawczy do wprowadzenia zarządcy (ust. 2); **konwersja** — układ **zastępuje czynności KSH** (podwyższenie kapitału, emisja akcji PSA, przystąpienie, objęcie, wkład) (ust. 3); odpis — podstawa wpisu podwyższenia / zmiany liczby akcji w **KRS** (ust. 4).
- **Art. 170:** z prawomocnym zatwierdzeniem postępowania zabezpieczające i egzekucyjne co do wierzytelności objętych układem **umarza się z mocy prawa** (ust. 1); zawieszone co do nieobjętych — **podjęcie na wniosek** (ust. 2); tytuły co do objętych **tracą wykonalność z mocy prawa** (ust. 3); powództwo o **ustalenie utraty wykonalności** (ust. 4).
- **Art. 171:** nadzorca / zarządca staje się **nadzorcą wykonania układu**, chyba że układ inaczej; obwieszczenie (ust. 1); przepisy o nadzorcy układu (bez umowy) i art. 28–30 (ust. 2); **sprawozdanie co 3 miesiące** do sądu, z obwieszczeniem informacji (ust. 3).
- **Art. 172:** po **wykonaniu** lub wyegzekwowaniu — **postanowienie o wykonaniu układu** na wniosek dłużnika, nadzorcy wykonania lub innej uprawnionej osoby; zażalenie (ust. 1); obwieszczenia (ust. 2); podstawa **wykreślenia wpisów** (ust. 3); dłużnik **odzyskuje swobodę zarządu**, jeżeli był jej pozbawiony (ust. 4).

## E. Zmiana, uchylenie, wygaśnięcie (art. 173–179)

- **Art. 173:** **zmiana układu** przy **trwałym wzroście lub spadku dochodu** — wniosek dłużnika, nadzorcy wykonania, innej uprawnionej osoby lub wierzyciela (ust. 1); przy pozostawionym zarządzie — nadzorca wykonania i wierzyciel mogą wnieść o **powierzenie zarządu wskazanej osobie** z przyczyn jak art. 239 ust. 1 lub utrudniania nadzoru (ust. 2); obwieszczenie otwarcia (ust. 3); zażalenie na otwarcie — dłużnik i wierzyciele uprawnieni do głosu przy przyjęciu (ust. 4); na odmowę — tylko wnioskodawca (ust. 5); obwieszczenia (ust. 6).
- **Art. 174:** do postanowienia — art. 233 ust. 1 pkt 1–2 (ust. 1); przepisy o nadzorcy sądowym, zawarciu i zatwierdzeniu układu (ust. 2).
- **Art. 175:** głosują wierzyciele uprawnieni przy przyjęciu, sumą **pomniejszoną o otrzymane kwoty**; osoba trzecia wstępująca w prawa — sumą zaspokojenia (ust. 1); także wierzyciele sporni stwierdzeni później prawomocnie / decyzją ostateczną (ust. 2); bez wierzycieli zaspokojonych w całości (ust. 3); **wykaz uprawnionych w 2 tygodnie** od otwarcia (art. 86, 86a) (ust. 4).
- **Art. 176:** **uchylenie** na wniosek wierzyciela, dłużnika, nadzorcy wykonania lub innej uprawnionej osoby, gdy dłużnik **nie wykonuje** układu albo jest **oczywiste**, że go nie wykona; domniemanie przy niepłaceniu **zobowiązań po zatwierdzeniu** (ust. 1); **z innych przyczyn niedopuszczalne** (ust. 2); obwieszczenie (ust. 3); zażalenie — dłużnik i wierzyciele uprawnieni do głosu (ust. 4); na oddalenie — tylko wnioskodawca (ust. 5); obwieszczenia (ust. 6).
- **Art. 177:** wniosek o zmianę i o uchylenie — **łączne rozpoznanie** (ust. 1); wniosek o upadłość przed rozpoznaniem uchylenia — art. 11–12 (ust. 2); łączny wniosek o uchylenie i upadłość — **sąd upadłościowy** (ust. 3).
- **Art. 178:** **ogłoszenie upadłości** w czasie wykonywania albo **oddalenie wniosku na podstawie art. 13 PrUp** → układ **wygasa z mocy prawa** z uprawomocnieniem (ust. 1); obwieszczenie (ust. 2).
- **Art. 179:** po uchyleniu / wygaśnięciu wierzyciele dochodzą roszczeń **w pierwotnej wysokości**, z zaliczeniem wypłat (ust. 1), odpowiednio przy innym zaspokojeniu (ust. 2); syndyk **z urzędu** umieszcza na liście wierzytelności ze spisu z uwzględnieniem wpłat (ust. 3); zabezpieczenia rzeczowe zabezpieczają **niezaspokojoną część** (ust. 4).

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| przed głosowaniem | zgoda pracownika na objęcie układem | art. 151 ust. 2 |
| > 30% sumy | wierzyciele uprawnieni do propozycji | art. 155 ust. 2 |
| 18.02.2027 | uchylenie art. 156 ust. 5 pkt 4 | DU/2026/176 |
| 2 tygodnie | rozpoznanie zażalenia na podział na grupy | art. 161 ust. 4 |
| minimalne wynagrodzenie | granica restrukturyzacji płac | art. 163 ust. 1 |
| tydzień | sprzeciw do restrukturyzacji wierzytelności niepieniężnej | art. 163 ust. 2 |
| ≥ tydzień po zgromadzeniu; tydzień | posiedzenie zatwierdzające; zastrzeżenia | art. 164 ust. 2–3 |
| > 15% | odmowa zatwierdzenia w PZU/PPU | art. 165 ust. 3 |
| 2 tygodnie | zażalenie na zatwierdzenie / odmowę | art. 165 ust. 7 |
| co 3 miesiące | sprawozdanie nadzorcy wykonania | art. 171 ust. 3 |
| 2 tygodnie | wykaz uprawnionych w postępowaniu o zmianę | art. 175 ust. 4 |

## PUŁAPKI

- Zabezpieczeni rzeczowo są objęci układem (150 ust. 3, 161 ust. 1a pkt 3) — nie stosuj dawnego wyłączenia z art. 151 ust. 2a–3 (uchylone); ochrona przez 161a.
- Część nadwyżkowa ponad wartość zabezpieczenia trafia do grup niezabezpieczonych — wyliczenie wartości przedmiotu jest kluczowe.
- ZUS i KRUS: tylko raty lub odroczenie (160 ust. 1, 154) — umorzenie składek narusza prawo (165 ust. 1).
- Zakaz zaspokojenia ponad 100% (155 ust. 4) i reguła równego traktowania w grupie (162) — wyjątki tylko z 162 ust. 2.
- Zastrzeżenie po tygodniu od przyjęcia układu jest pomijane (164 ust. 3); zarzut najlepszego interesu przysługuje tylko głosującemu przeciw (165 ust. 2).
- PPU: spory > 15% ujawnione po przyjęciu — zatwierdzenie możliwe tylko przy niewiedzy dłużnika i teście upadłościowym (165 ust. 4).
- Układ nie wiąże nieujawnionych wierzycieli spoza postępowania (166 ust. 2) i nie chroni poręczycieli ani zabezpieczeń na mieniu osób trzecich (167).
- Z prawomocnym zatwierdzeniem tytuły wykonawcze co do wierzytelności objętych tracą wykonalność z mocy prawa (170 ust. 3).
- Uchylenie tylko z przyczyn z art. 176 ust. 1; upadłość w czasie wykonania powoduje wygaśnięcie układu (178) i odżycie wierzytelności w pierwotnej wysokości (179).

## POWIĄZANIA

- Większości, cram-down, wyłączenia głosu (art. 107–120) → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`
- Test zaspokojenia (art. 10a) → `mod-PrRestr-wejscie-plan-test`
- Pomoc publiczna (art. 140 i n.), zgody (art. 118) → `mod-PrRestr-dzial-V-pomoc-publiczna`
- Układ częściowy (art. 180 i n.) → `mod-PrRestr-dzial-VII-uklad-czesciowy`
- Nadzorca, art. 28–30, zarządca przymusowy → `mod-PrRestr-dzial-III-nadzorca-zarzadca`
- PZU (dzień układowy), PPU/PU (art. 233, 239) → `mod-PrRestr-pzu`, `mod-PrRestr-ppu-pu`
- Kategorie art. 342 PrUp, oddalenie z art. 13 PrUp, lista wierzytelności syndyka → `mod-PrUpad-podzial-335-360`, `mod-PrUpad-wniosek-ogloszenie`, `mod-PrUpad-wierzytelnosci-235-266`
- Konwersja i KSH, KRS → `mod-KSH-spolki-handlowe`, `mod-ustawa-KRS-rejestr-sadowy`

## WYNIK

Kwalifikacja wierzytelności (150–154) → propozycje z dopuszczalnymi sposobami i limitami (155–160) → podział na grupy z grupami obowiązkowymi i ochroną zabezpieczonych (161–163) → głosowanie (art. 119) → zastrzeżenia w tydzień i kontrola sądu: legalność, wykonalność, najlepszy interes, próg 15% (164–165a) → skutki: związanie, umorzenie egzekucji, wpisy, konwersja (166–170) → nadzór wykonania i stwierdzenie wykonania (171–172) → zmiana / uchylenie / wygaśnięcie z odżyciem wierzytelności (173–179).
