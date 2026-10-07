# COWORK-HARMONOGRAM-NATYWNY.md
## Natywny harmonogram TRYB DZU wewnątrz aplikacji Cowork (bez infrastruktury developera)

status: aktywny, zweryfikowany działającym zadaniem cyklicznym
wprowadzono: 2026-07-13
konsoliduje: funkcję, która ZANIM trafiła tutaj, istniała chwilowo jako
  osobny, samodzielny skill `audyt-dzu-scheduler` — scalone tego samego dnia
  zgodnie z tą samą logiką co konsolidacja z AUDYT-2026-07-13f (protokół/
  narzędzie wspierające TRYB DZU tego skilla, nie samodzielna jednostka
  wywoływana intencją użytkownika → mieszka w references/ + scripts/
  audyt-systemu-v4, nie jako osobny SKILL.md)
różni się od: `references/SYNC-DZU-AUTOMATYCZNY.md` + `references/HARMONOGRAM-CRON.md`
  (ten wariant wymaga własnego serwera/CI developera i api.sejm.gov.pl;
  wariant opisany w tym pliku działa WYŁĄCZNIE wewnątrz aplikacji Cowork,
  bez żadnej zewnętrznej infrastruktury ani kluczy API)

---

## Problem

Użytkownik chce, żeby TRYB DZU uruchamiał się automatycznie raz w tygodniu,
bez potrzeby ręcznego wywoływania za każdym razem — ale nie ma (i nie chce
zakładać) własnego serwera/CI do metody opisanej w SYNC-DZU-AUTOMATYCZNY.md.

## Rozwiązanie: natywny scheduler aplikacji Cowork

Cowork udostępnia narzędzie `mcp__scheduled-tasks__create_scheduled_task`,
które uruchamia PEŁNĄ sesję agentową (z realną weryfikacją online) wg
harmonogramu cron, bez żadnego zewnętrznego serwera. To bezpośrednia
alternatywa dla Opcji A/B z `HARMONOGRAM-CRON.md`, dostępna każdemu
użytkownikowi Cowork bez wiedzy technicznej.

### Różnica względem SYNC-DZU-AUTOMATYCZNY (ważne przy wyborze trybu)

| | SYNC-DZU-AUTOMATYCZNY (cron/GH Actions) | DZU-COWORK (ten plik) |
|---|---|---|
| Wymaga serwera/CI developera | Tak | Nie |
| Koszt cykliczny | Tani (1 zapytanie do ELI API, bez LLM) | Wyższy (pełna sesja agentowa co cykl) |
| Co robi | Tylko wykrywa DIFF → wejście do sesji ręcznej | Wykonuje CAŁY TRYB DZU (weryfikacja ISAP + propozycja poprawek) |
| Modyfikuje mapy automatycznie | Nigdy (tylko raport diff) | Nigdy bez potwierdzenia człowieka — patrz niżej |
| Wymaga otwartej aplikacji | Nie (działa w CI) | Tak — Cowork musi być uruchomiony w momencie odpalenia zadania (uruchomi się przy najbliższym starcie aplikacji, jeśli była zamknięta) |

Wybierz SYNC-DZU-AUTOMATYCZNY gdy masz własną infrastrukturę i chcesz taniej,
częstszej (codziennej) detekcji jako wejścia do sesji ręcznej. Wybierz
DZU-COWORK gdy pracujesz wyłącznie w aplikacji Cowork i chcesz w pełni
autonomicznego, cotygodniowego audytu z gotowym wynikiem do instalacji.

**Zgodność z zasadą "nigdy nie zgaduj / nie modyfikuj automatycznie bez
potwierdzenia":** ten tryb NIE nadpisuje żadnych zainstalowanych skilli
samoczynnie. Katalog skilli w Cowork jest zamontowany tylko-do-odczytu —
sesja zaplanowana może co najwyżej wygenerować RAPORT i, jeśli trzeba,
KOMPLETNY zmodyfikowany plik `.skill` (zgodnie z ZASADĄ 7 /
PRE-DELIVERY-COMPLETENESS-CHECK niżej w SKILL.md), który człowiek musi
świadomie zainstalować (przycisk "Save skill"). Brak zmian = brak pliku,
tylko raport "brak zmian".

## Wykrywanie środowiska (Cowork vs web/inne)

Na początku TRYB DZU-COWORK zawsze sprawdź:

1. Czy w dostępnych narzędziach istnieje `mcp__scheduled-tasks__create_scheduled_task`
   (jeśli zdeferowane: ToolSearch "scheduled task") ORAZ narzędzia typowe dla
   Cowork (np. `mcp__cowork__present_files`)?
   - **TAK → środowisko Cowork.** Kontynuuj procedurę SPEC niżej.
   - **NIE → środowisko web (claude.ai) / Claude Code / inne bez natywnego
     harmonogramu.** Poinformuj użytkownika wprost, że automatyczny,
     cotygodniowy harmonogram w tej formie jest tu niedostępny, i wskaż
     alternatywę: `references/SYNC-DZU-AUTOMATYCZNY.md` (wymaga własnej
     infrastruktury) albo ręczne, cykliczne wywoływanie "sprawdź mapę Dz.U."
     przez użytkownika.

## SPEC — kanoniczne parametry zadania cyklicznego (nie odtwarzaj z pamięci)

- **taskId:** `audyt-dzu-tygodniowy`
- **description:** Cotygodniowa weryfikacja ISAP dla map Dz.U. w skillach prawniczych (DR-01..DR-16 + prawo-polskie-v2), tryb DZU z audyt-systemu-v4; wydaje raport + zaktualizowany plik .skill gotowy do zapisania.
- **cronExpression:** domyślnie `0 20 * * 0` (niedziela 20:00, czas lokalny) — dostosuj do wyboru użytkownika, format "MIN GODZ * * DZIEŃ_TYGODNIA" (0=niedziela..6=sobota).
- **prompt:** pełna treść jak w sekcji "TRYB DZU-COWORK" niniejszego skilla (SKILL.md) — instrukcja dla zaplanowanego uruchomienia musi być w PEŁNI samodzielna (sesja startuje bez pamięci tej rozmowy), obejmować: wczytanie ROUTING-MAP.md + dr-*/MAPA-AKTOW.md + mapa_dzu_*.md, wykonanie FAZA 0 + FAZA 3 (3-PULL, 3A, 3B, 3C) + FAZA 7A + FAZA 7B z SKILL.md audyt-systemu-v4, priorytetyzację pozycji ⏳/⚡ MONITORING + ⚠️ ALERT + kluczowych kodeksów, oraz — w razie zmian — pełną procedurę PRE-DELIVERY-COMPLETENESS-CHECK (policz pliki → kopiuj całe drzewo → edytuj → policz ponownie → porównaj → zip całego katalogu → present_files) przed wydaniem zaktualizowanego pliku `.skill`.

## Procedura instalacji/aktualizacji zadania (wykonuje sesja Cowork — na żądanie
użytkownika ALBO automatycznie po zakończeniu manualnego TRYB DZU w sesji
interaktywnej Cowork)

1. Wykryj środowisko (patrz wyżej). Jeśli nie-Cowork → zatrzymaj się tutaj,
   nie wykonuj kroków 2-5.

2. ⛔ **SCHEDULE-EXISTS-GATE (obowiązkowy, wykonaj PRZED jakąkolwiek ofertą
   utworzenia zadania):** wywołaj `mcp__scheduled-tasks__list_scheduled_tasks`
   (ToolSearch jeśli zdeferowane) i sprawdź stan zadania `audyt-dzu-tygodniowy`:

   - **Istnieje i AKTYWNE** → ⛔ POMIŃ krok 3 (ofertę utworzenia) w całości —
     nie pytaj użytkownika ponownie czy chce harmonogram. Wykonaj tylko krok 5
     w wersji informacyjnej: jedno zdanie potwierdzające istniejący
     harmonogram (dzień/godzina, następne uruchomienie jeśli dostępne w
     odpowiedzi narzędzia). Zakończ tryb — nie wywołuj
     `create_scheduled_task`.
   - **Istnieje, ale WYŁĄCZONE** → poinformuj o tym krótko i zapytaj czy
     włączyć ponownie; jeśli tak, użyj `mcp__scheduled-tasks__update_scheduled_task`
     na istniejącym `taskId`, NIGDY nie twórz nowego zadania o tej samej
     funkcji (unikaj duplikatów).
   - **Nie istnieje** → przejdź do kroku 3 (oferta).

3. **Tylko jeśli GATE z kroku 2 nie zatrzymał procedury:** zapytaj
   (AskUserQuestion) o dzień/godzinę, chyba że użytkownik już podał w
   rozmowie.
4. Wywołaj `mcp__scheduled-tasks__create_scheduled_task` z parametrami z
   sekcji SPEC wyżej.
5. Potwierdź w czacie: nazwa zadania, harmonogram, następne uruchomienie.

**Zasada praktyczna:** krok 2 (SCHEDULE-EXISTS-GATE) wykonuje się ZAWSZE,
niezależnie od tego czy tryb wywołano wprost, czy automatycznie po TRYB DZU —
oferta (krok 3) nigdy nie pojawia się użytkownikowi, jeśli aktywny harmonogram
już istnieje.

## Aktualizacja tej specyfikacji

Jeśli użytkownik zmieni harmonogram lub zakres audytu, zaktualizuj sekcję
SPEC w tym pliku (jako część normalnej dostawy naprawionego skilla —
PRE-DELIVERY-COMPLETENESS-CHECK), żeby przyszłe instalacje/aktualizacje
zadania cyklicznego korzystały z aktualnej wersji, nie z pamięci sesji.
