# TERYT-INGEST-WORKFLOW

## Cel
Workflow służy do uzupełnienia matrycy województwo ↔ powiat ↔ gmina na podstawie oficjalnych plików TERYT/TERC GUS.

## Źródło
Oficjalny rejestr TERYT GUS udostępnia dane TERC/SIMC/ULIC w formatach CSV/XML.

## Procedura
1. Pobierz pełny plik TERC CSV z GUS/TERYT.
2. Zachowaj datę stanu danych z rejestru.
3. Odfiltruj:
   - województwa,
   - powiaty ziemskie,
   - miasta na prawach powiatu,
   - gminy.
4. Utwórz relacje:
   - województwo → powiat,
   - powiat → województwo,
   - powiat → gminy,
   - gmina → powiat.
5. Dla każdego powiatu dopisz:
   - BIP,
   - statut,
   - regulamin organizacyjny,
   - uchwały rady powiatu,
   - zarządzenia starosty,
   - publikator DUW.
6. Oznacz status:
   - `TERYT_OK`,
   - `BIP_REQUIRED`,
   - `DUW_REQUIRED`,
   - `LOCAL_ACTS_REQUIRED`.

## Wyjście
Aktualizowane pliki:
- `COUNTY-COVERAGE-MATRIX-TEMPLATE.csv`
- `LOCAL-GOVERNMENT-LAW-COVERAGE-MATRIX.csv`
- `LOCAL-LAW-KNOWLEDGE-GRAPH.md`
