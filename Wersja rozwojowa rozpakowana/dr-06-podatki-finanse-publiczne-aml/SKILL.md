---
name: dr-06-podatki-finanse-publiczne-aml
version: 3.72
description: |
  DR-06: Podatki, Finanse Publiczne, AML
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | podatki.gov.pl/narzedzia/eureka/ | interpretacje.podatki.gov.pl | orzeczenia.nsa.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-06 — Podatki, Finanse Publiczne, AML

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu podatkowego, stawki, progu, kwoty, terminu, sankcji, interpretacji, objaśnienia, WIS/WIA/WIP albo sygnatury orzeczenia:**
1. Zweryfikuj aktualne brzmienie aktu, tekst jednolity i nowelizacje w `isap.sejm.gov.pl`.
2. Zweryfikuj interpretacje, objaśnienia podatkowe oraz informacje MF/KIS w oficjalnym serwisie `podatki.gov.pl`, w szczególności w systemie **EUREKA**: `podatki.gov.pl/narzedzia/eureka/`.
3. Zweryfikuj orzecznictwo podatkowe w `orzeczenia.nsa.gov.pl`; dla spraw powszechnych pomocniczo także `orzeczenia.ms.gov.pl` / `sn.pl`.
4. **NIGDY** nie podawaj artykułu, stawki, progu, kwoty, terminu, sankcji, interpretacji ani tezy orzeczenia wyłącznie z pamięci modelu.

**Prawo podatkowe, stawki, progi, formularze, obowiązki raportowe, KSeF/JPK oraz praktyka interpretacyjna MF/KIS zmieniają się wielokrotnie w ciągu roku.**
W sprawach podatkowych sama treść modułu lokalnego jest tylko punktem startu; rozstrzygające jest aktualne brzmienie aktu i aktualna linia interpretacyjna/orzecznicza zweryfikowana online.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci modelu podczas sesji — każde brzmienie weryfikuj w ISAP**
- **Stawki podatkowe, kwoty wolne, progi — ZAWSZE weryfikuj przed podaniem (zmieniane co roku!)**
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-PODATKOWE.md` — dochód/przychód/koszty (wykładnia MF),
  koszty uzyskania ZPCh, definicje podatkowe ustawowe

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE: rzeczywisty
  beneficjent/UBO (AML art. 2 ust. 2 pkt 1, próg 25%, CRBR, kara do 1 mln zł)
  + alert: 3 RÓŻNE definicje "rzeczywistego właściciela" (AML/CIT-WHT art.4a
  pkt29/KSH art.4§1pkt4) — nie mylić

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-011 Cel mieszkaniowy (PIT — ulgi)
- BAS-074/099/100 Podatek / VAT / PIT — definicje podstawowe
- BAS-104 Stałe miejsce prowadzenia działalności VAT (TSUE C-605/12, C-547/18)
- BAS-W06 "Zajęcie na DG" — podatek od nieruchomości (MF interp. 37882/2023)
- BAS-W07 "Grunty zajęte na DG" — upol (NSA III FSK 530/23)
- BAS-W08 Podatek katastralny — brak planów (MF interp. 4662/2024)
- BAS-W14 ⚠️ ALERT: reforma upol od 01.01.2025 — nowe definicje budynek/budowla
  (Dz.U. 2024 poz. 1757, TK SK 14/21)
- BAS-022/023/045/050/053/054/059/061/070/071/073/076/081-084/086/087/090/092/
  096-098 — pełny katalog finansów publicznych JST (budżet, WPF, subwencje,
  dochody własne, dług SP, poręczenia/gwarancje — wszystkie z podstawą UFP)
  ⚠️ ALERT: ustawa z 27.02.2026 r. o zmianie UFP — zmiany w art. 11-15, 23-28
  (jednostki budżetowe, IGB, fundusze celowe, klasyfikacja budżetowa) —
  weryfikuj aktualną treść tych rekordów przy sprawach JST
- BAS-110 Absolwent CIS (ustawa o zatrudnieniu socjalnym, zmiana 2024)
- BAS-125 ⚠️ CRU JSFP — Centralny Rejestr Umów (wejście 01.07.2026, brak progu kwotowego!)
- BAS-W08 ⚠️⚠️ Podatek katastralny — NOWY projekt poselski Lewicy w Sejmie
  (20.03.2026): ≥3 lokale, stawka 0,5%→1,5% wartości. Stan: złożony, brak
  pierwszego czytania (06.2026). MF: brak prac rządowych, ale Sejm pracuje.
- BAS-W32 ⚠️ Przedawnienie podatkowe — Ordynacja podatkowa ma ODRĘBNY reżim
  od KC; nowelizacja znosi "wieczne przedawnienie" + wprowadza ugodę
  podatkową od 01.10.2026 (art. 70 i n. OP)

## Moduły (42 łącznie — ✓ 42 OK, ☐ 0 STUB)

**NAPRAWA 2026-08-14:** dodano `mod-OP-dzial-IV-rozdzial-11-dowody.md`
— zamyka rdzeń F-70: dowody w postępowaniu podatkowym (180-200),
etap decydujący o wyniku większości sporów podatkowych.
⚠️ WAŻNE — lekcja z F-33 zastosowana: ten wpis MUSI być potwierdzony
RÓWNIEŻ w bloku checklisty `[✓]` poniżej I w MAPA-AKTOW.md, nie
wystarczy sama wzmianka w tej notatce (patrz F-33, 12 modułów
niezarejestrowanych mimo wliczenia w licznik nagłówka).

**Aktualizacja 2026-08-13 (naprawa flagi F-20 — CZTERY nowe moduły
utworzone od podstaw, na żądanie użytkownika):** wykryto i naprawiono
wzorzec systemowy, w którym ROUTING-MAP.md opisywał moduły jako
istniejące, mimo że pliki fizycznie nie istniały na dysku (patrz
audyt-systemu-v4/references/WARN-OTWARTE.md, flaga F-20). Utworzono:
- `mod-PKPiR-ewidencje-uproszczone.md` (v1.0.0) — podatkowa księga
  przychodów i rozchodów: zakres podmiotowy (próg 2,5 mln EUR),
  zmiana rozporządzenia od 1.01.2026 (Dz.U. 2025 poz. 1299), obowiązek
  elektroniczny/JPK_PKPIR, 19 kolumn (wcześniej 17), terminy zapisów,
  rzetelność/niewadliwość księgi, spis z natury, metody kasowa/
  memoriałowa
- `mod-JPK-ksiegi-elektroniczne-e-sprawozdania.md` (v1.0.0) — cały
  ekosystem JPK: JPK_VAT/V7M/V7K (struktura, terminy, sankcje),
  JPK_CIT (JPK_KR_PD + JPK_ST_KR, harmonogram trzech etapów wdrożenia
  2025-2027, wydłużenie terminu do 7 miesięcy), JPK_PKPIR, JPK_KR na
  żądanie organu
- `mod-kasy-rejestrujace-fiskalizacja.md` (v1.0.0) — ⭐ ROZSTRZYGNIĘTO
  wcześniejszą rozbieżność numeru Dz.U. (prawidłowy: 2024 poz. 1902,
  NIE 1949), limit zwolnienia 20 000 zł, katalog zwolnień
  przedmiotowych, towary wymagające kasy bezwzględnie, fiskalizacja,
  przeglądy co 2 lata
- `mod-rachunkowosc-budzetowa-JSFP.md` (v1.0.0) — rachunkowość
  jednostek sektora finansów publicznych: podstawa art. 40 ustawy o
  finansach publicznych, rozporządzenie wykonawcze (t.j. Dz.U. 2026
  poz. 909), siedem załączników (plany kont, wzory bilansów), terminy
  sprawozdań 15/30 kwietnia

Wszystkie cztery moduły oznaczone jako v1.0.0, z wbudowaną sekcją
"SAMOOCENA POKRYCIA" wskazującą zidentyfikowane luki do dalszego
pogłębienia — pokrycie wstępne, oparte na jednej sesji wyszukiwania,
nieporównywalne jeszcze z wielokrotnie iterowanymi modułami VAT/akcyzy.

**Aktualizacja 2026-08-13 (ETAP 3 — dokończenie podatków sektorowych:
gry hazardowe i podatek tonażowy, na żądanie użytkownika):** w module
mod-podatki-sektorowe-bankowy-gry-tonazowy-cukrowy-detaliczny.md
domknięto Część B (podatek od gier — pełny katalog 7 stawek 2,5%-50%
zależnie od typu gry, podstawa opodatkowania per rodzaj z zasadą
niepodlegania sumowaniu, odrębny mechanizm dopłat do 4 funduszy
celowych w tym Fundusz Rozwiązywania Problemów Hazardowych) i Część C
(podatek tonażowy — stawka 19% od dochodu liczonego stawką dobową
wg pojemności NT statku, stawka szczególna 15% dla sprzedaży statków,
✅ zweryfikowany bezpośrednio w sip.lex.pl 10-letni okres związania
wyborem — najdłuższy spośród wszystkich mechanizmów opcjonalnych w
całym systemie DR-06, odnotowano potencjalne znaczenie regionalne ze
względu na bliskość portów Szczecin/Świnoujście). **Stan po Etapie 3:
wszystkie pięć podatków sektorowych (bankowy, gry, tonażowy, cukrowy,
sprzedaż detaliczna) jest w pełni opracowanych — moduł kompletny,
zamyka pierwotny plan etapowy uzupełniania luk DR-06 zainicjowany
na żądanie użytkownika.**

**Aktualizacja 2026-08-13 (ETAP 2c — priorytetowa część grupy
"złożonej" luk VAT, na żądanie użytkownika — ZAMKNIĘCIE serii etapów
uzupełniania VAT):** w rdzeniu dodano Sekcję 7, domykającą CESOP
(art. 110a-110e — próg 25 płatności transgranicznych/kwartał wobec
tego samego odbiorcy, obowiązki dostawców usług płatniczych,
powiązanie z wykrywalnością nieprawidłowości w e-commerce), wyroby
medyczne (art. 145c-145d — WAŻNE ODKRYCIE: przepis przejściowy
wygasł 27.05.2025 r., dziś ma charakter w większości historyczny —
relewantny wyłącznie dla okresów rozliczeniowych sprzed tej daty),
centralizację VAT jednostek samorządu terytorialnego (WAŻNE ODKRYCIE
STRUKTURALNE: to nie luka w samej ustawie o VAT, lecz odrębna ustawa
z 2016 r. — geneza z wyroku TSUE C-276/14 Gmina Wrocław i uchwały NSA
I FPS 4/15, zasada "wszystko albo nic" przy centralizacji), art. 43
ust. 3-5 (rezygnacja rolnika ryczałtowego ze zwolnienia — uproszczenie
od 2011 r., okres związania 3 lata, kolejny przykład powtarzającego
się w ustawie wzorca "wybór wiąże na czas określony"). Pozostałe
drobne pozycje (108c-108g, 92-95, 112-112aa, 134a-134c, 138i-138j,
szczegółowe fakturowanie 106a/106d/106f/106l/106m-106q) świadomie
potraktowane nawigacyjnie zgodnie z zasadą lazy loading — niska
częstotliwość w typowej praktyce kancelaryjnej cywilno-karno-
gospodarczej, do opracowania reaktywnie przy faktycznej sprawie z
danego zakresu. Stan po Etapie 2c: wszystkie priorytetowe luki VAT
zidentyfikowane w audycie pokrycia (iteracje I-VII + etapy 2a-2c)
są domknięte; pozostają wyłącznie tematy niszowe/techniczne.

**Aktualizacja 2026-08-13 (ETAP 2b — grupa "średnia" luk peryferyjnych
VAT, na żądanie użytkownika):** w rdzeniu dodano Sekcję 6, domykającą
art. 121-125 (złoto inwestycyjne — definicja dwuskładnikowa, zwolnienie
z prawem do odliczenia jako rzadki wyjątek, powiązanie z AML), art. 114
(taksówki — wykryto i udokumentowano rozbieżność między literalną
stawką 3% a faktycznie stosowaną 4%, analogiczną do mechanizmu
22%→23% w stawce podstawowej), art. 13a-13l (call-off stock, oba
kierunki, ryzyko przekroczenia terminu 12 miesięcy), art. 89 (VAT-REF
— dwa odrębne kierunki procedury, aktualizacja wykonawcza z 2026 r.),
art. 32 (szacowanie przy powiązaniach — wykryto, że dawny autonomiczny
katalog powiązań na gruncie samego VAT jest uchylony i zastąpiony
odesłaniem do definicji z PIT/CIT), art. 101-102 (korekty informacji
podsumowującej VAT-UE — brak sztywnego terminu, charakter lex specialis
wobec Ordynacji podatkowej, powiązanie z ryzykiem utraty stawki 0%
przy WDT).

**Aktualizacja 2026-08-13 (ETAP 2a — grupa "szybka" luk peryferyjnych
VAT, na żądanie użytkownika):** w rdzeniu `mod-VAT-podatek-od-
towarow-i-uslug.md` dodano nową Sekcję 5, domykającą art. 2 (słownik
— kluczowe definicje z 52 pozycji: sprzedaż, mały podatnik, ZCP,
tereny budowlane, pojazdy samochodowe, system kaucyjny), art. 3
(właściwość organu — WYŁĄCZNIE przypadki szczególne: podatnicy
zagraniczni/OSS/IOSS, SME transgraniczne, grupa VAT; ust. 1-2 SĄ
uchylone), art. 28p (zawiadomienie o wyborze/rezygnacji z miejsca
opodatkowania dla WSTO i usług TBE), art. 44 (zwolnienia WNT —
przepis-przełącznik odsyłający do art. 43 ust. 1 pkt 5-8 i Rozdziału
3 o imporcie), art. 84-85 (struktura zakupów i metoda "w stu" — w
trakcie weryfikacji wykryto i SKORYGOWANO własną wstępną hipotezę o
nieaktualności przeliczników art. 85; ostatecznie potwierdzono, że
18,70%/7,41%/4,76% dla stawek 23%/8%/5% SĄ aktualne, oraz odróżniono
ten mechanizm od podobnie nazwanej metody przeliczeniowej z art.
106e). Metodologia: Rząd 1 (ISAP) niedostępny do web_fetch w tej
sesji — zastosowano lexlege.pl jako główne źródło Rządu 2B (t.j.
Dz.U.2025.0.775, stan prawny wprost oznaczony jako aktualny na
12.08.2026), potwierdzone krzyżowo w przepisy.gofin.pl, poltax.pl,
ifirma.pl.

**Aktualizacja 2026-08-12 (ITERACJA VII — domknięcie osi transgranicznej
i poziomu D bazy weryfikacji stawek; TRZY NOWE MODUŁY):** kontynuacja
audytu pokrycia działami. Domknięto luki priorytetu P2:

- `mod-VAT-import-towarow-i-zwolnienia-importowe.md` (NOWY) — ⭐⭐⭐ domyka
  **NAJSŁABSZY DZIAŁ CAŁEJ USTAWY** (Dział VII, dotąd ~5%): art. 26a
  (miejsce importu, podstawa odprawy fiskalnej w innym państwie UE),
  art. 33 (⛔ termin **10 DNI** w modelu standardowym — NIE 25. dzień),
  ⭐ art. 33a w pełnym ujęciu (warunki łączne, ⛔ skutek uboczny:
  obowiązek rozliczeń MIESIĘCZNYCH — konflikt z metodą kasową;
  mechanizm trzystopniowy: okno korekty **4 miesiące** → utrata prawa
  + odsetki → ⛔ **fakultatywna** decyzja o pozbawieniu prawa na
  **36 miesięcy**), art. 33b, art. 34–40; Dział VIII rozdz. 3
  (art. 45–82a) w ujęciu NAWIGACYJNYM z ⛔ **dwoma alertami**:
  (a) art. 51/próg 22 EUR — zwolnienie dla małych przesyłek zniesione
  na poziomie unijnym od 1.07.2021 (pakiet e-commerce), opracowania
  sprzed reformy są mylące; (b) art. 52 — TSUE zakwestionował warunek
  „odbiorcy przebywającego na terytorium kraju"
- `mod-VAT-WIS-tryb-i-ochrona.md` (NOWY) — art. 42a–42i: ⭐⭐⭐ **domyka
  POZIOM D bazy weryfikacji stawek** z sekcji 3 modułu macierzystego
  (dotąd poziom D był opisany jednym akapitem). Krąg wnioskodawców
  (⭐ w tym ZAMAWIAJĄCY z PZP — wejście do DR-07), dwa cele wniosku
  (stawka vs sama klasyfikacja, art. 42b ust. 4), zakres ochrony
  (art. 42c — ⛔ warunek: faktyczne ZASTOSOWANIE stawki z WIS),
  ważność **5 lat** (art. 42ha), ⛔⛔ **WYGAŚNIĘCIE Z MOCY PRAWA**
  bez zawiadomienia przy zmianie przepisów (art. 42h ust. 1) —
  operacyjny skutek: każda WIS w aktach wymaga ponownego sprawdzenia
  po każdej zmianie stawek/załączników
- `mod-VAT-kursy-walut-rachunek-VAT-tax-free.md` (NOWY) — art. 31a
  (⭐ test decyzyjny: faktura PRZED czy PO obowiązku podatkowym;
  opcja EBC; opcja spójności z PIT/CIT z **12-miesięcznym** związaniem),
  art. 31b (korekty po SLIM VAT 3, kurs pierwotny vs zbiorczy),
  art. 108b (uwolnienie środków z rachunku VAT: **60 dni**,
  ⚠️ **postanowienie → zażalenie** vs **decyzja odmowna → odwołanie**,
  rachunek techniczny ust. 10–15 — ⭐ krok pomijany przy likwidacji),
  art. 126–130 TAX FREE (próg **200 zł**, ⛔ sprzedawca nie może
  korzystać ze zwolnienia z art. 113, kasa ONLINE, PUESC,
  okno korekty **10 miesięcy**)

⚠️ **POZOSTAJĄCE LUKI VAT po iteracji VII:** art. 121–125 (złoto
inwestycyjne), art. 89 (VAT-REF), art. 110a–110e (CESOP), art. 108g,
art. 108c–108f, art. 32 (szacowanie — obecny szczątkowo), art. 13a–13l
(call-off stock), art. 114 (taksówki), art. 84–85, art. 134a–134c,
art. 138i–138j, art. 2 (systematyczny słownik), art. 3 (właściwość),
art. 28p, art. 44, art. 92–95, art. 101–102, art. 112–112aa,
art. 106a/106d/106f/106l/106m–106q, Dział XIII rozdz. 1b/1ca/1d,
art. 43 ust. 3–5, centralizacja rozliczeń JST.

**Aktualizacja 2026-08-12 (ITERACJA VI — audyt pokrycia VAT DZIAŁAMI,
DWA NOWE MODUŁY):** przeprowadzono audyt pokrycia ustawy o VAT
**według systematyki ustawy** (13 działów), a nie — jak dotąd —
według historii pytań użytkownika. Struktura ustawy zweryfikowana
online (t.j. Dz.U. 2025 poz. 775; potwierdzono BRAK nowszego tekstu
jednolitego na 12.08.2026). Wynik: pokrycie globalne ~55–60%, ale
skrajnie nierówne — Dział IX ~90%, Dział VII ~5%.

⛔ **USUNIĘTY BŁĄD MERYTORYCZNY (wychwycony przez weryfikację online
PRZED wpisaniem do modułu):** ulga na zakup kasy rejestrującej była
w roboczej analizie opisana jako „300 zł". POPRAWNIE: ulga wynosi
**90% ceny zakupu, nie więcej niż 700 zł** (art. 111 ust. 4);
**300 zł to KARA PIENIĘŻNA** za brak przeglądu technicznego
(art. 111 ust. 6ka). Sprostowanie utrwalone w module.

Domknięto luki priorytetu P1:
- `mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja.md` (NOWY) —
  Dział X rozdz. 1 (art. 96–98: pełny katalog wykreślenia z urzędu
  ust. 9 i 9a + ⭐⭐⭐ TRZY ODRĘBNE ścieżki przywrócenia 9h/9ha/9j
  z terminem 2 miesięcy + charakter czynności materialno-technicznej
  i konsekwencja dla wyboru środka zaskarżenia; art. 97 VAT-UE
  i efekt kaskadowy na stawkę 0% przy WDT), Dział X rozdz. 4
  (art. 103–105d: termin 25. dnia, ⛔ **PAKIET PALIWOWY — 5 DNI**
  z art. 103 ust. 5a, art. 103a/103b, ⭐ kaucja gwarancyjna
  art. 105b + ostrzeżenie zał. 13 vs zał. 15), Dział IV rozdz. 3
  (art. 21 metoda kasowa — rozróżnienie od rozliczenia kwartalnego,
  art. 86 ust. 10e u nabywcy, wyjątki WNT/import usług), Dział II
  rozdz. 4 (art. 14 remanent likwidacyjny — sprzężenie z art. 91
  ust. 4–6 i ze zwrotem ulgi na kasę, zwolnienie 12-miesięczne,
  checklist likwidacyjny, ⚠️ MONITORUJ projekt UD314 — zapowiedziana
  likwidacja VAT-S1M/VAT-S1K)
- `mod-VAT-platnicy-egzekucja-kasy-trojstronne.md` (NOWY) —
  Dział III (art. 18 + art. 106c/106e ust. 1 pkt 20/106g ust. 2:
  ⭐⭐⭐ komornik i organ egzekucyjny jako PŁATNIK, podatnikiem
  pozostaje DŁUŻNIK; odliczenie u nabywcy i ryzyko art. 88 ust. 3a
  pkt 2 przy nieruchomości; wątek KSeF), Dział XI rozdz. 3 w warstwie
  USTAWOWEJ (art. 111 ust. 2 — utrata 30% odliczenia; ust. 4–5 ulga;
  ust. 6 zwrot ulgi w okresie 3 lat; ust. 6ka kara 300 zł; art. 111b),
  Dział XII rozdz. 8 (art. 135–138 procedura uproszczona — warunki
  łączne, ⛔ organizator transportu, CZTERY obowiązkowe elementy
  adnotacji z art. 136 ust. 1, oznaczenie w VAT-UE)

⚠️ **POZOSTAJĄCE LUKI VAT po iteracji VI** (pełna lista działami
w `MAPA-AKTOW.md`): Dział VII w całości (art. 33–40, import towarów),
Dział VIII rozdz. 3 (art. 45–82a, zwolnienia importowe), art. 121–125
(złoto inwestycyjne), art. 126–130 (TAX FREE), art. 89 (VAT-REF),
art. 110a–110e (CESOP), art. 108b–108g, art. 31a (kursy walut),
art. 13a–13l (call-off stock), art. 114 (taksówki), art. 84–85,
art. 134a–134c, art. 138i–138j, art. 2 (systematyczny słownik),
art. 3 (właściwość organów), art. 26a, art. 28p, art. 44,
art. 92–95, art. 112–112aa, Dział XIII rozdz. 1b/1ca/1d.

**Aktualizacja 2026-08-12 (NOWY MODUŁ):** `mod-OP-kontrola-podatkowa-
dzial-VI.md` — dotąd CAŁKOWICIE nieobecny temat, mimo że to
NAJCZĘSTSZY typ kontroli — ODRĘBNY od kontroli celno-skarbowej
(inny organ, właściwość lokalna vs krajowa, wymóg uprzedniego
zawiadomienia ZAW-K, ⭐⭐⭐ mechanizm SPRZECIWU przedsiębiorcy — 3 dni
robocze, wstrzymuje czynności kontrolne — CAŁKOWICIE nieobecny przy
celno-skarbowej). Uwzględnia TRZY fale świeżych reform 2025-2026
(Pierwszy Pakiet Deregulacyjny): rozszerzone zawiadomienie
(13.07.2025), ograniczenie odsetek przy kontroli >6 miesięcy +
zasada in dubio pro tributario (4.11.2025), kontrole oparte na
analizie ryzyka (1.01.2026).

**Aktualizacja 2026-08-12 (PODZIAŁ modułu VAT, NOTA-4):** moduł VAT
osiągnął 3652 linie (~9× próg 400 linii z audyt-systemu-v4/
CHECKLIST-DEDUP.md) — WYNIK intensywnej pracy RÓWNOLEGŁEJ sesji
(rozbudowany audyt pokrycia VAT, iteracje I-V, uzupełnił m.in.
prewspółczynnik, elementy faktury, miejsce świadczenia usług, bony
SPV/MPV, pustą fakturę, transakcje łańcuchowe — WSZYSTKIE
wcześniej zidentyfikowane luki). PODZIELONO na SZEŚĆ plików wg
naturalnych klastrów tematycznych:
- `mod-VAT-podatek-od-towarow-i-uslug.md` (rdzeń, 953 l.) — alerty
  PKWiU/KSeF, weryfikacja faktury w KSeF, CORE/INTAKE, baza
  weryfikacji stawek, podstawowe mechanizmy (odliczenie, MPP, zwrot,
  kasy fiskalne, biała lista, WNT/import usług, OSS/IOSS, WIS)
- `mod-VAT-miejsce-swiadczenia-zwolnienia.md` (NOWY, 455 l.) —
  grupa VAT, miejsce świadczenia usług, zwolnienie podmiotowe, VAT
  marża, eksport/WDT
- `mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci.md` (NOWY,
  721 l.) — obowiązek podatkowy, podstawa opodatkowania i faktury
  korygujące, zwolnienia przedmiotowe i VAT a nieruchomości, ulga
  na złe długi
- `mod-VAT-sankcje-bony-odliczenia.md` (NOWY, 729 l.) — sankcje/
  dodatkowe zobowiązanie, bony SPV/MPV, pusta faktura, wyłączenia
  prawa do odliczenia, proporcja/prewspółczynnik
- `mod-VAT-transakcje-fakturowanie.md` (NOWY, 625 l.) — nieodpłatne
  przekazania, zbycie przedsiębiorstwa/ZCP, miejsce dostawy i
  transakcje łańcuchowe, organy władzy publicznej, odwrotne
  obciążenie krajowe, fakturowanie, procedury szczególne
- `mod-VAT-ewidencja-deklaracje.md` (NOWY, 296 l.) — ewidencja
  JPK_V7, deklaracje, informacje podsumowujące, dowody, rejestracja
  VAT i solidarna odpowiedzialność

WERYFIKACJA KOMPLETNOŚCI: sprawdzono WSZYSTKIE 41 oryginalnych
tematów (nagłówków) — POTWIERDZONO obecność KAŻDEGO W którymś z
sześciu plików, ŻADEN nie zaginął w procesie podziału. Zachowano
GLOBALNE, krytyczne ostrzeżenie (termin zwrotu VAT = 40 dni, NIE
60) we WSZYSTKICH sześciu plikach rodziny.

**Aktualizacja 2026-08-12 (scalenie gałęzi):** ten SKILL.md POCHODZI
z równoległej sesji (rozbudowany audyt pokrycia VAT, iteracje I-V).
UZUPEŁNIENIE brakującego wpisu o WCZEŚNIEJSZEJ, nietkniętej przez to
scalenie pracy z INNEJ gałęzi tego samego dnia: `mod-ustawa-
uslugi-platnicze.md` — dodano MAŁĄ INSTYTUCJĘ PŁATNICZĄ (MIP, limit
1,5 mln EUR, art. 117f-117u UUP); `mod-ustawa-rynek-kapitalowy-
fundusze.md` — naprawiono błędną podstawę sankcji karnej (art. 154
to definicja, nie sankcja — POPRAWNE: art. 180/181) i rozbudowano
insider trading. OBA pliki modułów SĄ nietknięte przez TO scalenie,
TREŚĆ potwierdzona obecna.

**Aktualizacja 2026-08-13 (audyt pokrycia + wypełnienie luk, na
żądanie użytkownika, analogicznie do wcześniejszego audytu VAT i
akcyzy):** `mod-ustawa-rachunkowosci.md` rozbudowany z v1.9.0 do
v1.14.0. ⛔ KOREKTA SYSTEMOWA: wykryto, że ROUTING-MAP.md błędnie
wskazywał wcześniej wersję v1.11.0 z "transzą 3" (sekcje 5b-5h) —
ta treść fizycznie NIE ISTNIAŁA w pliku na dysku (weryfikacja
bezpośrednia), prawdopodobnie przerwana/niezapisana sesja z 08-11.
DODATKOWO wykryto CZTERY inne wpisy w ROUTING-MAP.md odnoszące się
do modułów, które NIE ISTNIEJĄ na dysku: mod-PKPiR-ewidencje-
uproszczone, mod-JPK-ksiegi-elektroniczne-e-sprawozdania (3 wpisy),
mod-kasy-rejestrujace-fiskalizacja (2 wpisy), mod-rachunkowosc-
budzetowa-JSFP — wszystkie oznaczone w ROUTING-MAP.md jako ⛔ WPIS
FANTOMOWY, wymagają albo utworzenia modułu od zera, albo usunięcia
wiersza. W TEJ sesji ODTWORZONO od podstaw i ZWERYFIKOWANO pięć
głównych luk rachunkowości: skonsolidowane sprawozdania finansowe/
grupy kapitałowe (sekcja 5b), ESG/CSRD (sekcja 5c — była PODWÓJNĄ
luką, nieobecna też w DR-15 dokąd błędnie odesłano; pełna
chronologia trzech nowelizacji 12.2024/07.2025/02.2026), wycena
walut obcych (sekcja 5d), odpowiedzialność cywilna KSH art. 293/483
z business judgment rule (sekcja 5e), usługowe prowadzenie ksiąg —
z istotną korektą: brak wymogu certyfikatu księgowego od 10.08.2014
r. (sekcja 5f), wynik finansowy zasygnalizowany (sekcja 5g), KSR
usystematyzowane (sekcja 5h). Pokrycie dziedziny wzrosło z 50% do
75% wg wbudowanej mapy pokrycia modułu (15/20 podtematów pełnych).

**Aktualizacja 2026-08-11:**
- Nowy moduł: `mod-ustawa-rachunkowosci.md` — ustawa o rachunkowości
  z 29.09.1994 (Dz.U. 2026 poz. 522 t.j.), dotąd CAŁKOWICIE nieobecna
  jako samodzielny temat — próg 2,5 mln EUR (podwyższony), zasady
  ciągłości i memoriałowa, sankcje art. 77 u.o.r. + art. 60/61 KKS
  ze złożonym mechanizmem zbiegu przepisów

**Aktualizacja 2026-07-27:**
- Nowy moduł: `mod-limit-platnosci-gotowkowych.md` — limit 15 000 zł B2B
  (art. 19 Prawa przedsiębiorców), sankcja KUP, historia nieudanego
  obniżenia do 8000 zł, nadchodząca zmiana unijna (AML, 10 000 EUR od
  2027, dotyczy też B2C) — odpowiedź na pytanie użytkownika

**Aktualizacja 2026-06-07:**
- Ordynacja podatkowa: nowy t.j. **Dz.U. 2026 poz. 622**
- PIT: nowy t.j. **Dz.U. 2026 poz. 592**
- CIT: nowy t.j. **Dz.U. 2026 poz. 554** (Obwieszczenie 27 marca 2026, stan prawny 18 marca 2026)

**Aktualizacja 2026-06-14 (NOTA-4):** wydzielono mod-PKWiU-klasyfikacje-statystyczne
z mod-interpretacje-definicje-podatkowe (overlap z DEF-PODATKOWE udokumentowany
przez cross-reference, bez duplikacji treści).

```
  [✓] OK    mod-interpretacje-definicje-podatkowe
              (baza EUREKA; kluczowe def.: najem prywatny [NSA II FPS 1/21],
               PON wynajem [NSA III FPS 2/24], IP Box+B+R, estoński CIT,
               MDR [DTS5.8092.2/3/4.202X], rezydent podatkowy; jak korzystać
               z interpretacji indyw./ogólnych/WIS)
  [✓] NOWY  mod-PKWiU-klasyfikacje-statystyczne
              (PKWiU 2025 harmonogram VAT/PIT/CIT/ryczałt, PKOB, CN —
               wydzielony 2026-06-14, referencjonowany przez mod-VAT/PIT/CIT)
  [✓] OK    mod-OP-ordynacja-podatkowa
  [✓] NOWY  mod-OP-dzial-IV-rozdzial-11-dowody
              (dodany 2026-08-14 — naprawa F-70: OP art. 180-200.
               Zasady ogólne [187 — obowiązek organu, zasada
               inkwizycyjności; 188 — prawo strony do inicjatywy
               dowodowej], katalog środków dowodowych [181, otwarty,
               księgi na pierwszym miejscu], swobodna ocena dowodów
               [191] i prawo do wypowiedzenia się [192], dokumenty
               urzędowe [194], KSIĘGI PODATKOWE [193 — domniemanie
               mocy dowodowej, rzetelność vs niewadliwość, ciężar
               obalenia domniemania na organie])
              (główny moduł: postępowanie podatkowe, terminy, GAAR,
               odpowiedzialność zarządu, KKS czynny żal, przedawnienie)
  [✓] OK    mod-KAS-kontrola-celno-skarbowa
  [✓] OK    mod-PIT-podatek-dochodowy-fizyczne
  [✓] OK    mod-CIT-podatek-dochodowy-prawne
              (2026-07-19: SKORYGOWANO BŁĄD — podatek minimalny art.
               24ca miał błędnie podaną stawkę 1,5% zamiast poprawnej
               10% [1,5% to tylko jeden z 3 składników PODSTAWY, nie
               stawka]; dodano sekcję 5a PODATEK U ŹRÓDŁA/WHT
               [mechanizm pay and refund, próg 2 mln zł, opinia o
               preferencji, oświadczenie WH-OSC/WH-OSP])
  [✓] NOWY  mod-VAT-import-towarow-i-zwolnienia-importowe
              (dodany 2026-08-12, iteracja VII: Dział VII w całości
               [art. 26a, 33, 33a, 33b, 34-40] + Dział VIII rozdz. 3
               [art. 45-82a, nawigacyjnie]. ⛔ Alerty: termin 10 dni,
               sankcja 36 miesięcy [fakultatywna], zniesienie progu
               22 EUR od 1.07.2021, TSUE ws. art. 52)
  [✓] NOWY  mod-VAT-WIS-tryb-i-ochrona
              (dodany 2026-08-12, iteracja VII: art. 42a-42i — domyka
               POZIOM D bazy weryfikacji stawek; ważność 5 lat,
               ⛔ wygaśnięcie z mocy prawa bez zawiadomienia)
  [✓] NOWY  mod-VAT-kursy-walut-rachunek-VAT-tax-free
              (dodany 2026-08-12, iteracja VII: art. 31a-31b kursy,
               art. 108b uwolnienie środków [⚠️ postanowienie/zażalenie
               vs decyzja/odwołanie], art. 126-130 TAX FREE)
  [✓] NOWY  mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja
              (dodany 2026-08-12, iteracja VI audytu pokrycia VAT
               działami: art. 96-98 rejestracja/wykreślenie/przywrócenie,
               art. 103-105d zapłata + pakiet paliwowy 5 dni + kaucja
               gwarancyjna, art. 21 metoda kasowa, art. 14 remanent
               likwidacyjny — WSZYSTKIE dotąd nieobecne)
  [✓] NOWY  mod-VAT-platnicy-egzekucja-kasy-trojstronne
              (dodany 2026-08-12, iteracja VI: art. 18 + 106c komornik
               jako płatnik VAT, art. 111 warstwa ustawowa [sankcja 30%,
               ulga 90%/700 zł, zwrot ulgi 3 lata, kara 300 zł za brak
               przeglądu], art. 135-138 transakcje trójstronne —
               procedura uproszczona. ⛔ Zawiera SPROSTOWANIE błędnej
               kwoty ulgi na kasę)
  [✓] OK    mod-VAT-podatek-od-towarow-i-uslug
              (2026-07-21: dodano odesłanie do nowego modułu o
               samochodach/użytku mieszanym)
  [✓] OK    mod-odliczenia-uzytek-mieszany-firma-prywatny-KUP
              (dodany 2026-07-21: VAT samochody osobowe [50%/100%,
               VAT-26, ewidencja przebiegu, ryzyko ANPR], ryczałt PIT
               za użytek prywatny [250/400 zł wg mocy, orzecznictwo
               NSA — paliwo w ryczałcie], ogólne zasady KUP, macierz
               decyzyjna firma/konsument/odsprzedaż/niejednoznaczna
               klasyfikacja, kluczowe rozróżnienie VAT≠KUP jako
               niezależne reżimy. Odpowiedź na audyt kompletności
               prawa podatkowego)
              (2026-07-19: dodano PROCEDURĘ VAT MARŻA [art. 120 — w tym
               "FB VAT marża": skup od osób prywatnych w celu odsprzedaży],
               rozbudowano EKSPORT/WDT [pełne warunki stawki 0%, dowody,
               informacja podsumowująca VAT-UE, orzecznictwo TSUE ws.
               odpowiedzialności w łańcuchu dostaw])
              (2026-07-19: dodano VAT OSS/IOSS [próg 10 000 EUR,
               deklaracja VIU-DO, procedura nieunijna, IOSS dla
               importu ≤150 EUR])
  [✓] OK    mod-podatki-sektorowe-bankowy-gry-tonazowy-cukrowy-detaliczny
              (dodany 2026-07-19: podatek bankowy [W PEŁNI opracowany
               — stawka 0,0366%, progi 4/2 mld zł]. ROZBUDOWANY
               2026-08-13 [ETAP 1]: opłata cukrowa [W PEŁNI —
               art. 12a-12g, stawki 0,50/0,05/0,10 zł, pułap 1,2 zł/l,
               sankcja 50%, projekt podwyżki UD417] i podatek od
               sprzedaży detalicznej [W PEŁNI — potwierdzona ciągłość
               obowiązywania od 2021, PSD-1, właściwość organów, próg
               17 mln zł, stawki 0,8%/1,4%] W PEŁNI opracowane.
               Podatek od gier i podatek tonażowy NADAL punkt
               startowy — do kolejnego etapu)
  [✓] OK    mod-ustawa-ryczalt-przychody
              (2026-07-19: dodano logikę decyzyjną "ryczałt zamiast
               podatku" [kiedy się opłaca vs skala/liniowy] oraz
               przegląd zwolnień przedmiotowych PIT art. 21 [ulga dla
               młodych, powracających, 4+, pracujących seniorów])
  [✓] OK    mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci
              (dodany 2026-07-19: baza produktów o niejednoznacznej
               klasyfikacji VAT — rękawice nitrylowe medyczne 8% vs
               robocze 23% jako główny przykład, + maseczki/płyny
               dezynfekujące/podkłady chłonne. Korekta terminologiczna:
               mechanizm dotyczy PKWiU/CN i statusu wyrobu medycznego,
               NIE kodu PKD. Odpowiedź na pytanie użytkownika)
  [✓] OK    mod-ustawa-PCC-i-podatek-spadkow-darowizn
  [✓] OK    mod-ustawa-podatek-nieruchomosci-i-lokalne
  [✓] OK    mod-UFP-finanse-publiczne-NIK-RIO
              (2026-07-21: dodano sekcję 11 — merytoryczna treść
               wystąpienia pokontrolnego NIK [elementy, termin 21 dni
               zastrzeżeń z adresatem zależnym od rangi podmiotu,
               komisja rozstrzygająca, rodzaje kontroli]. Dotąd
               sekcje 1-10 nazywały kroki bez treści. Odpowiedź na
               pytanie użytkownika)
  [✓] OK    mod-ustawa-akcyzowa-i-clo-UCC
              (v1.7, ROZBUDOWANY 2026-08-13: pierwszy systematyczny
               audyt pokrycia PER DZIAŁ ustawy [analogiczny do
               wielokrotnie już wykonanego dla VAT] — domknięto
               Działy II [rejestracja CRPA + kwalifikacja karno-
               skarbowa art. 56b §2 KKS, deklaracje/terminy,
               zwolnienia], III [składy podatkowe, zabezpieczenie
               generalne/ryczałtowe 30%], V [samochody osobowe —
               stawki 3,1%/18,6%, zmiany 1.04.2025], VI [znaki
               akcyzy podatkowe/legalizacyjne — wysoki priorytet,
               powiązanie z KKS], VIA [ewidencje, 5-letni termin],
               VIb [kary pieniężne administracyjne]; ORAZ Dział IA
               [WIA] — ⭐⭐⭐ ISTOTNA KOREKTA: organ właściwy zmienił
               się 1.07.2023 r. z Dyrektora IAS Wrocław na Dyrektora
               KIS, poprzednia wersja podawała nieaktualny organ)
  [✓] OK    mod-alkohol-tyton-regulacja-sprzedazy
              (v1.2, 2026-07-20: dodano sekcję DO MONITOROWANIA — 4
               równoległe, konkurencyjne projekty zmian ustawy
               alkoholowej [PSL, Lewica, Polska 2050, rządowy UD 147],
               ŻADEN jeszcze nie jest prawem. Plus Część C —
               bimbrownictwo)
              (v1.1, 2026-07-20: dodano Część C — BIMBROWNICTWO [art.
               12a ustawy 2001 — KLUCZOWE: uchwała SN I KZP 23/04,
               "legalny bimber na własny użytek" NIE ISTNIEJE w
               polskim prawie, zbieg z KKS, przepadek aparatury].
               Odpowiedź na pytanie użytkownika)
              (dodany 2026-07-19: regulacja SPRZEDAŻY alkoholu [3
               kategorie zezwoleń wg mocy, cofnięcie zezwolenia —
               odpowiedzialność praktycznie obiektywna wg TK] i
               wyrobów tytoniowych/nikotynowych [zakaz sprzedaży
               nieletnim, NOWELIZACJA 5.07.2025 — e-papierosy
               zrównane z tytoniem]. Przemyt/kontrabanda potwierdzone
               jako już dobrze pokryte, bez zmian. Odpowiedź na
               pytanie użytkownika)
              (podatek akcyzowy, WIA, KKS celno-akcyzowe — Dz.U. 2025 poz. 126)
  [✓] NOWY  mod-UCC-clo-taryfa-celna
  [✓] OK    mod-clo-podroznych-limity-towary-zabronione
              (dodany 2026-07-19: strona KONSUMENCKA cła — limit
               gotówki 10 000 EUR [rozporządzenie UE 2018/1672, złoto/
               platyna BEZ progu], zwolnienia dla podróżnych [300/430
               EUR, normy alkohol/tytoń], CITES [sankcja karna 3
               miesiące-5 lat]. Odpowiedź na pytanie użytkownika)
              (wydzielony 2026-06-14 z mod-ustawa-akcyzowa-i-clo-UCC: Nomenklatura
               Scalona CN/TARIC, WIT, procedury celne UCC, wartość celna, FTA/GSP)
  [✓] OK    mod-ustawa-AML-instytucje-obowiazkowe
  [✓] OK    mod-prawo-bankowe-KNF-BFG
  [✓] OK    mod-ustawa-rynek-kapitalowy-fundusze
  [✓] OK    mod-ustawa-uslugi-platnicze
  [✓] NOWY  mod-ustawa-biegli-rewidenci-zawod
              (Dz.U. 2025 poz. 1891 t.j.; zawód zaufania publicznego —
               samorząd PIBR; rozp. 25.09.2025 — nowe uprawnienie do
               atestacji sprawozdawczości ESG/CSRD; harmonogram ESG
               wielokrotnie odraczany — zawsze weryfikuj online)
  [✓] NOWY  mod-ustawa-doradcy-podatkowi-zawod
              (Dz.U. 2021 poz. 2117 + nowelizacja Dz.U. 2025 poz. 1882
               [rozszerzenie zakresu doradztwa + zmiana PPSA]; zawód
               zaufania publicznego — samorząd KIDP; krąg uprawnionych
               szerszy niż tylko doradcy podatkowi — adwokaci/radcowie/
               biegli rewidenci w określonym zakresie)
```

## Jak wywołać

```
view /mnt/skills/user/dr-06-podatki-finanse-publiczne-aml/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-06-podatki-finanse-publiczne-aml/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- KPA (postępowanie adm.): `dr-05` → `mod-KPA-postepowanie-administracyjne`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Interpretacje / objaśnienia / WIS-WIA-WIP: podatki.gov.pl/narzedzia/eureka/ oraz interpretacje.podatki.gov.pl
- Orzecznictwo NSA: orzeczenia.nsa.gov.pl

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
