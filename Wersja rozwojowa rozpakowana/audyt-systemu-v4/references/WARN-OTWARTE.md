# WARN-OTWARTE — rejestr żywy otwartych flag audytowych

**Stan:** 2026-08-28. Ten plik zawiera wyłącznie zakres pozostający do
wykonania. Historia zamknięć i napraw znajduje się w `AUDIT-JOURNAL.md`.

## Tablica sterująca

| Kategoria | Liczba | Pozycje |
|---|---:|---|
| Wykonalne sesją audytową | 2 | F-108, F-135 |
| Reaktywne | 1 | F-5 |
| Zależne od środowiska/dewelopera | 7 | F-8, F-9, F-11, F-94, F-113, F-133, F-137 |
| **Razem** | **10** | — |

## Wykonalne sesją audytową

| Flaga | Priorytet | Pozostały zakres | Kryterium zamknięcia |
|---|---|---|---|
| F-108 | wysoki | Źródło MS/BIP: 52 akty. **Etap 3 zakończony:** wszystkie 52 pozycje mają dedykowane moduły; nominalnie A=52/B=0/C=0/D=0. Pozostaje Etap 2: treściowy audyt 52 aktów/zakresów bez utożsamiania obecności modułu z kompletnością. Część dawnych luk raportu 27.08 została już podniesiona do B/B+; bieżący stan opisuje `POKRYCIE-DELTA-2026-08-28.md`. | Pełne warunki i rejestr 52 pozycji w `F-108-lista-MS-egzamin-2026.md`; flaga OTWARTA do zamknięcia Etapu 2. |
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

**F-86 zamknięta 2026-08-28.** Zakres postępowań odrębnych Prawa upadłościowego od art. 426 do art. 491^38 ma dedykowany `mod-PrUpad-postepowania-odrebne-426-491-38.md`, poziom B+, oparty na RZĄD 1 (Dz.U. 2026 poz. 913 t.j.). Obejmuje banki/SKOK, banki hipoteczne, transgraniczne instytucje kredytowe, ubezpieczycieli/reasekuratorów, emitentów obligacji, upadłość konsumencką i układ konsumencki.

F-10, F-48, F-82, F-83, F-88, F-102, F-104, F-106, F-110, F-125 i F-136 zostały
zamknięte 2026-08-26. Szczegóły i dowody reprodukcji: `AUDIT-JOURNAL.md`.