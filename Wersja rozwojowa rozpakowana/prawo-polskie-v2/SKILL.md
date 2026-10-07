---
name: prawo-polskie-v2
version: "6.46"
type: domain-router
status: production
compatibility: "live_web_lookup, cross_skill_file_read"
description: "Fasada routingu prawa polskiego: wybiera jeden z DR-01–DR-16 i przekazuje sprawę do właściwego skilla dziedzinowego; nie zawiera treści prawa materialnego."
dependencies:
  requires:
    - shared
  # 2026-09-27e: jawna zależność (każdy skill systemu korzysta z `shared`); pole czytane przy imporcie z marketplace
changelog: |
  Wersja bieżąca: 6.46 (2026-10-07f): ROUTING-MAP — procedury i pełne korpusy PrUp (Dz.U. 2026 poz. 913) i PrRestr (Dz.U. 2026 poz. 533) z PR #85; wiersz zmian po t.j. (2026/1206 od 11.01.2027, 2026/176 od 18.02.2027); licencja doradcy restrukturyzacyjnego 2022/1007 potwierdzona w ELI jako najnowszy t.j.
  Poprzednia: 6.45 (2026-10-06): nowelizacje po t.j. (ELI 2026-10-06): PRD/u.k.p./drogi publiczne/transport drogowy — Dz.U. 2025 poz. 1676, 1734, 1843; Dz.U. 2026 poz. 180, 982; nowa ustawa o zdrowiu zwierząt Dz.U. 2025 poz. 1795
  Pełna historia: references/CHANGELOG.md (ZASADA 15).
---

> **Universal runtime:** przed wykonaniem zastosuj kanoniczny `shared/UNIVERSAL-RUNTIME-ADAPTER.md` z osobnego skilla `shared`. Lokalna sekcja adaptera poniżej jedynie go doprecyzowuje.


## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

Ta sekcja zmienia wyłącznie sposób wykonania operacji technicznych. Routing DR-01–DR-16 i decyzja o nieduplikowaniu treści prawnej pozostają bez zmian.

1. `view prawo-polskie-v2/ROUTING-MAP.md` oznacza świeży odczyt lokalnego `ROUTING-MAP.md` tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.
2. `view <skill>/...` oznacza aktywację/odczyt wskazanego osobnego skilla przez mechanizm bieżącego hosta. Nie kopiuj DR-skilli ani `shared` do tej paczki.
3. `view shared/<plik>` oznacza świeży odczyt z kanonicznego skilla `shared`; brak obowiązkowego zasobu = fail-closed, nie substytucja pamięcią modelu.
4. `web_search` / `web_fetch` oznaczają świeżą weryfikację online przez dostępne narzędzie hosta. Dla `ROUTING-MAP.md` zachowaj istniejący reżim weryfikacji numerów Dz.U. i statusów.
5. Jeżeli ten skill zostanie wywołany bez `prawny-router-v3`, zachowaj istniejącą regułę: najpierw aktywuj router.

**Zasada nadrzędna:** instrukcje zrozumiałe i wykonalne w hoście wykonuj bez konwersji; adapter dotyczy tylko granicy runtime.

# prawo-polskie-v2 — Fasada Routera DR-01 do DR-16

## ⛔ STAŁE ZASADY WORKFLOW (odsyłacz — NIE duplikować)

> Sprawdzono 2026-07-06, zaktualizowano 2026-09-23: zasady zgłoszone przez
> użytkownika ("router→v3 pierwszy, przepisy przez ELI (nigdy z pamięci),
> HYBRID-VAL przed .docx, Karne: +kwalifikator") JUŻ są kanonicznie skodyfikowane w
> `prawny-router-v3/SKILL.md`, sekcja "PREFERENCJE UŻYTKOWNIKA (aktywne
> globalnie)" jako UP-1 do UP-5 — nie duplikuj ich treści tutaj.

Ten plik (`prawo-polskie-v2`) jest wywoływany DOPIERO z poziomu
`prawny-router-v3` (KROK 1B) — a więc UP-1..UP-5 są już aktywne, zanim
routing w tym pliku w ogóle się zacznie. Jedyne dodane tu wzmocnienie:
jeśli ten plik zostanie kiedykolwiek wywołany bezpośrednio, z pominięciem
routera (np. błąd w innym skillu) — potraktuj to jako naruszenie UP-1 i
najpierw wczytaj `prawny-router-v3/SKILL.md` zanim przejdziesz dalej.

## ⛔ DECYZJA ZAPISANA — ZAKRES `shared/PRAWO-HARDGATE.md` W TYM SKILLU

*(zapisana 2026-08-23g, flaga F-123 w `audyt-systemu-v4`. Powód zapisania, nie
tylko podjęcia: pomiar `grep -rl PRAWO-HARDGATE` wykazał tu ZERO odesłań i
zgłosił to jako lukę. Bez utrwalonej decyzji ten sam wynik wracałby jako nowe
zgłoszenie przy każdym kolejnym audycie — a każdy fałszywy alarm kosztuje tyle
co błąd przeoczony, patrz ZASADA 14 w `audyt-systemu-v4/SKILL.md`.)*

**Rozstrzygnięcie jest rozdzielne dla dwóch plików tego skilla:**

| Plik | Czy podlega PRAWO-HARDGATE | Uzasadnienie |
|---|---|---|
| `SKILL.md` (ten plik) | **NIE** | Czysta fasada routingu: kieruje do DR-skilla, nie twierdzi niczego o treści prawa — nie podaje przesłanek, terminów ani skutków. Bramka przed cytowaniem przepisu odpala się w DR-skillu, czyli w miejscu, w którym przepis faktycznie pada. Wpisanie jej także tutaj byłoby duplikacją bez zysku (CHECKLIST-DEDUP). |
| `ROUTING-MAP.md` | **TAK, w zakresie ograniczonym** | ⚠️ Ten plik **nie jest** czystą fasadą: nosi numery Dz.U., roczniki, pozycje i statusy tekstów jednolitych. To są weryfikowalne twierdzenia o stanie prawnym, a błędny numer propaguje się dalej w każdą sprawę, która przez ten routing przejdzie (klasa błędu F-82: numer należący do innego aktu o pokrewnym tytule). |

**Reżim dla `ROUTING-MAP.md`** — nie pełna bramka cytowania, lecz reżim mapy:
`audyt-systemu-v4` FAZA 3 (A–D) + ZASADA 8 (weryfikuj NUMER niezależnie od
zgodności NAZWY) + REGUŁA 3 HARDGATE-AUDYT (synchronizacja z lokalnymi
`MAPA-AKTOW.md` i mapą centralną Dz.U.). Numer wpisany do tego pliku bez
weryfikacji w Rzędzie 1/2 jest naruszeniem tego reżimu.

⛔ **Wyzwalacz zmiany decyzji.** Jeżeli do któregokolwiek pliku tego skilla
trafi kiedykolwiek twierdzenie o TREŚCI prawa — przesłanka, termin, właściwość
sądu, skutek procesowy, cokolwiek poza nazwą aktu, jego numerem i wskazaniem
modułu — decyzja wygasa z automatu i `view shared/PRAWO-HARDGATE.md`
staje się obowiązkowe. Zakres „tylko routing" jest warunkiem tej decyzji, nie
jej trwałą cechą.

---

## Zasada

```
prawny-router-v3
    ↓ KROK 1B (identyfikacja dziedziny)
prawo-polskie-v2 (ten plik — routing)
    ↓
DR-skill właściwy (np. dr-04-Prawo-Pracy-ZUS-Swiadczenia)
    ↓
moduł aktu prawnego (np. modules/mod-KP-kodeks-pracy.md)
```

Nie ładuj wszystkich DR-skills naraz. Wczytaj JEDEN pasujący.

## Centralna mapa routingu

```
view prawo-polskie-v2/ROUTING-MAP.md
```

## Routing błyskawiczny

| Fraza / temat sprawy | DR-skill |
|---|---|
| Konstytucja, TK, Trybunał Konstytucyjny, ustrój, skarga konstytucyjna, referendum, Rzecznik Praw Obywatelskich, mandat posła, mandat senatora, stan wyjątkowy, stan wojenny, stan klęski żywiołowej, partia polityczna, Sąd Najwyższy, KRS, Sejm, Senat, Prezydent RP, weto, podpisanie ustawy, immunitet, wotum nieufności, inicjatywa ustawodawcza, źródła prawa, hierarchia aktów prawnych, umowa międzynarodowa a ustawa, przepisy przejściowe, specustawa, niedziałanie prawa wstecz, Rada Ministrów, uchwała Sejmu, wybory do Sejmu, wybory parlamentarne, wybory prezydenckie, protest wyborczy, ustrój sądów, sędzia Sądu Najwyższego | `dr-01-Ustroj-Konstytucyjny-i-Zrodla-Prawa` |
| Umowa, odszkodowanie, zadośćuczynienie, KC, spadek, zachowek, testament, dziedziczenie, alimenty, rozwód, separacja, władza rodzicielska, kontakty z dzieckiem, najem, czynsz, eksmisja, lokator, rękojmia, reklamacja, konsument, kredyt, frankowy, deweloper, wspólnota mieszkaniowa, nieruchomość, służebność, zasiedzenie, dobra osobiste, spółka, upadłość, windykacja, windykator, dług, zapłata, fundacja rodzinna, księga wieczysta, chwilówka, parabank, kaucja, wyprowadzka, przedawnienie roszczenia, faktura, pies, pogryzienie, zwierzę, spółka cywilna, spółka jawna, hipoteka, ubezpieczyciel, sąsiad | `dr-02-Prawo-Cywilne-Rodzinne-Gospodarcze` |
| Przestępstwo, KK, KPK, wykroczenie, mandat, stalking, przemoc, cyberprzestępstwo, pobicie, kradzież, oszustwo, nietrzeźwy, po alkoholu, prokurator, śledztwo, akt oskarżenia, pokrzywdzony, areszt, niebieska karta, groźby karalne, komornik, egzekucja komornicza, zniesławienie, znieważenie, punkty karne, prawo jazdy, oszukany, przywłaszczenie, sprzeniewierzenie, fałszerstwo, podrobienie podpisu, zatarcie skazania, Krajowy Rejestr Karny, wypadek drogowy, narkotyki, marihuana, zajęcie rachunku, podrobić podpis, sfałszować, pijany kierowca, KKS, karny skarbowy | `dr-03-Prawo-Karne-Wykroczenia-Egzekucja` |
| Wypowiedzenie, KP, umowa o pracę, stosunek pracy, pracodawca, zwolnienie dyscyplinarne, mobbing, nadgodziny, urlop, sąd pracy, wypadek przy pracy, zakaz konkurencji, umowa zlecenie, ZUS, zasiłek, L4, zwolnienie lekarskie, macierzyński, emerytura, renta, KRUS, PFRON, pomoc społeczna, dyskryminacja płacowa, choroba zawodowa, świadectwo pracy, czas pracy, 800 plus, świadczenie wychowawcze, PIP, inspekcja pracy, odprawa, bezrobotny, wynagrodzenie | `dr-04-Prawo-Pracy-ZUS-Swiadczenia` |
| KPA, decyzja urzędu, decyzja administracyjna, SKO, WSA, NSA, bezczynność, przewlekłość, informacja publiczna, cudzoziemcy, karta pobytu, egzekucja admin., stwierdzenie nieważności decyzji, petycja, skarga kasacyjna do NSA, Samorządowe kolegium odwoławcze, postępowanie administracyjne, interes prawny, zaświadczenie, Rzecznik Praw Dziecka, zezwolenie na pracę, cudzoziemiec, ponaglenie, organ administracji | `dr-05-Prawo-Administracyjne-Sadowoadministracyjne` |
| PIT, VAT, CIT, podatki, podatek, urząd skarbowy, kontrola podatkowa, interpretacja podatkowa, ryczałt, KAS, akcyza, cło, finanse publiczne, podatek od nieruchomości, koszty uzyskania przychodu, opłata skarbowa, PCC, KSeF, biała lista, zeznanie roczne | `dr-06-Podatki-Finanse-Publiczne-AML` |
| Przetarg, KIO, PZP, zamówienie, fundusze UE, notariat, zamówienie publiczne, partnerstwo publiczno-prywatne, PPP, akt notarialny, zamawiający, wykonawca w przetargu, najkorzystniejsza oferta, wadium, tryb podstawowy, koncesja na roboty, NIK, Najwyższa Izba Kontroli, RIO, regionalna izba obrachunkowa, dyscyplina finansów publicznych, dotacja unijna, dofinansowanie z funduszy europejskich | `dr-07-Zamowienia-Publiczne-Fundusze-UE` |
| Gmina, powiat, JST, MPZP, miejscowy plan, warunki zabudowy, uchwała, radny, wójt, burmistrz, prawo lokalne, samorząd, referendum lokalne, odwołanie burmistrza, odwołanie wójta, strefa płatnego parkowania, rada gminy, renta planistyczna, odszkodowanie planistyczne, plan miejscowy, sołectwo, sołtys, budżet obywatelski, mienie komunalne, akt prawa miejscowego, dziennik urzędowy województwa, prezydent miasta, starosta, sejmik | `dr-08-Samorzad-Terytorialny-Prawo-Lokalne` |
| Budowa, pozwolenie na budowę, samowola, PINB, nadzór budowlany, środowisko, odpady, energia, fotowoltaika, transport, szkody łowieckie, łowiectwo, obwód łowiecki, wywłaszczenie, ZRID, wycinka drzew, farma wiatrowa, decyzja środowiskowa, charakterystyka energetyczna, system kaucyjny, pozwolenie na użytkowanie, odbiór budynku, usunięcie drzewa, URE, taryfa za prąd, polowanie, myśliwy, koło łowieckie, droga publiczna, pozwolenie wodnoprawne, studnia, prawo geologiczne, kopalina, konserwator zabytków, zabytek, geodeta, rozgraniczenie, Natura 2000, BDO, nadzór budowlany | `dr-09-Budownictwo-Srodowisko-Energia-Transport` |
| Lekarz, szpital, pacjent, błąd medyczny, NFZ, apteka, farmacja, żywność, rolnictwo, rolnik, szkoła, uczeń, sport, impreza masowa, sanepid, szpital psychiatryczny, suplement diety, GIS, matura, egzamin maturalny, uczelnia, student, hodowla, weterynarz, wyroby medyczne, pielęgniarka, położna, telemedycyna, e-recepta, recepta, dokumentacja medyczna, lekarz rodzinny | `dr-10-Zdrowie-Farmacja-Zywnosc-Rolnictwo` |
| RODO, dane osobowe, ochrona danych, przetwarzanie danych, UODO, IOD, inspektor ochrony danych, wyciek danych, naruszenie ochrony danych, rejestr czynności przetwarzania, powierzenie przetwarzania, klauzula informacyjna, monitoring wizyjny, nagrywanie rozmów, wizerunek, cookies, spam, newsletter, profilowanie, KSC, NIS2, AI Act, cyberbezpieczeństwo, IP, prawo autorskie, znak towarowy, patent, wizerunek dziecka, publikacja wizerunku, ujawnienie danych, udostępnienie danych, lista dłużników z nazwiskami, podpis kwalifikowany, podpis zaufany, Digital Services Act, DSA, platforma internetowa, dostęp do danych, usunięcie danych, monitoruje, kamera, nagrywa, telemarketing, plagiat, skopiowany artykuł, autor utworu, CSIRT, incydent, atak hakerski, kryptowaluty, MiCA | `dr-11-Cyfrowe-Cyber-AI-Dane-IP` |
| Sąd, prokuratura, adwokat, radca, notariusz, koszty sądowe, opłata sądowa, biegły sądowy, mediacja, taksa notarialna, izba adwokacka, pełnomocnik z urzędu, opłata od pozwu, sąd polubowny, arbitraż, zapis na sąd polubowny, opłata egzekucyjna, komornik sądowy, wybór komornika, kurator sądowy, referendarz, asesor sądowy, rzecznik patentowy, doradca restrukturyzacyjny, odpowiedzialność dyscyplinarna, sędzia, koszty zastępstwa procesowego, radca prawny | `dr-12-Sadownictwo-Prokuratura-Zawody-Prawnicze` |
| Policja, ABW, służby specjalne, informacje niejawne, wojsko, obrona, Straż Graniczna, pozwolenie na broń, poświadczenie bezpieczeństwa, retencja danych, CBA, Centralne Biuro Antykorupcyjne, straż pożarna, OSP, strażak, legitymowanie, przeszukanie, paralizator, Żandarmeria, ćwiczenia wojskowe, kwalifikacja wojskowa | `dr-13-Sluzby-Bezpieczenstwo-Informacje-Niejawne` |
| Prawo UE, TSUE, EKPC, ETPC, prawo międzynarodowe, prawo prywatne międzynarodowe, prawo właściwe, europejski tytuł egzekucyjny, egzekucja za granicą, konwencja genewska, uchodźca, Karta praw podstawowych, pytanie prejudycjalne, Europejski Trybunał Praw Człowieka, rzetelny proces, Konwencja, jurysdykcja, różnych narodowości, zagraniczny wyrok, europejski nakaz zapłaty, konwencja wiedeńska, immunitet dyplomatyczny, dyplomata, mały ruch graniczny, swoboda przepływu, dyrektywa, TFUE, ONZ, Pakt Praw, arbitraż inwestycyjny, BIT, NATO, za granicą | `dr-14-Prawo-UE-Miedzynarodowe-Prawa-Czlowieka` |
| Compliance, ISO, AML instytucjonalny, zamówienia obronne, sygnaliści, sygnalista, ISO 27001, ISO 37001, ISO 37301, ISO 42001, ustawa antykorupcyjna, DORA, ryzyko ICT, kodeks etyki, konflikt interesów, audyt wewnętrzny, whistleblowing, ład korporacyjny, dobre praktyki, nadużycia, szkolenia compliance | `dr-15-Compliance-ISO-Governance-Audyt` |
| Pismo procesowe, strategia, narzędzia, kalkulatory, e-doręczenia, portal informacyjny, odtworzenie akt, kalkulator, odsetki ustawowe, sprostowanie prasowe, prawo prasowe, wzór pisma, paszport, prasa, redakcja, kompletność pozwu, zameldowanie, meldunek, obywatelstwo, arbitraż sportowy, prawo do sądu, strategia procesowa, archiwizacja dokumentacji | `dr-16-Pisma-Strategia-Dowody-Orzecznictwo` |

## Jak wywołać DR-skill

```
view dr-[XX]-[Nazwa]/SKILL.md
# następnie:
view dr-[XX]-[Nazwa]/modules/mod-[akt].md
```

## Weryfikacja
- Teksty aktów: kanon E-1…E-5 (`shared/HIERARCHIA-ZRODEL.md`) — E-1 api.sejm.gov.pl/eli | eli.gov.pl; E-2 isap.sejm.gov.pl jako adres dla człowieka; E-3 LEX/Legalis; E-4 ArsLege
- Prawo UE: eur-lex.europa.eu
- Orzeczenia: orzeczenia.ms.gov.pl | sn.pl | nsa.gov.pl

---

## Protokół integracji DR → prawo-polskie → audyt

### Przepływ danych (pull)

```
DR-XX/MAPA-AKTOW.md         ← źródło prawdy dla danej dziedziny
        ↓  pull przy audycie DZU
ROUTING-MAP.md               ← centralna mapa wszystkich 16 DR
        ↓  porównanie (FAZA 3 audytu)
audyt-systemu-v4/references/mapa_dzu_*.md  ← rejestr Dz.U.
```

### Jak zaktualizować po zmianie w DR-skill

1. Wczytaj zmieniony `dr-XX/MAPA-AKTOW.md`
2. Porównaj z odpowiednią sekcją `ROUTING-MAP.md`
3. Uzupełnij rozbieżności — nowe akty, zmienione t.j., nowe statusy
4. Zaktualizuj liczniki w tabeli TABELA STATUSU
5. Wpis z vacatio legis → dodaj do sekcji MONITORING na końcu ROUTING-MAP.md
6. Wywołaj `audyt-systemu-v4` TRYB DZU — zweryfikuje `mapa_dzu_*.md`

### Akty oczekujące (MONITORING) — reguły

| Sytuacja | Akcja |
|---|---|
| Nowy Dz.U. z vacatio legis znaleziony podczas weryfikacji w ELI (RZĄD 1) | Dodaj `⏳ OCZEKUJE` do tabeli DR i do sekcji MONITORING |
| Data wejścia w życie minęła | Zmień `⏳→✅ OK`, usuń z MONITORING, zaktualizuj mapa_dzu |
| Akt uchylony przed wejściem | Status `❌`, usuń z MONITORING, odnotuj w AUDIT-JOURNAL |
| Wejście w ciągu 90 dni od daty audytu | Zmień na `⚡ WCHODZI` — priorytetowa aktualizacja modułu |

*Numer wersji: wyłącznie pole `version:` we frontmatterze — decyzja generalna
F-102(C), dwa źródła prawdy o wersji zawsze się rozjeżdżają (ta stopka niosła
„5.2" przy `version: 6.1`, rozjazd o dziewięć wersji, usunięty 2026-08-23g).*

*Ostatnia zmiana treści: 2026-08-23g — zapisana decyzja o zakresie
`shared/PRAWO-HARDGATE.md` w tym skillu (F-123). Wcześniej: 2026-07-02,
WARN-28 zamknięty — ABW/AW to nowy t.j. tej samej ustawy z 2002 r., nie
reforma; sync ROUTING-MAP.*
