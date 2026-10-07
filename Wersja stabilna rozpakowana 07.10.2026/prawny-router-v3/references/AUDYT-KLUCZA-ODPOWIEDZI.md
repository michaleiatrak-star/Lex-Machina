# AUDYT KLUCZA ODPOWIEDZI — protokół jednostka po jednostce

## Cel i trigger

Wczytaj ten plik zawsze, gdy zadanie polega na porównaniu odpowiedzi z kluczem,
opinią, notatkami, cudzą analizą, pismem przeciwnika, wynikiem innego modelu
albo wcześniejszą odpowiedzią własną.

Klucz jest **materiałem audytowanym**, nie źródłem prawa. Nie wolno uznać jego
treści za poprawną dlatego, że jest nazwana „kluczem", pochodzi od wykładowcy
albo zgadza się z wcześniejszą analizą.

## K0 — ustaw role

- `MATERIAŁ`: tekst podlegający sprawdzeniu;
- `ŹRÓDŁO PRAWA`: aktualny lub historyczny akt właściwy dla daty zdarzenia,
  oficjalna metryka, urzędowa baza orzeczeń albo dopuszczony fallback HARD GATE;
- `WERDYKT`: wynik konfrontacji materiału ze źródłem, nigdy odwrotnie.

Jeżeli porównywana jest wcześniejsza odpowiedź modelu z kluczem, **oba teksty**
są materiałem. Żaden nie staje się źródłem tylko dlatego, że powstał wcześniej.

## K1 — inwentarz twierdzeń

Wyodrębnij wszystkie twierdzenia prawne z obu porównywanych tekstów. Jednostką
jest najmniejszy element mogący być samodzielnie prawdziwy albo fałszywy:

- artykuł wraz z §/ust./pkt/lit.;
- zakres podmiotowy, przedmiotowy, czasowy lub proceduralny przepisu;
- przesłanka, wyjątek, skutek prawny lub właściwość organu;
- kwota, próg, stawka, promil, termin albo granica sankcji;
- data obowiązywania, wejścia w życie, uchylenia lub tekstu jednolitego;
- sygnatura wraz z sądem, datą i przypisaną tezą.

Jedno zdanie może tworzyć kilka jednostek. Nie łącz ich tylko dlatego, że
materiał umieścił je w jednym punkcie.

## K2 — rejestr pokrycia

Przed weryfikacją utwórz rejestr:

| ID | Twierdzenie materiału | Jednostka do sprawdzenia | Źródło i data odczytu | Wynik | Korekta |
|---|---|---|---|---|---|
| K-001 | … | … | ⬛ | ⬛ | — |

Liczba `N` to liczba wierszy po atomizacji, nie liczba akapitów ani artykułów.
Każdy wiersz otrzymuje jeden z trzech wyników:

- `POTWIERDZONE` — źródło potwierdza dokładnie tę jednostkę;
- `OBALONE` — źródło wykazuje błąd, nieaktualność albo niewłaściwy zakres;
- `NIEROZSTRZYGNIĘTE` — dostępne źródła nie pozwalają zamknąć HARD GATE.

## K3 — HARD GATE osobno dla każdej jednostki

1. Dla każdego wiersza wykonaj świeżą weryfikację właściwą dla jurysdykcji.
2. Odczyt skilla lub zgodność dwóch materiałów nie jest weryfikacją prawa.
3. Jeżeli przepis zmieniał się w czasie, ustal wersję właściwą dla daty stanu
   faktycznego oraz wersję aktualną; nie mieszaj ich w jednym wyniku.
4. Jeżeli źródła są rozbieżne, nie wybieraj większości. Ustal nowelizację,
   zakres albo oznacz wynik jako `NIEROZSTRZYGNIĘTE`.
5. Weryfikacja artykułu bez właściwego paragrafu, wyjątku lub wartości liczbowej
   nie zamyka wiersza dotyczącego tej jednostki.

## K4 — porównanie merytoryczne

Po weryfikacji prawa oceń osobno:

- poprawność podstawy prawnej;
- poprawność przytoczonego brzmienia i zakresu;
- poprawność zastosowania przepisu do faktów;
- kompletność odpowiedzi względem pytania;
- błędy zbędne: trafna konkluzja oparta na błędnym przepisie nadal zawiera błąd.

Nie zamieniaj oceny toku rozumowania w potwierdzenie treści przepisu.

## K5 — werdykt globalny

Dozwolone są wyłącznie cztery werdykty:

- `PEŁNA ZGODNOŚĆ — N/N` — wszystkie jednostki potwierdzone, zero obalonych,
  zero nierozstrzygniętych;
- `ZGODNOŚĆ CZĘŚCIOWA — P/N` — co najmniej jedna jednostka potwierdzona i co
  najmniej jedna obalona albo nierozstrzygnięta;
- `BRAK ZGODNOŚCI — O/N` — zasadnicze jednostki są obalone;
- `NIEROZSTRZYGNIĘTE — U/N` — źródła nie pozwalają na rzetelny werdykt.

⛔ Zakaz: „pełna zgodność", „wszystko się zgadza", „klucz jest poprawny" albo
równoważny PASS bez pokazania `N/N`, źródła przy każdym wierszu oraz wartości
`obalone=0`, `nierozstrzygnięte=0`.

## K6 — minimalne wyjście

Odpowiedź porównawcza musi zawierać:

1. licznik: `zinwentaryzowano N; potwierdzone P; obalone O; nierozstrzygnięte U`;
2. tabelę rejestru albo jej kompletny odpowiednik;
3. korektę każdej pozycji `OBALONE`;
4. jawną listę pozycji `NIEROZSTRZYGNIĘTE` i brakującego źródła;
5. jeden werdykt z K5.

Przed wysłaniem sprawdź rachunek: `P + O + U = N`. Nierówność oznacza pominiętą
jednostkę i blokuje odpowiedź.
