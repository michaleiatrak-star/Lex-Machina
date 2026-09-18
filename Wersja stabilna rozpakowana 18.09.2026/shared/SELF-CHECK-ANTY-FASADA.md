# SELF-CHECK-ANTY-FASADA — moduł kanoniczny self-checku antyfasadowego

> **Plik nadrzędny:** `shared/PRAWO-HARDGATE.md`, sekcja BRAMKA ANTY-FASADOWA
> (reguły AF-1…AF-6 — uzasadnienie, definicje i przypadki graniczne).
> Ten plik zawiera WYŁĄCZNIE listę kontrolną do wykonania przed wysłaniem
> odpowiedzi. Historia wersji: `shared/references/CHANGELOG.md`.
>
> **Powstał 2026-08-23i, flaga F-115.** Powód nie jest porządkowy: do tej daty
> self-check istniał jako KOPIA w 7 plikach. Kiedy F-117 dodała regułę AF-6 i
> drugą linię listy do `PRAWO-HARDGATE.md`, **żadna z 7 kopii nie została
> zaktualizowana** — źródło miało 2 pozycje, kopie 1. Dryf zmaterializował się
> przy pierwszej kolejnej zmianie brzmienia, dokładnie tak, jak przewidywała
> rekomendacja flagi. Od teraz treść jest w JEDNYM miejscu, a skille ją WOŁAJĄ.

---

## KIEDY WYKONAĆ

Przed wysłaniem **każdej** odpowiedzi, pisma, raportu lub widgetu, który zawiera
twierdzenie o przepisie, źródle prawnym lub orzeczeniu — niezależnie od tego,
czy skill wywołał router i czy w sesji były dostępne narzędzia.

⛔ **Wyzwalaczem jest BRAK WYWOŁANIA NARZĘDZIA dla danego twierdzenia w danej
odpowiedzi**, nie brak narzędzi w sesji. Nie wolno uzasadniać pominięcia tego,
że narzędzia były niedostępne — wtedy tym bardziej obowiązuje oznaczenie.

---

## LISTA KONTROLNA — obie pozycje obowiązkowe

```
□ [ANTY-FASADA] Czy w odpowiedzi/piśmie jest słowo „zweryfikowano/zweryfikowałem",
  pole „data weryfikacji" albo URL przy przepisie, dla którego NIE wywołałem
  narzędzia W TEJ ODPOWIEDZI?
    TAK → ⛔ usuń deklarację i datę, URL przeformatuj na
          🎯 [CEL — RZĄD 1, NIEOTWARTE: …], przepis oznacz ⚠️ [NIEWERYFIKOWANE]
    ⛔ Zastrzeżenie SELEKTYWNE (przy sygnaturach tak, przy przepisach nie)
      = naruszenie (AF-5). Zastrzeżenie obejmuje wszystko albo nic.

□ [AF-6 ZAKRES] Czy nadałem znacznik statusu (✅/🟨/⚠️/⬛) lub identyfikator w
  formacie źródła (🎯 [CEL…]) treści, którą SAM WYGENEROWAŁEM — pytaniom do
  świadka, checkliście, tezie roboczej, nagłówkowi, wariantowi strategii,
  planowi pisma?
    TAK → ⛔ usuń znacznik z tej treści. Treść własna NIE MA statusu
          weryfikacji; jeśli opiera się na przepisie, status niesie
          PRZYWOŁANY PRZEPIS, nie wygenerowana wokół niego treść.
```

---

## ⛔ ZASADY UTRZYMANIA TEGO PLIKU

1. **Zmiana brzmienia listy idzie WYŁĄCZNIE tutaj.** Skille wołają ten plik i
   nie trzymają własnych kopii — po to powstał. Dopisanie kopii do skilla
   odtwarza problem, który ten moduł rozwiązuje.
2. **Zmiana tutaj wymaga sprawdzenia spójności z `PRAWO-HARDGATE.md`** (AF-1…AF-6).
   Lista jest wykonawczym skrótem tamtych reguł — rozjazd między nimi znaczy,
   że jedno z dwóch miejsc zostało zaktualizowane, a drugie nie.
3. **Rejestr wołających** (stan 2026-08-23i) — aktualizuj przy każdym nowym
   podłączeniu, żeby dało się odpowiedzieć na pytanie „kto to wykonuje":

   | Grupa | Skille |
   |---|---|
   | Podłączone wcześniej jako KOPIA, przerobione na wywołanie | `analizator-dowodow-v3`, `prawny-router-v3` (references/SELF-CHECK.md), `pisma-proste-v2`, `analiza-sadowa-v6`, `przewodnik-prawny-v2`, `pisma-procesowe-v3` (references/SELF-CHECK-PISMA.md), `analizator-umow-v1` |
   | P1 — dodane 2026-08-23i | `orzeczenia-sadowe-v2`, `analizator-przepisow-v2` |
   | P2 — dodane 2026-08-23i | `chronologia-sprawy-v1`, `przesluchanie-swiadkow-v2-min90`, `raport-klienta-v1`, `raport-sytuacyjny-v2` |
   | P3 — DO ZROBIENIA | 16 skilli DR-01…DR-16 |
   | ŚWIADOMIE POZA ZAKRESEM | `prawo-polskie-v2` — czysta fasada routingu, decyzja zapisana w jego `SKILL.md` (F-123, 2026-08-23g); wyzwalacz odwrócenia decyzji: pierwsze twierdzenie o TREŚCI prawa w tym skillu |

---

## ⚠️ OGRANICZENIE — CZEGO TEN MODUŁ NIE ZAŁATWIA

Self-check jest **samo-raportujący**: wykonuje go ten sam proces, który mógł
właśnie zbudować fasadę. Odhaczenie obu pozycji dowodzi, że model odpowiedział
na pytania — nie, że odpowiedział zgodnie ze stanem faktycznym. W TEST2 fasada
weryfikacyjna powstała z prawdziwych elementów (deklaracja + URL RZĄD 1 + data)
i przeszłaby taki self-check, gdyby model uznał, że wywołanie „w zasadzie było".

Wniosek praktyczny: pozycja pierwsza ma sens tylko wtedy, gdy odpowiedź na
pytanie „czy wywołałem narzędzie" jest sprawdzana **wobec listy faktycznych
wywołań w tej odpowiedzi**, nie wobec wspomnienia o nich.

Pomiar skuteczności tej bramki — flaga **F-113** (test z grupą kontrolną),
`audyt-systemu-v4`. Do jej zamknięcia obecność tego modułu w ścieżce wczytania
dowodzi obecności reguły, nie zmiany zachowania.
