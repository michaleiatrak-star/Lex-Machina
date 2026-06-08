---
name: analizator-umow-v1
description: |
  Analizator Umów v1 — analiza, redakcja i ocena dokumentów kontraktowych.
  Moduły eksperckie: B2B/podwykonawcze (G), prawo pracy/UoP (H), zakaz konkurencji (I),
  inne typy: najem, deweloperska, franczyza, agencyjna, pożyczka, leasing, dzieło,
  zlecenie, ugoda, SLA, factoring, konsorcjum (J). Katalog 40+ pułapek z szablonami.
  Stosuj gdy: dostarcza umowę/porozumienie/ugodę/OWU/regulamin; pyta o klauzule
  abuzywne lub ryzykowne; chce ocenić balans; prosi o draft lub modyfikację klauzul;
  pyta o B2B, podwykonawstwo, pseudosamozatrudnienie, ZUS/B2B, zakaz konkurencji
  (UoP/B2B/agencyjny/sprzedaż udziałów), prawa autorskie, UoP, wypowiedzenie,
  dyscyplinarkę, porozumienie rozwiązujące, odpowiedzialność materialną, monitoring,
  nadgodziny, najem (OPL), umowę deweloperską, franczyzę, leasing, pożyczkę,
  dzieło, zlecenie, SLA, factoring. Identyfikuje typ, kwalifikuje prawnie, weryfikuje
  w ISAP/UOKiK, ocenia balans, redaguje z danych lub jako draft.
  Prawo wyłącznie z oficjalnych źródeł — nigdy z pamięci.
compatibility:
  tools:
    - web_search
    - web_fetch
---

# Skill: Analizator Umów i Porozumień v1

---

## ROUTING DO MODUŁÓW EKSPERCKICH

Po ustaleniu typu dokumentu w Fazie 0 — wczytaj odpowiedni moduł:

### Moduły G i H — B2B i prawo pracy

| Typ umowy | Moduł | Ścieżka |
|---|---|---|
| Umowa B2B / kontrakt menedżerski / współpraca między przedsiębiorcami | **Moduł G** | `view references/b2b-podwykonawcze.md` |
| Umowa podwykonawcza budowlana (Inwestor→GW→Podwykonawca) | **Moduł G + G.3** | `view references/b2b-podwykonawcze.md` |
| Umowa podwykonawcza IT / software house | **Moduł G + G.4** | `view references/b2b-podwykonawcze.md` |
| Pseudosamozatrudnienie / test stosunku pracy | **Moduł G.1** | `view references/b2b-podwykonawcze.md` |
| Umowa o pracę / kontrakt pracowniczy | **Moduł H** | `view references/umowy-o-prace.md` |
| Zakaz konkurencji pracowniczy | **Moduł H.2 P-2/P-3** | `view references/umowy-o-prace.md` |
| Zakaz konkurencji B2B | **Moduł G.2 Pułapka 1** | `view references/b2b-podwykonawcze.md` |
| Wypowiedzenie / porozumienie rozwiązujące | **Moduł H.4** | `view references/umowy-o-prace.md` |

> **Zasada:** dla każdej umowy B2B lub UoP — wczytaj moduł ekspercki PRZED analizą klauzul.
> Moduły G i H zawierają katalogi pułapek, szablony i checklisty nieobecne w modułach A–F.

### Moduły J1–J6 — inne typy umów (lazy loading)

Wczytaj TYLKO moduł pasujący do konkretnego typu umowy — nie ładuj wszystkich naraz.

| Typ umowy | Moduł | Ścieżka |
|---|---|---|
| Najem mieszkaniowy (lokator–właściciel) | **J1** | `view references/mod-J1-najem.md` |
| Najem komercyjny (biuro, lokal, magazyn) | **J1** | `view references/mod-J1-najem.md` |
| Najem okazjonalny / instytucjonalny | **J1** | `view references/mod-J1-najem.md` |
| Umowa deweloperska / przedwstępna nieruchomości | **J2** | `view references/mod-J2-nieruchomosci.md` |
| Umowa rezerwacyjna / sprzedaży lokalu | **J2** | `view references/mod-J2-nieruchomosci.md` |
| Umowa franczyzy | **J3** | `view references/mod-J3-dystrybucja.md` |
| Umowa agencyjna / dystrybucyjna | **J3** | `view references/mod-J3-dystrybucja.md` |
| Pożyczka prywatna / konsumencka | **J4** | `view references/mod-J4-finansowanie.md` |
| Leasing operacyjny / finansowy | **J4** | `view references/mod-J4-finansowanie.md` |
| Factoring / cesja wierzytelności | **J4** | `view references/mod-J4-finansowanie.md` |
| Umowa o dzieło | **J5** | `view references/mod-J5-umowy-wykonawcze.md` |
| Umowa zlecenia | **J5** | `view references/mod-J5-umowy-wykonawcze.md` |
| Ugoda / porozumienie kończące spór | **J5** | `view references/mod-J5-umowy-wykonawcze.md` |
| Umowa SLA / licencyjna / software development | **J6** | `view references/mod-J6-it-konsorcjum.md` |
| Konsorcjum / joint venture | **J6** | `view references/mod-J6-it-konsorcjum.md` |
| Wiele typów jednocześnie / niejasny routing | **J0** | `view references/mod-J0-routing.md` |

> **Zasada lazy loading:** każdy moduł J1–J6 jest niezależny — wczytaj tylko ten,
> który pasuje do konkretnej sprawy. Dla master checklisty → `mod-J0-routing.md`.

---

## ZASADY FUNDAMENTALNE

**Zasada 1 — Weryfikacja prawa wyłącznie w oficjalnych źródłach:**
Każdy przywoływany przepis musi być zweryfikowany online przed użyciem.
- Prawo polskie → isap.sejm.gov.pl lub prawo.sejm.gov.pl (tekst jednolity)
- Klauzule niedozwolone → rejestr.uokik.gov.pl (rejestr klauzul niedozwolonych)
- Dyrektywy UE → eur-lex.europa.eu
- Orzecznictwo → sn.pl, orzeczenia.ms.gov.pl, saos.org.pl
Zakaz cytowania przepisów z pamięci — nawet gdy brzmienie jest znane.

**Zasada 2 — Zakaz fikcyjnych sygnatur klauzul:**
Każda klauzula niedozwolona musi być zidentyfikowana w rejestrze UOKiK
z numerem wpisu. Jeśli brak wpisu → wskaż przepis zakazujący (art. 385¹ KC)
i uzasadnij analogią, ale nie przypisuj numeru rejestru, którego nie znalazłeś.

**Zasada 3 — Pytania PRZED analizą:**
Nigdy nie analizuj dokumentu bez ustalenia: kto jest stroną, jaki cel
ma analiza (ochrona jednej strony / neutralna / redakcja). Zadaj FAZĘ 0.

**Zasada 4 — Oddziel fakty od interpretacji:**
Każdy komentarz do klauzuli ma format: [FAKT: treść klauzuli] →
[INTERPRETACJA: skutek prawny] → [OCENA: ryzyko/balans/rekomendacja].

**Zasada 5 — Balans dokumentu mierzony symetrycznie:**
Oceń każde prawa i obowiązki obu stron oddzielnie. Balans to stosunek
uprawnień do obowiązków dla każdej ze stron — nie opinia o "dobroci" umowy.

---

## FAZA 0 — INTAKE: pytania przed analizą

Przed każdą analizą lub redakcją ustal:

```
□ TRYB:
  [ ] ANALIZA  — mam dokument, chcę go ocenić
  [ ] REDAKCJA z danych  — mam dane stron i zakres, napisz umowę
  [ ] DRAFT bez danych  — przygotuj szablon z placeholderami [...]
  [ ] UZUPEŁNIENIE — mam szkielet umowy, uzupełnij dane stron

□ DOKUMENT:
  [ ] Typ (umowa/OWU/regulamin/porozumienie/aneks/ugoda)
  [ ] Czego dotyczy (np. umowa o pracę, najem, B2B, zlecenie, sprzedaż)
  [ ] Strona chroniona: kto mnie reprezentuje / czyją pozycję analizuję

□ CEL:
  [ ] Ochrona jednej strony  — wskaż której
  [ ] Analiza neutralna  — ocena jako niezależny ekspert
  [ ] Przygotowanie do podpisania — na co szczególnie uważać
  [ ] Negocjacje — co zmienić, by dokument był akceptowalny
  [ ] Ocena zgodności z prawem — czy mogę podpisać bez ryzyka

□ PRAWO WŁAŚCIWE:
  [ ] Polskie prawo (domyślnie)
  [ ] Inne — wskaż jurysdykcję
```

Jeśli użytkownik dostarczył dokument bez kontekstu — zadaj JEDNO pytanie
zbiorcze: "Kto jest Twoją stroną w tym dokumencie i jaki jest cel analizy
(podpisanie / negocjacje / ochrona / ocena prawna)?"

---

## MODUŁ A — IDENTYFIKACJA DOKUMENTU

### A.1 Rozpoznanie typu i kwalifikacja prawna

Dla każdego dostarczonego dokumentu ustal:

```
TYP DOKUMENTU:
  □ Umowa nazwana — zidentyfikuj typ:
    - sprzedaży (art. 535 KC)
    - najmu (art. 659 KC)
    - dzierżawy (art. 693 KC)
    - zlecenia (art. 734 KC)
    - o dzieło (art. 627 KC)
    - o pracę (art. 22 KP)
    - agencyjna (art. 758 KC)
    - pożyczki (art. 720 KC)
    - darowizny (art. 888 KC)
    - leasingu (art. 709¹ KC)
    - ubezpieczenia (art. 805 KC)
    - franchisingu (umowa nienazwana)
    - B2B / kontrakt menedżerski (mieszana)
    - inne — wskaż

  □ Umowa nienazwana — opisz hybrydę
  □ OWU / Regulamin — wskaż zakres stosowania
  □ Porozumienie stron — wskaż podstawę (art. 30 §1 pkt 1 KP lub KC)
  □ Aneks / Zmiana — do jakiej umowy głównej
  □ Ugoda (art. 917 KC) — co rozstrzyga
  □ Pełnomocnictwo — rodzaj i zakres
```

### A.2 Forma prawna wymagana

Weryfikuj online w isap.sejm.gov.pl:

| Typ dokumentu | Wymagana forma | Skutek braku formy |
|---|---|---|
| Sprzedaż nieruchomości | Akt notarialny (art. 158 KC) | Nieważność bezwzględna |
| Najem >1 rok | Forma pisemna (art. 660 KC) | Umowa na czas nieokreślony |
| Pożyczka >1000 zł | Forma dokumentowa (art. 720 §2 KC) | Trudność dowodowa |
| Przelew wierzytelności | Forma pisemna (art. 511 KC) | Niedopuszczalność |
| Porozumienie rozwiązujące | Brak wymogu formy | Ale pisemna = dowód |
| Umowa o pracę | Pisemna przed dopuszczeniem (art. 29 KP) | Obowiązek potwierdzenia |
| Gwarancja bankowa | Pisemna pod rygorem nieważności | Nieważność |

**Alert obligatoryjny:**
```
[⚠ FORMA] — jeśli dokument nie spełnia wymaganej formy → wskaż skutek prawny
[⚠ TERMIN] — jeśli dokument zawiera termin zawitego charakteru → wyeksponuj
[⚠ WŁAŚCIWOŚĆ] — jeśli klauzula wyboru prawa lub sądu jest niekorzystna
```

---

## MODUŁ B — ANALIZA KLAUZUL

### B.1 Sekwencja obowiązkowa dla każdej klauzuli

```
KROK 1: Wypisz klauzulę dosłownie (cytat z dokumentu)
KROK 2: Zakwalifikuj:
         □ Klauzula zgodna z prawem — neutralna
         □ Klauzula korzystna dla strony [A/B]
         □ Klauzula niekorzystna dla strony [A/B]
         □ Klauzula niedozwolona — sprawdź w rejestrze UOKiK
         □ Klauzula sprzeczna z bezwzględnie wiążącymi przepisami → nieważna
         □ Klauzula obchodząca prawo (in fraudem legis, art. 58 §1 KC)
KROK 3: Wskaź podstawę prawną
KROK 4: Oceń ryzyko: Krytyczne / Wysokie / Średnie / Niskie
KROK 5: Zaproponuj zmianę (brzmienie alternatywne)
```

### B.2 Weryfikacja klauzul niedozwolonych

**Rejestr UOKiK — obowiązkowe wyszukiwanie:**

```
URL: https://rejestr.uokik.gov.pl/
Strategia wyszukiwania:
  KROK 1: web_search "rejestr klauzul niedozwolonych UOKiK [temat klauzuli]"
  KROK 2: web_fetch https://rejestr.uokik.gov.pl/ → wyszukaj frazę kluczową
  KROK 3: Sprawdź orzeczenia SOKiK (Sąd Ochrony Konkurencji i Konsumentów)
           URL: orzeczenia.ms.gov.pl → filtr: XVII AmC

Format wpisu z rejestru:
  [Nr wpisu] | [Treść klauzuli] | [Przedsiębiorca] | [Data wpisu]
  Analogia: [dlaczego badana klauzula jest podobna do wpisanej]
```

**Bezwzględne zakazy z KC (sprawdź online w isap.sejm.gov.pl):**

```
art. 385¹ KC — klauzule abuzywne w umowach B2C (konsumenckich):
  Przesłanki: (1) nieuzgodnione indywidualnie + (2) rażąca dysproporcja
  + (3) sprzeczność z dobrymi obyczajami → klauzula bezskuteczna z mocy prawa

art. 385³ KC — szara lista (domniemanie abuzywności):
  Wymień wszystkie klauzule ze spisu podczas analizy umów konsumenckich:
  pkt 1–23 — wypisz i sprawdź czy któryś pasuje do badanej klauzuli

art. 58 KC — nieważność:
  §1: sprzeczność z ustawą lub mająca na celu obejście ustawy
  §2: sprzeczność z zasadami współżycia społecznego
  §3: nieważność części → reszta wiąże (chyba że całość = cel)

art. 353¹ KC — swoboda umów z limitami:
  Limit: właściwość stosunku + ustawa + zasady współżycia społecznego
```

### B.3 Katalog typowych klauzul ryzykownych (weryfikuj każdą)

Przy analizie każdego dokumentu sprawdź obecność:

**Klauzule jednostronnie zmieniające umowę:**
```
□ Prawo zmiany cennika bez wypowiedzenia i bez powiadomienia
□ Prawo zmiany OWU w trakcie trwania umowy jednostronnie
□ Prawo zawieszenia usługi bez podania przyczyny
→ Sprawdź: czy klauzula dotyczy B2C (konsument) → art. 385³ pkt 10 KC
```

**Klauzule wyłączające odpowiedzialność:**
```
□ Wyłączenie odpowiedzialności za szkodę wyrządzoną umyślnie → art. 473 §2 KC (bezskuteczne)
□ Wyłączenie rękojmi w B2C → art. 558 §2 KC (bezskuteczne)
□ Ograniczenie odszkodowania do wartości umowy bez uzasadnienia
→ Sprawdź: czy wyłączenie jest dopuszczalne w B2B (tak) vs B2C (nie)
```

**Klauzule dotyczące sądu i prawa właściwego:**
```
□ Wybór sądu wyłącznie w miejscu siedziby przedsiębiorcy → art. 385³ pkt 23 KC
□ Wybór prawa obcego niekorzystny dla konsumenta → Rozporządzenie Rzym I art. 6
□ Arbitraż jako jedyna droga → sprawdź czy zapis na sąd polubowny jest dopuszczalny
```

**Klauzule kar umownych:**
```
□ Kara umowna wyłącznie po jednej stronie → ocen balans
□ Kara rażąco wygórowana → art. 484 §2 KC (możliwość miarkowania)
□ Kara za każde naruszenie, nawet nieistotne → ryzyko abuzywności
□ Brak symetrii kar → ocen dysproporcję i wskaż zmianę
```

**Klauzule w umowach pracowniczych (KP) — ROZSZERZONY KATALOG:**
```
⚠ Dla umów o pracę wczytaj MODUŁ H: view references/umowy-o-prace.md
  Zawiera: 12 pułapek eksperckich, ochronę szczególną, analizę dokumentów
  kończących stosunek pracy, szablony klauzul zgodnych z KP

Podstawowe flagi (pełna analiza → Moduł H):
□ Zakaz konkurencji bez odszkodowania → art. 101² §3 KP (nieważny)
□ Odpowiedzialność pracownika ponad limit KP → art. 119 KP (nieważne)
□ Zrzeczenie się wynagrodzenia → art. 84 KP (nieważne)
□ Klauzule obniżające prawa pracownicze poniżej minimalnych → art. 18 KP
□ "Samozatrudnienie" ukrywające stosunek pracy → art. 22 §1¹ KP
□ Porozumienie rozwiązujące z blanketowym zrzeczeniem roszczeń → Pułapka P-7
□ Aneks ukrywający wypowiedzenie zmieniające → Pułapka P-8
```

**Klauzule w umowach B2B — ROZSZERZONY KATALOG:**
```
⚠ Dla umów B2B wczytaj MODUŁ G: view references/b2b-podwykonawcze.md
  Zawiera: 10 pułapek eksperckich, sekcje budownictwo i IT, szablony klauzul

Podstawowe flagi (pełna analiza → Moduł G):
□ Terminy płatności >60 dni → ustawa o przeciwdziałaniu nadmiernym opóźnieniom
  w transakcjach handlowych (weryfikuj: isap.sejm.gov.pl)
□ Cesja wierzytelności wyłączona bez zgody → art. 509 KC (domyślnie dozwolona)
□ Klauzula poufności bez limitu czasowego → ryzyko dla obu stron
□ Prawa IP przenoszone automatycznie bez wynagrodzenia → art. 41 pr.aut.
□ Zakaz konkurencji bez odszkodowania → walidacja Moduł G.2 Pułapka 1
□ Odpowiedzialność nieograniczona wykonawcy → walidacja Moduł G.2 Pułapka 4
□ Pseudosamozatrudnienie → test Moduł G.1 (≥3 cechy stosunku pracy = alert)
```

---

## MODUŁ C — OCENA ZGODNOŚCI Z PRAWEM

### C.1 Weryfikacja online — procedura obowiązkowa

```
DLA KAŻDEGO PRZYWOŁANEGO PRZEPISU:
  1. Wejdź: isap.sejm.gov.pl
  2. Wyszukaj ustawę po nazwie lub Dz.U.
  3. Otwórz tekst jednolity z aktualną datą
  4. Sprawdź brzmienie artykułu
  5. Sprawdź czy był nowelizowany po dacie zawarcia umowy
  6. Zapisz: art. X §Y + (t.j. Dz.U. z [rok] poz. [numer] ze zm.)

DLA KLAUZUL NIEDOZWOLONYCH:
  1. rejestr.uokik.gov.pl — wyszukaj podobną klauzulę
  2. web_search "SOKiK klauzula niedozwolona [temat]"
  3. orzeczenia.ms.gov.pl → sygnatura XVII AmC
  4. Jeśli brak w rejestrze → wskaż art. 385¹ KC + uzasadnij analogią
```

### C.2 Hierarchia naruszeń

```
POZIOM I — Nieważność bezwzględna (skutek z mocy prawa, bez orzeczenia sądu):
  → Sprzeczność z przepisem bezwzględnie wiążącym (art. 58 §1 KC)
  → Sprzeczność z zasadami współżycia społecznego (art. 58 §2 KC)
  → Obejście prawa (art. 58 §1 in fine KC)
  Skutek: klauzula / cała umowa nieważna od początku

POZIOM II — Bezskuteczność z mocy prawa (klauzula odpada, reszta wiąże):
  → Klauzula abuzywna B2C (art. 385¹ §1 KC)
  → Ograniczenie praw pracowniczych poniżej minimum KP (art. 18 §2 KP)
  Skutek: klauzula nie wiąże konsumenta/pracownika, przedsiębiorca/pracodawca — tak

POZIOM III — Wzruszalność (wymaga działania strony):
  → Błąd (art. 84 KC), groźba (art. 87 KC), podstęp (art. 86 KC)
  → Wyzysk (art. 388 KC)
  Skutek: strona może uchylić się od skutków oświadczenia woli

POZIOM IV — Ryzyko bez nieważności:
  → Niekorzystne, ale wiążące klauzule
  → Asymetria kar umownych
  → Zbyt długi termin płatności
  Skutek: brak w piśmie, ale realne ryzyko ekonomiczne lub procesowe
```

### C.3 Obejście prawa — identyfikacja

Sprawdź czy dokument:
```
□ Nazywa stosunek pracy "umową B2B/zlecenia" mimo znamion z art. 22 §1 KP
  (osobiste wykonanie + podporządkowanie + czas + miejsce + wynagrodzenie)
□ Przenosi obowiązki pracodawcy na pracownika (BHP, ubezpieczenia)
□ Dzieli wynagrodzenie na "fee" + "dywidenda" by unikać składek ZUS
□ Stosuje "klauzulę poufności" zamiast zakazu konkurencji by uniknąć odszkodowania
□ Wprowadza "zaliczkę" zamiast wynagrodzenia by móc żądać zwrotu
□ Tworzy pozorną sprzedaż nieruchomości z powrotnym prawem wykupu
  zamiast pożyczki → sprawdź art. 83 KC (pozorność)
```

---

## MODUŁ D — OCENA BALANSU DOKUMENTU

### D.1 Metodologia pomiaru balansu

Balans = stosunek uprawnień do obowiązków każdej ze strony.

Dla każdej ze stron sporządź tabelę:

```
STRONA [A/B]: [nazwa]
UPRAWNIENIA:
  [lista wszystkich praw, możliwości, opcji strony]
  Ważone: □ Krytyczne □ Istotne □ Drugorzędne

OBOWIĄZKI:
  [lista wszystkich zobowiązań, ograniczeń, zakazów]
  Ważone: □ Krytyczne □ Istotne □ Drugorzędne

ZABEZPIECZENIA:
  [kary umowne, gwarancje, zastawy, poręczenia PO JEJ STRONIE]

ODPOWIEDZIALNOŚĆ:
  [zakres odpowiedzialności nałożony NA NIĄ]
WYNIK: Strona [A/B] ma [przewagę / równowagę / słabszą pozycję]
       Asymetria: [opis konkretnej dysproporcji]
```

### D.2 Scoring balansu (0–10)

```
STRONA A: [X/10]    STRONA B: [Y/10]

Gdzie:
5/5 = pełna równowaga (obie strony 5/10)
8/2 = silna dominacja strony A
3/7 = silna dominacja strony B

Czynniki wpływające na scoring:
  +2 Kary umowne asymetryczne na korzyść strony
  +1 Prawo jednostronnej zmiany warunków
  +1 Wybór sądu / prawa na korzyść strony
  +1 Szerszy zakres siły wyższej zwalniającej tę stronę
  +1 Dłuższy termin na wykonanie / płatność po stronie A
  -1 Odpowiedzialność nieograniczona lub poszerzona
  -1 Obowiązki bez wzajemnego świadczenia
  -2 Klauzule abuzywne działające przeciwko stronie
```

### D.3 Rekomendacje zmian dla balansu

Dla każdego elementu dysbalansu wskaż:

```
ZMIANA [nr]:
OBECNA KLAUZULA: [cytat]
PROBLEM: [dlaczego niekorzystna, skutek prawny]
PROPONOWANE BRZMIENIE:
  „[nowa treść klauzuli gotowa do wklejenia do dokumentu]"
EFEKT: [co zmiana osiąga procesowo i ekonomicznie]
PRIORYTET: Krytyczny / Wysoki / Średni / Informacyjny
```

---

## MODUŁ E — TRYBY REDAKCJI

### E.1 Routing — wybór trybu

```
ANALIZA (dokument dostarczony):
  → Wykonaj Moduły A → B → C → D → Raport końcowy
  → Zaproponuj poprawki jako Moduł D.3

REDAKCJA Z DANYCH (użytkownik podaje dane stron i zakres):
  → Wykonaj Fazę 0
  → Zbierz dane przez INTAKE REDAKCJI (E.2)
  → Generuj dokument wg szablonu (E.4)

DRAFT BEZ DANYCH (szablon z placeholderami):
  → Wykonaj Fazę 0 dla ustalenia typu
  → Generuj dokument z placeholderami [NAZWA STRONY A], [ADRES], etc.
  → Oznacz miejsca wymagające danych: «pole do uzupełnienia»

UZUPEŁNIENIE (szkielet + dane stron):
  → Przyjmij szkielet od użytkownika
  → Zapytaj o brakujące dane stron
  → Wstaw dane do dokumentu i sprawdź spójność
```

### E.2 Intake redakcji (pytania przed draftem)

Przed redakcją dokumentu zbierz JEDNYM pytaniem zbiorczym:

```
□ TYP UMOWY: [co reguluje]
□ STRONA A: [pełna nazwa / imię nazwisko / firma + adres + NIP/PESEL/KRS]
□ STRONA B: [j.w.]
□ PRZEDMIOT: [co, ile, jakiej jakości / zakres usługi / stanowisko]
□ WYNAGRODZENIE / CENA: [kwota, waluta, termin płatności]
□ CZAS TRWANIA: [data od-do / czas nieokreślony / projekt]
□ SPECJALNE WARUNKI: [kary, zakaz konkurencji, poufność, IP]
□ ORIENTACJA BALANSU: [neutralna / chronić stronę A / chronić stronę B]
```

Jeśli brakuje danych → użyj placeholdera «pole» i oznacz po drafcie.

### E.3 Zasady redakcji

```
□ Każdy artykuł / paragraf = jedno zagadnienie
□ Definicje w §1 lub preambule — definiuj każde pojęcie używane dalej
□ Numeracja: §1, §2... lub Artykuł 1, Artykuł 2...
□ Obowiązek = "zobowiązuje się do" / "jest obowiązany"
□ Uprawnienie = "ma prawo do" / "może"
□ Termin zawity = "pod rygorem [skutek]"
□ Forma zmian = "wyłącznie w formie pisemnej pod rygorem nieważności"
□ Prawo właściwe = zawsze wskaż (art. 25 PrPryw lub rozp. Rzym I)
□ Sąd właściwy = wskaż wyraźnie (albo właściwość ogólna KC)
□ Klauzula salwatoryjna = zawsze na końcu dokumentu
□ Data i podpisy = format z miejscem na podpis obu stron
```

### E.4 Szablony podstawowe

#### SZABLON BAZOWY — struktura każdego dokumentu

```
                              [TYP DOKUMENTU]
                         zawarta / zawarty w [miejscowość]
                         dnia [DD miesiąc słownie RRRR] roku

pomiędzy:

1. [Pełna nazwa Strony A]
   z siedzibą w [adres] / zamieszkałą w [adres]
   NIP: [numer] / PESEL: [numer]
   wpisaną do rejestru przedsiębiorców KRS pod nr [numer] / CEiDG
   reprezentowaną przez: [imię i nazwisko, funkcja]
   zwaną dalej „[Skrót A]",

a

2. [Pełna nazwa Strony B]
   [j.w.]
   zwaną dalej „[Skrót B]",

zwanymi łącznie „Stronami".

                              PREAMBUŁA (opcjonalna)
[Cel umowy, kontekst, wola stron — max 3 zdania]

                              §1. DEFINICJE
Na potrzeby niniejszej Umowy:
1) „[Pojęcie]" oznacza [definicja];
2) „[Pojęcie]" oznacza [definicja];

                              §2. PRZEDMIOT UMOWY
1. [Strona A] zobowiązuje się do [opis świadczenia].
2. [Strona B] zobowiązuje się do [opis świadczenia wzajemnego].

                              §3. WYNAGRODZENIE / CENA
1. Za wykonanie przedmiotu Umowy [Strona B] zapłaci [Stronie A]
   wynagrodzenie w wysokości [kwota] zł brutto
   (słownie: [kwota słownie] złotych brutto).
2. Płatność nastąpi w terminie [X] dni od [zdarzenia],
   na rachunek bankowy nr [numer IBAN].
3. Za opóźnienie w płatności [Strona A] ma prawo naliczyć odsetki
   ustawowe za opóźnienie w transakcjach handlowych [lub: odsetki ustawowe].

                              §4. CZAS TRWANIA
1. Umowa zostaje zawarta na czas [określony do dnia / nieokreślony].
2. Każda ze Stron może wypowiedzieć Umowę z zachowaniem [X]-dniowego
   okresu wypowiedzenia [lub: bez zachowania okresu za zgodą obu Stron].

                              §5. PRAWA I OBOWIĄZKI STRON
1. [Strona A] jest obowiązana do:
   a) [obowiązek 1];
   b) [obowiązek 2].
2. [Strona B] jest obowiązana do:
   a) [obowiązek 1];
   b) [obowiązek 2].

                              §6. KARY UMOWNE
1. W przypadku niewykonania lub nienależytego wykonania zobowiązań przez
   [Stronę A], [Strona B] ma prawo żądać kary umownej w wysokości
   [X%] wartości Umowy / [kwota] zł za każdy dzień opóźnienia.
2. [Symetrycznie dla Strony B]
3. Strony mogą dochodzić odszkodowania przekraczającego wysokość
   kary umownej na zasadach ogólnych [lub: do wysokości kary umownej].

                              §7. ODPOWIEDZIALNOŚĆ
1. Strony ponoszą odpowiedzialność za niewykonanie lub nienależyte
   wykonanie Umowy na zasadach Kodeksu cywilnego.
2. [Ograniczenia odpowiedzialności — jeśli dozwolone prawnie]

                              §8. POUFNOŚĆ
1. Strony zobowiązują się do zachowania w tajemnicy wszelkich informacji
   poufnych uzyskanych w związku z realizacją Umowy przez okres [X] lat
   od jej rozwiązania lub wygaśnięcia.
2. Za informacje poufne uznaje się: [katalog].
3. Obowiązek poufności nie dotyczy informacji: publicznie znanych /
   ujawnionych przez uprawniony organ / znanych Stronie przed zawarciem Umowy.

                              §9. SIŁA WYŻSZA
1. Strona nie ponosi odpowiedzialności za niewykonanie lub opóźnienie
   wynikające z okoliczności siły wyższej.
2. Za siłę wyższą Strony uznają zdarzenia zewnętrzne, niemożliwe do
   przewidzenia i zapobieżenia, w szczególności: [katalog].
3. Strona dotknięta siłą wyższą obowiązana jest poinformować drugą Stronę
   niezwłocznie, nie później niż w terminie [X] dni.

                              §10. ZMIANY UMOWY
Wszelkie zmiany niniejszej Umowy wymagają formy pisemnej
pod rygorem nieważności.

                              §11. ROZWIĄZYWANIE SPORÓW
1. Strony zobowiązują się do polubownego rozwiązywania sporów.
2. W przypadku braku porozumienia, spory rozstrzygane będą przez sąd
   powszechny właściwy dla [siedziby Strony A / miejsca wykonania Umowy /
   miejsca zamieszkania konsumenta — w B2C: zawsze konsument].

                              §12. POSTANOWIENIA KOŃCOWE
1. W sprawach nieuregulowanych niniejszą Umową zastosowanie mają przepisy
   Kodeksu cywilnego [oraz / i odpowiednio inne wskazane ustawy].
2. Jeżeli jakiekolwiek postanowienie Umowy okaże się nieważne lub
   bezskuteczne, pozostałe postanowienia pozostają w mocy
   (klauzula salwatoryjna).
3. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach,
   po jednym dla każdej ze Stron.

[Miejscowość], dnia [data]

___________________________          ___________________________
[Strona A]                           [Strona B]
[imię i nazwisko / pieczęć]          [imię i nazwisko / pieczęć]
```

---

## MODUŁ F — RAPORT KOŃCOWY ANALIZY

### F.1 Struktura raportu

```
RAPORT ANALIZY UMOWY
Dokument: [nazwa / typ]
Data analizy: [data]
Strona chroniona: [A / B / neutralna]
Prawo właściwe: [polskie / inne]

## 1. IDENTYFIKACJA
Typ dokumentu: [...]
Kwalifikacja prawna: [...]
Forma: [wymagana / zastosowana / ocena]
⚠ Alerty formalne: [jeśli dotyczy]

## 2. BALANS DOKUMENTU
Strona A: [X/10]
Strona B: [Y/10]
Ocena: [opis dysproporcji lub równowagi]

## 3. KLAUZULE NIEDOZWOLONE
[lista z numerem wpisu UOKiK lub podstawą prawną]
Jeśli brak → "Nie stwierdzono klauzul wpisanych do rejestru UOKiK."

## 4. KLAUZULE NIEZGODNE Z PRAWEM
[lista z podstawą prawną i skutkiem: nieważność / bezskuteczność / ryzyko]

## 5. KLAUZULE RYZYKOWNE (zgodne z prawem, ale niekorzystne)
[lista z oceną ryzyka: Krytyczne / Wysokie / Średnie / Niskie]

## 6. KLAUZULE KORZYSTNE DLA STRONY CHRONIONEJ
[lista — co działa na korzyść]

## 7. BRAKUJĄCE KLAUZULE
[co powinno być w dokumencie, a nie jest]

## 8. REKOMENDACJE ZMIAN (priorytetowe)
[lista gotowych brzmień do wstawienia — wg Modułu D.3]

## 9. OCENA OGÓLNA
Dokument: [gotowy do podpisania / wymaga zmian / nie nadaje się do podpisania]
Priorytet działania: [co najpierw]
```

### F.2 Skrócona wersja raportu (na żądanie)

Jeśli użytkownik prosi o "krótką ocenę" lub "szybki przegląd":

```
✅ Klauzule w porządku: [liczba]
⚠ Klauzule ryzykowne: [liczba] — [najważniejsza]
❌ Klauzule niedozwolone / nieważne: [liczba] — [najważniejsza]
📊 Balans: Strona A [X/10] vs Strona B [Y/10]
🔑 Kluczowa rekomendacja: [jedna najważniejsza zmiana]
```

---

## REGUŁY NADRZĘDNE

1. **Weryfikacja PRZED oceną** — każdy przepis i klauzula z rejestru sprawdzone online
2. **Cytat PRZED interpretacją** — najpierw co mówi dokument, potem co to znaczy
3. **Strona chroniona ZAWSZE jawna** — analiza nie jest neutralna bez deklaracji
4. **Balans mierzony, nie odczuwany** — scoring przez tabelę uprawnień/obowiązków
5. **Rekomendacja = gotowe brzmienie** — nie "zmień §3" ale "§3 powinien brzmieć: ..."
6. **Nieważność odróżniona od bezskuteczności** — to różne skutki prawne
7. **B2C vs B2B** — inne standardy ochrony; zawsze ustal czy konsument jest stroną
8. **Forma pisemna zmian** — każdy redagowany dokument musi zawierać klauzulę §10
9. **Klauzula salwatoryjna zawsze** — §12 obowiązkowy w każdym redagowanym dokumencie
10. **Data ważności prawa** — stosuj przepisy obowiązujące W DNIU zawarcia umowy

---

## OBSŁUGA BŁĘDÓW I PRZYPADKI SZCZEGÓLNE

| Sytuacja | Działanie |
|---|---|
| Dokument w języku obcym | Poproś o tłumaczenie lub analizuj wskazując ograniczenia |
| Brak dostępu do rejestru UOKiK | Przejdź do web_search "SOKiK klauzula" + podstawa art. 385¹ KC |
| Umowa wielojurysdykcyjna | Wskaż prawo właściwe (Rzym I) i zastrzeż ograniczenia analizy |
| Klauzula niejasna / wieloznaczna | Wskaż dwie możliwe interpretacje (pro i contra strony chronionej) |
| Brak danych stron w drafcie | Użyj placeholderów «NAZWA STRONY A», «ADRES», «DATA» |
| Umowa ustna — brak dokumentu | Odnotuj ryzyko dowodowe + zaproponuj pisemne potwierdzenie |
| Aneks sprzeczny z umową główną | Wskaż sprzeczność + zastosuj zasadę lex posterior |
| OWU vs umowa indywidualna | OWU stosuje się subsydiarnie; umowa indywidualna ma pierwszeństwo |

---

## ŹRÓDŁA WERYFIKACJI (hierarchia)

| Priorytet | Źródło | URL | Zakres |
|---|---|---|---|
| 1 | ISAP — tekst jednolity | isap.sejm.gov.pl | Każdy akt prawny PL |
| 2 | Rejestr klauzul UOKiK | rejestr.uokik.gov.pl | Klauzule abuzywne |
| 3 | Sąd Najwyższy | sn.pl | Linia orzecznicza |
| 4 | Portal Orzeczeń MS | orzeczenia.ms.gov.pl | SOKiK: XVII AmC |
| 5 | EUR-Lex | eur-lex.europa.eu | Dyrektywy UE |
| 6 | SAOS | saos.org.pl | Backup / agregator |
| 7 | UOKiK — decyzje | uokik.gov.pl/decyzje | Decyzje administracyjne |

> ⚠ Portale prywatne (LEX, Legalis, prawo.pl) mogą być używane do
> orientacyjnego wyszukiwania, ale każdy przepis musi być potwierdzony
> w ISAP, a klauzula — w rejestrze UOKiK lub orzeczeniu SOKiK.

---

*Skill analizator-umow-v1 · Moduły G/H: b2b-podwykonawcze.md, umowy-o-prace.md, zakaz-konkurencji.md*
*Moduły J (lazy): mod-J0-routing · mod-J1-najem · mod-J2-nieruchomosci · mod-J3-dystrybucja*
*                  mod-J4-finansowanie · mod-J5-umowy-wykonawcze · mod-J6-it-konsorcjum*
*Dla pism procesowych → pisma-procesowe-v3 · Dla analizy dowodów → analizator-dowodow-v3*
*Prawo weryfikuj w ISAP · Klauzule w rejestrze UOKiK · Zawsze aktualny tekst jednolity*