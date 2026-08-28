---
module: zwolnienia-grupowe-current-state-COV
version: "1.0"
verified_on: "2026-08-28"
coverage: "B+/COV — pełna struktura obowiązującej ustawy + przepisy przejściowe"
source_policy: "RZĄD 1 ELI / tekst ujednolicony"
---

# Zwolnienia grupowe — current-state COV

## 1. Baza

Ustawa z 13 marca 2003 r. o szczególnych zasadach rozwiązywania z pracownikami
stosunków pracy z przyczyn niedotyczących pracowników.

**T.j.: Dz.U. 2025 poz. 570**, z późniejszymi zmianami. ELI publikuje tekst
ujednolicony opracowany m.in. na podstawie Dz.U. 2025 poz. 570 i 1661.

- https://eli.gov.pl/eli/DU/2025/570/ogl

## 2. Mapa całej obowiązującej regulacji

| Jednostki | Zakres | Routing |
|---|---|---|
| art. 1 | przesłanki stosowania ustawy i progi zwolnienia grupowego | `mod-ustawa-zwolnienia-grupowe.md` |
| art. 2 | konsultacja, zakres informacji, PUP, reprezentacja pracowników | jw. |
| art. 3 | porozumienie / regulamin i zasady postępowania | jw. |
| art. 4 | zawiadomienie PUP i kopia dla reprezentacji pracowników | jw. |
| art. 5 | relacja do KP i szczególnej ochrony; wypowiedzenie warunków | jw. + aktualny KP |
| art. 6 | moment wypowiedzenia i rozwiązania stosunku pracy | jw. |
| art. 7 | upadłość / likwidacja pracodawcy i odesłania do KP | jw. + aktualny KP / PrUp |
| art. 8 | odprawa i jej limit | jw.; kwoty dynamiczne fresh gate |
| art. 9 | pierwszeństwo ponownego zatrudnienia | jw. |
| art. 10 | zwolnienia indywidualne z przyczyn niedotyczących pracownika | jw. |
| art. 11 | wyłączenie pracowników z mianowania | ten indeks + moduł główny |
| art. 12 | subsydiarne stosowanie Kodeksu pracy | ten indeks + aktualny KP |
| art. 13–27 | pominięte w t.j. | przepisy zmieniające — warstwa historyczna |
| art. 28 | przepisy przejściowe | ten indeks; temporal gate |
| art. 29 | utrata mocy poprzedniej ustawy | historyczne |
| art. 30 | wejście w życie | historyczne |

## 3. COV

Cały aktywny rdzeń art. 1–12 oraz końcowa warstwa przejściowa są jawnie
zmapowane. Artykuły 13–27 są w tekście ujednoliconym oznaczone jako pominięte,
więc nie są błędnie traktowane jako luka materialna.

Przed zastosowaniem:
- odczytaj aktualny tekst ujednolicony i akty zmieniające;
- zweryfikuj aktualne przepisy KP, do których ustawa odsyła;
- przelicz limit odprawy z aktualnego minimalnego wynagrodzenia;
- oddziel moment wypowiedzenia od momentu rozwiązania stosunku pracy.

## 4. COV vs FULL

`B+/COV` potwierdza strukturę i użyteczny routing całej ustawy.
Nie stanowi audytu każdego zdania artykuł-po-artykule ani pełnej analizy
orzecznictwa, więc `FULL` nie jest nadawany.

## 5. F-108

F-108/40: **B+/COV**. `FULL`: nieprzyznany.
