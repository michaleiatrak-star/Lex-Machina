# KKS — Kodeks karny skarbowy — moduł operacyjny

**Stan weryfikacji:** 2026-08-28  
**Tekst jednolity bazowy:** Dz.U. 2025 poz. 633  
**Źródło kanoniczne:** ELI/ISAP  
**Status pokrycia:** **B+ / COV** — aktualna struktura kodeksu, główne instytucje materialne, procesowe i wykonawcze oraz routing są zmapowane; brak deklaracji `FULL` artykuł-po-artykule.

## 1. Bramka źródłowa

ELI — tekst jednolity: `https://eli.gov.pl/eli/DU/2025/633/ogl`

Tekst jednolity ogłoszony w Dz.U. 2025 poz. 633 odzwierciedla stan prawny na 4.04.2025. ELI wskazuje późniejsze akty zmieniające. Na dzień 28.08.2026 w szczególności wymagają kontroli:

- Dz.U. 2026 poz. 347 — ustawa z 13.02.2026 r.; obowiązuje od 18.03.2026;
- Dz.U. 2026 poz. 901 — ustawa z 11.06.2026 r. zmieniająca KPK i KKS; obowiązuje od 21.07.2026;
- Dz.U. 2026 poz. 846 — ustawa z 29.05.2026 r.; zasadnicza data wejścia w życie 1.10.2026, z wyjątkami wskazanymi w jej przepisie końcowym.

**Reguła temporalna:** nie stosuj zmian z datą przyszłą przed ich wejściem w życie. Przy stanie faktycznym rozciągniętym w czasie zawsze sprawdź art. 2 KKS i właściwe przepisy przejściowe.

## 2. Mapa kodeksu

### Tytuł I — Przestępstwa skarbowe i wykroczenia skarbowe

**Dział I — Część ogólna** obejmuje m.in.:
- zasady odpowiedzialności;
- formy popełnienia czynu i współdziałania;
- wyłączenie lub ograniczenie odpowiedzialności;
- kary, środki karne i środki związane z poddaniem sprawcy próbie;
- zbieg czynów i kar;
- przedawnienie i zatarcie skazania;
- odpowiedzialność posiłkową oraz obowiązek zwrotu korzyści.

**Dział II — Część szczególna** obejmuje typy czynów dotyczących w szczególności:
- obowiązków podatkowych i rozliczeń podatkowych;
- dotacji, subwencji oraz rozliczeń o charakterze publicznoprawnym;
- ceł i obrotu towarowego z zagranicą;
- obrotu dewizowego;
- podatku akcyzowego;
- gier hazardowych;
- innych obowiązków finansowych chronionych przez KKS.

Przy kwalifikacji zawsze pobierz pełne aktualne brzmienie konkretnego przepisu części szczególnej. Nie ustalaj znamion ani sankcji z pamięci lub z tabeli historycznej.

### Tytuł II — Postępowanie w sprawach o przestępstwa skarbowe i wykroczenia skarbowe

Kodeks zawiera własne reguły procesowe i odpowiednio odsyła do KPK, jeżeli KKS nie stanowi inaczej. Operacyjnie rozdziel:
- przepisy wstępne;
- strony i uczestników oraz odpowiedzialność posiłkową;
- zabezpieczenie majątkowe;
- postępowanie mandatowe;
- zezwolenie na dobrowolne poddanie się odpowiedzialności;
- postępowanie przygotowawcze;
- postępowanie przed sądem pierwszej instancji;
- postępowanie odwoławcze i nadzwyczajne środki zaskarżenia;
- postępowanie nakazowe;
- postępowanie w stosunku do nieobecnych.

Art. 113 §1 ustanawia zasadę odpowiedniego stosowania KPK, jeżeli KKS nie stanowi inaczej. Dlatego każde zagadnienie proceduralne należy najpierw sprawdzić w KKS, a dopiero następnie uzupełnić KPK.

### Tytuł III — Postępowanie wykonawcze

Art. 178 §1 przewiduje odpowiednie stosowanie Kodeksu karnego wykonawczego, jeżeli KKS nie stanowi inaczej. Moduł obejmuje routing dotyczący:
- wykonywania grzywien i środków karnych;
- przepadku i ściągnięcia równowartości;
- zabezpieczenia majątkowego;
- właściwości organów skarbowych w postępowaniu wykonawczym.

## 3. Intake KKS

Przed kwalifikacją ustal:
1. datę lub okres czynu;
2. rodzaj obowiązku publicznoprawnego: podatek, cło, akcyza, dewizy, hazard lub inny;
3. status sprawcy i jego obowiązek ustawowy;
4. zachowanie: zaniechanie, podanie nieprawdy, posłużenie się dokumentem, niewykonanie obowiązku ewidencyjnego itp.;
5. czy doszło do uszczuplenia, narażenia na uszczuplenie albo czyn ma charakter formalny;
6. wartość przedmiotu czynu / kwotę uszczuplenia, jeżeli wpływa na kwalifikację;
7. umyślność lub nieumyślność — wyłącznie według konkretnego przepisu;
8. czy zachodzi zbieg z KK lub inną ustawą;
9. etap sprawy: przed ujawnieniem, postępowanie przygotowawcze, sądowe czy wykonawcze;
10. właściwy stan prawny na datę czynu i na datę orzekania.

## 4. Bramka przestępstwo skarbowe / wykroczenie skarbowe

Nie kwalifikuj czynu wyłącznie według potocznej nazwy. Sprawdź kolejno:

```text
konkretny przepis części szczególnej
→ znamiona podmiotowe i przedmiotowe
→ skutek / narażenie, jeżeli wymagane
→ kwota lub wartość i aktualny próg, jeżeli przepis go używa
→ typ podstawowy / uprzywilejowany / wykroczenie
→ sankcja z aktualnego przepisu
```

Progi zależne od minimalnego wynagrodzenia lub innych wartości dynamicznych pobieraj na datę czynu z urzędowego źródła. Nie utrwalaj ich liczbowo w module.

## 5. Czynny żal i inne tryby konsensualne

Przy czynnym żalu nie wystarcza samo złożenie pisma. Każdorazowo odczytaj aktualny art. 16 KKS i ustal m.in. moment ujawnienia czynu organowi, kompletność ujawnienia istotnych okoliczności, obowiązki finansowe oraz ustawowe wyłączenia skuteczności.

Oddziel od czynnego żalu:
- korektę deklaracji i jej skutki w KKS;
- postępowanie mandatowe;
- dobrowolne poddanie się odpowiedzialności;
- zwykłe przyznanie się do czynu.

Dla pisma o czynnym żalu użyj także `mod-czynny-zal-KK-KKS-samooskarzenie.md`, ale podstawę prawną pobierz ponownie z aktualnego KKS.

## 6. Przedawnienie i intertemporalność

Przedawnienie w KKS wymaga odrębnej analizy względem przedawnienia zobowiązania podatkowego. Dla konkretnej sprawy:
- ustal kategorię czynu i właściwy termin z KKS;
- sprawdź szczególne reguły dla czynów związanych z uszczupleniem należności publicznoprawnej;
- zbadaj zdarzenia wpływające na bieg terminu;
- osobno ustal przedawnienie zobowiązania w Ordynacji podatkowej, jeżeli ma znaczenie;
- zastosuj art. 2 KKS do zmian prawa między czynem a orzekaniem.

Nie stosuj automatycznie reguł przedawnienia z KK.

## 7. Zbieg z KK i innymi reżimami

Czyn karnoskarbowy może pozostawać w relacji z odpowiedzialnością z KK albo z sankcją administracyjną. W szczególności przy fakturach, dokumentach, oszustwie, praniu pieniędzy i zamówieniach publicznych wykonaj osobny test zbiegu.

**Routing:**
- KKS materialny i procesowy → DR-03;
- podatek / Ordynacja / VAT / CIT / PIT / akcyza / cło → DR-06 jako warstwa prawa finansowego;
- AML → DR-06 + odpowiedni moduł AML;
- KK i zbieg przestępstw powszechnych → DR-03;
- prawo UE celne / VAT / ochrona interesów finansowych UE → DR-14 + DR-06/03.

## 8. KKS a AML

KKS nie jest ustawą AML. Moduł zachowuje routing do AML wyłącznie dlatego, że fakty gospodarcze mogą rodzić równolegle ryzyka karnoskarbowe i obowiązki AML.

Dla obowiązków instytucji obowiązanej, GIIF, środków bezpieczeństwa finansowego, zawiadomień i sankcji administracyjnych użyj modułów DR-06 dotyczących ustawy AML. Dla prania pieniędzy sprawdź właściwy przepis KK.

## 9. Quality gate

- [ ] tekst bazowy Dz.U. 2025 poz. 633 sprawdzony w ELI;
- [ ] sprawdzono akty zmieniające po stanie 4.04.2025;
- [ ] zmian przyszłych nie zastosowano przed datą wejścia w życie;
- [ ] konkretne znamiona i sankcję pobrano z aktualnej jednostki KKS;
- [ ] aktualny próg kwotowy pobrano z urzędowego źródła na właściwą datę;
- [ ] przy procedurze rozdzielono lex specialis KKS od odpowiednio stosowanego KPK;
- [ ] przy wykonaniu rozdzielono KKS od odpowiednio stosowanego KKW;
- [ ] zbadano zbieg z KK i prawem podatkowym/celnym;
- [ ] przy zmianie prawa wykonano test art. 2 KKS i przepisów przejściowych.

## 10. Źródła urzędowe

- ELI — KKS, Dz.U. 2025 poz. 633: `https://eli.gov.pl/eli/DU/2025/633/ogl`
- ELI — Dz.U. 2026 poz. 347: `https://eli.gov.pl/eli/DU/2026/347/ogl`
- ELI — Dz.U. 2026 poz. 846: `https://eli.gov.pl/eli/DU/2026/846/ogl`
- ELI — Dz.U. 2026 poz. 901: `https://eli.gov.pl/eli/DU/2026/901/ogl`

**Zasada runtime:** źródłem normy jest aktualny tekst urzędowy, nie treść tego modułu.