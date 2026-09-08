# CHANGELOG — prawo-polskie-v2

- 6.8 (2026-09-01i, flaga F-155): **propagacja trzech korekt tekstów jednolitych do mapy
  centralnej.** Ustawa o świadczeniu wspierającym: Dz.U. 2023 poz. 1429 → **Dz.U. 2026 poz. 873 t.j.**;
  ustawa o wyrobach medycznych (dwa wiersze, w tym jeden z adnotacją „zweryfikuj t.j. na ISAP"):
  → **Dz.U. 2024 poz. 1620 t.j.**; ustawa „Aktywny Rodzic": zapis „brak dotąd ogłoszonego t.j.,
  cytować jako Dz.U. 2024 poz. 858 ze zm." był NIEAKTUALNY, a poz. **2026.532** figurowała tam
  BŁĘDNIE wśród nowelizacji — to obwieszczenie z 27.03.2026 ogłaszające tekst jednolity
  ✅ [VER: api.sejm.gov.pl/eli, 2026-09-01]. Wykryte przeglądem 16 map w żywym ELI; T3 wyłapał
  rozjazd mapy lokalnej z centralną po poprawieniu map dziedzinowych.
- 6.7 (2026-08-28) — domknięto F-108 do **52/52 B+/COV**: centralny routing wskazuje current-state indeksy KW, SUS, ustawy zasiłkowej i zwolnień grupowych; KW otrzymał także fizyczny moduł brakującego zakresu art. 65–69. `COV` pozostaje rozdzielone od `FULL`, a konkretna jednostka nadal podlega fresh/temporal gate.

- 6.6 — F-108 P1: zarejestrowano osobne moduły UFG/PBUK, opłat w sprawach karnych i fundacji rodzinnej; rozdzielono błędnie połączone metryki KC (Dz.U. 2026 poz. 795) i ustawy UFG/PBUK (Dz.U. 2026 poz. 783). (2026-08-27)

- 6.5 — F-108/46: rejestracja modułu DR-02; historycznych liczników nie przedstawia się jako pomiaru aktualnego pokrycia. (2026-08-27)

- 6.4 (2026-08-26): skorygowano fałszywe metryki PUSA (`2024/1297` →
  `2024/1267`), POŚ (`2026/670`, akt OOŚ → `2025/647` t.j. POŚ), Prawa
  lotniczego i ustawy o timeshare; dodano routing zakresów F-86.
- 6.3 (2026-08-26): zsynchronizowano ROUTING-MAP z aktualnymi tekstami
  jednolitymi i centralną mapą Dz.U.; usunięto luki wykryte przez T11.

> Lokalizacja kanoniczna historii wersji tego skilla (ZASADA 15 w
> `audyt-systemu-v4/SKILL.md`). Plik założony 2026-08-23g przy okazji naprawy
> F-123 — skill był na wersji 6.1 bez żadnego pliku historii i bez pola
> `changelog:` w YAML.
>
> ⛔ **LUKA JAWNA — wersje 1.x–6.1 NIE zostały odtworzone.** Nie ma ich w żadnym
> pliku tego skilla; jedynym śladem jest `audyt-systemu-v4/references/AUDIT-JOURNAL.md`.
> Odtwarzanie ich z pamięci byłoby zmyślaniem — dokładnie ten błąd, który w sesji
> 2026-08-20z3 (F-102) groził dopisaniem pięciu nieistniejących wpisów do
> `pisma-procesowe-v3`. Kto potrzebuje historii sprzed 6.2: `grep -n "prawo-polskie-v2"
> audyt-systemu-v4/references/AUDIT-JOURNAL.md`.

- 6.2 (2026-08-23g, sesja audytowa audyt-systemu-v4, flaga F-123): zapisana
  DECYZJA o zakresie `shared/PRAWO-HARDGATE.md` w tym skillu. Rozstrzygnięcie
  rozdzielne: `SKILL.md` — bramka NIE obowiązuje (czysta fasada routingu, nie
  twierdzi nic o treści prawa, bramka odpala się w DR-skillu, w którym przepis
  faktycznie pada); `ROUTING-MAP.md` — podlega reżimowi mapy (FAZA 3 A–D +
  ZASADA 8 + REGUŁA 3), bo nosi numery i statusy Dz.U., czyli weryfikowalne
  twierdzenia o stanie prawnym, a błędny numer propaguje się w każdą sprawę
  przechodzącą przez ten routing (klasa F-82). Dopisany wyzwalacz wygaśnięcia
  decyzji: pierwsze twierdzenie o TREŚCI prawa w którymkolwiek pliku skilla
  przywraca obowiązek bramki. Powód zapisania decyzji, a nie samego jej
  podjęcia: bez utrwalenia ten sam pomiar `grep` wracałby jako nowe zgłoszenie
  w każdym kolejnym audycie. Przy okazji: stopka przestała nieść własny numer
  wersji (niosła „5.2" przy `version: 6.1` — rozjazd o dziewięć wersji),
  zgodnie z decyzją generalną F-102(C); `version` ujęty w cudzysłów
  (profilaktyka pułapki float, F-102(B)). Pełny opis:
  `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23g.
