# MD3b — WALIDACJA PRAWNA (DOPUSZCZALNOŚĆ + SPRZECZNOŚĆ Z PRAWEM)

```
□ NAGRANIA bez wiedzy nagrywanej + miejsce prywatne
  → ryzyko art. 267 §3 KK; sąd cywilny może dopuścić (SN III CSK 253/13)
  → sąd karny: art. 168a KPK — zakaz dowodowy
  → aktualizuj M2: nielegalne=-4.0 / wątpliwe=-1.5

□ DANE OSOBOWE: art. 5–6 RODO; dane pracownika art. 22¹ KP

□ TAJEMNICE ZAWODOWE:
  adwokacka (art. 6 PrAdw) · lekarska (art. 40 UZL) · spowiedzi (art. 178 §2 KPK)

□ PREKLUZJA: art. 207 §6 KPC; postęp. gosp.: art. 458¹ KPC

□ ZAKAZ art. 246–247 KPC: zeznania zamiast / przeciw dokumentowi
```

### ► SKANOWANIE SPRZECZNOŚCI Z PRAWEM (obowiązkowe dla każdego dokumentu)

Dla każdego analizowanego dokumentu sprawdź aktywnie, czy jego treść jest sprzeczna
z obowiązującym przepisem prawa. Weryfikuj online w ISAP przed wystawieniem alertu.

**Lista kontrolna:**
```
□ Klauzule umowne sprzeczne z przepisami bezwzględnie obowiązującymi (ius cogens)?
  → np. wyłączenie odpowiedzialności wbrew art. 473 §2 KC, kary umowne nadmierne
□ Postanowienia naruszające przepisy ochronne (art. 385¹ KC — klauzule abuzywne)?
□ Treść niezgodna z normą wynikającą z przepisu KP / KPC / KPK / KPA?
□ Opis zdarzenia sprzeczny z definicją ustawową (np. „wypowiedzenie" bez zachowania formy z art. 30 §3 KP)?
□ Data / termin naruszający normy obliczania terminów (art. 111–115 KC)?
□ Zapis naruszający RODO (art. 5 ust. 1, art. 6 RODO)?
```

**Dla każdej wykrytej sprzeczności z prawem — format obowiązkowy:**
```
[⚡ LEG-CONTRA-N] STATUS: DO SPRAWDZENIA / KRYTYCZNE
DOKUMENT: [nazwa] · STRONA/LOK.: [np. str. 3 / §4 pkt 2 / akapit 2]
CYTAT:    „[dosłowny fragment max 100 zn. powodujący wątpliwość]"
PROBLEM:  [opis sprzeczności]
PRZEPIS:  [art. X ustawy Y — zweryfikowany w ISAP]
SKUTEK:   [nieważność / dopuszczalność / wykluczenie dowodu / sankcja]
REKOMENDACJA: [co zrobić: zmień / usuń / zwróć uwagę sądu / uzyskaj opinię]
```

**Alert walidacyjny do dashboardu:**
```
alerts_data.crit.push({code:'LEG-CONTRA-N', dowod:'[nazwa]',
  ryzyko:'[opis]', rek:'[rekomendacja]', podstawa:'[art.]'})
```

---

