# mod-ustawa-zaskarzanie-decyzji-wlasnosci

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** KPA art. 156 §2a — Dz.U. 2025 poz. 1691 | Ustawa reprywatyzacyjna — Dz.U. 2021 poz. 795 ze zm.
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

### Zakres
Art. 156 §2a KPA — ograniczenie stwierdzenia nieważności decyzji dotyczących nieruchomości po 30 latach; ustawa reprywatyzacyjna (dekret warszawski — komisja ds. reprywatyzacji); odszkodowanie jako alternatywa po upływie terminu nieważności.

### Akty

| Akt | Dz.U. |
|---|---|
| KPA art. 156 §2a i art. 158 §3 | Dz.U. 2025 poz. 1691 t.j. |
| Ustawa z 09.06.2021 r. (nowelizacja KPA — art. 156 §2a) | Dz.U. 2021 poz. 1706 |
| Ustawa reprywatyzacyjna (nieruchomości warszawskie) | Dz.U. 2021 poz. 795 ze zm. |

---

## 2. INTAKE

```
□ Kiedy została wydana i doręczona kwestionowana decyzja?
□ Czy minęło 10 lat? (ograniczenie stwierdzenia nieważności)
□ Czy minęło 30 lat? (całkowity zakaz nieważności — możliwe tylko odszkodowanie)
□ Czy dotyczy nieruchomości (art. 156 §2a KPA) czy innej sprawy?
□ Czy to sprawa warszawska (dekret Bieruta 1945)?
□ Kto jest stroną: dawny właściciel / następca prawny / nabywca od gminy / inwestor?
```

---

## 3. PROCEDURA

### Ograniczenia nieważności decyzji dot. nieruchomości (art. 156 §2a KPA)

```
Nowelizacja KPA (Dz.U. 2021 poz. 1706 — w życie od 16.09.2021):

DO 10 LAT od doręczenia decyzji:
  → Stwierdzenie nieważności MOŻLIWE (art. 156 §1 KPA)

PO 10 LATACH od doręczenia decyzji:
  → NIE stwierdza się nieważności decyzji dotyczącej nieruchomości
  → Możliwe wyłącznie: stwierdzenie wydania decyzji z naruszeniem prawa
  → Skutek: podstawa roszczenia odszkodowawczego (art. 4171 §2 KC)

PO 30 LATACH od doręczenia decyzji:
  → ZAKAZ wszczęcia postępowania nieważnościowego (art. 158 §3 KPA)
  → Postępowania wszczęte po 30 latach umarza się z mocy prawa
  → Możliwe wyłącznie: odszkodowanie z KC

⚠️ Weryfikuj aktualne brzmienie art. 156 §2a i art. 158 §3 KPA w ISAP.
```

### Ustawa reprywatyzacyjna (nieruchomości warszawskie)

```
Komisja ds. reprywatyzacji nieruchomości warszawskich:
  → Bada decyzje zwrotowe wydane na podstawie dekretu Bieruta (1945)
  → Może uchylić decyzję zwrotową: w ciągu 5 lat od jej wydania
  → Dotyczy: nieruchomości na terenie m.st. Warszawy

Dawni właściciele / następcy prawni:
  → Po 30 latach od decyzji wywłaszczeniowej: wyłącznie odszkodowanie
  → Termin na odszkodowanie: 3 lata od stwierdzenia naruszenia prawa (art. 160 KPA
    — stare) lub art. 4171 §2 KC — weryfikuj aktualną podstawę w orzecznictwie
```

---

## 4. KALKULATOR TERMINÓW

```
Data decyzji wywłaszczeniowej / nacjonalizacyjnej: [___]
                                                          ↓
+ 10 lat → [___] = ostatni dzień na stwierdzenie nieważności
+ 30 lat → [___] = ostatni dzień na wszczęcie postępowania nieważnościowego
                    po tej dacie: wyłącznie odszkodowanie

⚠️ Sprawdź przepisy przejściowe ustawy z 2021 r. — weryfikuj ISAP.
```

---

## 5. STRATEGIA, DOWODY, QUALITY GATE, OUTPUT

**Strategia:** Przed wszczęciem postępowania — oblicz terminy z art. 156 §2a i art. 158 §3 KPA. Przy upływie 10 lat — wniosek o stwierdzenie naruszenia prawa + odszkodowanie z art. 4171 KC. Dla spraw warszawskich — sprawdź czy komisja reprywatyzacyjna ma właściwość.

**Dowody:** Data doręczenia decyzji (potwierdzenie z akt archiwalnych) + dokumenty własności + dokumenty nacjonalizacji/wywłaszczenia + wycena nieruchomości (przy odszkodowaniu).

**Quality gate:** Termin 10/30 lat obliczony? KPA art. 156 §2a zweryfikowany? Przepisy przejściowe (2021) sprawdzone?

**Output:** 1. Kwalifikacja (termin od decyzji); 2. Dopuszczalny tryb (nieważność / naruszenie prawa / odszkodowanie); 3. Dowody; 4. Strategia; 5. Rekomendacja.

**Powiązania:** `dr-02` → `mod-KC-cywilne-zobowiazania-odpowiedzialnosc` (odszkodowanie z art. 4171 KC) | `dr-04` → `mod-KPA` | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20251691 (KPA) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20210000795 (ustawa reprywatyzacyjna)
