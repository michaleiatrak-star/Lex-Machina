# VAT — część 3: biała lista, WNT/import usług, OSS/IOSS, WIS, grupa VAT

> Część modułu `mod-VAT-podatek-od-towarow-i-uslug.md` (podział
> 2026-08-20, naprawa F-78, priorytet 3). Alerty legislacyjne [PKWiU
> 2025, KSeF obowiązkowy], CORE i INTAKE — zobacz plik nadrzędny
> (indeks). Ten plik ładowany WYŁĄCZNIE na żądanie konkretnego
> zagadnienia przez indeks nadrzędny.

---

### Biała lista podatników VAT

```
Obowiązek weryfikacji rachunku kontrahenta przed płatnością ≥ 15 000 PLN:
  → baza: https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka
  → Zapłata na niezarejestrowany rachunek → odpowiedzialność solidarna za VAT!
  → Zgłoszenie do US (ZAW-NR) do 7 dni — może zwolnić od odpowiedzialności
```

### ⭐⭐⭐ WNT I IMPORT USŁUG — ODWROTNE OBCIĄŻENIE — dodane
2026-08-12, na żądanie użytkownika (priorytety #3-4 z mapy pokrycia
VAT — dotąd CAŁKOWICIE nieobecne)

```
⭐⭐ MECHANIZM OGÓLNY (odwrotne obciążenie/reverse charge): OBOWIĄZEK
  podatkowy PRZECHODZI ZE sprzedawcy NA nabywcę — nabywca SAM
  nalicza VAT (jako NALEŻNY) i JEDNOCZEŚNIE, JEŚLI ma prawo,
  ODLICZA go (jako NALICZONY) — CO DO ZASADY neutralne PODATKOWO —
  W 2026 R. mechanizm obowiązuje GŁÓWNIE przy IMPORCIE usług, WNT
  oraz CZASOWO przy giełdowych transakcjach GAZEM/energią/
  uprawnieniami CO2 — W obrocie KRAJOWYM większość dawnych
  PRZYPADKÓW reverse charge ZASTĄPIŁ split payment (OD 2019)

⭐⭐⭐ WNT (WEWNĄTRZWSPÓLNOTOWE NABYCIE TOWARÓW):
  → DEFINICJA: nabycie PRAWA do rozporządzania JAK właściciel
    TOWAREM, PRZEWOŻONYM Z innego państwa UE DO Polski (RÓWNIEŻ
    przewóz WŁASNYCH towarów PODATNIKA z UE do PL)
  → OBOWIĄZEK PODATKOWY: Z CHWILĄ wystawienia FAKTURY przez
    sprzedawcę UE, NIE PÓŹNIEJ niż **15. DNIA** miesiąca
    NASTĘPUJĄCEGO PO miesiącu DOSTAWY (art. 20 ust. 5)
  → ⭐⭐⭐ WAŻNA ZMIANA (PO uchyleniu art. 86 ust. 10g): odliczenie
    VAT naliczonego NIE JEST już UZALEŻNIONE od POSIADANIA
    faktury — transakcja W PEŁNI neutralna, JEDNA deklaracja
    JPK_V7 — BRAK otrzymania faktury W terminie 3 MIESIĘCY NIE
    POWODUJE już KONIECZNOŚCI korygowania odliczonego PODATKU
    (⚠️ TO ZMIANA względem STARSZEGO stanu prawnego — STARE
    materiały MOGĄ wciąż OPISYWAĆ obowiązek korekty)
  → DOKUMENT: nabywca WYSTAWIA dokument WEWNĘTRZNY (oznaczony jako
    "WEW"), umożliwiający WYKAZANIE VAT należnego I naliczonego
  → ⭐⭐ WYŁĄCZENIA Z WNT (art. 10 ust. 1 pkt 2) — DOTYCZĄ małych
    nabywców: rolnicy RYCZAŁTOWI (dla działalności ROLNICZEJ),
    podatnicy BEZ prawa odliczenia, PODATNICY zwolnieni Z limitem
    **240 000 ZŁ** (⚠️ zaktualizowana wartość, PATRZ sekcja O
    zwolnieniu podmiotowym WYŻEJ), podatnicy ROZPOCZYNAJĄCY
    działalność Z proporcjonalnym limitem, PODATNICY zagraniczni
    bez SIEDZIBY w PL Z limitem krajowym + DODATKOWYM limitem
    UNIJNYM 100 000 EUR
  → INFORMACJA PODSUMOWUJĄCA VAT-UE: WYMAGANA dla WNT

⭐⭐⭐ IMPORT USŁUG:
  → DEFINICJA: nabycie USŁUG od ZAGRANICZNEGO dostawcy,
    NIEZALEŻNIE OD tego, czy dostawca MA siedzibę W UE, czy POZA
    nią
  → MECHANIZM analogiczny DO WNT — nabywca WYKAZUJE VAT należny I
    (jeśli PRZYSŁUGUJE) naliczony — zagraniczny DOSTAWCA NIE
    uczestniczy W polskim systemie PODATKOWYM
  → ⭐⭐ KLUCZOWA RÓŻNICA względem WNT: import USŁUG NIE MUSI być
    wykazany W informacji PODSUMOWUJĄCEJ VAT-UE (W przeciwieństwie
    DO WNT) — ⚠️ ŁATWO pomylić, PONIEWAŻ EKSPORT usług MUSI być W
    NIEJ ujęty

⭐ FORMALNOŚCI PRZY OBU mechanizmach: PODMIOTY Z krajów
  CZŁONKOWSKICH muszą być ZAREJESTROWANE do VAT-UE — BRAK
  rejestracji NIE WYKLUCZA jednak rozliczenia VAT PRZEZ nabywcę W
  ramach REVERSE CHARGE — FAKTURA od kontrahenta ZAGRANICZNEGO
  ZAWIERA wzmiankę "REVERSE CHARGE"/"odwrotne OBCIĄŻENIE" oraz
  NUMERY VAT-UE OBU stron

⭐ KONTEKST SYSTEMOWY — LUKA VAT: WEDŁUG raportu VAT GAP 2025
  Komisji EUROPEJSKIEJ, Polska ZEBRAŁA W 2023 R. 54 999 MLN EUR
  wpływów Z VAT, LECZ luka WYNIOSŁA 10 453 MLN EUR (**16,0%**
  potencjalnych wpływów) — POWYŻEJ ŚREDNIEJ unijnej (9,5%) —
  WPROWADZENIE split PAYMENT i selektywne STOSOWANIE reverse
  charge MAJĄ NA celu OGRANICZENIE tej luki, poprzez ELIMINACJĘ
  "znikających PODATNIKÓW" i karuzel PODATKOWYCH (⭐ POWIĄZANIE Z
  mechanizmem "FIRM SŁUPÓW" opisanym wcześniej W mod-ustawa-
  akcyzowa-i-clo-UCC.md, sekcja O technikach OBCHODZENIA akcyzy —
  ANALOGICZNY mechanizm KARUZELOWY, TYLKO NA gruncie VAT)

Potwierdzone w 8+ zgodnych, BARDZO aktualnych źródeł 2026, w tym
BEZPOŚREDNIO podatki.gov.pl (Rząd 1, ×2) oraz szybkafaktura.pl
[marzec 2026, Z raportem VAT Gap 2025 KE], poradnikprzedsiebiorcy.pl
[×2, kwiecień-maj 2026], taxology.co, amavat.pl [kwiecień 2026],
medtax.com.pl [sprzed 2 tygodni].
```

### ⭐ VAT OSS / IOSS — e-commerce transgraniczny (dodane 2026-07-19)

```
VAT OSS (One Stop Shop, od 1.07.2021) — uproszczona procedura dla
  SPRZEDAŻY NA ODLEGŁOŚĆ towarów/wybranych usług B2C w UE:
  □ Zamiast rejestracji VAT w KAŻDYM kraju konsumpcji — JEDNA
    kwartalna deklaracja (VIU-DO) w kraju identyfikacji
  □ PRÓG 10 000 EUR NETTO rocznie łącznej sprzedaży B2C do innych
    krajów UE — PO przekroczeniu: obowiązek stosowania stawek VAT
    KRAJU NABYWCY (nie polskich)
  □ REJESTRACJA: formularz VIU-R (e-Urząd Skarbowy / e-Deklaracje)
  □ DEKLARACJA: do KOŃCA miesiąca po każdym kwartale, do Naczelnika
    Drugiego Urzędu Skarbowego Warszawa-Śródmieście — OBOWIĄZKOWA
    nawet przy BRAKU sprzedaży w danym kwartale (deklaracja "zerowa")
  □ Podatek płatny W EURO
  □ EWIDENCJA — obowiązkowa, PRZECHOWYWANA 10 LAT (na wypadek kontroli)
  □ VAT rozliczony w OSS NIE PODLEGA odliczeniu w polskiej deklaracji
    VAT — to podatek NALEŻNY przekazywany innym krajom, nie naliczony
  □ CZEGO OSS NIE OBEJMUJE: przemieszczenia WŁASNYCH towarów do
    magazynu w innym kraju UE (wymaga zwykle LOKALNEJ rejestracji),
    rozliczeń B2B (odwrotne obciążenie/rejestracja lokalna), niektórych
    towarów akcyzowych
  □ PROCEDURA NIEUNIJNA (wariant OSS) — dla przedsiębiorstw SPOZA UE
    bez stałej siedziby w UE, świadczących USŁUGI (cyfrowe, doradcze,
    zawody regulowane) konsumentom w UE — wybór DOWOLNEGO kraju UE do
    rejestracji

VAT IOSS (Import One Stop Shop) — dla SPRZEDAŻY IMPORTOWANEJ:
  □ Dotyczy towarów WYSYŁANYCH SPOZA UE, o wartości PRZESYŁKI ≤ 150 EUR,
    NIEPODLEGAJĄCYCH akcyzie
  □ VAT pobierany od KLIENTA już przy ZAKUPIE (wg stawki kraju
    nabywcy) — przesyłka korzysta ze ZWOLNIENIA z VAT przy imporcie
  □ FAKULTATYWNY — ale po przystąpieniu, WSZYSTKIE kwalifikujące się
    transakcje MUSZĄ być w nim rozliczane (brak wyboru "na sztuki")
  □ Dostępny dla sprzedawców SPOZA UE i Z UE, w tym PLATFORM handlowych

Checklist praktyczny:
□ Czy sprzedaż B2C do innych krajów UE PRZEKROCZYŁA próg 10 000 EUR
  netto rocznie — jeśli TAK, konieczna rejestracja lokalna LUB OSS
□ Czy klient MAGAZYNUJE towary w innym kraju UE (np. Amazon FBA) —
  OSS NIE WYSTARCZY, potrzebna zwykle DODATKOWA rejestracja lokalna
□ Przy IMPORCIE towarów spoza UE o wartości ≤150 EUR — rozważ IOSS
  zamiast płacenia VAT przy odprawie celnej
□ Czy prowadzona jest WYMAGANA 10-LETNIA ewidencja transakcji OSS
```

---

### WIS — Wiążąca Informacja Stawkowa

```
Wniosek: do Dyrektora KIS
Termin na wydanie: 3 miesiące (art. 42b ust. 1 VAT — weryfikuj w ISAP)
Wiążąca: dla organu i podatnika (przez 5 lat — weryfikuj aktualne przepisy)
```

### ⭐⭐⭐ GRUPA VAT (art. 8c–8e, art. 15a, art. 2 pkt 47 ustawy VAT) —
dodane 2026-08-12, uzupełnienie luki zidentyfikowanej w audycie pokrycia
DR-06 (dotąd CAŁKOWICIE nieobecna — instytucja funkcjonująca w Polsce od
1.01.2023 r.)

```
⭐⭐ DEFINICJA (art. 2 pkt 47): grupa VAT to grupa PODMIOTÓW powiązanych
  finansowo, ekonomicznie i organizacyjnie, ZAREJESTROWANA jako
  PODATNIK podatku VAT — sama grupa (NIE poszczególni członkowie)
  STAJE SIĘ odrębnym podatnikiem VAT

⭐⭐⭐ WARUNKI UTWORZENIA (art. 15a ust. 1, 3–5) — WSZYSTKIE TRZY
  powiązania ŁĄCZNIE:
  1) POWIĄZANIE FINANSOWE (ust. 3): JEDEN z podatników POSIADA
     BEZPOŚREDNIO ponad 50% udziałów/akcji W kapitale zakładowym LUB
     ponad 50% praw GŁOSU w organach kontrolnych/stanowiących/
     zarządzających LUB ponad 50% prawa DO udziału w zysku — KAŻDEGO
     z pozostałych członków grupy
  2) POWIĄZANIE EKONOMICZNE (ust. 4): przedmiot GŁÓWNEJ działalności
     członków MA ten SAM charakter, LUB rodzaje działalności
     poszczególnych członków UZUPEŁNIAJĄ się i są WZAJEMNIE
     zależne, LUB członek grupy PROWADZI działalność, Z KTÓREJ W
     CAŁOŚCI lub W DUŻEJ mierze KORZYSTAJĄ inni członkowie
  3) POWIĄZANIE ORGANIZACYJNE: podmioty PRAWNIE LUB faktycznie,
     BEZPOŚREDNIO lub POŚREDNIO, znajdują się POD wspólnym
     KIEROWNICTWEM, LUB organizują swoje działania CAŁKOWICIE lub
     CZĘŚCIOWO W POROZUMIENIU

⭐ KTO MOŻE WEJŚĆ DO GRUPY: podatnicy POSIADAJĄCY siedzibę NA
  terytorium kraju ORAZ podatnicy NIEPOSIADAJĄCY siedziby w kraju —
  W ZAKRESIE, W JAKIM prowadzą działalność NA terytorium kraju ZA
  POŚREDNICTWEM oddziału POŁOŻONEGO w Polsce (art. 15a ust. 2)

⭐⭐ OGRANICZENIA STRUKTURALNE:
  □ Podmiot MOŻE być członkiem TYLKO JEDNEJ grupy VAT jednocześnie
  □ Grupa VAT NIE MOŻE być członkiem INNEJ grupy VAT
  □ W TRAKCIE trwania umowy grupa NIE MOŻE być rozszerzona O nowych
    członków ANI pomniejszona O żadnego Z dotychczasowych — SKŁAD
    jest ZAMROŻONY na cały okres obowiązywania umowy

⭐⭐⭐ SKUTEK PODSTAWOWY — NEUTRALNOŚĆ WEWNĘTRZNA (art. 8c ust. 1):
  dostawy TOWARÓW i świadczenie USŁUG DOKONYWANE POMIĘDZY członkami
  grupy VAT NIE STANOWIĄ czynności OPODATKOWANYCH — transakcje
  WEWNĄTRZGRUPOWE są POZA zakresem VAT (brak faktury Z wykazanym
  podatkiem, WYSTARCZY nota KSIĘGOWA lub inny dokument WEWNĘTRZNY)
  → ⚠️ NIE MYLIĆ Z "grupą kapitałową PIT/CIT" (podatkowa grupa
    kapitałowa, PGK) — TO ODRĘBNA instytucja NA gruncie CIT, Z
    WŁASNYMI, INNYMI warunkami — grupa VAT i PGK MOGĄ, ale NIE MUSZĄ,
    obejmować TE SAME podmioty jednocześnie

⭐⭐ CZYNNOŚCI Z PODMIOTAMI SPOZA GRUPY: dostawy/usługi WYKONANE przez
  CZŁONKA grupy NA rzecz podmiotu SPOZA grupy (lub ODWROTNIE) UWAŻA
  SIĘ za dokonane PRZEZ CAŁĄ grupę VAT — czynności "NA zewnątrz"
  wykazuje się TAK, jakby dokonała ich SAMA grupa jako JEDEN podatnik
  → ⭐ ODDZIAŁ zagranicznego podatnika należący DO grupy: czynności
    dokonane PRZEZ centralę na rzecz TEGO oddziału TRAKTUJE SIĘ jako
    dokonane NA rzecz grupy VAT (art. 8c ust. 2–3 — analiza analogiczna
    DO orzecznictwa TSUE ws. Skandia)

⭐⭐⭐ ODPOWIEDZIALNOŚĆ SOLIDARNA (art. 8e): za ZALEGŁOŚCI podatkowe
  grupy VAT Z tytułu VAT ODPOWIADA SOLIDARNIE CAŁYM swoim MAJĄTKIEM
  KAŻDY Z członków grupy — RÓWNIEŻ PO utracie PRZEZ grupę statusu
  podatnika, ZA okres, W KTÓRYM BYŁ jej członkiem — TO KLUCZOWE
  ryzyko PRZY doradztwie transakcyjnym (np. NABYCIE udziałów W spółce
  będącej CZŁONKIEM grupy VAT — nabywca PRZEJMUJE ryzyko solidarnej
  odpowiedzialności ZA zaległości CAŁEJ grupy z okresu członkostwa)

⭐⭐ PRZEDSTAWICIEL GRUPY VAT (art. 15a ust. 11 i n.):
  □ Członkowie WYZNACZAJĄ spośród siebie PRZEDSTAWICIELA —
    reprezentuje grupę W zakresie JEJ praw i OBOWIĄZKÓW wobec organu
  □ SKŁADA zgłoszenie rejestracyjne VAT-R (Z ZAZNACZENIEM, że
    podatnikiem JEST grupa VAT) WRAZ Z umową o UTWORZENIU grupy —
    naczelnik US WERYFIKUJE przesłanki, PRZED rejestracją
  □ ⚠️ REJESTRACJĘ NALEŻY zgłosić Z ODPOWIEDNIM wyprzedzeniem względem
    daty WSKAZANEJ w umowie — grupa NABYWA status podatnika Z DNIEM
    wskazanym W umowie, NIE WCZEŚNIEJ jednak NIŻ Z dniem FAKTYCZNEJ
    rejestracji (art. 96 ust. 4) — JEŻELI przesłanki NIE zostaną
    POTWIERDZONE, naczelnik ODMAWIA rejestracji, ZAWIADAMIAJĄC
    przedstawiciela
  □ SKŁADA zbiorczy JPK w IMIENIU grupy (JPK_GV) ORAZ ODRĘBNĄ,
    ELEKTRONICZNĄ ewidencję czynności WEWNĄTRZGRUPOWYCH — NA żądanie
    organu udostępnia się JĄ w TERMINIE 7 dni OD doręczenia żądania
  □ OBOWIĄZEK zgłoszenia zmian W stanie faktycznym/prawnym
    SKUTKUJĄCYCH naruszeniem WARUNKÓW uznania grupy ZA podatnika — W
    TERMINIE 14 DNI od ZAISTNIENIA zmiany

⭐⭐ PRZEDŁUŻENIE FUNKCJONOWANIA GRUPY: NOWĄ umowę PRZEDŁUŻAJĄCĄ
  działanie ISTNIEJĄCEJ grupy PRZEDSTAWICIEL składa naczelnikowi W
  TERMINIE 30 DNI PRZED wygaśnięciem DOTYCHCZASOWEJ umowy

⭐⭐⭐ UTRATA STATUSU PODATNIKA — DWIE ODRĘBNE sytuacje:
  1) Z DNIEM POPRZEDZAJĄCYM dzień WYSTĄPIENIA zmian W stanie
     faktycznym/prawnym SKUTKUJĄCYCH naruszeniem WARUNKÓW (np. spadek
     udziału PONIŻEJ 50%, ZERWANIE powiązania ekonomicznego lub
     organizacyjnego) — ⚠️ SKUTEK działa WSTECZ do dnia
     POPRZEDZAJĄCEGO naruszenie, NIE od dnia JEGO stwierdzenia PRZEZ
     organ
  2) Z UPŁYWEM terminu, NA jaki grupa ZOSTAŁA utworzona (JEŚLI umowa
     NIE zostanie PRZEDŁUŻONA w terminie 30 dni)
  → ⭐ ROZLICZENIE PO utracie statusu (art. 8d): W deklaracji ZA
    PIERWSZY okres PO utracie statusu, BYLI członkowie ROZLICZAJĄ SIĘ
    JUŻ indywidualnie — GRUPA składa OSTATNIĄ deklarację ZA okres, W
    KTÓRYM utraciła STATUS; NADWYŻKA podatku naliczonego Z tej
    deklaracji PODLEGA zwrotowi NA rzecz przedstawiciela LUB
    odliczeniu W jego rozliczeniu ZA kolejny okres (art. 87
    stosowany ODPOWIEDNIO); przedstawiciel MOŻE nadal KORYGOWAĆ
    rozliczenia ZA okresy, GDY grupa BYŁA podatnikiem

⭐ PROPORCJA ODLICZENIA VAT (art. 90 ust. 10c) — ISTOTNA komplikacja
  PRAKTYCZNA: przy GRUPACH MIESZANYCH (część członków wykonuje
  sprzedaż OPODATKOWANĄ, część ZWOLNIONĄ lub NIEPODLEGAJĄCĄ VAT) —
  przepisy WYMAGAJĄ liczenia proporcji ODLICZENIA ODRĘBNIE DLA
  KAŻDEGO członka Z osobna (NIE jednej, zbiorczej proporcji DLA
  całej grupy) — USTAWA NIE precyzuje szczegółowej METODOLOGII przy
  zakupach WSPÓLNYCH — W PRAKTYCE rekomenduje się W PIERWSZEJ
  kolejności USTALENIE, jakiego RODZAJU sprzedaży (dającej/
  niedającej prawo DO odliczenia) DOTYCZY dany zakup, NIEZALEŻNIE
  OD tego, KTÓRY członek GO dokonał i KTÓRY dokonuje POWIĄZANEJ
  sprzedaży

⭐ RYZYKO PRAKTYCZNE — UTRATA powiązania EKONOMICZNEGO wskutek
  RESTRUKTURYZACJI: odnotowany W praktyce przypadek (2026), GDZIE
  organ podatkowy UZNAŁ, że W WYNIKU zmian W strukturze DZIAŁALNOŚCI
  członków grupa PRZESTAŁA spełniać PRZESŁANKĘ powiązania
  ekonomicznego — ⚠️ PRZY doradztwie DLA grup VAT KONIECZNE jest
  BIEŻĄCE monitorowanie, CZY planowane zmiany W przedmiocie
  działalności POSZCZEGÓLNYCH członków NIE NARUSZAJĄ warunku Z art.
  15a ust. 4 — SKUTKIEM jest UTRATA statusu ZE skutkiem WSTECZNYM

⭐ KSeF W GRUPIE VAT: grupa VAT jest CZYNNYM podatnikiem VAT, WIĘC
  PODLEGA OBOWIĄZKOWI KSeF na OGÓLNYCH zasadach (patrz sekcja KSeF
  wyżej) — CZŁONEK grupy MOŻE być UPRAWNIONY DO wystawiania faktur
  W IMIENIU grupy OBOK przedstawiciela, jeśli TAK ustalono W
  uprawnieniach NADANYCH W systemie

⭐ DOBROWOLNOŚĆ: zawiązanie grupy VAT MA charakter FAKULTATYWNY —
  BRAK obowiązku DLA podmiotów SPEŁNIAJĄCYCH przesłanki powiązania —
  DECYZJA leży PO stronie PRZEDSIĘBIORSTW (art. 11 dyrektywy
  2006/112/WE jako PODSTAWA unijna, implementowana FAKULTATYWNIE
  przez PAŃSTWA członkowskie)

Checklist praktyczny:
□ Czy WSZYSTKIE TRZY powiązania (finansowe, ekonomiczne, organizacyjne)
  występują ŁĄCZNIE, w dacie ZAWARCIA umowy i W SPOSÓB TRWAŁY — nie
  tylko w momencie rejestracji
□ Czy PRZEDSTAWICIEL złożył VAT-R Z umową Z ODPOWIEDNIM wyprzedzeniem
  przed PLANOWANĄ datą nabycia statusu podatnika
□ Czy PROWADZONA jest wymagana, ODRĘBNA ewidencja elektroniczna
  transakcji WEWNĄTRZGRUPOWYCH (gotowość NA żądanie organu W 7 dni)
□ Przy GRUPACH mieszanych (opodatkowana + zwolniona sprzedaż) — czy
  proporcja ODLICZENIA liczona jest ODRĘBNIE dla KAŻDEGO członka
□ Czy MONITOROWANE są zmiany STRUKTURALNE/własnościowe u członków POD
  kątem ZACHOWANIA warunku powiązania — RYZYKO wstecznej utraty statusu
□ PRZY transakcjach M&A dotyczących spółki będącej CZŁONKIEM grupy VAT
  — czy UWZGLĘDNIONO ryzyko SOLIDARNEJ odpowiedzialności nabywcy ZA
  zaległości CAŁEJ grupy z okresu członkostwa zbywanej spółki
□ Czy termin 30 DNI przed wygaśnięciem umowy NA jej PRZEDŁUŻENIE jest
  PILNOWANY w kalendarzu sprawy

⚠️ Weryfikuj aktualne brzmienie art. 8c–8e i 15a w ISAP — instytucja
  relatywnie MŁODA (od 2023 r.), praktyka INTERPRETACYJNA (KIS, TSUE
  ws. Skandia) NADAL się kształtuje.
```

---

