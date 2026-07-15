---
name: mod-AD-akcyza-clo

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł podatku akcyzowego. Stosuj ZAWSZE gdy użytkownik pyta o:
  - podatek akcyzowy (wyroby energetyczne, alkohol, tytoń, energia elektryczna,
    samochody osobowe) — stawki, zwolnienia, procedury, składy podatkowe
  - wiążącą informację akcyzową (WIA)
  - naruszenia celno-akcyzowe (KKS — kwalifikator karny-skarbowy)
  Cło, UCC, Nomenklatura Scalona (CN), WIT, wartość celna, FTA/GSP →
  `mod-UCC-clo-taryfa-celna.md` (wydzielony 2026-06-14).
  Powiązane: mod-Q (PIT/VAT/CIT), mod-AC (REACH/chemikalia), mod-L (gospodarcze).
compatibility:
  tools:
    - web_search
    - web_fetch
---

# mod-AD — Akcyza: Podatek Akcyzowy / WIA / KKS

## AKTY PRAWNE — WERYFIKUJ NA ISAP

| Akt | Oznaczenie | Przedmiot |
|-----|-----------|-----------|
| Ustawa akcyzowa | Dz.U. 2025 poz. 126 t.j. | Podatek akcyzowy PL |
| Dyrektywa akcyzowa | 2020/262/UE (Energy Tax Dir.) | Harmonizacja UE — wyroby energet. |
| Dyrektywa 92/83/EWG | zmieniona 2020/1151/UE | Harmonizacja — alkohol |
| KKS | Dz.U. 2025 poz. 633 t.j. | Kodeks karny skarbowy |

> Cło, UCC, Nomenklatura Scalona (CN), TARIC, WIT, wartość celna, preferencje
> FTA/GSP → `mod-UCC-clo-taryfa-celna.md`.

> ⚠ Stawki akcyzy zmieniają się co roku — weryfikuj zawsze.

---

## 1. PODATEK AKCYZOWY — ZAKRES

### Wyroby akcyzowe (art. 2 ustawy akcyzowej)

| Kategoria | Stawka (orientacyjna — weryfikuj!) | Podstawa |
|-----------|-----------------------------------|----------|
| Paliwa silnikowe (benzyna 95) | 1 565,00 zł/1000 l | Zał. nr 2 u.p.a. |
| Olej napędowy (diesel) | 1 196,00 zł/1000 l | Zał. nr 2 u.p.a. |
| Gaz LPG (do napędu) | 670,00 zł/1000 kg | Zał. nr 2 u.p.a. |
| Piwo | 10,00 zł/hl za każdy % Plato | art. 94 u.p.a. |
| Wino (cihe) | 188,00 zł/hl | art. 95 u.p.a. |
| Wyroby spirytusowe | 6 275,00 zł/hl alkoholu | art. 93 u.p.a. |
| Tytoń (papierosy) | 228,10 zł/1000 szt. + 32,05% ceny | art. 99 u.p.a. |
| Energia elektryczna | 5,00 zł/MWh | art. 89 u.p.a. |
| Samochody osobowe (>2000 cm³) | 18,6% podstawy | art. 105 u.p.a. |

> ⚠ **Stawki ulegają corocznej indeksacji** — zawsze weryfikuj aktualną tabelę na:
> https://www.podatki.gov.pl/akcyza/stawki-akcyzy/

### Podatnicy akcyzy (art. 13 u.p.a.)

- Podmiot prowadzący **skład podatkowy** (produkcja, przetwarzanie, magazynowanie)
- **Zarejestrowany odbiorca** (import zwolniony z procedury zawieszenia poboru)
- **Importer** (wwóz spoza UE)
- **Nabywca wewnątrzwspólnotowy** (nabycie z innego kraju UE)

### Procedura zawieszenia poboru akcyzy (art. 40–56 u.p.a.)

```
Skład podatkowy A (PL) → Transport z e-AD → Skład podatkowy B (UE)
         ↓ EMCS (elektroniczny system monitorowania)
Akcyza zawieszona do momentu wyprowadzenia ze składu/dopuszczenia do konsumpcji
```

---

## 2. CŁO / UCC — WYDZIELONE

→ `mod-UCC-clo-taryfa-celna.md`: Nomenklatura Scalona (CN/TARIC), Wiążąca
Informacja Taryfowa (WIT), procedury celne (UCC art. 201-272), wartość celna
(metody wyceny art. 70-74 UCC), preferencje taryfowe i umowy FTA (GSP, CETA,
JEEPA, reguły pochodzenia).

---

## 3. NARUSZENIA — KKS + PRAWO CELNO-AKCYZOWE

### Główne przestępstwa i wykroczenia skarbowe (KKS)

| Czyn | Przepis KKS | Sankcja orientacyjna |
|------|-------------|----------------------|
| Uchylanie się od zapłaty akcyzy | art. 54 KKS | do 720 stawek dziennych / do 5 lat |
| Przemyt akcyzowy (uszczuplenie > małej wartości) | art. 86 KKS | do 720 stawek / do 5 lat |
| Podanie fałszywych danych w zgłoszeniu celnym | art. 87 KKS | do 360 stawek |
| Niedopełnienie obowiązku celnego | art. 91 KKS | grzywna do 720 stawek |
| Przestępstwo celne przy imporcie VAT | art. 86–87 KKS | do 5 lat |

> **Kwalifikator karny:** Przemyt narkotyków, broni lub substancji REACH/ADR → kumulatywna kwalifikacja KKS + KK (art. 55 KK, art. 163 KK, ustawa o przeciwdziałaniu narkomanii).

### Czynny żal (art. 16 KKS)
- Skuteczny do czasu wszczęcia postępowania przez organ
- Wymaga dobrowolnego ujawnienia czynu + uiszczenia uszczuplonej należności
- Pisemnie do właściwego urzędu celno-skarbowego

---

## 4. ORGANY I ŚCIEŻKA ODWOŁAWCZA (AKCYZA)

```
Urząd Celno-Skarbowy (UCS)
  ↓ decyzja I instancji (akcyza)
Dyrektor Izby Administracji Skarbowej (IAS)
  ↓ odwołanie (14 dni od doręczenia decyzji UCS)
Wojewódzki Sąd Administracyjny (WSA)
  ↓ skarga (30 dni od doręczenia decyzji IAS)
Naczelny Sąd Administracyjny (NSA)
  ↓ skarga kasacyjna (30 dni od doręczenia wyroku WSA)
```

> Ścieżka odwoławcza dla cła i WIT (klasyfikacja taryfowa) →
> `mod-UCC-clo-taryfa-celna.md` sekcja 5.

---

## 5. ŚCIEŻKA WERYFIKACJI ONLINE (obowiązkowa)

```
1. Sprawdź stawki akcyzy:
   https://www.podatki.gov.pl/akcyza/stawki-akcyzy/
   https://isap.sejm.gov.pl → ustawa z 6.12.2008 o podatku akcyzowym

2. Sprawdź aktualny tekst KKS:
   https://isap.sejm.gov.pl → Dz.U. 2025 poz. 633 t.j.

Cło/CN/TARIC/WIT/FTA → `mod-UCC-clo-taryfa-celna.md` sekcja 6.
```

---

*mod-AD-akcyza-clo · v1.1 · 2026-06-14 — wydzielono mod-UCC-clo-taryfa-celna.md*
*Powiązane: mod-UCC-clo-taryfa-celna (cło/UCC), mod-Q (PIT/VAT/CIT), mod-AC (REACH/chemikalia), mod-L (gospodarcze)*
*Weryfikacja: isap.sejm.gov.pl*

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- towar/kod CN;
- zdarzenie podatkowe/celne;
- procedura celna;
- dokumenty SAD/JPK;
- organ;
- KKS;

## 2. Mapa proceduralna

```text
Identyfikacja trybu i organu/sądu
  ↓
Kontrola terminu, doręczenia, właściwości i legitymacji
  ↓
Ustalenie faktów materialnych i proceduralnych
  ↓
Matryca dowodowa: fakt → dowód → ciężar dowodu → luka
  ↓
Dobór pisma/środka: wniosek / odwołanie / zażalenie / skarga / pozew / zawiadomienie
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: minimum, optimum, wariant eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb
□ właściwy organ albo sąd
□ termin liczony od prawidłowego zdarzenia
□ legitymacja strony
□ żądanie możliwe prawnie
□ fakty powiązane z podstawą prawną
□ dowody przypisane do każdej tezy
□ kontrola opłat, odpisów, pełnomocnictw i podpisu
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz na dzień orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- dokumenty celne;
- faktury;
- kody CN;
- magazyn/transport;
- decyzje organu;
- ekspertyzy klasyfikacyjne;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- błędna klasyfikacja CN;
- brak dokumentacji przemieszczeń;
- ryzyko KKS;
- przedawnienie i zabezpieczenie;

## 4a. KLASYFIKACJA TARYFOWA CN I OSZUSTWA CELNE (rozbudowane 2026-07-15,
## część 4/6 naprawy braków — wcześniej jeden wyraz bez treści)

### Nomenklatura Scalona (CN) — jak działa klasyfikacja

```
System HS (Zharmonizowany System, Światowa Organizacja Celna) — pierwsze
  6 cyfr, globalny standard, ~200 państw
System CN (Nomenklatura Scalona, rozp. Rady (EWG) 2658/87) — dodaje 2
  cyfry (razem 8), poziom UE, aktualizowana rozporządzeniem co roku
  (publikacja do 31.10, obowiązuje od 1.01 następnego roku)
TARIC — dodaje kolejne 2 cyfry (razem 10), zawiera środki szczególne
  (antydumping, zawieszenia ceł, embarga)
Klasyfikacja opiera się na OBIEKTYWNYCH cechach towaru (skład, funkcja,
  stopień przetworzenia, przeznaczenie) + Ogólne Reguły Interpretacji
  Nomenklatury Scalonej (ORINS) — hierarchia: opis szczegółowy > ogólny;
  przy towarach złożonych decyduje materiał/element nadający zasadniczy
  charakter całości
NARZĘDZIE OCHRONNE: Wiążąca Informacja Taryfowa (WIT) — decyzja Dyrektora
  Izby Administracji Skarbowej, wiąże organy celne przez 3 lata, chroni
  przed sankcjami przy późniejszej kontroli (analogicznie: WIS — wiążąca
  informacja stawkowa VAT, WIA — akcyzowa)
Odpowiedzialność za poprawność kodu CN spoczywa na ZGŁASZAJĄCYM, nawet
  jeśli zlecił zgłoszenie agencji celnej — przeniesienie czynności NIE
  zwalnia z odpowiedzialności
Kontrola postimportowa KAS — możliwa do 3 LAT po odprawie
```

### KWALIFIKACJA KARNOSKARBOWA BŁĘDNEJ KLASYFIKACJI — art. 86-87 KKS

```
⛔ NAJCZĘSTSZY BŁĄD KWALIFIKACYJNY — rozróżnienie art. 86 vs art. 87 KKS:

ART. 86 KKS — PRZEMYT CELNY: towar PRZEWOŻONY POZA KONTROLĄ CELNĄ (brak
  zgłoszenia / brak przedstawienia towaru organowi celnemu w ogóle).
  §1: nieprzedstawienie towaru/zgłoszenia → narażenie należności celnej
  na uszczuplenie — grzywna do 720 stawek dziennych lub PW, albo obie
  §3-4: mała wartość / poniżej progu ustawowego → wykroczenie skarbowe

ART. 87 KKS — OSZUSTWO CELNE: towar ZOSTAŁ ZGŁOSZONY, ale ma INNE CECHY
  niż zadeklarowane (w tym: błędna klasyfikacja taryfowa/kod CN podany
  niezgodnie ze stanem rzeczywistym) — WPROWADZENIE W BŁĄD organu celnego.
  §1: dot. reglamentacji taryfowej (należności celne) — grzywna do 720
      stawek dziennych lub PW, albo obie
  §2: dot. reglamentacji POZATARYFOWEJ (embargo, kontyngenty, zezwolenia)
      — TA SAMA kara, ALE nie wymaga narażenia na uszczuplenie należności
      — wystarczy samo naruszenie reguł obrotu (np. ominięcie kontyngentu)
  §3: mała wartość (5-200-krotność minimalnego wynagrodzenia) — łagodniej
  §4: poniżej progu ustawowego — wykroczenie skarbowe
  "Wprowadzenie w błąd" (SN, V KK 377/04): umyślne wywołanie u organu
    celnego nieadekwatnej oceny okoliczności istotnych dla wymiaru
    należności — obejmuje też PODANIE NIEZGODNYCH danych lub ZATAJENIE
    stanu rzeczywistego (analogia do art. 92 KKS)

⚠️ PRZYKŁAD BŁĘDU SĄDOWEGO (z orzecznictwa, opisany w komentarzach):
  sąd zastosował art. 86 §1 KKS (przemyt) do sytuacji, gdy towar BYŁ
  zgłoszony do odprawy, ale miał inne cechy niż zadeklarowane — to
  klasyczny przypadek art. 87, NIE art. 86 (przemyt wymaga braku
  jakiegokolwiek zgłoszenia). Pomylenie tych dwóch przepisów jest częste
  i ma realne skutki (np. na przedawnienie, bo terminy/opisy czynu różnią
  się między przepisami).

ROZRÓŻNIENIE OD OSZUSTWA Z KK (art. 286 KK):
  Zaniżenie należności celnej/podatkowej to NIE "niekorzystne rozporządzenie
  mieniem" w rozumieniu art. 286 KK — to uniknięcie wydatku z własnego
  majątku kosztem uszczuplenia SPODZIEWANEGO dochodu Skarbu Państwa, więc
  NIE mieści się w znamionach oszustwa zwykłego (SA Katowice, II AKa 153/14;
  potwierdzone też dla podatków w art. 56 KKS — patrz mod-KKS-karny-skarbowy-
  i-AML.md). Wyjątek: WYŁUDZENIE nienależnego zwrotu (np. VAT) MOŻE
  wypełniać znamiona art. 286 KK w określonych układach faktycznych — SN,
  V KK 248/03 — ale tylko gdy dochodzi do faktycznego "rozporządzenia
  mieniem" przez organ (wypłata/zaliczenie zwrotu), nie przy samym
  zaniżeniu zobowiązania.

DODATKOWE PRZESTĘPSTWA W ROZDZIALE 7 KKS (przeciwko obowiązkom celnym):
  Art. 85-86 — nieprzedstawienie towaru/przemyt
  Art. 88 — naruszenie zamknięcia celnego
  Art. 89 — wyłudzenie pozwolenia/dokumentu obrotu z zagranicą przez
    podstępne wprowadzenie w błąd — do 720 stawek dziennych lub 2 lata PW
  Art. 91 — paserstwo celne (nabycie/przechowanie/przewóz towaru z
    przestępstwa celnego) — do 720 stawek dziennych lub 3 lata PW
    (§2: paserstwo NIEUMYŚLNE — powinien i mógł przypuszczać — tylko grzywna)
```

## 6. Strategia procesowa

Zastosuj trzy warianty:

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje naruszenia proceduralne, wadliwość ustaleń, niewłaściwą wykładnię, naruszenie zasady proporcjonalności albo praw strony.

### Wariant eskalacyjny
Zakłada przejście do organu II instancji, WSA/NSA, sądu powszechnego, SN, TSUE, ETPC albo organu sektorowego — tylko gdy wynika to z trybu.

## 7. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy moduł działa praktycznie, a nie opisowo?
□ Czy wskazano decydujący element prawny?
□ Czy oddzielono fakty od interpretacji?
□ Czy podano ryzyka przeciwnika/organu?
□ Czy wskazano słabe punkty klienta?
□ Czy każdy przepis i Dz.U. ma kontrolę ISAP albo oznaczenie braku weryfikacji?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 8. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| analiza sądowa | `analiza-sadowa-v6` |

---

## ANEKS — WIA: WIĄŻĄCA INFORMACJA AKCYZOWA

```
WIA = akcyzowy odpowiednik WIS (Wiążącej Informacji Stawkowej)

Cel: Ustalenie klasyfikacji wyrobu akcyzowego lub kwalifikacji jako wyrób akcyzowy
     PRZED dokonaniem czynności podlegającej akcyzie

Wniosek: Do Dyrektora Izby Administracji Skarbowej właściwego dla wnioskodawcy
Termin na wydanie: 3 miesiące od złożenia wniosku (weryfikuj w ustawie akcyzowej)
Wiążąca: dla organów podatkowych przez 5 lat od dnia wydania
         (chyba że zmianie uległa podstawa klasyfikacji — weryfikuj aktualne przepisy)

Zaskarżenie WIA:
  → Skarga do WSA w 30 dniach od doręczenia

⚠️ Weryfikuj aktualne przepisy o WIA w ustawie akcyzowej (Dz.U. 2025 poz. 126) w ISAP.
web_search: "WIA wiążąca informacja akcyzowa wniosek termin 2025 2026"
```
