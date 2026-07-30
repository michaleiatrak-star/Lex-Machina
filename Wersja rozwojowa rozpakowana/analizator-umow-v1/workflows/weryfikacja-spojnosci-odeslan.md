# WORKFLOW: Weryfikacja spójności odesłań i powiązań
## Analizator Umów v1 · workflows/weryfikacja-spojnosci-odeslan.md

> Reguły globalne: `references/generator/rdzen-generowania.md` (R1–R7) przy
> generowaniu; przy analizie dokumentu istniejącego stosuj HARD GATE globalny
> z SKILL.md. Ten workflow dotyczy OBU trybów — analizy i generowania.

Dedykowany dwuetapowy workflow do wykrywania **błędów odesłań i niespójności
wewnętrznych** w długich umowach/regulaminach/statutach (typowo 15+ stron).
Adresuje znane ograniczenie modeli językowych: dobre czytanie każdego
paragrafu osobno, gorsze śledzenie **relacji między odległymi fragmentami**
(efekt *attention dilution* w długim kontekście — nie znika nawet przy dużych
oknach kontekstowych).

## Kiedy uruchomić ten workflow

**Automatycznie**, gdy spełnione co najmniej dwa z poniższych:
- dokument > 15 stron lub > 5 000 słów,
- > 15 paragrafów/§,
- > 10 odesłań międzyparagrafowych („§ X ust. Y"),
- > 3 niespójności wykryte we wstępnym przebiegu analizy/generowania,
- słowa kluczowe sygnalizujące złożoność: „Załącznik", „z zastrzeżeniem",
  „powyższe", „wskazane w", „stosuje się odpowiednio".

**Na żądanie:** *„sprawdź odesłania w tej umowie"*, *„czy paragrafy się
zgadzają"*, *„sprawdź spójność wewnętrzną"*, *„czy nie ma błędów w numeracji"*.

**Punkty wejścia w tym systemie:**
- Jako etap końcowy `workflows/generator-umowy.md` KROK 5 / analogicznie w
  pozostałych generatorach — przed BRAMKĄ 5 (HYBRID-VALIDATION).
- Jako dodatkowy krok w trybie ANALIZA (Moduł F w `mod-core-checklist.md`) —
  uruchom po Module B (analiza klauzul), przed Modułem F (raport końcowy).
- Standalone, na żądanie użytkownika.

## Dlaczego dwuetapowość

Rozwiązanie: **rozdzielenie inwentaryzacji od weryfikacji.**
- **PASS 1** — czysta lista, bez analizy. Wymusza pełne przejście przez
  dokument bez przedwczesnego wnioskowania.
- **PASS 2** — weryfikacja pojedyncza, każde odesłanie osobno, w tabeli
  wymuszającej eksplicytne sprawdzenie (nie poleganie na pamięci kontekstowej).

---

## PASS 1: INWENTARYZACJA

### Krok 1.1 — struktura dokumentu

Wypisz wszystkie paragrafy/§ z krótkim opisem (max 1 zdanie) + załączniki.

```
### Paragrafy
| § | Tytuł | Liczba ustępów | Krótki opis |
|---|---|---|---|
### Załączniki
| Nr | Tytuł | Wzmiankowany w § | Obecny w pakiecie? |
```

### Krok 1.2 — odesłania (3 kategorie)

- **A. Jednoznaczne** — „§ X", „§ X ust. Y", „Załącznik nr X".
- **B. Semantyczne** — „powyższe postanowienia", „niniejszy paragraf",
  „z zastrzeżeniem § X", „stosuje się odpowiednio".
- **C. Do definicji** — terminy z Wielkiej Litery, z liczbą wystąpień każdego.

### Krok 1.3 — definicje

Wypisz wszystkie zdefiniowane terminy z lokalizacją definicji i skrótem
treści.

### STOP 1 — potwierdzenie inwentaryzacji

> *„Inwentaryzacja zakończona. Czy lista załączników jest kompletna? Czy są
> dokumenty, które powinienem uwzględnić, a których nie widzę? Przechodzimy
> do weryfikacji (Pass 2)?"*

---

## PASS 2: WERYFIKACJA

### Krok 2.1 — odesłania jednoznaczne

Dla każdego odesłania z tabeli A: czy cel istnieje? treść celu (skrót)?
pasuje do kontekstu użycia? status (✅ OK / 🔴 błąd / ⚠️ do potwierdzenia).

### Krok 2.2 — odesłania semantyczne

Dla każdego: co konkretnie oznacza „powyższe"/„niniejszy" w tym miejscu?
Czy jest jednoznaczne z perspektywy strony podpisującej (nie tylko autora)?

### Krok 2.3 — definicje: zdefiniowane vs użyte

Terminy zdefiniowane, ale nieużywane („zombie") → kandydaci do usunięcia.
Terminy używane z Wielkiej Litery, ale niezdefiniowane → brak w § Definicje,
uzupełnić.

### Krok 2.4 — spójność kwotowa, datowa, terminologiczna

```
### Kwoty i procenty
| Wartość | Miejsca występowania | Spójność |
### Daty i terminy
| Wartość | Miejsca występowania | Spójność |
### Terminologia i nazwy stron
| Termin | Lokalizacje | Spójność |
```

---

## RAPORT KOŃCOWY

```
### Statystyki
- Paragrafów: N · Załączników: N (w pakiecie: M, niejasnych: K)
- Odesłań jednoznacznych: N (OK: X, błędów: Y, do potwierdzenia: Z)
- Terminów zdefiniowanych: N (używanych: X, „zombie": Y)
- Terminów używanych niezdefiniowanych: N

### KRYTYCZNE BŁĘDY (🔴) — wymagają natychmiastowej korekty
1. [lokalizacja] — [opis błędu] — **Korekta:** [konkretne brzmienie]

### OSTRZEŻENIA (⚠️) — do potwierdzenia z autorem/klientem
1. [lokalizacja] — [opis]

### MAŁE NIESPÓJNOŚCI (do uporządkowania)
1. [opis]
```

**STOP.** Zapytaj: *„Raport gotowy. Przechodzimy do poprawy krytycznych
błędów (wskaż konkretne brzmienie zamiennika), czy najpierw przedyskutujemy
ostrzeżenia?"*

## Tryb skrócony (dokumenty < 15 stron)

Jeden krok, bez STOP-ów: tabela odesłań (5 kolumn) + lista definicji
zdefiniowane/użyte + lista niespójności kwotowych/terminologicznych.

## Anti-patterny, które ten workflow wykrywa (typowe błędy dokumentów edytowanych etapowo)

1. Renumeracja po edycji — dodano ustęp, nie przenumerowano odesłań gdzie indziej.
2. Usunięcie paragrafu z pozostawionym odesłaniem do niego gdzie indziej.
3. Definicja zmieniła nazwę w § 1, ale stara nazwa została w dalszej treści.
4. Wartość liczbowa zmieniona tylko w jednym miejscu (np. przy negocjacjach).
5. Załącznik wymieniony, ale nieobecny w pakiecie / obecny, ale niewymieniony.
6. Puste pole odesłania „zgodnie z § ___" — zapomniano uzupełnić po szablonie.
7. Odesłania cykliczne lub sprzeczne.
8. Odesłanie do ustępu oznaczonego „(uchylony)" lub usuniętego.
9. Niespójność daty wstecznej/przyszłej (typowy błąd kopiowania szablonu).

## Kiedy sam ten skill nie wystarczy — narzędzie RAG jako uzupełnienie

Dla dokumentów **30+ stron z bardzo gęstą siecią odesłań** nawet dwuetapowa
procedura może przepuścić błędy — z powodu architektonicznego: long context w
jednym oknie rozmowy nie ma jednolitej „uwagi", podczas gdy narzędzia oparte
na retrieval (np. NotebookLM) indeksują dokument na fragmenty i przy każdym
pytaniu dostają skoncentrowany kontekst wokół konkretnego odesłania.

**Kiedy zasugerować takie narzędzie użytkownikowi:**
- dokument > 30 stron lub > 30 odesłań międzyparagrafowych,
- > 5 załączników z licznymi odesłaniami z treści głównej,
- dokument był wielokrotnie edytowany w rundach negocjacyjnych (wysokie
  ryzyko renumeracji),
- pojawiło się podejrzenie, że ten workflow nie wykrył wszystkiego (np.
  użytkownik ręcznie zauważył niespójność spoza raportu).

Zasugerowane pytania do takiego narzędzia (2–3 wywołania, bo pytania o
spójność globalną wymagają dekompozycji przy architekturze RAG): (1) wymień i
zweryfikuj wszystkie odesłania międzyparagrafowe, (2) wymień terminy z
Wielkiej Litery i sprawdź, czy każdy jest zdefiniowany, (3) sprawdź spójność
kwot/dat/terminologii między preambułą, treścią i załącznikami. Wynik wraca
do tego skilla do syntezy z niniejszym raportem i przygotowania listy
poprawek z konkretnym brzmieniem zamienników.
