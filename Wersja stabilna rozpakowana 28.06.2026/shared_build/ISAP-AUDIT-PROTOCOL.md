# ISAP-AUDIT-PROTOCOL — protokół aktualności prawa

**Data wdrożenia:** 2026-05-28

> ⛔ HARD GATE — wczytaj view /mnt/skills/user/shared/PRAWO-HARDGATE.md przed pierwszym przepisem w każdej odpowiedzi.

## Zasada nadrzędna

Nie wolno powoływać przepisów, numerów Dz.U., dat wejścia w życie ani statusów aktów prawnych z pamięci modelu. Dopuszczalne źródło dla polskich aktów prawnych: `isap.sejm.gov.pl`.

## Sekwencja obowiązkowa

1. Ustal dziedzinę prawa i właściwy tryb.
2. Wczytaj lokalny moduł dziedzinowy.
3. Wczytaj `shared/ISAP-METRYKI-AKTOW.md`.
4. Jeżeli akt występuje w rejestrze — użyj go jako punktu startowego, ale przy cytowaniu przepisu sprawdź tekst w ISAP.
5. Jeżeli aktu nie ma w rejestrze — oznacz `BRAK METRYKI ISAP` i sprawdź ISAP przed odpowiedzią.
6. Dla zdarzeń przeszłych sprawdź brzmienie historyczne na datę zdarzenia.
7. Dla ustaw oczekujących na wejście w życie sprawdź przepisy przejściowe i daty wejścia w życie.

## Zakaz

Nie wolno pisać: „zgodnie z aktualnym brzmieniem” bez wskazania, że brzmienie zostało zweryfikowane w ISAP albo że wymaga sprawdzenia.

## Format metryki w odpowiedzi lub piśmie

```text
Akt: [pełna nazwa]
Źródło: ISAP
Tekst: tekst jednolity / tekst ujednolicony
Dz.U.: [pozycja]
Stan weryfikacji: [data]
Zastrzeżenie: [brzmienie na datę zdarzenia / przepisy przejściowe]
```
