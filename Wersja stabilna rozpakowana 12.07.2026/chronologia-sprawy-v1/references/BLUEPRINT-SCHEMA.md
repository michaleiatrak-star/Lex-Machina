# CHRONOLOGIA_BLUEPRINT

SKILL.md ekstrahuje zdarzenia i przekazuje gotowy JSON do `assets/ChronologiaSprawy.jsx`.

```json
{
  "title":"Chronologia sprawy",
  "caseRef":"sygnatura/opis",
  "events":[{"id":"e1","date":"dd.mm.rrrr","date_sort":"rrrr-mm-dd","certainty":"PEWNA|SZACOWANA|SPORNA","description":"","party":"","source":"","significance":"KLUCZOWE|ISTOTNE|TŁO","conflict":null}],
  "conflicts":[{"event_ids":["e1"],"description":"","impact":"KRYTYCZNY|ISTOTNY|MARGINALNY","recommendation":""}],
  "gaps":[{"from":"rrrr-mm-dd","to":"rrrr-mm-dd","days":0,"note":""}]
}
```
