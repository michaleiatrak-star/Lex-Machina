# mod-lokalne-podatki-oplaty-taryfy

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Ustawa o podatkach i opłatach lokalnych — **Dz.U. 2025 poz. 707 t.j.** (reforma od 01.01.2025) → patrz DR-06 | Ustawa wod-kan — Dz.U. 2024 poz. 757
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Lokalne podatki i opłaty (podatek od nieruchomości, rolny, leśny, opłata za śmieci, opłata targowa, miejscowa, uzdrowiskowa), taryfy komunalne (wod-kan), zwolnienia lokalne, stawki uchwalane przez rady gmin.

### ⚠️ KLUCZOWE ODESŁANIE

```
Podatek od nieruchomości (reforma od 01.01.2025 — nowe definicje budowli i budynku):
→ DR-06 → mod-ustawa-podatek-nieruchomosci-i-lokalne
  (tam: Dz.U. 2025 poz. 707 t.j., wyrok TK SK 14/21, nowe definicje, orzecznictwo WSA)

Taryfy wod-kan (zatwierdzane przez Wody Polskie, nie gminę):
→ mod-ustawa-komunalne-wod-kan-transport-czystosc (niniejszy DR-08)
```

---

## 2. PROCEDURA

### Stawki lokalne — mechanizm

```
STAWKI UCHWALANE PRZEZ RADĘ GMINY w granicach maksymalnych z obwieszczenia MF:
  → Obwieszczenie MF: co roku (weryfikuj aktualne!):
    web_search: "stawki maksymalne podatek nieruchomości 2026 MF obwieszczenie"
  → Uchwała rady: do 30 listopada na rok następny (jeśli brak — obowiązują stawki poprzednie)
  → Publikacja: dziennik urzędowy województwa

OPŁATA ZA ŚMIECI (opłata za gospodarowanie odpadami komunalnymi):
  → Rada gminy: uchwalenie stawek i regulaminu
  → Kryteria: od osoby / od m² / od gospodarstwa / od ilości wody (do wyboru)
  → Stawka dla niesegregujących: min. 2× wyższa
  → Zaskarżenie uchwały: tryb art. 101 USG + WSA

OPŁATA TARGOWA, MIEJSCOWA, UZDROWISKOWA:
  → Rada gminy uchwalana w granicach ustawy
  → Weryfikuj katalog i limity w ustawie o podatkach i opłatach lokalnych
```

---

## 3. QUALITY GATE / OUTPUT

**Quality gate:** Stawki z aktualnej uchwały gminy (nie z ustawy — stawki są lokalne)? Uchwała opublikowana w dzienniku woj.? Reforma podatku od nieruchomości 2025 uwzględniona?

**Output:** Kwalifikacja podatku/opłaty → stawka lokalna → podstawa uchwały → zaskarżenie.

**Powiązania:** `dr-06` → `mod-ustawa-podatek-nieruchomosci-i-lokalne` (reforma 2025!) | `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa` | `mod-skargi-na-prawo-miejscowe-WSA-NSA`

**Źródła:** https://isap.sejm.gov.pl | https://dzienniki.gov.pl | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000707
