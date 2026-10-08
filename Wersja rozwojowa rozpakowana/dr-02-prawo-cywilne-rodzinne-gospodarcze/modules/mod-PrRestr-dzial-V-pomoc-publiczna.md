# Restrukturyzacja — pomoc publiczna: test prywatnego wierzyciela / inwestora, warunki pomocy na restrukturyzację, notyfikacja (PrRestr art. 140–149)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 35–40
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak. Wprowadzenie do wyliczenia art. 140 ust. 1 w brzmieniu DU/2025/1085 — ujęte w t.j.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 141 --verify-online`. Akty UE, do których odsyła dział (rozp. KE 651/2014 — definicje MŚP i grupy; rozp. Rady 659/1999 — decyzje KE), oraz aktualne wytyczne KE odczytaj z EUR-Lex przed zastosowaniem; kurs EUR — średni kurs NBP z dnia złożenia planu (148), nie z pamięci.

---

## FAZA 0 — INTAKE

```
□ Czy w postępowaniu wierzyciel publiczny / państwo daje wsparcie (redukcja, raty, odroczenie, zawieszenie egzekucji, pożyczka, kredyt, poręczenie, gwarancja)? → test z art. 140
□ Test prywatnego wierzyciela (wierzyciel publicznoprawny) albo prywatnego inwestora (podmiot finansujący); ocena de minimis (140 ust. 1 pkt 2)
□ Jeżeli pomoc publiczna — wyłącznie pomoc na restrukturyzację; przesłanki podmiotowe: ≥ 3 lata w sektorze, sektory wyłączone, nadprodukcja, grupa kapitałowa (141 ust. 1)
□ Przedsiębiorca zagrożony niewypłacalnością: utrata > ½ kapitału; duży — dług/kapitał > 7,5 i EBITDA/odsetki < 1 przez 2 lata (141 ust. 2)
□ Zasada „pierwszy i ostatni raz”: 10 lat od poprzedniej pomocy na ratowanie / restrukturyzację (143)
□ Wkład własny: mały 25%, średni 40%, duży 50% kosztów restrukturyzacji (144)
□ Środki wyrównujące (strukturalne, behawioralne, otwarcia rynku) — nie dotyczy małego przedsiębiorcy (145)
□ Notyfikacja KE: zwolnienie dla MŚP przy łącznej pomocy ≤ 10 mln EUR i spełnieniu art. 141–147 (148)
□ Plan restrukturyzacyjny: nie może ograniczać się do restrukturyzacji zobowiązań (142 ust. 3)
□ Procedura w postępowaniu: opinia organu w 2 tyg. (204), dokumenty przy zgromadzeniu (118 ust. 4), zatwierdzenie (165 ust. 1)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 140 | test prywatnego wierzyciela / inwestora, ocena de minimis | A |
| 141 | przesłanki podmiotowe i finansowe pomocy na restrukturyzację, grupa, MŚP | B |
| 142 | cel, trudności społeczne / niedoskonałości rynku, zakaz planu ograniczonego do zobowiązań | B |
| 143 | zasada jednorazowości (10 lat), wyjątki, grupy, nabywcy aktywów | B |
| 144 | wkład własny | C |
| 145 | środki wyrównujące zakłócenia konkurencji | C |
| 146–147 | usługi w ogólnym interesie gospodarczym, zmiana pomocy | C |
| 148–149 | zwolnienie z notyfikacji, okres udzielania pomocy | D |
| uchylone | 139a (oraz 141 ust. 2 pkt 2) | — |

---

## A. Test prywatnego wierzyciela / inwestora (art. 140)

- **Art. 140 ust. 1:** gdy w postępowaniu może dojść do **wsparcia przez państwo lub z zasobów państwowych** — w szczególności zmniejszenie zobowiązań w układzie, raty, odroczenie, zawieszenie egzekucji (z mocy prawa lub postanowieniem), pożyczki, kredyty, poręczenia, gwarancje — **nadzorca albo zarządca** sporządza: **test prywatnego wierzyciela lub inwestora** — czy wsparcie w postępowaniu i wykonaniu układu jest **pomocą publiczną** (pkt 1), oraz **ocenę de minimis** (także w rolnictwie i rybołówstwie) na podstawie informacji ubiegającego się, z uzasadnieniem (pkt 2).
- **ust. 2 — test prywatnego wierzyciela:** czy wierzyciel publiczny zachowuje się jak **prywatny wierzyciel w normalnych warunkach rynkowych** — czy prywatny wierzyciel zaakceptowałby warunki spłaty z propozycji.
- **ust. 3 — treść:** (1) przewidywany stopień zaspokojenia **każdego wierzyciela publicznoprawnego w układzie** — kwota objęta układem, propozycje wobec niego; (2) stopień zaspokojenia **w upadłości** — wartość majątku z obciążeniami, koszty upadłości, **kategoria** zaspokojenia; (3) ocena, gdzie zaspokojenie będzie **większe**.
- **ust. 4 — test prywatnego inwestora:** czy wsparcie podmiotu finansującego nie jest pomocą publiczną — **nie jest**, gdy warunki byłyby akceptowalne dla **inwestora prywatnego**.
- **ust. 5 — treść:** przewidywany i średni **zwrot z kapitału** porównywalnych inwestycji oraz przewidywane i średnie **ryzyko**.

## B. Przesłanki pomocy na restrukturyzację (art. 141–143)

- **Art. 141:** jeżeli wsparcie jest pomocą publiczną — może to być **wyłącznie pomoc na restrukturyzację**, gdy przedsiębiorca: działa w sektorze **≥ 3 lata** przed wnioskiem (pkt 1); **nie działa** w hutnictwie żelaza i stali, górnictwie węgla, sektorze finansowym (pkt 2); nie działa na rynku z **długookresową strukturalną nadprodukcją** (pkt 3); nie należy do **grupy kapitałowej** ani nie jest przez nią przejmowany — chyba że wykaże, że trudności są **wewnętrzne** (nie z podziału kosztów w grupie) i **zbyt poważne** dla grupy (pkt 4) (ust. 1). Przedsiębiorca **zagrożony niewypłacalnością** — pomoc, gdy: **utrata > połowy kapitału** (ujemna suma zysków/strat i kapitałów rezerwowych > 50% kapitału podstawowego) (pkt 1); duży przedsiębiorca — przez **2 lata**: dług / kapitał własny **> 7,5** i (zysk operacyjny + amortyzacja) / odsetki **< 1** (pkt 3) (ust. 2; pkt 2 uchylony). **Grupa kapitałowa** = przedsiębiorstwa partnerskie i powiązane z art. 3 ust. 2–3 zał. I rozp. KE **651/2014** (ust. 3); **MŚP** — według zał. I tego rozporządzenia, bez art. 3 ust. 4 (ust. 4); warunek utraty kapitału — według **zatwierdzonych sprawozdań** (lub innych wiarygodnych dokumentów) (ust. 5).
- **Art. 142:** pomoc dopuszczalna (ust. 1): dla planu przywracającego **długookresową zdolność do konkurowania** (pokrycie kosztów, w tym amortyzacji i finansowych) (pkt 1); gdy sposób restrukturyzacji usuwa **przyczyny** trudności (pkt 2); gdy zapobiega **trudnościom społecznym** lub **niedoskonałościom rynku**, a bez pomocy cel nie zostałby osiągnięty (pkt 3); z **wiarygodnym scenariuszem alternatywnym** bez pomocy (pkt 4); gdy bez pomocy przedsiębiorca zostałby zrestrukturyzowany, sprzedany lub zlikwidowany z gorszym skutkiem dla celu (pkt 5). **Trudności społeczne / niedoskonałości rynku** (ust. 2): u **MŚP** — wyjście z rynku przedsiębiorcy innowacyjnego / o dużym potencjale, o silnych lokalnych powiązaniach, ograniczenia rynków finansowych; u **innych** — bezrobocie wyższe od średniej UE lub krajowej w regionie NTS 2, przerwanie usługi w ogólnym interesie gospodarczym lub innej ważnej usługi, wyjście z rynku istotnego przedsiębiorcy, ograniczenia rynków finansowych, utrata wiedzy technicznej. **Zakaz pomocy** (ust. 3), gdy plan: ogranicza się **wyłącznie do restrukturyzacji zobowiązań** (pkt 1) lub przewiduje **nowe inwestycje** niekonieczne do przywrócenia zdolności konkurowania (pkt 2).
- **Art. 143:** pomoc tylko, gdy przedsiębiorca **nie otrzymał** wcześniej pomocy na ratowanie, tymczasowej pomocy na restrukturyzację lub pomocy na restrukturyzację, albo minęło **10 lat** od najpóźniejszego z: przyznania, zakończenia lub zaprzestania realizacji poprzedniego planu (ust. 1). Przed upływem 10 lat od pomocy na **ratowanie / tymczasowej** — gdy w ramach **tego samego procesu**, gdy minęło **5 lat** bez pomocy na restrukturyzację, przy zdolności konkurowania i **nieprzewidywalnych okolicznościach** bez winy, albo gdy konieczna z powodu takich okoliczności (ust. 2). **Grupa kapitałowa** — 10 lat liczone dla każdego członka grupy (ust. 3), chyba że pomoc nie zostanie przekazana członkowi, który ją otrzymał (ust. 4). **Nabywca aktywów** od beneficjenta pomocy — 10 lat (ust. 5), wcześniej tylko przy **braku kontynuacji** działalności zbywcy (ust. 6): samodzielność stron (zał. I rozp. 651/2014), **wartość godziwa**, brak pozorności zbycia (ust. 7).

## C. Warunki pomocy (art. 144–147)

- **Art. 144:** pomoc jedynie **uzupełnia** środki: własne (bez amortyzacji i planowanych zysków), wspólników / grupy, wierzycieli — w zakresie niezbędnym do celu z 142 ust. 1 pkt 1 (ust. 1). **Wkład własny** w kosztach restrukturyzacji: **≥ 25%** (mały), **≥ 40%** (średni), **≥ 50%** (inny) (ust. 2); w wyjątkowych okolicznościach niższy, ale **znaczny** (ust. 3); środki **realne**, niebędące pomocą publiczną, porównywalne z pomocą co do wpływu na wypłacalność / płynność (ust. 3a); rekompensata za **UOIG** nie wlicza się (ust. 4); **koszty restrukturyzacji** — środki z planu oraz poniesione przed otwarciem w tym samym procesie (ust. 5).
- **Art. 145:** pomoc wymaga **środków wyrównujących zakłócenia konkurencji** (ust. 1): **strukturalnych** (zbycie aktywów / ZCP, ograniczenie mocy produkcyjnych, udziału w rynku), **behawioralnych** (zakaz nabywania udziałów poza niezbędnymi, zakaz reklamy przewagi z pomocy, zakaz zdobywania nowych rynków), **otwarcia rynku** (ułatwienie wejścia konkurentom) (ust. 2–5); nie są nimi likwidacja / ograniczenie działalności przynoszącej straty (ust. 6); rodzaj i zakres zależą od wielkości i formy pomocy (bez pomocy na koszty restrukturyzacji zatrudnienia), wkładów własnych i wierzycieli (w tym zabezpieczonych), wielkości i udziału w rynku, UOIG, charakterystyki rynku i wpływu na rynek wewnętrzny (ust. 7); **środki behawioralne zawsze** (ust. 7a); nie mogą zagrażać rentowności, strukturze rynku ani konsumentom (ust. 8); strukturalne — bez zwłoki na rynku przyszłej znaczącej pozycji (ust. 9); zakaz zdobywania nowych rynków — tylko gdy pomoc daje warunki nieosiągalne dla innych i brak innych środków (ust. 10); **mały przedsiębiorca** — ust. 1–10 nie stosuje się, ale **zakaz zwiększania mocy produkcyjnych** w trakcie planu (ust. 11).
- **Art. 146:** przedsiębiorca świadczący **usługi w ogólnym interesie gospodarczym** — pomoc mimo niespełnienia art. 141–145, gdy niezbędna do **ciągłości** usług, najdłużej do przekazania obowiązku następcy.
- **Art. 147:** **zwiększenie pomocy** — tylko z rozszerzeniem środków strukturalnych / behawioralnych (ust. 1); ograniczenie lub opóźnienie tych środków z przyczyn niezależnych — tylko ze **zmniejszeniem pomocy** (ust. 2); zwiększenie kosztów restrukturyzacji — tylko ze zwiększeniem **wkładu własnego** (ust. 3).

## D. Notyfikacja i okres udzielania (art. 148–149)

- **Art. 148:** pomoc **nie podlega notyfikacji KE**, gdy łącznie: zgodna z art. 141–147 (pkt 1), beneficjent to **MŚP** (pkt 2), łączna pomoc na restrukturyzację z pomocą na ratowanie / tymczasową w tym samym procesie **≤ 10 000 000 EUR** według średniego kursu NBP z **dnia złożenia planu** (pkt 3) (ust. 1); powyżej progu — MŚP traktuje się jak **dużego przedsiębiorcę** (ust. 2); zmiany z art. 147 u MŚP — bez notyfikacji (ust. 3).
- **Art. 149:** pomoc nienotyfikowana — w okresie wskazanym w **decyzji KE** wydanej na podstawie art. 4 ust. 3 albo art. 7 ust. 3–4 **rozp. Rady 659/1999** (ustal aktualność decyzji i podstawy unijnej przed zastosowaniem).
- **Art. 139a:** uchylony.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| ≥ 3 lata | działalność w sektorze | art. 141 ust. 1 pkt 1 |
| > 50% kapitału | utrata kapitału — zagrożenie niewypłacalnością | art. 141 ust. 2 pkt 1 |
| > 7,5 i < 1 przez 2 lata | wskaźniki dużego przedsiębiorcy | art. 141 ust. 2 pkt 3 |
| 10 lat / 5 lat | zasada jednorazowości i wyjątek | art. 143 |
| 25% / 40% / 50% | minimalny wkład własny: mały / średni / inny | art. 144 ust. 2 |
| ≤ 10 mln EUR (kurs NBP z dnia planu) | zwolnienie MŚP z notyfikacji | art. 148 |
| 2 tygodnie / tydzień | opinia organu; zmienione propozycje | art. 204 (procedura) |

## PUŁAPKI

- Test prywatnego wierzyciela (art. 140) ≠ test zaspokojenia (art. 10a) — pierwszy ocenia pomoc publiczną, drugi interes wierzycieli.
- Restrukturyzacja będąca pomocą publiczną może przybrać tylko formy z art. 156 ust. 3; ZUS — wyłącznie raty / odroczenie (art. 160).
- Plan ograniczony do restrukturyzacji długów wyklucza pomoc (142 ust. 3 pkt 1).
- Grupa kapitałowa wymaga wykazania wewnętrznego charakteru trudności (141 ust. 1 pkt 4) i liczenia 10 lat dla całej grupy (143 ust. 3).
- Wkład własny musi być realny i nie może być pomocą publiczną (144 ust. 3a) — deklaracja inwestora bez zabezpieczenia nie wystarcza.
- MŚP powyżej 10 mln EUR łącznej pomocy — reżim dużego przedsiębiorcy i notyfikacja (148 ust. 2).
- Środki behawioralne stosuje się zawsze (145 ust. 7a), poza małym przedsiębiorcą (145 ust. 11).
- Pomoc objęta decyzją KE o zwrocie nie może być restrukturyzowana (art. 156 ust. 4); układ niezgodny z prawem pomocy — odmowa zatwierdzenia (art. 165 ust. 1).

## POWIĄZANIA

- Test zaspokojenia, plan (art. 9–10a) → `mod-PrRestr-wejscie-plan-test`
- Formy restrukturyzacji, ZUS / FGŚP (art. 156, 160), zatwierdzenie (art. 165) → `mod-PrRestr-dzial-VI-uklad`
- Dokumenty przy zgromadzeniu (art. 118 ust. 4) → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`
- Opinia organu i zmienione propozycje (art. 204–205) → `mod-PrRestr-procedura-zakonczenie`
- Testy w PPU/PU, sanacji, PZU (art. 261, 280, 320, 211b, 214, 319) → `mod-PrRestr-ppu-pu`, `mod-PrRestr-sanacja`, `mod-PrRestr-pzu`
- Pomoc na ratowanie i restrukturyzację poza PrRestr → `mod-ustawa-pomoc-ratowanie-restrukturyzacja-przedsiebiorcow`

## WYNIK

Identyfikacja wsparcia publicznego (140 ust. 1) → test prywatnego wierzyciela / inwestora i ocena de minimis (140) → jeżeli pomoc: przesłanki podmiotowe i finansowe (141), cel i scenariusz alternatywny (142), jednorazowość (143), wkład własny (144), środki wyrównujące (145), wyjątki UOIG (146), zmiany (147) → notyfikacja albo zwolnienie MŚP ≤ 10 mln EUR (148) i okres z decyzji KE (149) → wpływ na treść propozycji, procedurę opinii organu i zatwierdzenie układu.
