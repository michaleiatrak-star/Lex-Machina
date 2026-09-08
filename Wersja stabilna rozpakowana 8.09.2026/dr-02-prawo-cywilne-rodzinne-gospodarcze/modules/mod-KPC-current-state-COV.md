---
module: KPC-current-state-COV
version: "1.0"
verified_on: "2026-08-28"
coverage: "B+/COV — struktura całego KPC z routingiem do istniejącej rodziny modułów"
source_policy: "RZĄD 1 only"
---

# Kodeks postępowania cywilnego — current-state COV

## Źródło

Kodeks postępowania cywilnego z 17 listopada 1964 r.

**Aktualny tekst jednolity:** Dz.U. 2026 poz. 468, status ELI/ISAP: obowiązujący.

RZĄD 1:
- https://eli.gov.pl/eli/DU/2026/468/ogl
- https://api.sejm.gov.pl/eli/acts/DU/2026/468/text.pdf

Po tekście jednolitym mogą występować dalsze zmiany oraz przepisy z odroczonym wejściem w życie. Każdy konkretny przepis przechodzi fresh gate.

## Mapa strukturalna

| Część / księga | Zakres | Routing operacyjny |
|---|---|---|
| Tytuł wstępny | zakres spraw cywilnych, droga sądowa, podstawowe zasady | moduły ogólne KPC + właściwość/warunki procesowe |
| Część pierwsza — postępowanie rozpoznawcze, Księga I | proces | rodzina modułów KPC: pozew, dowody, posiedzenia, orzeczenia, środki zaskarżenia, postępowania odrębne |
| Część pierwsza — Księga II | postępowanie nieprocesowe | `mod-KPC-nieproces-czesc-ogolna.md` + moduły spadkowe/rzeczowe/rodzinne/wieczystoksięgowe |
| Część pierwsza — Księga III | sąd polubowny | właściwy moduł ADR/arbitraż + fresh gate KPC |
| Część pierwsza — Księga IV | odtworzenie zaginionych lub zniszczonych akt | routing proceduralny KPC |
| Część druga — Księga I | postępowanie zabezpieczające | moduły zabezpieczenia + aktualny rodzaj roszczenia |
| Część druga — Księga II | postępowanie egzekucyjne | `mod-KPC-egzekucja-windykacja.md` + uzupełnienia egzekucyjne |
| Część trzecia — Księga I | jurysdykcja krajowa | KPC + DR-14 / prawo UE i umowy międzynarodowe |
| Część trzecia — Księga II | międzynarodowe czynności procesowe | doręczenia, pomoc prawna, dowody, dokumenty — KPC + właściwe instrumenty UE/międzynarodowe |
| Część trzecia — Księga III | uznawanie i wykonywanie zagranicznych orzeczeń/ugod | KPC + pierwszeństwo właściwego prawa UE/umowy międzynarodowej |

## Zakresy wcześniej rozproszone w mapie DR-02

### Postępowania odrębne i sprawy szczególne

Przed wyborem trybu ustal rodzaj sprawy: gospodarcza, pracownicza/ZUS, rodzinna, konsumencka, własność intelektualna lub inna kategoria szczególna. Nie przenoś wymogów jednego postępowania odrębnego do drugiego.

### Środki zaskarżenia / prawomocność

Punktem wejścia dla apelacji, prawomocności i granic kontroli instancyjnej jest `mod-KPC-prawomocnosc-granice-apelacji.md`; przy zarzucie uchybienia procesowego aktywuj również moduł art. 162.

### Nieproces

`mod-KPC-nieproces-czesc-ogolna.md` jest wejściem ogólnym. Następnie dobierz przepisy szczególne konkretnej kategorii: spadki, prawo rzeczowe, księgi wieczyste, sprawy rodzinne/opiekuńcze, depozyt itd.

### Egzekucja

`mod-KPC-egzekucja-windykacja.md` jest wejściem ogólnym. Ograniczenia egzekucji, świadczenia niepieniężne, alimenty i egzekucja z określonego składnika mają własne reguły i wymagają odczytu właściwego działu/tytułu.

## Bramka prawa UE i międzynarodowego

Przy elemencie zagranicznym najpierw sprawdź, czy pierwszeństwo ma bezpośrednio stosowany instrument UE lub umowa międzynarodowa. KPC jest źródłem krajowym i nie powinien automatycznie wypierać regulacji nadrzędnej/szczególnej.

## Fresh gate

Przed podaniem terminu, właściwości, przesłanki dopuszczalności, skutku procesowego, ograniczenia egzekucji lub wymogu formalnego:
1. odczytaj aktualną jednostkę w ELI/ISAP;
2. sprawdź akty zmieniające po t.j. Dz.U. 2026 poz. 468 i ich wejście w życie;
3. ustal tryb postępowania oraz lex specialis;
4. przy sprawie unijnej/międzynarodowej sprawdź właściwy instrument nadrzędny.

## Status

**B+/COV.** Cała struktura KPC jest objęta bieżącym routingiem do realnych modułów. Nie oznacza to `FULL` ani zweryfikowania każdego artykułu z osobna.