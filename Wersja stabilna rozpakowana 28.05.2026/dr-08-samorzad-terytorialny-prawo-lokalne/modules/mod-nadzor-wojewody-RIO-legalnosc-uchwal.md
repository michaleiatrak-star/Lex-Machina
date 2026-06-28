# mod-nadzor-wojewody-RIO-legalnosc-uchwal

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** USG — Dz.U. 2025 poz. 1153 | USP — Dz.U. 2025 poz. 1684 | USW — Dz.U. 2025 poz. 581 | Ustawa o Wojewodzie — Dz.U. 2025 poz. 428 | Ustawa o RIO — Dz.U. 2023 poz. 1325
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Nadzór Wojewody nad legalnością uchwał i zarządzeń organów JST (nie celowością!), rozstrzygnięcia nadzorcze (stwierdzenie nieważności, wstrzymanie wykonania), nadzór RIO nad finansami JST (budżet, WPF, sprawozdania), tryb zaskarżenia rozstrzygnięcia nadzorczego do WSA.

### Akty i źródła

| Akt | Dz.U. |
|---|---|
| USG art. 85–102 | Dz.U. 2025 poz. 1153 t.j. |
| USP art. 76–92 | Dz.U. 2025 poz. 1684 t.j. |
| USW art. 78–92 | Dz.U. 2025 poz. 581 t.j. |
| Ustawa o Wojewodzie | Dz.U. 2025 poz. 428 t.j. |
| Ustawa o RIO | Dz.U. 2023 poz. 1325 t.j. |

---

## 2. INTAKE

```
□ Jaki organ JST wydał akt?
□ Jaki rodzaj aktu (uchwała/zarządzenie/statut/budżet/WPF)?
□ Czy Wojewoda wydał rozstrzygnięcie nadzorcze? Kiedy?
□ Czy JST zaskarżyła rozstrzygnięcie do WSA?
□ Czy RIO wydała uchwałę nadzorczą (dotyczy budżetu / WPF)?
□ Termin: czy 30 dni na zaskarżenie rozstrzygnięcia nadzorczego nie upłynęły?
□ Jaki jest interes prawny strony wnoszącej skargę?
```

---

## 3. PROCEDURA

### Nadzór Wojewody — schemat

```
JST podjęła uchwałę/zarządzenie → doręczenie Wojewodzie
  ↓ [30 dni] Wojewoda może:
    A. Nie podjąć działań (milczenie = akceptacja)
    B. Wystąpić z wnioskiem o wyjaśnienia
    C. Stwierdzić nieważność (całość / część) — ROZSTRZYGNIĘCIE NADZORCZE
    D. Wstrzymać wykonanie i zaskarżyć do WSA

ROZSTRZYGNIĘCIE NADZORCZE stwierdzające nieważność:
  → Skutek: uchwała traci moc ze skutkiem ex tunc (od momentu podjęcia)
     LUB ex nunc — zależy od orzeczenia (weryfikuj orzecznictwo)
  → JST może zaskarżyć rozstrzygnięcie do WSA: 30 dni od doręczenia
  → WSA bada wyłącznie LEGALNOŚĆ (nie celowość, nie zasadność)

Po upływie 30-dniowego terminu nadzorczego:
  → Uchwała staje się ostateczna w sferze nadzorczej
  → Pozostaje skarga do WSA (art. 101 USG) na wniosek podmiotu z interesem prawnym
```

### Nadzór RIO — zakres

```
RIO sprawuje nadzór nad:
  □ Uchwałami budżetowymi (projekt budżetu, budżet, zmiany)
  □ Wieloletnią Prognozą Finansową (WPF)
  □ Uchwałami o zaciąganiu zobowiązań długoterminowych
  □ Sprawozdaniami z wykonania budżetu

UCHWAŁA RIO stwierdzająca nieważność uchwały budżetowej:
  → JST zaskarża do NSA (nie WSA!) — specjalna właściwość
  → Termin: 30 dni od doręczenia uchwały RIO — weryfikuj w USG/USP/USW

OPINIA RIO (obowiązkowa, niewiążąca):
  → O projekcie budżetu, możliwości spłaty zadłużenia, emisji obligacji
```

---

## 4. DOWODY, STRATEGIA, QUALITY GATE, OUTPUT

**Dowody:** treść uchwały z dziennika woj./BIP + protokół sesji + rozstrzygnięcie nadzorcze Wojewody + korespondencja z urzędem + uchwała RIO (jeśli dotyczy finansów).

**Strategia:** JST kwestionująca rozstrzygnięcie nadzorcze: wykaż że uchwała miała delegację ustawową, była prawidłowo podjęta i opublikowana. Podmiot zewnętrzny zaskarżający uchwałę: wezwij JST do usunięcia naruszenia → skarga do WSA.

**Quality gate:** Termin 30 dni na zaskarżenie rozstrzygnięcia? Aktualny t.j. USG/USP/USW (2025)? Właściwość: WSA (nadzór Wojewody) vs NSA (nadzór RIO)?

**Output:** 1. Kwalifikacja nadzoru (Wojewoda/RIO); 2. Termin; 3. Środek; 4. Dowody; 5. Strategia; 6. Rekomendacja.

**Powiązania:** `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa` | `mod-skargi-na-prawo-miejscowe-WSA-NSA` | `dr-07` → `mod-ustawa-RIO-regionalne-izby` | `pisma-procesowe-v3`

**Źródła:** isap.sejm.gov.pl | https://orzeczenia.nsa.gov.pl | https://dzienniki.gov.pl
