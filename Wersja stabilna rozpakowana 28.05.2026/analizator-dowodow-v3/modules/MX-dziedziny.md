# MX — Wykrywanie dziedzin prawa i routing specjalistyczny

## Cel

Przed analizą właściwą ustalić, jakie dziedziny prawa są aktywne w materiale.
Chroni przed pominięciem reżimów prawnych istotnych dla sprawy i uruchamia
właściwe moduły specjalistyczne dla każdej wykrytej dziedziny.

**Reguła:** MX uruchamiaj zawsze po zebraniu materiału (po FAZA 0 lub MP0),
zanim przejdziesz do modułów analizy. Czas wykonania: 1–2 minuty.

---

## MX.1 — Procedura wykrywania

### Krok 1: Szybkie skanowanie sygnałów

Dla każdego dokumentu / opisu sprawy sprawdź obecność sygnałów w poniższej tabeli.
Sygnał = słowo, pojęcie, instytucja lub typ dokumentu wskazujący na daną dziedzinę.

### Krok 2: Klasyfikacja

Dla każdej wykrytej dziedziny określ:
- **Rola**: GŁÓWNA (decyduje o istocie sporu) / POMOCNICZA (towarzysząca) / PROCEDURALNA (tylko tryb)
- **Pewność**: ✅ pewna / ❓ wymaga potwierdzenia
- **Podstawa**: cytat z materiału lub sygnał

### Krok 3: Generowanie planu modułów

Na podstawie wykrytych dziedzin wskaż listę modułów do uruchomienia
(patrz tabela MX.2 poniżej).

---

## MX.2 — Macierz dziedzin, sygnałów i modułów

| Kod | Dziedzina | Sygnały rozpoznawcze | Moduły warstwy D | Moduły warstwy P | Uwagi |
|-----|-----------|--------------------|-----------------|-----------------|----|
| `[CYW-ZOB]` | Zobowiązania cywilne | umowa, roszczenie, zapłata, faktura, zaliczka, kara umowna | MD1–MD4 | MP2, MP4 | Sprawdź art. 6 KC (ciężar dowodu) |
| `[CYW-ODS]` | Delikt / odszkodowanie | szkoda, bezprawność, wina, związek przyczynowy, art. 415 KC | MD2, MD4 | MP2, MP4 | 4 przesłanki; każda = osobny łańcuch |
| `[CYW-DOBR]` | Dobra osobiste | zniesławienie, znieważenie, wizerunek, cześć, art. 23–24 KC | MD2 | MP2, MP4, MP6 | Aktywuj M6 (profilowanie reputacyjne) |
| `[CYW-TERM]` | Terminy / przedawnienie | data, przedawnienie, zarzut, art. 118–125 KC | MD5 | MP2 | Obowiązkowy alert ⚠ ZAWITY |
| `[CYW-PROC]` | Procedura cywilna | KPC, pozew, odpowiedź, apelacja, postanowienie | MD5 | MP0, MP2 | Sprawdź prekluzję (art. 207 §6 KPC) |
| `[PRAC-ROZW]` | Rozwiązanie stosunku pracy | wypowiedzenie, dyscyplinarka, art. 52 KP, odwołanie do sądu pracy | MD3a, MD3b | MP2, MP4 | Termin zawity: 21 dni (art. 264 §1 KP) |
| `[PRAC-MOB]` | Mobbing / dyskryminacja | mobbing, molestowanie, nierówne traktowanie, art. 94³ KP | MD2 | MP2, MP4, MP6 | M6 behawiorystyka; ciężar dowodu obrócony |
| `[PRAC-WYNA]` | Wynagrodzenie | wynagrodzenie, nadgodziny, premia, potrącenie, EKPS | MD2, MD4 | MP2 | Weryfikuj listy płac i harmonogramy |
| `[PRAC-DOK]` | Dokumentacja pracownicza | akta osobowe, świadectwo pracy, regulamin, zakres obowiązków | MD3a | MP2 | Wady formalne = M3a obligatoryjny |
| `[PRAC-BHP]` | BHP / wypadek przy pracy | wypadek, protokół powypadkowy, PIP, BHP, uraz | MD1, MD3a | MP2, MP8 | Protokół PIP = dowód A; weryfikuj |
| `[KARNE-ZN]` | Prawo karne — znamiona | art. KK, akt oskarżenia, zarzut, oskarżony, pokrzywdzony | MD3b | MP2(karne), MP6 | ZAWSZE kwalifikator z prawo-polskie-v2 |
| `[KARNE-DOW]` | Dowody karne | zakaz art. 168a KPK, protokół przesłuchania, biegły sądowy | MD3b | MP8 | Nagrania: art. 168a KPK (zakaz kk) |
| `[KARNE-POKR]` | Status pokrzywdzonego | pokrzywdzony, zawiadomienie, art. 49 KPK | MD1 | MP2, MP4 | Weryfikuj zdolność procesową |
| `[RODO]` | Ochrona danych osobowych | RODO, dane osobowe, zgoda, przetwarzanie, naruszenie | MD3b | MP11 | Aktywuj MP11 obligatoryjnie |
| `[CYBER]` | Cyberprzestępczość | art. 267 KK, dostęp do konta, monitoring, e-mail bez zgody | MD3b | MP11, MP6 | Alert legalności nagrań / dostępu |
| `[ADM]` | Postępowanie administracyjne | KPA, decyzja, organ, odwołanie, WSA, NSA | MD5 | MP2, MP0 | Termin odwołania: 14 dni (art. 129 KPA) |
| `[PPSA]` | Sądowa kontrola administracji | WSA, NSA, skarga, PPSA | MD5 | MP2 | Termin skargi: 30 dni (art. 53 §1 PPSA) |
| `[GOSP]` | Prawo gospodarcze | KSH, spółka, zarząd, udziały, umowa B2B | MD1, MD4 | MP2 | Postęp. gospodarcze: prekluzja art. 458⁵ KPC |
| `[RODZ]` | Prawo rodzinne / spadkowe | alimenty, rozwód, podział majątku, spadek, testament | MD4, MD5 | MP2, MP4 | Weryfikuj akty stanu cywilnego |
| `[UBEZP]` | Ubezpieczenia społeczne | ZUS, składki, zasiłek, KRUS, decyzja ZUS | MD3a, MD5 | MP2 | Odwołanie do SO przez KPA |
| `[ETYKA]` | Etyka pełnomocników | zarzut wobec adwokata, radcy, notariusza | — | MP2, MP4 | Sprawdź kodeks etyki zawodowej |
| `[BUDOW]` | Prawo budowlane | pozwolenie na budowę, PINB, samowola, decyzja WZ | MD3a | MP2, MP0 | Weryfikuj decyzje administracyjne |
| `[IP]` | Własność intelektualna | prawa autorskie, patent, znak towarowy, plagiat | MD2, MD3b | MP2, MP4 | Ustawa PrAut, PWP |
| `[KONSUM]` | Prawo konsumenckie | rękojmia, gwarancja, odstąpienie, UOKiK, niedozwolone klauzule | MD3b | MP2 | Klauzule abuzywne → analizator-umow-v1 |
| `[MED]` | Prawo medyczne | błąd medyczny, zgoda pacjenta, dokumentacja medyczna | MD2, MD4 | MP2, MP8 | Ciężar dowodu: wina domniemana |
| `[WINDYK]` | Windykacja | nakaz zapłaty, klauzula, egzekucja, komornik | MD5 | MP2 | Termin sprzeciwu: 14 dni (art. 503 KPC) |

---

## MX.3 — Reguły wielokrotnej kwalifikacji

Jeden fakt może należeć do wielu dziedzin jednocześnie. Przykłady:

```
Fakt: pracodawca nagrywa pracownika bez zgody
  → [PRAC-DOK] dokumentacja pracownicza
  → [CYBER] art. 267 KK — dostęp do urządzeń
  → [RODO] przetwarzanie danych bez podstawy
  → [KARNE-ZN] potencjalny czyn zabroniony
  Działanie: MD3b (obowiązkowy) + MP11 + kwalifikator karny

Fakt: wypowiedzenie bez formy pisemnej
  → [PRAC-ROZW] wada formalna wypowiedzenia
  → [CYW-PROC] uchybienie art. 30 §3 KP (forma pisemna)
  → [CYW-TERM] termin odwołania 21 dni — alert ZAWITY
  Działanie: MD3a + MD3b + MD5(alert) + MP2

Fakt: dostęp do skrzynki e-mail byłego pracownika
  → [PRAC-DOK] archiwizacja korespondencji służbowej
  → [RODO] dane osobowe pracownika
  → [CYBER] art. 267 KK jeśli prywatna skrzynka
  Działanie: MP11 + MD3b + kwalifikator jeśli sprawa karna
```

**Zasada:** przy wielokrotnej kwalifikacji uruchamiaj moduły dla KAŻDEJ aktywnej
dziedziny. Nie wybieraj jednej — siłą procesową jest pokrycie wszystkich torów.

---

## MX.4 — Format wyjściowy (do włączenia w raport)

```
══════════════════════════════════════════════════════
MX — WYKRYTE DZIEDZINY PRAWA
══════════════════════════════════════════════════════

DZIEDZINY GŁÓWNE:
  ✅ [KOD] Nazwa — rola: GŁÓWNA
     Podstawa: „[cytat lub opis sygnału]"
     Kluczowy standard: [co trzeba udowodnić]
     Ciężar dowodu: [kto i co]

DZIEDZINY POMOCNICZE:
  ✅ [KOD] Nazwa — rola: POMOCNICZA
     Podstawa: [sygnał]

DO SPRAWDZENIA:
  ❓ [KOD] Nazwa — wymaga: [pytanie do użytkownika]

PLAN MODUŁÓW:
  Warstwa D: [lista modułów D]
  Warstwa P: [lista modułów P]
  Specjalistyczne: [MP11, MP6 itp. z uzasadnieniem]

KWALIFIKATOR KARNY: TAK → uruchom prawo-polskie-v2 kwalifikator
  Zarzut / art.: [art. KK]
WIELOKROTNA KWALIFIKACJA: [TAK/NIE] — [jakie fakty, jakie dziedziny]

ALERTY WSTĘPNE:
  [jeśli wykryto krytyczne sygnały już na etapie MX — np. termin 21 dni]
══════════════════════════════════════════════════════
```

---

## MX.5 — Integracja z innymi modułami

Po MX wyniki trafiają do:
- **MD1** (klasyfikacja dowodów) — uzupełnij TYPE o wykryte dziedziny
- **MP2** (katalog prawny) — wykryte kody dziedzin = punkt wejścia katalogu
- **FAZA 2 dashboard** — wypełnij tablicę `dziedziny[]` wykrytymi kodami
- **MP7 / MD6** (raporty) — sekcja „Dziedziny prawa" bazuje na MX.4

**Nigdy nie uruchamiaj MP2 (katalog prawny) bez uprzedniego MX.**
MX jest gate'em do MP2 — daje gotowe kody dziedzin bez powielania wykrywania.
