# DR-15 — Lokalna Mapa Aktów Prawnych

## Compliance, ISO, governance, audyt

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / norma → moduł**. Historia korekt i zamkniętych flag pozostaje poza runtime.

| Akt / norma | Bieżące źródło | Moduł / routing | Status runtime |
|---|---|---|---|
| Prawo zamówień publicznych — obronność i bezpieczeństwo | Dz.U. 2026 poz. 793 t.j. ze zm. | `mod-PZP-zamowienia-obronne-bezpieczenstwa` | ✅ aktywny; fresh gate |
| Ustawa AML — nadzór finansowy / instytucje obowiązane | Dz.U. 2025 poz. 644 t.j. ze zm. | `mod-AML-nadzor-finansowy-instytucje` | ✅ aktywny; fresh gate |
| Karta Nauczyciela + Prawo o szkolnictwie wyższym — compliance pracodawcy | KN: Dz.U. 2026 poz. 515 t.j. ze zm.; PSWiN: Dz.U. 2024 poz. 1571 t.j. ze zm. | `mod-ustawa-nauczyciele-uczelnie` | ✅ aktywny; fresh gate |
| Ustawa o ochronie sygnalistów | Dz.U. 2024 poz. 928 ze zm. | `mod-ustawa-sygnalisci` | ✅ aktywny |
| Ustawa o ograniczeniu prowadzenia działalności gospodarczej przez osoby pełniące funkcje publiczne | Dz.U. 2025 poz. 499 t.j. ze zm. | `mod-ustawa-antykorupcyjna-1997-ograniczenia` | ✅ aktywny; fresh gate |
| ISO 37001 — anti-bribery management | aktualna wersja normy ISO | `mod-ISO-37001-antykorupcja` | ✅ aktywny; norma fresh gate |
| ISO/IEC 27001 — information security management | aktualna wersja normy ISO/IEC | `mod-ISO-27001-bezpieczenstwo-informacji` | ✅ aktywny; norma fresh gate |
| ISO/IEC 42001 — AI management system | aktualna wersja normy ISO/IEC | `mod-ISO-42001-AI-management` | ✅ aktywny; norma fresh gate |
| ISO 37301 — compliance management systems | aktualna wersja normy ISO | `mod-ISO-37301-compliance-management` | ✅ aktywny; norma fresh gate |
| DORA — compliance sektora finansowego | rozporządzenie (UE) 2022/2554 | `mod-DORA-compliance-sektor-finansowy` | ✅ aktywny; EUR-Lex fresh gate |

## Reguły runtime

- każdy fizyczny moduł DR-15 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`;
- mapy nie przechowują dawnych numerów, opisów korekt, flag ani historii sesji;
- przy normach ISO/IEC zawsze sprawdź aktualne wydanie/licencjonowane źródło; przy aktach prawnych — właściwy publikator urzędowy;
- status runtime wskazuje routing, nie kompletność treści ani certyfikację zgodności organizacji.
