# METODYKA-MODULY-DR — wdrażanie i utrzymanie modułów DR (wskazanie + kwalifikator)

> **Plik:** `audyt-systemu-v4/references/METODYKA-MODULY-DR.md` · **Od:** 2026-11-13
> Obowiązuje przy każdej konwersji modułu DR na format wskazań, przy każdej jego edycji
> i przy obsłudze zmiany wykrytej przez monitoring. Źródło: wyłącznie ELI (RZĄD 1);
> pamięć modelu nie jest źródłem żadnego kwalifikatora, daty ani numeru.

## Kroki W-1…W-7 (każdy obowiązkowy, kolejność wiążąca)

| Krok | Co | Źródło w ELI | Kontrola |
|---|---|---|---|
| W-1 | **Tekst jednolity**: najnowszy t.j., stan prawny (`legalStatusDate`); kwalifikatory z brzmienia t.j., nie z dotychczasowego modułu | `/eli/acts/DU/R/P` (metadane), `/struct` (struktura, identyfikatory jednostek), `text.html` (brzmienie jednostek z `id`) | `audit_tj_inventory.py` (NEWER_TJ) |
| W-2 | **Nowelizacje po t.j.**: wszystkie akty zmieniające ogłoszone po stanie t.j. (unia: metoda datowa + sekcja API, F-155); każdą odnotuj w nagłówku z zakresem jednostek | `/references` aktu bazowego („Akty zmieniające”) i obwieszczenia | `check_nowelizacje.py` (BRAK_NOWELIZACJI) |
| W-3 | **Jednostki uchylone**: kwalifikator mówi, co obowiązuje po uchyleniu; uchylonej jednostki nie powołuj jako obowiązującej | `text.html` / `/struct` t.j. + treść nowelizacji uchylających | `check_uchylone.py` |
| W-4 | **Przepisy przejściowe i daty wejścia** każdej nowelizacji: przepis o wejściu w życie (z wyjątkami dla jednostek), przepisy przejściowe i intertemporalne — odczyt treści nowelizacji | `text.pdf` / `text.html` nowelizacji (ELI nie oznacza przepisów przejściowych w danych) | ręcznie; wynik w kwalifikatorze („… sprzed RRRR-MM-DD — przepisy dotychczasowe, art. N ust. M”) |
| W-5 | **Zmiany z datą przyszłą**: znacznik `[OD RRRR-MM-DD: RRRR/poz]` przy nagłówku i przy każdej zmienianej jednostce; obok dotychczasowe brzmienie „do RRRR-MM-DD” | data z `/references` („Akty zmieniające”, pole daty wobec tego aktu) zweryfikowana z przepisem końcowym nowelizacji | `check_nowelizacje.py` (BEZ_ZNACZNIKA) |
| W-6 | **Wejście zmiany w życie**: gdy data minie — brzmienie po zmianie staje się podstawowym kwalifikatorem z adnotacją „w brzmieniu od RRRR-MM-DD (RRRR/poz)”; dawne brzmienie zostaje jako „do RRRR-MM-DD”, gdy przepisy przejściowe każą je stosować; znacznik `[OD …]` usuwany | jw. | `check_nowelizacje.py` (ZMIANA_WESZLA, WESZLA_PO_PRZEGLADZIE) |
| W-7 | **Kontrola mechaniczna i data przeglądu**: każde powołanie istnieje w t.j. i nie jest uchylone; nagłówek „Kwalifikatory sprawdzone z t.j. w ELI RRRR-MM-DD” aktualizowany przy każdym przeglądzie | `/struct` | `check_uchylone.py`, `check_nowelizacje.py` dla zmienionych plików; regresja |

## Nagłówek modułu (kontrakt maszynowy)

```
**Akt:** <skrót> — t.j. Dz.U. RRRR poz. N (zm. RRRR/poz — <zakres>; RRRR/poz [OD RRRR-MM-DD: RRRR/poz] — <zakres>).
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1): …
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI RRRR-MM-DD.
```

Bez „t.j. Dz.U. RRRR poz. N” (albo „Tekst jednolity: Dz.U. …”) w 30 pierwszych wierszach moduł jest
niemonitorowalny (`BRAK_NAGLOWKA_TJ`).

## Rejestr zmian w czasie (`JUR:rejestr-zmian-w-czasie`)

`prawo-polskie-v2/krajowe/shared/REJESTR-ZMIAN-W-CZASIE.md`: tabela A (zmiany nadchodzące) generowana
codziennie z ELI i znaczników `[OD …]` — wiersz znika w dniu wejścia w życie; tabela B (przepisy czasowe
z okresem `Od`–`Do`) wpisywana w W-4 — wiersz po terminie usuwa skrypt. Każdy przepis przejściowy
odczytany w W-4 trafia do tabeli B, także gdy moduł opisuje go w kwalifikatorze. Tabela C (odczyt W-4): każda nowelizacja z tabeli A ma
wiersz z datą odczytu i wynikiem (wiersze B albo „brak”) — brak wiersza = `BRAK_W4`.

## Monitoring

Codziennie (`.github/workflows/tj-eli-codziennie.yml`): `check_nowelizacje.py --rejestr … --raport` dla
modułów DR (zmiana rejestru trafia do codziennego PR t.j.) → zgłoszenie „Monitoring zmian w aktach modułów DR” z tabelą zmian wchodzących
w życie i listą znalezisk (BRAK_NOWELIZACJI, ZMIANA_WESZLA, BEZ_ZNACZNIKA, NOWY_TJ…).
Znalezisko obsługuje się krokami W-2…W-7 dla wskazanych modułów.

## Znane granice

- ELI nie podaje tekstu skonsolidowanego po t.j., przepisów przejściowych jako danych ani
  wyjątków od daty wejścia dla pojedynczych jednostek — to zawsze W-4 (odczyt nowelizacji).
- Data w „Akty zmieniające” to jedna data na parę akt–nowelizacja; przy wielu terminach wejścia
  rozstrzyga przepis końcowy nowelizacji.
- `check_uchylone.py` czyta PDF (`pdftotext`): indeksy górne spłaszczone („art. 21³” = „213”);
  przy wątpliwości rozstrzyga `/struct` (`arti_21_3` ≠ `arti_213`).
