# Historia zmian plików — chronologia-sprawy-v1

> Plik historyczny: historia zmian SKILL.md i modułów, przeniesiona z plików roboczych
> (AUDYT-2026-10-04n). Model nie czyta go podczas pracy; bieżący stan jest w plikach roboczych,
> historia wersji skilla — w `references/CHANGELOG.md`.


## SKILL.md (przeniesione 2026-10-04n)

## Historia wersji

```
v1.1: osobna oś czasu per wątek prawny, cztery klasy pewności zdarzenia (BEZSPORNE /
PEWNE / WYDEDUKOWANE / SPORNE), proweniencja każdego zdarzenia (dok_id + strona +
autor twierdzenia), automatyczny indeks sprzeczności (daty ORAZ opisy zdarzeń —
rozbieżności między zeznaniami, dokumentami i twierdzeniami stron), klasa BEZSPORNE
jako podstawa faktów niewymagających dowodzenia. Integruje się z raport-sytuacyjny-v2.

v1.2 (AUDYT 2026-07-12, naprawa na wyraźne wskazanie użytkownika): dodano OBOWIĄZKOWĄ
KORELACJĘ FINANSOWĄ (sekcja 3B) — ekstrakcja kwot/terminów/stron płatności z KAŻDEGO
dokumentu jako osobna kategoria danych, z obowiązkowym zestawieniem krzyżowym kwot
między dokumentami (kto komu ile winien, co zostało/nie zostało zwrócone, w jakim
terminie).

v1.3 (KOREKTA WŁASNEGO BŁĘDU z naprawy v1.2, na wyraźne wskazanie użytkownika, który
odnalazł i udostępnił starszą wersję skilla z 2026-06 zawierającą pliki nieobecne
już w wersji produkcyjnej v1.1): naprawa v1.2 odtworzyła references/sprzecznosci-dat.md
i assets/widget-timeline.html OD ZERA zamiast na bazie realnej treści, bo w chwili
naprawy oryginał nie był dostępny — po porównaniu z odnalezioną starszą wersją:
(a) references/sprzecznosci-dat.md przywrócony na bazie PRAWDZIWEJ oryginalnej
treści (katalog A1–C3 z konkretnymi podstawami prawnymi i tabelą terminów zawitych,
wcześniej zgubioną w wersji odtworzonej od zera) + dopisana nowa KATEGORIA D (KWOTA);
(b) przywrócono assets/ChronologiaSprawy.jsx — plik nadal jawnie referencjonowany w
sekcji "ARCHITEKTURA RENDEROWANIA" tego SKILL.md ("dokumentacja struktury — nie
kopiuj go"), pominięty w paczce v1.2 mimo że tekst się do niego odwoływał (dokładnie
ten sam typ błędu, który v1.2 miało naprawiać); (c) przywrócono references/
BLUEPRINT-SCHEMA.md i upgrade-min8/{MIN8-UPGRADE.md,QUALITY-CHECKLIST.md} —
zweryfikowano, że żaden z nich NIE jest już referencjonowany w aktualnym SKILL.md
(ich treść merytoryczna została wchłonięta przez rozszerzony schemat "CZTERY KLASY
PEWNOŚCI" i PROWENIENCJĘ w v1.1) — zachowane jako materiał archiwalny dla
przejrzystości, nie jako aktywna zależność pipeline'u. Wniosek na przyszłość:
odtwarzanie zaginionego pliku WYŁĄCZNIE z opisu jego roli (bez dostępu do oryginału)
jest z definicji stratne — należy to jawnie nazwać w chwili naprawy, a nie
przedstawiać rekonstrukcję jako równoważną oryginałowi.

v1.4 (2026-07-12, ta naprawa): pole `description` w YAML frontmatter przekraczało
1024 znaki (2773 znaki) — powyżej limitu pola opisu w metadanych skilla. Skrócono
`description` do wersji zwięzłej (poniżej progu), zachowując wszystkie frazy
wyzwalające AUTO-TRIGGER; pełną treść dziennika zmian (v1.1–v1.3) przeniesiono
bez utraty informacji do niniejszej sekcji "Historia wersji" w treści pliku.
v1.5 (2026-07-15, F-7 / ZASADA 11 — audyt proceduralny): dodano SD-GATE
(skan kompletności dokumentów, wywołanie shared/MOD-SKAN-DOWODOW-KOMPLETNY.md
w pełni FAZA 1-3) jako HARD GATE obowiązkowy PRZED "Sekwencją dla każdego
dokumentu" w FAZA EKSTRAKCJI ZDARZEŃ. Przyczyna: skill ekstrahuje chronologię
bezpośrednio z dokumentów, ale nie miał NIGDZIE (grep 0 wyników na "SD-VER"/
"SD-GATE"/"SKAN-DOWODOW") mechanizmu weryfikacji kompletności odczytu —
dokładnie ten sam mechanizm luki, co udokumentowany incydent w
przesluchanie-swiadkow-v2-min90 (sprawa XI P 27/26, AUDYT-2026-07-14b): częściowo
odczytany dokument generuje chronologię z cichą luką, nieodróżnialną od
"w dokumencie po prostu nic więcej nie było". Pełny opis: audyt-systemu-v4/
AUDIT-JOURNAL.md, AUDYT-2026-07-15e.
```

