# CHANGELOG — analizator-przepisow-v2

- 2.6 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-127**): NAPRAWA wstawki F-115 z sesji 08-23i — blok `SELF-CHECK ANTY-FASADA` był wstawiony WEWNĄTRZ bloku ``` w sekcji „Krok 0.2 — Wybierz ścieżkę analizy", przez co renderował się jako tekst kodu, a nie jako bramka. Blok przeniesiony pod kotwicę HARD GATE na początku pliku. Klasa błędu: REGUŁA 5 bloku HARDGATE-AUDYT (`audyt-systemu-v4/references/WARN-OTWARTE.md`) — wstawianie treści bez kontroli struktury docelowej. Kontrola po naprawie: parzystość znaczników ``` zachowana, spis nagłówków identyczny przed/po. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24.
- 2.6 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-126**): sekcja `## CHANGELOG` usunięta z korpusu `SKILL.md`, wpisy przeniesione 1:1 do tego pliku (ZASADA 15 — jedna lokalizacja kanoniczna historii). W korpusie zostało wyłącznie odesłanie. Treści NIE odtwarzano z pamięci — przeniesiony został istniejący tekst. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24.

- 2.5 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, bramka dodana — skill jej NIE MIAŁ mimo że cytuje przepisy najczęściej w systemie (P1). Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

> Lokalizacja kanoniczna historii wersji (ZASADA 15). Plik założony 2026-08-23i;
> wersje wcześniejsze nieodtworzone — ślad w audyt-systemu-v4/references/AUDIT-JOURNAL.md.

---

## Wpisy przeniesione z korpusu SKILL.md (F-126, 2026-08-24)

> Tekst poniżej przeniesiony 1:1 z sekcji `## CHANGELOG` w `SKILL.md`.
> Nic nie przeredagowano ani nie odtworzono z pamięci — przeniesienie
> istniejącego tekstu, zgodnie z zakazem z wiersza flagi F-126.

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
