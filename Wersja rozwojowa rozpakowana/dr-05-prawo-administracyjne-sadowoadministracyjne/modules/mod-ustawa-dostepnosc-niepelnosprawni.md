# mod-ustawa-dostepnosc-niepelnosprawni

**Akt:** PPSA — t.j. Dz.U. 2026 poz. 143 (zm. 2025/1882 od 2026-03-01 — art. 1, 2, 175; 2026/846 od 2026-06-26 — art. 53 § 1, 264 § 2; 2023/1860 [OD 2029-10-01: 2023/1860] — art. 66 (doręczenia)).
**Akt:** UPEA (ustawa o postępowaniu egzekucyjnym w administracji) — t.j. Dz.U. 2026 poz. 1311 (stan 2026-08-31; zm. 2026/1003 od 2026-10-28 — art. 17).
**Akt:** UDost (ustawa o zapewnianiu dostępności osobom ze szczególnymi potrzebami) — t.j. Dz.U. 2024 poz. 1411 (zm. 2024/731 od 2025-06-28 — art. 13, 36).
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1: terminy i progi porównane z t.j.).

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Ustawa o zapewnieniu dostępności — Dz.U. 2024 poz. 1411 t.j.
**Data weryfikacji online:** 2026-08-21 (F-89-class: mapa lokalna miała już
poprawny numer od 2026-08-14/F-31, ale TREŚĆ MODUŁU nigdy nie została
zaktualizowana do niego — rozjazd wykryty na przypomnienie użytkownika
o synchronizacji map, naprawiony teraz)

---

## 1. CORE

Zakres: dostępność architektoniczna, cyfrowa i informacyjno-komunikacyjna obiektów i usług podmiotów publicznych; obowiązki podmiotów publicznych; wniosek o zapewnienie dostępności; skarga do Prezesa PFRON; skarga do WSA; raport o stanie dostępności; PFRON — dofinansowanie.

**Akt:** Ustawa z 19.07.2019 r. o zapewnianiu dostępności osobom ze szczególnymi potrzebami — Dz.U. 2024 poz. 1411 t.j. (⚡ SKORYGOWANE 2026-08-21 — poprzednia wersja tego modułu błędnie cytowała dawny tekst jednolity z 2022 r., mimo że lokalna mapa dr-05/MAPA-AKTOW.md już od 2026-08-14 miała poprawny numer 2024.1411, zweryfikowany krzyżowo z dr-10).

⭐ **PODZIAŁ ZAKRESU Z dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-edukacja-specjalna-dostepnosc.md**
(uzupełniony 2026-08-21, F-45): TEN moduł (dr-05) — kątem administracyjno-
-proceduralnym, eskalacja do WSA; dr-10 — pełne omówienie trybu
trójstopniowego (informacja/wniosek/skarga PFRON) oraz styk z edukacją
specjalną. Sprawdź OBA przy pełnej analizie sprawy dostępnościowej.

---

## 2. INTAKE

```
□ Jaki podmiot publiczny: urząd / szkoła / szpital / sąd / transport publiczny?
□ Jakie naruszenie dostępności: architektoniczna / cyfrowa / informacyjna?
□ Czy złożono wniosek o zapewnienie dostępności?
□ Jaki jest termin na odpowiedź organu?
□ Czy sprawa dotyczy osoby z konkretną niepełnosprawnością?
```

---

## 3. PROCEDURA

```
✅ SKORYGOWANE 2026-08-21 — poprzednia wersja miała błędne terminy
(30/60 dni zamiast prawidłowych 14 dni/2 miesiące) i pomijała
obowiązkowy etap skargi do Prezesa PFRON przed WSA. Zweryfikowane 10+
źródeł (dostepnosc.pfron.org.pl, pfron.org.pl — oficjalne, gazetaprawna.pl
06.2026) — pełne odesłanie i cytaty w dr-10/mod-ustawa-edukacja-specjalna-
dostepnosc.md, sekcja B.

WNIOSEK O ZAPEWNIENIE DOSTĘPNOŚCI (art. 29-30 ustawy):
  → Do podmiotu publicznego, przez osobę ze szczególnymi potrzebami LUB
    przedstawiciela ustawowego, po wykazaniu interesu FAKTYCZNEGO
  → Termin rozpatrzenia: **14 DNI** (nie 30!), przedłużalny do **2 MIESIĘCY**
    z powiadomieniem wnioskodawcy o nowym terminie i przyczynach

SKARGA DO PREZESA ZARZĄDU PFRON (art. 32-33 ustawy) — ⭐ OBOWIĄZKOWY
ETAP POŚREDNI, pominięty w poprzedniej wersji tego modułu:
  → Termin: 30 dni od upływu terminu na wniosek/otrzymania odmowy
  → Postępowanie JEDNOINSTANCYJNE, decyzja nakazowa (min. 30/60 dni na
    realizację)
  → Egzekucja: grzywna w celu przymuszenia (UPEA)

SKARGA DO WSA — dopiero PO decyzji Prezesa PFRON, nie zamiast niej:
  → Właściwość WYŁĄCZNA: Wojewódzki Sąd Administracyjny w WARSZAWIE
    (nie WSA lokalny wg miejsca zamieszkania — częsty błąd praktyczny)
  → Tryb PPSA ogólny (skarga na decyzję administracyjną)

OBOWIĄZKI PODMIOTÓW PUBLICZNYCH (weryfikuj aktualne przepisy w ELI (RZĄD 1)):
  □ Dostępność architektoniczna (bez barier fizycznych)
  □ Dostępność cyfrowa (WCAG 2.1 — strony internetowe i aplikacje mobilne)
  □ Dostępność informacyjno-komunikacyjna (alternatywne formaty, tłumacz migowy)
```

---

## 4. STRATEGIA, QUALITY GATE, OUTPUT

**Strategia:** Wniosek o dostępność = skuteczniejszy i szybszy niż skarga. Dokumentuj każdą barierę fotograficznie. RPO może interweniować w sprawach systemowych.

**Quality gate:** Podmiot publiczny? Wniosek złożony? Termin 14 dni/2 miesiące dotrzymany? Skarga do PFRON wniesiona PRZED WSA? Aktualne przepisy z ISAP?

**Output:** Kwalifikacja → wniosek → (brak reakcji) → skarga do Prezesa PFRON → (brak wykonania nakazu) → skarga do WSA w Warszawie.

**Powiązania:** `dr-04` → `mod-ustawa-rehabilitacja-PFRON` | `mod-ustawa-RPO` | `pisma-procesowe-v3` | `dr-10/mod-ustawa-edukacja-specjalna-dostepnosc` (pełne omówienie trybu + styk z edukacją specjalną)

**Źródła:** https://ELI (RZĄD 1)/isap.nsf/DocDetails.xsp?id=WDU20190001696 (akt pierwotny) — zweryfikuj aktualny t.j. w ISAP przed cytowaniem
