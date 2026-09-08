# UNIVERSAL-RUNTIME-ADAPTER — ChatGPT / Claude / Codex / zgodne hosty

> **Rola:** wspólny kontrakt wykonawczy Lex Machina. Ten plik nie zmienia prawa,
> metodologii, HARD GATE, routingu dziedzinowego ani bramek jakości. Ujednolica
> wyłącznie sposób rozumienia operacji zależnych od hosta.

## 1. Zasoby i ścieżki

- Zapis `shared/PLIK.md` lub `<skill>/PLIK.md` oznacza **kanoniczny zasób
  zainstalowanego skilla**, a nie obowiązek istnienia konkretnego katalogu systemowego.
- Rozwiązuj zasób kolejno: natywny resolver skilli hosta → wspólny katalog projektu/
  sibling skills → skonfigurowany read-only resolver/MCP. Jeżeli zasób obowiązkowy
  nie może zostać świeżo odczytany, **FAIL-CLOSED**; nie zastępuj go pamięcią modelu.
- Ścieżki względne `references/...`, `modules/...`, `assets/...` dotyczą bieżącego skilla.
- Historyczne ścieżki w changelogach i dziennikach audytu są dokumentacją, nie instrukcją runtime.

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
