# mod-PKWiU-klasyfikacje-statystyczne.md

**Akt:** VAT (ustawa o podatku od towarów i usług) — t.j. Dz.U. 2026 poz. 1263 (zm. po t.j.: 2026/1446 [OD 2026-11-18: 2026/1446] — art. 1, 2, 33, 33a, 33b, 34, 41, 52, 138i; 2026/1270 [OD 2027-01-01: 2026/1270] — art. 2, 12, 13, 14, 15, 15a, 17, 19a, 22, 29a, 33, 33a, 37, 41, 42, 43, 45, 83, 86, 88).
**Akt:** PIT (ustawa o podatku dochodowym od osób fizycznych) — t.j. Dz.U. 2026 poz. 592 (zm. po t.j.: 2026/779 od 2026-07-01 — art. 24a; 2026/1079 od 2026-09-10 — art. 21; 2026/846 od 2026-10-01 — art. 25b, 30f, 31d; 2026/1287 od 2026-11-01 — art. 52zt, 52zu; 2026/1371 od 2026-11-05 — art. 14, 22p, 23q, 23zf; 2026/1347 [OD 2026-12-01: 2026/1347] — art. 14; 2026/1098 [OD 2027-01-01: 2026/1098] — art. 2, 45ba, 45c, 45cd, 45ce, 45cf; 2026/1354 [OD 2027-01-01: 2026/1354] — art. 14; 2026/1123 [OD 2028-01-01: 2026/1123] — art. 21, 22).
**Akt:** CIT (ustawa o podatku dochodowym od osób prawnych) — t.j. Dz.U. 2026 poz. 554 (zm. po t.j.: 2026/779 od 2026-07-01 — art. 9, 38ab; 2026/912 od 2026-07-31 — art. 17; 2026/846 od 2026-10-01 — art. 24a, 24aa, 24m; 2026/1287 od 2026-11-01 — art. 38za, 38zb; 2026/1371 od 2026-11-05 — art. 11e, 11t, 12, 15d; 2026/1123 [OD 2028-01-01: 2026/1123] — art. 15).
**Akt:** Akcyza (ustawa o podatku akcyzowym) — t.j. Dz.U. 2026 poz. 412.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1: terminy, progi i kwoty porównane z t.j.).
## DR-06 · Podatki · Klasyfikacje statystyczne (PKWiU/CN/PKOB/KŚT)

> Wydzielony 2026-06-14 z mod-interpretacje-definicje-podatkowe.md
> (sekcja 4), w ramach realizacji NOTA-4 (audyt-systemu-v4/references/CHECKLIST-DEDUP.md
> — moduł >400 linii). Temat przekrojowy — referencjonowany przez
> mod-VAT, mod-PIT, mod-CIT — wydzielenie umożliwia selektywne ładowanie
> (lazy loading) bez wczytywania całego modułu interpretacji podatkowych.

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, klasyfikacji, kodu PKWiU/CN/PKOB lub daty
wejścia w życie:**
1. Zweryfikuj brzmienie i Dz.U. w `ELI (RZĄD 1)`
2. **NIGDY** nie podawaj kodu klasyfikacji, daty przejścia lub stawki
   wyłącznie z pamięci modelu — klasyfikacje i terminy przejściowe
   zmieniają się.

---

## KLASYFIKACJE STATYSTYCZNE — PKWiU / CN / PKOB / KŚT

### PKWiU 2025 — przełomowa zmiana

```
STAN OBECNY (zweryfikowany 2026-06-09):
  PKWiU 2025: obowiązuje od 01.01.2026 r. (Dz.U. 2025 — Rozp. RM z 17.12.2025)
    → W STATYSTYCE, EWIDENCJI, RACHUNKOWOŚCI, REJESTRACH PUBLICZNYCH

  PKWiU 2015 (Dz.U. 2015 poz. 1676 ze zm.) — stosowana do celów PODATKOWYCH:
    → VAT: stosuje się do celów VAT do dnia 31.12.2027 r.
    → PIT/CIT/Ryczałt: stosuje się do celów PIT, CIT, ryczałtu do dnia 31.12.2028 r.
    → Pełne przejście na PKWiU 2025 w podatkach: od 01.01.2029 r.

⚠️ PUŁAPKA: WIS wydane pod PKWiU 2015 = ważne do 31.12.2027 (VAT)
  Ryczałt 2026–2028: nadal PKWiU 2015 — weryfikuj kody przy rozliczeniu ryczałtu!

DLACZEGO TO WAŻNE:
  → Stawki VAT obniżone: powiązane z PKWiU (np. 5% żywność, 8% usługi budowlane)
  → Ryczałt ewidencjonowany: stawki (8,5% / 12% / 15% / 17%) zależą od PKWiU
  → Split payment: obligatoryjny dla towarów z zał. 15 do ustawy VAT (kody PKWiU)
  → IP Box: kwalifikowane IP = program komputerowy (PKWiU 62.01 = usługi programistyczne)

  web_search: "PKWiU 2025 nowe kody tabela zmiana PKWiU 2015 co się zmieniło"
  web_search: "PKWiU 2015 do kiedy obowiązuje VAT PIT ryczałt 2026 2027 2028"

KLASYFIKACJA OBIEKTÓW BUDOWLANYCH (PKOB):
  → Używana przy PON (podatek od nieruchomości), pozwolenia budowlane
  → Rozporządzenie RM Dz.U. 1999 poz. 1316 (z późn. zm.) — weryfikuj aktualność
  → Powiązana z KŚT (Klasyfikacja Środków Trwałych) — amortyzacja podatkowa

NOMENKLATURA SCALONA (CN):
  → Używana przy VAT importowym, akcyzie, cłach
  → Europejska, aktualizowana rokrocznie przez KE
  → Szukaj: EUR-Lex → Nomenclature combinée
```

---

## POWIĄZANIA

| Temat | Skill / Moduł |
|---|---|
| Stawki VAT, WIS, split payment | `mod-VAT-podatek-od-towarow-i-uslug` |
| Ryczałt ewidencjonowany, IP Box | `mod-PIT-podatek-dochodowy-fizyczne` |
| Amortyzacja (KŚT) | `mod-CIT-podatek-dochodowy-prawne` |
| Podatek od nieruchomości (PKOB) | `dr-08-samorzad-terytorialny-prawo-lokalne/modules/mod-lokalne-podatki-oplaty-taryfy.md` |
| Interpretacje i definicje podatkowe ogólne | `mod-interpretacje-definicje-podatkowe.md` |
