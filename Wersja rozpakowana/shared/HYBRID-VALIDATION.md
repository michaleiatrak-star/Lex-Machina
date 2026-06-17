# HYBRID-VALIDATION — Walidacja hybrydowa po wygenerowaniu pisma / dokumentu

## KIEDY URUCHAMIAĆ

Po wygenerowaniu pisma lub dokumentu i zakończeniu walidacji formalnej.
Uruchamiaj ZAWSZE — automatycznie, bez pytania użytkownika.

---

## BLOCK ZERO — ⛔ FAKTY I ŹRÓDŁA (BRAMKA — wykonaj PRZED Fazą 1)

> ⛔ HARD GATE — uruchamiaj jako ABSOLUTNIE PIERWSZY krok, przed wszystkimi warstwami.
> Jeśli pismo powstało wyłącznie z ogólnej wiedzy bez dostarczonych materiałów → pomiń Block Zero.
> We wszystkich pozostałych przypadkach: STOP do czasu zamknięcia Block Zero.

```
BLOK 0.1 — Czy użytkownik dostarczył materiały źródłowe (dokumenty, pisma, akta, umowy)?
  NIE → pomiń Block Zero, przejdź do Fazy 1
  TAK → wykonaj 0.2 i 0.3

BLOK 0.2 — Sprawdź czy MOD-FAKTY (FAKTY_v2.md) został uruchomiony dla tego pisma:
  TAK (raport istnieje) → sprawdź wynik w 0.3
  NIE               → ⛔ STOP: "Uruchomiam MOD-FAKTY przed walidacją pisma..."
                       → view /mnt/skills/user/shared/FAKTY_v2.md
                       → wykonaj procedurę F1/F2/F2A/F3
                       → wróć do 0.3

BLOK 0.3 — Wynik MOD-FAKTY:
  ✅ Brak ⛔ FIKCJA i ⛔ BRAK ŹRÓDŁA → zamknij Block Zero, przejdź do Fazy 1
  ⛔ Wykryto FIKCJA lub BRAK ŹRÓDŁA  → BLOKADA FINALIZACJI
    → Wyświetl komunikat blokady z listą elementów do uzupełnienia
    → Czekaj na dane od użytkownika
    → Po uzupełnieniu: wróć do BLOK 0.2
```

---

## FAZA 1 — AUTOMATYCZNY RAPORT BRAKÓW (bez pytania o zgodę)

Natychmiast po wygenerowaniu pisma przeskanuj je i wyświetl raport.

### 1.1 Cztery warstwy skanowania

**WARSTWA A — Spójność fakty ↔ treść**
```
Dla każdego twierdzenia faktycznego w piśmie:
□ Czy data/kwota/nazwa zgadza się z tym co użytkownik podał?
□ Czy nie ma sprzeczności między różnymi częściami pisma?
□ Czy kolejność zdarzeń jest logicznie spójna?
```

**WARSTWA B — Luki dowodowe**
```
Dla każdego twierdzenia w piśmie:
□ Czy twierdzenie ma oparcie w dostarczonym materiale?
□ Czy sąd/organ będzie wymagał potwierdzenia tej okoliczności?
□ Czy brak dowodu jest krytyczny dla żądania?
```

**WARSTWA C — Luki faktyczne (istotne, nieujęte)**
```
Na podstawie typu pisma — czy użytkownik nie pominął:
□ Tła sprawy / okoliczności poprzedzających zdarzenie?
□ Prób polubownego rozwiązania (wezwania, mediacji, odpowiedzi)?
□ Reakcji drugiej strony (odpowiedź, milczenie, odmowa)?
□ Dat kluczowych dla terminów lub odsetek?
□ Wartości przedmiotu sporu / kwot składowych?
□ Danych identyfikacyjnych stron (PESEL, NIP, KRS, adres)?
□ Tytułu prawnego (umowy, decyzji, wyroku będącego podstawą)?
```

**WARSTWA D — Ryzyko procesowe**
```
□ Czy żądanie jest precyzyjne i wykonalne przez sąd/organ?
□ Czy termin do złożenia pisma nie jest zagrożony?
□ Czy podstawa prawna po weryfikacji online nadal pasuje?
```

### 1.2 Klasyfikacja wykrytych braków

| Kod | Opis | Działanie |
|-----|------|-----------|
| 🔴 KRYTYCZNY | Brak bez którego pismo jest nieskuteczne lub błędne | Wyróżnij w raporcie, użytkownik musi uzupełnić |
| 🟡 ISTOTNY | Brak osłabiający pismo, ale go nie dyskwalifikujący | Wyróżnij, zalecaj uzupełnienie |
| 🔵 UZUPEŁNIAJĄCY | Brak poboczny — pismo działa bez niego | Wstaw ⬛ automatycznie, nie blokuj |

### 1.3 Format raportu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RAPORT BRAKÓW — [typ pisma]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[jeśli brak problemów:]
✅ Pismo kompletne. Brak krytycznych luk. Gotowe do złożenia.

[jeśli wykryto braki:]
Znaleziono [X] braków — uzupełnij wybrane poniżej:

🔴 KRYTYCZNE (wymagane):
  1. [opis braku] — [dlaczego krytyczny]
  2. [opis braku] — [dlaczego krytyczny]

🟡 ISTOTNE (zalecane):
  3. [opis braku] — [dlaczego warto uzupełnić]

🔵 UZUPEŁNIAJĄCE (oznaczone ⬛ w piśmie):
  • [opis] — możesz pominąć

Pismo zawiera ⬛ [n] pól do uzupełnienia.

Aby uzupełnić: podaj dane do wybranych punktów (np. "1: Jan Kowalski, 2: 15.03.2024").
Możesz uzupełnić wszystkie, wybrane lub żadne — powiedz "gotowe" żeby zakończyć.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## FAZA 2 — UZUPEŁNIANIE NA ŻĄDANIE

### 2.1 Przyjmowanie danych od użytkownika

Użytkownik może odpowiedzieć w dowolnym formacie:
- `"1: Jan Kowalski"` → uzupełnij brak nr 1
- `"1: Jan Kowalski, 3: 15.03.2024"` → uzupełnij kilka naraz
- `"wszystko"` + dane → uzupełnij wszystkie braki
- `"gotowe"` / `"ok"` / `"dziękuję"` → zakończ bez uzupełniania
- `"pomiń 🔵"` → wstaw ⬛ dla uzupełniających, zamknij 🔴 i 🟡

### 2.2 Wstawianie danych do pisma

```
SEKWENCJA PRECYZYJNEGO WSTAWIANIA:
1. Dla każdego podanego numeru → znajdź odpowiednie miejsce w piśmie
2. Zastąp ⬛ [UZUPEŁNIJ: ...] lub wstaw nowy fragment w logicznym miejscu
3. Sprawdź czy nowe dane nie tworzą sprzeczności z istniejącą treścią
4. Jeśli sprzeczność → zapytaj użytkownika przed zmianą (jedno pytanie)
5. Wygeneruj zaktualizowane pismo
```

### 2.3 Format adnotacji po aktualizacji

```
📝 ZAKTUALIZOWANO PISMO
Wprowadzono [X] zmian:
  • Pkt 1: [co wstawiono i gdzie]
  • Pkt 3: [co wstawiono i gdzie]
Pozostałe braki: 🔴 [n] · 🟡 [n] · ⬛ [n] pól
[jeśli zero braków:] ✅ Pismo kompletne — gotowe do złożenia.
```

---

## FAZA 3 — ZAKOŃCZENIE

```
□ Zero braków 🔴 i 🟡 → "Pismo gotowe do złożenia."
□ Pozostałe ⬛ → "Wyszukaj ⬛ w tekście i uzupełnij przed złożeniem."
□ Użytkownik powiedział "gotowe" przy otwartych 🔴 → przypomnij raz, nie naciskaj
□ Pismo [3] lub [4] wg routera → uruchom docx-skill i present_files
```

---

## WYJĄTKI — kiedy NIE generować raportu

```
□ Pismo to wzór/szkielet (tryb 3 INTAKE-GAP) — raport bez sensu (wszystko jest ⬛)
□ Użytkownik powiedział "wystarczy" / "dziękuję" / "ok" tuż po piśmie
□ To już drugie wywołanie walidacji tego samego pisma w tej sesji
```
