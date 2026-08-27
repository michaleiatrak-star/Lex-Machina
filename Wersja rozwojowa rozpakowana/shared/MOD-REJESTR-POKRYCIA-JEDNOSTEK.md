# MOD-REJESTR-POKRYCIA-JEDNOSTEK — Rejestr Pokrycia Wieloelementowych Zbiorów

> **Plik:** `shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md`
> **Wersja:** 1.0.0 (2026-08-18)
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Skrót roboczy:** RPK (Rejestr Pokrycia Kazusów/jednostek)
> **Pozycja w pipeline:**
>   - dowolny skill przetwarzający **ponumerowany zbiór N≥2 dyskretnych jednostek**
>     w toku jednej, potencjalnie wieloturowej/wielopartiowej sesji
>     (kazusy, dokumenty do przejrzenia, świadkowie do przygotowania,
>     pozycje w rejestrze dowodów, punkty w audycie itd.)
>   - inicjowany PRZED podziałem zbioru na partie
>   - aktualizowany PO KAŻDEJ partii, nie tylko na końcu sesji

---

## DLACZEGO TEN MODUŁ ISTNIEJE

**Problem (sesja kazusy_2026.md, 160 kazusów, 2026-08-17/18):**
Model prowadził wieloturową sesję rozwiązywania 160 ponumerowanych kazusów
w partiach po 4–7 sztuk. Po kompaktowaniu sesji (ucinającym pełną historię
na rzecz streszczenia) i dalszej pracy do "kazusu 160/160", użytkownik
poprosił o wskazanie lokalizacji rozwiązania konkretnego kazusu (nr 100).
Weryfikacja wykazała:

- Kazus 100 **nigdy nie został faktycznie rozwiązany** — partia, która go
  obejmowała numerycznie, przeskoczyła bezpośrednio z kazusu 99 do 101,
  bez żadnego alarmu.
- Model w podsumowaniu porównawczym wcześniej **twierdził** ("zgodność
  pełna"), że kazus 100 został sprawdzony — twierdzenie to było
  konfabulacją, niepoprzedzoną żadną faktyczną turą pracy.
- Dalsza kontrola ujawniła **kolejne** pominięte numery (m.in. 140, 148)
  — część pominięta całkowicie milcząco, część "pokryta" jednym zdaniem
  w podsumowaniu bez dedykowanej weryfikacji (HARD GATE ominięty po cichu).
- Finalny raport "160/160 ukończone" był w rzeczywistości nieprawdziwy —
  nikt (model ani użytkownik) nie miał w żadnym momencie sesji jawnego,
  odpornego na kompaktowanie obrazu tego, które numery faktycznie mają
  pokrycie, a które nie.

**Root cause:** Brak jawnego, trwałego (plikowego) rejestru stanu na
poziomie **pojedynczej jednostki roboczej w wieloelementowym zbiorze**.
`MOD-STEP-TRACKER.md` rozwiązuje analogiczny problem dla kroków
**wewnątrz jednego pipeline'u** (jedno pismo, jedna analiza) — ale nie
dla dziesiątek/setek **równorzędnych, ponumerowanych jednostek** w jednej
sesji. Numeracja ciągła (1, 2, 3, ..., 160) tworzy złudzenie porządku,
ale bez mechanicznej kontroli ciągłości żaden pojedynczy numer nie jest
chroniony przed cichym pominięciem — zwłaszcza na granicy dwóch partii
lub w punkcie kompaktowania sesji.

**Zasada nadrzędna tego modułu:**
> ⛔ KAŻDA JEDNOSTKA W ZBIORZE MA WŁASNY, JAWNY STATUS W PLIKU NA DYSKU.
> ⛔ ZAMKNIĘCIE PARTII BEZ SPRAWDZENIA CIĄGŁOŚCI NUMERYCZNEJ = ZAKAZ.
> ⛔ TWIERDZENIE O ZGODNOŚCI/POKRYCIU BEZ WPISU W REJESTRZE = KONFABULACJA.
> Raport końcowy typu "N/N ukończone" MUSI być wygenerowany programistycznie
> z pliku rejestru, nie z pamięci/wrażenia modelu.

---

## KIEDY UŻYĆ TEGO MODUŁU

Wczytaj i zainicjuj RPK, gdy zadanie użytkownika obejmuje:
- pracę nad zbiorem **≥ 10** ponumerowanych, dyskretnych jednostek
  (kazusy, pytania egzaminacyjne, dokumenty, świadkowie, pozycje
  dowodowe, punkty audytu, artykuły w akcie prawnym do przeglądu...),
- **oraz** zapowiedź lub prawdopodobieństwo pracy wieloturowej/partiami
  (jednostek jest za dużo na jedną odpowiedź),
- **oraz** brak innego, już aktywnego mechanizmu śledzenia tego zbioru
  w danej sesji (nie duplikować, jeśli np. `MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md`
  już pokrywa ten sam zbiór z innego powodu).

Nie używaj dla:
- kroków wewnątrz jednego dokumentu/pisma → to `MOD-STEP-TRACKER.md`,
- zbiorów < 10 jednostek, gdzie ręczne prowadzenie w pamięci konwersacji
  jest wystarczająco niezawodne i narzut pliku nie jest uzasadniony.

---

## FAZA 0 — INICJALIZACJA REJESTRU (RPK-INIT)

Wykonaj **raz**, zanim zbiór zostanie podzielony na partie. Ustal
z użytkownikiem lub z materiału źródłowego pełną listę numerów jednostek
(np. 1–160), a następnie utwórz plik:

```
create_file: /home/claude/rpk_<nazwa_zadania>.json

{
  "zadanie": "<krótki opis, np. 'kazusy_2026.md — blok cywilny'>",
  "zrodlo": "<ścieżka pliku źródłowego, jeśli dotyczy>",
  "utworzono": "<data>",
  "ostatnia_aktualizacja": "<data>",
  "liczba_jednostek": 160,
  "jednostki": {
    "1":   { "status": "DO_ZROBIENIA", "partia": null, "notatka": null },
    "2":   { "status": "DO_ZROBIENIA", "partia": null, "notatka": null },
    ...
    "160": { "status": "DO_ZROBIENIA", "partia": null, "notatka": null }
  }
}
```

Statusy dozwolone (dokładnie te cztery, bez wariantów):

| Status | Znaczenie |
|---|---|
| `DO_ZROBIENIA` | jeszcze nietknięte |
| `ZWERYFIKOWANE` | przeprowadzono samodzielne rozwiązanie z faktycznym web_search/web_fetch dla kluczowych elementów (nie z pamięci) |
| `POKRYTE` | `ZWERYFIKOWANE` + porównane ze wzorcem/materiałem źródłowym, z jawną notatką o zgodności lub rozbieżności |
| `WYMAGA_WERYFIKACJI` | wzmiankowane pobieżnie (np. jednym zdaniem w podsumowaniu), ale BEZ dedykowanej weryfikacji online — jawnie oznaczony dług, nie wolno go później cicho zaliczyć jako `POKRYTE` |

⛔ Jeśli plik już istnieje z poprzedniej tury tej samej sesji (np. po
kompaktowaniu) — **wczytaj go**, nie twórz od nowa. Plik przetrwał
kompaktowanie, bo jest na dysku, nie w historii czatu.

---

## FAZA 1 — PRZED ROZPOCZĘCIEM KAŻDEJ PARTII (RPK-PRE)

```
□ Wczytaj aktualny stan pliku rpk_*.json (view lub bash cat).
□ Ustal zakres partii, którą zamierzasz teraz zrobić: [A..B].
□ SPRAWDŹ CIĄGŁOŚĆ: czy istnieje jednostka ze statusem DO_ZROBIENIA
  o numerze < A, którą pomijasz? Jeśli TAK → ⛔ STOP.
  Nie wolno "przeskoczyć do przodu" bez jawnego uzasadnienia
  (np. "wracam do X w kolejnej turze") zapisanego w polu "notatka"
  KAŻDEJ pomijanej jednostki.
□ Jeśli świadomie odkładasz jednostkę na później — zaznacz ją teraz
  jako DO_ZROBIENIA z notatką "odłożone, wrócę po partii Y", NIE
  zostawiaj tego tylko w pamięci konwersacji.
```

---

## FAZA 2 — PO ZAKOŃCZENIU KAŻDEJ PARTII (RPK-COMMIT)

Zanim przejdziesz do kolejnej partii lub napiszesz podsumowanie
porównawcze:

```
□ Dla KAŻDEGO numeru faktycznie rozwiązanego w tej partii z realnym
  web_search/web_fetch → status = ZWERYFIKOWANE.
□ Po napisaniu porównania ze wzorcem dla danego numeru → status = POKRYTE,
  z notatką: "zgodność pełna" / "korekta: <opis>" / "uzupełnienie: <opis>".
□ Jeśli podsumowanie porównawcze wspomina numer JEDNYM zdaniem bez
  dedykowanej weryfikacji online w tej turze → status pozostaje
  WYMAGA_WERYFIKACJI, NIE POKRYTE. Zapisz to wprost.
□ Zapisz plik (bash_tool: cat > lub str_replace) — commit natychmiast,
  nie na końcu sesji.
□ Wypisz krótkie potwierdzenie w odpowiedzi: "RPK zaktualizowany:
  jednostki [A..B] → POKRYTE. Pozostało N do zrobienia, M do weryfikacji."
```

---

## FAZA 3 — PO KOMPAKTOWANIU SESJI (RPK-RESUME)

Streszczenie po kompaktowaniu jest **generowane przez model** i może
zawierać nieweryfikowalne, zbyt pewne twierdzenia o zakresie ukończonej
pracy (dokładnie to się wydarzyło w incydencie źródłowym). Dlatego:

```
□ NIE UFAJ liczbom/zakresom z tekstu streszczenia bez potwierdzenia.
□ Odczytaj plik rpk_*.json z dysku — to jedyne wiarygodne źródło stanu.
□ Jeśli plik NIE istnieje (moduł nie był używany przed kompaktowaniem):
  ⛔ NIE zakładaj, że wcześniejsza praca była kompletna. Przeszukaj
  dostępny transkrypt (jeśli jest) mechanicznie (grep/python po
  numerach jednostek), zbuduj RPK retrospektywnie, i dopiero na tej
  podstawie kontynuuj.
□ Poinformuj użytkownika jednym zdaniem o wyniku tej kontroli, zanim
  przejdziesz dalej.
```

---

## FAZA 4 — RAPORT KOŃCOWY (RPK-FINAL)

Raport typu "N/N ukończone" **nie wolno** pisać z pamięci. Wygeneruj go
programistycznie z pliku:

```python
import json
with open("/home/claude/rpk_<nazwa>.json") as f:
    d = json.load(f)
statusy = {}
for k, v in d["jednostki"].items():
    statusy.setdefault(v["status"], []).append(k)
for s in ["POKRYTE", "ZWERYFIKOWANE", "WYMAGA_WERYFIKACJI", "DO_ZROBIENIA"]:
    print(s, len(statusy.get(s, [])), sorted(statusy.get(s, []), key=int))
```

Raport końcowy dla użytkownika MUSI zawierać:
- liczbę `POKRYTE` (jedyna kategoria uprawniająca do słowa "ukończone"),
- pełną listę numerów `WYMAGA_WERYFIKACJI` i `DO_ZROBIENIA` — nie ukrywać,
- jeśli `WYMAGA_WERYFIKACJI` lub `DO_ZROBIENIA` niepuste → **zakaz**
  twierdzenia "wszystko ukończone" w jakiejkolwiek formie.

---

## RÓŻNICA WOBEC MOD-STEP-TRACKER.md

| | MOD-STEP-TRACKER | MOD-REJESTR-POKRYCIA-JEDNOSTEK |
|---|---|---|
| Śledzi | kroki **jednego** pipeline'u (jedno pismo, jedna analiza) | pokrycie **wielu równorzędnych jednostek** w jednym zbiorze |
| Skala typowa | ~10–25 kroków | ~10–500+ jednostek |
| Trwałość | w kontekście tury/sesji (in-memory REJESTR) | plik na dysku, przetrwa kompaktowanie |
| Pytanie, na które odpowiada | "czy ten dokument przeszedł wszystkie wymagane bramki?" | "czy wszystkie 160 kazusów mają faktyczne pokrycie?" |
| Używane razem? | TAK — mogą współistnieć: RPK śledzi jednostkę-kazus, STEP-TRACKER może dodatkowo śledzić kroki wewnątrz rozwiązania jednej, szczególnie złożonej jednostki |

---

## CHANGELOG

**1.0.0 (2026-08-18):** Utworzenie modułu w odpowiedzi na incydent
pominięcia kazusów 100, 140, 148 (i potencjalnie innych, niezidentyfikowanych)
w sesji 160-kazusowej. Zarejestrowany w `shared/SKILL.md`.
