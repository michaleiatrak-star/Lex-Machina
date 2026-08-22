# CHANGELOG — pisma-procesowe-v3

> Pełna historia napraw i zmian wersji. Wyniesiona z SKILL.md 2026-07-12
> (runda 2 — redukcja kosztu kontekstu) — treść skopiowana 1:1, bez zmian,
> żeby nie tracić żadnej informacji z historii audytów. Wczytuj TYLKO gdy
> potrzebujesz historii konkretnej naprawy (np. przy audycie, przy pytaniu
> 'dlaczego to tak działa', przy regresji). Nie jest potrzebna w normalnym
> toku pracy nad pismem.

## CHANGELOG

**5.7 (2026-06-26) — NAPRAWA KRYTYCZNA: MOD-MACIERZ-DOWOD-TEZA przeniesiona z W2.1 do W1.2c + WBUDOWANIE W PISMO**

Root cause (sprawa VII P 94/25, sesja 2026-06-26):
Dwa niezależne błędy powodowały, że tabela D×T nigdy nie trafiała do pisma:

BŁĄD 1 — Zła pozycja w pipeline:
  Macierz była wczytywana w W2.1 (przed redakcją pisma).
  Własny nagłówek modułu mówi: "Pozycja: po W1.2a, przed W1.3".
  Skutek: pismo redagowane bez wiedzy o lukach i wielofunkcyjności dowodów;
  mapa przesłanka→dowód (W1.3) budowana bez gotowych wyników MT.

BŁĄD 2 — Brak instrukcji wbudowania w pismo:
  Macierz traktowana jako wewnętrzny krok roboczy, nie jako sekcja pisma.
  Skutek: tabela D×T istniała tylko w pamięci modelu; do dokumentu trafiała
  lista dowodów en bloc bez powiązania z tezami (niezgodnie z art. 227, 232 k.p.c.).

Naprawy:
  1. KROK MT dodany w W1.2c-PRE po KROK ŁD — sekwencja MT1→MT2→MT3→MT4→MT5.
  2. Cztery nowe zakazy na końcu bloku W1.2c (w tym: ZAKAZ W1.3 bez macierzy,
     ZAKAZ wniosków dowodowych jako lista en bloc).
  3. Klauzula ⛔ WBUDOWANIE W PISMO: tabela D×T z MT4 WCHODZI do treści pisma
     jako sekcja widoczna dla sądu; wnioski dowodowe formułowane PER TEZA.
  4. Duplikat view() w W2.1 zastąpiony przypomnieniem (macierz gotowa z W1.2c)
     z instrukcjami użycia w redakcji (PER TEZA, MT5-MANDATE-ALL-EVIDENCE).

**5.9 (2026-06-27) — NAPRAWA: FSL-D (Fact-Source-Lock Dokumentów) — per-teza weryfikacja z zakazem cytowania z pamięci**

Root cause (sprawa VII P 94/25, sesja 2026-06-27):
Po SD-VER = KOMPLET (wszystkie pliki odczytane) macierz D×T była budowana
z pamięci modelu, nie z per-teza przeszukania SD-FAKTY. Pliki o mylących
nazwach (Szef.odt → wiadomości RCS z gotowością, Zatrudnienie.odt → WhatsApp
z kartami pobytu, Pracownicy13.08.2024.xlsx → status powoda jako aktywny
pracownik HPG) były pomijane w skanowaniu tez bo „intuicyjnie nie pasowały".
Skutek: teza gotowości do pracy — 1 dowód zamiast 4. Teza pracodawcy
faktycznego — argumenty ogólne zamiast dowodów dokumentowych.

Naprawa:
1. Nowy plik: `shared/MOD-FSL-DOKUMENTY.md` (v1.0.0)
   Hard gate między SD-VER a macierzą D×T. Per każdą tezę: przeszukanie
   WSZYSTKICH D[id] (niezależnie od nazwy pliku) z zakazem cytowania z pamięci.
   Każde twierdzenie atomowe = D[id] + lokalizacja (str/zakładka/obraz/godz).
   Luki 🔴/🟠 = blokada .docx lub żądanie ewentualne.
2. W1.2c-PRE: dodano sekcję W1.2c-FSL-D z KROK FSL-D przed KROK KD.

---

**5.10 (2026-07-05b) — NAPRAWA: hard gate W3.2 orzeczenia — gradient TREŚĆ zamiast samej ISTNIENIA (NSA I FZ 104/26)**

Root cause (postanowienie NSA z 23.06.2026, sygn. I FZ 104/26): pełnomocnik
powołał w zażaleniu postanowienia NSA jako poparcie tezy o przesłankach
wstrzymania wykonania decyzji — NSA ustalił, że powołane orzeczenia zapadły
w innych datach niż podane i żadne nie dotyczyło w ogóle tej instytucji
procesowej; ocenił to jako "bezrefleksyjne korzystanie z AI" i brak
profesjonalizmu. Diagnoza w tym systemie: hard gate W3 w SKILL.md wymagał
tylko "sygnatury + URL" (poziom ISTNIENIE) dla każdego ⚠️On, a KROK 2 w
W3.2 (`references/W3-WERYFIKACJA.md`) nie wymuszał jawnie weryfikacji
DOKŁADNEJ DATY niezależnie od sygnatury.

Naprawa:
1. Hard gate W3 (SKILL.md): ⚠️On wymaga teraz statusu GRAD z
   `shared/WERYFIKACJA-SLAD.md` (GRAD-1..4), nie samego URL — 🔴/kotwica
   nierozwiązana = usunięcie powołania, nie "naprawa" innym pinpointem.
2. W3.2 KROK 1: kanał strukturalny (SYGNATURY.md FOUND/NOT_FOUND/AMBIGUOUS/
   OUT_OF_SCOPE) jako pierwszy wybór, web_search jako fallback.
3. W3.2 KROK 2: jawna weryfikacja DATY WYDANIA niezależnie od sygnatury i
   tezy — rozbieżność daty = traktuj jak NOT_FOUND dla tej pary (K-SYG-2).
4. W3.2 KROK 3a (ZAKRES-STOSOWANIA): dodano pytanie wprost o TĘ SAMĄ
   INSTYTUCJĘ PROCESOWĄ (nie tylko "ten sam przepis") — zmapowano status
   ZAKRES-OK/WARN-ZAKRES/ZAKAZ-ZAKRES na gradient 🟢/🟠/🔴 dla spójności
   z audit-bundle (bez duplikowania logiki — patrz shared/WERYFIKACJA-SLAD.md
   GRAD-3b).
5. W3.2 KROK 6 (nowy): zwroty "ugruntowana/utrwalona linia orzecznicza"
   wymagają uruchomienia Zasady 10 (BILANS) z `orzeczenia-sadowe-v2` przed
   W3.6a — twierdzenie o całej linii, nie o pojedynczym wyroku.
6. `shared/DISCLAIMER.md` v2.1: nowy WARIANT PISMO SĄDOWE — jawne
   przypomnienie o niedelegowalnym obowiązku pełnomocnika do samodzielnej
   weryfikacji przed podpisaniem, dołączane po wariancie PRAWNIK dla
   każdego projektu pisma.
7. `shared/WERYFIKACJA-SLAD.md` v1.2: GRAD-1 zamyka lukę "gołe powołanie
   na poparcie tezy = tylko ISTNIENIE" → teraz minimum TREŚĆ; nowy GRAD-3b
   (GUARD INSTYTUCJA/PRZEDMIOT) jako wersja ogólna dla skilli bez własnej
   kontroli zakresu.

Plik: `audyt-systemu-v4/references/AUDIT-JOURNAL.md` → AUDYT-2026-07-05b.
   ⛔ ZAKAZ-FSL-D: nie przystępuj do macierzy bez FSL-D-REPORT.
3. Trzy poziomy gwarancji (L1 strony → L2 tezy → L3 przepisy) kompletne.

**5.8 (2026-06-26) — NAPRAWA: format sądowy tabeli dowód×teza — zakaz symboli wewnętrznych**

Root cause: tabela D×T generowana z symbolami wewnętrznymi pipeline'u (●●●[K], ★★★, RK)
nieczytelna dla sędziego. Symbole te mają sens wyłącznie w kontekście MT1–MT5
(wewnętrzna klasyfikacja modelu), ale nie niosą żadnej wartości procesowej dla sądu.

Naprawa w KROK MT (W1.2c):
- Dodana klauzula ⛔ FORMAT SĄDOWY — ZAKAZ SYMBOLI
- Tabela w piśmie: wyłącznie kolumny Lp. | Dowód | Lokalizacja w aktach |
  Roszczenie | Na okoliczność
- Obowiązkowe: strona protokołu i godzina dla zeznań; numer załącznika dla dokumentów
- Symbole ●/★/[K]/[W]/RK — tylko do użytku wewnętrznego modelu, nie trafiają do pisma
