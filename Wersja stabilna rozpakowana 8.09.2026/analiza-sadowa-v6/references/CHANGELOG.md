# CHANGELOG — analiza-sadowa-v6

- 6.5 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-129**): pole `changelog:` w YAML liczyło 39 linii, czyli pełną historię zamiast skrótu — T12 zgłaszał to jako ⚠️. Wyniesione 1:1 do tego pliku, w YAML został 7-linijkowy skrót z odesłaniem. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24b.

- 6.4 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, kopia treści zastąpiona wywołaniem. Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

> Lokalizacja kanoniczna historii wersji (ZASADA 15). Plik założony 2026-08-23i;
> wersje wcześniejsze nieodtworzone — ślad w audyt-systemu-v4/references/AUDIT-JOURNAL.md.

---

## Wpisy przeniesione z pola `changelog:` YAML (F-129, 2026-08-24)

> T12 zgłaszał to pole jako ⚠️ — 39 linii to pełna historia, nie skrót
> (ZASADA 15 dopuszcza w YAML skrót do ~15 linii). Tekst poniżej przeniesiony
> 1:1, w oryginalnej składni listy YAML, bez przeredagowania i bez odtwarzania
> czegokolwiek z pamięci.

```yaml
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
```
