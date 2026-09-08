# Kodeks cywilny — current-state COV

**Stan weryfikacji:** 2026-08-28  
**Tekst jednolity:** Dz.U. 2026 poz. 795  
**Stan prawny tekstu jednolitego:** 2026-05-19  
**Źródło kanoniczne:** ELI/ISAP  
**Status:** **B+ / COV** — Księgi I–IV są zmapowane do istniejących modułów tematycznych; brak deklaracji `FULL` artykuł-po-artykule.

## 1. Bramka źródłowa

ELI: `https://eli.gov.pl/eli/DU/2026/795/ogl`

Obwieszczenie Marszałka Sejmu z 27.05.2026 r. ogłasza tekst jednolity według stanu prawnego na 19.05.2026. Przed użyciem konkretnej jednostki sprawdź ELI pod kątem późniejszych zmian i przepisów przejściowych.

## 2. Księga pierwsza — Część ogólna

Zakres obejmuje m.in.:
- osoby fizyczne i prawne;
- przedsiębiorców i firmę;
- mienie, rzeczy i czynności prawne;
- przedstawicielstwo i pełnomocnictwo;
- terminy;
- przedawnienie roszczeń.

**Runtime:** moduł ogólny KC + moduły tematyczne właściwe dla czynności prawnej, pełnomocnictwa, dóbr osobistych i przedawnienia.

## 3. Księga druga — Własność i inne prawa rzeczowe

Zakres obejmuje m.in.:
- własność i współwłasność;
- nabycie i utratę własności;
- ochronę własności;
- użytkowanie wieczyste;
- prawa rzeczowe ograniczone;
- posiadanie.

Dla nieruchomości zawsze dołącz ustawę o księgach wieczystych i hipotece, a przy lokalach — ustawę o własności lokali. Dla zasiedzenia użyj modułu `mod-rzeczy-znalezione-zasiedzenie.md`.

## 4. Księga trzecia — Zobowiązania

To największa warstwa operacyjna KC. Obejmuje m.in.:
- przepisy ogólne o zobowiązaniach;
- wykonanie zobowiązań i skutki niewykonania;
- ochronę wierzyciela;
- zobowiązania wielopodmiotowe;
- zmianę wierzyciela/dłużnika;
- umowy nazwane;
- odpowiedzialność deliktową;
- bezpodstawne wzbogacenie;
- ochronę konsumenta tam, gdzie KC stanowi podstawę.

**Runtime:** `mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md` oraz moduły szczegółowe dla konkretnych typów umów, ubezpieczeń i prawa konsumenckiego.

Przy umowie B2C zawsze sprawdź równolegle ustawę o prawach konsumenta; przy profesjonalnym obrocie — przepisy szczególne właściwe dla sektora.

## 5. Księga czwarta — Spadki

Zakres obejmuje m.in.:
- dziedziczenie ustawowe i testamentowe;
- testament;
- zachowek;
- przyjęcie i odrzucenie spadku;
- odpowiedzialność za długi spadkowe;
- stwierdzenie nabycia / poświadczenie dziedziczenia jako routing proceduralny;
- wspólność majątku spadkowego i dział spadku;
- umowy dotyczące spadku.

**Runtime:** `mod-KC-spadki.md` + KPC dla postępowania nieprocesowego i działowego.

## 6. Intake KC

Przed analizą ustal:
1. zdarzenie prawne i jego datę;
2. strony/podmioty oraz ich status (konsument, przedsiębiorca, osoba prawna itd.);
3. czy problem jest rzeczowy, zobowiązaniowy, spadkowy czy z części ogólnej;
4. podstawę szczególną poza KC;
5. właściwą formę czynności prawnej;
6. terminy zawite i przedawnienie;
7. czy przepis ma charakter bezwzględnie czy względnie obowiązujący;
8. środki ochrony i właściwy tryb procesowy.

## 7. Routing cross-DR

- proces / zabezpieczenie / egzekucja / nieproces → KPC, DR-02;
- rodzina → KRO, DR-02;
- spółki → KSH i ustawy gospodarcze, DR-02;
- nieruchomości publiczne / planowanie / budownictwo → DR-08/09;
- konsument → KC + ustawa o prawach konsumenta + UOKiK według problemu;
- odpowiedzialność karna → DR-03;
- prawo UE prywatne międzynarodowe / konsumenckie → DR-14.

## 8. Quality gate

- [ ] Dz.U. 2026 poz. 795 sprawdzony w ELI;
- [ ] sprawdzono późniejsze zmiany po stanie 19.05.2026;
- [ ] właściwa Księga KC została wybrana;
- [ ] ustawa szczególna została sprawdzona przed zastosowaniem normy ogólnej KC;
- [ ] terminy i przedawnienie ustalono według aktualnego przepisu i dat zdarzeń;
- [ ] materialne roszczenie odróżniono od trybu KPC;
- [ ] przy konsumentach dołączono ustawę o prawach konsumenta;
- [ ] przy nieruchomościach dołączono właściwe rejestry i ustawy szczególne.

## 9. Źródło urzędowe

- ELI — Kodeks cywilny, Dz.U. 2026 poz. 795: `https://eli.gov.pl/eli/DU/2026/795/ogl`

**Zasada runtime:** ten plik jest indeksem pokrycia. Źródłem normy pozostaje aktualny tekst urzędowy.