# mod-ustawa-sygnalisci

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Ustawa o ochronie sygnalistów — Dz.U. 2024 poz. 928 (w życie: 25.09.2024)
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## ⚡ ALERT — NOWA USTAWA OD 25.09.2024

```
Ustawa z 14.06.2024 r. o ochronie sygnalistów (Dz.U. 2024 poz. 928)
  → Implementacja Dyrektywy UE 2019/1937
  → W życie: 25.09.2024 (kanały zewnętrzne) / 01.01.2025 (małe podmioty 50–249 pracowników)
  → Zastąpiła fragmentaryczną ochronę z KP i innych aktów
```

---

## 1. CORE

### Zakres
Ochrona sygnalistów zgłaszających naruszenia prawa w miejscu pracy; kanały wewnętrzne (u pracodawcy); kanały zewnętrzne (RPO, PIP, UOKiK, KNF, inne organy); kanał zewnętrzny do instytucji UE; zakaz działań odwetowych; ochrona danych sygnalisty; odpowiedzialność pracodawcy.

### Akty

| Akt | Dz.U. |
|---|---|
| Ustawa o ochronie sygnalistów | Dz.U. 2024 poz. 928 |
| Dyrektywa UE 2019/1937 | bezpośrednio stosowana pomocniczo |

---

## 2. INTAKE

```
□ Jaki rodzaj naruszenia: prawo pracy / korupcja / BHP / prawo podatkowe / ochrona środowiska /
  zamówienia publiczne / ochrona konsumentów / inne?
□ Czy naruszenie mieści się w zakresie dyrektywy/ustawy?
□ Który kanał zgłoszenia wybrać: wewnętrzny (pracodawca) / zewnętrzny (organ) / jawny?
□ Czy nastąpiły już działania odwetowe (zwolnienie, pominięcie awansu, szykana)?
□ Jaki status prawny sygnalisty: pracownik / zleceniobiorca / samozatrudniony / b. pracownik?
□ Czy sygnalista jest gotowy ujawnić tożsamość?
```

---

## 3. PROCEDURA

### Kanały zgłoszenia

```
WEWNĘTRZNY (do pracodawcy):
  → Pracodawcy ≥ 50 pracowników muszą mieć procedurę wewnętrzną
  → Termin na odpowiedź: 7 dni na potwierdzenie przyjęcia + 3 miesiące na informację
    o podjętych działaniach (weryfikuj w ustawie)
  → Sygnalista nie ma obowiązku korzystania z kanału wewnętrznego

ZEWNĘTRZNY (do organów publicznych):
  → RPO (bip.brpo.gov.pl) — organ centralny
  → PIP (pip.gov.pl) — naruszenia prawa pracy
  → UOKiK — ochrona konsumentów / nieuczciwa konkurencja
  → KNF — sektor finansowy
  → inne organy branżowe — weryfikuj właściwość

KANAŁ JAWNY (ujawnienie publiczne):
  → Dopuszczalne gdy: brak działania organów po zgłoszeniu wewnętrznym/zewnętrznym
    LUB bezpośrednie i oczywiste zagrożenie interesu publicznego
    LUB działania odwetowe
```

### Ochrona sygnalisty — zakres

```
ZAKAZ DZIAŁAŃ ODWETOWYCH (art. 12 ustawy — weryfikuj w ISAP):
  → Zakaz zwolnienia, degradacji, pominięcia awansu
  → Zakaz szykanowania, izolacji, mobbingu
  → Zakaz ujawnienia tożsamości sygnalisty
  → Domniemanie: działanie po zgłoszeniu = działanie odwetowe (ciężar obalenia na pracodawcy)

OCHRONA TOŻSAMOŚCI:
  → Dane sygnalisty: objęte ochroną — nie ujawnia się bez zgody
  → Wyjątek: wymogi postępowania sądowego

OCHRONA MAJĄTKOWA SYGNALISTY (przy działaniach odwetowych):
  → Prawo do odszkodowania (min. 3-krotność średniego wynagrodzenia — weryfikuj w ustawie)
  → Przywrócenie do pracy lub równoważna ochrona
```

---

## 4. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Złożenie zgłoszenia | Potwierdzenie przyjęcia / UPO | organ/pracodawca | wysoka | — | zachowaj kopię ze znacznikiem czasu |
| Działanie odwetowe po zgłoszeniu | Data zgłoszenia vs data działania odwetowego | korespondencja | wysoka | związek przyczynowy | dokumentuj chronologię |
| Naruszenie prawa (treść zgłoszenia) | Dokumenty, e-maile, screenshoty | wnioskodawca | wysoka | brak dostępu | wnioskuj o zabezpieczenie |

---

## 5. STRATEGIA

### Perspektywa sygnalisty

1. Zbierz dowody naruszenia ZANIM złożysz zgłoszenie — po zgłoszeniu dostęp do dokumentów może być utrudniony.
2. Zachowaj potwierdzenie złożenia zgłoszenia z datą.
3. Dokumentuj każde działanie pracodawcy po zgłoszeniu — domniemanie odwetu działa na korzyść.
4. Kanał zewnętrzny (RPO/PIP) daje pełną ochronę i jest bezpłatny.

### Perspektywa pracodawcy

1. Wdróż procedurę wewnętrzną (obowiązek przy ≥ 50 pracowników).
2. Zachowaj poufność tożsamości sygnalisty.
3. Dokumentuj uzasadnienie wszelkich decyzji kadrowych po wpłynięciu zgłoszenia.

---

## 6. QUALITY GATE / OUTPUT

**Quality gate:** Naruszenie w zakresie dyrektywy? Właściwy kanał wybrany? Ochrona tożsamości zachowana? Aktualna ustawa z ISAP?

**Output:** 1. Kwalifikacja (zakres naruszenia / kanał); 2. Procedura zgłoszenia; 3. Ochrona sygnalisty; 4. Działania odwetowe (dowody i roszczenia); 5. Rekomendacja.

**Powiązania:** `mod-ustawa-RPO` | `dr-04` → `mod-ustawa-PIP-inspekcja-pracy` | `dr-04` → `mod-KP-prawo-pracy` | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000928 | https://bip.brpo.gov.pl (zgłoszenia sygnalistów)
