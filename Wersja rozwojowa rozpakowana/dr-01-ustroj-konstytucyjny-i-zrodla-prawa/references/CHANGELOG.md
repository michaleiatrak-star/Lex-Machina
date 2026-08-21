# CHANGELOG — DR-01 Ustrój konstytucyjny i źródła prawa

> Pełna historia zmian tego skilla. **Jedyna lokalizacja kanoniczna** — w SKILL.md
> historii nie ma; jest tam wyłącznie krótki skrót w polu `changelog:` frontmatteru.
> Standard ujednolicony 2026-08-20z4 dla całego systemu: plik `references/CHANGELOG.md`,
> nigdy sekcja w korpusie SKILL.md ani pełna lista w YAML.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy — przy audycie, przy
> pytaniu „dlaczego to tak działa", przy regresji. W normalnym toku pracy zbędny.

---

## 3.7 (2026-08-20z4) — ujednolicenie standardu: historia zmian wyłącznie w tym pliku

Historia wyniesiona z korpusu SKILL.md do nowo utworzonego `references/CHANGELOG.md`.
Wpisy 3.5 i 3.6 pozostają oznaczone jako LUKA JAWNA — brak śladu w dzienniku audytu.

**Standard systemowy wprowadzony tego dnia:** pełna historia zmian każdego skilla
mieszka w `references/CHANGELOG.md` — nigdy w sekcji `## CHANGELOG` korpusu SKILL.md
i nigdy jako pełna lista wpisów w polu `changelog:` frontmatteru. W SKILL.md zostaje
wyłącznie kilkulinijkowy skrót bieżącej wersji z odesłaniem do tego pliku.

**Dlaczego to nie jest kosmetyka:** rozproszenie historii między trzy lokalizacje było
BEZPOŚREDNIĄ przyczyną fałszywych wyników testu T12 w sesji 2026-08-20z3 — test szukał
wpisów w `references/`, nie znajdował ich (bo leżały w SKILL.md) i raportował luki,
których nie było. Jedna lokalizacja kanoniczna usuwa całą tę klasę błędu.
Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis `AUDYT-2026-08-20z4`.

---

## HISTORIA PRZENIESIONA Z SKILL.md (2026-08-20z4, ujednolicenie standardu)

> Poniższa treść pochodzi z sekcji `## CHANGELOG` w korpusie SKILL.md. Przeniesiona **1:1, bez zmiany ani jednego
> zdania**. Powód: historia zmian ma mieszkać w jednym miejscu — w tym pliku —
> a nie być rozproszona między korpusem SKILL.md, frontmatterem i `references/`.
> Rozproszenie było źródłem rozjazdów wykrytych flagami F-101 i F-102: test T12
> szukał historii w `references/` i raportował fałszywe luki tam, gdzie wpisy
> istniały, tylko w SKILL.md.

> ⛔ **UZUPEŁNIENIE 2026-08-20z3 (F-102, test T12).** `version` wynosił 3.6
> przy ostatnim wpisie 3.3. Poniżej: 3.4 odtworzone z AUDIT-JOURNAL,
> 3.5 i 3.6 — LUKA JAWNA, w dzienniku brak jakiegokolwiek śladu podbicia.

> **3.6 i 3.5 — ⛔ LUKA JAWNA (nieodtwarzalna).** Ani `AUDIT-JOURNAL.md`, ani
> żaden plik systemu nie zawiera wzmianki o tych dwóch podbiciach. Historii
> nie da się odtworzyć; odnotowane wprost, żeby rejestr nie wyglądał na
> kompletny. Jeśli istnieją kopie pakietu sprzed sierpnia 2026 — to jedyne
> możliwe źródło.

> **3.4 (2026-07-27z6, FAZA 3E)** — trzy moduły dr-01 sprawdzone pod kątem
> aktualności treści (deklaracja z poprzedniej sesji dotrzymana), dziedzina
> dr-01 oznaczona jako UKOŃCZONA w przeglądzie 3E. Źródło: AUDIT-JOURNAL,
> wpis AUDYT-2026-07-27z6.

> **3.3 (2026-07-25, CRIT-TREŚĆ — audyt adresatów zażalenia w sprawach
> wyłączenia sędziego/neosędziów):** `modules/mod-USP-ustroj-sadow-
> powszechnych.md`, sekcja "Procedura wyłączenia" — poprzednia wersja
> kończyła się ogólnikiem "odmowa → zażalenie" bez wskazania adresata.
> Dodano tabelę rozróżniającą: (1) zażalenie poziome do innego składu tego
> samego sądu przy oddaleniu wniosku strony (art. 394¹ᵃ §1 pkt 10 KPC dla
> I instancji, art. 394² §1 KPC dla II instancji); (2) brak zaskarżalności,
> gdy to sam sędzia zgłosił i uzyskał oddalenie własnego żądania wyłączenia
> (uchwała SN III CZP 33/69). Doprecyzowano konsekwencję praktyczną dla
> spraw neosędziowskich: kontrola odwoławcza zwykle zostaje w tym samym
> sądzie, nie trafia automatycznie do instancji wyższej. Zweryfikowano
> online (SN, Palestra, gofin.pl, saos.org.pl). Ten sam wzorzec braku
> (brak adresata zażalenia) wykryto i naprawiono równolegle w
> pisma-proste-v2 (v2.4) i pisma-procesowe-v3 (v5.14). Pełny opis:
> audyt-systemu-v4/references/AUDIT-JOURNAL.md, wpis 2026-07-25.
