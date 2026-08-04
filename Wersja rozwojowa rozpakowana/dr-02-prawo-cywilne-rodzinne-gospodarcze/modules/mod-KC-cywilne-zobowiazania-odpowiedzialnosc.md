# mod-KC-cywilne-zobowiazania-odpowiedzialnosc

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** KC — Dz.U. 2025 poz. 1071 t.j. ze zm. (zm.: poz. 1172, 1508; Dz.U. 2026 poz. 184) | KPC — Dz.U. 2026 poz. 468 t.j.
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl | LEX/Legalis wyłącznie pomocniczo

---

## 1. CORE

### Zakres modułu
Delikt i kontrakt (dwa reżimy odpowiedzialności), kara umowna i miarkowanie, bezpodstawne wzbogacenie, wady oświadczenia woli i ich skutki, zasiedzenie, skarga pauliańska, terminy przedawnienia, odsetki za opóźnienie, naprawienie szkody (damnum emergens / lucrum cessans), zasada adekwatnego związku przyczynowego.

### Akty i źródła kontrolne

| Akt | Dz.U. | Uwaga |
|---|---|---|
| Kodeks cywilny (KC) | Dz.U. 2025 poz. 1071 t.j. ze zm. | Weryfikuj zmiany po t.j. w ISAP |
| Kodeks postępowania cywilnego (KPC) | Dz.U. 2026 poz. 468 t.j. | Nowelizacja: Dz.U. 2025 poz. 1172 (w życie 01.03.2026) |
| Ustawa o kosztach sądowych (KSCU) | Dz.U. 2024 poz. 959 t.j. | Weryfikuj aktualne opłaty |

---

## 2. INTAKE

```
□ Czy między stronami istnieje umowa? → kontrakt (art. 471 KC) vs delikt (art. 415 KC)
□ Jaka jest wartość roszczenia? → SR do 100 000 zł / SO powyżej (weryfikuj art. 17 KPC)
□ Kiedy powstała szkoda / naruszono umowę? → SPRAWDŹ PRZEDAWNIENIE jako pierwsze!
□ Trzy przesłanki: zdarzenie + szkoda + związek przyczynowy — wszystkie obecne?
□ Czy dłużnik ma majątek? → weryfikuj KW, KRS przed wniesieniem pozwu
□ Czy warto wnosić o zabezpieczenie roszczenia (art. 730 KPC)?
□ Jaka forma umowy? → ustalenie czy doszło do zawarcia / wad oświadczenia woli
□ Czy istnieje kara umowna? → czy dotyczy zobowiązania niepieniężnego?
```

---

## 3. PROCEDURA

### Dwa reżimy odpowiedzialności — kwalifikator krytyczny

> Definicje kanoniczne (przesłanki, podstawy prawne art. 415/471/442¹/361 KC):
> shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md, sekcje C.2-C.3.
> Tabela poniżej to praktyczna wersja porównawcza do szybkiej kwalifikacji
> sprawy — nie zastępuje weryfikacji przesłanek w DEF przy sporządzaniu pisma.

| Cecha | Delikt (art. 415 KC) | Kontrakt (art. 471 KC) |
|---|---|---|
| Podstawa | Czyn niedozwolony — brak lub niezależność od umowy | Niewykonanie lub nienależyte wykonanie umowy |
| Ciężar dowodu | **Powód** musi wykazać: winę + szkodę + związek przyczynowy | **Domniemanie winy dłużnika** — dłużnik musi udowodnić brak winy |
| Przedawnienie ogólne | 3 lata od wiedzy o szkodzie i sprawcy; max 10 lat od zdarzenia | 3 lata (dz. gosp.) / 6 lat (ogólne) |
| Przedawnienie — przestępstwo | 20 lat od popełnienia | — |
| Zakres odszkodowania | Adekwatny związek przyczynowy (art. 361 §1 KC) | j.w. + art. 361 §2 (damnum emergens + lucrum cessans) |

> ⚠️ **Błąd w kwalifikacji = możliwy skuteczny zarzut przedawnienia lub oddalenie powództwa.**

### Szczególne podstawy odpowiedzialności (zasada ryzyka — bez winy)

> ⚠️ Brzmienie każdego artykułu — weryfikuj w aktualnym tekście KC w ISAP.

| Art. KC | Podmiot odpowiedzialny | Zasada |
|---|---|---|
| art. 435 | Przedsiębiorstwo wprawiane w ruch siłami przyrody | Ryzyko — bez winy |
| art. 436 §1 | Posiadacz mechanicznego środka komunikacji | Ryzyko — bez winy |
| art. 436 §2 | Zderzenie dwóch pojazdów | Wina wzajemna |
| art. 433 | Wyrzucenie/wylanie/spadnięcie z pomieszczenia | Ryzyko |
| art. 430 | Zwierzchnik za podwładnego (błąd lekarski, wypadek przy pracy) | Ryzyko |

⭐ DODANE 2026-07-30 (na żądanie użytkownika) — ART. 435 KC W
KONTEKŚCIE "CZYSTEGO NIESZCZĘŚLIWEGO WYPADKU" (np. awaria maszyny,
BEZ naruszenia BHP): ODPOWIEDŹ NA PYTANIE "czy sama awaria zwalnia z
odpowiedzialności?" — CO DO ZASADY **NIE**:

```
ZASADA: art. 435 §1 KC nakłada odpowiedzialność NA ZASADZIE RYZYKA —
  CAŁKOWICIE NIEZALEŻNIE od winy przedsiębiorcy/pracodawcy. Sam fakt
  BRAKU naruszenia BHP (a więc BRAKU podstaw do odpowiedzialności
  KARNEJ z art. 220/155 KK — patrz DR-03,
  `mod-KK-art148-162-przeciwko-zyciu-zdrowiu.md`) NIE OZNACZA braku
  odpowiedzialności CYWILNEJ — te dwa reżimy są NIEZALEŻNE

TRZY, ZAMKNIĘTE PRZESŁANKI EGZONERACYJNE (jedyny sposób na
  uwolnienie się od odpowiedzialności z art. 435):
  1) SIŁA WYŻSZA — zdarzenie ZEWNĘTRZNE, nadzwyczajne, niemożliwe do
     przewidzenia ani zapobieżenia (np. trzęsienie ziemi, powódź
     stulecia) — ⚠️ KLUCZOWE: pojęcie siły wyższej WYRAŹNIE NIE
     OBEJMUJE zdarzeń WEWNĘTRZNYCH wobec przedsiębiorstwa — WPROST
     wskazane w orzecznictwie jako NIEKWALIFIKUJĄCE SIĘ przykłady:
     wybuch kotła w fabryce, "zwykła" awaria prądu, zwykła awaria
     maszyny/urządzenia technicznego. AWARIA MASZYNY, SAMA W SOBIE,
     TO NIE JEST SIŁA WYŻSZA
  2) WYŁĄCZNA WINA POSZKODOWANEGO — np. pracownik WBREW zakazom
     zakładowym włożył rękę w pracującą maszynę
  3) WYŁĄCZNA WINA OSOBY TRZECIEJ, za którą przedsiębiorca nie
     odpowiada (może nawet pozostać NIEZIDENTYFIKOWANA — uchwała SN
     z 26.07.2017, III CZP 30/17)

⚠️ RYGORYSTYCZNA PRAKTYKA SĄDOWA: jeśli DZIAŁANIE/RUCH przedsiębiorstwa
  przyczyniło się do szkody CHOĆBY W 1% — przesłanki egzoneracyjne
  NIE ZNAJDĄ zastosowania, odpowiedzialność POZOSTAJE. Awaria
  maszyny, która jest ELEMENTEM ruchu przedsiębiorstwa (nie zewnętrzną
  ingerencją), z DEFINICJI wyklucza powołanie się na siłę wyższą

CIĘŻAR DOWODU: to PRZEDSIĘBIORCA musi udowodnić, że NIE prowadzi
  działalności "wprawianej w ruch siłami przyrody" (jeśli chce
  wyłączyć ten reżim) LUB że zachodzi jedna z 3 przesłanek
  egzoneracyjnych — DOMNIEMANIE działa NA NIEKORZYŚĆ przedsiębiorcy

ZAKRES PODMIOTOWY: dotyczy przedsiębiorstw, których funkcjonowanie
  jest UZALEŻNIONE od maszyn/urządzeń wykorzystujących siły przyrody
  (para, gaz, elektryczność, paliwa płynne) jako CAŁOŚĆ działalności
  — NIE wystarczy samo POSIADANIE pojedynczej maszyny z silnikiem
  (np. mały sklep osiedlowy z jedną chłodziarką TYPOWO nie kwalifikuje
  się, ALE zmechanizowane przedsiębiorstwo budowlane z dźwigami/
  koparkami/windami — TAK)

PRAKTYCZNA KONSEKWENCJA: poszkodowany pracownik/osoba trzecia MA
  UŁATWIONĄ drogę dochodzenia odszkodowania — NIE MUSI udowadniać
  winy pracodawcy (jak przy zwykłej odpowiedzialności z art. 415 KC),
  WYSTARCZY wykazać sam fakt szkody + związek przyczynowy z RUCHEM
  przedsiębiorstwa — ciężar obalenia domniemania spoczywa na stronie
  pozwanej

Potwierdzone w 6+ zgodnych źródłach, w tym Sąd Najwyższy (uchwała III
CZP 30/17), OIRP Warszawa (analiza orzecznictwa), rp.pl.
```

### Schemat doboru trybu postępowania

```
Jaka wartość sporu?
  ≤ 100 000 zł → SR | > 100 000 zł → SO (weryfikuj art. 17 KPC w ISAP)
  ↓
Czy istnieje dokument uzasadniający nakaz nakazowy (art. 485 KPC)?
  TAK → postępowanie nakazowe (¼ opłaty, natychmiastowe zabezpieczenie)
  NIE → postępowanie upominawcze / zwykłe / gospodarcze (B2B) / EPU
  ↓
Czy zachodzi ryzyko ucieczki majątku?
  TAK → wniosek o zabezpieczenie (art. 730 KPC) RAZEM z pozwem
```

---

## 4. TERMINY PRZEDAWNIENIA — TABELA (art. 118 i n. KC)

> ⚠️ Weryfikuj aktualne brzmienie w ISAP. Od 2018 r. sąd bada przedawnienie Z URZĘDU gdy dłużnikiem jest konsument.

| Roszczenie | Termin | Art. KC | Uwagi |
|---|---|---|---|
| Ogólny | 6 lat | art. 118 | Koniec: ostatni dzień roku kalendarzowego |
| Z działalności gospodarczej | 3 lata | art. 118 | Między przedsiębiorcami |
| Delikt — od wiedzy | 3 lata | art. 4421 §1 | Od dowiedzenia się o szkodzie i sprawcy |
| Delikt — max | 10 lat | art. 4421 §1 | Od zdarzenia |
| Delikt — zbrodnia/występek | 20 lat | art. 4421 §2 | Od popełnienia |
| Sprzedaż | 2 lata | art. 554 | |
| Dzieło | 2 lata | art. 646 | Od oddania dzieła |
| Zachowek | 5 lat | art. 1007 | Od ogłoszenia testamentu |
| Wyrok / ugoda sądowa | 6 lat | art. 125 | Od uprawomocnienia |
| Skarga pauliańska | 5 lat | art. 534 | Od daty pokrzywdzającej czynności |

**Zawezwanie do próby ugodowej:** przerywa bieg przedawnienia WYŁĄCZNIE gdy złożone w dobrej wierze — weryfikuj aktualną linię orzeczniczą SN.

---

## 5. KARA UMOWNA (art. 483–484 KC)

```
Zastrzeżenie możliwe: WYŁĄCZNIE przy zobowiązaniach NIEPIENIĘŻNYCH
  → za zobowiązania pieniężne: odsetki, nie kara umowna

MIARKOWANIE (art. 484 §2) — dwie samoistne podstawy:
  □ Zobowiązanie zostało w znacznej części wykonane
  □ Kara jest rażąco wygórowana
    (mierniki: stosunek kary do wartości całej umowy,
     stosunek kary do poniesionej szkody — choćby zerowej,
     stopień winy dłużnika, charakter naruszenia)

Charakter procesowy: miarkowanie = wniosek strony (sąd NIE działa z urzędu)
Skutek miarkowania: zmniejszenie kary, nie jej uchylenie
```

---

## 6. WADY OŚWIADCZENIA WOLI — KWALIFIKATOR

> ⚠️ Brzmienie każdego artykułu — weryfikuj w aktualnym KC w ISAP.

| Wada | Art. KC | Skutek | Termin uprawnienia |
|---|---|---|---|
| Brak świadomości lub swobody | art. 82 | Bezwzględna nieważność | Brak — nieważne z mocy prawa |
| Pozorność | art. 83 | Bezwzględna nieważność | Brak — nieważne z mocy prawa |
| Błąd co do treści | art. 84 | Wzruszalność | 1 rok od wykrycia |
| Podstęp | art. 86 | Wzruszalność | 1 rok od wykrycia |
| Groźba | art. 87 | Wzruszalność | 1 rok od ustania obawy |
| Wyzysk | art. 388 | Zmiana lub unieważnienie | 3 lata (6 lat — konsument) |

**Art. 388 §1¹ KC (domniemanie wyzysku):** jeżeli wartość świadczenia jednej strony przewyższa co najmniej dwukrotnie wartość świadczenia wzajemnej — domniemywa się rażącą dysproporcję.

---

## 7. BEZPODSTAWNE WZBOGACENIE (art. 405–414 KC)

```
Cztery przesłanki łącznie:
  □ Wzbogacenie po stronie pozwanego
  □ Zubożenie po stronie powoda
  □ Związek między wzbogaceniem a zubożeniem (kosztem zubożonego)
  □ Brak podstawy prawnej (causa)

Nie wymaga winy ani bezprawności.
Granica roszczenia: aktualne wzbogacenie (art. 409 KC) — może zmaleć lub zniknąć.
Przedawnienie: 6 lat ogólne / 3 lata przy działalności gosp. (art. 118 KC).
```

---

## 8. SKARGA PAULIAŃSKA (art. 527–534 KC)

```
Cel: ochrona wierzyciela przed uszczupleniem przez dłużnika majątku nadającego
     się do egzekucji

Przesłanki (wszystkie łącznie):
  [A] Wierzytelność wierzyciela wobec dłużnika istnieje
  [B] Dłużnik dokonał czynności prawnej z osobą trzecią
  [C] Czynność krzywdzi wierzycieli (art. 527 §2 KC: dłużnik stał się
      niewypłacalny lub pogłębił niewypłacalność)
  [D] Dłużnik działał ze świadomością pokrzywdzenia wierzycieli
  [E] Osoba trzecia wiedziała lub mogła się dowiedzieć o tej świadomości

Domniemania odwracalne (dłużnik / os. trzecia musi obalić):
  → Czynność nieodpłatna → wiedza os. trzeciej domniemana (art. 528 KC)
  → Osoba bliska dłużnika → wiedza domniemana (art. 527 §3 KC)
  → Przedsiębiorca w stałym stosunku gosp. → wiedza domniemana (art. 527 §4 KC)

Termin prekluzji: 5 lat od daty pokrzywdzającej czynności (art. 534 KC)
  ⚠️ Biegnie od czynności, NIE od dowiedzenia się wierzyciela!
Powództwo: przeciwko osobie trzeciej (nie dłużnikowi)
Skutek: bezskuteczność czynności wyłącznie wobec skarżącego wierzyciela
```

---

## 9. ODSETKI ZA OPÓŹNIENIE (art. 481 KC)

> ⚠️ Aktualna stopa referencyjna NBP zmienia się decyzją RPP — weryfikuj przed każdą sprawą: nbp.pl

```
Odsetki ustawowe za opóźnienie (art. 481 §2):
  stopa referencyjna NBP + 5,5 pkt proc.

Odsetki maksymalne za opóźnienie (art. 481 §2¹):
  dwukrotność odsetek ustawowych za opóźnienie

Odsetki transakcyjne B2B:
  ustawa o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych
  → weryfikuj aktualny t.j. w ISAP (wyższe niż ustawowe za opóźnienie)

Od kiedy liczyć:
  → dzień po upływie terminu płatności z umowy / faktury
  → dzień po wezwaniu (świadczenie bezterminowe — art. 455 KC)
```

---

## 10. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Zawarcie umowy | Umowa pisemna / e-mail / SMS / faktura | strony / korespondencja | wysoka / średnia | brak formy pisemnej | dowody pośrednie, zeznania |
| Wykonanie / niewykonanie | Protokół odbioru, faktura, korespondencja | strony | wysoka | brak potwierdzenia | zeznania świadków |
| Szkoda materialna | Faktury, kosztorysy, wyceny | dokumenty | wysoka | brak wyceny | opinia biegłego |
| Szkoda niematerialna | Dokumentacja medyczna, zaświadczenia | lekarze, instytucje | średnia | subiektywność | orzecznictwo SN |
| Związek przyczynowy | Ekspertyza, opinia biegłego | biegły | wysoka | wielość przyczyn | adekwatny zw. przyczyno. |
| Wina dłużnika | Korespondencja, protokoły, zeznania | akta / strony | średnia | domniemanie przy kontrakcie | przerzucenie ciężaru |

---

## 11. STRATEGIA

### Perspektywa powoda

1. Kwalifikuj reżim odpowiedzialności (delikt / kontrakt) — od tego zależy przedawnienie i ciężar dowodu.
2. Oblicz przedawnienie jako pierwsze — wnieś pozew przed upływem.
3. Zabezpiecz roszczenie jeśli dłużnik wykazuje oznaki ucieczki majątku.
4. Wybierz optymalny tryb postępowania (nakazowy / upominawczy / EPU / zwykły / gospodarcze).
5. Zgromadź matrycę dowodową przed wniesieniem pozwu.

### Perspektywa pozwanego

1. Sprawdź przedawnienie — skuteczny zarzut kończy sprawę.
2. Kwestionuj przesłanki odpowiedzialności, zaczynając od najsłabszego ogniwa łańcucha (zazwyczaj związek przyczynowy lub wysokość szkody).
3. Wnioskuj o miarkowanie kary umownej jeśli dotyczy.
4. Sprawdź czy doszło do wady oświadczenia woli przy zawarciu umowy.

### Kontrargumenty / ryzyka

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Przedawnienie | Powód złożył pozew po terminie | Zarzut przedawnienia na początku obrony |
| Brak związku przyczynowego | Wielość przyczyn szkody | Kwestionowanie adekwatności związku |
| Brak szkody | Szkoda hipotetyczna, nie rzeczywista | Wniosek o dowód z biegłego |
| Domniemanie winy (kontrakt) | Ciężar spoczywa na dłużniku | Dowód braku winy, siła wyższa |

---

## 12. ORZECZNICTWO

Nie twórz fikcyjnych sygnatur. Orzecznictwo pobieraj wyłącznie z realnych źródeł.

```
web_search: "kara umowna miarkowanie art 484 §2 KC orzecznictwo SN kryteria 2025"
web_search: "delikt kontrakt zbieg podstaw odpowiedzialności orzecznictwo SN"
web_search: "skarga pauliańska art 527 KC termin 5 lat orzecznictwo SN"
web_search: "bezpodstawne wzbogacenie art 405 KC brak podstawy prawnej SN"
web_search: "zawezwanie do próby ugodowej dobra wiara przedawnienie SN III CZP"
```

---

## 13. QUALITY GATE

- [ ] Reżim odpowiedzialności (delikt / kontrakt) ustalony?
- [ ] Przedawnienie sprawdzone i obliczone?
- [ ] Aktualne brzmienie art. 118 KC zweryfikowane w ISAP?
- [ ] Każda przesłanka odpowiedzialności ma przypisany dowód?
- [ ] Właściwość sądu (SR / SO) ustalona i zweryfikowana (art. 17 KPC)?
- [ ] Ryzyko braku majątku dłużnika ocenione?
- [ ] Tryb postępowania optymalny dla sprawy?

---

## 14. OUTPUT

Wynik pracy modułu:
1. Stan faktyczny (co, kiedy, przez kogo, wobec kogo);
2. Kwalifikacja reżimu odpowiedzialności (delikt / kontrakt) z uzasadnieniem;
3. Stan prawny i źródła (Dz.U. z ISAP);
4. Przedawnienie (termin, data upływu, przerwania / zawieszenia);
5. Trzy przesłanki odpowiedzialności z oceną (spełnione / wątpliwe / niespełnione);
6. Matryca dowodowa;
7. Zarzuty i kontrargumenty;
8. Analiza ryzyk;
9. Strategia (wariant podstawowy + ewentualny);
10. Predykcja wyniku (IN PLUS / IN MINUS);
11. Rekomendacja (sąd / ugoda / nakaz / mediacja);
12. Kontrola ISAP/temporalności.

---

## PREDYKCJA WYNIKU — SZABLON

```
Szanse na wygraną: [0–100%]
IN PLUS: umowa pisemna, dokumentacja szkody, jasny związek przyczynowy, dłużnik ma majątek
IN MINUS: brak umowy, przedawnienie bliskie, dłużnik bez majątku, brak dowodów szkody
BENCHMARKING: → wywołaj orzeczenia-sadowe-v2
  (NIGDY nie cytuj sygnatur z pamięci — ZAWSZE weryfikuj online)
REKOMENDACJA: □ Sąd — nakaz zapłaty  □ Sąd — tryb zwykły  □ Ugoda  □ Mediacja
```

---

## ŹRÓDŁA ONLINE

- KC: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001071
- KPC: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000468
- SN: https://www.sn.pl
- Kurs NBP (aktualna stopa): https://nbp.pl

---

## ANEKS D — SŁUŻEBNOŚCI I PRAWO RZECZOWE (KC Księga II)

> Weryfikuj przed każdym powołaniem: KC Dz.U. 2025 poz. 1071 t.j. ze zm.

```
SŁUŻEBNOŚĆ DROGI KONIECZNEJ (art. 145 KC):
  → Przesłanki: brak dostępu do drogi publicznej LUB dostęp nieodpowiedni
  → Tryb: umownie LUB sądownie (wniosek do sądu rejonowego — postępowanie nieprocesowe)
  → Wynagrodzenie: jednorazowe lub periodyczne — ustalane przez sąd
  → Trasa: możliwie najmniej uciążliwa dla nieruchomości obciążonej
  → Wykreślenie: gdy ustanie podstawa (art. 295 KC)

SŁUŻEBNOŚĆ PRZESYŁU (art. 305¹–305⁴ KC):
  → Dotyczy: sieci energetyczne, wodociągowe, gazowe, teletechniczne
  → Właściciel może żądać ustanowienia za wynagrodzeniem
  → Możliwość zasiedzenia służebności o treści służebności przesyłu
  → Roszczenie o wynagrodzenie za bezumowne korzystanie z nieruchomości (art. 224–225 KC)

## ⭐ BEZUMOWNE KORZYSTANIE Z RZECZY/NIERUCHOMOŚCI — ROZBUDOWANE
2026-08-04, na żądanie użytkownika, na podstawie opracowań
eksperckich i orzecznictwa SN:

```
DEFINICJA: eksploatowanie rzeczy/nieruchomości BEZ TYTUŁU PRAWNEGO —
  najczęściej po WYGAŚNIĘCIU/wypowiedzeniu umowy najmu/dzierżawy, gdy
  była strona umowy NIE ZWRACA rzeczy

⚠️ CHARAKTER PRAWNY (kluczowe rozróżnienie doktrynalne, potwierdzone
  orzecznictwem): wynagrodzenie z art. 224/225 KC to NIE jest
  odszkodowanie za szkodę — to ZAPŁATA za korzystanie, którą posiadacz
  MUSIAŁBY uiścić, gdyby jego posiadanie było oparte na ważnym
  stosunku prawnym. SKUTEK: NIEISTOTNE jest, czy właściciel
  RZECZYWIŚCIE poniósł stratę (np. i tak nie zamierzał wynajmować) —
  sam FAKT bezumownego korzystania rodzi obowiązek zapłaty

DWA RÓŻNE REŻIMY WG DOBREJ/ZŁEJ WIARY POSIADACZA:
  → POSIADACZ SAMOISTNY W ZŁEJ WIERZE (art. 225 KC): zobowiązany do
    zapłaty za CAŁY OKRES bezumownego władania — OD MOMENTU
    OBJĘCIA W POSIADANIE w złej wierze
  → POSIADACZ SAMOISTNY W DOBREJ WIERZE (art. 224 §2 KC): zobowiązany
    DOPIERO OD CHWILI, gdy DOWIEDZIAŁ SIĘ o wytoczeniu przeciwko
    niemu powództwa o wydanie rzeczy — ⚠️ NIE wymaga to FORMALNEGO
    doręczenia pozwu — wystarczy KAŻDA WIARYGODNA informacja o
    wytoczeniu powództwa (potwierdzone orzecznictwem)

WYSOKOŚĆ WYNAGRODZENIA: RÓWNA STAWCE RYNKOWEJ czynszu za rzecz
  danego rodzaju w danych okolicznościach — czyli TYLE, ile
  właściciel MÓGŁBY uzyskać, gdyby wynajął/wydzierżawił/oddał w
  odpłatne używanie na podstawie innego, ważnego stosunku prawnego
  (wyrok SA Katowice, I ACa 917/14, 10.02.2015) — obejmuje GRUNT,
  budynki, budowle i INNE urządzenia na gruncie w chwili objęcia w
  posiadanie, NIEZALEŻNIE od tego, czy zobowiązany FAKTYCZNIE z nich
  korzystał, jeśli OBIEKTYWNIE nadawały się do wykorzystania i
  przedstawiały wartość (SN, II CSK 188/12, 14.11.2012)

MOŻNA DOCHODZIĆ NAWET PRZED ODZYSKANIEM RZECZY: roszczenia z art.
  224/225 KC mogą być dochodzone przez właściciela, GDY jeszcze NIE
  NASTĄPIŁO wydanie nieruchomości (SN, V CSK 296/06, 8.12.2006) — NIE
  trzeba czekać na fizyczny zwrot, żeby zacząć naliczać/pozywać o
  wynagrodzenie

PODMIOT ZOBOWIĄZANY DO ZAPŁATY: może to być m.in. jeden ze
  WSPÓŁWŁAŚCICIELI, jeśli korzysta z nieruchomości WSPÓLNEJ z
  naruszeniem uprawnień pozostałych współwłaścicieli (nie tylko
  osoba trzecia)

WYGAŚNIĘCIE roszczenia: z chwilą uzyskania przez posiadacza TYTUŁU
  PRAWNEGO do nieruchomości (np. zawarcie nowej umowy najmu, przy
  zgodzie właściciela) — od tego momentu stosunek przestaje być
  "bezumowny"

⚠️ LOKALE MIESZKALNE — ODRĘBNY REŻIM: dla byłych najemców lokali
  mieszkalnych zastosowanie ma art. 18 ustawy o ochronie praw
  lokatorów (odszkodowanie za bezumowne zajmowanie lokalu — WYŻSZA
  stawka niż zwykły czynsz, jeśli właściciel nie ma możliwości
  wynajęcia komuś innemu z powodu zajmowania przez byłego najemcę) —
  NIE stosuje się WPROST art. 224/225 KC, tylko przepis szczególny

PROCEDURA: roszczenie o ZAPŁATĘ może być DOCHODZONE JEDNOCZEŚNIE z
  roszczeniem o WYDANIE nieruchomości ORAZ roszczeniem o
  przywrócenie stanu zgodnego z prawem/zaniechanie naruszeń — w
  JEDNYM postępowaniu, nie muszą to być odrębne procesy

Potwierdzone w 6+ zgodnych źródłach eksperckich (poradnikprzedsiebiorcy.pl
[luty 2026], Wolters Kluwer, adamkapczynski.pl, inlegis.pl [kwiecień
2026], prawolasu.com, standardyprawa.pl), z bezpośrednimi cytatami
orzeczeń SN i sądów apelacyjnych.
```

## ⭐ ZAMELDOWANIE — KTO MOŻE, CZY POTRZEBNA ZGODA WŁAŚCICIELA (dodane
2026-08-04, na żądanie użytkownika — uzupełnienie do sekcji
wymeldowania NIŻEJ, ta sama tematyka od strony "wejścia", nie
"wyjścia")

```
PODSTAWA: ustawa z 24.09.2010 o ewidencji ludności, art. 24/27/28/33

OBOWIĄZEK I TERMIN: KAŻDA osoba przebywająca w Polsce (obywatel PL
  lub cudzoziemiec z UE/EFTA/Szwajcarii) musi zameldować się
  NAJPÓŹNIEJ W 30. DNIU od przybycia do miejsca pobytu (art. 24, 27)
  → CUDZOZIEMCY spoza UE/EFTA: znacznie KRÓTSZY termin — 4. dzień od
    przybycia (obowiązek NIE POWSTAJE, jeśli pobyt ≤30 dni)
  ⚠️ OD 1.01.2013: uchylono WYKROCZENIE za niedopełnienie obowiązku
    meldunkowego — obowiązek formalnie NADAL ISTNIEJE, ale brak
    sankcji karnej/wykroczeniowej dla osoby fizycznej za sam brak
    zameldowania

⭐⭐ KLUCZOWA ASYMETRIA — KTO MOŻE ZAMELDOWAĆ KOGO (odpowiedź na
  pytanie "czy zameldowanie wymaga zgody właściciela"):
  → WŁAŚCICIEL: najszersze uprawnienia — może zameldować SIEBIE i
    DOWOLNĄ inną osobę, BEZ ograniczeń pokrewieństwa
  → NAJEMCA: może zameldować SIEBIE SAMEGO na podstawie SAMEJ umowy
    najmu — ⚠️ ZGODA WŁAŚCICIELA DO WŁASNEGO ZAMELDOWANIA NAJEMCY
    NIE JEST WYMAGANA (wystarczy sama umowa jako dokument
    potwierdzający tytuł prawny) — meldunek najemcy TRWA tyle, ile
    umowa najmu (np. umowa na 12 miesięcy = zameldowanie na pobyt
    czasowy na rok, WYGASA automatycznie z końcem tego okresu, BEZ
    odrębnej procedury wymeldowania)
  → ABY najemca zameldował KOGOŚ INNEGO (np. członka rodziny,
    partnera) — WYMAGANA jest PISEMNA ZGODA WŁAŚCICIELA lokalu —
    TU zgoda JEST konieczna, w przeciwieństwie do zameldowania
    samego najemcy
  → PEŁNOMOCNIK: może dokonać zameldowania W IMIENIU osoby
    zameldowanej LUB w imieniu osoby potwierdzającej pobyt
    (właściciela), na podstawie PISEMNEGO pełnomocnictwa
    obejmującego WPROST czynność meldunkową

DOKUMENTY: dowód osobisty/paszport + formularz zgłoszenia + DOKUMENT
  POTWIERDZAJĄCY TYTUŁ PRAWNY do lokalu (akt notarialny, umowa
  najmu, umowa użyczenia) — POTWIERDZENIE POBYTU przez
  właściciela/uprawnionego: czytelny podpis z datą (na formularzu
  LUB dokumencie odrębnym) — BEZ OBOWIĄZKU osobistego stawiennictwa
  właściciela w urzędzie

KOSZT: SAMO zameldowanie jest BEZPŁATNE — opłata pojawia się
  WYŁĄCZNIE przy wydaniu ZAŚWIADCZENIA na WNIOSEK: **17 ZŁ** opłaty
  skarbowej za zaświadczenie o zameldowaniu na pobyt CZASOWY;
  zaświadczenie o zameldowaniu na pobyt STAŁY — urząd wydaje Z
  URZĘDU, BEZPŁATNIE

FORMA: OSOBIŚCIE w urzędzie gminy LUB elektronicznie (e-meldunek,
  wymaga numeru PESEL + profilu zaufanego) — ŚWIEŻO przybyła osoba
  (zwłaszcza z zagranicy) często JESZCZE NIE MA tych narzędzi, więc
  pierwszy meldunek zwykle załatwia się osobiście

⚠️ RÓWNOWAŻNE ZDARZENIE: zameldowanie NA POBYT STAŁY pod nowym
  adresem AUTOMATYCZNIE wymeldowuje z POPRZEDNIEGO miejsca pobytu
  stałego (organ gminy robi to "za" zainteresowanego, bez odrębnego
  wniosku o wymeldowanie)

⚠️ ROZRÓŻNIENIE OD REJESTRACJI POBYTU U WOJEWODY (dla obywateli UE):
  zaświadczenie rejestracji pobytu obywatela UE u WOJEWODY to
  ODRĘBNA procedura — NIE ZASTĘPUJE meldunku i NIE JEST z nim
  tożsama — obie mogą być wymagane RÓWNOLEGLE

⚠️ PRZYPOMNIENIE (zgodnie z sekcją wymeldowania niżej): ZAMELDOWANIE
  NIE DAJE żadnego prawa do lokalu — to WYŁĄCZNIE potwierdzenie
  faktu pobytu. Można SPRZEDAĆ mieszkanie z zameldowaną w nim osobą
  — nowy właściciel będzie mógł ją WYMELDOWAĆ administracyjnie
  (patrz procedura niżej), jeśli faktycznie się wyprowadziła; jeśli
  NADAL faktycznie mieszka — potrzebna EKSMISJA, nie wymeldowanie

Potwierdzone w 6+ zgodnych, aktualnych źródłach (znajdznajem.pl
[lipiec 2026], korepetycjezzycia.pl [luty 2026], pepperhouse.pl,
ciodnieruchomosci.pl [marzec 2026], rentli.pl [maj 2026],
prawo-mieszkaniowe.info [maj 2026]).
```

## ⭐ WYMELDOWANIE BEZ ZGODY OSOBY ZAMELDOWANEJ (dodane 2026-08-04, na
żądanie użytkownika)

```
⚠️ FUNDAMENTALNE ROZRÓŻNIENIE: MELDUNEK (zameldowanie) TO NIE JEST
  TYTUŁ PRAWNY do lokalu — to WYŁĄCZNIE ewidencyjne odzwierciedlenie
  faktycznego miejsca pobytu (ustawa o ewidencji ludności). Meldunek
  NIE DAJE samodzielnego prawa do zamieszkiwania — POTWIERDZONE
  wprost, wielokrotnie w źródłach eksperckich: "Meldunek ma
  odzwierciedlać rzeczywistość, a nie ją kreować"

KTO MOŻE ZŁOŻYĆ WNIOSEK: WYŁĄCZNIE właściciel LUB inna osoba
  DYSPONUJĄCA TYTUŁEM PRAWNYM do lokalu (główny najemca w lokalu
  komunalnym, użytkownik wieczysty itd.) — NIE decyduje WOLA
  właściciela, tylko ORGAN ADMINISTRACJI (wójt/burmistrz/prezydent
  miasta) po przeprowadzeniu postępowania wyjaśniającego (tryb KPA)

JEDYNA PRZESŁANKA MATERIALNA: TRWAŁE i DOBROWOLNE opuszczenie lokalu
  przez osobę zameldowaną, BEZ ZAMIARU POWROTU — ⚠️ "trwałe
  opuszczenie" NIE MA definicji ustawowej — wypracowane w
  orzecznictwie/praktyce urzędów. RÓWNOWAŻNE z dobrowolnym
  opuszczeniem: sytuacje, gdy osoba NIE MOŻE zgodnie z prawem dalej
  zamieszkiwać (nakaz eksmisji, kara pozbawienia wolności, zakaz
  zbliżania się) — POTWIERDZONE orzecznictwem: WSA Bydgoszcz II
  SA/Bd 244/23 i NSA II OSK 387/22 — przymusowe opuszczenie PRZEZ
  ORGANY PAŃSTWA TEŻ liczy się jako "opuszczenie" dla celów
  wymeldowania

DOWODY W POSTĘPOWANIU (katalog przykładowy, NIE zamknięty): zeznania
  świadków (sąsiedzi, rodzina, administrator), BRAK rzeczy osobistych
  w lokalu, faktury za media wskazujące zerowe/minimalne zużycie,
  korespondencja (zwroty listów, przekierowanie poczty), umowa najmu
  INNEJ nieruchomości, dokumenty potwierdzające zamieszkanie gdzie
  indziej (np. umowa o pracę w innej miejscowości) — organ bada
  "centrum życiowe" osoby: gdzie realnie śpi, przechowuje rzeczy,
  odbiera korespondencję, prowadzi sprawy rodzinne

⚠️ KLUCZOWA GRANICA — WYMELDOWANIE TO NIE "SZYBKA EKSMISJA":
  JEŻELI osoba NADAL FAKTYCZNIE mieszka (NAWET "na dziko", bez umowy
  i WBREW woli właściciela) — organ NIE MOŻE wykorzystać
  wymeldowania jako narzędzia nacisku/przymuszenia do wyprowadzki —
  W TAKIEJ sytuacji WŁAŚCIWA droga to EKSMISJA (postępowanie
  SĄDOWE, cywilne), NIE wymeldowanie (postępowanie ADMINISTRACYJNE) —
  te dwie procedury są ODRĘBNE i NIE ZASTĘPUJĄ się nawzajem

PROCEDURA: (1) wniosek właściciela/uprawnionego → (2) postępowanie
  wyjaśniające organu (przesłuchania, oględziny, zbieranie dowodów) →
  (3) UDZIAŁ osoby mającej być wymeldowaną — ma prawo złożyć
  wyjaśnienia, zakwestionować twierdzenia, przedstawić WŁASNE dowody
  (np. że nadal przechowuje rzeczy, ma klucze, okresowo nocuje) →
  (4) decyzja administracyjna (wymeldowanie LUB odmowa, ZAWSZE
  uzasadniona) → (5) ODWOŁANIE: 14 DNI od doręczenia, do WOJEWODY za
  pośrednictwem organu, który wydał decyzję → dalej możliwa skarga do
  WSA

⚠️ PRAKTYCZNY PROBLEM: w PRAKTYCE wiele wniosków o wymeldowanie jest
  ODRZUCANYCH, bo wnioskodawcy MYLNIE traktują ten tryb jako "szybszą
  alternatywę" dla eksmisji — URZĄD BADA WYŁĄCZNIE fakt opuszczenia
  lokalu, NIE rozstrzyga sporów o TYTUŁ PRAWNY do niego (te należą do
  sądu cywilnego, oddzielne postępowanie)

Potwierdzone w 7+ zgodnych, aktualnych źródłach eksperckich
(poradnikprzedsiebiorcy.pl, legalhelp.pl, inwestum.pl [marzec 2026],
sprawdzonynajemca.pl [x2, maj 2026], gierusradca.pl, prawo-mieszkaniowe.info,
homly.to [wrzesień 2025]).
```

## ⭐ "DZIKIE MIESZKANIE" / SAMOWOLNE ZAJĘCIE PUSTOSTANU (dodane
2026-08-04, na żądanie użytkownika)

```
⚠️ ZASKAKUJĄCE, ALE KLUCZOWE USTALENIE: prawo polskie, WBREW
  intuicji, ZAPEWNIA pewną ochronę NAWET osobie zajmującej lokal
  BEZ JAKIEGOKOLWIEK tytułu prawnego od samego początku (tzw. "dziki
  lokator"/squatting) — ochrona ta wynika z ZASADY NIENARUSZALNOŚCI
  POSIADANIA (nie z tytułu prawnego), a NIE oznacza akceptacji
  prawa do zajmowania lokalu na stałe

BRAK DEFINICJI USTAWOWEJ "PUSTOSTANU" w polskim prawie — potocznie:
  lokal nieużywany/niezamieszkany, którym nikt widocznie się nie
  interesuje

WŁAŚCICIEL NIE MOŻE SAMODZIELNIE USUNĄĆ "DZIKIEGO LOKATORA" —
  ⭐ KLUCZOWY MECHANIZM OCHRONNY (art. 193 KK — naruszenie miru
  domowego): "Kto wdziera się do cudzego domu, mieszkania, lokalu,
  pomieszczenia albo ogrodzonego terenu albo WBREW ŻĄDANIU osoby
  uprawnionej miejsca takiego NIE OPUSZCZA, podlega grzywnie, karze
  ograniczenia wolności albo pozbawienia wolności do roku"
  → OCHRONA przysługuje KAŻDEMU, kto FAKTYCZNIE włada lokalem,
    NAWET osobie BEZ umowy najmu I bez meldunku
  → DZIAŁANIA ZAKAZANE dla właściciela: wymiana zamków, odcięcie
    mediów, wyrzucenie rzeczy lokatora, jakiekolwiek SAMODZIELNE
    (pozasądowe) usunięcie — WSZYSTKIE te działania są NIELEGALNE i
    grożą ODPOWIEDZIALNOŚCIĄ KARNĄ dla WŁAŚCICIELA (nie dla
    squattera!) — dodatkowo mogą prowadzić do zarzutów o stalking
    (art. 190a KK) lub zniszczenie mienia
  → RYZYKO DLA WŁAŚCICIELA: "dziki lokator" usunięty siłą MOŻE
    wygrać CYWILNY proces o PRZYWRÓCENIE POSIADANIA (mimo że
    PIERWOTNIE nie miał żadnego prawa do lokalu!) — paradoksalnie
    WZMACNIA to jego pozycję kosztem właściciela, który wziął prawo
    "we własne ręce"

JEDYNA LEGALNA DROGA: POSTĘPOWANIE SĄDOWE o EKSMISJĘ — podstawa
  cywilnoprawna: art. 222 §1 KC (roszczenie WINDYKACYJNE) —
  właściciel żąda WYDANIA rzeczy od osoby WŁADAJĄCEJ NIĄ bez
  SKUTECZNEGO tytułu prawnego. W pozwie: żądanie opróżnienia,
  opuszczenia i wydania lokalu

⚠️ NAWET PRZY EKSMISJI SQUATTERA — sąd NIE MOŻE być CZYSTO
  FORMALISTYCZNY: musi zbadać, czy żądanie eksmisji w KONKRETNYCH
  okolicznościach NIE STANOWI NADUŻYCIA PRAWA (art. 5 KC) z
  uwzględnieniem art. 8 EKPC (prawo do poszanowania życia
  prywatnego/rodzinnego/MIESZKANIA) — POTWIERDZONE wyrokiem SO
  Warszawa-Praga (IV Ca 2244/16, 14.10.2019, WCIĄŻ cytowany w 2026
  r.): "eksmisja jest najdalej idącym, często NIEODWRACALNYM
  ograniczeniem prawa do mieszkania; już samo ZAGROŻENIE eksmisją
  jest ingerencją" w to prawo — NIE wystarczy stwierdzić "brak
  tytułu prawnego = eksmisja zasądzona" bez dalszej analizy

WYŁĄCZENIA Z OCHRONY PRZYSŁUGUJĄCEJ "ZWYKŁYM" LOKATOROM (dziki
  lokator NIE KORZYSTA z tych przywilejów):
  → art. 17 ustawy o ochronie praw lokatorów: CO DO ZASADY wyklucza
    przyznanie MIESZKANIA SOCJALNEGO osobie, która zajęła cudzy
    dom/lokal BEZ tytułu prawnego — WYJĄTEK: sytuacje SZCZEGÓLNIE
    uzasadnione zasadami współżycia społecznego
  → BRAK OKRESU OCHRONNEGO (zimowego, 1.11-31.03): eksmisja
    "dzikiego lokatora" MOŻE nastąpić W DOWOLNYM CZASIE ROKU — TA
    SAMA zasada dotyczy sprawców przemocy domowej i osób rażąco
    naruszających porządek domowy
  → MOŻLIWA "eksmisja na bruk" (bez zapewnienia LOKALU ZASTĘPCZEGO
    czy TYMCZASOWEGO POMIESZCZENIA) — jeden z NIEWIELU przypadków w
    polskim prawie, gdy to dopuszczalne

ROSZCZENIA RÓWNOLEGŁE właściciela: ODSZKODOWANIE za bezumowne
  korzystanie z lokalu (patrz sekcja WYŻEJ — art. 224/225 KC lub art.
  18 ustawy o ochronie praw lokatorów) — DOCHODZONE RÓWNOLEGLE z
  żądaniem eksmisji, w TYM SAMYM postępowaniu

Potwierdzone w 6+ zgodnych, aktualnych źródłach (bankier.pl,
listaprzetargow.pl [luty 2026], dobregonajmu.pl [kwiecień 2026],
skup.io, adwokatmoszczynska.pl [marzec 2026, z cytatem orzeczenia SO],
kancelariasledcza.pl, homly.to [kwiecień 2026]).
```

ZASIEDZENIE (art. 172 KC) — ⚠️ ROZBUDOWANE 2026-07-18, PEŁNA TREŚĆ
PRZENIESIONA do dedykowanego modułu:
  → view /mnt/skills/user/dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-rzeczy-znalezione-zasiedzenie.md
  Skrót: nieruchomość 20 lat (dobra wiara) / 30 lat (zła wiara),
  ruchomość 3 lata (dobra wiara) — PEŁNE kryteria dobrej/złej wiary,
  doliczanie posiadania poprzednika (art. 176 KC), ograniczenie dla
  nieruchomości rolnych (300 ha, rolnik indywidualny), procedura
  (sąd rejonowy, nieprocesowe, art. 609-610 KPC) — patrz moduł wyżej,
  NIE duplikuj tutaj.

WŁASNOŚĆ — ROSZCZENIA WINDYKACYJNE (art. 222 KC):
  → Roszczenie o wydanie: skierowane do każdego, kto faktycznie włada rzeczą bez prawa
  → Roszczenie negatoryjne (art. 222 §2): o przywrócenie stanu zgodnego z prawem
  → Przedawnienie: roszczenia o nieruchomości NIE przedawniają się
```

### Źródła online
```
web_search: "służebność drogi koniecznej art 145 KC isap.sejm.gov.pl wyrok SN 2024 2025"
web_search: "zasiedzenie nieruchomość art 172 KC dobra zła wiara termin SN orzecznictwo"
```

---

## POWIĄZANIA Z INNYMI MODUŁAMI (DR-02)

> Aktualizacja 2026-06-14 (NOTA-4, audyt-systemu-v4): usunięto ANEKS E
> (dział spadku/nabycie spadku) jako duplikat — pełne, bardziej szczegółowe
> pokrycie w mod-KC-spadki.md (238 linii, w tym zachowek, formy testamentu,
> zmiany od 15.11.2023). Wydzielono ANEKS F (kredyty frankowe) do osobnego
> modułu mod-KC-kredyty-frankowe.md (temat masowy, samodzielny).

- **Dział spadku, nabycie spadku, zachowek** → mod-KC-spadki.md (moduł
  dedykowany, pełne pokrycie art. 925-1011 KC + KPC art. 680-689)
- **Kredyty frankowe (abuzywność klauzul, art. 385¹ KC)** →
  mod-KC-kredyty-frankowe.md (wydzielony moduł, temat masowy)
- **Definicje szkody/odpowiedzialności (art. 415, 442¹, 361 KC)** →
  shared/definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md C.2-C.3 (kanoniczna
  definicja dwóch reżimów odpowiedzialności; tabela w sekcji 3 PROCEDURA
  powyżej jest praktyczną wersją porównawczą dla kwalifikacji sprawy —
  oba ujęcia są celowo zachowane, gdyż służą różnym celom)
