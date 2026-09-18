# MODUŁ: POST-VALIDATION — Walidacja spójności po wygenerowaniu pisma

## KIEDY URUCHOMIĆ

Po wygenerowaniu pisma i zakończeniu walidacji formalnej (M8-checklista / MOD-WALIDACJA),
**przed** finalną prezentacją (M9-format / wydaniem pisma).

Uruchamiaj ZAWSZE — niezależnie od tego czy pismo miało ⬛ pola czy nie.

---

## BLOCK ZERO — ⛔ FAKTY I ŹRÓDŁA (BRAMKA — przed ofertą walidacji)

> ⛔ HARD GATE — wykonaj PRZED Fazą 1 (ofertą walidacji).
> Jeśli pismo bez materiałów źródłowych użytkownika → pomiń Block Zero.

```
BLOK 0.1 — Czy pismo generowane z materiałów użytkownika?
  NIE → pomiń Block Zero, przejdź do Fazy 1
  TAK → wykonaj 0.2

BLOK 0.2 — Czy HYBRID-VALIDATION Block Zero przeszedł pomyślnie (brak ⛔)?
  TAK → przejdź do Fazy 1
  NIE lub BRAK INFO → ⛔ STOP
    → "Przed walidacją spójności wymagane zamknięcie MOD-FAKTY (BLOK 0)."
    → Powróć do HYBRID-VALIDATION Block Zero
```

---

## FAZA 1 — OFERTA WALIDACJI (obowiązkowa)

Po wygenerowaniu pisma zadaj użytkownikowi pytanie:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Pismo zostało wygenerowane.

Czy chcesz przeprowadzić walidację spójności?
Przeanalizuję pismo pod kątem:
  • zgodności treści z przekazanymi faktami i dokumentami
  • luk faktycznych — twierdzeń bez pokrycia w materiale dowodowym
  • sprzeczności wewnętrznych i z dostarczonymi danymi
  • brakujących informacji istotnych dla skuteczności pisma

Odpowiedz TAK → przeprowadzam pełną walidację i generuję listę pytań
Odpowiedz NIE → pismo jest gotowe do użycia
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## FAZA 2 — WALIDACJA SPÓJNOŚCI (gdy użytkownik odpowiedział TAK)

### 2.1 Cztery warstwy analizy

Przeanalizuj pismo w czterech wymiarach:

**WARSTWA A — Spójność fakty ↔ treść pisma**
```
Dla każdego twierdzenia faktycznego w piśmie sprawdź:
□ Czy fact pochodzi z przekazanych danych/dokumentów użytkownika?
□ Czy data/kwota/nazwa w piśmie zgadza się z tym co użytkownik podał?
□ Czy nie ma sprzeczności między różnymi częściami pisma?
□ Czy kolejność zdarzeń jest logicznie spójna?
```

**WARSTWA B — Luki dowodowe**
```
Dla każdego twierdzenia w piśmie sprawdź:
□ Czy twierdzenie ma oparcie w dostarczonym materiale?
□ Czy istnieje dowód/dokument który je potwierdza?
□ Czy brak dowodu jest krytyczny dla żądania (może pismo przepaść)?
□ Czy sąd/organ będzie wymagał potwierdzenia tej okoliczności?
```

**WARSTWA C — Luki faktyczne (istotne ale nieujęte)**
```
Na podstawie typu pisma i żądania — czy użytkownik nie pominął:
□ Okoliczności poprzedzających zdarzenie (tło sprawy)?
□ Prób polubownego rozwiązania (wezwania, mediacji)?
□ Reakcji drugiej strony (odpowiedzi, milczenia, odmowy)?
□ Dat kluczowych dla biegu terminów lub odsetek?
□ Wartości przedmiotu sporu / kwot składowych?
□ Danych identyfikacyjnych stron (PESEL, NIP, KRS)?
□ Tytułu prawnego (umowy, decyzji, wyroku będącego podstawą)?
```

**WARSTWA D — Ryzyko procesowe**
```
□ Czy żądanie jest precyzyjne i wykonalne przez sąd/organ?
□ Czy podstawa prawna po weryfikacji online nadal pasuje?
□ Czy termin do złożenia pisma nie jest zagrożony?
□ Czy nie ma okoliczności które osłabiają pozycję procesową?
```

### 2.2 Klasyfikacja wykrytych problemów

Każdy wykryty problem klasyfikuj:

| Kod | Typ | Opis | Działanie |
|-----|-----|------|-----------|
| 🔴 KRYTYCZNY | Brak danych bez których pismo jest nieskuteczne lub błędne | Pytaj o dane natychmiast |
| 🟡 ISTOTNY | Brak danych który osłabia pismo ale go nie dyskwalifikuje | Pytaj o dane |
| 🔵 UZUPEŁNIAJĄCY | Brak danych pobocznych — pismo działa bez nich | Wstaw ⬛ lub pomiń |
| ⚪ INFORMACYJNY | Obserwacja bez wpływu na pismo | Podaj jako uwagę |

---

## FAZA 3 — LISTA PYTAŃ (generowana automatycznie)

### Format raportu walidacji

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 RAPORT WALIDACJI SPÓJNOŚCI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[jeśli brak problemów:]
✅ Pismo jest spójne z dostarczonymi danymi. Brak luk krytycznych.
   Możesz je złożyć.

[jeśli wykryto problemy:]
Wykryto [X] kwestii wymagających uwagi:

🔴 KRYTYCZNE ([n]):
  [numer]. [opis problemu]
     → Pytanie: [konkretne, jednoznaczne pytanie do użytkownika]

🟡 ISTOTNE ([n]):
  [numer]. [opis problemu]
     → Pytanie: [konkretne, jednoznaczne pytanie do użytkownika]

🔵 UZUPEŁNIAJĄCE ([n]):
  [numer]. [opis problemu]
     → Pozostawiam jako ⬛ [UZUPEŁNIJ: ...] — możesz pominąć.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Odpowiedz na pytania 🔴 i 🟡 — po ich udzieleniu zaktualizuję pismo.
Pytania 🔵 możesz pominąć.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Zasady generowania pytań

```
KAŻDE PYTANIE MUSI:
  □ Być konkretne — jedno pytanie o jedną rzecz
  □ Wskazać DLACZEGO ta informacja jest potrzebna
  □ Sugerować format odpowiedzi gdy to pomoże
     (np. "Podaj datę w formacie DD.MM.RRRR")

PYTANIA GRUPUJ tematycznie (nie mieszaj warstw A/B/C/D)
PYTANIA NUMERUJ — użytkownik może odpowiedzieć wybiórczo
MAX 10 pytań naraz — jeśli więcej, pokaż najpierw 🔴, potem 🟡
```

---

## FAZA 4 — AKTUALIZACJA PISMA (po udzieleniu odpowiedzi)

Gdy użytkownik odpowie na pytania:

```
SEKWENCJA AKTUALIZACJI:
1. Wstaw dostarczone dane w miejsca ⬛ lub nowe fragmenty pisma
2. Sprawdź czy nowe dane nie tworzą sprzeczności z dotychczasową treścią
3. Jeśli sprzeczność → poinformuj użytkownika przed zmianą
4. Uruchom mini-walidację na zmienionych fragmentach (tylko Warstwa A)
5. Wygeneruj zaktualizowane pismo z adnotacją co zostało zmienione
```

**Format adnotacji zmian:**
```
📝 ZAKTUALIZOWANO PISMO
Wprowadzono [X] zmian na podstawie Twoich odpowiedzi:
  • [co zmieniono — jedna linia na zmianę]
Pozostałe ⬛ pola ([n]): wymagają ręcznego uzupełnienia przed złożeniem.
```

---

## FAZA 5 — ZAKOŃCZENIE

Po walidacji i ewentualnej aktualizacji:

```
□ Jeśli brak ⬛ i brak problemów → "Pismo gotowe do złożenia."
□ Jeśli są ⬛ → podaj licznik i wyszukiwarkę: "Wyszukaj ⬛ w tekście"
□ Jeśli użytkownik pominął 🔴 → przypomnij raz, nie naciskaj więcej
□ Jeśli użytkownik pominął 🟡 → milcz (jego decyzja)
```

---

## WYJĄTEK — gdy nie pytać o walidację

Nie oferuj walidacji gdy:
- Użytkownik wyraźnie powiedział "wystarczy", "dziękuję", "ok" po piśmie
- Pismo to wzór/szkielet bez żadnych danych (tryb 3 INTAKE-GAP)
- Użytkownik po raz drugi dostaje to samo pismo (już raz walidował)
