# WORKFLOW: Popraw fragment
## Analizator Umów v1 · workflows/popraw-fragment.md

Workflow do edycji **konkretnego fragmentu** umowy/regulaminu/uchwały/
pełnomocnictwa — gdy użytkownik wkleja klauzulę i prosi o poprawienie, lub
przerywa szerszy workflow analizy/generowania, żeby naprawić jeden paragraf.

**Używaj, gdy:**
- użytkownik wkleja fragment + prosi o korektę,
- użytkownik pisze „popraw § X w tej umowie",
- w trakcie pełnej analizy/generowania użytkownik zatrzymuje proces, żeby
  naprawić jedno miejsce.

---

## Krok 1 — zrozum, co poprawiamy

Otwórz `references/generator/style-format-generowania.md` — zawsze przed
edycją, nawet drobną. Ustal:
- **Co konkretnie ma być poprawione?** Cały paragraf, jeden ustęp, jedno zdanie?
- **Dlaczego?** Ujednolicić styl, dodać brakujący element, naprawić błąd
  prawny, dostosować do innych klauzul, doprecyzować?
- **W jakim kontekście funkcjonuje fragment?** Samodzielnie czy odsyła do
  innych części dokumentu?

Jeśli instrukcja jest niejasna („popraw to") — dopytaj raz: *„Co konkretnie
chcesz zmienić? Np. dodać limit kar, ujednolicić z § 4, doprecyzować termin?"*

## Krok 2 — wybór źródła poprawki

### Scenariusz A — dodanie/zastąpienie klauzulą gotową

Gdy brakuje elementu (np. „dodaj klauzulę anty-copyleft", „dorzuć limit
odpowiedzialności"):

1. Klauzule negocjacyjnie wrażliwe (odpowiedzialność, kary, FM, IP) →
   `mod-shared-fallback-library.md` — wybierz poziom A/B/C/D odpowiedni do
   pozycji negocjacyjnej klienta.
2. Klauzule strukturalne/boilerplate (komparycja, preambuła, definicje,
   postanowienia końcowe, zwrot materiałów, cesja) →
   `references/generator/boilerplate-strukturalne.md`.
3. Essentialia specyficzne dla typu dokumentu (regulamin, statut, uchwała,
   pełnomocnictwo, RODO, HR) → moduł źródłowy wskazany w tabeli routingu
   `SKILL.md § GENEROWANIE DOKUMENTÓW`.
4. Doktryna uzupełniająca (open source, wizerunek, notice&action, Polityka
   AI) → `references/generator/doktryna-uzupelnienie.md`.
5. Dopasuj wybraną klauzulę do kontekstu — nazwy stron, kwoty, terminy,
   odesłania tej konkretnej umowy. **Nigdy nie kopiuj 1:1.**

### Scenariusz B — przeróbka istniejącego fragmentu

Gdy trzeba naprawić istniejący tekst („ujednolicaj z resztą umowy", „uprość
język"):

1. Przeczytaj fragment, ustal jego cel prawny.
2. Zdiagnozuj kategorię klauzuli —
   `references/generator/kategorie-klauzul-taksonomia.md` — czy fragment
   miesza kategorie (np. zobowiązanie z polityką)? To najczęstsze źródło
   niejednoznaczności wymagającej poprawki.
3. Sprawdź zgodność z ZASADAMI FUNDAMENTALNYMI w `SKILL.md` (spójność
   terminologii, definicje, brak powtórzeń — Zasada 7).
4. Zastosuj `style-format-generowania.md` S.1–S.4.
5. Zachowaj sens prawny — zmieniasz formę, nie treść, chyba że treść jest
   błędna (wtedy przejdź do Scenariusza C).

### Scenariusz C — pełna wymiana

Gdy fragment jest merytorycznie wadliwy (np. próba wyłączenia winy umyślnej —
nieważna z mocy art. 473 § 2 KC):

> HARD GATE (R1): przed cytowaniem artykułu — `web_search`/`web_fetch` →
> ✅ [VER] lub ⚠️ [NIEWERYFIKOWANE]. Nie cytuj z pamięci.

1. Wyjaśnij krótko, dlaczego fragment jest problematyczny.
2. Zaproponuj zastępczą klauzulę (Scenariusz A).
3. Pokaż „przed i po".

## Krok 3 — format wyjścia

**Zwięzły, zorientowany na działanie.** Bez długich wyjaśnień, chyba że
użytkownik prosi.

### Wariant domyślny (wystarczy poprawiony tekst)

> ⛔ Jeśli fragment jest gotowy do wklejenia w podpisywany dokument — najpierw
> zapytaj: „Czy prawnik prowadzący sprawę widział tę zmianę?". Bez
> potwierdzenia: dodaj `[DRAFT — DO WERYFIKACJI]` nad fragmentem.

```
[gotowy poprawiony fragment, do wklejenia w dokument]
```

Po tym 1–2 linijki uzasadnienia (jeśli zmiana wymaga wyjaśnienia).

### Wariant rozbudowany (zmiana istotna)

```
## ZMIANA

**Przed:**
[fragment oryginalny]

**Po:**
[fragment poprawiony]

**Co zmieniłem:**
- [1–3 punkty, każdy 1 zdanie]

**Źródło poprawki:** `[ścieżka do modułu użytego w Kroku 2]`
```

## Zasady poprawiania

1. Zachowuj sens prawny, chyba że jego zmiana jest świadomym celem.
2. Stosuj ZASADY FUNDAMENTALNE z `SKILL.md` (spójność terminologii,
   definicje, brak powtórzeń — Zasada 7).
3. Dopasuj do kontekstu — jeśli dokument używa „Wykonawca", w poprawce też
   „Wykonawca", nie „Zleceniobiorca".
4. Nie wymyślaj klauzul od zera poza modułami tego systemu (Krok 2) — jeśli
   żaden moduł nie ma odpowiedniej klauzuli, powiedz to wprost i zapytaj o
   decyzję, zamiast improwizować.
5. Brak komentarzy w tekście — gotowa klauzula ma być wklejalna bez
   sprzątania. Komentarze osobno, przed/po.

## Anti-pattern — czego NIE robić

- ❌ Nie zmieniaj fragmentu, o który nie proszono (np. przy poprawce § 5 nie
  „ulepszaj" przy okazji § 6).
- ❌ Nie dodawaj treści prawnej, której nie zlecono (np. przy ujednolicaniu
  stylu nie dorzucaj kar umownych „bo brakuje").
- ❌ Nie pisz długiego wprowadzenia („Zrozumiałem polecenie, oto poprawiony
  fragment...") — przejdź od razu do efektu.
- ❌ Nie zostawiaj placeholderów `[tutaj wstaw kwotę]` — jeśli czegoś nie
  wiesz, zapytaj zamiast wstawiać placeholder.

## Powiązania

- `references/generator/kategorie-klauzul-taksonomia.md` — diagnostyka (Scenariusz B).
- `mod-shared-fallback-library.md`, `references/generator/boilerplate-strukturalne.md` — źródła klauzul (Scenariusz A).
- `references/generator/style-format-generowania.md` — styl i format (Krok 1, 3).
- `workflows/weryfikacja-spojnosci-odeslan.md` — jeśli poprawka zmienia numerację/definicje używane gdzie indziej w dokumencie, uruchom po zakończeniu poprawki.
