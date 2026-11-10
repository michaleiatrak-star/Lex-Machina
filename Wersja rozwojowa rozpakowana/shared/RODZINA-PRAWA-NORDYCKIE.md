# RODZINA-PRAWA-NORDYCKIE — metoda dla prawa nordyckiego (NR-1…NR-6)

> **Plik kanoniczny:** `shared/RODZINA-PRAWA-NORDYCKIE.md`
> **Wersja:** 1.0 | Utworzony: 2026-11-09 — każda reguła oparta na źródle odczytanym w sesji
> (literatura ekspercka, ustawy w tekście urzędowym lub ujednoliconym); spis w §Ź na końcu.
> **Wywołuje:** `prawny-router-v3` (UP-5), gdy system prawny sprawy należy do rodziny nordyckiej
> (Dania, Finlandia, Islandia, Norwegia, Szwecja; w aplikacji także Wyspy Owcze — rejestr krajów, `family`).
> **Charakter:** ⛔ BLOKUJĄCE w ścieżce prawa nordyckiego. Uzupełnia bramki metody, nie wyłącza ich.

---

## 0. DLACZEGO OSOBNA METODA

Prawo państw nordyckich traktuje się jako odrębną rodzinę prawa: wspólne ustawodawstwo i wspólna kultura
prawnicza pozwalają uznać prawo nordyckie za „rodzinę prawa samą w sobie” [Ź-1, pkt 1]. Nie jest to
jednolity system, lecz tradycje prawne państw o wspólnych zasadach i znacznych podobieństwach w konkretnych
rozwiązaniach [Ź-2, Introduction]. Dla metody liczą się trzy cechy różniące je od prawa kontynentalnego
i od common law:

1. **Ustawa jest punktem wyjścia, ale bez kodeksu cywilnego.** Prawo prywatne leży w odrębnych ustawach;
   kodeksy z XVII–XVIII w. szybko się zestarzały i nie zastąpiono ich nowymi, więc prawo rozwijały sądy
   [Ź-2, Legal order and jurisprudence]; inicjatywy nordyckiego kodeksu cywilnego nie powiodły się [Ź-1, pkt 2].
2. **Orzecznictwo ma dużą wagę, ale nie ma stare decisis.** Wiąże ustawa; orzecznictwo nie jest odrębnym
   źródłem prawa jak w common law, tylko autorytetem, który modyfikuje ustawy i wypełnia luki [Ź-2,
   Independence and peculiarities].
3. **Pluralistyczna nauka o źródłach prawa.** Do tworzenia prawa przyczyniają się ustawodawstwo,
   praktyka, nauka prawa i materiały przygotowawcze do ustaw [Ź-2, Independence and peculiarities].

**Relacja do bramek:** CN-GATE i REM-GATE działają bez zmian. OŚ-GATE obejmuje datę wersji ustawy
i datę orzeczenia. WYJ-GATE stosuje reguły wykładni danego państwa, z wagą prac przygotowawczych (NR-3).

**Zasada źródeł:** moduł podaje metodę i to, co wynika z odczytanych źródeł. Reguły konkretnego państwa
(dostęp do sądu najwyższego, moc materiałów przygotowawczych, wersja ustawy) ustala się ze źródła tego
państwa w tej turze — także wtedy, gdy moduł je wymienia (mogły się zmienić).

---

## NR-1 — PAŃSTWO, STATUS UNIJNY I ŹRÓDŁA

```
NR-1  PAŃSTWO: [DK / FI / IS / NO / SE / FO]   STATUS: [UE / EOG (EFTA)]
      USTAWA: [akt, jednostka, wersja ujednolicona na dzień — źródło RZĘDU 1]
      PRACE PRZYGOTOWAWCZE: [dokument / ⬛ nieustalone]   ORZECZNICTWO: [sąd najwyższy, sygnatura / brak]
```

- **Najpierw państwo.** Rodzina nordycka to pięć odrębnych porządków prawnych [Ź-2, Introduction];
  ustawa jednego z nich nie jest prawem drugiego.
- **UE czy EOG.** Szwecja i Finlandia przystąpiły do UE (oświadczenie nr 28 przy przystąpieniu), Dania
  jest w UE; Norwegia i Islandia uczestniczą w integracji jako państwa EFTA w Europejskim Obszarze
  Gospodarczym [Ź-1, pkt 4] — przy prawie unijnym ustal, czy akt UE
  obowiązuje w tym państwie wprost, czy przez porozumienie EOG.
- **Tekst ustawy z czytnika urzędowego** (read_national_legislation: SE riksdagen, FI Finlex, DK
  Retsinformation, IS lagasafn); wersja ujednolicona nie zawsze ma moc urzędową — status podaje odpowiedź
  czytnika (np. Finlex: ujednolicony bez mocy, moc ma Suomen säädöskokoelma; Szwecja: moc ma SFS) [Ź-3, Ź-4].

## NR-2 — USTAWY UJEDNOLICONE W NORDEN: NIE ZAKŁADAJ TOŻSAMOŚCI

```
NR-2  USTAWA NORDYCKA: [np. umowy / sprzedaż / komis / małżeństwo / ubezpieczenia / prawo morskie]
      WERSJA KRAJOWA: [akt państwa sprawy, jednostka]   RÓŻNICE: [sprawdzone / ⬛]
```

- Współpraca legislacyjna od 1872 r. dała ustawy niemal identyczne, m.in. o wekslach (lata 80. XIX w.),
  prawie morskim (lata 90.), sprzedaży, umowach i komisie (początek XX w.), małżeństwie, umowie
  ubezpieczenia i transporcie (lata 20.), czekach (lata 30.), prawie autorskim, znakach towarowych
  i patentach (lata 60.), spółkach akcyjnych (lata 70.) [Ź-1, pkt 2]; ustawy o sprzedaży i o umowach
  wprowadzano kolejno w latach 1905–1922 i 1915–1929 [Ź-2, Legal order and jurisprudence].
- **Jednolitość słabnie.** Ustawy dawniej jednolite przeszły krajowe nowelizacje i różną wykładnię
  (np. ubezpieczenia, spółki akcyjne), a nowsze projekty — jak sprzedaż w latach 80. — mają mniejszy
  stopień jednolitości [Ź-1, pkt 2]. Dlatego: czytaj wersję państwa sprawy; brzmienia z innego państwa
  nordyckiego nie przenoś.
- **Orzecznictwo sąsiadów.** W praktyce większość orzeczeń nie odwołuje się do praktyki państw sąsiednich
  [Ź-1, pkt 3]. Orzeczenie z innego państwa nordyckiego przy ustawie wspólnej może być co najwyżej
  argumentem perswazyjnym, oznaczonym jako obce — nie podstawą.

## NR-3 — NAUKA O ŹRÓDŁACH: USTAWA, PRAKTYKA, NAUKA, PRACE PRZYGOTOWAWCZE

```
NR-3  WYKŁADNIA: [słowna / cel z prac przygotowawczych / praktyka sądu najwyższego / nauka]
      PRACE PRZYGOTOWAWCZE: [rodzaj, oznaczenie, strona — źródło urzędowe] / ⬛ nieodczytane
```

- Nauka o źródłach prawa w krajach nordyckich jest pluralistyczna: ustawodawstwo, praktyka, nauka prawa
  i materiały przygotowawcze (np. uzasadnienia projektów) razem kształtują prawo [Ź-2, Independence and
  peculiarities].
- **Materiały przygotowawcze są źródłem do odczytu, nie do przypomnienia.** Powołuj je tylko po odczycie
  z urzędowego źródła danego państwa w tej turze (oznaczenie dokumentu i miejsce); bez odczytu —
  ⚠️ [NIEWERYFIKOWANE] i bez wniosku z nich. Waga materiałów w konkretnym państwie i dziedzinie — ze źródła
  tego państwa (orzecznictwo sądu najwyższego, nauka), nie z modułu.
- **Nauka prawa** ma w tej rodzinie silną pozycję: dostarcza orzecznictwu metody stosowania prawa
  [Ź-2, Independence and peculiarities] — powołanie podręcznika lub artykułu wymaga jego odczytu.

## NR-4 — ORZECZNICTWO SĄDU NAJWYŻSZEGO: WAGA BEZ STARE DECISIS

```
NR-4  [sąd, sygnatura, data] — ROLA: [wskazówka dla stosowania prawa / rozstrzygnięcie sprawy]
      PODSTAWA ROLI: [przepis o dopuszczeniu odwołania — odczytany]   ZWIĄZANIE: brak formalnego
```

- Brak związania precedensem: orzecznictwo nie jest odrębnym źródłem prawa, ale w praktyce modyfikuje
  ustawy i wypełnia luki; ogólne koncepcje z ustaw mogą prowadzić do odejścia od wcześniejszej praktyki
  [Ź-2, Independence and peculiarities].
- **Sąd najwyższy jako sąd precedensowy — przykłady z ustaw (odczytane):**
  - **Szwecja:** Högsta domstolen udziela zezwolenia na rozpoznanie odwołania (prövningstillstånd)
    m.in., gdy ma to znaczenie dla wskazówek w stosowaniu prawa („av vikt för ledning av
    rättstillämpningen”); zezwolenie można ograniczyć do takiej kwestii (prejudikatfråga) — Rättegångsbalk
    (1942:740) 54 kap. 10 § i 11 §, tekst ujednolicony do SFS 2026:1657 [Ź-3].
  - **Finlandia:** Korkein oikeus udziela zezwolenia na odwołanie (valituslupa) m.in., gdy jest to ważne
    dla stosowania prawa w innych podobnych sprawach albo dla jednolitości orzecznictwa
    („oikeuskäytännön yhtenäisyyden vuoksi”); zezwolenie można ograniczyć do kwestii, której rozstrzygnięcie
    jest potrzebne do kierowania orzecznictwem — Oikeudenkäymiskaari 30 luku 3 § [Ź-4].
  - **Dania, Norwegia, Islandia:** analogiczną regułę ustal w ustawie o postępowaniu danego państwa w tej
    turze (w sesji tworzenia modułu nieodczytana; Lovdata blokuje automaty — wynik ⚠️ do czasu odczytu).
- Wniosek z orzeczenia sądu najwyższego formułuj jako „linia sądu najwyższego wskazuje…”, a nie „wiąże”;
  podaj sygnaturę i odczytany fragment (PRAWO-HARDGATE).

## NR-5 — BRAK KODEKSU CYWILNEGO: ZNAJDŹ WŁAŚCIWĄ USTAWĘ

- Prawo prywatne nie jest skodyfikowane w jednym kodeksie; zasady ogólne (np. zawarcie umowy) leżą
  w odrębnych ustawach, wspólnych dla państw nordyckich w części dziedzin [Ź-1, pkt 2; Ź-2]. Ustal ustawę
  właściwą dla osi sporu i jej jednostkę; nie przenoś systematyki kodeksu kontynentalnego.
- Stare kodeksy (Danske Lov 1685, Norske Lov 1687, Sveriges Rikes Lag 1734) przetrwały częściowo i są
  stosowane w połączeniu z orzecznictwem, które je czytało [Ź-2] — przepis takiego kodeksu powołuj
  z aktualną wersją i z orzeczeniami.

## NR-6 — FORMA ODPOWIEDZI I PISMA

- Odpowiedź wskazuje państwo (NR-1), ustawę i wersję, rolę orzecznictwa (NR-4) i ewentualne prace
  przygotowawcze (NR-3) — każde z oznaczeniem źródła.
- Pismo do sądu lub organu państwa nordyckiego: forma i wymogi z ustawy o postępowaniu tego państwa
  (odczytanej); z zastrzeżeniem, że przed złożeniem sprawdza je prawnik uprawniony w tej jurysdykcji.
  HYBRID-VALIDATION i ST-FINAL działają bez zmian.

---

## WYJŚCIE — BLOK NR (przed konkluzją, zwięźle)

```
NR-1 państwo/status/źródła · NR-2 ustawa wspólna a krajowa · NR-3 nauka o źródłach ·
NR-4 orzecznictwo (rola, podstawa) · NR-5 ustawa właściwa · NR-6 forma
NIEUSTALONE: [lista pozycji ⚠️ — każda obniża pewność konkluzji]
```

---

## §Ź — ŹRÓDŁA (odczytane 2026-11-09)

| Nr | Źródło | Adres |
|---|---|---|
| Ź-1 | A.K. Sperr, „Scandinavia, Harmonization of Law”, w: Max Planck Encyclopedia of European Private Law (2012), wyd. online Max-EuP 2012 (pkt 1–5) | max-eup2012.mpipriv.de/index.php/Scandinavia,_Harmonization_of_Law |
| Ź-2 | W. Brauneder, „The Scandinavian legal system”, European History Online (EGO), Leibniz-Institut für Europäische Geschichte, 2023-12-04 | ieg-ego.eu/en/threads/crossroads/legal-families/wilhelm-brauneder-the-scandinavian-legal-system |
| Ź-3 | Rättegångsbalk (1942:740), 54 kap. 10 § i 11 § (Riksdagen, tekst ujednolicony do SFS 2026:1657) | data.riksdagen.se/dokument/sfs-1942-740.text |
| Ź-4 | Oikeudenkäymiskaari (4/1734), 30 luku 3 § (Finlex, tekst ujednolicony) | finlex.fi/eli/sd/1734/4/ajantasa |

Niezweryfikowane w sesji: U. Bernitz, „What is Scandinavian Law?”, Scandinavian Studies in Law 50 (2007)
(dawny adres PDF zwraca 404, serwis wydawcy to aplikacja); tekst umowy helsińskiej z 1962 r. (norden.org
odmawia automatom — art. 2–7 i 33 przywołane za Ź-1); ustawy o postępowaniu Danii, Norwegii i Islandii.
Ź-1 udostępniono do użytku niekomercyjnego — moduł streszcza i przywołuje, nie przytacza obszernie.
Powołania z tej tabeli to adresy dla człowieka; przed użyciem w piśmie odczytaj je ponownie (PRAWO-HARDGATE).
