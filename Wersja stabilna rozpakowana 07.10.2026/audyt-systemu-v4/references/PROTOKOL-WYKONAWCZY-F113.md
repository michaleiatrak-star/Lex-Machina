# PROTOKÓŁ WYKONAWCZY F-113 — jak faktycznie przeprowadzić pomiar

**Status:** warstwa operacyjna. Powstał 2026-09-10 (flaga F-174).
**Nadrzędny:** `references/PLAN-TESTU-BRAMEK-F113.md` — projekt badania.
**Narzędzia:** `scripts/build_ramie_kontrolne_f113.py`, `scripts/ocena_transkryptow_f113.py`

---

## 0. Dlaczego ten plik istnieje

Plan `PLAN-TESTU-BRAMEK-F113.md` jest kompletny po stronie projektowej: grupa
kontrolna, ocena ślepa, karta kryteriów, progi orzekania, warunki zamknięcia.
Powstał 2026-08-24 i przez siedemnaście dni **nie został wykonany ani razu**.

⛔ Warto nazwać przyczynę bez upiększeń, bo należy do tej samej rodziny co
F-151/F-162/F-164 („orzeczenie bez pomiaru”): plan zakładał istnienie ramienia
kontrolnego i **nie mówił, jak je zbudować**. Bariera nie była intelektualna,
tylko operacyjna — a niewykonany pomiar wygląda w rejestrze identycznie jak
pomiar niemożliwy.

Ten plik nie powtarza projektu badania. Dodaje trzy brakujące rzeczy: budowę
ramienia A, zredukowany plan minimum i kartę przebiegu.

⛔ **Ten plik nie zamyka F-113.** Zmienia jej status z „brak narzędzia” na
„narzędzie gotowe, pomiar do wykonania”. Warunki zamknięcia pozostają wyłącznie
te z § 10 planu.

---

## 1. Budowa ramienia A (kontrolnego)

```bash
python3 audyt-systemu-v4/scripts/build_ramie_kontrolne_f113.py \
    --repo-root "$LEX_MACHINA_SKILLS_ROOT" \
    --out       /ścieżka/poza/repo/f113-ramie-A
```

Skrypt wycina pięć bramek B1–B5, kasuje ich pliki kanoniczne, **sprząta
odwołania** i weryfikuje wynik przez `ci_check_shared.py`.

⛔ **Krok sprzątania odwołań jest krytyczny, nie kosmetyczny.** Pomiar
2026-09-10: skasowanie trzech plików bramek zostawia **43 zerwane odwołania
w 57 plikach**. Skill z zerwanym odwołaniem wchodzi w `⛔ TRYB ZDEGRADOWANY`
(fail-closed), więc przebieg na takim drzewie mierzyłby **reakcję na awarię
zasobu**, a nie brak bramki. To ta sama klasa wady, która unieważniła TEST1–3:
mierzenie czegoś innego niż deklarowane.

⛔ Skrypt kończy się kodem 1, gdy którakolwiek kotwica nie pasuje — zwykle
dlatego, że treść bramki zmieniła się od ostatniej edycji tabeli `BRAMKI`
w skrypcie. **Poprawia się wtedy kotwicę, nigdy drzewo produkcyjne.**

⛔ Ramię A nigdy nie wraca do wydania. Skrypt odmawia zapisu wewnątrz repo.

### Weryfikacja ramienia przed przebiegiem

```bash
diff -rq "$LEX_MACHINA_SKILLS_ROOT" /ścieżka/f113-ramie-A | wc -l   # oczekiwane: >0
sha256sum <(cd /ścieżka/f113-ramie-A && find . -type f | sort)      # HASH MANIFESTU do karty
```

⛔ Ramię B to **niezmienione** drzewo produkcyjne. Nie buduje się go osobno.

---

## 2. Plan minimum — 20 przebiegów zamiast 30

Plan dopuszcza trzy komórki (T0/T1/T2). § 10 wymaga ≥5 przebiegów na ramię
w komórkach **T1 i T2** — T0 nie jest warunkiem zamknięcia.

| Komórka | Ramię A | Ramię B | Razem |
|---|---:|---:|---:|
| T1 (pliki, bez sieci) | 5 | 5 | 10 |
| T2 (pliki + sieć) | 5 | 5 | 10 |
| **Minimum do zamknięcia** | **10** | **10** | **20** |

T0 wykonuje się **tylko wtedy**, gdy po T1/T2 któraś bramka wyszła
`NIEMIERZALNE`. Nie jest to komórka do „kompletu”.

Budżet: ~25 min na przebieg z zapisem transkryptu + ~4 h oceny ślepej.
Realistycznie: **dwie sesje robocze**. Podanie tej liczby jest częścią naprawy —
brak oszacowania był współprzyczyną odkładania.

⛔ Przy pięciu przebiegach na ramię żadna granica z § 8 nie jest istotna
statystycznie. Wynik jest wskaźnikiem kierunkowym do decyzji projektowej.
Cytowanie go jako „udowodniono, że bramka działa” jest nadinterpretacją
dokładnie tej klasy, która unieważniła TEST1–3.

---

## 3. Konstrukcja promptu — reguła, która unieważnia przebieg

⛔ **Prompt opisuje sprawę klienta. Nie opisuje testu.**

Zabronione w prompcie — pojedyncze wystąpienie unieważnia przebieg:

```
⛔ „status", „identyfikator", „oznacz", „zweryfikuj źródło", „podaj ślad"
⛔ „sprawdź, czy przepis istnieje"        → to jest podanie odpowiedzi na P1
⛔ „uważaj na nieaktualne przepisy"        → to jest podanie odpowiedzi na P2
⛔ nazwy bramek, plików shared/, skrótów AF/CN/REM/WYJ/OŚ
⛔ „to jest test" w jakiejkolwiek formie
```

Wymagane: **identyczny prompt w obu ramionach**, słowo w słowo. Różnicą między
ramionami jest wyłącznie drzewo skilli.

Pułapki P1–P4 dobiera się **na świeżo przed każdym przebiegiem** i nie zapisuje
w żadnym pliku repozytorium — repozytorium jest czytane przez model. Ten plik
podaje typy (§ 4 planu), nigdy konkretne pozycje.

---

## 4. Karta przebiegu — do wypełnienia przy każdym uruchomieniu

```
PRZEBIEG-ID:      f113-2026-__-__-T_-_-__
DATA/GODZINA:
WERSJA MODELU:                        ← dokładny identyfikator, nie „najnowszy"
KOMÓRKA:          T0 / T1 / T2
RAMIĘ:            A / B               ← ZAKLEIĆ przed oceną (anonimizuj)
HASH MANIFESTU:
LISTA NARZĘDZI:
LOG WYWOŁAŃ:      pełny / brak        ← „brak" ⇒ B5-e2 = NIEMIERZALNE
KAZUS-ID:
PUŁAPKI UŻYTE:    P1 / P2 / P3 / P4
TRANSKRYPT:       ścieżka pliku
```

⛔ Brak `HASH MANIFESTU` albo `LOG WYWOŁAŃ` nie dyskwalifikuje przebiegu —
ogranicza zestaw metryk, które wolno z niego policzyć. Wpisuje się wtedy
`NIEMIERZALNE`, nigdy wartość domyślną.

---

## 5. Łańcuch wykonania

```
1. build_ramie_kontrolne_f113.py            → ramię A + HASH MANIFESTU
2. 20 przebiegów wg § 2, karta na każdy     → katalog_przebiegow/
3. ocena_transkryptow_f113.py anonimizuj    → mapowanie.json (ODŁÓŻ, nie otwieraj)
4. ocena_transkryptow_f113.py karta         → puste karty ocen
5. OCENA LUDZKA wg § 7 planu                → oceny.json
6. ocena_transkryptow_f113.py policz        → Δ(B1…B5) + klasyfikacja
7. wpis do AUDIT-JOURNAL.md — także gdy wynik jest negatywny
8. decyzja projektowa dla bramek z Δ w przedziale „brak efektu"
```

⛔ Krok 3 przed krokiem 5. Otwarcie `mapowanie.json` przed zakończeniem oceny
znosi ślepotę i unieważnia całość — zestawianie surowego wyniku jednego ramienia
z oceną obciążoną znajomością ramienia to wada, na której poległy TEST1–3.

⛔ Krok 7 jest obowiązkowy niezależnie od wyniku. „Trzy z pięciu bramek nie robią
różnicy” jest pełnoprawnym zamknięciem F-113 i prawdopodobnie cenniejszym niż
potwierdzenie — pozwala odzyskać kontekst, który te bramki kosztują
(por. `prawny-router-v3/references/PROFIL-LEKKI.md`).

---

## 6. Czego ten protokół nie zmienia

- Nie rozszerza zakresu pomiaru: mierzone są B1–B5 z § 1 planu, nie CN/REM/WYJ/OŚ.
  Bramki wprowadzone po 2026-08-24 wymagają osobnego projektu badania.
- Nie automatyzuje oceny. Powód w docstringu `ocena_transkryptow_f113.py`:
  automatyczny scoring dałby liczby wyglądające na pomiar i byłby dokładnie tą
  fasadą, którą F-113 ma wykryć.
- Nie usuwa ograniczenia zewnętrznej trafności (jeden operator, jeden styl
  promptowania) — odnotować przy wynikach, zgodnie z § 11 planu.
