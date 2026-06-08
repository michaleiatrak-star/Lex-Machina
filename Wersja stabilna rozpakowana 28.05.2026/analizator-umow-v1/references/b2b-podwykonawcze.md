# MODUŁ G — UMOWY B2B I PODWYKONAWCZE
## Analizator Umów v2 · Moduł Ekspercki

> **Wczytaj ten moduł gdy:** umowa B2B (kontrakt menedżerski, ramowa współpracy,
> umowa o świadczenie usług między przedsiębiorcami), umowa podwykonawcza
> (budowlana, IT, produkcyjna), lub gdy wykrywasz ryzyko kwalifikacji pracowniczej.

---

## G.1 KWALIFIKACJA: B2B vs STOSUNEK PRACY

### Test kwalifikacji — wykonaj ZAWSZE dla każdej umowy B2B

Weryfikuj w isap.sejm.gov.pl: art. 22 §1 i §1¹ KP (tekst jednolity).

```
CECHY STOSUNKU PRACY (art. 22 §1 KP):
Jeśli spełnione ≥ 3 z poniższych → prawdopodobny stosunek pracy:

□ [A] Osobiste wykonanie — praca musi być świadczona osobiście,
      brak możliwości delegowania na zastępcę bez zgody zlecającego
□ [B] Podporządkowanie — zlecający określa godziny, miejsce, sposób pracy
□ [C] Ciągłość — regularne, powtarzalne zlecenia, nie projekt jednorazowy
□ [D] Ryzyko po stronie zlecającego — wykonawca nie ponosi ryzyka ekonomicznego
□ [E] Narzędzia po stronie zlecającego — komputer, biuro, telefon należą do zlecającego
□ [F] Wyłączność — zakaz świadczenia usług innym podmiotom (bez wyjątków)
□ [G] Stała kwota — wynagrodzenie stałe miesięcznie, niezależne od rezultatu
□ [H] Polecenia służbowe — wykonawca zobowiązany do wykonywania bieżących poleceń

WYNIK TESTU:
  0–2 cechy → typowe B2B, niskie ryzyko
  3–4 cechy → strefa szara — OSTRZEŻENIE; zidentyfikuj i rekomenduj korektę
  5–8 cech  → pseudosamozatrudnienie; ALERT KRYTYCZNY:
              → ryzyko: PIP/ZUS może zakwalifikować jako UoP
              → skutki: zaległe składki ZUS (3 lata wstecz) + odsetki + sankcje
              → podstawa: art. 22 §1¹ KP + art. 8 ust. 2a ustawy o SUS
```

**Weryfikacja online obowiązkowa:**
```
1. isap.sejm.gov.pl → Kodeks pracy → art. 22
2. isap.sejm.gov.pl → ustawa z 13.10.1998 o systemie ubezpieczeń społecznych → art. 8 ust. 2a
3. web_search "pseudosamozatrudnienie PIP kontrola [rok bieżący]"
```

---

## G.2 PUŁAPKI W UMOWACH B2B — KATALOG EKSPERCKI

### PUŁAPKA 1 — Zakaz konkurencji bez limitów (HIGH RISK)
```
PROBLEM: Klauzula "Wykonawca nie może świadczyć usług podmiotom
         konkurencyjnym przez okres 2 lat po zakończeniu współpracy"
         → w B2B: klauzula wiąże (brak ochrony jak w KP art. 101²)
         → BRAK obowiązku odszkodowania (w przeciwieństwie do UoP!)
         → może faktycznie uniemożliwić działalność zawodową

WERYFIKUJ: isap.sejm.gov.pl → KC art. 3531 (swoboda umów) + art. 5 KC (nadużycie)
           orzeczenia.ms.gov.pl → zakaz konkurencji B2B rażące wygórowanie

REKOMENDACJA DLA WYKONAWCY:
  „§X ust. Y. Zakaz konkurencji wiąże Wykonawcę przez okres nie dłuższy niż
  [6/12] miesięcy od zakończenia Umowy, wyłącznie w odniesieniu do podmiotów,
  z którymi Zamawiający prowadził aktywną współpracę w ostatnich 12 miesiącach.
  Za każdy miesiąc obowiązywania zakazu Zamawiający wypłaci Wykonawcy
  odszkodowanie w wysokości [X]% średniego miesięcznego wynagrodzenia netto
  z ostatnich 3 miesięcy współpracy."

PUŁAPKA: brak wypłaty odszkodowania przy B2B → mimo to zakaz może wiązać (KC)
```

### PUŁAPKA 2 — Prawa autorskie "na wszelki wypadek" (HIGH RISK)
```
PROBLEM: "Wykonawca przenosi na Zamawiającego wszelkie majątkowe prawa autorskie
          do wszystkich utworów stworzonych w trakcie realizacji Umowy"
          → klauzula zbyt szeroka → może obejmować narzędzia, frameworki, open-source
          → brak określenia pól eksploatacji → art. 41 ust. 2 PrAut: bez wskazania pól → nieważna!
          → brak wynagrodzenia za przeniesienie → art. 43 PrAut: jeśli umowa o przeniesienie nie
            określa wynagrodzenia, twórcy należy się "wynagrodzenie odpowiednie"

WERYFIKUJ: isap.sejm.gov.pl → ustawa z 4.02.1994 o prawie autorskim → art. 41, 43, 45, 65

REKOMENDACJA:
  „§X ust. Y. Wykonawca przenosi na Zamawiającego autorskie prawa majątkowe
  wyłącznie do Rezultatów, zdefiniowanych w §1 pkt [X], na następujących polach
  eksploatacji: [lista: utrwalenie, zwielokrotnienie, publiczne udostępnienie, etc.].
  Przeniesienie nie obejmuje narzędzi, bibliotek i frameworków preistniejących
  przed zawarciem Umowy, w tym oprogramowania open-source. Wynagrodzenie za
  przeniesienie praw zawarte jest w wynagrodzeniu określonym w §[Y]."

PUŁAPKA: przeniesienie praw do "przyszłych utworów" nieznanych w chwili zawarcia umowy
→ art. 41 ust. 3 PrAut → nieważne w zakresie przekraczającym specyfikację
```

### PUŁAPKA 3 — Termin płatności >60 dni (MEDIUM/HIGH RISK)
```
PROBLEM: Termin płatności powyżej 60 dni w transakcjach handlowych
         → naruszenie ustawy z 8.03.2013 o przeciwdziałaniu nadmiernym opóźnieniom
           w transakcjach handlowych (weryfikuj: isap.sejm.gov.pl, t.j. Dz.U. 2023 poz. 1790)
         → TWARDSZY LIMIT 60 dni (bez wyjątku) gdy dłużnikiem jest DUŻE PRZEDSIĘBIORSTWO,
           a wierzycielem jest MŚP (art. 7 ust. 2a ustawy)
         → Strony B2B symetryczne mogą umówić >60 dni jeśli nie jest rażąco nieuczciwe

WERYFIKUJ:
  isap.sejm.gov.pl → ustawa 2013 przeciwdziałanie nadmiernym opóźnieniom → art. 7, 8, 10
  Sprawdź aktualny próg odsetek ustawowych za opóźnienie w transakcjach handlowych
  (M.P. 2025 poz. 602 — od 1.07.2025; wcześniej M.P. 2024 poz. 1106)

AUTOMATYCZNE UPRAWNIENIA WIERZYCIELA (bez klauzuli w umowie!):
  → Odsetki ustawowe za opóźnienie w transakcjach handlowych (wyższe niż zwykłe)
  → Rekompensata za koszty odzyskiwania należności (art. 10 ustawy) bez wezwania:
      • 40 EUR gdy wartość wierzytelności ≤ 5 000 zł
      • 70 EUR gdy wartość wierzytelności > 5 000 zł i < 50 000 zł
      • 100 EUR gdy wartość wierzytelności ≥ 50 000 zł
    (przeliczenie wg kursu NBP z ostatniego dnia roboczego miesiąca poprzedzającego wymagalność)
  → Prawo do rozwiązania lub zmiany postanowień umowy rażąco niesprawiedliwych

REKOMENDACJA:
  „§X Wynagrodzenie płatne będzie w terminie [14/30] dni od daty doręczenia
  faktury VAT, na rachunek bankowy Wykonawcy nr [IBAN].
  Za opóźnienie w płatności przysługują odsetki ustawowe za opóźnienie
  w transakcjach handlowych oraz rekompensata, o której mowa w ustawie
  z dnia 8 marca 2013 r. o przeciwdziałaniu nadmiernym opóźnieniom
  w transakcjach handlowych."
```

### PUŁAPKA 4 — Odpowiedzialność nieograniczona wykonawcy (CRITICAL)
```
PROBLEM: "Wykonawca ponosi pełną odpowiedzialność za wszelkie szkody"
         → w B2B brak limitu KP (art. 119 KP) → odpowiedzialność pełna włącznie z utraconym zykiem
         → możliwa odpowiedzialność wielokrotnie przekraczająca wynagrodzenie

REKOMENDACJA DLA WYKONAWCY:
  „§X ust. Y. Łączna odpowiedzialność odszkodowawcza Wykonawcy z tytułu
  niewykonania lub nienależytego wykonania Umowy, niezależnie od podstawy
  prawnej roszczenia, ograniczona jest do [3-krotności / wartości] wynagrodzenia
  netto Wykonawcy z ostatnich [3/12] miesięcy realizacji Umowy, chyba że szkoda
  wynikła z winy umyślnej lub rażącego niedbalstwa Wykonawcy."

PUŁAPKA: Wyłączenie odpowiedzialności za winę umyślną → art. 473 §2 KC → bezskuteczne
```

### PUŁAPKA 5 — Kara umowna od wynagrodzenia (CRITICAL)
```
PROBLEM: "Kara umowna w wysokości 50% wartości umowy za każde naruszenie"
         → kara umowna może przekroczyć wynagrodzenie → de facto praca za darmo lub dopłata
         → kara umowna za zwłokę bez limitu → może narastać bez górnego pułapu

WERYFIKUJ: isap.sejm.gov.pl → KC → art. 483, 484 (miarkowanie)

REKOMENDACJA:
  „§X. Kary umowne nie mogą przekroczyć łącznie [20/30]% wynagrodzenia
  należnego Wykonawcy z tytułu realizacji Umowy. Kara za każdy dzień opóźnienia
  wynosi [0,1/0,5]% wynagrodzenia, nie więcej niż [X]% łącznie."
```

### PUŁAPKA 6 — Cesja wierzytelności wyłączona (MEDIUM RISK)
```
PROBLEM: "Wykonawca nie może przelewać wierzytelności wynikających z Umowy
          na osoby trzecie"
          → ogranicza faktoring i finansowanie wierzytelności
          → art. 509 §1 KC: cesja domyślnie dozwolona bez zgody dłużnika
          → blokada faktoringu = realne utrudnienie cash flow

UWAGA SZCZEGÓLNA: Weryfikuj czy Zamawiający jest dużym przedsiębiorcą —
  ustawa o przeciwdziałaniu nadmiernym opóźnieniom zakazuje takich klauzul
  w relacji: MŚP (wierzyciel) vs duże przedsiębiorstwo (dłużnik)

REKOMENDACJA:
  „§X. Cesja wierzytelności wymagać będzie uprzedniej pisemnej zgody Zamawiającego,
  która nie może być bezzasadnie odmówiona. Ograniczenie to nie dotyczy umów
  faktoringu zawieranych przez Wykonawcę z instytucją finansową."
```

### PUŁAPKA 7 — Poufność bez wyjątków i bez limitu (MEDIUM RISK)
```
PROBLEM: Klauzula poufności obejmująca "wszelkie informacje" bez wyjątków i bezterminowa:
  → uniemożliwia wykorzystanie doświadczenia zawodowego (portfolio, referencje)
  → nie wyłącza informacji publicznych, już znanych, ujawnionych przez prawo
  → może uniemożliwiać realizację obowiązków prawnych (np. kontrola skarbowa)

REKOMENDACJA:
  „§X. Obowiązek poufności nie dotyczy:
  a) informacji powszechnie znanych lub dostępnych publicznie;
  b) informacji, które Strona znała przed zawarciem Umowy;
  c) informacji ujawnionych Stronie przez osoby trzecie bez naruszenia zobowiązań;
  d) informacji, których ujawnienie wymagane jest przez przepisy prawa lub nakaz
     właściwego organu — wyłącznie w niezbędnym zakresie.
  Okres obowiązywania poufności wynosi [2/3] lata od zakończenia Umowy."
```

### PUŁAPKA 8 — Automatyczne przedłużenie bez limitu (MEDIUM RISK)
```
PROBLEM: "Umowa ulega automatycznemu przedłużeniu na kolejny okres, jeżeli żadna
          ze Stron nie złoży wypowiedzenia na [X] dni przed upływem okresu"
          → długi termin wypowiedzenia + automatyczne odnowienie = pułapka
          → szczególnie ryzykowne gdy termin wypowiedzenia = 90+ dni

REKOMENDACJA:
  „§X. Automatyczne przedłużenie może nastąpić nie więcej niż [2/3]-krotnie.
  Termin na złożenie wypowiedzenia wynosi [30] dni przed upływem okresu umowy.
  Zamawiający zobowiązuje się do przesłania Wykonawcy przypomnienia
  na [X] dni przed upływem terminu wypowiedzenia."
```

### PUŁAPKA 9 — Rozwiązanie umowy bez okresu wypowiedzenia "za naruszenie" (HIGH RISK)
```
PROBLEM: "Zamawiający może rozwiązać Umowę ze skutkiem natychmiastowym
          w przypadku jakiegokolwiek naruszenia jej postanowień przez Wykonawcę"
          → "jakiekolwiek naruszenie" = nawet formalne, nieistotne
          → Wykonawca traci wynagrodzenie za bieżący okres + może ponieść kary

WERYFIKUJ: isap.sejm.gov.pl → KC → art. 746 (umowa zlecenia) lub art. 644 (dzieło)
           Czy klauzula nie wyłącza prawa do wynagrodzenia za częściowe wykonanie?

REKOMENDACJA:
  „§X. Zamawiający może rozwiązać Umowę ze skutkiem natychmiastowym wyłącznie
  w przypadku istotnego naruszenia jej postanowień przez Wykonawcę, przy czym:
  a) Zamawiający uprzednio wezwał Wykonawcę na piśmie do usunięcia naruszenia;
  b) Wykonawca nie usunął naruszenia w terminie [14] dni od wezwania.
  Wykonawcy przysługuje wynagrodzenie za prace wykonane do dnia rozwiązania Umowy."
```

### PUŁAPKA 10 — Zakaz podwykonawstwa bez zgody (MEDIUM/HIGH RISK)
```
PROBLEM: "Wykonawca nie może powierzać realizacji Umowy podwykonawcom
          bez uprzedniej pisemnej zgody Zamawiającego"
          → w IT/kreatywnych: uniemożliwia skalowanie działalności
          → w budownictwie: specjalne przepisy o odpowiedzialności solidarnej

WERYFIKUJ (umowy budowlane):
  isap.sejm.gov.pl → KC → art. 647¹ (solidarna odpowiedzialność inwestora za podwykonawców)
  Sprawdź aktualny próg kwotowy i wymogi zgłoszenia podwykonawcy

REKOMENDACJA:
  „§X. Wykonawca może angażować podwykonawców bez zgody Zamawiającego,
  pod warunkiem że: (a) Wykonawca pozostaje odpowiedzialny za ich działania,
  (b) podwykonawcy są zobowiązani do zachowania poufności zgodnie z §[Y],
  (c) Wykonawca poinformuje Zamawiającego o tożsamości podwykonawcy na żądanie."
```

---

## G.3 UMOWY PODWYKONAWCZE BUDOWLANE — SPECJALNA SEKCJA

### Weryfikacja obligatoryjna: art. 647¹ KC (odpowiedzialność solidarna)

```
PROCEDURA:
1. web_search "art. 647¹ KC 2024 2025 podwykonawcy solidarna odpowiedzialność"
2. isap.sejm.gov.pl → KC art. 647¹ — sprawdź aktualne brzmienie
3. Ustal: czy inwestor wyraził zgodę na podwykonawcę? (pisemnie / milcząco?)
4. Ustal: czy umowa podwykonawcza zawiera wynagrodzenie i zakres?

SKUTEK art. 647¹ KC:
  Inwestor odpowiada solidarnie z generalnym wykonawcą za zapłatę wynagrodzenia
  podwykonawcy — niezależnie od rozliczeń między inwestorem a GW.

PUŁAPKI SPECYFICZNE DLA BUDOWNICTWA:
```

**Pułapka B-1 — Brak pisemnego zgłoszenia podwykonawcy:**
```
MECHANIZM (art. 647¹ KC — aktualne brzmienie po nowelizacji 2017):
  → Odpowiedzialność solidarna inwestora powstaje gdy:
    (a) podwykonawca zgłoszony inwestorowi pisemnie PRZED przystąpieniem do robót,
        inwestor nie złożył sprzeciwu w ciągu 30 dni (lub krócej gdy umowa skraca),
    LUB
    (b) umowa GW z Inwestorem określa szczegółowy przedmiot robót podwykonawcy
        (art. 647¹ §2 KC)
  → Sprzeciw inwestora: forma pisemna pod rygorem nieważności (art. 647¹ §4 KC)
  → Inwestor odpowiada tylko do wysokości wynagrodzenia GW (art. 647¹ §3 KC)
  → Formularz sprzeciwu i zgłoszenia: wyłącznie forma pisemna!
→ ZAWSZE wymagaj pisemnego zgłoszenia podwykonawcy inwestorowi przed rozpoczęciem robót
→ Dokumentuj brak sprzeciwu (brak odpowiedzi w 30 dniach = odpowiedzialność inwestora)
→ Weryfikuj: isap.sejm.gov.pl → KC art. 647¹ (t.j. Dz.U. 2025 poz. 1071)
```

**Pułapka B-2 — Wynagrodzenie podwykonawcy > wynagrodzenie GW:**
```
→ Inwestor odpowiada do wysokości wynagrodzenia GW (nie więcej)
→ Jeśli PW wynegocjował niższe wynagrodzenie niż PdW → ryzyko niedoboru
→ Weryfikuj: harmonogram płatności GW vs harmonogram płatności PW
```

**Pułapka B-3 — Kaskada kar umownych (CRITICAL):**
```
SCHEMAT: Inwestor → GW → Podwykonawca → Pod-podwykonawca
  Kara umowna Inwestora → GW (100%)
  GW przenosi karę → Podwykonawca (często 100% lub więcej!)
  EFEKT: Podwykonawca odpowiada za opóźnienia na całej budowie

REKOMENDACJA DLA PODWYKONAWCY:
  „§X. Kary umowne nałożone przez Inwestora lub Generalnego Wykonawcę
  mogą być przenoszone na Podwykonawcę wyłącznie w zakresie, w jakim
  opóźnienie lub wada wynika bezpośrednio z działania lub zaniechania
  Podwykonawcy. Podstawą naliczenia kary jest protokół wskazujący
  przyczynę i zakres naruszenia podpisany przez obie Strony."
```

**Pułapka B-4 — Retencja / kaucja gwarancyjna:**
```
PROBLEM: "Zamawiający potrąci 5% każdej faktury tytułem kaucji gwarancyjnej
          zwracanej po upływie okresu rękojmi"
          → Kaucja zablokowana przez 2-5 lat
          → Brak odsetek od kaucji = realna strata finansowa
          → Ryzyko upadłości GW i utraty kaucji

REKOMENDACJA:
  „§X. Kaucja gwarancyjna może zostać zastąpiona gwarancją bankową lub
  gwarancją ubezpieczeniową na żądanie Wykonawcy. Kaucja przechowywana
  jest na odrębnym rachunku escrow i oprocentowana. Zwrot kaucji nastąpi
  w terminie 30 dni po upływie okresu rękojmi i gwarancji."
```

**Pułapka B-5 — Rozszerzony zakres rękojmi:**
```
PROBLEM: Umowa wydłuża rękojmię do 5-10 lat dla robót budowlanych
WERYFIKUJ: isap.sejm.gov.pl → KC art. 568 (rękojmia nieruchomości = 5 lat)
           Strony mogą skrócić lub wydłużyć ten termin w B2B (art. 558 §1 KC)

ALERT: Rękojmia B2B może być ograniczona lub wyłączona — sprawdź klauzulę
```

---

## G.4 UMOWY PODWYKONAWCZE IT — SEKCJA SPECJALNA

### Specyficzne pułapki w branży IT:

**Pułapka IT-1 — "Time & Material" bez górnego pułapu:**
```
PROBLEM: Wynagrodzenie T&M bez cap = brak budżetu po stronie zamawiającego
         Zamawiający może twierdzić, że zakres był szerszy niż planowano
REKOMENDACJA:
  „§X. Szacunkowy budżet wynosi [kwota] netto (cap). Przekroczenie cap wymaga
  pisemnej zgody Zamawiającego przed poniesieniem dodatkowych kosztów. Brak
  zgody oznacza, że Wykonawca realizuje dalsze prace na własne ryzyko."
```

**Pułapka IT-2 — Acceptance criteria niedefiniowane:**
```
PROBLEM: Brak kryteriów akceptacji = zamawiający może odmawiać odbioru bez powodu
REKOMENDACJA:
  „§X. Odbiór Rezultatu następuje na podstawie Protokołu Odbioru.
  Zamawiający ma [5/10] dni roboczych na zgłoszenie zastrzeżeń na piśmie.
  Brak zgłoszenia w terminie oznacza milczącą akceptację (fikcja odbioru).
  Zastrzeżenia muszą być szczegółowe i możliwe do implementacji."
```

**Pułapka IT-3 — Escrow kodu źródłowego pominięty:**
```
PROBLEM: Zamawiający płaci za SaaS/oprogramowanie, nie ma dostępu do kodu
         → upadłość Wykonawcy = utrata systemu
REKOMENDACJA:
  „§X. Wykonawca zobowiązuje się do złożenia kodu źródłowego Oprogramowania
  wraz z dokumentacją techniczną do depozytu (escrow) u [notariusza / podmiotu
  escrow] na koszt Zamawiającego. Zamawiający uzyskuje dostęp do depozytu
  w przypadku: (a) ogłoszenia upadłości Wykonawcy, (b) likwidacji Wykonawcy,
  (c) istotnego naruszenia Umowy przez Wykonawcę nienaprawionego w terminie."
```

**Pułapka IT-4 — Licencja vs przeniesienie praw:**
```
LICENCJA ≠ PRZENIESIENIE PRAW AUTORSKICH
  Licencja: Wykonawca zachowuje prawa, Zamawiający może używać
  Przeniesienie: Zamawiający staje się właścicielem praw

Sprawdź: co chce zamawiający i co gwarantuje umowa
Weryfikuj: isap.sejm.gov.pl → ustawa o prawie autorskim → art. 41 ust. 1

PUŁAPKA: "Licencja wyłączna" ≠ przeniesienie praw — Wykonawca wciąż jest autorem
PUŁAPKA: "Przeniesienie" musi wskazywać pola eksploatacji → art. 41 ust. 2
```

---

## G.5 CHECKLISTA ANALIZY UMOWY B2B/PODWYKONAWCZEJ

```
IDENTYFIKACJA:
□ Typ: B2B / podwykonawcza budowlana / podwykonawcza IT / ramowa / inna
□ Test pseudosamozatrudnienia (G.1) — ile cech stosunku pracy?
□ Prawo właściwe — polskie? Inna jurysdykcja?

KLUCZOWE KLAUZULE DO WERYFIKACJI:
□ Zakaz konkurencji (Pułapka 1) — zakres, czas, odszkodowanie
□ Prawa autorskie / IP (Pułapka 2) — pola eksploatacji, wyłączenia, wynagrodzenie
□ Termin płatności (Pułapka 3) — max 60 lub 30 dni; sprawdź ustawę
□ Limit odpowiedzialności (Pułapka 4) — czy jest? Czy uwzględnia winę umyślną?
□ Kary umowne (Pułapka 5) — symetria, cap, proporcjonalność
□ Cesja wierzytelności (Pułapka 6) — blokada faktoringu?
□ Poufność (Pułapka 7) — wyjątki, termin, zakres
□ Automatyczne przedłużenie (Pułapka 8) — termin wypowiedzenia, max odnowień
□ Rozwiązanie natychmiastowe (Pułapka 9) — "jakiekolwiek naruszenie" = red flag
□ Podwykonawstwo (Pułapka 10) — zgoda, odpowiedzialność, budownictwo → art. 647¹

DODATKOWE DLA BUDOWLANYCH:
□ Zgłoszenie podwykonawcy do inwestora (B-1)
□ Cap kasy solidarnej (B-2)
□ Kaskada kar umownych (B-3)
□ Kaucja gwarancyjna — warunki zwrotu (B-4)
□ Rękojmia — termin i zakres (B-5)

DODATKOWE DLA IT:
□ T&M cap (IT-1)
□ Acceptance criteria (IT-2)
□ Escrow kodu (IT-3)
□ Licencja vs przeniesienie (IT-4)

SCORING:
□ Balans B2B — tabela D.1 (wczytaj Moduł D z SKILL.md)
□ Raport końcowy — sekcja F (wczytaj Moduł F z SKILL.md)
```

---

## G.6 SZABLONY KLAUZUL EKSPERCKICH B2B

### Szablon: Zakaz konkurencji B2B (wersja wyważona)
```
§[X]. ZAKAZ KONKURENCJI
1. W trakcie obowiązywania Umowy Wykonawca zobowiązuje się nie świadczyć usług
   na rzecz podmiotów prowadzących działalność bezpośrednio konkurencyjną
   wobec Zamawiającego, wskazanych w Załączniku nr [X] do Umowy.
2. Po zakończeniu Umowy, przez okres [6] miesięcy, Wykonawca zobowiązuje się
   nie pozyskiwać aktywnie klientów Zamawiającego, z którymi Wykonawca miał
   bezpośredni kontakt w ramach realizacji Umowy.
3. Za każdy miesiąc obowiązywania zakazu po zakończeniu Umowy Zamawiający
   wypłaci Wykonawcy odszkodowanie w wysokości [X]% średniego miesięcznego
   wynagrodzenia netto z ostatnich 3 miesięcy współpracy.
4. Zakaz nie dotyczy branż i klientów niewymienionych w Załączniku nr [X].
```

### Szablon: Prawa autorskie B2B (wersja pełna)
```
§[X]. PRAWA AUTORSKIE I WŁASNOŚĆ INTELEKTUALNA
1. Z chwilą zapłaty pełnego wynagrodzenia Wykonawca przenosi na Zamawiającego
   autorskie prawa majątkowe do Rezultatów — zdefiniowanych w §1 pkt [Y] —
   na następujących polach eksploatacji:
   a) utrwalenie i zwielokrotnienie techniką cyfrową i analogową;
   b) publiczne wyświetlanie, odtwarzanie i udostępnianie;
   c) modyfikacja, adaptacja i tworzenie opracowań;
   d) wprowadzenie do obrotu i dystrybucja;
   e) najem i użyczenie egzemplarzy;
   f) nadawanie i reemitowanie;
   g) wystawienie i eksponowanie.
2. Przeniesienie praw nie obejmuje:
   a) narzędzi, frameworków, bibliotek i komponentów preistniejących;
   b) oprogramowania open-source (na które stosuje się odpowiednie licencje);
   c) materiałów chronionych prawem autorskim podmiotów trzecich.
3. Wykonawca udziela Zamawiającemu nieodpłatnej, niewyłącznej licencji
   na elementy wymienione w ust. 2, w zakresie niezbędnym do korzystania
   z Rezultatów zgodnie z ich przeznaczeniem.
4. Wykonawca oświadcza, że Rezultaty nie naruszają praw osób trzecich.
   W razie naruszenia Wykonawca przejmie obronę prawną na swój koszt.
```

### Szablon: Limit odpowiedzialności B2B (wersja wykonawcy)
```
§[X]. ODPOWIEDZIALNOŚĆ
1. Odpowiedzialność Wykonawcy z tytułu niewykonania lub nienależytego
   wykonania Umowy, niezależnie od podstawy prawnej, ograniczona jest do
   łącznej kwoty [3-krotności] wynagrodzenia netto Wykonawcy wypłaconego
   w ciągu [12] miesięcy poprzedzających zdarzenie szkodowe.
2. Wykonawca nie ponosi odpowiedzialności za:
   a) utratę zysków ani korzyści spodziewanych przez Zamawiającego;
   b) szkody pośrednie, wynikowe, specjalne ani karne;
   c) szkody wynikające z działania lub zaniechania Zamawiającego
      lub osób trzecich niezwiązanych z Wykonawcą.
3. Ograniczenia z ust. 1–2 nie stosuje się do szkód wyrządzonych umyślnie
   lub wskutek rażącego niedbalstwa Wykonawcy (art. 473 §2 KC).
```

---

*Moduł G / analizator-umow-v2 · Dla umów o pracę → references/umowy-o-prace.md*
*Prawo weryfikuj w ISAP · Klauzule w rejestrze UOKiK · Zawsze aktualny tekst jednolity*
