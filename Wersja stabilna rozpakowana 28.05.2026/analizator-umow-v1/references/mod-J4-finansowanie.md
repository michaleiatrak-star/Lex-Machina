# MODUŁ J4 — UMOWY FINANSOWANIA: POŻYCZKA, LEASING, FACTORING
## Analizator Umów v2 · Moduł J4

> Wczytaj dla: pożyczka prywatna, pożyczka konsumencka (ustawa o kredycie
> konsumenckim), leasing operacyjny/finansowy, factoring (pełny/niepełny),
> cesja wierzytelności, finansowanie wierzytelności.

---
## J.7 POŻYCZKA (prywatna i konsumencka)

**Podstawa:**
```
isap.sejm.gov.pl → KC → art. 720–724 (pożyczka)
isap.sejm.gov.pl → ustawa o kredycie konsumenckim (jeśli pożyczkodawca = przedsiębiorca,
  pożyczkobiorca = konsument, kwota ≤ 255 550 zł)
```

### Pułapki:

**PO-1 — Brak formy dokumentowej dla pożyczki >1000 zł (MEDIUM RISK)**
```
PRAWO: KC art. 720 §2 → umowa pożyczki > 1000 zł → forma dokumentowa
  (wystarczy e-mail, SMS — ale lepiej pisemna dla celów dowodowych)
SKUTEK BRAKU: Trudności dowodowe — nie nieważność, ale ryzyko sporu o istnienie umowy
```

**PO-2 — RRSO ukryte w pożyczkach konsumenckich (CRITICAL)**
```
PRAWO: Ustawa o kredycie konsumenckim → RRSO musi być podane przed zawarciem
  → Brak RRSO → konsument może odstąpić w ciągu 14 dni
  → RRSO > maksymalne odsetki (KC art. 359 §2¹) → postanowienie nieważne

WERYFIKUJ: isap.sejm.gov.pl → KC art. 359 §2¹ → AKTUALNA maksymalna stopa odsetek
  (zmienia się z stopą referencyjną NBP!)

PUŁAPKA: "Opłata administracyjna" + "opłata przygotowawcza" + prowizja = ukryte RRSO
  → UOKiK ściga praktyki obchodzenia limitu odsetek przez opłaty para-odsetkowe
  → Sprawdź: rejestr.uokik.gov.pl i decyzje uokik.gov.pl
```

**PO-3 — Brak terminu zwrotu (MEDIUM RISK)**
```
PRAWO: KC art. 723 → brak terminu → pożyczkobiorca zwraca po wypowiedzeniu przez pożyczkodawcę
  z zachowaniem 6-tygodniowego terminu wypowiedzenia
PUŁAPKA: Strony "zapominają" wpisać termin → pożyczkodawca może wypowiedzieć w każdej chwili

REKOMENDACJA:
  → Zawsze wskazuj konkretny termin zwrotu lub harmonogram spłat
  → Określ co dzieje się przy opóźnieniu (odsetki? kara? wypowiedzenie?)
```

---

## J.8 LEASING

**Podstawa: KC art. 709¹–709¹⁸**
```
isap.sejm.gov.pl → KC → art. 709¹ i kolejne
Dodatkowe: ustawa o podatku dochodowym (leasing operacyjny vs finansowy — skutki podatkowe)
```

### Pułapki:

**LE-1 — Odpowiedzialność za wady przedmiotu leasingu (HIGH RISK)**
```
PRAWO: KC art. 709⁸ → korzystający (leasingobiorca) ponosi ryzyko wady i utraty rzeczy
  → Wada → korzystający może żądać od dostawcy, nie od finansującego
  → Utrata → obowiązek zapłaty rat mimo braku rzeczy

PUŁAPKA: "W przypadku kradzieży lub zniszczenia korzystający pozostaje zobowiązany
  do zapłaty wszystkich rat wynikających z harmonogramu"
  → LEGALNE (art. 709¹⁵ KC) — ale to REALNE ryzyko finansowe

REKOMENDACJA:
  → Ubezpieczenie GAP (Guaranteed Asset Protection) = obowiązkowe przy leasingu pojazdów
  → Ubezpieczenie All Risk z cesją na finansującego — weryfikuj OC/AC i sum ubezpieczenia
  → Upewnij się, że ubezpieczenie pokrywa 100% wartości pozostałych rat
```

**LE-2 — Opcja wykupu — pułapka podatkowa (MEDIUM RISK)**
```
PUŁAPKA: Leasing operacyjny → opcja wykupu po wartości rynkowej (nie symbolicznej)
  → Niski czynsz inicjalny + wysoka wartość wykupu = możliwe zakwestionowanie
    kwalifikacji jako leasing operacyjny przez US (reklasyfikacja na finansowy)

PUŁAPKA 2: Zbyt wcześniejszy wykup → możliwa reklasyfikacja całej umowy
REKOMENDACJA: Przed podpisaniem — konsultacja podatkowa, nie tylko prawna
```

**LE-3 — Subleasingowanie bez zgody (MEDIUM RISK)**
```
PRAWO: KC art. 709¹⁶ → bez zgody finansującego korzystający nie może podnajmować,
  oddawać do używania ani obciążać praw z umowy leasingu
PUŁAPKA: Kary w umowach leasingowych za udostępnienie pojazdu pracownikowi niebędącemu
  wskazanym kierowcą → sprawdź zapisy OWU leasingodawcy
```

---

---
## J.13 FACTORING

**Podstawa: KC art. 509–518 (przelew wierzytelności) + umowa nienazwana**

### Pułapki:

**FA-1 — Factoring z regresem a ryzyko złych wierzytelności (HIGH RISK)**
```
DWIE FORMY FACTORINGU:
  Bez regresu: faktor kupuje wierzytelność i przejmuje ryzyko nieściągalności
  Z regresem: faktor kupuje wierzytelność, ale przy braku zapłaty → zwrot do faktoranta

PUŁAPKA: "Factoring z regresem" nazywany "factoringiem" bez precyzowania type
  → Faktorant myśli, że pozbywa się ryzyka → faktycznie nie

REKOMENDACJA:
  → Wprost wskazuj typ w umowie: "factoring bez regresu" lub "factoring z regresem"
  → Przy factoringu bez regresu: wyższy koszt = cena za ryzyko po stronie faktora
```

**FA-2 — Cesja wierzytelności zablokowana przez klienta (HIGH RISK)**
```
PUŁAPKA: Umowa z klientem zawiera zakaz cesji wierzytelności
  → Faktorant chce skorzystać z faktoringu → nie może bez zgody dłużnika
  → Potencjalnie naruszenie umowy z klientem jeśli cesja mimo zakazu

REKOMENDACJA:
  → Sprawdzaj umowy z klientami przed podpisaniem umowy factoringowej
  → W nowych kontraktach: unikaj klauzul zakazujących cesji (Pułapka G.2 nr 6)
```

---

---
*← Powrót do routingu: `view references/mod-J0-routing.md`*
