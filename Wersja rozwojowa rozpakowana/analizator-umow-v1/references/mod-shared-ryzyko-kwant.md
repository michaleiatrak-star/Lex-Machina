# MODUŁ SHARED-RYZYKO — KWANTYFIKACJA EKSPOZYCJI FINANSOWEJ
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** analiza klauzul zakończona (Moduł B/C), użytkownik pyta
> o ryzyko finansowe, potrzebny raport dla zarządu, decyzja o podpisaniu
> wymaga oceny wartości ryzyka. Stosuj zawsze przy umowach >100 000 PLN.

> ⛔ HARD GATE — kary umowne, stopy odsetek, limity z KC zawsze weryfikuj
> w ISAP przed podaniem kwot. Weryfikacja: isap.sejm.gov.pl → KC → art. 484.

---

## RK.1 METODOLOGIA KWANTYFIKACJI

```
DLA KAŻDEJ KLAUZULI RYZYKA oblicz TRZY SCENARIUSZE:

SCENARIUSZ 1 — WORST CASE (najgorszy możliwy):
  → Maksymalna liczba dni/naruszeń × maksymalna stawka
  → Nieograniczona odpowiedzialność → szacuj jako X × wartość umowy
  → Przykład: "Kara 0,5% dziennie × 365 dni = 182,5% wartości kontraktu"

SCENARIUSZ 2 — LIKELY CASE (typowe opóźnienie/naruszenie w branży):
  → Realne opóźnienie: 30–60 dni (budownictwo), 7–14 dni (IT), 1–5 dni (dostawy)
  → Typowe naruszenie: jednorazowe, nieistotne

SCENARIUSZ 3 — EXPECTED VALUE (wartość oczekiwana):
  → (Worst Case × prawdopodobieństwo) + (Likely × prawdopodobieństwo)
  → Uproszczenie: Likely × 2 (konserwatywna heurystyka)

FORMAT OBLICZENIA:
  Wartość umowy: [kwota] PLN
  Kara: [stawka]% dziennie / jednorazowa
  Worst case:  [liczba dni] × [stawka] × [wartość] = [kwota] PLN = [X%] wartości
  Likely case: [liczba dni] × [stawka] × [wartość] = [kwota] PLN = [X%] wartości
```

---

## RK.2 TABELA EKSPOZYCJI FINANSOWEJ

Sporządź dla całej umowy:

```
┌─────────────────────────────────────────────────────────────────┐
│ TABELA EKSPOZYCJI FINANSOWEJ                                    │
│ Dokument: [nazwa] | Wartość umowy: [X] PLN                     │
├──────────────┬──────────┬──────────┬──────────┬────────────────┤
│ Klauzula §   │ Ryzyko   │ Worst    │ Likely   │ Podstawa       │
│              │ (M/S/N)  │ Case PLN │ Case PLN │ prawna         │
├──────────────┼──────────┼──────────┼──────────┼────────────────┤
│ §X kara dz.  │ M        │ [kwota]  │ [kwota]  │ art. 484 KC    │
│ §Y odp.nier. │ S        │ [kwota]  │ [kwota]  │ art. 471 KC    │
│ §Z poufność  │ N        │ [kwota]  │ [kwota]  │ art. 483 KC    │
├──────────────┼──────────┼──────────┼──────────┼────────────────┤
│ SUMA ŁĄCZNA  │          │ [kwota]  │ [kwota]  │                │
│ % wartości   │          │ [X%]     │ [Y%]     │                │
└──────────────┴──────────┴──────────┴──────────┴────────────────┘

WNIOSKI:
  → Łączna ekspozycja Worst Case: [kwota] PLN ([X%] wartości umowy)
  → Łączna ekspozycja Likely Case: [kwota] PLN ([Y%] wartości umowy)
  → Klauzula o najwyższym ryzyku: §[X] (łącznie do [kwota] PLN)
  → Rekomendacja priorytetowa: zmiana §[X] + §[Y] eliminuje [Z%] ryzyka
```

---

## RK.3 KALKULATOR TYPOWYCH KAR UMOWNYCH

```
KARY DZIENNE (weryfikuj zawsze w aktualnej umowie):
  Formuła: Wartość umowy × stawka% × liczba dni = ekspozycja

  BENCHMARKI RYNKOWE (dla orientacji — nie zastępują analizy konkretnej umowy):
  Opóźnienie dostawy B2B:           0,1–0,3% dziennie
  Opóźnienie w IT/software:         0,05–0,2% dziennie
  Opóźnienie budowlane:             0,05–0,1% dziennie (+ miarkowanie SN)
  Naruszenie poufności:             jednorazowe 10–50 000 PLN lub % przychodu
  Naruszenie zakazu konkurencji:    3–12 × miesięczne wynagrodzenie/fee

  LIMITY KARY UMOWNEJ (weryfikuj: isap.sejm.gov.pl → KC → art. 484):
  KC nie ustala maksimum → strony mogą ustalić dowolną stawkę
  MIARKOWANIE (art. 484 §2 KC): sąd może obniżyć gdy:
    (a) zobowiązanie wykonane w znacznej części LUB
    (b) kara rażąco wygórowana
  → Kara >30% wartości umowy → wysokie ryzyko miarkowania przez sąd
  → PRAKTYKA SN: kary dzienne kumulowane bez limitu → miarkowanie niemal pewne
```

---

## RK.4 NIEOGRANICZONA ODPOWIEDZIALNOŚĆ — SZACOWANIE

```
PROBLEM: Umowa nie zawiera limitu odpowiedzialności (cap liability).
→ Odpowiedzialność = rzeczywista szkoda + utracone korzyści (art. 361 §2 KC)
  Weryfikuj: isap.sejm.gov.pl → KC → art. 361

SZACOWANIE WORST CASE dla nieograniczonej odpowiedzialności:

METODOLOGIA:
  Krok 1: Jaka jest maksymalna szkoda jaką klient może wyrządzić?
    → Wartość projektu dla końcowego odbiorcy (jeśli wykonawca opóźni projekt)
    → Strata przychodów klienta za czas przestoju
    → Koszty zastępczego wykonawcy (marża rynkowa: 20–40% wyżej)
  
  Krok 2: Jaka jest maksymalna szkoda klienta z umowy?
    → Wartość umowy × (1 + marża zysku = oczekiwany zysk utracony)
  
  Proxy gdy brak danych:
    → Minimalna: wartość umowy brutto
    → Prawdopodobna: 2–3 × wartość umowy
    → Maksymalna: 5–10 × wartość umowy (dla projektów krytycznych)

REKOMENDACJA LIMITU (cap liability):
  Standard rynkowy B2B: cap = wartość umowy lub 12 × miesięczne wynagrodzenie
  Minimalny akceptowalny: cap = 150% wartości umowy
  
  BRZMIENIE:
  "§X. Łączna odpowiedzialność [Strony A] z tytułu niewykonania lub 
   nienależytego wykonania Umowy, niezależnie od podstawy prawnej,
   jest ograniczona do [kwoty/wartości umowy/12-krotności wynagrodzenia
   miesięcznego], z wyłączeniem szkód wyrządzonych umyślnie."
  
  Weryfikuj dopuszczalność ograniczenia: KC art. 473 §2 — wyłączenie
  odpowiedzialności za szkodę umyślną jest zawsze bezskuteczne.
```

---

## RK.5 ANALIZA KLAUZULI ODSETEK

```
ODSETKI USTAWOWE (weryfikuj ZAWSZE aktualne stawki w NBP/ISAP):
  Podstawa: KC art. 359 — weryfikuj: isap.sejm.gov.pl
  Stawka ustawowa = stopa referencyjna NBP + 3,5 pp
  Stawka ustawowa za opóźnienie = stopa referencyjna NBP + 5,5 pp
  Stawka maksymalna = dwukrotność odsetek ustawowych za opóźnienie
  
  ⚠ STAWKA NBP ZMIENIA SIĘ — zawsze sprawdzaj aktualne dane:
  web_search "stopa referencyjna NBP [bieżący miesiąc rok]"
  
  Odsetki w transakcjach handlowych (B2B):
  Ustawa o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych
  Weryfikuj: isap.sejm.gov.pl → t.j. Dz.U. 2023 poz. 1790

KALKULATOR ODSETEK:
  Kwota zaległa: [X] PLN
  Okres opóźnienia: [N] dni
  Stawka: [%] rocznie
  Odsetki = [X] × ([%]/365) × [N] = [kwota] PLN

FORMAT ALERTU:
  "Termin płatności: [X] dni. Przy opóźnieniu [30/60/90] dni od kwoty
   [X] PLN, przy aktualnej stawce ustawowej za opóźnienie [%] p.a.:
   Odsetki ≈ [kwota] PLN. Zalecamy zmianę na [Y] dni."
```

---

## RK.6 RAPORT RYZYKA FINANSOWEGO (EXECUTIVE SUMMARY)

Format dla zarządu lub klienta nierozumiejącego terminologii prawniczej:

```
PODSUMOWANIE RYZYKA FINANSOWEGO
Umowa: [typ i strony]
Wartość umowy: [X] PLN

📊 EKSPOZYCJA ŁĄCZNA:
  Scenariusz typowy: [kwota] PLN ([Y%] wartości umowy)
  Scenariusz najgorszy: [kwota] PLN ([Z%] wartości umowy)

🔴 NAJPOWAŻNIEJSZE RYZYKA:
  1. §[X] — [opis] → potencjalna strata do [kwota] PLN
     Co zmienić: [jedna zdanie]
  2. §[Y] — [opis] → potencjalna strata do [kwota] PLN
     Co zmienić: [jedna zdanie]

🟡 RYZYKA ŚREDNIE:
  [lista z kwotami]

✅ CO DZIAŁA NA NASZĄ KORZYŚĆ:
  [lista korzystnych klauzul z szacunkiem wartości ochrony]

💡 REKOMENDACJA:
  [Podpisać / Podpisać z zastrzeżeniami / Nie podpisywać]
  Priorytet zmian: zmiana §[X] eliminuje [W%] całkowitego ryzyka finansowego.
```

---

*← Powrót do routingu: `view references/mod-J0-routing.md`*
*Powiązane: Moduł D.2 (scoring balansu), Moduł F (raport końcowy)*
*Weryfikacja przepisów: isap.sejm.gov.pl → KC art. 361, 471, 484*
*Stawki NBP: web_search "stopa referencyjna NBP [rok]"*
