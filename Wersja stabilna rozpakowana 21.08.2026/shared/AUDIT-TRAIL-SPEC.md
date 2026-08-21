# AUDIT-TRAIL-SPEC.md
## Specyfikacja logu zdarzeń zgodnego z art. 12 AI Act (hash-chain SHA-256)

status: specyfikacja gotowa do wdrożenia (implementacja po stronie portalu, nie silnika)
wprowadzono: 2026-07-13 (jako osobny skill `shared/AUDIT-TRAIL-SPEC.md`)
skonsolidowano do `shared/`: 2026-07-13f (patrz AUDIT-JOURNAL, powód: to
specyfikacja + narzędzia bez własnej logiki triggerowania intencją użytkownika
— dokładnie taki sam charakter jak PRAWO-HARDGATE.md czy HYBRID-VALIDATION.md,
więc naturalne miejsce to shared/, nie osobny skill)
narzędzia: shared/tools/hash_chain_verify.py, shared/tools/append_event.py,
  shared/tools/router_event_parser.py, shared/tools/extract_api_verification_log.py,
  shared/tools/export_gate.py

---

## Dlaczego to jest odpowiedzialność portalu, nie silnika

Skille Claude nie mają własnej trwałej pamięci między wywołaniami — nie mogą same
prowadzić dziennika zdarzeń w sposób, który przetrwałby poza pojedynczą sesją i był
odporny na manipulację. **Hash-chain wymaga zapisu poza modelem**, w systemie
kontrolowanym przez portal (baza danych, plik append-only, storage z retencją).
Ten skill definiuje: (a) **co** logować, (b) **jak** liczyć łańcuch hashy, (c) **w
którym momencie przepływu routera** emitować zdarzenie do logu portalu.

## 1. Co loguje portal (minimalny zestaw zdarzeń)

| Zdarzenie | Kiedy | Pola obowiązkowe |
|---|---|---|
| `SESSION_START` | początek sprawy | `session_id`, `tryb` (LAIK/PRAWNIK), `timestamp` |
| `ROUTING_DECISION` | router wybrał [1]-[10] | `session_id`, `dziedzina`, `skill_wywolany`, `timestamp` |
| `HARDGATE_VERIFICATION` | każde powołanie prawne zweryfikowane | `session_id`, `typ` (akt/orzeczenie), `identyfikator`, `zrodlo` (MCP/web_search), `wynik` (VERIFIED/NIEWERYFIKOWANE/SPRZECZNOSC), `timestamp` |
| `ENTITY_CHECK` | weryfikacja podmiotu (KRS/CEIDG, PODMIOT-GATE) | `session_id`, `podmiot`, `status` (⬛/potwierdzony), `timestamp` |
| `DOCUMENT_GENERATED` | wygenerowano pismo/dokument | `session_id`, `typ_dokumentu`, `skill`, `hash_tresci` (SHA-256 samego dokumentu), `timestamp` |
| `STOP_ESCALATION` | router/skill zatrzymał proces (np. brak dostępu do rejestru) | `session_id`, `powod`, `timestamp` |
| `DISCLAIMER_SHOWN` | pokazano zastrzeżenie "nie zastępuje porady prawnika" | `session_id`, `timestamp` |
| `SESSION_END` | koniec sprawy | `session_id`, `timestamp` |

Nie loguj treści dokumentów ani danych osobowych sprawy w samym audit-trail —
audit-trail to log **zdarzeń i metadanych integralności**, nie archiwum akt.
Treść dokumentów przechowuje portal osobno, zgodnie z własną polityką retencji/RODO;
audit-trail trzyma tylko hash treści (`hash_tresci`), żeby móc *dowieść* że dany
dokument nie został po fakcie zmieniony, bez przechowywania samej treści w logu.

## 2. Format wpisu (JSON Lines, append-only)

```json
{
  "seq": 42,
  "event": "HARDGATE_VERIFICATION",
  "session_id": "uuid",
  "payload": { "typ": "akt", "identyfikator": "Dz.U. 2025 poz. 1071", "zrodlo": "MCP", "wynik": "VERIFIED" },
  "timestamp": "2026-07-13T10:15:00Z",
  "prev_hash": "a3f5...",
  "hash": "9c1e..."
}
```

## 3. Algorytm hash-chain (deterministyczny, bez LLM w runtime)

```
hash[0]        = SHA256(canonical_json(event_0) + "GENESIS")
hash[n]        = SHA256(canonical_json(event_n) + hash[n-1])
```

- `canonical_json` = serializacja z posortowanymi kluczami, bez białych znaków
  (żeby hash był powtarzalny niezależnie od implementacji).
- Każdy nowy wpis zawiera `prev_hash` = `hash[n-1]` jawnie w rekordzie (nie tylko
  wyliczony) — to pozwala zweryfikować cały łańcuch bez dostępu do poprzednich
  wpisów w pamięci, tylko na podstawie samego pliku/logu.
- Weryfikacja integralności = przejście od `hash[0]` do końca i porównanie
  wyliczonych hashy z zapisanymi — patrz `scripts/hash_chain_verify.py`.

## 4. Punkty emisji zdarzeń w prawny-router-v3

| Krok routera | Zdarzenie do wyemitowania |
|---|---|
| Start obsługi sprawy | `SESSION_START` |
| Decyzja [1]-[10] | `ROUTING_DECISION` |
| Każde wywołanie HARD GATE / mcp-zrodla-prawa-v1 KROK 2 | `HARDGATE_VERIFICATION` |
| KROK 0D (weryfikacja podmiotu ⬛) | `ENTITY_CHECK` |
| Wygenerowanie .docx/.pdf | `DOCUMENT_GENERATED` |
| Warunek STOP z sekcji escalation routera | `STOP_ESCALATION` |
| KROK 7 (disclaimer) | `DISCLAIMER_SHOWN` |
| Koniec sprawy / zamknięcie rozmowy | `SESSION_END` |

Router sam **nie zapisuje** tych zdarzeń (nie ma trwałego storage) — router
jedynie **emituje** je w ustrukturyzowanej, dającej się sparsować formie w swojej
odpowiedzi (albo przez wywołanie narzędzia portalu, jeśli portal udostępni Claude
takie narzędzie jako connector). To integracja po stronie portalu, analogicznie
do `mcp-zrodla-prawa-v1` — silnik dostarcza protokół i format, portal dostarcza
faktyczny zapis i przechowywanie.

## 5. Zgodność z art. 12 AI Act — co to pokrywa, a czego nie

**Pokrywa:** automatyczne rejestrowanie zdarzeń przez cały cykl życia systemu,
umożliwiające identyfikację sytuacji mogących skutkować ryzykiem, oraz ułatwiające
monitorowanie po wdrożeniu (ślad decyzji routingu, weryfikacji, eskalacji).

**Nie pokrywa samodzielnie:** pełnej dokumentacji technicznej systemu (art. 11),
oceny ryzyka, nadzoru ludzkiego (art. 14) — te elementy leżą po stronie
organizacyjnej wdrożenia portalu i kancelarii, nie samego logu zdarzeń.
