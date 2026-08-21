# MODUŁ J10 — UMOWY UBEZPIECZENIA: OWU MAJĄTKOWE I ŻYCIOWE (poza B2C)
## Analizator Umów v1 · Moduł J10 (DOMAIN, lazy-loaded)

> Wczytaj dla: umów ubezpieczenia i OWU zawieranych przez PRZEDSIĘBIORCÓW lub w obrocie
> profesjonalnym — ubezpieczenia mienia firmy, OC działalności, OC zawodowa (obowiązkowa
> i dobrowolna), D&O (odpowiedzialność członków zarządu), cargo/transport, ubezpieczenia
> grupowe pracownicze, ubezpieczenia gwarancyjne, ubezpieczenia na życie (w tym z UFK / IBIP),
> ubezpieczenia majątkowe nieruchomości komercyjnych, ubezpieczenia należności (kredytu kupieckiego).
>
> ⛔ ZAKRES vs J8: jeśli ubezpieczającym jest KONSUMENT (osoba fizyczna, cel niezwiązany
> z działalnością) → wczytaj `mod-J8-b2c.md` (klauzule abuzywne, rejestr UOKiK).
> Przy ubezpieczeniu grupowym pracowniczym, gdzie ubezpieczonym jest konsument —
> wczytaj OBA moduły (relacja ubezpieczający-pracodawca = B2B; ochrona ubezpieczonego = B2C).

---

> ⛔ HARD GATE — przed podaniem JAKIEGOKOLWIEK artykułu, terminu, składki
> weryfikuj online. Zakaz cytowania z pamięci. Znacznik ✅ [VER: źródło, data] obowiązkowy.
>
> ```
> isap.sejm.gov.pl → KC → Tytuł XXVII „Umowa ubezpieczenia" → art. 805–834
>                    (uwaga na charakter semiimperatywny — art. 807 KC)
> isap.sejm.gov.pl → ustawa z 11.09.2015 o działalności ubezpieczeniowej i reasekuracyjnej
>                    (DUiR) → podział na DZIAŁ I (na życie) i DZIAŁ II (majątkowe/pozostałe),
>                    grupy ubezpieczeń (załącznik do ustawy)
> isap.sejm.gov.pl → ustawa z 15.12.2017 o dystrybucji ubezpieczeń (IDD; Dz.U. 2024 poz. 1214 t.j.)
>                    → art. 8 (analiza wymagań i potrzeb klienta — APK), obowiązki informacyjne, IPID
> Ubezpieczenia obowiązkowe (OC poj., OC rolników, OC zawodowe) → odrębne ustawy/rozporządzenia
> eur-lex.europa.eu → dyrektywa IDD 2016/97; rozporządzenie PRIIP 1286/2014 (KID dla IBIP)
> Stanowiska/decyzje: knf.gov.pl · Rzecznik Finansowy: rf.gov.pl · orzecznictwo: sn.pl
> ```

---

## J10.1 ZASADA NADRZĘDNA — semiimperatywność i prymat OWU nad ustawą

```
PRAWO (art. 807 §1 KC — weryfikuj): postanowienia OWU lub umowy SPRZECZNE z przepisami
  Tytułu XXVII KC są NIEWAŻNE, chyba że dalsze przepisy przewidują wyjątki.
  → Wiele przepisów KC o ubezpieczeniach jest semiimperatywnych: OWU mogą odbiegać
    TYLKO NA KORZYŚĆ uprawnionego (np. art. 817 §3 — korzystniejsze terminy wypłaty).

PRAWO (art. 812 §8 KC — weryfikuj brzmienie): jeżeli treść umowy/OWU różni się na
  NIEKORZYŚĆ ubezpieczającego od wcześniej przedstawionych warunków, ubezpieczyciel
  ma obowiązek zwrócić na to uwagę na piśmie przy zawarciu — inaczej zmiany nie wiążą.

⚠ SEKWENCJA ANALITYCZNA OWU:
  KROK 1: ustal dział i grupę (DUiR) → reżim szczególny?
  KROK 2: porównaj każde postanowienie OWU z art. 805–834 KC → czy nie pogarsza
          pozycji uprawnionego poniżej standardu KC? (jeśli tak → nieważne, art. 807)
  KROK 3: sprawdź WYŁĄCZENIA odpowiedzialności (to serce każdego OWU — patrz J10.3)
  KROK 4: sprawdź obowiązki ubezpieczającego i SANKCJE za ich naruszenie
  KROK 5: sprawdź sumę ubezpieczenia, niedoubezpieczenie, franszyzy, udział własny
```

---

## J10.2 PUŁAPKI — ubezpieczenia MAJĄTKOWE (mienie firmy, OC, cargo, D&O)

**UB-1 — Niedoubezpieczenie i zasada proporcji (CRITICAL — najczęstsza pułapka)**
```
PROBLEM: Suma ubezpieczenia < rzeczywista wartość mienia → przy szkodzie częściowej
  ubezpieczyciel wypłaca proporcjonalnie (reguła proporcji / underinsurance).
  Przykład: mienie warte 1 mln, suma 500 tys. → szkoda 200 tys. = wypłata ~100 tys.

WERYFIKUJ: czy OWU przewidują regułę proporcji, czy klauzulę „leeway"/odstąpienie od
  proporcji (np. do 120% sumy). Sprawdź czy wartość = odtworzeniowa czy rzeczywista (po amortyzacji).

REKOMENDACJA dla UBEZPIECZAJĄCEGO:
  → negocjuj klauzulę wyłączenia zasady proporcji (przy szkodach do określonego progu)
  → ustal sumę na wartość ODTWORZENIOWĄ (nową), nie rzeczywistą, jeśli to mienie produkcyjne
  → przy mieniu zmiennym (zapasy) — klauzula sumy zmiennej / automatycznego pokrycia
```

**UB-2 — Katalog wyłączeń pochłaniający ochronę (CRITICAL)**
```
PUŁAPKA: szeroka, ogólnikowa lista wyłączeń (np. „rażące niedbalstwo", „brak należytej
  staranności", „niezachowanie procedur") → ubezpieczyciel odmawia wypłaty w typowych sytuacjach.

PRAWO (art. 827 §1 KC — weryfikuj): ubezpieczyciel wolny od odpowiedzialności za szkodę
  wyrządzoną UMYŚLNIE; w razie RAŻĄCEGO NIEDBALSTWA — odszkodowanie nie należy się,
  CHYBA że umowa/OWU stanowią inaczej lub zapłata odpowiada zasadom słuszności.
  → W ubezpieczeniach majątkowych strony MOGĄ rozszerzyć ochronę na rażące niedbalstwo —
    sprawdź, czy OWU z tego korzystają na korzyść klienta, czy przeciwnie zawężają.

REKOMENDACJA:
  → żądaj rozszerzenia ochrony na rażące niedbalstwo (klauzula representations)
  → każde wyłączenie nieostre („m.in.", „w szczególności") → żądaj zamknięcia katalogu
  → sprawdź wyłączenia „ukryte" w definicjach (np. wąska definicja „pożaru", „kradzieży z włamaniem")
```

**UB-3 — Obowiązki ubezpieczającego i sankcja utraty świadczenia (HIGH RISK)**
```
PRAWO (art. 815 KC — weryfikuj): ubezpieczający ma obowiązek podać znane okoliczności,
  o które ubezpieczyciel pytał. Podanie nieprawdy → ubezpieczyciel nie odpowiada za skutki.
PRAWO (art. 818 KC): OWU mogą nakładać obowiązek zawiadomienia o wypadku w terminie;
  naruszenie → możliwość odpowiedniego zmniejszenia świadczenia (jeśli wpłynęło na szkodę).
PRAWO (art. 826 KC): obowiązek ratowania przedmiotu / minimalizacji szkody.

PUŁAPKA: OWU przewidują utratę CAŁOŚCI świadczenia za drobne uchybienie proceduralne
  (np. spóźnione zgłoszenie o 1 dzień) bez związku z rozmiarem szkody.
  → Często sprzeczne z KC (art. 818 §3 — zmniejszenie tylko w zakresie wpływu na szkodę).

REKOMENDACJA:
  → sankcje proporcjonalne i tylko gdy naruszenie wpłynęło na ustalenie/rozmiar szkody
  → realistyczne terminy zgłoszenia (nie 24h przy działalności wielooddziałowej)
```

**UB-4 — Termin wypłaty i zaliczki (MEDIUM)**
```
PRAWO (art. 817 KC — weryfikuj): świadczenie w terminie 30 DNI od zawiadomienia o wypadku;
  gdy wyjaśnienie okoliczności niemożliwe w tym terminie — w ciągu 14 dni od ich wyjaśnienia,
  ale BEZSPORNĄ część należy wypłacić w 30 dni. OWU mogą przewidzieć terminy KORZYSTNIEJSZE.

PUŁAPKA: OWU wydłużające termin ponad KC → nieważne (art. 807 — pogorszenie pozycji).
REKOMENDACJA: klauzula zaliczki na poczet bezspornej części + odsetki za opóźnienie.
```

**UB-5 — D&O i OC zawodowa: zakres czasowy i triggery (HIGH RISK)**
```
PUŁAPKA „claims-made" vs „act-committed": polisa claims-made pokrywa roszczenia
  ZGŁOSZONE w okresie ubezpieczenia → po wygaśnięciu polisy brak ochrony za dawne zdarzenia,
  jeśli nie wykupiono okresu dodatkowego zgłaszania (run-off / extended reporting).

WERYFIKUJ: data retroaktywna (retroactive date), okres dodatkowego zgłaszania,
  wyłączenia (działanie umyślne, grzywny/kary administracyjne — często niepokrywalne),
  sublimity na koszty obrony.

REKOMENDACJA: negocjuj run-off min. [X] lat przy zmianie ubezpieczyciela / odejściu z zarządu;
  potwierdź ciągłość daty retroaktywnej przy odnowieniu.
```

---

## J10.3 PUŁAPKI — ubezpieczenia OSOBOWE i NA ŻYCIE (w tym UFK / IBIP)

**UB-6 — Ubezpieczenia z UFK / IBIP: ryzyko inwestycyjne i opłaty (CRITICAL)**
```
KONTEKST: ubezpieczenie na życie z ubezpieczeniowym funduszem kapitałowym (UFK) /
  ubezpieczeniowy produkt inwestycyjny (IBIP) → ryzyko inwestycyjne po stronie klienta.

WERYFIKUJ:
  → opłaty: za zarządzanie, administracyjna, dystrybucyjna, za wykup/likwidacyjna
    (historyczne „opłaty likwidacyjne" pochłaniające wpłaty były masowo kwestionowane —
    sprawdź decyzje UOKiK na uokik.gov.pl i orzecznictwo SN/SOKiK)
  → obowiązek udostępnienia KID (rozporządzenie PRIIP 1286/2014 — weryfikuj w eur-lex)
  → APK: czy produkt był zgodny z wymaganiami i potrzebami klienta (art. 8 ustawy o dystrybucji)

⚠ Gdy klientem jest konsument → wczytaj RÓWNIEŻ mod-J8-b2c.md (klauzule abuzywne).
```

**UB-7 — Karencja, wyłączenia zdrowotne, deklaracja stanu zdrowia (HIGH RISK)**
```
PUŁAPKA: okresy karencji (brak ochrony przez pierwsze miesiące), wyłączenie chorób
  „istniejących przed zawarciem", sankcja za niepełną deklarację zdrowotną.

PRAWO (art. 815 + art. 834 KC — weryfikuj): w ubezpieczeniu na życie po upływie
  określonego czasu (np. 3 lat) ubezpieczyciel co do zasady nie może podnosić zarzutu
  zatajenia — sprawdź aktualne brzmienie i wyjątki.

REKOMENDACJA: precyzyjne pytania ankiety medycznej; unikać klauzul „dowolnej" odmowy.
```

**UB-8 — Wypowiedzenie i odstąpienie (MEDIUM)**
```
PRAWO (art. 812 §4 KC — weryfikuj): przy umowie na okres > 6 miesięcy ubezpieczający
  ma prawo odstąpienia w terminie 30 dni, a gdy jest przedsiębiorcą — 7 dni od zawarcia.
PRAWO (art. 830 KC): ubezpieczający może wypowiedzieć ubezpieczenie na życie w każdym czasie;
  ubezpieczyciel — tylko w przypadkach wskazanych w ustawie (art. 830 §3 — weryfikuj).
```

---

## J10.4 WARSTWA DYSTRYBUCYJNA (IDD) — gdy analizujesz proces sprzedaży / mis-selling

```
Gdy spór dotyczy nie treści polisy, lecz SPOSOBU jej zaproponowania:

□ APK — analiza wymagań i potrzeb (art. 8 ust. 1 ustawy o dystrybucji — weryfikuj):
  dystrybutor miał obowiązek ustalić wymagania/potrzeby klienta i zaproponować
  umowę z nimi zgodną (art. 8 ust. 3). Brak APK / niezgodność = podstawa odpowiedzialności.
□ IPID — ustandaryzowany dokument o produkcie (dla działu II) — czy doręczony przed zawarciem?
□ Obowiązki informacyjne dystrybutora, konflikt interesów (zwł. produkty inwestycyjne).
□ Rola pośrednika: agent (działa za zakład) vs broker (działa za klienta) — różna odpowiedzialność.

→ Roszczenia z mis-sellingu: Rzecznik Finansowy (rf.gov.pl), sąd powszechny.
```

---

## J10.5 CHECKLISTA GOTOWOŚCI ANALIZY OWU / POLISY

```
□ Dział i grupa ubezpieczenia ustalone? (DUiR — reżim szczególny?)
□ Ubezpieczający: przedsiębiorca czy konsument? (B2C → także J8)
□ Każde postanowienie OWU vs art. 805–834 KC — brak pogorszenia poniżej KC? (art. 807)
□ Suma ubezpieczenia: wartość odtworzeniowa/rzeczywista; reguła proporcji?
□ Katalog WYŁĄCZEŃ — zamknięty, ostry, bez "ukrytych" definicji?
□ Rażące niedbalstwo — objęte czy wyłączone? (art. 827)
□ Obowiązki ubezpieczającego + proporcjonalność sankcji? (art. 815, 818, 826)
□ Termin wypłaty nie gorszy niż 30 dni / bezsporna część? (art. 817)
□ Franszyza integralna/redukcyjna, udział własny — wysokość i mechanizm?
□ D&O/OC: trigger (claims-made/act-committed), data retroaktywna, run-off?
□ UFK/IBIP: opłaty, KID/PRIIP, wartość wykupu, ryzyko inwestycyjne klienta?
□ Proces sprzedaży: APK wykonana, IPID/KID doręczone? (IDD)
□ Prawo odstąpienia/wypowiedzenia (art. 812 §4, art. 830)?
```

---

## POWIĄZANIA MIĘDZYMODUŁOWE

| Sytuacja | Wczytaj dodatkowo |
|---|---|
| Ubezpieczający/ubezpieczony = konsument | `mod-J8-b2c.md` (klauzule abuzywne, rejestr UOKiK) |
| Kwantyfikacja ryzyka w PLN (suma, franszyza, ekspozycja) | `mod-shared-ryzyko-kwant.md` |
| Ubezpieczenie jako zabezpieczenie umowy B2B (wymóg polisy) | `b2b-podwykonawcze.md` |
| Ubezpieczenie w umowie najmu/budowlanej/transportowej | `mod-J1-najem.md` / `mod-J7-pzp.md` / `mod-J3-dystrybucja.md` |
| Dane osobowe w procesie ubezpieczeniowym (zdrowie = szczególne) | `mod-shared-rodo.md` |
| Negocjacja OWU / klauzul brokerskich | `mod-shared-neg-strategia.md` + `mod-shared-alt-drafts.md` |
| Klauzula OWU niejasna / wieloznaczna | `mod-shared-wykladnia.md` |

---

*Moduł J10 / analizator-umow-v1 · Ubezpieczenia majątkowe i życiowe poza B2C*
*HARD GATE: KC art. 805–834 + ustawa o dystrybucji (2017) + DUiR (2015) — weryfikuj w ISAP*
*← Powrót do routingu: `view references/mod-J0-routing.md`*
