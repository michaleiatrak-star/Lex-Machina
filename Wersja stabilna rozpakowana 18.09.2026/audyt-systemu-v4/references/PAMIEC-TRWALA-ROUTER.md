# PAMIĘĆ TRWAŁA ROUTERA — synchronizacja krytycznego kontraktu

## Trigger

Wykonaj wyłącznie po wyborze pozycji 13 menu albo poleceniu „zsynchronizuj
pamięć routera”. Zmiana `version:` routera jedynie uruchamia propozycję
resynchronizacji; nie upoważnia do cichego zapisu.

## Zasób i granice

- Cel: `/preferences.md` lub równoważny zasób trwałych preferencji hosta.
- Modyfikuj tylko sekcję między markerami poniżej.
- Nigdy nie zastępuj całego pliku preferencji.
- Brak natywnego odczytu i edycji pamięci → zgłoś `NIEOBSŁUGIWANE W HOŚCIE`;
  nie symuluj zapisu plikiem roboczym.

## Treść kanoniczna dla routera 3.29

```text
<!-- LEX-MACHINA-ROUTER:START -->
[stated] Przed każdą odpowiedzią prawną faktycznie wczytaj i wykonaj prawny-router-v3/references/SELF-CHECK.md.
[stated] Nie podawaj przepisu, jednostki redakcyjnej, Dz.U., wartości ustawowej ani sygnatury bez świeżej weryfikacji źródłowej w tej samej turze; brak źródła oznacz jawnie jako nieweryfikowany.
[stated] Każdy URL w odpowiedzi prawnej musi mieć znacznik RZĄD 1/2A/2B/3 zgodny z shared/HIERARCHIA-ZRODEL.md.
[stated] Przed analizą wypisz jawny ślad routingu: TRYB, PRIMARY, SECONDARY, ODRZUCONE i wersję routera; deklaracja wczytania wymaga faktycznego odczytu.
[stated] Ostatnim elementem każdej odpowiedzi prawnej jest disclaimer z shared/DISCLAIMER.md.
[stated] Zsynchronizowano z prawny-router-v3 w wersji 3.29.
<!-- LEX-MACHINA-ROUTER:END -->
```

## Procedura

1. Odczytaj świeże `version:` z `prawny-router-v3/SKILL.md`.
2. Odczytaj trwałe preferencje i odszukaj oba markery sekcji.
3. Porównaj numer wersji i treść linia po linii.
4. Pokaż użytkownikowi dokładny diff oraz pełną treść docelową. Zakończ turę
   i poczekaj na akceptację.
5. Po akceptacji:
   - sekcja istnieje → zastąp wyłącznie zakres markerów;
   - sekcji brak → dopisz cały blok na końcu;
   - treść identyczna → nie zapisuj.
6. Ponownie odczytaj preferencje i potwierdź identyczność sekcji.
7. W `AUDIT-JOURNAL.md` zapisz: `utworzono`, `zaktualizowano X→Y`,
   `pominięto — aktualne`, `odmowa` albo `nieobsługiwane w hoście`.

## Antydryft

Jeżeli wersja zapisana w pamięci różni się od wersji routera, oznacz sekcję
jako `NIEAKTUALNA` i zaproponuj resynchronizację. Nie nadpisuj bez zgody.
