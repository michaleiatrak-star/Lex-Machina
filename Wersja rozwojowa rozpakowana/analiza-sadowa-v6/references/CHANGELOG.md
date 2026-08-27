# CHANGELOG — Analiza sądowa v6

> Pełna historia zmian tego skilla. **Jedyna lokalizacja kanoniczna** — w SKILL.md
> historii nie ma; jest tam wyłącznie krótki skrót w polu `changelog:` frontmatteru.
> Standard ujednolicony 2026-08-20z4 dla całego systemu: plik `references/CHANGELOG.md`,
> nigdy sekcja w korpusie SKILL.md ani pełna lista w YAML.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy — przy audycie, przy
> pytaniu „dlaczego to tak działa", przy regresji. W normalnym toku pracy zbędny.

---

## 6.4 (2026-08-20z4) — ujednolicenie standardu: historia zmian wyłącznie w tym pliku

Pole `changelog:` w YAML (39 linii) wyniesione 1:1 do nowo utworzonego
`references/CHANGELOG.md`.

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

> Poniższa treść pochodzi z pola `changelog:` we frontmatterze SKILL.md. Przeniesiona **1:1, bez zmiany ani jednego
> zdania**. Powód: historia zmian ma mieszkać w jednym miejscu — w tym pliku —
> a nie być rozproszona między korpusem SKILL.md, frontmatterem i `references/`.
> Rozproszenie było źródłem rozjazdów wykrytych flagami F-101 i F-102: test T12
> szukał historii w `references/` i raportował fałszywe luki tam, gdzie wpisy
> istniały, tylko w SKILL.md.

changelog:
  - "6.2 (2026-07-12): ZAMKNIĘTE — WARN 'średni priorytet: 13 plików w
    references/ bez odwołań do shared/' (otwarty w sesji 6.1). Sprawdzono
    treść, nie tylko obecność odwołań, każdego z 13 plików: MOD-A..MOD-F
    (6 wąskich modułów tematycznych — błędy pełnomocnika, groźba bezprawna,
    nagrania, podwójna kwalifikacja kwoty, konto e-mail pracownika, szkoda
    od własnego pełnomocnika), PRZEBIEG-1/2/3 (model czteroprzebiegowy
    własny dla tego skilla — ekstrakcja/struktura/predykcja, nie istnieje
    odpowiednik w shared/ ani w analizator-dowodow-v3, który używa zupełnie
    innej architektury MP0-MP13 + macierz D×T), WERYFIKACJA-DOWODOW.md
    (protokół W1-W4/O1-O5 przypięty do własnego modelu Przejść I-IV, nie
    do FACT-SOURCE-LOCK/PRAWO-HARDGATE z shared/), filtry-analityczne.md
    (11 filtrów własnych, sprawdzone przeciw shared/MOD-NEGACJA-DOWODOW —
    inny zakres: filtry oceniają kompletność analizy, MOD-NEGACJA-DOWODOW
    ocenia odporność dowodu na obalenie), moduly-spec.md (świadomy fallback
    awaryjny agregujący MOD-A..F w jednym pliku na wypadek braku dostępu do
    plików osobnych — duplikacja WEWNĄTRZ tego samego skilla, udokumentowana
    i zamierzona, nie międzyskillowa). WYNIK: brak potwierdzonej duplikacji
    z shared/ ani z analizator-dowodow-v3 w żadnym z 13 plików — treść jest
    unikalna dla własnej metodologii tego skilla. Brak odwołań do shared/
    był więc fałszywym sygnałem ostrzegawczym, nie dowodem duplikacji.
    Żadna treść nie została zmieniona — to weryfikacja zamykająca, nie
    refaktor."
  - "6.1 (2026-07-12): naprawa nakładania kompetencji z analizator-dowodow-v3
    (WARN z audytu silnika). references/koszty-terminy.md i
    references/orzecznictwo.md przestały utrzymywać własne, niezależne
    kopie terminów procesowych i hierarchii orzecznictwa — teraz wskazują
    na kanoniczne shared/terminy.md i shared/ORZECZENIA-HIERARCHIA.md,
    zachowując lokalnie WYŁĄCZNIE pozycje uzupełniające (terminy) i format
    cytowania (orzecznictwo). Dodano sekcję 'GRANICA KOMPETENCJI vs.
    analizator-dowodow-v3'. Przy okazji wykryto i zgłoszono błędną
    klasyfikację 'Odpowiedź na pozew' (art. 207 §2 KPC) jako ZAWITY w
    shared/terminy.md, powinien być INSTRUKCYJNY — patrz changelog
    shared/terminy.md. UWAGA: pozostałe 13 plików w references/ (MOD-A..F,
    filtry-analityczne, PRZEBIEG-1..3, WERYFIKACJA-DOWODOW, moduly-spec,
    BLUEPRINT-SCHEMA) nadal nie mają żadnych odwołań do shared/ — to
    świadomie NIE zostało ruszone w tej sesji (brak w nich potwierdzonej
    duplikacji jak w terminy/orzecznictwo; wymaga osobnej sesji per plik,
    nie zgadywania). Zarejestrować w CHECKLIST-DEDUP.md i zamknąć
    odpowiednią pozycję w WARN-OTWARTE.md."
