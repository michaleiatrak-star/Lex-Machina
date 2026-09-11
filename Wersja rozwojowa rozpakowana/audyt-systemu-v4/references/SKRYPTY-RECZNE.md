# SKRYPTY-RĘCZNE — rejestr skryptów poza pełnym przebiegiem

> **Plik:** `audyt-systemu-v4/references/SKRYPTY-RECZNE.md`
> **Wersja:** 1.0 (2026-09-10c) — utworzony przy zamykaniu flagi O-4.
> **Czyta go:** `scripts/test_pokrycie_orkiestratora.py` (T23). Format jest
> kontraktem maszynowym — patrz sekcja „Format".

---

## PO CO ISTNIEJE (O-4)

Rejestracja skryptu w polu `scripts:` **nie gwarantuje, że ktokolwiek go
uruchamia**. Zmierzone 2026-09-01: trzy skrypty żyły poza pełnym przebiegiem —
`test_f108_trade.py` i `mock_eli_server_test.py` były **ZEPSUTE od dni**,
a awaria była niewidoczna, bo nic ich nie wywoływało. Wpięto je wtedy ręcznie
i nic nie pilnowało, żeby następny dodany test też został wpięty.

⛔ Przegląd wzrokowy listy nie zamyka tej luki — to dokładnie ten rodzaj
kontroli, który przepuścił F-147.

Ten plik zamienia „skrypt jest poza przebiegiem" z **milczącego stanu** na
**deklarację z uzasadnieniem**. Nie ma trzeciej możliwości: skrypt albo jest
wywoływany przez orkiestrator, albo stoi tutaj z powodem. Brak w obu miejscach
= FAIL testu T23.

---

## Format (kontrakt dla T23)

Jeden skrypt = jedna linia w tabeli poniżej. Nazwa pliku w backtickach,
w pierwszej kolumnie. Kolumna „Powód" nie może być pusta.

| Skrypt | Powód wyłączenia z pełnego przebiegu | Kto i kiedy uruchamia |
|---|---|---|
| `test_header_snapshot.py` | **T4 — test z natury ręczny.** Porównuje nagłówki z migawką zatwierdzoną przez człowieka; automatyczne „zaliczenie" oznaczałoby przyjęcie bieżącego stanu za wzorzec, czyli zniesienie testu. | Sesja audytowa przed wydaniem, wynik wpisywany do dziennika. |
| `check_wyjatek_gate_eli.py` | **Wymaga ŻYWEGO API ELI.** W przebiegu bez sieci dawałby FAIL środowiskowy nieodróżnialny od merytorycznego — ta sama klasa problemu co O-5. | Sesja audytowa z potwierdzonym dostępem do `api.sejm.gov.pl`. |
| `check_nowelizacje_po_tj.py` | **Wymaga ŻYWEGO API ELI.** Jw. | Jw., zwykle razem z generacją nowej mapy Dz.U. |
| `check_domeny_allowlist.py` | **Wymaga sieci** — sprawdza osiągalność domen z listy dozwolonej. Wynik zmienia się niezależnie od repozytorium, więc w przebiegu strukturalnym byłby szumem. | Sesja audytowa, przy podejrzeniu regresji dostępu (por. F-171). |
| `check_checksums.py` | **T21 — uruchamiany OSOBNO, po przeliczeniu sum.** W pełnym przebiegu przed przeliczeniem zawsze zgłaszałby rozjazd dla właśnie edytowanych plików. Wpięty jako osobny krok w `.github/workflows/regresja.yml`. | CI (osobny krok) oraz `dostarcz_skill.sh` przed wydaniem. |
| `check_frontmatter_yaml.py` | **Nadzbiór T14/T22 uruchamiany diagnostycznie.** Kontrola parsowalności frontmatteru jest wykonywana wewnątrz T14 i T22; ten skrypt służy do szczegółowej diagnozy po ich FAIL. ⚠️ Kandydat do wpięcia — patrz „Do rozstrzygnięcia" niżej. | Sesja audytowa po FAIL T14/T22. |
| `check_rejestracja_modulow.py` | **Poprzednik T1/T22**, zachowany do porównań historycznych przy analizie starych wpisów dziennika. ⚠️ Kandydat do usunięcia z rejestru, nie do wpięcia. | Rzadko, przy pracy z archiwalnymi wpisami. |

---

## Do rozstrzygnięcia w kolejnej sesji audytowej

⚠️ `check_frontmatter_yaml.py` — po F-179, gdzie awaria parsowalności
frontmatteru wystąpiła po raz **trzeci** w historii systemu (3.37, 3.38 i przy
edycji 2026-09-10), jego wpięcie do pełnego przebiegu wygląda na uzasadnione.
Warunek: sprawdzić, czy nie dubluje kontroli już wykonywanych przez T14/T22 —
duplikat testu jest gorszy niż jego brak, bo mnoży sygnał bez mnożenia pokrycia.

⚠️ `check_rejestracja_modulow.py` — jeśli T1 i T22 pokrywają jego zakres
w całości, właściwym ruchem jest **usunięcie z rejestru `scripts:`**, a nie
trzymanie go tutaj. Skrypt, którego nikt nie uruchamia i który niczego nie
pokrywa, jest długiem, nie zasobem.

---

## Czego ten plik NIE zapewnia

⛔ Nie mówi, że skrypty ręczne **zostały** uruchomione — tylko dlaczego nie ma
ich w automacie. Odnotowanie faktycznego przebiegu należy do
`AUDIT-JOURNAL.md`, jak dotąd.

⛔ Nie sprawdza, czy skrypt działa. Skrypt może stać tutaj z dobrym powodem
i być zepsuty od miesięcy — dokładnie tak jak `test_f108_trade.py` przed
2026-09-01. T23 pilnuje kompletności deklaracji, nie sprawności kodu.
