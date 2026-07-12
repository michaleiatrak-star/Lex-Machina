# MOD-BUDOWA-ARGUMENTU — Obowiązkowy Schemat Budowy Każdego Argumentu

> **Plik:** `/mnt/skills/user/shared/MOD-BUDOWA-ARGUMENTU.md`
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:** W2.2 (redakcja pisma) — KAŻDY akapit uzasadnienia
> **Wywołanie:** `view /mnt/skills/user/shared/MOD-BUDOWA-ARGUMENTU.md`
> **Trigger:** OBOWIĄZKOWY dla każdego bloku uzasadnienia w piśmie procesowym

---

## DLACZEGO TEN MODUŁ ISTNIEJE

Pismo merytorycznie poprawne może przegrać z pismem strategicznie silniejszym,
jeśli brakuje mu warstwy retoryczno-procesowej. Różnica między "pismem prawniczym"
a "pismem wygrywającym" leży w schemacie budowy każdego argumentu:

- Słabe pismo: OPIS → PRAWO → koniec.
- Silne pismo: FAKT → DOWÓD → PRAWO → SKUTEK → ANTYCYPACJA → ZAMKNIĘCIE → WNIOSEK.

Ten moduł jest implementacją tej różnicy.

---

## SCHEMAT OBOWIĄZKOWY — 7 ELEMENTÓW

```
Per każdy blok uzasadnienia (roszczenie / teza główna):

[1] FAKT
    Jedno zdanie o tym, co się stało.
    Reguła: konkretny fakt, data, podmiot. Bez ocen.
    Wzorzec: "W dniu [data] [podmiot] [czynność]."

[2] DOWÓD
    Natychmiastowe powołanie dowodu (kl. A/B wg MOD-DOWODY D1).
    Reguła: powołanie musi być BEZPOŚREDNIO po fakcie — nie na końcu pisma.
    Wzorzec: "(Dowód: [nazwa] — [lokalizacja], na okoliczność: [co wykazuje])"
    ⚠️ Fakt bez dowodu = poziom D — najsłabszy możliwy.

[3] PODSTAWA PRAWNA
    Konkretny przepis z numerem Dz.U. (zweryfikowany w W3.1).
    Reguła: przepis musi być spójny z PRZESŁANKĄ — nie tylko z tematem.
    Wzorzec: "Zgodnie z art. X §Y [ustawa] (Dz.U. [rok] poz. [nr] t.j.), [treść przesłanki]."
    ⚠️ Nie: "Na podstawie KP" — zawsze konkretny artykuł i paragraf.

[4] SKUTEK PROCESOWY
    Co z powyższego wynika dla tego postępowania.
    Reguła: jeden konkretny skutek — nie ogólne konkluzje.
    Wzorzec: "W konsekwencji [podmiot] jest zobowiązany do [konkret] / sąd winien ustalić [konkret]."
    ⚠️ Brak skutku = argument zamknięty, nie aktywny procesowo.

[5] ANTYCYPACJA ZARZUTU
    Przewidywany atak pełnomocnika przeciwnika + obalenie.
    Reguła: ZAWSZE po każdej tezie klasy 🔴/🟠 (z MOD-ATAK-NA-DRAFT D2).
    Wzorzec: "Pozwany może podnieść, że [zarzut]. Argument ten jest chybiony,
              albowiem [obalenie z dowodami/przepisem/orzecznictwem]."
    ⚠️ Brak antycypacji = zarzut bez obalenia = przeciwnik odpowiada jednym zdaniem.

[6] ZAMKNIĘCIE FURTKI (jeśli teza klasy 🔴/🟠)
    Alternatywna podstawa na wypadek nieuwzględnienia tezy głównej.
    Reguła: stosuj gdy teza ma ryzyko prawne >30% (wg D5 z MOD-ATAK-NA-DRAFT).
    Wzorzec: "Nawet gdyby Sąd nie podzielił powyższego stanowiska,
              to [alternatywna kwalifikacja prawna / alternatywna podstawa]
              prowadzi do tego samego skutku, ponieważ [argumentacja]."
    ⚠️ Bez zamknięcia furtki: oddalenie tezy głównej = koniec roszczenia.

[7] WNIOSEK CZĄSTKOWY
    Jedno zdanie konkluzji dla Sądu — co Sąd ma zrobić z tym argumentem.
    Wzorzec: "Mając na uwadze powyższe, Sąd winien / powód wnosi o [konkret]."
    Reguła: każdy blok kończy się wnioskiem — nie opisem.
```

---

## KLASYFIKACJA ARGUMENTÓW PRZED REDAKCJĄ (obowiązkowa)

Przed napisaniem bloku oceń siłę argumentu:

```
A — PRAKTYCZNIE PEWNY
    Oparty na przepisie bezwzględnie obowiązującym + dokumencie kl. A.
    Strategia: napisz jako fakt oczywisty; nie subtelizuj; sąd widzi od razu.
    Kolejność: ZAWSZE na początku uzasadnienia.

B — BARDZO MOCNY
    Silna podstawa prawna + dowód kl. B lub wiele dowodów kl. C.
    Strategia: pełny schemat 7-elementowy; antycypacja obowiązkowa.
    Kolejność: po argumencie A.

C — POMOCNICZY
    Wspiera tezę A lub B, ale sam niewystarczający.
    Strategia: używaj jako wzmocnienie, nie jako samodzielną tezę główną.
    Kolejność: wewnątrz bloku A lub B jako element [2]/[5].

D — AWARYJNY
    Słaba podstawa lub brak bezpośredniego dowodu.
    Strategia: zaznacz jako żądanie ewentualne; złóż wniosek o dowód (art. 248 KPC).
    Kolejność: ZAWSZE na końcu lub jako żądanie ewentualne w petitum.
    ⚠️ Nigdy nie otwieraj pismem argumentem D.
```

---

## KOLEJNOŚĆ BLOKÓW W UZASADNIENIU

```
ZASADA OPTYMALNEJ KOLEJNOŚCI:

[1] Argument A — "szybkie zwycięstwo" (sąd widzi natychmiast)
    → maximally niepodważalny; przerzuca ciężar dowodu na pozwanego

[2] Argument B — "twarda podstawa"
    → pełny schemat 7-elementowy; antycypacja kluczowa

[3] Argument B (dodatkowy, jeśli jest)
    → niezależna podstawa alternatywna (każde roszczenie min. 2 podstawy)

[4] Argumenty C — "wzmocnienie"
    → jako część bloków A/B lub oddzielny akapit wspierający

[5] Zamknięcia furtki
    → na końcu każdego bloku 🔴/🟠 lub jako oddzielny blok "ewentualnie"

[6] Argumenty D — wyłącznie jako żądania ewentualne
    → "Na wypadek gdyby Sąd nie uwzględnił powyższego, powód wnosi ewentualnie o..."

Reguła priorytetu: nie zaczynaj nigdy od argumentu C lub D.
Reguła niezależności: każde główne roszczenie musi mieć ≥2 niezależne podstawy.
```

---

## KONTROLA PRZED WPISANIEM DO PISMA

```
Per każdy blok — przed wpisaniem sprawdź:

BA-CHECK-1: Czy mam dowód kl. A lub B dla elementu [2]?
  TAK → wpisz; NIE → złóż wniosek art. 248 KPC i zaznacz ryzyko

BA-CHECK-2: Czy przepis w [3] jest zweryfikowany online (W3.1)?
  TAK → wpisz; NIE → ⚠️ placeholder [WERYFIKACJA W3]

BA-CHECK-3: Czy element [4] (skutek) jest konkretny — nie ogólny?
  "Sąd winien ustalić stosunek pracy" ✅
  "Wynika z powyższego, że..." ❌ → przepisz

BA-CHECK-4: Czy antycypacja [5] jest wbudowana dla klasy 🔴/🟠?
  TAK → wpisz; NIE → dodaj lub przesuń do sekcji antycypacji

BA-CHECK-5: Czy argument kończy się wnioskiem [7] — nie opisem?
  ✅ kończy się zdaniem "Sąd winien / powód wnosi o..."
  ❌ kończy się opisem → dodaj zdanie wniosku

BA-CHECK-6: Klasyfikacja A/B/C/D — czy blok jest na właściwym miejscu?
  A/B → mogą być pierwsze; C/D → nie otwierają pisma
```

---

## INTEGRACJA Z PIPELINE pisma-procesowe-v3

```
W1.2a (CLAIM-VALIDATION): klasyfikuj każde twierdzenie A/B/C/D
W1.3 (mapa teza→przesłanka→dowód): uzupełnij o element [4] SKUTEK per teza
W2.1 (moduły): wczytaj ten moduł PRZED redakcją W2.2
W2.2 (redakcja): KAŻDY akapit = schemat 7-elementowy
W2.3 (placeholdery): brak elementu [2]/[3]/[4] = ⬛ LUKA-BA
W2.4 (ATAK-NA-DRAFT): D2 sprawdza element [5]; D5 sprawdza element [6]
W3 (walidacja): element [3] weryfikowany online w W3.1

⛔ ZAKAZ: Nie generuj .docx bez schematu 7-elementowego w każdym bloku klasy A/B.
⛔ ZAKAZ: Nie otwieraj uzasadnienia argumentem klasy C lub D.
⛔ ZAKAZ: Brak elementu [7] (wniosek cząstkowy) = blok niezamknięty = ⬛ LUKA-BA.
```
