# DR-02 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Ta mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia napraw, dawne statusy i porównania do wcześniejszych raportów należą do `audyt-systemu-v4/references/AUDIT-JOURNAL.md` i `CHANGELOG.md`, nie do mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 B/B+ — pokrycie operacyjne, ale nie pełny komentarz artykuł-po-artykule;
- 🔴 — brak rzeczywistej treści;
- ⚪ — zakres techniczny, uchylony albo niewymagający samodzielnego modułu.

## Kodeks cywilny / KRO / prawo konsumenckie

| Zakres | Status bieżący | Główny moduł / uwaga |
|---|---|---|
| KC — zobowiązania i odpowiedzialność | 🟢/🟡 | `mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md`; szczegółowe moduły tematyczne mają pierwszeństwo |
| KC — spadki | 🟢 | `mod-KC-spadki.md` |
| KC — ubezpieczenia | 🟢/🟡 | `mod-KC-ubezpieczenia.md` |
| KC — konsumenckie / klauzule abuzywne | 🟢/🟡 | `mod-KC-konsumenckie.md`; fresh gate dla aktualnego KC i ustaw konsumenckich |
| KRO — Dz.U. 2026 poz. 236 | 🟢 B+ / COV | `mod-KRO-rodzinne.md` + 8 części tematycznych + `mod-KRO-opieka-i-kuratela.md`; główne obszary KRO zmapowane, bez statusu FULL |

## KPC

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| prawomocność / res iudicata / apelacja | 🟢 | `mod-KPC-prawomocnosc-granice-apelacji.md` |
| art. 162 i kontrola uchybień | 🟢 | `mod-KPC-art162-zastrzezenie-protokol.md` |
| nieproces — część ogólna | 🟢/🟡 | `mod-KPC-nieproces-czesc-ogolna.md` |
| organizacja postępowania, sprawy gospodarcze, wznowienie | 🟡 B+ | `mod-KPC-uzupelnienie-pokrycia-2026.md` |
| odwołania ZUS | 🟡 B+ | `mod-KPC-uzupelnienie-pokrycia-2026.md` |
| ograniczenia egzekucji | 🟡 B+ | `mod-KPC-uzupelnienie-pokrycia-2026.md` |
| egzekucja świadczeń niepieniężnych | 🟡 B+ | `mod-KPC-uzupelnienie-pokrycia-2026.md` |
| egzekucja alimentów | 🟡 B+ | `mod-KPC-uzupelnienie-pokrycia-2026.md` |
| sprawy spadkowe / wieczystoksięgowe | 🟡 B+ | `mod-KPC-uzupelnienie-pokrycia-2026.md` |

## KSH

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| Tytuł I — przepisy wspólne / grupa spółek | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| spółka jawna 22–66 | 🟢 | `mod-KSH-spolki-osobowe-rada-nadzorcza.md` |
| spółka jawna 67–85 | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| spółka partnerska | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| spółka komandytowa | 🟢 | `mod-KSH-spolki-osobowe-rada-nadzorcza.md` |
| S.K.A. | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| sp. z o.o. — organy | 🟢 | `mod-KSH-organy-spolki-zoo.md` |
| pozostałe rozdziały sp. z o.o. | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| PSA | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| S.A. | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| łączenie / podział / przekształcenia krajowe | 🟢/🟡 | moduły reorganizacyjne KSH |
| operacje transgraniczne | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md`; zawsze dołącz prawo UE |
| przepisy karne KSH | 🟡 B | `mod-KSH-uzupelnienie-pokrycia-2026.md` + routing DR-03 |

## Prawo upadłościowe i restrukturyzacyjne

| Zakres | Status bieżący | Dowód pokrycia |
|---|---|---|
| PrUp — podstawy, ogłoszenie, organy | 🟡 B | `mod-PrUp-PrRestr-uzupelnienie-pokrycia-2026.md` |
| PrUp — likwidacja masy art. 316–334 | 🟢/🟡 B+ | `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne.md` |
| PrUp — międzynarodowe art. 378–417 | 🟢/🟡 B+ | jw. + DR-14 dla prawa UE |
| PrUp — deweloper / szczególne do art. 425s | 🟢/🟡 B+ | jw. |
| PrUp — postępowania odrębne art. 426–491^38 | 🟢/🟡 B+ | `mod-PrUpad-postepowania-odrebne-426-491-38.md` |
| PrRestr — przepisy ogólne / sąd / sędzia-komisarz / wspólne | 🟡 B | `mod-PrUp-PrRestr-uzupelnienie-pokrycia-2026.md` |
| PrRestr — pomoc publiczna | 🟢/🟡 B+ | `mod-PrRestr-dzial-V-pomoc-publiczna.md` |
| PrRestr — cztery postępowania | 🟡 B | `mod-PrUp-PrRestr-uzupelnienie-pokrycia-2026.md` + moduły szczegółowe |

## Inne akty istotne dla DR-02

| Akt / zakres | Status bieżący | Główny moduł / uwaga |
|---|---|---|
| ubezpieczenia obowiązkowe, UFG i PBUK | 🟢/🟡 B | dedykowany moduł UFG/PBUK |
| fundacja rodzinna | 🟢/🟡 B | dedykowany moduł fundacji rodzinnej |
| opóźnienia w transakcjach handlowych | 🟢/🟡 B | administracja i stawki zawsze fresh gate |
| Prawo wekslowe — Dz.U. 2022 poz. 282 | 🟢 B+ / COV | `mod-prawo-wekslowe-czekowe.md`; Tytuły I–III i 16 działów weksla trasowanego zmapowane |
| Prawo czekowe — Dz.U. 2016 poz. 462 | 🟢 B+ / COV | `mod-prawo-wekslowe-czekowe.md`; forma, obieg, zapłata, regres, przedawnienie i utrata dokumentu zmapowane |
| księgi wieczyste i hipoteka — Dz.U. 2026 poz. 1066 | 🟢 B+ / COV | `mod-KW-ksiega-wieczysta-zakup-nieruchomosci.md`; jawność, domniemania, rękojmia, wpisy/wzmianki i hipoteka zmapowane |
| fundacje — Dz.U. 2023 poz. 166 + Dz.U. 2026 poz. 316 | 🟢 B+ / COV | `mod-ustawa-fundacje-stowarzyszenia.md`; tworzenie, statut, majątek, nadzór, działalność, likwidacja |
| Prawo o stowarzyszeniach — Dz.U. 2020 poz. 2261 + Dz.U. 2026 poz. 316 | 🟢 B+ / COV | `mod-ustawa-fundacje-stowarzyszenia.md`; Rozdziały 1–7; Dz.U. 2026 poz. 346 dopiero od 30.09.2028 |

## Aktywne luki

1. Brak statusu `FULL` dla całego KC, KRO, KPC i KSH; KRO ma już bieżące B+/COV.
2. Żółte zakresy KPC/KSH/PrUp/PrRestr wymagają pogłębienia przed uznaniem ich za kompletne.
3. Własność lokali, zastaw rejestrowy, Prawo spółdzielcze, UOKiK i ustawa o prawach konsumenta pozostają priorytetami kolejnych audytów DR-02.
4. Przy każdej konkretnej jednostce prawnej obowiązuje fresh hard gate do ELI/ISAP; przy prawie UE — EUR-Lex.
