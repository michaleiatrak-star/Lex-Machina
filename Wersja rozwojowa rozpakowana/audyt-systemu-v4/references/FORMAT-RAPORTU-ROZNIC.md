# FORMAT-RAPORTU-ROZNIC.md
## SYNC-DZU-AUTOMATYCZNY.md — jak czytać i przetwarzać raport w sesji audytowej

Raport generowany przez `scripts/sync_dzu_eli.py` to plik `.md` z tabelą o
kolumnach: `Identyfikator | Tytuł | Data publikacji | Już w mapie? | Akcja
sugerowana`.

## Jak sesja audyt-systemu-v4 FAZA 3 ma z niego korzystać

1. **Wczytaj raport zamiast zaczynać przeszukiwanie od zera** — to zastępuje
   ręczne budowanie listy "co mogło się zmienić", nie zastępuje samej weryfikacji.
2. Dla wierszy **"Już w mapie? = TAK"**: to sygnał możliwej nowelizacji/nowego
   tekstu jednolitego aktu, który system już zna. Otwórz ISAP, sprawdź czy
   pozycja rzeczywiście dotyczy tego aktu (a nie np. innej ustawy publikowanej
   pod zbliżoną datą — patrz historyczne przypadki fałszywych alarmów w
   AUDIT-JOURNAL, np. 4.16/4.15), i zaktualizuj `mapa_dzu` zgodnie ze
   standardową procedurą (str_replace na kopii + wpis w journalu).
3. Dla wierszy **"Już w mapie? = NIE"**: oceń, czy akt wchodzi w zakres
   któregoś DR-skilla (użyj `prawo-polskie-v2/ROUTING-MAP.md` jako punktu
   odniesienia). Jeśli tak — dodaj jako nową pozycję po weryfikacji w ISAP.
   Jeśli nie dotyczy żadnej aktywnej dziedziny systemu — odnotuj i pomiń
   (nie każdy nowy akt wymaga reakcji, np. akty o wąskim zakresie
   niewystępującym w typowych sprawach obsługiwanych przez system).
4. **Nigdy nie traktuj tego raportu jako już zweryfikowanego** — to lista
   kandydatów do sprawdzenia, wygenerowana automatycznie z publicznego API,
   bez interpretacji prawnej. Interpretacja i decyzja pozostają manualne.
5. Po zakończeniu przeglądu raportu — wpis w `AUDIT-JOURNAL.md` powinien
   wprost wskazywać, że dana sesja korzystała z raportu automatycznego
   (dla przejrzystości metodologicznej, odróżnienia od czysto ręcznego
   przeszukania jak w sesjach 2026-07-04b…j).

## Przykład nagłówka wpisu w AUDIT-JOURNAL po użyciu tego raportu

```
## AUDYT-2026-MM-DD — Weryfikacja Dz.U. na podstawie raportu automatycznego
SYNC-DZU-AUTOMATYCZNY.md (raport z DD.MM.RRRR, N nowych pozycji, M do
weryfikacji ręcznej, K pominiętych jako nieistotne)
```
