# F-187…F-192 — Pomiar kanałów maszynowych, sesja 2026-09-13d


> **ADNOTACJA 2026-09-14 — POMIAR HISTORYCZNY, NIE REGUŁA GLOBALNA.**
> Wyniki 503 dla CBOSA poniżej opisują dokładnie środowisko pomiarowe z
> 2026-09-13d. Od 2026-09-14 system ma kanoniczny direct adapter:
> `shared/CBOSA-ADAPTER.md` + V-SYG-0.7. Każdy runtime wykonuje fresh-probe;
> przy działającym CBOSA używa formularza HTML i exact-match, a przy
> niedostępności wraca do V-SYG-0.5. Nie zmienia to historycznych obserwacji
> tego raportu — zmienia ich zakres zastosowania.


> **Format zgłoszeń:** ZASADA 14 (AUDIT-CLAIM-GATE) — każde ustalenie niesie
> STATUS, IDENTYFIKATOR ŹRÓDŁA i REPRODUKCJĘ.
> **Wszystkie pomiary: 2026-09-13, kanał kodu** (`bash_tool` / `curl` /
> `python3 requests`). Pomiary jednodniowe — zgodnie z
> `shared/DOSTEP-MASZYNOWY-API.md` §7 **odtwarzaj testem, nie przepisuj**.

---

## F-187 — Hipoteza zamrożenia listy domen: POTWIERDZONA (w części obserwowalnej)

**STATUS:** ✅ [VER: `check_domeny_allowlist.py --grupa kandydaci`, 2026-09-13d]

**REPRODUKCJA:**
```
cd /mnt/skills/plugins
python3 audyt-systemu-v4/scripts/check_domeny_allowlist.py --grupa kandydaci
```

**Wynik:** sekcja `ODBLOKOWANE od pomiaru odniesienia (F-157)` pokazała **8 z 8**
sond — zarówno poprzednią partię (`api.dane.gov.pl`, `wl-api.mf.gov.pl`,
`www.gov.pl`), jak i nowe (`api.stat.gov.pl`, `orzeczenia.warszawa.so.gov.pl`,
`op.europa.eu`, `www.pip.gov.pl`). Podsumowanie: `8 sond, 0 zgodnych ze stanem
odniesienia (2026-09-04), 0 regresji`.

**Zakres wniosku — węższy niż hipoteza.** Pomiar dowodzi, że **stan odniesienia
z 2026-09-04 nie obowiązuje w tej sesji**. Nie rozstrzyga, czy przyczyną jest
zamrażanie konfiguracji przy starcie sesji, czy zmiana globalna — oba mechanizmy
dają identyczny objaw. ⚠️ [NIEWERYFIKOWANE — HIPOTEZA] w warstwie przyczynowej.
Skutek operacyjny jest jednak dokładnie taki, jak zakładano: **sondować na
starcie sesji, nie przepisywać stanu z pliku.**

**Usterka etykiety w skrypcie (do naprawy osobno):** `check_domeny_allowlist.py`
zwraca `BLOKADA` zarówno dla odmowy proxy, jak i dla odmowy origin-u.
`rdf-przegladarka.ms.gov.pl` → `HTTP 403 — odrzucone przez warstwę ochronną`, ale
to 403 **serwera**, nie listy domen. Etykieta powinna rozróżniać
`BLOKADA-PROXY` (obecny `x-deny-reason`) od `BLOKADA-ORIGIN` (brak nagłówka).
➜ zgodne z rozróżnieniem „403 proxy ≠ 403 WAF" z `DOSTEP-MASZYNOWY-API.md` §1.

---

## F-188 — ⛔ Dwaj kandydaci ODRZUCENI: zakaz w `robots.txt`

**STATUS:** ✅ [VER: `robots.txt` obu hostów, odczyt 2026-09-13d]

**REPRODUKCJA:**
```
curl -sS https://www.orzeczenia-nsa.pl/robots.txt
curl -sS https://szukio.pl/robots.txt
```

| Kandydat | HTTP | Treść `robots.txt` | Werdykt |
|---|---|---|---|
| `www.orzeczenia-nsa.pl` | **200** (oba UA) | `Disallow: /szukaj` dla `User-agent: *`; `Disallow: /` dla naszego agenta; w kodzie serwisu zapowiedziana pułapka na automaty ignorujące reguły | ⛔ ZAKAZ |
| `szukio.pl` | **429** (oba UA) | `Disallow: /` dla naszego agenta | ⛔ ZAKAZ |

**To jest korekta do polecenia sesji.** Obaj byli wskazani do dopisania „bo
faktycznie coś otwierają". Otwierają — ale **HTTP 200 nie czyni hosta kanałem
dozwolonym**. Ścieżka wyszukiwania `orzeczenia-nsa.pl` jest wyłączona dla
wszystkich automatów, niezależnie od tożsamości agenta.

⚠️ HTTP 429 na `szukio.pl` to **objaw**; przypisanie go pułapce albo zwykłemu
rate-limitowi pozostaje hipotezą — i jest bez znaczenia, bo `robots.txt`
rozstrzyga samodzielnie.

✅ **Wolno:** podać adres **człowiekowi** jako odnośnik do ręcznego sprawdzenia.
⛔ **Nie wolno:** odpytywać w kanale kodu ani przez `web_fetch`.

➜ **Luka pozostaje otwarta:** pion sądowoadministracyjny (NSA/WSA) **nadal nie ma
binarnej kontroli sygnatur**. CBOSA martwa, oba oczywiste zamienniki odpadły.
Zostaje wyłącznie kanał zdegradowany (V-SYG-0.5). Jest to poważniejsza dziura niż
`caseNumber`, bo obejmuje cały pion.

---

## F-189 — `api.stat.gov.pl` (REGON/BIR): F-158c ZAMKNIĘTA, wynik „wymaga klucza"

**STATUS:** ✅ [VER: `https://api.stat.gov.pl/Home/RegonApi`, odczyt 2026-09-13d]

**REPRODUKCJA:**
```
curl -sS -o /dev/null -w '%{http_code}\n' https://api.stat.gov.pl/Home/RegonApi                  # 200
curl -sS -o /dev/null -w '%{http_code}\n' https://api.stat.gov.pl/gus/UslugaBIRzewnPubl/Zaloguj  # 302
```

Host osiągalny w obu reżimach UA, brak `robots.txt` (404), dokumentacja czytelna.
Ale `Zaloguj` przekierowuje, a dokumentacja wymaga **Klucza Użytkownika**
wydawanego mailowo przez GUS (`regon_bir@stat.gov.pl`, po podaniu pełnej nazwy
podmiotu, numeru REGON i osoby kontaktowej).

**Status docelowy: `OSIĄGALNY — BLOKADA PROCEDURALNA (klucz)`.** ⛔ Nie awansować
do żywego kanału RZĘDU 1. F-158c przestaje być pytaniem otwartym — odpowiedź brzmi
„wymaga klucza", a nie „nie wiadomo".

---

## F-190 — Reżim UA jest PER-HOST i ma **trzy** warianty, nie dwa

**STATUS:** ✅ [VER: pomiar dwureżimowy 12 hostów, 2026-09-13d]

**REPRODUKCJA:** ten sam GET na każdy host, raz bez nagłówków (`curl` domyślny),
raz z pełnym łańcuchem (UA Chrome + `Accept-Language` + `Sec-Fetch-*`).

| Host | `curl` neutralny | łańcuch Chrome |
|---|---|---|
| `sn.pl` / `www.sn.pl` | **403** | **200** |
| `www.saos.org.pl/api/...` | **200** | ⛔ **403** |
| `orzeczenia.ms.gov.pl` | 200 | ⛔ 502 |
| `orzeczenia.poznan.so.gov.pl` | 200 | ⛔ 502 |
| `orzeczenia.szczecin.sa.gov.pl` | 200 | ⛔ 502 |
| `orzeczenia.warszawa.so.gov.pl` | 200 | ⛔ 502 |
| `orzeczenia.nsa.gov.pl` (CBOSA) | 503 | 503 |
| `api.stat.gov.pl`, `ipo.trybunal.gov.pl`, `www.orzeczenia-nsa.pl` | 200 | 200 |

**Wyjątek `sn.pl` z `DOSTEP-MASZYNOWY-API.md` §1 — potwierdzony niezależnie.**
Pomiar dokłada drugi kierunek: łańcuch przeglądarkowy nie jest tylko „zbędny",
lecz **aktywnie odrzucany** przez SAOS (403) i przez **całą rodzinę** Portali
Orzeczeń (502) — nie tylko przez agregat, jak zapisano wcześniej.

➜ **Trzy reżimy:** (a) domyślnie neutralny; (b) `sn.pl` — przeglądarkowy;
(c) SAOS + każdy `orzeczenia.*.gov.pl` — neutralny **obowiązkowo**. Nie istnieje
ustawienie globalne obsługujące (b) i (c) naraz.

### ⚠️ Fałszywy alarm w tej sesji — odnotowany jawnie

Po przełączeniu sond na łańcuch przeglądarkowy cztery Portale Orzeczeń zaczęły
zwracać 502; zgłosiłem to wstępnie jako „cała rodzina padła w środku sesji".
**To było błędne.** Po powrocie do UA neutralnego — 200 na wszystkich czterech.
Objawem był kod 502; „awaria po stronie MS" była hipotezą przyczynową i była
fałszywa. Dokładnie przypadek, przed którym ostrzega ZASADA 14: fałszywy alarm
audytu kosztuje tyle samo, co błąd przeoczony.

---

## F-191 — Deterministyczny GET po sygnaturze: ODTWORZONY + warstwa V-SYG-0.6

**STATUS:** ✅ [VER: `orzeczenia.ms.gov.pl` + portale sądów, 2026-09-13d, UA neutralny]

Kontekst aktywacji Tapestry ma **17 pozycji**, sygnatura na **pozycji 2**, po nich
numer strony. Wcześniejszy zapis `$N…(×15)` był nieodtwarzalny — poniższa postać
działa po skopiowaniu:

**REPRODUKCJA:**
```
curl -sS 'https://orzeczenia.ms.gov.pl/search/advanced/$N/I$0020C$002f100$002f15/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/$N/1'
```

| Zapytanie | Host | Wynik |
|---|---|---|
| `I C 100/15` | `orzeczenia.ms.gov.pl` | `big_number=9`, 18 linków `/details/` → **AMBIGUOUS** |
| `I C 999999/15` | `orzeczenia.ms.gov.pl` | „Nie znaleziono…" → **NOT_FOUND** |
| `I C 100/15` | `orzeczenia.poznan.so.gov.pl` | `big_number=1` → **FOUND** |
| `I ACa 100/15` | `orzeczenia.szczecin.sa.gov.pl` | „Nie znaleziono…" → **NOT_FOUND** |

Liczba 9 zgadza się co do jednostki z pomiarem poprzedniej sesji — kontrakt
potwierdzony niezależnie.

**Nowe:** portale sądów nie są wyłącznie zapasem agregatu, lecz **warstwą
rozstrzygającą AMBIGUOUS**. Ta sama sygnatura dająca 9 trafień krajowo daje 1
trafienie po wskazaniu sądu — sygnatura SR/SO nie jest unikalna krajowo, ale bywa
unikalna w obrębie sądu. ➜ wdrożone jako **V-SYG-0.6** w `shared/SYGNATURY.md`,
wraz z granicą wnioskowania: zero trafień lokalnie **nie znosi** AMBIGUOUS
z agregatu (publikacja na Portalu Orzeczeń jest wybiórcza).

---

## F-192 — `weryfikator_sygnatur.py` ISTNIEJE, działa i przechodzi testy

**STATUS:** ✅ [VER: `audyt-systemu-v4/scripts/weryfikator_sygnatur.py`, uruchomienie 2026-09-13d]

Zdanie z materiału wejściowego — „nie mam skryptu `weryfikator_sygnatur.py`, jest
tylko projekt" — jest **nieaktualne**. Plik istnieje (16 715 B), implementuje pełny
łańcuch NORMALIZUJ → ROUTUJ → OKNO POKRYCIA → POST-CHECK, opisany jako
`AUDYT-2026-09-13, flagi F-182…F-186`.

**REPRODUKCJA:**
```
python3 audyt-systemu-v4/scripts/weryfikator_sygnatur.py --sygnatura "II CSKP 100/21"
```

| Zapytanie | `odrzucone_post_checkiem` | Status |
|---|---|---|
| `III CZP 25/11` | — | `FOUND` (2011-10-18) |
| `I NSNc 10/24` | `II NSNc 10/24` | `NOT_FOUND` |
| `II CSKP 100/21` | `III CSKP 100/21` | `FOUND` (2021-05-27) |
| `III CZP 999/11` | — | `NOT_FOUND` |

**Przypadek rozstrzygający — mocniejszy niż `I NSNc 10/24`:** zapytanie
`II CSKP 100/21` zwraca z SN **dwa** rekordy — `III CSKP 100/21` (inna izba) oraz
trafny `II CSKP 100/21`. Redakcja V-SYG-0.4 w liczbie pojedynczej („porównaj
sygnaturę ZWRÓCONĄ z PYTANĄ") nie mówi, co zrobić z takim zbiorem; porównanie
pierwszego rekordu dałoby `NOT_FOUND` dla orzeczenia, które **istnieje**.
➜ **specyfikacja była nieprecyzyjna względem działającego kodu**, nie odwrotnie.
V-SYG-0.4 przeredagowana na „FILTRUJ ZBIÓR".

### Fałszywy alarm, którego NIE zgłaszam jako ustalenia

Komentarz `SN = "https://sn.pl/index.php"  # ⛔ bez "www." — www.sn.pl poza listą
domen` wyglądał na usterkę: `/index.php` oddaje 301 na `/pl/`, a `www.sn.pl` jest
dziś osiągalny. Sprawdzone obie formy równolegle — **obie zwracają 200 i poprawny
JSON**; `requests` podąża za 301 i sam utrzymuje ciasteczka Imperva. **Usterki
kodu nie ma.** Poprawiony został wyłącznie komentarz, bo jego uzasadnienie
przestało obowiązywać. (Mój wcześniejszy `curl` bez `-L` zwracał pustkę — to był
błąd narzędzia pomiarowego, nie API.)

---

## Stan kanałów po sesji — rzędy

| Źródło | Rząd / status | Reżim UA |
|---|---|---|
| `sn.pl` / `www.sn.pl` (snproxy JSON) | ✅ **RZĄD 1**, żywy, pełny tekst | **przeglądarkowy** (wyjątek) |
| `orzeczenia.ms.gov.pl` (GET po sygnaturze) | ✅ **RZĄD 1**, żywy | neutralny |
| `orzeczenia.{sad}.sr\|so\|sa.gov.pl` | ✅ **RZĄD 1** — warstwa rozstrzygania AMBIGUOUS | neutralny |
| `www.saos.org.pl/api` | ✅ **RZĄD 2A**, kontrola krzyżowa | neutralny |
| `ipo.trybunal.gov.pl`, `otkzu.trybunal.gov.pl` | ✅ osiągalne; kontrola po sygnaturze **nierozstrzygnięta** (JSF/ViewState) | oba |
| `api.stat.gov.pl` (REGON/BIR) | 🟨 osiągalny — **blokada proceduralna (klucz)** | oba |
| `orzeczenia.nsa.gov.pl` (CBOSA) | ⛔ 503 w obu reżimach — Reguła 12d spełniona | — |
| `www.orzeczenia-nsa.pl` | ⛔ **zakaz `robots.txt`** — nie kanał maszynowy | — |
| `szukio.pl` | ⛔ **zakaz `robots.txt`** — nie kanał maszynowy | — |

**Otwarte po tej sesji:** (1) NSA/WSA bez binarnej kontroli sygnatur; (2) TK bez
kontroli po sygnaturze; (3) KIO — pole `Sign` znalezione, nadal niesprawdzone;
(4) etykieta `BLOKADA` w `check_domeny_allowlist.py` do rozdzielenia na
proxy/origin.
