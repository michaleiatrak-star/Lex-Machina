# KPA — current-state COV

**Stan weryfikacji:** 2026-08-28  
**Tekst jednolity:** Dz.U. 2025 poz. 1691  
**Stan prawny tekstu jednolitego:** 2025-11-03  
**Źródło kanoniczne:** ELI/ISAP  
**Status:** **B+ / COV** — aktualna struktura kodeksu jest zmapowana do istniejącej rodziny modułów KPA; brak deklaracji `FULL` artykuł-po-artykule.

## 1. Bramka źródłowa

ELI: `https://eli.gov.pl/eli/DU/2025/1691/ogl`

Tekst jednolity uwzględnia zmiany ogłoszone przed 3.11.2025, w tym ustawę z 21.05.2025 r. o deregulacji prawa gospodarczego i administracyjnego (Dz.U. 2025 poz. 769). Przed użyciem konkretnej jednostki sprawdź ELI pod kątem późniejszych zmian i przepisów przejściowych.

## 2. Mapa kodeksu → moduły runtime

### Dział I — przepisy ogólne

Zakres obejmuje m.in.:
- zakres obowiązywania KPA;
- zasady ogólne;
- organy wyższego stopnia i organy naczelne;
- właściwość;
- wyłączenie pracownika i organu;
- stronę i reprezentację;
- załatwianie spraw i bezczynność/przewlekłość;
- doręczenia;
- wezwania;
- terminy.

**Runtime:** `mod-KPA-postepowanie-administracyjne.md` + `mod-KPA-mechanizmy-w-toku-sprawy.md`.

### Dział II — postępowanie

Zakres obejmuje m.in.:
- wszczęcie postępowania;
- metryki, protokoły i adnotacje;
- udostępnianie akt;
- dowody i rozprawę;
- zawieszenie postępowania;
- mediację;
- decyzje i postanowienia;
- ugodę;
- odwołania i zażalenia;
- wznowienie postępowania;
- stwierdzenie nieważności oraz inne tryby nadzwyczajne;
- postępowanie uproszczone i inne szczególne mechanizmy przewidziane w kodeksie.

**Runtime:** `mod-KPA-mechanizmy-w-toku-sprawy.md`, `mod-KPA-decyzja-i-odwolanie.md`, `mod-KPA-tryby-nadzwyczajne-i-strategia.md`.

### Dział III — sprawy z zakresu ubezpieczeń społecznych

KPA zawiera szczególne reguły dla tej kategorii, ale kontrola decyzji ZUS często prowadzi do sądu powszechnego według przepisów szczególnych i KPC, a nie klasycznej skargi do WSA.

**Routing:** DR-04 + KPC/ustawy ubezpieczeniowe; KPA tylko w zakresie rzeczywiście stosowanym.

### Dział IV — udział prokuratora

Przy udziale prokuratora sprawdź aktualne przepisy KPA oraz równolegle Prawo o prokuraturze. Nie przenoś mechanicznie kompetencji procesowych z KPK lub KPC.

### Dział IVa — administracyjne kary pieniężne

Rodzina KPA obejmuje zasady nakładania kar, odstąpienia, przedawnienia, zaległości i ulg. Przy każdej karze najpierw sprawdź, czy ustawa materialna nie zawiera regulacji szczególnej wyłączającej lub modyfikującej KPA.

**Runtime:** `mod-KPA-tryby-nadzwyczajne-i-strategia.md`.

### Skargi i wnioski / współpraca administracyjna / koszty

Dalsze części KPA obejmują również tryb skarg i wniosków, współpracę administracyjną oraz opłaty i koszty postępowania. Te mechanizmy nie są zamiennikiem środków zaskarżenia od decyzji lub postanowień.

## 3. Obowiązkowy kwalifikator sprawy

Przed użyciem KPA ustal:
1. czy dana sprawa podlega KPA z mocy art. 1 i ustaw szczególnych;
2. organ właściwy rzeczowo, miejscowo i instancyjnie;
3. kto jest stroną i z jakiego interesu prawnego/obowiązku;
4. czy sprawa została wszczęta z urzędu czy na żądanie;
5. etap: wyjaśniający, przed decyzją, odwoławczy, nadzwyczajny;
6. czy ustawa materialna ustanawia lex specialis;
7. właściwy termin i sposób doręczenia;
8. czy dalsza kontrola prowadzi do organu II instancji, WSA czy sądu powszechnego.

## 4. Zasady ogólne jako gate

Przy każdej analizie KPA sprawdź aktualne art. 6–16. W szczególności kontroluj:
- legalność działania organu;
- obowiązek dokładnego wyjaśnienia sprawy;
- zaufanie, informowanie i czynny udział strony;
- szybkość i prostotę postępowania;
- dwuinstancyjność i trwałość decyzji ostatecznych.

Nie traktuj zasad ogólnych jako samodzielnego substytutu przepisu kompetencyjnego lub materialnoprawnego.

## 5. Decyzja, odwołanie, WSA

Dla decyzji i odwołania użyj `mod-KPA-decyzja-i-odwolanie.md`. Po zakończeniu administracyjnego toku instancji odrębnie ustal dopuszczalność i termin skargi do WSA na podstawie PPSA.

**Routing:** KPA → DR-05; PPSA → DR-05, ale jako odrębny etap sądowoadministracyjny.

## 6. Bezczynność i przewlekłość

Nie przechodź bezpośrednio do skargi sądowej bez sprawdzenia, czy w konkretnym stanie prawnym wymagane jest ponaglenie lub inny środek administracyjny. Terminy i przesłanki pobieraj z aktualnego KPA/PPSA.

## 7. Quality gate

- [ ] aktualny Dz.U. 2025 poz. 1691 sprawdzony w ELI;
- [ ] sprawdzono późniejsze zmiany i przepisy przejściowe;
- [ ] ustalono zakres zastosowania KPA i ewentualny lex specialis;
- [ ] właściwość organu i status strony ustalono z aktualnych przepisów;
- [ ] termin i doręczenie zweryfikowano w aktualnym brzmieniu;
- [ ] odwołanie, ponaglenie, tryb nadzwyczajny lub skargę do WSA zakwalifikowano osobno;
- [ ] w sprawie ZUS nie skierowano automatycznie sprawy do WSA;
- [ ] przepisy materialne pobrano z właściwej ustawy dziedzinowej.

## 8. Źródła urzędowe

- ELI — KPA, Dz.U. 2025 poz. 1691: `https://eli.gov.pl/eli/DU/2025/1691/ogl`
- ELI — PPSA, Dz.U. 2026 poz. 143: fresh gate przy kontroli sądowoadministracyjnej.

**Zasada runtime:** ten plik jest indeksem pokrycia i routingu; źródłem normy pozostaje aktualny tekst urzędowy.