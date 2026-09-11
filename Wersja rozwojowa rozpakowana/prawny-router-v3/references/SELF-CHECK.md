# SELF-CHECK — Pełna Lista Kontrolna przed Każdą Odpowiedzią

> Plik wydzielony z prawny-router-v3/SKILL.md (R1).
> Wywołanie: `view prawny-router-v3/references/SELF-CHECK.md`

---

```
⛔ BLOK 0A — BRAMKA ANONIMIZERA (wykonaj PRZED wszystkim innym)
□ [0A-1] ##ANON_START## w wiadomości? → decyzja_sesji='anon', pomiń 0A, idź BLOK 1
□ [0A-2] ##PLIK_ORYGINALNY## w wiadomości? → decyzja_sesji='raw', pomiń 0A, idź BLOK 1
□ [0A-3] decyzja_sesji='anon'? → widget auto, idź BLOK 1
□ [0A-4] decyzja_sesji='raw'?  → idź BLOK 1 bez pytania
□ [0A-5] decyzja_sesji=null → skan ostatnich 10 wiadomości:
         ##ANON_START## → 'anon' · ##PLIK_ORYGINALNY## → 'raw'
         Brak → skan bieżącej: ≥1 WYSOKI lub ≥2 ŚREDNIE?
         TAK → ⛔ STOP. Zadaj pytanie anonimizacyjne. ZAKOŃCZ. Czekaj na a/b.
         NIE → decyzja_sesji='raw', idź BLOK 1
□ [ANON-B] fraza żądania anonimizacji? → widget natychmiast
JEŚLI BLOK 0A nie zamknięty → STOP. Żaden punkt poniżej nie jest wykonywany.

□ Wczytałem references/KROK0A-anonimizer.md (szczegóły bramki)?
□ Wczytałem references/KROK1-detekcja.md (tryb + hard gate ISAP)?
□ web_search/web_fetch dla każdego artykułu/liczby — FAKTYCZNIE wywołałem narzędzie?
□ Każdy artykuł/termin/orzeczenie ma znacznik z ZAMKNIĘTEJ hierarchii czterech:
  ✅ [VER] · 🟨 [KOTWICA-URZĘDOWA] · ⚠️ [NIEWERYFIKOWANE] · ⬛ [DO UZUPEŁNIENIA]?
  ⛔ Użycie JAKIEJKOLWIEK innej etykiety (w tym opisania pamięci modelu jako
  szczebla źródła) = naruszenie hard gate. Patrz PRAWO-HARDGATE v2.5.
□ RZĄD 1 niedostępny (robots)? → sekwencja B-1 web_search → B-2 web_fetch
  wykonana, a przy blokadzie warunki K-1…K-4 kotwicy urzędowej spełnione?
□ Sprawa karna → wczytałem `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-KPK-framework-karne.md` → framework zdecydował, czy potrzebny `mod-KK-kwalifikator-karnomaterialny.md`?
□ [ANTY-FASADA + AF-6] Wykonaj self-check antyfasadowy z modułu kanonicznego:
    view shared/SELF-CHECK-ANTY-FASADA.md
□ [DOMAIN-LOCK] ⛔ KONTROLA NA WYJŚCIU (nie na wejściu — dodano 2026-08-23):
  czy w GOTOWEJ odpowiedzi jest przepis spoza PRIMARY (KK/KKS/KW/KPK/KPW przy
  torze cywilnym/administracyjnym — lub odwrotnie)?
    NIE → OK
    TAK → (a) konkretny FAKT wypełniający znamię, nie skojarzenie?
          (b) wczytany dr-03 (lub właściwy DR) w TEJ odpowiedzi?
          (c) przepis przeszedł PRAWO-HARDGATE w TEJ odpowiedzi?
          którekolwiek NIE → ⛔ USUŃ powołanie.
          Procedura pełna: view shared/DOMAIN-LOCK.md
□ [CV-ALT / RELACJA PODSTAW] ⛔ KONTROLA NA WYJŚCIU (dodano 2026-08-31, F-139):
  czy GOTOWA odpowiedź wskazuje ≥2 podstawy prawne prowadzące do tego samego
  skutku dla tej samej strony — połączone „albo / lub / alternatywnie /
  równolegle", ALBO rozpisane jako równoległe sekcje / wątki / warianty?
    NIE → OK
    TAK → (a) wykonano OSOBNE zapytanie o RELACJĘ tych podstaw w TEJ
              odpowiedzi (nie o brzmienie każdej z osobna)?
          (b) relacja ma pokrycie źródłowe, czy jest domysłem redakcyjnym?
          (c) użyty spójnik odpowiada ustalonej relacji?
          którekolwiek NIE → ⛔ NIE publikuj równolegle. Przebuduj na gałąź
          warunkową i dopisz jawne zdanie „relacja tych podstaw nie została
          zbadana".
          ⛔ Relacja jest treścią WYGENEROWANĄ — zakaz nadawania jej
          znacznika ✅/🟨/📚/⚠️ (AF-6). Egzekwowanie przez zdanie, nie znacznik.
          Procedura pełna: view shared/CLAIM-VALIDATION.md → KROK CV-ALT
□ [RATE-COMPLETENESS] Odpowiedź zawiera odsetki / waloryzację / wskaźnik zmienny
  w czasie (dodano 2026-08-23)?
    NIE → OK
    TAK → przedział zapisany + reżim rozstrzygnięty (KC vs transakcje handlowe)
          + szereg podokresów BEZ LUK + znacznik na każdym wierszu?
          NIE → nie podawaj kwoty łącznej; pokaż tabelę z jawnymi ⬛.
          Procedura pełna: view shared/RATE-COMPLETENESS.md
□ Sygnatury orzeczeń przeszły V-SYG-1/2/3/4 (shared/SYGNATURY.md)?
□ Sklasyfikowałem do [1]–[11] (lub BJ–BW)?
□ ⛔ [11] CUDZY MATERIAŁ — czy wejściem jest klucz odpowiedzi, opinia, cudza
  analiza, notatki, wynik innego modelu lub pismo przeciwnika? TAK → PRIMARY
  MUSI być analizator-przepisow-v2 (kategoria [11]), a nie sam dr-XX domeny.
□ ⛔ AUDYT KLUCZA — przy porównaniu z kluczem/opinią/notatkami/cudzą analizą
  wczytałem `references/AUDYT-KLUCZA-ODPOWIEDZI.md` i wykonałem K0–K6?
  Czy rejestr pokazuje N jednostek, status KAŻDEJ i pokrycie N/N?
  „Pełna zgodność" wolno wpisać tylko przy: potwierdzone=N/N, obalone=0,
  nierozstrzygnięte=0. W każdym innym stanie usuń taki werdykt.
□ Sprawdziłem shared/ACTIVATION-MATRIX.md przy nakładaniu się skillów?
□ Wczytałem PRIMARY skill PRZED analizą?
□ [KROK 3A ŚLAD ROUTINGU] Wypisałem blok TRYB/PRIMARY/SECONDARY/ODRZUCONE/
  PROFIL/ODROCZONE/WERSJA ROUTERA/ROUTER-WCZYTANY zaraz po KROK 3, przed KROK 4? Jeśli
  ROUTER-WCZYTANY: NIE dla PRIMARY → dodałem nagłówek ⛔ TRYB ZDEGRADOWANY?
□ [ŚLAD ROUTINGU] ⛔ KONTROLA NA WYJŚCIU — nie polegaj wyłącznie na własnej
  deklaracji z KROKU 3A:
  czy GOTOWA odpowiedź zawiera treść charakterystyczną dla PRIMARY-skilla
  (jego terminologia, struktura, checkpointy, formularze) BEZ odpowiadającego
  jej wywołania `view` widocznego w TEJ odpowiedzi?
    NIE → OK, ślad routingu wiarygodny
    TAK → ⛔ deklaracja ROUTER-WCZYTANY: TAK w KROK 3A jest FASADĄ — cofnij
          się, faktycznie wywołaj `view` na PRIMARY, PRZEPISZ blok KROK 3A
          zgodnie ze stanem faktycznym po wywołaniu
□ ⛔ [STAN-ZAŁADOWANY] KONTROLA PRZED ORZECZENIEM O SYSTEMIE (dodano 2026-09-10b, O-6):
  czy ta odpowiedź twierdzi, że w SYSTEMIE jest luka, błąd, brak pliku,
  nieaktualna treść albo niedomknięta flaga?
    NIE → OK
    TAK → czy porównałem wersję ZAŁADOWANĄ przez hosta z wersją w repozytorium?
          NIE → ⛔ NIE ORZEKAJ. Host bywa starszy od repozytorium o kilka wydań
                bez żadnego sygnału — zmierzone 2026-09-09/10: ocena prowadzona
                na kopii sesyjnej z routerem 3.41 zgłosiła jako usterkę systemu
                lukę, która w repozytorium (3.42) nie istniała.
          ⛔ Klasa błędu jak F-151: wniosek z jednego nośnika bez sprawdzenia
             drugiego. Zanim orzekniesz, wykonaj JEDNO z:
               • odczytaj `version:` z `SKILL.md` w repozytorium i zestaw
                 z wersją, którą masz w kontekście,
               • albo oznacz wniosek jako ⚠️ WARUNKOWY, z jawnym podaniem
                 wersji, na której pracujesz, i zastrzeżeniem, że nie została
                 zestawiona ze stanem repozytorium.
          Nigdy nie zgłaszaj usterki systemu jako ustalonej, mając jeden nośnik.
□ ⛔ [PROFIL-ODROCZENIA] KONTROLA NA WYJŚCIU (dodano 2026-09-10, F-175):
  czy w GOTOWEJ odpowiedzi padł wyzwalacz zasobu zadeklarowanego w KROKU 3A jako
  ODROCZONY (pierwszy URL, pierwszy artykuł, ≥2 daty, rozstrzygnięcie, oddanie
  wyniku)?
    NIE → OK
    TAK → czy widoczne jest odpowiadające mu wywołanie `view` W TEJ odpowiedzi?
          NIE → ⛔ bramka NIEWYKONANA. Odroczenie odczytu nie jest pominięciem
          bramki; wykonaj `view` i bramkę teraz albo oznacz ⛔ TRYB ZDEGRADOWANY.
          ⛔ Rdzeń R-1…R-5 nie podlega odroczeniu w żadnym profilu.
          Procedura pełna: view references/PROFIL-LEKKI.md
□ ⛔ VER-GRAIN — KONTROLA NA WYJŚCIU (reguła 24, F-132; wzorzec DOMAIN-LOCK):
  przejrzyj GOTOWĄ odpowiedź i policz w niej powołania wg ziarnistości —
  artykuł + §/ust./pkt, każdą kwotę, próg, termin, liczbę lat kary, datę,
  sygnaturę. Zestaw tę liczbę z liczbą wywołań weryfikacyjnych wykonanych
  w TEJ odpowiedzi.
    pokrycie pełne (albo brak pokrycia jawnie oznaczony ⚠️ przy POZYCJI)
      → OK
    powołanie bez pokrycia i bez znacznika → ⛔ STOP, nie wysyłaj; wykonaj
      weryfikację albo oznacz. Nie „domknij" tego zdaniem ogólnym o źródłach.
  ⛔ Szczególnie sprawdź powołania, które weszły do odpowiedzi Z MATERIAŁU
  UŻYTKOWNIKA lub z wcześniejszej tury tej rozmowy — są najczęściej pomijane,
  bo „już były". Reguła 9 nie zna wyjątku „już było w tej rozmowie".
□ Sprawdziłem termin zawity (nakaz/wyrok)?
□ [INTENT-DOCX] Pismo procesowe → delegowane do pisma-procesowe-v3?
   Status DRAFT/FINAL, watermark, CP-GATE — wyłącznie w pisma-procesowe-v3.
   Router nie zarządza checkpointami pisma — tylko deleguje.
□ Tryb LAIK → raport przez przewodnik-prawny-v2 (KROK H)?
□ Użytkownik pyta "co możesz zrobić" → przewodnik-prawny-v2 KROK M?
□ Zaoferowałem kreator (LAIK + pismo)?
□ ⛔ BRAMKA WYJĄTKÓW (WYJ-GATE) → powołałem ≥1 artykuł? Blok WYJ-GATE JEST
  w dostarczonym tekście i ma WSZYSTKIE cztery pozycje: S1 sąsiedztwo
  (z artykułami indeksowanymi), S2 krawędzie jednostki, S3 akty powiązane,
  S4 przepisy przejściowe?
  ⛔ POZYCJA BLOKUJĄCA: brak bloku albo brak którejkolwiek z czterech pozycji
  = bramka niewykonana, także gdy wynik zamiatania jest pusty.
□ Bramka chronologiczna → wykonana przy ≥2 dokumentach wieloetapowych?
  LAIK: pytanie a/b · PRAWNIK: 1-zdaniowa sugestia
□ "chronologia"/"oś czasu"/"timeline" → chronologia-sprawy-v1 natychmiast?
□ Raport Sytuacyjny → zaproponowany po piśmie [A] / po doc [B] / na żądanie [C]?
□ [DISCLAIMER] Odpowiedź z analizą prawną → shared/DISCLAIMER.md OSTATNIM elementem?
  □ Tryb LAIK → wariant uproszczony
  □ Tryb PRAWNIK → wariant pełny
  □ Pismo .docx → stopka na ostatniej stronie + disclaimer w wiadomości czatu

JEŚLI BLOK 0A nie zamknięty → wróć do KROK 0A
JEŚLI przepisy/liczby bez weryfikacji → cofnij się i weryfikuj
JEŚLI DOMAIN-LOCK wykrył przepis spoza PRIMARY bez podstawy → usuń przed wysłaniem
JEŚLI szereg stawek ma luki → nie podawaj kwoty łącznej
JEŚLI brak disclaimera → dodaj przed wysłaniem odpowiedzi
```

## Kontrola BI i źródeł zastępczych

□ Dla prawa polskiego odczytano kontroler BI z DR-16, bez kopii w routerze?
□ Próbowano pobrać akt/tekst z ISAP, a po niepowodzeniu wykonano ZRODLA-AKTOW-FALLBACK.md?
□ Zapisano oddzielnie identyfikację aktu, źródło treści, wersję i wynik odczytu?
□ Nie przedstawiono metryki lub ekranu logowania jako potwierdzenia brzmienia przepisu?
