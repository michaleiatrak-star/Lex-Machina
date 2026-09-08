# Audyt pokrycia KPC w systemie skilli — mapa jednostek redakcyjnych
**Data audytu:** 13.08.2026  
**Zakres:** wszystkie skille w `/mnt/skills/user`  
**Akt odniesienia:** ustawa z 17.11.1964 — Kodeks postępowania cywilnego, **Dz.U. 2026 poz. 468 t.j.** (stan prawny na 13.08.2026)
**Metoda:** identyczna jak w audycie KPK — ekstrakcja wszystkich odwołań `art. N […] KPC / k.p.c.`, mapowanie na jednostki redakcyjne wg struktury zweryfikowanej online, następnie ocena jakościowa modułu źródłowego. Granulacja: dział albo rozdział/oddział tam, gdzie dział jest zbyt pojemny (Dowody, Orzeczenia, Środki odwoławcze).
## Legenda

| Symbol | Znaczenie |
|---|---|
| 🟢 PEŁNE | Instytucja obsłużona systemowo — przesłanki + tryb + zaskarżenie. Gwiazdka = pełne funkcjonalnie, z drobnymi brakami |
| 🟡 CZĘŚCIOWE | Pojedyncze artykuły użyte zadaniowo; brak systematyki jednostki |
| 🔴 BRAK | Zero odwołań merytorycznych |
| ⚪ N/D | Jednostka uchylona |
## Podsumowanie ilościowe
| Status | Jednostek | Udział (obowiązujące) |
|---|---|---|
| 🟢 PEŁNE | 22 | 22% |
| 🟡 CZĘŚCIOWE | 43 | 42% |
| 🔴 BRAK | 37 | 36% |
| ⚪ N/D | 4 | — |
| **RAZEM** | **106** | **102 obowiązujących** |
Zidentyfikowano **197 różnych artykułów KPC** przywołanych w systemie, na ok. 1 200 jednostek artykułowych kodeksu (**ok. 16%**).

### Porównanie z KPK

| | KPK | KPC |
|---|---|---|
| Artykułów przywołanych | 81 | **197** |
| 🟢 PEŁNE | 2% jednostek | **19%** |
| 🟡 CZĘŚCIOWE | 41% | **38%** |
| 🔴 BRAK | 56% | **42%** |
| Metryka t.j. | nieaktualna (brak poz. 421 i 638) | **aktualna** (poz. 468) |

KPC jest pokryty istotnie lepiej niż KPK — system był budowany wokół procesu cywilnego.

---

## Mapa jednostek redakcyjnych

### Tytuł wstępny

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| — | Przepisy ogólne | 1–14 | 🟡 CZĘŚCIOWE | 3, 5, 7, 9 | MOD-OBAL; mod-ustawa-skargi-przewleklosc; M6-oplaty | Zasada prawdy i dobrych obyczajów (3), pouczenia (5), jawność (9). Brak art. 1 (sprawa cywilna), 2 (droga sądowa), 6 (koncentracja), 13 §2 (odpowiednie stosowanie) |

### Ks. I Proces / Tyt. I Sąd

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. I Rozdz. 1 | Właściwość rzeczowa | 16–26 | 🟢 PEŁNE* | 16, 17, 19, 24 | shared/WLASCIWOSC-GATE; MOD-WALIDACJA_v2 | Podstawy właściwości i w.p.s. obsłużone bramką walidacyjną. Brak art. 20–23 (szczegóły w.p.s.), 25–26 |
| Dz. I Rozdz. 2 | Właściwość miejscowa | 27–46 | 🟢 PEŁNE | 27, 30, 33, 37, 38, 42, 46 | shared/WLASCIWOSC-GATE; ORKA-BAS-LEKSYKON; MOD-SZABLONY | Wszystkie cztery oddziały (ogólna, przemienna, wyłączna, przepisy szczególne) reprezentowane |
| Dz. II | Skład sądu | 47–47² | 🟢 PEŁNE | 47 | mod-sklad-sadu-liczba-sedziow (DR-02) | Dedykowany moduł; dział liczy 2 artykuły |
| Dz. III | Wyłączenie sędziego | 48–54 | 🟡 CZĘŚCIOWE | 48, 49 | shared/DEF-INTERES-WLASNY-WYLACZENIA | Iudex inhabilis (48) i suspectus (49) pokryte. Brak art. 50 (tryb wniosku), 51, 52 (rozpoznanie), 53¹ (nadużycie), 54 (referendarz) |

### Ks. I Proces

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Tyt. II | Prokurator | 55–60 | 🔴 BRAK | — | — | Cały tytuł — udział prokuratora w procesie cywilnym |
| Tyt. III | Organizacje pozarządowe | 61–63 | 🔴 BRAK | — | — | Cały tytuł — wytaczanie powództw przez NGO i przystępowanie do sprawy |
| Tyt. IIIa | Państwowa Inspekcja Pracy | 63¹–63² | 🟢 PEŁNE | 63¹, 63² | mod-ustawa-PIP-inspekcja-pracy (DR-04) | Oba artykuły tytułu |
| Tyt. IIIb | Rzecznik Praw Konsumentów | 63³–63⁴ | 🔴 BRAK | — | — | Cały tytuł |
| Tyt. IIIc | Podmioty uprawnione (przepisy odrębne) | 63⁵ | 🔴 BRAK | — | — | Brak |

### Ks. I Proces / Tyt. IV Strony

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. I | Zdolność sądowa i procesowa | 64–71 | 🟡 CZĘŚCIOWE | 65 | shared/mod-niepelnosprawnosc-intelektualna-gluchota | Tylko zdolność procesowa w kontekście niepełnosprawności. Brak art. 64 (zdolność sądowa), 66–68 (przedstawiciel), 70–71 (braki zdolności) |
| Dz. II | Współuczestnictwo w sporze | 72–74 | 🔴 BRAK | — | — | Cały dział — współuczestnictwo materialne, formalne, konieczne, jednolite |
| Dz. III | Interwencja główna i uboczna | 75–83 | 🟡 CZĘŚCIOWE | 75, 76 | shared/NAZEWNICTWO-STRON | Tylko definicje ról. Brak art. 77–83 (zgłoszenie interwencji, opozycja, skutki) |
| Dz. IV | Przypozwanie | 84–85 | 🔴 BRAK | — | — | Cały dział — istotny w sprawach regresowych |
| Dz. V | Pełnomocnicy procesowi | 86–97 | 🟢 PEŁNE* | 87, 88, 91, 97 | mod-liczba-pelnomocnikow-strona-samodzielna (DR-02); shared/mod-niewidomy-prawa-prawne | Krąg pełnomocników, forma i zakres pełnomocnictwa, czynności bez umocowania. Brak art. 89 (dołączenie pełnomocnictwa), 94 (wypowiedzenie) |

### Ks. I Proces / Tyt. V Koszty

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. I | Zwrot kosztów procesu | 98–110 | 🟡 CZĘŚCIOWE | 98, 110 | MP10-koszty | Zasada odpowiedzialności za wynik (98). Brak art. 100 (stosunkowe rozdzielenie), 101–103 (zwrot mimo wygranej, nielojalność), 105 (współuczestnicy), 108 (rozstrzygnięcie) |
| Dz. II | Pomoc prawna z urzędu | 111–124 | 🟡 CZĘŚCIOWE | 117 | ORKA-BAS-LEKSYKON; ROUTING-MAP | Ustanowienie pełnomocnika z urzędu (117). Zwolnienie od kosztów obsługiwane głównie przez KSCU, nie KPC. Brak art. 118–124 |

### Ks. I / Tyt. VI Dz. I

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Rozdz. 1 | Pisma procesowe | 125–130⁵ | 🟢 PEŁNE | 126, 127, 128, 129, 130 | shared/FORMAL-CHECK; MOD-WALIDACJA_v2; mod-KPC-wzory-pism-procesowych | Wymogi formalne, treść, odpisy, braki formalne — rdzeń obsłużony systemowo |
| Rozdz. 2 | Doręczenia | 131–147 | 🟡 CZĘŚCIOWE | 139 | SPA-sprzeciw; mod-KPC-e-doreczenia-portal-sadowy | Fikcja doręczenia (139) pokryta; e-doręczenia mają własny moduł. Brak art. 131¹ (doręczenia elektroniczne w KPC), 132 (doręczenia między pełnomocnikami), 133–138, 143–144 (kurator dla nieznanego z miejsca pobytu) |
| Rozdz. 3 | Posiedzenia sądowe | 148–163 | 🟡 CZĘŚCIOWE | 157 | shared/mod-osoba-niewidoma-prawa-sad | Tylko protokół. Brak art. 148¹ (posiedzenie niejawne), 151 (posiedzenie zdalne), 152–154 (jawność), 158 (treść protokołu), 162 (zastrzeżenie do protokołu — krytyczne dla apelacji) |
| Rozdz. 4 | Terminy | 164–166 | 🟡 CZĘŚCIOWE | 165 | shared/TERM-CALC; MAPA-AKTOW | Obliczanie terminu i nadanie w placówce (165). Brak art. 164, 166 |
| Rozdz. 5 | Uchybienie i przywrócenie terminu | 167–172 | 🟢 PEŁNE | 168, 169, 170, 172 | M1-zasady; MOD-OPLATY; MP12-terminy; pisma-proste-v2 | Przesłanki, wniosek, termin tygodniowy, skutki — obsłużone łącznie z szablonem pisma |
| Rozdz. 6 | Zawieszenie postępowania | 173–183 | 🟡 CZĘŚCIOWE | 177 | mod-TFUE-TUE-prawo-pierwotne-UE | Tylko zawieszenie fakultatywne w kontekście pytania prejudycjalnego. Brak art. 174 (zawieszenie z urzędu), 179–180 (podjęcie), 182 (umorzenie po zawieszeniu), 182¹ |

### Ks. I / Tyt. VI Dz. II

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Rozdz. 1 | Mediacja i postępowanie pojednawcze | 183¹–186 | 🟡 CZĘŚCIOWE | 183³, 183⁴, 183⁸, 185 | mod-KRO-rodzinne; SPI-zawezwanie; mod-KPC-arbitraz-mediacja-ADR | Mediacja i zawezwanie do próby ugodowej (185) obsłużone, to drugie z szablonem. Brak art. 183¹, 183², 183¹²–183¹⁵ (ugoda przed mediatorem i jej zatwierdzenie), 186 |
| Rozdz. 2 | Pozew | 186¹–205 | 🟢 PEŁNE* | 187, 189, 193, 194, 200, 203 | shared/FORMAL-CHECK; MOD-DOWODY; MOD-PRACODAWCA-RZECZYWISTY; MOD-ATAK-NA-DRAFT | Wymogi pozwu, powództwo o ustalenie, zmiana powództwa, przekazanie sprawy, cofnięcie pozwu. Brak art. 191 (kumulacja roszczeń), 192 (skutki zawisłości), 199 (odrzucenie pozwu) — luka istotna |
| Rozdz. 2a | Organizacja postępowania | 205¹–205¹² | 🔴 BRAK | — | — | Cały rozdział — odpowiedź na pozew (205¹), posiedzenie przygotowawcze i plan rozprawy (205⁵–205¹¹), prekluzja twierdzeń (205³). LUKA KRYTYCZNA — to rdzeń reformy KPC z 2019 r. |
| Rozdz. 3 | Rozprawa | 206–226² | 🟡 CZĘŚCIOWE | 207, 210, 212, 217, 224 | MOD-TIMING; MD5-terminy; MOD-IDENTYFIKACJA-STRONY-UMOWY | Przebieg rozprawy i pouczenia częściowo. Brak art. 206¹, 214 (odroczenie), 214¹, 216 (wysłuchanie informacyjne), 226² (nadużycie prawa procesowego) |

### Ks. I / Tyt. VI Dz. III Dowody

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Rozdz. 1 | Przedmiot i ocena dowodów | 227–234 | 🟢 PEŁNE | 227, 229, 230, 231, 232, 233, 234 | MOD-ATAK-NA-DOWOD; MOD-NEGACJA-DOWODOW; MOD-KARTA-DOWODU; MOD-LANCUCH-DOWODOWY; analizator-dowodow-v3 | Komplet rozdziału. Art. 233 §1 to najczęściej cytowany przepis w całym systemie (20 plików) |

### Ks. I / Tyt. VI Dz. III / Rozdz. 2

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Oddz. 1 | Postępowanie dowodowe — przepisy ogólne | 235–243 | 🟡 CZĘŚCIOWE | 235, 243 | shared/mod-niewidomy-prawa-prawne; CHECKLIST-DEDUP | Brak art. 235² (pominięcie dowodu — kluczowe po reformie 2019), 236 (postanowienie dowodowe), 242¹ (dyscyplinowanie) |
| Oddz. 2 | Dokumenty | 243¹–257 | 🟢 PEŁNE | 244, 245, 246, 247, 248, 253, 256 | MOD-ATAK-NA-DOWOD; MOD-DOKUMENT-ANOMALIE; MD3a/MD3b-walidacja; ORKA-BAS-LEKSYKON | Dokument urzędowy/prywatny, domniemania, obowiązek przedłożenia, zaprzeczenie prawdziwości — komplet operacyjny |
| Oddz. 3 | Zeznania świadków | 258–277 | 🟢 PEŁNE | 258, 259, 261, 263, 266, 271, 272, 276 | MOD-ATAK-NA-SWIADKA; shared/PRAWO-HARDGATE-WITNESS; shared/CROSS-EXAMINATION-GATE; przesluchanie-swiadkow-v2 | Zdolność świadka, wyłączenia, prawo odmowy, przyrzeczenie, konfrontacja, kary porządkowe. Brak art. 271¹ (zeznania na piśmie) — warto uzupełnić |
| Oddz. 4 | Opinia biegłych | 278–291 | 🟢 PEŁNE | 278, 281, 286, 291 | mod-KPC-biegli-sadowi-opinie (DR-12) | Dopuszczenie, wyłączenie biegłego, opinia dodatkowa, instytut naukowy — dedykowany moduł |
| Oddz. 5 | Oględziny | 292–298 | 🔴 BRAK | — | — | Cały oddział |
| Oddz. 6 | Przesłuchanie stron | 299–304 | 🟡 CZĘŚCIOWE | 299, 303, 304 | MOD-NEGACJA-DOWODOW; DEF-INTERES-WLASNY-WYLACZENIA | Subsydiarność dowodu z przesłuchania. Brak art. 300–302 |
| Oddz. 7 | Inne środki dowodowe | 305–309 | 🟡 CZĘŚCIOWE | 305, 308, 309 | MP11-rodo-cyber; ORKA-BAS-LEKSYKON | Nagrania i inne nośniki (308), środki nienazwane (309). Brak art. 306–307 (grupa krwi, opinia instytutu) |

### Ks. I / Tyt. VI Dz. III

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Rozdz. 3 | Zabezpieczenie dowodów | 310–315 | 🟡 CZĘŚCIOWE | 310, 315 | MOD-NEGACJA-DOWODOW | Brak art. 311–314 (właściwość, wniosek, tryb) |

### Ks. I / Tyt. VI Dz. IV / Rozdz. 1

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Oddz. 1 | Wydanie wyroku | 316–332 | 🟡 CZĘŚCIOWE | 321, 322, 327, 328 | MOD-SKUTEK-PROCESOWY; MD5-terminy; SPF-SPG | Zakaz orzekania ponad żądanie (321), zasądzenie wg oceny sądu (322), uzasadnienie na wniosek (327). BRAK art. 316 §1 (stan rzeczy z chwili zamknięcia rozprawy) — luka poważna, oraz 325 (sentencja), 331, 332 |
| Oddz. 2 | Natychmiastowa wykonalność wyroków | 333–338 | 🔴 BRAK | — | — | Cały oddział — rygor natychmiastowej wykonalności to standardowy wniosek w pozwie |
| Oddz. 3 | Wyroki zaoczne | 339–349 | 🟡 CZĘŚCIOWE | 343, 344 | SPF-SPG | Sprzeciw od wyroku zaocznego obsłużony proceduralnie. BRAK art. 339 (przesłanki wydania wyroku zaocznego) i 340–342 |
| Oddz. 4 | Sprostowanie, uzupełnienie i wykładnia wyroków | 350–353 | 🔴 BRAK | — | — | Cały oddział — art. 350 (sprostowanie omyłek), 351 (uzupełnienie wyroku), 352 (wykładnia). LUKA DOTKLIWA: to trzy najczęstsze wnioski poorzeczeniowe |

### Ks. I / Tyt. VI Dz. IV

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Rozdz. 1a | Nakazy zapłaty | 353¹–353² | 🔴 BRAK | — | — | Przepisy wspólne o nakazach zapłaty (mimo że Dział V Tytułu VII jest pokryty w pełni) |
| Rozdz. 2 | Postanowienia sądu | 354–362¹ | 🟡 CZĘŚCIOWE | 357 | mod-liczba-pelnomocnikow-strona-samodzielna | Brak art. 354–356, 359 (zmiana postanowień), 361 (odpowiednie stosowanie przepisów o wyrokach) |
| Rozdz. 3 | Prawomocność orzeczeń | 363–366 | 🔴 BRAK | — | — | Cały rozdział. BRAK art. 365 (moc wiążąca) i 366 (powaga rzeczy osądzonej) — LUKA KRYTYCZNA, to podstawa zarzutu res iudicata i prejudycjalności |

### Ks. I / Tyt. VI Dz. V

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Rozdz. 1 | Apelacja | 367–391¹ | 🟡 CZĘŚCIOWE | 367, 368, 369, 370, 373, 379, 380, 381 | shared/FORMAL-CHECK; MD5-terminy; MOD-SZABLONY; MOD-ATAK-NA-DRAFT | Dopuszczalność, wymogi formalne, termin, odrzucenie, nieważność postępowania (379), nowe fakty (381). BRAK art. 378 (granice apelacji), 382 (podstawa orzekania), 383 (zakaz rozszerzania żądania), 384 (zakaz reformationis in peius), 385–386 (rodzaje rozstrzygnięć) — luka bardzo poważna |
| Rozdz. 1¹ | (uchylony) | 392–393²⁰ | ⚪ N/D (uchylony) | — | — | Rozdział uchylony (kasacja w dawnym kształcie) |
| Rozdz. 2 | Zażalenie | 394–398 | 🟡 CZĘŚCIOWE | 394, 397 | MOD-OPLATY; MD5-terminy; mod-sklad-sadu-liczba-sedziow | Katalog zaskarżalnych postanowień i tryb rozpoznania. Brak art. 394¹ (zażalenie do SN), 394² (zażalenie poziome), 395, 396 |

### Ks. I / Tyt. VI

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. Va | Skarga kasacyjna | 398¹–398²¹ | 🟡 CZĘŚCIOWE | 398¹, 398⁵ | mod-ustawa-RPD; MOD-OPLATY | Dopuszczalność i wymogi tylko sygnalnie. Brak art. 398³ (podstawy kasacyjne), 398⁴ (wartość przedmiotu zaskarżenia), 398⁹ (przedsąd) — luka poważna przy kwalifikowaniu sprawy do SN |
| Dz. Vb | Skarga na orzeczenie referendarza | 398²²–398²⁴ | 🔴 BRAK | — | pisma-proste-v2 (zapowiedź w opisie skilla) | Skill `pisma-proste-v2` deklaruje w opisie obsługę „sprzeciwu od referendarza”, ale przepis podstawy nie występuje w żadnym module — deklaracja bez pokrycia |
| Dz. VI | Wznowienie postępowania | 399–416¹ | 🟡 CZĘŚCIOWE | 407, 408 | MP12-terminy | Wyłącznie terminy (3 mies. / 10 lat). BRAK art. 399, 401 (nieważność), 401¹ (wyrok TK), 403 (inne podstawy), 410 (badanie dopuszczalności) — luka poważna |
| Dz. VII | (uchylony) | 417–424 | ⚪ N/D (uchylony) | — | — | Dział uchylony |
| Dz. VIII | Skarga o stwierdzenie niezgodności z prawem | 424¹–424¹² | 🔴 BRAK | — | — | Cały dział — podstawa roszczeń odszkodowawczych wobec Skarbu Państwa (art. 417¹ KC) |

### Ks. I / Tyt. VII Odrębne

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. I | Sprawy małżeńskie | 425–452 | 🟡 CZĘŚCIOWE | 436 | mod-KRO-rodzinne (DR-02) | Tylko mediacja rozwodowa. BRAK art. 425–435 (przepisy ogólne), 441–446 (wyrok rozwodowy, wina, władza rodzicielska, alimenty, mieszkanie) — luka dotkliwa przy prawie rodzinnym |
| Dz. II | Stosunki między rodzicami a dziećmi | 453–458 | 🔴 BRAK | — | — | Cały dział — ustalenie i zaprzeczenie pochodzenia dziecka |
| Dz. IIa | Postępowanie w sprawach gospodarczych | 458¹–458¹³ | 🔴 BRAK | — | — | Cały dział. LUKA KRYTYCZNA: prekluzja dowodowa (458⁵), ograniczenie dowodu ze świadków (458¹⁰), umowa dowodowa (458⁹) — reżim odmienny od zwykłego procesu, a system obsługuje sprawy gospodarcze materialnie |
| Dz. IIb | Postępowanie z udziałem konsumentów | 458¹⁴–458¹⁶ | 🔴 BRAK | — | — | Cały dział (obowiązuje od 1.07.2023). LUKA ISTOTNA: system pokrywa klauzule abuzywne i sankcję kredytu darmowego materialnie, ale nie zna odrębnego reżimu procesowego dla konsumenta |
| Dz. III | Prawo pracy i ubezpieczeń społecznych | 459–477¹⁶ | 🟡 CZĘŚCIOWE | 461, 474 | shared/ZAWIADOMIENIA-KRZYZOWE; MOD-WALIDACJA_v2; MOD-SZABLONY | Właściwość przemienna w sprawach pracowniczych (461). BRAK art. 477¹ (pouczenia), 477⁹ (odwołanie od decyzji ZUS i termin), 477¹⁴ (rodzaje wyroków w sprawach ZUS) — luka bardzo dotkliwa wobec rozbudowanego DR-04 |
| Dz. IV | Naruszenie posiadania | 478–479 | 🔴 BRAK | — | — | Cały dział — kognicja ograniczona do ostatniego stanu posiadania |
| Dz. IVa–IVf | Ochrona konkurencji, energetyka, komunikacja, kolej, wod-kan | 479¹–479¹²⁹ | 🔴 BRAK | — | — | Wszystkie działy sektorowe (odwołania od decyzji UOKiK, URE, UKE, UTK, Wód Polskich) |
| Dz. IVg | Własność intelektualna | 479⁸⁹–479¹²⁹ | 🔴 BRAK | — | — | Cały dział — sądy własności intelektualnej, zabezpieczenie środka dowodowego, wyjawienie środka dowodowego, wezwanie do udzielenia informacji. Luka istotna wobec modułów IP w DR-11 |
| Dz. V | Postępowanie nakazowe i upominawcze | 480–505 | 🟢 PEŁNE | 484, 484¹, 485, 491, 492, 493, 495, 497¹, 502, 503, 505 | pisma-proste-v2 (SPB-zarzuty); mod-KPC-egzekucja-windykacja; MOD-OPLATY; MP12-terminy | Najlepiej pokryty fragment KPC. Podstawy nakazu, zarzuty, sprzeciw, terminy i skutki — z gotowymi szablonami pism |
| Dz. VI | Postępowanie uproszczone | 505¹–505¹⁴ | 🔴 BRAK | — | — | Cały dział — formularze, ograniczenia dowodowe, apelacja uproszczona |
| Dz. VII | Europejskie postępowania transgraniczne | 505¹⁵–505²⁷ | 🔴 BRAK | — | — | Europejski nakaz zapłaty i europejskie postępowanie w sprawie drobnych roszczeń |
| Dz. VIII | Postępowania elektroniczne (EPU) | 505²⁸–505³⁹ | 🔴 BRAK | wzmianka | — | Elektroniczne postępowanie upominawcze — tylko wzmianka nazwy, bez przepisów |

### Ks. II Nieprocesowe

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Tyt. I | Przepisy ogólne | 506–525 | 🟡 CZĘŚCIOWE | 510, 511, 525 | shared/NAZEWNICTWO-STRON; SPH-inne | Pojęcie zainteresowanego (510). BRAK art. 506–509 (wszczęcie, właściwość), 514, 518 (apelacja w nieprocesie), 519¹ (skarga kasacyjna), 523 (zmiana prawomocnego postanowienia) — luka systemowa dla całej Księgi II |

### Ks. II / Tyt. II

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. I | Sprawy z zakresu prawa osobowego | 526–560¹ | 🟡 CZĘŚCIOWE | 544, 558, 560 | mod-ubezwlasnowolnienie-opieka-kuratela; shared/mod-niepelnosprawnosc-intelektualna-gluchota | Ubezwłasnowolnienie obsłużone przyzwoicie (właściwość SO, zaskarżanie). Brak art. 526–543 (uznanie za zmarłego, stwierdzenie zgonu), 545–557 (krąg wnioskodawców, wysłuchanie, biegli) |
| Dz. Ia | Przeciwdziałanie przemocy domowej | 560²–560¹² | 🔴 BRAK | — | — | Cały dział. Uwaga: system pokrywa przemoc domową bardzo dobrze materialnie (art. 207 KK, ustawa antyprzemocowa, art. 755 §1 pkt 3 KPC), ale nie zna odrębnej procedury nieprocesowej z tego działu |
| Dz. II | Prawo rodzinne, opiekuńcze i kuratela | 561–605 | 🟡 CZĘŚCIOWE | 585, 598 | mod-KRO-przysposobienie-adopcja-miedzynarodowa; mod-KRO-rodzinne | Sprawy opiekuńcze punktowo. Brak art. 561–567⁵ (sprawy małżeńskie nieprocesowe), 568–578² (przepisy ogólne opiekuńcze), 598¹–598¹⁴ (odebranie osoby), 598¹⁵–598²² (wykonywanie kontaktów) — ten ostatni blok to bardzo częsta sprawa praktyczna |
| Dz. III | Prawo rzeczowe | 606–626¹³ | 🟡 CZĘŚCIOWE | 609, 610 | mod-KC-cywilne-zobowiazania-odpowiedzialnosc; ORKA-BAS-LEKSYKON | Tylko zasiedzenie. BRAK art. 611–616 (zarząd współwłasnością), 617–625 (zniesienie współwłasności), 626 (droga konieczna, służebność przesyłu), 626¹–626¹³ (postępowanie wieczystoksięgowe) — luka dotkliwa |
| Dz. IV | Prawo spadkowe | 627–691¹¹ | 🟡 CZĘŚCIOWE | 637, 641 | mod-KC-spadki (DR-02) | Zabezpieczenie spadku i odrzucenie spadku punktowo. BRAK art. 669–679² (stwierdzenie nabycia spadku), 680–689 (dział spadku) — to dwie najczęstsze sprawy spadkowe w praktyce |
| Dz. IVa–IVb | Przedsiębiorstwa państwowe; sprawy z zakresu prawa pracy | 691¹–691¹¹ | 🔴 BRAK | — | — | Brak |
| Dz. V | Sprawy depozytowe | 692–693¹⁷ | 🔴 BRAK | — | — | Cały dział — złożenie do depozytu sądowego (mimo że art. 467 KC bywa przywoływany materialnie) |
| Dz. VI | Postępowanie rejestrowe | 694¹–694⁸ | 🔴 BRAK | — | — | Cały dział — wpisy do KRS w trybie rejestrowym |

### Ks. III

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| — | (uchylona) | 695–715 | ⚪ N/D (uchylony) | — | — | Księga uchylona |

### Ks. IV

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| — | Postępowanie w razie zaginięcia lub zniszczenia akt | 716–729 | 🟢 PEŁNE | 716, 718, 729 | mod-KPC-odtworzenie-akt-zaginionych-zniszczonych (DR-16) | Dedykowany moduł obejmujący całą księgę |

### Cz. II Zabezpieczające

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Tyt. I | Przepisy ogólne | 730–746 | 🟢 PEŁNE* | 730, 730¹, 731, 733, 736, 737 | pisma-proste-v2 (SPF-SPG); mod-KPC-egzekucja-windykacja; MP12-terminy | Interes prawny, uprawdopodobnienie, wniosek, termin na wytoczenie powództwa — z szablonem. Brak art. 738 (rozpoznanie na posiedzeniu niejawnym), 741 (zażalenie), 742 (uchylenie zabezpieczenia), 745–746 (koszty i odszkodowanie) |
| Tyt. II | Zabezpieczenie roszczeń pieniężnych | 747–754¹ | 🟡 CZĘŚCIOWE | 747, 753 | pisma-proste-v2 (SPF-SPG); mod-KRO-rodzinne | Katalog sposobów (747) i zabezpieczenie alimentów (753). Brak art. 748–752, 754¹ (upadek zabezpieczenia) |
| Tyt. III | Inne wypadki zabezpieczenia | 755–757 | 🟢 PEŁNE* | 755, 757 | STALKING-NEKANIE; mod-KK-art207-przemoc-domowa; mod-KPC-egzekucja-windykacja | Zabezpieczenie niepieniężne, w tym zakaz zbliżania i nakaz opuszczenia lokalu |

### Cz. III Egzekucyjne / Tyt. I

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. I | Organy egzekucyjne i postępowanie w ogólności | 758–775¹ | 🟢 PEŁNE* | 759, 761, 767 | pisma-proste-v2 (SPL-skarga-komornik); shared/NAZEWNICTWO-STRON | Skarga na czynności komornika (767) z pełnym szablonem i terminem. Brak art. 758 (organy), 763 (zawiadomienia), 770 (koszty egzekucji) |
| Dz. II | Tytuły egzekucyjne i klauzula wykonalności | 776–795 | 🟢 PEŁNE | 776, 777, 781, 782, 786, 787, 788, 795 | pisma-proste-v2 (SPC-SPD-SPE); mod-KPC-egzekucja-windykacja; mod-ustawa-notariat | Komplet operacyjny: tytuł wykonawczy, katalog tytułów egzekucyjnych, właściwość, klauzula przeciw małżonkowi, następstwo prawne, zażalenie |
| Dz. IIa–IIf | Zaświadczenia europejskie (ETE, ENZ, drobne roszczenia, alimenty, środki ochrony) | 795¹–795¹⁷ | 🔴 BRAK | — | mod-KPC-egzekucja-transgraniczna-UE (bez numerów artykułów) | Moduł transgraniczny operuje rozporządzeniami UE, ale nie przywołuje krajowych przepisów wykonawczych z tych działów |
| Dz. III | Wszczęcie egzekucji i dalsze czynności | 796–817 | 🟢 PEŁNE* | 796, 797, 799, 801, 805 | pisma-proste-v2 (SPC-SPD-SPE); SPL-skarga-komornik | Wniosek egzekucyjny, sposoby egzekucji, wyjawienie majątku przez dłużnika, zawiadomienie. Brak art. 804 (zakaz badania zasadności obowiązku) — przepis kluczowy dla obrony dłużnika |
| Dz. IV | Zawieszenie i umorzenie postępowania | 818–828 | 🟡 CZĘŚCIOWE | 820 | mod-KPC-egzekucja-windykacja | Zawieszenie na wniosek (820). BRAK art. 824 (umorzenie z urzędu), 825 (umorzenie na wniosek), 826 (skutki umorzenia) — luka dotkliwa |
| Dz. V | Ograniczenia egzekucji | 829–839 | 🔴 BRAK | — | — | Cały dział. LUKA KRYTYCZNA: art. 829 (rzeczy wyłączone spod egzekucji) i 833 (ograniczenia egzekucji z wynagrodzenia i świadczeń) to podstawowa linia obrony dłużnika — system obsługuje egzekucję z wynagrodzenia (art. 880–888), ale nie zna jej ograniczeń |
| Dz. VI | Powództwo przeciwegzekucyjne | 840–843 | 🟢 PEŁNE | 840, 841 | mod-KPC-egzekucja-windykacja; mod-PrNotariat-notariat-rejestry | Powództwo opozycyjne i ekscydencyjne — oba z opisem przesłanek |

### Cz. III Egzekucyjne / Tyt. II

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. I | Egzekucja z ruchomości | 844–879¹¹ | 🟡 CZĘŚCIOWE | 844, 871, 879 | mod-KPC-egzekucja-windykacja | Zajęcie i sprzedaż sygnalnie. Brak art. 845 (przedmiot zajęcia), 864–870 (licytacja), 879¹–879¹¹ (licytacja elektroniczna) |
| Dz. II | Egzekucja z wynagrodzenia za pracę | 880–888 | 🟡 CZĘŚCIOWE | 880, 888 | mod-KPC-egzekucja-windykacja | Zajęcie i obowiązki pracodawcy. Brak art. 881–887 — a przede wszystkim brak powiązania z art. 833 (kwota wolna) |
| Dz. III | Egzekucja z rachunków bankowych | 889–894 | 🟡 CZĘŚCIOWE | 889, 891³ | mod-KPC-egzekucja-windykacja; pisma-proste-v2 (SPC-SPD-SPE) | Zajęcie wierzytelności z rachunku i kwota wolna. Brak art. 890, 892–894 |
| Dz. IV–IVa | Egzekucja z innych wierzytelności i praw majątkowych | 895–912 | 🟡 CZĘŚCIOWE | 895, 902, 912 | mod-KPC-egzekucja-windykacja | Sygnalnie |
| Dz. V | Wyjawienie majątku | 913–920² | 🟡 CZĘŚCIOWE | 913 | mod-KRO-rodzinne | Tylko wzmianka (przez odesłanie z art. 554¹). Brak art. 914–920² (tryb, przymus, sankcje) |
| Dz. VI | Egzekucja z nieruchomości | 921–1013 | 🟡 CZĘŚCIOWE | 921, 1013 | mod-KPC-egzekucja-windykacja | Punkt wejścia i punkt wyjścia. Brak całej procedury pośredniej: opis i oszacowanie (942–951), obwieszczenie o licytacji (952–961), przybicie (987–997), przysądzenie własności (998–1003) |
| Dz. VIa–VII | Uproszczona egzekucja z nieruchomości; statki morskie | 1013¹–1022⁴ | 🔴 BRAK | — | — | Brak |
| Dz. VIII | Podział sumy uzyskanej z egzekucji | 1023–1040¹ | 🟡 CZĘŚCIOWE | 1025 | mod-KPC-egzekucja-windykacja | Kolejność zaspokojenia (1025) — przepis kluczowy przy zbiegu wierzycieli. Brak art. 1023, 1026–1040¹ (plan podziału, zarzuty) |

### Cz. III Egzekucyjne / Tyt. III

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. I | Egzekucja świadczeń niepieniężnych | 1041–1059 | 🔴 BRAK | — | — | Cały dział — art. 1046 (eksmisja), 1050 (czynność niezastępowalna), 1051 (zaniechanie/nieprzeszkadzanie). LUKA DOTKLIWA: to jedyny tryb wykonania wyroków nakazujących lub zakazujących |
| Dz. II–III | Skarb Państwa i przedsiębiorcy; zniesienie współwłasności przez sprzedaż | 1060–1071 | 🔴 BRAK | — | — | W tym zarząd przymusowy i sprzedaż przedsiębiorstwa (1064¹–1064¹³) |
| Dz. V | Egzekucja świadczeń alimentacyjnych | 1081–1088 | 🔴 BRAK | — | — | Cały dział. LUKA DOTKLIWA: system pokrywa art. 209 KK (niealimentacja) i alimenty materialnie w KRO, ale nie zna trybu ich egzekucji |

### Cz. III Egzekucyjne

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Dz. IV, VI | (uchylone) | 1072–1080; 1089–1095¹ | ⚪ N/D (uchylony) | — | — | Uchylone |

### Cz. IV Międzynarodowe

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Ks. I + Ia | Jurysdykcja krajowa; immunitet sądowy i egzekucyjny | 1097–1116 | 🔴 BRAK | — | — | Cała jurysdykcja krajowa (proces, nieproces, zabezpieczenie i egzekucja) oraz immunitety. Uwaga: DR-14 pokrywa rozporządzenie Bruksela I bis, ale nie krajowe przepisy jurysdykcyjne KPC |
| Ks. II | Postępowanie (zdolność, kaucja, pomoc prawna, dokumenty zagraniczne) | 1117–1144¹³ | 🔴 BRAK | — | — | W tym art. 1138 (zagraniczne dokumenty urzędowe) i Tytuł XI (europejski nakaz zabezpieczenia na rachunku bankowym) |
| Ks. III | Uznanie i stwierdzenie wykonalności orzeczeń państw obcych | 1145–1153¹² | 🟢 PEŁNE* | 1145, 1149, 1150, 1153 | mod-KPC-egzekucja-transgraniczna-UE (DR-02) | Uznanie z mocy prawa, przeszkody uznania, klauzula wykonalności dla orzeczeń zagranicznych |
| Ks. IV | Uznanie i wykonanie orzeczeń państw UE | 1153¹³–1153²⁵ | 🔴 BRAK | — | — | Krajowe przepisy wykonawcze do rozporządzeń UE — moduł transgraniczny operuje samymi rozporządzeniami |

### Cz. V Sąd polubowny

| Jedn. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| Tyt. I | Przepisy ogólne | 1154–1160 | 🟡 CZĘŚCIOWE | 1157 | mod-ustawa-arbitraz-mediacja | Zdatność arbitrażowa (1157). Brak art. 1154–1156, 1158–1160 |
| Tyt. II | Zapis na sąd polubowny | 1161–1168 | 🟡 CZĘŚCIOWE | 1162, 1164 | mod-ustawa-arbitraz-mediacja; analizator-umow-v1 | Forma zapisu (1162) i zapis w umowach konsumenckich. Brak art. 1161 §2–3, 1165 (zarzut zapisu), 1168 |
| Tyt. III | Skład sądu polubownego | 1169–1179 | 🟡 CZĘŚCIOWE | 1171 | SPH-inne (pisma-proste-v2) | Powołanie arbitra. Brak art. 1174 (wyłączenie arbitra), 1176–1179 |
| Tyt. IV–VI | Właściwość, postępowanie, wyrok sądu polubownego | 1180–1204 | 🔴 BRAK | — | — | Trzy tytuły bez pokrycia — w tym art. 1180 (kompetencja-kompetencja), 1196 (wyrok), 1197 (uzasadnienie) |
| Tyt. VII | Skarga o uchylenie wyroku sądu polubownego | 1205–1211 | 🟡 CZĘŚCIOWE | 1208 | mod-KPC-arbitraz-mediacja-ADR; mod-ustawa-arbitraz-mediacja | Termin na skargę (1208). BRAK art. 1206 (podstawy uchylenia, w tym klauzula porządku publicznego) — luka istotna |
| Tyt. VIII | Uznanie i stwierdzenie wykonalności wyroku arbitrażowego | 1212–1217 | 🟢 PEŁNE* | 1212, 1217 | mod-ustawa-arbitraz-mediacja | Tryb uznania i wykonalności wyroków krajowych i zagranicznych |

---

## Wnioski

### 1. Pokrycie idzie za pismami, nie za kodeksem
Tam, gdzie system ma gotowy szablon pisma, przepisy są pokryte w komplecie: postępowanie nakazowe i upominawcze (Dz. V Tyt. VII — 11 artykułów), tytuły egzekucyjne i klauzula wykonalności (Dz. II Cz. III — 8 artykułów), skarga na komornika, powództwa przeciwegzekucyjne, przywrócenie terminu, zawezwanie do próby ugodowej. Wszystkie mają odpowiedniki w `pisma-proste-v2`.

Tam, gdzie pisma nie ma, nie ma i przepisu — nawet gdy instytucja jest fundamentalna (art. 365–366, prawomocność i powaga rzeczy osądzonej).

### 2. Dowody to najmocniejszy fragment całego systemu prawnego
Dział III Księgi I (art. 227–315) jest pokryty niemal w komplecie: ocena dowodów, dokumenty, świadkowie i biegli mają status 🟢. Napędza to `analizator-dowodow-v3` wraz z `MOD-ATAK-NA-DOWOD`, `MOD-ATAK-NA-SWIADKA` i `MOD-NEGACJA-DOWODOW`. Art. 233 §1 KPC jest najczęściej cytowanym przepisem w całym systemie — występuje w 20 plikach.

### 3. Luki krytyczne

| # | Przepis | Jednostka | Dlaczego krytyczne |
|---|---|---|---|
| 1 | **art. 205¹–205¹²** | Rozdz. 2a | Odpowiedź na pozew, posiedzenie przygotowawcze, plan rozprawy, prekluzja twierdzeń. Rdzeń reformy KPC z 2019 r. — bez tego system nie wie, kiedy strona traci prawo powoływania faktów |
| 2 | **art. 365, 366** | Dz. IV Rozdz. 3 | Moc wiążąca i powaga rzeczy osądzonej. Podstawa zarzutu res iudicata i prejudycjalności — instytucje, których nie da się obejść |
| 3 | **art. 378, 382–386** | Dz. V Rozdz. 1 | Granice apelacji, podstawa orzekania sądu II instancji, zakaz reformationis in peius, rodzaje rozstrzygnięć. `pisma-procesowe-v3` ma `appellate-engine-v8` — bez tych przepisów engine nie ma ram |
| 4 | **art. 458¹–458¹³** | Dz. IIa Tyt. VII | Postępowanie w sprawach gospodarczych: prekluzja dowodowa, ograniczenie dowodu ze świadków, umowa dowodowa. System obsługuje sprawy gospodarcze materialnie, ale nie zna ich odrębnego reżimu procesowego |
| 5 | **art. 829, 833** | Dz. V Cz. III | Rzeczy wyłączone spod egzekucji i ograniczenia egzekucji z wynagrodzenia. System opisuje egzekucję z wynagrodzenia (art. 880–888), ale nie zna kwoty wolnej — asymetria na niekorzyść dłużnika |
| 6 | **art. 477⁹, 477¹⁴** | Dz. III Tyt. VII | Odwołanie od decyzji ZUS (termin miesięczny) i rodzaje wyroków w sprawach ubezpieczeniowych. DR-04 jest rozbudowany materialnie, ale procedura odwoławcza nie ma podstawy |
| 7 | **art. 350, 351, 352** | Dz. IV Rozdz. 1 Oddz. 4 | Sprostowanie, uzupełnienie i wykładnia wyroku — trzy najczęstsze wnioski poorzeczeniowe |
| 8 | **art. 399, 401, 401¹, 403** | Dz. VI | Podstawy wznowienia postępowania. System zna wyłącznie terminy z art. 407 |
| 9 | **art. 458¹⁴–458¹⁶** | Dz. IIb Tyt. VII | Postępowanie z udziałem konsumentów (od 1.07.2023). System obsługuje klauzule abuzywne i sankcję kredytu darmowego materialnie |
| 10 | **art. 669–679², 680–689** | Ks. II Dz. IV | Stwierdzenie nabycia spadku i dział spadku — dwie najczęstsze sprawy spadkowe |
| 11 | **art. 1041–1059** | Tyt. III Dz. I | Egzekucja świadczeń niepieniężnych (eksmisja, czynność niezastępowalna, zaniechanie). Jedyny tryb wykonania wyroków nakazujących |
| 12 | **art. 1081–1088** | Tyt. III Dz. V | Egzekucja alimentów. Alimenty są pokryte w KRO i w art. 209 KK, ale tryb ich przymusowego dochodzenia — nie |
| 13 | **art. 316 §1** | Dz. IV Oddz. 1 | Stan rzeczy z chwili zamknięcia rozprawy jako podstawa wyroku |
| 14 | **art. 162** | Dz. I Rozdz. 3 | Zastrzeżenie do protokołu — bez niego strona traci prawo powoływania uchybienia w apelacji |
| 15 | **art. 617–625, 626¹–626¹³** | Ks. II Dz. III | Zniesienie współwłasności i postępowanie wieczystoksięgowe |

### 4. Deklaracja bez pokrycia
Skill `pisma-proste-v2` deklaruje w swoim opisie obsługę **„sprzeciwu od referendarza”**, ale art. 398²²–398²⁴ KPC (Dział Vb — skarga na orzeczenie referendarza sądowego) nie występuje w żadnym module systemu. Opis skilla obiecuje więcej, niż moduły dostarczają — to sytuacja gorsza niż zwykła luka, bo router skieruje sprawę do skilla, który nie ma podstawy prawnej.

### 5. Asymetria proces / nieproces
Księga I (Proces) ma 14 jednostek 🟢 i 6 🔴. Księga II (Postępowanie nieprocesowe) ma **0 jednostek 🟢** i 6 🔴 przy 5 🟡. Cały tryb nieprocesowy — od przepisów ogólnych (art. 506–525) po sprawy rejestrowe i depozytowe — jest w systemie obecny wyłącznie punktowo, przez odesłania z modułów materialnych (KRO, KC-spadki). Nie ma ani jednego dedykowanego modułu procedury nieprocesowej, mimo że w tym trybie toczą się sprawy spadkowe, rzeczowe i większość rodzinnych.

### 6. Ustalenie pozytywne: metryka aktualna
W przeciwieństwie do KPK, wszystkie moduły cytujące KPC konsekwentnie podają **Dz.U. 2026 poz. 468 t.j.**, co odpowiada stanowi na dzień audytu. Jeden z plików odnotowuje weryfikację z 24.06.2026 z adnotacją, że wszystkie przywołane artykuły zostały sprawdzone w tym tekście jednolitym. To standard, do którego należałoby doprowadzić metrykę KPK.

---

## Rekomendowana kolejność uzupełnień

**Priorytet 1 — bez tego system nie poprowadzi procesu cywilnego poprawnie:**
1. `mod-KPC-organizacja-postepowania` (art. 205¹–205¹² + 162 + 235²) — prekluzja i plan rozprawy
2. `mod-KPC-prawomocnosc` (art. 363–366 + 316 §1)
3. `mod-KPC-apelacja-granice` (art. 378, 382–386) — uzupełnienie ram dla `appellate-engine-v8`

**Priorytet 2 — postępowania odrębne, których system dotyka materialnie:**
4. `mod-KPC-sprawy-gospodarcze` (art. 458¹–458¹³)
5. `mod-KPC-postepowanie-z-konsumentem` (art. 458¹⁴–458¹⁶)
6. `mod-KPC-praca-ubezpieczenia` (art. 459–477¹⁶, rdzeń: 477⁹ i 477¹⁴)

**Priorytet 3 — obrona dłużnika w egzekucji:**
7. `mod-KPC-ograniczenia-egzekucji` (art. 829–839 + 804 + 824–826)
8. `mod-KPC-egzekucja-swiadczen-niepienieznych` (art. 1041–1059)
9. `mod-KPC-egzekucja-alimentow` (art. 1081–1088)

**Priorytet 4 — postępowanie nieprocesowe:**
10. `mod-KPC-nieproces-przepisy-ogolne` (art. 506–525, w tym 518, 519¹, 523)
11. `mod-KPC-spadek-stwierdzenie-i-dzial` (art. 669–689)
12. `mod-KPC-zniesienie-wspolwlasnosci-i-KW` (art. 617–626¹³)
13. `mod-KPC-kontakty-i-odebranie-osoby` (art. 598¹–598²²)

**Priorytet 5 — dokończenia i spójność:**
14. `mod-KPC-orzeczenia-poprawki` (art. 350–352 + 339 + 333–338)
15. `mod-KPC-wznowienie` (art. 399–416¹)
16. Uzupełnić art. 398²²–398²⁴ (skarga na orzeczenie referendarza) **albo** usunąć „sprzeciw od referendarza” z opisu `pisma-proste-v2` — deklaracja i pokrycie muszą się zgadzać
17. `mod-KPC-jurysdykcja-krajowa` (art. 1097–1116) — domknięcie Części IV wobec DR-14

---

## Zastrzeżenie metodologiczne

Raport mapuje **odwołania do przepisów**, nie jakość merytoryczną opisu. Jednostka 🟡 może zawierać opis bardzo dobry (Dz. V Cz. III — skarga na komornika, art. 767, z pełnym szablonem) albo samą wzmiankę przez odesłanie (Dz. V Tyt. II — wyjawienie majątku, art. 913 wspomniany wyłącznie w module KRO). Kolumna „Luka" rozstrzyga, który to przypadek.

Struktura KPC zweryfikowana online 13.08.2026 wobec tekstu jednolitego Dz.U. 2026 poz. 468. Przed powołaniem któregokolwiek przepisu w piśmie procesowym obowiązuje standardowa weryfikacja w ISAP zgodnie z `shared/PRAWO-HARDGATE`.
