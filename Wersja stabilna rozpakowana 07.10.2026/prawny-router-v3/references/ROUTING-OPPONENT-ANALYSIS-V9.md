# ROUTING — ANALIZA PISM PRZECIWNIKA

## Kiedy ładować

Zawsze gdy użytkownik:
- przesyła pismo przeciwnika,
- prosi o znalezienie słabości,
- chce odpowiedzieć na pozew/pismo/replikę,
- chce przygotować kontrargumenty,
- analizuje apelację/zażalenie/skargę drugiej strony,
- pyta „co tu jest słabe”.

## Moduły obowiązkowe

- `pisma-procesowe-v3/references/engines/opponent-pleading-attack-engine-v9.md`
- `pisma-procesowe-v3/references/engines/rebuttal-drafting-engine-v9.md`
- `analizator-dowodow-v3/references/engines/opponent-evidence-weakness-engine-v9.md`
- `analiza-sadowa-v6/references/engines/adversarial-litigation-analysis-v9.md`
- audyt końcowy pisma: `shared/AUDYT-KONCOWY.md` (dawny `final-pleading-audit-v8` usunięty w shared 3.19 —
  treść pokryta przez FORMAL-CHECK / QUALITY-CHECK / AUDYT-KONCOWY)
- ⛔ `core-burden-of-proof-v9` — silnik NIE istnieje w systemie (AUDYT-2026-10-04b); ciężar dowodu
  analizuj w `opponent-pleading-attack-engine-v9` i punkcie 3 HARD GATE niżej

## Hard gate

Nie wolno przygotować odpowiedzi na pismo przeciwnika bez:
1. mapy tez przeciwnika,
2. mapy dowodów przeciwnika,
3. analizy ciężaru dowodu,
4. priorytetyzacji słabości,
5. odpowiedzi na najmocniejszy argument przeciwnika.
