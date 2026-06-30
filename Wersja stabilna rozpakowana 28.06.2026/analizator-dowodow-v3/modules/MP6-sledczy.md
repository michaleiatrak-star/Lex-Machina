# M6 — Techniki Śledcze: Profilowanie, Behawiorystyka, HUMINT, VSA, OSINT, Manipulacja

## Cel

Wykryć wzorce behawioralne, ukryte motywacje, manipulacje narracyjne, sygnały
kłamstwa, sekwencje działań wskazujące na zamiar oraz ślady ukrytych relacji
i interesów. Moduł stosuje metodologię śledczą wywodzącą się z praktyki
FBI/CIA, analizy behawioralnej, wywiadu osobowego (HUMINT), analizy werbalnej
(VSA) i wywiadu z otwartych źródeł (OSINT).

**Reguła bezwzględna:** M6 generuje wyłącznie hipotezy oznaczone `[H-ŚLEDCZA]`.
Hipoteza staje się ustaleniem dopiero po potwierdzeniu dowodem lub przyznaniem.
Nie stwierdzaj zamiaru, kłamstwa ani manipulacji jako faktu.

---

## 6.0 Aktywacja modułów wewnętrznych

Uruchom właściwe sekcje zależnie od materiału:

| Sekcja | Kiedy aktywować |
|--------|----------------|
| 6.1 Profilowanie podmiotów | zawsze przy ≥ 1 osobie / podmiocie kluczowym |
| 6.2 Analiza werbalna (VSA) | przy zeznaniach, pismach narracyjnych, mailach |
| 6.3 Detekcja kłamstwa / deceptive writing | przy sprzecznych wersjach lub podejrzeniu fałszu |
| 6.4 Analiza behawioralna sekwencji | przy podejrzeniu działania zaplanowanego / odwetu |
| 6.5 HUMINT — analiza relacji i sieci | przy wielu podmiotach, powiązaniach, interesach |
| 6.6 OSINT — ślady zewnętrzne | gdy brak dokumentów wewnętrznych |
| 6.7 Hermeneutyka prawnicza tekstu | zawsze |
| 6.8 Detekcja technik manipulacyjnych | zawsze |
| 6.9 Analiza śledcza zdarzenia (5W1H+) | dla każdego zdarzenia krytycznego |
| 6.10 Analiza zamiaru i modus operandi | przy podejrzeniu działania celowego |
| 6.11 Lista pytań śledczych | zawsze na końcu M6 |

---

## 6.1 Profilowanie podmiotów

### Cel
Zbudować profil operacyjny każdej kluczowej osoby lub podmiotu: motywacje,
zasoby, ryzyko, wzorzec zachowań, podatność na presję.

### Karta profilu

```text
[PROFIL-001]
Podmiot: (imię/stanowisko/rola)
Rola w sprawie: powód / pozwany / świadek / organ / pełnomocnik / inny
Interes w sprawie: co zyskuje / co traci
Zasoby: finansowe / prawne / instytucjonalne / informacyjne / relacyjne
Wzorzec zachowań w dokumentach:
  — reaguje emocjonalnie czy chłodno?
  — eskaluje czy wycofuje się pod presją?
  — konsekwentny czy zmienia narrację?
  — unika konkretów czy podaje szczegóły?
Sygnały wiarygodności: wysokie / średnie / niskie
Uzasadnienie wiarygodności:
Możliwe ukryte motywacje:
Podatność: na co reaguje (presja prawna / ekonomiczna / reputacyjna)?
Przewidywalne zachowanie procesowe:
Ryzyka ze strony tego podmiotu:
[H-ŚLEDCZA] Hipoteza dotycząca podmiotu:
Fakty potwierdzające hipotezę:
Fakty obalające hipotezę:
```

---

## 6.2 Analiza werbalna (VSA — Verbal Statement Analysis)

### Cel
Wykryć w tekstach pisanych sygnały linguistyczne wskazujące na nieszczerość,
selekcję faktów, ukryte założenia lub zmianę poziomu pewności.

### Wskaźniki do analizy

**A. Strukturalne sygnały nieszczerości**
- brak pierwszoosobowej odpowiedzialności (`zostało zrobione` zamiast `zrobiłem`);
- użycie strony biernej przy własnych działaniach;
- zmiana czasu narracji (przeszły → teraźniejszy → przeszły) w jednym opisie;
- pominięcie kluczowego okresu czasu bez wyjaśnienia;
- nagłe skrócenie narracji przy ważnym zdarzeniu;
- nadmierne szczegółowanie nieistotnych elementów przy lakoniczności w kluczowych;
- użycie słów osłabiających pewność: `chyba`, `zdaje się`, `o ile pamiętam`.

**B. Zmiana poziomu zaangażowania emocjonalnego**
- zimna neutralność tam, gdzie normatywna reakcja byłaby emocjonalna;
- nadmierna emocjonalność tam, gdzie oczekiwana byłaby neutralność;
- retrospektywne uzasadnianie emocji (opisywanie uczuć „z zewnątrz").

**C. Sygnały ukrytej wiedzy**
- użycie czasu przeszłego przed opisem zdarzenia, które miało być nieoczekiwane;
- znajomość szczegółów, których nie mógł znać bez dostępu do informacji;
- pytania retoryczne sugerujące wiedzę o odpowiedzi.

**D. Edycja mentalna**
- korekty w piśmie ręcznym lub widoczne poprawki;
- nadmiarowe wyjaśnienia definicji pojęć normalnie niewymagających wyjaśnienia;
- przerwy tematyczne bez przejścia logicznego.

### Format karty VSA

```text
[VSA-001]
Fragment analizowany (cytat dosłowny):
Źródło: DOC-ID, strona/akapit
Wykryty sygnał:
  Typ: strukturalny / emocjonalny / ukryta wiedza / edycja mentalna
  Opis sygnału:
  Normatywne oczekiwanie (co powinno być, gdyby brak deceptive writing):
  Odchylenie:
Siła sygnału: słaba / umiarkowana / silna
[H-ŚLEDCZA] Hipoteza:
Fakty do weryfikacji:
```

---

## 6.3 Detekcja deceptive writing i fałszu w piśmie

### Cel
Wykryć wzorce charakterystyczne dla świadomego konstruowania nieprawdziwej
lub selektywnej narracji w dokumentach pisanych.

### Techniki detekcji

**Technika SCAN (Scientific Content Analysis)**

1. **Negacja niepotrzebna** — zdanie zawiera zaprzeczenie czegoś, czego nikt nie zarzucał.
   Przykład: „Nigdy nie twierdziłem, że..." — sugeruje istnienie takiego twierdzenia.
2. **Brakujący period** — narracja skacze w czasie bez wyjaśnienia przerwy.
   Wzorzec: opisano A (9:00), opisano C (11:00), brak B (10:00).
3. **Zmiana terminologii** — ta sama osoba lub zdarzenie nazywane inaczej
   w różnych częściach dokumentu. Zmiana może wskazywać zmianę relacji lub
   próbę oddzielenia faktów.
4. **Nadmiarowe informacje** — szczegóły niezwiązane ze sprawą, które
   zajmują nieproporcjonalnie dużo miejsca.
5. **Ograniczone słownictwo emocjonalne** — ubogi opis emocji przy zdarzeniu
   traumatycznym (normatywnie: bogate słownictwo).

**Technika PEACE (Preparation / Engage / Account / Closure / Evaluate)**
Stosuj przy analizie zeznań i wyjaśnień:
- Czy narracja jest spontaniczna czy reaktywna?
- Czy zmienia się po pytaniach uzupełniających?
- Czy zawiera informacje, których nie mógł znać z zewnątrz?

### Format karty detekcji

```text
[DECEIVE-001]
Technika: SCAN / PEACE / inny
Cytat / fragment:
Wykryta anomalia:
Porównanie z normą:
Możliwe wyjaśnienie neutralne (brak manipulacji):
Możliwe wyjaśnienie deceptive:
[H-ŚLEDCZA] Hipoteza:
Dowód potwierdzający lub obalający:
```

---

## 6.4 Analiza behawioralna sekwencji działań

### Cel
Wykryć, czy działania podmiotów tworzą wzorzec wskazujący na planowanie,
odwet, przygotowanie narracji lub ukrywanie faktów.

### Wzorce behawioralne do sprawdzenia

**Wzorzec A — Przygotowanie narracji przed zdarzeniem**
Działania dokumentacyjne poprzedzają zdarzenie, które ma „zaskoczyć":
pismo/e-mail wysłany przed zdarzeniem opisującym je jako możliwe lub nieuchronne.

**Wzorzec B — Eskalacja → konflikt → dokumentowanie po fakcie**
Sekwencja: ciche działanie → ujawnienie → retrospektywne tworzenie dokumentacji.
Sygnał: dokumenty datowane wstecz lub zawierające wiedzę o przyszłych faktach.

**Wzorzec C — Izolacja świadka / strony**
Działania ograniczające dostęp do informacji, dokumentów lub osób.
Sprawdź: czy zmieniono dostępy, usunięto dane, ograniczono komunikację
w czasie bliskim sporowi.

**Wzorzec D — Normalizacja → wyjątek**
Długi wzorzec standardowych działań, a następnie nagła zmiana procedury
przy kluczowym zdarzeniu. Sygnał: jeden wyjątek w serii jednorodnych aktów.

**Wzorzec E — Reakcja na wiedzę o postępowaniu**
Zmiana zachowania strony po tym, gdy dowiedziała się o możliwości
postępowania (zmiana dokumentacji, pism, komunikacji).

### Format karty behawioralnej

```text
[BEH-001]
Wzorzec: A / B / C / D / E / inny
Opis wzorca w sprawie:
Chronologia zachowań (z datami i źródłami):
  — [data]: [działanie]: [DOC-ID]
  — [data]: [działanie]: [DOC-ID]
Punkt przełomowy:
Odchylenie od normy:
Możliwe wyjaśnienie neutralne:
[H-ŚLEDCZA] Hipoteza zamiaru lub działania zaplanowanego:
Dowody potwierdzające:
Dowody obalające:
Pytania do strony / świadka wynikające z wzorca:
```

---

## 6.5 HUMINT — Analiza sieci relacji i interesów

### Cel
Zbudować mapę relacji, interesów i przepływów informacji między podmiotami.
HUMINT (Human Intelligence) stosowany w analizie dokumentów koncentruje się
na identyfikacji nieformalnych powiązań, które nie wynikają wprost z treści pism.

### Mapa podmiotów

```text
[HUM-001]
Podmiot centralny:
Podmioty powiązane:
  — [podmiot]: [typ relacji: formalna / nieformalna / ukryta]:
    [kierunek wpływu: → / ← / ↔]:
    [źródło wiedzy o relacji]:
    [siła relacji: silna / umiarkowana / słaba]
Powiązania nieujawnione wprost w dokumentach:
  Sygnał sugerujący powiązanie:
  Weryfikacja możliwa przez:
Przepływ informacji:
  Kto wiedział co i kiedy:
  Kto nie powinien wiedzieć, a wiedział:
Punkty kontroli informacji:
[H-ŚLEDCZA] Hipoteza o ukrytej relacji lub interesie:
```

### Analiza lojalnościowa świadków

```text
[LOJ-001]
Świadek:
Relacja z powodem:
Relacja z pozwanym:
Interes w sprawie:
Ryzyko zeznania prawdziwego dla świadka:
Ryzyko zeznania fałszywego dla świadka:
Ocena potencjalnej stronniczości: wysoka / średnia / niska
Sygnały stronniczości w dokumentach:
```

---

## 6.6 OSINT — Ślady zewnętrzne i weryfikacja faktów

### Cel
Wskazać, jakie informacje zewnętrzne (publicznie dostępne) mogą potwierdzić,
obalić lub uzupełnić materiał dowodowy sprawy.

### Kategorie OSINT do sprawdzenia

**A. Rejestry publiczne**
- KRS / CEIDG: podmiot, struktura, historia zmian, pełnomocnicy;
- KW: własność, obciążenia, hipoteki;
- ZUS / GUS: zatrudnienie, działalność;
- rejestr dłużników: BIG, KRD, ERIF;
- rejestr postępowań sądowych: Portal Orzeczeń, Krajowy Rejestr Zadłużonych.

**B. Ślady cyfrowe**
- metadane dokumentów (autor, data utworzenia, modyfikacje);
- nagłówki e-mail (serwer, czas, trasa dostarczenia);
- logi dostępu do systemów;
- historia wersji dokumentów (track changes, revisions);
- geolokalizacja (EXIF w zdjęciach, dane GPS).

**C. Weryfikacja faktów zewnętrznych**
- ogłoszenia, przetargi, postępowania publiczne;
- media i prasa (publikacje, wywiady, oświadczenia);
- postępowania sądowe i administracyjne równoległe.

### Format karty OSINT

```text
[OSINT-001]
Podmiot / fakt do weryfikacji:
Kategoria: rejestr / cyfrowy / media / inne
Źródło do sprawdzenia:
Informacja uzyskana:
Zgodność z materiałem sprawy: spójna / sprzeczna / uzupełniająca
[H-ŚLEDCZA] Hipoteza wynikająca z OSINT:
Jak wykorzystać procesowo:
```

---

## 6.7 Hermeneutyka prawnicza tekstu

### Cel
Odkryć co autor pisma faktycznie komunikuje, czego unika, jakich założeń
wymaga jego interpretacja i gdzie rozmywa odpowiedzialność.

Analizuj:
- kto mówi i do kogo;
- jaki jest cel pisma (deklarowany vs rzeczywisty);
- co jest nazwane wprost, co rozmyte, co pominięte;
- jakie słowa są nacechowane emocjonalnie lub wartościująco;
- czy język opisuje fakty czy sugeruje winę;
- czy pismo miesza ocenę z faktem;
- czy autor dystansuje się od działań stroną bierną.

### Format karty hermeneutycznej

```text
[HERM-001]
Fragment (cytat dosłowny):
Źródło:
Deklarowane znaczenie:
Możliwe znaczenie procesowe:
Ukryte założenie wymagane przez tekst:
Słowa nacechowane (lista):
Technika rozmywania odpowiedzialności (jeśli jest):
Ryzyko manipulacji: niskie / średnie / wysokie
Jak zweryfikować:
```

---

## 6.8 Detekcja technik manipulacyjnych

Oznacz każdą technikę, jeśli występuje, z cytatem i źródłem:

| Kod | Technika | Opis operacyjny |
|-----|----------|----------------|
| MAN-01 | Insynuacja bez faktu | Zarzut bez dowodu, sformułowany tak, by brzmiał jak fakt |
| MAN-02 | Sugestia winy przez dobór słów | Nacechowane przymiotniki/czasowniki zastępujące neutralny opis |
| MAN-03 | Rozszerzenie zarzutu poza dowody | Twierdzenie przekracza zakres dostarczonego materiału |
| MAN-04 | Odwrócenie ciężaru dowodu | Wymaga od drugiej strony dowodzenia nieistnienia faktu |
| MAN-05 | Cherry-picking | Selektywne cytowanie z pominięciem kontekstu |
| MAN-06 | Przemilczenie chronologii | Pomijanie dat / sekwencji niekorzystnych dla narracji |
| MAN-07 | Fałszywa alternatywa | „Albo X, albo Y" przy istnieniu Z |
| MAN-08 | Argument ad personam | Atak na osobę zamiast na argument |
| MAN-09 | Zasłona proceduralna | Wnioski formalne zamiast merytorycznej odpowiedzi |
| MAN-10 | Relatywizacja | Umniejszanie poważnego faktu przez porównanie z gorszym przykładem |
| MAN-11 | Eskalacja retoryczna | Nasilanie języka bez nasilenia faktów |
| MAN-12 | DARVO | Deny → Attack → Reverse Victim and Offender — klasyczny wzorzec odwrócenia roli |
| MAN-13 | Gaslighting dokumentacyjny | Kwestionowanie istnienia faktów udokumentowanych |
| MAN-14 | Zasłona ekspertyzy | Powołanie na opinię niemożliwą do weryfikacji |
| MAN-15 | Zmiana definicji | Niezauważalna zmiana znaczenia pojęcia w toku pisma |

### Format karty manipulacji

```text
[MAN-001]
Technika: (kod z tabeli)
Cytat dosłowny:
Źródło:
Opis w kontekście sprawy:
Jak zdemaskować na rozprawie:
Jak unikać tego zarzutu w swoich pismach:
```

---

## 6.9 Analiza śledcza zdarzenia (5W1H+)

Dla każdego zdarzenia krytycznego zastosuj rozszerzony model 5W1H:

```text
[ZDARZ-001]
Zdarzenie:
KTO działał: (wszyscy możliwi sprawcy / aktorzy)
CO dokładnie: (czynność, jej zakres, skutek)
KIEDY: (data, godzina, sekwencja; brak daty = oznacz)
GDZIE: (miejsce, dostęp, środowisko)
DLACZEGO: (motyw deklarowany vs możliwy rzeczywisty)
JAK: (metoda, narzędzia, procedura)
Z KIM: (współdziałanie, wiedza osób trzecich)
---
KTO MIAŁ MOŻLIWOŚĆ (access + capability):
KTO MIAŁ MOTYW (interes):
KTO MIAŁ KORZYŚĆ (cui bono):
KTO MIAŁ WIEDZĘ (insider knowledge):
---
Jakie ślady powinny istnieć przy tym zdarzeniu:
Jakie ślady dostarczono:
Jakich śladów brakuje i dlaczego powinny być:
---
Hipoteza A (wersja strony):
  Fakty wspierające:
  Fakty obalające:
Hipoteza B (wersja alternatywna):
  Fakty wspierające:
  Fakty obalające:
Hipoteza C (najniekorzystniejsza dla użytkownika):
  Fakty wspierające:
  Jak neutralizować:
---
Fakty rozstrzygające między hipotezami:
[H-ŚLEDCZA] Preferowana hipoteza i uzasadnienie:
```

---

## 6.10 Analiza zamiaru i modus operandi

### Cel
Ocenić, czy działania podmiotu wskazują na zamiar (dolus directus / ewentualis)
lub wzorzec operacyjny możliwy do przewidzenia w przyszłości.

**Reguła:** nigdy nie stwierdzaj zamiaru bezpośrednio. Opisuj wzorzec faktów.
Ocena zamiaru należy do sądu.

### Elementy analizy modus operandi

```text
[MO-001]
Podmiot:
Powtarzające się działania (lista z datami i źródłami):
Charakterystyczna metoda działania:
Typowy cel działania:
Typowy moment działania (np. przed terminem / po konflikcie):
Typowy środek (e-mail / pismo / ustna komunikacja / brak komunikacji):
Ofiary / adresaci działań — czy powtarzają się?
Analogia do wcześniejszych zdarzeń w aktach:
[H-ŚLEDCZA] Wniosek o wzorcu MO:
Znaczenie procesowe (np. wskazuje premedytację / kontynuację / złą wiarę):
Jak wykorzystać: w piśmie / na rozprawie / we wniosku dowodowym
```

---

## 6.11 Lista pytań śledczych

Na końcu M6 wygeneruj skonsolidowaną listę:

```text
PYTANIA DO DOKUMENTÓW (co zażądać / co zabezpieczyć):

PYTANIA DO STRONY (na rozprawie / w piśmie):

PYTANIA DO ŚWIADKA (wynikające z analizy wiarygodności i sieci relacji):

PYTANIA DO BIEGŁEGO (metadane / grafoanaliza / opinia techniczna):

DOKUMENTY DO ŻĄDANIA (art. 248 KPC / wniosek dowodowy):

METADANE DO ZABEZPIECZENIA (cyfrowe ślady, logi, EXIF):

REJESTRY PUBLICZNE DO SPRAWDZENIA (KRS, KW, KRZ, Portal Orzeczeń):

DZIAŁANIA OSINT DO WYKONANIA:

ORGANY / INSTYTUCJE DO SPRAWDZENIA LUB ZAWIADOMIENIA:

HIPOTEZY WYMAGAJĄCE DALSZEJ WERYFIKACJI:
```
