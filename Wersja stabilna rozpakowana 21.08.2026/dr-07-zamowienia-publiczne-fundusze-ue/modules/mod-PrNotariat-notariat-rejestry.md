# mod-PrNotariat-notariat-rejestry

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Prawo o notariacie — Dz.U. 2022 poz. 1799 t.j. ze zm. — weryfikuj aktualny stan w ISAP
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Czynności notarialne (akt notarialny, poświadczenie, depozyt notarialny, protokół), odmowa dokonania czynności, odpowiedzialność dyscyplinarna i cywilna notariusza, skarga na notariusza, rejestry (KRS, CEIDG, KW, CRRN — Centralny Rejestr Rejestrantów Notarialnych), e-doręczenia notarialne.

### Akty

| Akt | Dz.U. |
|---|---|
| Prawo o notariacie | Dz.U. 2022 poz. 1799 t.j. ze zm. — weryfikuj aktualny w ISAP |
| KPC | Dz.U. 2026 poz. 468 t.j. — zaskarżenie odmowy czynności |
| KC | Dz.U. 2025 poz. 1071 t.j. — forma aktów notarialnych |

---

## 2. INTAKE

```
□ Jaka czynność notarialna: akt notarialny / poświadczenie / depozyt / protokół / pełnomocnictwo?
□ Czy notariusz odmówił czynności? (tryb zaskarżenia!)
□ Czy jest skarga na notariusza (błąd, przewlekłość, nieprawidłowość)?
□ Czy dotyczy odpowiedzialności cywilnej notariusza za szkodę?
□ Data czynności i czy termin na zaskarżenie nie upłynął?
□ Jakie rejestry są zaangażowane (KRS, CEIDG, KW, CRRN)?
```

---

## 3. PROCEDURA

### Czynności notarialne — podstawowe typy

```
AKT NOTARIALNY:
  Wymagany przy: zbyciu nieruchomości, ustanowieniu hipoteki, umowie spółki z o.o.
  i S.A. (zmiana umowy), testamencie notarialnym, pełnomocnictwie do czynności
  wymagającej formy aktu, darowizna nieruchomości, małżeńska umowa majątkowa
  Forma: obligatoryjna pod rygorem nieważności (ad solemnitatem) lub dla celów
         dowodowych — weryfikuj podstawę przy każdej czynności w KC/KSH

POŚWIADCZENIE:
  Podpisów: weryfikacja tożsamości i własnoręczności podpisu
  Odpisów: zgodność kopii z oryginałem
  Daty dokumentu (data pewna — art. 81 KC)
  Pozostawania osoby przy życiu

DEPOZYT NOTARIALNY (art. 108 PrNot — weryfikuj w ISAP):
  Złożenie pieniędzy lub papierów wartościowych na przechowanie
  Znaczenie przy transakcjach nieruchomości (bezpieczna płatność)
  Protokół: dokumentuje złożenie i warunki wydania

NOTARIALNY TYTUŁ EGZEKUCYJNY (art. 777 §1 pkt 4–6 KPC):
  Dłużnik poddaje się egzekucji wprost w akcie notarialnym
  Umożliwia egzekucję bez procesu sądowego po nadaniu klauzuli
  Ryzyko: powództwo opozycyjne dłużnika (art. 840 KPC)
```

### Odmowa czynności notarialnej

```
Podstawa: notariusz odmawia gdy czynność byłaby sprzeczna z prawem (art. 81 PrNot)
Forma odmowy: pisemna, z uzasadnieniem — na żądanie strony
Zaskarżenie:
  → Wniosek do sądu rejonowego właściwego dla kancelarii notarialnej
  → Termin: 7 dni od doręczenia odmowy pisemnej (weryfikuj art. 83 PrNot w ISAP)
  → Sąd rozpoznaje w trybie nieprocesowym
```

### Odpowiedzialność notariusza

```
CYWILNA (art. 49 PrNot):
  Za szkodę wyrządzoną przy wykonywaniu czynności notarialnych
  Ubezpieczenie OC notariusza: obowiązkowe
  Roszczenie: pozew do sądu cywilnego + ewentualnie do ubezpieczyciela
  Przedawnienie: 3 lata od dowiedzenia się o szkodzie (art. 4421 KC — weryfikuj)

DYSCYPLINARNA:
  Organ: Sąd Dyscyplinarny Krajowej Rady Notarialnej
  Kary: upomnienie, nagana, kara pieniężna, zawieszenie, wydalenie z zawodu
  Skarga do RN: pisemna, bez terminu zawitego

ZAWODOWA:
  Nadzór: Prezes Sądu Apelacyjnego + Krajowa Rada Notarialna
  Lustracje kancelarii notarialnych
```

---

## 4. CRRN — CENTRALNY REJESTR REJESTRANTÓW NOTARIALNYCH

```
Rejestr aktów notarialnych i poświadczeń
Dostęp: notariusze, sądy, organy publiczne
Baza testamentów notarialnych (NORT): weryfikacja przed wszczęciem postępowania spadkowego

Weryfikacja aktów online: rejestry.gov.pl / CRRN
```

---

## 5. DOWODY, STRATEGIA, QUALITY GATE, OUTPUT

**Dowody:** akt notarialny (oryginalny lub odpis) + dowód odmowy czynności + korespondencja z kancelarią + OC notariusza + dokumentacja szkody.

**Strategia:** Odmowa czynności — zaskarż w 7 dniach do SR. Szkoda — pozew + zawiadomienie do ubezpieczyciela OC. Przy podejrzeniu nieprawidłowości — skarga do KRN równolegle z roszczeniem cywilnym.

**Quality gate:** Forma czynności prawidłowa (ad solemnitatem)? Termin zaskarżenia odmowy (7 dni)? Aktualny PrNot z ISAP?

**Output:** Kwalifikacja czynności → forma → odmowa / nieprawidłowość → tryb zaskarżenia → odpowiedzialność → rekomendacja.

**Powiązania:** `dr-02` → `mod-KPC-egzekucja-windykacja` (NTE) | `dr-02` → `mod-KC-spadki` (testament) | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20221799 | https://rejestry.gov.pl

---

## ANEKS — ZARZUTY, KONTRARGUMENTY, STRATEGIA

### Zarzuty typowe

Rozważ przy każdej sprawie notarialnej / rejestrowej:
- naruszenie właściwości organu/notariusza
- naruszenie prawa do udziału w sprawie
- brak podstawy prawnej czynności
- błędna wykładnia przepisu
- dowolna ocena dowodów lub dokumentów
- brak uzasadnienia odmowy lub postanowienia
- nieproporcjonalność środka do celu
- nierówne traktowanie
- naruszenie zaufania do organu / notariusza
- naruszenie terminów
- brak rozpoznania istoty sprawy

### Kontrargumenty organu / strony przeciwnej

Przewiduj:
- formalny brak legitymacji do zaskarżenia
- spóźnienie środka zaskarżenia
- brak interesu prawnego
- domniemanie prawidłowości dokumentu urzędowego (aktu notarialnego)
- uznaniowość notariusza przy odmowie
- tajemnica notarialna / tajemnica ustawowo chroniona
- brak szkody albo związku przyczynowego
- nieadekwatność żądanego środka

### Strategia — 7 priorytetów

1. Zabezpiecz termin i dowód doręczenia odmowy / orzeczenia.
2. Uzyskaj akta i pełną podstawę rozstrzygnięcia (art. 84 PrNot — żądanie pisemnej odmowy).
3. Oddziel zarzuty formalne od materialnych — formalne mają pierwszeństwo.
4. Wskaż fakty decydujące, nie wszystkie fakty.
5. Buduj żądanie główne i ewentualne.
6. Wariant parallel: zaskarżenie czynności → skarga dyscyplinarna → roszczenie cywilne z OC.
7. Oceń co jest korzystniejsze: uchylenie / stwierdzenie nieważności / odszkodowanie.

### Kwalifikacja rodzaju sprawy

```
Sprawa CYWILNA:
  → Zakwestionowanie ważności aktu notarialnego (powództwo do SO)
  → Odpowiedzialność odszkodowawcza notariusza (pozew cywilny)

Sprawa ADMINISTRACYJNA / REJESTROWA:
  → Zaskarżenie odmowy dokonania czynności (SR — tryb nieprocesowy)
  → Wpisy i odmowy wpisów do KRS, CEIDG, KW (SR rejestrowy)

Sprawa DYSCYPLINARNA:
  → Skarga na notariusza do Rady Notarialnej / Sądu Dyscyplinarnego KRN
  → Nadzór: Prezes SA + KRN

Sprawa KARNA:
  → Notariusz jako funkcjonariusz publiczny (art. 115 §13 KK)
  → Poświadczenie nieprawdy (art. 271 KK) — fałsz intelektualny w dokumencie urzędowym
  → Zawiadomienie do prokuratury
```
