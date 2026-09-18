# PRAWO-HARDGATE — Zakaz cytowania prawa i orzeczeń z pamięci

>
> ⛔ HARD GATE — BEZWZGLĘDNY. Aktywny we wszystkich skillach, modułach i krokach systemu.
> Nie ma wyjątków. Nie ma trybu "szybkiego". Nie ma trybu "wiem na pewno".
>
> ⛔ PERMANENT GATE — OBOWIĄZUJE PRZEZ CAŁĄ ROZMOWĘ
> Zakaz nie wygasa po żadnej liczbie wiadomości w sesji.
> Każde nowe powołanie artykułu, sygnatury lub liczby = osobny web_search/web_fetch
> w tej samej odpowiedzi — nawet jeśli był weryfikowany wcześniej w tej rozmowie.
> Nawet jeśli model "jest pewny" treści przepisu — weryfikacja jest obowiązkowa.
> Brak dostępu do źródeł → ⚠️ [NIEWERYFIKOWANE] + komunikat. Nigdy nie pomijaj oznaczenia.
> Oficjalne źródła: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl

## ZASADA ABSOLUTNA

**ZAKAZ** podawania jakiegokolwiek przepisu, artykułu, paragrafu, ustępu, punktu, numeru Dz.U., daty aktu, brzmienia normy, stawki, terminu ustawowego, kary, sankcji lub sygnatury orzeczenia — bez uprzedniej weryfikacji online w tym samym kroku.

Dotyczy KAŻDEJ dziedziny prawa: cywilnego, karnego, pracy, administracyjnego, podatkowego, budowlanego, UE i wszystkich pozostałych.

## CO JEST ZAKAZANE

- Podanie artykułu "z pamięci" nawet gdy model jest pewny jego brzmienia
- Podanie numeru Dz.U. bez sprawdzenia tekstu jednolitego
- Podanie kary / stawki / terminu bez weryfikacji aktualnego brzmienia
- Podanie sygnatury orzeczenia bez weryfikacji że orzeczenie istnieje pod tym numerem
- Cytowanie fragmentu przepisu bez sprawdzenia aktualnego tekstu na isap.sejm.gov.pl
- Powoływanie się na "ugruntowaną linię orzeczniczą" bez sprawdzenia aktualnych orzeczeń

## REGUŁA AKTUALNOŚCI — BEZWZGLĘDNA

> ⛔ ZAWSZE i DOMYŚLNIE używaj WYŁĄCZNIE najnowszego obowiązującego tekstu jednolitego (t.j.).
>
> ZAKAZ powoływania się na starszy t.j. gdy istnieje nowszy, nawet jeśli różnica jest niewielka.
> ZAKAZ cytowania przepisu z t.j. który nie jest najnowszym ogłoszonym tekstem jednolitym.
>
> Weryfikacja sekwencja:
>   1. PREFEROWANE (deterministyczne): web_fetch / narzędzie MCP na
>      https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/references
>      → odczytaj łańcuch "Tekst jednolity" — najnowsza pozycja = obowiązujący t.j.
>      (patrz sekcja "WARSTWA STRUKTURALNA (ŹRÓDŁO-0)").
>   2. Fallback: sprawdź na isap.sejm.gov.pl jaki jest NAJNOWSZY t.j. danego aktu.
>   3. Jeśli od najnowszego t.j. były nowelizacje — wskaż je jako "(ze zm. Dz.U. YYYY poz. NNN)".
>   4. Dopiero na tej podstawie cytuj przepis.
>
> Standardowy format cytowania:
>   art. X ustawy z dnia [...] (t.j. Dz.U. z RRRR r. poz. NNN[, ze zm.])
>
> ⛔ ZAKAZ formatu: "Dz.U. 2022 poz. XYZ" gdy istnieje t.j. 2025 lub 2026.
> ⛔ ZAKAZ używania t.j. starszego niż najnowszy dostępny — nawet gdy moduł podaje inny rok.
> Jeśli t.j. w module jest starszy niż najnowszy na ISAP: użyj najnowszego z ISAP.

## ⚙️ WARSTWA STRUKTURALNA (ŹRÓDŁO-0) — API zamiast wyszukiwarki

> Dodano: 2026-07-05 (AUDYT-2026-07-05a). Wzorce: prawo-pl-eli (ELI Sejm),
> legal-cite-pl / mcp-isap (strukturalny odczyt aktu po identyfikatorze),
> sententim (deterministyczna weryfikacja sygnatur), prawo-pl-saos (SAOS API).
>
> **Zasada:** web_search to wyszukiwarka ogólnego przeznaczenia — może trafić na
> nieaktualną kopię, forum lub komentarz. Strukturalne API pytamy o KONKRETNY
> identyfikator aktu/orzeczenia i dostajemy odpowiedź deterministyczną.
> Dlatego API/MCP są ZAWSZE pierwszym wyborem, a web_search — fallbackiem.

**Hierarchia narzędzi weryfikacji (od najsilniejszego):**

```
POZIOM A — konektor MCP (gdy skonfigurowany w środowisku):
  get_act / verify_article        (mcp-isap, legal-cite-pl)  → akty Dz.U./M.P.
  verify_signature / search_judgments (sententim)            → sygnatury (kontrakt FOUND/NOT_FOUND/AMBIGUOUS)
  narzędzia SAOS / KIO / EUR-Lex  (prawo-pl-saos, kio-orzeczenia-mcp, prawo-eu-eurlex)

POZIOM B — bezpośredni web_fetch na strukturalne API (działa bez MCP):
  Akty PL (ELI Sejm):  https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}            → metadane (status, wejście w życie, pola textHTML/textPDF)
                       https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/references → nowelizacje, TEKST JEDNOLITY
                       https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/text.pdf   → TREŚĆ tekstu jednolitego (patrz ⛔ niżej)
                       https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/text.html  → ⛔ tekst OGŁOSZONY aktu bazowego, NIE ujednolicony
  Monitor Polski:      https://api.sejm.gov.pl/eli/acts/MP/{rok}/{poz}            → ten sam interfejs, publikator M.P. (dodane 2026-09-01f)
  ⛔ POZA API ELI:     akty prawa miejscowego (uchwały rad gmin, plany miejscowe) i dzienniki
                       urzędowe ministrów NIE są w tym API — zmierzone 2026-09-01:
                       `api.sejm.gov.pl/eli/acts` zwraca wyłącznie `DU` i `MP`. Publikatory:
                       `dziennikiurzedowe.gov.pl` — portal zbiorczy RCL
                       (RZĄD 1, `shared/HIERARCHIA-ZRODEL.md` poz. 10-11)

  ⛔⛔ **{poz} TO POZYCJA, NIE NUMER DZIENNIKA** (dodane 2026-09-14)

  Adres „Dz.U. 1964 nr 9 poz. 59" zawiera dwie liczby. Do ELI wchodzi
  WYŁĄCZNIE pozycja: `DU/1964/59`. Wstawienie numeru dziennika daje
  `DU/1964/9` — i API **nie zgłasza błędu**: zwraca HTTP 200 z kompletną,
  poprawnie wyglądającą metryką INNEGO aktu (zmierzone 2026-09-14:
  `DU/1964/9` = Rozporządzenie Ministra Zdrowia i Opieki Społecznej
  z 28.12.1963, zamiast Kodeksu rodzinnego i opiekuńczego).

  To ta sama klasa błędu co `/text.html` niżej: kanał RZĘDU 1, odczyt
  faktycznie nastąpił, nic nie sygnalizuje pomyłki — a cytowany jest
  inny akt.

  **Kontrola obowiązkowa, przed przejściem do `/references`:**
  po pobraniu metryki skonfrontuj pole `title` z aktem, którego szukasz.
  Rozbieżność tytułu = STOP, zbuduj ELI od nowa. Nie ma innego sposobu
  wykrycia — API nie odróżni złej pozycji od dobrej.

### ŚCIEŻKA B-L — AKT PRAWA MIEJSCOWEGO

> Treść wydzielona 2026-09-10b (F-180) do `shared/PRAWO-HARDGATE-AKT-MIEJSCOWY.md`.
> Bez zmian merytorycznych.

```
Przedmiotem sprawy jest uchwała rady gminy/powiatu/sejmiku, zarządzenie
wójta/burmistrza/prezydenta albo akt wojewody?
        │
        ├── NIE  → ścieżka nie dotyczy, idź dalej
        │
        └── TAK  → ⛔ view shared/PRAWO-HARDGATE-AKT-MIEJSCOWY.md
                     PRZED pierwszą próbą weryfikacji tego aktu
```

⛔ Aktów prawa miejscowego **nie ma w ELI Kancelarii Sejmu.** Próba weryfikacji ich
tam zwraca fałszywy negatyw wyglądający jak „akt nie istnieje” — i na tym fałszywym
negatywie da się zbudować całe rozstrzygnięcie. Wydzielony plik podaje właściwe
kanały (wojewódzkie dzienniki urzędowe, BIP jednostki).

### ⛔⛔ PUŁAPKA `/text.html` — TEKST OGŁOSZONY UDAJE AKTUALNY (F-150, 2026-09-01c)

> Zmierzone na żywym API 2026-09-01. Nie hipoteza — trzy odczyty, wyniki niżej.

`/eli/acts/DU/{rok}/{poz}/text.html` wywołany na **akcie bazowym** zwraca tekst
**OGŁOSZONY**, czyli brzmienie z dnia publikacji, bez żadnej późniejszej
nowelizacji. Dokument jest kompletny, sformatowany i wygląda jak akt bieżący —
nie niesie żadnego ostrzeżenia.

| Akt | Co zwraca `/text.html` | Czego BRAKUJE |
|---|---|---|
| KC — DU/1964/93 (2,2 MB) | tekst z 1964 r. | ZERO jednostek z indeksem górnym: brak art. 385¹, 449¹, 770¹ |
| KK — DU/1997/553 (1,1 MB) | tekst z 1997 r. | brak art. 190a |

⛔ **Cytat brzmienia z `/text.html` aktu bazowego jest naruszeniem REGUŁY
AKTUALNOŚCI z tego samego pliku** — i to naruszeniem niewidocznym, bo źródło
jest RZĘDU 1 i odczyt faktycznie nastąpił.

**POPRAWNA SEKWENCJA — trzy kroki, nie jeden:**

```
B-T1: GET /eli/acts/DU/{rok}/{poz}/references
      → sekcja „Inf. o tekście jednolitym" → wybierz pozycję ze statusem
        „obowiązujący" (⛔ NIE ostatnią na liście — rejestr bywa
        nieposortowany, a starsze obwieszczenia mają „wygaśnięcie aktu")
B-T2: GET /eli/acts/{ELI t.j.} → sprawdź pola textHTML / textPDF
      Obwieszczenia (t.j.) mają zwykle textHTML: false — `/text.html`
      zwraca wtedy 0 bajtów, a nie błąd.
B-T3: treść z /text.pdf → ekstrakcja (`pdftotext -layout` lub równoważna).
      Indeks górny wychodzi w postaci `Art. 770[1]` — to TA SAMA jednostka
      co art. 770¹, nie część art. 770.
```

Przykład zmierzony: KC → t.j. Dz.U. 2026 poz. 795 → `text.pdf` (119 s.) →
art. 770¹ obecny ze statusem „(uchylony)". Ta sama jednostka jest w
`/text.html` aktu bazowego **nieobecna w ogóle**.

⛔ Narzędziowo tę sekwencję realizuje
`audyt-systemu-v4/scripts/check_wyjatek_gate_eli.py`; skrypt wypisuje etykietę
wersji przy źródle, więc brak etykiety `TEKST JEDNOLITY` w bloku wyjściowym
oznacza, że czytano tekst ogłoszony.

### ⛔⛔ OGRANICZENIE ŚRODOWISKA (dodano 2026-08-23, v2.5) — CZYTAJ PRZED POZIOMEM B

> Zweryfikowane empirycznie 2026-08-23 w środowisku wykonawczym (nie hipoteza —
> trzy testy wykonane, wyniki poniżej). Powód wpisu: przebieg testu 3 pilotażu
> LEX MACHINA, w którym model po nieudanym dostępie do RZĘDU 1 wymyślił
> nieistniejący status źródła („pamięć normatywna") zamiast zejść na
> przewidzianą ścieżkę zastępczą. Analiza przyczyn wykazała, że sama procedura
> POZIOMU B była w tym środowisku **niewykonalna od pierwszej linijki**.

| Kanał | Wynik testu 2026-08-23 | Retest 2026-09-01c (F-151) |
|---|---|---|
| `web_fetch` na `isap.sejm.gov.pl` | `ROBOTS_DISALLOWED` | bez zmian; nadto `curl` dostaje **pętlę 302 na samego siebie** — kanał martwy także poza `web_fetch` |
| `web_fetch` na `eli.gov.pl` | `ROBOTS_DISALLOWED` | bez zmian **po stronie narzędzia**, ale `eli.gov.pl/robots.txt` = `User-Agent: * / Disallow:` (pusty) i `curl` zwraca HTTP 200 |
| `web_fetch` na SKONSTRUOWANY `api.sejm.gov.pl/eli/...` | `PERMISSIONS_ERROR` — **odrzucone, zanim nastąpi połączenie** | bez zmian; ta sama ścieżka z `curl`/skryptu działa normalnie |

⛔ **Korekta nazewnicza (F-151).** Etykieta `ROBOTS_DISALLOWED` opisuje decyzję
NARZĘDZIA `web_fetch`, nie zakaz serwera. Dla `eli.gov.pl` serwer niczego nie
zakazuje. Skutek praktyczny: gdy host udostępnia wykonanie kodu z dostępem
sieciowym, RZĄD 1 jest osiągalny w pełni — łącznie z BRZMIENIEM przepisu — i
zejście na `🟨 KOTWICĘ URZĘDOWĄ` NIE jest wtedy uzasadnione. Sprawdź kanał
kodu, zanim uznasz RZĄD 1 za niedostępny.

⛔⛔ **KANAŁ KODU MA WŁASNE WYMOGI — dodane 2026-09-04 (F-157).** Ustalenie,
że „`curl` zwraca HTTP 200", jest prawdziwe **tylko dla żądania o właściwym
kształcie**. Trzy wymogi, każdy zmierzony, każdy dający objaw wyglądający jak
awaria serwisu:

| Wymóg | Objaw pominięcia | Pomiar |
|---|---|---|
| **Neutralny `User-Agent`** (`curl/8.5.0` lub brak) | HTTP 502 albo HTTP 200 ze stroną zastępczą | `orzeczenia.ms.gov.pl`: 200 pod `curl`, **502** pod pełnym łańcuchem Chrome — 5/5 każdy wariant. `python-requests` zachowuje się jak przeglądarka |
| **Nagłówek `Accept`** | HTTP 406 | SAOS bez `Accept` → **406**; `*/*` i `application/json` → 200. `curl` wysyła `*/*` sam, `urllib` **nie** |
| **Ścieżka robocza, nie root** | 302/301 na host spoza listy → `host_not_allowed` | `decyzje.uokik.gov.pl/` → 302 na `uokik.gov.pl`; `/bp/dec_prez.nsf` → 200 |

⛔ **Pełne instrukcje wywołań — `shared/DOSTEP-MASZYNOWY-API.md`** (endpointy,
tokeny, limity, ścieżki robocze). Tu stoi sama reguła; tam — jak jej użyć.

⛔ **Reguła:** podszywanie się pod przeglądarkę z adresu centrum danych jest
dla WAF-ów kilku polskich serwisów **silniejszym** sygnałem bota niż uczciwe
`curl/8.5.0`. Nie „naprawiaj" HTTP 502 łańcuchem przeglądarkowym — to go
powoduje.

⚠️ **Najgroźniejszy wariant: HTTP 200 ze stroną zastępczą.** SAOS pod UA
przeglądarkowym oddaje kod 200 i stronę „Przerwa techniczna" — awaria
przechodzi każdą kontrolę opartą na samym kodzie odpowiedzi. **Sprawdzaj
treść, nie kod.** Instrukcja operacyjna: `shared/DOSTEP-MASZYNOWY-API.md`
(osiągalna z produkcji). ⚠️ Pełne tabele pomiaru:
`audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md` §2G — materiał
dowodowy poza ścieżką produkcyjną (F-160), przywoływany jako dowód, nie jako
instrukcja. Test odtwarzający pomiar: T25 (`check_domeny_allowlist.py`).

⛔ **Narzędzie `web_fetch` odmawia pobrania URL-a, który nie pojawił się wcześniej
w wyniku `web_search` lub `web_fetch` w tej rozmowie.** URL zbudowany ze wzorca
`.../DU/{rok}/{poz}` — nawet poprawny — jest odrzucany PRZED próbą połączenia.
Oznacza to, że polecenie „web_fetch: https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}"
w brzmieniu sprzed v2.5 zawodziło w 100% przypadków.

**POPRAWNA SEKWENCJA POZIOMU B (obowiązuje od v2.5) — dwa kroki, nie jeden:**

```
B-1: web_search zapytaniem zawierającym identyfikator aktu, np.
     "api.sejm.gov.pl eli acts DU {rok} {poz} {nazwa ustawy}"
     lub "eli.gov.pl DU {rok} {poz} tekst jednolity"
     → cel: wprowadzić URL RZĘDU 1 do kontekstu rozmowy ORAZ odczytać
       ze snippetu metadane (status aktu, numer aktualnego t.j.)

B-2: web_fetch WYŁĄCZNIE na URL zwrócony w wyniku B-1 (kopiuj dosłownie,
     nie edytuj ścieżki — zmodyfikowany URL jest traktowany jak nowy
     i zostanie odrzucony)
     → sukces → ✅ [VER: ...]
     → ROBOTS_DISALLOWED → NIE improwizuj. Przejdź do KOTWICY URZĘDOWEJ niżej.
```

### ⛔⛔⛔ GAŁĄŹ BLOKADY — BRAMKA ANTY-FASADOWA + KOTWICA URZĘDOWA

> Treść wydzielona 2026-09-10b (F-180) do `shared/PRAWO-HARDGATE-BLOKADA.md`.
> Bez zmian merytorycznych. Powód wydzielenia: 201 linii czytanych w każdej turze,
> a stosowanych wyłącznie po nieudanym dostępie do RZĘDU 1.

```
B-1 lub B-2 zwrócił blokadę (ROBOTS_DISALLOWED, PERMISSIONS_ERROR,
pętla 302, HTTP 4xx/5xx) I kanał kodu też zawiódł?
        │
        ├── NIE  → gałąź nie dotyczy, kontynuuj procedurę niżej
        │
        └── TAK  → ⛔ STOP. NATYCHMIAST:
                       view shared/PRAWO-HARDGATE-BLOKADA.md
```

⛔ **Do czasu wykonania tego `view` NIE WOLNO:**
- nadać znacznika 🟨 (kotwica urzędowa) ani ⚠️ (niezweryfikowane),
- napisać, że źródło jest niedostępne — Reguła 12d (REM-0) wymaga pomiaru
  dwukanałowego, którego procedura leży w wydzielonym pliku,
- wymyślić statusu pośredniego („pamięć normatywna”, „znane brzmienie”,
  „stan powszechnie znany”). To jest udokumentowany tryb awarii, nie hipoteza.

⛔ Pominięcie tego odczytu po padnięciu wyzwalacza jest **naruszeniem HARD GATE**,
a nie skróceniem procedury. Kontrola `[PROFIL-ODROCZENIA]` w
`prawny-router-v3/references/SELF-CHECK.md` traktuje „blokada padła, `view` nie ma”
jako bramkę niewykonaną.

## PROCEDURA OBOWIĄZKOWA PRZED KAŻDYM PRZEPISEM

```
KROK 1: Zidentyfikuj akt prawny (nazwa ustawy / kodeksu)

KROK 2: Weryfikacja online — sekwencja ŹRÓDEŁ (zatrzymaj się na pierwszym działającym):

  ŹRÓDŁO-0 (strukturalne, deterministyczne — ZAWSZE próbuj przed wszystkimi):
    ⛔ OD v2.5: NIE web_fetch na skonstruowany URL — narzędzie odrzuca takie
       adresy przed połączeniem. Obowiązuje sekwencja DWUKROKOWA B-1 → B-2,
       patrz sekcja "OGRANICZENIE ŚRODOWISKA" wyżej. Gdy B-2 zwraca blokadę
       robots → sekcja "🟨 KOTWICA URZĘDOWA", NIE improwizacja statusu.
    Konektor MCP (get_act / verify_article / verify_signature) — gdy dostępny,
    lub [B-1 web_search → B-2 web_fetch]: https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}[/references|/text.html]
    lub [B-1 → B-2]: https://eli.gov.pl/eli/DU/{rok}/{poz} (RZĄD 1, patrz HIERARCHIA-ZRODEL)
    → Wynik ✅: użyj. Znacznik: ✅ [VER: api.sejm.gov.pl ELI DU/RRRR/NNN, data]
    → Nie znasz roku/pozycji aktu → ustal je (ŹRÓDŁO-1/3), potem WRÓĆ do ŹRÓDŁO-0 po treść.
    → Szczegóły i reguły: sekcja "WARSTWA STRUKTURALNA (ŹRÓDŁO-0)" powyżej.

  ŹRÓDŁO-1 (autorytatywne, bezpłatne — gdy ŹRÓDŁO-0 niedostępne):
    web_search: "art. X [nazwa ustawy] isap.sejm.gov.pl tekst jednolity"
    lub web_fetch: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=[Dz.U.]
    → Wynik ✅ ISAP: użyj. Znacznik: ✅ [VER: ISAP, data]

  ŹRÓDŁO-2 (komercyjne — gdy ISAP niedostępny i kancelaria posiada dostęp):
    web_fetch: https://sip.lex.pl (Wolters Kluwer LEX)
    lub web_fetch: https://sip.legalis.pl (C.H.Beck Legalis)
    → Wynik ✅ LEX/Legalis: użyj. Znacznik: ✅ [VER: LEX/Legalis, data]
    ⚠️ UWAGA: LEX/Legalis wymagają aktywnej licencji kancelarii.
    Dla trybu PRAWNIK: stosuj równoważnie do ISAP.
    Dla trybu LAIK (pro se): poinformuj że weryfikacja pochodzi z bazy komercyjnej
      i zalecaj samodzielną weryfikację na isap.sejm.gov.pl (bezpłatny dostęp).

  ŹRÓDŁO-3 (szerokie — ostateczny fallback sieciowy):
    web_search: "art. X [ustawa] [rok bieżący] tekst obowiązujący"
    lub web_fetch: https://www.saos.org.pl (jeśli kontekst orzeczniczy)
    → Wynik ✅: użyj TYLKO tekstu z oficjalnego fragmentu (gov.pl, lex.pl, legalis.pl).
    Znacznik: ✅ [VER: web-fallback, data] + dopisz ⚠️ [ZALECANA WERYFIKACJA ISAP]

  WSZYSTKIE ŹRÓDŁA NIEDOSTĘPNE:
    → ⛔ BLOKADA TWARDA — NIE podawaj przepisu z pamięci
    → Oznacz: ⚠️ [NIEWERYFIKOWANE — wszystkie źródła niedostępne]
    → Komunikat do użytkownika:
       "Nie mogę zweryfikować art. X [ustawy] — źródła online chwilowo niedostępne.
        Proszę sprawdzić samodzielnie na isap.sejm.gov.pl lub w LEX/Legalis
        przed podpisaniem pisma / podjęciem działania prawnego."
    → Kontynuuj analizę BEZ podawania treści przepisu — użyj opisu funkcjonalnego.
    → NIE blokuj całej sesji — oznaczaj każdy niesprawdzony artykuł z osobna.

KROK 3: Znajdź artykuł → odczytaj AKTUALNE brzmienie ze źródła
KROK 4: Sprawdź datę "stan na dzień" — czy obowiązuje w dacie zdarzenia?
KROK 5: Zapisz pełne oznaczenie: art. X §Y ustawy z dnia [...] (t.j. Dz.U. z [...] r. poz. [...])
KROK 5A: Dołącz URL źródła (ISAP text.html/text.pdf, ELI) + gdy to PDF —
  kotwica #page=N do konkretnej strony z tym przepisem, jeśli znana z
  faktycznie przeczytanej treści (nie zgadnięta). Ten sam wymóg linku i
  lokalizacji co dla orzeczeń (patrz "PROCEDURA OBOWIĄZKOWA PRZED KAŻDYM
  ORZECZENIEM", KROK 5A/5B) — dotyczy każdego źródła na stronie internetowej,
  nie tylko orzeczeń. Gdy dotarłeś tylko przez web_search bez pełnego
  web_fetch → podaj link mimo to, z adnotacją ⚠️ [NIEWERYFIKOWANE — link
  do wyniku wyszukiwania], zamiast go pomijać.
KROK 6: Dopiero teraz użyj przepisu w analizie lub piśmie
```

## ⛔ KROK 2B — WERYFIKACJA PRZEDMIOTU AKTU (nie tylko numeru Dz.U.)

> Dodano: 2026-06-14 (na podstawie AUDYT-2026-06-13b, NOTA-5).
> Nowy typ błędu: "prawdziwy cytat w złym kontekście" — numer Dz.U. ISTNIEJE
> i jest prawdziwy, ale dotyczy INNEGO aktu/zakresu niż ten, do którego
> jest przywołany w module.

**Potwierdzenie istnienia Dz.U. NIE jest równoznaczne z potwierdzeniem,
że ten akt reguluje tezę, którą się nim popiera.**

Przed użyciem jakiegokolwiek "Dz.U. RRRR poz. NNN" jako podstawy KONKRETNEJ
tezy (kwoty, taryfikatora, stawki, terminu, instytucji prawnej):

```
KROK 2B-1: Po znalezieniu Dz.U. RRRR poz. NNN na ISAP — odczytaj TYTUŁ aktu
           (pełną nazwę: "Rozporządzenie [organ] z dnia [...] w sprawie [...]"
           lub "Ustawa z dnia [...] o [...]").

KROK 2B-2: Porównaj TYTUŁ aktu z TEZĄ, którą chcesz poprzeć.
           Czy tytuł faktycznie odnosi się do tego zagadnienia
           (np. "taryfikator mandatów" vs "ewidencja punktów karnych" —
           to SĄ RÓŻNE akty, mimo że dotyczą tej samej dziedziny — ruchu
           drogowego, i mogą mieć zbliżone daty/numery)?

KROK 2B-3: Jeśli tytuł NIE odpowiada tezie → ⛔ NIE używaj tego Dz.U.
           Wyszukaj prawidłową podstawę osobnym zapytaniem
           ("[teza] podstawa prawna [rok] isap").

KROK 2B-4: Dopiero gdy tytuł aktu wprost odpowiada tezie → kontynuuj KROK 3.
```

## ⛔ KROK 2C — SPRAWDZENIE AKTUALNOŚCI (dodano 2026-08-23f, F-120)

> Podniesiono z `shared/TEMPORAL-LAW-CHECK.md` do rangi kroku obowiązkowego
> w tej sekwencji — poprzednia forma (lista pytań) nie wymuszała
> sprawdzenia, tylko je sugerowała.

**PRÓG STOSOWANIA:** obowiązkowy dla przepisu NIOSĄCEGO ROZSTRZYGNIĘCIE
(podstawa żądania, przesłanka decyzji, termin, wysokość świadczenia).
Opcjonalny dla przywołań czysto kontekstowych.

```
KROK 2C-1: Po potwierdzeniu tekstu jednolitego (t.j.) w KROK 2/2B —
           WYPISZ nowelizacje już uwzględnione w t.j. (z treści
           obwieszczenia), następnie OSOBNE zapytanie o WSZYSTKIE akty
           zmieniające OPUBLIKOWANE PO dacie t.j. (nie to samo zapytanie,
           które znalazło t.j.; skorygowano 2026-08-23f, po pytaniu
           użytkownika — nie zatrzymuj się na PIERWSZEJ znalezionej
           nowelizacji, między t.j. a dziś mogło ich być kilka kolejno).

KROK 2C-2: Zapisz PEŁNĄ LISTĘ chronologiczną wyników w KAŻDYM przypadku,
           także gdy pusta — „sprawdzono akty zmieniające po [data t.j.]
           — brak" jest informacją; milczenie NIE jest równoważne
           wynikowi negatywnemu. Gdy nowelizacji więcej niż jedna, ustal,
           które brzmienie obowiązuje NA DATĘ ANALIZY (uwzględniając
           kolejność wejścia w życie i ewentualne vacatio legis) —
           nie zakładaj automatycznie, że najnowsza znaleziona = aktualna.

KROK 2C-3: Przy blokadzie źródła na KROK 2C-1 → status 🟨 [KOTWICA-URZĘDOWA]
           (warunki K-1…K-4 niżej), NIGDY milczące pominięcie kroku.
```

Pełna procedura i uzasadnienie: `shared/TEMPORAL-LAW-CHECK.md`.

### GDZIE SZUKAĆ NOWELIZACJI PO t.j. — adresy (dodano 2026-09-01k, F-156)

| Co | Gdzie |
|---|---|
| lista dla konkretnego t.j. | `api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/references` → sekcja **„Nowelizacje po tekście jednolitym"** |
| kontrola uzupełniająca — ta sekcja bywa NIEPEŁNA | akty zmieniające AKTU BAZOWEGO (`…/references` → „Akty zmieniające") z datą promulgacji późniejszą niż data t.j. |
| dojście od t.j. do aktu bazowego | `…/references` obwieszczenia → sekcja „Tekst jednolity dla aktu" (⛔ NIE przez wyszukiwanie po tytule — trafia w akty zmieniające) |
| bramka zatrzymująca zamiatanie | `audyt-systemu-v4/scripts/check_wyjatek_gate_eli.py` (F-153) |
| lista takich pozycji w całym repozytorium | `audyt-systemu-v4/scripts/check_nowelizacje_po_tj.py` (T24) |

⛔ **Unia, nie wybór.** Pomiar F-155 na 19 aktach: sekcja API zgadza się
z metodą datową w 16 przypadkach, a w 3 jest jej WŁAŚCIWYM PODZBIOREM —
brakowało czterech ustaw zmieniających, wszystkich obowiązujących, w tym jednej
od ośmiu miesięcy. Rozbieżności odwrotnej nie zaobserwowano ani razu. Oparcie
kontroli na samej sekcji daje fałszywy negatyw.

⛔⛔ **Zakaz przepisywania wyniku do map i modułów** (F-156, rozstrzygnięcie
rozszerzone 2026-09-01k). Liczba nowelizacji po t.j. rośnie z każdą publikacją
Dz.U., więc wpisana do mapy zestarzeje się w tygodniach. Nie pomaga też sam
znacznik bez liczby: **oznaczenie przy jednych pozycjach twierdzi coś
o pozostałych** — wiersz bez znacznika czyta się jako „tu t.j. wystarczy",
a to zdanie o stanie rejestru na dzień oznaczania, nie na dzień użycia.
Mapa wskazuje AKT; czy sam t.j. wystarczy, rozstrzyga się tutaj, w momencie
użycia.


⛔ ZAKAZ: oznaczania ✅ [VER: ISAP, data] na podstawie samego potwierdzenia,
że numer Dz.U. istnieje. Znacznik ✅ [VER] wymaga potwierdzenia ISTNIENIA
ORAZ PRZEDMIOTU (tytułu) aktu zgodnego z tezą.

---

## ⛔⛔⛔ WYZWALACZ ZAŁĄCZNIKA ORZECZNICZEGO — BINARNY, BEZ OCENY

*(podział 2026-08-23h, flaga F-111, wariant B zatwierdzony przez użytkownika)*

```
JEŻELI w odpowiedzi, piśmie lub dokumencie ma się pojawić SYGNATURA
ORZECZENIA — w jakiejkolwiek postaci, także niepełnej, także „z pamięci",
także jako przykład, także w cudzysłowie cudzej wypowiedzi:

    view shared/PRAWO-HARDGATE-ORZECZENIA.md

NIE WOLNO kontynuować bez tego wczytania.
```

⛔ **Wyzwalaczem jest SYGNATURA, nie ocena własnej potrzeby.** Nie brzmi on
„gdy potrzebujesz procedury szczegółowej" ani „gdy sprawa jest orzecznicza" —
takie sformułowanie wymagałoby oceny, a to właśnie oceny zawiodły w pilotażu
LEX MACHINA (trzy z czterech usterek to reguła, która istniała i nie zadziałała).
Sprawdzian jest mechaniczny: **czy w tekście stoi lub ma stanąć sygnatura?**
Jeśli tak — wczytaj. Jeśli nie masz pewności, czy to sygnatura — wczytaj.

⚠️ **RYZYKO WPROWADZONE TYM PODZIAŁEM, nazwane wprost.** Do 2026-08-23h
procedura orzecznicza była w tym pliku i czytało się ją mimowolnie. Po podziale
wymaga świadomego kroku, więc zamieniamy tryb awarii „reguła przeczytana i
pominięta" na „reguła niewczytana". To NIE jest oczywista poprawa i nie została
zmierzona — pomiar należy do **F-113** (test z grupą kontrolną). Do czasu tego
pomiaru traktuj wyzwalacz jak każdą inną bramkę samo-raportującą: obecność
reguły w pliku nie dowodzi zmiany zachowania.

**Co konkretnie znajduje się w załączniku** (żeby nie trzeba go było otwierać,
by ustalić, czy warto go otwierać):
- PROCEDURA OBOWIĄZKOWA PRZED KAŻDYM ORZECZENIEM (bramka WTÓRNE-ŹRÓDŁO-STOP,
  KROK 5A lokalizacja w źródle, KOTWICA-TEKSTOWA KT-1→KT-4)
- KROK 5B — wyroki TK z okresu 2024-2026, sporny status publikacji
- Postępowanie, gdy weryfikacja sygnatury się nie powiedzie
- KROK DODATKOWY — warstwy uzasadnienia [1] ustalenie sądu / [2] wykładnia
  sądu / [3] zreferowane twierdzenie strony
- SELF-CHECK przed każdą odpowiedzią z orzecznictwem

**Co ZOSTAŁO w tym pliku i obowiązuje ZAWSZE, także przy orzeczeniach:**
zasada absolutna, PERMANENT GATE, reguła aktualności, hierarchia statusów
(`✅ [VER]` / `🟨 [KOTWICA-URZĘDOWA]` / `⚠️ [NIEWERYFIKOWANE]` / `🎯 [CEL — NIEOTWARTE]`),
BRAMKA ANTY-FASADOWA (AF-1…AF-6) i procedura przed każdym PRZEPISEM.
Załącznik ich nie powtarza i nie zastępuje — **dokłada się do nich**.

## ⛔⛔ OBOWIĄZEK WIDOCZNEGO ZNACZNIKA W DOSTARCZONEJ ODPOWIEDZI — BEZWARUNKOWY

> Dodano: 2026-08-27, na żądanie użytkownika — luka wykryta w sesji: przepisy
> zostały faktycznie zweryfikowane przez `web_search` w tej samej turze, ale
> dostarczona odpowiedź nie niosła przy żadnym z cytatów widocznego znacznika
> statusu. Z perspektywy odbiorcy odpowiedź bez znacznika przy przepisie jest
> nieodróżnialna od cytatu z pamięci — niezależnie od tego, co faktycznie
> wykonano w tle. Weryfikacja niewidoczna w dostarczonym tekście **nie
> spełnia** tego HARD GATE.

**Reguła, bez wyjątków:**

Każde powołanie przepisu, artykułu, paragrafu, ustępu, punktu, stawki,
terminu, kary, sankcji lub sygnatury orzeczenia **w tekście dostarczonej
użytkownikowi odpowiedzi** musi nieść bezpośrednio przy sobie jeden ze
znaczników statusu zdefiniowanych w tym pliku: `✅ [VER: źródło, data]` /
`🟨 [KOTWICA-URZĘDOWA]` / `⚠️ [NIEWERYFIKOWANE]` / `🎯 [CEL — NIEOTWARTE]`.

Obowiązek ten NIE zależy od (wyliczenie zamknięte):

1. trybu odpowiedzi (LAIK / PRAWNIK);
2. formy odpowiedzi (pismo procesowe, analiza kazusu, notatka, odpowiedź
   konwersacyjna) — dotyczy również sytuacji, gdy treść merytoryczna
   pochodzi z modułu dziedzinowego już oznaczonego jako zweryfikowany przy
   poprzedniej edycji tego modułu; weryfikacja modułu w przeszłości nie jest
   weryfikacją cytatu w bieżącej odpowiedzi;
3. liczby przepisów cytowanych w jednej odpowiedzi;
4. subiektywnej pewności modelu co do treści przepisu;
5. tego, czy weryfikacja miała miejsce we wcześniejszym kroku TEJ SAMEJ
   odpowiedzi bez pokazania znacznika w miejscu samego cytatu.

⛔ Znacznik pokazany zbiorczo w JEDNYM miejscu odpowiedzi (np. nagłówek
„podstawa: ... zweryfikowano dnia ...") NIE zwalnia z oznaczenia PRZY KAŻDYM
pojedynczym powołaniu w dalszej części tekstu. Zbiorczy nagłówek
weryfikacyjny, niepowtórzony przy każdym przepisie, jest wariantem BRAMKI
ANTY-FASADOWEJ opisanej wyżej: buduje w oczach czytelnika wrażenie pełnego
pokrycia, którego pojedyncze cytaty w treści faktycznie nie niosą.

Brak znacznika przy jakimkolwiek powołaniu w dostarczonej odpowiedzi =
naruszenie HARD GATE na równi z cytowaniem z pamięci — niezależnie od tego,
czy weryfikacja faktycznie miała miejsce w tle.

## SKUTKI NARUSZENIA

Naruszenie tego hardgate = błąd dyskredytujący całą analizę lub pismo.
Halucynacja przepisu lub sygnatury = ryzyko odpowiedzialności i utraty sprawy przez klienta.

## JEDYNY DOZWOLONY WYJĄTEK

Ogólne zasady procesowe powszechnie znane (np. "ciężar dowodu spoczywa na powodzie") mogą być podawane bez cytowania artykułu — ale BEZ podawania numeru przepisu jeśli nie był on weryfikowany online w tej samej odpowiedzi.

Zasada: **brak numeru artykułu jest lepszy niż błędny numer artykułu.**
Zasada: **brak sygnatury jest lepszy niż sygnatura nieweryfikowana lub fałszywa.**

---


---

## HISTORIA WERSJI

Przeniesiona 2026-09-10b (F-180, ZASADA 15) do `shared/references/CHANGELOG.md`,
sekcja *PRAWO-HARDGATE*.
