# mod-UPEA-egzekucja-administracyjna

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** UPEA — Dz.U. 2026 poz. 268 t.j. | KPA — Dz.U. 2025 poz. 1691 | PPSA — Dz.U. 2026 poz. 143
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## ⚠️ ZASADA KRYTYCZNA — EGZEKUCJA ADMINISTRACYJNA ≠ EGZEKUCJA KOMORNICZA

```
Egzekucja administracyjna (UPEA) — obowiązki z aktów administracyjnych
  → Wierzycielem jest organ (US, ZUS, organ samorządowy, inne)
  → Organem egzekucyjnym jest naczelnik US, dyrektor oddziału ZUS, starosta lub inny
  → Środki egzekucyjne: zajęcie wynagrodzenia, rachunku, wierzytelności, ruchomości
  → Kontrola: zarzuty (do wierzyciela, ZA POŚREDNICTWEM organu
    egzekucyjnego, art. 33 §1 UPEA) → zażalenie na postanowienie w sprawie
    zarzutów (do organu odwoławczego WŁAŚCIWEGO DLA WIERZYCIELA, ZA
    POŚREDNICTWEM organu, który wydał postanowienie, art. 17 i art. 34 §3
    UPEA — WYJĄTEK: zażalenie na oszacowanie przez poborcę skarbowego
    rozpoznaje SAM organ egzekucyjny) → skarga do WSA. Zweryfikowano
    online 2026-07-25 — patrz `shared/ZAZALENIE-ADRESAT-GATE.md`.

Egzekucja komornicza (KPC) — obowiązki z wyroków i nakazów sądowych
  → DR-02 → mod-KPC-egzekucja-windykacja
```

---

## 1. CORE

### Zakres modułu
Tytuł wykonawczy administracyjny, upomnienie, zarzuty w postępowaniu egzekucyjnym, skarga na czynności egzekucyjne, zajęcie wynagrodzenia / rachunku bankowego / wierzytelności / ruchomości / nieruchomości, koszty egzekucyjne, zawieszenie i umorzenie egzekucji, egzekucja obowiązków niepieniężnych.

### Akty i źródła kontrolne

| Akt | Dz.U. |
|---|---|
| Ustawa o postępowaniu egzekucyjnym w administracji (UPEA) | Dz.U. 2026 poz. 268 t.j. |
| KPA | Dz.U. 2025 poz. 1691 t.j. |
| PPSA | Dz.U. 2026 poz. 143 t.j. |

> ⚠️ **NOWELIZACJA PO TEKŚCIE JEDNOLITYM — ustawa z 15.05.2026, Dz.U. 2026 poz. 739**
> (ustalona 2026-08-15 przy zamykaniu flagi audytowej F-16; wcześniej znany był
> wyłącznie numer druku sejmowego 2319). Zakres:
> 1. **art. 67da — „Portal eLicytacje KAS"**: system teleinformatyczny prowadzony przez
>    Szefa KAS; naczelnik urzędu skarbowego prowadzi w nim licytacje elektroniczne oraz
>    sprzedaż z wolnej ręki ruchomości i nieruchomości, a także publikuje obwieszczenia
>    i protokoły opisu i oszacowania nieruchomości.
> 2. **art. 3a § 1** — rozszerzenie katalogu o środki z doładowań (art. 331 ust. 9 Prawa
>    komunikacji elektronicznej).
> 3. Wejście w życie: po upływie 14 dni od dnia ogłoszenia.
>
> ⛔ Wiersz „Zajęcie nieruchomości → licytacja" w sekcji środków egzekucyjnych opisuje
> stan SPRZED tej zmiany. **Przed powołaniem trybu licytacji w piśmie** — sprawdzić
> brzmienie art. 67da i przepisów o sprzedaży (art. 105–111f UPEA) w ISAP.
> Weryfikacja: dziennikustaw.gov.pl (Rząd 1, snippet — bezpośredni `web_fetch`
> ROBOTS_DISALLOWED) + prosteustawy.pl/akt/WDU20260000739 (Rząd 2B).

---

## 2. INTAKE

```
□ Rodzaj obowiązku: pieniężny (podatek, ZUS, grzywna) czy niepieniężny?
□ Kto jest wierzycielem (organ egzekucyjny)?
□ Czy istnieje tytuł wykonawczy (TW-1 lub inny)?
□ Czy doręczono upomnienie (przy obowiązkach pieniężnych)?
□ Jaki środek egzekucyjny zastosowano?
□ Czy jest podstawa do zarzutów (art. 33 UPEA)?
□ Terminy: kiedy doręczono zajęcie / upomnienie / tytuł wykonawczy?
□ Czy istnieje podstawa do zawieszenia lub umorzenia?
```

---

## 3. PROCEDURA

### Schemat egzekucji administracyjnej

```
Powstanie obowiązku (decyzja, przepis ustawy, deklaracja podatkowa)
  ↓
Wierzytelność wymagalna → wymagane UPOMNIENIE (obowiązki pieniężne)
  → Egzekucja może być wszczęta dopiero po upływie 7 dni od doręczenia upomnienia (art. 15 § 1 zd. 2 UPEA);
    koszty upomnienia obciążają zobowiązanego i powstają z chwilą doręczenia (art. 15 § 2)
  ↓ [brak zapłaty]
Wystawienie TYTUŁU WYKONAWCZEGO (TW-1 lub inny wzór)
  ↓
Wszczęcie egzekucji — zawiadomienie o zajęciu
  ↓
ZARZUT zobowiązanego (art. 33 UPEA) — do wierzyciela za pośrednictwem organu egz.;
  terminy KOŃCOWE z art. 33 § 5 (NIE „7 dni od TW") — patrz tabela niżej
SKARGA NA CZYNNOŚĆ EGZEKUCYJNĄ (art. 54 UPEA) — 7 dni od doręczenia odpisu dokumentu
  stanowiącego podstawę czynności, do organu egzekucyjnego
  ↓ [rozpatrzenie przez wierzyciela i organ egzekucyjny]
ZAŻALENIE na postanowienie o zarzutach — 7 dni
  ↓
SKARGA DO WSA na postanowienie ostateczne
```

### Terminy — ABSOLUTNY PRIORYTET

```
⛔ NAPRAWIONE 2026-09-12h / odtworzone 2026-09-16 (F-189). ✅ [VER] RZĄD 1 2026-09-16
— UPEA `Dz.U. 2026 poz. 268`; nowelizacje po t.j. poz. 516 i 739 zmieniają art. 3a
(i przepisy o sprzedaży), NIE art. 15, 33, 54, 80.
Zarzut w sprawie egzekucji (art. 33 § 5 UPEA) — wnosi się NIE PÓŹNIEJ NIŻ:
  1) 30 dni od wyegzekwowania w całości obowiązku, kosztów upomnienia
     i kosztów egzekucyjnych;
  2) do dnia wykonania w całości obowiązku niepieniężnego albo zapłaty
     w całości należności z odsetkami, kosztami upomnienia i egzekucyjnymi;
  3) 7 dni od doręczenia postanowienia o UMORZENIU postępowania.
  ⛔ Termin „7 dni od doręczenia TW" NIE ISTNIEJE. Dopóki egzekucja trwa
  i obowiązek nie został wykonany — zarzut jest dopuszczalny.
  ⛔ Dawna adnotacja „POTWIERDZONE, Rząd 2B" przy regule „7 dni od TW"
  była błędna: dla terminów zawitych weryfikację domyka wyłącznie RZĄD 1.
Zażalenie na postanowienie:               7 dni od doręczenia postanowienia (adresat: patrz sekcja wyżej i `shared/ZAZALENIE-ADRESAT-GATE.md` — NIE zakładaj domyślnie sądu)
Skarga na czynność egzekucyjną:           7 dni od doręczenia zobowiązanemu odpisu dokumentu
                                          stanowiącego podstawę czynności; do organu egzekucyjnego,
                                          który jej dokonał (art. 54 § 3 UPEA)
Skarga do WSA na postanowienie ostateczne: 30 dni od doręczenia
⚠️ Terminy ZAWITE — weryfikuj aktualne brzmienie UPEA w ISAP.
```

### Podstawy zarzutu (art. 33 § 2 UPEA — katalog ZAMKNIĘTY, ✅ [VER] RZĄD 1 2026-09-16)

```
Zarzut może opierać się wyłącznie na:
  □ 1) nieistnieniu obowiązku
  □ 2) określeniu obowiązku niezgodnie z treścią obowiązku wynikającego
       z orzeczenia (art. 3–4), dokumentu (art. 3a § 1) lub przepisu prawa
  □ 3) błędzie co do zobowiązanego
  □ 4) braku uprzedniego doręczenia upomnienia, jeżeli jest wymagane
  □ 5) wygaśnięciu obowiązku w całości albo w części
  □ 6) braku wymagalności (odroczenie terminu, raty, inna przyczyna)

⛔ „Zbyt uciążliwy środek egzekucyjny" NIE jest podstawą zarzutu — to podstawa
SKARGI NA CZYNNOŚĆ EGZEKUCYJNĄ (art. 54 § 1 pkt 2), obok czynności dokonanej
z naruszeniem ustawy (pkt 1). Ten sam argument jako zarzut zostanie oddalony.
(Dawna lista: „zbyt uciążliwy środek", „niewłaściwy organ", „wymogi formalne TW"
— stan sprzed nowelizacji, nieaktualny.)

UWAGA: Zarzuty NIE służą do ponownego badania zasadności decyzji źródłowej
  → Kwestionowanie decyzji: tryb odwoławczy KPA / skarga do WSA, nie zarzuty w egzekucji
```

---

## 4. ŚRODKI EGZEKUCYJNE — KWALIFIKATOR

### Obowiązki pieniężne

| Środek | Organ egzekucyjny | Uwagi |
|---|---|---|
| Zajęcie wynagrodzenia za pracę | Naczelnik US | Kwoty wolne: weryfikuj UPEA w ISAP |
| Zajęcie rachunku bankowego (art. 80 § 1–2 UPEA) | Naczelnik US | Kwota wolna — NIE w UPEA: art. 54 ust. 1 Prawa bankowego (`Dz.U. 2026 poz. 38`) — 75 % minimalnego wynagrodzenia miesięcznie (formuła, kwota zmienia się co roku — `shared/oplaty/04-wartosci-powtarzalne-kotwice.md` 4f) |
| Zajęcie wierzytelności pieniężnej | Naczelnik US | |
| Zajęcie ruchomości | Naczelnik US | Spis i oszacowanie |
| Zajęcie nieruchomości | Naczelnik US | Wpis do KW, licytacja |
| Przymusowe ściągnięcie | Naczelnik US | |

### Obowiązki niepieniężne

```
Grzywna w celu przymuszenia:
  → Nakładana wielokrotnie do wykonania obowiązku
  → Max łączna kwota: weryfikuj art. 121 UPEA w ISAP
  
Wykonanie zastępcze:
  → Organ wykonuje obowiązek na koszt zobowiązanego

Odebranie rzeczy ruchomych / nieruchomości:
  → Przy obowiązku wydania

Przymus bezpośredni:
  → Ostateczność — przy obowiązkach o charakterze osobistym
```

---

## 5. ZAWIESZENIE I UMORZENIE EGZEKUCJI

```
ZAWIESZENIE (art. 56 UPEA — weryfikuj w ISAP):
  → Na wniosek wierzyciela
  → Śmierć zobowiązanego (postępowanie spadkowe)
  → Wniesienie przez zobowiązanego środka zaskarżenia na decyzję źródłową
    (tylko gdy środek ma skutek zawieszający)

UMORZENIE (art. 59 UPEA — weryfikuj w ISAP):
  □ Obowiązek wygasł (spłata, przedawnienie, uchylenie decyzji)
  □ Zobowiązany nie posiada majątku i brak perspektyw uzyskania
  □ Egzekucja jest niedopuszczalna
  □ Wierzyciel wnosi o umorzenie
```

---

## 6. KOSZTY EGZEKUCYJNE

> ⚠️ Stawki opłat egzekucyjnych — weryfikuj aktualne przepisy UPEA i rozporządzeń w ISAP.

```
Koszty egzekucyjne obciążają zobowiązanego:
  → Opłata egzekucyjna (% wyegzekwowanej kwoty — weryfikuj w UPEA)
  → Koszty upomnienia
  → Koszty czynności egzekucyjnych

Zarzut kosztów:
  → Weryfikuj tryb w UPEA (odczyt treści) — zarzut z art. 33 § 2 ma katalog zamknięty
```

---

## 7. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Brak doręczenia upomnienia | Brak potwierdzenia odbioru | wnioskodawca | wysoka | spór o doręczenie | awizo / usługa pocztowa |
| Wygaśnięcie obowiązku | Dowód zapłaty, decyzja uchylająca | bank / organ | wysoka | — | wyciąg bankowy + pokwitowanie |
| Błąd co do osoby | PESEL, dane z TW vs rzeczywiste | dokumenty tożsamości | wysoka | — | porównanie danych |
| Zbyt uciążliwy środek (SKARGA z art. 54 § 1 pkt 2, nie zarzut) | Proporcja środka do kwoty / sytuacja majątkowa | dokumenty finansowe | średnia | — | dowód innych aktywów |
| Niedopuszczalność egzekucji | Brak podstawy prawnej TW / przedawnienie | akta organu | wysoka | — | oblicz termin przedawnienia |

---

## 8. STRATEGIA

### Perspektywa zobowiązanego

1. Sprawdź czy doręczono upomnienie i tytuł wykonawczy prawidłowo.
2. Zarzut — wyłącznie z podstaw art. 33 § 2 UPEA, w terminach końcowych z art. 33 § 5;
   uciążliwość środka lub wadliwa czynność — skarga z art. 54 w 7 dni (art. 54 § 3).
3. Przy kwestionowaniu decyzji źródłowej — tryb odwoławczy KPA, nie zarzuty.
4. Przy zawieszeniu: wniesienie środka zaskarżenia na decyzję źródłową może zawiesić egzekucję.
5. Przy nieregularnych dochodach — wnioskuj o rozłożenie na raty (tryb KPA).

### Perspektywa wierzyciela / organu

1. Upomnienie musi być doręczone przed wszczęciem egzekucji — brak = wada formalna.
2. TW musi zawierać wszystkie wymagane elementy — błąd = skuteczne zarzuty.
3. Zasada stosowania najmniej uciążliwego środka (proporcjonalność).

### Ryzyka

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Przeoczenie 7 dni na skargę na czynność (art. 54 § 3) albo terminu końcowego zarzutu (art. 33 § 5) | Utrata środka | Ustal datę doręczenia odpisu dokumentu / stan wykonania obowiązku |
| Zarzuty w złym trybie | WSA odrzuci skargę | Ustal właściwy środek (zarzuty vs KPA) |
| Egzekucja mimo uchylenia decyzji | Kontynuacja mimo wygaśnięcia obowiązku | Wniosek o umorzenie z dowodem uchylenia |

---

## 9. ORZECZNICTWO

```
web_search: "egzekucja administracyjna zarzuty art 33 UPEA NSA orzecznictwo 2025 2026"
web_search: "tytuł wykonawczy brak doręczenia upomnienia egzekucja wadliwość NSA"
web_search: "UPEA Dz.U. 2026 poz. 268 isap.sejm.gov.pl tekst jednolity"
```

---

## 10. QUALITY GATE

- [ ] Rodzaj obowiązku (pieniężny / niepieniężny) ustalony?
- [ ] Upomnienie i tytuł wykonawczy doręczone prawidłowo?
- [ ] Termin końcowy zarzutu (art. 33 § 5) nie upłynął? Skarga na czynność — 7 dni z art. 54 § 3?
- [ ] Właściwy organ egzekucyjny wskazany?
- [ ] Aktualny t.j. UPEA (Dz.U. 2026 poz. 268) zweryfikowany?
- [ ] Tryb (zarzuty vs KPA vs WSA) prawidłowo dobrany?

---

## 11. OUTPUT

1. Stan faktyczny; 2. Kwalifikacja (pieniężny/niepieniężny, organ egzekucyjny); 3. Stan prawny; 4. Terminy (zarzut — art. 33 § 5; skarga na czynność — 7 dni, art. 54 § 3); 5. Podstawy zarzutów; 6. Matryca dowodowa; 7. Strategia; 8. Ryzyka; 9. Rekomendacja; 10. Kontrola ISAP/temporalności.

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| Egzekucja komornicza (KPC) | `dr-02` → `mod-KPC-egzekucja-windykacja` |
| Postępowanie administracyjne (KPA) | `dr-05` → `mod-KPA-postepowanie-administracyjne` |
| Podatki (zaległości US) | `dr-06` |
| ZUS (zaległości składek) | `dr-04` → `mod-SUS-ZUS-ubezpieczenia-spoleczne` |
| Pismo: zarzuty / skarga do WSA | `pisma-procesowe-v3` |

---

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000268
