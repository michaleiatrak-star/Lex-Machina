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

**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1: zakresy i jednostki zgodne z t.j. KPC 2026/468). **Zmiany KPC po t.j. 2026/468 (ELI 2026-11-13, wszystkie w mocy):** 2026/473 — art. 63¹–63², 398² § 2 pkt 4, 460 § 1, 461 § 1¹–1², 2³–2⁴, 465 § 1², 476 § 1 pkt 12–13, 477¹ᶜ–477¹ᵈ, 477⁷ᵇ–477⁷ʲ, 755⁶ (w brzmieniu od 2026-07-08; przejściowy art. 15: sprawy z powództwa PIP wszczęte wcześniej — dotychczasowe); 2026/830 — art. 4¹ zd. 2 (w brzmieniu od 2026-07-08; art. 19: w sprawach w toku do czynności po tej dacie); 2026/1003 — dział IVfa, art. 479⁸⁸ᵃ i n. (od 2026-10-28); 2026/1046 — art. 47 § 2 pkt 1 lit. d, 461 § 1¹, 477⁶ᵃ (w brzmieniu od 2026-11-05; art. 5: sprawy w toku — dotychczasowe); 2026/1296 — art. 17 pkt 4⁶ (od 2026-11-06). Brzmienie po zmianie: tekst nowelizacji w ELI.

Poprzedni zapis (ELI `Akty zmieniające` DU/1964/296, odczyt 2026-10-20): 2026/473 i 830 (8.07.2026),
2026/1003 (28.10.2026), 2026/1046 (5.11.2026), 2026/1296 (6.11.2026 — art. 17 pkt 4⁶: sąd okręgowy
w sprawach o roszczenia odszkodowawcze z rozdz. 4e ustawy o świadczeniu usług drogą elektroniczną, DSA art. 54)
✅ [VER] RZĄD 1 2026-10-20 (ELI DU/2026/1296 text.pdf).

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