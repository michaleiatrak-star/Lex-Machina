# Upadłość — zgłoszenie i ustalenie wierzytelności: zgłoszenie, sprawdzenie, lista, sprzeciw, zatwierdzenie, wyciąg (PrUp art. 235–266)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913; akt bazowy DU/2003/535)
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prup/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prup.py article NUMER --verify-online`. Odesłania do KPC (art. 130, 350, 353) — odczytaj w ELI na dzień czynności.
**Tryb konsumencki:** art. 491² ust. 1 wyłącza m.in. art. 244, 245 i 253–264 (zweryfikowane w t.j.) → `mod-PrUpad-konsument-workflow`.

---

## FAZA 0 — INTAKE

```
□ Termin zgłoszeń: 30 dni od obwieszczenia postanowienia o ogłoszeniu w KRZ (art. 51 ust. 1 pkt 4)
  — data obwieszczenia? zgłoszenie w terminie czy po nim (ryczałt z art. 235, skutki z art. 252)?
□ Czy wierzytelność wymaga zgłoszenia? (pracownicze — nie; zabezpieczone rzeczowo — z urzędu)
□ Kanał: system teleinformatyczny / wyjątek papierowy dla wierzycieli z art. 216aa
□ Treść z art. 240 pkt 1–7 i 9; dowody; kategoria (art. 342); zabezpieczenia; toczące się sprawy
□ Szczególne obliczenia: niepieniężna, niewymagalna bez odsetek, odsetki, waluta obca,
  świadczenia okresowe, współdłużnik/poręczyciel, okres rozliczeniowy przecinający datę upadłości
□ Sprzeciw: data obwieszczenia o złożeniu listy → 2 tygodnie; legitymacja; zakaz nowych twierdzeń
□ Po zakończeniu: wyciąg z listy jako tytuł egzekucyjny; umorzenie zobowiązań (art. 265)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 235 | ryczałt za zgłoszenie po terminie | A |
| 236–238 | wierzytelności podlegające zgłoszeniu, pracownicze, FGŚP, KRUS | A |
| 239a–240a | przerwanie przedawnienia, treść zgłoszenia | B |
| 241–243 | wady zgłoszenia, zwrot i skarga, sprawdzenie przez syndyka | C |
| 244–254 | sporządzenie listy, rubryki, zasady wyceny, zgłoszenia spóźnione, uzupełnienie, zmiana wierzyciela | D |
| 255–259 | obwieszczenie listy, sprzeciw, odpowiedź, rozpoznanie, zażalenie | E |
| 260–262 | zatwierdzenie, zmiany z urzędu, uzupełnienie, sprostowanie | F |
| 263–266 | dochodzenie wierzytelności nieuznanej, wyciąg z listy jako tytuł, umorzenie, zwrot dokumentów | G |
| uchylone | 239, 242 (art. 241 nadal odsyła do art. 239 — przypis 12 t.j.: uchylony, nie przywracaj treści) | — |

---

## A. Kto i co zgłasza (art. 235–238)

- **Art. 236 ust. 1:** wierzyciel **osobisty**, który chce uczestniczyć i wymaga ustalenia wierzytelności, zgłasza ją **syndykowi przez system teleinformatyczny** w terminie z postanowienia o ogłoszeniu.
- **Art. 236 ust. 2–4:** wierzytelności zabezpieczone hipoteką, zastawem, zastawem rejestrowym/skarbowym, hipoteką morską lub innym wpisem w KW / rejestrze okrętowym — zgłoszenie uprawnieniem; **brak zgłoszenia → umieszczenie na liście z urzędu**; odpowiednio, gdy upadły jest tylko dłużnikiem rzeczowym, a wierzyciel chce zaspokojenia z przedmiotu; przepisy dotyczą też innych należności z masy.
- **Art. 237:** należności **ze stosunku pracy nie wymagają zgłoszenia** — z urzędu na liście.
- **Art. 238:** roszczenia FGŚP o zwrot wypłaconych świadczeń — jak pracownicze; wierzytelności KRUS — jak ZUS.
- **Art. 235 — zgłoszenie po terminie:** wierzyciel ponosi **zryczałtowane koszty** = **15%** przeciętnego miesięcznego wynagrodzenia w sektorze przedsiębiorstw bez nagród z zysku w **III kw. roku poprzedniego** (GUS), **nawet bez winy**; wyjątek — spóźnienie wynikające z korekty deklaracji lub podobnego rozliczenia przez syndyka (ust. 1); syndyk zobowiązuje do wpłaty na wskazany rachunek w wyznaczonym terminie (ust. 2). Kwotę licz z aktualnego obwieszczenia GUS.

## B. Treść zgłoszenia i przedawnienie (art. 239a–240a)

- **Art. 239a:** zgłoszenie **przerywa bieg przedawnienia**; biegnie na nowo od dnia po **uprawomocnieniu się postanowienia o zakończeniu albo umorzeniu** postępowania.

**Treść zgłoszenia (art. 240):**
```
1) wierzyciel: imię i nazwisko / nazwa, PESEL / KRS (brak → inne dane z art. 22 ust. 4 —
   art. 240a), firma przedsiębiorcy, miejsce zamieszkania / siedziba, adres, NIP
2) określenie wierzytelności z należnościami ubocznymi; wartość wierzytelności niepieniężnej
3) dowody istnienia — przy uznaniu w spisie wierzytelności z restrukturyzacji wystarczy
   powołanie się na to
4) kategoria zaspokojenia (art. 342)
5) zabezpieczenia
6) przy wierzytelności, za którą upadły odpowiada tylko rzeczowo — przedmiot zabezpieczenia
7) stan sprawy, jeżeli toczy się postępowanie sądowe, administracyjne, sądowoadministracyjne
   lub polubowne
9) numer rachunku bankowego (jeżeli wierzyciel ma)
(pkt 8 uchylony)
```

## C. Wady, zwrot, sprawdzenie (art. 241–243)

- **Art. 241:** zgłoszenie niespełniające warunków pisma procesowego lub art. 240 (odesłanie do uchylonego art. 239 — bez treści) albo brak wpłaty ryczałtu z art. 235 w terminie syndyka → **art. 130 KPC odpowiednio** (wezwanie do uzupełnienia pod rygorem zwrotu).

**Zwrot i skarga (art. 242a):**
```
Zarządzenie syndyka o zwrocie — z uzasadnieniem (ust. 1)
Skarga do s.-k.; pouczenie wierzyciela bez profesjonalnego pełnomocnika o terminie i sposobie (ust. 2)
Wymogi pisma procesowego + oznaczenie zwróconego zgłoszenia (ust. 3)
Termin: TYDZIEŃ od doręczenia zarządzenia z uzasadnieniem (ust. 4)
Wnosi się DO SYNDYKA; syndyk w 3 DNI przekazuje s.-k. ze zgłoszeniem i zarządzeniem przez system,
  chyba że uwzględni skargę w całości (zawiadamia skarżącego) (ust. 5)
S.-k. rozpoznaje w TYDZIEŃ od wpływu (przy brakach / opłacie — od uzupełnienia) (ust. 6)
Odrzucenie: po terminie, niedopuszczalna, nieuzupełniona, nieopłacona; zażalenie (ust. 7)
```

**Sprawdzenie (art. 243):**
```
Syndyk sprawdza potwierdzenie w księgach i dokumentach upadłego, KW, rejestrach; wzywa upadłego
  do oświadczenia w zakreślonym terminie, czy uznaje (ust. 1)
Brak potwierdzenia → wezwanie wierzyciela do złożenia w TYDZIEŃ dokumentów wskazanych
  w zgłoszeniu pod rygorem ODMOWY UZNANIA (ust. 2)
  — termin NIE podlega przedłużeniu ani przywróceniu
  — dokumenty spóźnione syndyk może uwzględnić, jeżeli nie opóźni to przekazania listy
Wezwanie zawiera pouczenie o skutkach uchybienia (ust. 3)
```

## D. Lista wierzytelności (art. 244–254)

- **Art. 244:** po upływie terminu zgłoszeń i sprawdzeniu — niezwłocznie, **najpóźniej w 2 miesiące** od upływu terminu zgłoszeń.
- **Art. 245 — rubryki:** l.p.; dane wierzyciela (inne dane — art. 22 ust. 4); suma uznana; kategoria; istnienie i rodzaj zabezpieczenia; warunkowość; uzasadnienie odmowy uznania; załącza się **oświadczenie upadłego** z uzasadnieniem albo wzmiankę, że go nie złożył i dlaczego (pkt 7, 9 oraz ust. 2, 3, 5 uchylone).

**Zasady umieszczania na liście:**

| Art. | Sytuacja | Reguła |
|---|---|---|
| 245a | okres rozliczeniowy, w trakcie którego ogłoszono upadłość (czynsz, podatki, składki) | **z mocy prawa** proporcjonalny podział na część sprzed i po dniu ogłoszenia; odpowiednio leasing, gdy przedmiot nie jest u upadłego środkiem trwałym (PIT/CIT); deklaracje — odrębne dla obu części |
| 246 | wierzytelność niepieniężna | suma pieniężna wg wartości z **dnia ogłoszenia** |
| 247 ust. 1 | niewymagalna, bez zastrzeżenia odsetek | minus odsetki ustawowe, nie wyżej niż **6%**, od ogłoszenia do wymagalności, maks. za **2 lata** |
| 247 ust. 2 | odsetki od wierzytelności pieniężnej | naliczone **do dnia poprzedzającego** dzień ogłoszenia włącznie |
| 248 | współdłużnik, poręczyciel (regres) | w wysokości, w jakiej zaspokoili wierzyciela; mogą zgłosić przed zaspokojeniem (także gwarant, bank akredytywy) — jako **warunkowa**, bez prawa głosu |
| 249 | świadczenia powtarzające się | czas oznaczony — suma za cały czas minus odsetki ustawowe (≤ 6%) do wymagalności każdego świadczenia; dożywotnie lub nieoznaczone — wartość prawa; suma wykupu z umowy — jako wartość prawa; **nie dotyczy alimentów** |
| 250 | zabezpieczenie hipoteką / wpisem na majątku za granicą | na liście po dowodzie **wykreślenia** wpisu — chyba że upadłość uznana w państwie położenia przedmiotu |
| 251 | waluta obca | przeliczenie po **średnim kursie NBP z dnia ogłoszenia** (brak kursu — średnia cena rynkowa z tej daty); nie przekształca zobowiązania w złotowe; wypłata w planie podziału — w PLN |
| 252 | zgłoszenie **po terminie** (bez względu na przyczynę) | dokonane czynności skuteczne; bez wpływu na złożone plany podziału; udział tylko w planach sporządzonych po uznaniu; brak prawomocnego rozstrzygnięcia do zakończenia/umorzenia → umorzenie w tym zakresie; zgłoszenie po zatwierdzeniu **ostatecznego** planu — bez rozpoznania |
| 253 | zgłoszenia po terminie | syndyk uzupełnia listę na bieżąco; po przekazaniu listy s.-k. — uzupełnienie listy ze sposobem zaspokojenia; obwieszczenie |
| 254 | zmiana wierzyciela po zgłoszeniu (cesja) | uwzględnia się, gdy stwierdzona dokumentem urzędowym albo niebudzącym wątpliwości dokumentem prywatnym z podpisem **urzędowo poświadczonym** i zgłoszona syndykowi **przed przekazaniem listy** s.-k.; później — s.-k. może uwzględnić do ostatecznego zatwierdzenia, jeśli bez opóźnienia; nieuwzględnienie nie odbiera nabywcy uprawnień w dalszym toku |

## E. Sprzeciw (art. 255–259)

```
Obwieszczenie o dacie złożenia listy (255 ust. 2; ust. 1 uchylony)
SPRZECIW do s.-k. w 2 TYGODNIE od obwieszczenia (256):
  — wierzyciel umieszczony na liście → co do UZNANIA (cudzej) wierzytelności
  — wierzyciel, któremu odmówiono → co do ODMOWY uznania (swojej)
  — upadły, gdy lista niezgodna z jego wnioskami lub oświadczeniami; jeżeli mimo wezwania nie
    składał oświadczeń — tylko po wykazaniu przyczyn od niego niezależnych
Wymogi (257): pismo procesowe + zaskarżona wierzytelność + wniosek (uznanie / odmowa)
  + uzasadnienie + dowody; braki / brak opłaty → art. 130 KPC; odrzucenie: po terminie,
  niedopuszczalny, nieuzupełniony, nieopłacony (ust. 3 uchylony)
Prekluzja (258): tylko twierdzenia i zarzuty ze ZGŁOSZENIA — nowe tylko, gdy wcześniej
  niemożliwe albo potrzeba wynikła później; wierzytelność stwierdzona prawomocnym orzeczeniem
  — sprzeciw wyłącznie na zdarzeniach po zamknięciu rozprawy, udowodnionych pismem
Odpowiedź (258a): s.-k. doręcza odpis syndykowi, upadłemu i wierzycielowi, którego dotyczy;
  termin odpowiedzi NIE KRÓTSZY NIŻ TYDZIEŃ; syndyk przekazuje zgłoszenie i dokumenty z art. 243
  ust. 2; odpowiedź spóźniona / nieuzupełniona — zwrot; twierdzenia i dowody spoza sprzeciwu
  i odpowiedzi pomija się, chyba że brak winy albo bez zwłoki
Rozpoznanie (259): s.-k. / zastępca / wyznaczony sędzia na NIEJAWNYM w 2 MIESIĄCE od wniesienia;
  rozprawa fakultatywna — niestawiennictwo nie wstrzymuje; można odstąpić od świadka lub
  biegłego i oprzeć się na dokumentach z innego postępowania; syndyk ma prawa uczestnika;
  ZAŻALENIE — upadły, syndyk, każdy wierzyciel; uchylenie i przekazanie tylko przy konieczności
  przeprowadzenia postępowania dowodowego w całości albo nieważności nieusuwalnej w II instancji
```

## F. Zatwierdzenie i zmiany listy (art. 260–262)

- **Art. 260:** po prawomocnym rozstrzygnięciu sprzeciwów s.-k. zmienia listę i ją **zatwierdza**; bez sprzeciwów — po upływie terminu na sprzeciw; możliwe **częściowe zatwierdzenie** w zakresie nieobjętym sprzeciwami; obwieszczenie zatwierdzenia.
- **Art. 261:** s.-k. **z urzędu** zmienia listę, gdy umieszczono wierzytelności nieistniejące (w całości lub części) albo pominięto wierzytelności umieszczane z urzędu; obwieszczenie daty postanowienia; zażalenie; obwieszczenie prawomocności.
- **Art. 262:** zgłoszone po terminie lub ujawnione później (niewymagające zgłoszenia) — **uzupełnienie listy**; sprostowanie stosownie do prawomocnych orzeczeń; **zmiana wysokości po ustaleniu listy** uwzględniana przy planie podziału albo głosowaniu; oczywiste omyłki — art. 350 i 353 KPC odpowiednio (s.-k. lub referendarz; skarga na referendarza nie wstrzymuje mocy; sąd jednoosobowo jako II instancja); obwieszczenie prawomocnego sprostowania (ust. 3 uchylony).

## G. Po ustaleniu listy i po zakończeniu (art. 263–266)

- **Art. 263:** odmowa uznania nie zamyka drogi do dochodzenia we właściwym trybie — z uwzględnieniem art. 145 ust. 1 dopiero **po umorzeniu lub zakończeniu** upadłości.
- **Art. 264 — wyciąg z listy jako tytuł egzekucyjny:**
```
Po zakończeniu / umorzeniu: wyciąg z zatwierdzonej listy (oznaczenie wierzytelności + suma
  otrzymana w postępowaniu) = TYTUŁ EGZEKUCYJNY przeciwko upadłemu (ust. 1; zastrzeżenie
  „art. 296” odsyła do przepisu uchylonego tytułu VI)
Upadły, który nie uznał wierzytelności i nie ma co do niej prawomocnego orzeczenia, może żądać
  ustalenia jej nieistnienia (w całości / części) (ust. 2)
Po nadaniu klauzuli — zarzut nieistnienia tylko w powództwie o pozbawienie tytułu
  wykonawczego wykonalności (ust. 3)
Nie dotyczy wierzycieli, wobec których upadły nie był dłużnikiem osobistym (ust. 4)
```
- **Art. 265:** częściowe umorzenie zobowiązań → wzmianka w wyciągu o zakresie odpowiedzialności; **całkowite umorzenie → art. 264 nie stosuje się** (brak tytułu) — umorzenie: art. 369–370f → `mod-PrUpad-zakonczenie-zakaz-karne`.
- **Art. 266:** wierzyciel może żądać zwrotu dokumentów; wydaje sekretarz sądowy na zarządzenie s.-k. z adnotacją o sumie uznania.

---

## TERMINY — ZESTAWIENIE

| Termin | Zdarzenie początkowe | Podstawa |
|---|---|---|
| 30 dni | obwieszczenie postanowienia o ogłoszeniu w KRZ — zgłoszenie wierzytelności | art. 51 ust. 1 pkt 4, 236 |
| wyznaczony przez syndyka | wpłata ryczałtu za spóźnione zgłoszenie | art. 235 ust. 2 |
| tydzień | doręczenie zarządzenia o zwrocie z uzasadnieniem — skarga | art. 242a ust. 4 |
| 3 dni | otrzymanie skargi — przekazanie przez syndyka | art. 242a ust. 5 |
| tydzień | wpływ skargi / uzupełnienie — rozpoznanie przez s.-k. | art. 242a ust. 6 |
| tydzień (nieprzywracalny) | wezwanie — dokumenty wierzyciela | art. 243 ust. 2 |
| 2 mies. | upływ terminu zgłoszeń — lista | art. 244 |
| 6% / 2 lata | dyskonto niewymagalnej wierzytelności bez odsetek | art. 247 ust. 1 |
| dzień ogłoszenia | kurs NBP, wartość niepieniężnej | art. 246, 251 |
| 2 tyg. | obwieszczenie o złożeniu listy — sprzeciw | art. 256 |
| ≥ tydzień | odpowiedź na sprzeciw | art. 258a ust. 1 |
| 2 mies. | wniesienie sprzeciwu — rozpoznanie | art. 259 ust. 1 |
| dzień po prawomocności | zakończenie / umorzenie — nowy bieg przedawnienia | art. 239a |

## PUŁAPKI

- Ryczałt za spóźnione zgłoszenie należy się także przy opóźnieniu niezawinionym (235 ust. 1).
- Pracowniczych nie zgłasza się; zabezpieczone rzeczowo trafiają na listę z urzędu (236–237).
- Termin tygodnia z art. 243 ust. 2 jest nieprzywracalny — wszystkie dowody w zgłoszeniu lub w tym terminie.
- Odsetki na liście kończą się na dniu poprzedzającym ogłoszenie (247 ust. 2); po upadłości zaspokojenie odsetek — art. 92 (`mod-PrUpad-skutki-masa-bezskutecznosc`).
- Cesja po zgłoszeniu wymaga podpisu urzędowo poświadczonego i zgłoszenia przed przekazaniem listy (254).
- Sprzeciw wierzyciela co do swojej wierzytelności przysługuje tylko przy odmowie uznania; co do cudzej — tylko wierzycielowi umieszczonemu na liście (256 ust. 1).
- Prekluzja: sprzeciw tylko na twierdzeniach ze zgłoszenia (258), sąd pomija spóźnione dowody (258a ust. 3).
- Wyciąg z listy nie jest tytułem przy całkowitym umorzeniu zobowiązań (265 ust. 2) ani wobec dłużnika rzeczowego (264 ust. 4).
- W trybie konsumenckim art. 244, 245 i 253–264 nie mają zastosowania (491² ust. 1).

## POWIĄZANIA

- Termin zgłoszeń i ogłoszenie → `mod-PrUpad-wniosek-ogloszenie`
- Potrącenie (oświadczenie przy zgłoszeniu, art. 96), odsetki z masy (art. 92), procesy (art. 145) → `mod-PrUpad-skutki-masa-bezskutecznosc`
- Wyjątki papierowe (216aa), doręczenia, zażalenie (222–224) → `mod-PrUpad-organy-procedura`
- Kategorie (art. 342) i plan podziału → `mod-PrUpad-podzial-335-360`
- Głosowanie nad układem (lista, sprzeciwy ≤ 15%) → `mod-PrUpad-uklad-likwidacja-zakonczenie`
- Umorzenie zobowiązań → `mod-PrUpad-zakonczenie-zakaz-karne`; konsument → `mod-PrUpad-konsument-workflow`

## WYNIK

Kompletne zgłoszenie (art. 240) z wyliczeniem kwoty (246–251) i kategorią; dla spóźnionego — ryczałt i skutki z art. 252; dla syndyka — lista z rubrykami art. 245 w terminie z art. 244; dla sprzeciwu — pismo z art. 257 w 2 tygodnie z kontrolą prekluzji (258); po zakończeniu — wniosek o wyciąg z listy (264) z uwzględnieniem umorzenia (265).
