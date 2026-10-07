---
module: ustawa-ubezpieczenia-obowiazkowe-UFG-PBUK
version: "1.0"
verified_on: "2026-08-27"
coverage: "B — rdzeń operacyjny + mapa wszystkich 10 rozdziałów"
source_policy: "RZĄD 1 only"
---

# Ubezpieczenia obowiązkowe, UFG i PBUK — rdzeń operacyjny

## 1. Źródło i stan temporalny

**Akt:** ustawa z 22 maja 2003 r. o ubezpieczeniach obowiązkowych,
Ubezpieczeniowym Funduszu Gwarancyjnym i Polskim Biurze Ubezpieczycieli
Komunikacyjnych.

**Aktualny tekst jednolity zweryfikowany 27.08.2026:** Dz.U. 2026 poz. 783,
obwieszczenie Marszałka Sejmu z 29.05.2026, ogłoszone 15.06.2026.
Tekst uwzględnia stan prawny na 27.05.2026 i zmiany wskazane w obwieszczeniu;
część zmian ujętych w przypisach weszła w życie później w 2026 r.

- ELI: https://eli.gov.pl/eli/DU/2026/783/ogl {RZĄD: 1}
- tekst urzędowy PDF:
  https://eli.gov.pl/api/acts/DU/2026/783/text/I/D20260783.pdf {RZĄD: 1}

Wyszukiwanie ELI 27.08.2026 nie ujawniło nowszego tekstu jednolitego ani
odrębnej ustawy zmieniającej z 2026 r. po tym tekście. To nie zastępuje
ponownej kontroli temporalnej przy użyciu modułu.

**HARD GATE:** przed powołaniem przepisu ponownie odczytaj aktualny tekst
Rządu 1. Ten moduł jest mapą i rdzeniem analitycznym, nie źródłem prawa.

## 2. Mapa ustawy

| Rozdział | Zakres | Rdzeń w module |
|---|---|---|
| 1 | przepisy ogólne | TAK — art. 1–2, 14, 19 |
| 2 | OC posiadaczy pojazdów | TAK — art. 23, 34, 43 |
| 3 | OC rolników | TAK — art. 44 i routing |
| 4 | budynki rolnicze | TAK — art. 59–60 i routing |
| 5 | szkody za granicą | routing — art. 78 i n. |
| 6 | kontrola obowiązku i opłaty | TAK — art. 84 i dalsza weryfikacja kwot |
| 7 | UFG | TAK — art. 96, 98, 108–110 |
| 8 | PBUK | TAK — art. 120, 123, 125 |
| 9 | zmiany w przepisach | historyczne, art. 141–158 pominięte w t.j. |
| 10 | epizodyczne/przejściowe/końcowe | routing — art. 158a i n. |

Poziom B oznacza, że nie każdy przepis ustawy został opisany komentarzowo.
Przy sprawie spoza rdzenia wykonaj odczyt odpowiedniego rozdziału w ELI.

## 3. Intake — najpierw zakwalifikuj tor

Ustal:
1. rodzaj ubezpieczenia: OC pojazdu / OC rolnika / budynki rolnicze / inne;
2. datę zdarzenia i okres ochrony;
3. państwo rejestracji pojazdu i miejsce zdarzenia;
4. czy sprawca/posiadacz był ubezpieczony i czy zakład jest wypłacalny;
5. czy sprawca jest znany;
6. czy roszczenie kierowane jest do ubezpieczyciela, UFG czy PBUK;
7. datę zgłoszenia szkody i daty przekazania akt.

Brak którejkolwiek informacji istotnej dla toru = **NIEUSTALONE**, nie
uzupełniaj jej domniemaniem.

## 4. Zasady wspólne — art. 14 i 19

**Art. 14 ust. 1:** zakład ubezpieczeń wypłaca odszkodowanie co do zasady
w terminie 30 dni od zawiadomienia o szkodzie. Jeżeli w tym terminie nie da
się wyjaśnić okoliczności koniecznych do ustalenia odpowiedzialności lub
wysokości odszkodowania, art. 14 ust. 2 ustanawia dalszy mechanizm czasowy.
Przed wyliczeniem daty granicznej odczytaj pełne ust. 2–4; nie sprowadzaj
mechanizmu do hasła „90 dni” bez sprawdzenia wyjątków.

**Art. 19:** poszkodowany może dochodzić roszczenia bezpośrednio od zakładu
ubezpieczeń; ustawa przewiduje też actio directa wobec UFG w przypadkach
z art. 98 oraz wobec PBUK w przypadkach wskazanych w ustawie.

## 5. OC posiadaczy pojazdów — Rozdział 2

- art. 23: obowiązek zawarcia OC posiadaczy pojazdów mechanicznych;
- art. 34: zakres odszkodowania wiąże się z odpowiedzialnością posiadacza
  lub kierującego za szkodę wyrządzoną w związku z ruchem pojazdu;
- art. 43: regres szczególny zakładu/UFG — przed zastosowaniem odczytaj
  aktualny katalog przesłanek w całości; nie przepisuj go z pamięci.

Roszczenie odszkodowawcze oceniaj łącznie z KC (szkoda, związek przyczynowy,
zadośćuczynienie/renta) i aktualnym orzecznictwem. Ten moduł nie zastępuje
modułu KC ani analizy wysokości szkody.

## 6. Rolnicy i budynki rolnicze — Rozdziały 3–4

- art. 44: obowiązek zawarcia OC rolników z tytułu posiadania gospodarstwa;
- art. 59: obowiązek ubezpieczenia budynku wchodzącego w skład gospodarstwa
  rolnego od ognia i innych zdarzeń losowych;
- art. 60: obowiązek ubezpieczenia budynku powstaje z dniem pokrycia go dachem.

Przy sporze o definicję rolnika/gospodarstwa/budynku odczytaj art. 2 oraz
wskazane tam odesłania. Nie przenoś definicji z podatku rolnego lub KC bez
sprawdzenia definicji ustawowej.

## 7. Kontrola obowiązku i opłaty — Rozdział 6

Art. 84 rozdziela organy obowiązane/uprawnione do kontroli:
- dla OC pojazdów m.in. Policja, organy celne, Straż Graniczna, organy
  rejestrujące i ITD; UFG jest jednym z organów uprawnionych;
- dla OC rolników podstawową rolę ma właściwy wójt/burmistrz/prezydent,
  przy ustawowych uprawnieniach innych organów.

**Kwoty opłat za brak OC są zależne od aktualnych parametrów i okresu braku.**
Nie wpisuj ich z pamięci. Przed podaniem kwoty odczytaj aktualne art. 88 i n.,
rok odniesienia i podstawę obliczenia.

## 8. Ubezpieczeniowy Fundusz Gwarancyjny — Rozdział 7

- art. 96: UFG jest osobą prawną wykonującą zadania ustawowe; ustawa nadaje mu
  także właściwość w określonym zakresie egzekucji należności związanych
  z kontrolą obowiązkowego OC;
- art. 98: określa przypadki odpowiedzialności UFG. W każdej sprawie odczytaj
  właściwy ustęp/punkt — szczególnie rozróżnij sprawcę nieznanego, brak OC
  oraz niewypłacalność zakładu;
- art. 108: roszczenie do UFG w klasycznym torze zgłasza się za pośrednictwem
  zakładu ubezpieczeń wykonującego odpowiednią działalność; zakład nie może
  odmówić przyjęcia zgłoszenia;
- art. 109 ust. 1: dla roszczeń z art. 98 ust. 1–2 UFG ma co do zasady 30 dni
  od otrzymania akt szkody od zakładu albo syndyka; pozostałe warianty wymagają
  odczytu dalszych ustępów;
- art. 109a: przedawnienie roszczeń wskazanych w tym przepisie odsyła do KC;
- art. 110: po wypłacie w ustawowo wskazanych przypadkach powstaje regres UFG
  wobec sprawcy i osoby, która nie dopełniła obowiązku ubezpieczenia; odczytaj
  przesłanki konkretnego ustępu.

**Nie utożsamiaj:** regresu ubezpieczyciela z art. 43, regresu UFG z art. 110
i opłaty za brak OC z Rozdziału 6. To trzy różne mechanizmy.

## 9. PBUK — Rozdział 8 i szkody transgraniczne

- art. 120: PBUK jest osobą prawną wykonującą zadania ustawowe;
- art. 123: wyznacza odpowiedzialność Biura dla ustawowo określonych szkód
  związanych z ruchem pojazdów w sytuacjach transgranicznych;
- art. 125: przewiduje szczególne terminy wypłaty, m.in. 30 dni od ustalenia
  państwa rejestracji albo ważności Zielonej Karty w odpowiednich wariantach;
- art. 127 odsyła likwidację szkód z art. 123 do zasad art. 14.

Sprawa zagraniczna wymaga pełnego odczytu Rozdziału 5 i 8 oraz ustalenia
państwa rejestracji, miejsca zdarzenia, Zielonej Karty i reprezentanta.

## 10. Dowody i wynik analizy

Minimalny rejestr dowodowy:
- dokument pojazdu / dane gospodarstwa;
- polisa lub informacja o jej braku;
- zgłoszenie szkody i dowód daty;
- decyzje zakładu/UFG/PBUK;
- dokumentacja szkody i płatności;
- dane sprawcy i jego uprawnień, jeśli regres jest rozważany;
- dla toru międzynarodowego: rejestracja, państwo zdarzenia, Zielona Karta.

Raport powinien rozdzielić:
**PODMIOT ODPOWIEDZIALNY → PODSTAWA → TERMIN → ZAKRES SZKODY → REGRES/OPŁATA
→ DOWODY → BRAKI.**

## 11. Połączenia

- szkoda i wysokość roszczenia → mod-KC-ubezpieczenia.md +
  mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md;
- wypadki drogowe / odpowiedzialność wykroczeniowa/karna → DR-03;
- pisma → pisma-procesowe-v3;
- dowody → analizator-dowodow-v3;
- orzecznictwo → orzeczenia-sadowe-v2.

## 12. Ograniczenia pokrycia F-108

F-108 P1/41 uznaje ten moduł za **poziom B**, nie pełny komentarz do całej
ustawy. W szczególności wymagają odczytu źródła przy konkretnej sprawie:
pełna automatyczna prolongata/wypowiedzenie, dokładne sumy gwarancyjne,
kwoty opłat za brak OC, szczegóły likwidacji transgranicznej, niewypłacalność
zakładów oraz przepisy epizodyczne.

## 13. Quality gate

- [ ] świeżo odczytano ELI Dz.U. 2026 poz. 783 i sprawdzono późniejsze zmiany;
- [ ] ustalono właściwy tor: ubezpieczyciel / UFG / PBUK;
- [ ] każda data ma dokument źródłowy;
- [ ] nie pomylono art. 43, art. 110 i opłat Rozdziału 6;
- [ ] przy torze międzynarodowym odczytano Rozdziały 5 i 8;
- [ ] kwoty i terminy zależne od wariantu nie pochodzą z pamięci;
- [ ] wykonano router SELF-CHECK i końcowy disclaimer.
