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
| Orzecznictwo sądów powszechnych (SO/SA/SN — szeroka baza) | MCP server dla SAOS | orzeczenia.ms.gov.pl / SAOS | MIT (typowo) |
| Orzecznictwo NSA + 16 WSA (administracyjne, podatkowe, RODO) | MCP server dla CBOSA | orzeczenia.nsa.gov.pl (CBOSA) | MIT (typowo) |
| Orzecznictwo KIO (zamówienia publiczne) | MCP server dla bazy KIO | orzeczenia.uzp.gov.pl | Apache-2.0 (typowo) |
| Prawo UE (rozporządzenia/dyrektywy/CELEX/orzeczenia TSUE) | MCP server dla CELLAR/EUR-Lex | eur-lex.europa.eu | MIT (typowo) |
| Status podmiotu (spółka/organ) — używane przez PODMIOT-GATE routera | MCP server dla KRS | KRS (dane rejestrowe) | MIT (typowo) |
| Weryfikacja sygnatury wyroku (czy istnieje, sąd, data) bez pełnej treści | Deterministyczny weryfikator sygnatur (no-LLM, lookup) | SAOS | zależnie od projektu |

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
| CBOSA (`orzeczenia.nsa.gov.pl`) | (poza tą listą, ale kluczowe) | ❌ **NIE** | Potwierdzone już wcześniej w `orzeczenia-sadowe-v2/SKILL.md` — tylko formularz HTML, captcha po serii zapytań |

**Wniosek końcowy (research zamknięty 2026-07-13k):** 5 źródeł z potwierdzonym
publicznym API bez konektora przed tą sesją (EUR-Lex, KRS, NBP, SUDOP, CEIDG)
— **wszystkie 5 mają teraz serwery referencyjne** (patrz tabela niżej). 5
źródeł potwierdzone BEZ API (interpretacje podatkowe/EUREKA, KIO, KNF, CBOSA,
i częściowo ZUS) — dla nich jedyną drogą pozostaje web_fetch/web_search na
stronie HTML, dokładnie jak już robią odpowiednie skille DR. Żadne inne
źródło z pełnej listy 50 domen nie zostało zbadane poza tymi dziewięcioma
najczęściej używanymi — to świadome ograniczenie zakresu, nie twierdzenie o
kompletności.

## Serwery referencyjne (2026-07-13g/i/k) — 7 z 9 zbadanych priorytetowych źródeł

`shared/tools/mcp-servers/` zawiera **realne, przetestowane protokołem MCP**
serwery dla 7 źródeł o potwierdzonym publicznym API. Napisane po tym jak: (a)
żaden gotowy projekt OSS nie dał się zainstalować i przetestować z tego
środowiska, (b) research 2026-07-13j/k potwierdził, które źródła mają
publiczne API. To NIE zastępuje rekomendacji "integruj gotowe OSS, nie buduj
od zera" dla produkcji.

| Serwer | Źródło | Klucz API? | Pewność kształtu odpowiedzi |
|---|---|---|---|
| `isap-eli-example` | Sejm ELI (Dz.U./M.P.) | Nie | Niska — założona |
| `saos-example` | SAOS (orzecznictwo, wsparcie) | Nie | Wysoka — z dokumentacji `orzeczenia-sadowe-v2` |
| `krs-example` | KRS (Otwarte API) | Nie | Średnia — z publicznej dokumentacji ustawowej |
| `nbp-example` | NBP (kursy walut) | Nie | **Najwyższa** — jednoznaczna oficjalna dokumentacja |
| `sudop-example` | SUDOP/UOKiK (pomoc publiczna) | Nie | Średnia |
| `ceidg-example` | CEIDG (jednoosobowe działalności) | **Tak** | **Najniższa** — dokumentacja sugeruje API asynchroniczne |
| `eurlex-example` | EUR-Lex/CELLAR (prawo UE) | Nie | Niska co do zapytania SPARQL (uproszczone) |

Każdy katalog ma własny README z pełnym statusem testów i ograniczeniami.
Priorytety wdrożenia wg wpływu: **EUR-Lex** (32 odwołania w dr-*/, największy
zwrot), **KRS** (wspiera PODMIOT-GATE routera), pozostałe wg potrzeb.
