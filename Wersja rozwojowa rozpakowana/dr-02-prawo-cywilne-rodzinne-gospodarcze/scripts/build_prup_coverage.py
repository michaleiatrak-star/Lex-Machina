#!/usr/bin/env python3
"""Zgodność ze starszym poleceniem; wspólny rejestr obu ustaw."""
from insolvency import build, route

def routes(article):
    return route('prup',article)

if __name__ == '__main__':
    import json
    print(json.dumps(build(),ensure_ascii=False,indent=2))
