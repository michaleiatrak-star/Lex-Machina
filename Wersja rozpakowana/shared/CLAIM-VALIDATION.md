# MOD-CLAIM-VALIDATION — Walidacja Twierdzeń Strony względem Materiału Dowodowego

**Plik kanoniczny:** `/mnt/skills/user/shared/CLAIM-VALIDATION.md`
Wywołuj przez: `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`

---

## Cel

Weryfikacja twierdzeń strony (tez, roszczeń, zarzutów, tez dowodowych, twierdzeń
procesowych) pod kątem ich oparcia w dostarczonych materiałach.

Stosuj zawsze gdy:
- strona lub użytkownik formułuje twierdzenie faktyczne lub procesowe,
- skill generuje tezy dowodowe na podstawie opisu sprawy,
- skill przygotowuje pytania do świadka oparte na tezach strony,
- skill analizuje pismo procesowe zawierające twierdzenia bez materiału źródłowego.

---

## ZASADA NADRZĘDNA — CLAIM-FIRST

> Twierdzenie strony nieznajdujące oparcia w dostarczonych dowodach, dokumentach
> ani przepisach prawa jest **błędne procesowo** i musi być:
> 1. **zidentyfikowane jako nieudowodnione**,
> 2. **zastąpione twierdzeniem wynikającym faktycznie z materiałów**, jeśli materiały
>    zawierają odmienną treść,
> 3. **oznaczone jako luka dowodowa**, jeśli materiały milczą w danym zakresie.
>
> Twierdzenie wynikające wprost z przepisu prawa (zweryfikowanego online) jest
> traktowane jako **udowodnione normatywnie** — nawet bez dokumentu w aktach.

Zakaz: nie wolno przyjmować twierdzenia strony jako faktu tylko dlatego, że strona
je formułuje lub że brzmi wiarygodnie. Każde twierdzenie wymaga weryfikacji.

---

## PROCEDURA WERYFIKACJI TWIERDZEŃ (wykonaj przed wygenerowaniem tez / pytań / pisma)

### KROK C1 — INWENTARYZACJA TWIERDZEŃ STRONY

Wypisz wszystkie twierdzenia faktyczne lub procesowe strony:
- twierdzenia z opisu słownego użytkownika,
- tezy z dokumentów strony (pozew, odpowiedź, pismo przygotowawcze),
- twierdzenia o faktach będące podstawą żądania lub obrony.

### KROK C2 — KONFRONTACJA Z MATERIAŁEM I PRZEPISAMI

Dla każdego twierdzenia sprawdź kolejno:
a) wynika wprost z dostarczonego dokumentu / dowodu,
b) wynika pośrednio (wniosek logiczny z udokumentowanych faktów),
c) wynika wprost z przepisu prawa — **zweryfikuj online** (ISAP / eli.gov.pl):
   - wykonaj `web_search` z zapytaniem o konkretny przepis,
   - odczytaj aktualną treść normy,
   - oceń czy twierdzenie strony jest zgodne z brzmieniem przepisu,
   - jeśli zgodne → `[✅ NORMATYWNE]`; jeśli niezgodne → `[⛔ SPRZECZNE Z PRAWEM]`,
d) jest sprzeczne z dokumentem / dowodem → `[⛔ SPRZECZNE]`,
e) nie ma żadnego oparcia ani w materiale, ani w przepisach → `[⛔ NIEUDOWODNIONE]`.

**Kolejność weryfikacji jest obowiązkowa** — nie przechodzić do (e) bez sprawdzenia (c).

### KROK C3 — KLASYFIKACJA I KOREKTA

| Status | Oznaczenie | Działanie |
|---|---|---|
| Twierdzenie zgodne z materiałem dowodowym | `[✅ UDOWODNIONE]` | Przyjmij jako podstawę tezy / pytania |
| Twierdzenie wynikające wprost z przepisu (zweryfikowanego) | `[✅ NORMATYWNE]` | Przyjmij; wskaż podstawę prawną z numerem artykułu i ustawy |
| Twierdzenie częściowo zgodne | `[⚠️ CZĘŚCIOWE]` | Przyjmij z ograniczeniem — opisz zakres potwierdzony |
| Wniosek logiczny z udokumentowanych faktów | `[✅ POŚREDNIE]` | Przyjmij; opisz łańcuch wnioskowania |
| Twierdzenie sprzeczne z materiałem dowodowym | `[⛔ SPRZECZNE]` | Odrzuć; zastąp twierdzeniem wynikającym z materiału |
| Twierdzenie sprzeczne z przepisem prawa | `[⛔ SPRZECZNE Z PRAWEM]` | Odrzuć; wskaż prawidłowe brzmienie normy; poinformuj użytkownika |
| Twierdzenie bez oparcia w materiale ani przepisach | `[⛔ NIEUDOWODNIONE]` | Oznacz jako lukę; nie formułuj tezy ani pytania opartego na tym twierdzeniu |

### KROK C4 — KOREKTA TWIERDZEŃ BŁĘDNYCH I DOKUMENTACJA NORMATYWNYCH

Dla każdego `[✅ NORMATYWNE]`:
```
TWIERDZENIE STRONY:  [co twierdzi strona]
PODSTAWA PRAWNA:     [art. X ustawy Y — zweryfikowano: URL]
TREŚĆ NORMY:         [dosłowne lub bliskie brzmienie przepisu]
STATUS:              udowodnione normatywnie — brak wymogu dokumentu w aktach
```

Dla każdego `[⛔ SPRZECZNE Z PRAWEM]`:
```
TWIERDZENIE STRONY:  [co twierdzi strona]
PRZEPIS:             [art. X ustawy Y — zweryfikowano: URL]
PRAWIDŁOWE BRZMIENIE:[co przepis faktycznie stanowi]
KOREKTA:             [twierdzenie zastąpcze zgodne z normą]
SKUTEK PROCESOWY:    [ryzyko dla pozycji strony]
```

Dla każdego `[⛔ SPRZECZNE]`:
```
TWIERDZENIE STRONY:  [co twierdzi strona]
MATERIAŁ DOWODOWY:   [co faktycznie wynika z dokumentu/dowodu — ze wskazaniem źródła]
KOREKTA:             [twierdzenie zastąpcze oparte na materiale]
SKUTEK PROCESOWY:    [co oznacza ta rozbieżność dla pozycji strony]
```

Dla każdego `[⛔ NIEUDOWODNIONE]`:
```
TWIERDZENIE STRONY:  [co twierdzi strona]
STATUS:              brak oparcia w materiale dowodowym i przepisach
LUKA DOWODOWA:       [opis czego brakuje]
REKOMENDACJA:        [jaki dowód / dokument / przepis mógłby to wykazać]
```

---

## RAPORT WALIDACJI TWIERDZEŃ

Wyświetl zawsze gdy wykryto `[⛔ SPRZECZNE]` lub `[⛔ NIEUDOWODNIONE]`:

```
RAPORT WALIDACJI TWIERDZEŃ (MOD-CLAIM-VALIDATION)

⛔ TWIERDZENIA SPRZECZNE Z MATERIAŁEM — wymagają korekty:
  [nr]. Twierdzenie: [...]
        Materiał mówi: [...] (źródło: [...])
        Twierdzenie zastąpcze: [...]
        Skutek: [...]

⛔ TWIERDZENIA SPRZECZNE Z PRAWEM — wymagają korekty:
  [nr]. Twierdzenie: [...]
        Przepis: [...] (zweryfikowano: URL)
        Prawidłowe brzmienie: [...]
        Twierdzenie zastąpcze: [...]
        Skutek: [...]

⛔ TWIERDZENIA NIEUDOWODNIONE — brak oparcia w materiale i przepisach:
  [nr]. Twierdzenie: [...]
        Luka: [opis]
        Rekomendacja: [co dostarczyć / jaki przepis sprawdzić]

⚠️ TWIERDZENIA CZĘŚCIOWE — przyjęte z ograniczeniem:
  [nr]. Twierdzenie: [...]
        Zakres potwierdzony: [...]
        Zakres niepotwierdzony: [...]

✅ TWIERDZENIA NORMATYWNE (bez dokumentu, wynikają z przepisu):
  [nr]. Twierdzenie: [...] — podstawa: art. X ustawy Y (URL)

✅ TWIERDZENIA UDOWODNIONE: [n] twierdzeń bez zastrzeżeń
```

---

## ZASADA BLOKADY

Jeśli twierdzenie jest `[⛔ SPRZECZNE]`, `[⛔ SPRZECZNE Z PRAWEM]` lub `[⛔ NIEUDOWODNIONE]`:
- **NIE formułuj tezy dowodowej opartej na tym twierdzeniu**,
- **NIE generuj pytań do świadka mających udowodnić to twierdzenie**,
- **NIE umieszczaj tego twierdzenia w piśmie procesowym**,
- zamiast tego: użyj twierdzenia zastępczego z C4 lub oznacz lukę dowodową.

Wyjątek: jeśli użytkownik świadomie chce formułować twierdzenie procesowe
pomimo braku dowodu (np. teza wymagająca dopiero przeprowadzenia dowodu na
rozprawie) — odnotuj to jawnie i opisz ryzyko procesowe.

---

## Integracja z MOD-FAKTY

MOD-CLAIM-VALIDATION weryfikuje twierdzenia **przed** wygenerowaniem treści.
MOD-FAKTY weryfikuje wygenerowaną treść **po** jej wygenerowaniu.
Oba moduły są komplementarne — nie zastępują się wzajemnie.
