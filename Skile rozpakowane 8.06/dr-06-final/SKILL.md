---
name: dr-06-podatki-finanse-publiczne-aml
version: 3.0
description: |
  DR-06: Podatki, Finanse Publiczne, AML
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | podatki.gov.pl/narzedzia/eureka/ | interpretacje.podatki.gov.pl | orzeczenia.nsa.gov.pl
---

# DR-06 — Podatki, Finanse Publiczne, AML

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI I BEZ WERYFIKACJI ONLINE

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

## Moduły (14 łącznie — ✓ 14 OK, ☐ 0 STUB)

**Aktualizacja 2026-06-07:**
- Ordynacja podatkowa: nowy t.j. **Dz.U. 2026 poz. 622**
- PIT: nowy t.j. **Dz.U. 2026 poz. 592**
- CIT: nowy t.j. **Dz.U. 2026 poz. 554** (Obwieszczenie 27 marca 2026, stan prawny 18 marca 2026)

```
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
  [✓] OK    mod-ustawa-AML-instytucje-obowiazkowe
  [✓] OK    mod-prawo-bankowe-KNF-BFG
  [✓] OK    mod-ustawa-rynek-kapitalowy-fundusze
  [✓] OK    mod-ustawa-uslugi-platnicze
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
