# Restrukturyzacja — przyspieszone postępowanie układowe i postępowanie układowe (PrRestr art. 227–282)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 61–71
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak (późniejsze nowelizacje dotyczą art. 4 i 156 → `references/insolvency/wersje-i-przepisy-przejsciowe.md`).
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 252 --verify-online`. Wybór trybu: art. 3 ust. 3–4 — PPU, gdy sporne wierzytelności uprawniające do głosu **≤ 15%** sumy uprawniających; PU, gdy **> 15%**. Przepisy wspólne (nadzorca — dział III, wierzyciele i spis — dział IV, układ — dział VI) → moduły działów.

---

## FAZA 0 — INTAKE

```
□ Udział wierzytelności spornych uprawniających do głosu: ≤ 15% → PPU; > 15% → PU (art. 3)
□ Wniosek: dane, NIP, propozycje + wstępny plan, majątek z wyceną, bilans ≤ 30 dni, wykaz wierzycieli (objęci z mocy prawa / za zgodą / prawo głosu), spory,
  system płatności, progi 250 pracowników / 50 mln EUR obrotu / 43 mln EUR aktywów (227) + oświadczenie o prawdziwości (228)
□ PU: uprawdopodobnienie zdolności do bieżącego pokrywania kosztów i zobowiązań po otwarciu (266)
□ PPU: zaliczka = 1× wynagrodzenie GUS (III kw. roku poprz.) z dowodem przy wniosku (230)
□ Dłużnik — przedsiębiorstwo państwowe / jednoosobowa spółka SP (229, 235 ust. 3)? spółka publiczna (235 ust. 6)? telekom (235 ust. 7)?
□ Egzekucje w toku: objęte układem z mocy prawa (zawieszenie) vs zabezpieczone rzeczowo (tylko z przedmiotu, zawieszenie ≤ 3 mies.)
□ Umowy o podstawowym znaczeniu (najem lokalu, kredyt, leasing, rachunek, licencje, gwarancje) — ochrona przed wypowiedzeniem (256)
□ Wpisy hipotek/zastawów złożone < 6 mies. przed wnioskiem (246 ust. 2)
□ Wsparcie publiczne w propozycjach (art. 140) → doręczenie testów i terminy art. 204–205 przed zgromadzeniem (263 ust. 2)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 227–231 | PPU: wniosek, oświadczenie, spółki SP, zaliczka | A |
| 232–237 | PPU: rozpoznanie w tydzień, postanowienie o otwarciu, skuteczność, obwieszczenia i zawiadomienia, zażalenia | B |
| 238–260 | PPU: skutki otwarcia — dłużnik i zarząd, masa układowa, systemy płatności, zabezpieczenia, klauzule umowne, zakaz spełniania świadczeń, potrącenie, umowy kluczowe, procesy, egzekucja | C |
| 261–264 | PPU: plan, spisy, testy, zgromadzenie, zawiadomienia | D |
| 265–272 | PU: wniosek, zaliczki, zabezpieczenie i tymczasowy nadzorca, otwarcie | E |
| 273–279 | PU: skutki otwarcia, skład masy i spis inwentarza, procesy, egzekucja | F |
| 280–282 | PU: plan, spis, testy, zgromadzenie | G |
| uchylone | brak całych artykułów (uchylone 227 ust. 2–3) | — |

---

## A. PPU — wniosek i zaliczka (art. 227–231)

- **Art. 227:** wniosek zawiera (ust. 1): **pkt 1** dane dłużnika (PESEL/KRS lub inne dane identyfikujące — ust. 4: jak art. 86 ust. 6), firmę, adres, reprezentantów i likwidatorów, przy spółce osobowej — wspólników odpowiadających bez ograniczenia; **pkt 1a** NIP; **pkt 2** **propozycje układowe ze wstępnym planem restrukturyzacyjnym** i odpisy dla wszystkich wierzycieli; **pkt 3** miejsca przedsiębiorstwa i majątku; **pkt 4** wykaz majątku z wyceną; **pkt 5** **bilans** na dzień w okresie **30 dni** przed wnioskiem; **pkt 6** wykaz wierzycieli z kwotami, terminami, informacją, czy wierzytelność objęta układem z mocy prawa / za zgodą wierzyciela oraz czy jest prawo głosu (a jeżeli nie — dlaczego); **pkt 7** sumy wierzytelności (z mocy prawa / za zgodą); **pkt 8–9** wierzytelności sporne z podstawą sporu i ich suma; **pkt 10** udział w **systemie płatności / rozrachunku papierów wartościowych** lub prowadzenie systemu interoperacyjnego; **pkt 11** czy w jednym z 2 ostatnich lat obrotowych: **≥ 250 pracowników**, obrót netto **> 50 mln EUR** lub suma aktywów **> 43 mln EUR**. Ust. 2–3 uchylone.
- **Art. 228:** pisemne **oświadczenie o prawdziwości i zupełności** informacji (ust. 1); nieprawda → **odpowiedzialność odszkodowawcza** (ust. 2).
- **Art. 229:** przy przedsiębiorstwie państwowym lub jednoosobowej spółce SP sąd niezwłocznie (telefon, faks, e-mail) zawiadamia organ założycielski / podmiot wykonujący prawa z akcji SP — może złożyć opinię, której brak nie wstrzymuje sprawy (ust. 1), i przystąpić jako uczestnik (ust. 2).
- **Art. 230:** zaliczka = **przeciętne miesięczne wynagrodzenie** (sektor przedsiębiorstw bez nagród z zysku, **III kwartał roku poprzedniego**), dowód przy wniosku; w braku — wezwanie w **tydzień** pod rygorem **zwrotu wniosku**.
- **Art. 231:** wydatki pokrywa się najpierw z zaliczki (ust. 1); sąd może żądać zaliczki wyższej pod rygorem **umorzenia** — nie wstrzymuje biegu (ust. 2); **bez zażalenia** (ust. 3).

## B. PPU — otwarcie (art. 232–237)

- **Art. 232:** posiedzenie **niejawne**, wyłącznie na podstawie dokumentów z wniosku (ust. 1); rozpoznanie w **tydzień** od złożenia (ust. 2).
- **Art. 233:** postanowienie o otwarciu: dane dłużnika (jak 227 ust. 1 pkt 1, z NIP), **nadzorca sądowy**, **godzina wydania** przy uczestniku systemu płatności (ust. 1; ust. 1a — dane identyfikujące jak art. 86 ust. 6); **podstawa jurysdykcji** i — przy rozp. (UE) 2015/848 — charakter **główny lub uboczny** (ust. 2).
- **Art. 234:** skuteczne i wykonalne **z dniem wydania** (ust. 1), w przypadku z 233 ust. 1 pkt 3 — **z godziną** wydania (ust. 2).
- **Art. 235:** obwieszczenie postanowienia i prawomocności (ust. 1); doręczenie dłużnikowi, a nadzorcy z odpisem wniosku i załączników (ust. 2); organowi założycielskiemu / podmiotowi praw z akcji SP (ust. 3). Zawiadomienia: izba administracji skarbowej, ZUS/KRUS, **znane organy egzekucyjne** (ust. 4); **Prezes NBP** przy systemie płatności — z uprzedzeniem o godzinie (ust. 5); **KNF** przy spółce publicznej (ust. 6); **Prezes UKE** przy operatorze telekomunikacyjnym (ust. 7). Nadzorcę zawiadamia się w dniu otwarcia środkami porozumiewania na odległość (ust. 8); zawiadomienia z ust. 4–7 robi nadzorca w dniu otwarcia, najpóźniej w **3 dni** (ust. 9).
- **Art. 236:** zażalenie na **odmowę** otwarcia — **wyłącznie dłużnik** (ust. 1); sąd II instancji **nie może otworzyć** postępowania (ust. 2).
- **Art. 237:** wierzyciel — zażalenie na otwarcie **wyłącznie co do jurysdykcji** w **tydzień** od obwieszczenia w Rejestrze (wierzyciel z siedzibą/pobytem za granicą — **30 dni**) (ust. 1); obwieszczenie o wniesieniu (ust. 2).

## C. PPU — skutki otwarcia (art. 238–260)

- **Art. 238:** dłużnik udziela wyjaśnień sędziemu-komisarzowi i nadzorcy, udostępnia dokumenty i księgi.
- **Art. 239:** sąd **z urzędu** może **uchylić zarząd własny** i ustanowić zarządcę, gdy dłużnik choćby nieumyślnie naruszył prawo w zarządzie z (możliwym) pokrzywdzeniem wierzycieli (pkt 1), sposób zarządu oczywiście nie gwarantuje wykonania układu lub ustanowiono kuratora z art. 68 ust. 1 (pkt 2), dłużnik nie wykonuje poleceń, zwłaszcza nie złożył zgodnych z prawem propozycji w terminie (pkt 3) (ust. 1); skuteczne z dniem wydania; zażalenie **tylko dłużnika** (ust. 2); zarządca wykonuje też czynności nadzorcy (ust. 3).
- **Art. 240:** mienie służące przedsiębiorstwu i mienie dłużnika = **masa układowa** od otwarcia.
- **Art. 241:** w PPU **nie sporządza się spisu inwentarza**.
- **Art. 242:** mienie z art. 245 ust. 1 i aktywa niezbędne do obowiązków uczestnika **systemu płatności** sprzed otwarcia nie wchodzą do masy (ust. 1); dysponuje nimi operator systemu (ust. 2); pozostałość wraca do masy (ust. 3).
- **Art. 243:** wierzytelności objęte umową o **subpartycypację** (art. 183 ust. 4 ustawy o funduszach inwestycyjnych) poza masą (ust. 1); fundusz wierzytelności wstępuje w prawa i zabezpieczenia (ust. 2); dłużnik/zarządca przekazuje funduszowi otrzymane świadczenia (ust. 3).
- **Art. 244:** przedmiot zabezpieczenia ustanowionego w związku z uczestnictwem w systemie płatności (na rzecz operatora lub uczestnika) albo na rzecz **NBP, banku centralnego państwa członkowskiego lub EBC** — poza masą (z uwzględnieniem art. 12 ustawy o ostateczności rozrachunku) (ust. 1–2); otwarcie nie ogranicza zaspokojenia z tego zabezpieczenia (ust. 3).
- **Art. 245:** otwarcie nie wstrzymuje wykorzystania środków i instrumentów na rachunku rozliczeniowym oraz instrumentów jako zabezpieczenia kredytu w systemie — dla zleceń wprowadzonych najpóźniej w **dniu roboczym systemu** otwarcia (ust. 1); definicja dnia roboczego systemu (ust. 2).
- **Art. 246:** po otwarciu **zakaz obciążania** majątku hipoteką, zastawem, zastawem rejestrowym/skarbowym, hipoteką morską dla wierzytelności **sprzed otwarcia** (wyjątek: art. 129 ust. 1 pkt 1) (ust. 1); nie dotyczy wniosków o wpis złożonych **≥ 6 miesięcy** przed wnioskiem restrukturyzacyjnym (ust. 2); wpis sprzeczny — **wykreślenie z urzędu** na podstawie prawomocnego postanowienia sędziego-komisarza; zażalenie dłużnika i wierzyciela (ust. 3).
- **Art. 247:** **nieważne** klauzule przewidujące zmianę lub rozwiązanie stosunku na wypadek **wniosku** o otwarcie PPU lub jego **otwarcia**.
- **Art. 248:** postanowienie umowy uniemożliwiające lub utrudniające cel PPU — **bezskuteczne wobec masy**.
- **Art. 249:** przewłaszczenie i przelew na zabezpieczenie oraz **zastrzeżenie własności** — jak zastaw.
- **Art. 250:** wierzytelności z umów szczegółowych pod **umową ramową** (terminowe operacje finansowe, pożyczki instrumentów, repo) z klauzulą rozwiązania łącznego **nie są objęte układem** (ust. 1); definicje (ust. 2–3); każda strona może wypowiedzieć umowę ramową z rozliczeniem umownym (ust. 4); potrącenie salda dopuszczalne (ust. 5).
- **Art. 251:** otwarcie nie narusza **klauzuli kompensacyjnej** (ustawa o niektórych zabezpieczeniach finansowych).
- **Art. 252:** od otwarcia do zakończenia / prawomocnego umorzenia **zakaz spełniania świadczeń** z wierzytelności **objętych układem z mocy prawa** (ust. 1); wyjątek — zabezpieczenie uzupełniające lub zamiana zabezpieczenia finansowego w dniu otwarcia przed wydaniem postanowienia (ust. 2).
- **Art. 253:** **zakaz potrącenia**, gdy wierzyciel stał się dłużnikiem dłużnika po otwarciu lub nabył wierzytelność sprzed otwarcia przelewem/indosem po otwarciu (ust. 1); dopuszczalne, gdy nabycie wskutek zapłaty długu, za który nabywca odpowiadał osobiście lub rzeczowo, a odpowiedzialność powstała przed wnioskiem (ust. 2); oświadczenie dłużnikowi / zarządcy (skuteczne też wobec nadzorcy) w **30 dni** od otwarcia lub od powstania podstawy (ust. 3).
- **Art. 254:** zlecenia rozrachunku wprowadzone **przed** otwarciem i wyniki kompensowania — niepodważalne wobec osób trzecich.
- **Art. 255:** zlecenia wprowadzone **po** otwarciu i wykonane w dniu roboczym otwarcia — niepodważalne tylko, gdy operator wykaże **brak wiedzy** o otwarciu w chwili nieodwołalności.
- **Art. 256:** od obwieszczenia o wpisaniu wniosku dłużnika do repertorium do zwrotu / odrzucenia / oddalenia / umorzenia, a po otwarciu — do zakończenia lub umorzenia: **zakaz wypowiedzenia najmu lub dzierżawy** lokalu/nieruchomości przedsiębiorstwa **bez zezwolenia rady wierzycieli** (ust. 1); odpowiednio: kredyt (środki postawione przed otwarciem), leasing, ubezpieczenia majątkowe, rachunek bankowy, poręczenia, licencje dla dłużnika, gwarancje i akredytywy sprzed otwarcia oraz inne **umowy o podstawowym znaczeniu**; ich **spis sporządza nadzorca w 3 tygodnie** (ust. 2); ochrona nie obejmuje wypowiedzeń z powodu niewykonywania po otwarciu zobowiązań **nieobjętych układem** lub innych okoliczności powstałych po otwarciu (ust. 3).
- **Art. 257:** otwarcie **nie wyłącza procesów** wierzycieli o wierzytelności podlegające umieszczeniu w spisie.
- **Art. 258:** dłużnik informuje nadzorcę o postępowaniach dotyczących masy; **uznanie, zrzeczenie, ugoda, przyznanie** bez zgody nadzorcy — bez skutków.
- **Art. 259:** egzekucja wierzytelności **objętej układem z mocy prawa**, wszczęta przed otwarciem — **zawieszona z mocy prawa**; sędzia-komisarz stwierdza to na wniosek dłużnika lub nadzorcy, doręczenie organowi (ust. 1); może **uchylić zajęcie** sprzed otwarcia, gdy konieczne dla przedsiębiorstwa (ust. 2); po otwarciu **zakaz wszczęcia** egzekucji i wykonania zabezpieczenia (ust. 3); **bieg przedawnienia** nie rozpoczyna się, a rozpoczęty jest zawieszony przez czas PPU (ust. 4).
- **Art. 260:** wierzyciel zabezpieczony rzeczowo prowadzi egzekucję **wyłącznie z przedmiotu zabezpieczenia** (ust. 1); sędzia-komisarz może zawiesić egzekucję wierzytelności nieobjętych układem z mocy prawa, skierowaną do przedmiotu **niezbędnego** do prowadzenia przedsiębiorstwa — łącznie **≤ 3 miesiące** (ust. 2); doręczenie organowi (ust. 3); zażalenie: na zawieszenie — tylko wierzyciel; na oddalenie — tylko dłużnik (ust. 4); nie dotyczy egzekucji **alimentów i rent** odszkodowawczych i z dożywocia (ust. 5).

## D. PPU — przebieg (art. 261–264)

- **Art. 261:** nadzorca w **30 dni** od otwarcia składa sędziemu-komisarzowi **plan restrukturyzacyjny**, **spis wierzytelności** i **spis wierzytelności spornych** (ust. 1); co najmniej **30 dni** przed głosowaniem pisemnym (art. 110 ust. 7) lub zwołaniem zgromadzenia: **test zaspokojenia** (art. 10a ust. 1), **opinię o wykonalności** propozycji podmiotów z art. 155, **test prywatnego wierzyciela / inwestora** (art. 140) (ust. 2); **zastrzeżenia** uczestników w **2 tygodnie** od sporządzenia; nadzorca w 2 tygodnie zmienia dokumenty albo składa oświadczenie z uzasadnieniem; zastrzeżenia **nie przesuwają** głosowania (ust. 3).
- **Art. 262:** przy zmianach lub zastrzeżeniach dłużnika z art. 90 ust. 1 — nadzorca składa na zgromadzeniu **aktualne spisy**.
- **Art. 263:** po złożeniu dokumentów sędzia-komisarz niezwłocznie wyznacza termin zgromadzenia (ust. 1); przy wsparciu z art. 140 — doręczenie planu i testu udzielającemu wsparcia z dokumentami z art. 37 ustawy o pomocy publicznej; termin zgromadzenia dopiero po terminach z art. 204–205 (ust. 2).
- **Art. 264:** nadzorca zawiadamia wierzycieli ze spisu, doręczając propozycje, informację o **podziale na kategorie interesów**, sposób głosowania i pouczenie o art. 107–110, 113, 115–119 (ust. 1); tak samo wierzycieli ze **spisu spornych** — z informacją, że sędzia-komisarz może dopuścić ich do zgromadzenia po **uprawdopodobnieniu** wierzytelności (ust. 2).

## E. PU — wniosek, zabezpieczenie, otwarcie (art. 265–272)

- **Art. 265:** wniosek o otwarcie PU spełnia wymogi art. 227 ust. 1 **pkt 1–3 i 6–10** (bez pkt 4–5 i 11), o ile rozdział nie stanowi inaczej.
- **Art. 266:** dłużnik **uprawdopodabnia zdolność do bieżącego zaspokajania kosztów** postępowania i zobowiązań powstałych po otwarciu (ust. 1); **bez odpisów propozycji** (ust. 2); art. 228–229 odpowiednio (ust. 3).
- **Art. 267:** zaliczka na żądanie sądu — rygor **pominięcia czynności**, a przy zaliczce na wynagrodzenie tymczasowego nadzorcy — **umorzenia**.
- **Art. 268:** zabezpieczenie majątku przez **tymczasowego nadzorcę sądowego**; obwieszczenia o ustanowieniu, zmianie i odwołaniu (ust. 1). Na wniosek dłużnika lub tymczasowego nadzorcy sąd może **zawiesić egzekucje** należności objętych układem z mocy prawa i **uchylić zajęcie rachunku bankowego** (wtedy ustanawia tymczasowego nadzorcę) (ust. 2); dyspozycje rachunkiem — za zgodą tymczasowego nadzorcy (ust. 3); doręczenie wierzycielowi i organowi; zażalenie dłużnika i wierzyciela (ust. 4); przepisy o nadzorcy bez art. 42–46 (ust. 5). **Wynagrodzenie** tymczasowego nadzorcy: kryteria (ust. 6), **¼–2×** przeciętnego wynagrodzenia z **III kw. roku poprzedniego** (ust. 7), **do 4×** w szczególnie uzasadnionych przypadkach (ust. 8); wniosek w **tydzień** od odwołania lub wygaśnięcia funkcji (ust. 9).
- **Art. 269:** odpowiednio KPC o zabezpieczeniu (ust. 1); zabezpieczenia **upadają** z otwarciem, prawomocnym zwrotem, odrzuceniem, oddaleniem lub umorzeniem; obwieszczenie upadku tymczasowego nadzorcy (ust. 2).
- **Art. 270:** posiedzenie niejawne (ust. 1); rozpoznanie w **2 tygodnie**, a przy rozprawie — w **6 tygodni** (ust. 2).
- **Art. 271:** do postanowienia — art. 233–235 odpowiednio (ust. 1); doręczenie tymczasowemu nadzorcy (ust. 2); postanowienie z rozprawy doręcza się podmiotom z art. 235 ust. 2–3 i tymczasowemu nadzorcy, jeżeli nie byli zawiadomieni (ust. 3).
- **Art. 272:** zażalenia — art. 236–237 odpowiednio.

## F. PU — skutki otwarcia (art. 273–279)

- **Art. 273:** po otwarciu PU stosuje się odpowiednio **art. 238–256** (sekcja C); skład masy i spis inwentarza w PU reguluje odrębnie art. 274–275.
- **Art. 274:** nadzorca ustala **skład masy** w **30 dni** od otwarcia na podstawie ksiąg i dokumentów bezspornych (ust. 1); sędzia-komisarz może powierzyć to dłużnikowi pod nadzorem (ust. 2).
- **Art. 275:** skład masy na dzień otwarcia — **spisy w systemie teleinformatycznym** według wzorca: ruchomości, nieruchomości, środki pieniężne, prawa majątkowe oraz **spis należności** (ust. 1); prowadzone na bieżąco, z usuwaniem błędnych pozycji (ust. 2); po zakończeniu — **spis inwentarza** z raportów obu spisów (ust. 3).
- **Art. 276:** procesy wierzycieli dopuszczalne; **koszty** obciążają wszczynającego, jeżeli nie było przeszkód do umieszczenia wierzytelności w całości w spisie.
- **Art. 277:** nadzorca **wstępuje z mocy prawa** do postępowań dotyczących masy (ust. 1): w sprawach cywilnych — jako interwenient uboczny lub uczestnik ze współuczestnictwem jednolitym (ust. 2); w administracyjnych, sądowoadministracyjnych i arbitrażowych — prawa strony (ust. 3); czynności dyspozytywne dłużnika bez zgody nadzorcy — bez skutków (ust. 4).
- **Art. 278:** egzekucja wierzytelności objętych układem z mocy prawa — **zawieszona z mocy prawa**; stwierdzenie przez sędziego-komisarza (ust. 1); **niewydane sumy** z zawieszonej egzekucji — niezwłocznie **do masy** (ust. 2); art. 259 ust. 2–4 odpowiednio (ust. 3).
- **Art. 279:** art. 260 (egzekucja zabezpieczonych) odpowiednio.

## G. PU — przebieg (art. 280–282)

- **Art. 280:** nadzorca w **30 dni** od otwarcia: **plan restrukturyzacyjny** i **spis wierzytelności** (bez spisu spornych) (ust. 1); **30 dni** przed głosowaniem: test zaspokojenia, opinia o wykonalności, test prywatnego wierzyciela/inwestora (ust. 2); zastrzeżenia w **2 tygodnie** jak art. 261 ust. 3 (ust. 3).
- **Art. 281:** termin zgromadzenia — niezwłocznie po złożeniu planu i **zatwierdzeniu spisu wierzytelności** (ust. 1); art. 263 ust. 2 odpowiednio (ust. 2).
- **Art. 282:** zawiadomienia — art. 264 ust. 1 (ust. 1); wierzyciel, którego dotyczy **nierozpoznany prawomocnie sprzeciw** — jak wierzyciel sporny (art. 264 ust. 1 i ust. 2 zd. 2) (ust. 2).

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| ≤ 15% / > 15% | sporne uprawniające do głosu: PPU / PU | art. 3 ust. 3–4 |
| 30 dni | data bilansu przed wnioskiem PPU | art. 227 ust. 1 pkt 5 |
| 250 pracowników / 50 mln EUR / 43 mln EUR | informacja o wielkości dłużnika | art. 227 ust. 1 pkt 11 |
| 1× GUS III kw.; tydzień | zaliczka PPU; wezwanie pod rygorem zwrotu | art. 230 |
| tydzień | rozpoznanie wniosku PPU | art. 232 ust. 2 |
| 2 tyg. / 6 tyg. | rozpoznanie wniosku PU (bez / z rozprawą) | art. 270 ust. 2 |
| dzień otwarcia / 3 dni | zawiadomienia przez nadzorcę | art. 235 ust. 9 |
| tydzień / 30 dni | zażalenie wierzyciela (krajowego / zagranicznego) co do jurysdykcji | art. 237 ust. 1 |
| 6 mies. przed wnioskiem | wnioski o wpis zabezpieczenia chronione | art. 246 ust. 2 |
| 30 dni | oświadczenie o potrąceniu | art. 253 ust. 3 |
| 3 tygodnie | spis umów o podstawowym znaczeniu | art. 256 ust. 2 |
| ≤ 3 mies. | zawieszenie egzekucji z przedmiotu zabezpieczenia | art. 260 ust. 2 |
| 30 dni od otwarcia | plan i spisy (PPU) / plan i spis (PU) / skład masy (PU) | art. 261 ust. 1; 280 ust. 1; 274 ust. 1 |
| ≥ 30 dni przed głosowaniem; 2 tyg. | testy i opinia; zastrzeżenia i odpowiedź nadzorcy | art. 261 ust. 2–3; 280 ust. 2–3 |
| ¼–2× (do 4×) GUS III kw.; tydzień | wynagrodzenie tymczasowego nadzorcy; wniosek | art. 268 ust. 7–9 |

## PUŁAPKI

- PPU: brak spisu inwentarza (241) i brak sprzeciwów do spisu — spis spornych zamiast tego; PU: spis inwentarza (275) i sprzeciw (282 ust. 2).
- Zakaz z art. 252 dotyczy tylko wierzytelności **objętych układem z mocy prawa**; bieżące zobowiązania reguluje się normalnie.
- Ochrona umów (256) działa już od obwieszczenia wpisania wniosku do repertorium — ale nie chroni przed wypowiedzeniem za zaległości powstałe po otwarciu.
- Klauzule ipso facto są nieważne (247), a utrudniające cel — bezskuteczne wobec masy (248): różne skutki.
- Wierzytelności z umów ramowych z close-out netting nie są objęte układem (250); klauzula kompensacyjna nienaruszona (251).
- Egzekucja wierzyciela zabezpieczonego rzeczowo nie jest zawieszona z mocy prawa — tylko z przedmiotu zabezpieczenia, z możliwym zawieszeniem ≤ 3 mies. (260).
- Przedawnienie roszczeń objętych zakazem egzekucji jest zawieszone (259 ust. 4).
- Zastrzeżenia do testów nie przesuwają głosowania (261 ust. 3, 280 ust. 3).
- Wsparcie publiczne w propozycjach blokuje wyznaczenie zgromadzenia do upływu terminów z art. 204–205 (263 ust. 2).
- Sąd II instancji nie otwiera postępowania (236 ust. 2); wierzyciel skarży otwarcie tylko co do jurysdykcji (237).
- PU: koszty procesu ponosi wierzyciel, jeżeli wierzytelność mogła trafić do spisu (276).

## POWIĄZANIA

- Cele i tryby, test zaspokojenia (art. 3, 10a) → `mod-PrRestr-wejscie-plan-test`
- Nadzorca, zarządca, kurator art. 68, art. 42–46 → `mod-PrRestr-dzial-III-nadzorca-zarzadca`
- Spis wierzytelności, zastrzeżenia art. 90, głosowanie art. 107–119, rada wierzycieli art. 129 → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`
- Pomoc publiczna, test prywatnego wierzyciela (art. 140, 204–205) → `mod-PrRestr-dzial-V-pomoc-publiczna`
- Układ, podmioty z art. 155 → `mod-PrRestr-dzial-VI-uklad`
- Zakończenie i umorzenie (art. 324 i n.) → `mod-PrRestr-procedura-zakonczenie`
- Sanacja (art. 283 i n.) → `mod-PrRestr-sanacja`; PZU (art. 210 i n.) → `mod-PrRestr-pzu`
- Rozp. (UE) 2015/848, postępowania transgraniczne → `mod-PrRestr-odrebne-miedzynarodowe`

## WYNIK

Wybór trybu (art. 3: 15%) → wniosek z kompletem z 227 (PU: 265–266) → zaliczka (230 / 267) → otwarcie (232–235 / 270–271) z zawiadomieniami w dniu otwarcia → ochrona: zakaz świadczeń (252), zakaz potrąceń (253), umowy kluczowe (256), zawieszenie egzekucji (259 / 278) → plan i spisy w 30 dni (261 / 280) → testy 30 dni przed głosowaniem → zgromadzenie i zawiadomienia z kategoriami interesów (263–264 / 281–282).
