# mod-ustawa-timeshare-zastaw-rejestrowy

**Źródło weryfikacji:** Ustawa o timeshare — Dz.U. 2018 poz. 513 (weryfikuj nowszy t.j. w ISAP) | Ustawa o zastawie rejestrowym — Dz.U. 2018 poz. 2017 ze zm. (weryfikuj w ISAP)
**Data weryfikacji online:** 2026-06-05
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

# CZĘŚĆ A — TIMESHARE

## Zakres (Ustawa z 16.09.2011 r. o timeshare)

Reguluje umowy timeshare (prawo do korzystania z miejsca zakwaterowania przez określony czas każdego roku), umowy o długoterminowy produkt wakacyjny, umowy odsprzedaży i wymiany.

**Definicja umowy timeshare:**
- prawo do korzystania ≥ 1 tydzień rocznie
- przez ≥ 3 lata
- z odpłatnością

## Ochrona konsumenta — Quick Check

> ⚠️ Weryfikuj aktualne przepisy ustawy o timeshare w ISAP.

```
PRAWO DO ODSTĄPIENIA:
  14 dni kalendarzowych — bez podania przyczyny (weryfikuj art. 25 ustawy)
  Formularz wzorcowy z załącznika do ustawy

ZAKAZ ZALICZKI:
  Podczas okresu odstąpienia zakaz żądania jakichkolwiek świadczeń
  Naruszenie = nieważność klauzuli

WYMOGI FORMALNE:
  Umowa pisemna pod rygorem nieważności
  W języku kraju UE zamieszkania konsumenta lub wybranym przez niego
  Formularz informacyjny PRZED zawarciem umowy
```

## Weryfikacja online

```
web_search: "ustawa timeshare Dz.U. 2018 poz. 513 isap.sejm.gov.pl aktualna"
web_search: "timeshare prawo odstąpienia polskie przepisy UOKiK klauzule"
```

---

# CZĘŚĆ B — ZASTAW REJESTROWY

## Zakres (Ustawa z 06.12.1996 r. o zastawie rejestrowym i rejestrze zastawów)

**Zastaw rejestrowy** = ograniczone prawo rzeczowe na rzeczach ruchomych lub prawach, ustanowione przez wpis do rejestru zastawów, dla zabezpieczenia wierzytelności.

**Przedmiot zastawu:** rzeczy ruchome, prawa zbywalne (udziały sp. z o.o., akcje, wierzytelności, prawa z papierów wartościowych, dobra niematerialne, zbiory rzeczy/praw tworzące całość gospodarczą, pojazdy).

## Kluczowe zasady

```
Pierwszeństwo:   Wg daty złożenia wniosku o wpis (nie daty wpisu)
Wpis:            Konstytutywny — zastaw powstaje z chwilą wpisu
Forma umowy:     Pisemna pod rygorem nieważności
Rejestr:         Prowadzony przez sądy rejonowe (wydziały gospodarcze)
Jawność:         Rejestr jawny — każdy może sprawdzić (rzs.ms.gov.pl)

Wykonanie zastawu:
  → Przez komornika (sprzedaż publiczna)
  → Pozaegzekucyjne (wariant umowny — gdy strony tak zastrzegły)
  → Przejęcie na własność zastawnika (gdy umowa tak stanowi)

Wygaśnięcie:
  → Wygaśnięcie zabezpieczonej wierzytelności
  → Na wniosek zastawnika
```

## Opłaty (KSCU — weryfikuj aktualne w ISAP)

```
Wpis do rejestru zastawów: weryfikuj aktualną kwotę w KSCU
Zmiana wpisu: weryfikuj w KSCU
Wykreślenie: weryfikuj w KSCU
```

## Weryfikacja online

```
web_search: "ustawa zastaw rejestrowy isap.sejm.gov.pl tekst jednolity aktualny"
web_search: "rejestr zastawów sądowy RZS ms.gov.pl"
web_fetch: https://rzs.ms.gov.pl
```

## Łącz z

| Sytuacja | Skill / Moduł |
|---|---|
| Timeshare — klauzule abuzywne | `mod-KC-konsumenckie` / `analizator-umow-v1` |
| Zastaw — zabezpieczenie umowy B2B | `mod-KSH-spolki-handlowe` / `analizator-umow-v1` |
| Pismo: odstąpienie od timeshare / egzekucja zastawu | `pisma-procesowe-v3` |

## Źródła online

- Ustawa o timeshare: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20180000513
- Ustawa o zastawie rejestrowym: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20182017
- Rejestr zastawów sądowy: https://rzs.ms.gov.pl


---

## QUALITY GATE

- [ ] Aktualny tekst t.j. aktu zweryfikowany w ISAP?
- [ ] Stan prawny właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Każda przesłanka ma przypisany dowód?
- [ ] Termin nie upłynął?
- [ ] Właściwy organ / sąd wskazany?
- [ ] Ryzyka formalne i dowodowe ocenione?
- [ ] Brzmienie przepisów pobrane ze źródeł, nie z pamięci modelu?

## OUTPUT

Wynik pracy modułu:
1. Stan faktyczny;
2. Stan prawny i źródła (Dz.U. z ISAP);
3. Kwalifikacja trybu i właściwość;
4. Terminy (obliczone, z datami granicznymi);
5. Przesłanki (spełnione / wątpliwe / niespełnione);
6. Matryca dowodowa (teza → dowód → siła → luka);
7. Zarzuty i kontrargumenty;
8. Analiza ryzyk;
9. Strategia (wariant podstawowy + ewentualny);
10. Rekomendacja + kolejne kroki;
11. Kontrola ISAP/temporalności.
