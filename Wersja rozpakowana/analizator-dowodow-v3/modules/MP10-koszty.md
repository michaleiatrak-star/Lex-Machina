# M10 — Koszty sądowe, ekonomika postępowania i próg opłacalności

## Cel

Ocenić ekonomiczną zasadność wszczęcia lub kontynuowania postępowania.
Koszty sądowe, ryzyko zasądzenia kosztów od użytkownika, próg opłacalności
i warianty ugodowe muszą być wkalkulowane w każdą rekomendację procesową.

**Reguła:** przed podaniem kwot opłat sądowych zawsze weryfikuj aktualną
treść ustawy z dnia 28 lipca 2005 r. o kosztach sądowych w sprawach cywilnych
(KSCU) w ISAP — tabele opłat były wielokrotnie nowelizowane.

---

## 10.1 Identyfikacja rodzaju postępowania i właściwego reżimu opłat

```text
Tryb postępowania: procesowe / nieprocesowe / nakazowe / upominawcze /
                   uproszczone / KPC art. 505¹ / KPC art. 458¹ (pracownicze) /
                   zabezpieczające / egzekucyjne / administracyjne (PPSA) /
                   karne (koszty art. 616–645 KPK)
Wartość przedmiotu sporu / zaskarżenia:
Czy sprawa pracownicza: tak / nie
  → jeśli tak: art. 35 KSCU — zwolnienie ustawowe pracownika od opłat
Czy sprawa konsumencka: tak / nie
Czy strona korzysta ze zwolnienia podmiotowego: tak / nie
Podstawa zwolnienia:
```

---

## 10.2 Opłaty sądowe — struktura

### Opłata od pozwu / wniosku

```text
Rodzaj opłaty: stosunkowa (5% WPS) / stała / podstawowa / tymczasowa
WPS:
Opłata obliczona:
Podstawa prawna (art. KSCU): [do weryfikacji w ISAP]
Cap ustawowy (max): [do weryfikacji]
Opłata minimalna (min): [do weryfikacji]
Opłata po ewentualnym rozszerzeniu roszczenia:
```

### Opłaty dodatkowe / czynności szczególne

```text
Wniosek o zabezpieczenie: [kwota do weryfikacji]
Apelacja: [5% WPS zaskarżonej części lub opłata minimalna]
Zażalenie: [do weryfikacji]
Wniosek o uzasadnienie: [do weryfikacji]
Skarga kasacyjna: [do weryfikacji]
Wniosek o wyłączenie sędziego: [do weryfikacji]
Inne:
```

### Zaliczki na dowody

```text
Opinia biegłego — szacunek:
Koszty podróży świadka:
Koszty tłumacza:
Koszty doręczeń komorniczych:
Koszty ogłoszeń:
Łączna zaliczka szacowana:
```

---

## 10.3 Koszty zastępstwa procesowego (koszty pełnomocnika)

```text
Stawka minimalna z rozporządzenia:
  adwokaci: Dz.U. 2026 poz. 215 t.j. (Rozp. MS z 22.10.2015 r., t.j. 12.02.2026) ✅ VER: 2026-06-09
  radcowie: Dz.U. 2026 poz. 118 t.j. (Rozp. MS z 22.10.2015 r. o opł. czynności radców) ✅ VER: 2026-06-09
WPS / kategoria sprawy:
Stawka minimalna dla tej sprawy:
Stawka realna (umowna) pełnomocnika użytkownika:
Stawka pełnomocnika przeciwnika (szacunek):
Podstawa zasądzenia kosztów: art. 98–110 KPC
Zasada odpowiedzialności za wynik (art. 98):
Czy możliwe zasądzenie kosztów od użytkownika: tak / nie / zależy od wyniku
Szacowane koszty do zwrotu przy przegranej:
```

---

## 10.4 Kalkulator wartości sporu i opłacalności

```text
[KALKULACJA]
Wartość roszczenia brutto:
Ryzyko oddalenia / częściowego oddalenia (%):
Prawdopodobna wartość zasądzona (pesymistyczna):
Prawdopodobna wartość zasądzona (realistyczna):
Prawdopodobna wartość zasądzona (optymistyczna):

Koszty wszczęcia postępowania:
  — opłata sądowa:
  — wynagrodzenie pełnomocnika:
  — zaliczki na dowody:
  — inne:
  Suma kosztów wszczęcia:

Koszty dalszego postępowania (szacunek na 1 instancję):
Koszty apelacji (jeżeli konieczna):

Ryzyko zasądzenia kosztów od użytkownika przy przegranej:
  Przy całkowitej przegranej:
  Przy przegraniu w części:

Próg opłacalności (break-even):
  = Suma kosztów / Prawdopodobieństwo sukcesu
```

---

## 10.5 Analiza wariantów

```text
[WARIANT 1] Pełne postępowanie sądowe do II instancji
  Czas: szacowany
  Koszty łączne:
  Oczekiwana wartość (EV):
  Ryzyko:

[WARIANT 2] Ugoda / mediacja / negocjacje
  Minimalny akceptowalny próg ugody:
  Zalety ugody w tej sprawie:
  Ryzyka ugody:
  Szansa na ugodę: %

[WARIANT 3] Postępowanie przyspieszone / uproszczone / nakazowe
  Dostępność: tak / nie / zależy od WPS
  Korzyści:
  Ryzyka:

[WARIANT 4] Zaniechanie / inne działania pozaprocesowe
  Kiedy racjonalne:
  Koszty zaniechania:
```

---

## 10.6 Alerty finansowe

Oznacz jeżeli zachodzi:

- `[ALERT-F1]` Koszty postępowania przekraczają 30% wartości roszczenia
  → rozważ ugodę lub postępowanie uproszczone.
- `[ALERT-F2]` Ryzyko zasądzenia kosztów od użytkownika > 50% wartości roszczenia
  → analiza ryzyka finansowego jako czynnik decyzji.
- `[ALERT-F3]` Próg opłacalności > 70% wartości roszczenia
  → postępowanie ekonomicznie nieopłacalne bez silnej szansy wygranej.
- `[ALERT-F4]` Brak opłaty sądowej w aktach — ryzyko zwrotu pisma bez rozpoznania.
- `[ALERT-F5]` Sprawa pracownicza — sprawdź zwolnienie ustawowe z art. 35 KSCU.

---

## 10.7 Koszty w sprawach szczególnych

### Sprawy karne

```text
Koszty sądowe w sprawie karnej (art. 616 KPK):
  — koszty procesu (art. 618 KPK): opłaty, koszty doręczeń, biegłych, tłumaczy
  — opłaty (ustawa z 23.06.1973 o opłatach w sprawach karnych): [do weryfikacji]
  — przy skazaniu: obowiązek poniesienia kosztów przez skazanego (art. 627 KPK)
  — przy uniewinnieniu: koszty na Skarb Państwa (art. 632 KPK)
  — oskarżyciel posiłkowy: opłata od subsydiarnego aktu oskarżenia [do weryfikacji]
```

### Postępowanie administracyjne / sądowoadministracyjne

```text
Opłata kancelaryjna (KPA): [do weryfikacji]
Wpis od skargi do WSA (PPSA): [do weryfikacji]
Wpis od skargi kasacyjnej do NSA: [do weryfikacji]
Wynagrodzenie pełnomocnika w postępowaniu sądowoadministracyjnym: [do weryfikacji]
```

### Postępowanie egzekucyjne

```text
Opłata egzekucyjna (ustawa o komornikach sądowych): [do weryfikacji]
Opłata stosunkowa od wyegzekwowanego świadczenia: [do weryfikacji]
Koszty czynności: doręczenia, ogłoszenia, transport: szacunek
```

---

## 10.8 Decyzja końcowa

```text
Rekomendacja ekonomiczna:
  ☐ Wszczęcie postępowania — ekonomicznie zasadne
  ☐ Wszczęcie postępowania — graniczne, wymaga decyzji klienta
  ☐ Priorytetowa próba ugodowa przed wszczęciem
  ☐ Ekonomicznie niezasadne — koszty > oczekiwana wartość
  ☐ Wymaga dalszej analizy po uzyskaniu brakujących danych

Uzasadnienie:
Działania przed wszczęciem:
```
