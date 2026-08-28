# DR-14 — Mapa Pokrycia Treściowego

**Stan operacyjny:** 2026-08-28

Mapa pokazuje wyłącznie bieżący stan pokrycia używany przez system. Historia zmian i wcześniejsze oceny nie są częścią mapy runtime.

## Legenda

- 🟢 — pokrycie pogłębione / praktycznie użyteczne;
- 🟡 — moduł operacyjny, ale bez pełnego audytu całego instrumentu;
- 🟡 B+ — pokrycie operacyjne pogłębione;
- ⚠️ — status instrumentu lub relacja temporalna wymagają świeżej kontroli.

| Akt / zakres | Moduł wejściowy | Status bieżący |
|---|---|---|
| TUE / TFUE | `mod-TFUE-TUE-prawo-pierwotne-UE` | 🟡 |
| Karta Praw Podstawowych UE | `mod-KPP-karta-praw-podstawowych-UE` | 🟡 |
| EKPC / ETPC | `mod-EKPC-ETPC-prawa-czlowieka` | 🟡 |
| Bruksela Ia 1215/2012 | `mod-KPC-egzekucja-transgraniczna-UE` | 🟡 |
| egzekucja transgraniczna KPC | `mod-KPC-egzekucja-transgraniczna-UE` | 🟡 |
| Rzym I / Rzym II / PPM | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟢/🟡 B+ |
| rozporządzenie spadkowe 650/2012 | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟡 |
| Bruksela IIb 2019/1111 | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟡 |
| Haga 1980 / Haga 2007 | `mod-PMPP-prawo-prywatne-miedzynarodowe` | 🟡 |
| MPPOiP / MPPGSiK / CRPD | `mod-ONZ-pakty-prawa-czlowieka` | 🟡 |
| NATO / SOFA NATO / pobyt wojsk obcych | `mod-NATO-umowy-miedzynarodowe` | 🟡 |
| rejestr źródeł prawa / lifecycle | `mod-rejestr-zrodla-prawa-lifecycle` | 🟢/🟡 B+ |
| mały ruch graniczny — rama UE i umowy bilateralne | `mod-maly-ruch-graniczny` | ⚠️ bieżąca kontrola statusu każdej umowy |
| FDI screening / BIT / ISDS | `mod-inwestycje-transgraniczne-FDI-BIT` | 🟡; status per instrument |
| Konwencja wiedeńska dyplomatyczna | `mod-konwencje-wiedenskie-dyplomatyczne-konsularne` | 🟢/🟡 B+ |
| Konwencja wiedeńska konsularna | `mod-konwencje-wiedenskie-dyplomatyczne-konsularne` | 🟢/🟡 B+ |
| Konwencja genewska 1951 / Protokół 1967 | `mod-konwencja-genewska-uchodzcy-1951-protokol-1967` | 🟢/🟡 B+ |

## Aktywne luki

1. TUE/TFUE, KPP, EKPC i instrumenty PPM wymagają pełnego audytu strukturalnego, jeżeli mają otrzymać status `FULL`.
2. Umowy MRG, BIT/ISDS i inne instrumenty bilateralne są zmienne — status ustala się per umowa i per data.
3. Prawo UE pobieraj z EUR-Lex; umowy międzynarodowe i akty krajowe ratyfikacyjne z właściwych źródeł urzędowych.
4. Przy kolizji norm zawsze ustal pierwszeństwo prawa UE / umowy międzynarodowej i właściwe przepisy przejściowe.
