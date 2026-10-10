# KONEKTORY-REKOMENDOWANE.md
## MCP-INTEGRACJA.md — konkretne projekty OSS do podłączenia (zamiast pisania od zera)

> Ten plik jest rejestrem **rekomendacji infrastrukturalnych dla developera**, nie
> kodem wykonywalnym przez Claude. Weryfikacja aktualności linków/licencji/API —
> obowiązek developera przed wdrożeniem produkcyjnym (te projekty rozwijają się
> niezależnie od tego systemu skilli).

## Dlaczego integracja, nie budowa od zera

Audyt komercyjny (2026-07-13) wskazał, że polski ekosystem MCP dla prawa jest już
częściowo zbudowany i utrzymywany (m.in. przez MateMatic, na licencji MIT dla
samych connectorów). Budowanie własnych connectorów od zera dla ISAP/SAOS/CBOSA
oznaczałoby duplikowanie pracy, którą społeczność już wykonała i utrzymuje —
a jednocześnie systemowi zależy na deterministycznym, aktualnym dostępie do źródeł,
nie na posiadaniu własnego kodu integracyjnego jako takiego.

## Tabela: typ zapytania → rekomendowany connector

| Typ zapytania w systemie | Connector (kategoria funkcjonalna) | Źródło danych | Licencja typowa w tej kategorii |
|---|---|---|---|
| Numer/status/tekst jednolity ustawy, Dz.U./M.P. | MCP server dla Sejm ELI API (Dziennik Ustaw + Monitor Polski) | api.sejm.gov.pl (ELI) | MIT (typowo) |
| Orzecznictwo sądów powszechnych (SO/SA bieżąco; SN tylko do 2016) | MCP server dla SAOS | orzeczenia.ms.gov.pl / SAOS | MIT (typowo) |
| Orzecznictwo NSA + 16 WSA (administracyjne, podatkowe, RODO) | MCP server dla CBOSA **MCP-FIRST**; bez MCP: natywny direct HTML adapter Lex Machina | orzeczenia.nsa.gov.pl (CBOSA, RZĄD 2A) | MIT dla zewnętrznego MCP; adapter LM = część repo |
| Orzecznictwo KIO (zamówienia publiczne) | MCP server dla bazy KIO | orzeczenia.uzp.gov.pl | Apache-2.0 (typowo) |
| Prawo UE (rozporządzenia/dyrektywy/CELEX/orzeczenia TSUE) | MCP server dla CELLAR/EUR-Lex | eur-lex.europa.eu | MIT (typowo) |
| Status podmiotu (spółka/organ) — używane przez PODMIOT-GATE routera | MCP server dla KRS | KRS (dane rejestrowe) | MIT (typowo) |
| Weryfikacja sygnatury wyroku (czy istnieje, sąd, data) bez pełnej treści | Deterministyczny weryfikator sygnatur (no-LLM, lookup) | SAOS | zależnie od projektu |

## REJESTR KONKRETNYCH SERWERÓW MCP — POZIOM A (dodany 2026-09-10, F-173)

> ⛔ **Po co ten rozdział.** `shared/PRAWO-HARDGATE.md` definiuje POZIOM A
> (konektor MCP) jako najsilniejszy kanał weryfikacji i wymienia `mcp-isap`,
> `legal-cite-pl`, `sententim` i `prawo-pl-saos` jako **wzorce**. Do 2026-09-10
> system nie wskazywał ani jednego konkretnego, publicznego serwera — POZIOM A
> był deklaracją, a cała weryfikacja szła faktycznie POZIOMEM B/C. Tabela wyżej
> podaje KATEGORIE funkcjonalne; ta podaje ADRESY.
>
> ⛔ **Status tych pozycji:** RZĄD 3 (repozytorium osoby trzeciej). Wpis w tym
> rejestrze **nie jest rekomendacją jakościową ani atestem bezpieczeństwa** —
> wskazuje kanał dostępu do źródła RZĘDU 1/2A, nie zastępuje oceny źródła.
> Treść zwrócona przez konektor dziedziczy RZĄD **źródła**, do którego konektor
> sięga, nigdy RZĄD samego konektora.
>
> ⛔ **Lista jest OTWARTA** (ZASADA OTWARTEJ LISTY, `HIERARCHIA-ZRODEL.md` §Rząd 3):
> brak projektu w tej tabeli nie blokuje jego użycia. Stan rozpoznania:
> 2026-09-10. Projekty rozwijają się niezależnie — przed wdrożeniem
> produkcyjnym obowiązkowy audyt licencji, zakresu i aktualności po stronie
> developera (patrz „Uwaga o utrzymaniu” niżej).

| Projekt | Zakres | Narzędzia / uwagi | Źródło danych (RZĄD) |
|---|---|---|---|
| `matematicsolutions/mcp-isap` | Dz.U. + M.P., Sejm ELI | `search_acts`, `get_act`, `get_act_text`; każde cytowanie niesie identyfikator ELI | api.sejm.gov.pl (RZĄD 1) |
| `matematicsolutions/mcp-saos` | sądy powszechne, SN, TK, KIO | `search`, `get_judgment`, `search_by_case` | SAOS (RZĄD 3 — agregator akademicki) |
| `matematicsolutions/mcp-nsa` | NSA + 16 WSA | `search`, `get_judgment`, `search_by_case` | CBOSA (RZĄD 2A) |
| `matematicsolutions/mcp-krs` | rejestr przedsiębiorców | `get_entity`, `get_entity_full`, `get_board` — obsługa KROK 0D / PODMIOT-GATE | KRS MS (RZĄD 2A) |
| `matematicsolutions/mcp-eu-sparql` | prawo UE + TSUE | `search_by_celex`, `search_by_date_range`, `search_cjeu` | EUR-Lex / CELLAR (RZĄD 1/2A) |
| `tmk12/pl-law-mcp-by-legal-geek` | akty PL (ELI) + polskie wersje aktów UE | filtrowanie sekcji, cięcie po granicy `Art.`, cache TTL, rate limiting; heurystyka deklinacji (ELI robi proste dopasowanie podciągu — forma mianownikowa bywa zeroszukowa) | ELI + EUR-Lex/CELLAR (RZĄD 1) |
| `janisz/sejm-mcp` | API Sejmu + ELI | szerszy zakres parlamentarny (druki, głosowania, interpelacje) obok aktów | api.sejm.gov.pl (RZĄD 1) |
| `numikel/law-scrapper-mcp` | akty Dz.U./M.P. z nawigacją wewnątrz aktu | `search_in_act`, odczyt po artykułach/rozdziałach, konwersja PDF→tekst | api.sejm.gov.pl (RZĄD 1) |
| `apiotrowski-afk/legal-cite-pl` | weryfikacja pojedynczego przepisu | `verify_article` — dosłowne brzmienie jednostki, tekst jednolity zamiast pierwotnego | ELI / EUR-Lex (RZĄD 1) |
| `Ansvar-Systems/polish-law-mcp` | wycinek dziedzinowy (RODO, KSC, KK-cyber, KSH, e-usługi) | warstwa ustawowa; brak warstwy orzeczniczej | ELI (RZĄD 1) |

### Dopasowanie do bramek systemu

| Bramka / krok | Konektor rozstrzygający | Co zastępuje |
|---|---|---|
| `PRAWO-HARDGATE` REGUŁA AKTUALNOŚCI (łańcuch t.j.) | `mcp-isap` / `pl-law-mcp` / `sejm-mcp` | `web_fetch` na `/eli/acts/.../references` |
| `PRAWO-HARDGATE` brzmienie jednostki | `legal-cite-pl` / `law-scrapper-mcp` | ręczne cięcie PDF-a t.j. |
| `SYGNATURY` V-SYG-1…4, kontrakt FOUND/NOT_FOUND/AMBIGUOUS | `mcp-saos` / `mcp-nsa`; dla NSA/WSA bez MCP → V-SYG-0.7 DIRECT-CBOSA | SAOS/API lub ręczne HTML; direct CBOSA nie wymaga zewnętrznego MCP |
| KROK 0D / `PRE-W2` status podmiotu ⬛ | `mcp-krs` | `api-krs.ms.gov.pl` przez kanał kodu |
| UP-5 ścieżka międzynarodowa | `mcp-eu-sparql` | `web_fetch` na EUR-Lex |

⛔ **Podłączenie konektora NIE zwalnia z niczego.** Wynik konektora jest
powołaniem jak każde inne: podlega VER-GRAIN, CN-GATE, WYJ-GATE i wymogowi
znacznika z zamkniętej hierarchii czterech. „Zwrócone przez MCP” nie jest
znacznikiem źródła i nie zastępuje ✅ [VER].

⛔ **Reguła 12d (REM-0) obowiązuje również tutaj.** Niedostępność konektora
stwierdza się pomiarem dwukanałowym z zapisem kodu, nie założeniem.

---

## Zasady podłączenia (dla developera portalu)

1. **Każdy connector osobno, nie jeden monolit** — jeśli jeden serwer padnie
   (np. CBOSA niedostępne), reszta ma działać. KROK 1 tego skilla wykrywa
   dostępność per narzędzie, nie per "cała warstwa MCP".
2. **Read-only** — żaden z tych connectorów nie powinien mieć uprawnień zapisu do
   źródeł rządowych (nie dotyczy — to i tak bazy tylko-do-odczytu publicznie), ale
   zasada dotyczy też ew. cache'a: connector może cache'ować odpowiedzi, ale musi
   mieć TTL i nigdy nie serwować danych starszych niż podana data bez ostrzeżenia.
3. **Zwracany schemat** — connector powinien zwracać strukturę zgodną z
   `shared/SCHEMAT-ODPOWIEDZI-MCP.md`, żeby KROK 2 protokołu w MCP-INTEGRACJA.md mógł
   jednoznacznie sklasyfikować wynik jako FOUND/NOT_FOUND/AMBIGUOUS.
4. **Wersjonowanie API rządowych** — Sejm ELI, SAOS i CBOSA to publiczne API bez
   SLA — connector musi mieć własną obsługę timeoutów/retry, żeby KROK 1/3 tego
   skilla mogły poprawnie zakwalifikować "MCP niedostępne" zamiast zawieszać
   rozmowę.
5. **Zgodność z tajemnicą zawodową** — dane samej sprawy klienta (fakty, dokumenty)
   nigdy nie powinny być wysyłane do tych connectorów jako parametr zapytania —
   connectory służą wyłącznie do weryfikacji STANU PRAWNEGO (numer aktu, treść
   przepisu, istnienie orzeczenia), nie do przetwarzania danych sprawy.

## Uwaga o utrzymaniu

Ten system skilli nie jest właścicielem ani opiekunem żadnego z powyższych
connectorów — to niezależne projekty open source. Developer wdrażający tę
rekomendację odpowiada za: (a) wybór konkretnego repozytorium/forka, (b) audyt
bezpieczeństwa i licencji przed wdrożeniem produkcyjnym, (c) monitoring
dostępności. `MCP-INTEGRACJA.md` odpowiada wyłącznie za protokół integracji
po stronie skilli (SKILL.md), nie za same serwery.

## Zbadane źródła urzędowe używane przez skille DR (2026-07-13j, dopełnione 2026-07-13k)

Na prośbę użytkownika sprawdzono (przez `web_search`, nie zgadywano) istnienie
publicznego API dla najczęściej referencjonowanych domen w skillach DR-01…16
(zebranych przez `grep -rhoE 'https?://...' dr-*/`, 50 unikalnych domen —
poniżej najczęściej używane, priorytetyzowane liczbą skilli, które się do
nich odwołują).

| Źródło | Odwołań w dr-*/ | Publiczne API? | Szczegóły |
|---|---|---|---|
| EUR-Lex / CELLAR | 32 | ✅ **TAK** | SPARQL endpoint + REST API, bez autoryzacji, oficjalna dokumentacja `eur-lex.europa.eu/content/tools/webservices/`. Limit: 10 000 wyników/zapytanie (od 2026), throttling po IP |
| ZUS (`zus.pl`) | 6 | ⚠️ **CZĘŚCIOWO** | Brak ogólnodostępnego API do zapytań (jak KRS/NBP) — istnieją wyłącznie wąskie, uwierzytelnione interfejsy dla zarejestrowanych płatników (raporty e-ZLA, specyfikacja "Aplikacje Gabinetowe"), wymagające loginu PUE/certyfikatu. Nieprzydatne jako ogólny connector weryfikacyjny |
| Interpretacje podatkowe (system EUREKA, `interpretacje.podatki.gov.pl`) | 6 | ❌ **NIE** | System EUREKA zastąpił SIP (2021) — wyłącznie wyszukiwarka HTML (`eureka.mf.gov.pl`), bez logowania, ale bez udokumentowanego REST API. Brak dowodu istnienia API |
| SUDOP/UOKiK (`sudop.uokik.gov.pl`) | 5 | ✅ **TAK** | API SUDOP (`api-sudop.uokik.gov.pl:9443/devportal/apis`), publiczne, bez rejestracji, limit 8 zapytań/s. Osobny "rejestr.uokik.gov.pl" (klauzule niedozwolone i in.) — nie potwierdzono API, prawdopodobnie tylko HTML |
| KIO / UZP (`orzeczenia.uzp.gov.pl`) | 5 | ❌ **NIE** | Wyłącznie wyszukiwarka HTML na stronie + archiwalny serwer FTP z plikami PDF (konwencja nazw `RRRR_NNNN.pdf`). Brak REST API |
| KNF (`knf.gov.pl`) | 5 | ❌ **NIE** | Wyłącznie rejestry/wykazy jako strony HTML i pliki do pobrania (np. XLS) + wyszukiwarka podmiotów. Brak udokumentowanego REST API |
| KRS (`ekrs.ms.gov.pl` / `prs.ms.gov.pl`) | 4 | ✅ **TAK** | Otwarte API KRS (`api-krs.ms.gov.pl`, RESTful, JSON) od 2022, na podstawie ustawy o otwartych danych — bez logowania. Osobne "Full API" (dane wrażliwe) wymaga decyzji ministra, nieistotne dla weryfikacji prawnej |
| NBP (`nbp.pl`) | 3 | ✅ **TAK** | `api.nbp.pl` — kursy walut i złota, JSON/XML, bez autoryzacji, od 1.08.2025 wyłącznie HTTPS |
| CEIDG / biznes.gov.pl | 3 | ✅ **TAK** (z kluczem) | Hurtownia Danych CEIDG i Biznes.gov.pl, API v2, dokumentacja publiczna, wymaga bezpłatnego wniosku o klucz API (`dane.biznes.gov.pl`) |
| CBOSA (`orzeczenia.nsa.gov.pl`) | (poza tą listą, ale kluczowe) | ❌ brak publicznego REST/JSON API; ✅ deterministyczny HTML | Formularz server-side jest wystarczający do adaptera: POST `/cbo/search` + cookies + `/cbo/find?p=N` + `/doc/{ID}`; exact-match/fail-closed wg `shared/SYGNATURY.md` V-SYG-0.7 i `shared/CBOSA-ADAPTER.md` |

**Wniosek końcowy (research zamknięty 2026-07-13k):** 5 źródeł z potwierdzonym
publicznym API bez konektora przed tą sesją (EUR-Lex, KRS, NBP, SUDOP, CEIDG)
— **wszystkie 5 mają teraz serwery referencyjne** (patrz tabela niżej). 5
źródeł potwierdzone BEZ publicznego REST API (interpretacje podatkowe/EUREKA,
KIO, KNF, CBOSA i częściowo ZUS). **Brak REST API nie oznacza automatycznie
web_search-only**: CBOSA ma od 2026-09-14 kanoniczny direct HTML adapter
Lex Machina, który odtwarza formularz i czyta `/doc/{ID}`. Dla pozostałych
źródeł nadal obowiązuje ich indywidualny kontrakt dostępu. Żadne inne
źródło z pełnej listy 50 domen nie zostało zbadane poza tymi dziewięcioma
najczęściej używanymi — to świadome ograniczenie zakresu, nie twierdzenie o
kompletności.

## Serwery referencyjne (2026-07-13g/i/k) — 7 z 9 zbadanych priorytetowych źródeł

`audyt-systemu-v4/mcp-servers/` zawiera **realne, przetestowane protokołem MCP**
serwery dla 7 źródeł o potwierdzonym publicznym API. Napisane po tym jak: (a)
żaden gotowy projekt OSS nie dał się zainstalować i przetestować z tego
środowiska, (b) research 2026-07-13j/k potwierdził, które źródła mają
publiczne API. To NIE zastępuje rekomendacji "integruj gotowe OSS, nie buduj
od zera" dla produkcji.

⛔ **Kolumna „pewność kształtu odpowiedzi” (do 3.89) była szacowana z dokumentacji, nie z
pomiaru — i była odwrotnie skorelowana z rzeczywistością:** SAOS („Wysoka”) zwracał sygnaturę
`null` dla każdego trafienia, NBP („Najwyższa”) zwracał NOT_FOUND w każdy weekend. Od 3.90
kolumna podaje WYNIK POMIARU TREŚCI (`audyt-systemu-v4/mcp-servers/test_na_zywo.mjs`, 2026-09-27j).

| Serwer | Źródło | Klucz API? | Pomiar treści 2026-09-27j |
|---|---|---|---|
| `isap-eli-example` | Sejm ELI (Dz.U./M.P.) | Nie | ✅ poprawny |
| `saos-example` | SAOS (SN, SP, TK, KIO — **bez NSA/WSA**) | Nie | ✅ po naprawie 1.1.0 (było: sygnatura `null`) |
| `krs-example` | KRS (Otwarte API) | Nie | ✅ poprawny |
| `nbp-example` | NBP (kursy walut) | Nie | ✅ po naprawie 1.1.0 (było: NOT_FOUND w dni wolne) |
| `sudop-example` | SUDOP/UOKiK (pomoc publiczna) | Nie | ⚠️ 1.1.0 bez crasha, ale kolejka nie oddała wyniku w >30 min (F-210) |
| `ceidg-example` | CEIDG (jednoosobowe działalności) | **Tak** | ⚠️ bez klucza poprawny ERROR; z kluczem niezmierzony |
| `eurlex-example` | EUR-Lex/CELLAR (prawo UE) | Nie | ✅ po naprawie 1.1.0 (było: 406, a pod spodem NOT_FOUND dla RODO) |
| `eureka-example` | EUREKA (interpretacje podatkowe MF) | Nie | ✅ nowy w 3.91 (27k) |

Każdy katalog ma własny README z pełnym statusem testów i ograniczeniami.
Priorytety wdrożenia wg wpływu: **EUR-Lex** (32 odwołania w dr-*/, największy
zwrot), **KRS** (wspiera PODMIOT-GATE routera), pozostałe wg potrzeb.

---

## ⭐ GDZIE SIĘ KONFIGURUJE SERWER MCP (zmierzone 2026-09-27g)

⛔ **Skill nie instaluje i nie włącza serwera MCP. Wskazanie nazwy w skillu niczego
nie uruchamia.** Skill może wyłącznie wykryć narzędzia, które host już udostępnił,
i zachować się zgodnie z `MCP-INTEGRACJA.md` (MCP-FIRST albo FALLBACK-HARDGATE).

Serwer konfiguruje się w jednym z trzech miejsc — wybór zależy od tego, kto i gdzie
ma z niego korzystać:

| Gdzie | Zasięg | Czy wędruje z instalacją pluginów |
|---|---|---|
| Konektory w aplikacji (claude.ai / desktop) | konto użytkownika | ❌ nie |
| `.mcp.json` w katalogu projektu albo `claude mcp add` | sesje otwarte w tym projekcie | ❌ nie |
| **`.mcp.json` w katalogu pluginu** albo klucz `mcpServers` w `.claude-plugin/plugin.json` | każdy, kto zainstaluje plugin | ✅ **tak** |

⚠️ **Stan repozytorium Lex Machina na 2026-09-27g:** `.mcp.json` z serwerem
`mcp-isap` leży w **korzeniu repozytorium**, a nie w żadnym pluginie. Działa więc
dla sesji otwieranych w sklonowanym repo, ale **NIE instaluje się razem z pluginami
z marketplace** — użytkownik, który zainstaluje skille, nie dostanie tego konektora.
Przeniesienie go do pluginu `shared` sprawiłoby, że wędruje z instalacją.
Decyzja należy do dewelopera (F-8/F-94) — to nie jest wada, tylko konsekwencja
miejsca, w którym plik dziś leży.

⭐ **INSTALACJA SERWERÓW MCP (od shared 3.93 / audyt 6.143, zmierzona 2026-09-27m).** Serwery leżą
ROZPAKOWANE w `audyt-systemu-v4/mcp-servers/`; `dist/lex-mcp.mjs` to wszystkie serwery w jednym
pliku z wbudowanymi zależnościami (629 KB; Claude Code nie instaluje zależności pluginów).
- **Claude Code + plugin `audyt-systemu-v4`:** nic nie instalujesz — `.mcp.json` pluginu startuje
  8 serwerów `lex-*` (z CBOSA) z `${CLAUDE_PLUGIN_ROOT}` (CEIDG pominięty — wymaga klucza).
- **Claude Desktop (zalecane):** rozszerzenie `lex-machina.mcpb` — Ustawienia → Rozszerzenia → zainstaluj z
  pliku. Node.js jest wbudowany w Desktop (README specyfikacji MCPB) — nie instalujesz Pythona ani Node.
  Jeden serwer, 13 narzędzi (14 z kluczem CEIDG). Zapasowo: `instaluj_serwery_mcp.py --scal-desktop`.
- **Sieć z proxy przechwytującym TLS:** `.mcp.json` pluginu nie przekaże `NODE_EXTRA_CA_CERTS`
  ani `HTTPS_PROXY` (podstawiane są tylko `CLAUDE_PLUGIN_ROOT`/`CLAUDE_PLUGIN_DATA`) — użyj
  instalatora, który wpisuje je do konfiguracji zakresu user.
- **claude.ai w przeglądarce:** stdio nie działa — serwer pod HTTPS (F-8).

**Minimalny komplet, żeby MCP realnie działał w tym systemie:**

```
1. serwer skonfigurowany tam, gdzie host go czyta (tabela wyżej)
2. narzędzia widoczne w rozmowie jako mcp__<serwer>__<narzędzie>
   → wykrycie wg MCP-INTEGRACJA.md KROK 1 (po kształcie nazwy i po ZDOLNOŚCI)
3. skill NIE zakłada obecności konektora — fail-closed do HARD GATE (KROK 3)
4. wynik MCP nadal podlega regule „MCP identyfikuje akt, HARD GATE czyta treść"
```

### Zmierzony konektor ELI/ISAP

`@matematicsolutions/mcp-isap` 1.3.0 (MIT, npm) — protokół MCP 2024-11-05
zweryfikowany realnie 2026-09-27g: `initialize` → `tools/list` → `tools/call`.
Narzędzia: `search_acts`, `get_act`, `get_act_text`. Źródło danych:
api.sejm.gov.pl/eli — **ten sam publikator, który HIERARCHIA-ZRODEL traktuje jako
RZĄD 1**, więc wynik tego konektora nie obniża rzędu źródła; nadal jednak
obowiązuje reguła, że treść merytoryczną czyta się przez HARD GATE
(`get_act_text` albo `/text.pdf`), a nie z samej metryki.

### ⭐ Serwer w pluginie — mechanika (2026-09-27h)

Deklaracja: `.mcp.json` w katalogu pluginu **albo** klucz `mcpServers`
w `.claude-plugin/plugin.json`. Ścieżek relatywnych nie ma — używa się zmiennych:

```json
{
  "mcpServers": {
    "isap-eli": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/tools/mcp-servers/isap-eli-example/isap-eli-mcp-server.js"],
      "env": { "HTTPS_PROXY": "", "NODE_EXTRA_CA_CERTS": "" }
    }
  }
}
```

`${CLAUDE_PLUGIN_ROOT}` = katalog zainstalowanego pluginu; `${CLAUDE_PLUGIN_DATA}` =
katalog trwały, przeżywa aktualizacje. Zależności: przy instalacji z marketplace
host wykonuje `npm ci --ignore-scripts`, gdy w katalogu jest `package-lock.json`
(nasze przykłady go mają), więc `@modelcontextprotocol/sdk` i `zod` doinstalują się
same. ⚠️ Ta część opisu pochodzi z **dokumentacji, nie z pomiaru** w tym repozytorium.

⛔ **OGRANICZENIE, KTÓRE ROZSTRZYGA WYBÓR TRANSPORTU** ⚠️ [dokumentacja, nie pomiar]:
serwery **stdio działają w Claude Code / lokalnie, ale NIE na claude.ai**. Skoro
skille tego repozytorium są używane także przez claude.ai, konektor mający tam
działać musi być **zdalny** (`"type": "http"` + `"url": "https://…"`), a nie
uruchamiany komendą. Serwer stdio w pluginie jest więc rozwiązaniem dla pracy
lokalnej; do portalu trzeba go wystawić pod adresem HTTPS.

### ⛔ PUŁAPKA ŚRODOWISKA — zmierzona 2026-09-27h

`getDefaultEnvironment()` z oficjalnego SDK przekazuje uruchamianemu serwerowi
**wyłącznie `HOME`, `PATH`, `SHELL`, `TERM`**. Zmiennych `HTTPS_PROXY` /
`NODE_EXTRA_CA_CERTS` **nie przekazuje**. Skutek w środowisku za proxy: każde
`fetch` w serwerze kończy się `fetch failed`, a narzędzie raportuje ERROR
„niedostępne źródło" — czyli objaw wygląda jak awaria API, a jest nieprzekazanym
środowiskiem.

```
Zmierzone: ten sam serwer, to samo zapytanie
  bez env → status=ERROR, detail="fetch failed"
  z env (HTTPS_PROXY + NODE_EXTRA_CA_CERTS) → status=AMBIGUOUS, 33 kandydatów
```

⛔ **Reguła:** przed orzeczeniem „konektor nie działa / API niedostępne" sprawdź,
czy konfiguracja przekazuje `env`. To ta sama klasa błędu co F-151/F-162
(orzekanie o niedostępności bez pomiaru), tylko o jedno piętro niżej.

### ✅ Status własnego konektora ISAP (zmierzony 2026-09-27h)

`audyt-systemu-v4/mcp-servers/isap-eli-example/` — 132 linie na oficjalnym SDK
(`McpServer` + `StdioServerTransport`), narzędzie `isap_lookup`.

⛔ **Wykryty i naprawiony błąd:** budował adres
`…/eli/acts/DU/search?title=…` → **HTTP 404**. Zmierzony poprawny endpoint:
`…/eli/acts/search?publisher=DU&title=…` → HTTP 200, pole `items`, polami
`publisher/year/pos/title/status/announcementDate/ELI` — dokładnie tymi, których
oczekiwał już `normalizujOdpowiedzELI()`. Poprawka jednoliniowa; docstring serwera
zmieniony z „NIE zostało przetestowane wobec żywego API" na przetestowane.

Po poprawce, pełny cykl `connect → listTools → callTool → close` na żywym API:
zapytanie „Kodeks karny skarbowy" → `AMBIGUOUS`, 33 kandydatów, pierwsi
`DU 2026 poz. 901` i `DU 2025 poz. 633` — zgodne z niezależnym odczytem ELI
i z obcym serwerem `@matematicsolutions/mcp-isap`.

⚠️ `AMBIGUOUS` przy 33 trafieniach jest zachowaniem **zgodnym z projektem**
(`>1 trafienie = AMBIGUOUS`, zakaz zgadywania). Jeśli konektor ma być użyteczny
operacyjnie, trzeba mu dodać parametry zawężające (`year`, `pos`, limit) — to
rozwój, nie naprawa.

**Wniosek dla wyboru między swoim a obcym serwerem:** własny serwer tego
repozytorium jest sprawny i pokrywa ten sam kanał RZĘDU 1, więc klonowanie obcego
serwera nie jest konieczne. Obcy (`@matematicsolutions/mcp-isap`, MIT) daje więcej
narzędzi od razu (`search_acts`, `get_act`, `get_act_text`) — jeśli miałby być
forkowany, MIT na to pozwala, ale wymaga zachowania noty licencyjnej i dopisania
atrybucji w `NOTICE` (precedens: F-199 dla materiału Apache-2.0).

### ⭐ STAN WSZYSTKICH KANAŁÓW — pomiar TREŚCI 2026-09-27j (zastępuje tabelę z 27h)

⛔ **Korekta 3.90.** Tabela z 27h (shared 3.89) wskazywała jako „konektory produkcyjne” siedem
pluginów (`mcp-isap-eli`, `mcp-saos`, `mcp-krs`, `mcp-wl-vat`, `mcp-uodo`, `mcp-eurlex`,
`mcp-nbp`), których **nie ma w repozytorium ani w `marketplace.json`** (sprawdzone 27j) —
powstały w sesji 27h/27i i nie zostały wgrane (F-211). Kolumna „Pomiar” mierzyła wyłącznie kod
HTTP: SAOS z „✅ 200” zwracał same `null`. Obecnie jedynym zmierzonym kodem w repo są przykłady
z `audyt-systemu-v4/mcp-servers/`.

| Kanał | Pomiar treści 27j | Konektor w repozytorium |
|---|---|---|
| `api.sejm.gov.pl/eli` (Dz.U./M.P.) | ✅ | `isap-eli-example` |
| `www.saos.org.pl/api` — SP (bieżąco), SN do 2016, TK do 2015, KIO do 2018 | ✅ 27t: zasięg zmierzony rok po roku | `saos-example` 1.2.0 (OUT_OF_SCOPE poza zasięgiem) |
| `www.saos.org.pl/api` — **NSA/WSA** | ⛔ **0 orzeczeń** dla każdego zapytania → OUT_OF_SCOPE | brak — właściwe źródło CBOSA |

⛔ **Skutek dla kolejności odkrywania** (kanon: `orzeczenia-sadowe-v2`, Faza 1-0): ze względu
na zasięg wyżej SAOS służy do wyszukiwania tematycznego orzeczeń starszych i sądów
powszechnych oraz jako cytator. Sygnatura znana → od razu baza urzędowa (bez SAOS);
nowsze SN/TK/KIO → web_search (fraza abstrakcyjna, tylko sygnatury ze źródeł wtórnych) +
wyszukiwarki urzędowe (sn.pl, CBOSA, UZP); sn.pl zablokowany → SAOS tylko sprzed 2017.
| `api-krs.ms.gov.pl` (KRS) | ✅ | `krs-example` |
| `api.nbp.pl` (kursy) | ✅ (dni wolne → ostatnia tabela, jawnie) | `nbp-example` 1.1.0 |
| `publications.europa.eu` SPARQL (Cellar) | ✅ (status obowiązywania, tytuł PL) | `eurlex-example` 1.1.0 |
| `api-sudop.uokik.gov.pl` (SUDOP) | ⚠️ 303 → kolejka; wynik nieoddany w >30 min | `sudop-example` 1.1.0 (PENDING) — F-210 |
| `dane.biznes.gov.pl/api/ceidg` v3 | ⚠️ 401 bez tokenu | `ceidg-example` (wymaga klucza) |
| `wl-api.mf.gov.pl` (biała lista VAT) | ✅ 27s: `date` obowiązkowy; NIP spoza wykazu = 200 + `subject: null` + requestId; `check` TAK/NIE; rachunki wirtualne | `wl-example` 1.0.0 |
| `orzeczenia.uodo.gov.pl` (UODO) | ✅ 27r: loadery React Router (`/search.data`, `/document/{URN}/content.data`, turbo-stream) | `uodo-example` 1.0.0 — prawomocność z metryki, post-check sygnatury |
| `orzeczenia.nsa.gov.pl` (CBOSA) | ⚠️ z sandboxa Claude: 503 bramy egress (27m) — pomiar z sieci użytkownika (F-213) | `cbosa-example` 1.0.0 (parser równoważny z referencyjnym) |
| `eureka.mf.gov.pl` (interpretacje) | ✅ 27k (POST; post-check sygnatury; status aktualności) | `eureka-example` 1.0.0 |
| `api.stat.gov.pl` (REGON/BIR) | ⚠️ wymaga UserKey | brak |

### ⭐ PORÓWNANIE Z `matematicsolutions` — uruchomione na tych samych przypadkach (2026-09-27k)

Paczki npm `@matematicsolutions/*` (MIT) uruchomione przez protokół MCP obok przykładów z
`audyt-systemu-v4/mcp-servers/`. Oceniane zachowanie, nie README.

| Kanał | Ich przewaga | Nasza przewaga | Przypadek rozstrzygający |
|---|---|---|---|
| EUREKA (`mcp-eureka` 0.2.0) | `list_categories`, strona wyników | post-check sygnatury; status aktualności | ucięta `…678.2026` → u nich „Znaleziono: 1” (inna sygnatura), u nas NOT_FOUND; status 29 → u nich bez słowa, u nas ⛔ |
| SAOS (`mcp-saos` 1.2.0) | ⭐ **`saos_cite_check`** (cytator: późniejsze orzeczenia powołujące sygnaturę); filtry `judgeName`, `referencedRegulation` | — (NSA/WSA: obie strony poprawnie) | 27q: `saos_cytator` (ścisłe dopasowanie sygnatury w treści, wykluczenie fałszywych trafień) — ⚠️ wzorce niezmierzone na żywo (SAOS w przerwie) |
| EUR-Lex (`mcp-eu-sparql` 1.2.0) | ⭐ **TSUE** (`search_cjeu`, `search_cjeu_by_ecli`), zakres dat, GDPRhub | status obowiązywania, data końca, tytuł PL | 31995L0046 → u nich bez „uchylona”; 27q: `eurlex_tsue` — dodatkowo po SYGNATURZE sprawy (C-131/12), której oni nie wyszukują |
| ISAP (`mcp-isap` 1.3.0) | ⭐ `get_act`, `get_act_text` (treść, wyszukiwanie w akcie, odesłanie do PDF), filtr `in_force` | — w przykładzie (mapowanie statusu było w pluginie 27h — F-211) | KC `DU/1964/93` → u nich „Stan: IN_FORCE” przy istniejącym t.j.; treść t.j. u nich tylko jako link do PDF (text.html t.j. pusty) — 27q: `isap_tekst` zwraca obowiązujące brzmienie z PDF |
| KRS (`mcp-krs` 1.1.1) | `get_board` | 27q: `krs_reprezentacja` + rejestr S | u nich pole `nazwa` zamiast `nazwaOrganu` (organ nigdy niewidoczny); PESEL z wolnego tekstu prokury przekazywany bez maski (ORLEN) — u nas maskowany; fundacje (rejestr S) — u nas FOUND |
| NSA/CBOSA (`mcp-nsa` 1.3.0; `cbosa-mcp` z ChatGPT) | istnieją | ⭐ `cbosa-example` 1.0.0 (27m): port parsera referencyjnego `orzeczenia-sadowe-v2` — exact-match, near-match odrzucany, paginacja z kontrolą licznika, fail-closed | ⛔ korekta 27m: 503 z 27k to BRAMA sandboxa Claude („upstream connect error”), nie CBOSA — z tego środowiska żadnego konektora CBOSA nie da się zmierzyć (F-213). `mcp-nsa`: `rejectUnauthorized: false`. `cbosa-mcp` (ChatGPT, Python): TLS poprawny, ale parser nie wyciąga Sygnatury/Daty/Sądu nawet z własnej próbki, próbki wymyślone (126/391 B), brak exact-match, błąd paginacji |
| UODO (w agregatorze `prawo-pl-mcp`; repozytorium niepubliczne) | istnieje | 27r: `uodo-example` — prawomocność z OSTATNIEGO zdarzenia (data ogłoszenia zawsze „nonfinal”), post-check sygnatury (wyszukiwarka prefiksowa) | ich kodu nie da się sprawdzić (GitHub 404, brak w PyPI) |
| NBP, SUDOP, CEIDG | — | kanały, których oni nie mają | — |

Wniosek: przewaga jakościowa (weryfikacja, status) po naszej stronie; przewaga zakresowa
(cytator SAOS, TSUE, treść aktu, reprezentacja KRS) po ich — F-212.

⭐ **KIO**: w SAOS `courtType=NATIONAL_APPEAL_CHAMBER` (22 168 orzeczeń, sygnatury
`KIO/UZP 2/07`) — ⛔ 27t: WYŁĄCZNIE do 2018 r. (0 od 2019); bieżące orzeczenia KIO: orzeczenia.uzp.gov.pl (F-212 pkt 5). Do 3.89 enum `saos-example` NIE zawierał tej wartości, więc twierdzenie
„pokryte jednym parametrem” nie było prawdziwe dla kodu w repo; od 1.1.0 jest.

⛔ **Reguła od 3.90:** wiersz tej tabeli może zawierać „✅” tylko po pomiarze TREŚCI odpowiedzi
(asercja na polu, nie na statusie HTTP) — `audyt-systemu-v4/mcp-servers/test_na_zywo.mjs`.
