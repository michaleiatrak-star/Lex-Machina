# WORKFLOW: Generator Dokumentów HR i RODO
## Analizator Umów v1 · workflows/generator-dokumentow-hr-rodo.md

**Wywołanie:** *„wygeneruj regulamin pracy/wynagradzania"*, *„napisz politykę
prywatności"*, *„przygotuj klauzulę informacyjną RODO"*.

Przed startem: `view references/generator/rdzen-generowania.md`. Essentialia
merytoryczne dla obu ścieżek **już istnieją** w `mod-J21-rodo-archiwizacja-regulaminy.md`
— ten workflow dodaje wyłącznie warstwę procesową generowania (wywiad → szkielet
→ styl → bramka), której moduł J21 (zorientowany na analizę/audyt) nie zawierał.

---

## ŚCIEŻKA A — REGULAMIN PRACY / WYNAGRADZANIA / ZFŚS

`view references/mod-J21-rodo-archiwizacja-regulaminy.md § J21.4` (regulamin
pracy/wynagradzania) lub `§ J21.5` (ZFŚS).

### KROK 1 — WYWIAD

- liczba zatrudnionych (próg 50 pracowników = obowiązek regulaminu pracy;
  20–49 = obowiązek na wniosek związku zawodowego; poniżej 20 = fakultatywnie —
  **zweryfikuj aktualny próg online**, moduł J21.4 sygnalizuje zmianę progów
  w 2026 r. [VER: wymagana weryfikacja przy każdym użyciu]),
- czy działa zakładowa organizacja związkowa (tryb uzgadniania treści — art. 104²
  KP: uzgodnienie z organizacją związkową, a przy braku uzgodnienia w terminie
  lub braku organizacji — pracodawca ustala samodzielnie),
- czy obowiązuje układ zbiorowy pracy pokrywający materię regulaminu (wtedy
  regulamin zbędny w tym zakresie),
- specyfika zakładu: systemy i rozkłady czasu pracy, praca młodocianych, BHP,
  odpowiedzialność porządkowa (art. 108 KP) — dobierz sekcje wg realiów, nie
  wklejaj wzorca uniwersalnego bez dopytania o czas pracy i wynagrodzenie.

### KROK 2 — SZKIELET (wg art. 104¹ KP, katalog otwarty)

```
1. Postanowienia ogólne
2. Organizacja pracy, warunki przebywania na terenie zakładu, wyposażenie w narzędzia/odzież
3. Systemy i rozkłady czasu pracy, okresy rozliczeniowe
4. Pora nocna
5. Termin, miejsce, czas i częstotliwość wypłaty wynagrodzenia
6. [jeśli dotyczy] Wykaz prac wzbronionych młodocianym/kobietom; prace dla młodocianych
7. BHP i ochrona przeciwpożarowa, informowanie o zagrożeniach
8. Odpowiedzialność porządkowa pracowników (kary wg art. 108 KP)
9. Postanowienia końcowe (wejście w życie, tryb zmiany)
```

Zatrzymaj się po szkielecie (R6).

### KROK 3 — TREŚĆ, STYL, BRAMKA

Stosuj `style-format-generowania.md` — regulamin pracy trafia do pracowników
niebędących prawnikami, uruchom ocenę `mod-shared-legal-design.md`. Bramka
finalizacji jak w `generator-umowy.md` KROK 5, z dodatkowym punktem: „tryb
uzgodnienia z organizacją związkową — zastosowany prawidłowo (uzgodniono /
brak organizacji / brak uzgodnienia w terminie)?”.

## ŚCIEŻKA B — POLITYKA PRYWATNOŚCI / KLAUZULA INFORMACYJNA (art. 13/14 RODO)

`view references/mod-J21-rodo-archiwizacja-regulaminy.md § J21.2`.

### KROK 1 — WYWIAD

- czy dane pozyskiwane bezpośrednio od osoby (art. 13 RODO) czy z innych źródeł
  (art. 14 RODO — inny termin przekazania informacji: przy pierwszym kontakcie
  lub w ciągu miesiąca),
- tożsamość administratora + dane kontaktowe, czy powołano IOD,
- **każdy** cel przetwarzania z osobną podstawą prawną (art. 6 ust. 1 RODO) —
  zbierz to jako listę, nie jedno zdanie ogólne; jeśli podstawą jest prawnie
  uzasadniony interes (lit. f) — ustal, jaki konkretnie interes,
  bo musi być opisany, nie tylko przywołany,
- okres przechowywania danych per cel (nie jedna wspólna liczba dla wszystkich
  celów, chyba że faktycznie jest identyczny),
- odbiorcy danych (podmioty przetwarzające, organy, ewentualny transfer poza EOG
  i podstawa transferu),
- prawa osoby, której dane dotyczą (dostęp, sprostowanie, usunięcie, ograniczenie,
  przenoszenie, sprzeciw, skarga do PUODO) — kompletność, nie skrót,
- czy stosowany jest model warstwowy (krótka klauzula w formularzu + pełna
  polityka prywatności) — jeśli tak, wygeneruj **oba** dokumenty spójne ze sobą,
  nie tylko jeden.

### KROK 2 — SZKIELET (art. 13 ust. 1–2 RODO)

```
1. Tożsamość i dane kontaktowe administratora (+ IOD, jeśli powołany)
2. Cele przetwarzania i podstawy prawne — per cel
3. Prawnie uzasadnione interesy (jeśli podstawa: art. 6 ust. 1 lit. f)
4. Odbiorcy danych osobowych
5. Zamiar transferu do państwa trzeciego/organizacji międzynarodowej i podstawa (jeśli dotyczy)
6. Okres przechowywania danych (per cel)
7. Prawa osoby, której dane dotyczą (pełny katalog + prawo skargi do PUODO)
8. Informacja o dobrowolności/obowiązku podania danych i konsekwencjach niepodania
9. Informacja o zautomatyzowanym podejmowaniu decyzji/profilowaniu (jeśli dotyczy)
```

### KROK 3 — TREŚĆ, STYL, BRAMKA

Język **prosty i zrozumiały** — to wymóg ustawowy (art. 12 RODO), nie tylko
dobra praktyka; uruchom `mod-shared-legal-design.md` i traktuj wynik < 30/50
jako niespełnienie wymogu przejrzystości, nie tylko estetyczny mankament.
Sprawdź spójność z rejestrem czynności przetwarzania (RCP), jeśli klient go
posiada (`mod-J21-rodo-archiwizacja-regulaminy.md § J21.3`) — cele i podstawy w
polityce muszą pokrywać się z RCP, rozbieżność = flaga do wyjaśnienia przed
finalizacją.

Bramka finalizacji jak w `generator-umowy.md` KROK 5, z dodatkowym punktem:
„każdy cel przetwarzania ma podstawę prawną i okres retencji — brak ⬛?”.

## ŚCIEŻKA C — POLITYKA AI (dokument wewnętrzny, art. 4/50 AI Act)

`view references/generator/doktryna-uzupelnienie.md § D.4` — essentialia pełne.
Nie mylić z `mod-shared-ai-act.md` (klauzule AI Act **w umowach** z dostawcą/
wdrażającym system AI) — Polityka AI jest dokumentem wewnętrznym pracodawcy.

### KROK 1 — WYWIAD

- jakie narzędzia AI są już używane w organizacji (w tym nieformalnie —
  „shadow AI") — zbierz realną listę, nie tylko oficjalnie zatwierdzone;
- czy firma jest dostawcą czy wyłącznie wdrażającym systemy AI (różny zakres
  obowiązków AI Act — zweryfikuj online przy konkretnej sprawie, R1);
- jakie kategorie danych są zakazane do wprowadzania do narzędzi AI (dane
  osobowe klientów, tajemnica przedsiębiorstwa, dane objęte NDA z klientami);
- czy Polityka AI ma być dokumentem odrębnym czy częścią regulaminu pracy
  (obie praktyki występują — ustal wprost z klientem, nie zakładaj);
- sektor działalności — sektory regulowane (finanse, ochrona zdrowia) mogą
  mieć dodatkowe wymogi poza AI Act — zasygnalizuj, nie pomijaj.

### KROK 2 — SZKIELET

```
1. Cel i zakres polityki (kogo obejmuje, jakie narzędzia)
2. Rejestr dozwolonych narzędzi AI
3. Zakazane kategorie danych wprowadzanych do narzędzi AI
4. Zasady weryfikacji wyników generowanych przez AI przed wykorzystaniem
5. Obowiązek oznaczania treści wygenerowanych/zmodyfikowanych przez AI
6. Plan podnoszenia kompetencji AI (AI literacy) — poziomy wg roli
7. Procedura zgłaszania incydentów/nieprawidłowości
8. Sankcje za naruszenie polityki
9. Przegląd i aktualizacja polityki (częstotliwość, wyzwalacze aktualizacji)
```

### KROK 3 — TREŚĆ, STYL, BRAMKA

`style-format-generowania.md` — dokument trafia do wszystkich pracowników,
uruchom ocenę czytelności. Bramka finalizacji jak wyżej, z dodatkowym
punktem: „polityka rozróżnia dostawcę i wdrażającego tam, gdzie to wpływa na
zakres obowiązków — potwierdzone?".

### Disclaimer (wszystkie ścieżki)

> *Dokument ma charakter roboczy i wymaga weryfikacji przez prawnika/IOD przed
> wdrożeniem, w szczególności co do zgodności z aktualnym stanem faktycznym
> przetwarzania danych / organizacji pracy u danego pracodawcy.*
