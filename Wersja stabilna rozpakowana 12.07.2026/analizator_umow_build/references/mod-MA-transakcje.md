# MODUŁ MA — UMOWY TRANSAKCYJNE: SPA, SHA, LOI, TERM SHEET
## Analizator Umów v1 · Moduł MA

> **Wczytaj gdy:** sprzedaż lub nabycie udziałów/akcji, umowa wspólników/akcjonariuszy,
> term sheet inwestora, letter of intent, transakcja M&A, wejście funduszu VC/PE,
> buy-out, joint venture z wkładem kapitałowym, sukcesja przedsiębiorstwa.
>
> ⛔ ZAKRES vs J20 (mod-FA-founders-dokumenty-zalozycielskie.md, NOWY
> 2026-06-15): SHA tutaj = umowa wspólników/akcjonariuszy POST-FORMATION,
> zwykle przy wejściu inwestora do JUŻ ISTNIEJĄCEJ spółki. Dla founders'
> agreement PRE-FORMATION (przed rejestracją spółki) lub jako uzupełnienie
> przy samym założeniu — wczytaj J20. Przy analizie SPÓJNOŚCI founders'
> agreement → SHA (np. czy vesting z FA jest odzwierciedlony w mechanizmach
> transferu udziałów w SHA) — wczytaj OBA moduły.

> ⛔ HARD GATE — przed podaniem numeru art. KSH, KC, ksh weryfikuj w ISAP.
> isap.sejm.gov.pl → "Kodeks spółek handlowych" → aktualny tekst jednolity
> ⚠ Sygnatura KSH zmienia się z każdym nowym t.j. — ZAWSZE sprawdź aktualną:
>   isap.sejm.gov.pl → wpisz "Kodeks spółek handlowych" → wybierz ostatni t.j.
>   Ostatni znany t.j.: Dz.U. 2024 poz. 18 — zweryfikuj czy nie wydano nowszego.
> isap.sejm.gov.pl → KSH → art. 328–339 (SA) · art. 55–70 (przeniesienie)

---

## MA.1 PODSTAWY PRAWNE — SYSTEM PRAWNY TRANSAKCJI

```
KLUCZOWE AKTY PRAWNE (weryfikuj aktualne teksty w ISAP):

1. Kodeks spółek handlowych (KSH) — isap.sejm.gov.pl:
   ⚠ Weryfikuj aktualny tekst jednolity przed podaniem artykułu!
   Ostatni znany t.j.: Dz.U. 2024 poz. 18 — sprawdź czy ogłoszono nowszy.
   Sp. z o.o.:
   → art. 180: przeniesienie udziałów — forma pisemna z podpisami notarialnie
     poświadczonymi → NIEZACHOWANIE FORMY = NIEWAŻNOŚĆ bezwzględna
   → art. 182: ograniczenia zbycia udziałów z umowy spółki (wymóg zgody)
   → art. 183: prawo pierwszeństwa wspólników
   → art. 151–300: ogólne zasady sp. z o.o.
   
   Spółka akcyjna:
   → art. 337–338: przeniesienie akcji imiennych (pisemna lub elektroniczna)
   → art. 339: ograniczenia zbywalności (statut)

2. Kodeks cywilny:
   → art. 535: sprzedaż (SPA = umowa sprzedaży udziałów)
   → art. 471–474: odpowiedzialność za niewykonanie (podstawa dla R&W)
   → art. 556–576: rękojmia za wady (opcjonalnie stosowana przez analogię)
   → art. 353¹: swoboda kształtowania treści SHA

3. Brak szczególnej regulacji R&W w prawie polskim:
   → Representations & Warranties = instytucja prawa common law
   → Stosowane w Polsce przez art. 353¹ KC (swoboda umów)
   → Odpowiedzialność za naruszenie R&W: art. 471 KC lub klauzule indemnifikacyjne
   → Weryfikuj: isap.sejm.gov.pl → KC → art. 471, 473, 484

FORMA UMOWY SPRZEDAŻY UDZIAŁÓW (SP. Z O.O.):
  Art. 180 §1 KSH: pisemna z podpisami notarialnie poświadczonymi (RYGOR NIEWAŻNOŚCI)
  → Nie wystarczy zwykła forma pisemna
  → E-mail, podpis kwalifikowany bez notariusza → NIEWAŻNA transakcja
  
  WYJĄTEK — Spółki S24 (art. 180 §2 KSH):
  → Jeśli spółka była zawiązana przez system S24 (wzorzec teleinformatyczny)
  → Zbycie możliwe elektronicznie: kwalifikowany podpis elektroniczny / podpis zaufany / podpis osobisty
  → Ograniczenie: wyłącznie przez wzorzec systemu — bez własnych postanowień
  → Weryfikuj status spółki (S24 czy tradycyjnie): KRS → dane rejestrowe → tryb zawiązania
  
  → Weryfikuj notariusza przez rejestr: krs.ms.gov.pl
```

---

## MA.2 LETTER OF INTENT (LOI) / TERM SHEET — ANALIZA

```
LOI / Term Sheet = dokument wstępny poprzedzający SPA/SHA.
KLUCZOWE PYTANIE: Które klauzule są wiążące (binding), a które niewiążące (non-binding)?

TYPOWY PODZIAŁ:
  KLAUZULE WIĄŻĄCE (binding) — naruszenie = odpowiedzialność:
  □ Wyłączność negocjacyjna (exclusivity / lock-out): zakaz negocjacji z innymi przez X dni
    → Naruszenie: odszkodowanie za szkodę rzeczywistą (damnum emergens)
  □ Poufność (NDA/confidentiality)
  □ Zasady due diligence (dostęp do danych, zakres)
  □ Podział kosztów transakcji (kto płaci za prawników, audytorów)
  □ Governing law / arbitraż (jeśli wskazane)

  KLAUZULE NIEWIĄŻĄCE (non-binding) — deklaracja intencji:
  □ Cena (indykatywna)
  □ Struktura transakcji
  □ Harmonogram
  □ Podmiot kupujący

PUŁAPKA MA-LOI-1: Brak wyraźnego wskazania które klauzule binding, które non-binding
  → Sąd może uznać LOI za umowę przedwstępną (art. 389 KC) → słaby skutek
  → Każda klauzula, której pominięcie oceniasz przez pryzmat art. 390 KC, powinna być
    wyraźnie oznaczona [BINDING] lub [NON-BINDING]
  
REKOMENDACJA:
  "Niniejszy List Intencyjny nie stanowi umowy przedwstępnej i nie zobowiązuje
   Stron do zawarcia żadnej umowy. Wiążący charakter mają wyłącznie postanowienia
   wskazane w sekcjach: [lista]. Pozostałe postanowienia stanowią niewiążącą
   deklarację intencji Stron."

PUŁAPKA MA-LOI-2: Wyłączność bez terminu lub zbyt długa
  → Zbyt długa wyłączność (>90 dni) blokuje sprzedającego bez gwarancji transakcji
  REKOMENDACJA: Wyłączność max 30–60 dni, z opcją przedłużenia za zgodą obu stron.
  Kupującemu prawa: [X] dni na DD → [Y] dni na negocjacje → [Z] dni na signing.
```

---

## MA.3 SPA — UMOWA SPRZEDAŻY UDZIAŁÓW / AKCJI

### MA.3.1 Struktura SPA i kluczowe elementy

```
OBLIGATORYJNA TREŚĆ SPA (prawo polskie + praktyka M&A):

□ Dane stron: pełne dane sprzedającego i kupującego
□ Przedmiot transakcji:
  - Liczba i wartość nominalna udziałów/akcji
  - % kapitału zakładowego
  - Spółka: KRS, NIP, adres, kapitał zakładowy
□ Cena i mechanizm cenowy (sekcja MA.3.2 poniżej)
□ Warunki zawieszające closing (conditions precedent — CP)
□ Closing: data, miejsce, czynności (lista checklisty closingowej)
□ Representations & Warranties sprzedającego (sekcja MA.3.3)
□ Klauzule indemnifikacyjne (sekcja MA.3.4)
□ Przeżywające klauzule (survival period)
□ Zakaz konkurencji sprzedającego po transakcji (sekcja MA.3.5)
□ Prawo właściwe i jurysdykcja/arbitraż
□ Postanowienia końcowe (całościowa umowa, zmiany w formie pisemnej)

FORMA: pisemna z podpisami notarialnie poświadczonymi (art. 180 KSH dla sp. z o.o.)
```

### MA.3.2 Mechanizmy cenowe

```
TYP 1 — LOCKED BOX (cena stała z datą referencyjną):
  Cena ustalona na podstawie bilansu na konkretną datę (locked box date).
  Od tej daty sprzedający nie może "wyjmować" wartości ze spółki (no-leakage).
  KORZYŚĆ: prostota, pewność ceny
  RYZYKO kupującego: zmiany między locked box date a closingiem → klauzule leakage

  KLAUZULA LEAKAGE (obowiązkowa przy locked box):
  "Sprzedający zobowiązuje się do niepodjęcia między datą referencyjną a Closingiem
   żadnych czynności powodujących uszczuplenie wartości Spółki ('Leakage'), w tym
   wypłaty dywidend, umorzenia udziałów powyżej wartości rynkowej, zawarcia transakcji
   z podmiotami powiązanymi niebędącymi arm's length, bez pisemnej zgody Kupującego.
   W przypadku Leakage Kupujący uprawniony jest do odpowiedniej korekty Ceny lub
   do żądania indemnifikacji."

TYP 2 — CLOSING ACCOUNTS (korekta ceny po closingu):
  Cena szacunkowa → korekta po closingu na podstawie audytowanego bilansu closingowego.
  Mechanizmy: Net Working Capital (NWC), Net Debt, Cash Free / Debt Free.
  KORZYŚĆ kupującego: cena odzwierciedla rzeczywisty stan na closing
  RYZYKO: spory post-closingowe o wyliczenia → klauzula eksperta rozstrzygającego

TYP 3 — EARN-OUT (część ceny zależna od wyników):
  Część ceny płatna po closingu, zależna od wyników finansowych przez [X] lat.
  PUŁAPKI EARN-OUT:
  □ Brak definicji miernika (EBITDA, przychód, zysk operacyjny?) → spory
  □ Brak ochrony kupującego przez manipulowanie wynikami po closingu
  □ Brak prawa sprzedającego do wglądu w wyniki i weryfikacji obliczeń
  □ Brak klauzuli anti-sandbagging dla miernika
  
  REKOMENDACJA:
  "Earn-out kalkulowany jest na bazie EBITDA [definicja w Załączniku] audytowanego
   przez [audytor z listy] za lata [X–X]. Kupujący zobowiązuje się do prowadzenia
   Spółki w normalnym trybie, bez działań mających na celu zaniżenie miernika earn-out
   ('Earn-Out Manipulation'). Sprzedający ma prawo do wglądu w księgi i kwartalne
   raporty finansowe. Spory co do wyliczenia rozstrzyga niezależny biegły rewident
   wskazany przez [instytucję] w terminie [30] dni od doręczenia sporu."

TYP 4 — ESCROW (część ceny w depozycie):
  Część ceny zdeponowana u notariusza lub w banku na [X–Y] lat po closingu.
  Uruchamiana do pokrycia roszczeń z R&W i indemnifikacji.
  REKOMENDACJA: Escrow = 10–20% ceny, termin = period survival R&W + [6] miesięcy.
```

### MA.3.3 Representations & Warranties (R&W) — oświadczenia i zapewnienia

```
CHARAKTER PRAWNY W PRAWIE POLSKIM:
  R&W = klauzule umowne oparte na art. 353¹ KC (swoboda umów).
  Brak osobnej regulacji — strony modelują odpowiedzialność w umowie.
  Naruszenie R&W → odpowiedzialność indemnifikacyjna (nie rękojmia z KC).

KATALOG R&W SPRZEDAJĄCEGO — minimalne pokrycie:

BLOK A — UDZIAŁY I SPÓŁKA:
  □ Sprzedający jest jedynym właścicielem udziałów, brak zastawów, zajęć, roszczeń
  □ Udziały należycie objęte i w pełni opłacone
  □ Brak innych udziałowców, brak opcji na nowe udziały, warrantów
  □ Spółka wpisana do KRS, nie w likwidacji, upadłości, restrukturyzacji
  □ Umowa spółki: brak zmian po date of disclosure

BLOK B — FINANSE:
  □ Sprawozdania finansowe za ostatnie [3] lata: rzetelne, zgodne z UoR/MSSF
  □ Brak zobowiązań pozabilansowych
  □ Brak ukrytych zobowiązań (zobowiązań niezaksięgowanych)
  □ Brak zmian w sytuacji finansowej po locked box date / po dacie DD
  □ Podatki: wszystkie zobowiązania zapłacone, brak zaległości, brak toczących się kontroli

BLOK C — UMOWY I DZIAŁALNOŚĆ:
  □ Brak umów wymagających zgody na zmianę kontroli (change of control clause)
  □ Kluczowe umowy: ważne i wykonalne, brak wypowiedzeń ani naruszeń
  □ Brak postępowań sądowych, administracyjnych, arbitrażowych (>wartość progowa)
  □ Licencje i zezwolenia: ważne, bez ryzyka cofnięcia

BLOK D — PRACOWNICY:
  □ Lista kluczowych pracowników, brak zobowiązań do podwyżek/premii
  □ Brak sporów pracowniczych, kontroli PIP/ZUS w toku
  □ Umowy o zakazie konkurencji kluczowych pracowników: ważne i wykonalne

BLOK E — NIERUCHOMOŚCI I MAJĄTEK:
  □ Spółka jest właścicielem / ma prawo do korzystania z opisanego majątku
  □ Nieruchomości: brak obciążeń ponad ujawnione

BLOK F — WŁASNOŚĆ INTELEKTUALNA:
  □ Spółka jest właścicielem / licencjobiorcą wskazanego IP
  □ Brak naruszeń IP osób trzecich

BLOK G — RODO I DANE:
  □ Spółka przetwarza dane osobowe zgodnie z RODO
  → Wczytaj mod-shared-rodo.md dla checklisty DPA

DISCLOSURE LETTER (lista ujawnień):
  Sprzedający przed Closingiem dostarcza listę ujawnień (disclosure letter), które
  wyłączają jego odpowiedzialność za R&W w zakresie ujawnionych faktów.
  PUŁAPKA: "General disclosure" (ogólne odesłanie do data room)
  → Sąd może nie uznać za wystarczające ujawnienie — wymagaj specific disclosure.
```

### MA.3.4 Klauzule indemnifikacyjne

```
ZAKRES INDEMNIFIKACJI:
  Sprzedający indemnifikuje Kupującego za:
  (a) Naruszenie R&W
  (b) Wskazane ryzyka znane przed Closingiem (specific indemnities)
  (c) Zobowiązania podatkowe za okresy do Closingu (tax indemnity)

LIMITY ODPOWIEDZIALNOŚCI — kluczowe do negocjacji:

□ DE MINIMIS (próg bagatelności):
  Poniżej [X] PLN (lub % ceny) — jednotkowa szkoda jest ignorowana.
  Typowo: 0,1–0,5% ceny transakcji.

□ BASKET / TIPPING BASKET:
  Kupujący może zgłaszać roszczenia dopiero gdy łączna szkoda przekroczy [X] PLN.
  - First dollar basket: po przekroczeniu progu — cała kwota
  - Tipping basket: tylko nadwyżka ponad próg
  Typowo: 0,5–1,5% ceny.

□ CAP (łączny limit odpowiedzialności):
  Maksymalna odpowiedzialność Sprzedającego z R&W = [X]% ceny.
  Typowo: 10–30% ceny (lub 100% za fundamental reps).
  PUŁAPKA: ten sam cap dla R&W i specific indemnities — wynegocjuj osobne caps.

□ FUNDAMENTAL REPRESENTATIONS (wyłączone z cap):
  Niektóre R&W mają nielimitowaną odpowiedzialność (lub wyższy cap):
  - Tytuł do udziałów (ownership)
  - Zdolność do zawarcia umowy (capacity)
  - Anty-korupcja (FCPA/compliance)

□ SURVIVAL PERIOD (termin wygaśnięcia roszczeń):
  - Standard R&W: 18–36 miesięcy po Closingu
  - Fundamental reps: 5–7 lat lub do przedawnienia
  - Tax indemnity: do upływu przedawnienia zobowiązań podatkowych
  Weryfikuj: KC art. 119 — strony mogą skracać i wydłużać terminy przedawnienia umownie
  
□ W&I INSURANCE (ubezpieczenie R&W — opcja):
  Polisy W&I (Warranty & Indemnity Insurance) pokrywają roszczenia z naruszenia R&W.
  Coraz popularniejsze w Polsce przy transakcjach >5 mln EUR.
  Koszt: 1–2,5% wartości limitu polisy.
  EFEKT: Sprzedający może obniżyć lub wyłączyć cap na R&W.
```

### MA.3.5 Zakaz konkurencji sprzedającego

```
PRAWO POLSKIE — zakaz po transakcji:
  Podstawa: KC art. 353¹ (swoboda umów) — brak regulacji jak KP art. 101²
  Zakaz wiąże bez odszkodowania (w przeciwieństwie do pracowniczego)
  LIMIT: art. 5 KC (nadużycie prawa), art. 58 KC (sprzeczność z zasadami)
  Weryfikuj orzecznictwo: sn.pl → "zakaz konkurencji sprzedaż udziałów"

> ℹ CROSS-REFERENCE: Pełna analiza zakazu przy sprzedaży udziałów/przedsiębiorstwa
> (pułapki, matryca KC/KSH/UZNK bez błędnego oparcia na art. 17 UZNK, zakres, czas, odszkodowanie)
> → view references/zakaz-konkurencji.md (Moduł I) → Pułapka ZK-4
> MA.3.5 zawiera rekomendacje specyficzne dla transakcji M&A (poniżej);
> ZK-4 zawiera szczegółowy test ważności i szablony klauzul.

REKOMENDACJA DLA KUPUJĄCEGO (kontekst M&A):
  "§X. W ciągu [3] lat po Closingu Sprzedający zobowiązuje się nie:
  (a) prowadzić działalności konkurencyjnej wobec Spółki na terytorium [Polska/UE];
  (b) pozyskiwać klientów Spółki, z którymi Spółka współpracowała w ostatnich
      [2] latach przed Closingiem;
  (c) nakłaniać pracowników Spółki do rozwiązania stosunku pracy.
  Za naruszenie zakazu Kupującemu przysługuje kara umowna w wysokości
  [X]% ceny transakcji brutto za każde naruszenie."

ZAKRES PROPORCJONALNY:
  → [1–2 lata] dla transakcji małych
  → [2–3 lata] dla transakcji średnich
  → [3–5 lat] dla transakcji large, gdy sprzedający miał kluczową wiedzę
  Ponad 5 lat: ryzyko uznania za sprzeczne z art. 58 KC — weryfikuj aktualną linię SN.
```

---

## MA.4 SHA — UMOWA WSPÓLNIKÓW / AKCJONARIUSZY

### MA.4.1 Mechanizmy transferu udziałów

```
ROFR — RIGHT OF FIRST REFUSAL (prawo pierwszeństwa nabycia):
  Gdy Wspólnik A chce sprzedać udziały → najpierw musi zaoferować je Wspólnikowi B
  na warunkach identycznych jak oferta strony trzeciej.
  Procedura:
    1. A otrzymuje ofertę od Osoby Trzeciej
    2. A informuje B o warunkach oferty
    3. B ma [X] dni na przyjęcie oferty po tych samych warunkach
    4. Jeśli B odmawia → A może sprzedać Osobie Trzeciej przez [Y] dni

ROFO — RIGHT OF FIRST OFFER (prawo pierwszej oferty):
  Gdy Wspólnik A chce sprzedać → najpierw oferuje udziały B, który ustala cenę.
  Procedura:
    1. A informuje B o zamiarze sprzedaży
    2. B składa ofertę cenową w ciągu [X] dni
    3. A może przyjąć ofertę B lub odrzucić i szukać kupca na rynku
    4. Jeśli A sprzedaje Osobie Trzeciej za niższe cenie niż ROFO → naruszenie

RÓŻNICA ROFR vs ROFO:
  ROFR: B reaguje na zewnętrzną ofertę → lepsza ochrona B, bo B zna cenę rynkową
  ROFO: B musi samodzielnie wycenić → korzystniejsze dla A (B ujawnia ofertę)

TAG ALONG (prawo przyłączenia):
  Mniejszościowy wspólnik B ma prawo "dołączyć" do sprzedaży A, sprzedając swoje udziały
  na takich samych warunkach.
  Cel: ochrona mniejszości przed scenariuszem "A sprzedaje, nowy właściciel nie chce B"
  Procedura:
    1. A powiadamia B o planowanej sprzedaży z warunkami
    2. B ma [X] dni na zawiadomienie o chęci tag along
    3. Kupujący musi nabyć udziały B na tych samych warunkach (cena, termin)
    4. Jeśli Kupujący nie chce nabyć udziałów B → transakcja A wymaga zgody B

  PUŁAPKA SHA-TAG-1: Brak obowiązku tag along od Kupującego
  → Tag along wiąże A i B, ale jeśli Kupujący odmawia nabycia udziałów B
    → A musi albo anulować transakcję albo nabyć udziały B od B
  REKOMENDACJA: Uzgodnij obowiązek po stronie A: "A nie dokona sprzedaży jeśli
  Kupujący nie nabędzie udziałów B na warunkach tag along."

DRAG ALONG (prawo zmuszenia do sprzedaży):
  Większościowy wspólnik A może zmusić B do sprzedaży udziałów Kupującemu.
  Cel: A może sprzedać 100% spółki nie blokowany przez mniejszość.
  PUŁAPKI DRAG ALONG:
  □ Brak minimalnej ceny → drag po wartości symbolicznej → B traci
  □ Brak ochrony mniejszości przy drag: minimum = wartość rynkowa (wycena niezależna)
  □ Brak wymogu by A sprzedawał na tych samych warunkach co wymusza B
  □ Brak klauzuli wyjątku dla wartości poniżej [X] PLN → drag nie może być "tani"

  REKOMENDACJA DLA MNIEJSZOŚCI:
  "§X. Drag along może być wykonany wyłącznie gdy:
   (a) cena za udziały wynosi co najmniej [X] PLN za udział lub wartość ustaloną
       przez niezależnego biegłego z listy [instytucja];
   (b) A sprzedaje co najmniej [80/100]% swoich udziałów w tej samej transakcji;
   (c) warunki dla B są identyczne jak dla A (cena, termin, forma płatności);
   (d) B otrzyma płatność nie później niż [30] dni od Closingu."

KOMPATYBILNOŚĆ Z KSH:
  KRYTYCZNE: SHA wiąże wspólników kontraktowo, ale nie eliminuje ograniczeń z KSH!
  → Umowa spółki może wymagać zgody spółki na zbycie (art. 182 KSH)
  → SHA musi być spójna z umową spółki — rozbieżność → SHA jest bezskuteczne w zakresie
    praw korporacyjnych
  → PEŁNA SKUTECZNOŚĆ: SHA + odpowiednie zapisy w umowie spółki + pełnomocnictwa
  Weryfikuj: isap.sejm.gov.pl → KSH → art. 182–183
```

### MA.4.2 Prawa i ochrona mniejszości

```
PRAWA MNIEJSZOŚCI (negocjuj dla inwestorów / mniejszościowych wspólników):

□ PRAWO WETA (veto rights):
  Lista decyzji wymagających zgody Mniejszości:
  - Zmiana umowy spółki / statutu
  - Podwyższenie lub obniżenie kapitału zakładowego
  - Zaciągnięcie długu przekraczającego [X] PLN
  - Sprzedaż kluczowych aktywów (>Y% aktywów)
  - Wypłata dywidend inaczej niż pro-rata
  - Zatrudnienie / zwolnienie CEO i kluczowych menedżerów
  - Zawarcie transakcji z podmiotami powiązanymi (>Z PLN)
  - Zmiana przedmiotu działalności

□ PRAWO DO INFORMACJI:
  "§X. A zobowiązuje się dostarczać B:
  (a) miesięczne raporty P&L w terminie [10] dni od końca miesiąca;
  (b) kwartalne sprawozdania zarządcze;
  (c) roczne audytowane sprawozdania finansowe w terminie [90] dni od końca roku;
  (d) dostęp do ksiąg rachunkowych na żądanie z [5]-dniowym wyprzedzeniem."

□ ANTI-DILUTION (ochrona przed rozwodnieniem):
  "§X. W przypadku emisji nowych udziałów B ma prawo do subskrypcji nowych udziałów
   proporcjonalnie do swojego aktualnego udziału procentowego na tych samych
   warunkach co inni inwestorzy (pro-rata anti-dilution).
   Naruszenie uprawnia B do korekty ceny lub odszkodowania."

□ LIQUIDATION PREFERENCE:
  Przy sprzedaży spółki lub likwidacji: inwestor (B) otrzymuje zwrot wkładu
  (+premię X%) zanim pozostałe środki dzielone są między wspólników.
  Typ 1: Non-participating — B dostaje zwrot, reszta dla A
  Typ 2: Participating — B dostaje zwrot, a następnie uczestniczy w podziale reszty
  PUŁAPKA: "Participating full ratchet" → może dać inwestorowi niemal całą wartość wyjścia
```

---

## MA.5 CHECKLIST DUE DILIGENCE PRAWNEGO

```
Due Diligence (DD) poprzedza SPA. Wyniki DD wpływają na treść R&W i listę ujawnień.

BLOK 1 — STRUKTURA KORPORACYJNA:
  □ Aktualny odpis z KRS
  □ Umowa spółki / statut (aktualne brzmienie + historia zmian)
  □ Lista wspólników i udziałów (rejestr wspólników)
  □ Uchwały zarządu i zgromadzenia z ostatnich [3] lat
  □ Pełnomocnictwa i prokury

BLOK 2 — FINANSE:
  □ Sprawozdania finansowe za [3] lata (audytowane)
  □ Zobowiązania bankowe (umowy kredytowe, leasingowe)
  □ Zaległości podatkowe: zaświadczenia z US i ZUS
  □ Zobowiązania pozabilansowe (gwarancje, poręczenia)

BLOK 3 — UMOWY KLUCZOWE:
  □ Umowy z klientami >X% przychodów
  □ Umowy z dostawcami kluczowymi
  □ Umowy najmu / nieruchomości
  □ Umowy IT, licencje oprogramowania
  □ → KLAUZULE CHANGE OF CONTROL: czy umowa wymaga zgody przy zmianie właściciela?
       Naruszenie tej klauzuli = wypowiedzenie umowy przez kontrahenta po Closingu

BLOK 4 — PRACOWNICY:
  □ Lista pracowników + stanowiska + wynagrodzenia + urlopy zaległe
  □ Umowy o zakazie konkurencji
  □ Zobowiązania z tytułu świadczeń pracowniczych
  □ Toczące się spory pracownicze

BLOK 5 — IP I DANE:
  □ Rejestr znaków towarowych, patentów
  □ Umowy licencyjne (in-bound i out-bound)
  □ Audyt RODO / DPA (→ mod-shared-rodo.md)

BLOK 6 — SPORY SĄDOWE:
  □ Toczące się postępowania sądowe, administracyjne, arbitrażowe
  □ Wyroki prawomocne
  □ Roszczenia zagrożone (claims in pipeline)

BLOK 7 — COMPLIANCE:
  □ Licencje, zezwolenia, koncesje — ważność i warunki
  □ Postępowania UOKiK, UKE, KNF (jeśli dotyczy)
  □ Zgodność z RODO

CHANGE OF CONTROL — FLAG (krytyczne!):
  Przejrzyj KAŻDĄ kluczową umowę pod kątem klauzuli:
  "Zmiana kontroli / właściciela Wykonawcy wymaga pisemnej zgody Zamawiającego"
  → TAK: umowa może wygasnąć automatycznie lub kontrahent ma prawo wypowiedzenia
  → KONIECZNE: waiver / consent from counterparty przed Closingiem lub jako CP
```

---

## MA.6 CHECKLIST CLOSINGOWA

```
PRZED CLOSINGIEM:
  □ Warunki zawieszające (CP) spełnione lub waived
  □ Zgody regulatorów (UOKiK jeśli dotyczy — progi art. 13 ustawy o ochronie konkurencji)
  □ Zgody korporacyjne (zgromadzenie wspólników jeśli umowa spółki wymaga)
  □ Waivery change of control od kluczowych kontrahentów
  □ Certyfikaty podatkowe (brak zaległości US + ZUS)
  □ Certyfikaty z KRD / BIG

NA CLOSING:
  □ Umowa sprzedaży udziałów w sp. z o.o. zawarta w formie pisemnej z podpisami notarialnie poświadczonymi albo w trybie S24, jeżeli spełnione są przesłanki art. 180 KSH
  □ Oświadczenia sprzedającego (bring-down of R&W)
  □ Lista ujawnień (disclosure letter) dostarczona i potwierdzona
  □ Zarząd złożony ze wskazanych osób
  □ Przeniesienie w rejestrze (wniosek do KRS o zmianę)
  □ Rejestr wspólników zaktualizowany i podpisany przez zarząd

PO CLOSINGU:
  □ Wniosek do KRS w terminie [7] dni od Closingu
  □ Notyfikacje kontrahentów (jeśli umowy wymagają)
  □ Notyfikacje pracowników (jeśli wymagane przez KP)
  □ Escrow otwarty / zdeponowany
  □ Earn-out reporting schedule uruchomiony
```

---

*← Powrót do routingu: `view references/mod-J0-routing.md`*
*Podstawa prawna: KSH art. 180, 182, 183, 337–339 — isap.sejm.gov.pl → weryfikuj aktualny t.j.*
*KC art. 353¹, 471, 535 — isap.sejm.gov.pl*
*Weryfikacja KRS spółki: krs.ms.gov.pl · Notariusze: krs.ms.gov.pl*
*Kontrola koncentracji (UOKiK): uokik.gov.pl/kontrola_koncentracji.php*
