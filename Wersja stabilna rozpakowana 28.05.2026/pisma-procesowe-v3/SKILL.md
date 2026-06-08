---
name: pisma-procesowe-v3
description: |
  Modularny framework do tworzenia profesjonalnych pism procesowych w sprawach
  cywilnych, pracowniczych, karnych i administracyjnych. Stosuj ZAWSZE gdy
  użytkownik prosi o napisanie pozwu, odpowiedzi na pozew, apelacji, zażalenia,
  sprzeciwu, pisma przygotowawczego, wniosku dowodowego, pisma do prokuratury,
  lub jakiegokolwiek innego pisma sądowego — niezależnie od dziedziny prawa.
  Stosuj też gdy użytkownik opisuje konflikt prawny i nie wie od czego zacząć.
  V3: architektura modułowa — ładowane są TYLKO moduły potrzebne dla danej sprawy.
  Orzecznictwo wyłącznie z oficjalnych źródeł online. Prawo weryfikowane online.
  Nigdy nie cytuj orzeczeń z pamięci.
compatibility: "Wymaga narzędzi: web_search, web_fetch (weryfikacja przepisów i orzeczeń online)"
---

# Pisma Procesowe v3 — Framework Modularny

## ARCHITEKTURA MODUŁOWA — ZASADA DZIAŁANIA

Niniejszy skill działa modułowo: zamiast ładować 1 200+ linii za każdym razem,
identyfikujesz potrzebne moduły i wczytujesz TYLKO je. Oszczędza to tokeny
i przyspiesza pracę. Każdy moduł to osobny plik w katalogu `modules/`.

```
modules/MOD-PRAWO.md      — weryfikacja prawa, przepisy, intertemporalność
modules/MOD-DOWODY.md     — hierarchia A/B/C/D, łańcuch dowodowy
modules/MOD-ORZE.md       — wyszukiwanie podobnych spraw, karta podobieństwa,
                            formaty cytowania, analogie między dziedzinami,
                            słownik procesowy; deleguje do orzeczenia-sadowe-v2
modules/MOD-OBAL.md       — obalanie twierdzeń (6 formatów A–F)
modules/MOD-SZABLONY.md   — nagłówki i szablony 8 typów pism + właściwość sądów
modules/MOD-OPLATY.md     — tabela opłat, terminy zawite, zwolnienia
modules/MOD-WALIDACJA.md  — walidacja formalna (bloki A–G), raport
```

```
MODUŁY DOSTĘPNE:
┌─────────────────────────────────────────────────────────────────┐
│ MOD-ROUTE   — routing i klasyfikacja pisma (zawsze pierwszy)    │
│ MOD-PRAWO   — weryfikacja przepisów online (gdy nowa sprawa)    │
│ MOD-DOWODY  — hierarchia i łańcuch dowodowy (gdy są dowody)     │
│ MOD-ORZE    — wyszukiwanie podobnych spraw, ocena podobieństwa, │
│               formaty cytowania; deleguje do orzeczenia-sadowe-v2│
│ MOD-OBAL    — obalanie twierdzeń strony przeciwnej (gdy riposta)│
│ MOD-WALIDACJA — walidacja formalna i prawnicza (zawsze na końcu)│
│ MOD-FAKTY   — weryfikacja zgodności faktycznej pisma ze źródłem │
│               (zawsze gdy pismo generowane z dostarczonych akt) │
│ INTAKE-GAP  — zarządzanie brakami danych faktycznych (⬛ pola) │
│ HYBRID-VALIDATION — auto-raport braków + uzupełnianie on-demand│
│ MOD-SZABLONY — nagłówki i szablony pism (gdy piszesz pismo)    │
│ MOD-OPLATY  — opłaty sądowe i terminy (gdy pismo wszczynające) │
└─────────────────────────────────────────────────────────────────┘
```

---

## KROK 0 — ROUTING (ZAWSZE PIERWSZE)

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

→ **Jeśli TAK** na wszystkie 3: zaproponuj `pisma-proste-v2` i zapytaj użytkownika.
→ **Jeśli NIE** na którykolwiek: kontynuuj poniżej.

### Test B — Matryca modułów (wypełnij przed załadowaniem)

```
PYTANIE                                          ODPOWIEDŹ    MODUŁ
1. Czy to nowa sprawa (nie mamy akt)?            TAK/NIE  →  MOD-PRAWO (zawsze)
2. Czy użytkownik dostarczył dowody/dokumenty?   TAK/NIE  →  MOD-DOWODY (gdy TAK)
3. Czy trzeba obalić twierdzenia przeciwnika?    TAK/NIE  →  MOD-OBAL (gdy TAK)
4. Czy potrzebne orzecznictwo SN/SA?             TAK/NIE  →  MOD-ORZE (gdy TAK)
5. Czy piszemy konkretne pismo (nie plan)?       TAK/NIE  →  MOD-SZABLONY (gdy TAK)
6. Czy pismo wszczyna postępowanie?              TAK/NIE  →  MOD-OPLATY (gdy TAK)
7. Pismo gotowe do złożenia?                     TAK/NIE  →  MOD-WALIDACJA (gdy TAK)
```

```
ŁADUJĘ MODUŁY: [lista modułów]
POMIJAM MODUŁY: [lista z uzasadnieniem]
DELEGUJE DO SKILLI: [lista zewnętrznych skilli]
```

---

## KROK 1 — INTAKE (zbieranie danych, jeśli brak)

Gdy brakuje danych faktycznych — wczytaj `view /mnt/skills/user/shared/INTAKE-GAP.md` przed redakcją:
- **Dane krytyczne** (strony, typ, istota): jedno pytanie zbiorcze
- **Dane uzupełniające** (daty, kwoty, szczegóły): wstaw `⬛ [UZUPEŁNIJ: opis]`
- **Wzór/szkielet**: generuj pismo ze wszystkimi polami jako ⬛

Przed uruchomieniem modułów ustal minimum:

```
□ TYP PISMA:    [pozew / apelacja / sprzeciw / wniosek / riposta / zawiadomienie]
□ DZIEDZINA:    [cywilna / pracownicza / karna / administracyjna / gospodarcza]
□ STRONY:       [dane powoda/wnioskodawcy + pozwanego/uczestnika]
□ ETAP:         [nowa sprawa / sprawa w toku — sygnatura: ___]
□ CEL:          [co chcemy osiągnąć tym pismem]
```

Brakujące dane — zapytaj jednym pytaniem zbiorczym. Nie pytaj o każdy element osobno.

---

## KROK 2 — SEKWENCJA MODUŁÓW

> ⛔ ZASADA NADRZĘDNA (aktywna przez cały KROK 2 i generowanie treści):
> Nie wolno dodać żadnego faktu bez źródła z materiałów użytkownika.
> Jeśli nie jesteś pewien na 100% — użyj ⬛ [UZUPEŁNIJ...] i nie używaj elementu.

> ⛔ HARD GATE — FAKTY (przed generowaniem treści pisma):
> Czy użytkownik dostarczył materiały źródłowe (dokumenty, akta, pisma)?
>   TAK → MOD-FAKTY uruchomi się po wygenerowaniu treści (pkt 8 poniżej) ORAZ
>          blokuje finalizację jeśli wykryje ⛔ FIKCJA lub ⛔ BRAK ŹRÓDŁA
>   NIE → pomiń MOD-FAKTY; stosuj zasadę nadrzędną powyżej

Po identyfikacji — wczytuj moduły w kolejności:

```
1. MOD-PRAWO        (zawsze — weryfikacja przepisów)
2. MOD-DOWODY       (gdy są dowody/dokumenty)
3. MOD-ORZE         (gdy potrzebne orzecznictwo — zawiera kartę podobieństwa,
                     formaty cytowania i słownik; deleguje wyszukiwanie do
                     orzeczenia-sadowe-v2)
4. MOD-OBAL         (gdy riposta / odpowiedź / obalanie)
5. MOD-SZABLONY     (gdy piszemy konkretne pismo)
6. MOD-OPLATY       (gdy pismo wszczynające / opłata / termin zawity)
7. MOD-WALIDACJA    (zawsze na końcu — przed oddaniem pisma)
8. MOD-FAKTY        (zawsze gdy pismo generowane z dostarczonych akt/pism/dowodów
                     — weryfikacja zgodności faktycznej, patrz sekcja poniżej)
9. HYBRID-VALIDATION (zawsze — automatycznie po wygenerowaniu pisma)
   ↳ view /mnt/skills/user/shared/HYBRID-VALIDATION.md
   ↳ FAZA 1: auto-raport braków 🔴/🟡/🔵 — bez pytania o zgodę
   ↳ FAZA 2: użytkownik podaje dane per numer → wstawiaj precyzyjnie
   ↳ FAZA 3: licznik ⬛ + docx gdy kompletne
```

---

## MOD-FAKTY — WERYFIKACJA ZGODNOŚCI FAKTYCZNEJ PISMA ZE ŹRÓDŁEM

**Plik kanoniczny — wczytaj zawsze gdy pismo z dostarczonych akt/dokumentów:**
```
view /mnt/skills/user/shared/FAKTY.md
```

Uruchamiaj zawsze gdy pismo generowane jest na podstawie dostarczonych przez użytkownika
akt sprawy, pozwu, pism procesowych, dowodów, dokumentów, faktur, umów, wyroków, decyzji
lub innych materiałów wgranych do konwersacji.
Procedura F1/F2/F3, klasyfikacja błędów, format raportu i nakazy bezwzględne są w FAKTY.md.

---

## ZAKAZY BEZWZGLĘDNE (obowiązują niezależnie od modułu)

- **Nigdy** nie cytuj orzeczeń z pamięci — zawsze weryfikacja online
- **Nigdy** nie podawaj przepisów bez weryfikacji na isap.sejm.gov.pl
- **Nigdy** komentarze autorskie w treści pisma
- **Nigdy** twierdzenie bez dowodu jako fakt — tylko jako twierdzenie strony
- **Nigdy** ogólne zaprzeczenie ("to nieprawda") bez wskazania DLACZEGO
- **Nigdy** orzeczenie starsze niż 5 lat bez sprawdzenia aktualności linii
- **Nigdy** fakt, data, kwota lub orzeczenie bez wskazania źródła z materiałów użytkownika

**SELF-CHECK przed oddaniem pisma (obowiązkowy):**
```
□ Czy każdy fakt w piśmie ma przypisane źródło z materiałów użytkownika?
□ Czy MOD-FAKTY przeszedł bez ⛔ FIKCJA i bez ⛔ BRAK ŹRÓDŁA?
□ Czy HYBRID-VALIDATION Block Zero jest zamknięty (wynik ✅)?
Jeśli którykolwiek z powyższych = NIE → STOP, nie oddawaj pisma, wróć do MOD-FAKTY.
```

**Format cytowania przepisów (obowiązkowy):**
Pełne oznaczenie przy pierwszym użyciu: „art. X §Y ustawy z dnia [data]
(t.j. Dz.U. z [rok] r. poz. [nr] ze zm.)"
Przy kolejnych odwołaniach do tej samej ustawy — skrócona forma jest dopuszczalna.

---

## NAKAZY BEZWZGLĘDNE

- Każdy przepis = weryfikacja aktualnego brzmienia → isap.sejm.gov.pl
- Każde orzeczenie = URL oficjalnej bazy + stopień podobieństwa (X/5)
- Każdy fakt = zakotwiczenie w aktach (data, str., godz.)
- Każde obalenie = konkretny fakt + typ siły (A/B/C/D/E/F)
- Po każdym wygenerowanym piśmie: uruchom `view /mnt/skills/user/shared/HYBRID-VALIDATION.md` (auto-raport)
- Przy piśmie ze znacznikami ⬛: podaj licznik pól na końcu

---

## INTEGRACJA Z INNYMI SKILLAMI

| Potrzeba | Skill | Kiedy |
|----------|-------|-------|
| Orzecznictwo SN/SA | `orzeczenia-sadowe-v2` | zawsze gdy potrzeba judykatury |
| Analiza dowodów | `analizator-dowodow-v3` | gdy duże akta, wiele dowodów |
| Analiza sprawy przed pisaniem | `analiza-sadowa-v5` | przed pierwszym pismem |
| Proste pismo 1-wątkowe | `pisma-proste-v2` | po pozytywnym Teście A |
| Wyjaśnienie pojęć dla laika | `przewodnik-prawny-v1` | gdy użytkownik zagubiony |

**Zasada delegacji:** Jeśli inny skill obsługuje zadanie lepiej → deleguj.
Pisma-procesowe-v3 koordynuje; nie duplikuje innych skilli.

---

## PLIKI MODUŁÓW

Pliki kanoniczne (shared/):
view /mnt/skills/user/shared/INTAKE-GAP.md
view /mnt/skills/user/shared/HYBRID-VALIDATION.md
view /mnt/skills/user/shared/POST-VALIDATION.md
view /mnt/skills/user/shared/terminy.md
view /mnt/skills/user/shared/FAKTY.md          [gdy pismo z dostarczonych źródeł — pełna wersja MOD-FAKTY]

Wczytuj tylko te, które są potrzebne dla danej sprawy (patrz: MOD-ROUTE, Matryca modułów).