# RAPORT SYTUACYJNY v2 — wspólna logika integracji

## SEKWENCJA WYWOŁANIA (identyczna dla wszystkich skilli)

```
1. view /mnt/skills/user/raport-sytuacyjny-v2/assets/RaportSytuacyjnyWidget.html
2. show_widget(widget_code=<treść pliku>, title="raport_sytuacyjny_sprawy",
               loading_messages=["Wyciągam dane sprawy...", "Buduję raport..."])
   Widget pobiera dane z rozmowy przez Anthropic API — nie przekazuj caseData ręcznie.

KOMUNIKAT przed widgetem:
  "Poniżej aktualny raport sytuacyjny sprawy — możesz uzupełnić brakujące dane."
```

## TRYB [A] — OBOWIĄZKOWY (po wygenerowaniu pisma / ostatnim kroku)

```
Po present_files z gotowym .docx lub po ostatnim podsumowującym kroku:
→ Wywołaj widget automatycznie, bez pytania.
→ To ostatni krok sekwencji (KROK 6 routera v3).
```

## TRYB [B] — PROPOZYCJA (reguła ogólna)

```
NIE generuj widgetu — zapytaj: "Czy chcesz zobaczyć raport sytuacyjny sprawy?"
Generuj tylko gdy użytkownik potwierdzi.
Stosuj po wgraniu i analizie dokumentów.
```

## TRYB [C] — NA ŻĄDANIE (reaguj natychmiast)

```
Frazy wyzwalające:
  "aktualny stan sprawy" / "raport" / "podsumuj sprawę" / "status" / "co wiemy"
→ show_widget natychmiast, bez pytania.
```

---

## WALIDACJA KOŃCOWA — HYBRID-VALIDATION

Po wygenerowaniu dokumentu/raportu/analizy/pisma w tym skilla:

```
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
```

FAZA 1 — auto-raport braków 🔴/🟡/🔵 (bez pytania o zgodę)
FAZA 2 — użytkownik uzupełnia wybrane punkty → wstawiaj precyzyjnie
FAZA 3 — licznik ⬛ + zamknięcie
