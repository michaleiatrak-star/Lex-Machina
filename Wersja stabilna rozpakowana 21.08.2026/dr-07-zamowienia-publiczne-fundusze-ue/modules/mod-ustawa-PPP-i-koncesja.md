# mod-ustawa-PPP-i-koncesja

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** PPP — Dz.U. 2023 poz. 1688 ze zm. | Koncesja — Dz.U. 2023 poz. 140 ze zm. (zm.: Dz.U. 2025 poz. 1165)
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

**PPP:** wspólna realizacja przedsięwzięcia przez podmiot publiczny i partnera prywatnego; finansowanie, budowa, eksploatacja przez partnera; czas trwania umowy odpowiadający zwrotowi nakładów (typowo 15–35 lat).

**Koncesja:** umowa między koncesjodawcą a koncesjonariuszem; wykonanie usług/robót w zamian za prawo do eksploatacji (ryzyko operacyjne po stronie prywatnej). Finansowanie poza bilansem podmiotu publicznego.

**Akty:** PPP — Dz.U. 2023 poz. 1688 | Koncesja — Dz.U. 2023 poz. 140 ze zm. (zm. Dz.U. 2025 poz. 1165)

---

## 2. INTAKE

```
□ PPP czy koncesja — na którym ryzyku opiera się model?
  → Podmiot publiczny ponosi ryzyko ekonomiczne → PPP
  → Koncesjonariusz ponosi ryzyko ekonomiczne → koncesja
□ Podmiot publiczny: JST / administracja rządowa / ZOZ / uczelnia?
□ Czy przeprowadzono analizę efektywności (Value for Money)?
□ Czy wpis do rejestru umów PPP (MF)?
□ Jakie procedura wyboru partnera: tryb koncesyjny czy PZP?
```

---

## 3. PROCEDURA

### PPP — zasady absolutne

```
Podmiot publiczny (art. 2 pkt 1 uPPP): JST, adm. rządowa, ZOZ, uczelnie publiczne
Analiza efektywności (VfM): obowiązkowa przed wszczęciem
Ryzyko operacyjne: musi przejść na partnera (warunek PPP = wyłączenie z długu publicznego)
Czas trwania: odpowiadający zwrotowi nakładów partnera
Rejestr umów PPP: obowiązkowy wpis w Ministerstwie Finansów

Procedura wyboru partnera:
  → Tryb koncesyjny (gdy partner pobiera wynagrodzenie od użytkowników)
  → Tryb PZP (gdy zamawiający wypłaca wynagrodzenie)
```

### Koncesja — różnica od PZP i PPP

```
KLUCZOWA RÓŻNICA:
  PZP:     Zamawiający płaci wykonawcy → brak ryzyka operacyjnego po stronie wyk.
  Koncesja: Koncesjonariusz otrzymuje prawo eksploatacji → ponosi ryzyko operacyjne
  PPP:      Podział ryzyk i obowiązków między strony; dłuższa umowa; złożona struktura

Zastosowanie: parkingi P&R, autostrady, stadiony, sieci wod-kan z opłatami,
              porty lotnicze, obiekty kulturalne z prawem poboru opłat
```

---

## 4. QUALITY GATE / STRATEGIA / OUTPUT

**Strategia:** Przed PPP/koncesją — analiza VfM i prawna struktury (czy ryzyko operacyjne faktycznie przechodzi). Przy umowie — klauzule o zmianie wynagrodzenia, siła wyższa, rozwiązanie.

**Quality gate:** Analiza VfM przeprowadzona? Ryzyko operacyjne ustalone? Wpis do rejestru MF?

**Output:** Kwalifikacja (PPP / koncesja / PZP) → procedura wyboru → umowa → ryzyko → rejestr.

**Powiązania:** `mod-PZP-zamowienia-publiczne-KIO` | `analizator-umow-v1` | `dr-08` (JST jako strona PPP)

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20231688 | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230000140
