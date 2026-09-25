# Lex Machina - dokumentacja aplikacji

Stan: 2026-09-25 · gałąź `claude/lex-machina-claude-timeout-pralq8` · wersja desktop 0.1.10

**Najważniejsze:** dane spraw nie opuszczają komputera w postaci jawnej, chyba że użytkownik świadomie wyśle tekst jawny. Do modeli zewnętrznych trafiają symbole zastępcze (`[PII:PERSON:0001|GEN]`), a klucz do nich jest zaszyfrowany lokalnie. Przepisy są cytowane wyłącznie po weryfikacji (ELI), nigdy z pamięci modelu.

---

## 1. Architektura

| Warstwa | Katalog | Rola |
|---|---|---|
| Desktop (Tauri, Rust) | `app/lex-desktop` | okno aplikacji, uruchamia runtime, granica zaufania (CORS, nagłówki) |
| Runtime (TypeScript, Node 24) | `app/lex-runtime` | API HTTP na 127.0.0.1, sprawy, szyfrowanie, anonimizacja, modele, narzędzia prawne |
| Interfejs (React) | `app/lex-web` | czat, zakładka Sprawa, Kancelaria, Ustawienia |
| Workery Python | `app/privacy`, `app/ocr`, `app/storage` | Morfeusz2/SGJP, Stanza NER, OCR (Paddle), odczyt i zapis Office |
| Korpus skilli prawnych | `Wersja rozwojowa rozpakowana/` | prawny-router-v3, prawo-polskie-v2, DR-01...DR-16, skille wykonawcze |
| Instalator | `app/installer`, `.github/workflows/lex-installer.yml` | instalator online (NSIS), pobiera Node, Python i pakiety |

Runtime jest źródłem prawdy; `app/lex-runtime/dist` jest zbudowany i trzymany w repozytorium (instalator kopiuje `dist`).

---

## 2. Instalacja i aktualizacja

- **Instalator online** (`LexMachina-Windows-Online-Installer`): artefakt workflow `lex-installer.yml`; instaluje w profilu użytkownika, pobiera prywatny Node i Python (sumy SHA-256 z `app/installer/windows-release-source.json`).
- **Instalator offline**: wstrzymany do potwierdzenia instalatora online.
- Pierwsze logowanie: `admin` / hasło początkowe - aplikacja wymusza zmianę na min. 10 znaków.
- Skille z kont (Claude/Codex/Grok) w nowszej wersji niż wbudowane są używane automatycznie (scalony prywatny korpus, walidowany przy starcie).

---

## 3. Sprawy i pliki (zakładka Sprawa)

- Każda sprawa ma własny zaszyfrowany magazyn i klucz; foldery są logiczną strukturą (folder główny nosi nazwę sprawy).
- Obsługiwane: PDF, obrazy, DOCX, ODT, XLSX/XLSM, CSV/TSV, TXT/MD, ZIP (rozpakowanie członków).
- **Przetwarzanie**: `OCR + anonimizuj` albo `Tylko OCR` (tekst jawny, bez klucza). OCR uruchamia się tylko dla stron bez warstwy tekstowej lub z grafiką; tekst cyfrowy idzie od razu do anonimizacji.
- Pasek postępu: odczyt → OCR (strony) → wykrywanie → [lokalne AI] → anonimizacja → zapis klucza.
- **Edytor**: DOCX/ODT (akapity, nagłówki, listy, tabele) i arkusze - zapis jako nowy plik.
- **Wersja zanonimizowana**: podgląd z zaznaczonymi słowami, wersja dla modelu (znaczniki `Strona n z N`), klucz. Zaznaczenie tekstu dodaje go do anonimizacji; w kluczu można poprawić formy przypadków lub usunąć symbol - wersja i klucz zmieniają się razem.
- **Dokumenty modelu**: pliki wygenerowane przez model trafiają do sprawy; deanonimizacja automatyczna z opcją podglądu; plik z symbolami wgrany z zewnątrz można zdeanonimizować przyciskiem.

---

## 4. Anonimizacja

**Rozpoznawacze** (suma wyników, jeden błąd nie wyłącza pozostałych):
1. Słownik SGJP (Morfeusz2): wszystkie imiona i nazwiska we wszystkich formach, adresy ze struktury (ul., al., kod pocztowy).
2. Stanza NER (model polski, offline).
3. Detektory identyfikatorów: PESEL, NIP, REGON, IBAN, KRS, dowód, paszport, telefon, e-mail, księga wieczysta, rejestracja, karta.
4. Opcjonalnie lokalny model (poniżej).

**Reguły instytucji i ról** (`app/privacy/generic_words.json`, generowany przez `generate_generic_words.py`):
- Rzeczownik instytucji na początku trafienia (Bank, Rada, Skarb, Kasa, Izba, Związek, Sąd...) - to nie osoba: `Pozwany Bank`, `Bank Pekao S.A.`, `Rada Gminy` zostają jawne. Wyjątek: słowo wskazujące osobę przed nim (`pani Rada`).
- Rola strony (najemca, wynajmujący, wierzyciel, dłużnik, powód/powódka, pożyczkobiorca...) sama nie jest anonimizowana, ale wskazuje, że następne słowo to osoba: `Najemca Kowalski` → `Najemca [PII:PERSON:0001]`.

**Z lokalnym AI** (pole obok `Dodaj pliki`, model lokalny np. Bielik; gdy model nie działa, obok pojawia się `Uruchom model lokalny` z postępem, a opcja działa od chwili gotowości modelu):
- model dodatkowo wyszukuje dane osobowe;
- wątpliwe trafienia (jedno słowo, słowo pospolite, rzeczownik instytucji) ocenia na podstawie **całego zdania** z zaznaczonym słowem;
- trafienie znika tylko przy jednoznacznym „nie osoba”; brak odpowiedzi = pozostaje zanonimizowane;
- bez działającego modelu przetwarzanie kończy się komunikatem (`LOCAL_PRIVACY_MODEL_NOT_READY`), nie cichym pominięciem.
- **korekta OCR** (skany, zdjęcia). Najpierw bez modelu: ligatury (ﬁ → fi), znaki niewidoczne i miękkie łączniki, nietypowe spacje, litery cyrylicy lub greki w polskich słowach. Potem model czyta **całe fragmenty** (kilka linii, pełne zdania) z liniami o niskiej pewności, słowami spoza słownika SGJP lub przypadkowymi symbolami i zwraca listę poprawek, nie przepisany tekst. Poprawka obejmuje 1-3 słowa jednej linii albo wyraz przeniesiony (`zapła- / ty` → `zapłaty`) i przechodzi, gdy:
  - każde słowo wyniku jest w słowniku;
  - zmiana jest drobna: ogonki, sklejenie lub rozcięcie słów, 1-2 znaki (1 w wyrazie z wielkiej litery), usunięcie symboli bez znaczenia (`|`, `~`, `¦`, `•`, `^`...);
  - słowo istniejące w słowniku zmienia się tylko o ogonki (`sad` → `sąd`) i tylko w linii odczytanej niepewnie;
  - liczby, daty, kwoty, identyfikatory i `§` zostają; nie można dodać ani usunąć `nie`.

  Styl i gramatyka autora dokumentu zostają bez zmian. Lista poprawek pojawia się po przetworzeniu; `Cofnij korekty` przetwarza plik ponownie bez nich. Model lokalny nie widzi obrazu.

**Osoby, rodziny, firmy, strony wieloosobowe**:
- `Kowalscy`, `Nowakowie`, `państwo Wiśniewscy` → jeden symbol „kilka osób” z odmianą mnogą (`Kowalskich`, `Nowakom`); `Zielińskie` → kilka kobiet.
- Wspólne nazwisko: `Piotrowi i Marii Nowakom`, `Jan, Ewa i Anna Wiśniewscy` → osobne osoby z własnym nazwiskiem (Piotr Nowak, Maria Nowak).
- Firma z imieniem/nazwiskiem (`PHU Jan Kowalski`, `Nowak sp. z o.o.`, `Kowalski i Wspólnicy sp.k.`, `pod firmą …`) → osobny symbol „firma” (z formą prawną), nieodmieniany; ta sama osoba jako przedsiębiorca ma własny symbol, model dostaje informację o powiązaniu.
- Klucz dla modelu: rodzaj i liczba każdego symbolu, strony wieloosobowe (`powodowie: [..], [..]` → męskoosobowy / same kobiety → niemęskoosobowy) i nakaz rozstrzygnięcia solidarności przy kilku osobach po jednej stronie.
- Kontrola odpowiedzi: czasownik lub rola przy symbolu niezgodna z kluczem (`[kobieta] wniósł`, `Pozwany [rodzina]`) → oznaczenie do przeglądu przed deanonimizacją (czat i pisma).
- Tabela klucza: pole „kim jest” (mężczyzna, kobieta, kilka osób, kilka kobiet, firma) - zmiana od razu w kluczu dla modelu i w odmianie.

**Klucz sprawy (wspólny)**: jedna osoba ma jeden symbol we wszystkich plikach sprawy i w czacie. Starsze dokumenty z kluczem osobnym łączy przycisk `Połącz klucze sprawy`.

**Odmiana**: model musi dopisać przypadek do symbolu (`|NOM|GEN|DAT|ACC|INS|LOC|VOC`, HARD GATE) i dostaje rodzaj osoby; Lex odmienia wartość lokalnie. Brak przypadku lub niepewna forma → oznaczenie do przeglądu.

Audyt (`app/privacy/benchmarks/privacy_audit.mts`, 500 dokumentów): skuteczność 100%, 0 wycieków, 0 fałszywych trafień, deanonimizacja 100%.

---

## 5. Czat

- **Pliki** rozwija listę z dwiema zakładkami: `Dokumenty sprawy` i `Wzory i know-how kancelarii` (drzewo folderów, wyszukiwarka bez polskich znaków, zaznaczanie całego folderu).
- Dokument zanonimizowany idzie tylko w wersji z symbolami; przetworzony bez anonimizacji - jako tekst jawny (ostrzeżenie). Każda strona jest oznaczona `=== STRONA n/N ===`.
- **Wzory kancelarii** (DOCX/ODT) idą jako tekst ze strukturą, oznaczone `WZÓR KANCELARII`; model przejmuje układ i formuły, nie przenosi danych przykładowych, puste pola wstawia jako `[Kwota]`, `[Termin]`. Wzór jest tekstem jawnym.
- **Limity**: 20 plików na wiadomość dla modelu w hoście, 4 dla lokalnego; ponad limit - komunikat, nic nie znika po cichu.
- **Okno modelu**: przed wysyłką pasek `~X tys. z Y tys. tokenów`; gdy za dużo - wskazanie największych plików i blokada wysyłki. Pliki zaznaczone idą w całości albo wcale.
- **Po wysyłce**: `Do modelu trafiło w całości: X z Y plików` + szczegóły (w całości / częściowo / streszczenie / pominięty).
- **Obrazy jako dowód** (tylko modele w hoście, które widzą obrazy: API i konto Claude):
  - **zdjęcia** (plik graficzny bez tekstu albo z pojedynczymi napisami) idą jako obraz domyślnie;
  - **strony z tekstem** idą jako obraz tylko po zaznaczeniu `Wysyłaj też obrazy stron z tekstem`;
  - zwykłe PDF idą jako sam tekst.

  Na obrazie czarne prostokąty zakrywają każde wystąpienie wartości z bieżącego klucza anonimizacji (także nazwisko rozdzielone między linie), obszary nieczytelne dla OCR oraz linie o pewności poniżej 0,5. Strony, której obrazu nie da się dopasować do tekstu, nie wysyła się. Limit: 20 obrazów na wiadomość, pierwsze 30 stron dokumentu. Model lokalny, Codex i Grok dostają sam tekst, a w etapach pojawia się informacja `obrazy pominięte`. Twarzy nie wykrywa się: zdjęcie z osobą trafia do modelu, jeśli użytkownik je wyśle.
- **Etapy pracy**: `Etap n z 6`, zakończone i pozostałe: anonimizacja → routing → skille i moduły → model i narzędzia → weryfikacja źródeł → przywrócenie danych; pod etapami - wczytane skille i pliki, użyte narzędzia.

---

## 6. Modele

| Rodzaj | Jak działa |
|---|---|
| Konto Claude (CLI) | AUTO: jeden proces `claude -p`; katalog roboczy = korpus skilli (`--restricted`, tylko `Read/Glob/Grep`, `dontAsk`); narzędzia Lex przez serwer MCP `lex` |
| Konto Codex / Grok | protokół tekstowy narzędzi Lex (runda na narzędzie) |
| API (OpenAI, Anthropic, xAI) | klucz w pamięci procesu lub keyringu systemu |
| Lokalny (llama.cpp, np. Bielik) | kompaktowy routing, RAG z rdzenia aktów w prompcie, limit 4 plików |

**Narzędzia Lex dostępne dla modeli** (w Claude jako `mcp__lex__*`): rdzeń aktów prawnych (teksty z ELI, lokalnie), weryfikacja przepisów i orzeczeń, orzecznictwo (SAOS, CBOSA, SN), źródła federacyjne MCP (ISAP, EUR-Lex, KRS i inne), raporty. Każde wywołanie przechodzi przez audytowany runtime.

**Gwarancje routingu**: prawny-router-v3 zawsze pierwszy (w Claude - podany w całości w prompcie); sprawa karna wymaga kwalifikatora karnomaterialnego (DR-03), brak = runda korekty, dalej brak = blokada; przed plikiem `.docx` walidacja HYBRID-VAL.

---

## 7. Biblioteka kancelarii (zakładka Kancelaria)

Osobny zaszyfrowany magazyn `Wiedza kancelarii`: wzory DOCX/ODT (dodaje administrator) i dokumenty know-how w folderach. Wyszukiwanie semantyczne; w czacie opcja `Przeszukuj know-how kancelarii` (fragmenty) albo wybór całych plików przez `Pliki`.

---

## 8. Bezpieczeństwo

- Runtime nasłuchuje tylko na 127.0.0.1; desktop przepuszcza wyłącznie nagłówki `X-Lex-*` z listy.
- Magazyny spraw i klucze anonimizacji szyfrowane kluczem sprawy; rotacja przy odebraniu dostępu.
- Model Claude nie ma powłoki, internetu, zapisu ani serwerów MCP konta; odczyt ograniczony do korpusu skilli.
- Most narzędzi MCP: prywatny kanał (named pipe / socket 0600) z jednorazowym tokenem na turę.
- Postęp przetwarzania trzyma tylko etapy, liczniki i słowa sprawdzane przez lokalne AI - w pamięci, w obrębie sprawy.

---

## 9. Budowa ze źródeł

```bash
# runtime
cd app/lex-runtime && npm install && npm run typecheck && npx vitest run && npm run build
# interfejs
cd app/lex-web && npm install && npx tsc -b && npx vitest run && npm run build && npm run validate:g14
# walidatory (przykłady)
cd app/lex-runtime && npm run validate:g33d && npm run validate:g36
# lista słów instytucji i ról (po zmianie list w skrypcie)
python app/privacy/generate_generic_words.py
```

Instalator: workflow `lex-installer.yml` (Windows, ~25 min; wyzwalacze: pull request, `workflow_dispatch`). Nie wymaga sekretów (instalator niepodpisany). Podpis Authenticode i paczki offline używają sekretów `LEX_WINDOWS_SIGNING_PFX_*`, `LEX_MODEL_PACK_PRIVATE_KEY_PEM`, `LEX_SKILL_UPDATE_PRIVATE_KEY_PEM` w innych workflow.

W nowym repozytorium: dodaj `push: branches: [main]` do `on:` w `lex-installer.yml` i `lex-runtime.yml`, aby budować po każdym wypchnięciu na `main`.

---

## 10. Zmienne środowiskowe (runtime)

| Zmienna | Znaczenie |
|---|---|
| `LEX_CLAUDE_NATIVE_CORPUS=off` | Claude wraca do protokołu tekstowego narzędzi |
| `LEX_ACCOUNT_SKILL_DIRS` | własne katalogi skilli z kont (`off` - wyłącza) |
| `LEX_SKILLS_PATH` | przypięty korpus (rozwój, walidacja) |
| `LEX_CORE_LAW_REFRESH=off` | bez odświeżania rdzenia aktów w tle |
| `LEX_NER_PYTHON`, `LEX_GAZETTEER_WORKER`, `LEX_GENERIC_WORDS` | ścieżki workerów i listy słów |
| `LEX_HOST`, `LEX_PORT` | adres runtime (tylko loopback) |
| `LEX_OCR_PYTHON`, `LEX_OCR_REDACTOR` | Python OCR (Pillow) i skrypt maskowania obrazów |

---

## 11. Znane ograniczenia

- Przyspieszenie trybu natywnego Claude i weryfikacja przez lokalne AI nie były mierzone na prawdziwym koncie/modelu (pokryte testami).
- Codex i Grok nie mają zamknięcia odczytu w jednym katalogu - zostają przy protokole tekstowym.
- Okna kontekstu modeli w hoście są przyjęte ostrożnie (Claude 200 tys., OpenAI/Grok 128 tys. tokenów).
- Korekta OCR i obrazy z PaddleOCR sprawdzone testami i atrapą silnika; nie mierzono jakości na prawdziwym Bieliku ani na prawdziwych skanach.
- Maskowanie w obrębie linii jest proporcjonalne do liczby znaków (z zapasem); przy nietypowych czcionkach fragment sąsiedniego słowa może zostać zakryty.
- Instalator offline wstrzymany.
