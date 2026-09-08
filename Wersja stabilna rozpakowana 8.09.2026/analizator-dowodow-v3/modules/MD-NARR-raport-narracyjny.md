# MD-NARR — RAPORT NARRACYJNY (format ciągłego tekstu z nawigacją)

## Cel

Wersja **szczegółowa** raportu, generowana DODATKOWO do dashboardu (nie
zamiast) na wyraźne żądanie użytkownika: jeden ciągły dokument markdown ze
spisem treści i kotwicami do sekcji. Wzorzec inspirowany raportami typu
LexAlpha: czytelny, liniowy, łatwy do przeszukania i wklejenia do innego
dokumentu, z explicit oznaczeniem statusu źródłowego każdego faktu.

**Dashboard interaktywny (MD6 FAZA 2 / KROK 4) jest wzorcowym formatem
raportu i generowany domyślnie.** MD-NARR dokłada poziom szczegółowości,
którego dashboard — z natury skondensowany — nie oferuje: pełne karty
wszystkich osób/podmiotów, ciągłą narrację prozą, płaską listę wszystkich
faktów z numeracją, sekcję "common ground" per spór, mapę dowodów do faktów
i listę braków informacyjnych z odsyłaczami.

## Kiedy uruchamiać

```
TAK, gdy użytkownik WYRAŹNIE:
  - prosi o "wersję szczegółową" / "pełny raport" / "więcej szczegółów"
  - prosi o format "do przeczytania" / "dokument" / "plik" (nie tylko widget)
  - chce przekazać analizę osobie trzeciej (np. innemu prawnikowi, klientowi
    w wersji PRAWNIK — nie mylić z raport-klienta-v1, który jest uproszczony
    dla LAIK)
  - explicite mówi "jak LexAlpha" / "format ciągłego tekstu" / "z nawigacją
    do sekcji"

ZAWSZE generuj jako DODATEK do dashboardu, nie zamiast niego:
  - jeśli dashboard już istnieje w tej rozmowie → tylko dogeneruj MD-NARR
  - jeśli dashboard jeszcze nie istnieje → wygeneruj najpierw dashboard
    (MD6 FAZA 2), potem MD-NARR

NIE generuj MD-NARR domyślnie przy każdym "raport"/"podsumowanie" —
to słowa, które domyślnie wyzwalają dashboard (C3). MD-NARR wymaga
sygnału "szczegółowo"/"dokument"/"plik"/"jak LexAlpha" (C4).
```

## Relacja do innych modułów

MD-NARR **nie** zastępuje MD1–MD6/MP1–MP9 — konsumuje ich wyniki i renderuje w innym
formacie. Uruchamiaj MD-NARR na końcu, po zakończeniu analizy modułowej (analogicznie
do FAZY 2 dashboardu w MD6), korzystając z tych samych danych (`evidence[]`,
`contradictions[]`, `coverage_data[]`, `gaps[]`, faktów z MP1, chronologii z
`chronologia-sprawy-v1` jeśli była uruchomiona).

---

## STRUKTURA DOKUMENTU

Generuj jako pojedynczy plik `.md` (skill `md` / artefakt markdown). Każda
sekcja ma nagłówek `##` (renderowany jako kotwica nawigacyjna) i krótki
identyfikator w nawiasie do odsyłaczy wewnętrznych.

```
# Raport sprawy — [sygnatura / opis sprawy]

## Spis treści
- [Snapshot](#snapshot)
- [Strony i tło relacji](#strony)
- [Relacja bazowa / ustalenia](#relacja-bazowa)
- [Chronologia zdarzeń](#chronologia)
- [Stan faktyczny — narracja](#narracja)
- [Fakty istotne — lista kontrolna](#fakty-istotne)
- [Fakty bezsporne](#fakty-bezsporne)
- [Fakty sporne](#fakty-sporne)
- [Mapa dowodów do faktów](#mapa-dowodow)
- [Fakty procesowe](#fakty-procesowe)
- [Braki informacyjne i pytania do uzupełnienia](#braki)
- [Kontrola jakości](#kontrola-jakosci)
- [Przepisy powołane w materiale](#przepisy)

## Snapshot {#snapshot}
[2-4 akapity: kto, o co, jaki jest faktyczny przedmiot sporu, jakie są
najważniejsze daty procesowe, jakie są fakty osiowe. Pisane prozą, bez
oceny — to ma czytać osoba, która nie znała sprawy.]

Źródła: [DOK-ID, …]

## Strony i tło relacji {#strony}
[Dla każdej strony/osoby/podmiotu — sekcja z polami:]

### [Imię/nazwa] — [rola]
Rola: [...]
Opis: [...]
Osoby kluczowe / umocowania: [...]
Metadane: status=[BSP|DOC|TW|SP|BR — patrz LEGENDA] | typ=[MAT|PRO|...] | rola=[KONST|MOD|NIW|...]
Źródła: [DOK-ID, …]

[Powtórz dla każdej strony, każdego pełnomocnika, każdego świadka, każdego
organu wskazanego w materiale — nie tylko dla głównych stron procesu.
Cel: każda osoba wymieniona w materiale ma swoją kartę, nawet jeśli skrótową.]

## Relacja bazowa / ustalenia {#relacja-bazowa}
[Fakty konstytutywne relacji prawnej — np. dla sprawy pracowniczej: powstanie
stosunku pracy, treść umowy, stanowisko, wynagrodzenie, urlop, rozwiązanie.
Każdy punkt z metadanymi status/typ/rola i źródłami.]

## Chronologia zdarzeń {#chronologia}
[Tabela: ID | Data | Zdarzenie | Uczestnicy | Skutek faktyczny | Źródła.
Jeśli chronologia-sprawy-v1 była uruchomiona — użyj jej wyniku bezpośrednio,
zachowując klasy pewności (BEZSPORNE/PEWNE/WYDEDUKOWANE/SPORNE) jako dodatkową
kolumnę lub adnotację przy dacie.]

## Stan faktyczny — narracja {#narracja}
[Ciągła proza, akapit per temat — łączy chronologię w opowieść czytelną dla
osoby trzeciej. Każdy akapit zakończony "Źródła: [...]". To jest sekcja, którą
najczęściej czyta odbiorca — musi być samodzielnie zrozumiała.]

## Fakty istotne — lista kontrolna {#fakty-istotne}
[F01, F02, … — każdy: Fakt / Dlaczego istotny / Metadane (status/typ/rola) /
Źródła. To jest płaska lista wszystkich faktów z numeracją, niezależnie od
tego do której sekcji należą — służy jako indeks do cytowania w piśmie.]

## Fakty bezsporne {#fakty-bezsporne}
[U01, U02, … — krótkie, jednoznaczne stwierdzenia faktów, które obie strony
przyznają lub które wynikają z dokumentów niekwestionowanych. Numeracja
osobna od F-listy — to jest "rdzeń" sprawy, który nie wymaga dowodzenia.]

## Fakty sporne {#fakty-sporne}
[DIS01, DIS02, … — dla każdego sporu:]

### DIS[NN] — [nazwa sporu]
Teza sporna: [...]
Strona sporu — [Powód/Pozwany/...]: [stanowisko + metadane + źródła]
Strona sporu — [druga strona]: [stanowisko + metadane + źródła]
Common ground: [co OBIE strony faktycznie przyznają w tej kwestii, niezależnie
od spornego elementu — to pole jest OBOWIĄZKOWE; jeśli faktycznie nie ma
żadnego punktu zgody, napisz explicit "brak common ground — spór dotyczy
również samego istnienia faktu", nie pomijaj pola]
Metadane: [...]
Źródła: [...]

## Mapa dowodów do faktów {#mapa-dowodow}
[Użyj wyniku MD4 "MAPA DOWODÓW DO FAKTÓW (evidence_map)" — F[NN] → typ dowodu
(GŁÓWNY/POŚREDNI/BRAK) + komentarz o tym czego brakuje + źródła.]

## Fakty procesowe {#fakty-procesowe}
[P01, P02, … — czysto procesowe fakty: daty pism, zobowiązań sądu, wniosków
dowodowych — odróżnione od faktów materialnoprawnych w sekcji "Fakty istotne".]

## Braki informacyjne i pytania do uzupełnienia {#braki}
[G01, G02, … — każdy: Pytanie / Dotyczy sekcji (lista odsyłaczy do innych
sekcji/ID, np. "key_facts F06–F07, disputes DIS01") / opcjonalnie: priorytet.
To jest TODO-lista dla użytkownika — co dostarczyć, żeby analiza była pełniejsza.]

## Kontrola jakości {#kontrola-jakosci}
### Potencjalne niespójności
[Lista — w tym WSZYSTKIE wykryte sprzeczności typu IDENT (MD3c) — rozbieżności
zapisu nazwisk/nazw między dokumentami, z explicit wskazaniem że wymagają
weryfikacji, nie automatycznego ujednolicenia.]
[Lista błędów dat/nazw wykrytych w MD3a KROK 0 — "w dokumencie X występuje data
Y, która z kontekstu wydaje się błędem pisarskim; przyjęto Z".]

### Najsilniejsze punkty faktowe
[Lista 3-6 faktów/przyznań, które są najmocniejszym materiałem dla użytkownika
— analogicznie do "Najsilniejsze punkty faktowe" w LexAlpha, ale z dodatkową
adnotacją PROCESOWĄ: nie tylko "co to za fakt", ale "jak go wykorzystać"
(odsyłacz do rekomendacji w MP5/MD6 jeśli dostępne).]

## Przepisy powołane w materiale {#przepisy}
[Lista przepisów, na które powołują się strony w analizowanych dokumentach —
NIE treść przepisu z pamięci. Dla każdego: akt prawny / artykuł / kontekst
powołania / status weryfikacji.

KROK 1 (zawsze, bez HARDGATE): zidentyfikuj WSZYSTKIE powołania przepisów w
materiale — to jest czysta ekstrakcja ("kto, gdzie, w jakim kontekście powołał
ten przepis"), nie wymaga weryfikacji. Wypełnij sekcję dla każdego powołania
nawet jeśli KROK 2 nie zostanie wykonany.

KROK 2 (opcjonalny, wymaga HARDGATE w tej samej odpowiedzi): jeśli użytkownik
prosi o weryfikację treści/aktualności przepisu, wykonaj
`shared/PRAWO-HARDGATE.md` i uzupełnij pole Status.

Format:
### [Nazwa ustawy] — art. [X]
Kontekst powołania: [które pismo, strona, w jakiej kwestii — np. "Pismo pozwanej
z 23.06.2025 r. opisuje pismo pracodawcy z 7.10.2024 r. jako informujące, że
ujawnione działania mogą stanowić podstawę do rozwiązania na podstawie tego
przepisu"]
Status:
  ✅ [VER: ISAP/inne, data] z pełnym oznaczeniem t.j. — TYLKO jeśli
     HARDGATE-weryfikacja została wykonana w TEJ SAMEJ odpowiedzi
  ⚠️ [NIEWERYFIKOWANE — treść przepisu wymaga weryfikacji przed użyciem w piśmie]
     — domyślny status przy samej ekstrakcji (KROK 1 bez KROK 2)

⛔ HARD GATE: nie podawaj treści/brzmienia przepisu w tej sekcji, jeśli nie
przeszedł przez procedurę `shared/PRAWO-HARDGATE.md` w tej samej odpowiedzi.
Sama lista "co zostało powołane i gdzie" (KROK 1) nie wymaga weryfikacji —
weryfikacji wymaga PODANIE TREŚCI/BRZMIENIA/NUMERU Dz.U. (KROK 2). Te dwa
kroki są rozdzielone celowo — ekstrakcja nie powinna czekać na weryfikację,
ale weryfikacja nie powinna być pominięta przy generowaniu treści przepisu.]
```

---

## LEGENDA METADANYCH (umieść na końcu dokumentu lub w spisie treści)

```
status:
  BSP = bezsporne (oba aktywne przyznanie lub fakt urzędowy niekwestionowany)
  DOC = wynika z dokumentu (bez oceny sporności)
  TW  = twierdzenie strony (bez dokumentu potwierdzającego)
  SP  = sporne (kwestionowane przez stronę przeciwną)
  BR  = brak materiału / nie przekazano

typ:
  MAT  = materialnoprawny (dotyczy meritum sprawy)
  PRO  = procesowy (dotyczy przebiegu postępowania)
  KONST/NIW/MOD = rola faktu w konstrukcji sprawy:
    KONST = konstytutywny (warunkuje istnienie/zakres zobowiązania)
    NIW   = dot. wartości/wysokości (kwoty, ekwiwalenty, odszkodowania)
    MOD   = modyfikujący (zmienia ocenę innego faktu, np. dobrowolność)

Statusy mogą się łączyć (np. "TW/SP/BR" = twierdzenie strony, sporne, materiał
nieprzekazany w pełni) — łącz myślnikiem/ukośnikiem zgodnie z konwencją powyżej.
```

---

## ZASADY WYPEŁNIANIA

```
✓ Każdy fakt/punkt MA źródło (DOK-ID + lokalizacja) — bez wyjątków.
✓ Nigdy nie scalaj faktu TW (twierdzenie) z faktem DOC (dokument) bez
  oznaczenia różnicy — jeśli pozwana TWIERDZI X i POWOŁUJE dokument na X,
  to jest DOC/TW, nie samo DOC.
✓ Common ground w sekcji "Fakty sporne" jest obowiązkowy — pustka jest
  błędem, nie opcją. Jeśli faktycznie nie istnieje punkt zgody, napisz to
  explicit.
✓ Sekcja "Braki informacyjne" musi mieć pole "Dotyczy sekcji" dla każdego
  pytania — odsyłające do konkretnych ID (F-, DIS-, P-), nie ogólnie do
  "całej sprawy".
✓ Sekcja "Kontrola jakości" → "Potencjalne niespójności" MUSI zawierać
  wszystkie sprzeczności typu IDENT wykryte w MD3c, nawet jeśli wydają się
  drobne (literówki) — czytelnik sam oceni istotność, ale musi je zobaczyć.
✓ Sekcja "Przepisy" nigdy nie zawiera treści przepisu bez HARDGATE-weryfikacji
  w tej samej odpowiedzi — w przeciwnym razie tylko ⚠️ [NIEWERYFIKOWANE]
  i opis kontekstu powołania.
```

---

## DOSTARCZENIE

MD-NARR jest generowany PO dashboardzie, jako dodatek (zob. "Kiedy uruchamiać").

Po wygenerowaniu treści:
1. `create_file` → zapisz jako `.md` w `/mnt/user-data/outputs/`
2. `present_files` → udostępnij użytkownikowi
3. Krótka wiadomość w czacie: 2-3 najważniejsze ustalenia + wskazanie sekcji
   "Braki informacyjne" jako listy TODO — NIE powtarzaj treści dokumentu w
   czacie. Wskaż, że dashboard powyżej (interaktywny, z filtrowaniem
   sprzeczności) i dokument poniżej (szczegółowy, z pełnymi kartami osób i
   narracją) prezentują ten sam materiał w dwóch formatach.
