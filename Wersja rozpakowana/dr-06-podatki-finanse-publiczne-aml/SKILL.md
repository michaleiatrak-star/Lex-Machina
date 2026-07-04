---
name: dr-06-podatki-finanse-publiczne-aml
version: 3.1
description: |
  DR-06: Podatki, Finanse Publiczne, AML
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | podatki.gov.pl/narzedzia/eureka/ | interpretacje.podatki.gov.pl | orzeczenia.nsa.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-06 — Podatki, Finanse Publiczne, AML

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu podatkowego, stawki, progu, kwoty, terminu, sankcji, interpretacji, objaśnienia, WIS/WIA/WIP albo sygnatury orzeczenia:**
1. Zweryfikuj aktualne brzmienie aktu, tekst jednolity i nowelizacje w `isap.sejm.gov.pl`.
2. Zweryfikuj interpretacje, objaśnienia podatkowe oraz informacje MF/KIS w oficjalnym serwisie `podatki.gov.pl`, w szczególności w systemie **EUREKA**: `podatki.gov.pl/narzedzia/eureka/`.
3. Zweryfikuj orzecznictwo podatkowe w `orzeczenia.nsa.gov.pl`; dla spraw powszechnych pomocniczo także `orzeczenia.ms.gov.pl` / `sn.pl`.
4. **NIGDY** nie podawaj artykułu, stawki, progu, kwoty, terminu, sankcji, interpretacji ani tezy orzeczenia wyłącznie z pamięci modelu.

**Prawo podatkowe, stawki, progi, formularze, obowiązki raportowe, KSeF/JPK oraz praktyka interpretacyjna MF/KIS zmieniają się wielokrotnie w ciągu roku.**
W sprawach podatkowych sama treść modułu lokalnego jest tylko punktem startu; rozstrzygające jest aktualne brzmienie aktu i aktualna linia interpretacyjna/orzecznicza zweryfikowana online.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci modelu podczas sesji — każde brzmienie weryfikuj w ISAP**
- **Stawki podatkowe, kwoty wolne, progi — ZAWSZE weryfikuj przed podaniem (zmieniane co roku!)**
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-PODATKOWE.md` — dochód/przychód/koszty (wykładnia MF),
  koszty uzyskania ZPCh, definicje podatkowe ustawowe

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE: rzeczywisty
  beneficjent/UBO (AML art. 2 ust. 2 pkt 1, próg 25%, CRBR, kara do 1 mln zł)
  + alert: 3 RÓŻNE definicje "rzeczywistego właściciela" (AML/CIT-WHT art.4a
  pkt29/KSH art.4§1pkt4) — nie mylić

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-011 Cel mieszkaniowy (PIT — ulgi)
- BAS-074/099/100 Podatek / VAT / PIT — definicje podstawowe
- BAS-104 Stałe miejsce prowadzenia działalności VAT (TSUE C-605/12, C-547/18)
- BAS-W06 "Zajęcie na DG" — podatek od nieruchomości (MF interp. 37882/2023)
- BAS-W07 "Grunty zajęte na DG" — upol (NSA III FSK 530/23)
- BAS-W08 Podatek katastralny — brak planów (MF interp. 4662/2024)
- BAS-W14 ⚠️ ALERT: reforma upol od 01.01.2025 — nowe definicje budynek/budowla
  (Dz.U. 2024 poz. 1757, TK SK 14/21)
- BAS-022/023/045/050/053/054/059/061/070/071/073/076/081-084/086/087/090/092/
  096-098 — pełny katalog finansów publicznych JST (budżet, WPF, subwencje,
  dochody własne, dług SP, poręczenia/gwarancje — wszystkie z podstawą UFP)
  ⚠️ ALERT: ustawa z 27.02.2026 r. o zmianie UFP — zmiany w art. 11-15, 23-28
  (jednostki budżetowe, IGB, fundusze celowe, klasyfikacja budżetowa) —
  weryfikuj aktualną treść tych rekordów przy sprawach JST
- BAS-110 Absolwent CIS (ustawa o zatrudnieniu socjalnym, zmiana 2024)
- BAS-125 ⚠️ CRU JSFP — Centralny Rejestr Umów (wejście 01.07.2026, brak progu kwotowego!)
- BAS-W08 ⚠️⚠️ Podatek katastralny — NOWY projekt poselski Lewicy w Sejmie
  (20.03.2026): ≥3 lokale, stawka 0,5%→1,5% wartości. Stan: złożony, brak
  pierwszego czytania (06.2026). MF: brak prac rządowych, ale Sejm pracuje.
- BAS-W32 ⚠️ Przedawnienie podatkowe — Ordynacja podatkowa ma ODRĘBNY reżim
  od KC; nowelizacja znosi "wieczne przedawnienie" + wprowadza ugodę
  podatkową od 01.10.2026 (art. 70 i n. OP)

## Moduły (19 łącznie — ✓ 19 OK, ☐ 0 STUB)

**Aktualizacja 2026-06-07:**
- Ordynacja podatkowa: nowy t.j. **Dz.U. 2026 poz. 622**
- PIT: nowy t.j. **Dz.U. 2026 poz. 592**
- CIT: nowy t.j. **Dz.U. 2026 poz. 554** (Obwieszczenie 27 marca 2026, stan prawny 18 marca 2026)

**Aktualizacja 2026-06-14 (NOTA-4):** wydzielono mod-PKWiU-klasyfikacje-statystyczne
z mod-interpretacje-definicje-podatkowe (overlap z DEF-PODATKOWE udokumentowany
przez cross-reference, bez duplikacji treści).

```
  [✓] OK    mod-interpretacje-definicje-podatkowe
              (baza EUREKA; kluczowe def.: najem prywatny [NSA II FPS 1/21],
               PON wynajem [NSA III FPS 2/24], IP Box+B+R, estoński CIT,
               MDR [DTS5.8092.2/3/4.202X], rezydent podatkowy; jak korzystać
               z interpretacji indyw./ogólnych/WIS)
  [✓] NOWY  mod-PKWiU-klasyfikacje-statystyczne
              (PKWiU 2025 harmonogram VAT/PIT/CIT/ryczałt, PKOB, CN —
               wydzielony 2026-06-14, referencjonowany przez mod-VAT/PIT/CIT)
  [✓] OK    mod-OP-ordynacja-podatkowa
              (główny moduł: postępowanie podatkowe, terminy, GAAR,
               odpowiedzialność zarządu, KKS czynny żal, przedawnienie)
  [✓] OK    mod-KAS-kontrola-celno-skarbowa
  [✓] OK    mod-PIT-podatek-dochodowy-fizyczne
  [✓] OK    mod-CIT-podatek-dochodowy-prawne
  [✓] OK    mod-VAT-podatek-od-towarow-i-uslug
  [✓] OK    mod-ustawa-ryczalt-przychody
  [✓] OK    mod-ustawa-PCC-i-podatek-spadkow-darowizn
  [✓] OK    mod-ustawa-podatek-nieruchomosci-i-lokalne
  [✓] OK    mod-UFP-finanse-publiczne-NIK-RIO
  [✓] OK    mod-ustawa-akcyzowa-i-clo-UCC
              (podatek akcyzowy, WIA, KKS celno-akcyzowe — Dz.U. 2025 poz. 126)
  [✓] NOWY  mod-UCC-clo-taryfa-celna
              (wydzielony 2026-06-14 z mod-ustawa-akcyzowa-i-clo-UCC: Nomenklatura
               Scalona CN/TARIC, WIT, procedury celne UCC, wartość celna, FTA/GSP)
  [✓] OK    mod-ustawa-AML-instytucje-obowiazkowe
  [✓] OK    mod-prawo-bankowe-KNF-BFG
  [✓] OK    mod-ustawa-rynek-kapitalowy-fundusze
  [✓] OK    mod-ustawa-uslugi-platnicze
  [✓] NOWY  mod-ustawa-biegli-rewidenci-zawod
              (Dz.U. 2025 poz. 1891 t.j.; zawód zaufania publicznego —
               samorząd PIBR; rozp. 25.09.2025 — nowe uprawnienie do
               atestacji sprawozdawczości ESG/CSRD; harmonogram ESG
               wielokrotnie odraczany — zawsze weryfikuj online)
  [✓] NOWY  mod-ustawa-doradcy-podatkowi-zawod
              (Dz.U. 2021 poz. 2117 + nowelizacja Dz.U. 2025 poz. 1882
               [rozszerzenie zakresu doradztwa + zmiana PPSA]; zawód
               zaufania publicznego — samorząd KIDP; krąg uprawnionych
               szerszy niż tylko doradcy podatkowi — adwokaci/radcowie/
               biegli rewidenci w określonym zakresie)
```

## Jak wywołać

```
view /mnt/skills/user/dr-06-podatki-finanse-publiczne-aml/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-06-podatki-finanse-publiczne-aml/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- KPA (postępowanie adm.): `dr-04` → `mod-KPA-postepowanie-administracyjne`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Interpretacje / objaśnienia / WIS-WIA-WIP: podatki.gov.pl/narzedzia/eureka/ oraz interpretacje.podatki.gov.pl
- Orzecznictwo NSA: orzeczenia.nsa.gov.pl

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
