# MODUŁ SHARED-REGULATORY-HORIZON — SKANER NADCHODZĄCYCH REGULACJI
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** umowa dotyczy AI, danych, IoT, platform cyfrowych, fintech,
> zdrowia cyfrowego, produktów skomunikowanych, usług chmurowych,
> lub gdy użytkownik pyta o "przyszłe regulacje" / "regulatory risk" / "compliance roadmap".
>
> Jeden z kluczowych kierunków CLM (Contract Lifecycle Management) w Europie 2025–2028.

---

## RH.0 TRIGGERY AUTOMATYCZNE

```
Skanuj umowę pod kątem słów kluczowych:
  "AI" / "sztuczna inteligencja" / "model ML" / "algorytm decyzyjny" → RH.1 (AI Act)
  "dane" / "data" / "IoT" / "urządzenie skomunikowane" / "chmura"   → RH.2 (Data Act)
  "sieć" / "bezpieczeństwo" / "incydent" / "CSIRT" / "NIS"         → RH.3 (NIS2)
  "fintech" / "kryptoaktywa" / "ICT" / "bank" / "ubezpieczenie"    → RH.4 (DORA)
  "produkt" / "hardware" / "oprogramowanie" / "embedded"            → RH.5 (CRA)
  "tożsamość" / "podpis elektroniczny" / "uwierzytelnienie"         → RH.6 (eIDAS 2)
  "platforma" / "marketplace" / ">45 mln użytkowników"              → RH.7 (DSA/DMA)
  "ESG" / "łańcuch dostaw" / "due diligence" / "emisje CO2"        → RH.8 (CSDDD)
```

---

## RH.1 AI ACT (ROZP. UE 2024/1689)

```
STATUS:
  Obowiązuje: 01.08.2024 (wejście w życie)
  Zakazy (art. 5): od 02.02.2025 ✅ OBOWIĄZUJE
  Systemy wysokiego ryzyka (art. 6–7): od 02.08.2026
  Modele GPAI (art. 51–56): od 02.08.2025
  Pełne stosowanie: 02.08.2026
  → Weryfikuj: eur-lex.europa.eu → 2024/1689

KLAUZULE RYZYKA W UMOWACH (natychmiast):
  ⚠️ "Dostawca może używać danych klientów do trenowania modeli AI" →
     wymaga zgody RODO + ograniczeń AI Act
  ⚠️ Brak informacji że system używa AI → naruszenie art. 52 (wymóg przejrzystości)
  ⚠️ System AI podejmuje decyzje dotyczące ludzi → sprawdź klasyfikację ryzyka
  ⚠️ Chatbot bez oznaczenia jako AI → naruszenie art. 52 ust. 1 AI Act

KLAUZULE DO DODANIA (umowy z dostawcami AI):
  □ Klasyfikacja systemu AI (poziom ryzyka: minimalny/ograniczony/wysoki/zakazany)
  □ Zgodność z wymaganiami dla systemów wysokiego ryzyka (od 02.08.2026)
  □ Obowiązek aktualizacji gdy AI Act wymaga zmian systemu
  □ Prawo do wyjaśnień (human oversight) przy decyzjach AI wysokiego ryzyka
  □ Klauzula AI Act compliance w SLA/umowie serwisowej

HORYZONT:
  Za 6 m-cy (do ~12.2025): systemy GPAI — pełne wymogi → audyt dokumentacji
  Za 12 m-cy (do 02.08.2026): systemy wysokiego ryzyka — pełna compliance
  → web_search: "AI Act harmonogram stosowania 2025 2026 art.6 systemy wysokiego ryzyka"
```

---

## RH.2 DATA ACT (ROZP. UE 2023/2854)

```
STATUS:
  Stosowanie od: 12.09.2025 ✅ OBOWIĄZUJE (nowe umowy)
  Rozdział IV (nieuczciwe klauzule B2B): od 12.09.2025 (nowe) / 12.09.2027 (stare)
  Rozdział V–VI (cloud switching): od 12.09.2025
  IoT (art. 3): produkty wprowadzane po 12.09.2026
  → eur-lex.europa.eu → 2023/2854

KLAUZULE DO AKTUALIZACJI (natychmiast):
  □ Klauzule dot. własności danych → zgodność z art. 4 Data Act
  □ Klauzule vendor lock-in → usunąć lub dostosować do art. 25
  □ Cloud switching clause → dodać do każdej umowy chmurowej
  □ Interoperability clause → standardy API dla systemów cloud

HORYZONT:
  Dziś: nowe umowy muszą być zgodne z Data Act rozdz. IV i V
  12.09.2026: produkty IoT/skomunikowane wprowadzane na rynek od tej daty
  12.09.2027: stare umowy (nieokreślone / długoterminowe) muszą być zaktualizowane
  → Audit istniejących umów do 12.09.2027
```

---

## RH.3 NIS2 (DYREKTYWA 2022/2555)

```
STATUS:
  Implementacja PL: Ustawa o KSC nowelizacja Dz.U. 2026 poz. 252 ✅ W ŻYCIE 03.04.2026
  Obowiązki podmiotów kluczowych i ważnych: od 03.04.2027
  → Weryfikuj: isap.sejm.gov.pl + web_search "KSC NIS2 Polska 2026 wejście w życie"

KLAUZULE RYZYKA W UMOWACH:
  ⚠️ Brak klauzuli incident notification (72h) w umowach z dostawcami ICT
  ⚠️ Brak wymagań security assessment dla łańcucha dostaw (supply chain security)
  ⚠️ Umowa z MSSP/dostawcą cloud bez SLA bezpieczeństwa
  ⚠️ Brak prawa do audytu bezpieczeństwa dostawcy

KLAUZULE DO DODANIA:
  □ Obowiązek powiadomienia o incydencie: max 24h (wczesne ostrzeżenie) + 72h (pełny raport)
  □ Minimalne wymagania cyberbezpieczeństwa dla łańcucha dostaw (art. 21 NIS2)
  □ Prawo do audytu lub certyfikacja ISO 27001/SOC 2 jako alternatywa
  □ Odpowiedzialność za naruszenie wymogów NIS2

HORYZONT:
  03.04.2026: KSC nowelizacja obowiązuje
  03.04.2027: obowiązki podmiotów kluczowych/ważnych w pełni
  → Przegląd umów z dostawcami ICT: do 03.2027
```

---

## RH.4 DORA (ROZP. UE 2022/2554)

```
STATUS:
  Obowiązuje od: 17.01.2025 ✅ PEŁNE STOSOWANIE
  Dotyczy: banki, ubezpieczyciele, fundusze inwestycyjne, firmy inwestycyjne,
           instytucje płatnicze, dostawcy kryptoaktywów — weryfikuj zakres

KLAUZULE RYZYKA:
  ⚠️ Brak klauzul ICT risk management w umowach z dostawcami IT
  ⚠️ Umowy z dostawcami ICT bez wymogów DORA (exit strategy, audyt, incydenty)
  ⚠️ Dostawca chmury "critical" — brak rejestracji w ESMA

KLAUZULE DO DODANIA (umowy ICT podmiotów DORA):
  □ Klauzule art. 30 DORA (minimalne warunki umów z dostawcami ICT)
  □ Prawo wyjścia + exit strategy bez przeszkód
  □ Lokalizacja danych i przetwarzania
  □ Raportowanie incydentów ICT (harmonizacja z NIS2)
  → Weryfikuj: eur-lex.europa.eu → 2022/2554
```

---

## RH.5 CRA — CYBER RESILIENCE ACT (ROZP. UE 2024/2847)

```
STATUS:
  Wejście w życie: 11.12.2024
  Stosowanie pełne: 11.12.2027 (produkty z elementami cyfrowymi)
  Przepisy dot. nadzoru rynku: 11.06.2026
  → Weryfikuj: eur-lex.europa.eu → 2024/2847

DOTYCZY: oprogramowanie (w tym SaaS jako produkt), hardware, IoT
  KLAUZULE RYZYKA:
  ⚠️ Produkty software bez CVD (Coordinated Vulnerability Disclosure)
  ⚠️ Brak wsparcia bezpieczeństwa przez min. 5 lat (art. 13 CRA)
  ⚠️ Oprogramowanie bez dokumentacji bezpieczeństwa

KLAUZULE DO DODANIA:
  □ Obowiązek aktualizacji bezpieczeństwa (przez okres wsparcia)
  □ CVD policy — procedura zgłaszania podatności
  □ SBOM (Software Bill of Materials) — lista komponentów
  □ Czas wsparcia od daty zakupu (min. CRA wymagany)
```

---

## RH.6 EIDAS 2.0 (ROZP. UE 2024/1183)

```
STATUS:
  Wejście w życie: 20.05.2024
  EUDIW (European Digital Identity Wallet): do 20.11.2026 wdrożenia krajowe
  → Weryfikuj: eur-lex.europa.eu → 2024/1183

KLAUZULE RYZYKA:
  ⚠️ Umowy wymagające QES (podpis kwalifikowany) — weryfikuj dostawcę
  ⚠️ Systemy uwierzytelniania niezgodne z eIDAS 2.0

KLAUZULE DO DODANIA:
  □ Akceptacja EUDIW jako metody uwierzytelniania (od 2026)
  □ Wymogi dot. kwalifikowanych dostawców usług zaufania (QTSP)
```

---

## RH.7 DSA / DMA — AKTUALIZACJE

```
STATUS:
  DSA (2022/2065): pełne stosowanie od 17.02.2024 ✅
  DMA (2022/1925): wyznaczeni gatekeeperzy od 06.03.2024 ✅
  Weryfikuj listę gatekeeperów: web_search "DMA designated gatekeepers 2025 2026"

HORYZONT:
  Przegląd wyznaczonych gatekeeperów: Komisja co roku
  Potencjalne nowe obowiązki: weryfikuj Communication Komisji 2025
```

---

## RH.8 CSDDD — CORPORATE SUSTAINABILITY DUE DILIGENCE

```
STATUS:
  Dyrektywa UE 2024/1760 — opublikowana 05.07.2024
  Implementacja krajowa: 26.07.2026 (dla największych firm)
  Stopniowe wdrożenie: 2027–2029 według rozmiaru firmy
  → Weryfikuj: eur-lex.europa.eu → 2024/1760

DOTYCZY (pierwszy etap): firmy >1000 pracowników + >450 mln EUR obrotu
KLAUZULE RYZYKA:
  ⚠️ Brak klauzul due diligence w umowach z dostawcami (łańcuch wartości)
  ⚠️ Brak klauzul ESG/klimatycznych wymaganych od podwykonawców
  ⚠️ Brak procedury reklamacji dla pracowników łańcucha dostaw

KLAUZULE DO DODANIA (dla objętych firm):
  □ Human rights due diligence clause (łańcuch dostaw)
  □ Prawo do audytu ESG u dostawców
  □ Procedura remediation (naprawcza) przy naruszeniach
  □ Klauzula klimatyczna (cel net-zero w kontraktach)
  → Uzupełnienie: mod-shared-esg.md
```

---

## RH.9 FORMAT SEKCJI REGULATORY HORIZON W RAPORCIE

```
━━━ REGULATORY HORIZON SCANNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ WYKRYTE OBSZARY REGULACYJNE: [AI / Dane / NIS2 / DORA / CRA]   │
├────────────────────────┬──────────────┬─────────────────────────┤
│ Regulacja              │ Status       │ Wpływ na tę umowę       │
├────────────────────────┼──────────────┼─────────────────────────┤
│ AI Act (2024/1689)     │ ✅ Zakazy od │ [opis konkretnego wym.] │
│                        │ 02.02.2025   │                          │
├────────────────────────┼──────────────┼─────────────────────────┤
│ Data Act (2023/2854)   │ ✅ Od        │ [opis]                  │
│                        │ 12.09.2025   │                          │
├────────────────────────┼──────────────┼─────────────────────────┤
│ NIS2 (KSC nowel.)      │ ⏳ Pełne od  │ [opis]                  │
│                        │ 03.04.2027   │                          │
├────────────────────────┼──────────────┼─────────────────────────┤
│ CRA (2024/2847)        │ ⏳ Od        │ [opis]                  │
│                        │ 11.12.2027   │                          │
└────────────────────────┴──────────────┴─────────────────────────┘
│                                                                  │
│ REGULACJE NADCHODZĄCE:                                          │
│  Dziś:         [co wymaga działania natychmiast]                │
│  Za 6 m-cy:    [GPAI AI Act, NIS2 audit dostawców...]          │
│  Za 12 m-cy:   [AI systemy wysokiego ryzyka, IoT CRA...]       │
│  Za 24 m-cy+:  [CSDDD, eIDAS EUDIW, stare umowy Data Act]     │
│                                                                  │
│ REKOMENDACJE:                                                   │
│  1. NATYCHMIAST: [klauzule do dodania już]                     │
│  2. DO 6 M-CY:  [przegląd + planowane zmiany]                 │
│  3. DO 12 M-CY: [dostosowanie do harmonogramu]                │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## RH.10 ŹRÓDŁA ONLINE

```
eur-lex.europa.eu:
  → AI Act: 2024/1689
  → Data Act: 2023/2854
  → NIS2: 2022/2555
  → DORA: 2022/2554
  → CRA: 2024/2847
  → eIDAS 2: 2024/1183
  → DSA: 2022/2065
  → DMA: 2022/1925
  → CSDDD: 2024/1760

isap.sejm.gov.pl → KSC (ustawa o krajowym systemie cyberbezpieczeństwa)
web_search: "[regulacja] harmonogram wdrożenia Polska 2025 2026 2027"
web_search: "AI Act compliance umowy kontraktowe 2025 klauzule"
web_search: "Data Act umowy SaaS cloud klauzule 2025 2026"
```

---

*mod-shared-regulatory-horizon.md · Analizator Umów v1 · Skaner Regulacyjny*
*Aktualizacja: 2026-06-09 · Weryfikuj harmonogramy co kwartał w eur-lex.europa.eu*
