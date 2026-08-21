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

### ⭐⭐ ŹRÓDŁA — PEŁNA LISTA 16 WOJEWÓDZTW (dodane 2026-07-21)

> Odpowiedź na pytanie użytkownika czy moduł wskazuje wszystkie 16
> województw — dotąd był TYLKO ogólny portal zbiorczy, bez
> wyszczególnienia poszczególnych źródeł per województwo.

```
⭐ ROZRÓŻNIENIE DWÓCH RODZAJÓW ŹRÓDEŁ (NIE MYLIĆ):
  1) DZIENNIK URZĘDOWY WOJEWÓDZTWA (oficjalna, PRAWNIE WIĄŻĄCA
     publikacja aktów prawa miejscowego, w tym uchwał sejmiku) —
     WSZYSTKIE 16 dostępne CENTRALNIE przez jeden portal:
     https://dzienniki.gov.pl (wybierz województwo z listy) — TO
     JEST podstawowe, MIARODAJNE źródło dla ustalenia treści i daty
     wejścia w życie uchwały
  2) BIP URZĘDU MARSZAŁKOWSKIEGO / strona sejmiku danego województwa —
     źródło POMOCNICZE (projekty uchwał PRZED sesją, porządek obrad,
     protokoły, transmisje, uchwały o charakterze WEWNĘTRZNYM
     niepodlegające obowiązkowi publikacji w dzienniku urzędowym) —
     NIE zastępuje dziennika urzędowego jako źródła OFICJALNEGO tekstu

TABELA — BIP Urzędu Marszałkowskiego / Sejmiku dla KAŻDEGO z 16
województw (zweryfikowane online 2026-07-21, WSZYSTKIE 16
POTWIERDZONE — Łódzkie potwierdzone bezpośrednio przez użytkownika
2026-07-21 po wcześniejszym błędnym trafieniu na stronę wojewody;
⚠️ sprawdź aktualność adresu przy każdym użyciu — strony bywają
migrowane):

⭐ PRAKTYCZNA OBSERWACJA (na przykładzie bip.lodzkie.pl/uchwaly): wiele
BIP marszałkowskich prowadzi CZYTELNY rejestr uchwał sejmiku z
OZNACZENIEM przy każdej pozycji, czy jest to "akt prawa miejscowego"
(podlegający obowiązkowi publikacji w dzienniku urzędowym) czy zwykły
"link" (uchwała WEWNĘTRZNA, np. o powołaniu składu komisji, rozpatrzeniu
skargi) — TO OZNACZENIE jest PRAKTYCZNIE bardzo pomocne przy szybkim
ustaleniu, czy DANA uchwała w ogóle WYMAGA sprawdzenia w dzienniku
urzędowym, czy wystarczy sama strona BIP jako źródło.

| Województwo | BIP Urzędu Marszałkowskiego / Sejmiku |
|---|---|
| Dolnośląskie | bip.dolnyslask.pl |
| Kujawsko-Pomorskie | bip.kujawsko-pomorskie.pl |
| Lubelskie | umwl.bip.lubelskie.pl |
| Lubuskie | bip.lubuskie.pl |
| Łódzkie | bip.lodzkie.pl (POTWIERDZONE 2026-07-21 — sekcja /uchwaly zawiera pełny rejestr uchwał sejmiku z linkami do plików PDF i oznaczeniem "akt prawa miejscowego" przy uchwałach podlegających publikacji w dzienniku urzędowym) |
| Małopolskie | bip.malopolska.pl/umwm |
| Mazowieckie | bip.mazovia.pl |
| Opolskie | bip.opolskie.pl |
| Podkarpackie | bip.podkarpackie.pl |
| Podlaskie | bip.wrotapodlasia.pl |
| Pomorskie | bip.pomorskie.eu |
| Śląskie | bip.slaskie.pl |
| Świętokrzyskie | bip.sejmik.kielce.pl |
| Warmińsko-Mazurskie | bip.warmia.mazury.pl |
| Wielkopolskie | bip.umww.pl |
| Zachodniopomorskie | bip.wzp.pl |

⭐ PRAKTYCZNA REKOMENDACJA: przy poszukiwaniu KONKRETNEJ uchwały
sejmiku — ZACZNIJ od dzienniki.gov.pl (wybór województwa + rok +
numer pozycji, jeśli znany) jako źródła MIARODAJNEGO; BIP marszałkowskie
z tabeli wyżej sprawdź DODATKOWO, gdy potrzebujesz projektu uchwały
SPRZED sesji, uzasadnienia, protokołu głosowania lub gdy dziennik
urzędowy jeszcze NIE opublikował aktu (opóźnienie publikacyjne).
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
