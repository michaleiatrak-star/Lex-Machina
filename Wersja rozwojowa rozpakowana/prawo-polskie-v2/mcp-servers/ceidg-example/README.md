> ✅ **STAN 2026-09-27j:** treść zmierzona na żywym API (`../test_na_zywo.mjs`) — bez zmian w kodzie.

Testy: `test_normalizacja.mjs` (offline, na prawdziwych odpowiedziach z `fixtures/`), `../test_protokol.mjs` (tylko protokół MCP — nie sprawdza treści), `../test_na_zywo.mjs` (treść na żywym API; jedyny test, który wykrywa błędy treści).

---

# ceidg-example — serwer MCP dla API CEIDG v3 (dane.biznes.gov.pl)

## Status (2026-09-29, AUDYT-2026-09-29, F-214) — ZMIERZONY TOKENEM

✅ Kształt odpowiedzi zmierzony na żywym API v3 z prawdziwym tokenem. Wynik pomiaru obalił dwa
założenia poprzedniej wersji: NIP i REGON leżą w `firmy[].wlasciciel.{nip,regon}` (poprzednio
`identyfikator: null` przy każdym FOUND), a NIP spoza CEIDG daje **HTTP 204 bez treści**
(poprzednio ERROR „Unexpected end of JSON input” zamiast NOT_FOUND). Obie wady naprawione;
fixture `fixtures/firmy_nip_aktywny.json` ma zmierzony kształt i fikcyjne dane.

| Odpowiedź API | Wynik narzędzia |
|---|---|
| 200 + `firmy[]` | FOUND; `result` = wpis AKTYWNY (albo najnowszy), pełna lista w `wpisy` |
| 204 bez treści | NOT_FOUND + odesłanie do KRS (spółki nie są w CEIDG) |
| zła suma kontrolna NIP | ERROR lokalnie, **bez zapytania** (API dałoby 400 `NIEPOPRAWNY_NUMER_NIP`) |
| 401 / 403 / 429 | ERROR z opisem; 429 — nie ponawiać (limit liczony od ostatniego żądania) |

## Klucz API — skąd i jak podać

1. **Uzyskanie:** Hurtownia danych CEIDG i Biznes.gov.pl — https://dane.biznes.gov.pl/pl/portal/034872
   („wypełnij wniosek o dostęp i zarejestruj się”; logowanie Profilem Zaufanym). Token (JWT) = klucz API.
2. **Podanie:** rozszerzenie `.mcpb` → pole „Klucz API CEIDG” w Claude Desktop; albo
   `python ../instaluj_serwery_mcp.py --scal-desktop --serwery ceidg --ceidg-klucz-plik PLIK`
   (uzupełnia istniejącą instalację o sam CEIDG); kontrola: `--ceidg-test --ceidg-klucz-plik PLIK`.
3. ⛔ Ładunek JWT (base64, nie szyfrowanie) zawiera **PESEL, imię i nazwisko** właściciela tokenu.
   Nie zapisuj go w repozytorium ani w `mcp-config.json` w katalogu skilla — T40 blokuje takie wydanie.

## Testy
```bash
node test_normalizacja.mjs                      # offline, 6 przypadków na zmierzonym kształcie
node ../test_protokol.mjs                      # tylko protokół MCP
CEIDG_API_KEY="$(cat PLIK)" node ../test_na_zywo.mjs   # treść na żywym API (2 przypadki CEIDG)
```
