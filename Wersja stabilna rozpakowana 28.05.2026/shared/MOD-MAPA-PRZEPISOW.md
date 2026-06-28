# MOD-MAPA-PRZEPISOW — mapowanie wyników analizy na przepisy prawne

> Status: shared canonical. Wywoływany w KROK 4a (`analizator-dowodow-v3`),
> PO klasyfikacji aspektów (`MOD-PRIORYTETY-ASPEKTOW.md`) i PO ewentualnym
> wykonaniu metod badawczych (`MOD-METODY-BADAWCZE.md`), PRZED przekazaniem
> wyniku do `MOD-WARIANTY-POZWU.md` (W1.2b).
>
> ⛔ HARD GATE: ten moduł operuje WYŁĄCZNIE na oznaczeniach przepisu w formie
> `⚠️ [nazwa aktu] art. [X] (NIEWERYFIKOWANE)` — identycznie jak W1.4
> pisma-procesowe-v3. NIE wywołuje ISAP dla każdego kandydata (patrz §4).
> Weryfikacja Dz.U./aktualności odbywa się WYŁĄCZNIE gdy przepis wejdzie do
> W1.4/W2.3 pisma-procesowe-v3 (W3 weryfikuje jak dotychczas) lub na wyraźne
> żądanie użytkownika (delegacja do `analizator-przepisow-v2`).

---

## 1. Cel modułu

Dla każdego aspektu (z `MOD-PRIORYTETY-ASPEKTOW.md`) i — jeśli wykonano —
wyniku metody badawczej (`MOD-METODY-BADAWCZE.md`), moduł:

1. Wskazuje 1-3 przepisy KANDYDUJĄCE jako podstawę prawną (§2),
2. Ocenia GŁĘBOKOŚĆ POWIĄZANIA między wynikiem i przepisem (§3),
3. Ocenia ZGODNOŚĆ TEZY wynikającej z wyniku z hipotezą normy (§3),
4. Pozwala użytkownikowi dopytać o INNY przepis — system wykonuje §3 dla
   wskazanego przepisu identycznie jak dla kandydatów automatycznych (§5).

Wynik jest sekcją TEKSTOWĄ w KROK 4a (nie osobny widget) — dołączany do
prezentacji checklisty, PRZED przejściem do W1.2b. Wpływa na to, JAK
budowane są warianty pozwu: aspekt z tezą SPRZECZNĄ względem kandydującego
przepisu sygnalizuje, że wariant oparty na tym przepisie będzie słaby —
`MOD-WARIANTY-POZWU` może to uwzględnić w polu "Ryzyko" karty wariantu.

---

## 2. KROK 1 — Kandydaci automatyczni

```
DLA KAŻDEGO aspektu z aspekty_glowne (priorytet) i — na żądanie/jeśli czas
pozwala — aspekty_poboczne:

  WEJŚCIE: opis aspektu + dziedzina (z MX, analizator-dowodow-v3 F1) +
           wynik metody badawczej (jeśli wykonano — wstepna_obserwacja
           z modelu jednoetapowego, lub wynik PROCEDURY GŁĘBOKIEJ z modelu
           dwuetapowego, MOD-METODY-BADAWCZE §1a)

  WYJŚCIE: 1-3 przepisy kandydujące, format:
           "⚠️ [nazwa aktu] art. [X] §[Y] (NIEWERYFIKOWANE)"

  ŹRÓDŁO KANDYDATÓW:
    - jeśli aspekt jest powiązany z ŻĄDANIEM (powiazane_zadanie != null,
      MOD-PRIORYTETY-ASPEKTOW §3.1) — przepisy z W1.4 listy roboczej
      pisma-procesowe-v3, jeśli już istnieje robocza lista dla tej sprawy,
    - w przeciwnym razie — przepisy typowe dla dziedziny (MX) + charakteru
      aspektu, jako lista robocza ⚠️ (identyczna logika co W1.4 — "lista
      robocza przepisów", nie ostateczna kwalifikacja).

  LIMIT: maks. 3 kandydatów per aspekt — jeśli więcej możliwych, wybierz
  3 najbardziej swoiste (specific) względem opisu aspektu, nie najogólniejsze
  (np. dla roszczenia o nadgodziny: art. regulujący czas pracy/nadgodziny
  PRZED art. 6 KC o ciężarze dowodu — ten drugi jako KONTEKSTOWY, patrz §3).
```

---

## 3. KROK 2-3 — Głębokość powiązania i zgodność tezy

### 3.1 Skala głębokości powiązania

```
BEZPOŚREDNIE — wynik analizy WPROST odpowiada przesłance przepisu.
  Przykład: MET-DQ wyliczyło kwotę X za nadgodziny → przepis regulujący
  wynagrodzenie za pracę w godzinach nadliczbowych. Wynik JEST elementem
  stanu faktycznego, który przepis normuje.

POŚREDNIE — wynik wzmacnia/osłabia ocenę przesłanki, ale nie jest samą
  przesłanką.
  Przykład: MET-CA wykazało zmianę narracji strony przeciwnej między
  pismami → przepis dot. roszczenia głównego. Wynik wpływa na WIARYGODNOŚĆ
  twierdzeń strony co do przesłanki, nie jest elementem przesłanki.

KONTEKSTOWE — przepis daje ramę interpretacyjną, ale wynik nie odnosi się
  do konkretnej przesłanki tego przepisu.
  Przykład: MET-CASE (kontekst relacyjny, historia konfliktu) → przepis
  ogólny o "całokształcie okoliczności" lub o ciężarze dowodu (art. 6 KC).
  Przepis jest relewantny dla SPOSOBU OCENY sprawy, nie dla TEGO konkretnego
  wyniku.
```

### 3.2 Skala zgodności tezy

```
ZGODNA — wynik analizy WSKAZUJE, że przesłanki kandydującego przepisu są
  SPEŁNIONE (teza wynikająca z analizy wsparłaby roszczenie/argument oparty
  na tym przepisie).

SPRZECZNA — wynik analizy WSKAZUJE, że przesłanki NIE są spełnione lub że
  wynik PRZECZY tezie, którą przepis miałby wspierać (np. MET-ACH wskazało,
  że hipoteza odpowiadająca temu przepisowi jest NAJSŁABSZA w macierzy).

NIEROZSTRZYGNIĘTA — wynik analizy NIE PRZESĄDZA — przepis jest relewantny,
  ale dostępny materiał nie pozwala ocenić spełnienia przesłanek (typowo:
  głębokość KONTEKSTOWE, lub głębokość POŚREDNIE z brakiem dowodu
  rozstrzygającego).
```

### 3.3 Reguły oceny — zapobieganie nadinterpretacji

```
- Ocena głębokości/zgodności jest HIPOTEZĄ ANALITYCZNĄ, nie ustaleniem
  prawnym — oznaczana jako `[MAPA-PRZEPISOW]`, analogicznie do
  `[ANALIZA-MET-XXX]` (MOD-METODY-BADAWCZE §7) i `[H-ŚLEDCZA]`
  (analizator-dowodow-v3).
- SPRZECZNA nie oznacza "ten przepis jest błędny" — oznacza "wynik TEJ
  analizy nie wspiera tezy opartej na TYM przepisie". Inny wynik/inny
  aspekt może wspierać ten sam przepis.
- Jeśli wynik metody badawczej jest z modelu DWUETAPOWEGO i użytkownik
  wybrał "Pomiń" (MOD-METODY-BADAWCZE §1a) — mapowanie dla tego aspektu
  bazuje TYLKO na opisie aspektu (bez wyniku metody), głębokość ograniczona
  do KONTEKSTOWE/POŚREDNIE (BEZPOŚREDNIE wymaga wyniku, nie tylko opisu).
- NIEROZSTRZYGNIĘTA jest wynikiem DOMYŚLNYM gdy materiał niejednoznaczny —
  nie naciskaj na ZGODNA/SPRZECZNA bez podstawy.
```

---

## 4. Format wyniku — sekcja w KROK 4a

```
PODSTAWY PRAWNE — [opis aspektu]:

  ⚠️ [nazwa aktu] art. [X] (NIEWERYFIKOWANE)
    Głębokość: BEZPOŚREDNIE | Zgodność tezy: ZGODNA
    [1 zdanie uzasadnienia — konkretne, z odwołaniem do wyniku analizy]

  ⚠️ [nazwa aktu] art. [Y] (NIEWERYFIKOWANE)
    Głębokość: KONTEKSTOWE | Zgodność tezy: NIEROZSTRZYGNIĘTA
    [1 zdanie uzasadnienia]

  [Chcesz sprawdzić powiązanie z innym przepisem? Podaj artykuł/akt.]
```

Sekcja renderowana jako TEKST w odpowiedzi (nie widget) — bezpośrednio po
checkliście priorytetów (MOD-PRIORYTETY-ASPEKTOW §3), przed checkpointem
przejścia do W1.2b.

Dla aspektów `aspekty_poboczne` — sekcja generowana TYLKO jeśli mapowanie
dla aspektu głównego wskazuje SPRZECZNA lub NIEROZSTRZYGNIĘTA (sygnał, że
aspekt poboczny może być potrzebny jako wzmocnienie alternatywne) — w
przeciwnym razie pomiń, by nie przeciążać checklisty.

---

## 5. KROK 4 — Dopytanie o inny przepis

```
WYZWALACZ: użytkownik podaje artykuł/akt (np. "a co z art. 415 KC?",
  "sprawdź pod kątem art. 300 KK").

WYKONANIE:
  1. Oznacz podany przepis jako ⚠️ [nazwa aktu] art. [X] (NIEWERYFIKOWANE)
     — bez weryfikacji ISAP w tym kroku.
  2. Wykonaj §3 (głębokość + zgodność) DLA TEGO przepisu, względem tego
     samego wyniku analizy/aspektu, którego dotyczyło pytanie (jeśli
     kontekst niejasny — zapytaj którego aspektu dotyczy, jedno pytanie).
  3. Zwróć wynik w formacie §4, jako kontynuację — NIE jako nowy KROK 4a od
     zera.

GRANICA: jeśli użytkownik pyta o przepis z INNEJ dziedziny niż dziedzina
  sprawy (MX) — wykonaj §3 normalnie (głębokość może wyjść KONTEKSTOWE lub
  niska), ale NIE odmawiaj — ocena "ten przepis nie ma związku z wynikiem"
  jest również użyteczną odpowiedzią (głębokość: brak powiązania —
  oznaczenie dodatkowe, gdy żaden z poziomów §3.1 nie ma zastosowania).

DELEGACJA DO ANALIZY GŁĘBOKIEJ: jeśli użytkownik PO otrzymaniu mapowania
  prosi o "pełną analizę tego przepisu" / "przesłanki" / "orzecznictwo" —
  → view /mnt/skills/user/analizator-przepisow-v2/SKILL.md
  (MOD-MAPA-PRZEPISOW nie zastępuje analizator-przepisow-v2 — jest punktem
  wejścia, który może do niego eskalować).
```

---

## 6. Przekazanie do MOD-WARIANTY-POZWU

Wynik mapowania (per aspekt, lista kandydatów z głębokością/zgodnością)
dołączany jest do danych wejściowych W1.2b. `MOD-WARIANTY-POZWU` (§2.2,
pole "Podstawa") wykorzystuje to jako:

```
- jeśli aspekt_glowne ma kandydata z głębokość=BEZPOŚREDNIE i
  zgodność=ZGODNA → ten przepis jako podstawa wariantu (⚠️ do W1.4)
- jeśli WSZYSCY kandydaci aspektu_glowne mają zgodność=SPRZECZNA →
  pole "Ryzyko" karty wariantu opartego na tym aspekcie podnosi się
  (np. z P2 na P1) — sygnalizacja, że wariant wymaga albo innej podstawy
  (sprawdzonej przez KROK 4, §5) albo dodatkowych dowodów
- jeśli aspekt_glowne ma ≥2 kandydatów z głębokość=BEZPOŚREDNIE i różną
  zgodność (np. jeden ZGODNA, drugi SPRZECZNA) → MOŻE to uzasadniać
  "Wariant alternatywny — podstawa [X] zamiast [Y]" (MOD-WARIANTY-POZWU §2.3)
```

Format danych przekazywanych do W1.2b:

```json
{
  "mapa_przepisow": {
    "ASP-1": [
      {"przepis": "⚠️ art. 151¹ KP (NIEWERYFIKOWANE)", "glebokosc": "BEZPOSREDNIE", "zgodnosc": "ZGODNA"},
      {"przepis": "⚠️ art. 6 KC (NIEWERYFIKOWANE)", "glebokosc": "KONTEKSTOWE", "zgodnosc": "NIEROZSTRZYGNIĘTA"}
    ]
  }
}
```

---

## 7. Zapis do historii strategii

Mapa przepisów per aspekt zapisywana jest w `MOD-HISTORIA-STRATEGII.md` §2
jako rozszerzenie pola `priorytety`:

```json
{
  "priorytety": {
    "aspekty_glowne": ["ASP-1"],
    "...": "...",
    "mapa_przepisow": {
      "ASP-1": [{"przepis": "...", "glebokosc": "...", "zgodnosc": "..."}]
    }
  }
}
```

Pozwala to w zakładce "Historia strategii" (raport-sytuacyjny-v2) porównać,
czy między wersjami zmieniła się ocena zgodności tezy dla danego przepisu
(np. po dostarczeniu nowych dokumentów NIEROZSTRZYGNIĘTA → ZGODNA).

---

## 8. Self-check przed KROK 4a (rozszerzenie)

```
□ Czy dla każdego aspektu_glowne wskazano 1-3 kandydatów (§2), nie więcej?
□ Czy każdy kandydat ma ocenę głębokości (§3.1) I zgodności tezy (§3.2)?
□ Czy oceny SPRZECZNA/ZGODNA mają konkretne uzasadnienie (1 zdanie,
  odwołanie do wyniku analizy), nie ogólnik?
□ Czy żaden przepis nie został podany z numerem Dz.U. lub treścią z pamięci
  — wszystkie jako ⚠️ [nazwa aktu] art. [X] (NIEWERYFIKOWANE)?
□ Czy sekcja dla aspekty_poboczne wygenerowana TYLKO gdy uzasadniona
  (SPRZECZNA/NIEROZSTRZYGNIĘTA aspektu głównego)?
□ Czy wynik (mapa_przepisow) przekazany do W1.2b i zapisany w historii
  strategii (§7)?
Którykolwiek = NIE → uzupełnij przed prezentacją sekcji.
```
