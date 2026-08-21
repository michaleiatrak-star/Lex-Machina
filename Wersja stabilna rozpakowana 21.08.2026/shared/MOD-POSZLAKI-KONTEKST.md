# MOD-POSZLAKI-KONTEKST — Eksploracja kontekstu, poszlak i narracji procesowej

> **Plik kanoniczny:** `shared/MOD-POSZLAKI-KONTEKST.md`
> **Wersja:** 1.0.0 (2026-06-23)
> **Status:** PRODUKCJA
> **Pozycja w pipeline:** W1.2d — po MOD-MACIERZ-DOWOD-TEZA, przed W1.3
> **Wywołanie:** pisma-procesowe-v3 ZAWSZE gdy ≥1 dokument w materiale dowodowym
> **Charakter:** UNIWERSALNY — działa w każdej sprawie, niezależnie od dziedziny

---

## ZASADA FUNDAMENTALNA

> Każdy dokument zawiera trzy warstwy:
>
> **Warstwa 1 — FAKTY:** co dokument stwierdza wprost (data, kwota, nazwisko, czynność)
> **Warstwa 2 — KONTEKST:** co dokument mówi o okolicznościach, relacjach i schematach
> **Warstwa 3 — POSZLAKI:** co z dokumentu można wywnioskować o faktach nieudowodnionych wprost
>
> System domyślnie wydobywa Warstwę 1. Ten moduł wymusza wydobycie Warstwy 2 i 3.
> Fakty "nieistotne" na poziomie Warstwy 1 mogą być kluczowe na Warstwach 2–3.

---

## KROK PK0 — SKAN MATERIAŁU (zawsze pierwszy)

```
Dla KAŻDEGO dokumentu w materiale — bez względu na typ — zadaj trzy pytania:

Q1: CO JEST TUTAJ OCZYWISTE? (fakty Warstwy 1 — już znane z D1–D3 MOD-DOWODY)

Q2: CO TO MÓWI O KONTEKŚCIE?
  → Kto z kim komunikował i w jakim tonie?
  → Jaki był schemat działania (rutyna, procedura, wyjątek)?
  → Czy coś jest nieobecne co powinno być (brak protokołu, brak podpisu, brak daty)?
  → Czy forma/format odbiega od standardu (błędne KRS, inny papier firmowy)?

Q3: CO Z TEGO WYNIKA POŚREDNIO?
  → Jakie fakty można wywnioskować z tego dokumentu bez stwierdzania ich wprost?
  → Co ten dokument wyklucza?
  → Co musiałoby być prawdą, żeby ten dokument miał sens?

Zapisz wyniki Q2 i Q3 jako kandydatów do łańcuchów poszlak (krok PK2).
```

---

## KROK PK1 — KLASYFIKACJA MATERIAŁÓW POZORNIE NIEISTOTNYCH

```
Przeglądaj materiał dowodowy i SZUKAJ AKTYWNIE elementów pomijanych
przy standardowej analizie. Dla każdego z poniższych typów:

TYP P1 — ELEMENTY IDENTYFIKACYJNE (numery, daty, dane osobowe):
  → Numery seryjne dokumentów, numeracja wewnętrzna, numery referencyjne
  → Dlaczego ważne: ciągłość numeracji ujawnia ciągłość operacyjną
  → Przykłady: numer kadry, numer wniosku, numer faktury z sekwencją
  → Co sprawdzić: czy numeracja jest ciągła? czy reset po dacie spornej?

TYP P2 — METADANE CZASOWE (godziny, dni tygodnia, sekwencja):
  → Godzina wysłania wiadomości, data stempla, kolejność czynności
  → Dlaczego ważne: rytm/rutyna działania = dowód regularności; godziny
    wysyłania po godzinach pracy = praca nieujęta w ewidencji
  → Co sprawdzić: czy wiadomości wysyłane są w weekendy/noce? czy
    czynność nastąpiła przed/po rzekomym zakończeniu stosunku?

TYP P3 — PUSTE POLA / BRAKI (czego nie ma w dokumencie):
  → Brakujące podpisy, brakujące daty, puste rubryki, brak pieczątki
  → Dlaczego ważne: brak formalności = nieuwaga lub celowość; brak
    protokołu przejęcia = brak rzeczywistego przejęcia
  → Co sprawdzić: czy brak jest standardowy czy wyjątkowy dla tego typu
    dokumentu?

TYP P4 — SPRZECZNOŚCI WEWNĘTRZNE W JEDNYM DOKUMENCIE:
  → KRS w nagłówku ≠ KRS w treści; nazwa podmiotu ≠ NIP; data ≠ treść
  → Dlaczego ważne: błąd systemowy ujawnia, że autor kopiował z wzorca
    z innego podmiotu = dokumenty tworzone przez jeden podmiot
  → Co sprawdzić: powtarzający się schemat błędu? (wzorzec systemowy)

TYP P5 — ELEMENTY RELACYJNE (kto do kogo, w jakiej roli):
  → Adresaci CC/BCC w mailach, uczestniczący w WhatsApp, podpisani obok
  → Dlaczego ważne: ujawniają faktyczną strukturę organizacyjną
    niezależnie od formalnych stanowisk
  → Co sprawdzić: czy ta sama osoba jest w CC/uczestniczy mimo braku
    formalnego upoważnienia?

TYP P6 — ELEMENTY TREŚCIOWE POZORNIE RUTYNOWE:
  → Pozdrowienia na końcu, żarty, pytania prywatne w korespondencji służbowej
  → Dlaczego ważne: ton korespondencji ujawnia rzeczywisty charakter relacji
    (zaufanie = długotrwała współpraca; oficjalność = nowe kontakty)
  → Co sprawdzić: czy ton przed i po dacie spornej jest identyczny?

TYP P7 — WZMIANKOWANE OSOBY TRZECIE (nienazwane w petitum):
  → Osoby pojawiające się w korespondencji, ale niebędące stroną
  → Dlaczego ważne: mogą być świadkami lub ich wiedza rzutuje na sprawę
  → Co sprawdzić: czy osoba trzecia miała wiedzę o spornym fakcie?

TYP P8 — DANE FINANSOWE BEZ KONTEKSTU:
  → Kwoty w korespondencji, ceny, wartości refundacji, salda
  → Dlaczego ważne: mogą ujawniać schematy (regularność = zobowiązanie;
    kwota = składnik wynagrodzenia lub premia)
  → Co sprawdzić: regularność? powiązanie z datą/zdarzeniem?

TYP P9 — JĘZYK I STYL DOKUMENTU:
  → Język nienatywny, błędy gramatyczne, kopiowane fragmenty
  → Dlaczego ważne: błędy językowe typowe dla danej osoby = atrybucja
    autorstwa; kopiowany fragment = ten sam autor dla różnych dokumentów
  → Co sprawdzić: czy styl jest spójny z deklarowanym autorem?

TYP P10 — OBECNOŚĆ/NIEOBECNOŚĆ W CZASIE (chronologia negatywna):
  → Co NIE wydarzyło się w kluczowym momencie?
  → Dlaczego ważne: milczenie / brak działania może być dowodem
    (brak sprzeciwu = akceptacja; brak odpowiedzi = świadome ignorowanie)
  → Co sprawdzić: czy brak działania jest wyjątkiem od reguły?
```

---

## KROK PK2 — BUDOWA ŁAŃCUCHÓW POSZLAK

```
⛔ ZASADA: Poszlaka samodzielnie ≠ dowód. Łańcuch ≥3 poszlak = dowód pośredni.
  Łańcuch poszlak może być SILNIEJSZY niż pojedynczy dowód bezpośredni,
  bo przeciwnik musi obalić każde ogniwo, nie tylko jedno twierdzenie.

FORMAT ŁAŃCUCHA:

ŁAŃCUCH [L-X]: [TEZA POŚREDNIA]

  Poszlaka 1: [fakt z Warstwy 2/3] — źródło: [dokument, str./data]
  Poszlaka 2: [fakt z Warstwy 2/3] — źródło: [dokument, str./data]
  Poszlaka 3: [fakt z Warstwy 2/3] — źródło: [dokument, str./data]
  [+ kolejne jeśli dostępne]

  Łączny wniosek: [co wynika ze wszystkich poszlak razem]
  Alternatywne wyjaśnienie: [czy istnieje inne rozsądne wytłumaczenie?]
  Siła łańcucha: ★★ (2 poszlaki, niskie) | ★★★ (3+, średnie) | ★★★★ (5+, wysokie)
  Odporna na atak: TAK/NIE — [jeśli NIE: wskaż słabe ogniwo]

PRZYKŁADY BUDOWANIA ŁAŃCUCHÓW (uniwersalne, nie tylko pracownicze):

  ŁAŃCUCH CIĄGŁOŚCI (każda sprawa z datą sporną):
    P1: Dokument A sprzed daty spornej zawiera element X
    P2: Dokument B po dacie spornej zawiera identyczny element X
    P3: Nikt nie udokumentował zmiany elementu X
    → Teza: element X nie zmienił się, czyli ciągłość

  ŁAŃCUCH WIEDZY (świadomość strony):
    P1: Informacja I była widoczna w dokumencie D (data A)
    P2: Strona miała dostęp do dokumentu D (potwierdzenie)
    P3: Strona podjęła działanie Y 3 dni po dacie A
    → Teza: Strona wiedziała o I gdy podejmowała działanie Y

  ŁAŃCUCH RUTYNY (regularność = zobowiązanie):
    P1: Czynność C wykonywano co [okres] przez [czas]
    P2: Czynność C jest odnotowana w [N] dokumentach bez wyjątków
    P3: Jedynym wyjątkiem jest data po zdarzeniu spornym
    → Teza: zaprzestanie C wynika ze zdarzenia spornego, nie z woli stron

  ŁAŃCUCH AUTORSTWA (kto faktycznie działał):
    P1: Dokument X zawiera styl/błąd/format charakterystyczny dla osoby A
    P2: Dokument Y z innego okresu zawiera ten sam styl/błąd/format
    P3: Osoba A twierdzi, że Y napisała osoba B
    → Teza: A jest autorem obu dokumentów lub przynajmniej wzorca

  ŁAŃCUCH BRAKU (czego nie zrobiono = co to znaczy):
    P1: Standard w tego typu sprawie wymaga czynności Z
    P2: Czynność Z nie jest odnotowana w żadnym dokumencie
    P3: Strona deklaruje, że czynność Z wykonała
    → Teza: czynność Z nie miała miejsca lub miała wady formalne
```

---

## KROK PK3 — TABELA GRANICZNA (zdarzenia po obu stronach daty spornej)

```
⚠️ AKTYWUJ gdy: sprawa ma jedną kluczową datę sporną (rozwiązanie umowy,
  przejście zakładu, wypadek, przekroczenie terminu itp.)

Dla KAŻDEGO dokumentu z materiału: ustal jego pozycję względem daty spornej D.

| Data dokumentu | Treść / czynność | Podmiot/osoba | Strona daty D | Wartość poszlakowa |
|---|---|---|---|---|
| [data] | [co] | [kto] | PRZED / W DNIU / PO | [co poszlakuje] |

Po wypełnieniu tabeli:
  → Szukaj dokumentów PO dacie spornej, które powtarzają schemat sprzed D
    (te same osoby, te same czynności, ten sam format) → łańcuch ciągłości
  → Szukaj dokumentów PRZED datą sporną, które zapowiadają zdarzenie
    (wcześniejsze ustalenia, maile o planach) → łańcuch wiedzy/planowania
  → Szukaj LUKI (brak dokumentów w kluczowym oknie) → łańcuch braku

ZASADA JEDNEGO DNIA:
  Jeśli ostatni dokument podmiotu A i pierwszy dokument podmiotu B
  dzieli ≤1 dzień — automatycznie flaguj jako CIĄGŁOŚĆ-BEZSPORNA.
  Format: "[data ostatnia A] → [data pierwsza B] = [liczba dni przerwy]"
```

---

## KROK PK4 — WALORY WIELOFUNKCYJNE DOWODÓW

```
⛔ ZASADA: jeden dowód może i powinien obsługiwać wiele tez.
  Nie powielaj wniosku dowodowego — zamiast tego wylistuj wszystkie tezy
  obsługiwane przez ten dowód w jednym miejscu.

Dla każdego dowodu z macierzy D×T (klasa W — wielofunkcyjny):

DOWÓD: [nazwa/opis]
  Teza T1: [co wykazuje dla tezy 1]
  Teza T2: [co wykazuje dla tezy 2]
  Teza T3: [co wykazuje dla tezy 3]
  Szczególny walor: [jeśli dowód pochodzi od strony przeciwnej → "przyznanie"]

ZASADA PRZYZNANIA:
  Jeśli dowód pochodzi od strony przeciwnej (złożony przez nią do akt,
  wytworzony przez nią, podpisany przez jej organ):
  → ZAWSZE eksponuj: "Sama strona pozwana / sam pracodawca przyznał(a), że..."
  → To walor procesowy klasy A — przeciwnik nie może kwestionować własnych dokumentów
  → W piśmie: użyj tego jako osobnego akapitu, nie tylko wzmianki w nawiasie

ZASADA ORGANU:
  Jeśli dokument pochodzi od osoby/organu uprawnionego do działania
  za stronę procesową z mocy prawa (zarząd spółki, pełnomocnik z umocowania):
  → Kwalifikuj jako "akt organu" / "czynność organu", nie tylko "wiadomość"
  → Eksponuj umocowanie prawne: "osoba uprawniona do działania z mocy [przepis]"
  → To podwyższa walor dowodu o jeden poziom w hierarchii D1
```

---

## KROK PK5 — ANTYCYPACJA SYSTEMOWA (nie tylko pracownicza)

```
⚛️ ZASADA UNIVERSALNA: dla KAŻDEJ tezy procesowej buduj kontrargument
  z perspektywy strony przeciwnej, ZANIM ona go podniesie.

  Etap A — Identyfikacja: "Co może odpowiedzieć strona X na tę tezę?"
  Etap B — Obalenie: "Jakie dowody/przepisy obalają ten kontrargument?"
  Etap C — Wbudowanie: wpleć antycypację do uzasadnienia przed repliką

FORMAT:
  [ANTYCYPACJA] Strona [X] może podnieść, że [zarzut].
  Argument ten jest chybiony, ponieważ:
  — [fakt z materiału + źródło] wyklucza [zarzut],
  — [przepis/orzeczenie] stanowi, że [kontrargument prawny],
  — [łańcuch poszlak L-X] wykazuje [teza pośrednia obalająca zarzut].

TRIGGERY AKTYWACJI:
  → Każda teza bez dowodu bezpośredniego (tylko poszlaki) → obowiązkowo antycypuj
  → Każde roszczenie pieniężne powyżej 10 000 zł → antycypuj zarzut wygórowania
  → Każde ustalenie stosunku prawnego → antycypuj zarzut braku interesu prawnego
  → Każde roszczenie z terminem → antycypuj zarzut przedawnienia/prekluzji
  → Każda zmiana podmiotowa → antycypuj zarzut braku legitymacji procesowej
```

---

## KROK PK6 — ROSZCZENIE ALTERNATYWNE

```
Po wyborze ścieżki prawnej głównej S1 w MOD-STRATEGIA-WYBOR:

SPRAWDŹ: czy istnieje ścieżka S2 z INNĄ podstawą prawną → TEN SAM skutek?

  TAK → wpleć S2 jako "na wypadek nieuwzględnienia S1" w osobnym akapicie
  Format: "Niezależnie od powyższego, nawet gdyby Sąd nie podzielił
  argumentacji opartej na [S1], powód wskazuje, że [S2] prowadzi do
  identycznego skutku, albowiem [3-4 zdania podstawy S2 + przepis]."

  WERYFIKACJA S1/S2 pod kątem sprzeczności:
    □ S2 nie może przeczyć S1 → jeśli przeczy: wybierz mocniejszą, porzuć słabszą
    □ S2 nie może osłabiać S1 przez implikację → sprawdź logiczną spójność
    □ S2 musi mieć własną, odrębną podstawę prawną (inny przepis)

  ZASADA HIERARCHII: S1 = argumentacja główna (pełna); S2 = wariant ewentualny
  (skrócony, 1 akapit). Nie odwracaj kolejności.
```

---

## KROK PK7 — OUTPUT: ZASILENIE W1.3

```
Po wykonaniu PK0–PK6, dostarcz do W1.3:

[A] REJESTR ŁAŃCUCHÓW POSZLAK:
  Lista wszystkich łańcuchów L-X z tezami pośrednimi i siłą.
  Wskaż które łańcuchy wchodzą do uzasadnienia pisma (≥★★★).

[B] TABELA GRANICZNA:
  Gotowa do wklejenia do sekcji stanu faktycznego lub dowodowej.
  Format: dokument | data | podmiot | wartość | strona daty D.

[C] MAPA WALORÓW WIELOFUNKCYJNYCH:
  Lista dowodów klasy W z przypisanymi tezami.
  Wskaż dowody z walorem PRZYZNANIA i ORGANU (priorytet eksponowania).

[D] LISTA ANTYCYPACJI:
  Dla każdej tezy: przewidywany zarzut + gotowy kontrargument.
  Wskaż które antycypacje wchodzą wprost do uzasadnienia pisma.

[E] ROSZCZENIE ALTERNATYWNE:
  Gotowy akapit S2 (jeśli zidentyfikowano) lub notatka "brak S2".
```

---

## WARUNKI AKTYWACJI

```
ZAWSZE aktywuj gdy:
  □ ≥1 dokument w materiale dowodowym (sprawdź wszystkie warstwy)
  □ Sprawa ma datę sporną (tabela graniczna PK3 — obowiązkowa)
  □ ≥2 tezy procesowe (mapa walorów PK4 — obowiązkowa)

SZCZEGÓLNIE ważny gdy:
  □ Materiał zawiera dokumenty "administracyjne" / operacyjne (arkusze,
    listy, zestawienia) → często Warstwa 2/3 ważniejsza niż Warstwa 1
  □ Brak dowodów bezpośrednich dla kluczowej tezy → łańcuch poszlak L-X
  □ Strona przeciwna złożyła dokumenty do akt → szukaj waloru PRZYZNANIA
  □ Sprawa wielopodmiotowa → tabela graniczna PK3 i P4 ciągłości

NIE aktywuj (ograniczone wywołanie) gdy:
  □ Sprawa prosta z jedną tezą i jednym dowodem bezpośrednim (krok PK0 wystarczy)
  □ Pismo proste (pisma-proste-v2) — zamiast tego zastosuj skrócony PK0+PK4
```

---

## INTEGRACJA Z PIPELINE PISMA PROCESOWE-V3

```
POZYCJA: W1.2d — po MOD-MACIERZ-DOWOD-TEZA, przed W1.3

ZASILANIE:
  ← MOD-MACIERZ-DOWOD-TEZA dostarcza: macierz D×T, klasy K/R/W, luki
  ← MOD-PRACODAWCA-RZECZYWISTY (jeśli aktywny): kryteria PR1-PR8
  → W1.3 otrzymuje: łańcuchy L-X, tabela graniczna, mapa walorów, antycypacje

ZASADA JEDEN MODUŁ NA DOWÓD:
  Ten moduł NIE duplikuje analizatora-dowodow-v3.
  Gdy: ≥10 dokumentów lub sprzeczności dowodowe → deleguj do analizatora.
  Ten moduł: wydobywa Warstwy 2/3 na potrzeby pisma procesowego.

STOP PO PK7:
  Wyświetl rejestr [A]–[E] jako CHECKPOINT PK.
  Czekaj na zatwierdzenie przed W1.3.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-23) — Pierwsza wersja. Moduł uniwersalny.
Przyczyna: analiza porównawcza pisma generowanego (AI) vs pisma poprawionego
przez użytkownika w sprawie VII P 94/25 — wersja poprawiona zawierała:
(1) tabele graniczne HP→HPG z konkretnymi datami i kandydatami,
(2) walory procesowe 1/2/3 dla osobistego aktu Prezesa,
(3) antycypację zarzutów w 4 miejscach uzasadnienia,
(4) ścieżkę alternatywną art. 23¹ KP + art. 25¹ §3 KP,
(5) walor "przyznania" z dokumentów złożonych przez pozwaną.
System wydobywał tylko Warstwę 1. Ten moduł wymusza Warstwy 2 i 3.
Charakter: UNIWERSALNY — nie ograniczony do spraw pracowniczych.
```
