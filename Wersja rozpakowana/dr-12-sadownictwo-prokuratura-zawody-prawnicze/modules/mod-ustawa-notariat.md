# mod-NT — Notariat (Prawo o notariacie)

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/ISAP-AUDIT-PROTOCOL.md`;
- metryki aktów sprawdzaj w `shared/ISAP-METRYKI-AKTOW.md`;
- jeżeli sprawa jest procesowa, uruchom `shared/FORMAL-CHECK.md`, `shared/WARUNKI-SKUTECZNOSCI.md`, `shared/TERM-CALC.md`, `shared/RISK-ASSESSMENT.md`;
- ⚠️ ZAKAZ podawania taksyz pamięci — weryfikuj aktualne rozp. MS w ISAP.
---

**Zakres:** czynności notarialne (akty notarialne, poświadczenia, depozyty, protesty weksli),
obowiązkowa forma notarialna, tytuł egzekucyjny z aktu notarialnego (art. 777 §1 pkt 4/5 KPC),
taksa notarialna, OC notariusza, odmowa dokonania czynności, odpowiedzialność cywilna i karna,
postępowanie dyscyplinarne, mianowanie i odwołanie notariusza.

## KLUCZOWE AKTY PRAWNE — ZWERYFIKOWANE

```
Prawo o notariacie:
  Dz.U. 1991 nr 22 poz. 91 (brak nowego t.j. — liczne nowelizacje)
  Stan na 2026-06-05: nowelizacje m.in.:
    Dz.U. 2025 poz. 497, 621, 622, 769, 820, 1203
    Dz.U. 2026 poz. 252, 347, 473
  ✅ VER: isap.sejm.gov.pl 2026-06-05 (brak skonsolidowanego t.j.)
  → ZAWSZE weryfikuj aktualną wersję w ISAP przed cytowaniem

Taksa notarialna:
  Rozp. MS w spr. maksymalnych stawek taksy notarialnej
  → Weryfikuj AKTUALNE stawki w ISAP przed podaniem kwoty
  web_search: "taksa notarialna rozporządzenie Ministra Sprawiedliwości 2025 2026 isap"

KPC art. 777 §1 pkt 4 i 5 — akt notarialny jako tytuł egzekucyjny:
  Dz.U. 2026 poz. 468 t.j. — weryfikuj w ISAP

KC art. 158 — obowiązkowa forma notarialna przeniesienia własności nieruchomości:
  Dz.U. 2024 poz. 1061 t.j. ze zm. — weryfikuj w ISAP
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
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: ostrożny / ofensywny / eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb i organ
□ termin na zaskarżenie odmowy notariusza (weryfikuj w ISAP)
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
□ Czy sprawdzono aktualną wersję p.n. w ISAP (brak t.j. — liczne nowelizacje)?
□ Czy taksy NIE podano z pamięci — tylko z aktualnego rozp. MS?
□ Czy oddzielono nieważność aktu od nieważności czynności prawnej?
□ Czy zidentyfikowano prawidłowy środek (zaskarżenie odmowy vs powództwo)?
□ Czy każda przesłanka ma dowód?
□ Czy wskazano termin i czy nie upłynął?
□ Czy podano ryzyki przeciwnika/organu?
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
| tytuł egzekucyjny / egzekucja (tryb KPC) | DR-02/`mod-KPC-egzekucja-windykacja`; status zawodu komornika → `mod-ustawa-komornicy-sadowi-zawod` (ten DR) |
| nieruchomości (forma) | DR-02/`mod-KC-prawo-rzeczowe-nieruchomosci` |
| postępowanie dyscyplinarne | DR-12/`mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow` |

## Weryfikacja online

```
web_search: "prawo notariat tekst jednolity isap.sejm.gov.pl 2025 2026 nowelizacje"
web_search: "taksa notarialna 2025 2026 stawki rozporządzenie Ministra Sprawiedliwości"
web_search: "art 777 KPC akt notarialny tytuł egzekucyjny orzecznictwo 2025"
```

---

## STATUS KANCELARSKI

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Data weryfikacji:** 2026-06-06
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
**⚠️ UWAGA:** Prawo o notariacie nie ma nowego t.j. — weryfikuj każdą nowelizację osobno w ISAP.
