---
name: mod-AD-akcyza-clo

**Standard jakości:** stosuj `prawo-polskie-v2/krajowe/shared/MODULE-STANDARD-POLISH-LAW.md` oraz `prawo-polskie-v2/krajowe/shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł podatku akcyzowego. Stosuj ZAWSZE gdy użytkownik pyta o:
  - podatek akcyzowy (wyroby energetyczne, alkohol, tytoń, energia elektryczna,
    samochody osobowe) — stawki, zwolnienia, procedury, składy podatkowe
  - wiążącą informację akcyzową (WIA)
  - naruszenia celno-akcyzowe (KKS — kwalifikator karny-skarbowy)
  Cło, UCC, Nomenklatura Scalona (CN), WIT, wartość celna, FTA/GSP →
  `mod-UCC-clo-taryfa-celna.md` (wydzielony 2026-06-14).
  Powiązane: `mod-PIT-podatek-dochodowy-fizyczne.md` / `mod-CIT-podatek-dochodowy-prawne.md` / `mod-VAT-podatek-od-towarow-i-uslug.md` według podatku, `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-REACH-CLP-chemikalia.md`, `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KSH-spolki-handlowe.md`.
compatibility:
  tools:
    - web_search
    - web_fetch
---

# mod-AD — Akcyza: Podatek Akcyzowy / WIA / KKS

**Akt:** VAT (ustawa o podatku od towarów i usług) — t.j. Dz.U. 2026 poz. 1263 (zm. po t.j.: 2026/1446 [OD 2026-11-18: 2026/1446] — art. 1, 2, 33, 33a, 33b, 34, 41, 52, 138i; 2026/1270 [OD 2027-01-01: 2026/1270] — art. 2, 12, 13, 14, 15, 15a, 17, 19a, 22, 29a, 33, 33a, 37, 41, 42, 43, 45, 83, 86, 88).
**Akt:** PIT (ustawa o podatku dochodowym od osób fizycznych) — t.j. Dz.U. 2026 poz. 592 (zm. po t.j.: 2026/779 od 2026-07-01 — art. 24a; 2026/1079 od 2026-09-10 — art. 21; 2026/846 od 2026-10-01 — art. 25b, 30f, 31d; 2026/1287 od 2026-11-01 — art. 52zt, 52zu; 2026/1371 od 2026-11-05 — art. 14, 22p, 23q, 23zf; 2026/1347 [OD 2026-12-01: 2026/1347] — art. 14; 2026/1098 [OD 2027-01-01: 2026/1098] — art. 2, 45ba, 45c, 45cd, 45ce, 45cf; 2026/1354 [OD 2027-01-01: 2026/1354] — art. 14; 2026/1123 [OD 2028-01-01: 2026/1123] — art. 21, 22).
**Akt:** CIT (ustawa o podatku dochodowym od osób prawnych) — t.j. Dz.U. 2026 poz. 554 (zm. po t.j.: 2026/779 od 2026-07-01 — art. 9, 38ab; 2026/912 od 2026-07-31 — art. 17; 2026/846 od 2026-10-01 — art. 24a, 24aa, 24m; 2026/1287 od 2026-11-01 — art. 38za, 38zb; 2026/1371 od 2026-11-05 — art. 11e, 11t, 12, 15d; 2026/1123 [OD 2028-01-01: 2026/1123] — art. 15).
**Akt:** Akcyza (ustawa o podatku akcyzowym) — t.j. Dz.U. 2026 poz. 412.
**Akt:** UWT (ustawa o wychowaniu w trzeźwości i przeciwdziałaniu alkoholizmowi) — t.j. Dz.U. 2023 poz. 2151 (zm. po t.j.: 2026/875 [OD 2027-01-01: 2026/875] — art. 18).
**Akt:** UTyt (ustawa o ochronie zdrowia przed następstwami używania tytoniu) — t.j. Dz.U. 2026 poz. 1214.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1: terminy, progi i kwoty porównane z t.j.).

**Wersja:** 1.7 | **Rozbudowano:** 2026-08-13 — ETAP audytu pokrycia
per dział ustawy (pierwszy systematyczny audyt akcyzy, analogiczny do
wielokrotnie już przeprowadzanego dla VAT). Domknięto Działy II
(rejestracja CRPA, deklaracje/terminy, zwolnienia), III (składy
podatkowe, zabezpieczenie akcyzowe), V (samochody osobowe), VI (znaki
akcyzy — podatkowe/legalizacyjne), VIA (ewidencje), VIb (kary
pieniężne) — patrz nowa Sekcja 1a. Rozbudowano też Dział IA (WIA) —
✅ ISTOTNA KOREKTA: organ właściwy zmienił się 1.07.2023 r. z
Dyrektora IAS we Wrocławiu na Dyrektora KIS, poprzednia wersja
sekcji WIA była nieaktualna. Dotąd moduł był silny w stawkach i
kilku tematach szczegółowych (węgiel/gaz, olej opałowy, e-papierosy),
ale miał poważne luki w rdzeniu proceduralnym ustawy.

## AKTY PRAWNE — WERYFIKUJ NA ISAP

| Akt | Oznaczenie | Przedmiot |
|-----|-----------|-----------|
| Ustawa akcyzowa | Dz.U. 2026 poz. 412 t.j. (⚠️ POPRAWIONE 2026-08-11: było przestarzałe "2025 poz. 126" — nowy t.j. obowiązuje od 27.03.2026, potwierdzone w 3+ zgodnych źródłach, w tym inforlex.pl z dosłownym cytatem "Wersja obowiązująca od 2026.03.27") | Podatek akcyzowy PL |
| Dyrektywa akcyzowa | 2020/262/UE (Energy Tax Dir.) | Harmonizacja UE — wyroby energet. |
| Dyrektywa 92/83/EWG | zmieniona 2020/1151/UE | Harmonizacja — alkohol |
| KKS | Dz.U. 2025 poz. 633 t.j. | Kodeks karny skarbowy |

> Cło, UCC, Nomenklatura Scalona (CN), TARIC, WIT, wartość celna, preferencje
> FTA/GSP → `mod-UCC-clo-taryfa-celna.md`.

> ⚠ Stawki akcyzy zmieniają się co roku — weryfikuj zawsze.

---


> ⚡ **ZMIANA STRUKTURALNA 2026-08-20 (F-78, priorytet 5):** ten plik
> był 1493 linie, ze strukturą DWÓCH nakładających się schematów
> numeracji (sekcje "1-5" akcyzowe + osobny szablon "STANDARDOWE
> UZUPEŁNIENIE" z WŁASNYMi sekcjami "1-8", z sekcją "4a" wstawioną
> nietypowo między "5" a "6" tego drugiego schematu — cecha
> ODZIEDZICZONA z oryginału, NIE regresja tego podziału). Treść
> PODZIELONA na 8 plików w podkatalogu `ustawa-akcyzowa-clo/`. TEN plik
> pozostaje pod NIEZMIENIONĄ nazwą jako INDEKSATOR z zachowaną tabelą
> AKTÓW PRAWNYCH. Odesłania wewnętrzne między dawnymi sekcjami
> zaktualizowane o wskazanie pliku docelowego (5 poprawek).

---

## TABELA NAWIGACYJNA — KTÓRY TEMAT, W KTÓRYM PLIKU

| Temat | Plik |
|---|---|
| Wyroby węglowe/gazowe (cele opałowe), wyroby nikotynowe/e-papierosy | `part-01-weglowe-nikotynowe.md` |
| Olej opałowy vs napędowy, automaty do papierosów, opłata paliwowa/emisyjna | `part-02-olej-automaty-oplata.md` |
| Taksonomia technik obchodzenia akcyzy, zakres podatku akcyzowego (Sekcja 1) | `part-03-taksonomia-zakres.md` |
| Audyt pokrycia: rejestracja podmiotów, deklaracje/terminy, zwolnienia, składy podatkowe, zabezpieczenie akcyzowe (1a.1-1a.5) | `part-04-rejestracja-sklady-zabezpieczenie.md` |
| Audyt pokrycia: samochody osobowe, znaki akcyzy, ewidencje, kary pieniężne (1a.6-1a.9) | `part-05-samochody-znaki-ewidencje-kary.md` |
| Cło/UCC (odesłanie), naruszenia KKS, organy i odwołania, ścieżka weryfikacji, intake/mapa proceduralna/warunki/matryca dowodowa/zarzuty (Sekcje 2-5 + standardowe uzupełnienie 1-5) | `part-06-clo-naruszenia-organy-weryfikacja.md` |
| Klasyfikacja taryfowa CN i oszustwa celne, strategia procesowa, quality gate | `part-07-klasyfikacja-CN-strategia.md` |
| Aneks — Wiążąca Informacja Akcyzowa (WIA), Dział IA art. 7d-7k | `part-08-aneks-WIA.md` |
