# Restrukturyzacja — uczestnicy, spis wierzytelności, zgromadzenie i rada wierzycieli (PrRestr art. 65–139)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 21–35
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak (późniejsze nowelizacje dotyczą art. 4 i 156 → `references/insolvency/wersje-i-przepisy-przejsciowe.md`).
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 119 --verify-online`. Większości przy układzie liczy się z art. 119, nie z ogólnej reguły art. 111. Kursy NBP (art. 83) ustalaj z tabeli NBP z dnia otwarcia — nie z pamięci.

---

## FAZA 0 — INTAKE

```
□ Status wierzyciela: bezsporny (spis dłużnika / tytuł egzekucyjny / spis wierzytelności) czy sporny (wezwanie, zawezwanie, pozew, zarzut potrącenia, arbitraż, zastrzeżenie dłużnika z art. 90) (65)
□ Dłużnik: zarząd własny / pod nadzorem / zarządca; oznaczenie „w restrukturyzacji” (66–67); braki organów → kurator (68)
□ Dłużnik w małżeństwie (wspólność ustawowa → majątek wspólny w masie, 73); rozdzielność po otwarciu z datą wsteczną — niedopuszczalna (74)
□ Każda wierzytelność: data powstania (przed otwarciem?), okres rozliczeniowy (podział proporcjonalny, 77), niepieniężna (78), niewymagalna (79, 81), regresowa (80),
  zabezpieczona za granicą (82), walutowa — kurs NBP z dnia otwarcia (83), zabezpieczona rzeczowo — suma = wartość przedmiotu (86 ust. 3, 86a)
□ Objęta układem z mocy prawa / za zgodą — odrębne części spisu (86 ust. 1)
□ Wykluczenie z głosu: regres niezaspokojony (80 ust. 3), nabycie po otwarciu (109), osoby bliskie / powiązane / > 25% kapitału (116)
□ Sprzeciw (PU, sanacja): 2 tyg. od obwieszczenia złożenia spisu; dowody tylko z dokumentów lub opinii biegłego (91–93)
□ Rada wierzycieli: wniosek dłużnika, ≥ 3 wierzycieli lub ≥ 1/5 sumy → ustanowienie w tydzień (121)
□ Czynności dłużnika/zarządcy wymagające zezwolenia rady pod rygorem nieważności (129), w tym sprzedaż > 500 000 zł
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 65–75 | uczestnicy, wierzytelność sporna, zdolność i zarząd dłużnika, kurator dłużnika i wierzyciela, śmierć dłużnika, małżonek | A |
| 76–87 | zawartość spisu: wierzytelności przedotwarciowe, podział okresowy, niepieniężne, niewymagalne, regresowe, walutowe, zabezpieczone; rubryki spisu, spis sporny | B |
| 89–103 | obwieszczenie spisu, zastrzeżenia w PPU, sprzeciw, zatwierdzenie spisu, wykreślenie, uzupełnienie, zmiana, sprostowanie, wyciąg jako tytuł egzekucyjny | C |
| 104–112 | zgromadzenie wierzycieli: zwołanie, przewodnictwo, prawo głosu, głosowanie, uchwały | D |
| 113–120 | zgromadzenie w celu głosowania nad układem: kworum, wyłączenia głosu, kolejność propozycji, warunki głosowania, większości, cram-down | E |
| 121–139 | rada wierzycieli: ustanowienie, skład, kompetencje, zezwolenia, uchwały, zarzuty, wynagrodzenie, zastępstwo przez sędziego-komisarza | F |
| uchylone | 88 (oraz 86 ust. 2 pkt 6 i 9, 89 ust. 1, 110 ust. 8, 136 ust. 1) | — |

---

## A. Uczestnicy i dłużnik (art. 65–75)

- **Art. 65:** uczestnicy: **dłużnik**, **wierzyciel osobisty z wierzytelnością bezsporną**, wierzyciel z **wierzytelnością sporną**, który ją uprawdopodobnił i został **dopuszczony przez sędziego-komisarza** (ust. 1). Wierzyciel = uprawniony do żądania świadczenia (ust. 2), także **składek i danin publicznych** (ust. 3). **Bezsporna** = wskazana w spisie wierzycieli dłużnika, stwierdzona tytułem egzekucyjnym lub umieszczona w spisie wierzytelności (ust. 4). **Sporna** = inna, skonkretyzowana co do świadczenia i podstawy — w szczególności po wezwaniu do zapłaty, zawezwaniu do próby ugodowej, pozwie, zarzucie potrącenia w sprawie dłużnika, w arbitrażu oraz z art. 90 ust. 2 (ust. 5). Dopuszczenie na wniosek (skutek od dnia wniosku) lub z urzędu (ust. 6). Wierzyciel spoza spisu **traci uprawnienia uczestnika** z prawomocnym oddaleniem sprzeciwu, upływem terminu na sprzeciw albo prawomocnym uwzględnieniem sprzeciwu co do jego wierzytelności (ust. 7).
- **Art. 66:** otwarcie nie wpływa na **zdolność prawną i do czynności prawnych** (ust. 1); przedsiębiorca działa pod firmą z dodatkiem **„w restrukturyzacji”** (ust. 2).
- **Art. 67:** **zarząd własny**, chyba że ustanowiono zarządcę; w zakresie art. 39 ust. 1 — pod nadzorem nadzorcy (ust. 1); czynności dotyczące mienia, wobec którego dłużnik utracił zarząd — **nieważne** (ust. 2); świadczenie do rąk dłużnika pozbawionego zarządu po obwieszczeniu **nie zwalnia**, chyba że równowartość wpłynęła do masy (ust. 3); dotyczy też czynności podlegających ujawnieniu w KW i rejestrach (ust. 4); wyjątek dla **zabezpieczeń finansowych** ustanowionych w dniu otwarcia w dobrej wierze oraz zabezpieczeń w systemach płatności (ust. 5).
- **Art. 68:** utrata zdolności procesowej dłużnika po wniosku lub braki w organach → **kurator** ustanawiany przez sędziego-komisarza (przed otwarciem — sąd); kurator z art. 42 § 1 KC staje się tym kuratorem (ust. 1); pełni funkcję także po otwarciu (ust. 2); traci moc po usunięciu braków (ust. 3); odpowiedzialność odszkodowawcza (ust. 4).
- **Art. 69:** wynagrodzenie i zwrot wydatków (ust. 1) według nakładu pracy, odpowiednio przepisy wykonawcze do art. 9 pkt 3 ustawy o kosztach sądowych w sprawach cywilnych (ust. 2); zażalenie, także kuratora (ust. 3).
- **Art. 70:** wynagrodzenie kuratora będącego podatnikiem **VAT** podwyższa się o podatek.
- **Art. 71:** koszty kuratora **obciążają dłużnika**; przy braku pokrycia — tymczasowa wypłata ze Skarbu Państwa i ściągnięcie jak opłaty sądowe.
- **Art. 72:** śmierć dłużnika → uczestnikiem staje się **spadkobierca** (przy zarządzie sukcesyjnym — **zarządca sukcesyjny**); sędzia-komisarz z urzędu ustanawia kuratora (art. 68–71) (ust. 1); kurator traci umocowanie po wstąpieniu spadkobiercy wykazującego prawa postanowieniem o nabyciu spadku, europejskim poświadczeniem spadkowym lub aktem poświadczenia dziedziczenia (ust. 2); odpowiednio przy kuratorze spadku (ust. 3).
- **Art. 73:** przy **wspólności majątkowej** majątek wspólny wchodzi do masy układowej/sanacyjnej i podlega nadzorowi albo zarządowi; stosuje się art. 34¹ i 36–39 KRO.
- **Art. 74:** **rozdzielność majątkowa** ustanowiona po otwarciu **z datą wcześniejszą** — niedopuszczalna.
- **Art. 75:** kurator dla **wierzyciela** bez zdolności procesowej lub z brakami organów, gdy usprawni postępowanie (ust. 1); art. 68 ust. 2–4, 69, 70 odpowiednio (ust. 2); koszty obciążają wierzyciela (ust. 3).

## B. Zawartość spisu wierzytelności (art. 76–87)

- **Art. 76:** spis obejmuje **wierzytelności osobiste powstałe przed otwarciem** (ust. 1); umieszczenie określa **sumę udziału** w postępowaniu (ust. 2).
- **Art. 77:** wierzytelność za **okres rozliczeniowy**, w którym otwarto postępowanie (czynsz, podatki, składki), dzieli się **proporcjonalnie** z mocy prawa na część przed- i po-otwarciową (ust. 1); dotyczy **leasingu**, gdy przedmiot **nie jest środkiem trwałym** dłużnika (ust. 2); przy należnościach publicznoprawnych obie części w **odrębnych deklaracjach** (ust. 3).
- **Art. 78:** wierzytelność **niepieniężna** — w pieniądzu według wartości z dnia poprzedzającego otwarcie.
- **Art. 79:** niewymagalna bez odsetek — pomniejszona o odsetki ustawowe, **max 6% rocznie**, od otwarcia do wymagalności, **max 2 lata** (ust. 1); odsetki — do dnia poprzedzającego otwarcie włącznie (ust. 2).
- **Art. 80:** regres **współdłużnika / poręczyciela** — w wysokości zaspokojenia wierzyciela (ust. 1); **gwarant / bank akredytywy** — jak wyżej (ust. 2); jeśli jeszcze nie zaspokoili — wierzytelność **warunkowa bez prawa głosu** (ust. 3).
- **Art. 81:** niewymagalne ze stosunków **ciągłych** oraz z **kredytu i pożyczki** — dyskonto jak art. 79 (max 6%, max 2 lata) dla każdego świadczenia (ust. 1); świadczenia dożywotnie / nieoznaczone — wartość prawa (ust. 2), suma wykupu, jeżeli ustalona (ust. 3); raty **leasingu** przy środku trwałym — jak ust. 1 (ust. 4); **kredyt odnawialny** — kwota wykorzystana do otwarcia (ust. 5).
- **Art. 82:** zabezpieczenie hipoteczne/rejestrowe na majątku **za granicą** — umieszczenie po dowodzie **wykreślenia** wpisu (ust. 1), chyba że postępowanie uznano w państwie położenia (ust. 2).
- **Art. 83:** waluta obca — przeliczenie po **średnim kursie NBP z dnia otwarcia** (brak kursu — średnia cena rynkowa) (ust. 1); **nie przekształca** zobowiązania — wykonanie układu w walucie obcej, chyba że propozycje stanowią inaczej (ust. 2).
- **Art. 84:** spis sporządza **nadzorca lub zarządca** na podstawie ksiąg, dokumentów, KW i rejestrów (ust. 1); w sanacji z uproszczonego wniosku (art. 328 ust. 1) — w miarę możliwości na podstawie wcześniejszego spisu (ust. 2).
- **Art. 85:** spis uwzględnia proponowany **podział na grupy**.
- **Art. 86:** odrębnie wierzytelności objęte układem **z mocy prawa** i **za zgodą** (ust. 1); rubryki: lp., dane wierzyciela (z NIP), **suma wierzytelności i suma głosu**, zabezpieczenie, warunek, okoliczności z art. 80 ust. 3, 109 ust. 1, 116, **uzasadnienie**, zgoda na objęcie układem, sumy ogółem i dla grup (ust. 2; pkt 6 i 9 uchylone); przy zabezpieczeniu rzeczowym i przewłaszczeniu — **suma odpowiadająca wartości przedmiotu zabezpieczenia** (ust. 3); uzasadnienie = stan faktyczny i dokumenty (ust. 4); załącznik — **oświadczenie dłużnika** o uznaniu/odmowie i okolicznościach wyłączających głos, albo informacja o jego braku z przyczyną (ust. 5); inne dane identyfikujące (ust. 6).
- **Art. 86a:** suma odpowiadająca wartości zabezpieczenia = kwota, która zostałaby zaspokojona z przedmiotu **w upadłości** (ust. 1); gdy upadłość niedopuszczalna — **w egzekucji** (ust. 2).
- **Art. 87:** **spis wierzytelności spornych** — zwięzła podstawa sporu; art. 86–86a odpowiednio.
- **Art. 88:** uchylony.

## C. Spis — obwieszczenie, sprzeciw, zatwierdzenie, skutki (art. 89–103)

- **Art. 89:** obwieszczenie o **dacie złożenia** spisu i spisu spornych (ust. 2; ust. 1 uchylony).
- **Art. 90:** w **PPU** dłużnik zgłasza **zastrzeżenia** (ust. 1); wierzytelność staje się **sporna**; sędzia-komisarz zmienia spisy, obwieszczenie daty postanowienia (ust. 2).
- **Art. 91:** w **PU i sanacji** — **sprzeciw** do sędziego-komisarza w **2 tygodnie** od obwieszczenia z art. 89 ust. 2 co do **umieszczenia**; dłużnik — tylko gdy spis niezgodny z jego oświadczeniem (a bez oświadczenia — gdy wykaże przyczyny niezależne) (ust. 1); co do **pominięcia** — dłużnik lub pominięty wierzyciel (ust. 2).
- **Art. 92:** wymogi pisma procesowego + wskazanie wierzytelności, wniosek, uzasadnienie, **dowody** (ust. 1); przy pominięciu dodatkowo: dane wierzyciela, suma i suma głosu, zabezpieczenie, okoliczności z 80 ust. 3/109 ust. 1/116, warunek zawieszający, prawo potrącenia, zgoda na objęcie układem (ust. 2; ust. 2a — dane identyfikujące); art. 86 ust. 3 (ust. 3); braki i opłata — art. 130 KPC; **odrzucenie** spóźnionego, niedopuszczalnego, nieuzupełnionego, nieopłaconego (ust. 4); **prekluzja** twierdzeń i dowodów niezgłoszonych w sprzeciwie (wyjątki: brak winy lub brak zwłoki) (ust. 5).
- **Art. 93:** dowód **wyłącznie z dokumentu lub opinii biegłego** (ust. 1); wierzytelność z **prawomocnego orzeczenia** — sprzeciw tylko na zdarzeniach po zamknięciu rozprawy, dowód na piśmie (ust. 2).
- **Art. 94:** doręczenia odpisów sprzeciwu (ust. 1–3); **odpowiedź** w terminie ≥ **tydzień** — nadzorca/zarządca obowiązkowo (ust. 4); spóźniona lub z brakami — zwrot (ust. 5); art. 92 ust. 1 i 4 odpowiednio (ust. 6).
- **Art. 95:** rozpoznanie na posiedzeniu niejawnym w **2 miesiące** od wniesienia (sędzia-komisarz, zastępca lub wyznaczony sędzia) (ust. 1); rozprawa fakultatywna, niestawiennictwo nie wstrzymuje (ust. 2); możliwe wykorzystanie **opinii biegłego z innego postępowania** (ust. 3); nadzorca/zarządca ma prawa uczestnika (ust. 4); zażalenie dłużnika, nadzorcy/zarządcy, wierzycieli (ust. 5); uchylenie i przekazanie tylko przy potrzebie całego postępowania dowodowego lub nieważności (ust. 6).
- **Art. 96:** po uprawomocnieniu uwzględnienia sprzeciwu — zmiana spisu.
- **Art. 97:** w **PPU** spis zatwierdza się **na zgromadzeniu wierzycieli** (ust. 1); obwieszczenie (ust. 2).
- **Art. 98:** w **PU i sanacji** — zatwierdzenie po upływie terminu na sprzeciw lub po prawomocnym rozpoznaniu (ust. 1); obwieszczenie (ust. 2); zatwierdzenie **częściowe**, jeżeli nierozpoznane sprzeciwy dotyczą **≤ 15%** sumy uprawniającej do głosu; postępowania sprzeciwowe nierozpoznane do głosowania — **umarza się** (ust. 3).
- **Art. 99:** **wykreślenie z urzędu** wierzytelności nieistniejącej lub przysługującej innej osobie; doręczenie, zażalenie, obwieszczenie.
- **Art. 100:** wierzytelność ujawniona po złożeniu spisu → **uzupełnienie spisu** (art. 84–91 odpowiednio) (ust. 1); zmiana nazwy lub osoby wierzyciela po złożeniu spisu — bez zmiany spisu i bez utraty udziału (ust. 2).
- **Art. 101:** nieuwzględnienie w spisie **nie zamyka drogi** dochodzenia (ust. 1); zmiana spisu według **prawomocnych orzeczeń** z obwieszczeniem; art. 89 ust. 2, 90, 91 odpowiednio (ust. 2); **sprostowanie** oczywistych omyłek (art. 350, 353 KPC) przez sędziego-komisarza lub referendarza; skarga na postanowienie referendarza — sąd jednoosobowo jak zażalenie (ust. 3).
- **Art. 102:** po prawomocnej **odmowie zatwierdzenia** układu lub **umorzeniu** — wyciąg ze spisu = **tytuł egzekucyjny** przeciw dłużnikowi (ust. 1); po prawomocnym **zatwierdzeniu** — wyciąg z wypisem postanowienia = tytuł przeciw dłużnikowi, **poręczycielowi wykonania układu** (przy dokumencie w aktach) i **zobowiązanemu do dopłat**; po uchyleniu układu — ust. 1 (ust. 2); powództwo dłużnika o ustalenie nieistnienia, jeżeli złożył sprzeciw i brak prawomocnego orzeczenia (ust. 3); po klauzuli — zarzut nieistnienia tylko w **powództwie przeciwegzekucyjnym** (ust. 4).
- **Art. 103:** zwrot dokumentów z adnotacją o sumie umieszczonej w spisie.

## D. Zgromadzenie wierzycieli — przepisy ogólne (art. 104–112)

- **Art. 104:** zwołuje sędzia-komisarz: w celu głosowania nad układem, na uchwałę rady wierzycieli, gdy uzna za potrzebne.
- **Art. 105:** zwołanie przez **obwieszczenie** (termin, miejsce, przedmiot, sposób głosowania, ewentualnie tryb zdalny z art. 110 ust. 6) (ust. 1) **≥ 2 tygodnie** przed (ust. 2); wezwanie dłużnika i nadzorcy/zarządcy — ich niestawiennictwo nie przeszkadza (ust. 3); **odroczenie** bez ponownego obwieszczenia; głos nieobecnego zachowuje moc przy tych samych lub korzystniejszych uchwałach (ust. 4); **zawiadomienia** przez nadzorcę/zarządcę — operator pocztowy, komornik, a wobec wierzyciela działającego w systemie — przez system (art. 131¹ § 2 KPC) (ust. 5); przed zgromadzeniem nadzorca/zarządca przedkłada: **karty do głosowania** z pełnomocnictwami i informacją o art. 116, **dowód wysłania zawiadomień ≥ 3 tygodnie** przed (na adres rejestrowy lub znany dłużnikowi), dowody doręczeń (ust. 6).
- **Art. 106:** przewodniczy **sędzia-komisarz** (ust. 1); protokół (ust. 2); listę obecności (także głosujących na piśmie) sporządza nadzorca/zarządca w systemie (ust. 3).
- **Art. 107:** prawo głosu: wierzyciele z **zatwierdzonego spisu** i stawiający się z **tytułem egzekucyjnym** (ust. 1); głos = suma ze spisu lub tytułu (ust. 2); dopuszczenie wierzyciela **warunkowego lub spornego uprawdopodobnionego** — na wniosek, po wysłuchaniu dłużnika; sumę głosu oznacza sędzia-komisarz (ust. 3).
- **Art. 108:** wierzytelności **solidarne lub niepodzielne** — wspólny pełnomocnik (może być jeden z wierzycieli) (ust. 1); w braku — zarządca z KC o zarządzie rzeczą wspólną (ust. 2); brak wyboru nie blokuje zgromadzenia (ust. 3).
- **Art. 109:** brak głosu z wierzytelności **nabytej przelewem lub indosem po otwarciu** (ust. 1), chyba że przejście wskutek spłaty długu, za który odpowiadał osobiście lub rzeczowo, ze stosunku sprzed otwarcia (ust. 2); nie dotyczy **PZU** (ust. 3).
- **Art. 110:** głosowanie **w systemie teleinformatycznym**; osobiście obecny — ustnie do protokołu lub na piśmie (ust. 1); przeprowadza nadzorca/zarządca pod nadzorem sędziego-komisarza; spis głosów (art. 86 ust. 2) (ust. 2); pełnomocnik, także inny wierzyciel (ust. 3); treść głosu (ust. 4); **wstrzymujący się = nieuczestniczący** (ust. 5); **głosowanie zdalne** środkami elektronicznymi (ust. 6); przy znacznej liczbie wierzycieli — głosowanie **wyłącznie w systemie** postanowieniem obwieszczanym (ust. 7; ust. 8 uchylony).
- **Art. 111:** uchwała (poza szczególnymi) — **większość głosujących** mających łącznie **≥ ½ sumy** wierzytelności głosujących.
- **Art. 112:** sędzia-komisarz stwierdza przyjęcie uchwały postanowieniem z treścią uchwały (ust. 1); może ją **uchylić**, gdy sprzeczna z prawem, dobrymi obyczajami lub rażąco narusza interes wierzyciela głosującego przeciw (ust. 2); zażalenie (ust. 3).

## E. Zgromadzenie w celu głosowania nad układem (art. 113–120)

- **Art. 113:** **kworum ≥ 1/5** wierzycieli uprawnionych do głosu (ust. 1); uprawnieni — wyłącznie wierzyciele z art. 107 ust. 1 i 3 **objęci układem** (ust. 2); brak dowodu doręczenia zawiadomień wierzycielom stanowiącym **≤ ½ liczby** i **≤ 1/3 sumy** nie blokuje głosowania (ust. 3); gdy ich głosy mogły przesądzić — **przerwa** dla prawidłowego doręczenia, chyba że dokument wykazuje ich wiedzę (ust. 4).
- **Art. 114:** w PPU i PU nadzorca przedstawia **założenia planu** (ust. 1); w sanacji zarządca — **sprawozdanie z wykonania planu**, efekty i działania po przyjęciu układu (ust. 2).
- **Art. 115:** nadzorca/zarządca składa **opinię o możliwości wykonania układu**.
- **Art. 116 — brak prawa głosu w sprawach układu:** małżonek, krewni i powinowaci w linii prostej, w bocznej do 2. stopnia, przysposobieni; przy spółce handlowej — osoby uprawnione do reprezentacji; przy osobowej — wspólnik odpowiadający całym majątkiem (ust. 1); **spółka powiązana**, dominująca lub zależna i jej reprezentanci (ust. 2); spółka kapitałowa mająca **tę samą spółkę dominującą** (ust. 3); przy dłużniku-spółce kapitałowej — osoba fizyczna reprezentująca **> 25% kapitału** (w PSA — **> 25% akcji**) (ust. 4).
- **Art. 117:** przy kilku propozycjach — kolejność ustala sędzia-komisarz; głosuje się nad wszystkimi; przyjęte = największe poparcie według **sumy wierzytelności** z uwzględnieniem art. 119 (ust. 1); **zmiany propozycji** na zgromadzeniu (dłużnik, zarządca, nadzorca) — pisemny głos „za” liczy się „za”, jeżeli zmiany są **korzystniejsze dla tego wierzyciela**; pozostałe — „przeciw” (ust. 2).
- **Art. 118 — warunki dopuszczenia głosowania:** dokumenty potwierdzające wykonanie **zabezpieczeń osób trzecich, kredytu/pożyczki, zgód osób trzecich** (w tym zmiany hipotek i zastawów) (ust. 1) oraz powierzenia **zarządu** osobom wskazanym (ust. 2); przy **konwersji na udziały/akcje** — zgoda **Prezesa UOKiK lub Komisji Europejskiej** albo wykazanie zbędności (ust. 3); przy **pomocy publicznej** — zgoda organu albo wykazanie zbędności (ust. 4).
- **Art. 119 — większości:** **większość głosujących** mających **≥ 2/3 sumy** wierzytelności głosujących (ust. 1); w grupach — w **każdej** grupie (ust. 2). **Cram-down** (ust. 3): układ przyjęty mimo braku większości w niektórych grupach, jeżeli (1) za głosowała **większość grup**, w tym co najmniej jedna grupa z art. 161 ust. 1a pkt 3 lub wierzycieli o wyższym stopniu zaspokojenia niż należności z art. 342 ust. 1 pkt 2 PrUp, albo (2) w braku tego — co najmniej jedna grupa, która w upadłości otrzymałaby jakiekolwiek zaspokojenie przy **wycenie zakładającej kontynuację** — i za głosowali wierzyciele mający **≥ ½ sumy** wierzytelności głosujących. **Reguła pierwszeństwa** (ust. 4): jeżeli grupa niższa otrzymuje cokolwiek, grupy wyższe głosujące przeciw muszą uzyskać **pełne zaspokojenie** w terminie układu; definicja stopnia zaspokojenia z uwzględnieniem planu oddzielnego (ust. 5); wyjątki z art. 160 lub 162 ust. 2 (ust. 6).
- **Art. 120:** sędzia-komisarz stwierdza **przyjęcie układu** postanowieniem z treścią układu (ust. 1–2); **nie może uchylić** uchwały o przyjęciu układu (ust. 3); obwieszczenie (ust. 4).

## F. Rada wierzycieli (art. 121–139)

- **Art. 121:** ustanawia sędzia-komisarz z urzędu lub na wniosek (ust. 1); obowiązkowo w **tydzień** na wniosek **dłużnika**, **≥ 3 wierzycieli** lub wierzycieli z **≥ 1/5 sumy** (bez wyłączonych z art. 80 ust. 3, 109 ust. 1, 116) (ust. 2); przed zatwierdzeniem spisu uprawnienia ustala się według spisu wierzycieli dłużnika, spisu bezspornych nadzorcy/zarządcy, tytułów egzekucyjnych lub wcześniejszego spisu (sanacja z art. 328 ust. 1) (ust. 3).
- **Art. 122:** **5 członków i 2 zastępców** spośród wierzycieli-uczestników (ust. 1); **3 członków**, gdy uczestników **< 7** (ust. 2); zastępcy jak członkowie (ust. 3), głosują za nieobecnych w kolejności z postanowienia (ust. 4).
- **Art. 123:** wierzyciele z **≥ 1/5 sumy** wskazują członka — powołanie, chyba że uzasadnione przypuszczenie nienależytego pełnienia; zażalenie tylko wnioskodawcy (ust. 1); przy **≥ 2/5** — po jednym kandydacie na każdą 1/5 (ust. 2); brak kolejnych wniosków, chyba że ich członek odwołany (ust. 3).
- **Art. 124:** wierzyciel może **odmówić** przyjęcia funkcji.
- **Art. 125:** odwołanie za nienależyte pełnienie i powołanie innych — zażalenie (ust. 1); odwołanie na wniosek członka (ust. 2); prawomocnie odwołany — bez ponownego powołania (ust. 3).
- **Art. 126:** **zmiana składu** na wniosek wierzycieli z ≥ 1/5 sumy (ust. 1); art. 123 ust. 2–3 odpowiednio (ust. 2); członka powołanego z wniosku wierzycieli odwołuje się tylko na żądanie tych wierzycieli (ust. 3).
- **Art. 127:** członkowie działają osobiście lub przez pełnomocników; pełnomocnictwo do akt przez przewodniczącego.
- **Art. 128:** rada **pomaga i kontroluje** nadzorcę/zarządcę, bada fundusze masy, udziela zezwoleń, opiniuje na żądanie; kieruje się **interesem ogółu wierzycieli** (ust. 1); uwagi do sędziego-komisarza (ust. 2); żądanie wyjaśnień i badanie ksiąg z poszanowaniem **tajemnicy przedsiębiorstwa**; zakres w razie wątpliwości określa sędzia-komisarz (ust. 3).
- **Art. 129 — zezwolenie rady pod rygorem nieważności:** obciążenie masy hipoteką/zastawem/zastawem rejestrowym/hipoteką morską dla wierzytelności **nieobjętej układem** (pkt 1), przewłaszczenie na zabezpieczenie takiej wierzytelności (pkt 2), inne obciążenia (pkt 3), **kredyty i pożyczki** (pkt 4), **dzierżawa przedsiębiorstwa** lub ZCP (pkt 5) (ust. 1); **sprzedaż przez dłużnika** nieruchomości lub składników **> 500 000 zł** (ust. 2); zezwolenie na kredyt i zabezpieczenia tylko, gdy niezbędne do bieżących kosztów i zobowiązań lub układu, z gwarancją wykorzystania zgodnie z uchwałą i **adekwatnym** zabezpieczeniem (ust. 3); czynności z ust. 1 za zezwoleniem **nie mogą być uznane za bezskuteczne wobec masy upadłości** (ust. 4).
- **Art. 130:** na pierwszym posiedzeniu — **regulamin** (tryb, zawiadomienia, głosy, współpraca, wnioski) (ust. 1) i **przewodniczący** (ust. 2).
- **Art. 131:** uchwały na posiedzeniach (także zdalnych), chyba że regulamin inaczej (ust. 1); poza posiedzeniem — głosują **wszyscy członkowie**, bez zastępców (ust. 2); uchwała w **2 tygodnie** od wniosku (ust. 3).
- **Art. 132:** **zwykła większość** (ust. 1); kontrola przez wskazanych członków (ust. 2); badanie ksiąg przez członków lub specjalistów — **koszty nie są kosztami postępowania** i nie obciążają dłużnika (ust. 3); sprawozdania dla sędziego-komisarza (ust. 4).
- **Art. 133:** uchwała pełnego składu **≥ 4 głosy** → sąd może pozwolić dłużnikowi na **zwykły zarząd** obok zarządcy (ust. 1); uchwała ≥ 4 głosy albo zgodna z wnioskiem dłużnika → sąd **zmienia nadzorcę/zarządcę** na osobę spełniającą art. 24 wskazaną przez radę, chyba że niezgodne z prawem, rażąco krzywdzące lub osoba nie da rękojmi; zażalenie na odmowę — członkowie rady i dłużnik (ust. 2); rada 3-osobowa — **jednomyślność** (ust. 3).
- **Art. 134:** zwołuje przewodniczący; **pierwsze posiedzenie** — nadzorca/zarządca niezwłocznie (ust. 1); przewodniczy przewodniczący (ust. 2); może zwołać i prowadzić sędzia-komisarz (ust. 3).
- **Art. 135:** protokół, podpisy (przy posiedzeniu zdalnym — przewodniczący) (ust. 1); odpis z uchwałami do sędziego-komisarza i nieobecnego nadzorcy/zarządcy (ust. 2); uchwała bez posiedzenia — odpis do sędziego-komisarza (ust. 3); nie dotyczy posiedzeń prowadzonych przez sędziego-komisarza (ust. 4).
- **Art. 136:** **zarzuty** przeciw uchwale w **tydzień** — uczestnik, zarządca, nadzorca; spóźnione lub wadliwe — bez rozpoznania, bez wezwania z art. 130 § 1 KPC (ust. 2); rozpoznanie w **tydzień** (ust. 3); **uchylenie** uchwały sprzecznej z prawem lub interesem wierzycieli — po zarzutach lub z urzędu w **2 tygodnie** od przekazania; zażalenie skarżącego, dłużnika, członków rady (ust. 4); **wykonanie najwcześniej po 2 tygodniach** od przekazania; możliwe wstrzymanie (ust. 5; ust. 1 uchylony).
- **Art. 137:** zwrot wydatków; wynagrodzenie **≤ 3%** przeciętnego wynagrodzenia z art. 55 ust. 3 **za dzień posiedzenia** — koszty postępowania (ust. 1); postanowienie po wysłuchaniu członka i nadzorcy/zarządcy (ust. 2).
- **Art. 138:** członek rady **odpowiada za szkodę** z nienależytego pełnienia obowiązków.
- **Art. 139:** bez rady — jej czynności wykonuje **sędzia-komisarz** (ust. 1), także gdy rada nie działa w wyznaczonym terminie (ust. 2).

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| max 6% rocznie, max 2 lata | dyskonto wierzytelności niewymagalnych | art. 79 ust. 1; 81 ust. 1 |
| kurs średni NBP z dnia otwarcia | przeliczenie walut | art. 83 ust. 1 |
| 2 tygodnie od obwieszczenia | sprzeciw (PU, sanacja) | art. 91 |
| ≥ tydzień | odpowiedź na sprzeciw | art. 94 ust. 4 |
| 2 miesiące | rozpoznanie sprzeciwu | art. 95 ust. 1 |
| ≤ 15% | zatwierdzenie spisu mimo nierozpoznanych sprzeciwów | art. 98 ust. 3 |
| ≥ 2 tyg. / ≥ 3 tyg. | obwieszczenie zgromadzenia / wysłanie zawiadomień | art. 105 ust. 2, 6 |
| > ½ głosujących + ≥ ½ sumy | uchwały zwykłe | art. 111 |
| ≥ 1/5 uprawnionych | kworum zgromadzenia układowego | art. 113 ust. 1 |
| ≤ ½ liczby i ≤ 1/3 sumy | dopuszczalny brak dowodu doręczenia | art. 113 ust. 3 |
| > 25% kapitału / akcji | wyłączenie głosu osoby fizycznej | art. 116 ust. 4 |
| > ½ głosujących + ≥ 2/3 sumy | przyjęcie układu (w każdej grupie) | art. 119 ust. 1–2 |
| większość grup + ≥ ½ sumy | cram-down | art. 119 ust. 3 |
| tydzień; ≥ 3 wierzycieli lub ≥ 1/5 sumy | ustanowienie rady na wniosek | art. 121 ust. 2 |
| 5 + 2 / 3 członków (< 7 uczestników) | skład rady | art. 122 |
| 1/5 / 2/5 sumy | wskazanie członków rady | art. 123 |
| > 500 000 zł | sprzedaż wymagająca zezwolenia rady | art. 129 ust. 2 |
| 2 tygodnie | termin uchwały rady | art. 131 ust. 3 |
| ≥ 4 głosy (3-osobowa — jednomyślnie) | zwykły zarząd dłużnika; zmiana nadzorcy/zarządcy | art. 133 |
| tydzień / tydzień / 2 tyg. / 2 tyg. | zarzuty; rozpoznanie; uchylenie z urzędu; wstrzymanie wykonania | art. 136 |
| ≤ 3% przeciętnego wynagrodzenia / dzień | wynagrodzenie członka rady | art. 137 ust. 1 |

## PUŁAPKI

- Wierzytelność „sporna” w rozumieniu art. 65 ust. 5 wymaga konkretyzacji (wezwanie, pozew, arbitraż, zarzut potrącenia) — samo zaprzeczenie dłużnika bez tego nie wystarcza, poza zastrzeżeniem z art. 90 w PPU.
- Wierzytelność zabezpieczona rzeczowo wchodzi do spisu tylko w wartości przedmiotu zabezpieczenia według hipotetycznej upadłości (86 ust. 3, 86a).
- Okres rozliczeniowy obejmujący otwarcie — podział proporcjonalny z mocy prawa (77); osobne deklaracje podatkowe.
- Waluta: przeliczenie służy tylko spisowi i głosowaniu; wykonanie układu w walucie (83 ust. 2).
- PPU: brak sprzeciwów — zastrzeżenia dłużnika (90) i zatwierdzenie spisu na zgromadzeniu (97); PU/sanacja: sprzeciw (91–96) i zatwierdzenie po jego rozpoznaniu (98).
- Prekluzja dowodowa sprzeciwu (92 ust. 5) i ograniczenie do dokumentów i opinii biegłego (93).
- Wyciąg ze spisu staje się tytułem egzekucyjnym także po odmowie zatwierdzenia lub umorzeniu (102 ust. 1) — dłużnik broni się tylko, jeżeli złożył sprzeciw (102 ust. 3).
- Wstrzymujący się nie liczy się do głosujących (110 ust. 5) — wpływa na większości z art. 111 i 119.
- Wierzytelności nabyte po otwarciu nie dają głosu (109) — poza PZU.
- Sędzia-komisarz nie może uchylić uchwały o przyjęciu układu (120 ust. 3) — kontrola następuje przy zatwierdzeniu układu przez sąd.
- Brak zezwolenia rady na czynność z art. 129 = nieważność; zezwolenie chroni przed bezskutecznością w późniejszej upadłości (129 ust. 4).
- Uchwały rady nie wykonuje się przed upływem 2 tygodni od przekazania sędziemu-komisarzowi (136 ust. 5).

## POWIĄZANIA

- Nadzorca, zarządca, art. 24, 39, wynagrodzenie (art. 55) → `mod-PrRestr-dzial-III-nadzorca-zarzadca`
- PPU/PU: spisy w 30 dni, zastrzeżenia do testów (art. 261–264, 280–282) → `mod-PrRestr-ppu-pu`
- Sanacja, uproszczony wniosek (art. 328) → `mod-PrRestr-sanacja`; PZU → `mod-PrRestr-pzu`
- Układ: grupy, art. 160–162, objęcie układem, zatwierdzenie → `mod-PrRestr-dzial-VI-uklad`
- Pomoc publiczna (art. 118 ust. 4) → `mod-PrRestr-dzial-V-pomoc-publiczna`
- Kategorie art. 342 PrUp (cram-down, art. 119 ust. 3) → `mod-PrUpad-podzial-335-360`
- Bezskuteczność w upadłości (art. 129 ust. 4) → `mod-PrUpad-skutki-masa-bezskutecznosc`
- Majątek wspólny (KRO art. 34¹, 36–39) → `mod-KRO-rodzinne`

## WYNIK

Uczestnicy i status wierzytelności (65) → spis: kwalifikacja każdej pozycji (76–87) z uzasadnieniem i oświadczeniem dłużnika → obwieszczenie (89) → zastrzeżenia (PPU, 90) albo sprzeciwy w 2 tyg. (PU/sanacja, 91–96) → zatwierdzenie (97–98) → lista uprawnionych do głosu z wyłączeniami (107–109, 116) → zgromadzenie: kworum 1/5, dokumenty z art. 118, opinia nadzorcy → wyliczenie większości (119) i ewentualny cram-down z regułą pierwszeństwa → postanowienie (120); równolegle rada wierzycieli: skład, zezwolenia z art. 129, zarzuty i terminy wykonania uchwał.
