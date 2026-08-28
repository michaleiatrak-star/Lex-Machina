# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Stan:** 2026-08-28. Ten plik zawiera wyłącznie zakres pozostający do wykonania. Historia zamknięć i napraw znajduje się w `AUDIT-JOURNAL.md` / `CHANGELOG.md`.

## Tablica sterująca

| Kategoria | Liczba | Pozycje |
|---|---:|---|
| Wykonalne sesją audytową | 2 | F-135, F-138 |
| Reaktywne | 1 | F-5 |
| Zależne od środowiska/dewelopera | 7 | F-8, F-9, F-11, F-94, F-113, F-133, F-137 |
| **Razem** | **10** | — |

## Wykonalne sesją audytową

| Flaga | Priorytet | Pozostały zakres | Kryterium zamknięcia |
|---|---|---|---|
| F-135 | średni | Dokończyć cross-check wartości prawnych w pozostałych DR, elementów unikalnych oraz `shared`; każdą rozbieżność rozstrzygnąć w źródle urzędowym albo jawnie oznaczyć jako nieweryfikowalną. | Zero nieuzasadnionych rozbieżności albo jawne oznaczenie nieweryfikowalnych pozycji. |
| F-138 | wysoki | Dokończyć techniczną migrację runtime do modelu current-state-only. DR-01, DR-05, DR-06, DR-07, DR-08, DR-10, DR-12 i DR-14 są już oczyszczone. Pozostaje kontrolowany cleanup przede wszystkim DR-03 i DR-04 oraz selektywny sweep pozostałych `MAPA-AKTOW.md`; następnie zsynchronizować końcowe wersje `audyt-systemu-v4` i `prawny-router-v3` w `SKILL.md` + `references/CHANGELOG.md` i wykonać realny test spójności. | Brak historycznych statusów w mapach runtime objętych migracją, zgodne wersje/changelogi, F-108 nie figuruje jako otwarta, a końcowy cross-check nie wykazuje sprzeczności blokujących. |

## Reaktywne

| Flaga | Zakres | Wyzwalacz |
|---|---|---|
| F-5 | Dedykowany moduł ustawy ESAP (Dz.U. 2026 poz. 644) oraz ustalenie wpływu na KSH. | Pierwsza sprawa z rynku kapitałowego lub nadzoru finansowego. |

## Zależne od środowiska lub dewelopera

| Flaga | Pozostały zakres |
|---|---|
| F-8 | Wdrożyć realny connector MCP do ELI/ISAP i zweryfikować protokół w środowisku docelowym. |
| F-9 | Wdrożyć znacznik `AUDIT_EVENT`, parser i politykę retencji w portalu. |
| F-11 | Uruchomić `extract_api_verification_log.py` na prawdziwej odpowiedzi API zawierającej wywołania narzędzi. |
| F-94 | Rozstrzygnąć rejestrację `KONEKTORY-REKOMENDOWANE.md`, status `shared/tools/mcp-servers/` i możliwy duplikat checklisty contradiction-intelligence. |
| F-113 | Potrzebne izolowane manifesty A/B, kontrola sieci T1/T2, autorytatywne logi narzędzi i identyfikator backendu do wykonania mierzalnego testu skuteczności bramek. |
| F-133 | Brak warunków środowiskowych do pomiaru B5-e2 i wpływu reguł routera; zależne od warunków F-113. |
| F-137 | Pozostał test akceptacyjny zapisu wydzielonej sekcji w hoście z natywną pamięcią trwałą. |

## Zamknięty benchmark bieżącej sesji

F-108 nie jest flagą otwartą: benchmark 52 aktów ma bieżący wynik **52/52 B+/COV**. `COV` nie oznacza `FULL`; dalsza walidacja głębokości należy do zwykłej pracy jakościowej i F-135, a nie do ponownego otwierania F-108.

## Zasada map runtime

- `MAPA-AKTOW.md` = aktualny akt → moduł;
- `MAPA-POKRYCIA.md` = aktualny faktyczny poziom pokrycia;
- mapy runtime nie przechowują baseline/delta ani historii dawnych luk;
- historia zmian trafia wyłącznie do `AUDIT-JOURNAL.md` / `CHANGELOG.md`;
- każda konkretna jednostka prawa nadal wymaga fresh gate do źródła urzędowego.
