---
module: ustawa-fundacja-rodzinna
version: "1.0"
verified_on: "2026-08-27"
coverage: "B — pełna mapa 16 rozdziałów + rdzeń korporacyjno-sukcesyjny"
source_policy: "RZĄD 1 only"
---

# Fundacja rodzinna — organizacja, sukcesja i governance

## 1. Źródło

Ustawa z 26 stycznia 2023 r. o fundacji rodzinnej, Dz.U. 2023 poz. 326,
ze zmianą Dz.U. 2023 poz. 825. Status ELI 27.08.2026: obowiązujący.

- ELI: https://eli.gov.pl/eli/DU/2023/326/ogl {RZĄD: 1}
- ujednolicony tekst urzędowy (326 + 825):
  https://eli.gov.pl/api/acts/DU/2023/326/text/U/D20230326Lj.pdf {RZĄD: 1}

ELI wskazuje jeden akt zmieniający. Tekst ujednolicony Kancelarii Sejmu ma
datę 17.10.2023. Przy każdej sprawie wykonaj ponowną kontrolę temporalną;
projekty zmian podatkowych nie są obowiązującą zmianą ustawy o fundacji
rodzinnej bez ogłoszenia w Dz.U.

**HARD GATE:** ten moduł nie zastępuje świeżego odczytu ustawy ani przepisów
podatkowych, spadkowych i KPC, które stosują się równolegle.

## 2. Mapa 16 rozdziałów

| Rozdział | Zakres | Status modułu |
|---|---|---|
| 1 | przepisy ogólne | 🟢 rdzeń |
| 2 | fundator | 🟢 |
| 3 | majątek | 🟢 |
| 4 | powstanie | 🟢 |
| 5 | statut i spis mienia | 🟢 rdzeń |
| 6 | beneficjent i lista | 🟢 |
| 7 | organy | 🟢 rdzeń |
| 8 | odpowiedzialność cywilnoprawna | 🟢 |
| 9 | audyt | 🟢 |
| 10 | kontrola sądowa i obowiązek informacyjny | 🟢 |
| 11 | rozwiązanie i likwidacja | 🟡 routing + kluczowe wejście |
| 12 | rejestr fundacji rodzinnych | 🟢 rdzeń |
| 13 | przepis karny | 🟡 routing |
| 14 | zmiany w przepisach | 🟡 wpływ systemowy, czytaj akty docelowe |
| 15 | przejściowe/dostosowujące | ⚪/historyczne |
| 16 | końcowy | 🟢 |

Poziom B: mapa całej ustawy jest kompletna strukturalnie, lecz nie każdy
artykuł ma komentarz operacyjny.

## 3. Definicja, osobowość, rejestr — art. 1–4

Art. 2 określa fundację rodzinną jako osobę prawną utworzoną w celu
gromadzenia mienia, zarządzania nim w interesie beneficjentów i spełniania
świadczeń na ich rzecz; szczegółowy cel określa fundator w statucie.

Art. 4:
- osobowość prawna powstaje z chwilą wpisu do rejestru;
- rejestr fundacji rodzinnych prowadzi **Sąd Okręgowy w Piotrkowie
  Trybunalskim**;
- postępowanie rejestrowe opiera się na przepisach KPC o nieprocesie, chyba że
  ustawa stanowi inaczej.

## 4. Działalność gospodarcza — art. 5

Fundacja rodzinna może prowadzić działalność gospodarczą tylko w katalogu
ustawowym art. 5. Rdzeń obejmuje m.in. ustawowo opisane:
- zbywanie mienia z ograniczeniem celu nabycia;
- najem/dzierżawę i udostępnianie mienia;
- uczestnictwo w spółkach, funduszach, spółdzielniach i podobnych podmiotach;
- papiery wartościowe/instrumenty i prawa podobne;
- określone pożyczki;
- obrót własnymi zagranicznymi środkami płatniczymi w celu płatności
  związanych z działalnością fundacji.

**Nie rekonstruuj pełnego katalogu ani warunków z pamięci** — przed oceną
konkretnej czynności odczytaj cały art. 5, w tym dalsze punkty i ustępy.
Skutki podatkowe działalności poza katalogiem należą do DR-06 i wymagają
aktualnego CIT, nie samej ustawy korporacyjnej.

## 5. Fundator — Rozdział 2

Art. 11: fundatorem może być wyłącznie osoba fizyczna z pełną zdolnością do
czynności prawnych, składająca oświadczenie w akcie założycielskim albo
testamencie. Ustawa pozwala na wielu fundatorów, ale fundacja ustanawiana
w testamencie może mieć tylko jednego (art. 12).

Prawa i obowiązki fundatora są niezbywalne (art. 13); statut może przewidywać
powierzenie wykonywania uprawnień w określonym zakresie.

## 6. Majątek — Rozdział 3

Art. 17: fundusz założycielski musi mieć wartość **co najmniej 100 000 zł**.
Spis mienia i proporcje fundatorów mają znaczenie dla dalszych rozliczeń;
wartości aktywów i zobowiązań badaj według właściwych przepisów i dokumentów.

## 7. Powstanie — art. 21–25

Art. 21 wymaga łącznie:
1. oświadczenia o ustanowieniu w akcie założycielskim albo testamencie;
2. statutu;
3. spisu mienia;
4. ustanowienia wymaganych organów;
5. wniesienia funduszu założycielskiego w terminie właściwym dla sposobu
   ustanowienia;
6. wpisu do rejestru.

Art. 22 wymaga formy aktu notarialnego dla aktu założycielskiego/testamentu.
Przed przygotowaniem checklisty założenia odczytaj art. 21–29 w całości.

## 8. Statut i spis mienia — Rozdział 5

Art. 26: statut ustala fundator, w formie aktu notarialnego. Ustawa określa
obligatoryjne elementy statutu, w tym m.in. nazwę, siedzibę, cel, beneficjenta
lub sposób jego określenia, zakres uprawnień, zasady listy beneficjentów,
czas trwania (jeśli oznaczony), fundusz oraz reguły organów/reprezentacji.

**Quality gate statutu:** nie generuj statutu wyłącznie z listy skróconej
powyżej. Odczytaj aktualny art. 26 i wszystkie elementy obowiązkowe.

## 9. Beneficjenci — Rozdział 6

Art. 30: beneficjentem może być osoba fizyczna albo wskazana w ustawie
organizacja pozarządowa prowadząca działalność pożytku publicznego; fundator
może być beneficjentem. Beneficjent musi być ujęty na liście beneficjentów
(art. 31). Szczegółowe dane listy i realizację świadczeń badaj z art. 32–42.

## 10. Organy — Rozdział 7

Art. 43 wskazuje trzy organy:
- zarząd,
- rada nadzorcza,
- zgromadzenie beneficjentów.

To nie oznacza, że rada nadzorcza jest obowiązkowa w każdym układzie.
Przed kwalifikacją obowiązkowości, składu, kadencji, reprezentacji,
sprzeczności interesów i uchwał odczytaj właściwy oddział Rozdziału 7.

## 11. Odpowiedzialność — art. 75–76

Członek zarządu, rady nadzorczej i likwidator odpowiadają wobec fundacji za
szkodę wyrządzoną działaniem/zaniechaniem sprzecznym z prawem lub statutem,
chyba że nie ponoszą winy. Art. 75 ust. 2 zawiera regułę działania w granicach
uzasadnionego ryzyka gospodarczego przy lojalnym i starannym postępowaniu.
Wspólne wyrządzenie szkody może prowadzić do odpowiedzialności solidarnej
(art. 76).

## 12. Audyt — art. 77–81

Audyt obejmuje zarządzanie aktywami, zaciąganie i spełnianie zobowiązań oraz
zobowiązania publicznoprawne pod kątem prawidłowości, rzetelności, zgodności
z prawem, celem i dokumentami fundacji.

Art. 79:
- zasadniczo audyt co najmniej raz na 4 lata;
- gdy sprawozdanie finansowe podlega badaniu na podstawie ustawy
  o rachunkowości — audyt corocznie przed zatwierdzeniem sprawozdania.

Wymogi niezależności i składu zespołu sprawdź w art. 77–80.

## 13. Kontrola sądowa — art. 82–84

Art. 82 przewiduje powództwo o uchylenie uchwały sprzecznej ze statutem lub
celem fundacji. Termin z art. 82 ust. 2: miesiąc od wiadomości o uchwale,
nie później niż 6 miesięcy od podjęcia.

Art. 83 dotyczy stwierdzenia nieważności uchwały sprzecznej z ustawą.
Przed pozwem odczytaj pełne art. 82–83, właściwość i legitymację.

Art. 84 ustanawia obowiązek informacyjny wobec organu KAS w zakresie
określonym ustawą. Sankcja z art. 128 jest związana z tym obowiązkiem.

## 14. Rozwiązanie, likwidacja, rejestr — Rozdziały 11–12

Art. 85 przewiduje m.in. rozwiązanie fundacji w organizacji, gdy nie zostanie
zgłoszona do rejestru w terminie 6 miesięcy od aktu założycielskiego/ogłoszenia
testamentu albo odmowa rejestracji stanie się prawomocna.

Rozdział 11 ma znacznie szerszy katalog podstaw i procedur likwidacyjnych —
przed decyzją odczytaj art. 85–109.

Rozdział 12:
- art. 110: fundacja podlega wpisowi do rejestru;
- art. 111: rejestr jest jawny, a ustawa daje prawo do odpisów/wyciągów/
  zaświadczeń/informacji;
- szczegóły wpisów i postępowania: art. 112–127 + aktualne rozporządzenie MS.

## 15. Przepis karny i zmiany systemowe

Art. 128 penalizuje wskazane naruszenia obowiązku informacyjnego z art. 84.
Przy kwalifikacji karnej uruchom DR-03 i odczytaj pełny przepis.

Rozdział 14 zmienia wiele ustaw, m.in. KC, KPC, podatki, KSCU, AML. Nie używaj
historycznej treści tych zmian jako bieżącego tekstu aktów docelowych.
Dla zachowku/sukcesji → świeży KC; dla podatków → świeży CIT/PIT; dla opłat
rejestrowych → świeży KSCU.

## 16. Intake kancelaryjny

Ustal:
- fundatorów i sposób ustanowienia (akt/testament);
- cel i strukturę majątku;
- beneficjentów i świadczenia;
- planowaną działalność z art. 5;
- statut i zasady organów;
- fundusz założycielski;
- stan rejestracji;
- kwestie zachowku/sukcesji;
- konsekwencje podatkowe i AML jako osobne tory;
- potrzebę audytu i ewentualnego sporu uchwałowego.

## 17. Połączenia

- KC spadki/zachowek → mod-KC-spadki.md;
- KSH / udziały / struktury → właściwe moduły KSH;
- podatki fundacji i beneficjentów → DR-06;
- AML → DR-06 / właściwy moduł AML;
- rejestr i spory uchwałowe → KPC + pisma-procesowe-v3;
- przepis karny → DR-03.

## 18. Ograniczenia F-108

F-108 P1/52: poziom **B**. Nie deklaruj kompletności podatkowej, pełnego
modelu likwidacji, pełnego komentarza do każdego ustępu ani aktualnej praktyki
rejestrowej bez osobnego researchu. Moduł zamyka brak strukturalny i daje
operacyjny rdzeń ustawy.

## 19. Quality gate

- [ ] odczytano aktualną metrykę ELI i akt zmieniający;
- [ ] odróżniono ustawę o fundacji rodzinnej od ustawy o fundacjach;
- [ ] sprawdzono działalność w pełnym art. 5;
- [ ] statut kontrolowany względem pełnego art. 26;
- [ ] fundusz założycielski i terminy pochodzą ze świeżego tekstu;
- [ ] kwestie podatkowe zweryfikowano w aktualnych ustawach podatkowych;
- [ ] przy sporze uchwałowym odczytano art. 82–83 i KPC;
- [ ] wykonano SELF-CHECK routera.
