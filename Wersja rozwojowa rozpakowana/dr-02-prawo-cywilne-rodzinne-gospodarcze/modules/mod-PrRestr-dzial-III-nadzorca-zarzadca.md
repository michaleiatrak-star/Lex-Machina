# Restrukturyzacja — nadzorca układu, nadzorca sądowy, zarządca: status, nadzór, sprawozdania, wynagrodzenie (PrRestr art. 23–64)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 9–21
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak (późniejsze nowelizacje dotyczą art. 4 i 156 → `references/insolvency/wersje-i-przepisy-przejsciowe.md`). Art. 26a dodany przez DU/2025/1170 (od 09.09.2025) — ujęty w t.j.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 55 --verify-online`. **Podstawa wynagrodzenia** (art. 42 ust. 3, 55 ust. 3) = przeciętne miesięczne wynagrodzenie w sektorze przedsiębiorstw bez nagród z zysku w **III kwartale roku poprzedniego** — wartość pobierz z komunikatu Prezesa GUS, nie z pamięci. Nie licz wynagrodzenia według przepisów PrUp o syndyku.

---

## FAZA 0 — INTAKE

```
□ Rodzaj postępowania → organ: PZU — nadzorca układu (umowa, 35); PPU/PU — nadzorca sądowy (38); sanacja — zarządca (51); zarządca także po odebraniu zarządu w PPU/PU (51 ust. 3, 62)
□ Kandydat: licencja doradcy restrukturyzacyjnego + konto w systemie (24 ust. 1); tytuł kwalifikowanego doradcy przy dużym przedsiębiorcy / spółce strategicznej (38 ust. 1c, 51 ust. 1c)
□ Przeszkody z art. 24 ust. 2 (wierzyciel/dłużnik dłużnika, rodzina, zatrudnienie, organy, > 5% udziałów, spółki powiązane); były nadzorca ≠ zarządca (24 ust. 3)
□ Oświadczenie o braku przeszkód + polisa OC — najpóźniej przy pierwszej czynności (24 ust. 5, 25 ust. 2)
□ Wskazanie osoby przez dłużnika z pisemną zgodą wierzycieli > 30% sumy (38 ust. 2, 51 ust. 2) lub przez radę wierzycieli (133 ust. 2)
□ Czynności dłużnika poza zwykłym zarządem w PPU/PU → zgoda nadzorcy (także następcza w 30 dni), inaczej nieważność (39)
□ Sprawozdania miesięczne (31), rachunkowe zarządcy (32) — zarzuty do wydatków w 30 dni; sprawozdanie końcowe (33)
□ Wynagrodzenie: liczba wierzycieli-uczestników, suma wierzytelności, obroty średniomiesięczne (sanacja), czas > 12 mies., wynik (zatwierdzenie / odmowa / umorzenie), VAT
□ PPU: zaliczka dłużnika na wynagrodzenie nadzorcy — 30% w 7 dni i 10% w 2 mies. pod rygorem umorzenia (43a)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 23–34b | przepisy ogólne: organy, kwalifikacje i przeszkody, OC, mediacja, finansowanie, czas funkcji, zmiana, wygaśnięcie, upomnienie, grzywna, odwołanie, sprawozdania, doręczenia zagraniczne, czynności na rachunek dłużnika | A |
| 35–37 | nadzorca układu (PZU) | B |
| 38–41 | nadzorca sądowy: powołanie, zgody, zadania, odpowiedzialność za informacje | C |
| 42–50 | wynagrodzenie nadzorcy sądowego | D |
| 51–54 | zarządca: powołanie, zadania, działanie na rachunek dłużnika, obowiązki sprawozdawcze i giełdowe | E |
| 55–64 | wynagrodzenie zarządcy: wstępne, zaliczki, ostateczne, depozyt, uchwała wierzycieli | F |
| uchylone | brak całych artykułów (uchylone m.in. 34 ust. 2–3, 52 ust. 2 i 4) | — |

---

## A. Przepisy ogólne (art. 23–34b)

- **Art. 23:** postępowanie toczy się z udziałem **nadzorcy** (nadzorca układu albo nadzorca sądowy) albo **zarządcy**.
- **Art. 24:** organem może być osoba fizyczna z **pełną zdolnością**, **licencją doradcy restrukturyzacyjnego** i **kontem doradcy w systemie teleinformatycznym**, albo **spółka handlowa**, której wspólnicy odpowiadający bez ograniczenia lub członkowie zarządu reprezentujący mają licencję i która ma konto (ust. 1); spółka zakłada konto (ust. 1a). **Przeszkody** (ust. 2): wierzyciel lub dłużnik dłużnika (pkt 1); małżonek, wstępny, zstępny, rodzeństwo, powinowaci dłużnika lub wierzyciela (pkt 2); przysposobienie, konkubinat ze wspólnym gospodarstwem (pkt 3); zatrudnienie lub świadczenie pracy/usług na rzecz dłużnika — poza doradztwem restrukturyzacyjnym (pkt 4); członek organu, prokurent, pełnomocnik dłużnika, a także wspólnik/akcjonariusz z **> 5%** kapitału dłużnika lub wierzyciela (w PSA — > 5% akcji) obecnie lub w **2 latach** przed wnioskiem (pkt 5); to samo wobec **spółki powiązanej** (pkt 6). **Były nadzorca nie może zostać zarządcą** u tego samego dłużnika (ust. 3); przeszkody rodzinne trwają mimo ustania małżeństwa/przysposobienia (ust. 4); **oświadczenie o braku przeszkód** najpóźniej z pierwszą czynnością (ust. 5); przy wymogu tytułu kwalifikowanego doradcy — także spółka, której wspólnicy/członkowie zarządu go mają (ust. 6).
- **Art. 25:** odpowiedzialność za szkodę (ust. 1); dowód **ubezpieczenia OC** najpóźniej z pierwszą czynnością — koszt nie jest kosztem postępowania (ust. 2).
- **Art. 25a:** pomoc w **negocjacjach** dłużnika z wierzycielami (ust. 1); za zgodą dłużnika — **mediator**; umowę zawiera nadzorca/zarządca (ust. 2).
- **Art. 26:** nadzorca informuje o źródłach **finansowania**, w tym pomocy publicznej, i współpracuje w ich pozyskaniu (ust. 1); zarządca podejmuje działania o dodatkowe finansowanie (ust. 2).
- **Art. 26a:** po obwieszczeniu otwarcia **banki i SKOK-i** prowadzące rachunki, sejfy, skrytki dłużnika zawiadamiają nadzorcę sądowego albo zarządcę.
- **Art. 27:** funkcja do **zakończenia** lub prawomocnego umorzenia (ust. 1); przy uproszczonym wniosku o sanację lub upadłość — do otwarcia sanacji / ogłoszenia upadłości albo prawomocnego oddalenia, odrzucenia, umorzenia (ust. 2); w postanowieniu — numer licencji lub numer KRS spółki (ust. 3).
- **Art. 28:** sąd **zmienia** nadzorcę sądowego/zarządcę: na jego wniosek (pkt 1), przy cofnięciu/zawieszeniu licencji (pkt 2), na uchwałę rady z art. 133 ust. 2 (pkt 3), na wniosek dłużnika z pisemną zgodą wierzycieli **> 30%** sumy (bez wyłączonych z art. 80 ust. 3, 109 ust. 1, 116) (pkt 4) (ust. 1); przy pkt 4 sąd może odmówić osoby bez rękojmi (ust. 2); dłużnik nie zmieni organu powołanego z uchwały rady (ust. 3).
- **Art. 29:** stwierdzenie **wygaśnięcia**: śmierć (z datą), utrata pełnej zdolności, braki w organach spółki-organu (ust. 1–2); odpis prawomocnego postanowienia — Minister Sprawiedliwości (ust. 3).
- **Art. 30:** **upomnienie** przez sędziego-komisarza (ust. 1); **grzywna 1 000–30 000 zł** przy istotnym uchybieniu lub braku poprawy (ust. 2); **odwołanie** przez sąd przy rażącym uchybieniu, braku poprawy mimo grzywny albo niezłożeniu oświadczenia (24 ust. 5) lub polisy (25 ust. 2) mimo wezwania w **tydzień**; odpis do MS (ust. 3); wniosek o odwołanie może złożyć **prokurator** (ust. 3a); wysłuchanie, możliwe **zawieszenie** z tymczasowym organem (ust. 4); zażalenie, także organu (ust. 5); nowy organ po uprawomocnieniu odwołania, w międzyczasie tymczasowy (ust. 6).
- **Art. 30a:** **obwieszczenie** postanowień o powołaniu oraz prawomocnych o zmianie, odwołaniu, zawieszeniu, wygaśnięciu.
- **Art. 31:** **sprawozdania miesięczne** z czynności (ust. 1); nadzorca sądowy: czy dłużnik reguluje zobowiązania **po otwarciu**, stan niezaspokojonych zobowiązań, wpływy/wydatki i środki na początek i koniec okresu, zgody na czynności poza zwykłym zarządem (ust. 2); zarządca: etap planu, regulowanie zobowiązań po otwarciu sanacji, stan niezaspokojonych (ust. 3); sędzia-komisarz może zmienić terminy i treść (ust. 4).
- **Art. 32:** zarządca — **sprawozdanie rachunkowe co miesiąc** (wpływy i wydatki ze źródłami, środki, narastająco od otwarcia, przychody i koszty) (ust. 1); inne terminy/wymogi (ust. 2); **zarzuty** dłużnika i wierzycieli do **wydatków** w **30 dni** od złożenia; wadliwe lub spóźnione — bez rozpoznania, bez art. 130 § 1 KPC (ust. 3); sędzia-komisarz w **2 miesiące** może **odmówić uznania wydatku** i nakazać **zwrot do masy** (ust. 3a); zażalenie, także zarządcy (ust. 4); prawomocne postanowienie o zwrocie — **tytuł egzekucyjny** przeciw zarządcy (ust. 5).
- **Art. 33:** zarządca składa **sprawozdanie końcowe** (stopień realizacji planu, wydanie majątku i dokumentów) (ust. 1); zatwierdza **sąd**; odmowa przy czynnościach bezprawnych, krzywdzących lub niewykonaniu obowiązków (ust. 2); zażalenie (ust. 3); odmowa — odpis do MS (ust. 4).
- **Art. 34:** do sprawozdań z art. 32–33 **nie stosuje się ustawy o rachunkowości** (ust. 1; ust. 2–3 uchylone).
- **Art. 34a:** do pism wierzycieli zagranicznych z art. 196b ust. 1 i dokumentów z art. 196c — art. 165 § 1–3 KPC (ust. 1); doręczenia do nich — art. 131–139 i 140–142 KPC (ust. 2); pouczenie o art. 196a–196c i zażaleniu co do **jurysdykcji** (ust. 3).
- **Art. 34b:** przy zleceniu **planu** (art. 10 ust. 4), **wyceny** (art. 10a ust. 3), umowie z **mediatorem** (25a ust. 2) i **opinii** (art. 164 ust. 3a) nadzorca działa **w imieniu własnym na rachunek dłużnika** (ust. 1) i **nie odpowiada** za te zobowiązania (ust. 2).

## B. Nadzorca układu (art. 35–37)

- **Art. 35:** w **PZU** wybiera go **dłużnik** — działa na podstawie **umowy** (ust. 1) z określonym wynagrodzeniem (ust. 2). **Mikroprzedsiębiorca** — limit **15%** zaspokojenia według układu, ponad **100 000 zł — 3%**, ponad **500 000 zł — 1%** (ust. 2a); przy prawomocnej odmowie zatwierdzenia lub umorzeniu — **≤ 2×** przeciętnego wynagrodzenia (III kw. roku poprzedniego) (ust. 2b). Umowa **wygasa** przy cofnięciu/zawieszeniu licencji, śmierci, utracie zdolności oraz gdy w **2 tygodnie** nie zawarto **OC** (ust. 3); dłużnik niezwłocznie zawiera nową umowę (ust. 4).
- **Art. 36:** umowa **nie ogranicza zarządu** dłużnika (ust. 1); dłużnik udziela pełnych i prawdziwych informacji i dokumentów (ust. 2) **pod rygorem odpowiedzialności karnej** — pouczenie przez nadzorcę (ust. 3); nadzorca nie odpowiada za prawdziwość informacji pouczonego dłużnika, ale musi je **rzetelnie weryfikować** przy wątpliwościach (ust. 4).
- **Art. 37:** nadzorca może **kontrolować** czynności majątkowe i przedsiębiorstwo, w tym zabezpieczenie mienia (ust. 1); zadania: **plan** i **propozycje** wspólnie z dłużnikiem, **spis wierzytelności i spornych**, współpraca przy **zbieraniu głosów**, **sprawozdanie o możliwości wykonania układu** (ust. 2).

## C. Nadzorca sądowy (art. 38–41)

- **Art. 38:** powołuje go sąd w postanowieniu o otwarciu **PPU lub PU** (ust. 1), uwzględniając obciążenie innymi sprawami, doświadczenie, kwalifikacje i specyfikę (ust. 1a–1b). **Kwalifikowany doradca** obowiązkowo przy: przedsiębiorcy z **≥ 250 pracowników**, obrotem **> 50 mln EUR** lub aktywami **> 43 mln EUR** w jednym z 2 ostatnich lat; spółce o istotnym znaczeniu dla gospodarki (wykaz z ustawy o zasadach zarządzania mieniem państwowym); przedsiębiorcy o szczególnym znaczeniu gospodarczo-obronnym (ust. 1c). Na wniosek dłużnika z pisemną zgodą wierzycieli **> 30%** sumy (bez wyłączonych z art. 80 ust. 3 i 116) — osoba wskazana, chyba że brak rękojmi (ust. 2).
- **Art. 39:** po powołaniu dłużnik dokonuje **czynności zwykłego zarządu**; poza nim — **zgoda nadzorcy** (chyba że wymagane zezwolenie rady), także **następcza w 30 dni**; brak zgody → **nieważność** (ust. 1); art. 36 ust. 2–3 i 37 ust. 1 odpowiednio (ust. 2).
- **Art. 40:** zadania: **zawiadomienie wierzycieli** o otwarciu (pkt 1), **plan i spis** (pkt 2), ocena i doradztwo co do propozycji, działania na rzecz maksymalnej liczby ważnych głosów, udział w zgromadzeniu, **opinia o wykonalności** (pkt 3), w PPU — **spis spornych** (pkt 4).
- **Art. 41:** brak odpowiedzialności za prawdziwość informacji pouczonego dłużnika; obowiązek rzetelnej weryfikacji.

## D. Wynagrodzenie nadzorcy sądowego (art. 42–50)

- **Art. 42:** suma **4 części**, w granicach **2–44 podstaw** (ust. 1):
  - **liczba wierzycieli-uczestników:** do 10 — 1; 11–50 — 3; 51–100 — 6; 101–500 — 8; 501–1000 — 10; > 1000 — 12 podstaw;
  - **suma wierzytelności:** do 100 tys. zł — 1; do 500 tys. — 3; do 1 mln — 6; do 10 mln — 8; do 500 mln — 10; > 500 mln — 12;
  - **część uznaniowa** (rodzaj postępowania, zakres czynności, nakład) — do **10**;
  - **przedłużenie > 12 miesięcy** z przyczyn niezależnych — do **10** (ust. 2);
  - podstawa = przeciętne wynagrodzenie, **III kw. roku poprzedniego** (ust. 3).
- **Art. 43:** w **PU** — **zaliczki kwartalne 10%** wynagrodzenia z części 1–2, po pełnym kwartale, nie przed złożeniem spisu (ust. 1); na podstawie rachunku (ust. 2); spory i dalsze zaliczki po **5 kwartałach** — sędzia-komisarz (ust. 3).
- **Art. 43a:** w **PPU** dłużnik wpłaca zaliczkę: **30%** (części 1–2) w **7 dni** od doręczenia postanowienia o otwarciu i **10%** w **2 miesiące** od otwarcia — **pod rygorem umorzenia** (ust. 1); wyliczenie z wykazu wierzycieli (227 ust. 1 pkt 6), a po złożeniu spisu — ze spisu (ust. 2); niedopłata — wezwanie do uzupełnienia w **14 dni** pod rygorem umorzenia (ust. 3); nie stosuje się, gdy nadzorca oświadczy, że dłużnik będzie płacił **zaliczki miesięczne** z rachunków (ust. 4); przy braku zapłaty nadzorca może cofnąć oświadczenie (ust. 5).
- **Art. 44:** wniosek o wynagrodzenie w **tydzień** od opinii o wykonalności albo doręczenia postanowienia o odwołaniu, zmianie lub umorzeniu; uchybienie → wynagrodzenie = **pobrane zaliczki** (lub niższe ze zwrotem); możliwe przywrócenie terminu (ust. 1); treść wniosku (ust. 2); stanowiska dłużnika, wierzycieli, opinia rady (ust. 3).
- **Art. 45:** postanowienie niezwłocznie po zakończeniu lub prawomocnym umorzeniu (ust. 1); zażalenie, także nadzorcy (ust. 2); **zwrot nadwyżki zaliczek** (ust. 3); **tytuł egzekucyjny** przeciw nadzorcy i dłużnikowi (ust. 4); wynagrodzenie = **wydatek postępowania** (ust. 5).
- **Art. 46:** prawomocna **odmowa zatwierdzenia** lub **umorzenie** → **40%** wynagrodzenia z art. 42 (ust. 1); **zatwierdzenie** → do pełnej kwoty (ust. 2): **90%** po uprawomocnieniu, reszta po **stwierdzeniu wykonania układu** (ust. 3).
- **Art. 47:** kilku nadzorców — podział **proporcjonalny do czasu**, z możliwym odstępstwem ze względu na wpływ na przyjęcie układu.
- **Art. 48:** odebranie zarządu i ustanowienie zarządcy — **odrębne** wynagrodzenia, proporcjonalnie zmniejszone według czasu (z możliwym odstępstwem).
- **Art. 49:** podwyższenie o **VAT**.
- **Art. 50:** śmierć — roszczenie wchodzi do **spadku**; sąd orzeka z urzędu.

## E. Zarządca (art. 51–54)

- **Art. 51:** powoływany w postanowieniu o otwarciu **sanacji** (ust. 1); kryteria jak art. 38 ust. 1a–1b (ust. 1a–1b); **kwalifikowany doradca** przy dużym przedsiębiorcy, spółce strategicznej i przedsiębiorcy realizującym zadania na rzecz **Sił Zbrojnych** (art. 648 ustawy o obronie Ojczyzny) (ust. 1c); osoba wskazana przez dłużnika ze zgodą wierzycieli **> 30%** (ust. 2); przepisy rozdziału stosuje się do zarządcy w **PPU/PU** (ust. 3).
- **Art. 52:** zarządca niezwłocznie **obejmuje zarząd masą sanacyjną**, sporządza **spis inwentarza z oszacowaniem**, sporządza i **realizuje plan** (ust. 1); art. 36 ust. 2–3 i 40 odpowiednio (ust. 3; ust. 2 i 4 uchylone).
- **Art. 53:** w sprawach masy działa **w imieniu własnym na rachunek dłużnika** (ust. 1) i **nie odpowiada** za zaciągnięte zobowiązania (ust. 2).
- **Art. 54:** wykonuje **obowiązki sprawozdawcze dłużnika**; nie odpowiada za opóźnienia z winy dłużnika (ust. 1); obowiązki informacyjne **spółki publicznej** (art. 56 ust. 1 pkt 2 i ust. 7, art. 70 ustawy o ofercie publicznej) i **MAR** (art. 17 ust. 1–2, 19 ust. 3 rozp. 596/2014) ciążą na zarządcy (ust. 2); dłużnik (lub kurator) natychmiast udostępnia informacje (ust. 3).

## F. Wynagrodzenie zarządcy (art. 55–64)

- **Art. 55:** suma **5 części**, w granicach **3–208 podstaw** (ust. 1):
  - **liczba wierzycieli:** do 10 — 1; 11–50 — 3; 51–100 — 6; 101–500 — 10; 501–1000 — 12; > 1000 — 24;
  - **suma wierzytelności:** do 100 tys. zł — 1; do 500 tys. — 3; do 1 mln — 6; do 10 mln — 10; do 500 mln — 12; > 500 mln — 24;
  - **średniomiesięczne obroty w sanacji:** do 20 tys. zł — 1; do 100 tys. — 6; do 1 mln — 12; do 10 mln — 20; do 50 mln — 60; > 50 mln — 80;
  - **część uznaniowa** (poprawa kondycji, korzystne umowy, skomplikowanie, zatrudnienie) — do **60**;
  - **przedłużenie > 12 miesięcy** — do **20** (ust. 2);
  - podstawa — **III kw. roku poprzedniego** (ust. 3).
- **Art. 56:** **wynagrodzenie wstępne** na wniosek po złożeniu **planu**, ustalane w **30 dni** od wniosku (ust. 1); dane: wierzyciele, suma, prognozowane obroty, trudność i planowana poprawa (ust. 2); stanowiska i opinia rady (ust. 3); kryteria art. 55 z prawdopodobieństwem realizacji planu (ust. 4); zażalenie **tylko dłużnika i zarządcy** (ust. 5).
- **Art. 57:** **zaliczki kwartalne 7%** wynagrodzenia wstępnego po pełnym kwartale; pierwsza — nie wcześniej niż przed uprawomocnieniem postanowienia o wynagrodzeniu wstępnym (ust. 1); rachunek (ust. 2); dalsze po **5 kwartałach** — sędzia-komisarz (ust. 3).
- **Art. 58:** **wynagrodzenie ostateczne** — wniosek w **tydzień** od opinii o wykonalności albo doręczenia odwołania, zmiany, umorzenia; uchybienie → pobrane zaliczki; przywrócenie terminu (ust. 1); dane: wierzyciele, suma, osiągnięte obroty, poprawa kondycji i przychody, efekty umów, skomplikowanie i zatrudnienie (ust. 2); stanowiska i opinia rady (ust. 3).
- **Art. 59:** postanowienie niezwłocznie po zakończeniu / umorzeniu (ust. 1); odmowa zatwierdzenia / umorzenie → **30%** wynagrodzenia z art. 55 (ust. 2); zatwierdzenie → do pełnej kwoty (ust. 3): **85%** po uprawomocnieniu, reszta po stwierdzeniu wykonania układu (ust. 4); przy wydaniu majątku dłużnikowi z zakończeniem albo umorzeniu — **depozyt sądowy** różnicy między wnioskowanym a zaliczkami, z możliwym ograniczeniem do **≥ 30%** wynagrodzenia z części 1–3 (ust. 5); orzeka sąd jednoosobowo, bez art. 693³ § 1 i 3 KPC; wydanie z depozytu po prawomocnym ustaleniu (ust. 6); zwrot nadwyżki zaliczek (ust. 7); zażalenie, także zarządcy (ust. 8); **tytuł egzekucyjny** przeciw zarządcy i dłużnikowi (ust. 9); wynagrodzenie = **wydatek postępowania** (ust. 10).
- **Art. 60:** kilku zarządców — proporcjonalnie do czasu, z odstępstwem ze względu na wpływ na wyniki z art. 55 ust. 2 pkt 4 i przyjęcie układu.
- **Art. 61:** wynagrodzenie może ustalić **uchwała zgromadzenia wierzycieli** podejmowana z uchwałą o układzie (te same kworum i większości) (ust. 1); **nie niższe** niż części 1–3 z art. 55; zalicza się zaliczki (ust. 2); głosowanie tylko po **oświadczeniu dłużnika o poparciu** (ust. 3), zbędnym, gdy uchwała przewiduje **≤ 150%** wynagrodzenia z art. 55 (ust. 4); nieprzyjęcie układu lub odmowa zatwierdzenia — uchwała traci moc; wniosek w **tydzień** (ust. 5); sąd zatwierdza uchwałę wraz z układem (ust. 6); zaskarżenie jak postanowienia o zatwierdzeniu układu (ust. 7); odmowa zatwierdzenia uchwały przy niezgodności z prawem lub naruszeniu istotnych interesów zarządcy, wierzycieli przeciwnych (z zastrzeżeniami) lub dłużnika sprzeciwiającego się; wniosek w tydzień (ust. 8); art. 59 ust. 4–7 odpowiednio (ust. 9).
- **Art. 62:** zarządca po odebraniu zarządu w **PPU/PU** — wynagrodzenie jak w sanacji.
- **Art. 63:** podwyższenie o **VAT**.
- **Art. 64:** śmierć zarządcy — roszczenie do **spadku**; sąd orzeka z urzędu.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| > 5% kapitału / akcji; 2 lata | przeszkoda udziałowa | art. 24 ust. 2 pkt 5–6 |
| przy pierwszej czynności | oświadczenie o braku przeszkód; polisa OC | art. 24 ust. 5; 25 ust. 2 |
| > 30% sumy wierzytelności | zgoda wierzycieli na wskazanie / zmianę organu | art. 28 ust. 1 pkt 4; 38 ust. 2; 51 ust. 2 |
| 1 000–30 000 zł | grzywna dla nadzorcy/zarządcy | art. 30 ust. 2 |
| tydzień | wezwanie do oświadczenia / polisy przed odwołaniem | art. 30 ust. 3 |
| co miesiąc | sprawozdania z czynności; rachunkowe zarządcy | art. 31; 32 |
| 30 dni / 2 miesiące | zarzuty do wydatków; odmowa uznania wydatku | art. 32 ust. 3–3a |
| 15% / 3% > 100 tys. / 1% > 500 tys.; ≤ 2× | limity wynagrodzenia nadzorcy układu u mikroprzedsiębiorcy | art. 35 ust. 2a–2b |
| 2 tygodnie | OC nadzorcy układu — inaczej wygaśnięcie umowy | art. 35 ust. 3 |
| ≥ 250 prac. / > 50 mln EUR / > 43 mln EUR | wymóg kwalifikowanego doradcy | art. 38 ust. 1c; 51 ust. 1c |
| 30 dni | następcza zgoda nadzorcy na czynność | art. 39 ust. 1 |
| 2–44 podstaw | wynagrodzenie nadzorcy sądowego | art. 42 |
| 10% / kwartał (PU) | zaliczki nadzorcy sądowego | art. 43 |
| 30% w 7 dni; 10% w 2 mies.; 14 dni | zaliczki PPU, uzupełnienie | art. 43a |
| tydzień | wniosek o wynagrodzenie (nadzorca / zarządca) | art. 44 ust. 1; 58 ust. 1; 61 ust. 5, 8 |
| 40% / 90% | nadzorca: przy porażce / wypłata po zatwierdzeniu | art. 46 |
| 3–208 podstaw | wynagrodzenie zarządcy | art. 55 |
| 30 dni | ustalenie wynagrodzenia wstępnego | art. 56 ust. 1 |
| 7% / kwartał | zaliczki zarządcy | art. 57 |
| 30% / 85%; depozyt ≥ 30% | zarządca: przy porażce / wypłata po zatwierdzeniu; zabezpieczenie | art. 59 ust. 2, 4, 5 |
| ≤ 150% | uchwała wierzycieli bez poparcia dłużnika | art. 61 ust. 4 |

## PUŁAPKI

- Licencja nie wystarcza — wymagane konto doradcy w systemie (24 ust. 1).
- Były nadzorca nie może zostać zarządcą tego samego dłużnika (24 ust. 3).
- Brak oświadczenia o przeszkodach lub polisy po wezwaniu = obligatoryjne odwołanie (30 ust. 3).
- Czynność poza zwykłym zarządem bez zgody nadzorcy jest nieważna — zgoda następcza możliwa tylko w 30 dni (39 ust. 1); zezwolenie rady (art. 129) to osobny wymóg.
- PPU: niezapłacenie zaliczki na wynagrodzenie nadzorcy w 7 dni / 2 miesiące → umorzenie (43a).
- Spóźniony wniosek o wynagrodzenie = wynagrodzenie równe pobranym zaliczkom (44 ust. 1, 58 ust. 1).
- Przy porażce postępowania nadzorca dostaje 40%, zarządca 30% wynagrodzenia z tabel (46 ust. 1, 59 ust. 2).
- Zarządca działa w imieniu własnym i nie odpowiada za zobowiązania masy (53).
- Spółka publiczna: obowiązki MAR i z ustawy o ofercie przechodzą na zarządcę (54 ust. 2).
- Art. 38 ust. 1c pkt 3 odsyła do ustawy o organizowaniu zadań na rzecz obronności, która według odnośnika t.j. **utraciła moc** z 23.04.2022 (ustawa o obronie Ojczyzny) — ustal zakres przepisu z orzecznictwem / przepisami przejściowymi; art. 51 ust. 1c pkt 3 odsyła już do art. 648 ustawy o obronie Ojczyzny.
- Ustawy o rachunkowości nie stosuje się do sprawozdań zarządcy (34 ust. 1).

## POWIĄZANIA

- Rada wierzycieli (art. 128–133), zmiana organu z art. 133 ust. 2, wyłączenia art. 80 ust. 3, 109, 116 → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`
- PPU/PU: tymczasowy nadzorca (art. 268), zarządca w PPU (art. 239) → `mod-PrRestr-ppu-pu`
- PZU, nadzorca układu → `mod-PrRestr-pzu`; sanacja → `mod-PrRestr-sanacja`
- Plan i wycena (art. 10, 10a), opinia (art. 164 ust. 3a) → `mod-PrRestr-wejscie-plan-test`, `mod-PrRestr-dzial-VI-uklad`
- Wierzyciele zagraniczni (art. 196a–196c) → `mod-PrRestr-procedura-zakonczenie`
- Licencja doradcy restrukturyzacyjnego → `mod-ustawa-doradca-restrukturyzacyjny-zawod`
- Wynagrodzenie syndyka (inne zasady) → `mod-PrUpad-syndyk-likwidacja`

## WYNIK

Organ właściwy dla trybu (23, 35, 38, 51) → weryfikacja kandydata: licencja, konto, przeszkody, OC, kwalifikowany doradca (24–25, 38 ust. 1c, 51 ust. 1c) → nadzór: zgody (39), sprawozdania (31–33), dyscyplina i zmiana (28–30) → wynagrodzenie: kalkulacja z tabel (42 / 55) z podstawą GUS, zaliczki (43, 43a, 57), wniosek w tydzień (44 / 58), procent przy porażce i rozkład wypłat (46 / 59), depozyt i uchwała wierzycieli (59 ust. 5, 61), VAT.
