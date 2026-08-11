# Rachunkowość budżetowa (JSFP) — moduł podstawowy
v1.0.0 (dodany 2026-08-11v — kontynuacja audytu pokrycia tematów
rachunkowo-księgowych, AUDYT-2026-08-11u)

Zweryfikowano 2026-08-11 (ZASADA 14):
- **Rząd 1:** isap.sejm.gov.pl (metryki WDU20170001911, WDU20200000342),
  gov.pl/web/finanse/akty-prawne-rachunkowosc
- **Rząd 2A:** inforlex.pl (ogłoszenie t.j. 7.07.2026), sip.lex.pl
- **Rząd 2B:** przepisy.gofin.pl (tekst §§ 19-22, 29),
  ksiegowosc-budzetowa.infor.pl, prawo.vulcan.edu.pl

⚠️ ZNALEZISKO AUDYTOWE: fraza „rachunkowość budżetowa" miała w systemie
**0 wystąpień**, mimo że DR-06 ma rozbudowany `mod-UFP-finanse-publiczne-
NIK-RIO`, a DR-08 całą dziedzinę samorządową. System znał BUDŻET JST i
kontrolę RIO/NIK, nie znając REŻIMU KSIĘGOWEGO, w którym ten budżet jest
ewidencjonowany — a to właśnie ten reżim jest przedmiotem większości
zastrzeżeń pokontrolnych RIO i zarzutów z ustawy o dyscyplinie finansów
publicznych.

---

## 1. PODSTAWA PRAWNA — DWUPOZIOMOWA

```
POZIOM 1 — USTAWA: ustawa o rachunkowości stosuje się do jednostek
  sektora finansów publicznych (art. 2 ust. 1 u.o.r. — obowiązek
  NIEZALEŻNY od wielkości przychodów, od samego powstania jednostki)
  → mod-ustawa-rachunkowosci.md

POZIOM 2 — ROZPORZĄDZENIE (szczególne zasady, modyfikujące ustawę):
  ⭐⭐⭐ Rozporządzenie Ministra Rozwoju i Finansów z 13 września 2017 r.
  w sprawie rachunkowości oraz planów kont dla budżetu państwa,
  budżetów jednostek samorządu terytorialnego, jednostek budżetowych,
  samorządowych zakładów budżetowych, państwowych funduszy celowych
  oraz państwowych jednostek budżetowych mających siedzibę poza
  granicami RP

  ⭐ AKTUALNY TEKST JEDNOLITY: **Dz.U. 2026 poz. 909**
     → obwieszczenie MFiG z 24 czerwca 2026 r., ogłoszony 7 lipca 2026 r.
     → potwierdzone zgodnie: inforlex.pl (Rząd 2A), przepisy.gofin.pl
       (Rząd 2B, wykaz wersji czasowych), ksiegowosc-budzetowa.infor.pl
     → t.j. uwzględnia zmiany wprowadzone w 2025 r.

  ⭐ ŁAŃCUCH WERSJI (przydatny przy sprawach z lat wcześniejszych —
     rozporządzenie stosuje się w brzmieniu z danego roku obrotowego):
     → tekst pierwotny: Dz.U. 2017 poz. 1911 (ISAP WDU20170001911)
     → t.j. Dz.U. 2020 poz. 342 (ISAP WDU20200000342)
     → t.j. Dz.U. 2025 poz. 347
     → t.j. Dz.U. 2026 poz. 909 ← OBOWIĄZUJĄCY
  ⚠️ Materiały prawnicze i wzory dokumentów kontrolnych sprzed lipca
    2026 r. powołują poz. 347 lub 342 — przy sprawach BIEŻĄCYCH to
    nieaktualne oznaczenie
```

## 2. ⭐⭐ PLANY KONT — ZAŁĄCZNIKI I ZAKŁADOWY PLAN KONT

```
⭐ STRUKTURA ZAŁĄCZNIKÓW (§ 19 rozporządzenia):
  → zał. nr 1 — plan kont dla BUDŻETU PAŃSTWA
  → zał. nr 2 — plan kont dla BUDŻETÓW JEDNOSTEK SAMORZĄDU
    TERYTORIALNEGO
  → zał. nr 3 — plan kont dla JEDNOSTEK BUDŻETOWYCH i SAMORZĄDOWYCH
    ZAKŁADÓW BUDŻETOWYCH
  → zał. nr 4 — plan kont dla PLACÓWEK
  ⚠️ [Przypisanie numerów załączników do rodzajów jednostek potwierdzone
  w przepisy.gofin.pl (Rząd 2B) — zweryfikuj w ISAP, jeśli numer
  załącznika ma być powołany w piśmie]

⭐⭐ ZAKŁADOWY PLAN KONT (§ 20) — TU POWSTAJE WIĘKSZOŚĆ SPORÓW Z RIO:
  plan kont z załącznika to STANDARDOWA LICZBA KONT, którą wolno:
  → OGRANICZYĆ — ale WYŁĄCZNIE o konta służące do księgowania operacji
    NIEWYSTĘPUJĄCYCH w jednostce
  → UZUPEŁNIĆ — o konta zgodne CO DO TREŚCI EKONOMICZNEJ, w tym przy
    wykorzystaniu symboli kont niemających zastosowania w jednostce
  → plan kont dla budżetu JST może być uzupełniony o wybrane konta z
    planu dla jednostek budżetowych i zakładów budżetowych
  ⭐ ZAKŁADOWY PLAN KONT MUSI: uwzględniać ustalenia jednostki nadrzędnej
    lub zarządu JST co do grupowania operacji istotnych dla rodzaju
    działalności ORAZ zapewniać możliwość sporządzenia sprawozdań
    finansowych, budżetowych i innych określonych odrębnymi przepisami
  → ⭐⭐ ARGUMENT OBRONNY: zarzut „nieprawidłowy zakładowy plan kont"
    wymaga wykazania, że ograniczenie objęło konto do operacji, KTÓRE W
    JEDNOSTCE WYSTĘPUJĄ, albo że dodane konto nie odpowiada treści
    ekonomicznej. Samo odstępstwo od wzoru NIE jest naruszeniem —
    rozporządzenie wprost je dopuszcza

⭐ UKŁAD ZADANIOWY: w jednostkach zobowiązanych do planowania i
  sprawozdawczości budżetowej w układzie zadaniowym ewidencja wykonania
  budżetu w tym układzie prowadzona jest na koncie POZABILANSOWYM z
  planu kont z załącznika nr 3

⭐ ZMIANA Z 2025 r. UJĘTA W t.j. 2026: w planie kont dla budżetów JST
  (zał. nr 2) wprowadzono nowe konto **968 „Prywatyzacja"** — ewidencja
  przychodów i rozchodów dotyczących procesów prywatyzacyjnych
  ⚠️ [potwierdzone w ksiegowosc-budzetowa.infor.pl (Rząd 2B) — jedno
  źródło; zweryfikuj w tekście rozporządzenia przed powołaniem]
```

## 3. SPRAWOZDAWCZOŚĆ — TERMINY I KONSOLIDACJA

```
⭐ TERMINY DLA DYSPONENTÓW BUDŻETU PAŃSTWA (wg § 28 — numeracja do
  potwierdzenia):
  → dysponenci II stopnia → kierownikom jednostek nadrzędnych: do
    **15 kwietnia** roku następnego
  → jednostki nadrzędne → łączne sprawozdania finansowe do Ministerstwa
    Finansów: do **30 kwietnia** roku następnego

⭐⭐ SKONSOLIDOWANY BILANS JST (§ 29): zarząd jednostki samorządu
  terytorialnego sporządza skonsolidowany bilans JST, stosując
  ODPOWIEDNIO przepisy **rozdziału 6 ustawy o rachunkowości**, przy
  założeniu, że jednostką dominującą jest JST
  → ⭐ POWIĄZANIE: metody konsolidacji i zwolnienia z rozdz. 6 u.o.r.
    opisane w mod-ustawa-rachunkowosci.md, sekcja 5d — ale stosowane
    tu ODPOWIEDNIO, nie wprost; „jednostką dominującą" jest podmiot
    publiczny, nie spółka

⭐ FORMA ELEKTRONICZNA I TERMINY PUBLIKACJI: t.j. 2026 uwzględnia
  zmiany z 2025 r. dotyczące sporządzania sprawozdań finansowych
  wyłącznie w formie elektronicznej oraz zmienionych terminów ich
  publikacji, a także nowych zasad wyceny majątku i inwentaryzacji
  nieruchomości
  ⚠️ [KIERUNEK zmian potwierdzony w Rzędzie 2B; KONKRETNE TERMINY I
  BRZMIENIA — DO ODCZYTANIA Z TEKSTU t.j. Dz.U. 2026 poz. 909 przed
  jakąkolwiek poradą. NIE podano ich tutaj, żeby nie utrwalić
  niezweryfikowanej liczby]
```

## 4. POWIĄZANIA SANKCYJNE — DLACZEGO TO JEST MODUŁ RYZYKA

```
⭐ Naruszenia reżimu rachunkowości budżetowej rodzą odpowiedzialność
  w TRZECH równoległych porządkach:
  → DYSCYPLINA FINANSÓW PUBLICZNYCH — ustawa o odpowiedzialności za
    naruszenie dyscypliny finansów publicznych →
    dr-07-zamowienia-publiczne-fundusze-ue/modules/
    mod-ustawa-dyscyplina-finansow-publicznych.md
  → USTAWA O RACHUNKOWOŚCI — art. 77 (nieprowadzenie ksiąg, podanie
    nierzetelnych danych) → mod-ustawa-rachunkowosci.md, sekcja sankcji
  → KONTROLA: RIO (JST) i NIK — wystąpienie pokontrolne, termin 21 dni
    na zastrzeżenia → mod-UFP-finanse-publiczne-NIK-RIO.md, sekcja 11

⭐ CRU JSFP — Centralny Rejestr Umów jednostek sektora finansów
  publicznych, obowiązek publikacji od 1.07.2026 (BEZ progu kwotowego)
  → ORKA-BAS BAS-125; rejestrumow.gov.pl
```

---

## CROSS-REFERENCJE
- Ustawa o rachunkowości (poziom 1, zasady ogólne, konsolidacja rozdz. 6)
  → `mod-ustawa-rachunkowosci.md`
- Budżet, WPF, subwencje, dług, kontrola NIK/RIO →
  `mod-UFP-finanse-publiczne-NIK-RIO.md`
- Dyscyplina finansów publicznych → `dr-07-zamowienia-publiczne-
  fundusze-ue/modules/mod-ustawa-dyscyplina-finansow-publicznych.md`
- Ustrój JST, mienie komunalne → `dr-08-samorzad-terytorialny-prawo-
  lokalne/`
- Klasyfikacja budżetowa → mod-UFP (⚠️ nowe rozporządzenie ws.
  klasyfikacji budżetowej stosowane po raz pierwszy do budżetu na
  2027 r. — sygnalizowane w źródłach Rzędu 2B, NIEZWERYFIKOWANE
  numerem; do sprawdzenia w osobnej sesji)
