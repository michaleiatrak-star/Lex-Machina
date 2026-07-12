# MODUŁ CORE-CHECKLIST — ANALIZA, REDAKCJA, RAPORT
## Analizator Umów v1 · Moduł Rdzenny (lazy-loaded)

> **Wczytaj gdy:** tryb 2/3/4 (redakcja/draft/uzupełnienie) LUB gdy analiza wymaga
> pełnego raportu F.1 LUB gdy użytkownik pyta o format raportu, zasady redakcji,
> checkliste gotowości dokumentu, metodologię balansu, procedurę weryfikacji.
> NIE ładuj przy prostych pytaniach B2C / prostych zapytaniach o jedną klauzulę.

> ⛔ HARD GATE — każdy artykuł, termin, kwota w modułach A–F:
> isap.sejm.gov.pl → tekst jednolity właściwej ustawy
> Zakaz cytowania przepisów z pamięci. Znacznik ✅ [VER: źródło] obowiązkowy.

---

## MODUŁ A — IDENTYFIKACJA DOKUMENTU

### A.1 Rozpoznanie typu i kwalifikacja prawna

```
TYP DOKUMENTU:
  □ Umowa nazwana:
    - sprzedaży (art. 535 KC)         - najmu (art. 659 KC)
    - dzierżawy (art. 693 KC)          - zlecenia (art. 734 KC)
    - o dzieło (art. 627 KC)           - o pracę (art. 22 KP)
    - agencyjna (art. 758 KC)          - pożyczki (art. 720 KC)
    - leasingu (art. 709¹ KC)          - ubezpieczenia (art. 805 KC)
    - franchisingu (nienazwana)        - B2B / menedżerska (mieszana)
  □ Umowa nienazwana — opisz hybrydę
  □ OWU / Regulamin — wskaż zakres
  □ Aneks / Zmiana — do jakiej umowy
  □ Ugoda (art. 917 KC)
  □ Pełnomocnictwo
```

### A.2 Forma prawna

| Typ dokumentu | Forma wymagana | Skutek braku |
|---|---|---|
| Sprzedaż nieruchomości | Akt notarialny (art. 158 KC) | Nieważność bezwzględna |
| Najem >1 rok | Pisemna (art. 660 KC) | Umowa na czas nieokreślony |
| Przeniesienie praw autorskich | Pisemna (art. 53 PrAut) | Nieważność |
| Zakaz konkurencji UoP | Pisemna rygor nieważności (art. 101¹ §2 KP) | Nieważność |
| Pożyczka >1000 zł | Dokumentowa (art. 720 §2 KC) | Trudność dowodowa |
| Umowa o pracę | Pisemna lub potwierdzona (art. 29 KP) | Obowiązek potwierdzenia |
| DPA (RODO) | Pisemna lub elektroniczna (art. 28 ust. 9 RODO) | Naruszenie RODO |

---

## MODUŁ B — ANALIZA KLAUZUL

### B.0 SYNTEZA KRZYŻOWA — OBOWIĄZKOWA PRZED WNIOSKAMI KOŃCOWYMI

> ⛔ ZASADA: analiza klauzula-po-klauzuli (B.1) jest warunkiem KONIECZNYM,
> ale NIGDY wystarczającym. Żaden wniosek kwalifikacyjny (np. „to jest B2B",
> „to nie jest stosunek pracy", „umowa jest zgodna z prawem") nie może
> opierać się wyłącznie na odczycie jednej klauzuli z osobna — musi wynikać
> z zestawienia WSZYSTKICH klauzul, które razem opisują tę samą relację
> faktyczną. Pojedyncza klauzula analizowana w izolacji systematycznie
> zaniża ryzyko, ponieważ ukrywa efekt łącznego działania kilku postanowień.

```
PROCEDURA (wykonaj PO B.1, PRZED sformułowaniem wniosku/raportu):

KROK A: Zbuduj TABELĘ CECH dla każdego testu kwalifikacyjnego, który
        dotyczy dokumentu (np. test stosunku pracy G.1, test konsumenta
        J8, test rzeczywistego pracodawcy MOD-PRACODAWCA-RZECZYWISTY).
        W wierszach: cechy testu. W kolumnach: numer §/klauzuli, w której
        cecha występuje (może być kilka klauzul na jedną cechę i odwrotnie).

KROK B: Sumuj cechy z CAŁEGO dokumentu, nie tylko z klauzuli "wprost"
        dotyczącej danego zagadnienia. Np. cecha "podporządkowanie"
        (test z G.1) może wynikać jednocześnie z: §dot. godzin pracy,
        §dot. raportowania, §dot. sprzętu, §dot. lokalizacji — każda
        z osobna może wyglądać neutralnie, razem dają wynik testu.

KROK C: Sprawdź KLAUZULE DEKLARATORYJNE (oświadczenia stron o charakterze
        prawnym umowy, np. "strony zgodnie oświadczają, że niniejsza
        umowa nie jest umową o pracę") WYŁĄCZNIE jako dodatkowy wiersz
        w tabeli — NIGDY jako rozstrzygnięcie testu. Takie oświadczenie:
          → nie ma mocy wiążącej wobec sądu/ZUS/PIP — o kwalifikacji
            decyduje treść faktycznie wykonywanych obowiązków i pozostałe
            postanowienia (art. 22 §1¹ KP: o rodzaju stosunku prawnego
            decyduje jego rzeczywista treść, nie nazwa nadana przez strony)
          → jeśli pozostałe klauzule dokumentu spełniają ≥3 cechy testu
            z G.1 — oświadczenie NIE obniża wyniku testu i musi być
            oznaczone jako SPRZECZNE Z TREŚCIĄ DOKUMENTU (CRIT), a nie
            jako środek zaradczy
KROK D: Dopiero po A–C sformułuj wniosek końcowy i wpisz go do raportu
        (Moduł F.1) — z odesłaniem do konkretnych numerów §, nie ogólnikowo.
```

**Zakaz wzorca "izolowanej klauzuli":** raport nie może zawierać zdania
typu „§X jest w porządku" bez wskazania, czy §X w połączeniu z innymi
postanowieniami zmienia ocenę całości. Jeśli synteza B.0 zmienia wynik
uzyskany dla pojedynczej klauzuli w B.1, raport musi to wprost odnotować
(„§X samodzielnie neutralny, ale w połączeniu z §Y i §Z wskazuje na...").

### B.1 Sekwencja obowiązkowa dla każdej klauzuli

```
KROK 1: Wypisz klauzulę dosłownie (cytat z dokumentu)
KROK 2: Zakwalifikuj:
         □ Neutralna / Korzystna [A/B] / Niekorzystna [A/B]
         □ Klauzula niedozwolona → rejestr.uokik.gov.pl
         □ Sprzeczna z bezwzględnie wiążącym przepisem → nieważna
         □ Obchodzi prawo (art. 58 §1 KC)
KROK 3: Wskaż podstawę prawną (weryfikowaną w ISAP)
KROK 4: Oceń ryzyko: Krytyczne / Wysokie / Średnie / Niskie
KROK 5: Zaproponuj zmianę (gotowe brzmienie alternatywne)
KROK 6: Oznacz kategorię negocjacyjną: M / S / N / T (→ Moduł NEG)
```

### B.2 Katalog klauzul wymagających sprawdzenia RODO

```
⚠ NOWE w v1 — Sprawdź przy KAŻDEJ umowie usługowej B2B:
  □ Czy kontrahent przetwarza dane osobowe Twoich klientów/pracowników?
    TAK → wymagana umowa DPA (art. 28 RODO) → wczytaj mod-shared-rodo.md
  □ Czy umowa zawiera klauzule o przetwarzaniu danych?
    → Sprawdź kompletność wg RO.3 (lista kontrolna 13 elementów)
  □ Czy umowa IT/SaaS ma klauzulę o podprocesorach?
    → Wczytaj mod-J6 + mod-shared-rodo.md
```

### B.3 Katalog typowych klauzul ryzykownych

**Klauzule jednostronnie zmieniające umowę:**
- Zmiana cennika bez wypowiedzenia → art. 385³ pkt 10 KC (B2C niedozwolona)
- Zmiana OWU bez zgody kontrahenta → art. 384¹ KC (wymaga akceptacji)
- Prawo do rozszerzenia zakresu usług bez zmiany wynagrodzenia

**Klauzule wyłączające odpowiedzialność:**
- Wyłączenie za szkodę umyślną → art. 473 §2 KC (bezskuteczne zawsze)
- Wyłączenie za szkodę umyślną w umowie B2C → art. 385³ pkt 2 KC (klauzula niedozwolona)
- Wyłączenie rękojmi B2C → art. 558 §2 KC (bezskuteczne)
- Wyłączenie odpowiedzialności za opóźnienie bez definicji siły wyższej
- Limit odpowiedzialności niższy niż wynagrodzenie → sprawdź proporcjonalność

**Klauzule kar umownych:**
- Kara jednostronna, rażąco wygórowana, bez limitu → Moduł RYZYKO + art. 484 §2 KC

**Brak klauzul wymaganych:**
- Brak klauzuli salwatoryjnej → ryzyko nieważności całości przy nieważnej części
- Brak formy zmian → ryzyko ustnych modyfikacji trudnych do udowodnienia
- Brak prawa właściwego w umowie międzynarodowej → Rozporządzenie Rzym I

**Klauzule terminowe:**
- „Niezwłocznie" bez definicji → zawsze doprecyzuj (np. 3 dni robocze)
- Termin liczony „od daty faktury" vs „od doręczenia" → ujednolić

---

## MODUŁ C — OCENA ZGODNOŚCI Z PRAWEM

### C.1 Procedura weryfikacji online — obowiązkowa

```
KROK 1: Zidentyfikuj podstawę prawną klauzuli (lub jej brak)
KROK 2: web_search → isap.sejm.gov.pl → pełny tekst artykułu
KROK 3: Porównaj klauzulę z normą:
  □ Norma dyspozytywna → strony mogą zmienić → ocena celowości
  □ Norma bezwzględna → naruszenie = nieważność lub bezskuteczność
  □ Norma semiimperatywna → można zmieniać tylko na korzyść chronionej strony
KROK 4: Przy klauzulach B2C → rejestr.uokik.gov.pl → szukaj analogii
KROK 5: Oznacz: ✅ [VER: isap.sejm.gov.pl, data] lub ⚠️ [NIEWERYFIKOWANE]
```

### C.2 Hierarchia naruszeń

```
POZIOM 1 — Nieważność bezwzględna (art. 58 §1 KC):
  Sprzeczność z ustawą / zasadami współżycia społecznego
  → Skutek: cała klauzula nieważna z mocy prawa; sąd stosuje przepis

POZIOM 2 — Bezskuteczność zawieszona / relative:
  Klauzule abuzywne B2C (art. 385¹ KC)
  → Skutek: nie wiąże konsumenta; reszta umowy w mocy

POZIOM 3 — Bezskuteczność jednostronna:
  Wyłączenie rękojmi B2C (art. 558 §2 KC), zakaz potrącania długów B2C
  → Skutek: przedsiębiorca nie może się na nie powołać

POZIOM 4 — Niezgodność wymagająca zmiany:
  Naruszenie norm dyspozytywnych, nierówność, ryzyko sporu
  → Skutek: klauzula ważna, ale niekorzystna; rekomendacja zmiany
```

### C.3 Obejście prawa — identyfikacja

```
Sygnały klauzuli obchodzącej prawo (art. 58 §1 KC in fine):
  □ Forma zgodna z literą, ale skutek tożsamy z zakazanym
  □ Rozdzielenie transakcji na etapy by ominąć próg formalny
  □ Zmiana nazwy umowy bez zmiany treści (B2B zamiast UoP)
  □ Zastrzeżenie zwrotu świadczenia w razie wykonania jako "kara"
  □ Prawo do "anulowania" umowy zamiast wypowiedzenia — brak okresu
```

---

## MODUŁ D — OCENA BALANSU DOKUMENTU

### D.1 Metodologia pomiaru balansu

```
SCORING: oceń każdy z wymiarów dla STRONY A i STRONY B (0–10)

WYMIARY (8):
  [1] Odpowiedzialność finansowa — kto ponosi ryzyko strat
  [2] Prawo do zmiany warunków — kto może zmienić jednostronnie
  [3] Prawo do rozwiązania umowy — kto ma łatwiejsze wyjście
  [4] Kary i sankcje — kto jest bardziej narażony
  [5] Prawo do informacji — kto ma dostęp do danych drugiej strony
  [6] Prawa IP — kto zachowuje/uzyskuje własność intelektualną
  [7] Terminy płatności — kto kredytuje drugą stronę
  [8] Procedura reklamacyjna / spory — kto ma trudniejszą ścieżkę
```

### D.2 Scoring balansu (0–10)

```
DLA KAŻDEGO WYMIARU:
  10/10 — absolutna przewaga strony A nad B
   7/10 — wyraźna, ale uzasadniona przewaga A
   5/10 — neutralne, symetryczne
   3/10 — wyraźna, ale uzasadniona przewaga B
   0/10 — absolutna przewaga strony B nad A

OCENA KOŃCOWA:
  Średnia ważona 8 wymiarów dla każdej strony
  Dysproporcja >2 pkt → ALERT: dokument mocno jednostronny
  Dysproporcja >3 pkt → ALERT KRYTYCZNY: dokument nie do podpisania bez zmian
```

### D.3 Rekomendacje zmian dla balansu

```
Dla każdego wymiaru z dysproporcją >2 pkt:
  IDENTYFIKUJ: którą klauzulę zmienić
  PROPONUJ: gotowe brzmienie wyrównujące
  KATEGORYZUJ: M (must) / S (should) / N (nice) / T (trade-off do negocjacji)

DEFINICJE KATEGORII NEGOCJACYJNYCH (jakościowe — warstwa nadrzędna):
  M — Must: brak tej zmiany = nie podpisuj (ryzyko krytyczne lub naruszenie prawa)
  S — Should: zmiana bardzo zalecana (ryzyko wysokie, możliwy spór)
  N — Nice: zmiana korzystna, ale nie blokuje podpisania
  T — Trade-off: zaproponuj stronie jako wymianę za coś innego

PROGI ORIENTACYJNE (kwantyfikacja — eliminują subiektywność granicy M/S):
  > Progi służą do ZNALEZIENIA kategorii, gdy ocena jakościowa jest niejednoznaczna.
  > Reguła kierunku: próg może tylko PODNIEŚĆ kategorię, nigdy nie obniża poniżej
  > podłogi prawnej (nielegalność = zawsze M, niezależnie od kwoty).

  ┌─ AUTOMATYCZNE M (dealbreaker — niezależnie od kwoty) ─────────────────────┐
  │ • Klauzula nieważna/bezskuteczna z mocy prawa (Moduł C.2 poziom 1–3)       │
  │ • Naruszenie normy bezwzględnie wiążącej / klauzula abuzywna B2C           │
  │ • Brak formy pod rygorem nieważności (np. art. 53 PrAut, akt notarialny)   │
  │ • Odpowiedzialność NIEOGRANICZONA bez wyłączenia za szkody pośrednie       │
  │ • Wyłączenie odpowiedzialności za winę umyślną (art. 473 §2 KC)            │
  │ • Dysproporcja balansu (Moduł D.2) > 3 pkt — klauzule ją tworzące          │
  └────────────────────────────────────────────────────────────────────────┘

  PROGI ILOŚCIOWE (kara umowna / ekspozycja jednej klauzuli):
  ┌──────────────────────────────────┬──────────────────────────────┬──────┐
  │ Kara / ekspozycja z klauzuli      │ % wartości umowy (rocznej)    │ Kat. │
  ├──────────────────────────────────┼──────────────────────────────┼──────┤
  │ > 3× mies. wynagrodzenia LUB      │ > 30% wartości umowy          │  M   │
  │   brak cap przy realnym ryzyku    │   lub brak górnego limitu     │      │
  │ 1–3× mies. wynagrodzenia          │ 10–30% wartości umowy         │  S   │
  │ < 1× mies. wynagrodzenia          │ < 10% wartości umowy          │  N   │
  └──────────────────────────────────┴──────────────────────────────┴──────┘

  PROGI dla LIMITU ODPOWIEDZIALNOŚCI (cap):
    • brak cap przy ekspozycji nieograniczonej ......................... M
    • cap < 50% wartości umowy przy ryzyku istotnym dla strony ......... S
    • cap 50–100% wartości umowy ....................................... S/N (ocena)
    • cap ≥ 100% wartości lub adekwatny do ryzyka ...................... N

  PROGI dla DYSPROPORCJI BALANSU (Moduł D.2) i SYMETRII:
    • dysproporcja > 3 pkt → klauzule źródłowe = M
    • dysproporcja 2–3 pkt → klauzule źródłowe = S
    • dysproporcja < 2 pkt → N
    • prawo jednostronne (wypowiedzenie/zmiana) bez odpowiednika u drugiej
      strony i bez okresu/uzasadnienia ................................. M
    • prawo jednostronne z okresem wypowiedzenia / rekompensatą ........ S

  PROGI dla BRAKU KLAUZULI WYMAGANEJ:
    • brak klauzuli, której pominięcie rodzi nieważność/bezskuteczność .. M
    • brak FM przy umowie > 12 mies. / brak DPA gdy przetwarzane dane ... S
    • brak waloryzacji przy umowie > 24 mies. / brak klauzuli porządkowej N

  KLASYFIKACJA T (trade-off) — nakłada się na M/S/N:
    Oznacz dodatkowo „T", gdy zmiana jest dla Ciebie S/N, ale druga strona
    prawdopodobnie będzie się przy niej upierać → użyj jako karty przetargowej
    w zamian za ustępstwo w klauzuli kategorii M/S. „T" nigdy nie zastępuje „M".

REGUŁY ROZSTRZYGANIA (gdy klauzula trafia w więcej niż jeden próg):
  1. Wybierz kategorię WYŻSZĄ (M > S > N). Nielegalność zawsze wygrywa.
  2. Jeśli wartość umowy nieznana → użyj progów % i oznacz [próg szacunkowy].
  3. Próg ilościowy nie obniża kategorii ustalonej przez podłogę prawną (M).
  4. Zawsze podaj UZASADNIENIE liczbowe przy M/S (np. „kara 50 000 zł = 250%
     miesięcznego wynagrodzenia 20 000 zł → próg > 3× → M").
```

---

## MODUŁ E — TRYBY REDAKCJI

### E.1 Cztery tryby pracy

```
TRYB 1 — ANALIZA (mam dokument, oceniam):
  → Faza 0 (intake) → Moduł A → B → C → D → F (raport)
  → Moduły DOMAIN i SHARED wczytywane lazily wg potrzeb

TRYB 2 — REDAKCJA Z DANYCH (mam dane, napisz umowę):
  → Faza 0 → ustal typ umowy → wczytaj moduł PRIMARY/DOMAIN
  → Zbuduj dokument wg checklisty modułu
  → Zastosuj moduły SHARED: salwatoryjna, forma zmian, DPA jeśli IT/B2B
  → [WYMAGANE] view /mnt/skills/user/shared/HYBRID-VALIDATION.md → walidacja przed output
  → Raport F.2 (skrócony) z oceną gotowego dokumentu

TRYB 3 — DRAFT BEZ DANYCH (szablon z placeholderami):
  → Wczytaj właściwy moduł → generuj z placeholderami «NAZWA», «KWOTA», «DATA»
  → Zaznacz sekcje wymagające uzupełnienia: [DO UZUPEŁNIENIA: opis]
  → [WYMAGANE] view /mnt/skills/user/shared/HYBRID-VALIDATION.md → walidacja przed output
  → Dołącz instrukcję wypełnienia na końcu dokumentu

TRYB 4 — UZUPEŁNIENIE (mam szkielet, uzupełnij):
  → Zidentyfikuj luki w dokumencie (Moduł A + J0 master checklista)
  → Zaproponuj gotowe brzmienie brakujących klauzul
  → Wskaż sprzeczności z istniejącą treścią
```

### E.2 Zasady redakcji

```
□ Każda klauzula: weryfikacja podstawy prawnej w ISAP przed wpisaniem
□ Klauzule obowiązkowe zawsze obecne:
    - Oznaczenie stron (pełna identyfikacja + KRS/CEiDG/PESEL)
    - Przedmiot umowy (jednoznaczny opis)
    - Wynagrodzenie + termin płatności + waluta
    - Czas trwania + wypowiedzenie
    - Odpowiedzialność + limit (jeśli B2B)
    - Forma zmian (pisemna pod rygorem nieważności)
    - Klauzula salwatoryjna
    - Prawo właściwe + sąd właściwy
    - Liczba egzemplarzy
□ Klauzule warunkowe (wczytaj moduł gdy stosowne):
    - DPA → mod-shared-rodo.md (każda umowa usługowa B2B z dostępem do danych)
    - FM → mod-shared-fm-hardship.md (umowy >12 mies.)
    - Waloryzacja → mod-shared-lifecycle.md (umowy >24 mies.)
    - Zakaz konkurencji → zakaz-konkurencji.md (UoP + B2B)
    - IP / prawa autorskie → mod-J6 lub b2b-podwykonawcze.md
□ Język: precyzyjny, bez wieloznaczności; unikaj "itp.", "m.in." bez definicji
□ Numeracja: §1, §2 ... lub Artykuł 1, 2... (konsekwentnie)
□ Definicje: kluczowe pojęcia zdefiniowane w §1 lub słowniku
```

### E.3 Szybka checklista gotowości dokumentu do podpisania

```
PRZED PODPISANIEM — sprawdź:
  □ Strony: pełna identyfikacja, umocowanie podpisujących
  □ Przedmiot: jednoznaczny, bez luk
  □ Cena: kwota, waluta, termin, faktura/rachunek
  □ Terminy: daty lub zdarzenia, nie "niezwłocznie" bez definicji
  □ Wypowiedzenie: kto, kiedy, jak, z jakim skutkiem
  □ Kary: symetria lub uzasadnienie asymetrii
  □ Własność intelektualna: czyja, jakie pola eksploatacji
  □ Dane osobowe: czy potrzebna DPA?
  □ Forma: oryginały, podpisy, liczba egzemplarzy
  □ Załączniki: wymienione i fizycznie dołączone
```

---

## MODUŁ F — RAPORT KOŃCOWY ANALIZY (ROZBUDOWANY v1)

### F.1 Pełna struktura raportu

```
RAPORT ANALIZY UMOWY v1
Dokument: [nazwa / typ]
Data analizy: [data]
Strona chroniona: [A / B / neutralna]
Prawo właściwe: [polskie / inne]
Wartość umowy: [kwota lub szacunek]
Etap: [pierwsze czytanie / negocjacje / ostateczny]

## 1. IDENTYFIKACJA
Typ dokumentu: [...]
Kwalifikacja prawna: [...]
Forma: [wymagana / zastosowana / ocena]
⚠ Alerty formalne: [jeśli dotyczy]

## 2. BALANS DOKUMENTU
Strona A: [X/10]  |  Strona B: [Y/10]
Ocena: [opis dysproporcji]

## 3. KLAUZULE NIEDOZWOLONE (UOKiK / art. 385¹ KC)
[lista z nr wpisu lub podstawą]

## 4. KLAUZULE NIEZGODNE Z PRAWEM
[lista z podstawą prawną i skutkiem]

## 5. KLAUZULE RYZYKOWNE (zgodne z prawem, ale niekorzystne)
[lista z oceną: Krytyczne / Wysokie / Średnie / Niskie]

## 6. EKSPOZYCJA FINANSOWA (NOWE w v1)
[jeśli wartość umowy znana — wczytaj mod-shared-ryzyko-kwant.md]
Worst case: [kwota PLN]  |  Likely case: [kwota PLN]
Klauzula o najwyższym ryzyku: §[X] → do [kwota] PLN

## 7. ALERTY RODO (NOWE w v1)
[Czy wymagana DPA? Brakujące elementy DPA? → mod-shared-rodo.md]

## 8. KLAUZULE KORZYSTNE DLA STRONY CHRONIONEJ
[lista]

## 9. BRAKUJĄCE KLAUZULE
[co powinno być, a nie jest — ze wskazaniem modułu SHARED]

## 10. REKOMENDACJE ZMIAN (priorytetowe — M → S → N)
[lista z gotowymi brzmieniami + kategoriami negocjacyjnymi M/S/N/T]

## 11. PLAN DZIAŁANIA PRZED PODPISANIEM
Krok 1: [działanie] — termin: [kiedy]
Krok 2: [działanie]
[...]

## 12. OCENA OGÓLNA
Dokument: [gotowy do podpisania / wymaga zmian M / wymaga zmian S+M / nie podpisywać]

## 13. DISCLAIMER
[wczytaj /mnt/skills/user/shared/DISCLAIMER.md → dodaj wariant LAIK lub PRAWNIK]
```

### F.1-LITE Raport pośredni (umowy 10 000–50 000 PLN)

```
RAPORT ANALIZY UMOWY — LITE
Dokument: [nazwa / typ]
Strona chroniona: [A / B / neutralna]
Wartość: [kwota PLN]

## 1. IDENTYFIKACJA + FORMA
[typ, kwalifikacja, alerty formalne]

## 2. BALANS: A [X/10] vs B [Y/10]

## 3. KLAUZULE KRYTYCZNE I WYSOKIEGO RYZYKA
[tylko M i S — z gotowymi brzmieniami]

## 4. EKSPOZYCJA (skrócona)
Worst case: [kwota PLN] — klauzula: §[X]

## 5. BRAKUJĄCE KLAUZULE (dealbreakery)
[max 3 najważniejsze]

## 6. OCENA OGÓLNA + PLAN 3 KROKÓW

## 7. DISCLAIMER
```

### F.2 Skrócona wersja (na żądanie / umowy <10 000 PLN)

```
✅ W porządku: [liczba klauzul]
⚠ Ryzykowne: [liczba] — [najważniejsza]
❌ Niedozwolone/nieważne: [liczba] — [najważniejsza]
📊 Balans: A [X/10] vs B [Y/10]
💰 Ekspozycja: do ok. [kwota] PLN
🔑 Priorytet: [jedna zmiana dealbreaker]
```

### F.3 Widget statusu sprawy (po raporcie)

Po zakończeniu analizy (Raport F.1 / F.1-LITE / F.2) → wczytaj i zastosuj sekwencję:
```
view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
```
Widget renderowany inline jako show_widget HTML — nie jako present_files.
Dane wbudowane bezpośrednio w HTML jako literały JS.

---

## SKALOWANIE RAPORTU WG WARTOŚCI UMOWY

```
<10 000 PLN        → F.2 (skrócony)
10 000–50 000 PLN  → F.1-LITE (pośredni, 7 sekcji)
>50 000 PLN        → F.1 (pełny, 13 sekcji)
>100 000 PLN       → F.1 + RYZYKO-KWANT + NEG obowiązkowo
na żądanie         → zawsze F.1 niezależnie od kwoty
```

---

## REGUŁY NADRZĘDNE

1. Weryfikacja PRZED oceną — każdy przepis i klauzula sprawdzone online
2. Cytat PRZED interpretacją
3. Strona chroniona ZAWSZE jawna
4. Balans mierzony, nie odczuwany
5. Rekomendacja = gotowe brzmienie
6. Nieważność odróżniona od bezskuteczności
7. B2C vs B2B — różne standardy ochrony
8. Forma pisemna zmian — klauzula §10
9. Klauzula salwatoryjna — zawsze w redagowanym dokumencie
10. Data ważności prawa — przepisy z daty zawarcia
11. **NOWE v1:** Każda zmiana = kategoria negocjacyjna M/S/N/T
12. **NOWE v1:** Umowy >12 mies. → sprawdź potrzebę FM, lifecycle, waloryzacji
13. **NOWE v1:** Każda umowa usługowa B2B → sprawdź potrzebę DPA (RODO)
14. **NOWE v1.2:** Każda odpowiedź z analizą → DISCLAIMER jako ostatni element (LAIK/PRAWNIK)
15. **NOWE v1.2:** Każdy przepis/termin/orzeczenie → znacznik ✅ [VER] lub ⚠️ [NIEWERYFIKOWANE]

---

## OBSŁUGA BŁĘDÓW I PRZYPADKI SZCZEGÓLNE

| Sytuacja | Działanie |
|---|---|
| Dokument w języku obcym | Analizuj wskazując ograniczenia; kluczowe klauzule przetłumacz |
| Brak dostępu do UOKiK | Nie cytuj rejestru ani orzeczenia z pamięci; oprzyj ocenę na art. 385¹–385³ KC z ISAP i zaznacz brak urzędowej weryfikacji wpisu. |
| Klauzula niejasna / wieloznaczna | Wczytaj mod-shared-wykladnia.md → algorytm wykładni |
| Umowa wielojurysdykcyjna | Wskaż prawo właściwe (Rzym I); zastrzeż ograniczenia analizy |
| Brak danych stron w drafcie | Użyj placeholderów «STRONA A», «ADRES», etc. |
| Umowa ustna — brak dokumentu | Ryzyko dowodowe + zaproponuj pisemne potwierdzenie |
| Aneks sprzeczny z umową główną | Lex posterior + wskaż sprzeczność |
| OWU vs umowa indywidualna | Umowa indywidualna ma pierwszeństwo (art. 385 §1 KC) |
| Przetwarzanie danych bez DPA | ALERT RODO: wczytaj mod-shared-rodo.md |
| Umowa >2 lata bez FM | Rekomendacja: wczytaj mod-shared-fm-hardship.md |

---

## ŹRÓDŁA WERYFIKACJI (hierarchia)

| Priorytet | Źródło | URL | Zakres |
|---|---|---|---|
| 1 | ISAP — tekst jednolity | isap.sejm.gov.pl | Każdy akt PL |
| 2 | Rejestr klauzul UOKiK | rejestr.uokik.gov.pl | Klauzule abuzywne |
| 3 | Decyzje UOKiK | uokik.gov.pl | Decyzje administracyjne od 2016 |
| 4 | EUR-Lex | eur-lex.europa.eu | RODO, dyrektywy UE |
| 5 | Sąd Najwyższy | sn.pl | Linia orzecznicza |
| 6 | Portal Orzeczeń MS | orzeczenia.ms.gov.pl | SOKiK XVII AmC |
| 7 | Rejestr inwestycji deweloperskich | gov.pl (zweryfikuj właściwy organ/adres) | Deweloperzy (UUDE) |
| 8 | KW online | ekw.ms.gov.pl | Stany KW |
| 9 | SAOS | saos.org.pl | Agregator |
| 10 | UODO | uodo.gov.pl | Decyzje RODO |

---

## MAPOWANIE MODUŁÓW SHARED DO SYTUACJI

### Moduły lokalne (references/)
```
Użytkownik pyta o negocjacje / strategię / co zmienić najpierw?
  → view references/mod-shared-neg-strategia.md

Użytkownik prosi o "agresywną i łagodną wersję klauzuli" / warianty do negocjacji?
  → view references/mod-shared-alt-drafts.md

Klauzula jest niejasna / "co to znaczy" / sprzeczność klauzul?
  → view references/mod-shared-wykladnia.md

"Jakie jest ryzyko finansowe / ile mogę stracić?"
  → view references/mod-shared-ryzyko-kwant.md

Umowa zawiera FM / pandemic / inflacja / klauzulę siły wyższej?
  → view references/mod-shared-fm-hardship.md

Umowa IT, SaaS, HR, outsourcing — dane osobowe?
  → view references/mod-shared-rodo.md

Umowa >12 miesięcy, terminy po podpisaniu, naruszenie?
  → view references/mod-shared-lifecycle.md

Klauzule ESG, CSDDD, Code of Conduct dostawcy, łańcuch dostaw?
  → view references/mod-shared-esg.md

System AI, AI Act, rekrutacja AI, scoring, GPAI, high-risk AI?
  → view references/mod-shared-ai-act.md

Transakcja M&A, sprzedaż udziałów, SPA, SHA, LOI, earn-out?
  → view references/mod-MA-transakcje.md

Zamówienie publiczne, przetarg, PZP, FIDIC, KIO?
  → view references/mod-J7-pzp.md

Umowa B2C, reklamacja, odstąpienie, OWU e-commerce, klauzule abuzywne?
  → view references/mod-J8-b2c.md
```

### Moduły systemowe (user/shared/) — PRIORYTETOWE
```
Użytkownik nie podał wymaganych danych / formularz niekompletny?
  → view /mnt/skills/user/shared/INTAKE-GAP.md

PRZED wygenerowaniem umowy, klauzuli, aneksu — ZAWSZE:
  → view /mnt/skills/user/shared/HYBRID-VALIDATION.md

PO wygenerowaniu dokumentu — walidacja spójności:
  → view /mnt/skills/user/shared/POST-VALIDATION.md

Terminy procesowe / zawite / przedawnienia (KPC, KP, KPA)?
  → view /mnt/skills/user/shared/terminy.md

Weryfikacja zgodności treści dokumentu z faktami źródłowymi?
  → view /mnt/skills/user/shared/FAKTY_v2.md

Po zakończeniu raportu F.1 / F.1-LITE / F.2 — widget statusu sprawy:
  → view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md

Każda odpowiedź zawierająca analizę prawną (umowy, klauzule, ocena prawna)?
  → view /mnt/skills/user/shared/DISCLAIMER.md
  → dodaj disclaimer JAKO OSTATNI ELEMENT odpowiedzi (tryb LAIK lub PRAWNIK)

Sygnatura sądowa w piśmie lub raporcie — walidacja formatu i istnienia?
  → view /mnt/skills/user/shared/SYGNATURY.md

Przepis / termin / orzeczenie w odpowiedzi — wymóg znacznika weryfikacji?
  → view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md
  → każdy artykuł i orzeczenie: ✅ [VER: źródło, data] lub ⚠️ [NIEWERYFIKOWANE]
```

---

*mod-core-checklist v1.1 (2026-06-03) — wydzielony z SKILL.md analizator-umow-v1*
*v1.1: D.3 — kategorie M/S/N/T uzupełnione progami orientacyjnymi + reguły rozstrzygania*
*Wczytuj lazily: tryb 2/3/4 LUB pełny raport F.1 / F.1-LITE*
