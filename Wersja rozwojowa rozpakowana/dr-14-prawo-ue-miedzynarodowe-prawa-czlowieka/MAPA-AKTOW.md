# DR-14 — Lokalna Mapa Aktów Prawnych

## Prawo UE, Międzynarodowe, Prawa Człowieka

Mapa runtime pokazuje wyłącznie bieżący stan akt → moduł. Historia weryfikacji i napraw pozostaje poza tym plikiem.

| Akt / zakres | Źródło bieżące | Moduł | Status bieżący |
|---|---|---|---|
| TUE + TFUE — prawo pierwotne UE | EUR-Lex, wersje skonsolidowane 15.03.2025 | `mod-TFUE-TUE-prawo-pierwotne-UE` | 🟢 B+/COV; fresh gate do EUR-Lex |
| Karta Praw Podstawowych UE | EUR-Lex | `mod-KPP-karta-praw-podstawowych-UE` | 🟢 operacyjny |
| Europejska Konwencja Praw Człowieka | Dz.U. 1993 nr 61 poz. 284 ze zm. + źródła Rady Europy | `mod-EKPC-ETPC-prawa-czlowieka` | 🟢 operacyjny; termin i dopuszczalność zawsze fresh gate |
| Bruksela Ia 1215/2012 | EUR-Lex | `mod-KPC-egzekucja-transgraniczna-UE` | 🟢 operacyjny |
| KPC — egzekucja transgraniczna | Dz.U. 2026 poz. 468 t.j. | `mod-KPC-egzekucja-transgraniczna-UE` | 🟢 operacyjny |
| Rzym I 593/2008 + Rzym II 864/2007 | EUR-Lex | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟢 operacyjny |
| Prawo prywatne międzynarodowe | Dz.U. 2023 poz. 503 t.j. | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟢 operacyjny |
| Rozporządzenie spadkowe 650/2012 | EUR-Lex | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟢 operacyjny |
| Bruksela IIb 2019/1111 | EUR-Lex | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟢 operacyjny |
| Konwencja haska 1980 — uprowadzenie dziecka | HCCH | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟢 operacyjny |
| Konwencja haska 2007 — alimenty transgraniczne | HCCH | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟢 operacyjny |
| MPPOiP | Dz.U. 1977 nr 38 poz. 167 | `mod-ONZ-pakty-prawa-czlowieka` | 🟢 operacyjny |
| MPPGSiK | Dz.U. 1977 nr 38 poz. 169 | `mod-ONZ-pakty-prawa-czlowieka` | 🟢 operacyjny |
| CRPD | Dz.U. 2012 poz. 1169 | `mod-ONZ-pakty-prawa-czlowieka` | 🟢 operacyjny |
| Traktat Waszyngtoński (NATO) | Dz.U. 1999 nr 87 poz. 970 | `mod-NATO-umowy-miedzynarodowe` | 🟢 operacyjny |
| SOFA NATO | Dz.U. 2000 nr 21 poz. 257 | `mod-NATO-umowy-miedzynarodowe` | 🟢 operacyjny |
| Zasady pobytu wojsk obcych na terytorium RP | Dz.U. 2024 poz. 1770 t.j. | `mod-NATO-umowy-miedzynarodowe` | 🟢 operacyjny |
| Rejestr źródeł prawa i lifecycle | moduł metodyczny | `mod-rejestr-zrodla-prawa-lifecycle` | 🟢 operacyjny |
| Mały ruch graniczny — rama UE 1931/2006 + 1342/2011 | EUR-Lex | `mod-maly-ruch-graniczny` | 🟢 operacyjny; stan praktyczny fresh gate |
| MRG Polska–Ukraina | Dz.U. 2009 nr 103 poz. 858 | `mod-maly-ruch-graniczny` | 🟢 akt zmapowany; zastosowanie praktyczne fresh gate |
| MRG Polska–Rosja / obwód kaliningradzki | Dz.U. 2012 poz. 814 | `mod-maly-ruch-graniczny` | 🟡 status wykonywania wymaga fresh gate |
| MRG Polska–Białoruś | dokumentacja ratyfikacyjna / urzędowa | `mod-maly-ruch-graniczny` | 🟡 status wejścia w życie i praktyki wymaga fresh gate |
| Kontrola niektórych inwestycji (FDI screening) | Dz.U. 2026 poz. 47 t.j. | `mod-inwestycje-transgraniczne-FDI-BIT` | 🟢 operacyjny |
| BIT/ISDS, w tym intra-UE | traktaty, EUR-Lex, orzecznictwo TSUE | `mod-inwestycje-transgraniczne-FDI-BIT` | 🟡 status konkretnego BIT zawsze fresh gate |
| Konwencja wiedeńska o stosunkach dyplomatycznych | Dz.U. 1965 nr 37 poz. 232 | `mod-konwencje-wiedenskie-dyplomatyczne-konsularne` | 🟢 B+/COV |
| Konwencja wiedeńska o stosunkach konsularnych | Dz.U. 1982 nr 13 poz. 98 | `mod-konwencje-wiedenskie-dyplomatyczne-konsularne` | 🟢 B+/COV |
| Konwencja dotycząca statusu uchodźców | Dz.U. 1991 nr 119 poz. 515 | `mod-konwencja-genewska-uchodzcy-1951-protokol-1967` | 🟢 B+/COV |
| Protokół dotyczący statusu uchodźców | Dz.U. 1991 nr 119 poz. 517 | `mod-konwencja-genewska-uchodzcy-1951-protokol-1967` | 🟢 B+/COV |

## Reguła użycia

- Prawo UE: przed konkretnym powołaniem sprawdź wersję obowiązującą w EUR-Lex, w tym datę konsolidacji i temporalność.
- Umowy międzynarodowe: osobno sprawdź obowiązywanie wobec Polski, zastrzeżenia, protokoły i ewentualne zawieszenie stosowania.
- BIT/ISDS i mały ruch graniczny są zakresami szczególnie podatnymi na zmianę stanu praktycznego; mapa nie zastępuje bieżącej weryfikacji.
- `B+/COV` nie oznacza `FULL`.
