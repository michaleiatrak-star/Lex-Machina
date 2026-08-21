# mod-UDP-strefy-platnego-parkowania

**Status:** nowy moduł 2026-06-09 (weryfikacja online)
**Zakres:** SPP, ŚSPP — opłaty, opłaty dodatkowe, tryb obrony, egzekucja, orzecznictwo NSA

**Źródła (weryfikuj w ISAP przed powołaniem):**

| Akt | Dz.U. | Art. | Uwaga |
|---|---|---|---|
| Ustawa o drogach publicznych (UDP) | **Dz.U. 2025 poz. 889 t.j.** | art. 13, 13b, 13f | Aktualny t.j. — weryfikuj isap.sejm.gov.pl |
| Ustawa o postępowaniu egzekucyjnym w administracji (UPEA) | Dz.U. 2023 poz. 2505 t.j. | art. 33 (zarzuty) | Obrona w egzekucji |
| KW | Dz.U. 2025 poz. 734 | art. 92 §1 | Wykroczenie — brak biletu |
| KPA | Dz.U. 2025 poz. 1691 | art. 189a i n. | Nie dotyczy bezpośrednio opł. park. |

```
⛔ HARD GATE: Stawki opłat w SPP/ŚSPP zmieniają się COROCZNIE (% płacy minimalnej).
Przed każdym powołaniem konkretnych kwot:
  web_search: "maksymalne stawki SPP ŚSPP [rok] minimalne wynagrodzenie art 13b UDP"
  web_search: "opłata dodatkowa parkingowa maksymalna [rok] kwota PLN"
```

---

## ⚡ ALERT — KLUCZOWE USTALENIE PRAWNE

```
Opłata parkingowa i opłata dodatkowa za postój w SPP/ŚSPP:
  → NIE są decyzją administracyjną
  → NIE wymagają wszczęcia postępowania administracyjnego
  → Obowiązek wynika bezpośrednio z przepisu prawa (mocy prawa)
  → Wezwanie do zapłaty (zawiadomienie) NIE jest zaskarżalne do WSA!

LINIA NSA (konsekwentna — weryfikuj orzeczenia.nsa.gov.pl):
  → Wyrok WSA Białystok II SA/Bk 159/24 z 28.05.2024: "Nie ma przepisu umożliwiającego
    skarżenie działalności zarządcy drogi w zakresie pobierania opłaty dodatkowej art. 13f UDP.
    Kwestionowanie możliwe WYŁĄCZNIE w postępowaniu egzekucyjnym."
  → Obrona: ZARZUTY do tytułu wykonawczego (art. 33 UPEA) — TERMIN 7 DNI od doręczenia TW

→ STRATEGIA: NIE składaj skargi do WSA na wezwanie do zapłaty!
  Poczekaj na wszczęcie egzekucji → złóż zarzuty (art. 33 UPEA)
```

---

## 1. INTAKE — PYTANIA OBOWIĄZKOWE

```
□ Mamy: wezwanie do zapłaty (zawiadomienie) / tytuł wykonawczy / egzekucję?
  → Tytuł wykonawczy: ZARZUTY 7 DNI (ZAWITY)!
□ Gdzie stał pojazd: droga publiczna w SPP/ŚSPP czy parking prywatny?
  → Droga publiczna: przepisy UDP
  → Parking prywatny (deweloper, galeria): umowa cywilna, BCC/UOKiK
□ Czy strefa jest właściwie oznakowana (znaki D-44 lub D-44b)?
□ Czy opłata wniesiona, ale zawiadomienie wystawiono mimo to?
□ Czy pojazd uprawniony do zwolnienia (niepełnosprawny, służby, itp.)?
□ Czy identyfikator/karta był widoczny za szybą?
□ Jaka kwota: opłata parkingowa (niezapłacona) czy opłata DODATKOWA?
□ Czy jest uchwała rady gminy dla tej SPP/ŚSPP (obowiązek uchwały)?
```

---

## 2. SYSTEM SPP/ŚSPP — PODSTAWY PRAWNE

### Typy stref
```
SPP — Strefa Płatnego Parkowania (art. 13b ust. 1 UDP):
  → Postój w wyznaczonym miejscu, w określone DNI ROBOCZE, w określonych godzinach
    lub całodobowo
  → Obszar: charakteryzujący się "znacznym deficytem miejsc postojowych"
  → Decyzja: uchwała rady gminy na wniosek wójta/burmistrza/prezydenta

ŚSPP — Śródmiejska Strefa Płatnego Parkowania (art. 13b ust. 1a + 2a UDP):
  → Postój TAKŻE w WEEKENDY i święta (NIE tylko dni robocze)
  → Obszar: "zgrupowanie intensywnej zabudowy funkcjonalnego śródmieścia"
  → Stawki: wyższe (do 0,45% płacy min. za pierwszą godzinę = 3× max SPP)
  → Uzdrowiska: strefa A i B

KTO USTANAWIA:
  → Rada gminy (rada miasta) uchwałą na wniosek wójta/burmistrza/prezydenta
  → Uchwała = akt prawa miejscowego (art. 87 ust. 2 Konstytucji)
  → Uchwała musi określać: granice, wysokość opłat, zasady pobierania,
    ewentualne abonamentowe/zerowe stawki, opłatę dodatkową
```

### Stawki opłat (powiązane z płacą minimalną — WERYFIKUJ co roku)
```
Minimalne wynagrodzenie 2026: weryfikuj web_search "minimalne wynagrodzenie 2026 wysokość"
  (w 2025 r. wynosiło 4 666 zł; w 2026 r. zmieniło się — weryfikuj)

MAKSYMALNE STAWKI ZA GODZINĘ (art. 13b ust. 4 UDP — weryfikuj aktualne):
  SPP   — 1. godzina: 0,15% płacy min. (2026: ok. 7,20 zł — weryfikuj!)
         2. godzina: max 1,20× stawki z 1. godziny (progresja max 20%)
         3. godzina: max 1,20× stawki z 2. godziny (progresja max 20%)
         4. godzina i kolejne: ≤ stawce za 1. godzinę
  ŚSPP  — 1. godzina: 0,45% płacy min. (2026: ok. 21,60 zł — weryfikuj!)
         Progresja: analogiczna zasada co SPP

OPŁATA DODATKOWA (art. 13f UDP):
  → Za NIEUISZCZENIE opłaty za postój
  → Określa: RADA GMINY uchwałą
  → Max (2026): weryfikuj! (2025: 466,60 zł; 2026: ok. 480,60 zł — zależy od płacy min.)
  → UPRAWNIENIE do ulgowej stawki: gdy zapłacono za SPP zamiast ŚSPP
    (niektóre gminy stosują 50% opłaty dodatkowej — weryfikuj lokalną uchwałę)

ZWOLNIENIA OD OPŁAT (art. 13 ust. 3 UDP — weryfikuj pełną listę):
  → Pojazdy Sił Zbrojnych RP / sił zbrojnych obcych (gdy umowa)
  → Służby ratownicze, Straż Graniczna, Policja, ABW, SOP, SWW itp.
  → Pojazd zaprzęgowy
  → Pojazd z kartą parkingową (dla osoby niepełnosprawnej) — TYLKO na miejscu z kopertą
    ⚠️ Karta musi być widoczna za szybą! (wyrok WSA Białystok II SA/Bk 159/24)
  → Inne zwolnienia lokalne uchwałą rady gminy (np. mieszkańcy, pierwsze 15 min.)

ODHOLOWANIE (rozporządzenie MI — weryfikuj aktualne stawki):
  Pojazd osobowy (do 3,5 t): max ok. 749 zł (2026 — weryfikuj!)
  Przechowywanie na parkingu strzeżonym: ok. 65 zł/dobę (2026 — weryfikuj!)
  Motocykl: ok. 348 zł odholowanie
  web_search: "odholowanie samochodu maksymalna opłata 2026 rozporządzenie"
```

---

## 3. TRYB OBRONY — KROK PO KROKU

### A. Gdy dostałeś ZAWIADOMIENIE (wezwanie do zapłaty) za wycieraczką
```
STATUS: Wezwanie = pismo informacyjne, NIE decyzja, NIE tytuł wykonawczy

OPCJA 1: Zapłacić (jeśli słuszne)
  → Zazwyczaj: obniżona stawka przy szybkiej płatności (weryfikuj uchwałę gminy)
  → Termin: zgodnie z zawiadomieniem (zazwyczaj 14–30 dni)

OPCJA 2: NIE płacić gdy niesłuszne
  → NIE składaj skargi do WSA! (odrzucona — brak zaskarżalności)
  → Poczekaj na wszczęcie egzekucji
  → WTEDY: złóż ZARZUTY do tytułu wykonawczego (art. 33 UPEA)

OPCJA 3: Reklamacja do zarządcy drogi (nieformalnie)
  → Brak formalnej podstawy, ale często skuteczna praktycznie
  → Zwróć się pisemnie / przez BIP / e-mail z dowodem braku naruszenia
  → Zarząd drogi może cofnąć zawiadomienie przed egzekucją
  → KLUCZOWE: zachowaj dowody (zdjęcia, paragon z parkomatu, potwierdzenie płatności)
```

### B. Gdy dostałeś TYTUŁ WYKONAWCZY (TW) — egzekucja wszczęta
```
TERMIN: 7 DNI od doręczenia TW → ZARZUTY (art. 33 UPEA) — TERMIN ZAWITY!

PODSTAWY ZARZUTÓW (art. 33 §1 UPEA — weryfikuj aktualną listę):
  1. Wykonanie, umorzenie, przedawnienie lub wygaśnięcie obowiązku
  2. Odroczenie terminu wykonania / rozłożenie na raty
  3. Błąd co do osoby zobowiązanego
  4. Brak wymagalności (np. termin nie upłynął)
  5. Brak prawnego obowiązku (np. spoza SPP, brak oznakowania)
  6. Brak wymagalności decyzji (gdy podstawą jest decyzja)
  7. Inne wady formalne TW

NAJSKUTECZNIEJSZE ARGUMENTY w sprawach parkingowych:
  □ Pojazd nie stał w SPP/ŚSPP (poza granicami strefy — wymagaj mapy strefy)
  □ Pojazd stał w miejscu WYZNACZONYM dla niepełnosprawnych + karta był widoczna
  □ Opłata był wniesiona (dowód płatności: paragon, SMS, aplikacja)
  □ Pojazd był uprawniony do zwolnienia z mocy prawa (służby ratownicze itp.)
  □ Brak właściwego oznakowania (znak D-44/D-44b) w miejscu postoju
  □ Uchwała gminy wadliwa (niezgodna z UDP) — argument do zaskarżenia uchwały
  □ Przedawnienie 5 lat od powstania obowiązku (weryfikuj art. 70 OP + orzecz. NSA)

ORGAN ROZPATRUJĄCY ZARZUTY:
  → Organ egzekucyjny (naczelnik US, wójt/burmistrz/prezydent)
  → Wierzyciel (zarządca drogi) — opiniuje zasadność
  → Postanowienie o uznaniu/odrzuceniu zarzutów
  → Zażalenie: do organu wyższego stopnia w 7 dni
  → Skarga do WSA: po wyczerpaniu trybu administracyjnego
```

### C. Parking prywatny — odrębny reżim prawny
```
Parking na terenie galerii, osiedla, centrum handlowego = NIE podlega UDP
  → Umowa cywilna (art. 750 KC — umowa o świadczenie usług)
  → Zasady określone w regulaminie parkingu (tabela/tablice)
  → Spór: droga cywilna (sąd powszechny) lub ADR
  → KLAUZULE ABUZYWNE: jeśli stawka kary nieproporcjonalna (art. 385¹ KC)
  → Rejestr klauzul niedozwolonych: rejestr.uokik.gov.pl
  → Decyzje UOKiK ws. parkingów: uokik.gov.pl

POPULARNE SCHEMATY PRYWATNYCH PARKINGOW:
  → "Opłata manipulacyjna" za brak biletu — weryfikuj klauzule w regulaminie
  → Monitoring + "wezwanie do zapłaty" od firmy zewnętrznej
  → W orzecznictwie: firmy windykacyjne działające w imieniu właścicieli parkingów
    → sprawdź legalność cesji wierzytelności i umowy z właścicielem parkingu
  → web_search: "parking prywatny wezwanie do zapłaty klauzula abuzywna UOKiK 2024 2025"
```

---

## 4. KARTA PARKINGOWA

```
Podstawa: art. 8 ust. 1–1b Prawo o ruchu drogowym (weryfikuj w ISAP — Dz.U. 2024 poz. 1251)
Organ wydający: starosta (PCPR)

UPRAWNIENIA Z KARTY PARKINGOWEJ:
  → Parkowanie na miejscach oznaczonych kopią (niebieska koperta) dla niepełnosprawnych
  → Zwolnienie z opłat parkingowych w SPP/ŚSPP — pod warunkiem:
    • Karta jest WIDOCZNA za przednią szybą
    • Pojazd stoi na MIEJSCU WYZNACZONYM (koperta), nie na zwykłym miejscu
  ⚠️ Karta nie zwalnia z parkowania w miejscach zabronionych (bezwzględny zakaz)
  ⚠️ Karta za szybą — musi być czytelna dla kontrolera (wyrok WSA Białystok 2024)

ODMOWA UZNANIA KARTY przez zarządcę:
  → Najpierw: dokumentacja fotograficzna karty w pojeździe (własne zdjęcia)
  → Następnie: zarzuty do TW gdy egzekucja (błąd co do osoby / brak obowiązku)
  → web_search: "karta parkingowa strefa SPP zwolnienie z opłat kontroler 2024 2025"
```

---

## 5. ZASKARŻENIE UCHWAŁY RADY GMINY O SPP/ŚSPP

```
Uchwała rady gminy o SPP/ŚSPP = akt prawa miejscowego

KTO MOŻE ZASKARŻYĆ:
  → Każdy czyj interes prawny/uprawnienie naruszono (art. 101 ustawy o samorządzie gminnym)
  → Termin: 30 dni od dowiedzenia się o uchwale

PODSTAWY ZASKARŻENIA:
  □ Stawki powyżej maksimum z UDP (art. 13b ust. 4)
  □ Strefa ustalona bez wymaganej analizy ruchu/deficytu miejsc
  □ Brak wymaganych elementów uchwały
  □ Uchwała wprowadzona bez zachowania wymaganej procedury

TRYB: skarga do WSA → wyrok → kasacja do NSA (30 dni)

WERYFIKUJ: orzeczenia.nsa.gov.pl → "SPP uchwała rady gminy zaskarżenie 2023 2024 2025"
```

---

## 6. QUALITY GATE

```
□ Czy to SPP/ŚSPP (droga publiczna) czy parking prywatny?
  → Dwie różne ścieżki prawne!
□ Co mamy: wezwanie do zapłaty / tytuł wykonawczy / egzekucja czynna?
□ Tytuł wykonawczy → TERMIN 7 DNI NA ZARZUTY (ZAWITY!) — sprawdź datę doręczenia
□ Czy postój był w wyznaczonym miejscu w strefie?
□ Czy pojazd miał kartę parkingową widoczną za szybą?
□ Czy opłata była wniesiona (zachowaj dowód: paragon, SMS, potwierdzenie app)?
□ Czy miejsca zostały właściwie oznakowane (znaki D-44/D-44b)?
□ Stawki opłat: weryfikuj przez web_search aktualną uchwałę gminy
□ Nie składaj skargi do WSA na wezwanie — tylko zarzuty w egzekucji!
```

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| Zarzuty do TW (art. 33 UPEA) | `pisma-procesowe-v3` + `dr-05/mod-UPEA-egzekucja-administracyjna` |
| Klauzule abuzywne parking prywatny | `analizator-umow-v1` → `mod-shared-abusive-clauses` |
| Zaskarżenie uchwały SPP | `pisma-procesowe-v3` + `dr-05/mod-KPA-postepowanie-administracyjne` |
| Kara za wykroczenie parkingowe (art. 92 KW) | `mod-KW-kodeks-wykroczen` + `mod-grzywny-mandaty-szczegolowe` |
| Odwołanie od decyzji administracyjnej | `dr-05/mod-KPA-postepowanie-administracyjne` |
| Grzywny i mandaty karne | `mod-grzywny-mandaty-szczegolowe` |

---

## ŹRÓDŁA ONLINE

```
UDP t.j.: isap.sejm.gov.pl → WDU20250000889 → art. 13, 13b, 13f
UPEA t.j.: isap.sejm.gov.pl → WDU20230002505 → art. 33 (zarzuty)
KW: isap.sejm.gov.pl → WDU20250000734

NSA orzecznictwo (parkingowe):
  orzeczenia.nsa.gov.pl → szukaj: "strefa płatnego parkowania opłata dodatkowa zaskarżenie"
WSA Białystok II SA/Bk 159/24 z 28.05.2024:
  orzeczenia.ms.gov.pl → wyszukaj sygn. po weryfikacji URL

web_search:
  "SPP ŚSPP stawki 2026 maksymalne minimalne wynagrodzenie"
  "opłata dodatkowa parkingowa maksymalna 2026 kwota gmina"
  "karta parkingowa strefa SPP zwolnienie z opłat 2024 2025 NSA"
  "odholowanie samochód stawki maksymalne 2026 rozporządzenie MI"
  "parking prywatny wezwanie zapłaty klauzula abuzywna UOKiK 2024 2025"
  "uchwała SPP zaskarżenie WSA NSA 2024 2025"
```

---
*mod-UDP-strefy-platnego-parkowania.md · DR-08 · 2026-06-09*
*Podstawa: UDP (Dz.U. 2025 poz. 889) + UPEA (Dz.U. 2023 poz. 2505) + KW (Dz.U. 2025 poz. 734)*
*Weryfikuj stawki: web_search co roku (% płacy minimalnej)*
