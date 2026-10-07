# UNIVERSAL-RUNTIME-ADAPTER — ChatGPT / Claude / Codex / zgodne hosty

> **Rola:** wspólny kontrakt wykonawczy Lex Machina. Ten plik nie zmienia prawa,
> metodologii, HARD GATE, routingu dziedzinowego ani bramek jakości. Ujednolica
> wyłącznie sposób rozumienia operacji zależnych od hosta.
>
> **Wersja:** 1.1 (2026-09-27, `shared` 3.85) — dodany §1A RESOLVER-SKILLI.

## 1. Zasoby i ścieżki

- Zapis `shared/PLIK.md` lub `<skill>/PLIK.md` oznacza **kanoniczny zasób
  zainstalowanego skilla**, a nie obowiązek istnienia konkretnego katalogu systemowego.
- Rozwiązuj zasób kolejno: natywny resolver skilli hosta → wspólny katalog projektu/
  sibling skills → skonfigurowany read-only resolver/MCP. Jeżeli zasób obowiązkowy
  nie może zostać świeżo odczytany, **FAIL-CLOSED**; nie zastępuj go pamięcią modelu.
- Ścieżki względne `references/...`, `modules/...`, `assets/...` dotyczą bieżącego skilla.
- Historyczne ścieżki w changelogach i dziennikach audytu są dokumentacją, nie instrukcją runtime.

<!-- lex:wykonuje-aplikacja: RESOLVER -->
## 1A. RESOLVER-SKILLI — instalacja z marketplace, kilka kopii tego samego skilla

**Adres logiczny, nie ścieżka hosta.** Zapisy `shared/X`, `<skill>/X`,
`/mnt/skills/user/<skill>/X`, `/mnt/skills/plugins/<skill>/X` i `skill/path` w każdym
pliku systemu oznaczają zasób `X` skilla `<skill>`. Katalog zapisany w ścieżce nie jest
faktem o bieżącym hoście — rozwiązuje go ta sekcja.

**Gdzie hosty kładą skille** (zmierzone 2026-09-27):

| Host i sposób instalacji | Katalog skilla |
|---|---|
| claude.ai / Cowork — plugin z marketplace | `/mnt/skills/plugins/<plugin>:<skill>/` (np. `shared:shared`) |
| claude.ai — skill wgrany lub organizacyjny | `/mnt/skills/user/<skill>/`, `/mnt/skills/plugins/<skill>/` |
| Claude Code — marketplace z GitHuba | `~/.claude/plugins/cache/<marketplace>/<skill>/<wersja-lub-hash>/` |
| Claude Code — marketplace lokalny | katalog źródłowy, rodzeństwo wołającego skilla |
| Claude Code — skill osobisty / projektu | `~/.claude/skills/<skill>/`, `.claude/skills/<skill>/` |

Plugin z marketplace **nie leży obok** innych skilli pod ich nazwami — dlatego
ścieżka zapisana na sztywno trafia w pustkę albo, co gorsze, w starą kopię z innej
instalacji.

**R-1 — wyszukanie.** Przed pierwszym odczytem zasobu danego skilla w sesji, gdy host
ma powłokę:

```bash
lm_resolve() {  # $1 = nazwa skilla; $2 = katalog wołającego skilla (opcjonalnie)
  T=$(printf '\t')
  for d in /mnt/skills/*/"$1" /mnt/skills/*/*:"$1" \
           "$HOME"/.claude/plugins/cache/*/"$1"/* \
           "$HOME"/.claude/skills/"$1" ./.claude/skills/"$1" \
           ${2:+"$2/../$1"}; do
    [ -f "$d/SKILL.md" ] || continue
    v=$(sed -n 's/^version: *"\{0,1\}\([0-9][0-9.]*\).*/\1/p' "$d/SKILL.md" | head -n 1)
    p=$(cd "$d" && pwd -P)
    case "$p" in *:"$1"|*/.claude/plugins/cache/*) w=1 ;; *) w=0 ;; esac
    printf '%s\t%s\t%s\n' "${v:-0}" "$w" "$p"
  done | sort -u | sort -t "$T" -k1,1Vr -k2,2nr | grep . || { echo "BRAK: $1" >&2; return 1; }
}
lm_resolve shared                 # przykład; drugi argument: katalog wołającego skilla
```

Wynik: `wersja  plugin(1/0)  katalog`, posortowany od najlepszej kopii. Bez powłoki —
wylistuj narzędziem odczytu katalogi z tabeli wyżej i odczytaj `version:` z każdego
znalezionego `SKILL.md`.

**R-2 — wybór.** Używasz **pierwszej** pozycji: najwyższa `version:` (porównanie
segmentami, `3.84` > `3.9`); przy równych wersjach kopia z pluginu przed kopią
wgraną. Jedna kopia na skill przez całą sesję — **zakaz łączenia plików z dwóch
kopii** (mieszanie wersji to cicha niespójność bramek).

**R-3 — duplikat.** Więcej niż jedna pozycja z **różnymi** wersjami →
`⚠️ DUPLIKAT SKILLA: <skill> <v1> (<katalog>) i <v2> (<katalog>) — użyto <v>` w śladzie
i jedno zdanie dla użytkownika na sesję: starą instalację należy usunąć. Kopie o tej
samej wersji odnotuj w śladzie bez ostrzeżenia.

**R-4 — mapa sesji.** Zapamiętaj `<skill> → katalog` i rozwiązuj przez nią każdy adres
logiczny (`<katalog>/X`). Brak jakiejkolwiek kopii → **FAIL-CLOSED** (§1) z nazwą
skilla i listą sprawdzonych lokalizacji.

**R-5 — skill wołany bez routera.** Zanim wykona pierwszy `view shared/...`, stosuje
R-1…R-4 do `shared`. Router robi to w PATH-SELFTEST i wypisuje wynik w KROKU 3A.

## 2. Operacje semantyczne

Nazwy odziedziczone z wcześniejszych runtime są semantyką, nie wymaganiem API:

- `view` → świeży odczyt wskazanego zasobu;
- `web_search` → bieżące wyszukanie zewnętrzne;
- `web_fetch` → otwarcie i odczyt konkretnego źródła;
- `show_widget` → natywny interaktywny widok, jeżeli host go obsługuje;
- `create_file` → natywne utworzenie artefaktu/pliku;
- `present_files` → udostępnienie użytkownikowi utworzonego artefaktu;
- shell/Python/konwertery → użyj tylko, gdy host faktycznie udostępnia równoważne
  narzędzie. Nigdy nie deklaruj wykonania narzędzia, którego nie użyto.

`HOST_CAPABILITY[document_generation]` oznacza natywną funkcję generowania DOCX/PDF
lub równoważnego artefaktu. Brak takiej funkcji nie znosi bramek jakości.

## 3. Prawo i źródła

- `PRAWO-HARDGATE`, `PRAWO-HARDGATE-ORZECZENIA`, `TEMPORAL-LAW-CHECK`,
  `LEGAL-QUALITY-GATE` i powiązane bramki zachowują pełną moc.
- Artykułu, §, Dz.U., kwoty/terminu ustawowego, sygnatury ani statusu aktu nie
  wolno podawać z pamięci, jeżeli istniejąca instrukcja wymaga świeżej weryfikacji.
- Gdy host nie ma dostępu do wymaganej weryfikacji, zastosuj status przewidziany
  przez bramkę i poinformuj użytkownika; nie udawaj wykonania fetch/search.

## 4. Pliki użytkownika

- Legacy `/mnt/user-data/...` oznacza rzeczywisty plik/artefakt użytkownika w bieżącym
  hoście. Użyj natywnego mechanizmu plików; literalny katalog nie jest wymagany.
- Obowiązek „ponownego odczytu” oznacza rzeczywiste ponowne otwarcie źródła,
  a nie odtworzenie go z pamięci kontekstu.

## 5. Prywatność i zewnętrzne API

- Statyczne widgety/skrypty Lex Machina **nie wysyłają danych bezpośrednio do
  Anthropic, OpenAI ani innego dostawcy AI**.
- Tryb wymagający wysłania treści do zewnętrznego dostawcy może zostać wykonany
  tylko przez hosta i po jawnej decyzji użytkownika dotyczącej konkretnej operacji,
  z uwzględnieniem dostawcy, zakresu danych i retencji.
- Akta sprawy, tajemnica zawodowa i dane osobowe nie mogą zostać wysłane do
  zewnętrznej usługi tylko dlatego, że historyczny widget zawierał endpoint API.
- Domyślny fallback anonimizacji: lokalny/deterministyczny, bez transmisji danych.

## 6. UI i artefakty

- Brak widgetu/JSX/HTML nie może obniżyć jakości merytorycznej. Zwróć równoważny
  raport strukturalny.
- Brak generatora DOCX/PDF: poinformuj o ograniczeniu; nie pomijaj walidacji końcowej.

## 7. Zasada zgodności

Jeżeli istniejąca instrukcja jest zrozumiała i wykonalna w bieżącym hoście,
wykonaj ją bez kosmetycznego przepisywania. Ten adapter działa tylko na granicy
runtime i ma zapobiegać zależności od jednego dostawcy lub konkretnego filesystemu.
