# MOD-ROUTE — Routing i Klasyfikacja Pisma

*Ładuj ZAWSZE jako pierwszy moduł — przed wszystkimi innymi*
*Cel: ustalenie właściwego skilla/trybu, załadowanie tylko potrzebnych modułów*

---

## KROK R1 — Test prostego pisma

Pismo proste = spełnia WSZYSTKIE trzy warunki jednocześnie:

```
WARUNEK 1: Jedno żądanie procesowe
WARUNEK 2: Jedna podstawa prawna (nie wymaga analizy wielowątkowej)
WARUNEK 3: Należy do katalogu:
  □ sprzeciw od nakazu zapłaty          (art. 503 KPC)
  □ zarzuty od nakazu zapłaty           (art. 493 KPC)
  □ wniosek o nadanie klauzuli          (art. 781 KPC)
  □ wniosek o wszczęcie egzekucji       (art. 797 KPC)
  □ wniosek o zabezpieczenie            (art. 730 KPC)
  □ zwolnienie od kosztów sądowych      (art. 102 KSCU)
  □ wniosek o uzasadnienie wyroku       (art. 328¹ KPC)
  □ wniosek o przywrócenie terminu      (art. 168 KPC)
  □ wezwanie przedsądowe do zapłaty     (art. 455 KC)
  □ wniosek o wgląd do akt              (art. 9 KPC)
  □ wniosek o doręczenie przez komornika(art. 139¹ KPC)
  □ sprzeciw od orzeczenia referendarza (art. 398²² KPC)
```

**→ Jeśli TAK na wszystkie 3:** zaproponuj `pisma-proste-v2` i zapytaj użytkownika.
**→ Jeśli NIE na którykolwiek:** kontynuuj poniżej (Krok R2).

---

## KROK R2 — Identyfikacja rodzaju pisma

```
□ Pismo wszczynające postępowanie (pozew, wniosek)
□ Pismo w toku postępowania (odpowiedź na pozew, riposta, pismo przygotowawcze)
□ Pismo zaskarżające (apelacja, zażalenie, skarga kasacyjna, skarga na orzeczenie)
□ Pismo dowodowe (wniosek dowodowy, zastrzeżenie do protokołu)
□ Zawiadomienie / pismo do prokuratury / organu
□ Inne: _______
```

Rodzaj pisma → wpływa bezpośrednio na wymagane moduły (patrz Krok R3).

---

## KROK R3 — Matryca modułów

Wypełnij przed załadowaniem jakiegokolwiek modułu:

```
PYTANIE                                          ODPOWIEDŹ    MODUŁ
1. Czy to nowa sprawa (nie mamy akt)?            TAK/NIE  →  MOD-PRAWO (zawsze)
2. Czy użytkownik dostarczył dowody/dokumenty?   TAK/NIE  →  MOD-DOWODY + MOD-FAKTY (gdy TAK)
3. Czy trzeba obalić twierdzenia przeciwnika?    TAK/NIE  →  MOD-OBAL (gdy TAK)
4. Czy potrzebne orzecznictwo SN/SA?             TAK/NIE  →  MOD-ORZE (gdy TAK)
5. Czy piszemy konkretne pismo (nie plan)?       TAK/NIE  →  MOD-SZABLONY (gdy TAK)
6. Czy pismo wszczyna postępowanie?              TAK/NIE  →  MOD-OPLATY (gdy TAK)
7. Pismo gotowe do złożenia?                     TAK/NIE  →  MOD-WALIDACJA (gdy TAK)
8. Pismo generowane z dostarczonych akt/źródeł? TAK/NIE  →  MOD-FAKTY (gdy TAK)
```

---

## KROK R4 — Deklaracja decyzji

Przed działaniem powiedz sobie wprost:

```
TYP PISMA:      [pozew / apelacja / sprzeciw / wniosek / riposta / zawiadomienie]
DZIEDZINA:      [cywilna / pracownicza / karna / administracyjna / gospodarcza]
ŁADUJĘ:         [lista modułów w kolejności ładowania]
POMIJAM:        [lista modułów z krótkim uzasadnieniem]
DELEGUJE DO:    [lista zewnętrznych skilli — jeśli żadnych: brak]
```

---

## KROK R5 — Kolejność ładowania modułów

Zawsze zachowuj tę kolejność (moduły zależą od poprzednich):

```
[1] MOD-PRAWO        — weryfikacja przepisów (podstawa argumentacji)
[2] MOD-DOWODY       — gdy są dowody/dokumenty
[3] MOD-FAKTY        — gdy pismo generowane ze źródeł (po MOD-DOWODY)
[4] MOD-ORZE         — gdy potrzebne orzecznictwo
[5] MOD-OBAL         — gdy riposta / odpowiedź / obalanie
[6] MOD-SZABLONY     — gdy piszemy konkretne pismo
[7] MOD-OPLATY       — gdy pismo wszczynające / opłata / termin zawity
[8] MOD-WALIDACJA    — zawsze na końcu, przed oddaniem pisma
[9] HYBRID-VALIDATION — zawsze po piśmie (auto-raport braków)
```

> Moduły [3] i [8] są obligatoryjne gdy pismo zawiera dane ze źródeł użytkownika.
> Moduły [2], [3], [4], [5], [6], [7] są warunkowe — tylko gdy potrzebne.

---

## KROK R6 — Minimalne dane przed uruchomieniem modułów

```
□ TYP PISMA:    [pozew / apelacja / sprzeciw / wniosek / riposta / zawiadomienie]
□ DZIEDZINA:    [cywilna / pracownicza / karna / administracyjna / gospodarcza]
□ STRONY:       [dane powoda/wnioskodawcy + pozwanego/uczestnika]
□ ETAP:         [nowa sprawa / sprawa w toku — sygnatura: ___]
□ CEL:          [co chcemy osiągnąć tym pismem]
```

Brakujące dane — zapytaj jednym pytaniem zbiorczym. Nie pytaj o każdy element osobno.

---

## SYGNAŁY ESKALACJI DO INNYCH SKILLI

```
SYGNAŁ                              → SKILL
────────────────────────────────────────────────────────
Pismo proste z katalogu Kroku R1   → pisma-proste-v2
Potrzeba głębokiej analizy sprawy  → analiza-sadowa-v5
Potrzeba orzecznictwa              → orzeczenia-sadowe-v2
Duże akta, wiele dowodów           → analizator-dowodow-v3
Użytkownik zagubiony w pojęciach   → przewodnik-prawny-v1
────────────────────────────────────────────────────────
Zasada: pisma-procesowe-v3 koordynuje, nie duplikuje innych skilli.
```
