# Upadłość — fundusze masy, kolejność zaspokojenia i plan podziału (PrUp art. 335–360)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535)
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article NUMER --verify-online`. Kwoty „minimalnego wynagrodzenia” i czynszów ustalaj z aktualnych źródeł na dzień planu — nie z pamięci. Tryb konsumencki: art. 491² ust. 1 wyłącza art. 337–339, 343 ust. 1a, 346 ust. 2, 347–356 i 358–366 → `mod-PrUpad-konsument-workflow`.

---

## FAZA 0 — INTAKE

```
□ Źródło sumy: fundusze masy (335) czy suma z likwidacji przedmiotu obciążonego (336)?
  → plan ogólny (347) czy oddzielny (348)?
□ Lista wierzytelności zatwierdzona w całości / częściowo (sprzeciwy nierozpoznane → rezerwy, 337 ust. 1a)?
□ Koszty postępowania i inne zobowiązania masy (art. 230) — zaspokojone na bieżąco (343)?
□ Kategoria każdej należności (342) — rozbij zgłoszenie na kapitał, odsetki, składki (3 lata?), kary
□ Pożyczki wspólników spółki kapitałowej z 5 lat przed upadłością — kategoria IV i wyjątki (342 ust. 4–6)
□ Upadły osoba fizyczna z mieszkaniem w masie → kwota na najem (342a)
□ Nieruchomość: alimenty, renty, wynagrodzenia pracowników z 3 miesięcy przed sprzedażą (346)
□ Wierzytelności warunkowe, niewymagalne, z poręczeniem (355–356)
□ Adres i rachunek wierzyciela (358) — brak → depozyt
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 335–341 | fundusze masy, sumy z przedmiotów obciążonych, częstotliwość podziału, plan oddzielny, wierzytelności zabezpieczone w planie ogólnym, wierzyciele spadku | A |
| 342–344 | kategorie zaspokojenia, kwota mieszkaniowa, koszty i zobowiązania masy, kolejność | B |
| 345–346 | zaspokojenie z przedmiotu obciążonego, pierwszeństwo, potrącenie kosztów, uprzywilejowane przy nieruchomości | C |
| 347–351 | sporządzenie planu, plan oddzielny, zarzuty, zatwierdzenie | D |
| 352–360 | wykonanie, wypłaty, wstąpienie upadłego w hipotekę, poręczyciele, warunkowe i niewymagalne, depozyt | E |
| uchylone | 357 (oraz jednostki oznaczone w tekście, np. 342 ust. 1 pkt 5, ust. 2, 4) | — |

---

## A. Fundusze i sumy z obciążeń (art. 335–341)

- **Art. 335:** **fundusze masy** = sumy z likwidacji + dochód z prowadzenia lub wydzierżawienia przedsiębiorstwa + odsetki od tych sum w banku, chyba że ustawa stanowi inaczej.
- **Art. 336:** sumy z likwidacji przedmiotów obciążonych hipoteką, zastawem, zastawem rejestrowym/skarbowym, hipoteką morską oraz prawami i roszczeniami osobistymi (wpisanymi w KW albo zgłoszonymi w terminie z art. 51 ust. 1 pkt 5) — **na zaspokojenie zabezpieczonych na tych przedmiotach**; nadwyżka wchodzi do funduszów masy (ust. 1); przewłaszczenie i przelew na zabezpieczenie — jak zastaw (ust. 2); **pożytki** przedmiotu obciążonego nie podlegają ust. 1 — wchodzą do funduszów masy (ust. 3).
- **Art. 337:** podział jednorazowy albo kilkakrotny w miarę likwidacji, **po zatwierdzeniu listy** w całości lub części; przy częściowym zatwierdzeniu — rezerwa w masie na kwoty objęte nierozpoznanymi sprzeciwami; przy kilku podziałach — ostateczny po całkowitej likwidacji.
- **Art. 338:** przy wierzytelnościach zabezpieczonych rzeczowo — podział ostateczny po podziale sumy ze zbycia przedmiotu obciążonego.
- **Art. 339:** podział sumy z art. 336 — odpowiednio przepisy o podziale funduszów; obwieszczenie i zawiadomienie upadłego oraz uprawnionych z tej sumy; środki zaskarżenia — upadły i uprawnieni.
- **Art. 340:** wierzytelności osobiste zabezpieczone rzeczowo — w planie ogólnym **tylko w części niezaspokojonej z przedmiotu zabezpieczenia**; odpowiednio wierzytelności zaspokojone przez ubezpieczyciela z umowy zawartej przez upadłego.
- **Art. 341:** wierzyciel spadku przyjętego po ogłoszeniu (za który odpowiada masa) — do wartości majątku spadkowego; przy kilku przekraczających łącznie wartość — proporcjonalnie.

## B. Kategorie i kolejność (art. 342–344)

**Kolejność ogólna:**
```
1. Koszty postępowania (art. 230 ust. 1) — w pierwszej kolejności, na bieżąco (343 ust. 1)
2. Inne zobowiązania masy (art. 230 ust. 2) — gdy fundusze pozwalają, na bieżąco; niezaspokojone
   → proporcjonalnie w drodze podziału (art. 347–360 odpowiednio) (343 ust. 1–1a)
3. Alimenty za czas PO ogłoszeniu — w terminach płatności do sporządzenia ostatecznego planu,
   dla każdego uprawnionego do kwoty minimalnego wynagrodzenia za pracę; reszta nie z masy (343 ust. 2)
4. Kategorie z art. 342 ust. 1 (i ust. 7) — dopiero po pełnym zaspokojeniu pkt 1–3 (344 ust. 1)
   dalsza kategoria po pełnym zaspokojeniu poprzedniej; w ramach kategorii — PROPORCJONALNIE (344 ust. 2)
```

**Kategorie (art. 342 ust. 1):**

| Kat. | Należności |
|---|---|
| **I** | za czas **przed** ogłoszeniem: należności ze stosunku pracy (bez wynagrodzenia reprezentanta i osób zarządu/nadzoru); należności rolników z umów o dostarczenie produktów z własnego gospodarstwa; alimenty; renty odszkodowawcze i z zamiany dożywocia; składki na ubezpieczenia społeczne za **3 ostatnie lata** przed ogłoszeniem; należności z czynności zarządcy w restrukturyzacji albo z czynności dłużnika po otwarciu restrukturyzacji (niewymagających zgody lub dokonanych za zgodą rady / nadzorcy) — jeżeli upadłość ogłoszono na **uproszczony wniosek**; finansowanie przewidziane układem i udzielone w związku z jego wykonaniem — gdy wniosek o upadłość złożono nie później niż **3 miesiące** po prawomocnym uchyleniu układu |
| **II** | inne należności niezaliczone do pozostałych kategorii, w szczególności **podatki i daniny** oraz pozostałe składki społeczne |
| **III** | **odsetki** od należności z wyższych kategorii (w kolejności zaspokajania kapitału); sądowe i administracyjne **kary grzywny**; należności z **darowizn i zapisów** |
| **IV** | należności **wspólników/akcjonariuszy** z pożyczki lub czynności o podobnych skutkach (w szczególności dostawy z odroczonym terminem) na rzecz upadłej **spółki kapitałowej** w **5 lat** przed ogłoszeniem, z odsetkami |
| V–VII | tylko domy maklerskie (art. 95 ust. 1 pkt 1 i 3 ustawy o obrocie): V — instrumenty dodatkowe w Tier I bez zgody KNF z art. 110ea; VI — instrumenty w Tier II; VII — instrumenty dodatkowe w Tier I (każda z odsetkami i kosztami egzekucji) (ust. 7) |

- **Wyłączenia z kategorii IV (ust. 5):** pożyczki w toku restrukturyzacji i w wykonaniu układu; pożyczki wspólników z **< 10%** głosów, chyba że są członkami organów lub faktycznie prowadzą sprawy spółki; pożyczki sprzed konwersji wierzytelności na udziały/akcje w układzie.
- **Ust. 6:** odpowiednio pożyczki podmiotu dysponującego bezpośrednio większością głosów w spółce będącej wspólnikiem upadłej spółki.
- **Ust. 3:** roszczenia FGŚP o zwrot wypłat pracownikom — jak należności pracownicze.
- Pkt 5, ust. 2 i 4 uchylone.

**Kwota mieszkaniowa (art. 342a):** upadły osoba fizyczna, w masie lokal lub dom, w którym mieszka, konieczne zaspokojenie potrzeb mieszkaniowych → z ceny sprzedaży wydziela się kwotę równą przeciętnemu **czynszowi najmu** w tej samej lub sąsiedniej miejscowości za **12–24 miesiące**; ustala s.-k. na wniosek upadłego (potrzeby, liczba osób na utrzymaniu, zdolności zarobkowe, cena, opinia syndyka); zażalenie; możliwa **zaliczka** przed sprzedażą, gdy fundusze pozwalają, a lokal został opuszczony.

## C. Zaspokojenie z przedmiotu obciążonego (art. 345–346)

```
Z sumy z likwidacji przedmiotu obciążonego zaspokaja się zabezpieczonych (hipoteka, zastawy,
  hipoteka morska) oraz wygasające prawa i roszczenia osobiste — PO POTRĄCENIU:
  — kosztów likwidacji tego przedmiotu
  — innych kosztów postępowania do 1/10 sumy z likwidacji, ale nie więcej niż część kosztów
    odpowiadająca stosunkowi wartości przedmiotu do wartości całej masy (345 ust. 1)
Kolejność wg pierwszeństwa; hipoteka vs prawa wygasłe z art. 313 ust. 2 — decyduje chwila,
  od której liczą się skutki wpisu do KW (345 ust. 2)
Świadczenia uboczne objęte zabezpieczeniem — na równi z należnością; zaliczenie: najpierw
  należność główna, potem odsetki i inne uboczne, koszty postępowania na końcu (345 ust. 3)
Nieruchomość / użytkowanie wieczyste / spółdzielcze prawo / statek — PRZED hipoteką i innymi
  wygasłymi prawami zaspokaja się (346 ust. 1):
  — alimenty w zakresie art. 343 ust. 2
  — renty odszkodowawcze i z zamiany dożywocia za czas po ogłoszeniu
  — wynagrodzenia pracowników pracujących na nieruchomości / statku / w lokalu za ostatnie
    3 MIESIĄCE przed sprzedażą — do 3-krotności minimalnego wynagrodzenia
  suma nie wystarcza nawet na te należności → bez odrębnego planu (346 ust. 2)
```

## D. Plan podziału — sporządzenie i zarzuty (art. 347–351)

**Treść planu (art. 347):** suma do podziału; wierzytelności i prawa uczestników; kwota przypadająca każdemu; które sumy wypłaca się, a które (i dlaczego) idą do depozytu lub zostają w masie na nierozpoznane sprzeciwy; plan **częściowy czy ostateczny**; s.-k. może wnieść poprawki lub polecić zmiany (ust. 1a uchylony).

- **Art. 348:** prawa na zbytych rzeczach (art. 345–346) → **oddzielny plan** dla sum z tych rzeczy; przy nieruchomości — także wykaz praw i roszczeń osobistych, które wygasły.
- **Art. 349:** s.-k. zawiadamia upadłego i radę oraz **obwieszcza** możliwość przeglądania planu i wnoszenia **zarzutów w 2 tygodnie** od obwieszczenia; przy **ostatecznym** planie — dopiero po uprawomocnieniu postanowienia o wynagrodzeniu ostatecznym syndyka (ust. 3 uchylony).
- **Art. 350:** zarzuty rozpoznaje s.-k. (w razie potrzeby wysłuchuje zainteresowanych); zażalenie.
- **Art. 351:** bez zarzutów — zatwierdzenie; z zarzutami — sprostowanie i zatwierdzenie po uprawomocnieniu rozstrzygnięcia (lub orzeczenia sądu); obwieszczenie zatwierdzenia, sprostowania, zmiany.

## E. Wykonanie planu i depozyt (art. 352–360)

| Art. | Reguła |
|---|---|
| 352 | wykonanie **niezwłocznie** po zatwierdzeniu, ale **nie przed uprawomocnieniem** postanowienia o ogłoszeniu; przy zarzutach / zażaleniu — w częściach niespornych, zakres określa s.-k. |
| 353 | syndyk wydaje kwotę lub przelewa na rachunek; po wykonaniu — **sprawozdanie z wykonania planu** (ust. 3 uchylony) |
| 354 | zaspokojenie wierzyciela osobistego zabezpieczonego hipoteką/hipoteką morską **przed zbyciem** przedmiotu → **upadły wstępuje w prawa wierzyciela**; wpis w KW / rejestrze okrętowym na podstawie wyciągu z planu uwierzytelnionego przez sekretarza |
| 355 | wierzytelność z poręczeniem / gwarancją / współdłużnikiem — wypłata wierzycielowi w proporcji do kwoty należnej w dniu planu, a poręczycielowi/gwarantowi/współdłużnikowi w proporcji do dokonanej zapłaty |
| 356 | warunek **rozwiązujący** — wypłata bez zabezpieczenia (chyba że obowiązek z umowy); warunek **zawieszający** (także z art. 248 ust. 2) — wypłata po udowodnieniu ziszczenia, inaczej depozyt; wierzytelność **niewymagalna** — depozyt |
| 358 | nieodebranie w **miesiąc**, zły adres, brak rachunku → depozyt sądowy |
| 359 | o złożeniu do depozytu orzeka s.-k. (bez art. 693³ § 1 i 3 KPC); o wydaniu — s.-k., a po prawomocnym zakończeniu / umorzeniu — sąd |
| 360 | przy wydaniu bada się tylko legitymację; następca — dokument urzędowy albo prywatny z podpisem urzędowo poświadczonym; termin odbioru **3 lata** od prawomocności zakończenia/umorzenia, nie mniej niż 3 lata od ziszczenia warunku (356 ust. 1–2) lub wymagalności; potem — Skarb Państwa; likwidacja depozytu — art. 693¹⁸–693²² KPC |

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| 3 lata przed ogłoszeniem | składki ZUS w kategorii I | art. 342 ust. 1 pkt 1 |
| 3 mies. po uchyleniu układu | finansowanie z układu w kategorii I | art. 342 ust. 1 pkt 1 |
| 5 lat przed ogłoszeniem | pożyczki wspólników — kategoria IV | art. 342 ust. 1 pkt 4 |
| < 10% głosów | wyłączenie z kategorii IV (chyba że organ / faktyczne prowadzenie spraw) | art. 342 ust. 5 pkt 2 |
| 12–24 mies. czynszu | kwota mieszkaniowa upadłego | art. 342a |
| minimalne wynagrodzenie | limit alimentów za czas po ogłoszeniu (na uprawnionego, na płatność) | art. 343 ust. 2 |
| 1/10 sumy | limit innych kosztów potrącanych z sumy z przedmiotu obciążonego | art. 345 ust. 1 |
| 3 mies. / 3× minimalne | wynagrodzenia pracowników przy sprzedaży nieruchomości | art. 346 ust. 1 |
| 2 tyg. | obwieszczenie planu — zarzuty | art. 349 ust. 1 |
| miesiąc | nieodebranie należności → depozyt | art. 358 |
| 3 lata | odbiór depozytu | art. 360 ust. 2 |

## PUŁAPKI

- Koszty postępowania i inne zobowiązania masy (230) nie są kategorią z art. 342 — zaspokaja się je przed kategoriami.
- Pożytki przedmiotu obciążonego idą do funduszów masy, nie do zabezpieczonego (336 ust. 3).
- Zabezpieczony rzeczowo uczestniczy w planie ogólnym tylko z niedoborem (340).
- Rozbij zgłoszenie: kapitał w kategorii I/II, odsetki w III, składki starsze niż 3 lata w II.
- Kategoria IV dotyczy tylko spółek kapitałowych i pożyczek z 5 lat; sprawdź wyjątki z ust. 5.
- Ostateczny plan obwieszcza się dopiero po prawomocnym wynagrodzeniu ostatecznym syndyka (349 ust. 2).
- Wykonanie planu nie przed prawomocnością postanowienia o ogłoszeniu (352 ust. 1).
- Wierzytelności warunkowe (w tym poręczycieli z art. 248 ust. 2) i niewymagalne — do depozytu (356).

## POWIĄZANIA

- Koszty i inne zobowiązania masy (art. 230–233) → `mod-PrUpad-organy-procedura`
- Lista wierzytelności, kategorie w zgłoszeniu → `mod-PrUpad-wierzytelnosci-235-266`
- Likwidacja, wydzielenie wartości zastawu (art. 314, 318, 330) → `mod-PrUpad-syndyk-likwidacja`
- Odsetki z masy (art. 92), wierzytelności zabezpieczone — wyłączenia (art. 63–67) → `mod-PrUpad-skutki-masa-bezskutecznosc`
- Plan spłaty — odpowiednie stosowanie art. 336 i 340–346 (art. 370a ust. 9) → `mod-PrUpad-zakonczenie-zakaz-karne`
- Konsument → `mod-PrUpad-konsument-workflow`

## WYNIK

Rachunek podziału: suma (335/336) → potrącenia (345) → uprzywilejowane (343 ust. 2, 346) → kategorie I–IV (342) z proporcją w kategorii (344) → rezerwy na sprzeciwy i depozyty (337, 347, 356, 358); projekt planu z art. 347 (oddzielnego z art. 348); zarzuty w 2 tygodnie (349).
