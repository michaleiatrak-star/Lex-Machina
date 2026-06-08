# MODUŁ DEVIL-ADVOCATE — OCENA Z PERSPEKTYWY DRUGIEJ STRONY
## Analizator Umów v1 · Moduł Shared

> **Wczytaj gdy (na żądanie):** frazy: „ocena drugiej strony", „perspektywa
> kontrahenta", „red team", „devil's advocate", „co mogą zarzucić",
> „jak to przeczyta druga strona", „ataki na umowę", „co mogą wykorzystać",
> „sprawdź zanim wyślemy".
>
> **Wczytaj gdy (auto-trigger przed wysłaniem):** tryb REDAKCJA z danych
> LUB DRAFT, dokument gotowy do finalnej wersji — uruchom automatycznie
> jako krok między mod-shared-neg-strategia.md a HYBRID-VALIDATION.
> Komunikat: „Przed wygenerowaniem finalnego dokumentu — czy chcesz,
> żebym sprawdził umowę z perspektywy drugiej strony? (zalecane)"
>
> **NIE wczytuj** gdy: analiza dopiero się zaczyna (nie ma jeszcze tekstu
> umowy do oceny), użytkownik prosi o analizę ryzyk swojej strony
> (→ mod-core-checklist.md Moduł E), lub triage wstępny.

> ⛔ HARD GATE — każdy art. / § / Dz.U. przywołany w ocenie ataku →
> web_search/web_fetch do isap.sejm.gov.pl w tej samej odpowiedzi.
> Zakaz cytowania przepisów z pamięci. Znacznik ✅ [VER] lub ⚠️ [NIEWERYFIKOWANE].

---

## DA.0 — RÓŻNICA MIĘDZY TYM MODUŁEM A AUDYTEM RYZYK

```
Audyt ryzyk (mod-core-checklist.md Moduł E):
  → patrzy Z perspektywy naszego klienta
  → pytanie: „co nam grozi?"

Devil's advocate (ten moduł):
  → patrzy Z perspektywy oponenta
  → pytanie: „co oponent znajdzie w umowie PRZECIWKO NAM?"

Komplementarne, nie zamienne.
Audyt ryzyk = obrona własnych interesów.
Devil's advocate = atak na nasz dokument oczami drugiej strony.
```

---

## DA.1 — KROK 1: IDENTYFIKACJA PERSONY OPONENTA

Przed skanem ustal (jedno pytanie jeśli nie wiadomo):

```
□ KOGO REPREZENTUJEMY:
  Klient to: [Wykonawca / Zamawiający / Wynajmujący / Licencjodawca / inna rola]

□ KTO JEST OPONENTEM:
  [ ] Kancelaria korporacyjna (szuka literówek, odesłań, nieważności)
  [ ] Kancelaria ogólna / mała (szuka oczywistych asymetrii)
  [ ] In-house prawnik (nastawienie obronne, eskalacja do przełożonego)
  [ ] Przedsiębiorca bez prawnika (szuka „dlaczego mam tyle zapłacić")
  [ ] Konsument (szuka klauzul niedozwolonych, prawa odstąpienia)

□ KONTEKST RELACJI:
  [ ] Nowa relacja (pierwsze podpisanie)
  [ ] Trwająca współpraca (aneks / zmiana)
  [ ] Spór otwarty (ugoda / rozliczenie)
  [ ] Kontrpropozycja (odpowiedź na projekt drugiej strony)
```

Na podstawie tych danych sformułuj **personę oponenta** jednym zdaniem:
> „Oponent to [opis], jego główna motywacja to [cel], jego narzędzia to [jakie ataki zastosuje]."

---

## DA.2 — KROK 2: SKAN 6 KATEGORII ATAKÓW

Czytaj umowę punkt po punkcie z perspektywy persony oponenta.
Dla każdej z 6 kategorii szukaj aktywnie — nie analizuj neutralnie.

### Kategoria 1: Niekorzystne potwierdzenia (concessions)

Fragmenty, w których nasza strona niechcąco przyznaje fakt lub
stanowisko prawne korzystne dla oponenta.

**Pytania kontrolne:**
```
□ Czy preambuła zawiera ustalenia faktyczne, które oponent może
  wykorzystać jako uznanie jego roszczeń lub praw?
□ Czy są odesłania do wcześniejszych umów / dokumentów, które
  „włączają" klauzule korzystne dla oponenta (backdoor)?
□ Czy są sformułowania: „Strony potwierdzają, że..." / „Strony zgodnie
  uznają, że..." przy kwestiach spornych?
□ Czy klauzula wygaśnięcia/zrzeczenia roszczeń może być zbyt szeroka
  (zrzekamy się roszczenia, o którym nie wiemy)?
□ Czy transfer materiałów / danych / praw opisany „wszystko co przekazane
  do dnia..." zbyt szeroko?
```

### Kategoria 2: Niejednoznaczności interpretacyjne

Sformułowania, które oponent może interpretować na swoją korzyść.

**Pytania kontrolne:**
```
□ Czy są słowa: „odpowiednio", „stosownie", „w miarę możliwości",
  „rozsądny", „uzasadniony" bez doprecyzowania?
□ Czy daty graniczne mają określoną inkluzywność
  („do dnia X włącznie" vs „do dnia X")?
□ Czy kwoty są opisane jako brutto/netto/z VAT/bez VAT spójnie?
□ Czy zdarzenia warunkowe opisane konkretnie
  (co dokładnie inicjuje obowiązek, termin, prawo)?
□ Czy strona bierna ukrywa podmiot obowiązku
  (kto ma wykonać / zapłacić / dostarczyć)?
□ Czy odesłania czasowe („po zakończeniu", „w trakcie", „do czasu")
  są jednoznacznie datowane lub zdefiniowane?
```

### Kategoria 3: Luki dowodowe

Brakujące zapisy, które oponent może wykorzystać w sporze procesowym.

**Pytania kontrolne:**
```
□ Czy moment zapłaty jest jednoznaczny (uznanie rachunku vs obciążenie)?
□ Czy mechanizm doręczeń jest opisany
  (jaki kanał, na jaki adres, z jakim skutkiem)?
□ Czy jest mechanizm potwierdzania wykonania
  (raporty, protokoły, milcząca akceptacja z terminem)?
□ Czy wymogi formalne (pisemna, dokumentowa) są realne
  i spełniają funkcję dowodową?
□ Czy brak terminu na zgłoszenie zastrzeżeń = milczenie = akceptacja
  jest świadome i po której stronie działa?
```

### Kategoria 4: Sprzeczności wewnętrzne

Luki logiczne umożliwiające oponentowi wybiórczą interpretację.

**Pytania kontrolne:**
```
□ Czy klauzule warunkujące się nawzajem tworzą zamknięty obwód
  (zgoda → wykonanie → zapłata → wygaśnięcie → brak roszczenia)?
□ Czy klauzula wygaśnięcia „w całości" nie koliduje z obowiązkami
  istniejącymi po wygaśnięciu (poufność, IP, rozliczenie)?
□ Czy odesłania wewnętrzne (§X ust. Y) są aktualne
  po wszystkich edycjach? [→ uruchom SO jeśli nie wykonano]
□ Czy „wyczerpanie roszczeń" w jednej klauzuli nie koliduje
  z „obowiązkiem zapłaty" w innej?
□ Czy klauzula kary umownej i klauzula odszkodowania uzupełniającego
  są spójne (nie dublują i nie wykluczają)?
```

### Kategoria 5: Błędy obliczeniowe i terminowe

Konkretne liczby, daty i terminy jako punkt ataku.

**Pytania kontrolne:**
```
□ Suma rat = kwota łączna?
□ Daty terminów płatności ≠ daty wygaśnięcia praw / zgód (kolizja)?
□ Kwoty słownie = kwoty cyframi?
□ „Do dnia X" — X włącznie czy wyłącznie — spójne w całej umowie?
□ Odsetki od jakiej daty — wymagalność / wezwanie / data faktury?
□ Terminy w dniach roboczych czy kalendarzowych — spójność?
□ Jeśli termin płatności to „30 dni od FV" — kto wystawia FV i kiedy?
```

### Kategoria 6: Mechanizmy wyjścia (exit ramps)

Klauzule, które oponent może wykorzystać do wycofania się,
spowolnienia lub zablokowania wykonania.

**Pytania kontrolne:**
```
□ Czy klauzula siły wyższej jest zbyt szeroka
  (obejmuje zwykłe trudności gospodarcze, opóźnienia poddostawców)?
□ Czy „ważne powody" wypowiedzenia mają listę zamkniętą,
  czy otwartą z podkładką „w szczególności"?
□ Czy warunki zawieszające / rozwiązujące nie dają oponentowi
  nieograniczonej zwłoki bez sankcji?
□ Czy klauzule rozwiązujące są symetrycznie skonstruowane
  — i czy asymetria jest zamierzona i korzystna dla nas?
□ Czy art. 918 KC (uchylenie się od skutków ugody) jest ograniczony
  tam gdzie mogłoby to zaszkodzić? — weryfikuj przez ISAP
□ Czy klauzula mediacji / eskalacji nie jest de facto exit ramp
  dającym oponentowi czas bez obowiązku?
```

---

## DA.3 — KROK 3: FORMAT RAPORTU

```
## OCENA Z PERSPEKTYWY DRUGIEJ STRONY — [nazwa umowy]

### Persona oponenta
[Jedno zdanie: kto czyta, motywacja, narzędzia]

### Zidentyfikowane słabości

#### P1 — Krytyczne (naprawić przed wysłaniem)
Słabości, które oponent z dużym prawdopodobieństwem wykorzysta.

1. [§X ust. Y] — [Kategoria ataku]
   Słabość: [co konkretnie]
   Atak oponenta: [jak sformułuje zarzut / roszczenie]
   Rekomendacja: [konkretna zmiana brzmienia]

2. [...]

#### P2 — Istotne (rekomenduje się naprawić)
Słabości możliwe do wykorzystania przez agresywnego pełnomocnika.

1. [...]

#### P3 — Drobne (do świadomego przyjęcia)
Słabości teoretyczne — mało prawdopodobne, ale rejestrujemy.

1. [...]

### Pytania do klienta przed wysłaniem
[Kwestie wymagające decyzji biznesowej, nie prawnej]

### Ocena ryzyka negocjacyjnego
[2–3 zdania: jak ocena 2. strony wpłynie na pozycję]
```

---

## DA.4 — KROK 4: FINAL CHECKLIST PRZED WYSŁANIEM

Uruchom zawsze po iteracjach poprawek, tuż przed finalnym wyjściem dokumentu:

```
□ 1. Wszystkie uzgodnione zmiany (P1/P2) faktycznie są w dokumencie?
     → Porównaj z listą uzgodnień z poprzedniej rundy

□ 2. Odesłania §→§ aktualne po edycjach?
     → Jeśli nie wykonano mod-spojnosc-odeslan.md — uruchom teraz

□ 3. Nazewnictwo wyliczeń spójne?
     → Po zmianie (a)(b)(c) → 1)2)3): odesłania używają „pkt" nie „lit."?

□ 4. Brak zdublowanych mechanizmów?
     → Jeden skutek prawny = jeden paragraf

□ 5. Spójność przypadków gramatycznych w wyliczeniach?
     → „wraz z X oraz Y" — X i Y w tym samym przypadku

□ 6. Placeholdery dat / miejsc usunięte lub wypełnione?
     → Spójny styl (5 kropek lub [data] — jeden styl w całym dokumencie)

□ 7. Nazwy stron spójne z komparycją w całym dokumencie?
     → Po iteracjach: brak wariantów (Wykonawca / Zleceniobiorca / Strona)
```

---

## DA.5 — ITERACJA I ZAKOŃCZENIE

Po wygenerowaniu raportu DA.3:

1. Napraw P1 (zawsze)
2. Omów P2 z użytkownikiem (decyzja biznesowa lub prawna)
3. Przyjmij świadomie P3 (wpisz do notatki: „akceptujemy")
4. Po poprawkach — uruchom **FINAL CHECKLIST (DA.4)** ponownie

Procedura zakończona gdy: zero P1 + P2 zaakceptowane lub naprawione +
final checklist bez flag. Następny krok → HYBRID-VALIDATION → .docx.

---

## DA.6 — POWIĄZANIA Z INNYMI MODUŁAMI

```
Komplementarny:  mod-core-checklist.md Moduł E (audyt ryzyk własnej strony)
Uzupełnia:       mod-shared-neg-strategia.md (negocjacje po ocenie DA)
Poprzedza:       HYBRID-VALIDATION (przy generowaniu dokumentu)
Uruchamia:       mod-spojnosc-odeslan.md (jeśli Kategoria 4 wykryła błędy)
Wzbogaca:        mod-shared-wykladnia.md (Kategoria 2 — niejednoznaczności)
```

---

*Moduł: mod-shared-devil-advocate.md · v1.0 · Analizator Umów v1.6*
*Trigger: po analizie + przed wysłaniem | frazy: red team / perspektywa 2. strony*
*Weryfikacja: isap.sejm.gov.pl · rejestr.uokik.gov.pl · eur-lex.europa.eu*
