# WORKFLOW: Generator Umów
## Analizator Umów v1 · workflows/generator-umowy.md

**Wywołanie:** *„wygeneruj umowę"*, *„stwórz NDA"*, *„napisz umowę B2B/najem/IT/..."*,
*„przygotuj projekt umowy"*.

Przed startem: `view references/generator/rdzen-generowania.md` (R1–R7 trybu
generowania) — jeśli jeszcze nie wczytany w tej sesji.

---

### KROK 1 — ROUTING (BRAMKA 1)

Ustal typ umowy i wczytaj **wyłącznie** właściwy moduł essentialia z tabeli
głównej `SKILL.md` (G, H, I, J1–J10, J20, MA) — dokładnie ta sama tabela, której
używasz w trybie analizy. Essentialia negotii dla generowania i checklisty dla
analizy pochodzą z **tego samego** modułu — nie duplikuj wiedzy w dwóch miejscach.

Jeśli typ niejasny → `view references/mod-J0-routing.md`, zapytaj o brakujące
sygnały zanim przejdziesz dalej.

### KROK 2 — WYWIAD / INTAKE (BRAMKA 2)

Zbierz dane wg zasad `INTAKE-GAP` (`view /mnt/skills/user/shared/INTAKE-GAP.md`):

- strony (pełne dane, sposób reprezentacji, KRS/NIP jeśli osoba prawna),
- przedmiot umowy i essentialia specyficzne dla typu (z modułu z KROKU 1),
- pozycja negocjacyjna klienta (kto go zleca — strona silniejsza/słabsza) →
  wpływa na dobór wariantu klauzul z `mod-shared-fallback-library.md`,
  jeśli klient nie ma własnego `practice-profile.md` (patrz R4).
- ryzyka szczególne zgłoszone przez klienta (np. IP, RODO, kary umowne, FM).

Pola nieznane → oznacz `⬛` i **zatrzymaj się** — nie zgaduj essentialia.
Wyjątek: „tryb express” (patrz R6 w rdzeniu generowania).

### KROK 3 — SZKIELET (BRAMKA 3)

Zbuduj strukturę dokumentu (nagłówki §, bez treści) na podstawie essentialia z
modułu źródłowego + standardowego szkieletu:

```
1. Oznaczenie stron / preambuła
2. Definicje (jeśli >3 pojęcia wymagają precyzji)
3. Przedmiot umowy
4. Essentialia specyficzne dla typu (patrz moduł z KROKU 1)
5. Wynagrodzenie / rozliczenia
6. Odpowiedzialność / kary umowne (jeśli dotyczy)
7. Poufność / RODO (routing do mod-shared-rodo.md jeśli przetwarzanie danych)
8. Czas trwania, wypowiedzenie, skutki ustania
9. Postanowienia końcowe (prawo właściwe, spory, zmiany, załączniki)
10. Podpisy
```

Zatrzymaj się i pokaż szkielet użytkownikowi przed wypełnieniem treścią
(zgodnie z R6), chyba że tryb express.

### KROK 4 — TREŚĆ + STYL/FORMAT (BRAMKA 4)

Wypełnij szkielet pełną treścią. Przy redagowaniu każdej klauzuli:
`view references/generator/style-format-generowania.md` — stosuj S.1–S.4.
Elementy strukturalne (komparycja, preambuła, definicje, postanowienia
końcowe, zwrot materiałów, cesja) — bierz z
`view references/generator/boilerplate-strukturalne.md`, nie pisz od zera.

Jeśli klauzula brzmi niejednoznacznie lub próbuje regulować więcej niż jedną
rzecz naraz — zdiagnozuj ją przez
`view references/generator/kategorie-klauzul-taksonomia.md` (7 kategorii wg
Adams, MSCD) i rozbij na osobne zdania/paragrafy wg kategorii.

Dla klauzul ryzykownych — dobierz wariant z `mod-shared-fallback-library.md`
(poziom A/B/C/D) odpowiedni do pozycji negocjacyjnej klienta ustalonej w KROKU 2.
Dla klauzul finansowych — uruchom `mod-shared-economic.md` automatycznie.
Dla umów IT z komponentami open source, materiałów z wizerunkiem osób, lub
systemami AI — sprawdź, czy dotyczy `references/generator/doktryna-uzupelnienie.md`.

### KROK 5 — BRAMKA WALIDACJI I FINALIZACJA (BRAMKA 5)

Przed zwróceniem finalnej wersji:

1. `view /mnt/skills/user/shared/HYBRID-VALIDATION.md` — wykonaj pełną walidację.
2. Jeśli umowa > 15 stron / > 15 § / > 10 odesłań → uruchom dodatkowo
   `workflows/weryfikacja-spojnosci-odeslan.md` (dwuetapowa: inwentaryzacja →
   weryfikacja) — OBOWIĄZKOWE przy tych progach, nie opcjonalne.
3. Wyświetl bramkę potwierdzenia (dostosowana do architektury tego systemu):

```
⛔ BRAMKA — zanim wygeneruję finalną wersję:
1. Essentialia z modułu [X] — kompletne, brak ⬛?
2. Przepisy/progi cytowane w umowie zweryfikowane (✅ [VER] lub ⚠️ [NIEWERYFIKOWANE])?
3. Dane stron zweryfikowane (KRS/NIP aktualne)?
4. Prawnik prowadzący sprawę widział draft?
Potwierdź: „tak, generuj" — lub wskaż co poprawić.
```

4. Po potwierdzeniu → finalna wersja, ZERO meta-tekstu w treści (S.4).
5. Przed eksportem do `.docx` → zastosuj standard typografii/layoutu z
   `view references/generator/legal-design-produkcyjny.md` (v1.17 — czcionka,
   bordery, ew. tabela „Kluczowe warunki" i spis treści wg progów LD-P.4),
   następnie `view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md § STRIP-VER-GATE`
   oraz uruchom skill `docx` do formatowania pliku wynikowego.
6. Po wygenerowaniu → `view /mnt/skills/user/shared/POST-VALIDATION.md`.

Wyjątek: „tryb express" / „zrób bez pytania" → generuj, ale dodaj nagłówek
`[DRAFT — DO WERYFIKACJI]`.

### Disclaimer

Na końcu wiadomości (nie w treści umowy!) — jedna linijka:
> *Projekt umowy ma charakter roboczy i wymaga weryfikacji przez radcę prawnego
> lub adwokata prowadzącego sprawę przed podpisaniem.*
