# Lex Machina — roadmap aplikacji instalacyjnej

Stan na: 2026-09-17

Roadmapa obejmuje produkt instalacyjny Windows i jest traktowana jako kontrakt zakresu dla kolejnych bramek CI. Zmiana oznaczona jako `DONE` powinna mieć co najmniej test lub walidator strukturalny/bundle oraz nie może zostać usunięta bez jawnej zmiany roadmapy i audytu regresji.

## R0.1.2 — Matter Chat / Workspace

### M1 — Jeden wątek = jedna sprawa — DONE

- Każda sprawa `MATTER` ma własny `caseId`, fizyczny katalog danych i szyfrowany workspace.
- Historia czatu jest przechowywana w szyfrowanym indeksie workspace konkretnej sprawy.
- Przełączenie wątku przełącza `caseId` i ładuje wyłącznie historię tej sprawy.
- Pierwsza wiadomość może utworzyć nową sprawę, jeżeli użytkownik nie wybrał istniejącej.
- Nazwa sprawy jest dowolna i edytowalna; sygnatura sądowa nie jest wymagana przy utworzeniu.

### M2 — Routing wieloskillowy i wielodziedzinowy — DONE

- `prawny-router-v3` i `shared` pozostają obowiązkowe.
- Tryb `Automatyczny` jest domyślny.
- Jedna tura może uruchomić kilka skilli wykonawczych, np. analiza sądowa + chronologia + analiza dowodów + raport.
- Jedna tura może objąć kilka dziedzin prawa (kilka DR).
- Użytkownik może wskazać kilka priorytetowych skilli wykonawczych i kilka dodatkowych skilli/domen.
- Ręczny wybór nie blokuje automatycznego doboru kolejnych modułów, jeśli Auto jest aktywne.

### M3 — Akta sprawy: pliki i foldery — DONE

- Dodawanie wielu plików przez eksplorator i drag&drop.
- Szyfrowane przechowywanie uploadów per sprawa.
- Logiczna, szyfrowana hierarchia folderów niezależna od fizycznego położenia zaszyfrowanych blobów.
- Tworzenie folderów i podfolderów.
- Usuwanie pustych folderów.
- Przenoszenie dokumentów między folderami.
- Usuwanie dokumentów z kontrolą ACL.
- Usunięcie uploadu usuwa również odpowiadające mu dokumenty pochodne OCR/chunki, wpisy prywatnego vaultu oraz stan in-memory; dotyczy także przetworzonych elementów ZIP.
- Podgląd tekstu, JSON, PDF i obrazów w aplikacji tam, gdzie jest to bezpiecznie obsługiwane.
- Otwieranie dokumentu w domyślnej aplikacji systemowej z kontrolowanego pliku tymczasowego.

### M4 — Know-how i wzory kancelarii — DONE

- Osobny `FIRM_KNOWLEDGE` workspace objęty ACL i szyfrowaniem.
- Dodawanie dokumentów know-how przez ten sam pipeline prywatności.
- Biblioteka wzorów kancelarii.
- Foldery logiczne dla know-how i wzorów.
- Podgląd, przenoszenie i usuwanie zgodnie z rolą użytkownika.
- Otwieranie wybranego pliku/wzoru w domyślnej aplikacji systemowej na desktopie.

### M5 — Linki zewnętrzne i aplikacje systemowe — DONE

- Linki internetowe z UI desktopowego są przekazywane do domyślnej przeglądarki systemowej.
- Tauri dopuszcza wyłącznie `https://` dla linków zewnętrznych.
- Link do strony uzyskania klucza API używa tego samego mechanizmu.
- Linki do oficjalnych źródeł w odpowiedzi używają tego samego mechanizmu.
- Otwieranie lokalnego pliku nie przyjmuje arbitralnej ścieżki z UI: runtime wystawia wyłącznie losowy token kontrolowanego pliku tymczasowego, a Tauri kanonikalizuje ścieżkę wewnątrz `LexMachinaOpen`.

### M6 — Cytowania dokumentów i deep-link in-chat — DONE

- Model może użyć wyłącznie wewnętrznego markera `LEXDOC` wskazującego istniejący `documentId` i `chunkIndex` z aktywnego kontekstu.
- Backend odrzuca wymyślone lub nieistniejące markery.
- Publiczna odpowiedź otrzymuje kontrolowany marker `LEXDOCREF` oraz metadane strony/chunka.
- Przy cytacie dosłownym backend zaznacza tekst tylko wtedy, gdy cytat rzeczywiście występuje w źródłowym chunku (bez fuzzy semantic matching).
- Kliknięcie odnośnika w czacie przewija do panelu źródłowego fragmentu, ustawia fokus i wyróżnia dokładny cytat.
- Odnośnik bez dokładnego dopasowania nadal pokazuje źródłowy chunk i stronę, ale nie deklaruje dosłownego cytatu.

### M7 — Cykl życia sprawy — DONE

- Utworzenie sprawy.
- Zmiana nazwy.
- Archiwizacja i przywrócenie.
- Archiwalna sprawa jest tylko do odczytu.
- Trwałe usunięcie wymaga uprawnień i ponownej autoryzacji zgodnie z istniejącym kontraktem bezpieczeństwa.

### M8 — Automatyczny OCR i prywatność plik po pliku w czacie — DONE

- Dodanie obrazu uruchamia lokalny OCR automatycznie.
- PDF jest analizowany strona po stronie; użyteczna warstwa tekstowa jest wykorzystywana bez OCR, a strony skanowane są automatycznie kierowane do OCR.
- Kolejka wieloplikowa jest sekwencyjna: kolejny plik nie przechodzi do decyzji prywatności, dopóki bieżący nie zostanie sfinalizowany albo jawnie pominięty.
- Każdy plik otrzymuje własny `documentId` i własny wpis w zaszyfrowanym `PseudonymizationVault`.
- Dla każdego pliku użytkownik osobno wybiera: automatyczna pseudonimizacja, ręczny przegląd decyzji albo jawne pozostawienie wykrytych danych bez anonimizacji (`KEEP`).
- Po finalizacji maksymalnie 32 pierwsze chunki pliku mogą zostać automatycznie zaznaczone do bieżącej analizy; limit bezpośrednich dokumentów jednej sesji nadal jest egzekwowany przez runtime.
- Przy generowaniu dokumentów z wielu źródeł tokeny są przestrzenią nazw per dokument (`D01`, `D02`, …), a kontrolowana deanonymizacja rozwiązuje wartości z vaultu konkretnego `documentId` po istniejącej reautoryzacji.
- Odpowiedzi czatu nie są automatycznie deanonymizowane z pominięciem istniejącej granicy bezpieczeństwa G34F.
- Dialog OCR/prywatności jest częścią toku czatu; zakładka `Akta` służy do późniejszego zarządzania zapisanymi dokumentami i folderami.

### M9 — Release 0.1.2 — IN PROGRESS

Kryteria zamknięcia:

- strict TypeScript runtime + web: PASS,
- testy jednostkowe routingu, workspace, OCR/prywatności i cytowań: PASS,
- G14 browser bundle safety z markerami nowych funkcji: PASS,
- G34G Tauri compile/trust-boundary: PASS,
- pełny deterministyczny zestaw runtime: PASS,
- Windows Online Installer: NSIS + installed-copy acceptance: PASS,
- Windows Offline Installer: standalone EXE + clean-machine acceptance: PASS,
- artefakty i SHA-256 opublikowane z finalnego SHA.

## Kolejny horyzont

### R0.2 — rozszerzenia workflow — PLANNED

- Jawne pole metadanych `sygnatura` niezależne od nazwy sprawy.
- Rename/move folderów metodą drag&drop.
- Wyszukiwanie pełnotekstowe po nazwach plików/folderów.
- Historia wersji dokumentów kancelarii.
- Kontrolowane porównywanie wersji dokumentu.
- Rozbudowany viewer DOCX/ODT/XLSX bez opuszczania aplikacji, jeśli można go wdrożyć bez obniżenia granicy prywatności.
