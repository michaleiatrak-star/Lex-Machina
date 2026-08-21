# WORKFLOW: Triage szybki (🟢/🟡/🔴)
## Analizator Umów v1 · workflows/triage-szybki.md

**Cel:** szybka kategoryzacja umowy/regulaminu/NDA/aneksu w 5–10 minut,
pomagająca w decyzji *„podpisać"*, *„przekazać do pełnej analizy"*, *„odrzucić
bez negocjacji"*. Komplementarny do pełnej analizy (Moduł A–F w
`mod-core-checklist.md`), która jest głębsza i czasochłonna.

**Triggery:** *„czy mogę to podpisać"*, *„szybki rzut oka"*, *„triage"*, *„jak
złe to jest"*, *„oceń w 5 minut"*, *„NDA do podpisania"*, *„prosta umowa,
ocenisz szybko?"*.

**Zastrzeżenie:** triage to **pierwszy filtr**, nie pełna analiza. Każdy
dokument z kategorii 🟡/🔴 powinien przejść do pełnej analizy przed
podpisaniem. 🟢 oznacza brak czerwonych flag w typowych obszarach — **nie**
oznacza, że dokument jest idealny.

**Relacja do skalowania wg wartości (SKILL.md, FAZA 0):** triage jest
niezależnym, szybszym filtrem *jakościowym* (typy klauzul), skalowanie wg
kwoty jest filtrem *ilościowym* (głębokość raportu). Stosuj oba: triage
decyduje *czy w ogóle czytać dalej*, skalowanie decyduje *jak głęboko* czytać,
gdy już wiadomo, że trzeba.

---

## Trzy kategorie

### 🟢 GREEN — standardowa, podpisywalna bez modyfikacji

**Kryteria (wszystkie muszą być spełnione):**
- strony jednoznacznie zidentyfikowane (KRS/NIP/CEiDG + sposób reprezentacji),
- przedmiot konkretny, mieszczący się w zakresie działalności klienta,
- cap odpowiedzialności obecny, w typowym przedziale (zwykle 1–3× rocznego
  wynagrodzenia dla umów B2B usługowych — dostosuj branżowo),
- wina umyślna i rażące niedbalstwo nie są wyłączone (art. 473 § 2 KC —
  wyłączenie takie jest nieważne z mocy prawa, ale jego obecność w projekcie
  to sygnał agresywnej redakcji drugiej strony, nawet jeśli nieskuteczne),
- terminy płatności w standardzie rynkowym (30–45 dni od FV),
- forma rozstrzygania sporów obecna i uzgodniona,
- klauzule poufności proporcjonalne (czas trwania, zakres),
- przy umowach IT/twórczych: pola eksploatacji wymienione i adekwatne (art. 41
  ust. 2 PrAut) — routing `mod-J9-ip-prawa-autorskie.md`.

### 🟡 YELLOW — wymaga analizy przed podpisaniem

**Jakikolwiek z poniższych sygnałów:**
- cap odpowiedzialności niestandardowy (rażąco niski lub wysoki — sprawdź
  kontekst branżowy zamiast automatycznie klasyfikować),
- szerokie wyłączenia odpowiedzialności (szkody pośrednie, lucrum cessans) —
  zwykle akceptowalne w B2B, ale wymaga świadomej zgody klienta,
- zakaz konkurencji / non-solicitation — sprawdź ekwiwalent, czas, zakres
  (routing `zakaz-konkurencji.md`),
- poufność bez wskazanego okresu po zakończeniu umowy lub bez wyłączeń —
  routing `poufnosc-nda.md` (Moduł K),
- przeniesienie praw autorskich „do wszystkich utworów" bez pól eksploatacji
  — klauzula nieskuteczna bez konkretu (art. 41 ust. 2 PrAut), klient może o
  tym nie wiedzieć,
- forum sporów obce (sąd zagraniczny, arbitraż w innej jurysdykcji) — wymaga
  konsensusu klienta,
- klauzula audytu/inspekcji po stronie kontrahenta — sprawdź zakres,
- brak umowy powierzenia danych (art. 28 RODO) mimo przetwarzania danych
  osobowych — routing `mod-shared-rodo.md`,
- wynagrodzenie uzależnione od czynników zewnętrznych (KPI, success fee) bez
  zdefiniowanych metryk,
- klauzula jednostronnej zmiany zakresu świadczeń — typowa nierównowaga.

### 🔴 RED — nie podpisywać bez głębokiej negocjacji

**Jakikolwiek z poniższych sygnałów:**
- brak cap odpowiedzialności lub cap rażąco niski,
- próba wyłączenia odpowiedzialności za winę umyślną (nieważna z mocy art.
  473 § 2 KC, ale sygnalizuje agresywną redakcję drugiej strony),
- indemnifikacja jednostronna, bez wzajemności i bez limitów kwotowo-czasowych,
- cesja umowy bez zgody Twojej strony,
- klauzula MFN/najtańszej oferty — trudna do egzekwowania, generuje spory,
- zakaz konkurencji bez ekwiwalentu, szeroki czasowo-terytorialnie,
- pełne, otwarte przeniesienie praw autorskich „do wszystkich utworów, które
  kiedykolwiek powstaną" bez konkretyzacji,
- brak klauzuli wypowiedzenia lub wypowiedzenie tylko jednostronne,
- forum sporów wyłączające prawo polskie bez uzasadnienia gospodarczego,
- żądanie dostępu do danych osobowych bez podstawy prawnej,
- kary umowne rażąco wysokie względem wartości umowy (miarkowalne z art. 484
  § 2 KC, ale sygnalizują agresywność drugiej strony),
- automatyczne przedłużenie umowy bez wyraźnej, łatwej do zauważenia zgody.

## Procedura

### Krok 1 — kompletność (1–2 min)

Data, miejsce, strony, reprezentacja, essentialia negotii dla typu dokumentu
(moduł źródłowy z routingu głównego SKILL.md), załączniki obecne w pakiecie.
Brak któregokolwiek elementu = **automatycznie 🟡** (uzupełnij, powtórz triage).

### Krok 2 — skan obszarów ryzyka (3–5 min)

Przejdź kolejno: odpowiedzialność (cap/wyłączenia/wina umyślna) → prawa
autorskie → poufność/NDA → wypowiedzenie/exit → kary umowne → RODO → cesja →
forum sporów → klauzule zmian (asymetria) → wynagrodzenie/terminy.

Pierwsza flaga 🔴 → kategoria 🔴. Brak 🔴, jakikolwiek 🟡 → kategoria 🟡. Brak
obu → 🟢.

### Krok 3 — notatka triage

```
TRIAGE: 🟢/🟡/🔴

Klauzule znaczące:
- § X — [krótki opis sygnału]

Rekomendacja:
[🟢] Można podpisać. Uwaga opcjonalna: [...]
[🟡] Wymaga analizy przed podpisaniem. Punkty do omówienia: [...]
[🔴] Nie podpisywać bez negocjacji. Punkty blokujące: [...]
```

### Krok 4 (dla 🟡/🔴) — przekazanie do pełnej analizy

Następny krok: pełna analiza (Moduł A–F, `mod-core-checklist.md`, skalowana
wg wartości umowy jak w FAZA 0 SKILL.md), ewentualnie
`workflows/ocena-drugiej-strony.md` przed negocjacją wysokostawkową. Triage
nie zastępuje tego — jest pierwszym filtrem.

## Kiedy używać triage

- NDA standardowe (mutual/one-way) od typowych kontrahentów,
- aneksy techniczne (rozliczenia, zmiany SLA, dodanie modułu),
- proste umowy usługowe niskiej wartości,
- pierwszy filtr przy dużej liczbie dokumentów wpływających do oceny,
- decyzja klienta „czy w ogóle czytać dalej, czy odrzucić".

**Kiedy NIE używać triage — od razu pełna analiza (F.1):**
- wartość umowy > 100 000 PLN (już objęte obowiązkowym F.1 w FAZA 0 SKILL.md),
- transakcje M&A (routing `mod-MA-transakcje.md`),
- umowa o pracę / B2B z elementami kontroli — ryzyko reklasyfikacji
  (routing `b2b-podwykonawcze.md` G.1/G.1B),
- dokumenty wpływające na strukturę kapitałową/korporacyjną klienta
  (routing `mod-FA-founders-dokumenty-zalozycielskie.md`),
- klient sygnalizuje wprost „to jest dla nas ważne, sprawdź dokładnie".

## Powiązania

- `mod-core-checklist.md` Moduł A–F — pełna analiza, następny krok dla 🟡/🔴.
- `workflows/ocena-drugiej-strony.md` — po triage 🟡/🔴 w negocjacji wysokostawkowej.
- SKILL.md, sekcja „ZASADY FUNDAMENTALNE" i FAZA 0 — hard gate i skalowanie
  wg wartości, które triage uzupełnia, nie zastępuje.
- `mod-shared-fallback-library.md` — do porównania klauzul napotkanych podczas
  skanu z wariantami A/B/C/D.

## Zastrzeżenie końcowe

Triage jest narzędziem operacyjnym, nie produktem rynkowym ani usługą
doradczą. Wynik nie zastępuje pełnej analizy prawnej. Ostateczna decyzja co
do podpisania dokumentu należy do klienta, po konsultacji z prawnikiem
prowadzącym sprawę.
