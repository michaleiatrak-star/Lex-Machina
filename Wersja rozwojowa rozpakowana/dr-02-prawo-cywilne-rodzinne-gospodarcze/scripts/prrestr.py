#!/usr/bin/env python3
"""Czytnik pełnego urzędowego tekstu Prawa restrukturyzacyjnego."""
import prup
prup.DATA = prup.ROOT / 'references/prrestr'
prup.SOURCE = prup.DATA / 'sources'
prup.STEM = 'prrestr'
prup.START_MARKER = 'TYTUŁ I'
if __name__ == '__main__':
    raise SystemExit(prup.main())
