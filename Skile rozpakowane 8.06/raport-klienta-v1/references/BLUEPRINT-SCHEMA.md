# RAPORT_KLIENTA_BLUEPRINT

Raport jest zewnętrzny. SKILL.md usuwa słabości pozycji, klasy A/B/C/D i notatki wewnętrzne przed przekazaniem do JSX.

```json
{
  "profile":"IND|BIZ",
  "klient":"", "sprawa":"", "prawnik":"", "status":"",
  "exec_summary": null,
  "assessment":{"level":"good|mid|bad", "label":"", "text":""},
  "prediction":{"pct":null, "desc_ind":"", "desc_biz":null},
  "timeline":[{"etap":"", "data":"", "status":"done|active|planned|warn"}],
  "steps_ind":[{"text":"", "deadline":null}],
  "actions_biz":[{"dzialanie":"", "termin":"", "odpowiedzialny":""}],
  "risk_table":[{"wariant":"", "kwota":"", "pct":""}]
}
```
