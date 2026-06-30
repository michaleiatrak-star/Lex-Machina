# mod-SUS-ZUS-ubezpieczenia-spoleczne

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** SUS — Dz.U. 2026 poz. 199 t.j. | FUS — Dz.U. 2025 poz. 1749 t.j. | Ustawa orzecznicza — Dz.U. 2026 poz. 26 | KPC art. 477⁸–477¹⁴ — Dz.U. 2026 poz. 468
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## ⚡ ALERTY LEGISLACYJNE — CZYTAJ PRZED ANALIZĄ

| Zmiana | Status | Podstawa |
|---|---|---|
| **Reforma orzecznictwa ZUS — Etap I** | **OBOWIĄZUJE od 27.01.2026** — nowe def. pracy zarobkowej, rozszerzone uprawnienia kontrolerów L4 | Dz.U. 2026 poz. 26 |
| **Reforma orzecznictwa ZUS — Etap II** | **OBOWIĄZUJE od 13.04.2026** — pielęgniarki/fizjoterapeuci wydają orzeczenia, badania zdalne, max 30 dni na orzeczenie | Dz.U. 2026 poz. 26 |
| **Reforma orzecznictwa ZUS — Etap III** | **PLANOWANY od 01.01.2027** — jednoosobowe orzekanie I i II inst., komisje lekarskie zastąpione — WERYFIKUJ STATUS | Dz.U. 2026 poz. 26 |
| **Emerytury czerwcowe 2009–2019** | **PRZELICZONE Z URZĘDU** przez ZUS, zakończone marzec 2026; średnia podwyżka ~163 zł/mies., wyrównanie od 01.01.2026 | Dz.U. 2025 poz. 1169 |
| **Wyrok TK SK 140/20 z 4.06.2024** | ZUS odmawia przeliczenia (wyrok niepublikowany w Dz.U.) → sądy masowo nakazują przeliczenie | — |

---

## 1. CORE

### Zakres modułu
Ubezpieczenia społeczne (emerytalne, rentowe, chorobowe, wypadkowe), odwołanie od decyzji ZUS do sądu pracy (nie WSA!), sprzeciw od orzeczenia lekarskiego, kapitał początkowy, emerytura i jej obliczenie, renty (z tytułu niezdolności do pracy, rodzinna, szkoleniowa), zasiłki (chorobowy, macierzyński, opiekuńczy, rehabilitacyjny).

### Akty i źródła kontrolne

| Akt | Dz.U. |
|---|---|
| Ustawa SUS (system ubezpieczeń społecznych) | Dz.U. 2026 poz. 199 t.j. |
| Ustawa FUS (świadczenia z Funduszu Ubezpieczeń Społecznych) | Dz.U. 2025 poz. 1749 t.j. |
| Ustawa zasiłkowa (świadczenia pieniężne w razie choroby i macierzyństwa) | weryfikuj aktualny t.j. w ISAP |
| Ustawa orzecznicza (reforma orzecznictwa ZUS) | Dz.U. 2026 poz. 26 |
| KPC (postępowanie w sprawach ZUS) | Dz.U. 2026 poz. 468 — art. 477⁸–477¹⁴ |

---

## 2. INTAKE

```
□ Jaki rodzaj sprawy: emerytura / renta / zasiłek / składki / kapitał początkowy?
□ Jaki etap: orzeczenie lekarskie / decyzja ZUS / postępowanie sądowe?
□ Data doręczenia orzeczenia lekarskiego → OBLICZ TERMIN 14 DNI (sprzeciw)
□ Data doręczenia decyzji ZUS → OBLICZ TERMIN 1 MIESIĄCA (odwołanie do sądu)
□ Czy złożono sprzeciw od orzeczenia lekarskiego? → OBOWIĄZKOWE przed sądem!
□ Czy brak pouczenia w decyzji? → termin na odwołanie nie biegnie
□ Reforma orzecznicza 2026 — czy orzeczenie wystawiono po 13.04.2026?
```

---

## 3. PROCEDURA

### ZASADA ABSOLUTNA — NIE MA WSA W SPRAWACH ZUS

```
⚠️ Decyzje ZUS/KRUS → Sąd Okręgowy (wydział pracy i ubezpieczeń społecznych)
                    lub Sąd Rejonowy (zasiłki, składki < 100 000 zł)
Tryb: KPC art. 477⁸–477¹⁴ — NIE tryb PPSA — NIE WSA!
```

### Schemat postępowania ZUS

```
Orzeczenie lekarza orzecznika ZUS / pielęgniarki* / fizjoterapeuty*
  ↓ [14 dni] SPRZECIW DO ZUS (tego samego oddziału) — OBOWIĄZKOWY!
    * od 13.04.2026 — weryfikuj uprawnienia w aktualnej ustawie
Ponowne rozpatrzenie przez innego lekarza orzecznika
  (lub 3 lekarzy przy sprawach szczeg. skomplikowanych — od 13.04.2026)
  ↓
Decyzja ZUS
  ↓ [1 miesiąc] ODWOŁANIE DO SĄDU (art. 477⁹ §1 KPC)
    Składane ZA POŚREDNICTWEM ZUS (autokontrola 30 dni — ZUS może sam zmienić decyzję)
Emerytura / Renta z FUS → Sąd OKRĘGOWY
Zasiłki / Świadczenie rehab. → Sąd REJONOWY
Składki < 100 000 zł → Sąd REJONOWY
Składki ≥ 100 000 zł → Sąd OKRĘGOWY
  ↓ [14 dni od wyroku z uzasad.] APELACJA → Sąd Apelacyjny (wpis: 30 zł)
  ↓ [30 dni od wyroku SA] SKARGA KASACYJNA → SN (przymus adwokacki)
```

> ⚠️ **POMINIĘCIE SPRZECIWU = sąd ODRZUCI odwołanie (art. 477¹⁴a KPC)**
> Pułapka: Orzeczenie pozornie korzystne (np. błędna data niezdolności) → złóż sprzeciw kwestionując datę!

---

## 4. EMERYTURA — OBLICZENIE I TYPOWE PROBLEMY

### Wzór obliczenia (nowy system — urodzeni od 1949 r.)

```
Emerytura = Podstawa obliczenia ÷ Średnie dalsze trwanie życia (tablice GUS)

Podstawa obliczenia:
  + Zwaloryzowane składki na koncie ZUS (od 1999 r.)
  + Zwaloryzowany kapitał początkowy (za okresy przed 1999 r.)
  + Środki z OFE (po przekształceniu)
```

### Typowe przyczyny zaniżonej emerytury

```
□ Błędny kapitał początkowy — brak zaświadczeń Rp-7, pominięte okresy
□ Pominięte okresy składkowe / nieskładkowe (urlopy wychowawcze, wojsko, urlop macierzyński)
□ Praca w szczególnych warunkach / o szczególnym charakterze — nieuwzględniona
□ Niekorzystna tablica GUS — moment złożenia wniosku ma znaczenie
□ Błąd czerwcowy 2009–2019 (emerytury czerwcowe — przeliczone z urzędu do marca 2026)
□ Wyrok TK SK 140/20 z 4.06.2024 — dotyczy konkretnej grupy (patrz niżej)
```

### Wyrok TK SK 140/20 — przeliczenie emerytur

```
Orzeczono: art. 25 ust. 1b ustawy FUS niezgodny z Konstytucją
Kogo dotyczy:
  → Kobiety ur. 1949–1959 (z wyjątkiem rocznika 1953*)
  → Mężczyźni ur. 1949–1954 (z wyjątkiem rocznika 1953*)
  → Warunek: wniosek o wcześniejszą emeryturę PRZED 6.06.2012 r.
             + przejście na emeryturę powszechną po 01.01.2013

* Rocznik 1953 = odrębna ustawa z 2020 r. (Dz.U. 2020 poz. 1222)

Status: ZUS odmawia (wyrok TK niepublikowany w Dz.U.)
Tryb: wniosek o wznowienie postępowania (art. 190 ust. 4 Konstytucji)
      lub odwołanie od decyzji odmownej do SO
      sądy masowo zasądzają przeliczenie — weryfikuj aktualną linię SN
```

---

## 5. REFORMA ORZECZNICTWA ZUS — SZCZEGÓŁY (Dz.U. 2026 poz. 26)

```
ETAP I (27.01.2026) — OBOWIĄZUJE:
  → Nowe definicje aktywności niezgodnej z celem L4
  → Rozszerzone uprawnienia kontrolerów ZUS

ETAP II (13.04.2026) — OBOWIĄZUJE:
  → Pielęgniarki i fizjoterapeuci uprawnieni do wydawania orzeczeń
    (sprzeciw od ich orzeczenia → do lekarza orzecznika)
  → Lekarze bez specjalizacji lub z 5-letnim stażem mogą być orzecznikami
  → Badania orzecznicze zdalnie (wideorozmowa)
  → Max 30 dni na wydanie orzeczenia; przekroczenie → prawo ponaglenia strony

ETAP III (01.01.2027) — PLANOWANY (weryfikuj status!):
  → Komisje lekarskie zastąpione jednoosobowym orzekaniem I i II inst.
  → Orzeczenia w formie elektronicznej
```

---

## 6. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Niezaliczone okresy składkowe | Zaświadczenie Rp-7, umowy, świadectwa pracy | pracodawca / ZUS | wysoka | pracodawca nieistniejący | ZUS może potwierdzić ze swoich akt |
| Praca w szczególnych warunkach | Zaświadczenie pracodawcy (na formularzu ZUS), świadectwa pracy | pracodawca | wysoka | brak druku ZUS | zeznania świadków, dokumenty BHP |
| Niezdolność do pracy | Dokumentacja medyczna, opinia biegłego | lekarze | wysoka | nieaktualna dokumentacja | aktualna specjalistyczna |
| Błędna data niezdolności | Historia choroby, dokumentacja ZLA | lekarze | wysoka | brak dokumentacji z okresu | wnioskuj o biegłego sądowego |
| Błędny kapitał początkowy | Zaświadczenia o zarobkach (Rp-7) | pracodawca / ZUS | wysoka | brak zaświadczeń | archiwa państwowe / ZUS ROPAN |

---

## 7. STRATEGIA

### Perspektywa ubezpieczonego / wnioskującego

1. Sprzeciw od orzeczenia lekarskiego jest obowiązkowy przed sądem — nigdy nie pomijaj.
2. Brak pouczenia w decyzji = termin na odwołanie nie biegnie — sprawdź pouczenie.
3. Zbierz zaświadczenia Rp-7 ze wszystkich miejsc pracy — to podstawa kapitału.
4. Przy emerytury praca w szcz. warunkach — zaświadczenie na druku ZUS US-7.
5. Przy wyroku TK SK 140/20 — wniosek o wznowienie lub odwołanie od decyzji odmownej.

### Ryzyka

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Pominięcie sprzeciwu | Sąd odrzuci odwołanie bez merytorycznego rozpoznania | Sprzeciw zawsze, nawet od orzeczenia korzystnego z błędną datą |
| Termin 1 miesiąca na odwołanie | Decyzja prawomocna | Oblicz termin natychmiast |
| Brak zaświadczeń Rp-7 | Niższy kapitał / emerytura | Archiwa ZUS, Archiwum Akt Nowych, archiwa pracodawców |
| Brak pouczenia w decyzji | Termin nie biegnie — ale może upłynąć rok (art. 477⁹ §2 KPC) | Złóż odwołanie niezwłocznie |

---

## 8. ORZECZNICTWO

```
web_search: "sprzeciw orzeczenie lekarskie ZUS pominięcie konsekwencje SN sn.pl"
web_search: "wyrok TK SK 140/20 przeliczenie emerytury ZUS odwołanie SO 2025 2026"
web_search: "emerytura czerwcowa ZUS przeliczenie ustawa 2025 poz. 1169"
web_search: "renta niezdolność do pracy biegły sądowy orzecznictwo SN sn.pl"
```

---

## 9. QUALITY GATE

- [ ] Termin na sprzeciw (14 dni) lub odwołanie (1 miesiąc) obliczony?
- [ ] Sprzeciw złożony (jeśli orzeczenie lekarskie)?
- [ ] Właściwy sąd (SO / SR) ustalony?
- [ ] Reforma orzecznicza (etap I/II/III) uwzględniona?
- [ ] Akty prawne SUS i FUS zweryfikowane w ISAP?
- [ ] Każda przesłanka ma przypisany dowód?

---

## 10. OUTPUT

1. Stan faktyczny; 2. Stan prawny (Dz.U. z ISAP, w tym reforma orzecznicza); 3. Kwalifikacja świadczenia; 4. Terminy (sprzeciw 14 dni / odwołanie 1 miesiąc); 5. Matryca dowodowa; 6. Analiza ryzyk; 7. Strategia; 8. Rekomendacja; 9. Kontrola ISAP/temporalności.

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| KRUS (rolnicy) | `mod-KRUS-rolnicze-ubezpieczenia` |
| Pismo: odwołanie od decyzji ZUS | `pisma-procesowe-v3` |
| Orzecznictwo SN — ubezpieczenia | `orzeczenia-sadowe-v2` |
| Rehabilitacja / PFRON | `mod-ustawa-rehabilitacja-PFRON` |

---

## ŹRÓDŁA ONLINE

- Ustawa SUS: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000199
- Ustawa FUS: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20251749
- ZUS (wnioski): https://www.zus.pl
- SN (orzeczenia): https://www.sn.pl

---

## ANEKS A — RENTA Z TYTUŁU NIEZDOLNOŚCI DO PRACY — TRZY PRZESŁANKI

> **Podstawa:** art. 57 ustawy FUS — Dz.U. 2025 poz. 1749 t.j. | weryfikuj w ISAP.

```
Przesłanka 1: Całkowita lub częściowa niezdolność do pracy
  (orzeczenie lekarza orzecznika ZUS / pielęgniarki* / fizjoterapeuty*)
  * od 13.04.2026 — weryfikuj aktualne uprawnienia

Przesłanka 2: Wymagany staż ubezpieczeniowy
  Wiek w dniu powstania niezdolności:
  Do 20 lat:      1 rok
  20–22 lata:     2 lata
  22–25 lat:      3 lata
  25–30 lat:      4 lata
  Powyżej 30 lat: 5 lat w ostatnim 10-leciu przed wnioskiem lub niezdolnością

Przesłanka 3: Niezdolność powstała w OKRESIE SKŁADKOWYM / NIESKŁADKOWYM
              lub w ciągu 18 miesięcy po ich ustaniu
  ⚠️ WYJĄTEK: ubezpieczony z ≥ 25 latami stażu → warunek przesłanki 3 odpada
```

---

## ANEKS B — KALKULATOR TERMINÓW ZUS

| Czynność | Termin |
|---|---|
| Sprzeciw od orzeczenia lekarza orzecznika | **14 dni** od doręczenia orzeczenia |
| Sprzeciw od orzeczenia pielęgniarki/fizjoterapeuty | **14 dni** (od 13.04.2026) |
| Odwołanie od decyzji ZUS | **1 miesiąc** od doręczenia decyzji |
| Apelacja od wyroku SO | **14 dni** od doręczenia wyroku z uzasadnieniem |
| Skarga kasacyjna do SN | **30 dni** od wyroku SA w II instancji |
| Wniosek o przeliczenie emerytury / kapitału | brak terminu zawitego — można w każdej chwili |
| Ponaglenie ZUS przy bezczynności | po 2 miesiącach od złożenia wniosku |
| Ponaglenie przy braku orzeczenia | po 30 dniach od złożenia dokumentacji (od Etapu II) |

---

## ANEKS C — PREDYKCJA WYNIKU ZUS — SZABLON

```
Szanse na wygraną: [0–100%]
IN PLUS:
  → Dokumentacja medyczna kompletna i aktualna
  → Zaświadczenia Rp-7 ze wszystkich miejsc pracy
  → Biegły sądowy na korzyść ubezpieczonego
  → Wyrok TK SK 140/20 (dotyczy konkretnej osoby)
  → Błąd czerwcowy — ustawa z 5.08.2025 (przeliczone z urzędu)
IN MINUS:
  → Brak sprzeciwu od orzeczenia lekarskiego → sąd odrzuci odwołanie
  → Upływ terminu na odwołanie
  → Brak dokumentacji medycznej z okresu niezdolności
  → Niezdolność powstała po 18 miesiącach od ustania ubezpieczenia
  → Niewystarczający staż ubezpieczeniowy
BENCHMARKING: → wywołaj orzeczenia-sadowe-v2
  (NIGDY nie cytuj sygnatur z pamięci — ZAWSZE weryfikuj online)
REKOMENDACJA: □ Odwołanie do sądu  □ Wniosek o przeliczenie  □ Biegły lekarski
```
