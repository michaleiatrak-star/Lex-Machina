#!/usr/bin/env python3
"""check_sieroty.py — TEST T43: pliki bez ścieżki wywołania (sieroty) w systemie skilli.

Dodany 2026-10-04b (AUDYT-2026-10-04b, F-225). Przesłanka: skan po samej nazwie pliku
był ślepy na pliki o IDENTYCZNEJ nazwie w różnych skillach (np. `references/HYBRID-VALIDATION.md`
w routerze i w shared) — ukrył 16 plików routera i 4 stuby opisane jako usunięte.

Odwołanie liczy się, gdy inny plik (nie historyczny) wskazuje plik:
  * nazwa unikalna w systemie  -> wystarczy nazwa pliku lub jej rdzeń (>=8 zn.),
  * nazwa NIEunikalna          -> wymagana ścieżka rozstrzygająca:
      - z tego samego skilla: token == ścieżka względna lub kończy się '<skill>/<rel>',
      - z innego skilla: token kończy się '<skill>/<rel>' (także skrót 'dr-NN/<rel>'),
      - dla shared: token kończy się 'shared/<rel>'.
Folder zarejestrowany w YAML właściciela (np. 'references/raporty/') rejestruje swoje pliki.
Wynik: ORPHAN (0 odwołań), OK, INFRA. Kod wyjścia 1, gdy są sieroty spoza allowlisty.
"""
import os, re, sys, json, collections

import argparse
ap = argparse.ArgumentParser()
ap.add_argument('--repo-root', default=os.environ.get('LEX_MACHINA_ROOT') or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
ROOT = ap.parse_args().repo_root
# Allowlista: plik świadomie bez ścieżki wywołania — KAŻDY wpis z uzasadnieniem.
ALLOW = {
    'chronologia-sprawy-v1/references/BLUEPRINT-SCHEMA.md':
        'ARCHIWALNY schemat v1, zarejestrowany w drzewie SKILL.md samą nazwą; nazwa nieunikalna (router/anonimizer)',
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

res = []
for (s, rel) in sorted(files):
    if INFRA.search(rel):
        continue
    own = False; ext = []
    regdirs = set(dirtoks.get((s, 'SKILL.md'), ())) | set(dirtoks.get((s, 'MANIFEST.md'), ()))
    yaml_dir = any(len(d) > 4 and '/' in d.rstrip('/') + '/' and rel.startswith(d.lstrip('./')) and d.lstrip('./') != rel for d in regdirs
                   if d.lstrip('./').count('/') >= 2 or d.lstrip('./').split('/')[0] in ('reports', 'templates', 'examples', 'tests', 'schemas', 'typologies', 'components', 'docs', 'rules', 'integration'))
    mcode = re.match(r'^(M[DPX]\d*[a-z]?(?:-NARR)?|MX)-', os.path.basename(rel)) if rel.startswith('modules/') else None
    code_hit = bool(mcode) and any(mcode.group(1) in words[k] for k in texts if k[0] == s and k != (s, rel) and not HIST.search(k[1]))
    for src in texts:
        if src == (s, rel) or HIST.search(src[1]):
            continue
        if refers(src, s, rel):
            if src == (s, 'SKILL.md'): own = True
            else: ext.append(f'{src[0]}/{src[1]}')
    st = 'OK' if (own or ext or yaml_dir or code_hit) else 'ORPHAN'
    res.append(dict(skill=s, file=rel, status=st, own=own, n=len(ext), refs=ext[:4], folder=yaml_dir))

orph = [r for r in res if r['status'] == 'ORPHAN']
new = [r for r in orph if f"{r['skill']}/{r['file']}" not in ALLOW]
print('TEST T43 — SIEROTY (pliki bez ścieżki wywołania)')
print(f'Katalog: {ROOT}')
print(f'Pliki sprawdzone: {len(res)} | ORPHAN: {len(orph)} | poza allowlistą: {len(new)}')
for r in orph:
    tag = '' if f"{r['skill']}/{r['file']}" not in ALLOW else '  [allowlista]'
    print(f"  ORPHAN {r['skill']}/{r['file']}{tag}")
print('WYNIK T43: ' + ('❌ FAIL — sieroty poza allowlistą (powiąż albo usuń z wpisem w CHANGELOG)' if new else '✅ PASS'))
sys.exit(1 if new else 0)
