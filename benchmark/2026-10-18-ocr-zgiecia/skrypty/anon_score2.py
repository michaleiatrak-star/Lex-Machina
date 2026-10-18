"""Wycieki i utrata treści po anonimizacji, bez tekstu wzorcowego: element liczy się tylko, gdy występuje
w tekście wejściowym (po OCR); treść 'utracona', gdy była w wejściu, a nie ma jej w wyjściu.
Użycie: python anon_score2.py gold.json <wynik.json>[,<wynik2.json>...]   (wynik: lex_anon*.mts; pages[].file = wejście)"""
import json, re, sys, unicodedata
def fold(x):
    x = x.replace('ł', 'l').replace('Ł', 'L')
    return re.sub(r'\s+', ' ', ''.join(c for c in unicodedata.normalize('NFD', x) if not unicodedata.combining(c))).lower()
G = json.load(open(sys.argv[1]))
for name in sys.argv[2].split(','):
    d = json.load(open(name))
    IN = fold(' '.join(open(p['file']).read() for p in d['pages'])); OUT = fold(' '.join(p['text'] for p in d['pages']))
    present = {k: v for k, v in G['gold'].items() if any(fold(f) in IN for f in v[1])}
    leaks = {k: [f for f in v[1] if fold(f) in OUT] for k, v in present.items()}
    leaks = {k: v for k, v in leaks.items() if v}
    lost = [u for u in G['utility'] if fold(u) in IN and fold(u) not in OUT]
    print(f"== {name.split('/')[-1]}: zamaskowane {len(present)-len(leaks)}/{len(present)} (w wejściu z {len(G['gold'])}); utrata treści {len(lost)}: {lost}")
    for k, v in leaks.items(): print(f"   WYCIEK {k}: {v}")
    absent = [k for k in G['gold'] if k not in present]
    if absent: print(f"   brak w wejściu (OCR nie odczytał): {absent}")
