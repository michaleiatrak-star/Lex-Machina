---
name: dr-02-prawo-cywilne-rodzinne-gospodarcze
version: 3.6
description: |
  DR-02: Prawo Cywilne, Rodzinne i Gospodarcze
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-02 — Prawo Cywilne, Rodzinne i Gospodarcze

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

> Procedura szczegółowa (warstwa strukturalna SAOS/MCP, kontrakt sygnatur,
> gradient weryfikacji cytatu): `view shared/PRAWO-HARDGATE.md` — wczytaj
> PRZED pierwszym przepisem w każdej odpowiedzi. Integruje się z
> `shared/ISAP-AUDIT-PROTOCOL.md`.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci modelu podczas sesji — każde brzmienie weryfikuj w ISAP**
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-PODMIOTY-WLASNOSC.md` — osoba fizyczna/prawna, przedsiębiorca,
  konsument, nieruchomość, posiadanie, własność, "rzecz" (art. 45 KC)
- `definicje/DEF-ODPOWIEDZIALNOSC-SZKODA.md` — szkoda (damnum emergens/lucrum
  cessans), odpowiedzialność cywilna, odszkodowanie; ⚠️ NOWE: siła wyższa
  (brak def. ustawowej, 3 przesłanki SN) + rebus sic stantibus / art. 357¹ KC
  (4 przesłanki nieostre, tryb wyłącznie powództwem, granice modyfikacji umowy)
- `definicje/DEF-PROCEDURA.md` — termin zawity vs przedawnienie vs instrukcyjny,
  strona postępowania
- `definicje/DEF-CYWILNE-WYKLADNIA.md` — rękojmia vs gwarancja (reforma 2023)

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE: czynność prawna
  ukryta/pozorna (art. 83 KC — symulacja, dysymulacja, ochrona osoby trzeciej
  w dobrej wierze), wyłączenie sędziego/biegłego z powodu interesu własnego
  (art. 48-49/281 KPC + TK P 10/19), świadek i jego interes (art. 233/261 KPC)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-112 Faktyczne wspólne pożycie (art. 115 §11 KK — osoba najbliższa)
- BAS-119 Przedsiębiorca (Prawo przedsiębiorców art. 4)
- BAS-126 Zasiedzenie nieruchomości (art. 172 KC — przesłanki, dobra/zła wiara)
- BAS-127 Hipoteka (akcesoryjność, pierwszeństwo, wpis do KW)
- BAS-128 Bezpodstawne wzbogacenie (art. 405 KC — 4 przesłanki)
- BAS-W13 Niezgodność towaru z umową B2C (od 01.01.2023 — u.p.k. art. 43a-43n)
- BAS-W26 Szkoda / damnum emergens / lucrum cessans (art. 361 §2 KC)
- BAS-W27 Termin zawity vs przedawnienie vs instrukcyjny (KRYTYCZNE rozróżnienie)
- BAS-W28 Nadużycie prawa (art. 5 KC — zasada "czystych rąk")
- BAS-W30 Moc dowodowa dokumentu urzędowego vs prywatnego (art. 243-245 KPC)
- BAS-W31 Właściwość miejscowa sądu (ogólna, przemienna, wyłączna)
- BAS-W32 Przedawnienie po reformie 2018 (6 lat ogólny, terminy szczególne)
- BAS-W33 Kara umowna — miarkowanie (art. 484 §2 KC)
- BAS-W34 Odsetki: kapitałowe vs za opóźnienie vs handlowe (różne stopy!)
- BAS-W35 Nakaz zapłaty: sprzeciw vs zarzuty vs EPU (różne terminy/skutki)

## Moduły (19 łącznie — ✓ 19 OK, ☐ 0 STUB)

```
  [✓] OK    mod-KC-cywilne-zobowiazania-odpowiedzialnosc
  [✓] OK    mod-KC-spadki
  [✓] OK    mod-KC-konsumenckie
  [✓] OK    mod-KC-ubezpieczenia
  [✓] NOWY  mod-KC-kredyty-frankowe
  [✓] OK    mod-KRO-rodzinne
              (v1.1.0 2026-07-02: +mediacja rozwodowa art.436/445² KPC,
               +OZSS rozszerzone, +świadkowie w sprawach rozwodowych —
               pointer do shared/MOD-ATAK-NA-SWIADKA.md, bez duplikacji)
  [✓] OK    mod-KSH-spolki-handlowe
  [✓] OK    mod-PrUpad-upadlosc-restrukturyzacja
  [✓] NOWY  mod-ustawa-doradca-restrukturyzacyjny-zawod
              (Dz.U. 2022 poz. 1007 [licencja, sprawdź nowszy t.j.] +
               Pr. upadłościowe Dz.U. 2025 poz. 614 art. 157 + Pr.
               restrukturyzacyjne Dz.U. 2022 poz. 2309 [sprawdź nowszy] +
               nowelizacja Dz.U. 2025 poz. 1085; zawód regulowany —
               licencja MS, BEZ samorządu/izby; syndyk/nadzorca/zarządca
               jako posiadacz jednej licencji; rozgraniczenie od
               mod-PrUpad-upadlosc-restrukturyzacja — status osoby vs
               przebieg postępowania)
  [✓] OK    mod-KPC-egzekucja-windykacja
  [✓] OK    mod-ustawa-prawa-konsumenta
  [✓] OK    mod-ustawa-UZNK-nieuczciwa-konkurencja
  [✓] OK    mod-ustawa-deweloperska
  [✓] OK    mod-ustawa-KRS-rejestr-sadowy
  [✓] OK    mod-ustawa-fundacje-stowarzyszenia
  [✓] OK    mod-ustawa-spoldzielnie-wlasnosc-lokali
  [✓] OK    mod-KP-art943-mobbing-dyskryminacja
  [✓] OK    mod-ustawa-cudzoziemcy
  [✓] OK    mod-ustawa-timeshare-zastaw-rejestrowy
```

## Jak wywołać

```
view /mnt/skills/user/dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-02-prawo-cywilne-rodzinne-gospodarcze/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2` / `analizator-umow-v1`
- mod-KRO-rodzinne (sprawy rozwodowe, świadkowie) → `shared/MOD-ATAK-NA-SWIADKA.md` (kanoniczne techniki
  ataku/obrony wiarygodności świadka) oraz `przesluchanie-swiadkow-v2-min90` (przygotowanie przesłuchania)
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.ms.gov.pl, sn.pl

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
