# Audyt Matter Chat / Workspace

Data audytu: 2026-09-17

Zakres: aplikacja instalacyjna Lex Machina, model sprawy/wątku, routing skilli, pliki i foldery, know-how kancelarii, otwieranie zasobów zewnętrznych i lokalnych oraz cytowania dokumentów.

## Metoda

Audyt ma charakter techniczny i regresyjny. Dla każdego wymagania wskazuje implementację, granicę bezpieczeństwa i kryterium odbioru. Status `IMPLEMENTED / CI PENDING` oznacza, że kod jest obecny na gałęzi, ale finalny build 0.1.2 musi jeszcze przejść pełny zestaw GitHub Actions z tego samego SHA.

## A-01 — Jeden wątek = jedna sprawa

Status: IMPLEMENTED / CI PENDING

Dowody implementacyjne:

- `app/lex-web/src/MatterChatApp.tsx` — lista wątków oparta bezpośrednio o sprawy `MATTER`; wybór wątku ustawia `caseId`.
- `app/lex-web/src/case-thread.ts` — historia jest ładowana i dopisywana pod `/api/cases/:caseId/workspace/thread`.
- `app/lex-runtime/src/case-workspace-store.ts` — wiadomości są częścią szyfrowanego indeksu workspace konkretnej sprawy.
- `app/lex-runtime/src/case-file-store.ts` — fizyczna przestrzeń danych jest tworzona pod `cases/<caseId>`.

Ryzyko kontrolowane: mieszanie historii dwóch klientów/spraw w jednym stanie UI.

Kryterium odbioru: przełączenie `caseId` nie zachowuje historii poprzedniej sprawy; ponowne otwarcie sprawy odtwarza jej własny wątek.

## A-02 — Nazwa sprawy bez wymaganej sygnatury

Status: IMPLEMENTED / CI PENDING

- `createCase(displayName?)` nie wymaga sygnatury.
- UI pozwala utworzyć nazwę ręcznie i zmienić ją później przez `renameCase`.
- Pierwsza wiadomość może utworzyć sprawę z roboczą nazwą, którą użytkownik może następnie edytować.

Wniosek: nazwa biznesowa sprawy i przyszła sygnatura nie są utożsamiane.

## A-03 — Multi-skill i multi-domain

Status: IMPLEMENTED; deterministic tests existed and passed on earlier head; revalidation required on final SHA.

- Runtime może aktywować kilka skilli wykonawczych w jednej turze.
- Skill wykonawczy może delegować do innych skilli wykonawczych.
- Runtime może aktywować kilka DR, przy zachowaniu jednego technicznego `primarySkill` wymaganego przez istniejący kontrakt wykonania.
- Manualne priorytety nie eliminują dodatkowego automatycznego doboru, gdy Auto jest aktywne.

Przykład akceptacyjny: analiza sądowa + chronologia + analiza dowodów + raport klienta; równolegle prawo procesowe + cywilne + pracy, jeżeli stan faktyczny tego wymaga.

## A-04 — Struktura folderów sprawy i kancelarii

Status: IMPLEMENTED / CI PENDING

- `case-workspace-store.ts` przechowuje foldery i lokalizacje obiektów w szyfrowanym indeksie.
- Foldery są logiczne: zaszyfrowane bloby nie są przenoszone do jawnej struktury katalogowej.
- API zapewnia create/delete folder i move item.
- `WorkspaceManager.tsx` prezentuje strukturę folderów i pozwala zarządzać nią zgodnie z `canWrite`.

Kontrola bezpieczeństwa: nazwa folderu jest normalizowana, ograniczona długością, nie może zawierać separatorów ścieżki ani `.`/`..`.

## A-05 — Dodawanie, usuwanie i podgląd dokumentów

Status: IMPLEMENTED / CI PENDING

- Upload pozostaje w istniejącym chronionym pipeline prywatności.
- Lista workspace agreguje zaszyfrowane uploady oraz — dla workspace kancelarii — wzory.
- Usuwanie wymaga WRITE ACL; wzory kancelarii wymagają dodatkowo ADMIN.
- Preview jest generowany po odszyfrowaniu na żądanie i zwracany z `Cache-Control: no-store`.
- UI renderuje tekst/JSON, PDF oraz obrazy; inne formaty mogą zostać otwarte aplikacją systemową.

Ryzyko: preview może ujawnić treść użytkownikowi mającemu READ. Jest to zamierzone uprawnienie; treść nie jest wysyłana do zewnętrznego providera przez sam preview.

## A-06 — Otwieranie pliku w domyślnej aplikacji systemowej

Status: IMPLEMENTED / CI PENDING

Przepływ:

1. Runtime po ACL i odszyfrowaniu tworzy kopię tymczasową wyłącznie w `temp/LexMachinaOpen`.
2. Nazwa pliku udostępniana Tauri jest losowym tokenem `open_<32hex>[.ext]`, a nie arbitralną ścieżką z UI.
3. Tauri odrzuca separatory ścieżek, CR/LF i `..`, następnie kanonikalizuje root i target.
4. Windows uruchamia plik przez `rundll32 url.dll,FileProtocolHandler`, co deleguje do domyślnego skojarzenia systemowego.
5. Runtime usuwa stare kopie stagingowe starsze niż 1 godzina przy kolejnych operacjach open.

Wniosek bezpieczeństwa: UI nie może wskazać dowolnego lokalnego pliku poza kontrolowanym katalogiem stagingowym.

## A-07 — Linki internetowe do przeglądarki

Status: IMPLEMENTED / native compile/test pending on final SHA

- `open_external_url` akceptuje wyłącznie `https://` i odrzuca CR/LF.
- Windows używa systemowego `FileProtocolHandler`, macOS `open`, Linux `xdg-open`.
- Używane dla stron klucza API i oficjalnych źródeł prawnych prezentowanych w czacie.
- Web fallback korzysta z `window.open(..., "noopener,noreferrer")`.

Ograniczenie audytu: CI nie powinno automatycznie otwierać realnej przeglądarki na runnerze. Weryfikacja opiera się na testach walidacji wejścia, kompilacji natywnej oraz installed-copy acceptance aplikacji. Manualny smoke test kliknięcia pozostaje zalecany przed dystrybucją zewnętrzną.

## A-08 — Cytowania dokumentów i deep-link do fragmentu

Status: IMPLEMENTED / CI PENDING

Granica zaufania:

- Model otrzymuje instrukcję używania markera `[[LEXDOC:<documentId>:<chunkIndex>]]` wyłącznie dla chunków obecnych w kontekście.
- `processDocumentCitationMarkers` rozwiązuje marker tylko względem faktycznie załączonych chunków. Nieznany `documentId/chunkIndex` jest odrzucany.
- Cytat dosłowny jest oznaczany jako exact highlight wyłącznie, gdy jego tekst rzeczywiście występuje w `contextText`; dozwolone jest tylko składanie białych znaków, bez fuzzy semantic matching.
- Publiczny tekst zawiera wyłącznie wygenerowany przez backend `LEXDOCREF`.
- `DocumentCitationContent.tsx` zamienia go w przycisk, przewija do panelu cytowanego chunka, ustawia fokus i wyróżnia zakres `<mark>`.
- Gdy brak exact match, UI pokazuje stronę i cały źródłowy chunk bez fałszywego oznaczenia cytatu dosłownego.

Wniosek: link do dokumentu jest kontrolowany przez dane runtime, a nie przez dowolny link/ścieżkę wygenerowaną przez LLM.

## A-09 — Szyfrowanie, ACL i rotacja kluczy

Status: IMPLEMENTED

- Uploady, dokumenty przetworzone, artefakty i workspace są związane z case data key.
- Workspace ma własny klucz pochodny HKDF i AES-256-GCM.
- `CaseSecurityRotationCoordinator` uwzględnia workspace w rotacji/rekey.
- Operacje READ/WRITE przechodzą przez `LocalCaseAccessService`.

Wniosek: nowa organizacja folderów/wątków nie omija dotychczasowej granicy kryptograficznej sprawy.

## A-10 — Ryzyka regresji do objęcia CI

Status: OPEN UNTIL FINAL 0.1.2 ACCEPTANCE

Finalny SHA musi wykazać:

- strict TS runtime + web,
- unit tests workspace i document citations,
- G14 bundle safety z markerami nowych funkcji,
- G34G natywne testy Tauri, w tym walidację HTTPS i tokenów plików,
- G37F file input + drag/drop,
- P4B lifecycle,
- G36 legal skill completeness,
- Windows online installed-copy acceptance,
- Windows offline standalone clean-machine acceptance.

## Ocena końcowa audytu na tym etapie

Architektura spełnia żądany model prywatności: sprawa jest podstawową granicą danych i rozmowy, foldery są metadanymi wewnątrz zaszyfrowanego workspace, lokalne pliki są otwierane przez ograniczony staging token, a deep-link cytowania jest rozwiązywany po stronie zaufanego runtime. Finalny status release pozostaje `CI PENDING` do czasu przejścia wszystkich bramek z jednego, niezmienionego SHA i publikacji nowych instalatorów 0.1.2.
