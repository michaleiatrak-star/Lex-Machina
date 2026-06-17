# mod-ustawa-zabytki-rewitalizacja

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:**
- Zabytki: Dz.U. 2024 poz. 1292 t.j. z 19.08.2024 ✅ VER: 2026-06-05
- Rewitalizacja: Dz.U. 2024 poz. 278 t.j. ze zm. ✅ VER: 2026-06-05
- Cmentarze: Dz.U. 2023 poz. 1284 t.j. ze zm. — weryfikuj w ISAP
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Ochrona zabytków (formy ochrony, rejestr zabytków WUOZ, obowiązki właściciela, pozwolenie WUOZ na roboty budowlane przy zabytku, sankcje, dotacje), rewitalizacja (GPR, obszar zdegradowany, SSR, prawo pierwokupu, wywłaszczenie w SSR), cmentarze (tworzenie, prawa do grobu, ekshumacja, odpowiedzialność gminy).

---

## 2. ZABYTKI (Dz.U. 2024 poz. 1292)

### Formy ochrony (art. 7 ustawy)

```
1. Wpis do rejestru zabytków (WUOZ — Wojewódzki Urząd Ochrony Zabytków)
2. Wpis na Listę Dziedzictwa UNESCO
3. Uznanie za pomnik historii (Prezydent RP)
4. Utworzenie parku kulturowego (uchwała rady gminy)
5. Ustalenia w MPZP / decyzji WZ
```

### Obowiązki właściciela zabytku

```
□ Zabezpieczenie przed zniszczeniem, uszkodzeniem, kradzieżą
□ Utrzymanie w należytym stanie (prace konserwatorskie)
□ Informowanie WUOZ o zmianach własności, zagrożeniach
□ POZWOLENIE WUOZ: wymagane dla robót budowlanych przy zabytku
  (nie tylko PINB — obydwa organy, ale WUOZ wydaje pozwolenie pierwsze!)
□ Badania archeologiczne: wstrzymanie prac gdy odkrycie — zawiadom WUOZ
```

### Sankcje i dofinansowanie

```
Sankcje: kara grzywny, cofnięcie dotacji, nakaz wykonania prac (decyzja WUOZ)
Dofinansowanie: dotacja ministra + WUOZ + JST do 50% nakładów (lub 100% przy zagrożeniu)
Warunek: wpis do rejestru zabytków
```

---

## 3. REWITALIZACJA (Dz.U. 2024 poz. 278)

```
Inicjuje: gmina (rada gminy)
Obszar zdegradowany: wyznaczony uchwałą rady (art. 11)
  → Warunek: koncentracja negatywnych zjawisk społecznych + co najmniej jedno
    z: gospodarcze / środowiskowe / przestrzenno-funkcjonalne / techniczne

GPR (Gminny Program Rewitalizacji):
  → Dokument strategiczny z konsultacjami społecznymi (7 kroków procedury)
  → Komitet Rewitalizacji (organ doradczy) — obowiązkowy

Specjalna Strefa Rewitalizacji (SSR):
  → Ustanowienie: uchwała rady gminy (max na 10 lat)
  → Prawo pierwokupu gminy do nieruchomości w SSR
  → Wywłaszczenie: dopuszczalne w SSR dla realizacji GPR
  → Uproszczona procedura zmiany MPZP w SSR
```

---

## 4. CMENTARZE (Dz.U. 2023 poz. 1284)

```
Gmina: obowiązek zapewnienia cmentarza komunalnego
Tworzenie cmentarzy: minimalna odległość 150 m od zabudowy

Prawa do grobu: prawo podmiotowe sui generis (nie własność!):
  → SN: chronione jako dobro osobiste
  → Opłata za przedłużenie: za następne 20 lat
  → Nieopłacony → możliwość likwidacji po min. 20 latach od ostatniego pochowku

Ekshumacja: na wniosek uprawnionych + zezwolenie sanepid + prokuratury (gdy śmierć nagła)

Czas pochowania: 72 godz. od zgonu (lub 96 przy balsamowaniu)
```

---

## 5. QUALITY GATE / OUTPUT

**Quality gate:** Forma ochrony zabytku ustalona (rejestr WUOZ / pomnik historii / park kulturowy)? Pozwolenie WUOZ uzyskane przed robotami? GPR uchwalony — czy SSR ustanowiona?

**Output:** Kwalifikacja (zabytki/rewitalizacja/cmentarze) → obowiązki/prawa → organ → sankcje → rekomendacja.

**Powiązania:** `mod-MPZP-WZ-planowanie-przestrzenne` | `dr-09` (pozwolenie na budowę przy zabytku) | `dr-05` → `mod-KPA` | `pisma-procesowe-v3`

**Źródła:**
- Zabytki: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20241292
- Rewitalizacja: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000278
- NID (rejestr zabytków): https://www.nid.pl
