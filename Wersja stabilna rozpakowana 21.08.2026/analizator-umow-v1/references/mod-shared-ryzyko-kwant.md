# MODUŁ SHARED-RYZYKO — KWANTYFIKACJA EKSPOZYCJI FINANSOWEJ
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** analiza klauzul zakończona (Moduł B/C), użytkownik pyta
> o ryzyko finansowe, potrzebny raport dla zarządu, decyzja o podpisaniu
> wymaga oceny wartości ryzyka. Stosuj zawsze przy umowach >100 000 PLN.

> ⛔ HARD GATE — kary umowne, stopy odsetek, limity z KC zawsze weryfikuj
> w ISAP przed podaniem kwot. Weryfikacja: isap.sejm.gov.pl → KC → art. 484.

> **v1.18 — źródła metodologiczne (zastępuje wcześniejszą heurystykę
> „Likely × 2" bez podstawy):**
> - **Three-point estimating / PERT** (Program Evaluation and Review
>   Technique) — standard szacowania ryzyka w warunkach niepewności, gdy nie
>   dysponujesz jawnymi prawdopodobieństwami dla każdego scenariusza.
>   Formuła: `E = (O + 4M + P) / 6`, gdzie O = optimistic (najlepszy
>   przypadek), M = most likely, P = pessimistic (worst case). Waga 4 dla
>   „most likely" odzwierciedla rozkład beta, standardowy w estymacji
>   trzypunktowej projektowej i ryzyka.
> - **Litigation/Contract Risk Analysis (decision tree, probability-
>   weighted expected value)** — Marc B. Victor (twórca Litigation Risk
>   Analysis, lata 70.); Marjorie Corman Aaron, *Risk & Rigor: A Lawyer's
>   Guide to Decision Trees for Assessing Cases and Advising Clients* (ABA,
>   2019); Aaron, M.C. & Hoffer, D.P., „Using Decision Trees As Tools for
>   Settlement", *Alternatives to the High Cost of Litigation* 14. Metoda:
>   gdy DYSPONUJESZ jawnymi prawdopodobieństwami zdarzeń (np. szacowane %
>   prawdopodobieństwa naruszenia, wygranej w sporze) — licz wartość
>   oczekiwaną jako sumę (wynik × prawdopodobieństwo) dla każdej gałęzi
>   drzewa decyzyjnego, nie uproszczony PERT. PERT stosuj jako **fallback**,
>   gdy jawnych prawdopodobieństw nie da się sensownie oszacować.

---

## RK.1 METODOLOGIA KWANTYFIKACJI

```
DLA KAŻDEJ KLAUZULI RYZYKA — wybierz metodę wg dostępności danych:

ŚCIEŻKA A — ZNANE/SZACOWALNE PRAWDOPODOBIEŃSTWA (preferowana, decision tree):
  Gdy można sensownie oszacować % prawdopodobieństwa wystąpienia zdarzenia
  (np. z historii kontrahenta, branży, częstości sporów tego typu):

  Wartość oczekiwana = Σ (wynik_i × prawdopodobieństwo_i) dla wszystkich i

  Przykład:
    Zdarzenie: opóźnienie >30 dni. Szacowane prawdopodobieństwo: 20%.
    Konsekwencja: kara 0,5%/dzień × 60 dni = 30% wartości umowy.
    Wartość oczekiwana tej gałęzi = 30% × 20% = 6% wartości umowy.
  Zawsze pokaż założone prawdopodobieństwo jawnie — jeśli jest szacunkiem
  eksperckim (Twoim), oznacz to wprost („szacunek: 20%, do weryfikacji z
  klientem/historią kontrahenta"), nie podawaj jako pewnik.

ŚCIEŻKA B — BRAK DANYCH DO OSZACOWANIA PRAWDOPODOBIEŃSTWA (fallback, PERT):
  Trzy scenariusze, wagowana średnia wg formuły PERT:

  SCENARIUSZ O — OPTYMISTYCZNY (najlepszy możliwy):
    → Brak naruszenia lub naruszenie minimalne

  SCENARIUSZ M — MOST LIKELY (typowe opóźnienie/naruszenie w branży):
    → Realne opóźnienie: 30–60 dni (budownictwo), 7–14 dni (IT), 1–5 dni (dostawy)
    → Typowe naruszenie: jednorazowe, nieistotne

  SCENARIUSZ P — PESSIMISTIC / WORST CASE (najgorszy możliwy):
    → Maksymalna liczba dni/naruszeń × maksymalna stawka
    → Nieograniczona odpowiedzialność → szacuj jako X × wartość umowy

  WARTOŚĆ OCZEKIWANA (PERT): E = (O + 4×M + P) / 6

FORMAT OBLICZENIA:
  Wartość umowy: [kwota] PLN
  Kara: [stawka]% dziennie / jednorazowa
  [Ścieżka A] Zdarzenie: [opis] | P(zdarzenia): [X%] | Wynik: [kwota] PLN
              | Wartość oczekiwana: [kwota × %] = [kwota] PLN
  [Ścieżka B] O: [kwota] | M: [kwota] | P: [kwota]
              | E = (O + 4M + P)/6 = [kwota] PLN

Wybór ścieżki uzasadnij jednym zdaniem w raporcie — nie mieszaj obu metod
dla tej samej klauzuli w jednym raporcie (spójność metodologiczna).
```

---

## RK.2 TABELA EKSPOZYCJI FINANSOWEJ

Sporządź dla całej umowy:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TABELA EKSPOZYCJI FINANSOWEJ                                            │
│ Dokument: [nazwa] | Wartość umowy: [X] PLN                              │
├──────────────┬──────────┬──────────┬──────────┬──────────┬─────────────┤
│ Klauzula §   │ Ryzyko   │ Worst    │ Wartość  │ Metoda   │ Podstawa    │
│              │ (M/S/N)  │ Case PLN │ oczek.(E)│ (A/B)*   │ prawna      │
├──────────────┼──────────┼──────────┼──────────┼──────────┼─────────────┤
│ §X kara dz.  │ M        │ [kwota]  │ [kwota]  │ [A/B]    │ art. 484 KC │
│ §Y odp.nier. │ S        │ [kwota]  │ [kwota]  │ [A/B]    │ art. 471 KC │
│ §Z poufność  │ N        │ [kwota]  │ [kwota]  │ [A/B]    │ art. 483 KC │
├──────────────┼──────────┼──────────┼──────────┼──────────┼─────────────┤
│ SUMA ŁĄCZNA  │          │ [kwota]  │ [kwota]  │          │             │
│ % wartości   │          │ [X%]     │ [Y%]     │          │             │
└──────────────┴──────────┴──────────┴──────────┴──────────┴─────────────┘
* Metoda A = decision tree z jawnym prawdopodobieństwem; B = PERT (fallback) — patrz RK.1

WNIOSKI:
  → Łączna ekspozycja Worst Case: [kwota] PLN ([X%] wartości umowy)
  → Łączna wartość oczekiwana (E): [kwota] PLN ([Y%] wartości umowy)
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
  
  Proxy gdy brak danych (Ścieżka B / PERT — patrz RK.1):
    → O (optymistyczny): wartość umowy brutto
    → M (most likely): 2–3 × wartość umowy
    → P (pesymistyczny): 5–10 × wartość umowy (dla projektów krytycznych)
    → E = (O + 4M + P) / 6

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
