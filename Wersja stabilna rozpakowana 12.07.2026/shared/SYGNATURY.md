# SYGNATURY — Moduł Walidacji Sygnatur Sądowych

> **Plik:** `/mnt/skills/user/shared/SYGNATURY.md`
> **Wersja:** 1.1 (2026-07-05) — dodano KONTRAKT WYNIKU WERYFIKACJI
>              (FOUND/NOT_FOUND/AMBIGUOUS/OUT_OF_SCOPE, wzorzec sententim; AUDYT-2026-07-05a)
> **Wersja poprzednia:** 1.0 (2026-05-25)
> **Status:** AKTYWNY — naprawa BLOKER-2
> **Podstawa:** Instrukcja sądowa (zarządzenie MS z 19.06.2019, Dz. Urz. MS z 2019 r. poz. 138 ze zm.)
>              Zasady biurowości SN (zmiana 01.01.2021 r.)

---

## ZASADA ABSOLUTNA

⛔ **ZAKAZ generowania sygnatur z pamięci.**
Każda sygnatura w odpowiedzi systemu MUSI:
(a) pochodzić z weryfikacji online (orzeczenia.ms.gov.pl / sn.pl / nsa.gov.pl / saos.org.pl), LUB
(b) być oznaczona jako [PRZYKŁADOWA] gdy ilustruje format, LUB
(c) być przekazana przez użytkownika — wtedy system sprawdza format, ale nie weryfikuje istnienia.

---

## STRUKTURA SYGNATURY SĄDU POWSZECHNEGO

```
[Wydział_rzymski] [Sekcja_arabska?] [Repertorium] [Numer_porządkowy] / [Rok]

Przykład: I C 145/23   →  Wydział I, repertorium C (cywilne), sprawa 145, rok 2023
Przykład: II K 78/24   →  Wydział II, repertorium K (karne), sprawa 78, rok 2024
Przykład: IX 2 GC 24/22 → Wydział IX, sekcja 2, repertorium GC (gospodarcze), sprawa 24, rok 2022
```

---

## REPERTORIA — TABELA WALIDACYJNA

### Sądy Rejonowe (SR) i Okręgowe (SO) — sprawy pierwotne

| Repertorium | Rodzaj sprawy | Sąd |
|---|---|---|
| C | Cywilne — procesy | SR, SO |
| Ns | Cywilne — nieprocesowe | SR, SO |
| Nc | Nakazy zapłaty | SR |
| Co | Cywilne — inne | SR, SO |
| K | Karne | SR |
| Ko | Karne — inne | SR |
| Kp | Karne przygotowawcze | SR |
| W | Wykroczenia | SR |
| Wo | Wykroczeniowe — inne | SR |
| GC | Gospodarcze — procesy | SR wyspecjalizowane, SO |
| Ns-Rej | Rejestrowe (KRS) | SR |
| GU | Upadłościowe | SR |
| GRp | Restrukturyzacyjne | SR |
| Cps | Uproszczone | SR |
| RC | Rodzinne i opiekuńcze | SR (wydz. rodzinny) |
| Nmo | Nieletni | SR |
| U | Ubezpieczenia społeczne | SO |
| P | Pracownicze | SO (wydz. pracy) |

### Sądy Apelacyjne (SA) — sprawy odwoławcze i inne

| Repertorium | Rodzaj sprawy |
|---|---|
| **ACa** | Apelacje cywilne (od wyroków SO) |
| **ACz** | Zażalenia cywilne (od postanowień SO) |
| **AKa** | Apelacje karne (od wyroków SO) |
| **AKz** | Zażalenia karne (od postanowień SO) |
| **AKzw** | Zażalenia karne wykonawcze |
| **AKo** | Karne — inne pisma SA |
| **APa** | Apelacje pracownicze |
| **APz** | Zażalenia pracownicze |
| **AUa** | Apelacje ubezpieczeniowe |
| **AUz** | Zażalenia ubezpieczeniowe |
| **AGa** | Apelacje gospodarcze |
| **AGz** | Zażalenia gospodarcze |
| **I ACa** | Wydział I + apelacja cywilna (pełna sygnatura SA) |

> ⚠️ **BŁĄD KRYTYCZNY:** Format „II ACa 123/21" dla **Sądu Najwyższego** jest niepoprawny.
> ACa to repertorium **Sądu Apelacyjnego**, nie SN. SN używa własnych repertoriów — patrz niżej.

### Sąd Najwyższy (SN) — repertoria po reformie 01.01.2021

| Repertorium | Izba / Rodzaj |
|---|---|
| **I CSK / II CSK / III CSK / IV CSK / V CSK** | Izba Cywilna — skargi kasacyjne (przed 2021) |
| **CSKP** | Izba Cywilna — po przyjęciu do rozpoznania (od 2021) |
| **I KK / II KK / III KK / IV KK / V KK** | Izba Karna — kasacje karne |
| **KK** | Izba Karna — kasacje (uproszczona forma) |
| **NKK** | Izba Karna — nowe kasacje (od 2021) |
| **I UK / II UK** | Izba Pracy i Ubezpieczeń Społecznych |
| **I NSNc / II NSNc** | Izba Kontroli Nadzwyczajnej i Spraw Publicznych |
| **I NKN / II NKN** | Sprawy dyscyplinarne |
| **CNP / CNPP** | Skargi o stwierdzenie niezgodności z prawem |
| **I CO / II CO** | Cywilne — inne |

> **Nota:** SN zmienił sygnatury od 01.01.2021 r. (zmiana techniczna bez skutków procesowych).
> Sprawa kasacyjna z 2020 r. może mieć sygnaturę III CSK 123/20; ta sama po przyjęciu od 2021 → CSKP.

### Naczelny Sąd Administracyjny (NSA)

```
[Izba][Rodzaj]/[Siedziba_WSA] [numer]/[rok]
Przykład: I SA/Bk 10/23  →  Izba I (Finansowa), skarga administracyjna, WSA Białystok
Izby: F (Finansowa), G (Gospodarcza), O (Ogólnoadministracyjna)
```

### Trybunał Konstytucyjny (TK)

```
K [numer]/[rok]   → wniosek o kontrolę konstytucyjności
P [numer]/[rok]   → pytanie prawne
SK [numer]/[rok]  → skarga konstytucyjna
Przykład: K 6/06, SK 4/02
```

---

## KONTRAKT WYNIKU WERYFIKACJI — FOUND / NOT_FOUND / AMBIGUOUS / OUT_OF_SCOPE

> Dodano: 2026-07-05 (AUDYT-2026-07-05a). Wzorzec: sententim — deterministyczny
> weryfikator sygnatur (0 LLM w runtime). Reguła naczelna sententim:
> **"jeśli czegoś nie ma w bazie → NOT_FOUND. Nigdy nie zgaduj."**

Każda weryfikacja sygnatury (V-SYG-3, KROK 0/1 z PRAWO-HARDGATE) MUSI kończyć się
JEDNYM z czterech statusów. Zakaz wyników "chyba istnieje", "prawdopodobnie tak":

| Status | Definicja | Obowiązkowa reakcja systemu |
|---|---|---|
| **FOUND** | Dokładnie JEDNO trafienie w bazie: sygnatura + sąd (+ data, jeśli podana) zgodne | Cytuj z pełnymi danymi (sąd, data, URL) + ✅ [VER: źródło, data] |
| **NOT_FOUND** | Zero trafień w bazie, która POKRYWA dany typ sądu i okres | ⛔ NIE CYTUJ. Komunikat: "sygnatura nie została potwierdzona — pominięto zgodnie z PRAWO-HARDGATE" (SCENARIUSZ B) |
| **AMBIGUOUS** | Ta sama sygnatura w ≥2 sądach (format sygnatur SR/SO/SA nie jest ogólnokrajowo unikalny) | ⛔ NIE WYBIERAJ SAM. Przedstaw WSZYSTKICH kandydatów (sąd + data) i dopytaj / zawęź po sądzie lub dacie |
| **OUT_OF_SCOPE** | Zero trafień, ale baza NIE pokrywa danego sądu/okresu (np. SAOS: brak NSA/WSA, SN w SAOS niepełny; sententim: tylko domena kredytowa) | NIE potwierdzaj i NIE zaprzeczaj. Eskaluj do bazy oficjalnej (KROK 1 PRAWO-HARDGATE: sn.pl / orzeczenia.ms.gov.pl / nsa.gov.pl / trybunal.gov.pl) |

**Reguły twarde kontraktu:**

```
K-SYG-1: Zanim zinterpretujesz zero trafień, ustal POKRYCIE bazy (corpus scope):
         jakie instancje i jaki okres baza faktycznie indeksuje.
         Zero trafień poza pokryciem = OUT_OF_SCOPE, nigdy NOT_FOUND.

K-SYG-2: ⛔ ZAKAZ "blisko pasującej" sygnatury. Trafienie częściowe
         (inny rok, inne repertorium, inny numer) = NOT_FOUND dla sygnatury
         pytanej. Nie "poprawiaj" sygnatury na najbliższego kandydata.

K-SYG-3: AMBIGUOUS nie jest błędem — jest informacją. System prezentuje
         kandydatów bez preferencji; wybór należy do użytkownika lub do
         zawężenia (sąd / data ISO YYYY-MM-DD).

K-SYG-4: Statusy NOT_FOUND i OUT_OF_SCOPE NIGDY nie mogą być cytowane jako
         "potwierdzone przez narzędzie". Znacznik ✅ [VER] przysługuje
         wyłącznie statusowi FOUND.

K-SYG-5: Przy każdym FOUND zapisz do śladu weryfikacji (WERYFIKACJA-SLAD.md):
         źródło (URL), datę pobrania, sąd i datę orzeczenia — komplet danych
         audytowych, nie samą sygnaturę.
```

**Normalizacja przed porównaniem** (żeby kosmetyka nie generowała fałszywych NOT_FOUND):
wielkość liter, spacje i kropki w skrótach repertoriów są nieistotne
(`II CSK 750/15` ≡ `ii csk 750/15` ≡ `II C.S.K. 750/15`). Różnica w treści
merytorycznej (numer, rok, repertorium, wydział) POZOSTAJE różnicą.

---

## PROCEDURA WALIDACJI V-SYG

Wykonaj PRZED każdym cytowaniem sygnatury:

```
V-SYG-1: Czy sygnatura pochodzi od użytkownika lub z narzędzia wyszukiwania?
          TAK → przejdź do V-SYG-2
          NIE (generujesz sam) → ⛔ STOP: oznacz [PRZYKŁADOWA] lub wyszukaj online

V-SYG-2: Sprawdź format — czy repertorium pasuje do sądu?
          ACa/AKa/APa/AUa → musi być SA (nie SN, nie SO)
          CSK/KK → SN (stare), CSKP/NKK → SN (nowe od 2021)
          C/K/Nc/GC → SR lub SO
          SA/Bk/Wa/Wr... → WSA lub NSA
          NIE pasuje → ⛔ BŁĄD FORMATU: poinformuj użytkownika

V-SYG-3: Czy sygnatura ma być cytowana jako realne orzeczenie?
          TAK → obowiązkowe: najpierw kanał strukturalny (MCP verify_signature /
                web_fetch https://www.saos.org.pl/api/search/judgments?caseNumber=...),
                fallback: web_search / web_fetch na sn.pl / orzeczenia.ms.gov.pl / saos.org.pl
                Wynik klasyfikuj WYŁĄCZNIE wg kontraktu FOUND / NOT_FOUND / AMBIGUOUS /
                OUT_OF_SCOPE (sekcja wyżej). Tylko FOUND → cytuj.
          NIE (ilustracja formatu) → oznacz [PRZYKŁADOWA]

V-SYG-4: Rok sygnatury vs rok reformy SN:
          Rok ≥ 2021 + repertorium CSK → ⚠️ OSTRZEŻENIE: sprawdź czy nie powinno być CSKP
```

---

## NAJCZĘSTSZE BŁĘDY DO WYKRYCIA

| Błędna sygnatura | Problem | Korekta |
|---|---|---|
| II ACa 123/21 (dla SN) | ACa = SA, nie SN | Szukaj II CSK lub CSKP dla SN |
| IV CSK 45/22 (po 2021) | Po 2021 SN przeszedł na nowe repertoria | Sprawdź czy nie jest to CSKP |
| I C 123/23 (dla SA) | C = SR/SO, nie SA | Dla SA: I ACa |
| K 12/23 (dla SR) | K to repertorium SR, dla TK to K [numer]/[rok] | Rozróżniaj kontekst |
| VKK bez numeru izby | V KK → Izba V SN Karna | Poprawna forma: V KK 234/22 |

---

## INTEGRACJA Z ORZECZENIA-SADOWE-V2

Moduł SYGNATURY.md jest obowiązkowo wczytywany przez orzeczenia-sadowe-v2 PRZED
każdym cytowaniem orzeczenia. Instrukcja integracji:

```
// W orzeczenia-sadowe-v2, przed cytowaniem:
view /mnt/skills/user/shared/SYGNATURY.md
→ Wykonaj V-SYG-1 przez V-SYG-4
→ Dopiero po wyniku OK: cytuj z linkiem źródłowym
```
