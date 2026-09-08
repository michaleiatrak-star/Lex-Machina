# RATE-COMPLETENESS — bramka kompletności szeregu stawek i wskaźników

> **Plik:** `shared/RATE-COMPLETENESS.md`
> **Wersja:** 1.1 (2026-08-27)
> **Status:** KANONICZNY — hard gate, blokuje zamknięcie analizy zawierającej
> odsetki, waloryzację lub inną wielkość zmienną w czasie.
> **Konsumenci:** `prawny-router-v3/references/SELF-CHECK.md`,
> `pisma-procesowe-v3` (W2 — wyliczenia, W3 — walidacja), `pisma-proste-v2`
> (wezwanie do zapłaty), `analiza-sadowa-v6`, `analizator-umow-v1`.
> **Relacja do HARDGATE:** `shared/PRAWO-HARDGATE.md` odpowiada na pytanie
> „czy ta liczba jest zweryfikowana". TEN plik odpowiada na pytanie
> „czy zweryfikowano WSZYSTKIE liczby, których wymaga okres sprawy".

## Powód powstania

Test 5 pilotażu LEX MACHINA. System podał stawkę odsetkową „ryczałtem" —
jedną liczbą dla całego okresu — nie rozdzielając reżimu odsetek ustawowych
za opóźnienie od odsetek w transakcjach handlowych i nie zamykając wszystkich
okresów obowiązujących w objętym sprawą przedziale.

Diagnoza (audyt 2026-08-23): HARDGATE traktuje „stawkę" jako **pojedynczy
obiekt** do zweryfikowania i nie zna pojęcia **szeregu czasowego**. Przepis
weryfikowany poprawnie, wynik i tak błędny — bo pytanie brzmiało nie „ile
wynosi stawka", tylko „ile wynosiła w każdym z siedmiu podokresów od
wymagalności do dziś".

## ZASADA

> ⛔ Odsetki, waloryzacja, wskaźnik inflacji, minimalne wynagrodzenie,
> przeciętne wynagrodzenie, opłata za czynności, rekompensata za koszty
> odzyskiwania należności — to NIE są liczby. To **funkcje czasu**.
> Jedna liczba jest odpowiedzią poprawną wyłącznie wtedy, gdy okres sprawy
> mieści się w całości w jednym podokresie jej obowiązywania — a to trzeba
> wykazać, nie założyć.

## PROCEDURA — RC-1 … RC-6

```
RC-1  USTAL PRZEDZIAŁ. Data początkowa (wymagalność / zdarzenie / doręczenie)
      → data końcowa (analiza, wniesienie pisma, spłata). Zapisz jawnie.

RC-2  ROZDZIEL REŻIMY. Nie mieszaj ich w jednej rubryce — mają różne
      podstawy prawne, różne stawki i różne daty zmian:
        • odsetki ustawowe za opóźnienie (KC)
        • odsetki ustawowe „kapitałowe" (KC — inna wysokość!)
        • odsetki maksymalne (KC — limit umowny)
        • odsetki w transakcjach handlowych (ustawa z 8.03.2013
          o przeciwdziałaniu nadmiernym opóźnieniom) — ZMIENIANE PÓŁROCZNIE,
          niższa stawka WYŁĄCZNIE dla dłużnika publicznego będącego
          podmiotem leczniczym; inni publiczni dłużnicy i prywatne
          podmioty lecznicze należą do pozostałych
        • odsetki podatkowe (Ordynacja podatkowa)
        • odsetki od zaległości ZUS
      ⛔ Wskazanie reżimu wymaga weryfikacji, czy umowa jest transakcją
        handlową w rozumieniu ustawy z 2013 r. — status stron rozstrzyga
        o stawce. Nie zakładaj. Kwalifikacja i tabela źródłowa:
        view dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-transakcje-handlowe-opoznienia.md

RC-3  ZBUDUJ SZEREG. Dla WYBRANEGO reżimu wypisz KAŻDY podokres w przedziale
      z RC-1, w tabeli, bez luk i bez zaokrągleń przedziałów:

      | Od | Do | Stawka | Podstawa zmiany | Status weryfikacji |
      |---|---|---|---|---|
      | RRRR-MM-DD | RRRR-MM-DD | X,XX % | [obwieszczenie/uchwała RPP + Dz.U./M.P.] | ✅/🟡/⚠️ |

      ⛔ Każdy wiersz = OSOBNA weryfikacja wg PRAWO-HARDGATE. Potwierdzenie
        stawki bieżącej NIE potwierdza stawek historycznych.
      ⛔ Wiersze przylegają: „do" jednego = dzień przed „od" następnego.
        Luka w szeregu = błąd, nawet gdy każdy wiersz z osobna jest poprawny.

RC-4  OZNACZ NIEDOMKNIĘTE. Podokres, którego nie zweryfikowano — wpisz do
      tabeli z ⬛ [DO UZUPEŁNIENIA — odczyt źródła], NIE pomijaj wiersza
      i NIE rozciągaj sąsiedniej stawki na jego zakres.
      Uczciwie oznaczona luka zatrzyma się na HYBRID-VALIDATION.
      Rozciągnięta stawka przejdzie jako poprawna i trafi do pisma.

RC-5  ŚWIADCZENIA POBOCZNE. Sprawdź i rozstrzygnij osobno, każde z własnym
      źródłem: rekompensata za koszty odzyskiwania należności (próg zależny
      od wartości świadczenia — trzy progi, nie jeden), odsetki od odsetek
      (dopuszczalność), skapitalizowanie na dzień wniesienia pozwu.

RC-6  BRAMKA ZAMKNIĘCIA. Analizy NIE wolno zamknąć, dopóki wszystkie cztery
      warunki nie są spełnione:
        □ przedział z RC-1 zapisany jawnie
        □ reżim wskazany i uzasadniony statusem stron (RC-2)
        □ szereg z RC-3 pokrywa przedział BEZ LUK
        □ każdy wiersz ma własny znacznik weryfikacji
      Nie wszystkie? → nie podawaj kwoty łącznej. Podaj tabelę z lukami
      i wprost napisz, czego brakuje do wyliczenia.
```

## Reguła kosztowa (rozwiązanie konfliktu z PERMANENT GATE)

`PRAWO-HARDGATE.md` żąda osobnego wywołania narzędzia na każde powołanie
liczby. Przy szeregu trzyletnim to kilkanaście–kilkadziesiąt wywołań, co samo
w sobie tworzy nacisk na skrót — i to jest realna przyczyna, dla której
poprzedni przebieg podał jedną liczbę.

Rozwiązanie: **jedno wywołanie może zamknąć wiele wierszy**, jeżeli źródło
podaje tabelę historyczną stawek jako całość (typowe dla obwieszczeń
i tabel zbiorczych). Wtedy: jedno źródło → jeden znacznik → powielony
w każdym wierszu, który ta tabela obejmuje, z tą samą datą odczytu.
⛔ Czego to NIE usprawiedliwia: przyjęcia stawki dla podokresu, którego
tabela nie obejmuje. Taki podokres to ⬛, nie interpolacja.

## SELF-CHECK (jedna linia do checklisty routera)

```
□ [RATE-COMPLETENESS] Odpowiedź zawiera odsetki/waloryzację/wskaźnik zmienny?
    NIE → OK
    TAK → RC-6 spełniony w całości? NIE → nie podawaj kwoty łącznej,
          pokaż tabelę szeregu z jawnymi ⬛
```
