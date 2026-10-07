---
module: KW-current-state-COV
version: "1.0"
verified_on: "2026-08-28"
coverage: "B+/COV — pełna aktualna struktura KW zmapowana do realnych modułów"
source_policy: "RZĄD 1 ELI / tekst ujednolicony"
---

# Kodeks wykroczeń — indeks current-state COV

## 1. Baza

**Kodeks wykroczeń:** t.j. Dz.U. 2025 poz. 734 ze zm.
ELI wskazuje akty zmieniające po tekście jednolitym; konkretny artykuł,
sankcja, kwota i data wejścia w życie zawsze wymagają fresh/temporal gate.

- https://eli.gov.pl/eli/DU/2025/734/ogl

## 2. Mapa całej struktury

| Część / rozdział | Zakres | Routing treści |
|---|---|---|
| Część ogólna, rozdz. I–VII | art. 1–48 | `mod-KW-art1-48-czesc-ogolna.md` + `mod-KW-kodeks-wykroczen.md` |
| Rozdz. VIII — porządek i spokój publiczny | art. 49–64 | `mod-KW-art49-64-porzadek-publiczny.md` |
| Rozdz. IX — instytucje państwowe, samorządowe i społeczne | art. 65–69, w tym 65a i 66a–66c | `mod-KW-art65-69-instytucje.md` |
| Rozdz. X — bezpieczeństwo osób i mienia | od art. 70 | `mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie.md` |
| Rozdz. XI — bezpieczeństwo i porządek w komunikacji | dalszy zakres do art. 103a | jw. + `mod-KW-KPW-framework-szczegolowy.md` |
| Rozdz. XII — wykroczenia przeciwko osobie | art. 104–108 | `mod-KW-art70-118-bezpieczenstwo-osoba-zdrowie.md` |
| Rozdz. XIII — zdrowie | art. 109–118 | jw. |
| Rozdz. XIV — mienie | art. 119–131 | `mod-KW-art119-131-przeciwko-mieniu.md` |
| Rozdz. XV — interesy konsumentów | od art. 132 | `mod-KW-art132-166-pozostale-rozdzialy.md` |
| Rozdz. XVI — obyczajność publiczna | art. 140–142 | jw. |
| Rozdz. XVII — urządzenia użytku publicznego | art. 143–145 | jw. |
| Rozdz. XVIII — obowiązek ewidencji | art. 146–147a | jw. |
| Rozdz. XIX — szkodnictwo leśne, polne i ogrodowe | art. 148–166 | jw. |

## 3. Reguła COV

`COV` oznacza tutaj:
- każda aktualna część/rozdział ma jawny routing do istniejącego modułu;
- brak luki numeracyjnej 1–166 w warstwie strukturalnej;
- istnieje fresh gate do ELI dla jednostki stosowanej w sprawie.

`COV` **nie oznacza FULL**. Nie potwierdza, że każdy paragraf, wyjątek,
sankcja lub nowelizacja został omówiony w jednakowej głębokości.

## 4. Temporal gate

Przy każdej sprawie:
1. odczytaj ELI dla KW;
2. sprawdź nowelizacje po t.j. 2025/734 i ich wejście w życie;
3. ustal datę czynu (lex mitior / temporalność);
4. dopiero potem użyj modułu szczegółowego.

## 5. F-108

F-108/7 osiąga **B+/COV** dopiero łącznie z fizycznym modułem
`mod-KW-art65-69-instytucje.md`, który usuwa ostatnią rzeczywistą lukę
między art. 64 i 70.
