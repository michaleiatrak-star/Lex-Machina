---
name: dr-06-podatki-finanse-publiczne-aml
version: 3.40
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

## Moduły (30 łącznie — ✓ 30 OK, ☐ 0 STUB)

**Aktualizacja 2026-08-11 — TRANSZA 3 UZUPEŁNIENIA LUK MAPY POKRYCIA
DZIEDZINY AKCYZOWEJ — WSZYSTKIE POZYCJE 🔴 DOMKNIĘTE (ZASADA 11):**
- `mod-ustawa-akcyzowa-i-clo-UCC.md` → v1.3.0: cztery ostatnie sekcje:
  - **1j Przemieszczanie poza zawieszeniem — System e-DD** (art.
    46a-46w) — mechanizm e-DD, termin 30 dni (węgiel: 47), potwierdzenie
    odbioru, powiązanie z karą pieniężną art. 138u
  - **1k Wyroby poza zawieszeniem — UDT** (art. 77-83a) —
    uproszczony dokument towarzyszący (3 karty), obowiązki nabywcy
    WNT, termin 10 dni na deklarację uproszczoną
  - **1l Zezwolenia zbiorczo + przedsiębiorstwo w spadku** (art. 84,
    84a-84f) — mechanizm odesłań do przepisów macierzystych, ciągłość
    zezwoleń przy sukcesji, zwolnienie z zabezpieczenia
  - **1m Postępowanie przy imporcie** (art. 27-29a) — trzy dokumenty
    rozliczeniowe, decyzja naczelnika, termin 10 dni na dopłatę
- ⭐⭐ MAPA POKRYCIA: 🟢 14 → **19/27 (52%→70%)**, 🟡 8, 🔴 5→**0** —
  **WSZYSTKIE pozycje 🔴 domknięte** (proces trzytranszowy zakończony)
- Pozostaje 8 pozycji 🟡 wymagających rozszerzenia istniejącej treści
  (nie tworzenia od zera) — niższy priorytet, do przyszłych sesji
- Zweryfikowano m.in. w Rządzie 1: finanse-arch.mf.gov.pl (UDT)

**Aktualizacja 2026-08-11 — TRANSZA 2 UZUPEŁNIENIA LUK MAPY POKRYCIA
DZIEDZINY AKCYZOWEJ (kontynuacja, ZASADA 11):**
- `mod-ustawa-akcyzowa-i-clo-UCC.md` → v1.2.0: pięć nowych sekcji:
  - **1e Rejestracja podmiotów — CRPA** (art. 16-20) — termin przed
    pierwszą czynnością, wyłączenia (PPT, oleje), sankcja KKS + czynny
    żal, termin aktualizacji danych 7 dni
  - **1f Rejestracja PPT** (art. 20a-20o) — rejestr ODRĘBNY od CRPA,
    Dyrektor IAS w Poznaniu (właściwość centralna)
  - **1g Deklaracje/terminy ogólne** (art. 21-26) — reguła 25. dnia
    następnego miesiąca, terminy szczególne (węgiel: 2. miesiąc),
    mechanizm przedpłaty, forma elektroniczna obowiązkowa (art. 24d)
  - **1h Podmiot pośredniczący** (art. 56-56a) — definicja (art. 2 ust.
    1 pkt 23), warunki zezwolenia (art. 56, max 3 lata), zabezpieczenie
    importowe
  - **1i Ewidencje** (Dział VIA, art. 138a-138ta) — katalog ewidencji,
    forma papierowa/elektroniczna (art. 138p), możliwość zastąpienia
    dokumentacją rachunkową, przechowywanie 5 lat
- ⭐ MAPA POKRYCIA: 🟢 11 → **14/27 (41%→52%)**, 🟡 8, 🔴 7→**5**
- Zweryfikowano m.in. w Rządzie 1: biznes.gov.pl (rejestracja CRPA/
  podmiot pośredniczący), podatki.gov.pl (forma ewidencji)

**Aktualizacja 2026-08-11 — UZUPEŁNIENIE LUK MAPY POKRYCIA DZIEDZINY
AKCYZOWEJ (kontynuacja audytu pokrycia tematycznego, ZASADA 11):**
- `mod-ustawa-akcyzowa-i-clo-UCC.md` → v1.1.0 (pierwszy raz oznaczony
  numerem wersji): cztery nowe sekcje uzupełniające zidentyfikowane
  luki zerowe/krytyczne:
  - **1a Zabezpieczenie akcyzowe** (Dział III rozdz. 6, art. 63-76) —
    generalne vs ryczałtowe, 5 form (depozyt, gwarancja, czek, weksel,
    hipoteka do 65% wartości nieruchomości), odmowa przyjęcia,
    wygaśnięcie zobowiązania
  - **1b Normy dopuszczalnych ubytków** (Dział III rozdz. 9, art. 85)
    — dwa tryby ustalania (wniosek/z urzędu), kryteria, rozliczenie
    ponad normę, okres przejściowy 6 miesięcy dla nowych podmiotów
  - **1c Znaki akcyzy + kary pieniężne** (Dział VI art. 114-138w, Dział
    VIb art. 138u-138w) — podatkowe vs legalizacyjne banderole, zakaz
    sprzedaży bez oznaczenia, mechanizm kar administracyjnych (5000
    zł, termin 7 dni, przedawnienie 5 lat) na przykładzie art. 138u
  - **1d Akcyza na samochody osobowe** (Dział V, art. 100-113a) —
    przedmiot opodatkowania (CN 8703), terminy 14/30 dni (deklaracja
    vs zapłata — częsty błąd praktyczny), stawki, zwolnienia
    elektryki/hybrydy (art. 109a)
- ⭐ MAPA POKRYCIA DZIEDZINY (nowa, 27 pozycji, analogicznie do u.o.r.):
  🟢 5 → **11/27 (19%→41%)**, 🟡 9, 🔴 13→**7**
- ⚠️ NAPRAWIONA pozostałość nieaktualnego t.j. w aneksie WIA (linia
  cytowała wciąż "Dz.U. 2025 poz. 126" mimo że tabela aktów już miała
  poprawiony numer poz. 412 z poprzedniej sesji) — teraz potwierdzone
  BEZPOŚREDNIO w Rządzie 1 (isap.sejm.gov.pl, eli.gov.pl, api.sejm.gov.pl)
- SYNC: `dr-06/MAPA-AKTOW.md` i `prawo-polskie-v2/ROUTING-MAP.md`
  zaktualizowane w tej samej sesji (nie odłożone na później)
- Pozostaje 7 pozycji 🔴 (deklaracje/terminy ogólne, rejestracja
  podmiotów, podmiot pośredniczący, przemieszczanie poza zawieszeniem,
  zezwolenia, UDT, ewidencje) — priorytetyzowane w module do kolejnej
  transzy

**Aktualizacja 2026-08-11 — TRANSZA 3 audytu pokrycia rachunkowo-księgowego
(kontynuacja AUDYT-2026-08-11v, ZASADA 11 — audyt merytoryczny):**
- `mod-ustawa-rachunkowosci.md` → v1.11.0: nowa sekcja 5h — art. 42-44
  (trzy reżimy ustalania wyniku finansowego netto: jednostki ogólne /
  banki / zakłady ubezpieczeń-reasekuracji) oraz odpowiedzialność
  cywilna na gruncie KSH (art. 293 sp. z o.o. / art. 483 S.A.,
  business judgment rule od 13.10.2022, relacja do art. 4 ust. 5
  u.o.r. jako reżimy równoległe)
- art. 35d u.o.r. (REZERWY) — placeholder z sekcji 5f zastąpiony pełną
  treścią (przesłanki tworzenia, ujęcie w kosztach/przychodach,
  powiązanie z KSR 6, rozjazd podatkowy PIT/CIT)
- ⭐ MAPA POKRYCIA: 🟢 17 → **19 z 20 (95%)**, 🟡 3 → **1**, 🔴 0 —
  domknięto #8 (wycena, w tym rezerwy i wynik finansowy) i #17
  (odpowiedzialność cywilna). Jedyna pozostała 🟡: #10 sprawozdanie z
  działalności (treść merytoryczna, punkt startowy KSR 9)
- Zweryfikowano (Rząd 2A/2B, próg ZASADY 14 spełniony ≥2-3 źródła
  niezależne na każdy artykuł): lexlege.pl, arslege.pl (art. 35d,
  42-44, 293 KSH), poradnikprzedsiebiorcy.pl, sytyadwokaci.pl,
  poradca.pl (business judgment rule)
- ⚠️ Świadomie NIEZAMKNIĘTE: dokładne terminy przedawnienia roszczenia
  art. 293/483 KSH; odpowiedzialność KARNA za błędy księgowe (art.
  587-591 KSH) — poza zakresem pozycji #17 (WYŁĄCZNIE cywilna)

**Aktualizacja 2026-08-11v — TRANSZA 2 audytu pokrycia (AUDYT-2026-08-11v):**
- Nowy moduł: `mod-rachunkowosc-budzetowa-JSFP.md` — ⚠️ fraza
  „rachunkowość budżetowa" miała ZERO wystąpień w całym systemie, mimo
  rozbudowanego UFP/NIK/RIO w DR-06 i całej dziedziny JST w DR-08.
  Rozporządzenie MRiF z 13.09.2017, ⭐ NOWY t.j. **Dz.U. 2026 poz. 909**
  (ogł. 7.07.2026) — poprzednie: 2025.347, 2020.342, pierwotne 2017.1911
- `mod-ustawa-rachunkowosci.md` → v1.10.0: sekcja 5f (art. 30 waluty,
  art. 32 amortyzacja, art. 35b odpisy na należności) + sekcja 5g
  (Krajowe Standardy Rachunkowości — soft law, art. 10 ust. 3 u.o.r.,
  publikacja w Dz.Urz. MF). ⭐ MAPA POKRYCIA: 🟢 16 → **17 z 20 (85%)**,
  🔴 **0** — ostatnia luka (waluty) domknięta
- ⚠️ KOREKTA ZAKRESU: rozdz. 4 u.o.r. to art. **28-44**, nie „28-42"
- ⚠️ SYNC MAP: `prawo-polskie-v2/ROUTING-MAP.md` zaktualizowana o
  wszystkie akty z transz 1 i 2 + naprawiony dryf akcyzy (patrz niżej)

**Aktualizacja 2026-08-11u — AUDYT POKRYCIA TEMATÓW RACHUNKOWO-KSIĘGOWYCH
(ZASADA 11, audyt zakresowy dziedziny; pełny wpis: audyt-systemu-v4/
references/AUDIT-JOURNAL.md, AUDYT-2026-08-11u):**
- ⭐⭐⭐ TRZY NOWE MODUŁY zamykające luki wykryte grepem po CAŁYM systemie:
  - `mod-PKPiR-ewidencje-uproszczone.md` — PKPiR miała dotąd wyłącznie
    wzmianki; ⭐ NOWE ROZPORZĄDZENIE Dz.U. 2025 poz. 1299 (od 1.01.2026)
    zastąpiło Dz.U. 2019 poz. 2544; obowiązkowa postać elektroniczna
    (JPK_PKPIR), nowy wzór 19 kolumn z numerem KSeF, historia progu
    2 → 2,5 mln EUR (Dz.U. 2024 poz. 1863)
  - `mod-kasy-rejestrujace-fiskalizacja.md` — ⚠️ ZEROWE pokrycie w całym
    systemie przed tą sesją (0 wystąpień frazy „kasa fiskalna/
    rejestrująca"); art. 111 VAT, limit 20 000 zł, katalog bezwzględny
    § 4, sankcja 30%, ulga 700 zł i jej utrata
  - `mod-JPK-ksiegi-elektroniczne-e-sprawozdania.md` — JPK_KR_PD/
    JPK_ST_KR, 3 tury wdrożenia, ⭐ TERMIN ZMIENIONY DWUKROTNIE W 2026
    (rozp. Dz.U. 2026 poz. 188 → ustawa Dz.U. 2026 poz. 779, trwale
    7 miesięcy od 1.07.2026), e-sprawozdania art. 45 ust. 1f-1h
- `mod-ustawa-rachunkowosci.md` → v1.9.0: +4 sekcje (5b przechowywanie
  art. 71-76, 5c usługowe prowadzenie ksiąg rozdz. 8a, 5d konsolidacja
  rozdz. 6, 5e ESG/CSRD). Mapa pokrycia: 🟢 9→16 z 20 (45% → 80%)
- ⚠️ NAPRAWIONE ZERWANE ODESŁANIE: temat ESG/CSRD był odsyłany „do
  DR-15" — grep wykazał 0 wystąpień „ESG"/„CSRD" w dr-15. Temat
  osadzony tam, gdzie ma podstawę normatywną: w u.o.r.

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
               — stawka 0,0366%, progi 4/2 mld zł], podatek od gier,
               tonażowy, opłata cukrowa, podatek od sprzedaży
               detalicznej [3 ostatnie oznaczone jako punkt startowy].
               Odpowiedź na audyt pokrycia prawa podatkowego)
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
  [✓] NOWY  mod-rachunkowosc-budzetowa-JSFP
              (NOWY 2026-08-11v: ⚠️ temat o ZEROWYM pokryciu w całym
               systemie; rozporządzenie MRiF 13.09.2017 — t.j. Dz.U.
               2026 poz. 909; plany kont zał. 1-4, zakładowy plan
               kont § 20 jako oś sporów z RIO, skonsolidowany bilans
               JST § 29 przez odesłanie do rozdz. 6 u.o.r.)
  [✓] NOWY  mod-PKPiR-ewidencje-uproszczone
              (NOWY 2026-08-11u: rozporządzenie MFiG 6.09.2025 —
               Dz.U. 2025 poz. 1299, w życie 1.01.2026, zastąpiło
               Dz.U. 2019 poz. 2544; JPK_PKPIR/JPK_ST harmonogram
               2026/2027; nowy wzór 19 kolumn — kolumna 3 = numer
               KSeF; historia progu 2→2,5 mln EUR + zmiana sposobu
               liczenia; rzetelność vs wadliwość księgi)
  [✓] NOWY  mod-kasy-rejestrujace-fiskalizacja
              (NOWY 2026-08-11u: ⚠️ temat o ZEROWYM pokryciu w całym
               systemie przed tą sesją; art. 111 ustawy o VAT, trzy
               warstwy zwolnień, katalog bezwzględny § 4, sankcja
               30% podatku naliczonego + uchwała NSA FPS 7/98,
               ulga 700 zł i obowiązek zwrotu w 3 lata)
  [✓] NOWY  mod-JPK-ksiegi-elektroniczne-e-sprawozdania
              (NOWY 2026-08-11u: JPK_KR_PD i JPK_ST_KR jako DWIE
               odrębne struktury, 3 tury wdrożenia, ⭐ termin 7
               miesięcy — rozp. Dz.U. 2026 poz. 188 tymczasowo,
               ustawa Dz.U. 2026 poz. 779 trwale od 1.07.2026;
               e-sprawozdania art. 45 ust. 1f/1g/1h — MF NIE
               publikuje struktur dla MSR)
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
