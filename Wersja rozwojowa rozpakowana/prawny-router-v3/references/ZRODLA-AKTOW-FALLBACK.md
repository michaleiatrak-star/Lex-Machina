# Akty polskie — ELI, ISAP i źródła zastępcze

## Kolejność obowiązkowa (od routera 3.54) — kanon E-1…E-5

Kanon nadrzędny: `shared/HIERARCHIA-ZRODEL.md`, sekcja „KANON KOLEJNOŚCI”.
Ten plik go wykonuje; przy sprzeczności wygrywa kanon.

1. **E-1 — ELI (RZĄD 1, kanał podstawowy).** Brzmienie przepisu odczytuj z
   `https://api.sejm.gov.pl/eli/acts/DU/{rok}/{poz}` (metryka) oraz
   `.../text.pdf` (treść t.j.), kanałem kodu (`curl`/skrypt, neutralny
   User-Agent wg `shared/DOSTEP-MASZYNOWY-API.md` §1). Gdy host nie ma kanału
   kodu — sekwencja B-1 → B-2 z `shared/PRAWO-HARDGATE.md`. Rok i pozycję
   aktualnego t.j. ustal przez `api.sejm.gov.pl/eli/acts/search?title=...`.
   Odczyt się powiódł → ✅ [VER: ELI DU/RRRR/NNN, data]. W takim wypadku
   znacznik 🟨 (kotwica urzędowa) i źródło RZĄD 2B są **niedopuszczalne**.
2. **E-2 — ISAP: adres dla człowieka.** Link ISAP podawaj czytelnikowi obok
   ELI; pomocniczo służy do identyfikacji aktu. Kanał maszynowy ISAP jest
   martwy (pętla 302); przy awarii ELI spróbuj jednak odczytu treści z ISAP
   lub dziennikustaw.gov.pl. Sama niedostępność ISAP przy działającym ELI
   nie uruchamia źródeł zastępczych.
3. **E-3 — LEX lub Legalis (RZĄD 2A)**, przy dostępnym uprawnionym dostępie —
   **obowiązkowo przy BRAKU-AKTU**: aktu nie da się pobrać z RZĘDU 1 — ani z
   ELI (każdym kanałem dostępnym w hoście), ani z ISAP — np. awaria lub
   przeciążenie serwera, timeout, blokada, brak kanału. Zapisz wynik prób.
   Pominięcie tej ścieżki przy BRAKU-AKTU i od razu ⚠️ jest błędem.
4. **E-4 — ArsLege (RZĄD 2B)** i inne serwisy tekstów — gdy E-3 niedostępne;
   status wyłącznie 🟨 na warunkach K-1…K-4.
5. **E-5 — ⚠️ [NIEWERYFIKOWANE].** Nigdy z pamięci.

We wszystkich krokach: odczytaj rzeczywistą treść właściwego artykułu/ustępu,
nie sam wynik wyszukiwania, tytuł strony czy ekran logowania. Zweryfikuj
zgodność aktu, wersji, dat obowiązywania i zmian po tekście jednolitym zgodnie
z `shared/TEMPORAL-LAW-CHECK.md` — dla prawa materialnego według daty czynu lub
zdarzenia, nie daty analizy.

**Zasada innej drogi (od routera 3.55).** Gdy źródło jest zablokowane dla
jednego narzędzia lub kanału, a ta sama treść jest publicznie dostępna inną
drogą — **użyj tej drogi**: kanał kodu, inny endpoint tego samego wydawcy,
urzędowy mirror, przeglądarka, inny format (PDF/HTML), inny publikator.
`robots.txt` nie rozstrzyga o pobraniu pojedynczego publicznego dokumentu
potrzebnego w sprawie. Granice: bez łamania logowania, cudzych danych
dostępowych, licencji i paywalla, CAPTCHA i zabezpieczeń technicznych; bez
masowego pobierania ponad potrzebę sprawy. W śladzie podaj, którym kanałem
pobrano treść. Szczegóły: `shared/DOSTEP-MASZYNOWY-API.md` §0. Nie zakładaj,
że użytkownik ma dostęp do LEX/Legalis. Żaden z tych serwisów nie staje się
źródłem urzędowym przez użycie go w zastępstwie ELI.

## Dowód i status

- Zapisuj osobno źródło identyfikacji aktu i źródło odczytanej treści, URL, datę sprawdzenia, wersję tekstu oraz wynik każdej próby.
- Metryka ISAP potwierdza wyłącznie odczytane dane identyfikacyjne; nie stanowi dowodu brzmienia artykułu.
- Dla LEX/Legalis stosuj status przewidziany dla rzeczywiście odczytanego tekstu Rzędu 2A w shared/PRAWO-HARDGATE.md.
- ArsLege nie wystarcza samo do deklaracji pełnej weryfikacji urzędowej. Stosuj reguły Rzędu 2B oraz warunki K1–K4 z shared/PRAWO-HARDGATE.md: dla kotwicy urzędowej potrzebna jest m.in. zgodna metryka i dwa niezależne źródła treści. Przy niespełnieniu warunków jawnie oznacz zakres nieweryfikowany; nie wymyślaj drugiego źródła.
- Rozbieżność tekstów wymaga dalszej kontroli; nie wybieraj wersji arbitralnie.
- Dopiero brak wystarczającego potwierdzenia po dostępnych alternatywach uzasadnia ⚠️ [NIEWERYFIKOWANE] dla danego powołania. Nie oznaczaj całej odpowiedzi jako niesprawdzonej tylko z powodu błędu ISAP lub ELI, jeśli właściwa weryfikacja zastępcza się powiodła.

## Relacja do modułów wspólnych

Ta procedura doprecyzowuje moment uruchomienia alternatyw w routerze. Nie uchyla kontroli temporalnej, wymogu świeżego odczytu, gradacji źródeł, warunków statusów ani zakazu cytowania z pamięci. Skrót „sprawdź w ISAP” w pozostałych plikach oznacza „sprawdź w RZĘDZIE 1 według E-1…E-5” — czyli najpierw ELI (reguła interpretacyjna, `shared/HIERARCHIA-ZRODEL.md`).
