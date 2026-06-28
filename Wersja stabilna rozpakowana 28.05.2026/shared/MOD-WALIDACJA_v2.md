# MOD-WALIDACJA — Walidacja Formalna i Prawnicza Pisma

*Ładuj zawsze: po napisaniu pisma, przed oddaniem użytkownikowi*
*Celem: wykrycie błędów formalnych i prawniczych przed złożeniem w sądzie*
*Wersja: 2.0 | Aktualizacja: 2026-06-01 (dodano Blok J — LSL/FSL)*

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA Z PAMIĘCI
> Każdy artykuł powołany w raporcie walidacyjnym musi być zweryfikowany online przed podaniem.
> Każda sygnatura orzeczenia musi być zweryfikowana w oficjalnej bazie przed podaniem.
> Procedura: view /mnt/skills/user/shared/PRAWO-HARDGATE.md

> ⛔ HARD GATE — ZAKAZ PRZYJMOWANIA TWIERDZEŃ STRONY JAKO FAKTÓW (nowość v2.0)
> Przed każdą walidacją wykonaj F0 z MOD-FAKTY:
>   view /mnt/skills/user/shared/FACT-SOURCE-LOCK.md  (klasyfikacja FSL-A/B/C)
>   view /mnt/skills/user/shared/LEGAL-STATUS-LOCK.md (weryfikacja statusów aktów)
> Każde twierdzenie o statusie prawnym aktu (prawomocność, skuteczność, ważność)
> musi przejść przez LSL przed użyciem w piśmie.
> Twierdzenie strony/organu o statusie = FSL-B = wymaga weryfikacji = NIE jest faktem.

## BLOK A — Wymogi proceduralne (formalne)

Brak któregokolwiek z poniższych = BLOKADA złożenia pisma.

```
☐ Właściwy sąd (rzeczowo i miejscowo)?
   → SR/SO: właściwość rzeczowa (art. 16–17 KPC)
   → Miejscowość: właściwość ogólna (art. 27 KPC) lub szczególna
     (np. art. 461 KPC dla spraw pracy — sąd miejsca pracy)
   → Błąd właściwości → przekazanie = opóźnienie min. kilka miesięcy

☐ Sygnatura akt podana prawidłowo (jeśli sprawa w toku)?

☐ Pełna identyfikacja stron (imię, nazwisko/nazwa, PESEL/NIP/KRS, adres)?
   → Brak PESEL/NIP → ryzyko zwrotu pisma (art. 126 §2 KPC od 2020 r.)

☐ Wartość przedmiotu sporu/zaskarżenia wskazana i wyliczona?
   → Wpływa na: właściwość sądu, opłatę, dopuszczalność kasacji
   → Reguły obliczania: art. 19–24 KPC (sumowanie, nie szacowanie)

☐ Opłata sądowa: uiszczona / zwolnienie wskazane?
   → Brak opłaty → wezwanie do uzupełnienia + 7 dni (art. 130 §1 KPC)
   → Po bezskutecznym wezwaniu: zwrot pisma

☐ Pełnomocnictwo dołączone (jeśli pełnomocnik)?
   → Brak pełnomocnictwa → wezwanie do uzupełnienia (art. 130 §1 KPC)

☐ Odpisy dla każdej strony postępowania (art. 128 §1 KPC)?

☐ Lista załączników kompletna i numerowana?

☐ Data i podpis strony lub pełnomocnika?
   → Brak podpisu → wezwanie do uzupełnienia (art. 130 §1 KPC)
```

**Format alertu blokującego:**
```
[⛔ FORM-PROC-[nr]] Brak/błąd: [nazwa wymogu]
Przepis: [art. X KPC]
Skutek: [zwrot / odrzucenie / wezwanie do uzupełnienia]
Działanie: [co konkretnie uzupełnić]
```

## BLOK B — Spójność wewnętrzna pisma

```
☐ Każde twierdzenie z stanu faktycznego ma dowód w sekcji "Na dowód"?
   → Twierdzenie bez dowodu = poziom D — tylko twierdzenie strony

☐ Sekcja "Na dowód" kompletna: każdy dowód z "na okoliczność: [...]"?
   → Brak wskazania okoliczności → sąd może oddalić wniosek dowodowy

☐ Kwoty spójne w całym piśmie (nagłówek WPS = żądanie = wyliczenie)?

☐ Daty spójne (stan faktyczny = dowody = chronologia)?

☐ Brak twierdzeń sprzecznych ze sobą wewnętrznie w piśmie?

☐ Powołane przepisy istnieją w aktualnym brzmieniu?
   → Weryfikacja: isap.sejm.gov.pl

☐ Powołane orzeczenia mają zweryfikowane sygnatury (URL w notatkach)?
   → Halucynacja sygnatury = błąd dyskredytujący całe pismo
```

## BLOK C — Styl procesowy

```
☐ Brak ocen moralnych bez podstawy dowodowej?
   → "Pozwany działał w złej wierze" bez dowodu = opinia, nie fakt

☐ Brak sformułowań emocjonalnych mogących zrazić sąd?
   → "bezczelnie", "kłamliwie", "bezwstydnie" — obniżają wiarygodność

☐ Każde obalenie wskazuje KONKRETNY fakt, nie ogólną negację?
   → "Twierdzenie jest nieprawdziwe" bez rozwinięcia = brak skuteczności

☐ Wnioski są precyzyjne i wykonalne przez sąd?
   → "Wnoszę o sprawiedliwe rozstrzygnięcie" = wniosek nieskuteczny
   → Prawidłowo: "Wnoszę o zasądzenie od pozwanego na rzecz powoda
     kwoty [X] zł wraz z odsetkami ustawowymi za opóźnienie od [Y]
     do dnia zapłaty"

☐ Pismo ma rozsądną długość (zasada koncentracji)?
```

## BLOK D — Terminy i prekluzja

```
☐ Pismo złożone w terminie zawitym (jeśli dotyczy)?
   → Patrz: MOD-OPLATY, tabela OP-3

☐ Wszystkie wnioski dowodowe zgłoszone (nie objęte prekluzją)?
   → art. 205¹ §3 KPC — dowody nieznane wcześniej: wyjaśnij dlaczego

☐ Jeśli dowody zgłoszone po terminie: wyjaśnienie dlaczego nieznane?
```

## BLOK E — Logika prawna

```
☐ Każde roszczenie: przepis + stan faktyczny + dowód?
   → Brakujące ogniwo = wniosek może zostać oddalony

☐ Podstawa prawna właściwa dla stanu faktycznego?
   → Przeczytaj pełną treść przepisu na isap.sejm.gov.pl

☐ Przepisy w właściwej kolejności (lex specialis → lex generalis)?

☐ Orzecznictwo wspiera tezę (nie ją osłabia)?
   → Sprawdź pełny tekst — czy nie ma zastrzeżeń ograniczających tezę

☐ Analogia z innej dziedziny wyraźnie oznaczona i uzasadniona?
   → "Choć orzeczenie dotyczy dziedziny [X], zasada dotycząca [Y]
      ma zastosowanie w niniejszej sprawie, ponieważ [Z]."
```

## BLOK F — Ryzyka procesowe

```
☐ Pismo nie ujawnia faktów, które strona wolałaby ukryć?
   → Test: "Czy to zdanie, gdyby znalazło się w piśmie PRZECIWNIKA,
     szkodzi mojemu klientowi?"

☐ Pismo nie dostarcza przeciwnikowi nowej linii ataku?
   → Zbędne wyjaśnienia niewymagane przez sąd → ryzyko

☐ Brak przyznań niekorzystnych?
   → Np. "Choć pracownik spóźniał się, to..." = przyznanie spóźnień

☐ Wniosek o świadka: adres/dane świadka podane?
   → Brak adresu = wniosek formalnie niekompletny (art. 258 KPC)

☐ Wniosek o biegłego: teza dowodowa precyzyjna?
   → Ogólna teza → biegły nie wie co oceniać → opinia bezużyteczna
```

## BLOK G — Intertemporalność

```
☐ Dla każdego przepisu: brzmienie na datę zdarzenia sprawdzone?
   → Format: "W brzmieniu obowiązującym w dniu [data zdarzenia],
     art. X stanowił: [...]"

☐ Orzecznictwo wydane po zmianie prawa nie stosowane do stanów
  sprzed tej zmiany?
```

## RAPORT WALIDACYJNY — FORMAT WYJŚCIOWY

```
RAPORT WALIDACJI PISMA PROCESOWEGO
Rodzaj pisma: [pozew / apelacja / sprzeciw / itp.]
Sprawa: [sygn./opis]  |  Data: [data walidacji]

STATUS: [GOTOWE DO ZŁOŻENIA / WYMAGA POPRAWEK / BLOKADA]

BLOKADY (pismo NIE może być złożone — braki formalne z Bloku A):
[lista alertów ⛔ FORM-PROC]

OSTRZEŻENIA MERYTORYCZNE (ryzyko osłabienia pozycji):
[lista z Bloków B–G]

RYZYKA PROCESOWE (Blok F):
[lista potencjalnych problemów]

NARUSZENIA ZASADY ŹRÓDŁOWOŚCI (Blok H — fakty bez pokrycia w materiale):
[lista alertów ⛔ FACT-SRC lub "brak naruszeń"]

ZGODNOŚĆ PISMO ↔ DOWODY (Blok I):
Wynik skrzyżowania: [✅ PEŁNA / ⚠️ CZĘŚCIOWA / ⛔ BRAK]
Twierdzenia bez dowodu: [lista lub "brak"]
Dowody niepowołane w piśmie: [lista lub "brak"]

ELEMENTY BEZ ZASTRZEŻEŃ:
[lista bloków A–I gdzie wszystko OK]

DZIAŁANIA PRZED ZŁOŻENIEM:
1. [priorytet krytyczny]
2. [priorytet wysoki]
3. [pozostałe]

OCENA OGÓLNA:
Spójność argumentacji: [WYSOKA / UMIARKOWANA / NISKA]
Kompletność dowodów:   [PEŁNA / CZĘŚCIOWA / LUKI KRYTYCZNE]
Ryzyko zwrotu:         [BRAK / NISKIE / WYSOKIE]
Ryzyko procesowe:      [BRAK / UMIARKOWANE / WYSOKIE]
Zgodność ze źródłem:   [PEŁNA / CZĘŚCIOWA / NARUSZENIA KRYTYCZNE]
```

## BLOK H — Zgodność z materiałem źródłowym (ZAKAZ FABRYKOWANIA FAKTÓW)

```
⛔ ZAKAZ ABSOLUTNY: Pismo NIE MOŻE zawierać faktów, dat, kwot, nazw,
numerów, zdarzeń ani twierdzeń, których NIE MA w materiale dostarczonym
przez użytkownika (dokumenty, akta, opis sprawy).

Niedopuszczalne przykłady fabrykowania:
- Data zdarzenia podana "orientacyjnie" gdy nie podano żadnej daty
- Kwota szkody wymyślona lub zaokrąglona gdy nie wskazano kwoty
- Imię/nazwa pracodawcy/strony dodane z domysłu
- Opis przebiegu zdarzenia uzupełniony "logicznie" bez podstawy w aktach
- Powołanie się na pismo/decyzję której nie dostarczono

ZASADA: Fakty nieznane → oznacz ⬛ [UZUPEŁNIJ: opis brakującego faktu]
  Nigdy nie uzupełniaj ⬛ domysłem. Czekaj na dane od użytkownika.

☐ Każdy fakt w stanie faktycznym pochodzi z materiału źródłowego?
   → "Materiał źródłowy" = dokumenty wgrane + opis podany przez użytkownika
   → Brak źródła = ⬛, nie domysł

☐ Każda data w piśmie ma potwierdzenie w źródle?

☐ Każda kwota ma potwierdzenie w źródle (faktura, decyzja, umowa)?

☐ Każda nazwa własna (strona, sąd, organ) pochodzi ze źródła?

☐ Żadne zdarzenie nie zostało "dopowiedziane" bez podstawy w aktach?

☐ Brakujące dane oznaczone ⬛ [UZUPEŁNIJ] — nie wypełnione domysłem?
```

**Format alertu:**
```
[⛔ FACT-SRC-[nr]] Brak źródła dla: [twierdzenie / fakt / kwota / data]
Skutek: twierdzenie bez źródła = ryzyko dyskredytacji pisma
Działanie: podaj dokument / opis potwierdzający lub zmień na ⬛ [UZUPEŁNIJ]
```

## BLOK I — Walidacja zgodności pismo ↔ dostarczone dowody

```
Po wygenerowaniu pisma wykonaj pełne skrzyżowanie:

☐ Każde twierdzenie faktyczne w piśmie → czy istnieje w liście dowodów?
   → Twierdzenie bez dowodu = poziom D (tylko twierdzenie strony)
   → Twierdzenia na poziomie D → oznacz w piśmie lub usuń

☐ Każdy dowód z listy → czy jest powołany w piśmie ("Na dowód")?
   → Dowód niepowołany = niewidoczny dla sądu

☐ Chronologia zdarzeń w piśmie = chronologia w dokumentach?

☐ Kwoty w piśmie = kwoty w dokumentach źródłowych (bez zaokrągleń)?

☐ Strony postępowania w piśmie = strony w dostarczonych dokumentach?

WYNIK SKRZYŻOWANIA:
  [✅] Pełna zgodność — każde twierdzenie ma dowód
  [⚠️] Częściowa zgodność — [X] twierdzeń bez pokrycia → lista
  [⛔] Brak zgodności — pismo zawiera fakty spoza materiału źródłowego
```

## BLOK J — Weryfikacja statusu prawnego aktów (FSL/LSL) [nowość v2.0]

```
Uruchom ZAWSZE gdy pismo zawiera twierdzenie o statusie jakiegokolwiek aktu.
Wywołaj: view /mnt/skills/user/shared/LEGAL-STATUS-LOCK.md

SKANUJ pismo pod kątem:
☐ Twierdzeń o prawomocności / nieprawomocności orzeczeń
☐ Twierdzeń o ostateczności / niestateczności decyzji administracyjnych
☐ Twierdzeń o skuteczności / bezskuteczności oświadczeń woli
☐ Twierdzeń o ważności / nieważności umów i porozumień
☐ Twierdzeń o prawomocności postanowień prokuratorskich
☐ Każdego innego twierdzenia o stanie prawnym aktu

DLA KAŻDEGO WYKRYTEGO TWIERDZENIA:
☐ Skąd pochodzi? FSL-A (dokument urzędowy) / FSL-B (twierdzenie strony) / FSL-C (obliczenie)
☐ Jeśli FSL-B: wykonaj protokół LSL dla właściwej kategorii (LSL-1 do LSL-6)
☐ Oblicz terminy zaskarżenia na podstawie dokumentów (nie z twierdzeń stron)
☐ Sprawdź czy w aktach jest dowód złożenia środka zaskarżenia
☐ Porównaj wynik obliczenia z twierdzeniem strony/organu

WYNIKI:
  ✅ LSL-CONFIRMED  → użyj wprost, adnotacja źródła
  ⚠️ LSL-ASSERTED  → oznacz "według twierdzeń [strona]" — NIE jako fakt
  ❓ LSL-UNKNOWN   → znacznik ⬛ [WYMAGA WERYFIKACJI]
  🔴 LSL-CONFLICT  → BLOKADA twierdzenia strony; użyj wersji z dokumentów;
                     wytknij sprzeczność jako argument procesowy
```

**Format alertu blokującego:**
```
[🔴 LSL-CONFLICT-[nr]] Twierdzenie: "[twierdzenie strony/organu]"
Źródło twierdzenia: pismo [kogo], data [data]
Wynik LSL z dokumentów: [fakt ustalony z dokumentów + obliczenie]
Dokumenty źródłowe: [lista]
Skutek: twierdzenie strony ZABLOKOWANE jako fakt przyjęty
Działanie: użyto wersji z dokumentów; sprzeczność wskazana argumentacyjnie
```

## PROPOZYCJA RAPORTU SYTUACYJNEGO — OBOWIĄZKOWA PO KAŻDYM PIŚMIE

```
Po zakończeniu walidacji i generowaniu dokumentu (.docx/.pdf) ZAWSZE wyświetl:

"✅ Pismo zostało wygenerowane i zwalidowane.

📋 Czy chcesz teraz sporządzić Raport Sytuacyjny Sprawy?
Raport podsumuje: strony, żądania, dowody, terminy, ryzyka i kolejne kroki —
w formie interaktywnego widgetu gotowego do wydruku lub edycji.

Wpisz 'raport' lub kliknij aby uruchomić."

→ Na potwierdzenie: wywołaj raport-sytuacyjny-v2 natychmiast.
→ Raport generuje się automatycznie z danych rozmowy (bez ponownego podawania).
```

```
RAPORT WALIDACJI PISMA PROCESOWEGO
Rodzaj pisma: [pozew / apelacja / sprzeciw / itp.]
Sprawa: [sygn./opis]  |  Data: [data walidacji]

STATUS: [GOTOWE DO ZŁOŻENIA / WYMAGA POPRAWEK / BLOKADA]

BLOKADY (pismo NIE może być złożone — braki formalne z Bloku A):
[lista alertów ⛔ FORM-PROC]

NARUSZENIA ZASADY ŹRÓDŁOWOŚCI (Blok H — fakty bez pokrycia w materiale):
[lista alertów ⛔ FACT-SRC lub "brak naruszeń"]

ZGODNOŚĆ PISMO ↔ DOWODY (Blok I):
Wynik skrzyżowania: [✅ PEŁNA / ⚠️ CZĘŚCIOWA / ⛔ BRAK]
Twierdzenia bez dowodu: [lista lub "brak"]
Dowody niepowołane w piśmie: [lista lub "brak"]

WERYFIKACJA STATUSÓW AKTÓW — FSL/LSL (Blok J — nowość v2.0):
[wykonaj view /mnt/skills/user/shared/LEGAL-STATUS-LOCK.md jeśli nie wykonano w F0]
Akty zweryfikowane przez LSL: [lista z tagami ✅/⚠️/❓/🔴]
Twierdzenia FSL-B użyte w piśmie: [lista z oznaczeniem "wg twierdzeń [strona]" lub "brak"]
Konflikty LSL (🔴): [lista lub "brak"]
Blokady użycia twierdzenia strony: [lista lub "brak"]

OSTRZEŻENIA MERYTORYCZNE (ryzyko osłabienia pozycji):
[lista z Bloków B–G]

RYZYKA PROCESOWE (Blok F):
[lista potencjalnych problemów]

ELEMENTY BEZ ZASTRZEŻEŃ:
[lista bloków A–I gdzie wszystko OK]

DZIAŁANIA PRZED ZŁOŻENIEM:
1. [priorytet krytyczny]
2. [priorytet wysoki]
3. [pozostałe]

OCENA OGÓLNA:
Spójność argumentacji: [WYSOKA / UMIARKOWANA / NISKA]
Kompletność dowodów:   [PEŁNA / CZĘŚCIOWA / LUKI KRYTYCZNE]
Zgodność ze źródłem:   [PEŁNA / CZĘŚCIOWA / NARUSZENIA KRYTYCZNE]
Ryzyko zwrotu:         [BRAK / NISKIE / WYSOKIE]
Ryzyko procesowe:      [BRAK / UMIARKOWANE / WYSOKIE]
```
