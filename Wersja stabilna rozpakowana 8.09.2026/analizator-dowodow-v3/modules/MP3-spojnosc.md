# M3 — Spójność, sprzeczności i technika krzyżowa

## Cel
Wykryć rozbieżności między dokumentami, wersjami zdarzeń, datami, kwotami, narracją i pominięciami.

## 3.1 Typy kolizji

- `[DATE]` — data;
- `[KWOTA]` — kwota;
- `[OSOBA]` — osoba/podmiot;
- `[FAKT]` — wersja zdarzenia;
- `[DOWOD]` — inny dokument lub inna treść dowodu;
- `[POMIN]` — pominięcie istotnego faktu;
- `[SEM]` — różnica znaczeniowa;
- `[LOG]` — sprzeczność logiczna;
- `[PROC]` — sprzeczność procesowa;
- `[INTENCJA]` — niespójność celu lub motywu.

## 3.2 Karta kolizji

```text
[KOL001]
Zdarzenie:
Typ kolizji:
Wersja A:
  Treść:
  Źródło:
  Strona:
Wersja B:
  Treść:
  Źródło:
  Strona:
Czy mogą być jednocześnie prawdziwe: tak / nie / częściowo
Powaga: krytyczna / istotna / marginalna
Najbardziej prawdopodobna przyczyna:
Znaczenie procesowe:
Pytanie do świadka / strony:
Dokument potrzebny do rozstrzygnięcia:
```

## 3.3 Analiza wewnętrzna jednego pisma

Sprawdź:

- czy wnioski wynikają z faktów;
- czy ta sama osoba jest opisywana spójnie;
- czy daty tworzą logiczną sekwencję;
- czy roszczenie kwotowe zgadza się z wyliczeniem;
- czy podstawa prawna pasuje do żądania;
- czy pismo nie zawiera twierdzeń wzajemnie wykluczających się.

## 3.4 Technika semantyczna

Porównuj nie tylko słowa, lecz sens:

```text
Pismo A mówi:
Pismo B mówi:
Różnica słowna:
Różnica znaczeniowa:
Czy zmienia ciężar dowodu:
Czy zmienia ocenę winy / bezprawności / szkody:
Jak użyć na rozprawie:
```

## 3.5 Linia czasu porównawcza

```text
Data | Wersja powoda | Wersja pozwanego | Dokument | Kolizja | Znaczenie
```

## 3.6 Reguły oceny

- Kolizja kwot jest zawsze co najmniej istotna.
- Kolizja dat > 7 dni wymaga wyjaśnienia.
- Zmiana wersji bez wyjaśnienia zwiększa ryzyko wiarygodności.
- Pominięcie nie jest automatycznym przyznaniem, ale może być argumentem.
- Sprzeczność między pismem a dowodem ma pierwszeństwo analityczne przed sprzecznością retoryczną.
