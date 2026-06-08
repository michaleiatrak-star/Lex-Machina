---
name: pisma-procesowe-v3
version: 3.0
type: executive-pisma
status: production
description: |
  Modularny framework do tworzenia profesjonalnych pism procesowych w sprawach
  cywilnych, pracowniczych, karnych i administracyjnych. Stosuj ZAWSZE gdy
  użytkownik prosi o napisanie pozwu, odpowiedzi na pozew, apelacji, zażalenia,
  sprzeciwu, pisma przygotowawczego, wniosku dowodowego, pisma do prokuratury,
  lub jakiegokolwiek innego pisma sądowego — niezależnie od dziedziny prawa.
  Stosuj też gdy użytkownik opisuje konflikt prawny i nie wie od czego zacząć.
  V3: model trzech wiadomości (W1 rama, W2 projekt, W3 weryfikacja ze źródeł).
  Przepisy i orzeczenia wyłącznie z oficjalnych źródeł online. Nigdy z pamięci.
compatibility: "Wymaga narzędzi: web_search, web_fetch (weryfikacja przepisów i orzeczeń online)"
---

# Pisma Procesowe v3 — Model Trzech Wiadomości

---

## ⛔⛔⛔ HARD GATE ZERO — BEZWZGLĘDNY AUTOMAT STANÓW ⛔⛔⛔

> To jest pierwsza instrukcja. Wykonaj ją zanim przeczytasz cokolwiek innego.

**AUTOMAT STANÓW — jedyna dozwolona sekwencja:**

```
STAN 0: Routing (Test A + Test B)
STAN 1: W1 — Rama i strategia          → STOP → czekaj na zatwierdzenie przez użytkownika
STAN 2: W2 — Projekt pisma             → STOP → przejdź do W3 bez pytania
STAN 3: W3 — Weryfikacja + walidacja   → STOP → generuj .docx tylko gdy W3 zamknięte
```

**ZAKAZY BEZWZGLĘDNE automatu — ŻADEN NIE MA WYJĄTKU:**

```
⛔ ZAKAZ-1: NIE generuj projektu pisma (W2) bez ukończonego W1 i zatwierdzenia przez użytkownika.
⛔ ZAKAZ-2: NIE wstawiaj żadnego numeru Dz.U. ani sygnatury orzeczenia w W2.
            Każdy przepis w W2 = ⚠️[art. X ustawa — WERYFIKACJA W3]
            Każde orzeczenie w W2 = [ORZECZENIE: opis → WERYFIKACJA W3]
⛔ ZAKAZ-3: NIE generuj pisma finalnego (.docx) bez ukończonego W3.
⛔ ZAKAZ-4: NIE łącz dwóch wiadomości w jednej odpowiedzi (np. W1+W2 w jednym kroku).
⛔ ZAKAZ-5: NIE cytuj przepisów ani orzeczeń z pamięci na żadnym etapie.
            Każdy artykuł KPK/KK/KPC/KC/KP/KPA — weryfikacja ISAP w W3.
```

**REGUŁA AUTODIAGNOZY — sprawdź przed każdą odpowiedzią:**

```
Czy użytkownik prosił o pismo procesowe / zażalenie / pozew / apelację?
  TAK → czy W1 już ukończone i zatwierdzone?
          NIE → wykonaj W1. STOP. Nie idź dalej.
          TAK → czy W2 już wygenerowane?
                  NIE → wykonaj W2 (tylko placeholdery ⚠️). STOP.
                  TAK → wykonaj W3. Generuj .docx dopiero po W3.
```

**REGUŁA NAPRAWY — gdy naruszono automat:**

```
Jeśli wykryjesz, że pominąłeś W1 lub W2 lub W3:
  → STOP natychmiast
  → Poinformuj użytkownika o naruszeniu
  → Wróć do brakującego etapu
  → NIE kontynuuj od miejsca pominięcia
```

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Żaden artykuł, numer Dz.U., stawka, termin ustawowy, kara ani sygnatura orzeczenia
> nie może być podany bez weryfikacji online. Dotyczy wszystkich trzech wiadomości.
> Procedura: view /mnt/skills/user/shared/PRAWO-HARDGATE.md

---

## ZASADA GŁÓWNA — MODEL TRZECH WIADOMOŚCI

Każde pismo procesowe powstaje w trzech izolowanych wiadomościach. Żadna nie może być pominięta. Żadna nie może być połączona z inną.

```
W1 — RAMA I STRATEGIA
     Co dowodzimy, czym, jakie przepisy (lista robocza ⚠️ nieweryfikowane)
     → checkpoint: użytkownik zatwierdza ramę przed redakcją
     → STOP po W1 — czekaj na odpowiedź użytkownika

W2 — PROJEKT PISMA
     Pełna redakcja procesowa. Przepisy jako ⚠️[WERYFIKACJA W3].
     Sygnatury orzeczeń: ZAKAZ — tylko placeholder [ORZECZENIE: opis → W3]
     → STOP po W2 — nie pytaj użytkownika, przejdź do W3 automatycznie

W3 — WERYFIKACJA ZE ŹRÓDEŁ + WALIDACJA
     web_fetch dla każdego ⚠️ → zamknięcie przez zweryfikowane cytaty z ISAP
     web_fetch dla każdego [ORZECZENIE] → sygnatura + teza + URL ze źródła
     MOD-WALIDACJA (bloki A–I) → raport formalny
     Pismo finalne z pełnymi oznaczeniami Dz.U.
     → .docx generowany WYŁĄCZNIE po zamknięciu W3
```

> ZASADA IZOLACJI: W2 NIE MOŻE zawierać żadnego pełnego oznaczenia Dz.U. ani żadnej sygnatury orzeczenia.
> Każde takie wstawienie w W2 jest błędem krytycznym — przepis nieweryfikowany = przepis nieistniejący.

---

## KROK 0 — ROUTING (wykonaj przed uruchomieniem modelu)

### Test A — Czy to pismo proste?

Pismo proste = spełnia WSZYSTKIE trzy warunki:
1. Jedno żądanie procesowe
2. Jedna podstawa prawna (nie wymaga analizy wielowątkowej)
3. Należy do katalogu: sprzeciw od nakazu (art. 503 KPC), zarzuty od nakazu
   (art. 493 KPC), wniosek o klauzulę (art. 781 KPC), wniosek o wszczęcie
   egzekucji (art. 797 KPC), zabezpieczenie (art. 730 KPC), zwolnienie od kosztów
   (art. 102 KSCU), uzasadnienie wyroku (art. 328¹ KPC), przywrócenie terminu
   (art. 168 KPC), wezwanie przedsądowe (art. 455 KC), wgląd do akt (art. 9 KPC),
   doręczenie przez komornika (art. 139¹ KPC), sprzeciw od orzeczenia referendarza
   (art. 398²² KPC).

→ TAK na wszystkie 3: zaproponuj `pisma-proste-v2` i zapytaj użytkownika.
→ NIE na którykolwiek: kontynuuj model trzech wiadomości poniżej.

### Test B — Intake (dane minimalne)

Przed W1 ustal minimum — brakujące dane = jedno pytanie zbiorcze:

```
□ TYP PISMA:    [pozew / apelacja / sprzeciw / wniosek / riposta / zawiadomienie]
□ DZIEDZINA:    [cywilna / pracownicza / karna / administracyjna / gospodarcza]
□ STRONY:       [powód/wnioskodawca + pozwany/uczestnik]
□ ETAP:         [nowa sprawa / sprawa w toku — sygnatura: ___]
□ CEL:          [co osiągnąć tym pismem]
□ MATERIAŁY:    [czy użytkownik dostarczył dokumenty/akta — TAK/NIE]
```

Gdy brak danych: view /mnt/skills/user/shared/INTAKE-GAP.md

---

## WIADOMOŚĆ 1 — RAMA I STRATEGIA

> ⛔ HARD GATE W1:
> NIE redaguj treści pisma w tej wiadomości.
> NIE podawaj pełnych numerów Dz.U.
> NIE podawaj sygnatur orzeczeń.
> Po ukończeniu W1 — ZATRZYMAJ SIĘ i czekaj na zatwierdzenie przez użytkownika.
> Przejście do W2 wymaga wyraźnej zgody: "tak" / "dalej" / "redaguj" / "ok".

> Cel W1: ustalić co dowodzimy, czym, i jakie przepisy będą potrzebne (lista robocza).

### W1.1 — Typ i tryb pisma

```
TYP PISMA:      [nazwa]
SĄD / ORGAN:    [nazwa — właściwość orientacyjna, weryfikacja w W3]
TRYB:           [uproszczony / zwykły / nakazowy / KPA / PPSA]
OPŁATA:         orientacyjna [kwota ⚠️ — weryfikacja w W3]
TERMIN ZAWITY:  [data lub "brak" — weryfikacja w W3]
```

### W1.2 — Teza centralna

Jedno zdanie:
```
"Dowodzimy że [X], co skutkuje [Y], na podstawie [dziedzina prawa]."
```

### W1.2a — CLAIM-VALIDATION (przed mapą przesłanek)

> Wywołaj: `view /mnt/skills/user/shared/CLAIM-VALIDATION.md`

Przed zbudowaniem mapy przesłanka → dowód wykonaj weryfikację twierdzeń strony:

- Dla każdego twierdzenia faktycznego z opisu sprawy i dostarczonych dokumentów
  wykonaj kroki C1–C4 z MOD-CLAIM-VALIDATION.
- Twierdzenie `[⛔ SPRZECZNE]` → zastąp twierdzeniem wynikającym z materiału; poinformuj użytkownika.
- Twierdzenie `[⛔ NIEUDOWODNIONE]` → oznacz jako lukę; nie buduj na nim przesłanki;
  wpisz do W1.5 jako ⬛ BRAK ISTOTNY lub BRAK KRYTYCZNY zależnie od wagi.
- Wyświetl Raport Walidacji Twierdzeń jeśli wykryto błędy.

### W1.3 — Mapa: cel → przesłanka → dowód

Dla każdego żądania:

```
┌─────────────────────────────────────────────────────────────────┐
│ ŻĄDANIE [nr]: [treść żądania]                                   │
├─────────────────────────────────────────────────────────────────┤
│ Przesłanka A: [co musimy udowodnić]                             │
│   Dowód:      [dokument / zeznanie / fakt bezsporny]            │
│   Siła:       [A=dokument urzędowy / B=prywatny / C=pośredni]  │
│ Przesłanka B: [co musimy udowodnić]                             │
│   Dowód:      [...]                                             │
│   Siła:       [...]                                             │
├─────────────────────────────────────────────────────────────────┤
│ Słabe punkty: [co przeciwnik może zaatakować]                   │
│ Luki:         [czego brakuje do pełnego udowodnienia]           │
└─────────────────────────────────────────────────────────────────┘
```

### W1.4 — Lista robocza przepisów (⚠️ nieweryfikowane)

```
⚠️ [ustawa / kodeks] art. [X] §[Y] — cel użycia: [po co w piśmie]
⚠️ [ustawa / kodeks] art. [X] §[Y] — cel użycia: [po co w piśmie]
⚠️ [orzeczenie opisowo: "wyrok SN dot. X"] — cel użycia: [teza do wsparcia]

UWAGA: Wszystkie pozycje oznaczone ⚠️ wymagają weryfikacji w W3.
Numery Dz.U., daty aktów i sygnatury zostaną ustalone dopiero w W3.
```

### W1.5 — Braki krytyczne

```
⬛ BRAK KRYTYCZNY: [opis — bez tego pisma nie można złożyć]
⬛ BRAK ISTOTNY:   [opis — osłabi pismo]
⬛ BRAK TECHNICZNY:[opis — można uzupełnić w W2/W3]
```

### Checkpoint W1 → W2

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ RAMA GOTOWA — [typ pisma] dla [strona] przeciwko [strona]
Teza: [jedno zdanie]
Żądań: [n] | Przepisów do weryfikacji: [n] ⚠️ | Orzeczeń do weryfikacji: [n]
Braków krytycznych: [n] 🔴

Czy rama jest poprawna? Mogę przejść do redakcji pisma (W2)?
Jeśli brakuje danych — podaj je teraz, uzupełnię ramę przed redakcją.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

⛔ NIE PRZECHODZIJ DO W2 bez wyraźnej zgody użytkownika lub odpowiedzi "tak" / "dalej" / "redaguj".
⛔ Nawet gdy użytkownik dał wcześniej materiały i kontekst — W1 musi być zatwierdzone oddzielnie.
⛔ Pośpiech użytkownika ("od razu pisz", "pomiń ramę") NIE zwalnia z W1 — wykonaj W1 i czekaj.

---

## WIADOMOŚĆ 2 — PROJEKT PISMA

> ⛔ HARD GATE W2:
> Wykonaj W2 wyłącznie po zatwierdzeniu W1 przez użytkownika.
> W2 NIE MOŻE zawierać: żadnego numeru Dz.U., żadnej sygnatury orzeczenia.
> Każdy przepis = ⚠️[art. X ustawa — WERYFIKACJA W3]
> Każde orzeczenie = [ORZECZENIE: opis → WERYFIKACJA W3]
> Po ukończeniu W2 — przejdź do W3 automatycznie (nie pytaj użytkownika o zgodę).

> Cel W2: pełna redakcja procesowa pisma w oparciu o zatwierdzoną ramę z W1.
> Fakty: wyłącznie z materiałów użytkownika. Braki = ⬛ [UZUPEŁNIJ: opis]

> ⛔ HARD GATE — FAKTY:
> Czy użytkownik dostarczył materiały źródłowe?
>   TAK → MOD-FAKTY uruchomi się w W3 po weryfikacji prawnej
>   NIE → stosuj zasadę nadrzędną: żaden fakt bez źródła z opisu użytkownika

### W2.1 — Moduły do wczytania przed redakcją

```
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-SZABLONY.md   (zawsze)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-DOWODY.md     (gdy są dowody)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-OBAL.md       (gdy riposta/odpowiedź)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-OPLATY.md     (gdy pismo wszczynające)
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-ADMIN.md      (gdy sprawa adm./KPA/WSA)
```

### W2.2 — Struktura pisma (obowiązkowa)

```
[NAGŁÓWEK]
  Sąd / Organ: [nazwa i adres]
  Powód/Wnioskodawca: [dane — lub ⬛]
  Pozwany/Uczestnik:  [dane — lub ⬛]
  Sygnatura akt: [jeśli sprawa w toku — lub ⬛]
  Wartość przedmiotu sporu: ⚠️[kwota — weryfikacja reguł obliczania W3]

[OZNACZENIE PISMA]
  [Pozew / Apelacja / Sprzeciw / Wniosek / ...]

[ŻĄDANIA]
  Wnoszę o:
  1. [precyzyjne żądanie główne]
  2. [żądanie ewentualne — jeśli dotyczy]

[UZASADNIENIE]
  Stan faktyczny: [fakty z materiałów — lub ⬛]
  Podstawa prawna: ⚠️[art. X ustawa — WERYFIKACJA W3]
  Dowody: [lista z W1.3]

[WNIOSKI DOWODOWE]
  Na podstawie ⚠️[art. 217/232/258 KPC lub art. 167 KPK — WERYFIKACJA W3]:
  1. [dowód — dokument / świadek / biegły]

[PODPIS]
  [miejscowość, data]
  [imię i nazwisko / pełnomocnik]
```

### W2.3 — Lista kontrolna placeholderów (obowiązkowa)

Po ukończeniu redakcji — sporządź listę wszystkich wstawionych placeholderów:

```
PRZEPISY DO WERYFIKACJI W W3:
⚠️ P1: art. [X] [ustawa] — użycie: [gdzie w piśmie]
⚠️ P2: art. [X] [ustawa] — użycie: [gdzie w piśmie]
...

ORZECZENIA DO WERYFIKACJI W W3:
⚠️ O1: [opis orzeczenia] — teza do wykazania: [co ma udowodnić]
⚠️ O2: [opis orzeczenia] — teza do wykazania: [co ma udowodnić]
...

POLA DO UZUPEŁNIENIA:
⬛ [n] pól wymaga danych od użytkownika
```

⛔ Po W2 — przejdź do W3 automatycznie. Nie czekaj na zgodę użytkownika.

---

## WIADOMOŚĆ 3 — WERYFIKACJA ZE ŹRÓDEŁ + WALIDACJA

> ⛔ HARD GATE W3:
> NIE generuj pisma finalnego ani .docx przed ukończeniem W3.
> Każdy ⚠️Pn musi mieć wpis ✅ lub ⛔ w raporcie.
> Każdy ⚠️On musi mieć sygnaturę + URL ze źródła lub ⛔ BRAK.
> Dopiero po zamknięciu wszystkich ⚠️ — pismo finalne + .docx.

### W3.1 — Weryfikacja przepisów (ISAP)

Dla każdego ⚠️Pn z listy W2.3:

```
  KROK 1: web_fetch → https://isap.sejm.gov.pl (szukaj aktu po nazwie / Dz.U.)
  KROK 2: Potwierdź: tytuł aktu, numer Dz.U., data tekstu jednolitego
  KROK 3: Odczytaj brzmienie artykułu ze źródła — nie parafrazuj z pamięci
  KROK 4: Sprawdź: czy artykuł nie był nowelizowany po dacie zdarzenia?
  KROK 5: Zapisz: "art. [X] [ustawa] (Dz.U. [rok] poz. [nr] t.j.)" + URL

FORMAT RAPORTU bloku P:
  ✅ P1: art. [X] [ustawa] (Dz.U. [rok] poz. [nr]) — URL: [...]
  ✅ P2: art. [X] [ustawa] (Dz.U. [rok] poz. [nr]) — URL: [...]
  ⛔ P3: [opis] — BRAK DOSTĘPU / NIE ZNALEZIONO
          → pozostaw ⚠️ w piśmie z adnotacją [WYMAGA RĘCZNEJ WERYFIKACJI]
```

### W3.2 — Weryfikacja orzeczeń

Dla każdego ⚠️On z listy W2.3:

```
  KROK 1: web_search → "[opis orzeczenia] sygnatura site:orzeczenia.ms.gov.pl"
           lub: web_search → "[opis orzeczenia] sygnatura site:sn.pl"
  KROK 2: web_fetch → URL z wyników → potwierdź sygnaturę i tezę
  KROK 3: Odczytaj tezę ze źródła — nie parafrazuj z pamięci
  KROK 4: Sprawdź datę — czy linia orzecznicza aktualna po ewentualnych zmianach prawa?
  KROK 5: Zapisz: "wyrok [sąd] z [data], sygn. [nr], teza: [dosłownie ze źródła]"
           URL źródłowy obowiązkowy

FORMAT RAPORTU bloku O:
  ✅ O1: wyrok SN z [data], sygn. [nr] — URL: [...] — teza: [...]
  ✅ O2: wyrok SA [miasto] z [data], sygn. [nr] — URL: [...] — teza: [...]
  ⛔ O3: [opis orzeczenia] — NIE ZNALEZIONO w oficjalnej bazie
          → ZAKAZ użycia w piśmie. Wstaw ⬛ [UZUPEŁNIJ: orzeczenie potwierdzające X]
```

view /mnt/skills/user/orzeczenia-sadowe-v2/SKILL.md   (gdy potrzebne szerokie wyszukiwanie)

### W3.3 — MOD-FAKTY (gdy pismo z dostarczonych materiałów)

```
Czy użytkownik dostarczył materiały źródłowe?
  TAK → view /mnt/skills/user/shared/FAKTY_v2.md
        Procedura F1/F2/F3 — weryfikacja każdego faktu w piśmie
        ⛔ FIKCJA lub ⛔ BRAK ŹRÓDŁA → BLOKADA finalizacji
  NIE → pomiń W3.3
```

### W3.4 — MOD-WALIDACJA (zawsze)

```
view /mnt/skills/user/shared/MOD-WALIDACJA_v2.md
```

Wykonaj wszystkie bloki A–I. Raport walidacyjny obowiązkowy:

```
BLOK A — wymogi proceduralne (właściwość, strony, opłata, podpis)
BLOK B — spójność wewnętrzna (fakty ↔ dowody, kwoty, daty)
BLOK C — styl procesowy (oceny moralne, ogólne negacje, precyzja wniosków)
BLOK D — terminy i prekluzja
BLOK E — logika prawna (przepis + fakt + dowód dla każdego roszczenia)
BLOK F — ryzyka procesowe (co można zaatakować, przyznania niekorzystne)
BLOK G — intertemporalność (brzmienie na datę zdarzenia)
BLOK H — zgodność z materiałem źródłowym (zakaz fabrykowania faktów)
BLOK I — skrzyżowanie pismo ↔ dostarczone dowody
```

Wczytaj moduły proceduralne shared:

```text
view /mnt/skills/user/shared/TRYBY-PROCESOWE.md
view /mnt/skills/user/shared/FORMAL-CHECK.md
view /mnt/skills/user/shared/BRAKI-FORMALNE.md
view /mnt/skills/user/shared/WARUNKI-SKUTECZNOSCI.md
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Zależnie od sprawy:

```text
view /mnt/skills/user/shared/TERM-CALC.md           (termin zawity / przedawnienie / środek zaskarżenia)
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md  (twierdzenia po pierwszym piśmie / sprawa gospodarcza)
view /mnt/skills/user/shared/DOWODY-METODOLOGIA.md  (ocena materiału dowodowego)
view /mnt/skills/user/shared/ROSZCZENIA.md          (żądania główne / ewentualne / alternatywne)
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md (co dalej / sprawa wysokiego ryzyka)
view /mnt/skills/user/shared/ORZECZENIA-HIERARCHIA.md (hierarchia orzecznictwa)
```

### W3.5 — HYBRID-VALIDATION (zawsze po walidacji)

```
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
```

FAZA 1: auto-raport braków 🔴/🟡/🔵 bez pytania o zgodę
FAZA 2: użytkownik podaje dane per numer → precyzyjne wstawienie
FAZA 3: licznik ⬛ + docx gdy kompletne

### W3.6 — Pismo finalne

Po zamknięciu wszystkich ⚠️ — wydaj wersję finalną:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAPORT W3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRZEPISY:   ✅ [n] zweryfikowane | ⛔ [n] brak dostępu
ORZECZENIA: ✅ [n] zweryfikowane | ⛔ [n] nie znaleziono
WALIDACJA:  [GOTOWE DO ZŁOŻENIA / WYMAGA POPRAWEK / BLOKADA]
POLA ⬛:    [n] do uzupełnienia

STATUS PISMA: [GOTOWE / PROJEKT — uzupełnij przed złożeniem]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Po W3.6 — jeśli pismo gotowe:
- view /mnt/skills/public/docx/SKILL.md → generuj .docx → present_files
- view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md → propozycja Raportu Sytuacyjnego

---

## SELF-CHECK PRZED KAŻDĄ ODPOWIEDZIĄ (obowiązkowy)

```
□ Jestem w stanie W1 i nie mam zatwierdzenia → NIE generuję W2. STOP.
□ Jestem w stanie W2 i wstawiam Dz.U. lub sygnaturę → BŁĄD KRYTYCZNY. Usuń, wstaw ⚠️.
□ Jestem w stanie W3 i nie zamknąłem wszystkich ⚠️ → NIE generuję .docx. STOP.
□ Każdy ⚠️Pn z listy W2.3 ma wpis ✅ lub ⛔ w raporcie W3?
□ Każdy ⚠️On z listy W2.3 ma wpis ✅ lub ⛔ w raporcie W3?
□ MOD-FAKTY przeszedł bez ⛔ FIKCJA i bez ⛔ BRAK ŹRÓDŁA (gdy dostarczono materiały)?
□ HYBRID-VALIDATION Block Zero zamknięty (wynik ✅)?
□ Raport FORMAL-CHECK, BRAKI-FORMALNE, WARUNKI-SKUTECZNOŚCI, QUALITY-CHECK — kompletny?
Którykolwiek = NIE → STOP. Nie oznaczaj pisma jako gotowego.
```

---

## MODUŁY — MAPA WCZYTYWANIA

```
MODUŁ                  WIADOMOŚĆ  KIEDY
MOD-SZABLONY           W2         zawsze gdy redagujesz pismo
MOD-DOWODY             W2         gdy użytkownik dostarczył dowody/dokumenty
MOD-OBAL               W2         gdy riposta / odpowiedź na pozew / obalanie
MOD-OPLATY             W2         gdy pismo wszczynające postępowanie
MOD-ADMIN              W2         gdy sprawa adm./KPA/PPSA/WSA/NSA
MOD-PRAWO              W3.1       wbudowany w procedurę ⚠️Pn (hardgate + isap)
MOD-ORZE               W3.2       wbudowany w procedurę ⚠️On (deleguje do orzeczenia-sadowe-v2)
MOD-FAKTY / FAKTY_v2.md   W3.3       gdy pismo z dostarczonych materiałów źródłowych
MOD-WALIDACJA          W3.4       zawsze — bloki A–I
HYBRID-VALIDATION      W3.5       zawsze — auto-raport braków
MOD-ETAPY              przed W1   gdy materiał bardzo obszerny / akta wielotomowe
INTAKE-GAP             przed W1   gdy brak danych krytycznych
```

Pliki kanoniczne shared:
```
view /mnt/skills/user/shared/PRAWO-HARDGATE.md
view /mnt/skills/user/shared/INTAKE-GAP.md
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
view /mnt/skills/user/shared/MOD-WALIDACJA_v2.md
view /mnt/skills/user/shared/FAKTY_v2.md
view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md
```

---

## INTEGRACJA Z INNYMI SKILLAMI

| Potrzeba | Skill | Kiedy |
|---|---|---|
| Orzecznictwo SN/SA (szerokie wyszukiwanie) | `orzeczenia-sadowe-v2` | W3.2 gdy wiele orzeczeń do weryfikacji |
| Analiza dowodów przed W1 | `analizator-dowodow-v3` | gdy duże akta, wiele dowodów |
| Analiza sprawy przed W1 | `analiza-sadowa-v6` | gdy użytkownik nie wie od czego zacząć |
| Proste pismo 1-wątkowe | `pisma-proste-v2` | po pozytywnym Teście A |
| Wyjaśnienie dla laika | `przewodnik-prawny-v2` | gdy użytkownik zagubiony |

---

## DODATEK — CONTRADICTION INTELLIGENCE (V10)

Przy analizie pism przeciwnika (riposta, apelacja, odpowiedź) — w W1 obowiązkowo uruchom:

```
view /mnt/skills/user/pisma-procesowe-v3/modules/MOD-OBAL.md
```

Hard gate: nie przygotowuj repliki, odpowiedzi ani apelacji bez sprawdzenia w W1.2
(mapa cel → przesłanka → dowód) czy przeciwnik nie zawarł twierdzeń wzajemnie sprzecznych,
dorozumianych przyznań albo twierdzeń szkodliwych dla własnej teorii sprawy.

Moduły V10 (wczytaj gdy sprawa wymaga głębokiej analizy pism przeciwnika):
```
view ...engines/contradiction-intelligence-engine-v10
view ...engines/self-destructive-admissions-engine-v10
view ...engines/timeline-conflict-engine-v10
view ...engines/cross-pleading-consistency-engine-v10
view ...engines/strategic-theory-collapse-engine-v10
view ...engines/judicial-credibility-simulation-engine-v10
```

---

## OBSŁUGA PISMA ADMINISTRACYJNEGO (KPA/PPSA/WSA/NSA)

Ładuj `MOD-ADMIN` w W2 zawsze gdy sprawa dotyczy:
- wniosku do organu, odwołania od decyzji, zażalenia na postanowienie, ponaglenia,
- skargi na bezczynność, skargi do WSA, skargi kasacyjnej do NSA,
- wznowienia, nieważności, uchylenia lub zmiany decyzji,
- postępowań: budowlanych, środowiskowych, PZP/KIO, transportowych, sanitarnych,
  URE/UKE/UOKiK/UODO.

Przy obszernych aktach administracyjnych W1 rozszerz o:
- identyfikacja aktu/czynności i środka prawnego,
- rekonstrukcja faktów i zarzuty proceduralne,
- zarzuty materialne.
