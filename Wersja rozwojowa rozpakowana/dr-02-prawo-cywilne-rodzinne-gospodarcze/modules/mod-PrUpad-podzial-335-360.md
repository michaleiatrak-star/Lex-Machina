# PrUp — fundusze masy, kategorie i plan podziału

**Zakres:** art. 335–360, z powiązaniem do art. 230 i trybu konsumenckiego.
**Poziom B:** procedura operacyjna; pełne wyjątki odczytuj z jednostek źródłowych.
Import: `shared/MODULE-STANDARD-POLISH-LAW.md` (13 sekcji),
`mod-PrUpad-zrodla-i-wersje.md`, `shared/RATE-COMPLETENESS.md`.

✅ [VER] RZĄD 1, odczyt 2026-10-04: [PrUp 2026/913, s. 63–68,
art. 335–360](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf).
Mapy poniżej odnoszą się do tego źródła i wymagają fresh gate przed zastosowaniem.

## Dane wejściowe i wybór procedury

Zbierz: tryb postępowania, zatwierdzoną listę i nierozpoznane sprzeciwy,
wcześniejsze podziały, ceny sprzedaży i koszty każdego przedmiotu,
kwoty funduszów i zobowiązań masy, dokumenty zabezpieczeń i ich pierwszeństwa,
kwoty już zapłacone, aktualnych beneficjentów oraz warunki wierzytelności.
Powiąż każdą kwotę z dokumentem źródłowym, wyciągiem lub rozstrzygnięciem.

Konsument → najpierw `mod-PrUpad-konsument-workflow.md`. Wyłączenia z art. 491^2
oraz odesłanie z art. 491^15 ust. 7 oznaczają, że podział w planie spłaty nie jest
kopią całej procedury planu podziału z części pierwszej.

## 1. Wyodrębnij pieniądze i uprawnienia

| Jednostka | Kontrola |
|---|---|
| 335 | Ustal fundusze: likwidacja, dochody przedsiębiorstwa/dzierżawy, odsetki; uwzględnij wyjątki ustawy. |
| 336 | Wyodrębnij sumy z przedmiotów zabezpieczenia; nadwyżka wraca do funduszów. Osobno potraktuj przewłaszczenie na zabezpieczenie i pożytki. |
| 337 | Podział po zatwierdzeniu listy w całości/części; zabezpiecz kwoty objęte nierozpoznanymi sprzeciwami. |
| 338–339 | Relacja ostatecznego podziału do sum zabezpieczonych; obwieszczenie, zawiadomienia i legitymacja do zaskarżenia odrębnego planu. |
| 340 | Osobisty wierzyciel zabezpieczony uczestniczy w ogólnym podziale tylko w niezaspokojonej części; uwzględnij odpowiednio wypłatę ubezpieczenia. |
| 341 | Wierzyciele spadku przyjętego po upadłości: ograniczenie do wartości spadku i proporcjonalność. |

Nie sumuj po raz drugi należności zaspokojonej z zabezpieczenia, przez poręczyciela
lub ubezpieczyciela. Zachowaj historię redukcji salda i podstawę prawną każdej zmiany.

## 2. Koszty masy i kategorie to odrębne pytania

Najpierw kwalifikacja czasowa i podmiotowa, potem kategoria:

- **Art. 343–344:** koszty postępowania i pozostałe zobowiązania masy oraz
  alimenty w zakresie art. 343 ust. 2 mają własny porządek zaspokojenia.
- **Art. 342 ust. 1 pkt 1:** kategoria I obejmuje dokładnie katalog ustawowy,
  w tym określone należności pracownicze sprzed upadłości, należności rolników,
  alimenty/renty, składki społeczne za wskazany okres i określone finansowanie
  restrukturyzacyjne. Sprawdź wyłączenia osób zarządzających/nadzorujących.
- **Pkt 2:** kategoria II obejmuje inne należności, jeśli nie należą do pozostałych
  kategorii, w szczególności podatki i pozostałe składki społeczne.
- **Pkt 3:** kategoria III obejmuje wskazane odsetki od wyższych kategorii,
  grzywny sądowe i administracyjne oraz darowizny i zapisy.
- **Pkt 4 i ust. 5–6:** kategoria IV dotyczy określonego finansowania spółki
  kapitałowej przez wspólników/akcjonariuszy, z ustawowymi wyjątkami.
- **Ust. 3 i 7:** sprawdź FGŚP i szczególne kategorie domów maklerskich.

Nie klasyfikuj całego zgłoszenia jedną kategorią tylko dlatego, że ma jednego
wierzyciela. Kapitał, odsetki, koszty, zabezpieczenie i okresy mogą wymagać podziału.
Skrót „ZUS/US = II, reszta = III/IV” jest błędny.

**Art. 342a:** przy mieszkaniu/domu osoby fizycznej sprawdź wydzielenie kwoty
na potrzeby mieszkaniowe, przesłanki, wniosek, opinię syndyka i możliwą zaliczkę.
Nie wydzielaj jej automatycznie każdemu dłużnikowi.

## 3. Zabezpieczenia i proporcje

**Art. 345:** ustal sumę netto przedmiotu, koszty jego likwidacji i dopuszczalną
część innych kosztów. Limit dziesiątej części sumy nie znosi równoległego limitu
wynikającego ze stosunku wartości przedmiotu do całej masy. Ustal pierwszeństwo
zabezpieczeń oraz zakres świadczeń ubocznych objętych zabezpieczeniem.

**Art. 346:** przed wypłatą zabezpieczonemu sprawdź ustawowo uprzywilejowane
alimenty, renty i określone wynagrodzenia pracownicze. Uwzględnij przypadek,
w którym nie sporządza się odrębnego planu. Wskaźniki minimalnego wynagrodzenia
pobierz dla właściwego czasu; zapisuj źródło i zakres obowiązywania.

**Art. 344 ust. 2:** dalsza kategoria dopiero po pełnej spłacie wcześniejszej;
niedobór wewnątrz tej samej kategorii rozdziel proporcjonalnie. Obliczenia wykonaj
na groszach/Decimal, z jawną polityką rozdzielenia reszty zaokrągleń, bez zmiany
kolejności kategorii. Sprawdź sumę wypłat względem dostępnych środków.

## 4. Sporządzenie, kontrola i wykonanie

| Jednostka | Czynność |
|---|---|
| 347 | Syndyk sporządza plan: suma do podziału, uczestnicy i prawa, kwoty, wypłata/depozyt/rezerwa na sprzeciwy, plan częściowy lub ostateczny; sędzia-komisarz może wskazać poprawki. |
| 348 | Osobny plan sum z obciążonych rzeczy/praw; przy nieruchomości także prawa i roszczenia wygasłe. |
| 349 | Zawiadomienia i obwieszczenie; dwa tygodnie na zarzuty od obwieszczenia. Przy planie ostatecznym uwzględnij prawomocne wynagrodzenie ostateczne syndyka. |
| 350–351 | Rozpoznanie zarzutów, ewentualne wysłuchanie, zażalenie, sprostowanie i zatwierdzenie oraz obwieszczenia. |
| 352 | Wykonanie po zatwierdzeniu, ale nie przed prawomocnością upadłości; część niezaskarżona według zakresu określonego przez sędziego-komisarza. |
| 353 | Wypłata/przelew oraz sprawozdanie z wykonania. |
| 354 | Spłata osobistego wierzyciela zabezpieczonego przed sprzedażą: wstąpienie upadłego w prawa i podstawa wpisu. |
| 355 | Podział między wierzyciela i odpowiadającego poręczyciela/gwaranta/współdłużnika według aktualnych kwot. |
| 356 | Warunek rozwiązujący, zawieszający oraz niewymagalność mają różne reguły wypłaty/depozytu. |
| 357 | Uchylony. |
| 358 | Nieodebrana kwota przez miesiąc lub przeszkoda adresowa/brak rachunku: depozyt. Brak rachunku na etapie wypłaty nie zmienia wstecz dopuszczalności zgłoszenia z art. 240. |
| 359–360 | Właściwy organ depozytu, legitymacja, następstwo prawne i termin odbioru; po jego upływie ustawowy skutek na rzecz Skarbu Państwa. |

## Zarzuty, strategia i kontrola końcowa

Typowe zarzuty: zła kategoria, pominięta spłata, podwójna wypłata, błędna kolejność
hipotek, nadmierne koszty obciążające przedmiot, pominięta rezerwa lub depozyt.
Dla każdego wskaż dokument rozstrzygający i wpływ na kwoty pozostałych uczestników.
Przed proponowaniem korekty ustal, czy potrzebne jest sprostowanie, zarzut,
zażalenie czy zmiana wynikająca z nowego zdarzenia; sprawdź termin i etap.

Wynik: tabela funduszów → tabela wierzytelności/składników → kolejność i kwoty
→ rezerwy/depozyty → uzgodnienie arytmetyczne → źródła → projekt czynności.
Kontrola: suma wypłat + depozytów + rezerw nie przekracza środków, brak podwójnego
zaspokojenia, właściwy tryb, organ, obwieszczenie i prawomocność.

Powiązania: `mod-PrUpad-wierzytelnosci-235-266.md`,
`mod-PrUpad-syndyk-likwidacja.md`, `mod-PrUpad-konsument-workflow.md`,
`pisma-procesowe-v3`. Orzeczenia i opłaty sprawdza się osobno w źródłach.
