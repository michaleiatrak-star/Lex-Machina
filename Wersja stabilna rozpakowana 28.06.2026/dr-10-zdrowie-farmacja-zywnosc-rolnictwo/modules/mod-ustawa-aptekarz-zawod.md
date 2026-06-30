# mod-ustawa-aptekarz-zawod — Aptekarz (farmaceuta) jako zawód zaufania publicznego

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
**Status:** moduł NOWY — utworzony 2026-06-14 (audyt: pokrycie "zawodów zaufania
publicznego" — grupa (b) zawody medyczne i pokrewne, analiza Senatu OT-625).

⚠️ ROZGRANICZENIE OD mod-PrFarm-*: moduły mod-PrFarm-prawo-farmaceutyczne i
mod-PrFarm-szczegolowy regulują APTEKĘ JAKO BIZNES (zezwolenia, obrót lekami,
nadzór GIF/WIF nad placówkami). TEN moduł = APTEKARZ/FARMACEUTA JAKO ZAWÓD
z własnym samorządem (analogicznie do podziału "komornik jako zawód" vs
"tryb egzekucji" — NOTA-8).
---
⛔ ZAKAZ podawania artykułów, terminów, kwot, sygnatur z pamięci — weryfikuj
w isap.sejm.gov.pl przed każdym powołaniem.
---

## KLUCZOWE AKTY PRAWNE — ZWERYFIKOWANE 2026-06-14

```
Ustawa o izbach aptekarskich (z 19.04.1991):
  t.j. Dz.U. 2025 poz. 1693 ✅ VER: isap.sejm.gov.pl 2026-06-14
  → obwieszczenie Marszałka Sejmu z 7.11.2025, opublikowane ok. 4.12.2025
  → https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001693
  ⚠️ Poprzedni t.j.: Dz.U. 2024 poz. 688 (obwieszczenie 24.04.2024) —
     przy dokumentach/orzeczeniach z 2024 sprawdź właściwą metrykę
     temporalną (TEMPORAL-LAW-CHECK)

Powiązane (kontekst — patrz mod-PrFarm-* dla treści):
  Prawo farmaceutyczne — DR-10/mod-PrFarm-prawo-farmaceutyczne
  Ustawa o zawodzie farmaceuty (jeśli odrębna od ustawy o izbach aptekarskich)
    — WERYFIKUJ online, czy istnieje osobna "ustawa o zawodzie farmaceuty"
    z 2020 r. i jej aktualny t.j. (możliwy odrębny akt regulujący zakres
    czynności zawodowych farmaceuty, niezależny od ustawy o izbach)
```

---

## ZASADY ABSOLUTNE

```
1. Art. 1 ustawy o izbach aptekarskich: Naczelna Izba Aptekarska i okręgowe
   izby aptekarskie stanowią SAMORZĄD ZAWODU FARMACEUTY — reprezentację
   zawodowych, społecznych i gospodarczych interesów tego zawodu. Samorząd
   jest niezależny i podlega tylko ustawom. NIA i izby okręgowe mają
   osobowość prawną. ✅ VER: arslege.pl/isap (treść art. 1)

2. Zadania samorządu (art. 7 — weryfikuj numerację w t.j. 2025/1693):
   → przyznawanie prawa wykonywania zawodu farmaceuty
   → zawieszanie i pozbawianie prawa wykonywania zawodu oraz ograniczanie
     w wykonywaniu zawodu
   → prowadzenie postępowania w przedmiocie niezdolności do wykonywania
     zawodu farmaceuty
   → prowadzenie REJESTRU FARMACEUTÓW
   → współdziałanie w sprawach specjalizacji zawodowej
   → OPINIOWANIE wniosków o udzielenie/cofnięcie zezwoleń na prowadzenie
     APTEK LUB HURTOWNI (⚠️ to jest pomost do mod-PrFarm-* — opinia izby
     w postępowaniu zezwoleniowym prowadzonym przez WIF/GIF)
   → opiniowanie projektów aktów normatywnych dot. produktów leczniczych,
     apteki i wykonywania zawodu farmaceuty

3. System IMI: współpraca z organami państw członkowskich UE realizowana
   przez System Wymiany Informacji na Rynku Wewnętrznym (IMI) — istotne dla
   uznawania kwalifikacji farmaceutów z UE/EOG/Szwajcarii.

4. Rejestr farmaceutów: farmaceuta ma obowiązek informować NIEZWŁOCZNIE
   właściwą okręgową izbę aptekarską o danych objętych rejestrem i KAŻDEJ
   ZMIANIE tych danych (weryfikuj aktualny katalog danych — obejmuje m.in.
   informacje o dopełnieniu obowiązku podnoszenia kwalifikacji zawodowych
   wg art. 107zf Prawa farmaceutycznego).

5. Odpowiedzialność dyscyplinarna i zawodowa farmaceuty — sądy/rzecznicy
   dyscyplinarni samorządu aptekarskiego. WERYFIKUJ aktualną procedurę
   (rozdziały dot. odpowiedzialności zawodowej w t.j. 2025/1693).

6. ⚠️ ROZGRANICZENIE Z mod-PrFarm-*:
   → SPRAWA O APTEKARZA jako osobę (prawo wykonywania zawodu, wpis do
     rejestru, odpowiedzialność dyscyplinarna, kwalifikacje) → TEN moduł
   → SPRAWA O APTEKĘ jako placówkę (zezwolenie na prowadzenie, kontrola GIF/
     WIF, refundacja, obrót lekami) → mod-PrFarm-prawo-farmaceutyczne /
     mod-PrFarm-szczegolowy / mod-PrFarm-refundacja-nadzor-sankcje
   → Opinia izby aptekarskiej w postępowaniu o zezwolenie na aptekę/hurtownię
     ŁĄCZY oba moduły — sprawdź obie strony procedury.
```

---

## INTAKE

```
□ rola: farmaceuta/aptekarz / izba aptekarska (NIA/okręgowa) / WIF-GIF /
  pacjent
□ przedmiot: prawo wykonywania zawodu, wpis/wykreślenie z rejestru
  farmaceutów, zawieszenie/pozbawienie prawa wykonywania zawodu,
  odpowiedzialność dyscyplinarna, opinia izby w postępowaniu zezwoleniowym
□ czy sprawa dotyczy APTEKARZA (osoby, ten moduł) czy APTEKI (placówki,
  mod-PrFarm-*) — jeśli oba aspekty, rozdziel i zastosuj obie ścieżki
□ czy farmaceuta jest obywatelem UE/EOG/Szwajcarii — sprawdź IMI/uznawanie
  kwalifikacji
□ data uchwały izby / decyzji i termin na środek
```

---

## MAPA PROCEDURALNA

```
Uchwała izby aptekarskiej (przyznanie/odmowa/zawieszenie/pozbawienie prawa
wykonywania zawodu, wpis do rejestru, kara dyscyplinarna)
  ↓
Kwalifikacja: postępowanie korporacyjne (izba) / odpowiedzialność
  dyscyplinarna / sprawa o niezdolność do wykonywania zawodu / kontrola
  sądowa uchwały (WSA — sprawdź aktualny tryb w t.j. 2025/1693)
  ↓
Właściwy organ: okręgowa izba aptekarska / Naczelna Izba Aptekarska / sąd
  dyscyplinarny izby / WSA (jeśli decyzja administracyjna)
  ↓
Środek: odwołanie korporacyjne (do NIA) / skarga do WSA / odwołanie
  dyscyplinarne
  ↓
Walidacja: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
```

---

## WARUNKI SKUTECZNOŚCI

```
□ prawidłowy organ (okręgowa izba / NIA / sąd dyscyplinarny / WSA)
□ termin na środek — weryfikuj aktualny t.j. (2025/1693)
□ legitymacja: farmaceuta / izba / WIF-GIF (w sprawach zezwoleniowych)
□ kontrola ISAP na dzień zdarzenia i na dzień orzekania (t.j. 2024/688 →
  2025/1693 — sprawdź, która wersja obowiązywała w dacie zdarzenia)
```

---

## ORZECZNICTWO

```
Nie twórz fikcyjnych sygnatur. Szukaj w:
- orzeczenia.nsa.gov.pl (kontrola uchwał izb aptekarskich)
- sn.pl
- LEX/Legalis pomocniczo

web_search: "izba aptekarska odmowa prawa wykonywania zawodu skarga WSA orzecznictwo"
web_search: "odpowiedzialność dyscyplinarna farmaceuty izba aptekarska orzecznictwo"
web_search: "ustawa o zawodzie farmaceuty 2020 tekst jednolity isap"
```

---

## QUALITY GATE

```
□ Czy zastosowano aktualny t.j. (Dz.U. 2025 poz. 1693), nie starszy (2024/688)?
□ Czy rozróżniono APTEKARZA (osoba, ten moduł) od APTEKI (placówka,
  mod-PrFarm-*)?
□ Jeśli sprawa dotyczy opinii izby w postępowaniu zezwoleniowym (apteka/
  hurtownia) — czy zastosowano OBA moduły (ten + mod-PrFarm-*)?
□ Czy sprawdzono istnienie odrębnej "ustawy o zawodzie farmaceuty" (2020)
  i jej relację do ustawy o izbach aptekarskich?
□ Czy każde brzmienie przepisu zweryfikowane online — żadnych cytatów
  z pamięci?
```

---

## POWIĄZANIA

| Sytuacja | Skill / Moduł |
|---|---|
| Apteka jako placówka — zezwolenia, obrót lekami, refundacja | DR-10/`mod-PrFarm-prawo-farmaceutyczne`, `mod-PrFarm-szczegolowy`, `mod-PrFarm-refundacja-nadzor-sankcje` |
| Nadzór farmaceutyczny GIF/WIF | DR-10/`mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny` |
| Wyroby medyczne sprzedawane w aptece | DR-10/`mod-wyroby-medyczne` |
| RODO — dokumentacja farmaceuty/pacjenta | DR-11 → moduły RODO |
| Pismo: odwołanie / skarga | `pisma-procesowe-v3` albo `pisma-proste-v2` |

---

## ŹRÓDŁA WERYFIKACJI

| Źródło | URL | Zakres |
|---|---|---|
| ISAP — tekst jednolity | isap.sejm.gov.pl | Dz.U. 2025 poz. 1693, 2024 poz. 688 |
| Naczelna Izba Aptekarska | nia.org.pl / nia.gov.pl | Samorząd, rejestr farmaceutów, komunikaty |
| Orzecznictwo NSA | orzeczenia.nsa.gov.pl | Kontrola uchwał izb aptekarskich |

---

## ⚖️ DISCLAIMER

Po zakończeniu analizy: `view /mnt/skills/user/shared/DISCLAIMER.md` — wariant wg trybu (PRAWNIK/LAIK).

---
*mod-ustawa-aptekarz-zawod.md · dr-10 · utworzony 2026-06-14*
