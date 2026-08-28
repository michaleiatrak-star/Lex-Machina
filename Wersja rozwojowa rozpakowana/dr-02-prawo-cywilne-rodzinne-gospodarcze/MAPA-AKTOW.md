# DR-02 — Lokalna Mapa Aktów Prawnych

## Prawo cywilne, rodzinne i gospodarcze

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / zakres → moduł**. Historia napraw, poprzednie metryki, zamknięte flagi i opisy sesji audytowych pozostają poza runtime.

### Kodeks cywilny i KPC

**KC:** Dz.U. 2026 poz. 795 t.j. ze zm.  
**KPC:** Dz.U. 2026 poz. 468 t.j. ze zm.

| Zakres | Moduł / routing | Status runtime |
|---|---|---|
| KC — indeks current-state całego kodeksu | `mod-KC-current-state-COV.md` | 🟢 B+/COV |
| KC — zobowiązania / odpowiedzialność | `mod-KC-cywilne-zobowiazania-odpowiedzialnosc` | ✅ aktywny; fresh gate |
| KC — konsumenckie | `mod-KC-konsumenckie` | ✅ aktywny; fresh gate |
| KC — spadki, część główna | `mod-KC-spadki` | ✅ aktywny |
| KC — zachowek / dział / rozrządzenia | `mod-KC-spadki-zachowek-dzial-rozrzadzenia` | ✅ aktywny |
| KC — długi spadkowe / umowy / transgraniczne | `mod-KC-spadki-dlugi-umowy-transgraniczne` | ✅ aktywny; fresh gate UE |
| KC — ubezpieczenia | `mod-KC-ubezpieczenia` | ✅ aktywny |
| KC — kredyty frankowe / abuzywność | `mod-KC-kredyty-frankowe` | ✅ aktywny; fresh gate |
| Rzeczy znalezione / zasiedzenie | `mod-rzeczy-znalezione-zasiedzenie` | ✅ aktywny |
| Odpowiedzialność za zwierzę / droga rowerowa | `mod-pies-droga-rowerowa-odpowiedzialnosc.md` | ✅ aktywny; fresh gate |
| KP art. 94³ — mobbing / dyskryminacja (routing przekrojowy) | `mod-KP-art943-mobbing-dyskryminacja` | ✅ aktywny; fresh gate |
| KPC — indeks current-state całego kodeksu | `mod-KPC-current-state-COV.md` | 🟢 B+/COV |
| KPC — egzekucja / windykacja | `mod-KPC-egzekucja-windykacja` | ✅ aktywny |
| KPC — prawomocność / granice apelacji | `mod-KPC-prawomocnosc-granice-apelacji` | ✅ aktywny |
| KPC — nieproces, część ogólna | `mod-KPC-nieproces-czesc-ogolna` | ✅ aktywny |
| KPC — uzupełnienie pokrycia | `mod-KPC-uzupelnienie-pokrycia-2026` | 🟡 B+ |
| Pełnomocnicy / aplikanci / skład sądu | `mod-liczba-pelnomocnikow-strona-samodzielna.md` + `mod-sklad-sadu-liczba-sedziow.md` | ✅ aktywny; fresh gate |

### Rodzina i piecza

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Kodeks rodzinny i opiekuńczy | Dz.U. 2026 poz. 236 t.j. ze zm. | `mod-KRO-rodzinne` | 🟢 B+/COV |
| KRO — zawarcie małżeństwa / bigamia / transgraniczne | jw. + właściwe prawo międzynarodowe | `mod-KRO-zawarcie-malzenstwa-bigamia-transgraniczne` | ✅ aktywny; fresh gate |
| KRO — przysposobienie | jw. + Konwencja haska 1993 | `mod-KRO-przysposobienie-adopcja-miedzynarodowa` | ✅ aktywny |
| KRO — opieka i kuratela | jw. | `mod-KRO-opieka-i-kuratela` | ✅ aktywny |
| Ubezwłasnowolnienie / opieka / kuratela | KC/KRO/KPC jw. | `mod-ubezwlasnowolnienie-opieka-kuratela` | ✅ aktywny |
| OZSS | Dz.U. 2018 poz. 708 t.j. ze zm. | `mod-KRO-rodzinne` | ✅ aktywny |
| Piecza zastępcza | Dz.U. 2026 poz. 980 t.j. ze zm. | `mod-piecza-zastepcza-rodzina-zastepcza` | ✅ aktywny |

### Spółki, przedsiębiorcy, restrukturyzacja i rejestry

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Kodeks spółek handlowych | Dz.U. 2024 poz. 18 t.j. ze zm. | `mod-KSH-spolki-handlowe` | ✅ aktywny; fresh gate |
| KSH — wrogie przejęcie / obrona | jw. | `mod-KSH-wrogie-przejecie-obrona-bialy-rycerz` | ✅ aktywny |
| KSH — uzupełnienie pokrycia | jw. | `mod-KSH-uzupelnienie-pokrycia-2026` | 🟡 B |
| KSH — organy sp. z o.o. | jw. | `mod-KSH-organy-spolki-zoo` | ✅ aktywny |
| KSH — spółki osobowe / rada nadzorcza | jw. | `mod-KSH-spolki-osobowe-rada-nadzorcza` | ✅ aktywny |
| Prawo przedsiębiorców — current-state | Dz.U. 2025 poz. 1480 t.j. ze zm. | `mod-Prawo-przedsiebiorcow-current-state-COV.md` + `mod-prawo-przedsiebiorcow` | 🟢 B+/COV |
| Prawo przedsiębiorców — kontrola / koncesje + weksle | jw. + akty wekslowe | `mod-wekslowe-kontrola-przedsiebiorcy-koncesje` | ✅ aktywny |
| KRS | Dz.U. 2025 poz. 869 t.j. ze zm. | `mod-ustawa-KRS-rejestr-sadowy` | 🟢 B+/COV |
| UZNK | Dz.U. 2026 poz. 85 t.j. ze zm. | `mod-ustawa-UZNK-nieuczciwa-konkurencja` | ✅ aktywny |
| Prawo upadłościowe | Dz.U. 2026 poz. 913 t.j. ze zm. | `mod-PrUpad-upadlosc-restrukturyzacja` + rodzina PrUp | ✅ aktywny; fresh gate |
| PrUp — układ / likwidacja / zakończenie | jw. | `mod-PrUpad-uklad-likwidacja-zakonczenie` | ✅ aktywny |
| PrUp — likwidacja / międzynarodowe / szczególne | jw. | `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne` | ✅ aktywny |
| PrUp — postępowania odrębne | jw. | `mod-PrUpad-postepowania-odrebne-426-491-38` | ✅ aktywny |
| PrUp + PrRestr — uzupełnienie | PrUp jw. + PrRestr Dz.U. 2026 poz. 533 t.j. ze zm. | `mod-PrUp-PrRestr-uzupelnienie-pokrycia-2026` | 🟡 B |
| Prawo restrukturyzacyjne — układ | Dz.U. 2026 poz. 533 t.j. ze zm. | `mod-PrRestr-dzial-VI-uklad` | ✅ aktywny |
| PrRestr — układ częściowy | jw. | `mod-PrRestr-dzial-VII-uklad-czesciowy` | ✅ aktywny |
| PrRestr — nadzorca / zarządca | jw. | `mod-PrRestr-dzial-III-nadzorca-zarzadca` | ✅ aktywny |
| PrRestr — uczestnicy / wierzyciele | jw. | `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele` | ✅ aktywny |
| PrRestr — pomoc publiczna | jw. | `mod-PrRestr-dzial-V-pomoc-publiczna` | ✅ aktywny |
| Pomoc publiczna na ratowanie / restrukturyzację | Dz.U. 2026 poz. 113 t.j. ze zm. | `mod-ustawa-pomoc-ratowanie-restrukturyzacja-przedsiebiorcow` | ✅ aktywny |
| Doradca restrukturyzacyjny | Dz.U. 2022 poz. 1007 t.j. ze zm. | `mod-ustawa-doradca-restrukturyzacyjny-zawod` | ✅ aktywny |

### Konsument, nieruchomości, spółdzielczość i instrumenty

| Akt / zakres | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| Prawa konsumenta | Dz.U. 2024 poz. 1796 t.j. ze zm. | `mod-ustawa-prawa-konsumenta` | 🟢 B+/COV |
| UOKiK | Dz.U. 2025 poz. 1714 t.j. ze zm. | `mod-ustawa-UOKIK-antymonopolowe` | 🟢 B+/COV |
| Kredyt konsumencki / SKD | Dz.U. 2025 poz. 1362 t.j. ze zm. | `mod-ustawa-kredyt-konsumencki-SKD` | ✅ aktywny; fresh gate |
| Parabanki / lombardy / lichwa | KC/KK + ustawa lombardowa Dz.U. 2024 poz. 1111 t.j. ze zm. + akty szczególne | `mod-parabanki-chwilowki-lombardy-lichwa.md` | ✅ aktywny; fresh gate |
| Reklama wobec nieletnich | UPNPR Dz.U. 2023 poz. 845 t.j. + ustawa o radiofonii i telewizji Dz.U. 2022 poz. 1722 t.j. ze zm. | `mod-reklama-wobec-nieletnich` | ✅ aktywny; fresh gate |
| Ochrona praw lokatorów | Dz.U. 2023 poz. 725 t.j. ze zm. | `mod-ustawa-ochrona-praw-lokatorow-najem-eksmisja` | 🟢 B+/COV |
| Własność lokali | Dz.U. 2026 poz. 232 t.j. ze zm. | `mod-ustawa-spoldzielnie-wlasnosc-lokali` | 🟢 B+/COV |
| Księgi wieczyste i hipoteka | Dz.U. 2026 poz. 1066 t.j. ze zm. | `mod-KW-ksiega-wieczysta-zakup-nieruchomosci` | 🟢 B+/COV |
| Prawo spółdzielcze | Dz.U. 2026 poz. 521 t.j. ze zm. | `mod-prawo-spoldzielcze` | 🟢 B+/COV |
| Spółdzielnie mieszkaniowe | Dz.U. 2026 poz. 889 t.j. ze zm. | `mod-ustawa-spoldzielnie-mieszkaniowe` | 🟢 B+/COV |
| Fundacje / stowarzyszenia | właściwe aktualne ustawy | `mod-ustawa-fundacje-stowarzyszenia` | 🟢 B+/COV; fresh gate |
| Fundacja rodzinna | Dz.U. 2023 poz. 326 ze zm. | `mod-ustawa-fundacja-rodzinna` | 🟢 B+/COV |
| Prawo wekslowe + Prawo czekowe | Dz.U. 2022 poz. 282 t.j. + Dz.U. 2016 poz. 462 t.j. | `mod-prawo-wekslowe-czekowe` | 🟢 B+/COV |
| Timeshare + zastaw rejestrowy | ustawa o timeshare: Dz.U. 2011 nr 230 poz. 1370 ze zm.; zastaw: Dz.U. 2018 poz. 2017 t.j. ze zm. | `mod-ustawa-timeshare-zastaw-rejestrowy` + `mod-ustawa-zastaw-rejestrowy` | ✅ aktywny / B+/COV |
| Ubezpieczenia obowiązkowe / UFG / PBUK | Dz.U. 2026 poz. 783 t.j. ze zm. | `mod-ustawa-ubezpieczenia-obowiazkowe-UFG-PBUK` | 🟢 B+/COV |
| Monopole państwowe | Konstytucja + właściwe ustawy sektorowe, w tym hazard/poczta | `mod-ustawa-monopole-panstwowe` | ✅ aktywny; temporal gate |
| Transakcje handlowe / opóźnienia | Dz.U. 2023 poz. 1790 t.j. ze zm. | `mod-transakcje-handlowe-opoznienia` | 🟡 B |
| Cudzoziemcy — routing gospodarczy/cywilny | Dz.U. 2025 poz. 1079 t.j. ze zm. | `mod-ustawa-cudzoziemcy` | 🔗 routing DR-05 |
| Ustawa frankowa 2026 — procedura | Dz.U. 2026 poz. 985 | `mod-ustawa-frankowa-2026-procedura.md` | ✅ aktywny; fresh gate |

## Reguły runtime

- każdy fizyczny moduł DR-02 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`;
- mapy nie przechowują dawnych metryk, opisów napraw, `NOWY/ZAMKNIĘTE/NAPRAWIONE`, raportów pokrycia ani historii sesji;
- przy KSH, restrukturyzacji, konsumentach, instrumentach finansowych i regulacjach dynamicznych obowiązuje fresh/temporal gate;
- `COV` oznacza aktualną strukturę/routing, nie `FULL` artykuł-po-artykule.
