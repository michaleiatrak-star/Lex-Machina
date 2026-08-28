# F-108 — ponowna weryfikacja pokrycia i aktualności prawa — 2026-08-28

## Zakres i źródła

Przedmiot: benchmark 52 aktów wskazanych w `F-108-lista-MS-egzamin-2026.md` w najnowszej wersji rozwojowej rozpakowanej.

Tryb prawny: `prawny-router-v3` → routing [11] (weryfikacja cudzego materiału) → `analizator-przepisow-v2` + `prawo-polskie-v2` + właściwe DR.  
Źródła prawa: ELI/ISAP dla prawa polskiego, EUR-Lex dla TUE/TFUE. Metryka Dz.U. nie zastępuje fresh/temporal gate dla konkretnej jednostki.

## Wynik pokrycia

- inwentarz/routing: **52/52**;
- status B+/COV potwierdzony przez kanoniczne mapy: **48/52**;
- poniżej COV: **4/52**;
- FULL: **0/52**.

| ID | Akt | Stan 2026-08-28 | Powód braku COV |
|---:|---|---|---|
| 7 | Kodeks wykroczeń | B+ | `DR-03/MAPA-POKRYCIA.md` jawnie pozostawia niszowe rozdziały do pogłębienia |
| 29 | System ubezpieczeń społecznych | B/B+ | `DR-04/MAPA-POKRYCIA.md` zawiera działy B/B+ i nie deklaruje COV całego aktu |
| 30 | Ustawa zasiłkowa | B+ | pełna mapa rozdziałów, ale moduł/mapa nie deklarują COV całego aktu |
| 40 | Zwolnienia grupowe | B+ | moduł operacyjny, bez audytu strukturalnego wystarczającego do COV |

Wniosek: wcześniejsza deklaracja „52/52 B+/COV” mieszała **obecność modułu/rejestrację** z **pokryciem strukturalnym**. F-108 należy traktować jako ponownie otwartą wyłącznie w tych czterech pozycjach; nie ma luki inwentarzowej.

## Błędy aktualności / tożsamości wykryte i naprawione

1. **KC** — aktywne rejestry pomocnicze i część `ROUTING-MAP.md` nadal wskazywały Dz.U. 2025 poz. 1071; aktualny t.j. to **Dz.U. 2026 poz. 795**.
2. **Prawo upadłościowe** — `shared/LEGAL-REGISTRY.md` i `shared/ISAP-METRYKI-AKTOW.md` wskazywały 2025/614; aktualny t.j. to **2026/913**.
3. **Prawo o prokuraturze** — DR-12 i `prawo-polskie-v2/ROUTING-MAP.md` wskazywały 2024/390; aktualny t.j. to **2026/810**.
4. **Fundacje / stowarzyszenia** — centralna mapa błędnie przypisywała:
   - 2025/1338 Prawu o stowarzyszeniach; w ELI to t.j. ustawy o działalności pożytku publicznego i o wolontariacie;
   - 2023/549 ustawie o fundacjach; w ELI to rozporządzenie MKiDN o pomocy publicznej na kulturę.
   Aktualne metryki: fundacje **2023/166 + obowiązująca zm. 2026/316**; stowarzyszenia **2020/2261 + obowiązująca zm. 2026/316**. Ustawa **2026/346** jest już opublikowana, ale wchodzi w życie dopiero 30.09.2028 i do tego czasu pozostaje temporalnym monitoringiem.
5. **Prawa konsumenta** — 2024/1796 było błędnie opisane jako „KC/KPC — poprzedni t.j.”; ELI potwierdza, że jest to t.j. ustawy o prawach konsumenta.
6. **Spółdzielnie mieszkaniowe** — 2024/1069 było błędnie przypisane tej ustawie; w ELI jest to rozporządzenie MI dotyczące rejestru polskich statków żeglugi śródlądowej. Aktualny t.j. ustawy o spółdzielniach mieszkaniowych: **2026/889**.
7. **2026/346** — błędnie opisane jako zmiana Prawa restrukturyzacyjnego; ELI: nowelizacja Prawa o stowarzyszeniach, KRS i KSCU.
8. **Ustawa zasiłkowa** — brakowało w aktualnej centralnej mapie nowego t.j. **2026/854**.
9. Starsze t.j. USG, USW, Prawa spółdzielczego, własności lokali i Prawa o prokuraturze pozostawały oznaczone `OK`; w nowej mapie są `PREV`.

## Metryki bazowe 52 aktów

Legenda: `TJ` = najnowszy zidentyfikowany tekst jednolity; `TJ+` = najnowszy t.j., ale są późniejsze zmiany wymagające temporal gate; `ORG+` = brak odrębnego późniejszego t.j., akt pierwotny/tekst ujednolicony; `UE` = EUR-Lex; `KONST` = publikacja konstytucji + zmiany, nie klasyczny t.j.

| ID | Akt | Metryka bazowa na 2026-08-28 | Typ |
|---:|---|---|---|
| 1 | Prawo wekslowe | Dz.U. 2022 poz. 282 | TJ |
| 2 | TFUE | EUR-Lex, aktualne brzmienie skonsolidowane | UE |
| 3 | KPA | Dz.U. 2025 poz. 1691 + późn. zm. | TJ+ |
| 4 | KRO | Dz.U. 2026 poz. 236 | TJ |
| 5 | KC | Dz.U. 2026 poz. 795 + późn. zm. | TJ+ |
| 6 | KPC | Dz.U. 2026 poz. 468 + późn. zm. | TJ+ |
| 7 | KW | Dz.U. 2025 poz. 734 + późn. zm. | TJ+ |
| 8 | Opłaty w sprawach karnych | Dz.U. 2023 poz. 123 | TJ |
| 9 | Kodeks pracy | Dz.U. 2025 poz. 277 + późn. zm. | TJ+ |
| 10 | Prawo o adwokaturze | Dz.U. 2024 poz. 1564 + późn. zm. | TJ+ |
| 11 | Księgi wieczyste i hipoteka | Dz.U. 2026 poz. 1066 | TJ |
| 12 | Radcowie prawni | Dz.U. 2024 poz. 499 + późn. zm. | TJ+ |
| 13 | Prawo spółdzielcze | Dz.U. 2026 poz. 521 | TJ |
| 14 | Fundacje | Dz.U. 2023 poz. 166 + Dz.U. 2026 poz. 316 | TJ+ |
| 15 | RPO | Dz.U. 2024 poz. 1264 | TJ |
| 16 | Prawo o stowarzyszeniach | Dz.U. 2020 poz. 2261 + obowiązująca zm. Dz.U. 2026 poz. 316; opubl. Dz.U. 2026 poz. 346 (wejście 30.09.2028) | TJ+ |
| 17 | Samorząd gminny | Dz.U. 2026 poz. 662 | TJ |
| 18 | TUE | EUR-Lex, aktualne brzmienie skonsolidowane | UE |
| 19 | Prawo autorskie | Dz.U. 2025 poz. 24 + późn. zm. | TJ+ |
| 20 | Własność lokali | Dz.U. 2026 poz. 232 | TJ |
| 21 | Zastaw rejestrowy | Dz.U. 2018 poz. 2017 + późn. zm. | TJ+ |
| 22 | Konstytucja RP | Dz.U. 1997 nr 78 poz. 483 + zm. | KONST |
| 23 | KK | Dz.U. 2025 poz. 383 + późn. zm. | TJ+ |
| 24 | KPK | Dz.U. 2026 poz. 490 + późn. zm. | TJ+ |
| 25 | KRS | Dz.U. 2025 poz. 869 + późn. zm. | TJ+ |
| 26 | Gospodarka nieruchomościami | Dz.U. 2026 poz. 399 | TJ |
| 27 | Samorząd powiatowy | Dz.U. 2025 poz. 1684 | TJ |
| 28 | Samorząd województwa | Dz.U. 2026 poz. 720 | TJ |
| 29 | System ubezpieczeń społecznych | Dz.U. 2026 poz. 199 + późn. zm. | TJ+ |
| 30 | Zasiłki chorobowe i macierzyńskie | Dz.U. 2026 poz. 854 | TJ |
| 31 | KKS | Dz.U. 2025 poz. 633 + późn. zm. | TJ+ |
| 32 | RPD | Dz.U. 2023 poz. 292 | TJ |
| 33 | KSH | Dz.U. 2024 poz. 18 + późn. zm. | TJ+ |
| 34 | Spółdzielnie mieszkaniowe | Dz.U. 2026 poz. 889 + późn. zm. | TJ+ |
| 35 | Ochrona praw lokatorów | Dz.U. 2023 poz. 725 + późn. zm. | TJ+ |
| 36 | PUSP | Dz.U. 2024 poz. 334 + późn. zm. | TJ+ |
| 37 | KPW | Dz.U. 2025 poz. 860 + późn. zm. | TJ+ |
| 38 | PPSA | Dz.U. 2026 poz. 143 + późn. zm. | TJ+ |
| 39 | Prawo upadłościowe | Dz.U. 2026 poz. 913 + późn. zm. | TJ+ |
| 40 | Zwolnienia grupowe | Dz.U. 2025 poz. 570 + późn. zm. | TJ+ |
| 41 | Ubezpieczenia obowiązkowe, UFG i PBUK | Dz.U. 2026 poz. 783 + późn. zm. | TJ+ |
| 42 | KSCU | Dz.U. 2025 poz. 1228 + późn. zm. | TJ+ |
| 43 | Przeciwdziałanie narkomanii | Dz.U. 2023 poz. 1939 + Dz.U. 2026 poz. 1004 | TJ+ |
| 44 | UOKiK | Dz.U. 2025 poz. 1714 + późn. zm. | TJ+ |
| 45 | Wojewoda i administracja rządowa | Dz.U. 2025 poz. 428 | TJ |
| 46 | Opóźnienia w transakcjach handlowych | Dz.U. 2023 poz. 1790 + późn. zm. | TJ+ |
| 47 | Prawa konsumenta | Dz.U. 2024 poz. 1796 + późn. zm. | TJ+ |
| 48 | Prawo restrukturyzacyjne | Dz.U. 2026 poz. 533 + późn. zm. | TJ+ |
| 49 | Prawo o prokuraturze | Dz.U. 2026 poz. 810 + późn. zm. | TJ+ |
| 50 | Sąd Najwyższy | Dz.U. 2024 poz. 622 + późn. zm. | TJ+ |
| 51 | Prawo przedsiębiorców | Dz.U. 2025 poz. 1480 + późn. zm. | TJ+ |
| 52 | Fundacja rodzinna | Dz.U. 2023 poz. 326; ELI publikuje tekst ujednolicony | ORG+ |

## Odpowiedź na pytanie „czy wszystkie t.j. są aktualne?”

**Przed naprawą: nie.** Aktywne indeksy zawierały zarówno nieaktualne t.j., jak i błędne przypisania numerów do aktów.

**Po naprawie tej gałęzi:** dla 52 pozycji F-108 metryki bazowe wskazują najnowszy zidentyfikowany t.j. albo prawidłowy odpowiednik (EUR-Lex / Konstytucja / akt pierwotny bez nowego t.j.). To nadal **nie oznacza**, że sam tekst jednolity wystarcza do ustalenia brzmienia przepisu na konkretny dzień: przy pozycjach `TJ+` obowiązuje fresh/temporal gate na akty zmieniające, daty wejścia w życie i przepisy przejściowe.

## Źródła urzędowe kontrolne

- ELI: `https://eli.gov.pl/`
- ISAP: `https://isap.sejm.gov.pl/`
- EUR-Lex: `https://eur-lex.europa.eu/`

Dla korekt krytycznych odczytano bezpośrednio indeks ELI dla pozycji 2025/1338, 2023/549, 2024/1069, 2024/1796, 2026/316, 2026/346, 2026/810 i 2026/854.
