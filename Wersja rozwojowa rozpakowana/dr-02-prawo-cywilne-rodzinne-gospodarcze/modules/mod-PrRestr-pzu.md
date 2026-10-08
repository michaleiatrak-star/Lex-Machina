# Restrukturyzacja — postępowanie o zatwierdzenie układu (PZU) (PrRestr art. 210–226i)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 54–60
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak (późniejsze nowelizacje dotyczą art. 4 i 156 → `references/insolvency/wersje-i-przepisy-przejsciowe.md`).
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 226a --verify-online`. PZU — tylko gdy sporne wierzytelności uprawniające do głosu **≤ 15%** (art. 3 ust. 2 pkt 2). Odróżniaj trzy daty: **dzień układowy** (211), **obwieszczenie o ustaleniu dnia układowego** (226a), **złożenie wniosku o zatwierdzenie** (219).

---

## FAZA 0 — INTAKE

```
□ Umowa z nadzorcą układu (210; wynagrodzenie i limity dla mikroprzedsiębiorcy — art. 35 ust. 2a–2b), polisa OC w 2 tyg. (35 ust. 3)
□ Dzień układowy: najwcześniej 4 mies., najpóźniej dzień przed wnioskiem (211 ust. 2); przy obwieszczeniu — najpóźniej w dniu obwieszczenia (211 ust. 2a)
□ Akta w systemie od dnia ustalenia dnia układowego (211a)
□ Dokumenty ≥ 30 dni przed zbieraniem głosów / zgromadzeniem: spis, spis sporny, plan, test zaspokojenia, opinia, test prywatnego wierzyciela (211b)
□ Obwieszczenie o ustaleniu dnia układowego (226a): przeszkody 10-letnie — wcześniejsze obwieszczenie w PZU / umorzone postępowanie restrukturyzacyjne (bez zgody rady)
□ Ochrona po obwieszczeniu: zakaz egzekucji do masy (312), ochrona najmu i umów kluczowych (256) — 4 miesiące na wniosek (226g)
□ Głosowanie: system teleinformatyczny + informacja listowna/komornicza ≥ 3 tyg. przed wnioskiem (212, 219 ust. 2 pkt 2) albo zgromadzenie (212 ust. 3–6)
□ Karta do głosowania — 12 elementów, inaczej nieważna (213); głos ważny 4 mies. (215)
□ Spory > 15% → nadzorca pisemnie informuje o niemożności PZU (218 ust. 1); głosy do PU/sanacji (218 ust. 2)
□ Wniosek o zatwierdzenie (219) + sprawozdanie nadzorcy (220) — sąd rozpoznaje w 2 tygodnie (223)
□ Plan B: przy odmowie / umorzeniu — uproszczony wniosek sanacyjny (328) lub upadłościowy (334) (226h)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 210–211 | umowa z nadzorcą układu, dzień układowy | A |
| 211a–211b | akta w systemie, dokumenty przed głosowaniem | A |
| 212–218 | zbieranie głosów, zgromadzenie, karta, wsparcie z art. 140, ważność głosu, informacje i zastrzeżenia, stwierdzenie przyjęcia, przekroczenie 15% | B |
| 218a–224 | umorzenie z mocy prawa, wniosek o zatwierdzenie, sprawozdanie, braki, zawiadomienia, termin rozpoznania, nadzorca między zatwierdzeniem a prawomocnością | C |
| 225–226 | nieważność klauzul ipso facto, brak zabezpieczenia sądowego | C |
| 226a–226i | obwieszczenie o ustaleniu dnia układowego: przesłanki, skarga na odmowę, treść, skutki, uchylenie, wygaśnięcie, wnioski uproszczone, art. 131a PrUp | D |
| uchylone | brak całych artykułów (uchylony 217 ust. 1–3) | — |

---

## A. Przygotowanie (art. 210–211b)

- **Art. 210:** dłużnik zawiera **umowę o sprawowanie nadzoru** z osobą spełniającą art. 24 — **nadzorca układu** — w celu przygotowania propozycji, samodzielnego zbierania głosów i złożenia wniosku (ust. 1); funkcja od dnia zawarcia umowy, chyba że umowa inaczej (ust. 2).
- **Art. 211:** niezwłocznie po rozpoczęciu funkcji nadzorcy dłużnik **ustala dzień układowy** (ust. 1), przypadający **nie wcześniej niż 4 miesiące** i **nie później niż dzień przed** złożeniem wniosku o zatwierdzenie (ust. 2); przy obwieszczeniu z art. 226a — także **nie później niż w dniu obwieszczenia** (ust. 2a). Według **stanu z dnia układowego** ustala się prawo głosu i skutki układu (ust. 3); wierzytelności powstałe **po** dniu układowym **nie są objęte układem** (ust. 4).
- **Art. 211a:** nadzorca zakłada **akta w systemie teleinformatycznym** w dniu ustalenia dnia układowego (ust. 1) i je prowadzi (ust. 1a); pisma z art. 196b ust. 1 wniesione poza systemem wprowadza do akt, oryginały do zbioru dokumentów (ust. 2); udostępnianie w biurze nadzorcy **≥ 4 kolejne godziny między 8.00 a 20.00** w dni powszednie (ust. 3); po wniosku — część akt sądowych; zbiór do sądu po prawomocnym zakończeniu/umorzeniu (ust. 4); dostęp nadzoru MS (ust. 5); przejęcie przez nowego nadzorcę (ust. 6); rozporządzenie MS (ust. 7).
- **Art. 211b:** co najmniej **30 dni** przed zbieraniem głosów lub zgromadzeniem nadzorca sporządza: **spis wierzytelności**, **spis spornych**, **plan restrukturyzacyjny**, **test zaspokojenia** (10a ust. 1), **opinię o wykonalności** (art. 155), **test prywatnego wierzyciela/inwestora** (140) (ust. 1); **zastrzeżenia** uczestników w **2 tygodnie**, odpowiedź nadzorcy w **2 tygodnie**; zastrzeżenia **nie przesuwają** głosowania (ust. 2).

## B. Głosowanie (art. 212–218)

- **Art. 212:** po ustaleniu dnia układowego nadzorca **zbiera głosy** (ust. 1) **przez system teleinformatyczny** (karta w systemie); **informację o sposobie głosowania** z pouczeniem o uwierzytelnieniu doręcza przez **operatora pocztowego lub komornika** na adres z rejestru, a przy braku wpisu — znany dłużnikowi (ust. 2). Może też zwołać **zgromadzenie** (ust. 3) z zawiadomieniem, propozycjami, informacją o grupach, sposobie głosowania i pouczeniem o art. 107–110, 113, 115–119 (ust. 4); protokół z **nagraniem** dźwięku lub obrazu i dźwięku (ust. 5); przewodniczy **nadzorca układu** (ust. 6).
- **Art. 213 — karta do głosowania:** dane dłużnika (pkt 1), NIP (pkt 1a), dane wierzyciela (pkt 2), **kwota wierzytelności** (pkt 3), **grupa** (pkt 4), **zgoda na objęcie układem** z art. 151 ust. 2 (pkt 5), sumy objęte z mocy prawa / za zgodą (pkt 6), **dzień układowy** (pkt 7), **pełna treść propozycji** ze wskazaniem dotyczących wierzyciela (pkt 8), dane nadzorcy z numerem licencji / KRS i kontaktem (pkt 9), **treść głosu** (pkt 10), **data oddania** (pkt 11), **podpis** (pkt 12) (ust. 1); pełnomocnictwo przy podpisie pełnomocnika (ust. 2); karta niespełniająca wymogów — **nieważna** (ust. 3); wzór — rozporządzenie MS (ust. 4); dane identyfikujące (ust. 5).
- **Art. 214:** przy **wsparciu z art. 140** — doręczenie udzielającemu wsparcia planu i testu prywatnego wierzyciela/inwestora z dokumentami z art. 37 ustawy o postępowaniu w sprawach pomocy publicznej.
- **Art. 215:** głos zachowuje ważność, jeżeli wniosek o zatwierdzenie wpłynął **przed upływem 4 miesięcy od oddania głosu**.
- **Art. 216:** nadzorca udziela wierzycielowi na żądanie **informacji** o sytuacji majątkowej i wykonalności układu w zakresie potrzebnym do racjonalnej decyzji (ust. 1); wierzyciel składa **pisemne zastrzeżenia** co do zgodności z prawem zbierania głosów i innych okoliczności — nadzorca dołącza je do sprawozdania (ust. 2).
- **Art. 217:** przyjęcie układu **stwierdza nadzorca układu** (ust. 4; ust. 1–3 uchylone); większości — art. 119 przez odesłania.
- **Art. 218:** gdy sporne uprawniające do głosu **> 15%** — nadzorca niezwłocznie **informuje dłużnika na piśmie o niemożności PZU** (ust. 1); głosy oddane **nie wcześniej niż 3 miesiące** przed wnioskiem o otwarcie **PU lub sanacji**, złożone z tym wnioskiem, **zachowują ważność** na zgromadzeniu niezależnie od jego daty, jeżeli nowe propozycje są **nie mniej korzystne**; wierzyciel jest o tym informowany i może złożyć odmienne oświadczenie (ust. 2).

## C. Wniosek i rozstrzygnięcie (art. 218a–226)

- **Art. 218a:** PZU **umarza się z mocy prawa** z dniem złożenia oświadczenia dłużnika o **rezygnacji** (do chwili złożenia wniosku) (ust. 1) oraz gdy w **4 miesiące od obwieszczenia** o ustaleniu dnia układowego nie wpłynie wniosek o zatwierdzenie (ust. 2); po złożeniu wniosku — kończy się prawomocnym zwrotem, odrzuceniem, oddaleniem, umorzeniem, zatwierdzeniem lub odmową (ust. 3).
- **Art. 219:** wniosek: dane dłużnika (pkt 1), NIP (pkt 1a), **propozycje** (pkt 2), **wynik głosowania** — liczby i sumy uprawnionych, ważnie głosujących i głosujących za, także **w grupach** (pkt 3) (ust. 1). Załączniki: **karty** z systemu z pełnomocnictwami i informacją o art. 116, w kolejności spisu (pkt 1); **dowód wysłania ≥ 3 tygodnie** przed wnioskiem informacji o głosowaniu / zawiadomienia o zgromadzeniu wierzycielom, którzy nie głosowali (pkt 2); **dowody doręczenia** (pkt 2a); **sprawozdanie nadzorcy** (pkt 3) (ust. 2); dane identyfikujące (ust. 3).
- **Art. 220 — sprawozdanie nadzorcy:** stwierdzenie przyjęcia (pkt 1), **ocena legalności zbierania głosów** (pkt 2), **zastrzeżenia wierzycieli** (pkt 3), **ocena wykonalności** (pkt 4), miejsca majątku (pkt 5), wykaz majątku z wyceną (pkt 6), **bilans** na dzień w **30 dniach** przed wnioskiem (pkt 7), spis z informacją o głosie (pkt 8), spis sporny (pkt 9), suma z udziałem spornych (pkt 10), zabezpieczenia wierzycieli z datami (pkt 11), dłużnicy dłużnika (pkt 12), tytuły egzekucyjne i wykonawcze (pkt 13), postępowania o obciążenia i inne postępowania (pkt 14), **polisa OC** (pkt 15), **plan** (pkt 16), informacje z art. 140 i zawiadomienia/opinie z art. 204 albo informacja o ich braku (pkt 17).
- **Art. 221:** braki **wniosku** — art. 130 KPC (ust. 1); braki **sprawozdania** — wezwanie nadzorcy do uzupełnienia w **tydzień** pod rygorem zawiadomienia dłużnika (ust. 2); po bezskutecznym upływie dłużnik może zawrzeć umowę z **nowym nadzorcą**, który składa sprawozdanie w **2 tygodnie** pod rygorem **zwrotu wniosku** (ust. 3).
- **Art. 222:** zawiadomienie organu założycielskiego / podmiotu praw z akcji SP przy przedsiębiorstwie państwowym lub jednoosobowej spółce SP — opinia nie wstrzymuje (ust. 1); udział jako uczestnik (ust. 2); **obwieszczenie** o złożeniu wniosku z danymi z art. 219 ust. 1 (ust. 3).
- **Art. 223:** postanowienie w **2 tygodnie** od wniosku (ust. 1); **podstawa jurysdykcji** i przy rozp. 2015/848 — charakter główny/uboczny (ust. 2); art. 233 ust. 1 pkt 1 i 3 odpowiednio (ust. 3); wierzyciel zagraniczny — zażalenie co do jurysdykcji w **30 dni** od obwieszczenia (ust. 4), także pominięty przy głosowaniu (ust. 5).
- **Art. 224:** od wydania postanowienia do prawomocności nadzorca układu ma **uprawnienia nadzorcy sądowego** (art. 36 ust. 2–3, 37 ust. 1, 39 ust. 1 — zgoda na czynności poza zwykłym zarządem), bez art. 42–50 (ust. 1); stosuje się **art. 259–260** (zawieszenie egzekucji) (ust. 2).
- **Art. 225:** **nieważne** klauzule przewidujące zmianę lub rozwiązanie stosunku na wypadek wniosku, zatwierdzenia lub obwieszczenia z 226a (ust. 1); art. 250–251 (umowy ramowe, kompensowanie) (ust. 2).
- **Art. 226:** w PZU **nie stosuje się przepisów o zabezpieczeniu**.

## D. Obwieszczenie o ustaleniu dnia układowego (art. 226a–226i)

- **Art. 226a:** po sporządzeniu **spisu, spisu spornych i wstępnego planu** nadzorca **może** dokonać obwieszczenia (ust. 1); **niedopuszczalne**, jeżeli w **10 latach** dłużnik prowadził PZU z takim obwieszczeniem albo umorzono wobec niego postępowanie restrukturyzacyjne (chyba że **za zgodą rady wierzycieli**) (ust. 2); wtedy nadzorca **odmawia** (ust. 3).
- **Art. 226b:** odmowa z uzasadnieniem (ust. 1); **skarga dłużnika** do sądu restrukturyzacyjnego z pouczeniem (ust. 2); wymogi pisma (ust. 3); termin **tydzień** od doręczenia odmowy (ust. 4); wnosi się **do nadzorcy**, który w **3 dni** przekazuje ją z odmową, chyba że uwzględnia (ust. 5); sąd rozpoznaje w **tydzień** (ust. 6); odrzucenie — zażalenie (ust. 7).
- **Art. 226c:** treść obwieszczenia: dane dłużnika, **COMI**, informacja o braku przeszkód z 226a ust. 2, pouczenie o prawie z 226f (ust. 1); dane identyfikujące (ust. 2).
- **Art. 226d:** od obwieszczenia do prawomocnego umorzenia lub zakończenia nadzorca układu ma **uprawnienia nadzorcy sądowego** (art. 36 ust. 2–3, 37 ust. 1, **39 ust. 1**), bez art. 42–50 i 224.
- **Art. 226e:** w tym okresie odpowiednio **art. 256** (zakaz wypowiedzenia najmu i umów kluczowych bez zezwolenia rady) i **art. 312** (zawieszenie i zakaz egzekucji do majątku, wyjątki alimentacyjne, wstrzymanie przedawnienia).
- **Art. 226f:** sąd na wniosek wierzyciela, dłużnika lub nadzorcy **uchyla skutki obwieszczenia**, gdy prowadzą do **pokrzywdzenia wierzycieli** lub ujawniono przeszkody z 226a ust. 2; możliwe przesłuchanie; zażalenie; obwieszczenie prawomocnego uchylenia.
- **Art. 226g:** brak wniosku o zatwierdzenie w **4 miesiące** od obwieszczenia → skutki **wygasają z mocy prawa** (równolegle umorzenie z art. 218a ust. 2).
- **Art. 226h:** w terminie na **zażalenie na odmowę zatwierdzenia** albo w **7 dni od umorzenia** — **uproszczony wniosek sanacyjny** (art. 328) albo **upadłościowy** (art. 334).
- **Art. 226i:** dla art. **131a PrUp** dzień złożenia wniosku o upadłość i dzień zakończenia restrukturyzacji obejmują odpowiednio **dzień obwieszczenia** i **dzień umorzenia** z art. 218a.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| ≤ 15% | sporne uprawniające do głosu — warunek PZU | art. 3 ust. 2; 218 ust. 1 |
| ≤ 4 mies. przed wnioskiem; ≤ dzień obwieszczenia | położenie dnia układowego | art. 211 ust. 2–2a |
| 4 h w godz. 8–20 | biuro nadzorcy — akta | art. 211a ust. 3 |
| ≥ 30 dni przed głosowaniem; 2 tyg. + 2 tyg. | dokumenty; zastrzeżenia i odpowiedź | art. 211b |
| 4 mies. od oddania głosu | ważność głosu | art. 215 |
| ≤ 3 mies. przed wnioskiem PU/sanacja | przeniesienie głosów | art. 218 ust. 2 |
| 4 mies. od obwieszczenia | umorzenie z mocy prawa; wygaśnięcie ochrony | art. 218a ust. 2; 226g |
| ≥ 3 tyg. przed wnioskiem | wysłanie informacji / zawiadomień niegłosującym | art. 219 ust. 2 pkt 2 |
| 30 dni przed wnioskiem | dzień bilansu w sprawozdaniu | art. 220 pkt 7 |
| tydzień / 2 tygodnie | uzupełnienie sprawozdania; nowy nadzorca | art. 221 ust. 2–3 |
| 2 tygodnie | rozpoznanie wniosku o zatwierdzenie | art. 223 ust. 1 |
| 30 dni od obwieszczenia | zażalenie wierzyciela zagranicznego co do jurysdykcji | art. 223 ust. 4 |
| 10 lat | przeszkoda do obwieszczenia | art. 226a ust. 2 |
| tydzień / 3 dni / tydzień | skarga na odmowę; przekazanie; rozpoznanie | art. 226b |
| 7 dni od umorzenia | uproszczony wniosek sanacyjny / upadłościowy | art. 226h |

## PUŁAPKI

- Ochrona (egzekucje, umowy) powstaje dopiero z **obwieszczeniem** (226e), nie z umową z nadzorcą ani z ustaleniem dnia układowego.
- Obwieszczenie wymaga uprzedniego spisu, spisu spornego i wstępnego planu (226a ust. 1) oraz braku przeszkód 10-letnich.
- Brak wniosku w 4 miesiące od obwieszczenia = umorzenie z mocy prawa i wygaśnięcie ochrony (218a ust. 2, 226g) — monitoruj termin.
- Wierzytelności powstałe po dniu układowym nie są objęte układem (211 ust. 4) — dzień układowy ustal świadomie.
- Głos traci ważność, jeżeli wniosek wpłynie po 4 miesiącach od jego oddania (215).
- Karta niekompletna = nieważna (213 ust. 3) — waliduj 12 elementów przed liczeniem większości.
- W PZU wierzytelności nabyte po otwarciu nie są wyłączone z głosu (art. 109 ust. 3).
- W PZU nie ma zabezpieczenia sądowego (226) — ochronę daje tylko obwieszczenie.
- Braki sprawozdania obciążają nadzorcę, ale skutek (zwrot wniosku) ponosi dłużnik, jeśli nie zmieni nadzorcy w 2 tygodnie (221 ust. 3).
- Plan B: termin 7 dni od umorzenia na uproszczony wniosek (226h) — przygotuj dokumenty z wyprzedzeniem.

## POWIĄZANIA

- Tryby i próg 15% (art. 3), test zaspokojenia, plan (art. 10, 10a) → `mod-PrRestr-wejscie-plan-test`
- Nadzorca układu: umowa, wynagrodzenie, OC (art. 24, 35–37), art. 39 → `mod-PrRestr-dzial-III-nadzorca-zarzadca`
- Spis, głosowanie, wyłączenia głosu (art. 107–119), art. 109 ust. 3 → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`
- Art. 250–251, 256, 259–260, PPU/PU → `mod-PrRestr-ppu-pu`; art. 312 → `mod-PrRestr-sanacja`
- Pomoc publiczna (art. 140, 204) → `mod-PrRestr-dzial-V-pomoc-publiczna`
- Zatwierdzenie układu (art. 164–165a), art. 151 ust. 2, wykonanie → `mod-PrRestr-dzial-VI-uklad`
- Uproszczone wnioski (art. 328, 334), akta i art. 196b → `mod-PrRestr-procedura-zakonczenie`
- Art. 131a PrUp → `mod-PrUpad-skutki-masa-bezskutecznosc`

## WYNIK

Umowa z nadzorcą (210) → dzień układowy (211) i akta (211a) → spisy i wstępny plan → ewentualne obwieszczenie z kontrolą 10-letnich przeszkód (226a–226c) i ochroną (226d–226e) → dokumenty 30 dni przed głosowaniem (211b) → głosowanie w systemie / zgromadzenie z kartami (212–213) → stwierdzenie przyjęcia (217) → wniosek ≤ 4 mies. od obwieszczenia i ≤ 4 mies. od głosów (215, 218a, 219) ze sprawozdaniem (220) → postanowienie w 2 tyg. (223) → nadzorca z uprawnieniami nadzorcy sądowego do prawomocności (224) → przy porażce — wniosek uproszczony w 7 dni (226h).
