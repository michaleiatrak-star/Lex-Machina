# Metodologia oceny — benchmark 2026-09-08

## Zasada naczelna

**Klucz autorski jest jedynym miernikiem.** Oceniana jest zgodność odpowiedzi z kluczem,
a nie zgodność z prawem obowiązującym. Tam, gdzie odpowiedź jest lepsza prawniczo niż
klucz, a od klucza odbiega — punkty spadają. Klucza nie podważano w żadnym punkcie.

Klucz sam dopuszcza odmienną konkluzję przy pełnej punktacji, jeżeli jest „konsekwentnie
uzasadniona" (Klucz, „Jak czytać klucz"). Ta furtka była stosowana: karana jest niezgodność
z **mapą zagadnień i rubryką**, nie z kierunkiem rozstrzygnięcia.

## Skąd wagi

Klucz zawiera dla każdego z 14 kazusów własną **rubrykę oceniania**: 6 obszarów z wagami
sumującymi się do 100. Wagi są różne dla różnych kazusów (np. K-01: Arbitraż i egzekucja 20,
Środki i konstrukcja opinii 10; PL-03: Wierzyciele i upadłość 20, Governance 10). Benchmark
nie tworzy własnych kryteriów — używa tych sześciu obszarów i tych wag.

## Procedura per kazus per przebieg

1. Każdy z 6 obszarów rubryki oceniany w skali 0–10 przez porównanie z czterema warstwami
   klucza dla danego kazusu: tezą roboczą, mapą zagadnień, najsilniejszymi argumentami
   strony A i strony B.
2. Wynik surowy = średnia ważona wagami autora, dzielona przez 10.
3. **Kara** do −1,0 za popełnienie któregoś z sześciu „Błędów wspólnych" wymienionych
   w kluczu (m.in. „przypisanie spółki państwu wyłącznie na podstawie własności",
   „automatyczne uznanie technologii lub cyberataku za siłę wyższą", „traktowanie wszczęcia
   postępowania jak ostatecznej decyzji").
4. **Premia** do +0,5 za „Punkty premiowane" z klucza: jawne oddzielenie prawa obowiązującego
   od de lege ferenda i soft law, rozstrzygnięcie wariantowe zależne od brakującego faktu,
   propozycja środka tymczasowego lub sekwencji postępowań, identyfikacja ryzyka dowodowego
   i ciężaru dowodu.
5. Zaokrąglenie do 0,5.

## Kalibracja skali

Skala 0–10 jest liniowym odwzorowaniem skali ogólnej z klucza:

| Klucz (0–100) | Benchmark (0–10) | Opis z klucza |
|---|---|---|
| 90–100 | 9,0–10,0 | analiza kompletna, hierarchiczna, adversarialna i operacyjna |
| 75–89 | 7,5–8,9 | analiza bardzo dobra, drobne luki w kompetencjach, dowodach lub środkach |
| 60–74 | 6,0–7,4 | poprawne rozpoznanie głównych problemów, nierówna analiza przesłanek |
| 40–59 | 4,0–5,9 | częściowy issue spotting, wnioski przeważają nad analizą |
| 0–39 | 0,0–3,9 | pominięcie reżimów podstawowych, dopowiadanie faktów, brak argumentu przeciwnego |

**Nota 10,0 nie została przyznana nigdzie.** Rezerwowano ją dla odpowiedzi bez ani jednej
zidentyfikowanej luki wobec klucza; każdy przebieg ma co najmniej jedną oś zadeklarowaną
jako niepełną albo co najmniej jedno powołanie bez kotwicy urzędowej.

## Materiał

| Element | Plik |
|---|---|
| Bank kazusów (14) | `materialy/Baza_kazusow_wieloaspektowych.docx` |
| Klucz autorski | `materialy/Klucz_odpowiedzi_kazusy_wieloaspektowe.docx` |
| Arkusze odpowiedzi (7 przebiegów) | `odpowiedzi/01-…` … `odpowiedzi/07-…` |

Arkusze przeczytano w całości, w formie tekstowej wyekstrahowanej z DOCX/ODT. Nie oceniano
formatowania ani warstwy graficznej.

## Przebiegi

| Nr | Przebieg | Data arkusza | Pokrycie | Deklarowany tryb |
|---|---|---|---|---|
| 01 | Sonnet 5 bez skilli | 3.09.2026 | 14/14 | brak skilli |
| 02 | Sonnet 5 ze skillami v3.x | 2.09.2026 | 14/14 | router prawny (wersja sprzed 3.41) |
| 03 | Sonnet 5 ze skillami v3.41 | 6.09.2026 | 14/14 | router prawny v3.41 |
| 04 | Opus 5 bez skilli | 2–3.09.2026 | 14/14 | brak skilli, weryfikacja własna |
| 05 | Opus 5 ze skillami v3.37 | 2.09.2026 | 14/14 | router prawny v3.37, HARD GATE |
| 06 | Opus 5 ze skillami v3.41 | 6–7.09.2026 | 14/14 | router v3.41, bramki MG-1/MG-2/CN-GATE/REM-GATE |
| 07 | Haiku 4.5 ze skillami | 2.09.2026 | **7/14** | router → dr-04 → dr-11 → ISAP |

Przebieg 07 objął wyłącznie część polską (PL-01 – PL-07). Część międzynarodowa nie została
wykonana, więc dla K-01 – K-07 wpisano „nie dotyczy", a średnia liczona jest z 7 kazusów.

## Ograniczenia benchmarku, które trzeba znać przed czytaniem wyników

**1. Baseline jest skażony.** Przebieg 04 („Opus 5 bez skilli") deklaruje brak skilli, ale
w części polskiej wykonał pełną weryfikację przez API ELI Sejmu (`api.sejm.gov.pl/eli/…`
→ `/references` → `text.pdf`) — czyli zachowanie, które w systemie realizuje HARD GATE
POZIOM B. Metodologia weryfikacji przeniknęła do próby kontrolnej niezależnie od tego, czy
skille były załadowane. Zmierzony efekt skilli dla Opusa jest przez to **zaniżony** i nie
należy go czytać jako różnicy „z bramkami vs. bez bramek", tylko jako różnicę „z pełnym
aparatem routera vs. z samą weryfikacją źródeł".

**2. Przebiegi nie są równoległe w czasie.** Arkusze powstawały między 2 a 7 września 2026.
Wersja routera zmieniła się w tym oknie (3.37 → 3.41), a stan prawa UE ustalany przez część
przebiegów obejmuje akty ogłoszone w lipcu 2026. Porównania między przebiegami różnej daty
mierzą łącznie efekt modelu, efekt wersji routera i efekt momentu weryfikacji.

**3. Powtórzenia nie były kontrolowane.** Jeden przebieg (06) wykonał K-01 i K-02 powtórnie,
niezależnie od wcześniejszego rozwiązania, i sam raportuje siedem różnic wobec poprzedniego
podejścia. Pozostałe kazusy rozwiązano jednokrotnie. Rozrzut wewnątrzprzebiegowy jest zatem
nieznany i nie da się go oddzielić od różnic między przebiegami.

**4. Ocena jest jednoosobowa i jednorazowa.** Nie było drugiego oceniającego ani ślepej
próby. Karty ocen w `WYNIKI.md` podają uzasadnienie każdej noty, żeby ocenę dało się
zakwestionować punkt po punkcie.

**5. Nie weryfikowano twierdzeń o stanie prawa UE po dacie granicznej.** Kilka przebiegów
opiera rozstrzygnięcia w PL-01, PL-04 i PL-07 na rozporządzeniu (UE) 2026/1744 („Digital
Omnibus on AI") i na przesunięciu dat stosowania rozdziału III aktu o sztucznej inteligencji.
Twierdzenie to powtarza się zbieżnie w czterech niezależnych przebiegach (01, 03, 04, 06)
oraz w aneksie weryfikacyjnym przebiegu 05, który deklaruje odczyt tekstu z Dziennika
Urzędowego UE. Benchmark **nie rozstrzyga**, czy akt istnieje w podanym brzmieniu — punktuje
wyłącznie to, czy przebieg w ogóle postawił pytanie o datę stosowania przepisu, bo klucz
wymaga „jawnego oddzielenia prawa obowiązującego" (Punkty premiowane).

## Czego benchmark nie mierzy

- Poprawności prawnej w sensie absolutnym — tylko zgodność z kluczem.
- Formatu wyjściowego (limit 2500 słów z banku kazusów jest raportowany, ale nie punktowany).
- Kosztu, czasu i liczby tur potrzebnych do wygenerowania odpowiedzi.
- Powtarzalności — patrz ograniczenie 3.
