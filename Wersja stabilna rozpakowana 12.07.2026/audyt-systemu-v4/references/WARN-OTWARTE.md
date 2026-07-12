# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Plik:** `WARN-OTWARTE.md`
**Opis:** Rejestr WYŁĄCZNIE otwartych flag audytowych (WARN numerowane +
flagi strukturalne bez numeru). Zawiera TYLKO to, co jest jeszcze do
zrobienia — bez narracji historycznej, bez wpisów o zamkniętych flagach.
**Plik siostrzany:** `AUDIT-JOURNAL.md` — dziennik chronologiczny pełnej
historii sesji (otwarcia, zamknięcia, naprawy, wnioski). Zamknięcie flagi
NIE zostaje w tym pliku — trafia wyłącznie do AUDIT-JOURNAL jako część
historii. Ten plik po zamknięciu flagi traci odpowiedni wiersz.

> **Zasada podziału (wprowadzona 2026-07-07, ZASADA 10 w SKILL.md):**
> - Otwarcie nowej flagi → dodaj wiersz TUTAJ + wpis w AUDIT-JOURNAL.md.
> - Zamknięcie flagi → USUŃ wiersz STĄD + odnotuj zamknięcie WYŁĄCZNIE
>   w AUDIT-JOURNAL.md (z pełnym opisem naprawy, jak dotychczas).
> - Ten plik nie rośnie w nieskończoność — to jest "TODO", nie archiwum.
> - Przed odpowiedzią na pytanie "co jest jeszcze otwarte" / "czy wszystkie
>   WARN zamknięte" — czytaj TEN plik, nie grepuj całego AUDIT-JOURNAL.md.

---

## Stan na 2026-07-07 (po sesji zamykającej WARN-12, WARN-24, WARN-28, WARN-29)

**WARN numerowane otwarte: 0.** Wszystkie WARN-1 do WARN-29 zamknięte —
pełna historia w `AUDIT-JOURNAL.md`, wpisy AUDYT-2026-07-07a i 07-07b.

**Flagi strukturalne bez numeru WARN — otwarte:**

| # | Flaga | Skill / dziedzina | Priorytet | Otwarta od | Opis | Wymaga |
|---|---|---|---|---|---|---|
| F-1 | Rolnictwo/żywność/weterynaria — wiersz zbiorczy niejednoznaczny | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | niski | 2026-07-02 | Wiersz w MAPA-AKTOW łączy kilka aktów pod jedną etykietą — nie do rozstrzygnięcia samą weryfikacją numeru Dz.U. | Sesja dedykowana: rozbicie na osobne akty |
| F-2 | Zawody medyczne/prawnicze — błędnie nazwany plik modułu | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | niski | 2026-07-02 | Nazwa pliku modułu nie odpowiada jego rzeczywistej zawartości | Sesja dedykowana: decyzja o przemianowaniu/przebudowie |
| F-3 | Izby lekarskie — brak modułu dedykowanego | dr-10-zdrowie-farmacja-zywnosc-rolnictwo | średni | 2026-07-02 | Ustawa o izbach lekarskich (Dz.U. 2021 poz. 1342 t.j.) skatalogowana, ale odpowiedzialność zawodowa/dyscyplinarna lekarzy (OSL/NSL, art. 53-112) nie ma własnego modułu — sprawdzić czy jest w ogóle omówiona gdziekolwiek w dr-10 | Sesja dedykowana: nowy moduł lub rozszerzenie istniejącego |
| F-4 | Nowelizacja ustawy o przeciwdziałaniu narkomanii — akt nieopublikowany na dzień ostatniej weryfikacji | dr-03-prawo-karne-wykroczenia-egzekucja | niski | 2026-07-04 | Ustawa uchwalona przez Sejm 11.06.2026 (sprawozdanie Komisji Zdrowia), status na 04.07.2026: brak potwierdzenia publikacji w Dz.U. — możliwe oczekiwanie na Senat/podpis Prezydenta/vacatio legis | Sprawdzić w ISAP czy opublikowana (mogła się pojawić po 04.07.2026 — dziś jest 2026-07-07, warto zweryfikować przy najbliższej okazji) |
| F-5 | Ustawa ESAP (Dz.U. 2026 poz. 644) skatalogowana, bez modułu dedykowanego | dr-06-podatki-finanse-publiczne-aml | niski | 2026-07-07 | Omnibus ~17 ustaw sektora finansowego (rachunkowość, KRS, fundusze emerytalne, Prawo bankowe, KSH incydentalnie, oferta publiczna, obrót instrumentami finansowymi, ubezpieczenia, BFG, biegli rewidenci) — niska aktywność tematyczna w typowych sprawach systemu | Moduł dedykowany tylko jeśli sprawy z zakresu rynku kapitałowego/nadzoru finansowego staną się aktywne |
| F-6 | KSH — sprawdzić czy §ESAP i art. 130 (2026.187) uwzględnione w treści modułu | dr-02-prawo-cywilne-rodzinne-gospodarcze | niski (nieblokujące) | 2026-07-07 | Numery Dz.U. potwierdzone i skatalogowane, ale nie zweryfikowano czy treść `mod-KSH-spolki-handlowe` faktycznie odzwierciedla te dwie nowelizacje | Przy najbliższej aktualizacji modułu KSH |
| F-7 | Skille proceduralne (poza przesluchanie-swiadkow) nie sprawdzone pod kątem 4 wzorców z ZASADY 11 | pisma-procesowe-v3, analizator-dowodow-v3, chronologia-sprawy-v1, pisma-proste-v2, przewodnik-prawny-v2 i inne | średni | 2026-07-10 | Po rozszerzeniu zakresu audytu na skille proceduralne (ZASADA 11) i naprawie przesluchanie-swiadkow-v2-min90 (v3.6, 4 bramki), pozostałe skille proceduralne nie zostały jeszcze sprawdzone pod kątem: (a) bramek stosowanych reaktywnie zamiast domyślnie, (b) braku rekonstrukcji tezy dla materiału gotowego, (c) braku systematycznego skanu dokumentów, (d) milczącego przyjmowania ustaleń zamiast jawnego potwierdzenia | Sesja dedykowana, per skill, wg wzorca z AUDYT-2026-07-10 |

**Obserwacje informacyjne (nie są formalnymi flagami, nie blokują, ale warto pamiętać):**

| # | Obserwacja | Skill | Opis |
|---|---|---|---|
| O-1 | Nowelizacja ABW/AW ws. treści terrorystycznych (Dz.U. 2024 poz. 1684) nieopisana w module | dr-13-sluzby-bezpieczenstwo-informacje-niejawne | Uprawnienia Szefa ABW do nakazów usunięcia treści terrorystycznych (implementacja rozp. UE 2021/784) nie są opisane w `mod-ustawa-ABW-AW-CBA-sluzby-specjalne.md`. Odkryte przy okazji naprawy WARN-28/29 (2026-07-07a). Wąska kompetencja, rzadko aktywna w typowej sprawie DR-13. |

---

## Jak korzystać z tego pliku

- **Pytanie "co jest jeszcze otwarte?"** → odpowiedz na podstawie tabel powyżej, nie grepuj AUDIT-JOURNAL.md.
- **Zamykasz flagę F-N?** → usuń jej wiersz z tabeli powyżej, dodaj pełny opis naprawy jako nowy wpis w `AUDIT-JOURNAL.md` (z numerem/kodem flagi w tytule wpisu dla identyfikowalności).
- **Otwierasz nową flagę?** → dodaj wiersz tutaj (kolejny wolny numer F-N lub WARN-N zgodnie z konwencją) ORAZ krótki wpis w AUDIT-JOURNAL.md dokumentujący odkrycie.
- **Numeracja WARN-N vs F-N:** WARN-N zarezerwowane dla flag odkrytych w toku klasycznego trybu audytowego (TRYB DZU, TRYB WARN-CLOSE). F-N dla flag strukturalnych odkrytych przy innych okazjach (audyty kompletności, sesje tematyczne). Oba typy są "otwartymi flagami" w rozumieniu tego rejestru — nie różnicuj ważności po prefiksie, tylko po kolumnie Priorytet.
