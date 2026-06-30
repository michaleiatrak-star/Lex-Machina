# MODUŁ SHARED-LEGAL-DESIGN — OCENA CZYTELNOŚCI I PRZEJRZYSTOŚCI
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** analiza regulaminów B2C, umów konsumenckich, OWU,
> dokumentów przeznaczonych dla niespecjalistów, pytanie o "czytelność",
> "przejrzystość", "zrozumiałość", ocena dla pro se lub laika.
> Trend wymagany przez KE, OECD, DSA, Omnibus i sądy przy ocenie abuzywności.

---

## LD.1 METODOLOGIA — SCORING CZYTELNOŚCI

```
SKORING LEGAL DESIGN (5 wymiarów, 0–10 każdy, ŁĄCZNIE 0–50 → normalizacja 0–100):

D1. JĘZYK I STYL (0–10):
  10: prosty język, krótkie zdania, bez żargonu lub z definicjami
  7:  umiarkowany żargon, ale zrozumiały dla wykształconej osoby
  5:  prawniczy, ale konsekwentny
  3:  gęsty żargon, zdania wielokrotnie złożone
  0:  niezrozumiały bez pomocy prawnika

D2. STRUKTURA LOGICZNA (0–10):
  10: nagłówki, spis treści, numeracja paragrafów, logiczna kolejność
  7:  nagłówki + numeracja bez spisu treści
  5:  numery paragrafów bez nagłówków
  3:  bloki tekstu bez struktury
  0:  ciągły tekst bez podziałów

D3. DEFINICJE I POJĘCIA (0–10):
  10: wszystkie pojęcia zdefiniowane przy pierwszym użyciu lub w słowniku
  7:  większość pojęć zdefiniowana
  5:  kluczowe pojęcia zdefiniowane
  3:  mało definicji, pojęcia wieloznaczne
  0:  brak definicji

D4. OBOWIĄZKI I PRAWA — JEDNOZNACZNOŚĆ (0–10):
  10: każde prawo i obowiązek jasno przypisany do strony, z terminem
  7:  większość zobowiązań jednoznaczna
  5:  ogólne zobowiązania, nieprecyzyjne terminy
  3:  niejasne "może", "powinien", "dąży"
  0:  brak jasnych zobowiązań i praw

D5. SKUTKI PRAWNE DLA KONSUMENTA (0–10):
  10: konsument rozumie co się stanie jeśli nie zapłaci / naruszy / zerwie umowę
  7:  większość skutków jest jasna
  5:  skutki opisane ale wymaga interpretacji
  3:  skutki ukryte w odesłaniach / małym drukiem
  0:  konsument nie może ustalić konsekwencji

WYNIK ŁĄCZNY:
  40–50 (80–100%): WYSOKA CZYTELNOŚĆ ✅ Spełnia standardy KE/Omnibus
  30–39 (60–79%): UMIARKOWANA ⚠️ Wymaga poprawek przed wdrożeniem B2C
  20–29 (40–59%): NISKA 🟠 Ryzyko uznania klauzul za abuzywne
  <20 (<40%):     KRYTYCZNA 🔴 Niezgodna z wymogami Omnibus/DSA/93/13
```

---

## LD.2 LISTA KONTROLNA LEGAL DESIGN

```
OCENIANE ELEMENTY:

□ DŁUGOŚĆ ZDAŃ: przeciętne zdanie < 25 słów?
  → Jeśli NIE: wskaż najdłuższe zdania i zaproponuj skrócenie

□ TERMINOLOGIA: czy zastosowano definicje dla kluczowych pojęć?
  → "Usługa", "Użytkownik", "Platforma", "Dane" — muszą być zdefiniowane

□ AKTYWNA STRONA: czy zobowiązania pisane stroną czynną ("Sprzedawca dostarczy"
  vs. "Dostawa będzie zrealizowana")?
  → Strona bierna ukrywa zobowiązanego — wada

□ TERMINY I DATY: czy każde zobowiązanie ma termin ("w ciągu 14 dni")?
  → "Niezwłocznie", "w rozsądnym czasie" → niejasność = ryzyko sporu

□ MAŁE LITERY / MAŁE CZCIONKI: czy ważne klauzule wyróżnione?
  → Klauzule istotne dla konsumenta muszą być czytelne (Omnibus, 93/13)

□ ODESŁANIA: ile odesłań do innych dokumentów?
  → >3 poziomy odesłań (regulamin → załącznik → polityka → zewnętrzny akt) = problem

□ NUMERACJA: czy paragrafy mają numery i nagłówki?

□ SPIS TREŚCI: dla dokumentów > 5 stron — czy jest?

□ WIZUALIZACJE: czy tabele/schematy zastosowane gdzie pomocne (np. prawa vs obowiązki)?
```

---

## LD.3 WYMOGI PRAWNE DOTYCZĄCE CZYTELNOŚCI

```
DYREKTYWA 93/13/EWG art. 5: wymóg jasności i zrozumiałości klauzul
  → Klauzula niejasna → wątpliwości na korzyść konsumenta
  → Klauzula niezrozumiała → ryzyko uznania za abuzywną

DSA art. 14 ust. 1: warunki korzystania muszą być "jasne, czytelne i dostępne"
  → Wymóg wersji dla niepełnoletnich (jeśli platforma dostępna dla dzieci)

OMNIBUS (2019/2161): wymóg przejrzystości algorytmów, opinii, cen
  → Opisy cenowe muszą być zrozumiałe dla przeciętnego konsumenta

KC art. 385 §2: niejednoznaczne postanowienia wzorca → na korzyść konsumenta
  → Weryfikuj: isap.sejm.gov.pl → KC art. 385

RODO art. 12: informacja dla osoby, której dane dotyczą: "w zwięzłej, przejrzystej,
  zrozumiałej i łatwo dostępnej formie, jasnym i prostym językiem"
  → Polityki prywatności: oceniaj wg tej zasady
```

---

## LD.4 KONKRETNE POPRAWKI — FORMAT

```
Dla każdego wykrytego problemu legal design generuj:

🔍 PROBLEM LEGAL DESIGN: [opis]
📍 LOKALIZACJA: §X lub [cytat pierwszych 10 słów klauzuli]
📊 WYMIAR: D1/D2/D3/D4/D5 · WAGA: niska/średnia/wysoka

ORYGINAŁ: "[fragment problematyczny]"

PROPONOWANA ZMIANA:
"[uproszczone brzmienie]"

UZASADNIENIE: [dlaczego to ważne — wymóg 93/13, Omnibus, KC art. 385 §2]
```

---

## LD.5 FORMAT SEKCJI LEGAL DESIGN W RAPORCIE

```
━━━ OCENA LEGAL DESIGN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ WYNIK: [XX/50] = [XX]%   POZIOM: [WYSOKA/UMIARKOWANA/NISKA]    │
├───────────────────────────────────────────────────────────────│
│ D1 Język i styl          │ [X/10] │ [opis]                    │
│ D2 Struktura logiczna    │ [X/10] │ [opis]                    │
│ D3 Definicje i pojęcia   │ [X/10] │ [opis]                    │
│ D4 Jednoznaczność zobowiązań│[X/10]│ [opis]                   │
│ D5 Skutki dla konsumenta │ [X/10] │ [opis]                    │
├───────────────────────────────────────────────────────────────│
│ TOP 3 PROBLEMY:                                               │
│  1. [§X] [opis problemu] → [propozycja uproszczenia]         │
│  2. [§X] ...                                                  │
│  3. [§X] ...                                                  │
├───────────────────────────────────────────────────────────────│
│ ZGODNOŚĆ: DSA/93/13/Omnibus/KC 385 §2 — [TAK/NIE/CZĘŚCIOWO] │
│ REKOMENDACJA: [działanie do podjęcia]                        │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## LD.6 INTEGRACJA Z MODUŁEM ABUSIVE

```
Klauzula niejasna (D3/D4 < 5) + podejrzana o abuzywność:
  → Łącz wynik LD z oceną AB (mod-shared-abusive-clauses.md)
  → Niejasność = dodatkowy argument za abuzywnością (KC art. 385 §2)
  → Format wspólny: [ABUZYWNA + NIEJASNA → RYZYKO PODWYŻSZONE]
```

---

*mod-shared-legal-design.md · Analizator Umów v1 · Legal Design & Readability*
*Wymogi: DSA art.14 · 93/13/EWG art.5 · KC art.385 §2 · Omnibus 2019/2161 · RODO art.12*
