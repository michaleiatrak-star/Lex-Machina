---
name: dr-07-zamowienia-publiczne-fundusze-ue
version: 3.2
description: |
  DR-07: Zamówienia Publiczne, Fundusze UE, Pomoc Publiczna
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | uzp.gov.pl | orzeczenia.uzp.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-07 — Zamówienia Publiczne, Fundusze UE, Pomoc Publiczna

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

> Procedura szczegółowa (warstwa strukturalna SAOS/MCP, kontrakt sygnatur,
> gradient weryfikacji cytatu): `view shared/PRAWO-HARDGATE.md` — wczytaj
> PRZED pierwszym przepisem w każdej odpowiedzi. Integruje się z
> `shared/ISAP-AUDIT-PROTOCOL.md`.

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
## Moduły (16 łącznie — ✓ 16 OK, ☐ 0 STUB)

```
  [✓] OK    mod-PZP-zamowienia-publiczne-KIO
              (2026-07-18: naprawiono martwy odnośnik "Zamówienia obronne
               → DR-13" oraz rozbudowano przetarg nieograniczony/ograniczony)
  [✓] OK    mod-PZP-dzial-I-podstawy-wylaczenia-szacowanie
              (dodany 2026-07-18: próg podstawowy 170 000 zł, wyłączenia
               stosowania ustawy art. 9-15 (usługi prawne, nieruchomości
               z zastrzeżeniem SN, badania naukowe), zasady art. 16-20,
               zakaz dzielenia zamówienia art. 29-30. Najwyższy priorytet
               z audytu pokrycia PZP)
  [✓] OK    mod-PZP-dzial-V-VI-sektorowe-obronne-infrastruktura-krytyczna
              (dodany 2026-07-18: 7 sektorów działalności, "przedsiębiorstwa
               publiczne" = korporacje pod dominującym wpływem publicznym,
               mechanizm art. 131a ust. 1a — infrastruktura krytyczna +
               niejawny wykaz RCB → surowszy reżim obronny)
  [✓] OK    mod-PZP-dzial-XI-XII-kontrola-kary-UZP
              (dodany 2026-07-18: kontrola doraźna/uprzednia Prezesa UZP
               [odrębna od NIK/RIO — bada TYLKO zgodność z PZP, nie
               gospodarność], kary pieniężne 3000-150000 zł, termin 4 lat
               na unieważnienie umowy)
  [✓] OK    mod-PZP-fundusze-UE-podwojny-rezim
              (dodany 2026-07-18: podwójny reżim PZP + Wytyczne
               kwalifikowalności, zasada konkurencyjności poniżej progu
               PZP, taryfikator korekt finansowych 3 kategorie)
  [✓] OK    mod-PZP-opis-przedmiotu-zakaz-znakow-towarowych
              (dodany 2026-07-18: art. 99 ust. 4-6 — zakaz wskazywania
               znaków towarowych/producenta, NARUSZENIE POŚREDNIE przez
               dobór parametrów "szytych pod" jednego producenta, test
               obiektywnego uzasadnienia vs sam skutek)
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
- Orzecznictwo KIO: orzeczenia.uzp.gov.pl (Faza 1-K, orzeczenia-sadowe-v2) | UZP: uzp.gov.pl

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
