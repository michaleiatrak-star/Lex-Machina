# Restrukturyzacja — układ częściowy (PrRestr art. 180–188)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 48–49
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak. Art. 180 ust. 5 dodany i art. 186 uchylony przez DU/2025/1085 — ujęte w t.j.; dla spraw sprzed 23.08.2025 → `mod-PrRestr-zrodla-i-wersje`.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 183 --verify-online`. Układ częściowy — **tylko w PZU i PPU** (182 ust. 1). Większości — art. 119 (art. 186 uchylony).

---

## FAZA 0 — INTAKE

```
□ Tryb: PZU albo PPU (182 ust. 1); w sanacji — art. 192 (wierzyciele nieobjęci z mocy prawa, którzy nie zgodzili się na objęcie)
□ Zobowiązania o zasadniczym wpływie na dalsze funkcjonowanie (180 ust. 1): finansujący, umowy kluczowe (dostawy, leasing), zabezpieczeni na majątku niezbędnym, największe kwotowo (180 ust. 4)
□ Kryteria wyodrębnienia: obiektywne, jednoznaczne, uzasadnione ekonomicznie; zakaz kryteriów omijających przeciwnika (180 ust. 2–3); grupy — art. 161 (180 ust. 5)
□ Wpływ na nieobjętych: zakaz korzyści zmniejszających ich zaspokojenie (183 ust. 1); nowe zabezpieczenia — ryzyko bezskuteczności przy upadłości w roku (183 ust. 2)
□ Karta do głosowania (PZU): oznaczenie częściowości i kryteriów (184)
□ Kontrola kryteriów: w PZU — przy zatwierdzeniu (182 ust. 2); w PPU — niezwłocznie po wniosku (182 ust. 3), jednorazowa zmiana (182 ust. 4–5)
□ Lista związanych wierzycieli w postanowieniu (187)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 180 | przedmiot, kryteria wyodrębnienia, typowe wierzytelności, grupy | A |
| 182 | tryby, kontrola kryteriów w PZU i PPU, zażalenie, zmiana kryteriów | A |
| 183–185 | ochrona wierzycieli nieobjętych, bezskuteczność zabezpieczeń, karta do głosowania, ograniczenia informacyjne i zastrzeżenia | B |
| 187–188 | zakres związania, zażalenie wierzyciela nieobjętego | C |
| uchylone | 181, 186 | — |

---

## A. Przedmiot i kryteria (art. 180, 182)

- **Art. 180:** dłużnik może złożyć propozycje obejmujące **tylko niektóre zobowiązania**, których restrukturyzacja ma **zasadniczy wpływ na dalsze funkcjonowanie** przedsiębiorstwa (ust. 1); wyodrębnienie według **obiektywnych, jednoznacznych i uzasadnionych ekonomicznie** kryteriów dotyczących stosunków prawnych z dłużnikiem (ust. 2); **zakaz** kryteriów mających na celu **pominięcie wierzyciela przeciwnego** układowi (ust. 3); w szczególności wierzytelności: z **finansowania** (kredyty, pożyczki, podobne instrumenty) (pkt 1), z **umów o zasadniczym znaczeniu** (dostawy najważniejszych materiałów, leasing majątku niezbędnego) (pkt 2), **zabezpieczone rzeczowo** na przedmiotach i prawach niezbędnych do prowadzenia przedsiębiorstwa (pkt 3), **największe według sumy** (pkt 4) (ust. 4); odpowiednio **art. 161** (grupy, w tym obowiązkowe) (ust. 5).
- **Art. 181:** uchylony.
- **Art. 182:** układ częściowy **wyłącznie w PZU albo PPU** (ust. 1). **PZU** — sąd **odmawia zatwierdzenia** przy niezgodnych z prawem kryteriach wskazanych we wniosku (ust. 2). **PPU** — sąd **niezwłocznie po wniosku** orzeka o zgodności kryteriów z prawem (ust. 3); zażalenie **dłużnika** na stwierdzenie niezgodności; w terminie zażalenia dłużnik może **zaproponować inne kryteria** (ust. 4); po uprawomocnieniu — **umorzenie**, chyba że zaproponowano inne kryteria; **kolejna zmiana niedopuszczalna** (ust. 5).

## B. Ochrona nieobjętych (art. 183–185)

- **Art. 183:** propozycje nie mogą przewidywać dla objętych **korzyści zmniejszających możliwość zaspokojenia nieobjętych** (ust. 1). Nowe **zabezpieczenia** objętych (hipoteka, zastaw, zastaw rejestrowy, hipoteka morska, przewłaszczenie) są **bezskuteczne** wobec masy upadłości lub wierzycieli, jeżeli **upadłość** ogłoszono w ciągu **roku** od postanowienia o zatwierdzeniu układu częściowego albo w tym terminie **oddalono wniosek na podstawie art. 13 PrUp** (ust. 2).
- **Art. 184:** przy samodzielnym zbieraniu głosów karta (art. 213) zawiera także informację o **częściowym charakterze** i **kryteriach** objęcia.
- **Art. 185:** w PZU dłużnik i nadzorca układu **nie muszą udzielać nieobjętym** informacji o sytuacji majątkowej i wykonalności (ust. 1); nieobjęty może zgłaszać **zastrzeżenia** (art. 216 ust. 2) **wyłącznie** co do niezgodnych z prawem **kryteriów** i zgodności propozycji z **art. 183 ust. 1** (ust. 2).
- **Art. 186:** uchylony.

## C. Związanie i zaskarżenie (art. 187–188)

- **Art. 187:** układ częściowy obejmuje wierzycieli spełniających kryteria, którzy zostali **umieszczeni w spisie**, stawili się z **tytułem egzekucyjnym** albo zostali **dopuszczeni** na podstawie art. 107 ust. 3; **art. 166 ust. 1 nie stosuje się** (brak związania wierzycieli spoza spisu) (ust. 1); sąd w postanowieniu **wskazuje objętych wierzycieli** (ust. 2).
- **Art. 188:** zażalenie na zatwierdzenie przysługuje także **wierzycielowi nieobjętemu** — wyłącznie z zarzutami naruszenia **art. 180** lub **art. 183 ust. 1**.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| termin zażalenia | propozycja nowych kryteriów (jednokrotnie) | art. 182 ust. 4–5 |
| rok od zatwierdzenia | bezskuteczność nowych zabezpieczeń przy upadłości / oddaleniu z art. 13 PrUp | art. 183 ust. 2 |

## PUŁAPKI

- Układ częściowy poza PZU i PPU jest niedopuszczalny (182 ust. 1) — w sanacji tylko ścieżka z art. 192.
- Kryteria nie mogą być dobrane pod pominięcie przeciwnika (180 ust. 3) — dokumentuj ekonomiczne uzasadnienie każdego kryterium.
- PPU: jedna szansa na zmianę kryteriów; druga negatywna ocena = umorzenie (182 ust. 5).
- Nowe zabezpieczenia dla objętych mogą upaść przy upadłości w roku (183 ust. 2) — informuj finansujących.
- Związani są tylko wierzyciele ze spisu / z tytułem / dopuszczeni (187) — inaczej niż w zwykłym układzie (art. 166 ust. 1).
- Wierzyciel nieobjęty ma ograniczone zastrzeżenia (185 ust. 2) i zażalenie (188) — tylko kryteria i art. 183 ust. 1.
- Nie stosuj uchylonych art. 181 i 186 (dawne reguły zabezpieczeń i większości).

## POWIĄZANIA

- Grupy (art. 161), układ, zatwierdzenie (art. 164–166) → `mod-PrRestr-dzial-VI-uklad`
- Większości (art. 119), dopuszczenie (art. 107 ust. 3) → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`
- PZU: karta (art. 213), zastrzeżenia (art. 216) → `mod-PrRestr-pzu`; PPU → `mod-PrRestr-ppu-pu`
- Kolejne postępowania i układ częściowy w sanacji (art. 191–192) → `mod-PrRestr-procedura-zakonczenie`
- Oddalenie wniosku (art. 13 PrUp), bezskuteczność w upadłości → `mod-PrUpad-wniosek-ogloszenie`, `mod-PrUpad-skutki-masa-bezskutecznosc`

## WYNIK

Wybór trybu (182 ust. 1) → katalog zobowiązań kluczowych i kryteria z uzasadnieniem (180) → kontrola wpływu na nieobjętych i ryzyka zabezpieczeń (183) → karta z oznaczeniem częściowości (184) → kontrola kryteriów (182 ust. 2–5) → głosowanie (art. 119) → postanowienie z listą objętych (187) → zażalenia, także nieobjętych (188).
