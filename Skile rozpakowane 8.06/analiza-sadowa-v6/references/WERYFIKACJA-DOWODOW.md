# WERYFIKACJA-DOWODOW — Rozszerzony Protokół Dwukrotnej Weryfikacji

> Plik referencyjny dla analiza-sadowa-v6.
> Wczytaj gdy: sprawa jest złożona (≥5 dokumentów), raport był kwestionowany,
> wymagana jest szczegółowa dokumentacja procesu weryfikacji dla klienta lub sądu.
> Standardowe protokoły (W1-W4 i O1-O5) są wbudowane w SKILL.md — ten plik je rozszerza.

---

## FILOZOFIA DWUKROTNEJ WERYFIKACJI

Jednorazowe przeczytanie dokumentu prowadzi do dwóch typowych błędów:

**Błąd potwierdzenia (confirmation bias)**
Analityk nieświadomie wyostrza uwagę na fragmenty zgodne z wstępną hipotezą
i pomija fragmenty jej zaprzeczające. Drugie przeczytanie z innym filtrem percepcji
przerywa ten mechanizm.

**Błąd pominięcia kontekstu**
Fragment dokumentu interpretowany bez sąsiadujących akapitów prowadzi do
błędnych wniosków. Drugie przeczytanie z obowiązkiem weryfikacji w pełnym akapicie
eliminuje wyrwanie z kontekstu.

Dwukrotna weryfikacja w v6 jest strukturalnie wbudowana w różne przejścia,
co gwarantuje zmianę perspektywy między pierwszym a drugim przeczytaniem:
- Weryfikacja Pierwsza (Przejście III) → perspektywa adversarialna
- Weryfikacja Ostateczna (Przejście IV) → perspektywa kontroli spójności

---

## WERYFIKACJA PIERWSZA — PROTOKÓŁ ROZSZERZONY

**Kiedy:** Po ukończeniu analizy adversarialnej i modułów V10 (Przejście III).
**Cel:** Skonfrontowanie wniosków analitycznych z dokumentami źródłowymi.
**Perspektywa:** Adversarialna — czytaj jak pełnomocnik przeciwnika.

### W1. Weryfikacja faktów kluczowych

Dla każdego faktu z Mapy Faktycznej, który wpływa na jakikolwiek wniosek:

```
LISTA KONTROLNA W1:
□ Fakt pochodzi z konkretnego dokumentu (nazwa + data + strona/akapit)
□ Data odczytana co do dnia (nie "około", nie "pod koniec X.RRRR")
□ Kwota odczytana co do grosza (nie "ok.", nie "ponad")
□ Podmiot działający zidentyfikowany jednoznacznie (nie "strona", nie "spółka")
□ Fakt nie jest interpretacją lecz opisem zdarzenia
□ Sprawdzono czy ten sam dokument zawiera fragment MODYFIKUJĄCY ten fakt
  → TAK: uwzględnij modyfikację lub zaznacz jako "fakt warunkowy"
  → NIE: fakt zatwierdzony
```

### W2. Weryfikacja sprzeczności V10

Dla każdej zidentyfikowanej sprzeczności (V10-1, V10-3, V10-4):

```
LISTA KONTROLNA W2:
□ Oba pisma przeczytane w całości (nie tylko cytowany fragment)
□ Sprzeczność zachodzi w tym samym zakresie faktycznym
  (nie pozorna sprzeczność terminologiczna)
□ Sprawdzono czy między pismami pojawiły się nowe fakty lub dowody
  uzasadniające zmianę twierdzenia → TAK: sprzeczność pozorna → usuń z listy
□ Sprawdzono czy kontekst cytatu zmienia jego znaczenie
  → TAK: zrewiduj ocenę wagi sprzeczności
□ Waga sprzeczności: Krytyczna/Wysoka/Średnia/Niska — po weryfikacji
```

### W3. Weryfikacja przyznań szkodliwych V10-2

Dla każdego przyznania szkodliwego:

```
LISTA KONTROLNA W3:
□ Cytat odczytany w pełnym akapicie (minimum 3 zdania kontekstu)
□ Strona nie wyjaśniła lub nie odwołała twierdzenia w tym samym piśmie
□ Twierdzenie nie jest odpowiedzią na bezpośrednie pytanie sądu
  (odpowiedź na pytanie sądu ma inną wagę niż spontaniczne przyznanie)
□ Twierdzenie nie jest sformułowaniem ostrożnościowym ("z ostrożności procesowej...")
□ Waga przyznania po weryfikacji: Krytyczna/Wysoka/Średnia/Niska
```

### W4. Rejestr korekt po Weryfikacji Pierwszej

```
FORMAT REJESTRU:
[W4-nr] KOREKTA
  Typ: Fakt / Sprzeczność / Przyznanie / Inny
  Element korygowany: [opis przed korektą]
  Korekta: [opis po korekcie]
  Wpływ na raport: Istotny / Umiarkowany / Kosmetyczny
  Zatwierdzone przez: [analityk] [data]
```

**STATUS WERYFIKACJI PIERWSZEJ:**
```
[ ] Wszystkie fakty kluczowe przeszły W1
[ ] Wszystkie sprzeczności V10 przeszły W2
[ ] Wszystkie przyznania V10-2 przeszły W3
[ ] Rejestr korekt W4 uzupełniony

WYNIK: UKOŃCZONA / WYMAGA UZUPEŁNIENIA [wskaż co]
```

---

## WERYFIKACJA OSTATECZNA — PROTOKÓŁ ROZSZERZONY

**Kiedy:** Po ukończeniu autokorekty P1-P5 (Przejście IV).
**Cel:** Niezależna kontrola raportu końcowego jako całości.
**Perspektywa:** Sędzia — czytaj jak sąd, który nie zna kontekstu.

### O1. Weryfikacja dowodów wpływających na predykcję

Dowody wpływające na predykcję §9 to dowody, bez których wynik byłby inny.
Zidentyfikuj je i przeczytaj po raz drugi.

```
LISTA KONTROLNA O1 (dla każdego dowodu kluczowego):
□ Dowód odczytany w pełnym kontekście dokumentu (cały akapit, nie fragment)
□ Dowód nie jest wyrwany z sekwencji zdarzeń zmieniającej jego znaczenie
□ Sprawdzono czy nie istnieje kolejny akapit lub dokument korygujący ten dowód
□ Dowód ma przypisany poziom hierarchii (A/B/C/D z Filtru #5)
□ Ocena wagi dowodu po ponownym przeczytaniu: bez zmian / zmieniona
  → ZMIENIONA: zaktualizuj §4 i §9 raportu
```

### O2. Weryfikacja pism procesowych — integralność cytowań

```
LISTA KONTROLNA O2 (dla każdego pisma, z którego pochodzi ustalenie kluczowe):
□ Pismo przeczytane w całości (nie tylko wskazane strony)
□ Sprawdzono sekcje pisma pomijane przy pierwszym czytaniu
  (uzasadnienie, powołane dowody, wnioski końcowe)
□ Każde przyznanie V10-2 odczytane w kontekście min. 5 zdań
□ Sprawdzono czy pismo zawiera fragmenty odnoszące się do
  INNYCH pism tej samej strony — mogące modyfikować twierdzenia
□ Chronologia pism potwierdzona: data nadania vs data wpływu do sądu
```

### O3. Weryfikacja spójności raportu

```
LISTA KONTROLNA O3:
□ Executive Summary odzwierciedla wnioski §1-§11 bez sprzeczności
□ Predykcja §9 zakorzeniona wyłącznie w faktach z Przejścia I
  (nie w interpretacjach z Przejścia III, które mogą być spekulatywne)
□ Rekomendacje §10 wynikają logicznie z §4 (dowody) i §5 (słabości)
□ Każdy wniosek ma oznaczony poziom pewności: PEWNE/PRAWDOPODOBNE/WĄTPLIWE/SPEKULATYWNE
□ Brak wewnętrznych sprzeczności między §1-§11
  (np. §3 wskazuje zamiar bezpośredni a §6 wątpliwość co do zamiaru — niezgodność)
□ Moduły specjalistyczne (§8) spójne z ustaleniami §1-§6
```

### O4. Rejestr luk i braków

Udokumentuj wszystkie luki wykryte w obu weryfikacjach:

```
FORMAT REJESTRU LUK:
[O4-nr] LUKA / BRAK
  Typ: Brak dokumentu / Brak dowodu / Fakt niewyjaśniony / Inny
  Opis luki: [czego brakuje]
  Wpływ na predykcję: Istotny / Umiarkowany / Marginalny
  Możliwość uzupełnienia: TAK [sposób] / NIE [dlaczego]
  Uwzględnione w §9 (predykcja): TAK/NIE
```

### O5. Rejestr korekt po Weryfikacji Ostatecznej

```
FORMAT REJESTRU:
[O5-nr] KOREKTA OSTATECZNA
  Element korygowany: [co zmieniono]
  Korekta: [na co zmieniono]
  Wpływ na raport: Istotny / Umiarkowany / Kosmetyczny
  Zatwierdzone przez: [analityk] [data]
```

**STATUS WERYFIKACJI OSTATECZNEJ:**
```
[ ] Wszystkie dowody kluczowe przeszły O1
[ ] Wszystkie pisma procesowe przeszły O2
[ ] Spójność raportu potwierdzona O3
[ ] Rejestr luk O4 uzupełniony
[ ] Rejestr korekt O5 uzupełniony

WYNIK: UKOŃCZONA / WYMAGA UZUPEŁNIENIA [wskaż co]
```

---

## GATE KOŃCOWY

```
GATE — WERYFIKACJA KOMPLETNOŚCI PRZED RAPORTEM KOŃCOWYM

[ ] Weryfikacja Pierwsza (W1-W4): STATUS UKOŃCZONA
[ ] Weryfikacja Ostateczna (O1-O5): STATUS UKOŃCZONA
[ ] Liczba korekt istotnych w obu weryfikacjach łącznie: [n]
    Jeśli n > 5 → rozważ ponowne przeprowadzenie Przejścia I-II
[ ] Luki nierozwiązalne udokumentowane w §9 (predykcja) i §11 (autokorekta)
[ ] Każdy wniosek §1-§11 ma poziom pewności

GATE: RAPORT KOŃCOWY ZATWIERDZONY: TAK / NIE
```

---

## SPECJALNE PRZYPADKI

### Brak możliwości drugiego przeczytania (bardzo obszerny materiał)

Gdy materiał jest zbyt obszerny do dwukrotnego przeczytania w całości:

1. Zidentyfikuj 10-15 dokumentów kluczowych dla predykcji
2. Weryfikację W1-O2 ogranicz do tych dokumentów
3. Zaznacz w raporcie: "Weryfikacja selektywna — materiał obszerny"
4. Udokumentuj które dokumenty nie zostały powtórnie zweryfikowane

### Dokumenty sprzeczne wewnętrznie

Gdy ten sam dokument zawiera sprzeczne twierdzenia:
1. Odczytaj w całości i ustal kontekst każdego twierdzenia
2. Ustal które twierdzenie jest wcześniejsze / bardziej szczegółowe
3. Zaznacz jako "dokument wewnętrznie sprzeczny" z opisem
4. W raporcie wskaż jako sygnał proceduralny (Filtr #9)

### Dokumenty nieczytalne lub częściowo widoczne

1. Udokumentuj jako lukę dowodową w O4
2. Nie spekuluj o treści niewidocznych fragmentów
3. W raporcie zaznacz: "dokument częściowo nieczytelny — wniosek SPEKULATYWNY"

---

## POWIĄZANIA Z MODUŁAMI

- **MOD-A**: Weryfikacja Pierwsza W3 jest rozszerzona przez test Kategorii I MOD-A
- **MOD-C**: Weryfikacja Pierwsza W1 dla nagrania: sprawdź długość, cięcia, kontekst
- **MOD-D**: Weryfikacja Ostateczna O1: przy podwójnej kwalifikacji sprawdź oba dokumenty źródłowe
- **Filtr #11**: P5 autokorekty = uproszczona wersja O3 (spójność). O3 jest rozszerzeniem P5.
