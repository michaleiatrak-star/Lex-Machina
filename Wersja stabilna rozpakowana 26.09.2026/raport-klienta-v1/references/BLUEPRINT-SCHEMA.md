# BLUEPRINT-SCHEMA — schemat danych przekazywanych do show_widget

> **Plik:** `raport-klienta-v1/references/BLUEPRINT-SCHEMA.md`
> **Wersja:** 1.0 (2026-09-05) — utworzony w ramach F-163.
> **Wywołanie:** KROK 4 sekwencji („wyciągnij dane") oraz sekcja
> „SCHEMAT DANYCH WIDGETU" w SKILL.md, która odsyła tu po pełny schemat.

⛔ **Reguła nadrzędna, powtórzona za SKILL.md: pola bez danych → `null`.
Nie wymyślaj danych.** Widget renderuje wyłącznie pola niepuste; pole
wypełnione zgadywaniem trafia do klienta jako ustalenie kancelarii.

⛔ **Filtr treści.** Do blueprintu nie wolno przenieść niczego z listy
„CZEGO NIGDY NIE POKAZYWAĆ KLIENTOWI" (SKILL.md): wewnętrznej oceny słabości
pozycji, dowodów A/B/C/D, wariantów obrony, notatek roboczych, taktyki wobec
przeciwnika, nieanonimizowanych cytatów z akt. Schemat celowo **nie ma pól**,
w które dałoby się to wpisać.

---

## 1. POLA WSPÓLNE — [IND] i [BIZ]

| Pole | Typ | Uwagi |
|---|---|---|
| `profile` | `"IND"` \| `"BIZ"` | wymagane |
| `tryb` | `"standard"` \| `"zle_wiadomosci"` \| `"ograniczenie_szkod"` \| `"brak_nowosci"` | wymagane; ustalane w KROK 1A |
| `kancelaria` | string | nazwa i dane kancelarii |
| `klient` | string | oznaczenie odbiorcy raportu |
| `prawnik` | string | prowadzący sprawę |
| `sprawa` | string | 1–2 zdania, język klienta |
| `etap` | string | bieżący etap postępowania |
| `ocena` | obiekt | patrz §2 — **różny dla IND i BIZ** |
| `terminy` | lista | `{ nazwa, data, odpowiedzialny }` |
| `kontekst` | string | 2–3 zdania |
| `delta` | lista \| `null` | zmiany od poprzedniego raportu; `null` przy pierwszym |
| `assessment.level` | `"good"` \| `"neutral"` \| `"bad"` \| `"lost"` | patrz §3 |

---

## 2. POLE `ocena` — dwa różne kształty

⛔ **Najczęstszy błąd tego schematu:** wstawienie predykcji procentowej
do raportu [IND]. SKILL.md przewiduje procenty **wyłącznie dla BIZ**.

**[IND] — opisowa:**
```json
{ "opis": "Pozycja w sprawie pozostaje korzystna", "podstawa": "…" }
```

**[BIZ] — procentowa:**
```json
{
  "wynik_korzystny_proc": 70,
  "wariant_alternatywny_proc": 30,
  "przedzial_ufnosci": "sredni",
  "liczba_czynnikow": 8
}
```
`przedzial_ufnosci`: `"niski"` \| `"sredni"` \| `"wysoki"`.

⚠️ Suma procentów nie musi dawać 100, jeśli warianty się nie wykluczają —
ale wtedy **nazwij to w opisie**, inaczej odbiorca odczyta różnicę jako błąd.

---

## 3. POLE `assessment.level` — mapowanie na tryb

| Tryb | Dopuszczalny `level` |
|---|---|
| `standard` | `good` / `neutral` / `bad` |
| `zle_wiadomosci` | **`bad`** — ⛔ nigdy `lost`, sprawa nie jest zakończona |
| `ograniczenie_szkod` | **`lost`** |
| `brak_nowosci` | bez zmiany względem poprzedniego raportu |

⛔ To jest bramka spójności: `level = "lost"` przy trybie innym niż
`ograniczenie_szkod` oznacza, że tryb rozpoznano błędnie w KROK 1A.

---

## 4. POLA WYŁĄCZNIE [BIZ]

| Pole | Typ | Źródło |
|---|---|---|
| `kwoty` | lista | `{ pozycja, kwota_pln, prawdopodobienstwo, wartosc_oczekiwana }` — §1 `sekcje-biznesowe.md` |
| `risk_table` | lista | `{ klauzula, dni, pln, proc_wartosci_umowy }` — z `mod-shared-economic.md` |
| `harmonogram` | lista | `{ etap, termin, odpowiedzialny, status }` |
| `wplyw_na_dzialalnosc` | obiekt | `{ reputacja, operacje, kontrakty, compliance }` — pola bez treści pomijaj |
| `luki_kontraktowe` | lista (maks. 3) | `{ klauzula, ryzyko, priorytet }`, priorytet `"czerwony"`/`"pomaranczowy"`/`"zolty"` |
| `dzialania_klienta` | lista (maks. 5) | `{ dzialanie, termin, uzasadnienie }` |
| `rekomendacje_zarzad` | lista (1–3) | `{ rekomendacja, uzasadnienie, alternatywa_odrzucona }` |
| `klauzula_nda` | string \| `null` | ⛔ `null`, jeśli klauzuli nie ustalono |

---

## 5. POLA WYŁĄCZNIE [IND]

| Pole | Typ | Uwagi |
|---|---|---|
| `potwierdzenie_odbioru` | bool \| `null` | tylko gdy wymagane |

---

## 6. POLA TRYBÓW SPECJALNYCH

**`zle_wiadomosci`** — obecne wyłącznie przy tym trybie:
```json
{ "fakt": "…", "znaczenie": "…", "przyczyna": "…",
  "co_dalej": { "srodek": "…", "termin": "…", "po_stronie_klienta": "…" } }
```
⛔ `co_dalej.srodek` i `co_dalej.termin` **nie mogą być `null`**. Jeśli są —
tryb rozpoznano błędnie; wróć do KROK 1A.

**`ograniczenie_szkod`** — obecne wyłącznie przy tym trybie:
```json
{ "wynik": "…", "zamkniete": ["…"],
  "do_rozliczenia": [{ "pozycja": "…", "termin": "…", "odpowiedzialny": "…" }],
  "natychmiastowe": ["…"],
  "ryzyka_rezydualne": ["…"] }
```
⛔ Każda pozycja `do_rozliczenia` musi mieć `termin` **i** `odpowiedzialny`.
⚠️ `ryzyka_rezydualne` puste → wstaw jawne zdanie o braku ryzyk, nie pustą listę.

---

## 7. BRAMKA SPÓJNOŚCI PRZED `show_widget`

```
□ profile i tryb ustawione?
□ ocena ma kształt właściwy dla profilu (IND opisowa / BIZ procentowa)?
□ assessment.level zgodny z trybem (§3)?
□ pola BIZ obecne TYLKO przy profile = "BIZ"?
□ pola trybu specjalnego obecne TYLKO przy swoim trybie?
□ zle_wiadomosci: co_dalej.srodek i .termin niepuste?
□ ograniczenie_szkod: każda pozycja do_rozliczenia ma termin i odpowiedzialnego?
□ ograniczenie_szkod: BRAK predykcji procentowej i BRAK harmonogramu etapów
  postępowania?
□ żadne pole nie zawiera treści z listy „czego nigdy nie pokazywać"?
□ pola bez danych są null, a nie wypełnione szacunkiem?
```
