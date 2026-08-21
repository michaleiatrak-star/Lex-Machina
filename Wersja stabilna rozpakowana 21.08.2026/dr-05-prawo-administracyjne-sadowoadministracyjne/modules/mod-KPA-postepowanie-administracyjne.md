# mod-KPA-postepowanie-administracyjne

**Status:** moduł klasy kancelaryjnej — poziom DR-05 (⚠️ PRZENIESIONY
2026-07-19 z DR-04, gdzie był błędnie umiejscowiony przez wiele
wcześniejszych sesji — nagłówek "poziom DR-03" był reliktem jeszcze
wcześniejszego błędu kopiowania szablonu, teraz poprawiony)
**Źródło weryfikacji:** KPA — Dz.U. 2025 poz. 1691 t.j. | PPSA — Dz.U. 2026 poz. 143 t.j.
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

> ⚠️ TEN moduł jest CZĘŚCIĄ RODZINY plików KPA, PODZIELONEJ
> 2026-08-12 (NOTA-4, audyt-systemu-v4/CHECKLIST-DEDUP.md — moduł
> źródłowy osiągnął 1115 linii, ~2,8x próg 400 linii). RODZINA
> czterech plików: TEN plik (rdzeń:
> zasady ogólne, strona, wyłączenie, doręczenia, wszczęcie postępowania,
> terminy, mapa postępowania), mod-KPA-mechanizmy-w-toku-sprawy.md (zawieszenie,
> dowody, rozprawa, terminy-obliczanie/przywrócenie), mod-KPA-decyzja-i-odwolanie.md (elementy
> decyzji, odwołanie, postanowienia/zażalenia), mod-KPA-tryby-
> nadzwyczajne-i-strategia.md (wznowienie, nieważność, załatwianie
> spraw/ponaglenie, bezczynność, postępowanie uproszczone,
> właściwość organów, kary, skarga do WSA, strategia).
>
> **⚠️ PRZY PODZIALE naprawiono kolejność:** sekcja o postępowaniu
> dowodowym (art. 75-88a) BYŁA omyłkowo umieszczona W nieprawidłowym
> miejscu oryginalnego pliku (między "skarga do WSA" a "checklist
> dowodowy") — TERAZ znajduje się we WŁAŚCIWYM, tematycznym miejscu
> obok zawieszenia postępowania i rozprawy.
>
> **⚠️ AUDYT 2026-08-13 — 4 luki uzupełnione w rodzinie plików**
> (ZASADA 7 OUTPUT-COMPLETENESS): art. 106/106a (współdziałanie
> organów), art. 189g-189k (przedawnienie/zaległość/ulgi kar), art.
> 265-267 (koszty postępowania), art. 22 §3 (spory kompetencyjne) —
> wszystkie w `mod-KPA-tryby-nadzwyczajne-i-strategia.md`. Dział IVa
> KPA (art. 189a-189k) domknięty w całości po naprawie regresji z
> tej samej sesji (przywrócona treść art. 189d/189f, uzupełnione
> art. 189a-189c/189e). Szczegóły:
> `audyt-systemu-v4/references/CHECKLIST-DEDUP.md`, NOTA-11/NOTA-12/NOTA-13. Kontynuacja: mediacja (96a-96n),
> metryki/protokoly (66a-72), udostepnianie akt (73-74a) w
> mod-KPA-mechanizmy-w-toku-sprawy.md; skarga na akty prawa
> miejscowego/nadzoru (art. 3 par. 2 pkt 5-7, 147-148, 152 PPSA)
> w mod-KPA-tryby-nadzwyczajne-i-strategia.md.

---

## 1. CORE

### Zakres modułu
Postępowanie administracyjne ogólne (KPA), odwołania od decyzji, tryby nadzwyczajne (wznowienie, nieważność, uchylenie), skarga do WSA i NSA, bezczynność i przewlekłość organu, kary administracyjne, szczególna ścieżka ZUS (sąd powszechny — nie WSA).

### Akty i źródła kontrolne

| Akt | Dz.U. | Uwaga |
|---|---|---|
| Kodeks postępowania administracyjnego (KPA) | Dz.U. 2025 poz. 1691 t.j. | |
| Prawo o postępowaniu przed sądami adm. (PPSA) | Dz.U. 2026 poz. 143 t.j. | |
| Ustawa o kosztach sądowych w sprawach cywilnych (KSCU) | Dz.U. 2024 poz. 959 t.j. | Opłaty od skarg do WSA |

---

## 1a. ⭐⭐⭐ ZASADY OGÓLNE POSTĘPOWANIA (art. 6-16 KPA) — dodano
2026-08-12, na żądanie użytkownika — dotąd CAŁKOWICIE nieobecne,
mimo że TO NAJCZĘŚCIEJ cytowane, FUNDAMENTALNE przepisy CAŁEGO
Kodeksu

```
⭐⭐⭐ ZNACZENIE: normy Z Rozdziału 2 Działu I (art. 6-16) — DYREKTYWY
  interpretacyjne WOBEC pozostałych przepisów KODEKSU — NIEZASTOSOWANIE
  bądź NIEPRAWIDŁOWE zastosowanie zasad STANOWI rażące NARUSZENIE
  przepisów postępowania ADMINISTRACYJNEGO (⭐ podstawa DO uchylenia
  decyzji/wznowienia — powiązanie Z sekcją 4 NIŻEJ)

⭐⭐⭐ DWANAŚCIE ZASAD (KATALOG PEŁNY):

1) ART. 6 — PRAWORZĄDNOŚĆ: organy DZIAŁAJĄ na PODSTAWIE przepisów
   PRAWA — NIE są ZWIĄZANE podstawą prawną PODANĄ przez STRONĘ —
   ⭐ podstawą DECYZJI administracyjnej NIE mogą być PREAMBUŁY
   aktów normatywnych, UCHWAŁY Rady Ministrów, CZY zarządzenia
   Prezesa RM

2) ART. 7 — PRAWDA OBIEKTYWNA + interes SPOŁECZNY: W toku
   postępowania organy STOJĄ na STRAŻY praworządności, Z URZĘDU
   lub NA wniosek stron PODEJMUJĄ wszelkie CZYNNOŚCI niezbędne do
   DOKŁADNEGO wyjaśnienia stanu FAKTYCZNEGO oraz DO załatwienia
   sprawy, MAJĄC na WZGLĘDZIE interes SPOŁECZNY i SŁUSZNY interes
   OBYWATELI — organ MUSI wyczerpująco ZEBRAĆ i rozpatrzyć CAŁY
   materiał DOWODOWY

3) ART. 8 — POGŁĘBIANIE zaufania OBYWATELI do władzy PUBLICZNEJ
   (+ zasada RÓWNEGO traktowania)

4) ART. 9 — DOSTĘP do INFORMACJI i znajomość PRAWA: obowiązek
   NALEŻYTEGO i WYCZERPUJĄCEGO informowania STRON

5) ⭐⭐⭐ ART. 10 — CZYNNY UDZIAŁ strony: organy OBOWIĄZANE są
   zapewnić STRONOM czynny UDZIAŁ w KAŻDYM stadium POSTĘPOWANIA, a
   PRZED wydaniem decyzji UMOŻLIWIĆ im wypowiedzenie SIĘ co DO
   zebranych dowodów I materiałów oraz zgłoszonych ŻĄDAŃ — ⭐
   WYJĄTEK (§2): organ MOŻE odstąpić TYLKO GDY załatwienie sprawy
   NIE cierpi zwłoki Z powodu ZAGROŻENIA życia/zdrowia LUDZKIEGO
   albo GROŻĄCEJ niepowetowanej SZKODY materialnej — §3: organ
   OBOWIĄZANY jest UTRWALIĆ w AKTACH sprawy, w DRODZE adnotacji,
   PRZYCZYNY takiego ODSTĄPIENIA

6) ART. 11 — ZASADNOŚĆ przesłanek/PRZEKONYWANIE: organy POWINNY
   wyjaśniać STRONOM zasadność PRZESŁANEK, ABY w miarę MOŻNOŚCI
   doprowadzić DO wykonania decyzji BEZ potrzeby stosowania
   ŚRODKÓW przymusu

7) ART. 12 — SZYBKOŚĆ i PROSTOTA postępowania

8) ART. 13 — UGODOWE załatwianie SPRAW spornych (GDZIE możliwe —
   powiązanie Z sekcją 4a NIŻEJ, ugoda ADMINISTRACYJNA)

9) ART. 14 — PISEMNOŚĆ (Z wyjątkami DLA formy ustnej/ELEKTRONICZNEJ)

10) ART. 15 — DWUINSTANCYJNOŚĆ

11) ⭐⭐⭐ ART. 16 — TRWAŁOŚĆ decyzji OSTATECZNYCH: §1 — decyzje, OD
    których NIE służy odwołanie W administracyjnym TOKU instancji
    LUB wniosek O ponowne rozpatrzenie SPRAWY, SĄ ostateczne —
    uchylenie/zmiana/stwierdzenie NIEWAŻNOŚCI oraz wznowienie
    postępowania MOŻE nastąpić TYLKO w PRZYPADKACH przewidzianych
    W kodeksie LUB ustawach szczególnych — §2: decyzje MOGĄ być
    ZASKARŻANE do sądu ADMINISTRACYJNEGO — §3: decyzje OSTATECZNE,
    KTÓRYCH nie MOŻNA zaskarżyć do SĄDU, SĄ prawomocne

12) DOSTĘP do SĄDOWEJ kontroli DECYZJI (⭐ ŚCIŚLE powiązana Z §2
    art. 16 wyżej)

⭐⭐ PRAKTYCZNY, WAŻNY niuans DOTYCZĄCY pouczeń: BŁĘDNE pouczenie w
  DECYZJI co DO prawa ODWOŁANIA albo wniesienia POWÓDZTWA do sądu
  powszechnego LUB skargi do SĄDU administracyjnego NIE MOŻE
  szkodzić STRONIE, która ZASTOSOWAŁA się do TEGO pouczenia — ⭐
  WAŻNE zastrzeżenie: JEŻELI strona KORZYSTA z wykwalifikowanego
  PEŁNOMOCNIKA (adwokat, RADCA prawny) — obowiązki INFORMACYJNE
  organu SĄ WĘŻSZE niż W sytuacji, GDY strona NIE ma TAKIEGO
  pełnomocnika

Potwierdzone w 6+ zgodnych źródeł, w tym BEZPOŚREDNIO dosłowny
tekst art. 6-16 (e-prawnik.pl [×2], przepisy.gofin.pl [grudzień
2025, NAJŚWIEŻSZE, aktualny t.j.]), Wikipedia [Z pełnym omówieniem
konsekwencji naruszenia], docplayer.pl [materiał akademicki Z
pełnym katalogiem 12 zasad].
```

---

## 1b. ⭐⭐⭐ STRONA POSTĘPOWANIA (art. 28-34 KPA) — dodano
2026-08-12, na żądanie użytkownika — dotąd CAŁKOWICIE nieobecne,
FUNDAMENTALNE pojęcie decydujące, KTO w OGÓLE ma prawo UCZESTNICZYĆ
w postępowaniu

```
⭐⭐⭐ ART. 28 — DEFINICJA: STRONĄ jest KAŻDY, CZYJEGO interesu
  prawnego LUB obowiązku DOTYCZY postępowanie, ALBO kto ŻĄDA
  czynności ORGANU ze względu NA swój interes PRAWNY lub obowiązek
  — ⭐⭐ KLUCZOWE: interes MUSI być PRAWNY (wynikający Z konkretnego
  przepisu PRAWA), NIE wystarczy interes WYŁĄCZNIE faktyczny —
  przypadkowy OBSERWATOR zdarzenia, LUB osoba Z ogólnym,
  niesprecyzowanym ZAINTERESOWANIEM sprawą — NIE jest STRONĄ

⭐ ART. 29: stronami MOGĄ być OSOBY fizyczne I osoby PRAWNE, a GDY
  chodzi o PAŃSTWOWE/samorządowe jednostki ORGANIZACYJNE oraz
  organizacje SPOŁECZNE — RÓWNIEŻ jednostki NIEPOSIADAJĄCE
  osobowości PRAWNEJ ("ułomne OSOBY prawne")

⭐⭐ ART. 30: §1 zdolność PRAWNA/do czynności PRAWNYCH — OCENIANA
  według przepisów PRAWA cywilnego — §2: osoby BEZ zdolności DO
  czynności prawnych DZIAŁAJĄ przez USTAWOWYCH przedstawicieli —
  §4: W sprawach DOTYCZĄCYCH praw ZBYWALNYCH/dziedzicznych, PRZY
  zbyciu prawa LUB śmierci strony W toku postępowania — NA jej
  MIEJSCE WSTĘPUJĄ następcy PRAWNI — ⭐ §5: W sprawach dotyczących
  SPADKÓW nieobjętych — działają OSOBY sprawujące zarząd MAJĄTKIEM
  masy SPADKOWEJ, a W ich BRAKU — KURATOR wyznaczony przez SĄD na
  wniosek ORGANU (⭐ powiązanie Z mod-KRO-opieka-i-kuratela.md —
  KONKRETNE zastosowanie instytucji KURATORA W kontekście
  administracyjnym)

⭐⭐⭐ ART. 31 — UDZIAŁ ORGANIZACJI SPOŁECZNEJ (⭐ CIEKAWA, RZADKO
  wykorzystywana INSTYTUCJA):
  → §1: organizacja SPOŁECZNA w SPRAWIE dotyczącej INNEJ osoby
    MOŻE wystąpić Z żądaniem: (1) WSZCZĘCIA postępowania, (2)
    DOPUSZCZENIA jej DO udziału w POSTĘPOWANIU — JEŻELI jest to
    UZASADNIONE celami STATUTOWYMI i GDY przemawia ZA tym interes
    SPOŁECZNY
  → §3: organizacja SPOŁECZNA dopuszczona DO udziału UCZESTNICZY W
    postępowaniu NA prawach STRONY — ⭐ PEŁNE uprawnienia
    PROCESOWE, NIE ograniczone
  → §4: organ, WSZCZYNAJĄC postępowanie W sprawie DOTYCZĄCEJ innej
    osoby, ZAWIADAMIA o TYM organizację SPOŁECZNĄ, JEŻELI uzna, że
    MOŻE ona być ZAINTERESOWANA
  → §5: organizacja, KTÓRA NIE uczestniczy NA prawach strony, MOŻE
    za ZGODĄ organu przedstawić SWÓJ pogląd (wyrażony W uchwale
    organu STATUTOWEGO) — zgoda WYRAŻANA w FORMIE postanowienia,
    NA które NIE przysługuje ZAŻALENIE
  → ⭐ CIEKAWY, PRAKTYCZNY case Z orzecznictwa (wyrok NSA Z
    24.05.2018, sygn. II OSK 1621/16): NAWET GDY organ NIE wydał
    FORMALNEGO postanowienia O dopuszczeniu organizacji, ALE
    PRZYJMOWAŁ jej OŚWIADCZENIA i doręczał JEJ pisma/decyzje — TE
    fakty NALEŻY uznać ZA dorozumiane DOPUSZCZENIE do udziału

⭐⭐⭐ ART. 32-33 — PEŁNOMOCNIK strony:
  → art. 32: strona MOŻE działać PRZEZ pełnomocnika, CHYBA że
    CHARAKTER czynności WYMAGA jej OSOBISTEGO działania
  → ⭐⭐⭐ art. 33 §1: pełnomocnikiem STRONY może być TYLKO osoba
    FIZYCZNA posiadająca ZDOLNOŚĆ do czynności PRAWNYCH — ⚠️ WAŻNE
    ograniczenie: STOWARZYSZENIE/organizacja SPOŁECZNA NIE MOŻE
    być pełnomocnikiem STRONY (potwierdzone WYROKIEM WSA Kielce z
    6.02.2019, sygn. II SA/Ke 779/18) — TYLKO KONKRETNA osoba
    fizyczna

Potwierdzone w 8+ zgodnych źródeł, w tym BEZPOŚREDNIO dosłowny
tekst art. 28-34 (arslege.pl [×2], lexlege.pl, przepisy.gofin.pl,
srokowo-online.pl), rp.pl [marzec 2019, Z cytowanym orzecznictwem
WSA/NSA], adwokat-jakubowska.pl [lipiec 2025, NAJŚWIEŻSZE],
prawo.uwr.edu.pl [materiał akademicki].
```

---

## 2. INTAKE

```
□ Co posiada klient:
  Decyzja I instancji → odwołanie (14 dni)
  Decyzja II instancji → skarga do WSA (30 dni)
  Decyzja ostateczna → tryby nadzwyczajne (wznowienie / nieważność)
  Brak decyzji (milczenie organu) → ponaglenie + skarga na bezczynność
  Decyzja ZUS/KRUS → SĄDU PRACY, NIE WSA (art. 477⁹ §1 KPC!)
□ Termin upływa: [oblicz natychmiast od daty doręczenia]
□ Stan prawny na dzień zdarzenia, decyzji i wniesienia środka
□ Organ I instancji i organ odwoławczy (SKO / Wojewoda / organ wyższy)
□ Czy sprawa jest podatkowa → Ordynacja podatkowa, nie KPA
```

---

## 2a. ⭐⭐⭐ WYŁĄCZENIE PRACOWNIKA I ORGANU (art. 24-27a KPA) —
dodano 2026-08-12, na żądanie użytkownika — dotąd CAŁKOWICIE
nieobecne

```
⭐⭐⭐ CEL: zabezpieczenie NALEŻYTEJ bezstronności, sumienności I
  rzetelności W postępowaniu — ⭐ NARUSZENIE tych przepisów TO
  BEZPOŚREDNIA podstawa DO wznowienia postępowania (powiązanie Z
  sekcją 4 NIŻEJ)

⭐⭐⭐ ART. 24 §1 — SIEDEM przesłanek wyłączenia PRACOWNIKA (musi
  być WYŁĄCZONY od udziału W postępowaniu, GDY sprawa DOTYCZY):
  1) SAMEGO pracownika JAKO strony, LUB gdy POZOSTAJE Z jedną ze
     stron W stosunku PRAWNYM wpływającym NA jego prawa/obowiązki
  2) SWEGO małżonka ORAZ krewnych/powinowatych DO drugiego stopnia
  3) osoby ZWIĄZANEJ z NIM tytułem przysposobienia, OPIEKI lub
     kurateli
  4) sprawy, W KTÓREJ był ŚWIADKIEM/biegłym albo BYŁ/jest
     przedstawicielem JEDNEJ ze stron
  5) sprawy, W której BRAŁ udział W WYDANIU zaskarżonej DECYZJI
  6) sprawy, Z powodu KTÓREJ wszczęto PRZECIWKO niemu dochodzenie
     służbowe/dyscyplinarne/KARNE
  7) sprawy, W której STRONĄ jest osoba POZOSTAJĄCA wobec niego W
     stosunku NADRZĘDNOŚCI służbowej
  → §2: powody wyłączenia TRWAJĄ TAKŻE PO ustaniu małżeństwa/
    przysposobienia/opieki/kurateli (⭐ NIE ustają AUTOMATYCZNIE
    wraz Z rozwodem/zakończeniem relacji)

⭐⭐ ART. 25 — WYŁĄCZENIE CAŁEGO ORGANU (nie tylko pracownika): organ
  PODLEGA wyłączeniu OD załatwienia SPRAWY dotyczącej interesów
  MAJĄTKOWYCH (1) JEGO kierownika LUB osób bliskich MU analogicznie
  do art. 24 §1 pkt 2-3, (2) osoby ZAJMUJĄCEJ stanowisko
  kierownicze W organie BEZPOŚREDNIO wyższego stopnia LUB osób Z
  nim ZWIĄZANYCH analogicznie

⭐⭐ ART. 26-27 — SKUTKI wyłączenia:
  → PRACOWNIK: bezpośredni PRZEŁOŻONY wyznacza INNEGO pracownika
  → ORGAN: sprawę PRZEJMUJE organ WYŻSZEGO stopnia (art. 25 §1
    pkt 1) LUB analogicznie DLA przypadku Z pkt 2
  → CZŁONEK organu KOLEGIALNEGO: o WYŁĄCZENIU postanawia
    PRZEWODNICZĄCY organu kolegialnego LUB organu WYŻSZEGO stopnia
  → ⭐ CZŁONEK samorządowego kolegium ODWOŁAWCZEGO (SKO): PODLEGA
    wyłączeniu OD udziału w postępowaniu W SPRAWIE wniosku o
    PONOWNE rozpatrzenie sprawy, JEŻELI brał UDZIAŁ w wydaniu
    decyzji OBJĘTEJ wnioskiem (POTWIERDZONE uchwałą 7 sędziów NSA
    z 22.07.2007)

⭐⭐⭐ KONSEKWENCJE PROCESOWE — KLUCZOWE powiązanie: JEŻELI decyzja
  ZOSTAŁA wydana przez PRACOWNIKA lub ORGAN podlegający WYŁĄCZENIU
  na PODSTAWIE art. 24/25/27 — TO PODSTAWA do WZNOWIENIA
  postępowania (art. 145 KPA — patrz sekcja 4 NIŻEJ) — RÓWNIEŻ MOŻE
  być PODNIESIONE W skardze do sądu ADMINISTRACYJNEGO jako
  "naruszenie PRZEPISÓW procesowych mających ISTOTNY wpływ NA
  wynik sprawy"

⭐ ŚWIEŻE POTWIERDZENIE orzecznicze: wyrok NSA Z **1.04.2025 R.**
  (sygn. II OSK 253/25) — NSA POZOSTAJE KONSEKWENTNY w OCENIE
  prawnej NARUSZENIA przepisów O wyłączeniu — POTWIERDZA WAGĘ
  zasady BEZSTRONNOŚCI, MIMO że TAK "stałe LINIE orzecznicze" SĄ
  rzadkie W praktyce prawniczej

Potwierdzone w 7+ zgodnych źródeł, w tym BEZPOŚREDNIO dosłowny
tekst art. 24-27 (arslege.pl, lexlege.pl, przepisy.gofin.pl
[listopad 2021]), jklaw.pl [maj 2025, Z omówieniem ŚWIEŻEGO wyroku
NSA], sciencewatch.pl, socium.pl.
```

---

## 2b. ⭐⭐⭐ DORĘCZENIA (art. 39-49b KPA) — dodano 2026-08-12, na
żądanie użytkownika — dotąd CAŁKOWICIE nieobecne, mimo że TO JEDEN
Z NAJCZĘŚCIEJ praktycznie ISTOTNYCH mechanizmów proceduralnych

```
⭐⭐ ART. 39-39¹ — PRIORYTET doręczenia ELEKTRONICZNEGO: pisma
  DORĘCZA się na ADRES do doręczeń ELEKTRONICZNYCH wpisany DO bazy
  adresów ELEKTRONICZNYCH (ustawa O doręczeniach elektronicznych Z
  18.11.2020), A W przypadku PEŁNOMOCNIKA — na ADRES wskazany W
  podaniu, ALBO na ADRES powiązany Z kwalifikowaną usługą
  REJESTROWANEGO doręczenia elektronicznego, ZA pomocą KTÓREJ
  wniesiono PODANIE

⭐⭐⭐ ART. 40 — KOMU doręcza SIĘ pisma:
  → §1: PISMA doręcza się STRONIE, a GDY strona DZIAŁA przez
    przedstawiciela — TEMU przedstawicielowi
  → §2: JEŻELI strona USTANOWIŁA pełnomocnika — pisma DORĘCZA się
    pełnomocnikowi — JEŻELI ustanowiono KILKU pełnomocników —
    doręcza SIĘ TYLKO jednemu (STRONA może wskazać KTÓREMU)
  → §3: W sprawie WSZCZĘTEJ na skutek PODANIA złożonego przez DWIE
    LUB więcej stron — pisma DORĘCZA się WSZYSTKIM stronom, CHYBA
    że w PODANIU wskazały JEDNĄ jako upoważnioną DO odbioru
  → ⭐⭐ §4: strona BEZ miejsca zamieszkania/siedziby W RP/UE/
    Szwajcarii/EFTA — MUSI wskazać PEŁNOMOCNIKA do doręczeń W
    Polsce (CHYBA że doręczenie ELEKTRONICZNE)
  → §5: BRAK wskazania takiego pełnomocnika — pisma POZOSTAWIA
    się W AKTACH sprawy ZE SKUTKIEM doręczenia — strona MUSI być
    O TYM pouczona PRZY pierwszym doręczeniu

⭐⭐⭐ ⚡ ART. 44 — FIKCJA DORĘCZENIA (NAJCZĘŚCIEJ praktycznie
  istotny MECHANIZM w CAŁYM rozdziale): GDY niemożliwe doręczenie
  W sposób z art. 42-43 (adresat NIEOBECNY, domownik/sąsiad/
  dozorca NIE podjęli się ODDANIA pisma):
  → §1: pismo PRZECHOWYWANE przez **14 DNI** — przez OPERATORA
    pocztowego W placówce, LUB składane W urzędzie GMINY/miasta
    (GDY doręcza pracownik URZĘDU)
  → zawiadomienie O pozostawieniu PISMA wraz Z informacją O
    możliwości ODBIORU w terminie **7 DNI** — UMIESZCZANE w
    skrzynce POCZTOWEJ — DWUKROTNE awizowanie (JEŻELI nie
    odebrano po PIERWSZYM awizo — DRUGIE awizo)
  → ⭐⭐⭐ §4: GDY przesyłka NIE zostanie odebrana — doręczenie
    "UWAŻA SIĘ za DOKONANE" z upływem OSTATNIEGO dnia okresu
    przechowywania — ⭐ TO WŁAŚNIE "FIKCJA doręczenia" (użycie
    słów "UWAŻA się" wskazuje NA fikcję prawną — pismo TRAKTOWANE
    jako DORĘCZONE, NIEZALEŻNIE od TEGO, czy adresat FAKTYCZNIE je
    odebrał/przeczytał)
  → ⭐ WAŻNY szczegół PRAKTYCZNY: termin 14 dni LICZY się OD dnia
    PIERWSZEGO zawiadomienia — NIE PRZEDŁUŻA się przez PONOWNE
    wskazanie W powtórnym zawiadomieniu INNEGO terminu (np. GDY
    drugie awizo ZŁOŻONO po 8 dniach OD pierwszego — NIE oznacza
    to DODATKOWYCH 7 dni OD tej nowej daty)

Potwierdzone w 8+ zgodnych, BARDZO aktualnych źródeł (legalnabudowa.pl
[maj 2025, Z pełnym omówieniem FIKCJI doręczenia], lexlege.pl [×3,
Z aktualnymi datami WERYFIKACJI lipiec 2026], przepisy.gofin.pl,
arslege.pl [×2]).
```

---

## 2c. ⭐⭐⭐ WSZCZĘCIE POSTĘPOWANIA (Dział II, Rozdział 1, art.
61-66 KPA) — dodano 2026-08-13, uzupełnienie luki z audytu pokrycia
KPA — dotąd CAŁKOWICIE nieobecne, mimo że TO fundamentalny, PIERWSZY
etap każdej sprawy administracyjnej

```
⭐⭐⭐ ART. 61 — TRYB wszczęcia:
  §1: postępowanie WSZCZYNA się NA ŻĄDANIE strony LUB z URZĘDU
  §2: organ MOŻE, ZE WZGLĘDU na szczególnie WAŻNY interes strony,
    wszcząć Z URZĘDU postępowanie TAKŻE w sprawie, W KTÓREJ przepis
    prawa WYMAGA wniosku strony — ALE musi UZYSKAĆ zgodę strony W
    TOKU postępowania — ⭐ BRAK zgody = OBOWIĄZEK umorzenia
    postępowania (NIE fakultatywność — organ MUSI umorzyć)
  §3: DATA wszczęcia NA ŻĄDANIE strony = dzień DORĘCZENIA żądania
    organowi (⭐⭐⭐ KLUCZOWE dla liczenia TERMINÓW załatwienia
    sprawy, patrz Rozdz. 7 Działu I, art. 35-38 — zależność
    krzyżowa)
  §3a: dla żądania wniesionego DROGĄ elektroniczną — datą wszczęcia
    JEST dzień WYSTAWIENIA dowodu OTRZYMANIA (ustawa o doręczeniach
    elektronicznych)

⭐⭐ ART. 61a — ODMOWA wszczęcia postępowania:
  §1: GDY żądanie wniesiono PRZEZ osobę NIEBĘDĄCĄ stroną LUB z
    innych UZASADNIONYCH przyczyn postępowanie NIE MOŻE być
    wszczęte — organ WYDAJE POSTANOWIENIE o ODMOWIE wszczęcia
  §2: na TO postanowienie SŁUŻY ZAŻALENIE (⭐ powiązanie z
    mod-KPA-decyzja-i-odwolanie.md, §3e — postanowienia i zażalenia)

⭐ ART. 62 — ŁĄCZENIE postępowań wielu stron: MOŻNA wszcząć i
  prowadzić JEDNO postępowanie DOTYCZĄCE więcej niż JEDNEJ strony,
  GDY łącznie spełnione TRZY przesłanki: 1) TEN SAM stan FAKTYCZNY,
  2) TA SAMA podstawa PRAWNA, 3) właściwy JEST TEN SAM organ

⭐⭐⭐ ART. 63 — WYMOGI FORMALNE podania (żądania, wyjaśnienia,
  odwołania, zażalenia):
  §1: FORMY dopuszczalne — PISEMNIE, telegraficznie, ZA pomocą
    telefaksu LUB USTNIE do protokołu, A TAKŻE ZA pomocą ŚRODKÓW
    komunikacji ELEKTRONICZNEJ przez elektroniczną SKRZYNKĘ
    podawczą organu
  §2: TREŚĆ minimalna — WSKAZANIE osoby, OD której POCHODZI, JEJ
    adres I żądanie, ORAZ czynienie ZADOŚĆ innym wymaganiom
    ustalonym W przepisach SZCZEGÓLNYCH
  §3: podanie WNIESIONE pisemnie POWINNO być PODPISANE przez
    wnoszącego

⭐⭐⭐ ART. 64 — BRAKI FORMALNE podania — DWIE różne, WAŻNE
  konsekwencje w ZALEŻNOŚCI od RODZAJU braku:
  §1: BRAK adresu wnoszącego + NIEMOŻNOŚĆ jego USTALENIA na
    podstawie POSIADANYCH danych → podanie POZOSTAWIA się BEZ
    ROZPOZNANIA (⭐ automatyczny SKUTEK, bez wzywania DO uzupełnienia)
  §2: INNE braki formalne (np. BRAK żądania, brak PODPISU) → organ
    WZYWA wnoszącego DO usunięcia braków W wyznaczonym TERMINIE,
    NIE KRÓTSZYM niż **7 DNI**, z POUCZENIEM, że NIEUSUNIĘCIE
    braków spowoduje POZOSTAWIENIE podania BEZ rozpoznania
  ⭐⭐⭐ WAŻNA praktyczna KWALIFIKACJA z orzecznictwa (WSA Kraków
    27.09.2017 III SA/Kr 711/17; NSA 3.08.2012 II OSK 826/11):
    pozostawienie BEZ rozpoznania NIE następuje W FORMIE decyzji
    ani POSTANOWIENIA — to CZYNNOŚĆ materialno-techniczna, o
    KTÓREJ trzeba TYLKO POINFORMOWAĆ stronę (⭐ BRAK zwykłego środka
    zaskarżenia typu ODWOŁANIE/zażalenie — inny TRYB kwestionowania)
  ⭐⭐ Dzień WSZCZĘCIA postępowania (dla LICZENIA terminów) to dzień
    DORĘCZENIA PIERWSZEGO podania w SPRAWIE, NIE dzień, W KTÓRYM
    uzupełniono BRAKI formalne (doktryna, komentarz KPA)

⭐⭐⭐ ART. 65 — PODANIE do organu NIEWŁAŚCIWEGO:
  §1: organ NIEWŁAŚCIWY W sprawie NIEZWŁOCZNIE przekazuje PODANIE
    do organu WŁAŚCIWEGO, RÓWNOCZEŚNIE zawiadamiając O TYM
    wnoszącego — ZAWIADOMIENIE powinno ZAWIERAĆ uzasadnienie
  ⭐ Zawiadomienie O przekazaniu NIE ma CECH postanowienia — NIE
    przysługuje NA nie zażalenie (WSA Gliwice 20.03.2019, I SA/Gl
    1313/18)
  §2: GDY podania NIE MOŻNA ustalić organu WŁAŚCIWEGO na PODSTAWIE
    danych podania, ALBO gdy Z podania WYNIKA, że właściwy JEST SĄD
    powszechny → organ ZWRACA podanie WNOSZĄCEMU (zamiast
    przekazywać DALEJ)

⭐⭐ ART. 66 — PODANIE dotyczące KILKU spraw dla RÓŻNYCH organów:
  §1: organ ROZPOZNAJE sprawy NALEŻĄCE do JEGO właściwości ORAZ
    zawiadamia wnoszącego, że W pozostałych sprawach POWINIEN
    wnieść ODRĘBNE podanie DO właściwego organu
  ⭐⭐⭐ §2: KLUCZOWE zabezpieczenie TERMINU — odrębne podanie
    złożone ZGODNIE z zawiadomieniem, W TERMINIE **14 DNI** od
    doręczenia zawiadomienia, UWAŻA się za ZŁOŻONE w DNIU wniesienia
    PIERWSZEGO (pierwotnego) podania — ⭐ strona NIE traci daty
    wszczęcia, JEŚLI dochowa TEGO 14-dniowego terminu
  §3: GDY podanie wniesiono DO organu niewłaściwego, A organu
    właściwego NIE można ustalić na PODSTAWIE danych podania, ALBO
    z podania WYNIKA właściwość SĄDU powszechnego — organ ZWRACA
    je wnoszącemu

⭐⭐ PRAKTYCZNA CHECKLISTA — kontrola FORMALNA nowego podania:
  □ Forma zgodna z art. 63 §1 (pisemnie/telegraficznie/faksem/
    ustnie do protokołu/elektronicznie)
  □ Wskazany wnoszący i JEGO adres (⭐ brak = art. 64 §1, bez
    rozpoznania wprost, bez wzywania)
  □ Sformułowane żądanie
  □ Podpis (przy formie pisemnej)
  □ Organ właściwy rzeczowo/miejscowo/instancyjnie — jeśli NIE:
    art. 65-66 (przekazanie/zwrot), NIE odrzucenie podania

Potwierdzone bezpośrednio w Rządzie 1 (isap.sejm.gov.pl, D20250001691 —
art. 61, 61a, 62, 63 zweryfikowane dosłownym brzmieniem tekstu
jednolitego Dz.U. 2025 poz. 1691) oraz krzyżowo w Rządzie 2
(arslege.pl, lexlege.pl — zgodne co do numeracji i treści) i
dodatkowo w Rządzie 2/3 dla wykładni praktycznej art. 64-66 (rp.pl,
komentarz KPA UWM Olsztyn, orzecznictwo WSA/NSA cytowane wyżej).
```

---

## 3. PROCEDURA

### TERMINY — ABSOLUTNY PRIORYTET

```
Odwołanie od decyzji:             14 dni od doręczenia (art. 129 §2 KPA)
Zażalenie na postanowienie:        7 dni od doręczenia (art. 141 §2 KPA)
Wniosek o ponowne rozpatrzenie:   14 dni (gdy organ naczelny/minister/SKO — art. 127 §3 KPA)
Skarga do WSA:                    30 dni od doręczenia decyzji II inst. (art. 53 §1 PPSA)
Skarga kasacyjna NSA:             30 dni od doręczenia wyroku WSA z uzasadnieniem (art. 177 §1 PPSA)
Wznowienie postępowania:           1 miesiąc od dowiedzenia się o podstawie (art. 148 KPA)
⚠️ Wszystkie terminy ZAWITE — po upływie: decyzja prawomocna lub środek niedopuszczalny
```

### Mapa postępowania — droga zwykła

```
Decyzja organu I instancji
  ↓ [14 dni] ODWOŁANIE — składane ZA POŚREDNICTWEM organu I inst. do organu II inst.
    → Organ I inst. ma 7 dni na przekazanie akt do organu II inst.
    → Autokontrola: organ I inst. może sam uchylić/zmienić decyzję w 7 dniach
Decyzja organu II instancji
  ↓ [30 dni] SKARGA DO WSA — składana ZA POŚREDNICTWEM organu II inst.
    → Organ II inst. ma 15 dni na przekazanie skargi i akt do WSA (art. 54 §2 PPSA)
    → Autokontrola WSA: organ może uwzględnić skargę w 30 dniach (art. 54 §3 PPSA)
Wyrok WSA
  ↓ [30 dni od wyroku WSA z uzasad.] SKARGA KASACYJNA NSA — przymus adwokacki/radcowski
```

### Szczególna ścieżka ZUS — UWAGA KRYTYCZNA

```
⚠️ NIE MA WSA W SPRAWACH ZUS/KRUS
Decyzja ZUS/KRUS → odwołanie do SĄDU OKRĘGOWEGO (lub SR przy niższych wartościach)
  Wydział pracy i ubezpieczeń społecznych
  Tryb KPC (art. 477⁸–477¹⁴), NIE PPSA
  Termin: 1 miesiąc od doręczenia decyzji (art. 477⁹ §1 KPC)
```

⭐⭐ DZIAŁ III KPA (art. 164-181) — dodano 2026-08-12, na żądanie
użytkownika — ⚠️ ZASKAKUJĄCE ustalenie: WIĘKSZOŚĆ tego działu jest
UCHYLONA

```
⭐⭐⭐ ART. 164-179 — CAŁKOWICIE UCHYLONE — pozostały TYLKO DWA,
  krótkie ARTYKUŁY (180-181)

⭐⭐ ART. 180 — ISTOTA Działu III:
  §1: W sprawach Z zakresu ubezpieczeń SPOŁECZNYCH stosuje SIĘ
    przepisy KODEKSU (KPA), CHYBA że przepisy DOTYCZĄCE ubezpieczeń
    USTALAJĄ odmienne zasady POSTĘPOWANIA w TYCH sprawach — ⭐
    OZNACZA to, że KPA jest TU regulacją SUBSYDIARNĄ (posiłkową) —
    RZECZYWISTE, szczegółowe zasady POSTĘPOWANIA przed ZUS/KRUS
    ŻYJĄ W INNYCH ustawach (GŁÓWNIE ustawa O systemie ubezpieczeń
    społecznych), NIE w SAMYM KPA
  §2: DEFINICJA "spraw Z zakresu ubezpieczeń SPOŁECZNYCH" — sprawy
    WYNIKAJĄCE z przepisów O ubezpieczeniach SPOŁECZNYCH, o
    zaopatrzeniach EMERYTALNYCH i rentowych, O funduszu
    ALIMENTACYJNYM, a TAKŻE sprawy WYNIKAJĄCE z przepisów O innych
    świadczeniach WYPŁACANYCH z funduszów PRZEZNACZONYCH na
    ubezpieczenia społeczne (⭐ SZEROKA definicja, WYKRACZA poza
    SAM ZUS — obejmuje TEŻ fundusz ALIMENTACYJNY)

⭐ ART. 181: ORGANY odwoławcze WŁAŚCIWE w sprawach Z zakresu
  ubezpieczeń SPOŁECZNYCH OKREŚLAJĄ przepisy ODRĘBNE; do
  postępowania PRZED tymi organami STOSUJE się odpowiednio
  przepis ART. 180 §1

⭐⭐⭐ PRAKTYCZNY WNIOSEK: Dział III KPA SAM w sobie NIE zawiera już
  ROZBUDOWANEGO, odrębnego POSTĘPOWANIA dla ZUS — TO CO faktycznie
  jest ISTOTNE praktycznie (droga ODWOŁANIA do sądu okręgowego,
  TRYB KPC zamiast PPSA) — WYNIKA Z INNYCH ustaw (patrz sekcja
  WYŻEJ, "Szczególna ścieżka ZUS"), NIE Z samego Działu III —
  ISTNIENIE tego Działu W KPA JEST więc GŁÓWNIE historyczno-
  strukturalne, Z REALNĄ treścią OGRANICZONĄ do DWÓCH, krótkich
  przepisów o CHARAKTERZE odsyłającym

Potwierdzone w 7+ zgodnych źródeł, w tym BEZPOŚREDNIO dosłowny
tekst art. 180-181 (arslege.pl [×2], lexlege.pl, przepisy.gofin.pl,
e-prawnik.pl, srokowo-online.pl, prawo.link).
```

### Organy odwoławcze — tabela

| Sprawa | Organ I inst. | Organ odwoławczy |
|---|---|---|
| Pozwolenie na budowę | Starosta / Prezydent | Wojewoda |
| Warunki zabudowy | Wójt / Burmistrz / Prezydent | SKO |
| Podatek od nieruchomości | Wójt / Burmistrz / Prezydent | SKO |
| Zasiłek rodzinny / DPS | GOPS / MOPS | SKO |
| Kara administracyjna | Organ branżowy | Organ wyższy |
| Decyzja środowiskowa | RDOŚ / Wójt | GDOŚ / SKO |
| Decyzja ZUS / KRUS | ZUS / KRUS | Sąd Okręgowy (pracy) |

---

