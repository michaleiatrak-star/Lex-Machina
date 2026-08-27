# mod-KAS-kontrola-celno-skarbowa

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Ustawa o KAS — Dz.U. 2025 poz. 1131 t.j. | Op — Dz.U. 2025 poz. 111 | PPSA — Dz.U. 2026 poz. 143
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## ⚠️ ZASADA ABSOLUTNA — RÓŻNE REŻIMY

```
KONTROLA PODATKOWA (naczelnik US) → tryb Op
KONTROLA CELNO-SKARBOWA (naczelnik UCS) → ustawa o KAS + Op pomocniczo
  → Inny organ, inne uprawnienia, inny wynik kontroli, inny termin korekty
Nie mieszaj trybów — błąd trybu = błąd krytyczny procesowy.
```

---

## 1. CORE

### Zakres modułu
Kontrola podatkowa (US) i kontrola celno-skarbowa (UCS/KAS), uprawnienia funkcjonariuszy KAS, wynik kontroli, korekta deklaracji po kontroli, decyzja naczelnika UCS, zabezpieczenie majątkowe i blokada rachunku, przeszukanie i zatrzymanie dokumentów, ścieżka odwoławcza.

### Akty

| Akt | Dz.U. |
|---|---|
| Ustawa o KAS | Dz.U. 2025 poz. 1131 t.j. |
| Ordynacja podatkowa (Op) — działy IV i VI | Dz.U. 2025 poz. 111 t.j. |
| KKS | Dz.U. 2025 poz. 633 t.j. |

---

## 2. INTAKE

```
□ Kto prowadzi kontrolę: naczelnik US (kontrola podatkowa) czy naczelnik UCS (celno-skarbowa)?
□ Czy doręczono zawiadomienie / upoważnienie?
□ Jaki zakres kontroli i jaki okres?
□ Czy doręczono protokół / wynik kontroli?
□ Jaki termin i dopuszczalność korekty deklaracji?
□ Czy istnieje materiał dowodowy organu (JPK, rejestry, faktury)?
□ Czy grozi ryzyko KKS?
□ Czy organ zastosował zabezpieczenie majątkowe lub blokadę rachunku?
```

---

## 3. PROCEDURA

### Porównanie kontroli podatkowej vs celno-skarbowej

| Cecha | Kontrola podatkowa (US) | Kontrola celno-skarbowa (UCS/KAS) |
|---|---|---|
| Organ | Naczelnik urzędu skarbowego | Naczelnik urzędu celno-skarbowego |
| Podstawa | Op dział VI (art. 281–292a) | Ustawa o KAS |
| Wszczęcie | Zawiadomienie (co do zasady) | Upoważnienie (bez obowiązku wcześniejszego zawiadomienia) |
| Wynik | Protokół kontroli | Wynik kontroli celno-skarbowej |
| Korekta po kontroli | 14 dni od doręczenia protokołu | 14 dni od doręczenia wyniku |
| Skutek braku korekty | Postępowanie podatkowe | Decyzja naczelnika UCS |
| Odwołanie | Do DIAS w 14 dniach | Do DIAS w 14 dniach |

### Schemat kontroli celno-skarbowej

```
Wszczęcie przez naczelnika UCS (upoważnienie)
  ↓
Czynności kontrolne (badanie JPK, dokumentów, rachunków, towarów)
  ↓ [doręczenie]
Wynik kontroli celno-skarbowej
  ↓ [14 dni] KOREKTA DEKLARACJI
    Korekt złożona → umorzenie postępowania z urzędu
    Korekta niezłożona →
  ↓
DECYZJA naczelnika UCS (I instancja)
  ↓ [14 dni] ODWOŁANIE DO DIAS
Dyrektor IAS (II instancja)
  ↓ [30 dni] SKARGA DO WSA
WSA → NSA
```

---

## 3a. ⭐⭐⭐ TERMINY I PRZEKSZTAŁCENIE W POSTĘPOWANIE PODATKOWE
(dodano 2026-08-12, na żądanie użytkownika — dotąd CAŁKOWICIE
nieobecny, kluczowy element proceduralny)

```
⭐⭐ TERMIN ZAKOŃCZENIA kontroli celno-skarbowej: BEZ ZBĘDNEJ
  zwłoki, NIE PÓŹNIEJ niż W CIĄGU **3 MIESIĘCY** OD dnia jej
  WSZCZĘCIA (= od DNIA doręczenia kontrolowanemu upoważnienia do
  jej przeprowadzenia)
  → MOŻLIWE przedłużenie — ALE WYMAGA zawiadomienia W FORMIE
    POSTANOWIENIA, Z WSKAZANIEM przyczyn I NOWEGO terminu — NA TO
    postanowienie NIE SŁUŻY zażalenie
  → obowiązek DOTRZYMANIA terminu JEST NIEZALEŻNY od tego, CZY
    opóźnienie WYNIKA z przyczyn LEŻĄCYCH po stronie ORGANU, CZY
    przyczyn OBIEKTYWNYCH (potwierdzone wyrokiem NSA I FSK 1087/20)

⭐⭐⭐ ZAKOŃCZENIE i PRZEKSZTAŁCENIE (art. 83 ustawy o KAS):
  1) Kontrola KOŃCZY SIĘ doręczeniem WYNIKU kontroli LUB
     PROTOKOŁEM (ZALEŻNIE od PRZEDMIOTU kontroli)
  2) Podatnik MA **14 DNI** od DORĘCZENIA wyniku NA złożenie
     korekty deklaracji, UWZGLĘDNIAJĄCEJ stwierdzone
     nieprawidłowości
  3) JEŚLI korekta NIE ZOSTANIE złożona (LUB organ jej NIE
     uwzględni W CAŁOŚCI) — zakończona kontrola PRZEKSZTAŁCA SIĘ
     W POSTĘPOWANIE podatkowe
  4) ⭐⭐⭐ TERMIN przekształcenia: NIE PÓŹNIEJ niż **6 MIESIĘCY** OD
     zakończenia kontroli — POTWIERDZONE bezpośrednio orzecznictwem
     NSA (wyrok I FSK 1264/21, 3.03.2022) — DOTYCZY WYŁĄCZNIE
     samego PRZEKSZTAŁCENIA, NIE wpływa NA możliwość WSZCZĘCIA
     nowej kontroli celno-skarbowej PO upływie 6 miesięcy od
     WCZEŚNIEJSZEJ kontroli PODATKOWEJ (TO ODRĘBNA kwestia)
  5) PRZEKSZTAŁCENIE NASTĘPUJE Z DNIEM doręczenia POSTANOWIENIA o
     przekształceniu — NA TO postanowienie RÓWNIEŻ NIE SŁUŻY
     zażalenie
  6) ⭐ CIĄGŁOŚĆ ORGANU: NACZELNIK urzędu celno-skarbowego, KTÓRY
     SPORZĄDZIŁ wynik kontroli, JEST właściwy DO przeprowadzenia
     POSTĘPOWANIA i WYDANIA decyzji — TEN SAM organ PROWADZI
     CAŁOŚĆ sprawy

⭐ SZCZEGÓLNE PRZYPADKI PROCEDURALNE:
  → ROZWIĄZANIE kontrolowanej SPÓŁKI (cywilnej, jawnej, partnerskiej,
    komandytowej, komandytowo-akcyjnej) W TRAKCIE kontroli/
    postępowania: kontrola JEST prowadzona wobec BYŁYCH wspólników
    tej spółki; POSTĘPOWANIE kończy SIĘ decyzją NA podstawie art.
    115 §4 Ordynacji podatkowej
  → UTRATA statusu podatnika PRZEZ podatkową GRUPĘ kapitałową W
    TRAKCIE kontroli/postępowania: kontrolę I postępowanie
    PROWADZI naczelnik, KTÓRY je WSZCZĄŁ

⭐ PRAWA PODATNIKA przy PRZEKROCZENIU terminu (⚠️ dotyczy głównie
  kontroli PODATKOWEJ, analogicznie ZASTOSOWANIE do celno-
  skarbowej): PONAGLENIE do organu WYŻSZEJ instancji, NASTĘPNIE
  SKARGA na bezczynność/PRZEWLEKŁOŚĆ postępowania DO WSA

Potwierdzone w 7+ zgodnych źródeł, w tym BEZPOŚREDNIO dosłowny
tekst art. 83 ustawy o KAS (OpenLEX, Dz.U.2025.1131 t.j., wersja od
16.04.2026) oraz orzecznictwo NSA (I FSK 1264/21, I FSK 1087/20),
Grant Thornton [×2], ordynacjapodatkowa.pl [×2], rachunkowosc.com.pl,
asiw.pl [luty 2026], pragmatiq.pl.
```

## 4. UPRAWNIENIA FUNKCJONARIUSZY KAS

```
Prawo wstępu do pomieszczeń i obiektów kontrolowanego
Żądanie okazania dokumentów, ksiąg i ewidencji
Dostęp do JPK (struktur plików kontrolnych) w formacie elektronicznym
Przesłuchanie stron, świadków, biegłych
PRZESZUKANIE (wymaga postanowienia sądu lub pilnej zgody):
  → Prokuratura lub sąd rejonowy właściwy wg siedziby kontrolowanego
  → Pilna sytuacja: naczelnik UCS + potwierdzenie sądu w 5 dni
BLOKADA RACHUNKU (STIR — art. 119zv–119zb Op):
  → Do 72 godzin przy podejrzeniu wyłudzenia VAT
  → Przedłużenie przez Szefa KAS do 3 miesięcy
  → Zaskarżenie do sądu administracyjnego
```

---

## 5. TAKTYKA PODCZAS KONTROLI

```
ZANIM KONTROLA SIĘ ZACZNIE:
  □ Sprawdź upoważnienie — organ, zakres, okres, dane funkcjonariuszy
  □ Upewnij się, że zakres kontroli jest precyzyjny
  □ Zabezpiecz własną dokumentację (kopia + data)

PODCZAS KONTROLI:
  □ Wszelkie żądania organu dokumentuj pisemnie
  □ Zastrzeżenia do protokołu — złóż na piśmie w terminie
  □ Korespondencja z organem — wyłącznie pisemna z potwierdzeniem

PO WYNIKU KONTROLI:
  □ 14-dniowy termin na korektę: LICZY SIĘ od doręczenia wyniku
  □ Ocena: korekta + czynny żal KKS vs odwołanie po decyzji?
  □ Przy ryzyku karnym skarbowym: czynny żal ZANIM organ wszcznie postępowanie
```

---

## 6. DOWODY

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| Brak podstawy kontroli | Upoważnienie — zakres / organ / data | organ | wysoka | — | kwestionuj w zastrzeżeniach |
| Błędna ocena dokumentów | Własna dokumentacja vs ustalenia organu | dokumenty spółki | wysoka | brak kopii | zabezpiecz przed kontrolą |
| Przekroczenie uprawnień | Protokoły czynności poza zakresem upoważnienia | akta | wysoka | — | zastrzeżenie do protokołu |
| Brak JPK / niezgodność | Pliki JPK_VAT, JPK_KR, JPK_MAG | systemy IT | wysoka | błędy techniczne | korekta / wyjaśnienia |

---

## 7. STRATEGIA

### Perspektywa podatnika / kontrolowanego

1. Upoważnienie do kontroli — sprawdź zakres: niedopuszczalne wychodzenie poza.
2. 14-dniowy termin na korektę po wyniku — oblicz od daty doręczenia.
3. Korekta + czynny żal może być korzystniejsza niż odwołanie przy jasnym stanie faktycznym.
4. Przy ryzyku KKS: czynny żal przed wszczęciem postępowania przez organ.
5. Przy blokadzie STIR — natychmiast do sądu administracyjnego.

### Ryzyki

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Utrata terminu 14 dni na korektę | Automatyczne wszczęcie postępowania | Oblicz termin od doręczenia wyniku |
| Przeniesienie ustaleń do KKS | Organ wszczyna postępowanie karno-skarbowe | Czynny żal przed wszczęciem |
| Blokada rachunku STIR | Firma bez dostępu do środków | Zaskarżenie do sądu adm. w trybie pilnym |
| Zbyt szeroki zakres kontroli | Organ bada okresy/podatki poza upoważnieniem | Zastrzeżenia + skarga do WSA |

---

## 8. QUALITY GATE

- [ ] Rodzaj kontroli ustalony (podatkowa US / celno-skarbowa UCS)?
- [ ] Upoważnienie sprawdzone (organ, zakres, periode)?
- [ ] Termin 14 dni na korektę obliczony od doręczenia wyniku?
- [ ] Ryzyko KKS ocenione?
- [ ] Aktualny t.j. ustawy o KAS zweryfikowany?

---

## 9. OUTPUT

1. Kwalifikacja (kontrola podatkowa / celno-skarbowa); 2. Organ i zakres; 3. Stan prawny; 4. Terminy; 5. Matryca dowodowa; 6. Ocena ustaleń organu; 7. Ryzyko KKS; 8. Strategia (korekta / odwołanie / czynny żal); 9. Ryzyka; 10. Rekomendacja.

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| Postępowanie podatkowe (Op) | `mod-OP-ordynacja-podatkowa` |
| KKS (czynny żal) | `mod-OP-ordynacja-podatkowa` → sekcja KKS |
| Pismo: odwołanie od decyzji UCS | `pisma-procesowe-v3` |
| Orzecznictwo NSA | `orzeczenia-sadowe-v2` |
| Obowiązek zawiadomienia prokuratora o przestępstwie pospolitym znalezionym w toku kontroli (art. 304 §2 KPK) | `shared/ZAWIADOMIENIA-KRZYZOWE.md` (dodano 2026-07-27) |

---

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20251131
