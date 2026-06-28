# PRE-W2-VERIFICATION-GATE — Bramka Weryfikacji Przed Redakcją Pisma

> **Plik:** `/mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md`
> **Wersja:** 1.0.0 (2026-06-21)
> **Status:** PRODUKCJA — naprawa błędów krytycznych sesji VII P 94/25
> **Pozycja w pipeline:** między W1 (checkpoint) a W2 (redakcja) — BLOKUJE W2
> **Wywołanie:** obowiązkowe z pisma-procesowe-v3, krok PRE-W2 (przed W2.1)

---

## DLACZEGO TEN MODUŁ ISTNIEJE — ANALIZA PRZYCZYN ŹRÓDŁOWYCH

### Błąd strukturalny wyeliminowany przez ten moduł

Poprzednia architektura: PODMIOT-GATE był w W3.0 (PO wygenerowaniu tekstu W2).
Skutek: pismo generowane z danymi z pamięci, weryfikacja następowała na gotowym tekście.
Konkretne błędy w VII P 94/25:
- Adres sądu: ul. Lompy 14 (Katowice-Wschód) zamiast ul. Warszawska 45 (Katowice-Zachód)
- KRS pozwanego: argument "ten sam KRS" bez sprawdzenia w rejestrze, że KRS 0000796445
  należy do HP sp. z o.o., a nie do HP Global sp. z o.o. (która ma KRS 0001025052)

### Zasada naprawy

```
⛔ HARD GATE: W2 (redakcja pisma) NIE może rozpocząć się, dopóki nie są
   zweryfikowane online WSZYSTKIE podmioty z nagłówka i adres sądu/organu.

Dane z pamięci modelu → dane NIEWERYFIKOWANE → ZAKAZ użycia w W2.
Dane po web_search/web_fetch → dane zweryfikowane → WOLNO użyć w W2.

Ten moduł POPRZEDZA W2 — nie zastępuje W3.0 PODMIOT-GATE, który pozostaje
jako drugi poziom kontroli przy generowaniu finalnego tekstu.
```

---

## SEKWENCJA OBOWIĄZKOWA PRE-W2

```
STAN: checkpoint W1→W2 zatwierdzony przez użytkownika
PRZED W2.1: wykonaj WSZYSTKIE kroki poniżej

PRE-W2.A — Identyfikacja podmiotów wymagających weryfikacji
PRE-W2.B — Weryfikacja sądu/organu ONLINE (ZAWSZE)
PRE-W2.C — Weryfikacja pozwanego/uczestnika ONLINE (gdy spółka/CEIDG/organ)
PRE-W2.D — Weryfikacja KRS każdej liczby rejestrowej z akt ONLINE
PRE-W2.E — Raport PRE-W2 (widoczny użytkownikowi)
PRE-W2.F — Bramka: ✅ → W2.1 | ⛔ → STOP (pytanie do użytkownika)
```

---


## PRE-W2.0 — OZNACZANIE STATUSU DANYCH PODMIOTOWYCH (NOWY KROK — PRZED PRE-W2.A)

```
⛔ ZASADA STATUSU PODMIOTÓW:
Każdy podmiot niebędący osobą prywatną (spółka, organ, sąd, urząd, fundusz),
którego dane pojawią się w piśmie dowodowym lub procesowym, otrzymuje status
⬛ [DO WERYFIKACJI] natychmiast po napotkaniu — i utrzymuje ten status
aż do momentu faktycznego wywołania web_search/web_fetch w tej sesji.

DEFINICJA "NAPOTKANIA":
  Napotkanie = moment, w którym model odczytuje dane podmiotu z jakiegokolwiek
  źródła: akt, umowy, protokołu, SUDOP, pisma strony, pamięci modelu.
  Od tego momentu dane są ⬛ [DO WERYFIKACJI] — niezależnie od tego, skąd pochodzą.

WYJĄTKI (osoby prywatne — NIE oznaczaj):
  - imię i nazwisko osoby fizycznej
  - adres zamieszkania osoby fizycznej
  - PESEL, seria/nr dowodu osobistego
  - dane kontaktowe osoby fizycznej (tel., e-mail)
  Dla tych danych: używaj wyłącznie danych z akt/dokumentów użytkownika.

PODMIOTY WYMAGAJĄCE OZNACZENIA ⬛ [DO WERYFIKACJI]:
  □ sąd / organ administracji (adresat pisma)       → ⬛ [DO WER: sąd/adres]
  □ pozwany / uczestnik (spółka, organ)             → ⬛ [DO WER: KRS/NIP/adres]
  □ każdy numer KRS widoczny w aktach               → ⬛ [DO WER: KRS=podmiot?]
  □ każdy numer NIP widoczny w aktach (podmiot)     → ⬛ [DO WER: NIP=podmiot?]
  □ adres podmiotu (siedziby, kancelarii, organu)   → ⬛ [DO WER: adres aktualny?]
  □ PFRON, ZUS, PIP, urząd skarbowy, inne organy    → ⬛ [DO WER: właściwy oddział?]

STATUS-LIFECYCLE (cykl życia statusu):
  ⬛ [DO WERYFIKACJI]   → stan domyślny po napotkaniu
  🔄 [W TRAKCIE WER.]  → web_search/web_fetch wywołany, czekam na wynik
  ✅ [VER: źródło, data] → weryfikacja zakończona, dane potwierdzone
  ⚠️ [ROZBIEŻNOŚĆ: opis] → weryfikacja zakończona, ale dane w aktach ≠ rejestr
  ⛔ [NIEODCZYTALNY]    → weryfikacja niemożliwa (brak dostępu, błąd sieci)

KONSEKWENCJE:
  ⬛ [DO WERYFIKACJI] w piśmie → ZAKAZ generowania .docx
  ⬛ [DO WERYFIKACJI] w nagłówku → ZAKAZ przejścia do W2.1
  ⛔ [NIEODCZYTALNY] → oznacz w raporcie PRE-W2 i poinformuj użytkownika;
     użyj danych z akt z adnotacją ⚠️ [NIEWERYFIKOWANE — brak dostępu do rejestru]

PRZEPŁYW W SESJI:
  1. Skan SD-READ/SD-INW → identyfikuj wszystkie podmioty → oznacz ⬛ [DO WER]
  2. PRE-W2.A → PRE-W2.B → PRE-W2.C → PRE-W2.D → web_search/web_fetch per podmiot
  3. Po każdej udanej weryfikacji: zmień ⬛ → ✅ [VER: URL, data]
  4. Raport PRE-W2 (PRE-W2.E): wylistuj wszystkie podmioty ze statusem końcowym
  5. GATE-OK = zero ⬛ [DO WERYFIKACJI] w nagłówku i treści pisma
```

---

## PRE-W2.A — IDENTYFIKACJA

Zidentyfikuj wszystkie podmioty, które pojawią się w nagłówku pisma:

```
□ SĄD / ORGAN (adresat) — ZAWSZE wymaga weryfikacji online
  → Źródło: W1.1 (nazwa sądu/wydziału) lub wskazanie użytkownika
  → Weryfikuj: pełna nazwa + adres + wydział właściwy dla tego typu sprawy
  → Nigdy nie przyjmuj adresu z pamięci

□ POZWANY (spółka) — ZAWSZE weryfikacja KRS/CEIDG
  → Weryfikuj: firma (nazwa rejestrowa), KRS, NIP, REGON, adres siedziby,
               aktualny skład zarządu, sposób reprezentacji
  → ⚠️ SZCZEGÓLNA UWAGA: gdy w aktach/umowach pojawiają się RÓŻNE NIP lub
    RÓŻNE KRS przy tej samej nazwie handlowej — BLOKUJ W2 do wyjaśnienia.
    Zweryfikuj każdy numer KRS i NIP oddzielnie — to mogą być odrębne podmioty.

□ POWÓD (osoba fizyczna) — weryfikacja danych z akt, nie z rejestru
  → Sprawdź z dokumentów użytkownika: imię, nazwisko, adres zamieszkania
  → NIE wyszukuj online (RODO)

□ DODATKOWE PODMIOTY (interwenient, uczestnik) — analogicznie jak pozwany
```

---

## PRE-W2.B — WERYFIKACJA SĄDU/ORGANU (ZAWSZE)

```
⛔ ZAKAZ UŻYCIA ADRESU SĄDU/ORGANU Z PAMIĘCI MODELU.
   Adresy sądów zmieniają się (reorganizacje, przeprowadzki, podziały).
   Model może mieć nieaktualne dane. Jedyne dopuszczalne źródło: strona BIP
   danego sądu lub oficjalny wykaz MS.

PROCEDURA:
1. Wywołaj: web_search "[pełna nazwa sądu] [wydział] adres"
   Przykład: web_search "Sad Rejonowy Katowice-Zachod VII Wydzial Pracy adres"
2. Weryfikuj wynik pod kątem:
   a) PEŁNA NAZWA sądu (Sąd Rejonowy Katowice-Zachód, nie Katowice-Wschód)
   b) WŁAŚCIWY WYDZIAŁ dla tego typu sprawy (Pracy i Ubezpieczeń Społecznych,
      nie Cywilny, Karny itp.)
   c) ADRES wydziału (uwaga: jeden sąd może mieć kilka budynków, różne wydziały
      mogą mieć różne adresy)
   d) KOD POCZTOWY + MIEJSCOWOŚĆ
3. Zapisz wynik jako VER-SAD z URL + data

PRZYKŁADY PUŁAPEK (zidentyfikowane historycznie):
  - SR Katowice-Zachód (ul. Warszawska 45) vs SR Katowice-Wschód (ul. Lompy 14)
    → dwie różne jednostki, mylone przez model
  - SR Katowice-Zachód: VII Wydział Pracy = ul. Warszawska 45
    ale inne wydziały = pl. Wolności 10 → ten sam sąd, różne adresy per wydział
```

---

## PRE-W2.C — WERYFIKACJA POZWANEGO

```
⛔ ZASADA FUNDAMENTALNA (ROOT CAUSE sesji 2026-06-26):
DANE Z AKT, UMÓW, PROTOKOŁÓW, SUDOP = NIEZWERYFIKOWANE.
Nawet gdy KRS/NIP pozwanego jest wpisany w umowie — to jest deklaracja strony, nie
weryfikacja rejestru. Model MUSI wywołać web_search/web_fetch niezależnie od tego
co widzi w aktach. "Umowa mówi KRS X" ≠ "KRS X = ten podmiot". Błąd pracodawcy
w umowie (zły KRS) = klasyczna pułapka (VII P 94/25: KRS 0000796445 w umowie HPG,
ale HPG ma KRS 0001025052).

Gdy pozwany to spółka prawa handlowego:

1. web_search "[nazwa spółki] KRS NIP REGON rejestr"
   lub web_fetch "https://ekrs.ms.gov.pl/rdf/pd/search_df?krs=[numer]"
2. Potwierdzić i zapisać:
   - FIRMA (nazwa rejestrowa zgodna z KRS — nie handlowa)
   - KRS (numer)
   - NIP
   - REGON
   - ADRES SIEDZIBY (aktualny, z rejestru — nie z umowy)
   - ZARZĄD / REPREZENTACJA (aktualna)
3. Sprawdź status: aktywna / w likwidacji / wykreślona

⚠️ SZCZEGÓLNA REGUŁA: ROZBIEŻNOŚĆ NUMERÓW W AKTACH
Gdy w aktach sprawy widnieją RÓŻNE NIP lub RÓŻNE KRS przy zbliżonej nazwie:
  → STOP. Nie buduj żadnego argumentu prawnego opartego na tożsamości podmiotów
    bez uprzedniej weryfikacji każdego numeru z rejestru.
  → Weryfikuj KAŻDY numer osobno: do której spółki należy KRS X? do której Y?
  → Dopiero po weryfikacji — buduj argument procesowy na faktach rejestrowych.
  
PRZYKŁAD z VII P 94/25:
  Umowy 1-2: "Human Park sp. z o.o." KRS 0000796445
  Umowy 3-5: "Human Park Global sp. z o.o." KRS 0000796445
  → Weryfikacja: KRS 0000796445 = Human Park sp. z o.o. (NIP 8971869561)
  → Weryfikacja: Human Park Global sp. z o.o. ma KRS 0001025052 (NIP 6343021499)
  → Wniosek procesowy: umowy 3-5 zawierają BŁĘDNY KRS pracodawcy
  → To jest argument na korzyść powoda, nie na korzyść pozwanej
```

---

## PRE-W2.D — WERYFIKACJA NUMERÓW REJESTROWYCH Z AKT

```
⛔ [POV-D-TRIGGER] — AUTOMATYCZNY:
Gdy widzisz ≥2 różne numery KRS lub NIP przy zbliżonej nazwie podmiotu w aktach
→ NATYCHMIAST uruchom ten krok. Nie czekaj na jawną sprzeczność.
Sama różnorodność numerów = trigger PRE-W2.D.
Przykład: "Human Park sp. z o.o. KRS 796445" w umowie 1 i "Human Park Global KRS 796445"
w umowie 3 → trigger (ta sama liczba przy innej nazwie = anomalia wymagająca weryfikacji).

Gdy w materiale dowodowym pojawiają się numery KRS, NIP, REGON:

1. Zidentyfikuj WSZYSTKIE numery rejestrowe widoczne w aktach/dokumentach
2. Dla każdego numeru: web_search "[numer KRS/NIP]" → ustal podmiot
3. Sprawdź spójność:
   - Czy numer KRS odpowiada nazwie w dokumencie?
   - Czy NIP jest zgodny z KRS?
   - Jeśli TAK → ✅ dane spójne
   - Jeśli NIE → ⚠️ ROZBIEŻNOŚĆ — zapisz jako fakt procesowy, nie jako błąd analizy

PRZYKŁAD z VII P 94/25:
  Dokument: "Human Park Global sp. z o.o. KRS 0000796445"
  Weryfikacja: KRS 0000796445 → Human Park sp. z o.o. (inna spółka)
  Wniosek: ROZBIEŻNOŚĆ = błąd pracodawcy w dokumencie
  Efekt procesowy: w piśmie buduj argument "błąd pracodawcy nie może szkodzić
                   pracownikowi" — NIE argument "ten sam podmiot, ten sam KRS"
```

---

## PRE-W2.E — RAPORT PRE-W2 (widoczny w odpowiedzi)

Po zakończeniu weryfikacji, przed rozpoczęciem W2, wyświetl raport:

```
═══════════════════════════════════════════════════════════
PRE-W2 VERIFICATION GATE — RAPORT WERYFIKACJI
Pismo: [typ] | Sprawa: [sygn.] | Data: [data]
═══════════════════════════════════════════════════════════

VER-SAD: [nazwa sądu/organu]
  Adres: [zweryfikowany adres]
  Wydział: [właściwy wydział]
  Źródło: [URL + data] ✅ / ⚠️ NIEWERYFIKOWANE

VER-POZ: [nazwa pozwanego]
  KRS: [numer] | NIP: [numer] | Adres: [adres z KRS]
  Status: [aktywna/w likwidacji/brak wpisu]
  Źródło: [URL + data] ✅ / ⚠️ NIEWERYFIKOWANE
  Rozbieżności z aktami: [opis lub BRAK]

VER-REJ: Numery rejestrowe z akt
  [numer KRS/NIP] → [podmiot] ✅ / ⚠️ ROZBIEŻNOŚĆ: [opis]

═══════════════════════════════════════════════════════════
WYNIK PRE-W2:
  ✅ GATE-OK     — wszystkie dane zweryfikowane; przejdź do W2.1
  ⚠️ GATE-WARN   — dane częściowo zweryfikowane; W2 z adnotacjami
  ⛔ GATE-STOP   — krytyczna rozbieżność lub brak weryfikacji;
                   STOP; pytanie do użytkownika poniżej
═══════════════════════════════════════════════════════════
```

---

## PRE-W2.F — BRAMKA DECYZYJNA

```
GATE-OK / GATE-WARN → kontynuuj do W2.1
  → Do W2 wstawiaj WYŁĄCZNIE dane z raportu PRE-W2
  → Dane nieweryfikowane z pamięci = ZAKAZ użycia bez oznaczenia ⬛ [NIEWERYFIKOWANE]

GATE-STOP → STOP; wyświetl pytanie użytkownikowi:
  "PRE-W2 GATE: Wykryto rozbieżność w danych podmiotowych:
  [opis rozbieżności]
  Proszę potwierdzić dane przed redakcją pisma."
  → Czekaj na odpowiedź → po niej: aktualizuj PRE-W2 raport → W2.1
```

---

## INTEGRACJA Z PIPELINE pisma-procesowe-v3

```
POPRZEDNIA SEKWENCJA (błędna):
  W1 → [checkpoint] → W2 (z danymi z pamięci) → W3.0 PODMIOT-GATE (za późno)

NOWA SEKWENCJA (po naprawie):
  W1 → [checkpoint] → PRE-W2-GATE (weryfikacja online PRZED redakcją)
       → GATE-OK → W2.1 (z danymi zweryfikowanymi)
       → W2.2 → W2.3 → W2.4 MOD-ATAK-NA-DRAFT
       → W3.0 PODMIOT-GATE (drugi poziom kontroli — nadal aktywny)
       → W3.1... → .docx

WYWOŁANIE w SKILL.md pisma-procesowe-v3:
  Po checkpoincie W1→W2, przed W2.1:
  view /mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md
  Wykonaj PRE-W2.A → PRE-W2.B → PRE-W2.C → PRE-W2.D → PRE-W2.E → PRE-W2.F
  ⛔ ZAKAZ przejścia do W2.1 bez zamkniętego GATE (GATE-OK lub GATE-WARN)
```

---

## ZASADA PRIORYTETU DANYCH

```
HIERARCHIA DANYCH DO W2 (od najwyższego priorytetu):
  1. web_search/web_fetch z oficjalnego rejestru (KRS, BIP sądu) — DATA: [dzisiaj]
  2. Dokumenty dostarczone przez użytkownika (umowy, protokoły) — z oznaczeniem
     czy są spójne z rejestrem (po PRE-W2.D)
  3. Pamięć modelu — NIGDY nie używaj samodzielnie; tylko jako wskazówka do szukania

ZAKAZ BEZWZGLĘDNY:
  ⛔ Nie wstawiaj adresu sądu/organu z pamięci modelu do nagłówka pisma
  ⛔ Nie wstawiaj KRS/NIP pozwanego z pamięci modelu bez potwierdzenia w rejestrze
  ⛔ Nie buduj argumentu prawnego opartego na tożsamości/odmienności podmiotów
     bez uprzedniej weryfikacji każdego numeru rejestrowego z rejestru
```

---

## HISTORIA ZMIAN

```
1.2.0 (2026-06-26) — Nowy krok PRE-W2.0: STATUS-LIFECYCLE podmiotów:
  Dodano mechanizm obowiązkowego oznaczania podmiotów statusem ⬛ [DO WERYFIKACJI]
  od chwili napotkania w materiałach dowodowych aż do faktycznej weryfikacji online.
  Nowe: STATUS-LIFECYCLE (⬛→✅/⚠️/⛔), WYJĄTKI (osoby prywatne), KONSEKWENCJE,
  PODMIOTY WYMAGAJĄCE OZNACZENIA, PRZEPŁYW W SESJI (1-5 kroków).
  Wyjątki: imię/nazwisko/adres/PESEL osoby fizycznej — NIE oznaczaj statusem ⬛.
  Wpływ na router: KROK 0D, SELF-CHECK blok STATUS PODMIOTÓW, R0D w STEP-TRACKER.
  Wpływ na pisma-procesowe: SELF-CHECK-PISMA — blok STATUS PODMIOTÓW.

1.1.0 (2026-06-26) — Naprawa root cause sesji VII P 94/25 (2026-06-26):
  Problem: model traktował dane KRS/NIP z akt sprawy (umów) jako zweryfikowane.
  Skutek: w piśmie wpisano KRS 0000796445 przy Human Park Global sp. z o.o.,
          podczas gdy HPG ma KRS 0001025052 — błąd z umów pracodawcy skopiowany
          do pisma procesowego powoda.
  Naprawy:
  (1) PRE-W2.C: dodano explicite zasadę "dane z akt ≠ zweryfikowane"
      z przykładem błędu i wyjaśnieniem mechanizmu pułapki
  (2) PRE-W2.D: dodano [POV-D-TRIGGER] — automatyczne uruchomienie przy ≥2
      różnych numerach KRS/NIP dla zbliżonej nazwy; nie wymaga jawnej sprzeczności
  Wpływ na router: SKILL.md prawny-router-v3 — SELF-CHECK blok POV-B/C/D
                   i reguła nadrzędna 18 zaktualizowane.

1.0.0 (2026-06-21) — Pierwsza wersja.
  Przyczyna: błędy krytyczne w piśmie procesowym VII P 94/25:
  (1) Adres sądu z pamięci modelu (ul. Lompy 14 / SR Katowice-Wschód zamiast
      ul. Warszawska 45 / SR Katowice-Zachód VII Wydział Pracy).
  (2) Argument prawny "ten sam KRS" zbudowany bez sprawdzenia rejestru;
      KRS 0000796445 należy do HP sp. z o.o., nie do HP Global sp. z o.o.
      (KRS 0001025052) — co było widoczne z NIP-ów w aktach.
  Naprawa: przeniesienie weryfikacji podmiotów PRZED generowanie W2,
  jako oddzielny moduł z twardą bramką blokującą.
  Wpływ na SKILL.md: dodano wywołanie PRE-W2-GATE po checkpoincie W1→W2.
```
