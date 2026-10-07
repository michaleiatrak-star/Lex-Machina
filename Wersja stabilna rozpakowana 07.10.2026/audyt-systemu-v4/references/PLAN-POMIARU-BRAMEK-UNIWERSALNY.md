# PLAN POMIARU BRAMEK — projekt uniwersalny (dowolna bramka)

**Status:** projekt badania + warstwa operacyjna. Powstał 2026-09-27f (F-167).
**Relacja do poprzedników:** `PLAN-TESTU-BRAMEK-F113.md` (projekt badania dla B1–B5)
i `PROTOKOL-WYKONAWCZY-F113.md` (jak go wykonać) **pozostają w mocy** dla bramek
B1–B5. Ten plik ich nie zastępuje — uogólnia je na **dowolną** bramkę i dodaje
trzy rzeczy, których tamte nie miały: rejestr bramek jako dane, kontrolę resztkową
oraz regułę zewnętrzności korpusu.
**Narzędzia:** `scripts/build_ramie_kontrolne.py`, `references/REJESTR-BRAMEK-POMIAR.json`,
`references/REJESTR-KORPUSU-POMIAROWEGO.md`, `scripts/ocena_transkryptow_f113.py`.

---

## 0. Dlaczego ten plik istnieje

`PROTOKOL-WYKONAWCZY-F113.md` §6 mówił wprost: *„Nie rozszerza zakresu pomiaru:
mierzone są B1–B5 z § 1 planu, nie CN/REM/WYJ/OŚ. Bramki wprowadzone po 2026-08-24
wymagają osobnego projektu badania."* Skutek praktyczny: CN-GATE i REM-GATE
(F-166/F-167) przez trzy tygodnie nie miały ŻADNEJ drogi pomiaru, bo mapa wycięć
była zakodowana w Pythonie i dodanie bramki oznaczało edycję kodu.

⛔ Bariera była operacyjna, nie intelektualna — ta sama klasa co przy F-174.
Niewykonany pomiar wygląda w rejestrze identycznie jak pomiar niemożliwy.

---

## 1. Co ten pomiar mierzy, a czego NIE mierzy

```
MIERZY:   różnicę między odpowiedzią systemu Z bramką i BEZ niej,
          na tej samej sprawie, przy identycznym promptcie.
NIE MIERZY: poprawności prawnej w sensie bezwzględnym — do tego trzeba klucza
          odpowiedzi, którego korpus pomiarowy nie zawiera (patrz §4).
NIE MIERZY: skuteczności bramki „w ogóle" — mierzy ją na tej sprawie, w tej
          komórce warunków, u tego operatora.
```

⛔ Wynik jest **różnicowy**. Zdanie „bramka działa" jest nadinterpretacją;
dopuszczalne jest „na tych sprawach, w tej komórce, ramię z bramką uzyskało Δ = x".

---

## 2. Budowa ramion

**Ramię B** = niezmienione drzewo produkcyjne. Nie buduje się go osobno.
**Ramię A** = to samo drzewo z wyciętą bramką:

```bash
python3 audyt-systemu-v4/scripts/build_ramie_kontrolne.py --lista
python3 audyt-systemu-v4/scripts/build_ramie_kontrolne.py \
    --repo-root "$DRZEWO" --out /ścieżka/poza/repo/ramie-A --bramki CN,REM
```

Rejestr `REJESTR-BRAMEK-POMIAR.json` opisuje cztery typy operacji na bramkę:

| Operacja | Do czego | Kontrola |
|---|---|---|
| `usun_pliki` | plik kanoniczny bramki | musi istnieć |
| `kotwice` | dosłowny fragment do usunięcia | musi wystąpić **dokładnie raz** |
| `zakresy` | blok o stabilnych krawędziach (od → do) | obie krawędzie muszą się znaleźć |
| `zamiany` | stare → nowe tam, gdzie usunięcie całej linii zabrałoby też bramki **niemierzone** | idempotentna |

⛔ **Krok sprzątania odwołań jest krytyczny, nie kosmetyczny.** Skill z zerwanym
odwołaniem wchodzi w ⛔ TRYB ZDEGRADOWANY (fail-closed) — przebieg mierzyłby wtedy
reakcję na awarię zasobu, nie brak bramki. Pomiar 2026-09-10: 3 skasowane pliki →
43 zerwane odwołania w 57 plikach.

### ⭐ 2A. Kontrola resztkowa nazw krótkich — wada wykryta 2026-09-27f

Sprzątanie odwołań usuwa linie zawierające **nazwę pliku** bramki. Nie widzi linii,
które wołają bramkę **nazwą krótką** („CN-GATE", „REM-3"), ani — co groźniejsze —
fragmentów **odtwarzających jej logikę** w innym module.

Zmierzone przy pierwszej budowie ramienia CN/REM: po pełnym, poprawnie wykonanym
sprzątaniu w drzewie zostało **11 plików** z nazwami krótkimi, w tym dwa bloki
w `shared/MIEDZYNARODOWE-GATES.md` odtwarzające pełną treść testu CN-2
(atrybucja: status organu / wykonywanie funkcji / kierowanie konkretnym zachowaniem)
i CN-3 (przepis-bliźniak o innym reżimie). Ramię A z takim ogonem **zachowuje
bramkę** — pomiar wykazałby różnicę mniejszą niż rzeczywista i nikt by się nie
dowiedział, bo `ci_check_shared` nie zgłasza takich miejsc.

⛔ Wniosek ogólny: **każda bramka B1–B5 mierzona przed 2026-09-27f mogła mieć tę
samą wadę.** Jeżeli pomiar F-113 zostanie wykonany, ramię A należy zbudować nowym
skryptem, a `nazwy_krotkie` dla B1–B5 uzupełnić w rejestrze (dziś puste).

Skrypt **nie usuwa** takich miejsc sam — nie odróżni wzmianki incydentalnej od
treści bramki. Przerywa budowę i wypisuje listę; decyzję podejmuje człowiek
i zapisuje w rejestrze jako `zamiany` albo `dopuszczone_wzmianki` z uzasadnieniem.

---

## 3. Granica: logika bramki vs zdolność udokumentowana gdzie indziej

Reguła rozstrzygająca, co wycinamy:

```
WYTNIJ  — treść, która JEST mechanizmem bramki, gdziekolwiek się znajduje
          (np. „rząd źródła nie zmienia siły argumentu" = REM-3, choćby stało
          w module hierarchii źródeł)
ZOSTAW  — zdolność operacyjną udokumentowaną niezależnie od bramki, zdejmując
          samo PRZYPISANIE (np. reguła próby dwukanałowej jest opisana w
          DOSTEP-MASZYNOWY-API.md; jej usunięcie sprawiłoby, że ramię A mierzy
          GORSZY DOSTĘP DO ŹRÓDEŁ, a nie brak REM-GATE)
```

⛔ Błąd, przed którym ta reguła chroni, to „mierzenie czegoś innego niż
deklarowane" — ten sam, który unieważnił TEST1–TEST3. Każde zastosowanie reguły
zapisuje się w rejestrze (`uwaga_projektowa`), żeby dało się je zakwestionować.

---

## 4. Korpus pomiarowy — reguła zewnętrzności

```
⛔ KORPUS NIE WCHODZI DO REPOZYTORIUM.
```

Powód jest mierzalny, nie ostrożnościowy: repozytorium jest czytane przez model
wykonujący przebieg. Korpus w drzewie = kazus i jego rozwiązanie w jednym miejscu
= dokładnie skażenie, przez które F-166 straciła K-06, a F-168 musiała przepisać
trzy pliki. `PROTOKOL-WYKONAWCZY-F113.md` §3 już tego zakazuje dla pułapek P1–P4.

W repozytorium trzymamy **wyłącznie**: kod kazusu, dziedzinę, liczbę linii,
SHA-256 treści i status skażenia — `REJESTR-KORPUSU-POMIAROWEGO.md`. Treść
dostarcza użytkownik per przebieg, z pliku spoza repozytorium.

⛔ **Skażenie jest kierunkowe i trwałe.** Bramka dość konkretna, by zmienić
zachowanie modelu, jest dość konkretna, by skazić każdy kazus, którego sedno
opisuje. Nie da się tego naprawić lepszym przepisaniem bramki — można tylko
trzymać zbiór odłożony (held-out) i przyjąć, że domena każdej napisanej bramki
jest dla pomiaru spalona.

Brak klucza odpowiedzi w korpusie **nie blokuje** tego projektu — mierzymy różnicę
między ramionami wobec rubryki procesowej (§6), a nie zgodność z kluczem.

---

## 5. Stopnie oceniającego — co wolno powiedzieć o wyniku

| Stopień | Kto ocenia | Co wolno stwierdzić |
|---|---|---|
| **O-1** | człowiek, ślepy na ramię i na cel badania | wynik spełnia kryterium zamknięcia flagi |
| **O-2** | agent/sesja bez wiedzy o ramionach i bramkach | wynik **kierunkowy**; nie zamyka flagi |
| **O-3** | ta sama sesja, która budowała ramiona | ⛔ ZAKAZANE — to samoocena, tryb awarii F-163/F-164/F-165 |

⛔ O-2 jest bliżej automatycznego scoringu niż oceny ludzkiej. `ocena_transkryptow_f113.py`
świadomie nie automatyzuje punktacji, „bo dałaby liczby wyglądające na pomiar".
O-2 dziedziczy to zastrzeżenie: **wolno nim wykryć kierunek, nie wolno nim zamknąć flagi.**

⛔ Anonimizacja etykiet **losuje osobno dla każdej sprawy**. Powód zmierzony
2026-09-27f: oceniający O-2 trafnie wskazał zjawisko („rozbudowany aparat kontroli
zakresu") w obu przebiegach ramienia B, ale uznał różnicę za przypadkową, bo
wystąpiła „krzyżowo względem X/Y". Po odsłonięciu okazała się w 2/2 przypisana do
ramienia. To jest ślepota działająca poprawnie — i dowód, że etykiet nie wolno
nadawać spójnie między sprawami.

---

## 6. Rubryka procesowa M1–M8 (niezależna od bramki)

Każda cecha 0–2 (0 nieobecna · 1 częściowa/deklaratywna · 2 wykonana rzetelnie).
⛔ Ocenia się **obecność cechy**, nie etykietę: praca robiąca rzecz bez nazwania
dostaje pełne punkty, praca z efektowną etykietą nad pustą treścią — zero.

```
M1 ZAKRES PRZED MERITUM   — czy ustalono, że przepis obejmuje TEN podmiot i TEN
                            stan, zanim rozstrzygnięto na nim meritum
M2 JEDNA NORMA PER OŚ     — konkretna jednostka redakcyjna per oś sporu, nie lista aktów
M3 WYNIK NEGATYWNY        — czy gdziekolwiek stwierdzono „ta norma nie ma
                            zastosowania" + norma zastępcza albo brak podstawy
M4 ODDALENIE Z ALTERNATYWĄ— każde odrzucone roszczenie sparowane z najmocniejszą
                            alternatywą na porównywalnej głębokości
M5 BRAK NON LIQUET        — brak faktu → rozstrzygnięcie warunkowe z podstawą i środkiem
M6 DEKLARACJA POKRYCIA    — jawnie, co opracowano pełno, a co pobieżnie
M7 BRAKI I DOWODY         — lista braków faktycznych i dowodów rozstrzygających
M8 ŚRODEK I SKUTEK        — konkretny środek ochrony/sentencja + skutek proceduralny
POZA PUNKTACJĄ: ZMYŚLENIA — powołania jednostek, sygnatur, pozycji Dz.U. lub
                            faktów nieistniejących; raportowane osobno, zawsze
```

Rubryka celowo nie zawiera pytań o konkretną bramkę — inaczej mierzyłaby własną
etykietę. Bramka ma się ujawnić przez M1–M8 albo nie ujawnić się wcale.

---

## 7. Karta przebiegu

```
PRZEBIEG-ID:      <bramki>-RRRR-MM-DD-T<komórka>-<ramię>-<nr>
DATA/GODZINA:
WERSJA MODELU:                        ← dokładny identyfikator, nie „najnowszy"
KOMÓRKA:          T0 / T1 (pliki, bez sieci) / T2 (pliki + sieć)
RAMIĘ:            A / B               ← ZAKLEIĆ przed oceną
BRAMKI WYCIĘTE:                       ← z --bramki
WERSJA REJESTRU:                      ← pole „wersja" z REJESTR-BRAMEK-POMIAR.json
DRZEWO ŹRÓDŁOWE:  <wersje skilli albo commit>
KAZUS-ID + SHA-256:                   ← z REJESTR-KORPUSU-POMIAROWEGO.md
KONTROLA RESZTKOWA: czysta / lista wyjątków
TRANSKRYPT:       ścieżka
STOPIEŃ OCENY:    O-1 / O-2
```

---

## 8. Progi i zakaz nadinterpretacji

```
n < 5 na ramię  → wynik KIERUNKOWY. Zakaz zdania „udowodniono".
n ≥ 5 na ramię  → nadal brak istotności statystycznej (tak mówi PROTOKOL F-113 §2);
                  wynik jest wskaźnikiem do decyzji projektowej, nie dowodem.
Δ ujemne albo zero → wpis do dziennika OBOWIĄZKOWY. „Bramka nie robi różnicy"
                  jest pełnoprawnym wynikiem i zwykle cenniejszym niż potwierdzenie,
                  bo pozwala odzyskać kontekst, który bramka kosztuje.
```

---

## 9. Łańcuch wykonania

```
1. build_ramie_kontrolne.py --bramki <lista>        → ramię A + kontrola resztkowa
2. prompt identyczny dla obu ramion, różnica = korzeń drzewa
   ⛔ prompt opisuje SPRAWĘ KLIENTA, nie test (zakazane słowa: § 3 PROTOKOŁU F-113)
3. przebiegi wg planu minimum, karta na każdy
4. anonimizacja: etykiety losowane OSOBNO dla każdej sprawy, mapowanie odłożone
5. ocena wg rubryki § 6 — stopień O-1 albo O-2 (§ 5)
6. odsłonięcie mapowania DOPIERO po zamknięciu oceny
7. wpis do AUDIT-JOURNAL.md — także przy wyniku negatywnym
```

⛔ Krok 6 przed krokiem 5 unieważnia całość.

---

## 10. Znane ograniczenia tego projektu

- **Aparatura audytu jest w obu ramionach identyczna, ale obecna.** `audyt-systemu-v4/`
  zawiera opisy bramek (ten plik, plan F-113, dziennik). Model w ramieniu A może je
  przeczytać. Wyłączone ze skanu resztkowego świadomie — różnicowo neutralne,
  ale nie zerowe. Usunięcie ich z ramienia A zmieniłoby drzewo o więcej niż bramkę.
- **Jeden operator, jeden styl promptowania** — ograniczenie trafności zewnętrznej,
  odnotować przy każdym wyniku.
- **Komórka T1 wyłącza sieć**, czyli wyłącza HARD GATE. Przebiegi T1 produkują
  wyłącznie powołania ⚠️ NIEWERYFIKOWANE i nie nadają się do oceny poprawności
  cytatów — nadają się do oceny struktury rozumowania (M1–M8).
