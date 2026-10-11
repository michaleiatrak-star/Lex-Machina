# FORMAT-CYTOWANIA — zapis powołań aktów w tekście dla adresata

**Status:** moduł współdzielony, kanoniczny. **Pierwszeństwo:** ta reguła wygrywa z każdym innym wzorem zapisu
powołania w skillach i modułach (także starszym przykładem z `t.j.`, `Dz.U.`, `ze zm.`, `KPC`, `§1`).
**Zakres:** tekst przeznaczony dla adresata: pismo procesowe i proste, opinia, umowa, raport dla klienta.
**Poza zakresem:** część robocza, log weryfikacji, rejestry metryk (`MAPA-AKTOW.md`, `ISAP-METRYKI-AKTOW.md`),
dzienniki audytu. Tam zapis metryki może być dowolny (np. `Dz.U. 2025 poz. 869`, `DU/2025/869`).
**Wzorzec:** rozporządzenie Prezesa Rady Ministrów w sprawie „Zasad techniki prawodawczej” (ZTP), tekst jednolity
ELI `DU/2026/300`: § 57, § 59 ust. 1, § 154 ust. 3, § 158 ust. 1 i 5–7, § 162 ust. 2 pkt 1. ZTP wiąże prawodawcę;
w tekście dla adresata stosujemy je jako jedną regułę systemu.
**Numery:** rocznik, pozycję i zmiany bierz wyłącznie z bieżącej weryfikacji ELI (PRAWO-HARDGATE). Przykłady niżej
mają symbole `RRRR`, `N` — nigdy nie przepisuj numerów z przykładu ani z pamięci.

## 1. Pierwsze powołanie aktu

```
art. X ustawy z dnia [data] r. o [przedmiot] (Dz. U. z RRRR r. poz. N[ oraz z RRRR r. poz. N i N]; dalej: [skrót])
art. X ustawy z dnia [data] r. – Kodeks cywilny (Dz. U. z RRRR r. poz. N; dalej: k.c.)
```

- Tytuł aktu w aktualnym brzmieniu. Myślnik tylko przed tytułem-nazwą (`– Kodeks …`, `– Prawo …`,
  `– Ordynacja podatkowa`); przed `o …` bez myślnika: `ustawy z dnia 28 lipca 2005 r. o kosztach …`.
- Oznaczenie dziennika (§ 158 ust. 1 i 7):
  - ogłoszono tekst jednolity → rocznik i pozycja **ostatniego** t.j.: `(Dz. U. z RRRR r. poz. N)`;
  - t.j. zmieniony później, do 5 zmian → wymień je: `(Dz. U. z RRRR r. poz. N, z RRRR r. poz. N i N)`;
    wymieniasz zmiany **ogłoszone** (§ 158 ust. 1 pkt 4), także jeszcze niewchodzące w życie; brzmienie
    stosujesz według daty zdarzenia (PRAWO-HARDGATE), a zmianę z vacatio legis opisujesz w treści, gdy ma znaczenie;
  - więcej niż 5 zmian → `(Dz. U. z RRRR r. poz. N z późn. zm.)`, w piśmie bez odnośnika;
  - brak t.j., akt nienowelizowany, ogłoszony w roku z daty aktu → `(Dz. U. poz. N)`;
  - ogłoszony w innym roku niż data aktu → `(Dz. U. z RRRR r. poz. N)`;
  - akty sprzed 2012 r. z numerem dziennika → `(Dz. U. z RRRR r. Nr N, poz. N)`.
- Kolejne powołanie tego samego aktu: sam skrót albo tytuł, bez dziennika (§ 158 ust. 2).

## 2. Zakazy (błędne niezależnie od konwencji)

| Kod | Zakaz | Źle | Dobrze |
|---|---|---|---|
| F1 | skrót dziennika bez spacji (§ 162 ust. 2 pkt 1) | `Dz.U.` | `Dz. U.` |
| F2 | rocznik bez „z … r.” (§ 158 ust. 7) | `Dz. U. 2025 poz. N`, `Dz. U. z 2025 poz. N` | `Dz. U. z 2025 r. poz. N` |
| F3 | dopisek „t.j.” (ZTP go nie przewiduje) | `(t.j. Dz. U. …)`, `(Dz. U. … t.j.)` | `(Dz. U. z RRRR r. poz. N)` |
| F4 | „ze zm.” (§ 158 ust. 5) | `… poz. N ze zm.` | `… poz. N z późn. zm.` albo lista zmian |
| F5 | zapis skrócony | `Dz.U.2025.383` | `Dz. U. z 2025 r. poz. 383` |
| F6 | metryka konektora / ELI / status / URL w treści | `DU/2025/869`, `WDU20250000869`, `IN_FORCE`, `display_address`, link ISAP/ELI | tylko w części roboczej |
| F7 | skrót kodeksu wielkimi literami | `KPC`, `KC`, `KP` | `k.p.c.`, `k.c.`, `k.p.` |
| F8 | znak paragrafu bez spacji, przecinki między jednostkami, `^` w indeksie (§ 59 ust. 1) | `§1`, `art. 5, ust. 2`, `art. 398^22` | `§ 1`, `art. 5 ust. 2`, `art. 398²²` |
| F9 | skrót użyty przed wprowadzeniem albo niewprowadzony (§ 154 ust. 3) | `art. 5 k.c.` przed `(…; dalej: k.c.)` | skrót wprowadzony przy pierwszym powołaniu |

## 3. Jednostki redakcyjne

- Kolejność i zapis (§ 57, § 59 ust. 1): `art. 5 ust. 2 pkt 3 lit. a`, kodeks: `art. 415 § 1 pkt 2 k.c.`; bez przecinków.
- Zdanie: `art. 5 ust. 2 zdanie drugie`.
- Indeks górny: `art. 398²² k.p.c.`. W .docx jako indeks górny (superscript), w tekście zwykłym znaki `²²`; nigdy `^`.

## 4. Skróty

Wprowadzenie przy pierwszym powołaniu: `; dalej: k.c.` (dopuszczalne `zwana dalej „k.c.”`). Skrót spoza tabeli
tworzy się z pierwszych liter tytułu, małymi literami z kropkami (np. `u.o.p.k.`), i wprowadza tak samo.

| Akt | Skrót | Akt | Skrót |
|---|---|---|---|
| Kodeks cywilny | k.c. | Kodeks karny | k.k. |
| Kodeks postępowania cywilnego | k.p.c. | Kodeks postępowania karnego | k.p.k. |
| Kodeks rodzinny i opiekuńczy | k.r.o. | Kodeks karny wykonawczy | k.k.w. |
| Kodeks spółek handlowych | k.s.h. | Kodeks wykroczeń | k.w. |
| Kodeks pracy | k.p. | Kodeks postępowania w sprawach o wykroczenia | k.p.w. |
| Kodeks postępowania administracyjnego | k.p.a. | Kodeks karny skarbowy | k.k.s. |
| Prawo o postępowaniu przed sądami administracyjnymi | p.p.s.a. | Ordynacja podatkowa | o.p. |
| ustawa o kosztach sądowych w sprawach cywilnych | u.k.s.c. | Konstytucja RP | Konstytucja |

## 5. Metryka a zapis w piśmie

`displayAddress` z API Sejmu, identyfikator ELI (`DU/RRRR/N`), adres ISAP (`WDURRRR…`), status
(`obowiązujący`, `IN_FORCE`) i URL źródła to **metryka weryfikacji**, nie zapis do pisma. Przekształć ją
na wzór z sekcji 1. Metryka i linki idą do logu weryfikacji i do części roboczej.

**Część robocza:** wszystko od nagłówka `CZĘŚĆ ROBOCZA` do końca dokumentu (raport W3, log, uwagi do
usunięcia przed wysłaniem). Treść dla adresata kończy się przed tym nagłówkiem.

## 6. Kontrola F1–F9 (bramki)

Przed oddaniem tekstu (FORMAL-CHECK, LEGAL-QUALITY-GATE, AUDYT-KONCOWY):

```
□ F1–F9 z sekcji 2: zero naruszeń w treści dla adresata
□ każdy akt: pierwsze powołanie z dziennikiem wg sekcji 1, dalej skrót albo tytuł
□ narzędzie (gdy dostępne): python3 shared/tools/walidator_cytowan.py --document PISMO --format
  kod wyjścia 3 = naruszenia zapisu (lista z kodami F1–F9) → popraw i uruchom ponownie
```
