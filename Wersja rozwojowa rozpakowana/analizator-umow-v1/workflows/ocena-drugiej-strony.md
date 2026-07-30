# WORKFLOW: Ocena z perspektywy drugiej strony (devil's advocate)
## Analizator Umów v1 · workflows/ocena-drugiej-strony.md

Workflow symulujący czytanie projektu umowy/ugody/regulaminu przez
**pełnomocnika drugiej strony**. Cel: znaleźć wszystko, co druga strona mogłaby
wykorzystać przeciwko klientowi, dla którego pracujesz — **zanim** dokument
zostanie wysłany.

**Triggery:** *„ocena drugiej strony"*, *„co mogą zarzucić"*, *„jak druga
strona to przeczyta"*, *„perspektywa kontrahenta"*, *„red team"*, *„devil's
advocate"*, *„audyt z perspektywy oponenta"*, *„sprawdź jak to wykorzystają"*.

**Kiedy uruchamiać proaktywnie:** przed wysłaniem ugody, wezwania do zapłaty,
kontrpropozycji, lub umowy w wysokostawkowej negocjacji — finalna kontrola
przed wyjściem dokumentu poza Twoją stronę.

**Nie mylić z audytem ryzyk** (Moduł D/F w `mod-core-checklist.md`, patrząc z
perspektywy Twojego klienta — *co nam grozi w wykonaniu umowy*). Ten workflow
patrzy z perspektywy oponenta — *co oponent może w tej umowie znaleźć przeciwko
nam*. Komplementarne, nie zamienne.

---

## Krok 0 — kontekst z wcześniejszych rozmów (opcjonalnie)

Jeśli w tej lub poprzednich rozmowach z tym użytkownikiem pojawiały się
informacje o tym kontrahencie lub jego stylu negocjacyjnym — sprawdź je
(`conversation_search` po nazwie kontrahenta, `recent_chats` jeśli chodzi o
niedawną sprawę) i uwzględnij w Kroku 1 przy budowaniu persony oponenta. Jeśli
nic nie ma — pomiń ten krok, nie pytaj o to wprost.

## Krok 1 — określ stronę i kontekst

1. **Kogo reprezentujesz** w tej umowie? (Wykonawcę? Zamawiającego?
   Wynajmującego? Beneficjenta?)
2. **Kto jest drugą stroną** — kto czyta ten dokument z drugiej strony stołu?
3. **Kontekst relacji** — spór otwarty? nowa negocjacja? umowa wykonawcza w
   trakcie współpracy?
4. **Profil pełnomocnika drugiej strony** — duża kancelaria korporacyjna
   (szuka literek)? mała kancelaria ogólna (szuka oczywistego)? in-house o
   nastawieniu obronnym? przedsiębiorca bez prawnika (szuka „dlaczego mam
   tyle zapłacić")?

Wynik: **persona oponenta** — w jego buty wchodzisz w Kroku 2.

## Krok 2 — sześć kategorii ataków

Czytaj dokument punkt po punkcie z perspektywy oponenta.

### 1. Niekorzystne potwierdzenia (concessions)

Fragmenty, w których Twoja strona niechcący przyznaje fakt lub stanowisko
korzystne dla drugiej strony.

**Sygnały:** *„Strony zgodnie potwierdzają, że…"* przy spornym fakcie;
*„kierując się treścią [poprzedniej umowy]"* (włącza tylnymi drzwiami
klauzule wygasłej umowy); *„Strony nie mają wobec siebie żadnych roszczeń"*
(może zaszkodzić, jeśli o jakimś nie wiesz); *„wszystko, co przekazane do
dnia podpisania, stanowi własność…"* (szeroki transfer).

### 2. Niejednoznaczności interpretacyjne

**Sygnały:** *„w terminie odpowiednim do okoliczności"*, *„koszty zostaną
pokryte"* (przez kogo?), *„świadczenie zostanie wykonane"* (strona bierna bez
podmiotu), brak rozróżnienia brutto/netto, daty graniczne bez „włącznie/
wyłącznie". Diagnostyka: `references/generator/kategorie-klauzul-taksonomia.md`
— kategoria „polityka" źle sformułowana jako „warunek" i odwrotnie generuje
dokładnie ten typ niejednoznaczności.

### 3. Luki dowodowe

**Sygnały:** brak terminu na zgłoszenie zastrzeżeń (domyślnie milczenie =
akceptacja — sprawdź, czy to zamierzone); brak mechanizmu odbiorczego (bez
tego brak podstawy do zapłaty w umowach wdrożeniowych); brak jednoznacznego
momentu zapłaty (uznanie rachunku vs obciążenie); brak adresów do doręczeń
poza komparycją.

### 4. Sprzeczności wewnętrzne

**Sygnały:** klauzula wygaśnięcia „w całości" + jednoczesne pozostawienie
obowiązków po wygaśnięciu (wymaga przebudowy na „wygaśnięcie w części
niewykonanej"); klauzule warunkujące się nawzajem tworzące otwarty, nie
zamknięty obwód; odesłania wewnętrzne nieaktualne po edycjach — routing:
`workflows/weryfikacja-spojnosci-odeslan.md` dla systematycznego sprawdzenia.

### 5. Błędy obliczeniowe i terminowe

**Sygnały:** suma rat ≠ kwota łączna; daty terminów kolidujące (np. III rata
31.07 + termin wygaśnięcia innego zobowiązania też 31.07 — kolizja);
zapis liczbowo-słowny kwoty niespójny; brak jasności „do dnia X" (włącznie
czy wyłącznie); podstawa naliczania odsetek niejasna (data wezwania czy
wymagalności).

### 6. Mechanizmy wyjścia (exit ramps)

**Sygnały:** siła wyższa zdefiniowana zbyt szeroko; „ważne powody"
wypowiedzenia bez zamkniętej listy; klauzule rozwiązujące niesymetryczne (i
sprawdź, czy to zamierzone); „do czasu spełnienia warunku" bez terminu
granicznego dającego drugiej stronie nieograniczoną zwłokę.

## Krok 3 — raport

```
## Persona oponenta
[kto czyta, jaka motywacja, jakie ma narzędzia]

## Zidentyfikowane słabości

### P1 — krytyczne (muszą być naprawione przed wysłaniem)
1. [§ X ust. Y] [Słabość] → [Atak drugiej strony] → [Rekomendacja — gotowe brzmienie]

### P2 — istotne (rekomenduje się poprawić)
1. ...

### P3 — drobne (do rozważenia, świadoma akceptacja)
1. ...

## Pytania do klienta przed wysłaniem
[jeśli kwestia wymaga decyzji biznesowej, nie tylko prawnej]

## Ogólna ocena ryzyka
[1–3 zdania: jak to wpływa na pozycję negocjacyjną]
```

**Priorytety:** P1 = duże prawdopodobieństwo wykorzystania, naprawiaj zawsze.
P2 = możliwe w agresywnej negocjacji, zalecana naprawa, nieblokująca. P3 =
teoretyczna, „miło mieć" naprawione.

## Krok 4 — iteracja

Po naprawach P1/P2 uzgodnionych z klientem (część może wymagać **decyzji
biznesowej**, nie tylko prawnej — np. „czy akceptujesz asymetrię klauzuli
niedyskredytowania w zamian za szybsze podpisanie") — uruchom Krok 1–3
ponownie. Iteruj do momentu, gdy zostają tylko akceptowane P2/P3.

## Krok 5 — final check przed wysłaniem

Po kilku rundach poprawek łatwo **zapomnieć wprowadzić** ostateczne decyzje.
Ten workflow nie jest ukończony, dopóki nie zweryfikujesz, że uzgodnienia
faktycznie są w dokumencie:

1. Wszystkie uzgodnione zmiany (zwłaszcza drobne wartościowe: brutto/netto,
   kwoty, daty) obecne w finalnym tekście?
2. Odesłania wewnętrzne aktualne po wszystkich edycjach? —
   `workflows/weryfikacja-spojnosci-odeslan.md`.
3. Spójność nazewnictwa wyliczeń (`1) 2) 3)` vs `a) b) c)` — patrz
   `references/generator/style-format-generowania.md` S.1).
4. Brak duplikatów mechanizmów (dwa paragrafy regulujące ten sam skutek —
   jeden do wycięcia).
5. Spójność przypadków gramatycznych przy łączeniu list (`wraz z X oraz Y` —
   ten sam przypadek).
6. Brak literówek w pogrubieniach/placeholderach, brak niescalonych
   formatowań po edycjach w Wordzie.
7. Nazwy stron w klauzulach zgodne z komparycją (`boilerplate-strukturalne.md`
   B.1) w całym dokumencie, bez wariantów.

**Reguła operacyjna:** final check najlepiej robi ktoś inny niż autor
finalnej redakcji (lub Ty, jeśli klient pracuje solo — świeże spojrzenie
wyłapuje to, czego autor już nie widzi; poproś użytkownika o jedną dodatkową
turę czytania, jeśli to możliwe).

## Anti-patterny tego workflow

- Ograniczanie się do języka prawniczego — pełnomocnik drugiej strony może
  mieć inną specjalizację (cywilista, podatkowiec, IP) — myśl szeroko.
- Traktowanie klauzuli jako „bezpiecznej" tylko dlatego, że jest standardowa
  — standardowe klauzule mają najwięcej orzecznictwa = najwięcej znanych ataków.
- Pomijanie tonu — agresywne sformułowanie w ugodzie zaprasza do twardej
  kontry zamiast szybkiego podpisu.

## Powiązania

- Moduł D/F `mod-core-checklist.md` — audyt ryzyk z perspektywy klienta (komplementarny).
- `mod-shared-neg-strategia.md` — strategia negocjacyjna korzysta z wyników tego workflow.
- `references/generator/kategorie-klauzul-taksonomia.md` — diagnostyka niejednoznaczności (Kategoria 2).
- `workflows/weryfikacja-spojnosci-odeslan.md` — Kategoria 4 i Krok 5 pkt 2.
- `workflows/triage-szybki.md` — jeśli triage dał YELLOW/RED w umowie wysokostawkowej, ten workflow jest naturalnym następnym krokiem przed negocjacją.
