# MOD-DLUGIE-PISMO — Pismo dłuższe niż jedna odpowiedź (części, ciąg dalszy, zmiany sekcji)

> **Wersja:** 1.1.0 (2026-10-17)
> **Typ:** moduł shared
> **Wywołanie:** `view shared/MOD-DLUGIE-PISMO.md` — przed pisaniem pisma, regulaminu lub umowy ponad ok. 10 stron (ok. 20 000 znaków); model lokalny: ponad ok. 3 strony (ok. 6 000 znaków)
> **Konsumenci:** pisma-proste-v2, pisma-procesowe-v3 (W2–W3), analizator-umow-v1 (AU-GENBUILD)

```
⛔ Limit długości odpowiedzi ucina tekst w połowie (ok. 16 000 tokenów wyjścia, model lokalny 4 096).
⛔ Ucięty tekst nigdy nie jest plikiem. Nie licz na "kontynuuj" po ucięciu: szew powtarza lub gubi litery.
✅ Długie pismo powstaje w częściach kończących się na całej jednostce (sekcja, §, punkt).
```

## 1. CZAT — CZĘŚCI WEDŁUG PLANU

Pierwsza odpowiedź: jedno zdanie, że pismo powstanie w N częściach, plan i część 1.

````text
```plan-pisma
{"tytul": "Regulamin sklepu …", "czesci": [
  {"czesc": 1, "paragrafy": [1, 15]},
  {"czesc": 2, "paragrafy": [16, 30]},
  {"czesc": 3, "paragrafy": [31, 45]}],
 "zalaczniki": [{"nr": 1, "opis": "Wzór formularza odstąpienia"}],
 "pojecia": {"Sprzedawca": "…"}}
```
[CZĘŚĆ 1/3]
… tekst części 1 …
[KONIEC CZĘŚCI 1/3]
````

| Reguła | Treść |
|---|---|
| DP-1 | 2–30 części; plan stały — nie zmieniaj go w kolejnych częściach |
| DP-1a | Rozmiar części: model w chmurze ok. 6–8 stron; model lokalny (4 096 tokenów odpowiedzi) ok. 2 strony (do ok. 4 000 znaków) |
| DP-1b | Ponad 30 części (chmura ok. 200 stron, model lokalny ok. 60 stron): powiedz to wprost i podziel na osobne dokumenty (np. umowa i załączniki) albo zaproponuj model w chmurze; nie powiększaj części |
| DP-1c | Część ucięta na limicie wraca do poprawy: ten sam zakres planu, tekst zwięźlejszy |
| DP-2 | Numeracja ciągła przez części (§, punkty, sekcje rzymskie); w części tylko numery z planu, w kolejności |
| DP-3 | Bez powtórzeń sekcji z poprzednich części; pojęcia i numery załączników wyłącznie z planu |
| DP-4 | Podpis i lista załączników tylko w ostatniej części |
| DP-5 | Pismo procesowe: sekcje (`I.`, `II.`) w `sekcje` planu, punkty żądań w `punkty` |
| DP-6 | Punkty numerowane przez całe pismo (`23.` w części 2): zawsze z numerem z planu, na początku wiersza; plik zachowuje ten numer, nie numeruje od 1 |

**Lex Machina (aplikacja):** sprawdza każdą część z planem i poprzednimi (brak/powtórzenie §, luka w punktach, obca sekcja, nieznany załącznik, podpis przed końcem, brak znacznika końca). Część z błędem wraca z listą problemów (`Popraw część k z N`), kolejną część aplikacja zamawia blokiem `DŁUGIE PISMO — CZĘŚĆ k Z N`. Po ostatniej przyjętej części — jeden plik .docx z całości, po HYBRID-VAL (konwersja we fragmentach, model lokalny po ok. 5 000 znaków; połączenie podtrzymywane przy pracy ponad 20 minut).

**Bez aplikacji (claude.ai):** po każdej części zatrzymaj się; kolejna po „dalej”. Na początku każdej części wypisz ostatni § / punkt poprzedniej części.

## 2. POTOK PISMA PROCESOWEGO (pisma-procesowe-v3, W2–W3)

| Sytuacja | Odpowiedź kroku |
|---|---|
| Pierwszy projekt ponad ok. 10 stron | `=== PISMO ===` … zakończ na całej sekcji linią `=== CIĄG DALSZY ===`; aplikacja prosi o dalszy ciąg w tym samym kroku i składa całość |
| Krok poprawiający długi projekt | tylko zmienione sekcje: `=== ZMIANA SEKCJI: II. UZASADNIENIE ===` … `=== KONIEC ZMIANY ===` (nagłówek dokładnie jak w projekcie; pusta treść = usunięcie sekcji) |
| Krok bez zmian w tekście | `=== BEZ ZMIAN W TEKŚCIE ===` |

```
⛔ Blok bez linii końca (=== KONIEC PISMA === / === CIĄG DALSZY === / === KONIEC ZMIANY ===) = tekst ucięty:
   aplikacja nie zapisuje wersji i mówi o tym wprost; powtórz krok.
⛔ ZMIANA SEKCJI z nagłówkiem, którego nie ma w projekcie = odrzucona.
```

## 3. UMOWA (analizator-umow-v1, AU-GENBUILD)

Umowa ponad ok. 10 stron — części jak w § 1 (`paragrafy` w planie). AU-HYBRID i AU-STRIP obejmują całość: plik z części powstaje dopiero po ich zamknięciu.
