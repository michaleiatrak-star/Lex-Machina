# Restrukturyzacja — zakres, tryby, przesłanki, plan, test zaspokojenia, zbieg z upadłością, sąd i sędzia-komisarz (PrRestr art. 1–22)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 3–9
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** [DU/2026/1206](https://api.sejm.gov.pl/eli/acts/DU/2026/1206/text.pdf) art. 24 — **art. 4 ust. 2 pkt 4** (oddziały banków zagranicznych) w nowym brzmieniu **od 11.01.2027** (art. 57 nowelizacji); do tej daty stosuj brzmienie t.j. → `references/insolvency/wersje-i-przepisy-przejsciowe.md`. Rozdział 3 (art. 10 ust. 1 pkt 4, 8a, ust. 2a, art. 10a) w brzmieniu nowelizacji DU/2025/1085 (od 23.08.2025) — ujęte w t.j.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 10a --verify-online`. Niewypłacalność (art. 6 ust. 2) definiuje **Prawo upadłościowe** (art. 11 PrUp → `mod-PrUpad-wniosek-ogloszenie`). Ustawa wdraża dyrektywę (UE) 2019/1023 (odnośnik do tytułu ustawy) — wykładnia prounijna przy wątpliwościach.

---

## FAZA 0 — INTAKE

```
□ Podmiot (art. 4 ust. 1): przedsiębiorca KC / sp. z o.o., PSA, SA bez działalności / wspólnik osobowej spółki handlowej z odpowiedzialnością nieograniczoną / wspólnik spółki partnerskiej
□ Wyłączenia (art. 4 ust. 2): SP i JST, banki krajowe, BGK, oddziały banków zagranicznych (zmiana od 11.01.2027), SKOK, domy maklerskie, zakłady ubezpieczeń i reasekuracji, fundusze inwestycyjne, instytucje finansowe i holdingi z rozp. 575/2013 / 2019/2033
□ Stan: niewypłacalność (PrUp art. 11) czy zagrożenie niewypłacalnością — „w niedługim czasie może stać się niewypłacalny” (art. 6)
□ Ryzyko pokrzywdzenia wierzycieli (art. 8 ust. 1); w PU i sanacji — uprawdopodobnienie bieżącego pokrywania kosztów i zobowiązań po otwarciu (art. 8 ust. 2)
□ Wybór trybu (art. 3): sporne uprawniające do głosu ≤ 15% → PZU lub PPU; > 15% → PU; potrzeba działań sanacyjnych → sanacja (bez progu 15%)
□ Status MŚP na dzień wniosku (art. 10 ust. 2a) — mikroprzedsiębiorca: bez testu zaspokojenia (10a ust. 4)
□ Wstępny plan + sprawozdanie finansowe na dzień w 30 dniach przed wnioskiem (art. 9)
□ Wniosek o upadłość już złożony? → pierwszeństwo restrukturyzacji, wstrzymanie, ewentualne przejęcie do łącznego rozpoznania (art. 11–13)
□ COMI i sąd właściwy (art. 15); elementy transgraniczne → rozp. 2015/848
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 1–5a | przedmiot ustawy, katalog postępowań, cele i progi trybów, zakres podmiotowy i wyłączenia, Rejestr | A |
| 6–8 | podstawy otwarcia: niewypłacalność i zagrożenie, wniosek restrukturyzacyjny, odmowa otwarcia | B |
| 9–10a | wstępny plan, plan restrukturyzacyjny, test zaspokojenia | C |
| 11–13 | zbieg wniosku restrukturyzacyjnego i upadłościowego | D |
| 14–17 | sąd restrukturyzacyjny: skład, właściwość (COMI), przekazanie, kilka sądów | E |
| 18–22 | sędzia-komisarz: funkcja, nadzór, zastępca, wyznaczony sędzia, pomoc organów | E |
| uchylone | 5 (oraz 10 ust. 3) | — |

---

## A. Zakres i tryby (art. 1–5a)

- **Art. 1:** ustawa reguluje zawieranie przez dłużnika **niewypłacalnego lub zagrożonego niewypłacalnością** układu z wierzycielami i jego skutki (pkt 1) oraz **działania sanacyjne** (pkt 2).
- **Art. 2:** cztery postępowania: **o zatwierdzenie układu** (pkt 1), **przyspieszone układowe** (pkt 2), **układowe** (pkt 3), **sanacyjne** (pkt 4).
- **Art. 3:** cel — **uniknięcie upadłości** przez układ, a w sanacji także działania sanacyjne, przy zabezpieczeniu słusznych praw wierzycieli (ust. 1). **PZU**: samodzielne zbieranie głosów bez udziału sądu; sporne uprawniające do głosu **≤ 15%** sumy uprawniających (ust. 2). **PPU**: układ po spisie w trybie uproszczonym; **≤ 15%** (ust. 3). **PU**: układ po spisie i jego zatwierdzeniu; **> 15%** (ust. 4). **Sanacja**: działania sanacyjne i układ po spisie (ust. 5) — bez progu. **Działania sanacyjne** = czynności prawne i faktyczne zmierzające do poprawy sytuacji i przywrócenia zdolności do wykonywania zobowiązań, przy **ochronie przed egzekucją** (ust. 6).
- **Art. 4:** ustawę stosuje się do: **przedsiębiorców w rozumieniu KC** (pkt 1), **sp. z o.o., PSA i SA nieprowadzących działalności** (pkt 2), **wspólników osobowych spółek handlowych** odpowiadających całym majątkiem (pkt 3), **wspólników spółki partnerskiej** (pkt 4) (ust. 1). **Nie stosuje się** do: SP i JST (pkt 1), banków krajowych (pkt 2), BGK (pkt 3), **oddziałów banków zagranicznych** (pkt 4 — **nowe brzmienie od 11.01.2027**), SKOK (pkt 5), domów maklerskich z art. 95 ustawy o obrocie instrumentami finansowymi (pkt 6), zakładów ubezpieczeń i reasekuracji (pkt 7), funduszy inwestycyjnych (pkt 8), instytucji finansowych zależnych objętych nadzorem skonsolidowanym (rozp. 575/2013, 2019/2033) (pkt 9–9a), finansowych i inwestycyjnych spółek holdingowych, holdingów mieszanych i dominujących spółek holdingowych UE (pkt 10–16) (ust. 2).
- **Art. 5:** uchylony.
- **Art. 5a:** „Rejestr” = **Krajowy Rejestr Zadłużonych**.

## B. Podstawy otwarcia (art. 6–8)

- **Art. 6:** postępowanie wobec dłużnika **niewypłacalnego** lub **zagrożonego niewypłacalnością** (ust. 1); niewypłacalność — **jak w PrUp** (ust. 2); zagrożenie — sytuacja ekonomiczna wskazuje, że **w niedługim czasie może stać się niewypłacalny** (ust. 3).
- **Art. 7:** wszczęcie na **wniosek restrukturyzacyjny dłużnika**, o ile ustawa nie stanowi inaczej (np. art. 283 — sanacja na wniosek kuratora lub wierzyciela osoby prawnej) (ust. 1); wniosek restrukturyzacyjny = wniosek o **otwarcie** postępowania albo o **zatwierdzenie układu** w PZU (ust. 2); **obwieszczenia**: zarządzenie o wpisaniu wniosku dłużnika do repertorium, prawomocny zwrot, odrzucenie, oddalenie, umorzenie (ust. 3) — wpis do repertorium uruchamia m.in. ochronę z art. 256 ust. 1.
- **Art. 8:** sąd **odmawia otwarcia**, gdy skutkiem byłoby **pokrzywdzenie wierzycieli** (ust. 1); w **PU i sanacji** także, gdy nie uprawdopodobniono **zdolności do bieżącego zaspokajania kosztów postępowania i zobowiązań po otwarciu** (ust. 2).

## C. Plan i test zaspokojenia (art. 9–10a)

- **Art. 9 — wstępny plan:** analiza **przyczyn** trudnej sytuacji (pkt 1), wstępny opis **środków** i kosztów (pkt 2), wstępny **harmonogram** (pkt 3) (ust. 1); **sprawozdanie finansowe** na dzień w okresie **30 dni** przed wnioskiem (ust. 2) albo przyczyny jego niezałączenia (ust. 3).
- **Art. 10 — plan restrukturyzacyjny** (ust. 1): opis przedsiębiorstwa i rynku (podaż/popyt) (pkt 1), przyczyny (pkt 2), strategia i **ryzyko** (pkt 3), pełny opis środków i kosztów, w tym **skutki dla zatrudnienia** (zwolnienia, zmniejszony wymiar) i **informowanie/konsultacje z przedstawicielami pracowników** (pkt 4), harmonogram i **ostateczny termin wdrożenia** (pkt 5), zdolności produkcyjne (pkt 6), **metody i źródła finansowania** — kapitał, sprzedaż aktywów, zobowiązania udziałowców i osób trzecich, pomoc publiczna i de minimis (pkt 7), **prognozy zysków i strat na 5 lat** w co najmniej **2 wariantach** (pkt 8), **zestawienie aktywów i pasywów** z wartością aktywów oraz sytuacja ekonomiczna i pracowników (pkt 8a), osoby odpowiedzialne za wykonanie układu (pkt 9), autorzy (pkt 10), data (pkt 11). Plan **ograniczony** — gdy z uwagi na wielkość/charakter przedsiębiorstwa pełne dane są niemożliwe lub zbędne; wymaga **uzasadnienia** (ust. 2). Opis zawiera status **mikro / małego / średniego** przedsiębiorcy na dzień wniosku (ust. 2a). W szczególnie uzasadnionych przypadkach, za zgodą sędziego-komisarza, nadzorca/zarządca może **zlecić plan osobom trzecim** (ust. 4; działa na rachunek dłużnika — art. 34b); ust. 3 uchylony.
- **Art. 10a — test zaspokojenia** sporządza **nadzorca albo zarządca** (ust. 1):
  - pkt 1 — **wycena** z metodami i założeniami: (a) wartość przedsiębiorstwa przy **realizacji planu i kontynuacji**, (b) wartość majątku przy **upadłości** — sprzedaż **całości** oraz sprzedaż **poszczególnych składników**, z odrębnym wskazaniem obciążeń pozostających w mocy po sprzedaży upadłościowej i ich wartości;
  - pkt 2 — przewidywany **stopień zaspokojenia** wierzycieli objętych układem w upadłości: wartość majątku, **czas trwania**, **koszty** i inne zobowiązania masy, **kategoria** zaspokojenia grup;
  - pkt 3 — ocena, czy wierzytelności objęte układem będą zaspokojone **w wyższym stopniu w układzie** niż w upadłości.
  - Dłużnik bez zdolności upadłościowej — porównanie z **egzekucją** (ust. 2); wycenę można **zlecić osobom trzecim** (nadzorca — za zgodą dłużnika), z uwzględnieniem wskazań uczestników (ust. 3); **mikroprzedsiębiorca — testu nie sporządza się** (ust. 4).

## D. Zbieg z upadłością (art. 11–13)

- **Art. 11:** przy wniosku restrukturyzacyjnym i upadłościowym **najpierw rozpoznaje się restrukturyzacyjny**.
- **Art. 12:** sąd restrukturyzacyjny **zawiadamia** sąd upadłościowy o wniosku restrukturyzacyjnym (ust. 1); sąd upadłościowy **wstrzymuje** rozpoznanie wniosku o upadłość do prawomocnego orzeczenia w sprawie restrukturyzacji — bez wyłączenia **zabezpieczenia majątku** (ust. 2); gdy wstrzymanie sprzeciwia się **interesowi ogółu wierzycieli** — **przejęcie** wniosku restrukturyzacyjnego do **łącznego rozpoznania** w składzie upadłościowym i jedno postanowienie (ust. 3); jeżeli przejęcie znacznie opóźniłoby orzeczenie ze szkodą dla wierzycieli, a podstawy restrukturyzacji są znane — sąd upadłościowy rozpoznaje sam wniosek o upadłość i zawiadamia sąd restrukturyzacyjny (ust. 4).
- **Art. 13:** po **ogłoszeniu upadłości** sąd restrukturyzacyjny wstrzymuje rozpoznanie do jego uprawomocnienia; po uprawomocnieniu — **odmawia** zatwierdzenia układu (PZU) albo otwarcia; po uchyleniu i przekazaniu — art. 11 i 12 ust. 2–4 odpowiednio.

## E. Sąd i sędzia-komisarz (art. 14–22)

- **Art. 14:** sąd restrukturyzacyjny = **sąd rejonowy — sąd gospodarczy** (ust. 1); skład **jednoosobowy**; **trzech sędziów zawodowych** przy zażaleniach na postanowienia sędziego-komisarza i przy wynagrodzeniu nadzorcy/zarządcy w PU i sanacji (ust. 2); sędzia-komisarz i zastępca nie wchodzą w skład sądu po otwarciu (ust. 3); po uchyleniu jego postanowienia i przekazaniu — **wyłączenie** sędziego-komisarza, także przy ponownym uchyleniu; rozpoznaje zastępca lub wyznaczony sędzia (ust. 4).
- **Art. 15:** właściwość według **głównego ośrodka podstawowej działalności (COMI)** (ust. 1) — miejsce regularnego zarządzania działalnością ekonomiczną **rozpoznawalne dla osób trzecich** (ust. 2); domniemania: osoba prawna — **siedziba** (ust. 3); osoba fizyczna przedsiębiorca — **główne miejsce działalności** (ust. 4); osoba fizyczna bez działalności — **miejsce zwykłego pobytu** (ust. 5); brak COMI w PL — sąd zwykłego pobytu/siedziby, a w braku — **położenia majątku** (ust. 6).
- **Art. 16:** **przekazanie** sprawy sądowi właściwemu w PZU lub przed otwarciem — bez zażalenia, wiążące, czynności pozostają w mocy (ust. 1); **po otwarciu przekazanie niedopuszczalne** (ust. 2).
- **Art. 17:** otwarcie w kilku sądach — prowadzi sąd, który **pierwszy** wydał postanowienie o otwarciu.
- **Art. 18:** po otwarciu czynności sądowe wykonuje **sędzia-komisarz**, poza zastrzeżonymi dla sądu (ust. 1); funkcja do zakończenia / prawomocnego umorzenia (ust. 2); przy uproszczonym wniosku sanacyjnym lub upadłościowym — do otwarcia sanacji / ogłoszenia upadłości albo prawomocnego oddalenia, odrzucenia, umorzenia (ust. 3); czynności po zakończeniu — **sąd** (ust. 4).
- **Art. 19:** sędzia-komisarz **kieruje tokiem**, **nadzoruje** nadzorcę sądowego i zarządcę, oznacza czynności wymagające jego zezwolenia lub zezwolenia rady, zwraca uwagę na uchybienia (ust. 1); kontakt bezpośredni i zdalny (telefon, faks, e-mail) (ust. 2).
- **Art. 20:** sędzia-komisarz ma **prawa i obowiązki sądu i przewodniczącego**.
- **Art. 21:** **zastępca** sędziego-komisarza w uzasadnionych przypadkach (ust. 1) — działa, gdy ustawa stanowi i przy przemijającej przeszkodzie (ust. 2); możliwość kilku zastępców (ust. 3); przepisy o sędzi-komisarzu odpowiednio (ust. 4); przy przeszkodzie obu — **wyznaczony sędzia** (ust. 5).
- **Art. 22:** **organy administracji i komornicy** udzielają pomocy sędziemu-komisarzowi.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| ≤ 15% / > 15% | sporne uprawniające do głosu: PZU, PPU / PU | art. 3 ust. 2–4 |
| 30 dni przed wnioskiem | dzień sprawozdania finansowego we wstępnym planie | art. 9 ust. 2 |
| 5 lat, ≥ 2 prognozy | projekcja zysków i strat w planie | art. 10 ust. 1 pkt 8 |
| mikroprzedsiębiorca | brak testu zaspokojenia | art. 10a ust. 4 |
| 3 sędziów | zażalenia na sędziego-komisarza; wynagrodzenie w PU i sanacji | art. 14 ust. 2 |
| 11.01.2027 | nowe brzmienie art. 4 ust. 2 pkt 4 | DU/2026/1206 art. 24, 57 |

## PUŁAPKI

- Sanacja nie zależy od progu 15% (art. 3 ust. 5) — próg dotyczy PZU, PPU i PU.
- Licz próg od wierzytelności **uprawniających do głosu**, nie od całego zadłużenia księgowego (art. 3).
- Spółki kapitałowe bez działalności mają zdolność restrukturyzacyjną (art. 4 ust. 1 pkt 2); podmioty finansowe z art. 4 ust. 2 — nie (dla nich PrUp tytuły szczególne).
- Zagrożenie niewypłacalnością wystarcza (art. 6), ale w PU i sanacji odmowa przy braku uprawdopodobnienia finansowania kosztów i zobowiązań bieżących (art. 8 ust. 2).
- Plan ograniczony wymaga uzasadnienia (10 ust. 2); plan z pkt 4 musi obejmować konsultacje z przedstawicielami pracowników.
- Test zaspokojenia (10a) ≠ test prywatnego wierzyciela/inwestora (art. 140); mikroprzedsiębiorca jest zwolniony tylko z pierwszego.
- Wycena upadłościowa musi obejmować oba scenariusze: przedsiębiorstwo jako całość i sprzedaż składników (10a ust. 1 pkt 1 lit. b).
- Wniosek restrukturyzacyjny wstrzymuje rozpoznanie upadłości, ale nie zabezpieczenie majątku (12 ust. 2); sąd upadłościowy może przejąć wniosek do łącznego rozpoznania (12 ust. 3).
- Po prawomocnym ogłoszeniu upadłości restrukturyzacja jest wykluczona (13).
- Po otwarciu nie ma przekazania sprawy innemu sądowi (16 ust. 2) — właściwość ustal przed wnioskiem.

## POWIĄZANIA

- Niewypłacalność (PrUp art. 11), zbieg w PrUp → `mod-PrUpad-wniosek-ogloszenie`
- Nadzorca, zarządca, art. 34b → `mod-PrRestr-dzial-III-nadzorca-zarzadca`
- PZU → `mod-PrRestr-pzu`; PPU/PU → `mod-PrRestr-ppu-pu`; sanacja (art. 283) → `mod-PrRestr-sanacja`
- Test prywatnego wierzyciela, pomoc publiczna (art. 140) → `mod-PrRestr-dzial-V-pomoc-publiczna`
- Zatwierdzenie układu, ochrona przed pokrzywdzeniem (art. 164–165a) → `mod-PrRestr-dzial-VI-uklad`
- Postępowania transgraniczne, rozp. 2015/848 → `mod-PrRestr-odrebne-miedzynarodowe`
- Wersje i nowelizacje → `mod-PrRestr-zrodla-i-wersje`, `references/insolvency/wersje-i-przepisy-przejsciowe.md`

## WYNIK

Zdolność restrukturyzacyjna (4) → stan finansowy (6) → wybór trybu z wyliczeniem progu 15% (3) → przeszkody i finansowanie (8) → wstępny plan z bilansem ≤ 30 dni (9) → plan pełny lub ograniczony z uzasadnieniem (10) → test zaspokojenia z dwoma scenariuszami upadłościowymi, chyba że mikroprzedsiębiorca (10a) → kontrola zbiegu z wnioskiem upadłościowym (11–13) → sąd właściwy według COMI (15) i organy postępowania (18–21).
