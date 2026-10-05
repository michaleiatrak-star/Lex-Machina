#!/usr/bin/env python3
"""check_osiagalnosc_shared.py — TEST T44: osiągalność plików `shared` ze skilli produkcyjnych.

Dodany 2026-10-04d (AUDYT-2026-10-04d). Przesłanka: T43 mierzy ISTNIENIE odwołania, więc plik
wymieniony wyłącznie w rejestrze (`shared/SKILL.md`, `DEPENDENCY-GRAPH.md`) przechodzi T43, choć
żaden pipeline go nie wczytuje. Tak żył `MOD-GENERATOR-AKTU.md` — „KANONICZNY, obowiązkowa
ścieżka tworzenia modułu”, bez jednego wywołania (AUDYT-2026-10-04c).

Metoda: graf odwołań (ścieżkowy, jak T43) od SKILL.md 30 skilli produkcyjnych (bez `shared`
i `audyt-systemu-v4`); krawędzie z audytu i z rejestrów nie liczą się. Plik `shared` musi być
osiągalny bezpośrednio albo przez łańcuch plików `shared`. Allowlista z uzasadnieniem — niżej.
Offline, deterministyczny. Kod wyjścia 1 = nieosiągalny plik spoza allowlisty.
"""
import os, re, sys, json, collections

import argparse
ap = argparse.ArgumentParser()
ap.add_argument('--repo-root', default=os.environ.get('LEX_MACHINA_ROOT') or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
ROOT = ap.parse_args().repo_root
# Allowlista: plik świadomie bez ścieżki wywołania — KAŻDY wpis z uzasadnieniem.
ALLOW = {
    '.claude-plugin/plugin.json': 'metadane hosta (marketplace)',
    'agents/openai.yaml': 'metadane hosta (Codex)',
    'assets/icon.svg': 'metadane hosta',
    'CHECKSUMS.sha256': 'integralność wydania',
    'PORTABILITY-MANIFEST.md': 'manifest przenośności dla dewelopera',
    'DEPENDENCY-GRAPH.md': 'rejestr zależności czytany przez audyt-systemu-v4',
    'tools/przyklady/konwersacja_api_przyklad.json': 'fikstura self-testu, wskazana z tools/README.md',
    'tools/przyklady/przyklad_pisma.md': 'fikstura self-testu walidatora, wskazana z tools/README.md',
    'tools/przyklady/sesja_niepelna.json': 'fikstura self-testu walidatora, wskazana z tools/README.md',
    'tools/przyklady/sesja_pelna.json': 'fikstura self-testu walidatora, wskazana z tools/README.md',
}

HIST = re.compile(r'(CHECKSUMS\.sha256|CHANGELOG\.md|HISTORIA-ZMIAN-PLIKOW\.md|AUDIT-JOURNAL\.md|mapa_dzu_[^/]*\.md|WARN-OTWARTE\.md|DEDUPLICATION-POLICY\.md|CHECKLIST-DEDUP\.md)$')
SKIP = ('/mcp-servers/', '/node_modules/', '/__pycache__/', '/.git/')
TXT = ('.md', '.py', '.sh', '.json', '.yaml', '.yml', '.txt', '.mjs', '.js', '.jsx', '.html')
INFRA = re.compile(r'(^SKILL\.md$|^CHECKSUMS\.sha256$|^\.claude-plugin/plugin\.json$|^agents/openai\.yaml$|'
                   r'^assets/icon\.svg$|^README\.md$|^PORTABILITY-MANIFEST\.md$|^MANIFEST\.md$|^\.mcp\.json$|^NOTICE$|^LICENSE$|^(references/)?CHANGELOG\.md$|^references/HISTORIA-ZMIAN-PLIKOW\.md$|__init__\.py$)')

skills = sorted(d for d in os.listdir(ROOT) if os.path.isfile(os.path.join(ROOT, d, 'SKILL.md')))
files, texts = {}, {}
for s in skills:
    base = os.path.join(ROOT, s)
    for dp, dn, fn in os.walk(base):
        if any(x in dp + '/' for x in SKIP):
            continue
        for f in fn:
            ap = os.path.join(dp, f); rel = os.path.relpath(ap, base)
            files[(s, rel)] = ap
            if f.endswith(TXT):
                texts[(s, rel)] = open(ap, encoding='utf-8', errors='replace').read()

TOK = re.compile(r'[A-Za-z0-9_\-\.ąćęłńóśźżĄĆĘŁŃÓŚŹŻ/]+\.(?:md|py|sh|json|yaml|yml|mjs|js|jsx|html|svg|txt)')
WORD = re.compile(r'[A-Za-z0-9_\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+')
toks = {k: set(TOK.findall(t)) for k, t in texts.items()}
words = {k: set(WORD.findall(t)) for k, t in texts.items()}
dirtoks = {k: set(re.findall(r'[A-Za-z0-9_\-\./]+/', t)) for k, t in texts.items()}
bn_count = collections.Counter(os.path.basename(r) for (_, r) in files)

def aliases(s):
    a = {s}
    m = re.match(r'(dr-\d\d)', s)
    if m: a.add(m.group(1))
    return a

def refers(src, s, rel):
    bn = os.path.basename(rel); stem = os.path.splitext(bn)[0]
    T = toks.get(src, ())
    if bn_count[bn] == 1:
        if any(os.path.basename(t) == bn for t in T):
            return True
        return len(stem) >= 8 and stem in words.get(src, ())
    for t in T:
        if os.path.basename(t) != bn:
            continue
        t2 = t.lstrip('./')
        if src[0] == s and (t2 == rel or t2.endswith('/' + rel) and t2[:-len(rel)].rstrip('/').split('/')[-1] in aliases(s)):
            return True
        for a in aliases(s):
            if t2.endswith(a + '/' + rel):
                return True
    return False


import collections
INF = re.compile(r'(^SKILL\.md$)')
edges = collections.defaultdict(set)
tgts = [k for k in files]
for (s, rel) in tgts:
    for src in texts:
        if src == (s, rel) or HIST.search(src[1]):
            continue
        if refers(src, s, rel):
            edges[src].add((s, rel))
    regdirs = set(dirtoks.get((s, 'SKILL.md'), ())) | set(dirtoks.get((s, 'MANIFEST.md'), ()))
    if any(rel.startswith(d.lstrip('./')) and d.lstrip('./') != rel and d.lstrip('./').count('/') >= 2 for d in regdirs):
        edges[(s, 'SKILL.md')].add((s, rel))
REG = {('shared','SKILL.md'), ('shared','DEPENDENCY-GRAPH.md'), ('shared','PORTABILITY-MANIFEST.md'), ('shared','tools/README.md')}
for k in list(edges):
    if k[0] == 'audyt-systemu-v4' or k in REG:
        del edges[k]
roots = [(s, 'SKILL.md') for s in skills if s not in ('shared', 'audyt-systemu-v4')]
seen = set(roots); q = collections.deque(roots); parent = {}
while q:
    u = q.popleft()
    for v in edges.get(u, ()):
        if v not in seen:
            seen.add(v); parent[v] = u; q.append(v)
# Historia zmian plików (AUDYT-2026-10-04n) nie jest wywoływana przy pracy — z definicji.
sh = sorted(k for k in files if k[0] == 'shared' and not k[1].endswith('HISTORIA-ZMIAN-PLIKOW.md'))
direct = {k: sorted({f'{a}/{b}' for (a, b), vs in edges.items() if k in vs and a != 'shared' and not HIST.search(b)}) for k in sh}
def chain(k):
    c = []
    while k in parent:
        c.append(f'{k[0]}/{k[1]}'); k = parent[k]
    c.append(f'{k[0]}/{k[1]}'); return ' <- '.join(c)
out = []
for k in sh:
    st = 'BEZPOSREDNIO' if direct[k] else ('POSREDNIO' if k in seen else 'NIEOSIAGALNY')
    out.append(dict(file=k[1], status=st, direct=direct[k][:5], n_direct=len(direct[k]), chain=chain(k) if k in seen else ''))
c = collections.Counter(o['status'] for o in out)
print('TEST T44 — OSIĄGALNOŚĆ `shared` ZE SKILLI PRODUKCYJNYCH')
print(f'Katalog: {ROOT}')
print(f"Pliki shared: {len(out)} | bezpośrednio: {c['BEZPOSREDNIO']} | pośrednio: {c['POSREDNIO']} | nieosiągalne: {c['NIEOSIAGALNY']}")
new = []
for o in out:
    if o['status'] == 'NIEOSIAGALNY':
        if o['file'] in ALLOW:
            print(f"  [allowlista] {o['file']} — {ALLOW[o['file']]}")
        else:
            new.append(o['file']); print(f"  ⛔ NIEOSIĄGALNY shared/{o['file']}")
stale = [k for k in ALLOW if not any(o['file'] == k and o['status'] == 'NIEOSIAGALNY' for o in out)]
for k in stale:
    print(f"  ⚠️ wpis allowlisty nieużywany (plik osiągalny lub nieistniejący): {k}")
print('WYNIK T44: ' + ('❌ FAIL — plik shared bez ścieżki z żadnego skilla produkcyjnego (powiąż albo usuń)' if new else '✅ PASS'))
sys.exit(1 if new else 0)
