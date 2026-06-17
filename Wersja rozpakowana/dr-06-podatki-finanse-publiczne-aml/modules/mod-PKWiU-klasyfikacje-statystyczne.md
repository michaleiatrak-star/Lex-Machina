# mod-PKWiU-klasyfikacje-statystyczne.md
## DR-06 · Podatki · Klasyfikacje statystyczne (PKWiU/CN/PKOB/KŚT)

> Wydzielony 2026-06-14 z mod-interpretacje-definicje-podatkowe.md
> (sekcja 4), w ramach realizacji NOTA-4 (audyt-systemu-v4/CHECKLIST-DEDUP.md
> — moduł >400 linii). Temat przekrojowy — referencjonowany przez
> mod-VAT, mod-PIT, mod-CIT — wydzielenie umożliwia selektywne ładowanie
> (lazy loading) bez wczytywania całego modułu interpretacji podatkowych.

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, klasyfikacji, kodu PKWiU/CN/PKOB lub daty
wejścia w życie:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. **NIGDY** nie podawaj kodu klasyfikacji, daty przejścia lub stawki
   wyłącznie z pamięci modelu — klasyfikacje i terminy przejściowe
   zmieniają się.

---

## KLASYFIKACJE STATYSTYCZNE — PKWiU / CN / PKOB / KŚT

### PKWiU 2025 — przełomowa zmiana

```
STAN OBECNY (zweryfikowany 2026-06-09):
  PKWiU 2025: obowiązuje od 01.01.2026 r. (Dz.U. 2025 — Rozp. RM z 17.12.2025)
    → W STATYSTYCE, EWIDENCJI, RACHUNKOWOŚCI, REJESTRACH PUBLICZNYCH

  PKWiU 2015 (Dz.U. 2015 poz. 1676 ze zm.) — stosowana do celów PODATKOWYCH:
    → VAT: stosuje się do celów VAT do dnia 31.12.2027 r.
    → PIT/CIT/Ryczałt: stosuje się do celów PIT, CIT, ryczałtu do dnia 31.12.2028 r.
    → Pełne przejście na PKWiU 2025 w podatkach: od 01.01.2029 r.

⚠️ PUŁAPKA: WIS wydane pod PKWiU 2015 = ważne do 31.12.2027 (VAT)
  Ryczałt 2026–2028: nadal PKWiU 2015 — weryfikuj kody przy rozliczeniu ryczałtu!

DLACZEGO TO WAŻNE:
  → Stawki VAT obniżone: powiązane z PKWiU (np. 5% żywność, 8% usługi budowlane)
  → Ryczałt ewidencjonowany: stawki (8,5% / 12% / 15% / 17%) zależą od PKWiU
  → Split payment: obligatoryjny dla towarów z zał. 15 do ustawy VAT (kody PKWiU)
  → IP Box: kwalifikowane IP = program komputerowy (PKWiU 62.01 = usługi programistyczne)

  web_search: "PKWiU 2025 nowe kody tabela zmiana PKWiU 2015 co się zmieniło"
  web_search: "PKWiU 2015 do kiedy obowiązuje VAT PIT ryczałt 2026 2027 2028"

KLASYFIKACJA OBIEKTÓW BUDOWLANYCH (PKOB):
  → Używana przy PON (podatek od nieruchomości), pozwolenia budowlane
  → Rozporządzenie RM Dz.U. 1999 poz. 1316 (z późn. zm.) — weryfikuj aktualność
  → Powiązana z KŚT (Klasyfikacja Środków Trwałych) — amortyzacja podatkowa

NOMENKLATURA SCALONA (CN):
  → Używana przy VAT importowym, akcyzie, cłach
  → Europejska, aktualizowana rokrocznie przez KE
  → Szukaj: EUR-Lex → Nomenclature combinée
```

---

## POWIĄZANIA

| Temat | Skill / Moduł |
|---|---|
| Stawki VAT, WIS, split payment | `mod-VAT-podatek-od-towarow-i-uslug` |
| Ryczałt ewidencjonowany, IP Box | `mod-PIT-podatek-dochodowy-fizyczne` |
| Amortyzacja (KŚT) | `mod-CIT-podatek-dochodowy-prawne` |
| Podatek od nieruchomości (PKOB) | `dr-08/modules/mod-lokalne-podatki-oplaty-taryfy.md` |
| Interpretacje i definicje podatkowe ogólne | `mod-interpretacje-definicje-podatkowe.md` |
