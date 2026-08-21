# mod-USP-ustroj-sadow-powszechnych

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** PUSP — Dz.U. 2024 poz. 334 t.j. ze zm. | USN — Dz.U. 2024 poz. 622 t.j. ze zm.
**Data weryfikacji online:** 2026-06-05

⚠️⚡ FLAGA F-15 (patrz `mod-ustawa-KRS-i-ustroj-wladzy.md` dla pełnej treści
i `audyt-systemu-v4/references/WARN-OTWARTE.md`) — DOTYCZY TEGO MODUŁU:
duża, kompleksowa reforma PUSP (projekty UD322/UD323 — spłaszczenie
struktury sądownictwa, jednolity status sędziego powszechnego, zwiększone
kompetencje Ministra Sprawiedliwości) NADAL na etapie opiniowania, RPO
zgłosił istotne zastrzeżenia konstytucyjne — NIE MYLIĆ z już uchwaloną
węższą nowelizacją (Dz.U. 2026 poz. 370, wyłącznie asesorzy w wydziałach
rodzinnych/nieletnich), która jest osobną, mniejszą zmianą. Sprawdź status
dużej reformy PRZED użyciem tego modułu w sprawie dot. statusu sędziego
powszechnego lub organizacji sądów.

**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl | LEX/Legalis wyłącznie pomocniczo

---

## 1. CORE

### Zakres modułu
Ustrój sądów powszechnych (SR, SO, SA), Sąd Najwyższy, sądy administracyjne (NSA/WSA), organizacja sądu, wyłączenie sędziego (iudex inhabilis / iudex suspectus), skarga na przewlekłość postępowania, skarga dyscyplinarna, dostęp do akt, koszty sądowe.

### Akty i źródła kontrolne

| Akt | Skrót | Dz.U. / identyfikator ISAP |
|---|---|---|
| Prawo o ustroju sądów powszechnych | PUSP | Dz.U. 2024 poz. 334 t.j. ze zm. (zm.: Dz.U. 2025 poz. 526, 820, 1172, 1178, 1609 oraz **Dz.U. 2026 poz. 26 i 370** — ta ostatnia to ustawa z 27.02.2026 r. o zmianie PUSP, uchwalanie asesorom sądowym orzekania w wydziałach rodzinnych/nieletnich, VER 2026-08-14 przy okazji F-15) |
| Ustawa o Sądzie Najwyższym | USN | Dz.U. 2024 poz. 622 t.j. ze zm. (zm. potwierdzona: **Dz.U. 2026 poz. 26** — VER 2026-08-14) |
| Prawo o ustroju sądów administracyjnych | PUSA | weryfikuj aktualny t.j. w ISAP |
| Prawo o postępowaniu przed sądami administracyjnymi | PPSA | weryfikuj aktualny t.j. w ISAP |
| Ustawa o skardze na naruszenie prawa strony do rozpoznania sprawy bez nieuzasadnionej zwłoki | ustawa o przewlekłości | weryfikuj aktualny t.j. w ISAP |
| Ustawa o kosztach sądowych w sprawach cywilnych | KSCU | Dz.U. 2025 poz. 1228 t.j. |
| Regulamin urzędowania sądów powszechnych | rozporządzenie MS | weryfikuj aktualny t.j. w ISAP |

---

## 2. INTAKE

Ustal obowiązkowo:

1. typ sprawy i tryb (cywilny, karny, administracyjny, dyscyplinarny, pracowniczy);
2. organ/sąd właściwy i jego szczebel;
3. daty zdarzeń, decyzji, doręczeń i terminów;
4. stan prawny na dzień zdarzenia, decyzji i wniesienia środka;
5. interes prawny i legitymację;
6. rozstrzygnięcie zaskarżane lub czynność kwestionowaną;
7. dowody podstawowe i brakujące;
8. możliwe równoległe tryby (cywilny, karny, administracyjny, dyscyplinarny, pracowniczy).

---

## 3. PROCEDURA

### Struktura sądownictwa — mapa

```
SĄDY POWSZECHNE (cywilne, karne, rodzinne, pracy, gospodarcze):
  Sąd Rejonowy → I instancja (co do zasady)
    ↓ apelacja
  Sąd Okręgowy → II instancja lub I instancja (WPS > 100 000 zł; sprawy niemajątkowe)
    ↓ apelacja
  Sąd Apelacyjny → II instancja od SO
    ↓ kasacja (przymus adwokacki)
  Sąd Najwyższy

SĄDY ADMINISTRACYJNE:
  Wojewódzki Sąd Administracyjny — WSA → I instancja
    ↓ skarga kasacyjna (przymus adwokacki/radcowski)
  Naczelny Sąd Administracyjny — NSA → II instancja

TRYBUNAŁY:
  Trybunał Konstytucyjny → kontrola konstytucyjności (→ mod-Konstytucja-TK)
  Trybunał Stanu → odpowiedzialność konstytucyjna
```

### Właściwy tor postępowania — kwalifikator

| Problem | Właściwy tor |
|---|---|
| Błąd w orzeczeniu | Środek zaskarżenia (apelacja, zażalenie, sprzeciw, kasacja) |
| Przewlekłość postępowania | Skarga na przewlekłość → sąd przełożony |
| Brak bezstronności sędziego | Wniosek o wyłączenie sędziego |
| Organizacja pracy sądu | Skarga administracyjna do prezesa sądu |
| Zachowanie osoby wykonującej zawód | Tryb dyscyplinarny — dla sędziów/asesorów: Sąd Dyscyplinarny przy Sądzie Apelacyjnym (art. 110 USP) → SN Izba Odpowiedzialności Zawodowej; bazy orzeczeń i zastrzeżenia co do jawności: `dr-12` → `mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow.md`, sekcja "Orzecznictwo dyscyplinarne — instancje i bazy" |
| Naruszenie prawa do sądu | Zarzut konstytucyjny (art. 45 Konstytucji → mod-TK) |

### Warunki skuteczności pisma
Sprawdź: właściwość organu/sądu, legitymację, termin, formę, opłatę, podpis, załączniki, pełnomocnictwo, odpisy, tryb doręczenia, żądanie, podstawę faktyczną, podstawę prawną, dowody.

---

## 4. WYŁĄCZENIE SĘDZIEGO

> ⚠️ Aktualne przepisy KPC/KPK/PPSA — weryfikuj w ISAP przed każdą sprawą.

### Iudex inhabilis / Iudex suspectus — wyłączenie sędziego

⚠️ TREŚĆ SCALONA 2026-06-12 — pełna systematyka (6 przesłanek art. 48 KPC
z mocy ustawy + art. 49 KPC na wniosek + KRYTYCZNY alert: wyroki TK P 10/19 (2022, art.49) i P 7/23 (2025, art.48) ws. neoKRS
z 23.02.2022 ws. neoKRS jako podstawy wyłączenia, oraz napięcie z linią
ETPCz) jest teraz w jednym miejscu — wcześniej ten moduł miał WŁASNY,
KRÓTSZY opis BEZ wzmianki o P 10/19/P 7/23:
→ `view /mnt/skills/user/shared/definicje/DEF-INTERES-WLASNY-WYLACZENIA.md`
  (sekcja 2 — wyłączenie sędziego/biegłego)

Odpowiedniki w innych procedurach (weryfikuj aktualne art. w ISAP):
  KPK: art. 40 (inhabilis) / art. 41 (suspectus)
  PPSA: art. 18 (inhabilis) / art. 19 (suspectus)
  → ta sama logika co KPC art. 48-49, inna numeracja

### Procedura wyłączenia

```
Wniosek o wyłączenie → złóż na piśmie do sądu rozpoznającego sprawę
  (wskazać sędziego, okoliczność uzasadniającą, dowody)
  ↓
Sędzia składa oświadczenie czy zachodzą przesłanki wyłączenia
  ↓
Rozstrzygnięcie przez sąd w składzie bez wyłączonego sędziego
  ↓ oddalenie wniosku STRONY → zażalenie (termin: weryfikuj w aktualnym
    KPC/KPK/PPSA w ISAP) — ADRESAT zależy od instancji, w której zapadło
    postanowienie (patrz niżej); NIE zakładaj domyślnie sądu wyższej instancji
```

⚠️ **Adresat zażalenia na oddalenie wniosku o wyłączenie (dodane w audycie
2026-07-25 — poprzednia wersja tej procedury nie wskazywała adresata wcale,
co przy sprawach neosędziowskich jest informacją strategiczną, nie tylko
techniczną):**

| Kto oddalił wniosek | Adresat zażalenia | Podstawa |
|---|---|---|
| Sąd I instancji, oddalenie wniosku **strony** o wyłączenie sędziego tego sądu | **Zażalenie poziome** — do innego składu **tego samego** sądu I instancji | art. 394¹ᵃ §1 pkt 10 KPC |
| Sąd II instancji, oddalenie wniosku **strony** o wyłączenie sędziego tego sądu (np. w toku apelacji) | **Zażalenie poziome** — do innego składu **tego samego** sądu II instancji | art. 394² §1 KPC |
| Oddalenie żądania wyłączenia zgłoszonego **przez samego sędziego** (autozgłoszenie, nie wniosek strony) | **Zażalenie NIE przysługuje** — postanowienie niezaskarżalne | uchwała SN III CZP 33/69, podtrzymana w późniejszym orzecznictwie |

Praktyczna konsekwencja dla spraw o wyłączenie neosędziego: odmowa wyłączenia
w typowym przypadku trafia do **innego składu tego samego sądu**, a nie
automatycznie „wyżej" — jeśli cały sąd ma podobny problem obsady, sam fakt
złożenia zażalenia nie gwarantuje kontroli przez inny, niezależny organ.
Przy formułowaniu strategii procesowej informuj o tym wprost, zamiast
milcząco zakładać dewolutywność środka. Podstawy KPK/PPSA (art. 40/41 KPK,
art. 18/19 PPSA) mają odrębną, własną systematykę zaskarżalności — weryfikuj
odrębnie, nie kopiuj wprost schematu KPC.

---

## 5. SKARGA NA PRZEWLEKŁOŚĆ

> **Podstawa:** Ustawa o skardze na naruszenie prawa strony do rozpoznania sprawy bez nieuzasadnionej zwłoki — weryfikuj aktualny t.j. w ISAP.

### Warunki i przebieg

| Element | Opis |
|---|---|
| Postępowanie | Cywilne, karne, sądowoadministracyjne |
| Uprawniony | Strona, uczestnik, pokrzywdzony (w sprawach karnych) |
| Właściwy sąd | Sąd przełożony nad sądem prowadzącym sprawę |
| Opłata | Weryfikuj aktualną kwotę w ustawie w ISAP |
| Żądania | Stwierdzenie przewlekłości + zalecenie podjęcia czynności + suma pieniężna (100–20 000 zł) |
| Minimalna suma | 2 000 zł za każdy rok przewlekłości (weryfikuj aktualną kwotę w ISAP) |

```
Skarga na przewlekłość → sąd przełożony
  ↓ [rozpoznanie bez zbędnej zwłoki]
  Uwzględnienie → stwierdzenie przewlekłości + zalecenie + suma pieniężna
  Oddalenie → zażalenie (termin: weryfikuj w ustawie w ISAP)
  ↓
Jeśli przewlekłość trwa → ponowna skarga
  (nie wcześniej niż po 12 miesiącach od poprzedniej — POTWIERDZONE
   2026-07-27, FAZA 3E/ZASADA 14, 7+ źródeł zgodnych, w tym sądy
   rejonowe i gazetaprawna.pl. ⚠️ UZUPEŁNIENIE: WYJĄTEK — w postępowaniu
   przygotowawczym z tymczasowym aresztowaniem oraz w sprawie
   egzekucyjnej/dot. wykonania orzeczenia — termin skrócony do 6
   MIESIĘCY, nie 12. Poprzednia wersja modułu pomijała ten wyjątek)
```

---

## 6. DOWODY

Każda teza musi mieć przypisany dowód. Obowiązkowa matryca:

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Przesłanka ustawowa | dokument / zeznanie / opinia | akta / organ / sąd | wysoka / średnia / niska | co nieudowodnione | uzupełnić / wnioskować / atakować |

### Typowe dowody w sprawach ustrojowych
- odpisy orzeczeń, postanowień, zarządzeń sądu;
- potwierdzenia doręczeń;
- protokoły rozpraw, nagrania posiedzeń;
- korespondencja z sądem, pisma procesowe z potwierdzeniami złożenia;
- dokumentacja dotycząca przewlekłości (zestawienie czynności z datami);
- dokumentacja wykazująca brak bezstronności (powiązania sędziego).

### Biegli i opinie
Jeżeli sprawa zawiera element specjalistyczny: sprawdź zakres tezy dowodowej, kwalifikacje biegłego, kompletność dokumentacji, metodologię, odpowiedź na pytania sądu, możliwość opinii uzupełniającej.

---

## 7. STRATEGIA

Zawsze wygeneruj:

1. najkorzystniejszą konstrukcję wniosku/środka;
2. argument podstawowy;
3. argument ewentualny;
4. najsilniejszy kontrargument organu/sądu/przeciwnika;
5. odpowiedź na kontrargument;
6. ryzyka formalne;
7. ryzyka dowodowe;
8. ryzyka kosztowe;
9. rekomendowane następne pismo.

---

## 8. ORZECZNICTWO

Nie twórz fikcyjnych sygnatur. Orzecznictwo pobieraj z oficjalnych baz. Dla każdego orzeczenia wskaż: sąd, datę, sygnaturę, tezę użyteczną, relację do stanu faktycznego, aktualność linii orzeczniczej, czy argument jest główny, pomocniczy lub ryzykowny.

```
web_search: "wyłączenie sędziego iudex inhabilis suspectus orzecznictwo SN sn.pl"
web_search: "skarga na przewlekłość postępowania suma pieniężna orzecznictwo SN 2025 2026"
web_search: "prawo do sądu art 45 Konstytucja TK trybunal.gov.pl"
```

---

## 9. QUALITY GATE

Nie kończ analizy bez odpowiedzi na każde pytanie:

- [ ] Czy sprawdzono aktualność aktu w ISAP?
- [ ] Czy stan prawny jest właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Czy wskazano pełną podstawę prawną z Dz.U.?
- [ ] Czy brzmienie przepisu pochodzi z aktualnego źródła (ISAP / LEX / Legalis)?
- [ ] Czy każda przesłanka ma przypisany dowód?
- [ ] Czy istnieje termin i czy nie upłynął?
- [ ] Czy dobrano właściwy tryb i właściwy sąd?
- [ ] Czy wnioski są procesowo wykonalne?

---

## 10. OUTPUT

Wynik pracy modułu:

1. Stan faktyczny;
2. Stan prawny i źródła (z Dz.U. zweryfikowanymi w ISAP);
3. Kwalifikacja trybu i właściwość sądu;
4. Terminy (obliczone, z datami granicznymi);
5. Przesłanki (spełnione / niespełnione / wątpliwe);
6. Matryca dowodowa;
7. Zarzuty i kontrargumenty;
8. Analiza ryzyk;
9. Strategia (wariant podstawowy + ewentualny);
10. Rekomendowana czynność procesowa + kolejne kroki;
11. Kontrola ISAP/temporalności.

---

## ŹRÓDŁA ONLINE

- PUSP: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000334
- Ustawa o SN: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000622
- SN: https://www.sn.pl
- NSA: https://orzeczenia.nsa.gov.pl
- Sądy powszechne: https://orzeczenia.ms.gov.pl
