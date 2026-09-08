# MODUŁ K — POUFNOŚĆ / NDA: ANALIZA KOMPLEKSOWA
## Analizator Umów v1 · Moduł Ekspercki

> **Wczytaj ten moduł gdy:** umowa o zachowaniu poufności (odrębna, NDA) lub klauzula
> poufności w umowie głównej, wymiana informacji wrażliwych (kod źródłowy, dane
> klientów, know-how, warunki handlowe), etap przedkontraktowy / rokowania z wymianą
> informacji, tajemnica przedsiębiorstwa (UZNK), pytanie o okres obowiązywania
> poufności po zakończeniu współpracy.

> Dodano 2026-07-30, w toku zewnętrznej analizy porównawczej klauzul kontraktowych
> (odkryta luka: moduł ten dotychczas nie istniał w systemie, mimo że poufność jest
> klauzulą niemal równie powszechną co zakaz konkurencji, analizowany w Module I).

---

> ⛔ HARD GATE — przed podaniem art. KC/UZNK dotyczących poufności weryfikuj w ISAP:
> isap.sejm.gov.pl → Kodeks cywilny → art. 353¹ (swoboda umów), art. 483–484 (kary umowne)
> isap.sejm.gov.pl → ustawa o zwalczaniu nieuczciwej konkurencji → art. 11 (tajemnica przedsiębiorstwa)
> Orzecznictwo dot. tajemnicy przedsiębiorstwa i poufności: sn.pl — nie cytuj z pamięci.

## K.1 MAPA PRAWNA POUFNOŚCI

### Weryfikacja online — ZAWSZE przed analizą:
```
isap.sejm.gov.pl → Kodeks cywilny → art. 353¹ (swoboda umów), art. 483–484 (kary umowne)
isap.sejm.gov.pl → ustawa o zwalczaniu nieuczciwej konkurencji (t.j. aktualny) → art. 11
sn.pl → fraza "tajemnica przedsiębiorstwa" lub "klauzula poufności" → aktualna linia
```

### Dwie odrębne, komplementarne podstawy ochrony

| Podstawa | Źródło | Zakres | Czas trwania | Wymaga umowy? |
|---|---|---|---|---|
| Klauzula kontraktowa poufności (NDA) | art. 353¹ KC (swoboda umów) | Wszystko, co strony zdefiniują jako Informacje Poufne — może być szersze niż tajemnica przedsiębiorstwa | Wg umowy — brak automatycznego przedłużenia po jej wygaśnięciu bez wyraźnego zastrzeżenia | TAK — bez klauzuli/umowy brak tej podstawy |
| Tajemnica przedsiębiorstwa | art. 11 ust. 2 UZNK | Wyłącznie informacje spełniające 3 przesłanki ustawowe (patrz K.1a) | Bezterminowo, dopóki spełnione przesłanki (wartość gospodarcza + poufność faktyczna) | NIE — ochrona ustawowa niezależna od umowy, ale umowa ułatwia dowód spełnienia przesłanek |

**KLUCZOWA ZASADA:** te dwie podstawy się NIE wykluczają, tylko uzupełniają. Klauzula
kontraktowa powinna być redagowana świadomie względem obu — patrz K.3 Pułapka K-6.

### K.1a Przesłanki tajemnicy przedsiębiorstwa (art. 11 ust. 2 UZNK)
```
Informacja stanowi tajemnicę przedsiębiorstwa TYLKO gdy spełnia ŁĄCZNIE:
□ Ma charakter techniczny, technologiczny, organizacyjny przedsiębiorstwa lub
  inną informację posiadającą wartość gospodarczą
□ Jako całość lub w szczególnym zestawieniu i zbiorze elementów nie jest
  powszechnie znana osobom zwykle zajmującym się tym rodzajem informacji
  ani nie jest łatwo dostępna dla takich osób
□ Uprawniony podjął, przy zachowaniu należytej staranności, DZIAŁANIA w celu
  utrzymania jej w poufności

BRAK KTÓREJKOLWIEK przesłanki = informacja NIE jest tajemnicą przedsiębiorstwa,
niezależnie od tego, czy strony nazwały ją "poufną" w umowie. Sama klauzula
kontraktowa (K.1, wiersz pierwszy) wciąż może ją chronić — ale na innej podstawie
i z innymi konsekwencjami (np. bez odrębnych roszczeń z UZNK: zakazowego,
o usunięcie skutków naruszenia, o wydanie bezpodstawnie uzyskanych korzyści).
```

---

## K.2 TEST WAŻNOŚCI I ZAKRESU KLAUZULI POUFNOŚCI — ALGORYTM

```
KROK 1 — DEFINICJA:
  □ Czy "Informacje Poufne" są zdefiniowane konkretnie (kategorie, przykłady),
    czy blankietowo ("wszelkie informacje")?
    Blankietowa = ryzyko sporu o zakres i trudność dowodzenia naruszenia
    Konkretna (z przykładowym katalogiem) = łatwiejsza egzekucja

KROK 2 — WYŁĄCZENIA:
  □ Czy klauzula wyłącza: informacje publicznie dostępne (bez naruszenia umowy),
    informacje posiadane przed ujawnieniem, informacje uzyskane niezależnie,
    informacje wymagane do ujawnienia przepisami prawa lub decyzją organu?
  □ Czy ciężar dowodu wystąpienia wyłączenia spoczywa na stronie otrzymującej
    (standardowe i rekomendowane rozwiązanie)?
  ⚠️ Brak wyłączeń NIE unieważnia klauzuli, ale naraża na spory o zakres —
  patrz Pułapka K-2.

KROK 3 — OKRES OBOWIĄZYWANIA:
  □ Czy okres po zakończeniu umowy jest wskazany WPROST?
    Brak wskazania = ryzyko, że obowiązek wygasa z chwilą ustania relacji
    (poza zakresem chronionym niezależnie przez UZNK, o ile spełnione K.1a)
  □ Czy okres jest zróżnicowany wg rodzaju informacji, czy jeden sztywny
    termin dla wszystkiego?
    Zróżnicowanie (np. dane finansowe — krócej, kod źródłowy/know-how — dłużej
    lub bezterminowo jako tajemnica przedsiębiorstwa) = wyższa szansa na
    utrzymanie klauzuli w całości przy sporze o proporcjonalność
  Rynkowa obserwacja (DO WERYFIKACJI aktualności przy realnym użyciu, to nie
  jest norma ustawowa): 2-5 lat jako typowy przedział B2B; >10 lat lub
  bezterminowo dla WSZYSTKICH informacji (nie tylko tajemnicy przedsiębiorstwa)
  = wariant agresywny, wymaga świadomej akceptacji, nie domyślny punkt wyjścia.

KROK 4 — SANKCJA ZA NARUSZENIE:
  □ Czy przewidziano karę umowną? Bez niej trudno wykazać wysokość szkody
    z tytułu wycieku informacji (szczególnie dla know-how/tajemnic handlowych).
  □ Czy kara ma cap i nie wyłącza prawa do odszkodowania uzupełniającego?
    → Pełna analiza ekonomiczna: `mod-shared-economic.md` (OEK.3, OEK.3a)
  □ Czy nie próbowano wyłączyć prawa do miarkowania (art. 484 §2 KC)?
    → BEZSKUTECZNE z mocy prawa niezależnie od zapisu — patrz OEK.3a.

KROK 5 — NOTYFIKACJA NARUSZENIA:
  □ Czy przewidziano obowiązek niezwłocznego powiadomienia drugiej strony
    o podejrzeniu/stwierdzeniu naruszenia (typowo 24-72h)?
  □ Czy przy jednoczesnym istnieniu DPA (powierzenie danych osobowych) terminy
    notyfikacji są SPÓJNE — nie stosuj dwóch różnych terminów dla tego samego
    zdarzenia bez wyraźnego wskazania, który ma pierwszeństwo (lex specialis)
    → patrz Pułapka K-7 i `mod-shared-rodo.md` RO.4 Pułapka RO-3.
```

---

## K.3 PUŁAPKI W KLAUZULACH POUFNOŚCI

### PUŁAPKA K-1 — Obowiązek poufności wyłącznie jednostronny (MEDIUM RISK)
```
PROBLEM: Tylko jedna strona zobowiązana do zachowania poufności, mimo że obie
strony wymieniają się informacjami wrażliwymi.
RYZYKO: Brak wady prawnej samej w sobie (dopuszczalne w granicach swobody umów),
ale realna asymetria ochrony — flagować jako punkt do negocjacji, nie jako
błąd formalny.
REKOMENDACJA: Domyślnie proponuj wariant wzajemny (obie strony jako "Strona
Ujawniająca" i "Strona Otrzymująca" naprzemiennie), chyba że wymiana informacji
jest z natury jednokierunkowa (np. inwestor bada spółkę przed transakcją).
```

### PUŁAPKA K-2 — Brak wyłączeń (informacje publiczne, niezależnie opracowane) (HIGH RISK)
```
PROBLEM: Klauzula obejmuje "wszelkie informacje" bez wyłączeń.
RYZYKO: Próba objęcia zakazem informacji powszechnie znanych nie zmienia ich
publicznego charakteru, ale naraża CAŁĄ klauzulę na zarzut nieproporcjonalności
przy sporze o inne, faktycznie sporne elementy.
REKOMENDACJA:
  "Za Informacje Poufne nie uznaje się informacji, które: (a) są publicznie
   dostępne w sposób inny niż w wyniku naruszenia Umowy; (b) były w posiadaniu
   Strony Otrzymującej przed ich ujawnieniem; (c) zostały niezależnie
   opracowane bez wykorzystania Informacji Poufnych; (d) zostały uzyskane od
   osoby trzeciej bez obowiązku zachowania poufności; (e) muszą być ujawnione
   na podstawie bezwzględnie obowiązujących przepisów prawa lub prawomocnego
   orzeczenia sądu. Ciężar wykazania wystąpienia którejkolwiek z powyższych
   okoliczności spoczywa na Stronie Otrzymującej."
```

### PUŁAPKA K-3 — Brak okresu po zakończeniu umowy (HIGH RISK)
```
PROBLEM: Klauzula milczy o tym, czy obowiązek trwa po zakończeniu współpracy.
RYZYKO: Obowiązek może wygasnąć z chwilą ustania relacji kontraktowej — poza
zakresem chronionym niezależnie przez tajemnicę przedsiębiorstwa (o ile
spełnione przesłanki K.1a, co wymaga odrębnego wykazania w razie sporu).
REKOMENDACJA: Zawsze wskazać wprost okres po zakończeniu (patrz K.2 KROK 3)
i rozważyć zróżnicowanie wg rodzaju informacji zamiast jednego terminu.
```

### PUŁAPKA K-4 — Kara umowna bez cap lub bez prawa do odszkodowania uzupełniającego (HIGH RISK)
```
PROBLEM: Kara umowna za naruszenie poufności jest jedynym zabezpieczeniem, ale
nie ma capu (ryzyko kumulacji) lub brak zastrzeżenia prawa do odszkodowania
uzupełniającego (art. 484 §1 zd. 2 KC).
RYZYKO: Bez odszkodowania uzupełniającego kara stanowi CAŁOŚĆ odszkodowania
niezależnie od faktycznej wysokości szkody — przy wycieku np. kodu źródłowego
lub bazy klientów rzeczywista szkoda może wielokrotnie przewyższać karę.
REKOMENDACJA: Pełna kalkulacja i redakcja → `mod-shared-economic.md` (OEK.3, OEK.3a).
```

### PUŁAPKA K-5 — Okres poufności skrajnie długi bez uzasadnienia charakterem informacji (MEDIUM RISK)
```
PROBLEM: Bezterminowa poufność zastrzeżona dla WSZYSTKICH informacji objętych
umową, nie tylko dla tych faktycznie stanowiących tajemnicę przedsiębiorstwa.
RYZYKO: Zwiększone ryzyko sporu o proporcjonalność przy próbie egzekucji wobec
informacji o niskiej rzeczywistej wrażliwości (np. dane administracyjne,
warunki handlowe zdezaktualizowane po latach).
REKOMENDACJA: Różnicuj okres: krótszy dla informacji operacyjnych/finansowych,
dłuższy lub bezterminowy WYŁĄCZNIE dla informacji spełniających przesłanki
tajemnicy przedsiębiorstwa (K.1a) — np. kod źródłowy stale rozwijany, unikalne
receptury/algorytmy.
```

### PUŁAPKA K-6 — Mylenie klauzuli kontraktowej z tajemnicą przedsiębiorstwa (MEDIUM RISK)
```
PROBLEM: Analiza lub redakcja klauzuli zakłada, że skoro informacja jest objęta
klauzulą poufności w umowie, to automatycznie jest "tajemnicą przedsiębiorstwa"
w rozumieniu UZNK — i odwrotnie, że brak klauzuli kontraktowej oznacza brak
jakiejkolwiek ochrony.
RYZYKO: To dwie odrębne podstawy ochrony (patrz K.1) o różnych przesłankach,
różnym zakresie i różnych roszczeniach dostępnych w razie naruszenia. Klauzula
kontraktowa bez spełnienia przesłanek K.1a nie daje dostępu do roszczeń z UZNK
(np. roszczenia o wydanie bezpodstawnie uzyskanych korzyści) — daje wyłącznie
roszczenia kontraktowe (odszkodowanie, kara umowna na zasadach ogólnych KC).
REKOMENDACJA: Przy audycie oceniaj obie podstawy OSOBNO — nie zakładaj automatyzmu
w żadną stronę. Jeśli klient chce ochrony na podstawie UZNK, upewnij się, że
faktycznie podjął działania spełniające przesłankę "należytej staranności"
z K.1a (np. NDA z pracownikami, ograniczenie dostępu, oznaczenie dokumentów).
```

### PUŁAPKA K-7 — Niespójne terminy notyfikacji naruszenia przy jednoczesnym DPA (MEDIUM RISK)
```
PROBLEM: Umowa zawiera zarówno klauzulę poufności (np. termin notyfikacji 72h)
jak i załącznik DPA / klauzulę RODO (np. termin notyfikacji 24h dla naruszeń
bezpieczeństwa danych osobowych) — bez wskazania, który termin ma pierwszeństwo
gdy zdarzenie dotyczy jednocześnie obu kategorii (np. wyciek bazy danych
klientów, który jest zarówno informacją poufną, jak i danymi osobowymi).
RYZYKO: Niejasność co do obowiązującego terminu w sytuacji kryzysowej, gdy
czas reakcji ma krytyczne znaczenie (administrator ma tylko 72h na zgłoszenie
naruszenia do UODO od momentu powzięcia wiedzy — art. 33 RODO).
REKOMENDACJA: Wskaż wprost regułę lex specialis — np. "Dla zdarzeń stanowiących
jednocześnie naruszenie ochrony danych osobowych w rozumieniu RODO, zastosowanie
ma termin notyfikacji określony w Załączniku DPA (Umowa Powierzenia), jako
przepis szczególny wobec niniejszej klauzuli poufności." Patrz też
`mod-shared-rodo.md` RO.4 Pułapka RO-3.
```

---

## K.4 CHECKLISTA FORMALNA (klauzula poufności w umowie głównej lub odrębne NDA)
```
□ Strony precyzyjnie określone (firma + NIP, lub imię/nazwisko/PESEL)
□ Definicja Informacji Poufnych — konkretna, z przykładowym katalogiem kategorii
□ Wyłączenia (K-2) z ciężarem dowodu na Stronie Otrzymującej
□ Cel wykorzystania informacji ograniczony do realizacji umowy
□ Krąg osób uprawnionych do ujawnienia (pracownicy, doradcy) z obowiązkiem
  związania ich analogiczną poufnością
□ Okres obowiązywania po zakończeniu umowy wskazany wprost (K-3), rozważ
  zróżnicowanie wg rodzaju informacji (K-5)
□ Kara umowna z cap + prawo do odszkodowania uzupełniającego (K-4)
□ Termin notyfikacji naruszenia, spójny z ewentualnym DPA (K-7)
□ Rozważ, czy informacje spełniają przesłanki tajemnicy przedsiębiorstwa (K.1a)
  niezależnie od klauzuli kontraktowej (K-6)
□ Przy podwykonawcach/specjalistach: obowiązek zawarcia analogicznych NDA
  z osobami trzecimi mającymi dostęp do informacji
```

---

## K.5 SZABLON EKSPERCKI — KLAUZULA POUFNOŚCI (wariant wzajemny, B2B-IT)
```
§[X]. POUFNOŚĆ

1. Przez Informacje Poufne Strony rozumieją wszelkie informacje techniczne,
   technologiczne, organizacyjne, handlowe i finansowe ujawnione przez jedną
   Stronę ("Stronę Ujawniającą") drugiej Stronie ("Stronie Otrzymującej") w
   związku z realizacją niniejszej Umowy, w szczególności: kod źródłowy,
   architekturę systemów, dane dostępowe, bazy danych, warunki handlowe,
   know-how procesowe oraz plany biznesowe.

2. Strona Otrzymująca zobowiązuje się do: (a) zachowania Informacji Poufnych
   w ścisłej tajemnicy; (b) wykorzystywania ich wyłącznie w celu realizacji
   Umowy; (c) ujawniania ich wyłącznie osobom, których udział jest niezbędny
   dla realizacji Umowy, pod warunkiem uprzedniego związania ich obowiązkiem
   poufności co najmniej równoważnym niniejszemu paragrafowi.

3. Za Informacje Poufne nie uznaje się informacji, które: (a) są publicznie
   dostępne w sposób inny niż w wyniku naruszenia Umowy; (b) były w posiadaniu
   Strony Otrzymującej przed ich ujawnieniem; (c) zostały niezależnie
   opracowane bez wykorzystania Informacji Poufnych; (d) zostały uzyskane od
   osoby trzeciej bez obowiązku zachowania poufności; (e) muszą być ujawnione
   na podstawie bezwzględnie obowiązujących przepisów prawa. Ciężar wykazania
   wystąpienia którejkolwiek z powyższych okoliczności spoczywa na Stronie
   Otrzymującej.

4. Obowiązek zachowania poufności obowiązuje przez czas trwania Umowy oraz
   przez [3-5] lat od dnia jej zakończenia, niezależnie od przyczyny
   zakończenia współpracy. Dla informacji stanowiących tajemnicę
   przedsiębiorstwa w rozumieniu art. 11 ust. 2 ustawy o zwalczaniu nieuczciwej
   konkurencji obowiązek poufności trwa przez czas, w jakim informacja
   zachowuje ten charakter.

5. W przypadku powzięcia podejrzenia nieuprawnionego ujawnienia, utraty lub
   naruszenia poufności Informacji Poufnych, Strona Otrzymująca zobowiązuje
   się powiadomić Stronę Ujawniającą w formie dokumentowej nie później niż w
   terminie [48-72] godzin od powzięcia informacji o zdarzeniu. Jeżeli
   zdarzenie stanowi jednocześnie naruszenie ochrony danych osobowych w
   rozumieniu RODO, zastosowanie ma termin notyfikacji określony w
   Załączniku DPA jako przepis szczególny.

6. Za naruszenie obowiązków, o których mowa w niniejszym paragrafie, Strona
   Otrzymująca zapłaci Stronie Ujawniającej karę umowną w wysokości [kwota]
   PLN za każdy przypadek naruszenia, łącznie nie więcej niż [cap] PLN.
   Zastrzeżenie kary umownej nie wyłącza prawa Strony Ujawniającej do
   dochodzenia odszkodowania przewyższającego jej wysokość na zasadach
   ogólnych Kodeksu cywilnego. Strony nie wyłączają prawa żądania miarkowania
   kary na zasadach art. 484 §2 KC.
```

---

## K.6 SCORING KLAUZULI POUFNOŚCI

```
SCORING: Poufność wiążąca dla [Strony Otrzymującej] — ocena dla Strony chronionej

DEFINICJA:
  ✅ Konkretny katalog kategorii informacji (+)
  ⚠ Ogólna definicja bez przykładów (-)
  ❌ "Wszelkie informacje" bez jakiejkolwiek konkretyzacji (ZAKWESTIONUJ)

WYŁĄCZENIA:
  ✅ Pełny katalog 5 wyłączeń + ciężar dowodu na Stronie Otrzymującej (+)
  ⚠ Częściowy katalog wyłączeń (-)
  ❌ Brak wyłączeń (NEGOCJUJ — ryzyko sporu o zakres)

OKRES:
  ✅ Wskazany wprost, 2-5 lat lub zróżnicowany wg rodzaju informacji (+)
  ⚠ >10 lat dla wszystkich informacji bez zróżnicowania (-)
  ❌ Brak wskazanego okresu po zakończeniu umowy (ZAKWESTIONUJ — patrz K-3)

KARA UMOWNA:
  ✅ Kara z cap + odszkodowanie uzupełniające + miarkowanie niezrzekalne (+)
  ⚠ Kara bez cap lub bez odszkodowania uzupełniającego (-)
  ❌ Brak kary umownej (NEGOCJUJ — trudna egzekucja bez niej)

WZAJEMNOŚĆ:
  ✅ Obowiązek wzajemny, obie strony chronione (+)
  ⚠ Obowiązek jednostronny bez uzasadnienia biznesowego (-)

WYNIK OGÓLNY:
  4+ ✅ → klauzula akceptowalna
  2-3 ✅ → klauzula wymaga negocjacji
  0-1 ✅ lub ❌ w kluczowych punktach (definicja, okres, kara) → odrzuć lub przeredaguj
```

---

## K.7 ZŁOTE ZASADY POUFNOŚCI

```
1. Klauzula kontraktowa i tajemnica przedsiębiorstwa (UZNK) to różne podstawy
   ochrony o różnych przesłankach i różnych roszczeniach — nie zakładaj
   automatyzmu w żadną stronę (patrz Pułapka K-6).
2. Brak wskazanego okresu po zakończeniu umowy nie oznacza automatycznie braku
   ochrony (tajemnica przedsiębiorstwa może chronić niezależnie), ale oznacza
   utratę pewności kontraktowej — zawsze rekomenduj wskazanie okresu wprost.
3. Kara umowna bez prawa do odszkodowania uzupełniającego jest górną granicą
   odpowiedzialności niezależnie od faktycznej wysokości szkody (art. 484 §1
   zd. 2 KC) — przy wycieku know-how/kodu źródłowego różnica może być istotna.
4. Prawo do miarkowania kary (art. 484 §2 KC) jest niezrzekalne — identycznie
   jak w Module I (Złota Zasada 3) i w `mod-shared-economic.md` (OEK.3a).
5. Różnicowanie okresu wg rodzaju informacji zwiększa szansę utrzymania
   klauzuli w całości przy sporze o proporcjonalność — jeden sztywny,
   maksymalny termin dla wszystkich informacji jest gorszą praktyką
   redakcyjną niż terminy zróżnicowane.
```

---

*Moduł K / analizator-umow-v1 · Dla zakazu konkurencji → references/zakaz-konkurencji.md (Moduł I)*
*Dla kalkulacji ekonomicznej kar/limitów → references/mod-shared-economic.md (OEK.3, OEK.3a, OEK.5, OEK.5a)*
*Dla RODO/DPA przy danych osobowych → references/mod-shared-rodo.md (Moduł RODO)*
*Dla routingu typów umów → references/mod-J0-routing.md (Moduł J — nawigacja)*
*Prawo weryfikuj w ISAP · Orzeczenia: sn.pl · Zawsze aktualny tekst jednolity*

---

## CHANGELOG

**2026-07-30:** Utworzono Moduł K (poufność/NDA) w toku zewnętrznej analizy
porównawczej klauzul kontraktowych. Wypełnia lukę: system dotychczas nie miał
dedykowanego modułu eksperckiego dla poufności, mimo że jest to klauzula niemal
tak powszechna jak zakaz konkurencji (Moduł I), na wzór którego zbudowano
strukturę (mapa prawna, test ważności, pułapki, checklista, szablon, scoring,
złote zasady). Wprowadzono rozróżnienie dwóch podstaw ochrony (klauzula
kontraktowa vs tajemnica przedsiębiorstwa z art. 11 UZNK) jako centralną
zasadę modułu (K.1, Pułapka K-6) — nieobecne w źródłowym dokumencie
porównawczym, który tego rozróżnienia nie zawierał. Zintegrowano z istniejącymi
modułami: `mod-shared-economic.md` (OEK.3, OEK.3a, OEK.5, OEK.5a — kalkulacja
kar i limitów), `mod-shared-rodo.md` (spójność terminów notyfikacji przy
jednoczesnym DPA — Pułapka K-7). Wymaga integracji routingu w SKILL.md,
mod-J0-routing.md i punktowych odesłań z innych modułów (b2b-podwykonawcze.md,
mod-J6-it-konsorcjum.md, mod-FA-founders-dokumenty-zalozycielskie.md,
mod-core-checklist.md, triage-szybki.md) — patrz wpisy w tych plikach z tą
samą datą.
