# DR-02 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Ta mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia napraw i wcześniejsze statusy pozostają poza mapą runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 B/B+ — pokrycie operacyjne, ale nie pełny komentarz artykuł-po-artykule;
- 🔴 — brak rzeczywistej treści;
- ⚪ — zakres techniczny, uchylony albo niewymagający samodzielnego modułu.

## Kodeks cywilny / KRO / konsument

| Zakres | Status bieżący | Główny moduł / uwaga |
|---|---|---|
| KC — current-state całość, Dz.U. 2026 poz. 795 | 🟢 B+ / COV | `mod-KC-current-state-COV.md`; Księgi I–IV zmapowane do modułów tematycznych |
| KC — zobowiązania i odpowiedzialność | 🟢/🟡 B+ | `mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md` |
| KC — spadki | 🟢 | `mod-KC-spadki.md` |
| KC — ubezpieczenia | 🟢/🟡 | `mod-KC-ubezpieczenia.md` |
| KC — klauzule abuzywne / konsumenckie | 🟢/🟡 | `mod-KC-konsumenckie.md` |
| KRO — Dz.U. 2026 poz. 236 | 🟢 B+ / COV | `mod-KRO-rodzinne.md` + części tematyczne + opieka/kuratela |
| ustawa o prawach konsumenta — Dz.U. 2024 poz. 1796 ze zm. | 🟢 B+ / COV | `mod-ustawa-prawa-konsumenta.md` |
| UOKiK — Dz.U. 2025 poz. 1714 | 🟢 B+ / COV | `mod-ustawa-UOKIK-antymonopolowe.md` |

## KPC

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| prawomocność / res iudicata / apelacja | 🟢 | `mod-KPC-prawomocnosc-granice-apelacji.md` |
| art. 162 i kontrola uchybień | 🟢 | `mod-KPC-art162-zastrzezenie-protokol.md` |
| nieproces — część ogólna | 🟢/🟡 | `mod-KPC-nieproces-czesc-ogolna.md` |
| organizacja, gospodarcze, wznowienie | 🟡 B+ | `mod-KPC-uzupelnienie-pokrycia-2026.md` |
| odwołania ZUS | 🟡 B+ | jw. |
| ograniczenia egzekucji | 🟡 B+ | jw. |
| egzekucja świadczeń niepieniężnych | 🟡 B+ | jw. |
| egzekucja alimentów | 🟡 B+ | jw. |
| sprawy spadkowe / wieczystoksięgowe | 🟡 B+ | jw. |

## KSH

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| Tytuł I — przepisy wspólne / grupa spółek | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| spółka jawna 22–66 | 🟢 | `mod-KSH-spolki-osobowe-rada-nadzorcza.md` |
| spółka jawna 67–85 | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| spółka partnerska | 🟡 B | jw. |
| spółka komandytowa | 🟢 | `mod-KSH-spolki-osobowe-rada-nadzorcza.md` |
| S.K.A. | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| sp. z o.o. — organy | 🟢 | `mod-KSH-organy-spolki-zoo.md` |
| pozostałe rozdziały sp. z o.o. | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| PSA | 🟡 B | jw. |
| S.A. | 🟡 B | jw. |
| łączenie / podział / przekształcenia | 🟢/🟡 | moduły reorganizacyjne KSH |
| operacje transgraniczne | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` + DR-14 |
| przepisy karne KSH | 🟡 B | jw. + DR-03 |

## Upadłość / restrukturyzacja

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| PrUp — podstawy, ogłoszenie, organy | 🟡 B | `mod-PrUp-PrRestr-uzupelnienie-pokrycia-2026.md` |
| PrUp — likwidacja art. 316–334 | 🟢/🟡 B+ | `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne.md` |
| PrUp — międzynarodowe art. 378–417 | 🟢/🟡 B+ | jw. + DR-14 |
| PrUp — szczególne do art. 425s | 🟢/🟡 B+ | jw. |
| PrUp — postępowania odrębne art. 426–491^38 | 🟢/🟡 B+ | `mod-PrUpad-postepowania-odrebne-426-491-38.md` |
| PrRestr — przepisy ogólne / sąd / wspólne | 🟡 B | `mod-PrUp-PrRestr-uzupelnienie-pokrycia-2026.md` |
| PrRestr — pomoc publiczna | 🟢/🟡 B+ | `mod-PrRestr-dzial-V-pomoc-publiczna.md` |
| PrRestr — cztery postępowania | 🟡 B | moduły PrRestr + uzupełnienie |

## Nieruchomości / zabezpieczenia / organizacje

| Akt / zakres | Status bieżący | Główny moduł / uwaga |
|---|---|---|
| własność lokali — Dz.U. 2026 poz. 232 | 🟢 B+ / COV | `mod-ustawa-spoldzielnie-wlasnosc-lokali.md` |
| ochrona praw lokatorów — Dz.U. 2023 poz. 725 | 🟢 B+ / COV | `mod-ustawa-ochrona-praw-lokatorow-najem-eksmisja.md` |
| księgi wieczyste i hipoteka — Dz.U. 2026 poz. 1066 | 🟢 B+ / COV | `mod-KW-ksiega-wieczysta-zakup-nieruchomosci.md` |
| gospodarka nieruchomościami — Dz.U. 2026 poz. 399 | 🟢 B+ / COV | `dr-09/.../mod-UGN-gospodarka-nieruchomosciami.md` |
| zastaw rejestrowy — Dz.U. 2018 poz. 2017 ze zm. | 🟢 B+ / COV | `mod-ustawa-zastaw-rejestrowy.md` |
| KRS — Dz.U. 2025 poz. 869 ze zm. | 🟢 B+ / COV | `mod-ustawa-KRS-rejestr-sadowy.md` |
| Prawo spółdzielcze — Dz.U. 2026 poz. 521 | 🟢 B+ / COV | `mod-prawo-spoldzielcze.md` |
| Prawo wekslowe — Dz.U. 2022 poz. 282 | 🟢 B+ / COV | `mod-prawo-wekslowe-czekowe.md` |
| Prawo czekowe — Dz.U. 2016 poz. 462 | 🟢 B+ / COV | `mod-prawo-wekslowe-czekowe.md` |
| fundacje — Dz.U. 2023 poz. 166 + poz. 316/2026 | 🟢 B+ / COV | `mod-ustawa-fundacje-stowarzyszenia.md` |
| stowarzyszenia — Dz.U. 2020 poz. 2261 + poz. 316/2026 | 🟢 B+ / COV | jw.; poz. 346/2026 dopiero od 30.09.2028 |

## Inne akty

| Akt / zakres | Status bieżący |
|---|---|
| ubezpieczenia obowiązkowe, UFG i PBUK | 🟢/🟡 B+ |
| fundacja rodzinna | 🟢/🟡 B+ |
| opóźnienia w transakcjach handlowych | 🟢/🟡 B+ |

## Aktywne luki

1. KC ma bieżący indeks B+/COV dla Ksiąg I–IV, ale bez statusu `FULL` artykuł-po-artykule.
2. Żółte zakresy KPC/KSH/PrUp/PrRestr pozostają lukami głębokości, nie lukami routingu.
3. COV nie zastępuje fresh gate do aktualnego przepisu i ustawy szczególnej.
4. Każda konkretna jednostka prawna wymaga fresh gate do ELI/ISAP; prawo UE — EUR-Lex.
