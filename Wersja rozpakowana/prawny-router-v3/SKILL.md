---
name: prawny-router-v3
version: 3.7
type: orchestration
status: production
compatibility: "web_search, web_fetch, show_widget, create_file"
description: |
  Router Prawny v3.7 — orchestrator KAŻDEJ sprawy prawnej. Wykrywa tryb (LAIK/PRAWNIK),
  koordynuje PRIMARY→SECONDARY→FALLBACK, generuje .docx/.pdf.
  UŻYWAJ ZAWSZE i AUTOMATYCZNIE. Nigdy nie analizuj bez wczytania tego pliku.
---

# ⛔ HARD GATE — PRIORYTET BEZWZGLĘDNY

> Ten blok jest pierwszą instrukcją routera. Obowiązuje od momentu wczytania tego pliku
> do końca rozmowy — niezależnie od liczby wiadomości, dziedziny i jurysdykcji.

```
⛔ HG-ACTIVE — potwierdzam aktywność HARD GATE

ZAKAZ: żaden artykuł / § / Dz.U. / kwota / termin ustawowy / sygnatura
       nie może być podany BEZ web_search/web_fetch w tej samej odpowiedzi.

ZASADA: każde powołanie = osobny fetch — nawet jeśli weryfikowano wcześniej w tej rozmowie.
ZASADA: nawet gdy model "jest pewny" treści przepisu — weryfikacja obowiązkowa.
ZASADA: zakaz nie wygasa. PERMANENT przez całą rozmowę.

Źródła oficjalne (wyłącznie):
  isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl

Brak dostępu → ⚠️ [NIEWERYFIKOWANE] + komunikat użytkownikowi. Nigdy nie pomijaj.

Zagraniczne: pomiń prawo-polskie-v2 i ISAP — pozostałe zasady HG aktywne.

Procedura szczegółowa: view /mnt/skills/user/shared/PRAWO-HARDGATE.md
```

> ⛔ Żaden krok sekwencji głównej nie zwalnia z powyższego. HG nadrzędny wobec wszystkich reguł.

---

# Router Prawny v3.7 — Spis Treści i Sekwencja Główna

## PREFERENCJE UŻYTKOWNIKA (aktywne globalnie)

```
UP-1: router→v3 ZAWSZE pierwszy (przed jakimkolwiek skillem dziedzinowym) — każda jurysdykcja
UP-2: ISAP — weryfikacja KAŻDEGO przepisu online (web_search/web_fetch) — bez wyjątku
UP-3: Sprawy karne → ZAWSZE wczytaj mod-N-karne.md → mod-N decyduje o kwalifikatorze
UP-4: HYBRID-VALIDATION przed każdym .docx
UP-5: Zagraniczne → pomiń prawo-polskie-v2 + ISAP, pozostałe zasady aktywne
```

## SEKWENCJA GŁÓWNA

```
KROK 0  → Wczytaj ten plik → ⛔ HG-ACTIVE (blok powyżej) — potwierdź przed kontynuacją
KROK 0A → [ANONIMIZER] → view references/KROK0A-anonimizer.md
KROK 0B → [KONTEKST SESJI] → wykryj czy użytkownik wkleił/wgrał plik
          kontekstu (# KONTEKST SESJI...) lub czy napisał "masz kontekst" /
          "wczytaj sesję" / "plik z poprzedniej sesji" — jeśli TAK:
          view /mnt/skills/user/shared/MOD-KONTEKST-SESJI.md → wykonaj
          TRYB IMPORT (§4). IMPORT_AKTYWNY = true dla tej sesji.
          Jeśli NIE — pomiń, kontynuuj do KROK 1.
KROK 1  → [DETEKCJA TRYBU + HARD GATE] → view references/KROK1-detekcja.md
KROK 2  → [ROUTING [1]–[10]] → poniżej w tym pliku
KROK 3  → Załaduj PRIMARY → SECONDARY → FALLBACK
KROK 4  → Wykonaj analizę / zbierz dane
KROK 5  → Sprawdź TYP WYJŚCIA → SEKWENCJA END-TO-END → poniżej
KROK 5B → [EXPORT KONTEKSTU] → po KROK 5 jeśli sesja zawierała KROK 4a
           (analizator-dowodow-v3) lub W3 (pisma-procesowe-v3):
           view /mnt/skills/user/shared/MOD-KONTEKST-SESJI.md → wykonaj
           TRYB EXPORT (§3) — generuj plik .md i present_files.
KROK 6  → Jeśli pismo → generuj .docx
KROK 7  → DISCLAIMER → view /mnt/skills/user/shared/DISCLAIMER.md
```

> ⛔ KROK 0A jest BRAMKĄ TWARDĄ. Żaden kolejny krok nie może być wykonany
> jeśli KROK 0A nie jest zamknięty (decyzja_sesji ≠ null).

---

## KROK 2 — ROUTING [1]–[10]

### [1] DOKUMENT / UMOWA
`umowa / OWU / kontrakt / ugoda / regulamin / testament / "czy mogę podpisać" / "klauzule"`
→ PRIMARY: `view /mnt/skills/user/analizator-umow-v1/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2` · FALLBACK: `przewodnik-prawny-v2`

### [2] AKTA / WYROK / ANALIZA SZANS
`wyrok / nakaz zapłaty / wezwanie / pismo przeciwnika / "jakie mam szanse" / analiza pozycji`
→ PRIMARY: `view /mnt/skills/user/analiza-sadowa-v6/SKILL.md`
→ SECONDARY: `analizator-dowodow-v3`, `orzeczenia-sadowe-v2` · FALLBACK: `przewodnik-prawny-v2`

### [3] PISMO ZŁOŻONE
`pozew / apelacja / odpowiedź na pozew / zażalenie / skarga / pismo wielowątkowe`
→ PRIMARY: `view /mnt/skills/user/pisma-procesowe-v3/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2`, `analiza-sadowa-v6` · Wyjście: **obowiązkowo .docx**

### [4] PISMO PROSTE (1 wątek, 1 podstawa prawna)
`sprzeciw od nakazu / klauzula / przywrócenie terminu / wgląd / uzasadnienie / wezwanie do zapłaty`
→ PRIMARY: `view /mnt/skills/user/pisma-proste-v2/SKILL.md`
→ NIE używaj gdy >1 wątek → [3] · Wyjście: **obowiązkowo .docx**

### [5] ORZECZNICTWO
`"znajdź wyrok" / "precedens" / "linia orzecznicza" / weryfikacja sygnatury`
→ PRIMARY: `view /mnt/skills/user/orzeczenia-sadowe-v2/SKILL.md`
→ SECONDARY: `analiza-sadowa-v6`

### [6] DOWODY / TERMINY / KOSZTY
`maile / SMS / nagrania / faktury / terminy procesowe / koszty sądowe / opłaty komornicze`
→ PRIMARY: `view /mnt/skills/user/analizator-dowodow-v3/SKILL.md`
→ SECONDARY: `analiza-sadowa-v6`

### [7] ZAGUBIONY / FALLBACK
`"co mam zrobić" / "od czego zacząć" / wyjaśnienie wyniku / walidacja przepisu`
→ PRIMARY: `view /mnt/skills/user/przewodnik-prawny-v2/SKILL.md`
→ SECONDARY: `prawo-polskie-v2`

### [8] PRZESŁUCHANIE ŚWIADKA
`świadek / cross-examination / biegły / pytania do świadka / rozbicie zeznania`
→ PRIMARY: `view /mnt/skills/user/przesluchanie-swiadkow-v2-min90/SKILL.md`
→ SECONDARY: `analizator-dowodow-v3`, `analiza-sadowa-v6`

### [9] ANALIZA PRZEPISU
`"art. X" / "§ Y" / przesłanki / wykładnia / "czy mnie dotyczy"`
→ PRIMARY: `view /mnt/skills/user/analizator-przepisow-v2/SKILL.md`
→ SECONDARY: `orzeczenia-sadowe-v2`, `pisma-procesowe-v3`

### [10] BEZ KLASYFIKACJI — ROUTER DZIEDZINOWY
`mandat / ZUS / alimenty / stalking / mobbing / eksmisja / deweloper / upadłość / RODO
/ zatrzymanie / mediacja / komornik / rozwód / zachowek / AI Act / sprawa wielodziedzinowa`
→ PRIMARY: `view /mnt/skills/user/prawo-polskie-v2/SKILL.md`

**Kombinacje skilli** (pełna tabela → `view /mnt/skills/user/shared/ACTIVATION-MATRIX.md`):

| Sytuacja | Primary | Wyjście |
|---|---|---|
| Dokument/umowa + wezwanie | analizator-umow-v1 | .docx |
| Akta + odpowiedź + orzecznictwo | analiza-sadowa-v6 | .docx |
| Pismo złożone | pisma-procesowe-v3 | .docx |
| Pismo 1-wątkowe | pisma-proste-v2 | .docx |
| Dowody + terminy | analizator-dowodow-v3 | raport |
| Świadek | przesluchanie-swiadkow-v2 | .docx |
| Przepis + orzecznictwo | analizator-przepisow-v2 | .docx |
| AI Act | mod-AB-prawo-ai.md | analiza |
| Raport dla klienta (NA ŻĄDANIE) | raport-klienta-v1 | widget+PDF |

**Routing BJ–BW (ZUS / niepełnosprawność / zawody zaufania):**
`view /mnt/skills/user/prawny-router-v3/references/ROUTING-BJ-BW.md`

**Zasada odciążenia routera:** Router NIE jest bazą prawa materialnego — tylko orkiestruje.
Nie dubluj treści modułów dziedzinowych w routerze.

---

## KROK 5–6 — SEKWENCJA END-TO-END

```
CZY WYNIK TO PISMO [3] lub [4]?
├── TAK
│   ├── ⛔ Materiały źródłowe? TAK → view /mnt/skills/user/shared/FAKTY_v2.md (F0-F3)
│   │                           NIE → każdy fakt bez źródła = ⬛ [UZUPEŁNIJ]
│   ├── pisma-procesowe-v3 lub pisma-proste-v2 → treść
│   ├── HYBRID-VALIDATION (policz ⬛) → view /mnt/skills/user/shared/HYBRID-VALIDATION.md
│   ├── view /mnt/skills/public/docx/SKILL.md → generuj .docx → present_files
│   └── Instrukcja złożenia (LAIK: "Wydrukuj i złóż w sądzie...")
├── ANALIZA / RAPORT?
│   ├── LAIK → przewodnik-prawny-v2 (KROK H) → widget + opcje
│   └── PRAWNIK → surowy raport → "Czy wygenerować pismo?"
└── ORZECZNICTWO? → Linki do baz + cytowania → opcja "Dołącz do pisma"
```

**BRAMKA CHRONOLOGICZNA** (auto, przed KROK 4):
Wczytaj gdy ≥2 dokumenty wieloetapowe LUB słowa kluczowe ("chronologia"/"oś czasu"/"timeline"):
`view /mnt/skills/user/chronologia-sprawy-v1/SKILL.md`

---

## KROK 7 — DISCLAIMER (OBOWIĄZKOWY)

**Każda odpowiedź z analizą prawną MUSI kończyć się disclaimerem.**
Pełna procedura i treść: `view /mnt/skills/user/shared/DISCLAIMER.md`

Warianty inline (gdy brak dostępu do shared/):
- **LAIK:** `⚖️ Niniejsza analiza ma charakter informacyjny i nie stanowi porady prawnej.
  Zalecam konsultację z adwokatem lub radcą prawnym.`
- **PRAWNIK:** `⚖️ Niniejsza analiza ma charakter informacyjny. Nie stanowi porady prawnej
  (art. 4 Prawa o adwokaturze / art. 6 u.r.p.). Weryfikacja: isap.sejm.gov.pl.`

Pozycja: zawsze **ostatni element** odpowiedzi lub stopka pisma .docx.

---

## REGUŁY NADRZĘDNE

```
1.  Router = ZAWSZE pierwszy krok
2.  KROK 0A (anonimizer) PRZED wszystkim — bez wyjątku
3.  HARD GATE (KROK 1B) przed każdą analizą — skill dziedzinowy + ISAP online
4.  Jedno pytanie przy niejednoznaczności — nie zakładaj trybu
5.  "kreator" = natychmiastowe uruchomienie kreatora
6.  Pismo procesowe = obligatoryjny .docx
7.  LAIK = każdy raport przez przewodnik-prawny-v2 (KROK H)
7B. MENU = "co możesz zrobić" / "jakie masz narzędzia" / "jak działa X"
    → przewodnik-prawny-v2 KROK M, nie bezpośrednie wywołanie skilla
7C. Q&A = użytkownik pyta zamiast opisywać / "mam pytania"
    → przewodnik-prawny-v2 KROK Q z weryfikacją ISAP
8.  Termin zawity = zawsze pierwszy (nakazy/wyroki)
9.  ⛔ HARD GATE TRWAŁY — nigdy nie cytuj z pamięci, przez CAŁĄ rozmowę, niezależnie od liczby wiadomości.
    Każde powołanie artykułu/sygnatury/liczby = osobny web_search/web_fetch w tej samej odpowiedzi.
    Oficjalne źródła: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl
    ⛔ Zakaz nie wygasa. Nawet jeśli model "jest pewny" — weryfikacja obowiązkowa.
10. HYBRID-VALIDATION przed generowaniem — zero ⬛ przed oddaniem
11. present_files jako ostatni krok (przed disclaimerem w wiadomości)
12. Bramka chronologiczna — auto przy ≥2 dokumentach wieloetapowych
13. Weryfikacja: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · trybunal.gov.pl · nsa.gov.pl
14. WERYFIKACJA-ŚLAD: każdy artykuł/liczba/termin → ✅ [VER: źródło, data] lub ⚠️ [NIEWERYFIKOWANE]
    ⛔ ZAKAZ oznaczania VER bez wywołania web_search/web_fetch
    ≥3 błędy sieci z rzędu → komunikat użytkownikowi + kontynuuj z ⚠️
    Procedura: view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md
15. Sygnatury → view /mnt/skills/user/shared/SYGNATURY.md (V-SYG-1/2/3/4)
16. DISCLAIMER → ostatni element każdej odpowiedzi z analizą prawną
17. V10 CONTRADICTION INTELLIGENCE — przy analizie pism przeciwnika (riposta/apelacja/odpowiedź):
    view /mnt/skills/user/pisma-procesowe-v3/references/engines/contradiction-intelligence-engine-v10.md (przez analiza-sadowa-v6 lub pisma-procesowe-v3)
    Hard gate: nie przygotowuj repliki bez sprawdzenia sprzeczności wewnętrznych pisma przeciwnika
```

---

## SELF-CHECK (przed każdą odpowiedzią)

Pełny self-check: `view /mnt/skills/user/prawny-router-v3/references/SELF-CHECK.md`

Minimalne bramki obowiązkowe przed każdą odpowiedzią:

```
⛔ BLOK 0A — BRAMKA ANONIMIZERA (wykonaj PRZED wszystkim)
  Szczegóły: view references/KROK0A-anonimizer.md
  decyzja_sesji=null + ≥1 WYSOKI lub ≥2 ŚREDNIE → STOP. Zadaj pytanie. Czekaj.

□ references/KROK1-detekcja.md wczytany (tryb + hard gate ISAP)?
□ ⛔ HARD GATE TRWAŁY aktywny? (obowiązuje przez całą rozmowę — nie wygasa)
□ Każdy artykuł/termin → web_search/web_fetch faktycznie wywołany W TEJ ODPOWIEDZI?
□ Każdy element → ✅ [VER: źródło] lub ⚠️ [NIEWERYFIKOWANE]?
□ ACTIVATION-MATRIX.md sprawdzony przy nakładaniu się skillów?
□ PRIMARY skill wczytany PRZED analizą?
□ Termin zawity sprawdzony (nakaz/wyrok)?
□ Pismo + materiały źródłowe → shared/FAKTY_v2.md, wynik ✅?
□ LAIK → raport przez przewodnik-prawny-v2 (KROK H)?
□ Bramka chronologiczna → przy ≥2 dokumentach wieloetapowych?
□ DISCLAIMER (shared/DISCLAIMER.md) → OSTATNI element odpowiedzi?
```

---

## RENDEROWANIE WIDGETÓW

> Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai.
> Jedyna poprawna metoda inline: `show_widget` z HTML (vanilla JS).
> Pliki .docx / .pdf → present_files (dokumenty do pobrania — tu zasada nie dotyczy).

**Anonimizer — aktualny standard:**
`view /mnt/skills/user/prawny-router-v3/anonimizer/anonimizer-skill.md`

---

## POKRYCIE DZIEDZINOWE (wczytuj tylko gdy potrzebne)

```text
view /mnt/skills/user/prawny-router-v3/references/pokrycie-dziedzinowe.md
```

Tylko gdy: pytanie o dostępność modułu, audyt systemu, budowanie kombinacji multi-skill.
