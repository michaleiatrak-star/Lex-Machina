# Restrukturyzacja — postępowanie sanacyjne (PrRestr art. 283–323)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 71–79
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak (późniejsze nowelizacje dotyczą art. 4 i 156 → `references/insolvency/wersje-i-przepisy-przejsciowe.md`).
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 306 --verify-online`. Termin bezskuteczności w sanacji to **rok od otwarcia** (306 ust. 2) — nie przenoś terminów z PrUp. Skutki dla stosunków pracy (300) i sprzedaży (323 ust. 3) — według PrUp; odczytaj właściwe przepisy PrUp.

---

## FAZA 0 — INTAKE

```
□ Wnioskodawca: dłużnik / kurator z art. 42 § 1 KC (osoba prawna w KRS) / wierzyciel osobisty niewypłacalnej osoby prawnej (283)
□ Wniosek dłużnika: wstępny plan z uzasadnieniem przywrócenia zdolności, uprawdopodobnienie bieżącego pokrywania kosztów i zobowiązań po otwarciu,
  wykaz wierzycieli (objęci z mocy prawa / za zgodą / prawo głosu), sporne, system płatności, progi 250 / 50 mln EUR / 43 mln EUR (284)
□ Wniosek wierzyciela: okoliczności + uprawdopodobnienie wierzytelności (284 ust. 4)
□ Zabezpieczenie przed otwarciem: tymczasowy nadzorca / tymczasowy zarządca (286); zażalenie dłużnika na tymczasowego zarządcę przy wniosku wierzyciela
□ Zarząd: co do zasady odebrany i zarządca; wyjątek — zezwolenie na zwykły zarząd całością/częścią (288 ust. 3)
□ Umowy wzajemne niewykonane — odstąpienie za zgodą sędziego-komisarza; żądanie kontrahenta → 2 tygodnie (298)
□ Pracownicy: skutki jak upadłość, uprawnienia syndyka wykonuje zarządca (300); plan musi wskazać zasady zwolnień (314)
□ Czynności z roku przed wnioskiem: nieekwiwalentne, zabezpieczenia, wynagrodzenia zarządu (304–305) — powództwo w roku od otwarcia (306)
□ Egzekucje: zawieszenie z mocy prawa, zakaz nowych, wyjątki alimentacyjne (312)
□ Plan w 30 dni (≤ 3 mies.); spis w 30 dni; głosowanie przed upływem 12 mies. od otwarcia (313, 320, 321)
□ Majątek obronny → zawiadomienie MON i prawo wykupu (323 ust. 2–2d)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 283–285 | legitymacja, wniosek, zaliczka | A |
| 286–287 | zabezpieczenie: tymczasowy nadzorca / zarządca | A |
| 288–290 | rozpoznanie, otwarcie, zarząd, doręczenia, zażalenia | B |
| 291–293 | skutki co do osoby dłużnika: wydanie majątku, wyjaśnienia, wygaśnięcie pełnomocnictw | C |
| 294–296 | masa sanacyjna, odesłanie do art. 242–246, ustalenie składu masy | C |
| 297–300 | zobowiązania: odesłanie do art. 247–256, odstąpienie od umów, umowy ramowe, stosunki pracy | D |
| 301–303 | spadki i zapisy | D |
| 304–309 | bezskuteczność i zaskarżanie czynności dłużnika | E |
| 310–312 | procesy, legitymacja zarządcy, egzekucja | F |
| 313–319 | plan restrukturyzacyjny: termin, treść, zatwierdzenie, realizacja, zmiany, pomoc publiczna | G |
| 320–323 | spis, testy, zgromadzenie, sprzedaż majątku | H |
| uchylone | brak całych artykułów (uchylony 307 ust. 5) | — |

---

## A. Wniosek i zabezpieczenie (art. 283–287)

- **Art. 283:** wniosek może zgłosić także **kurator z art. 42 § 1 KC** osoby prawnej w KRS (ust. 1) oraz **wierzyciel osobisty niewypłacalnej osoby prawnej** (ust. 2).
- **Art. 284:** wniosek (ust. 1): dane dłużnika i reprezentantów/wspólników (pkt 1; ust. 1a — dane identyfikujące jak art. 86 ust. 6), NIP (pkt 1a), miejsca majątku (pkt 2), **wstępny plan restrukturyzacyjny z uzasadnieniem**, że przywróci zdolność wykonywania zobowiązań (pkt 3), **uprawdopodobnienie zdolności do bieżącego pokrywania kosztów** sanacji i zobowiązań po otwarciu (pkt 4), wykaz wierzycieli z kwalifikacją objęcia układem i prawa głosu (pkt 5), sumy (pkt 6), wierzytelności sporne (pkt 7), system płatności (pkt 8), progi **250 pracowników / 50 mln EUR obrotu / 43 mln EUR aktywów** (pkt 9). Wierzytelności zabezpieczone — suma według części **prawdopodobnie zaspokojonej z przedmiotu zabezpieczenia** (ust. 2); art. 228–229 odpowiednio (ust. 3). **Wniosek wierzyciela**: bez pkt 3–8 i ust. 2; okoliczności i **uprawdopodobnienie wierzytelności**; sąd może żądać od dłużnika danych w **2 tygodnie** (ust. 4).
- **Art. 285:** zaliczka na żądanie sądu — rygor **pominięcia czynności**, a przy zaliczce na wynagrodzenie tymczasowego nadzorcy/zarządcy — **umorzenia**.
- **Art. 286:** zabezpieczenie przez **tymczasowego nadzorcę sądowego** (bez art. 42–46) albo **tymczasowego zarządcę** (bez art. 55–59, 61, 62); obwieszczenia (ust. 1); **zażalenie dłużnika** na tymczasowego zarządcę przy wniosku wierzyciela (ust. 1a); zawieszenie egzekucji i wynagrodzenie — art. 268 ust. 2–4 i 6–9 (ust. 2: ¼–2×, do 4× podstawy z III kw.).
- **Art. 287:** odpowiednio KPC o zabezpieczeniu (ust. 1); zabezpieczenia **upadają** z otwarciem lub prawomocnym zwrotem, odrzuceniem, oddaleniem, umorzeniem; obwieszczenie (ust. 2).

## B. Otwarcie (art. 288–290)

- **Art. 288:** rozpoznanie jak art. 270 (**2 tygodnie**, z rozprawą — **6 tygodni**) (ust. 1); postanowienie jak art. 233–234; sąd **odbiera zarząd własny i wyznacza zarządcę** (ust. 2); gdy sanacja wymaga osobistego udziału dłużnika i daje on gwarancję — **zezwolenie na zwykły zarząd** całością lub częścią przedsiębiorstwa; cofnięcie przy przesłankach art. 239 ust. 1 (ust. 3).
- **Art. 289:** doręczenia i zawiadomienia jak art. 235 (ust. 1); także tymczasowemu nadzorcy/zarządcy (ust. 2); postanowienie z rozprawy — podmiotom niezawiadomionym (ust. 3).
- **Art. 290:** otwarcie na wniosek **wierzyciela** — zażalenie **tylko dłużnika** (ust. 1); **odmowa** — zażalenie dłużnika i wnioskodawcy (ust. 2); art. 236 ust. 2 (sąd II instancji nie otwiera) i 237 (zażalenie wierzycieli co do jurysdykcji) odpowiednio (ust. 3).

## C. Skutki co do dłużnika i masy (art. 291–296)

- **Art. 291:** dłużnik bez zezwolenia z 288 ust. 3 **wskazuje i wydaje zarządcy cały majątek i dokumenty** (księgi, ewidencje podatkowe, korespondencja) i potwierdza to **pisemnym oświadczeniem** dla sędziego-komisarza (ust. 1); udziela wyjaśnień (ust. 2).
- **Art. 292:** dłużnik z zezwoleniem — wyjaśnienia, dokumenty, dostęp do ksiąg (chyba że sąd nałoży więcej).
- **Art. 293:** otwarcie powoduje **wygaśnięcie prokury i pełnomocnictw** dłużnika; zarządca może udzielać nowych, w tym prokury.
- **Art. 294:** mienie służące przedsiębiorstwu i mienie dłużnika = **masa sanacyjna** od otwarcia.
- **Art. 295:** odpowiednio **art. 242–246** (systemy płatności, subpartycypacja, zabezpieczenia na rzecz banków centralnych, zakaz nowych obciążeń dla starych długów).
- **Art. 296:** skład masy ustala **zarządca** (ust. 1) według art. 274 ust. 1 i 275 — **30 dni**, spisy w systemie, spis inwentarza (ust. 2).

## D. Zobowiązania, umowy, pracownicy, spadki (art. 297–303)

- **Art. 297:** odpowiednio **art. 247–256** (nieważność klauzul ipso facto, bezskuteczność klauzul utrudniających, przewłaszczenia jak zastaw, umowy ramowe, kompensowanie, zakaz spełniania świadczeń objętych układem, potrącenia, systemy płatności, ochrona najmu i umów kluczowych).
- **Art. 298:** zarządca może **odstąpić od umowy wzajemnej** niewykonanej przed otwarciem **za zgodą sędziego-komisarza**, gdy świadczenie drugiej strony jest **niepodzielne** (ust. 1); przy **podzielnym** — co do części przypadającej **po otwarciu** (ust. 2); kryteria: cel sanacji i **ważny interes** kontrahenta (ust. 3); zażalenie dłużnika i kontrahenta (ust. 4). **Żądanie kontrahenta** (pisemne, z datą pewną) → zarządca w **2 tygodnie** składa wniosek o zgodę albo informuje, że nie złoży; milczenie lub odmowa = **utrata prawa** do wniosku (ust. 5); po złożeniu wniosku kontrahent może **wstrzymać świadczenie** (ust. 6); po odstąpieniu — zwrot świadczenia spełnionego po otwarciu, jeżeli jest w majątku; inaczej wierzytelność z tytułu wykonania i strat — **nieobjęta układem** (ust. 7).
- **Art. 299:** odstąpienie **nie dotyczy umowy ramowej** z art. 250 ust. 1 (ust. 1) — każda strona może ją wypowiedzieć z rozliczeniem umownym (ust. 2) — ani umów szczegółowych o terminowe operacje finansowe, pożyczki instrumentów, repo (ust. 3).
- **Art. 300:** otwarcie sanacji wywołuje dla **stosunków pracy** takie skutki jak **ogłoszenie upadłości**; uprawnienia syndyka wykonuje **zarządca**.
- **Art. 301:** spadek otwarty **po otwarciu sanacji** wchodzi do masy; zarządca nie składa oświadczenia — przyjęcie z **dobrodziejstwem inwentarza** (ust. 1); tak samo, gdy spadek otwarto wcześniej, a termin na oświadczenie nie upłynął i dłużnik go nie złożył (ust. 2); odpowiednio **zapisy zwykłe i windykacyjne** (ust. 3).
- **Art. 302:** **nieważne**: zbycie spadku lub udziału spadkowego przez dłużnika po otwarciu (ust. 1) oraz rozporządzenie udziałem w przedmiocie spadku lub zgoda na rozporządzenie przez innego spadkobiercę (ust. 2).
- **Art. 303:** **odrzucenie spadku lub zapisu windykacyjnego** po otwarciu — **bezskuteczne** wobec masy.

## E. Bezskuteczność (art. 304–309)

- **Art. 304:** bezskuteczne wobec masy: czynności **nieodpłatne lub rażąco nieekwiwalentne** (świadczenie dłużnika **w istotnym stopniu** przewyższa otrzymane) z **roku przed wnioskiem** (ust. 1); odpowiednio **ugoda sądowa, uznanie powództwa, zrzeczenie** (ust. 2); **zabezpieczenia** nieustanowione bezpośrednio w związku z otrzymaniem świadczenia — rok przed wnioskiem (ust. 3); zabezpieczenia w części przewyższającej o **ponad połowę** wartość otrzymanego świadczenia z należnościami ubocznymi (ust. 4); odpowiednio **poręczenia i gwarancje** (ust. 5); nie dotyczy zabezpieczeń operacji z art. 250 ust. 1 (ust. 6).
- **Art. 305:** **wynagrodzenie** reprezentanta, pracownika zarządzającego lub usługodawcy w zakresie zarządu/nadzoru (z umowy o pracę, o usługi, uchwały) **rażąco wyższe** od przeciętnego i nieuzasadnione nakładem — sędzia-komisarz z urzędu lub na wniosek zarządcy uznaje część za **bezskuteczną** za okres przed otwarciem, **max 3 miesiące** przed wnioskiem, nawet wypłaconą (ust. 1); po otwarciu — w całości lub części, jeżeli nieuzasadnione z uwagi na zarząd zarządcy (ust. 2); określenie wynagrodzenia odpowiedniego (ust. 3); wysłuchanie (ust. 4); zażalenie tych osób (ust. 5); odpowiednio **odprawy** — do wysokości powszechnie obowiązującej (ust. 6).
- **Art. 306:** powództwo wytacza **zarządca**, **bez opłat** (ust. 1); ustalenie bezskuteczności **po roku od otwarcia — niedopuszczalne**, chyba że uprawnienie z KC wygasło wcześniej; termin nie dotyczy **zarzutu** (ust. 2).
- **Art. 307:** to, co ubyło lub nie weszło, wraca **do masy** (w naturze lub w pieniądzu) (ust. 1); za zgodą sędziego-komisarza kontrahent może zapłacić **różnicę** wartości rynkowej (ust. 2) — zażalenie do sądu II instancji (ust. 4); przy braku wykonania — powództwo zarządcy do **sądu restrukturyzacyjnego** (ust. 3) z możliwym **zakazem zbywania/obciążania** (ust. 3a); zwrot świadczenia wzajemnego, jeżeli wyodrębnione lub masa wzbogacona; inaczej wierzytelność **objęta układem** (ust. 6; ust. 5 uchylony).
- **Art. 308:** poza art. 304–307 — odpowiednio **skarga pauliańska** (KC o ochronie wierzyciela w razie niewypłacalności dłużnika).
- **Art. 309:** przepisów o zaskarżaniu i bezskuteczności nie stosuje się do **kompensowania** z art. 254 (ust. 1) ani do **umów o zabezpieczenie finansowe** i ich wykonania (ust. 2).

## F. Procesy i egzekucja (art. 310–312)

- **Art. 310:** otwarcie **nie wyłącza procesów** wierzycieli o wierzytelności do spisu; koszty obciążają wszczynającego, jeżeli wierzytelność mogła trafić w całości do spisu.
- **Art. 311:** postępowania dotyczące masy — **wyłącznie przez zarządcę lub przeciw niemu**, w imieniu własnym na rzecz dłużnika (ust. 1); nie dotyczy spraw o **alimenty, odszkodowania i renty** (ust. 2); arbitraż — art. 174 § 1 pkt 4–5 i 180 § 1 pkt 5 KPC odpowiednio (ust. 3).
- **Art. 312:** egzekucja do masy wszczęta przed otwarciem — **zawieszona z mocy prawa**; stwierdzenie przez sędziego-komisarza (ust. 1); **uchylenie zajęć** konieczne dla przedsiębiorstwa (ust. 2); niewydane sumy — **do masy** (ust. 3); po otwarciu **zakaz egzekucji i wykonania zabezpieczeń** do masy (ust. 4); wyjątek — **alimenty i renty** (ust. 5); **przedawnienie** nie biegnie (ust. 6). (W sanacji zawieszenie obejmuje każdą egzekucję do masy, nie tylko wierzytelności objętych układem.)

## G. Plan restrukturyzacyjny (art. 313–319)

- **Art. 313:** zarządca w porozumieniu z dłużnikiem składa plan w **30 dni** od otwarcia; przy braku porozumienia — z **zastrzeżeniami dłużnika** i uzasadnieniem ich nieuwzględnienia (ust. 1); przedłużenie do **3 miesięcy** (ust. 2).
- **Art. 314:** przy **redukcji zatrudnienia** (art. 300), **odstąpieniu od umów** (298) lub **sprzedaży** (323) plan wskazuje: liczbę zwalnianych, okres, kryteria, mienie do zbycia i umowy do odstąpienia.
- **Art. 315:** zatwierdzenie przez sędziego-komisarza po **opinii rady wierzycieli** (ust. 1); może **zakazać** niektórych działań i **nakazać** inne (ust. 2).
- **Art. 316:** realizacja **po zatwierdzeniu**.
- **Art. 317:** przed zatwierdzeniem — działania **niezbędne niezwłocznie**; informacja do sędziego-komisarza, który może **zakazać w 3 dni**.
- **Art. 318:** **zmiany planu** stosownie do okoliczności — art. 263 ust. 2, 314 i 315 odpowiednio.
- **Art. 319:** plan z **pomocą publiczną** wymagającą zgody → zarządca niezwłocznie po zatwierdzeniu wszczyna procedurę zgody.

## H. Spis, zgromadzenie, sprzedaż (art. 320–323)

- **Art. 320:** **spis wierzytelności** w **30 dni** od otwarcia (ust. 1); co najmniej **30 dni** przed głosowaniem: **test zaspokojenia** (10a ust. 1), **opinia o wykonalności** (art. 155), **test prywatnego wierzyciela/inwestora** (140), **sprawozdanie z wykonania planu** i działania po układzie (ust. 2); zastrzeżenia w **2 tygodnie**, odpowiedź zarządcy w 2 tygodnie, bez wpływu na termin głosowania (ust. 3).
- **Art. 321:** zgromadzenie niezwłocznie po wykonaniu planu przewidzianego na czas sanacji, **najpóźniej przed upływem 12 miesięcy** od otwarcia (ust. 1); gdy spis niezatwierdzony lub procedura pomocy publicznej niezakończona — niezwłocznie po tych zdarzeniach (ust. 2).
- **Art. 322:** zawiadomienia — art. 264 ust. 1 (ust. 1); wierzyciel z **nierozpoznanym sprzeciwem** — jak sporny (ust. 2).
- **Art. 323:** **zbycie** mienia masy oraz składników z art. 307 ust. 1 przez zarządcę **za zgodą sędziego-komisarza**, który określa warunki; art. 73 (majątek wspólny) (ust. 1). **Prawo wykupu Skarbu Państwa (MON)** składników służących obronności (ust. 2): zawiadomienie MON — **opinia w tydzień**, **oświadczenie o wykupie w 30 dni** (ust. 2a); cena z **opinii biegłego**, nie niższa niż kwota z likwidacji upadłościowej pomniejszona o koszty; koszt opinii — SP (ust. 2b); zażalenie MON, wierzycieli, dłużnika (ust. 2c); przy zastawie rejestrowym — art. 311 ust. 1ad PrUp (ust. 2d). Sprzedaż i wykup mają **skutki sprzedaży przez syndyka** (ust. 3); **odrębny plan podziału** sum z przedmiotów obciążonych według PrUp (ust. 4); nie dotyczy zbycia w **zwykłym zarządzie** w ramach działalności (ust. 5).

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| 2 tygodnie | dane od dłużnika przy wniosku wierzyciela | art. 284 ust. 4 |
| 2 tyg. / 6 tyg. | rozpoznanie wniosku (bez / z rozprawą) | art. 288 ust. 1 → 270 |
| ¼–2× (do 4×) podstawy GUS III kw. | wynagrodzenie tymczasowego nadzorcy/zarządcy | art. 286 ust. 2 → 268 ust. 7–8 |
| 30 dni | skład masy / spis inwentarza | art. 296 → 274 ust. 1 |
| 2 tygodnie | odpowiedź zarządcy na żądanie kontrahenta | art. 298 ust. 5 |
| rok przed wnioskiem | czynności nieekwiwalentne i zabezpieczenia | art. 304 |
| > ½ wartości świadczenia | nadmierne zabezpieczenie | art. 304 ust. 4 |
| 3 mies. przed wnioskiem | wynagrodzenia zarządu — bezskuteczność części | art. 305 ust. 1 |
| rok od otwarcia | ustalenie bezskuteczności (poza zarzutem) | art. 306 ust. 2 |
| 30 dni (do 3 mies.) | plan restrukturyzacyjny | art. 313 |
| 3 dni | zakaz działań przed zatwierdzeniem planu | art. 317 |
| 30 dni | spis wierzytelności | art. 320 ust. 1 |
| ≥ 30 dni przed głosowaniem; 2 tyg. | testy, opinia, sprawozdanie; zastrzeżenia | art. 320 ust. 2–3 |
| < 12 mies. od otwarcia | zwołanie zgromadzenia | art. 321 |
| tydzień / 30 dni | opinia MON / oświadczenie o wykupie | art. 323 ust. 2a |

## PUŁAPKI

- Standardem jest odebranie zarządu; zwykły zarząd dłużnika tylko na podstawie zezwolenia sądu (288 ust. 3), cofanego przy przesłankach art. 239 ust. 1.
- Prokura i pełnomocnictwa wygasają z otwarciem (293) — sprawdź umocowanie pełnomocników procesowych i bankowych.
- Odstąpienie od umowy wymaga zgody sędziego-komisarza (298) — bez niej oświadczenie zarządcy nie ma podstawy; żądanie kontrahenta uruchamia 2-tygodniowy termin z prekluzją.
- Wierzytelność kontrahenta po odstąpieniu (298 ust. 7) nie jest objęta układem; wierzytelność z art. 307 ust. 6 — jest.
- Termin z art. 306 ust. 2 biegnie od otwarcia sanacji, nie od wniosku; zarzut nie podlega terminowi.
- W sanacji zakaz egzekucji obejmuje cały majątek masy (312 ust. 4), a w PPU/PU — wierzytelności objęte układem z mocy prawa (259, 278).
- Procesy o masę tylko z udziałem zarządcy (311 ust. 1) — poza alimentami i rentami.
- Spadek po otwarciu: zarządca nie przyjmuje go oświadczeniem — przyjęcie z dobrodziejstwem inwentarza z mocy prawa (301).
- Sprzedaż majątku obronnego bez zawiadomienia MON narusza prawo wykupu (323 ust. 2a).
- Zgromadzenie po 12 miesiącach dopuszczalne tylko przy niezatwierdzonym spisie lub trwającej procedurze pomocy publicznej (321 ust. 2).

## POWIĄZANIA

- Zarządca, wynagrodzenie (art. 51–64), tymczasowy organ → `mod-PrRestr-dzial-III-nadzorca-zarzadca`
- Spis, sprzeciwy (art. 91–98), uproszczony wniosek i wcześniejszy spis (art. 84 ust. 2), rada wierzycieli → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`
- Art. 233–256, 264, 268, 270, 274–275 → `mod-PrRestr-ppu-pu`
- Test zaspokojenia, plan (art. 10, 10a) → `mod-PrRestr-wejscie-plan-test`; pomoc publiczna, test prywatnego wierzyciela → `mod-PrRestr-dzial-V-pomoc-publiczna`
- Układ, art. 155 → `mod-PrRestr-dzial-VI-uklad`; umorzenie i zakończenie (art. 324 i n.) → `mod-PrRestr-procedura-zakonczenie`
- Skarga pauliańska (KC — ochrona wierzyciela przy niewypłacalności dłużnika) → `mod-KC-cywilne-zobowiazania-odpowiedzialnosc`
- Skutki upadłości dla stosunków pracy, sprzedaż przez syndyka, art. 311 ust. 1ad, plan oddzielny → `mod-PrUpad-syndyk-likwidacja`, `mod-PrUpad-podzial-335-360`, `mod-PrUpad-skutki-masa-bezskutecznosc`

## WYNIK

Legitymacja i wniosek (283–284) → zabezpieczenie (286) → otwarcie z zarządcą (288) → przejęcie majątku i dokumentów, wygaśnięcie pełnomocnictw (291–293) → skład masy w 30 dni (296) → narzędzia sanacyjne: odstąpienie od umów (298), zwolnienia (300), bezskuteczność w roku od otwarcia (304–308), zbycie za zgodą (323) → plan w 30 dni / 3 mies. z elementami z art. 314, zatwierdzenie po opinii rady (313–315) → spis w 30 dni i dokumenty 30 dni przed głosowaniem (320) → zgromadzenie przed upływem 12 mies. (321).
