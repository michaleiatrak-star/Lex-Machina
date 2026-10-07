# ALIASY-NAZW-AKTOW — nazwy robocze zaakceptowane w rejestrach

> **Plik:** `audyt-systemu-v4/references/ALIASY-NAZW-AKTOW.md`
> **Wersja:** 1.0 (2026-09-10c) — utworzony przy domykaniu F-148(a).
> **Czyta go:** `scripts/audit_tj_inventory.py` (T15). Format jest kontraktem
> maszynowym — patrz „Format".

---

## PO CO ISTNIEJE (F-148a)

Do 2026-09-10c T15 porównywał tytuł z ELI z nazwą lokalną **tylko** dla nazw
zaczynających się od „Kodeks…" i „Prawo…". Każda „Ustawa o…" była poza
automatem — i to była luka, przez którą przeszła **podmiana aktu**: numer
istnieje, jest obwieszczeniem, jest najnowszym t.j. swojego aktu, więc
przechodzi każdą kontrolę, choć lokalnie opisano nim inną ustawę.

Po rozszerzeniu porównania na „Ustawa o / z / -" test wykrył **1 realny błąd**
(`ROUTING-MAP.md:770`: `Dz.U. 2024 poz. 1474` — obwieszczenie **Ministra
Sprawiedliwości** o t.j. **rozporządzenia** — przypisane ustawie
o działaniach antyterrorystycznych; skorygowane na `Dz.U. 2025 poz. 194`)
oraz **DWA realne błędy** i 17 zgłoszeń wynikających ze skrótu nazwy.

Drugi błąd: `dr-08/.../mod-ustawa-zarzadzanie-kryzysowe.md` podawał
`Dz.U. 2024 poz. 1194` jako t.j. ustawy o zarządzaniu kryzysowym — to
obwieszczenie o t.j. ustawy o **dozorze technicznym**. Skorygowane na
`Dz.U. 2026 poz. 574`, z ostrzeżeniem o nowelizacji Dz.U. 2026 poz. 815.

⛔ Ten plik NIE jest listą wyciszeń. Jest listą **rozstrzygnięć**: każdy wpis
oznacza, że człowiek porównał nazwę roboczą z tytułem urzędowym w ELI i uznał,
że opisują ten sam akt. Zgłoszenie spoza tego rejestru pozostaje problemem.

⛔ Wpisanie pozycji tutaj **bez sprawdzenia w ELI** przywraca dokładnie tę
ślepotę, którą F-148(a) zamyka. Kolumna „Sprawdzone" nie może być pusta.

---

## Format (kontrakt dla T15)

`| Dz.U. ROK poz. NR | nazwa robocza z rejestru | tytuł urzędowy (skrót) | Sprawdzone |`

Dopasowanie jest po parze (rok, pozycja) **oraz** nazwie roboczej. Zmiana nazwy
w rejestrze operacyjnym unieważnia alias i sygnał wraca — celowo.

| Dz.U. | Nazwa robocza | Akt wg ELI | Sprawdzone |
|---|---|---|---|
| Dz.U. 2025 poz. 843 | Ustawa o ryczałcie od przychodów ewidencjonowanych | ustawa o zryczałtowanym podatku dochodowym od niektórych przychodów osiąganych przez osoby fizyczne | 2026-09-10c, RZĄD 1 |
| Dz.U. 2025 poz. 843 | Ustawa o ryczałcie od przychodów | jw. | 2026-09-10c, RZĄD 1 |
| Dz.U. 2026 poz. 670 | Ustawa o OOŚ / oceny środowiskowe | ustawa o udostępnianiu informacji o środowisku i jego ochronie, udziale społeczeństwa… | 2026-09-10c, RZĄD 1 |
| Dz.U. 2023 poz. 1587 | Ustawa o odpadach / gospodarka komunalna | ustawa o odpadach | 2026-09-10c, RZĄD 1 |
| Dz.U. 2026 poz. 1195 | Ustawa o zwolnieniach grupowych | ustawa o szczególnych zasadach rozwiązywania z pracownikami stosunków pracy z przyczyn niedotyczących pracowników | 2026-09-16c, RZĄD 1 (t.j. z 4.09.2026; poprzedni t.j. 2025 poz. 570 — wygasły; wiersz naprawiony — podmiana numeru z 10r wkleiła adnotację do komórki numeru i rozbiła kontrakt T15) |
| Dz.U. 2023 poz. 1725 | Ustawa o skardze na przewlekłość postępowania | ustawa o skardze na naruszenie prawa strony do rozpoznania sprawy bez nieuzasadnionej zwłoki | 2026-09-10c, RZĄD 1 |
| Dz.U. 2023 poz. 1725 | Ustawa o skargach na przewlekłość | jw. | 2026-09-10c, RZĄD 1 |
| Dz.U. 2026 poz. 522 | ⭐⭐ Ustawa o rachunkowości z 29.09.1994 | ustawa o rachunkowości | 2026-09-10c, RZĄD 1 |
| Dz.U. 2025 poz. 198 | Ustawa o polityce rozwoju | ustawa o zasadach prowadzenia polityki rozwoju | 2026-09-10c, RZĄD 1 |
| Dz.U. 2025 poz. 1461 | Ustawa o świadczeniach zdrowotnych | ustawa o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych | 2026-09-10c, RZĄD 1 |
| Dz.U. 2026 poz. 37 | Ustawa o zawodzie lekarza | ustawa o zawodach lekarza i lekarza dentysty | 2026-09-10c, RZĄD 1 |
| Dz.U. 2024 poz. 1725 | Ustawa o podpisie elektronicznym i eIDAS | ustawa o usługach zaufania oraz identyfikacji elektronicznej | 2026-09-10c, RZĄD 1 |
| Dz.U. 2022 poz. 1816 | Ustawa o substancjach chem. | ustawa o substancjach chemicznych i ich mieszaninach | 2026-09-10c, RZĄD 1 |
| Dz.U. 2023 poz. 1215 | Ustawa o partiach politycznych z dnia 27 czerwca 1997 r. | ustawa o partiach politycznych | 2026-09-10c, RZĄD 1 |
| Dz.U. 2025 poz. 300 | Ustawa o referendum ogólnokrajowym z dnia 14 marca 2003 r. | ustawa o referendum ogólnokrajowym | 2026-09-10c, RZĄD 1 |
| Dz.U. 2024 poz. 1186 | Ustawa o KRS | ustawa o Krajowej Radzie Sądownictwa | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2026 poz. 985 | Ustawa frankowa | ustawa o szczególnych rozwiązaniach w zakresie rozpoznawania spraw dotyczących zawartych z konsumentami umów kredytu denominowanego lub indeksowanego do CHF | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2024 poz. 1131 | Rozporządzenie UE 2018/1672 (kontrola środków pieniężnych) | Prawo dewizowe (wiersz złożony: rozporządzenie UE + ustawa krajowa) | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2025 poz. 1733 | Ustawa wdrożeniowa 2021 | ustawa o zasadach realizacji zadań finansowanych ze środków europejskich w perspektywie finansowej 2021–2027 | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2023 poz. 1448 | Ustawa o bezpieczeństwie żywności | ustawa o bezpieczeństwie żywności i żywienia | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2018 poz. 1000 | Ustawa UODO stara (2018) | ustawa o ochronie danych osobowych (akt pierwotny; odesłanie historyczne) | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2025 poz. 499 | Ustawa antykorupcyjna z 1997 r. | ustawa o ograniczeniu prowadzenia działalności gospodarczej przez osoby pełniące funkcje publiczne | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2026 poz. 191 | Ustawa o PCC | ustawa o podatku od czynności cywilnoprawnych | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2024 poz. 1292 | Ustawa o ochronie zabytków | ustawa o ochronie zabytków i opiece nad zabytkami | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2025 poz. 1208 | Ustawa o świadczeniach rodzinnych | ustawa o świadczeniach rodzinnych (wiersz złożony z „Za życiem") | 2026-09-16d, RZĄD 1 (T31) |
| Dz.U. 2023 poz. 1587 | Ustawa o odpadach | ustawa o odpadach (wiersz złożony z gospodarką komunalną) | 2026-09-16d, RZĄD 1 (T31) |

---

## Alias wycofany 2026-09-10j

`Dz.U. 2025 poz. 1295` figurował tu jako alias „Ustawa o diagnostyce
laboratoryjnej" → *ustawa o medycynie laboratoryjnej*, z zastrzeżeniem, że nazwa
robocza jest **nieaktualna**, a wiersz źródłowy należy przemianować.

⛔ **Przemianowano 2026-09-10j — alias usunięty, zgodnie z zapisem.** Przy okazji
okazało się, że nie był to problem nazewniczy: łańcuch w rejestrach stał na
**dwóch podmianach aktu** (`2022/2162` opisane jako nowa ustawa o medycynie
laboratoryjnej, a jest ostatnim t.j. **starej** ustawy z 2001 r.; `2023/1517`
opisane jako stara ustawa o diagnostyce laboratoryjnej, a jest rozporządzeniem
MSWiA). Szczegóły: `AUDIT-JOURNAL.md`, AUDYT-2026-09-10j.

⚠️ Wniosek dla tego rejestru: **alias z zastrzeżeniem „nazwa nieaktualna" jest
sygnałem, nie rozstrzygnięciem.** Nieaktualna nazwa zwykle znaczy, że ktoś
kiedyś dopasował numer do nazwy, a nie nazwę do numeru — i wtedy pod spodem
bywa podmiana. Takie wpisy sprawdzać w pierwszej kolejności.

---

## Czego ten plik NIE robi

⛔ Nie potwierdza, że numer jest **najnowszym** t.j. — od tego są kategorie
`NEWER_TJ` i `check_nowelizacje_po_tj.py`. Alias dotyczy wyłącznie tożsamości
aktu, nie jego aktualności.

⛔ Nie zwalnia z HARD GATE. Przy powołaniu przepisu brzmienie i tak czyta się
u źródła — alias jest ułatwieniem dla testu, nie dla analizy.
