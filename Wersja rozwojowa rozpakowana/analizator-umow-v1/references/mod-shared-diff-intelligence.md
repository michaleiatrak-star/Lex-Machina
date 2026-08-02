# MODUŁ SHARED-DIFF-INTELLIGENCE — PORÓWNANIE WERSJI UMOWY
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** użytkownik dostarcza DWIE wersje tego samego dokumentu
> (lub jedną wersję + listę proponowanych zmian) i pyta "co się zmieniło" /
> "porównaj wersję A i B" / "jakie są konsekwencje tych poprawek".
>
> **Relacja do istniejących modułów:** `workflows/popraw-fragment.md` obsługuje
> redakcję JEDNEGO fragmentu na żądanie użytkownika (Tryb 4). Ten moduł
> obsługuje inny scenariusz: dokument już zmieniony przez drugą stronę lub
> w toku negocjacji, użytkownik chce zrozumieć SKUTEK różnicy, nie prosi
> o kolejną redakcję. Dotąd nieobsłużone w systemie — nie duplikuje żadnego
> istniejącego workflow.
>
> ⛔ Podlega ZASADZIE MU.4 (`mod-shared-model-umowy.md`) — zakaz podawania
> sfabrykowanych wskaźników liczbowych typu "wzrost ryzyka o 37%". Każdy
> wniosek o konsekwencji zmiany musi być sformułowany jakościowo, z
> odesłaniem do §, i — tam gdzie to możliwe do policzenia z samej treści
> umowy (kwoty, terminy, limity wprost wskazane w tekście) — z konkretną
> kwotą PLN z `mod-shared-economic.md`/`mod-shared-ryzyko-kwant.md`, NIGDY
> z wyliczoną statystyką ryzyka, której nie da się zweryfikować źródłowo.

---

## DIFF.0 WARUNEK WSTĘPNY

```
Wymagane: obie wersje dokumentu dostępne w kontekście (tekst lub upload).
Brak jednej z wersji → nie zgaduj treści brakującej wersji. Poproś o
dostarczenie obu dokumentów, zanim przejdziesz do DIFF.1.
```

Jeśli dokument > 15 stron — wykonaj najpierw MU.1 (tabelę ekstrakcji)
DLA OBU wersji osobno. Diff wykonuje się na poziomie pól tabeli, nie na
surowym tekście — to eliminuje szum z różnic czysto redakcyjnych
(numeracja, formatowanie) niemających skutku prawnego.

---

## DIFF.1 KLASYFIKACJA ZMIAN

Dla każdego pola z tabeli MU.1, gdzie wersja A różni się od wersji B:

```
| Pole / §        | Wersja A        | Wersja B        | Typ zmiany         |
|------------------|-----------------|-----------------|---------------------|
| [np. Odpowiedzialność §7] | [treść/streszczenie A] | [treść/streszczenie B] | DODANO / USUNIĘTO / ZMODYFIKOWANO |

Typ zmiany:
  DODANO       — klauzula nieobecna w A, obecna w B
  USUNIĘTO     — klauzula obecna w A, nieobecna w B
  ZMODYFIKOWANO — obecna w obu, treść różna (wskaż DOKŁADNIE co się zmieniło:
                  kwota / termin / strona zobowiązana / zakres / warunek)
  PRZENIESIONO — ta sama treść, inny numer §  (oznacz, nie licz jako zmianę
                  merytoryczną, chyba że kontekst systematyki wpływa na
                  wykładnię — np. przeniesienie z sekcji "definicje" do
                  "postanowienia końcowe" może zmienić hierarchię interpretacji)
```

---

## DIFF.2 ANALIZA KONSEKWENCJI (jakościowa, nie punktowa)

Dla każdej zmiany sklasyfikowanej jako ZMODYFIKOWANO lub USUNIĘTO, gdzie
zmiana dotyczy klauzuli o znaczeniu prawnym (nie kosmetycznej):

```
§[X] — [krótki opis zmiany]

KONSEKWENCJA DLA STRONY CHRONIONEJ:
  [opisz jakościowo skutek — np. "usunięcie górnego limitu odpowiedzialności
  oznacza, że ekspozycja finansowa strony przestaje być ograniczona do
  wartości umowy i obejmuje pełną szkodę rzeczywistą oraz utracone korzyści
  (art. 361 §2 KC), o ile umowa ich nie wyłącza gdzie indziej"]

POZIOM ISTOTNOŚCI: 🔴 Krytyczna / 🟠 Wysoka / 🟡 Średnia / 🟢 Kosmetyczna
  (ta sama skala co Moduł B.1/D — nie nowa skala dla diffów)

EKSPOZYCJA FINANSOWA (tylko jeśli policzalna wprost z tekstu obu wersji):
  Wersja A: [kwota/mechanizm z §] → Wersja B: [kwota/mechanizm z §]
  → wczytaj mod-shared-ryzyko-kwant.md jeśli wymagana pełna kwantyfikacja PERT

POWIĄZANE KLAUZULE (z grafu MU.2):
  [czy ta zmiana rozrywa zależność z inną klauzulą — np. usunięcie capu w
  §7 unieważnia sens ubezpieczenia OC z limitem w §12]
```

---

## DIFF.3 SYNTEZA — RAPORT DIFF

```
RAPORT PORÓWNANIA WERSJI
Dokument: [nazwa]  |  Wersja A: [data/oznaczenie]  |  Wersja B: [data/oznaczenie]
Strona chroniona: [A/B/neutralna]

## ZMIANY KRYTYCZNE (🔴)
[lista z § i konsekwencją]

## ZMIANY WYSOKIEGO ZNACZENIA (🟠)
[lista]

## ZMIANY ŚREDNIE / KOSMETYCZNE (🟡/🟢)
[lista skrócona — same numery §, bez rozwinięcia]

## BILANS DLA STRONY CHRONIONEJ
[opisowo: czy wersja B jest korzystniejsza/mniej korzystna niż A i dlaczego
— bez łącznego wskaźnika liczbowego, patrz MU.4]

## REKOMENDACJA
[przyjąć B / negocjować konkretne §§ z powrotem do brzmienia A / odrzucić B]
```

Raport ten może zastąpić lub poprzedzać pełny Raport F.1, w zależności od
tego, czy użytkownik chce też pełną analizę merytoryczną wersji B jako
takiej (wtedy → `mod-core-checklist.md` F.1 na wersji B, z tym raportem
jako Załącznikiem "Historia zmian").

---

*Moduł mod-shared-diff-intelligence.md v1.0 (dodany 2026-08-02) — patrz
references/CHANGELOG.md, wpis v1.21. Adresuje lukę wskazaną w analizie
porównawczej (Grok, pkt 9) — dotąd nieobsłużony w systemie scenariusz
porównania dwóch wersji umowy z analizą konsekwencji zmian.*
