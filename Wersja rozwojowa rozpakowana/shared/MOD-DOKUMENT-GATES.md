# MOD-DOKUMENT-GATES — Bramki pracy na dokumentach (moduł współdzielony)

**Wersja:** 1.0.0 | **Utworzony:** 2026-08-20z | **Status:** kanoniczny
**Powstanie:** wydzielony z `przesluchanie-swiadkow-v2-min90/SKILL.md` w ramach
flagi **F-100 (A)** — audyt wykazał, że osiem bramek o zastosowaniu OGÓLNYM
(praca na dokumentach, nie na świadku) występowało w całym systemie WYŁĄCZNIE
w skillu przesłuchań. `analizator-dowodow-v3`, którego całym przedmiotem są
dokumenty, nie miał do nich dostępu. Wydzielenie NIE jest optymalizacją
rozmiaru — jest udostępnieniem działających bramek drugiemu konsumentowi.

> ⛔ **ZASADA DEDUPLIKACJI:** to jest lokalizacja KANONICZNA tych ośmiu bramek.
> Skille konsumujące trzymają u siebie WYŁĄCZNIE indeks wyzwalaczy (nazwa +
> aktywacja + jednozdaniowy obowiązek) i odsyłają tutaj po pełną treść.
> Zakaz kopiowania treści bramek z powrotem do SKILL.md konsumenta —
> patrz `audyt-systemu-v4/references/CHECKLIST-DEDUP.md`.

## Konsumenci

| Skill | Sposób wpięcia | Od kiedy |
|---|---|---|
| `przesluchanie-swiadkow-v2-min90` | `dependencies.required` + `validation.required_gates` + KROK PRE-W1a.5 (DG-LOAD, HARD GATE) | 2026-08-20z (przeniesienie treści, bez zmiany działania) |
| `analizator-dowodow-v3` | `dependencies.required` + KROK 0d (DG-LOAD) + BLOK J | 2026-08-20z (**nowa zdolność** — wcześniej niedostępne) |

## Spis bramek

| Bramka | Aktywacja |
|---|---|
| §1 DOCUMENT-SCAN-PROMPT | każdy nowy dokument ze skanem/odręcznymi elementami/podpisem |
| §2 FOUNDATION-VERIFICATION-GATE | przed przedstawieniem teorii kryminalistycznej/stylistycznej/technicznej |
| §3 EXHAUSTIVE-EXTRACTION-GATE | przeszukiwanie zbioru pod kątem „wszystkich przypadków X" |
| §4 IMMEDIATE-LOGICAL-SCAN | PIERWSZE czytanie każdego dokumentu |
| §5 CROSS-DOCUMENT-CONSISTENCY-CHECK | każdy nowy dokument w sprawie, w której są już ustalone fakty |
| §6 ENTITY-DISAMBIGUATION-TABLE | dokumenty od ≥2 powiązanych podmiotów prawnych |
| §7 EVIDENCE-THREAD-LINKING | każde nowe ustalenie dowodowe (skan pamięci CAŁEJ rozmowy) |
| §8 QUOTE-VERIFICATION-DEFAULT | każdy fragment przedstawiany jako dosłowny cytat |

⚠️ **Czego tu NIE ma (celowo — treść specyficzna dla świadka, została w skillu
przesłuchań):** `PRZESŁANKI-GATE` z `CONTEXTUAL-REBUTTAL-CHECK`,
`FORMALNA-ZGODNOŚĆ-GATE`, `ROZRÓŻNIENIE 3.18`, `TRANSCRIPT-MINING-GATE`,
`PLAIN-TESTIMONY-DEFAULT`, `TEZA-DOWODOWA-SCOPE-GATE`,
`PROCEEDING-DISAMBIGUATION-TABLE`. Przeniesienie ich tutaj wymagałoby
uogólnienia treści, a każde uogólnienie to ryzyko utraty działającej funkcji —
odłożone świadomie.

---

## §1-§4 — Bramki pierwszego czytania dokumentu

*(przeniesione 1:1 z `przesluchanie-swiadkow-v2-min90/SKILL.md`, KROK PRE-W1,
w. 244-301; treść niezmieniona)*

> 🔴 **DOCUMENT-SCAN-PROMPT (dodane w audycie 3.6):**
> Przy KAŻDYM nowo wgranym dokumencie zawierającym elementy odręczne,
> skany, zdjęcia lub podpisy — zanim przejdziesz do ekstrakcji treści
> drukowanej, zadaj jednozdaniowe pytanie (lub, jeśli jakość obrazu na to
> pozwala, od razu spróbuj i zgłoś wynik): czy są tam odręczne dopiski,
> skreślenia, poprawki, parafki lub nieczytelne fragmenty, które warto
> zbadać. Nie czekaj, aż użytkownik sam zauważy i zapyta — to on dostarczył
> dokument, ale to system ma systematycznie sprawdzić, czy dokument kryje
> coś więcej niż tekst główny. Jeśli jakość obrazu nie pozwala na pewny
> odczyt — zgłoś to wprost i nie zgaduj treści z fałszywą pewnością (patrz
> KROK III-D: brak VER = nie twierdź, że fakt jest ustalony).

> 🔴 **FOUNDATION-VERIFICATION-GATE (dodane w audycie 3.8):**
> Przed zaproponowaniem teorii kryminalistycznej, stylistycznej lub
> technicznej dotyczącej dokumentu (np. artefakt tłumacza maszynowego,
> język interfejsu programu pocztowego, analiza autorstwa) — sprawdź
> DWA warunki, zanim przedstawisz teorię jako obiecującą:
> 1. Czy ten sam wzorzec/artefakt występuje też w INNYCH dostępnych
>    dokumentach z tej sprawy? Jeśli tak — zmienia to wagę dowodową teorii
>    (może ją osłabić: wzorzec powszechny ≠ wzorzec unikalny dla jednej
>    osoby/zdarzenia) i musi być to sprawdzone PRZED zaprezentowaniem,
>    nie po tym, jak nowy dokument przypadkowo to ujawni.
> 2. Czy dokument, do którego ma być zastosowana metoda, SPEŁNIA
>    STRUKTURALNY WARUNEK KONIECZNY tej metody? (np. technika odczytu
>    języka interfejsu z linii cytowania wymaga, żeby dokument BYŁ
>    odpowiedzią na wcześniejszą wiadomość — jeśli to samodzielna,
>    pierwsza wiadomość w wątku, metoda nie ma zastosowania i nie należy
>    jej proponować jako możliwej do wykonania).
> Jeśli nie sprawdzono obu warunków — teorię przedstawia się z jawnym
> zastrzeżeniem "niezweryfikowane" zamiast jako gotowy, mocny wniosek.

> 🔴 **EXHAUSTIVE-EXTRACTION-GATE (dodane w audycie 3.8):**
> Przy przeszukiwaniu archiwum lub zbioru dokumentów pod kątem "wszystkich
> przypadków X" (osób, kwot, dat, zdarzeń określonej kategorii):
> 1. Zbierz i policz WSZYSTKIE trafienia wyszukiwania (grep/keyword search),
>    nie tylko te najbardziej oczywiste lub pierwsze w kolejności.
> 2. Dla każdego akapitu/fragmentu zawierającego trafienie — sprawdź, czy
>    w TYM SAMYM fragmencie występują dodatkowe, powiązane wzmianki
>    (np. lista kilku nazwisk w jednym zdaniu), które łatwo pominąć,
>    skupiając się tylko na pierwszym/najlepiej udokumentowanym przykładzie.
> 3. Przedstaw wynik jako pełną listę z jawnie podaną liczbą znalezionych
>    przypadków, zanim uznasz zadanie za wykonane — nie przedstawiaj
>    częściowego wyniku jako kompletnego.
> Ryzyko zaniechania: użytkownik odkrywa brakujące przypadki dopiero
> własnymi, kolejnymi pytaniami, mimo że dane były dostępne od pierwszego
> przeszukania.

> 🔴 **IMMEDIATE-LOGICAL-SCAN (dodane w audycie 3.8):**
> Przy PIERWSZYM czytaniu każdego dostarczonego dokumentu — niezależnie od
> tego, czy użytkownik o to prosi — proaktywnie skanuj pod kątem
> wewnętrznych sprzeczności logicznych lub czasowych w samej treści
> dokumentu (np. zachowanie opisane słowem sugerującym powtarzalność
> "systematyczne", "notoryczne", "wielokrotne" przypisane do jednej,
> pojedynczej daty; role sprawcy i zgłaszającego zamienione miejscami
> względem opisanych faktów). Takie sprzeczności zgłoś w PIERWSZEJ analizie
> dokumentu, nie dopiero gdy użytkownik zapyta wprost "czy to nie jest
> ogólnikowe" lub podobne pytanie naprowadzające — to nie wymaga żadnego
> dodatkowego materiału, tylko uważnego czytania tego, co już dostępne.

---

## §5-§7 — Bramki spójności między dokumentami

*(przeniesione 1:1 z `przesluchanie-swiadkow-v2-min90/SKILL.md`, KROK 0,
w. 467-560; treść niezmieniona. Nagłówki `###` zachowane w oryginalnym
brzmieniu, żeby odesłania po nazwie bramki nadal trafiały.)*

### CROSS-DOCUMENT-CONSISTENCY-CHECK (dodane w audycie 3.7)

> 🔴 Aktywacja: za każdym razem, gdy w toku **tej samej sprawy** (niekoniecznie
> tej samej wiadomości) zostaje wgrany nowy dokument dowodowy — nie tylko
> przy pierwszym KROK 0.

```
Przy każdym nowym dokumencie dowodowym dotyczącym sprawy już omawianej
w tej rozmowie:

1. Zidentyfikuj fakty w nowym dokumencie, które DUBLUJĄ lub ROZSZERZAJĄ
   fakty już ustalone wcześniej w tej rozmowie (daty, kwoty, nazwiska,
   cytaty przypisywane konkretnym osobom).
2. Zestaw je wprost z wcześniejszymi ustaleniami. Jeśli występuje
   rozbieżność (np. ta sama osoba figuruje z inną datą lub kwotą w dwóch
   różnych dokumentach) — zgłoś to WPROST, zanim jakiekolwiek pytanie
   oparte na tym fakcie zostanie sformułowane lub zaakceptowane.
3. Nie wybieraj milcząco "poprawnej" wersji przy rozbieżności — przedstaw
   obie, ze wskazaniem źródła każdej, i poproś użytkownika o rozstrzygnięcie
   przed użyciem tego faktu w pytaniu do świadka.

Ryzyko zaniechania: rozbieżność wykryta dopiero na sali (przez świadka lub
pełnomocnika przeciwnej strony) niszczy wiarygodność całego pytania, nawet
jeśli istota zarzutu jest słuszna.
```

### ENTITY-DISAMBIGUATION-TABLE (dodane w audycie 3.8)

> 🔴 Aktywacja: w sprawie występuje więcej niż jeden powiązany podmiot
> prawny (różne NIP, różne nazwy firm o podobnym brzmieniu, różne adresy
> e-mail przypisane do tej samej grupy kapitałowej).

```
Prowadź i proaktywnie aktualizuj (bez czekania na prośbę użytkownika)
tabelę przypisania dokumentów i faktów do konkretnych podmiotów, np.:

| Podmiot | NIP | Dokumenty/maile z tego podmiotu | Osoby podpisujące |
|---|---|---|---|
| Human Park sp. z o.o. | [nr] | [lista] | [imiona] |
| Human Park Global sp. z o.o. | [nr] | [lista] | [imiona] |

Aktualizuj tę tabelę przy każdym nowym dokumencie odnoszącym się do
któregokolwiek z podmiotów. Udostępnij ją użytkownikowi, gdy:
- pojawi się pytanie dotyczące tego, który podmiot jest odpowiedzialny
  za dane działanie lub zobowiązanie,
- liczba podmiotów w sprawie przekroczy jeden i nie było jeszcze takiego
  zestawienia,
- użytkownik o to poprosi wprost.

Cel: uniknięcie sytuacji, w której przez wiele wiadomości analizuje się
dokumenty pod kątem treści, nigdy nie zestawiając ich systematycznie
względem tego, który z powiązanych podmiotów faktycznie je wystawił —
co może mieć znaczenie dla ustalenia właściwego pozwanego lub adresata
poszczególnych roszczeń.
```

### EVIDENCE-THREAD-LINKING (dodane w audycie 3.11)

> 🔴 Różnica względem CROSS-DOCUMENT-CONSISTENCY-CHECK: tamten mechanizm
> wykrywa sprzeczności między IDENTYCZNYMI faktami (ta sama osoba, inna
> data). Ten mechanizm wykrywa POWIĄZANIA TEMATYCZNE między pozornie
> różnymi faktami, które opisują to samo zjawisko z innej strony — nawet
> gdy nie dzielą żadnego identycznego słowa kluczowego.

```
Przy każdym nowym ustaleniu dowodowym (nowy dokument, nowa odpowiedź na
przeszukanie, nowy fragment zeznania) — zanim przejdziesz dalej, zapytaj
się aktywnie:

1. Czy to ustalenie opisuje TEN SAM przedmiot/zdarzenie/mechanizm co coś,
   co zostało już ustalone WCZEŚNIEJ w tej samej rozmowie, tylko z innej
   perspektywy lub w innym słownictwie? (Nie szukaj identycznych słów —
   szukaj tego samego zjawiska opisanego inaczej: np. "dokument z kwotą
   do zwrotu" wspomniany w wiadomości WhatsApp i "dokumenty wewnętrzne —
   transakcje" wspomniane w zeznaniu świadka mogą odnosić się do TEGO
   SAMEGO dokumentu, opisanego przez dwie różne osoby z przeciwstawnych
   perspektyw.)
2. Jeśli tak — przedstaw to POŁĄCZENIE wprost, jako spójną narrację,
   zamiast zostawiać oba fakty jako osobne, niepowiązane ustalenia,
   czekając aż użytkownik sam zauważy związek.
3. Zaznacz wyraźnie, czy połączenie jest PEWNE (te same konkretne dane:
   nazwisko + kwota + data) czy PRAWDOPODOBNE/DO POTWIERDZENIA (tematyczne
   podobieństwo bez twardego dowodu tożsamości) — nie przedstawiaj
   hipotezy jako ustalonego faktu.
4. Zaproponuj, jeśli to możliwe, jedno pytanie do świadka, które wprost
   testuje, czy połączenie jest prawdziwe (np. "czy dokument X, o którym
   Pani zeznała, to ten sam dokument, do którego odwoływałem się w
   wiadomości Y").

Ryzyko zaniechania: użytkownik traci mocniejszą, zunifikowaną narrację
dowodową na rzecz kilku osobnych, słabszych faktów, które w istocie
wzajemnie się potwierdzają i wzmacniają, gdyby je połączyć.
```

---

## §8 — QUOTE-VERIFICATION-DEFAULT

*(przeniesione 1:1 z `przesluchanie-swiadkow-v2-min90/SKILL.md`, ETAP W3,
w. 1277-1285; treść niezmieniona.)*

> 🔴 **QUOTE-VERIFICATION-DEFAULT (dodane w audycie 3.7):**
> Każdy fragment tekstu przedstawiany jako dosłowny cytat z dokumentu
> (do użycia w pytaniu konfrontacyjnym / technice loopingu) jest
> weryfikowany słowo-w-słowo względem źródła **w momencie jego
> zaproponowania**, nie dopiero gdy użytkownik o to wprost zapyta.
> Wynik weryfikacji (zgodny / zgodny ze skrótem oznaczonym wielokropkiem /
> niezgodny) podaje się przy pytaniu. Cytatu niemożliwego do zweryfikowania
> względem dostępnego źródła nie włącza się do pytania — oznacza się jako
> wymagający weryfikacji przed użyciem.

---

## Integracja z pozostałymi bramkami systemu

- `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` (SD-VER) — **wykonywany PRZED tymi
  bramkami**: najpierw kompletność materiału, potem praca na jego treści.
  §1 i §4 uruchamiają się na dokumencie, który przeszedł SD-VER.
- `shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md` (RZ-SHOW) — rejestr plików
  pokazywany użytkownikowi; §3 odpowiada za kompletność WYNIKU przeszukania
  wewnątrz pliku, RZ-SHOW za kompletność LISTY plików. Dwa różne obowiązki.
- `shared/MOD-STEP-TRACKER.md` — pominięcie którejkolwiek z bramek §1-§8
  raportuje się jako „⚠️ POMINIĘTY" na tych samych zasadach co pominięcie
  kroku pipeline'u.
- `shared/PRAWO-HARDGATE.md` — §8 dotyczy cytatów z DOKUMENTÓW SPRAWY;
  cytaty z przepisów i orzeczeń podlegają dodatkowo PRAWO-HARDGATE.

## Historia

- **1.0.0 (2026-08-20z)** — utworzenie przez wydzielenie z
  `przesluchanie-swiadkow-v2-min90` (F-100 A). Treść ośmiu bramek przeniesiona
  bajtowo, bez modyfikacji ani jednego zdania — celem było zachowanie
  wszystkich działających funkcji przy jednoczesnym udostępnieniu ich
  `analizator-dowodow-v3`. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`,
  wpis `AUDYT-2026-08-20z`.
