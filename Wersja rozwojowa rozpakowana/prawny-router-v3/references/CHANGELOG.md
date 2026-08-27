# CHANGELOG — prawny-router-v3

- 3.30 (2026-08-27): zsynchronizowano `pokrycie-dziedzinowe.md` ze stanem faktycznym repozytorium: REACH/CLP → DR-10, akcyza/cło → istniejące moduły DR-06, cudzoziemcy → kanoniczny DR-05; dodano wejścia F-108 P1/41, P1/8 i P1/52.

- 3.29 (2026-08-27): przywrócono stałe identyfikatory reguł po skróceniu,
  bez Reguły 13, z kolejnością 22 → 23. Odwołania w SELF-CHECK i modułach
  zachowują znaczenie. Usunięto pozostałe notatki historyczne z korpusu i YAML.
  Końcowy SKILL.md: 391 linii wobec 924 przed przebudową.

- 3.28 (2026-08-26): korpus routera skrócono z 924 do około 400 linii.
  Na początku dodano siedmiopunktowy blok `ŁADOWANE ZAWSZE`. Szczegóły
  warunkowe pozostawiono w kanonicznych modułach, a z korpusu usunięto
  narracje incydentów, przykłady spraw, zduplikowane źródła, Regułę 13,
  tabelę kombinacji i lokalne warianty disclaimera. `SELF-CHECK.md` zachowuje
  pełne bramki wykonawcze bez opisów historycznych.

- 3.27 (2026-08-26): porównanie z kluczem dostało osobny, obowiązkowy protokół
  `AUDYT-KLUCZA-ODPOWIEDZI.md`: inwentarz wszystkich twierdzeń prawnych,
  atomizacja wg VER-GRAIN, HARD GATE per jednostka oraz jawny licznik pokrycia.
  Werdykt „pełna zgodność" jest teraz dozwolony wyłącznie przy wyniku N/N,
  bez pozycji obalonych i nierozstrzygniętych. Kategoria [11], REGUŁA 27 i oba
  self-checki wskazują tę samą kanoniczną procedurę. Imperatyw `description`
  skrócono z 336 do 170 znaków (profil uniwersalny ≤200), a nagłówek korpusu
  zmieniono z martwego „v3.13" na stabilne „v3", aby nie dublował wersji YAML.

- 3.26 (2026-08-25b, flaga **F-134**): naprawa czterech wad wskazanych w
  zewnętrznej opinii porównawczej — po **audycie samej opinii**, nie po
  przyjęciu jej na wiarę (REGUŁA 25 zastosowana do materiału, który tę regułę
  chwalił).

  **(1) description — przywrócony imperatyw.** Pole było jedynym miejscem
  decydującym o załadowaniu skilla, a w 3.24 wymieniono w nim imperatyw
  („UŻYWAJ ZAWSZE i AUTOMATYCZNIE. Nigdy nie analizuj bez wczytania tego
  pliku") na neutralny opis funkcji. Zysk dla walidatora, strata dla
  wyzwalania. Przywrócono imperatyw i rozszerzono go o przypadek ujawniony
  w F-132 („nie oceniaj cudzej analizy bez wczytania"), zachowując opis
  funkcjonalny dla czytelności.

  **(2) compatibility — realne nazwy.** `live_web_lookup, file_read` nie
  odpowiadały żadnej faktycznej funkcji, co rozluźniało wiązanie HARD GATE
  z konkretnym wywołaniem. Przywrócono nazwy realne z jawnym dopiskiem
  „lub równoważne funkcje hosta wg `shared/UNIVERSAL-RUNTIME-ADAPTER.md`" —
  to zachowuje uniwersalność bez utraty wiązania.

  **(3) PATH-SELFTEST — wykrywanie fail zamiast deklaracji fail-closed.**
  Ścieżki semantyczne (bez prefiksu hosta) są warstwą deklaratywną: jeśli
  host wymaga ścieżki bezwzględnej, odczyt zwróci błąd, a domyślnym
  zachowaniem modelu jest wtedy cicha odpowiedź z pamięci. „Fail-closed
  wymaga, by ktoś wykrył fail". Rozwiązanie NIE polega na powrocie do
  ścieżek jednego hosta (to zabiłoby uniwersalność) ani na dwóch wariantach
  plików (koszt utrzymania), tylko na uczynieniu PIERWSZEGO odczytu w sesji
  testem: forma względna → jeśli błąd, ustal prefiks hosta i powtórz →
  jeśli nadal błąd, jawny `⛔ TRYB ZDEGRADOWANY` z nazwą zasobu i błędu.

  **(4) REGUŁA 26 — skill nie jest źródłem prawa.** Przyczyna zmierzona
  w F-134: wartość „do 2 lat" dla art. 178a §1 KK, którą model podał
  użytkownikowi, pochodziła z modułu `dr-03`, nie z pamięci. Moduł nie był
  drugim źródłem — był jedynym i był w błędzie. Reguła rozdziela role:
  moduł odpowiada „KTÓRY przepis", źródło odpowiada „CO on dziś stanowi";
  znacznik ✅ [VER: data] w module dokumentuje stan na tę datę, nie dziś.

  **Czego z opinii NIE wprowadzono i dlaczego — art. 87 §1 KW.** Opinia
  zgłaszała wartość „30 000 zł" w modułach jako błąd wymagający zamiany na
  „2 500 zł". Weryfikacja: **obie wartości są prawdziwe i opisują różne
  granice tej samej sankcji** — 2 500 zł to dolna granica grzywny z art. 87
  §1 KW, a 30 000 zł to górna granica, bo art. 87 §1 jest wymieniony
  w katalogu art. 24 §1a KW ✅ [VER: lexlege.pl/kw/art-24, odczyt
  2026-08-25]. Zamiana jednej liczby na drugą przeniosłaby błąd, nie
  usunęła. Moduły uzupełniono o OBIE granice z zakazem podawania samej
  górnej. To zastosowanie reguły 25 do samej opinii — trafna diagnoza
  („ta liczba jest niepełna") z błędną korektą.

- 3.25 (2026-08-25, flaga **F-132**): kategoria routingu **[11] WERYFIKACJA
  CUDZEGO MATERIAŁU PRAWNEGO** (→ PRIMARY `analizator-przepisow-v2`) oraz
  **REGUŁA 24 (VER-GRAIN)** i **REGUŁA 25 (ADVERSARIAL-SOURCE)**.

  **Incydent (ta sama rozmowa co F-131, tura następna).** Po naprawie 3.24
  model w turze „porównaj z kluczem" wykonał już weryfikację online — ale
  TYLKO dla części powołań. Zweryfikował definicje stanu po użyciu alkoholu
  (art. 46 ust. 2 ustawy o wychowaniu w trzeźwości), a NIE zweryfikował
  ponownie górnej granicy kary z art. 178a §1 KK i przepisał z pamięci
  wartość „do lat 2", nieaktualną od 1.10.2023 (obowiązuje „do lat 3").
  Wartość ta była BŁĘDNA także w ocenianym kluczu — czyli błąd nie został
  wychwycony, tylko POWIELONY, mimo że jedno ze źródeł w wynikach
  wyszukiwania podawało wartość poprawną. Rozbieżność między źródłami
  została nierozpoznana jako ślad nowelizacji.

  **Dwie odrębne przyczyny, dwie odrębne reguły:**

  (1) *Ziarnistość i kompletność* — reguła 23 wymagała „osobnego wyszukiwania
  dla KAŻDEGO powołania", ale nie definiowała, CO jest powołaniem (teza czy
  liczba?), ani nie ustanawiała kontroli kompletności na wyjściu. Reguła
  spełnialna wybiórczo: model weryfikuje to, co samo wyda mu się wątpliwe,
  a przeoczenie z definicji nie zgłasza się samo. Naprawa: REGUŁA 24 —
  jednostka weryfikacji zdefiniowana wprost (artykuł + §/ust./pkt, każda
  liczba, data, sygnatura, granice kary), INWENTARZ POWOŁAŃ jako czynność
  na wyjściu (lista powołań zestawiona 1:1 z wywołaniami), zakaz znacznika
  ✅ [VER] „hurtem" dla akapitu, oraz reguła 24(c): rozbieżność między
  źródłami = sygnał nowelizacji, nie szum do przegłosowania.

  (2) *Postawa wobec cudzego materiału* — zadanie „porównaj z kluczem"
  weszło do routingu przez skill dziedzinowy (`dr-XX`), bo tabela [1]–[10]
  nie miała pozycji dla weryfikacji cudzego opracowania. `dr-XX` odpowiada
  na pytanie „czy argumentacja jest trafna", nie „czy każda dana w tym
  tekście jest prawdziwa". Skutek: ocena toku rozumowania klucza wypadła
  poprawnie, a ani jedna jednostka redakcyjna klucza nie została sprawdzona
  (niezależna analiza zewnętrzna tego samego materiału wykazała m.in. art.
  250 §2 zamiast §2a, art. 243 zamiast art. 246 §1, grzywnę 100 zł zamiast
  2500 zł, przepadek pojazdu przypisany art. 178a zamiast art. 44b KK,
  oraz zarzut niezgodny ze stanem faktycznym kazusu). Naprawa: kategoria
  [11] z PRIMARY `analizator-przepisow-v2` + REGUŁA 25 — cudzy materiał jako
  hipoteza do obalenia, zgodność ≠ potwierdzenie (dwa teksty mogą powielać
  ten sam błąd), test spójności wewnętrznej jako ustalenie samodzielne,
  zakaz milczącej adopcji cudzej danej bez znacznika.

  **Zakres uniwersalny (portability):** obie reguły i kategoria [11] są
  sformułowane w kategoriach OPERACJI SEMANTYCZNYCH (wyszukanie/odczyt
  źródła, wczytanie skilla), bez nazw narzędzi konkretnego hosta i bez
  ścieżek bezwzględnych — zgodnie z sekcją ADAPTER RUNTIME i
  `shared/UNIVERSAL-RUNTIME-ADAPTER.md`. Działają identycznie na hoście
  bez `web_search`/`view`, o ile host ma funkcje równoważne; brak takich
  funkcji = fail-closed (⚠️ [NIEWERYFIKOWANE]), nie substytucja pamięcią.

  ⚠️ **Skuteczność NIEZMIERZONA** — jak przy F-131 i całej sesji 2026-08-23,
  potwierdzona jest wyłącznie OBECNOŚĆ bramek w plikach, nie ich wpływ na
  zachowanie. Bramka „inwentarz powołań" jest samo-raportująca (klasa e2 wg
  `PLAN-TESTU-BRAMEK-F113.md`) — model, który pominął weryfikację, może z
  tego samego powodu błędnie zaliczyć inwentarz. Pomiar objęty flagą F-133
  (otwarta, `WARN-OTWARTE.md`).

- 3.24 (2026-08-25, flaga **F-131**): REGUŁA 23 — twardy trigger re-check
  HARD GATE/PRIMARY na KAŻDEJ turze rozmowy prawnej, nie tylko pierwszej.
  Incydent: router wczytany raz na starcie rozmowy o kazusach KPK (TA),
  HARD GATE zastosowany poprawnie w pierwszej turze (6 web_search), ale w
  kolejnej turze tej samej rozmowy ("porównaj z kluczem użytkownika") model
  wykonał zero web_search i nigdy nie wczytał PRIMARY dr-03, mimo że treść
  dotyczyła tych samych przepisów KPK/KK/KW. Root cause: reguła 9 (HARD GATE
  TRWAŁY) i formuła SELF-CHECK "przed każdą odpowiedzią" były sformułowane
  jako stan trwały w pliku już przeczytanym, nie jako mechaniczny trigger
  niezależny od klasyfikacji charakteru kolejnej wiadomości ("to tylko
  porównanie, nie nowa analiza" — dokładnie ta klasyfikacja była punktem
  awarii, analogicznie do F-8/F-8b dla świadka). Naprawa: REGUŁA 23 (wzorzec
  reguły 22) + pozycja w bloku SELF-CHECK, niezależna od oceny czy tura jest
  "nowym pytaniem" czy "recenzją/oceną/pytaniem meta" — trigger zależy
  wyłącznie od obecności treści prawnej w odpowiedzi, nie od gatunku tury.
  Dodatkowo odnotowana (nie naprawiona w tej sesji, ⬛ NIEPOTWIERDZONA —
  wymaga testu kontrolowanego) hipoteza uboczna: sekcja ADAPTER RUNTIME
  (ścieżki semantyczne zamiast bezwzględnych `/mnt/skills/user/...`) mogła
  dołożyć koszt pośredniości zwiększający ryzyko pominięcia wykonania —
  patrz `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-25,
  sekcja 3-4 dla pełnej analizy i zastrzeżenia metodologicznego.

- 3.23 (2026-08-24, sesja audytowa audyt-systemu-v4, flaga **F-126**): historia wersji sprowadzona do JEDNEJ lokalizacji kanonicznej (ZASADA 15). Usunięte dwa równoległe nośniki: (1) sekcja `## CHANGELOG (prawny-router-v3)` w korpusie `SKILL.md` — wpisy 3.13…3.9, w korpusie zostało odesłanie; (2) pole `changelog:` w YAML liczące 63 linie, czyli pełną historię zamiast skrótu — T12 zgłaszał je jako ⚠️, teraz ma 7 linii i odsyła tutaj. Oba bloki przeniesione 1:1, bez przeredagowania i bez odtwarzania czegokolwiek z pamięci. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-24.

- 3.22 (2026-08-23i, sesja audytowa audyt-systemu-v4, flaga F-115): self-check ANTY-FASADA podłączony jako WYWOŁANIE modułu kanonicznego `shared/SELF-CHECK-ANTY-FASADA.md`, kopia treści zastąpiona wywołaniem. Powód modułu zamiast kopii: gdy F-117 dodała regułę AF-6 i drugą pozycję listy do `shared/PRAWO-HARDGATE.md`, żadna z 7 istniejących kopii nie została zaktualizowana — źródło miało 2 pozycje, kopie 1. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23i.

> Lokalizacja kanoniczna historii wersji (ZASADA 15). Plik założony 2026-08-23i;
> wersje wcześniejsze nieodtworzone — ślad w audyt-systemu-v4/references/AUDIT-JOURNAL.md.

---

## Wpisy przeniesione z korpusu SKILL.md (F-126, 2026-08-24)

> Tekst poniżej przeniesiony 1:1 z sekcji `## CHANGELOG (prawny-router-v3)` w `SKILL.md`.
> Nic nie przeredagowano ani nie odtworzono z pamięci — przeniesienie
> istniejącego tekstu, zgodnie z zakazem z wiersza flagi F-126.

**3.13 (2026-07-12) — Reguła 22: TWARDY trigger słowny dla pytań do świadka
(naprawa F-8b, kontynuacja F-8):**
- Incydent: mimo poprawnie wdrożonej reguły 21 (dekompozycja żądań złożonych),
  model w KOLEJNEJ odpowiedzi w tej samej sesji otrzymał proste, samodzielne
  doprecyzowanie ("czy użyłeś skila przesłuchania świadków... router zawsze
  powinien odpalać ten skill") i — zamiast tego — wcześniej dostarczył pytania
  do świadka wprost z pamięci prawniczej, bez żadnego `view` pliku
  przesluchanie-swiadkow-v2-min90/SKILL.md, mimo że fraza "pytania do świadka"
  padła explicite w poleceniu użytkownika.
- Root cause: reguła 21 wiąże obowiązek wczytania skilla świadka z oceną
  "czy zlecenie jest złożone" (≥2 komponenty z różnych PRIMARY). To dobra
  reguła dla dekompozycji, ale nie jest ona TRIGGEREM SAMYM W SOBIE — model
  może (błędnie) ocenić, że dany fragment prośby "nie wymaga" pełnego
  pipeline'u i odpowiedzieć skrótowo.
- Naprawa: dodano REGUŁĘ 22 — bezwarunkowy, słowny trigger niezależny od
  oceny złożoności: obecność fraz "pytania do świadka"/"przesłuchanie
  świadka"/"kontrprzesłuchanie"/"impeachment świadka" wymusza `view`
  przesluchanie-swiadkow-v2-min90/SKILL.md PRZED napisaniem jakiejkolwiek
  odpowiedzi zawierającej takie pytania — niezależnie od tego, czy reszta
  zlecenia jest prosta czy złożona. Dodano też pozycję w SELF-CHECK.
- Pełny opis incydentu: AUDIT-JOURNAL.md, wpis AUDYT-2026-07-12 (F-8 → F-8b).

**3.12 (2026-07-12) — Reguła 21: CHECKPOINT w żądaniach złożonych (naprawa F-8):**
- Incydent: zlecenie łączące tezy/chronologię/sprzeczności + "pytania do świadka"
  zostało obsłużone przez chronologia-sprawy-v1 w całości; przesluchanie-swiadkow-v2-min90
  nigdy nie zostało wczytane mimo poprawnego wiersza [8] w tabeli routingu — pytania
  W3 powstały bez CHECKPOINT-W2 (bez akceptacji tez przez użytkownika).
- Dodano REGUŁĘ 21 (sekcja reguł nadrzędnych, po regule 20/20a): żądania złożone
  dekomponować na komponenty, każdy z własnym PRIMARY skillem i checkpointami;
  obecność checkpointu w jednym komponencie (np. świadek → CHECKPOINT-W2) blokuje
  wyłącznie ten komponent, nie całą odpowiedź — ale MUSI zablokować.
- Pełny opis incydentu i naprawy równoległej w chronologia-sprawy-v1 (v1.3→v1.4,
  KATEGORIA A0 fałszywe sprzeczności): AUDIT-JOURNAL.md, wpis AUDYT-2026-07-12.
- Flaga F-8 w WARN-OTWARTE.md → zamknięta tym wpisem.

**3.11 (2026-07-05) — scalenie standaryzacji metadanych z pełną logiką 3.10:**
- Kontekst: równolegle do rozwoju 3.9→3.10 (logika weryfikacji podmiotów) powstała
  osobna gałąź robocza, oznaczona "3.9" z dnia 2026-07-04, wprowadzająca ustrukturyzowany
  frontmatter (dependencies, inputs, outputs, confidence, escalation, limitations,
  required_modules) — ale bez KROK 0D i bez POV-D-TRIGGER.
- Scalenie: przyjęto ustrukturyzowany frontmatter, zachowując w całości treść
  KROK 0D, [POV-D-TRIGGER], ZASADĘ FUNDAMENTALNĄ ("dane z akt ≠ zweryfikowane")
  oraz pełny blok SELF-CHECK z POV-B/C/D.
- Dodano: required_modules → shared/PRE-W2-VERIFICATION-GATE.md; escalation →
  przypadek podmiotu ⬛ bez dostępu do rejestru.
- Dodano do frontmatter adnotację ZNALEZISKO 2026-07-04 o potencjalnym duplikacie
  kwalifikator-karnomaterialny.md (zgłoszone do CHECKLIST-DEDUP, nie rozwiązane
  w tym scaleniu).
- Wersja: 3.10 → 3.11. Żadna funkcja bezpieczeństwa nie została usunięta.

**3.10 (2026-06-26) — KROK 0D: oznaczanie podmiotów ⬛ [DO WERYFIKACJI]:**
- Nowy krok 0D w sekwencji głównej: obowiązkowe oznaczanie każdego podmiotu
  (spółki, sądy, organy) statusem ⬛ [DO WERYFIKACJI] od chwili napotkania.
- Status ⬛ utrzymuje się do faktycznego web_search/web_fetch — nie do zamiaru.
- SELF-CHECK: nowy blok "STATUS PODMIOTÓW" z checklistą przed każdą odpowiedzią.
- MOD-STEP-TRACKER: dodano R0D do REJESTRU.
- Wyjątki: dane osoby fizycznej (imię/nazwisko/adres/PESEL) — nie oznaczaj ⬛.
- Powiązane: PRE-W2-VERIFICATION-GATE.md v1.2.0 (nowy krok PRE-W2.0).

**3.9 (2026-06-26) — naprawa [POV-D-TRIGGER] i zasady "dane z akt ≠ zweryfikowane":**
- Root cause: model traktował KRS/NIP z umów/akt jako zweryfikowane online.
  Skutek: KRS 0000796445 (HP sp. z o.o.) wpisany przy Human Park Global sp. z o.o.
  (która ma KRS 0001025052) w piśmie procesowym VII P 94/25 (sesja 2026-06-26).
- SELF-CHECK: blok POV-B/C/D rozbudowany o:
  (a) zasadę explicite "dane z akt ≠ zweryfikowane"
  (b) [POV-D] jako osobny krok z triggerem przy ≥2 różnych numerach KRS/NIP
  (c) wymóg wyświetlenia raportu PRE-W2 przed W2
- Reguła nadrzędna 18: dodano [POV-D-TRIGGER] i zasadę fundamentalną.
- Wersja: 3.8 → 3.9

---

## Wpisy przeniesione z pola `changelog:` YAML (F-126, 2026-08-24)

> T12 zgłaszał to pole jako ⚠️ — 63 linie to pełna historia, nie skrót
> (ZASADA 15 dopuszcza w YAML skrót do ~15 linii). Tekst poniżej przeniesiony
> 1:1, w oryginalnej składni listy YAML, bez przeredagowania i bez
> odtwarzania czegokolwiek z pamięci.

```yaml
changelog:
  - "3.21 (2026-08-18): NOWY KROK 0-RPK — router jest teraz jedynym miejscem
    decydującym, KIEDY inicjować shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md
    (RPK), zamiast zostawiać tę decyzję wyłącznie w opisie biblioteki
    shared/SKILL.md, która sama w sobie nie jest samodzielnym skillem i nie
    ma własnej sekwencji wywołania. Powód: użytkownik trafnie zauważył, że
    dodanie modułu RPK do shared (2026-08-18, AUDYT-2026-08-18, flaga F-93)
    nie wystarcza — biblioteka nie decyduje SAMA o swoim wywołaniu, potrzebny
    jest punkt orkiestracji. Krok umieszczony zaraz po KROK 0-ST (analogicznie
    do MOD-STEP-TRACKER), z jawnymi sygnałami wyzwalającymi (zbiór ≥10
    ponumerowanych jednostek, plik źródłowy z numeracją ciągłą, zapowiedź
    pracy partiami). required_modules i SELF-CHECK rozszerzone. Nie zamyka
    F-93 w całości — propagacja do pozostałych 5 skilli-konsumentów
    (analizator-przepisow-v2, analizator-dowodow-v3,
    przesluchanie-swiadkow-v2-min90, chronologia-sprawy-v1, audyt-systemu-v4)
    pozostaje otwarta, patrz WARN-OTWARTE.md."
  - "3.17 (2026-07-21): NAPRAWIONO — shared/HIERARCHIA-ZRODEL.md (istniał
    od dawna) i shared/PORTALE-BRANZOWE-RZAD-2B.md (zbudowany w tej sesji,
    16 dziedzin z weryfikacją site:) NIE BYŁY ładowane przez ŻADEN DR-skill
    ani przez sam router — DOKŁADNIE ten sam wzorzec 'zbudowano, zapomniano
    podłączyć' co wielokrotnie w tej sesji (moduły niezarejestrowane w
    SKILL.md, plany bez skryptów, poprawki niezsynchronizowane między
    mapami). Dodano OBA do required_modules — TERAZ każde wywołanie routera
    (a więc każdy DR-skill uruchamiany PRZEZ router) ma dostęp do
    kategoryzacji wiarygodności źródeł i rejestru portali branżowych.
    Odkryte przy pytaniu użytkownika 'czy wszystkie DR wiedzą o tej bazie
    portali?' — odpowiedź brzmiała: ŻADEN, naprawiono."
  - "3.16 (2026-07-13f): KONSOLIDACJA — usunięto zależność od osobnych skilli
    mcp-zrodla-prawa-v1/audit-trail-portal-v1/sync-dzu-automatyczny-v1 (utworzonych
    2026-07-13). Ich treść przeniesiono do shared/MCP-INTEGRACJA.md,
    shared/AUDIT-TRAIL-SPEC.md i audyt-systemu-v4/references/SYNC-DZU-AUTOMATYCZNY.md
    — bo żaden z nich nie był samodzielnym skillem wywoływanym intencją użytkownika,
    tylko protokołem/narzędziem ładowanym przez router lub audyt-systemu-v4,
    dokładnie jak PRAWO-HARDGATE.md czy HYBRID-VALIDATION.md. Powód: uniknięcie
    duplikowania wzorca 'protokół + narzędzia w shared/tools', na wniosek
    użytkownika po pytaniu 'czy nie lepiej wdrożyć to jako elementy obecnych
    skili, a nie tworzyć coś nowego, co duplikuje już istniejące skille?'.
    Skille w systemie: 36 → 33 (powrót do liczby sprzed 2026-07-13)."
  - "3.15 (2026-07-13): INTEGRACJA — dodano shared/MCP-INTEGRACJA.md jako opcjonalną
    warstwę deterministyczną PRZED HARD GATE (nie zamiast). Gdy connector MCP
    (ISAP/SAOS/CBOSA/KRS/EUR-Lex) jest podłączony i dostępny w rozmowie, router
    używa go w pierwszej kolejności do weryfikacji powołań; HARD GATE
    (web_search/web_fetch) pozostaje aktywny bez zmian jako fallback i jako
    jedyna ścieżka gdy MCP niedostępne. Część realizacji rekomendacji #2 z
    audytu komercyjnego silnika 2026-07-13 (pełny opis: audyt-systemu-v4/
    references/AUDIT-JOURNAL.md, wpis AUDYT-2026-07-13)."
  - "3.14 (2026-07-12): DEDUP — usunięty duplikat
    references/kwalifikator-karnomaterialny.md (identyczny z kanonicznym
    dr-03/modules/mod-KK-kwalifikator-karnomaterialny.md, MD5 zgodny),
    zgłoszony jako ZNALEZISKO 2026-07-04. 2 miejsca wywołania w dr-03
    przekierowane na ścieżkę kanoniczną. Zamyka pozycję w limitations —
    pełny opis tam. Część audytu komercyjnego silnika (punkt 4)."
  - "3.9 (2026-06-26): naprawa [POV-D-TRIGGER] i zasady 'dane z akt ≠ zweryfikowane
    online' — pełny opis w sekcji CHANGELOG na końcu pliku."
  - "3.10 (2026-06-26): KROK 0D — obowiązkowe oznaczanie podmiotów ⬛ [DO WERYFIKACJI]
    — pełny opis w sekcji CHANGELOG na końcu pliku."
  - "3.11 (2026-07-05): SCALENIE dwóch równoległych gałęzi rozwoju — (a) standaryzacja
    metadanych frontmatter (dependencies/inputs/outputs/confidence/escalation/
    limitations/required_modules), wprowadzona w wersji roboczej oznaczonej 3.9
    z dnia 2026-07-04, z (b) pełną logiką weryfikacji podmiotów KROK 0D +
    POV-D-TRIGGER z wersji 3.10 (2026-06-26). Żadna funkcja bezpieczeństwa nie
    została usunięta w procesie scalenia — required_modules rozszerzone o
    shared/PRE-W2-VERIFICATION-GATE.md, escalation rozszerzone o przypadek
    podmiotu ⬛ bez dostępu do rejestru."
```
