# Dokumentacja wdrożeniowa: warstwa MCP, audit-trail i sync Dz.U.
**shared/MCP-INTEGRACJA.md · shared/AUDIT-TRAIL-SPEC.md · audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md**

Wersja dokumentu: 2.0 (2026-07-13f) · Odbiorca: zespół developerski portalu (nie Claude)
Powiązane: `audyt-komercyjny-silnika-prawnego.md` (rekomendacje #2, #4, #6),
`AUDIT-JOURNAL.md` wpisy AUDYT-2026-07-13 do 2026-07-13f.

---

## 0. Jak czytać ten dokument?

**Skonsolidowano (2026-07-13f):** treść trzech skilli przeniesiono do
`shared/` (dla MCP i audit-trail — cross-cutting, używane przez router i
potencjalnie każdy DR-skill) oraz do `audyt-systemu-v4/` (dla sync Dz.U. —
bezpośrednio wspiera FAZĘ 3 tego właśnie skilla). Trzy zbędne skille-wrappery
usunięto. Liczba skilli w systemie: 36 → 33 (powrót do stanu sprzed sesji
2026-07-13). Cała funkcjonalność, wszystkie testy i cała treść merytoryczna
pozostały bez zmian — zmieniło się wyłącznie **gdzie** to mieszka.

Ten dokument nadal tłumaczy *po co* te mechanizmy istnieją, *jak* są ze sobą
powiązane, *co* trzeba zrobić żeby zaczęły działać produkcyjnie, i *co już
zostało przetestowane* a co jeszcze nie — teraz pod nowymi, docelowymi
ścieżkami.

| Funkcjonalność | Rekomendacja z audytu | Nowa lokalizacja (kanoniczna) |
|---|---|---|
| Warstwa MCP jako uzupełnienie HARD GATE | #2 | `shared/MCP-INTEGRACJA.md` |
| Audit-trail zgodny z art. 12 AI Act | #4 | `shared/AUDIT-TRAIL-SPEC.md` |
| Automatyzacja wykrywania nowych Dz.U. | #6 | `audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md` |
| Deterministyczna walidacja cytowań w gotowym piśmie | (sesja 2026-07-12, osobny wątek) | `shared/tools/walidator_cytowan.py` + `export_gate.py` |

---

## 1. Architektura — jak te elementy się łączą

```
                         ┌─────────────────────────┐
                         │   Użytkownik / sprawa    │
                         └────────────┬────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │   prawny-router-v3 v3.16  │
                         │   (orkiestrator)           │
                         └──┬────────────────────┬───┘
                            │                    │
              KROK 1-4 protokołu       emisja znaczników
              shared/MCP-INTEGRACJA.md AUDIT_EVENT (opcjonalnie,
                            │          wymaga wdrożenia przez portal)
              ┌─────────────▼─────────────┐        │
              │ Connector MCP podłączony? │        │
              └───┬───────────────────┬───┘        │
              TAK │                   │ NIE         │
                  ▼                   ▼             │
        ┌──────────────────┐  ┌──────────────┐      │
        │ Zapytanie do MCP  │  │ shared/       │      │
        │ (ISAP/SAOS/CBOSA/ │  │ PRAWO-HARDGATE│      │
        │  KRS/EUR-Lex)     │  │ .md (fallback)│      │
        └─────────┬─────────┘  └──────┬───────┘      │
                  │  FOUND+obowiązuje │               │
                  │  → użyj wyniku    │               │
                  │  inaczej → ▼      │               │
                  └──────────►└───────┘               │
                                                       ▼
                                        ┌───────────────────────────┐
                                        │ shared/tools/               │
                                        │ router_event_parser.py      │
                                        │ (portal, poza Claude)        │
                                        └─────────────┬─────────────┘
                                                       ▼
                                        ┌───────────────────────────┐
                                        │ shared/tools/               │
                                        │ append_event.py             │
                                        │ → audit_log.jsonl           │
                                        │   (hash-chain SHA-256)       │
                                        └─────────────┬─────────────┘
                                                       ▼
                                        ┌───────────────────────────┐
                                        │ shared/tools/               │
                                        │ hash_chain_verify.py        │
                                        │ (kontrola integralności)      │
                                        └───────────────────────────┘

  Osobno, przed present_files/eksportem gotowego pisma:

  ┌───────────────────────────┐        ┌─────────────────────────────┐
  │ shared/tools/               │───────▶│ shared/tools/                 │
  │ extract_api_verification_   │        │ walidator_cytowan.py          │
  │ log.py (z konwersacji API)  │        │ (sprawdza cytaty w piśmie)     │
  └───────────────────────────┘        └──────────────┬──────────────┘
         oba wywoływane razem przez shared/tools/export_gate.py ──┘
                                                        │
                                          exit 0 → dopuść / exit 1 → zablokuj

  Równolegle, niezależnie od powyższego przepływu sesji:

  ┌────────────────────────┐        ┌─────────────────────────────┐
  │ Harmonogram cron/Action │──raz──▶│ audyt-systemu-v4/scripts/     │
  │ (HARMONOGRAM-CRON.md)   │dziennie│ sync_dzu_eli.py               │
  └────────────────────────┘        └──────────────┬──────────────┘
                                                      ▼
                                     ┌───────────────────────────────┐
                                     │ Sesja audyt-systemu-v4 FAZA 3   │
                                     │ (człowiek + Claude, ręczna       │
                                     │  weryfikacja i wpis do mapa_dzu) │
                                     └───────────────────────────────┘
```

**Kluczowa zasada widoczna na diagramie:** żadna z tych warstw nie zastępuje
istniejącego mechanizmu — każda jest **równoległym uzupełnieniem**: MCP
uzupełnia HARD GATE, audit-trail dokumentuje to, co router już robi,
walidacja cytowań sprawdza gotowe pismo przed eksportem, sync-dzu przyspiesza
wejście do sesji audytowej. I żadna z nich nie jest już osobnym skillem —
wszystkie mieszkają tam, gdzie mieszka reszta infrastruktury tego samego typu.

---

## 2. shared/MCP-INTEGRACJA.md — szczegóły

### Co robi
Protokół: zanim router użyje `web_search`/`web_fetch` do zweryfikowania
powołania prawnego, sprawdza czy jest podłączony connector MCP dla danego typu
zapytania. Jeśli tak — pyta go najpierw. Wynik klasyfikowany jako
FOUND / NOT_FOUND / AMBIGUOUS / ERROR.

### Pliki i ich rola

| Plik | Rola |
|---|---|
| `shared/MCP-INTEGRACJA.md` | Protokół 4-krokowy (dla Claude) + zasada nadrzędna „MCP uzupełnia, nie zastępuje HARD GATE” |
| `shared/KONEKTORY-REKOMENDOWANE.md` | Lista typów connectorów do podłączenia + zasady bezpieczeństwa (read-only, brak danych sprawy w zapytaniach) |
| `shared/SCHEMAT-ODPOWIEDZI-MCP.md` | Format ustrukturyzowanej odpowiedzi oczekiwanej od connectora |
| `shared/tools/przyklad-adapter-normalizujacy.md` | Przykład koncepcyjny adaptera (JS), ilustracja nie gotowy kod |
| `shared/tools/test_mcp_protocol.py` | **Gotowy, przetestowany kod Python**: funkcja `klasyfikuj_odpowiedz()` + `wymaga_fallbacku_hardgate()`, 6 testów jednostkowych |
| `shared/tools/connector_health_check.py` | **Gotowy, przetestowany kod Python**: health-check listy connectorów, z self-testem na mock-serwerze |

### Integracja z prawny-router-v3
Router (v3.16) ładuje `shared/MCP-INTEGRACJA.md` jako `required_modules`
**opcjonalnie** — `view` tego pliku jest tani (sam protokół), a faktyczne
wywołanie narzędzia MCP następuje tylko, gdy narzędzie jest realnie dostępne.

### Co musi zrobić programista portalu

1. Wybrać ≥1 connector MCP z `shared/KONEKTORY-REKOMENDOWANE.md` i wdrożyć go.
2. Utworzyć `connectors.json` (format w nagłówku `connector_health_check.py`).
3. Uruchomić `python shared/tools/connector_health_check.py --config connectors.json` cyklicznie.
4. Dostosować `test_mcp_protocol.py::klasyfikuj_odpowiedz()` do natywnego formatu wybranego connectora, jeśli się różni.
5. Przetestować wszystkie 4 ścieżki wobec **realnego** connectora przed produkcją.

### Status testów
✅ `test_mcp_protocol.py` — 6/6 testów jednostkowych.
✅ `connector_health_check.py` — self-test na mock-serwerze HTTP.
⚠️ Nie przetestowano wobec żadnego realnego connectora MCP (flaga F-8).

---

## 3. shared/AUDIT-TRAIL-SPEC.md — szczegóły

### Co robi
Specyfikacja + referencyjna implementacja logu zdarzeń z hash-chain SHA-256,
zgodnego z wymogiem automatycznego rejestrowania zdarzeń z art. 12 AI Act.

### Pliki i ich rola

| Plik | Rola |
|---|---|
| `shared/AUDIT-TRAIL-SPEC.md` | Specyfikacja: co logować (8 typów zdarzeń), format JSON Lines, algorytm hash-chain, mapowanie na kroki routera |
| `shared/tools/hash_chain_verify.py` | Weryfikacja integralności istniejącego logu (wykrywa manipulację) |
| `shared/tools/append_event.py` | Dopisywanie nowego zdarzenia z poprawnym hash-chain |
| `shared/tools/router_event_parser.py` | Wydobywanie znaczników `AUDIT_EVENT` z tekstu odpowiedzi i zapis przez `append_event.py` |

### Konwencja znacznika
Portal instruuje model (poza tym repozytorium skilli, na poziomie system
promptu portalu), żeby przy każdym zdarzeniu z tabeli w `AUDIT-TRAIL-SPEC.md`
dopisywał niewidoczny znacznik:
```
<!--AUDIT_EVENT:{"event":"HARDGATE_VERIFICATION","session_id":"abc-123","payload":{...}}-->
```
`router_event_parser.py` wyłuskuje te znaczniki i zapisuje przez `append_event.py`.

### Co musi zrobić programista portalu

1. Zaimplementować konwencję znacznika w system promptcie portalu.
2. Po każdej odpowiedzi routera: `router_event_parser.py --input <tekst> --log audit_log.jsonl`.
3. Ustalić politykę retencji/dostępu do `audit_log.jsonl`.
4. Okresowo: `hash_chain_verify.py audit_log.jsonl`.

### Status testów
✅ `hash_chain_verify.py`, `append_event.py` (self-test + integracja append→verify), `router_event_parser.py` (self-test 4 znaczniki, 2 poprawne/2 błędne) — wszystkie PASS.
⚠️ Konwencja znacznika nie wdrożona w żadnym prawdziwym prompcie portalu (flaga F-9).

---

## 4. audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md — szczegóły

### Co robi
Cyklicznie sprawdza Sejm ELI API pod kątem nowych pozycji Dz.U./M.P. i
generuje raport różnic — jako **wejście** do sesji `audyt-systemu-v4` FAZA 3,
nie jako jej zamiennik.

### Pliki i ich rola

| Plik | Rola |
|---|---|
| `audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md` | Opis przepływu, jawne ograniczenie zakresu (tylko wykrywanie) |
| `audyt-systemu-v4/references/FORMAT-RAPORTU-ROZNIC.md` | Jak sesja audytowa ma interpretować raport |
| `audyt-systemu-v4/references/HARMONOGRAM-CRON.md` | Przykłady cron i GitHub Actions |
| `audyt-systemu-v4/scripts/sync_dzu_eli.py` | Pobiera nowe pozycje, porównuje z mapą, buduje raport |
| `audyt-systemu-v4/scripts/mock_eli_server_test.py` | Test end-to-end na lokalnym mock-serwerze HTTP, bez internetu |
| `audyt-systemu-v4/scripts/bootstrap_last_sync_date.py` | Idempotentna inicjalizacja pliku stanu `.last_sync_date` |

### Co musi zrobić programista portalu

1. Uruchomić `bootstrap_last_sync_date.py --mapa-dir audyt-systemu-v4/references` raz.
2. Ustawić harmonogram wg `HARMONOGRAM-CRON.md`.
3. Zweryfikować rzeczywisty kształt odpowiedzi Sejm ELI API (endpoint/pola JSON w `pobierz_nowe_pozycje_eli()`).
4. Podłączyć raport do procesu inicjującego kolejną sesję FAZA 3.

### Status testów
✅ Parsowanie mapy, budowa raportu, **pełny test end-to-end na mock-serwerze** (`mock_eli_server_test.py`), `bootstrap_last_sync_date.py` (idempotentność) — wszystkie PASS.
⚠️ Nie przetestowano wobec żywego api.sejm.gov.pl (flaga F-10).

---

## 5. shared/tools/ — bramka walidacji cytowań (wątek z sesji 2026-07-12)

`walidator_cytowan.py` sprawdza, czy każde powołanie w gotowym piśmie ma
odpowiadające zdarzenie weryfikacji w logu sesji API. `extract_api_
verification_log.py` buduje ten log automatycznie z surowej konwersacji API
(bloki `server_tool_use`/`*_tool_result`). `export_gate.py` łączy oba w jedno
wywołanie — jedyny punkt integracyjny dla portalu:

```
python3 shared/tools/export_gate.py --document pismo.docx --api-conversation konwersacja_api.json
```
Kod wyjścia 1 → zablokuj eksport, pokaż prawnikowi listę niezweryfikowanych
powołań. Test end-to-end na fixture `shared/tools/przyklady/konwersacja_api_
przyklad.json` → `przyklad_pisma.md`: poprawnie 2/4 powołania zweryfikowane.

⚠️ Kształt bloków `server_tool_use`/`*_tool_result` w `extract_api_
verification_log.py` odzwierciedla dokumentację Anthropic API, ale nie był
skonfrontowany z prawdziwą odpowiedzią API (flaga F-11).

---

## 6. Pełny manifest plików (po konsolidacji 2026-07-13f)

```
shared/
├── MCP-INTEGRACJA.md                      [przeniesione z mcp-zrodla-prawa-v1/SKILL.md]
├── KONEKTORY-REKOMENDOWANE.md             [przeniesione]
├── SCHEMAT-ODPOWIEDZI-MCP.md              [przeniesione]
├── AUDIT-TRAIL-SPEC.md                    [przeniesione z audit-trail-portal-v1/SKILL.md]
├── DEPENDENCY-GRAPH.md                    [zaktualizowany]
└── tools/
    ├── README.md
    ├── walidator_cytowan.py               [od 2026-07-12]
    ├── extract_api_verification_log.py    [od 2026-07-13d]
    ├── export_gate.py                     [od 2026-07-13d]
    ├── test_mcp_protocol.py               [przeniesione, przetestowane 6/6]
    ├── connector_health_check.py          [przeniesione, self-test OK]
    ├── przyklad-adapter-normalizujacy.md  [przeniesione]
    ├── hash_chain_verify.py               [przeniesione]
    ├── append_event.py                    [przeniesione, przetestowane]
    ├── router_event_parser.py             [przeniesione, przetestowane]
    └── przyklady/
        ├── przyklad_pisma.md
        ├── sesja_pelna.json
        ├── sesja_niepelna.json
        └── konwersacja_api_przyklad.json

audyt-systemu-v4/
├── references/
│   ├── AUDIT-JOURNAL.md                   [pełna historia, w tym ta konsolidacja]
│   ├── WARN-OTWARTE.md                    [flagi F-8..F-11 nadal otwarte]
│   ├── CHECKLIST-DEDUP.md                 [zaktualizowany, 4 kanoniczne lokalizacje]
│   ├── SYNC-DZU-AUTOMATYCZNY.md           [przeniesione z sync-dzu-automatyczny-v1/SKILL.md]
│   ├── FORMAT-RAPORTU-ROZNIC.md           [przeniesione]
│   ├── HARMONOGRAM-CRON.md                [przeniesione]
│   └── mapa_dzu_*.md
└── scripts/
    ├── README.md
    ├── ci_check_shared.py
    ├── install_precommit_hook.sh
    ├── dostarcz_skill.sh                  [deterministyczne wymuszenie ZASADY 7]
    ├── sync_dzu_eli.py                    [przeniesione, przetestowane end-to-end]
    ├── mock_eli_server_test.py            [przeniesione]
    └── bootstrap_last_sync_date.py        [przeniesione, przetestowane]

prawny-router-v3/
└── SKILL.md                               [v3.16 — MCP jako required_module opcjonalny]
```

---

## 7. Checklista wdrożenia produkcyjnego

- [ ] `shared/MCP-INTEGRACJA.md`: wybrać i wdrożyć ≥1 connector MCP, uzupełnić `connectors.json`, przetestować 4 ścieżki wobec realnego connectora
- [ ] `shared/AUDIT-TRAIL-SPEC.md`: zaimplementować konwencję znacznika `AUDIT_EVENT`, podłączyć `router_event_parser.py`, ustalić retencję logu
- [ ] `shared/tools/export_gate.py`: podłączyć do pipeline'u tuż po HYBRID-VALIDATION, przed `present_files`/eksportem; zapisywać pełną konwersację API do formatu wejściowego
- [ ] `audyt-systemu-v4/.../SYNC-DZU-AUTOMATYCZNY.md`: bootstrap, harmonogram, weryfikacja kształtu realnego Sejm ELI API
- [ ] Po każdym z powyższych: wpis w `AUDIT-JOURNAL.md` zamykający odpowiednią flagę w `WARN-OTWARTE.md`

---

## 8. Jak uruchomić wszystkie self-testy naraz

```bash
# MCP
python -m unittest shared/tools/test_mcp_protocol.py -v
python shared/tools/connector_health_check.py --self-test

# Audit-trail
python shared/tools/append_event.py --self-test
python shared/tools/router_event_parser.py --self-test

# Walidacja cytowań
python shared/tools/extract_api_verification_log.py --self-test
python shared/tools/export_gate.py --self-test
python shared/tools/walidator_cytowan.py --document shared/tools/przyklady/przyklad_pisma.md --log shared/tools/przyklady/sesja_pelna.json

# Sync Dz.U.
python audyt-systemu-v4/scripts/bootstrap_last_sync_date.py --self-test
python audyt-systemu-v4/scripts/mock_eli_server_test.py

# Spójność całego repo (0 zerwanych odwołań oczekiwane)
python audyt-systemu-v4/scripts/ci_check_shared.py --repo-root .
```

Wszystkie powyższe zostały uruchomione po konsolidacji (2026-07-13f) i
zakończyły się sukcesem — patrz `AUDIT-JOURNAL.md`, wpis AUDYT-2026-07-13f.

---

## 9. Czego ta dokumentacja świadomie NIE obiecuje

- Nie gwarantuje, że wybrany przez developera connector MCP będzie działał bez modyfikacji.
- Nie gwarantuje zgodności ze 100% wymogów art. 12 AI Act.
- Nie gwarantuje, że Sejm ELI API ma dokładnie taki kształt odpowiedzi, jaki założono w `sync_dzu_eli.py`.
- Nie gwarantuje, że kształt bloków `server_tool_use`/`*_tool_result` w `extract_api_verification_log.py` odpowiada dokładnie temu, co zwraca prawdziwe Claude API w konkretnej integracji portalu.
- Nie twierdzi, że konsolidacja z sekcji 0 była ostatnim błędem architektonicznym tej sesji — to developer i kolejne audyty ostatecznie weryfikują, czy struktura jest właściwa.
