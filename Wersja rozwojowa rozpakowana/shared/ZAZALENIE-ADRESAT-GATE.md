# ZAZALENIE-ADRESAT-GATE — Obowiązkowa weryfikacja adresata środka zaskarżenia

> **Geneza (2026-07-25):** audyt wykazał, że w całym systemie (69 plików
> wspominających "zażalenie") tylko garstka miała kiedykolwiek wskazany
> adresat — reszta wymieniała "zażalenie"/"odwołanie"/"skargę" WYŁĄCZNIE
> jako nazwę środka na liście, bez informacji DO KOGO. Zamiast ręcznie
> anotować dziesiątki plików (ryzyko: i tak nie objąć wszystkich, i tak
> popełnić błędy przy zgadywaniu specyfiki każdej z 16 dziedzin), ten plik
> jest **twardą bramką** ładowaną przy KAŻDYM sporządzaniu pisma zawierającego
> środek zaskarżenia — wymusza weryfikację adresata NA BIEŻĄCO, niezależnie
> od tego, czy konkretny moduł dziedzinowy go wymienia.

---

> 📌 **Mechanizm siostrzany (dodano 2026-07-27):** ten plik pokrywa
> adresata przy ZASKARŻANIU już wydanego rozstrzygnięcia. Dla
> właściwości sądu/organu przy WNOSZENIU sprawy OD PODSTAW (pozew,
> wniosek) — zob. `shared/WLASCIWOSC-GATE.md`.

## ZASADA

Nazwa środka zaskarżenia (zażalenie/odwołanie/skarga/sprzeciw/zarzuty)
**nigdy nie przesądza adresata**. Przed wydaniem JAKIEGOKOLWIEK pisma
zawierającego taki środek, ustal i wskaż w piśmie:

```
□ Do KOGO wnosi się środek (organ/sąd rozpoznający)
□ ZA POŚREDNICTWEM kogo się go wnosi (jeśli dotyczy — większość
  systemów administracyjnych i część KPC wymaga pośrednictwa organu
  I instancji, mimo że rozpoznaje go inny podmiot)
□ Czy to środek DEWOLUTYWNY (do organu/sądu WYŻSZEGO/ZEWNĘTRZNEGO)
  czy NIEDEWOLUTYWNY / "poziomy" (do innego składu/organu TEGO SAMEGO
  szczebla, albo do tego samego organu który wydał rozstrzygnięcie)
```

**NIE zakładaj domyślnie "instancji wyższej"** — to najczęstszy błąd
wykryty w audycie. Poniższa tabela to PUNKT STARTOWY (nie wyczerpujący
katalog) rozpoznanych dotąd wzorców — każdy WYMAGA potwierdzenia
aktualnym brzmieniem ustawy dla konkretnego postanowienia/decyzji,
którego dotyczy sprawa.

## ROZPOZNANE DOTĄD WZORCE (uzupełniaj w miarę audytu kolejnych dziedzin)

| Reżim | Środek | Wzorzec adresata | Źródło/zweryfikowano |
|---|---|---|---|
| KPC | Zażalenie na katalog zamknięty art. 394 §1 (m.in. zwrot pozwu, zawieszenie post., postanowienia kończące sprawę) | **Dewolutywne** — sąd II instancji | `shared/terminy.md`, 2026-07-25 |
| KPC | Zażalenie na odmowę zwolnienia od kosztów, odmowę pełnomocnika z urzędu, oddalenie wniosku o wyłączenie sędziego (strony) | **Poziome** — inny skład tego samego sądu (art. 394¹ᵃ §1 / 394² §1 KPC) | `shared/terminy.md`, `dr-01/mod-USP`, 2026-07-25 |
| KPC | Oddalenie żądania wyłączenia zgłoszonego przez SAMEGO sędziego | **Niezaskarżalne** — zażalenie nie przysługuje | uchwała SN III CZP 33/69 |
| KPC | Zażalenie na postanowienie SĄDU I INSTANCJI co do nadania klauzuli wykonalności (art. 795 §1) | ⛔ **PUŁAPKA REDAKCYJNA**: literalne brzmienie §2 mówi "sąd drugiej instancji", ALE **SN, uchwała 3 sędziów Izby Cywilnej z 20.08.2021, III CZP 58/20** rozstrzygnęła, że to zażalenie jest **POZIOME** — rozpoznaje je INNY SKŁAD TEGO SAMEGO sądu (sądu rejonowego), NIE sąd okręgowy jako II instancja. Uzasadnienie SN: postępowanie klauzulowe jako część postępowania egzekucyjnego zawiera lex specialis (art. 767⁴ §1¹ KPC) względem ogólnych reguł o zażaleniach, a "sąd drugiej instancji" w art. 795 §2 to POZOSTAŁOŚĆ nieprecyzyjnej nowelizacji z lipca 2019 r. Zażalenie wnosi się ZA POŚREDNICTWEM sądu, który wydał postanowienie (NIE bezpośrednio do adresata). Termin: TYDZIEŃ (7 dni), bieg liczony różnie dla wierzyciela/dłużnika (art. 795 §2 zd. 1-3). WYJĄTEK: gdy postanowienie o klauzuli wydał PIERWSZY RAZ sąd DRUGIEJ instancji (nie I) — zażalenie NIE PRZYSŁUGUJE w ogóle (SK 17/10, TK) | zweryfikowano online 2026-08-20 (F-13, dr-02 priorytet — prawo.pl cytujący SN III CZP 58/20, arslege.pl, lexlege.pl, nakaz-zaplaty.pl, sip.lex.pl — 5 źródeł zgodnych) |
| KPC | Skarga na czynności komornika (art. 767) | Wnosi się **do komornika**, który przekazuje do sądu rejonowego (siedziba kancelarii / zasady ogólne przy wyborze) | `pisma-proste-v2/SPL-skarga-komornik.md`, 2026-07-25 |
| KPK | Zażalenie na odmowę wszczęcia / umorzenie śledztwa lub dochodzenia (art. 306) | **Wyjątek dewolutywny** — sąd rejonowy właściwy miejscowo (art. 306 §2 KPK), NIE prokurator nadrzędny mimo ogólnej zasady z art. 465 §2-3 KPK dla innych postanowień prokuratora | zweryfikowano online 2026-07-25 (arslege.pl, legaartis.com) |
| KPA | Odwołanie / zażalenie na decyzję/postanowienie | **Dewolutywne, ale za pośrednictwem** — do organu wyższego stopnia, ZA POŚREDNICTWEM organu, który wydał rozstrzygnięcie (art. 129 §1 / 141 §1 KPA), chyba że autokontrola (art. 132 KPA) | `pisma-procesowe-v3/MOD-ADMIN.md`, 2026-07-25 |
| UPEA | Zażalenie na postanowienie w postępowaniu egzekucyjnym w administracji | **Dewolutywne, za pośrednictwem** — do organu odwoławczego, ZA POŚREDNICTWEM organu, który wydał postanowienie (art. 17 UPEA); WYJĄTKI: zażalenie na oszacowanie przez poborcę skarbowego rozpoznaje SAM organ egzekucyjny | zweryfikowano online 2026-07-25 (arslege.pl, gov.pl/web/kas) |
| UPEA | Zarzuty w egzekucji (art. 33) | Wnosi się do **wierzyciela za pośrednictwem organu egzekucyjnego** (nie do "sądu" ani wprost do organu odwoławczego) | zweryfikowano online 2026-07-25 |
| Prawo budowlane | Zażalenie na postanowienie organu nadzoru budowlanego (m.in. art. 71a — opłata legalizacyjna; szerzej: każde postanowienie PINB/WINB w toku nadzoru) | **Dewolutywne, za pośrednictwem** — do Wojewódzkiego Inspektora Nadzoru Budowlanego (WINB), jeżeli postanowienie wydał Powiatowy Inspektor Nadzoru Budowlanego (PINB, zwykły przypadek); do Głównego Inspektora Nadzoru Budowlanego (GINB), jeżeli wydał WINB. Za pośrednictwem organu, który wydał postanowienie, termin 7 dni. Wniesienie NIE wstrzymuje wykonania (art. 143 KPA) | zweryfikowano online 2026-08-21 (F-13 — biznes.gov.pl ×2, WINB Wrocław [bip-e.pl], legalnabudowa.pl, budowlaneabc.gov.pl [MRiT], prawo-budowlane.info — 6 źródeł zgodnych) |
| Prawo restrukturyzacyjne (art. 200) | Zażalenie na postanowienie SĘDZIEGO-KOMISARZA w postępowaniu restrukturyzacyjnym | **Dewolutywne** — sąd restrukturyzacyjny jako sąd DRUGIEJ INSTANCJI | zweryfikowano online 2026-08-21 (F-13 — lexlege.pl, arslege.pl) |
| Prawo restrukturyzacyjne (art. 200 ust. 1a) | Zażalenie na postanowienie SĄDU restrukturyzacyjnego (np. art. 188 — zatwierdzenie układu częściowego) | ⛔ **PUŁAPKA REDAKCYJNA identyczna z art. 795 KPC**: domyślnie **POZIOME** — rozpoznaje TEN SAM sąd restrukturyzacyjny w INNYM SKŁADZIE, NIE sąd wyższej instancji — WYJĄTEK (wtedy dewolutywne, sąd II instancji w składzie 3 sędziów zawodowych): enumeratywna lista postanowień wskazanych w art. 200 ust. 1a in fine (m.in. art. 30 ust. 5, art. 331 ust. 4, art. 332 ust. 3) — SPRAWDŹ czy konkretne postanowienie jest na tej liście, zanim założysz domyślną regułę | zweryfikowano online 2026-08-21 (F-13 — lexlege.pl, arslege.pl ×2) |
| Prawo upadłościowe (art. 222) | Zażalenie na postanowienie SĘDZIEGO-KOMISARZA w postępowaniu upadłościowym | **Dewolutywne** — sąd upadłościowy jako sąd DRUGIEJ INSTANCJI | zweryfikowano online 2026-08-21 (F-13 — lexlege.pl, arslege.pl, standardyprawa.pl) |
| Prawo upadłościowe (art. 222 ust. 1a) | Zażalenie na postanowienie SĄDU upadłościowego (np. art. 56d — zatwierdzenie sprzedaży przedsiębiorstwa upadłego) | ⛔ **BLIŹNIACZA PUŁAPKA** co przy restrukturyzacyjnym: domyślnie **POZIOME** — inny skład TEGO SAMEGO sądu upadłościowego, NIE sąd wyższej instancji — WYJĄTEK (dewolutywne): enumeratywna lista w art. 222 ust. 1a in fine (m.in. **art. 172** — odwołanie/upomnienie/grzywna na syndyka; art. 163 ust. 4; art. 166 ust. 6; art. 362 ust. 1; art. 368; art. 370a-f) — SPRAWDŹ listę przed założeniem domyślnej reguły | zweryfikowano online 2026-08-21 (F-13 — lexlege.pl, arslege.pl, standardyprawa.pl) |

## PROCEDURA PRZY KAŻDYM UŻYCIU

1. Zidentyfikuj DOKŁADNIE, jakiego postanowienia/decyzji dotyczy środek
   (nie tylko "zażalenie" ogólnie — art. 394 §1 KPC i art. 394¹ᵃ §1 KPC
   to RÓŻNE katalogi dla RÓŻNYCH postanowień).
2. Sprawdź, czy powyższa tabela już rozpoznała ten dokładny przypadek.
3. Jeśli NIE — `web_search` z konkretnym postanowieniem/decyzją +
   "zażalenie/odwołanie" + "adresat"/"do kogo"/"za pośrednictwem", zamiast
   zgadywać na podstawie ogólnego wzorca z innej dziedziny.
4. W piśmie zawsze wypisz jawnie: adresata w nagłówku ORAZ (jeśli
   dotyczy) instrukcję "za pośrednictwem [organ]".
5. Po weryfikacji, rozważ DOPISANIE nowego wiersza do tabeli powyżej —
   ten plik ma rosnąć wraz z kolejnymi rozpoznanymi dziedzinami zamiast
   pozostać przy stanie z dnia utworzenia.

## REJESTRACJA

Ten plik jest ładowany jako HARD GATE przez:
- `pisma-proste-v2/SKILL.md` (KROK 9d — PROCEDURAL CORE SHARED)
- `pisma-procesowe-v3/SKILL.md` (sekcja PROCEDURAL CORE SHARED)

zawsze, gdy pismo dotyczy zażalenia, odwołania, sprzeciwu, zarzutów lub
skargi — niezależnie od tego, czy moduł dziedzinowy (DR-xx) wymienia
adresata czy nie.
