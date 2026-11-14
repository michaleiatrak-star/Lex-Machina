# mod-NT — Notariat (Prawo o notariacie)

**Akt:** PrAdw (Prawo o adwokaturze) — t.j. Dz.U. 2024 poz. 1564 (zm. po t.j.: 2025/1172 od 2026-03-01 — art. 4, 37d; 2026/370 od 2026-04-03 — art. 66, 78a; 2026/846 od 2026-10-01 — art. 6; 2026/1290 od 2026-10-17 — art. 1, 1a, 3, 4, 4b, 4c, 4ca, 7, 8a, 10, 11, 12, 16a, 16b, 16c, 16d, 16e, 37a, 40, 42).
**Akt:** PrNot (Prawo o notariacie) — t.j. Dz.U. 2026 poz. 614 (zm. po t.j.: 2026/1099 [OD 2026-11-19: 2026/1099] — art. 2, 92a).
**Akt:** UKS (ustawa o komornikach sądowych) — t.j. Dz.U. 2026 poz. 881.
**Akt:** UKSC (ustawa o kosztach sądowych w sprawach cywilnych) — t.j. Dz.U. 2025 poz. 1228 (zm. po t.j.: 2026/473 od 2026-07-08 — art. 35, 36, 36a, 96; 2026/1003 od 2026-10-28 — art. 3, 32; 2026/346 [OD 2028-09-30: 2026/346] — art. 52, 53, 55).
**Akt:** KPC (Kodeks postępowania cywilnego) — t.j. Dz.U. 2026 poz. 468 (zm. po t.j.: 2026/473 od 2026-07-08 — art. 460, 461, 465, 476, 631, 632, 3982, 4771b, 4771c, 4771d, 4777a, 7555, 7556; 2026/830 od 2026-07-08 — art. 4; 2026/1003 od 2026-10-28 — zakres: tekst nowelizacji w ELI; 2026/1046 od 2026-11-05 — art. 1, 2, 47, 94, 461, 477; 2026/1296 od 2026-11-06 — art. 17).
**Akt:** KPK (Kodeks postępowania karnego) — t.j. Dz.U. 2026 poz. 490 (zm. po t.j.: 2026/421 od 2026-04-14 — art. 21h, 74, 213, 332, 336; 2026/638 od 2026-05-28 — art. 25; 2026/760 od 2026-06-12 — art. 21h, 74, 213, 332; 2026/882 od 2026-07-16 — art. 607k, 607m, 607t, 607y, 607ya, 607zb; 2026/901 od 2026-07-21 — art. 87).
**Akt:** KC (Kodeks cywilny) — t.j. Dz.U. 2026 poz. 795.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1: terminy, progi i kwoty porównane z t.j.).

**Standard jakości:** stosuj `prawo-polskie-v2/krajowe/shared/MODULE-STANDARD-POLISH-LAW.md` oraz `prawo-polskie-v2/krajowe/shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/ISAP-AUDIT-PROTOCOL.md`;
- metryki aktów sprawdzaj w `prawo-polskie-v2/krajowe/shared/ISAP-METRYKI-AKTOW.md`;
- jeżeli sprawa jest procesowa, uruchom `prawo-polskie-v2/krajowe/shared/FORMAL-CHECK.md`, `shared/WARUNKI-SKUTECZNOSCI.md`, `prawo-polskie-v2/krajowe/shared/TERM-CALC.md`, `shared/RISK-ASSESSMENT.md`;
- ⚠️ ZAKAZ podawania taksyz pamięci — weryfikuj aktualne rozp. MS w ELI (RZĄD 1).
---

**Zakres:** czynności notarialne (akty notarialne, poświadczenia, depozyty, protesty weksli),
obowiązkowa forma notarialna, tytuł egzekucyjny z aktu notarialnego (art. 777 §1 pkt 4/5 KPC),
taksa notarialna, OC notariusza, odmowa dokonania czynności, odpowiedzialność cywilna i karna,
postępowanie dyscyplinarne, mianowanie i odwołanie notariusza.

## KLUCZOWE AKTY PRAWNE — ZWERYFIKOWANE

```
Prawo o notariacie:
  ⚠️ POPRAWKA 2026-07-02: Dz.U. 2026 poz. 614 t.j. (potwierdzone w tej samej
  sesji, FAZA 3A/krok 10 WARN-26) — BYŁO błędnie opisane jako "brak nowego
  t.j." z bazą 1991 nr 22 poz. 91; ten opis był nieaktualny
  Stan na 2026-06-05 (do zweryfikowania czy nadal aktualne po nowym t.j.):
    Dz.U. 2025 poz. 497, 621, 622, 769, 820, 1203
    Dz.U. 2026 poz. 252, 347, 473
  ✅ VER: 2026-07-02
  → ZAWSZE weryfikuj aktualną wersję w ELI (RZĄD 1) przed cytowaniem

Postępowanie dyscyplinarne notariuszy — Prawo o notariacie, Rozdział 6
  "Odpowiedzialność dyscyplinarna", art. 50-63c:
  → I instancja: SĄD DYSCYPLINARNY przy Radzie Izby Notarialnej (wybierany
    przez Walne Zgromadzenie notariuszy danej izby na 3-letnią kadencję)
  → II instancja (odwoławcza): WYŻSZY SĄD DYSCYPLINARNY
  → Rzecznik Dyscyplinarny Notariatu — wszczyna i prowadzi dochodzenie
    dyscyplinarne (art. 70 i nast.)
  → Pomocniczo stosuje się przepisy postępowania karnego
  → Kasacja do Sądu Najwyższego możliwa w określonych przypadkach (art. 63a-63c)
  ✅ VER: 2026-07-02 (zadanie specjalne, na żądanie użytkownika)

Taksa notarialna:
  Rozp. MS w spr. maksymalnych stawek taksy notarialnej
  → Weryfikuj AKTUALNE stawki w ELI (RZĄD 1) przed podaniem kwoty
  web_search: "taksa notarialna rozporządzenie Ministra Sprawiedliwości 2025 2026 isap"

KPC art. 777 §1 pkt 4 i 5 — akt notarialny jako tytuł egzekucyjny:
  Dz.U. 2026 poz. 468 t.j. — weryfikuj w ELI (RZĄD 1)

KC art. 158 — obowiązkowa forma notarialna przeniesienia własności nieruchomości:
  Dz.U. 2026 poz. 795 t.j. ze zm. — weryfikuj w ELI (RZĄD 1)
```

## ZASADY ABSOLUTNE

1. **Obowiązkowa forma notarialna** (ad solemnitatem — brak → nieważność bezwzględna):
   - przeniesienie własności nieruchomości (art. 158 KC),
   - umowa deweloperska (ustawa deweloperska),
   - umowa spółki z o.o. i jej zmiany (art. 157 KSH),
   - testament notarialny (art. 950 KC),
   - pełnomocnictwo do czynności wymagającej formy notarialnej.
2. Akt notarialny = tytuł egzekucyjny po nadaniu klauzuli (art. 777 KPC).
3. Notariusz MOŻE odmówić czynności sprzecznej z prawem (art. 81 p.n.).
4. Odpowiedzialność cywilna notariusza: za szkodę z niezgodnego z prawem działania.
5. OC: obowiązkowe — suma gwarancyjna: weryfikuj aktualne rozp. MS.
6. Taksa: maksymalna wg rozporządzenia MS — ZAWSZE weryfikuj przed podaniem.

## WALIDACJA INTAKE

```text
□ czynność notarialna: jakiego rodzaju? (akt, poświadczenie, depozyt, protest)
□ czy wymagana forma notarialna ad solemnitatem?
□ czy notariusz odmówił — jakie uzasadnienie?
□ czy akt ma być tytułem egzekucyjnym (art. 777 KPC)?
□ data czynności i termin ewentualnego środka
□ czy sprawa dotyczy wadliwości aktu (nieważność, wada oświadczenia woli)?
□ czy sprawa dotyczy odpowiedzialności zawodowej / dyscyplinarnej?
□ taksa — czy prawidłowo pobrana?
```

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- rodzaj czynności notarialnej i jej skutki prawne;
- strony aktu i ich zdolność do czynności prawnych;
- data sporządzenia aktu;
- cel: wykonanie, zaskarżenie, odpowiedzialność notariusza, odmowa;
- czy akt ma być/jest tytułem egzekucyjnym;
- czy pojawiła się odmowa notariusza i jej podstawa.

## 2. Mapa proceduralna

```text
Czynność notarialna / odmowa / wadliwość aktu
  ↓
Kwalifikacja: ważność aktu / tytuł egzekucyjny / odmowa / odpowiedzialność
  ↓
Właściwy organ: notariusz / Minister Sprawiedliwości / sąd cywilny / organ dyscyplinarny
  ↓
Środek zaskarżenia: zaskarżenie odmowy (14 dni — weryfikuj) / powództwo / skarga
  ↓
Walidacja formalna: prawo-polskie-v2/krajowe/shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: ostrożny / ofensywny / eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb i organ
□ termin na zaskarżenie odmowy notariusza (weryfikuj w ELI (RZĄD 1))
□ legitymacja strony
□ żądanie możliwe prawnie
□ fakty powiązane z normą
□ dowody przypisane do każdej tezy
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- akt notarialny (oryginał / wypis);
- repertorium notarialne;
- korespondencja z notariuszem;
- dowody zdolności do czynności prawnych stron;
- polisa OC notariusza;
- orzeczenia sądów w sprawach o nieważność;
- dowody szkody (rzeczoznawca, wycena).

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność
      → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:
1. argumentację strony (nieważność, błąd notariusza, odmowa),
2. argumentację notariusza / organu.

Typowe ryzyka i kontrargumenty:
- domniemanie prawidłowości czynności notarialnej (trudne obalenie);
- krótkie terminy na zaskarżenie odmowy;
- nieważność aktu ≠ nieważność czynności prawnej (zależy od przepisu);
- rozróżnienie formy ad solemnitatem vs ad probationem;

## 6. Strategia procesowa

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje wadliwość procedury notarialnej, brak zbadania zdolności prawnej, naruszenie art. 81 p.n.

### Wariant eskalacyjny
Skarga do MS / Izby Notarialnej → powództwo cywilne o odszkodowanie z OC notariusza.

## 7. Orzecznictwo

Nie twórz fikcyjnych sygnatur. Orzecznictwo pobieraj z:
- SN (nieważność aktów, tytuł egzekucyjny art. 777 KPC),
- orzeczenia.ms.gov.pl,
- LEX/Legalis pomocniczo.

Dla każdego orzeczenia wskaż:
- sąd; datę; sygnaturę; tezę użyteczną;
- relację do stanu faktycznego; aktualność linii orzeczniczej;
- czy to argument główny, pomocniczy, czy ryzykowny.

## 8. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy sprawdzono aktualną wersję p.n. u źródła? **t.j. Dz.U. 2026 poz. 614** ✅ [VER] RZĄD 1 2026-09-10i
  (obwieszczenie z 30.04.2026, zero nowelizacji po tekście jednolitym) — ⛔ wcześniejszy zapis „brak t.j." był nieprawdziwy
□ Czy taksy NIE podano z pamięci — tylko z aktualnego rozp. MS?
□ Czy oddzielono nieważność aktu od nieważności czynności prawnej?
□ Czy zidentyfikowano prawidłowy środek (zaskarżenie odmowy vs powództwo)?
□ Czy każda przesłanka ma dowód?
□ Czy wskazano termin i czy nie upłynął?
□ Czy podano ryzyki przeciwnika/organu?
□ Czy użyto prawo-polskie-v2/krajowe/shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 9. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `prawo-polskie-v2/krajowe/shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `prawo-polskie-v2/krajowe/shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| tytuł egzekucyjny / egzekucja (tryb KPC) | DR-02/`mod-KPC-egzekucja-windykacja`; status zawodu komornika → `mod-ustawa-komornicy-sadowi-zawod` (ten DR) |
| nieruchomości (forma) | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KW-ksiega-wieczysta-zakup-nieruchomosci.md` + `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md` |
| postępowanie dyscyplinarne | DR-12/`mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow` |

## Weryfikacja online

```
web_search: "prawo notariat tekst jednolity isap.sejm.gov.pl 2025 2026 nowelizacje"
web_search: "taksa notarialna 2025 2026 stawki rozporządzenie Ministra Sprawiedliwości"
web_search: "art 777 KPC akt notarialny tytuł egzekucyjny orzecznictwo 2025"
```

---

## STATUS KANCELARSKI

## ⛔ TAKSA NOTARIALNA — stawki MAKSYMALNE

Wynagrodzenie notariusza ustanawia **rozporządzenie MS z 28.06.2004 r. w sprawie
maksymalnych stawek taksy notarialnej**, t.j. `Dz.U. 2024 poz. 1566`
✅ [VER] RZĄD 1 2026-09-12c (status ELI `obowiązujący`).

```text
view prawo-polskie-v2/krajowe/shared/TABELE-OPLAT.md      # sekcja 6d — tabela § 3 z odczytu treści
```

⛔ **Odwrotna logika niż w taksach adwokackiej i radcowskiej.** Tam § 2 podaje
stawki **minimalne** (podłoga zasądzenia kosztów). Tu § 3 podaje **maksimum** —
notariusz może zejść niżej, a kwota jest przedmiotem umowy. Podawanie stawki
z § 3 jako „ceny należnej" jest błędem kategorii, nie liczby.

⚠️ § 4: przy obliczaniu wartości czynności **nie odlicza się obciążeń ani
bonifikat**. ⚠️ § 7 ust. 1: projekt aktu oraz akt dokumentujący m.in.
ustanowienie hipoteki zabezpieczającej kredyt mieszkaniowy lub gospodarczy —
**1/4** stawki z § 3. ⚠️ Do taksy dochodzą VAT oraz podatki i opłaty sądowe
pobierane przez notariusza jako **płatnika** (PCC, podatek od spadków i darowizn,
opłata wieczystoksięgowa z art. 42–46 KSCU) — odrębne tytuły, nie część taksy.

---

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Data weryfikacji:** 2026-06-06
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
**⚠️ UWAGA:** Prawo o notariacie nie ma nowego t.j. — weryfikuj każdą nowelizację osobno w ISAP.
