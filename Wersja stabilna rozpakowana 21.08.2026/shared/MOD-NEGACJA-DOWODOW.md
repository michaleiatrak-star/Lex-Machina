# MOD-NEGACJA-DOWODOW — Siła dowodów, techniki negacji i odporność pisma

> **Wersja:** 1.1.0 | **Status:** PRODUKCJA — plik kanoniczny shared/
> **Wywoływany z:**
>   - `analizator-dowodow-v3` SKILL.md §BLOK-NEGACJA (auto-trigger: zawsze przy ≥1 dowodzie)
>   - `analizator-dowodow-v3` modules/MP4-moc-slabosci.md §4.3 (perspektywa przeciwnika)
>   - `pisma-procesowe-v3` W1.2d-PRE (przed W2 — analiza podatności)
>   - `pisma-procesowe-v3` W2.4 MOD-ATAK (typ ataku N1-N12 + riposta minimalna)
>   - `shared/MOD-ATAK-NA-SWIADKA.md` (pointer zwrotny — szczegółowe techniki)
>
> **Źródła (zweryfikowane online 2026-06-24):**
>   - Art. 6 KC, art. 229-234 KPC, art. 233 §2 KPC (Dz.U. 2026 poz. 468 t.j.)
>   - Art. 278-291 KPC (biegły sądowy, opinia uzupełniająca art. 286 KPC)
>   - Doktryna: Komentarz do art. 227-315 KPC (Profinfo 2024 — tzlaw.pl);
>     Sechman 2023-2024; Wolters Kluwer art. 271¹ KPC (2024)
>   - Orzecznictwo: weryfikowane w źródłach wymienionych w §WERYFIKACJA
>   - Porównawcze: probatio diabolica (CC fr. art. 1353); FRCP 37(e) spoliation;
>     impeachment (MacCarthy on Impeachment; FRE 607-609; Proskauer 2024)
>
> ⛔ HARD GATE: normy prawne i sygnatury podane w tym module — weryfikuj
> w ISAP i orzeczenia.ms.gov.pl przed powołaniem w piśmie procesowym.
> Moduł podaje artykuły jako punkty startowe, NIE jako gotowe cytaty.

---

## §WERYFIKACJA — STATUS SYGNATUR ORZECZNICZYCH (naprawia WARN-13)

```
PROCEDURA PRZED POWOŁANIEM SYGNATURY W PIŚMIE:
  1. Otwórz orzeczenia.ms.gov.pl lub sn.pl lub nsa.gov.pl
  2. Wpisz sygnaturę dokładnie jak podana
  3. Sprawdź: (a) czy wyrok istnieje, (b) czy teza odpowiada kontekstowi,
     (c) czy nie ma późniejszej uchwały SN zmieniającej linię
  4. Tylko po weryfikacji → użyj w piśmie

SYGNATURY CYTOWANE W TYM MODULE (status punktów startowych):
  IV CSK 669/15  → dot. art. 230 KPC, milczące przyznanie — weryfikuj sn.pl
  I BP 6/14      → dot. art. 6 KC i art. 229-230 KPC — weryfikuj sn.pl
  II CSK 621/13  → dot. art. 230 KPC, bierność pozwanego — weryfikuj sn.pl
  II PK 173/10   → dot. art. 233 §2 KPC i ciężaru dowodu — weryfikuj sn.pl
  II CKN 410/00  → dot. art. 231 KPC, domniemanie faktyczne — weryfikuj sn.pl
  IV CSK 486/11  → dot. art. 231 KPC — weryfikuj sn.pl
  SA Kat I ACa 677/14 → ogólnikowe zaprzeczenie — weryfikuj orzeczenia.ms.gov.pl
  SA Szcz VIII Ga 147/15 → art. 233 §2 KPC, odmowa — weryfikuj orzeczenia.ms.gov.pl
  SA W-wa V ACa 690/19   → kopia dokumentu, art. 129 §1 — weryfikuj orzeczenia.ms.gov.pl

Nowe sygnatury (sesja 2026-06-24c, źródło online):
  SN I CR 140/69  → def. opinii biegłego — weryfikuj sn.pl (historyczne)
  SA Gd. V ACa nieznana → opinia biegłego, wnioski o oddalenie — weryfikuj
  SN I UK 235/11  → biegły, opinia zastępcza — weryfikuj sn.pl
  SN IV CSK 275/14 → biegły, art. 286 KPC — weryfikuj sn.pl

⛔ ZASADA: sygnatura bez weryfikacji = [NIEWERYFIKOWANE] w piśmie.
  Nie podawaj sygnatury "z pamięci modelu" — każda wymaga sprawdzenia online.
```

---

## CZĘŚĆ I — CIĘŻAR DOWODU PER ROSZCZENIE (BLOK N1)

### N1.1 — Zasada podstawowa (art. 6 KC + art. 232 KPC)

```
REGUŁA GENERALNA:
  Ciężar udowodnienia faktu spoczywa na tym, kto z faktu tego wywodzi
  skutki prawne (art. 6 KC). Procesowy odpowiednik: art. 232 KPC
  (strony wskazują dowody dla faktów, z których wywodzą skutki prawne).

ROZKŁAD STANDARDOWY:
  Powód → udowadnia: istnienie roszczenia, jego podstawę, wysokość
  Pozwany → udowadnia: fakty niweczące lub tamujące roszczenie
            (wykonanie, przedawnienie, potrącenie, nieważność)

UWAGA: "Nie jest prawdą, że ciężar dowodu spoczywa bez wyjątku na powodzie"
       — tak SA w orzeczeniu legeartis 2021/10. Pozwany ma własny ciężar
       co do faktów niweczących, które podnosi.

SKUTEK NIEUDOWODNIENIA:
  Strona obarczona ciężarem, która nie udowodni faktu, ponosi
  negatywne konsekwencje procesowe (oddalenie roszczenia lub zarzutu).
```

### N1.2 — Dziedziny z ODWRÓCONYM ciężarem dowodu

```
⚠️ WERYFIKUJ ISAP przed powołaniem — lista poglądowa, nie wyczerpująca.

[OD-1] MOBBING (art. 94³ KP):
  Pracownik → uprawdopodabnia mobbing (nie musi udowodnić w pełni)
  Pracodawca → ciężar obalenia: wykaże, że zachowań nie było lub
               miały inny charakter
  Linia SN: II PK 173/10 (weryfikuj aktualność)

[OD-2] DYSKRYMINACJA PRACOWNICZA (art. 18³b KP):
  Pracownik → uprawdopodabnia dyskryminację
  Pracodawca → ciężar obalenia: wykaże obiektywne kryterium różnicowania

[OD-3] ZWOLNIENIE DYSCYPLINARNE (art. 52 KP):
  Pracodawca → udowadnia winę pracownika i jej stopień
  Pracownik → kwestionuje faktyczną podstawę

[OD-4] PRZYCZYNA WYPOWIEDZENIA (art. 45 KP):
  Pracodawca → wykazuje prawdziwość i konkretność przyczyny
  (SN: przyczyna musi być rzeczywista i konkretna)

[OD-5] WYPADEK PRZY PRACY — domniemanie związku (art. 231 KPC):
  Jeśli wypadek nastąpił w czasie i miejscu pracy → domniemanie faktyczne
  związku ze stosunkiem pracy (wymaga obalenia przez pracodawcę)

[OD-6] PROBATIO DIABOLICA — twierdzenie negatywne (doktryna):
  Gdy strona musi udowodnić fakt negatywny (że coś NIE istniało /
  NIE nastąpiło), sąd może: (a) zastosować domniemanie faktyczne
  (art. 231 KPC) na podstawie faktów pozytywnych; lub (b) przerzucić
  ciężar na drugą stronę, by wykazała fakt pozytywny.
  → Reguła: "impossibilium nulla est obligatio" — nie można wymagać
    dowodu absolutnie niemożliwego do przeprowadzenia.
```

### N1.3 — Procedura CIĘŻAR per teza (dla każdej T-X)

```
Dla każdej tezy T-X z macierzy D×T wykonaj:

KR1: Kto wywodzi skutki z tego faktu?
     → ta strona ma ciężar dowodu (art. 6 KC)

KR2: Czy istnieje przepis szczególny odwracający ciężar?
     → sprawdź kategorie OD-1..OD-6; sprawdź w ISAP per dziedzina

KR3: Czy fakt jest negatywny (twierdzenie że czegoś NIE MA)?
     → jeśli TAK: może być probatio diabolica → rozważ art. 231 KPC
        (domniemanie faktyczne z faktów pozytywnych)

KR4: Co wystarczy do SPEŁNIENIA ciężaru dowodu przez nas?
     → skala: uprawdopodobnienie (mobbing/dysk.) / wykazanie na
        balance of probabilities (sprawy cywilne) / udowodnienie
        ponad wszelką wątpliwość (sprawy karne)

KR5: Co wystarczy przeciwnikowi do PRZERZUCENIA lub ZNIWECZENIA?
     → zob. BLOK N2 (odporność dowodu per klasa A-G)

Format wyjścia KR1-KR5:
  T-01: [opis tezy]
    KR1: Powód → ciężar na powodzie (wywodzi roszczenie z faktu X)
    KR2: Brak szczególnego przepisu odwracającego
    KR3: Fakt pozytywny (ciągłość numeracji) → brak probatio diabolica
    KR4: Dokument klasy B + zeznanie klasy D = balance of probabilities
    KR5: Przeciwnik potrzebuje dowodu klasy A lub G by podważyć klasa B
```

---

## CZĘŚĆ II — ODPORNOŚĆ DOWODU NA NEGACJĘ (BLOK N2)

### N2.1 — Macierz odporności per klasa źródłowa

```
Dla każdego dowodu D-NNN: jaka negacja wystarczy, by obniżyć jego siłę?

KLASA A (dokument urzędowy / rejestr publiczny):
  Siła startowa: 10/10
  Co wystarczy przeciwnikowi:
    → Samo zaprzeczenie: NIE — nie obniża siły
    → Twierdzenie o nieistnieniu: NIE — nie wystarczy
    → Wymagany dowód: klasy A lub G (ekspertyza) potwierdzający błąd
       lub fałszerstwo dokumentu urzędowego
  Jak odpowiedzieć na atak: powołaj na moc art. 244 KPC (dokumenty
    urzędowe korzystają z domniemania autentyczności i prawdziwości)

KLASA B (dokument prywatny / system wewnętrzny):
  Siła startowa: 8/10
  Co wystarczy przeciwnikowi:
    → Samo zaprzeczenie: NIE — obniża do 6/10 (kwestia sporna)
    → Żądanie oryginału (art. 129 §1 KPC): TAK — jeśli nie złożysz
       oryginału a dokument jest kwestionowany, sąd może odmówić mocy
    → Twierdzenie o przeróbce / fabrykowaniu: TAK jeśli poparte
       argumentem + wniosek o biegłego IT
    → Jak odpowiedzieć: złóż oryginał + powołaj na art. 245 KPC
       (dokument prywatny stanowi dowód że zawarte w nim oświadczenie
       złożyła podpisana osoba) + triangulacja z klasą A lub D

KLASA C (korespondencja / zrzut ekranu):
  Siła startowa: 7/10
  Co wystarczy przeciwnikowi:
    → Samo zaprzeczenie + wniosek o metadane: TAK — obniża do 4/10
    → Twierdzenie że screenshot jest montażem: TAK jeśli brak metadanych
    → Jak odpowiedzieć: dostarcz metadane techniczne (EXIF, nagłówki
       SMTP, hash wiadomości) + MOD-PROWENIENCJA [KOM] triangulacja
       z innymi wiadomościami z tego samego kanału

KLASA D (świadek bezpośredni):
  Siła startowa: 7/10
  Co wystarczy przeciwnikowi:
    → Samo zaprzeczenie bez kontrargumentu: NIE
    → Wykazanie motywu stronniczości [LOJ-001]: TAK — obniża do 4/10
    → Zeznanie innego świadka przeczącego: TAK — rodzi sprzeczność
       (sąd musi rozstrzygnąć wiarygodność)
    → Jak odpowiedzieć: triangulacja z klasą A/B;
       przesłuchanie-swiadkow-v2 (pytania eliminujące stronniczość)

KLASA E (świadek pośredni / hearsay):
  Siła startowa: 3/10
  Co wystarczy przeciwnikowi:
    → Samo wskazanie pośredniego charakteru zeznania: TAK — redukuje
       do 1/10 bez corroboration
    → Jak odpowiedzieć: użyj jako wskazówki, nie jako dowód główny;
       wnioskuj o dowód bezpośredni

KLASA F (zeznanie strony):
  Siła startowa: 4-6/10
  Co wystarczy przeciwnikowi:
    → Samo zaprzeczenie strony przeciwnej: TAK — rodzi sprzeczność
       zeznań stron; sąd ocenia swobodnie (art. 233 §1 KPC)
    → Jak odpowiedzieć: corroboration klasą A/B/D;
       art. 299 KPC (przesłuchanie strony subsidiarne — nie zastępuje
       dowodów, lecz uzupełnia niewyjaśnione fakty)

KLASA G (ekspertyza biegłego):
  Siła startowa: 10/10
  Co wystarczy przeciwnikowi:
    → Samo zaprzeczenie: NIE
    → Atak na metodologię (sprzeczność wewnętrzna, błędne założenia):
       TAK — może uzasadniać dopuszczenie innego biegłego
    → Drugi biegły o odmiennym wniosku: TAK — rodzi konieczność
       rozstrzygnięcia przez sąd
    → Jak odpowiedzieć: broniąc ekspertyzy podnieś zarzut metodologiczny
       (nie własną wiedzę specjalną); ew. wniosek o uzupełnienie opinii
```

### N2.2 — Zasada "ogólnikowe zaprzeczenie jest bezskuteczne"

```
REGUŁA (linia orzecznicza, weryfikuj sygnatury ISAP):
  "Jako zaprzeczenie twierdzeniom strony przeciwnej o faktach nie może
   być traktowane ogólnikowe zaprzeczenie wszelkim okolicznościom
   podanym przez stronę przeciwną — skuteczne zaprzeczenie wymaga
   wyraźnego wskazania, z którymi faktami strona się nie zgadza."
  → SA Katowice I ACa 677/14; SAOS IX GC 292/20

KONSEKWENCJA DLA PISMA:
  Gdy przeciwnik zastosował ogólnikowe zaprzeczenie ("zaprzeczamy
  wszelkim twierdzeniom powoda") → podnieś w piśmie:
  "Pozwana ograniczyła się do ogólnikowego zaprzeczenia, co w świetle
   ugruntowanej linii orzeczniczej (art. 210 §2 KPC) jest procesowo
   nieskuteczne. Nie wskazała, którym konkretnie twierdzeniom i faktom
   zaprzecza oraz jakie własne fakty im przeciwstawia."
  → Wniosek: fakty przez nią niezakwestionowane mogą być traktowane
    przez sąd jako przyznane (art. 230 KPC).
```

---

## CZĘŚĆ III — TAKSONOMIA 12 TECHNIK NEGACJI (BLOK N3)

Katalog technik stosowanych przez przeciwnika, z analizą siły, wymaganą ripostą i normą prawną.

### [N1] GOŁOSŁOWNE ZAPRZECZENIE

```
Opis: Przeciwnik zaprzecza twierdzeniu bez podania własnych faktów
      lub dowodów. Klasyczne "Pozwana zaprzecza".
Sygnał: brak własnej wersji zdarzenia, brak wniosków dowodowych.
Siła wobec kl. A: 0/10 | kl. B: 2/10 | kl. C: 3/10 | kl. D/F: 5/10
Podstawa prawna: art. 210 §2 KPC (obowiązek wyszczególnienia faktów)
Riposta minimalna:
  "Pozwana nie wskazała żadnych faktów ani dowodów podważających
   twierdzenie o [X]. Samo zaprzeczenie, bez własnej wersji zdarzeń,
   jest procesowo nieskuteczne (art. 210 §2 KPC w zw. z art. 232 KPC).
   Fakty wykazane dowodem [D-NNN / opis] pozostają niepodważone."
Riposta wzmocniona (gdy kl. A/B):
  Powołaj normę art. 244 KPC (dok. urzędowy) lub art. 245 KPC (dok.
  prywatny) + wskaż, że obalenie wymagałoby dowodu klasy A lub G.
```

### [N2] TWIERDZENIE O NIEISTNIENIU FAKTU POZYTYWNEGO

```
Opis: Przeciwnik twierdzi, że zdarzenie nie miało miejsca ("nigdy nie
      było premii / umowy / rozmowy"). Fakt negatywny po jego stronie.
Sygnał: słowo "nigdy", "nie było", "nie istniało", "nie miało miejsca".
Siła: 4/10 gdy brak dowodów, 2/10 gdy mamy kl. B+, 7/10 gdy tylko kl. F.
Podstawa prawna: art. 6 KC (ciężar na twierdzącym fakt pozytywny po
                 naszej stronie) + art. 231 KPC (domniemanie faktyczne)
Riposta minimalna:
  "Fakt [X] jest wykazany dowodem [D-NNN] (klasa [A/B/C/D]).
   Twierdzenie pozwanej o nieistnieniu [X] stanowi twierdzenie negatywne,
   które — w świetle art. 6 KC — nie zwalnia jej z obowiązku wskazania
   faktów i dowodów pozytywnych, z których mogłoby wynikać,
   że [X] nie nastąpiło."
Riposta wzmocniona (probatio diabolica):
  Gdy nasz fakt jest trudno udowodnić bezpośrednio → zastosuj art. 231
  KPC: "Z faktów F-101, F-102, F-103 (wykazanych dowodem D-001)
  wyprowadzić można domniemanie faktyczne, że [X] miało miejsce —
  albowiem [łańcuch logiczny]. Przeciwnik nie obalił tego rozumowania."
```

### [N3] TWIERDZENIE O NIEISTNIENIU ELEMENTU PRAWNEGO

```
Opis: Przeciwnik twierdzi, że roszczenie / stosunek prawny / obowiązek
      nie istnieje w sensie prawnym ("brak stosunku pracy", "brak
      praktyki zakładowej", "premia nie była elementem wynagrodzenia").
Sygnał: odwołanie do kwalifikacji prawnej zamiast do faktów.
Rozróżnienie (kluczowe):
  → Twierdzenie o faktach (N2): "premii nie było" → ciężar na twierdzącym
  → Twierdzenie o kwalifikacji prawnej (N3): "premia nie była wynagrodzeniem"
    → kwestia wykładni, nie faktów → argumentacja prawna, nie dowód
Riposta dla N3:
  "Strona pozwana kwestionuje kwalifikację prawną, nie fakty. Fakt
   wypłacania świadczenia jest wykazany [D-NNN]. Kwestia jego
   kwalifikacji (art. [X] KP / KC) należy do oceny sądu, który
   nie jest związany kwalifikacją stron."
  + Powołaj normę i linię SN potwierdzającą właściwą kwalifikację
    (⚠️ HARDGATE: weryfikuj ISAP i orzecznictwo przed powołaniem).
```

### [N4] OGÓLNIKOWE ZAPRZECZENIE "WSZYSTKIEMU"

```
Opis: Formułka "z ostrożności procesowej zaprzeczam wszystkim
      twierdzeniom powoda, których wyraźnie nie przyznaję". Taktyka
      zabezpieczająca strony pozwanej przed art. 230 KPC.
Sygnał: formuła "z ostrożności procesowej" + brak konkretyzacji.
Siła: 3/10 — procesowo skuteczniejsza od N1, ale nadal słaba.
Podstawa prawna: art. 210 §2 KPC + art. 127 §1 KPC (obowiązek
                 wyszczególnienia zaprzeczanych faktów)
Riposta:
  "Pozwana zastosowała formułę ogólnego zaprzeczenia. Nie wskazała
   jednak, którym konkretnym twierdzeniom i faktom zaprzecza
   (art. 210 §2 i art. 127 §1 KPC). Sąd Apelacyjny w [SA Katowice
   I ACa 677/14 — weryfikuj] wskazał, że takie ogólne zaprzeczenie
   jest procesowo nieskuteczne. Wobec braku konkretyzacji zaprzeczenia,
   twierdzenia powoda co do [lista kluczowych faktów] pozostają
   niezaprzeczone."
```

### [N5] ATAK NA AUTENTYCZNOŚĆ DOKUMENTU

```
Opis: Przeciwnik kwestionuje, że dokument jest oryginalny / autentyczny /
      pochodzi od wskazanego autora.
Sygnał: "kopia bez poświadczenia", "nie wiemy czy to oryginał",
         "metadane mogły być zmienione", "podpis nieautentyczny".
Siła wobec kl. B: 5/10 (jeśli nie złożono oryginału) | kl. C: 6/10
Podstawa prawna: art. 129 §1 KPC (strona może żądać oryginału);
                 art. 233 §1 KPC (sąd ocenia moc dowodową kopii)
Riposta minimalna:
  1. Złóż oryginał (jeśli jeszcze nie) — art. 129 §1 KPC.
  2. Jeśli kopia: "SA w Warszawie V ACa 690/19 — weryfikuj —
     wskazał, że kopia dokumentu stanowi dowód, jeśli jej treść
     nie była kwestionowana. Pozwana nie żądała oryginału w terminie."
  3. MOD-PROWENIENCJA [AUT]: powołaj metadane / fingerprint lingwistyczny.
  4. Jeśli kwestionowanie persystuje: wniosek o biegłego IT / grafologa
     (art. 278 KPC) — RYZYKO: może działać w obie strony.
Riposta wzmocniona:
  Triangulacja P+: "Autentyczność potwierdza zbieżność z D-NNN i D-NNN
  (te same kody systemowe / ciągła numeracja / zgodność chronologiczna)
  — MOD-PROWENIENCJA klaster [SYS/KOM]."
```

### [N6] ODMOWA PRZEDŁOŻENIA DOKUMENTU (art. 233 §2 KPC)

```
Opis: Przeciwnik ma dokument, który by mu zaszkodził, i odmawia jego
      złożenia mimo zobowiązania sądu lub wniosku.
Sygnał: brak odpowiedzi na zobowiązanie do złożenia dokumentu;
         twierdzenia, że dokument "nie istnieje" lub jest "objęty tajemnicą".
Siła jako broni ofensywnej: 9/10 — jedno z najsilniejszych narzędzi.
Podstawa prawna: art. 233 §2 KPC ("sąd oceni znaczenie odmowy
                 przedstawienia dowodu") + art. 248 KPC (zobowiązanie)
Jak to wykorzystać (AKTYWNIE):
  KROK 1: Złóż wniosek o zobowiązanie pozwanego do złożenia [dok.
          konkretny] na podstawie art. 248 KPC, wskazując:
          (a) że dokument istnieje i jest w posiadaniu pozwanego;
          (b) fakt, który ma wykazać;
          (c) dlaczego sam nie możesz go uzyskać.
  KROK 2: Gdy pozwany nie złoży → w piśmie podnieś:
          "Pozwana nie wykonała zobowiązania sądu do złożenia [dok.].
           W świetle art. 233 §2 KPC sąd oceni znaczenie tej odmowy
           na niekorzyść odmawiającej strony. Odmowa uzasadnia
           wniosek, że dokument potwierdzałby twierdzenia powoda
           o [fakt X] — albowiem inaczej pozwana nie miałaby motywu
           do ukrywania go." [Powołaj: SA Szczecin VIII Ga 147/15 — weryfikuj]
  KROK 3: Wnioskuj o zastosowanie art. 233 §2 KPC explicite.
Jak odpowiedzieć gdy stosują wobec nas:
  Złóż dokument ALBO wyjaśnij powód niemożności (tajemnica zawodowa,
  posiadanie przez osobę trzecią — art. 248 §2 KPC).
  Nigdy nie ignoruj zobowiązania sądu bez uzasadnienia.
```

### [N7] ZARZUT BRAKU FORMY / WADLIWOŚCI FORMALNEJ

```
Opis: Przeciwnik podnosi, że dowód nie spełnia wymogów formalnych
      (brak podpisu, brak poświadczenia, nieczytelna kopia, brak daty).
Sygnał: "dokument nie spełnia wymogów art. X", "kopia niepoświadczona",
         "brak podpisu strony", "wydruk komputerowy bez podpisu".
Siła: 4/10 przy kopii kl. B; 7/10 gdy chodzi o pismo urzędowe.
Podstawa prawna: art. 245 KPC (dokument prywatny), art. 244 KPC (urzędowy)
Riposta:
  1. Dla kopii: "SA w Warszawie V ACa 690/19 — weryfikuj — potwierdził,
     że kopia dokumentu ma moc dowodową jeśli jej treść nie była
     kwestionowana i nie złożono wniosku o przedłożenie oryginału."
  2. Dla braku podpisu: "art. 245 KPC nie wymaga podpisu pod rygorem
     nieważności jako dokument prywatny — stanowi dowód złożenia
     oświadczenia (SN II CKN 1409/00 — weryfikuj)."
  3. Dla wydruku: "Wydruk z systemu HR korzysta z mocy dowodowej
     dokumentu prywatnego (art. 245 KPC) — jego treść nie była
     kwestionowana, a tylko autentyczność."
  Jeśli zarzut zasadny: uzupełnij braki formalne niezwłocznie.
```

### [N8] ATAK NA WIARYGODNOŚĆ ŚWIADKA

```
Opis: Kwestionowanie nie treści zeznań, lecz osoby świadka
      (stronniczość, interes, relacja z powodem, niespójność wewnętrzna).
Sygnał: "świadek ma interes w rozstrzygnięciu", "relacja z powodem",
         "zeznania wewnętrznie sprzeczne", "sprzeczność z zeznaniami X".
Siła: 6/10 przy świadku kl. D; 8/10 przy świadku zależnym służbowo.

⛔ PEŁNA TAKSONOMIA 9 TECHNIK ATAKU NA ŚWIADKA (TA-1..TA-9) + 9 METOD
   ATAKU NA BIEGŁEGO (B1-B9) + PROCEDURA OBRONY (AC1-AC4):
   → view /mnt/skills/user/shared/MOD-ATAK-NA-SWIADKA.md

Skrót — najczęstsze techniki:
  TA-1 Sprzeczność z wcześniejszymi zeznaniami → 3 C's (Commit/Credit/Confront)
  TA-2 Motyw stronniczości / interes własny → zależność zawodowa, relacja
  TA-3 Atak na percepcję i zdolność obserwacji → warunki, czas, stres
  TA-4 Sprzeczność wewnętrzna zeznania → mały krok + konfrontacja
  B1  Atak na metodologię biegłego → art. 286 KPC, wniosek o uzupełnienie

Riposta minimalna (N8):
  1. Analiza lojalnościowa [LOJ-001] z MP6-sledczy §6.5:
     "Relacja świadka jest znana sądowi — zeznanie zgodne z dowodem D-NNN (kl. B)"
  2. Triangulacja: zeznanie potwierdzone klasą A/B niweluje atak TA-2
  3. MOD-PROWENIENCJA [ZAW]: "obaj świadkowie pozwanej: ten sam dział —
     ryzyko koordynacji [H-PROW] (art. 272 KPC — konfrontacja)"
  4. Ante-cross (AC2): neutralizuj motyw w direct zanim zrobi to przeciwnik

Riposta na B1-B9 (atak na biegłego):
  Wniosek art. 286 KPC: wskaż konkretną wadę + żądaj uzupełnienia / nowego biegłego
  Nie atakuj personalnie — atakuj metodologię (dr Zych tzlaw.pl 2025)
```

### [N9] ZARZUT PREKLUZJI DOWODOWEJ

```
Opis: Przeciwnik twierdzi, że dowód / twierdzenie jest spóźnione
      i powinno zostać pominięte (art. 235² KPC).
Sygnał: "twierdzenie spóźnione", "dowód powinien być złożony w pozwie",
         "wniosek dowodowy na etapie rozprawy jest spóźniony".
Siła: 8/10 — może być skuteczne; sądy stosują prekluzję rygorystycznie.
Riposta (przesłanki art. 235² §1 KPC):
  Jeden z trzech warunków zwalnia z prekluzji:
  (a) "Potrzeba powołania powstała później [opis — np. po ujawnieniu
      dokumentu przez pozwaną w odpowiedzi na pozew]"
  (b) "Powołanie we wcześniejszym piśmie nie było możliwe [opis]"
  (c) "Uwzględnienie nie spowoduje zwłoki w rozpoznaniu sprawy"
  ZAWSZE: podnieś który warunek zachodzi + uzasadnij.
  → shared/PREKLUZJA-DOWODOWA.md — pełny protokół.
```

### [N10] CHERRY-PICKING — SELEKTYWNE CYTOWANIE (MAN-05)

```
Opis: Przeciwnik cytuje fragment dokumentu lub zeznania z pominięciem
      kontekstu zmieniającego sens (technika MAN-05 z MP6-sledczy §6.8).
Sygnał: krótki cytat z dokumentu + pominięte zdania przed/po.
Siła: 6/10 — skuteczne gdy sąd nie czyta całości dokumentu.
Riposta:
  1. Zacytuj pełny kontekst: "[cytat przeciwnika] jest wyrwany
     z kontekstu. Pełne brzmienie tego fragmentu to: [cytat szerszy].
     Odczytany w całości, fragment potwierdza tezę [T-X], nie jej
     zaprzeczenie."
  2. Złóż wyróżnioną wersję dokumentu z zaznaczonym kontekstem.
  3. Zastosuj BLOK-PROWENIENCJA [LIN-5]: "ten sam autor w piśmie
     z [data] użył identycznego sformułowania w znaczeniu [Y]."
```

### [N11] ANTYCYPACJA ZARZUTU NIEISTNIENIA PRZEZ PRZECIWNIKA

```
Opis: Technika obronna — gdy wiemy, że przeciwnik będzie twierdził
      że elementu nie ma, uprzedzamy to w piśmie.
Kiedy stosować: gdy:
  (a) mamy dowód kl. C lub D (podatny na atak N1-N5)
  (b) element jest kluczowy dla roszczenia
  (c) wiemy lub przewidujemy zaprzeczenie
Technika "immunizacja twierdzenia":
  1. W piśmie POWOŁAJ fakt + dowód + PRZEWIDUJ zarzut + ODPOWIEDZ
     ZAWCZASU:
     "Pozwana może podnosić, że [X nie istniało]. Jednakże fakt [X]
      wykazuje [D-NNN] (klasa [A/B]). Ewentualne zaprzeczenie
      wymagałoby kontrdownodu klasy A lub ekspertyzy biegłego —
      których pozwana nie posiada, albowiem [uzasadnienie]."
  2. Zastosuj triangulację proweniencyjną P+: wskaż że fakt pochodzi
     z niezależnych źródeł potwierdzających wzajemnie.
  3. Powołaj domniemanie faktyczne (art. 231 KPC) jako drugi filar:
     "Nawet gdyby sąd uznał fakt [X] za niewykazany bezpośrednio,
      z faktów F-101, F-102, F-103 wyprowadzić można domniemanie
      faktyczne jego istnienia."
```

### [N12] TAKTYCZNE ZNISZCZENIE LUB UKRYCIE DOWODU (SPOLIATION)

```
Opis: Przeciwnik usuwa, modyfikuje lub "traci" dokument który by go
      obciążał. Ekwiwalent spoliation doctrine z prawa anglosaskiego.
Sygnał: brak dokumentów, które musiały istnieć; "nie przechowujemy";
         "system był aktualizowany"; "komputer się zepsuł"; odmowa
         dostępu do systemu IT mimo zobowiązania.
Siła jako broni ofensywnej: 9/10 — może generować niekorzystne
         domniemanie faktyczne (art. 231 KPC via art. 233 §2 KPC).
Jak to wykorzystać:
  KROK 1: Wykaż, że dokument MUSIAŁ ISTNIEĆ (na podstawie faktów
          pochodnych: skoro była umowa, musiała być dokumentacja;
          skoro były wypłaty, musiały być listy płac).
  KROK 2: Wykaż, że pozwany miał obowiązek przechowywać
          (art. 94 pkt 9b KP — akta osobowe; przepisy o archiwizacji).
  KROK 3: Powołaj art. 233 §2 KPC: "Odmowa/niemożność złożenia
          dokumentów, które musiały istnieć i co do których pozwana
          miała obowiązek archiwizacji, uzasadnia wyciągnięcie
          wniosku niekorzystnego dla pozwanej."
  KROK 4: Złóż wniosek o zobowiązanie do złożenia (art. 248 KPC)
          + wniosek o zabezpieczenie dowodów (art. 310 KPC).
  KROK 5: Złóż wniosek o biegłego IT — odzyskanie usuniętych danych.
Analog polskie prawo: art. 276 KPC (kary za utrudnianie postępowania);
                      art. 233 §2 KPC (ocena odmowy).
⚠️ HARDGATE: brak polskiego kodeksowego odpowiednika FRCP 37(e) adverse
   inference instruction — podstawa to art. 231 + 233 §2 KPC kombinacja.
   Weryfikuj aktualną linię SN w ISAP przed powołaniem.
```

---

## CZĘŚĆ IV — MILCZENIE JAKO PRZYZNANIE (BLOK N4)

### N4.1 — Mechanizm art. 229-230 KPC

```
ART. 229 KPC — PRZYZNANIE WYRAŹNE:
  "Nie wymagają dowodu fakty przyznane w toku postępowania przez stronę
   przeciwną, jeżeli przyznanie nie budzi wątpliwości."
  → Wyraźne "przyznaję że X" = fakt niewymagający dowodu (pseudo-dowód).

ART. 230 KPC — PRZYZNANIE MILCZĄCE:
  "Gdy strona nie wypowie się co do twierdzeń strony przeciwnej o faktach,
   sąd, mając na uwadze wyniki całej rozprawy, może fakty te uznać
   za przyznane."
  → Milczenie = potencjalne przyznanie (nie automatyczne — sąd ocenia).

WARUNKI MILCZĄCEGO PRZYZNANIA (linia orzecznicza — weryfikuj):
  (a) Strona miała możliwość wypowiedzenia się (art. 210 §2 KPC)
  (b) Nie wypowiedziała się co do konkretnego twierdzenia
  (c) Sąd ocenia z uwzględnieniem całości rozprawy
  (d) Brak oczywistego kontekstu odmowy (np. zasada ogólnego zaprzeczenia
      art. 4 nie znosi obowiązku z art. 210 §2)
  SN IV CSK 669/15: milczenie nie jest automatycznym przyznaniem —
  wymaga oceny całości materiału.
```

### N4.2 — Procedura wykrywania milczenia [PRZYZ-MIL]

```
Dla każdego KLUCZOWEGO twierdzenia faktycznego T-X z pisma:

KROK M1: Sprawdź czy pismo przeciwnika odnosi się do T-X wprost.
  → Jeśli TAK: nie jest PRZYZ-MIL (może być N1/N4 — gołosłowne
    zaprzeczenie lub ogólnikowe)
  → Jeśli NIE: przejdź do M2

KROK M2: Sprawdź czy twierdzenie T-X jest na liście "z ostrożności
          zaprzeczam wszystkiemu" (N4).
  → Jeśli TAK: ogólne zaprzeczenie jest nieskuteczne co do konkretnych
    faktów (art. 210 §2 KPC) — traktuj jako potencjalny PRZYZ-MIL
  → Jeśli NIE: PRZYZ-MIL pewny

KROK M3: Oceń wagę milczenia:
  Wysokie (PRZYZ-MIL-H): twierdzenie kluczowe dla roszczenia,
    pozwana miała wszystkie informacje, nie złożyła pism wyjaśniających
  Umiarkowane (PRZYZ-MIL-M): twierdzenie istotne, ale nie centralne
  Niskie (PRZYZ-MIL-L): twierdzenie poboczne

KROK M4: Formularz w piśmie (dla PRZYZ-MIL-H i M):
  "[Twierdzenie T-X] pozostaje niezaprzeczone. Strona pozwana
   w piśmie z [data] nie odniosła się do [konkretnego twierdzenia].
   W świetle art. 230 KPC sąd może uznać ten fakt za przyznany
   przy uwzględnieniu wyników całej rozprawy."

Rejestr PRZYZ-MIL (format dla dashboardu):
  [PRZYZ-MIL-001]
  Twierdzenie: F-102 (ciągłość numeracji pracowników)
  Pismo powoda: pozew §5
  Pismo pozwanej: odpowiedź na pozew — brak wzmianki
  Waga: WYSOKA
  Formularz: [gotowy — patrz M4]
```

---

## PROCEDURA ZINTEGROWANA: BLOK-NEGACJA (pipeline analizatora)

```
TRIGGER: ZAWSZE (przy ≥1 dowodzie i ≥1 tezie procesowej).
Nie wymaga aktywacji — automatyczny dla każdej sprawy.

KROK NG1 — MAPOWANIE CIĘŻARU (N1):
  Per każda teza T-X: KR1-KR5 (kto musi co udowodnić)

KROK NG2 — ODPORNOŚĆ DOWODÓW (N2):
  Per każdy dowód D-NNN: klasa A-G → co wystarczy do obalenia

KROK NG3 — PROGNOZA TECHNIK NEGACJI (N3):
  Na podstawie rodzaju sprawy i dowodów: które z N1-N12 zastosuje
  przeciwnik? Dla każdej przewidywanej techniki: RIPOSTA MINIMALNA

KROK NG4 — WYKRYWANIE MILCZENIA (N4):
  Per każde kluczowe twierdzenie faktyczne: PRZYZ-MIL?

KROK NG5 — OUTPUT:
  Raport BLOK-NEGACJA (do dashboardu + zakładka "Negacja"):
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RAPORT NEGACJI I ODPORNOŚCI
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CIĘŻAR DOWODU per teza:
    T-01: powód → klasa B+D wystarczy | przeciwnik potrzebuje A/G
    T-02: pracodawca (odwrócony) → uprawdopodobnienie wystarczy
  ODPORNOŚĆ DOWODÓW:
    D-001 (kl. B): samo zaprzeczenie → nieskuteczne | ryzyko: N5 (atak
           na autentyczność) → zabezpieczenie: oryginał + triangulacja
    D-007 (kl. C): ryzyko N5 (brak metadanych) → priorytet: dostarczyć
           nagłówki SMTP + triangulacja P+ z D-001
  PROGNOZA TECHNIK NEGACJI:
    [N1] gołosłowne → riposta: art. 210 §2 + art. 245 KPC
    [N4] ogólnikowe → riposta: wykazanie konkretnych faktów bez zaprzeczenia
    [N6] odmowa dokumentów → ofensywa: art. 248 + 233 §2 KPC
  MILCZENIE PRZECIWNIKA [PRZYZ-MIL]:
    PRZYZ-MIL-H: F-102 (numeracja) — pozwana nie zaprzeczyła
    PRZYZ-MIL-M: F-301 (data wiadomości RCS) — brak wzmianki
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KROK NG6 — INTEGRACJA:
  → Fakty [PRZYZ-MIL-H]: sekcja "Fakty bezsporne" pisma (art. 229-230)
  → Techniki N1-N12 z ripostą → RAPORT D §D2 (siła ataku + riposta)
  → Dowody podatne na N5/N6 → priorytet w BLOK-PROWENIENCJA P!
  → Teza z OD (odwrócony ciężar) → BLOK-KONSEKWENCJE C-X.2 (strategiczne)
```

---

## SELF-CHECK

```
□ N1: każda teza T-X ma przypisanego "właściciela ciężaru" + KR1-KR5?
□ N1: sprawdzono czy istnieje przepis odwracający ciężar (OD-1..OD-6)?
□ N2: każdy dowód D-NNN ma ocenę "co wystarczy do obalenia" per klasa?
□ N3: zidentyfikowano ≥1 przewidywaną technikę negacji (N1-N12)?
□ N3: każda przewidywana technika ma RIPOSTĘ MINIMALNĄ w piśmie?
□ N4: każde kluczowe twierdzenie sprawdzone pod [PRZYZ-MIL]?
□ N4: faktyczni milczący [PRZYZ-MIL-H/M] powołani w piśmie (art. 230)?
□ NG5: raport negacji wygenerowany i dostępny w dashboardzie?
Którykolwiek = NIE → wróć do brakującego kroku.
```

---

## HISTORIA ZMIAN

```
1.0.0 (2026-06-24) — Pierwsza wersja.
Źródła: art. 6 KC, art. 229-234 KPC, art. 233 §2 KPC (Dz.U. 2026 poz. 468).
Linia orzecznicza: SN IV CSK 669/15; I BP 6/14; II CSK 621/13; SA Katowice
I ACa 677/14; SAOS IX GC 292/20; SA Lublin I ACa 206/20.
Porównawcze: probatio diabolica (CC fr. art. 1353); FRCP 37(e) spoliation.
12 technik negacji (N1-N12): gołosłowne zaprzeczenie, twierdzenie o nieistnieniu
faktu pozytywnego, twierdzenie o nieistnieniu elementu prawnego, ogólnikowe
zaprzeczenie, atak na autentyczność, odmowa przedłożenia dokumentu, zarzut
braku formy, atak na świadka, zarzut prekluzji, cherry-picking, antycypacja
zarzutu przez immunizację, spoliation.
Integracja: BLOK-NEGACJA w analizator-dowodow-v3 (auto-trigger); MP4 §4.3
(typ N1-N12 per atak); RAPORT D §D2 (riposta minimalna); MOD-MACIERZ-DOWOD-TEZA
(luki → podatność na N-techniki); BLOK-PROWENIENCJA P! → N5 autowyzwalacz.
```
