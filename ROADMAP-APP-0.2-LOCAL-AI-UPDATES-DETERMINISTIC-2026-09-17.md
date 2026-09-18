# Lex Machina — Roadmap aplikacji 0.2: Local AI, aktualizacje i deterministyczny execution engine

Data audytu: **2026-09-17**  
Status: **PROPOSAL / IN EXECUTION**  
Bazowy release: `WERSJA APLIKACJA/0.1.0-2026-09-17/RELEASE.json`  
Bazowy source SHA release 0.1.0: `726b26c0ec35b6f773feefe0dfd575f5c9a396ef`

## 1. Cel

Rozszerzyć aplikację Lex Machina o cztery spójne warstwy:

1. prywatny lokalny inference runtime oraz dwa preinstalowane profile modeli: **Bielik** i **Mistral/Ministral**;
2. niezależny, bezpieczny mechanizm aktualizacji **skilli** oraz mechanizm aktualizacji **samej aplikacji**;
3. instalator rozpoznający istniejącą instalację i przechodzący jawnie w tryb `Fresh`, `Upgrade` albo `Repair`, bez pustych pól wynikających z braku hydratacji stanu;
4. deterministyczny execution engine dla kroków proceduralnych, bramek, routingu, dokumentów i walidacji, z pozostawieniem modelowi LLM zadań semantycznych i merytorycznych.

Nie należy tworzyć drugiego równoległego systemu wykonawczego. Zmiany mają wejść w istniejący model prywatnego runtime, `component-lock.json`, fail-closed gates, audytu i trust boundary.

---

## 2. Reconciliation bieżącego stanu release i starszej roadmapy

### 2.1. Co jest faktycznie potwierdzone przez release 0.1.0

`RELEASE.json` z 2026-09-17 potwierdza dla Windows x86-64:

- `f138StructuralAudit = PASS`;
- `runtimeValidation = PASS`;
- `onlineInstalledCopy = PASS`;
- `offlineCleanMachineNetworkBlocked = PASS`;
- installer online działa jako `PER_COMPONENT_VERIFIED_DOWNLOAD`;
- publikowane artefakty mają zapisane SHA-256 i rozmiary.

Wniosek: starszych wpisów roadmapy o braku całego G33A/G33B nie wolno mechanicznie przenosić jako nadal otwartych. Release 0.1.0 dowodzi działającego modelu instalacji online/offline oraz clean-machine acceptance.

### 2.2. Co pozostaje nieudowodnione przez release 0.1.0

Sam rekord release nie dowodzi pełnego, transakcyjnego updatera aplikacji z:

- signed update metadata;
- stagingiem;
- migracją schematu z backupem;
- self-testem przed aktywacją;
- atomowym przełączeniem wersji;
- rollbackiem po nieudanej aktywacji.

To odpowiada wcześniej otwartemu zakresowi `G37E2` i powinno pozostać OPEN do osobnej akceptacji.

### 2.3. Otwarte / wymagające ponownej walidacji gate’y z poprzedniej roadmapy

| Gate | Stan po audycie 2026-09-17 | Decyzja |
|---|---|---|
| G30 Open Web Discovery | OPEN niezależny | pozostawić równoległy, nie blokować Local AI |
| G33A/B installer payload | release 0.1.0 daje istotny dowód PASS | nie otwierać ponownie bez regresji |
| G33C guided setup/repair | częściowo potwierdzone instalacją, ale UX `Fresh/Upgrade/Repair` wymaga rozszerzenia | rozszerzyć jako G39G |
| G33D update/rollback | brak pełnego dowodu transakcyjnego update | zakres przechodzi do G39F/G39J |
| G37B first-admin bootstrap | OPEN / desktop dependency | bez zmian |
| G37D support identity | OPEN / desktop dependency | bez zmian |
| G37E2 signed updater | OPEN | scalić z G39F |
| G37F multi-file UX | OPEN | bez zmian |
| G37G cleanup/signed release | wymaga rewalidacji; obecny `main` i source release są unsigned | powiązać z G39J |

### 2.4. Dodatkowe ustalenie bezpieczeństwa

Source commit release 0.1.0 oraz bieżący commit `main` są raportowane przez GitHub jako `verification.verified = false` / `reason = unsigned`. Jednocześnie branch `main` nie jest chroniony. Hashy artefaktów i provenance workflow nie należy z tym mylić: są wartościowe, ale nie zastępują podpisanego łańcucha wydania.

Dla 0.2 wymagane jest podpisanie release metadata/artifacts oraz minimalna ochrona gałęzi wydaniowej.

---

# 3. G39A — PRIVATE LOCAL INFERENCE RUNTIME

## Cel

Uruchamiać lokalny model wyłącznie na żądanie użytkownika, bez globalnego serwisu i bez zależności od osobnej instalacji Ollama/LM Studio.

## Decyzja architektoniczna

**Domyślny runtime: prywatny, bundlowany `llama.cpp` / równoważny natywny runner GGUF.**

Ollama może zostać dodana później jako `External Provider Adapter`, ale nie jako wymagany składnik podstawowej instalacji. Prywatny runner lepiej pasuje do istniejącego trust boundary Lex Machina: można go przypiąć wersją, hashem, licencją, self-testem i `component-lock.json`.

## Wymagany kontrakt komponentu

Każdy inference component musi mieć:

- `componentId`;
- dokładną wersję builda;
- platformę / architekturę;
- URL artefaktu albo identyfikator artefaktu release;
- SHA-256;
- rozmiar;
- licencję;
- upstream source revision;
- backendy CPU/Vulkan/CUDA zależnie od builda;
- wynik self-testu;
- kompatybilność z wersją aplikacji i modelem.

## Runtime lifecycle

`STOPPED -> STARTING -> READY -> BUSY -> STOPPING -> STOPPED`

Błędy przechodzą do `FAILED_QUARANTINED`; aplikacja nie może udawać gotowości modelu.

## Kryterium PASS G39A

- clean Windows VM uruchamia prywatny runner z katalogu runtime;
- runner nie nasłuchuje publicznie, wyłącznie loopback / IPC;
- hash runnera odpowiada manifestowi;
- aplikacja potrafi uruchomić, sprawdzić health, wykonać jedną generację i zatrzymać proces;
- po zamknięciu modelu pamięć jest zwalniana;
- brak wymagania globalnej instalacji Python/Ollama.

---

# 4. G39B — MODEL PACKS: BIELIK + MISTRAL/MINISTRAL

## Profile bazowe

### Bielik

Preferowany profil jakościowy: `Bielik-11B-v3.0-Instruct`.

- silny profil polskojęzyczny;
- oficjalne quantizations/GGUF są dostępne;
- licencja Apache-2.0 wg model card;
- natywne `max_position_embeddings = 32768`.

Dodatkowy fallback sprzętowy może używać `Bielik-Minitron-7B-v3.0-Instruct`, ale UI ma prezentować go jako profil oszczędny, nie jako równoważny jakościowo zamiennik.

### Mistral

Preferowany profil lokalny dla 0.2: `Ministral 3 14B` (rodzina Mistral).

- model projektowany z myślą o lokalnym wdrożeniu;
- Apache-2.0 wg aktualnej dokumentacji Mistral;
- natywne okno kontekstu 256k;
- mniejszy i bardziej realistyczny do dystrybucji lokalnej niż pełny Mistral Small 4.

## Ważne: context capability != domyślny runtime context

Nie ustawiać automatycznie maksymalnego okna tylko dlatego, że model je obsługuje. Długi KV cache jest kosztowny pamięciowo.

Aplikacja ma wyliczać `safeRuntimeContext` na podstawie RAM/VRAM i profilu quantization. Przykładowe klasy polityki:

- low-memory: 8k;
- standard: 16k;
- performance: 32k;
- high-memory: 64k+;
- extended/native-max: jawnie wybrany i poprzedzony testem pamięci.

## Model pack, nie surowe pobranie z Internetu

Nie polegać produkcyjnie na przypadkowym community GGUF.

Release pipeline powinien:

1. przypiąć oficjalny upstream commit/model revision;
2. pobrać zweryfikowane upstream weights;
3. deterministycznie przekonwertować/quantyzować do wspieranego formatu;
4. wykonać test generacji i context smoke test;
5. zapisać SHA-256 pliku wynikowego;
6. opublikować `LexMachina-ModelPack-<id>-<version>` jako podpisany artefakt release;
7. dodać notices/licencję/model card snapshot.

## Preinstalacja

Warianty instalatora:

- `Online` — opcja **Local AI (Bielik + Mistral)** domyślnie zaznaczona; oba model packs są pobierane podczas instalacji po pokazaniu rozmiaru i sprawdzeniu miejsca;
- `Offline Core` — bez ciężkich wag, dla najmniejszego pakietu;
- `Offline AI Full` — zawiera runner oraz oba model packs i nie wymaga sieci po uruchomieniu instalatora.

Jeżeli produkt wymaga dosłownie jednego offline EXE, `Offline AI Full` może być osobnym, większym artefaktem obok obecnego `Offline Setup`; nie należy automatycznie powiększać podstawowego instalatora o kilkanaście/kilkadziesiąt GB bez jawnej informacji.

## Kryterium PASS G39B

- oba modele instalują się przez ten sam verified component mechanism;
- aplikacja potrafi przełączać model bez restartu całej aplikacji;
- tylko jeden ciężki model jest aktywny naraz domyślnie;
- model manager pokazuje: wersję, quantization, hash, rozmiar, licencję, native context i aktualny runtime context;
- usunięcie model packa nie usuwa aplikacji ani skilli.

---

# 5. G39C — EXTENDED EFFECTIVE CONTEXT

## Problem

Bielik 11B v3 ma natywne 32k. Sztuczne ustawienie 64k/128k bez odrębnej walidacji RoPE nie może być domyślną funkcją produkcyjną, szczególnie dla zadań prawnych.

## Rozwiązanie

Dodać `Context Orchestrator` niezależny od modelu:

- deterministyczny podział dokumentów na jednostki źródłowe;
- indeks lokalny;
- retrieval po identyfikatorach dokumentów i stron/sekcji;
- budżet tokenów per etap;
- streszczenia kompresyjne przechowywane oddzielnie od materiału źródłowego;
- obowiązkowy backlink każdej skompresowanej jednostki do źródła;
- ponowny retrieval oryginału przed finalnym cytowaniem lub twierdzeniem prawnym;
- ochrona przed "summary drift".

W UI rozróżniać:

- `Native context` — faktyczne okno modelu;
- `Active context` — bieżący limit inference;
- `Effective case context` — rozmiar korpusu, który aplikacja może obsłużyć przez retrieval/orchestration.

## PASS G39C

Test wielodokumentowy wykazuje, że odpowiedź korzysta z danych spoza jednego aktywnego okna, a każdy przytoczony fragment da się odtworzyć do konkretnego dokumentu i lokalizacji.

---

# 6. G39D — LOCAL MODEL MANAGER UI

Nowa sekcja ustawień: `Modele lokalne`.

Per model:

- `Installed / Not installed / Update available / Broken / Quarantined`;
- wersja;
- źródło;
- hash;
- rozmiar na dysku;
- wymagania sprzętowe;
- native context;
- wybrany runtime context;
- przyciski `Uruchom`, `Zatrzymaj`, `Aktualizuj`, `Napraw`, `Usuń`;
- jawny wynik self-testu.

Przed pierwszym uruchomieniem wykonać hardware probe oraz zasugerować bezpieczny profil. Decyzja użytkownika jest zapisywana, ale można ją zmienić.

---

# 7. G39E — SKILL UPDATE TRANSACTION

Aktualizacja skilli ma być niezależna od wersji aplikacji.

## Manifest

Wprowadzić podpisany `skills-index.json` z rekordem:

```json
{
  "skillId": "prawny-router-v3",
  "version": "3.53",
  "schemaVersion": 1,
  "sha256": "...",
  "bytes": 0,
  "minAppVersion": "0.2.0",
  "maxAppVersion": null,
  "dependencies": [],
  "releaseId": "..."
}
```

## Transakcja

`CHECK -> RESOLVE -> DOWNLOAD_STAGING -> VERIFY -> STRUCTURAL_AUDIT -> COMPATIBILITY_TEST -> ATOMIC_ACTIVATE -> HEALTHCHECK -> COMMIT`

Błąd po `ATOMIC_ACTIVATE` wywołuje `ROLLBACK`.

## UX

`Sprawdź aktualizacje` ma zwracać osobne sekcje:

- **Aplikacja**;
- **Skille**;
- **Modele lokalne**.

Dla skilli użytkownik może wybrać `Aktualizuj wszystkie` albo pojedyncze paczki. Po aktualizacji pokazać wersję `stara -> nowa`, wynik audytu i ewentualne zmiany zależności.

## Zasady bezpieczeństwa

- skill package nie może wykonywać dowolnego post-install script bez deklaracji i polityki uprawnień;
- brak zgodności dependencies = brak aktywacji;
- aktywna wersja pozostaje dostępna do rollbacku;
- runtime nigdy nie miesza plików dwóch wersji jednego skilla.

## PASS G39E

Test obejmuje update routera zależnego od `shared`, przerwany download, zły hash, niezgodną zależność, nieudany audit i rollback.

---

# 8. G39F — APPLICATION UPDATE TRANSACTION

Updater aplikacji ma wykorzystywać installer jako wykonawcę aktualizacji, a nie kopiować pliki aplikacji "na żywo".

## Przebieg

`DISCOVER -> SHOW_RELEASE -> USER_APPROVAL -> DOWNLOAD -> VERIFY_SIGNATURE -> VERIFY_SHA256 -> STAGE -> BACKUP_SCHEMA -> LAUNCH_INSTALLER_UPGRADE -> SELFTEST -> COMMIT`

Jeżeli self-test nie przejdzie:

`ROLLBACK_APP -> RESTORE_SCHEMA_IF_NEEDED -> REPORT`

## Wymagania

- signed release metadata;
- artefakt przypięty do immutable release;
- hash i rozmiar;
- kompatybilność z platformą;
- migracje danych wersjonowane i odwracalne albo poprzedzone backupem;
- brak cichej aktualizacji bez decyzji użytkownika;
- checker może działać nieblokująco, ale instalacja wymaga approval.

## PASS G39F

Akceptacja na clean VM z upgrade `N -> N+1`, repair tej samej wersji oraz rollback po celowo uszkodzonym self-teście.

---

# 9. G39G — INSTALLER STATE MACHINE / NAPRAWA PUSTYCH PÓL

## Problem obecny

Aktualny NSIS hook release 0.1.0 wykonuje online/offline bootstrap i final self-test, ale nie ma własnego etapu hydratacji istniejącej instalacji przed UI.

## Nowy preflight

Przed renderowaniem pól instalatora uruchomić `InstallStateProbe`.

Źródła stanu w kolejności:

1. canonical uninstall/install registry entry;
2. manifest instalacji Lex Machina w katalogu aplikacji;
3. `component-lock.json`;
4. katalog danych użytkownika / schema version;
5. fallback: skan wyłącznie kanonicznych ścieżek, bez zgadywania po nazwach losowych folderów.

## Tryby

### `FRESH`

Brak poprawnej istniejącej instalacji.

### `UPGRADE`

Znaleziono wersję starszą niż instalowany target.

UI:

- `Zainstalowana: x.y.z`;
- `Nowa: a.b.c`;
- ścieżka domyślnie z istniejącej instalacji;
- zachowanie danych, konfiguracji i cache modeli;
- jawna lista migracji.

### `REPAIR`

Ta sama wersja jest zainstalowana lub brakuje komponentów / lock jest niespójny.

UI:

- `Napraw instalację`;
- ponowna weryfikacja runtime/model packs;
- pobranie tylko brakujących/uszkodzonych składników.

### `DOWNGRADE_BLOCKED`

Target starszy niż installed. Domyślnie blokada z instrukcją, chyba że istnieje jawnie wspierany downgrade path.

## PASS G39G

Brak pustych pól, gdy istniejąca instalacja zawiera kompletne dane. Testy: fresh, upgrade, repair, przeniesiony/uszkodzony runtime, brak registry przy zachowanym manifeście oraz niekompletny manifest.

---

# 10. G39H — DETERMINISTIC EXECUTION ENGINE

## Decyzja

**Tak: warto przenieść mechaniczne kroki ze skilli do kodu. Nie warto przenosić do kodu całej merytoryki skilli.**

Obecne skille już opisują sztywne sekwencje, automaty stanów, checkpointy i fail-closed gates. Przykłady:

- `prawny-router-v3` posiada nieredukowalną kolejność odczytów i routing `[1]-[11]`;
- `pisma-proste-v2` ma obowiązkową ścieżkę KROK 1-10;
- `pisma-procesowe-v3` wprost definiuje `AUTOMAT-STANOW`, CP-GATE, MRG i STEP-TRACKER;
- `analizator-dowodow-v3` deklaruje pipeline stages w front matter;
- `analiza-sadowa-v6` wymusza sekwencyjne przejścia i odrębne bramki walidacji.

To są elementy o charakterze programistycznym, a nie językowym. Kod wykona je pewniej, taniej i audytowalnie.

## Podział odpowiedzialności

### Deterministyczny kod

- stan workflow i kolejność etapów;
- sprawdzenie wymaganych zasobów;
- rozwiązywanie dependencies;
- routing regułowy tam, gdzie kryterium jest formalne;
- rejestr kroków i checkpointów;
- blokady `STOP/fail-closed`;
- hierarchia źródeł jako polityka dopuszczalności;
- rejestr i pokrycie cytatów;
- walidacja obecności wymaganych sekcji dokumentu;
- obliczenia i terminy wyłącznie z wersjonowanej reguły/datasetu;
- walidacja danych wejściowych;
- budowa DOCX/ODT/PDF oraz post-validation;
- redaction/privacy gates;
- provenance i audit log;
- retries/timeouts/tool dispatch;
- aktualizacje i compatibility gates.

### LLM / skill

- interpretacja niejednoznacznego opisu;
- issue spotting;
- kwalifikacja, gdy wymaga rozumowania, a nie tabeli decyzji;
- wykładnia;
- synteza konfliktujących źródeł;
- argumentacja;
- analiza adversarialna;
- strategia;
- tworzenie treści uzasadnienia;
- negocjacje/redakcja semantyczna;
- wyjaśnienie wyniku użytkownikowi.

### Hybryda

Najważniejsza kategoria. Kod steruje grafem, model wykonuje konkretne semantyczne node’y, a wynik każdego node’a ma schema validation i bramkę przed przejściem dalej.

---

# 11. G39I — DETERMINISTIC MIGRATION MATRIX DLA SKILLI WYKONAWCZYCH

| Skill / rodzina | Docelowy model | Co przenieść do kodu | Co pozostawić w skillu/LLM |
|---|---|---|---|
| `prawny-router-v3` | **HYBRID, wysoki udział deterministic** | preflight, jurysdykcja z jawnych danych, wymagane odczyty, dispatch table, dependencies, hard gates, source policy | semantyczna klasyfikacja niejednoznacznego opisu i fallback |
| `pisma-proste-v2` | **HYBRID, bardzo wysoki deterministic** | intake schema, wybór szablonu, required fields, kolejność M1-M9, opłata/termin gate, assembly, validation | faktyczne brzmienie argumentacji i opis stanu faktycznego |
| `pisma-procesowe-v3` | **HYBRID, bardzo wysoki deterministic** | automat stanów, CP registry, MRG, tracker, required/optional steps, finalization rules, watermark/status | strategia, argumentacja, kontrargumenty, synteza materiału |
| `analiza-sadowa-v6` | **HYBRID** | skan plików, przebiegi/stage isolation, kompletność, evidence IDs, verification checkpoints | kwalifikacja, adversarial reasoning, ocena znaczenia materiału |
| `analizator-dowodow-v3` | **HYBRID** | inventory, provenance graph, macierz dowód×teza, coverage, contradiction detection primitives | znaczenie dowodu, hipotezy, interpretacja konfliktów |
| `analizator-przepisow-v2` | **HYBRID** | pobranie wersji aktu, timeline zmian, status obowiązywania, source hierarchy, citation validation | wykładnia, zbieg norm, argumentacja interpretacyjna |
| `chronologia-sprawy-v1` | **DETERMINISTIC/HYBRID** | ekstrakcja dat do schema, sortowanie, konflikty dat, wyliczenia wersjonowane | interpretacja skutków prawnych i braków |
| `orzeczenia-sadowe-v2` | **HYBRID** | query building, dedupe, provenance, status źródła, citation fields | podobieństwo problemu prawnego, ratio/znaczenie orzeczenia |
| `analizator-umow-v1` | **HYBRID** | clause inventory, required-clause checks, diff, risk evidence links, document assembly | scoring semantyczny, negocjacje, propozycje brzmienia |
| `przesluchanie-swiadkow-v2-min90` | **HYBRID** | struktura etapów, question IDs, coverage matrix, zakazy formalne | tworzenie pytań i adaptacja do odpowiedzi/faktów |
| `raport-sytuacyjny-v2` | **wysoki deterministic** | JSON schema, składanie sekcji, walidacja danych, render | synteza narracyjna i wyjaśnienia |
| `raport-klienta-v1` | **wysoki deterministic** | layout, wymagane sekcje, dane liczbowe, źródła | język klienta, streszczenie, rekomendowane opcje do rozważenia |
| `przewodnik-prawny-v2` | **HYBRID** | sterowanie intake, wybór ścieżki, status kroków | dialog, wyjaśnianie, rozpoznanie intencji |
| DR-01..DR-16 | **głównie SKILL + deterministic source gates** | source/tool policy, dependency loading, schema, gates | wiedza dziedzinowa, interpretacja, kwalifikacja |
| `audyt-systemu-v4` | **maksymalnie deterministic** | wszystkie możliwe checki strukturalne, consistency, dependency graph, hashes, tests | generowanie opisu ustaleń i propozycji napraw |
| `shared` | **policy-as-code tam, gdzie możliwe** | canonical schemas, gates, source tiers, validators | tylko instrukcje wymagające oceny semantycznej |

## Zasada migracji

Nie usuwać od razu instrukcji ze skilla. Najpierw:

1. wdrożyć deterministyczny odpowiednik;
2. dodać test porównawczy `skill-only vs engine-controlled`;
3. oznaczyć instrukcję skilla jako `runtime-enforced`;
4. dopiero po dwóch kolejnych release’ach bez regresji skrócić duplikat instrukcji w SKILL.md.

Chroni to przenośność skilli do innych hostów.

---

# 12. TRYBY PRACY UŻYTKOWNIKA

## `Guided / Deterministic`

Użytkownik wybiera cel, np.:

- Pismo proste;
- Pismo procesowe;
- Analiza sprawy;
- Analiza dowodów;
- Analiza przepisu;
- Analiza umowy;
- Chronologia;
- Orzecznictwo;
- Raport.

Aplikacja uruchamia z góry zdefiniowany workflow graph. LLM jest wywoływany tylko w node’ach semantycznych.

## `Automatic`

Orchestrator może sam rozpoznać cel i dobrać skille/moduły.

**Nie wyłączać jednak deterministycznych invariantów w trybie Automatic.**

Automatyczny tryb może zyskać większą swobodę w wyborze narzędzi i kolejności semantycznych podzadań, ale poniższe warstwy pozostają zawsze aktywne:

- security/trust boundary;
- source/citation gates;
- privacy/redaction;
- audit/provenance;
- final document validation;
- update integrity;
- fail-closed gates wymagane przez aktywny typ zadania.

W przeciwnym razie `Automatic` byłby jakościowo mniej bezpieczny niż tryb ręczny, co jest złym kontraktem produktu.

---

# 13. EXECUTION GRAPH — PROPONOWANY KONTRAKT

Każdy workflow definiować jako wersjonowany manifest, np.:

```yaml
id: legal.simple-letter.v1
input_schema: schemas/simple-letter-input.json
nodes:
  - id: intake
    kind: deterministic
  - id: classify
    kind: llm_structured
    output_schema: schemas/simple-letter-classification.json
  - id: source_gate
    kind: deterministic
  - id: legal_reasoning
    kind: llm_structured
  - id: draft
    kind: llm_structured
  - id: citation_validation
    kind: deterministic
  - id: document_assembly
    kind: deterministic
  - id: final_validation
    kind: deterministic
on_failure: fail_closed
```

Każdy LLM node otrzymuje minimalny potrzebny kontekst i zwraca strukturę zgodną ze schematem. Nie używać swobodnego tekstu jako protokołu sterującego aplikacją.

---

# 14. G39J — RELEASE / SUPPLY-CHAIN HARDENING

Wymagane przed oznaczeniem 0.2 stable:

- signed release manifest;
- podpisany artefakt instalatora (Authenticode lub równoważny release trust mechanism);
- podpisane model packs;
- podpisany `skills-index.json` i skill packs;
- pinned GitHub Actions przez commit SHA dla release-critical workflow albo równoważne hardening;
- ochrona release branch/main odpowiednia do trybu pracy repo;
- provenance/SBOM dla runtime, modeli i dependencies;
- test złego podpisu i złego hasha;
- clean-machine online install;
- clean-machine offline core;
- clean-machine offline AI full;
- upgrade test;
- repair test;
- rollback test;
- model switch test;
- skill update rollback test;
- network-blocked test po instalacji lokalnego modelu.

---

# 15. Kolejność wdrożenia 0.2

1. **G39G** — InstallStateProbe i `Fresh/Upgrade/Repair`, bo jest potrzebny także updaterowi.
2. **G39F** — transakcyjny updater aplikacji + rollback.
3. **G39E** — niezależny skill updater.
4. **G39A** — prywatny local inference runtime.
5. **G39B** — Bielik + Ministral model packs.
6. **G39D** — Model Manager UI.
7. **G39C** — effective context / retrieval orchestration.
8. **G39H** — deterministic execution engine.
9. **G39I** — migracja routera, pism prostych i pism procesowych jako pierwsza fala; potem analiza/dowody/umowy/raporty.
10. **G39J** — pełny release hardening i acceptance matrix.

Priorytet migracji deterministycznej: `prawny-router-v3` -> `pisma-proste-v2` -> `pisma-procesowe-v3` -> `raport-sytuacyjny-v2` -> `chronologia-sprawy-v1` -> `analizator-dowodow-v3` / `analiza-sadowa-v6` -> `analizator-przepisow-v2` -> `analizator-umow-v1` -> pozostałe.

---

# 16. Kryteria architektoniczne, których nie wolno naruszyć

- Skill nie może być źródłem prawdy o tym, czy programistyczna bramka została fizycznie wykonana; stan bramki prowadzi runtime.
- Runtime nie może sam tworzyć merytorycznego wniosku prawnego, gdy dana decyzja wymaga interpretacji semantycznej; wtedy wywołuje skill/LLM.
- Tryb Automatic nie omija invariantów bezpieczeństwa i weryfikacji.
- Local AI nie omija hard gate’ów źródłowych tylko dlatego, że działa offline. Jeżeli zadanie wymaga świeżej weryfikacji prawa, a źródło nie jest dostępne, system ma jawnie przejść w stan degraded/unverified zgodnie z polityką skilli.
- Modele nie są aktualizowane przez nadpisanie pliku in-place. Każda wersja jest osobnym, hashowanym model packiem.
- Skille nie są aktualizowane przez mieszanie pojedynczych plików między wersjami. Paczka jest aktywowana atomowo.
- Dane spraw, cache modeli, skille i binaria aplikacji muszą mieć rozdzielone lifecycle’y.

---

# 17. Następny audyt po implementacji

Po pierwszej iteracji G39A-G39G audyt ma odpowiedzieć co najmniej na:

- czy istniejący install jest zawsze wykrywany i poprawnie hydratowany;
- czy update aplikacji da się przerwać w każdym etapie bez utraty działającej wersji;
- czy skill rollback odtwarza dokładnie poprzedni zestaw dependencies;
- czy model pack jest odtwarzalny z przypiętego upstream revision;
- czy lokalny runner nie otwiera interfejsu poza loopback/IPC;
- czy `component-lock` obejmuje runner i model packs;
- czy effective-context ma pełną proweniencję do dokumentów źródłowych;
- czy deterministic workflow engine zapisuje kompletny event log;
- czy tryby Guided i Automatic dają ten sam wynik obowiązkowych gates dla identycznej sprawy;
- czy żadna migracja z SKILL.md do kodu nie usunęła funkcji podczas uruchamiania skilla na innym hoście.

## Status końcowy tego dokumentu

**APP 0.2: NOT PASS — ROADMAP CREATED.**  
Pierwszy warunek zamknięcia: G39G + G39F.  
Local AI nie otrzymuje statusu PASS przed G39A + G39B + G39J acceptance.