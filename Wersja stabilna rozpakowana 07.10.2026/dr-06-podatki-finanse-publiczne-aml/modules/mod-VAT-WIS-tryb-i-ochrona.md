# Moduł — VAT: Wiążąca Informacja Stawkowa (WIS) — pełny tryb, moc wiążąca i ochronna, ważność, zmiana i wygaśnięcie (Dział VIII rozdz. 1a, art. 42a–42i)

> **Akt:** ustawa z 11.03.2004 o podatku od towarów i usług — **t.j. Dz.U. 2025 poz. 775**.
>
> ⛔ **HARD GATE — `shared/PRAWO-HARDGATE.md`.** Opłaty, terminy i zakres
> ochrony były wielokrotnie nowelizowane (m.in. SLIM VAT 3) — zweryfikuj
> w ISAP i na `podatki.gov.pl` przed doradzaniem klientowi.
>
> ⚠️ **PRZYPOMNIENIE GLOBALNE RODZINY mod-VAT-*:** termin podstawowy zwrotu
> różnicy podatku wynosi **40 dni** (art. 87 ust. 2 zd. 1), **NIE 60**.

**Utworzony 2026-08-12** (audyt pokrycia VAT, iteracja VII).

> ⭐⭐⭐ **DLACZEGO TEN MODUŁ MA PRIORYTET MIMO POZORNIE WĄSKIEGO TEMATU:**
> `mod-VAT-podatek-od-towarow-i-uslug.md` sekcja 3 zawiera **BAZĘ
> WERYFIKACJI STAWEK** opartą na czterech poziomach (A: ISAP/załączniki,
> B: ISZTAR4/PKWiU, C: EUREKA, D: **WIS**). Poziom D był dotąd opisany
> jednym akapitem („czym jest WIS") — czyli baza weryfikacji stawek
> kończyła się na najważniejszym narzędziu bez instrukcji jego użycia.
> Ten moduł domyka POZIOM D.

---

## 11a. ⭐⭐⭐ CZYM JEST WIS — I CZYM NIE JEST

```
⭐⭐ art. 42a — WIS to **DECYZJA ADMINISTRACYJNA** wydawana przez
  Dyrektora Krajowej Informacji Skarbowej na potrzeby opodatkowania
  VAT: dostawy towarów, IMPORTU towarów, WNT albo świadczenia usług.
  ZAWIERA:
  1) opis towaru albo usługi będących przedmiotem WIS,
  2) KLASYFIKACJĘ — towaru wg **CN** (dział/pozycja/podpozycja/kod)
     albo wg **PKOB** (obiekty budowlane), albo usługi wg **PKWiU**
     (dział/grupa/klasa/kategoria/podkategoria/pozycja) — niezbędną do:
     a) określenia stawki właściwej dla towaru albo usługi,
     b) stosowania przepisów ustawy i przepisów wykonawczych —
        w przypadku, o którym mowa w art. 42b ust. 4,
  3) STAWKĘ podatku właściwą dla towaru albo usługi.

⭐⭐⭐ DWA CELE WNIOSKU — ROZRÓŻNIENIE KLUCZOWE:
  1) określenie STAWKI VAT, albo
  2) sama KLASYFIKACJA towaru/usługi na potrzeby stosowania innych
     przepisów ustawy i przepisów wykonawczych **niż dotyczące stawki**
     (art. 42b ust. 4) — ⭐ to jest ścieżka używana m.in. przy MPP
     (zał. 15), zwolnieniach, GTU. Wniosek trzeba SFORMUŁOWAĆ pod
     właściwy cel — źle określony cel = decyzja nie o to, o co chodziło.

⛔ CZYM WIS NIE JEST: nie jest interpretacją indywidualną (art. 14b
  Ordynacji). To ODRĘBNA instytucja — inny organ formalnie
  (Dyrektor KIS w obu przypadkach, ale inny tryb), inny przedmiot,
  inny zakres ochrony, inny okres ważności.
  ⭐ Do WIS stosuje się ODPOWIEDNIO przepisy Ordynacji podatkowej;
  wydanie poprzedza postępowanie podatkowe.
  ⛔ WIS ≠ WIA (akcyza) ≠ WIT (taryfa celna) ≠ WIP (pochodzenie) —
  cztery odrębne instytucje, cztery odrębne tryby.
```

---

## 11b. ⭐⭐ KTO MOŻE ZŁOŻYĆ WNIOSEK (art. 42b)

```
⭐ KRĄG WNIOSKODAWCÓW jest SZERSZY niż sam podatnik — obejmuje m.in.:
  □ podatnika posiadającego NIP,
  □ podmiot dokonujący lub zamierzającego dokonywać czynności
    objętych WIS,
  □ ZAMAWIAJĄCEGO w rozumieniu Prawa zamówień publicznych — w zakresie
    mającym wpływ na SPOSÓB OBLICZENIA CENY w związku z udzielanym
    zamówieniem publicznym,
    ⭐⭐ TO JEST WAŻNE DLA DR-07: zamawiający może sam wystąpić o WIS,
    zamiast polegać na klasyfikacji wykonawcy → `dr-07-zamowienia-
    publiczne-fundusze-ue`
  □ PODMIOT PUBLICZNY w rozumieniu ustawy o partnerstwie publiczno-
    -prywatnym — w zakresie wpływu na sposób obliczenia wynagrodzenia,
  □ zamawiającego w rozumieniu ustawy o umowie koncesji.
  ⛔ Zweryfikuj PEŁNY, aktualny katalog art. 42b ust. 1 w ISAP.

⭐ FORMA: wniosek składany **WYŁĄCZNIE ELEKTRONICZNIE**.
⭐ ELEMENTY: szczegółowy opis towaru/usługi, wskazanie celu wniosku,
  proponowana klasyfikacja (opcjonalnie), oświadczenia.
⭐ MOŻLIWOŚĆ ŻĄDANIA PRÓBEK/DOKUMENTÓW: organ może wezwać do
  dostarczenia próbki towaru; koszty badań/analiz obciążają
  wnioskodawcę — ⛔ to jest realny, czasem znaczący koszt, którego
  klient się nie spodziewa. Zweryfikuj aktualne zasady w art. 42b
  ust. 7 i n. oraz art. 42e.
⛔ OPŁATA: reżim opłat od wniosku o WIS był nowelizowany (SLIM VAT 3
  m.in. w zakresie opłaty podstawowej). ⛔ NIE podawaj kwoty z pamięci
  ani z tego modułu — sprawdź aktualny stan na podatki.gov.pl
  i w art. 42d/42e ISAP.
```

---

## 11c. ⭐⭐⭐ MOC WIĄŻĄCA I OCHRONA (art. 42c) — SEDNO INSTYTUCJI

```
⭐⭐⭐ ZWIĄZANIE ORGANÓW: WIS wiąże organy podatkowe wobec podatnika,
  dla którego została wydana, w odniesieniu do towaru albo usługi
  będących jej przedmiotem.
  ⭐ Z ochrony mogą korzystać RÓWNIEŻ INNI podatnicy — na zasadach
  określonych w ustawie (⛔ zweryfikuj dokładny zakres art. 42c ust. 2
  i n.: dotyczy to WIS opublikowanych w BIP/EUREKA i sytuacji
  tożsamości towaru lub usługi).

⭐⭐ ZAKRES OCHRONY W PRAKTYCE — co realnie chroni:
  □ przed określeniem zaległości wynikającej z zastosowania stawki
    wskazanej w WIS,
  □ przed ODSETKAMI za zwłokę od tej kwoty,
  □ przed **DODATKOWYM ZOBOWIĄZANIEM PODATKOWYM** z art. 112b–112c
    → `mod-VAT-sankcje-bony-odliczenia.md`, sekcja 4e,
  □ przed odpowiedzialnością karnoskarbową w tym zakresie.
  ⛔ WARUNEK KONIECZNY: podatnik MUSI faktycznie ZASTOSOWAĆ stawkę/
  klasyfikację wskazaną w WIS. Posiadanie WIS „w szufladzie" przy
  stosowaniu innej stawki NIE CHRONI.
  ⛔ Ochrona jest ograniczona do towaru/usługi TOŻSAMEGO z opisanym
  w WIS. Zmiana składu, receptury, sposobu wykonania usługi może
  wyprowadzić stan faktyczny poza zakres decyzji — ⭐ to najczęstsza
  przyczyna „WIS, która nie zadziałała".
```

---

## 11d. ⭐⭐⭐ WAŻNOŚĆ, ZMIANA, UCHYLENIE, WYGAŚNIĘCIE

```
⭐⭐ OKRES WAŻNOŚCI (art. 42ha ust. 1): **5 LAT**, licząc od dnia
  NASTĘPUJĄCEGO po dniu doręczenia WIS.
  ⭐ 5-letni okres dotyczy TAKŻE decyzji zmieniających WIS wydanych
  na podstawie art. 42h ust. 2 albo 3 (liczony od ich wydania).

⛔ UTRATA WAŻNOŚCI PRZED UPŁYWEM 5 LAT — z dniem następującym po dniu
  doręczenia:
  □ decyzji o ZMIANIE WIS, albo
  □ decyzji o UCHYLENIU WIS.
  ⛔ Zweryfikuj pełny katalog art. 42ha ust. 2 w ISAP.

⛔⛔ WYGAŚNIĘCIE Z MOCY PRAWA (art. 42h ust. 1) — MECHANIZM NAJBARDZIEJ
  RYZYKOWNY DLA PODATNIKA:
  WIS wygasa z mocy prawa w przypadku ZMIANY PRZEPISÓW prawa
  podatkowego w zakresie podatku odnoszących się do towaru albo usługi
  będących jej przedmiotem, w wyniku której WIS staje się NIEZGODNA
  z tymi przepisami. Wygaśnięcie następuje **Z DNIEM WEJŚCIA W ŻYCIE**
  przepisów, z którymi WIS stała się niezgodna.
  ⛔⛔ NIE MA ZAWIADOMIENIA. Podatnik może przez wiele miesięcy stosować
  wygasłą WIS w dobrej wierze — i nie być chroniony.
  ⭐⭐ SKUTEK OPERACYJNY DLA SYSTEMU: **każda WIS w aktach klienta wymaga
  ponownego sprawdzenia po każdej zmianie stawek/załączników** — w tym
  po zmianach rozporządzenia MF z 9.12.2023 (Dz.U. 2023 poz. 2670
  ze zm.) i po zmianach przepisów epizodycznych (art. 146ea, 146ef,
  146ej, 146x). To jest bezpośrednie sprzężenie z sekcją 3
  `mod-VAT-podatek-od-towarow-i-uslug.md` — KROK weryfikacji stawki
  musi obejmować pytanie „czy WIS nie wygasła".
  ⭐ RATIO wg MF: 5-letni okres ważności ma zmniejszać ryzyko
  długotrwałego posługiwania się WIS, która wygasła niezauważenie,
  i pozwala wystąpić ponownie z uwzględnieniem aktualnego stanu prawnego.

⭐ ZMIANA/UCHYLENIE (art. 42h ust. 2–3): Dyrektor KIS albo Szef KAS
  może zmienić albo uchylić WIS m.in. w razie stwierdzenia jej
  nieprawidłowości spowodowanej BŁĘDNĄ WYKŁADNIĄ przepisów lub
  NIEWŁAŚCIWĄ OCENĄ co do zastosowania przepisu prawa materialnego,
  a także w trybie odwoławczym.
  ⛔ Zweryfikuj, KTÓRY organ jest właściwy w danym trybie — to bywa
  zmieniane.

⭐ ŚRODKI ZASKARŻENIA: WIS jest decyzją → odwołanie w trybie Ordynacji
  (14 dni), następnie skarga do WSA → `dr-05` / `mod-OP-ordynacja-podatkowa`.
⭐ art. 42i — PUBLIKACJA WIS (bez danych identyfikujących) w BIP
  → operacyjnie: baza **EUREKA** (`podatki.gov.pl/narzedzia/eureka/`),
  opisana w `mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci.md`,
  sekcja 3a. ⭐ Cudza WIS jest wskazówką interpretacyjną, ale nie chroni
  automatycznie — sprawdź warunki ochrony „innych podatników" z art. 42c.
```

---

## 12. STRATEGIA / QUALITY GATE

```
□ Cel wniosku określony poprawnie: STAWKA czy sama KLASYFIKACJA
  (art. 42b ust. 4)?
□ Czy klient należy do kręgu z art. 42b ust. 1 (⭐ sprawdź ścieżkę
  ZAMAWIAJĄCEGO przy zamówieniach publicznych)?
□ Opis towaru/usługi we wniosku pokrywa RZECZYWISTY, aktualny produkt?
  (zmiana receptury/składu = ryzyko wyjścia poza zakres ochrony)
□ Czy uprzedzono klienta o możliwych kosztach badań/analiz próbki?
□ Opłata i terminy sprawdzone NA DZIŚ w ISAP/podatki.gov.pl,
  nie podane z modułu?
□ ⭐⭐ POSIADANA WIS: czy nie WYGASŁA z mocy prawa (art. 42h ust. 1)
  wskutek zmiany przepisów o stawkach? Sprawdzono datę doręczenia
  + 5 lat ORAZ wszystkie zmiany stawek w międzyczasie?
□ Czy podatnik FAKTYCZNIE stosuje stawkę z WIS (warunek ochrony)?
□ Przy powoływaniu cudzej WIS z EUREKA — sprawdzono warunki ochrony
  innych podatników z art. 42c, a nie założono jej automatycznie?
□ Czy sprawa nie wymaga zamiast tego WIA/WIT/WIP?
```

---

## Połącz z
- DR-06/`mod-VAT-podatek-od-towarow-i-uslug` (⭐ sekcja 3 — BAZA WERYFIKACJI
  STAWEK; ten moduł domyka POZIOM D tej bazy)
- DR-06/`mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci` (sekcja 3a —
  publiczna baza WIS/EUREKA; przypadki niejednoznacznej klasyfikacji)
- DR-06/`mod-PKWiU-klasyfikacje-statystyczne` (CN, PKWiU, PKOB — klasyfikacje,
  do których WIS się odwołuje)
- DR-06/`mod-VAT-sankcje-bony-odliczenia` (art. 112b–112c — sankcja, przed
  którą WIS chroni)
- DR-06/`mod-interpretacje-definicje-podatkowe` (interpretacja indywidualna —
  ODRĘBNA instytucja, nie mylić)
- DR-06/`mod-ustawa-akcyzowa-i-clo-UCC` (WIA) i `mod-UCC-clo-taryfa-celna` (WIT)
- DR-07/zamówienia publiczne (⭐ zamawiający jako wnioskodawca WIS)
- DR-06/`mod-OP-ordynacja-podatkowa` (odwołanie od decyzji WIS)

---

## ŹRÓDŁA WERYFIKACJI (zweryfikowane online 2026-08-12)

```
RZĄD 1 — isap.sejm.gov.pl: t.j. Dz.U. 2025 poz. 775 (Dział VIII rozdz. 1a,
  art. 42a-42i)
RZĄD 1/2 — podatki.gov.pl (serwis MF, „Najważniejsze informacje o wniosku"):
  5-letni okres ważności, forma elektroniczna wniosku
RZĄD 1/2 — gov.pl/web/finanse: zakres ochrony, korzystanie przez innych
  podatników
RZĄD 2 — przepisy.gofin.pl: brzmienie art. 42a i katalog art. 42b
RZĄD 2 — pit.pl: mechanizm wygaśnięcia z art. 42h ust. 1 i uzasadnienie MF
  dla okresu 5 lat
RZĄD 2 — przykład aktualnej WIS z 2026 r. (0111-KDSB1-1.440.96.2026.1.JJ,
  powołanie art. 42ha ust. 1 i art. 42h ust. 1) — ⛔ przykład ILUSTRACYJNY,
  nie powoływać jako podstawy w piśmie bez weryfikacji w EUREKA
```
