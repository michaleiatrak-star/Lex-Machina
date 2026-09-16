# CHANGELOG — analiza-sadowa-v6

- 6.9 (2026-09-16, F-189): ODTWORZENIE utraconego wydania 6.8 (F-189): marker T28-OK na linii opisującej usuniętą jednostkę „art. 13 ust. 1a KSCU” w references/koszty-terminy.md. Treść merytoryczna bez zmian.
- 6.8 — LUKA JAWNA: wydanie AUDYT-2026-09-12f nieobecne na dysku — odtworzone w 6.9
- 6.7 (2026-09-12, O-11 c.d.): references/koszty-terminy: sekcje kosztowe przebudowane z ODCZYTU TRESCI. OBALONE i usuniete: "sprawy gospodarcze 5% max 20 000 zl (art. 13 ust. 1a KSCU)" - jednostka art. 13 ust. 1a NIE ISTNIEJE; "sprawy pracownicze 5% WPS min 30 max 1000 zl" - normy brak w tekscie; wpis WSA 200/500/1000/2000 - wpis stosunkowy to 4/3/2/1% z podlogami 100/400/1500/2000 i capem 100 000 zl (rozp. RM t.j. Dz.U. 2021 poz. 535, par. 1), a wpis staly zalezy od RODZAJU aktu (par. 2); stawka pracownicza 180/120/240 zl - jest 360 zl (par. 9 ust. 1 pkt 1), a 120/240 to PODLOGI z par. 10; apelacja karna 420 zl - jest 840 zl przed SO i 1200 zl przed SA (par. 11 ust. 2 pkt 4-5); tabela par. 2 gubila prog 5 000 000 zl i stawke 25 000 zl. Dopisane: KROK 0 z art. 104a (brak zwolnien na wniosek w EPU i S24), rozwod i sprawy rodzinne z art. 26-38 wraz ze zwrotem z art. 79, oplaty karne (Dz.U. 2023 poz. 123), par. 9/10/11/17 obu taks, sekcja ryzyka kosztowego z KPC (art. 98-103, 520) z ostrzezeniem art. 102 KPC != art. 102 KSCU. NAPRAWA TERMINU: "zarzuty od nakazu 14 dni, art. 493 par. 1 KPC" - art. 493 par. 1 nie zawiera terminu; art. 480[2] par. 2 KPC: miesiac (nakazowy, doreczenie w UE), 2 tygodnie (upominawczy, w kraju), 3 miesiace (poza UE)
- 6.6 (2026-09-10x, O-11): references/koszty-terminy: sekcja KOSZTY SADOWE opatrzona KROKIEM 0 i odeslaniem do tabeli ustanawiajacej; kwoty w module sa orientacyjne
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
