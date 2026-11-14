# mod-ustawa-KRS-rejestr-sadowy

**Hasła spraw:** KRS, rejestr przedsiębiorców, rejestr stowarzyszeń i fundacji, rejestr dłużników niewypłacalnych, wpis, sąd rejestrowy, jawność rejestru, Monitor Sądowy i Gospodarczy, postępowanie przymuszające, grzywna, rozwiązanie bez likwidacji, wykreślenie, mienie po wykreślonym podmiocie

**Akt:** u.KRS — t.j. Dz.U. 2025 poz. 869 (zm. 2025/1556 — art. 2, 4, 13, 15, 16, 19, 19a, 20, 20c, 42, 47a, 49, 58, 60a; 2025/1556 [OD 2027-04-01: 2025/1556] — art. 9, 19; 2025/1792 — art. 20, 20e, 22, 35; 2025/1792 [OD 2027-06-17: 2025/1792] — art. 20f; 2026/119 — art. 10a; 2026/252 — art. 4d, 21; 2026/176 [OD 2027-02-18: 2026/176] — art. 10, 25da, 38; 2026/644 [OD 2028-01-10: 2026/644] — art. 4, 20; 2026/346 [OD 2028-09-30: 2026/346] — art. 3a, 20a).
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1): `isap_tekst` albo `https://api.sejm.gov.pl/eli/acts/DU/2025/869/text.pdf` (t.j. tylko w PDF); zmiany po t.j. — ELI, „Akty zmieniające” aktu DU/1997/769.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14.

**Pułapka czasu (2025/1556, w życiu od 2025-11-29):** wpisy do KRS **nie są już ogłaszane w MSiG** — uchylono art. 13, 16, 58 i art. 49 ust. 2; skutek wobec osób trzecich liczy się od **dnia dokonania wpisu** (art. 15 ust. 1 w nowym brzmieniu). Komentarz, wzór lub orzeczenie sprzed 2025-11-29 mówiące o „dniu ogłoszenia w MSiG” opisuje stan dawny — stosuj tylko do czynności i rozbieżności sprzed tej daty (2025/1556 art. 9, 10).

Zakres: przepisy ogólne, jawność, skutki wpisów, postępowanie rejestrowe, postępowanie przymuszające, rozwiązanie bez likwidacji, rejestr przedsiębiorców (rozdział 2), rejestr stowarzyszeń i fundacji (rozdział 3), rejestr dłużników niewypłacalnych (rozdział 4). Ustrój spółek — KSH (`mod-KSH-*`); fundacje i stowarzyszenia — `mod-ustawa-fundacje-stowarzyszenia`; postępowanie nieprocesowe — KPC.

---

## FAZA 0 — INTAKE

```
□ Podmiot i rejestr: przedsiębiorców (art. 36) / stowarzyszeń i fundacji (art. 49, 49a) / dłużników niewypłacalnych (art. 55–60)?
□ Wpis konstytutywny czy deklaratoryjny — rozstrzyga ustawa ustrojowa (KSH, Prawo o stowarzyszeniach itd.), nie u.KRS.
□ Data zdarzenia i data wpisu: przed 2025-11-29 (MSiG) czy po (skutek od wpisu)?
□ Termin na wniosek (art. 22: 7 dni) i czy sąd już wezwał (art. 24 — postępowanie przymuszające)?
□ Grozi rozwiązanie bez likwidacji (art. 25a–25e)? Czy podmiot ma majątek lub prowadzi działalność?
□ Wniosek elektroniczny (art. 19 ust. 2) — od 2027-04-01 także dla rejestru stowarzyszeń i fundacji.
```

---

## PRZEPISY OGÓLNE I JAWNOŚĆ (art. 1–12)

| Przepis | Kwalifikator |
|---|---|
| art. 1 ust. 2 | KRS = trzy rejestry: przedsiębiorców; stowarzyszeń, innych organizacji społecznych i zawodowych, fundacji i SPZOZ; dłużników niewypłacalnych |
| art. 2 ust. 1 | rejestr prowadzą w systemie teleinformatycznym sądy rejonowe (gospodarcze) — sądy rejestrowe; ust. 2–3 (czynności gmin) **uchylone** przez 2025/1556 |
| art. 3 | rejestr obejmuje podmioty, którym ustawy nakazują wpis |
| art. 3a ust. 1 | system teleinformatyczny MS (S24: spółki z wzorca umowy); [OD 2028-09-30: 2026/346] — także zakładanie stowarzyszeń ze statutu-wzorca w systemie |
| art. 4 | Centralna Informacja KRS: zbiór informacji, katalog dokumentów spółek, odpisy; ust. 4c–4m (2025/1556) — dostęp przez usługi sieciowe za zgodą MS (decyzja); [OD 2028-01-10: 2026/644] ust. 2 pkt 5 — organ zbierający dane dla europejskiego pojedynczego punktu dostępu (ESAP) |
| art. 4d | dane z innych rejestrów przez system integracji; ust. 2 pkt 4 i ust. 5 pkt 5 (2026/252, od 2026-04-03) — wykazy organów cyberbezpieczeństwa (zakazy pełnienia funkcji w podmiocie kluczowym) |
| art. 7 | do postępowania rejestrowego KPC o postępowaniu **nieprocesowym**, chyba że ustawa stanowi inaczej |
| art. 8 | rejestr jawny; dostęp przez Centralną Informację; odpisy, wyciągi, zaświadczenia, także elektronicznie |
| art. 9 | akta rejestrowe; ust. 1 zd. 2 — dla rejestru przedsiębiorców wyłącznie w systemie teleinformatycznym; [OD 2027-04-01: 2025/1556] — także dla rejestru stowarzyszeń i fundacji (do 2027-03-31 brzmienie dotychczasowe; sprawy wszczęte przed 2027-04-01 — dawne brzmienie, 2025/1556 art. 10 pkt 2) |
| art. 10 | każdy może przeglądać akta rejestrowe i zbiór dokumentów; ust. 3 — akta wykreślonych wpisów w rejestrze dłużników tylko dla dłużnika i wierzyciela; [OD 2027-02-18: 2026/176] ust. 4a pkt 4 — wykaz akcjonariuszy rozwiązanej spółki (art. 25da) |
| art. 10a | automatyczne powiadomienie o zarejestrowaniu sprawy i dokonaniu wpisu; ust. 1a (2026/119, od 2026-05-31) — także przez aplikację mObywatel (powiązanie przez PESEL); do 50 podmiotów na kanał, do roku |
| art. 12 | danych nie usuwa się, chyba że ustawa stanowi inaczej; ust. 2 — sprostowanie oczywistych błędów z urzędu; ust. 3 — wykreślenie z urzędu danych niedopuszczalnych (po wysłuchaniu) |

## SKUTKI WPISÓW (art. 13–18)

| Przepis | Kwalifikator |
|---|---|
| art. 13 | **uchylony** (2025/1556, od 2025-11-29) — koniec obowiązku ogłaszania wpisów w MSiG |
| art. 14 | podmiot obowiązany do wniosku nie może powołać się wobec osób trzecich w dobrej wierze na dane niewpisane lub wykreślone |
| art. 15 ust. 1 | w brzmieniu od 2025-11-29 (2025/1556): od **dnia dokonania wpisu** nikt nie może zasłaniać się nieznajomością wpisu; do 16. dnia od wpisu podmiot nie powoła się na wpis wobec osoby, która udowodni, że nie mogła wiedzieć; do 2025-11-28 — liczone od ogłoszenia w MSiG |
| art. 15 ust. 3 | osoba trzecia może powołać się na dokumenty i dane jeszcze nieujawnione w Rejestrze, gdy brak ujawnienia nie pozbawia ich skutków |
| 2025/1556 art. 9 | rozbieżność wpis–ogłoszenie w MSiG opublikowane przed 2025-11-29: obowiązuje wpis; osoba trzecia może powołać się na ogłoszenie, chyba że wiedziała o treści wpisu |
| art. 16 | **uchylony** (2025/1556) |
| art. 17 ust. 1 | domniemanie prawdziwości danych wpisanych |
| art. 17 ust. 2 | dane wpisane niezgodnie ze zgłoszeniem lub bez niego — podmiot nie zarzuci osobie trzeciej w dobrej wierze ich nieprawdziwości, jeżeli zaniedbał niezwłocznego wniosku o sprostowanie |
| art. 18 | odpowiedzialność odszkodowawcza podmiotu za zgłoszenie nieprawdziwych danych albo niezgłoszenie w terminie (egzoneracja: siła wyższa, wyłączna wina poszkodowanego lub osoby trzeciej); ust. 2 — w spółce osobowej solidarnie wspólnicy odpowiadający całym majątkiem |

## POSTĘPOWANIE REJESTROWE (art. 19–24)

| Przepis | Kwalifikator |
|---|---|
| art. 19 ust. 1 | wpis na wniosek, chyba że przepis przewiduje wpis z urzędu |
| art. 19 ust. 2 | wnioski w rejestrze przedsiębiorców wyłącznie elektronicznie; [OD 2027-04-01: 2025/1556] — także w rejestrze stowarzyszeń i fundacji (ust. 3–4 o formularzu papierowym uchylone tego dnia); do 2027-03-31 formularz urzędowy albo system |
| art. 19 ust. 5 | wniosek z opłatą sądową; brak opłaty → zwrot (ust. 7–10) |
| art. 19a ust. 5 | do wniosku o wpis członków organu, likwidatorów, prokurentów — zgoda na powołanie i adres do doręczeń |
| art. 19b–19d | spółka w organizacji i OPP — informacja o braku NIP/REGON; wnioski o wpis zmian wspólników; akt notarialny z Repozytorium — numer dokumentu |
| art. 19e | sprawozdania i dokumenty finansowe — zgłoszenie przez system teleinformatyczny (Repozytorium Dokumentów Finansowych) |
| art. 19f | dane do adresu do doręczeń elektronicznych przy wniosku o wpis |
| art. 20 ust. 1–1b | wpis = wprowadzenie do systemu danych z postanowienia; skuteczny z chwilą zamieszczenia; ust. 1a (2025/1792) — NIP i REGON z „rejestru REGON”; [OD 2028-01-10: 2026/644] ust. 1ga — dokumenty finansowe przekazywane do ESAP |
| art. 20a | termin rozpoznania: 7 dni; spółka z wzorca — 1 dzień; po wezwaniu — 7 dni od usunięcia przeszkody; z rozprawą — miesiąc; [OD 2028-09-30: 2026/346] ust. 2 — także stowarzyszenie ze statutu-wzorca |
| art. 20b | wpis zależny od zgody Prezesa UOKiK na koncentrację — na podstawie decyzji |
| art. 20d | brak wniosku o wznowienie działalności po 24 miesiącach zawieszenia — skutki z urzędu |
| art. 20e | (2025/1792, od 2025-12-31) zmiana PKD: po okresie równoczesnego stosowania automatyczna zamiana przedmiotu działalności według tabel relacji; wniosek w tym okresie bez opłaty |
| art. 20f | [OD 2027-06-17: 2025/1792] automatyczna aktualizacja nazw z rejestru TERYT |
| art. 21 | obowiązek organów, sądów, banków, komorników i notariuszy zawiadomić sąd o zdarzeniach wpisywanych z urzędu; ust. 4 (2026/252) — informacje MS o zakazach pełnienia funkcji w podmiocie kluczowym (cyberbezpieczeństwo) |
| art. 22 ust. 1 | wniosek **7 dni** od zdarzenia, chyba że przepis szczególny stanowi inaczej |
| art. 22 ust. 2 | (2025/1792) po automatycznym wykreśleniu przeważającego PKD — zgłoszenie nowego przy pierwszym wniosku o zmianę, najpóźniej w 5 lat |
| art. 23 | badanie dokumentów co do formy i treści; prawdziwość danych z art. 35 pkt 1–2 i art. 38 pkt 1 lit. h; poza tym — przy uzasadnionych wątpliwościach |

## POSTĘPOWANIE PRZYMUSZAJĄCE I ROZWIĄZANIE BEZ LIKWIDACJI (art. 24–25e)

| Przepis | Kwalifikator |
|---|---|
| art. 24 ust. 1, 1a | wezwanie do złożenia wniosku lub dokumentów (dodatkowe 7 dni); wezwanie do powołania organu osoby prawnej |
| art. 24 ust. 1b–2 | pod rygorem grzywny wg KPC o egzekucji świadczeń niepieniężnych; grzywna ponawiana; art. 1053 KPC nie stosuje się |
| art. 24 ust. 3 | odstąpienie od postępowania przymuszającego, gdy nie doprowadzi do skutku |
| art. 25 | osobowa spółka handlowa mimo grzywien nie wykonuje obowiązków — sąd z urzędu może, z ważnych powodów, rozwiązać i ustanowić likwidatora |
| art. 25a ust. 1 | przesłanki wszczęcia z urzędu postępowania o rozwiązanie **bez likwidacji**: oddalenie wniosku o upadłość / umorzenie (pkt 1–2), odstąpienie od przymuszenia lub jego umorzenie (pkt 3), brak sprawozdań za 2 kolejne lata (pkt 4), dwukrotne bezskuteczne wezwanie z art. 24 ust. 1 (pkt 5) |
| art. 25b | zawiadomienie i ogłoszenie o wszczęciu; wezwanie do wykazania działalności i majątku w 14 dni |
| art. 25c | sąd może żądać informacji o majątku i działalności |
| art. 25d | brak zbywalnego majątku i działalności → rozwiązanie bez likwidacji i wykreślenie; niezaspokojone długi tego nie wyłączają; majątek lub działalność → umorzenie |
| art. 25da | [OD 2027-02-18: 2026/176] po rozwiązaniu S.K.A., PSA, S.A., SE — wezwanie prowadzącego rejestr akcjonariuszy / KDPW o wykaz akcjonariuszy (14 dni); sprawy wszczęte przed tą datą — tabela B (2026/176 art. 32) |
| art. 25e | mienie pozostałe po wykreślonym podmiocie nabywa nieodpłatnie Skarb Państwa z chwilą wykreślenia; SP odpowiada z nabytego mienia; roszczenia wygasają po roku od nabycia |

## OZNACZENIA I DANE (art. 34–35)

| Przepis | Kwalifikator |
|---|---|
| art. 34 | obowiązkowe dane w pismach do oznaczonych osób (firma, forma, siedziba i adres, NIP, sąd i numer KRS); grzywna do 5000 zł |
| art. 35 | dane osób wpisywanych (PESEL albo data urodzenia; osoby prawne — nazwa i numer); pkt 3 zmieniony przez 2025/1792 („rejestr REGON”) |

## REJESTR PRZEDSIĘBIORCÓW (rozdział 2, art. 36–48)

| Przepis | Kwalifikator |
|---|---|
| art. 36 | katalog podmiotów (spółki handlowe, EZIG, spółdzielnie, przedsiębiorstwa państwowe, instytuty, TUW, oddziały przedsiębiorców zagranicznych i in.) |
| art. 37–44 | działy rejestru: 1 — oznaczenie podmiotu (nazwa/firma, forma, siedziba, adres do doręczeń elektronicznych i dalsze dane wg typu; art. 38), 2 — organ reprezentacji, jego skład i sposób reprezentacji (art. 39), 3 — przedmiot działalności wg PKD (do 10 pozycji, jedna przeważająca) i dalsze dane (art. 40), 4 — zaległości podatkowe, celne i składkowe objęte egzekucją, niezapłacone w 60 dni (art. 41), 5 — kurator (art. 43), 6 — likwidacja, zarząd komisaryczny, przymusowa restrukturyzacja i inne zdarzenia z art. 44; [OD 2027-02-18: 2026/176] art. 38 — dane podmiotu prowadzącego rejestr akcjonariuszy / depozyt |
| art. 42 | dane działu 4 nie są objęte domniemaniem z art. 17 ust. 1 (zwrot o MSiG skreślony przez 2025/1556) |
| art. 45, 45a | wpisy z urzędu (upadłość, kurator, likwidacja); doręczenia postanowień |
| art. 46 | wykreślenie danych działu 4 (należność nie istnieje, wygasła, tytuł pozbawiony wykonalności) |
| art. 47 | obowiązek zgłaszania danych i zmian (S.A. i S.K.A. — także adres strony internetowej) |
| art. 47a | dobrowolne ogłoszenia w MSiG w języku UE; ust. 4 (2025/1556) — rozbieżność: treść ogłoszeń dobrowolnych nie może stanowić zarzutu wobec osób trzecich |

## REJESTR STOWARZYSZEŃ I FUNDACJI (rozdział 3, art. 49–54)

| Przepis | Kwalifikator |
|---|---|
| art. 49 ust. 1 | stowarzyszenia, organizacje społeczne i zawodowe, fundacje, SPZOZ — wpis do rejestru z art. 1 ust. 2 pkt 2; ust. 2 (zwolnienie z MSiG) **uchylony** przez 2025/1556 |
| art. 49a | wpis organizacji pożytku publicznego, gdy nie mają innego tytułu do wpisu |
| art. 50 | podjęcie działalności gospodarczej → wpis także do rejestru przedsiębiorców (poza SPZOZ) |
| art. 52, 53 | dane rejestrowe stowarzyszeń i organizacji (komitet założycielski) oraz SPZOZ |
| art. 53a | obowiązek zgłaszania danych i ich zmian |

## REJESTR DŁUŻNIKÓW NIEWYPŁACALNYCH (rozdział 4, art. 55–60) i PRZEPIS KARNY

| Przepis | Kwalifikator |
|---|---|
| art. 55–57 | **uchylone** — przepisy o dokonywaniu wpisów do rejestru dłużników niewypłacalnych; w rozdziale zostały art. 59–60 o wykreślaniu dawnych wpisów; obwieszczenia z KRZ trafiają do sądu rejestrowego przez art. 21c |
| art. 58 | **uchylony** (2025/1556) |
| art. 59 | wykreślenie z urzędu przy uchyleniu lub zmianie postanowienia; na wniosek — gdy należność nie istnieje lub wygasła; wpisy wykreślone nie podlegają ujawnieniu |
| art. 60 ust. 1 | automatyczne wykreślenie po 7 latach; zakaz prowadzenia działalności orzeczony przez sąd upadłościowy — po 10 latach (krótszy zakaz — na wniosek po jego upływie) |
| art. 60a | (2025/1556, rozdział 4a) uzyskiwanie bez uprawnienia informacji z Rejestru przez usługi sieciowe — grzywna, ograniczenie wolności albo do 2 lat |

---

## ROUTING

- spółki → KSH + u.KRS; fundacje i stowarzyszenia → ich ustawy + u.KRS; spółdzielnie → Prawo spółdzielcze + u.KRS;
- postępowanie rejestrowe → KPC (nieprocesowe), art. 7 u.KRS;
- sprawozdawczość → ustawa o rachunkowości (art. 19e u.KRS tylko o trybie złożenia);
- beneficjent rzeczywisty → AML/CRBR, nie KRS; obwieszczenia upadłościowe i restrukturyzacyjne → KRZ (art. 21c u.KRS; Prawo upadłościowe, Prawo restrukturyzacyjne).

## Fresh gate

Przed podaniem wymogu, terminu, skutku wpisu lub środka zaskarżenia odczytaj brzmienie z ELI i sprawdź tabelę A rejestru zmian (`JUR:rejestr-zmian-w-czasie`): zmiany z datą przyszłą powyżej oznaczono `[OD RRRR-MM-DD: RRRR/poz]`; przepisy przejściowe 2025/1556 (art. 9, 10) i 2026/176 (art. 32) — tabela B.
