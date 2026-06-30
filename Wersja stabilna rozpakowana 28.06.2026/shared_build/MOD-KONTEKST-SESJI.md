# MOD-KONTEKST-SESJI — generator i wczytywanie pliku kontekstu między sesjami

> Status: shared canonical. Wywoływany przez prawny-router-v3 w dwóch
> trybach:
> [EXPORT] na końcu sesji zawierającej KROK 4a (analizator-dowodow-v3) —
>   automatycznie lub na żądanie użytkownika ("zapisz kontekst", "podsumuj
>   ustalenia do następnej sesji", "co mam przenieść dalej").
> [IMPORT] na początku sesji, gdy użytkownik wkleja lub wgrywa plik
>   kontekstu z poprzedniej sesji.
>
> Cel: zastąpić brak trwałej bazy danych między sesjami przez
> przenośny plik .md generowany na końcu każdej sesji analitycznej.
>
> Zależności:
>   MOD-HISTORIA-STRATEGII.md (schema danych — pola selekcja_dowodow,
>     mapa_przepisow, priorytety, warianty_pozwu)
>   MOD-PRIORYTETY-ASPEKTOW.md (aspekty_glowne/poboczne)
>   MOD-SELEKCJA-DOWODOW.md (wybrane dowody, ostrzeżenia krzyżowe)
>   MOD-MAPA-PRZEPISOW.md (mapa_przepisow per aspekt)
>   chronologia-sprawy-v1 (zdarzenia, klasy pewności)
>   analizator-dowodow-v3 (wyniki metod badawczych E2a-j)

---

## 1. Kiedy generować plik kontekstu

```
AUTO-TRIGGER (generuj bez pytania):
  - analizator-dowodow-v3 zakończył KROK 4a (4a.1-4a.6) — pełna analiza
    z aspektami, metodami, mapą przepisów, selekcją dowodów,
  - pisma-procesowe-v3 zakończyło W3 (pismo zweryfikowane i gotowe).

NA ŻĄDANIE (triggery słowne):
  "zapisz kontekst" / "podsumuj do następnej sesji" / "co przenieść" /
  "plik sesji" / "bridge do następnej rozmowy" / "wyeksportuj ustalenia" /
  "co mam wkleić następnym razem".

NIE GENERUJ gdy:
  - sesja dotyczyła tylko pytań ogólnych (bez analizy sprawy),
  - użytkownik explicite odmówił ("nie, nie potrzebuję").
```

---

## 2. Format pliku kontekstu (.md)

Plik generowany przez `bash_tool` (create_file) do `/mnt/user-data/outputs/`,
następnie udostępniany przez `present_files`. Format: czytelny dla człowieka
AND przetwarzalny przez model przy wklejeniu w kolejnej sesji.

```markdown
# KONTEKST SESJI — [skrócona nazwa sprawy]
Wygenerowano: [data i czas UTC]
Sprawa: [identyfikator, np. "VII P 94/25" lub "Sprawa o nadgodziny"]
Sesja nr: [n — jeśli użytkownik podał, inaczej "nieznana"]

---

## 1. STRONY I KONTEKST

Powód/Wnioskodawca: [nazwa/inicjały]
Pozwany/Przeciwnik: [nazwa/inicjały]
Sąd/Organ: [jeśli znany]
Rodzaj sprawy: [cywilna/pracownicza/karna/administracyjna]
Etap postępowania: [np. "przed wniesieniem pozwu" / "po odpowiedzi na pozew"]

---

## 2. ROSZCZENIA GŁÓWNE I POBOCZNE

### Roszczenia główne
[dla każdego aspektu_glowne:]
- [ASP-X]: [opis roszczenia]
  Przepis kandydujący: [⚠️ akt art. X (NIEWERYFIKOWANE)] — głębokość: [BEZPOŚREDNIE] — zgodność: [ZGODNA/SPRZECZNA/NIEROZSTRZYGNIĘTA]

### Kwestie poboczne
[dla każdego aspektu_poboczne:]
- [ASP-X]: [opis]

---

## 3. DOWODY — WYBÓR I RYZYKA

### Zatwierdzone do użycia
[dla każdego zatwierdzony dowód:]
- [DOC-ID] [kat. A/B/C]: [opis] → przesłanka: [opis przesłanki] — ryzyko własne: [poziom]

### Ostrzeżenia krzyżowe (wymagają uwagi w następnej sesji)
[dla każdego ostrzeżenia_krzyzowe:]
- [DOC-ID] — szkodzi tezie [ASP-X] — waga: [KRYTYCZNE/WYSOKIE] — decyzja: [nie_uzywam/uzywam_mimo/wyciag]
  Fragment: "[opis fragmentu szkodzącego]"

### Luki dowodowe
[dla każdej LUKA KRYTYCZNA/ISTOTNA:]
- ⬛ [przesłanka] ([KRYTYCZNA/ISTOTNA]) → działanie: [opis]

---

## 4. WYNIKI METOD BADAWCZYCH

[dla każdej wykonanej metody E2a-j:]
### [MET-XXX] — [nazwa metody]
Tryb wykonania: [JEDNOETAPOWY pełny / DWUETAPOWY — szkic / DWUETAPOWY — głęboka]
Wynik: [1-3 zdania — kluczowa obserwacja analityczna, bez przepisów z pamięci]
Implikacja dla sprawy: [1 zdanie — co to oznacza procesowo]

---

## 5. WARIANT POZWU (jeśli wybrany)

Wybrany wariant: [nazwa]
Styl pisma: [stanowczy/neutralny/negocjacyjny/zwięzły]
Ryzyko: [P1/P2/P3]
Odrzucone warianty: [nazwy] — powód: [jeśli podany]

---

## 6. CHRONOLOGIA — ZDARZENIA KLUCZOWE

[lista zdarzeń z chronologia-sprawy-v1, max 10 najważniejszych]
[FORMAT PER ZDARZENIE:]
- [DATA/OKRES] [KLASA: BEZSPORNE/PEWNE/WYDEDUKOWANE/SPORNE]: [opis zdarzenia]
  Źródło: [dok_id lub opis] | [Wątek: ASP-X jeśli powiązany]

---

## 7. OTWARTE KWESTIE I REKOMENDACJE NA NASTĘPNĄ SESJĘ

[lista nierozwiązanych kwestii, max 5, w kolejności priorytetu:]
1. [opis kwestii — co wymaga dalszej pracy]
   Rekomendacja: [co zrobić]

---

## 8. STAN PISMA (jeśli w toku)

Etap pisma: [W1 rama / W2 projekt / W3 zweryfikowane / gotowe]
Typ pisma: [pozew/apelacja/zażalenie/pismo przygotowawcze/inne]
Nieweryfikowane przepisy (⚠️ do W3): [lista artykułów — NIEWERYFIKOWANE]
Nieweryfikowane orzeczenia (⚠️ do W3): [lista — opisowo]

---

## 9. METADANE TECHNICZNE

Wersje modułów użytych w sesji:
- analizator-dowodow-v3: [version]
- pisma-procesowe-v3: [version] (jeśli użyty)
- przesluchanie-swiadkow-v2: [version] (jeśli użyty)
Metody badawcze wykonane: [lista ID E2a-j]
Metody badawcze — szkic bez głębokiej: [lista ID]

---
*Plik wygenerowany przez MOD-KONTEKST-SESJI. Wklej go na początku kolejnej
sesji z Claude — silnik wczyta kontekst automatycznie przez MOD-KONTEKST-SESJI
TRYB IMPORT.*
```

---

## 3. Procedura generowania (TRYB EXPORT)

```
KROK E1 — Zbierz dane ze stanu bieżącej sesji:
  - aspekty z MOD-PRIORYTETY-ASPEKTOW (lub z rozmowy jeśli brak KROK 4a),
  - mapa_przepisow z MOD-MAPA-PRZEPISOW (KROK 4a.3),
  - selekcja_dowodow z MOD-SELEKCJA-DOWODOW (KROK 4a.5),
  - wyniki metod E2a-j (z aktywnej sesji — streszczaj, nie cytuj przepisów z
    pamięci; metody nieweryfikowane prawnie → tylko obserwacja analityczna),
  - chronologia-sprawy-v1 jeśli wywołana — max 10 kluczowych zdarzeń,
  - wariant pozwu z MOD-WARIANTY-POZWU (jeśli wybrany),
  - stan pisma (etap W1/W2/W3, typ, ⚠️ nieweryfikowane przepisy).

KROK E2 — Wypełnij szablon §2 danymi z KROK E1.

  ZASADY WYPEŁNIANIA:
  - Przepisy: wyłącznie jako "⚠️ [akt] art. [X] (NIEWERYFIKOWANE)" — NIE
    weryfikuj Dz.U. w tym kroku (to by wywołało ISAP dla każdej pozycji).
  - Wyniki metod: 1-3 zdania streszczenia obserwacji analitycznej, BEZ
    cytowania przepisów lub orzeczeń z pamięci.
  - Ostrzeżenia krzyżowe: KOMPLETNA lista — to jest kluczowa informacja
    bezpieczeństwa dla następnej sesji; nic nie pomijaj.
  - Luki dowodowe: KOMPLETNA lista z działaniem — następna sesja może
    zacząć od uzupełnienia tych luk.
  - Otwarte kwestie (§7): priorytetyzuj — co BLOKUJE postęp vs co jest
    "nice to have".

KROK E3 — Utwórz plik:
  Nazwa pliku: kontekst-sesji-[YYYY-MM-DD]-[skrót_sprawy].md
  Ścieżka: /mnt/user-data/outputs/
  Narzędzie: bash_tool (cat > ... << 'EOF') — NIE create_file (może już
    istnieć z wcześniejszej sesji tego dnia).

KROK E4 — Udostępnij:
  present_files([ścieżka pliku])
  Dołącz krótką instrukcję: "Pobierz ten plik i wklej jego zawartość na
  początku kolejnej sesji z Claude, gdy będziesz kontynuować tę sprawę.
  Silnik wczyta kontekst automatycznie."

KROK E5 — NIE generuj raportu po wygenerowaniu pliku — present_files
  i jedno zdanie instrukcji wystarczą.
```

---

## 4. Procedura wczytywania (TRYB IMPORT)

```
TRIGGER IMPORTU — wykryj że użytkownik:
  - wkleił blok zaczynający się od "# KONTEKST SESJI",
  - wgrał plik .md z nazwą pasującą do "kontekst-sesji-*",
  - napisał "masz tu kontekst z poprzedniej sesji" + podał treść.

KROK I1 — Parsuj sekcje 1-9 z pliku kontekstu.

KROK I2 — Zbuduj struktury wewnętrzne:
  aspekty_glowne = lista z §2 ROSZCZENIA GŁÓWNE
  aspekty_poboczne = lista z §2 KWESTIE POBOCZNE
  mapa_przepisow = per aspekt z §2 (jako ⚠️ NIEWERYFIKOWANE)
  korpus_dowodow_wstepny = lista z §3 ZATWIERDZONE (jako punkt startowy)
  ostrzezenia_krzyzowe = lista z §3 OSTRZEŻENIA KRZYŻOWE
  luki_dowodowe = lista z §3 LUKI DOWODOWE
  wyniki_metod = streszczenia z §4 (per MET-ID)
  wariant_pozwu = §5 (jeśli wypełniony)
  chronologia_wstepna = zdarzenia z §6
  otwarte_kwestie = §7

KROK I3 — Potwierdź wczytanie użytkownikowi:
  "[Imię jeśli znane] — wczytałem kontekst sprawy [nazwa].
  Kontynuujemy od: [etap z §8 lub 'nowy etap'].
  
  Aktywne roszczenia: [n] | Zatwierdzone dowody: [n] | Luki: [n] ⬛
  Ostrzeżenia krzyżowe z poprzedniej sesji: [n] 🔴 [jeśli >0: wymień]
  Otwarte kwestie: [n] — najważniejsza: [pierwsza z §7]
  
  Od czego zaczynamy?"

KROK I4 — Integracja z modułami:
  MOD-PRIORYTETY-ASPEKTOW — aspekty z I2 traktowane jak wynik KROK 4a,
    nie trzeba ponownie klasyfikować chyba że użytkownik dostarczył nowe
    dokumenty.
  MOD-MAPA-PRZEPISOW — mapa_przepisow z I2 jako punkt startowy; użytkownik
    może dopytać o inne przepisy jak w normalnym KROK 4a.3.
  MOD-SELEKCJA-DOWODOW — korpus_dowodow_wstepny i ostrzezenia_krzyzowe z I2
    jako stan wyjściowy; jeśli użytkownik dostarczył NOWE dokumenty →
    uruchom KROK 4a.5 dla nowych + utrzymaj decyzje z poprzedniej sesji.
  przesluchanie-swiadkow-v2 — wyniki_metod i chronologia z I2 traktowane
    jak wynik KROK 0 (§ KROK 0 w SKILL.md przesluchania) — nie ma potrzeby
    ponownego intake dotyczącego sprawy.

KROK I5 — Flaga IMPORT_AKTYWNY = true dla tej sesji.
  Gdy IMPORT_AKTYWNY: przy każdym KROK 4a → najpierw sprawdź czy nowe
  dokumenty/informacje wymagają aktualizacji kontekstu, czy potwierdzają
  stan z importu.
```

---

## 5. Integracja z przesłuchaniem świadków

```
Gdy przesluchanie-swiadkow-v2 KROK 0 wykryje IMPORT_AKTYWNY lub wyniki KROK 4a
z bieżącej sesji — następujące sekcje kontekstu zasilają W1 intake:

  §2 ROSZCZENIA GŁÓWNE → tezy do wykazania przez świadka (WARSTWA A,
    pole "Okoliczność dowodowa")
  §3 ZATWIERDZONE dowody → pytania kontrolne w W3 blok B (pytania
    potwierdzające zatwierdzone dowody)
  §3 OSTRZEŻENIA KRZYŻOWE → blok E (pytania których NIE zadawać lub których
    UNIKAĆ — bo otwierają temat D szkodzący tezie T_B)
  §4 wyniki metod → per metoda:
    MET-ACH: hipotezy do obalenia → blok D (pytania na sprzeczności)
    MET-CA: zmiana narracji → blok D (looping — wróć do wcześniejszego
      twierdzenia świadka/dokumentu)
    MET-NET: niespójność ról podmiotów → blok C (pytania weryfikacyjne
      o rolę świadka w zdarzeniu)
    MET-COMP: kroki procedury niezachowane → blok B/C (pytania o konkretny
      krok proceduralny — "czy miał pan świadomość procedury X?")
  §6 CHRONOLOGIA → materiał do loopingu — "Zeznał pan, że X było [data].
    Tymczasem [zdarzenie BEZSPORNE z chronologii] nastąpiło [wcześniej].
    Jak to możliwe?"
```

---

## 6. Self-check przed EXPORT

```
□ Czy §3 OSTRZEŻENIA KRZYŻOWE jest KOMPLETNY (żadnego nie pominięto)?
□ Czy §3 LUKI DOWODOWE zawiera propozycję działania dla każdej luki?
□ Czy §4 wyniki metod nie zawierają przepisów lub sygnatur z pamięci
  (tylko obserwacje analityczne)?
□ Czy §7 OTWARTE KWESTIE są priorytetyzowane (co blokuje vs nice-to-have)?
□ Czy plik zawiera datę wygenerowania i identyfikator sprawy w §1?
□ Czy instrukcja wklejenia jest dołączona na końcu pliku (ostatnia linia)?
Którykolwiek = NIE → uzupełnij przed present_files.
```
