---
name: dr-15-compliance-iso-governance-audyt
version: 3.1
description: |
  DR-15: Compliance, ISO, Governance, Audyt
  Jeden moduł = jeden akt prawny (Dz.U.) lub norma ISO / rozporządzenie UE.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | eur-lex.europa.eu | iso.org | orzeczenia.ms.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-15 — Compliance, ISO, Governance, Audyt

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, klauzuli normy, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj rozporządzenia UE w `eur-lex.europa.eu`
3. Zweryfikuj status normy ISO w `iso.org` lub PKN (pkn.pl)
4. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
5. **NIGDY** nie podawaj artykułu, klauzuli normy, kary ani terminu wyłącznie z pamięci modelu.

**Obszar compliance był intensywnie legislowany w 2024–2026:**
- Ustawa o sygnalistach (Dz.U. 2024 poz. 928) — stosunkowo nowa, mogły wejść nowelizacje.
- AI Act (Rozp. UE 2024/1689) stosowany etapami: zakazy 02.2025, GPAI 08.2025, pełne 08.2026.
- DORA (Rozp. UE 2022/2554) stosowane od 17.01.2025 — standardy techniczne RTS nadal publikowane.
- Ustawa AML — weryfikuj aktualny tekst jednolity przed każdym użyciem.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.) LUB jedna norma ISO / rozporządzenie UE
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów i klauzul norm z pamięci — każde brzmienie weryfikuj w źródle**
- **Prawo compliance i regulacje UE zmieniają się dynamicznie — weryfikuj ZAWSZE**

---

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-W19 Sygnalista — definicja ustawowa (Dz.U. 2024 poz. 928, od 25.09.2024 —
  kontekst związany z pracą, kanały zgłoszeń, odwrócony ciężar dowodu)
- BAS-W25 Uzasadniony interes administratora RODO (LIA — istotne dla compliance danych)

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` (sekcja 6 — RZECZYWISTY
  BENEFICJENT / UBO) — "strona ukryta" w strukturach własnościowych,
  figurant/słup, zlecenie powiernicze (art. 734 i n. KC), Centralny Rejestr
  Beneficjentów Rzeczywistych (CRBR), ustawa AML art. 2 ust. 2 pkt 1)
  — kluczowe dla due diligence AML i compliance KYC
## Moduły (9 łącznie — ✓ 9 OK, ☐ 0 STUB)

```
PRAWO KRAJOWE — COMPLIANCE I NADZÓR:
  [✓] OK    mod-AML-nadzor-finansowy-instytucje
              (Dz.U. 2025 poz. 644 t.j. ze zm.;
               GIIF, KNF, instytucje obowiązane, beneficjent rzeczywisty,
               kary administracyjne, procedury compliance, odwołania)

  [✓] OK    mod-ustawa-sygnalisci
              (Dz.U. 2024 poz. 928 ze zm.; Dyrektywa UE 2019/1937;
               kanał wewnętrzny, zgłoszenia zewnętrzne do RPO, ujawnienie publiczne,
               ochrona przed działaniami odwetowymi, obowiązki pracodawcy ≥ 50 prac.,
               rejestr zgłoszeń, odpowiedzialność karna za odwet i ujawnienie tożsamości)

  [✓] OK    mod-PZP-zamowienia-obronne-bezpieczenstwa
              (Dz.U. 2024 poz. 1320 ze zm.;
               zamówienia sektorowe i obronne, wyłączenia PZP,
               tajemnica przedsiębiorstwa i informacje niejawne, odwołania KIO,
               ryzyka bezpieczeństwa infrastruktury krytycznej)

  [✓] OK    mod-ustawa-nauczyciele-uczelnie
              (Karta Nauczyciela — Dz.U. 2023 poz. 984 ze zm.;
               Prawo o szkolnictwie wyższym i nauce — Dz.U. 2024 poz. 1571 ze zm.;
               dyscyplinarka nauczyciela/akademika, ocena pracy, awans,
               odpowiedzialność dyscyplinarna uczelni, dostosowania niepełnosprawności)

REGULACJE UE — COMPLIANCE SEKTOROWY:
  [✓] OK    mod-DORA-compliance-sektor-finansowy
              (Rozp. UE 2022/2554 — stosowane od 17.01.2025;
               5 filarów: zarządzanie ryzykiem ICT, incydenty, testy TLPT,
               ryzyko dostawców ICT, wymiana informacji;
               raportowanie do KNF: 4h / 24h / 1 miesiąc;
               RTS — standardy techniczne EBA/ESMA/EIOPA — Dz.Urz. UE L 2024–2025)

NORMY ISO — ZARZĄDZANIE I CERTYFIKACJA:
  [✓] OK    mod-ISO-37301-compliance-management
              (ISO 37301:2021 — Compliance management systems;
               zastąpiła wycofaną ISO 19600:2014; certyfikowalna przez PCA;
               klauzule: kontekst org., przywództwo, planowanie, wsparcie,
               operacje, ocena wyników, doskonalenie;
               powiązana: ustawa o sygnalistach Dz.U. 2024 poz. 928; KK art. 296)

  [✓] OK    mod-ISO-37001-antykorupcja
              (ISO 37001:2016 — Anti-bribery management systems;
               polityka antykorupcyjna, ocena ryzyka łapówkarstwa,
               due diligence kontrahentów, kontrole finansowe, kanał zgłoszeń;
               certyfikacja przez PCA; powiązana: ustawa o sygnalistach)

  [✓] OK    mod-ISO-27001-bezpieczenstwo-informacji
              (ISO/IEC 27001:2022 — Information security management systems;
               ISO 22301:2019 — ciągłość działania (BCP/DRP/BIA);
               ISO 31000:2018 — zarządzanie ryzykiem (niecertyfikowalny);
               powiązana: ustawa KSC — Dz.U. 2024 poz. 1226 ze zm.;
               KSC art. 8: OUK obowiązani do systemu zarządzania bezp. informacji)

  [✓] OK    mod-ISO-42001-AI-management
              (ISO/IEC 42001:2023 — Artificial intelligence. Management system;
               AI Act — Rozp. UE 2024/1689; zakazy AI od 02.02.2025;
               systemy wysokiego ryzyka — obowiązki dostawcy art. 16, deployera art. 26;
               GPAI od 08.2025; kary: do 35 mln EUR lub 7% obrotu rocznego;
               organ krajowy ds. AI: Polska — wyznaczenie w toku [WERYFIKUJ])
```

---

## Jak wywołać

```
view /mnt/skills/user/dr-15-compliance-iso-governance-audyt/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-15-compliance-iso-governance-audyt/MAPA-AKTOW.md
```

---

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- AML (aspekt karny / KKS) → `dr-03` → `mod-KKS-karny-skarbowy-i-AML`
- Zamówienia publiczne (PZP ogólne) → `dr-07` → `mod-ustawa-PZP`
- Cyberbezpieczeństwo / KSC / NIS2 → `dr-11` → `mod-KSC-NIS2-cyberbezpieczenstwo-telekom`
- RODO / dane osobowe → `dr-11` → `mod-RODO-GDPR-2016-679`
- Prawo pracy (KP, PIP, zwolnienie sygnalisty) → `dr-04`
- Prawo bankowe / finanse sektorowe → `dr-06`
- Zarządzanie kryzysowe / bezpieczeństwo państwa → `dr-13`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja: isap.sejm.gov.pl | eur-lex.europa.eu | iso.org | pkn.pl | orzeczenia.ms.gov.pl | nsa.gov.pl | sn.pl

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
