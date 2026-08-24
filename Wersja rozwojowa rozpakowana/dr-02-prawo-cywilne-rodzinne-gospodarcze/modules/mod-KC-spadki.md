# mod-KC-spadki

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Wersja:** 2.0 | **Data weryfikacji online:** 2026-06-05, rozbudowane 2026-07-19
**Źródło weryfikacji:** KC Księga IV (art. 922–1088) — Dz.U. 2025 poz. 1071 t.j. ze zm.
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## FAZA 0 — INTAKE

```
□ Czy jest testament? → ustal ważność, formę, treść
□ Data śmierci spadkodawcy → termin do przyjęcia/odrzucenia spadku!
□ Krąg spadkobierców ustawowych (grupy kolejności)
□ Czy są małoletni lub osoby pod opieką w kręgu spadkobierców?
□ Wartość majątku i skład — nieruchomości, rachunki, długi spadkowe?
□ Czy złożono już oświadczenie o przyjęciu / odrzuceniu?
□ Czy jest roszczenie o zachowek?
□ Czy istnieje ryzyko BRAKU jakichkolwiek spadkobierców ustawowych
  (wszystkie kręgi puste) — patrz sekcja "Brak spadkobierców" niżej
□ Czy sprawa ma ELEMENT TRANSGRANICZNY (majątek/miejsce pobytu w innym
  kraju UE) — patrz sekcja "Spadki transgraniczne" niżej
```

---

## DZIEDZICZENIE USTAWOWE — KOLEJNOŚĆ GRUP (art. 931–940 KC)

> ⚠️ Weryfikuj aktualne brzmienie przepisów w ISAP.

```
GRUPA I:    Dzieci + małżonek (w równych częściach; małżonek min. ¼)
GRUPA II:   Rodzice + rodzeństwo + zstępni rodzeństwa (gdy brak dzieci)
GRUPA III:  Dziadkowie i ich zstępni (gdy brak grup I–II)
GRUPA IV:   Pasierbowie (dzieci małżonka) — gdy brak krewnych
SKARBNICZA: Gmina ostatniego miejsca zamieszkania lub Skarb Państwa

Małżonek wyłączony ze spadku: orzeczenie o separacji / wniosek
  o orzeczenie separacji przed śmiercią / wina za rozkład pożycia (art. 940 KC)
```

---

## FORMY TESTAMENTU — KWALIFIKATOR WAŻNOŚCI

| Forma | Wymogi | Uwagi |
|---|---|---|
| Własnoręczny (holograficzny) | W całości ręcznie pisany + podpisany + data | Najczęstszy; ryzyko nieważności przy maszynopisie |
| Notarialny | Akt notarialny | Najsilniejszy — trudno podważyć |
| Allograficzny | Oświadczenie wobec organu / urzędnika | Ograniczone zastosowanie |
| Szczególne (ustny, podróżny) | Tylko przy szczególnych okolicznościach | Ważność ograniczona w czasie |

```
NIEWAŻNOŚĆ TESTAMENTU:
  → Spisany przez inną osobę (nie odręcznie przez spadkodawcę)
  → Brak podpisu
  → Sporządzony w warunkach wyłączających świadome / swobodne powzięcie decyzji
  → Przy udziale osoby, na rzecz której jest przeznaczony (testament allograficzny)
```

---

## PRZYJĘCIE / ODRZUCENIE SPADKU — TERMINY

```
Termin: 6 miesięcy od dowiedzenia się o tytule powołania (art. 1015 §1 KC)
  → Brak oświadczenia w terminie = przyjęcie z dobrodziejstwem inwentarza
  → Wyjątek: przed 2015 r. = proste przyjęcie (brak oświadczenia)

FORMY OŚWIADCZENIA:
  □ Proste przyjęcie — pełna odpowiedzialność za długi spadkowe
  □ Z dobrodziejstwem inwentarza (ograniczona odpowiedzialność do wartości czynnej)
  □ Odrzucenie — wyłączenie ze spadku (traktowany jakby nie dożył)

⚠️ Odrzucenie w imieniu małoletniego wymaga zgody sądu opiekuńczego!
Złóż wniosek PRZED upływem terminu 6 miesięcy — sąd ma czas na rozpoznanie.
```

---

## 🔀 PODZIAŁ MODUŁU (2026-08-21, ZASADA 13 — flaga F-105)

Moduł osiągnął **1036 linii** i przekroczył próg 1000 — rósł iteracyjnie od 2026-07-19
przez kilkanaście transz i przeszedł przez granicę niezauważenie.

| Część | Plik | Zakres |
|---|---|---|
| 1 (ten plik, indeksator) | `mod-KC-spadki.md` | FAZA 0/INTAKE, dziedziczenie ustawowe (931-940), formy testamentu, przyjęcie/odrzucenie spadku, zmiany od 15.11.2023, ochrona spadkobiercy (1029), opłaty sądowe, QUALITY GATE/OUTPUT/STRATEGIA |
| 2 | `mod-KC-spadki-zachowek-dzial-rozrzadzenia.md` | zachowek (991-1011), dział spadku (1035-1046 KC + 680-689 KPC), zapis zwykły i windykacyjny, polecenie, wykonawca testamentu, wydziedziczenie, niegodność dziedziczenia |
| 3 | `mod-KC-spadki-dlugi-umowy-transgraniczne.md` | odpowiedzialność za długi (1030-1034³), umowy o spadek i zrzeczenie (1047-1057), gmina/Skarb Państwa (935), spadki transgraniczne i EPS, gospodarstwa rolne (Tytuł X), spis inwentarza (637-641 KPC) |

⚠️ **Uwaga o kryterium cięcia:** ZASADA 13 nakazuje dzielić wg rozdziałów aktu, ale sekcje
tego modułu były dopisywane w kolejności ZGŁOSZEŃ, nie w systematyce Księgi IV KC. Wierne
odwzorowanie Tytułów I-X wymagałoby PRZESTAWIENIA treści, co naruszyłoby zasadę „podział
czysto strukturalny, bez redagowania". Wybrano więc cięcia CIĄGŁE po istniejących granicach
sekcji, pogrupowane tematycznie tak blisko systematyki KC, jak pozwala zastany układ.

⭐ Nazwa tego pliku pozostaje NIEZMIENIONA — odesłania zewnętrzne nie wymagały edycji.
## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Pismo: wniosek o stwierdzenie nabycia spadku, dział | `pisma-procesowe-v3` |
| Orzecznictwo SN — spadki | `orzeczenia-sadowe-v2` |
| Umowy w spadku (np. dożywocie) | `analizator-umow-v1` |
| Wycena majątku, dowody | `analizator-dowodow-v3` |
| Gmina jako spadkobierca ostateczny (art. 935 KC) — aspekt samorządowy | DR-08 (`mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa`) |
| Nieruchomości rolne — ograniczenia obrotu (kontekst dla dziedziczenia gospodarstw rolnych) | `mod-ustawa-lesna-lowiecka-ochrona-przyrody.md` (DR-09) |
| Podatek od spadków i darowizn | DR-06 (`mod-ustawa-PCC-i-podatek-spadkow-darowizn`) |

---

## ŹRÓDŁA ONLINE

- KC: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001071
- SN: https://www.sn.pl

---

## ⚡ ZMIANY OD 15.11.2023 — KLUCZOWE

**Podstawa:** Dz.U. 2023 poz. 1615 (wejście w życie 15.11.2023)

### 1. Zawężenie III kręgu spadkowego (art. 934 KC)

```
PRZED 15.11.2023: Dziadkowie + ich zstępni (dowolnie dalecy)
PO 15.11.2023: Dziadkowie + ich dzieci (wujostwo) + wnuki dziadków (kuzyni I°)
WYŁĄCZENI od 15.11.2023: cioteczne/stryjeczne wnuki i dalej (kuzyni II° i dalsi)
```

### 2. Niegodność dziedziczenia — rozszerzona do 5 przesłanek (art. 928 §1 KC)

```
Pkt 1–3: bez zmian (klasyczne — umyślne przestępstwo, podrobienie testamentu, przeszkoda)
Pkt 4 (NOWY): Uporczywe niewykonywanie sądowo/umownie ustalonego obowiązku
               alimentacyjnego lub obowiązku pieczy wobec spadkodawcy
Pkt 5 (NOWY): Porzucenie małoletniego lub osoby niesamodzielnej przez rodzica/opiekuna
```

### 3. Odrzucenie spadku w imieniu małoletniego (art. 1015 §1¹ i §1² KC — NOWE)

```
DO zachowania terminu 6 miesięcy wystarczy:
  → złożenie WNIOSKU do sądu o odebranie oświadczenia
  (nie trzeba, by sąd zdążył odebrać przed upływem 6 m-cy)

Gdy złożenie wymaga ZEZWOLENIA SĄDU (małoletni):
  → termin 6 miesięcy ZAWIESZA SIĘ na czas postępowania o zezwolenie
  → Złóż wniosek o zezwolenie PRZED upływem terminu!
```

---

## ⭐⭐ OCHRONA SPADKOBIERCY — ROSZCZENIE O WYDANIE SPADKU (art. 1029
KC) — dodano 2026-08-12, na żądanie użytkownika — dotąd CAŁKOWICIE
nieobecne

```
⭐⭐⭐ ISTOTA (art. 1029 §1, dosłowny TEKST): "Spadkobierca MOŻE
  żądać, AŻEBY osoba, KTÓRA włada SPADKIEM jako spadkobierca, LECZ
  spadkobiercą NIE jest, wydała MU spadek. TO SAMO dotyczy
  poszczególnych PRZEDMIOTÓW należących do SPADKU" — ⭐ ROSZCZENIE
  WINDYKACYJNE przeciwko "RZEKOMEMU spadkobiercy" (osobie, KTÓRA
  PRZEKONANA jest O swoim TYTULE do spadkobrania, ALE nim
  FAKTYCZNIE nie jest)

⭐⭐ MECHANIZM ROZLICZEŃ (art. 1029 §2): DO roszczeń O
  wynagrodzenie ZA korzystanie Z przedmiotów SPADKU, zwrot
  POŻYTKÓW/ich wartości, NAPRAWIENIE szkody Z powodu ZUŻYCIA/
  pogorszenia/utraty, ORAZ roszczeń O zwrot NAKŁADÓW — STOSUJE się
  ODPOWIEDNIO przepisy O roszczeniach MIĘDZY właścicielem a
  SAMOISTNYM posiadaczem rzeczy (⭐ CAŁY aparat prawny Z prawa
  rzeczowego, ANALOGICZNY do ZWYKŁEJ windykacji)

⭐ SZCZEGÓLNY przypadek (art. 1029 §3): PRZEPISY te STOSUJE się
  ODPOWIEDNIO, GDY żąda WYDANIA swego MAJĄTKU osoba, CO do KTÓREJ
  ZOSTAŁO uchylone orzeczenie O uznaniu jej ZA zmarłą — ⭐ RZADKI,
  ALE CIEKAWY scenariusz: OSOBA uznana ZA zmarłą "WRACA" (JEJ
  uznanie za ZMARŁĄ zostaje UCHYLONE), a JEJ majątek W międzyczasie
  TRAFIŁ do "spadkobierców" — MOŻE żądać ZWROTU NA tej samej
  podstawie

⭐⭐ KTO MOŻE wystąpić: charakter ROSZCZENIA jest DZIEDZICZNY —
  MOŻE Z nim WYSTĄPIĆ spadkobierca SPADKOBIERCY rzeczywistego
  (JEŚLI pierwotny UPRAWNIONY zmarł), OSOBA która nabyła SPADEK na
  podstawie UMOWY zbycia spadku, WIERZYCIEL, który spadek/udział
  WZIĄŁ w ZASTAW — PRZY kilku/wszystkich SPADKOBIERCACH — mogą
  wystąpić RAZEM przeciwko RZEKOMEMU spadkobiercy

⭐⭐⭐ WAŻNE OGRANICZENIE (uchwała SN Z 25.07.2019 R., III CZP 12/19):
  przepis NIE ZNAJDUJE zastosowania, JEŻELI władający SKŁADNIKIEM
  spadku WYWODZI swój TYTUŁ prawny WYŁĄCZNIE z CZYNNOŚCI prawnej
  (np. DAROWIZNA, zasiedzenie), A NIE ZE spadkobrania — ⭐ TA SAMA
  uchwała ROZSTRZYGNĘŁA CIEKAWY przypadek Z praktyki: OSOBA
  legitymująca SIĘ stwierdzeniem NABYCIA spadku ROZPORZĄDZIŁA
  prawem NALEŻĄCYM do spadku NA rzecz osoby TRZECIEJ — PÓŹNIEJ
  okazało SIĘ, że NIE była rzeczywistym SPADKOBIERCĄ (RZECZYWISTYM
  spadkobiercą było DZIECKO spadkodawcy, W chwili OTWARCIA spadku
  już POCZĘTE — nasciturus — KTÓRE urodziło SIĘ żywe) — SN uznał, że
  OSOBA trzecia NIE nabyła TEGO prawa (⭐ ILUSTRUJE interakcję Z
  art. 1028 KC — ochrona OSÓB trzecich działających W zaufaniu do
  postanowienia O stwierdzeniu nabycia SPADKU, TEMAT POWIĄZANY, NIE
  rozwinięty W tej transzy)

⭐ PROCEDURA: pozew O wydanie spadku — SPADKOBIERCA musi UDOWODNIĆ
  swój TYTUŁ (NAJPEWNIEJ przez PRZEDSTAWIENIE stwierdzenia nabycia
  spadku), OPISAĆ przedmioty SPADKOWE objęte pozwem, ORAZ wykazać,
  że SPADKODAWCA w chwili ŚMIERCI miał NAD nimi władztwo

Potwierdzone w 7+ zgodnych źródeł, w tym BEZPOŚREDNIO dosłowny
tekst art. 1029 (lexlege.pl, arslege.pl [aktualny t.j. Dz.U. 2025 poz. 1071],
przepisy.gofin.pl, standardyprawa.pl [×2, Z cytowanym
orzecznictwem]), ORAZ bezpośrednio uchwała SN III CZP 12/19,
kancelaria-praga.pl [maj 2026, NAJŚWIEŻSZE], kancelariaszkil.pl.
```

---

## OPŁATY SĄDOWE — STWIERDZENIE NABYCIA SPADKU

> ⚠️ Weryfikuj aktualne opłaty w KSCU (Dz.U. 2025 poz. 1228) w ISAP.

```
Wniosek o stwierdzenie nabycia spadku: 100 zł (KSCU — weryfikuj)
Dział spadku (sądowy): opłata od wartości majątku
  Zgodny wniosek podziału: 300 zł
  Sporny: 1000 zł
  (weryfikuj aktualne kwoty w KSCU w ISAP)
```


---

## QUALITY GATE

- [ ] Aktualny tekst t.j. aktu zweryfikowany w ISAP?
- [ ] Stan prawny właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Każda przesłanka ma przypisany dowód?
- [ ] Termin nie upłynął?
- [ ] Właściwy organ / sąd wskazany?
- [ ] Ryzyka formalne i dowodowe ocenione?
- [ ] Brzmienie przepisów pobrane ze źródeł, nie z pamięci modelu?

## OUTPUT

Wynik pracy modułu:
1. Stan faktyczny;
2. Stan prawny i źródła (Dz.U. z ISAP);
3. Kwalifikacja trybu i właściwość;
4. Terminy (obliczone, z datami granicznymi);
5. Przesłanki (spełnione / wątpliwe / niespełnione);
6. Matryca dowodowa (teza → dowód → siła → luka);
7. Zarzuty i kontrargumenty;
8. Analiza ryzyk;
9. Strategia (wariant podstawowy + ewentualny);
10. Rekomendacja + kolejne kroki;
11. Kontrola ISAP/temporalności.

---

## STRATEGIA

### Perspektywa spadkobiercy / zainteresowanego

1. Ustal termin 6 miesięcy na oświadczenie — policz od daty faktycznego dowiedzenia się.
2. Sprawdź długi spadkowe PRZED przyjęciem — „z dobrodziejstwem inwentarza" chroni.
3. Odrzucenie w imieniu małoletniego: złóż wniosek o zezwolenie sądu ZANIM upłynie 6 miesięcy.
4. Zachowek: sprawdź darowizny za życia spadkodawcy (wchodzą do substratu).
5. Termin na zachowek: 5 lat od ogłoszenia testamentu — pilnuj.

### Ryzyka

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Upływ terminu 6 miesięcy | Przyjęcie z dobrodziejstwem inwentarza z mocy prawa | Aktywne złożenie oświadczenia w terminie |
| Długi przewyższające aktywa | Przyjęcie proste = odpowiedzialność całym majątkiem | Zawsze z dobrodziejstwem inwentarza gdy niepewne |
| Nieważny testament | Brak wymagań formy / zdolności do czynności | Analiza przez prawnika przed wszczęciem postępowania |
| Zaginięcie testamentu | Testament nie znaleziony | Wniosek do sądu o przeszukanie akt; notariusze (CRRN) |
| Pominięcie przy zachowku | Rozliczenie darowizn z przeszłości | Pełna analiza darowizn za życia spadkodawcy |

---

## CHANGELOG

**2.0 (2026-07-19):** Rozbudowa modułu na wyraźne żądanie użytkownika po
audycie pokrycia prawa spadkowego, który wykazał, że rdzeń (dziedziczenie
ustawowe/testamentowe, zachowek, dział spadku) był solidny, ale 8
instytucji było CAŁKOWICIE nieobecnych w całym systemie. Zweryfikowano
online i dodano: zapis zwykły i zapis windykacyjny (z kluczowym
rozróżnieniem skutku obligacyjnego vs rzeczowego), polecenie testamentowe,
wykonawca testamentu, wydziedziczenie (z WYRAŹNYM rozróżnieniem od
niegodności dziedziczenia — różne źródło: oświadczenie woli vs orzeczenie
sądu), pełne opracowanie odpowiedzialności za długi spadkowe (dwa okresy,
solidarność do działu spadku), umowy dotyczące spadku — zrzeczenie się
dziedziczenia (z kluczowym ograniczeniem: niemożność zawarcia z gminą/
Skarbem Państwa), oraz — jako BEZPOŚREDNIĄ odpowiedź na pytanie o
sytuację "gdy nie ma nikogo, kto mógłby dziedziczyć" — pełny mechanizm
dziedziczenia przez gminę/Skarb Państwa jako spadkobierców OSTATECZNYCH
(art. 935 KC), w tym: dziedziczenie PRZYMUSOWE (brak możliwości
odrzucenia spadku ustawowego), automatyczne dobrodziejstwo inwentarza,
kontekst historyczny (reforma 2003) i odnotowane, NIEWPROWADZONE jeszcze
prace legislacyjne nad odpowiedzialnością gmin za długi spadkowe.
Dodano też DWIE sekcje świadomie oznaczone jako PUNKT STARTOWY, nie
pełne opracowanie (spadki transgraniczne/Europejskie Poświadczenie
Spadkowe, dziedziczenie gospodarstw rolnych, spis inwentarza —
procedura) — zgodnie z ZASADA 13, bez fabrykowania pewności tam, gdzie
weryfikacja nie była wystarczająco głęboka w tej sesji.

**1.0 (2026-06-05):** Wersja pierwotna — dziedziczenie ustawowe, formy
testamentu, przyjęcie/odrzucenie spadku, zachowek, dział spadku, zmiany
od 15.11.2023, opłaty sądowe.
