# CHANGELOG — prawo-polskie-v2

- 6.15 (2026-09-10j): ROUTING-MAP:685 — nazwa i łańcuch przepisane po wykryciu DWÓCH PODMIAN AKTU (2022/2162 opisane jako nowa ustawa o medycynie laboratoryjnej, a jest t.j. STAREJ ustawy z 2001; 2023/1517 opisane jako stara ustawa, a jest rozporządzeniem MSWiA)
- 6.14 (2026-09-10i): ROUTING-MAP:646 — PODWÓJNY BŁĄD skorygowany: wiersz delegowania kierowców twierdził „brak t.j." i opisywał Dz.U. 2025 poz. 797 jako nowelizację; 2025/797 JEST tekstem jednolitym tej ustawy (✅ RZĄD 1)
- 6.13 (2026-09-10h): ROUTING-MAP: wiersz ustawy refundacyjnej uzupełniony o KROK 2C (Dz.U. 2026 poz. 791) i o wskazanie kanałów wykazu leków refundowanych — wykaz NIE jest aktem Dz.U.
- 6.12 (2026-09-10g): ROUTING-MAP — wiersz „POŚ Szczegóły" rozstrzygnięty; zakres modułu ustalony jako warstwa proceduralna, akty (UOOŚiS 2026/670, POŚ 2025/647, ochrona przyrody 2026/13, KK 2025/383, KPA 2025/1691) zweryfikowane w RZĘDZIE 1 z listami nowelizacji po tekstach jednolitych
- 6.11 (2026-09-10f): ROUTING-MAP: domknięte 13 pozycji oznaczonych do weryfikacji po odczycie RZĄD 1. TRZECI BŁĄD PODMIANY AKTU skorygowany — „ustawa antylichwiarska Dz.U. 2023 poz. 1028" to wygasły t.j. ustawy o KREDYCIE KONSUMENCKIM; poprawnie Dz.U. 2022 poz. 2339. Zamknięty sygnał ❌ NUMER BŁĘDNY przy KPK. Antymobbingowa 2026/1046 podniesiona z RZĘDU 2B do RZĘDU 1. Dopisane listy nowelizacji po tekście jednolitym (KK 4, KPK 5, VAT 5, antykorupcyjna 2, trzeźwość 2, UDIP 1, łowieckie 1, zarządzanie kryzysowe 1)
- 6.10 (2026-09-10e): ROUTING-MAP: +2 wiersze (przekształcenie UW 2005 i 2018) oraz nowa sekcja nagłówkowa KOLEJNOŚĆ AKTUALIZACJI REJESTRÓW — praca idzie od źródła urzędowego przez mapę zbiorczą do modułów DR, przy zachowaniu zakazu traktowania ROUTING-MAP jako źródła weryfikacji (F-141)
- 6.9 (2026-09-10d, F-148a/F-135/F-141): ROUTING-MAP: 9 wierszy rozstrzygniętych w RZĘDZIE 1 (F-135, F-141), 1 błąd podmiany aktu skorygowany (F-148a: ustawa antyterrorystyczna 2024/1474 → 2025/194)
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
