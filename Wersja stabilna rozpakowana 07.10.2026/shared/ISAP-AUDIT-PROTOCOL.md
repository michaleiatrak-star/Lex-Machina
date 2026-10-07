# ISAP-AUDIT-PROTOCOL — protokół aktualności prawa

**Data wdrożenia:** 2026-05-28
**Aktualizacja:** 2026-09-23 (v1.2) — kolejność wg KANONU E-1…E-5 (`shared/HIERARCHIA-ZRODEL.md` v1.10): ELI pierwszy, ISAP adres dla człowieka.
**Aktualizacja poprzednia:** 2026-09-14 (v1.1) — zniesiona wyłączność ISAP; katalog RZĘDU 1
zgodny z `shared/HIERARCHIA-ZRODEL.md` v1.7 i `shared/PRAWO-HARDGATE.md` v2.5.

> ⛔ HARD GATE — wczytaj view shared/PRAWO-HARDGATE.md przed pierwszym przepisem w każdej odpowiedzi.

## Zasada nadrzędna

Nie wolno powoływać przepisów, numerów Dz.U., dat wejścia w życie ani statusów aktów prawnych z pamięci modelu. Dopuszczalne źródła dla polskich aktów prawnych — publikatory urzędowe RZĘDU 1, w kolejności użycia (kanon E-1…E-5):

- `api.sejm.gov.pl/eli/...` — **E-1, kanał podstawowy**: brzmienie (`text.pdf` t.j.), metryka, status, zmiany (Dz.U. i M.P.)
- `eli.gov.pl` — urzędowy portal ELI dla Dz.U. (E-1, gdy host nie ma kanału kodu: B-1 → B-2)
- `isap.sejm.gov.pl` — **E-2: adres dla człowieka** i pomocnicza identyfikacja; ta sama moc, ale kanał maszynowy martwy
- `dziennikustaw.gov.pl`, `monitorpolski.gov.pl` — ten sam publikator, inny gospodarz
- `dziennikiurzedowe.gov.pl` — dzienniki resortowe i wojewódzkie (akty prawa miejscowego)

⛔ Osiągalność ≠ moc. Który z tych hostów odpowiada w danym środowisku i w
którym kanale (`web_fetch` / wykonanie kodu) — rozstrzyga tabela kanałów w
`shared/HIERARCHIA-ZRODEL.md`. Nie zakładaj dostępności żadnego z nich;
zmierz ją. ⛔ Źródła komercyjne (LEX/Legalis — E-3; lexlege, prawo.pl, arslege — E-4) NIE należą do
RZĘDU 1 i nie zastępują publikatora; sięga się po nie, gdy aktu nie da się pobrać z RZĘDU 1 (awaria serwera, timeout, blokada, brak kanału) — wtedy obowiązkowo.

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
