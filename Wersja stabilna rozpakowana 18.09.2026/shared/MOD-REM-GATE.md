# MOD-REM-GATE — Bramka środka naprawczego i pokrycia (REM-GATE)

> **Plik kanoniczny:** `shared/MOD-REM-GATE.md`
> **Wersja:** 1.2 | Utworzony: 2026-09-05 (F-161) · REM-0 dodany 2026-09-05b
> (F-164) · Przepisany na reguły uniwersalne 2026-09-05e (F-168) — usunięto
> etykiety kazusów testowych i punktację zdradzającą rozstrzygnięcia.
> **Wywołują:** `prawny-router-v3` (BRAMKA ŚRODKA, po CN-GATE, przed KROK 4),
> skille analityczne i raportowe
> **Charakter:** ⛔ BLOKUJĄCA przed oddaniem analizy, raportu i pisma.
> **Nie jest** bramką weryfikacyjną ani merytoryczną. Nie ocenia, czy
> rozstrzygnięcie jest trafne — sprawdza, czy w ogóle zostało skonstruowane.

---

## 0. DLACZEGO TEN MODUŁ NIE ZAWIERA NAZWANYCH PRZYKŁADÓW

> ⛔ Wcześniejsza wersja opisywała każdy wzorzec awarii konkretnym kazusem
> testowym i konkretną liczbą utraconych punktów. To pozwalało zrekonstruować
> rozstrzygnięcie danej sprawy z samej treści bramki (F-167/F-168). Wzorce
> poniżej są opisane jako klasy strukturalne, rozpoznawalne w dowolnej
> analizie prawnej, bez wskazania, której sprawy aktualnie dotyczą.

---

## 1. PROBLEM, KTÓRY TEN MODUŁ ZAMYKA

> ⛔ **Cały aparat weryfikacyjny optymalizuje pod „nie powołaj złego przepisu"
> i nic nie mówi o „nie zaniż środka naprawczego". Skutek jest mierzalny:
> rygor definicyjny wypiera konstrukcję.**

Trzy wzorce awarii, w postaci ogólnej:

**(A) Sieroce oddalenie.** Roszczenie, zarzut albo argument zostaje oddalony
na mocnej, poprawnie zweryfikowanej podstawie — i na tym analiza się kończy.
Im solidniejsze uzasadnienie oddalenia, tym łatwiej przeoczyć, że obszar
zadania obejmował też skonstruowanie tego, co ma nastąpić PO oddaleniu:
alternatywną podstawę prawną, inny reżim, środek zaradczy. Kompletność
uzasadnienia odmowy bywa mylona z kompletnością odpowiedzi na całe zadanie.

**(B) Non liquet jako wyjście awaryjne.** Aparat uczciwości (znaczniki
niepewności, zastrzeżenia, „nie badano w tej turze") jest wewnętrznie
nagradzany za rzetelność i w efekcie bywa nadużywany jako sposób zamknięcia
trudnego wątku bez jego rozstrzygnięcia. Deklaracja niezbadania **nie jest**
rozstrzygnięciem warunkowym — jest jego przeciwieństwem: przenosi ciężar
z powrotem na czytelnika, zamiast dać mu użyteczną odpowiedź na wypadek
każdego możliwego ustalenia faktycznego.

**(C) Znacznik źródła nadany bez próby pobrania.** Znacznik ostrzegawczy przy
powołaniu ([]) bywa nadawany na podstawie założenia, że dane źródło jest
trudne do zweryfikowania — bez faktycznej próby jego pobrania. Właściwa
przyczyna problemu nie leży w tym, że znacznik tłumi argument (to tylko
objaw) — leży w tym, że znacznik zastępuje próbę, której nie podjęto.
Zob. REM-0.

**(C-bis) Znacznik źródła tłumiący siłę argumentu.** Nawet gdy znacznik jest
uzasadniony (próba pobrania faktycznie zawiodła), w praktyce bywa mylnie
traktowany jako sygnał do skrócenia czy osłabienia argumentu. Materiały
o niższym statusie weryfikacyjnym (instrumenty niewiążące, źródła wtórne)
dostają wtedy traktowanie proporcjonalne do ŁATWOŚCI ich zweryfikowania,
a nie do ich WAGI w sprawie — co jest błędem kategorialnym: status źródła
i waga argumentu to dwie niezależne osie.

---

## 2. WYZWALACZ — MECHANICZNY

```
CZY ODDAJESZ ANALIZĘ, OPINIĘ, RAPORT ALBO PISMO?
  TAK → wykonaj REM-GATE.
```

Bramka odpala zawsze przed oddaniem. Polecenia „krótko" / „tylko odpowiedz"
NIE zwalniają. Przy jednej osi sporu i braku ⬛ blok ma dwie linie.

---

## 3. PROCEDURA — REM-0 … REM-4

### REM-0 — PRÓBA POBRANIA PRZED NADANIEM ZNACZNIKA

```
⛔ ZANIM oznaczysz powołanie ⚠️ [NIEWERYFIKOWANE] — SPRÓBUJ JE POBRAĆ.
   Znacznik jest dopuszczalny WYŁĄCZNIE po udokumentowanej porażce próby,
   nigdy w miejsce próby niepodjętej.
```

**Próba musi być DWUKANAŁOWA.** To nie jest ostrożność, tylko wynik pomiaru:
kanał kodu i kanał pobierania mają **różne listy dozwolonych domen**, więc
odmowa w jednym nie dowodzi niczego o drugim.

```
Kanał 1 — bash_tool/curl        (lista domen środowiska wykonawczego)
Kanał 2 — web_search → web_fetch (osobna ścieżka, inne ograniczenia)

⛔ HTTP 403 w kanale 1 NIE jest ustaleniem niedostępności.
   Dopiero porażka w OBU kanałach uprawnia do znacznika.
```

Przed orzeczeniem porażki sprawdź kształt żądania wg
`shared/DOSTEP-MASZYNOWY-API.md §1` (neutralny User-Agent, nagłówek Accept,
wariant z `www.` i bez). Przekierowanie między wariantami hosta bywa jedyną
przyczyną odmowy.

**Zapis obowiązkowy.** Porażka odnotowuje się z kanałem i kodem, nie ogólnikiem:

```
⚠️ [NIEWERYFIKOWANE — curl 403, web_fetch 403 (detekcja bota), data]
```

Sformułowania „brak dostępu", „źródło niedostępne", „nie udało się zweryfikować"
bez wskazania kanału i kodu **nie są zapisem porażki** — są zapisem, że nie
wiadomo, czy próbowano.

#### Dlaczego ta pozycja stoi PRZED REM-3

Pomiar retrospektywny na kilku powołaniach oznaczonych ⚠️ w praktyce wykazał,
że część z nich była pobieralna przez cały czas jednym kanałem, mimo że
drugi kanał zwracał odmowę dostępu. Znaczna część punktów odzyskanych przy
naprawie tych powołań pochodziła nie z mocniejszego argumentowania, lecz
z odczytu, którego wcześniej nikt nie spróbował.

⛔ To wzorzec **orzeczenia o niedostępności bez pomiaru**, wielokrotnie
udokumentowany w tym systemie pod różnymi numerami zgłoszeń. Jeśli wystąpi
ponownie, problemem nie jest pojedyncza reguła, tylko brak testu mierzącego
kanał automatycznie, zamiast polegać na dyscyplinie wykonawcy.

### REM-1 — ZAKAZ SIEROCEGO ODDALENIA

```
Każde oddalone roszczenie, zarzut albo kwalifikacja MUSI zostać sparowane
z najmocniejszą alternatywą, rozwiniętą NA TĘ SAMĄ GŁĘBOKOŚĆ.
```

Test wykonania: czy alternatywa ma własną podstawę prawną, własne przesłanki
i własny środek — czy tylko zdanie „można rozważyć". Drugie nie jest
wykonaniem.

Jeżeli alternatywy nie ma, wpisz wprost: „brak alternatywnej podstawy —
sprawdzone: [lista sprawdzonych reżimów]". Lista jest obowiązkowa; samo
stwierdzenie braku nie zamyka pozycji.

**Wzorzec prawidłowego wykonania, w postaci ogólnej.** Zarzut oparty na
jednej kwalifikacji prawnej zostaje trafnie oddalony na CN-GATE z powodu
niespełnienia warunku zakresowego, a analiza natychmiast przechodzi na
kwalifikację alternatywną, niezależną od tego warunku, rozwiniętą z pełnymi
przesłankami i skutkiem. To jest wykonanie REM-1 — nie samo wskazanie
alternatywy, lecz jej rozwinięcie do tej samej głębokości co odrzucona droga.

### REM-2 — ZAKAZ NON LIQUET

```
Brak faktu (⬛) NIE zamyka osi sporu. Produkuje rozstrzygnięcie warunkowe:
   „jeżeli X → skutek A [z podstawą i środkiem]
    jeżeli nie-X → skutek B [z podstawą i środkiem]"
```

⛔ Sformułowania „nie badałem w tej turze", „wymaga odrębnego rozstrzygnięcia",
„zagadnienie otwarte" są **dopuszczalne wyłącznie jako uzupełnienie**
rozstrzygnięcia warunkowego, nigdy zamiast niego.

⛔ Wyjątek jedyny: gdy brakujący fakt przesądza o samej dopuszczalności
(jurysdykcja, termin zawity, legitymacja) i obie gałęzie są nieoperacyjne.
Wtedy wpisz „⬛ BLOKADA DOPUSZCZALNOŚCI" i wskaż, jaki dokument zamyka lukę.

### REM-3 — ROZDZIELENIE ZNACZNIKA OD SIŁY ARGUMENTU

```
Znacznik weryfikacji zmienia STATUS POWOŁANIA. Nigdy nie zmienia
OBJĘTOŚCI ani STANOWCZOŚCI argumentu.
```

⛔ **REM-3 stosuje się DOPIERO po zamknięciu REM-0.** Reguła dotyczy powołań,
których pobranie faktycznie zawiodło w obu kanałach — nie tych, których nikt
nie próbował pobrać. Użycie REM-3 do usprawiedliwienia niepodjętej próby jest
naruszeniem bramki, nie jej wykonaniem.

Instrument o niższym statusie weryfikacyjnym — akt niewiążący, rekomendacja,
źródło wtórne — argumentuje się z pełną siłą, ze znacznikiem doklejonym, oraz
z jawnym wskazaniem jego mocy wiążącej. To dwie różne informacje i obie są
potrzebne:

```
⚠️ [NIEWERYFIKOWANE u źródła] + [instrument niewiążący — wymaga wykazania
   statusu zwyczajowego albo innej podstawy wiążącej]
   → po czym NASTĘPUJE pełny argument, nie skrót
```

Test wykonania: czy obszar oparty na materiale o niższym statusie
weryfikacyjnym ma objętość proporcjonalną do swojej wagi w sprawie — czy do
łatwości weryfikacji. To są dwie różne miary i tylko pierwsza jest właściwa.

### REM-4 — BUDŻET POKRYCIA

```
Wypisz osie sporu / obszary zadania. Dla każdej oznacz: PEŁNA / CIENKA / ⬛.
Jeżeli którakolwiek oś istotna dla rozstrzygnięcia jest CIENKA — nazwij to
wprost w odpowiedzi, zanim odda się dokument.
```

Bramka nie wymaga równomiernego pokrycia — wymaga, żeby nierównomierność była
świadoma i zadeklarowana. Gdy zadanie ma zewnętrzną strukturę wag (rubryka,
pytania klienta, zarzuty apelacji), użyj jej wprost jako listy osi.

---

## 4. BLOK WYJŚCIOWY — OBOWIĄZKOWY I WIDOCZNY

```
REM-GATE
REM-0 próby:      [n] powołań ⚠️ → [n] prób dwukanałowych → [n] odzyskanych / [n] porażek z kodem
REM-1 oddalenia:  [n] oddalonych → [n] sparowanych alternatyw / brak: [lista sprawdzonych]
REM-2 braki:      [n] pozycji ⬛ → [n] rozstrzygnięć warunkowych / [n] blokad dopuszczalności
REM-3 soft law:   [obszary oparte na instrumentach miękkich + ich waga]
REM-4 pokrycie:   [oś: PEŁNA/CIENKA/⬛] × n
```

⛔ Blok umieszcza się przed konkluzjami albo bezpośrednio po nich, ale
w tekście odpowiedzi — nie w przypisie i nie w rejestrze pominięć.

---

## 5. CZEGO TA BRAMKA NIE ROBI

Nie nakazuje uwzględnienia roszczenia. Nie nakazuje kompromisu ani
„wyważonego" rozstrzygnięcia. Oddalenie w całości jest prawidłowym wynikiem,
jeżeli przeszło REM-1 — czyli jeżeli alternatywy zostały sprawdzone i nazwane.

Nie zmienia też hierarchii źródeł: instrument niewiążący pozostaje
niewiążący. REM-3 dotyczy objętości i stanowczości WYWODU, nie mocy prawnej
powołania.

---

## 6. INTEGRACJA

```
Wywołanie:   prawny-router-v3 → BRAMKA ŚRODKA (po CN-GATE, przed KROK 4)
Zasilana z:  shared/MOD-CN-GATE.md (pozycje ⬛ i wyniki „NIE")
Współpraca:  shared/ROSZCZENIA.md, shared/STRATEGIA-PROCESOWA.md,
             shared/RISK-ASSESSMENT.md — REM-GATE nie zastępuje ich,
             sprawdza tylko, czy zostały użyte tam, gdzie trzeba
Walidacja:   shared/HYBRID-VALIDATION.md — REM-GATE wykonuje się PRZED nią
Rejestr:     shared/MOD-STEP-TRACKER.md — pozycja „REM-GATE" obowiązkowa
             w raporcie pominięć (FAZA 2)
```

⛔ REM-GATE nie ocenia trafności. Sprawdza, czy odpowiedź kończy się środkiem,
a nie samym stwierdzeniem, że środka skonstruować się nie da.
