# MOD-ATAK-NA-SWIADKA — Podważanie świadka jako ogniwa łańcucha dowodowego

> **Plik:** `/mnt/skills/user/shared/MOD-ATAK-NA-SWIADKA.md`
> **Wersja:** 1.0.1 (2026-06-24) — naprawa CRIT: art. 258 KPC uchylony 23.04.2026
> **Status:** PRODUKCJA — plik kanoniczny shared/
> **Pozycja w pipeline:**
>   - pisma-procesowe-v3: W1.2c-LANCUCH (ŁD-3 EQG — ocena ogniwa zeznanie)
>   - pisma-procesowe-v3: W2.4 ROZSZERZENIE W2.4c (gdy ≥1 ogniwo = zeznanie)
>   - pisma-procesowe-v3: W3.4 BLOK J (weryfikacja twierdzeń o świadku)
>   - przesluchanie-swiadkow-v2-min90: W3 (pytania do cross-examination)
>
> **Powiązania:**
>   - MOD-LANCUCH-DOWODOWY §ŁB-1 (ogniwo BASE kl.D — zeznanie)
>   - MOD-ATAK-NA-DOWOD §AD-3 (brak weryfikowalności), §AD-10 (konflikt interesu)
>   - MOD-NEGACJA-DOWODOW §N2 (odporność klasy D)
>   - KPC art. 248, 261, 266, 271–272 (dowód ze świadków i przesłuchanie)
>     ⚠️ art. 258 KPC — UCHYLONY 23.04.2026 (Dz.U.2026.0.468); obowiązki strony
>     dotyczące wskazania świadków i faktów przeniesione do art. 235² §1 KPC
>
> ⛔ HARD GATE: przepisy i sygnatury — weryfikuj ISAP przed użyciem w piśmie.
> ⛔ WERYFIKACJA art. KPC: wszystkie art. zweryfikowane w Dz.U.2026.0.468 (24.06.2026):
>   art. 248 ✅ · art. 261 ✅ · art. 266 ✅ · art. 271 ✅ · art. 272 ✅
>   art. 258 ❌ UCHYLONY — zastąp art. 235² §1 KPC przy powoływaniu świadków

---

## DLACZEGO OSOBNY MODUŁ

```
Zeznanie świadka ≠ dokument.
  Dokument atakuje się przez: autentyczność, treść, datę, podpis.
  Świadka atakuje się przez: wiarygodność osoby + wiarygodność zeznania.

Problem w obecnym systemie:
  MOD-ATAK-NA-DOWOD §AD-3/AD-10 obsługuje "brak weryfikowalności"
  i "konflikt interesu" — ale nie daje procedury kompletnego ataku
  na świadka jako OGNIWO ŁAŃCUCHA z antycypacją kontrataków.

  MOD-LANCUCH-DOWODOWY §ŁA-1..ŁA-4 atakuje łańcuch strukturalnie
  — ale nie wchodzi w techniki podważenia konkretnego świadka.

  W2.4 MOD-ATAK-NA-DRAFT §D2 (ataki przeciwnika) nie uwzględnia
  ścieżki: "przeciwnik podważy świadka który jest naszym BASE."

Ten moduł wypełnia tę lukę.
```

---

## FAZA 0 — DETEKCJA (wykonaj automatycznie w W1.2c-LANCUCH)

```
⛔ SW-DETECT: sprawdź per każdy łańcuch ŁD-n:

  Czy ≥1 ogniwo = zeznanie świadka (klasa D z MOD-NEGACJA §N2)?
    TAK → MOD-ATAK-NA-SWIADKA AKTYWNY dla tego ogniwa
          Oznacz: ŁD-n → ogniwo [ŁO-BASE/POŚR] → typ: ZEZNANIE
          → wykonaj FAZĘ 1 dla każdego takiego ogniwa
    NIE → moduł nieaktywny; kontynuuj normalnie

  Trigger dodatkowy:
    Materiał zawiera protokół rozprawy z zeznaniami świadka → AKTYWNY
    Prośba o "podważenie świadka" / "cross-examination" → AKTYWNY
    Pismo riposta/odpowiedź gdy strona przeciwna powołuje świadka → AKTYWNY
```

---

## FAZA 1 — PROFIL ŚWIADKA (SW-PROFIL)

```
Per każdy świadek-ogniwo W[id]:

SW-P1 DANE FORMALNE:
  Imię, nazwisko, wiek (z protokołu lub akt)
  Status: strona / pracownik strony / osoba trzecia / biegły
  Relacja ze stronami: zależność służbowa? osobista? ekonomiczna?
  Karalność za składanie fałszywych zeznań (protokół: "pouczony / nie karany")

SW-P2 TREŚĆ ZEZNAŃ (per twierdzenie):
  Wyodrębnij KAŻDE twierdzenie faktyczne:
    W-001: "[cytat/parafraza]" — bezpośrednio zaobserwowane / z relacji / domysł
    W-002: "[cytat/parafraza]" — ...
  Wyodrębnij KAŻDE "nie wiem" / "nie pamiętam" / "nie byłem przy tym":
    W-NW-001: "[cytat]" — co świadek wyklucza ze swojej wiedzy
  Wyodrębnij każde twierdzenie warunkowe / niepewne:
    W-COND-001: "[cytat z 'chyba' / 'zdaje się' / 'bodajże']"

SW-P3 ŹRÓDŁO WIEDZY ŚWIADKA:
  Kategoria per twierdzenie W-xxx:
    BEZPOŚREDNIE   — świadek osobiście widział/słyszał
    Z RELACJI      — ktoś mu powiedział (kto? kiedy?)
    WNIOSKOWANE    — świadek wyciąga wniosek z faktów
    DOMYSŁ         — świadek sam zaznacza niepewność

  ⛔ Twierdzenia kategorii Z RELACJI i WNIOSKOWANE są podatne na:
     SW-A3 (źródło wtórne) i SW-A4 (logika wnioskowania).

SW-P4 SPRZECZNOŚCI WEWNĘTRZNE:
  Porównaj wszystkie W-xxx między sobą:
    Czy daty się zgadzają?
    Czy sekwencja zdarzeń jest logiczna?
    Czy twierdzenie W-001 nie przeczy W-007?
  Format: [W-001] vs [W-007] — SPRZECZNOŚĆ: [opis]

SW-P5 SPRZECZNOŚCI ZEWNĘTRZNE:
  Porównaj zeznania z dokumentami w aktach:
    Każdy D[id] z SD-FAKTY który opisuje ten sam fakt → zestawienie
  Format: [W-001] vs [D03 str.2] — ROZBIEŻNOŚĆ: [opis]
  
  Porównaj z zeznaniami innych świadków:
    [W1-001 Nawrot] vs [W2-003 Parzych] — SPRZECZNOŚĆ: [opis]
```

---

## FAZA 2 — WEKTORY ATAKU NA ŚWIADKA (SW-ATAK)

```
SW-A1 — KONFLIKT INTERESU / STRONNICZOŚĆ:
  Pytanie: czy świadek ma powód by zeznawać na korzyść jednej ze stron?
  Sygnały: pracownik strony, beneficjent wyroku, osobiste animozje.
  Technika pisma:
    "Świadek [imię] pozostaje w [relacja służbowa/ekonomiczna] ze stroną
     [X]. Zeznanie świadka jest zatem obciążone potencjalnym konfliktem
     interesu, co powinno być uwzględnione przez Sąd przy ocenie jego
     wiarygodności zgodnie z art. 233 §1 k.p.c."
  Skuteczność: ↑ gdy udokumentowana relacja + brak zewnętrznego potwierdzenia

SW-A2 — ZAPRZECZENIE ISTNIENIU OKOLICZNOŚCI:
  ⛔ KLUCZOWY — atak wprost na prawdziwość ogniwa łańcucha
  Sygnały: nasze dowody dokumentowe zaprzeczają temu co zeznał świadek.
  Technika pisma:
    "Twierdzenie świadka [imię], że [W-xxx], stoi w bezpośredniej
     sprzeczności z dokumentem [D-NNN] (zał. nr [X]), który potwierdza
     że [fakt odwrotny]. W świetle tego dowodu dokumentowego (klasa [A/B])
     zeznanie świadka w zakresie [W-xxx] nie może być uznane za
     wiarygodne. Dokument pochodzi od [strony/organu] i wyprzedza
     datą zeznania — nie może być zatem efektem późniejszej korekty."
  Skuteczność: ↑↑↑ gdy kontrdownód klasy A/B + data wcześniejsza
  ⛔ Pamiętaj: samo zaprzeczenie bez dowodu = słabe; musi być poparte D[id]

SW-A3 — ŹRÓDŁO WTÓRNE (RELACJA Z DRUGIEJ RĘKI):
  Sygnały: świadek sam mówi "dowiedziałem się od X" / "opowiedział mi Y"
  Technika pisma:
    "Twierdzenie świadka [imię] dotyczące [W-xxx] opiera się wyłącznie
     na relacji osoby trzeciej — [imię osoby, jeśli znana]. Świadek
     nie był bezpośrednim uczestnikiem ani obserwatorem opisywanego
     zdarzenia. Wartość dowodowa zeznania z drugiej ręki jest
     ograniczona, a sama relacja nie może zastąpić zeznania
     bezpośredniego świadka zdarzenia."
  Skuteczność: ↑↑ — szczególnie gdy bezpośredni świadek jest znany
    ale nie był powołany (wniosek o wezwanie)

SW-A4 — LOGIKA WNIOSKOWANIA (DOMYSŁ, NIE FAKT):
  Sygnały: świadek wyciąga wniosek ("myślę że" / "moim zdaniem" / "chyba")
  Technika pisma:
    "Twierdzenie świadka [imię] w zakresie [W-xxx] ma charakter osobistej
     oceny / domysłu, nie relacji bezpośrednio zaobserwowanych faktów.
     Sam świadek zaznaczył: '[cytat z protokołu potwierdzający niepewność]'.
     Przedmiotem zeznania powinny być własne spostrzeżenia świadka (art. 271
     §1 k.p.c. — weryfikuj ISAP), a nie wnioski wyciągane z obserwacji.
     Oceny i domysły świadka nie mają waloru dowodowego w zakresie
     ustalania faktów, w odróżnieniu od opinii biegłego (art. 278 k.p.c.)."

SW-A5 — NIESPÓJNOŚĆ WEWNĘTRZNA:
  Sygnały: z SW-P4 — sprzeczności wewnętrzne zeznania tego samego świadka
  Technika pisma:
    "Zeznania świadka [imię] zawierają wewnętrzną sprzeczność:
     w [części X protokołu] świadek stwierdził [W-001],
     podczas gdy w [części Y protokołu] zeznał [W-007].
     Sprzeczność ta dotyczy [kluczowego faktu] i podważa
     wiarygodność zeznania w całości, nie tylko w spornym fragmencie."
  Szczególnie skuteczne: gdy sprzeczność dotyczy dat, kwot, sekwencji

SW-A6 — UPŁYW CZASU / ZAWODNOŚĆ PAMIĘCI:
  Sygnały: świadek zeznaje o zdarzeniach sprzed >6 miesięcy
           świadek wielokrotnie mówi "nie pamiętam dokładnie"
  Technika pisma:
    "Zeznania świadka [imię] dotyczą zdarzeń z [data], tj. sprzed
     [N] miesięcy. Świadek wielokrotnie wskazywał na ograniczoną
     pamięć szczegółów ([lista W-NW]). W zakresie [kluczowego faktu]
     świadek sam zaznaczył niepewność: '[cytat W-COND]'.
     Przy braku dokumentów potwierdzających zeznanie,
     zeznanie to nie może stanowić wyłącznej podstawy ustalenia
     faktu [X] — tym bardziej wobec dokumentu [D-NNN] wskazującego
     na [okoliczność odmienna]."

SW-A7 — ZASTRASZENIE LUB NACISK (gdy udokumentowany):
  Sygnały: kontakty z świadkiem udokumentowane w aktach
           świadek zeznał o nacisku / zastraszaniu przez stronę
  Technika pisma:
    "Strona [X] kontaktowała się ze świadkiem [imię] przed
     rozprawą, co wynika z [dowód: SMS/e-mail/zeznanie świadka].
     W świetle art. 233 §1 k.p.c. Sąd winien uwzględnić okoliczność
     potencjalnego nacisku na treść zeznań świadka."
  ⛔ Uwaga: stosuj ostrożnie — musi być udokumentowane. Bez dowodu = ryzyko
    zarzutu zniesławienia.

SW-A8 — WYKLUCZENIE PRZEZ BRAK WIEDZY (świadek nie był przy zdarzeniu):
  Sygnały: z W-NW — świadek sam deklaruje brak wiedzy o kluczowym fakcie
  Technika pisma:
    "Sam świadek [imię] zeznał, że [W-NW-001: cytat 'nie wiem' / 'nie byłem'].
     Twierdzenie dotyczące [faktu X] nie może zatem opierać się na
     zeznaniu tego świadka — który expressis verbis wykluczył posiadanie
     wiedzy w tym zakresie. Strona [X] nie powołała innego świadka
     bezpośrednio obserwującego [zdarzenie Y]."
```

---

## FAZA 3 — PRIORYTETYZACJA ATAKÓW (SW-PRIOR)

```
Per świadek-ogniwo W[id]: wybierz ≤3 najsilniejsze wektory ataku:

MACIERZ PRIORYTETÓW:
  🔴 KRYTYCZNE (zawsze użyj gdy dostępne):
    SW-A2 (zaprzeczenie przez dokument klasy A/B)
    SW-A5 (niespójność wewnętrzna w protokole)
    SW-A8 (świadek sam wyklucza swoją wiedzę)

  🟠 SILNE (użyj gdy brak 🔴 lub dla wzmocnienia):
    SW-A1 (konflikt interesu — udokumentowany)
    SW-A3 (relacja z drugiej ręki — kluczowy fakt)
    SW-A7 (zastraszenie — udokumentowane)

  🟡 UZUPEŁNIAJĄCE (tylko jako dodatkowy argument):
    SW-A4 (domysł vs fakt)
    SW-A6 (upływ czasu / zawodność pamięci)
    SW-A1 (konflikt interesu — domniemany)

⛔ ZAKAZ: nie atakuj wszystkich 8 wektorów naraz — traci moc.
  Zasada MacCarthy'ego: 1-3 mocne uderzenia > 8 słabych.
  Wybierz wektory z dowodami; wektory bez dowodów = tylko marginalnie.
```

---

## FAZA 4 — INTEGRACJA W W2.4 (ROZSZERZENIE W2.4c)

```
⛔ W2.4c — ATAK NA ŚWIADKA (gdy AKTYWNY z SW-DETECT):

FORMAT sekcji w piśmie:

## [Tytuł: Uwagi co do wiarygodności zeznań świadka X]

  Zeznania świadka [imię], złożone na rozprawie w dniu [data],
  jako [ogniwo BASE/POŚR] dla tezy [T-X], budzą istotne
  zastrzeżenia co do ich wiarygodności z następujących przyczyn:

  1. [SW-A2 jeśli aktywny]: ...
  2. [SW-A5 jeśli aktywny]: ...
  3. [SW-A8 / SW-A1 / SW-A3 jeśli aktywne]: ...

  W konsekwencji, zeznanie świadka [imię] nie może stanowić
  samodzielnej podstawy ustalenia [faktu X], w szczególności
  wobec [kontrdownodu D-NNN] potwierdzającego [fakt odmienny].

ANTYCYPACJA ZARZUTU WOBEC NASZEGO ŚWIADKA:
  Jeśli nasz łańcuch opiera się na świadku (np. Nawrot):
    → Wstaw sekcję SW-TARCZKA:
    "Wartość dowodowa zeznań świadka [imię] jest wysoka z uwagi na:
     (1) status osoby obcej wobec stron (protokół: 'obcy wobec stron');
     (2) brak aktywnego zatrudnienia u pozwanej w dniu przesłuchania;
     (3) potwierdzenie przez dokumenty SUDOP (D-XX, D-YY) kluczowego faktu
     dotyczącego [PFRON / premii / obsługi];
     (4) zeznanie pod rygorem odpowiedzialności karnej za fałszywe zeznania
     (art. 233 §1 k.k. — weryfikuj ISAP — kara pozb. wolności 6 mies. do 8 lat;
      pouczony przed złożeniem zeznań zgodnie z art. 266 §1 k.p.c.)."
```

---

## FAZA 5 — WNIOSKI PROCESOWE (SW-WNIOSKI)

```
Na podstawie SW-ATAK wygeneruj odpowiednie wnioski procesowe:

SW-W1: KONFRONTACJA (art. 272 k.p.c.) — weryfikuj ISAP
  Trigger: SW-A5 (sprzeczność między dwoma świadkami)
  Wniosek: "Wnoszę o zarządzenie konfrontacji świadka [X] ze świadkiem [Y]
    w zakresie [sprzecznych twierdzeń W-001 vs W-007]."

SW-W2: WNIOSEK O POWOŁANIE ŚWIADKA (art. 235² §1 k.p.c.) — weryfikuj ISAP
  ⚠️ art. 258 KPC UCHYLONY 23.04.2026 (Dz.U.2026.0.468) — używaj art. 235² §1 KPC
  Trigger: SW-A3 (relacja wtórna — osoba pierwotna znana)
  Wniosek: "Wnoszę o wezwanie [imię osoby pierwotnej] w charakterze świadka
    na okoliczność [X], o której świadek [imię wtórny] zeznawał z relacji.
    Powołuję ww. świadka na podstawie art. 235² §1 k.p.c., wskazując że
    wykazanie [faktu X] jest istotne dla rozstrzygnięcia sprawy."

SW-W3: PYTANIA DO CROSS-EXAMINATION
  Trigger: świadek będzie przesłuchiwany na przyszłej rozprawie
  Format: lista pytań do protokołu (per wektor ataku SW-A1..SW-A8)
  → Przekaż do przesluchanie-swiadkow-v2-min90 dla pełnego opracowania

SW-W4: WNIOSEK O DOKUMENTY (art. 248 k.p.c.) — weryfikuj ISAP
  Trigger: SW-A2 — zeznanie podważa dokument, ale dokument nie jest w aktach
  Wniosek: "Wnoszę o zobowiązanie [strona] do złożenia [dokument X] na
    okoliczność [fakt Y], który pozostaje w sprzeczności z zeznaniem świadka [Z]."
```

---

## SELF-CHECK

```
□ SW-DETECT: czy wykryto ogniwa zeznaniowe w łańcuchach ŁD-n?
□ SW-P1..P5: profil per świadek-ogniwo — kompletny?
□ SW-P4: sprzeczności wewnętrzne — sprawdzone?
□ SW-P5: sprzeczności z dokumentami D[id] — sprawdzone?
□ SW-ATAK: ≤3 wektory priorytetowe wybrane (nie wszystkie 8)?
□ W2.4c sekcja wbudowana do projektu pisma (W2)?
□ SW-TARCZKA dla naszych świadków — wbudowana do W2?
□ SW-WNIOSKI: wnioski procesowe wynikające z ataku — wygenerowane?
Którykolwiek = NIE → wróć do brakującego kroku.
```

---

## HISTORIA ZMIAN

```
1.0.1 (2026-06-24) — NAPRAWA CRIT (art. 258 KPC UCHYLONY) + korekta art. 266/271
  (1) SW-W2: art. 258 KPC uchylony 23.04.2026 → zastąpiony art. 235² §1 KPC
      (VER: lexlege.pl, Dz.U.2026.0.468, 24.06.2026)
  (2) SW-A4: błędne powołanie art. 266 §1 KPC jako "zeznawanie o faktach" →
      poprawiono na art. 271 §1 KPC (swobodna relacja spostrzeżeń świadka)
  (3) Nagłówek: dodano weryfikację per artykuł ✅/❌
  (4) SW-TARCZKA: wzmocniono opis art. 233 §1 KK + pointer do art. 266 §1 KPC
Weryfikacja online (24.06.2026): art. 248 ✅ · 261 ✅ · 266 ✅ · 271 ✅ · 272 ✅
  art. 258 ❌ UCHYLONY · art. 233 KK ✅ · art. 235² §1 KPC ✅

1.0.0 (2026-06-24)
Przyczyna: Sprawa VII P 94/25 — pismo procesowe rozszerzające pozew
zawierało zeznania świadka Nawrota jako ogniwo BASE dla premii PFRON
(1.000 zł/m-c), ale pismo nie zawierało:
  (1) antycypacji ataków na wiarygodność świadka
  (2) sekcji wzmacniającej wartość dowodową zeznań (SW-TARCZKA)
  (3) wektora SW-A2 (zaprzeczenie przez SUDOP — który był dowodem)
  (4) wniosku SW-W2 (o wezwanie Yurii Kast na potwierdzenie)
Luka: brak procedury analizy ogniw zeznaniowych w łańcuchu dowodowym.
Integracje:
  pisma-procesowe-v3 W1.2c-LANCUCH (ŁD-3 EQG) — SW-DETECT
  pisma-procesowe-v3 W2.4 — W2.4c (nowe rozszerzenie)
  pisma-procesowe-v3 ZAKAZ-13 (nowy)
  MOD-LANCUCH-DOWODOWY §ŁB-1 — ogniwo BASE kl.D zeznanie
  przesluchanie-swiadkow-v2-min90 — SW-W3 output
```
