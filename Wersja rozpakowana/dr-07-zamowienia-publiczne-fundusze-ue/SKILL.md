---
name: dr-07-zamowienia-publiczne-fundusze-ue
version: 3.1
description: |
  DR-07: Zamówienia Publiczne, Fundusze UE, Pomoc Publiczna
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | uzp.gov.pl | kio.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-07 — Zamówienia Publiczne, Fundusze UE, Pomoc Publiczna

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów i kwot z pamięci — każde brzmienie weryfikuj w ISAP**
- **Terminy w KIO są absolutne i zawite — minuty decydują**

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-W17 Rażąco niska cena (PZP art. 224 — brak definicji legalnej, linia KIO)

## DEFINICJE — shared/definicje/ (nieobecne — adnotacja audytowa 2026-06-14)

Ta dziedzina nie ma dedykowanego pliku w `shared/definicje/`. Zamówienia publiczne, fundusze UE, pomoc publiczna — pojęcia (wykonawca, zamawiający, oferta, rażąco niska cena, kryteria oceny ofert) mają definicje ustawowe wprost w PZP (art. 7) i nie wymagają osobnego pliku w shared/definicje/. Żaden plik tematyczny nie obejmuje dziedziny PZP.
## Moduły (11 łącznie — ✓ 11 OK, ☐ 0 STUB)

```
  [✓] OK    mod-PZP-zamowienia-publiczne-KIO
              (progi UE 2026-2027, tryby, wykluczenie, odrzucenie, RNC,
               środki ochrony, zmiana umowy, predykcja, strategia)
  [✓] OK    mod-PZP-wykonanie-umowy-compliance
              (wydzielony 2026-06-14 z mod-PZP >400 linii: compliance SWZ/OPZ
               art. 99 PZP, podwykonawstwo art. 462-475, zabezpieczenie
               art. 449-453, certyfikacja wykonawców)
  [✓] OK    mod-ustawa-arbitraz-mediacja
  [✓] OK    mod-PrNotariat-notariat-rejestry
  [✓] OK    mod-ustawa-fundusze-UE-pomoc-publiczna
              (fundusze UE 2021-2027 + polityka rozwoju + pomoc publiczna)
  [✓] OK    mod-ustawa-PPP-i-koncesja
              (partnerstwo publiczno-prywatne + koncesja)
  [✓] OK    mod-ustawa-NIK
  [✓] OK    mod-ustawa-RIO-regionalne-izby
  [✓] OK    mod-ustawa-dyscyplina-finansow-publicznych
  [✓] OK    mod-ustawa-Prokuratorii-Generalnej
  [✓] OK    mod-ustawa-PZP-certyfikacja-wykonawcow
              (certyfikacja od 12.07.2026 — nowa ustawa Dz.U. 2025 poz. 1235)
```

## Jak wywołać

```
view /mnt/skills/user/dr-07-zamowienia-publiczne-fundusze-ue/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-07-zamowienia-publiczne-fundusze-ue/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Finanse publiczne (UFP, NIK, RIO): patrz też `dr-06` → `mod-UFP-finanse-publiczne-NIK-RIO`
- Samorząd terytorialny: `dr-08`
- Zamówienia obronne: `dr-13`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo KIO: kio.gov.pl | UZP: uzp.gov.pl

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
