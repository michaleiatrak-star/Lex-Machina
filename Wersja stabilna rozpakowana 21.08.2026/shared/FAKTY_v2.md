# MOD-FAKTY — Weryfikacja Zgodności Faktycznej Pisma ze Źródłem

**Plik kanoniczny:** `/mnt/skills/user/shared/FAKTY_v2.md`
Wywołuj przez: `view /mnt/skills/user/shared/FAKTY_v2.md`
**Wersja:** 2.0 | Aktualizacja: 2026-06-01 (integracja FSL + LSL)

---

**Uruchamiaj ZAWSZE gdy pismo generowane jest na podstawie dostarczonych przez użytkownika:**
akt sprawy, pozwu, odpowiedzi na pozew, pism procesowych, dowodów, dokumentów, faktur,
umów, wyroków, decyzji lub innych materiałów wgranych do konwersacji.

**Cel:** wykrycie faktów fikcyjnych, parafraz wykraczających poza źródło oraz twierdzeń
bez pokrycia w materiale — zanim pismo trafi do użytkownika.

---

## ⛔ KROK F0 — WYWOŁANIE MODUŁÓW UZUPEŁNIAJĄCYCH (OBOWIĄZKOWE PRZED F1)

> Krok F0 jest nowy od wersji 2.0. Wykonaj go ZAWSZE przed inwentaryzacją F1.
> Pominięcie F0 = błąd systemowy klasy krytycznej.

```
F0.1 — FACT-SOURCE-LOCK (FSL)
  Cel: klasyfikacja źródła każdego twierdzenia (FSL-A/B/C)
       ZANIM trafi do raportu F2.
  Wywołaj: view /mnt/skills/user/shared/FACT-SOURCE-LOCK.md
  Wykonaj kroki FSL-1 do FSL-5 dla całego materiału wejściowego.
  Wynik FSL dostarcza klasyfikację do kroku F2.

F0.2 — LEGAL-STATUS-LOCK (LSL) [wywołany automatycznie przez FSL]
  Cel: weryfikacja statusu prawnego każdego aktu
       (prawomocność, ostateczność, skuteczność, ważność).
  Wywołaj: view /mnt/skills/user/shared/LEGAL-STATUS-LOCK.md
  LSL uruchamia się automatycznie dla każdego twierdzenia FSL-B
  dotyczącego statusu prawnego aktu.
  Wynik LSL zastępuje tag FSL-B dla danego twierdzenia.

REGUŁA PRIORYTETU:
  Twierdzenie strony/organu o statusie aktu (FSL-B) ≠ fakt przyjęty.
  Dopóki LSL nie potwierdzi jako ✅ LSL-CONFIRMED —
  użyj w piśmie z oznaczeniem "według twierdzeń [strona/organ]".
  Jeśli LSL wykryje 🔴 LSL-CONFLICT — użyj wersji z dokumentów
  i wytknij sprzeczność jako argument procesowy.
```

---

## ZASADY MATERIAŁU ŹRÓDŁOWEGO

MATERIAŁ ŹRÓDŁOWY = wszystko dostarczone przez użytkownika w tej konwersacji:
  - dokumenty wgrane jako pliki (.docx, .pdf, obrazy, itp.)
  - treść wklejona bezpośrednio w wiadomości
  - fakty podane słownie przez użytkownika

DOKUMENT LUB DOWÓD NIEOBECNY MATERIALNIE W KONWERSACJI:
  → może być uznany za wykazany, jeśli jest wprost wymieniony lub opisany
    w dostarczonym materiale źródłowym (np. faktura wspomniana w piśmie,
    wyrok powołany w uzasadnieniu, umowa opisana w pozwie)
  → oznaczaj jako: [WYKAZANY POŚREDNIO — wskazany przez: źródło]
  → NIE oznaczaj jako fikcyjny — jest pośrednio potwierdzony przez źródło

FAKT FIKCYJNY = twierdzenie, data, kwota, nazwa, zdarzenie, kwalifikacja lub opis,
  które NIE wynikają w żaden sposób z materiału źródłowego i NIE są wymienione
  przez żadne ze źródeł — nawet pośrednio.
  → traktuj jako BŁĄD KRYTYCZNY

---

## PROCEDURA WERYFIKACJI (wykonaj po wygenerowaniu treści pisma)

KROK F1 — INWENTARYZACJA TWIERDZEŃ
  Wypisz wszystkie twierdzenia faktyczne z wygenerowanego pisma:
  daty, godziny, kwoty, nazwy, opisy zdarzeń, kwalifikacje prawne
  zdarzeń faktycznych, dane stron, sygnatury, nazwy dokumentów,
  statusy aktów (prawomocność, skuteczność, ważność — patrz F0).

KROK F1A — WSTĘPNA KLASYFIKACJA FSL (nowość v2.0)
  Przed przypisaniem oznaczeń F2 — dla każdego twierdzenia ustal:
  FSL-A: pochodzi z dokumentu urzędowego / protokołu / zwrotki / orzeczenia
  FSL-B: pochodzi z pisma strony / organu / pełnomocnika
  FSL-C: wynik obliczenia na danych z FSL-A
  Twierdzenia FSL-B o statusie aktów → OBOWIĄZKOWO do LSL (F0.2)
  Twierdzenia bez żadnego źródła → ⛔ FIKCJA

KROK F2 — PRZYPISANIE DO ŹRÓDŁA
  Dla każdego twierdzenia z F1 przypisz jedno z oznaczeń:
  [✅ WPROST]         — identyczne lub synonimiczne z materiałem źródłowym
                        (FSL-A potwierdzony)
  [✅ WYKAZANE POŚREDNIO — wskazany przez: źródło] — dokument nieobecny,
                        lecz wymieniony/opisany w dostarczonym źródle
  [⚠️ PARAFRAZA]      — uogólnienie lub przeformułowanie; bliskie źródłu,
                        ale nie identyczne; oznacz i opisz różnicę
  [⚠️ OBLICZENIE]     — wynik operacji arytmetycznej na danych ze źródła
                        (FSL-C); dopuszczalne, pokazuj składniki
  [⚠️ TWIERDZENIE STRONY] — FSL-B niepotwierdzony przez FSL-A/C;
                        użyj WYŁĄCZNIE z oznaczeniem "według twierdzeń [strona]"
                        NIGDY jako fakt przyjęty; jeśli dot. statusu aktu → LSL
  [⛔ FIKCJA]         — brak jakiegokolwiek oparcia w materiale źródłowym
  [⛔ BRAK ŹRÓDŁA]    — twierdzenie potencjalnie prawdziwe, lecz bez
                        przypisanego źródła z materiałów użytkownika;
                        traktowane identycznie jak FIKCJA — BŁĄD KRYTYCZNY
  [🔴 SPRZECZNOŚĆ]    — FSL-B sprzeczne z FSL-A; użyj FSL-A,
                        wytknij sprzeczność argumentacyjnie

KROK F2A — ADNOTACJA ŹRÓDŁA (obowiązkowa przy każdym twierdzeniu)
  Dla każdego twierdzenia oznaczonego [✅ WPROST] lub [✅ WYKAZANE POŚREDNIO]
  dołącz adnotację źródła w formacie czytelnym dla użytkownika:
  → (źródło: [nazwa dokumentu / opis materiału, str./pkt jeśli znane])
  Przykład: "W dniu 15.03.2024 pozwany rozwiązał umowę (źródło: pismo z 15.03.2024, §2)"
  Dla [⚠️ OBLICZENIE] / FSL-C: pokaż składniki + źródła składników.
  Zasada: nawet jeśli źródło jest oczywiste — adnotacja jest obowiązkowa.
  ⚠️ Powyższe "str./pkt jeśli znane" dotyczy dokumentów SPRAWY (własnych akt
  użytkownika). Dla orzeczeń sądowych i interpretacji znalezionych ONLINE
  obowiązuje BARDZIEJ RYGORYSTYCZNY, OBOWIĄZKOWY (nie "jeśli znane") standard
  lokalizacji + kotwicy technicznej — patrz `orzeczenia-sadowe-v2/SKILL.md`
  Zasada 2B (dodana 2026-07-15).

KROK F3 — KLASYFIKACJA WYNIKÓW
  Policz i zgrupuj oznaczenia z F2.
  Jeśli wystąpiło choćby jedno ⛔ FIKCJA lub ⛔ BRAK ŹRÓDŁA → BŁĄD KRYTYCZNY.

  ZASADA ZERO TOLERANCE:
  ⛔ Wykrycie FIKCJI lub BRAKU ŹRÓDŁA = BLOKADA FINALIZACJI PISMA.
  Pismo NIE może zostać oddane użytkownikowi w wersji finalnej dopóki:
    a) każda ⛔ FIKCJA nie zostanie usunięta lub zastąpiona ⬛ [UZUPEŁNIJ], ORAZ
    b) każdy ⛔ BRAK ŹRÓDŁA nie zostanie uzupełniony wskazaniem źródła przez
       użytkownika lub zastąpiony ⬛ [UZUPEŁNIJ: wskaż źródło dla tego faktu].
  Powiadom użytkownika o blokadzie i podaj listę elementów wymagających uzupełnienia.

---

## KLASYFIKACJA BŁĘDÓW I REAKCJA

⛔ BŁĄD KRYTYCZNY — FIKCJA FAKTYCZNA
  Definicja: twierdzenie, którego nie ma w żadnym źródle, nawet pośrednio.
  Przykłady:
    - data zdarzenia podana "orientacyjnie" gdy żadne źródło jej nie podaje
    - kwota szkody zmieniona lub zaokrąglona bez podstawy w dokumencie
    - opis obrażeń/skutków dodany "logicznie" bez oparcia w aktach
    - kwalifikacja czynu z sentencji wyroku, którego nie dostarczono
    - sformułowanie oceniające ("bezsporna wina") bez podstawy w źródle
  Reakcja:
    → USUŃ twierdzenie z pisma lub zastąp znacznikiem ⬛ [UZUPEŁNIJ: opis]
    → NIGDY nie zostawiaj fikcji w wygenerowanym piśmie
    → Zgłoś użytkownikowi z opisem: co usunięto i dlaczego
    → BLOKADA FINALIZACJI — pismo nie wychodzi do użytkownika dopóki nieusunięte

⛔ BŁĄD KRYTYCZNY — BRAK ŹRÓDŁA
  Definicja: twierdzenie bez przypisanego źródła z materiałów użytkownika,
  nawet jeśli potencjalnie prawdziwe lub powszechnie znane.
  Przykłady:
    - data podana przez asystenta bez wskazania z jakiego dokumentu pochodzi
    - kwota wynikająca z "wiedzy ogólnej" zamiast z dostarczonej umowy/faktury
    - fakt procesowy powołany bez odniesienia do konkretnego pisma z akt
  Reakcja:
    → zastąp znacznikiem ⬛ [UZUPEŁNIJ: wskaż źródło dla tego faktu]
    → lub zapytaj użytkownika o źródło (jeden zbiorczy komunikat na końcu)
    → BLOKADA FINALIZACJI — identyczna jak dla FIKCJI

⚠️ OSTRZEŻENIE — PARAFRAZA WYKRACZAJĄCA POZA ŹRÓDŁO
  Definicja: sformułowanie bliskie źródłu, lecz dodające ocenę, kwalifikację
  lub uszczegółowienie niemające oparcia w materiale.
  Reakcja:
    → Zostaw w piśmie z adnotacją dla użytkownika
    → Wskaż dokładną różnicę: co jest w źródle, co dodano

ℹ️ ADNOTACJA — OBLICZENIE ARYTMETYCZNE
  Definicja: suma, różnica, procent obliczone na podstawie danych ze źródła.
  Reakcja: oznacz jako obliczenie; dopuszczalne bez pytania użytkownika.

ℹ️ ADNOTACJA — WYKAZANE POŚREDNIO
  Definicja: dokument lub dowód wymieniony w źródle, lecz nieobecny fizycznie
  w konwersacji.
  Reakcja: oznacz; nie traktuj jako fikcji; nie traktuj jako braku danych.

---

## FORMAT RAPORTU (wyświetl zawsze po wygenerowaniu pisma ze źródła)

RAPORT WERYFIKACJI FAKTYCZNEJ PISMA (MOD-FAKTY)
Pismo: [typ] | Materiał źródłowy: [lista wgranych dokumentów/opisów]

WYNIK: [BRAK FIKCJI ✅ / WYKRYTO BŁĘDY KRYTYCZNE ⛔]

⛔ BŁĘDY KRYTYCZNE — FIKCJA (usunięte lub oznaczone ⬛):
  [nr]. "[twierdzenie]"
        Brak źródła: [wyjaśnienie]
        Działanie: [usunięto / zastąpiono ⬛ / zmieniono na: ...]

⛔ BŁĘDY KRYTYCZNE — BRAK ŹRÓDŁA (wymagają uzupełnienia przez użytkownika):
  [nr]. "[twierdzenie]"
        Problem: twierdzenie bez przypisanego źródła z materiałów
        Działanie: zastąpiono ⬛ [UZUPEŁNIJ: wskaż źródło dla: ...]
        Pytanie do użytkownika: [z jakiego dokumentu pochodzi ten fakt?]

[jeśli wykryto ⛔ FIKCJA lub ⛔ BRAK ŹRÓDŁA:]
⛔ BLOKADA FINALIZACJI PISMA
Pismo nie może zostać sfinalizowane. Wymagane działania:
  → Uzupełnij dane dla pól ⬛ oznaczonych jako BRAK ŹRÓDŁA
  → Po uzupełnieniu: wygeneruję zaktualizowaną wersję pisma

⚠️ OSTRZEŻENIA — parafrazy wykraczające poza źródło:
  [nr]. "[twierdzenie w piśmie]" ← w źródle: "[oryginalne brzmienie]"
        Różnica: [opis] | Zalecenie: [zostaw / zmień na brzmienie ze źródła]

ℹ️ OBLICZENIA ARYTMETYCZNE (dopuszczalne):
  [nr]. [opis obliczenia] = [wynik]

ℹ️ WYKAZANE POŚREDNIO (nieobecne fizycznie, lecz wskazane w źródle):
  [nr]. [dokument/fakt] — wskazany przez: [źródło]

✅ ZGODNE ZE ŹRÓDŁEM: [X] twierdzeń bez zastrzeżeń
   Źródła: [lista dokumentów z których pochodzi zweryfikowana treść]

---

## ZASADA NADRZĘDNA — ŹRÓDŁO-FIRST

⛔ ZAKAZ ABSOLUTNY:
Żadne twierdzenie faktyczne (data, kwota, zdarzenie, nazwa, sygnatura, treść orzeczenia)
nie może pojawić się w piśmie bez przypisanego źródła z materiałów użytkownika.

Jeśli nie jesteś pewien na 100% skąd pochodzi dany fakt — użyj:
  ⬛ [UZUPEŁNIJ: wskaż źródło dla tego faktu — nie mogę potwierdzić]
i NIE używaj tego elementu w treści pisma.

## NAKAZ BEZWZGLĘDNY — ZERO TOLERANCE

⛔ ZERO TOLERANCE:
Wykrycie choćby jednego ⛔ FIKCJA lub ⛔ BRAK ŹRÓDŁA = BEZWZGLĘDNA BLOKADA FINALIZACJI.
Pismo NIE MOŻE zawierać żadnego twierdzenia faktycznego oznaczonego jako FIKCJA lub BRAK ŹRÓDŁA.
Przed oddaniem pisma użytkownikowi każda fikcja / brak źródła musi być:
  a) usunięta, LUB
  b) zastąpiona znacznikiem ⬛ [UZUPEŁNIJ: opis brakującego faktu / wskaż źródło]
Raport MOD-FAKTY musi być wyświetlony użytkownikowi nawet jeśli wynik to ✅.
