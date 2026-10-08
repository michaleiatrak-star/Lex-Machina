# Upadłość konsumencka — osoba fizyczna nieprowadząca działalności (PrUp art. 491¹–491²⁴)

**Hasła spraw:** ogłosić upadłość konsumencką, upadłość konsumencka, oddłużenie, umorzenie długów, plan spłaty wierzycieli, wniosek o upadłość osoby fizycznej, niewypłacalność konsumenta

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535), s. 99–108
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article 491^15 --verify-online`. Wskaźniki GUS (491⁹, 491¹¹ᵃ, 491¹⁶ ust. 2e, 491¹⁸ ust. 3) ustalaj z publikacji Prezesa GUS za właściwy kwartał — nie z pamięci. Układ konsumencki na zgromadzeniu wierzycieli (art. 491²⁵–491³⁸, tytuł VI) → `mod-PrUpad-postepowania-odrebne-426-491-38`.

---

## FAZA 0 — INTAKE

```
□ Kto złożył wniosek: dłużnik / wyłącznie wierzyciel? (odrębności: 491² ust. 1 i 5, 491⁷ ust. 5, 491¹⁰ ust. 5, 491¹⁴ ust. 2, 491²² ust. 5)
□ Tryb: 491¹ ust. 1 (podstawowy, wyznaczony sędzia) czy ust. 2 (część pierwsza, sędzia-komisarz/referendarz)? Historia zmian trybu (491⁵ ust. 2)
□ Daty: obwieszczenie w KRZ (bieg 30 dni na zgłoszenia), uprawomocnienie postanowienia o upadłości
□ Wniosek dłużnika: kompletność 491² ust. 4 pkt 1–11, NIP z 10 lat, czynności z 12 mies., oświadczenie o prawdziwości
□ Informacje z US (5 lat) i KRS (10 lat) — rozbieżności z wnioskiem (491⁸ ust. 2 → 491¹⁰ ust. 2a)
□ Majątek: nieruchomość / mieszkanie upadłego, składniki > 5× wynagrodzenia GUS (III kw.) → zawiadomienie 491¹¹ᵃ
□ Przyczyny niewypłacalności: celowość (491¹⁴ᵃ) vs umyślność / rażące niedbalstwo (491¹⁵ ust. 1 pkt 3, ust. 1a)
□ Poprzednie oddłużenie w 10 latach przed wnioskiem (491¹⁴ᵃ ust. 1 pkt 2)
□ Dochody, możliwości zarobkowe, osoby na utrzymaniu, potrzeby mieszkaniowe, zdrowie (491¹⁵ ust. 4, 491¹⁶)
□ Zobowiązania nieumarzalne (491²¹ ust. 2) — alimenty, renty, grzywny, szkoda z przestępstwa, nieujawnione umyślnie
□ Koszty tymczasowo pokryte przez Skarb Państwa i niezaspokojone zobowiązania masy (491⁷, 491¹⁵ ust. 2–3)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 491¹–491³ | zakres podmiotowy, tryby, odpowiednie stosowanie części pierwszej i wyłączenia, wniosek, skład sądu | A |
| 491⁵–491⁶ᵃ | postanowienie o ogłoszeniu, wybór trybu, doręczenia, pouczenia wierzycieli i małżonka | B |
| 491⁷–491¹⁰ | koszty i zaliczka Skarbu Państwa, informacje US/KRS, wynagrodzenie syndyka, umorzenie postępowania | C |
| 491¹¹ᵃ–491¹²ᵃ | likwidacja, upoważnienie upadłego do sprzedaży, skarga na czynności syndyka | D |
| 491¹⁴–491¹⁶ | projekt planu / informacja, odmowa oddłużenia, plan spłaty, umorzenie bez planu i warunkowe | E |
| 491¹⁷–491²¹ | skarga kasacyjna, wykonanie, zmiana i uchylenie planu, rozprawa, umorzenie po wykonaniu | F |
| 491²²–491²⁴ | układ w toku upadłości, akta prowadzone przez syndyka | G |
| uchylone | 491⁴, 491¹¹, 491¹³ (oraz 491⁷ ust. 2) | — |

---

## A. Zakres, tryby, wniosek (art. 491¹–491³)

- **Art. 491¹:** tytuł stosuje się do **osób fizycznych, których upadłości nie można ogłosić według działu II tytułu I części pierwszej** (ust. 1). W postanowieniu o ogłoszeniu sąd może postanowić o prowadzeniu postępowania **według części pierwszej**, jeżeli uzasadnia to znaczny majątek, znaczna liczba wierzycieli lub przewidywany zwiększony stopień skomplikowania — zażalenie (ust. 2). W tym trybie stosuje się nadal **art. 491⁷, 491⁸ i 491¹⁰** (ust. 3); art. 361 — tylko gdy upadłość ogłoszono **wyłącznie** na wniosek wierzyciela; w przeciwnym razie sąd stwierdza zakończenie także przy braku masy lub gdy po likwidacji brak funduszów do podziału i nie sporządzono ostatecznego planu (ust. 4).
- **Art. 491²:**
  - ust. 1 — w sprawach nieuregulowanych przepisy o postępowaniu upadłościowym stosuje się **odpowiednio**, z wyłączeniem: **art. 21, 25, 145, 151–155, 163, 164, 168 ust. 1–3 i 5, 176 ust. 2, 244, 245, 253–264, 307 ust. 1, 337–339, 343 ust. 1a, 346 ust. 2, 347–356, 358–366**. Art. 13, 22a, 32 ust. 5, 36–40 i 43 — tylko gdy wniosek złożył **wyłącznie wierzyciel**; art. 361 — tylko gdy upadłość ogłoszono wyłącznie na skutek wniosku wierzyciela;
  - ust. 1a — w postępowaniu o ogłoszenie upadłości uczestnik może wnieść o **zatwierdzenie warunków sprzedaży składników o znacznej wartości** (pre-pack, art. 56a–56h odpowiednio);
  - ust. 2 — postępowanie prowadzi się **także przy jednym wierzycielu**;
  - ust. 3 — wniosek składa dłużnik (art. 8, 9); do pism dłużnika art. 216aa odpowiednio; w przypadku z art. 216aa ust. 1 — na **formularzu**; ust. 3a — doręczenia dłużnikowi: art. 220 ust. 3, 4 i 6;
  - ust. 4 — treść wniosku: **pkt 1** dane i PESEL (lub inne dane identyfikujące — ust. 5c: paszport, karta pobytu, rejestr/numer zagraniczny), **pkt 1a** NIP, jeżeli był w ciągu 10 lat, **pkt 2** miejsca majątku, **pkt 3** okoliczności i uprawdopodobnienie, **pkt 4** wykaz majątku z wyceną, **pkt 5** spis wierzycieli (adresy, kwoty, terminy), **pkt 6** wierzytelności sporne (wskazanie ≠ uznanie), **pkt 7** zabezpieczenia z datami, **pkt 8** przychody i koszty utrzymania z **6 miesięcy**, **pkt 9** czynności z **12 miesięcy** dotyczące nieruchomości, akcji, udziałów, **pkt 10** czynności z 12 miesięcy dotyczące ruchomości, wierzytelności, praw o wartości **> 10 000 zł**, **pkt 11** oświadczenie o prawdziwości danych;
  - ust. 5 — wniosek wierzyciela: bez pkt 2 i 4–11; sąd może zobowiązać dłużnika do informacji w **2 tygodnie**; ust. 5a — wartość z pkt 10 liczy się łącznie dla wszystkich czynności dotyczących tego samego prawa w 12 miesiącach; ust. 5b — **odpowiedzialność odszkodowawcza** dłużnika za nieprawdziwe oświadczenie; ust. 6 — rozporządzenie MS (formularze).
- **Art. 491³:** sprawy o ogłoszenie upadłości rozpoznaje sąd upadłościowy w składzie **jednego sędziego zawodowego**.
- **Art. 491⁴:** uchylony — nie stosuj dawnych przesłanek oddalenia wniosku.

## B. Postanowienie o ogłoszeniu i zawiadomienia (art. 491⁵–491⁶ᵃ)

- **Art. 491⁵:** postanowienie zawiera: dane upadłego, NIP (10 lat), określenie, że **nie prowadzi działalności**, wezwanie wierzycieli do zgłoszeń przez system teleinformatyczny w **30 dni od obwieszczenia w Rejestrze** (dla podmiotów z art. 216aa ust. 1 — adres syndyka), wezwanie uprawnionych z niewpisanych praw i roszczeń na nieruchomości (30 dni, rygor utraty prawa powoływania się), wyznaczenie syndyka, **tryb z art. 491¹ ust. 1 albo 2**, a przy trybie ust. 2 — czy sędzią-komisarzem będzie sędzia czy referendarz (ust. 1). O trybie ust. 2 sąd może postanowić **także po ogłoszeniu** — zażalenie; postanowienie o trybie obwieszcza się (ust. 2). W trybie ust. 1 czynności sędziego-komisarza wykonuje **wyznaczony sędzia** (ust. 3). Ust. 4 — dane identyfikujące jak w 491² ust. 5c.
- **Art. 491⁶:** postanowienie doręcza się syndykowi (ust. 1); powiadamia się **izbę administracji skarbowej** oraz oddział **ZUS lub KRUS** (ust. 2).
- **Art. 491⁶ᵃ:** syndyk w zawiadomieniu do wierzycieli poucza o art. 54a, 216a–216ab, 235–237, 239a–241, 491¹²ᵃ, 491¹⁴ ust. 5, 6 i 8, 491¹⁴ᵃ, 491¹⁶; wskazuje sąd właściwy do zaskarżenia postanowienia (art. 54a ust. 1), syndyka, adres zgłoszeń z art. 216aa ust. 1, termin lub sposób jego obliczenia oraz **rachunek do wpłaty ryczałtu z art. 235 ust. 1** (ust. 1). Małżonka dłużnika poucza o art. 124–126, 491¹⁴ ust. 5, 6 i 8, 491¹⁴ᵃ, 491¹⁶ (ust. 2).

## C. Koszty, informacje, wynagrodzenie, umorzenie postępowania (art. 491⁷–491¹⁰)

- **Art. 491⁷:** gdy majątek nie wystarcza na koszty albo brak płynnych funduszów — koszty pokrywa **tymczasowo Skarb Państwa** (ust. 1; ust. 2 uchylony). Jednocześnie z ogłoszeniem sąd przyznaje syndykowi **zaliczkę** i zarządza wypłatę ze środków SP, chyba że majątek pozwala na bieżące pokrywanie; w toku — kolejne zaliczki (ust. 3). Syndyk **zwraca** SP niezwłocznie po wpływie wystarczających funduszów (ust. 4). Przy wniosku **wyłącznie wierzyciela** ust. 1 i 3 nie stosuje się, jeżeli dłużnik nie sprzeciwia się umorzeniu; przed umorzeniem sąd wysłuchuje dłużnika (ust. 5).
- **Art. 491⁸:** po ogłoszeniu syndyk występuje do **naczelnika urzędu skarbowego** o informacje mające wpływ na sytuację majątkową (w szczególności obowiązek podatkowy w **5 latach** przed wnioskiem) i do **KRS** (udział w spółkach handlowych; funkcje w organach w **10 latach** przed wnioskiem i upadłość tych spółek) (ust. 1); informuje sędziego-komisarza o **niezgodności** z danymi z wniosku (ust. 2).
- **Art. 491⁹:** wynagrodzenie syndyka ustala sąd według funduszów masy, stopnia zaspokojenia, nakładu pracy, zakresu i trudności czynności oraz czasu trwania (ust. 1): **od ¼ do 2×** przeciętnego miesięcznego wynagrodzenia w sektorze przedsiębiorstw bez nagród z zysku w **IV kwartale roku poprzedniego** (ust. 2); w szczególnie uzasadnionych przypadkach **do 4×** (zwiększony nakład, skomplikowanie, liczba wierzycieli) (ust. 3); orzeka sąd w składzie jednego sędziego (ust. 4).
- **Art. 491¹⁰:** sąd umarza postępowanie **na wniosek upadłego** (ust. 1). Gdy upadły nie wskaże lub nie wyda majątku, dokumentów albo nie wykonuje obowiązków — umorzenie z urzędu, na wniosek syndyka lub wierzyciela, po wysłuchaniu, chyba że uchybienie **nieistotne** lub postępowanie uzasadniają **względy słuszności lub humanitarne** (ust. 2). Umorzenie także przy **nieprawdziwych lub niezupełnych danych we wniosku** — z tymi samymi wyjątkami (ust. 2a). Brak umorzenia, jeżeli skutkowałoby **pokrzywdzeniem wierzycieli** (ust. 3); zażalenie (ust. 4); ust. 1 i 2 nie stosuje się przy wniosku wierzyciela (ust. 5).
- **Art. 491¹¹:** uchylony.

## D. Likwidacja i skarga na syndyka (art. 491¹¹ᵃ–491¹²ᵃ)

- **Art. 491¹¹ᵃ:** sposób likwidacji wybiera **samodzielnie syndyk**, tak by zaspokoić wierzycieli w największym stopniu, z uwzględnieniem kosztów (ust. 1). Przy **nieruchomości** i składnikach o wartości ze spisu inwentarza **> 5×** przeciętnego wynagrodzenia (sektor przedsiębiorstw, **III kwartał roku poprzedzającego złożenie spisu**) syndyk **zawiadamia wierzycieli i sąd** przez system, na formularzu, wskazując sposób i **cenę minimalną** (ust. 2). Na skutek skargi z 491¹²ᵃ lub z urzędu sąd **zakazuje** likwidacji w wybrany sposób lub za wskazaną cenę, gdy byłaby niezgodna z prawem albo krzywdząca upadłego lub wierzycieli (ust. 3); przedtem może ją **wstrzymać** — zawiadamia syndyka w dniu wydania (ust. 4). Bez wstrzymania/zakazu likwidacja **po 14 dniach od zawiadomienia** (ust. 5).
- **Art. 491¹²:** syndyk może **pisemnie upoważnić upadłego do sprzedaży ruchomości** z masy; stosuje się przepisy o pełnomocnictwie.
- **Art. 491¹²ᵃ:** skarga na czynność lub **zaniechanie** syndyka do sądu upadłościowego (ust. 1); legitymacja: upadły, wierzyciel, osoba, której prawo naruszono lub zagrożono (ust. 2); wymogi pisma, wniosek o zmianę/uchylenie/dokonanie z uzasadnieniem (ust. 3). Termin **7 dni**: od czynności (przy obecności lub zawiadomieniu o terminie), od zawiadomienia o dokonaniu, a w braku — od powzięcia wiadomości; przy zaniechaniu — od dowiedzenia się, że czynność miała być dokonana (ust. 4). Skargę wnosi się **do syndyka**, który w **3 dni** sporządza uzasadnienie i przekazuje do sądu, chyba że skargę **w całości uwzględnia** (zawiadamia skarżącego i zainteresowanych przez system) (ust. 5). Sąd rozpoznaje w **7 dni** od wpływu (lub uzupełnienia braków) (ust. 6). Skarga **nie wstrzymuje** postępowania ani czynności, chyba że sąd wstrzyma (ust. 7). Odrzucenie (spóźniona, nieopłacona, niedopuszczalna, braki) — zażalenie (ust. 8); mimo odrzucenia sąd z urzędu bada okoliczności i może wydać polecenie lub zakaz (ust. 9).
- **Art. 491¹³:** uchylony.

## E. Projekt planu i rozstrzygnięcia oddłużeniowe (art. 491¹⁴–491¹⁶)

- **Art. 491¹⁴:**
  - ust. 1 — po terminie zgłoszeń i **przeprowadzeniu likwidacji** syndyk składa **projekt planu spłaty z uzasadnieniem** albo **informację**, że zachodzą przesłanki z 491¹⁴ᵃ ust. 1 lub 491¹⁶ ust. 1 lub 2a;
  - ust. 2 — przy wniosku **wyłącznie wierzyciela** tak samo, chyba że dłużnik na wezwanie syndyka oświadczy, że **nie wnosi** o plan, umorzenie ani warunkowe umorzenie → sąd wydaje postanowienie o **zakończeniu postępowania**;
  - ust. 3 — załączniki: dowody **doręczenia** upadłemu i wierzycielom projektu/informacji z pouczeniem o ust. 4 i zobowiązaniem do stanowiska w **14 dni**; stanowiska albo informacja o ich braku z przyczyną;
  - ust. 4 — sąd ustala plan / umarza bez planu / warunkowo umarza / odmawia (491¹⁴ᵃ) — **na rozprawie tylko na wniosek** upadłego, syndyka lub wierzyciela; zawiadamia upadłego, syndyka i wnioskującego wierzyciela;
  - ust. 5 — **brak zgłoszeń** i brak wierzytelności umieszczanych z urzędu → po terminie zgłoszeń umorzenie bez planu, chyba że niezaspokojone koszty tymczasowo pokryte przez SP lub inne zobowiązania masy;
  - ust. 6 — zgłoszenie po złożeniu projektu/informacji **pozostawia się bez rozpoznania**;
  - ust. 7 — postanowienia i informację o prawomocności **obwieszcza się**; **zażalenie**; obwieszcza się też postanowienie II instancji i jego prawomocność;
  - ust. 8 — wydanie postanowienia o planie / umorzeniu / warunkowym umorzeniu **oznacza zakończenie postępowania**.
- **Art. 491¹⁴ᵃ:** **odmowa** ustalenia planu, umorzenia lub warunkowego umorzenia, gdy upadły (1) doprowadził do niewypłacalności lub istotnie zwiększył jej stopień **celowo** (w szczególności trwonienie majątku, celowe nieregulowanie wymagalnych zobowiązań) albo (2) w **10 latach** przed wnioskiem prowadzono wobec niego upadłość, w której umorzono całość lub część zobowiązań — chyba że oddłużenie uzasadniają **względy słuszności lub humanitarne** (ust. 1). Przy zgromadzonych funduszach sąd ustala plan obejmujący **wyłącznie podział funduszy** między uczestniczących wierzycieli; art. 491²¹ nie stosuje się (brak umorzenia) (ust. 2). Odmowa **kończy postępowanie** (ust. 3).
- **Art. 491¹⁵:**
  - ust. 1 — sąd: wymienia uczestników planu (pkt 1), dzieli fundusze masy (pkt 2), **ustala, czy niewypłacalność powstała umyślnie lub wskutek rażącego niedbalstwa** (pkt 3), określa zakres i okres spłaty **≤ 36 miesięcy** zobowiązań, które w części pierwszej zostałyby uznane na liście, oraz część umarzaną po wykonaniu (pkt 4);
  - ust. 1a — umyślność/rażące niedbalstwo: okres **36–84 miesiące**;
  - ust. 1b — spłata **≥ 70%** zobowiązań objętych planem: okres **≤ 1 rok**; ust. 1c — spłata **≥ 50%**: **≤ 2 lata**;
  - ust. 1d — do okresów zalicza się czas **od upływu 6 miesięcy od ogłoszenia upadłości do ustalenia planu**, chyba że dłużnik nie pokryłby w całości kosztów tymczasowo poniesionych przez SP; nie zalicza się okresu warunkowego umorzenia;
  - ust. 2 — koszty pokryte przez SP i inne zobowiązania masy — **w pełnej wysokości**, chyba że możliwości zarobkowe, utrzymanie i potrzeby mieszkaniowe nie pozwalają; przy braku zgłoszeń plan obejmuje wyłącznie te zobowiązania, a przy ich braku — umorzenie bez planu;
  - ust. 3 — koszty SP nieuwzględnione lub niezaspokojone w planie ponosi **Skarb Państwa**;
  - ust. 4 — sąd **nie jest związany** stanowiskami; bierze pod uwagę możliwości zarobkowe, utrzymanie upadłego i osób na utrzymaniu, potrzeby mieszkaniowe, wysokość niezaspokojonych wierzytelności i stopień dotychczasowego zaspokojenia;
  - ust. 5 — plan **nie narusza praw wobec poręczyciela i współdłużnika** ani zabezpieczeń rzeczowych na **mieniu osoby trzeciej**; ustalenie planu i umorzenie są skuteczne także w relacji upadły–poręczyciel/gwarant/współdłużnik;
  - ust. 6 — w okresie wykonywania planu **zakaz wszczęcia egzekucji** wierzytelności sprzed ustalenia planu, poza zobowiązaniami z 491²¹ ust. 2;
  - ust. 7 — odpowiednio art. **313 ust. 2, 335, 336, 340–348, 352–356, 358–360**; podział funduszy masy wykonuje syndyk niezwłocznie po uprawomocnieniu planu.
- **Art. 491¹⁶:**
  - ust. 1 — **umorzenie bez planu**, gdy osobista sytuacja w **oczywisty** sposób wskazuje na **trwałą** niezdolność do jakichkolwiek spłat; ust. 1a — przy zgromadzonych funduszach sąd ustala plan obejmujący podział (wykonuje syndyk) i umarza resztę; ust. 2 — tymczasowe koszty obciążają **Skarb Państwa**;
  - ust. 2a — niezdolność **nietrwała** → **warunkowe umorzenie**: umorzenie następuje, jeżeli w **5 lat** od uprawomocnienia nikt (upadły, wierzyciel) nie złoży wniosku o ustalenie planu, skutkującego uchyleniem warunkowego umorzenia; stosuje się art. 491¹⁴ ust. 7 i 491²¹ ust. 2 oraz odpowiednio ust. 1a; ust. 2b — wniosek złożony w terminie może być rozpoznany także **po upływie 5 lat**;
  - ust. 2c–2d — w okresie 5 lat **zakaz czynności pogarszających** sytuację majątkową; zgoda lub zatwierdzenie sądu w szczególnie uzasadnionych przypadkach;
  - ust. 2e — **coroczne sprawozdanie do końca kwietnia** za poprzedni rok: przychody, składniki > przeciętne miesięczne wynagrodzenie (ostatni kwartał okresu), możliwości zarobkowe, wydatki i potrzeby mieszkaniowe; **kopia rocznego zeznania podatkowego**; ust. 2f — odpowiednio zakaz egzekucji z 491¹⁵ ust. 6;
  - ust. 2g — **uchylenie** warunkowego umorzenia: brak sprawozdania w terminie, nieprawdziwe informacje (zatajenie przychodów/składników), czynność bez zgody, ukrywanie majątku lub prawomocne uznanie czynności za krzywdzącą wierzycieli — chyba że uchybienie nieznaczne albo przemawiają względy słuszności/humanitarne; obwieszczenie (491¹⁴ ust. 7); ust. 2h — po uchyleniu zobowiązania **nie podlegają umorzeniu**;
  - ust. 2i — bez wniosku: umorzenie **z mocy prawa z upływem 5 lat** od uprawomocnienia; na wniosek sąd wydaje postanowienie stwierdzające umorzenie z datą; ust. 3 — art. 491²¹ ust. 2 i 3 odpowiednio.

## F. Kasacja, wykonanie, zmiana i zakończenie planu (art. 491¹⁷–491²¹)

- **Art. 491¹⁷:** od postanowienia **II instancji** w przedmiocie planu, umorzenia bez planu lub warunkowego umorzenia przysługuje **skarga kasacyjna** (ust. 1); na wniosek skarżącego sąd może **wstrzymać wydanie postanowienia z 491²¹ ust. 1** (ust. 2); uchylenie planu w wyniku kasacji → sąd uchyla postanowienie z 491²¹ ust. 1 (ust. 3); postanowienie SN obwieszcza się (ust. 4).
- **Art. 491¹⁸:** w okresie planu **zakaz czynności** pogarszających zdolność wykonania planu (ust. 1); zgoda lub zatwierdzenie sądu w szczególnie uzasadnionych przypadkach (ust. 2); **sprawozdanie corocznie do końca kwietnia** za poprzedni rok: przychody, spłacone kwoty, składniki > przeciętne miesięczne wynagrodzenie (ostatni kwartał okresu) + **kopia zeznania podatkowego** (ust. 3).
- **Art. 491¹⁹:**
  - ust. 1 — niemożność wykonania: na wniosek upadłego, po wysłuchaniu wierzycieli, zmiana planu i **przedłużenie o ≤ 18 miesięcy**; zażalenie, kasacja;
  - ust. 2 — niemożność **trwała i niezależna od upadłego**: uchylenie planu i **umorzenie niewykonanych zobowiązań** z 491¹⁵ ust. 1–3; zażalenie, kasacja;
  - ust. 3 — **istotna poprawa** sytuacji z innych przyczyn niż wzrost wynagrodzenia za pracę lub dochodów z osobistej działalności zarobkowej → wniosek każdego wierzyciela lub upadłego o zmianę; po wysłuchaniu; zażalenie; ust. 4 — odpowiednio dla wierzycieli, których wierzytelności sprzed planu stwierdzono po jego ustaleniu prawomocnym orzeczeniem, ugodą sądową lub ostateczną decyzją;
  - ust. 5 — obwieszczenia: postanowienie o zmianie, II instancja, SN, prawomocność.
- **Art. 491²⁰:** niewykonywanie planu → **uchylenie** z urzędu lub na wniosek wierzyciela, po wysłuchaniu, chyba że uchybienie nieznaczne lub dalsze wykonywanie uzasadniają względy słuszności/humanitarne; zażalenie (ust. 1). Odpowiednio przy: braku sprawozdania w terminie, zatajeniu przychodów/składników, czynności bez zgody, ukrywaniu majątku lub prawomocnym uznaniu czynności za krzywdzącą (ust. 2). Po uchyleniu **brak umorzenia** (ust. 3); obwieszczenia jak 491¹⁹ ust. 5 (ust. 4).
- **Art. 491²⁰ᵃ:** w sprawach z 491¹⁹ i 491²⁰ sąd orzeka **na rozprawie**; wierzycieli zawiadamia się przez **obwieszczenie**.
- **Art. 491²¹:** po wykonaniu planu sąd stwierdza wykonanie i **umarza zobowiązania sprzed ogłoszenia upadłości** niewykonane w planie; zażalenie (ust. 1). **Nieumarzalne** (ust. 2): alimenty; renty za chorobę, niezdolność do pracy, kalectwo, śmierć; grzywny orzeczone przez sąd; obowiązek naprawienia szkody i zadośćuczynienie; nawiązka i świadczenie pieniężne jako środek karny lub związany z poddaniem próbie; naprawienie szkody z przestępstwa lub wykroczenia stwierdzonego prawomocnie; zobowiązania **umyślnie nieujawnione**, jeżeli wierzyciel nie brał udziału w postępowaniu. Obwieszczenia jak 491¹⁹ ust. 5 (ust. 2a). Po postanowieniu **niedopuszczalna egzekucja** wierzytelności sprzed ustalenia planu, poza nieumarzalnymi (ust. 3).

## G. Układ i akta (art. 491²²–491²⁴)

- **Art. 491²²:** przy uprawdopodobnieniu, że układ osiągnie cele postępowania, sędzia-komisarz **na wniosek upadłego** zwołuje zgromadzenie wierzycieli; odmowa — zażalenie (ust. 1). Może **wstrzymać likwidację**, w szczególności lokalu mieszkalnego lub domu jednorodzinnego, w którym mieszka upadły — zażalenie (ust. 2). Wniosek po **zakończeniu likwidacji** pozostawia się bez rozpoznania (ust. 3). Układ wymaga **zgody upadłego** (ust. 4). Przy wniosku wierzyciela o upadłość wniosek o zgromadzenie może złożyć każdy wierzyciel, a zgoda upadłego nie jest wymagana (ust. 5).
- **Art. 491²³:** do zawarcia, skutków, zmiany i uchylenia układu stosuje się odpowiednio przepisy o układzie w upadłości przedsiębiorców (art. 266a–266f → `mod-PrUpad-uklad-likwidacja-zakonczenie`), **z wyjątkiem art. 192 ust. 1 i 2** (zwołanie przez obwieszczenie, 2 tygodnie przed terminem).
- **Art. 491²⁴:** syndyk zakłada i prowadzi **akta**, w tym akta zgłoszeń, w systemie teleinformatycznym (ust. 1); pisma i dokumenty z art. 216aa ust. 1 wniesione poza systemem wprowadza do akt, same pisma i dokumenty składa się do **zbioru dokumentów**; art. 216aa ust. 2–3 odpowiednio (ust. 2). Udostępnianie w biurze syndyka i przez system uczestnikom oraz osobom z usprawiedliwioną potrzebą; biuro czynne w dni powszednie **co najmniej 4 kolejne godziny między 8.00 a 20.00** (ust. 3). Akta są częścią akt sądowych; po prawomocnym zakończeniu zbiór dokumentów trafia do sądu (ust. 4); dostęp służby nadzoru MS (ust. 5); przejęcie przez nowego syndyka (ust. 6); rozporządzenie MS (ust. 7).

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| 10 lat | NIP we wniosku i postanowieniu | art. 491² ust. 4 pkt 1a; 491⁵ ust. 1 pkt 1a |
| 6 mies. / 12 mies. / 10 000 zł | przychody i koszty; czynności na nieruchomościach i ruchomościach | art. 491² ust. 4 pkt 8–10, ust. 5a |
| 2 tyg. | informacje dłużnika przy wniosku wierzyciela | art. 491² ust. 5 |
| 30 dni od obwieszczenia | zgłoszenia wierzytelności i praw na nieruchomości | art. 491⁵ ust. 1 pkt 3–4 |
| 5 lat / 10 lat | informacje US / KRS | art. 491⁸ ust. 1 |
| ¼–2× (do 4×), IV kw. | wynagrodzenie syndyka | art. 491⁹ |
| > 5×, III kw.; 14 dni | zawiadomienie o likwidacji; likwidacja po upływie | art. 491¹¹ᵃ ust. 2, 5 |
| 7 dni / 3 dni / 7 dni | skarga; przekazanie przez syndyka; rozpoznanie | art. 491¹²ᵃ ust. 4–6 |
| 14 dni | stanowiska do projektu/informacji | art. 491¹⁴ ust. 3 pkt 1 |
| 10 lat | poprzednie oddłużenie → odmowa | art. 491¹⁴ᵃ ust. 1 pkt 2 |
| ≤ 36 / 36–84 / ≤ 12 (70%) / ≤ 24 (50%) mies. | okres planu | art. 491¹⁵ ust. 1 pkt 4, ust. 1a–1c |
| 6 mies. od ogłoszenia | początek zaliczanego okresu | art. 491¹⁵ ust. 1d |
| 5 lat | warunkowe umorzenie | art. 491¹⁶ ust. 2a–2i |
| koniec kwietnia | sprawozdanie roczne | art. 491¹⁶ ust. 2e; 491¹⁸ ust. 3 |
| ≤ 18 mies. | przedłużenie planu | art. 491¹⁹ ust. 1 |
| 4 h w godz. 8–20 | biuro syndyka — udostępnianie akt | art. 491²⁴ ust. 3 |

## PUŁAPKI

- Art. 491² ust. 1 wyłącza art. 347–356 i 358–366, ale 491¹⁵ ust. 7 **przywraca** art. 335, 336, 340–348, 352–356 i 358–360 dla planu spłaty — ustalaj podstawę dla każdego etapu, nie globalnie.
- Brak formalnej listy wierzytelności (art. 244–245, 253–264 wyłączone) — plan obejmuje zobowiązania, które „zostałyby uznane na liście” w części pierwszej.
- **Celowość** (491¹⁴ᵃ — odmowa oddłużenia) ≠ **umyślność / rażące niedbalstwo** (491¹⁵ ust. 1a — dłuższy plan 36–84 mies.).
- Odmowa oddłużenia przy zgromadzonych funduszach nadal wymaga planu podziału (491¹⁴ᵃ ust. 2), ale bez umorzenia.
- Okresy ust. 1a–1c: przy zbiegu odczytaj łącznie i uzasadnij wariant; nie stosuj „zawsze 3–7 lat”.
- Zaliczenie okresu od 6 mies. po ogłoszeniu zależy od pokrycia kosztów SP (491¹⁵ ust. 1d).
- Warunkowe umorzenie nie jest natychmiastowym oddłużeniem — 5 lat obowiązków, zakaz czynności, sprawozdania, ryzyko uchylenia.
- Zgłoszenie po złożeniu projektu/informacji — bez rozpoznania (491¹⁴ ust. 6); nie stosuj trybu uzupełnienia listy.
- Wniosek wyłącznie wierzyciela: brak umorzenia na wniosek upadłego (491¹⁰ ust. 5), możliwe zakończenie bez oddłużenia (491¹⁴ ust. 2), brak wymogu zgody upadłego na układ (491²² ust. 5).
- Tryb 491¹ ust. 2: część pierwsza, ale 491⁷, 491⁸, 491¹⁰ nadal; zakończenie przy braku masy (491¹ ust. 4).
- Plan nie chroni poręczyciela i współdłużnika przed wierzycielem (491¹⁵ ust. 5) — informuj klienta.
- Wynagrodzenie syndyka: wskaźnik IV kw. (491⁹) ≠ III kw. (491¹¹ᵃ) ≠ ostatni kwartał okresu (sprawozdania); zapisz rok, kwartał i publikację GUS.
- Nieprawdziwe dane we wniosku: umorzenie postępowania (491¹⁰ ust. 2a) i odpowiedzialność odszkodowawcza (491² ust. 5b).

## POWIĄZANIA

- Zgłoszenia, ryczałt art. 235, art. 216a–216ab, 239a–241 → `mod-PrUpad-wierzytelnosci-235-266`
- Podział funduszy (art. 335–360 w zakresie 491¹⁵ ust. 7) → `mod-PrUpad-podzial-335-360`
- Likwidacja, art. 313 ust. 2, spis inwentarza → `mod-PrUpad-syndyk-likwidacja`
- Pre-pack (art. 56a–56h), zaskarżenie postanowienia (art. 54a) → `mod-PrUpad-wniosek-ogloszenie`
- Masa, małżonek (art. 124–126), bezskuteczność → `mod-PrUpad-skutki-masa-bezskutecznosc`
- System teleinformatyczny, art. 216aa, doręczenia art. 220 → `mod-PrUpad-organy-procedura`
- Układ (art. 266a–266f) → `mod-PrUpad-uklad-likwidacja-zakonczenie`
- Układ konsumencki na zgromadzeniu (art. 491²⁵–491³⁸) → `mod-PrUpad-postepowania-odrebne-426-491-38`
- Pisma → `pisma-procesowe-v3`; orzecznictwo → `orzeczenia-sadowe-v2`

## WYNIK

Ścieżka: wnioskodawca i tryb (491¹, 491⁵) → kompletność wniosku (491²) → majątek i informacje (491⁸) → likwidacja z zawiadomieniami (491¹¹ᵃ) → projekt planu / informacja z doręczeniami i stanowiskami (491¹⁴) → wariant: plan (491¹⁵) / umorzenie bez planu / warunkowe (491¹⁶) / odmowa (491¹⁴ᵃ) → wykonanie i sprawozdania (491¹⁸) → zmiana / uchylenie (491¹⁹–491²⁰) → umorzenie z katalogiem nieumarzalnych (491²¹). Moduł nie zastępuje orzeczenia sądu ani nie podpisuje pism.
