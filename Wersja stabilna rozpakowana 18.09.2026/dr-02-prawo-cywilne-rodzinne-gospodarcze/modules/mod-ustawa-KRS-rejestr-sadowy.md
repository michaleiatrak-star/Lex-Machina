# mod-ustawa-KRS-rejestr-sadowy

**Stan operacyjny:** 2026-08-28  
**Źródło kanoniczne:** ELI — ustawa z 20.08.1997 r. o Krajowym Rejestrze Sądowym, Dz.U. 2025 poz. 869 t.j., status obowiązujący. ELI wskazuje cztery akty zmieniające po tym tekście jednolitym — przed użyciem konkretnej jednostki trzeba uwzględnić obowiązujące zmiany.

## Zakres

Moduł obejmuje strukturę KRS, jawność i skutki wpisów, Centralną Informację, rejestr przedsiębiorców, rejestr stowarzyszeń/fundacji i innych organizacji, rejestr dłużników niewypłacalnych w zakresie nadal relewantnym oraz postępowanie rejestrowe w powiązaniu z KPC.

## Bramka rejestrowa

```text
1. Jaki podmiot i do którego rejestru ma trafić wpis?
2. Czy wpis ma charakter konstytutywny czy deklaratoryjny według ustawy szczególnej?
3. Jaki fakt/dokument jest podstawą wpisu?
4. Kto ma legitymację do zgłoszenia i jak reprezentowany jest podmiot?
5. Czy zgłoszenie jest wyłącznie elektroniczne i przez który system?
6. Jakie są aktualne formularze/załączniki/opłaty?
7. Czy istnieje rozbieżność między stanem rejestrowym a rzeczywistym?
8. Jaki środek przysługuje od rozstrzygnięcia sądu rejestrowego?
```

## Jawność i skutki danych

Nie wystarczy stwierdzenie „KRS jest jawny”. Dla konkretnej sprawy ustal oddzielnie:
- dostępność danych i dokumentów;
- domniemania dotyczące danych wpisanych;
- skutki braku zgłoszenia lub niezgodności danych;
- zasady powoływania się na dane wobec osób trzecich;
- odpowiedzialność podmiotu za nieprawidłowe lub niezgłoszone dane.

Przed zastosowaniem pobierz aktualne przepisy o jawności i domniemaniach z ELI.

## Rejestry

| Zakres | Status |
|---|---|
| przepisy ogólne i organizacja KRS | 🟢 B+ / COV |
| jawność / Centralna Informacja / odpisy i informacje | 🟢 B+ / COV |
| rejestr przedsiębiorców | 🟢 B+ / COV |
| rejestr stowarzyszeń, fundacji, OPP i innych podmiotów | 🟢 B+ / COV |
| postępowanie przymuszające / aktualizacja danych | 🟢/🟡 B+ |
| rozwiązanie podmiotu bez likwidacji i inne tryby szczególne | 🟡 B+; fresh gate |

## Postępowanie rejestrowe

Ustawa o KRS działa razem z KPC o postępowaniu nieprocesowym i przepisami wykonawczymi dotyczącymi systemów rejestrowych. Nie wpisuj w runtime stałych formularzy, opłat ani terminów bez aktualnej kontroli.

Dla spółek dodatkowo stosuj KSH; dla fundacji i stowarzyszeń ich ustawy ustrojowe; dla spółdzielni Prawo spółdzielcze/ustawę o spółdzielniach mieszkaniowych.

## Dane finansowe

Obowiązek sporządzenia i złożenia sprawozdania finansowego wynika przede wszystkim z ustawy o rachunkowości i przepisów szczególnych, nie wyłącznie z ustawy o KRS. Przy RDF/e-sprawozdaniach sprawdź aktualny tryb, format i terminy w oficjalnym systemie i obowiązujących aktach.

## Routing

- spółki → KSH + KRS;
- fundacje/stowarzyszenia → ich ustawy + KRS;
- spółdzielnie → Prawo spółdzielcze + KRS;
- postępowanie rejestrowe → KPC nieproces;
- sprawozdawczość → ustawa o rachunkowości;
- beneficjent rzeczywisty → AML/CRBR, nie KRS.

## Fresh gate

Punktem bazowym jest Dz.U. 2025 poz. 869, ale ELI wskazuje cztery nowelizacje po tekście jednolitym. Zawsze odczytaj aktualny tekst ujednolicony oraz status tych zmian przed podaniem wymogu, terminu, skutku wpisu lub środka zaskarżenia.
