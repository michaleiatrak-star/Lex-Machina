# SYGNATURY — Moduł Walidacji Sygnatur Sądowych

> **Plik:** `shared/SYGNATURY.md`
> **Wersja:** 1.6 (2026-09-14) — V-SYG-0.5: POST-CHECK HOSTA, rozdzielenie `site:` od filtra domeny oraz jawny zakres treści snapshotu bez promocji do DIRECT_LIVE / ✅ [VER].
> **Wersja poprzednia:** 1.5 (2026-09-14) — dodano V-SYG-0.7 DIRECT-CBOSA: fresh-probe,
>              formularz HTML + pełna paginacja + /doc/{ID} + exact-match;
>              V-SYG-0.5 pozostaje fallbackiem wyłącznie po niedostępności
>              direct CBOSA. Fail-closed dla driftu HTML/transportu.
> **Wersja poprzednia:** 1.4 (2026-09-13d) — dodano V-SYG-0.6 (rozstrzyganie AMBIGUOUS na
>              portalu sądu); doprecyzowano V-SYG-0.4 (post-check FILTRUJE zbiór,
>              nie porównuje pierwszego rekordu — przypadek `II CSKP 100/21`);
>              odnotowano odrzucenie zamienników CBOSA na `robots.txt`.
>              Flagi F-188, F-191, F-192, AUDYT-2026-09-13d.
> **Wersja poprzednia:** 1.3 (2026-09-13b) — dodano V-SYG-0.5 (kanał zdegradowany dla
>              pionu sądowoadministracyjnego) oraz oś ZAKRES POTWIERDZENIA
>              (ISTNIENIE / ISTNIENIE+TREŚĆ). Flaga F-183a, AUDYT-2026-09-13b.
> **Wersja poprzednia:** 1.2 (2026-09-13) — dodano V-SYG-0 (binarna kontrola istnienia
>              sygnatury: normalizacja → routing bazy → okno pokrycia → post-check
>              tożsamości). Flagi F-182…F-186, AUDYT-2026-09-13.
> **Wersja poprzednia:** 1.1 (2026-07-05) — KONTRAKT WYNIKU WERYFIKACJI
>              (FOUND/NOT_FOUND/AMBIGUOUS/OUT_OF_SCOPE, wzorzec sententim; AUDYT-2026-07-05a)
> **Wersja 1.0:** (2026-05-25)
> **Status:** AKTYWNY — naprawa BLOKER-2
> **Podstawa:** Instrukcja sądowa (zarządzenie MS z 19.06.2019, Dz. Urz. MS z 2019 r. poz. 138 ze zm.)
>              Zasady biurowości SN (zmiana 01.01.2021 r.)

---

## ZASADA ABSOLUTNA

⛔ **ZAKAZ generowania sygnatur z pamięci.**
Każda sygnatura w odpowiedzi systemu MUSI:
(a) pochodzić z weryfikacji online (orzeczenia.ms.gov.pl / sn.pl / nsa.gov.pl / saos.org.pl), LUB
(b) być oznaczona jako [PRZYKŁADOWA] gdy ilustruje format, LUB
(c) być przekazana przez użytkownika — wtedy system sprawdza format, ale nie weryfikuje istnienia.

---

## STRUKTURA SYGNATURY SĄDU POWSZECHNEGO

```
[Wydział_rzymski] [Sekcja_arabska?] [Repertorium] [Numer_porządkowy] / [Rok]

Przykład: I C 145/23   →  Wydział I, repertorium C (cywilne), sprawa 145, rok 2023
Przykład: II K 78/24   →  Wydział II, repertorium K (karne), sprawa 78, rok 2024
Przykład: IX 2 GC 24/22 → Wydział IX, sekcja 2, repertorium GC (gospodarcze), sprawa 24, rok 2022
```

---

## REPERTORIA — TABELA WALIDACYJNA

### Sądy Rejonowe (SR) i Okręgowe (SO) — sprawy pierwotne

| Repertorium | Rodzaj sprawy | Sąd |
|---|---|---|
| C | Cywilne — procesy | SR, SO |
| Ns | Cywilne — nieprocesowe | SR, SO |
| Nc | Nakazy zapłaty | SR |
| Co | Cywilne — inne | SR, SO |
| K | Karne | SR |
| Ko | Karne — inne | SR |
| Kp | Karne przygotowawcze | SR |
| W | Wykroczenia | SR |
| Wo | Wykroczeniowe — inne | SR |
| GC | Gospodarcze — procesy | SR wyspecjalizowane, SO |
| Ns-Rej | Rejestrowe (KRS) | SR |
| GU | Upadłościowe | SR |
| GRp | Restrukturyzacyjne | SR |
| Cps | Uproszczone | SR |
| RC | Rodzinne i opiekuńcze | SR (wydz. rodzinny) |
| Nmo | Nieletni | SR |
| U | Ubezpieczenia społeczne | SO |
| P | Pracownicze | SO (wydz. pracy) |

### Sądy Apelacyjne (SA) — sprawy odwoławcze i inne

| Repertorium | Rodzaj sprawy |
|---|---|
| **ACa** | Apelacje cywilne (od wyroków SO) |
| **ACz** | Zażalenia cywilne (od postanowień SO) |
| **AKa** | Apelacje karne (od wyroków SO) |
| **AKz** | Zażalenia karne (od postanowień SO) |
| **AKzw** | Zażalenia karne wykonawcze |
| **AKo** | Karne — inne pisma SA |
| **APa** | Apelacje pracownicze |
| **APz** | Zażalenia pracownicze |
| **AUa** | Apelacje ubezpieczeniowe |
| **AUz** | Zażalenia ubezpieczeniowe |
| **AGa** | Apelacje gospodarcze |
| **AGz** | Zażalenia gospodarcze |
| **I ACa** | Wydział I + apelacja cywilna (pełna sygnatura SA) |

> ⚠️ **BŁĄD KRYTYCZNY:** Format „II ACa 123/21" dla **Sądu Najwyższego** jest niepoprawny.
> ACa to repertorium **Sądu Apelacyjnego**, nie SN. SN używa własnych repertoriów — patrz niżej.

### Sąd Najwyższy (SN) — repertoria po reformie 01.01.2021

| Repertorium | Izba / Rodzaj |
|---|---|
| **I CSK / II CSK / III CSK / IV CSK / V CSK** | Izba Cywilna — skargi kasacyjne (przed 2021) |
| **CSKP** | Izba Cywilna — po przyjęciu do rozpoznania (od 2021) |
| **I KK / II KK / III KK / IV KK / V KK** | Izba Karna — kasacje karne |
| **KK** | Izba Karna — kasacje (uproszczona forma) |
| **NKK** | Izba Karna — nowe kasacje (od 2021) |
| **I UK / II UK** | Izba Pracy i Ubezpieczeń Społecznych |
| **I NSNc / II NSNc** | Izba Kontroli Nadzwyczajnej i Spraw Publicznych |
| **I NKN / II NKN** | Sprawy dyscyplinarne |
| **CNP / CNPP** | Skargi o stwierdzenie niezgodności z prawem |
| **I CO / II CO** | Cywilne — inne |

> **Nota:** SN zmienił sygnatury od 01.01.2021 r. (zmiana techniczna bez skutków procesowych).
> Sprawa kasacyjna z 2020 r. może mieć sygnaturę III CSK 123/20; ta sama po przyjęciu od 2021 → CSKP.

### Naczelny Sąd Administracyjny (NSA)

```
[Izba][Rodzaj]/[Siedziba_WSA] [numer]/[rok]
Przykład: I SA/Bk 10/23  →  Izba I (Finansowa), skarga administracyjna, WSA Białystok
Izby: F (Finansowa), G (Gospodarcza), O (Ogólnoadministracyjna)
```

### Trybunał Konstytucyjny (TK)

```
K [numer]/[rok]   → wniosek o kontrolę konstytucyjności
P [numer]/[rok]   → pytanie prawne
SK [numer]/[rok]  → skarga konstytucyjna
Przykład: K 6/06, SK 4/02
```

---

## KONTRAKT WYNIKU WERYFIKACJI — FOUND / NOT_FOUND / AMBIGUOUS / OUT_OF_SCOPE

> Dodano: 2026-07-05 (AUDYT-2026-07-05a). Wzorzec: sententim — deterministyczny
> weryfikator sygnatur (0 LLM w runtime). Reguła naczelna sententim:
> **"jeśli czegoś nie ma w bazie → NOT_FOUND. Nigdy nie zgaduj."**

Każda weryfikacja sygnatury (V-SYG-3, KROK 0/1 z PRAWO-HARDGATE) MUSI kończyć się
JEDNYM z czterech statusów. Zakaz wyników "chyba istnieje", "prawdopodobnie tak":

| Status | Definicja | Obowiązkowa reakcja systemu |
|---|---|---|
| **FOUND** | Dokładnie JEDNO trafienie w bazie: sygnatura + sąd (+ data, jeśli podana) zgodne | Cytuj z pełnymi danymi (sąd, data, URL) + ✅ [VER: źródło, data] |
| **NOT_FOUND** | Zero trafień w bazie, która POKRYWA dany typ sądu i okres | ⛔ NIE CYTUJ. Komunikat: "sygnatura nie została potwierdzona — pominięto zgodnie z PRAWO-HARDGATE" (SCENARIUSZ B) |
| **AMBIGUOUS** | Ta sama sygnatura w ≥2 sądach (format sygnatur SR/SO/SA nie jest ogólnokrajowo unikalny) | ⛔ NIE WYBIERAJ SAM. Przedstaw WSZYSTKICH kandydatów (sąd + data) i dopytaj / zawęź po sądzie lub dacie |
| **OUT_OF_SCOPE** | Zero trafień, ale baza NIE pokrywa danego sądu/okresu (np. SAOS: brak NSA/WSA, SN w SAOS niepełny; sententim: tylko domena kredytowa) | NIE potwierdzaj i NIE zaprzeczaj. Eskaluj do bazy oficjalnej (KROK 1 PRAWO-HARDGATE: sn.pl / orzeczenia.ms.gov.pl / nsa.gov.pl / trybunal.gov.pl) |

**Reguły twarde kontraktu:**

```
K-SYG-1: Zanim zinterpretujesz zero trafień, ustal POKRYCIE bazy (corpus scope):
         jakie instancje i jaki okres baza faktycznie indeksuje.
         Zero trafień poza pokryciem = OUT_OF_SCOPE, nigdy NOT_FOUND.

K-SYG-2: ⛔ ZAKAZ "blisko pasującej" sygnatury. Trafienie częściowe
         (inny rok, inne repertorium, inny numer) = NOT_FOUND dla sygnatury
         pytanej. Nie "poprawiaj" sygnatury na najbliższego kandydata.

K-SYG-3: AMBIGUOUS nie jest błędem — jest informacją. System prezentuje
         kandydatów bez preferencji; wybór należy do użytkownika lub do
         zawężenia (sąd / data ISO YYYY-MM-DD).

K-SYG-4: Statusy NOT_FOUND i OUT_OF_SCOPE NIGDY nie mogą być cytowane jako
         "potwierdzone przez narzędzie". Znacznik ✅ [VER] przysługuje
         wyłącznie statusowi FOUND.

K-SYG-5: Przy każdym FOUND zapisz do śladu weryfikacji (WERYFIKACJA-SLAD.md):
         źródło (URL), datę pobrania, sąd i datę orzeczenia — komplet danych
         audytowych, nie samą sygnaturę.

K-SYG-6: ⛔ STATUS TO NIE WSZYSTKO — każdy FOUND niesie drugą, NIEZALEŻNĄ
         współrzędną: ZAKRES POTWIERDZENIA.
           ISTNIENIE          → potwierdzono, że orzeczenie o tej sygnaturze
                                istnieje (sygnatura + sąd + data + URL), ale
                                TREŚCI nie odczytano. Znacznik: ✅ [VER-ISTNIENIE]
           ISTNIENIE+TREŚĆ    → odczytano dokument. Znacznik: ✅ [VER]
         ⛔ Przy zakresie ISTNIENIE obowiązuje ZAKAZ powoływania tezy, poglądu
            prawnego, fragmentu uzasadnienia i „stanowiska sądu" — wolno powołać
            wyłącznie metrykę orzeczenia. To jest Zasada 2A zapisana jako
            współrzędna statusu, a nie jako ostrzeżenie do zapamiętania.
```

**Normalizacja przed porównaniem** (żeby kosmetyka nie generowała fałszywych NOT_FOUND):
wielkość liter, spacje i kropki w skrótach repertoriów są nieistotne
(`II CSK 750/15` ≡ `ii csk 750/15` ≡ `II C.S.K. 750/15`). Różnica w treści
merytorycznej (numer, rok, repertorium, wydział) POZOSTAJE różnicą.

⛔ **To jest reguła PORÓWNANIA, nie reguła ZAPYTANIA.** Bazy nie normalizują
za nas w tym samym zakresie — zmierzone 2026-09-13:

| Wejście | SAOS `caseNumber` | sn.pl `snproxy` |
|---|---|---|
| `III CZP 25/11` | 1 | 1 |
| `iii czp 25/11` | **1** — wielkość liter nieistotna | **1** — j.w. |
| `III  CZP  25/11` (podwójna spacja) | — | **0 — FAŁSZYWY BRAK** |
| `CZP 25/11` (bez oznaczenia izby) | 0 | — |
| `III CZP 25` (bez rocznika) | 0 | — |

⚠️ **Sprostowanie do materiału wejściowego (F-186).** Teza „SAOS rozróżnia
wielkość liter", oparta na wierszu `czp 25/11` → 0, była **błędem
konfundacji**: ten ciąg nie różnił się od wzorca wyłącznie wielkością liter,
lecz brakiem oznaczenia izby `III`. Test rozdzielający (`iii czp 25/11` → 1)
obala tezę. Realną pułapką jest **białe znaki**, nie kapitaliki — dlatego
V-SYG-0.1 wymusza pojedyncze spacje, a nie wielkie litery.

---

## V-SYG-0 — BINARNA KONTROLA ISTNIENIA SYGNATURY (router baz)

> Dodano: 2026-09-13 (AUDYT-2026-09-13, flagi F-182…F-186). Wykonuje się
> **PRZED** V-SYG-3 i przed jakimkolwiek wyszukiwaniem frazowym.

⛔ **Dlaczego to musi być osobny krok.** Wyszukiwanie frazowe na fabrykacie
nie zwraca zera — zwraca tysiące trafień na słowach składowych. Zmierzone:
SAOS `all=III CZP 999/11` → **67 576 trafień**, przy `caseNumber=III CZP 999/11`
→ **0**. Kontrola istnienia i wyszukiwanie treści to dwie różne operacje na
dwóch różnych parametrach; mylenie ich produkuje „potwierdzenie" nieistniejącego
orzeczenia.

⛔ **V-SYG-0 NIE jest kontrolą binarną „baza zwróciła 0 → NOT_FOUND".** Taka
kontrola przy dzisiejszym stanie baz oznaczałaby każdą sygnaturę SN po
2016-06-22 i każdą sygnaturę NSA/WSA jako fabrykat. Cztery warstwy poniżej są
nierozdzielne.

```
V-SYG-0.1  NORMALIZUJ WEJŚCIE (przed zapytaniem, nie po):
           → zwiń ciągi białych znaków do POJEDYNCZEJ spacji   [obowiązkowe]
           → przytnij spacje wiodące/końcowe                    [obowiązkowe]
           → usuń kropki wewnątrz skrótu repertorium            [obowiązkowe]
           → wielkość liter: bez znaczenia dla SAOS i sn.pl     [zmierzone]
           → NIE uzupełniaj brakującej izby ani rocznika — brak elementu
             sygnatury to BŁĄD FORMATU (V-SYG-2), nie materiał do domysłu

V-SYG-0.2  ROUTUJ PO REPERTORIUM — patrz tabela „ROUTING BAZ" niżej.
           Kanał wywołania (nagłówki, ścieżki): shared/DOSTEP-MASZYNOWY-API.md §3.

V-SYG-0.3  OKNO POKRYCIA (realizacja K-SYG-1):
           jeżeli rocznik sygnatury wypada poza zmierzonym oknem bazy
           → OUT_OF_SCOPE i eskalacja do bazy właściwej. ⛔ NIGDY NOT_FOUND.

V-SYG-0.4  POST-CHECK TOŻSAMOŚCI (maszynowa realizacja K-SYG-2):
           ⛔ FILTRUJ ZBIÓR, nie porównuj pierwszego rekordu.
           Dla KAŻDEGO zwróconego rekordu porównaj jego sygnaturę z PYTANĄ
           po normalizacji z V-SYG-0.1; zachowaj tylko tożsame, resztę
           odrzuć i zapisz w polu `odrzucone_post_checkiem`.
           → 0 tożsamych po filtrze          → NOT_FOUND
           → ≥2 tożsame w różnych sądach     → AMBIGUOUS → idź do V-SYG-0.6
           → dokładnie 1 tożsame             → FOUND
```

⛔ **Post-check nie jest ostrożnością — jest wymogiem.** Zmierzone 2026-09-13:
API SN na zapytanie `I NSNc 10/24` zwraca rekord o sygnaturze **`II NSNc 10/24`**
(wyrok z 2025-03-18) — inna izba, ten sam numer, `success: true`. Kontrola
oparta na samym liczniku trafień potwierdziłaby istnienie orzeczenia, którego
nie ma. To ta sama klasa awarii co K-SYG-2, tylko po stronie maszyny.

⛔⛔ **Dlaczego „porównaj zwróconą z pytaną" to za mało — przypadek rozstrzygający
(F-192, 2026-09-13d).** Zapytanie `II CSKP 100/21` zwraca z SN **dwa** rekordy:

| Zwrócona sygnatura | Data | Ocena post-checku |
|---|---|---|
| `III CSKP 100/21` | 2021-06-25 | ⛔ odrzucić — inna izba |
| `II CSKP 100/21` | 2021-05-27 | ✅ zachować — tożsama |

Redakcja w liczbie pojedynczej („sygnaturę ZWRÓCONĄ") nie mówi, co zrobić z
takim zbiorem: porównanie pierwszego rekordu dałoby **NOT_FOUND** dla orzeczenia,
które **istnieje**. Poprawny wynik to `FOUND` z `odrzucone_post_checkiem:
["III CSKP 100/21"]`. Odtworzenie:

```
python3 audyt-systemu-v4/scripts/weryfikator_sygnatur.py --sygnatura "II CSKP 100/21"
```

✅ Wdrożenie w `weryfikator_sygnatur.py` już filtruje zbiór i zwraca `FOUND` —
to **specyfikacja była nieprecyzyjna względem działającego kodu**, nie odwrotnie.
Powyższa redakcja V-SYG-0.4 wyrównuje ten rozjazd.

### ROUTING BAZ — repertorium → baza właściwa

| Repertorium sygnatury | Baza właściwa | Kanał |
|---|---|---|
| C, Ns, Nc, Co, K, Ko, W, GC, GU, GRp, RC, U, P, ACa, ACz, AKa, AKz, APa, AUa, AGa | `orzeczenia.ms.gov.pl` | GET po sygnaturze |
| CSK, CSKP, KK, NKK, UK, NSNc, NKN, CNP, CO (SN), SDI, ZK | `sn.pl` (snproxy JSON) | GET, UA przeglądarkowy |
| SA/{siedziba}, SAB/{siedziba}, FSK, OSK, GSK, FSN, ONSA | `orzeczenia.nsa.gov.pl` (CBOSA) | **fresh-probe → V-SYG-0.7 DIRECT-CBOSA**; gdy direct zawiedzie → **V-SYG-0.5 fallback indeksowy** |
| K, P, SK, U, Kpt, Kp (TK) | `ipo.trybunal.gov.pl`, `otkzu.trybunal.gov.pl` | ⛔ brak kontroli po sygnaturze |
| KIO | `orzeczenia.uzp.gov.pl` | ⛔ brak filtra po sygnaturze |
| dowolne, gdy rocznik mieści się w oknie | `saos.org.pl` `caseNumber=` | kontrola krzyżowa |
| dowolne repertorium sądu powszechnego, gdy **sąd jest znany** | `orzeczenia.{sad}.sr\|so\|sa.gov.pl` | ten sam GET po sygnaturze → **rozstrzyganie AMBIGUOUS (V-SYG-0.6)** |

⚠️ Repertorium `K` jest wieloznaczne (SR karne / TK wniosek). Rozstrzyga
kontekst sprawy; przy braku rozstrzygnięcia — odpytaj OBIE bazy i zastosuj
V-SYG-0.4.

### OKNO POKRYCIA — stan zmierzony 2026-09-13

| `courtType` (SAOS) | rekordów | najstarsze | **najnowsze** | wniosek dla V-SYG-0.3 |
|---|---:|---|---|---|
| `COMMON` | 471 591 | — | **2026-09-09** | baza bieżąca |
| `SUPREME` | 38 081 | 1994-01-20 | **2016-06-22** | rocznik > 2016 → OUT_OF_SCOPE |
| `ADMINISTRATIVE` | 0 | — | — | **zawsze** OUT_OF_SCOPE |
| `CONSTITUTIONAL_TRIBUNAL` | 9 503 | 1986-05-28 | **2015-12-09** | rocznik > 2015 → OUT_OF_SCOPE |
| `NATIONAL_APPEAL_CHAMBER` | 22 168 | 2007-12-10 | **2018-09-06** | rocznik > 2018 → OUT_OF_SCOPE |

Kontrola rozstrzygająca (nie sortowanie, lecz przedział dat): SUPREME 2016 =
1 181, 2018 = 0, 2020 = 0, 2024 = 0, 2026 = 0. COMMON 2024 = 17 804,
2025 = 13 909, 2026 = 4 917.

⛔ **Nie odczytuj okna z sortowania po dacie.** SAOS zawiera śmieci datowe:
`courtType=COMMON` posortowane malejąco zwraca `3013-12-04`, rosnąco
`0208-03-14`. Granicę pokrycia ustala się **przedziałem
`judgmentDateFrom`/`judgmentDateTo`**, nie skrajnym rekordem.

⛔ **Okno starzeje się i nie wolno go przepisywać.** Odtworzenie:
`audyt-systemu-v4/scripts/weryfikator_sygnatur.py --okno`. Tabela wyżej jest
zapisem pomiaru z datą, nie deklaracją trwałą.

## V-SYG-0.7 — DIRECT-CBOSA (NSA/WSA, 2026-09-14)

> Stosuj, gdy V-SYG-0.2 skierował sygnaturę do CBOSA. **Najpierw fresh-probe
> w bieżącym runtime.** Historyczny pomiar 503 z innej sesji nie jest stanem
> globalnym źródła.

Kontrakt operacyjny:

```
V-SYG-0.7.1  FRESH-PROBE:
             sprawdź, czy orzeczenia.nsa.gov.pl zwraca właściwy HTML CBOSA.
             HTTP 200 z CAPTCHA/WAF/stroną zastępczą ≠ dostępność.

V-SYG-0.7.2  SEARCH:
             POST /cbo/search
             Content-Type: application/x-www-form-urlencoded
             sygnatura={SYGNATURA po V-SYG-0.1}
             + pola formularza wg:
             shared/CBOSA-ADAPTER.md

V-SYG-0.7.3  KOMPLETNOŚĆ:
             odczytaj licznik wyników. Jeżeli wynik ma wiele stron,
             zachowaj cookies i pobierz /cbo/find?p=N aż liczba UNIKALNYCH
             /doc/{ID} zrówna się z licznikiem.
             nierozpoznany licznik / powtórzona strona / brak strony
             / więcej ID niż licznik → OUT_OF_SCOPE.

V-SYG-0.7.4  DOKUMENTY:
             GET /doc/{ID} dla KAŻDEGO kandydata.
             Odczytaj: sygnatura, sąd, data, sentencja oraz — jeśli
             opublikowane — uzasadnienie.
             przerwany transport / brak zamknięcia dokumentu / krytyczny
             drift pól HTML / błąd choć jednego kandydata → OUT_OF_SCOPE.

V-SYG-0.7.5  EXACT-MATCH:
             filtruj CAŁY zbiór po normalizacji V-SYG-0.1.
             0 exact-match  → NOT_FOUND
             1 exact-match  → FOUND
             >=2 exact-match → AMBIGUOUS
             „najbliższa” sygnatura NIGDY nie zastępuje pytanej.

V-SYG-0.7.6  ZAKRES TREŚCI:
             FOUND + kompletna metryka/sentencja → ISTNIENIE+TREŚĆ
             tylko w zakresie faktycznie odczytanych elementów.
             Jeżeli reasoning_available=false → zakaz powoływania tezy
             z uzasadnienia; sentencję wolno powołać po własnym pinpoint.
             FRAGMENT nadal wymaga WERYFIKACJA-SLAD / Zasada 2B.
```

Implementacja wykonawcza:
- `shared/CBOSA-ADAPTER.md`
- implementacja referencyjna opisana w `shared/CBOSA-ADAPTER.md`

Testy regresyjne po hardeningu 2026-09-14: **22/22 PASS** dla driftu HTML,
paginacji, duplikatów, near-match, urwanego transportu i zakresu uzasadnienia.

Jeżeli fresh-probe albo direct pipeline zawiedzie → **nie orzekaj NOT_FOUND**;
przejdź do V-SYG-0.5.

---

## V-SYG-0.5 — KANAŁ RETRIEVAL / SNAPSHOT (pion sądowoadministracyjny, F-183a)

> Od 2026-09-14 jest to FALLBACK po nieudanym V-SYG-0.7 w bieżącym runtime.
> Kanał jest asymetryczny: trafienie exact-match może dostarczyć wartościowy
> materiał, ale brak trafienia nigdy nie dowodzi nieistnienia sprawy.

⛔ `site:` NIE JEST BRAMKĄ DOMENOWĄ. W dwóch niezależnych stosach
wyszukiwawczych zapytanie z `site:orzeczenia.nsa.gov.pl` zwracało także
wyniki spoza tej domeny. Operator służy wyłącznie discovery.

```
V-SYG-0.5.1  DISCOVERY:
             preferuj natywny twardy filtr domeny hosta, jeśli istnieje;
             w przeciwnym razie:
             web_search: site:orzeczenia.nsa.gov.pl "{SYGNATURA po V-SYG-0.1}"
             ⛔ Sam operator `site:` nie nadaje wynikom statusu CBOSA.

V-SYG-0.5.1a POST-CHECK HOSTA — PRZED exact-match:
             sparsuj URL każdego kandydata.
             warunki łączne:
               scheme == https
               hostname == orzeczenia.nsa.gov.pl
               path pasuje do ^/doc/[A-Z0-9]{10}/?$
             → niespełnienie któregokolwiek warunku = ODRZUĆ wynik.
             ⛔ Porównanie pełnego hostname, nie startswith/substring.
             ⛔ Odrzuconego obcego hosta NIE odpytuj automatycznie.

V-SYG-0.5.2  POST-CHECK EXACT-MATCH:
             po V-SYG-0.5.1a porównaj sygnaturę pytaną z sygnaturą
             w tytule lub reprezentacji dokumentu po normalizacji.
             1 exact-match → FOUND w KANALE RETRIEVAL.
             brak exact-match → OUT_OF_SCOPE.
             „najbliższa” sygnatura NIGDY nie zastępuje pytanej.

V-SYG-0.5.3  ZAKRES TREŚCI + PROVENANCE:
             zawsze zapisz access_mode=CRAWLED_OR_INDEXED, chyba że osobny
             bieżący request do originu potwierdzi DIRECT_LIVE.

             A. tylko tytuł/snippet:
                content_scope=EXISTENCE_ONLY

             B. retrieval udostępnia stronę /doc/{ID} z metryką i sentencją:
                content_scope=METADATA_SENTENCE

             C. widoczna sekcja Uzasadnienie, ale nie potwierdzono jej końca:
                content_scope=METADATA_SENTENCE_REASONING_PARTIAL

             D. widoczny początek i koniec uzasadnienia oraz zamknięcie
                reprezentacji dokumentu:
                content_scope=METADATA_SENTENCE_REASONING_FULL

             ⛔ content_scope opisuje CO odczytano, access_mode — JAK.
             Żadne z nich nie jest piątym statusem weryfikacji.

             Snapshot może służyć do researchu, klasyfikacji, mapowania linii,
             analizy sentencji i — gdy obecne — argumentacji.
             Sam snapshot NIE daje ✅ [VER] / DIRECT_LIVE i nie przechodzi
             bramki materiału do finalnego pisma bez niezależnej weryfikacji.

V-SYG-0.5.4  ⛔⛔ TEN KANAŁ NIGDY NIE PRODUKUJE NOT_FOUND.
             Zero trafień / brak exact-hit w retrieval = OUT_OF_SCOPE.
```

### Pomiar znaczenia kanału — 2026-09-14

Praktyczna próba 10 realnych sygnatur NSA/WSA w środowisku z retrieval:
- 10/10 oficjalnych snapshotów `/doc/{ID}` udostępniało co najmniej metrykę + sentencję;
- 5/10 miało potwierdzalny koniec pełnego uzasadnienia;
- 2/10 pokazywało uzasadnienie bez wystarczającego dowodu kompletności;
- 3/10 dawało metrykę + sentencję bez potwierdzonego uzasadnienia.

To NIE jest estymacja pokrycia całego korpusu. Dowodzi natomiast, że kanał
retrieval nie powinien być redukowany do samego snippetu/ISTNIENIA tam, gdzie
host rzeczywiście przekazuje reprezentację oficjalnego dokumentu.

### Kontrole falsyfikacyjne

- fabrykowane/podobne sygnatury mogą zwrócić prawdziwe, ale INNE dokumenty;
- `site:` może zwrócić wynik spoza hosta kanonicznego — dlatego POST-CHECK HOSTA jest obowiązkowy;
- pełna treść w crawlerze może współistnieć z 500/502/503 przy bieżącym otwarciu originu.

### Luka pionu sądowoadministracyjnego — stan po 1.6

| Sytuacja | Wynik |
|---|---|
| exact-hit w oficjalnym snapshotcie | FOUND w retrieval + jawny content_scope |
| snapshot zawiera pełne uzasadnienie | research treści dozwolony; provenance nadal CRAWLED_OR_INDEXED |
| sygnatura fabrykowana / tylko near-match | OUT_OF_SCOPE |
| sygnatura istnieje, ale nie jest zaindeksowana | OUT_OF_SCOPE |
| brak snapshotu | OUT_OF_SCOPE |

⛔ Kanał retrieval nie produkuje NOT_FOUND i sam nie daje statusu ✅ [VER].
Direct CBOSA V-SYG-0.7 pozostaje kanałem silniejszym; fresh-probe nadal obowiązkowy.

⛔ Obce hosty nie stają się CBOSA tylko dlatego, że wyszukiwarka zwróciła je
na zapytanie z `site:`. Szczegóły: `shared/DOSTEP-MASZYNOWY-API.md` §3.

---
## V-SYG-0.6 — ROZSTRZYGNIJ AMBIGUOUS NA PORTALU SĄDU (F-191, 2026-09-13d)

> Stosuj **wyłącznie** wtedy, gdy V-SYG-0.4 zwrócił `AMBIGUOUS` dla sądu
> powszechnego **i sąd jest znany** z akt, pisma lub kontekstu sprawy.

**Przesłanka zmierzona:** sygnatura SR/SO nie jest unikalna krajowo, ale bywa
unikalna w obrębie jednego sądu. Agregat tego nie rozstrzyga — portal sądu tak.

| Zapytanie | Host | Wynik |
|---|---|---|
| `I C 100/15` | `orzeczenia.ms.gov.pl` (agregat) | `big_number=9` → **AMBIGUOUS** |
| `I C 100/15` | `orzeczenia.poznan.so.gov.pl` | `big_number=1` → **FOUND** |
| `I ACa 100/15` | `orzeczenia.szczecin.sa.gov.pl` | „Nie znaleziono…" → **NOT_FOUND** |

```
V-SYG-0.6.1  Ustal host sądu: orzeczenia.{sad}.sr|so|sa.gov.pl
             Wykaz hostów z licznikami dokumentów: drzewo „Portale sądów"
             na orzeczenia.ms.gov.pl/search/advanced — ⛔ nie zgaduj slugu.
V-SYG-0.6.2  Powtórz GET po sygnaturze (kontrakt jak w agregacie, UA neutralny).
V-SYG-0.6.3  Zastosuj V-SYG-0.4 do wyniku lokalnego.
             → 1 tożsame  → FOUND, zakres ISTNIENIE+TREŚĆ
             → 0          → ⛔ NIE NOT_FOUND globalnie; to NOT_FOUND
                            WYŁĄCZNIE dla tego sądu — utrzymaj AMBIGUOUS
                            z agregatu i odnotuj wykluczony sąd
             → ≥2         → AMBIGUOUS wewnątrz sądu (różne wydziały/lata)
```

⛔ **Granica wnioskowania.** Zero trafień na portalu jednego sądu **nie znosi**
AMBIGUOUS z agregatu — znaczy tylko, że to nie ten sąd. Publikacja na Portalu
Orzeczeń jest wybiórcza (część spraw jest wyłączona z publikacji), więc brak
rekordu lokalnie nie dowodzi nieistnienia sprawy. Do `NOT_FOUND` globalnego
uprawnia dopiero pusty wynik w bazie **pokrywającej**, zgodnie z V-SYG-0.3.

---

## PROCEDURA WALIDACJI V-SYG

Wykonaj PRZED każdym cytowaniem sygnatury:

```
V-SYG-1: Czy sygnatura pochodzi od użytkownika lub z narzędzia wyszukiwania?
          TAK → przejdź do V-SYG-2
          NIE (generujesz sam) → ⛔ STOP: oznacz [PRZYKŁADOWA] lub wyszukaj online

V-SYG-2: Sprawdź format — czy repertorium pasuje do sądu?
          ACa/AKa/APa/AUa → musi być SA (nie SN, nie SO)
          CSK/KK → SN (stare), CSKP/NKK → SN (nowe od 2021)
          C/K/Nc/GC → SR lub SO
          SA/Bk/Wa/Wr... → WSA lub NSA
          NIE pasuje → ⛔ BŁĄD FORMATU: poinformuj użytkownika

V-SYG-3: Czy sygnatura ma być cytowana jako realne orzeczenie?
          TAK → obowiązkowe: wykonaj V-SYG-0 w całości.
                Dla NSA/WSA: 0.1 → 0.2 → 0.3 → **0.7 DIRECT-CBOSA**,
                a dopiero po jego niedostępności → 0.5 fallback.
                Dla pozostałych: 0.1 → 0.2 → 0.3 → 0.4.
                ⛔ ZAKAZ wyszukiwania frazowego (SAOS `all=`, web_search po
                   sygnaturze) jako kontroli istnienia — zwraca trafienia na
                   słowach składowych także dla fabrykatu (zmierzone: 67 576).
                   Fraza służy do znalezienia TREŚCI, nigdy do potwierdzenia BYTU.
                fallback po OUT_OF_SCOPE: baza właściwa wg tabeli ROUTING BAZ;
                przy braku kanału — status OUT_OF_SCOPE zostaje, nie awansuje.
                Wynik klasyfikuj WYŁĄCZNIE wg kontraktu FOUND / NOT_FOUND / AMBIGUOUS /
                OUT_OF_SCOPE (sekcja wyżej). Tylko FOUND → cytuj.
          NIE (ilustracja formatu) → oznacz [PRZYKŁADOWA]

V-SYG-4: Rok sygnatury vs rok reformy SN:
          Rok ≥ 2021 + repertorium CSK → ⚠️ OSTRZEŻENIE: sprawdź czy nie powinno być CSKP
```

---

## NAJCZĘSTSZE BŁĘDY DO WYKRYCIA

| Błędna sygnatura | Problem | Korekta |
|---|---|---|
| II ACa 123/21 (dla SN) | ACa = SA, nie SN | Szukaj II CSK lub CSKP dla SN |
| IV CSK 45/22 (po 2021) | Po 2021 SN przeszedł na nowe repertoria | Sprawdź czy nie jest to CSKP |
| I C 123/23 (dla SA) | C = SR/SO, nie SA | Dla SA: I ACa |
| K 12/23 (dla SR) | K to repertorium SR, dla TK to K [numer]/[rok] | Rozróżniaj kontekst |
| VKK bez numeru izby | V KK → Izba V SN Karna | Poprawna forma: V KK 234/22 |

---

## INTEGRACJA Z ORZECZENIA-SADOWE-V2

Moduł SYGNATURY.md jest obowiązkowo wczytywany przez orzeczenia-sadowe-v2 PRZED
każdym cytowaniem orzeczenia. Instrukcja integracji:

```
// W orzeczenia-sadowe-v2, przed cytowaniem:
view shared/SYGNATURY.md
→ Wykonaj V-SYG-0 (binarna kontrola istnienia), następnie V-SYG-1 przez V-SYG-4
→ Dopiero po wyniku FOUND: cytuj z linkiem źródłowym
```

⛔ **Rozbieżność rzędu źródła — rozstrzygnięcie (F-185).** `orzeczenia-sadowe-v2`
klasyfikuje `saos.org.pl` jako „Tier 3 — wyłącznie pomocniczo",
`shared/HIERARCHIA-ZRODEL.md` jako RZĄD 2A. **To nie jest sprzeczność, ale było
czytane jak sprzeczność**, więc zapisuje się wprost: SAOS ma RZĄD 2A jako
źródło TREŚCI (agregator pełnych tekstów), a Tier 3 jako źródło WERYFIKACJI
przy powołaniu w piśmie (nie zastępuje portalu sądu). W V-SYG-0 SAOS pełni
funkcję **kontroli krzyżowej**, nie funkcję bazy rozstrzygającej — rozstrzyga
baza z kolumny „Baza właściwa" tabeli ROUTING BAZ.
