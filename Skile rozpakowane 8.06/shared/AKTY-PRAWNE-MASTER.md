# AKTY-PRAWNE-MASTER — jedyne źródło prawdy o aktualności aktów prawnych

**Wersja:** 1.0  
**Data ostatniej aktualizacji:** 2026-06-01 (weryfikacja online)  
**Aktualizuje:** osoba odpowiedzialna za utrzymanie systemu (nie model AI)  
**Zastępuje:** LEGAL-REGISTRY.md, ISAP-METRYKI-AKTOW.md, ONLINE-VERIFIED-LEGAL-UPDATES-ROUND1÷4.csv, ISAP-AUDIT-PROTOCOL.md (sekcja metryk)

---

## ZASADA UŻYCIA

> ⛔ Ten plik jest jedynym miejscem w systemie, gdzie przechowywane są metryki Dz.U.
> Żaden moduł DR-skill ani skill wykonawczy NIE MOŻE przechowywać własnych metryk Dz.U.
> Przy każdej analizie prawnej: wczytaj ten plik → znajdź akt → użyj jako punktu startowego → sprawdź ISAP online przed cytowaniem.

### Statusy aktów

| Status | Znaczenie |
|---|---|
| `AKTUALNY` | Tekst jednolity potwierdzony w ISAP na datę aktualizacji pliku |
| `PO-TJ-ZMIANY` | Tekst jednolity istnieje, ale po jego ogłoszeniu weszły nowelizacje — sprawdź zakres zmian |
| `WYMAGA-KONTROLI` | Brak potwierdzonego t.j. lub liczne zmiany — zawsze sprawdź ISAP przed użyciem |
| `OCZEKUJE-WEJSCIA` | Opublikowany, nie obowiązuje jeszcze w całości — sprawdź przepisy przejściowe |

### Ryzyko dezaktualizacji (dla priorytetu weryfikacji)

| Ryzyko | Dziedziny |
|---|---|
| 🔴 Bardzo wysokie | podatki/KAS, AML, cudzoziemcy, energetyka, cyberbezpieczeństwo, środowisko, planowanie, zamówienia publiczne |
| 🟠 Wysokie | KK/KPK, KSH, upadłość/restrukturyzacja, koszty sądowe, ZUS/FUS, prawo farmaceutyczne |
| 🟡 Średnie | KPC, KPA, prawo pracy, RODO/UODO, konsumenckie, prawo budowlane |
| 🟢 Niższe | część KC (rzeczowe/spadkowe), KRO — ale ZAWSZE sprawdź konkretny artykuł |

---

## BLOK 1 — KODEKSY PROCEDURALNE

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| KPC | Kodeks postępowania cywilnego | Dz.U. 2026 poz. 468 (+ poz. 473 w t.j.) | PO-TJ-ZMIANY | 🟡 | Nowelizacja Dz.U. 2025 poz. 1172 — część przepisów od 1.03.2026 (cyfryzacja, mediacja budowlana); część od 1.03.2027 |
| KPK | Kodeks postępowania karnego | Dz.U. 2026 poz. 490 + zmiana Dz.U. 2026 poz. 638 | PO-TJ-ZMIANY | 🟠 | Kontrolować datę czynności procesowej; zmiana poz. 638 oczekuje |
| KPA | Kodeks postępowania administracyjnego | Dz.U. 2025 poz. 1691 | AKTUALNY | 🟡 | Nie stosować gdy Ordynacja podatkowa lex specialis |
| PPSA | Prawo o postępowaniu przed sądami adm. | Dz.U. 2026 poz. 143 | AKTUALNY | 🟡 | Skargi WSA/NSA, kasacja, bezczynność; zmiana Dz.U. 2025 poz. 1427 uwzględniona |
| UPEA | Ustawa o postępowaniu egzekucyjnym w adm. | Dz.U. 2026 poz. 532 | AKTUALNY | 🟡 | Odrębny tryb od egzekucji sądowej |

---

## BLOK 2 — KODEKSY MATERIALNE

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| KC | Kodeks cywilny | t.j. ISAP: Dz.U. 2025 poz. 1071 + zmiany Dz.U. 2025 poz. 1172, 1508 + Dz.U. 2026 poz. 184, 507 | PO-TJ-ZMIANY | 🟢→🟡 | Zawsze sprawdź konkretny artykuł + przepisy przejściowe |
| KK | Kodeks karny | Dz.U. 2025 poz. 383 + zmiany Dz.U. 2025 poz. 1818, 1872 + zmiana Dz.U. 2026 poz. 638 | PO-TJ-ZMIANY | 🟠 | Zmiana Dz.U. 2026 poz. 638 modyfikuje art. m.in. rozdz. XVI, XVII i inne — sprawdź datę wejścia |
| KP | Kodeks pracy | Dz.U. 2025 poz. 277 + zmiany Dz.U. 2025 poz. 807, 1423 + Dz.U. 2026 poz. 25 | PO-TJ-ZMIANY | 🟡 | Zmiany 2025 i ZFŚS Dz.U. 2026 poz. 25 — sprawdź daty wejścia w życie |
| KRO | Kodeks rodzinny i opiekuńczy | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟢 | Stabilny, ale sprawdź t.j. przed cytowaniem |
| KSH | Kodeks spółek handlowych | t.j. ISAP z 12.03.2026 + zmiany Dz.U. 2026 poz. 176, 644 | PO-TJ-ZMIANY | 🟠 | Sprawdzać wejście w życie zmian 2026; transformacje spółek |
| KW | Kodeks wykroczeń | Dz.U. 2025 poz. 734 + zmiany Dz.U. 2025 poz. 1676, 1814 | PO-TJ-ZMIANY | 🟡 | t.j. z 21.05.2025; zmiana art. 51 (zakłócanie spokoju w placówkach medycznych) od 2026 |
| KKS | Kodeks karny skarbowy | Dz.U. 2025 poz. 633 + zmiany Dz.U. 2026 (deregulacja od 1.01.2026) | PO-TJ-ZMIANY | 🔴 | t.j. z 10.04.2025; nowelizacja 2026 — obniżenie kar za przestępstwa skarbowe o charakterze formalnym |

---

## BLOK 3 — PROCEDURA SĄDOWA I KOSZTY

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| KSCU | Koszty sądowe w sprawach cywilnych | Dz.U. 2025 poz. 1228 + zmiana Dz.U. 2026 poz. 346 | PO-TJ-ZMIANY | 🟠 | Sprawdzać zmiany 2026; opłaty stosunkowe |
| USP | Prawo o ustroju sądów powszechnych | t.j. ISAP z 21.04.2026 + zmiana Dz.U. 2026 poz. 370 + regulamin Dz.U. 2026 poz. 278 | PO-TJ-ZMIANY | 🟡 | Wyłączenie sędziego, organizacja, przewlekłość |
| PROK | Prawo o prokuraturze | t.j. ISAP z 17.04.2026 + zmiana Dz.U. 2026 poz. 370, 140 | PO-TJ-ZMIANY | 🟡 | Skargi na prokuraturę, czynności organów ścigania |

---

## BLOK 4 — PRAWO CYWILNE MATERIALNE (ustawy szczególne)

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| PR | Prawo restrukturyzacyjne | Dz.U. 2026 poz. 533 | AKTUALNY | 🟠 | Nowy tekst jednolity |
| PU | Prawo upadłościowe | Dz.U. 2025 poz. 614 | PO-TJ-ZMIANY | 🟠 | Sprawdzić zmiany po t.j. i wejście w życie |
| PPRZEDS | Prawo przedsiębiorców | Dz.U. 2025 poz. 1480 + zmiany Dz.U. 2025 poz. 1795, 1826 + Dz.U. 2026 poz. 507 | PO-TJ-ZMIANY | 🟡 | Działalność regulowana, gospodarcza |
| UOKiK | Ustawa o ochronie konkurencji i konsumentów | Dz.U. 2026 poz. 85 | AKTUALNY | 🟡 | Klauzule abuzywne, postępowania UOKiK |
| UPrKons | Ustawa o prawach konsumenta | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟡 | Sprawdź t.j. przed każdą sprawą konsumencką |

---

## BLOK 5 — PRAWO PRACY I UBEZPIECZENIA SPOŁECZNE

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| SUS | Ustawa o systemie ubezpieczeń społecznych | Dz.U. 2026 poz. 199 (t.j. z 9.02.2026) + zmiana Dz.U. 2026 poz. 26 | PO-TJ-ZMIANY | 🟠 | Zmiana Dz.U. 2026 poz. 26 wchodzi etapami (27.01.2026, 13.04.2026) — sprawdź przepisy przejściowe |
| FUS | Ustawa o emeryturach i rentach z FUS | Dz.U. 2025 poz. 1749 (t.j. z 7.11.2025) + zmiany Dz.U. 2026 poz. 26, 425 | PO-TJ-ZMIANY | 🟠 | Zmiana Dz.U. 2026 poz. 425 z 13.02.2026; sprawdź przepisy przejściowe |
| REHAB | Ustawa rehabilitacyjna (PFRON) | Dz.U. 2025 poz. 913 (t.j.) + zmiany 2025 | PO-TJ-ZMIANY | 🟠 | PFRON, świadczenie wspierające, zatrudnienie chroniące |
| KRUS | Ustawa o ubezpieczeniu społecznym rolników | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟠 | KRUS, renty rolnicze, wypadki |
| PS | Ustawa o pomocy społecznej | Dz.U. 2025 poz. 1214 + zmiany 2025/2026 | PO-TJ-ZMIANY | 🟠 | Zasiłki, DPS, odwołania SKO/WSA |

---

## BLOK 6 — PRAWO ADMINISTRACYJNE I SAMORZĄDOWE

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| UDIP | Ustawa o dostępie do informacji publicznej | Dz.U. 2022 poz. 902 (t.j.) | PO-TJ-ZMIANY | 🟡 | Tryb wnioskowy, bezczynność, odmowa decyzją |
| USG | Ustawa o samorządzie gminnym | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟡 | Właściwość, nadzór, akty prawa miejscowego |
| USP2 | Ustawa o samorządzie powiatowym | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟡 | j.w. |
| USWO | Ustawa o samorządzie województwa | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟡 | j.w. |

---

## BLOK 7 — PODATKI I KAS

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| OP | Ordynacja podatkowa | Dz.U. 2026 poz. 622 (t.j. z 25.05.2026) | AKTUALNY | 🔴 | Postępowanie podatkowe lex specialis wobec KPA |
| KAS | Ustawa o Krajowej Administracji Skarbowej | Dz.U. 2025 poz. 1131 + zmiany Dz.U. 2026 poz. 395, 483 | PO-TJ-ZMIANY | 🔴 | Kontrola celno-skarbowa, UCS, czynności sprawdzające |
| AML | Ustawa o przeciwdziałaniu praniu pieniędzy | Dz.U. 2025 poz. 644 (t.j. z 9.05.2025) + Strategia M.P. 2026 poz. 247 | WYMAGA-KONTROLI | 🔴 | ⚠️ Rozporządzenie UE 2024/1624 zmienia reguły AML compliance — weryfikuj zakres stosowania polskiej ustawy vs. rozporządzenia |
| VATUP | Ustawa o VAT | Dz.U. 2025 poz. 775 (t.j. z 21.05.2025) + zmiany 2025/2026 | PO-TJ-ZMIANY | 🔴 | Podwyższenie zwolnienia podmiotowego do 240 tys. zł; KSeF w toku legislacyjnym |
| PITUP | Ustawa o PIT | Dz.U. 2026 poz. 592 (t.j. z 17.04.2026) | PO-TJ-ZMIANY | 🔴 | Sprawdź zmiany po t.j.; kasowy PIT dla małych firm od 2025 |
| CITUP | Ustawa o CIT | Dz.U. 2026 poz. 554 (t.j. z 27.03.2026) | PO-TJ-ZMIANY | 🔴 | Sprawdź zmiany po t.j.; deregulacja — zniesienie obowiązku strategii podatkowej dla dużych podatników |

---

## BLOK 8 — BUDOWNICTWO, ŚRODOWISKO, PLANOWANIE

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| PBUD | Prawo budowlane | Dz.U. 2026 poz. 524 | AKTUALNY | 🟡 | Pozwolenie, zgłoszenie, samowola, PINB/WINB |
| PLAN | Ustawa o planowaniu i zagospodarowaniu przestrzennym | Dz.U. 2026 poz. 538 | AKTUALNY | 🔴 | Plan ogólny, MPZP, WZ; reforma 2023 w toku |
| POS | Prawo ochrony środowiska | Dz.U. 2026 poz. 670 | AKTUALNY | 🔴 | Decyzje środowiskowe, emisje, kary |
| PRZYR | Ustawa o ochronie przyrody | Dz.U. 2026 poz. 13 | AKTUALNY | 🟡 | Drzewa, formy ochrony, RDOŚ/GDOŚ |
| PWOD | Prawo wodne | Dz.U. 2025 poz. 960 + zmiana Dz.U. 2026 poz. 445 | PO-TJ-ZMIANY | 🔴 | Wody Polskie, zgody wodnoprawne; sprawdź zakres zmiany |
| PGEO | Prawo geodezyjne i kartograficzne | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟡 | Wywłaszczenia, granice, mapy |

---

## BLOK 9 — ENERGIE, TRANSPORT, TELEKOMUNIKACJA

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| PENER | Prawo energetyczne | Dz.U. 2026 poz. 43 + zmiana Dz.U. 2026 poz. 516 | PO-TJ-ZMIANY | 🔴 | URE, taryfy, przyłączenia, OZE; sprawdź zakres zmiany poz. 516 |
| PKE | Prawo komunikacji elektronicznej | Dz.U. 2024 poz. 1221 | PO-TJ-ZMIANY | 🟡 | Stosować zamiast uchylanego Pt; sprawdź przepisy przejściowe |

---

## BLOK 10 — CYFROWE, DANE, IP

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| UODO | Ustawa o ochronie danych osobowych | Dz.U. 2018 poz. 1000 + powiązanie z KSC Dz.U. 2026 poz. 252 | PO-TJ-ZMIANY | 🟡 | UODO + RODO (rozp. UE); sprawdź t.j. |
| KSC | Ustawa o krajowym systemie cyberbezpieczeństwa | Dz.U. 2026 poz. 20 + zmiana Dz.U. 2026 poz. 252 | PO-TJ-ZMIANY | 🔴 | NIS2; sprawdzać status nowelizacji |
| DOSTCYF | Ustawa o dostępności cyfrowej | Dz.U. 2026 poz. 562 | PO-TJ-ZMIANY | 🟡 | Dostępność stron/aplikacji publicznych |

---

## BLOK 11 — ZAMÓWIENIA PUBLICZNE I FUNDUSZE UE

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| PZP | Prawo zamówień publicznych | Dz.U. 2024 poz. 1320 (ostatni t.j.) + zmiany od 1.01.2026 (poz. 1173), 13.03.2026 (poz. 769), 12.07.2026 (certyfikacja poz. 1235) | PO-TJ-ZMIANY | 🔴 | ⚠️ Brak nowego t.j. po 2024; nowe progi, KIO ze zdalną rozprawą i prekluzją dowodową od 13.03.2026; certyfikacja od 12.07.2026 |
| CERT | Ustawa o certyfikacji wykonawców zamówień | Dz.U. 2025 poz. 1235 | AKTUALNY | 🔴 | Nowa regulacja; sprawdź wdrożenie |
| UFP | Ustawa o finansach publicznych | Dz.U. 2025 poz. 1483 + zmiany Dz.U. 2026 poz. 426, 635 | PO-TJ-ZMIANY | 🔴 | NIK, RIO, dyscyplina finansów |

---

## BLOK 12 — ZDROWIE, FARMACJA, ŻYWNOŚĆ

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| PFARM | Prawo farmaceutyczne | Dz.U. 2026 poz. 612 | AKTUALNY | 🔴 | Rejestracja leków, apteki, import równoległy |
| BEZPZYW | Ustawa o bezpieczeństwie żywności i żywienia | Dz.U. 2023 poz. 1448 + zmiana Dz.U. 2025 poz. 1424 | PO-TJ-ZMIANY | 🟠 | Sprawdź t.j. przed cytowaniem |

---

## BLOK 13 — CUDZOZIEMCY, MIGRACJE

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| CUDZ | Ustawa o cudzoziemcach | Dz.U. 2025 poz. 1079 + zmiana Dz.U. 2025 poz. 1794 | PO-TJ-ZMIANY | 🔴 | Pobyt, powrót, wydalenie; przepisy przejściowe |

---

## BLOK 14 — BEZPIECZEŃSTWO, SŁUŻBY

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| OLiOC | Ochrona ludności i obrona cywilna | Dz.U. 2024 poz. 1907 + zmiana Dz.U. 2026 poz. 646 | PO-TJ-ZMIANY | 🔴 | Nowy obszar; kontrola wejścia w życie przepisów przejściowych |
| OINF | Ustawa o ochronie informacji niejawnych | Dz.U. 2025 poz. 1209 | AKTUALNY | 🔴 | SKW/SWW/ŻW; kancelarie tajne; poświadczenia |

---

## BLOK 15 — ZAWODY PRAWNICZE I SĄDOWNICTWO

| Kod | Akt | Metryka Dz.U. | Status | Ryzyko | Uwagi |
|---|---|---|---|---|---|
| ADWOK | Prawo o adwokaturze | Dz.U. 2024 poz. 1564 + zmiany | PO-TJ-ZMIANY | 🟡 | ORA, postępowania dyscyplinarne; zmiana Dz.U. 2026 poz. 370 |
| RADCA | Ustawa o radcach prawnych | Dz.U. 2024 poz. 499 + zmiany | PO-TJ-ZMIANY | 🟡 | OIRP; j.w. |
| NOT | Prawo o notariacie | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟡 | Akty notarialne, odpowiedzialność |
| KOMORNIK | Ustawa o komornikach sądowych | t.j. ISAP — sprawdź aktualny Dz.U. | WYMAGA-KONTROLI | 🟡 | Egzekucja, koszty komornicze |

---

## INSTRUKCJA AKTUALIZACJI (dla administratora systemu)

### Kiedy aktualizować

Plik wymaga aktualizacji gdy:
- ukazał się nowy tekst jednolity któregokolwiek aktu z listy,
- weszła w życie nowelizacja zmieniająca artykuły używane przez skille,
- pojawił się akt prawny obejmujący nową dziedzinę obsługiwaną przez DR-skills,
- audyt-systemu-v3 zwrócił alert `METRYKA-NIEAKTUALNA`.

### Procedura aktualizacji

```
1. Wejdź na isap.sejm.gov.pl
2. Wyszukaj akt (po tytule lub Dz.U.)
3. Sprawdź: czy istnieje nowszy tekst jednolity niż w tym pliku?
4. Sprawdź: czy po tekście jednolitym są nowe zmiany (kolumna "Zmieniony przez")?
5. Zaktualizuj wiersz: nowa metryka Dz.U. + zmień status
6. Zaktualizuj pole "Data ostatniej aktualizacji" na górze pliku
7. Jeśli zmiana dotyczy artykułów krytycznych → zaznacz w kolumnie "Uwagi"
```

### Co NIE należy do tego pliku

- treść przepisów (to jest w modułach DR-skills),
- orzecznictwo (to jest w orzeczenia-sadowe-v2),
- metryki prawa miejscowego (BIP/DUW — zbyt zmienne),
- metryki prawa UE (EUR-Lex — odrębna warstwa).

---

## POWIĄZANIA Z SYSTEMEM

```
Wczytuje: audyt-systemu-v3 (KROK G-0: porównanie z ISAP)
Wczytuje: prawny-router-v3 (KROK 1B V2: przed każdym przepisem)
Wczytuje: pisma-procesowe-v3 (W3: weryfikacja metryk przed finalnym pismem)
Wczytuje: wszystkie DR-skills (zamiast lokalnych metryk Dz.U.)

Zastępuje (pliki do archiwizacji po wdrożeniu):
  shared/LEGAL-REGISTRY.md
  shared/ISAP-METRYKI-AKTOW.md
  shared/ONLINE-VERIFIED-LEGAL-UPDATES-2026-05-29.csv
  shared/ONLINE-VERIFIED-LEGAL-UPDATES-ROUND2-2026-05-29.csv
  shared/ONLINE-VERIFIED-LEGAL-UPDATES-ROUND3-2026-05-29.csv
  shared/ONLINE-VERIFIED-LEGAL-UPDATES-ROUND4-2026-05-29.csv
```
