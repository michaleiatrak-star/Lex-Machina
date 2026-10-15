"""Wycieki (formy, ktore musza zniknac) i utrata tresci prawnej po anonimizacji.
Uzycie: NPAGES=3 python anon_score.py gold_local.json lexanon_gt,presidio,spacy,gliner"""
import json, os, re, sys
_G = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "gold_local.json"))  # lokalny plik, poza repo
GOLD = {k: tuple(v) for k, v in _G["gold"].items()}
UTIL = _G["utility"]
def load(name):
    # out/<name>.json: wynik lex_anon.mts (ms); inaczej out/anon_<name>.json z anon_baselines.py
    if os.path.exists(f'out/{name}.json'):
        d=json.load(open(f'out/{name}.json')); return [p['text'] for p in d['pages']], d['ms']/1000
    d=json.load(open(f'out/anon_{name}.json')); return [p['text'] for p in d['pages']], d['sec']
import unicodedata
def fold(x):
    # bez polskich znakow: wyciek liczy sie takze w pisowni z OCR ("Pawla", "Lodz")
    x = x.replace('ł', 'l').replace('Ł', 'L')
    return ''.join(c for c in unicodedata.normalize('NFD', x) if not unicodedata.combining(c))
gt=' '.join(open(f'gt/p{i}.txt').read() for i in range(1, int(os.environ.get("NPAGES", "3")) + 1))
gtn=re.sub(r'\s+',' ',gt)
out={}
NAMES = (sys.argv[2] if len(sys.argv) > 2 else 'lexanon_gt,presidio,spacy,gliner').split(',')
for name in NAMES:
    pages,sec=load(name); T=re.sub(r'\s+',' ',' '.join(pages))
    TF=fold(T)
    items={k:all(fold(f) not in TF for f in forms) for k,(cat,forms) in GOLD.items()}
    cats={}
    for k,(cat,_) in GOLD.items(): cats.setdefault(cat,[0,0]); cats[cat][1]+=1; cats[cat][0]+=items[k]
    lost=[u for u in UTIL if u in gtn and u not in T]
    out[name]=dict(sec=sec, items=items, cats=cats, util_lost=lost, util_total=len(UTIL), masked=sum(items.values()), total=len(GOLD))
    print(f"== {name}: masked {sum(items.values())}/{len(GOLD)}  {cats}  util_lost {len(lost)}/{len(UTIL)} {lost}  {sec}s")
    print('   LEAKS:', [k for k,v in items.items() if not v])
json.dump(out, open('out/anon_metrics.json','w'), ensure_ascii=False, indent=1)
