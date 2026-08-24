# SELF-CHECK — Pełna Lista Kontrolna przed Każdą Odpowiedzią

> Plik wydzielony z prawny-router-v3/SKILL.md (R1).
> Wywołanie: `view /mnt/skills/user/prawny-router-v3/references/SELF-CHECK.md`

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
□ Sprawa karna → wczytałem mod-N-karne.md → mod-N zdecydował: kwalifikator TAK/NIE?
□ [ANTY-FASADA + AF-6] Wykonaj self-check antyfasadowy z modułu kanonicznego:
    view /mnt/skills/user/shared/SELF-CHECK-ANTY-FASADA.md
  ⛔ Treść listy NIE jest tu kopiowana (F-115, 2026-08-23i). Poprzednia kopia
    miała 1 z 2 pozycji: gdy F-117 dodała AF-6 do źródła, kopie nie zostały
    zaktualizowane. Jedno miejsce prawdy = jedno miejsce aktualizacji.
□ [DOMAIN-LOCK] ⛔ KONTROLA NA WYJŚCIU (nie na wejściu — dodano 2026-08-23):
  czy w GOTOWEJ odpowiedzi jest przepis spoza PRIMARY (KK/KKS/KW/KPK/KPW przy
  torze cywilnym/administracyjnym — lub odwrotnie)?
    NIE → OK
    TAK → (a) konkretny FAKT wypełniający znamię, nie skojarzenie?
          (b) wczytany dr-03 (lub właściwy DR) w TEJ odpowiedzi?
          (c) przepis przeszedł PRAWO-HARDGATE w TEJ odpowiedzi?
          którekolwiek NIE → ⛔ USUŃ powołanie.
          Procedura pełna: view /mnt/skills/user/shared/DOMAIN-LOCK.md
□ [RATE-COMPLETENESS] Odpowiedź zawiera odsetki / waloryzację / wskaźnik zmienny
  w czasie (dodano 2026-08-23)?
    NIE → OK
    TAK → przedział zapisany + reżim rozstrzygnięty (KC vs transakcje handlowe)
          + szereg podokresów BEZ LUK + znacznik na każdym wierszu?
          NIE → nie podawaj kwoty łącznej; pokaż tabelę z jawnymi ⬛.
          Procedura pełna: view /mnt/skills/user/shared/RATE-COMPLETENESS.md
□ Sygnatury orzeczeń przeszły V-SYG-1/2/3/4 (shared/SYGNATURY.md)?
□ Sklasyfikowałem do [1]–[10] (lub BJ–BW)?
□ Sprawdziłem shared/ACTIVATION-MATRIX.md przy nakładaniu się skillów?
□ Wczytałem PRIMARY skill PRZED analizą?
□ [KROK 3A ŚLAD ROUTINGU] Wypisałem blok TRYB/PRIMARY/SECONDARY/ODRZUCONE/
  WERSJA ROUTERA/ROUTER-WCZYTANY zaraz po KROK 3, przed KROK 4? Jeśli
  ROUTER-WCZYTANY: NIE dla PRIMARY → dodałem nagłówek ⛔ TRYB ZDEGRADOWANY?
□ [ŚLAD ROUTINGU] ⛔ KONTROLA NA WYJŚCIU (analogicznie do DOMAIN-LOCK, nie
  polegaj wyłącznie na własnej deklaracji z KROK 3A — dodano 2026-08-23f,
  po pytaniu użytkownika: pole ROUTER-WCZYTANY jest samo-raportem, który
  nic nie wymusza, jeśli wywołanie zostało pominięte bez błędu narzędzia):
  czy GOTOWA odpowiedź zawiera treść charakterystyczną dla PRIMARY-skilla
  (jego terminologia, struktura, checkpointy, formularze) BEZ odpowiadającego
  jej wywołania `view` widocznego w TEJ odpowiedzi?
    NIE → OK, ślad routingu wiarygodny
    TAK → ⛔ deklaracja ROUTER-WCZYTANY: TAK w KROK 3A jest FASADĄ — cofnij
          się, faktycznie wywołaj `view` na PRIMARY, PRZEPISZ blok KROK 3A
          zgodnie ze stanem faktycznym po wywołaniu
□ Sprawdziłem termin zawity (nakaz/wyrok)?
□ [INTENT-DOCX] Pismo procesowe → delegowane do pisma-procesowe-v3?
   Status DRAFT/FINAL, watermark, CP-GATE — wyłącznie w pisma-procesowe-v3.
   Router nie zarządza checkpointami pisma — tylko deleguje.
□ Tryb LAIK → raport przez przewodnik-prawny-v2 (KROK H)?
□ Użytkownik pyta "co możesz zrobić" → przewodnik-prawny-v2 KROK M?
□ Zaoferowałem kreator (LAIK + pismo)?
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
