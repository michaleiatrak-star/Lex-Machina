# DOSTĘP MASZYNOWY DO ŹRÓDEŁ — jak wywołać API, żeby odpowiedziało

> **Plik:** `shared/DOSTEP-MASZYNOWY-API.md`
> **Wersja:** 1.6 (2026-09-14) — CBOSA retrieval/snapshot: `site:` tylko discovery; obowiązkowy POST-CHECK HOSTA, exact-match i content_scope bez promocji snapshotu do DIRECT_LIVE.
> **Wersja poprzednia:** 1.5 (2026-09-14) — CBOSA: historyczny pomiar 503 oddzielony
> od bieżącej reguły wykonawczej; dodano fresh-probe + deterministyczny
> formularz HTML (/cbo/search, /cbo/find, /doc/{ID}) i exact-match.
> Fallback indeksowy pozostaje tylko po niedostępności direct CBOSA.
> **Wersja poprzednia:** 1.4 (2026-09-13d) — §1: trzeci reżim UA (SAOS i cała rodzina
> `orzeczenia.*.gov.pl` odrzucają łańcuch przeglądarkowy) + odnotowany fałszywy
> alarm „awaria MS"; §3: dosłowny 17-pozycyjny kontekst Tapestry, portale sądów
> jako warstwa rozstrzygania AMBIGUOUS, zamienniki CBOSA odrzucone na
> `robots.txt`, sprostowanie statusu `www.sn.pl`; §4: REGON/BIR — blokada
> proceduralna (F-158c zamknięta). Flagi F-187…F-192, AUDYT-2026-09-13d.
> **Wersja poprzednia:** 1.3 (2026-09-13c) — ponowny pomiar listy dozwolonych domen
> (T25, 52 sondy): odblokowane 6 hostów, w tym `wl-api.mf.gov.pl` (F-157b);
> sprostowana ścieżka HUDOC (F-186a); CBOSA potwierdzona jako regresja
> niezależna od listy. AUDYT-2026-09-13c.
> **Wersja poprzednia:** 1.2 (2026-09-13b) — §3: kanał zdegradowany CBOSA przez indeks
> wyszukiwarki (F-183a) oraz sprostowanie statusu `nsa.gov.pl`.
> **Wersja poprzednia:** 1.1 (2026-09-13) — §1: wyjątek `sn.pl` od reguły neutralnego UA
> oraz rozróżnienie „403 proxy vs 403 WAF"; §3: przepisany inwentarz
> orzecznictwa na pomiarze (SN snproxy, GET po sygnaturze w `orzeczenia.ms.gov.pl`,
> okno pokrycia SAOS, CBOSA martwa w obu kanałach, KIO bez filtra).
> Flagi F-182…F-186, AUDYT-2026-09-13.
> **Wersja poprzednia:** 1.0 (2026-09-04c) — utworzony po wykryciu, że instrukcje dostępu
> istniały wyłącznie w `audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md`,
> czyli w skillu narzędziowym, **którego żaden skill produkcyjny nie wczytuje**
> (zależność sprawdzona: `audyt-systemu-v4` nie występuje w `dependencies.requires`
> ani `prawny-router-v3`, ani `analiza-sadowa-v6`, ani `prawo-polskie-v2`,
> ani `pisma-procesowe-v3`, ani `orzeczenia-sadowe-v2` — wszystkie wzmianki
> o tym skillu są narracyjnymi cytatami flag, nie wczytaniem). Flaga F-159.
> **Wczytaj:** zawsze, gdy weryfikacja ma iść kanałem kodu (`curl`/skrypt),
> a nie `web_fetch`.

⛔ **Ten plik NIE rozstrzyga, czy z danego źródła wolno cytować.** To robi
`shared/HIERARCHIA-ZRODEL.md` (moc źródła) i `shared/PRAWO-HARDGATE.md`
(obowiązek weryfikacji). Tu jest wyłącznie **jak** wywołać, żeby dostać
odpowiedź zamiast fałszywej awarii.

⛔ **Podział odpowiedzialności — nie duplikuj.** Pomiar osiągalności i jego
dowód mieszkają w `audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md`
(inwentarz + test T25 `check_domeny_allowlist.py`). Tutaj stoi **wyciąg
operacyjny**, którego potrzebuje skill produkcyjny w trakcie pracy. Przy
rozbieżności rozstrzyga pomiar, nie ten plik.

---

## 1. USTAWIENIA DOMYŚLNE — obowiązują przy KAŻDYM wywołaniu

```
User-Agent: curl/8.5.0        # ⛔ NIE łańcuch przeglądarkowy
Accept: */*                   # ⛔ obowiązkowy
timeout >= 60 s
ponowienie: 2 przy 5xx
```

### Dlaczego to nie jest kosmetyka — trzy pomiary

| Wymóg | Objaw pominięcia | Zmierzone 2026-09-04 |
|---|---|---|
| neutralny `User-Agent` | HTTP 502 **albo 200 ze stroną zastępczą** | `orzeczenia.ms.gov.pl`: 200 pod `curl`, **502** pod pełnym łańcuchem Chrome — 5/5 każdy wariant; `python-requests` zachowuje się jak przeglądarka |
| nagłówek `Accept` | HTTP 406 | SAOS bez `Accept` → **406**; `*/*` i `application/json` → 200. `curl` wysyła `*/*` sam, `urllib` **nie** |
| ścieżka robocza, nie root | 301/302 na host spoza listy → `host_not_allowed` | `decyzje.uokik.gov.pl/` → 302 na `uokik.gov.pl`; `/bp/dec_prez.nsf` → 200 |

⛔ **Reguła odwrotna do intuicji:** podszywanie się pod przeglądarkę z adresu
centrum danych jest dla WAF-ów kilku polskich serwisów **silniejszym** sygnałem
bota niż uczciwe `curl/8.5.0`. Nie „naprawiaj" HTTP 502 łańcuchem
przeglądarkowym — to go powoduje.

### ⚠️ WYJĄTEK ZMIERZONY — `sn.pl` wymaga UA przeglądarkowego (2026-09-13)

Reguła neutralnego UA jest **domyślna, nie uniwersalna**. Jeden host zachowuje
się odwrotnie:

| Wywołanie | `curl/8.5.0` | UA Chrome |
|---|---|---|
| `sn.pl/index.php?option=com_ajax&plugin=snproxy&…` | **403 (strona WAF serwisu)** | **200, JSON** |
| `orzeczenia.ms.gov.pl` | 200 | 502 |

Minimalny warunek dla `sn.pl`: **sam nagłówek `User-Agent` przeglądarkowy**
wystarcza (zmierzone: `Accept: */*` bez `Sec-Fetch-*` i bez `Referer` → 200).
Pełny łańcuch przeglądarkowy nie jest wymagany.

⛔ **Skutek:** reguła §1 czytana jako globalna sama odcinała dostęp do jedynego
dziś żywego kanału RZĘDU 1 dla orzecznictwa SN. Wyjątek jest wąski i dotyczy
wyłącznie `sn.pl` — dla pozostałych hostów obowiązuje `curl/8.5.0`.

#### Rozszerzenie pomiaru — 2026-09-13d, F-190 (12 hostów, oba reżimy)

Wyjątek `sn.pl` potwierdzony niezależnie. Pomiar dokłada **drugi kierunek**:
łańcuch przeglądarkowy nie jest tylko „zbędny", lecz **aktywnie odrzucany** przez
dwa dalsze kanały RZĘDU 1/2A — i dotyczy to **całej rodziny** Portali Orzeczeń,
nie samego agregatu.

| Host | `curl` (neutralny) | pełny łańcuch Chrome |
|---|---|---|
| `www.saos.org.pl/api/search/judgments` | **200, JSON** | ⛔ **403** |
| `orzeczenia.ms.gov.pl` | 200 | ⛔ 502 |
| `orzeczenia.poznan.so.gov.pl` | 200 | ⛔ 502 |
| `orzeczenia.szczecin.sa.gov.pl` | 200 | ⛔ 502 |
| `orzeczenia.warszawa.so.gov.pl` | 200 | ⛔ 502 |
| `api.stat.gov.pl`, `ipo.trybunal.gov.pl` | 200 | 200 (obojętny) |
| `orzeczenia.nsa.gov.pl` (CBOSA) | 503 | 503 (martwy w obu) |

⛔ **Reguła po tym pomiarze — trzy reżimy, nie dwa:** (a) domyślnie `curl/8.5.0`;
(b) `sn.pl` — UA przeglądarkowy; (c) SAOS i **każdy** host `orzeczenia.*.gov.pl` —
neutralny **obowiązkowo**, łańcuch przeglądarkowy je psuje. Nie ma ustawienia
globalnego, które obsłuży (b) i (c) naraz — dobór jest per-host.

⚠️ **Pułapka zaobserwowana w sesji 2026-09-13d (do nie powtórzenia):** po
przełączeniu wszystkich sond na łańcuch przeglądarkowy cztery Portale Orzeczeń
zaczęły zwracać 502, co zostało wstępnie zinterpretowane jako awaria po stronie
MS. Po powrocie do UA neutralnego — 200 na wszystkich czterech. Objawem był kod
502; „awaria MS" była hipotezą przyczynową i była **fałszywa** (ZASADA 14:
zgłaszaj objaw, nie przyczynę).

### ⛔⛔ 403 PROXY ≠ 403 WAF — rozróżnienie obowiązkowe przed orzeczeniem o blokadzie

Zanim zapiszesz „serwis blokuje bota", przeczytaj **nagłówek odpowiedzi**:

```
403 + x-deny-reason: host_not_allowed  → odmowa PROXY, nie serwisu.
                                          Host poza listą dozwolonych domen.
403 + strona HTML, bez x-deny-reason   → WAF serwisu.
503 + "upstream connect error …"       → proxy PRÓBOWAŁO połączyć i nie zdołało.
                                          Host JEST na liście; awaria jest po
                                          stronie serwisu albo trasy do niego.
```

⚠️ **Trzeci wiersz czyta się dokładniej niż dwa pierwsze — rozstrzyga końcówka
komunikatu.** Zmierzone 2026-09-13c, trzy hosty, dwa różne tryby:

| Host | `latest reset reason` | Odczyt |
|---|---|---|
| `orzeczenia.nsa.gov.pl` | `remote connection failure` | serwis odrzuca/zrywa połączenie |
| `legislacja.rcl.gov.pl` | `connection timeout` | serwis nie odpowiada w ogóle |
| `trybunal.gov.pl` | `connection timeout` | j.w. (podstrony `ipo`/`otkzu` żyją) |

⛔ **Lista dozwolonych jest wyliczeniowa, nie wzorcowa.** `www.saos.org.pl` → 200,
a `www.sn.pl` → `host_not_allowed`; przy czym `sn.pl` bez prefiksu działa. Prefiks
`www.` to **osobna pozycja listy**. Kontrola neutralna (`example.com`,
`www.wikipedia.org` → `host_not_allowed`) pokazuje, że lista pozostaje zamknięta
nawet wtedy, gdy pojedyncze hosty zostały do niej dopisane — nie wnioskuj
o otwarciu całego ruchu z faktu, że jeden host nagle odpowiada.

Przypadek referencyjny (F-186): `www.sn.pl` zwraca 403 z
`x-deny-reason: host_not_allowed` i treścią „Host not in allowlist" — **serwis
tego żądania nigdy nie zobaczył**. Ten sam serwis pod adresem **`sn.pl` bez
`www`** odpowiada normalnie. Zapis „sn.pl → 403, blokada bota" powstał z
odczytania odmowy proxy jako zachowania serwisu i przez dwie tury blokował
rozpoznanie działającego API.

⚠️ Konsekwencja praktyczna: **nazwa hosta z `www.` i bez `www.` to dwie różne
pozycje listy dozwolonych domen.** Przy 403 sprawdź wariant bez prefiksu,
zanim orzekniesz cokolwiek o serwisie. Braku hosta na liście nie naprawia się
nagłówkami — naprawia się wpisem w konfiguracji sieci.

⚠️⚠️ **Najgroźniejszy wariant: HTTP 200 ze stroną zastępczą.** SAOS pod UA
przeglądarkowym oddaje kod 200 i stronę „Przerwa techniczna" — awaria
przechodzi każdą kontrolę opartą na kodzie odpowiedzi. **Sprawdzaj treść,
nie kod.**

### Trzy rozróżnienia, na których łatwo się przewrócić

1. **404 dziedzinowy ≠ 404 techniczny.** Komunikat aplikacji („Nie znaleziono
   informacji o ID: 1") dowodzi, że endpoint **żyje**; 404 ze `"path"` — że go
   nie ma. Mylenie ich prowadzi do wniosku „API nie istnieje" tam, gdzie istnieje.
2. **Pusta lista ≠ błąd.** UODO na oknie `1M` zwraca `[]` przy HTTP 200. To
   poprawna odpowiedź „brak dokumentów w oknie".
3. **Jedna próba nie orzeka.** `bzp.uzp.gov.pl` oddaje 404 w ~20% żądań na
   całym hoście (root 2/8, `Default.aspx` 2/10). Ponawiaj, zanim orzekniesz.

⛔ **Pomiar rate-limit z 2026-09-04 jest HISTORYCZNY, nie globalny.**
W tamtym przebiegu po 503 ×3 i 60 s pauzy pojawiło się 200/200/200. Późniejsze
pomiary 2026-09-13/14 w kolejnych runtime'ach, także po zmianie kontenera/egressu
i po pauzach, utrzymały 503 `remote connection failure`. Wniosek operacyjny:
zawsze fresh-probe; nie zakładaj ani trwałego rate-limit, ani globalnej awarii.
Tempo nadal ograniczaj, ale samo odczekanie 60 s NIE jest procedurą naprawczą.

---

## 2. AKTY PRAWNE (RZĄD 1)

| Kanał | Adres | Uwaga |
|---|---|---|
| ✅ **ELI Sejmu** | `api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}` | JSON; `/text.pdf`, `/references`. Bez klucza |
| ✅ **ELI (mirror)** | `eli.gov.pl/api/acts/DU/{rok}/{poz}` | ten sam korpus |
| ⛔ **ISAP** | — | **kanał maszynowy MARTWY**: Imperva odbija pętlą 302 na ten sam adres, także pod neutralnym UA |

⛔ **Skutek praktyczny dla reguły „ISAP każdy przepis":** brzmienie
**weryfikuj przez ELI**, a **ISAP powołuj jako adres dla człowieka** w piśmie.
To nie jest obejście HARD GATE — ELI jest tym samym publikatorem w RZĘDZIE 1
(patrz `shared/HIERARCHIA-ZRODEL.md`, REALIA DOSTĘPNOŚCI).

---

## 3. ORZECZNICTWO

### Prawo UE — ⭐ CELLAR (Urząd Publikacji UE), obejście blokady EUR-Lex

⛔ **EUR-Lex blokuje dostęp maszynowy z kontenera:** `eur-lex.europa.eu` zwraca
**HTTP 202 i 0 bajtów** na HTML i na PDF, przez CELEX i przez ELI (zmierzone 2026-09-16h
i ponownie 2026-09-17u). Kanał „wyszukiwarka → pobranie strony" działa, ale zwraca dokument
**od początku** i ucina długie akty — RODO zatrzymywało się na art. 47.

⭐ **Kanał, który działa:** repozytorium **Cellar**:

```
curl -sL -H "Accept: application/xhtml+xml" -H "Accept-Language: pol" \
     -o akt.xhtml "http://publications.europa.eu/resource/celex/32016R0679"
```

| Nagłówek `Accept` | Wynik (2026-09-17u) |
|---|---|
| `application/xhtml+xml` | **200**, 840 814 B — pełny akt, wersja polska |
| `application/xml;notice=object` | 200, 6 955 B — metryka (notice), bez treści |
| `text/html`, `application/pdf` | 404 |

⭐ Zaleta wobec pobrania strony: **cały akt trafia do pliku**, więc artykuły z końca
(np. art. 83 RODO) wycina się lokalnie, bez limitu kontekstu. Adres buduje się z numeru
CELEX: `resource/celex/<CELEX>`. Język wskazuje `Accept-Language` (`pol`).
⚠️ Dokument to XHTML z Dz.Urz. UE — przed cięciem usuń znaczniki i scal białe znaki.
⚠️ Cellar podaje **wersję pierwotną** aktu; wersję skonsolidowaną trzeba wskazać numerem
CELEX wersji skonsolidowanej (`0` + numer + data, np. `02016R0679-20160504`).

### SAOS — `www.saos.org.pl` (SN, NSA/WSA, sądy powszechne, TK, KIO)

Dokumentacja: `www.saos.org.pl/help/index.php/dokumentacja-api`. Bez klucza.

| API | Adres |
|---|---|
| przeszukiwanie | `/api/search/judgments` |
| pobieranie hurtowe | `/api/dump/judgments` |
| pojedyncze orzeczenie | `/api/judgments/{id}` |

⭐ **Parametr o największej wartości dla pracy prawniczej:**
`lawJournalEntryCode=RRRR/PPP` zwraca orzeczenia **powołujące konkretną
pozycję Dz.U.** (np. `1997/553` = KK). To jedyny znany maszynowy most
„przepis → orzecznictwo go stosujące".
Dalej: `courtType` (`COMMON`/`SUPREME`/`ADMINISTRATIVE`/`CONSTITUTIONAL_TRIBUNAL`/
`NATIONAL_APPEAL_CHAMBER`), `all` (pełny tekst), `sortingField=JUDGMENT_DATE`.

⭐ **Parametr kontroli istnienia sygnatury:** `caseNumber=SYGNATURA` — dopasowanie
dokładne, wielkość liter bez znaczenia. Zmierzone 2026-09-13: `III CZP 25/11` → 1,
`iii czp 25/11` → 1, `III CZP 999/11` → 0, `CZP 25/11` (bez izby) → 0.
⛔ **Nie używaj `all=` do sprawdzania, czy sygnatura istnieje** — `all=III CZP 999/11`
zwraca **67 576 trafień** na fabrykacie. Procedura: `shared/SYGNATURY.md`, V-SYG-0.

⚠️ `pageSize` **≥ 10** — mniej to HTTP 400. Indeks bywa wolny, nie skracaj timeoutu.

⚡ **Dostępność — pomiar 2026-09-17s (F-171):** wszystkie trzy endpointy **wróciły**:
`/api/search/judgments` (także z `caseNumber`) → 200, `/api/judgments/{id}` → 200,
`/api/dump/judgments?pageSize=10` → 200. Regresja z 2026-09-09 (HTTP 502) **ustąpiła**.
⛔ Kanał jest NIESTABILNY: w serii prób zmierzono `000` (brak odpowiedzi / timeout) w 5 z 8
wywołań, po czym to samo zapytanie zwracało 200 w < 1 s. **Zawsze powtarzaj próbę
(min. 3 razy) przed uznaniem sygnatury za niesprawdzalną** — pojedyncze `000` nie jest
dowodem niedostępności ani nieistnienia orzeczenia.
⚠️ Pokrycie potwierdzone ponownie: `III CZP 88/15` (SN, 2015) → 1 trafienie;
`III OSK 1959/22` i `II SAB/Wa 678/21` (NSA/WSA, 2021–2023) → 0 trafień = **OUT_OF_SCOPE**,
nie „nie istnieje".
⛔ SAOS to RZĄD 2A — ustala, że orzeczenie istnieje i co zawiera; **nie
zastępuje sprawdzenia sygnatury u źródła** przy powołaniu w piśmie.

⛔⛔ **SAOS jest korpusem CZĘŚCIOWO ZAMROŻONYM.** Żywy jest wyłącznie pion sądów
powszechnych. Zmierzone 2026-09-13 (przedziałem dat, nie sortowaniem — baza
zawiera daty `3013-12-04` i `0208-03-14`):

| `courtType` | rekordów | najnowsze |
|---|---:|---|
| `COMMON` | 471 591 | 2026-09-09 ✅ |
| `SUPREME` | 38 081 | 2016-06-22 ⛔ |
| `ADMINISTRATIVE` | 0 | — ⛔ |
| `CONSTITUTIONAL_TRIBUNAL` | 9 503 | 2015-12-09 ⛔ |
| `NATIONAL_APPEAL_CHAMBER` | 22 168 | 2018-09-06 ⛔ |

Zero trafień poza tym oknem to **OUT_OF_SCOPE, nigdy NOT_FOUND** (K-SYG-1).

### ⭐ SN — `sn.pl`, proxy AJAX `snproxy` (JSON, nieudokumentowane, zmierzone 2026-09-13)

⛔ Wymaga **UA przeglądarkowego** — wyjątek od §1, patrz tam.

⚠️ **Sprostowanie 2026-09-13d (F-187):** wcześniejszy zapis „`sn.pl` bez `www.` —
`www.sn.pl` jest poza listą dozwolonych domen" **już nie obowiązuje**. Zmierzone
równolegle: **obie** formy zwracają HTTP 200 i poprawny JSON. `/index.php`
oddaje 301 na `/pl/` — `requests` i `curl -L` podążają za nim i same utrzymują
ciasteczka Imperva w obrębie wywołania, więc kod działa bez zmian; `curl` **bez**
`-L` dostanie pustą odpowiedź i 301, co łatwo wziąć za awarię API.
Zapis w `scripts/weryfikator_sygnatur.py` (`SN = "https://sn.pl/index.php"`) jest
funkcjonalnie poprawny — nieaktualne jest wyłącznie jego uzasadnienie w komentarzu.

```
GET https://sn.pl/index.php?option=com_ajax&plugin=snproxy&format=json&task=…

task=searchOrzeczenia&sygnatura=III CZP 25/11&strona=1&rozmiar_strony=25
     → data[0].data[] : sygnatura_sprawy, data_wydania, forma_orzeczenia, id
task=detailsOrzeczenie&id=…
     → jednostka_obslugujaca_sprawe, izby_sn, rodzaj_skladu_orzekajacego,
       sklad_orzekajacy[], przewodniczacy, sprawozdawca, autor_uzasadnienia
task=OrzeczeniePlikHtml&id=…   → data.raw = PEŁNY TEKST w base64
task=OrzeczeniePlikPdf&id=…    → j.w., PDF
Adres dla człowieka: https://sn.pl/pl/wyszukiwarka-orzeczen?orzeczenie={id}
```

Zmierzone: `III CZP 25/11` → uchwała 7 sędziów z 2011-10-18, skład z Prezesem SN
Erecińskim, pełny tekst 198 kB; `III CZP 30/25` → rekord z 2026 (baza bieżąca);
`III CZP 999/11` → pusta lista. **To zamyka lukę SN, której SAOS nie zamyka.**

⚠️⚠️ **API dopasowuje NIEŚCIŚLE — post-check obowiązkowy.** Zapytanie
`I NSNc 10/24` zwraca rekord `II NSNc 10/24` z `success: true`. Bez porównania
pola `sygnatura_sprawy` z sygnaturą pytaną kontrola potwierdzi orzeczenie,
którego nie ma (V-SYG-0.4).
⚠️ Podwójna spacja w sygnaturze → 0 trafień. Normalizuj **przed** zapytaniem.

### ⭐ Sądy powszechne — GET po sygnaturze (zmierzone 2026-09-13)

Portal Orzeczeń odpytuje się bez sesji, po zakodowaniu kontekstu Tapestry
(spacja → `$0020`, `/` → `$002f`):

Kontekst aktywacji Tapestry ma **17 pozycji**, sygnatura stoi na **pozycji 2**,
po nich numer strony (doprecyzowane 2026-09-13d — wcześniejszy zapis „`$N…(×15)`"
był nieodtwarzalny; poniższa postać jest dosłowna i działa po skopiowaniu):

```
https://orzeczenia.ms.gov.pl/search/advanced/$N/{SYGNATURA}/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/1
FOUND:      <span class="big_number">N</span> + odnośniki /details/$N/{docId}
NOT_FOUND:  „Nie znaleziono żadnego wyniku pasującego do zapytania"
```

Zmierzone: `I C 100/15` → 9 trafień (poprawny **AMBIGUOUS** — sygnatura SR/SO
nie jest unikalna krajowo); `I C 999999/15` → NOT_FOUND; `XI P 27/26` → NOT_FOUND.
Odtworzone niezależnie 2026-09-13d: `I C 100/15` → `big_number=9`, 18 odnośników
`/details/` — liczba zgadza się co do jednostki.

#### ⭐ Portale sądów — ta sama ścieżka, warstwa rozstrzygania AMBIGUOUS (F-191)

Ten sam kontrakt GET działa na portalu **każdego pojedynczego sądu**
(`orzeczenia.{sad}.sr|so|sa.gov.pl`) — bez sesji, UA neutralny. To nie jest
wyłącznie kanał zapasowy agregatu: **sygnatura nieunikalna krajowo bywa unikalna
w obrębie sądu**, więc portal lokalny zamienia AMBIGUOUS na rozstrzygnięcie.

| Zapytanie | Host | Wynik |
|---|---|---|
| `I C 100/15` | `orzeczenia.ms.gov.pl` (agregat) | `big_number=9` → **AMBIGUOUS** |
| `I C 100/15` | `orzeczenia.poznan.so.gov.pl` | `big_number=1` → **FOUND** |
| `I ACa 100/15` | `orzeczenia.szczecin.sa.gov.pl` | „Nie znaleziono…" → **NOT_FOUND** |

Wykaz hostów sądów z licznikami dokumentów jest w drzewie na
`orzeczenia.ms.gov.pl/search/advanced` (sekcja „Portale sądów wraz z liczbą
opublikowanych orzeczeń"). ➜ realizacja: **V-SYG-0.6** w `shared/SYGNATURY.md`.

### Pozostałe

| Źródło | Kanał | Uwaga |
|---|---|---|
| `orzeczenia.nsa.gov.pl` | HTML server-side | **FRESH-PROBE obowiązkowy.** Pomiar 2026-09-13b/c w tamtym runtime: 503 na wszystkich ścieżkach; nie jest to globalny status źródła. Gdy portal odpowiada właściwym HTML-em → użyj direct CBOSA wg sekcji niżej i `shared/SYGNATURY.md` V-SYG-0.7. Gdy direct zawiedzie → V-SYG-0.5 fallback indeksowy. |

### ⭐ CBOSA — direct HTML adapter (NSA/WSA, stan operacyjny 2026-09-14)

CBOSA nie ma publicznego REST/JSON API, ale ma deterministyczny kontrakt
server-side HTML. **Nie zaczynaj od web_search**, jeśli bieżący runtime potrafi
wykonać direct request.

Kolejność:

```
0. fresh-probe /cbo/query lub kontrolowany POST /cbo/search
1. POST /cbo/search
2. zachowaj Set-Cookie
3. jeśli potrzeba: GET /cbo/find?p=N w TEJ SAMEJ sesji
4. wyciągnij wszystkie unikalne /doc/{10-znakowy-ID}
5. GET /doc/{ID} dla każdego kandydata
6. exact-match sygnatury po normalizacji
```

Formularz exact-case:

```text
Content-Type: application/x-www-form-urlencoded

wszystkieSlowa=
wystepowanie=gdziekolwiek
odmiana=on
sygnatura={SYGNATURA}
sad=dowolny
rodzaj=dowolny
symbole=
odDaty=
doDaty=
sedziowie=
funkcja=
submit=Szukaj
```

⛔ **Bramki kompletności:**
- nierozpoznany licznik wyników → OUT_OF_SCOPE;
- licznik > liczba odczytanych unikalnych dokumentów → dokończ paginację;
- powtórzona/zapętlona paginacja → OUT_OF_SCOPE;
- niekompletny transport / Content-Length mismatch → OUT_OF_SCOPE;
- krytyczny drift HTML (brak sądu, daty, sentencji) → OUT_OF_SCOPE;
- „blisko pasująca” sygnatura → odrzuć;
- 0 exact-match po kompletnym wyniku → NOT_FOUND;
- 1 → FOUND; >=2 → AMBIGUOUS.

Pełny kontrakt: `shared/SYGNATURY.md`, V-SYG-0.7.
Implementacja produkcyjna: `shared/CBOSA-ADAPTER.md`
i implementacja referencyjna opisana w `shared/CBOSA-ADAPTER.md`.

**Zakres treści:** poprawnie zamknięty dokument bez opublikowanej sekcji
uzasadnienia może nadal być FOUND dla metryki/sentencji, ale
`reasoning_available=false` — zakaz przypisywania tezy z uzasadnienia.
Urwane uzasadnienie / urwany HTML = OUT_OF_SCOPE.

Regresje 2026-09-14 po hardeningu: **22/22 PASS**.

### ⛔⛔ CBOSA — zamienniki SPRAWDZONE I ODRZUCONE (F-188, 2026-09-13d)

> **Czytaj to, zanim zaproponujesz „alternatywną bazę NSA/WSA".** Dwaj najbardziej
> oczywiści kandydaci zostali zmierzeni i **odpadli — nie na dostępności, lecz na
> zakazie w `robots.txt`.** Host odpowiadający 200 nie jest jeszcze kanałem
> dozwolonym.

| Kandydat | HTTP | `robots.txt` | Werdykt |
|---|---|---|---|
| `www.orzeczenia-nsa.pl` | **200** (oba UA) | `Disallow: /szukaj` dla `User-agent: *` **oraz** `Disallow: /` dla naszego agenta; w kodzie serwisu zapowiedziana pułapka na automaty ignorujące reguły | ⛔ **ZAKAZ — nie odpytywać** |
| `szukio.pl` | **429** (oba UA) | `Disallow: /` dla naszego agenta | ⛔ **ZAKAZ — nie odpytywać** |

Odtworzenie: `curl -sS https://www.orzeczenia-nsa.pl/robots.txt`,
`curl -sS https://szukio.pl/robots.txt`.

⚠️ HTTP 429 na `szukio.pl` to **objaw**; przypisanie go pułapce albo zwykłemu
rate-limitowi pozostaje hipotezą — i jest bez znaczenia, bo zakaz w `robots.txt`
rozstrzyga sam.

✅ **Co wolno:** podać adres **człowiekowi** jako odnośnik do ręcznego sprawdzenia.
⛔ **Czego nie wolno:** odpytać w kanale kodu ani przez `web_fetch`.

➜ **Skutek dla systemu po 2026-09-14:** przy działającym direct CBOSA pion
NSA/WSA ma deterministyczną kontrolę exact-match oraz odczyt sentencji/
uzasadnienia. Luka pozostaje wyłącznie w runtime'ach, w których direct CBOSA
jest niedostępna — wtedy obowiązuje jednostronny kanał zdegradowany poniżej.

### ⚠️ CBOSA — retrieval/snapshot po niedostępności direct (F-183a)

Stosuj dopiero po nieudanym fresh-probe/direct CBOSA. Kanał może w zależności
od hosta dać od samego tytułu/snippetu aż po reprezentację pełnego oficjalnego
dokumentu `/doc/{ID}`.

```
DISCOVERY:
  preferuj natywny filtr domains=["orzeczenia.nsa.gov.pl"], jeśli host go ma;
  inaczej web_search: site:orzeczenia.nsa.gov.pl "{SYGNATURA}"

⛔ `site:` jest tylko wskazówką dla wyszukiwarki, NIE filtrem bezpieczeństwa.

POST-CHECK HOSTA — obowiązkowy:
  scheme=https
  hostname dokładnie orzeczenia.nsa.gov.pl
  path dokładnie /doc/{10 znaków A-Z0-9}
  każdy inny host → ODRZUĆ i nie odpytuj automatycznie

POST-CHECK SYGNATURY:
  exact-match po normalizacji; near-match → OUT_OF_SCOPE
```

Jeżeli retrieval oddaje tylko tytuł/snippet → `EXISTENCE_ONLY`.
Jeżeli oddaje reprezentację oficjalnego `/doc/{ID}`, odczytaj faktyczny zakres:
- `METADATA_SENTENCE` — metryka + sentencja;
- `METADATA_SENTENCE_REASONING_PARTIAL` — uzasadnienie widoczne, ale bez potwierdzonego końca;
- `METADATA_SENTENCE_REASONING_FULL` — początek i koniec uzasadnienia potwierdzone.

**Pomiar 2026-09-14, 10 realnych sygnatur:** 10/10 dostępnych oficjalnych
snapshotów miało co najmniej metrykę + sentencję; w 5/10 potwierdzono pełny
koniec uzasadnienia, w 2/10 uzasadnienie było widoczne bez pewności kompletności,
3/10 dawały metrykę + sentencję. To próba funkcjonalna, NIE estymacja pokrycia
całego korpusu.

⛔ Treść snapshotu może być używana do researchu i analizy, ale provenance
pozostaje `access_mode=CRAWLED_OR_INDEXED`. Nie wolno na tej podstawie
raportować `DIRECT_LIVE` ani ✅ [VER]. Globalny status śladu pozostaje zgodny
z `shared/WERYFIKACJA-SLAD.md`.

⛔ Brak exact-hit w retrieval = `OUT_OF_SCOPE`, nigdy `NOT_FOUND`.
Pełny kontrakt: `shared/SYGNATURY.md`, V-SYG-0.5.
| `ipo.trybunal.gov.pl`, `otkzu.trybunal.gov.pl` | HTML | osiągalne (`/ipo/Szukaj` → 200). ⛔ Wyszukiwarka to JSF/PrimeFaces z `ViewState` — **POST-only**, `Sprawa?sygnatura=` nie jest kluczem. Brak kontroli po sygnaturze (F-184) |
| `hudoc.echr.coe.int` | ⚠️ HTML | ⛔ **Sprostowanie (F-186a, zamknięta 2026-09-13c):** ścieżka `/app/query/results` zwraca **404** (zmierzone w dwóch wariantach zapytania) — zapis z wersji 1.0 był nieprawdziwy. ✅ Działa pobranie dokumentu po `itemid`: `GET /app/conversion/docx/html/body?library=ECHR&id=001-57619` → 200, pełny tekst HTML (zmierzone: 177 kB). Wyszukiwanie po frazie pozostaje nierozstrzygnięte maszynowo |
| `orzeczenia.uzp.gov.pl` | HTML | ⛔ **`Sign=` NIE FILTRUJE.** Formularz `GET /Home/Search` ma pola `Sign, Phrase, Dt, Fle, SCnt, Art, ThIdx`, ale zmierzone `Sign=KIO 827/18` i `Sign=KIO 99999/18` zwracają **tę samą stronę** (57 635 vs 57 637 B — różnica to echo wpisanej wartości), 0 odnośników do wyników. Brak kontroli po sygnaturze (F-185) |

### ⭐ UODO — `orzeczenia.uodo.gov.pl`

**Jedyny polski organ z udokumentowanym publicznym API do własnych
rozstrzygnięć.** OpenAPI 3.1 pod `/api-doc/schemas/openapi.yml`, `servers: /api`,
bez klucza.

```
GET /api/documents/search/PublicDocument/1Y,/publicator_subtype:eq:uodo
    ?order=-id&fields=id,refid,refname
GET /api/documents/events/{id}              # metadane
GET /api/documents/events/{id}/000_pl.xml   # PEŁNA TREŚĆ
```
Sygnatura w `refname` (np. `DKN.5131.34.2023`), identyfikator zewnętrzny
w `refid` (`urn:ndoc:gov:pl:uodo:…`). Okno: `1M`, `1Y`.
⛔ Decyzja organu to RZĄD 2A — nie jest źródłem prawa.

---

## 4. REJESTRY I PODMIOTY

| Źródło | Kanał | Wymóg |
|---|---|---|
| **KRS** | ✅ `api-krs.ms.gov.pl/api/krs/{OdpisAktualny\|OdpisPelny}/{nr}?rejestr=P\|S&format=json` | bez klucza; numer dopełniony zerami do 10 cyfr |
| **CEIDG v3** | ⛔ `dane.biznes.gov.pl/api/ceidg/v3/firmy` | **Bearer JWT** z konta biznes.gov.pl; 401 bez tokenu = API żyje, nie awaria. Limit ~50/180 s liczony od OSTATNIEGO żądania — ponawianie **przedłuża** blokadę |
| **KW** | `ekw.ms.gov.pl/eukw_ogol/menu.do` | root pętli; brak API |
| **KRZ**, **wyszukiwarka KRS** | ⛔ 403 WAF | odczyt KRS i tak przez `api-krs` |
| **SUDOP** | ✅ `sudop.uokik.gov.pl` | pomoc publiczna, NIE decyzje |
| **REGON / BIR** | 🟨 `api.stat.gov.pl` — **osiągalny, BLOKADA PROCEDURALNA** | zamyka **F-158c** (2026-09-13d): host 200 w obu reżimach UA, brak `robots.txt` (404), dokumentacja na `/Home/RegonApi` — ale `/gus/UslugaBIRzewnPubl/Zaloguj` oddaje 302, a **Klucz Użytkownika** wydaje GUS mailowo (`regon_bir@stat.gov.pl`, po podaniu nazwy podmiotu, REGON-u i osoby kontaktowej). ⛔ **Nie awansować do żywego kanału RZĘDU 1** — odpowiedź na F-158c brzmi „wymaga klucza", a nie „nie wiadomo". Do rejestracji podmiotu użyj KRS/CEIDG/białej listy VAT |

⚠️ **Pułapka odpisu KRS:** JSON jest **zanonimizowany** względem PDF (inicjały,
część PESEL). Przy ustalaniu reprezentacji strony może to nie wystarczyć —
wtedy odpis PDF.

### ✅ Biała lista VAT — `wl-api.mf.gov.pl` (ODBLOKOWANA 2026-09-13c, F-157b)

⛔ **Zapis „NIEOSIĄGALNA, brak zamiennika" jest nieaktualny i został usunięty.**
Host odpowiada; kanał zmierzony end-to-end, bez klucza:

```
GET /api/search/nip/{NIP}?date=RRRR-MM-DD
    → result.subject: name, nip, regon, krs, statusVat ("Czynny"/"Zwolniony"/
      "Niezarejestrowany"), accountNumbers[], representatives[], requestId
GET /api/search/bank-account/{26_CYFR}?date=RRRR-MM-DD
GET /api/search/nip-bank-account/{NIP}/{26_CYFR}?date=RRRR-MM-DD   # kontrola pary
```

Zmierzone: NIP `5260250995` → `ORANGE POLSKA SPÓŁKA AKCYJNA`, `statusVat: Czynny`,
153 rachunki. Walidacja wejścia działa po stronie API: rachunek 26 zer → HTTP 400
`WL-111 Nieprawidłowy numer konta bankowego`.

⚠️ `date` jest **obowiązkowa** i wyznacza dzień, na który wykaz jest odpytywany —
przy weryfikacji płatności podawaj datę transakcji, nie dzień dzisiejszy
(to ta data rozstrzyga o skutkach z art. 117ba Ordynacji podatkowej i art. 15d
ustawy o CIT — ⛔ podstawy prawne sprawdź w ELI, nie w tym pliku).
⚠️ `requestId` z odpowiedzi to **dowód sprawdzenia** — zapisz go w śladzie
weryfikacji razem z datą.

---

## 5. POZOSTAŁE

| Źródło | Adres | Uwaga |
|---|---|---|
| **eZamówienia** | ✅ `ezamowienia.gov.pl/mo-board/api/v1/Board/Search` | REST, bez klucza |
| **BZP** | `bzp.uzp.gov.pl/Default.aspx` | ⚠️ ~20% żądań → 404, ponawiaj |
| **EUR-Lex** | `eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:…` | HTML |
| **Cellar SPARQL** | ✅ `publications.europa.eu/webapi/rdf/sparql` | ⛔ tylko ta ścieżka; root → 301 poza listę |
| **EUREKA (interpretacje MF)** | ⚠️ `eureka.mf.gov.pl/api/public/v1/informacje/{id}` | pobieranie po ID działa; **wyszukiwanie po treści nie** — POST `wyszukiwarka/informacje` o nieustalonym schemacie |
| **RCL** | ⛔ `legislacja.rcl.gov.pl` | 503 `connection timeout` (2026-09-13c) — host NA liście, nie odpowiada. **Brak zamiennika** dla przebiegu prac legislacyjnych |

---

## 6. GDY KANAŁ ZAWIEDZIE — kolejność, nie improwizacja

1. Sprawdź **kształt żądania** (§1) — zanim orzekniesz o niedostępności źródła.
2. Sprawdź **ścieżkę roboczą** zamiast roota.
3. Ponów (limity tempa, hosty niedeterministyczne).
4. Dopiero potem: `references/ZRODLA-AKTOW-FALLBACK.md` (routera) lub
   `shared/HIERARCHIA-ZRODEL.md` → kanał zastępczy RZĘDU 1.
5. Jeśli nadal brak potwierdzenia — ⚠️ `[NIEWERYFIKOWANE]` i **poinformuj
   użytkownika**. ⛔ Nigdy cicho.

⛔ **Zakaz szczególny:** nie wolno orzec „źródło RZĘDU 1 niedostępne" i zejść
na KOTWICĘ URZĘDOWĄ, dopóki nie sprawdzono kroków 1–3. To był mechanizm
usterki opisanej we flagach F-151 i F-157.

---

## 7. ODTWORZENIE STANU

Statusy w tym pliku pochodzą z pomiaru, nie z deklaracji, i **starzeją się**.
Odtworzenie:
- osiągalność hostów — `audyt-systemu-v4/scripts/check_domeny_allowlist.py` (T25),
  52 sondy, `--selftest` offline, `--grupa kandydaci` pokazuje, co odblokowała
  zmiana konfiguracji sieci. ⭐ Instrument sprawdził się 2026-09-13c: sam wypisał
  sekcję ODBLOKOWANE (6 hostów) i wykrył jedyną regresję (CBOSA) — uruchamiaj go
  po KAŻDEJ zmianie konfiguracji sieci, zamiast sondować hosty ręcznie;
- kanały orzecznicze i okno pokrycia SAOS —
  `audyt-systemu-v4/scripts/weryfikator_sygnatur.py` (`--okno`, `--kanaly`,
  `--sygnatura "III CZP 25/11"`).

⛔ Nie przepisuj statusów z pamięci ani z tego pliku do innych dokumentów —
uruchom test.
