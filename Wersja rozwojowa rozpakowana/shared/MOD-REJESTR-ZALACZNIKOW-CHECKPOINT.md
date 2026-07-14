# MOD-REJESTR-ZALACZNIKOW-CHECKPOINT — Widoczny rejestr plików + checkpoint kontynuacji

> **Plik:** `/mnt/skills/user/shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md`
> **Wersja:** 1.0.0 (2026-07-12, aktualizacja opisu integracji 2026-07-14)
> **Status:** PRODUKCJA — plik kanoniczny shared
> **Pozycja w pipeline:**
>   - prawny-router-v3: KROK 0C-EXT — bezpośrednio PO SD-INW/SD-REJ z
>     MOD-SKAN-DOWODOW-KOMPLETNY.md, PRZED każdą odpowiedzią zawierającą
>     wnioski z materiału dowodowego (nie tylko przed generowaniem pisma)
>   - analizator-dowodow-v3 / chronologia-sprawy-v1 / przesluchanie-swiadkow-v2-min90:
>     wywoływany na wejściu ORAZ na końcu każdej tury, gdy w grze są załączniki
>   - wywoływany także reaktywnie: gdy użytkownik pyta "czy sprawdziłeś
>     wszystko?" / "sprawdź wszystkie pliki" / "czy coś pominąłeś?"

**Relacja z MOD-SKAN-DOWODOW-KOMPLETNY:**
SD-KOMPLETNY odpowiada za TO, ŻE każda strona/zakładka/obraz zostanie
faktycznie odczytana (metodologia odczytu, zakaz pominięcia).
Ten moduł odpowiada za TO, ŻE użytkownik ZAWSZE WIDZI stan tego procesu
— pełną listę plików i status każdego z nich — oraz za to, że model nigdy
nie kończy tury w milczeniu na temat plików, których nie sprawdził.

---

## DLACZEGO TEN MODUŁ ISTNIEJE

**Incydent źródłowy (sprawa XI P 27/26, 2026-07-12):**
Model przeanalizował ZIP z ~30 plikami, ale w pierwszej odpowiedzi oparł
tezy tylko na części z nich (protokoły, .odt, xlsx), pomijając bez
zaznaczenia: 3 duże skany PDF (130 stron), maile poboczne, recepty,
zdjęcia WhatsApp — z których dwa (zrzuty rozmów o zwrotach pieniędzy dla
cudzoziemców) okazały się kluczowe dla sprawy. Model nie poinformował
użytkownika, że czegokolwiek nie sprawdził — braki wyszły na jaw dopiero,
gdy użytkownik o to wprost zapytał.

**Zasada nadrzędna tego modułu:**
> ⛔ Model NIGDY nie kończy odpowiedzi wykorzystującej materiał dowodowy
> bez pokazania użytkownikowi PEŁNEJ listy załączników i statusu każdego
> z nich. Brak wzmianki o niesprawdzonych plikach = błąd krytyczny,
> równoważny podaniu nieprawdy o stanie analizy.

---

## FAZA 1 — BUDOWA REJESTRU (RZ-REJ)

```
KROK RZ.1 — Zidentyfikuj WSZYSTKIE pliki, tak jak w SD-INW.1
  (uploads/, <uploaded_files>, wklejona treść) — w tym zawartość
  KAŻDEGO zip/archiwum, także zagnieżdżonego (zip w zip).
  bash: ls -la /mnt/user-data/uploads/
  bash: unzip -l plik.zip  (rekurencyjnie dla zip-w-zip)

KROK RZ.2 — Zbuduj tabelę RZ-REJ z KOLUMNAMI:
  ID | Nazwa pliku | Typ | Str./zakł. | Status | Uwaga

  Status ∈ {
    ✅ SPRAWDZONY       — treść faktycznie odczytana/obejrzana w całości
    🔶 CZĘŚCIOWO        — odczytano fragment (np. 1 z N stron/zakładek)
    ⬜ NIESPRAWDZONY    — jeszcze nieotwierany w tej rozmowie
    ➖ NIE DOTYCZY      — plik pomocniczy bez treści merytorycznej
                          (np. plik systemowy) — wymaga jawnego uzasadnienia
  }

KROK RZ.3 — REJESTR MUSI OBEJMOWAĆ zawartość ZIP jako pozycje osobne,
  nie sam plik .zip jako "1 pozycję" — zgodnie z REGUŁA-ZIP
  z MOD-SKAN-DOWODOW-KOMPLETNY.
```

## FAZA 2 — WYŚWIETLENIE UŻYTKOWNIKOWI (RZ-SHOW)

```
⛔ OBOWIĄZKOWE w KAŻDEJ z poniższych sytuacji:
  a) pierwsza odpowiedź po wgraniu nowych plików,
  b) użytkownik pyta wprost o kompletność sprawdzenia,
  c) model formułuje jakiekolwiek wnioski/tezy z materiału dowodowego,
     a w RZ-REJ istnieje choć jedna pozycja ⬜ lub 🔶.

Format wyświetlenia (skrócony, czytelny — nie cała FAZA 1 na ekran):

  📋 Rejestr załączników ([N] plików łącznie)
  ✅ Sprawdzone ([x]/[N]): [lista nazw lub zwięzły opis grup]
  ⬜ Niesprawdzone ([y]/[N]): [lista nazw]
  🔶 Częściowe: [lista nazw + co brakuje, np. "3/40 stron"]

  Jeśli y > 0 → DOKOŃCZ komunikat pytaniem:
  "Czy mam teraz sprawdzić pozostałe [y] plik(i), zanim przejdę dalej?"

  ⛔ ZAKAZ formułowania odpowiedzi merytorycznej opartej na materiale,
     jeśli w tej samej turze nie ujawniono statusu ⬜/🔶 — nawet jeśli
     odpowiedź wydaje się "wystarczająco kompletna" bez tych plików.
```

## FAZA 3 — DECYZJA UŻYTKOWNIKA (RZ-DECYZJA)

```
Po RZ-SHOW z pozycjami ⬜/🔶, model CZEKA na decyzję użytkownika, chyba że:
  - użytkownik z góry polecił "sprawdzaj wszystko automatycznie bez pytania"
    dla tej sesji → wtedy KONTYNUUJ RZ-READ bez pytania, ale nadal
    wyświetlaj RZ-SHOW po zakończeniu.

Odpowiedzi użytkownika i reakcja:
  "tak / kontynuuj / sprawdź resztę"      → wykonaj SD-READ (z MOD-SKAN-
                                             DOWODOW-KOMPLETNY) dla pozycji
                                             ⬜/🔶, zaktualizuj RZ-REJ,
                                             pokaż RZ-SHOW ponownie.
  "nie / nie teraz / pomiń X"             → oznacz świadomie pominięte
                                             pozycje jako
                                             ⬛ POMINIĘTE NA ŻYCZENIE
                                             UŻYTKOWNIKA (nie ⬜ — inny
                                             status, żeby nie mylić
                                             z "zapomnianym"), zanotuj to
                                             zastrzeżenie przy wnioskach
                                             opartych na niepełnym materiale.
  brak odpowiedzi / inne pytanie          → traktuj jak "nie teraz",
                                             ale przypomnij o pozostałych
                                             ⬜ przy NASTĘPNEJ odpowiedzi
                                             merytorycznej dot. tej sprawy.
```

## FAZA 4 — PERSYSTENCJA REJESTRU W ROZMOWIE (RZ-PERSIST)

```
⛔ RZ-REJ NIE jest jednorazowy — obowiązuje przez CAŁĄ rozmowę dot. danej
sprawy/sygnatury, także po przełączeniu wątku tematycznego i po dogrywce
kolejnych plików w późniejszych wiadomościach (nowe pliki → dopisz jako
nowe pozycje ⬜, nie nowy rejestr od zera).

Jeśli użytkownik w kolejnej wiadomości wgra nowe pliki:
  → rozszerz RZ-REJ o nowe pozycje (status ⬜),
  → wykonaj RZ-SHOW zanim przejdziesz do analizy nowej treści.

Jeśli użytkownik pyta w dowolnym momencie "czy sprawdziłeś wszystko",
"czy coś pominąłeś", "wylistuj pliki":
  → odtwórz RZ-REJ z pamięci tej rozmowy (na podstawie faktycznie
    wykonanych operacji odczytu, NIE z założenia "pewnie wszystko"),
  → wykonaj pełne RZ-SHOW,
  → jeśli są ⬜/🔶 → zapytaj o kontynuację (FAZA 3).
```

---

## SELF-CHECK MODUŁU (wykonaj przed KAŻDĄ odpowiedzią korzystającą z załączników)

```
□ RZ-REJ zbudowany dla wszystkich plików + zawartości zip (rekurencyjnie)?
□ RZ-SHOW wyświetlony użytkownikowi w tej turze (jeśli wymagany wg FAZY 2)?
□ Każda pozycja ma jednoznaczny status ✅ / 🔶 / ⬜ / ➖ / ⬛?
□ Jeśli istnieją ⬜/🔶 — zadano pytanie o kontynuację (FAZA 3)?
□ Wnioski merytoryczne NIE opierają się milcząco na niesprawdzonych plikach?
□ RZ-REJ zaktualizowany o nowe pliki, jeśli doszły w tej wiadomości?

Którykolwiek = NIE → wróć do właściwej fazy. Nie przedstawiaj wniosków
jako kompletnych.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-07-12, aktualizacja integracji 2026-07-14)
Przyczyna: sprawa XI P 27/26, świadek Maria Koroleva — moduł istniał od
  utworzenia (poniżej), ale w przesluchanie-swiadkow-v2-min90 nie był
  deklarowaną zależnością required, więc uruchamiał się wyłącznie
  reaktywnie (na wprost zadane pytanie użytkownika), a nie proaktywnie
  w pierwszej odpowiedzi po wgraniu dowodów. Model przedstawił
  tezy/pytania oparte na 7 z 23 plików bez zasygnalizowania braków.
Naprawa (2026-07-14): przesluchanie-swiadkow-v2-min90 — dodano ten
  moduł do dependencies.required, dodano RZ-SHOW-GATE do
  validation.required_gates, dodano jawny etap pipeline
  PRE-W1a.4-RZ-SHOW wykonywany BEZPOŚREDNIO po SD-VER i PRZED profilem
  świadka, w KAŻDEJ turze z dowodami — nie tylko na żądanie
  użytkownika. Wersja modułu pozostawiona bez zmian (1.0.0) — zmianie
  uległo wyłącznie wpięcie zależności w skillu nadrzędnym, nie treść
  merytoryczna samego modułu. Zob. changelog przesluchanie-swiadkow-v2-min90.

1.0.0 (2026-07-12)
Przyczyna: sprawa XI P 27/26 — model sprawdził materiał wybiórczo
  i nie zasygnalizował tego użytkownikowi; braki (w tym 2 kluczowe
  zrzuty WhatsApp) wyszły na jaw dopiero po pytaniu kontrolnym
  użytkownika. Utworzono na wyraźne polecenie użytkownika.
Zakres: nowy moduł, komplementarny do MOD-SKAN-DOWODOW-KOMPLETNY —
  ten moduł odpowiada za WIDOCZNOŚĆ i ZGODĘ UŻYTKOWNIKA na etapowanie,
  SD-KOMPLETNY za samą metodologię odczytu.
```
