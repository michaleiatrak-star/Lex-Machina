# DR-02 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-10-04 (aktualizacja PrUp; pozostałe zakresy wg wcześniejszych audytów)

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia napraw i wcześniejsze statusy pozostają poza mapą runtime.

## Legenda

- 🟢 B+ / COV — aktualna struktura aktu zmapowana do rzeczywistych modułów i fresh gate;
- 🟡 B/B+ — pokrycie operacyjne, ale niepełne strukturalnie;
- `FULL` — wyłącznie po audycie artykuł-po-artykule.

## Kodeks cywilny / KRO / konsument

| Zakres | Status bieżący | Główny moduł |
|---|---|---|
| KC — Dz.U. 2026 poz. 795 | 🟢 B+ / COV | `mod-KC-current-state-COV.md` + moduły tematyczne |
| KRO — Dz.U. 2026 poz. 236 | 🟢 B+ / COV | `mod-KRO-rodzinne.md` + moduły tematyczne |
| prawa konsumenta — Dz.U. 2024 poz. 1796 ze zm. | 🟢 B+ / COV | `mod-ustawa-prawa-konsumenta.md` |
| UOKiK — Dz.U. 2025 poz. 1714 | 🟢 B+ / COV | `mod-ustawa-UOKIK-antymonopolowe.md` |

## KPC / KSH / niewypłacalność

| Zakres | Status bieżący | Główny nośnik |
|---|---|---|
| KPC — Dz.U. 2026 poz. 468, postępowanie rozpoznawcze, zabezpieczające/egzekucyjne i międzynarodowe | 🟢 B+ / COV | `mod-KPC-current-state-COV.md` + rodzina modułów KPC |
| KSH — wszystkie tytuły co najmniej operacyjnie pokryte | 🟢 B+ / COV | rodzina KSH + `mod-KSH-uzupelnienie-pokrycia-2026.md` |
| Prawo upadłościowe | Pełne źródło + workflow B; komentarz częściowy | `mod-PrUpad-zrodla-i-wersje.md`; rejestr `references/prup/coverage.json` |
| Prawo restrukturyzacyjne | 🟢 B+ / COV | moduły PrRestr + pomoc publiczna |

## Nieruchomości / zabezpieczenia / spółdzielczość

| Akt / zakres | Status bieżący | Główny moduł |
|---|---|---|
| własność lokali — Dz.U. 2026 poz. 232 | 🟢 B+ / COV | `mod-ustawa-spoldzielnie-wlasnosc-lokali.md` |
| spółdzielnie mieszkaniowe — Dz.U. 2026 poz. 889 | 🟢 B+ / COV | `mod-ustawa-spoldzielnie-mieszkaniowe.md`; rozdz. 1, 1¹, 2, 2¹, 3, 3¹ oraz przepisy temporalne zmapowane |
| Prawo spółdzielcze — Dz.U. 2026 poz. 521 | 🟢 B+ / COV | `mod-prawo-spoldzielcze.md` |
| ochrona praw lokatorów — Dz.U. 2023 poz. 725 | 🟢 B+ / COV | `mod-ustawa-ochrona-praw-lokatorow-najem-eksmisja.md` |
| księgi wieczyste i hipoteka — Dz.U. 2026 poz. 1066 | 🟢 B+ / COV | `mod-KW-ksiega-wieczysta-zakup-nieruchomosci.md` |
| gospodarka nieruchomościami — Dz.U. 2026 poz. 399 | 🟢 B+ / COV | `dr-09/.../mod-UGN-gospodarka-nieruchomosciami.md` |
| zastaw rejestrowy — Dz.U. 2018 poz. 2017 ze zm. | 🟢 B+ / COV | `mod-ustawa-zastaw-rejestrowy.md` |
| KRS — Dz.U. 2025 poz. 869 ze zm. | 🟢 B+ / COV | `mod-ustawa-KRS-rejestr-sadowy.md` |

## Pozostałe akty F-108 i organizacje

| Akt / zakres | Status bieżący | Główny moduł |
|---|---|---|
| Prawo wekslowe — Dz.U. 2022 poz. 282 | 🟢 B+ / COV | `mod-prawo-wekslowe-czekowe.md` |
| Prawo czekowe — Dz.U. 2016 poz. 462 | 🟢 B+ / COV | `mod-prawo-wekslowe-czekowe.md` |
| fundacje | 🟢 B+ / COV | `mod-ustawa-fundacje-stowarzyszenia.md` |
| stowarzyszenia | 🟢 B+ / COV | `mod-ustawa-fundacje-stowarzyszenia.md` |
| ubezpieczenia obowiązkowe, UFG i PBUK | 🟢 B+ / COV | `mod-ustawa-ubezpieczenia-obowiazkowe-UFG-PBUK.md` |
| fundacja rodzinna | 🟢 B+ / COV | `mod-ustawa-fundacja-rodzinna.md` |
| opóźnienia w transakcjach handlowych | 🟢 B+ / COV | `mod-transakcje-handlowe-opoznienia.md` |
| Prawo przedsiębiorców — Dz.U. 2025 poz. 1480 | 🟢 B+ / COV | `mod-Prawo-przedsiebiorcow-current-state-COV.md` |

## Aktywne luki

1. F-108 w DR-02 ma aktualne COV dla wszystkich przypisanych aktów.
2. KPC ma osobny current-state COV spinający rozproszone moduły procesowe; dalsza praca dotyczy głębokości konkretnych działów, nie braku mapy strukturalnej.
3. Dalsza praca dotyczy głębokości poszczególnych artykułów i niszowych wariantów, nie braku routingu.
4. `COV` nie oznacza `FULL`; każda konkretna jednostka wymaga fresh gate do ELI/ISAP.

## PrUp — stan po rozszerzeniu 2026-10-04

Pełny PDF i ekstrakcja t.j. 2026/913; 603 jawne nagłówki artykułów/grup,
70 węzłów struktury. Pominięte i uchylone części są jawnie zaznaczone.
Nie jest to 603 merytorycznie zaudytowanych artykułów ani komentarz `FULL`.

| Procedura | Moduł | Głębokość |
|---|---|---|
| Pełny tekst PrUp, wersje czasowe, indeks artykułów i odczyt ELI | `mod-PrUpad-zrodla-i-wersje.md` | źródło, metryka i odczyt |
| Zgłoszenia, braki, zwrot, sprawdzanie, lista i sprzeciw | `mod-PrUpad-wierzytelnosci-235-266.md` | workflow B; wyjątki przez pełny przepis |
| Fundusze masy, kategorie, zabezpieczenia i plan podziału | `mod-PrUpad-podzial-335-360.md` | workflow B; wyjątki przez pełny przepis |
| Czynności syndyka, wynagrodzenie, sprawozdania, plan i sprzedaż | `mod-PrUpad-syndyk-likwidacja.md` | workflow B; wyjątki przez pełny przepis |
| Tryby konsumenckie, wyłączenia części pierwszej i plan spłaty | `mod-PrUpad-konsument-workflow.md` | workflow B; wyjątki przez pełny przepis |

Rejestr `references/prup/coverage.json` oddziela obecność tekstu, routing,
głębokość procedury i brak pełnego niezależnego audytu jednostki. Ustępy
wykryte w ekstrakcji nie są automatycznie oznaczane jako zweryfikowane.

Do dalszego pogłębienia: komentarze do pozostałych jednostek, historyczne
wersje dla starszych spraw i kazusy oparte na rzeczywistych aktach.


## Pełne korpusy i procedury niewypłacalności

| Zakres | Podstawa | Moduł | Status |
|---|---|---|---|
| PrRestr — Prawo restrukturyzacyjne — pełny korpus i sposób użycia | Dz.U. 2026 poz. 533; metryka i kontrola nowelizacji w korpusie | `mod-PrRestr-zrodla-i-wersje` | pełne źródło / procedura tematyczna; fresh gate |
| PrRestr — Restrukturyzacja — kwalifikacja sprawy, plan i test zaspokojenia | Dz.U. 2026 poz. 533; metryka i kontrola nowelizacji w korpusie | `mod-PrRestr-wejscie-plan-test` | pełne źródło / procedura tematyczna; fresh gate |
| PrRestr — Postępowanie o zatwierdzenie układu — pełny przebieg | Dz.U. 2026 poz. 533; metryka i kontrola nowelizacji w korpusie | `mod-PrRestr-pzu` | pełne źródło / procedura tematyczna; fresh gate |
| PrRestr — Przyspieszone postępowanie układowe i postępowanie układowe | Dz.U. 2026 poz. 533; metryka i kontrola nowelizacji w korpusie | `mod-PrRestr-ppu-pu` | pełne źródło / procedura tematyczna; fresh gate |
| PrRestr — Sanacja — zarząd, działania sanacyjne i układ | Dz.U. 2026 poz. 533; metryka i kontrola nowelizacji w korpusie | `mod-PrRestr-sanacja` | pełne źródło / procedura tematyczna; fresh gate |
| PrRestr — Restrukturyzacja — procedura wspólna, zakończenie i upadłość | Dz.U. 2026 poz. 533; metryka i kontrola nowelizacji w korpusie | `mod-PrRestr-procedura-zakonczenie` | pełne źródło / procedura tematyczna; fresh gate |
| PrRestr — Restrukturyzacja — transgraniczne, odrębne, karne i przejściowe | Dz.U. 2026 poz. 533; metryka i kontrola nowelizacji w korpusie | `mod-PrRestr-odrebne-miedzynarodowe` | pełne źródło / procedura tematyczna; fresh gate |
| PrUp — Upadłość — przesłanki, wniosek, zabezpieczenie i pre-pack | Dz.U. 2026 poz. 913; metryka i kontrola nowelizacji w korpusie | `mod-PrUpad-wniosek-ogloszenie` | pełne źródło / procedura tematyczna; fresh gate |
| PrUp — Upadłość — masa, umowy, bezskuteczność i procesy | Dz.U. 2026 poz. 913; metryka i kontrola nowelizacji w korpusie | `mod-PrUpad-skutki-masa-bezskutecznosc` | pełne źródło / procedura tematyczna; fresh gate |
| PrUp — Upadłość — organy, wierzyciele i wspólna procedura | Dz.U. 2026 poz. 913; metryka i kontrola nowelizacji w korpusie | `mod-PrUpad-organy-procedura` | pełne źródło / procedura tematyczna; fresh gate |
| PrUp — Upadłość — zakończenie, oddłużenie przedsiębiorcy, zakaz i przepisy końcowe | Dz.U. 2026 poz. 913; metryka i kontrola nowelizacji w korpusie | `mod-PrUpad-zakonczenie-zakaz-karne` | pełne źródło / procedura tematyczna; fresh gate |
