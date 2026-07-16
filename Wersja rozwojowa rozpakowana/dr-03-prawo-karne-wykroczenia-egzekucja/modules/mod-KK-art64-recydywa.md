# Recydywa i powrót do przestępstwa (art. 64-65 KK) v1.0.0 (dodany 2026-07-16)

> ⛔ Do 2026-07-16 recydywa nie miała żadnego dedykowanego omówienia w
> dr-03 (0 wystąpień "art. 64" w całym module) — mimo że jest przesłanką
> zaostrzającą przywoływaną krzyżowo w kilku innych modułach (zawieszenie
> wykonania kary, warunkowe zwolnienie). Ten moduł naprawia lukę.
> ⚠️ Terminy zweryfikowane 2026-07-16 — do potwierdzenia na
> isap.sejm.gov.pl przed użyciem w piśmie (PRAWO-HARDGATE).

---

## DRZEWO R.1 — RECYDYWA SPECJALNA PODSTAWOWA (art. 64 §1 KK)

```
START: Czy sprawca był już wcześniej skazany?
│
├─ NIE → recydywa NIE zachodzi (pierwszy raz w konflikcie z prawem)
│
└─ TAK → sprawdź WSZYSTKIE poniższe przesłanki ŁĄCZNIE:
   │
   ├─ 1. Poprzednie skazanie: za przestępstwo UMYŚLNE, na karę
   │     pozbawienia wolności
   │
   ├─ 2. Sprawca ODBYŁ co najmniej 6 miesięcy tej kary (nie: orzeczono —
   │     ODBYŁ; sama kara zawieszona bez zarządzenia wykonania NIE
   │     wypełnia tej przesłanki)
   │
   ├─ 3. Nowy czyn: UMYŚLNE przestępstwo PODOBNE do poprzedniego
   │     (art. 115 §3 KK definiuje "przestępstwo podobne" — należące
   │     do tego samego rodzaju, popełnione z użyciem przemocy/groźby,
   │     lub w celu osiągnięcia korzyści majątkowej — sprawdź definicję
   │     ustawową, nie potoczne rozumienie "podobieństwa")
   │
   └─ 4. Czasowo: w ciągu 5 LAT od odbycia co najmniej 6 miesięcy
        poprzedniej kary

   → Jeśli WSZYSTKIE 4 przesłanki spełnione → art. 64 §1 KK: sąd MOŻE
     wymierzyć karę przewidzianą za przypisane przestępstwo w wysokości
     do górnej granicy ustawowego zagrożenia zwiększonego o połowę
     (fakultatywne zaostrzenie, nie obligatoryjne)
```

⚠️ **Przesłanka 3 (podobieństwo czynów) jest najczęstszym źródłem błędu**
— art. 115 §3 KK definiuje przestępstwo podobne jako należące do tego
samego rodzaju ALBO popełnione z zastosowaniem przemocy lub groźby jej
użycia ALBO popełnione w celu osiągnięcia korzyści majątkowej. Kradzież
(mienie) i rozbój (przemoc + mienie) mogą być "podobne" na dwóch
niezależnych podstawach jednocześnie — ale kradzież i np. znieważenie
zwykle NIE są podobne (różny rodzaj, brak wspólnego kryterium z art. 115 §3).

---

## DRZEWO R.2 — RECYDYWA WIELOKROTNA / MULTIRECYDYWA (art. 64 §2 KK)

```
START: Czy sprawca spełnia przesłanki recydywy z §1 (patrz DRZEWO R.1)
       ORAZ dodatkowo:
│
├─ Był już WCZEŚNIEJ skazany w warunkach recydywy z §1 (tj. to już
│  DRUGI powrót do podobnego przestępstwa w warunkach art. 64)
│
├─ Odbył ŁĄCZNIE co najmniej 1 ROK kary pozbawienia wolności
│  (sumarycznie z poprzednich skazań objętych recydywą)
│
└─ Nowy czyn: umyślne przestępstwo przeciwko życiu/zdrowiu, wolności,
   wolności seksualnej, mieniu, obrotowi gospodarczemu, bezpieczeństwu
   powszechnemu, przy użyciu przemocy lub groźby jej użycia (katalog
   zamknięty rodzajowo — węższy niż w §1)

   → Jeśli spełnione → art. 64 §2 KK: sąd WYMIERZA karę powyżej DOLNEJ
     granicy ustawowego zagrożenia (obligatoryjne podwyższenie minimum,
     nie fakultatywne jak w §1), a może wymierzyć do górnej granicy
     zwiększonej o połowę
```

⚠️ **Różnica kluczowa §1 vs §2:** w §1 zaostrzenie górnej granicy jest
FAKULTATYWNE ("sąd może"); w §2 podwyższenie DOLNEJ granicy jest
OBLIGATORYJNE ("sąd wymierza karę powyżej dolnej granicy") — to częsty
błąd w pismach, gdzie oba reżimy są traktowane jednakowo.

---

## 3. WPŁYW RECYDYWY NA INNE INSTYTUCJE (cross-cutting)

Recydywa z art. 64 §1/§2 nie działa w próżni — modyfikuje progi
i dostępność innych instytucji w tym samym KK:

| Instytucja | Wpływ recydywy | Moduł |
|---|---|---|
| Warunkowe zawieszenie wykonania kary | art. 64 §1 → zawieszenie WYŁĄCZONE (art. 69 §4), poza wyjątkiem szczególnie uzasadnionym | `mod-KK-art69-84-warunkowe-zawieszenie-zwolnienie.md` DRZEWO Z.1 |
| Warunkowe przedterminowe zwolnienie | próg z 1/2 → 2/3 kary (§1) lub 3/4 kary (§2) | `mod-KK-art69-84-warunkowe-zawieszenie-zwolnienie.md` DRZEWO Z.2 |
| Okres próby (zawieszenie/zwolnienie) | wydłużony do 2-5 lat zamiast standardowego | j.w. |
| Dozór kuratora | obligatoryjny wobec recydywisty z §2 | `mod-KKW-kodeks-karny-wykonawczy.md` |

---

## 4. TERMIN PRZEDAWNIENIA SKAZANIA DLA POTRZEB RECYDYWY (art. 64 §3 KK)

Nie można powoływać się na poprzednie skazanie w ramach recydywy, jeśli
od uprzedniego odbycia kary (w całości lub części, albo od
darowania/przedawnienia jej wykonania) upłynęło **10 lat**. Praktyczna
konsekwencja: recydywa "wygasa" jako przesłanka po dekadzie od odbycia
poprzedniej kary, niezależnie od liczby wcześniejszych skazań.

---

## CROSS-REFERENCJE

- Warunkowe zawieszenie / przedterminowe zwolnienie (progi zależne od
  recydywy) → `mod-KK-art69-84-warunkowe-zawieszenie-zwolnienie.md`.
- Definicja "przestępstwa podobnego" (art. 115 §3 KK) — sprawdzaj przy
  KAŻDEJ analizie recydywy, nie zakładaj z pamięci → weryfikuj pełne
  brzmienie na isap.sejm.gov.pl.
- Kwalifikacja czynu bazowego (potrzebna przed analizą recydywy) →
  `mod-KK-kwalifikator-karnomaterialny.md`.
