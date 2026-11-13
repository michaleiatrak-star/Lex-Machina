# mod-KSH-spolki-handlowe

**Akt:** KSH — t.j. Dz.U. 2024 poz. 18 (zm. 2024/96; 2026/176 od 18.02.2027; 2026/187 art. 138 od 19.05.2028).
**Inne akty:** KC (spółka cywilna, prokura) — t.j. Dz.U. 2026 poz. 795 | PrUp — t.j. Dz.U. 2026 poz. 913.
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1): `isap_tekst` albo `https://api.sejm.gov.pl/eli/acts/DU/2024/18/text.pdf`; zmiany po t.j. — ELI, „Akty zmieniające”.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-13.

Powiązane moduły: organy sp. z o.o. `mod-KSH-organy-spolki-zoo`; spółki osobowe i RN `mod-KSH-spolki-osobowe-rada-nadzorcza`; obrona przed przejęciem `mod-KSH-wrogie-przejecie-obrona-bialy-rycerz`; uzupełnienia `mod-KSH-uzupelnienie-pokrycia-2026`.

---

## FAZA 0 — INTAKE

```
□ Typ spółki: jawna / partnerska / komandytowa / S.K.A. / sp. z o.o. / PSA / S.A.?
□ Problem: założenie, zmiana umowy, reprezentacja, uchwała, odpowiedzialność zarządu (art. 299),
  łączenie / podział / przekształcenie?
□ Daty: uchwały, wiadomości o niej, ogłoszenia (spółka publiczna) — terminy art. 251, 252, 424, 425.
□ Niewypłacalność? → PrUp art. 11, 21; DR-02 moduły PrUpad / PrRestr.
□ Stan prawny na dzień zdarzenia: 2026/176 (akcje, od 18.02.2027), 2026/187 (art. 88, od 19.05.2028).
```

---

## TYPY SPÓŁEK — ODPOWIEDZIALNOŚĆ I FORMA UMOWY

| Spółka | Odpowiedzialność za zobowiązania | Forma umowy / statutu |
|---|---|---|
| jawna | wspólnik: bez ograniczenia, solidarnie (art. 22 § 2), subsydiarnie (art. 31 § 1; pozew wcześniej — § 2) | pisemna pod rygorem nieważności (art. 23); wzorzec S24 (art. 23¹) |
| partnerska | partner nie odpowiada za błędy zawodowe innych partnerów (art. 95 § 1) | pisemna pod rygorem nieważności (art. 92) |
| komandytowa | komandytariusz do sumy komandytowej (art. 111), wolny w granicach wniesionego wkładu (art. 112) | akt notarialny (art. 106); S24 (art. 106¹) |
| S.K.A. | akcjonariusz nie odpowiada (art. 135) | statut — akt notarialny |
| sp. z o.o. | wspólnicy nie odpowiadają (art. 151 § 4); zarząd — art. 299 | akt notarialny (art. 157 § 2); S24 (art. 157¹) |
| PSA | akcjonariusze nie odpowiadają (art. 300¹ § 4) | akt notarialny (art. 300⁶) |
| S.A. | akcjonariusze nie odpowiadają | statut — akt notarialny (art. 301 § 2) |

**Kapitał minimalny:** sp. z o.o. 5000 zł, udział ≥ 50 zł (art. 154 § 1–2); S.A. 100 000 zł, akcja ≥ 1 gr (art. 308 § 1–2); PSA kapitał akcyjny ≥ 1 zł, akcje bez wartości nominalnej (art. 300³ § 1, 300² § 3), wkład może być pracą lub usługami (art. 300² § 2).

**Rada nadzorcza:** S.A. — obowiązkowa (art. 381); sp. z o.o. — obowiązkowa RN lub komisja rewizyjna, gdy kapitał > 500 000 zł i > 25 wspólników (art. 213 § 2); S.K.A. — obowiązkowa przy > 25 akcjonariuszach (art. 142 § 1). Grupa spółek (wiążące polecenia): art. 211¹ i n., w tym art. 213–214 (uchwała o wykonaniu / odmowie).

**Spółka partnerska — katalog zawodów:** art. 88; psycholog dodany przez art. 138 ustawy Dz.U. 2026 poz. 187 — w mocy od 19.05.2028 (art. 161 tej ustawy). Przed tą datą psycholog nie może być partnerem.

---

## ODPOWIEDZIALNOŚĆ CZŁONKÓW ZARZĄDU SP. Z O.O. (art. 299)

| Przepis | Kwalifikator |
|---|---|
| art. 299 § 1 | bezskuteczna egzekucja przeciwko spółce → solidarna odpowiedzialność członków zarządu |
| art. 299 § 2 | przesłanki uwolnienia (ciężar na członku zarządu): wniosek o upadłość we właściwym czasie / otwarcie restrukturyzacji lub zatwierdzenie układu / brak winy / brak szkody wierzyciela |
| art. 299 § 1–2 + TK | wyrok TK (skutek od 19.04.2023, przypis w t.j.): były członek zarządu może bronić się zarzutem nieistnienia wierzytelności stwierdzonej orzeczeniem wobec spółki — pobierz przypis z t.j. |
| PrUp art. 11, 21 | niewypłacalność i termin na wniosek o upadłość — brzmienie z ELI (t.j. 2026/913) |
| przedawnienie | brak przepisu szczególnego w art. 299 — ustal z KC i orzecznictwem SN (`orzeczenia-sadowe-v2`) |

---

## REPREZENTACJA I PROKURA

| Przepis | Kwalifikator |
|---|---|
| art. 205 § 1 (sp. z o.o.), art. 373 § 1 (S.A.) | zarząd wieloosobowy, umowa/statut milczy → **dwóch członków zarządu łącznie albo członek z prokurentem** (nie każdy członek samodzielnie) |
| art. 205 § 2, 373 § 2 | oświadczenia i doręczenia **do** spółki — wobec jednego członka zarządu lub prokurenta |
| art. 17 § 1–3 | czynność bez **wymaganej ustawą uchwały** organu — nieważna (zgoda do 2 mies. po czynności, § 2); wymóg tylko z umowy/statutu — czynność ważna, odpowiedzialność zarządu (§ 3) |
| KC art. 109¹ | prokura — pełnomocnictwo przedsiębiorcy wpisanego do CEIDG/KRS; forma pisemna pod rygorem nieważności (art. 109²) |
| KC art. 109³ | wymagane pełnomocnictwo do poszczególnej czynności: zbycie przedsiębiorstwa, oddanie go do czasowego korzystania, zbywanie i obciążanie nieruchomości |
| KC art. 109⁴–109⁶ | prokura łączna (także z członkiem zarządu — § 1¹), oddziałowa; prokury nie można przenieść |
| KC art. 109⁷–109⁸ | odwołanie, wygaśnięcie, zgłoszenie do rejestru |

Weryfikacja aktualnej reprezentacji: odpis KRS (`krs_reprezentacja` / ekrs.ms.gov.pl).

---

## UCHWAŁY — ZASKARŻANIE

| Spółka | Powództwo | Termin od wiadomości | Termin graniczny | Przepis |
|---|---|---|---|---|
| sp. z o.o. | uchylenie | 1 miesiąc | 6 miesięcy od powzięcia | art. 251 |
| sp. z o.o. | nieważność | 6 miesięcy | **3 lata** od powzięcia | art. 252 § 3 |
| S.A. | uchylenie | 1 miesiąc | 6 miesięcy | art. 424 § 1 |
| S.A. publiczna | uchylenie | 1 miesiąc | **3 miesiące** | art. 424 § 2 |
| S.A. | nieważność | 6 miesięcy | **2 lata** | art. 425 § 2 |
| S.A. publiczna | nieważność | **30 dni od ogłoszenia** | **1 rok** | art. 425 § 3 |

- Upływ terminów nie wyłącza **zarzutu** nieważności (art. 252 § 4, 425 § 4); art. 189 KPC wyłączony (art. 252 § 1, 425 § 1).
- Legitymacja: art. 250 (sp. z o.o.), art. 422 § 2 (S.A.).
- Forma: zmiana umowy sp. z o.o. — uchwała + wpis (art. 255 § 1), protokół notarialny (art. 255 § 3); zmiana statutu S.A. — uchwała WZ + wpis (art. 430 § 1), protokół notarialny (art. 421 § 1). Skutek braku formy szczególnej — KC art. 73 § 2 (nie art. 17 KSH).

---

## ŁĄCZENIE, PODZIAŁ, PRZEKSZTAŁCENIE (Tytuł IV)

| Przepis | Kwalifikator |
|---|---|
| art. 491 § 1 | kapitałowe łączą się ze sobą i z osobowymi; osobowa (poza S.K.A.) nie może być przejmującą ani nowo zawiązaną |
| art. 491 § 1¹ | łączenie transgraniczne (kapitałowe i S.K.A.) |
| art. 491 § 2 | osobowe między sobą — tylko przez zawiązanie spółki kapitałowej lub S.K.A. albo przejęcie przez S.K.A. |
| art. 491 § 3 | zakaz: spółka w likwidacji po rozpoczęciu podziału majątku, spółka w upadłości |
| art. 492 § 1–2 | przejęcie / zawiązanie nowej spółki; dopłaty ≤ 10% |
| art. 493 § 1–2 | rozwiązanie bez likwidacji w dniu wykreślenia; dzień połączenia = wpis do rejestru przejmującej/nowej |
| art. 494 § 1–4 | sukcesja uniwersalna (także zezwolenia, koncesje, ulgi — § 2, chyba że ustawa/decyzja inaczej) |
| art. 528 § 1–3 | podział: spółka kapitałowa **i S.K.A.**; inna osobowa nie podlega podziałowi; zakazy jak przy łączeniu; S.A./S.K.A. z niepokrytym kapitałem |
| art. 528 § 1¹ | podział transgraniczny |
| art. 529 § 1 pkt 1–5 | przejęcie, zawiązanie nowych, przejęcie + zawiązanie, wydzielenie (pkt 4), wyodrębnienie (pkt 5 — udziały obejmuje spółka dzielona) |
| art. 551 § 1, § 1¹ | przekształcenie każdej spółki handlowej w inną; transgraniczne |
| art. 551 § 2–4 | spółka cywilna → spółka handlowa inna niż jawna (§ 2–3); zakaz: likwidacja po podziale majątku, upadłość (§ 4) |
| art. 551 § 5, 584¹ i n. | przekształcenie przedsiębiorcy (osoby fizycznej) w jednoosobową spółkę kapitałową; dzień przekształcenia = wpis (art. 584¹) |

M&A: sukcesja uniwersalna oznacza due diligence wszystkich zobowiązań spółki przejmowanej; selektywne nabycie — podział przez wydzielenie/wyodrębnienie lub nabycie przedsiębiorstwa (KC art. 55¹–55⁴).

---

## NOWELIZACJE W TOKU

| Akt | Wejście w życie | Kwalifikator |
|---|---|---|
| Dz.U. 2026 poz. 176 | 18.02.2027 (art. 35); art. 28 i 33 — od 28.02.2026 | S.A., S.K.A., PSA, SE: koniec podziału na akcje imienne i na okaziciela (do rejestracji akcji — dotychczasowe przepisy); art. 28: dokument akcji zachowuje moc dowodową (wobec spółki, co do praw udziałowych) przez 7 lat od wejścia w życie ustawy 2019/1798 — w mocy od 1.03.2021 wg ELI, więc do ok. 1.03.2028 (dzień końcowy: KC art. 110–116); art. 34: dostosowanie statutów/umów w 2 lata od 18.02.2027 |
| Dz.U. 2026 poz. 187, art. 138 | 19.05.2028 | art. 88 — psycholog w katalogu zawodów spółki partnerskiej |

---

## FORMY DZIAŁALNOŚCI POZA KSH — ODESŁANIA

| Temat | Gdzie |
|---|---|
| działalność nierejestrowana (Prawo przedsiębiorców art. 5), JDG/CEIDG | `mod-prawo-przedsiebiorcow`, `mod-Prawo-przedsiebiorcow-current-state-COV` |
| kontrola przedsiębiorcy (art. 45–65, sprzeciw art. 59), reglamentacja (koncesja, zezwolenie, rejestr) | `mod-wekslowe-kontrola-przedsiebiorcy-koncesje` (cz. B kontrola, cz. C reglamentacja) |
| spółka cywilna — KC art. 860–875 (umowa: art. 860 § 2; solidarność: art. 864); od 1.11.2028 wzorce i publikacja w CEIDG (Dz.U. 2026 poz. 507) | KC t.j. 2026/795; `mod-KC-cywilne-zobowiazania-odpowiedzialnosc` |
| umowa spółki, statut, regulaminy, founders' agreement, SHA/SPA | `analizator-umow-v1` → `prawo-polskie-v2/krajowe/analizator-umow-v1/references/mod-FA-founders-dokumenty-zalozycielskie.md`, `mod-MA-transakcje.md` |
| opodatkowanie form działalności | DR-06 (PIT, CIT, ryczałt) |

Pułapka: founders' agreement przed rejestracją spółki z wkładami na wspólny cel może zostać zakwalifikowany jako umowa spółki cywilnej (KC art. 860) — zastrzeż wyłączenie w umowie.

---

## STRATEGIA

**Wierzyciel sp. z o.o.:** odpis KRS (skład zarządu w dacie powstania zobowiązania) → tytuł i bezskuteczna egzekucja przeciw spółce → pozew z art. 299 § 1; przesłanki z § 2 po stronie pozwanego; skarga pauliańska przy przesunięciach majątku (`kc-zobowiazania/czesc-02-skarga-paulianska`).

**Zarząd spółki w trudnościach:** test niewypłacalności i termin z PrUp art. 11, 21 (ELI) → wniosek o upadłość lub otwarcie restrukturyzacji we właściwym czasie (art. 299 § 2) → dokumentacja przesłanek uwolnienia.

**Spór o uchwałę:** ustal datę wiadomości i powzięcia (tabela), legitymację, rodzaj wady (uchylenie vs nieważność); po terminie — zarzut nieważności.

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Upadłość / restrukturyzacja | moduły `mod-PrUpad-*`, `mod-PrRestr-*` (DR-02) |
| KRS | `mod-ustawa-KRS-rejestr-sadowy` |
| Pozew, wniosek o upadłość, zgłoszenie wierzytelności | `pisma-procesowe-v3` |
| Orzecznictwo SN | `orzeczenia-sadowe-v2` |
| Nieuczciwa konkurencja | `mod-ustawa-UZNK-nieuczciwa-konkurencja` |

---

## QUALITY GATE

- [ ] Brzmienie każdego powołanego przepisu pobrane z ELI (nie z kwalifikatora)?
- [ ] Stan prawny na dzień zdarzenia (2026/176, 2026/187 — daty wejścia w życie)?
- [ ] Reprezentacja ustalona z umowy/statutu i KRS, z regułą art. 205 § 1 / 373 § 1?
- [ ] Terminy zaskarżenia uchwały liczone od właściwego zdarzenia?
- [ ] Przy art. 299: bezskuteczność egzekucji wykazana; przesłanki § 2 i wyrok TK rozważone?

## OUTPUT

1. Stan faktyczny; 2. Typ spółki i stan prawny (przepisy z ELI); 3. Kwalifikacja i właściwość;
4. Terminy z datami granicznymi; 5. Przesłanki i dowody; 6. Ryzyka; 7. Strategia i kolejne kroki.
