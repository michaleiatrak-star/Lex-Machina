# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Stan:** 2026-08-26. Ten plik zawiera wyłącznie zakres pozostający do
wykonania. Historia zamknięć i napraw znajduje się w `AUDIT-JOURNAL.md`.

## Tablica sterująca

| Kategoria | Liczba | Pozycje |
|---|---:|---|
| Wykonalne sesją audytową | 3 | F-86, F-108, F-135 |
| Reaktywne | 1 | F-5 |
| Zależne od środowiska/dewelopera | 7 | F-8, F-9, F-11, F-94, F-113, F-133, F-137 |
| **Razem** | **11** | — |

## Wykonalne sesją audytową

| Flaga | Priorytet | Pozostały zakres | Kryterium zamknięcia |
|---|---|---|---|
| F-86 | niski | Uzupełnić dalsze odrębne postępowania upadłościowe od art. 426; dotychczasowy moduł jest mapą nawigacyjną, nie pełnym opracowaniem całego zakresu flagi. | Pozostałe zakresy opisane i mapa pokrycia odświeżona; kontrola treści jednostek odrębna od kontroli metryki. |
| F-108 | wysoki | Źródło MS/BIP: 52 akty, ponowny odczyt 2026-08-27. P1/46: nowy rdzeń cywilny transakcji handlowych, 6 półroczy; historia i administracja nadal częściowe. Pozostaje etap 2 dla 48 A+B, pozostałe P1/P2 i decyzje P3. | Pełne warunki i rejestr 52 pozycji w `F-108-lista-MS-egzamin-2026.md`; flaga OTWARTA. |
| F-135 | średni | Dokończyć cross-check wartości prawnych w pozostałych DR, elementów unikalnych oraz `shared`. Batch 2 skorygował PUSA, POŚ, PKPiR, Prawo lotnicze i timeshare oraz dodał kontrolę tytułu aktu. | Zero nieuzasadnionych rozbieżności albo jawne oznaczenie nieweryfikowalnych pozycji. |

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
| F-113 | Niezależny preflight 2026-08-26: `NIEMIERZALNE`. Potrzebne izolowane manifesty A/B, kontrola sieci T1/T2, autorytatywne logi narzędzi i identyfikator backendu. Dowód: `F-113-PREFLIGHT-2026-08-26.md`. |
| F-133 | `NIEMIERZALNE` w tym hoście razem z F-113; brak warunków do pomiaru B5-e2 i wpływu reguł routera. |
| F-137 | Procedura i pozycja 13 są wdrożone; pozostał test akceptacyjny zapisu wydzielonej sekcji w hoście z natywną pamięcią trwałą. Bieżący host nie udostępnia takiego capability. |

## Zamknięcia z bieżącej sesji

F-10, F-48, F-82, F-83, F-88, F-102, F-104, F-106, F-110, F-125 i F-136 zostały
zamknięte 2026-08-26. Szczegóły i dowody reprodukcji: `AUDIT-JOURNAL.md`.
