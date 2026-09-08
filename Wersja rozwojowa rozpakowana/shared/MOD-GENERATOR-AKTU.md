# MOD-GENERATOR-AKTU — procedura budowy modułu dla aktu prawnego

> **Plik:** `shared/MOD-GENERATOR-AKTU.md`
> **Wersja:** 1.0 (2026-08-23)
> **Status:** KANONICZNY — obowiązkowa ścieżka tworzenia KAŻDEGO nowego modułu
> aktu prawnego oraz uzupełniania luk rozdziałowych w module istniejącym.
> **Utworzony:** przy fladze F-108 (benchmark listy MS), jako brakujące
> ogniwo między „wiem, że jest luka" a „mam moduł".

## Czym ten plik jest, a czym nie jest

`shared/MODULE-STANDARD-POLISH-LAW.md` mówi **JAK MA WYGLĄDAĆ** gotowy moduł
(13 sekcji, format odpowiedzi, quality gate). Ten plik mówi **JAK GO ZBUDOWAĆ**
— w jakiej kolejności, z jakich źródeł, z jaką bramką na każdym etapie.

⛔ Nie powiela struktury modułu. Przy kroku G-5 odsyła do MODULE-STANDARD
i to tamten plik pozostaje jedynym kanonicznym opisem struktury.

## ZASADA NACZELNA

> ⛔ Moduł buduje się **od struktury aktu, nie od pytania użytkownika**.
> Moduł zbudowany wokół jednego pytania pokrywa jeden artykuł i deklaruje
> pokrycie całego aktu. To jest udokumentowany błąd systemowy — precedens KSH
> (`dr-02/MAPA-POKRYCIA.md`: status „✅ OK" przy ~14 z ~600 artykułów).
> Punktem wyjścia jest zawsze spis treści aktu.

---

## G-1 — METRYKA AKTU (bramka wejściowa)

```
Ustal i UDOKUMENTUJ, zanim napiszesz jedno zdanie treści:
  □ pełny tytuł, data uchwalenia
  □ numer i data AKTUALNEGO tekstu jednolitego
  □ nowelizacje PO tekście jednolitym + ich vacatio legis
  □ status obowiązywania

Procedura: shared/PRAWO-HARDGATE.md v2.5
  → POZIOM A (konektor MCP), gdy dostępny
  → POZIOM B: sekwencja DWUKROKOWA B-1 (web_search wprowadza URL RZĘDU 1
    do kontekstu) → B-2 (web_fetch na URL Z WYNIKU, kopiowany dosłownie)
  → blokada robots na B-2 → 🟨 KOTWICA URZĘDOWA, warunki łączne K-1…K-4

⛔ BRAMKA: metryka nieustalona → NIE BUDUJ MODUŁU. Zapisz pozycję jako
⬛ w mapie pokrycia właściwego DR i przejdź do następnej. Moduł zbudowany
na nieustalonej metryce zatruwa wszystko, co się na nim oprze.
```

## G-2 — DECYZJA O FORMIE (nowy moduł / rozszerzenie / moduł łączony)

```
□ Czy akt ma już moduł?              TAK → to jest UZUPEŁNIENIE LUKI, idź G-3
□ Czy akt jest stosowany operacyjnie ZAWSZE razem z innym aktem, który
  moduł już ma (np. Prawo spółdzielcze + o spółdzielniach mieszkaniowych +
  o własności lokali; ustawy o samorządzie gminnym/powiatowym/województwa)?
    TAK → MODUŁ ŁĄCZONY: dopisz sekcję do istniejącego modułu,
          NIE twórz nowego pliku. Zarejestruj akt osobnym wierszem w
          MAPA-AKTOW ze wskazaniem modułu wspólnego.
    NIE → NOWY MODUŁ, idź G-3

⛔ Kryterium rozstrzygające NIE jest pokrewieństwo tematyczne, tylko
   wspólne stosowanie w jednej sprawie. Prawo upadłościowe i
   restrukturyzacyjne są pokrewne, a mają osobne moduły — bo prowadzi się
   albo jedno postępowanie, albo drugie.

⛔ PRÓG DŁUGOŚCI (ZASADA 13): moduł zbliżający się do 1000 linii dzieli się
   WYPRZEDZAJĄCO, wg jednostek redakcyjnych aktu (dział/tytuł), treść
   przenoszona verbatim, 0 linii utraconych.
```

## G-3 — MAPA STRUKTURY AKTU (rdzeń procedury)

```
Odczytaj SPIS TREŚCI aktu — nie treść przepisów, sam szkielet:
  księgi → tytuły → działy → rozdziały → zakresy artykułów

Zbuduj tabelę w formacie F-83 (wzór: dr-02/MAPA-POKRYCIA.md):

  | Dział | Materia | Art. | Status | Moduł / uwaga |
  |---|---|---|---|---|
  | I | ... | 1–21 | 🔴 | — |

  🟢 pełne · 🟡 częściowe · 🔴 brak · ⚪ nie dotyczy (uchylone/techniczne)

⛔ Ta tabela powstaje PRZED treścią i jest planem pracy. Bez niej nie da się
   odpowiedzieć na pytanie „ile z tego aktu jest w systemie" — a to jedyne
   pytanie, na które mapa pokrycia ma odpowiadać.
⛔ Struktura aktu też podlega weryfikacji: numeracja zmienia się przy
   nowelizacjach (jednostki dodawane z indeksem, uchylane). Nie odtwarzaj
   spisu treści z pamięci.
```

## G-4 — PRIORYTETYZACJA JEDNOSTEK

```
Nie opracowuj aktu po kolei od art. 1. Kolejność wg wagi praktycznej:
  1. jednostki, na których system JUŻ operuje bez podstawy merytorycznej
     (najgroźniejsze — engine korzysta z instytucji, której nie ma w treści;
      precedens: F-65, granice apelacji w KPC)
  2. jednostki wywoływane najczęściej w praktyce kancelaryjnej
  3. jednostki z niedawnymi nowelizacjami
  4. reszta

Zakres jednej transzy: 1–2 działy. Zamykaj transzę wpisem, nie planem.
```

## G-5 — BUDOWA TREŚCI

```
Struktura: shared/MODULE-STANDARD-POLISH-LAW.md (13 sekcji) — kanoniczna,
nie powielaj jej tutaj ani w module; importuj.
Poziom docelowy: ≥ B wg shared/POLISH-LAW-COMPLETENESS-MATRIX.md,
docelowo A-funkcjonalny.

Na KAŻDY przepis w module:
  □ pełne oznaczenie z metryki G-1
  □ znacznik z ZAMKNIĘTEJ hierarchii czterech:
    ✅ [VER] · 🟨 [KOTWICA-URZĘDOWA] · ⚠️ [NIEWERYFIKOWANE] · ⬛ [DO UZUPEŁNIENIA]
  □ kategoria RZĘDU źródła (shared/HIERARCHIA-ZRODEL.md)
  □ lokalizacja w źródle (PRAWO-HARDGATE KROK 5A)

⛔ ZAKAZ tworzenia piątej etykiety. Sytuacja nieopisana hierarchią to ⚠️,
   nie nowy status. Nazwanie pamięci modelu szczeblem źródła jest
   naruszeniem hard gate tej samej wagi co halucynacja przepisu.
⛔ Luka zostaje luką. Jednostka nieopracowana → ⬛ w mapie i w module.
   Uczciwe ⬛ zatrzyma się na HYBRID-VALIDATION; udane pozorowanie ✅ — nie.
```

## G-6 — BRAMKI SZCZEGÓLNE (sprawdź, które dotyczą tego aktu)

```
□ Akt zawiera przepisy KARNE/wykroczeniowe, a moduł powstaje w DR niekarnym?
  → shared/DOMAIN-LOCK.md. Przepis karny opisuje się w module macierzystym
    WYŁĄCZNIE jako odesłanie do dr-03; kwalifikacja nie powstaje tutaj.
□ Akt zawiera STAWKI, ODSETKI, PROGI, WALORYZACJĘ?
  → shared/RATE-COMPLETENESS.md. Moduł musi zawierać TABELĘ SZEREGU
    (od–do–wartość–podstawa–znacznik), nigdy jednej liczby.
    ⭐ To jest wymóg twardy dla poz. 46 wykazu F-108 (transakcje handlowe)
      i dla każdej ustawy z opłatami/rekompensatami.
□ Akt ma odesłania do prawa UE?        → dr-14 + EUR-Lex (RZĄD 1)
□ Akt reguluje TERMINY procesowe?      → shared/TERM-CALC.md, shared/terminy.md
□ Akt tworzy instytucję po 2024?       → shared/TEMPORAL-LAW-CHECK.md
□ Moduł ma cytować orzecznictwo?       → PRAWO-HARDGATE, procedura orzeczeń
                                          + BRAMKA WTÓRNE-ŹRÓDŁO-STOP
```

## G-7 — REJESTRACJA (REGUŁA 3 — trzy miejsca, nie jedno)

```
Moduł, który istnieje na dysku i nie jest zarejestrowany, jest niewidoczny
dla routera — czyli nie istnieje operacyjnie. Udokumentowany, powtarzalny
błąd systemu (m.in. mod-KRO-przysposobienie, mod-PrRestr-dzial-V).

□ dr-XX/SKILL.md                     — wpis w spisie modułów
□ dr-XX/MAPA-AKTOW.md                — wiersz akt → moduł → status
□ prawo-polskie-v2/ROUTING-MAP.md    — wpis routingowy
□ dr-XX/MAPA-POKRYCIA.md             — tabela z G-3 z uaktualnionymi statusami
   (plik nie istnieje w tym DR → utwórz wg formatu F-83)
□ audyt-systemu-v4/references/AUDIT-JOURNAL.md — wpis AUDYT-RRRR-MM-DD
□ flaga w WARN-OTWARTE.md — skróć do tego, CO ZOSTAŁO; opis wykonanego
   idzie WYŁĄCZNIE do dziennika (ZASADA 10)
```

## G-8 — QUALITY GATE (przed uznaniem modułu za gotowy)

```
□ Każdy przepis ma znacznik z hierarchii czterech — bez wyjątku
□ Żadnej etykiety spoza hierarchii
□ Mapa z G-3 uaktualniona: statusy odpowiadają FAKTYCZNEJ treści,
  nie zamiarowi (test: wskaż palcem, gdzie w module jest dział oznaczony 🟢)
□ Luki jawne jako ⬛, nie zamaskowane opisem ogólnym
□ DOMAIN-LOCK: zero przepisów spoza dziedziny modułu bez odesłania
□ RATE-COMPLETENESS: każda stawka jako szereg, jeśli zmienna w czasie
□ Rejestracja w 4 rejestrach (G-7) wykonana, nie zaplanowana
□ Długość < 1000 linii albo podział wykonany (ZASADA 13)
□ Deklarowany poziom (A/B/C) odpowiada rzeczywistości —
  ⛔ zawyżenie poziomu jest gorsze niż niski poziom uczciwie oznaczony
```

---

## Skrócona ścieżka wywołania

```
Luka wykryta (F-108 / raport pokrycia / pytanie użytkownika bez pokrycia)
   → G-1 metryka        ⛔ brak → STOP, wpisz ⬛ do mapy
   → G-2 forma          (nowy / rozszerzenie / łączony)
   → G-3 mapa struktury ⭐ przed treścią
   → G-4 priorytety
   → G-5 treść          (struktura: MODULE-STANDARD)
   → G-6 bramki szczególne
   → G-7 rejestracja w 4 miejscach
   → G-8 quality gate
```
