# mod-KM — Komornik sądowy jako zawód (Ustawa o komornikach sądowych)

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.MD`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/ISAP-AUDIT-PROTOCOL.md`;
- metryki aktów sprawdzaj w `shared/ISAP-METRYKI-AKTOW.md`;
- jeżeli sprawa jest procesowa, uruchom `shared/FORMAL-CHECK.md`, `shared/WARUNKI-SKUTECZNOSCI.md`, `shared/TERM-CALC.md`, `shared/RISK-ASSESSMENT.md`;
- ⚠️ ZAKAZ podawania opłat egzekucyjnych z pamięci — weryfikuj w aktualnym rozp. MS.
- Uwaga: ten moduł obejmuje komornika jako ZAWÓD i organ (status, odpowiedzialność,
  wybór, OC, skarga 767 KPC). Egzekucja jako TRYB proceduralny (KPC, UPEA) →
  DR-02/`mod-KPC-egzekucja-windykacja`. (2026-06-14: usunięto duplikat
  DR-03/mod-ustawa-komornicy-sadowi — NOTA-8, treść była identyczna z tym modułem.)
---

**Zakres:** komornik sądowy jako funkcjonariusz publiczny, mianowanie, kancelaria komornicza,
nadzór (sąd rejonowy + KRK + MS), wybór komornika przez wierzyciela, opłaty egzekucyjne,
OC komornika, odpowiedzialność cywilna za szkodę, skarga dyscyplinarna,
odpowiedzialność karna (przekroczenie uprawnień).

## KLUCZOWE AKTY PRAWNE — ZWERYFIKOWANE

```
Ustawa o komornikach sądowych:
  Dz.U. 2024 poz. 1458 t.j.
  ✅ VER: isap.sejm.gov.pl 2026-06-05
  → https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240001458

Postępowanie dyscyplinarne komorników — Ustawa o komornikach sądowych,
  Rozdział 11 "Odpowiedzialność dyscyplinarna", art. 222-260:
  → I instancja: KOMISJA DYSCYPLINARNA (33 członków powoływanych przez
    Krajową Radę Komorniczą spośród kandydatów zgłoszonych przez rady
    poszczególnych izb komorniczych; kadencja, wymogi: min. 5-letni staż
    nienagannej służby, brak toczącego się postępowania dyscyplinarnego)
  → ⚠️ RÓŻNICA STRUKTURALNA względem adwokatów/radców/notariuszy: II instancja
    (odwoławcza) to SĄD APELACYJNY — organ PAŃSTWOWY, NIE korporacyjny
  → Przedawnienie: 5 lat od popełnienia czynu (art. 227)
  → Zatarcie kary: 10 lat od uprawomocnienia (dla kar surowszych)
  ✅ VER: 2026-07-02 (zadanie specjalne, na żądanie użytkownika — numeracja
  artykułów wg wersji ustawy z 22.03.2018 r., zweryfikować zgodność z
  aktualnym t.j. 2024.1458 przy najbliższej okazji)

Opłaty egzekucyjne — rozporządzenie MS:
  ⚠️ Weryfikuj aktualne rozp. w ISAP przed podaniem stawek
  web_search: "opłaty komornicze rozporządzenie MS 2025 2026 egzekucja stawki"

KPC — skarga na czynności komornika:
  Dz.U. 2026 poz. 468 t.j. — art. 767 i n. KPC
  ✅ VER: isap.sejm.gov.pl 2026-06-05

Ustawa o kosztach komorniczych (jeśli odrębna od u.k.s.):
  → weryfikuj w ISAP — możliwe zmiany po 2024
```

## ZASADY ABSOLUTNE

1. Komornik = funkcjonariusz publiczny działający przy sądzie rejonowym.
2. Wierzyciel może wybrać DOWOLNEGO komornika w kraju (nie tylko rewirowego)
   — weryfikuj aktualne ograniczenia w ISAP.
3. Odpowiedzialność cywilna za szkodę z egzekucji: komornik odpowiada OSOBIŚCIE
   (SP nie ponosi odpowiedzialności solidarnej — aktualny stan: weryfikuj).
4. Opłaty egzekucyjne: co do zasady 10% wyegzekwowanej kwoty — ZAWSZE weryfikuj
   min/max i wyjątki w aktualnym rozp. MS.
5. OC: obowiązkowe; suma gwarancyjna: weryfikuj aktualne rozp. MS.
6. Skarga na czynności komornika: art. 767 KPC — termin 1 tydzień od czynności
   (lub powzięcia wiadomości) — WERYFIKUJ aktualne brzmienie KPC.

## WALIDACJA INTAKE

```text
□ sprawa dotyczy statusu zawodowego komornika czy trybu egzekucji?
  (jeśli tryb → DR-02/mod-KPC-egzekucja-windykacja)
□ czy to skarga na czynności komornika (art. 767 KPC)?
□ czy to odpowiedzialność odszkodowawcza komornika?
□ czy to skarga dyscyplinarna?
□ data czynności / doręczenia i termin na środek
□ czy wierzyciel wybrał komornika — prawidłowo?
□ opłaty egzekucyjne — czy prawidłowo pobrane?
```

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- rola: wierzyciel / dłużnik / komornik / organ nadzorczy;
- czynność lub zaniechanie kwestionowane;
- data i termin na środek;
- cel: skarga art. 767 KPC / odszkodowanie / postępowanie dyscyplinarne / wybór komornika;
- wartość sporu (opłaty egzekucyjne);

## 2. Mapa proceduralna

```text
Czynność komornika / zaniechanie / szkoda
  ↓
Kwalifikacja: skarga art. 767 KPC / powództwo / skarga dyscyplinarna / zawiadomienie karne
  ↓
Właściwy organ: sąd rejonowy / KRK / MS / sąd cywilny
  ↓
Środek zaskarżenia: skarga / zażalenie / pozew / zawiadomienie
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: ostrożny / ofensywny / eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb i organ
□ termin na skargę art. 767 KPC (1 tydzień — weryfikuj KPC ISAP)
□ legitymacja: wierzyciel, dłużnik, osoba trzecia
□ żądanie możliwe prawnie
□ fakty powiązane z normą
□ dowody przypisane do każdej tezy
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- protokół czynności komornika;
- zawiadomienie o wszczęciu egzekucji;
- zajęcia ruchomości / nieruchomości / wierzytelności;
- korespondencja z komornikiem;
- polisa OC komornika;
- dowody szkody (wycena, faktury);
- orzeczenia sądów w sprawach skargowych.

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność
      → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:
1. argumentację skarżącego (dłużnik / wierzyciel / osoba trzecia),
2. argumentację komornika / organu nadzorczego.

Typowe ryzyka i kontrargumenty:
- uchybienie tygodniowemu terminowi skargi art. 767 KPC;
- trudność wykazania szkody przy prawidłowej egzekucji;
- odpowiedzialność dyscyplinarna vs cywilna — różne tryby;
- komornik może powoływać się na tytuł egzekucyjny jako podstawę czynności;

## 6. Strategia procesowa

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin skargi 767 KPC, kompletność, dowody.

### Wariant ofensywny
Eksponuje naruszenia procedury egzekucyjnej, bezprawność zajęcia, nieproporcjonalność.

### Wariant eskalacyjny
Skarga 767 KPC → zażalenie → skarga dyscyplinarna do MS/KRK → powództwo o odszkodowanie z OC.

## 7. Orzecznictwo

Nie twórz fikcyjnych sygnatur. Orzecznictwo pobieraj z:
- SN (skargi na czynności, odpowiedzialność komornika),
- orzeczenia.ms.gov.pl,
- LEX/Legalis pomocniczo.

Dla każdego orzeczenia wskaż:
- sąd; datę; sygnaturę; tezę użyteczną;
- relację do stanu faktycznego; aktualność linii orzeczniczej;
- czy to argument główny, pomocniczy, czy ryzykowny.

## 8. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy odróżniono komornika jako zawód (ten moduł) od trybu egzekucji (DR-03)?
□ Czy opłat egzekucyjnych NIE podano z pamięci — tylko z aktualnego rozp. MS?
□ Czy sprawdzono termin skargi art. 767 KPC w ISAP?
□ Czy wskazano prawidłowy organ nadzorczy?
□ Czy każda przesłanka ma dowód?
□ Czy podano ryzyka przeciwnika/organu?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 9. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| tryb egzekucji (KPC/UPEA) | DR-02/`mod-KPC-egzekucja-windykacja` |
| postępowanie dyscyplinarne | DR-12/`mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow` |
| koszty sądowe | DR-12/`mod-KSCU-koszty-sadowe-i-pomoc-prawna` |

## Weryfikacja online

```
web_search: "ustawa komornikach sądowych Dz.U. 2024 poz. 1458 isap"
web_search: "opłaty komornicze rozporządzenie 2025 2026 egzekucja stawki"
web_search: "skarga art 767 KPC komornik termin orzecznictwo 2025"
web_search: "odpowiedzialność odszkodowawcza komornika 2025 orzecznictwo"
```

---

## STATUS KANCELARSKI

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Data weryfikacji:** 2026-06-06
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
