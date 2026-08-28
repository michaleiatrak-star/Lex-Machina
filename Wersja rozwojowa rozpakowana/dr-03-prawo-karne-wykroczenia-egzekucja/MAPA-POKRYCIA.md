# DR-03 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa zawiera wyłącznie bieżący stan pokrycia. Historia zmian i wcześniejsze oceny nie są częścią warstwy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 B/B+ — pokrycie operacyjne, niepełne artykuł-po-artykule;
- 🔴 — brak rzeczywistej treści;
- ⚪ — zakres uchylony/techniczny.

## Kodeks wykroczeń

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| część ogólna art. 1–48 | 🟢 | `mod-KW-art1-48-czesc-ogolna.md` |
| porządek publiczny | 🟢/🟡 | `mod-KW-art49-64-porzadek-publiczny.md` |
| bezpieczeństwo osób i mienia | 🟡 | `mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie.md` |
| komunikacja | 🟡 | moduły taryfikatorowe i tematyczne; brak pełnego komentarza całego rozdziału |
| przeciwko osobie | 🟢 | `mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie.md` |
| przeciwko zdrowiu | 🟡 | jw. |
| przeciwko mieniu | 🟢 | `mod-KW-art119-131-przeciwko-mieniu.md` |
| interesy konsumentów | 🟡 | `mod-KW-art132-166-pozostale-rozdzialy.md` |
| obyczajność publiczna | 🟢 | jw. |
| urządzenia użytku publicznego / ewidencja | 🟡 | jw. |
| szkodnictwo leśne, polne i ogrodowe | 🟢 | jw. |

## Kodeks karny wykonawczy

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| zasady ogólne / prawa skazanego | 🟡 B | `mod-KKW-uzupelnienie-pokrycia-2026.md` |
| postępowanie wykonawcze | 🟢 | moduł KKW + uzupełnienie pokrycia |
| nadzór penitencjarny | 🟡 B | `mod-KKW-uzupelnienie-pokrycia-2026.md` |
| SDE | 🟢 | moduły KKW/SDE |
| odroczenie / przerwa wykonania kary | 🟢 | moduły KKW |
| warunkowe zwolnienie | 🟢 | moduły KKW |
| prawa i obowiązki / dyscyplina | 🟢/🟡 | moduły KKW |
| pozostałe zakresy wykonawcze | 🟡 B | `mod-KKW-uzupelnienie-pokrycia-2026.md` |

## KPK / KK

| Zakres | Status bieżący | Uwagi |
|---|---|---|
| framework KK/KPK | 🟢/🟡 | `mod-KK-KPK-framework-karne.md` + kwalifikator karnomaterialny |
| środki odwoławcze KPK | 🟢/🟡 B+ | art. 437 §1–2 ponownie zweryfikowany w RZĄD 1 2026-08-28 |
| dostęp do akt KPK | 🟢/🟡 B+ | art. 156 §1–6 ponownie zweryfikowany w RZĄD 1 2026-08-28 |
| postępowanie nakazowe | 🟢/🟡 B+ | art. 498 ponownie zweryfikowany w RZĄD 1 2026-08-28 |
| wyrok łączny | 🟢/🟡 B+ | art. 575 §1 skorygowany do aktualnego brzmienia |
| stalking / nękanie | 🟢 | `mod-KK-art190a-stalking.md` |
| przemoc domowa | 🟢 | `mod-KK-art207-przemoc-domowa.md` |
| cyberprzestępczość | 🟢 | `mod-KK-art267-269c-cyberprzestepstwa.md` |

## Inne akty

| Akt / zakres | Status bieżący |
|---|---|
| opłaty w sprawach karnych | 🟢/🟡 B+; osobny moduł, art. 1–23 zmapowane |
| przeciwdziałanie narkomanii | 🟢/🟡; metryka Dz.U. 2026 poz. 1004, obowiązywanie od 27.08.2026 |
| KPW | 🟡; wymaga dalszego pogłębienia proceduralnego |

## Aktywne luki

1. KW: komunikacja, zdrowie, interesy konsumentów oraz kilka jednostek pozostałych rozdziałów wymagają pogłębienia.
2. KPW nie ma jeszcze pełnego audytu rozdziałowego.
3. KKW ma szerokie pokrycie operacyjne, ale nie status `FULL` całego kodeksu.
4. Każdy konkretny przepis wymaga świeżego odczytu ELI/ISAP przed użyciem.
