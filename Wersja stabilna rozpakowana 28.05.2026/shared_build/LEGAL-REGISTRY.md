# LEGAL-REGISTRY — centralny rejestr aktów prawnych

Stan rejestru: 2026-05-28. Źródło metryk: wyłącznie ISAP / Dziennik Ustaw. Ten plik nie zastępuje weryfikacji online.

## Zasada bezwzględna

1. Nie cytuj przepisu, tytułu aktu, Dz.U., statusu aktu, daty wejścia w życie ani przepisu przejściowego z pamięci.
2. Przed użyciem przepisu sprawdź aktualny status w ISAP.
3. Jeżeli ISAP pokazuje tekst jednolity i późniejszą ustawę zmieniającą — oznacz akt jako `po t.j. są zmiany` i sprawdź ich wejście w życie.
4. Jeżeli nie da się potwierdzić danych w ISAP w danej sesji — użyj statusu `WYMAGA-KONTROLI-ISAP`.

## Statusy

- `AKTUALNY-ISAP` — metryka potwierdzona w ISAP na dzień kontroli.
- `PO-TJ-ZMIANY` — istnieje tekst jednolity, ale są późniejsze nowelizacje albo przepisy z odroczonym wejściem.
- `WYMAGA-KONTROLI-ISAP` — nie wolno cytować bez sprawdzenia.
- `OCZEKUJE-WEJSCIA` — akt lub część aktu opublikowana, ale jeszcze nie obowiązuje.
- `ARCHIWALNY` — tylko do analiz historycznych.

## Rejestr kontrolny — akty główne

| Kod | Akt | Metryka kontrolna ISAP | Status | Uwagi operacyjne |
|---|---|---:|---|---|
| KPC | Kodeks postępowania cywilnego | Dz.U. 2026 poz. 468 | AKTUALNY-ISAP | Sprawdzać akty zmieniające po poz. 468. |
| KPA | Kodeks postępowania administracyjnego | Dz.U. 2025 poz. 1691 | AKTUALNY-ISAP | Procedura ogólna administracyjna. |
| PPSA | Prawo o postępowaniu przed sądami administracyjnymi | Dz.U. 2026 poz. 143 | AKTUALNY-ISAP | Skargi WSA/NSA, kasacja, bezczynność. |
| KC | Kodeks cywilny | tekst ujednolicony ISAP z aktualizacjami 2025/2026 | PO-TJ-ZMIANY | Zawsze sprawdzić konkretny artykuł i przepisy przejściowe. |
| KK | Kodeks karny | Dz.U. 2025 poz. 383 + zmiany 2025 | PO-TJ-ZMIANY | Moduły karne nie mogą cytować bez sprawdzenia aktualnego tekstu. |
| KPK | Kodeks postępowania karnego | Dz.U. 2026 poz. 490 + zmiany 2025 | PO-TJ-ZMIANY | Szczególnie sprawdzać środki zaskarżenia i doręczenia. |
| KSH | Kodeks spółek handlowych | tekst ujednolicony ISAP, aktualizacja pliku 2026-03-12; zmiany Dz.U. 2026 poz. 176 i 644 | PO-TJ-ZMIANY | Sprawdzać wejście w życie zmian 2026. |
| KSCU | Koszty sądowe w sprawach cywilnych | Dz.U. 2025 poz. 1228 | PO-TJ-ZMIANY | Sprawdzać zmiany 2026, w tym Dz.U. 2026 poz. 346. |
| PR | Prawo restrukturyzacyjne | Dz.U. 2026 poz. 533 | AKTUALNY-ISAP | Nowy tekst jednolity. |
| PU | Prawo upadłościowe | Dz.U. 2025 poz. 614 | PO-TJ-ZMIANY | Sprawdzić zmiany po t.j. i wejście w życie. |
| PBUD | Prawo budowlane | Dz.U. 2026 poz. 524 | AKTUALNY-ISAP | Zastępuje wcześniejsze odwołania do Dz.U. 2025 poz. 418. |
| PLAN | Planowanie i zagospodarowanie przestrzenne | Dz.U. 2026 poz. 538 | AKTUALNY-ISAP | Zastępuje Dz.U. 2024 poz. 1130. |
| POS | Prawo ochrony środowiska | Dz.U. 2026 poz. 670 | AKTUALNY-ISAP | Wysokie ryzyko częstych zmian. |
| PRZYR | Ochrona przyrody | Dz.U. 2026 poz. 13 | AKTUALNY-ISAP | Moduł środowiskowy. |
| CUDZ | Ustawa o cudzoziemcach | Dz.U. 2025 poz. 1079 + Dz.U. 2025 poz. 1794 | PO-TJ-ZMIANY | Sprawdzić przepisy przejściowe i rozporządzenia wykonawcze 2026. |
| ENER | Prawo energetyczne | Dz.U. 2026 poz. 43 + zmiana Dz.U. 2026 poz. 516 | PO-TJ-ZMIANY | Sprawdzać status nowelizacji i przepisy przejściowe. |
| KSCYBER | Krajowy system cyberbezpieczeństwa | Dz.U. 2026 poz. 20 + Dz.U. 2026 poz. 252 | PO-TJ-ZMIANY | Moduł cyber/regulacyjny. |
| AML | Przeciwdziałanie praniu pieniędzy i finansowaniu terroryzmu | tekst ujednolicony ISAP, plik z 2025-12-19 | WYMAGA-KONTROLI-ISAP | Przed cytowaniem sprawdzić najnowszy tekst i zmiany. |
| OLiOC | Ochrona ludności i obrona cywilna | Dz.U. 2024 poz. 1907 + Dz.U. 2026 poz. 646 | PO-TJ-ZMIANY | Nowy obszar, wymaga kontroli wejścia w życie. |

## Reguła aktualizacji

Każdy moduł dziedzinowy ma korzystać z tego rejestru i nie utrzymywać własnej sprzecznej metryki. Jeżeli w module lokalnym znajduje się starszy Dz.U., pierwszeństwo ma `LEGAL-REGISTRY.md` i bieżący odczyt ISAP.

## Aktualizacja kompletności — ZUS, niepełnosprawność, sądownictwo, zawody zaufania (2026-05-28)

Dodano do rejestru obszary obowiązkowe:

| Obszar | Moduł | Status |
|---|---|---|
| ZUS/KRUS i ubezpieczenia społeczne | `mod-BJ-prawo-ubezpieczen-spolecznych-zus-krus.md` | wymagaj kontroli ISAP przed cytowaniem |
| niepełnosprawność/PFRON/świadczenie wspierające | `mod-BK-niepelnosprawnosc-pfron-swiadczenie-wspierajace.md` | wymagaj kontroli ISAP przed cytowaniem |
| renty i emerytury FUS/KRUS | `mod-BL-renty-emerytury-fus-krus.md` | wymagaj kontroli ISAP przed cytowaniem |
| biegli i opinie | `mod-BM-biegli-sadowi-opinie-eksperckie.md` | wymagaj kontroli aktu i rozporządzenia wykonawczego |
| sądownictwo | `mod-BN-sadownictwo-ustroj-sadow.md` | wymagaj kontroli ISAP i regulaminów |
| ORA/OIRP/zawody zaufania | `mod-BO-zawody-zaufania-publicznego-ora-oirp.md` | ISAP + źródła samorządowe |
| dyscyplinarki | `mod-BP-postepowania-dyscyplinarne-profesjonalne.md` | ISAP + regulaminy/etyka właściwego zawodu |
