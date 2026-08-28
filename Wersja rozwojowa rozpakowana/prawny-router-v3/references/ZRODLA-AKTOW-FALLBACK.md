# Akty polskie — ISAP i źródła zastępcze

## Kolejność obowiązkowa

1. Najpierw użyj ISAP do identyfikacji aktu i próby pobrania aktu lub jego tekstu. Nie ograniczaj ISAP wyłącznie do metryki. Ustal tytuł, identyfikator Dz.U./M.P., wersję i datę właściwą dla pytania.
2. Gdy nie można pobrać aktu lub tekstu (np. błąd API, timeout, blokada dostępu, niedziałający PDF lub strona zawierająca wyłącznie metrykę), zapisz wynik próby i kontynuuj. Nie traktuj takiego błędu jako końca weryfikacji ani dowodu nieistnienia przepisu.
3. Korzystaj z LEX lub Legalis (Rząd 2A — tekst przy dostępnym uprawnionym dostępie), a gdy odczyt się nie powiedzie lub dostęp nie jest dostępny — z ArsLege (Rząd 2B). Nie wymagaj nieudanych prób wszystkich interfejsów urzędowych przed uruchomieniem tej ścieżki. Dopuszczalne pozostają urzędowe alternatywy ELI/Dziennik Ustaw oraz inne źródła przewidziane w shared/HIERARCHIA-ZRODEL.md.
4. Odczytaj rzeczywistą treść właściwego artykułu/ustępu, nie sam wynik wyszukiwania, tytuł strony czy ekran logowania. Zweryfikuj zgodność aktu, wersji, dat obowiązywania i zmian po tekście jednolitym zgodnie z shared/TEMPORAL-LAW-CHECK.md.
5. Jeśli źródło jest niedostępne, przejdź do kolejnego; nie obchodź logowania, licencji, CAPTCHA ani innych ograniczeń. Nie zakładaj, że użytkownik ma dostęp do LEX/Legalis. Żaden z tych serwisów nie staje się źródłem urzędowym przez użycie go w zastępstwie ISAP.

## Dowód i status

- Zapisuj osobno źródło identyfikacji aktu i źródło odczytanej treści, URL, datę sprawdzenia, wersję tekstu oraz wynik każdej próby.
- Metryka ISAP potwierdza wyłącznie odczytane dane identyfikacyjne; nie stanowi dowodu brzmienia artykułu.
- Dla LEX/Legalis stosuj status przewidziany dla rzeczywiście odczytanego tekstu Rzędu 2A w shared/PRAWO-HARDGATE.md.
- ArsLege nie wystarcza samo do deklaracji pełnej weryfikacji urzędowej. Stosuj reguły Rzędu 2B oraz warunki K1–K4 z shared/PRAWO-HARDGATE.md: dla kotwicy urzędowej potrzebna jest m.in. zgodna metryka i dwa niezależne źródła treści. Przy niespełnieniu warunków jawnie oznacz zakres nieweryfikowany; nie wymyślaj drugiego źródła.
- Rozbieżność tekstów wymaga dalszej kontroli; nie wybieraj wersji arbitralnie.
- Dopiero brak wystarczającego potwierdzenia po dostępnych alternatywach uzasadnia ⚠️ [NIEWERYFIKOWANE] dla danego powołania. Nie oznaczaj całej odpowiedzi jako niesprawdzonej tylko z powodu błędu ISAP, jeśli właściwa weryfikacja zastępcza się powiodła.

## Relacja do modułów wspólnych

Ta procedura doprecyzowuje moment uruchomienia alternatyw w routerze. Nie uchyla kontroli temporalnej, wymogu świeżego odczytu, gradacji źródeł, warunków statusów ani zakazu cytowania z pamięci. Skrót „sprawdź w ISAP” nie oznacza zakazu korzystania z tej ścieżki po nieudanym pobraniu.
