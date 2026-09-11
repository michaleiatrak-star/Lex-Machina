# CHANGELOG — dr-10-zdrowie-farmacja-zywnosc-rolnictwo

- 3.42 (2026-09-10o, F-181): BLAD PODMIANY AKTU w mod-ustawa-pielegniarka-polozna: wiersz kierowal do Dz.U. 2025 poz. 450, a to t.j. ustawy o DZIALALNOSCI LECZNICZEJ; wlasciwy t.j. ustawy o zawodach pielegniarki i poloznej to 2026/15 (KROK 2C: 3 nowelizacje). Ponadto ARiMR 2025/1363 na 2026/942
- 3.41 (2026-09-10j): mod-ustawa-diagnostyka-laboratoryjna: podstawą jest USTAWA O MEDYCYNIE LABORATORYJNEJ (15.09.2022), t.j. Dz.U. 2025 poz. 1295 ✅ RZĄD 1; ustawa z 27.07.2001 o diagnostyce laboratoryjnej jest UCHYLONA — powołanie jej jest błędem podstawy prawnej
- 3.40 (2026-09-10h): mod-PrFarm-refundacja-nadzor-sankcje: nowa sekcja ŹRÓDŁO WYKAZU (który lek, jaka odpłatność, dla kogo) — obwieszczenie MZ z art. 37 ust. 1 ustawy refundacyjnej, Dziennik Urzędowy MZ jako RZĄD 1 (⛔ SPA), załączniki XLSX na gov.pl jako jedyny przetwarzalny wariant, ostrzeżenie że api.nfz.gov.pl zwraca statystykę a nie wykaz, oraz że poziom odpłatności bez limitu finansowania nie wystarcza do podania kwoty. BŁĄD SKORYGOWANY: nagłówek modułu podawał ustawę refundacyjną jako Dz.U. 2025 poz. 907 (wygaśnięcie aktu), treść 2026/253 — moduł sam sobie przeczył; propagacja do 3 dalszych miejsc
- 3.39 (2026-09-01i, flaga F-155): **jedna pozycja MAPA-AKTOW wskazywała akt
  pierwotny zamiast obowiązującego tekstu jednolitego** — ustawa o wyrobach
  medycznych: Dz.U. 2022 poz. 974 → **Dz.U. 2024 poz. 1620 t.j.**
  ✅ [VER: api.sejm.gov.pl/eli, 2026-09-01]. Numer pierwotny zachowany w nawiasie.
  Pozostałe 25 pozycji mapy: numer i status potwierdzone, t.j. aktualne.
  ⚠️ Odnotowane, nieusunięte: 19 pozycji tej mapy ma nowelizacje ogłoszone PO
  dacie t.j. (najwięcej ze wszystkich DR) — zakres flagi F-156.
- 3.38 (2026-08-26): zsynchronizowano licznik istniejących modułów 32/32.
- 3.37 (2026-08-26): ujednolicono metryki aktów medycznych, farmaceutycznych,
  praw pacjenta, wyrobów medycznych oraz samorządu pielęgniarek i położnych.
