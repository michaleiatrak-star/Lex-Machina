# SELF-CHECK — Lista kontrolna przed każdą odpowiedzią (pisma procesowe)

> Wydzielono z pisma-procesowe-v3/SKILL.md (v5.2) — WARN-14 refaktoryzacja
> Wywołanie: `view /mnt/skills/user/pisma-procesowe-v3/references/SELF-CHECK-PISMA.md`
> Zawiera: SELF-CHECK przed odpowiedzią, REGUŁA FINALNA

---

## SELF-CHECK PRZED KAŻDĄ ODPOWIEDZIĄ (obowiązkowy)

```
⛔⛔⛔ KROK 0 — CP-GATE (ABSOLUTNIE PIERWSZY, przed wszystkim innym):
   view /mnt/skills/user/shared/CP-GATE.md → sprawdź §4 CP-CHECK:
   □ CP-REJESTR zainicjalizowany w tej sesji?          TAK / NIE→zainicjalizuj
   □ STATUS DOKUMENTU widoczny w rejestrze?            ⚠️DRAFT / ✅FINAL
   □ Zamierzam teraz wygenerować .docx?
       TAK → czy CP-PEER = ✅ ZAMKNIĘTY i zero ⬛?
               TAK → generuj FINAL (§6 CP-GATE)
               NIE → CP-CHECK FAIL → komunikat §4 CP-GATE → STOP
       NIE → kontynuuj do poniższych punktów
   □ Jakikolwiek .docx wygenerowany wcześniej w sesji bez CP-PEER?
       TAK → §10 CP-GATE: dodaj komunikat DRAFT do bieżącej odpowiedzi
             i kontynuuj pipeline od pierwszego otwartego CP
⛔⛔⛔ BEZ WYJĄTKÓW — nawet gdy użytkownik nie pyta o status

⛔⛔⛔ KROK 0b — HARD GATE STEP-DISCLOSURE (przed KAŻDYM present_files pisma):
   □ Czy zamierzam teraz wywołać present_files dla pisma?
       TAK → czy w tej odpowiedzi wyświetliłem ST-FINAL (REJESTR KROKÓW)?
               NIE → ⛔ STOP. Najpierw ST-FINAL (MOD-STEP-TRACKER FAZA 3).
               TAK → policz kroki wymagane ze statusem ⚠️ POMINIĘTY lub ○ OCZEKUJE:
                       = 0  → STATUS ✅ FINAL → present_files dozwolone
                       ≥ 1  → ⛔ INFORMACJA WARUNKOWA: status ⚠️ DRAFT —
                              NIEZWERYFIKOWANY + blok ujawnienia + STOP na decyzję a/b.
                              present_files DOPIERO po zgodzie „a". (ZAKAZ-14)
⛔⛔⛔ BEZ WYJĄTKÓW — „dalej"/„generuj" nie zwalnia z tej bramki

⛔ NASTĘPNIE: STATUS CHECKPOINTÓW — które [CP] są otwarte/zamknięte?
   [CP-1a]              CLAIM-VALIDATION:          ⬜ OCZEKUJE / ✅ ZAMKNIĘTY
   [CP-1b]              MOD-STRATEGIA-WYBOR:       ⬜ / ✅ / N/D
   [CP-1c-skan]         SD-VER KOMPLET:            ⬜ / ✅ / N/D
   [CP-1c-macierz]      MACIERZ D×T:               ⬜ / ✅ / N/D
   [CP-1d-anomalie]     MOD-DOKUMENT-ANOMALIE:     ⬜ / ✅ / N/D
   [CP-1d]              MOD-POSZLAKI-KONTEKST:     ⬜ / ✅
   [CP-W1]              RAMA W1:                   ⬜ / ✅
   [CP-PRE-W2]          PRE-W2-GATE:               ⬜ / ✅
   [CP-ATAK]            MOD-ATAK-NA-DRAFT:         ⬜ / ✅
   [CP-PODMIOT]         PODMIOT-GATE W3.0:         ⬜ / ✅
   [CP-QUALITY]         LEGAL-QUALITY-GATE:        ⬜ / ✅
   [CP-AUDYT]           AUDYT-KOŃCOWY:             ⬜ / ✅
   [CP-PEER]            PEER-REVIEW + PV:          ⬜ / ✅

   ⛔ Pierwszy ⬜ = STOP. Wykonaj ten CP. Nie idź dalej.
```

```
□ ⛔ STATUS PODMIOTÓW — BLOK OZNACZANIA ⬛ [DO WERYFIKACJI]:
   ⛔ ZASADA: każdy podmiot niebędący osobą prywatną, napotkany w aktach,
      umowach, protokołach lub innych materiałach dowodowych, otrzymuje
      status ⬛ [DO WERYFIKACJI] natychmiast po napotkaniu.
   ⛔ Status ⬛ utrzymuje się AŻ DO faktycznego wywołania web_search/web_fetch
      w tej samej sesji/odpowiedzi — a NIE do "zamierzenia weryfikacji".
   ⛔ ZAKAZ wstawiania danych ze statusem ⬛ do treści pisma, nagłówka, petitum.
   ⛔ ZAKAZ generowania .docx gdy jakikolwiek podmiot w nagłówku ma status ⬛.
   
   PODMIOTY WYMAGAJĄCE OZNACZENIA (na liście ⬛ od chwili napotkania):
     □ sąd / organ (adresat)           → ⬛ [DO WER: sąd/adres/wydział]
     □ pozwany / uczestnik (spółka)    → ⬛ [DO WER: KRS/NIP/adres/status]
     □ każdy numer KRS z akt           → ⬛ [DO WER: KRS → który podmiot?]
     □ każdy numer NIP z akt (podmiot) → ⬛ [DO WER: NIP → który podmiot?]
     □ organ publiczny (PFRON, ZUS...) → ⬛ [DO WER: właściwy oddział/adres]
   
   WYJĄTKI — NIE oznaczaj statusem ⬛ (dane osób prywatnych z akt):
     - imię i nazwisko osoby fizycznej
     - adres zamieszkania osoby fizycznej  
     - PESEL, seria/nr dowodu osobistego
     - dane kontaktowe osoby fizycznej

   STATUSY (STATUS-LIFECYCLE):
     ⬛ [DO WERYFIKACJI]    → stan domyślny od chwili napotkania
     ✅ [VER: URL, data]    → po faktycznym web_search/web_fetch — dane potwierdzone
     ⚠️ [ROZBIEŻNOŚĆ: opis] → weryfikacja ujawniła niezgodność akt z rejestrem
     ⛔ [NIEODCZYTALNY]     → brak dostępu; użyj danych z akt z ⚠️ [NIEWERYFIKOWANE]

   SPRAWDŹ TERAZ:
     □ Czy wszystkie podmioty w aktach/materiałach są na liście ⬛?     TAK/NIE
     □ Czy wszystkie ⬛ mają już ✅ po web_search/web_fetch?             TAK/NIE
     □ Zero ⬛ w nagłówku i treści pisma przed generowaniem?             TAK/NIE
     NIE do któregokolwiek → STOP. Nie przechodzę dalej.
   Szczegóły + STATUS-LIFECYCLE: view /mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md (PRE-W2.0)
□ ⛔ MOD-SKAN-DOWODOW-KOMPLETNY (W1.2c-PRE) — wykonaj jako PIERWSZY:
   SD-GATE-0: czy wzmianka o załącznikach + faktyczny brak pliku? → STOP
   SD-INW: WSZYSTKIE pliki zinwentaryzowane (ZIP = zawartość)?
   SD-READ: KAŻDA strona/zakładka/obraz przeanalizowana?
   SD-VER: status KOMPLET przed W1.3 i W2?
   Protokół sądowy: wszystkie zeznania per zdanie → SD-FAKTY?
   SD-GATE-4: blokada W2 aktywna dopóki SD-VER ≠ KOMPLET?
   NIE do któregokolwiek → STOP. Nie generuj pisma.
   view: /mnt/skills/user/shared/MOD-SKAN-DOWODOW-KOMPLETNY.md
□ ⛔ PRE-W2-VERIFICATION-GATE + WERYFIKACJA PODMIOTÓW ONLINE:
   ⛔ ZASADA: dane z dokumentów/akt ≠ zweryfikowane. Dane z pamięci ≠ zweryfikowane.
   ⛔ Jedyna weryfikacja = fizyczne wywołanie web_search/web_fetch W TEJ ODPOWIEDZI.
   Zadaj sobie OBA pytania (odpowiedź TAK wymaga faktycznego wywołania narzędzia):
   □ [POV-B] web_search/web_fetch dla SĄDU/ORGANU wywołany w tej odpowiedzi?
              NIE → ⛔ STOP. Wywołaj: web_search "[sąd] [wydział] adres 2026"
              Potwierdź: pełna nazwa, właściwy wydział, adres budynku dla tego wydziału.
   □ [POV-C] web_search/web_fetch dla POZWANEGO (KRS/NIP/adres) wywołany?
              NIE → ⛔ STOP. Wywołaj: web_search "[nazwa] KRS NIP rejestr"
              Potwierdź: firma rejestrowa, KRS, NIP, adres z rejestru, status.
   □ [POV-D] AUTOMATYCZNY TRIGGER: czy w aktach/dokumentach widoczne ≥2 różne KRS/NIP
              przy tej samej lub zbliżonej nazwie podmiotu?
              ⛔ ZASADA: dane z akt ≠ zweryfikowane. KRS z umowy pracodawcy może być błędny.
              Trigger: sama różnorodność numerów = obowiązek POV-D (nie czekaj na sprzeczność).
              TAK lub WĄTPLIWE → web_search każdego numeru osobno → ustal podmiot rejestru.
              NIE → ⛔ STOP. ZAKAZ argumentów o tożsamości podmiotów bez tej weryfikacji.
   □ [POV-R] Raport PRE-W2 (VER-SAD + VER-POZ) wyświetlony użytkownikowi?
              NIE → ⛔ STOP. Wyświetl raport zanim W2.1 się rozpocznie.
   Wszystkie ✅ → GATE-OK → przejdź do W2.1.
   Którykolwiek NIE → ⛔ BLOKADA. Wykonaj brakujące wywołanie. Nie generuj pisma.
   Szczegóły procedury: view /mnt/skills/user/shared/PRE-W2-VERIFICATION-GATE.md
□ ⛔ MOD-MACIERZ-DOWOD-TEZA (W1.2c): czy macierz D×T zatwierdzona przez użytkownika?
   Gdy ≥2 dowody dostarczone:
   □ MT1: lista tez T1..Tn i dowodów D1..Dm sporządzona?
   □ MT2: skan dwukierunkowy (A: każdy dowód→tezy; B: każda teza→dowody) wykonany?
   □ MT3: każde powiązanie sklasyfikowane (K/R/W/RK)?
   □ MT4: raport wyświetlony (tabela + pokrycie + luki + wielofunkcyjne)?
   □ STOP po MT4 — użytkownik zatwierdził lub podjął decyzje RK?
   □ MT5: W1.3 zasilone danymi z macierzy?
   NIE → STOP. NIE przechodzę do W1.3. Wykonaj W1.2c retroaktywnie.
□ ⛔ MOD-STRATEGIA-WYBOR (W1.2b): czy raport S5 wyświetlony i zatwierdzony?
   Gdy warunek aktywacji (≥2 ścieżki lub anomalia podmiotowa):
   □ S1: wszystkie ścieżki zidentyfikowane (w tym anomalie KRS/NIP)?
   □ S2: każda ścieżka oceniona pod kątem ataku przeciwnika?
   □ S3: ścieżka z atakiem 🔴 bez kontrargumentu oznaczona PORZUĆ/EWENTUALNA?
   □ S4: struktura pisma wybrana (Scenariusz 1/2/3, nie ZABRONIONY)?
   □ S5: raport wyświetlony, użytkownik zatwierdził lub zmodyfikował?
   NIE → STOP. NIE przechodzę do W1.3. Wykonaj W1.2b retroaktywnie.
□ Jestem w stanie W1 i nie mam zatwierdzenia → NIE generuję W2. STOP.
□ Jestem w stanie W2 i wstawiam Dz.U. lub sygnaturę → BŁĄD KRYTYCZNY. Usuń, wstaw ⚠️.
□ ⛔ W2.4 ATAK-NA-DRAFT: czy RAPORT D został wyświetlony?
   NIE → STOP. NIE przechodzę do W3. Wykonuję W2.4 teraz (view MOD-ATAK-NA-DRAFT.md).
   W2.4 jest OBLIGATORYJNY — brak pliku nie zwalnia; brak aktywacji użytkownika nie zwalnia.
□ Jestem w stanie W3 i nie zamknąłem wszystkich ⚠️ → NIE generuję .docx. STOP.
□ ⛔ W3.0 PODMIOT-GATE: czy KAŻDY podmiot oznaczony ⚠️POD (strona + sąd/organ) ma status ✅/⚠️/⛔?
   ⛔ Sprawdź też: czy [POV-B] i [POV-C] były wywołane od czasu ostatniej edycji pisma?
      Jeśli dane podmiotowe zmieniły się między PRE-W2 a W3 → powtórz wywołanie.
   NIE → STOP. NIE przechodzę do W3.1. Wykonuję PODMIOT-GATE teraz.
□ Każdy ⚠️Pn z listy W2.3 ma wpis ✅ lub ⛔ w raporcie W3?
□ Każdy ⚠️On z listy W2.3 ma wpis ✅ lub ⛔ w raporcie W3?
□ MOD-FAKTY przeszedł bez ⛔ FIKCJA i bez ⛔ BRAK ŹRÓDŁA (gdy dostarczono materiały)?
□ HYBRID-VALIDATION Block Zero zamknięty (wynik ✅)?
□ FORMAL-VALIDATOR (checklists) — uruchomiony jako uzupełnienie HYBRID w W3.5?
□ BLOK J MOD-WALIDACJA — twierdzenia o statusie aktów przeszły przez FSL/LSL?
□ LEGAL-QUALITY-GATE (W3.6a Krok 2) — wynik PASS lub PASS-WITH-WARNING (nie FAIL)?
□ COURT-SIMULATION (W3.6a) — 10 pytań wykonanych i wbudowanych w AUDYT-KONCOWY?
□ AUDYT-KONCOWY (W3.6a) wykonany i wszystkie kategorie ≥7/10?
□ W3.7 PEER-REVIEW — wykonany gdy warunek aktywacji spełniony (wynik ≠ PEER-STOP)?
□ W3.7 POST-VALIDATION — wykonany, braki 🔴 zaadresowane lub ⬛ wpisane?
□ MOD-INTRO — executive summary wstawiony gdy typ pisma tego wymaga?
□ MOD-KONCENTRACJA — pismo mieści się w limicie orientacyjnym (nie ALERT)?
□ Engines specjalistyczne aktywowane per MODUŁY-MAPA?
   (apelacja → appellate-v8 ✅/N/D; prokuratoria → prosecution-v8 ✅/N/D;
    riposta → rebuttal-v9 ✅/N/D; V10 gdy ≥1 warunek aktywacji ✅/N/D)
Którykolwiek = NIE → STOP. Nie oznaczaj pisma jako gotowego.
```

### REGUŁA FINALNA (merytoryczna, niezależna od kontroli automatu stanów wyżej)

Przed wydaniem pisma finalnego odpowiedz na każde pytanie:

```
1. Jaki jest najsilniejszy argument przeciwnika?            [...]
2. Czy pismo już na niego odpowiada?                        TAK/NIE
3. Czy każda teza ma dowód?                                 TAK/NIE
4. Czy każda teza jest potrzebna do rozstrzygnięcia?         TAK/NIE
5. Czy nie ma twierdzeń zbyt kategorycznych?                TAK/NIE
6. Czy wywołałem web_search/web_fetch dla sądu [POV-B] i pozwanego [POV-C]?   TAK/NIE
   (NIE = nie z pamięci, nie z akt — fizyczne wywołanie narzędzia; TAK tylko gdy URL w tej odpowiedzi)
7. Czy pismo rozdziela fakt od interpretacji?                TAK/NIE
8. Czy roszczenia słabsze (C/D) mają konstrukcję ewentualną? TAK/NIE
9. Czy sąd może przepisać ustalenia faktyczne z pisma do
   uzasadnienia wyroku bez dodatkowej pracy redakcyjnej?     TAK/NIE
10. Czy przeciwnik może jednym dokumentem obalić istotną tezę? TAK/NIE
11. Czy W2.4 (ATAK-NA-DRAFT) zamknięty ze statusem ✅ albo
    z odpowiedzią użytkownika na każdą słabość z 🔴?           TAK/NIE
```

Pyt. 10 = TAK → pismo wymaga przebudowy: wróć do W1.6 (R2) dla tej tezy.
Którekolwiek z pyt. 2–9, 11 = NIE → wskaż poprawkę i wykonaj przed
wydaniem pisma jako finalnego.

---

