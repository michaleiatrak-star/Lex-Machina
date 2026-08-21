# MOD-PEER-REVIEW — weryfikacja krzyżowa pisma przed złożeniem

> Wersja: 1.0.0 | Typ: moduł jakości | shared/
> Wywoływany z: pisma-procesowe-v3 (W3, krok W3.7 — po HYBRID-VALIDATION)
> Opcjonalny: TAK — aktywuj gdy pismo ma status GOTOWE DO ZŁOŻENIA i dotyczy
>             sprawy o wartości powyżej progu istotności lub wysokiego ryzyka
> Podstawa ekspercka: Suntum ALI-ABA 2007 ("No pleading of substance leaves
> the office without first being freely circulated to at least one other attorney.")
> Scalia/Garner: "Spend time getting your arguments — review each fact and how
> it correlates to a legal claim or defense."

---

## 1. Cel

Moduł symuluje "drugiego adwokata" — niezależny przegląd pisma z perspektywy:
- adwokata diabła (co zaatakuje przeciwnik?),
- sędziego (co wzbudzi wątpliwości sądu?),
- klienta (czy pismo realizuje jego interes, nie tylko formalne żądania?).

Silnik jest single-agent — peer review realizowany jest przez wywołanie
`analiza-sadowa-v6` w trybie weryfikacji krzyżowej na gotowym piśmie z W3.

---

## 2. Warunek aktywacji

```
AKTYWUJ MOD-PEER-REVIEW gdy WSZYSTKIE są prawdą:
  ✓ Pismo ma status GOTOWE DO ZŁOŻENIA (W3.6 zamknięte)
  ✓ Co najmniej jedno z:
    - wartość przedmiotu sporu > 50 000 zł, LUB
    - pismo zawiera ≥3 żądania, LUB
    - pismo jest apelacją / zażaleniem do SN/SA, LUB
    - użytkownik wpisał "peer review" / "sprawdź jeszcze raz" / "adwokat diabła"

NIE AKTYWUJ gdy:
  - pisma-proste-v2 (pisma jednotemowe — peer review nadmiarowy)
  - użytkownik wyraźnie rezygnuje: "pomiń peer review" / "złóż bez weryfikacji"
```

---

## 3. Protokół peer review — 4 role

### ROLA 1 — Adwokat diabła (perspektywa przeciwnika)

```
Przeczytaj pismo jak pełnomocnik strony pozwanej / wnioskodawcy.
Odpowiedz na pytania:

PR-A1: Które twierdzenie faktyczne najłatwiej podważyć i dlaczego?
PR-A2: Które żądanie jest najsłabiej uargumentowane?
PR-A3: Czy pismo zawiera przyznanie niekorzystne (choćby ukryte)?
        → "Choć pracownik spóźniał się, to..." = przyznanie spóźnień
PR-A4: Czy jest zdanie, które — wyrwane z kontekstu — szkodzi klientowi?
PR-A5: Czy jest argument, który można obrócić przeciwko stronie składającej?

Format: lista ATAK-[nr]: [cytat lub opis] → [jak zaatakować]
```

### ROLA 2 — Sędzia (perspektywa sądu)

```
Przeczytaj pismo jak sędzia z 15-minutowym budżetem na sprawę.

PR-B1: Czy po przeczytaniu pierwszych 2 akapitów wiem o co chodzi?
        NIE → brak executive summary / intro — wróć do MOD-INTRO
PR-B2: Czy żądania są precyzyjne i wykonalne (mogę je wpisać do sentencji)?
PR-B3: Czy każde twierdzenie ma dowód wprost wskazany w piśmie?
PR-B4: Czy pismo jest dłuższe niż potrzeba? Gdzie można skrócić?
        → użyj MOD-KONCENTRACJA do weryfikacji limitu stron
PR-B5: Czy język jest procesowy, czy publicystyczny?

Format: lista UWAGA-SĄDU-[nr]: [kwestia] → [rekomendacja]
```

### ROLA 3 — Klient (perspektywa interesu)

```
Przeczytaj pismo jak klient, który nie zna prawa, ale zna swoją sprawę.

PR-C1: Czy pismo opisuje to, co faktycznie się wydarzyło — a nie konstrukcję prawną
        oderwana od rzeczywistości?
PR-C2: Czy wszystkie żądania klienta zostały uwzględnione (lista z W1)?
PR-C3: Czy pismo nie ujawnia informacji, których klient nie chciał ujawniać
        (np. słabości finansowej, problemów wewnętrznych, innych sporów)?
PR-C4: Czy pismo jest spójne z wcześniejszą korespondencją i zeznaniami klienta?

Format: lista INTERES-KLIENTA-[nr]: [kwestia] → [rekomendacja]
```

### ROLA 4 — Audyt wewnętrznej spójności (automatyczny)

```
PR-D1: Czy teza z W1.2 jest widoczna w piśmie (wprowadzenie + konkluzja)?
PR-D2: Czy kolejność argumentów = kolejność od najsilniejszego (QUALITY-CHECK §2)?
PR-D3: Czy argument przeciwnika jest uprzedzony i obalony?
PR-D4: Czy pismo "da się streścić w trzech zdaniach" (QUALITY-CHECK §2)?
        → zrób próbę: [zdanie 1 — kto i co]; [zdanie 2 — dlaczego ma rację];
          [zdanie 3 — czego żąda]
        NIE → pismo nie ma wyraźnej osi — wymaga przepisania W2

Format: lista SPÓJNOŚĆ-[nr]: [wynik TAK/NIE] + uwaga
```

---

## 4. Raport peer review (format wyjściowy)

```
RAPORT MOD-PEER-REVIEW
═══════════════════════════════════════════════════════════
Pismo:      [typ] | Sprawa: [sygn./opis] | Data: [data]
Weryfikacja: pisma-procesowe-v3 W3.7
═══════════════════════════════════════════════════════════

ROLA 1 — Adwokat diabła:
  [lista ATAK-n lub "brak krytycznych luk"]

ROLA 2 — Sędzia:
  PR-B1 (intro): [✅ JASNE / ⚠️ NIEJASNE — wymaga MOD-INTRO]
  PR-B4 (długość): [✅ OK / ⚠️ ZA DŁUGIE — sprawdź MOD-KONCENTRACJA]
  [lista UWAGA-SĄDU-n]

ROLA 3 — Klient:
  [lista INTERES-KLIENTA-n lub "brak zastrzeżeń"]

ROLA 4 — Spójność:
  Teza widoczna: [TAK/NIE]
  3-zdaniowe streszczenie: [próba lub "nie udało się — wymaga przepisania osi"]
  Argument przeciwnika uprzedzony: [TAK / NIE / CZĘŚCIOWO]
  [lista SPÓJNOŚĆ-n]

═══════════════════════════════════════════════════════════
WYNIK PEER REVIEW:
  ✅ PEER-OK    — pismo gotowe bez zastrzeżeń
  ⚠️ PEER-UWAGI — pismo gotowe, uwagi do rozważenia przed złożeniem
  🔴 PEER-STOP  — pismo wymaga korekty przed złożeniem (ATAK-n krytyczny
                  lub PR-B1=NIEJASNE lub PR-D4=NIE)
═══════════════════════════════════════════════════════════
```

---

## 5. Integracja z pipeline

```
W3.5 HYBRID-VALIDATION
  ↓
W3.6 Pismo finalne
  ↓
W3.7 MOD-PEER-REVIEW (gdy warunek aktywacji spełniony)
  view /mnt/skills/user/shared/MOD-PEER-REVIEW.md
  → Wykonaj 4 role
  → Wyświetl RAPORT MOD-PEER-REVIEW
  → Wynik PEER-OK lub PEER-UWAGI → generuj .docx
  → Wynik PEER-STOP → powróć do W2 z listą korekt
  ↓
W3.8 (po PEER-OK) → .docx → present_files
```
