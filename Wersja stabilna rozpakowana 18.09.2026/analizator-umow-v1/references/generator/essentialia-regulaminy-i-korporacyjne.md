# ESSENTIALIA — regulaminy, uchwały/protokoły, pełnomocnictwa
## Analizator Umów v1 · Moduł generator/ (wczytywany przez workflows/generator-regulaminu.md i workflows/generator-dokumentow-korporacyjnych.md)

> HARD GATE: przepisy poniżej wymagają weryfikacji online przy każdym użyciu
> w konkretnej sprawie (R1 w `rdzen-generowania.md`). Oznaczenia `[VER: ...]`
> poniżej pochodzą z research przeprowadzonego przy tworzeniu tego modułu —
> **nie zwalniają** z ponownej weryfikacji przy generowaniu konkretnego dokumentu
> dla klienta, jeśli sesja jest inna niż sesja utworzenia tego pliku.

---

## §1 REGULAMIN ŚWIADCZENIA USŁUG DROGĄ ELEKTRONICZNĄ (art. 8 u.ś.u.d.e.)

**Podstawa:** art. 8 ustawy z 18.07.2002 r. o świadczeniu usług drogą elektroniczną
(t.j. Dz.U. 2024 poz. 1513) [VER: isap/arslege, zob. R1 przy użyciu].

**Essentialia minimalne (art. 8 ust. 3):**
1. rodzaje i zakres usług świadczonych drogą elektroniczną;
2. warunki świadczenia usług, w tym: (a) wymagania techniczne niezbędne do
   współpracy z systemem teleinformatycznym usługodawcy, (b) zakaz dostarczania
   przez usługobiorcę treści o charakterze bezprawnym;
3. warunki zawierania i rozwiązywania umów o świadczenie usług drogą elektroniczną;
4. tryb postępowania reklamacyjnego.

**Obowiązek towarzyszący (art. 8 ust. 1):** nieodpłatne udostępnienie regulaminu
usługobiorcy **przed** zawarciem umowy, w formie umożliwiającej pozyskanie,
odtworzenie i utrwalenie treści. Postanowienia nieudostępnione w ten sposób nie
wiążą usługobiorcy (art. 8 ust. 2) — sankcja kluczowa dla treningu użytkownika:
sam fakt istnienia regulaminu nie wystarcza, liczy się dowód udostępnienia.

**Rozszerzenia zależne od typu serwisu (dobieraj wg wywiadu):**
- **E-commerce (sklep):** dodaj warunki zawarcia umowy sprzedaży, prawo odstąpienia
  konsumenta (ustawa o prawach konsumenta), reklamację z tytułu rękojmi, dane
  o cenach i kosztach dostawy — routing do `mod-J8-b2c.md` dla pełnej checklisty B2C.
- **SaaS/usługa cykliczna:** dodaj SLA, okres rozliczeniowy, warunki wypowiedzenia
  subskrypcji, poziom dostępności — routing do `mod-J6-it-konsorcjum.md`.
- **Platforma z UGC/treściami użytkowników:** dodaj zasady moderacji i zgłaszania
  treści bezprawnych (routing do DSA/Aktu o usługach cyfrowych — `mod-shared-regulatory-horizon.md`),
  ponieważ Akt o Usługach Cyfrowych rozszerza obowiązki regulaminowe względem
  „warunków korzystania z usług” równoważnych regulaminowi z u.ś.u.d.e.
- **Dane osobowe zbierane przez serwis:** regulamin **nie zastępuje** obowiązku
  informacyjnego RODO — odeślij do odrębnej Polityki Prywatności, patrz §J21.2
  w `mod-J21-rodo-archiwizacja-regulaminy.md`; nie mieszaj obu dokumentów w jednym
  pliku, chyba że klient świadomie wybierze wariant połączony (odnotuj to wybór).
- **Klauzule abuzywne / UOKiK:** każdy regulamin B2C generowany od zera przechodzi
  przez `mod-shared-abusive-clauses.md` PRZED finalizacją — nie po.

## §2 UCHWAŁY ORGANÓW SPÓŁKI I PROTOKOŁY (KSH)

**Zakres:** uchwały zarządu, uchwały zgromadzenia wspólników sp. z o.o., uchwały
walnego zgromadzenia S.A./P.S.A., wraz z protokołami.

**Tryby zwołania/podjęcia (rozróżnij w wywiadzie — kluczowe dla essentialia):**
- **Tryb formalny** — zwołanie zgodnie ze statutem/umową spółki (zaproszenia,
  terminy, porządek obrad) → protokół musi stwierdzać prawidłowość zwołania.
- **Tryb art. 240 KSH (odformalizowany)** — dopuszczalny, gdy cały kapitał
  zakładowy jest reprezentowany i nikt z obecnych nie zgłasza sprzeciwu co do
  odbycia zgromadzenia lub wniesienia spraw do porządku obrad; **nie wymaga**
  formalnego zwołania, ale protokół musi wprost stwierdzić spełnienie tych
  przesłanek — pominięcie tego stwierdzenia to najczęstszy błąd formalny
  [VER: art. 240 KSH przy generowaniu].
- **Uchwały pisemne (obiegowe)** — dopuszczalne, jeśli żaden wspólnik nie
  sprzeciwił się głosowaniu pisemnemu ani samej treści uchwały (art. 227 § 2 KSH
  dla sp. z o.o.) — wymaga zebrania podpisów wszystkich uprawnionych.

**Essentialia protokołu (art. 248 KSH i praktyka):**
1. data, miejsce, oznaczenie rodzaju zgromadzenia/posiedzenia;
2. stwierdzenie prawidłowości zwołania (tryb formalny) LUB stwierdzenie przesłanek
   trybu art. 240 KSH (tryb odformalizowany) — jedno z dwóch, nigdy pominięte;
3. stwierdzenie zdolności do powzięcia uchwał (kworum/reprezentowany kapitał);
4. lista obecności z podpisami (załącznik), ew. pełnomocnictwa dołączone do
   księgi protokołów — **członek zarządu i pracownik spółki nie mogą być
   pełnomocnikami na zgromadzeniu wspólników** (art. 243 § 3 KSH) — sprawdź to
   w wywiadzie, zanim wygenerujesz pełnomocnictwo na zgromadzenie;
5. treść każdej podjętej uchwały (numer, przedmiot, dokładna treść — bez skrótów);
6. liczba głosów oddanych za/przeciw/wstrzymujących się przy każdej uchwale;
7. zgłoszone sprzeciwy (kto, do czego);
8. podpisy: obecnych, lub co najmniej przewodniczącego i osoby sporządzającej
   protokół (minimalny wymóg art. 248 § 1 KSH).
9. wpis do księgi protokołów — odnotuj to jako czynność następczą, poza samym
   dokumentem uchwały.

**Numeracja uchwał:** ciągła w obrębie roku kalendarzowego lub kadencji organu —
ustal konwencję z klientem i stosuj konsekwentnie w całej relacji (nie tylko w
jednym dokumencie) — to częsty punkt niespójności przy generowaniu kolejnych
uchwał w oderwaniu od poprzednich.

**Materia zastrzeżona do uchwały wspólników (nie zarządu)** — jeśli generowana
uchwała dotyczy m.in. zatwierdzenia sprawozdań i absolutorium, zbycia
przedsiębiorstwa, nabycia/zbycia nieruchomości (chyba że umowa spółki stanowi
inaczej), zwrotu dopłat — zweryfikuj, że projekt trafia do właściwego organu,
nie do zarządu z automatu.

**Statut / umowa spółki jako akt założycielski** — essentialia i redakcja: patrz
`mod-FA-founders-dokumenty-zalozycielskie.md` § J20.5 (moduł już istnieje w
systemie, nie duplikuj). Ten plik (§2) dotyczy wyłącznie uchwał i protokołów
bieżących, nie samego aktu założycielskiego.

## §3 PEŁNOMOCNICTWA (art. 98–109 KC)

**Trzy rodzaje wg zakresu umocowania (art. 98 KC):**

| Rodzaj | Zakres | Forma | Kiedy stosować |
|---|---|---|---|
| **Ogólne** | czynności zwykłego zarządu | pisemna pod rygorem nieważności (art. 99 § 2 KC) | bieżące sprawy przedsiębiorstwa/majątku, bez czynności przekraczających zwykły zarząd |
| **Rodzajowe** | określony rodzaj czynności (np. „zawieranie umów najmu lokali”) | forma odpowiadająca czynności, do której upoważnia (art. 99 § 1 KC) | powtarzalne czynności jednego typu, przekraczające zwykły zarząd |
| **Szczególne (do poszczególnej czynności)** | jedna, konkretnie wskazana czynność | jw. — forma zależna od czynności | jednorazowa czynność, zwłaszcza wymagająca formy szczególnej (np. akt notarialny do zbycia nieruchomości) |

**Zasada formy (art. 99 § 1 KC):** forma pełnomocnictwa **musi odpowiadać** formie
wymaganej dla czynności, której dotyczy. Najczęstszy błąd przy generowaniu:
pełnomocnictwo w zwykłej formie pisemnej do czynności wymagającej aktu
notarialnego (np. zbycie/nabycie nieruchomości) — takie pełnomocnictwo jest
nieskuteczne dla tej czynności, niezależnie od intencji stron. Ustal w wywiadzie
**dokładną czynność**, zanim wybierzesz formę dokumentu.

**Essentialia treści pełnomocnictwa:**
1. oznaczenie mocodawcy (dane pełne — dla osoby prawnej: firma, siedziba, KRS/NIP,
   sposób reprezentacji przy udzielaniu — kto podpisuje w imieniu mocodawcy);
2. oznaczenie pełnomocnika (dane pełne, PESEL/nr dokumentu jeśli wymagane przez
   odbiorcę pełnomocnictwa, np. sąd, urząd, notariusz);
3. jednoznaczne określenie zakresu umocowania — rodzaj (ogólne/rodzajowe/
   szczególne) i **dokładny opis czynności lub kategorii czynności** (unikaj
   sformułowań blankietowych typu „wszelkie sprawy” przy pełnomocnictwie
   rodzajowym — to zaciera granicę z ogólnym i bywa kwestionowane);
4. ewentualne umocowanie do udzielania dalszych pełnomocnictw (substytucja) —
   wymaga wyraźnego zapisu, nie domniemywa się;
5. czas trwania / warunek wygaśnięcia — jeśli inny niż ustawowy (śmierć
   mocodawcy/pełnomocnika, odwołanie — art. 101 § 2 KC), zapisz to wprost, bo
   ograniczenie musi wynikać z treści stosunku prawnego będącego podstawą
   pełnomocnictwa;
6. data i podpis mocodawcy (oświadczenie jednostronne — pełnomocnik nie musi
   podpisywać samego dokumentu pełnomocnictwa, choć praktyka bywa różna przy
   odbiorze);
7. przy pełnomocnictwie procesowym (KPC) — odrębne, dodatkowe wymogi zakresowe
   (ogólne / do prowadzenia poszczególnych spraw / do niektórych czynności
   procesowych, art. 88 § 1 KPC) — routing do modułów proceduralnych systemu
   (`pisma-procesowe-v3`/`pisma-proste-v2`), nie do tego modułu.

**Prokura (art. 109¹ i n. KC)** — odrębna instytucja, nie „zwykłe” pełnomocnictwo:
udzielana wyłącznie przez przedsiębiorcę wpisanego do KRS, obejmuje czynności
sądowe i pozasądowe związane z prowadzeniem przedsiębiorstwa, wymaga formy
pisemnej pod rygorem nieważności i wpisu do KRS. Jeśli wywiad wskaże na prokurę,
NIE stosuj tabeli essentialia powyżej wprost — dopytaj o rodzaj prokury
(samoistna/łączna/oddziałowa) i zweryfikuj aktualne wymogi KRS przed generowaniem.

**Odwołanie i wygaśnięcie (art. 101 KC):** pełnomocnictwo może być odwołane w
każdym czasie (chyba że mocodawca zrzekł się odwołania z przyczyn uzasadnionych
treścią stosunku bazowego — zapisz to zastrzeżenie wprost, jeśli klient go chce).
Umocowanie wygasa ze śmiercią mocodawcy lub pełnomocnika, chyba że w
pełnomocnictwie zastrzeżono inaczej z takich samych przyczyn. Po wygaśnięciu
pełnomocnik ma obowiązek zwrócić dokument mocodawcy — warto to zapisać jako
przypomnienie w treści przy pełnomocnictwach długoterminowych.
