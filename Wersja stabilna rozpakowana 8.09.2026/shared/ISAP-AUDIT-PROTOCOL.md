# ISAP-AUDIT-PROTOCOL — protokół aktualności prawa

**Data wdrożenia:** 2026-05-28
**Aktualizacja:** 2026-09-14 (v1.1) — zniesiona wyłączność ISAP; katalog RZĘDU 1
zgodny z `shared/HIERARCHIA-ZRODEL.md` v1.7 i `shared/PRAWO-HARDGATE.md` v2.5.

> ⛔ HARD GATE — wczytaj view shared/PRAWO-HARDGATE.md przed pierwszym przepisem w każdej odpowiedzi.

## Zasada nadrzędna

Nie wolno powoływać przepisów, numerów Dz.U., dat wejścia w życie ani statusów aktów prawnych z pamięci modelu. Dopuszczalne źródła dla polskich aktów prawnych — publikatory urzędowe RZĘDU 1:

- `isap.sejm.gov.pl` — priorytet co do mocy
- `eli.gov.pl` — urzędowy portal ELI dla Dz.U., równorzędny co do mocy
- `api.sejm.gov.pl/eli/...` — warstwa strukturalna (Dz.U. i M.P.)
- `dziennikustaw.gov.pl`, `monitorpolski.gov.pl` — ten sam publikator, inny gospodarz
- `dziennikiurzedowe.gov.pl` — dzienniki resortowe i wojewódzkie (akty prawa miejscowego)

⛔ Osiągalność ≠ moc. Który z tych hostów odpowiada w danym środowisku i w
którym kanale (`web_fetch` / wykonanie kodu) — rozstrzyga tabela kanałów w
`shared/HIERARCHIA-ZRODEL.md`. Nie zakładaj dostępności żadnego z nich;
zmierz ją. ⛔ Źródła komercyjne (lexlege, prawo.pl, arslege) NIE należą do
RZĘDU 1 i nie zastępują publikatora.

## Sekwencja obowiązkowa

1. Ustal dziedzinę prawa i właściwy tryb.
2. Wczytaj lokalny moduł dziedzinowy.
3. Wczytaj `shared/ISAP-METRYKI-AKTOW.md`.
4. Jeżeli akt występuje w rejestrze — użyj go jako punktu startowego, ale przy cytowaniu przepisu sprawdź tekst w publikatorze RZĘDU 1.
5. Jeżeli aktu nie ma w rejestrze — oznacz `BRAK METRYKI` i sprawdź publikator RZĘDU 1 przed odpowiedzią.
6. Dla zdarzeń przeszłych sprawdź brzmienie historyczne na datę zdarzenia.
7. Dla ustaw oczekujących na wejście w życie sprawdź przepisy przejściowe i daty wejścia w życie.

## Zakaz

Nie wolno pisać: „zgodnie z aktualnym brzmieniem” bez wskazania, że brzmienie zostało zweryfikowane w publikatorze RZĘDU 1 albo że wymaga sprawdzenia.

## Format metryki w odpowiedzi lub piśmie

```text
Akt: [pełna nazwa]
Źródło: [ISAP / eli.gov.pl / api.sejm.gov.pl ELI / inny publikator RZĘDU 1]
Kanał: [web_fetch / kod (curl) / konektor MCP]
Tekst: tekst jednolity / tekst ujednolicony
Dz.U.: [pozycja]
Stan weryfikacji: [data]
Zastrzeżenie: [brzmienie na datę zdarzenia / przepisy przejściowe]
```

Znacznik śladu w treści pozostaje bez zmian: `✅ [VER: źródło, data]`.
