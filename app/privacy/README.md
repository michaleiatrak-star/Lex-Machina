# Local privacy NLP

Lex Machina uses deterministic Polish patterns for structured identifiers and can add **local Polish NER** for personal names through Stanza.

## Install

```bash
python -m pip install -r app/privacy/requirements.txt
python -c "import stanza; stanza.download('pl', processors='tokenize,ner')"
```

The model download is a setup step. Runtime recognition is local and the worker uses Stanza's `REUSE_RESOURCES` mode so it does not silently fetch models while processing a document.

The re-identification map is kept in the Node backend's `PseudonymizationVault`. It is intentionally not JSON-serializable and must not be included in audit bundles or browser responses.

Structured detection currently covers PESEL, NIP, REGON, Polish IBAN, email and formatted Polish telephone numbers. Stanza contributes PERSON spans. Other NER classes are not automatically removed because legal analysis often needs public authorities, courts, places and organizations.

## User-directed privacy review

Automatic detection is a starting point, not an irreversible decision. In the local UI the user can select an exact text range on a page and choose:

- `PSEUDONYMIZE` — replace the selection with a stable local token; an optional semantic label may be attached;
- `KEEP` — preserve the selected text and suppress automatic anonymization for that range;
- `LABEL` — preserve the selected text, suppress automatic anonymization for that range and attach a semantic label such as `świadek`, `pełnomocnik` or `adres korespondencyjny`.

Overlapping manual directives are rejected fail-closed instead of being resolved silently. A user who wants both anonymization and a semantic meaning uses `PSEUDONYMIZE` with a label.

The raw review text is exposed only to the local browser. It is not sent to a model provider by the review/finalization endpoints.
