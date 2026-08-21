# mod-ISO-27001-bezpieczenstwo-informacji.md — ISO 27001 / 22301 / 31000: Bezpieczeństwo Informacji, Ciągłość Działania, Zarządzanie Ryzykiem

Status: moduł norm ISO klasy wzorcowej. Stan metodyczny: 2026-06-07.
Normy ISO są standardami dobrowolnymi — nie aktami prawnymi. Weryfikuj ich aktualność
na iso.org lub PKN (pkn.pl). Powiązane akty prawne (KSC, RODO) weryfikuj w isap.sejm.gov.pl.

## 1. Akty i źródła do weryfikacji

- ISO/IEC 27001:2022 — Information security management systems. Requirements
  [VER: iso.org/standard/27001 — rewizja 2022; poprzednia wersja 2013 wycofana]
  Certyfikacja przez jednostki akredytowane przy PCA (pca.gov.pl)
- ISO/IEC 27002:2022 — Information security controls (przewodnik do Aneksu A ISO 27001)
  [VER: iso.org/standard/75652.html]
- ISO 22301:2019 — Security and resilience. Business continuity management systems
  [VER: iso.org/standard/75106.html — certyfikowalna]
- ISO 31000:2018 — Risk management. Guidelines
  [VER: iso.org/standard/65694.html — niecertyfikowalna, wytyczne]
- Ustawa o krajowym systemie cyberbezpieczeństwa (KSC) — Dz.U. 2024 poz. 1226 ze zm.
  [WYMAGA WERYFIKACJI ISAP — wdrożenie NIS2 w toku; sprawdź aktualny stan]
- Rozporządzenie RODO — Rozp. (UE) 2016/679
  [VER: eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32016R0679]
- Rozporządzenie DORA — Rozp. (UE) 2022/2554 (dla sektora finansowego)
  [VER: patrz mod-DORA-compliance-sektor-finansowy]
- Dyrektywa NIS2 — Dyrektywa (UE) 2022/2555
  [VER: eur-lex.europa.eu — sprawdź stan implementacji w Polsce]

Nie cytuj literalnego brzmienia przepisu ani klauzuli normy bez aktualnego sprawdzenia źródła.
Dla norm ISO: sprawdź wersję — ISO 27001:2013 jest wycofana, obowiązuje ISO 27001:2022.

## 2. Zakres spraw

- Budowanie i wdrażanie ISMS (Information Security Management System) wg ISO 27001:2022
- Certyfikacja ISO 27001 — przygotowanie, audyt, nadzory, recertyfikacja
- Gap analysis: ISO 27001:2013 → ISO 27001:2022 (zmiana struktury Aneksu A)
- Zgodność z KSC — Operatorzy Usług Kluczowych (OUK) i Dostawcy Usług Cyfrowych (DUC)
- Zgłaszanie incydentów bezpieczeństwa do CSIRT: GOV / MON / NASK
- Plany ciągłości działania (BCP) i odtwarzania po awarii (DRP) — ISO 22301
- Analiza wpływu na działalność (BIA — Business Impact Analysis)
- Zarządzanie ryzykiem informacyjnym — ISO 31000 jako rama metodyczna
- Postępowania nadzorcze UODO (RODO) powiązane z naruszeniami bezpieczeństwa
- Spory z dostawcami IT / cloud dotyczące bezpieczeństwa danych
- Weryfikacja zgodności dostawców chmurowych (cloud security, ISO 27017/27018)

## 3. Intake — ustal obowiązkowo

1. Jaki jest cel: certyfikacja ISO 27001 / gap analysis 2013→2022 / incydent bezpieczeństwa
   / zgodność KSC / BCP/DRP / spór z dostawcą IT / postępowanie UODO?
2. Czy organizacja jest OUK lub DUC w rozumieniu KSC? Jaki sektor?
3. Czy organizacja jest certyfikowana ISO 27001:2013 — kiedy wygasa certyfikat; termin migracji na 2022?
4. Czy doszło do incydentu bezpieczeństwa — kiedy, charakter, dane osobowe dotknięte?
5. Czy incydent zgłoszono do CSIRT (GOV/MON/NASK) i UODO — w jakim terminie?
6. Czy nakładają się: KSC, RODO, DORA, NIS2 — jaka kombinacja obowiązuje?
7. Czy organizacja przetwarza dane osobowe szczególnej kategorii (RODO art. 9)?
8. Czy korzysta z dostawców chmurowych (cloud) — jakie umowy i gdzie dane?
9. Jaki jest zakres ISMS — cała organizacja czy wydzielona część?

## 4. Struktura ISO 27001:2022 — elementy obowiązkowe

### Kontekst organizacji (kl. 4)
```
Analiza kontekstu: interesariusze, wymagania, zakres ISMS
Identyfikacja aktywów informacyjnych
```

### Przywództwo (kl. 5)
```
Polityka bezpieczeństwa informacji — zatwierdzona przez najwyższe kierownictwo
Role i odpowiedzialności: CISO, właściciele aktywów
```

### Planowanie (kl. 6)
```
Ocena ryzyka bezpieczeństwa informacji:
  Identyfikacja ryzyk → analiza → ewaluacja → plan postępowania z ryzykiem
  Deklaracja Stosowania (Statement of Applicability — SoA):
    Aneks A ISO 27001:2022: 93 zabezpieczenia w 4 kategoriach
    (Organizacyjne, Osobowe, Fizyczne, Technologiczne)
    ⚠ ZMIANA vs. 2013: 114 zabezpieczeń w 14 domenach → 93 w 4 kategoriach
```

### Wsparcie i Operacje (kl. 7–8)
```
Zasoby, kompetencje, świadomość
Bezpieczna komunikacja, dokumentacja
Operacyjne wdrożenie zabezpieczeń z SoA
Zarządzanie incydentami bezpieczeństwa
```

### Ocena wyników i Doskonalenie (kl. 9–10)
```
Monitoring i pomiary
Audyty wewnętrzne ISMS
Przegląd zarządzania
Niezgodności i działania korygujące
```

## 5. ISO 22301 — Ciągłość Działania (kluczowe elementy)

```
BIA (Business Impact Analysis):
  → Identyfikacja procesów krytycznych
  → RTO (Recovery Time Objective): maksymalny czas odtworzenia
  → RPO (Recovery Point Objective): maksymalny akceptowalny utrata danych
  → MTPD (Maximum Tolerable Period of Disruption)

BCP (Business Continuity Plan):
  → Strategie alternatywne dla procesów krytycznych
  → Plany komunikacji kryzysowej
  → Role i odpowiedzialności w kryzysie

DRP (Disaster Recovery Plan):
  → Odtworzenie systemów IT
  → Testy i ćwiczenia (min. raz w roku)

Certyfikacja ISO 22301: przez jednostki akredytowane przy PCA
```

## 6. Mapa proceduralna

### Ścieżka — incydent bezpieczeństwa informacji (OUK/KSC)
```
Wykrycie incydentu → Klasyfikacja (czy incydent istotny wg KSC?) →
→ [jeśli istotny] Zgłoszenie do właściwego CSIRT (art. 11a KSC):
    CSIRT GOV: organy administracji rządowej, operatorzy infrastruktury krytycznej
    CSIRT MON: podmioty sektora obronnego
    CSIRT NASK: pozostałe podmioty
    Termin: [WYMAGA WERYFIKACJI ISAP — sprawdź aktualny art. KSC]
→ Obsługa incydentu (containment, eradication, recovery) →
→ Raport końcowy do CSIRT →
→ [jeśli dane osobowe] Równoległa notyfikacja do UODO (art. 33 RODO: 72h)
```

### Ścieżka — certyfikacja ISO 27001:2022
```
Gap analysis (stan obecny vs. ISO 27001:2022) →
→ Ocena ryzyka + SoA →
→ Wdrożenie zabezpieczeń z Aneksu A →
→ Audyt wewnętrzny →
→ Wybór jednostki certyfikującej (PCA-akredytowanej) →
→ Audyt etap 1 (dokumentacja) → Audyt etap 2 (wdrożenie) →
→ Certyfikat (3 lata + nadzory roczne)
```

### Ścieżka — migracja ISO 27001:2013 → 2022
```
Mapowanie starych domen (14) na nowe kategorie (4) →
→ Aktualizacja SoA (nowe zabezpieczenia: 11 nowych w 27001:2022) →
→ Aktualizacja polityk i procedur →
→ Nowy audyt (migracyjny lub recertyfikacyjny) →
→ Termin migracji: do 31.10.2025 (certyfikaty ISO 27001:2013 wygasają)
    [WERYFIKUJ: sprawdź aktualny termin u jednostki certyfikującej / IAF]
```

## 7. Warunki skuteczności

Sprawdź:
- czy organizacja jest objęta KSC (OUK/DUC) — wpływa na obligatoryjność ISMS,
- datę wygaśnięcia certyfikatu ISO 27001:2013 (termin migracji na 2022),
- czy incydent bezpieczeństwa dotknął dane osobowe (równoległy obowiązek RODO),
- właściwy CSIRT dla danego podmiotu (GOV / MON / NASK),
- nakładanie DORA (sektor finansowy) — który reżim surowszy,
- zakres ISMS — czy obejmuje procesy i systemy dotknięte sprawą.

## 8. Matryca dowodowa

| Fakt | Dowód | Źródło | Siła | Luka | Ryzyko |
|---|---|---|---|---|---|
| Incydent zgłoszony terminowo | Potwierdzenie zgłoszenia do CSIRT | System zgłoszeń | Wysoka | Brak timestamp | Naruszenie KSC |
| Certyfikat ISO 27001 aktualny | Certyfikat z datą ważności | Jednostka certyfikująca | Wysoka | Certyfikat wygasły lub 2013 | Brak dowodu zgodności |
| Ocena ryzyka przeprowadzona | Risk register + SoA | ISMS | Wysoka | Nieaktualna ocena | Luka w defensie |
| BCP/DRP przetestowane | Raport z ćwiczeń | Compliance / IT | Średnia | Brak testów w ostatnim roku | Kwestionowanie przez organ |
| Naruszenie RODO zgłoszone w 72h | Potwierdzenie UODO | enotyfikacje.uodo.gov.pl | Wysoka | Zgłoszenie po terminie | Sankcja UODO |

## 9. Typowe zarzuty i kontrargumenty

| Zarzut | Kontrargument |
|---|---|
| Certyfikat ISO 27001 nie zwalnia z KSC | Prawidłowe — ISO 27001 jest akceptowaną metodą wykazania zgodności, nie zwolnieniem |
| ISMS papierowy — brak wdrożenia | Wykazać audyty wewnętrzne, obsłużone incydenty, testy BCP |
| Opóźnione zgłoszenie incydentu do CSIRT | Wykazać moment klasyfikacji jako "istotny" — termin biegnie od klasyfikacji |
| Brak testów BCP/DRP | Przeprowadzić natychmiast; wykazać harmonogram i historię testów |
| Certyfikat ISO 27001:2013 wygasł | Migracja na 2022 lub recertyfikacja — priorytet |

## 10. Strategia

Priorytety:

1. Ustal, czy organizacja jest OUK/DUC wg KSC — to określa obowiązkowy zakres,
2. Przy incydencie — odtwórz chronologię: wykrycie → klasyfikacja → zgłoszenie CSIRT,
3. Sprawdź nakładanie RODO (72h do UODO) przy incydentach obejmujących dane osobowe,
4. Przy certyfikacji 2013 — pilnuj terminu migracji na ISO 27001:2022,
5. ISO 27001 + ISO 22301 + ISO 31000 = zintegrowany system (IMS) — rozważ integrację,
6. BCP/DRP: RTO i RPO muszą być weryfikowalne — bez testów są tylko deklaracjami,
7. Przy sektorze finansowym — sprawdź DORA filar 1 (zarządzanie ryzykiem ICT) jako uzupełnienie.

## 11. Ryzyka

| Ryzyko | Opis | Mitygacja |
|---|---|---|
| Certyfikat ISO 27001:2013 wygasa | Brak aktualnego certyfikatu = utrata dowodu zgodności | Natychmiast inicjuj migrację na 2022 |
| Incydent niezgłoszony do CSIRT | Sankcja KNF / KSC | Automatyczny trigger: wykrycie → klasyfikacja → zgłoszenie |
| Naruszenie RODO niezgłoszone w 72h | Kara UODO do 20 mln EUR lub 4% obrotu | Procedura równoległego zgłoszenia RODO |
| ISMS nie obejmuje dostawców chmurowych | Luki w zakresie; ryzyko przerzucone bez podstawy | Umowy z klauzulami bezpieczeństwa + audyt cloud |
| Brak BCP/DRP dla procesów krytycznych | Brak odporności na incydent | BIA + BCP + testy co rok |
| NIS2/KSC w trakcie implementacji | Zmiana obowiązków dla OUK/DUC | Śledzić postęp prac legislacyjnych ISAP |

## 12. Quality gate

Przed odpowiedzią lub dokumentem stosuj:
- `shared/HYBRID-VALIDATION.md`
- `shared/ISAP-AUDIT-PROTOCOL.md` — dla KSC i RODO
- `shared/TEMPORAL-LAW-CHECK.md` — KSC implementuje NIS2 (zmiany w toku); ISO 27001:2013 → 2022
- `shared/RISK-ASSESSMENT.md`
- `shared/FORMAL-CHECK.md` jeśli sporządzane pismo lub raport compliance

## Weryfikacja online

```
web_search: "ISO 27001 2022 wymagania certyfikacja Polska PCA 2025"
web_search: "ISO 27001 2013 wycofanie migracja 2022 termin IAF 2025"
web_search: "ustawa KSC cyberbezpieczeństwo OUK DUC Dz.U. 2024 poz. 1226 isap"
web_search: "KSC NIS2 implementacja Polska nowelizacja 2025 2026"
web_search: "incydent bezpieczeństwa zgłoszenie CSIRT GOV NASK MON termin"
web_search: "ISO 22301 2019 certyfikacja ciągłość działania BCP DRP Polska"
web_search: "ISO 31000 2018 zarządzanie ryzykiem wytyczne framework"
```
