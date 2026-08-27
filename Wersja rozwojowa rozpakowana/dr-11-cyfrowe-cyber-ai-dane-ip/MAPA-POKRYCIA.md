# DR-11-CYFROWE-CYBER-AI-DANE-IP — Mapa Pokrycia Treściowego

**Utworzona:** 2026-08-27 | **Źródło inwentarza:** lokalna `MAPA-AKTOW.md`

## Zasada statusów

Ta mapa rozdziela **rejestrację aktu/modułu** od **pokrycia treściowego**. Status `✅ OK` w `MAPA-AKTOW.md` oznacza, że istnieje trasa/moduł i metryka, a **nie** że cały akt jest opracowany. Wiersz `🟡 DO AUDYTU` oznacza, że moduł jest zarejestrowany, lecz dla całego aktu nie wykonano jeszcze udokumentowanego audytu rozdział-po-rozdziale. Nie wolno automatycznie zamieniać go na 🟢 na podstawie samego istnienia pliku.

| Akt / zakres | Moduł wejściowy | Rejestracja w MAPA-AKTOW | Status treściowy |
|---|---|---|---|
| Rozporządzenie RODO (UE) 2016/679 | mod-RODO-GDPR-2016-679 | ✅ OK | 🟡 DO AUDYTU |
| RODO — szczegółowy | mod-RODO-szczegolowy | ✅ OK | 🟡 DO AUDYTU |
| RODO — DPIA / ocena skutków dla ochrony danych (art. 35–36) | mod-RODO-DPIA-ocena-skutkow | ✅ Dodany 2026-07-05 (AUDYT-2026-07-05a), WPISANY DO MAPY 2026-08-14 (naprawa F-48 lit. b) | 🟡 DO AUDYTU |
| RODO — DSAR / żądania podmiotów danych (art. 12, 15–22) | mod-RODO-DSAR-zadania-osob | ✅ Dodany 2026-07-05 (AUDYT-2026-07-05a), WPISANY DO MAPY 2026-08-14 (naprawa F-48 lit. b) | 🟡 DO AUDYTU |
| RODO — RCP / rejestr czynności przetwarzania (art. 30) + umowa powierzenia DPA (art. 28) | mod-RODO-RCP-DPA-rejestr-powierzenie | ✅ Dodany 2026-07-05 (AUDYT-2026-07-05a), WPISANY DO MAPY 2026-08-14 (naprawa F-48 lit. b) | 🟡 DO AUDYTU |
| Ustawa UODO — implementacja RODO | mod-UODO-postepowanie-ochrona-danych | ✅ OK — ROZBUDOWANE 2026-07-21: sekcja 9 (merytoryczna treść skargi + korekta GIODO→UODO), odpowiedź  | 🟡 DO AUDYTU |
| Ustawa o KSC + NIS2 (Dyrektywa UE 2022/2555) | mod-KSC-NIS2-cyberbezpieczenstwo-telekom | ✅ OK — ZAMKNIĘTE 2026-07-26 (audyt pełnego systemu): moduł uzupełniony o brakujący aktualny numer t. | 🟡 DO AUDYTU |
| DORA (Rozp. UE 2022/2554) + eIDAS 2.0 | mod-DORA-eIDAS-cyfrowe-finanse | ✅ OK | 🟡 DO AUDYTU |
| Prawo komunikacji elektronicznej (⚠️ POPRAWKA 2026-07-02zz: BYŁO błędnie nazwane "Prawo telekomunikacyjne" — stara ustawa telekomunikacyjna z 2004 r. została CAŁKOWICIE ZASTĄPIONA nową ustawą z 12.07.2024 r. o odmiennej nazwie, wdrażającą E | mod-PrTelekom-poczta-UKE (⚠️ nazwa modułu również myląca — rozważyć rename) | ✅ ZAMKNIĘTA 2026-08-21 (F-49) — moduł uzupełniony o pełną treść (PKE art. 378 reklamacja, Prawo pocz | 🟡 DO AUDYTU |
| Ustawa o prawie autorskim i prawach pokrewnych | mod-PrAut-wlasnosc-intelektualna-IP | ✅ OK | 🟡 DO AUDYTU |
| Prawo autorskie — media, internet, dobra osobiste | mod-PrAut-media-internet-dobra-osobiste | ✅ OK | 🟡 DO AUDYTU |
| AI Act — Rozp. UE 2024/1689 + Ustawa krajowa z 3.07.2026 o systemach sztucznej inteligencji (KRiBSI) | mod-AI-Act-framework | ✅ NAPRAWIONY 2026-08-14 (F-50) | 🟡 DO AUDYTU |
| DMA — Digital Markets Act (Rozp. UE 2022/1925) | mod-DMA-digital-markets-act | ✅ OK | 🟡 DO AUDYTU |
| DSA — Digital Services Act (Rozp. UE 2022/2065) | mod-DSA-digital-services-act | ✅ OK | 🟡 DO AUDYTU |
| CRA, EUCS, DA, DGA — nowe akty cyfrowe UE | mod-EUCS-CRA-akty-regulacyjne-UE | ✅ OK | 🟡 DO AUDYTU |
| MiCA — kryptoaktywa (Rozp. UE 2023/1114) | mod-MiCA-kryptoaktywa | ✅ OK | 🟡 DO AUDYTU |
| Ustawa o informatyzacji podmiotów publicznych i KSeF | mod-ustawa-informatyzacja-podmiotow-publicznych | ⚠️ WYMAGA AKTUALIZACJI MODUŁU | 🟡 DO AUDYTU |
| Ustawa o otwartych danych i ponownym wykorzystaniu | mod-ustawa-otwarte-dane | ✅ OK | 🟡 DO AUDYTU |
| Ustawa o podpisie elektronicznym i usługach zaufania (eIDAS) | mod-ustawa-podpis-elektroniczny | ⚠️ WYMAGA AKTUALIZACJI MODUŁU | 🟡 DO AUDYTU |
| Ustawa Prawo własności przemysłowej | mod-ustawa-prawo-wlasnosci-przemyslowej | ✅ OK | 🟡 DO AUDYTU |
| Ustawa o świadczeniu usług drogą elektroniczną | mod-ustawa-uslugi-elektroniczne | ✅ OK (numer ustalony) | 🟡 DO AUDYTU |
| Ustawa o krajowym systemie certyfikacji cyberbezpieczeństwa | mod-ustawa-certyfikacja-cyberbezpieczenstwa | ✅ OK | 🟡 DO AUDYTU |

## Kryterium podniesienia statusu

Status 🟢 może zostać nadany dopiero po porównaniu struktury aktualnego aktu ze źródłem urzędowym RZĄD 1, wskazaniu zakresów artykułów/rozdziałów oraz jawnej liście pozostałych luk. Statusy tej mapy są wtórne wobec treści modułów i muszą być aktualizowane po każdej ich zmianie.
