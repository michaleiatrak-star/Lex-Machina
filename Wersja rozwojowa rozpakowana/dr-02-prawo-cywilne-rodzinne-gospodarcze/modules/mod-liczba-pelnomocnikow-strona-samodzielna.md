# mod-liczba-pelnomocnikow-strona-samodzielna

**Akt:** KPC — t.j. Dz.U. 2026 poz. 468 (zm. po t.j.: 2026/473 i 2026/830 od 8.07.2026; 2026/1003 od 28.10.2026; 2026/1046 od 5.11.2026 — art. 47 § 2 pkt 1 lit. d; 2026/1296 od 6.11.2026).
**Inne akty:** KPK — t.j. Dz.U. 2026 poz. 490 | Prawo o adwokaturze (PrAdw) — t.j. Dz.U. 2024 poz. 1564 (zm. 2025/1172; 2026/370; 2026/846; **2026/1290 od 17.10.2026 — art. 77 ust. 3, 5, 6**, część przepisów od 1.01.2027) | ustawa o radcach prawnych (URP) — t.j. Dz.U. 2024 poz. 499 (zm. 2025/1172; 2026/370; **2026/731 od 18.06.2026 — art. 35¹ ust. 5**; 2026/846). Przepisy o aplikantach czytaj w brzmieniu po tych nowelizacjach — t.j. ich nie zawiera.
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1): `isap_tekst` albo `https://api.sejm.gov.pl/eli/acts/DU/2026/468/text.pdf` (KPK `.../DU/2026/490/...`, PrAdw `.../DU/2024/1564/...`, URP `.../DU/2024/499/...`) kanałem hosta; zmiany po t.j. — ELI, „Nowelizacje po tekście jednolitym”.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-13.

Powiązane: skład sądu `mod-sklad-sadu-liczba-sedziow`; koszty i pełnomocnik z urzędu — `pisma-procesowe-v3`.

---

## FAZA 0 — INTAKE

```
□ Rodzaj postępowania: cywilne (KPC) czy karne (KPK)? Instancja (SN = przymus)?
□ Kto występuje: pełnomocnik z art. 87, substytut (art. 91 pkt 3), aplikant (PrAdw art. 77 / URP art. 35¹)?
□ Czy pełnomocnictwo jest w aktach (art. 89) albo w rejestrze dostępnym dla sądu?
□ Czy był problem na rozprawie: odmowa dopuszczenia, brak pouczenia, „limit” wskazany przez sąd?
□ Co klient chce osiągnąć: ocena prawidłowości, zarzut apelacyjny, koszty?
```

---

## 1. PEŁNOMOCNICY W KPC

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| art. 86 | strona działa osobiście lub przez pełnomocników | KPC nie ogranicza liczby pełnomocników, niezależnie od szczebla sądu |
| art. 87 § 1 | zamknięty katalog osób: adwokat, radca prawny, rzecznik patentowy (własność intelektualna), doradca restrukturyzacyjny (restrukturyzacja i upadłość), zarządca majątku/interesów, stały zleceniobiorca, współuczestnik, małżonek, rodzeństwo, zstępni, wstępni, przysposobienie | katalog wymienia osoby, nie spółki — umocuj konkretnego adwokata/radcę, nie kancelarię |
| art. 87 § 2–5 | dodatkowo: pracownik osoby prawnej/przedsiębiorcy; przedstawiciel organu pomocy społecznej lub organizacji (pochodzenie dziecka, alimenty); organizacja rolników; organizacja konsumencka | § 6 uchylony — brak dalszej kategorii |
| art. 87¹ § 1–3 | przymus adwokacko-radcowski przed SN (także czynności przed sądem niższej instancji związane z postępowaniem przed SN) | § 2 wyjątki (zwolnienie od kosztów, ustanowienie pełnomocnika, sędzia/prokurator/notariusz/profesor, dr hab. nauk prawnych itd.); to wymóg kwalifikacji, nie limit liczby |
| art. 88 | pełnomocnictwo procesowe (ogólne lub do sprawy) albo do poszczególnych czynności; § 2 pełnomocnik do doręczeń — każda osoba fizyczna | |
| art. 89 § 1 | przy pierwszej czynności — pełnomocnictwo lub wierzytelny odpis (+ odpis dla przeciwnika); profesjonalista sam uwierzytelnia; zbędne, gdy sąd sprawdzi umocowanie w rejestrze elektronicznym | § 1¹ uchylony od 1.03.2026; § 1² — forma elektroniczna: podpis kwalifikowany, zaufany albo osobisty; § 2 ustnie do protokołu; § 3 uchylony |
| art. 91 | zakres ustawowy pełnomocnictwa procesowego (pkt 1–5) | pkt 3: substytucja wyłącznie na rzecz adwokata lub radcy prawnego — aplikant nie jest substytutem; pkt 4: ugoda/zrzeczenie/uznanie, chyba że wyłączone |
| art. 94 | wypowiedzenie: skutek wobec sądu z zawiadomieniem, wobec przeciwnika z doręczeniem | § 2: adwokat/radca działa jeszcze 2 tygodnie, chyba że zwolniony |
| art. 97 | tymczasowe dopuszczenie (po wniesieniu pozwu) do **naglącej** czynności osoby niemogącej na razie przedstawić pełnomocnictwa; fakultatywne („może”), możliwe zabezpieczenie kosztów | § 2: sąd wyznacza termin na złożenie pełnomocnictwa lub zatwierdzenie; po bezskutecznym upływie pomija czynności; przeciwnik może żądać zwrotu kosztów od działającego |
| art. 98 § 3, art. 99 | koszty zastępstwa zwracane w granicach stawek i wydatków **jednego** adwokata (radca, rzecznik — art. 99) | kolejni pełnomocnicy = koszt nieodzyskiwalny od przeciwnika |
| art. 379 pkt 2, 5 | nieważność: pełnomocnik nienależycie umocowany (pkt 2); pozbawienie możności obrony (pkt 5) | zarzut apelacyjny przy błędnej odmowie dopuszczenia lub działaniu osoby spoza art. 87 |

Wielu pełnomocników: brak podziału zadań w pełnomocnictwie = każdy ma pełny zakres z art. 91.

**KPK (porównanie):** art. 77 — oskarżony może mieć jednocześnie nie więcej niż trzech obrońców. To limit dla obrońców w procesie karnym; w KPC odpowiednika brak.

---

## 2. STRONA BEZ PROFESJONALNEGO PEŁNOMOCNIKA

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| art. 5 | sąd **może** (w razie uzasadnionej potrzeby) udzielić niezbędnych pouczeń co do czynności procesowych stronie bez adwokata, radcy, rzecznika patentowego lub radcy PG RP | uprawnienie, nie obowiązek; nie obejmuje porad materialnoprawnych |
| art. 212 § 2 | przewodniczący może pouczyć i zwraca uwagę na celowość ustanowienia pełnomocnika | |
| art. 327 § 1, 4, 5 | **obowiązek** pouczenia strony niezastępowanej o wniosku o uzasadnienie i środku zaskarżenia (przy ogłoszeniu albo z wyrokiem doręczanym z urzędu); § 5 — o przymusie adwokackim, gdy obowiązuje | |
| art. 343 § 1 | wyrok zaoczny — pouczenie o środkach zaskarżenia; pozwanego także o obowiązku przedstawienia wszystkich twierdzeń i dowodów w sprzeciwie | |
| art. 357 § 2 | postanowienie z posiedzenia niejawnego — pouczenie o uzasadnieniu i zaskarżeniu (albo o ich braku) | |
| art. 117 | pełnomocnik z urzędu: § 1 strona zwolniona od kosztów; § 2 osoba fizyczna z oświadczeniem o braku środków; § 3 osoba prawna/jednostka — wykazanie braku środków | § 5: sąd uwzględnia, gdy udział pełnomocnika uzna za potrzebny (nie automatycznie); § 6: wniosek po raz pierwszy w postępowaniu kasacyjnym — co do zasady sąd I instancji |
| art. 168–169 | przywrócenie terminu przy braku winy; wniosek w tygodniu od ustania przyczyny + dokonanie czynności | § 4: po roku tylko w wypadkach wyjątkowych |

**Pułapka:** art. 502 KPC jest uchylony — nie powołuj go jako źródła obowiązku pouczenia; obowiązki pouczeń dla strony niezastępowanej wynikają z art. 327, 343, 357 § 2 (i przepisów szczególnych).

**Orzecznictwo (snapshot, sprawdź w sn.pl przed powołaniem):** pogląd, że brak lub wadliwe pouczenie nie wstrzymuje biegu terminu do zaskarżenia — droga naprawcza to art. 168. Brak sygnatury w module = nie powołuj bez ustalenia orzeczenia.

**Etyka:** zakaz kontaktowania się z reprezentowaną stroną przeciwną z pominięciem jej pełnomocnika — zbiory zasad etyki adwokackiej (NRA) i radcowskiej (KRRP); numer jednostki sprawdź w aktualnym tekście uchwały samorządu (poza ELI). Gdy przeciwnik nie ma pełnomocnika, zakaz nie ma przedmiotu, ale obowiązki lojalności zawodowej trwają.

---

## 3. APLIKANCI — ZASTĘPSTWO PATRONA (nie kolejny pełnomocnik)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| PrAdw art. 77 ust. 1 | po 6 miesiącach aplikacji aplikant adwokacki może zastępować adwokata przed sądami, organami ścigania i innymi instytucjami | wyjątki: SN, NSA, TK, Trybunał Stanu |
| PrAdw art. 77 ust. 2 | także przez rok od zakończenia aplikacji (2 lata, gdy uchwała z art. 79a wydłużyła okres z art. 79 ust. 1 pkt 4) | |
| PrAdw art. 77 ust. 3 | od 17.10.2026: aplikant **radcowski** może zastępować adwokata na takich samych zasadach jak aplikant adwokacki | wcześniej (t.j. 2024/1564) tylko w spółce adwokacko-radcowskiej i bez obrony karnej/karnoskarbowej — nie stosuj dawnego brzmienia do czynności od 17.10.2026 |
| PrAdw art. 77 ust. 5 | od 17.10.2026: aplikant adwokacki sporządza projekty pism; podpisuje pisma z wyraźnego upoważnienia adwokata | wyłączenie: apelacja oraz pisma do SN, NSA, TK i Trybunału Stanu |
| PrAdw art. 77 ust. 6 | od 17.10.2026: uprawnienia z ust. 1, 2, 4, 5 i URP art. 35¹ ust. 5 ma też osoba wpisana na listę adwokatów — do ślubowania, w granicach okresu z art. 79 ust. 1 pkt 4 lub 5 | |
| URP art. 35¹ ust. 1–2 | aplikant radcowski: te same zasady wobec radcy prawnego (6 miesięcy; rok po aplikacji, 2 lata przy uchwale z art. 37¹) | wyjątki: SN, NSA, TK, Trybunał Stanu |
| URP art. 35¹ ust. 4 | podpisywanie pism z wyraźnego upoważnienia radcy | bez apelacji, skargi kasacyjnej, skargi konstytucyjnej |
| URP art. 35¹ ust. 5 | od 18.06.2026: aplikant **adwokacki** może zastępować radcę prawnego na takich samych zasadach jak aplikant radcowski | wcześniej — tylko w spółce adwokacko-radcowskiej |

Wnioski praktyczne:
- Aplikant działa w zastępstwie patrona (podstawa: PrAdw/URP), nie jest substytutem z art. 91 pkt 3 KPC i nie zwiększa liczby pełnomocników strony.
- Zastępstwo „krzyżowe” (aplikant jednego samorządu za członka drugiego): od 18.06.2026 aplikant adwokacki za radcę (URP art. 35¹ ust. 5), od 17.10.2026 aplikant radcowski za adwokata (PrAdw art. 77 ust. 3) — na zasadach jak aplikant „własny”. Dla czynności wcześniejszych — dawne brzmienie (tylko spółka adwokacko-radcowska). Ustal datę czynności.
- Aplikant przy obecnym i działającym patronie nie ma odrębnej roli procesowej; zastępstwo zakłada działanie w miejsce patrona. Planowany czynny udział aplikanta — zgłoś upoważnienie przed posiedzeniem, nie improwizuj na sali.
- Odmowa dopuszczenia: najpierw ustal datę, czy był zastępowany patron nieobecny, czy było upoważnienie, czy minęło 6 miesięcy aplikacji, czy sąd nie jest SN/NSA. Przy pełnomocniku bez dokumentu umocowania — art. 97 (naglącość + uprawdopodobnienie umocowania). Błędna odmowa wpływająca na obronę → zarzut z art. 379 pkt 5.

**Orzecznictwo (snapshot, sprawdź w sn.pl):** SN, postanowienie z 7.02.2018, V CSK 188/17 — odmowa tymczasowego dopuszczenia mimo uprawdopodobnionego upoważnienia (faks) przy naglącej czynności jako pozbawienie możności obrony; SN III CZP 22/08 — uprawdopodobnienie umocowania kopią. Treść i tezy zweryfikuj przed powołaniem.

---

## 4. „MAKSYMALNIE DWÓCH” W SĄDZIE PRACY — CO MOGŁO BYĆ MIERZONE

Liczba pełnomocników w KPC nie jest ograniczona (pkt 1). Liczba „2” w sądzie pracy pasuje do **ławników**:

| Przepis | Kwalifikator |
|---|---|
| art. 47 § 1 | I instancja — co do zasady jeden sędzia |
| art. 47 § 2 pkt 1 | sędzia + dwóch ławników w sprawach z zakresu prawa pracy: lit. a (istnienie/treść/nawiązanie/wygaśnięcie stosunku pracy, bezskuteczność wypowiedzenia, przywrócenie do pracy i warunków, łącznie dochodzone roszczenia, odszkodowanie za wadliwe wypowiedzenie lub rozwiązanie); lit. b (równe traktowanie); lit. c (mobbing); lit. d (naruszenie dóbr osobistych — od 5.11.2026, Dz.U. 2026 poz. 1046) |
| art. 47 § 2 pkt 2 | sprawy rodzinne z ławnikami: rozwód, separacja, bezskuteczność uznania ojcostwa, rozwiązanie przysposobienia |
| art. 47 § 4 | prezes sądu może zarządzić skład trzech sędziów (zawiłość, precedens) |

Inne możliwe źródła wypowiedzi sędziego: zarządzenie porządkowe dotyczące sali (nie norma KPC), podział ról między pełnomocnikami zabierającymi głos, nieścisłość ustna. Rozstrzyga protokół rozprawy — wnioskuj o jego odczyt/odsłuch przed formułowaniem zarzutu.

---

## WORKFLOW

1. Ustal rodzaj postępowania i instancję (KPC / KPK; SN → art. 87¹).
2. Pobierz z ELI brzmienie art. 87, 89, 91, 97 KPC (i PrAdw art. 77 / URP art. 35¹ przy aplikantach).
3. Sprawdź protokół: kto był obecny, w jakim charakterze, czy złożono pełnomocnictwo/upoważnienie.
4. Oceń skutki: koszty (art. 98 § 3), nieważność (art. 379 pkt 2, 5), przywrócenie terminu (art. 168–169).
5. Orzecznictwo — tylko po weryfikacji w sn.pl / orzeczenia.ms.gov.pl.

## QUALITY GATE

- [ ] Brzmienie każdego powołanego przepisu pobrane z ELI (nie z kwalifikatora)?
- [ ] Nie powołano jednostek uchylonych (art. 502, art. 87 § 6, art. 89 § 1¹ i § 3 KPC)?
- [ ] Rozróżniono pełnomocnika, substytuta i aplikanta zastępującego patrona?
- [ ] Przy aplikancie sprawdzono 6 miesięcy, sąd (SN/NSA) i datę czynności względem nowelizacji 2026/731 i 2026/1290?
- [ ] Orzeczenia oznaczone jako zweryfikowane albo jako snapshot?

## OUTPUT

1. Stan faktyczny (kto, w jakim charakterze, na jakim posiedzeniu); 2. Podstawa (przepis + brzmienie z ELI);
3. Ocena prawidłowości; 4. Skutki (koszty, nieważność, terminy); 5. Rekomendacja (zarzut, wniosek, zmiana składu reprezentacji).

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Skład sądu, liczba sędziów | `mod-sklad-sadu-liczba-sedziow` |
| Apelacja z zarzutem nieważności, wniosek o przywrócenie terminu | `pisma-procesowe-v3` |
| Terminy procesowe | `prawo-polskie-v2/krajowe/analizator-dowodow-v3/modules/MP12-terminy.md` |
| Obrońcy w procesie karnym | DR-03 |
| Orzecznictwo | `orzeczenia-sadowe-v2` |
