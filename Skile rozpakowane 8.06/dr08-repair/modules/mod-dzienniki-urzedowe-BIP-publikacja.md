# mod-dzienniki-urzedowe-BIP-publikacja

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Ustawa o ogłaszaniu aktów normatywnych — weryfikuj aktualny t.j. w ISAP
**Data weryfikacji online:** 2026-06-05

---

## 1. CORE

### Zakres
Publikacja aktów prawa miejscowego w dziennikach urzędowych województw (dzienniki.gov.pl), BIP jako kanał publikacji wewnętrznych uchwał JST, termin wejścia w życie, vacatio legis, prostowanie błędów, błędy publikacyjne a ważność aktu.

### Akty
Ustawa z 20.07.2000 r. o ogłaszaniu aktów normatywnych i niektórych innych aktów prawnych — weryfikuj aktualny t.j. w ISAP.

---

## 2. PROCEDURA

### Co wymaga publikacji w dzienniku urzędowym województwa

```
OBOWIĄZKOWO w dzienniku urzędowym województwa (akty prawa miejscowego):
  □ Uchwały rad gmin, powiatów, sejmiku województwa stanowiące prawo miejscowe
  □ Rozporządzenia porządkowe Wojewody
  □ Statut gminy, powiatu, województwa

WYŁĄCZNIE w BIP (akty wewnętrzne, nieobowiązujące powszechnie):
  □ Zarządzenia wewnętrzne organów wykonawczych
  □ Uchwały niepowszechnego zastosowania
  □ Protokoły sesji, sprawozdania, informacje

Portal: https://dzienniki.gov.pl — portal wszystkich dzienników urzędowych woj.
```

### Wejście w życie

```
Zasada: 14 dni od ogłoszenia w dzienniku urzędowym województwa
  Wyjątki:
  □ Akt wymaga wcześniejszego wejścia w życie z uwagi na ważny interes publiczny
    → możliwe krótsze vacatio legis lub natychmiastowe wejście w życie
    → wymaga uzasadnienia
  □ Uchwała budżetowa: wchodzi w życie z dniem podjęcia z mocą od 1 stycznia

Błąd: akt podjęty ale niepublikowany → NIE wchodzi w życie!
```

---

## 3. QUALITY GATE / OUTPUT

**Quality gate:** Akt potwierdzony w dzienniki.gov.pl? Data ogłoszenia i data wejścia w życie obliczona? BIP aktualny?

**Output:** Weryfikacja publikacji → data wejścia w życie → vacatio legis → ważność aktu.

**Powiązania:** `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa` | `dr-05` → `mod-UDIP-dostep-informacji-publicznej`

**Źródła:** https://dzienniki.gov.pl | https://isap.sejm.gov.pl
