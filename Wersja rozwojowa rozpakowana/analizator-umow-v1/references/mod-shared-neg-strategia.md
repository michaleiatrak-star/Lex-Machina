# MODUŁ SHARED-NEG — STRATEGIA NEGOCJACYJNA UMÓW
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** analiza umowy zakończona, użytkownik przechodzi do negocjacji;
> użytkownik pyta "co zmienić", "co jest ważne", "od czego zacząć negocjacje",
> "jak przekonać drugą stronę", "co możemy odpuścić".

> ⛔ HARD GATE — weryfikuj aktualne przepisy przez ISAP przed podaniem podstaw prawnych.
>
> **v1.17 — przed finalizacją strategii/wysłaniem kontrpropozycji:** uruchom
> systematyczną ocenę adwersarialną zamiast polegać wyłącznie na intuicji co
> do słabości własnego projektu —
> `view analizator-umow-v1/workflows/ocena-drugiej-strony.md`
> (6 kategorii ataków: niekorzystne potwierdzenia, niejednoznaczności, luki
> dowodowe, sprzeczności wewnętrzne, błędy obliczeniowe/terminowe, mechanizmy
> wyjścia). To jest finalna kontrola przed wyjściem dokumentu poza Twoją stronę.

---

## NEG.1 INTAKE NEGOCJACYJNY — pytania przed strategią

Przed opracowaniem strategii ustal (jedno pytanie zbiorcze):

```
□ POZYCJA STRON:
  [ ] Klient jest stroną silniejszą (duży podmiot, zamawiający, właściciel nieruchomości)
  [ ] Klient jest stroną słabszą (wykonawca, nabywca, konsument)
  [ ] Strony są równorzędne (B2B między firmami podobnej wielkości)

□ ELASTYCZNOŚĆ:
  [ ] Umowa negocjowalna — druga strona jest otwarta na zmiany
  [ ] Umowa "take it or leave it" — standard, bez negocjacji
  [ ] Częściowo negocjowalna — pewne klauzule można próbować zmienić

□ CZAS:
  [ ] Pilne — decyzja w ciągu [X] dni
  [ ] Normalne — kilka tygodni na negocjacje
  [ ] Brak presji czasowej

□ WARTOŚĆ UMOWY: [kwota lub szacunek — determinuje głębokość analizy]

□ RELACJA Z DRUGĄ STRONĄ:
  [ ] Pierwsza umowa — brak historii
  [ ] Długoletnia współpraca — obie strony mają interes w utrzymaniu relacji
  [ ] Jednorazowa transakcja — relacja nieważna

□ BATNA (Best Alternative To Negotiated Agreement):
  → Co klient zrobi jeśli umowa nie zostanie podpisana?
  → Czy ma alternatywnego kontrahenta? Czy może zrezygnować z transakcji?

□ ZOPA (Zone of Possible Agreement) — v1.18, konstruuj Z BATNA obu stron:
  → Twoja rezerwacja (reservation point): najgorsze warunki, które klient
    jeszcze zaakceptuje — wyznaczone przez JEGO BATNA (jeśli alternatywa
    klienta jest słaba, jego rezerwacja jest niższa — mniej do stracenia
    na negocjacji vs. brak umowy w ogóle).
  → Szacowana rezerwacja drugiej strony: co, wg dostępnych sygnałów
    (branża, pilność po ich stronie, alternatywni kontrahenci), są jeszcze
    skłonni zaakceptować.
  → ZOPA istnieje, gdy te dwa przedziały (Twojej rezerwacji i szacowanej
    rezerwacji drugiej strony) się nakładają. Jeśli się NIE nakładają —
    powiedz to wprost klientowi: dalsze negocjowanie samych zapisów umowy
    nie pomoże, dopóki jedna ze stron nie zmieni swojego BATNA (np. klient
    znajdzie alternatywnego kontrahenta) — to zmienia rekomendację z
    „negocjuj klauzule" na „pracuj nad alternatywą, potem wróć do stołu".
```

> **Źródło (v1.18):** Fisher, R.; Ury, W.; Patton, B., *Getting to Yes:
> Negotiating Agreement Without Giving In*, wyd. 3, Penguin Books 2011 —
> kanoniczny tekst Harvard Negotiation Project / Program on Negotiation
> (pon.harvard.edu), na którym opierają się BATNA i ZOPA jako narzędzia
> analizy przedumownej. WorldCC (World Commerce & Contracting, dawniej
> IACCM) wskazuje słabą negocjację i zarządzanie kontraktem jako źródło
> >9% utraty wartości projektu (research WorldCC — ten sam podmiot, którego
> Contract Design Pattern Library jest już źródłem w
> `references/generator/legal-design-produkcyjny.md`).

## NEG.1B NEGOCJACJA OPARTA NA INTERESACH (v1.18) — poprzedza NEG.2

**Zasada nadrzędna (Fisher/Ury/Patton, „principled negotiation"):** macierz
must/should/nice/token w NEG.2 kategoryzuje **stanowiska** (co klient chce
zmienić w tekście umowy). Zanim ją zastosujesz, ustal **interesy** stojące za
tymi stanowiskami — bo dwa stanowiska, które wyglądają na sprzeczne, często
mają interesy dające się pogodzić (opcja integrative/win-win), podczas gdy
negocjowanie wprost ze stanowiska prowadzi tylko do kompromisu w połowie
drogi (distributive).

**Cztery zasady principled negotiation — zastosuj w tej kolejności:**

1. **Oddziel ludzi od problemu.** Nie personalizuj sporu o klauzulę — trudny
   ton drugiej strony w e-mailu nie znaczy, że ich stanowisko w sprawie
   kary umownej jest nie do pogodzenia z Twoim.
2. **Skup się na interesach, nie na stanowiskach.** Dla KAŻDEGO stanowiska w
   macierzy NEG.2 zadaj: *„Dlaczego druga strona tego chce? Jaki realny
   interes za tym stoi?"* (np. żądanie krótkiego terminu płatności może
   wynikać z problemów z płynnością, nie z chęci dyscyplinowania — inny
   interes = inne rozwiązanie niż samo „skróć termin").
3. **Wymyślaj opcje korzystne dla obu stron (mutual gain)** przed wyborem
   jednego rozwiązania — nie ograniczaj się do „zaakceptuj / odrzuć /
   kompromis pośrodku" jednego zapisu, jeśli inny mechanizm zaspokaja
   interesy obu stron pełniej (np. zamiast negocjować wysokość kary umownej
   w dół — zaproponuj karę stopniowaną + krótszy okres rozliczeniowy, jeśli
   realnym interesem drugiej strony jest przewidywalność przepływów, nie
   sama wysokość kary).
4. **Nalegaj na obiektywne kryteria.** Odwołuj się do benchmarków rynkowych
   (`mod-shared-economic.md`, `mod-shared-fallback-library.md`), standardów
   branżowych (FIDIC, ISDA — patrz `mod-shared-wykladnia.md` W.2) lub norm
   ustawowych zamiast czystej siły przetargowej — łatwiej o zgodę drugiej
   strony, gdy propozycja odwołuje się do zewnętrznego standardu, nie do
   Twojego life żądania.

**Zastosowanie do macierzy NEG.2:** przy KAŻDEJ pozycji M/S/N/T dopisz jedno
zdanie „interes: [...]" obok „stanowisko: [...]" — to pozwala w Kroku
NEG.3 (sekwencja negocjacyjna) proponować rozwiązania integrative zamiast
tylko ustępstw wzdłuż jednej osi.

---

## NEG.2 PRIORYTETYZACJA ŻĄDAŃ — macierz must/should/nice/token

Dla każdej rekomendowanej zmiany z Modułu D.3 przypisz kategorię:

```
KATEGORIA M — MUST HAVE (dealbreaker — bez tej zmiany nie podpisuj):
  Kryterium: klauzula powoduje ryzyko Krytyczne LUB naraża na nieważność/odpowiedzialność karną
  Postawa: "Bez tej zmiany nie jesteśmy w stanie podpisać umowy."
  Przykłady:
  → Brak odszkodowania przy zakazie konkurencji po UoP (nieważność z mocy prawa)
  → Wyłączenie odpowiedzialności za umyślne naruszenie (art. 473 §2 KC — bezskuteczne)
  → Kara umowna rażąco wygórowana bez górnego limitu

KATEGORIA S — SHOULD HAVE (ważne, ale ugodowe):
  Kryterium: klauzula niekorzystna z oceną ryzyko Wysokie, ale nie uniemożliwia wykonania umowy
  Postawa: "Zależy nam na tej zmianie — możemy ustąpić w innym miejscu."
  Przykłady:
  → Asymetryczny termin płatności
  → Zbyt szeroki zakres poufności bez limitu czasowego
  → Brak kary dla drugiej strony za opóźnienie

KATEGORIA N — NICE TO HAVE (pożądane, ale drugorzędne):
  Kryterium: klauzula ryzyko Średnie lub Niskie — poprawa komfortu
  Postawa: "Preferujemy tę zmianę, ale nie jest kluczowa."
  Przykłady:
  → Doprecyzowanie definicji pojęć
  → Dodanie klauzuli waloryzacji przy wieloletniej umowie
  → Usprawnienie procedury zgłaszania usterek

KATEGORIA T — TOKEN (żeton do oddania):
  Kryterium: klauzula, z której klient może ustąpić bez istotnego ryzyka
  Postawa: "Możemy to zaakceptować w zamian za zmianę [S/M]."
  Przykłady:
  → Wybór sądu siedziby kontrahenta (gdy klient i tak jest z tego samego miasta)
  → Dłuższy termin wypowiedzenia (gdy obie strony raczej nie wypowiedzą)
  → Forma pisemna dla drobnych zmian organizacyjnych
```

**Zasada:** Do każdej kategorii M i S przypisz gotowe brzmienie alternatywne (z Modułu D.3).

---

## NEG.3 SEKWENCJA NEGOCJACYJNA — jak prowadzić rozmowę

```
KROK 1 — OTWARCIE (nie zaczynaj od dealbreakera):
  → Zacznij od kwestii proceduralnych i technicznych (terminy, definicje)
  → Buduj atmosferę współpracy przed trudnymi tematami
  → Nie prezentuj całej listy zmian naraz — to wywołuje reakcję obronną

KROK 2 — ŻETONY (kategoria T) — oddaj je wcześnie:
  → Ustąpienie w nieważnych kwestiach buduje goodwill
  → "Możemy zaakceptować §7 w proponowanym brzmieniu — zależy nam natomiast na §3."
  → Ustępstwo T ≠ słabość; to sygnał gotowości do kompromisu

KROK 3 — KATEGORIA N (nice to have) — negocjuj łącznie:
  → Pakietuj kilka kwestii N razem i proponuj pakiet
  → "Jeśli zgodzą się Państwo na §4 i §8 w naszej wersji, zaakceptujemy §11 bez zmian."

KROK 4 — KATEGORIA S (should have) — eskalacja:
  → Każda zmiana S powinna mieć przygotowane uzasadnienie + alternatywę
  → Technika: "Rozumiemy Państwa interes w [X]. Nasz interes w [Y]. 
    Czy możemy rozważyć rozwiązanie [Z] które zaspokaja obie strony?"
  → Propozycja alternatywna zawsze lepsza niż samo "nie"

KROK 5 — KATEGORIA M (dealbreaker) — ostatni:
  → Kwestie M przedstawiaj na końcu, gdy relacja jest zbudowana
  → Formułuj jako potrzebę, nie ultimatum: "Musimy upewnić się, że §12 nie naraża 
    nas na nieograniczoną odpowiedzialność — to wymóg naszego działu prawnego."
  → Jeśli druga strona odmawia M: "Niestety, bez tej zmiany nie możemy 
    zarekomendować podpisania umowy naszemu klientowi."

KROK 6 — ZAMKNIĘCIE:
  → Każdą ustaloną zmianę potwierdzaj pisemnie (e-mail po rozmowie)
  → "Podsumowując dzisiejsze ustalenia: zgodnie zmieniliśmy §3, §7, §12..."
  → Poproś o nową wersję dokumentu z oznaczonymi zmianami (redline)
```

---

## NEG.4 TECHNIKA BRACKETED DRAFTS — redline i nawiasy

Prawnicy kontraktowi negocjują w formacie redline (śledzenie zmian):

```
FORMAT BRACKETED DRAFT:
  Tekst zaproponowany przez stronę A: [tekst strony A]
  Alternatywa strony B:                [tekst strony B]
  Wersja kompromisowa:                 [wersja uzgodniona]

PRZYKŁAD:
  WERSJA PIERWOTNA (strona A):
  "Wykonawca odpowiada za wszelkie szkody powstałe w związku z realizacją Umowy."

  WERSJA REDLINE (strona B — propozycja zmiany):
  "Wykonawca odpowiada za wszelkie [udowodnione, bezpośrednie] szkody 
   powstałe [wskutek zawinionego niewykonania lub nienależytego wykonania] 
   [, z wyłączeniem utraconych korzyści,] w związku z realizacją Umowy[, 
   do łącznej wysokości wynagrodzenia brutto za ostatnie 12 miesięcy współpracy]."

  Elementy w nawiasach [...] = propozycja do negocjacji
  Elementy skreślone → ~~tekst~~ = wniosek o usunięcie
```

**Zasada prezentacji zmian:**
```
Dla każdej zmiany kategorii M i S przygotuj:
  1. OBECNE BRZMIENIE: [cytat z umowy]
  2. PROBLEM: [dlaczego niekorzystne — skutek prawny]
  3. PROPONOWANE BRZMIENIE: [gotowy tekst do wklejenia]
  4. UZASADNIENIE: [argument do przedstawienia drugiej stronie]
  5. POZYCJA NEGOCJACYJNA: M/S/N/T
  6. ALTERNATYWA AKCEPTOWALNA: [minimalna wersja kompromisowa]
```

---

## NEG.5 OBSŁUGA "TAKE IT OR LEAVE IT"

Gdy druga strona odmawia negocjacji:

```
KROK 1 — ZWERYFIKUJ REALNOŚĆ:
  → Często "TILI" jest pozycją otwierającą, nie finalną
  → Zapytaj: "Czy mają Państwo możliwość skonsultowania zmian z Działem Prawnym?"
  → Odróżnij: niechęć do negocjacji vs faktyczny brak uprawnień rozmówcy

KROK 2 — SKUPIENIE NA DEALBREAKERKACH:
  → Przy TILI analizuj TYLKO kategorie M
  → Pytanie klienta: "Czy klauzule M generują ryzyko, z którym klient może żyć?"
  → Analiza asymetryczna: co się dzieje gdy umowa jest wykonywana normalnie vs
    gdy coś idzie nie tak — dla kogo TILI jest bardziej niebezpieczne?

KROK 3 — ALTERNATYWY ZAMIAST ZMIAN:
  → Zamiast zmiany klauzuli: dodatkowe zabezpieczenie zewnętrzne
    (np. ubezpieczenie od odpowiedzialności cywilnej zamiast limitu w umowie)
  → Zamiast symetrycznej kary: jednorazowa płatność za niesymetryczność
  → Zamiast innej klauzuli siły wyższej: osobna notatka potwierdzająca interpretację

KROK 4 — DECYZJA:
  → Jeśli klauzule M nie dają się zmienić i ryzyko jest realne:
    "Rekomendacja: nie podpisywać bez [wymień klauzule M]."
  → Jeśli klauzule M dają się zaakceptować z dodatkowym zabezpieczeniem:
    "Rekomendacja: podpisać z zastrzeżeniem [X] jako zabezpieczenia."
```

---

## NEG.6 WZORZEC RAPORTU NEGOCJACYJNEGO

Po przeprowadzeniu analizy i opracowaniu strategii — generuj raport:

```
RAPORT NEGOCJACYJNY
Dokument: [nazwa umowy]
Strona chroniona: [A/B]
Tryb: [negocjowalna / TILI / częściowo negocjowalna]
Wartość umowy: [kwota lub "nieznana"]

DEALBREAKERY (M) — bez tych zmian nie rekomendujemy podpisania:
  [nr] §[X]: [problem] → [gotowe brzmienie]

PRIORYTETY (S) — ważne, proponuj w zamian za ustępstwo w [T]:
  [nr] §[X]: [problem] → [gotowe brzmienie] + [uzasadnienie do negocjacji]

ŻETONY DO ODDANIA (T) — możesz ustąpić bez istotnego ryzyka:
  [nr] §[X]: [co oddajesz] → [w zamian za co]

SEKWENCJA NEGOCJACYJNA:
  Runda 1: Zacznij od §[T1], §[T2] — ustąp
  Runda 2: Zaproponuj §[N1]+§[N2] jako pakiet
  Runda 3: Postaw na §[S1], §[S2]
  Runda 4: Jeśli nadal opór — eskaluj §[M1] jako wymóg nieprzekraczalny

MINIMUM AKCEPTOWALNE (bez podpisania):
  → §[M1] w brzmieniu: [minimalna wersja]
  → §[M2] w brzmieniu: [minimalna wersja]
```

---

*← Powrót do routingu: `view references/mod-J0-routing.md`*
*Powiązane: Moduł D.3 (rekomendacje zmian), Moduł F (raport końcowy)*
*Weryfikacja przepisów: isap.sejm.gov.pl · orzeczenia.ms.gov.pl*
