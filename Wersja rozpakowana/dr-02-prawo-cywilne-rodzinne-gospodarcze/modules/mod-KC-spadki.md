# mod-KC-spadki

**Status:** moduł klasy kancelaryjnej — poziom DR-03

**Źródło weryfikacji:** KC Księga IV (art. 922–1088) — Dz.U. 2025 poz. 1071 t.j. ze zm.
**Data weryfikacji online:** 2026-06-05
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## FAZA 0 — INTAKE

```
□ Czy jest testament? → ustal ważność, formę, treść
□ Data śmierci spadkodawcy → termin do przyjęcia/odrzucenia spadku!
□ Krąg spadkobierców ustawowych (grupy kolejności)
□ Czy są małoletni lub osoby pod opieką w kręgu spadkobierców?
□ Wartość majątku i skład — nieruchomości, rachunki, długi spadkowe?
□ Czy złożono już oświadczenie o przyjęciu / odrzuceniu?
□ Czy jest roszczenie o zachowek?
```

---

## DZIEDZICZENIE USTAWOWE — KOLEJNOŚĆ GRUP (art. 931–940 KC)

> ⚠️ Weryfikuj aktualne brzmienie przepisów w ISAP.

```
GRUPA I:    Dzieci + małżonek (w równych częściach; małżonek min. ¼)
GRUPA II:   Rodzice + rodzeństwo + zstępni rodzeństwa (gdy brak dzieci)
GRUPA III:  Dziadkowie i ich zstępni (gdy brak grup I–II)
GRUPA IV:   Pasierbowie (dzieci małżonka) — gdy brak krewnych
SKARBNICZA: Gmina ostatniego miejsca zamieszkania lub Skarb Państwa

Małżonek wyłączony ze spadku: orzeczenie o separacji / wniosek
  o orzeczenie separacji przed śmiercią / wina za rozkład pożycia (art. 940 KC)
```

---

## FORMY TESTAMENTU — KWALIFIKATOR WAŻNOŚCI

| Forma | Wymogi | Uwagi |
|---|---|---|
| Własnoręczny (holograficzny) | W całości ręcznie pisany + podpisany + data | Najczęstszy; ryzyko nieważności przy maszynopisie |
| Notarialny | Akt notarialny | Najsilniejszy — trudno podważyć |
| Allograficzny | Oświadczenie wobec organu / urzędnika | Ograniczone zastosowanie |
| Szczególne (ustny, podróżny) | Tylko przy szczególnych okolicznościach | Ważność ograniczona w czasie |

```
NIEWAŻNOŚĆ TESTAMENTU:
  → Spisany przez inną osobę (nie odręcznie przez spadkodawcę)
  → Brak podpisu
  → Sporządzony w warunkach wyłączających świadome / swobodne powzięcie decyzji
  → Przy udziale osoby, na rzecz której jest przeznaczony (testament allograficzny)
```

---

## PRZYJĘCIE / ODRZUCENIE SPADKU — TERMINY

```
Termin: 6 miesięcy od dowiedzenia się o tytule powołania (art. 1015 §1 KC)
  → Brak oświadczenia w terminie = przyjęcie z dobrodziejstwem inwentarza
  → Wyjątek: przed 2015 r. = proste przyjęcie (brak oświadczenia)

FORMY OŚWIADCZENIA:
  □ Proste przyjęcie — pełna odpowiedzialność za długi spadkowe
  □ Z dobrodziejstwem inwentarza (ograniczona odpowiedzialność do wartości czynnej)
  □ Odrzucenie — wyłączenie ze spadku (traktowany jakby nie dożył)

⚠️ Odrzucenie w imieniu małoletniego wymaga zgody sądu opiekuńczego!
Złóż wniosek PRZED upływem terminu 6 miesięcy — sąd ma czas na rozpoznanie.
```

---

## ZACHOWEK (art. 991–1011 KC)

```
Uprawnieni: dzieci, małżonek, rodzice (gdy byliby powołani do dziedziczenia)

Wysokość:
  ½ wartości udziału spadkowego (co do zasady)
  ⅔ wartości udziału — gdy uprawniony jest trwale niezdolny do pracy lub małoletni

Termin przedawnienia: 5 lat od ogłoszenia testamentu (art. 1007 KC)
  ⚠️ Weryfikuj aktualne brzmienie w ISAP.

Zobowiązani: spadkobiercy (i obdarowani przy darowiznach zaliczanych do substratu)

Zaliczenie darowizn: darowizny na rzecz uprawnionego zmniejszają zachowek
```

---

## DZIAŁ SPADKU

```
Umowny: między wszystkimi spadkobiercami — forma dowolna
  (nieruchomość → akt notarialny)

Sądowy: na wniosek spadkobiercy gdy brak zgody
  → sąd rejonowy → postępowanie nieprocesowe

Wniosek o stwierdzenie nabycia spadku (lub akt poświadczenia dziedziczenia u notariusza)
  → konieczne przed działem
  → wniosek do sądu ostatniego miejsca zamieszkania spadkodawcy
```

---

## WERYFIKACJA ONLINE

```
web_search: "KC Księga IV spadki art 931 dziedziczenie ustawowe isap.sejm.gov.pl"
web_search: "zachowek art 991 KC termin przedawnienia orzecznictwo SN"
web_search: "odrzucenie spadku małoletni zgoda sądu termin orzecznictwo"
web_search: "testament holograficzny nieważność orzecznictwo SN"
```

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Pismo: wniosek o stwierdzenie nabycia spadku, dział | `pisma-procesowe-v3` |
| Orzecznictwo SN — spadki | `orzeczenia-sadowe-v2` |
| Umowy w spadku (np. dożywocie) | `analizator-umow-v1` |
| Wycena majątku, dowody | `analizator-dowodow-v3` |

---

## ŹRÓDŁA ONLINE

- KC: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001071
- SN: https://www.sn.pl

---

## ⚡ ZMIANY OD 15.11.2023 — KLUCZOWE

**Podstawa:** Dz.U. 2023 poz. 1615 (wejście w życie 15.11.2023)

### 1. Zawężenie III kręgu spadkowego (art. 934 KC)

```
PRZED 15.11.2023: Dziadkowie + ich zstępni (dowolnie dalecy)
PO 15.11.2023: Dziadkowie + ich dzieci (wujostwo) + wnuki dziadków (kuzyni I°)
WYŁĄCZENI od 15.11.2023: cioteczne/stryjeczne wnuki i dalej (kuzyni II° i dalsi)
```

### 2. Niegodność dziedziczenia — rozszerzona do 5 przesłanek (art. 928 §1 KC)

```
Pkt 1–3: bez zmian (klasyczne — umyślne przestępstwo, podrobienie testamentu, przeszkoda)
Pkt 4 (NOWY): Uporczywe niewykonywanie sądowo/umownie ustalonego obowiązku
               alimentacyjnego lub obowiązku pieczy wobec spadkodawcy
Pkt 5 (NOWY): Porzucenie małoletniego lub osoby niesamodzielnej przez rodzica/opiekuna
```

### 3. Odrzucenie spadku w imieniu małoletniego (art. 1015 §1¹ i §1² KC — NOWE)

```
DO zachowania terminu 6 miesięcy wystarczy:
  → złożenie WNIOSKU do sądu o odebranie oświadczenia
  (nie trzeba, by sąd zdążył odebrać przed upływem 6 m-cy)

Gdy złożenie wymaga ZEZWOLENIA SĄDU (małoletni):
  → termin 6 miesięcy ZAWIESZA SIĘ na czas postępowania o zezwolenie
  → Złóż wniosek o zezwolenie PRZED upływem terminu!
```

---

## OPŁATY SĄDOWE — STWIERDZENIE NABYCIA SPADKU

> ⚠️ Weryfikuj aktualne opłaty w KSCU (Dz.U. 2025 poz. 1228) w ISAP.

```
Wniosek o stwierdzenie nabycia spadku: 100 zł (KSCU — weryfikuj)
Dział spadku (sądowy): opłata od wartości majątku
  Zgodny wniosek podziału: 300 zł
  Sporny: 1000 zł
  (weryfikuj aktualne kwoty w KSCU w ISAP)
```


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

---

## STRATEGIA

### Perspektywa spadkobiercy / zainteresowanego

1. Ustal termin 6 miesięcy na oświadczenie — policz od daty faktycznego dowiedzenia się.
2. Sprawdź długi spadkowe PRZED przyjęciem — „z dobrodziejstwem inwentarza" chroni.
3. Odrzucenie w imieniu małoletniego: złóż wniosek o zezwolenie sądu ZANIM upłynie 6 miesięcy.
4. Zachowek: sprawdź darowizny za życia spadkodawcy (wchodzą do substratu).
5. Termin na zachowek: 5 lat od ogłoszenia testamentu — pilnuj.

### Ryzyka

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Upływ terminu 6 miesięcy | Przyjęcie z dobrodziejstwem inwentarza z mocy prawa | Aktywne złożenie oświadczenia w terminie |
| Długi przewyższające aktywa | Przyjęcie proste = odpowiedzialność całym majątkiem | Zawsze z dobrodziejstwem inwentarza gdy niepewne |
| Nieważny testament | Brak wymagań formy / zdolności do czynności | Analiza przez prawnika przed wszczęciem postępowania |
| Zaginięcie testamentu | Testament nie znaleziony | Wniosek do sądu o przeszukanie akt; notariusze (CRRN) |
| Pominięcie przy zachowku | Rozliczenie darowizn z przeszłości | Pełna analiza darowizn za życia spadkodawcy |
