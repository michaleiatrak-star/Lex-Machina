# W3-WERYFIKACJA — Weryfikacja przepisów, orzeczeń i walidacja (W3.1–W3.7)

> Wydzielono z pisma-procesowe-v3/SKILL.md (v5.5) — redukcja NOTA-4
> Wywołanie: `view /mnt/skills/user/pisma-procesowe-v3/references/W3-WERYFIKACJA.md`
> Zawiera: W3.1 (ISAP), W3.2 (orzeczenia + ZAKRES-STOSOWANIA), W3.3 (MOD-FAKTY),
>   W3.4 (MOD-WALIDACJA bloki A–J + moduły warunkowe), W3.5 (HYBRID-VALIDATION),
>   W3.6 (raport W3 + pismo finalne), W3.6a (AUDYT-KOŃCOWY), W3.7 (PEER-REVIEW + PV).

---

### W3.1 — Weryfikacja przepisów (ISAP)

Dla każdego ⚠️Pn z listy W2.3:

```
  KROK 1: web_fetch → https://isap.sejm.gov.pl (szukaj aktu po nazwie / Dz.U.)
  KROK 2: Potwierdź: tytuł aktu, numer Dz.U., data tekstu jednolitego
  KROK 3: Odczytaj brzmienie artykułu ze źródła — nie parafrazuj z pamięci
  KROK 4: Sprawdź: czy artykuł nie był nowelizowany po dacie zdarzenia?
  KROK 5: Zapisz: "art. [X] [ustawa] (Dz.U. [rok] poz. [nr] t.j.)" + URL

FORMAT RAPORTU bloku P:
  ✅ P1: art. [X] [ustawa] (Dz.U. [rok] poz. [nr]) — URL: [...]
  ✅ P2: art. [X] [ustawa] (Dz.U. [rok] poz. [nr]) — URL: [...]
  ⛔ P3: [opis] — BRAK DOSTĘPU / NIE ZNALEZIONO
          → pozostaw ⚠️ w piśmie z adnotacją [WYMAGA RĘCZNEJ WERYFIKACJI]
```

---

### W3.2 — Weryfikacja orzeczeń

Dla każdego ⚠️On z listy W2.3:

```
  KROK 1: web_search → "[opis orzeczenia] sygnatura site:orzeczenia.ms.gov.pl"
           lub: web_search → "[opis orzeczenia] sygnatura site:sn.pl"
  KROK 2: web_fetch → URL z wyników → potwierdź sygnaturę i tezę
  KROK 3: Odczytaj tezę ze źródła — nie parafrazuj z pamięci

  KROK 3a — ZAKRES-STOSOWANIA (obowiązkowy):
    Odczytaj stan faktyczny orzeczenia ze źródła.
    Odpowiedz: czy stan faktyczny orzeczenia jest analogiczny do stanu w piśmie?
    Pytania kontrolne:
      □ Czy orzeczenie dotyczy tego samego typu podmiotu?
      □ Czy orzeczenie dotyczy tego samego przepisu w tym samym kontekście?
      □ Czy orzeczenie nie ma ograniczonego zakresu (np. wyłącznie prywatyzacja,
        wyłącznie art. 47 KP, wyłącznie określony typ umowy)?
      □ Czy doktryna orzeczenia jest utrwalona czy odosobniona?

    Klasyfikacja:
      ✅ ZAKRES-OK:      stan faktyczny analogiczny → dopuszcz
      ⚠️ WARN-ZAKRES:   orzeczenie z ograniczonym zakresem stosowania →
                        wskaż ograniczenie w piśmie, szukaj orzeczenia
                        o szerszym zakresie jako wsparcie lub zamiennik
      ⛔ ZAKAZ-ZAKRES:  stan faktyczny orzeczenia NIE obejmuje pisma →
                        orzeczenia NIE wolno użyć; wstaw ⬛ [UZUPEŁNIJ]

  KROK 4: Sprawdź datę — czy linia orzecznicza aktualna po ewentualnych zmianach prawa?
  KROK 5: Zapisz: "wyrok [sąd] z [data], sygn. [nr], teza: [dosłownie ze źródła]"
           URL źródłowy obowiązkowy

FORMAT RAPORTU bloku O:
  ✅ O1: wyrok SN z [data], sygn. [nr] — URL: [...] — teza: [...]
         ZAKRES: ✅ analogiczny
  ✅ O2: wyrok SA [miasto] z [data], sygn. [nr] — URL: [...] — teza: [...]
         ZAKRES: ⚠️ WARN — orzeczenie z kontekstu prywatyzacji (III PZP 2/06);
                 użyto pomocniczo — mocniejsze wsparcie: I PK 311/07 + I PK 179/14
  ⛔ O3: [opis orzeczenia] — NIE ZNALEZIONO w oficjalnej bazie
          → ZAKAZ użycia w piśmie. Wstaw ⬛ [UZUPEŁNIJ: orzeczenie potwierdzające X]
```

⛔ ZAKAZ-6: Nie używaj orzeczenia gdy ZAKRES-STOSOWANIA = ZAKAZ-ZAKRES.
Nie cytuj orzeczeń na podstawie samej tezy bez weryfikacji stanu faktycznego.
Orzeczenia z ograniczonym zakresem (WARN-ZAKRES) można użyć tylko pomocniczo,
z jawnym wskazaniem ograniczenia i równoległym silniejszym orzeczeniem.

`view /mnt/skills/user/orzeczenia-sadowe-v2/SKILL.md`  (gdy potrzebne szerokie wyszukiwanie)

---

### W3.3 — MOD-FAKTY (gdy pismo z dostarczonych materiałów)

```
Czy użytkownik dostarczył materiały źródłowe?
  TAK → view /mnt/skills/user/shared/FAKTY_v2.md
        Procedura F1/F2/F3 — weryfikacja każdego faktu w piśmie
        ⛔ FIKCJA lub ⛔ BRAK ŹRÓDŁA → BLOKADA finalizacji
  NIE → pomiń W3.3
```

---

### W3.4 — MOD-WALIDACJA (zawsze)

```
view /mnt/skills/user/shared/MOD-WALIDACJA_v2.md
```

Wykonaj wszystkie bloki A–J. Raport walidacyjny obowiązkowy:

```
BLOK A — wymogi proceduralne (właściwość, strony, opłata, podpis)
BLOK B — spójność wewnętrzna (fakty ↔ dowody, kwoty, daty)
BLOK C — styl procesowy (oceny moralne, ogólne negacje, precyzja wniosków)
         Po Bloku C zawsze: view /mnt/skills/user/shared/MOD-KONCENTRACJA.md
         → raport długości per typ pisma (WARN/ALERT gdy za długie)
         → view /mnt/skills/user/shared/QUALITY-CHECK.md (kontrola redakcyjna + logiczna)
         → QUALITY-CHECK §5: view /mnt/skills/user/shared/MOD-INTRO.md (executive summary)
BLOK D — terminy i prekluzja
         view /mnt/skills/user/shared/TERM-CALC.md (zawsze gdy termin zawity lub
         środek zaskarżenia lub przedawnienie)
BLOK E — logika prawna (przepis + fakt + dowód dla każdego roszczenia)
         view /mnt/skills/user/shared/ROSZCZENIA.md (gdy ≥2 roszczenia lub żądanie ewentualne)
BLOK F — ryzyka procesowe (co można zaatakować, przyznania niekorzystne)
         view /mnt/skills/user/shared/RISK-ASSESSMENT.md (zawsze)
BLOK G — intertemporalność (brzmienie na datę zdarzenia)
         view /mnt/skills/user/shared/ISAP-AUDIT-PROTOCOL.md (gdy akty mogły być
         nowelizowane między datą zdarzenia a datą pisma)
BLOK H — zgodność z materiałem źródłowym (zakaz fabrykowania faktów)
BLOK I — skrzyżowanie pismo ↔ dostarczone dowody
         view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md (gdy ≥3 dowody lub
         dowód pośredni/ryzykowny)
         view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md (gdy pismo w toku
         postępowania lub sprawa gospodarcza)
         view /mnt/skills/user/shared/EXPERT-OPINION-AUDIT.md (gdy w aktach jest
         opinia biegłego lub pismo kwestionuje biegłego)
BLOK J — weryfikacja statusu prawnego aktów (FSL/LSL) — nowość v2.0:
          przed Blokiem J wywołaj:
          view /mnt/skills/user/shared/FACT-SOURCE-LOCK.md
          view /mnt/skills/user/shared/LEGAL-STATUS-LOCK.md
```

Moduły proceduralne shared (wczytaj zawsze przed blokami):
```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/FORMAL-CHECK.md
view /mnt/skills/user/shared/BRAKI-FORMALNE.md
view /mnt/skills/user/shared/WARUNKI-SKUTECZNOSCI.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Moduły jakości prawnej (zawsze po BLOK E):
```text
view /mnt/skills/user/shared/LEGAL-QUALITY-GATE.md   (bramka: PASS/PASS-WITH-WARNING/FAIL
                                                       — blokuje .docx gdy FAIL)
view /mnt/skills/user/shared/ORZECZENIA-HIERARCHIA.md (gdy pismo powołuje orzecznictwo)
```

Moduły warunkowe (triggery obowiązkowe — NIE "zależnie od sprawy"):
```text
view /mnt/skills/user/shared/TERM-CALC.md            → ZAWSZE gdy: termin zawity / środek
                                                        zaskarżenia / przedawnienie roszczenia
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md   → ZAWSZE gdy: pismo po pierwszym /
                                                        sprawa gospodarcza / twierdzenia nowe
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md   → ZAWSZE gdy: ≥3 dowody w sprawie /
                                                        dowód pośredni lub kontekstowy
view /mnt/skills/user/shared/ROSZCZENIA.md           → ZAWSZE gdy: ≥2 roszczenia /
                                                        żądanie ewentualne / alternatywne
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md  → ZAWSZE gdy: pismo kończące etap /
                                                        ryzyko procesowe WYSOKIE lub KRYTYCZNE
view /mnt/skills/user/shared/ISAP-AUDIT-PROTOCOL.md  → ZAWSZE gdy: akty mogły być nowelizowane
                                                        między datą zdarzenia a datą pisma
view /mnt/skills/user/shared/EXPERT-OPINION-AUDIT.md → ZAWSZE gdy: opinia biegłego w aktach /
                                                        pismo kwestionuje biegłego
```

---

### W3.5 — HYBRID-VALIDATION (zawsze po walidacji)

```
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
```

FAZA 1: auto-raport braków 🔴/🟡/🔵 bez pytania o zgodę
FAZA 2: użytkownik podaje dane per numer → precyzyjne wstawienie
FAZA 3: licznik ⬛ + docx gdy kompletne

---

### W3.6 — Pismo finalne

Po zamknięciu wszystkich ⚠️ — wydaj wersję finalną:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAPORT W3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRZEPISY:   ✅ [n] zweryfikowane | ⛔ [n] brak dostępu
ORZECZENIA: ✅ [n] zweryfikowane | ⛔ [n] nie znaleziono
WALIDACJA:  [GOTOWE DO ZŁOŻENIA / WYMAGA POPRAWEK / BLOKADA]
POLA ⬛:    [n] do uzupełnienia

STATUS PISMA: [GOTOWE / PROJEKT — uzupełnij przed złożeniem]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### W3.6a — AUDYT-KOŃCOWY (gate przed .docx)

> Wywołaj: `view /mnt/skills/user/shared/AUDYT-KONCOWY.md`

Wykonuj zawsze, niezależnie od typu pisma — bez warunku aktywacji.

**Krok 1 — COURT-SIMULATION (przed punktową oceną):**
```
view /mnt/skills/user/pisma-procesowe-v3/references/engines/court-simulation-engine.md
```
Wykonaj 10 pytań symulacji sądu. Wyniki zasilają bezpośrednio kategorię
"Realizm sądowy" w AUDYT-KONCOWY (nie wykonuj obu niezależnie).

**Krok 2 — LEGAL-QUALITY-GATE (bramka jakości prawa):**
```
view /mnt/skills/user/shared/LEGAL-QUALITY-GATE.md
```
Wynik: PASS → kontynuuj; PASS-WITH-WARNING → zaznacz w raporcie;
FAIL → ⛔ BLOKADA .docx — wróć do W3.1 dla problematycznych przepisów.

**Krok 3 — AUDYT-KOŃCOWY (6 kategorii 0–10):**
Oceń pismo finalne w 6 kategoriach (0–10, z uzasadnieniem). Jeśli
KTÓRAKOLWIEK kategoria <7/10 — STATUS = 🔴 BLOKADA: NIE generuj .docx,
wskaż poprawkę, wykonaj ją, powtórz ocenę tej kategorii.

---

### W3.7 — PEER REVIEW + POST-VALIDATION (krok kancelaryjny przed .docx)

> Wykonuj po AUDYT-KOŃCOWY ze statusem ✅ ZAMKNIĘTE.
> To jest ostatni jakościowy checkpoint przed finalną prezentacją — symuluje
> "drugiego adwokata" i pełną walidację spójności.

**Krok 1 — MOD-PEER-REVIEW (gdy warunek aktywacji spełniony):**
```
Aktywuj gdy CHOĆBY JEDNO jest prawdą:
  □ wartość przedmiotu sporu > 50 000 zł
  □ pismo zawiera ≥3 żądania
  □ pismo jest apelacją / zażaleniem do SN/SA
  □ użytkownik użył zwrotu "peer review" / "adwokat diabła" / "sprawdź jeszcze raz"

Jeśli aktywny:
view /mnt/skills/user/shared/MOD-PEER-REVIEW.md

Wykonaj 4 role: Adwokat diabła (ATAK-n), Sędzia (UWAGA-SĄDU-n),
Klient (INTERES-KLIENTA-n), Audyt spójności (SPÓJNOŚĆ-n).
Wynik: PEER-OK / PEER-UWAGI / PEER-STOP.
PEER-STOP = ⛔ BLOKADA .docx — wykonaj wskazaną korektę, powtórz ocenę.
```

**Krok 2 — POST-VALIDATION (zawsze):**
```
view /mnt/skills/user/shared/POST-VALIDATION.md

FAZA 1: automatyczny raport braków 🔴/🟡/🔵 (bez pytania o zgodę)
FAZA 2: wstaw dane użytkownika per numer → jeśli brak → ⬛
Braki 🔴 blokują finalizację.
```

**Krok 3 — UWAGI-REDAKCYJNE DLA PRAWNIKA/KLIENTA (zawsze, wbudowane w plik):**
```
⛔ OBOWIĄZKOWE przy każdym piśmie — analogicznie jak sekcja "Uwagi dla prawnika"
   w systemach konkurencyjnych. Wbuduj do pliku .docx jako ostatnią sekcję
   przed podpisem, wyróżnioną kursywą i kolorem szarym (rozmiar czcionki 18pt).

FORMAT:
  ⚖️ UWAGI REDAKCYJNE PRZED ZŁOŻENIEM:
  🔴 [n] KWESTIE DO BEZWZGLĘDNEGO SPRAWDZENIA:
    1. [konkretna kwestia]
    2. [...]
  🟡 [n] KWESTIE ZALECANE:
    1. [...]
  📌 PRZYJĘTE ZAŁOŻENIA KALKULACYJNE:
    - Wynagrodzenie: [stawka] — źródło: [umowa z dnia]
    - Metodologia odsetek: od 11. dnia każdego miesiąca
    - Premia: [kwota]/mies. — źródło: zeznania [świadek] + dane SUDOP

TRIGGER: ZAWSZE — nie ma warunku aktywacji. Brak sekcji = błąd pipeline.
Zawartość: generuj dynamicznie per sprawę na podstawie:
  → braków 🔴🟡 z POST-VALIDATION FAZA 1
  → anomalii Klasy II z DA-REJ (MOD-DOKUMENT-ANOMALIE)
  → ryzyk RD/RP/RPC z MOD-ATAK-NA-DRAFT RAPORT D
  → założeń kalkulacyjnych z W1.4b
```

---

### Po W3.7 — generowanie .docx i finalizacja

```
⛔ STRIP-VER-GATE → view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md § STRIP-VER-GATE
  Wykonaj SVG-1 → SVG-2 → SVG-3 przed generowaniem pliku.
  Blokada: nie wywołuj docx/SKILL.md dopóki SVG-1–SVG-3 niezamknięte.

view /mnt/skills/public/docx/SKILL.md → generuj .docx

⛔ HARD GATE STEP-DISCLOSURE → wykonaj ST-FINAL (REJESTR KROKÓW).
  Jeśli ≥1 krok wymagany ma status ⚠️ POMINIĘTY lub ○ OCZEKUJE →
  uruchom INFORMACJĘ WARUNKOWĄ, oznacz plik DRAFT — NIEZWERYFIKOWANY
  i ZATRZYMAJ się na decyzję a/b PRZED present_files. (ZAKAZ-14)

present_files (dopiero gdy ST-FINAL = FINAL, albo po świadomej zgodzie „a")

view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md → propozycja Raportu Sytuacyjnego
```
