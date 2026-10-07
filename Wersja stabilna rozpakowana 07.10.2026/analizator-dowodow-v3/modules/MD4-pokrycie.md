# MD4 — MAPA POKRYCIA PRZESŁANEK

> **CLAIM-VALIDATION:** Przed wypełnieniem mapy wykonaj weryfikację twierdzeń strony
> zgodnie z `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`.
> Twierdzenie `[⛔ SPRZECZNE]` z materiałem → zastąp; nie wpisuj do mapy jako przesłanki.
> Twierdzenie `[⛔ NIEUDOWODNIONE]` → wpisz jako BRAK ✗ z adnotacją „twierdzenie bez oparcia".

```
[ ] PRZESŁANKA: [nazwa]
    Dowód: [nazwa, poziom, score]
    Status: POKRYTE ✓ / CZĘŚCIOWE ~ / BRAK ✗
```

**Luki:**
```
LUKA: [przesłanka] · Blokuje roszczenie: TAK/NIE
Uzupełnienie: [konkretne działanie]
Dotyczy: [lista ID z dashboardu, których ta luka dotyczy — np. EV3, EV4, INTRA-2, SPOJ-1]
```

> **Pole `Dotyczy`** wskazuje, które elementy `evidence[]` i `contradictions[]`
> w dashboardzie są zależne od uzupełnienia tej luki. Pozwala priorytetyzować:
> luka wpływająca na wiele elementów (≥2) ma priorytet nad luką izolowaną, nawet
> jeśli każda z osobna wydaje się marginalna.

**Podsumowanie:**
```
Pokrytych ✓: [n] ([%]) | Częściowych ~: [n] | Brak ✗: [n]
Ocena: PEŁNA ≥80% / CZĘŚCIOWA 50–79% / NIEWYSTARCZAJĄCA <50%
```

---

## MAPA DOWODÓW DO FAKTÓW (evidence_map)

Uzupełniająco do mapy pokrycia przesłanek (która łączy fakty z *roszczeniami*),
wypełnij mapę łączącą fakty z *siłą i kompletnością ich dowodu* — niezależnie od
tego, której przesłanki dotyczą. To pozwala odróżnić "fakt jest udowodniony, ale
nie pokrywa żadnej przesłanki" od "fakt pokrywa przesłankę, ale dowód jest słaby".

```
F[NN] — [krótki opis faktu]. Typ dowodu: GŁÓWNY / POŚREDNI / BRAK.
  Jeśli POŚREDNI lub BRAK: [co konkretnie brakuje — np. "brak przelewu/listy płac
  potwierdzających kwotę"; "brak pełnej treści dokumentu poza relacją strony"]
  Źródła: [DOC-ID, …]
```

Reguła: GŁÓWNY = dokument/zapis bezpośrednio stwierdzający fakt (poziom A/B/C z MD1
z dostępną treścią). POŚREDNI = fakt wynika z oświadczenia strony lub z dokumentu,
którego pełna treść nie została przekazana/zweryfikowana. BRAK = fakt powołany,
ale bez żadnego wsparcia dowodowego poza twierdzeniem.

Każdy wiersz oznaczony POŚREDNI lub BRAK powinien mieć odpowiadającą pozycję w
`gaps[]` (z polem `Dotyczy` wskazującym na ten fakt).

---

