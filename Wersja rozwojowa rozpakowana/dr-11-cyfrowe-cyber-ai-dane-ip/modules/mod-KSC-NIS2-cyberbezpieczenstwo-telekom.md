---
name: mod-AI-telekom-cyber-nis2

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
description: |
  Moduł telekomunikacji, cyberbezpieczeństwa i usług cyfrowych. Stosuj przy UKE,
  prawie komunikacji elektronicznej, NIS2/KSC, incydentach, DSA, usługach online,
  hostingach, domenach, blokadach kont, naruszeniach bezpieczeństwa.
compatibility:
  tools: [web_search, web_fetch]
---

# mod-AI — Telekomunikacja / Cyberbezpieczeństwo / NIS2 / Usługi Cyfrowe

## AKTY PRAWNE — WERYFIKUJ

| Akt | Zakres |
|---|---|
| Prawo komunikacji elektronicznej | telekomunikacja, UKE, abonenci |
| Ustawa o krajowym systemie cyberbezpieczeństwa | obowiązki cyber, CSIRT |
| Dyrektywa NIS2 i implementacja PL | podmioty kluczowe i ważne |
| DSA | platformy, hosting, moderacja treści |
| RODO | naruszenia ochrony danych, incydenty |
| Kodeks karny art. 267 i n. | cyberprzestępstwa |

## ANALIZA INCYDENTU

```
□ Co się stało: dostęp, utrata danych, blokada konta, phishing, ransomware
□ Czy dotyczy danych osobowych? → mod-P RODO
□ Czy dotyczy systemu istotnego? → NIS2/KSC
□ Czy jest przestępstwo? → mod-T / mod-N
□ Czy trzeba zgłosić incydent? komu i w jakim terminie?
□ Jak zabezpieczyć dowody: logi, nagłówki e-mail, IP, zrzuty, hash plików
```

## PLATFORMY I DSA

Sprawdź:
- status dostawcy usługi,
- regulamin,
- podstawę blokady/usunięcia treści,
- mechanizm odwoławczy,
- obowiązek uzasadnienia decyzji,
- dowody arbitralności lub dyskryminacji.

## WYJŚCIE

Podaj ścieżkę: reklamacja/odwołanie do platformy, UKE/UODO/CSIRT/prokuratura/sąd.

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- status operatora/dostawcy;
- usługa;
- incydent;
- organ UKE/CSIRT;
- termin notyfikacji;
- umowy użytkowników;

## 2. Mapa proceduralna

```text
Identyfikacja trybu i organu/sądu
  ↓
Kontrola terminu, doręczenia, właściwości i legitymacji
  ↓
Ustalenie faktów materialnych i proceduralnych
  ↓
Matryca dowodowa: fakt → dowód → ciężar dowodu → luka
  ↓
Dobór pisma/środka: wniosek / odwołanie / zażalenie / skarga / pozew / zawiadomienie
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: minimum, optimum, wariant eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb
□ właściwy organ albo sąd
□ termin liczony od prawidłowego zdarzenia
□ legitymacja strony
□ żądanie możliwe prawnie
□ fakty powiązane z podstawą prawną
□ dowody przypisane do każdej tezy
□ kontrola opłat, odpisów, pełnomocnictw i podpisu
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz na dzień orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- logi;
- zgłoszenia incydentu;
- regulaminy usług;
- umowy SLA;
- wezwania organów;
- analizy techniczne;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- brak logów;
- naruszenie terminów zgłoszenia;
- kolizja z RODO;
- kary administracyjne;

## 6. Strategia procesowa

Zastosuj trzy warianty:

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje naruszenia proceduralne, wadliwość ustaleń, niewłaściwą wykładnię, naruszenie zasady proporcjonalności albo praw strony.

### Wariant eskalacyjny
Zakłada przejście do organu II instancji, WSA/NSA, sądu powszechnego, SN, TSUE, ETPC albo organu sektorowego — tylko gdy wynika to z trybu.

## 7. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy moduł działa praktycznie, a nie opisowo?
□ Czy wskazano decydujący element prawny?
□ Czy oddzielono fakty od interpretacji?
□ Czy podano ryzyka przeciwnika/organu?
□ Czy wskazano słabe punkty klienta?
□ Czy każdy przepis i Dz.U. ma kontrolę ISAP albo oznaczenie braku weryfikacji?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 8. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| analiza sądowa | `analiza-sadowa-v6` |

---

## ⚡ ALERT — NOWELIZACJA KSC (NIS2) W ŻYCIE 03.04.2026

```
Ustawa z 23.01.2026 r. o zmianie ustawy o krajowym systemie cyberbezpieczeństwa:
  → Dz.U. 2026 poz. 252 — wejście w życie: 03.04.2026
  ✅ VER: isap.sejm.gov.pl 2026-06-05

  ORYGINAŁ DR-11 miał Dz.U. 2024 poz. 1226 — NIEAKTUALNY

Kluczowe zmiany wdrażające NIS2 (Dyrektywa 2022/2555):
  → Podmioty KLUCZOWE (art. 5 ust. 1 KSC): duże firmy z sektorów kluczowych
  → Podmioty WAŻNE (art. 5 ust. 2 KSC): średnie firmy z sektorów kluczowych i ważnych
    Wyjątek MSSP (zarządzane usługi cyberbezpieczeństwa): próg już od małego przedsiębiorcy
  → Mechanizm SAMOIDENTYFIKACJI: podmioty rejestrują się samodzielnie (nie decyzja)
  → CSIRT sektorowe: dla każdego sektora/podsektora
  
Terminy obowiązków dla podmiotów (art. 16 KSC):
  → 12 miesięcy na realizację obowiązków rozdziału 3 (środki bezpieczeństwa):
    do 03.04.2027 dla podmiotów istniejących na 03.04.2026
  → 24 miesiące na pierwszy audyt dla podmiotów kluczowych: do 03.04.2028

Kary za naruszenia (weryfikuj aktualne stawki w ustawie w ISAP):
  → Podmioty kluczowe: do 10 mln EUR lub 2% rocznego obrotu (wyższe)
  → Podmioty ważne: do 7 mln EUR lub 1,4% rocznego obrotu

Nowa ustawa o certyfikacji cyberbezpieczeństwa: Dz.U. 2025 poz. 1017
  → Weszła w życie: weryfikuj datę w ISAP
  → Krajowy system certyfikacji (EUCS — European Cybersecurity Certification Scheme)

web_search: "nowelizacja KSC NIS2 Dz.U. 2026 poz. 252 obowiązki 2026 2027"
```
