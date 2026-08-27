# Indeks raportów pokrycia — audyt systemu skilli prawniczych

> ⛔ **BASELINE HISTORYCZNY — 2026-08-13, NIE STAN BIEŻĄCY.**
> Raporty w tym katalogu są migawką wejściową audytu. Po 13.08.2026 wiele
> wskazanych luk zostało naprawionych (m.in. KKW, PPSA, SUS Rozdz. 2,
> PrRestr Dział VI, PZP Dział II, część FUS i KW).
> **Bieżącym źródłem statusu jest zawsze `dr-XX/MAPA-POKRYCIA.md`**,
> następnie treść modułu i świeży odczyt prawa. Nie wolno przenosić czerwonego
> statusu z tych raportów do obecnego stanu bez sprawdzenia delty.


**Data:** 2026-08-13
**Kontekst:** raporty przygotowane jako materiał wyjściowy do planowania dalszej rozbudowy skilla `dr-03-prawo-karne-wykroczenia-egzekucja` i `dr-04-prawo-pracy-zus-swiadczenia`. Każdy raport wskazuje, które rozdziały/działy danego kodeksu są pokryte w pełni, częściowo lub wcale, wraz z rekomendowaną kolejnością uzupełniania luk.

## Pliki w tym zestawie

| Plik | Zakres |
|---|---|
| `raport-pokrycia-KW.md` | Kodeks wykroczeń — część ogólna (art. 1–48) i szczególna (rozdz. I–XIX) |
| `raport-pokrycia-KK.md` | Kodeks karny — część ogólna (art. 1–116) i szczególna (rozdz. XVI–XLIV) |
| `raport-pokrycia-KP.md` | Kodeks pracy — działy I–XV + tematy przekrojowe (ustawy powiązane) |
| `raport-pokrycia-KPW.md` | Kodeks postępowania w sprawach o wykroczenia — bloki proceduralne (mandat, nakazowy, zwykły, apelacja, koszty) |
| `raport-pokrycia-KRO.md` | Kodeks rodzinny i opiekuńczy — tytuły I–III (małżeństwo, pokrewieństwo/powinowactwo, opieka i kuratela) |
| `raport-pokrycia-KSH.md` | Kodeks spółek handlowych — tytuły I–V (przepisy ogólne, spółki osobowe, kapitałowe, łączenie/podział/przekształcanie, karne) |
| `raport-pokrycia-OP.md` | Ordynacja podatkowa — działy I–IX + działy pochodne (interpretacje, GAAR, MDR, STIR, kontrola, dowody) |
| `raport-pokrycia-PrUp-PrRestr.md` | Prawo upadłościowe (części 1–5) i Prawo restrukturyzacyjne (tytuły I–IV) |
| `raport-pokrycia-PZP.md` | Prawo zamówień publicznych — działy I–XIII (postępowanie klasyczne, sektorowe, obronne, środki ochrony prawnej, kontrola) |
| `raport-pokrycia-SUS-FUS.md` | Ustawa o systemie ubezpieczeń społecznych (13 rozdz.) i ustawa o emeryturach i rentach z FUS (9 działów) |
| `raport-pokrycia-PPSA.md` | Prawo o postępowaniu przed sądami administracyjnymi — działy I–IX (właściwość, skarga, orzeczenia, kasacja, koszty) |
| `raport-pokrycia-PrBud.md` | Prawo budowlane — rozdziały 1–10 (proces budowlany, samowola, utrzymanie obiektów, organy, karne) |
| `raport-pokrycia-KKW.md` | Kodeks karny wykonawczy — części ogólna/szczególna/wojskowa/końcowa (organy, postępowanie wykonawcze, kara pozbawienia wolności, dozór elektroniczny) |

## Jak korzystać

Każdy raport ma tę samą strukturę:
1. Tabela pokrycia z legendą 🟢 pełne/dobre · 🟡 częściowe · 🔴 śladowe/brak, z odniesieniem do konkretnego modułu skilla.
2. Sekcja podsumowująca z podziałem na kategorie pokrycia.
3. Rekomendowana kolejność uzupełniania — punkt wyjścia do zlecenia konkretnych prac rozwojowych nad skillami (np. "zbuduj moduł dla KW art. 151–166" albo "dokończ Dział III KP, art. 84–91").

## Najpilniejsze braki łącznie (cross-kodeksowo)

Jeśli potrzebne jest jedno zestawienie priorytetów niezależnie od kodeksu:

1. **KKW — dedykowany moduł istnieje, ale nie zawiera ani jednego artykułu KKW** — najniższy wynik pokrycia spośród wszystkich trzynastu zbadanych aktów; moduł to czysto generyczny szablon proceduralny, wymaga przepisania od podstaw
2. **PPSA — brak dedykowanego modułu w ogóle** — strukturalny priorytet zerowy; cała ustawa istnieje w systemie wyłącznie jako rozproszone cytaty w 11 różnych plikach opisujących coś innego
3. **KKW Oddz. 11 — warunkowe przedterminowe zwolnienie, pełna treść z art. 161 § 4** — kancelaria ma już udokumentowane doświadczenie z tą instytucją (sprawa Marka Petelskiego, ryzyko 6-miesięcznego okresu przed ponownym wnioskiem), ale ta wiedza nie trafiła do żadnego modułu jako trwała treść
4. **SUS Rozdział 2 — zasady podlegania ubezpieczeniom społecznym (art. 6–14)** — fundamentalne pytanie kwalifikacyjne w większości spraw z pogranicza prawa pracy i ubezpieczeń, obecnie zero treści
5. **PrRestr Dział VI — Układ (art. 150–179)** — jedyna centralna instytucja całej ustawy restrukturyzacyjnej, obecnie zero treści z podstawą prawną
6. **PPSA Dział III, Rozdz. 6 — uchybienie i przywrócenie terminu (art. 85–89)** — kluczowy temat obrończy przy przekroczonym terminie skargi, zero treści
7. **KKW Oddz. 10 — odroczenie i przerwa wykonania kary (art. 150–158a)** — bardzo częsty temat praktyczny (choroba, sytuacja rodzinna skazanego), zero treści
8. **Op Dział IV, Rozdz. 11 — dowody w postępowaniu podatkowym (art. 180–200)** — decyduje o wyniku zdecydowanej większości sporów podatkowych, obecnie zero treści
9. **PZP Dział II — kwalifikacja wykonawców, badanie ofert, kryteria oceny, unieważnienie (część art. 83–265)** — serce klasycznego postępowania przetargowego, największa liczbowo luka w PZP mimo dobrego pokrycia reszty aktu
10. **PPSA Dział IV, Rozdz. 1 — skarga kasacyjna do NSA (art. 173–193)** — naturalny, najczęściej używany kolejny krok po niekorzystnym wyroku WSA, zero treści
11. **KSH Tytuł III, organy sp. z o.o. (art. 201–254)** — najpopularniejsza forma spółki w praktyce, obecnie tylko fragmenty (zaskarżenie uchwał, reprezentacja); zerowa treść o kompetencjach zarządu i przebiegu zgromadzenia wspólników
12. **KKW Rozdz. VIIa — system dozoru elektronicznego (art. 43a–43zf)** — rosnące znaczenie praktyczne jako alternatywa dla pozbawienia wolności, zero treści
13. **PrRestr Tytuł II — cztery tryby restrukturyzacji (art. 210–334)** — tabela porównawcza istnieje, ale bez ani jednego numeru artykułu
14. **FUS Dział V — zasiłek pogrzebowy (art. 77–81)** — bardzo częste świadczenie, zero treści, niska pracochłonność uzupełnienia
15. **Op Dział VI — kontrola podatkowa (art. 281–292)** — pierwszy kontakt podatnika z organem w większości spraw, całkowity brak treści
16. **PPSA Dział V, Rozdz. 3, Oddz. 2 — prawo pomocy (art. 243–263)** — zwolnienie od kosztów i pełnomocnik z urzędu, praktyczny temat dla klientów o niskich dochodach
17. **PrBud Rozdział 3 — prawa i obowiązki uczestników procesu budowlanego (art. 17–27a)** — temat zadeklarowany w zakresie modułu, ale bez rzeczywistej treści
18. **KSH Tytuł IV w całości (łączenie, podział, przekształcanie, art. 491–584¹³)** — ok. 94 artykuły, kompletnie pusta luka przy rosnącym znaczeniu M&A
19. **PrUp Tytuł IV — rola i kompetencje syndyka po ogłoszeniu upadłości (art. 149–235)** — kluczowe dla doradzania wierzycielom i dłużnikom
20. **KKW Oddz. 9 i Oddz. 4 — kary dyscyplinarne oraz prawa i obowiązki skazanego (art. 101–120, 142–149)** — oba tematy zadeklarowane w zakresie modułu, ale bez rzeczywistej treści
21. **FUS Rozdz. VII, Rozdz. 2 — waloryzacja świadczeń (art. 88–94)** — temat pojawiający się w praktyce co roku, obecnie zero treści
22. **PrBud Rozdział 8 — organy administracji architektoniczno-budowlanej i nadzoru budowlanego (art. 80–89c)** — kompetencje PINB/WINB jako samodzielny temat
23. **KPW postępowanie zwykłe / rozprawa (art. 66–92)** — całkowity brak treści proceduralnej dla każdej sprawy wykroczeniowej, która nie kończy się na sprzeciwie/mandacie
24. **KSH Tytuł II — spółka jawna i komandytowa (art. 22–66, 102–124)** — najpopularniejsze typy spółek osobowych, obecnie zredukowane do jednego zdania o odpowiedzialności
25. **FUS Dział III, Rozdz. 2 — renta rodzinna (art. 65–74)** — temat zadeklarowany w zakresie modułu, ale bez rzeczywistej treści
26. **Op Dział V — czynności sprawdzające (art. 272–280)** — najczęstsza, najmniej sformalizowana forma weryfikacji deklaracji, zero treści
27. **PZP Dział IV — szczególne instrumenty (umowa ramowa, DSZ, konkurs, partnerstwo innowacyjne, art. 311–361)** — praktycznie nieobecne, tylko nazwy wymienione
28. **KW art. 151–166** (szkodnictwo leśne/polne) — największa ilościowa luka w części materialnej KW
29. **KP Dział III art. 84–91** (ochrona wynagrodzenia, potrącenia) — wysoka częstość praktyczna, zero treści
30. **KPW apelacja jako instytucja (art. 103–109)** — sam termin jest znany, ale brak podstaw zaskarżenia i zakresu kognicji SO
31. **KK rozdz. XXI art. 173–176, 179–180** (przestępstwa komunikacyjne poza 177/178a)
32. **KW część ogólna (art. 1–48)** — brak systematycznego modułu wpływa na jakość kwalifikacji we wszystkich sprawach wykroczeniowych
33. **KP Dział XIV art. 291 §2 i 292–295** (przedawnienie roszczeń pracodawcy) — jeden z najbardziej komentowanych, a najsłabiej opracowanych fragmentów KP
34. **KRO art. 87–91** (obowiązki wzajemne rodziców i dzieci, zarząd majątkiem dziecka) — jedyna realna luka w poza tym bardzo dobrze opracowanym akcie

## Uwagi o skrajnościach pokrycia

**Najsłabszy wynik ze wszystkich trzynastu zbadanych aktów — KKW.** Jedyny przypadek, gdzie dedykowany moduł nie zawiera ani jednego konkretnego artykułu badanego aktu — to czysto generyczny szablon proceduralny (matryca dowodowa, typowe zarzuty, strategia), identyczny mógłby dotyczyć dowolnej sprawy administracyjno-sądowej. Cały system operuje na trzech pojedynczych artykułach (159, 161, 182a) cytowanych przy okazji zupełnie innych tematów (KK, prawo drogowe). Nawet praktyczna wiedza wypracowana w konkretnej sprawie kancelaryjnej (art. 161 § 4 KKW, ryzyko 6-miesięcznego okresu przed ponownym wnioskiem o warunkowe zwolnienie) nie trafiła z powrotem do żadnego modułu jako trwała treść.

**Akt bez żadnego dedykowanego modułu — PPSA.** Cała ustawa (11 działów, ok. 320 artykułów) nie ma ani jednego pliku sobie poświęconego — istnieje wyłącznie jako rozproszone cytaty w modułach opisujących przede wszystkim co innego. To wciąż lepsza sytuacja niż KKW, ponieważ te rozproszone cytaty są rzeczywiste i częściowo dają dobry obraz wąskiego wycinka (kwalifikacja skargi).

**Najsłabiej pokryty akt względem swojego rozmiaru (przy istniejącym, merytorycznym module) — KSH.** Kodeks liczy ok. 600 artykułów w 5 tytułach, a system operuje realnie na ok. 14 unikalnych przepisach, skoncentrowanych niemal wyłącznie wokół art. 299.

**Akt bez żadnego numeru artykułu mimo istniejącej treści opisowej — Prawo restrukturyzacyjne.** Cała ustawa (ponad 400 artykułów, 4 tryby restrukturyzacji) jest reprezentowana wyłącznie przez jedną tabelę porównawczą bez ani jednego numeru artykułu.

**Jedyny akt z własną, wewnętrzną samooceną pokrycia — Op.** Mapa centralna zawiera notatkę "mapa pokrycia 🟢 4→9/18". Pokryte fragmenty są rzeczywiście dobrze opracowane — problem leży w rozmiarze nieobjętych obszarów.

**Drugi najlepiej pokryty akt — PZP.** Osiem modułów dają ok. 60 unikalnych, wprost cytowanych artykułów. Dobrze opracowane są zarówno wejście do sporu, jak i środki ochrony prawnej, ale sam środek klasycznego postępowania przetargowego pozostaje słabo pokryty.

**Model "dobra procedura, słaba materia" — powtarza się przy PrUp/PrRestr, SUS/FUS i częściowo PPSA.** We wszystkich trzech przypadkach dobrze opracowany jest wąski wycinek proceduralny, natomiast szeroka materialna podstawa instytucji pozostaje w większości nieopisana.

**Najbardziej aktywnie, iteracyjnie rozbudowywany akt — Prawo budowlane.** Moduł nosi wyraźne ślady systematycznej rozbudowy na konkretne żądania użytkownika, co daje głębsze i bardziej aktualne pokrycie kluczowych praktycznie tematów niż w większości innych aktów pozakodeksowych.

**Najlepiej pokryty akt — KRO.** Główny moduł oraz trzy moduły satelickie dają niemal kompletne pokrycie najczęściej używanych instytucji. Realne luki są nieliczne i wąskie.
