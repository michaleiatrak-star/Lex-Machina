# KSCU — koszty sądowe w sprawach cywilnych

**Stan weryfikacji:** 2026-08-28  
**Tekst jednolity:** Dz.U. 2025 poz. 1228  
**Źródło kanoniczne:** ELI/ISAP  
**Zakres modułu:** ustawa z 28.07.2005 r. o kosztach sądowych w sprawach cywilnych. Moduł nie obejmuje opłat w sprawach karnych ani prawa pomocy w PPSA.

## 1. Bramka źródłowa

ELI: `https://eli.gov.pl/eli/DU/2025/1228/ogl`

ELI oznacza tekst jednolity Dz.U. 2025 poz. 1228 jako obowiązujący. Przed podaniem kwoty, progu, podstawy zwolnienia albo opłaty od konkretnego pisma pobierz aktualne brzmienie właściwego przepisu i sprawdź późniejsze akty zmieniające.

**Zasada runtime:** moduł nie utrwala tabel kwot, które mogą ulec zmianie. Kwota jest wynikiem fresh gate do przepisu, nie stałą wiedzą modułu.

## 2. Zakres ustawy — art. 1–3

Ustawa reguluje koszty sądowe w sprawach cywilnych oraz zasady ich ponoszenia, zwrotu i zwolnienia od kosztów.

Art. 2 rozdziela koszty sądowe na:
- **opłaty**;
- **wydatki**.

Art. 3 wskazuje pisma i czynności podlegające opłacie. Nie zakładaj, że każde pismo inicjujące albo zaskarżające ma tę samą konstrukcję opłaty.

## 3. Intake kosztowy

Przed obliczeniem lub oceną kosztu ustal:
1. rodzaj sprawy i tryb KPC;
2. dokładny rodzaj pisma/czynności;
3. wartość przedmiotu sporu lub zaskarżenia, jeżeli ma znaczenie;
4. czy ustawa przewiduje opłatę stałą, stosunkową, podstawową albo inną;
5. czy istnieje ustawowe zwolnienie podmiotowe/przedmiotowe;
6. czy strona wnosi o zwolnienie od kosztów;
7. czy chodzi o opłatę, wydatek, zaliczkę czy wynagrodzenie pełnomocnika — to odrębne kategorie;
8. czy pismo jest środkiem zaskarżenia, skargą na czynność komornika, skargą na orzeczenie referendarza albo innym szczególnym pismem.

## 4. Opłaty — kwalifikator

Dla każdej opłaty wykonaj ten schemat:

```text
Pismo / czynność
  ↓
Czy KSCU przewiduje obowiązek opłaty?
  ↓
Jaki rodzaj opłaty?
  ↓
Jaka podstawa obliczenia / przedział / limit z aktualnego przepisu?
  ↓
Czy działa zwolnienie ustawowe albo sądowe?
  ↓
Czy opłata została prawidłowo uiszczona i w terminie?
  ↓
Jaki skutek proceduralny ma brak / niedopłata w konkretnym trybie KPC?
```

Nie wyprowadzaj skutku brakującej opłaty wyłącznie z KSCU — dołącz aktualny KPC, bo sposób sanowania braku i skutek zależą od rodzaju pisma i statusu strony/pełnomocnika.

## 5. Wydatki i zaliczki

Wydatki obejmują koszty czynności i osób uczestniczących w postępowaniu w przypadkach określonych ustawą. Przy biegłym, tłumaczu, świadku albo innej czynności ustal:
- kto tymczasowo ponosi wydatek;
- czy sąd żąda zaliczki;
- termin i skutek jej nieuiszczenia;
- końcowe rozliczenie w orzeczeniu o kosztach.

Wysokość wynagrodzeń biegłych i część innych należności może wynikać z aktów wykonawczych — pobieraj aktualny akt z ELI.

## 6. Zwolnienie od kosztów

Zwolnienie od kosztów sądowych jest odrębną instytucją od końcowego rozstrzygnięcia o kosztach procesu oraz od ustanowienia pełnomocnika z urzędu.

Przy wniosku ustal:
- osoba fizyczna czy osoba prawna/jednostka organizacyjna;
- zakres żądanego zwolnienia;
- aktualne ustawowe przesłanki;
- wymagane oświadczenia, dokumenty i formularze;
- czy sąd może zwolnić częściowo;
- właściwy środek zaskarżenia od odmowy według aktualnego KPC/KSCU.

Nie utrwalaj w module uproszczonego hasła „brak uszczerbku dla koniecznego utrzymania” jako kompletnej przesłanki dla wszystkich podmiotów — odczytaj właściwy przepis dla konkretnej kategorii strony.

## 7. Szczególne pisma i skargi

KSCU ma szczególne regulacje m.in. dla:
- środków zaskarżenia;
- skargi na czynności komornika;
- skargi na orzeczenie referendarza;
- niektórych postępowań rejestrowych, egzekucyjnych i nieprocesowych;
- spraw regulacyjnych i innych postępowań szczególnych.

**Fresh gate obowiązkowy:** przed podaniem opłaty od konkretnego pisma odczytaj właściwą jednostkę KSCU. Nie korzystaj z historycznej tabeli stawek zapisanej w module.

## 8. Koszty pełnomocnika i pomoc z urzędu

Rozdziel:
1. **koszty sądowe** — KSCU;
2. **koszty procesu / zwrot kosztów zastępstwa** — KPC + aktualne rozporządzenia o opłatach za czynności adwokata/radcy;
3. **pomoc prawna udzielona z urzędu** — właściwe aktualne rozporządzenia Ministra Sprawiedliwości;
4. **prawo pomocy przed sądem administracyjnym** — PPSA, DR-05.

Nie stosuj jednego rozporządzenia ani jednej tabeli do wszystkich czterech kategorii.

## 9. Routing

- KPC i skutek procesowy opłaty → DR-02;
- egzekucja / skarga na komornika → DR-02;
- adwokat / radca i stawki zawodowe → DR-12;
- PPSA / prawo pomocy → DR-05;
- opłaty w sprawach karnych → DR-03, odrębna ustawa.

## 10. Quality gate

- [ ] aktualny Dz.U. 2025 poz. 1228 sprawdzony w ELI/ISAP;
- [ ] sprawdzono późniejsze zmiany po tekście jednolitym;
- [ ] zakwalifikowano rodzaj kosztu: opłata / wydatek / zaliczka / koszt zastępstwa;
- [ ] rodzaj opłaty i jej kwotę pobrano z aktualnego przepisu;
- [ ] zwolnienie oceniono według właściwej kategorii strony;
- [ ] proceduralny skutek braku opłaty zweryfikowano także w KPC;
- [ ] nie pomylono KSCU z opłatami karnymi ani prawem pomocy PPSA.

## 11. Źródło urzędowe

- ELI — ustawa o kosztach sądowych w sprawach cywilnych, Dz.U. 2025 poz. 1228: `https://eli.gov.pl/eli/DU/2025/1228/ogl`

Akty wykonawcze dotyczące biegłych, pełnomocników i sposobu uiszczania opłat pobieraj każdorazowo z ELI/ISAP.
