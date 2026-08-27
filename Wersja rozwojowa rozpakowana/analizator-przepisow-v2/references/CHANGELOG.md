# CHANGELOG — Analizator Przepisów v2

> Pełna historia zmian tego skilla. **Jedyna lokalizacja kanoniczna** — w SKILL.md
> historii nie ma; jest tam wyłącznie krótki skrót w polu `changelog:` frontmatteru.
> Standard ujednolicony 2026-08-20z4 dla całego systemu: plik `references/CHANGELOG.md`,
> nigdy sekcja w korpusie SKILL.md ani pełna lista w YAML.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy — przy audycie, przy
> pytaniu „dlaczego to tak działa", przy regresji. W normalnym toku pracy zbędny.

---

## 2.5 (2026-08-20z4) — ujednolicenie standardu: historia zmian wyłącznie w tym pliku

Treść przeniesiona z korpusu SKILL.md 1:1. Przy okazji naprawiony NIESPARSOWALNY
frontmatter: pole `description` zawierało niecytowane dwukropki (`v2:`, `v2.3:`),
przez co YAML nie ładował się w ogóle — `yaml.safe_load` zwracał błąd „mapping values
are not allowed here". Usterka ZASTANA (obecna też w stanie pierwotnym), wykryta
kontrolą parsowalności w tej sesji. Naprawa: blok `>-` zamiast skalara jednoliniowego.

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

**2.4 (2026-07-15):**
- **DEDUP — wydzielono hierarchię źródeł (RZĄD 1/2A/2B/3)** z Modułu 1 do
  kanonicznej lokalizacji `shared/HIERARCHIA-ZRODEL.md`. Powód: kategoryzacja
  obowiązywała dotąd wyłącznie lokalnie w tym skillu i nie była wymuszana
  przy linkach/kotwicach generowanych w innych skillach/modułach (np.
  `shared/WERYFIKACJA-SLAD.md`, `shared/PRAWO-HARDGATE.md`) — zgłoszone
  przez użytkownika po tym, jak w rozmowie podano linki źródłowe (w tym
  strony indywidualnych kancelarii, Rząd 3) bez kategoryzacji RZĄD.
- Ten plik teraz odsyła do `shared/HIERARCHIA-ZRODEL.md` zamiast duplikować
  treść — zgodnie z zasadą dedup już stosowaną w systemie (patrz np.
  `prawny-router-v3` changelog 3.14/3.16 — ten sam wzorzec "usuń duplikat,
  przekieruj na ścieżkę kanoniczną").
- Wpisano do `audyt-systemu-v4/references/CHECKLIST-DEDUP.md` jako nowa
  pozycja kanoniczna.
- Wersja 2.3 → 2.4.

**2.3 (2026-07-06):**
- **KOREKTA na wyraźne polecenie użytkownika:** duże, uznane portale
  prawnicze/branżowe (prawo.pl, LEX-komentarz, Legalis-komentarz, rp.pl,
  infor.pl, lexlege.pl, gazetaprawna.pl, kadry.infor.pl,
  poradnikprzedsiebiorcy.pl, money.pl, biznes.gov.pl), błędnie nazwane w
  v2.2 "RZĄD 3", przeniesione do **RZĄD 2** jako podkategoria **2B**
  (obok 2A — oficjalne orzecznictwo i LEX/Legalis-tekst). Dodano do listy
  **gofin.pl**. Znacznik zmieniony na `📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2: ...]`.
- **RZĄD 3 zredefiniowany:** teraz wyłącznie strony indywidualnych
  prawników/kancelarii, blogi eksperckie, NGO, fora — źródła z WYSOKIM
  RYZYKIEM DEZAKTUALIZACJI (brak redakcji wydawniczej, brak gwarancji
  aktualizacji po nowelizacji). Dodano zasady dodatkowe: obowiązkowe
  sprawdzenie daty publikacji (brak/starsza niż 24 mies. → ostrzeżenie),
  zakaz cytowania bez krzyżowej weryfikacji w Rzędzie 1/2A, rola wyłącznie
  jako trop do dalszego wyszukania. Nowy znacznik:
  `⚠️📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: ...]` (z ostrzeżeniem w samym znaczniku,
  nie tylko w opisie).
- Zaktualizowano spójnie: Moduł 2, Moduł 4 sekcja 10 (rozdzielone teraz na
  trzy pozycje: normatywne/orzecznicze Rząd 1–2A, pomocnicze Rząd 2B,
  pomocnicze wysokiego ryzyka Rząd 3), Moduł 7D.
- Wersja 2.2 → 2.3, description 698 znaków (✅ OK).

**2.2 (2026-07-06):**
- **Restrukturyzacja "Hierarchii źródeł" (Moduł 1) na jawne RZĄD 1/2/3**, na
  wyraźne polecenie użytkownika. RZĄD 1 = ISAP/Sejm/EUR-Lex/UODO/BIP (tekst
  przepisu, wiążący). RZĄD 2 = oficjalne bazy orzeczeń (sn.pl,
  orzeczenia.ms.gov.pl, nsa.gov.pl, trybunal.gov.pl, saos.org.pl) oraz
  LEX/Legalis wyłącznie w roli tekstu przepisu przy aktywnej licencji. RZĄD 3
  = interpretacja doktrynalna/portale informacyjne — TRZECIORZĘDNE,
  POMOCNICZE: rozszerzono listę z v2.1 (prawo.pl, LEX/Legalis-komentarz,
  rp.pl, infor.pl, lexlege.pl) o **pozostałe portale**: gazetaprawna.pl,
  kadry.infor.pl, poradnikprzedsiebiorcy.pl, money.pl, biznes.gov.pl
  (wyłącznie treści poradnikowe) — spójnie z listą już rozpoznaną w
  `shared/PRAWO-HARDGATE.md` (BRAMKA WTÓRNE-ŹRÓDŁO-STOP), rozszerzoną i
  nazwaną tu wprost jako RZĄD 3.
- Znacznik doprecyzowany: `📚 [ŹRÓDŁO POMOCNICZE — RZĄD 3: portal, data]` —
  numer rzędu wprost w znaczniku, żeby w raporcie było widać na pierwszy
  rzut oka, że to trzeciorzędne źródło pomocnicze, nie tekst ani orzecznictwo.
  Zaktualizowano spójnie odesłania w Module 2, Module 4 sekcja 10 i Module 7D
  (`references/MOD-ORZECZ-POWIAZANIA-HISTORIA.md`).
- Wersja 2.1 → 2.2, description 633 znaki (✅ OK).

**2.1 (2026-07-06):**
- **Dodano sekcję "Źródła pomocnicze — interpretacja doktrynalna" (Moduł 1).**
  Na wyraźne polecenie użytkownika: skill ma chętnie korzystać z zewnętrznych
  interpretacji/komentarzy (prawo.pl, LEX/lex.pl, Legalis, rp.pl i inne duże,
  uznane portale branżowe), ale ZAWSZE oznaczać je wyraźnie jako źródło
  pomocnicze — znacznik 📚 [ŹRÓDŁO POMOCNICZE: ...], odróżniony od znaczników
  HARDGATE ✅ [VER: ...] zastrzeżonych dla zweryfikowanego tekstu przepisu
  (ISAP/ELI) i zweryfikowanego orzecznictwa (sn.pl/orzeczenia.ms.gov.pl/...).
  Wyraźny zakaz mieszania ról: te portale nie mogą być podstawą brzmienia
  przepisu (poza rolą ŹRÓDŁO-2 LEX/Legalis już opisaną w `shared/PRAWO-
  HARDGATE.md` przy aktywnej licencji) ani potwierdzeniem istnienia sygnatury
  orzeczenia (BRAMKA WTÓRNE-ŹRÓDŁO-STOP z HARDGATE pozostaje w mocy).
- Skrzyżowane odesłania dodane w: Moduł 2 (wykładnia pojęć nieostrych —
  komentarz doktrynalny jako uzupełnienie, nie zamiennik, wykładni
  orzeczniczej), Moduł 4 sekcja 10 (Raport końcowy — rozdzielono "Źródła
  normatywne i orzecznicze" od "Źródła pomocnicze"), Moduł 7D w
  `references/MOD-ORZECZ-POWIAZANIA-HISTORIA.md` (kontekst dla laika —
  komentarze mogą wspomóc przystępne wyjaśnienie, oznaczone 📚).
- Nie zduplikowano logiki HARDGATE — nowa sekcja odsyła do istniejących zasad
  ŹRÓDŁO-2 (LEX/Legalis dla tekstu) i BRAMKI WTÓRNE-ŹRÓDŁO-STOP (sygnatury)
  w `shared/PRAWO-HARDGATE.md`, dodaje wyłącznie nową kategorię — użycie tych
  portali jako doktryny/komentarza, którego dotąd skill nie adresował wprost.
- Wersja podniesiona 2.0 → 2.1, description zaktualizowany (614 znaków, ✅ OK).
