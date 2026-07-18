# MODUŁ SHARED-ABUSIVE — KLAUZULE ABUZYWNE UE/PL
## Analizator Umów v1 · Silnik Niezależny

> **Wczytaj gdy:** analiza regulaminów, SaaS, marketplace, e-commerce, OWU,
> platform cyfrowych, umów z konsumentami, klauzul B2B data-sharing.
> Może działać NIEZALEŻNIE od głównej analizy — wywołaj bezpośrednio.
> Priorytet: regulaminy + SaaS + marketplace + treść cyfrowa + IoT/Data.

> ⛔ HARD GATE — każdy przepis, numer wpisu UOKiK i sygnatura orzeczenia
> MUSZĄ być zweryfikowane online przed powołaniem.
>
> ```
> Podstawy PL:    isap.sejm.gov.pl → KC → art. 385¹–385³ (aktualne brzmienie)
> Rejestr UOKiK:  rejestr.uokik.gov.pl → wyszukaj frazę klauzuli
>                 ⚠️ od 18.04.2026 wyłącznie baza zanonimizowana/informacyjna
>                 (utracił charakter ustawowy — szczegóły: SKILL.md, Zasada 1-2).
>                 Dla spraw PO 17.04.2016 → tylko decyzje UOKiK poniżej, nie rejestr.
> Decyzje UOKiK:  uokik.gov.pl/decyzje-i-postanowienia
> Dyrektywy UE:   eur-lex.europa.eu (93/13/EWG, 2019/770, 2019/771, 2019/2161)
> Data Act:       eur-lex.europa.eu → 2023/2854 (stosowanie od 12.09.2025)
> DSA/DMA:        eur-lex.europa.eu → 2022/2065, 2022/1925
> Orzecznictwo:   orzeczenia.ms.gov.pl (XVII AmC SOKiK) · sn.pl · curia.europa.eu
> ```

---

## AB.1 METODOLOGIA — FORMAT TABELI WYNIKOWEJ

```
Dla KAŻDEJ klauzuli podejrzanej lub wskazanej generuj:

┌────────────────────────────────────────────────────────────────────┐
│  KLAUZULA: [treść lub opis]                                        │
├───────────────┬────────────────────────────────────────────────────┤
│ ABUZYWNA      │ TAK / NIE / WĄTPLIWA                               │
│ PODSTAWA      │ [przepis: art. 385¹ KC / art. X dyrektywy Y]      │
│ REJESTR UOKIK │ [numer wpisu lub "nie znaleziono — ver. online"]   │
│ ORZECZNICTWO  │ [sygnatura SN/TSUE/SA lub "weryfikuj sn.pl"]       │
│ RYZYKO 0–100  │ [liczba] + poziom: NISKI/ŚREDNI/WYSOKI/KRYTYCZNY   │
│ SKUTEK PRAWNY │ bezskuteczna / nieważna (art. 58 KC) / ryzyko dec. │
│ REKOMENDACJA  │ [gotowe alternatywne brzmienie lub "usuń"]         │
└───────────────┴────────────────────────────────────────────────────┘

SKALA RYZYKA:
  0–25:   NISKI — niestandardowa, ale nie wprost zakazana
  26–50:  ŚREDNI — może być uznana za abuzywną, ryzyko UOKiK
  51–75:  WYSOKI — zbieżna z rejestrem UOKiK lub narusza dyrektywę
  76–100: KRYTYCZNY — nieważna / decyzja UOKiK / wyrok TSUE wprost
```

---

## AB.2 PODSTAWA PL — KC ART. 385¹–385³

> Weryfikuj: isap.sejm.gov.pl → KC Dz.U. 2025 poz. 1071 t.j. ze zm.

### Definicja klauzuli abuzywnej (art. 385¹ §1 KC)
```
Postanowienie umowne nieuzgodnione indywidualnie = ABUZYWNE gdy:
  (1) kształtuje prawa i obowiązki konsumenta SPRZECZNIE Z DOBRYMI OBYCZAJAMI
  AND
  (2) RAŻĄCO NARUSZA interesy konsumenta

WYJĄTKI od oceny abuzywności (art. 385¹ §1 KC):
  → postanowienia określające GŁÓWNE ŚWIADCZENIA stron (cena, wynagrodzenie)
     ... pod warunkiem że zostały sformułowane w sposób JEDNOZNACZNY
     ⚠️ Uwaga: TSUE i SN rozszerzają ocenę na postanowienia dotyczące ceny
     gdy sposób ustalania ceny jest niejasny (klauzule indeksacyjne — linia frankowa)

SZARA LISTA (art. 385³ KC — 23 typy klauzul domniemanie abuzywnych):
  Weryfikuj aktualną listę w isap.sejm.gov.pl → KC → art. 385³

Najczęstsze w SaaS/marketplace/e-commerce:
  pkt 2  → prawo zmiany regulaminu bez prawa wypowiedzenia
  pkt 4  → sąd właściwy dla siedziby przedsiębiorcy (nie konsumenta)
  pkt 9  → wyłączenie odpowiedzialności za niewykonanie
  pkt 10 → prawo do jednostronnej zmiany bez ważnego powodu
  pkt 12 → prawo do zmiany ceny bez prawa odstąpienia
  pkt 16 → kary umowne tylko dla konsumenta, brak symetrii
  pkt 21 → zastrzeżenie nieuzasadnionego terminu dla przedsiębiorcy
  
→ Weryfikuj numery pkt. w aktualnym tekście KC!
```

---

## AB.3 DYREKTYWA 93/13/EWG — STANDARD UE

```
Dyrektywa Rady 93/13/EWG z 5 kwietnia 1993 r.
  → eur-lex.europa.eu → CELEX:31993L0013

Aneks 1: wzorcowa lista klauzul potencjalnie abuzywnych (nie wiążąca)
Zasada skutku bezpośredniego: sąd MUSI badać abuzywność z urzędu (TSUE C-618/10)

Kluczowe wyroki TSUE — weryfikuj na curia.europa.eu:
  C-618/10 Banco Español:   sąd bada abuzywność z urzędu
  C-26/13 Kásler:            klauzule indeksacyjne mogą dotyczyć świadczeń głównych
  C-260/18 Dziubak:          skutek abuzywności — nieważność umowy frankowej
  C-520/21 Bank M.:          bank bez prawa do wynagrodzenia za kap. po unieważnieniu
  C-215/17 Nova Linea:       informacja przedkontraktowa — pełna przejrzystość
  
⚠️ Każda sygnatura: weryfikuj URL w curia.europa.eu przed powołaniem.
```

---

## AB.4 DYREKTYWA OMNIBUS (2019/2161) — NOWE STANDARDY

```
Dyrektywa 2019/2161 z 27.11.2019 r.
  → eur-lex.europa.eu → CELEX:32019L2161
  → Implementacja PL: ustawa z 1.12.2022, wejście w życie 01.01.2023
  → Dz.U. 2022 poz. 2581 (weryfikuj aktualny stan w isap.sejm.gov.pl)

NOWE OBOWIĄZKI INFORMACYJNE (klauzule ryzyka):
  □ Obowiązek podania NAJNIŻSZEJ CENY z ostatnich 30 dni przed obniżką
     → brak informacji = klauzula wprowadzająca w błąd
  □ Zakaz FAŁSZYWYCH OPINII w marketplace: tylko od faktycznych nabywców
  □ UJAWNIENIE PŁATNEGO PLASOWANIA wyników wyszukiwania
  □ Przejrzystość ALGORYTMÓW cenowych (dynamiczne ceny)
  □ Marketplace: ujawnienie czy sprzedawca jest przedsiębiorcą czy prywatną osobą

SANKCJE (Omnibus — weryfikuj w ustawie o prawach konsumenta i PNPU):
  → Kara dla przedsiębiorcy: do 2 mln EUR (organ krajowy: UOKiK)
  → Naruszenia unijne (ECCP): do 4% rocznego obrotu UE
  → Weryfikuj aktualne kwoty: web_search "Omnibus kara UOKiK 2024 2025 ustawa"

KLAUZULE SZCZEGÓLNEGO RYZYKA (Omnibus × KC):
  ⚠️ Brak informacji o najniższej cenie 30-dniowej → naruszenie + ryzyko UOKiK
  ⚠️ "Opinie zweryfikowane" bez systemu weryfikacji → wprowadzanie w błąd
  ⚠️ Automatyczne odnowienie subskrypcji bez przypomnienia → art. 17a u.p.k.
  ⚠️ Brak przejrzystości rankingów w marketplace → art. 6b PNPU
```

---

## AB.5 DSA — DIGITAL SERVICES ACT (2022/2065)

```
Rozporządzenie (UE) 2022/2065 z 19.10.2022
  → eur-lex.europa.eu → CELEX:32022R2065
  → Pełne stosowanie od 17.02.2024
  → Organ: Prezes UKE (Polska) + Komisja Europejska (VLOP/VLOSE)

DOTYCZY REGULAMINÓW I UMÓW:
  PLATFORMY POŚREDNIE (hosting, marketplace, sieci społecznościowe):
  □ Warunki korzystania MUSZĄ być czytelne, jasne, dostępne dla nieletnich
  □ OBOWIĄZEK UZASADNIENIA moderacji treści — klauzule "według uznania" → ryzyko
  □ System skarg i środków odwoławczych (art. 17–20 DSA) → brak = naruszenie
  □ Przejrzystość reklam: zakaz targetowania na nieletnych, zakaz profilowania danych wrażliwych

KLAUZULE RYZYKA W REGULAMINACH (DSA):
  ⚠️ "Możemy usunąć konto/treść bez podania przyczyn" (art. 17 DSA — MUSI być uzasadnienie)
  ⚠️ Brak mechanizmu odwołania od decyzji moderacyjnej → naruszenie art. 20 DSA
  ⚠️ Reklama targetowana bez ujawnienia sponsora → naruszenie art. 26 DSA
  ⚠️ Brak systemu raportowania nielegalnych treści → naruszenie art. 16 DSA
  ⚠️ Klauzule "warunki mogą ulec zmianie bez powiadomienia" dla platform → DSA wymaga powiadomienia

VLOP/VLOSE (platformy bardzo duże — >45 mln użytkowników UE):
  → Dodatkowe obowiązki: ocena ryzyk systemowych, audyt zewnętrzny
  → Ryzyko kary: do 6% globalnego obrotu
```

---

## AB.6 DMA — DIGITAL MARKETS ACT (2022/1925)

```
Rozporządzenie (UE) 2022/1925 z 14.09.2022
  → eur-lex.europa.eu → CELEX:32022R1925
  → Stosowanie od 06.03.2024 dla wyznaczonych gatekeeperów

KLAUZULE KONTRAKTOWE RYZYKA (kto zawiera umowę z gatekeeperem):
  □ Klauzule MFN (Most Favoured Nation) / parytet cenowy — ZAKAZANE (art. 5(3) DMA)
  → "Nie możesz oferować niższej ceny na innych platformach"
  ⚠️ RYZYKO: 100/100 dla gatekeeperów + potencjalne dla wszystkich B2B

  □ Self-preferencing: gatekeeper nie może faworyzować własnych usług
  □ Bundling: zakaz wiązania produktów/usług (art. 5(7) DMA)
  □ Interoperacyjność: użytkownik ma prawo instalować inne aplikacje/usługi

KLAUZULE DO SPRAWDZENIA W UMOWACH Z PLATFORMAMI:
  ⚠️ "Obowiązujesz się oferować nas cenę nie niższą niż u innych dostawców" → DMA zakazane
  ⚠️ "Używasz wyłącznie naszych usług płatniczych" → art. 5(7) DMA
  ⚠️ "Zakaz pobierania własnych danych po zakończeniu umowy" → art. 6(9) DMA

Gatekeeperzy wyznaczeni (weryfikuj aktualną listę):
  → web_search: "DMA gatekeeper designated companies 2025 2026 list"
```

---

## AB.7 DATA ACT (2023/2854) — STOSOWANIE OD 12.09.2025

> Data Act (Rozp. UE 2023/2854) wszedł w życie 11 stycznia 2024 r.,
> natomiast jego stosowanie rozpoczęło się 12 września 2025 r.

```
Rozporządzenie (UE) 2023/2854 z 13.12.2023
  → eur-lex.europa.eu → CELEX:32023R2854
  → Stosowanie od: 12.09.2025 (nowe umowy zawarte po tej dacie)
  → Rozdział IV (nieuczciwe postanowienia B2B): umowy po 12.09.2025 lub od 12.09.2027

KLUCZOWE ZAKAZY KONTRAKTOWE (art. 34–36 Data Act — klauzule B2B):
  NIEUCZCIWE gdy:
  □ Nakładają na słabszą stronę rażącą nierównowagę praw/obowiązków dot. danych
  □ Wyłączają/ograniczają środki prawne przy niewykonaniu obowiązku dostępu do danych
  □ Dają silniejszej stronie prawo jednostronnego ustalania warunków dostępu do danych

OBOWIĄZKI DOSTAWCÓW USŁUG CHMUROWYCH (rozdziały V–VI):
  □ Zapewnienie prawa do przenoszenia danych i usług (cloud switching)
  □ Zakaz klauzul vendor lock-in: nie można kontraktowo utrudniać zmiany dostawcy
  □ Interoperacyjność: stosowanie otwartych standardów (art. 33–36)
  □ Obowiązek udostępnienia danych na żądanie użytkownika (IoT, urządzenia skomunikowane)

KLAUZULE RYZYKA DATA ACT (najczęstsze w SaaS/cloud/IoT):
  ⚠️ "Dane wytworzone przez urządzenie/usługę są własnością wyłącznie dostawcy" → art. 4 Data Act
  ⚠️ "Zakaz przenoszenia danych do innego dostawcy" lub opłaty transferowe zaporowe → art. 25-26
  ⚠️ "Dostawca może zmienić format danych bez powiadomienia" → naruszenie interoperacyjności
  ⚠️ Brak klauzuli exit/switching w umowie chmurowej → niezgodność od 12.09.2025
  ⚠️ IoT: brak dostępu użytkownika do danych z własnego urządzenia → art. 4–5 Data Act
  ⚠️ Klauzule poufności blokujące dostęp do danych generowanych przez użytkownika → art. 34

ORGAN NADZORU PL (planowany):
  → Prezes UKE (planowany) — weryfikuj: web_search "Data Act organ nadzoru Polska 2025 2026"

NOTA: Data Act stosuje się do umów zawartych po 12.09.2025.
Umowy starsze: od 12.09.2027 (gdy zawarte na czas nieokreślony lub po 11.01.2034).
```

---

## AB.8 DYREKTYWA O TREŚCI CYFROWEJ (2019/770) I TOWAROWA (2019/771)

```
Dyrektywa 2019/770 (treść cyfrowa i usługi cyfrowe) + 2019/771 (towary):
  → Implementacja PL: ustawa z 4.11.2022, wejście w życie 01.01.2023
  → Dz.U. 2022 poz. 2581 (weryfikuj: isap.sejm.gov.pl)

KLAUZULE RYZYKA (treść cyfrowa / SaaS B2C):
  ⚠️ Brak informacji o aktualizacjach oprogramowania i ich czasie trwania
  ⚠️ Prawo do zmiany treści cyfrowej bez uzasadnionego powodu → abuzywna (art. 46 u.p.k.)
  ⚠️ Brak prawa do zakończenia subskrypcji w każdym czasie (usługi ciągłe)
  ⚠️ Wyłączenie prawa do niezgodności treści cyfrowej z umową (art. 43a–43n u.p.k.)
  ⚠️ Umowy na dane osobowe jako "wynagrodzenie": klauzule ograniczające prawa RODO
```

---

## AB.9 TRYB NIEZALEŻNEGO SKANOWANIA

```
WYWOŁANIE NIEZALEŻNE (bez pełnej analizy umowy):
  Użytkownik: "sprawdź klauzule abuzywne w tym regulaminie/umowie"
  → Pomiń Fazę 0 i routing → uruchom BEZPOŚREDNIO ten moduł

SEKWENCJA SKANOWANIA:
  1. Zidentyfikuj typ dokumentu: regulamin / OWU / SaaS / marketplace / B2C / B2B-data
  2. Wybierz właściwe podstawy z AB.2–AB.8 odpowiednie dla typu
  3. Przeskanuj każdą klauzulę pod kątem listy wzorców ryzyka
  4. Dla każdej podejrzanej → generuj tabelę z AB.1
  5. Podsumowanie: łączna tabela + TOP 3 ryzyki + rekomendacje

TRIGGERY AUTOMATYCZNE (skanuj zawsze gdy wykryto):
  "według uznania" / "według naszej decyzji" → AB.3 + AB.5
  "możemy zmienić regulamin / cenę" → AB.2 (art. 385³ pkt 10) + AB.4
  "nie odpowiadamy za" + ograniczenie odpowiedzialności → AB.2 (pkt 9)
  "dane urządzenia / dane generowane" → AB.7 (Data Act)
  "sąd właściwy: [miasto siedziby firmy]" → AB.2 (pkt 4)
  "zakaz transferu do konkurencji" → AB.6 (DMA pkt 3)
  "automatyczne odnowienie" → AB.4 (Omnibus)
  "opinie zweryfikowane" → AB.4 (Omnibus)
  "wyłączny dostawca danych" → AB.7 (Data Act art. 34)

WERYFIKACJA ONLINE — OBOWIĄZKOWA PRZY KAŻDYM WYNIKU:
  → rejestr.uokik.gov.pl: szukaj fraz klauzuli (zakaz cytowania numeru z pamięci)
  → eur-lex.europa.eu: weryfikuj przywołany artykuł dyrektywy
  → curia.europa.eu: weryfikuj sygnatury TSUE przed powołaniem
  → sn.pl + orzeczenia.ms.gov.pl: weryfikuj krajowe orzeczenia
```

---

## AB.10 ŹRÓDŁA ONLINE

```
isap.sejm.gov.pl → KC → art. 385¹–385³ + ustawa o prawach konsumenta
rejestr.uokik.gov.pl       → rejestr klauzul niedozwolonych (PL)
uokik.gov.pl/decyzje       → decyzje administracyjne UOKiK
eur-lex.europa.eu          → dyrektywy 93/13, 2019/770, 2019/771, 2019/2161, 2022/2065, 2022/1925, 2023/2854
curia.europa.eu            → orzeczenia TSUE (weryfikuj sygnatury)
orzeczenia.ms.gov.pl       → XVII AmC SOKiK (specjalistyczny sąd ochrony konsumentów)
sn.pl                      → uchwały i wyroki SN dot. klauzul abuzywnych

web_search wygeneruj:
  "klauzule abuzywne SaaS marketplace [rok] UOKiK"
  "Data Act klauzule kontraktowe 2025 2026 ryzyko"
  "DSA DMA regulamin klauzule abuzywne 2024 2025"
```

---

*mod-shared-abusive-clauses.md · Analizator Umów v1 · Wczytaj: view references/mod-shared-abusive-clauses.md*
*Podstawy: KC art. 385¹–385³ (isap) · 93/13/EWG · Omnibus 2019/2161 · DSA 2022/2065 · DMA 2022/1925 · Data Act 2023/2854 · Dir. 2019/770*
*Weryfikuj zawsze przed użyciem: rejestr.uokik.gov.pl · eur-lex.europa.eu · curia.europa.eu*
