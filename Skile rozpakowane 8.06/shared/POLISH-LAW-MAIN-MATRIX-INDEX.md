# POLISH-LAW-MAIN-MATRIX-INDEX

## Cel
Główny indeks matryc, który musi być wskazany w `prawo-polskie-v2`.

## Matryce centralne
- `LEGAL-REGISTRY.md`
- `ISAP-METRYKI-AKTOW.md`
- `LEGAL-LIFECYCLE-MANAGEMENT.md`
- `TEMPORAL-LAW-CHECK.md`
- `LEGAL-QUALITY-GATE.md`
- `LEGAL-KNOWLEDGE-GRAPH.md`
- `CROSS-DOMAIN-CONFLICT-ROUTER.md`

## Matryce hierarchiczne
- `HIERARCHICAL-DOMAINS-DEEP-COVERAGE-MATRIX.csv`
- `HIERARCHICAL-COVERAGE-GATE.md`
- `SOURCE-HIERARCHY-EQUIVALENCE-PROTOCOL.md`
- `UNITS-WITH-OWN-LEGAL-REGIMES-MATRIX.csv`

## Matryce JST i prawa miejscowego
- `LOCAL-SOURCE-EQUIVALENCE-PROTOCOL.md`
- `LOCAL-LAW-SOURCE-MATRIX.csv`
- `VOIVODESHIP-LAW-SOURCE-MATRIX.csv`
- `COUNTY-LAW-SOURCE-MATRIX.csv`
- `GMINA-LAW-SOURCE-MATRIX.csv`
- `VOIVODESHIP-COVERAGE-MATRIX.csv`
- `COUNTY-COVERAGE-MATRIX-TEMPLATE.csv`
- `TERYT-INGEST-WORKFLOW.md`

## Matryce zawodów i jednostek korporacyjnych
- `PROFESSIONS-DEEP-COVERAGE-MATRIX.csv`
- `PROFESSIONAL-SELF-GOVERNMENT-SOURCE-MATRIX.csv`
- `PROFESSIONAL-SELF-GOVERNMENT-DEEP-STANDARD.md`

## Matryce jednostek szczególnych
- `PUBLIC-INSTITUTIONS-SOURCE-MATRIX.csv`
- `REGULATED-ENTITIES-SOURCE-MATRIX.csv`
- `HEALTHCARE-UNITS-SOURCE-MATRIX.csv`
- `EDUCATION-UNITS-SOURCE-MATRIX.csv`
- `RELIGIOUS-AND-CHURCH-LAW-MATRIX.csv`
- `SECURITY-CLEARED-UNITS-SOURCE-MATRIX.csv`
- `INFRASTRUCTURE-CRITICAL-UNITS-MATRIX.csv`
- `COOPERATIVES-HOUSING-COMMUNITIES-MATRIX.csv`

## Matryce aktów wykonawczych i wewnętrznych
- `EXECUTIVE-REGULATION-SOURCE-MATRIX.csv`
- `INTERNAL-ACTS-SOURCE-MATRIX.csv`
- `RESORT-ACTS-SOURCE-MATRIX.csv`

## Reguła routingu
Każda sprawa prawa polskiego musi przejść przez ten indeks, jeżeli:
- dotyczy jednostki z własnym statutem/regulaminem,
- dotyczy organu lub jednostki podległej,
- dotyczy aktu lokalnego,
- dotyczy aktu samorządu zawodowego,
- dotyczy uchwały, zarządzenia albo regulaminu,
- dotyczy procedury wewnętrznej,
- dotyczy prawa miejscowego albo jednostki publicznej.

## Data aktualizacji
2026-05-28

## Rozszerzenie GA–GC

Dla jednostek posiadających własne akty i reżimy prawne obowiązkowo sprawdź:

- `OFFICIAL-SOURCE-TIERING-PROTOCOL.md`
- `OWN-LAW-UNITS-MATRIX-FIRST-GATE.md`
- `OWN-LAW-ENTITY-ROUTING-MATRIX.csv`
- `NONPUBLIC-COLLECTIVE-ENTITY-MATRIX.csv`
- `MATRIX-GAP-PRIORITY-BACKLOG.csv`
- `LOCAL-PUBLICATION-VALIDITY-CHECK.md`

Jeżeli sprawa dotyczy jednostki niepublicznej, korporacyjnej, samorządowej, regulowanej, zawodowej albo infrastrukturalnej, analiza musi przejść przez matrycę źródłową przed modułem merytorycznym.

## Rozszerzenie sektorowe GD–GM

Dla spraw sektorowych aktywuj:
- `SECTORAL-MATRIX-FIRST-GATE.md`
- `REGULATORS-GRAPH-MATRIX.csv`
- `PUBLIC-PROCUREMENT-MATRIX.csv`
- `CONSTRUCTION-GEODESY-REAL-ESTATE-MATRIX.csv`
- `ENVIRONMENTAL-AUTHORITIES-MATRIX.csv`
- `FOREIGNERS-MIGRATION-MATRIX.csv`
- `TAX-CUSTOMS-KAS-MATRIX.csv`
- `TRANSPORT-MARITIME-AVIATION-MATRIX.csv`
- `PUBLIC-INFORMATION-TRANSPARENCY-MATRIX.csv`
- `AI-CYBER-GOVERNANCE-MATRIX.csv`
- `ACCESSIBILITY-DISABILITY-MATRIX.csv`

## Rozszerzenie GS–GV — własność intelektualna i patentowa

Aktywuj:
- `INTELLECTUAL-PROPERTY-PATENT-MATRIX.csv`
- `mod-GS-prawo-patentowe-i-wlasnosc-przemyslowa`
- `mod-GT-prawo-autorskie-i-cyfrowe`
- `mod-GU-tajemnica-przedsiebiorstwa-know-how`
- `mod-GV-sady-wlasnosci-intelektualnej`
