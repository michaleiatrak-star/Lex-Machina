---
name: chronologia-sprawy-v1
description: |
  Chronologia Sprawy v1 — automatyczna ekstrakcja i wizualizacja osi czasu zdarzeń prawnych
  z pism procesowych, dokumentów, dowodów i akt sądowych.

  UŻYWAJ gdy użytkownik:
  - prosi o "chronologię", "oś czasu", "timeline", "historię sprawy", "kolejność zdarzeń"
  - pyta "kiedy co się wydarzyło" / "od kiedy" / "w jakiej kolejności"
  - dostarcza wiele dokumentów i chce ustalić porządek zdarzeń
  - przygotowuje uzasadnienie faktyczne pisma procesowego
  - pyta o sprzeczności dat między dokumentami
  - mówi "stwórz chronologię" / "zrób oś czasu" / "ułóż fakty" / "kolejność faktów"
  - potrzebuje bazy faktycznej do apelacji lub odpowiedzi na pozew

  WYWOŁANIE: NA ŻĄDANIE — skill nie uruchamia się automatycznie.
  Router prawny oferuje go gdy: dostarczone są ≥2 dokumenty LUB sprawa jest złożona
  i wieloetapowa.

  Widget: lekki artefakt React JSX z interaktywną osią czasu, API do ekstrakcji zdarzeń,
  filtrowaniem, oznaczaniem sprzeczności i eksportem do pisma.
compatibility: "web_search, web_fetch, Anthropic API (assets/ChronologiaSprawy.jsx)"
---

# Chronologia Sprawy v1 — Framework Ekstrakcji i Wizualizacji

## ARCHITEKTURA SKILLA

```
chronologia-sprawy-v1/
├── SKILL.md                          ← ten plik — mechanika, tryby, reguły
├── assets/
│   └── widget-timeline.html          ← interaktywny widget osi czasu (Anthropic API)
└── references/
    ├── ekstrakcja-zdarzen.md         ← reguły wyciągania dat i zdarzeń z dokumentów
    └── sprzecznosci-dat.md           ← katalog typowych kolizji dat w sprawach PL
```

**Zasada progressive disclosure:** Zacznij od tego pliku. Widget ładuj tylko w TRYB B.
Dla analizy tekstowej (TRYB A) wystarczy `references/ekstrakcja-zdarzen.md`.

---

## KOMUNIKAT STARTOWY — wyświetl jako PIERWSZY krok

```
WZORZEC (dostosuj do kontekstu):

"Uruchamiam Chronologię Sprawy v1. Wyciągnę zdarzenia z Twoich dokumentów,
ułożę je na osi czasu i oznaczę ewentualne sprzeczności dat między źródłami.

Obsługuję: pisma procesowe, wyroki, protokoły, korespondencję, umowy,
decyzje administracyjne, wyciągi z akt, zeznania z datami.

💡 Jeśli chcesz interaktywny widget osi czasu z możliwością edycji i eksportu
do pisma — napisz 'widget' lub 'pokaż oś czasu'."
```

> ⚠ ZAKAZ pomijania komunikatu startowego.
> ⚠ ZAKAZ autoładowania widget-timeline.html — tylko na jawne żądanie (TRYB B).

---

## TRYBY PRACY

### TRYB A — Analiza tekstowa (domyślny)

Gdy użytkownik dostarcza dokumenty lub opisuje sprawę słownie:

```
KROK A1 — Wczytaj references/ekstrakcja-zdarzen.md
KROK A2 — Przeprowadź FAZĘ EKSTRAKCJI (patrz niżej)
KROK A3 — Wczytaj references/sprzecznosci-dat.md → sprawdź kolizje
KROK A4 — Wygeneruj raport chronologiczny (FORMAT RAPORTU niżej)
KROK A5 — Zaproponuj widget jeśli ≥5 zdarzeń lub użytkownik potrzebuje eksportu
```

### TRYB B — Widget interaktywny

Gdy użytkownik wpisuje "widget" / "pokaż oś czasu" / "timeline" / "aplikację":

> ⚠️ REGUŁA RENDEROWANIA — pliki `.jsx` przez `present_files` NIE renderują się w claude.ai.
> Jedyna poprawna metoda: `show_widget` z HTML (vanilla JS).

```
KROK B1 — Wyciągnij z rozmowy zdarzenia jako strukturę chronologiczną (schemat poniżej)
KROK B2 — Wywołaj visualize:read_me z modules=["interactive","mockup"]
KROK B3 — Wywołaj show_widget z HTML vanilla JS:
           • zdarzenia jako literały JS wbudowane bezpośrednio w HTML
           • interaktywna oś czasu: filtrowanie, sortowanie, oznaczanie sprzeczności
           • CSS variables (var(--color-*)) — BEZ React, BEZ importów
           • NIE używaj cp, str_replace ani present_files

SCHEMAT DANYCH (wbuduj jako literały JS w HTML):
  zdarzenia: [{ data, zdarzenie, zrodlo, status_zrodla, znaczenie_procesowe, ryzyko }]
  Pola null → null. Nie wymyślaj dat.
```

---

## FAZA EKSTRAKCJI ZDARZEŃ (TRYB A)

### Sekwencja dla każdego dokumentu

```
DLA KAŻDEGO DOKUMENTU:
1. Zidentyfikuj TYP: pismo procesowe / wyrok / protokół / korespondencja /
                     umowa / decyzja / zeznanie / dowód rzeczowy
2. Wypisz WSZYSTKIE daty jawne (dd.mm.rrrr lub podobne)
3. Wypisz daty ukryte (np. "po 3 miesiącach od...", "w następnym tygodniu")
4. Dla każdej daty: ustal ZDARZENIE którego dotyczy
5. Oceń PEWNOŚĆ daty: [PEWNA] / [SZACOWANA] / [SPORNA]
6. Oznacz ŹRÓDŁO: [dokument] / [zeznanie] / [wnioskowane]
```

### Struktura zdarzenia

```
ZDARZENIE:
  data:      [dd.mm.rrrr lub zakres lub ~miesiąc.rrrr]
  pewność:   [PEWNA / SZACOWANA / SPORNA]
  opis:      [co się wydarzyło — 1 zdanie, faktycznie, bez ocen]
  strona:    [kto działał: powód / pozwany / sąd / organ / osoba trzecia]
  źródło:    [dokument + strona/data pisma]
  znaczenie: [KLUCZOWE / ISTOTNE / TŁO]
  kolizja:   [null / opis sprzeczności z innym źródłem]
```

---

## FORMAT RAPORTU CHRONOLOGICZNEGO (TRYB A)

```
## CHRONOLOGIA SPRAWY — [tytuł sprawy lub opis]
Wygenerowano: [data]  |  Dokumentów: N  |  Zdarzeń: M  |  Sprzeczności: K

### OŚ CZASU

[data]  ██  [KLUCZOWE/ISTOTNE/TŁO]
        [opis zdarzenia]
        Strona: [kto] | Źródło: [dokument]
        ⚠ SPRZECZNOŚĆ: [opis jeśli jest]

[data]  ...

### SPRZECZNOŚCI DAT
Jeśli K > 0:
  ⚠ [Zdarzenie X]: [dokument A] podaje [data1], [dokument B] podaje [data2]
     Różnica: [N dni]. Rekomendacja: [która data jest bardziej wiarygodna i dlaczego]

### LUKI CZASOWE
  📌 Brak dokumentów z okresu: [od] → [do] ([N dni/miesięcy])
     Potencjalnie istotne: [co mogło się wydarzyć w tym czasie]

### ZDARZENIA NIEUSTALONE CHRONOLOGICZNIE
  ? [opis] — brak daty, wzmiankowane w: [źródło]

### REKOMENDACJE DO PISMA
  → Fakty kluczowe dla uzasadnienia: [lista]
  → Daty wymagające weryfikacji: [lista]
  → Sugerowana kolejność w uzasadnieniu faktycznym: [numerowana lista]
```

---

## REGUŁY EKSTRAKCJI

### Co traktować jako zdarzenie

```
✓ Złożenie pisma / doręczenie (data z prezentatą lub potwierdzeniem)
✓ Zawarcie umowy / aneksu
✓ Zwolnienie / wypowiedzenie / rozwiązanie stosunku
✓ Wyrok / postanowienie / decyzja administracyjna
✓ Przekroczenie terminu
✓ Płatność / brak płatności / wezwanie do zapłaty
✓ Zdarzenie faktyczne (wypadek, incydent, spotkanie)
✓ Zawiadomienie organów (policja, prokuratura, PIP, UOKiK)
✓ Upływ terminu zawitego
✓ Zmiana stanu prawnego lub faktycznego strony
```

### Czego NIE traktować jako zdarzenie

```
✗ Daty pisania pisma procesowego (chyba że = data zdarzenia)
✗ Daty powołanych przepisów (wejście w życie ustaw) — chyba że kluczowe
✗ Daty orzeczeń powoływanych jako precedens
✗ Daty hipotetyczne / warunkowe ("gdyby doszło do...")
```

### Priorytety wiarygodności źródeł

```
1. Dokumenty urzędowe z pieczęcią / prezentata sądu
2. Wyroki i postanowienia z sygnaturą
3. Korespondencja z potwierdzeniem odbioru
4. Zeznania potwierdzone przez ≥2 świadków
5. Korespondencja e-mail / SMS z metadanymi
6. Zeznania jednostronne
7. Twierdzenia w pismach procesowych (bez dowodu)
```

---

## SPRZECZNOŚCI — PROTOKÓŁ OBSŁUGI

```
GDY wykryjesz sprzeczność dat:
1. Oznacz oba zdarzenia flagą ⚠ SPRZECZNOŚĆ
2. Podaj RÓŻNICĘ w dniach
3. Oceń WPŁYW PROCESOWY:
   - KRYTYCZNY: sprzeczność dotyczy terminu zawitego / przedawnienia / skuteczności doręczenia
   - ISTOTNY: sprzeczność zmienia sekwencję przyczynową
   - MARGINALNY: różnica nie wpływa na rozstrzygnięcie
4. Zaproponuj źródło rozstrzygnięcia sprzeczności
   (które źródło jest wiarygodniejsze i dlaczego)
5. Jeśli wpływ KRYTYCZNY → STOP i poinformuj użytkownika przed kontynuacją
```

---

## EKSPORT DO PISMA PROCESOWEGO

```
Na żądanie "eksportuj do pisma" / "uzasadnienie faktyczne" / "sekcja faktów":

FORMAT EKSPORTU:
"[Numer]. W dniu [data] [podmiot] [zdarzenie opisane w czasie przeszłym,
bezosobowo, bez ocen]. [Dowód: nazwa dokumentu]."

Przykład:
"1. W dniu 15 marca 2023 r. powód zawarł z pozwanym umowę o pracę
na czas nieokreślony. (Dowód: umowa o pracę z 15.03.2023 r.)"

ZASADY:
✓ Każde zdarzenie = osobny akapit z numerem
✓ Tylko zdarzenia [PEWNA] lub [SZACOWANA z adnotacją]
✓ Zdarzenia [SPORNE] → osobna sekcja "Fakty sporne"
✓ Kolejność: ścisła chronologiczna (od najstarszego)
✓ Styl: bezosobowy, faktyczny, bez ocen prawnych
```

---

## INTEGRACJA Z INNYMI SKILLAMI

```
→ analizator-dowodow-v3:
   Po ekstrakcji zdarzeń sprawdź czy daty pokrywają się z datami w dowodach
   Moduł M3c (Spójność) — uruchom jeśli wykryto sprzeczności

→ analiza-sadowa-v5:
   Chronologia jako input do Filtru #4 (Kontekst sporu)
   i Filtru #10 (Sprzeczności między-pismowe)

→ pisma-procesowe-v3:
   Eksport sekcji faktów (FORMAT EKSPORTU wyżej) jako gotowy blok
   do uzasadnienia faktycznego pozwu / apelacji

→ analizator-przepisow-v2:
   Jeśli data zdarzenia wpływa na stosowanie przepisu
   (zmiana prawa w trakcie sprawy) → uruchom weryfikację
```

---

## SELF-CHECK (przed każdą odpowiedzią)

```
□ Czy wyświetliłem komunikat startowy?
□ Czy wczytałem references/ekstrakcja-zdarzen.md (TRYB A)?
□ Czy przetworzyłem WSZYSTKIE dostarczone dokumenty?
□ Czy każde zdarzenie ma: datę, opis, stronę, źródło, pewność?
□ Czy sprawdziłem sprzeczności (references/sprzecznosci-dat.md)?
□ Czy oznaczyłem luki czasowe?
□ Czy eksport do pisma jest bezosobowy i bez ocen prawnych?
□ Czy przy ≥5 zdarzeniach zaproponowałem widget?
□ Czy sprzeczności KRYTYCZNE zostały wyróżnione przed kontynuacją?
□ Czy zaoferowałem integrację z analiza-sadowa-v5 lub pisma-procesowe-v3?
```

---

*Chronologia Sprawy v1 — ekstrakcja · oś czasu · sprzeczności · eksport do pisma*
*Wywoływana NA ŻĄDANIE przez prawny-router-v3*
*Integracja: analizator-dowodow-v3 · analiza-sadowa-v5 · pisma-procesowe-v3 · analizator-przepisow-v2*

---

## ARCHITEKTURA RENDEROWANIA — ZASADA NADRZĘDNA

> ⚠️ KOREKTA KRYTYCZNA — nadpisuje wszystkie wcześniejsze instrukcje cp/present_files/JSX.

Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai — użytkownik widzi tylko link.
**Jedyna poprawna metoda:** `show_widget` z HTML (vanilla JS).
NIE używaj: `cp`, `str_replace`, `present_files`, `.jsx`, `window.__INJECTED__`.
Plik `assets/ChronologiaSprawy.jsx` to dokumentacja struktury — nie kopiuj go.


---

# MIN8 QUALITY UPGRADE

Ten skill działa z dodatkowym kontraktem jakościowym `upgrade-min8/MIN8-UPGRADE.md` oraz checklistą `upgrade-min8/QUALITY-CHECKLIST.md`.

## Obowiązkowe reguły wykonawcze
- stosuj twarde bramki źródłowe dla przepisów i orzecznictwa,
- odróżniaj fakty, interpretacje, hipotezy i ryzyka,
- nie przyjmuj twierdzeń użytkownika jako udowodnionych bez dowodu,
- wskazuj poziom pewności 0–10,
- eskaluj do właściwego skilla, gdy sprawa wykracza poza zakres modułu,
- nie duplikuj funkcji `shared`; referuj do nich jako zależności.

## Status modernizacji
Docelowy poziom jakościowy: minimum 8.0/10 przy użyciu wspólnego kontraktu `SKILL-CONTRACT-MIN8`.
