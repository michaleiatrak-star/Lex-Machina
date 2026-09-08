# DR-08 — Lokalna Mapa Aktów Prawnych — stan bieżący

**Stan operacyjny:** 2026-08-28  
**Zasada:** mapa runtime zawiera wyłącznie aktualny akt, aktualny moduł i bieżący status. Historia weryfikacji i napraw pozostaje w dzienniku audytu/changelogu.

| Akt / zakres | Aktualna podstawa | Moduł wejściowy | Status bieżący |
|---|---|---|---|
| samorząd gminny | Dz.U. 2026 poz. 662 t.j. | `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa.md` | 🟢 B+ / COV |
| samorząd powiatowy | Dz.U. 2025 poz. 1684 t.j. | `mod-ustawa-samorzad-powiatowy.md` | 🟢 B+ / COV |
| samorząd województwa | Dz.U. 2026 poz. 720 t.j. | `mod-ustawa-samorzad-wojewodztwa.md` | 🟢 B+ / COV |
| wojewoda i administracja rządowa w województwie | Dz.U. 2025 poz. 428 t.j. | `mod-wojewoda-administracja-rzadowa-current-state-COV.md` | 🟢 B+ / COV |
| nadzór wojewody i RIO nad JST | USG/USP/USW + właściwe przepisy szczególne | `mod-nadzor-wojewody-RIO-legalnosc-uchwal.md` | 🟢 operacyjne |
| skargi na akty prawa miejscowego | PPSA + właściwa ustawa ustrojowa | `mod-skargi-na-prawo-miejscowe-WSA-NSA.md` | 🟢 operacyjne |
| statuty i regulaminy JST | właściwa ustawa ustrojowa + aktualny akt lokalny | `mod-procedury-JST-statuty-regulaminy.md` | 🟢 operacyjne |
| ogłaszanie aktów normatywnych i dzienniki urzędowe | Dz.U. 2019 poz. 1461 t.j. | `mod-dzienniki-urzedowe-BIP-publikacja.md` | 🟢 operacyjne; fresh gate przed powołaniem |
| kontrola w administracji rządowej | Dz.U. 2026 poz. 158 t.j. | `mod-kontrola-administracji-inspekcje.md` | 🟢 operacyjne; inspekcje sektorowe routowane do lex specialis |
| akty porządkowe | właściwe przepisy USG/USP/USW | `mod-akty-porzadkowe-bezpieczenstwo-lokalne.md` | 🟢 operacyjne |
| lokalne dane publiczne | RODO + UDIP + przepisy lokalne | `mod-lokalne-dane-publiczne-RODO-BIP.md` | 🟢 operacyjne |
| planowanie przestrzenne — MPZP/WZ | Dz.U. 2026 poz. 538 t.j. | `mod-MPZP-WZ-planowanie-przestrzenne.md` | 🟢 operacyjne |
| lokalne podatki i opłaty | Dz.U. 2025 poz. 707 t.j. + aktualna uchwała lokalna | `mod-lokalne-podatki-oplaty-taryfy.md` | 🟢 operacyjne |
| dochody JST | Dz.U. 2024 poz. 1572 (ustawa, brak t.j.) | `mod-ustawa-dochody-JST.md` | 🟢 operacyjne; fresh gate |
| zarządzanie kryzysowe / ochrona ludności | Dz.U. 2024 poz. 1907 (ustawa, brak t.j.) | `mod-ustawa-zarzadzanie-kryzysowe.md` | 🟢 operacyjne; stan po wejściu zmian z 2026 r. |
| publiczny transport zbiorowy | Dz.U. 2025 poz. 285 t.j. | `mod-ustawa-komunalne-wod-kan-transport-czystosc.md` | 🟢 operacyjne |
| referendum lokalne | Dz.U. 2025 poz. 472 t.j. | `mod-ustawa-referendum-lokalne.md` | 🟢 operacyjne |
| pracownicy samorządowi | Dz.U. 2024 poz. 1135 t.j. | `mod-ustawa-pracownicy-samorzadowi.md` | 🟢 operacyjne |
| utrzymanie czystości i porządku w gminach | Dz.U. 2025 poz. 733 t.j. | `mod-ustawa-komunalne-wod-kan-transport-czystosc.md` | 🟢 operacyjne |
| zbiorowe zaopatrzenie w wodę i odprowadzanie ścieków | Dz.U. 2024 poz. 757 t.j. (ostatnia znana zmiana: Dz.U. 2026 poz. 605) | `mod-ustawa-komunalne-wod-kan-transport-czystosc.md` | 🟢 operacyjne |
| ochrona zabytków | Dz.U. 2024 poz. 1292 t.j. | `mod-ustawa-zabytki-rewitalizacja.md` | 🟢 operacyjne; fresh gate |
| rewitalizacja | Dz.U. 2024 poz. 278 t.j. | `mod-ustawa-zabytki-rewitalizacja.md` | 🟢 operacyjne |
| cmentarze i chowanie zmarłych | Dz.U. 2025 poz. 1590 t.j. | `mod-ustawa-zabytki-rewitalizacja.md` | 🟢 operacyjne |
| drogi publiczne — SPP/ŚSPP | Dz.U. 2025 poz. 889 t.j. | `mod-UDP-strefy-platnego-parkowania.md` | 🟢 operacyjne |

## Weryfikacja w źródle urzędowym — 2026-09-01h

Wszystkie 21 pozycji sprawdzono w żywym rejestrze ELI
(`api.sejm.gov.pl/eli/acts/...`) ✅ [VER: 2026-09-01].

| Co sprawdzono | Wynik |
|---|---|
| Numer istnieje i ma status `obowiązujący` | **21/21** |
| Tytuł aktu odpowiada zakresowi z kolumny „Akt / zakres" (kontrola podmiany, klasa F-149) | **17/17 obwieszczeń** |
| Wskazany t.j. jest NAJNOWSZYM obowiązującym dla swojego aktu | **17/17** |
| Akty z nowelizacjami ogłoszonymi PO dacie t.j. | **nie oznaczane w mapie** — patrz „Gdzie sprawdzić nowelizacje" niżej |

⛔ **Dlaczego mapa tego nie oznacza.** Wersja z 2026-09-01h wpisywała przy każdej
pozycji liczbę nowelizacji po t.j. W ciągu jednego dnia trzy z nich rozjechały
się z rejestrem, bo liczba rośnie z każdą publikacją Dz.U. Druga wersja
(09-01j) usunęła liczby, zostawiając sam znacznik ⚠️ — i to też cofnięto,
z mocniejszego powodu: **znacznik przy jednych pozycjach twierdzi coś o
pozostałych.** Wiersz bez ⚠️ czyta się jako „tu t.j. wystarczy", a to jest
zdanie o stanie rejestru na dzień oznaczania, nie na dzień użycia mapy.
Milczenie mapy jest uczciwsze niż jej nieaktualne zapewnienie.

## Gdzie sprawdzić nowelizacje po tekście jednolitym

Mapa podaje, KTÓRY akt jest podstawą. Czy sam tekst jednolity wystarczy,
rozstrzyga się w źródle, w momencie użycia:

| Co | Gdzie |
|---|---|
| lista nowelizacji dla konkretnego t.j. | `api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}/references` → sekcja **„Nowelizacje po tekście jednolitym"** |
| kontrola uzupełniająca (sekcja bywa niepełna) | akty zmieniające aktu bazowego z datą promulgacji późniejszą niż data t.j. — ustalenie F-155 |
| pełna procedura | `shared/PRAWO-HARDGATE.md` → KROK 2C |
| bramka, która zatrzyma zamiatanie | `audyt-systemu-v4/scripts/check_wyjatek_gate_eli.py` (F-153) |
| bieżąca lista takich pozycji w całym repozytorium | `audyt-systemu-v4/scripts/check_nowelizacje_po_tj.py` (T24) |

## Fresh gate

Przed podaniem konkretnego artykułu, terminu, kwoty, kompetencji albo skutku prawnego sprawdź aktualny tekst w ELI/ISAP oraz — gdy sprawa tego wymaga — aktualny akt prawa miejscowego. `MAPA-AKTOW.md` nie przechowuje historii audytu ani przyszłych zmian jako prawa obowiązującego.

⛔ Akt prawa miejscowego (uchwała rady gminy, MPZP, taryfa) NIE ma numeru Dz.U.
i nie ma go w tej mapie z założenia. Ścieżka odczytu: `shared/PRAWO-HARDGATE.md`
→ ŚCIEŻKA B-L, publikator `dziennikiurzedowe.gov.pl`.