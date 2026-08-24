# F-108 — lista aktów MS (egzamin wstępny na aplikację 2026) jako benchmark pokrycia

> **Otwarta:** 2026-08-23 | **Priorytet:** wysoki | **Zakres:** cross — 16 DR
> **Plik roboczy flagi.** Wiersz sterujący: `WARN-OTWARTE.md`, sekcja A.
> **Plik siostrzany:** `AUDIT-JOURNAL.md`, wpis AUDYT-2026-08-23.

## Czym jest ta lista i dlaczego jest lepszym benchmarkiem niż dotychczasowe

Źródło: wykaz tytułów aktów prawnych ogłoszony przez Przewodniczącego zespołu
do przygotowania pytań testowych na egzamin wstępny dla kandydatów na
aplikantów adwokackich i radcowskich — 52 pozycje, stan prawny na dzień
ogłoszenia.

⚠️ **Metryka aktu prawnego samego wykazu (podstawa prawna ogłoszenia, Dz.U.
Prawa o adwokaturze i ustawy o radcach prawnych) NIE została zweryfikowana
w RZĘDZIE 1** — dokument wpłynął do systemu jako tekst przekazany przez
użytkownika. Do zamknięcia: potwierdzić wykaz na stronie MS/BIP.
Status: ⚠️ [NIEWERYFIKOWANE — źródło przekazane, nie odczytane]

Dlaczego ta lista ma wartość audytową, której nie mają mapy wewnętrzne:
jest to **zewnętrzny, niezależny od systemu wykaz aktów uznanych przez
regulatora zawodu za minimum warsztatowe polskiego prawnika**. Dotychczasowe
mapy (`MAPA-AKTOW.md`, `MAPA-POKRYCIA.md`) rosły reaktywnie — akt trafiał do
systemu, bo ktoś zadał o niego pytanie. Ta lista mierzy pokrycie względem
kryterium ustalonego z zewnątrz, więc ujawnia luki, o które nikt dotąd
nie zapytał. To jest jej jedyna funkcja.

⛔ **Czego ta lista NIE jest:** nie jest listą aktów, które system ma
pokrywać w całości ani wyłącznie. System pokrywa dziś dziesiątki aktów spoza
wykazu (podatkowe, budowlane, medyczne, cyber) i to pokrycie zachowuje.
Wykaz jest **miarą**, nie zakresem.

## Wynik pomiaru bazowego — 2026-08-23

Metoda: dopasowanie każdej pozycji wykazu do (a) nazw plików modułów,
(b) wpisów w `dr-*/MAPA-AKTOW.md`, (c) treści modułów. Trafienia po samych
skrótach (KC, KW, KP, KRO) weryfikowane ręcznie — dają fałszywe dopasowania
wewnątrz innych wyrazów.

| Kategoria | Liczba | Znaczenie |
|---|---|---|
| 🟢 **A** — dedykowany moduł | **39 / 52** | akt ma własny plik modułu |
| 🟡 **B** — wewnątrz modułu łączonego lub tylko w mapie | **9 / 52** | treść istnieje, ale bez własnej jednostki i bez mapy rozdziałów |
| 🟠 **C** — wyłącznie fragment w cudzym module | **1 / 52** | brak samodzielnego opracowania |
| 🔴 **D** — nieobecny | **3 / 52** | zero treści merytorycznej |

**Pokrycie nominalne 75% (A), pokrycie realne nieznane** — kategoria A mówi
tylko, że moduł istnieje. Precedens KSH z `dr-02/MAPA-POKRYCIA.md` (moduł
oznaczony „✅ OK" operował na ~14 z ~600 artykułów) pokazuje, że istnienie
modułu nie jest miarą pokrycia aktu. Dlatego etap 2 tej flagi to badanie
**po rozdziałach**, nie po istnieniu pliku.

### 🔴 D — NIEOBECNE (priorytet 1)

| # | Akt | Uwaga |
|---|---|---|
| 8 | o opłatach w sprawach karnych (23.06.1973) | `mod-KSCU-koszty-sadowe-i-pomoc-prawna.md` pokrywa WYŁĄCZNIE koszty cywilne. Opłaty karne to osobna ustawa i osobny reżim — system nie ma podstawy do wyliczenia opłaty od apelacji karnej ani wniosku o wznowienie |
| 41 | o ubezpieczeniach obowiązkowych, UFG i PBUK (22.05.2003) | jedyna wzmianka w `mod-ustawa-deweloperska.md` — w innym kontekście (fundusz gwarancyjny deweloperski, NIE UFG). **Masowa praktyka odszkodowawcza (OC komunikacyjne) bez żadnego oparcia w systemie** |
| 52 | o fundacji rodzinnej (26.01.2023) | jedyna wzmianka w module podatków sektorowych. Instytucja młoda, rosnąca w praktyce sukcesyjnej; brak jakiegokolwiek ujęcia cywilno-korporacyjnego |

### 🟠 C — FRAGMENT (priorytet 1 — bezpośrednia przyczyna usterki testu 5)

| # | Akt | Uwaga |
|---|---|---|
| 46 | o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych (8.03.2013) | istnieje wyłącznie jako wątek w `dr-02/modules/kc-zobowiazania/czesc-01-przedawnienie-kara-umowna-wady-wzbogacenie-odsetki.md` i wzmianka w module UZNK. **To jest akt, na którym poległ test 5** — brak modułu oznacza brak tabeli stawek półrocznych, brak progów rekompensaty i brak kryterium „czy to transakcja handlowa". `shared/RATE-COMPLETENESS.md` (utworzony 2026-08-23) opisuje PROCEDURĘ, ale nie ma modułu, który dostarczyłby jej treści. **Najwyższy priorytet z całej flagi** |

### 🟡 B — BEZ WŁASNEJ JEDNOSTKI (priorytet 2–3)

| # | Akt | Gdzie jest dziś | Prio |
|---|---|---|---|
| 51 | Prawo przedsiębiorców (6.03.2018) | rozproszone wzmianki w 4 DR, brak modułu | 2 |
| 50 | o Sądzie Najwyższym (8.12.2017) | dr-01 zna USP i KRS, ustawy o SN — nie | 2 |
| 30 | o świadczeniach pieniężnych w razie choroby i macierzyństwa (25.06.1999) | wzmianki w dr-04 | 2 |
| 40 | o zwolnieniach z przyczyn niedotyczących pracowników (13.03.2003) | wzmianki w dr-04 | 2 |
| 13 | Prawo spółdzielcze (16.09.1982) | `mod-ustawa-spoldzielnie-wlasnosc-lokali.md` (moduł łączony 3 aktów) | 3 |
| 34 | o spółdzielniach mieszkaniowych (15.12.2000) | j.w. — ten sam moduł łączony | 3 |
| 27 | o samorządzie powiatowym (5.06.1998) | `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa.md` | 3 |
| 28 | o samorządzie województwa (5.06.1998) | j.w. | 3 |
| 45 | o wojewodzie i administracji rządowej w województwie (23.01.2009) | 1 wzmianka | 3 |

⚠️ Kategoria B **nie zawsze wymaga wydzielenia**. Moduł łączony jest właściwą
formą, gdy akty są stosowane razem (spółdzielnie, JST). Kryterium decyzji —
`shared/MOD-GENERATOR-AKTU.md`, krok G-2.

### 🟢 A — DEDYKOWANY MODUŁ (39 pozycji)

1 Prawo wekslowe · 2 TFUE · 3 KPA · 4 KRO · 5 KC · 6 KPC · 7 KW ·
9 KP · 10 Prawo o adwokaturze · 11 KWU/hipoteka · 12 o radcach prawnych ·
14 o fundacjach · 15 o RPO · 16 Prawo o stowarzyszeniach · 17 o samorządzie
gminnym · 18 TUE · 19 Prawo autorskie · 20 o własności lokali · 21 zastaw
rejestrowy · 22 Konstytucja · 23 KK · 24 KPK · 25 o KRS · 26 UGN ·
29 SUS · 31 KKS · 32 o RPD · 33 KSH · 35 ochrona praw lokatorów ·
36 PUSP · 37 KPW · 38 PPSA · 39 Prawo upadłościowe · 42 KSCU ·
43 o przeciwdziałaniu narkomanii · 44 UOKiK · 47 o prawach konsumenta ·
48 Prawo restrukturyzacyjne · 49 Prawo o prokuraturze

⛔ Kategoria A **nie oznacza pokrycia**. Etap 2 obejmuje wszystkie 39.

## Plan flagi — trzy etapy

```
ETAP 1 ✅ ZAKOŃCZONY 2026-08-23 — pomiar bazowy obecności (ten plik)

ETAP 2 ⬛ POKRYCIE PO ROZDZIAŁACH — dla każdej pozycji A i B:
       G-3 z MOD-GENERATOR-AKTU (mapa struktury aktu) → wiersz w
       dr-XX/MAPA-POKRYCIA.md wg formatu ustalonego przez F-83
       (🟢/🟡/🔴/⚪ per tytuł/dział/rozdział + zakres artykułów).
       ⛔ Nie hurtem. Transzami po 3–5 aktów, każda transza = wpis
       w AUDIT-JOURNAL. Kolejność: najpierw akty o największej
       rozbieżności deklaracja↔treść (wzór: KSH), czyli duże kodeksy
       i ustawy ustrojowe.
       ⛔ 9 DR nie ma jeszcze pliku MAPA-POKRYCIA.md (są tylko w dr-02..dr-07).
       Utworzyć przy pierwszej transży dotyczącej danego DR.

ETAP 3 ⬛ BUDOWA BRAKUJĄCYCH MODUŁÓW — kolejność ustalona:
       P1: 46 (transakcje handlowe) → 41 (UFG) → 8 (opłaty karne) → 52 (fundacja rodzinna)
       P2: 51 → 50 → 30 → 40
       P3: decyzja wydzielać/nie wydzielać dla 13, 34, 27, 28, 45
       Procedura: shared/MOD-GENERATOR-AKTU.md, kroki G-1…G-8
```

## Warunki zamknięcia F-108

```
□ wykaz MS potwierdzony w RZĘDZIE 1 (strona MS / BIP) — dziś ⚠️
□ ETAP 2 zamknięty dla wszystkich 48 pozycji A+B
□ ETAP 3: wszystkie pozycje P1 i P2 mają moduł na poziomie ≥ B
  wg shared/POLISH-LAW-COMPLETENESS-MATRIX.md
□ pozycje P3 mają jawną, uzasadnioną DECYZJĘ (wydzielić / zostawić
  w module łączonym) — decyzja jest wynikiem, brak modułu sam w sobie nie jest
□ każdy nowy moduł zarejestrowany w TRZECH miejscach (REGUŁA 3):
  dr-XX/SKILL.md · dr-XX/MAPA-AKTOW.md · prawo-polskie-v2/ROUTING-MAP.md
```

## ⛔ Ograniczenie tego pliku

Ten plik NIE zawiera ani jednego numeru Dz.U. ani daty tekstu jednolitego —
świadomie. Metryki aktów ustala się dopiero w kroku G-1 generatora, przy
faktycznej budowie modułu, wg `shared/PRAWO-HARDGATE.md` v2.5 (sekwencja
B-1 → B-2, przy blokadzie robots — 🟨 KOTWICA URZĘDOWA, warunki K-1…K-4).
Wpisanie tu numerów „z pamięci", żeby lista wyglądała na kompletną, byłoby
dokładnie tym błędem, który tę flagę wywołał.
