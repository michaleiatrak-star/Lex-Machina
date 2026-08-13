# mod-ROZP-SKLADKOWE-podstawa-wymiaru

**Wersja:** 1.0.0 · utworzony 2026-08-13
**Powód utworzenia:** LUKA SYSTEMOWA wykryta podczas analizy oferty
„obniżymy ZUS o 25%". Audyt `grep` całego drzewa `/mnt/skills/user`
wykazał **ZERO trafień** dla: `1106`, `rozporządzenie składkowe`,
`18 grudnia 1998`, `§ 2 ust. 1 pkt`. Jedyne trafienie na „1106"
(`analizator-umow-v1/references/b2b-podwykonawcze.md`) to fałszywy
pozytyw — M.P. 2024 poz. 1106 (odsetki w transakcjach handlowych).
System pokrywał ZUS **wyłącznie od strony ubezpieczonego**
(`mod-SUS-ZUS-ubezpieczenia-spoleczne` — emerytura, renta, odwołanie),
nie od strony **płatnika i podstawy wymiaru**.

---

## ⛔ HARD GATE

Każdy punkt § 2 ust. 1, każdy limit kwotowy i każda sygnatura z tego
modułu wymaga `web_fetch`/`web_search` **w tej samej odpowiedzi**.
Katalog wyłączeń był nowelizowany (patrz ALERTY) i będzie dalej.

**Źródło kanoniczne (RZĄD 1, pełny tekst):**
`https://api.sejm.gov.pl/eli/acts/DU/2025/316/text.pdf`

---

## 1. AKT PRAWNY

| | |
|---|---|
| **Nazwa** | Rozporządzenie **Ministra Pracy i Polityki Socjalnej** z dnia **18 grudnia 1998 r.** w sprawie szczegółowych zasad ustalania podstawy wymiaru składek na ubezpieczenia emerytalne i rentowe |
| **Potocznie** | „rozporządzenie składkowe" |
| **Tekst pierwotny** | Dz.U. 1998 nr 161 poz. 1106 |
| **Tekst jednolity** | **Dz.U. z 2025 r. poz. 316** (obwieszczenie MRPiPS z 3.03.2025) |
| **Wcześniejsze t.j.** | 2015.2236 · 2017.1949 · 2023.728 |
| **Delegacja** | art. 21 ustawy z 13.10.1998 r. o systemie ubezpieczeń społecznych |
| **Weryfikacja** | ✅ pełny tekst odczytany 2026-08-13 z Dz.U. (api.sejm.gov.pl/eli) |

### ⚠️ PUŁAPKA NAZEWNICZA — TEST NA RZETELNOŚĆ DORADCY

Sprzedawcy schematów optymalizacyjnych masowo mylą ten akt.
Trzy typowe błędy — **każdy jest sygnałem ostrzegawczym**:

| Błąd w cytowaniu | Prawidłowo |
|---|---|
| „zarządzenie" | **rozporządzenie** |
| „13 października 1998" | **18 grudnia 1998** (13.10.1998 = ustawa systemowa, czyli DELEGACJA) |
| „Polityki Społecznej" | **Polityki Socjalnej** (nazwa historyczna resortu, w t.j. zachowana) |

Podmiot sprzedający „w pełni legalny mechanizm" oparty na akcie,
którego nie potrafi poprawnie nazwać, nie przeszedł własnej kontroli
jakości. **Błędne cytowanie w materiale ofertowym to dowód przeciwko
płatnikowi w sporze z ZUS** (brak należytej staranności).

---

## 2. ⚡ ALERTY LEGISLACYJNE — KIERUNEK ZMIAN JEST ZAWĘŻAJĄCY

Nowelizacja rozporządzeniem MRiPS z 9.08.2023 (Dz.U. poz. 1665),
w życie **1.09.2023**, **skasowała** z katalogu:

```
§ 2 ust. 1 pkt 1b  → (uchylony)
§ 2 ust. 1 pkt 5   → (uchylony)
§ 2 ust. 1 pkt 31  → (uchylony)  ← dawne wyłączenie składek na ubezpieczenie na życie
§ 2 ust. 1 pkt 32  → (uchylony)  ← j.w.
§ 2 ust. 2, 3, 4   → (uchylone)
```

**Wniosek operacyjny:** ustawodawca systematycznie wycina kanały, które
zaczęły służyć optymalizacji — tak jak wcześniej zniknęły deputaty i
bony. Argument sprzedawcy „mechanizm stabilny, powtarzalny i bezpieczny"
jest **sprzeczny z historią legislacyjną tego aktu**.
Uchylenie nie działa wstecz, ale nie ratuje: pozostaje 5-letnia
ekspozycja za okres sprzed uchylenia (art. 24 ust. 4 usus).

---

## 3. CORE — KONSTRUKCJA AKTU

### § 1 — zasada (to jest reguła, § 2 to wyjątek)

Podstawę wymiaru składek stanowi **przychód w rozumieniu przepisów o PIT**
osiągany przez pracowników u pracodawcy z tytułu zatrudnienia w ramach
stosunku pracy, z zastrzeżeniem art. 18 ust. 2 ustawy oraz § 2.

⛔ **ZASADA WYKŁADNI:** wyłączenia z § 2 są wyjątkiem — **nie wykłada się
ich rozszerzająco**. Ciężar wykazania, że świadczenie mieści się
w wyjątku, spoczywa na **płatniku**, nie na ZUS.

### § 2 ust. 1 — KATALOG ZAMKNIĘTY + ANALIZA POJEMNOŚCI

To jest rdzeń modułu. Kolumna „pojemność" odpowiada na jedyne pytanie,
które ma znaczenie przy ocenie schematu optymalizacyjnego: **ile da się
przez ten punkt przepuścić**.

| Pkt | Przedmiot | Limit W TREŚCI przepisu | Pojemność |
|---|---|---|---|
| 1 | nagrody jubileuszowe | nie częściej niż **co 5 lat** | ❌ |
| 1a | projekty wynalazcze, nagrody za wynalazczość/badania | — | ❌ wąskie |
| 2 | odprawy emerytalno-rentowe | zdarzenie jednorazowe | ❌ |
| 3 | odprawy/odszkodowania/rekompensaty za ustanie stosunku pracy | zdarzenie jednorazowe | ❌ |
| 4 | odszkodowanie z zakazu konkurencji (art. 101² KP) | po ustaniu zatrudnienia | ❌ |
| 6 | świadczenia BHP, ekwiwalent za pranie odzieży, bony na posiłki | tylko gdy pracodawca **mimo obowiązku BHP** nie ma możliwości wydania posiłków | ❌ |
| 7 | odszkodowanie za przedmioty (art. 237¹ § 2 KP) | zdarzeniowe | ❌ |
| 9 | ekwiwalent za narzędzia/materiały/sprzęt **własne pracownika** | zwrot realnego kosztu | ❌ |
| 10 | ubiór służbowy / ekwiwalent | obowiązek używania | ❌ |
| **11** | posiłki, bony, talony, kupony, **karty przedpłacone** na posiłki | **do 450 zł miesięcznie** | ❌ twardy limit |
| 13 | jazdy lokalne pojazdem niebędącym własnością pracodawcy | ryczałt albo stawka za 1 km + **ewidencja przebiegu** | ❌ |
| 14 | zwrot kosztów przeniesienia służbowego | do kwoty zwolnionej z PIT | ❌ |
| 15 | diety i należności z podróży służbowej | do wysokości z przepisów o sferze budżetowej | ❌ |
| 16 | praca za granicą u polskiego pracodawcy | równowartość diety, **PODŁOGA: nie niżej niż przeciętne wynagrodzenie (art. 19 ust. 1 usus)** | ⚠️ tylko delegowanie |
| 16a | dodatek walutowy nauczycieli za granicą | podmiotowo wąskie | ❌ |
| 17 | dodatki dewizowe marynarzy | **75 %** dodatków | ❌ |
| 18 | dodatek za rozłąkę, strawne | do wysokości diet krajowych | ❌ |
| **19** | **świadczenia z ZFŚS na cele socjalne** | brak limitu w rozporządzeniu — limit **faktyczny**: wielkość odpisu + kryterium socjalne | ❌ fundusz za mały |
| 20 | fundusz socjalno-bytowy z UZP u nietworzących ZFŚS | **rocznie do kwoty odpisu podstawowego** (art. 5 ust. 2 u.ZFŚS) | ❌ |
| 21 | świadczenie urlopowe (art. 3 ust. 4 u.ZFŚS) | **rocznie do odpisu podstawowego** | ❌ |
| 22 | zapomogi losowe | klęska / zdarzenie losowe / długotrwała choroba | ❌ zdarzeniowe |
| 23 | ZFRON / zakładowy fundusz aktywności | **z wyłączeniem wynagrodzeń** z tych funduszy | ❌ |
| 24 | składniki wynagrodzenia za okres choroby/zasiłku | tylko za okres pobierania | ❌ |
| 25 | dodatki uzupełniające 80 % zasiłek chorobowy | łącznie z zasiłkiem **do 100 % przychodu** | ❌ |
| **26** | **korzyści materialne** (zakup po cenach niższych niż detaliczne) | **BRAK LIMITU KWOTOWEGO** | ✅ **jedyne wejście** |
| 27 | karty branżowe, „barbórkowe" itp. | **z wyjątkiem nagród pieniężnych** z tytułu uroczystych dni | ❌ |
| 27a | świadczenie teleinformatyczne (cyberbezpieczeństwo) | podmiotowo wąskie | ❌ |
| 28 | nagrody sportowe | podmiotowo wąskie | ❌ |
| 29 | podnoszenie kwalifikacji zawodowych | **z wyłączeniem wynagrodzeń** za urlop szkoleniowy i zwolnienia z części dnia | ❌ |
| 30 | świadczenie w naturze — działka gruntu | — | ❌ |
| 5, 8, 12, 1b, 31, 32 | **UCHYLONE** | — | ❌ |

### 🔑 USTALENIE KLUCZOWE MODUŁU

> W całym katalogu istnieje **dokładnie jedna** pozycja bez pułapu
> kwotowego: **pkt 26**. Każda oferta obiecująca obniżkę rzędu
> kilkunastu–kilkudziesięciu procent — niezależnie od nazwy produktu
> (tokeny, kafeteria, „program benefitowy", „system motywacyjny",
> „pracowniczy program oszczędnościowy") — **musi** przechodzić przez
> pkt 26. **Nie ma alternatywy arytmetycznej.**
>
> Jeśli doradca twierdzi „to nie pkt 26" i nie wskazuje innego punktu —
> albo nie zna własnego produktu, albo świadomie go nie nazywa.

### § 3 — WYCENA ŚWIADCZEŃ W NATURZE (pułapka pomijana w ofertach)

Wartość pieniężną ustala się wg ekwiwalentu z przepisów o wynagradzaniu,
a w razie ich braku:
1. rzeczy/usługi **z zakresu działalności pracodawcy** → wg cen
   stosowanych wobec **innych odbiorców niż pracownicy**;
2. rzeczy/usługi **zakupione przez pracodawcę** → wg **cen ich zakupu**;
3. lokal mieszkalny → wg czynszu (spółdzielczy / komunalny / prywatny /
   hotel wg rachunków).

⚠️ **Konsekwencja:** przy benefitach kupowanych przez pracodawcę
punktem odniesienia jest **cena zakupu**, a nie „cena detaliczna"
wpisana do regulaminu. Nadwyżka ponad tę wartość jest kwestionowalna
w pierwszej kolejności.

### § 5 — ZAKRES PODMIOTOWY (działa w obie strony)

- § 5 ust. 1 → praca nakładcza, funkcjonariusze SCS, osoby pracujące
  odpłatnie w czasie pozbawienia wolności.
- § 5 ust. 2 → **zleceniobiorcy i umowy o świadczenie usług** oraz
  **członkowie rad nadzorczych** wynagradzani z tytułu funkcji.

⚠️ Rozszerza to zasięg schematu, ale **w identycznym stopniu rozszerza
podstawę ewentualnej decyzji wymiarowej**.

### § 6–§ 9 — 30-krotność (kwota ograniczenia)

Zaprzestanie opłacania po osiągnięciu kwoty ograniczenia — na podstawie
informacji z ZUS **albo własnej dokumentacji płacowej**; przy
przekroczeniu w trakcie miesiąca składka tylko od części nieprzekraczającej;
zwrot nadwyżki w **30 dni** od korekt, a płatnik **niezwłocznie** zwraca
ubezpieczonemu jego część. Przy kilku płatnikach — podział proporcjonalny.

➡️ To **jedyne legalne narzędzie w tym rozporządzeniu dające realną
oszczędność bez ryzyka** — kontrola prawidłowości zastosowania
30-krotności przy wysokich wynagrodzeniach.

### § 10 — odpowiedzialność ubezpieczonego

Podanie przez ubezpieczonego informacji niezgodnych ze stanem faktycznym
(oświadczenie z art. 19 ust. 5 usus) → **on** spłaca całość zadłużenia.

---

## 4. 🚨 DETEKTOR SCHEMATÓW OPTYMALIZACYJNYCH — TRIAGE

Uruchom **zawsze**, gdy w sprawie pojawi się: „optymalizacja składek",
„obniżenie ZUS o X%", „mechanizm", „program benefitowy", „kafeteria",
„legalne zmniejszenie kosztów pracy", „rozwiązanie dla klientów biur
rachunkowych".

### KROK D1 — TEST ARYTMETYCZNY

Rachunek ZUS jest w przybliżeniu proporcjonalny do podstawy wymiaru.

```
Deklarowana obniżka rachunku o X%
  ⇒ wymaga wyprowadzenia z podstawy ≈ X% funduszu płac
```

To **nie jest** „porządek w rozliczeniach" ani korekta stopy wypadkowej.
Przy X ≥ 10 % mówimy o przebudowie struktury wynagradzania widocznej
wprost w deklaracjach (spadek podstawy przy niezmienionym zatrudnieniu).

### KROK D2 — TEST ŹRÓDŁA FINANSOWANIA

Zwrot „**bez dodatkowych obciążeń dla przedsiębiorstwa**" czytać
dosłownie: pracodawca nie dokłada nic ⇒ **środki pochodzą od
pracownika** — z jego składek emerytalnych, rentowych, chorobowych
i z podstawy jego przyszłych świadczeń. Innego źródła nie ma.

### KROK D3 — PYTANIE ROZSTRZYGAJĄCE (zadaj na piśmie)

> „Który punkt § 2 ust. 1 rozporządzenia MPiPS z 18.12.1998 r.
> (t.j. Dz.U. 2025 poz. 316) stanowi podstawę wyłączenia w Państwa
> mechanizmie i jak wyceniają Państwo świadczenie w świetle § 3?"

| Odpowiedź | Ocena | Działanie |
|---|---|---|
| **„pkt 26"** + wzór regulaminu wynagradzania + metoda wyceny | produkt realny, **ale sporny** | ścieżka: interpretacja indywidualna ZUS → umowa z odpowiedzialnością za wynik |
| **„pkt 19"** (ZFŚS) | skala nieosiągalna | policz odpis — 25 % funduszu płac się z niego nie weźmie |
| punkt z limitem (**11 / 20 / 21**) | obietnica **wewnętrznie sprzeczna** z treścią przepisu | odrzuć |
| **„to know-how kancelarii"** / brak wskazania punktu | ⛔ **STOP** | nie da się jednocześnie powoływać na jawne rozporządzenie i odmawiać wskazania jednostki redakcyjnej |

### KROK D4 — CZERWONE FLAGI JĘZYKOWE

```
□ „nawet o X%"                → górna granica bez gwarancji
□ „bez dodatkowych obciążeń"  → koszt przeniesiony, nie wyeliminowany
□ „legalny i sprawdzony"      → brak przepisu/sygnatury = pusty przymiotnik
□ „również dla klientów biur  → model prowizyjny: przychód z dystrybucji,
   rachunkowych/partnerów"       nie z wyniku
□ „warto sprawdzić, czy…"     → zero zobowiązania po stronie oferenta
□ błędna nazwa/data aktu      → brak weryfikacji własnego produktu
□ BRAK klauzuli o odpowiedzialności oferenta za skutki decyzji ZUS ← kluczowe
```

---

## 5. PKT 26 — CZTERY PRZESŁANKI KUMULATYWNE

Brzmienie: *korzyści materialne wynikające z układów zbiorowych pracy,
regulaminów wynagradzania lub przepisów o wynagradzaniu, a polegające na
uprawnieniu do zakupu po cenach niższych niż detaliczne niektórych
artykułów, przedmiotów lub usług oraz korzystaniu z bezpłatnych lub
częściowo odpłatnych przejazdów środkami lokomocji.*

```
□ P1 — KORZYŚĆ MATERIALNA, nie wypłata pieniężna
       ⛔ przelew na konto nigdy nie spełni tej przesłanki
□ P2 — ŹRÓDŁO W AKCIE PRAWA PRACY (UZP / regulamin wynagradzania /
       przepisy o wynagradzaniu — art. 9 KP)
       ⛔ nie decyzja zarządu; ⛔ nie sama DELEGACJA do jej podjęcia
       ✅ dopuszczalna forma: uchwała wspólników (SN II UK 337/09)
□ P3 — UPRAWNIENIE DO ZAKUPU PO CENIE NIŻSZEJ NIŻ DETALICZNA
       → musi istnieć realna cena detaliczna I realny zakup przez pracownika
       → stąd konstrukcja „symbolicznej odpłatności": bez odpłatności
         nie ma „zakupu po cenie niższej", jest darmowe świadczenie
□ P4 — PRZEDMIOT: artykuły, przedmioty LUB usługi
       → główna oś sporu z ZUS przy produktach nietypowych/cyfrowych
□ P5 — WYCENA zgodna z § 3 (patrz wyżej)
```

**Stan sporu (2025–2026):** nawet mechanizmy z **korzystnymi wyrokami**
nie są bezpieczne — organ rentowy nadal wydaje decyzje negatywne
(sprawa benefitu tokenowego: SO Warszawa XXI U 595/23 i SA Warszawa
korzystnie dla płatnika, mimo to decyzja ZUS nr 190/2025 odmowna).
„Sprawdzony mechanizm" znaczy w tej branży **„mechanizm, który już był
przedmiotem sporu"**, a nie „mechanizm, którego ZUS nie kwestionuje".

---

## 6. PKT 19/20 — ZFŚS (delimitacja)

Treść merytoryczna ZFŚS (obowiązek tworzenia, odpis, regulamin,
kryterium socjalne) → **`mod-ustawa-ZFSS.md`**. Tu wyłącznie skutek
składkowy:

- Świadczenie z ZFŚS przyznane **bez kryterium socjalnego** (np.
  wszystkim po równo) **nie jest świadczeniem socjalnym w sensie
  prawnym** → nie korzysta z wyłączenia z pkt 19 → **podlega
  oskładkowaniu** (SN I UK 121/09).
- Miernik: **dochód na członka rodziny**, nie samo wynagrodzenie
  u tego pracodawcy (SN I UK 202/13; SA Białystok III AUa 934/16).
- Odstępstwo na zasadzie powszechnej dostępności — **tylko** imprezy
  integracyjne/turystyczne/kulturalne/sportowe, wymaga wyraźnego zapisu
  w regulaminie i indywidualnej analizy (SN II PK 74/08, II UK 472/13).
- Brak **rzeczywistego zróżnicowania kwot** = brak elementu socjalnego
  (SA Łódź III AUa 2208/15).
- ZUS bada, czy wypłata **nie jest w istocie odpłatnością za pracę**.

---

## 7. KASKADA SANKCJI (przy zakwestionowaniu schematu)

```
[1] SKŁADKOWA
    art. 24 ust. 4 usus  → przedawnienie 5 LAT od wymagalności
                           ⇒ ZUS rekonstruuje 5 lat naraz
    odsetki za zwłokę    → z mocy prawa, brak instytucji „czynnego żalu"
    art. 24 ust. 1a usus → DODATKOWA OPŁATA do 100% nieopłaconych składek
    art. 24 ust. 1b usus → nie wymierza się jej osobie fizycznej skazanej
                           prawomocnie za ten sam czyn

[2] PODATKOWA
    przekwalifikowanie świadczenia → korekta PIT + zaliczek płatnika

[3] WYKROCZENIOWA
    art. 98 usus → grzywna DO 46 000 zł
    ⚡ podwyżka z 5 000 zł od 1.06.2025 (art. 380 pkt 10 ustawy
       z 20.03.2025 o rynku pracy i służbach zatrudnienia,
       Dz.U. 2025 poz. 620) — ponad 9-krotny wzrost
    → cross-ref: mod-ustawa-rynek-pracy-zatrudnienie

[4] KARNA  → kwalifikacja przez dr-03/mod-KK-kwalifikator-karnomaterialny.md
    art. 219 KK  — niezgłoszenie/zgłoszenie nieprawdziwych danych mających
                   wpływ na prawo do świadczeń albo ich wysokość
                   → grzywna / ogr. wolności / do 2 LAT
                   ⛔ ZGODA PRACOWNIKA NIE JEST KONTRATYPEM
                      (przepis wprost: „nawet za zgodą zainteresowanego")
                   → występek umyślny (zamiar bezpośredni LUB ewentualny)
    art. 218 § 1a KK — złośliwe LUB uporczywe naruszanie praw pracownika
                   → „uporczywość" = wielokrotność/długotrwałość;
                     schemat stosowany co miesiąc przez lata = definicja
    zbieg: art. 218 § 1a w zb. z art. 219 w zw. z art. 11 § 2 KK
    ⚠️ ZUS ma status POKRZYWDZONEGO w takim postępowaniu (art. 49 § 3 KPK)

[5] PRACOWNICZA (najczęściej pomijana w ofertach)
    obniżona podstawa ⇒ niższy zasiłek chorobowy, macierzyński,
    niższa podstawa emerytury i kapitału początkowego
    ⇒ roszczenia odszkodowawcze CAŁEJ ZAŁOGI naraz

[6] DORADCY / BIURA RACHUNKOWEGO
    odpowiedzialność kontraktowa za rekomendację;
    OC zwykle NIE obejmuje szkód z celowej optymalizacji zakwestionowanej
    przez organ. Prowizja jednorazowa — ekspozycja pięcioletnia.
```

---

## 8. ORZECZNICTWO (⚠️ RZĄD 2 — przed użyciem procesowym odczytaj
uzasadnienia w sn.pl / orzeczenia.ms.gov.pl)

| Sygnatura | Teza operacyjna |
|---|---|
| SN **I UK 121/09** (16.09.2009, OSNP 2011/9–10/133) | świadczenie z ZFŚS z pominięciem kryterium socjalnego **nie jest** świadczeniem socjalnym → oskładkowane; regulamin nie może zmienić zasady |
| SN **I UK 202/13** (8.01.2014) | miernikiem jest **dochód na członka rodziny** |
| SN **II UK 472/13** (10.07.2014) | odstępstwo od kryterium socjalnego wymaga wyraźnego zapisu w regulaminie + indywidualnej analizy |
| SN **II PK 74/08** (23.10.2008) | kryterium socjalne nie obejmuje całości działalności socjalnej |
| SN **II UK 337/09** (6.05.2010) | „przepisy o wynagradzaniu" z pkt 26 mogą mieć formę **uchwały wspólników** |
| SN **II UK 172/07** (3.04.2008) | ekwiwalenty za dojazdy z UZP/regulaminu podlegają wyłączeniu |
| SN **I PK 194/07** (22.02.2008, OSNP 2009/11-12/133) | regulamin wynagradzania może być ujęty w kilku dokumentach (art. 9 § 1 KP) |
| SA Gdańsk **III AUa 191/16** (10.05.2016) | sama **delegacja** w UZP dla dyrektora ≠ spełnienie pkt 26 |
| SA Łódź **III AUa 2208/15** (7.12.2016) | brak rzeczywistego zróżnicowania kwot = brak elementu socjalnego |
| SA Białystok **III AUa 934/16** (4.04.2017) | „im niższe wynagrodzenie, tym wyższe świadczenie" bez analizy dochodu na osobę = brak kryterium |
| SO Warszawa **XXI U 595/23** + SA Warszawa | benefit cyfrowy przy częściowej odpłatności mieści się w pkt 26 — **mimo to ZUS wydał decyzję odmowną nr 190/2025** |
| TK — § 2 ust. 1 pkt 6 i pkt 16 | oba punkty były przedmiotem kontroli konstytucyjnej → przy powoływaniu **sprawdź trybunal.gov.pl** |

---

## 9. INTERPRETACJA INDYWIDUALNA ZUS

Jedyna sensowna ścieżka zabezpieczenia **przed** wdrożeniem.
Tryb, właściwość oddziałów, milcząca zgoda, wzór wniosku:
→ `mod-SUS-ZUS-ubezpieczenia-spoleczne.md` **ANEKS D**
→ wzór SPJ: `pisma-proste-v2`

⚠️ Interpretacja chroni **wyłącznie** przy zgodnym z prawdą i **pełnym**
opisie stanu faktycznego. Wniosek na wzorcu dostawcy, a nie na własnym
stanie faktycznym, nie chroni.

---

## 10. QUALITY GATE

```
□ Czy odczytano AKTUALNY t.j. rozporządzenia (nie wersję z pamięci)?
□ Czy wskazano KONKRETNY punkt § 2 ust. 1 — nie „rozporządzenie" ogólnie?
□ Czy sprawdzono, że punkt NIE jest uchylony (1b, 5, 8, 12, 31, 32)?
□ Czy zastosowano limit kwotowy przypisany do punktu (450 zł / odpis / 75% / 100%)?
□ Czy przeprowadzono TEST ARYTMETYCZNY (D1) dla deklarowanej skali obniżki?
□ Czy wskazano ŹRÓDŁO FINANSOWANIA oszczędności (D2) — kto realnie płaci?
□ Czy przy pkt 26 sprawdzono WSZYSTKIE 5 przesłanek (P1-P5), w tym § 3?
□ Czy przy ZFŚS sprawdzono kryterium socjalne i RZECZYWISTE zróżnicowanie kwot?
□ Czy przedstawiono PEŁNĄ kaskadę sankcji [1]-[6], w tym skutki dla pracowników?
□ Czy — przy wątku karnym — wczytano dr-03/mod-KK-kwalifikator-karnomaterialny.md?
□ Czy zaznaczono, że orzecznictwo z sekcji 8 wymaga weryfikacji uzasadnień?
□ Czy DISCLAIMER jest ostatnim elementem odpowiedzi?
```

---

## 11. OUTPUT

- **Analiza oferty optymalizacyjnej** → sekcja 4 (D1–D4) + kaskada sankcji
- **Ocena istniejącego wdrożenia** → sekcja 5 (P1–P5) + § 3 + QG
- **Spór z ZUS (decyzja wymiarowa)** → `analiza-sadowa-v6` +
  `orzeczenia-sadowe-v2`; odwołanie → **sąd powszechny (SO, wydział
  pracy i ubezpieczeń społecznych)**, ⛔ NIE WSA — patrz zasada absolutna
  w `mod-SUS-ZUS-ubezpieczenia-spoleczne` sekcja 3
- **Wniosek o interpretację indywidualną** → `pisma-proste-v2`

---

## 12. POWIĄZANIA I DELIMITACJA (anty-duplikacja)

| Moduł | Podział zakresu |
|---|---|
| `mod-SUS-ZUS-ubezpieczenia-spoleczne` | ustawa systemowa + perspektywa **UBEZPIECZONEGO** (emerytura, renta, odwołanie). **Tu:** perspektywa **PŁATNIKA** i **podstawa wymiaru**. Zero nakładki. |
| `mod-ustawa-ZFSS` | ustawa o ZFŚS — obowiązek, odpis, regulamin, kryterium socjalne. **Tu:** wyłącznie skutek składkowy (pkt 19/20), z odesłaniem. |
| `mod-obchodzenie-prawa-pracy-reforma-PIP-2026` | **UKRYWANIE** przychodu („pod stołem", praca na czarno) — czyn ewidentnie nielegalny. **Tu:** **PRZEKWALIFIKOWANIE** przychodu na wyłączony z podstawy — konstrukcja formalnie jawna, sporna co do skutku. **Różne zjawiska, różne linie obrony.** |
| `mod-KP-dzial-III-wynagrodzenie-swiadczenia-jawnosc` | art. 77¹–93 KP, składniki wynagrodzenia. **Tu:** ich kwalifikacja składkowa. |
| `mod-ustawa-rynek-pracy-zatrudnienie` | Dz.U. 2025 poz. 620 — **źródło** podwyżki grzywny z art. 98 usus od 1.06.2025 |
| `dr-03/mod-KK-kwalifikator-karnomaterialny` | kwalifikacja art. 219 / 218 § 1a KK (UP-3) |
| `dr-06/mod-PIT-podatek-dochodowy-fizyczne` | skutek podatkowy przekwalifikowania świadczenia |
| `analizator-umow-v1` | ocena umowy z dostawcą „mechanizmu" (klauzula odpowiedzialności za wynik!) |

---

## ŹRÓDŁA ONLINE

```
RZĄD 1: api.sejm.gov.pl/eli/acts/DU/2025/316/text.pdf  (pełny t.j.)
        isap.sejm.gov.pl → WDU19981611106
        isap.sejm.gov.pl → WDU19981370887 (ustawa systemowa)
        trybunal.gov.pl (kontrola § 2 ust. 1 pkt 6 i pkt 16)
        sn.pl · orzeczenia.ms.gov.pl · saos.org.pl
RZĄD 2A: przepisy.gofin.pl · inforlex.pl · lexlege.pl · arslege.pl
```

---

*mod-ROZP-SKLADKOWE-podstawa-wymiaru v1.0.0 · DR-04*
*Tekst rozporządzenia zweryfikowany bezpośrednio w Dz.U. 2026-08-13.*
*Orzecznictwo — poziom RZĄD 2, wymaga odczytu uzasadnień przed użyciem procesowym.*
*Zakaz cytowania punktów i limitów z pamięci modelu — katalog był i będzie nowelizowany.*
