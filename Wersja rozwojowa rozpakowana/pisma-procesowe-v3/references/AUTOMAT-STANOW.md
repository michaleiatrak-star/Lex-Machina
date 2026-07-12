# AUTOMAT-STANOW — Hard Gate Zero i sekwencja checkpointów

> Wydzielono z pisma-procesowe-v3/SKILL.md (v5.2) — WARN-14 refaktoryzacja
> Wywołanie: `view /mnt/skills/user/pisma-procesowe-v3/references/AUTOMAT-STANOW.md`
> Zawiera: PROTOKÓŁ CHECKPOINT, AUTOMAT STANÓW (STAN 0–3), ZAKAZY 1–13,
>   REGUŁA NAPRAWY, REGUŁA KONTYNUACJA, REGUŁA AUTODIAGNOZY

---

## ⛔⛔⛔ HARD GATE ZERO — BEZWZGLĘDNY AUTOMAT STANÓW ⛔⛔⛔

> To jest pierwsza instrukcja. Wykonaj ją zanim przeczytasz cokolwiek innego.

---

### ⛔⛔⛔ PROTOKÓŁ CHECKPOINT — OBOWIĄZUJE PRZEZ CAŁĄ ROZMOWĘ ⛔⛔⛔

```
DEFINICJA CHECKPOINT:
  Po każdym kroku oznaczonym [CP] model MUSI:
  1. Wyświetlić raport CP (format poniżej)
  2. ZAKOŃCZYĆ ODPOWIEDŹ
  3. NIE kontynuować do następnego kroku bez wiadomości użytkownika

FORMAT RAPORTU CP (obowiązkowy — każdy CP musi go wyświetlić):
  ┌─────────────────────────────────────────────────────────┐
  │ ✅ CHECKPOINT [nazwa] — ZAKOŃCZONY                       │
  │ Wykonane: [lista kroków]                                │
  │ Wyniki: [kluczowe ustalenia]                            │
  │ Problemy: [lista ⚠️ lub BRAK]                           │
  │                                                         │
  │ REJESTR CP (stan po tym checkpoint):                    │
  │   ✅ zamknięte: [lista z nazwami]                       │
  │   ○  otwarte:  [lista z nazwami]                        │
  │                                                         │
  │ STATUS DOKUMENTU: ⚠️ DRAFT — NIE SKŁADAĆ DO SĄDU       │
  │  (zmieni się na FINAL dopiero po CP-PEER = PEER-OK)    │
  │                                                         │
  │ ➡️ Kontynuować do [następny krok]?                      │
  │    Odpowiedz: "tak" / "ok" / lub uwagi                  │
  └─────────────────────────────────────────────────────────┘

  ⛔ Po ostatnim CP (CP-PEER = PEER-OK) wyświetl zamiast powyższego:
  ┌─────────────────────────────────────────────────────────┐
  │ ✅ CHECKPOINT CP-PEER — PEER-OK — WSZYSTKIE CP ZAMKNIĘTE │
  │                                                         │
  │ REJESTR CP: WSZYSTKIE ✅ ZAMKNIĘTE                      │
  │                                                         │
  │ STATUS DOKUMENTU: ✅ FINAL — GOTOWE DO ZŁOŻENIA         │
  │                                                         │
  │ ➡️ Generuję wersję FINAL .docx (bez watermarku DRAFT)  │
  └─────────────────────────────────────────────────────────┘

⛔ ZAKAZ-CP: model NIE może przejść do następnego etapu
   bez wiadomości użytkownika po każdym [CP].
   Nawet gdy użytkownik napisał "rób wszystko automatycznie" —
   ZAKAZ-CP jest nadrzędny. Checkpointy zapewniają kontrolę jakości.

WYJĄTEK: gdy użytkownik w tej samej wiadomości co trigger pisma napisał
   "bez checkpointów" lub "automatycznie bez zatwierdzeń" —
   wtedy zastosuj TRYB-AUTO (patrz sekcja TRYB-AUTO poniżej).
   Domyślnie: TRYB CHECKPOINT aktywny.

TRYB-AUTO (tylko gdy explicite zlecony):
   Wykonuj wszystkie kroki sekwencyjnie, ale wyświetl RAPORT KOŃCOWY
   z wynikami wszystkich CP przed generowaniem .docx.
   Wyniki każdego CP wbuduj inline w odpowiedź (nie przerywaj).
```

---

**AUTOMAT STANÓW — jedyna dozwolona sekwencja:**

```
⛔⛔⛔ ZAKAZ ABSOLUTNY — PRZECZYTAJ PRZED WYKONANIEM CZEGOKOLWIEK ⛔⛔⛔
.docx NIE MOŻE POWSTAĆ przed zamknięciem WSZYSTKICH checkpointów.
Sekwencja: STAN 1 (W1) → STAN 1.5 (PRE-W2) → STAN 2 (W2 + CP-ATAK) → STAN 3 (W3) → .docx
Każdy STAN kończy się [CP] + wiadomość użytkownika. BEZ WYJĄTKU.
Jeśli generujesz .docx w tej chwili — zatrzymaj się i sprawdź czy CP-PEER = PEER-OK.
⛔⛔⛔ KONIEC BLOKU ZAKAZU ⛔⛔⛔

STAN 0: Routing (Test A → Test B → Test C)
  ⛔ KROK 0-GATE (ABSOLUTNIE PIERWSZY — przed routing):
     view /mnt/skills/user/shared/CP-GATE.md
     → zainicjalizuj CP-REJESTR (wszystkie CP = ○ OTWARTE)
     → ustaw STATUS = ⚠️ DRAFT — NIE SKŁADAĆ
     → zapamiętaj: każdy wygenerowany .docx przed CP-PEER=PEER-OK
       MUSI być oznaczony DRAFT (nagłówek + nazwa _DRAFT + komunikat §5)
     → dopiero po tym wykonaj routing (Test A → Test B → Test C)

  ⛔ KROK 0-TRACKER (PO CP-GATE, PRZED ROUTING):
     view /mnt/skills/user/shared/MOD-STEP-TRACKER.md
     → ST-INIT: zainicjalizuj REJESTR KROKÓW (wszystkie etapy = ○ OCZEKUJE)
     → ZASADA PERMANENTNA: każde pominięcie kroku = natychmiastowy
       raport pominięć (FAZA 2) + pytanie a/b + czekanie na decyzję.
       Zakaz cichego pomijania kroków przez całą sesję.
     → ST-FINAL obowiązkowy przed każdym present_files pisma.

STAN 1: W1 — Rama i strategia
  → W1.1 Typ i tryb
  → W1.2 Teza centralna (wstępna)
  → W1.2a CLAIM-VALIDATION [CP-1a]
      view /mnt/skills/user/shared/CLAIM-VALIDATION.md
      ⛔ STOP [CP-1a] po zakończeniu → raport → czekaj na użytkownika

  → W1.2b MOD-STRATEGIA-WYBOR ⛔ (gdy ≥2 ścieżki LUB anomalia podmiotowa) [CP-1b]
      view /mnt/skills/user/shared/MOD-STRATEGIA-WYBOR.md
      S1 (ścieżki) → S2 (ocena ataków) → S3 (ranking+rekomendacja) →
      S4 (struktura) → S5 (RAPORT użytkownikowi)
      ⛔ Ścieżka z atakiem 🔴 bez kontrargumentu = PORZUĆ lub EWENTUALNA
      ⛔ STOP [CP-1b] → raport S5 → czekaj na zatwierdzenie użytkownika
      Po zatwierdzeniu: zaktualizuj W1.2 jeśli zmienił się wybór

  → W1.2c SKAN KOMPLETNOŚCI + PORCJOWANIE + MACIERZ ⛔ (gdy ≥2 dowody)

      KROK W1.2c-PRE (ABSOLUTNIE PIERWSZY — przed wszystkim): [CP-1c-skan]
        ⛔ HARD GATE — wykonaj PRZED PD0 i PRZED macierzą
        view /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md
        → SD-GATE-0: czy plik faktycznie wgrany gdy wzmianka o załącznikach?
          NIE → ⛔ BLOKADA W1.3 i W2 — zażądaj plików, nie kontynuuj
        → SD-INW: zinwentaryzuj WSZYSTKIE pliki (ZIP → zawartość, nie kontener)
        → SD-READ: odczytaj KAŻDĄ STRONĘ (PDF per str., XLSX per zakładkę,
          ODT z obrazami: każdy obraz, protokół sądowy: każde zdanie)
        → SD-VER: kompletność potwierdzona → wygeneruj SD-REJ ✅
        → SD-GATE-4: jeśli SD-VER ≠ KOMPLET → BLOKADA W2, wróć do SD-READ
        ⛔ Pominięcie strony/zakładki/obrazu ODT = BŁĄD KRYTYCZNY
        ⛔ Szczególnie: protokoły sądowe → KAŻDE zdanie zeznań → SD-FAKTY
        ⛔ STOP [CP-1c-skan] → raport SD-VER pełny → czekaj na użytkownika

      KROK W1.2c-PD0 (PO SD-VER KOMPLET — zawsze):
        view /mnt/skills/user/shared/MOD-PORCJOWANIE-DOWODOW.md → PD0 (skan wstępny).
        STATUS BEZPIECZNY → kontynuuj do FSL-D.
        STATUS ≥ OSTRZEŻENIE → PD1 → PD2 (plan partii) → ⛔ STOP [CP-PD].
          Po P1: macierz częściowa (Di z P1 × Tj) → PD4 (checkpoint) → ⛔ STOP [CP-PD].
          Po Pn: macierz pełna → PD6 (synteza) → zasilenie W1.3.
        STATUS KRYTYCZNE → ⛔ HARD GATE → nie uruchamiaj macierzy bez planu.

      ⛔ KROK W1.2c-FSL-D (PO PD0 — ZAWSZE gdy SD-VER=KOMPLET i ≥1 teza): [CP-FSL-D]
        ⛔ HARD GATE — wykonaj PRZED MACIERZĄ i PRZED budową tez.
        ⛔ ZAKAZ-FSL-D: nie przystępuj do KROK MACIERZ bez FSL-D-REPORT.
        view /mnt/skills/user/shared/MOD-FSL-DOKUMENTY.md
        → FSL-D-INIT: pobierz listę tez z CLAIM-VALIDATION + SD-REJ z SD-VER
        → FSL-D-SCAN: per KAŻDA teza T-X → rozbij na twierdzenia atomowe TC[x,k]
                     → per KAŻDE TC: przeszukaj KAŻDY D[id] z SD-REJ (niezależnie od nazwy!)
                     → klasyfikuj: ✅ D[id]+lokalizacja / ⚠️ pośrednie / ⬛ brak
        ⛔ REGUŁA-NAZWA-PLIKU-MYLĄCA: zakaz wnioskowania o zawartości pliku z nazwy.
           XLSX o nazwie "Pracownicy" może zawierać dowód na tożsamość pracodawcy.
           ODT o nazwie "Szef" może zawierać korespondencję gotowości do pracy.
        → FSL-D-ORPHAN: pliki D[id] z 0 przypisaniami = sprawdź czy nowa teza
        → FSL-D-REPORT: macierz T×TC z klasyfikacją + zestawienie luk per klasa
        Rozgałęzienie po FSL-D-REPORT:
          ⬛ 🔴 = ⛔ STOP → pytania do użytkownika (a/b/c/d) → czekaj
          ⬛ 🟠 = kontynuuj z żądaniem ewentualnym w petitum
          ⬛ 🟡 = notacja w RAPORCIE D (W2.4), kontynuuj
        ⛔ STOP [CP-FSL-D] → wyświetl FSL-D-REPORT → czekaj na zatwierdzenie
        Po zatwierdzeniu: FSL-D-MACIERZ (nie SD-FAKTY bezpośrednio!) → W1.2c-MACIERZ

      KROK W1.2c-MACIERZ (gdy STATUS BEZPIECZNY lub po zatwierdzeniu planu P1): [CP-1c-macierz]
        view /mnt/skills/user/shared/MOD-MACIERZ-DOWOD-TEZA.md
        MT1 (inwentaryzacja tez+dowodów z bieżącej partii) →
        MT2 (skan dwukierunkowy) → MT3 (klasyfikacja K/R/W/RK) →
        MT4 (RAPORT macierzy D×T)
        ⛔ STOP [CP-1c-macierz] → wyświetl macierz → czekaj na zatwierdzenie
        Po zatwierdzeniu: MT5 → zasilenie W1.3

      KROK W1.2c-LANCUCH (PO MACIERZY — gdy ≥1 teza główna): [CP-1c-lancuch]
        view /mnt/skills/user/shared/MOD-LANCUCH-DOWODOWY.md
        Per każda teza główna T-X:
          ŁD-1 Przesłanki prawne (z MT1 macierzy)
          ŁD-2 Dobór ogniw: BASE (kl.A/B) + POŚR (kl.C/D) + WZM + NEG
          ŁD-3 ⛔ BRAMKA EQG — eliminacja ogniw szkodliwych:
            EQG-1 ZAKAZ DOWODOWY (AD-5) → ❌ WYKLUCZ bezwzględnie
            EQG-2 SAMOOSKARŻENIE (ryzyko krzyżowe MOD-SELEKCJA §3.2) → ❌/⚠️/✅
            EQG-3 ŁATWE DO PODWAŻENIA (≥2 wektory AD-X ≥6/10) → ❌/🛡/✅
            EQG-4 RYZYKO UJAWNIENIA (MOD-SELEKCJA §3.3) → ⏳/✅
          ŁD-3b ⛔ SW-DETECT — ogniwa zeznaniowe (klasa D = zeznanie świadka):
            Czy ≥1 ogniwo = zeznanie świadka?
            TAK → oznacz: ŁD-n ogniwo [W-id] typ: ZEZNANIE
                  → MOD-ATAK-NA-SWIADKA aktywny dla W2.4c
                  → SW-P1..P5 (profil + sprzeczności) wykonaj teraz
                  → wynik: podatność ŁO na SW-A1..SW-A8
            NIE → kontynuuj normalnie
          ŁD-4 Typ łańcucha: Ł-SEK/Ł-RÓW/Ł-DOM/Ł-NEG/Ł-CIĄ
          ŁD-5 Scoring ★→★★★★★
          ŁD-6 Antycypacja ataku ŁA-1..ŁA-4 → lista do D7
        ⛔ EQG-1=WYKLUCZ → usuń z łańcucha bez wyjątku
        ⛔ Scoring ★ bez alternatywy → STOP — zażądaj uzupełnienia lub porzuć tezę
        ⛔ STOP [CP-1c-lancuch] → wyświetl scoring ★ per teza + EQG → czekaj
        Po zatwierdzeniu: lista łańcuchów ŁD-n → zasilenie W1.3 + D7 antycypacje

  → W1.2d-PRE MOD-DOKUMENT-ANOMALIE ⛔ (gdy ≥2 dokumenty strony przeciwnej lub pracodawcy) [CP-1d-anomalie]
      view /mnt/skills/user/shared/MOD-DOKUMENT-ANOMALIE_v1.1.0.md
      DA-0 (inwentaryzacja pól identyfikacyjnych: KRS/NIP/REGON/PESEL/adres per dokument) →
      DA-1 (cross-check wewnętrzny: czy KRS = NIP w każdym dokumencie?) →
      DA-2 (cross-check z rejestrem online: web_search per każdy KRS/NIP) →
      DA-3 (klasyfikacja: Klasa I = błąd pracodawcy / II = rozbieżność adresy / III = podejrzenie) →
      DA-4 (DA-REJ: tabela anomalii z efektem procesowym per anomalia) →
      DA-5 (zasilenie W1.3: Klasa I → argument "błąd pracodawcy nie szkodzi pracownikowi")
      ⛔ STOP [CP-1d-anomalie] → wyświetl DA-REJ → czekaj na zatwierdzenie
      ⛔ ZAKAZ: nie formułuj argumentu o tożsamości podmiotów bez DA-2 (online)
      ⛔ ZAKAZ: nie używaj "ten sam KRS = ten sam podmiot" — zawsze sprawdź DA-2
      Trigger: umowy pracodawcy / dokumenty XLSX / pisma strony przeciwnej
      Wynik DA-REJ → wbuduj do uzasadnienia W2 jako sekcja "Anomalie dokumentacyjne"

  → W1.2d MOD-POSZLAKI-KONTEKST ⛔ (gdy ≥1 dokument w materiale) [CP-1d]
      view /mnt/skills/user/shared/MOD-POSZLAKI-KONTEKST.md
      PK0 (trzy warstwy każdego dokumentu — ZAWSZE) →
      PK1 (typy P1–P10: elementy pozornie nieistotne — aktywnie szukaj) →
      PK2 (budowa łańcuchów poszlak L-X z ≥3 ogniw) →
      PK3 (tabela graniczna względem daty spornej — gdy sprawa ma datę sporną) →
      PK4 (walory wielofunkcyjne: klasa W z macierzy; flagi PRZYZNANIE/ORGAN) →
      PK5 (antycypacja systemowa — ZAWSZE dla każdej tezy, nie tylko pracownicze) →
      PK6 (roszczenie alternatywne S2 — po CV-ALT z CLAIM-VALIDATION)
      PK7 REJESTR [A]–[E] → zasilenie W1.3
      ⛔ STOP [CP-1d] → wyświetl rejestr PK7 → czekaj na zatwierdzenie użytkownika
      ⛔ ZAKAZ-1D: nie przechodzij do W1.3 bez zamkniętego PK7 gdy ≥1 dokument

  → W1.3 Mapa przepisów + tezy (lista robocza ⚠️ nieweryfikowane)
  → W1.6 RED-TEAM (gdy aktywny — sprawa złożona / ≥3 żądania / WPS>50k)
      view /mnt/skills/user/shared/MOD-RED-TEAM-WLASNY.md
  → W1 RAPORT KOŃCOWY (typ pisma, teza centralna, ścieżka strategiczna,
      lista przepisów roboczych, lista dowodów z funkcją, słabości wykryte)
  ⛔ STOP [CP-W1] → wyświetl raport W1 → czekaj na zatwierdzenie użytkownika
  ⛔ ZAKAZ: nie przechodzij do STAN 1.5 bez wiadomości "ok"/"kontynuuj"/uwag

STAN 1.5: PRE-W2-VERIFICATION-GATE ⛔ BLOKUJE W2 [CP-PRE-W2]
  view /mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md
  PRE-W2.A → PRE-W2.B (sąd online — web_search/web_fetch) →
  PRE-W2.C (pozwany KRS — ekrs.ms.gov.pl) →
  PRE-W2.D (cross-check numerów rejestrowych z akt) →
  PRE-W2.E RAPORT PRE-W2
  ⛔ STOP [CP-PRE-W2] → wyświetl raport PRE-W2 → czekaj na użytkownika
  GATE-OK/WARN: po zatwierdzeniu → W2.1
  GATE-STOP: czekaj na wyjaśnienie → aktualizuj raport → ponów → W2.1

STAN 2: W2 — Projekt pisma
  → W2.1 Moduły (WYŁĄCZNIE dane z raportu PRE-W2 dla podmiotów i adresów)
  → W2.2 Redakcja + MOD-INTRO (obowiązkowy: pozew/apelacja/>3str) +
          MOD-TIMING (gdy timing istotny) + MOD-DOKTRYNA (gdy doktryna w uzasadnieniu)
  → W2.3 Lista placeholderów ⚠️[WERYFIKACJA W3]
  → ⛔ W2.4 MOD-ATAK-NA-DRAFT (OBLIGATORYJNY — ZAWSZE, BEZ WYJĄTKU) [CP-ATAK]
      view /mnt/skills/user/shared/MOD-ATAK-NA-DRAFT.md
      D1 (słabości własne) → D2 (ataki przeciwnika) → D3 (luki dowodowe) →
      D5 (ryzyka RP/RD/RPC) → D4 (rekomendacje)
      ── ROZSZERZENIE W2.4a: ATAK NA DOWODY PRZECIWNIKA (gdy znany materiał) ──
        view /mnt/skills/user/shared/MOD-ATAK-NA-DOWOD.md
        ADIS-1 (inwentaryzacja dowodów przeciwnika) →
        ADIS-2 (screening AD-1..AD-12 per dowód) →
        ADIS-3 (priorytety 🔴/🟠/🟡/🟢) →
        ADIS-4 (instrument procesowy per 🔴/🟠) →
        ADIS-5 → sekcja "ZARZUTY CO DO MATERIAŁU DOWODOWEGO" w piśmie
      ── ROZSZERZENIE W2.4b: ATAK NA ŁAŃCUCH DOWODOWY (gdy znany łańcuch) ──
        view /mnt/skills/user/shared/MOD-LANCUCH-DOWODOWY.md §CZĘŚĆ II
        ŁA-1 (najsłabsze ogniwo) + ŁA-2 (kontrdowód) +
        ŁA-3 (logika) + ŁA-4 (proweniencja) →
        sekcja "ZARZUTY CO DO ŁAŃCUCHA DOWODOWEGO" w piśmie
      ── ROZSZERZENIE W2.4c: ATAK NA ŚWIADKA JAKO OGNIWO ⛔ (gdy ≥1 ogniwo = zeznanie) ──
        view /mnt/skills/user/shared/MOD-ATAK-NA-SWIADKA.md
        SW-DETECT: identyfikuj ogniwa zeznaniowe w łańcuchach ŁD-n
        SW-P1..P5: profil świadka + sprzeczności wewnętrzne + sprzeczności z D[id]
        SW-ATAK: ≤3 wektory priorytetowe (🔴 SW-A2 zaprzeczenie / SW-A5 niespójność /
          SW-A8 brak wiedzy; 🟠 SW-A1 konflikt / SW-A3 relacja wtórna)
        SW-TARCZKA: antycypacja ataku na NASZEGO świadka — wbuduj do W2
        SW-WNIOSKI: konfrontacja (art. 272) / wezwanie świadka (art. 258) /
          dokumenty (art. 248) — weryfikuj ISAP przed użyciem
        ⛔ STOP po W2.4c → raporty D + SW-PRIOR łącznie → czekaj na użytkownika
        Zakres ataku: obejmuje ZARÓWNO świadków przeciwnika (atak)
          JAK I naszych świadków (antycypacja + szczepienie)
      ⛔ STOP [CP-ATAK] → wyświetl RAPORT D + RAPORT SW → czekaj na użytkownika
      ATAK-OK/UWAGI: po zatwierdzeniu → W3
      ATAK-STOP: czekaj na wyjaśnienie → popraw projekt → ponów D4 → W3

STAN 3: W3 — Weryfikacja + walidacja
  ⛔ PODMIOT-GATE (W3.0) — ZAWSZE PIERWSZY [CP-PODMIOT]
      zweryfikuj KAŻDY ⚠️POD (strona + sąd/organ) online
      ⛔ STOP [CP-PODMIOT] → raport statusów ✅/⚠️/⛔ per podmiot → czekaj
      → dopiero po zamknięciu: W3.1

  → W3.1 ISAP — web_fetch/web_search KAŻDEGO ⚠️[artykuł] z W2
      ⛔ ZAKAZ: żaden artykuł bez własnego wywołania web_fetch w tej odpowiedzi
  → W3.2 Orzecznictwo — orzeczenia-sadowe-v2 dla KAŻDEGO [ORZECZENIE: opis]
      ⛔ ZAKAZ: żadna sygnatura bez weryfikacji online — nawet "oczywiste"
  → W3.3 Fakty — FAKTY_v2.md (F0-F3: każdy fakt → źródło w aktach)
  → W3.4 Walidacja — MOD-WALIDACJA_v2 (bloki A–J)
      view /mnt/skills/user/shared/MOD-WALIDACJA_v2.md
      + FACT-SOURCE-LOCK + LEGAL-STATUS-LOCK (prereq. Bloku J)
      + MOD-KONCENTRACJA (limity objętości per typ pisma)
      + QUALITY-CHECK (redakcja + logika + executive summary)
  → W3.5 LEGAL-QUALITY-GATE [CP-QUALITY]
      view /mnt/skills/user/shared/LEGAL-QUALITY-GATE.md
      PASS → W3.6
      PASS-WITH-WARNING → W3.6 (zaznacz ostrzeżenia)
      FAIL → ⛔ BLOKADA .docx → wróć do W3.1/W3.2 → popraw
      ⛔ STOP [CP-QUALITY] → wyświetl wynik gate → czekaj
  → W3.6 Pismo finalne (wszystkie ⚠️ zamknięte, sygnatury z W3.2)
  → W3.6a AUDYT-KOŃCOWY [CP-AUDYT]
      COURT-SIMULATION → LEGAL-QUALITY-GATE → audyt punktowy 0-10
      ⛔ STOP [CP-AUDYT] → wyświetl wyniki → czekaj
      audyt ≥7/10 każda kategoria → W3.7
      audyt <7/10 → wskaż kategorie → popraw → ponów audyt
  → W3.7 PEER-REVIEW + POST-VALIDATION [CP-PEER]
      view /mnt/skills/user/shared/MOD-PEER-REVIEW.md (gdy WPS>50k / ≥3 żądania / apelacja)
      view /mnt/skills/user/shared/POST-VALIDATION.md (zawsze)
      FAZA 1: auto-raport braków
      FAZA 2: wstawienie danych / zamknięcie ⬛
      ⛔ STOP [CP-PEER] → wyświetl wyniki → czekaj
      PEER-STOP → ⛔ BLOKADA .docx → popraw → ponów
      PEER-OK → generuj .docx
```

**MAPA CHECKPOINTÓW — kompletna lista:**

```
[CP-1a]              CLAIM-VALIDATION — zawsze
[CP-1b]              MOD-STRATEGIA-WYBOR — gdy ≥2 ścieżki lub anomalia podmiotowa
[CP-1c-skan]         SD-VER (skan plików) — gdy wgrane pliki
[CP-PD]              PORCJOWANIE — gdy STATUS ≥ OSTRZEŻENIE
[CP-FSL-D]           FSL-D PER-TEZA weryfikacja dowodów — gdy SD-VER=KOMPLET i ≥1 teza
                     ⛔ N/A wyłącznie gdy warunek techniczny = NIE (patrz ZAKAZ-14)
[CP-1c-macierz]      MACIERZ D×T — gdy ≥2 dowody
                     ⛔ N/A wyłącznie gdy 0-1 pliki dostarczone (patrz ZAKAZ-14)
[CP-1c-lancuch]      ŁAŃCUCH DOWODOWY — gdy ≥1 teza główna
                     ⛔ N/A wyłącznie gdy brak tez do wykazania (patrz ZAKAZ-14)
[CP-1d-anomalie]     MOD-DOKUMENT-ANOMALIE — gdy ≥2 dokumenty strony przeciwnej/pracodawcy
[CP-1d]              MOD-POSZLAKI-KONTEKST — gdy ≥1 dokument (ZAWSZE)
[CP-W1]              RAPORT W1 KOŃCOWY — zawsze
[CP-PRE-W2]          PRE-W2-VERIFICATION-GATE — zawsze
[CP-ATAK]            MOD-ATAK-NA-DRAFT + W2.4a + W2.4b + W2.4c (świadek gdy aktywny) — zawsze
[CP-PODMIOT]         PODMIOT-GATE W3.0 — zawsze
[CP-QUALITY]         LEGAL-QUALITY-GATE — zawsze
[CP-AUDYT]           AUDYT-KOŃCOWY — zawsze
[CP-PEER]            PEER-REVIEW + POST-VALIDATION — zawsze

ŁĄCZNIE: 11 checkpointów obowiązkowych + 4 warunkowe + W2.4c (gdy ogniwa zeznaniowe)
⛔ Każdy = osobna wiadomość kończąca odpowiedź + oczekiwanie na użytkownika
⛔ Zmiana ZAKAZ-14: N/A wyłącznie per warunek techniczny — nigdy per typ pisma/ocenę złożoności
```

**ZAKAZY BEZWZGLĘDNE automatu — ŻADEN NIE MA WYJĄTKU:**

```
⛔ ZAKAZ-CP (NADRZĘDNY): Po każdym [CP] zakończ odpowiedź i czekaj.
            NIE ma wyjątku nawet gdy użytkownik napisał "rób wszystko".
            Checkpoint = fizyczna granica między etapami. Bez wiadomości
            użytkownika model nie ma podstawy do przejścia dalej.

⛔ ZAKAZ-1: NIE generuj projektu pisma (W2) bez ukończonego W1 i zatwierdzenia przez użytkownika.
⛔ ZAKAZ-1B: NIE generuj projektu pisma (W2) bez zamkniętego PRE-W2-VERIFICATION-GATE.
            GATE-OK lub GATE-WARN = wymagane; GATE-STOP = blokada W2 do odpowiedzi użytkownika.
⛔ ZAKAZ-1C: NIE przechodzij do W1.3 bez zamkniętej W1.2c (MOD-MACIERZ-DOWOD-TEZA)
            gdy użytkownik dostarczył ≥2 dowody. Macierz D×T musi być zatwierdzona.
            Pominięcie = pismo niewykorzystuje wielofunkcyjnych dowodów i ma luki.
⛔ ZAKAZ-1D: NIE przechodzij do W1.3 bez zamkniętego PK7 (MOD-POSZLAKI-KONTEKST)
            gdy w materiale jest ≥1 dokument. Warstwy 2/3 każdego dowodu muszą
            być wydobyte przed redakcją. Pominięcie = pismo operuje wyłącznie
            na Warstwie 1 — brak łańcuchów poszlak, brak antycypacji, brak S2.
            ⛔ Adres sądu/organu z pamięci modelu = ZAKAZ użycia w W2 bez weryfikacji PRE-W2.B.
            ⛔ KRS/NIP pozwanego z pamięci = ZAKAZ użycia w W2 bez weryfikacji PRE-W2.C.
            ⛔ Argument prawny oparty na tożsamości/odmienności podmiotów = ZAKAZ bez PRE-W2.D.
⛔ ZAKAZ-2: NIE wstawiaj żadnego numeru Dz.U. ani sygnatury orzeczenia w W2.
            Każdy przepis w W2 = ⚠️[art. X ustawa — WERYFIKACJA W3]
            Każde orzeczenie w W2 = [ORZECZENIE: opis → WERYFIKACJA W3]
⛔ ZAKAZ-3: NIE generuj pisma finalnego (.docx) bez ukończonego W3.
⛔ ZAKAZ-4: NIE łącz dwóch wiadomości w jednej odpowiedzi (np. W1+W2 w jednym kroku).
⛔ ZAKAZ-5: NIE cytuj przepisów ani orzeczeń z pamięci na żadnym etapie.
            Każdy artykuł KPK/KK/KPC/KC/KP/KPA — weryfikacja ISAP w W3.
⛔ ZAKAZ-6: NIE używaj orzeczenia gdy zakres stanów faktycznych nie obejmuje pisma
            (patrz KROK 3a ZAKRES-STOSOWANIA w W3.2).
⛔ ZAKAZ-7: NIE wpisuj danych rejestrowych podmiotów (NIP, KRS, REGON, adres siedziby,
            skład zarządu, forma prawna, sposób reprezentacji) z pamięci ani bez weryfikacji
            w KRS (ekrs.ms.gov.pl) lub CEIDG. Dane podane przez użytkownika = ⚠️POD
            do weryfikacji w W3.0. Wyjątek: osoba fizyczna nieprowadząca działalności.
⛔ ZAKAZ-8: NIE przechodzij do W3.1 (weryfikacja przepisów) bez uprzedniego wykonania
            W3.0 PODMIOT-GATE dla KAŻDEGO podmiotu ⚠️POD — zarówno stron jak i sądu/organu.
            Kolejność W3 jest bezwzględna: W3.0 → W3.1 → W3.2 → W3.3 → W3.4 → W3.5 → W3.6.
⛔ ZAKAZ-9: NIE przechodzij do W3 bez wyświetlonego RAPORTU D z W2.4 MOD-ATAK-NA-DRAFT.
            W2.4 jest OBLIGATORYJNY — brak pliku MOD-ATAK-NA-DRAFT.md nie zwalnia z kroku;
            jeśli view() zwróci błąd — zatrzymaj się i poinformuj użytkownika.
            Pominięcie W2.4 = błąd krytyczny; powróć do W2.4 i wykonaj retroaktywnie.
⛔ ZAKAZ-10: NIE generuj W2 (projektu pisma) bez ukończonego W1.2c-PRE
            (MOD-SKAN-DOWODOW-KOMPLETNY). SD-VER musi mieć status KOMPLET.
            Zakaz obejmuje sytuację gdy użytkownik wspomina o załącznikach/dowodach
            ale ich nie wgrał — w takim wypadku: STOP, zażądaj plików, nie generuj.
            ⛔ Pominięcie choćby jednej strony / zakładki / obrazu ODT = BŁĄD KRYTYCZNY.
            ⛔ Protokoły sądowe: każde zdanie zeznań świadka = osobny wpis SD-FAKTY.
            W2.4 jest OBLIGATORYJNY — brak pliku MOD-ATAK-NA-DRAFT.md nie zwalnia z kroku;
            jeśli view() zwróci błąd — zatrzymaj się i poinformuj użytkownika.
            Pominięcie W2.4 = błąd krytyczny; powróć do W2.4 i wykonaj retroaktywnie.
⛔ ZAKAZ-11: NIE formułuj argumentu opartego na tożsamości podmiotów (np. "ten sam
            podmiot bo ta sama nazwa" / "ciągłość bo ten sam KRS") bez uprzedniego
            wykonania MOD-DOKUMENT-ANOMALIE (DA-0→DA-2 cross-check z rejestrem).
            Anomalia KRS/NIP w dokumentach pracodawcy jest ARGUMENTEM PROCESOWYM
            na korzyść pracownika — nie błędem do pominięcia.
            Każda rozbieżność KRS ≠ NIP w jednym dokumencie → DA-3 Klasa I →
            wbuduj do uzasadnienia jako "błąd pracodawcy nie może szkodzić pracownikowi".
⛔ ZAKAZ-12 (NADRZĘDNY nad ZAKAZ-3): NIE generuj .docx — ani nie wywołuj docx-skill,
            ani nie uruchamiaj Packer.toBuffer(), ani nie twórz żadnego pliku .docx —
            zanim WSZYSTKIE poniższe CP nie są zamknięte z potwierdzeniem użytkownika:
            [CP-1a] [CP-1b jeśli wymagany] [CP-1c-skan] [CP-FSL-D] [CP-1c-macierz]
            [CP-1c-lancuch] [CP-1d-anomalie jeśli wymagany] [CP-1d] [CP-W1] [CP-PRE-W2]
            [CP-ATAK] [CP-PODMIOT] [CP-QUALITY] [CP-AUDYT] [CP-PEER]
            Pominięcie choćby jednego = błąd krytyczny.
            Jeśli .docx zostanie wygenerowany przedwcześnie: natychmiast poinformuj
            użytkownika: "⚠️ UWAGA: Powyższy .docx jest WSTĘPNYM DRAFTEM — NIE jest
            wersją finalną. Nie składaj go do sądu. Wymagane są: [lista brakujących CP]."
            Wersja finalna = tylko po CP-PEER → PEER-OK.
⛔ ZAKAZ-13: NIE generuj projektu pisma (W2) bez wykonania W2.4c (MOD-ATAK-NA-SWIADKA)
            gdy w łańcuchu dowodowym (ŁD-n) wykryto ≥1 ogniwo zeznaniowe (SW-DETECT).
            Zeznanie świadka jako ogniwo BASE bez antycypacji ataku = luka krytyczna:
            (1) pismo nie zawiera SW-TARCZKA → łatwy demontaż przez stronę przeciwną;
            (2) brak sekcji zarzutów co do świadka strony przeciwnej gdy istnieje;
            (3) pominięte wnioski procesowe SW-W1/SW-W2/SW-W4.
            Pominięcie W2.4c = powróć do W2.4 i wykonaj retroaktywnie.
            ⛔ Dotyczy OBYDWU kierunków: ataku na świadka przeciwnika I antycypacji
            ataku na naszego świadka (SW-TARCZKA). Pominięcie drugiego = błąd krytyczny.
⛔ ZAKAZ-14 (CRIT-NA — FAŁSZYWE N/A): NIE oznaczaj checkpointów warunkowych jako N/A
            z powodu TYPU PISMA ani SUBIEKTYWNEJ OCENY złożoności.
            N/A dozwolone WYŁĄCZNIE gdy techniczny warunek aktywacji = NIE.
            Warunki techniczne (jedyne dopuszczalne podstawy N/A):
              [CP-FSL-D]:       warunek "SD-VER=KOMPLET i ≥1 teza" = NIE
              [CP-1c-macierz]:  warunek "≥2 dowody" = NIE (użytkownik dostarczył 0-1 pliki)
              [CP-1c-lancuch]:  warunek "≥1 teza główna" = NIE (brak tez do wykazania)
              [CP-1b]:          warunek "≥2 ścieżki LUB anomalia podmiotowa" = NIE
              [CP-1d-anomalie]: warunek "rozbieżne KRS/NIP lub anomalia danych" = NIE
            NIGDY N/A z powodów:
              ✗ "pismo rozszerzające, nie nowy pozew"
              ✗ "prosta sprawa / jeden świadek / mało dowodów"
              ✗ "użytkownik nie prosił o macierz/łańcuch"
              ✗ "poprzednia sesja już to zrobiła"
            Naruszenie = błąd krytyczny — wykonaj brakujący CP retroaktywnie.
```

**REGUŁA AUTODIAGNOZY — sprawdź przed każdą odpowiedzią:**

```
ŚLEDŹ AKTYWNE CHECKPOINTY — przed każdą odpowiedzią:
  □ Który [CP] jest aktualnie otwarty?
  □ Czy użytkownik potwierdził poprzedni [CP]?
  □ Czy mam podstawę do przejścia do następnego kroku?
  □ Czy którykolwiek CP oznaczono N/A? → zweryfikuj ZAKAZ-14 (warunek techniczny = NIE?)

  NIE → wyświetl przypomnienie: "Czekam na potwierdzenie [CP-X] przed kontynuacją."
  TAK → kontynuuj do następnego kroku → wykonaj → [CP-następny] → STOP

Czy użytkownik prosił o pismo procesowe / zażalenie / pozew / apelację?
  TAK → czy [CP-1a] CLAIM-VALIDATION zamknięty?
          NIE → wykonaj CLAIM-VALIDATION → [CP-1a] → STOP
          TAK → czy [CP-1c-skan] SD-VER zamknięty (gdy pliki)?
                  NIE → dokończ skanowanie → [CP-1c-skan] → STOP
                  TAK → czy [CP-FSL-D] per-teza weryfikacja dowodów zamknięta?
                          NIE → wykonaj FSL-D-SCAN per każdą tezę → [CP-FSL-D] → STOP
                          ⛔ N/A wymaga uzasadnienia per ZAKAZ-14 (warunek tech. = NIE)
                          TAK → czy [CP-1c-macierz] macierz D×T zatwierdzona?
                                  NIE → wykonaj macierz → [CP-1c-macierz] → STOP
                                  ⛔ N/A wymaga uzasadnienia per ZAKAZ-14
                                  TAK → czy [CP-1c-lancuch] łańcuchy dowodowe zamknięte?
                                          NIE → wykonaj łańcuchy → [CP-1c-lancuch] → STOP
                                          ⛔ N/A wymaga uzasadnienia per ZAKAZ-14
                                          TAK → czy [CP-W1] rama zatwierdzona?
                                                  NIE → wyślij raport W1 → [CP-W1] → STOP
                                                  TAK → czy [CP-PRE-W2] zamknięty?
                                                          NIE → PRE-W2 gate → [CP-PRE-W2] → STOP
                                                          TAK → czy [CP-ATAK] zamknięty?
                                                                  NIE → MOD-ATAK-NA-DRAFT → [CP-ATAK] → STOP
                                                                  TAK → W3 → [CP-PODMIOT] → ...
```

**REGUŁA NAPRAWY — gdy naruszono automat:**

```
Jeśli wykryjesz, że pominąłeś W1 lub W2 lub W3:
  → STOP natychmiast
  → Poinformuj użytkownika o naruszeniu (raport pominięć MOD-STEP-TRACKER FAZA 2)
  → Wróć do brakującego etapu
  → NIE kontynuuj od miejsca pominięcia

Jeśli wykryjesz, że wykonałeś W3.1 bez uprzedniego W3.0 PODMIOT-GATE:
  → STOP natychmiast
  → Poinformuj użytkownika o pominięciu weryfikacji podmiotów
  → Wykonaj W3.0 PODMIOT-GATE teraz — dla wszystkich ⚠️POD
  → Dopiero po jego zamknięciu wróć do W3.1
  → NIE traktuj wyników W3.1 jako ważnych, jeśli podmiot/sąd okazał się błędny

Jeśli wykryjesz, że pominąłeś W2.4c (MOD-ATAK-NA-SWIADKA) gdy ogniwa zeznaniowe:
  → STOP natychmiast
  → Poinformuj użytkownika: "Pismo nie zawiera analizy wiarygodności zeznań
    świadka [imię] ani antycypacji ataku na zeznanie. Wykonuję teraz W2.4c."
  → Wykonaj SW-DETECT → SW-P1..P5 → SW-ATAK → SW-TARCZKA → SW-WNIOSKI
  → Wstaw sekcje do projektu pisma W2 retroaktywnie
  → Zaktualizuj REJESTR KROKÓW (MOD-STEP-TRACKER) o wykonanie W2.4c

⛔ SCENARIUSZ NAPRAWY CP-GATE — gdy .docx wygenerowany z pominięciem CP:
  → Wykonaj §10 CP-GATE (BŁĄD KRYTYCZNY) natychmiast:
    1. W tej samej wiadomości dodaj komunikat:
       "⚠️ BŁĄD KRYTYCZNY: Powyższy plik jest WERSJĄ ROBOCZĄ (DRAFT).
        Pominięte checkpointy: [lista z MOD-STEP-TRACKER REJESTR].
        NIE składaj tego pisma — jest niezweryfikowane.
        Kontynuuję pipeline od pierwszego brakującego CP."
    2. Zidentyfikuj pierwszy niezamknięty CP
    3. Wykonaj go w kolejnej odpowiedzi → raport CP → STOP
    4. Kontynuuj pipeline aż do CP-PEER = PEER-OK
    5. Wygeneruj nowy .docx — tym razem FINAL (bez watermarku)
  → NIE generuj kolejnego .docx dopóki CP-PEER nie zamknięty
  → NIE ignoruj tej naprawy "bo użytkownik widział już pismo"
```

**REGUŁA-KONTYNUACJA — gdy użytkownik pisze "continue" / "kontynuuj" / "dalej":**

```
⛔ HARD GATE — "continue" / "kontynuuj" / "dalej" NIE jest zatwierdzeniem
   żadnego checkpointu ani sygnałem do pominięcia kroków pipeline'u.

ZASADA: słowo "continue" / "kontynuuj" / "ok" po gotowym piśmie = żądanie
  nowego pisma lub rozszerzenia, NIE wznowienie od miejsca pominięcia.

JEŚLI użytkownik napisał "continue" po dokumencie/piśmie:
  → SPRAWDŹ: czy pipeline W1→W2→W3 był wykonany dla tego pisma?
  → NIE (pismo wygenerowane bezpośrednio): COFNIJ SIĘ do W1
    → Poinformuj: "Poprzednie pismo pominęło pipeline. Teraz uruchamiam
      pełny W1 aby zapewnić jakość. PRE-W2-GATE wykona weryfikację KRS/adres."
    → Wykonaj: W1 → [CP-W1] → PRE-W2-GATE → W2 → W3 od zera
  → TAK (pipeline był wykonany): kontynuuj od następnego logicznego kroku

KLASY ZACHOWAŃ po "continue":
  Klasa A — użytkownik jest w toku W1/W2/W3 i potwierdza CP → kontynuuj
  Klasa B — użytkownik chce nowego pisma / rozszerzenia → uruchom W1 od zera
  Klasa C — użytkownik kontynuuje rozmowę po gotowym piśmie → odpowiedz
             na pytanie, nie uruchamiaj pipeline bez wyraźnego żądania pisma

NIE traktuj "continue" jako wyjątku od ZAKAZ-1B (PRE-W2-GATE obowiązkowy).
```

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Żaden artykuł, numer Dz.U., stawka, termin ustawowy, kara ani sygnatura orzeczenia
> nie może być podany bez weryfikacji online. Dotyczy wszystkich trzech wiadomości.
> Procedura: view /mnt/skills/user/shared/PRAWO-HARDGATE.md

---

