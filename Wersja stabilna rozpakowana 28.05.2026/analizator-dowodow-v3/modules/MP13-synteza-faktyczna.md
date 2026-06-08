# MP13 — Synteza faktyczna: łańcuchy przyczynowe i narracja procesowa

## Cel

Połączyć izolowane fakty z M1 w logiczne łańcuchy przyczynowo-skutkowe,
budując spójną narrację procesową oraz ujawniając ukrytą strukturę zdarzeń.
MP13 odpowiada na pytanie: *jaką historię opowiadają fakty razem*, a nie każdy
z osobna. Moduł jest kluczowy dla spraw, w których siłą nie jest pojedynczy
dowód, lecz zbieżność wielu faktów wskazujących na ten sam wniosek.

**Reguła:** każdy łańcuch faktów musi być zakorzeniony w ID faktów z M1.
Powiązanie bez źródła jest hipotezą — oznaczaj `[H-ŁAŃCUCH]`.
Nie konstruuj narracji, której nie potwierdzają zidentyfikowane fakty.

**Reguła syntezy kontradyktoryjnej:** każda narracja wymagana jest w wersji
własnej *i* wersji przeciwnika. Narracja jednowersyjna jest niepełna i procesowo
niebezpieczna. Wersja przeciwnika nie jest lustrzanym odbiciem — jest odrębną
interpretacją tych samych lub innych faktów, z własną logiką faz.

---

## 13.0 Aktywacja sekcji — tabela warunkowa

Uruchamiaj tylko sekcje odpowiednie dla złożoności materiału.
Nie ładuj całego modułu dla spraw jednoaktowych.

| Sekcja | Kiedy uruchamiać |
|--------|-----------------|
| 13.1 Klastry faktyczne | zawsze przy ≥ 3 faktach z M1 w jednym wątku |
| 13.2 Łańcuchy przyczynowe | gdy fakty tworzą sekwencję kauzalną lub temporalną |
| 13.3 Analiza zbieżności | gdy ≥ 3 niezależne fakty wspierają tę samą tezę bez dowodu bezpośredniego |
| 13.4 Narracja własna | zawsze gdy MP13 uruchomiony |
| 13.5 Narracja przeciwnika | zawsze gdy MP13 uruchomiony — obowiązkowa, odrębna logika faz |
| 13.6 Fakty szkodliwe | gdy M1 Warstwa C lub D ujawniła fakty niekorzystne dla użytkownika |
| 13.7 Test spójności | obowiązkowo przed wygenerowaniem bloku [BLOK-MP13→M7] |
| 13.8 Blok dla M7 | zawsze na końcu MP13 |

**Minimalna ścieżka (jedno pismo, prosta sprawa):** 13.4 → 13.5 → 13.7 → 13.8

**Pełna ścieżka (≥ 2 dokumenty, sprawa złożona):** 13.1 → 13.2 → 13.3 → 13.4 → 13.5 → 13.6 → 13.7 → 13.8

**Ścieżka poszlakowa (brak bezpośredniego dowodu):** 13.1 → 13.2 → 13.3 → 13.4 → 13.5 → 13.7 → 13.8

---

## 13.1 Identyfikacja klastrów faktycznych

Przed budowaniem łańcuchów zgrupuj fakty z M1 w klastry tematyczne.
Klaster to zbiór faktów powiązanych podmiotem, zdarzeniem, celem lub czasem.

**Reguła klastra:** jeden klaster = jedno zdarzenie, jedna relacja lub jeden cel.
Nie twórz klastra obejmującego całą sprawę — to niszczy korzyść z grupowania.
Liczba faktów w klastrze: preferowana ≤ 8; powyżej 10 — podziel na subklastry.

```text
[KLASTER-001]
Nazwa klastra: (np. „komunikacja poprzedzająca zwolnienie")
Fakty składowe: F001, F003, F007, F012
Podmiot centralny:
Oś czasowa klastra: [od] → [do]
Wspólny mianownik faktów:
Dziedziny z M2, których dotyczą:
Kolizje wewnątrz klastra (ID z M3):
Dowody pokrywające klaster (ID z M8):
Znaczenie klastra dla rozstrzygnięcia: kluczowe / istotne / pomocnicze / tło
```

---

## 13.2 Budowanie łańcuchów przyczynowo-skutkowych

Łańcuch to sekwencja faktów, w której każde ogniwo wynika z poprzedniego
lub poprzedza kolejne w sposób logicznie lub prawnie relewantny.

### Typy łańcuchów i ich standard dowodowy

Typ łańcucha determinuje standard, który sąd zastosuje przy ocenie:

| Typ | Definicja | Standard dowodowy | Główna podatność na atak |
|-----|-----------|-------------------|--------------------------|
| **przyczynowo-skutkowy** (A → B → C) | każde ogniwo jest skutkiem poprzedniego | wysoki — każde ogniwo wymaga dowodu | zerwanie jednego ogniwa obala cały łańcuch |
| **motywacyjny** (motyw → działanie → skutek) | działanie wyjaśniane przez motyw | umiarkowany — motyw można uprawdopodobnić | alternatywny motyw neutralny |
| **temporalny** (sekwencja chronologiczna) | fakty następują po sobie w czasie | niski — wystarczy oś czasu | post hoc ergo propter hoc — następstwo ≠ związek przyczynowy |
| **podmiotowy** (działania jednej osoby) | wzorzec zachowań tej samej osoby | umiarkowany | każde działanie tłumaczone odrębnie |
| **normatywny** (fakty → przesłanki → skutek prawny) | fakty wypełniają hipotezę normy | wysoki — każda przesłanka musi być udowodniona | brak jednej przesłanki = brak skutku |
| **eskalacyjny** (wzorzec nasilających się działań) | intensywność rośnie systematycznie | umiarkowany | każdy epizod tłumaczony odrębnie |
| **zaniechaniowy** (brak działania → szkoda) | szkoda wynika z niedziałania | wysoki — wymaga dowodu obowiązku i możliwości działania | brak obowiązku prawnego lub niemożność działania |

### Format ogniwa łańcucha

```text
[ŁAŃCUCH-001] Nazwa łańcucha:
─────────────────────────────────────────────
Typ łańcucha: (wybierz z tabeli powyżej)
Standard dowodowy dla tego typu: (patrz tabela)
─────────────────────────────────────────────
Ogniwo 1:
  Fakt ID: F001
  Treść skrócona:
  Skutek w łańcuchu:
  Powiązanie z ogniwem 2: przyczynowe / czasowe / motywacyjne / normatywne

Ogniwo 2:
  Fakt ID: F007
  Treść skrócona:
  Skutek w łańcuchu:
  Powiązanie z ogniwem 3:

Ogniwo N:
  Fakt ID:
  Treść skrócona:
  Wniosek końcowy łańcucha:
─────────────────────────────────────────────
Czy łańcuch jest kompletny: tak / nie
Brakujące ogniwo:
  Co powinno być między X a Y:
  Jak uzupełnić (dowód / zeznanie / dokument):

Siła łańcucha: 1–10
  (przy typie normatywnym i przyczynowym: skala bardziej restrykcyjna —
   brak jednej przesłanki/ogniwa = max 4/10)
Uzasadnienie siły:
Najsłabsze ogniwo:
Jak przeciwnik zerwie łańcuch (adekwatnie do podatności dla danego typu):
Riposta:
```

---

## 13.3 Analiza zbieżności faktów (convergence analysis)

Zasada: jeden fakt może być przypadkowy. Kilka niezależnych faktów wskazujących
na ten sam wniosek tworzy zbieżność — silniejszy argument niż pojedynczy dowód.

```text
[ZBIEŻNOŚĆ-001]
Teza (wniosek, który fakty razem wspierają):

Fakty zbieżne:
  F001 — (skrót) — siła wsparcia: silna / umiarkowana / słaba
  F004 — (skrót) — siła wsparcia:
  F009 — (skrót) — siła wsparcia:
  F013 — (skrót) — siła wsparcia:

Czy fakty są od siebie niezależne: tak / częściowo / nie
  (Uwaga: fakty zależne — np. kolejne maile od tej samej osoby —
   tworzą słabszą zbieżność niż fakty z różnych źródeł)

Łączna siła zbieżności: 1–10
  Reguła agregacji: siłę wyznacza dominanta ważona niezależnością —
  zacznij od najsilniejszego faktu jako podstawy, każdy kolejny niezależny
  fakt podnosi wynik o 1 pkt (max +3), każdy zależny o 0.5 pkt (max +1).
  Przykład: 1 silny (bazowy 6) + 2 niezależne umiarkowane (+2) + 1 zależny słaby (+0.5) → 8.
  Przy braku jakiegokolwiek faktu silnego: pułap 6/10 bez względu na liczbę słabych.
Czy zbieżność wystarcza bez bezpośredniego dowodu: tak / nie / graniczne

Alternatywna interpretacja (jak przeciwnik rozbije zbieżność):
  Argument 1:
  Argument 2:
Riposta:

Procesowe zastosowanie:
  ☐ Argumentacja w piśmie (sekcja uzasadnienia faktycznego)
  ☐ Mowa końcowa
  ☐ Wniosek dowodowy — żądanie dokumentu zamykającego zbieżność
  ☐ Pytania na rozprawie zamykające narrację
```

---

## 13.4 Narracja procesowa — wersja własna

Narracja procesowa to chronologicznie i logicznie spójna historia zdarzeń,
która prowadzi sąd od stanu faktycznego do wniosku prawnego.
Musi być: prawdziwa (oparta na dowodach), zrozumiała, wewnętrznie spójna,
niesprzeczna z żadnym dowodem w aktach oraz odporna na kontrnarrację.

```text
[NARRACJA-WŁ]
Narracja procesowa — wersja własna:

Faza 1 — Stan wyjściowy:
  Opisz: kto, gdzie, kiedy, w jakim stosunku prawnym i faktycznym.
  Cel fazy: zakotwiczenie sądu — kontekst przed sporem.
  Fakty: F001, F002, ...

Faza 2 — Zdarzenie inicjujące spór:
  Opisz: co się stało jako pierwsze; kto działał aktywnie, kto zaniechał.
  Cel fazy: wskazanie, kto uruchomił mechanizm prowadzący do szkody/naruszenia.
  Fakty: ...

Faza 3 — Eskalacja / sekwencja:
  Opisz: jak rozwijała się sytuacja krok po kroku; każdy krok to ogniwo łańcucha.
  Cel fazy: wykazanie ciągłości i nieuchronności — nie seria przypadków, lecz proces.
  Fakty: ...

Faza 4 — Punkt kulminacyjny:
  Opisz: zdarzenie, które przesądziło o sporze; moment krystalizacji bezprawności/szkody.
  Cel fazy: skupienie uwagi sądu na decydującym momencie.
  Fakty: ...

Faza 5 — Skutki:
  Opisz: szkoda / krzywda / naruszenie / bezprawność i ich konkretne następstwa.
  Cel fazy: połączenie kulminacji z roszczeniem — sąd widzi związek przyczynowy.
  Fakty: ...

Faza 6 — Działania strony:
  Opisz: co zrobiła strona po zdarzeniu i dlaczego; jak to uzasadnia roszczenie/obronę.
  Cel fazy: wykazanie racjonalności i dobrej wiary własnej strony.
  Fakty: ...

─────────────────────────────────────────────
Wniosek narracyjny:
  „Fakty te razem pokazują, że ..."

Dowody zamykające narrację (po których sąd nie ma wątpliwości):
Luki narracyjne (co nie jest jeszcze opowiedziane dowodem):
Ryzyka narracyjne (co może podważyć całą historię):
```

---

## 13.5 Narracja procesowa — wersja przeciwnika

Obowiązkowa. Narracja przeciwnika nie jest lustrzanym odbiciem narracji własnej —
jest odrębną interpretacją tych samych lub innych faktów, konstruowaną z własnej
logiki i własnego interesu procesowego. Każda faza ma odmienne cele retoryczne.

```text
[NARRACJA-PRZEC]
Narracja procesowa — wersja przeciwnika:

Faza 1 — Stan wyjściowy (według przeciwnika):
  Opisz: jak przeciwnik przedstawi kontekst przed sporem; które fakty tła wybierze,
  a które przemilczy; jak skonstruuje swój punkt startowy.
  Cel fazy dla przeciwnika: zdefiniowanie stanu „normalności" korzystnej dla siebie.
  Fakty, na które się powoła: ...
  Fakty, które przemilczy: ...

Faza 2 — Zdarzenie inicjujące (według przeciwnika):
  Opisz: jak przeciwnik przedstawi kto i co zapoczątkował; jaka jest jego wersja
  przyczyny sprawczej; kogo wskaże jako inicjatora konfliktu.
  Cel fazy dla przeciwnika: przeniesienie odpowiedzialności lub jej rozmycie.
  Fakty, na które się powoła: ...
  Kontrfakty, które neutralizują tę wersję: ...

Faza 3 — Sekwencja (według przeciwnika):
  Opisz: jak przeciwnik opowie łańcuch zdarzeń; które ogniwa pominie lub zreinterpretuje;
  czy będzie argumentował za przypadkowością zamiast ciągłości.
  Cel fazy dla przeciwnika: rozbicie kauzalności własnej narracji.
  Kluczowe twierdzenia przeciwnika: ...
  Ich słabości dowodowe: ...

Faza 4 — Punkt kulminacyjny (według przeciwnika):
  Opisz: jak przeciwnik zredefiniuje lub przesunie punkt decydujący; czy będzie
  minimalizował jego wagę, kwestionował bezprawność lub przesuwał winę.
  Cel fazy dla przeciwnika: oderwanie kulminacji od odpowiedzialności.
  Argument: ...
  Dowód przeciwnika wspierający tę wersję: ...

Faza 5 — Skutki (według przeciwnika):
  Opisz: jak przeciwnik zakwestionuje szkodę, jej wysokość, związek przyczynowy
  lub przyczynienie się poszkodowanego.
  Cel fazy dla przeciwnika: zminimalizowanie lub wyłączenie odpowiedzialności.
  Główny argument kwotowy / kauzalny: ...

Faza 6 — Działania strony (według przeciwnika):
  Opisz: jak przeciwnik przedstawi własne działania jako racjonalne i zgodne z prawem,
  a działania użytkownika jako nadmiarowe, spóźnione lub w złej wierze.
  Cel fazy dla przeciwnika: wykazanie własnej dobrej wiary.
  Twierdzenie: ...

─────────────────────────────────────────────
Wniosek narracyjny przeciwnika:
  „Fakty te razem pokazują, że ..."

Najsilniejsze fakty wspierające narrację przeciwnika:
Fakty, które przeciwnik przemilczy lub zminimalizuje:
Kolizje między narracją przeciwnika a dowodami w aktach:
  Kolizja 1 — fakt/dowód obalający narrację:
  Kolizja 2:

Jak obalić narrację przeciwnika:
  Argumentem faktycznym:
  Argumentem prawnym (przepis do weryfikacji w ISAP):
  Pytaniami na rozprawie:
  Wnioskiem dowodowym:
```

---

## 13.6 Mapa faktów szkodliwych i neutralizacja

Fakty szkodliwe to fakty z M1, które osłabiają własną pozycję lub wzmacniają
pozycję przeciwnika. Ich ignorowanie jest błędem procesowym — należy je ujawnić
i zneutralizować zanim zrobi to przeciwnik.

```text
[SZKODLIWY-001]
Fakt ID: (z M1)
Treść faktu:
Dlaczego szkodliwy:
  — osłabia tezę o: ...
  — wspiera tezę przeciwnika o: ...
  — jest sprzeczny z: (inny fakt / twierdzenie / dowód)

Strategie neutralizacji:
  [A] Kontekst — fakt jest prawdziwy, ale w kontekście innych faktów
      zmienia znaczenie:
      Fakty kontekstualizujące:

  [B] Alternatywna interpretacja — fakt można wyjaśnić inaczej:
      Wyjaśnienie:
      Dowód wspierający wyjaśnienie:

  [C] Uprzedzenie — podniesienie faktu samemu, zanim zrobi to przeciwnik,
      z własną interpretacją:
      Jak sformułować:

  [D] Obezwładnienie — wykazanie, że fakt jest prawnie irrelewantny:
      Uzasadnienie prawne (przepis do weryfikacji w ISAP):

  [E] Przyjęcie i odwrócenie — przyznanie faktu i wykazanie,
      że wzmacnia on własną pozycję:
      Jak:

Rekomendowana strategia: A / B / C / D / E / kombinacja
Ryzyko bez neutralizacji: niskie / średnie / wysokie / krytyczne
```

---

## 13.7 Test spójności narracyjnej

Obowiązkowo przed wygenerowaniem bloku `[BLOK-MP13→M7]`.
Wynik NIESPÓJNA blokuje eksport — patrz ścieżka naprawy poniżej.

```text
TEST SPÓJNOŚCI NARRACYJNEJ:

□ Czy narracja jest wewnętrznie spójna (żaden fakt jej nie zaprzecza)?
  Jeśli nie — która sprzeczność: [KOL-ID] → wróć do M3, utwórz kartę kolizji

□ Czy narracja jest spójna z materiałem dowodowym (żaden dowód jej nie obala)?
  Jeśli nie — który dowód: [DOW-ID] → wróć do M8, zaktualizuj ocenę admissibility

□ Czy każde twierdzenie narracyjne ma pokrycie w faktach z M1?
  Twierdzenia bez pokrycia → oznacz [H-ŁAŃCUCH] lub usuń

□ Czy narracja odpowiada na pytania, które sąd będzie miał?
  Nieodpowiedziane pytania sądu → dodaj do luk narracyjnych w sekcji 13.4

□ Czy narracja jest wolna od faktów, których nie ma w dokumentach?
  Uzupełnienia spoza dokumentów → usuń lub oznacz [H-ŁAŃCUCH]

□ Czy narracja wyjaśnia wszystkie kluczowe milczenia z M1 Warstwa D?
  Niewyjaśnione milczenia → dodaj do ryzyk narracyjnych lub sekcji 13.6

□ Czy narracja jest zrozumiała bez znajomości akt?
  Fragmenty wymagające uproszczenia: ...

Wynik testu: SPÓJNA / CZĘŚCIOWO SPÓJNA / NIESPÓJNA

─────────────────────────────────────────────
ŚCIEŻKA NAPRAWY:

SPÓJNA → przejdź do 13.8

CZĘŚCIOWO SPÓJNA → oznacz każdy brak jako [LUKA-NAR] w bloku 13.8;
  raport może być wygenerowany z jawnym zastrzeżeniem o lukach

NIESPÓJNA → ZATRZYMAJ eksport raportu:
  Krok 1: Zidentyfikuj źródło niespójności (sprzeczny fakt, obalający dowód,
           twierdzenie bez pokrycia)
  Krok 2: Wróć do właściwego modułu:
    — sprzeczność faktów → M3 (nowa karta kolizji KOL-ID)
    — obalający dowód → M8 (aktualizacja admissibility)
    — twierdzenie bez pokrycia → M1 (weryfikacja ekstrakcji)
  Krok 3: Zaktualizuj narrację w 13.4/13.5
  Krok 4: Ponów test 13.7
  Jeżeli po dwóch iteracjach niespójność pozostaje → eskaluj jako
  [RYZYKO-NARRACYJNE: KRYTYCZNE] w M7 sekcja 14; nie blokuj raportu,
  ale wskaż defekt jawnie
─────────────────────────────────────────────
```

---

## 13.8 Synteza faktyczna — wynik dla M7

Na końcu MP13 wygeneruj blok wejściowy dla M7 (synteza końcowa):

```text
[BLOK-MP13→M7]

ŁAŃCUCHY KLUCZOWE (do sekcji „Fakty kluczowe dla rozstrzygnięcia"):
  Łańcuch ID | Typ | Teza | Ogniwa | Siła | Najsłabsze ogniwo
  ─────────────────────────────────────────────────────────────

ZBIEŻNOŚCI KLUCZOWE (do sekcji „Ocena dowodów"):
  Zbieżność ID | Teza | Liczba faktów | Niezależność | Siła łączna
  ──────────────────────────────────────────────────────────────────

NARRACJA REKOMENDOWANA (do sekcji „Własna strategia"):
  Szkielet narracji w 5 zdaniach:
  1.
  2.
  3.
  4.
  5.

FAKTY SZKODLIWE I ICH STATUS (do sekcji „Ryzyka procesowe"):
  Fakt ID | Ryzyko | Strategia neutralizacji | Status
  ───────────────────────────────────────────────────

LUKI NARRACYJNE DO UZUPEŁNIENIA (do sekcji „Braki do uzupełnienia"):
  Brak | Jak uzupełnić | Priorytet
  ─────────────────────────────────

WYNIK TESTU SPÓJNOŚCI: SPÓJNA / CZĘŚCIOWO SPÓJNA [LUKI] / NIESPÓJNA [BLOK]
```

---

## 13.9 Reguły MP13

1. Nigdy nie buduj łańcucha z więcej niż dwóch nieudokumentowanych ogniw
   pod rząd — każde drugie ogniwo musi być faktem twardym z M1.
2. Zbieżność pięciu słabych faktów nie zastępuje jednego silnego dowodu
   — wskazuj to jawnie.
3. Każdy łańcuch musi mieć wskazaną słabość i ripostę — łańcuch bez
   słabości jest niekompletny.
4. Narracja procesowa nie jest streszczeniem akt — jest selekcją
   i uporządkowaniem faktów służącym tezie prawnej.
5. Fakty szkodliwe, które nie zostały zneutralizowane, muszą być
   flagowane jako `[RYZYKO-NARRACYJNE]` w M7.
6. Test spójności (13.7) jest obowiązkowy przed eksportem raportu;
   wynik NIESPÓJNA uruchamia ścieżkę naprawy, nie blokuje pracy permanentnie.
7. Typ łańcucha determinuje standard dowodowy i taktykę ataku — wybierz typ
   świadomie, nie domyślnie.
8. Klaster nie może obejmować całej sprawy — jeden klaster = jedno zdarzenie
   lub jedna relacja; powyżej 10 faktów podziel na subklastry.
