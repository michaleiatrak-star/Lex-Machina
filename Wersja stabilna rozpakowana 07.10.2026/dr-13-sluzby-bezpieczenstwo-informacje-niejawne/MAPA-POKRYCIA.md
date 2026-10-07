# DR-13 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia korekt metryk nie jest częścią mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 — moduł istnieje i jest używany, ale brak pełnego audytu rozdziałowego;
- 🟡 B+ — pokrycie operacyjne pogłębione;
- ⚠️ — wymaga świeżej kontroli źródła przed zastosowaniem.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| ustawa o Policji | `mod-ustawa-policja` | 🟢/🟡 B+ |
| Straż Graniczna | `mod-ustawa-straz-graniczna` | 🟡 |
| Żandarmeria Wojskowa | `mod-ustawa-zandarmeria-wojskowa` | 🟡 |
| ABW / AW / CBA / SOP | `mod-ustawa-ABW-AW-CBA-sluzby-specjalne` | 🟡 |
| SKW / SWW | `mod-ustawa-SKW-SWW` | 🟡 |
| ochrona informacji niejawnych | `mod-ustawa-informacje-niejawne` | 🟡 |
| obrona Ojczyzny / mobilizacja | `mod-ustawa-obrona-ojczyzny-mobilizacja` | 🟢/🟡 B+ |
| ochrona ludności / obrona cywilna | `mod-ustawa-zarzadzanie-kryzysowe-obrona-cywilna` | 🟡 |
| KOZZiD / szczególne środki zabezpieczające | `mod-ustawa-szczegolne-srodki-zabezpieczajace` | 🟡 |
| środki przymusu bezpośredniego i broń palna | `mod-ustawa-policja` | 🟢/🟡 B+ |
| retencja danych / operacyjne wykorzystanie PKE | `mod-ustawa-sluzby-operacyjne-retencja-danych` | 🟡; prawo bazowe w DR-11 |
| Państwowa Straż Pożarna | `mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa` | 🟢/🟡 B+ |
| ochrona przeciwpożarowa | `mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa` | 🟢/🟡 B+ |
| OSP | `mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa` | 🟢/🟡 B+ |
| broń i amunicja — pozwolenia / cofnięcie / strzelnice | `mod-BronAmunU-pozwolenia-cofniecie-strzelnice` | 🟡 |

## Aktywne luki

1. Większość ustaw służb ma realny moduł, ale nie pełny audyt rozdziałowy całego aktu.
2. Priorytet pogłębiania: uprawnienia operacyjne, kontrola sądowa/prokuratorska, środki przymusu i odpowiedzialność funkcjonariuszy.
3. Retencja danych wymaga wspólnego odczytu DR-11 i aktualnego PKE.
4. Każdy konkretny przepis wymaga świeżego ELI/ISAP przed użyciem.
