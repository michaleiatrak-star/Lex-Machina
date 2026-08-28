# DR-16 — Lokalna Mapa Aktów Prawnych

## Pisma, strategia, dowody, orzecznictwo

Mapa runtime zawiera wyłącznie bieżące przypisanie **akt / narzędzie → moduł**. Historia korekt, projektów audytowych i zamkniętych flag pozostaje poza runtime.

| Akt / narzędzie | Bieżąca podstawa | Moduł / routing | Status runtime |
|---|---|---|---|
| KPC — przesłuchanie świadków | Dz.U. 2026 poz. 468 t.j. ze zm. | `shared/PRZESLUCHANIE-SWIADKOW-KPC.md` | ✅ aktywny; fresh gate; kanoniczna lokalizacja |
| KPC — e-doręczenia / portal sądowy | jw. | `mod-KPC-e-doreczenia-portal-sadowy` | ✅ aktywny; fresh gate |
| KPC — procedury UE / TSUE / ETPC | KPC jw. + właściwe akty UE i EKPC | `mod-KPC-procedury-UE-TSUE-ETPC` | ✅ aktywny; fresh gate |
| KPC — arbitraż sportowy i dyscyplinarny | KPC jw., część V + akty szczególne | `mod-KPC-arbitraz-sportowy-dyscyplinarny` | ✅ aktywny |
| KPC — wzory pism procesowych | KPC jw. | `mod-KPC-wzory-pism-procesowych` | ✅ aktywny; fresh gate |
| KPC — odtworzenie zaginionych / zniszczonych akt | KPC jw. | `mod-KPC-odtworzenie-akt-zaginionych-zniszczonych` | ✅ aktywny |
| Prawo prasowe / media | Dz.U. 2018 poz. 1914 t.j. ze zm. | `mod-ustawa-prawo-prasowe-media` | ✅ aktywny; fresh gate |
| Konstytucja — prawa i wolności procesowe | Konstytucja RP, Dz.U. 1997 nr 78 poz. 483 ze zm. | `mod-Konstytucja-prawa-i-wolnosci-procesowe` | ✅ aktywny |
| Archiwa i dokumentacja | Dz.U. 2020 poz. 164 t.j. ze zm. | `mod-ustawa-archiwa-dokumentacja` | ✅ aktywny |
| Obywatelstwo polskie | Dz.U. 2025 poz. 1611 t.j. ze zm. | `mod-ustawa-obywatelstwo-paszporty-ewidencja` | ✅ aktywny |
| Dokumenty paszportowe | Dz.U. 2026 poz. 196 t.j. ze zm. | `mod-ustawa-obywatelstwo-paszporty-ewidencja` | ✅ aktywny |
| Ewidencja ludności | Dz.U. 2026 poz. 384 t.j. ze zm. | `mod-ustawa-obywatelstwo-paszporty-ewidencja` | ✅ aktywny |
| Kontroler kompletności prawa | narzędzie metodyczne | `mod-narzedzie-kontroler-kompletnosci` | ✅ aktywny |
| Kalkulatory procesowe | narzędzie metodyczne | `mod-narzedzie-kalkulatory` | ✅ aktywny |

## Reguły runtime

- każdy fizyczny moduł DR-16 pozostaje jawnie rejestrowany w tej mapie zgodnie z `check_rejestracja_modulow.py`; zakres przeniesiony do `shared` nie pozostawia lokalnej kopii `mod-*`;
- mapy nie przechowują historii napraw numerów, wyników dawnych projektów katalogowania ani zamkniętych flag;
- przy KPC, procedurach UE i danych rejestrowych obowiązuje fresh gate do właściwego publikatora przed użyciem konkretnej jednostki, terminu lub wymogu;
- narzędzia metodyczne nie są źródłami prawa.
