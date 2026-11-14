# mod-skargi-na-prawo-miejscowe-WSA-NSA

**Akt:** USG (ustawa o samorządzie gminnym) — t.j. Dz.U. 2026 poz. 662 (zm. po t.j.: 2026/912 od 2026-07-31 — art. 10b; 2026/1273 [OD 2027-03-30: 2026/1273] — art. 1, 36, 37, 37d, 37e).
**Akt:** USP (ustawa o samorządzie powiatowym) — t.j. Dz.U. 2025 poz. 1684 (zm. po t.j.: 2026/252 od 2026-04-03 — art. 6a, 6b; 2026/912 od 2026-07-31 — art. 6b).
**Akt:** USW (ustawa o samorządzie województwa) — t.j. Dz.U. 2026 poz. 720.
**Akt:** UWoj (ustawa o wojewodzie i administracji rządowej w województwie) — t.j. Dz.U. 2025 poz. 428.
**Akt:** KPA (Kodeks postępowania administracyjnego) — t.j. Dz.U. 2025 poz. 1691.
**Akt:** PPSA (Prawo o postępowaniu przed sądami administracyjnymi) — t.j. Dz.U. 2026 poz. 143 (zm. po t.j.: 2026/846 od 2026-06-26 — art. 53, 264).
**Akt:** URIO (ustawa o regionalnych izbach obrachunkowych) — t.j. Dz.U. 2025 poz. 7.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1: terminy, progi i kwoty porównane z t.j.).

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** USG art. 101 — Dz.U. 2026 poz. 662 | PPSA — Dz.U. 2026 poz. 143
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Skarga na uchwałę lub zarządzenie JST naruszające interes prawny skarżącego (art. 101 USG / art. 88 USP / art. 90 USW), skarga na bezczynność w podjęciu uchwały, tryb wezwania do usunięcia naruszenia, właściwość WSA, skutki wyroku stwierdzającego nieważność.

### Akty

| Akt | Dz.U. |
|---|---|
| USG art. 101–102 | Dz.U. 2026 poz. 662 t.j. |
| USP art. 88–89 | Dz.U. 2025 poz. 1684 t.j. |
| USW art. 90–91 | Dz.U. 2026 poz. 720 t.j. |
| PPSA art. 3 §2 pkt 5, art. 52 §4 | Dz.U. 2026 poz. 143 t.j. |

---

## 2. INTAKE

```
□ Jaki akt JST narusza interes prawny skarżącego?
□ Na czym polega naruszenie interesu prawnego (konkretne, indywidualne prawo)?
□ Czy złożono wezwanie do usunięcia naruszenia? Kiedy? Czy JST odpowiedziała?
□ Termin na skargę do WSA: 30 dni od odpowiedzi JST lub od upływu terminu
□ Właściwy WSA: siedziba organu JST który wydał akt
□ Czy jest rozstrzygnięcie nadzorcze Wojewody?
```

---

## 3. PROCEDURA

### Schemat skargi na akt prawa miejscowego (art. 101 USG)

```
Podmiot z interesem prawnym
  ↓
WEZWANIE do JST do usunięcia naruszenia prawa
  (pisemnie, bez terminu zawitego na złożenie wezwania)
  ↓ [30 dni] JST:
    Odpowiedź: uwzględnienie lub odmowa
    Milczenie: po 30 dniach = podstawa do skargi
  ↓ [30 dni od odpowiedzi / upływu 30 dni milczenia]
SKARGA DO WSA
  → Składana bezpośrednio do WSA (art. 52 §4 PPSA — bez przekazania przez JST)
  → Właściwy WSA: siedziba organu JST
  → Opłata: od rodzaju aktu — weryfikuj KSCU w ELI (RZĄD 1)

WSA może:
  → Stwierdzić nieważność aktu (całość lub część)
  → Stwierdzić niezgodność z prawem (gdy nie można stwierdzić nieważności)
  → Oddalić skargę

SKARGA KASACYJNA DO NSA: 30 dni od doręczenia wyroku WSA z uzasadnieniem
```

### Interes prawny — wymogi

```
Interes prawny musi być:
  □ INDYWIDUALNY — dotyczący konkretnej osoby
  □ BEZPOŚREDNI — wynikający bezpośrednio z kwestionowanego aktu
  □ AKTUALNY — istniejący w dacie skargi
  □ OPARTY NA PRZEPISIE PRAWA (nie tylko interes faktyczny!)

⚠️ Samo zamieszkanie na terenie gminy NIE wystarczy do wykazania interesu prawnego
⚠️ Wymóg interesu prawnego przy skardze na akt prawa miejscowego jest OSTRZEJSZY
   niż przy skardze na decyzję administracyjną
```

---

## 4. STRATEGIA, QUALITY GATE, OUTPUT

**Strategia:** Przed skargą do WSA — złóż wezwanie i zachowaj potwierdzenie. Wykaż konkretny interes prawny powiązany z przepisem prawa. Przy oddaleniu z braku interesu — rozważ skargę do Wojewody o wszczęcie nadzoru.

**Quality gate:** Wezwanie złożone? Termin 30 dni na skargę nie upłynął? Interes prawny konkretny i udokumentowany? Właściwy WSA?

**Output:** Kwalifikacja skargi → wezwanie → termin → interes prawny → zarzuty → dowody → rekomendacja.

**Powiązania:** `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa` | `mod-nadzor-wojewody-RIO-legalnosc-uchwal` | `dr-05` → `mod-KPA-postepowanie-administracyjne` | `pisma-procesowe-v3`

**Źródła:** USG: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001153 | PPSA: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000143
