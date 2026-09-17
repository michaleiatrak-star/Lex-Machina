# TABELE-OPLAT — hierarchia źródeł przy obliczaniu opłat, kosztów i alimentów

> **Plik:** `shared/TABELE-OPLAT.md`
> **Wersja:** 2.0 (2026-09-12q) — ⛔ PODZIAŁ NA RDZEŃ I SATELITY. Ten plik
>              zawiera wyłącznie regułę kolejności, mapę własności sekcji
>              i rejestry; materia przeniesiona do `shared/oplaty/`.
>              1.8 (2026-09-12l) — sekcja 4g: trzecia kotwica (przeciętne
>              wynagrodzenie w sektorze przedsiębiorstw, art. 235 ust. 1 PrUp);
>              1.7 (2026-09-12e) — rodzina WARTOŚCI POWTARZALNE zamknięta:
>              odsetki cywilne i handlowe, odsetki podatkowe i ZUS, stopy składek
>              ZUS, skala PIT i kwota wolna; doktryna „formuła zamiast procentu";
>              1.6 (2026-09-12c) — domknięcie rodzin opłat poza rdzeniem KSCU:
>              wieczystoksięgowe i KIO, koszty komornicze, opłata skarbowa, taksa
>              notarialna, koszty procesu karnego (KPK) wraz ze zryczałtowaną
>              równowartością wydatków podniesioną do 1000 zł od 1.07.2025;
>              1.5 (2026-09-12b) — zwrot opłaty (art. 79 KSCU), dalsze zwolnienia
>              i wyłączenia (art. 104–107, 109, 111 KSCU), wyłączenie zwolnień
>              w EPU i S24 (art. 104a), wyjątki od zasady odpowiedzialności za
>              wynik (art. 100–103, 110 KPC);
>              1.4 (2026-09-12) — rejestr opłat cywilnych ogólnych (art. 14–25b,
>              68–78), rozwód i sprawy rodzinne (art. 26, 27, 37, 38), prawo pracy
>              i ubezpieczenia społeczne (art. 35, 36), opłaty karne (ustawa
>              z 23.06.1973) i wpis sądowoadministracyjny; rejestr tabel satelickich;
>              1.3 (2026-09-10w) — pełny katalog zwolnień (art. 94–103 KSCU);
>              1.2 (2026-09-10v) — tabele taks z odczytu treści;
>              1.1 (2026-09-10u) — art. 22 KPC i art. 135 KRO z odczytu treści;
>              1.0 (2026-09-10t) — flaga O-11, część merytoryczna F-135.
> **Status:** KANONICZNY dla KOLEJNOŚCI SIĘGANIA PO KWOTY. Nie zastępuje odczytu
> treści przepisu przy konkretnej sprawie.
> **Wywołanie:** `view shared/TABELE-OPLAT.md` — przed pierwszym podaniem
> jakiejkolwiek kwoty opłaty, taksy albo wyliczenia alimentacyjnego.

---

---

---

## ⛔ MAPA WŁASNOŚCI SEKCJI — JEDNA SEKCJA, JEDEN PLIK

Ten plik jest **rdzeniem**. Nie zawiera tabel — zawiera **regułę kolejności,
mapę i rejestry**. Materia mieszka w satelitach `shared/oplaty/`.

⛔ **Każda sekcja ma DOKŁADNIE JEDEN plik-właściciela.** Jeżeli ta sama treść
pojawi się w dwóch plikach, podział zdegeneruje się w to, przed czym broni
sekcja 7 — w tabele satelickie jako drugie źródła prawdy. Kontrola:
`audyt-systemu-v4/scripts/check_oplaty_mapa.py` (T29).

| Sekcje | Plik-właściciel | Kiedy sięgać |
|---|---|---|
| 1, 1a, 1b, 1c | `oplaty/01-KSCU-cywilne-rodzinne-pracownicze.md` | progi WPS, opłaty ogólne KSCU, **rozwód i sprawy rodzinne**, prawo pracy i ubezpieczenia |
| 2, 2a, 2b, 2c, 2d, 2e | `oplaty/02-zwolnienia-zwrot-alimenty.md` | ⛔ **KROK 0 — czy strona w ogóle płaci**; alimenty; pełny katalog zwolnień; **zwrot opłaty (art. 79)**; wyłączenie zwolnień w EPU i S24 (art. 104a); ryzyko kosztowe z KPC |
| 3, 3a | `oplaty/03-koszty-zastepstwa-taksy.md` | stawki pełnomocnika — § 2, 3, 4, 9, 10, 11, 17 obu taks |
| 4, 4a–4g | `oplaty/04-wartosci-powtarzalne-kotwice.md` | ⛔ **DOKTRYNA „formuła zamiast procentu"**; odsetki, składki, skala PIT, trzy kotwice |
| 5, 6e | `oplaty/05-sprawy-karne.md` | opłaty karne (ustawa z 23.06.1973) i koszty procesu z KPK |
| 6, 6a | `oplaty/06-administracyjne-wieczystoksiegowe-KIO.md` | wpis do WSA, postępowanie wieczystoksięgowe, skarga na KIO |
| 6b, 6c, 6d | `oplaty/07-komornicze-skarbowe-notarialne.md` | koszty komornicze, opłata skarbowa, taksa notarialna |
| 7, 8 | **ten plik** | rejestr tabel satelickich w innych skillach; zakres nieobjęty |

### Ścieżka domyślna przy pytaniu o kwotę

```text
1. view shared/TABELE-OPLAT.md            ← reguła kolejności (niżej) + ta mapa
2. view shared/oplaty/02-...              ← KROK 0: czy strona płaci i czy odzyska
3. view shared/oplaty/<właściwy satelita> ← kwota i jednostka redakcyjna
4. odczyt treści przepisu                 ← HARD GATE, wartość wiążąca
```

⚠️ **Dlaczego podział, skoro sekcja 7 ostrzega przed satelitami.** Tamte
powstawały **bez właściciela i bez rejestru** — każda kopiowała kwoty i żyła
własnym życiem. Tutaj właściciel jest jeden, mapa jest w rdzeniu, a duplikacji
pilnuje test. Różnica nie polega na liczbie plików, tylko na tym, **czy istnieje
pojedyncze miejsce, które mówi, gdzie co mieszka**.


## ⛔ REGUŁA KOLEJNOŚCI — sedno tego pliku

Kwotę bierze się z **tabeli, która ją ustanawia**, a nie z bazy, która ją
opisuje. Kolejność jest wiążąca:

```
0. ⛔ CZY STRONA W OGÓLE PŁACI — katalog zwolnień (sekcja 2b).
      Pytanie zadawane PRZED sięgnięciem po jakąkolwiek tabelę.
1. TABELA USTANAWIAJĄCA — przepis, który podaje liczbę
      KSCU (opłaty sądowe), rozporządzenia MS (taksy), rozporządzenie RM
      (minimalne wynagrodzenie). ⛔ Odczyt TREŚCI aktu, nie metadanych.
2. BAZA KATALOGUJĄCA — zasób, który mówi, JAKI to rodzaj opłaty i ZA CO
      MP10-koszty, mapy DR, leksykon. Służy do rozpoznania rodzaju
      i podstawy, NIGDY do przepisania liczby.
3. RZĄD 2A/2B — wyłącznie do rozpoznania problemu, nigdy do kwoty.
```

⛔ **Baza katalogująca nie jest źródłem kwoty.** Zmierzony przypadek
(AUDYT-2026-09-10s): `orka-bas` podawał minimalne wynagrodzenie 2026 jako
„~4 750 zł" zamiast 4806 zł — kwota służyła do przeliczenia krotności progu,
więc przybliżenie propagowało się na wynik. Liczba w bazie katalogującej
starzeje się i zaokrągla; liczba w przepisie nie.

⚠️ **Kwota „w przybliżeniu" jest w obliczeniu tym samym co kwota błędna.**
Jeżeli nie masz liczby z tabeli — napisz, że jej nie masz, i podaj gdzie jest.
Nie szacuj.

---

---

## 7. REJESTR TABEL SATELICKICH — gdzie jeszcze w systemie stoją kwoty

⛔ **Ten rejestr istnieje po to, żeby druga tabela nie stała się drugim źródłem
prawdy.** Każdy plik niżej zawiera własne kwoty opłat. Wiążąca jest tabela
ustanawiająca (ten plik → przepis), nie plik satelicki.

| Plik | Rola | Status 2026-09-12 |
|---|---|---|
| `shared/oplaty/*.md` (7 plików) | **satelity WŁASNE rdzenia** — jedyne z właścicielem i mapą | ✅ objęte T29 |
| `dr-12-.../modules/mod-KSCU-koszty-sadowe-i-pomoc-prawna.md` | opis ustawy i kwalifikator, **bez utrwalonych kwot** | ✅ zgodny — deleguje tutaj |
| `dr-03-.../modules/mod-ustawa-oplaty-w-sprawach-karnych.md` | kanoniczny opis ustawy karnej art. 1–23 | ✅ zgodny — sekcja 5 tutaj jest wyciągiem |
| `analizator-dowodow-v3/modules/MP10-koszty.md` | **baza katalogująca** — rodzaj opłaty i „za co" | ⚠️ warstwa 2 reguły kolejności; nie jest źródłem kwoty |
| `pisma-proste-v2/references/M6-oplaty.md` | tabela robocza dla pism prostych | 🔧 naprawiona 2026-09-12 |
| `pisma-proste-v2/SKILL.md` (tabela opłat) | duplikat M6 w korpusie skilla | 🔧 naprawiona 2026-09-12 |
| `pisma-procesowe-v3/modules/MOD-OPLATY.md` | tabela robocza dla pism procesowych | 🔧 naprawiona 2026-09-12 |
| `analiza-sadowa-v6/references/koszty-terminy.md` | tabele kosztów i terminów do bilansu sprawy | 🔧 naprawiona 2026-09-12 |
| `dr-06-.../modules/mod-ustawa-oplata-skarbowa.md` | dziedzina: ustawa o opłacie skarbowej (moduł od 2026-09-16d, **bez utrwalonych stawek** — deleguje do 6c) | ⚠️ sekcja 6c tutaj jest wyciągiem — kwoty z załącznika odczytać przy sprawie |
| `dr-07-.../` (wpis od odwołania do KIO) | dziedzina: PZP | ⚠️ art. 34 ust. 1 KSCU odsyła do wpisu z PZP — kwota **nie** stoi w KSCU |

⚡ **Egzekwowanie (O-11(b), od 2026-09-16e):** `audyt-systemu-v4/scripts/check_tabele_satelickie.py`
(T32) czyta ten rejestr i w każdym pliku z kolumną „Plik" zgłasza **wiersz tabeli z kwotą bez
podstawy prawnej** (ani w wierszu, ani w kolumnie „Podstawa" / „Przepis"). Ścieżka `…/`
rozwija się do katalogu skilla. Wiersz bez ścieżki do pliku (np. `dr-07`) — poza testem.

⚠️ **Wzorzec błędu wykryty w trzech z nich naraz:** progi WPS opisane jako
**„art. 27 pkt 1–6 KSCU"**. Art. 27 ustanawia opłatę stałą 200 zł od <!-- T28-OK: cytat opisowy — dokumentacja naprawy -->
enumerowanych pozwów (sekcja 1b) i **nie zna progów wartościowych**. Odesłanie
wyglądało poprawnie formalnie, więc przeszło przez kontrole składniowe —
wykrywa je dopiero odczyt treści przepisu.

---

---

## 8. Czego ten plik NIE zastępuje

⛔ Nie zastępuje odczytu przepisu przy konkretnej sprawie. Tabele wyżej są
**punktem wyjścia i dowodem, że wartość ma źródło** — nie substytutem HARD GATE.

⛔ **Domknięte 2026-09-12c** (sekcje 6a–6e): wieczystoksięgowe i skarga na KIO,
koszty komornicze, opłata skarbowa, taksa notarialna, koszty procesu karnego.

⛔ **Nadal poza zakresem — wymagają odczytu przy sprawie:** wpis od **odwołania
do KIO** (PZP i rozporządzenie wykonawcze — art. 34 ust. 1 KSCU tylko do niego
odsyła); opłaty **rejestrowe w KRS** poza art. 95 KSCU; pełny załącznik do
ustawy o opłacie skarbowej (setki pozycji — sekcja 6c podaje wyłącznie trzy
najczęstsze) oraz katalog zwolnień z art. 7 tej ustawy; rozporządzenia
o **wydatkach w postępowaniu karnym** i należnościach biegłych, świadków
i tłumaczy; opłaty w postępowaniu **upadłościowym i restrukturyzacyjnym**;
opłaty **administracyjne** inne niż skarbowa; koszty w **postępowaniu
sądowoadministracyjnym** poza wpisem (prawo pomocy — art. 243–262 PPSA, odrębny
reżim). Każda z nich ma własny akt ustanawiający — ta sama reguła kolejności,
inne źródło.

⚠️ Katalog rodzajów opłat i przyporządkowanie „za co" prowadzi
`analizator-dowodow-v3/modules/MP10-koszty.md`. To jest **warstwa druga**
z reguły kolejności: rozpoznaje rodzaj, nie ustala kwoty.
