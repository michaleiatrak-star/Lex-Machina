# STYL I FORMAT — generowanie dokumentów
## Analizator Umów v1 · Moduł generator/ (BRAMKA 4 — otwórz przy KAŻDYM generowaniu/edycji treści)

> Odpowiednik `style-redakcyjny.md` + `format-checklist.md` z wzorca `commercial-legal-pl`,
> uogólniony (nie przypisany do jednej kancelarii). Ma pierwszeństwo nad ogólnymi
> konwencjami pisania dokumentów, ale jest podrzędny wobec essentialia negotii
> i wymogów ustawowych z modułu źródłowego (J0–MA, J20, J21).

---

## S.1 Styl redakcyjny — co stosować

- **Zdania krótkie, jeden obowiązek na zdanie.** Unikaj zdań wielokrotnie złożonych
  łączących 3+ zobowiązania spójnikami „oraz”/„a także”/„jak również”.
- **„W przypadku" zamiast „Jeżeli"** w klauzulach warunkowych — spójniejsze z resztą
  dokumentu, gdy dokument ma wiele warunków w różnych paragrafach.
- **Strona czynna, podmiot jawny.** „Zamawiający zapłaci w terminie 14 dni” zamiast
  „Płatność nastąpi w terminie 14 dni” (kto płaci?).
- **Zero łaciny w treści klauzul operacyjnych.** Terminy typu *lucrum cessans*,
  *dolus eventualis*, *essentialia negotii* dopuszczalne wyłącznie w komentarzu/
  uzasadnieniu poza treścią dokumentu, nigdy w paragrafie, który podpisuje strona
  niebędąca prawnikiem.
- **Unikaj „niezwłocznie”** bez doprecyzowania — zawsze podawaj liczbę dni. Wyjątek:
  gdy ustawa literalnie posługuje się tym pojęciem i termin nie może być inny
  (wtedy dopisz w nawiasie: „(tj. bez zbędnej zwłoki)”).
- **Definicje przy pierwszym użyciu**, Wielka Litera = pojęcie zdefiniowane,
  konsekwentnie w całym dokumencie (nie mieszaj „Zamawiający”/„zamawiający”).
- **Kwoty cyframi i słownie** przy pierwszym wystąpieniu w części operacyjnej
  (np. w karach umownych, cenie, kapitale zakładowym); dalej wystarczą cyfry.
- **Wyliczenia** — jednolita konwencja w całym dokumencie: `1) / 2) / 3)` dla
  wyliczeń normatywnych (zgodnie z konwencją polskiej legislacji), `a) / b) / c)`
  dla podpunktów.

## S.2 Typografia i legal design

- Cudzysłowy typograficzne „ ” (nie proste " ").
- Pauza długa — (nie łącznik -) w definicjach i wtrąceniach.
- Numeracja: `§ / ust. / pkt` dla umów i regulaminów cywilnoprawnych; `Rozdział/§`
  dla statutów i regulaminów wewnętrznych; numeracja ciągła uchwał w obrębie roku
  kalendarzowego (np. „Uchwała nr 3/2026”) dla uchwał organów spółek.
- Dla dokumentów kierowanych do konsumentów lub pracowników (regulaminy B2C,
  regulamin pracy, polityka prywatności) — uruchom ocenę
  `view references/mod-shared-legal-design.md` (scoring D1–D5) i dąż do wyniku
  ≥ 7/10 w każdym wymiarze przed zwróceniem finalnej wersji. Wynik < 30/50
  (60%) = wróć do BRAMKI 3 i przeredaguj, nie tylko dopisz definicje.

## S.3 Format-checklist — uruchom mentalnie przed zwróceniem KAŻDEGO dokumentu

```
✓ cudzysłowy „polskie"          ✓ pauza długa —            ✓ kwoty cyframi i słownie
✓ numeracja spójna w całości    ✓ Wielkie = definicja       ✓ odesłania wewnętrzne działają
✓ bez łaciny w treści operacyjnej   ✓ bez „niezwłocznie" bez liczby dni
✓ nazwy stron/organu spójne od preambuły do podpisów
✓ przepisy i progi zweryfikowane (✅ [VER] lub ⚠️ [NIEWERYFIKOWANE]) — patrz R1
✓ essentialia z modułu źródłowego — wszystkie obligatoryjne pozycje obecne (nie ⬛)
✓ forma dokumentu zgodna z wymogiem ustawowym (pisemna/notarialna/kwalifikowany podpis)
```

Dla dokumentów > 15 stron lub > 15 paragrafów lub > 10 odesłań wewnętrznych —
uruchom dodatkowo `view workflows/weryfikacja-spojnosci-odeslan.md` (dwuetapowa
inwentaryzacja → weryfikacja odesłań i spójności), zanim uznasz dokument za
gotowy do BRAMKI 5.

## S.4 Output — zero meta-tekstu w finalnej wersji

- **Wersja robocza / etapowa:** komentarze, warianty, pytania — dozwolone, osobno
  przed/po treści dokumentu.
- **Wersja finalna:** ZERO komentarzy w treści. Jeśli tryb LAIK lub brak
  potwierdzenia z BRAMKI 5 — całość i tak oznaczona `[DRAFT — WYMAGA WERYFIKACJI
  PRAWNIKA]`/`[DO WERYFIKACJI]`, ale bez śródtekstowych dopisków.
- Jedna linijka disclaimera na końcu (nie w generatorze umów finalnych — tam
  disclaimer idzie w wiadomości otaczającej dokument, nie w treść umowy, żeby nie
  trafił do podpisywanego tekstu).
