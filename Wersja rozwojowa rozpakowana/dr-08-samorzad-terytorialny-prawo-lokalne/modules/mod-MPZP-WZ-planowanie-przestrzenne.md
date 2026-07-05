# mod-MPZP-WZ-planowanie-przestrzenne

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Ustawa o planowaniu i zagospodarowaniu przestrzennym — Dz.U. 2024 poz. 1130 t.j. ze zm. | Weryfikuj aktualne zmiany w ISAP
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## ⚡ ALERT — REFORMA PLANOWANIA PRZESTRZENNEGO 2023–2026

```
USTAWA z 07.07.2023 r. o zmianie ustawy o planowaniu i zagospodarowaniu przestrzennym
  → Nowe t.j. Dz.U. 2024 poz. 1130
  → Zlikwidowano STUDIUM UWARUNKOWAŃ — zastąpione przez PLAN OGÓLNY GMINY
  → Plan ogólny: akt prawa miejscowego obowiązkowy dla każdej gminy
    Termin uchwalenia planu ogólnego: 31.12.2025 r. (pierwotnie)
    → Weryfikuj aktualny termin i stan uchwalenia przez gminy
  → Zintegrowany Plan Inwestycyjny (ZPI): nowy instrument urbanistyczny
  web_search: "plan ogólny gminy termin uchwalenie 2025 2026 status"
```

---

## 1. CORE

### Zakres
Miejscowy Plan Zagospodarowania Przestrzennego (MPZP), decyzja o Warunkach Zabudowy (WZ), decyzja o ustaleniu lokalizacji inwestycji celu publicznego (ULICP), Plan Ogólny Gminy (nowy od 2024), Zintegrowany Plan Inwestycyjny (ZPI), renta planistyczna, odszkodowanie z tytułu obniżenia wartości nieruchomości, procedura uchwalania MPZP.

### Akty

| Akt | Dz.U. |
|---|---|
| Ustawa o planowaniu i zagospodarowaniu przestrzennym | Dz.U. 2024 poz. 1130 t.j. ze zm. |
| Ustawa Prawo budowlane | → DR-09 |
| Specustawa drogowa, kolejowa, mieszkaniowa | → DR-09 |

---

## 2. INTAKE

```
□ Instrument: MPZP / WZ / ULICP / Plan Ogólny / ZPI?
□ Czy gmina ma MPZP dla danego obszaru?
□ Czy obowiązuje plan ogólny gminy (sprawdź BIP gminy)?
□ Jaki jest problem: odmowa WZ / treść MPZP / renta planistyczna / odszkodowanie?
□ Data wydania decyzji → termin odwołania do SKO (14 dni)?
□ Czy przeprowadzono procedurę MPZP (wyłożenie, uwagi, konsultacje)?
```

---

## 3. PROCEDURA

### Hierarchia instrumentów planistycznych (po reformie 2023)

```
Plan ogólny gminy (NOWY — zastąpił Studium):
  → Akt prawa miejscowego
  → Obowiązkowy dla każdej gminy (termin: weryfikuj aktualnie)
  → Podstawa dla MPZP i decyzji WZ

MPZP (Miejscowy Plan Zagospodarowania Przestrzennego):
  → Akt prawa miejscowego
  → Szczegółowe przeznaczenie terenu, parametry zabudowy
  → Procedura: uchwała o przystąpieniu → opracowanie → wyłożenie do wglądu (21 dni min.)
    → uwagi publiczne → uchwalenie → publikacja w dzienniku woj.

WZ (Warunki Zabudowy):
  → Decyzja administracyjna (gdy brak MPZP dla obszaru)
  → Wydaje: wójt/burmistrz/prezydent
  → Odwołanie: SKO (14 dni) → WSA (30 dni od decyzji SKO)
  → Ważność: bezterminowa (ale może wygasnąć — weryfikuj przepisy)

ULICP (Ustalenie Lokalizacji Inwestycji Celu Publicznego):
  → Decyzja dla inwestycji publicznych na obszarze bez MPZP
  → Analogiczna procedura do WZ
```

### Renta planistyczna i odszkodowanie

```
RENTA PLANISTYCZNA (art. 36 ust. 4 u.p.z.p. — weryfikuj w ISAP):
  → Gdy wartość nieruchomości wzrosła wskutek uchwalenia / zmiany MPZP
  → Gmina może pobrać jednorazową opłatę przy zbyciu nieruchomości
  → Stawka: określona w MPZP (max 30%)
  → Termin gminy na pobranie: 5 lat od daty nabycia

ODSZKODOWANIE (art. 36 ust. 1–3 u.p.z.p. — weryfikuj w ISAP):
  → Gdy wskutek zmiany MPZP korzystanie z nieruchomości stało się niemożliwe
    lub istotnie ograniczone
  → Żądanie: odszkodowanie LUB wykup LUB zamiana nieruchomości
  → Termin na roszczenie: 5 lat od uchwalenia planu (weryfikuj w ISAP)
```

---

## 4. DOWODY, STRATEGIA, QUALITY GATE, OUTPUT

**Dowody:** Treść MPZP z dziennika urzędowego woj. (data uchwalenia) + mapa z granicami + decyzja WZ + protokoły z sesji + wycena nieruchomości (przy rencie planistycznej).

**Strategia:** Przy odmowie WZ — sprawdź warunki dobrosąsiedzkie (zabudowa na sąsiednich działkach). Przy rencie planistycznej — kwestionuj zasadność i obliczenie podstawy. Przy MPZP sprzecznym z planem ogólnym — zarzut niezgodności z aktem nadrzędnym.

**Quality gate:** MPZP potwierdzony w dzienniki.gov.pl? Plan ogólny uchwalony i obowiązuje? Termin odwołania od WZ (14 dni do SKO) nie upłynął?

**Output:** Kwalifikacja instrumentu → procedura → terminy → dowody → zarzuty → rekomendacja.

**Powiązania:** `mod-JST-ustroj-samorzad-gminny-powiatowy-wojewodztwa` | `dr-05` → `mod-ustawa-SKO` | `dr-09` (pozwolenie na budowę) | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20241130 | https://dzienniki.gov.pl
