# Upadłość — postępowanie międzynarodowe, po śmierci dłużnika, deweloper (PrUp art. 378–425s)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535), s. 74–85
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]; rozporządzenie (UE) 2015/848 w sprawie postępowania upadłościowego — „obowiązuje” ✅ [VER: eurlex_lookup CELEX 32015R0848, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article 425e --verify-online`. Część druga PrUp ustępuje umowie międzynarodowej i prawu organizacji międzynarodowej (art. 378 ust. 1) — przy elemencie unijnym najpierw ustal zakres rozporządzenia 2015/848; jego treść odczytaj z EUR-Lex, nie z pamięci. Upadłość dewelopera: dołącz aktualną ustawę o ochronie nabywcy (Dz.U. 2024 poz. 695 ze zm., wskazaną w art. 425a). Likwidacja masy (art. 306–334) → `mod-PrUpad-syndyk-likwidacja`.

---

## FAZA 0 — INTAKE

```
□ Element zagraniczny? Państwo COMI, oddziały, majątek, wierzyciele → czy stosuje się rozp. 2015/848 / umowa (378)?
□ Postępowanie zagraniczne: główne czy uboczne (379 pkt 2–3); czy jest prawomocne uznanie (379 pkt 7)?
□ Wnioskodawca uznania: zarządca zagraniczny / dłużnik z zarządem własnym (386 ust. 1); zaliczka 1× wynagrodzenia GUS III kw. (386 ust. 6)
□ Wierzyciele „polscy” w rozumieniu 386 ust. 2 pkt 3 / 407 / 410a ust. 2 — spis, doręczenia, prawo do wtórnego postępowania (30 dni od obwieszczenia)
□ Wierzyciel spoza UE bez pełnomocnika w PL → pełnomocnik do doręczeń (380 ust. 2–3)
□ Dłużnik zmarły przed wnioskiem? Termin z art. 7 (rok od śmierci; przy zarządzie sukcesyjnym — do jego wygaśnięcia; odczytaj całość). Spadkobiercy (stwierdzenie nabycia), kurator spadku, nabywca spadku, zarząd sukcesyjny (418–419)
□ Czynności zmarłego z 6 miesięcy przed śmiercią (423)
□ Deweloper (art. 5 pkt 1 ustawy o ochronie nabywcy): przedsięwzięcia, rachunki powiernicze, hipoteki i zgody banku, wcześniejsza sanacja i dopłaty, UFG/DFG
□ Termin 3 miesięcy od ogłoszenia na decyzję sędziego-komisarza o kontynuacji (425e ust. 2a); 30 dni na propozycje układowe nabywców (425n)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 378–381 | pierwszeństwo umów i prawa UE, definicje, wierzyciele zagraniczni, odesłanie do KPC | A |
| 382–384 | jurysdykcja krajowa, wyłączenie umów o jurysdykcję, zarządca zagraniczny | B |
| 386–404 | uznanie orzeczenia o wszczęciu zagranicznego postępowania: wniosek, zabezpieczenie, przesłanki, postanowienie, skutki, likwidacja majątku w PL | C |
| 405–412 | wtórne postępowanie upadłościowe, układ zagraniczny, nadwyżka | D |
| 413–417 | współpraca z sądami i zarządcami zagranicznymi, podział majątku między postępowania | E |
| 418–425 | upadłość wszczęta po śmierci dłużnika | F |
| 425a–425s | upadłość dewelopera: kontynuacja, likwidacja nieruchomości, przejęcie przez przedsiębiorcę, układ nabywców | G |
| uchylone | 385, 391, 399, 400, 420 (oraz 378 ust. 2) | — |

---

## A. Przepisy ogólne części drugiej (art. 378–381)

- **Art. 378:** przepisów części drugiej nie stosuje się, jeżeli **umowa międzynarodowa** RP albo **prawo organizacji międzynarodowej** stanowi inaczej (ust. 1; ust. 2 uchylony).
- **Art. 379 — definicje:** **zagraniczne postępowanie upadłościowe** — sądowe, administracyjne lub nadzorowane przez sąd zagraniczny postępowanie zbiorowe wobec dłużnika niewypłacalnego lub zagrożonego niewypłacalnością, w którym mienie podlega kontroli lub zarządowi w celu restrukturyzacji lub likwidacji (pkt 1); **główne** — w państwie **głównego ośrodka podstawowej działalności** (pkt 2); **uboczne** — niegłówne, w państwie miejsca działalności, zamieszkania/siedziby lub majątku (pkt 3); **zarządca zagraniczny** (pkt 4); **sąd zagraniczny** — także inny organ uprawniony (pkt 5); **miejsce prowadzenia działalności** — czynności ekonomiczne niejednorazowe i niekrótkotrwałe (pkt 6); **uznane** postępowanie — z prawomocnym postanowieniem polskiego sądu o uznaniu (pkt 7).
- **Art. 380:** wierzyciel zagraniczny ma **te same prawa** co krajowy (ust. 1). Wierzyciel bez miejsca zamieszkania/pobytu/siedziby w PL lub UE, bez pełnomocnika procesowego w PL — obowiązek wskazania **pełnomocnika do doręczeń** (ust. 2); w braku — pisma pozostają w aktach **ze skutkiem doręczenia**, z pouczeniem przy pierwszym doręczeniu (ust. 3). **Zagraniczne należności publicznoprawne** (podatki, składki) można zgłosić, jeżeli dochodzenie w PL jest dopuszczalne — **kategoria druga**; zagraniczne kary majątkowe niecywilnoprawne — **kategoria trzecia** (ust. 4).
- **Art. 381:** w sprawach nieuregulowanych — odpowiednio część pierwsza PrUp i przepisy **KPC o międzynarodowym postępowaniu cywilnym**.

## B. Jurysdykcja krajowa (art. 382–384)

- **Art. 382:** **wyłączna** jurysdykcja polska, gdy w PL jest **główny ośrodek podstawowej działalności** dłużnika (ust. 1); jurysdykcja **niewyłączna**, gdy dłużnik prowadzi w PL działalność albo ma miejsce zamieszkania, siedzibę lub majątek (ust. 2). Jurysdykcja wyłączna → postępowanie **główne**; pozostałe → **uboczne** (ust. 3).
- **Art. 383:** w sprawach upadłościowych **nie stosuje się umów o jurysdykcję**.
- **Art. 384:** ustanowienie przez sąd zagraniczny zarządcy do działań w PL **nie wyłącza** jurysdykcji sądów polskich.
- **Art. 385:** uchylony.

## C. Uznanie zagranicznego postępowania (art. 386–404)

- **Art. 386:** wniosek **zarządcy zagranicznego** albo dłużnika z **zarządem własnym** (ust. 1). Załączniki: odpis orzeczenia o wszczęciu i ustanowieniu zarządcy **albo** zaświadczenie sądu zagranicznego (pkt 1–2); **spis wierzycieli** z miejscem zamieszkania/siedzibą/COMI w PL, z wierzytelnościami z działalności dłużnika w PL oraz zabezpieczonych na majątku w PL (hipoteka, zastaw, zastaw skarbowy/rejestrowy, hipoteka morska, przewłaszczenie i przelew na zabezpieczenie) (pkt 3) (ust. 2); w braku pkt 1–2 — inny wiarygodny dowód na piśmie (ust. 3); oświadczenie o innych znanych postępowaniach zagranicznych oraz o terminie, adresie, danych i **języku zgłoszeń** (ust. 4); **uwierzytelnione tłumaczenie** (ust. 5). **Zaliczka** na wydatki = **1× przeciętne miesięczne wynagrodzenie** (sektor przedsiębiorstw, **III kwartał roku poprzedniego**) z dowodem przy wniosku; w braku — wezwanie w **tydzień** pod rygorem **zwrotu wniosku** (ust. 6).
- **Art. 387:** uczestnicy: zarządca zagraniczny albo dłużnik z zarządem własnym.
- **Art. 388:** zawiadomienie o pierwszym posiedzeniu może nastąpić **przesyłką poleconą** przez operatora pocztowego (za potwierdzeniem / zwrotnym pokwitowaniem odbioru) albo na **adres do doręczeń elektronicznych** z bazy adresów elektronicznych.
- **Art. 389:** wnioskodawca niezwłocznie informuje sąd o zmianach postępowania zagranicznego i zarządcy (pkt 1) oraz o innych znanych postępowaniach upadłościowych i sądowych/administracyjnych/arbitrażowych dotyczących majątku (pkt 2).
- **Art. 390:** od wniesienia wniosku sąd na wniosek może **zabezpieczyć** (postanowienie o zabezpieczeniu) i **zabezpieczyć dowody** (ust. 1); może odmówić, jeżeli zabezpieczenie utrudniałoby zarządzanie majątkiem w **głównym** postępowaniu zagranicznym (ust. 2).
- **Art. 391:** uchylony.
- **Art. 392 — przesłanki uznania:** sprawa **nie należy do wyłącznej jurysdykcji** sądów polskich (pkt 1) i uznanie **nie jest sprzeczne z podstawowymi zasadami porządku prawnego** RP (pkt 2).
- **Art. 393:** postanowienie określa: dane upadłego i reprezentantów (przy spółce osobowej — wspólników odpowiadających bez ograniczenia) (pkt 1), numer identyfikacyjny/rejestr/NIP (pkt 1a; ust. 1a — dane jak w art. 22 ust. 4), sąd zagraniczny (pkt 2), zarządcę (pkt 3), **charakter główny lub uboczny** (pkt 4) (ust. 1); **wezwanie wierzycieli** do zgłoszeń (termin, adres, dane, język) (ust. 2); **obwieszczenie** (ust. 3); doręczenie wierzycielom ze spisu i innym znanym sądowi, z pouczeniem o skutkach uznania i o **wniosku o wtórne postępowanie oraz skutkach jego niezłożenia w 30 dni od obwieszczenia** (ust. 4); **zażalenie** wnioskodawcy i wierzycielom z art. 386 ust. 2 pkt 3 — sąd II instancji w składzie **trzech sędziów** (ust. 5).
- **Art. 393a:** niezwłocznie po uznaniu sąd zabezpiecza majątek w PL przez **tymczasowego nadzorcę sądowego** (ust. 1). Czynności zarządcy zagranicznego / dłużnika przekraczające **zwykły zarząd** majątkiem w PL wymagają zgody nadzorcy **pod rygorem nieważności** (chyba że wymagają zgody sądu); także **wywóz składników za granicę** (ust. 2). Zabezpieczenie **upada z mocy prawa** z wszczęciem wtórnego postępowania, prawomocnym oddaleniem/odrzuceniem wniosku o nie, umorzeniem albo **niezłożeniem wniosku w 30 dni** od obwieszczenia (ust. 3). Od uznania (głównego i ubocznego) — zabezpieczenie dowodów na wniosek zarządcy (ust. 4).
- **Art. 394:** uznanie obejmuje z mocy prawa orzeczenia o powołaniu, odwołaniu, zmianie zarządcy oraz o toku, zawieszeniu i zakończeniu postępowania (ust. 1). **Egzekucja** z zagranicznych tytułów wydanych w uznanym postępowaniu (w tym listy wierzytelności, układu i wyciągów z niego) — po **stwierdzeniu wykonalności** przez sąd uznający (ust. 2), przez nadanie **klauzuli** na wniosek wierzyciela, z odpowiednim zastosowaniem art. 392 (ust. 3).
- **Art. 395:** zmiana lub uchylenie uznania **w każdym czasie**, gdy podstaw nie było lub odpadły (ust. 1); **obligatoryjne uchylenie**, gdy przyjęto za granicą układ **rażąco sprzeczny z prawem polskim** (ust. 1a); na wniosek każdego zainteresowanego lub z urzędu (ust. 2); art. 393 ust. 3–5 odpowiednio (ust. 3).
- **Art. 396:** w zmianie określa się zakres, zwłaszcza uprawnień zarządcy (ust. 1); pozbawienie zarządcy prawa prowadzenia postępowań cywilnych → **umorzenie** wszczętych przez niego spraw, chyba że sąd dopuści wstąpienie innego zarządcy, syndyka lub dłużnika; odpowiednio do interwencji ubocznych (ust. 2).
- **Art. 397:** od uznania skutki wszczęcia postępowania zagranicznego dla postępowań w PL (sądowych, egzekucyjnych, administracyjnych, sądowoadministracyjnych, arbitrażowych) ocenia się według **prawa polskiego**, z uwzględnieniem likwidacyjnego/restrukturyzacyjnego charakteru, zakresu pozbawienia zarządu i objęcia układem; także dopuszczalność wszczęcia postępowań (ust. 1); dopuszczalne powództwa przeciw upadłemu konieczne dla **zachowania praw osób trzecich** (ust. 2).
- **Art. 398:** art. 397 nie ogranicza prawa wierzycieli do wniosku o upadłość w PL i zgłaszania w niej wierzytelności.
- **Art. 399, 400:** uchylone.
- **Art. 400a:** po uznaniu postępowanie toczy się w **sądzie, który uznał** orzeczenie.
- **Art. 401** (uznane postępowanie **główne**): zarządca / dłużnik sporządza **spis inwentarza i oszacowanie** majątku w PL i składa je w **4 miesiące** od uprawomocnienia uznania; obwieszczenie; wnioski o **wyłączenie z masy** rozpoznaje sąd uznający — termin **30 dni** od obwieszczenia (ust. 1). Następnie **plan likwidacji** majątku w PL i informacja o sposobie zaspokojenia → **zezwolenie na likwidację** (nie wcześniej niż po terminie na wyłączenia); na odmowę zażalenie do składu trzech sędziów (ust. 2). Zezwolenie nie obejmuje mienia objętego sporem o wyłączenie — likwidacja dopiero po prawomocnym oddaleniu, umorzeniu lub upływie terminu na powództwo (ust. 3). Skład masy, spis, wyłączenia, zarząd i likwidacja — **według PrUp**; sąd może zezwolić na inny sposób, jeżeli nie narusza podstawowych zasad porządku prawnego (ust. 4). **Zakończenie** po likwidacji majątku w PL (ust. 5), a także po wszczęciu wtórnego postępowania lub prawomocnym uchyleniu uznania (ust. 6).
- **Art. 402:** zarządca zagraniczny może **złożyć wniosek o upadłość** w PL i uczestniczyć w niej **jak wierzyciel**.
- **Art. 403:** skutki ogłoszenia upadłości dla majątku w PL i zobowiązań powstałych lub wykonywanych w PL — **prawo polskie** (ust. 1); **bezskuteczność i zaskarżanie** czynności dotyczących mienia w PL — prawo polskie (ust. 2).
- **Art. 404:** zaspokojenie wierzytelności zabezpieczonych ograniczonymi prawami rzeczowymi na rzeczach w PL lub wpisanych do polskich ksiąg i rejestrów — **prawo polskie**; bez art. 313 ust. 2 zd. 5 (ust. 1). **Hipoteka wygasa** z zawarciem umowy sprzedaży, pod warunkiem wpływu środków na **rachunek depozytowy Ministra Finansów**; podstawa wykreślenia — zaświadczenie sądu uznającego (ust. 2). Wypłata z depozytu bezpośrednio wierzycielom po zatwierdzeniu planu podziału zarządcy albo na podstawie postanowienia sądu uznającego (ust. 3).

## D. Wtórne postępowanie upadłościowe (art. 405–412)

- **Art. 405:** uznanie nie wyklucza upadłości w PL; przy uznanym postępowaniu **głównym** polskie postępowanie jest **wtórne** (ust. 1) i podlega temu tytułowi (ust. 2); przy uznanym **ubocznym** — zasady ogólne (ust. 3).
- **Art. 406:** przepisy o wtórnym postępowaniu stosuje się także do postępowań wszczętych **przed** uznaniem, jeżeli sąd uzna zagraniczne za główne (ust. 1); sąd **zmienia** postanowienie o ogłoszeniu upadłości na postanowienie o wszczęciu wtórnego postępowania (ust. 2).
- **Art. 407:** legitymacja do wniosku: wierzyciel z miejscem zamieszkania/siedzibą/COMI w PL, wierzyciel z wierzytelnością z działalności dłużnika w PL, wierzyciel zabezpieczony rzeczowo na majątku w PL (katalog jak w art. 386 ust. 2 pkt 3).
- **Art. 408:** przy uznanym postępowaniu głównym **domniemywa się niewypłacalność** dłużnika.
- **Art. 409:** po wniosku o wtórne postępowanie sąd może uchylić lub zmienić zabezpieczenia z art. 390.
- **Art. 410:** po wszczęciu wtórnego postępowania **syndyk przejmuje zarząd** majątkiem w PL (pkt 1) i **wstępuje** do postępowań prowadzonych przez zarządcę zagranicznego lub dłużnika (pkt 2).
- **Art. 410a:** układ zawarty w uznanym głównym postępowaniu, **nie rażąco sprzeczny** z prawem polskim → sąd wyznacza **zgromadzenie wierzycieli** w celu głosowania nad uznaniem skuteczności układu (ust. 1); głosują wierzyciele z katalogu jak w art. 407 (ust. 2); odpowiednio przepisy o głosowaniu nad układem w upadłości (ust. 3).
- **Art. 410b:** brak uchwały o uznaniu skuteczności → **umorzenie** wtórnego postępowania i **uchylenie uznania** (ust. 1); art. 393 ust. 3–5 odpowiednio (ust. 2).
- **Art. 411:** gdy w postępowaniu głównym ma nastąpić likwidacja, układ we wtórnym może mieć wyłącznie charakter **likwidacyjny**.
- **Art. 412:** **nadwyżka** po zaspokojeniu wierzycieli we wtórnym postępowaniu → do głównego postępowania zagranicznego.

## E. Współpraca (art. 413–417)

- **Art. 413:** sąd i sędzia-komisarz mogą porozumiewać się **bezpośrednio** z sądem i zarządcą zagranicznym (telefon, faks, e-mail).
- **Art. 414:** syndyk porozumiewa się z nimi bezpośrednio lub przez sędziego-komisarza.
- **Art. 415:** obowiązek **współpracy** sądu i sędziego-komisarza (ust. 1); przy postępowaniu w PL działania podejmuje sąd je prowadzący (ust. 2).
- **Art. 416:** przekazywanie i żądanie informacji o majątku i jego położeniu, postępowaniach dotyczących upadłego (pkt 1), zabezpieczeniu i likwidacji (pkt 2), zaspokojeniu wierzycieli (pkt 3).
- **Art. 417:** przy postępowaniu w PL i **co najmniej dwóch** uznanych zagranicznych sędzia-komisarz określa, **jaki majątek** obejmuje każde z postępowań; zażalenie (ust. 1); bez postępowania w PL — postanawia sąd uznający; odpowiednio część pierwsza tytuł II (ust. 2).

## F. Upadłość wszczęta po śmierci dłużnika (art. 418–425)

- **Art. 418:** wniosek o upadłość przedsiębiorcy lub osoby z art. 8 lub 9 **złożony po jej śmierci** → postępowanie według tego tytułu. (Śmierć upadłego w toku postępowania to inna sytuacja — nie stosuj tytułu automatycznie.)
- **Art. 419:** gdy nie uczestniczy spadkobierca z **prawomocnym stwierdzeniem nabycia spadku** ani kurator spadku — sąd w postanowieniu o ogłoszeniu ustanawia **kuratora** (art. 187 odpowiednio); później orzeka sędzia-komisarz (ust. 1). Przy **zbyciu spadku** przed ogłoszeniem — udział **nabywcy spadku**, do którego stosuje się przepisy o upadłym (ust. 2). Przy **zarządzie sukcesyjnym** — uczestnikiem jest także **zarządca sukcesyjny**; zażalenie na ogłoszenie przysługuje osobie pełniącej tę funkcję w chwili ogłoszenia (ust. 3).
- **Art. 420:** uchylony.
- **Art. 421:** masa = **aktywa spadku**, a przy zarządzie sukcesyjnym także aktywa nabyte w jego okresie, które weszły do przedsiębiorstwa w spadku.
- **Art. 422:** ustanowienie **wykonawcy testamentu**, **zapisy** i **polecenia** — bezskuteczne wobec masy.
- **Art. 423:** do czynności dokonanych **6 miesięcy przed śmiercią** stosuje się art. 127–130a (bezskuteczność → `mod-PrUpad-skutki-masa-bezskutecznosc`).
- **Art. 424:** skutki prawne **przyjęcia spadku** powstają **po zakończeniu** postępowania upadłościowego.
- **Art. 425:** po zakończeniu albo umorzeniu — **wyciąg z zatwierdzonej listy** (wierzytelność i otrzymane sumy) jest **tytułem egzekucyjnym przeciwko spadkobiercy**.

## G. Upadłość dewelopera (art. 425a–425s)

**Przepisy ogólne (425a–425d)**
- **Art. 425a:** zakres — upadłość **dewelopera** w rozumieniu art. 5 pkt 1 ustawy z 20.05.2021 o ochronie praw nabywcy lokalu mieszkalnego lub domu jednorodzinnego oraz Deweloperskim Funduszu Gwarancyjnym („ustawa o ochronie nabywcy”).
- **Art. 425b:** cele z art. 2 oraz **zaspokojenie nabywców przez przeniesienie własności lokali**, o ile racjonalne względy pozwolą.
- **Art. 425c:** **nabywca** — osoba/jednostka, wobec której deweloper zobowiązał się przenieść prawa z umowy deweloperskiej (art. 5 pkt 6 ustawy o ochronie nabywcy) lub umów z art. 2 ust. 1 pkt 2, 3, 5 lub ust. 2 tej ustawy, i która zobowiązała się do świadczenia pieniężnego (pkt 1); **przeniesienie własności lokalu** — lokal mieszkalny, dom jednorodzinny z gruntem (własność lub użytkowanie wieczyste), udział ułamkowy, lokal użytkowy z umowy z art. 2 ust. 2 (pkt 2); **umowa deweloperska** (pkt 3).
- **Art. 425d:** gdy upadły jest **emitentem obligacji** zabezpieczonych na nieruchomości przedsięwzięcia — **nie stosuje się art. 488–490**.

**Dalsze prowadzenie przedsięwzięcia (425e–425h)**
- **Art. 425e:** syndyk może kontynuować przedsięwzięcie **za zgodą sędziego-komisarza**, gdy jest ekonomicznie uzasadnione i są szanse ukończenia (ust. 1). Kontynuacja **obowiązkowa**, gdy we wcześniejszej sanacji nabywcy podjęli uchwałę z art. 358 ust. 4 PrRestr i wpłacili/zabezpieczyli dopłaty w terminach z art. 359 ust. 1–2 PrRestr, a układ nie doszedł do skutku — chyba że sędzia-komisarz zgodzi się na odstąpienie (ust. 2). Odmowa, zgoda na odstąpienie albo **brak postanowienia w 3 miesiące od ogłoszenia** → z mocy prawa **odstąpienie od umów deweloperskich** (art. 98); do roszczeń nabywców art. 91 odpowiednio (ust. 2a); syndyk informuje bank/SKOK prowadzący **mieszkaniowy rachunek powierniczy** i dysponuje **zwrotem środków nabywcom** (ust. 2b). Dopłaty z sanacji — na **odrębnym rachunku**; przy odstąpieniu zwrot, zabezpieczenia wygasają (ust. 3); odpowiednio przy oddaleniu/odrzuceniu wniosku lub umorzeniu (ust. 4).
- **Art. 425f:** przy kontynuacji syndyk **nie może odstąpić** od umowy deweloperskiej (art. 98 w tym zakresie i art. 91 nie stosuje się); roszczenie nabywcy zaspokaja się **przeniesieniem własności lokalu** (ust. 1), które **nie wywołuje skutków sprzedaży egzekucyjnej**; bez art. 313 (ust. 2).
- **Art. 425g:** **zgoda wierzyciela hipotecznego** (art. 25 ust. 1 pkt 1–2 ustawy o ochronie nabywcy; art. 76 ust. 4 zd. 2 ustawy o KW i hipotece) pozostaje w mocy; warunek zapłaty nabywcy spełnia też zapłata **do rąk syndyka** lub zarządcy z wcześniejszej sanacji.
- **Art. 425h:** gdy kontynuacja przestaje być racjonalna — sędzia-komisarz na wniosek syndyka zgadza się na **zaprzestanie**; zażalenie (ust. 1); uprawomocnienie → odstąpienie od umów z mocy prawa (art. 98, art. 91 odpowiednio) (ust. 2); zwrot niewykorzystanych dopłat (ust. 3); dyspozycja zwrotu środków z rachunku powierniczego (ust. 4).

**Likwidacja nieruchomości (425i–425k)**
- **Art. 425i:** sumy z likwidacji nieruchomości przedsięwzięcia — podział na zasadach ogólnych, ale przy zgodzie (zobowiązaniu) wierzyciela hipotecznego roszczenie nabywcy ma **pierwszeństwo przed hipoteką** w zakresie dokonanych wpłat.
- **Art. 425j:** roszczenia z **odstąpienia** od umowy deweloperskiej zaspokaja się z sum z likwidacji nieruchomości **jak roszczenie z umowy**; pierwszeństwo z **ujawnienia roszczenia w KW** — także gdy wpis wykreślono.
- **Art. 425ja:** wierzytelności nabywcy z umowy, na podstawie której wypłacono świadczenia z **Ubezpieczeniowego Funduszu Gwarancyjnego**, zaspokaja się **po należnościach funduszu** z art. 48 ust. 5 ustawy o ochronie nabywcy.
- **Art. 425k:** roszczenie pieniężne nabywcy z **przekształcenia** roszczenia w toku restrukturyzacji lub upadłości — jak w art. 425j.

**Kontynuacja przez innego przedsiębiorcę (425l–425m)**
- **Art. 425l:** na wniosek syndyka sędzia-komisarz może zgodzić się na **sprzedaż nieruchomości przedsiębiorcy zobowiązanemu do kontynuacji** (ust. 1). Nabywca odpowiada **solidarnie** z upadłym za zobowiązania z umów deweloperskich, z ich przekształcenia lub odstąpienia — te zobowiązania **nie są zaspokajane w upadłości** (ust. 2); nabywa prawa upadłego z tych umów (ust. 3); sprzedaż **bez skutków egzekucyjnych**, bez art. 313 (ust. 4); sędzia-komisarz uwzględnia interes nabywców i prawdopodobieństwo dokończenia (ust. 5); bez art. 98 i 91 (ust. 6); bez art. 336, 345, 346 (ust. 7).
- **Art. 425m:** nabywca nieruchomości zawiera umowę **mieszkaniowego rachunku powierniczego w 30 dni** od zgody i informuje syndyka (ust. 1); syndyk dysponuje przekazaniem środków na nowy rachunek (ust. 2); umowa rachunku upadłego **wygasa** po przekazaniu (ust. 3).

**Kontynuacja w układzie (425n–425s)**
- **Art. 425n:** nabywcy stanowiący **≥ 20% liczby nabywców** przedsięwzięcia mogą zgłosić propozycje układowe w **30 dni od ogłoszenia** upadłości.
- **Art. 425o:** propozycje mogą obejmować: **dopłaty** i zaspokojenie przez przeniesienie własności (z możliwym późniejszym zwrotem dopłat) (pkt 1), **sprzedaż nieruchomości z obciążeniami** przedsiębiorcy przejmującemu zobowiązania i kontynuację, ze zmianą umów (pkt 2), inne warunki i finansowanie (pkt 3), **zamianę lokali** (pkt 4) (ust. 1); art. 162 PrRestr odpowiednio (ust. 2).
- **Art. 425p:** dopuszczalne **różne traktowanie** nabywców wpłacających i niewpłacających dopłat (ust. 1); przy wariancie pkt 2 — **nieodwołalne oświadczenie przedsiębiorcy w formie aktu notarialnego**, które po prawomocnym zatwierdzeniu układu zastępuje jego oświadczenie woli (umowa zawarta) (ust. 2); postanowienie z oświadczeniem — **podstawa wpisu w KW**; art. 425m odpowiednio (ust. 3).
- **Art. 425q:** głosowanie **w grupach**; nabywcy — **odrębna grupa** z odrębną listą; dopuszczalny dalszy podział (np. według stopnia wykonania umowy).
- **Art. 425r:** przy propozycji dopłat sędzia-komisarz niezwłocznie przeprowadza **wstępne głosowanie nabywców** (ust. 1) na podstawie listy syndyka (ust. 2); uchwała przyjęta, gdy za nią są nabywcy deklarujący **dopłaty wystarczające do sfinansowania dokończenia** (ust. 3); stwierdza ją sędzia-komisarz postanowieniem (ust. 4).
- **Art. 425s:** dopłaty wpłaca się do masy lub zabezpiecza w **2 miesiące** od uchwały (przedłużalne) (ust. 1); braki można uzupełnić w **30 dni** od upływu, a upadły/syndyk może wykazać inne źródła finansowania (ust. 2); sędzia-komisarz stwierdza wystarczające środki i wyznacza **zgromadzenie** — układ nie może odbiegać od uchwały nabywców, sąd odmawia zatwierdzenia odmiennego (ust. 3); po wpłatach przedsięwzięcie może być kontynuowane (ust. 4); przy niedojściu układu do skutku odstąpienie syndyka wymaga **zgody sędziego-komisarza** (ust. 5); dopłaty na odrębnym rachunku, zwrot przy odstąpieniu, zabezpieczenia wygasają (ust. 6); dyspozycja zwrotu środków z rachunku powierniczego (ust. 7).

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| 1× wynagrodzenie GUS (III kw. roku poprz.); tydzień | zaliczka na uznanie; wezwanie pod rygorem zwrotu | art. 386 ust. 6 |
| 30 dni od obwieszczenia uznania | wniosek o wtórne postępowanie (upadek zabezpieczenia 393a) | art. 393 ust. 4; 393a ust. 3 |
| 3 sędziów | zażalenie na uznanie / odmowę zezwolenia na likwidację | art. 393 ust. 5; 401 ust. 2 |
| 4 miesiące od uprawomocnienia uznania | spis inwentarza i oszacowanie | art. 401 ust. 1 |
| 30 dni od obwieszczenia spisu | wnioski o wyłączenie z masy | art. 401 ust. 1 |
| 6 miesięcy przed śmiercią | czynności zmarłego — art. 127–130a | art. 423 |
| 3 miesiące od ogłoszenia | brak decyzji o kontynuacji → odstąpienie od umów deweloperskich | art. 425e ust. 2a |
| 30 dni od zgody | umowa rachunku powierniczego przez przedsiębiorcę | art. 425m ust. 1 |
| ≥ 20% nabywców; 30 dni od ogłoszenia | propozycje układowe nabywców | art. 425n |
| 2 miesiące + 30 dni | wpłata/zabezpieczenie dopłat; uzupełnienie | art. 425s ust. 1–2 |

## PUŁAPKI

- Rozporządzenie 2015/848 ma pierwszeństwo przed częścią drugą PrUp (art. 378) — nie stosuj art. 386 i n. do postępowań z innego państwa UE objętych rozporządzeniem bez ustalenia zakresu.
- Uznanie **ubocznego** postępowania nie czyni polskiego postępowania wtórnym (405 ust. 3).
- Czynność zarządcy zagranicznego przekraczająca zwykły zarząd bez zgody tymczasowego nadzorcy — **nieważna** (393a ust. 2).
- Brak wniosku o wtórne postępowanie w 30 dni — upada ochrona tymczasowego nadzorcy (393a ust. 3).
- Zagraniczna egzekucja w PL wymaga klauzuli sądu uznającego (394 ust. 2–3).
- Należności publicznoprawne zagraniczne — kat. II; kary niecywilnoprawne — kat. III (380 ust. 4).
- Art. 418 dotyczy wniosku złożonego **po** śmierci; masa = aktywa spadku; przyjęcie spadku skutkuje dopiero po zakończeniu (424).
- Deweloper: 3 miesiące bezczynności sędziego-komisarza = odstąpienie z mocy prawa (425e ust. 2a) — monitoruj termin.
- Przy kontynuacji (425f) i przejęciu (425l) syndyk nie odstępuje od umów deweloperskich, a sprzedaż nie ma skutków egzekucyjnych — obciążenia nie wygasają z mocy art. 313.
- Pierwszeństwo nabywcy przed hipoteką tylko przy zgodzie/zobowiązaniu banku i do wysokości wpłat (425i); pierwszeństwo z KW przetrwa wykreślenie wpisu (425j).
- Nabywcy z wypłatą UFG — zaspokojenie dopiero po funduszu (425ja).
- Obligacje zabezpieczone na nieruchomości przedsięwzięcia — art. 488–490 nie stosuje się (425d).

## POWIĄZANIA

- Likwidacja masy (art. 306–334), art. 313 → `mod-PrUpad-syndyk-likwidacja`
- Bezskuteczność (art. 127–130a), umowy wzajemne (art. 98), art. 91 → `mod-PrUpad-skutki-masa-bezskutecznosc`
- Kategorie zaspokojenia (art. 342), art. 336, 345, 346 → `mod-PrUpad-podzial-335-360`
- Jurysdykcja i właściwość w części pierwszej (tytuł II), kurator (art. 187) → `mod-PrUpad-organy-procedura`
- Układ w upadłości → `mod-PrUpad-uklad-likwidacja-zakonczenie`
- Banki, SKOK, obligacje (art. 426 i n., 488–490) → `mod-PrUpad-postepowania-odrebne-426-491-38`
- Sanacja dewelopera (PrRestr art. 358–359), art. 162 PrRestr → `mod-PrRestr-sanacja`, `mod-PrRestr-dzial-VI-uklad`
- Spadki (stwierdzenie nabycia, zarząd sukcesyjny) → `mod-KC-spadki`; transgraniczne → `mod-KC-spadki-dlugi-umowy-transgraniczne`

## WYNIK

Element zagraniczny: instrument (378 / rozp. 2015/848) → jurysdykcja (382) → uznanie z dokumentami i zaliczką (386, 392–393) → zabezpieczenie i nadzorca (390, 393a) → wtórne postępowanie w 30 dni (405–410) albo likwidacja przez zarządcę za zezwoleniem (401) → współpraca i rozdział majątku (413–417). Zmarły dłużnik: uczestnicy (419) → masa spadkowa (421–422) → bezskuteczność 6 mies. (423) → tytuł przeciw spadkobiercy (425). Deweloper: decyzja o kontynuacji w 3 mies. (425e) → wariant: kontynuacja (425f–425h) / likwidacja z pierwszeństwami (425i–425k) / przejęcie (425l–425m) / układ nabywców (425n–425s).
