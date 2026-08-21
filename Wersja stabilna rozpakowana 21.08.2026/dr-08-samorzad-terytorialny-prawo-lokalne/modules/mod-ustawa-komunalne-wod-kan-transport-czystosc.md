# mod-ustawa-komunalne-wod-kan-transport-czystosc

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:**
- Wod-kan: Dz.U. 2024 poz. 757 t.j. ✅ VER: 2026-06-05
- Transport zbiorowy: **Dz.U. 2025 poz. 285 t.j.** z 14.02.2025 ✅ VER: 2026-06-05
- Czystość i porządek: **Dz.U. 2025 poz. 765 t.j.** ✅ VER: 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Zbiorowe zaopatrzenie w wodę i odprowadzanie ścieków (ustawa wod-kan: taryfy, umowy z odbiorcami, Wody Polskie jako organ regulacyjny), publiczny transport zbiorowy (PTZ: organizator, operator, plan transportowy, in-house), utrzymanie czystości i porządku w gminach (GOCH: opłata za śmieci, frakcje, PSZOK).

---

## 2. WOD-KAN (Dz.U. 2024 poz. 757)

```
Organ regulacyjny: Wody Polskie (PGW) — NIE gmina
  → Przedsiębiorstwo wod-kan składa wniosek taryfowy do RZGW (Wody Polskie)
  → Wody Polskie zatwierdzają taryfę na 3 lata (lub odmawiają)
  → Odwołanie od decyzji RZGW: do Dyrektora Departamentu Zarządzania Środowiskiem Wodnym
  → Zaskarżenie do WSA: 30 dni

Umowa z odbiorcą:
  → Obowiązek zawarcia umowy przez przedsiębiorstwo
  → Regulamin dostarczania wody: uchwała rady gminy
  → Przyłącze: koszt po stronie właściciela nieruchomości
  → Wodomierz: przedsiębiorstwo zapewnia i kalibruje

Prawo do niższej opłaty:
  → Przy udokumentowanym przecieku za wodomierzem — weryfikuj przepisy w ISAP
```

---

## 3. TRANSPORT ZBIOROWY (Dz.U. 2025 poz. 285)

```
Organizator PTZ: gmina, powiat, związek komunalny, województwo
Operator: podmiot świadczący usługę — wybierany w przetargu lub in-house
In-house (art. 22): możliwe gdy JST kontroluje podmiot (100% udziałów)
Umowa: max 10 lat (tramwaj/metro/kolej: max 15 lat)

Plan transportowy: obowiązkowy dla gmin ≥ 50 000 mieszkańców
  → Zawiera: sieć komunikacyjną, standardy dostępności, rodzaje pojazdów
  → Aktualizacja: co 4 lata

Ulgi ustawowe: 20%, 37%, 49%, 78%, 100% — rekompensata z budżetu państwa
  ⚠️ Weryfikuj aktualny katalog uprawnionych w ISAP
```

---

## 4. CZYSTOŚĆ I PORZĄDEK (Dz.U. 2025 poz. 765)

```
Selektywna zbiórka odpadów: obowiązkowa we wszystkich gminach
Frakcje: papier, metal/tworzywa/wielomateriałowe, szkło, bioodpady, zmieszane
PSZOK (Punkt Selektywnej Zbiórki): gmina obowiązana do prowadzenia

Opłata za GOCH:
  → Uchwalana przez radę gminy (kryterium do wyboru: os./m²/gosp./ilość wody)
  → Stawka dla niesegregujących: min. 2× wyższa
  → Uchybienie obowiązku selektywnej zbiórki → podwyższona opłata
  → Decyzja o wymiarze → KPA → SKO → WSA

Nielegalne składowanie (art. 9x ustawy — weryfikuj w ISAP):
  → Kara administracyjna od zarządcy nieruchomości
```

---

## 5. QUALITY GATE / OUTPUT

**Quality gate:** Nowe t.j. (transport: Dz.U. 2025 poz. 285; czystość: Dz.U. 2025 poz. 765) zastosowane? Organ regulacyjny dla taryf wod-kan: Wody Polskie (nie gmina)?

**Output:** Kwalifikacja usługi komunalnej → organ regulacyjny → tryb → terminy → rekomendacja.

**Powiązania:** `mod-lokalne-podatki-oplaty-taryfy` | `dr-09` (Prawo wodne, ochrona środowiska) | `dr-04` → `mod-KPA` | `pisma-procesowe-v3`

**Źródła:**
- Wod-kan: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000757
- Transport: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000285
- Czystość: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000765
- Wody Polskie: https://wody.gov.pl
