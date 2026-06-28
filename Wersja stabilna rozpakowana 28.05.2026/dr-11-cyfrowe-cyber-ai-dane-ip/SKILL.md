---
name: dr-11-cyfrowe-cyber-ai-dane-ip
version: 3.1
description: |
  DR-11: Cyfrowe, Cyberbezpieczeństwo, AI, Dane, IP
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | eur-lex.europa.eu | uodo.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-11 — Cyfrowe, Cyberbezpieczeństwo, AI, Dane, IP

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, etapu stosowania, sygnatury lub stawki kary:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl` (akty krajowe)
2. Zweryfikuj rozporządzenia i dyrektywy UE w `eur-lex.europa.eu`
3. **NIGDY** nie podawaj artykułu, daty wejścia w życie, etapu stosowania ani sygnatury wyłącznie z pamięci modelu.

**Prawo cyfrowe UE zmienia się dynamicznie — etapy stosowania AI Act, CRA, DORA są kroczące.**

Kluczowe daty na 2026-06-05:
- ✅ AI Act art. 5 zakazy + AI Literacy: obowiązują od 02.02.2025
- ✅ AI Act GPAI: obowiązuje od 02.08.2025
- ⏳ AI Act systemy wysokiego ryzyka (Aneks III): od 02.08.2026
- ✅ KSC nowelizacja NIS2: Dz.U. 2026 poz. 252, w życie 03.04.2026
- ✅ DORA: obowiązuje od 17.01.2025
- ✅ MiCA: w pełni od 30.12.2024
- ⏳ CRA (Cyber Resilience Act): stosowanie do 11.12.2027

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (Dz.U. / Rozp. UE) lub wydzielony obszar
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills

---

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-W18 Kluczowe definicje RODO art. 4 (dane osobowe, administrator, procesor,
  przetwarzanie, naruszenie ochrony danych)
- BAS-W25 Uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO —
  test 3-etapowy LIA, decyzje UODO i NSA III OSK 2700/22)
- BAS-W36 ⚠️⚠️ TERMIN 02.08.2026: AI Act (rozp. UE 2024/1689) — system AI
  wysokiego ryzyka (art. 6 + Annex III). Pełny harmonogram wejścia w życie
  (02.2025/08.2025/08.2026/08.2027), obowiązki dostawcy i użytkownika,
  FRIA vs DPIA (kumulacja z RODO), status polskiej ustawy wdrożeniowej
  (Komisja Rozwoju i Bezpieczeństwa AI — projekt, brak uchwalenia 06.2026)

## DEFINICJE — shared/definicje/ (nieobecne — adnotacja audytowa 2026-06-14)

Ta dziedzina nie ma dedykowanego pliku w `shared/definicje/`. Cyfrowe, cyberbezpieczeństwo, AI, dane, IP — definicje RODO (art. 4), AI Act i KSC/NIS2 są obszerne i sektorowe; pokryte wprost w modułach mod-RODO-GDPR-2016-679, mod-AI-Act, mod-KSC-NIS2 (każdy z własną sekcją definicji ustawowych). Żaden plik shared/definicje/ nie obejmuje tej dziedziny bez duplikacji treści modułowej.
## Moduły (19 łącznie — ✓ 18 OK, ☐ 1 STUB [certyfikacja])

```
DANE OSOBOWE:
  [✓] OK    mod-RODO-GDPR-2016-679
              (RODO Rozp. 2016/679 — zakres, podstawy przetwarzania, prawa podmiotów;
               scalony z: mod-RODO-framework; + sekcja UODO/trzy warstwy ochrony)
  [✓] OK    mod-RODO-szczegolowy
              (szczegółowy: 72h zgłoszenie naruszenia, DPO, DPIA, monitoring pracowników,
               wyrok TSUE C-300/21 i C-340/21, art. 82 odszkodowanie)
  [✓] OK    mod-UODO-postepowanie-ochrona-danych
              (postępowanie przed UODO: skarga, decyzja, odwołanie WSA,
               kary administracyjne; Dz.U. 2019 poz. 1781 t.j.)

CYBERBEZPIECZEŃSTWO I TELEKOMUNIKACJA:
  [✓] OK    mod-KSC-NIS2-cyberbezpieczenstwo-telekom
              (⚡ ALERT: nowelizacja KSC Dz.U. 2026 poz. 252, w życie 03.04.2026;
               podmioty kluczowe/ważne, samoidentyfikacja, CSIRT sektorowe,
               kary do 10 mln EUR / 7 mln EUR; termin obowiązków: 03.04.2027)
  [✓] OK    mod-PrTelekom-poczta-UKE
              (Prawo komunikacji elektronicznej Dz.U. 2024 poz. 1220; UKE; poczta)
  [☐] STUB  mod-ustawa-certyfikacja-cyberbezpieczenstwa
              (nowa ustawa Dz.U. 2025 poz. 1017 z 25.06.2025 — krajowy system certyfikacji;
               STUB — wymaga rozbudowy po wejściu przepisów w pełni w życie)

AI I NOWE REGULACJE UE:
  [✓] OK    mod-AI-Act-framework
              (AI Act Rozp. 2024/1689; etapy stosowania; GPAI; zakazy od 02.02.2025;
               polska ustawa o AI — projekt zatwierdzony 01.04.2026, przed Sejmem;
               KRiBSI jako organ krajowy)
  [✓] OK    mod-DORA-eIDAS-cyfrowe-finanse
              (DORA Rozp. 2022/2554 od 17.01.2025; eIDAS 2.0 Rozp. 2024/1183; EUDIW)

AKTY CYFROWE UE (osobne moduły):
  [✓] OK    mod-DSA-digital-services-act
              (DSA Rozp. 2022/2065 — od 17.02.2024; moderacja treści, VLOP/VLOSE)
  [✓] OK    mod-DMA-digital-markets-act
              (DMA Rozp. 2022/1925 — gatekeeperzy od 06.03.2024)
  [✓] OK    mod-EUCS-CRA-akty-regulacyjne-UE
              (CRA Rozp. 2024/2847 — stosowanie do 11.12.2027; EUCS schematy certyfikacji)
  [✓] OK    mod-MiCA-kryptoaktywa
              (MiCA Rozp. 2023/1114 — w pełni od 30.12.2024; kryptoaktywa, stablecoiny)

WŁASNOŚĆ INTELEKTUALNA I IP:
  [✓] OK    mod-PrAut-wlasnosc-intelektualna-IP
              (prawo autorskie Dz.U. 2025 poz. 24 t.j. + własność przemysłowa
               Dz.U. 2023 poz. 1170 — znaki towarowe, patenty, wzory;
               scalony z: mod-PrAut-framework-IP)
  [✓] OK    mod-PrAut-media-internet-dobra-osobiste
              (media cyfrowe, internet, dobra osobiste online, DMCA, naruszenia IP w sieci)
  [✓] OK    mod-ustawa-prawo-wlasnosci-przemyslowej
              (Prawo własności przemysłowej Dz.U. 2023 poz. 1170 — patenty, znaki towarowe,
               wzory użytkowe i przemysłowe, UPRP; moduł atomowy uzupełniający mod-PrAut-IP)

USŁUGI CYFROWE I ELEKTRONICZNE:
  [✓] OK    mod-ustawa-uslugi-elektroniczne
              (usługi drogą elektroniczną Dz.U. 2020 poz. 344 — częściowo deaktywowana przez DSA)
  [✓] OK    mod-ustawa-informatyzacja-podmiotow-publicznych
              (informatyzacja: Dz.U. 2024 poz. 1557 t.j.; e-Doręczenia; KSeF)
  [✓] OK    mod-ustawa-podpis-elektroniczny
              (podpis elektroniczny: eIDAS 1.0 Rozp. 910/2014 + UZIE Dz.U. 2016 poz. 1579)
  [✓] OK    mod-ustawa-otwarte-dane
              (otwarte dane i re-use: Dz.U. 2023 poz. 1524 t.j.)
```

---

## Jak wywołać

```
view /mnt/skills/user/dr-11-cyfrowe-cyber-ai-dane-ip/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-11-cyfrowe-cyber-ai-dane-ip/MAPA-AKTOW.md
```

---

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Cyberprzestępstwa (KK art. 267–269b) → `dr-03`
- Prawo pracy + monitoring pracowników (RODO × KP) → `dr-04`
- Prawo finansowe (DORA → sektor bankowy, MiCA → kryptogiełdy) → `dr-06`
- Zamówienia publiczne IT → `dr-07`
- AI Act / DSA / DMA — decyzja krajowa zaskarżona na podstawie Karty Praw Podstawowych UE (art. 47) lub EKPC → `dr-14` (mod-KPP-karta-praw-podstawowych-UE, mod-EKPC-ETPC-prawa-czlowieka); ten skill zachowuje analizę merytoryczną AI Act/DSA/DMA, DR-14 dostarcza podstawę praw podstawowych dla skargi
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja: isap.sejm.gov.pl | eur-lex.europa.eu | uodo.gov.pl | uprp.gov.pl | enisa.europa.eu

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
