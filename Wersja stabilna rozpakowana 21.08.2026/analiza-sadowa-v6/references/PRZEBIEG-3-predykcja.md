# PRZEBIEG 3 — KWALIFIKACJA PRAWNA, PREDYKCJA, STRATEGIA

> **Model:** Kontynentalny — odpowiednik uzasadnienia prawnego wyroku (KPC art. 327¹ §1 pkt 2 / KPK art. 424 §1 pkt 2)
> **Input:** wyłącznie BF + OA — zakaz sięgania do surowych dokumentów
> **Output:** RAPORT KOŃCOWY §1–§11
> **Zasada subsumpcji:** każda kwalifikacja prawna musi mieć odesłanie do BF lub OA

---

## ZASADA NADRZĘDNA PRZEBIEGU 3

Kwalifikacja prawna jest funkcją faktów (BF) i analizy (OA) — nie odwrotnie.
Sąd kontynentalny stosuje prawo do ustalonych faktów, a nie ustala fakty
pod z góry przyjętą kwalifikację.

> **Test subsumpcji:** „Czy wniosek prawny wynika z BF.E-X i OA.A-Y,
> czy z intuicji analityka?"
> Drugie → wróć do BF i OA, uzupełnij odesłania.

---

## P1 — PEŁNA KWALIFIKACJA PRAWNA (rozwinięcie OA.A1)

```
Przepis: [pełna treść ustawowa — weryfikacja ISAP przed wpisaniem]
Źródło ISAP: [URL]

Znamiona i ich status (z odesłaniem do OA.A1 i BF):

Z1 — [nazwa]: WYPEŁNIONE / WĄTPLIWE / NIEWYPEŁNIONE
     Podstawa: BF.E5.X (niesporne) lub BF.E6.Y + OA.A4.Z (sporne)
     Uzasadnienie: [max 3 zdania]

Z2 — [nazwa]: ...

[każde znamię osobno — obowiązkowe]
```

> Zakaz oceniania znamion bez odesłania do BF lub OA.
> Jeśli znamię nie ma podstawy w BF — wróć do P1 (Przebieg 1).

---

## P2 — ORZECZNICTWO (Filtr #2)

Wyłącznie z oficjalnych źródeł. Wyszukaj online przed wpisaniem.

```
[Sąd, DD.MM.RRRR, sygnatura, URL]
Teza: [parafrazowana, max 14 słów — nie cytat]
Zastosowanie: powiązanie z OA.A1.Z-X lub OA.A7a.Nr-Y
```

Maksymalnie 3 orzeczenia. Jeśli orzecznictwo jest rozbieżne — wskaż obie linie.

**Dozwolone źródła:**
- orzeczenia.ms.gov.pl — sądy powszechne
- sn.pl — Sąd Najwyższy
- trybunal.gov.pl — Trybunał Konstytucyjny
- nsa.gov.pl — Naczelny Sąd Administracyjny
- saos.org.pl — agregator (weryfikacja krzyżowa)

**Zakaz:** komentarze wydawnicze, blogi, LEX/Legalis bez weryfikacji w oficjalnym źródle,
orzeczenia bez sygnatury i daty, cytowanie z pamięci.

---

## P3 — TEST IN DUBIO (Filtr #8 — obowiązkowy dla spraw karnych i wykroczeniowych)

Dla każdego znamienia oznaczonego WĄTPLIWE w P1:

```
Znamię [nr] — [nazwa]:
  Status: PEWNE / WĄTPLIWE / NIEPEWNE
  Uzasadnienie: [z OA.A4 i BF.E6]
  Alternatywne wyjaśnienie z OA.A2: [TAK/NIE]

  Jeśli WĄTPLIWE lub NIEPEWNE:
  → Wątpliwość co do faktu: in dubio pro reo (KPK art. 5 §2)
  → Wątpliwość co do prawa: in dubio pro libertate
  → Wątpliwość co do zamiaru kierunkowego: zawsze na korzyść
  → Skutek: [uniewinnienie / umorzenie / wariant alternatywny]

KONKLUZJA in dubio:
  Wszystkie znamiona PEWNE → brak przeszkód in dubio dla skazania
  Choć jedno WĄTPLIWE → in dubio → uniewinnienie / łagodniejsza kwalifikacja
```

> Dla spraw cywilnych i pracowniczych: zamiast in dubio stosuj ciężar dowodu
> (art. 6 KC, art. 232 KPC) — kto nie udowodnił → ponosi skutki.

---

## P4 — PREDYKCJA ROZSTRZYGNIĘCIA

Opiera się wyłącznie na P1 + P2 + P3 + OA (bez sięgania do surowych dokumentów).

```
PREDYKCJA (model kontynentalny):

Wariant główny: [wynik] — prawdopodobieństwo [%]
  Uzasadnienie:
    Fakty podstawowe: BF.E5.X (niesporne) + OA.A4.Y (walor dowodów)
    Kwalifikacja: P1.Z1–ZN (wszystkie pewne / X wątpliwe)
    Czynnik decydujący: OA.A7a.Nr lub OA.A5.X (słabość krytyczna)

Wariant alternatywny: [wynik] — prawdopodobieństwo [%]
  Warunek zmiany: [co musiałoby się zmienić w OA lub BF]
  Odesłanie: OA.A8.X (sygnał proceduralny)

Kluczowy czynnik: [jedno zdanie — co zdecyduje]
```

---

## P5 — REKOMENDACJE PROCESOWE

Każda rekomendacja = konkretne działanie + podstawa prawna + odesłanie do OA/BF.

```
REKOMENDACJE:

1. [Działanie]
   Podstawa prawna: [przepis — zweryfikowany w ISAP]
   Uzasadnienie: OA.A5.X lub OA.A7a.Y
   Priorytet: Pilny / Ważny / Uzupełniający

2. [Działanie]
   ...

DZIAŁANIA OSTROŻNOŚCIOWE (czego unikać):
1. [działanie do unikania] — ryzyko: OA.A5b.X
```

---

## P6 — AUTOKOREKTA (Filtr #11)

Obowiązkowa przed finalizacją raportu.

```
AUTOKOREKTA PRZEBIEGU 3:

P1 ✓/✗ — Czy ocena zamiaru oparta jest na ≥3 elementach BF (OA.A2)?
P2 ✓/✗ — Czy sprawdzono alternatywne wyjaśnienie dla każdego dowodu (OA.A2)?
P3 ✓/✗ — Czy test in dubio przeprowadzono dla KAŻDEGO spornego znamienia (P1)?
P4 ✓/✗ — Czy sygnały proceduralne oceniono z dwiema interpretacjami (OA.A8)?
P5 ✓/✗ — Czy każde ustalenie faktyczne zweryfikowano WE WSZYSTKICH pismach (BF.E3)?

REGUŁA ODESŁAŃ:
P6 ✓/✗ — Czy każde ustalenie P1–P4 ma odesłanie do BF lub OA?

Jeśli którykolwiek = ✗ → wróć do odpowiedniego przebiegu.
```

---

## FORMAT RAPORTU KOŃCOWEGO

```
RAPORT ANALITYCZNY v6 — [Sygnatura / Sprawa]
Data: [DD.MM.RRRR] | Postępowanie: [rodzaj] | Etap: [etap]
Model: Kontynentalny (KPC art. 327¹ / KPK art. 424)
Przebiegi: P1 ✓ (BF: E1–E6) | P2 ✓ (OA: A1–A8) | P3 ✓ (§1–§11)

EXECUTIVE SUMMARY
[3 zdania: prognoza z % + kluczowy czynnik z OA.X + główna rekomendacja]

━━━ WARSTWA 1 — STAN FAKTYCZNY ━━━━━━━━━━━━━━━━━━━━━━━

§1.  CHRONOLOGIA I FAKTY NIESPORNE [z BF.E2 + BF.E5]
§2.  TWIERDZENIA SPORNE [z BF.E6]

━━━ WARSTWA 2 — OCENA ANALITYCZNA ━━━━━━━━━━━━━━━━━━━━

§3.  OCENA MATERIAŁU DOWODOWEGO [OA.A4]
§4.  STRONA PODMIOTOWA [OA.A2 + BF.E3]
§5.  SŁABOŚCI STRON [OA.A5 — symetrycznie]
§6.  SPRZECZNOŚCI V10 + PRZYZNANIA [OA.A7]
§7.  SYGNAŁY PROCEDURALNE [OA.A8]

━━━ WARSTWA 3 — KWALIFIKACJA PRAWNA I STRATEGIA ━━━━━━

§8.  KWALIFIKACJA PRAWNA I ZNAMIONA [P1 + odesłania do OA/BF]
§9.  ORZECZNICTWO [P2 — wyłącznie zweryfikowane]
§10. PREDYKCJA ROZSTRZYGNIĘCIA [P4]
§11. REKOMENDACJE + AUTOKOREKTA [P5 + P6]
```

---

## POWIĄZANIE Z MODUŁAMI SPECJALISTYCZNYMI W P3

Moduły uruchomione w P2 dostarczają wyniki do P3:

| Moduł | Wyniki z P2 | Zastosowanie w P3 |
|-------|-------------|-------------------|
| A — Błędy pełnomocnika | OA.A7b | §6 (sprzeczności), §10 (predykcja) |
| B — Groźba bezprawna | OA.B | §8 (znamiona art. 87 KC), §11 (rekomendacje) |
| C — Nagrania | OA.C | §3 (walor C/D), §8 (legalność jako dowód) |
| D — Podwójna kwalifikacja | OA.D | §8 (jeden fakt = jedna kwalifikacja) |
| E — Konto e-mail | OA.E | §8 (art. 267 KK lub uprawnienie pracodawcy) |
| F — Błędy własnego pełnomocnika | OA.F | §11 (rekomendacje ostrożnościowe) |
