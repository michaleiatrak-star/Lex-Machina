# DOSTĘP MASZYNOWY DO ŹRÓDEŁ — jak wywołać API, żeby odpowiedziało

> **Plik:** `shared/DOSTEP-MASZYNOWY-API.md`
> **Wersja:** 1.0 (2026-09-04c) — utworzony po wykryciu, że instrukcje dostępu
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

⛔ **Limity tempa są realne, nie deklaratywne.** CBOSA
(`orzeczenia.nsa.gov.pl`) po serii żądań w jednym przebiegu oddała **503 ×3**,
a po 60 s pauzy **200/200/200**. Przy zapytaniach seryjnych limituj tempo po
swojej stronie albo zablokujesz sobie adres.

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

⚠️ `pageSize` **≥ 10** — mniej to HTTP 400. Indeks bywa wolny, nie skracaj timeoutu.
⛔ SAOS to RZĄD 2A — ustala, że orzeczenie istnieje i co zawiera; **nie
zastępuje sprawdzenia sygnatury u źródła** przy powołaniu w piśmie.

### Pozostałe

| Źródło | Kanał | Uwaga |
|---|---|---|
| `orzeczenia.ms.gov.pl` | HTML | ⚠️ 502 pod UA przeglądarkowym — patrz §1 |
| `orzeczenia.nsa.gov.pl/cbo/query` | HTML | ⛔ limituje tempo, patrz §1 |
| `sn.pl` | HTML | wybrane orzecznictwo, nie całość |
| `ipo.trybunal.gov.pl`, `otkzu.trybunal.gov.pl` | HTML | pełne orzecznictwo TK; sam `trybunal.gov.pl` nieosiągalny |
| `hudoc.echr.coe.int` | ✅ JSON | `/app/query/results?query=(contentsitename=ECHR)&select=…&start=0&length=N` — nieudokumentowane, stabilne |
| `orzeczenia.uzp.gov.pl` | HTML | KIO, brak REST |

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

⚠️ **Pułapka odpisu KRS:** JSON jest **zanonimizowany** względem PDF (inicjały,
część PESEL). Przy ustalaniu reprezentacji strony może to nie wystarczyć —
wtedy odpis PDF.

⛔⛔ **Biała lista VAT (`wl-api.mf.gov.pl`) jest NIEOSIĄGALNA** w tym
środowisku — host poza listą dozwolonych (F-157). Nie ma zamiennika
maszynowego. Weryfikację rachunku kontrahenta trzeba wykonać ręcznie i
**oznaczyć jako niezweryfikowaną maszynowo**, nie pominąć w ciszy.

---

## 5. POZOSTAŁE

| Źródło | Adres | Uwaga |
|---|---|---|
| **eZamówienia** | ✅ `ezamowienia.gov.pl/mo-board/api/v1/Board/Search` | REST, bez klucza |
| **BZP** | `bzp.uzp.gov.pl/Default.aspx` | ⚠️ ~20% żądań → 404, ponawiaj |
| **EUR-Lex** | `eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:…` | HTML |
| **Cellar SPARQL** | ✅ `publications.europa.eu/webapi/rdf/sparql` | ⛔ tylko ta ścieżka; root → 301 poza listę |
| **EUREKA (interpretacje MF)** | ⚠️ `eureka.mf.gov.pl/api/public/v1/informacje/{id}` | pobieranie po ID działa; **wyszukiwanie po treści nie** — POST `wyszukiwarka/informacje` o nieustalonym schemacie |
| **RCL** | ⛔ `legislacja.rcl.gov.pl` | nieosiągalne, **brak zamiennika** dla przebiegu prac legislacyjnych |

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
Odtworzenie: `audyt-systemu-v4/scripts/check_domeny_allowlist.py` (T25) —
52 sondy, `--selftest` offline, `--grupa kandydaci` pokazuje, co odblokowała
zmiana konfiguracji sieci.

⛔ Nie przepisuj statusów z pamięci ani z tego pliku do innych dokumentów —
uruchom test.
