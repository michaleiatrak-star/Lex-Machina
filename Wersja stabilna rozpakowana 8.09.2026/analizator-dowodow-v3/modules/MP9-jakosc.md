# M9 — Kontrola jakości, antyhalucynacja i audyt analizy

## Cel
Sprawdzić, czy analiza jest procesowo bezpieczna, źródłowa i kompletna —
włącznie z modułem syntezy faktycznej MP13, gdy był uruchomiony.

---

## 9.1 Test źródła

Każde twierdzenie w raporcie oznacz:

- `ŹRÓDŁO` — wynika bezpośrednio z dokumentu;
- `WNIOSKOWANIE` — wynika logicznie z kilku faktów;
- `HIPOTEZA` — wymaga weryfikacji;
- `PRAWO` — wymaga podstawy prawnej;
- `ORZECZNICTWO` — wymaga realnej sygnatury i źródła.

---

## 9.2 Lista kontrolna — analiza podstawowa

```text
□ Czy każdy fakt ma źródło (ID z M1)?
□ Czy cytaty są dosłowne?
□ Czy oddzielono fakty od ocen?
□ Czy wskazano najmocniejszy argument przeciwnika?
□ Czy wskazano słabe punkty użytkownika?
□ Czy oceniono ciężar dowodu?
□ Czy wskazano braki dowodowe?
□ Czy przepisy wymagające aktualności oznaczono do weryfikacji w ISAP?
□ Czy orzeczenia nie zostały wymyślone (weryfikacja przez orzeczenia-sadowe-v2)?
□ Czy każdy cytat z orzeczenia/interpretacji ma lokalizację (s./teza/pkt) i kotwicę gdy możliwa (Zasada 2B, orzeczenia-sadowe-v2)?
□ Czy końcowa rekomendacja jest operacyjna?
□ Czy terminy krytyczne (< 14 dni) są oznaczone alertem w M12?
```

---

## 9.3 Lista kontrolna — synteza faktyczna MP13

Wypełnij, gdy MP13 był uruchomiony:

```text
□ Czy każdy łańcuch faktyczny (MP13 sekcja 13.2) jest zakorzeniony
  w ID faktów z M1 (nie w ogólnych twierdzeniach)?

□ Czy każdy łańcuch ma wskazane najsłabsze ogniwo i ripostę?
  Łańcuchy bez słabości = niekompletne → uzupełnij.

□ Czy zbieżności (MP13 sekcja 13.3) zawierają alternatywną interpretację
  (jak przeciwnik rozbije zbieżność)?

□ Czy narracja procesowa istnieje w wersji własnej I wersji przeciwnika?
  Narracja jednowersyjna = niedopuszczalna.

□ Czy fakty szkodliwe (MP13 sekcja 13.6) mają przypisaną strategię
  neutralizacji i ocenę ryzyka?
  Fakt oznaczony [RYZYKO-NARRACYJNE] bez neutralizacji = defekt krytyczny.

□ Czy test spójności narracyjnej (MP13 sekcja 13.7) został przeprowadzony?
  Wynik: SPÓJNA / CZĘŚCIOWO SPÓJNA / NIESPÓJNA

□ Czy blok [BLOK-MP13→M7] został skonsumowany przez M7?
  Brak integracji = analiza procesowo niekompletna.

□ Czy powiązania narracyjne bez źródła są oznaczone [H-ŁAŃCUCH]?

□ Czy zbieżność słabych faktów nie jest prezentowana jako substytu
  silnego dowodu bez jawnego zastrzeżenia?
```

---

## 9.4 Test czerwonego zespołu

Zadaj pytania:

1. Co w tej analizie zaatakowałby najlepszy pełnomocnik przeciwnika?
2. Który wniosek jest najsłabiej udowodniony?
3. Czy istnieje niewygodna alternatywna interpretacja faktów?
4. Czy jakieś żądanie jest zawyżone albo źle skonstruowane?
5. Czy sąd może uznać część materiału za emocjonalną narrację bez dowodu?
6. **(MP13)** Czy łańcuch faktyczny wytrzyma krzyżowe pytanie sądu:
   „Skąd wiemy, że A powoduje B?"
7. **(MP13)** Czy narracja procesowa jest spójna z każdym dowodem w aktach
   — czy któryś dowód jej zaprzecza?

---

## 9.5 Wynik audytu

```text
Status analizy: gotowa / warunkowo gotowa / wymaga uzupełnienia
Największy defekt:
Najpilniejsze uzupełnienie:
Ryzyko halucynacji: niskie / średnie / wysokie
Ryzyko procesowe: niskie / średnie / wysokie

[MP13] Test spójności narracyjnej: SPÓJNA / CZĘŚCIOWO SPÓJNA / NIESPÓJNA
[MP13] Łańcuchy bez słabości (do uzupełnienia):
[MP13] Fakty szkodliwe bez neutralizacji (do uzupełnienia):
[MP13] Status bloku BLOK-MP13→M7: skonsumowany / pominięty / MP13 nie uruchomiony
```
