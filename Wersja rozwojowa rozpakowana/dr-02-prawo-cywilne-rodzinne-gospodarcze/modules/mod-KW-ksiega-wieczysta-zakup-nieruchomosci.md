# mod-KW-ksiega-wieczysta-zakup-nieruchomosci

**Akt:** UKWH (ustawa o księgach wieczystych i hipotece) — t.j. Dz.U. 2026 poz. 1066 (zm. 2025/1669 [OD 2027-04-02: 2025/1669] — art. 36⁴ ust. 8 pkt 25; 2025/1792 [OD 2027-06-17: 2025/1792] — art. 26 ust. 4; nie dotyczą art. 3, 5–9).
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1).

**Stan operacyjny:** 2026-08-28  
**Źródło kanoniczne:** ELI — ustawa z 6.07.1982 r. o księgach wieczystych i hipotece, Dz.U. 2026 poz. 1066 t.j.  
**Obwieszczenie:** 31.07.2026; publikacja: 06.08.2026; stan prawny tekstu jednolitego: 21.07.2026; status: obowiązujący.

## Zakres

Moduł obejmuje księgi wieczyste, jawność i domniemania, rękojmię wiary publicznej, wpisy i wzmianki, ustalanie stanu prawnego nieruchomości oraz hipotekę. Procedurę wieczystoksięgową z KPC i czynności notarialne pobieraj z właściwych modułów odrębnie.

## Bramka badania księgi

```text
1. Zidentyfikuj właściwą księgę/księgi i aktualny numer KW.
2. Odczytaj aktualną treść wszystkich działów oraz wzmianki.
3. Porównaj stan ujawniony z dokumentami źródłowymi i stanem faktycznym.
4. Ustal, czy działa domniemanie zgodności i czy może działać rękojmia.
5. Zbadaj prawa/roszczenia/ograniczenia i hipoteki.
6. Sprawdź ponownie księgę bezpośrednio przed czynnością rozporządzającą.
```

## Zasady ksiąg wieczystych

- Księgi wieczyste służą ustaleniu stanu prawnego nieruchomości.
- Jawność księgi oznacza, że przy czynności dotyczącej nieruchomości nie wolno zakładać, iż brak wiedzy o ujawnionym wpisie będzie chronił stronę.
- Art. 3 ust. 1 — domniemanie, że prawo jawne z księgi jest wpisane zgodnie z rzeczywistym stanem prawnym; ust. 2 — prawo wykreślone nie istnieje (domniemania wzruszalne).
- **Rękojmia wiary publicznej ksiąg wieczystych** z art. 5 i nast. chroni nabywcę tylko przy spełnieniu ustawowych przesłanek i z uwzględnieniem wyłączeń.
- Art. 5 — rękojmia chroni nabywcę przez czynność prawną z osobą uprawnioną według księgi; art. 6 — nie chroni rozporządzeń nieodpłatnych ani nabywcy w złej wierze (wie albo z łatwością mógł się dowiedzieć); art. 7 — nie działa przeciw prawom z mocy ustawy, dożywociu, niektórym służebnościom; art. 8 — wyłącza ją wzmianka o wniosku, skardze, apelacji, skardze kasacyjnej albo ostrzeżenie.

## Aktualna struktura odczytu księgi

W elektronicznej księdze analizuj funkcjonalnie:

| Część | Pytanie kontrolne |
|---|---|
| I-O — oznaczenie nieruchomości | czy nieruchomość/lokal, powierzchnia, działki i dane identyfikacyjne odpowiadają dokumentom? |
| I-Sp — spis praw związanych z własnością | jakie prawa są związane z własnością/użytkowaniem i udziałami? |
| II — własność | kto jest ujawniony jako właściciel/użytkownik wieczysty i na jakiej podstawie? |
| III — prawa, roszczenia i ograniczenia | jakie ograniczone prawa, roszczenia, ostrzeżenia, egzekucje lub inne obciążenia są ujawnione? |
| IV — hipoteka | jakie hipoteki, wierzyciele, waluty/sumy i podstawy wpisu są ujawnione? |

Sam wygląd działów elektronicznej KW jest warstwą rejestrową; skutki prawne zawsze wyprowadzaj z ustawy i właściwych przepisów wykonawczych.

## Wzmianki i ostrzeżenia

Wzmianka o wniosku lub środku zaskarżenia oraz ostrzeżenie o niezgodności mogą wpływać na ochronę wynikającą z rękojmi. Nie traktuj „braku jeszcze dokonanego wpisu” jako równoznacznego z brakiem ryzyka, jeżeli widoczna jest wzmianka.

## Hipoteka — kwalifikator

Przy hipotece ustal:

```text
□ rodzaj prawa i nieruchomość/prawo obciążone
□ podstawa wpisu
□ wierzyciel hipoteczny
□ zabezpieczona wierzytelność i zakres zabezpieczenia według aktualnej ustawy
□ pierwszeństwo względem innych obciążeń
□ czy wierzytelność została przeniesiona
□ czy istnieje podstawa wygaśnięcia i wykreślenia hipoteki
□ jakie dokumenty są wymagane do wykreślenia
```

Nie zakładaj, że samo istnienie hipoteki uniemożliwia sprzedaż nieruchomości. Trzeba ustalić sposób spłaty/zabezpieczenia transakcji oraz warunki wykreślenia na podstawie aktualnych dokumentów wierzyciela i ustawy.

## Niezgodność stanu prawnego

Jeżeli treść księgi nie odpowiada rzeczywistemu stanowi prawnemu, rozdziel:
- sprostowanie danych technicznych/rejestrowych;
- wpis na podstawie dokumentu stanowiącego podstawę wpisu;
- spór o rzeczywisty stan prawny i właściwe powództwo/procedurę.

Dobór środka wykonuj z aktualnym KPC i przepisami ustawy; nie traktuj każdego błędu jako zwykłego wniosku o sprostowanie.

## Routing transakcyjny

- sprzedaż / umowa przedwstępna / własność → DR-02 KC + niniejszy moduł;
- postępowanie wieczystoksięgowe → DR-02 KPC;
- akt notarialny / dokumenty notarialne → DR-12 notariat;
- egzekucja z nieruchomości → DR-02 KPC egzekucja;
- planowanie/administracyjne ograniczenia nieruchomości → DR-08/09 według materii.

## Fresh gate

Przed oceną rękojmi, pierwszeństwa, hipoteki, wygaśnięcia, wykreślenia albo właściwego środka procesowego pobierz aktualny tekst ELI/ISAP dla Dz.U. 2026 poz. 1066 i sprawdź późniejsze zmiany. Treść konkretnej księgi pobieraj z oficjalnego systemu EKW Ministerstwa Sprawiedliwości.
