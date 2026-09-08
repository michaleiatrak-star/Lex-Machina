# Audyt pokrycia KPK w systemie skilli — mapa rozdziałowa
**Data audytu:** 13.08.2026  
**Zakres:** wszystkie skille w `/mnt/skills/user` (148 plików zawierających odwołania do KPK)  
**Akt odniesienia:** ustawa z 6.06.1997 — Kodeks postępowania karnego, **Dz.U. 2026 poz. 490 t.j.** (obwieszczenie MS z 27.03.2026, stan prawny na 16.03.2026), ze zm. **Dz.U. 2026 poz. 421** i **Dz.U. 2026 poz. 638**
**Metoda:** ekstrakcja wszystkich odwołań w postaci `art. N […] KPK / k.p.k.` ze wszystkich plików `.md/.html/.txt` systemu, mapowanie numerów artykułów na rozdziały wg struktury KPK zweryfikowanej online (stan 13.08.2026), następnie ocena jakościowa treści modułu źródłowego.
## Legenda
| Symbol | Znaczenie |
|---|---|
| 🟢 PEŁNE | Instytucja rozdziału obsłużona systemowo — przesłanki + tryb + skutki. Gwiazdka = pełne funkcjonalnie, z drobnymi brakami |
| 🟡 CZĘŚCIOWE | Pojedyncze artykuły użyte zadaniowo; brak systematyki rozdziału |
| 🔴 BRAK | Zero odwołań merytorycznych (ewentualnie sama wzmianka w mapie) |
| ⚪ N/D | Rozdział uchylony — pokrycie niewymagane |
## Podsumowanie ilościowe
| Status | Liczba rozdziałów | Udział (rozdziały obowiązujące) |
|---|---|---|
| 🟢 PEŁNE | 2 | 2% |
| 🟡 CZĘŚCIOWE | 35 | 41% |
| 🔴 BRAK | 48 | 56% |
| ⚪ N/D (uchylone) | 5 | — |
| **RAZEM** | **90** | **85 obowiązujących** |
Zidentyfikowano **81 różnych artykułów KPK** przywołanych w całym systemie, na ok. 680 artykułów kodeksu (**ok. 12%** materii artykułowej).
---

## Mapa rozdziałowa

### DZIAŁ I
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| — | Przepisy wstępne | 1–23b | 🟡 CZĘŚCIOWE | 1a, 5, 7, 10, 12, 15aa, 23a | mod-KPK-tryby-scigania; mod-KPK-mediacja-sprawiedliwosc-naprawcza; mod-KK-KPK-framework-karne | BRAK art. 17 (negatywne przesłanki procesowe) — luka krytyczna; brak art. 2, 4, 6, 8, 11, 14, 22 |

### DZIAŁ II
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 1 | Właściwość i skład sądu | 24–39 | 🟡 CZĘŚCIOWE | 28, 29, 30 | mod-sklad-sadu-liczba-sedziow (DR-02); mod-KK-kwalifikator-karnomaterialny | BRAK art. 24–27 (właściwość rzeczowa SR/SO/SA/SN), 31–36 (właściwość miejscowa, przekazanie sprawy) |
| 2 | Wyłączenie sędziego | 40–44 | 🔴 BRAK | — | — | Cały rozdział: iudex inhabilis (40) i iudex suspectus (41) — brak nawet wzmianki |

### DZIAŁ III
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 3 | Oskarżyciel publiczny | 45–48 | 🔴 BRAK | — | — | Cały rozdział |
| 4 | Pokrzywdzony | 49–52a | 🟡 CZĘŚCIOWE | 49 | shared/NAZEWNICTWO-STRON; MX-dziedziny | Tylko definicja pokrzywdzonego; brak art. 51 (wykonywanie praw), 52 (śmierć pokrzywdzonego) |
| 5 | Oskarżyciel posiłkowy | 53–58 | 🟡 CZĘŚCIOWE | 53, 55, 58 | shared/NAZEWNICTWO-STRON; MP12-terminy; shared/LEGAL-STATUS-LOCK | Brak art. 54, 56, 57 (odmowa dopuszczenia, odstąpienie) |
| 6 | Oskarżyciel prywatny | 59–61 | 🟡 CZĘŚCIOWE | 59, 60 | mod-KPK-tryby-scigania; references/tryby-scigania | Art. 60 (wstąpienie prokuratora) dobrze opisany; brak art. 61 (wstąpienie w prawa zmarłego) |
| 7 | (uchylony) | 62–70 | ⚪ N/D (uchylony) | — | — | Rozdział uchylony (powód cywilny) — pokrycie niewymagane |
| 8 | Oskarżony | 71–81a | 🟡 CZĘŚCIOWE | 71, 72, 78, 79, 81a | mod-KK-KPK-framework-szczegolowy; shared/mod-niewidomy-prawa-prawne; shared/mod-niepelnosprawnosc-intelektualna-gluchota | Dobre pokrycie obrony obligatoryjnej (79) i tłumacza (72); brak art. 73 (kontakt z obrońcą), 74 (obowiązki dowodowe oskarżonego), 75, 76a, 77, 80 |
| 9 | Obrońcy i pełnomocnicy | 82–89 | 🟡 CZĘŚCIOWE | 87a | shared/mod-niewidomy-prawa-prawne | Brak art. 82–86 (kto może być obrońcą, liczba obrońców, upoważnienie), 88 (pełnomocnik) |
| 10 | Przedstawiciel społeczny | 90–91 | 🔴 BRAK | — | — | Cały rozdział — istotne dla spraw z udziałem NGO |
| 10a | Podmiot zobowiązany | 91a | 🔴 BRAK | — | — | Art. 91a — powiązany z przepadkiem korzyści (art. 45 KK) |
| 10b | Właściciel przedsiębiorstwa zagrożonego przepadkiem | 91b | 🔴 BRAK | — | — | Art. 91b — istotne w sprawach gospodarczych |

### DZIAŁ IV
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 11 | Orzeczenia, zarządzenia i polecenia | 92–107 | 🔴 BRAK | — | — | Cały rozdział: art. 93 (formy), 94 (treść postanowienia), 98 (uzasadnienie), 100 (ogłaszanie/doręczanie), 105 (sprostowanie), 107 (klauzula wykonalności) |
| 12 | Narada i głosowanie | 108–115 | 🔴 BRAK | — | — | Cały rozdział, w tym art. 114 §3 (zdanie odrębne) |
| 13 | Porządek czynności procesowych | 116–121 | 🟡 CZĘŚCIOWE | 119, 120 | shared/FORMAL-CHECK; shared/TRYBY-PROCESOWE | Wymogi formalne pisma (119) i tryb uzupełnienia braków (120) pokryte; brak art. 116, 117 (zawiadamianie, usprawiedliwianie niestawiennictwa), 118 (znaczenie czynności) |
| 14 | Terminy | 122–127c | 🟡 CZĘŚCIOWE | 126 | analiza-sadowa-v6/koszty-terminy; shared/TERM-CALC | Przywrócenie terminu (126) pokryte; brak art. 122 (terminy zawite/prekluzyjne), 123 (obliczanie), 124 (zachowanie terminu przez nadanie), 125 |
| 15 | Doręczenia | 128–142 | 🔴 BRAK | — | — | Cały rozdział — w tym art. 132, 133 (fikcja doręczenia), 139 (zmiana adresu). Krytyczne dla liczenia terminów |
| 16 | Protokoły | 143–155 | 🔴 BRAK | — | — | Cały rozdział — w tym art. 143 (obligatoryjność), 147 (rejestracja obrazu/dźwięku), 152–153 (sprostowanie protokołu) |
| 17 | Przeglądanie akt i sporządzanie odpisów | 156–159 | 🔴 BRAK | — | — | Art. 156 §5 i §5a (dostęp do akt w postępowaniu przygotowawczym) — luka krytyczna dla obrony na etapie przygotowawczym |
| 18 | Odtworzenie zaginionych lub zniszczonych akt | 160–166 | 🔴 BRAK | — | — | Cały rozdział |

### DZIAŁ V
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 19 | Dowody — przepisy ogólne | 167–174 | 🟢 PEŁNE* | 167, 168a, 170, 171, 172, 173, 174 | MOD-ATAK-NA-DOWOD; MD3b-walidacja-prawna; shared/QUESTION-ADMISSIBILITY-GATE; W2-SZCZEGOLY | *Funkcjonalnie pełne (inicjatywa dowodowa, owoce zatrutego drzewa, oddalenie wniosku, swoboda wypowiedzi, konfrontacja, okazanie, zakaz zastępowania). Brak art. 168b, 169 (wymogi formalne wniosku dowodowego) — do uzupełnienia |
| 20 | Wyjaśnienia oskarżonego | 175–176 | 🟡 CZĘŚCIOWE | 175 | mod-KK-KPK-framework-karne (zasada absolutna nr 2); mod-KK-KPK-framework-szczegolowy | Prawo do milczenia pokryte solidnie; brak art. 176 (wyjaśnienia pisemne) |
| 21 | Świadkowie | 177–192a | 🟡 CZĘŚCIOWE | 178, 178a, 180, 182, 183, 184, 192 | shared/PRAWO-HARDGATE-WITNESS; shared/QUESTION-ADMISSIBILITY-GATE; przesluchanie-swiadkow-v2-min90; mod-tajemnica-zawodowa-poufnosc | Mocne pokrycie zakazów dowodowych i prawa odmowy. BRAK art. 177 (obowiązek stawiennictwa), 185 (zwolnienie z zeznań), 185a–185c (małoletni, ofiary przest. seksualnych) — luka krytyczna, 186 (skutki odmowy), 188, 190 (uprzedzenie o odpowiedzialności), 191 (przebieg), 192a |
| 22 | Biegli, tłumacze, specjaliści | 193–206 | 🔴 BRAK | — | — | Cały rozdział. Uwaga: mod-KPC-biegli-sadowi-opinie dotyczy WYŁĄCZNIE KPC. Brak art. 193 (dopuszczenie opinii), 196 (wyłączenie biegłego), 201 (opinia niepełna/sprzeczna), 202–203 (biegli psychiatrzy, obserwacja) — luka krytyczna |
| 23 | Oględziny. Otwarcie zwłok. Eksperyment procesowy | 207–212 | 🔴 BRAK | — | — | Cały rozdział |
| 24 | Wywiad środowiskowy i badanie osoby oskarżonego | 213–216 | 🔴 BRAK | — | — | Cały rozdział (art. 214 wywiad kuratora, 215 badanie psychologiczne) |
| 25 | Zatrzymanie rzeczy. Przeszukanie | 217–236b | 🟡 CZĘŚCIOWE | 218 | mod-KK-art267-269c-cyberprzestepstwa; mod-KK-cyberprzestepstwa-szczegolowy | Tylko art. 218 (wydanie korespondencji/danych) w kontekście cyber. BRAK art. 217, 219–222 (przeszukanie), 226 (wykorzystanie dokumentów objętych tajemnicą), 236 (zażalenie na czynności) — luka krytyczna |
| 26 | Kontrola i utrwalanie rozmów | 237–242 | 🔴 BRAK | — | — | Cały rozdział — podsłuch procesowy (237), zgoda następcza (237a), zniszczenie materiałów (238). Uwaga: kontrola operacyjna jest opisana w DR-13 (ustawa o Policji), ale to inna instytucja |

### DZIAŁ VI
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 27 | Zatrzymanie | 243–248 | 🟡 CZĘŚCIOWE | 244, 245 | mod-KK-KPK-framework-karne (zasada absolutna nr 1); mod-KK-KPK-framework-szczegolowy | Prawo do obrońcy od zatrzymania (245) i podstawy (244) pokryte; brak art. 246 (zażalenie na zatrzymanie), 247 (zatrzymanie i przymusowe doprowadzenie), 248 (48/72 h) |
| 28 | Środki zapobiegawcze | 249–277 | 🟡 CZĘŚCIOWE | 257, 266, 268, 269, 275a | mod-poreczenie-majatkowe-kaucja-karna; mod-KK-art190a-stalking; mod-KK-art207-przemoc-domowa | Poręczenie majątkowe i nakaz opuszczenia lokalu (275a) pokryte dobrze. BRAK art. 249 (przesłanka ogólna), 250, 252 (zażalenie), 258 (przesłanki szczególne tymczasowego aresztowania), 259 (zakazy stosowania TA), 263 (terminy TA) — LUKA NAJPOWAŻNIEJSZA W CAŁYM KPK |
| 29 | Poszukiwanie oskarżonego i list gończy | 278–280 | 🟢 PEŁNE | 278, 279, 280 | mod-KK-art233-244b-przeciwko-wymiarowi-sprawiedliwosci | Wszystkie 3 artykuły rozdziału pokryte |
| 30 | List żelazny | 281–284a | 🔴 BRAK | — | — | Cały rozdział |
| 31 | Kary porządkowe | 285–290 | 🔴 BRAK | — | — | Cały rozdział — istotne przy niestawiennictwie świadka/biegłego |
| 32 | Zabezpieczenie majątkowe | 291–296 | 🔴 BRAK | — | — | Cały rozdział. Uwaga: zabezpieczenie w KPC jest pokryte, karne — nie |

### DZIAŁ VII
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 33 | Post. przygotowawcze — przepisy ogólne | 297–302a | 🟡 CZĘŚCIOWE | 300, 302 | mod-lincz-ochrona-swiadkow-lowcy-pedofili; mod-PrProkuratura-organy-ochrony-prawa | Pouczenia (300) i zażalenie na czynności (302) wzmiankowane; BRAK art. 297 (cele postępowania), 298, 299 (strony) — luka systemowa |
| 34 | Wszczęcie śledztwa | 303–308 | 🟡 CZĘŚCIOWE | 304, 306 | MOD-PRAWO; MOD-SZABLONY; shared/ZAWIADOMIENIA-KRZYZOWE; mod-KAS-kontrola-celno-skarbowa | Zawiadomienie (304) i zażalenie na odmowę/umorzenie (306) pokryte operacyjnie (są szablony). Brak art. 303, 305, 307 (postępowanie sprawdzające), 308 (czynności w niezbędnym zakresie) |
| 35 | Przebieg śledztwa | 309–320 | 🔴 BRAK | — | — | BRAK art. 313 (przedstawienie zarzutów) — luka krytyczna; brak 314 (zmiana zarzutów), 315–317 (udział stron w czynnościach), 318 (opinia biegłego), 320 (mediacja w postępowaniu przygotowawczym) |
| 36 | Zamknięcie śledztwa | 321–325 | 🟡 CZĘŚCIOWE | 324 | mod-KK-kwalifikator-karnomaterialny | Tylko art. 324 (wniosek o umorzenie i środki zabezpieczające). Brak art. 321 (końcowe zaznajomienie z materiałami) — istotne dla obrony |
| 36a | Dochodzenie | 325a–325i | 🔴 BRAK | — | — | Cały rozdział — forma prowadzenia większości spraw drobnych |
| 37 | Nadzór prokuratora nad post. przygotowawczym | 326–328 | 🔴 BRAK | — | — | Cały rozdział, w tym art. 327 (wznowienie umorzonego postępowania), 328 (uchylenie postanowienia przez PG) |
| 38 | Czynności sądowe w post. przygotowawczym | 329–330 | 🟡 CZĘŚCIOWE | 330 | shared/LEGAL-STATUS-LOCK | Art. 330 (skutek uwzględnienia zażalenia, subsydiarny akt oskarżenia) wzmiankowany; brak art. 329 |
| 39 | Akt oskarżenia | 331–336 | 🟡 CZĘŚCIOWE | 335 | mod-dobrowolne-poddanie-sie-karze-KPK | Art. 335 §1 i §2 pokryte szczegółowo. BRAK art. 332–333 (wymogi formalne aktu oskarżenia), 336 (wniosek o warunkowe umorzenie) — luka istotna przy redakcji pism |

### DZIAŁ VIII
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 40 | Wstępna kontrola oskarżenia | 337–347 | 🔴 BRAK | — | — | Cały rozdział — art. 339 (posiedzenie), 343 (uwzględnienie wniosku z art. 335), 344a (zwrot sprawy prokuratorowi) |
| 41 | Przygotowanie do rozprawy głównej | 348–354a | 🟡 CZĘŚCIOWE | 354, 354a | mod-KK-kwalifikator-karnomaterialny; analiza-sadowa-v6 | Tylko przepisy o wnioskach dot. środków zabezpieczających; brak art. 348–353 (wyznaczenie rozprawy, doręczenie zawiadomień, terminy) |
| 42 | Jawność rozprawy głównej | 355–364 | 🔴 BRAK | — | — | Cały rozdział — wyłączenie jawności (360), obecność publiczności |
| 43 | Przepisy ogólne o rozprawie głównej | 365–380 | 🔴 BRAK | — | — | Cały rozdział — art. 366 (kierownictwo rozprawy), 367 (prawo wypowiedzi stron), 370 (kolejność zadawania pytań!), 374–377 (obecność oskarżonego). Luka krytyczna dla przesłuchania na rozprawie |
| 44 | Rozpoczęcie rozprawy głównej | 381–384 | 🔴 BRAK | — | — | Cały rozdział |
| 45 | Przewód sądowy | 385–405 | 🟡 CZĘŚCIOWE | 387, 391 | mod-dobrowolne-poddanie-sie-karze-KPK; shared/CROSS-EXAMINATION-GATE; shared/PRAWO-HARDGATE-WITNESS | Dobrowolne poddanie się karze (387) i odczytanie zeznań (391) pokryte dobrze. BRAK art. 385–386, 389 (odczytanie wyjaśnień), 390, 392–394 (odczytywanie dokumentów), 399 (uprzedzenie o zmianie kwalifikacji), 405 (zamknięcie przewodu) |
| 46 | Głosy końcowe | 406–407 | 🔴 BRAK | — | — | Cały rozdział |
| 47 | Wyrokowanie | 408–424 | 🟡 CZĘŚCIOWE | 422 | MD5-terminy; MP12-terminy; analiza-sadowa-v6/koszty-terminy | Wniosek o uzasadnienie (422) pokryty terminowo. BRAK art. 410 (podstawa wyroku — całokształt okoliczności), 413 (treść wyroku), 414, 424 (wymogi uzasadnienia) — luka krytyczna przy budowie zarzutów apelacyjnych |

### DZIAŁ IX
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 48 | Post. odwoławcze — przepisy ogólne | 425–443a | 🟡 CZĘŚCIOWE | 439 | shared/ORKA-BAS-LEKSYKON; shared/mod-niewidomy-prawa-prawne | Tylko art. 439 §1 pkt 10 (bezwzględna przyczyna — brak obrońcy). BRAK art. 425, 427 (wymogi środka odwoławczego), 433 (granice rozpoznania), 434 (zakaz reformationis in peius), 437 (rodzaje rozstrzygnięć), 438 (względne przyczyny odwoławcze!), 440, 443 — luka bardzo poważna dla apelacji |
| 49 | Apelacja | 444–458 | 🟡 CZĘŚCIOWE | 445 | MD5-terminy; MP12-terminy; shared/terminy | Tylko termin 14 dni (445). BRAK art. 444, 446 (przymus adwokacki), 447 (zakres zaskarżenia), 452, 454, 457 — istotne, bo pisma-procesowe-v3 ma dedykowany appellate-engine-v8 |
| 50 | Zażalenie i sprzeciw | 459–467 | 🟡 CZĘŚCIOWE | 460, 465 | MOD-PRAWO; shared/ZAZALENIE-ADRESAT-GATE; MP12-terminy | Termin 7 dni (460) i adresat zażalenia w post. przyg. (465) pokryte. Brak art. 459 (dopuszczalność), 461–464, 466, 467 (sprzeciw) |

### DZIAŁ X
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 51 | (uchylony) | 468–484 | ⚪ N/D (uchylony) | — | — | Rozdział uchylony (postępowanie uproszczone) |
| 52 | Post. w sprawach z oskarżenia prywatnego | 485–499 | 🔴 BRAK | — | — | Cały rozdział — art. 487 (uproszczony akt oskarżenia), 488 (Policja przyjmuje skargę), 489–492 (posiedzenie pojednawcze), 496 (odstąpienie od oskarżenia). LUKA DOTKLIWA: skille mocno pokrywają art. 212/216 KK materialnie, ale nie procedurę prywatnoskargową |
| 53 | Postępowanie nakazowe | 500–507 | 🟡 CZĘŚCIOWE | 506 | analiza-sadowa-v6/koszty-terminy | Tylko sprzeciw (506, termin 7 dni). Brak art. 500–505 (przesłanki wyroku nakazowego), 507 |
| 54 | (uchylony) | 508–517 | ⚪ N/D (uchylony) | — | — | Rozdział uchylony |
| 54a | Postępowanie przyspieszone | 517a–517j | 🟡 CZĘŚCIOWE | 517b | mod-KPK-tryby-scigania; references/tryby-scigania | Tylko przesłanki trybu (517b). Brak art. 517c–517j (pouczenia, obrońca z urzędu, przerwa, przekazanie do trybu zwykłego) |

### DZIAŁ XI
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 55 | Kasacja | 518–539 | 🟡 CZĘŚCIOWE | 524 | MP12-terminy; analiza-sadowa-v6/koszty-terminy | Tylko termin 30 dni (524). BRAK art. 519, 520, 521 (kasacja PG/RPO), 523 (podstawy kasacyjne — rażące naruszenie prawa!), 526 (przymus adwokacki) — luka poważna |
| 55a | Skarga na wyrok sądu odwoławczego | 539a–539f | 🔴 BRAK | — | — | Cały rozdział — nadzwyczajny środek przeciw uchyleniu i przekazaniu sprawy |
| 56 | Wznowienie postępowania | 540–548 | 🟡 CZĘŚCIOWE | 540, 542 | mod-Konstytucja-TK-skarga-konstytucyjna; analiza-sadowa-v6/koszty-terminy | Podstawy wznowienia po wyroku TK/ETPC (540 §2, §3) pokryte w kontekście konstytucyjnym. Brak art. 541, 543–548 (tryb, przymus adwokacki, terminy) |

### DZIAŁ XII
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 57 | Podjęcie postępowania warunkowo umorzonego | 549–551 | 🔴 BRAK | — | — | Cały rozdział. Uwaga: przesłanki warunkowego umorzenia z art. 66–68 KK są pokryte, ale procedura podjęcia — nie |
| 58 | Odszkodowanie za niesłuszne skazanie, TA lub zatrzymanie | 552–559 | 🔴 BRAK | — | — | Cały rozdział — luka dotkliwa, to samodzielne roszczenie procesowe z własnym terminem przedawnienia (art. 555) |
| 59 | Ułaskawienie | 560–568 | 🟡 CZĘŚCIOWE | 560, 567, 568 | mod-ustawa-KRS-i-ustroj-wladzy | Wzmiankowane w kontekście ustrojowym (prerogatywa Prezydenta), nie proceduralnym. Brak art. 561–566 (tryb przed sądem, opinia) |
| 60 | Orzekanie kary łącznej | 568a–577 | 🔴 BRAK | — | — | Cały rozdział — wyrok łączny. Luka dotkliwa: art. 85–86 KK (materialne) też nie mają dedykowanego modułu |

### DZIAŁ XIIa
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| — | Współpraca z Prokuraturą Europejską (EPPO) | — | 🟡 CZĘŚCIOWE | — | mod-KPK-wspolpraca-miedzynarodowa-karna | Opis instytucjonalny EPPO obecny, bez numerów artykułów Działu XIIa — moduł sam nakazuje weryfikację w ISAP |

### DZIAŁ XIII
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 61 | Immunitety dyplomatyczne i konsularne | 578–584 | 🔴 BRAK | art. 578 (tylko w mapie) | mod-KPK-wspolpraca-miedzynarodowa-karna | Wyłącznie wzmianka w mapie rozdziałów, bez treści |
| 62 | Pomoc prawna i doręczenia w sprawach karnych | 585–589f | 🔴 BRAK | — | mod-KPK-wspolpraca-miedzynarodowa-karna (mapa) | Tylko wzmianka zbiorcza „Rozdz. 62–64 — ekstradycja i pomoc prawna”, z adnotacją modułu: „sprawdź dokładne numery w ISAP” |
| 62a–62d | Zabezpieczenie dowodów/mienia + Europejski Nakaz Dochodzeniowy | 589g–589zt | 🔴 BRAK | — | — | Cały blok — END to podstawowe narzędzie transgranicznego gromadzenia dowodów |
| 63 | Przejęcie i przekazanie ścigania karnego | 590–592f | 🔴 BRAK | — | — | Brak |
| 64 | Wystąpienie o wydanie osób/przedmiotów z zagranicy | 593–601 | 🔴 BRAK | — | mod-KPK-wspolpraca-miedzynarodowa-karna (mapa) | Tylko wzmianka w mapie |
| 65 | Wydanie osób/przedmiotów na wniosek państw obcych | 602–607 | 🔴 BRAK | — | — | Ekstradycja bierna — brak treści |
| 65a | ENA — wystąpienie RP | 607a–607j | 🟡 CZĘŚCIOWE | 607a, 607b, 607c, 607e | mod-KPK-wspolpraca-miedzynarodowa-karna | Najlepiej pokryty fragment Działu XIII: organ wydający, przesłanki, niedopuszczalność ENA. Brak art. 607d, 607f–607j |
| 65b | ENA — wystąpienie państwa UE do RP | 607k–607zc | 🟡 CZĘŚCIOWE | 607k | mod-KPK-wspolpraca-miedzynarodowa-karna | Tylko punkt wejścia. Brak przesłanek odmowy wykonania ENA (607p, 607r) — to najczęstsza realna potrzeba obrońcy |
| 65c–65d | Europejski nakaz nadzoru (środki zapobiegawcze UE) | 607zd–607zn | 🔴 BRAK | — | mod-KPK-wspolpraca-miedzynarodowa-karna (mapa) | Tylko wzmianka w mapie |
| 66 | Przejęcie i przekazanie orzeczeń do wykonania | 608–611f | 🔴 BRAK | — | mod-KPK-wspolpraca-miedzynarodowa-karna (mapa) | Tylko wzmianka zbiorcza „Rozdz. 66–66k” |
| 66a–66d | Grzywny, nawiązki, przepadek (UE) | 611fa–611fze | 🔴 BRAK | — | — | Brak |
| 66e | Współpraca z Międzynarodowym Trybunałem Karnym | 611g–611s | 🔴 BRAK | — | — | Brak |
| 66f–66i | Kara pozbawienia wolności i probacja (UE) | 611t–611uj | 🔴 BRAK | — | — | Brak |
| 66j–66k | Europejski nakaz ochrony | 611w–611wj | 🔴 BRAK | — | mod-KPK-wspolpraca-miedzynarodowa-karna (mapa) | Wzmianka w mapie; istotne przy przemocy domowej z elementem transgranicznym |
| 67 | Przepisy końcowe Działu XIII | 612–615 | 🔴 BRAK | — | — | Brak |

### DZIAŁ XIV
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 68 | Koszty procesu — przepisy ogólne | 616–622 | 🟡 CZĘŚCIOWE | 616, 618, 620 | MP10-koszty; MOD-OPLATY | Definicja kosztów (616), wydatki SP (618), wykładanie kosztów obrońcy (620). Brak art. 617, 619, 621–622 (ryczałt w sprawach prywatnoskargowych) |
| 69 | Zwolnienie od kosztów sądowych | 623–625 | 🔴 BRAK | — | — | Cały rozdział — art. 623 i 624 to standardowy wniosek klienta. LUKA DOTKLIWA (odpowiednik z KSCU/KPC jest pokryty) |
| 70 | Zasądzenie kosztów procesu | 626–641 | 🟡 CZĘŚCIOWE | 627, 632 | MP10-koszty | Koszty od skazanego (627) i przy uniewinnieniu (632). Brak art. 626 (rozstrzygnięcie i zażalenie), 633, 634–636 (koszty odwoławcze), 640 |
| 71 | (uchylony) | 642–645 | ⚪ N/D (uchylony) | 645 (jako uchylony) | MP10-koszty | Rozdział uchylony — odwołanie w skillu jest poprawne (odnotowuje uchylenie) |

### DZIAŁ XV
| Rozdz. | Tytuł | Art. | Status | Pokryte artykuły | Moduł / plik | Luka |
|---|---|---|---|---|---|---|
| 72 | Sądy wojskowe — przepisy ogólne | 646–662 | 🔴 BRAK | — | — | Cały Dział XV nieobecny w systemie |
| 73 | Sądy wojskowe — środki przymusu i post. przygotowawcze | 663–668 | 🔴 BRAK | — | — | j.w. |
| 74 | Sądy wojskowe — postępowanie przed sądem | 669–673 | 🔴 BRAK | — | — | j.w. Uwaga: DR-13 pokrywa Żandarmerię Wojskową materialnie, ale nie procedurę wojskową |
| 75 | (uchylony) | 674–682 | ⚪ N/D (uchylony) | — | — | Rozdział uchylony |

---

## Wnioski

### 1. Struktura pokrycia jest „wyspowa", nie systemowa
Skille pokrywają KPK **punktowo — tam, gdzie padło konkretne pytanie użytkownika**. Widać to w metrykach modułów: `mod-poreczenie-majatkowe-kaucja-karna` („NOWY 2026-07-19, odpowiedź na pytanie użytkownika"), `mod-dobrowolne-poddanie-sie-karze-KPK` („NOWY 2026-07-21, odpowiedź na pytanie użytkownika"). Efekt: art. 266–269 (poręczenie) opisane szczegółowo, a art. 249/258/263 (przesłanki i terminy tymczasowego aresztowania) — nieobecne, mimo że to ten sam rozdział i instytucja nadrzędna.

### 2. Pokrycie jest odwrotnie proporcjonalne do wagi procesowej
Najlepiej obsłużone są rozdziały **dowodowe** (Rozdz. 19 i 21 — bo napędza je `analizator-dowodow-v3` i `przesluchanie-swiadkow-v2`). Najgorzej — rozdziały **decyzyjne i odwoławcze**, czyli te, z których buduje się zarzuty w piśmie.

### 3. Luki krytyczne (blokują poprawne pismo lub poradę)

| # | Przepis | Rozdz. | Dlaczego krytyczne |
|---|---|---|---|
| 1 | **art. 249, 258, 259, 263** | 28 | Przesłanki i terminy tymczasowego aresztowania. Bez nich nie da się napisać zażalenia na TA ani wniosku o uchylenie — a to najczęstsze pilne pismo w sprawie karnej |
| 2 | **art. 438** (+ 425, 427, 433, 434, 437) | 48 | Względne przyczyny odwoławcze. `pisma-procesowe-v3` ma dedykowany `appellate-engine-v8`, ale nie ma podstawy prawnej zarzutów, które ten engine ma formułować |
| 3 | **art. 17** | Dział I | Negatywne przesłanki procesowe — fundament każdego wniosku o umorzenie |
| 4 | **art. 313** | 35 | Przedstawienie zarzutów — moment, od którego biegną prawa podejrzanego |
| 5 | **art. 156 §5** | 17 | Dostęp do akt w postępowaniu przygotowawczym — pierwszy realny ruch obrońcy |
| 6 | **art. 193–206** | 22 | Biegli w procesie karnym. `mod-KPC-biegli-sadowi-opinie` obsługuje **wyłącznie KPC** — po stronie karnej jest zero, łącznie z art. 201 (opinia niepełna/sprzeczna) |
| 7 | **art. 410, 413, 424** | 47 | Podstawa wyroku, treść wyroku, wymogi uzasadnienia — punkt zaczepienia dla zarzutu z art. 438 pkt 3 |
| 8 | **art. 370** | 43 | Kolejność zadawania pytań na rozprawie. `przesluchanie-swiadkow-v2` buduje strategię krzyżową bez przepisu, który tę kolejność reguluje |
| 9 | **art. 485–499** | 52 | Cała procedura prywatnoskargowa. Skille pokrywają art. 212/216 KK materialnie bardzo dobrze, ale nie wiedzą, jak tę sprawę poprowadzić (posiedzenie pojednawcze, uproszczony akt oskarżenia) |
| 10 | **art. 552–559** | 58 | Odszkodowanie za niesłuszne skazanie/TA — samodzielne roszczenie z własnym terminem |
| 11 | **art. 623–624** | 69 | Zwolnienie od kosztów sądowych w karnym. Odpowiednik cywilny (KSCU) jest pokryty — karny nie |
| 12 | **art. 568a–577** | 60 | Wyrok łączny. Luka podwójna: brak też dedykowanego modułu do art. 85–86 KK |

### 4. Luki całościowe (całe działy bez treści)
- **Dział IV, Rozdz. 15–18** (doręczenia, protokoły, dostęp do akt, odtworzenie akt) — doręczenia decydują o biegu terminów, które `shared/TERM-CALC` liczy bez podstawy z art. 128–142.
- **Dział XIII poza ENA** — 24 z 26 rozdziałów istnieje wyłącznie jako lista nazw w „mapie rozdziałów" `mod-KPK-wspolpraca-miedzynarodowa-karna`, który sam sygnalizuje: „sprawdź dokładne numery artykułów w ISAP, nie cytuj z pamięci".
- **Dział XV** (sądy wojskowe, art. 646–682) — nieobecny w całości.

### 5. Ustalenie poboczne: nieaktualność metryki w MAPA-AKTOW
`dr-03/MAPA-AKTOW.md` konsekwentnie cytuje KPK jako **Dz.U. 2026 poz. 490 t.j.** Tekst jednolity jest prawidłowy, ale od jego ogłoszenia weszły w życie co najmniej dwie nowelizacje:
- **Dz.U. 2026 poz. 421**,
- **Dz.U. 2026 poz. 638** (ustawa z 27.03.2026, obowiązuje od **28.05.2026**) — nowe brzmienie **art. 25 §1 pkt 2 KPK**, czyli zmiana właściwości rzeczowej sądu okręgowego (Rozdz. 1), z przepisem przejściowym utrwalającym właściwość w sprawach już wniesionych.

Rozdział 1 jest w tabeli oznaczony jako 🟡 CZĘŚCIOWE — ale nawet ta częściowa treść odnosi się do stanu sprzed 28.05.2026.

---

## Rekomendowana kolejność uzupełnień

**Priorytet 1 — bez tego system nie napisze poprawnego pisma karnego:**
1. `mod-KPK-srodki-zapobiegawcze-tymczasowe-aresztowanie` (art. 249–263)
2. `mod-KPK-podstawy-odwolawcze` (art. 425–443a, rdzeń: 438 i 439)
3. `mod-KPK-przeslanki-procesowe` (art. 17 + 22 + 11)

**Priorytet 2 — obsługa etapu przygotowawczego:**
4. `mod-KPK-postepowanie-przygotowawcze` (art. 297–302a, 303–308, 313–321, 325a–325i)
5. `mod-KPK-dostep-do-akt` (art. 156, 159)

**Priorytet 3 — rozprawa i wyrok:**
6. `mod-KPK-rozprawa-glowna` (art. 365–380, w szczególności 370)
7. `mod-KPK-wyrokowanie` (art. 408–424)
8. `mod-KPK-biegli-karne` (art. 193–206)

**Priorytet 4 — tryby i następstwa:**
9. `mod-KPK-oskarzenie-prywatne` (art. 485–499)
10. `mod-KPK-odszkodowanie-niesluszne-skazanie` (art. 552–559)
11. `mod-KPK-wyrok-laczny` (art. 568a–577 + KK art. 85–86)
12. `mod-KPK-doreczenia` (art. 128–142)

**Priorytet 5 — aktualizacja metryki:**
13. Uzupełnić `dr-03/MAPA-AKTOW.md` o Dz.U. 2026 poz. 421 i 638; zweryfikować nowe brzmienie art. 25 §1 pkt 2 w ISAP.

---

## Zastrzeżenie metodologiczne

Raport mapuje **odwołania do przepisów**, nie jakość merytoryczną każdego opisu. Rozdział oznaczony 🟡 może zawierać opis bardzo dobry (np. Rozdz. 39 — art. 335 opisany wzorcowo) albo samą wzmiankę w tabeli (np. Rozdz. 59 — ułaskawienie wspomniane wyłącznie ustrojowo). Kolumna „Luka" rozstrzyga, który to przypadek.

Struktura rozdziałowa KPK zweryfikowana online 13.08.2026 wobec tekstu jednolitego Dz.U. 2026 poz. 490. Przed powołaniem któregokolwiek przepisu w piśmie procesowym obowiązuje standardowa weryfikacja w ISAP zgodnie z `shared/PRAWO-HARDGATE`.
