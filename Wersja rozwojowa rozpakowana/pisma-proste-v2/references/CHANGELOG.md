# CHANGELOG — Pisma proste v2

> Pełna historia zmian tego skilla. **Jedyna lokalizacja kanoniczna** — w SKILL.md
> historii nie ma; jest tam wyłącznie krótki skrót w polu `changelog:` frontmatteru.
> Standard ujednolicony 2026-08-20z4 dla całego systemu: plik `references/CHANGELOG.md`,
> nigdy sekcja w korpusie SKILL.md ani pełna lista w YAML.
> Wczytuj TYLKO gdy potrzebujesz historii konkretnej naprawy — przy audycie, przy
> pytaniu „dlaczego to tak działa", przy regresji. W normalnym toku pracy zbędny.

---

## 2.11 (2026-08-20z4) — ujednolicenie standardu: historia zmian wyłącznie w tym pliku

Historia wyniesiona z korpusu SKILL.md do nowo utworzonego `references/CHANGELOG.md`.

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

- **2026-07-25 (v2.6):** Zarejestrowano `shared/ZAZALENIE-ADRESAT-GATE.md`
  jako obowiązkową bramkę w KROK 9d — systemowe rozwiązanie luki
  "zażalenie wymienione, ale bez adresata", potwierdzonej w 69 plikach
  całego systemu (patrz AUDIT-JOURNAL.md, AUDYT-2026-07-25c/d).

- **2026-07-25 (v2.5):** Dodano nowy schemat **SPL — Skarga na czynności
  komornika** (`references/SPL-skarga-komornik.md`, art. 767 KPC) — na
  żądanie użytkownika, w ramach rozszerzenia o "wnioski i pozostałe
  dokumenty kierowane do sądu". Zarejestrowano w tabeli schematów, KROK 4
  ścieżki wykonania i M6-oplaty.md (100 zł). Adresat opisany od razu
  poprawnie (do komornika, nie bezpośrednio do sądu — art. 767 §5 KPC),
  zgodnie z wnioskiem z audytu adresatów zażalenia tego samego dnia.

- **2026-07-25 (v2.4):** CRIT-TREŚĆ — `references/SPH-inne.md`: poprawiono
  błędny adresat/podstawę zażalenia w SPH-A (odmowa zwolnienia od kosztów
  sądowych) — było art. 394 §1 KPC (sąd II instancji), jest art. 394¹ᵃ §1
  pkt 1 KPC (zażalenie poziome, inny skład tego samego sądu). Oznaczono jako
  sporne/do weryfikacji podstawę zażalenia w SPH-B (odmowa przywrócenia
  terminu) — poprzedni cytat (art. 394 §1 pkt 2 KPC) treściowo nie pasował.
  Zweryfikowano online (ISAP, arslege.pl, lexlege.pl). Zob.
  audyt-systemu-v4/references/AUDIT-JOURNAL.md, wpis 2026-07-25.
*Dla pism wielowątkowych → pisma-procesowe-v3*
*Dla analizy dowodów → analizator-dowodow-v3 · Dla orzecznictwa → orzeczenia-sadowe-v2*

---
