# F-152 / F-157 / F-158 — surowy wynik pomiaru osiągalności, 2026-09-04b

> **Plik:** `audyt-systemu-v4/references/F-152-pomiar-domen-2026-09-04.md`
> **Narzędzie:** `scripts/check_domeny_allowlist.py` (T25), **52 sondy**
> **Wynik:** 52/52 zgodnych ze stanem odniesienia, **0 regresji**, exit 0.
> **Selftest offline:** 17/17 z mutacjami negatywnymi.
> **Ustawienia:** `User-Agent: curl/8.5.0`, `Accept: */*`, timeout 60 s,
> 2 ponowienia, pauza 15 s przed CBOSA. ⛔ Zmiana ustawień UNIEWAŻNIA wynik.

⛔ **Ograniczenie własne, nazwane wprost:** przy ciasnym przebiegu ten pomiar
POTRAFI WYWOŁAĆ awarię, którą raportuje. CBOSA po serii żądań oddało 503 ×3,
a po 60 s pauzy 200/200/200. Pojedynczy przebieg jest bezpieczny; pętla — nie.

⛔ Materiał dowodowy pomiaru, **nie źródło prawa**. Nie rozstrzyga, czy wolno
cytować (`shared/HIERARCHIA-ZRODEL.md`), tylko czy da się odczytać.
Statusu **nie przepisuj do tabel** — odtwórz uruchomieniem T25.

---

## Rozkład

- **OK** — 35
- **POZA_LISTA** (kandydaci F-157, host nie na liście) — 8
- **BLOKADA** (osiągalne, treść zablokowana) — 5
- **NIEOSIAGALNE** — 3
- **TRESC_NIEZGODNA** (SPA) — 1

## Wynik pełny

| Źródło | Grupa | Status | Kod | Rozmiar | Detal |
|---|---|---|---:|---:|---|
| `api.sejm.gov.pl/eli` | akty | **OK** | 200 | 7014 | HTTP 200 |
| `eli.gov.pl` | akty | **OK** | 200 | 7014 | HTTP 200 |
| `isap.sejm.gov.pl` | akty | **BLOKADA** | 302 | 122 | HTTP 302 — nierozwiązane przekierowanie (pętla) |
| `SAOS /api/search` | orzecznictwo | **OK** | 200 | 12975 | HTTP 200 |
| `SAOS /api/dump` | orzecznictwo | **OK** | 200 | 200000 | HTTP 200 |
| `SAOS /api/judgments/{id}` | orzecznictwo | **OK** | 200 | 13458 | HTTP 200 |
| `orzeczenia.ms.gov.pl` | orzecznictwo | **OK** | 200 | 197412 | HTTP 200 |
| `orzeczenia.nsa.gov.pl (CBOSA)` | orzecznictwo | **OK** | 200 | 21376 | HTTP 200 |
| `sn.pl` | orzecznictwo | **OK** | 200 | 1887 | HTTP 200 |
| `ipo.trybunal.gov.pl` | orzecznictwo | **OK** | 200 | 116 | HTTP 200 |
| `otkzu.trybunal.gov.pl` | orzecznictwo | **OK** | 200 | 200000 | HTTP 200 |
| `trybunal.gov.pl` | orzecznictwo | **NIEOSIAGALNE** | 503 | 114 | HTTP 503 z warstwy proxy/serwera (po 3 próbach) |
| `orzeczenia.uodo.gov.pl` | orzecznictwo | **OK** | 200 | 193872 | HTTP 200 |
| `orzeczenia.uzp.gov.pl (KIO)` | orzecznictwo | **OK** | 200 | 28340 | HTTP 200 |
| `decyzje.uokik.gov.pl` | orzecznictwo | **OK** | 200 | 393 | HTTP 200 |
| `bip.uke.gov.pl` | orzecznictwo | **OK** | 200 | 55827 | HTTP 200 |
| `hudoc.echr.coe.int` | orzecznictwo | **OK** | 200 | 108 | HTTP 200 |
| `UODO — spec OpenAPI` | orzecznictwo | **OK** | 200 | 16967 | HTTP 200 |
| `UODO — /api/documents/search` | orzecznictwo | **OK** | 200 | 5567 | HTTP 200 |
| `eureka.mf.gov.pl (SPA)` | orzecznictwo | **TRESC_NIEZGODNA** | 200 | 2918 | brak markera 'interpretacj' przy HTTP 200 |
| `EUREKA — /informacje/{id}` | orzecznictwo | **OK** | 200 | 26346 | HTTP 200 |
| `EUREKA — /parametry-wyszukiwarki` | orzecznictwo | **OK** | 200 | 8241 | HTTP 200 |
| `api-krs.ms.gov.pl` | rejestry | **OK** | 200 | 63570 | HTTP 200 |
| `dane.biznes.gov.pl (CEIDG v3)` | rejestry | **BLOKADA** | 401 | 49 | HTTP 401 — wymaga uwierzytelnienia (API istnieje) |
| `prs.ms.gov.pl` | rejestry | **OK** | 200 | 24152 | HTTP 200 |
| `ekw.ms.gov.pl` | rejestry | **OK** | 200 | 17765 | HTTP 200 |
| `krz.ms.gov.pl` | rejestry | **BLOKADA** | 403 | 775 | HTTP 403 — odrzucone przez warstwę ochronną |
| `wyszukiwarka-krs.ms.gov.pl` | rejestry | **BLOKADA** | 403 | 882 | HTTP 403 — odrzucone przez warstwę ochronną |
| `ekrs.ms.gov.pl (RDF)` | rejestry | **OK** | 200 | 24152 | HTTP 200 |
| `isws.ms.gov.pl` | rejestry | **OK** | 200 | 47951 | HTTP 200 |
| `sudop.uokik.gov.pl` | rejestry | **OK** | 200 | 17489 | HTTP 200 |
| `rejestr.uokik.gov.pl` | rejestry | **OK** | 200 | 119265 | HTTP 200 |
| `ezamowienia.gov.pl (mo-board)` | zamowienia | **OK** | 200 | 1192 | HTTP 200 |
| `bzp.uzp.gov.pl` | zamowienia | **OK** | 200 | 1021 | HTTP 200 |
| `websrv.bzp.uzp.gov.pl` | zamowienia | **NIEOSIAGALNE** | 503 | 114 | HTTP 503 z warstwy proxy/serwera (po 3 próbach) |
| `dane.gov.pl` | dane | **OK** | 200 | 60229 | HTTP 200 |
| `podatki.gov.pl` | dane | **OK** | 200 | 76253 | HTTP 200 |
| `legislacja.rcl.gov.pl` | dane | **NIEOSIAGALNE** | 503 | 114 | HTTP 503 z warstwy proxy/serwera (po 3 próbach) |
| `api.dane.gov.pl` | kandydaci | **POZA_LISTA** | 403 | 102 | proxy odrzuciło host docelowy przekierowania |
| `wl-api.mf.gov.pl` | kandydaci | **POZA_LISTA** | 403 | 103 | proxy odrzuciło host docelowy przekierowania |
| `rdf-przegladarka.ms.gov.pl` | kandydaci | **POZA_LISTA** | 403 | 113 | proxy odrzuciło host docelowy przekierowania |
| `op.europa.eu` | kandydaci | **POZA_LISTA** | 403 | 99 | proxy odrzuciło host docelowy przekierowania |
| `www.gov.pl` | kandydaci | **POZA_LISTA** | 403 | 97 | proxy odrzuciło host docelowy przekierowania |
| `www.pip.gov.pl` | kandydaci | **POZA_LISTA** | 403 | 101 | proxy odrzuciło host docelowy przekierowania |
| `api.stat.gov.pl (REGON/BIR)` | kandydaci | **POZA_LISTA** | 403 | 102 | proxy odrzuciło host docelowy przekierowania |
| `orzeczenia.warszawa.so.gov.pl` | kandydaci | **POZA_LISTA** | 403 | 116 | proxy odrzuciło host docelowy przekierowania |
| `publications.europa.eu (SPARQL)` | miedzynarodowe | **OK** | 200 | 406 | HTTP 200 |
| `eur-lex.europa.eu` | miedzynarodowe | **OK** | 200 | 200000 | HTTP 200 |
| `legal.un.org` | miedzynarodowe | **OK** | 200 | 121332 | HTTP 200 |
| `treaties.un.org` | miedzynarodowe | **OK** | 200 | 166000 | HTTP 200 |
| `www.hcch.net` | miedzynarodowe | **OK** | 200 | 21818 | HTTP 200 |
| `rm.coe.int` | miedzynarodowe | **BLOKADA** | 403 | 4544 | HTTP 403 — odrzucone przez warstwę ochronną |

## Adresy testowe

⛔ Manifest trzyma **ścieżki robocze, nie domeny** — kod dla `/` nie mówi nic
o użytecznej ścieżce.

```
OK               https://api.sejm.gov.pl/eli/acts/DU/1997/553
OK               https://eli.gov.pl/api/acts/DU/1997/553
BLOKADA          https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970880553
OK               https://www.saos.org.pl/api/search/judgments?pageSize=10&pageNumber=0&sortingField=JUDGMENT_DATE&sortingDirection=DESC
OK               https://www.saos.org.pl/api/dump/judgments?pageSize=10
OK               https://www.saos.org.pl/api/judgments/1
OK               https://orzeczenia.ms.gov.pl/
OK               https://orzeczenia.nsa.gov.pl/cbo/query
OK               https://sn.pl/orzecznictwo/SitePages/Baza_orzeczen.aspx
OK               https://ipo.trybunal.gov.pl/
OK               https://otkzu.trybunal.gov.pl/
NIEOSIAGALNE     https://trybunal.gov.pl/
OK               https://orzeczenia.uodo.gov.pl/
OK               https://orzeczenia.uzp.gov.pl/
OK               https://decyzje.uokik.gov.pl/bp/dec_prez.nsf
OK               https://bip.uke.gov.pl/
OK               https://hudoc.echr.coe.int/app/query/results?query=%28contentsitename%3DECHR%29&select=itemid&sort=&start=0&length=1
OK               https://orzeczenia.uodo.gov.pl/api-doc/schemas/openapi.yml
OK               https://orzeczenia.uodo.gov.pl/api/documents/search/PublicDocument/1Y,/publicator_subtype:eq:uodo?order=-id&fields=id,refid,refname
TRESC_NIEZGODNA  https://eureka.mf.gov.pl/informacje/podglad/1
OK               https://eureka.mf.gov.pl/api/public/v1/informacje/100000
OK               https://eureka.mf.gov.pl/api/public/v1/parametry-wyszukiwarki
OK               https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/0000028860?rejestr=P&format=json
BLOKADA          https://dane.biznes.gov.pl/api/ceidg/v3/firmy?nip=1234567890
OK               https://prs.ms.gov.pl/
OK               https://ekw.ms.gov.pl/eukw_ogol/menu.do
BLOKADA          https://krz.ms.gov.pl/
BLOKADA          https://wyszukiwarka-krs.ms.gov.pl/
OK               https://ekrs.ms.gov.pl/
OK               https://isws.ms.gov.pl/pl/baza-statystyczna/opracowania-wieloletnie/
OK               https://sudop.uokik.gov.pl/search/aidBeneficiary
OK               https://rejestr.uokik.gov.pl/
OK               https://ezamowienia.gov.pl/mo-board/api/v1/Board/Search?NoticeType=ContractNotice&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=1
OK               https://bzp.uzp.gov.pl/Default.aspx
NIEOSIAGALNE     https://websrv.bzp.uzp.gov.pl/
OK               https://dane.gov.pl/
OK               https://podatki.gov.pl/
NIEOSIAGALNE     https://legislacja.rcl.gov.pl/
POZA_LISTA       https://api.dane.gov.pl/1.4/datasets?per_page=1
POZA_LISTA       https://wl-api.mf.gov.pl/api/search/nip/0000000000?date=2026-09-04
POZA_LISTA       https://rdf-przegladarka.ms.gov.pl/
POZA_LISTA       https://op.europa.eu/
POZA_LISTA       https://www.gov.pl/web/pip
POZA_LISTA       https://www.pip.gov.pl/
POZA_LISTA       https://api.stat.gov.pl/Home/RegonApi
POZA_LISTA       https://orzeczenia.warszawa.so.gov.pl/
OK               https://publications.europa.eu/webapi/rdf/sparql?query=SELECT%20*%20WHERE%20%7B%3Fs%20%3Fp%20%3Fo%7D%20LIMIT%201&format=application%2Fsparql-results%2Bjson
OK               https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32016R0679
OK               https://legal.un.org/ilc/
OK               https://treaties.un.org/Pages/Home.aspx
OK               https://www.hcch.net/en/instruments/conventions
BLOKADA          https://rm.coe.int/1680a2512d
```

