# PROFIL-LEKKI — kolejność odczytu zasobów obowiązkowych

> **Plik:** `prawny-router-v3/references/PROFIL-LEKKI.md`
> **Wersja:** 1.2 (2026-09-10b) — rdzeń po F-180;
>              1.1 (2026-09-10) — przesłanka kosztowa skorygowana (F-179);
>              1.0 wprowadzona w routerze 3.43, flaga F-173.
> **Status:** KANONICZNY dla kolejności odczytu. Nie zawiera treści merytorycznej.
> **Wywołanie:** `view prawny-router-v3/references/PROFIL-LEKKI.md`

---

## ⛔ CZYM TEN PLIK **NIE** JEST

Trzy zdania, które muszą paść przed wszystkim innym, bo bez nich ten plik jest
narzędziem do omijania bramek:

1. ⛔ **Profil LEKKI nie znosi ani nie osłabia ŻADNEJ bramki.** Zmienia wyłącznie
   MOMENT odczytu zasobu — nigdy fakt, że zasób zostanie odczytany.
2. ⛔ **Odroczenie ≠ pominięcie.** Zasób odroczony musi być odczytany
   **przed pierwszą czynnością, którą reguluje**, nie „kiedyś później”
   i nie „jeśli starczy kontekstu”.
3. ⛔ **Użytkownik nie może zamówić profilu, który wyłącza bramkę.** Polecenia
   „krótko”, „szybko”, „bez formalności”, „pomiń bramki” zmieniają OBJĘTOŚĆ
   odpowiedzi, nigdy zestaw wykonanych kontroli. To jest ta sama reguła, którą
   OŚ-GATE i WYJ-GATE mają wpisaną u siebie.

Naruszenie któregokolwiek z tych trzech punktów jest **cięższe** niż praca
w profilu PEŁNYM, bo tworzy odpowiedź, która wygląda na przeprowadzoną
proceduralnie, a nie jest.

---

## PO CO ISTNIEJE (F-173, przesłanka skorygowana w F-179)

### ⛔ Korekta przesłanki — wersja 1.0 tego pliku była zbudowana na błędzie

Wersja 1.0 (2026-09-10) uzasadniała profil pomiarem „≈219 kB ≈ 54 tys. tokenów
ścieżki obowiązkowej". **Ta liczba była fałszywa w przesłance.** Sumowała
zasoby, które nigdy nie były ładowane bezwarunkowo: `MOD-CN-GATE`,
`MOD-REM-GATE`, `MOD-WYJATEK-GATE`, `MOD-OS-CZASU-PRZESLANEK`,
`HIERARCHIA-ZRODEL`, `MOD-STEP-TRACKER` i `DISCLAIMER` mają wyzwalacze
warunkowe zapisane u siebie i podlegają leniwemu ładowaniu (lazy loading) —
host wczytuje treść zasobu dopiero przy `view`, nie z góry.

⛔ To jest ta sama klasa błędu co **F-164** (REM-0): reguła zbudowana na tezie
o świecie, której nikt nie zmierzył. Odnotowane jawnie, bo wersja 1.0 trafiła
do wydania 3.43.

### Rzeczywisty model kosztu — zmierzony 2026-09-10

| Warstwa | Kiedy w kontekście | Rozmiar |
|---|---|---:|
| `name` + `description` 32 skilli | **zawsze**, niezależnie od sprawy | ≈5,9 kB ≈ 1,5 tys. tokenów |
| Rdzeń R-1…R-5 (router, KROK 0A, KROK 1, PRAWO-HARDGATE, SELF-CHECK) | po wyzwoleniu routera — **bezwarunkowo, w każdej sprawie** | ≈100 kB ≈ 25 tys. tokenów |
| Zasoby warunkowe (CN, REM, WYJ, OŚ, HIERARCHIA, ST, DISCLAIMER, …) | wyłącznie po padnięciu wyzwalacza | 0–113 kB |
| PRIMARY + moduły dziedzinowe + materiał sprawy | po routingu | zmienne |

Wniosek, którego wersja 1.0 nie postawiła: **koszt stały systemu jest znikomy
(≈1,5 tys. tokenów), a warstwa warunkowa była leniwa, zanim ten plik powstał.**
Nieredukowalny jest wyłącznie rdzeń — i profil LEKKI **nie zmniejsza go ani
o bajt**.

### Wobec tego: po co ten plik naprawdę jest

Nie po to, żeby oszczędzać kontekst. Po to, żeby **leniwe ładowanie przestało
być uznaniowe**.

Przed tym plikiem odpowiedź na pytanie „czy model wczytał WYJ-GATE, skoro powołał
artykuł?" była **nieweryfikowalna z zewnątrz**. Wyzwalacze były zapisane
w treści modułów, których nikt nie czytał, dopóki model sam nie uznał, że
powinien — a ocena własnej potrzeby jest trybem awarii mierzonym przez F-113
i udokumentowanym w benchmarku 2026-09-08 („reżim prawa kosmicznego nie wymaga
weryfikacji, bo nie uległ zmianie od czasu treningu" → jedyny w całym benchmarku
błąd reżimu odpowiedzialności).

Leniwe ładowanie tworzy **jeden konkretny tryb awarii: odroczenie, które cicho
staje się pominięciem.** Ten plik zamyka go trzema rzeczami:

1. **Jawna deklaracja** w bloku KROKU 3A — co jest odroczone i na jaki wyzwalacz.
2. **Kontrola na wyjściu** `[PROFIL-ODROCZENIA]` w `SELF-CHECK.md` — wyzwalacz
   padł, a odpowiadającego `view` nie ma w tej odpowiedzi = bramka niewykonana.
3. **Zamknięta lista wyzwalaczy** w jednym miejscu, mechanicznych i policzalnych,
   zamiast rozproszonych po kilkunastu modułach.

⛔ Korzyść jest **audytowa, nie wydajnościowa.** Redukcja rdzenia to osobna
robota i wykonuje się ją w samych plikach rdzenia, nie tutaj — pierwszy krok
wykonano w F-180 (`PRAWO-HARDGATE.md` 41 → 29 kB przez wydzielenie gałęzi
warunkowych), i to on, a nie ten plik, zmniejszył koszt.

---

## RDZEŃ NIEREDUKOWALNY — odczyt zawsze, przed analizą

Pięć pozycji. Kolejność wiążąca.

```
R-1  prawny-router-v3/SKILL.md          — jesteś tutaj, routing i reguły
R-2  references/KROK0A-anonimizer.md    — bramka twarda, blokuje wszystko dalej
R-3  references/KROK1-detekcja.md       — tryb, jurysdykcja, hard gate
R-4  shared/PRAWO-HARDGATE.md           — zakaz cytowania z pamięci
R-5  references/SELF-CHECK.md           — przed wysłaniem odpowiedzi
```

⛔ Żadna z tych pięciu pozycji NIE PODLEGA odroczeniu w żadnym profilu.
Brak którejkolwiek → `⛔ TRYB ZDEGRADOWANY`, nie „profil jeszcze lżejszy”.

Koszt rdzenia: ≈104 kB ≈ 26 tys. tokenów.

---

## WARSTWA ODROCZONA — odczyt na wyzwalacz

Kolumna „wyzwalacz” jest **mechaniczna i policzalna**. ZAKAZ warunku ocennego
(„gdy wygląda na potrzebne”) — ocena własnej potrzeby to tryb awarii mierzony
przez F-113.

| Zasób | Wyzwalacz odczytu | Najpóźniejszy moment |
|---|---|---|
| `shared/PRAWO-HARDGATE-BLOKADA.md` | B-1/B-2 zwrócił blokadę **i** kanał kodu też zawiódł | ⛔ przed nadaniem znacznika 🟨 lub ⚠️ |
| `shared/PRAWO-HARDGATE-AKT-MIEJSCOWY.md` | przedmiotem sprawy jest akt prawa miejscowego | przed pierwszą próbą weryfikacji tego aktu |
| `shared/HIERARCHIA-ZRODEL.md` | pierwszy URL w odpowiedzi | przed nadaniem pierwszego znacznika RZĄD |
| `references/ZRODLA-AKTOW-FALLBACK.md` | pierwszy akt polski | przed pierwszą próbą pobrania tekstu |
| `shared/MOD-CN-GATE.md` | pierwsze rozstrzygnięcie / zarzut / roszczenie / kwalifikacja | przed sformułowaniem tego rozstrzygnięcia |
| `shared/MOD-WYJATEK-GATE.md` | ≥1 powołany artykuł | przy pierwszym powołaniu aktu |
| `shared/MOD-OS-CZASU-PRZESLANEK.md` | ≥2 daty w stanie faktycznym | przed konkluzją |
| `shared/MOD-REM-GATE.md` | oddajesz analizę / opinię / raport / pismo | przed HYBRID-VALIDATION |
| `shared/DISCLAIMER.md` | odpowiedź zawiera treść prawną | KROK 7 |
| `shared/MOD-STEP-TRACKER.md` | ST-INIT: każda sesja · FAZA 2/3: ścieżka dokumentu | przed pierwszym `present_files` |
| `shared/DOSTEP-MASZYNOWY-API.md` | użycie kanału kodu (`bash`/`curl`) | przed pierwszym wywołaniem |
| `shared/MOD-SKAN-DOWODOW-KOMPLETNY.md` | obecność plików lub wzmianka o załącznikach | KROK 0C |
| `shared/MOD-PORCJOWANIE-DOWODOW.md` | materiał przekracza próg porcjowania | po SD-VER |
| `shared/MOD-REJESTR-ZALACZNIKOW-CHECKPOINT.md` | ≥1 załącznik do pisma | przed W3 |
| `shared/MOD-KONTEKST-SESJI.md` | plik kontekstu / fraza importu | KROK 0B |
| `shared/MOD-REJESTR-POKRYCIA-JEDNOSTEK.md` | ≥10 ponumerowanych jednostek | RPK-INIT |
| `shared/PRE-W2-VERIFICATION-GATE.md` | ścieżka pisma, przed W2 | przed W2 |
| `shared/CP-GATE.md` · `shared/HYBRID-VALIDATION.md` | ścieżka pisma | przed generowaniem `.docx` |
| `shared/MCP-INTEGRACJA.md` | host zgłasza podłączone MCP | KROK 1 |
| `shared/MIEDZYNARODOWE-GATES.md` + `HIERARCHIA-ZRODEL-MIEDZYNARODOWE.md` | jurysdykcja obca (UP-5) | zamiast OŚ/WYJ, przed analizą |
| `references/AUDYT-KLUCZA-ODPOWIEDZI.md` | kategoria [11] | przed werdyktem porównawczym |
| `dr-03/.../mod-KK-kwalifikator-karnomaterialny.md` | sprawa karna, po decyzji frameworku | przed kwalifikacją |

⛔ **UP-6 pozostaje bez zmian.** CN-GATE i REM-GATE działają w KAŻDEJ sprawie,
w obu jurysdykcjach, bez wyjątku. Odroczony jest ODCZYT modułu, nie WYKONANIE
bramki — i odczyt następuje najpóźniej w chwili, gdy bramka ma zadziałać.

---

## DEKLARACJA PROFILU — blok KROKU 3A

Blok śladu routingu (`KROK 3A`) rozszerza się o jedną linię:

```
PROFIL: [PEŁNY / LEKKI] — rdzeń R-1…R-5: [TAK]
ODROCZONE W TEJ TURZE: [lista zasobów + wyzwalacz, który jeszcze nie padł]
```

Zasady:

- `PROFIL: LEKKI` bez wypisanej listy odroczeń = deklaracja nieweryfikowalna,
  czyli fasada. Lista jest obowiązkowa.
- Gdy wyzwalacz padnie w trakcie tury, zasób znika z listy odroczonych i pojawia
  się jako faktyczne wywołanie `view` **widoczne w tej samej odpowiedzi**.
  Kontrola antyfasadowa `[ŚLAD ROUTINGU]` w `SELF-CHECK.md` obejmuje to
  tak samo jak PRIMARY.
- `PROFIL: PEŁNY` jest domyślny na hostach bez ograniczeń kontekstu i pozostaje
  zalecany dla spraw karnych oraz każdej sprawy z ≥2 osiami sporu.

---

## KIEDY PROFIL LEKKI JEST ZAKAZANY

```
⛔ sprawa karna materialna (zakaz analogii na niekorzyść — CN-GATE bez override)
⛔ tura kończąca się generowaniem pisma (.docx) — pełen łańcuch CP/PRE-W2/ST
⛔ kategoria [11] weryfikacja cudzego materiału — pełen protokół K0–K6
⛔ host zgłosił błąd odczytu któregokolwiek zasobu rdzenia
```

W tych czterech przypadkach: PROFIL PEŁNY albo `⛔ TRYB ZDEGRADOWANY` z jawnym
wskazaniem, czego nie udało się wczytać. Nigdy cicha praca na pamięci modelu.

---

## RELACJA DO `required_modules`

Pole `required_modules:` we frontmatterze routera wymienia **komplet zasobów,
za które router odpowiada** — jest kontraktem kompletności, nie kolejką odczytu.
Ten plik rozstrzyga, KIEDY każdy z nich zostaje odczytany. Usunięcie pozycji
z `required_modules` na podstawie tego pliku jest ZAKAZANE: pozycja odroczona
jest nadal pozycją wymaganą.
