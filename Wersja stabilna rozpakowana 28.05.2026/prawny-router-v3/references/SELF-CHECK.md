# SELF-CHECK — Pełna Lista Kontrolna przed Każdą Odpowiedzią

> Plik wydzielony z prawny-router-v3/SKILL.md (R1).
> Wywołanie: `view /mnt/skills/user/prawny-router-v3/references/SELF-CHECK.md`

---

```
⛔ BLOK 0A — BRAMKA ANONIMIZERA (wykonaj PRZED wszystkim innym)
□ [0A-1] ##ANON_START## w wiadomości? → decyzja_sesji='anon', pomiń 0A, idź BLOK 1
□ [0A-2] ##PLIK_ORYGINALNY## w wiadomości? → decyzja_sesji='raw', pomiń 0A, idź BLOK 1
□ [0A-3] decyzja_sesji='anon'? → widget auto, idź BLOK 1
□ [0A-4] decyzja_sesji='raw'?  → idź BLOK 1 bez pytania
□ [0A-5] decyzja_sesji=null → skan ostatnich 10 wiadomości:
         ##ANON_START## → 'anon' · ##PLIK_ORYGINALNY## → 'raw'
         Brak → skan bieżącej: ≥1 WYSOKI lub ≥2 ŚREDNIE?
         TAK → ⛔ STOP. Zadaj pytanie anonimizacyjne. ZAKOŃCZ. Czekaj na a/b.
         NIE → decyzja_sesji='raw', idź BLOK 1
□ [ANON-B] fraza żądania anonimizacji? → widget natychmiast
JEŚLI BLOK 0A nie zamknięty → STOP. Żaden punkt poniżej nie jest wykonywany.

□ Wczytałem references/KROK0A-anonimizer.md (szczegóły bramki)?
□ Wczytałem references/KROK1-detekcja.md (tryb + hard gate ISAP)?
□ web_search/web_fetch dla każdego artykułu/liczby — FAKTYCZNIE wywołałem narzędzie?
□ Każdy artykuł/termin/orzeczenie ma znacznik ✅ [VER: źródło, data] lub ⚠️?
□ Sprawa karna → wczytałem mod-N-karne.md → mod-N zdecydował: kwalifikator TAK/NIE?
□ Sygnatury orzeczeń przeszły V-SYG-1/2/3/4 (shared/SYGNATURY.md)?
□ Sklasyfikowałem do [1]–[10] (lub BJ–BW)?
□ Sprawdziłem shared/ACTIVATION-MATRIX.md przy nakładaniu się skillów?
□ Wczytałem PRIMARY skill PRZED analizą?
□ Sprawdziłem termin zawity (nakaz/wyrok)?
□ [INTENT-DOCX] Pismo procesowe → delegowane do pisma-procesowe-v3?
   Status DRAFT/FINAL, watermark, CP-GATE — wyłącznie w pisma-procesowe-v3.
   Router nie zarządza checkpointami pisma — tylko deleguje.
□ Tryb LAIK → raport przez przewodnik-prawny-v2 (KROK H)?
□ Użytkownik pyta "co możesz zrobić" → przewodnik-prawny-v2 KROK M?
□ Zaoferowałem kreator (LAIK + pismo)?
□ Bramka chronologiczna → wykonana przy ≥2 dokumentach wieloetapowych?
  LAIK: pytanie a/b · PRAWNIK: 1-zdaniowa sugestia
□ "chronologia"/"oś czasu"/"timeline" → chronologia-sprawy-v1 natychmiast?
□ Raport Sytuacyjny → zaproponowany po piśmie [A] / po doc [B] / na żądanie [C]?
□ [DISCLAIMER] Odpowiedź z analizą prawną → shared/DISCLAIMER.md OSTATNIM elementem?
  □ Tryb LAIK → wariant uproszczony
  □ Tryb PRAWNIK → wariant pełny
  □ Pismo .docx → stopka na ostatniej stronie + disclaimer w wiadomości czatu

JEŚLI BLOK 0A nie zamknięty → wróć do KROK 0A
JEŚLI przepisy/liczby bez weryfikacji → cofnij się i weryfikuj
JEŚLI brak disclaimera → dodaj przed wysłaniem odpowiedzi
```
