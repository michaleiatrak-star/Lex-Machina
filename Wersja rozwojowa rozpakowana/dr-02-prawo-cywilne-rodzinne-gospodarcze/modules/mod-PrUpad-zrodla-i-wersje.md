# Prawo upadłościowe — pełny tekst, wersje i nawigacja

**Zakres:** cała ustawa z 28 lutego 2003 r. — Prawo upadłościowe.
**Poziom:** pełny urzędowy tekst źródłowy; komentarze i procedury mają własne,
oddzielne pokrycie. Nie deklaruj `FULL` komentarza na podstawie dostępności tekstu.
**Standard:** `shared/MODULE-STANDARD-POLISH-LAW.md` (import 13 sekcji),
`shared/PRAWO-HARDGATE.md`, `shared/TEMPORAL-LAW-CHECK.md`.

## Metryka i źródła

✅ [VER] RZĄD 1, odczyt 2026-10-04:
[ELI DU/2026/913](https://api.sejm.gov.pl/eli/acts/DU/2026/913),
[PDF tekstu jednolitego](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf),
[relacje aktu pierwotnego](https://api.sejm.gov.pl/eli/acts/DU/2003/535/references).
Stan prawny obwieszczenia: 10.06.2026; publikacja: 07.07.2026.
Obwieszczenie uwzględnia nowelizacje 2025/1085, 2025/1170, 2025/1172,
2026/331 i 2026/340; zachowano jego strony w pełnym PDF.

Po tym t.j. w relacjach ELI odnaleziono 2026/1206. Jej art. 7 zmienia
art. 452 ust. 1 i 456 ust. 1 PrUp; na podstawie art. 57 zmiana wchodzi
11.01.2027. Nie stosuj jej przedwcześnie. Tekst:
[Dz.U. 2026 poz. 1206, art. 7 i 57](https://api.sejm.gov.pl/eli/acts/DU/2026/1206/text.pdf).
Lista odzwierciedla odczyt 04.10.2026, nie przyszłe zmiany.

Pliki źródłowe, hashe, daty oraz lista nowelizacji:
`references/prup/metadata.json` i `references/prup/sources/`.
Rejestr pokrycia jednostek: `references/prup/coverage.json`.
Mapa struktury: `references/prup/struktura.md`.

## Odczyt konkretnego przepisu

Uruchom z katalogu tego skilla, podstawiając rzeczywistą ścieżkę instalacji:

```sh
python3 scripts/prup.py article 240 --verify-online
python3 scripts/prup.py article '491^14' --verify-online
python3 scripts/prup.py search 'rachunku bankowego'
python3 scripts/prup.py summary
```

Czytnik zwraca dokładny wycinek ekstrakcji, identyfikator, stronę PDF i metrykę.
Obsługuje indeksy górne: `491^14`, `491[14]`, `491¹⁴`.
Ekstrakcja zachowuje przypisy i nagłówki; przy cytacie otwórz wskazaną stronę PDF.
Wyszukiwanie jest dosłowne, bez fleksji i semantyki; brak trafienia nie oznacza
braku regulacji. Czytaj też sąsiednie jednostki i odesłania.

`--verify-online` porównuje PDF oraz relacje o zmianach, t.j. i orzeczeniach TK
z aktualnym ELI. Zmiana lub awaria przerywa odczyt zamiast oznaczać stary tekst
jako aktualny. Gdy host nie uruchamia Pythona, odczytaj bezpośrednio
`references/prup/sources/prup.pdf` i oficjalne endpointy przez narzędzia hosta.
Odczyt offline jest jawnie oznaczony jako snapshot; nie spełnia fresh gate.

## Wybór wersji dla sprawy

1. Zapisz daty wniosku, ogłoszenia upadłości, obwieszczeń, czynności,
   powstania wierzytelności i doręczeń; wskaż rolę każdej daty.
2. Odczytaj treść przepisu i aktualne relacje ELI. Data t.j. nie jest datą
   wejścia w życie całej ustawy ani początkiem stosowania każdego przepisu.
3. Sprawdź przepisy przejściowe właściwych nowelizacji. Dla starej sprawy
   pobierz właściwy tekst historyczny; paczka nie zawiera wszystkich wersji.
4. Dla art. 452 i 456 po 11.01.2027 odczytaj tekst nowelizacji i dalsze zmiany.
   Czytnik wskazuje zmianę, ale sam nie scala ustaw ani nie wybiera reżimu.
5. Zapisz dowód: URL, data odczytu, artykuł/ustęp, strona, reguła przejściowa
   i uzasadnienie, dlaczego ta wersja ma zastosowanie.

## Pełne pokrycie obu ustaw

Katalog wszystkich jawnych nagłówków obu t.j.: `references/insolvency/katalog.md`.
Sprawdzenie: `python3 scripts/insolvency.py coverage`; odczyt z procedurą:
`python3 scripts/insolvency.py route prup 127`. Pismo dotyczące restrukturyzacji
uruchamia również `mod-PrRestr-zrodla-i-wersje.md` i czytnik `scripts/prrestr.py`.
Nowelizacje, teksty pierwotne i poprzednie t.j. (2024/1428, 2025/614) to wskaźniki ELI + sha256
w `references/insolvency/sources/*.json`; PDF-y pobiera warstwa RAG aplikacji wg
`references/REJESTR-ZRODEL.json`.
Wybór reżimu: `references/insolvency/wersje-i-przepisy-przejsciowe.md`.
Instrukcja dalszej rozbudowy: `references/insolvency/dodawanie-ustawy.md`.

## Routing pracy syndyka

Wszystkie moduły tabeli są w klasie **A / COV-ART** (08.10.2026; `references/insolvency/plan-pokrycia.md`). Nowelizacje ze zmienionymi jednostkami i przepisami przejściowymi: `references/insolvency/wersje-i-przepisy-przejsciowe.md`.

| Zadanie | Moduł |
|---|---|
| Zgłoszenie, braki, zwrot, sprawdzanie, lista, sprzeciw | `mod-PrUpad-wierzytelnosci-235-266.md` |
| Fundusze masy, kategorie, zabezpieczenia, plan podziału | `mod-PrUpad-podzial-335-360.md` |
| Objęcie masy, sprawozdawczość, wynagrodzenie, plan i sprzedaż | `mod-PrUpad-syndyk-likwidacja.md` |
| Konsument: wybór trybu, wyłączenia, projekt planu spłaty | `mod-PrUpad-konsument-workflow.md` |
| Wniosek, niewypłacalność, zabezpieczenie, pre-pack | `mod-PrUpad-wniosek-ogloszenie.md` |
| Masa, umowy, małżeństwo, bezskuteczność, procesy | `mod-PrUpad-skutki-masa-bezskutecznosc.md` |
| Organy, rada i zgromadzenie, KRZ i doręczenia | `mod-PrUpad-organy-procedura.md` |
| Zakończenie, zakaz, karne i przejściowe | `mod-PrUpad-zakonczenie-zakaz-karne.md` |
| Układ w postępowaniu upadłościowym (art. 266a–266f) | `mod-PrUpad-uklad-likwidacja-zakonczenie.md` |
| Międzynarodowe, deweloperzy, po śmierci dłużnika | `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne.md` |
| Banki/SKOK, ubezpieczyciele, obligacje, układ konsumencki | `mod-PrUpad-postepowania-odrebne-426-491-38.md` |
| Pozostały artykuł / wyjątek nieopisany w komentarzu | Odczyt jednostki + odesłań z pełnego źródła, samodzielna analiza |
| Art. 522–523 — kwalifikacja karna | DR-03; tekst w korpusie służy weryfikacji źródłowej |

## Wynik i kontrola jakości

Dla czynności podaj fakty i brakujące dowody, właściwy tryb, podstawę z jednostką
redakcyjną i wersją, organ/adresata, wymagania, termin ze zdarzeniem początkowym,
ryzyka i następny krok. Składniki żądania wiąż z konkretnymi dowodami; nie
zastępuj ustaleń stanem OCR ani samym twierdzeniem strony.

Sprawdź, czy nie pomylono postępowania zwykłego z konsumenckim, kosztów masy
z kategorią wierzytelności, zwrotu formalnego z odmową uznania, planu podziału
z planem spłaty oraz źródła z opracowaniem. Przy potrzebie pisma dołącz
`pisma-procesowe-v3`; przy orzecznictwie `orzeczenia-sadowe-v2` i weryfikację sygnatur.
Żaden rekord indeksu ani test skryptu nie jest samodzielnym potwierdzeniem
poprawności rozstrzygnięcia prawnego.
