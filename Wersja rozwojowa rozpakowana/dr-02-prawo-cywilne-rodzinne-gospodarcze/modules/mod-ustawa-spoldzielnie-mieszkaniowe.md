---
module: ustawa-spoldzielnie-mieszkaniowe
version: "1.1"
verified_on: "2026-08-28"
coverage: "B+/COV — aktualna mapa całej struktury ustawy"
source_policy: "RZĄD 1 only"
---

# Ustawa o spółdzielniach mieszkaniowych — current-state COV

## Źródło
Ustawa z 15 grudnia 2000 r. o spółdzielniach mieszkaniowych. Aktualny tekst jednolity: **Dz.U. 2026 poz. 889**, stan prawny 10.06.2026, status ELI: obowiązujący.

RZĄD 1: https://eli.gov.pl/eli/DU/2026/889/ogl

## Struktura bieżąca

| Rozdział | Zakres | Status |
|---|---|---|
| 1 | przepisy ogólne | B+/COV |
| 1¹ | prawa członków spółdzielni mieszkaniowej | B+/COV |
| 2 | spółdzielcze lokatorskie prawo do lokalu mieszkalnego | B+/COV |
| 2¹ | spółdzielcze własnościowe prawo do lokalu | B+/COV |
| 3 | prawo odrębnej własności lokalu | B+/COV |
| 3¹ | przepisy karne | B+/COV + routing DR-03/KPW |
| 4 | zmiany w przepisach obowiązujących | techniczny |
| 5 | przepisy przejściowe i końcowe | temporal gate |

## Kwalifikator
Przed analizą ustal rodzaj prawa do lokalu: lokatorskie, własnościowe, odrębna własność, ekspektatywa albo najem. Nie przenoś reguł między tymi reżimami bez przepisu.

Dla członkostwa, dokumentów i walnego zgromadzenia używaj rozdz. 1–1¹. Dla lokatorskiego prawa — rozdz. 2; dla własnościowego — rozdz. 2¹; dla odrębnej własności — rozdz. 3 wraz z ustawą o własności lokali.

## Relacje
- Prawo spółdzielcze — lex generalis w zakresie nieuregulowanym;
- własność lokali — odrębna własność i nieruchomość wspólna;
- KC + KW/H — obrót i skutki rzeczowe;
- KPC — spory cywilne;
- KPW/DR-03 — rozdział 3¹.

## Fresh gate
Tekst jednolity uwzględnia zmiany z Dz.U. 2025 poz. 1077 i Dz.U. 2026 poz. 39. Przed cytowaniem sprawdź w ELI akty zmieniające ogłoszone po stanie tekstu jednolitego oraz przepisy przejściowe.

## Quality gate
- [ ] ustalono rodzaj prawa do lokalu;
- [ ] ustalono podstawę członkostwa;
- [ ] odczytano właściwy rozdział w ELI;
- [ ] sprawdzono statut i właściwe uchwały;
- [ ] uruchomiono KPC/KW/H/DR-03, jeżeli zakres tego wymaga.
