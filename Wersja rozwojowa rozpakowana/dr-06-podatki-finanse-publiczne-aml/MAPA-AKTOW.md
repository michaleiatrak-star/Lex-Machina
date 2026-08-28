# DR-06 — Lokalna Mapa Aktów Prawnych

## Podatki, finanse publiczne, AML

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / zakres → moduł**. Historia napraw, poprzednie numery, iteracje pokrycia i fakty negatywne pozostają poza runtime.

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Ordynacja podatkowa | Dz.U. 2026 poz. 622 t.j. ze zm. | `mod-OP-ordynacja-podatkowa` + rodzina modułów OP | 🟢 aktywny; fresh gate |
| OP — pozostałe działy / pokrycie przekrojowe | jw. | `mod-OP-uzupelnienie-pokrycia-2026` | 🟡 B |
| OP — dowody w postępowaniu podatkowym | jw. | `mod-OP-dzial-IV-rozdzial-11-dowody` | ✅ aktywny |
| OP — kontrola podatkowa | jw. | `mod-OP-kontrola-podatkowa-dzial-VI` | ✅ aktywny |
| OP — ulgi w spłacie zobowiązań | jw. | `mod-OP-ulgi-w-splacie-dzial-III-rozdzial-7a` | ✅ aktywny |
| OP — czynności sprawdzające | jw. | `mod-OP-czynnosci-sprawdzajace-dzial-V` | ✅ aktywny |
| Interpretacje podatkowe / MDR / objaśnienia MF | OP jw. + właściwe akty wykonawcze | `mod-interpretacje-definicje-podatkowe` | ✅ aktywny; fresh gate |
| Ustawa o PIT | Dz.U. 2026 poz. 592 t.j. ze zm. | `mod-PIT-podatek-dochodowy-fizyczne` | ✅ aktywny |
| Ustawa o CIT | Dz.U. 2026 poz. 554 t.j. ze zm. | `mod-CIT-podatek-dochodowy-prawne` | ✅ aktywny |
| Ustawa o VAT | Dz.U. 2025 poz. 775 t.j. ze zm. | `mod-VAT-podatek-od-towarow-i-uslug` + rodzina modułów VAT | 🟢 aktywny; fresh gate |
| VAT — import towarów i zwolnienia importowe | jw. + właściwe akty wykonawcze | `mod-VAT-import-towarow-i-zwolnienia-importowe` | ✅ aktywny |
| VAT — WIS | jw. | `mod-VAT-WIS-tryb-i-ochrona` | ✅ aktywny |
| VAT — kursy walut / rachunek VAT / TAX FREE | jw. | `mod-VAT-kursy-walut-rachunek-VAT-tax-free` | ✅ aktywny |
| VAT — rejestracja / zapłata / metoda kasowa / likwidacja | jw. | `mod-VAT-rejestracja-zaplata-metoda-kasowa-likwidacja` | ✅ aktywny |
| VAT — płatnicy / egzekucja / kasy / transakcje trójstronne | jw. | `mod-VAT-platnicy-egzekucja-kasy-trojstronne` | ✅ aktywny |
| VAT — transakcje i fakturowanie | jw. | `mod-VAT-transakcje-fakturowanie` | ✅ aktywny |
| VAT — miejsce świadczenia i zwolnienia | jw. | `mod-VAT-miejsce-swiadczenia-zwolnienia` | ✅ aktywny |
| VAT — obowiązek podatkowy / podstawa / nieruchomości | jw. | `mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci` | ✅ aktywny |
| VAT — sankcje / bony / odliczenia | jw. | `mod-VAT-sankcje-bony-odliczenia` | ✅ aktywny |
| VAT — ewidencja / deklaracje / zwrot | jw.; zmiany przyszłe stosować wyłącznie wg daty wejścia w życie | `mod-VAT-ewidencja-deklaracje` | ✅ aktywny; temporal gate |
| VAT — klasyfikacja produktów / PKWiU / CN / WIS | jw. + właściwe klasyfikacje i akty UE | `mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci` | ✅ aktywny; fresh gate |
| Ustawa o Krajowej Administracji Skarbowej | Dz.U. 2025 poz. 1131 t.j. ze zm. | `mod-KAS-kontrola-celno-skarbowa` | ✅ aktywny |
| Kodeks karny skarbowy — routing podatkowo-karny | Dz.U. 2025 poz. 633 t.j. ze zm. | DR-03 `mod-KKS-karny-skarbowy-i-AML.md` | 🟢 B+/COV |
| Ustawa o finansach publicznych | Dz.U. 2025 poz. 1483 t.j. ze zm. | `mod-UFP-finanse-publiczne-NIK-RIO` | ✅ aktywny |
| Prawo przedsiębiorców — limit płatności gotówkowych | Dz.U. 2025 poz. 1480 t.j. ze zm. | `mod-limit-platnosci-gotowkowych` + DR-02 `mod-Prawo-przedsiebiorcow-current-state-COV.md` | 🟢 B+/COV |
| Ustawa AML | Dz.U. 2025 poz. 644 t.j. ze zm. | `mod-ustawa-AML-instytucje-obowiazkowe` | ✅ aktywny |
| Ustawa o PCC + podatek od spadków i darowizn | PCC: Dz.U. 2026 poz. 191 t.j. ze zm. | `mod-ustawa-PCC-i-podatek-spadkow-darowizn` | ✅ aktywny |
| Ustawa o podatku akcyzowym | Dz.U. 2026 poz. 412 t.j. ze zm. | `mod-ustawa-akcyzowa-i-clo-UCC` | ✅ aktywny; fresh gate |
| Unijny kodeks celny (UCC) / taryfa celna | rozporządzenie (UE) nr 952/2013 + właściwa nomenklatura CN | `mod-UCC-clo-taryfa-celna` | ✅ aktywny; EUR-Lex fresh gate |
| Kontrola środków pieniężnych / prawo dewizowe / podróżni | rozporządzenie (UE) 2018/1672 + Dz.U. 2024 poz. 1131 ze zm. + akty właściwe | `mod-clo-podroznych-limity-towary-zabronione` | ✅ aktywny; fresh gate |
| Ustawa o podatkach i opłatach lokalnych | Dz.U. 2025 poz. 707 t.j. ze zm. | `mod-ustawa-podatek-nieruchomosci-i-lokalne` | ✅ aktywny |
| Ustawa o ryczałcie od przychodów ewidencjonowanych | Dz.U. 2025 poz. 843 t.j. ze zm. | `mod-ustawa-ryczalt-przychody` | ✅ aktywny |
| Ustawa o nadzorze nad rynkiem finansowym | Dz.U. 2026 poz. 935 t.j. ze zm. | `mod-prawo-bankowe-KNF-BFG` | ✅ aktywny |
| Ustawa o obligacjach | Dz.U. 2025 poz. 1667 t.j. ze zm. | `mod-ustawa-rynek-kapitalowy-fundusze` | ✅ aktywny |
| Ustawa o usługach płatniczych | Dz.U. 2026 poz. 623 t.j. ze zm. | `mod-ustawa-uslugi-platnicze` | ✅ aktywny |
| Ustawa o rachunkowości | Dz.U. 2026 poz. 522 t.j. ze zm. | `mod-ustawa-rachunkowosci` | 🟢/🟡 aktywny |
| Biegli rewidenci i nadzór publiczny | Dz.U. 2025 poz. 1891 t.j. ze zm. | `mod-ustawa-biegli-rewidenci-zawod` | ✅ aktywny |
| Doradztwo podatkowe | Dz.U. 2021 poz. 2117 t.j. ze zm. | `mod-ustawa-doradcy-podatkowi-zawod` | ✅ aktywny; fresh gate |
| PKPiR / ewidencje uproszczone | właściwe akty wykonawcze obowiązujące od 2026 r. | `mod-PKPiR-ewidencje-uproszczone` | ✅ aktywny; fresh gate |
| JPK / księgi elektroniczne / e-sprawozdania | właściwe ustawy i akty wykonawcze | `mod-JPK-ksiegi-elektroniczne-e-sprawozdania` | ✅ aktywny; temporal gate |
| Kasy rejestrujące | właściwe akty wykonawcze MF | `mod-kasy-rejestrujace-fiskalizacja` | ✅ aktywny; fresh gate |
| Rachunkowość budżetowa JSFP | Dz.U. 2026 poz. 909 t.j. | `mod-rachunkowosc-budzetowa-JSFP` | ✅ aktywny |
| PKWiU / PKOB / CN | aktualne klasyfikacje statystyczne i okresy przejściowe | `mod-PKWiU-klasyfikacje-statystyczne` | ✅ aktywny; temporal gate |
| Podatki sektorowe | akty właściwe dla podatku bankowego, gier, tonażowego, opłaty cukrowej i sprzedaży detalicznej | `mod-podatki-sektorowe-bankowy-gry-tonazowy-cukrowy-detaliczny` | ✅ aktywny; fresh gate |
| Regulacja alkoholu i tytoniu | właściwe ustawy sektorowe | `mod-alkohol-tyton-regulacja-sprzedazy` | ✅ aktywny; fresh gate |

## Reguły runtime

- mapa nie przechowuje historycznych iteracji audytu, dawnych błędów, wet, projektów ani innych faktów negatywnych; takie informacje należą do dziennika audytowego i monitoringu temporalnego;
- kwoty, stawki, progi, formularze, klasyfikacje, terminy i przepisy z odroczonym wejściem w życie zawsze wymagają fresh gate do ELI/ISAP, MF albo EUR-Lex;
- `COV` oznacza bieżącą mapę struktury/routingu, nie `FULL` artykuł-po-artykule.
