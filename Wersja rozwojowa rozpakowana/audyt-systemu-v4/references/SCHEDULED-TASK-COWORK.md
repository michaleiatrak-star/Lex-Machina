# SCHEDULED-TASK-COWORK.md — Zadanie cykliczne „Cotygodniowa weryfikacja ISAP"

**Plik:** `references/SCHEDULED-TASK-COWORK.md`
**Utworzony:** 2026-08-15o (odtworzenie mechanizmu istniejącego wcześniej, opisanego przez użytkownika)
**Odpowiada za:** pozycję **11** menu audytu (`widgets/WIDGET-MENU.md`, id `harmonogram`)
**Powiązane:** `references/HARMONOGRAM-CRON.md` (cron/GitHub Actions — INNY mechanizm, patrz rozgraniczenie niżej), `references/SYNC-DZU-AUTOMATYCZNY.md`, ZASADA 7 (`SKILL.md`)

---

## 0. Czym to jest, a czym NIE jest

To jest **zadanie cykliczne (scheduled task) w Cowork**, uruchamiane przez
harmonogram Cowork i wykonywane przez Claude w świeżej sesji — bez pamięci
poprzednich rozmów. Claude **nie budzi się sam**: harmonogram należy do Cowork,
ten plik dostarcza wyłącznie treść zadania i warunki jego utworzenia.

⚠️ **Rozgraniczenie od `HARMONOGRAM-CRON.md`:** tamten plik opisuje cron/GitHub
Actions **na serwerze developera**, który uruchamia `scripts/sync_dzu_eli.py`
i produkuje surowy raport różnic z ELI API. Ten plik opisuje **zadanie
w Cowork**, które uruchamia pełny TRYB DZU skilla z weryfikacją merytoryczną
i dostawą zaktualizowanego `.skill`. Mechanizmy są komplementarne, nie
alternatywne: cron wykrywa *że coś się zmieniło*, zadanie Cowork *rozstrzyga co
z tym zrobić*. Jeśli cron nie jest wdrożony, zadanie Cowork działa samodzielnie.

---

## 1. WARUNEK URUCHOMIENIA (kiedy Claude ma to zaproponować)

Zaproponuj utworzenie zadania, gdy **oba** warunki są spełnione łącznie:

1. **Wykryto pracę w Cowork** — sesja toczy się w Cowork (interfejs agentowy
   z zadaniami i plikami), a nie w zwykłym oknie czatu.
2. **Brak wcześniej utworzonego zadania** — użytkownik nie ma jeszcze tego
   zadania w harmonogramie Cowork.

⛔ **Jak sprawdzić warunek 2 — NIE zgaduj.** Claude nie widzi listy zadań
harmonogramu Cowork. Jeżeli nie ma jednoznacznego potwierdzenia w kontekście
sesji (np. użytkownik pokazał wpis, albo poprzedni raport z tego zadania jest
w plikach), **zapytaj jednym zdaniem**: *„Czy masz już w Cowork zadanie
cykliczne «Cotygodniowa weryfikacja ISAP»?"* — i dopiero na odpowiedź
przeczącą przejdź do § 2. Wielokrotne proponowanie już istniejącego zadania
jest uciążliwe i podważa zaufanie do reszty audytu.

**Zgoda użytkownika jest warunkiem koniecznym.** Wystarczy akceptacja („tak",
„twórz") — nie wymagaj przepisywania treści zadania. Bez zgody: nie twórz,
odnotuj w AUDIT-JOURNAL.md jedno zdanie („zaproponowano, odmowa/brak
odpowiedzi") i nie wracaj do tematu w tej samej sesji.

---

## 2. TREŚĆ ZADANIA — do wklejenia do harmonogramu Cowork

### 2A. Pole „Description" (jedno zdanie, widoczne na liście zadań)

```
Cotygodniowa weryfikacja ISAP dla map Dz.U. w skillach prawniczych (DR-01..DR-16 + prawo-polskie-v2), tryb DZU z audyt-systemu-v4; wydaje raport + zaktualizowany plik .skill gotowy do zapisania.
```

### 2B. Pole „opis systemu" / prompt zadania (treść wykonawcza)

```
Uruchom TRYB DZU skilla audyt-systemu-v4 (weryfikacja mapy Dz.U. dla polskiego systemu prawniczego). Ta sesja startuje bez pamięci poprzednich rozmów — wykonaj samodzielnie poniższe kroki, opierając się wyłącznie na plikach skilla audyt-systemu-v4 i weryfikacji online (isap.sejm.gov.pl i pomocniczo dziennikustaw.gov.pl / sip.lex.pl / gofin.pl / infor.pl / prawo.pl), nigdy z pamięci.

1. Wczytaj skill audyt-systemu-v4 (SKILL.md) oraz jego pliki references: AUDIT-JOURNAL.md, WARN-OTWARTE.md, CHECKLIST-DEDUP.md, najnowszy plik mapa_dzu_YYYY-MM-DD.md. Wczytaj też prawo-polskie-v2/ROUTING-MAP.md oraz każdy dr-01..dr-16/MAPA-AKTOW.md.

2. Wykonaj FAZA 0 (ustal wynik ostatniego audytu, otwarte WARN, kontekst).

3. Wykonaj FAZA 3 w całości: 3-PULL (synchronizacja DR-MAPA-AKTOW → ROUTING-MAP → mapa_dzu), 3A (sprawdź w ISAP nowe teksty jednolite dla kluczowych aktów: KC, KPC, KPK, KRO, KP, KSH, KPA, PB, PrFarm, PIT, CIT, OrdPod, PrNotariat — Dz.U. poz. wyższe niż ostatnio odnotowane), 3B (aktualizacja statusów OK→PREV + nowe wiersze), 3C (rozporządzenia "do weryfikacji" z WARN-OTWARTE.md), 3D (tabela MONITORING — akty oczekujące na wejście w życie, horyzont 90 dni; przenieś do tabeli głównej te które już weszły w życie).

4. Priorytetyzuj w pierwszej kolejności pozycje oznaczone ⏳ OCZEKUJE / ⚡ WCHODZI-90DNI w MONITORING oraz wszelkie ⚠️ ALERT z poprzednich audytów, a także kluczowe kodeksy wymienione w kroku 3A.

5. Wykonaj FAZA 7A (dopisz nowy wpis ## AUDYT-YYYY-MM-DD na początku AUDIT-JOURNAL.md, zaktualizuj stopkę) i FAZA 7B (jeśli znaleziono zmiany Dz.U. — nowa wersja mapa_dzu_YYYY-MM-DD.md z zaktualizowanymi statusami; jeśli brak zmian — odnotuj to wprost w AUDIT-JOURNAL.md, plik mapy bez zmian).

6. Jeśli wprowadzono jakiekolwiek zmiany w plikach skilla: wykonaj obowiązkową procedurę PRE-DELIVERY-COMPLETENESS-CHECK z ZASADY 7 (SKILL.md audyt-systemu-v4) — policz pliki oryginału PRZED edycją, skopiuj CAŁE drzewo katalogu do katalogu roboczego, nanieś zmiany na kopii, policz pliki PO edycji i pokaż porównanie liczb w odpowiedzi, dopiero potem spakuj CAŁY katalog audyt-systemu-v4 do archiwum .skill/.zip i użyj present_files na całym archiwum — nigdy na pojedynczych plikach.

7. Zakończ krótkim podsumowaniem w czacie: co sprawdzono, co się zmieniło (lub "brak zmian"), czy dostarczono zaktualizowany plik .skill do zapisania.

Nie zgaduj żadnego numeru Dz.U. — każda zmiana musi być potwierdzona online przed zapisaniem.
```

⛔ **Treść § 2A i § 2B jest KANONICZNA — nie parafrazuj, nie skracaj, nie
„ulepszaj" przy tworzeniu zadania.** Sformułowania „nigdy z pamięci", „nie
zgaduj żadnego numeru Dz.U." i wskazanie ZASADY 7 są bramkami jakości, nie
ozdobnikami; ich usunięcie zmienia zachowanie sesji wykonawczej.

### 2C. Harmonogram

- **Częstotliwość:** co tydzień.
- **Uzasadnienie tygodniowego (a nie 4-tygodniowego) rytmu:** to zadanie
  weryfikuje **numery aktów już pokrytych** (FAZA 3A — teksty jednolite
  kluczowych kodeksów), a nie proces legislacyjny. Nowy t.j. potrafi
  unieważnić numer cytowany w kilkunastu modułach z dnia na dzień, a koszt
  negatywnego przebiegu („brak zmian") jest niski.
- ⚠️ **Relacja do MON-1/MON-2 z `WARN-OTWARTE.md`** (cykl 4-tygodniowy):
  to NIE jest ten sam mechanizm i nie należy ich ujednolicać. MON-1/MON-2 to
  ludzki przegląd nowelizacji i projektów; to zadanie to maszynowa weryfikacja
  numerów t.j. Jeśli oba działają — MON-1/MON-2 wykonuj w tygodniu, w którym
  zadanie zwróciło „brak zmian" (tańszy tydzień).

---

## 3. Monitoring map pokrycia — aktywny od 2026-08-26

Zadanie ma docelowo monitorować także **system map pokrycia** — map
wskazujących, w jakim zakresie rozdziały i akty prawne są pokryte treścią
modułów.

Warunki aktywacji zostały spełnione: system map pokrycia został zasilony
9/9 raportami, a F-83 zamknięto. Pełną rewalidację map wykonuj **co dwa
tygodnie**; w pozostałych przebiegach uruchamiaj punkt 8 tylko dla aktu,
którego zmianę wykrył bieżący monitoring Dz.U.

**Punkt 8 promptu § 2B:**

```
8. Sprawdź mapy pokrycia: dla każdego aktu, w którym krok 3 wykrył zmianę Dz.U., otwórz odpowiadającą mapę pokrycia i sprawdź, czy zmiana dotyczy rozdziału oznaczonego jako pokryty. Jeżeli tak — oznacz ten rozdział jako WYMAGA PONOWNEJ WERYFIKACJI i przekaż sprawę do FAZY 3E (MOD-TRESC-MERYTORYCZNA.md); pokrycie oznaczone wcześniej jako pełne przestaje nim być z chwilą zmiany przepisu. Jeżeli zmiana dotyczy rozdziału nigdy niepokrytego — odnotuj to jako lukę o podwyższonym priorytecie (akt żywy, zmieniany), nie jako zwykłą lukę. Nie zmieniaj statusów pokrycia na podstawie samego numeru Dz.U. — status "pokryty" wymaga sprawdzenia treści modułu, nie metryki aktu.
```

---

## 4. PO CO TO ISTNIEJE — uzasadnienie zapisane trwale

Mechanizm powstał, bo audyt map Dz.U. ma **naturę cykliczną, a pamięć sesji
nie**. Każda rozmowa startuje bez kontekstu; bez zadania z harmonogramu
weryfikacja odbywa się wtedy, gdy użytkownik sobie o niej przypomni — czyli
zwykle wtedy, gdy błędny numer już zdążył trafić do pisma.

⭐ **Dowód empiryczny z tego samego dnia (2026-08-15n):** Kodeks morski figurował
w trzech rejestrach naraz pod numerem `Dz.U. 2023 poz. 1523`, należącym do
ustawy o delegowaniu kierowców w transporcie drogowym. Błąd przetrwał wszystkie
dotychczasowe audyty, bo rejestry były ze sobą ZGODNE, a wykryto go
przypadkowo. Cotygodniowa weryfikacja **przeciw źródłu zewnętrznemu** (ISAP),
a nie przeciw innym rejestrom, jest jedyną znaną obroną przed tą klasą błędu.
