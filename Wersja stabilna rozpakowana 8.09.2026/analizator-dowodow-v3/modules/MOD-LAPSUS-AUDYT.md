# MOD-LAPSUS-AUDYT — Audytor Błędów Autorskich Pisma Procesowego

> Wersja: 1.0.0 | Typ: moduł analityczny | Wywoływany z: BLOK J analizator-dowodow-v3

---

## Przeznaczenie

Wykrywa, klasyfikuje i ocenia błędy popełniane przez autora pisma procesowego — z uwzględnieniem intencji autora, kontekstu reprezentowanej strony i skutku procesowego. Stosuje się do każdego pisma procesowego, wezwania, pozwu, odpowiedzi lub korespondencji prawnej gdy znany jest autor i reprezentowana strona.

> ⛔ HARD GATE: przepisy prawne powołane w ocenie błędów [LA-LEGAL] i [LA-KWALIFIKACJA-PRAWNA] wymagają weryfikacji w ISAP przed powołaniem w piśmie procesowym.

---

## Protokół wykonania

### KROK L0 — Ustal kontekst przed analizą (obowiązkowy)

```
Odpowiedz na wszystkie pytania przed przystąpieniem do skanowania:

A. Kim jest autor pisma?
   → imię, nazwisko, kancelaria, rola (pełnomocnik / strona pro se / organ)

B. Kogo reprezentuje?
   → Powoda / Pozwanego / Pozwaną / obie strony / podmiot trzeci

C. Jaki jest prawidłowy rodzaj gramatyczny każdej strony w tej sprawie?
   → Powód [M] / Powódka [F] / Pozwany [M] / Pozwana [F] / Pozwani / spółka
   Uwaga: spółka z o.o. = rodzaj żeński w kontekście procesowym ("Pozwana")

D. Jakie są pełne, prawidłowe nazwy wszystkich podmiotów w sprawie?
   → Wpisz dosłownie z KRS / nagłówka pozwu / postanowienia o wszczęciu

E. Jaki jest zakres zobowiązania Sądu lub temat pisma?
   → Data, przedmiot, na co odpowiada pismo

Bez wypełnienia L0 nie przystępuj do skanowania — brak kontekstu = ryzyko
zakwalifikowania celowej strategii jako lapsusu.
```

---

### KROK L1 — Skan błędów formalnych i identyfikacyjnych

Przed analizą merytoryczną — przegląd każdego elementu nagłówka:

```
[ ] Sygnatura akt — czy odpowiada sygnaturze sprawy we wszystkich miejscach pisma?
    Test: "VII P" ≠ "VIP", "I ACa" ≠ "IACa"
    → [LA-SYGNATURA] jeśli niezgodność

[ ] Nazwy podmiotów w nagłówku i treści — czy są identyczne?
    Test: nagłówek wymienia A i B; treść powołuje A i A = [LA-PODMIOT-POWTORZONY]

[ ] Pełna nazwa spółki — cyfra zero vs litera o, Ltd vs ltd, sp. z o.o. vs sp zo.o.
    → [LA-NAZWA-PODMIOT]

[ ] Dane kontaktowe kancelarii — adres e-mail, numer telefonu, adres doręczeń
    → [LA-FORMAL-ADRES] jeśli adres niedoręczalny lub zawiera błąd

[ ] Data pisma vs daty powołanych dokumentów / zdarzeń
    → [LA-DATA-PRZYSZLA] jeśli data dokumentu późniejsza niż data pisma

[ ] Rodzaj gramatyczny każdej strony — we wszystkich wystąpieniach w piśmie
    Skanuj: "powódki/powoda", "pozwanego/pozwanej", "mocodawcy/mocodawców"
    → [LA-RODZAJ] przy każdej rozbieżności
```

---

### KROK L2 — Skan 22 typów lapsusów (pełna lista)

Dla każdego wykrytego lapsusu wypełnij kartę L3.

#### KATEGORIA I — BŁĘDY PODMIOTÓW I NAZEWNICTWA

```
[LA-RODZAJ]
Wzorzec: błędny rodzaj gramatyczny nazwy strony procesowej
Test: czy forma "powódki/pozwanego" odpowiada płci/rodzajowi prawnemu strony w tej sprawie?
Źródło: prawo.pl (były sędzia) — kopiowanie wzorców bez zmiany płci uczestników
         jest jednym z najczęstszych błędów przy pracy na gotowych formularzach
Przykład: "od powódki" gdy Powód to mężczyzna; "Pozwany oświadcza" gdy Pozwana to spółka

[LA-PODMIOT]
Wzorzec: zdanie gramatycznie przypisuje działanie/twierdzenie błędnej stronie
Test: kto jest gramatycznym podmiotem zdania vs kto powinien nim być według intencji autora?
Źródło: Lawyers Mutual — "inny pozwany pojawia się w uzasadnieniu, a inny w żądaniu pozwu"
Przykład: "powód nie zapłacił" gdy chodzi o pozwanego; zaimek "on/ona" przy zmianie tematu

[LA-PODMIOT-POWTORZONY]
Wzorzec: w nagłówku wymienione podmioty A i B; w treści A i A (ta sama dwa razy)
Test: czy każdy podmiot z nagłówka pojawia się w treści pisma pod własną nazwą?
Źródło: Infoware — "copy-paste without updating party names"
Przykład: wezwanie w imieniu "Human Park Global i Human Park Global" zamiast
          "Human Park Global i Human Park"

[LA-NAZWA-PODMIOT]
Wzorzec: niejednolity zapis nazwy tego samego podmiotu w obrębie pisma
Test: czy każde wystąpienie nazwy podmiotu jest identyczne co do każdej litery i znaku?
Sprawdź: cyfra 0 vs litera o; Ltd vs ltd vs itd; sp. z o.o. vs sp z o.o.
Źródło: Knackly — "names being spelled different ways in different places"
Przykład: "Eurorwa" vs "Euronwa"; "sp. z o.0." vs "sp. z o.o."

[LA-OSOBA-MYLONA]
Wzorzec: dwie różne osoby o podobnych imionach lub nazwisku traktowane jako jedna
Test: czy wszystkie warianty zapisu odnoszą się do tej samej osoby wg danych identyfikacyjnych?
Źródło: prawo.pl — "zapewne branie wielu zleceń na raz"
Przykład: Bishal Poudel (pokwitowanie) ≠ Bishwas Pudasaini (świadek)
```

#### KATEGORIA II — BŁĘDY KWALIFIKACJI PRAWNEJ

```
[LA-KWALIF]
Wzorzec: dwie wzajemnie sprzeczne kwalifikacje prawne tej samej okoliczności
Test: czy kwalifikacja X i kwalifikacja Y mogą być jednocześnie prawdziwe w polskim prawie?
Źródło: BARBRI — "contradictory clauses are among the most common and damaging mistakes"
Przykład: "zaliczka" (art. 91 KP) i "nienależnie pobrane" (art. 405 KC) dla tej samej kwoty

[LA-KWALIFIKACJA-PRAWNA]
Wzorzec: użyte sformułowanie osłabia ustawowe znamię na które się powołuje
Test: czy słowa użyte przez autora odpowiadają językowi ustawy lub są od niego słabsze?
Weryfikacja: sprawdź dosłowne brzmienie znamion przepisu w ISAP ⚠️ HARDGATE
Przykład: "wywołują wrażenie nękania" zamiast "wzbudza uzasadnione poczucie zagrożenia"
          (art. 190a §1 KK) — "wrażenie" to kategoria subiektywna, znamię wymaga obiektywności

[LA-KWALIFIKACJA-TECHNICZNA]
Wzorzec: wniosek prawny oparty na błędnym założeniu co do mechanizmu technicznego
Test: czy autor rozumie jak działa powołana technologia / rejestr / system?
Weryfikacja: skonsultować z ekspertem technicznym przed powołaniem
Przykład: "podpisano profilem zaufanym na komputerze służbowym" — profil zaufany
          jest przypisany do osoby (PESEL), nie do urządzenia; można podpisać z dowolnego miejsca

[LA-LEGAL]
Wzorzec: powołanie przepisu o zakresie węższym niż teza wniosku
Test: czy zakres normy art. X obejmuje skutek Y który autor wywodzi?
Weryfikacja: treść przepisu w ISAP ⚠️ HARDGATE
Przykład: art. 3 u.r.p. chroni informacje z pomocy prawnej → nie wyłącza świadka in toto
          z przesłuchania co do faktów nieobjętych tajemnicą

[LA-BRAK-KONKRETYZACJI]
Wzorzec: żądanie lub wezwanie bez wskazania konkretnego czynu, daty, zakresu lub adresata
Test: czy adresat pisma wie co dokładnie ma zrobić / czego zaprzestać i od kiedy?
Źródło: BriefCatch — "vague language forces readers to guess what you mean"
Przykład: "wezwanie do zaprzestania naruszeń" bez wskazania które zachowania, kiedy,
          przez jaki kanał i od kiedy stanowią naruszenie

[LA-WNIOSEK-W-FAKCIE]
Wzorzec: fakt sformułowany jako wniosek prawny lub konkluzja normatywna
         zamiast opisu zdarzenia / zachowania / stanu
Test: czy zdanie opisuje konkretne działanie/stan z datą i podmiotem,
      czy orzeka o skutku prawnym?
Weryfikacja: usuń zdanie z sekcji faktów; jeśli pismo traci twierdzenie
             faktyczne (nie prawne) → to fakt; jeśli traci tylko ocenę → to wniosek
Przykład błędny:  "Pracodawca naruszył art. 81 §1 KP" (w sekcji Fakty)
Przykład właściwy: "W dniu X pracodawca nie wpuścił powoda na teren zakładu pracy"
Przykład błędny:  "Spółki stanowią jeden organizm gospodarczy" (w sekcji Fakty)
Przykład właściwy: "Obie spółki korzystały z jednego arkusza kadrowego z ciągłą
                   numeracją pracowników bez resetu po zmianie nazwy firmy"
Severity: ISTOTNE — wniosek w sekcji faktów podważa wiarygodność opisu stanu
          faktycznego; sąd lub przeciwnik może zakwestionować całą sekcję
          jako stronniczą, nie faktograficzną
Wzorzec: JEDNOSTKOWY (jeśli powtarza się → SYSTEMOWY)
Kontekst autora: często wynika z kopiowania sekcji "Uzasadnienie prawne" do
                 sekcji "Fakty" lub z braku rozdzielenia poziomów analizy
Źródło: DTA W2 — zasada "AI nie zapisuje wniosków, wyciąga wyłącznie fakty"
```

#### KATEGORIA III — BŁĘDY LOGICZNE I ARGUMENTACYJNE

```
[INTRA-SAMOOBALA]
Wzorzec: zdanie A głosi twierdzenie X; zdanie B (w tym samym akapicie) dostarcza
         faktów które X falsyfikują lub mu wprost przeczą
Test: czy fakty podane na uzasadnienie tezy są z nią zgodne?
Źródło: prawo.pl — "uzasadnienia pełne orzecznictwa SN, które nie zawsze pasuje do sprawy"
Przykład: "Powód nie wykonał zobowiązania" + opis szczegółowej treści 30 złożonych przelewów

[LA-PRZYZNANIE-KORZYSTNE]
Wzorzec: twierdzenie użyte przeciwko stronie jednocześnie wzmacnia jej pozycję w innym aspekcie
Test: czy każde twierdzenie faktyczne może być użyte "w drugą stronę" z korzyścią dla adresata?
Źródło: Legal Malpractice taxonomy — "including provisions that undermine client's position"
Przykład: Pozwana przedkłada 10 przelewów na konto Powoda (cel: naruszenie) →
          Powód uzyskuje w aktach 10 dowodów wpłat na własne konto (szkoda/zdolność zarobkowa)

[LA-TEZA-DOWODOWA]
Wzorzec: wniosek dowodowy na okoliczność faktów dotyczących własnego klienta
         zamiast strony przeciwnej
Test: kto jest podmiotem okoliczności wskazywanej we wniosku dowodowym?
     Powinien to być przeciwnik, nie klient autora.
Przykład: "stałe źródło dochodu przez POZWANEGO" gdy intencją było "przez POWODA"

[LA-INTENCJA]
Wzorzec: odpieranie zarzutu który strona przeciwna nigdy nie postawiła
Test: czy twierdzenie kwestionowane przez autora rzeczywiście padło w pismach procesowych?
Źródło: teoria sygnalizowania — odparcie nieistniejącego argumentu sygnalizuje Sądowi
         powiązanie, które autor próbuje zneutralizować
Przykład: "Pozwana zaprzecza aby Bishal Poudel działał jako pełnomocnik Powoda"
          gdy Powód tego nigdy nie twierdził

[LA-NARR]
Wzorzec: opis chronologii lub kontekstu nieświadomie przyznaje kluczowy fakt
         wspierający stronę przeciwną
Test: czy opis faktyczny zawiera sformułowania przyczynowe sugerujące inny skutek
      niż autor zamierza wywieść?
Przykład: "pokłosiem pisma o dyscyplinarce było podpisanie porozumienia" = przyznanie
          przyczynowości groźby → podważa tezę o "dobrowolności" porozumienia

[LA-ZAKRES-DOWODOWY]
Wzorzec: dowód lub wniosek oparty na materiale spoza zakresu zobowiązania Sądu
         lub przedmiotu sprawy
Test: czy data, zakres lub temat powołanego materiału mieści się w zakresie
      wskazanym przez Sąd lub wynikającym z podstawy roszczenia?
Przykład: przelew z 15.11.2024 jako dowód przy zobowiązaniu dot. rachunków
          za wrzesień–październik 2024
```

#### KATEGORIA IV — BŁĘDY DOKUMENTACYJNE

```
[LA-KOSZTY]
Wzorzec: wniosek o koszty z błędnym kierunkiem podmiotów lub formą
Test: czy wniosek "zasądzenie od X na rzecz Y" wskazuje właściwe podmioty
      (X = strona przegrywająca wg stanowiska autora, Y = klient autora)?
Przykład: "od powódki" gdy stroną jest Powód-mężczyzna

[LA-DATA]
Wzorzec: błędny rok lub data w odwołaniu do dokumentu
Test: czy data dokumentu poprzedza zdarzenie, którego dokument dotyczy?
Przykład: "pismo z 7.10.2025" gdy kontekst jednoznacznie wskazuje 7.10.2024

[LA-DATA-PRZYSZLA]
Wzorzec: wniosek oparty na dowodzie datowanym później niż data pisma
Test: data pisma < data powołanego dokumentu → dokument nie istniał przy składaniu
Przykład: pismo z 19.10.2025 wywodzi wniosek z przelewu z 15.11.2025

[LA-KWOTA]
Wzorzec: ta sama operacja finansowa opisana dwoma różnymi kwotami w tym samym piśmie
Test: czy każde wystąpienie kwoty dotyczącej tej samej transakcji jest identyczne?
Przykład: "zwrot 1.060 zł" (s. 1) vs "kwota 1.000 zł" (s. 2) dla tego samego zwrotu

[LA-KWOTA-SLOWNIE-CYFRAMI]
Wzorzec: kwota słowna ≠ kwota cyfrowa w tym samym dokumencie
Test: przelicz kwotę słowną na liczby i porównaj z cyfrową co do grosza
Uwaga: przy niezgodności zazwyczaj decyduje kwota słowna (reguła cywilnoprawna)
Przykład: "1.000,17 zł" (cyfry) vs "tysiąc złotych" (słownie) = różnica 0,17 zł

[LA-ODRECZNIE]
Wzorzec: odręczny dopisek do dokumentu bez własnej daty
Test: czy fragment dopisany odręcznie ma osobną datę wskazującą moment jego powstania?
Znaczenie: brak daty = niemożność weryfikacji czy dopisek pochodzi z tej samej sesji
           co reszta dokumentu; dopisek mógł być dodany przed lub po podpisaniu
Przykład: "przez Michał Wiatrak" dopisane odręcznie w pokwitowaniu Poudela
          (5.12.2024) bez daty przy dopisku

[LA-CHRONOLOGIA]
Wzorzec: narracja w piśmie sprzeczna z datą własnego dokumentu dowodowego
Test: czy data dokumentu powołanego może współistnieć z opisaną chronologią zdarzeń?
Przykład: jeśli "zwrot nastąpił X.2024", a pokwitowanie zwrotu datowane jest przed
          zdarzeniem, które miało uzasadniać zwrot — chronologia jest niemożliwa

[LA-MIESIAC]
Wzorzec: błędny miesiąc rozliczenia w narracji vs treść powołanego dokumentu
Test: czy miesiąc w narracji odpowiada dosłownej treści dokumentu?
Przykład: narracja "potrącenie z wynagrodzenia za wrzesień" vs dokument "za październik"

[LA-PODMIOT-ROLA]
Wzorzec: błędna kwalifikacja roli zawodowej/procesowej osoby trzeciej
Test: jaka jest rzeczywista rola tej osoby wg dokumentów rejestrowych?
Przykład: "radca prawny obsługujący spółkę" gdy osoba jest wspólnikiem kancelarii
          będącej pełnomocnikiem procesowym Pozwanej w tej samej sprawie

[LA-SYGNATURA]
Wzorzec: sygnatura akt zapisana błędnie (błąd liter, cyfr, spacji)
Test: czy sygnatura pisma odpowiada co do każdego znaku sygnaturze z akt sprawy?
Uwaga: może być artefakt OCR — weryfikować w oryginale
Przykład: "VIP 94/25" zamiast "VII P 94/25"
```

---

### KROK L3 — Karta lapsusu (format dla każdego wykrytego błędu)

```
[LA-N] / [INTRA-N]
──────────────────────────────────────────────────────
ID:               LA-1, LA-2... / INTRA-1...
Typ:              [kod z L2]
Autor:            imię i nazwisko / kancelaria / pro se
Dokument:         D0N — nazwa, data, strona/punkt
──────────────────────────────────────────────────────
Cytat dosłowny:   "[...]" — NIGDY nie parafrazuj cytatu w tej rubryce
Zamierzenie:      co autor chciał osiągnąć tym zdaniem/wnioskiem
Skutek rzeczywisty: jak zdanie/wniosek faktycznie działa procesowo
Skutek odwrotny:  TAK / NIE / CZĘŚCIOWY
──────────────────────────────────────────────────────
Severity:         KRYTYCZNE / ISTOTNE / MARGINALNE
                  KRYTYCZNE  = zmienia wynik wniosku lub postępowania
                  ISTOTNE    = osłabia argumentację lub wiarygodność
                  MARGINALNE = błąd edytorski bez skutku procesowego
──────────────────────────────────────────────────────
Wzorzec:          SZABLON / JEDNOSTKOWY / SYSTEMOWY
                  SZABLON   = błąd wynikający z kopiowania wzorca
                  JEDNOSTKOWY = jednorazowy błąd w konkretnym piśmie
                  SYSTEMOWY = powtarza się ≥2 razy u tego samego autora
──────────────────────────────────────────────────────
Status:           potwierdzony / wymaga_weryfikacji_w_oryginale
Rekomendacja:     konkretny krok procesowy dla strony przeciwnej
──────────────────────────────────────────────────────
```

---

### KROK L4 — Zasada kontekstu autora (przed finalizacją)

```
Przed oznaczeniem jako lapsus — sprawdź:

KROK L4a: Czy inny fragment pisma wyjaśnia lub neutralizuje pozorny lapsus?
           Jeśli tak → oznacz "pozorny lapsus — wyjaśniony w [lokalizacja]"

KROK L4b: Czy błąd może być celową strategią procesową?
           Test: czy błąd mógłby służyć jakiemukolwiek celowi procesowemu autora?
           Jeśli tak → oznacz "potencjalny lapsus — wymaga oceny kontekstu"

KROK L4c: Czy anomalia może być artefaktem OCR lub przepisania?
           Dotyczy: cyfra 0 vs litera o, VIP vs VII P, urwane adresy e-mail
           Jeśli tak → oznacz "wymaga_weryfikacji_w_oryginale"

KROK L4d: Wzorzec systemowy — czy ten sam typ błędu pojawia się ≥2 razy
           u tego samego autora w różnych pismach?
           Jeśli tak → oznacz jako SYSTEMOWY i zestawiaj wszystkie wystąpienia
           w jednej tabeli wzorca dla Sądu
```

---

### KROK L5 — Raport wzorca systemowego (gdy SYSTEMOWY u tego samego autora)

```
Format tabeli dla Sądu:

| Pismo | Data | Typ błędu | Cytat | Prawidłowa forma |
|-------|------|-----------|-------|------------------|
| D02   | 8.04.2025 | [LA-RODZAJ] | "od powódki" | "od Powoda" |
| D03   | 19.10.2025 | [LA-RODZAJ] | "od pozwanego" | "od Pozwanej" |
| D03   | 19.10.2025 | [LA-RODZAJ] | "Pozwany oświadcza" | "Pozwana oświadcza" |
| D03   | 19.10.2025 | [LA-RODZAJ] | "przez pozwanego" | "przez Powoda" |

Wniosek do pisma: "Pełnomocnik Pozwanej w każdym złożonym dotychczas piśmie
                   procesowym użył błędnej formy gramatycznej nazwy strony,
                   co świadczy o pracy na szablonach bez weryfikacji treści
                   pod kątem konkretnej sprawy."
```

---

## Pełna tabela typów — 22 kody

| Kod | Kategoria | Typ błędu | Severity domyślne |
|-----|-----------|-----------|-------------------|
| [LA-RODZAJ] | Podmiot | Błędny rodzaj gramatyczny strony | KRYTYCZNE |
| [LA-PODMIOT] | Podmiot | Działanie przypisane błędnej stronie | KRYTYCZNE |
| [LA-PODMIOT-POWTORZONY] | Podmiot | Ten sam podmiot wymieniony dwa razy | KRYTYCZNE |
| [LA-NAZWA-PODMIOT] | Podmiot | Niejednolity zapis nazwy | ISTOTNE |
| [LA-OSOBA-MYLONA] | Podmiot | Dwie osoby traktowane jako jedna | ISTOTNE |
| [LA-KWALIF] | Kwalifikacja | Sprzeczne kwalifikacje prawne tej samej okoliczności | KRYTYCZNE |
| [LA-KWALIFIKACJA-PRAWNA] | Kwalifikacja | Sformułowanie słabsze od ustawowego znamienia | KRYTYCZNE |
| [LA-KWALIFIKACJA-TECHNICZNA] | Kwalifikacja | Błędne rozumienie mechanizmu technicznego | ISTOTNE |
| [LA-LEGAL] | Kwalifikacja | Przepis o zakresie węższym niż teza | ISTOTNE |
| [LA-BRAK-KONKRETYZACJI] | Kwalifikacja | Żądanie bez wskazania konkretnego czynu | ISTOTNE |
| [INTRA-SAMOOBALA] | Logika | Argumentacja falsyfikuje własną tezę | KRYTYCZNE |
| [LA-PRZYZNANIE-KORZYSTNE] | Logika | Twierdzenie wzmacnia pozycję przeciwnika | KRYTYCZNE |
| [LA-TEZA-DOWODOWA] | Logika | Wniosek dowodowy dot. własnego klienta | KRYTYCZNE |
| [LA-INTENCJA] | Logika | Odparcie nieistniejącego zarzutu | ISTOTNE |
| [LA-NARR] | Logika | Opis faktyczny przyznaje tezę przeciwnika | KRYTYCZNE |
| [LA-ZAKRES-DOWODOWY] | Logika | Dowód spoza zakresu zobowiązania | ISTOTNE |
| [LA-KOSZTY] | Dokument | Błędny kierunek/forma wniosku o koszty | KRYTYCZNE |
| [LA-DATA] | Dokument | Błędny rok/data | ISTOTNE |
| [LA-DATA-PRZYSZLA] | Dokument | Data dowodu późniejsza niż data pisma | KRYTYCZNE |
| [LA-KWOTA] | Dokument | Dwie różne kwoty tej samej transakcji | ISTOTNE |
| [LA-KWOTA-SLOWNIE-CYFRAMI] | Dokument | Niezgodność kwoty słownej i cyfrowej | ISTOTNE |
| [LA-ODRECZNIE] | Dokument | Odręczny dopisek bez daty | ISTOTNE |
| [LA-CHRONOLOGIA] | Dokument | Narracja sprzeczna z datą własnego dokumentu | KRYTYCZNE |
| [LA-MIESIAC] | Dokument | Błędny miesiąc rozliczenia | KRYTYCZNE |
| [LA-PODMIOT-ROLA] | Dokument | Błędna kwalifikacja roli osoby trzeciej | KRYTYCZNE |
| [LA-SYGNATURA] | Dokument | Błędna sygnatura akt | ISTOTNE |

---

## Źródła eksperckie

Klasyfikacja opiera się na następujących źródłach:

**Polskie:**
- prawo.pl — "Sądowe łamańce z pism procesowych" (2023): kopiowanie wzorców z błędami płci, obszerne uzasadnienia z niepasującym orzecznictwem
- Palestra 1-2/2013 (H. Czerwińska, K. Drozdowicz): typologia błędów procesowych pełnomocnika, odpowiedzialność odszkodowawcza
- UAM Poznań / Bieluk: cywilnoprawna odpowiedzialność pełnomocnika za błąd
- NRA — szkolenia z błędów w postępowaniu przed ETPCz

**Zagraniczne:**
- Lawyers Mutual NC — "Drafting Errors: Small Mistakes Can Lead to Big Claims": copy-paste bez aktualizacji, inna strona w uzasadnieniu niż w żądaniu
- Infoware / Clio (2025-2026): template reuse errors, broken cross-references, outdated clauses
- BriefCatch (2026): "118 errors on average before proofreading"; vague language, passive voice, undefined terms
- Texas Legal Malpractice / LexCheck: poorly defined clauses, inaccurate facts copied from prior matters
- BARBRI — vague terms and contradictory clauses jako najczęstsze błędy
- Cornell LII / arxiv 2502.05675: taksonomia błędów rozumowania: błędy przesłanki (faktu, prawa) i błędy konkluzji

**Wzorzec empiryczny z D01–D04 (sprawa VII P 94/25):**
- Lorica Iuris Ciecierski Rak Sp.k. — 4 pisma, 19 lapsusów skatalogowanych,
  wzorzec SYSTEMOWY [LA-RODZAJ] potwierdził się w każdym piśmie

---

## Integracja z dashboardem

```
Wyniki modułu → tablica lapsusy[] w KROK 4 (dashboard)
Format:
{
  id:           'LA-N',
  type:         'la-rodzaj' | 'la-podmiot' | ... (kody CSS),
  autor:        string,
  doc:          string,
  zamierzenie:  string,
  skutek_rzecz: string,
  skutek_odwr:  boolean,
  severity:     'KRYTYCZNE' | 'ISTOTNE' | 'MARGINALNE',
  wzorzec:      'SZABLON' | 'JEDNOSTKOWY' | 'SYSTEMOWY',
  cytat:        string,
  rek:          string,
  status:       'potwierdzony' | 'wymaga_weryfikacji_w_oryginale'
}

Filtry w zakładce "Lapsusy": wg typu | wg autora | wg severity | wg wzorca | wg dokumentu
Eksport: JSON + MD (sekcja "Lapsusy autorskie") + CSV
```

