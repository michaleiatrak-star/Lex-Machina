# Restrukturyzacja — przepisy wspólne o postępowaniu, zakończenie, umorzenie, uproszczone wnioski (PrRestr art. 189–209, 324–337)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony; uchylone oznaczone)
**Źródło:** Prawo restrukturyzacyjne — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533; akt bazowy DU/2015/978), s. 49–54 i 79–81
**Weryfikacja:** snapshot PDF 04.10.2026 (SHA-256 zgodny z `references/prrestr/metadata.json`); status t.j. „obowiązuje” potwierdzony w ELI 08.10.2026 ✅ [VER: isap_lookup DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j. w tym zakresie:** brak (późniejsze nowelizacje dotyczą art. 4 i 156 → `references/insolvency/wersje-i-przepisy-przejsciowe.md`). Art. 209 ust. 1 ze zmianą z DU/2025/1172 (odnośnik 51 t.j.) — ujęty w t.j.
**ZASADA:** przed powołaniem odczytaj przepis: `python3 scripts/prrestr.py article 201 --verify-online`. Zażalenie przysługuje **tylko gdy ustawa tak stanowi** (200 ust. 1); termin **tydzień** (201 ust. 1), wyjątkowo dwa tygodnie przy umorzeniu (327 ust. 3). Brak skargi kasacyjnej i wznowienia (202).

---

## FAZA 0 — INTAKE

```
□ Dzień otwarcia (189): data postanowienia (PPU, PU, sanacja); w PZU skutki od dnia układowego
□ Wcześniejsze niezakończone postępowanie restrukturyzacyjne? → kolejne niedopuszczalne (191), wyjątek: układy częściowe z różnymi wierzycielami
□ Kanał pism: wyłącznie system teleinformatyczny (196a) — wyjątki: pracownicy, alimenty, renty (196b); informacje niejawne i oferty przetargowe (196c)
□ Doręczenia: przez system; pierwsze doręczenie osobie bez pisma w sprawie — tradycyjnie; brak konta → pozostawienie w aktach ze skutkiem doręczenia (198)
□ Termin zaskarżenia: od zamieszczenia w systemie / obwieszczenia / doręczenia / doręczenia z uzasadnieniem (201)
□ Sąd II instancji: inny skład sądu restrukturyzacyjnego albo 3 sędziów (katalog 200 ust. 1a)
□ Pomoc publiczna w propozycjach → opinia organu w 2 tyg., zmienione propozycje w tydzień pod rygorem umorzenia (204–205)
□ Podstawy umorzenia: obligatoryjne (325 ust. 1, 326), fakultatywne (325 ust. 2–3); opóźnienie > 30 dni w zobowiązaniach bieżących = domniemanie utraty zdolności (326 ust. 2)
□ Po umorzeniu / odmowie: uproszczony wniosek sanacyjny (328) albo upadłościowy (334) — terminy zażaleniowe
□ Wydanie majątku i dokumentów przez zarządcę (330–332); wstąpienie do spraw pauliańskich w 30 dni (333)
```

---

## MAPA ARTYKUŁÓW

| Zakres | Treść | Sekcja |
|---|---|---|
| 189–193 | dzień otwarcia, łączenie organów (spółki cywilne, osobowe, powiązane), zakaz kolejnego postępowania, układ częściowy w sanacji, współpraca | A |
| 194–196 | posiedzenia niejawne, dowody, zakaz opinii biegłego | B |
| 196a–199 | system teleinformatyczny, wyjątki, orzeczenia, doręczenia, obwieszczenia | B |
| 200–203 | zażalenie, terminy, brak nadzwyczajnych środków, klauzula odpowiedzialności karnej | C |
| 204–206 | opinia organu pomocy publicznej, zmienione propozycje i plan, dostęp do akt, skutek obwieszczenia | C |
| 207–209 | koszty, odesłanie do KPC | C |
| 324–327 | zakończenie, umorzenie obligatoryjne i fakultatywne, zażalenie | D |
| 328–333 | uproszczony wniosek sanacyjny, odzyskanie zarządu, wydanie majątku, przechowanie dokumentów, likwidacja, wstąpienie do procesów | D |
| 334–337 | uproszczony wniosek o ogłoszenie upadłości | E |
| uchylone | brak całych artykułów (uchylone 190 ust. 2–4, 203 ust. 2–3) | — |

---

## A. Otwarcie, łączenie, zakaz kolejnego postępowania (art. 189–193)

- **Art. 189:** dzień **wydania postanowienia** o otwarciu PPU, PU lub sanacji = **dzień otwarcia** (ust. 1); w **PZU** skutki otwarcia powstają z **dniem układowym** (art. 211) (ust. 2).
- **Art. 190:** wspólnicy **spółki cywilnej** i ich małżonkowie — sąd późniejszy wyznacza **tego samego sędziego-komisarza i nadzorcę/zarządcę**, chyba że nieuzasadnione; w różnych sądach — art. 17 (ust. 1); odpowiednio **osobowa spółka handlowa** i jej wspólnicy nieograniczenie odpowiedzialni oraz inni dłużnicy, zwłaszcza **powiązani**, jeżeli sąd uzna za uzasadnione (ust. 5); ust. 2–4 uchylone.
- **Art. 191:** **kolejne postępowanie restrukturyzacyjne niedopuszczalne**, dopóki wcześniejsze nie zostało zakończone lub prawomocnie umorzone (ust. 1); wyjątek — **układy częściowe** obejmujące różnych wierzycieli; wtedy w PZU ten sam nadzorca układu, w PPU te same osoby jako nadzorca i sędzia-komisarz, chyba że przeszkody (ust. 2).
- **Art. 192:** w toku **sanacji** dopuszczalny wniosek o zatwierdzenie **układu częściowego** lub PPU z układem częściowym — dla wierzycieli **nieobjętych układem z mocy prawa**, którzy **nie zgodzili się** na objęcie w sanacji (ust. 1); w PPU funkcje pełnią sędzia-komisarz i zarządca z sanacji (ust. 2); układ częściowy nie wpływa na tok sanacji i może być skuteczny po zatwierdzeniu układu sanacyjnego (ust. 3).
- **Art. 193:** organy postępowań restrukturyzacyjnych **współpracują**.

## B. Posiedzenia, dowody, system, doręczenia (art. 194–199)

- **Art. 194:** posiedzenia **niejawne**, chyba że ustawa inaczej (ust. 1); dowody także na posiedzeniu niejawnym (ust. 2); przesłuchanie dłużnika, nadzorcy, zarządcy, wierzyciela, członka rady lub innych osób albo **oświadczenia na piśmie** stanowiące dowód (ust. 3), z możliwym wymogiem **notarialnego poświadczenia podpisu** (ust. 4); nieobecność lub brak oświadczenia nie wstrzymuje postępowania (ust. 5).
- **Art. 195:** nadzorca/zarządca wnosi o przeprowadzenie dowodu; prowadzi je sędzia-komisarz.
- **Art. 196:** **zakaz dowodu z opinii biegłego**, z wyjątkiem art. 93 ust. 1 (sprzeciw do spisu).
- **Art. 196a:** pisma i dokumenty **wyłącznie przez system teleinformatyczny** na formularzach; pismo poza systemem **nie wywołuje skutków** (z pouczeniem, poza organami) (ust. 1); podpis kwalifikowany, zaufany, osobisty lub uwierzytelnienie w systemie (ust. 2); załączniki elektroniczne (ust. 3); dokumenty papierowe — **odpisy poświadczone elektronicznie** albo **kopie elektroniczne** (ust. 4); poświadczać może też **doradca restrukturyzacyjny** będący uczestnikiem, organem lub pełnomocnikiem, a protokoły i uchwały rady — przewodniczący rady (ust. 5); przy kopii — **oryginał lub odpis poświadczony do sądu w 3 dni** bez wezwania (art. 130 § 2 KPC) (ust. 6); dane wnoszącego, NIP (ust. 7–8); telefon i e-mail fakultatywnie (ust. 9).
- **Art. 196b:** **pracownicy** (bez reprezentantów i zarządzających), wierzyciele **alimentacyjni** i **rentowi** mogą wnosić pisma **poza systemem** (ust. 1), także **ustnie w biurze podawczym każdego sądu rejonowego** (ust. 2) — pracownik biura wprowadza treść do systemu, drukuje do podpisu i podpisuje elektronicznie (ust. 3); art. 196a ust. 3, 4, 6–9 odpowiednio (ust. 4); przy piśmie przez system — art. 130 § 6 KPC (ust. 5).
- **Art. 196c:** poza systemem: pisma z **informacjami niejawnymi** oraz **oferty w przetargu lub aukcji**.
- **Art. 196d:** rozporządzenie MS o wnoszeniu pism.
- **Art. 197:** orzeczenia — **postanowienia**; niejawne zaskarżalne — **uzasadnienie z urzędu** i doręczenie z uzasadnieniem; tak samo zarządzenia (ust. 1); utrwalane **wyłącznie w systemie** z podpisem kwalifikowanym (ust. 1a); numer składnika masy ze spisu (ust. 2) i liczba porządkowa wierzytelności; **aktualny stan wierzytelności** (ust. 2a); pouczenie o środku zaskarżenia w systemie (ust. 3); dostęp do akt przez system (ust. 4); ust. 2–2a do uchwał rady i zgromadzenia (ust. 5); informacja o prawomocności — sekretariat; obwieszczenie prawomocności — organ orzekający (ust. 6).
- **Art. 198:** postanowienie niejawne doręcza się **dłużnikowi, osobom, których dotyczy, i nadzorcy/zarządcy**; postanowień dotyczących **ogółu wierzycieli** nie doręcza się wierzycielom (ust. 1); doręczenia **przez system** (art. 131¹ § 2 KPC) (ust. 2) — nie dotyczy osób z 196b (ust. 3), które mogą wybrać doręczenie elektroniczne (ust. 4); **pierwsze doręczenie** osobie, która nie wniosła pisma — tradycyjne (poza organami) (ust. 5); brak **konta w systemie** → pismo **pozostaje w aktach ze skutkiem doręczenia**, z pouczeniem przy pierwszym doręczeniu (ust. 6); rozporządzenie (ust. 7).
- **Art. 199:** obwieszczenia w **Rejestrze** (KRZ); przy terminie zaskarżenia — z informacją o sposobie i terminie (ust. 1); dodatkowo inny sposób na wniosek organu lub z urzędu (ust. 2) albo na koszt dłużnika/wierzyciela (ust. 3); **jawność** danych obwieszczanych (ust. 4).

## C. Zaskarżanie, pomoc publiczna, akta, koszty (art. 200–209)

- **Art. 200:** zażalenie **tylko w przypadkach wskazanych w ustawie**; na sędziego-komisarza — do sądu restrukturyzacyjnego jako II instancji (ust. 1); na postanowienia sądu restrukturyzacyjnego — **ten sam sąd w innym składzie**, z wyjątkiem katalogu rozpoznawanego przez **sąd II instancji w składzie 3 sędziów**: art. 30 ust. 5, 33 ust. 3, 45 ust. 2, 56 ust. 5, 59 ust. 8, 61 ust. 7, 133 ust. 2, 165 ust. 7, 172 ust. 1, 173 ust. 4–5, 176 ust. 4–5, 182 ust. 4, 226f, 236 ust. 1, 237 ust. 1, 239 ust. 2, 268 ust. 4, 286 ust. 1a, 327 ust. 1–2, 331 ust. 4, 332 ust. 3 (ust. 1a); doręczenia odpisów zażalenia (ust. 2–4), bez doręczania wierzycielom przy postanowieniach dotyczących ogółu (ust. 5); rozpoznanie w **30 dni** od przedstawienia akt (ust. 6).
- **Art. 201:** termin od **zamieszczenia w systemie** postanowienia niejawnego; **zażalenie w tydzień** (ust. 1); przy obwieszczeniu — od **obwieszczenia** (ust. 2); dla adresatów obowiązkowego doręczenia — od **doręczenia** (ust. 3); postanowienie ogłoszone na posiedzeniu jawnym — **wniosek o uzasadnienie w tydzień** (od posiedzenia, zamieszczenia lub obwieszczenia), termin od doręczenia z uzasadnieniem (ust. 4); zaskarżenie czynności rady, nadzorcy, zarządcy — od zamieszczenia **pouczenia** przez sędziego-komisarza lub referendarza (ust. 5).
- **Art. 202:** **nie przysługują**: skarga kasacyjna, skarga o wznowienie, skarga o stwierdzenie niezgodności z prawem prawomocnego orzeczenia.
- **Art. 203:** oświadczenie dłużnika o prawdziwości i zupełności zawiera klauzulę **„Jestem świadomy odpowiedzialności karnej za złożenie fałszywego oświadczenia.”** (ust. 1; ust. 2–3 uchylone).
- **Art. 204:** przy **pomocy publicznej** w propozycjach organ udzielający pomocy zawiadamia sędziego-komisarza w **2 tygodnie** od doręczenia planu i testu prywatnego wierzyciela/inwestora, składając **opinię** z odpisami (ust. 1); dłużnik może złożyć **zmienione propozycje w tydzień** od doręczenia opinii **pod rygorem umorzenia** (ust. 2).
- **Art. 205:** nadzorca/zarządca składa **zmieniony plan w tydzień** od zmienionych propozycji; art. 140 i 204 odpowiednio; **kolejna zmiana niedopuszczalna**.
- **Art. 206:** dostęp do akt w sekretariacie przez system dla uczestników i osób z usprawiedliwioną potrzebą (ust. 1); **samodzielne wydruki** z systemu mają moc **urzędowo poświadczonych odpisów**, jeżeli weryfikowalne (ust. 2); od obwieszczenia w Rejestrze **nie można powoływać się na nieznajomość** jego treści, chyba że mimo należytej staranności (ust. 3).
- **Art. 207:** koszty = **opłaty i wydatki**.
- **Art. 208:** koszty ponosi **dłużnik**; zarządca uiszcza je za dłużnika pozbawionego zarządu na wezwanie (ust. 1); uczestnik ponosi koszty własnego udziału (ust. 2); koszty sprzeciwu skutecznie kwestionującego cudzą wierzytelność — od dłużnika na rzecz wierzyciela, chyba że dłużnik kwestionował ją w oświadczeniu z art. 86 ust. 5 lub sam złożył sprzeciw (ust. 3).
- **Art. 209:** odpowiednio **księga pierwsza części pierwszej KPC**, z wyjątkiem art. 130², 139¹, 205¹, 205², 205⁴–205¹², przepisów o **zawieszeniu i wznowieniu** oraz o **postępowaniu gospodarczym** (ust. 1); pouczenia na wzorach z systemu (ust. 2).

## D. Zakończenie i umorzenie (art. 324–333)

- **Art. 324:** postępowanie **kończy się** z uprawomocnieniem postanowienia o **zatwierdzeniu** albo **odmowie zatwierdzenia** układu (ust. 1); obwieszczenie (ust. 2).
- **Art. 325:** **umorzenie obligatoryjne**: postępowanie zmierza do **pokrzywdzenia wierzycieli** (pkt 1); wniosek dłużnika **za zezwoleniem rady wierzycieli** (pkt 2); układ **nieprzyjęty** (pkt 3); prawomocne **ogłoszenie upadłości** (pkt 4) (ust. 1). **Fakultatywne**: z okoliczności, zwłaszcza zachowania dłużnika, wynika, że **układ nie zostanie wykonany** (ust. 2); dłużnik **nie wykonuje poleceń** sędziego-komisarza i zezwoliła rada (ust. 3).
- **Art. 326:** **PPU** — umorzenie, gdy sporne uprawniające do głosu **> 15%**, z uwzględnieniem art. 165 ust. 3–4 (ust. 1); **PU i sanacja** — gdy dłużnik utracił **zdolność do bieżącego zaspokajania kosztów** postępowania, **zobowiązań po otwarciu** i zobowiązań, które **nie mogą być objęte układem**; **domniemanie** przy opóźnieniu **> 30 dni** (ust. 2); **sanacja** — brak **realnych możliwości** przywrócenia zdolności (ust. 3).
- **Art. 327:** zażalenie na **umorzenie** (ust. 1); na **oddalenie wniosku o umorzenie** — tylko **wnioskodawca** (ust. 2); termin **2 tygodnie** (ust. 3); obwieszczenia umorzenia, postanowienia II instancji i prawomocności (ust. 4).
- **Art. 328:** przy umorzeniu **PPU lub PU** z art. 325 ust. 1 pkt 2 lub 3 albo 204 ust. 2 dłużnik może złożyć **uproszczony wniosek sanacyjny** — wraz z wnioskiem o umorzenie, w **tydzień** od zgromadzenia bez przyjęcia układu albo w terminie zażalenia na odmowę zatwierdzenia lub umorzenie (ust. 1); wystarczą wymogi pisma i **żądanie otwarcia**; bez art. 284 (ust. 2).
- **Art. 329:** z zakończeniem lub prawomocnym umorzeniem dłużnik **odzyskuje zarząd**, chyba że układ inaczej (ust. 1); przy **uproszczonym wniosku** — dopiero z prawomocnym oddaleniem, odrzuceniem lub umorzeniem postępowania o otwarcie sanacji / ogłoszenie upadłości (ust. 2).
- **Art. 330:** zarządca (z uwzględnieniem art. 27 ust. 2) po prawomocnym umorzeniu lub odmowie zatwierdzenia **wydaje** majątek, księgi, korespondencję, dokumenty; w razie potrzeby sąd nakazuje **przymusowe odebranie** (ust. 1) — postanowienie ma moc **tytułu wykonawczego** (ust. 2); odpowiednio po zatwierdzeniu układu, chyba że układ inaczej (ust. 3).
- **Art. 331:** nieodebrane księgi i dokumenty — **przechowanie na koszt dłużnika**, z możliwym wstrzymaniem wydania majątku na koszty (ust. 1); koszty z funduszów masy, przy braku — likwidacja majątku za zgodą sądu (ust. 2); brak majątku — zasądzenie od dłużnika, a przy osobie prawnej / spółce osobowej — od **osób uprawnionych do reprezentacji** (ust. 3); zażalenie dłużnika, zobowiązanego i przechowawcy (ust. 4); niemożność przechowania — **archiwum**; dokumentacja osobowa i płacowa — art. 51u ust. 3 ustawy o narodowym zasobie archiwalnym; ściąganie jak opłat sądowych (ust. 5).
- **Art. 332:** nieodebrany majątek — sąd zarządza **likwidację** i jej sposób (ust. 1); gdy niemożliwa — przekazanie na **cele dobroczynne** lub inaczej na koszt dłużnika (ust. 2); zażalenie (ust. 3).
- **Art. 333:** po umorzeniu **sanacji** wierzyciel może w **30 dni** od postanowienia **wstąpić w miejsce zarządcy** do spraw o uznanie czynności za **bezskuteczną** — skuteczne pod warunkiem prawomocności umorzenia (ust. 1); w innych sprawach wstępuje **dłużnik** (ust. 2).

## E. Uproszczony wniosek o ogłoszenie upadłości (art. 334–337)

- **Art. 334:** osoba uprawniona do wniosku o upadłość według PrUp może złożyć **uproszczony wniosek** w terminie **zażalenia** na umorzenie lub odmowę zatwierdzenia (ust. 1); wymogi pisma + **żądanie ogłoszenia upadłości**; **bez art. 22–25 PrUp** (ust. 2); pouczenie w obwieszczeniu (ust. 3).
- **Art. 335:** rozpoznanie **wstrzymuje się** do rozpoznania zażalenia na umorzenie / odmowę.
- **Art. 336:** mimo działania nadzorcy/zarządcy sąd może zastosować **inne zabezpieczenia** według PrUp.
- **Art. 337:** rozpoznaje **sąd upadłościowy** według PrUp.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| 3 dni | złożenie oryginału przy kopii elektronicznej | art. 196a ust. 6 |
| 30 dni | rozpoznanie zażalenia przez sąd II instancji | art. 200 ust. 6 |
| tydzień | zażalenie; wniosek o uzasadnienie | art. 201 ust. 1, 4 |
| 2 tygodnie / tydzień / tydzień | opinia organu pomocy; zmienione propozycje; zmieniony plan | art. 204–205 |
| > 15% | umorzenie PPU | art. 326 ust. 1 |
| > 30 dni opóźnienia | domniemanie utraty zdolności (PU, sanacja) | art. 326 ust. 2 |
| 2 tygodnie | zażalenie na umorzenie | art. 327 ust. 3 |
| tydzień od zgromadzenia | uproszczony wniosek sanacyjny | art. 328 ust. 1 |
| 30 dni od umorzenia sanacji | wstąpienie wierzyciela do sprawy o bezskuteczność | art. 333 ust. 1 |
| termin zażalenia | uproszczony wniosek o upadłość | art. 334 ust. 1 |

## PUŁAPKI

- Pismo złożone poza systemem nie wywołuje skutków (196a ust. 1) — z wyjątkiem uprzywilejowanych wierzycieli z 196b i dokumentów z 196c.
- Brak konta w systemie = doręczenie przez pozostawienie w aktach (198 ust. 6); pierwsze doręczenie osobie bez pisma — tradycyjne (198 ust. 5).
- Termin zaskarżenia biegnie od zamieszczenia w systemie albo obwieszczenia — nie od faktycznego zapoznania się (201); od obwieszczenia nie ma obrony nieznajomością (206 ust. 3).
- Brak opinii biegłego w postępowaniu restrukturyzacyjnym — poza sprzeciwem do spisu (196).
- Brak skargi kasacyjnej i wznowienia (202) oraz przepisów KPC o zawieszeniu (209 ust. 1).
- Kolejne postępowanie restrukturyzacyjne przed zakończeniem poprzedniego jest niedopuszczalne (191).
- Umorzenie na wniosek dłużnika wymaga zezwolenia rady (325 ust. 1 pkt 2) — bez niego wniosek nie wystarcza.
- Oddalenie wniosku o umorzenie skarży tylko wnioskodawca (327 ust. 2); termin zażalenia na umorzenie — 2 tygodnie (nie tydzień).
- Uproszczony wniosek odsuwa odzyskanie zarządu przez dłużnika (329 ust. 2).
- Wstąpienie do sprawy pauliańskiej po umorzeniu sanacji — tylko w 30 dni (333).

## POWIĄZANIA

- Dzień układowy (art. 211), PZU → `mod-PrRestr-pzu`; PPU/PU → `mod-PrRestr-ppu-pu`; sanacja (art. 284, 306) → `mod-PrRestr-sanacja`
- Sprzeciw (art. 93), oświadczenie dłużnika (art. 86 ust. 5), rada wierzycieli → `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`
- Zarządca, art. 27 ust. 2, wynagrodzenia (katalog 200 ust. 1a) → `mod-PrRestr-dzial-III-nadzorca-zarzadca`
- Pomoc publiczna, test prywatnego wierzyciela (art. 140) → `mod-PrRestr-dzial-V-pomoc-publiczna`
- Układ, art. 165, 172–176 → `mod-PrRestr-dzial-VI-uklad`; układ częściowy, art. 182 → `mod-PrRestr-dzial-VII-uklad-czesciowy`
- Wniosek o upadłość, art. 22–25 PrUp, zabezpieczenie → `mod-PrUpad-wniosek-ogloszenie`

## WYNIK

Ustalenie dnia otwarcia i organów (189–192) → kanał pism i doręczeń (196a–199) → mapa środków zaskarżenia: przepis szczególny, uprawniony, skład, termin, zdarzenie początkowe (200–202) → koszty (207–208) → ocena podstaw umorzenia (325–326) z zażaleniem w 2 tygodnie (327) → ścieżka wyjścia: uproszczony wniosek sanacyjny (328) lub upadłościowy (334–337) → rozliczenie zarządcy: zwrot zarządu, wydanie majątku i dokumentów, przechowanie, likwidacja, wstąpienie do procesów (329–333).
