# Changelog — analizator-dowodow-v3

## v5.2.0 (aktualna)
- **NOWE**: Reguła Precyzji Detalu §P1–P3 — obowiązkowa przy każdej analizie
- **NOWE**: Typ INTRA-CONTRA — wykrywanie zmian narracji tej samej strony między pismami
- **NOWE**: Checklist §P2 (8 punktów) wykonywany przed wygenerowaniem zakładki Sprzeczności
- **NOWE**: Format [INTRA]/[CROSS]/[LEG] w dashboardzie z wymogiem dwóch cytatów + lokalizacji
- **FIX**: Przykład kanoniczny konta @gmail.com vs @humanpark.pl (sprawa VII P 94/25) —
  sprzeczność wewnętrzna Pozwanej między pismem z 04.2025 a 06.2025 co do kwalifikacji konta
- **ZASADA**: Zawsze porównuj twierdzenia tej samej strony pismo-po-piśmie, nie tylko cross-strony

## v5.1.0
- centralny router — jeden decision tree, moduły wczytywane wyłącznie on-demand

## v5.0.0
- **FUZJA**: połączenie analizator-dowodow-v4 + analiza-pism-v4 w jeden pełny modularny zestaw
- **NOWE**: Moduł MX — wykrywanie dziedzin prawa z macierzą 25 dziedzin i routingiem specjalistycznym
- **NOWE**: Warstwa P (pisma) — 14 modułów MP0–MP13 z pełną analizą śledczą, narracyjną i faktyczną
- **NOWE**: MP6 — techniki śledcze (profilowanie, HUMINT, VSA, OSINT, behawiorystyka)
- **NOWE**: MP13 — synteza faktyczna (klastry, łańcuchy przyczynowe, zbieżności, narracja)
- **NOWE**: Kwalifikator karny zintegrowany z routingiem MX
- **NOWE**: Tablice `dziedziny[]` w dashboardzie v5
- **ZACHOWANE**: Ścieżka produkcyjna `/mnt/skills/user/analizator-dowodow-v3/` — bez zmian
- **ZACHOWANE**: Dashboard HTML, widget-kreator, hierarchia A–D, scoring 0–10
- Warstwa D (dowodowa): moduły MD1–MD6 — identyczne z v4 (wydzielone do osobnych plików)

## v4.0.0
- Dedykowana zakładka Sprzeczności z cytatami i lokalizacją
- M3b: skanowanie sprzeczności z prawem (alerty LEG-CONTRA)
- Widget-kreator v2

## v3.x
- Wersja inicjalna analizatora dowodów
