## KROK F — WALIDACJA PISMA UŻYTKOWNIKA

### F.0 — SELEKTOR TRYBU

```
Domyślnie (gdy użytkownik mówi tylko "sprawdź to pismo" / wkleja pismo bez
dalszych wskazań) → wykonaj WSZYSTKIE TRZY tryby (F.2-F.4 jak dotychczas).

Jeśli użytkownik wskazuje konkretny tryb — ogranicz się do niego:

"sprawdź formalnie" / "czy to się da wysłać"
  → TRYB FORMALNY = F.4 (kompletność: strony, podpis, sygnatura, termin,
    opłata, odpisy, załączniki). Pyta: "czy pismo jest poprawnie zbudowane?"

"sprawdź merytorycznie" / "czy te argumenty mają sens" / "czy to dobrze
uzasadnione"
  → TRYB MERYTORYCZNY = F.2 (przepisy) + F.3 (orzeczenia) + NOWA sekcja F.5
    (ocena argumentacji: spójność, siła, ogólniki, twierdzenia bez
    dowodu). Pyta: "czy treść ma sens i jest dobrze uzasadniona?"

"sprawdź procesowo" / "co z tym dalej" / "czy muszę odpowiadać" / "czy to
pilne"
  → TRYB PROCESOWY = NOWA sekcja F.6 (terminy, skutki, ryzyka, co dalej —
    konsumuje KROK G + shared/TERM-CALC + shared/STRATEGIA-PROCESOWA).
    Pyta: "co to pismo oznacza dla sprawy i co robić dalej?"

"sprawdź wszystko" / "pełna analiza"
  → wszystkie cztery: F.4 + (F.2+F.3+F.5) + F.6, w tej kolejności

Po raporcie (niezależnie od trybu) — jeśli użytkownik prosi też o POPRAWKI
("...i popraw", "...i wygładź", "...i skróć") → po raporcie przejdź do
`pisma-procesowe-v3/modules/MOD-REDAKCJA.md` (Test C), wykorzystując ustalenia
z raportu jako input do R.4 KROK 2 (diagnoza). Sam raport NIE zmienia treści
pisma — zmiana treści to zawsze MOD-REDAKCJA.
```

### F.1 Informacja wstępna

```
JEŚLI tryb = WSZYSTKO (domyślny):
"Sprawdzę Twoje pismo pod trzema kątami:
1️⃣ Czy przepisy (artykuły) są prawdziwe i aktualne
2️⃣ Czy wyroki sądów które cytujesz istnieją i pasują
3️⃣ Czy pismo jest formalnie kompletne
4️⃣ Co to pismo oznacza w praktyce i co dalej

To chwilę zajmie — sprawdzam przepisy w oficjalnym systemie."

JEŚLI tryb = konkretny (FORMALNY/MERYTORYCZNY/PROCESOWY):
"Sprawdzę to [formalnie / merytorycznie / pod kątem dalszych kroków].
[krótkie 1-zdaniowe wyjaśnienie co to znaczy z F.0]"
```

### F.1b — TEZA-GATE (obowiązkowy, przed F.2-F.6 — naprawa F-7/ZASADA 11, 2026-07-15)

```
⛔ Zanim uruchomisz KTÓRYKOLWIEK z trybów F.2-F.6, zrekonstruuj JEDNYM
ZDANIEM tezę centralną dostarczonego pisma: czego strona żąda i na jakiej
podstawie. Wypisz to jawnie w odpowiedzi, przed wynikami walidacji.

Powód: F.2/F.3/F.4 mogą wszystkie wypaść pozytywnie (poprawne przepisy,
poprawne orzeczenia, kompletność formalna), podczas gdy pismo jako CAŁOŚĆ
broni innej albo słabszej tezy niż zakłada użytkownik — bez jawnej
rekonstrukcji tezy centralnej taki rozjazd łatwo przeoczyć, bo każdy tryb
sprawdza swój wąski wycinek (cytat/formę/skutek), nie całość roszczenia.

Jeśli pismo dotyczy kilku roszczeń/zarzutów → osobna teza per wątek.
```

### F.2 Walidacja przepisów (dla każdego art./§)

```
PROCEDURA:
1. Zidentyfikuj wszystkie "art. X" / "§ Y" / "ustawa z dnia..."
2. web_fetch isap.sejm.gov.pl → sprawdź istnienie i brzmienie
3. Sprawdź nowelizacje po dacie zdarzenia

WYNIK DLA LAIKA:
✅ art. 503 KPC — POPRAWNY. Daje Ci prawo do zaprzeczenia nakazowi.
⚠ art. 415 KC — PRAWIDŁOWY, ale NIEKOMPLETNY.
   Żeby wygrać na tej podstawie musisz udowodnić 3 rzeczy:
   (1) wina, (2) szkoda, (3) związek między nimi. Brakuje (3).
❌ art. 22 KP ust. 1b — NIE ISTNIEJE w tej numeracji.
   Prawdopodobnie chodziło o art. 22¹ KP. Popraw przed złożeniem.
```

### F.3 Walidacja orzeczeń

```
Dla każdej sygnatury:
1. web_search "[sygnatura] [sąd] [rok]"
2. web_fetch sn.pl / orzeczenia.ms.gov.pl / saos.org.pl

✅ ZWERYFIKOWANE I PASUJE — możesz bezpiecznie użyć
⚠ ZWERYFIKOWANE, ale RYZYKOWNE — stan faktyczny się różni, wyjaśnij analogię
❌ NIE ZNALEZIONE — usuń, znajdę zamiennik jeśli chcesz
```

### F.4 Walidacja formalna

```
□ TERMIN: oblicz od daty doręczenia → "[data]. Zostało [X] dni."
□ SĄD: Rejonowy (do 75 000 zł) / Okręgowy (powyżej) + właściwość miejscowa
□ OPŁATA: art. KSCU → "[kwota] zł — przelew na rachunek sądu"
□ DANE STRON: kompletne (imię, nazwisko/firma, adres, PESEL/NIP)
□ PODPIS: miejsce na podpis w piśmie
□ ODPISY: "[X+1] egzemplarzy — sąd + strona + Ty"
□ ZAŁĄCZNIKI: wszystkie wymienione dołączone
```

### F.5 Ocena argumentacji (TRYB MERYTORYCZNY)

```
Uzupełnia F.2 (przepisy) i F.3 (orzeczenia) — F.2/F.3 sprawdzają czy
PRZYWOŁANE źródła są prawdziwe; F.5 sprawdza czy ARGUMENTACJA jako całość
ma sens, niezależnie od poprawności poszczególnych cytatów.

view /mnt/skills/user/shared/QUALITY-CHECK.md

□ SPÓJNOŚĆ: czy argumenty wynikają jeden z drugiego, czy są ze sobą
  niesprzeczne (daty, kwoty, twierdzenia)?
□ POKRYCIE DOWODOWE: czy każde istotne twierdzenie ma wskazany dowód, czy
  jest gołosłowne?
□ OGÓLNIKI: czy są sformułowania zbyt ogólne by sąd/organ mógł na nich
  oprzeć rozstrzygnięcie ("wnoszę o sprawiedliwe rozstrzygnięcie")?
□ NAJSILNIEJSZY ARGUMENT: który argument w piśmie jest najmocniejszy
  (oparty na dokumencie/przepisie bez wątpliwości) — wskaż go
□ NAJSŁABSZY ARGUMENT: który argument jest najbardziej narażony na atak
  (brak dowodu, sprzeczność, ogólnik) — wskaż go i czy warto go usunąć
  czy wzmocnić
□ ODPOWIEDŹ NA ZARZUTY PRZECIWNIKA (jeśli pismo jest odpowiedzią/ripostą):
  czy każdy istotny zarzut strony przeciwnej ma odniesienie w piśmie, czy
  coś zostało przemilczane?

WYNIK DLA LAIKA:
"Najmocniejszy argument w Twoim piśmie to [...] — to się dobrze trzyma.
Najsłabszy to [...] — bo [...]. [Jeśli dotyczy:] Pismo nie odnosi się do
zarzutu przeciwnika o [...] — warto to dodać albo wyjaśnić czemu nie ma
znaczenia."

WYNIK DLA PRAWNIKA:
"Argumentacja: [spójna/częściowo spójna/niespójna — dlaczego].
Pokrycie dowodowe: [n]/[m] twierdzeń kluczowych ma wskazany dowód.
Najsilniejszy: [...]. Najsłabszy: [...]. Braki w odniesieniu do zarzutów
przeciwnika: [...]."

Jeśli sprawa jest złożona (≥2 dokumenty, wiele wątków) — zaproponuj
`analizator-dowodow-v3` (MP3/MP4) dla głębszej analizy niż F.5 oferuje
w trybie szybkim.
```

### F.6 Skutki i dalsze kroki (TRYB PROCESOWY)

```
Pyta: "co to pismo oznacza dla sprawy i co robić dalej?" — NIE ocenia
poprawności pisma (to F.2-F.5), lecz jego KONSEKWENCJE.

□ TERMIN: zob. KROK G (ZAWSZE PIERWSZE w tym trybie) — czy pismo uruchamia
  termin na reakcję? Jaki i od kiedy biegnie?
view /mnt/skills/user/shared/TERM-CALC.md  (jeśli potrzebne obliczenie)

□ OBOWIĄZEK REAKCJI: czy brak odpowiedzi na to pismo ma skutek (np.
  uznanie twierdzeń, prekluzja, domyślne rozstrzygnięcie)?
view /mnt/skills/user/shared/PREKLUZJA-DOWODOWA.md  (jeśli dotyczy)

□ RYZYKO: czy pismo (własne lub przeciwnika) zawiera coś, co działa na
  niekorzyść użytkownika — przyznanie, brak zarzutu, przekroczony termin?

□ KOSZT: jeśli pismo wszczyna postępowanie lub jest odpowiedzią na
  wezwanie do zapłaty — czy są koszty do rozważenia (opłata, ryzyko kosztów
  przegranej)?
view /mnt/skills/user/analizator-dowodow-v3/modules/MP10-koszty.md  (jeśli
  potrzebna głębsza analiza kosztowa)

□ DALSZY KROK: konkretna rekomendacja — co złożyć, do kiedy, w jakiej
  kolejności
view /mnt/skills/user/shared/STRATEGIA-PROCESOWA.md  (jeśli sprawa wymaga
  decyzji taktycznej, nie tylko jednego kroku)

WYNIK DLA LAIKA:
"To pismo [wymaga / nie wymaga] odpowiedzi. [Jeśli wymaga:] Masz [X] dni
od [zdarzenie], czyli do [data]. Jeśli nie odpowiesz, [konsekwencja].
Polecam: [konkretny następny krok]."

WYNIK DLA PRAWNIKA:
"Termin: [X dni od Y, podstawa: art. Z — ⚠ niezweryfikowane/✅ zweryfikowane].
Skutek braku reakcji: [...]. Rekomendowany krok: [...]. Ryzyka: [...]."

Zakończ zawsze KROK I (mapa opcji).
```

---

