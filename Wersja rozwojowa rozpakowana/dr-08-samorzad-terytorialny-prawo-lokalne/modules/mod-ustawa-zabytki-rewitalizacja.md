# mod-ustawa-zabytki-rewitalizacja

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:**
- Zabytki: Dz.U. 2024 poz. 1292 t.j. z 19.08.2024 ✅ VER: 2026-06-05
- Rewitalizacja: Dz.U. 2024 poz. 278 t.j. ze zm. ✅ VER: 2026-06-05
- Cmentarze: **Dz.U. 2025 poz. 1590 t.j.**, stan t.j. 06.11.2025 — RZĄD 1 ELI VER 2026-08-28
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
2. Wpis na **Listę Skarbów Dziedzictwa** (art. 7 pkt 1a)
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

## 4. CMENTARZE (Dz.U. 2025 poz. 1590 t.j.)

```
Gmina: obowiązek zapewnienia cmentarza komunalnego
Lokalizacja cmentarza: art. 5 ustawy odsyła do wymagań sanitarnych; obowiązujące
rozporządzenie z 25.08.1959 r. (Dz.U. nr 52 poz. 315) przewiduje co do zasady
**150 m** od zabudowań mieszkalnych, zakładów żywnościowych i ujęć wody,
z możliwością zmniejszenia do **50 m** przy spełnieniu warunku sieci wodociągowej

Prawa do grobu: prawo podmiotowe sui generis (nie własność!):
  → SN: chronione jako dobro osobiste
  → Opłata za przedłużenie: za następne 20 lat
  → Nieopłacony → możliwość likwidacji po min. 20 latach od ostatniego pochowku

Ekshumacja — art. 15 ust. 1:
  → na umotywowaną prośbę osób uprawnionych do pochowania, za zezwoleniem
    właściwego państwowego inspektora sanitarnego; ALBO
  → na zarządzenie prokuratora lub sądu; ALBO
  → na podstawie decyzji inspektora sanitarnego przy przeznaczeniu terenu
    cmentarza na inny cel. Nie kumuluj tych podstaw jako jednego wymogu.

Terminy z art. 9:
  → co do zasady nie wolno pochować zwłok przed upływem **24 godzin** od zgonu;
  → najpóźniej po **72 godzinach** zwłoki należy usunąć z mieszkania w celu
    pochowania albo umieścić w domu przedpogrzebowym/kostnicy;
  → przy wskazanych chorobach zakaźnych — szczególny reżim 24-godzinny;
  → wyjątek od terminu 72 godzin wymaga utrwalenia zwłok i zezwolenia
    właściwego inspektora sanitarnego. ⛔ W ustawie nie ma ogólnej reguły
    „96 godzin po balsamowaniu”.
```

---

## 5. QUALITY GATE / OUTPUT

**Quality gate:** Forma ochrony zabytku ustalona (rejestr WUOZ / pomnik historii / park kulturowy)? Pozwolenie WUOZ uzyskane przed robotami? GPR uchwalony — czy SSR ustanowiona?

**Output:** Kwalifikacja (zabytki/rewitalizacja/cmentarze) → obowiązki/prawa → organ → sankcje → rekomendacja.

**Powiązania:** `mod-MPZP-WZ-planowanie-przestrzenne` | `dr-09` (pozwolenie na budowę przy zabytku) | `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-KPA-postepowanie-administracyjne.md` | `pisma-procesowe-v3`

**Źródła:**
- Zabytki: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20241292
- Rewitalizacja: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000278
- NID (rejestr zabytków): https://www.nid.pl
