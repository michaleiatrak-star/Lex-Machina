# MODUŁ J21 — RODO: DOKUMENTY WEWNĘTRZNE, ARCHIWIZACJA, REGULAMINY WEWNĘTRZNE
## Analizator Umów v1 · Moduł J21 (DOMAIN, lazy-loaded)

> Wczytaj dla: polityka prywatności, polityka ochrony danych osobowych/
> bezpieczeństwa informacji (PBI), rejestr czynności przetwarzania (RCP/RCO,
> art. 30 RODO), klauzule informacyjne (art. 13/14 RODO), upoważnienia do
> przetwarzania danych osobowych, wyznaczenie IOD, instrukcja kancelaryjna /
> polityka archiwizacji i retencji dokumentów, regulamin pracy, regulamin
> wynagradzania, regulamin ZFŚS, regulamin korzystania ze sprzętu służbowego/
> poczty/Internetu, procedura zgłaszania naruszeń (whistleblowing — patrz
> rozgraniczenie poniżej).
>
> **Status:** moduł NOWY — utworzony 2026-06-15, kontynuacja serii J20
> (dokumenty założycielskie). ✅ VER online 2026-06-15.
>
> ⛔ ZAKRES vs DR-11 (mod-RODO-GDPR-2016-679.md, mod-RODO-szczegolowy.md):
> moduły DR-11 = SUBSTANTYWNE PRAWO RODO i SPORY (naruszenia, odszkodowania,
> kary UODO, postępowania). TEN moduł = REDAKCJA/ANALIZA DOKUMENTÓW
> COMPLIANCE (co dokument musi zawierać, kiedy jest wymagany, jak go
> wdrożyć). Dla sporu o naruszenie RODO → DR-11. Dla "napisz/sprawdź naszą
> politykę prywatności / RCP / regulamin pracy" → ten moduł.
>
> ⛔ ZAKRES vs analizator-umow-v1/mod-shared-rodo.md: ten moduł SHARED
> obejmuje klauzule RODO W UMOWACH (DPA jako część umowy głównej — art. 28
> RODO, klauzule powierzenia). TEN moduł J21 obejmuje SAMODZIELNE DOKUMENTY
> WEWNĘTRZNE organizacji (polityki, rejestry, regulaminy) — nie część
> umowy z kontrahentem. Jeśli analiza obejmuje oba (np. umowa z dostawcą +
> wewnętrzna polityka retencji danych z tej umowy) — wczytaj OBA moduły.
>
> ⛔ ZAKRES vs J20 (mod-FA-founders-dokumenty-zalozycielskie.md): J20 =
> regulaminy ORGANÓW KORPORACYJNYCH (zarząd, RN, walne — wynikające z KSH).
> TEN moduł = regulaminy WEWNĘTRZNE DOTYCZĄCE PRACOWNIKÓW/PRZETWARZANIA DANYCH
> (regulamin pracy, wynagradzania, ZFŚS, polityki RODO) — wynikające z KP i
> RODO. Różne podstawy prawne, różni adresaci, różne procedury uchwalania.
>
> ⛔ ZAKRES vs DR-16 (mod-ustawa-archiwa-dokumentacja.md): moduł DR-16 = SPORY
> o dostęp do akt/archiwów publicznych, KPA, informacja publiczna —
> kontekst PUBLICZNOPRAWNY. TEN moduł J21 = WEWNĘTRZNA POLITYKA ARCHIWIZACJI
> w prywatnej organizacji (instrukcja kancelaryjna, JRWA jako WZÓR
> dobrowolny, okresy przechowywania dokumentacji pracowniczej/podatkowej/
> handlowej) — kontekst PRYWATNOPRAWNY/COMPLIANCE.

---

> ⛔ HARD GATE — przed podaniem JAKIEGOKOLWIEK artykułu RODO/KP/ustawy o
> ochronie danych osobowych, terminu, okresu przechowywania weryfikuj w
> ISAP/EUR-LEX/UODO. Zakaz cytowania z pamięci. Znacznik ✅ [VER: źródło,
> data] obowiązkowy.
>
> ```
> KLUCZOWE AKTY — ZWERYFIKOWANE 2026-06-15:
> RODO (Rozporządzenie UE 2016/679) — eur-lex.europa.eu
> Ustawa o ochronie danych osobowych (wdrażająca RODO, z 10.05.2018) —
>   weryfikuj aktualny t.j. w ISAP
> Kodeks pracy — t.j. Dz.U. 2025 poz. 277 ze zm.
>   ✅ VER: nowelizacja Dz.U. 2026 poz. 25 (ustawa z 4.12.2025, w życie
>   26/27.01.2026 — sprawdź dokładną datę w ISAP) — KLUCZOWA dla regulaminu
>   pracy/wynagradzania, patrz J21.4
> Ustawa o ZFŚS — t.j. Dz.U. 2024 poz. 288 ze zm.
>   ✅ VER: zmieniona RÓWNIEŻ przez Dz.U. 2026 poz. 25 (reprezentacja
>   pracowników przy uzgadnianiu regulaminu ZFŚS w braku związków
>   zawodowych) — patrz J21.5
> Ustawa o narodowym zasobie archiwalnym i archiwach — kontekst publiczny,
>   DR-16/mod-ustawa-archiwa-dokumentacja.md; dla podmiotów prywatnych
>   relewantne tylko fragmentarycznie (np. JRWA jako wzór dobrowolny)
> Przepisy o przechowywaniu dokumentacji podatkowej (Ordynacja podatkowa) i
>   ZUS/kadrowej (ustawa o emeryturach i rentach z FUS, KP) — patrz J21.6
> ```

---

## J21.1 ROUTING WEWNĘTRZNY — KTÓRY DOKUMENT?

| Dokument | Podstawa prawna | Kiedy wymagany | Sekcja |
|---|---|---|---|
| Polityka prywatności (strona/aplikacja) | RODO art. 13/14, ustawa o świadczeniu usług drogą elektroniczną (cookies) | praktycznie zawsze przy zbieraniu danych online | J21.2 |
| Klauzula informacyjna (art. 13/14 RODO) | RODO art. 13 (zbieranie od osoby) / art. 14 (od osoby trzeciej) | KAŻDE zbieranie danych osobowych | J21.2 |
| Rejestr czynności przetwarzania (RCP) | RODO art. 30 ust. 1 | administrator ≥250 osób ZATRUDNIONYCH LUB przetwarzanie nie-okazjonalne / dane szczególnych kategorii / wysokie ryzyko (wyjątki art. 30 ust. 5 — WERYFIKUJ) | J21.3 |
| Rejestr kategorii czynności przetwarzania (RCO) | RODO art. 30 ust. 2 | dla podmiotów przetwarzających (processor) | J21.3 |
| Polityka bezpieczeństwa informacji / ochrony danych (PBI) | RODO art. 24, 32 (zasada accountability) | brak formalnego wymogu CO DO NAZWY, ale praktyka rynkowa + dowód rozliczalności | J21.3 |
| Upoważnienie do przetwarzania danych osobowych | RODO art. 29, art. 32 ust. 4 | każda osoba mająca dostęp do danych z polecenia administratora | J21.3 |
| Wyznaczenie IOD (DPO) | RODO art. 37 | sektor publiczny / przetwarzanie na dużą skalę / monitorowanie regularne i systematyczne / dane szczególnych kategorii na dużą skalę (art. 37 ust. 1 — WERYFIKUJ kryteria) | J21.3 |
| Procedura zgłaszania naruszeń ochrony danych | RODO art. 33/34 | każdy administrator (procedura wewnętrzna) | J21.3 |
| Instrukcja kancelaryjna / polityka archiwizacji i retencji | przepisy sektorowe (Ordynacja podatkowa, KP, ustawa o rachunkowości) + RODO (zasada ograniczenia przechowywania, art. 5 ust. 1 lit. e) | każdy podmiot — zakres i forma zależą od wielkości | J21.6 |
| Regulamin pracy | KP art. 104 i n. | ⚡ NOWY PRÓG: pracodawca ≥50 pracowników (od 26/27.01.2026, wcześniej ≥20) — patrz J21.4 | J21.4 |
| Regulamin wynagradzania | KP art. 77² | ⚡ analogiczny próg ≥50 (wcześniej ≥20) — patrz J21.4 | J21.4 |
| Regulamin ZFŚS | ustawa o ZFŚS | przy obowiązku/decyzji tworzenia ZFŚS — zmieniona procedura uzgadniania przy braku ZZ (Dz.U. 2026 poz. 25) | J21.5 |
| Regulamin korzystania ze sprzętu/poczty/Internetu, monitoring | KP art. 22¹–22³ (monitoring) | przy wprowadzaniu monitoringu — obowiązek informacyjny i regulaminowy | J21.7 |

---

## J21.2 POLITYKA PRYWATNOŚCI I KLAUZULE INFORMACYJNE (ART. 13/14 RODO)

```
✅ VER online 2026-06-15 — RODO art. 13-14 (eur-lex.europa.eu)

RÓŻNICA: KLAUZULA INFORMACYJNA vs POLITYKA PRYWATNOŚCI:
- klauzula informacyjna = obowiązkowy, zwięzły dokument przy KAŻDYM
  zbieraniu danych (np. formularz kontaktowy, rekrutacja, umowa) —
  realizuje art. 13/14 RODO dla KONKRETNEGO procesu przetwarzania
- polityka prywatności = ZBIORCZY dokument (zwykle na stronie WWW/w
  aplikacji), opisujący WSZYSTKIE procesy przetwarzania danego podmiotu —
  praktyka rynkowa, nie odrębny wymóg ustawowy, ale musi zawierać elementy
  z art. 13/14 dla każdego procesu

CHECKLIST — ELEMENTY OBLIGATORYJNE (art. 13 ust. 1-2 RODO, weryfikuj
dokładne brzmienie):
□ tożsamość i dane kontaktowe administratora (oraz przedstawiciela, jeśli
  poza UE)
□ dane kontaktowe IOD (jeśli wyznaczony)
□ cele przetwarzania ORAZ podstawa prawna dla KAŻDEGO celu (art. 6 RODO —
  zgoda / umowa / obowiązek prawny / żywotny interes / interes publiczny /
  prawnie uzasadniony interes)
□ jeśli podstawa = prawnie uzasadniony interes (art. 6 ust. 1 lit. f) —
  JAKI interes?
□ odbiorcy lub kategorie odbiorców danych
□ informacja o przekazywaniu danych do państw trzecich/organizacji
  międzynarodowych + podstawa (decyzja KE o adekwatności / standardowe
  klauzule umowne / inne mechanizmy art. 46)
□ okres przechowywania (lub kryteria jego ustalenia) — POWIĄZANIE z J21.6
□ PRAWA OSOBY: dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie,
  sprzeciw, wycofanie zgody
□ prawo wniesienia skargi do organu nadzorczego (UODO)
□ czy podanie danych jest wymogiem ustawowym/umownym i konsekwencje
  niepodania
□ informacja o zautomatyzowanym podejmowaniu decyzji/profilowaniu (art. 22
  RODO), jeśli dotyczy

⚠️ ART. 14 vs ART. 13: jeśli dane NIE pochodzą od osoby, której dotyczą
(np. dane pozyskane od innej spółki grupy, z rejestru publicznego) —
stosuje się art. 14 z DODATKOWYM elementem: ŹRÓDŁO POCHODZENIA DANYCH oraz
informacja, czy pochodzą ze źródeł publicznie dostępnych. Terminy
poinformowania osoby — odrębne dla art. 14 (zwykle 1 miesiąc — weryfikuj
art. 14 ust. 3).

PUŁAPKI:
□ polityka prywatności "kopiuj-wklej" z innej firmy — często nieaktualne
  podstawy prawne, nieistniejące procesy, brak adekwatności do faktycznego
  przetwarzania — KAŻDA polityka musi odpowiadać RZECZYWISTYM procesom
  (audyt przed redakcją!)
□ brak rozróżnienia cookies analitycznych/marketingowych vs niezbędnych —
  cookies niezbędne nie wymagają zgody, inne — wymagają (Prawo
  telekomunikacyjne / ustawa o świadczeniu usług drogą elektroniczną,
  weryfikuj aktualny status po implementacji ePrivacy)
□ podstawa prawna "zgoda" dla procesu, który faktycznie odbywa się na
  podstawie umowy/obowiązku prawnego — błędna podstawa = ryzyko, że osoba
  może "wycofać zgodę" dla procesu, który administrator chce/musi
  kontynuować
```

---

## J21.3 RCP/RCO, PBI, UPOWAŻNIENIA, IOD, PROCEDURA NARUSZEŃ

### Rejestr czynności przetwarzania (RCP, art. 30 ust. 1 RODO)

```
KIEDY WYMAGANY: art. 30 ust. 5 RODO przewiduje WYJĄTEK dla podmiotów
<250 osób zatrudnionych — ALE wyjątek NIE STOSUJE SIĘ, jeśli przetwarzanie:
(a) może powodować ryzyko dla praw/wolności osób, (b) nie ma charakteru
okazjonalnego, lub (c) obejmuje dane szczególnych kategorii (art. 9) lub
dane o wyrokach skazujących (art. 10).
⚠️ W PRAKTYCE: prawie KAŻDY pracodawca przetwarza dane pracownicze
nie-okazjonalnie → RCP jest de facto wymagany niezależnie od wielkości.
✅ VER: dokładne brzmienie wyjątku — eur-lex.europa.eu, RODO art. 30 ust. 5

ELEMENTY RCP (art. 30 ust. 1 — checklist):
□ nazwa i dane kontaktowe administratora (+ współadministratorów,
  przedstawiciela, IOD)
□ cele przetwarzania
□ kategorie osób, których dane dotyczą
□ kategorie danych osobowych
□ kategorie odbiorców (w tym w państwach trzecich/organizacjach
  międzynarodowych)
□ przekazania do państw trzecich + dokumentacja zabezpieczeń (art. 49 ust.
  1 akapit drugi, jeśli dotyczy)
□ planowane terminy usunięcia różnych kategorii danych
□ opis środków technicznych i organizacyjnych bezpieczeństwa (art. 32)

RCO (art. 30 ust. 2) — dla PROCESORA (podmiotu przetwarzającego na
zlecenie): nazwa/kontakt procesora i każdego administratora w jego imieniu,
kategorie przetwarzań dla każdego administratora, przekazania do państw
trzecich, opis środków bezpieczeństwa.

FORMAT: RODO nie przewiduje formy — najczęściej tabela/arkusz (Excel,
dedykowany system). Praktyczna rekomendacja: jeden wiersz = jeden proces
przetwarzania, aktualizacja przy KAŻDEJ zmianie procesu.
```

### Polityka bezpieczeństwa informacji / ochrony danych (PBI)

```
✅ VER 2026-06-15: RODO NIE WYMAGA dokumentu o tej konkretnej nazwie — to
spuścizna terminologiczna z poprzedniej ustawy o ochronie danych osobowych
(1997, wymagającej "polityki bezpieczeństwa" i "instrukcji zarządzania
systemem informatycznym"). RODO opiera się na ZASADZIE ROZLICZALNOŚCI
(art. 5 ust. 2, art. 24) — administrator MUSI być w stanie WYKAZAĆ
zgodność, ale formę dokumentacji wybiera sam (risk-based approach).

PRAKTYKA RYNKOWA — typowa treść PBI (jako dokument dobrowolny, ale
rekomendowany dla wykazania rozliczalności):
□ zasady ogólne przetwarzania (zasady art. 5 RODO — legalność, celowość,
  minimalizacja, prawidłowość, ograniczenie przechowywania, integralność i
  poufność, rozliczalność)
□ klasyfikacja danych (zwykłe / szczególne kategorie / dotyczące wyroków)
□ środki techniczne i organizacyjne (art. 32) — kontrola dostępu,
  szyfrowanie, backup, polityka haseł, zarządzanie incydentami
□ procedura oceny skutków dla ochrony danych (DPIA, art. 35) — kiedy
  wymagana (przetwarzanie "wysokiego ryzyka" — lista przykładów od UODO,
  WERYFIKUJ aktualną listę)
□ procedura realizacji praw osób (terminy: 1 miesiąc, możliwość
  przedłużenia o 2 miesiące — art. 12 ust. 3)
□ procedura zgłaszania naruszeń (patrz niżej)
□ zasady retencji i usuwania danych — POWIĄZANIE z J21.6
```

### Upoważnienia do przetwarzania danych osobowych

```
PODSTAWA: RODO art. 29 (przetwarzanie wyłącznie na polecenie administratora)
+ art. 32 ust. 4 (zapewnienie, że osoby mające dostęp przetwarzają tylko na
polecenie)

⚠️ TERMINOLOGIA: poprzednia ustawa o ochronie danych osobowych (1997)
WYMAGAŁA formalnych "upoważnień" z imiennym rejestrem. RODO nie nazywa tego
dokumentu wprost, ale WYMÓG FUNKCJONALNY pozostaje (art. 29/32 ust. 4) —
praktyka rynkowa kontynuuje wydawanie upoważnień jako dowód realizacji tego
wymogu.

ELEMENTY TYPOWEGO UPOWAŻNIENIA:
□ dane osoby upoważnionej
□ zakres przetwarzania (jakie kategorie danych, w jakim celu, jakim
  systemie)
□ zobowiązanie do zachowania tajemnicy (również po ustaniu zatrudnienia/
  współpracy)
□ data nadania i ew. data wygaśnięcia (np. przy zmianie stanowiska)
□ podpis administratora/osoby upoważnionej do nadawania upoważnień

REJESTR UPOWAŻNIEŃ: praktyka rynkowa — lista osób z zakresem i datami,
aktualizowana przy zmianach kadrowych
```

### Wyznaczenie Inspektora Ochrony Danych (IOD)

```
PODSTAWA: RODO art. 37 ust. 1 — IOD OBLIGATORYJNY gdy:
(a) przetwarzania dokonuje organ/podmiot publiczny (z wyjątkiem sądów w
zakresie wymiaru sprawiedliwości),
(b) główna działalność administratora/procesora polega na operacjach
przetwarzania, które wymagają REGULARNEGO i SYSTEMATYCZNEGO MONITOROWANIA
osób NA DUŻĄ SKALĘ, lub
(c) główna działalność polega na przetwarzaniu NA DUŻĄ SKALĘ danych
szczególnych kategorii (art. 9) lub danych o wyrokach (art. 10)
✅ VER: dokładne kryteria "dużej skali" i "regularnego/systematycznego
monitorowania" — wytyczne EDPB/UODO, eur-lex.europa.eu

DOKUMENTY: decyzja/uchwała o wyznaczeniu IOD, zakres obowiązków (art. 39),
zgłoszenie danych kontaktowych IOD do UODO (obowiązek notyfikacji),
publikacja danych kontaktowych IOD (np. w polityce prywatności)

JEŚLI IOD NIE JEST WYMAGANY: rekomendacja wyznaczenia osoby/zespołu
odpowiedzialnego za ochronę danych (bez formalnego statusu IOD) — dla
zachowania rozliczalności
```

### Procedura zgłaszania naruszeń ochrony danych (art. 33/34 RODO)

```
TERMINY (✅ VER eur-lex.europa.eu, RODO art. 33):
□ zgłoszenie do UODO: BEZ ZBĘDNEJ ZWŁOKI, jeśli to możliwe NIE PÓŹNIEJ niż
  72 GODZINY od stwierdzenia naruszenia (jeśli po 72h — uzasadnienie
  zwłoki)
□ wyjątek: jeśli naruszenie nie skutkuje ryzykiem dla praw/wolności osób —
  zgłoszenie do UODO NIE jest wymagane (ale UDOKUMENTUJ tę ocenę!)
□ zawiadomienie osób (art. 34): jeśli naruszenie powoduje WYSOKIE ryzyko —
  bez zbędnej zwłoki

ELEMENTY PROCEDURY WEWNĘTRZNEJ:
□ kto przyjmuje zgłoszenie wewnętrzne (pierwszy punkt kontaktu)
□ kto ocenia ryzyko i podejmuje decyzję o zgłoszeniu do UODO/zawiadomieniu
  osób (IOD / zespół / zarząd)
□ szablon zgłoszenia do UODO (elementy z art. 33 ust. 3: charakter
  naruszenia, kategorie i liczba osób/wpisów, konsekwencje, środki
  zaradcze)
□ rejestr naruszeń (wewnętrzny — również naruszeń NIE zgłaszanych do UODO,
  dla wykazania rozliczalności)
□ procedura komunikacji z osobami (jeśli wymagane)
```

---

## J21.4 REGULAMIN PRACY I REGULAMIN WYNAGRADZANIA — ⚡ ZMIANA PROGÓW 2026

```
⚡⚡⚡ KRYTYCZNA ZMIANA — ✅ VER online 2026-06-15:

Ustawa z 4.12.2025 r. o zmianie ustawy – Kodeks pracy oraz ustawy o
zakładowym funduszu świadczeń socjalnych, Dz.U. 2026 poz. 25, w życie
26/27.01.2026 (sprawdź dokładną datę publikacji vs wejścia w życie w ISAP —
źródła podają 26.01 i 27.01, rozbieżność do wyjaśnienia przed cytowaniem)

PRZED zmianą (do 25/26.01.2026):
- regulamin pracy (art. 104 §1 KP) — obowiązkowy dla pracodawców
  zatrudniających ≥20 pracowników (chyba że obowiązuje układ zbiorowy)
- regulamin wynagradzania (art. 77² KP) — analogicznie ≥20 pracowników

PO zmianie (od 26/27.01.2026) — art. 104 KP nowe brzmienie:
- § 1¹: pracodawca zatrudniający CO NAJMNIEJ 50 PRACOWNIKÓW wprowadza
  regulamin pracy (chyba że obowiązuje układ zbiorowy w zakresie § 1)
- § 2: pracodawca <50 pracowników MOŻE wprowadzić regulamin pracy
  (fakultatywnie)
- § 3: pracodawca zatrudniający ≥20 i <50 pracowników WPROWADZA regulamin
  pracy, JEŚLI zakładowa organizacja związkowa WYSTĄPI Z WNIOSKIEM o jego
  wprowadzenie (chyba że obowiązuje układ zbiorowy)
- analogiczna zmiana dla regulaminu wynagradzania (art. 77² — próg ≥50,
  z odpowiednikiem zasady "na wniosek ZZ" dla 20-49)

BRAK PRZEPISÓW PRZEJŚCIOWYCH — zmiana weszła w życie jednolicie dla
wszystkich pracodawców tego samego dnia (✅ VER: poradnikprzedsiebiorcy.pl,
2026-06-15 — potwierdź w ISAP).

PRAKTYCZNA KONSEKWENCJA DLA KLIENTÓW SILNIKA:
□ pracodawca z 20-49 pracownikami, który WCZEŚNIEJ miał obowiązek
  regulaminu (stan prawny do 01.2026) i go wprowadził — regulamin NIE
  PRZESTAJE automatycznie obowiązywać (akt wewnętrzny, dalej wiąże jako
  źródło prawa pracy w zakładzie, art. 9 KP), ALE pracodawca może
  rozważyć jego UCHYLENIE jeśli chce (z zachowaniem procedury — konsultacja
  ze związkami/przedstawicielami, okres wypowiedzenia warunków jeśli
  postanowienia są dla pracowników korzystniejsze niż ustawa — art. 24113
  KP, weryfikuj)
□ pracodawca z 20-49 pracowników, który NIE miał regulaminu — od 01.2026
  NIE MA obowiązku, chyba że ZZ złoży wniosek
□ pracodawca z ≥50 pracowników — obowiązek bez zmian (próg już go
  obejmował i nadal obejmuje)

CHECKLIST TREŚCI REGULAMINU PRACY (art. 104¹ KP — weryfikuj aktualne
brzmienie po nowelizacji, część przepisów zmieniona z "na piśmie" na
"w postaci papierowej lub elektronicznej" — Dz.U. 2026/25):
□ organizacja pracy, warunki przebywania na terenie zakładu w czasie pracy
  i po jej zakończeniu
□ wyposażenie pracowników w narzędzia i materiały, odzież i obuwie robocze,
  środki ochrony indywidualnej
□ systemy i rozkłady czasu pracy oraz przyjęte okresy rozliczeniowe
□ termin, miejsce, czas i częstotliwość wypłaty wynagrodzenia
□ wykazy prac wzbronionych kobietom/młodocianym (jeśli dotyczy — weryfikuj
  aktualny stan po zmianach w prawie pracy)
□ rodzaj prac i wykaz stanowisk dozwolonych pracownikom młodocianym
□ obowiązki dotyczące BHP i ochrony przeciwpożarowej
□ przyjęty u pracodawcy sposób potwierdzania przybycia/obecności i
  usprawiedliwiania nieobecności
□ ⚡ FORMA SKŁADANIA WNIOSKÓW (po Dz.U. 2026/25): regulamin powinien
  odzwierciedlać, że dla wielu czynności (monitoring — art. 22² §8,
  przejście zakładu — art. 23¹ §3, wnioski o czas wolny/urlop bezpłatny —
  art. 174, 174¹, 237⁴ §3) dopuszczalna jest "postać papierowa lub
  elektroniczna" — UAKTUALNIJ stare regulaminy wymagające wyłącznie formy
  papierowej/pisemnej!

CHECKLIST TREŚCI REGULAMINU WYNAGRADZANIA (art. 77² KP — elementy):
□ warunki wynagradzania za pracę (stawki/tabele, dodatki)
□ inne świadczenia związane z pracą i zasady ich przyznawania
□ ⚠️ NIE MOŻE być mniej korzystny dla pracowników niż KP/ustawy/układy
  zbiorowe (art. 9 §2-3 KP)
□ jeśli pracodawca ≥20 i <50 pracowników wprowadza regulamin "na wniosek
  ZZ" — sprawdź, czy wniosek został złożony i jaka jest procedura
  konsultacji
```

---

## J21.5 REGULAMIN ZFŚS — ⚡ ZMIANA PROCEDURY UZGADNIANIA 2026

```
✅ VER online 2026-06-15: Dz.U. 2026 poz. 25 (ta sama ustawa jak J21.4)
zmienia RÓWNIEŻ ustawę o ZFŚS (t.j. Dz.U. 2024 poz. 288 ze zm. — sprawdź,
czy wydano nowszy t.j. po tej nowelizacji)

OBOWIĄZEK TWORZENIA ZFŚS: pracodawcy ≥50 pracowników w przeliczeniu na
pełne etaty (próg ISTNIEJĄCY już wcześniej, NIE zmieniony przez tę
nowelizację — nie myl z progiem regulaminu pracy/wynagradzania, który
DOPIERO TERAZ zrównano na 50)

⚡ ZMIANA — REPREZENTACJA ZAŁOGI PRZY UZGADNIANIU REGULAMINU ZFŚS W BRAKU
ZWIĄZKÓW ZAWODOWYCH:
- u pracodawców ≥50 pracowników (oraz 20-49 nieobjętych układem zbiorowym)
  BEZ działającej zakładowej organizacji związkowej — postanowienia
  regulaminu ZFŚS dotyczące w szczególności WYSOKOŚCI ODPISU na Fundusz
  lub DECYZJI O JEGO NIETWORZENIU WYMAGAJĄ UZGODNIENIA z pracownikami
  WYBRANYMI PRZEZ ZAŁOGĘ do reprezentowania jej interesów
- cel: zwiększenie reprezentacji pracowniczej i ujednolicenie sposobu
  reprezentacji w różnych sprawach prawa pracy (jeden mechanizm
  reprezentacji, nie ad hoc dla każdej sprawy)

CHECKLIST PRZY REDAKCJI/AKTUALIZACJI REGULAMINU ZFŚS:
□ czy w zakładzie działa zakładowa organizacja związkowa? → jeśli TAK,
  uzgodnienie z ZZ (procedura jak dotychczas)
□ jeśli NIE → czy wybrano przedstawicieli załogi do reprezentowania jej
  interesów W SPRAWACH ZFŚS (zgodnie z nowym mechanizmem reprezentacji)?
□ czy postanowienia o wysokości odpisu / nietworzeniu Funduszu zostały
  UZGODNIONE z tymi przedstawicielami (nie tylko "skonsultowane")?
□ kwoty odpisów na ZFŚS — WERYFIKUJ aktualne stawki online (zmieniają się
  rocznie, podstawa = przeciętne wynagrodzenie w gospodarce z II połowy
  poprzedniego roku — patrz DR-04/mod-ustawa-ZFSS.md)

⚠️ KOREKTA DLA DR-04/mod-ustawa-ZFSS.md: moduł ten ma datę weryfikacji
2026-05-31, PRZED pełnym zidentyfikowaniem wpływu Dz.U. 2026/25 na procedurę
uzgadniania (próg 50 pracowników dla obowiązku tworzenia ZFŚS był już
poprawny i NIE zmienił się — zmieniła się PROCEDURA uzgadniania regulaminu
przy braku ZZ). Rekomendacja: przy następnym audycie DR-04 dodać tę
procedurę do mod-ustawa-ZFSS.md z odesłaniem do tego modułu (J21.5).
```

---

## J21.6 INSTRUKCJA KANCELARYJNA / POLITYKA ARCHIWIZACJI I RETENCJI DOKUMENTÓW

```
⛔ KONTEKST PRYWATNOPRAWNY — dla podmiotów PUBLICZNYCH (urzędy, JST) →
DR-16/mod-ustawa-archiwa-dokumentacja.md (ustawa o narodowym zasobie
archiwalnym, instrukcja kancelaryjna i JRWA są dla nich OBLIGATORYJNE wg
rozporządzeń wykonawczych).

DLA PODMIOTÓW PRYWATNYCH: brak jednego całościowego obowiązku "instrukcji
kancelaryjnej", ALE liczne przepisy SEKTOROWE określają OKRESY PRZECHOWYWANIA
konkretnych dokumentów — polityka archiwizacji/retencji SCALA te wymogi
w jeden dokument wewnętrzny + realizuje zasadę ograniczenia przechowywania
(RODO art. 5 ust. 1 lit. e) dla danych osobowych.

PRZYKŁADOWE OKRESY PRZECHOWYWANIA — ✅ KAŻDY WYMAGA WERYFIKACJI ONLINE
(przepisy zmieniają się, podane tu wyłącznie jako KATEGORIE do sprawdzenia,
NIE jako gotowe liczby):
□ dokumentacja pracownicza (akta osobowe, listy płac) — okres wynika z KP
  + ustawy o emeryturach i rentach z FUS (dla celów emerytalnych) —
  WERYFIKUJ aktualny okres (był zmieniany — reforma z 2019 skróciła okres
  dla nowych zatrudnień, ale dla starszych może obowiązywać dłuższy okres)
□ dokumentacja podatkowa (księgi, faktury) — okres wynika z Ordynacji
  podatkowej (przedawnienie zobowiązania podatkowego — WERYFIKUJ aktualny
  termin w DR-06/mod-OP-ordynacja-podatkowa)
□ dokumentacja ZUS (deklaracje, dowody opłacania składek) — WERYFIKUJ w
  ustawie o systemie ubezpieczeń społecznych
□ dokumentacja korporacyjna (umowa spółki, uchwały, protokoły) —
  praktycznie BEZTERMINOWO (dokumenty założycielskie i ich zmiany — J20)
□ dane osobowe klientów (np. dane z formularza kontaktowego, dane z umowy
  po jej zakończeniu) — zasada ograniczenia przechowywania (RODO art. 5
  ust. 1 lit. e): tak długo, jak NIEZBĘDNE do celu, z uwzględnieniem
  przedawnienia roszczeń (KC — ogólny termin przedawnienia, weryfikuj
  DR-02)
□ logi systemów IT / monitoring — WERYFIKUJ regulamin monitoringu (KP art.
  22² — okres przechowywania nagrań monitoringu wizyjnego, weryfikuj
  aktualny termin)

CHECKLIST POLITYKI ARCHIWIZACJI/RETENCJI:
□ kategoryzacja dokumentów (np. wg JRWA jako wzór dobrowolny — Jednolity
  Rzeczowy Wykaz Akt, opcjonalnie adaptowany z sektora publicznego)
□ dla KAŻDEJ kategorii: okres przechowywania + podstawa prawna (WERYFIKUJ
  każdą online — to NAJBARDZIEJ podatny na zmiany element systemu)
□ forma przechowywania (papierowa / elektroniczna / mieszana) — przepisy
  o e-fakturach/KSeF mogą wymuszać formę elektroniczną dla części
  dokumentacji — patrz DR-06
□ procedura BRAKOWANIA (zniszczenia) dokumentów po upływie okresu —
  protokół brakowania, kto zatwierdza
□ procedura archiwizacji elektronicznej — backup, kontrola integralności,
  dostęp
□ POWIĄZANIE Z RODO: dla danych osobowych — czy upływ okresu retencji
  TRIGGERUJE automatyczne usunięcie/anonimizację? Czy proces to
  realizuje (manualnie/automatycznie)?

⚠️ PUŁAPKA: różne kategorie dokumentów mają RÓŻNE okresy przechowywania,
które mogą być ze sobą w KONFLIKCIE z zasadą minimalizacji RODO (np.
dokument zawiera dane osobowe + jest wymagany podatkowo na dłużej niż
"potrzebne" dla celu pierwotnego) — w takim przypadku przechowywanie na
podstawie OBOWIĄZKU PRAWNEGO (art. 6 ust. 1 lit. c RODO) jest ODRĘBNĄ
podstawą od pierwotnego celu zbierania i NIE wymaga zgody/nie podlega
prawu do usunięcia w tym zakresie (art. 17 ust. 3 lit. b RODO).
```

---

## J21.7 INNE REGULAMINY WEWNĘTRZNE (MONITORING, SPRZĘT, BHP)

```
REGULAMIN MONITORINGU (KP art. 22¹–22³):
□ cel monitoringu (bezpieczeństwo pracowników, ochrona mienia, kontrola
  produkcji, zachowanie tajemnicy — katalog z art. 22² §1, weryfikuj)
□ zakres (pomieszczenia/obszar) — WYŁĄCZENIA: pomieszczenia sanitarne,
  szatnie, palarnie, pomieszczenia ZZ (poza zgodą — weryfikuj wyjątki)
□ okres przechowywania nagrań (WERYFIKUJ aktualny termin w KP)
□ obowiązek informacyjny: oznaczenie monitorowanych obszarów + poinformowanie
  pracowników PRZED rozpoczęciem monitoringu (forma — po Dz.U. 2026/25
  możliwa "postać papierowa lub elektroniczna", art. 22² §8)
□ analogicznie: monitoring poczty elektronicznej/innych narzędzi (art.
  22³) — odrębne wymogi celowości i proporcjonalności

REGULAMIN KORZYSTANIA ZE SPRZĘTU SŁUŻBOWEGO / POCZTY / INTERNETU:
□ dopuszczalny zakres korzystania prywatnego (zakaz całkowity / ograniczony
  / dozwolony)
□ zasady bezpieczeństwa (hasła, VPN, urządzenia mobilne — BYOD jeśli
  dotyczy)
□ konsekwencje naruszenia (odpowiedzialność porządkowa wg KP — kary
  porządkowe wymagają regulaminu pracy jako podstawy!)
□ POWIĄZANIE z monitoringiem poczty/Internetu (art. 22³ KP) — regulamin
  powinien być spójny z regulaminem monitoringu

⚠️ JEŚLI PRACODAWCA NIE MA REGULAMINU PRACY (po zmianie progów — patrz
J21.4, pracodawcy <50 bez wniosku ZZ): kary porządkowe (upomnienie, nagana,
kara pieniężna — art. 108 i n. KP) WYMAGAJĄ podstawy w regulaminie pracy
LUB w samej ustawie. Sprawdź, czy brak regulaminu ogranicza możliwość
stosowania kar porządkowych za naruszenia regulaminu sprzętu/monitoringu —
może być potrzebna podstawa w UMOWIE O PRACĘ lub odrębnym dokumencie
zaakceptowanym przez pracownika.
```

---

## J21.8 MASTER CHECKLISTA — UZUPEŁNIENIE DLA DOKUMENTÓW RODO/ARCHIWIZACJI/REGULAMINÓW

```
Oprócz MASTER CHECKLISTY z mod-J0-routing.md, dla dokumentów tego modułu
sprawdź DODATKOWO:

□ AUDYT PRZED REDAKCJĄ: czy dokument (polityka prywatności, RCP, regulamin)
  odpowiada RZECZYWISTYM procesom organizacji, nie jest "kopiuj-wklej"?
□ PRÓG ZATRUDNIENIA: czy sprawdzono AKTUALNY stan zatrudnienia względem
  progów (50 — regulamin pracy/wynagradzania/ZFŚS po Dz.U. 2026/25; 250 —
  wyjątek od RCP wg art. 30 ust. 5 RODO, z zastrzeżeniami)?
□ SPÓJNOŚĆ MIĘDZY DOKUMENTAMI: polityka prywatności ↔ RCP (te same procesy,
  te same okresy retencji) ↔ polityka retencji ↔ regulamin pracy
  (monitoring, kary porządkowe)?
□ FORMA: po Dz.U. 2026/25 wiele czynności KP dopuszcza "postać papierową
  LUB elektroniczną" — czy stare regulaminy/dokumenty wymagające wyłącznie
  formy papierowej zostały zaktualizowane?
□ PROCEDURA WPROWADZENIA/ZMIANY: czy zachowano wymaganą procedurę (np.
  uzgodnienie z ZZ/przedstawicielami załogi dla regulaminu ZFŚS po
  Dz.U. 2026/25; ogłoszenie regulaminu pracy pracownikom — art. 104³ KP,
  weryfikuj)?
□ DATY: każdy dokument powinien mieć datę wejścia w życie i historię zmian
  (wersjonowanie) — istotne dla wykazania rozliczalności RODO i dla
  pracowników (od kiedy ich obowiązuje nowa wersja)
```

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Spór/naruszenie RODO, odszkodowanie, kara UODO | DR-11/`mod-RODO-GDPR-2016-679.md`, `mod-RODO-szczegolowy.md` |
| Klauzule RODO/DPA w umowie z kontrahentem | `mod-shared-rodo.md` |
| Regulaminy organów korporacyjnych (zarząd/RN/walne) | `mod-FA-founders-dokumenty-zalozycielskie.md` (J20) |
| Archiwizacja/dostęp do akt — sektor publiczny, spór | DR-16/`mod-ustawa-archiwa-dokumentacja.md` |
| Okresy przechowywania dokumentacji podatkowej | DR-06/`mod-OP-ordynacja-podatkowa.md` |
| ZFŚS — odpisy, świadczenia | DR-04/`mod-ustawa-ZFSS.md` (⚠️ wymaga aktualizacji o Dz.U. 2026/25 — patrz J21.5) |
| Cyberbezpieczeństwo, monitoring, art. 267 KK | DR-03/`mod-KK-cyberprzestepstwa-szczegolowy.md`, DR-11 |
| Zwolnienia grupowe (próg 20 — odrębny od progu regulaminu) | DR-04/`mod-ustawa-zwolnienia-grupowe.md` |
| Spór pracowniczy — pismo procesowe | `pisma-procesowe-v3` |

---

## WERYFIKACJA ONLINE

```
web_search: "Dz.U. 2026 poz. 25 Kodeks pracy zakładowy fundusz świadczeń socjalnych tekst"
web_search: "art 104 Kodeks pracy regulamin pracy 50 pracowników 2026 aktualne brzmienie"
web_search: "art 30 RODO rejestr czynności przetwarzania wyjątek 250 osób wytyczne UODO"
web_search: "art 37 RODO obowiązek wyznaczenia IOD kryteria duża skala wytyczne EDPB"
web_search: "okres przechowywania dokumentacji pracowniczej 2026 aktualny termin"
web_search: "monitoring pracownika art 22(2) KP okres przechowywania nagrań aktualny"
web_search: "regulamin ZFŚS uzgodnienie przedstawiciele załogi 2026 Dz.U. poz. 25"
```

---
*MODUŁ J21 / analizator-umow-v1 · utworzony 2026-06-15*
*⚡ Sekcje J21.4 i J21.5 dotyczą zmian Dz.U. 2026 poz. 25 (w życie
26/27.01.2026) — BARDZO ŚWIEŻA nowelizacja, dokładną datę wejścia w życie i
finalną numerację artykułów ZAWSZE weryfikuj w ISAP przed cytowaniem.*
*Prawo weryfikuj ZAWSZE w ISAP/EUR-LEX/UODO.*
