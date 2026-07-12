# KROK 0A — Anonimizer (Bramka Twarda RODO)

> Plik wydzielony z prawny-router-v3/SKILL.md (R1).
> Wczytaj gdy: router uruchamia KROK 0A.
> Wywołanie: `view /mnt/skills/user/prawny-router-v3/references/KROK0A-anonimizer.md`

---

## ZASADA BEZWZGLĘDNA

> ⛔ HARD STOP — KROK 0A wykonuje się ZAWSZE jako PIERWSZY, przed detekcją trybu,
> przed analizą, przed jakimkolwiek innym krokiem.
> ZAKAZ przechodzenia do KROK 1 bez zakończenia KROK 0A.
> Jedyny wyjątek: wiadomość zawiera ##ANON_START## lub ##PLIK_ORYGINALNY##.

> ⛔ ZAKAZ POMIJANIA 0A DLA TRYBU PRAWNIK
> Tryb PRAWNIK NIE zwalnia z KROK 0A. Świadome przesłanie danych przez użytkownika
> NIE jest decyzją anonimizacyjną. Jedyną ważną decyzją jest odpowiedź a/b
> na pytanie anonimizacyjne LUB znacznik ##ANON_START## / ##PLIK_ORYGINALNY##.
> Argumenty "użytkownik jest prawnikiem" / "dane są publiczne" / "sprawa jest procesowa"
> NIE są wyjątkami.

---

## SEKWENCJA OBOWIĄZKOWA

```
KROK 0A.1 → Sprawdź znaczniki sesji (skanuj ostatnie 10 wiadomości, nie tylko poprzednią):
  ##ANON_START## w wiadomości?      → decyzja_sesji='anon', POMIŃ 0A, idź KROK 1
  ##PLIK_ORYGINALNY## w wiadomości? → decyzja_sesji='raw',  POMIŃ 0A, idź KROK 1
  decyzja_sesji z poprzednich wiadomości?
    'anon' → widget automatycznie bez pytania
    'raw'  → przejdź do KROK 1 bez pytania
    null   → wykonaj KROK 0A.2

KROK 0A.2 → Przeskanuj wejście pod kątem sygnałów danych osobowych
             (dotyczy KAŻDEGO trybu: LAIK i PRAWNIK bez wyjątku)

KROK 0A.3 → Oceń próg reakcji

KROK 0A.4 → Jeśli próg przekroczony: ZATRZYMAJ SIĘ i zadaj pytanie anonimizacyjne
             ⛔ NIE analizuj, NIE klasyfikuj, NIE wczytuj skilla dziedzinowego
             ⛔ NIE zakładaj decyzji na podstawie trybu ani kontekstu
             ⛔ Czekaj na odpowiedź (a/b) jako następną wiadomość

KROK 0A.5 → Dopiero po odpowiedzi (lub znaczniku sesji) → przejdź do KROK 1
```

---

## TABELA SYGNAŁÓW DANYCH OSOBOWYCH

| Sygnał | Przykład | Priorytet |
|---|---|---|
| Imię + Nazwisko | "Jan Kowalski" | WYSOKI |
| PESEL (11 cyfr) | "92010112345" | WYSOKI |
| NIP | "123-456-78-90" | WYSOKI |
| Adres z ulicą | "ul. Lipowa 5/3, 00-001 Warszawa" | WYSOKI |
| Numer konta | "PL61 1090 1014..." | WYSOKI |
| Numer identyfikacyjny (dowolny format krajowy) | "1199780106558236" | WYSOKI |
| Telefon | "+48 123 456 789" | ŚREDNI |
| E-mail | "jan@domena.pl" | ŚREDNI |
| Data urodzenia w kontekście | "ur. 12.03.1985" | ŚREDNI |

**Próg reakcji:** ≥1 WYSOKI lub ≥2 ŚREDNIE → pytanie anonimizacyjne

---

## PYTANIE ANONIMIZACYJNE (zadaj DOSŁOWNIE, zakończ odpowiedź)

```
📋 Wykryłem w przesłanym dokumencie dane osobowe (imiona, adresy, numery identyfikacyjne).

Czy chcesz je zanonimizować przed analizą?
a) Tak — uruchom narzędzie anonimizacji (zalecane ze względów RODO)
b) Nie — analizuj dokument bez zmian

Anonimizacja zastąpi dane inicjałami i znacznikami [ADRES], [PESEL] itp.
Zanonimizowany dokument trafi automatycznie do analizy.
```

> ⛔ Po zadaniu pytania: ZAKOŃCZ odpowiedź. Zero analizy, zero wstępnych wniosków,
> zero kwalifikacji — nawet "na razie". Czekaj na a/b.

"a"/tak → widget | "b"/nie → decyzja_sesji='raw' → KROK 1

---

## TRYB B — NA ŻĄDANIE (frazy → widget natychmiast, bez pytania)

"zanonimizuj" / "anonimizuj" / "anonimizacja" / "anonymize" / "usuń dane osobowe"
/ "ukryj dane" / "usuń nazwiska" / "usuń adresy" / "inicjały zamiast nazwisk"
/ "RODO" (w kontekście usunięcia) / "chcę zanonimizować"

---

## WIDGET CALL

```
1. visualize:read_me  modules=["interactive"]
2. view /mnt/skills/user/prawny-router-v3/anonimizer/assets/AnonimizerPrawny.jsx
3. visualize:show_widget
     title="anonimizer_prawny"
     widget_code → [zawartość z kroku 2]
     loading_messages=["Ładowanie anonimizera...", "Przygotowywanie reguł RODO..."]
4. "Otworzę narzędzie anonimizacji. Wgraj w nim plik ponownie lub wklej jego treść —
   widżet działa niezależnie od czatu i nie widzi plików z wiadomości.
   Po anonimizacji kliknij 'Wyślij do analizy ↗'."
```

---

## ODBIÓR PO ANONIMIZACJI

```
##ANON_START##      → pomiń 0A, decyzja_sesji='anon',
                      "✅ Otrzymałem zanonimizowany dokument. Analizuję..." → KROK 1
##PLIK_ORYGINALNY## → pomiń 0A, decyzja_sesji='raw' → KROK 1
```

---

## PAMIĘĆ SESYJNA

```
decyzja_sesji = null | 'anon' | 'raw'
'anon' → każdy kolejny plik: widget auto
'raw'  → każdy kolejny plik: bez pytania
null   → detekcja od nowa (KROK 0A)
Reset: "zmień anonimizację" / "reset sesji"

intent_docx = false | true
Ustaw true gdy: "napisz pozew" / "przygotuj pismo" / "wygeneruj sprzeciw" / "stwórz wniosek"
Zachowaj true przez całą sesję.
Efekt: po pisma-procesowe-v3 / pisma-proste-v2 → wywołaj docx-skill i present_files auto.

STABILIZACJA STANU: Przy każdym KROK 0A.1 — skanuj ostatnie 10 wiadomości (nie tylko poprzednią).
Jeśli brak ##ANON_START## / ##PLIK_ORYGINALNY## w oknie 10 wiadomości
i brak wyraźnej decyzji z poprzedniego kroku → traktuj decyzja_sesji=null → KROK 0A.2.
```

Szczegóły: `view /mnt/skills/user/prawny-router-v3/anonimizer/anonimizer-skill.md`
