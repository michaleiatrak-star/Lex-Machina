# mod-PZP-wykonanie-umowy-compliance

**Status:** moduł uzupełniający do `mod-PZP-zamowienia-publiczne-KIO.md`
**Wydzielony:** 2026-06-14 (audyt — moduł nadrzędny >400 linii, podział tematyczny)
**Źródło weryfikacji:** PZP — Dz.U. 2024 poz. 1320 t.j. ze zm. ✅ VER: 2026-06-05
**Zasada:** Każde brzmienie przepisu i kwota → weryfikuj w ISAP / uzp.gov.pl przed powołaniem

---

## Zakres modułu

Trzy zagadnienia dotyczące **etapu wykonania zamówienia** (po wyborze wykonawcy),
wydzielone z modułu głównego dla przejrzystości:

1. Compliance SWZ/OPZ (art. 99 PZP) — kontrola opisu przedmiotu zamówienia
2. Podwykonawstwo (art. 462–475 PZP)
3. Zabezpieczenie należytego wykonania (art. 449–453 PZP)

Moduł główny (`mod-PZP-zamowienia-publiczne-KIO.md`) pokrywa: progi, terminy,
tryby, wykluczenie, odrzucenie oferty, środki ochrony prawnej (KIO), zmianę
umowy (art. 454–455), certyfikację wykonawców.

---

## 1. SUB-MODUŁ COMPLIANCE SWZ / OPZ (art. 99 PZP)

*Stosuj gdy: SWZ dostarczona do weryfikacji / pytanie o art. 99 ust. 4–5 PZP / parametry techniczne / zarzut preferowania produktu*

### Podstawa prawna (weryfikuj w ISAP)

| Przepis | Treść (skrót) |
|---|---|
| art. 99 ust. 1 PZP | Opis jednoznaczny i wyczerpujący |
| art. 99 ust. 4 PZP | **Zakaz** wskazania znaków towarowych, patentów, specyficznego pochodzenia |
| art. 99 ust. 5 PZP | Wyjątek: uzasadniona potrzeba + klauzula „**lub równoważny**" |
| art. 99 ust. 6 PZP | Obowiązek określenia **kryteriów równoważności** |

### Sekwencja weryfikacji SWZ

```
KROK C1 — Identyfikacja przedmiotu zamówienia (OPZ):
  □ Kody CPV
  □ Parametry techniczne / funkcjonalne
  □ Czy wskazano markę / model / patent / certyfikat producenta?
  □ Czy jest klauzula „lub równoważny"?
  □ Czy określono kryteria równoważności?

KROK C2 — Test jedynego produktu:
  □ Czy parametry tworzą kombinację cech pasującą tylko do jednego produktu?
  □ Czy wymagania opisano wartościami równymi zamiast min/max?
  □ Czy kilka pozornie neutralnych parametrów łącznie wskazuje jeden model?
  □ Czy użyto nazw własnych / numerów katalogowych / technologii własnościowej?
  Wynik: RYZYKO WYSOKIE / ŚREDNIE / NISKIE

KROK C3 — Porównanie parametrów produktu z SWZ:
  Tabela: [parametr | wymagana wartość | oferowana wartość | wynik ✅/❌/⚠️]
  Przy ❌ lub ⚠️ → pytanie do zamawiającego (art. 135 PZP)

KROK C4 — Pytanie do zamawiającego (termin: przed połową terminu składania ofert):
  Wzór: "Dot. [nr postępowania], SWZ rozdział [X], pkt [Y]:
  Prosimy o wyjaśnienie czy wymóg [opis] jest bezwzględny, czy możliwe jest
  zaoferowanie urządzenia o parametrach [opis alternatywny] spełniającego tę samą funkcję.
  Jeśli tak — jakie kryteria równoważności zostaną zastosowane?"

KROK C5 — Podstawa odwołania (gdy naruszenie art. 99 ust. 4 PZP):
  Zarzut: naruszenie art. 99 ust. 4 w zw. z art. 16 pkt 1–2 PZP
  Żądanie: zmiana OPZ poprzez usunięcie preferowania + dodanie klauzuli równoważności
           z mierzalnymi kryteriami (art. 99 ust. 5–6 PZP)

Orzecznictwo KIO — zasada neutralności opisu: weryfikuj na kio.gov.pl
```

> Odwołanie wynikające z naruszenia art. 99 PZP — procedura, terminy i treść
> odwołania → `mod-PZP-zamowienia-publiczne-KIO.md` sekcja 8 (Środki ochrony prawnej).

---

## 2. PODWYKONAWSTWO (art. 462–475 PZP)

```
OBOWIĄZKI WYKONAWCY:
  □ Wskazanie podwykonawców w ofercie (jeśli znani)
  □ Zgłoszenie podwykonawcy do zamawiającego przed przystąpieniem do prac
  → Zamawiający może sprzeciwić się jeśli zachodzą przesłanki wykluczenia
     wobec podwykonawcy (art. 464 PZP) — termin na sprzeciw: 14 dni

BEZPOŚREDNIA ZAPŁATA ZAMAWIAJĄCEGO NA RZECZ PODWYKONAWCY (art. 465 PZP):
  → Gdy wykonawca nie zapłacił podwykonawcy za roboty budowlane
  → Podwykonawca zgłasza roszczenie do zamawiającego
  → Zamawiający wstrzymuje płatność wykonawcy do wyjaśnienia
  → Uwaga: zamawiający odpowiada solidarnie za wynagrodzenie podwykonawcy
    (roboty budowlane — art. 6471 KC stosowany posiłkowo)

UDOSTĘPNIENIE ZASOBÓW przez podmioty trzecie (art. 118–123 PZP):
  → Wykonawca może polegać na zdolnościach podmiotu trzeciego
  → Wymaga: pisemnego zobowiązania podmiotu trzeciego
  → Podmiot trzeci odpowiada solidarnie za wykonanie gdy udostępnia zasoby
    niezbędne do realizacji zamówienia
  ⚠️ Weryfikuj aktualne przepisy art. 462–475 PZP w ISAP
```

---

## 3. ZABEZPIECZENIE NALEŻYTEGO WYKONANIA (art. 449–453 PZP)

```
OBOWIĄZEK ZAMAWIAJĄCEGO: wymaganie zabezpieczenia przy zamówieniach
  ≥ progów UE dla robót budowlanych (mogą wymagać poniżej)

WYSOKOŚĆ (art. 450 PZP — weryfikuj w ISAP):
  → Od 5% do 10% ceny brutto z oferty

FORMY ZABEZPIECZENIA:
  □ Pieniądz (na rachunek zamawiającego)
  □ Poręczenia bankowe lub ubezpieczeniowe (gwarancje)
  □ Gwarancje bankowe lub ubezpieczeniowe
  □ Poręczenia spółdzielczej kasy oszczędnościowo-kredytowej
  □ Weksle z poręczeniem (tylko do 20% kwoty przy wartości < progu robót)
  □ Cesja wierzytelności (za zgodą zamawiającego, < 50% kwoty)

ZWROT ZABEZPIECZENIA:
  → 70% w ciągu 30 dni od odbioru końcowego
  → 30% w ciągu 15 dni po upływie okresu gwarancji jakości / rękojmi

GWARANCJA JAKOŚCI (różna od zabezpieczenia!):
  → Część oferty — wykonawca określa warunki gwarancji
  → Komisja KIO orzeka o sporach w trakcie realizacji dotyczących gwarancji
  ⚠️ Weryfikuj aktualne art. 449–453 PZP w ISAP
```

---

## 4. CERTYFIKACJA WYKONAWCÓW (Dz.U. 2025 poz. 1235 — od 12.07.2026)

```
CO TO JEST:
  Certyfikat = urzędowe potwierdzenie przez akredytowany podmiot certyfikujący że:
  □ Nie zachodzą podstawy wykluczenia (art. 108–109 PZP)
  □ Wykonawca spełnia wskazane w certyfikacie warunki udziału

KORZYŚCI:
  Zamawiający akceptuje certyfikat zamiast JEDZ i dokumentów podmiotowych
  Wielokrotne użycie w różnych postępowaniach

PODMIOTY CERTYFIKUJĄCE:
  Akredytowane przez PCA (Polskie Centrum Akredytacji)
  Weryfikuj rejestr: pca.gov.pl / uzp.gov.pl

STATUS: Obowiązuje od 12.07.2026 (wyjątek: art. 5 zmieniony art. 11 ust. 4 PZP — od 01.01.2026)
⚠️ Nowe — weryfikuj aktualną praktykę i interpretacje UZP
web_search: "certyfikacja wykonawców zamówień publicznych Dz.U. 2025 poz. 1235 PCA UZP"
```

> Szczegółowy framework certyfikacji (procedura wniosku, zakres certyfikatu,
> rejestr akredytowanych podmiotów) → `mod-ustawa-PZP-certyfikacja-wykonawcow`.

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| Odwołanie do KIO (procedura, terminy) | `mod-PZP-zamowienia-publiczne-KIO.md` sekcja 8 |
| Zmiana umowy (art. 454–455) | `mod-PZP-zamowienia-publiczne-KIO.md` sekcja 9 |
| Projekt pisma / pytania do zamawiającego | `pisma-procesowe-v3` / `pisma-proste-v2` |
| Analiza umowy / aneksów | `analizator-umow-v1` |

---

## ŹRÓDŁA ONLINE

- PZP: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20241320
- KIO (wyroki): https://www.kio.gov.pl
- UZP (wytyczne): https://uzp.gov.pl

---

## ⚖️ DISCLAIMER

Po zakończeniu analizy: `view /mnt/skills/user/shared/DISCLAIMER.md` — wariant wg trybu (PRAWNIK/LAIK).
