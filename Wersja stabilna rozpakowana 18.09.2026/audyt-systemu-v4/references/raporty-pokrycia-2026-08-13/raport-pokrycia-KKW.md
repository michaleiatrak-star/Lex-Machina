# Raport pokrycia — Kodeks karny wykonawczy (KKW)

**Data analizy:** 2026-08-13
**Zakres skilla:** `dr-03-prawo-karne-wykroczenia-egzekucja`
**Stan prawny bazowy w modułach:** Dz.U. 2025 poz. 911 t.j. (obwieszczenie 11.06.2025)
**Metodologia:** inwentaryzacja treści rzeczywiście obecnej w jedynym module formalnie dedykowanym KKW (`mod-KKW-kodeks-karny-wykonawczy.md`, plik wewnętrznie nazwany `mod-BZ-sluzba-wiezienna-wykonawcze.md`) oraz punktowych odniesień w pięciu innych modułach DR-03. Struktura oficjalna aktu: 4 części (ogólna, szczególna, wojskowa, końcowa), ok. 22 rozdziały, art. 1–259+ (Rozdział X regulujący samą karę pozbawienia wolności ma 13 oddziałów, art. 67–168a). Każdy przepis wymaga weryfikacji ISAP przed użyciem w piśmie (HARD GATE), niezależnie od statusu w tym raporcie.

**Uwaga wstępna — najsłabszy wynik ze wszystkich trzynastu dotąd zbadanych aktów.** To jedyny przypadek w całej serii raportów, gdzie dedykowany moduł **nie zawiera ani jednego konkretnego artykułu badanego aktu**. Plik `mod-KKW-kodeks-karny-wykonawczy.md` jest w całości genericznym szablonem proceduralnym (matryca dowodowa, typowe zarzuty, kontrargumenty organu, strategia) — treść nadająca się do zastosowania w niemal dowolnej sprawie administracyjno-sądowej, bez jakiejkolwiek specyficznej wiedzy o samym KKW. Nawet nazwa wewnętrzna pliku (`mod-BZ-sluzba-wiezienna-wykonawcze.md`, widoczna w pierwszej linii treści) różni się od nazwy pliku na dysku — sygnał możliwego niedokończonego przeniesienia lub konsolidacji modułu.

---

## 1. Co faktycznie jest w "module KKW"

Moduł składa się z 12 sekcji, z których żadna nie odnosi się do konkretnego artykułu KKW:

| Sekcja | Zawartość | Specyficzność dla KKW |
|---|---|---|
| 1. Akty i źródła | Lista trzech aktów do sprawdzenia (ustawa o SW, KKW, akty wykonawcze) | Zerowa — sama lista nazw, bez treści |
| 2. Zakres spraw | 8 punktów ogólnikowych (skargi skazanych, warunki odbywania kary, decyzje dyrektora, odpowiedzialność dyscyplinarna, przepustki, widzenia, opieka zdrowotna, dowody) | Zerowa — to nazwy kategorii spraw, nie ich regulacja |
| 3. Intake | 7 uniwersalnych pytań (kto jest stroną, jaki akt kwestionowany, terminy, właściwość, rodzaj sprawy, dokumenty, ryzyko prekluzji) | Zerowa — identyczny szablon nadawałby się do sprawy podatkowej czy budowlanej |
| 4. Mapa proceduralna | Ogólny schemat blokowy (zdarzenie → kwalifikacja → właściwość → środek zwykły → nadzwyczajny → kontrola sądowa → wykonanie → odpowiedzialność) | Zerowa — brak wskazania KONKRETNYCH środków zwykłych/nadzwyczajnych przewidzianych w KKW |
| 5. Warunki skuteczności | 12-punktowa uniwersalna checklist formalna (termin, właściwość, legitymacja, podpis, opłata...) | Zerowa |
| 6. Matryca dowodowa | Pusta tabela + lista typowych dowodów ogólnych (decyzje, nagrania, zeznania) | Zerowa |
| 7. Zarzuty typowe | 13 uniwersalnych zarzutów administracyjnych (naruszenie właściwości, brak uzasadnienia, nieproporcjonalność...) | Zerowa |
| 8. Kontrargumenty organu | 9 uniwersalnych kontrargumentów (brak legitymacji, uznaniowość, tajemnica ustawowa...) | Zerowa |
| 9. Strategia | 7-punktowy uniwersalny plan działania | Zerowa |
| 10. Orzecznictwo | Instrukcja "szukaj w CBOSA, nie wpisuj fikcyjnych sygnatur" | Zerowa |
| 11. Ryzyka | 9 uniwersalnych kategorii ryzyka procesowego | Zerowa |
| 12. Quality gate | Odesłania do plików `shared/` | Zerowa |

**Wniosek: moduł nie zawiera żadnej wiedzy merytorycznej o KKW** — ani jednego numeru artykułu, ani jednej konkretnej instytucji tego kodeksu (np. czym różni się odroczenie wykonania kary od przerwy, jakie są przesłanki warunkowego przedterminowego zwolnienia, jak przebiega postępowanie dyscyplinarne wobec skazanego, czym jest system dozoru elektronicznego). To uniwersalny "silnik" strategii procesowej, opatrzony tytułem sugerującym pokrycie KKW, którego w rzeczywistości nie dostarcza.

---

## 2. Punktowe wzmianki KKW w innych modułach DR-03

Poza generycznym modułem, cały system operuje na trzech pojedynczych artykułach KKW, cytowanych przy okazji zupełnie innych tematów:

| Artykuł | Kontekst | Moduł źródłowy |
|---|---|---|
| **Art. 159 KKW** | Obowiązkowy dozór kuratora przy warunkowym zwolnieniu wobec młodocianego, recydywisty (art. 64 §2 KK) lub sprawcy działającego w warunkach art. 65 KK | `mod-KK-art69-84-warunkowe-zawieszenie-zwolnienie.md` — wzmiankowany przy okazji instytucji z KK, nie jako opracowanie samego KKW |
| **Art. 161 KKW** | Krąg podmiotów uprawnionych do złożenia wniosku o warunkowe przedterminowe zwolnienie (skazany, obrońca, dyrektor ZK, prokurator, kurator) oraz właściwość miejscowa sądu | tenże moduł — jedno zdanie w kontekście procedury zwolnienia warunkowego z KK |
| **Art. 182a KKW** | Blokada alkoholowa — wniosek możliwy po odbyciu połowy okresu orzeczonego zakazu prowadzenia pojazdów | `mod-KK-KPK-framework-szczegolowy.md` oraz `mod-PRD-nowe-przestepstwa-drogowe-BRD.md` — wzmiankowany przy okazji przestępstw drogowych, nie jako element systematycznego opracowania KKW |

To potwierdza wcześniejszy wniosek z pamięci: w kancelarii istniała już świadomość znaczenia **art. 161 § 4 KKW** przy analizie sprawy o warunkowe przedterminowe zwolnienie (Marek Petelski) — konkretnie ryzyka 6-miesięcznego okresu przed ponownym złożeniem wniosku po odmowie. Ten praktycznie istotny szczegół (§ 4, nie tylko sam art. 161) nie jest jednak odzwierciedlony w żadnym z modułów DR-03 jako trwała treść — funkcjonuje wyłącznie jako wiedza wypracowana ad hoc w konkretnej sprawie, niewpisana z powrotem do żadnego modułu.

---

## 3. Pokrycie wg oficjalnej struktury KKW — ocena zbiorcza

Ponieważ nie ma żadnej rzeczywistej treści przypisanej do konkretnych jednostek redakcyjnych KKW (poza trzema pojedynczymi artykułami wymienionymi wyżej), tabela poniżej przedstawia **całą strukturę aktu jako w zasadzie jednolicie nieopisaną**, z zaznaczeniem tylko tych trzech wyjątków.

| Część / Rozdział | Materia | Art. (orientacyjnie) | Status |
|---|---|---|---|
| Ogólna, Rozdz. I–III | Zakres obowiązywania, organy postępowania wykonawczego, skazany (prawa i obowiązki ogólne) | 1–8b | 🔴 Brak |
| Ogólna, Rozdz. IV | Postępowanie wykonawcze (wykonywanie orzeczeń, postępowanie przed sądem, postępowanie egzekucyjne) | 9–31 | 🔴 Brak |
| Ogólna, Rozdz. V | Nadzór penitencjarny | 32–36 | 🔴 Brak |
| Ogólna, Rozdz. VI | Zatarcie skazania (w kontekście wykonawczym) | 37 | 🔴 Brak |
| Ogólna, Rozdz. VII | Uczestnictwo społeczeństwa, pomoc w readaptacji, Fundusz Pomocy Pokrzywdzonym | 38–43 | 🔴 Brak (Fundusz Pomocy Pokrzywdzonym ma za to odrębny, dobry moduł w DR-03 — ale oparty na rozporządzeniu wykonawczym, nie na art. 38–43 KKW) |
| Ogólna, Rozdz. VIIa | **System dozoru elektronicznego** (przesłanki, tryb orzekania, obowiązki skazanego) | 43a–43zf | 🔴 Brak — istotna, popularna alternatywa dla kary pozbawienia wolności, zero treści |
| Szczególna, Rozdz. IX (kara ograniczenia wolności) | — | ok. 53–66 | 🔴 Brak |
| Szczególna, Rozdz. X, Oddz. 1–2 | Cele wykonywania kary pozbawienia wolności, zakłady karne (typy, klasyfikacja) | 67–78 | 🔴 Brak |
| Szczególna, Rozdz. X, Oddz. 3 | Wykonywanie kary i jej indywidualizacja | 79–100 | 🔴 Brak |
| Szczególna, Rozdz. X, Oddz. 4 | **Prawa i obowiązki skazanego** (widzenia, korespondencja, opieka zdrowotna) | 101–120 | 🔴 Brak — mimo że moduł ogólny deklaruje "opiekę zdrowotną" i "widzenia" jako temat objęty, zero rzeczywistej treści z tego oddziału |
| Szczególna, Rozdz. X, Oddz. 5–7 | Zatrudnienie, nauczanie, działalność kulturalno-oświatowa | 121–136a | 🔴 Brak |
| Szczególna, Rozdz. X, Oddz. 8 | Nagrody i ulgi | 137–141a | 🔴 Brak |
| Szczególna, Rozdz. X, Oddz. 9 | **Kary dyscyplinarne** | 142–149 | 🔴 Brak — mimo że moduł ogólny deklaruje "odpowiedzialność dyscyplinarną" jako temat objęty, zero treści o rodzajach kar, trybie ich nakładania, zaskarżeniu |
| Szczególna, Rozdz. X, Oddz. 10 | Odroczenie i przerwa wykonania kary pozbawienia wolności | 150–158a | 🔴 Brak — praktycznie bardzo istotny temat (różnica między odroczeniem a przerwą, przesłanki, tryb), zero treści |
| Szczególna, Rozdz. X, Oddz. 11 | **Warunkowe przedterminowe zwolnienie** | 159–163 | 🟡 Śladowo | tylko art. 159 (obowiązkowy dozór) i art. 161 (krąg uprawnionych, właściwość) wspomniane przy okazji KK — bez systematycznego opracowania całego oddziału (przesłanki materialne z art. 78 KK są za to opisane w module KK, ale procedura z KKW pozostaje fragmentaryczna) |
| Szczególna, Rozdz. X, Oddz. 12–13 | Zwalnianie skazanych z zakładów karnych, informowanie o opuszczeniu zakładu | 164–168a | 🔴 Brak |
| Szczególna, Rozdz. XI | Prawa i obowiązki kuratora sądowego, dozór, warunkowe umorzenie, warunkowe zawieszenie (procedura wykonawcza) | ok. 169–182 | 🟡 Śladowo | tylko art. 182a (blokada alkoholowa) wspomniany punktowo |
| Szczególna, Rozdz. XII | Środki karne, środki kompensacyjne, przepadek (wykonanie) | ok. 183–201 | 🔴 Brak |
| Szczególna, dalsze rozdziały (środki zabezpieczające, kary porządkowe, koszty postępowania wykonawczego, tymczasowe aresztowanie — wykonanie) | — | ok. 202–223 | 🔴 Brak |
| Szczególna, Rozdz. XVa | Umieszczanie tymczasowo aresztowanych/skazanych w wydzielonych pomieszczeniach | — | 🔴 Brak |
| Wojskowa | Wykonywanie kar wobec żołnierzy | — | 🔴 Brak (niski priorytet dla praktyki cywilnej) |
| Końcowa | Przepisy przejściowe i końcowe | 243–259 | — (techniczne, niski priorytet) |

Legenda: 🟡 śladowo (pojedyncze artykuły przy okazji innych tematów) · 🔴 brak

---

## 4. Podsumowanie i ocena krytyczna

### Co jest mocną stroną
Praktycznie nic w samym module KKW. Jedyną wartością są trzy pojedyncze, poprawnie umiejscowione odniesienia (art. 159, 161, 182a) w modułach dotyczących innych aktów — ale to skutek uboczny opracowywania KK i prawa drogowego, nie świadomego pokrycia KKW.

### Co jest krytyczną luką — praktycznie wszystko
- **System dozoru elektronicznego (Rozdz. VIIa)** — coraz popularniejsza alternatywa dla pozbawienia wolności, zero treści o przesłankach, trybie orzekania, obowiązkach skazanego.
- **Odroczenie i przerwa wykonania kary (Oddz. 10)** — praktycznie bardzo częsty temat (choroba skazanego, sytuacja rodzinna), zero treści o różnicy między tymi dwiema instytucjami i przesłankach każdej z nich.
- **Warunkowe przedterminowe zwolnienie (Oddz. 11)** — mimo że to jeden z trzech tematów z jakimikolwiek wzmiankami, opracowanie jest fragmentaryczne: brak np. treści art. 161 § 4 (termin przed ponownym wnioskiem po odmowie), która — jak wynika z wcześniejszej praktyki kancelaryjnej — była kluczowa w konkretnej sprawie, ale nigdy nie trafiła do żadnego modułu jako trwała wiedza.
- **Kary dyscyplinarne wobec skazanych (Oddz. 9)** — moduł ogólny deklaruje ten temat w "zakresie spraw", ale nie dostarcza żadnej treści: jakie kary przewiduje KKW, jaki jest tryb ich nakładania, jak wygląda zaskarżenie.
- **Prawa i obowiązki skazanego (Oddz. 4)** — widzenia, korespondencja, opieka zdrowotna są wymienione w "zakresie spraw" modułu, ale bez żadnej treści proceduralnej czy materialnej.
- **Cały postępowanie wykonawcze sensu stricto (Rozdz. IV) — wykonywanie orzeczeń, postępowanie przed sądem penitencjarnym, postępowanie egzekucyjne** — fundament proceduralny całego kodeksu, zero treści.

### Porównanie z innymi zbadanymi aktami
KKW jest przypadkiem skrajniejszym niż wszystko dotąd zbadane. PPSA nie miało dedykowanego modułu, ale miało przynajmniej rozproszone, konkretne cytaty w innych plikach (ok. 20 artykułów) oraz jedną dobrze opracowaną wyspę (kwalifikacja skargi). Prawo restrukturyzacyjne miało dedykowany moduł bez żadnego numeru artykułu, ale przynajmniej trafną, praktycznie użyteczną tabelę porównawczą czterech trybów. **KKW nie ma nawet tego** — dedykowany moduł to czysty, ogólny szablon proceduralny bez śladu wiedzy o samym akcie, a rozproszone wzmianki w innych plikach to zaledwie trzy pojedyncze artykuły. To najniższy wynik pokrycia spośród wszystkich trzynastu zbadanych dotąd aktów, tak pod względem głębokości, jak i pod względem stosunku pokrycia do rozmiaru/znaczenia aktu.

---

## 5. Rekomendowana kolejność uzupełniania

1. **Przepisanie modułu od podstaw z rzeczywistą treścią KKW** — obecny plik nie nadaje się do rozbudowy punktowej, bo nie ma w nim żadnego punktu zaczepienia merytorycznego; wymaga budowy od zera
2. **Oddz. 11 — warunkowe przedterminowe zwolnienie (art. 159–163), pełna treść z § 4 art. 161** — najwyższy priorytet praktyczny; kancelaria ma już udokumentowane doświadczenie z tą instytucją (sprawa Marka Petelskiego) i ryzyko 6-miesięcznego okresu przed ponownym wnioskiem powinno trafić do trwałej wiedzy modułu
3. **Oddz. 10 — odroczenie i przerwa wykonania kary pozbawienia wolności (art. 150–158a)** — częsty temat praktyczny, wymaga rozróżnienia dwóch instytucji
4. **Rozdz. VIIa — system dozoru elektronicznego (art. 43a–43zf)** — rosnące znaczenie praktyczne jako alternatywa dla pozbawienia wolności
5. **Oddz. 9 — kary dyscyplinarne wobec skazanych (art. 142–149)** — temat zadeklarowany w zakresie modułu, ale bez treści
6. **Oddz. 4 — prawa i obowiązki skazanego (art. 101–120)** — widzenia, korespondencja, opieka zdrowotna, zadeklarowane w zakresie modułu, ale bez treści
7. **Rozdz. IV — postępowanie wykonawcze (art. 9–31)** — fundament proceduralny, konieczny do prawidłowego prowadzenia jakiejkolwiek sprawy penitencjarnej
