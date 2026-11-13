# mod-KSH-spolki-osobowe-rada-nadzorcza

**Hasła spraw:** spółka jawna, spółka partnerska, spółka komandytowa, komplementariusz, komandytariusz, suma komandytowa, odpowiedzialność subsydiarna, wystąpienie wspólnika, wyłączenie wspólnika, likwidacja spółki osobowej

**Akt:** KSH — t.j. Dz.U. 2024 poz. 18 (zm. 2024/96; 2026/176 [OD 2027-02-18: 2026/176] — S.A./PSA/S.K.A., nie art. 22–124; **2026/187 art. 138 [OD 2028-05-19: 2026/187] — art. 88**; 2026/644 [OD 2030-01-10: 2026/644] — art. 402⁷, 421¹; 2026/1440 [OD 2026-12-03: 2026/1440] — art. 238, 243, 300⁹⁵, nie art. 22–124).
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1): `isap_tekst` albo `https://api.sejm.gov.pl/eli/acts/DU/2024/18/text.pdf`; zmiany po t.j. — ELI, „Akty zmieniające” aktu DU/2000/1037.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-13.

**Pułapka numeracji:** grupa spółek to art. 21¹–21¹⁶ (Tytuł I, Dział IV); rada nadzorcza sp. z o.o. to art. 213–222. W tekstach bez indeksów górnych „21³” i „213” wyglądają tak samo — rozstrzyga identyfikator jednostki w ELI (`arti_21_3` ≠ `arti_213`).

Zakres: Tytuł II Działy I–III (spółka jawna art. 22–85, partnerska art. 86–101, komandytowa art. 102–124). **Rada nadzorcza sp. z o.o. (art. 212–226) przeniesiona do `mod-KSH-organy-spolki-zoo`** (nazwa pliku zachowana dla odesłań). S.K.A. (art. 125–150) — poza zakresem; typy spółek i odpowiedzialność w skrócie — `mod-KSH-spolki-handlowe`.

---

## FAZA 0 — INTAKE

```
□ Typ: jawna / partnerska / komandytowa? (S.K.A. — art. 125 i n., brzmienie z ELI)
□ Rola osoby: wspólnik / partner / komplementariusz / komandytariusz / przystępujący / wierzyciel wspólnika?
□ Problem: odpowiedzialność za długi spółki, reprezentacja, prowadzenie spraw, zysk, zakaz konkurencji,
  wypowiedzenie, śmierć, wyłączenie, rozliczenie, likwidacja?
□ Daty: zawiązania, wpisu do KRS (art. 31 § 3, 32, 114), przystąpienia, wypowiedzenia (art. 61, 65 § 2).
□ Umowa spółki: forma (art. 23, 92, 106), wzorzec S24 (art. 23¹, 106¹), postanowienia odmienne od ustawy (art. 37 § 1).
```

---

## SPÓŁKA JAWNA — POWSTANIE I STOSUNEK DO OSÓB TRZECICH (art. 22–36)

| Przepis | Kwalifikator |
|---|---|
| art. 22 § 1–2 | definicja rezydualna (spółka osobowa z przedsiębiorstwem pod własną firmą, niebędąca inną spółką handlową); każdy wspólnik odpowiada bez ograniczenia, solidarnie ze spółką i wspólnikami, z uwzględnieniem art. 31 |
| art. 23, 23¹ | umowa na piśmie pod rygorem nieważności; albo wzorzec w systemie teleinformatycznym |
| art. 24 | firma: nazwiska/firmy wszystkich albo niektórych wspólników + „spółka jawna” („sp. j.”) |
| art. 25 | obligatoryjna treść umowy: firma i siedziba, wkłady i ich wartość, przedmiot działalności, czas trwania (gdy oznaczony) |
| art. 25¹ § 1–2 | powstaje z wpisem do rejestru; działający przed wpisem odpowiadają solidarnie |
| art. 26–27 | zgłoszenie do KRS i zmiany; wzmianka o umowie majątkowej małżeńskiej na żądanie małżonka wspólnika |
| art. 28 | majątek spółki: wkłady i mienie nabyte w czasie istnienia |
| art. 29 § 1–3 | każdy wspólnik reprezentuje; zakres — wszystkie czynności sądowe i pozasądowe; ograniczenie bez skutku wobec osób trzecich |
| art. 30 § 1–2 | umowa: pozbawienie prawa reprezentacji albo reprezentacja łączna (z innym wspólnikiem lub prokurentem); pozbawienie wbrew umowie — tylko z ważnych powodów prawomocnym orzeczeniem sądu |
| art. 31 § 1 | odpowiedzialność **subsydiarna**: egzekucja z majątku wspólnika dopiero po bezskutecznej egzekucji z majątku spółki |
| art. 31 § 2 | powództwo przeciw wspólnikowi dopuszczalne wcześniej; subsydiarność dotyczy egzekucji |
| art. 31 § 3 | subsydiarności **nie ma** dla zobowiązań powstałych przed wpisem do rejestru |
| art. 32 | przystępujący odpowiada za zobowiązania spółki powstałe przed dniem przystąpienia |
| art. 33 | wspólnik przedsiębiorcy jednoosobowego wnoszącego przedsiębiorstwo — odpowiada za jego dawne zobowiązania do wartości przedsiębiorstwa |
| art. 34 | postanowienia sprzeczne z art. 31–33 bez skutku wobec osób trzecich |
| art. 35 § 1–2 | pozwany wspólnik podnosi zarzuty spółki; zarzut wymagający oświadczenia spółki — odmowa zaspokojenia do czasu oświadczenia, wierzyciel może wyznaczyć 2 tygodnie |
| art. 36 § 1–2 | wspólnik nie żąda udziału w wierzytelności spółki ani nie potrąca nią; dłużnik spółki nie potrąca wierzytelności wobec wspólnika |

---

## SPÓŁKA JAWNA — STOSUNKI WEWNĘTRZNE (art. 37–57)

| Przepis | Kwalifikator |
|---|---|
| art. 37 § 1–2 | rozdział dyspozytywny („jeżeli umowa nie stanowi inaczej”), z wyjątkiem art. 38 |
| art. 38 § 1–2 | **bezwzględnie**: zakaz powierzenia prowadzenia spraw osobom trzecim z wyłączeniem wspólników; nieważne ograniczenie osobistego prawa do informacji i przeglądania ksiąg |
| art. 39 § 1–3 | każdy wspólnik prowadzi sprawy; zwykłe czynności bez uchwały; sprzeciw innego wspólnika → uprzednia uchwała |
| art. 40 § 1–2 | powierzenie prowadzenia spraw niektórym (umowa lub uchwała) → pozostali wyłączeni |
| art. 41 | prokura: ustanowienie — zgoda wszystkich prowadzących sprawy; odwołanie — każdy z nich |
| art. 42 | uchwała w zwykłych sprawach — jednomyślność wspólników prowadzących sprawy |
| art. 43 | sprawy ponad zwykły zarząd — **zgoda wszystkich**, także wyłączonych od prowadzenia spraw |
| art. 44 | czynność nagła (zaniechanie grozi poważną szkodą) — wspólnik prowadzący sprawy bez uchwały |
| art. 45 | wspólnik a spółka: przepisy o zleceniu; bez umocowania lub z przekroczeniem — prowadzenie cudzych spraw bez zlecenia |
| art. 46 | brak wynagrodzenia za prowadzenie spraw (dyspozytywne, art. 37 § 1) |
| art. 47 | odebranie prawa prowadzenia spraw (także zwolnienie z obowiązku) — ważne powody, prawomocne orzeczenie sądu |
| art. 48–50 | wkłady: równe w razie wątpliwości; formy; wzorzec — tylko pieniężne; prawa przechodzą na spółkę; udział kapitałowy = wartość wniesionego wkładu |
| art. 51 § 1–3 | równy udział w zysku i stratach niezależnie od wkładu; udział w zysku = udział w stratach w razie wątpliwości; umowa może zwolnić od strat |
| art. 52–53 | żądanie podziału i wypłaty zysku z końcem roku (najpierw uzupełnienie udziału po stracie); odsetki 5% od udziału kapitałowego rocznie, także przy stracie |
| art. 54–55 | zmniejszenie udziału — zgoda pozostałych; zakaz potrącenia z wierzytelnością o szkodę; subpartycypacja nie czyni wspólnikiem |
| art. 56 § 1–2 | zakaz działalności sprzecznej z interesem spółki; zakaz konkurencji bez wyraźnej lub domniemanej zgody (udział jako wspólnik s.c., sp. j., partner, komplementariusz, członek organu) |
| art. 57 § 1–3 | każdy wspólnik: wydanie spółce korzyści albo naprawienie szkody; przedawnienie **6 miesięcy** od dowiedzenia się wszystkich pozostałych, max **3 lata**; nie wyłącza art. 63 |

---

## SPÓŁKA JAWNA — ROZWIĄZANIE, WYSTĄPIENIE, LIKWIDACJA (art. 58–85)

| Przepis | Kwalifikator |
|---|---|
| art. 58 § 1 pkt 1–6 | przyczyny rozwiązania: umowa; jednomyślna uchwała; upadłość spółki; śmierć lub upadłość wspólnika; wypowiedzenie przez wspólnika lub wierzyciela wspólnika; prawomocne orzeczenie |
| art. 59 | dalsze prowadzenie mimo umownej przyczyny za zgodą wszystkich → przedłużenie na czas nieoznaczony |
| art. 60 | spadkobiercy zmarłego wspólnika wskazują jedną osobę; przeciwne postanowienia nieważne |
| art. 61 § 1–3 | wypowiedzenie (czas nieoznaczony) na **6 miesięcy przed końcem roku obrotowego**; na czas życia = nieoznaczony; forma pisemna, adresat — pozostali wspólnicy albo wspólnik reprezentujący |
| art. 62 § 1–2 | wierzyciel wspólnika: zajęcie tylko praw zbywalnych; wypowiedzenie umowy przez wierzyciela po bezskutecznej egzekucji z ruchomości w ostatnich 6 miesiącach i zajęciu roszczeń |
| art. 63 § 1 | każdy wspólnik — rozwiązanie spółki przez sąd z ważnych powodów |
| art. 63 § 2–3 | ważny powód po stronie jednego wspólnika → sąd może na wniosek pozostałych **wyłączyć go ze spółki**; przeciwne postanowienia nieważne |
| art. 64 § 1–2 | mimo śmierci, upadłości lub wypowiedzenia spółka trwa między pozostałymi — gdy umowa tak stanowi albo pozostali postanowią (śmierć/upadłość — niezwłocznie, wypowiedzenie — przed upływem terminu) |
| art. 65 § 1–2 | rozliczenie z występującym: osobny bilans z **wartością zbywczą** majątku; dzień bilansowy — wypowiedzenie: ostatni dzień roku obrotowego z upływem terminu; śmierć/upadłość: dzień zdarzenia; wyłączenie: **dzień wniesienia pozwu** |
| art. 65 § 3–5 | wypłata w pieniądzu, rzeczy do używania w naturze; **ujemny udział — obowiązek wyrównania**; udział w wyniku spraw niezakończonych |
| art. 66 | spółka dwóch wspólników, powód rozwiązania po stronie jednego → sąd może przyznać drugiemu **przejęcie majątku** z rozliczeniem wg art. 65 |
| art. 67 § 1–2 | likwidacja, chyba że wspólnicy uzgodnią inny sposób zakończenia (zgoda wierzyciela lub syndyka, gdy powodem było ich wypowiedzenie lub upadłość) |
| art. 68–76 | w likwidacji stosunki wewnętrzne i zewnętrzne jak dotąd; zakaz konkurencji — tylko likwidatorzy; likwidatorami wszyscy wspólnicy, chyba że jednomyślnie inaczej; sąd z ważnych powodów; reprezentacja łączna i większość głosów, chyba że postanowiono inaczej |
| art. 77–79 | zadania likwidatorów (nowe interesy tylko dla spraw w toku); ograniczenia kompetencji bez skutku wobec osób trzecich, dobra wiara; prokura wygasa i nie może być ustanowiona |
| art. 80–83 | spadkobiercy wspólnika — za zobowiązania z likwidacji jak za długi spadkowe; bilans otwarcia i zamknięcia; kolejność: zobowiązania → udziały → nadwyżka wg udziału w zysku; niedobór wg udziału w stracie |
| art. 84 § 1–3 | wniosek o wykreślenie (likwidatorzy; bez likwidacji — wspólnicy); **rozwiązanie z chwilą wykreślenia**; przechowanie ksiąg ≥ 5 lat |
| art. 85 § 1–2 | upadłość spółki: rozwiązanie po zakończeniu postępowania z wykreśleniem (wniosek syndyka); nie przy zaspokojeniu wszystkich, układzie, uchyleniu lub umorzeniu |

---

## SPÓŁKA PARTNERSKA (art. 86–101)

| Przepis | Kwalifikator |
|---|---|
| art. 86–87 | spółka osobowa do wykonywania wolnego zawodu (także kilku, chyba że ustawa inaczej); partnerami tylko osoby fizyczne uprawnione do zawodu z art. 88 lub ustawy odrębnej |
| art. 88 | katalog zawodów. **[OD 2028-05-19: 2026/187]** dodany psycholog (art. 138 ustawy o zawodzie psychologa); do 2028-05-18 — bez psychologa |
| art. 89 | w sprawach nieuregulowanych — przepisy o spółce jawnej odpowiednio |
| art. 90–94 | firma (nazwisko partnera + „i partner(zy)” albo „spółka partnerska” + zawód; „sp.p.” zastrzeżone); treść umowy; **forma pisemna pod rygorem nieważności**; zgłoszenie; powstanie z wpisem |
| art. 95 § 1 | partner **nie odpowiada** za zobowiązania z wykonywania zawodu przez innych partnerów ani za działania osób podległych kierownictwu innego partnera |
| art. 95 § 2 | umowa może przewidzieć odpowiedzialność partnera jak wspólnika spółki jawnej (wymieniony w umowie, art. 91 pkt 3) |
| art. 96 § 1–3 | każdy partner reprezentuje samodzielnie, chyba że umowa inaczej; pozbawienie — ważne powody, uchwała **3/4 głosów przy obecności 2/3 partnerów**; skuteczne z wpisem |
| art. 97 § 1–3 | umowa może powierzyć prowadzenie spraw i reprezentację **zarządowi** (art. 96 nie stosuje się); do zarządu art. 201–211 i 293–300; co najmniej jeden partner w zarządzie, także osoby trzecie |
| art. 98 § 1–2 | przyczyny rozwiązania (w tym utrata prawa wykonywania zawodu przez wszystkich); jeden partner lub jeden uprawniony → rozwiązanie najpóźniej po roku |
| art. 99 | śmierć, upadłość, wypowiedzenie partnera — art. 59–62 i 64–66 |
| art. 100 | utrata uprawnień zawodowych → wystąpienie najpóźniej z końcem roku obrotowego; inaczej z mocy ustawy w ostatnim dniu |
| art. 101 | spadkobierca nie wstępuje, chyba że umowa inaczej (z uwzględnieniem art. 87) |

---

## SPÓŁKA KOMANDYTOWA (art. 102–124)

| Przepis | Kwalifikator |
|---|---|
| art. 102 | co najmniej jeden komplementariusz (odpowiedzialność nieograniczona) i jeden komandytariusz (ograniczona) |
| art. 103 § 1–2 | w sprawach nieuregulowanych — przepisy o spółce jawnej odpowiednio, chyba że ustawa inaczej |
| art. 104 § 1–3 | firma: nazwisko komplementariusza albo pełna firma komplementariusza-osoby prawnej + „spółka komandytowa” („sp.k.”) |
| art. 104 § 4 | nazwisko/firma **komandytariusza w firmie** spółki → odpowiada wobec osób trzecich **jak komplementariusz** |
| art. 105 | treść umowy, w tym **suma komandytowa** każdego komandytariusza (kwotowo) |
| art. 106, 106¹ | umowa w formie **aktu notarialnego**; albo wzorzec w systemie teleinformatycznym |
| art. 107 § 1–3 | aport komandytariusza — przedmiot, wartość, wnoszący; praca/usługi nie są wkładem komandytariusza, chyba że inne wkłady ≥ suma komandytowa; gdy komplementariuszem jest sp. z o.o., PSA lub S.A., a komandytariusz jej wspólnikiem — jej udziały/akcje nie mogą być wkładem |
| art. 108 § 1–2 | wkład może być niższy od sumy komandytowej, chyba że umowa inaczej; zwolnienie z obowiązku wniesienia wkładu nieważne |
| art. 109–110 | powstaje z wpisem; działający przed wpisem odpowiadają solidarnie; zgłoszenie do KRS |
| art. 111 | komandytariusz odpowiada wobec wierzycieli **do wysokości sumy komandytowej** |
| art. 112 § 1–2 | wolny od odpowiedzialności w granicach **wniesionego** wkładu; zwrot wkładu przywraca odpowiedzialność w wysokości zwrotu |
| art. 112 § 3–4 | po stracie każda wypłata przed uzupełnieniem wkładu = zwrot wkładu wobec wierzycieli (bez wpisu); zysk pobrany na podstawie sprawozdania finansowego nie podlega zwrotowi, chyba że zła wiara |
| art. 113 | obniżenie sumy komandytowej bez skutku wobec wierzycieli z wierzytelnościami sprzed wpisu obniżenia |
| art. 114 | przystępujący komandytariusz odpowiada za zobowiązania istniejące w chwili wpisania go do rejestru |
| art. 115–116 | nowy komplementariusz — gdy umowa dopuszcza, za zgodą wszystkich; komandytariusz odpowiada za długi wniesionego przedsiębiorstwa istniejące przy wpisie |
| art. 117 | reprezentują komplementariusze niepozbawieni tego prawa umową albo prawomocnym orzeczeniem |
| art. 118 § 1–2 | komandytariusz reprezentuje **tylko jako pełnomocnik**; czynność bez ujawnienia pełnomocnictwa, bez umocowania lub z przekroczeniem → odpowiedzialność **bez ograniczenia** wobec osób trzecich |
| art. 119 | postanowienia umowy niezgodne z rozdziałem (art. 111–119) **nie wywołują skutków wobec osób trzecich** — wewnętrznie mogą obowiązywać |
| art. 120 § 1–3 | komandytariusz: odpis sprawozdania finansowego i wgląd w księgi; z ważnych powodów — sąd rejestrowy; umowa nie może wyłączyć ani ograniczyć |
| art. 121 § 1–3 | komandytariusz nie prowadzi spraw, chyba że umowa inaczej; zgoda komandytariusza na czynności ponad zwykły zarząd (dyspozytywne); bez prowadzenia spraw i reprezentacji — art. 56–57 nie stosuje się, chyba że umowa inaczej |
| art. 122 | zbycie ogółu praw komandytariusza — nabywca bez prawa prowadzenia spraw |
| art. 123 § 1–3 | zysk proporcjonalnie do wkładu **rzeczywiście wniesionego**, najpierw na uzupełnienie wkładu; strata w razie wątpliwości do wartości umówionego wkładu |
| art. 124 § 1–2 | śmierć komandytariusza nie rozwiązuje spółki; spadkobiercy wskazują jedną osobę; podział udziału między spadkobierców — zgoda pozostałych wspólników |

---

## PUŁAPKI

- Art. 31 § 3 (brak subsydiarności dla długów sprzed wpisu spółki) a art. 32 (przystępujący odpowiada za długi sprzed przystąpienia) — dwie różne normy.
- Art. 63 § 2 = wyłączenie wspólnika na wniosek pozostałych; art. 66 = przejęcie majątku w spółce dwóch wspólników.
- Art. 43: czynność ponad zwykły zarząd wymaga zgody **wszystkich**; czynność nagła — art. 44.
- Komandytariusz: odpowiedzialność do sumy komandytowej (art. 111), zwolnienie do wniesionego wkładu (art. 112); utrata ograniczenia — firma (art. 104 § 4) i działanie bez ujawnienia pełnomocnictwa (art. 118 § 2).
- Art. 119 nie zakazuje odmiennych postanowień; pozbawia je skutku wobec osób trzecich.
- Klauzula wykonalności przeciw wspólnikowi (subsydiarność) — KPC, brzmienie z ELI; orzecznictwo przez `orzeczenia-sadowe-v2`, nie z pamięci.

---

## WORKFLOW

1. Ustal typ spółki i rolę osoby; pobierz umowę spółki (wersja na dzień zdarzenia).
2. Pobierz z ELI brzmienie przepisów z tabeli; dla partnerskiej sprawdź art. 88 na dzień zdarzenia.
3. Odpowiedzialność za dług spółki: art. 22 § 2 / 31 / 32 / 33 / 95 / 111–116 → daty wpisu i przystąpienia.
4. Spór wewnętrzny: prowadzenie spraw (art. 39–47), zysk (art. 51–53, 123), konkurencja (art. 56–57, 121 § 3).
5. Wyjście ze spółki: wypowiedzenie (art. 61–62), wyłączenie (art. 63 § 2), trwanie (art. 64), rozliczenie (art. 65–66).
6. Koniec spółki: przyczyny (art. 58, 98), likwidacja (art. 67–84), upadłość (art. 85; DR-02 moduły PrUpad).

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Typy spółek, art. 17, przekształcenie spółki osobowej (art. 551 i n.) | `mod-KSH-spolki-handlowe` |
| Rada nadzorcza i organy sp. z o.o., komplementariusz sp. z o.o. (art. 210) | `mod-KSH-organy-spolki-zoo` |
| Pozew o rozwiązanie, wyłączenie, pozbawienie prawa reprezentacji (art. 30 § 2, 47, 63) | `pisma-procesowe-v3` |
| Umowa spółki osobowej | `analizator-umow-v1` |
| Egzekucja przeciw wspólnikowi | `mod-KPC-egzekucja-windykacja` |
| Orzecznictwo | `orzeczenia-sadowe-v2` |

---

## QUALITY GATE

- [ ] Brzmienie każdego powołanego przepisu pobrane z ELI (nie z kwalifikatora)?
- [ ] Stan prawny na dzień zdarzenia (art. 88 [OD 2028-05-19: 2026/187])?
- [ ] Umowa spółki sprawdzona pod kątem odstępstw (art. 37 § 1) i przepisów bezwzględnych (art. 38, 60, 63 § 3, 71, 73, 108 § 2, 120 § 3)?
- [ ] Odpowiedzialność: data wpisu spółki, data przystąpienia, suma komandytowa i wartość wniesionego wkładu?
- [ ] Rozliczenie z występującym: dzień bilansowy wg art. 65 § 2?

## OUTPUT

1. Stan faktyczny i umowa spółki; 2. Kwalifikacja (przepis + brzmienie z ELI); 3. Odpowiedzialność lub uprawnienia stron;
4. Terminy i daty graniczne; 5. Ryzyka; 6. Kolejne kroki.
