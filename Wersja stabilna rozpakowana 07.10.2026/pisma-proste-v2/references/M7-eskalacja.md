# M7 — Eskalacja i Orzecznictwo — stub

*Ładuj gdy sprawa może wymagać pisma-procesowe-v3 lub orzecznictwa SN.*

---

## KIEDY ESKALOWAĆ DO pisma-procesowe-v3 (obowiązkowo)

```
□ Więcej niż jedno żądanie procesowe (nawet jeśli powiązane)
□ Więcej niż jedna podstawa prawna wymagająca analizy
□ Strona złożyła odpowiedź z argumentacją merytoryczną
□ Pismo jest odpowiedzią na argumentację prawną (nie tylko formalną)
□ Konieczna analiza orzecznictwa SN (>2 orzeczenia lub Kat. 3–4)
□ Pismo jest apelacją, skargą kasacyjną, odpowiedzią na pozew
  lub pismem przygotowawczym
□ Wymagane wyważenie kilku konkurujących podstaw prawnych
□ Sprawa dotyczy nieważności czynności prawnej lub jej wzruszenia
```

**Szablon komunikatu eskalacji:**
```
⚠ ESKALACJA DO pisma-procesowe-v3

Przyczyna: [konkretna przyczyna z listy powyżej]
Sprawa wymaga [opis złożoności].
Kontynuuję z użyciem pisma-procesowe-v3.
```

---

## KIEDY UŻYĆ ORZECZNICTWA

Pisma proste co do zasady **nie wymagają** orzecznictwa.
Wywołaj `orzeczenia-sadowe-v2` tylko w trzech sytuacjach:

```
SYTUACJA A — kwestionujesz zasadność roszczenia (np. przedawnienie)
  → max 1–2 orzeczenia Kat. 1 lub 2, tylko w UZASADNIENIU

SYTUACJA B — strona przeciwna powołała orzecznictwo
  → znajdź orzeczenia obalające jej linię; nigdy bez weryfikacji

SYTUACJA C — niestandardowy stan faktyczny
  → np. kwestionowanie właściwości sądu lub formy doręczenia
```

Orzecznictwo zawsze z weryfikacją w:
- `orzeczenia.ms.gov.pl`
- `sn.pl`
- `nsa.gov.pl`

**Nigdy nie cytuj sygnatur z pamięci.**

---

## POWIĄZANE SKILLE

| Potrzeba | Skill |
|---|---|
| Pismo wielowątkowe / apelacja | `pisma-procesowe-v3` |
| Weryfikacja orzecznictwa | `orzeczenia-sadowe-v2` |
| Analiza dowodów i pozycji procesowej | `analizator-dowodow-v3` |
| Analiza przepisu / wykładnia | `analizator-przepisow-v2` |
