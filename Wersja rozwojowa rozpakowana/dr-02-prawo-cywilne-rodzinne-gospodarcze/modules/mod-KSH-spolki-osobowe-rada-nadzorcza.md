# mod-KSH-spolki-osobowe-rada-nadzorcza

**Akt:** KSH — t.j. Dz.U. 2024 poz. 18 (zm. 2024/96; 2026/644 — art. 402⁷; 2026/1440 od 3.12.2026 — art. 238, 243, 300⁹⁵; 2026/176 od 18.02.2027; 2026/187 od 19.05.2028). Żadna z tych zmian nie dotyczy przepisów wskazanych w tym module (stan 2026-11-13).
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1): `isap_tekst` albo `https://api.sejm.gov.pl/eli/acts/DU/2024/18/text.pdf` kanałem hosta; zmiany po t.j. — ELI, „Akty zmieniające”.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-13.

**Pułapka numeracji:** grupa spółek to art. 21¹–21¹⁶ (Tytuł I, Dział IV); rada nadzorcza sp. z o.o. to art. 213–222. W tekstach bez indeksów górnych „21³” i „213” wyglądają tak samo — sprawdzaj kontekst (Dział / Oddział).

Zakres: spółka jawna (Dział I, art. 22–85), spółka komandytowa (Dział III, art. 102–124), rada nadzorcza i komisja rewizyjna sp. z o.o. (art. 213–222). Typy spółek i odpowiedzialność ogólnie — `mod-KSH-spolki-handlowe`; zarząd i zgromadzenie sp. z o.o. — `mod-KSH-organy-spolki-zoo`.

---

## FAZA 0 — INTAKE

```
□ Typ spółki (jawna / komandytowa / partnerska / S.K.A. / sp. z o.o. z RN)?
□ Stosunek wewnętrzny (prowadzenie spraw) czy zewnętrzny (reprezentacja, odpowiedzialność)?
□ Kto jest stroną sporu: wspólnik, wierzyciel, komandytariusz, członek zarządu, RN?
□ Treść umowy spółki — co modyfikuje przepisy dyspozytywne (art. 37 § 1)?
□ Daty: przystąpienie, wpis do KRS, wypowiedzenie, dowiedzenie się o naruszeniu zakazu konkurencji.
```

---

## 1. SPÓŁKA JAWNA

### Przepisy ogólne i stosunek do osób trzecich (art. 22–36)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| art. 22 § 1 | definicja rezydualna: spółka osobowa prowadząca przedsiębiorstwo pod własną firmą, niebędąca inną spółką handlową | |
| art. 22 § 2 | każdy wspólnik odpowiada bez ograniczenia, całym majątkiem, solidarnie z innymi wspólnikami i spółką — z uwzględnieniem art. 31 | punkt wyjścia dla komplementariusza (art. 103) |
| art. 23, 23¹ | umowa na piśmie pod rygorem nieważności; albo wzorzec umowy w systemie teleinformatycznym (art. 23¹) | |
| art. 25 | treść umowy: firma i siedziba, wkłady i ich wartość, przedmiot działalności, czas trwania (jeśli oznaczony) | |
| art. 25¹ | spółka powstaje z chwilą wpisu do rejestru | |
| art. 29 | każdy wspólnik ma prawo reprezentacji; obejmuje czynności sądowe i pozasądowe; § 3 — nie można jej ograniczyć ze skutkiem wobec osób trzecich | |
| art. 30 | § 1: umowa może pozbawić prawa reprezentacji albo wprowadzić łączną (z innym wspólnikiem lub prokurentem); § 2: pozbawienie wbrew umowie — tylko z ważnych powodów, prawomocnym orzeczeniem sądu | |
| art. 31 | § 1: egzekucja z majątku wspólnika dopiero, gdy egzekucja ze spółki bezskuteczna (subsydiarność); § 2: pozew przeciw wspólnikowi dopuszczalny wcześniej; § 3: subsydiarność nie dotyczy zobowiązań powstałych przed wpisem do rejestru | pozwać można od razu, egzekwować po bezskuteczności wobec spółki; bezskuteczność wykazuje się przy klauzuli przeciw wspólnikowi (KPC — `mod-KPC-egzekucja-windykacja`) |
| art. 32 | przystępujący odpowiada za zobowiązania spółki sprzed przystąpienia | to art. 32, nie art. 31 § 3 |

### Stosunki wewnętrzne (art. 37–57)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| art. 37 | § 1: przepisy rozdziału dyspozytywne (jeśli umowa nie stanowi inaczej); § 2: art. 38 bezwzględnie obowiązujący | |
| art. 38 | § 1: zakaz powierzenia prowadzenia spraw osobom trzecim z wyłączeniem wspólników; § 2: nieważne umowne ograniczenie osobistego prawa do informacji i przeglądania ksiąg | |
| art. 39 | § 1: każdy wspólnik ma prawo i obowiązek prowadzenia spraw; § 2: sprawy zwykłe bez uchwały; § 3: sprzeciw innego wspólnika → wymagana uchwała | |
| art. 40 | powierzenie prowadzenia spraw niektórym wspólnikom (umowa lub uchwała) wyłącza pozostałych; § 2: między nimi stosuje się zasady ogólne | |
| art. 43 | sprawy przekraczające zwykły zarząd — **zgoda wszystkich** wspólników, także wyłączonych od prowadzenia spraw | przepis mówi o zgodzie, nie o „jednomyślnej uchwale” |
| art. 44 | czynność nagła (zaniechanie mogłoby wyrządzić poważną szkodę) — wspólnik prowadzący sprawy działa bez uchwały | to art. 44, nie art. 43 |
| art. 46 | za prowadzenie spraw wspólnik nie otrzymuje wynagrodzenia | dyspozytywne (art. 37 § 1) |
| art. 47 | odebranie prawa prowadzenia spraw (i zwolnienie z obowiązku) — tylko z ważnych powodów, prawomocnym orzeczeniem sądu | odpowiednik art. 30 § 2 dla stosunków wewnętrznych |
| art. 56 | § 1: powstrzymanie się od działalności sprzecznej z interesami spółki; § 2: zakaz interesów konkurencyjnych bez wyraźnej lub domniemanej zgody (m.in. wspólnik s.c., sp.j., partner, komplementariusz, członek organu spółki konkurencyjnej) | |
| art. 57 | § 1: każdy wspólnik żąda wydania spółce korzyści lub naprawienia szkody; § 2: przedawnienie 6 miesięcy od dowiedzenia się przez **wszystkich** pozostałych wspólników, nie później niż 3 lata; § 3: nie ogranicza art. 63 | |

### Rozwiązanie i wystąpienie (art. 58–66)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| art. 58 § 1 | przyczyny rozwiązania (pkt 1–6): umowa, jednomyślna uchwała, upadłość spółki, śmierć lub upadłość wspólnika, wypowiedzenie przez wspólnika lub jego wierzyciela, prawomocne orzeczenie sądu | § 2: uchwała na wzorcu przy spółce z wzorca |
| art. 63 | § 1: rozwiązanie przez sąd z ważnych powodów (każdy wspólnik); § 2: ważny powód po stronie jednego wspólnika → sąd może, na wniosek pozostałych, **wyłączyć tego wspólnika**; § 3: przeciwne postanowienia umowy nieważne | wyłączenie wspólnika to art. 63 § 2; przejęcie majątku w spółce dwuosobowej to art. 66 |
| art. 64 | § 1: spółka trwa mimo śmierci, upadłości lub wypowiedzenia, jeśli umowa tak stanowi lub pozostali tak postanowią; § 2: przy śmierci/upadłości — niezwłocznie, przy wypowiedzeniu — przed upływem terminu wypowiedzenia; inaczej spadkobierca/syndyk/wypowiadający/wierzyciel mogą żądać likwidacji | |
| art. 65 | rozliczenie z występującym: § 1 osobny bilans z wartością zbywczą majątku; § 2 dzień bilansowy (wypowiedzenie — ostatni dzień roku obrotowego, w którym upłynął termin; śmierć/upadłość — ten dzień; wyłączenie sądowe — dzień wniesienia pozwu); § 3 wypłata w pieniądzu, rzeczy do używania w naturze; § 4 wartość ujemna → obowiązek wyrównania; § 5 udział w zysku/stracie spraw niezakończonych | |
| art. 66 | spółka dwuosobowa, powód rozwiązania po stronie jednego wspólnika → sąd **może** przyznać drugiemu prawo przejęcia majątku z rozliczeniem wg art. 65 | uprawnienie sądu, nie skutek automatyczny |

Likwidacja: art. 67–85 (art. 67 § 1 — likwidacja w przypadkach z art. 58, chyba że wspólnicy uzgodnią inny sposób zakończenia). Spółka partnerska: art. 86–101 (art. 89 — odesłanie do spółki jawnej). S.K.A.: art. 125–150. Brzmienie — ELI.

---

## 2. SPÓŁKA KOMANDYTOWA (art. 102–124)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| art. 102 | co najmniej jeden komplementariusz (bez ograniczenia) i co najmniej jeden komandytariusz (odpowiedzialność ograniczona) | brak którejkolwiek roli = nie jest to sp.k. |
| art. 103 | § 1: w sprawach nieuregulowanych — odpowiednio przepisy o spółce jawnej; § 2: spółka z wzorca — przepisy o sp.j. z wzorca | stąd art. 22 § 2, 31, 43, 47, 56–66 stosowane odpowiednio |
| art. 104 | § 1–3: firma z nazwiskiem komplementariusza (albo pełną firmą komplementariusza-osoby prawnej) + „spółka komandytowa” / „sp.k.”; § 4: nazwisko lub firma komandytariusza w firmie → odpowiada wobec osób trzecich jak komplementariusz | sankcja jest w § 4 |
| art. 111 | komandytariusz odpowiada wobec wierzycieli tylko do wysokości sumy komandytowej | odpowiedzialność osobista, solidarna i subsydiarna (art. 103 → art. 22 § 2, 31) |
| art. 112 | § 1: wolny od odpowiedzialności w granicach wartości wniesionego wkładu; § 2: zwrot wkładu przywraca odpowiedzialność do wartości zwrotu; § 3: przy stracie każda wypłata przed uzupełnieniem wkładu = zwrot (bez wpisu); § 4: pobrany zysk ze sprawozdania nie podlega zwrotowi, chyba że zła wiara | |
| art. 113 | obniżenie sumy komandytowej bez skutku wobec wierzycieli, których wierzytelności powstały przed wpisem obniżenia | |
| art. 117 | reprezentują komplementariusze nie pozbawieni tego prawa umową lub prawomocnym orzeczeniem | |
| art. 118 | § 1: komandytariusz reprezentuje spółkę wyłącznie jako pełnomocnik; § 2: działanie bez ujawnienia pełnomocnictwa, bez umocowania lub z przekroczeniem → odpowiedzialność wobec osób trzecich bez ograniczenia | |
| art. 119 | postanowienia umowy niezgodne z art. 111–118 **nie wywołują skutków wobec osób trzecich** | skutek tylko zewnętrzny — nie jest to „bezwzględna nieważność” postanowień między wspólnikami |
| art. 120 | § 1–2: prawo komandytariusza do sprawozdania i przeglądania ksiąg; wniosek do sądu rejestrowego z ważnych powodów; § 3: nie można wyłączyć ani ograniczyć | |
| art. 121 | § 1: komandytariusz nie prowadzi spraw, chyba że umowa inaczej; § 2: sprawy przekraczające zwykły zarząd — wymagana jego zgoda (dyspozytywnie); § 3: zakaz konkurencji (art. 56–57) nie dotyczy komandytariusza bez prawa prowadzenia spraw i reprezentacji, chyba że umowa inaczej | |

Pułapka praktyczna: osoba będąca członkiem zarządu komplementariusza (sp. z o.o.) i jednocześnie komandytariuszem — w czynności wskazuj wprost, w jakiej roli działa (pełnomocnik sp.k. czy organ komplementariusza); ryzyko art. 118 § 2. Stosowanie art. 210 § 1 do umów sp.k. z członkiem zarządu komplementariusza — sporne; sprawdź aktualne orzecznictwo SN (`orzeczenia-sadowe-v2`) przed opinią.

---

## 3. RADA NADZORCZA I KOMISJA REWIZYJNA SP. Z O.O. (art. 213–222)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| art. 210 § 1 | w umowie spółki z członkiem zarządu i w sporze z nim spółkę reprezentuje RN albo pełnomocnik powołany uchwałą wspólników | § 2: jedyny wspólnik będący jedynym członkiem zarządu — forma aktu notarialnego (wyjątek: wzorzec, § 3) |
| art. 212 | indywidualna kontrola wspólnika (księgi, dokumenty, wyjaśnienia); § 2–4: odmowa zarządu, uchwała w miesiąc, wniosek do sądu rejestrowego w 7 dni | |
| art. 213 | § 1: RN lub komisja rewizyjna albo oba organy — fakultatywnie; § 2: obowiązkowo, gdy kapitał zakładowy > 500 000 zł **i** wspólników > 25; § 3: po ustanowieniu organu umowa może wyłączyć albo ograniczyć indywidualną kontrolę wspólników | § 3 dotyczy kontroli z art. 212, nie innych uprawnień |
| art. 214 | § 1: niepołączalność — członek zarządu, prokurent, likwidator, kierownik oddziału/zakładu, zatrudniony w spółce główny księgowy, radca prawny, adwokat; § 2: także osoby bezpośrednio podległe członkowi zarządu lub likwidatorowi; § 3: członkowie zarządu i likwidatorzy spółki lub spółdzielni zależnej | |
| art. 214¹ | członek RN/KR: staranność zawodowa i lojalność; tajemnica także po mandacie | |
| art. 215 | § 1: co najmniej 3 członków, powoływanych i odwoływanych uchwałą wspólników; § 2: umowa może przewidzieć inny sposób | |
| art. 216 | § 1: kadencja roczna, jeśli umowa nie stanowi inaczej; § 2: odwołanie uchwałą wspólników w każdym czasie | |
| art. 217 | komisja rewizyjna — co najmniej 3 członków, jak RN | |
| art. 218 | wygaśnięcie mandatów: ze zgromadzeniem zatwierdzającym sprawozdanie za pierwszy pełny rok obrotowy (§ 1) albo ostatni pełny rok kadencji dłuższej (§ 2); § 3 — art. 202 § 3–5 odpowiednio | |
| art. 219 | § 1: stały nadzór we wszystkich dziedzinach; § 2: **brak prawa wiążących poleceń** dla zarządu; § 3: ocena sprawozdań i wniosku o podział zysku + sprawozdanie RN; § 4: badanie dokumentów, rewizja majątku, żądanie informacji (także od pracowników i zleceniobiorców, o spółkach zależnych i powiązanych); § 4¹: termin 2 tygodnie; § 4²: zarząd nie może ograniczać dostępu; § 5: każdy członek nadzoruje samodzielnie (dyspozytywnie); § 6: udział biegłego rewidenta | |
| art. 219¹ | komitety RN (bez zwolnienia członków z odpowiedzialności) | |
| art. 219² | doradca RN — tylko gdy umowa spółki tak stanowi; RN reprezentuje spółkę w umowie z doradcą | |
| art. 220 | umowa może rozszerzyć uprawnienia RN, w szczególności: zgoda RN na oznaczone czynności zarządu; prawo zawieszania członków zarządu z ważnych powodów | **art. 220 nie przewiduje limitu 3 miesięcy ani delegowania** — to rozwiązania S.A. (art. 383 § 1) i P.S.A. (art. 300⁷⁰); w sp. z o.o. wynikają tylko z umowy spółki |
| art. 221 | obowiązki komisji rewizyjnej (ocena sprawozdań i wniosku o podział zysku, sprawozdanie); § 2 — rozszerzenie w spółce bez RN | |
| art. 222 | kworum (połowa członków + zaproszenie wszystkich), udział zdalny, głos na piśmie, tryb obiegowy, jawność, większość bezwzględna; § 6 regulamin RN | § 5 uchylony; § 7 — odpowiednio do KR |
| art. 223–226 | biegły rewident wyznaczany przez sąd rejestrowy na żądanie wspólników reprezentujących co najmniej 1/10 kapitału zakładowego (art. 223) | |

Uchwały RN: KSH nie przewiduje zaskarżania uchwał RN w trybie art. 249–252 (dotyczą uchwał wspólników); wadliwość uchwały RN oceniana jest na zasadach ogólnych (powództwo o ustalenie — KPC art. 189). Brzmienie i orzecznictwo — przed opinią.

---

## WORKFLOW

1. Ustal typ spółki i treść umowy (co jest dyspozytywne — art. 37 § 1, art. 121).
2. Rozdziel prowadzenie spraw od reprezentacji.
3. Pobierz z ELI brzmienie wskazanych przepisów; przy sp.k. — także przepis sp.j. stosowany przez art. 103.
4. Odpowiedzialność wobec wierzyciela: art. 22 § 2 → 31 → 32 (sp.j.); 111–113, 104 § 4, 118 § 2 (komandytariusz).
5. Spory wewnętrzne: art. 47, 30 § 2, 63, 66; terminy — art. 57 § 2, 64 § 2.
6. RN sp. z o.o.: obowiązkowość (art. 213 § 2), niepołączalność (art. 214), zakres (219, 220 + umowa).

## QUALITY GATE

- [ ] Brzmienie każdego powołanego przepisu pobrane z ELI (nie z kwalifikatora)?
- [ ] Odróżniono art. 21¹–21¹⁶ (grupa spółek) od art. 212–219 (kontrola wspólnika, RN)?
- [ ] Czy rozwiązanie z S.A. (art. 383) nie zostało przeniesione na sp. z o.o.?
- [ ] Odpowiedzialność komandytariusza: suma komandytowa, wkład wniesiony, zwroty (art. 111–113)?
- [ ] Umowa spółki przeczytana — postanowienia modyfikujące przepisy dyspozytywne?

## OUTPUT

1. Stan faktyczny i typ spółki; 2. Podstawa (przepis + brzmienie z ELI); 3. Stosunki wewnętrzne / zewnętrzne;
4. Odpowiedzialność i kolejność egzekucji; 5. Terminy; 6. Ryzyka i rekomendacja.

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Typy spółek, odpowiedzialność zarządu (art. 299), przekształcenia | `mod-KSH-spolki-handlowe` |
| Zarząd i zgromadzenie wspólników sp. z o.o. | `mod-KSH-organy-spolki-zoo` |
| Klauzula wykonalności przeciw wspólnikowi, egzekucja | `mod-KPC-egzekucja-windykacja` |
| Umowa spółki, uchwały | `analizator-umow-v1`, `pisma-procesowe-v3` |
| Restrukturyzacja / upadłość spółki | moduły `mod-PrRestr-*`, `mod-PrUpad-*` |
| Orzecznictwo | `orzeczenia-sadowe-v2` |
