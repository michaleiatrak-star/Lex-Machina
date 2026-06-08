# MODUŁ TRIAGE-UMOWY — SZYBKI SKAN GREEN / YELLOW / RED
## Analizator Umów v1 · Moduł Trybu Triage

> **Wczytaj gdy:** frazy: „szybko sprawdź", „triage", „czy mogę podpisać",
> „daj rzut oka", „NDA do podpisania", „jak złe to jest", „prosta umowa, ocenisz",
> „w 5 minut", „tylko przejrzyj" — LUB gdy kontekst decyzyjny wskazuje na
> krótki czas i niską wartość umowy (<10 000 PLN) bez złożoności.
>
> **NIE wczytuj** gdy: użytkownik prosi o pełną analizę, audyt ryzyk, negocjacje
> lub generowanie dokumentu — wtedy Faza 0 standardowa.

> ⛔ HARD GATE — nawet w trybie szybkim: każdy art. / § / Dz.U. przywołany
> w wynikach → web_search/web_fetch do isap.sejm.gov.pl w tej samej odpowiedzi.
> Zakaz cytowania przepisów z pamięci. Znacznik ✅ [VER] lub ⚠️ [NIEWERYFIKOWANE].

---

## TRIAGE.0 — POZYCJONOWANIE TRYBU

Triage jest **pierwszym filtrem**, nie analizą. Działa przed Fazą 0.

```
TRIAGE → wynik GREEN  → komunikat + opcja "czy chcesz pełną analizę?"
TRIAGE → wynik YELLOW → komunikat + automatyczne przejście do Fazy 0
TRIAGE → wynik RED    → komunikat + automatyczne przejście do Fazy 0
```

Triage **nie zastępuje** pełnej analizy dla YELLOW i RED. Komunikat
do użytkownika zawsze kończy triage dla tych kategorii słowami:
> „Przekazuję do pełnej analizy — zacznijmy od kilku pytań."

Dla GREEN — triage może być odpowiedzią finalną jeśli użytkownik
tak postanowi; zaproponuj jednak krótką weryfikację na żądanie.

---

## TRIAGE.1 — KROK 1: WERYFIKACJA KOMPLETNOŚCI (1–2 min)

Przed skanem ryzyk sprawdź elementy obowiązkowe:

```
□ Data zawarcia — podana?
□ Miejsce zawarcia — wskazane?
□ Strony — pełne dane (nazwa, forma prawna, NIP/KRS lub PESEL)?
□ Reprezentacja — kto podpisuje, na jakiej podstawie (KRS / pełnomocnictwo)?
□ Przedmiot — konkretnie opisany?
□ Wynagrodzenie — wskazane (kwota lub model)?
□ Czas — czas określony lub nieokreślony z okresem wypowiedzenia?
□ Załączniki — wymienione i dostarczone?
```

Brak któregokolwiek z powyższych = **automatycznie YELLOW**.
Kontynuuj skan ryzyk mimo braku — wskaż brak jako ryzyko.

---

## TRIAGE.2 — KROK 2: SKAN 10 OBSZARÓW RYZYKA (3–5 min)

Sprawdzaj obszary w tej kolejności. Pierwsza flaga RED → kategoria RED.
Brak RED, ale jakakolwiek flaga YELLOW → kategoria YELLOW.

### Obszar 1: Odpowiedzialność i kary

**Flagi RED:**
- Brak jakiegokolwiek limitu odpowiedzialności (cap) w umowie B2B
- Próba wyłączenia odpowiedzialności za winę umyślną
  → nieważne z mocy prawa — weryfikuj aktualne brzmienie przepisu przez ISAP
- Kary umowne rażąco wysokie (>100% wartości umowy za jedno naruszenie)
- Jednostronna nieograniczona indemnifikacja bez ograniczeń kwotowych

**Flagi YELLOW:**
- Cap niestandardowy (poniżej 3-miesięcznego wynagrodzenia lub powyżej 5×rocznego)
- Wyłączenie lucrum cessans — sprawdzić kontekst (w B2B akceptowalne, w B2C ryzykowne)
- Brak rozróżnienia wina umyślna / wina zwykła w klauzuli odpowiedzialności

### Obszar 2: Prawa autorskie / IP

**Flagi RED:**
- Przeniesienie praw autorskich bez wymienienia pól eksploatacji
  → brak skutku rozporządzającego — weryfikuj przez ISAP: Prawo autorskie
- Przeniesienie „wszelkich praw teraz i w przyszłości" bez konkretyzacji
- Brak klauzuli anty-copyleft w umowie IT z dostarczaniem oprogramowania
- Niejasny moment przejścia praw (brak wskazania: data zawarcia / zapłata / odbiór)

**Flagi YELLOW:**
- Pola eksploatacji wymienione, ale niekompletne dla planowanego użycia
- Brak gwarancji czystości IP od zbywcy
- Prawa zależne nieuregulowane przy umowie z twórczością

### Obszar 3: Poufność

**Flagi RED:**
- Całkowity brak klauzuli poufności przy umowie z wymianą informacji wrażliwych
- Brak okresu obowiązywania poufności po zakończeniu umowy

**Flagi YELLOW:**
- Brak wyłączeń standardowych (informacje publiczne, niezależnie opracowane, ujawnione na żądanie organu)
- Brak kary umownej za naruszenie (trudna egzekucja)
- Definicja informacji poufnych zbyt wąska lub zbyt szeroka

### Obszar 4: Wypowiedzenie i exit

**Flagi RED:**
- Całkowity brak klauzuli wypowiedzenia w umowie na czas nieokreślony
  → art. 746 KC działa, ale brak uregulowania okresu i skutków = ryzyko roszczeń
- Prawo wypowiedzenia tylko po jednej stronie bez uzasadnienia
- Brak procedury exit przy umowie długoterminowej z danymi lub materiałami klienta

**Flagi YELLOW:**
- Wypowiedzenie „ze skutkiem natychmiastowym" zbyt szeroko zdefiniowane
- Brak rozliczenia WIP (prac w toku) przy rozwiązaniu
- Automatyczne przedłużenie bez jasnego terminu wypowiedzenia

### Obszar 5: Kary umowne

**Flagi RED:**
- Kara za każde naruszenie bez górnego pułapu łącznego
- Kara za opóźnienie bez definicji co liczy się jako opóźnienie

**Flagi YELLOW:**
- Kary jednostronne (tylko dla jednej strony) — sprawdzić symetrię
- Brak klauzuli odszkodowania uzupełniającego (art. 484 §1 KC)
  → weryfikuj przez ISAP przed powołaniem
- Kary skumulowane za to samo zdarzenie w różnych paragrafach

### Obszar 6: RODO

**Flagi RED:**
- Umowa przewiduje przetwarzanie danych osobowych w imieniu drugiej strony
  bez umowy powierzenia (art. 28 RODO) — weryfikuj przez eur-lex.europa.eu
- Przekazywanie danych do państw trzecich bez wskazania mechanizmu

**Flagi YELLOW:**
- Brak listy subprocesorów przy powierzeniu
- Brak procedury powiadamiania o naruszeniach
- Niejasny czas trwania powierzenia

### Obszar 7: Cesja umowy

**Flagi RED:**
- Cesja umowy możliwa dla jednej strony bez zgody drugiej
  (szczególnie niekorzystne gdy klient jest cedowany bez wiedzy)

**Flagi YELLOW:**
- Brak wyraźnego zakazu cesji przy umowach opartych na osobistej współpracy
- Cesja dopuszczalna „w ramach grupy kapitałowej" bez definicji grupy

### Obszar 8: Forum i prawo właściwe

**Flagi RED:**
- Wyłączna jurysdykcja sądu zagranicznego bez uzasadnienia biznesowego
- Prawo właściwe inne niż polskie przy czysto krajowym stosunku B2B

**Flagi YELLOW:**
- Sąd właściwy wskazany jednostronnie (siedziba drugiej strony daleko)
- Brak klauzuli mediacji / arbitrażu jako etapu przed sądowego przy umowach wysokiej wartości

### Obszar 9: Jednostronne zmiany umowy

**Flagi RED:**
- Prawo jednostronnej zmiany istotnych warunków umowy (wynagrodzenie, zakres)
  bez zgody drugiej strony i bez prawa do wypowiedzenia

**Flagi YELLOW:**
- Klauzula zmiany „z ważnych powodów" bez listy zamkniętej powodów
- Prawo do zmiany cennika z krótkim (7–14 dni) lub bez okresu wyprzedzenia

### Obszar 10: Wynagrodzenie i płatności

**Flagi RED:**
- Brak terminu płatności lub termin uzależniony od warunku subiektywnego
  (np. „po akceptacji przez zamawiającego" bez procedury akceptacji)

**Flagi YELLOW:**
- Termin płatności powyżej 60 dni w transakcji B2B
  → weryfikuj przez ISAP: ustawa o przeciwdziałaniu nadmiernym opóźnieniom
- Brak mechanizmu waloryzacji przy umowie długoterminowej
- Podstawa rozliczenia niejasna (brak timesheet / protokół odbioru / raport)

---

## TRIAGE.3 — KROK 3: FORMAT WYNIKU

```
## TRIAGE UMOWY

**Kategoria: 🟢 GREEN / 🟡 YELLOW / 🔴 RED**

**Klauzule znaczące:**
- §[X] — [obszar] — [krótki opis flagi]
- §[Y] — [obszar] — [krótki opis flagi]

**Braki kompletności:**
- [lista braków z TRIAGE.1 jeśli wystąpiły]

**Rekomendacja:**
[GREEN]  Można podpisać. Brak krytycznych flag.
         [opcjonalna uwaga jeśli cokolwiek YELLOW]
         → Czy chcesz pełną analizę?

[YELLOW] Wymaga analizy przed podpisaniem.
         Punkty do omówienia: [lista obszarów].
         → Przekazuję do pełnej analizy — zacznijmy od kilku pytań.

[RED]    Nie podpisywać bez negocjacji.
         Punkty blokujące: [lista flag RED z lokalizacją §].
         → Przekazuję do pełnej analizy — zacznijmy od kilku pytań.
```

---

## TRIAGE.4 — PRZEJŚCIE DO PEŁNEJ ANALIZY

Po triage YELLOW lub RED — uruchom automatycznie Fazę 0 analizatora:

```
TRYB: ANALIZA
DOKUMENT: [typ rozpoznany w triage]
CEL: zidentyfikowanie i naprawa flag [YELLOW/RED] z triage
KONTEKST DECYZYJNY: wstępnie znany z triage — uzupełnij brakujące pola
```

Wyniki triage są wejściem do Fazy 0 — nie powtarzaj skanu ryzyk,
przejdź bezpośrednio do modułów odpowiednich dla zidentyfikowanych flag.

---

## TRIAGE.5 — KIEDY NIE UŻYWAĆ TRIAGE

Przejdź bezpośrednio do Fazy 0 standardowej gdy:
- Wartość umowy >250 000 PLN
- Umowa zawiera elementy M&A / przejęcia / inwestycji kapitałowej
- Użytkownik wskazuje „to jest dla nas ważne, sprawdź dokładnie"
- Umowa dotyczy nieruchomości (wymagany akt notarialny)
- Umowa o pracę z elementami ryzyka reklasyfikacji
- Umowa zawiera klauzule z rejestrem UOKiK (B2C, OWU)

---

*Moduł: mod-triage-umowy.md · v1.0 · Analizator Umów v1.6*
*Powiązania: Faza 0 SKILL.md → mod-triage-umowy.md → powrót do Fazy 0 (YELLOW/RED)*
*Źródła weryfikacji: isap.sejm.gov.pl · eur-lex.europa.eu · rejestr.uokik.gov.pl*
