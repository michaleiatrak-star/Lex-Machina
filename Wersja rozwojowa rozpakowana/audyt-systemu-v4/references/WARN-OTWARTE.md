# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Plik:** `WARN-OTWARTE.md`
**Opis:** Rejestr WYŁĄCZNIE otwartych flag audytowych (WARN numerowane +
flagi strukturalne bez numeru). Zawiera TYLKO to, co jest jeszcze do
zrobienia — bez narracji historycznej, bez wpisów o zamkniętych flagach.
**Plik siostrzany:** `AUDIT-JOURNAL.md` — dziennik chronologiczny pełnej
historii sesji (otwarcia, zamknięcia, naprawy, wnioski). Zamknięcie flagi
NIE zostaje w tym pliku — trafia wyłącznie do AUDIT-JOURNAL jako część
historii. Ten plik po zamknięciu flagi traci odpowiedni wiersz.

> **Zasada podziału (wprowadzona 2026-07-07, ZASADA 10 w SKILL.md):**
> - Otwarcie nowej flagi → dodaj wiersz TUTAJ + wpis w AUDIT-JOURNAL.md.
> - Zamknięcie flagi → USUŃ wiersz STĄD + odnotuj zamknięcie WYŁĄCZNIE
>   w AUDIT-JOURNAL.md (z pełnym opisem naprawy, jak dotychczas).
> - Ten plik nie rośnie w nieskończoność — to jest "TODO", nie archiwum.
> - Przed odpowiedzią na pytanie "co jest jeszcze otwarte" / "czy wszystkie
>   WARN zamknięte" — czytaj TEN plik, nie grepuj całego AUDIT-JOURNAL.md.

---

## Stan na 2026-07-07 (po sesji zamykającej WARN-12, WARN-24, WARN-28, WARN-29)

**WARN numerowane otwarte: 0.** Wszystkie WARN-1 do WARN-29 zamknięte —
pełna historia w `AUDIT-JOURNAL.md`, wpisy AUDYT-2026-07-07a i 07-07b.

**Flagi strukturalne bez numeru WARN — otwarte:**

| # | Flaga | Skill / dziedzina | Priorytet | Otwarta od | Opis | Wymaga |
|---|---|---|---|---|---|---|
| F-4 | Nowelizacja ustawy o przeciwdziałaniu narkomanii — akt nieopublikowany na dzień ostatniej weryfikacji | dr-03-prawo-karne-wykroczenia-egzekucja | niski | 2026-07-04 (zaktualizowana 2026-07-15) | Ustawa uchwalona przez Sejm 11.06.2026, przekazana do Senatu. VER 2026-07-15: nadal NIEOPUBLIKOWANA — ustawa czeka na decyzję Prezydenta (podpis / weto / skierowanie do TK); Prezydent ma 21 dni od przekazania ustawy, decyzja spodziewana "jeszcze w tym miesiącu" (lipiec 2026) wg doniesień prasowych z ok. 8.07.2026. Jeśli podpisana, wejście w życie po 30 dniach od ogłoszenia w Dz.U. | Sprawdzić w ISAP ponownie po ok. 2-3 tygodniach (oczekiwana decyzja prezydencka) — jeśli podpisana, skatalogować numer Dz.U. i zaktualizować moduł dr-03 |
| F-5 | Ustawa ESAP (Dz.U. 2026 poz. 644) skatalogowana, bez modułu dedykowanego | dr-06-podatki-finanse-publiczne-aml | niski | 2026-07-07 | Omnibus ~17 ustaw sektora finansowego (rachunkowość, KRS, fundusze emerytalne, Prawo bankowe, KSH incydentalnie, oferta publiczna, obrót instrumentami finansowymi, ubezpieczenia, BFG, biegli rewidenci) — niska aktywność tematyczna w typowych sprawach systemu. UWAGA (2026-07-15): przy okazji naprawy F-6 nie udało się jednoznacznie potwierdzić źródłowo, na czym polega dotknięcie KSH przez tę ustawę — wymaga odrębnej weryfikacji, jeśli temat stanie się aktywny | Moduł dedykowany tylko jeśli sprawy z zakresu rynku kapitałowego/nadzoru finansowego staną się aktywne; przy tej okazji też zweryfikować konkretny zakres zmiany w KSH |
| F-8 | Żaden realny connector MCP nie jest podłączony do rozmów silnika — protokół (shared/MCP-INTEGRACJA.md) i logika klasyfikacji przetestowane w pełni, w tym od 2026-07-13h realnym serwerem referencyjnym (isap-eli-example) zweryfikowanym prawdziwym klientem MCP przez stdio, ale bez podłączenia w środowisku produkcyjnym i bez testu wobec żywego api.sejm.gov.pl | shared/MCP-INTEGRACJA.md, shared/tools/mcp-servers/isap-eli-example | średni | 2026-07-13 (zaktualizowana 2026-07-13b, 2026-07-13f, 2026-07-13h) | `test_mcp_protocol.py` (6 testów), `connector_health_check.py --self-test` (mock-serwer) — PASS. Od 2026-07-13h: `isap-eli-example/test_protokol_mcp.mjs` — prawdziwy klient MCP (`@modelcontextprotocol/sdk`) połączył się z serwerem przez stdio, wykonał handshake, `tools/list`, `tools/call` — PASS, `isap_lookup` poprawnie zwrócił ERROR przy braku dostępu sieciowego do domen .gov.pl (środowisko audytowe nie ma tego dostępu). Pozostaje: (a) wdrożenie tego lub innego connectora w środowisku developera z dostępem do api.sejm.gov.pl, (b) weryfikacja realnego kształtu odpowiedzi JSON, (c) podłączenie w klencie MCP (Claude Desktop/Code) | Developer uruchamia `npm install && node test_protokol_mcp.mjs` w `shared/tools/mcp-servers/isap-eli-example/`, potwierdza kształt odpowiedzi API, podłącza serwer w konfiguracji klienta MCP |
| F-9 | audit-trail-portal-v1 to specyfikacja + referencyjne skrypty, konwencja znacznika AUDIT_EVENT nie wdrożona w żadnym prawdziwym prompcie portalu | audit-trail-portal-v1 | niski (odpowiedzialność poza silnikiem) | 2026-07-13 (zaktualizowana 2026-07-13b) | `hash_chain_verify.py`, `append_event.py` (self-test + test integracyjny append→verify na wspólnym pliku) i `router_event_parser.py` (self-test na 4 znacznikach, 2 poprawne/2 celowo błędne) przechodzą w całości. Pozostaje: (a) wdrożenie konwencji znacznika w system promptcie portalu, (b) podłączenie parsera do realnego przepływu odpowiedzi routera, (c) polityka retencji logu | Portal implementuje konwencję znacznika + podłącza pipeline zapisu wg DOKUMENTACJA-WDROZENIOWA-2026-07-13.md, sekcja 3 |
| F-10 | sync_dzu_eli.py nie przetestowany wobec żywego Sejm ELI API | sync-dzu-automatyczny-v1 | średni | 2026-07-13 (zaktualizowana 2026-07-13b) | Logika parsowania mapy, budowy raportu ORAZ pełny przepływ end-to-end (pobierz→porównaj→raport) przetestowane przez `mock_eli_server_test.py` wobec lokalnego mock-serwera HTTP symulującego Sejm ELI — wszystko przechodzi poprawnie. Dodano też `bootstrap_last_sync_date.py` (idempotentna inicjalizacja stanu, przetestowana). Jedyny pozostały krok: zweryfikować, czy PRAWDZIWE api.sejm.gov.pl ma dokładnie taki kształt odpowiedzi (endpoint/pola JSON) jak założono — środowisko audytowe nie ma dostępu do domen .gov.pl | Developer uruchamia sync_dzu_eli.py wobec żywego API, koryguje `pobierz_nowe_pozycje_eli()` jeśli kształt się różni |
| F-11 | extract_api_verification_log.py zakłada kształt bloków server_tool_use/*_tool_result wg dokumentacji, nie wobec realnej odpowiedzi API | shared/tools | średni | 2026-07-13d | Logika ekstrakcji przetestowana w pełni na danych syntetycznych (self-test + test end-to-end na fixture `konwersacja_api_przyklad.json` → poprawne 2/4 dopasowania na realnym przykładowym piśmie systemu). Format bloków content[] nie był nigdy skonfrontowany z prawdziwą odpowiedzią Claude API z tego środowiska (sandbox audytowy nie wywołuje API bezpośrednio w ten sposób) | Developer zapisuje jedną prawdziwą odpowiedź API z wywołaniami web_search/web_fetch i uruchamia `extract_api_verification_log.py` wobec niej jako pierwszy test integracyjny przed produkcją |

**Obserwacje informacyjne (nie są formalnymi flagami, nie blokują, ale warto pamiętać):**

| # | Obserwacja | Skill | Opis |
|---|---|---|---|
| O-1 | Nowelizacja ABW/AW ws. treści terrorystycznych (Dz.U. 2024 poz. 1684) nieopisana w module | dr-13-sluzby-bezpieczenstwo-informacje-niejawne | Uprawnienia Szefa ABW do nakazów usunięcia treści terrorystycznych (implementacja rozp. UE 2021/784) nie są opisane w `mod-ustawa-ABW-AW-CBA-sluzby-specjalne.md`. Odkryte przy okazji naprawy WARN-28/29 (2026-07-07a). Wąska kompetencja, rzadko aktywna w typowej sprawie DR-13. |

---

## Jak korzystać z tego pliku

- **Pytanie "co jest jeszcze otwarte?"** → odpowiedz na podstawie tabel powyżej, nie grepuj AUDIT-JOURNAL.md.
- **Zamykasz flagę F-N?** → usuń jej wiersz z tabeli powyżej, dodaj pełny opis naprawy jako nowy wpis w `AUDIT-JOURNAL.md` (z numerem/kodem flagi w tytule wpisu dla identyfikowalności).
- **Otwierasz nową flagę?** → dodaj wiersz tutaj (kolejny wolny numer F-N lub WARN-N zgodnie z konwencją) ORAZ krótki wpis w AUDIT-JOURNAL.md dokumentujący odkrycie.
- **Numeracja WARN-N vs F-N:** WARN-N zarezerwowane dla flag odkrytych w toku klasycznego trybu audytowego (TRYB DZU, TRYB WARN-CLOSE). F-N dla flag strukturalnych odkrytych przy innych okazjach (audyty kompletności, sesje tematyczne). Oba typy są "otwartymi flagami" w rozumieniu tego rejestru — nie różnicuj ważności po prefiksie, tylko po kolumnie Priorytet.
