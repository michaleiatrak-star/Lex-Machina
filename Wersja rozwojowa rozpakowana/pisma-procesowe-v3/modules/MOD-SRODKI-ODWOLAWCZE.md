# MOD-SRODKI-ODWOLAWCZE — apelacja, zażalenie, odwołanie (PL)

*Ładuj gdy: pismo zaskarża orzeczenie albo decyzję (apelacja cywilna lub karna, zażalenie, odwołanie od decyzji ZUS albo organu administracji). Uzupełnia `references/engines/appellate-engine-v8.md` (ogólna matryca zarzutu).*

**Akt:** KPC — t.j. Dz.U. 2026 poz. 468 (zm. po t.j.: 2026/473, 2026/830, 2026/1003, 2026/1046, 2026/1296 — żadna nie zmienia art. 367–398 ani 477⁹–477¹⁴; odczyt 2026-11-19); [OD 2027-01-01: 2026/26] — art. 477⁹ § 2¹ i § 3¹, art. 477¹⁴ § 4 (orzeczenie także osoby wykonującej samodzielny zawód medyczny, „ponowne rozpatrzenie” zamiast komisji lekarskiej ZUS).
**Akt:** KPK — t.j. Dz.U. 2026 poz. 490 (zm. po t.j.: 2026/421, 2026/638, 2026/760, 2026/882, 2026/901 — przed powołaniem art. 425–467 sprawdź ich zakres w ELI).
**Akt:** KPA — t.j. Dz.U. 2025 poz. 1691 (brak zmian po t.j. w katalogu ELI 2026-11-19).
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1) — `isap_tekst` albo kopia ELI aplikacji; ten moduł podaje funkcję przepisu, nie jego brzmienie.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-19.

**Zasada źródeł praktyki:** każda reguła praktyki ma źródło (sekcja ŹRÓDŁA). Orzeczenia przytoczone przez źródła wtórne są oznaczone `[ORZ-DO-WERYFIKACJI]`: przed powołaniem w piśmie przechodzą przez `weryfikator-orzeczen` (kontrakt FOUND/NOT_FOUND/AMBIGUOUS/OUT_OF_SCOPE). Źródło starsze niż obecny t.j. jest sprawdzane z t.j.; rozbieżność zapisana jako KOREKTA.

## SO-0 — Wybór środka i adresata (przed jakąkolwiek redakcją)

| Orzeczenie / akt | Środek | Do kogo / za pośrednictwem | Termin | Kwalifikator |
|---|---|---|---|---|
| wyrok sądu I instancji (cywilny) | apelacja | sąd II instancji, wnoszona do sądu, który wydał wyrok | 2 tygodnie od doręczenia wyroku z uzasadnieniem; 3 tygodnie przy przedłużonym terminie uzasadnienia | KPC art. 367 § 1–2, art. 369 § 1–1¹; art. 369 § 3 — termin zachowany także przy wniesieniu wprost do sądu II instancji |
| postanowienie kończące postępowanie i katalog art. 394 § 1 | zażalenie (pionowe) | sąd II instancji | tydzień od doręczenia postanowienia z uzasadnieniem | KPC art. 394 § 1–3 |
| postanowienia z katalogu art. 394¹a § 1 (m.in. koszty, zwolnienie od kosztów, grzywna, wyłączenie sędziego, rygor natychmiastowej wykonalności) | zażalenie poziome | inny skład sądu I instancji (3 sędziów) | jak art. 394 § 2 (odesłanie w art. 394¹a § 2) | KPC art. 394¹a § 1, § 1², § 2, § 3 |
| przepis szczególny daje zażalenie, nie wskazując sądu | zażalenie | sąd II instancji | art. 394 § 2 | KPC art. 394 § 4 |
| decyzja organu rentowego (ZUS, KRUS) | odwołanie do sądu | wnoszone do organu, który wydał decyzję (albo do protokołu w sądzie — art. 477⁹ § 5) | miesiąc od doręczenia decyzji | KPC art. 477⁹ § 1, § 5 |
| wyrok sądu karnego I instancji | apelacja | sąd odwoławczy, wnoszona do sądu, który wydał wyrok | 14 dni od doręczenia wyroku z uzasadnieniem | KPK art. 444, art. 445 § 1, art. 428 § 1 |
| postanowienie sądu karnego zamykające drogę do wyroku i inne wskazane w ustawie | zażalenie | wg ustawy; na postanowienie prokuratora — sąd (wyjątki art. 465 § 2a, § 3) | 7 dni od ogłoszenia, a gdy ustawa nakazuje doręczenie — od doręczenia | KPK art. 459, art. 460, art. 465; adresat: `JUR:zazalenie-adresat-gate` |
| decyzja administracyjna I instancji | odwołanie | organ wyższego stopnia za pośrednictwem organu, który wydał decyzję | 14 dni od doręczenia (od ogłoszenia, gdy ogłoszona ustnie); przepis szczególny może inaczej | KPA art. 127 § 1–2, art. 129 § 1–3 |
| decyzja ministra albo SKO w I instancji | wniosek o ponowne rozpatrzenie sprawy | ten sam organ | jak odwołanie (odpowiednie stosowanie) | KPA art. 127 § 3 |

Bramka: termin liczy `JUR:terminy-procesowe` z datą doręczenia z akt; brak daty doręczenia = scenariusze terminu, nie domniemanie.

## SO-1 — Apelacja cywilna

### Wymogi treści (KPC art. 368)
- § 1 pkt 1–5: oznaczenie wyroku i zakresu zaskarżenia (całość albo część), zwięzłe zarzuty, uzasadnienie zarzutów, w razie potrzeby nowe fakty i dowody, wniosek o zmianę albo uchylenie z zakresem.
- § 1¹: zarzut co do podstawy faktycznej wskazuje fakty ustalone niezgodnie z rzeczywistością albo istotne fakty nieustalone.
- § 1²: nowe fakty i dowody — uprawdopodobnienie, że nie mogły być powołane w I instancji albo potrzeba wynikła później.
- § 1³: fakt z nagrania — wskazać część zapisu.
- § 2: sprawy majątkowe — wartość przedmiotu zaskarżenia.

### Granice i skutki
- art. 378 § 1: sąd II instancji rozpoznaje sprawę w granicach apelacji; z urzędu tylko nieważność w granicach zaskarżenia. Wniosek praktyczny: czego nie zarzucono, tego sąd zwykle nie bada (źródło P1).
- art. 380: na wniosek sąd bada niezaskarżalne zażaleniem postanowienia, które miały wpływ na rozstrzygnięcie — wniosek trzeba zgłosić w apelacji.
- art. 381–382: nowe fakty i dowody mogą być pominięte, gdy strona mogła je powołać wcześniej; orzekanie na materiale z obu instancji.
- art. 384: zakaz reformationis in peius, chyba że apelację wniosła także strona przeciwna.
- art. 386 § 4: uchylenie i przekazanie poza nieważnością i odrzuceniem pozwu/umorzeniem tylko przy nierozpoznaniu istoty sprawy albo konieczności przeprowadzenia postępowania dowodowego w całości — wniosek o uchylenie bez tych przesłanek jest słaby; domyślnie wnoś o zmianę.
- art. 373 § 1: odrzucenie apelacji spóźnionej, nieopłaconej, niedopuszczalnej albo z nieusuniętymi brakami.

### Praktyka formułowania zarzutów (ze źródeł)
1. **Zarzut z konkretu sprawy, nie z szablonu.** Każdy zarzut na podstawie konkretnego stanu faktycznego i skali naruszenia (P1). Kopiowanie zarzutów art. 233 § 1 bez odniesienia do sprawy to typowy problem (P4 — omówienie Wolters Kluwer w wynikach wyszukiwania; pełny tekst niedostępny).
2. **Art. 233 § 1 KPC — nie alternatywny stan faktyczny.** Zarzut nie może polegać na przedstawieniu własnej wersji faktów; trzeba wykazać rażącą wadliwość oceny i wskazać przekroczone kryterium (logika, doświadczenie życiowe, wszechstronność) (P1). Sąd może dać wiarę jednemu z dwóch sprzecznych źródeł — sama sprzeczność z jednym z nich nie jest błędem (P1).
3. **Matryca zarzutu dowodowego:** dowód → ocena sądu (strona uzasadnienia) → naruszone kryterium → jaki fakt powinien zostać ustalony → wpływ na rozstrzygnięcie. Bez ostatniego ogniwa zarzut proceduralny jest bezskuteczny — wzór zarzutu zawiera „mających istotny wpływ na treść rozstrzygnięcia” (P1).
4. **Rozdziel błąd subsumcji od błędu ustaleń.** Przed zarzutem prawa materialnego sprawdź, czy sąd nie zastosował prawa poprawnie do błędnie ustalonych faktów — wtedy właściwy jest zarzut ustaleń (art. 368 § 1¹), a zarzut materialny jest wtórny (P1, P3).
5. **Zarzut prawa materialnego wskazuje skutek dla rozstrzygnięcia** (jaki wynik przy prawidłowej wykładni/zastosowaniu) (P1).
6. **Typowe błędy (P1):** nieważność bez podstaw (np. powaga rzeczy osądzonej bez wskazania sprawy i sygnatury); zarzut pominięcia dowodu bez wykazania jego istotności; błędne przypisanie przyznania faktu (art. 229); błędne przytoczenie treści zeznań lub dokumentu; zarzut wobec opinii biegłego bez wskazania wewnętrznej sprzeczności i bez wniosku o opinię uzupełniającą.
7. **Nowe dowody w apelacji (P2):** apelacja nie służy powtórzeniu postępowania; dopuszczenie nowego dowodu zależy od uznania sądu `[ORZ-DO-WERYFIKACJI: SN I PKN 28/00, 12.09.2000]`; brak adwokata w I instancji nie jest samodzielną podstawą powołania nowych faktów `[ORZ-DO-WERYFIKACJI: SN V CKN 1269/00, 16.05.2002]`. Uprawdopodobnienie z art. 368 § 1² w samej apelacji, z dowodem na brak winy.
8. **Postanowienia niezaskarżalne:** gdy wpływały na wynik (np. oddalenie wniosku dowodowego), wniosek z art. 380 w apelacji; bez niego sąd ich nie bada.

## SO-2 — Zażalenie cywilne (pionowe i poziome)

- **Dobór drogi (P5, P6):** reguła — zażalenie dewolutywne; poziome tylko w katalogu art. 394¹a § 1 (I instancja) albo art. 394² § 1–1¹ (II instancja). Zażalenia „osierocone” (przepis szczególny nie mówi, kto rozpoznaje) były najczęstszym problemem pełnomocników (P6); od nowelizacji z 2023 r. rozstrzyga je art. 394 § 4 — sąd II instancji (P5, potwierdzone t.j. 2026/468).
- **Uzasadnienie jako warunek (P6):** postanowienia z posiedzenia niejawnego sąd uzasadnia tylko na żądanie zgłoszone w tygodniu od doręczenia (art. 357 § 2¹); termin na zażalenie biegnie od doręczenia postanowienia z uzasadnieniem (art. 394 § 2). Wyjątek: gdy sąd z urzędu doręczył postanowienie z uzasadnieniem, wniosek odpada (art. 357 § 2⁴); gdy sąd odstąpił od uzasadnienia — termin od ogłoszenia/doręczenia (art. 394 § 2 zd. 2).
- **„Zasadnicze powody rozstrzygnięcia” to nie uzasadnienie (P6)** — nie otwierają biegu terminu ani drogi zażalenia; częsty błąd stron (P5).
- **Skład i odrzucenie:** zażalenie poziome — 3 sędziów (art. 394¹a § 1²); odrzucenie spóźnionego/niedopuszczalnego — 1 sędzia sądu, który wydał postanowienie (§ 1¹). Wątpliwości składu przy rozstrzygnięciach niemerytorycznych mogą prowadzić do nieważności (P6) — w zażaleniu na odrzucenie sprawdź skład.
- **Autokontrola:** zarzut nieważności albo oczywista zasadność — sąd, który wydał postanowienie, może sam je uchylić (art. 395 § 2); formułuj taki zarzut wprost na początku.
- **Treść (art. 394 § 3):** wskazanie postanowienia, wniosek o zmianę albo uchylenie, zwięzłe uzasadnienie, w miarę potrzeby nowe fakty i dowody. Do postępowania zażaleniowego odpowiednio przepisy o apelacji (art. 397 § 3).
- **Odpowiedź na zażalenie:** tydzień od doręczenia (art. 395 § 1¹).

## SO-3 — Odwołanie od decyzji ZUS (KRUS) do sądu

- **Droga:** na piśmie do organu, który wydał decyzję (albo do jego protokołu); także do protokołu w sądzie (art. 477⁹ § 1, § 5). Organ przekazuje odwołanie do sądu w 30 dni albo sam zmienia/uchyla decyzję, jeśli uzna odwołanie za słuszne w całości (§ 2); przy zwłoce — ponaglenie (§ 7).
- **Termin:** miesiąc od doręczenia; spóźnione — odrzucenie, chyba że przekroczenie nienadmierne i niezawinione (§ 3). Bezczynność organu — odwołanie w każdym czasie po 2 miesiącach od zgłoszenia roszczenia (§ 4).
- **Sprzeciw do komisji lekarskiej — bramka (art. 477⁹ § 3¹):** gdy decyzja opiera się na orzeczeniu lekarza orzecznika, od którego nie wniesiono sprzeciwu, a odwołanie zawiera wyłącznie zarzuty co do tego orzeczenia — odrzucenie. Sprawdź w aktach: czy był sprzeciw; jeśli nie — czy odwołanie ma inne zarzuty niż medyczne. [OD 2027-01-01: 2026/26] — nowe brzmienie (orzeczenie także osoby wykonującej samodzielny zawód medyczny; sprzeciw rozpatruje lekarz orzecznik w trybie ponownego rozpatrzenia, nie komisja lekarska).
- **Nowe okoliczności zdrowotne:** powstałe po orzeczeniu — organ kieruje do lekarza orzecznika zamiast do sądu (§ 2¹); powstałe po złożeniu odwołania — sąd uchyla decyzję i umarza (art. 477¹⁴ § 4).
- **Zakres sporu wyznacza decyzja (P7):** nie dochodzi się w sądzie prawa, o którym decyzja nie rozstrzygała `[ORZ-DO-WERYFIKACJI: SN II UKN 204/99, 23.11.1999]`; nowe żądanie sąd przekazuje organowi (art. 477¹⁰ § 2). Odwołanie przysługuje od decyzji, nie od pism informacyjnych ZUS (P7).
- **Treść (art. 477¹⁰ § 1):** oznaczenie decyzji, zwięzłe zarzuty, wnioski, uzasadnienie, podpis. Orzecznictwo jest odformalizowane — wystarcza wyraźne niezadowolenie i wola zmiany `[ORZ-DO-WERYFIKACJI: SN III UK 52/09, 10.12.2009]` (P7); pismo nazwane „sprzeciwem” złożone w terminie może być odwołaniem (P7). Mimo to w piśmie zawodowym: konkretne zarzuty (co organ pominął, jak błędnie policzył staż, które dokumenty zignorował) i wnioski dowodowe (świadkowie, biegły właściwej specjalności).
- **Braki formalne (P7):** brak podpisu albo oznaczenia decyzji nieusunięty po wezwaniu → zwrot; prawomocny zwrot = uprawomocnienie decyzji `[ORZ-DO-WERYFIKACJI: SN I UZ 7/09, 21.04.2009]`.
- **Rozstrzygnięcie sądu:** oddalenie albo zmiana i orzeczenie co do istoty (art. 477¹⁴ § 1–2); uchylenie i przekazanie tylko przy decyzji z rażącym naruszeniem procedury nakładającej zobowiązanie/obniżającej świadczenie (§ 2¹). Wniosek pisma: o zmianę decyzji i przyznanie/ustalenie prawa — nie o „uchylenie” (poza § 2¹).

## SO-4 — Apelacja i zażalenie w sprawach karnych

- **Treść (art. 427):** wskazanie zaskarżonego rozstrzygnięcia lub ustalenia i czego się domaga (§ 1); od oskarżyciela publicznego, obrońcy, pełnomocnika — także zarzuty i uzasadnienie (§ 2); nowe fakty i dowody, jeżeli nie mogły być powołane w I instancji (§ 3).
- **Zakaz zarzutu nieprzeprowadzenia dowodu z urzędu (art. 427 § 3a)** — wyjątek: okoliczność istotna dla tego, czy popełniono czyn zabroniony, czy jest przestępstwem i jakim, warunków art. 64/65 KK albo pobytu w zakładzie psychiatrycznym (art. 93g KK). **KOREKTA źródła P8 (2015):** opisywane tam art. 427 § 4–5 są w t.j. 2026/490 uchylone, a art. 167 brzmi obecnie „Dowody przeprowadza się na wniosek stron albo z urzędu”; zakazy „aktywności sądu” z P8 nie obowiązują w tej postaci — stosuj § 3a.
- **Zarzuty dowodowe dopuszczalne (P8, aktualne co do typu uchybienia):** nierozpoznanie albo niezasadne oddalenie wniosku dowodowego (art. 170 § 1), uchybienia w sposobie przeprowadzenia dowodu (np. porządek pytań art. 370, odczytanie zeznań art. 391–392). Zarzut naruszenia art. 168a — sprawdź brzmienie t.j.: przepis ogranicza uznawanie dowodu za niedopuszczalny (zmiana od czasu P8).
- **Podstawy (art. 438):** pkt 1 — kwalifikacja prawna; pkt 1a — inne naruszenie prawa materialnego, chyba że orzeczenie mimo błędnej podstawy odpowiada prawu; pkt 2 — obraza przepisów postępowania, jeżeli **mogła** mieć wpływ na treść; pkt 3 — błąd w ustaleniach, jeżeli mógł mieć wpływ; pkt 4 — rażąca niewspółmierność kary/środka. Uchybienie procesowe, które nie doprowadziło do wadliwego orzeczenia, nie jest skuteczną podstawą (P8). Zarzut pkt 2 zawsze z opisem możliwego wpływu.
- **Granice (art. 433, 434, 447):** sąd rozpoznaje w granicach zaskarżenia i — gdy zarzuty wskazano — w granicach zarzutów (art. 433 § 1); musi rozważyć wszystkie zarzuty (§ 2). Apelacja co do winy obejmuje cały wyrok, co do kary — całe rozstrzygnięcie o karze i środkach karnych (art. 447 § 1–2). Niedopuszczalny zarzut obok dopuszczalnych powinien prowadzić do jego pominięcia i rozpoznania w części (P8) — nie mieszaj zarzutów wyłączonych (art. 447 § 5: zarzuty z pkt 3–4 związane z porozumieniem z art. 343, 343a, 387; § 6: wyłącznie zarzuty do trybu art. 105, 420, 626).
- **Kierunek:** orzeczenie na niekorzyść tylko przy środku na niekorzyść, w granicach zaskarżenia i podniesionych uchybień (art. 434 § 1); art. 440 i 455 działają niezależnie od granic. Sąd odwoławczy nie skaże uniewinnionego (art. 454 § 1) — przy apelacji oskarżyciela od uniewinnienia wniosek o uchylenie i przekazanie.
- **Uchylenie do ponownego rozpoznania** tylko w wypadkach art. 439 § 1, art. 454 albo gdy trzeba przeprowadzić przewód na nowo w całości (art. 437 § 2); wady uzasadnienia (art. 424) nie są podstawą uchylenia (art. 455a) — zarzut „wadliwego uzasadnienia” buduj jako zarzut ustaleń lub oceny dowodów, nie samoistnie.
- **Forma:** apelacja od wyroku sądu okręgowego nie od prokuratora — podpis adwokata, radcy prawnego albo radcy Prokuratorii (art. 446 § 1); odpisy (art. 446 § 2); profesjonalny pełnomocnik może wnieść przez portal informacyjny (art. 428 § 3).
- **Zażalenie na postanowienie prokuratora:** `references/engines/prosecution-complaint-engine-v8.md` i `JUR:zazalenie-adresat-gate`.

## SO-5 — Odwołanie od decyzji administracyjnej (KPA)

- **Treść (art. 128):** nie wymaga szczegółowego uzasadnienia — wystarczy niezadowolenie; przepisy szczególne mogą wymagać więcej (sprawdź ustawę materialną: podatkowe, budowlane, środowiskowe). Praktyka (P9): przy sprawach złożonych formułuj zarzuty precyzyjnie, bo wyznaczają kierunek kontroli i przyszłą skargę do WSA.
- **Droga i termin (art. 129):** do organu odwoławczego za pośrednictwem organu, który wydał decyzję; 14 dni od doręczenia (od ogłoszenia — decyzja ustna). Częsty błąd: złożenie wprost do organu wyższego stopnia (P10) — organ przekazuje pismo (art. 65 § 1 KPA), a podanie wniesione do organu niewłaściwego przed upływem terminu uważa się za wniesione w terminie (art. 65 § 2) — ale przekazanie wydłuża sprawę; wnoś za pośrednictwem organu I instancji i zachowaj dowód nadania (P9). Uchybienie terminu: prośba o przywrócenie w 7 dni od ustania przyczyny z dopełnieniem czynności (art. 58 § 1–2); o przywróceniu terminu do odwołania postanawia ostatecznie organ odwoławczy (art. 59 § 2).
- **Autokontrola (art. 132):** organ I instancji może uwzględnić odwołanie w całości, gdy wniosły je wszystkie strony albo pozostałe się zgodziły; inaczej przekazuje akta w 7 dni (art. 133).
- **Postępowanie wyjaśniające w II instancji (art. 136 § 2–3):** na zgodny wniosek stron zawarty w odwołaniu organ odwoławczy przeprowadza je sam zamiast kasacji — rozważ ten wniosek, gdy zależy na czasie.
- **Rozstrzygnięcia (art. 138):** utrzymanie, uchylenie i orzeczenie co do istoty, umorzenie; kasacja tylko przy naruszeniu procedury i istotnym zakresie do wyjaśnienia (§ 2), z wytycznymi wykładni (§ 2a).
- **Zakaz reformationis in peius (art. 139):** wyjątek — rażące naruszenie prawa lub interesu społecznego; oceń ryzyko przed wniesieniem odwołania od decyzji częściowo korzystnej.
- **Niedopuszczalność i uchybienie terminu** stwierdza organ odwoławczy postanowieniem ostatecznym (art. 134) — droga dalej: przywrócenie terminu (art. 58–59 KPA); zaskarżalność postanowienia do WSA sprawdź w PPSA przed wskazaniem tej drogi.
- Silnik ogólny: `references/engines/admin-pleading-engine-v8.md`.

## SO-6 — Kontrola przed oddaniem pisma (wszystkie środki)

```
[ ] środek i adresat z SO-0; podstawa przepisu z t.j. (ELI) i data odczytu
[ ] termin z JUR:terminy-procesowe na dacie doręczenia z akt
[ ] zakres zaskarżenia (całość/część; rozstrzygnięcie/ustalenie/uzasadnienie — KPK art. 425 § 2)
[ ] każdy zarzut: konkret sprawy → przepis → uchybienie → wpływ na wynik → wniosek
[ ] zarzuty faktyczne wskazują konkretne fakty (KPC art. 368 § 1¹) i dowody z kartą akt
[ ] nowe fakty/dowody: uprawdopodobnienie braku możliwości wcześniejszego powołania
[ ] wniosek końcowy zgodny z kompetencją sądu/organu (zmiana vs uchylenie: KPC art. 386 § 4, KPK art. 437 § 2, art. 454, KPC art. 477¹⁴, KPA art. 138)
[ ] orzeczenia [ORZ-DO-WERYFIKACJI] zweryfikowane albo usunięte
[ ] opłata i forma: JUR:pisma-oplaty; podpis profesjonalny tam, gdzie wymagany
```

## ŹRÓDŁA PRAKTYKI (odczyt 2026-11-19)

- P1 — Najczęstsze zarzuty w apelacjach cywilnych i sposób ich formułowania, poradnikprzedsiebiorcy.pl (10.12.2024): https://poradnikprzedsiebiorcy.pl/-najczestsze-zarzuty-w-apelacjach-cywilnych-i-sposob-ich-formulowania
- P2 — Ł. Nysztal, Zgłoszenie nowych dowodów w apelacji cywilnej, infor.pl (10.10.2010; przepisy sprawdzone z t.j. 2026/468): https://www.infor.pl/prawo/w-sadzie/postepowanie-sadowe/256496,Zgloszenie-nowych-dowodow-w-apelacji-cywilnej.html
- P3 — Zarzuty — materiał dydaktyczny, Wydział Prawa UWr: https://prawo.uwr.edu.pl/wp-content/uploads/sites/210/2022/07/Zarzuty-uproszcz-apelacja.pdf (z wyników wyszukiwania; nie odczytany w całości)
- P4 — Art. 233 KPC — dobór orzecznictwa w apelacji, Wolters Kluwer Expert Insights (24.06.2026): https://www.wolterskluwer.com/pl-pl/expert-insights/art-233-kpc-dobor-orzecznictwa-apelacja (pełny tekst niedostępny — HTTP 403; teza z omówienia)
- P5 — Postępowanie zażaleniowe — trzy nowelizacje w pięć lat, prawo.pl: https://www.prawo.pl/prawnicy-sady/zmiany-w-postepowaniu-zazaleniowym-od-2019-r,527235.html
- P6 — Zażalenia poziome: luki w przepisach utrudniają pracę sądom i pełnomocnikom, prawo.pl: https://www.prawo.pl/prawnicy-sady/zazalenia-poziome-luki-w-przepisach-utrudniaja-prace-sadom-i,504054.html
- P7 — Spór z ZUS: odwołanie od decyzji organu rentowego, rp.pl (24.04.2012; przepisy sprawdzone z t.j. 2026/468): https://pro.rp.pl/zus/art13772711-spor-z-zus-odwolanie-od-decyzje-organu-rentowego
- P8 — B. Augustyniak, D. Świecki, M. Wąsek-Wiaderek, Postępowanie odwoławcze… (KSSiP, Znowelizowany KPK w pracy prokuratora i sędziego, 2015; rozdz. I D. Świecki): https://www.kssip.gov.pl/sites/default/files/postepowanie_odwolawcze._-_srodek_-_internet.pdf
- P9 — Odwołanie od decyzji administracyjnej, e-prawnik.pl i infor.pl (omówienia art. 128–129 KPA): https://e-prawnik.pl/artykuly/odwolanie-od-decyzji-administracyjnej.html
- P10 — Postępowanie sądowoadministracyjne — zajęcia 5, Wydział Prawa UWr: https://prawo.uni.wroc.pl/sites/default/files/students-resources/Post%C4%99powanie%20s%C4%85dowoadministracyjne%20-%20zaj%C4%99cia%205.pdf
