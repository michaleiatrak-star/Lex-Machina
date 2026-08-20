# Moduł — VAT: import towarów — wymiar i pobór (Dział VII, art. 33–40), procedura uproszczona art. 33a, miejsce świadczenia przy imporcie (art. 26a), zwolnienia z tytułu importu (Dział VIII rozdz. 3, art. 45–82a)

> **Akt:** ustawa z 11.03.2004 o podatku od towarów i usług — **t.j. Dz.U. 2025 poz. 775**.
> ⚠️ NOWELIZACJE PO t.j.: Dz.U. 2025 poz. 894, 896, 1203, 1811; Dz.U. 2026 poz. 507, 846.
>
> ⛔ **HARD GATE — `shared/PRAWO-HARDGATE.md`.** Ten moduł opisuje obszar
> o najwyższej w całej ustawie gęstości odesłań do prawa celnego UE (UKC)
> i do rozporządzeń wykonawczych. Żadna kwota progowa ani warunek proceduralny
> NIE może być użyty bez weryfikacji w ISAP i w przepisach celnych na datę
> zgłoszenia celnego.
>
> ⚠️ **PRZYPOMNIENIE GLOBALNE RODZINY mod-VAT-*:** termin podstawowy zwrotu
> różnicy podatku wynosi **40 dni** (art. 87 ust. 2 zd. 1), **NIE 60**.

**Utworzony 2026-08-12** (audyt pokrycia VAT, iteracja VII).
**Domyka NAJSŁABSZY dział całej ustawy** — Dział VII był pokryty w ~5%
(jedna wzmianka o art. 33a przy odliczeniu), a Dział VIII rozdz. 3 w 0%.

> ⭐⭐⭐ **DLACZEGO TO BYŁA LUKA STRUKTURALNA, NIE DROBIAZG:** system miał
> moduły celne (`mod-UCC-clo-taryfa-celna`, `mod-clo-podroznych-limity`),
> ale one opisują reżim **CELNY**. VAT-owy reżim importu to ODRĘBNA warstwa
> w ustawie o VAT — cło i VAT importowy mają wspólne zdarzenie (dług celny),
> ale różne podstawy, różne zwolnienia i różne terminy. Analiza sprawy
> importowej wyłącznie przez moduł celny była z definicji niepełna.

---

## 9a. ⭐⭐ MIEJSCE ŚWIADCZENIA PRZY IMPORCIE (art. 26a) — punkt wejścia

```
⭐ ZASADA (art. 26a ust. 1): miejscem importu jest terytorium państwa
  członkowskiego, na którym towary ZNAJDUJĄ SIĘ W MOMENCIE WPROWADZENIA
  na terytorium UE.
⭐ ust. 2 — WYJĄTEK: gdy towary z chwilą wprowadzenia zostają objęte
  jedną z procedur zawieszających (składowanie celne, odprawa czasowa
  z całkowitym zwolnieniem, uszlachetnianie czynne, tranzyt, wolny
  obszar celny) — miejscem importu jest państwo, w którym towary
  PRZESTAJĄ podlegać tym procedurom.
⛔ SKUTEK PRAKTYCZNY: to jest podstawa tzw. ODPRAWY FISKALNEJ w innym
  państwie UE (np. w Niemczech, Holandii) — towar odprawiany za granicą,
  VAT rozliczany jako WNT w Polsce. ⭐ Nie jest to obejście prawa,
  ale wymaga rejestracji VAT-UE i prawidłowego rozpoznania WNT
  → `mod-VAT-miejsce-swiadczenia-zwolnienia.md`.
```

---

## 9b. ⭐⭐⭐ DZIAŁ VII — WYMIAR I POBÓR PODATKU PRZY IMPORCIE (art. 33–40)

### Model podstawowy (art. 33) — zgłoszenie celne

```
⭐⭐ OBOWIĄZEK PODATKOWY: powstaje z chwilą powstania DŁUGU CELNEGO
  (art. 19a ust. 9 — patrz `mod-VAT-obowiazek-podstawa-zwolnienia-
  nieruchomosci.md`, sekcja 4a).

⭐ art. 33 ust. 1: podatnik jest obowiązany OBLICZYĆ i WYKAZAĆ kwotę
  podatku w **ZGŁOSZENIU CELNYM** (albo w rozliczeniu zamknięcia).
  ⛔ To jest samoobliczenie na dokumencie CELNYM, nie w deklaracji VAT.

⭐⭐ TERMIN ZAPŁATY W MODELU STANDARDOWYM: **10 DNI** od powiadomienia
  przez organ celny o wysokości należności (SAD/PZC).
  ⛔⛔ TO JEST TERMIN CELNY, NIE 25. DZIEŃ MIESIĄCA. Najczęstszy błąd:
  importer przyjmuje kalendarz VAT-owy i wpada w zaległość.
  ⭐ Zweryfikuj DOKŁADNE brzmienie ust. 4 i n. w ISAP — reżim odsyła
  do przepisów celnych.

⭐ SKUTEK EKONOMICZNY: zamrożenie środków — przy stawce 23% blisko
  jedna czwarta wartości ładunku wypływa z firmy w momencie odprawy
  i wraca dopiero przez odliczenie/zwrot. To jest cały powód istnienia
  procedury z art. 33a.

⭐ art. 33 ust. 2–3 — organ celny OKREŚLA podatek w drodze decyzji,
  gdy kwota w zgłoszeniu jest nieprawidłowa.
⭐ art. 33b — DEKLARACJA IMPORTOWA (VAT-IM, VAT-IM/A) przy odprawie
  scentralizowanej.
⭐ art. 34–37 — decyzje organu celnego, korekty, zabezpieczenia.
⭐ art. 38–40 — odpowiednie stosowanie przepisów celnych; zwrot podatku
  nienależnie pobranego. ⛔ Zweryfikuj zakres odesłania w ISAP przed
  budowaniem argumentacji na przepisach UKC.
```

### ⭐⭐⭐ PROCEDURA UPROSZCZONA (art. 33a) — rozliczenie w JPK_V7

```
⭐⭐⭐ ISTOTA: zamiast fizycznej wpłaty do organu celno-skarbowego —
  wykazanie podatku należnego z tytułu importu w **deklaracji JPK_V7**
  za okres, w którym powstał obowiązek podatkowy, z jednoczesnym
  wykazaniem tej samej kwoty jako naliczonego (o ile przysługuje prawo
  do odliczenia). EFEKT: rozliczenie BEZGOTÓWKOWE, brak zamrożenia
  środków.

⭐⭐ WARUNKI (art. 33a ust. 2 i n.) — sprawdzaj ŁĄCZNIE:
  □ status **zarejestrowanego podatnika VAT CZYNNEGO**
  □ przedstawienie naczelnikowi urzędu celno-skarbowego zaświadczeń
    o BRAKU ZALEGŁOŚCI we wpłatach należnych podatków oraz składek
    na ubezpieczenie społeczne (⭐ zaświadczenia mają ograniczony
    okres ważności — w praktyce ok. 6 miesięcy; zweryfikuj aktualny
    wymóg, bo bywa zastępowany OŚWIADCZENIEM)
  □ zawiadomienie/wniosek do naczelnika UCS o zamiarze stosowania
    art. 33a
  □ ⭐ ALTERNATYWA: status **AEO** (upoważniony przedsiębiorca,
    art. 38 UKC) albo pozwolenie na stosowanie uproszczeń celnych
    (art. 166 UKC — zgłoszenie uproszczone / wpis do rejestru
    zgłaszającego) — daje łagodniejszy reżim

⛔⛔ SKUTEK UBOCZNY, KTÓRY BYWA POMIJANY: skorzystanie z art. 33a
  wiąże się z obowiązkiem rozliczania VAT **MIESIĘCZNIE** — dla firmy
  na kwartałach oznacza to trwałą zmianę rytmu sprawozdawczego.
  ⭐ SPRZĘŻENIE: to jest realny konflikt z art. 21 (metoda kasowa)
  i art. 99 ust. 2–3 → `mod-VAT-rejestracja-zaplata-metoda-kasowa-
  likwidacja.md`, sekcja 6c. Doradzając art. 33a małemu podatnikowi,
  policz koszt utraty kwartalnego rozliczenia.
```

### ⛔⛔ SANKCJA ZA NIEROZLICZENIE — MECHANIZM DWUSTOPNIOWY

```
⭐ KROK 1 — OKNO NAPRAWCZE: gdy podatnik nie rozliczył w całości
  lub w części podatku należnego z importu w deklaracji za właściwy
  okres, może dokonać KOREKTY deklaracji w terminie **4 MIESIĘCY**,
  licząc od miesiąca NASTĘPUJĄCEGO po miesiącu powstania obowiązku
  podatkowego.
  ⭐ WARIANT DLA UPROSZCZEŃ CELNYCH (art. 33a ust. 6a pkt 2):
  podatnik korzystający z art. 166 UKC i posiadający status AEO
  ma prawo do korekty PO upływie 4 miesięcy, nie później jednak niż
  miesiąc po upływie terminu na złożenie zgłoszenia uzupełniającego.
  ⛔ Zweryfikuj aktualną redakcję ust. 6/6a w ISAP.

⛔ KROK 2 — UTRATA PRAWA: po bezskutecznym upływie terminu podatnik
  TRACI prawo do rozliczania w deklaracji podatku z tego zgłoszenia
  celnego → obowiązek ZAPŁATY kwoty podatku WRAZ Z ODSETKAMI.

⛔⛔ KROK 3 — SANKCJA SYSTEMOWA (najdotkliwsza): naczelnik urzędu
  celno-skarbowego może w drodze decyzji POZBAWIĆ podatnika prawa
  do korzystania z procedury uproszczonej na okres **36 MIESIĘCY**,
  licząc od okresu rozliczeniowego następującego po miesiącu
  doręczenia decyzji.
  ⭐ DECYZJA MA CHARAKTER FAKULTATYWNY („może") — to jest KLUCZOWY
  punkt zaczepienia obrony: należy wykazać okoliczności przemawiające
  za odstąpieniem (incydentalność, brak uszczuplenia, natychmiastowa
  korekta). ⛔ Zweryfikuj aktualne brzmienie i linię orzeczniczą
  w orzeczenia.nsa.gov.pl przez `orzeczenia-sadowe-v2`.
  ⭐ Decyzja → odwołanie 14 dni (Ordynacja) → `mod-OP-ordynacja-podatkowa`.

⭐ KOREKTA PO ZAPŁACIE: gdy podatnik zapłacił podatek organowi celnemu
  (z uwagi na niedochowanie wymogów), a wykazał go też w deklaracji —
  koryguje w deklaracji za okres, w którym dokonał wpłaty.
```

### ⭐ SYSTEMY I DOKUMENTY

```
⭐ AIS/IMPORT — system obsługi zgłoszeń przywozowych; wersja
  **AIS/IMPORT PLUS** wdrożona od 19.06.2025.
  ⛔ To jest warstwa TECHNICZNA, zmieniana komunikatami KAS —
  weryfikuj bieżący stan na puesc.gov.pl, nie w tym module.
⭐ Dokumenty: SAD / PZC (poświadczone zgłoszenie celne), VAT-IM,
  VAT-IM/A (odprawa scentralizowana).
⭐ Procedury specjalne wpływające na moment/obowiązek: uszlachetnianie
  czynne i bierne, odprawa czasowa, składowanie celne, tranzyt,
  wolny obszar celny → szczegóły w `mod-UCC-clo-taryfa-celna.md`.
⭐ PODSTAWA OPODATKOWANIA przy imporcie: wartość celna + cło
  + (przy wyrobach akcyzowych) akcyza + koszty dodatkowe —
  art. 30b; ⭐ wartość celna → `mod-UCC-clo-taryfa-celna.md`.
```

---

## 9c. ⭐⭐ DZIAŁ VIII ROZDZ. 3 — ZWOLNIENIA Z TYTUŁU IMPORTU (art. 45–82a)

> **Charakter modułu w tej części: NAWIGACYJNY, nie wyczerpujący.**
> Rozdział liczy ok. 38 artykułów o bardzo drobiazgowej kazuistyce
> (mienie przesiedlenia, wyposażenie szkolne, próbki, materiały
> reklamowe, towary dla organizacji charytatywnych, trumny i urny,
> paliwo w zbiornikach itd.). Budowanie pełnej bazy tych zwolnień
> w module byłoby powielaniem tekstu ustawy — zamiast tego moduł
> daje MAPĘ i wskazuje pułapki.

```
⭐ art. 45 ust. 1 — zwolnienia „procesowe", m.in. import:
  □ towarów objętych procedurą USZLACHETNIANIA CZYNNEGO
  □ towarów objętych ODPRAWĄ CZASOWĄ z całkowitym zwolnieniem
    od należności celnych przywozowych
  □ towarów POWRACAJĄCYCH z państwa trzeciego, zwolnionych od cła,
    dokonywany przez podatnika, który wcześniej te towary wywiózł
    (⭐ tzw. powrotny przywóz — częste przy reklamacjach i targach)
  □ przywożonych do portów własnych połowów przez podmioty
    rybołówstwa morskiego

⭐ art. 46–50 — definicje i zwolnienia dla mienia osobistego /
  przesiedlenia (⭐ warunki co do okresu posiadania i zamieszkiwania
  — zweryfikuj w ISAP przy konkretnej sprawie)

⛔⛔ art. 51 — PRZESYŁKI O MAŁEJ WARTOŚCI (historycznie: równowartość
  **22 EUR**) — ⚠️⚠️ **STATUS WYMAGA BEZWZGLĘDNEJ WERYFIKACJI**:
  pakiet VAT e-commerce zniósł na poziomie unijnym zwolnienie dla
  małych przesyłek (usunięcie tytułu IV dyrektywy 2009/132/WE
  **z dniem 1 lipca 2021 r.**). ⛔ NIE POWOŁUJ progu 22 EUR bez
  sprawdzenia aktualnego statusu art. 51 w ISAP — dostępne opracowania
  opisujące ten próg pochodzą sprzed reformy i są mylące.
  ⭐ W miejsce zniesionego zwolnienia weszła **IOSS** dla przesyłek
  ≤150 EUR → `mod-VAT-podatek-od-towarow-i-uslug.md` (OSS/IOSS)
  oraz art. 138a–138h.

⚠️ art. 52 — przesyłki OD OSOBY FIZYCZNEJ DO OSOBY FIZYCZNEJ
  (równowartość **45 EUR**), przy warunkach: brak przeznaczenia
  handlowego, brak odpłatności wobec nadawcy; z LIMITAMI ILOŚCIOWYMI
  dla alkoholu, tytoniu, perfum (przekroczenie limitu = CAŁKOWITE
  wyłączenie zwolnienia dla danej kategorii).
  ⛔⛔ ALERT ORZECZNICZY: TSUE zakwestionował polską konstrukcję
  art. 52 ust. 1 w zakresie warunku „odbiorcy PRZEBYWAJĄCEGO na
  terytorium kraju" jako niezgodną z dyrektywą.
  ✅ ZWERYFIKOWANE 2026-08-20 (F-19 punkt c) — **TSUE, wyrok z
  8.05.2025, sygn. C-405/24** (polska sprawa prejudycjalna): zwolnienie
  z VAT dla importu przesyłek niehandlowych z art. 52 ust. 1 PRZYSŁUGUJE
  RÓWNIEŻ gdy odbiorca znajduje się w INNYM państwie członkowskim UE niż
  Polska — warunek "przebywania na terytorium kraju" jest NIEZGODNY z
  art. 143 ust. 1 lit. b dyrektywy 2006/112/WE. ✅ WYKONANIE KRAJOWE
  POTWIERDZONE: **NSA, wyrok z 25.07.2025, sygn. I FSK 110/21** —
  zastosował wprost wykładnię TSUE z C-405/24, uwzględniając skargę
  spółki obsługującej celnie import paczek dla odbiorców w Polsce i w
  innych państwach UE. Potwierdzone 3+ źródłami (studio.pwc.pl, mddp.pl,
  lex4you.pl) — BEZPIECZNE do powołania. ⚠️ NIE POTWIERDZONE w tej
  sesji: czy przepis krajowy (art. 52 ust. 1) został formalnie
  ZNOWELIZOWANY w ślad za tym wyrokiem, czy funkcjonuje nadal w
  brzmieniu niezgodnym (z obowiązkiem prounijnej wykładni przez organy)
  — sprawdź aktualny stan w ISAP przed powołaniem w piśmie.

⭐ art. 53–80 — kazuistyka zwolnień celowych (m.in. towary dla
  organizacji charytatywnych, dla osób niepełnosprawnych, próbki,
  materiały reklamowe, dokumenty, wyposażenie naukowe, paliwo
  w standardowych zbiornikach).
⭐ art. 81–82a — delegacje i zwolnienia rozporządzeniowe.
  ⭐⭐ AKT WYKONAWCZY KLUCZOWY: rozporządzenie MF z 20.12.2013
  w sprawie zwolnień od podatku od towarów i usług oraz warunków
  stosowania tych zwolnień (Dz.U. 2013 poz. 1983 ze zm.) —
  ⛔ zweryfikuj aktualny tekst jednolity, akt był wielokrotnie zmieniany.

⭐⭐ ROZGRANICZENIE Z INNYMI MODUŁAMI — kto co pokrywa:
  □ zwolnienia dla PODRÓŻNYCH (bagaż osobisty, limity 300/430 EUR,
    normy alkohol/tytoń) → `mod-clo-podroznych-limity-towary-zabronione.md`
  □ reżim CELNY (CN/TARIC, WIT, wartość celna, procedury UKC)
    → `mod-UCC-clo-taryfa-celna.md`
  □ AKCYZA przy imporcie → `mod-ustawa-akcyzowa-i-clo-UCC.md`
  □ VAT importowy (ten moduł) — warstwa PODATKOWA
  ⛔ W realnej sprawie importowej sprawdza się WSZYSTKIE CZTERY.
```

---

## 10. STRATEGIA / QUALITY GATE

```
□ Ustalono MIEJSCE IMPORTU (art. 26a) przed analizą stawki — czy
  odprawa nie nastąpiła w innym państwie UE (wtedy to WNT, nie import)?
□ Ustalono MOMENT powstania długu celnego (procedury zawieszające!)?
□ Model rozliczenia: standardowy (⛔ 10 DNI) czy art. 33a (JPK_V7)?
□ Przy art. 33a — sprawdzono WSZYSTKIE warunki łącznie oraz skutek
  w postaci obowiązku rozliczeń MIESIĘCZNYCH?
□ Przy uchybieniu w art. 33a — czy okno korekty 4 MIESIĄCE jeszcze
  biegnie? Czy podatnik ma status AEO/art. 166 UKC (dłuższy termin)?
□ Przy decyzji o pozbawieniu prawa na 36 miesięcy — podniesiono
  FAKULTATYWNOŚĆ decyzji jako podstawę obrony?
□ Przy zwolnieniu importowym — sprawdzono STATUS przepisu w ISAP,
  a nie w opracowaniu sprzed 2021 r.? (⛔ pułapka art. 51 / 22 EUR)
□ Czy sprawa nie wymaga równoległego sprawdzenia mod-UCC-clo,
  mod-clo-podroznych i mod-akcyza?
□ Przy przesyłkach ≤150 EUR — rozważono IOSS zamiast zwolnienia?
```

---

## Połącz z
- DR-06/`mod-VAT-podatek-od-towarow-i-uslug` (moduł MACIERZYSTY; OSS/IOSS;
  odliczenie z dokumentów celnych — art. 86 ust. 2 pkt 2)
- DR-06/`mod-UCC-clo-taryfa-celna` (⭐ OBOWIĄZKOWO równolegle: CN/TARIC,
  wartość celna, procedury UKC, WIT)
- DR-06/`mod-clo-podroznych-limity-towary-zabronione` (zwolnienia dla
  podróżnych — ODRĘBNY reżim od art. 45–82a)
- DR-06/`mod-ustawa-akcyzowa-i-clo-UCC` (akcyza przy imporcie; podstawa
  opodatkowania VAT obejmuje akcyzę)
- DR-06/`mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja` (⚠️ konflikt
  art. 33a z metodą kasową / rozliczeniem kwartalnym; art. 103 ust. 1
  zastrzega art. 33 i 33b)
- DR-06/`mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci` (art. 19a
  ust. 9 — obowiązek podatkowy przy imporcie)
- DR-06/`mod-VAT-miejsce-swiadczenia-zwolnienia` (odprawa fiskalna w innym
  państwie UE → WNT w Polsce)
- DR-06/`mod-OP-ordynacja-podatkowa` (odwołanie od decyzji, odsetki)
- `orzeczenia-sadowe-v2` (TSUE ws. art. 52 — ✅ ZWERYFIKOWANE 2026-08-20,
  patrz wyżej; NSA ws. sankcji 36-miesięcznej — ⚠️ F-19 punkt e
  CZĘŚCIOWO: mechanizm ustawowy [art. 33a ust. 10-11 — fakultatywność
  decyzji, wyjątek dla uchybień "nieistotnych"/"sporadycznych"]
  POTWIERDZONY wielokrotnie w źródłach wtórnych, ALE konkretna
  sygnatura NSA budująca "linię orzeczniczą" NIE ZNALEZIONA w tej
  sesji — punkt startowy dla przyszłej sesji, jeśli teza sądowa
  [a nie tylko ustawowa] będzie potrzebna w konkretnej sprawie)

---

## ŹRÓDŁA WERYFIKACJI (zweryfikowane online 2026-08-12)

```
RZĄD 1 — isap.sejm.gov.pl: t.j. Dz.U. 2025 poz. 775 (struktura Działu VII
  i Działu VIII rozdz. 3 potwierdzona)
RZĄD 2 — lexlege.pl / przepisy.gofin.pl (zakresy artykułów, brzmienie
  art. 45, 51, 52)
RZĄD 2 — praktyka art. 33/33a: mddp.pl (01.2026), taxmachine.pl (05.2026 —
  AIS/IMPORT PLUS od 19.06.2025), porozmawiajmyopodatkach.pl, lexplay.pl
  (sankcja 36 miesięcy, fakultatywność decyzji), asl.pl (02.2026)
RZĄD 2 — eur-lex.europa.eu: usunięcie tytułu IV dyrektywy 2009/132/WE
  z 1.07.2021 (zniesienie zwolnienia dla przesyłek ≤22 EUR)
RZĄD 2 — studio.pwc.pl: sygnalizacja wyroku TSUE ws. art. 52 ust. 1
  ✅ ZWERYFIKOWANE 2026-08-20 (F-19 punkt c) — sygnatura C-405/24
  (8.05.2025) POTWIERDZONA, wykonanie krajowe NSA I FSK 110/21
  (25.07.2025) POTWIERDZONE.
```
