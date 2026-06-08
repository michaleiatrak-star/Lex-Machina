# MD1 — Identyfikacja i klasyfikacja dowodów

## Cel
Sklasyfikować każdy dowód, przypisać poziom hierarchii A–D i określić jego
rolę procesową. MD1 jest zawsze pierwszym modułem warstwy D.

## Format karty dowodu

```
DOWÓD:   [nazwa]
TYP:     [dokument urzędowy / zeznanie / nagranie / korespondencja / twierdzenie / opinia / inny]
POZIOM:  [A / B / C / D]
DATA:    [data dokumentu lub zdarzenia]
STRONA:  [pro / contra / neutralny]
OPIS:    [1 zdanie o treści i znaczeniu procesowym]
DZIEDZINY: [kody z MX — np. CYW-ZOB, PRAC-ROZW]
```

## Hierarchia A–D

| Poziom | Typ | Moc | Przykłady |
|--------|-----|-----|-----------| 
| **A** | Dokumenty urzędowe | NAJWYŻSZA | Protokoły PIP/ZUS/UOKiK z sygnaturą, orzeczenia prawomocne, wpisy KRS/KW, decyzje administracyjne |
| **B** | Zeznania formalne, opinie biegłych | WYSOKA | Zeznania do protokołu pod rygorem art. 233 §1 KK, opinie biegłych sądowych, protokoły przesłuchań |
| **C** | Dokumenty prywatne, ślady cyfrowe | ŚREDNIA | Umowy prywatne, e-mail/SMS, nagrania, zdjęcia, faktury, logi IT, korespondencja |
| **D** | Twierdzenia bez dokumentu | ZEROWA | Oświadczenia ustne, twierdzenia strony bez potwierdzenia |

## Reguły korekty poziomu

- Kopia + poświadczenie radcy/adwokata → równoważna oryginałowi (art. 129 §3 KPC)
- Dokument A bez pieczęci/sygnatury → obniż do B, alert M3a
- Twierdzenie D + SMS/mail → podnieś do C
- Nagranie bez pewności legalności → wstrzymaj, wczytaj MD3b

## Alert poziomu D (obowiązkowy)

Każdy dowód D wymaga natychmiastowego alertu:
```
[⚠ POZIOM-D] Problem: brak dokumentu · Ryzyko: art. 6 KC
Rekomendacja: [konkretne uzupełnienie]
```

## Integracja z MX

Po sklasyfikowaniu uzupełnij kolumnę DZIEDZINY o kody wykryte w MX.
Jeśli MX nie był jeszcze uruchomiony — uruchom go teraz, zanim przejdziesz do MD2.
