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
import os, re, sys, collections

import argparse
ap = argparse.ArgumentParser()
ap.add_argument('--repo-root', default=os.environ.get('LEX_MACHINA_ROOT') or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
ROOT = ap.parse_args().repo_root
# Allowlista: plik świadomie bez ścieżki wywołania — KAŻDY wpis z uzasadnieniem.
ALLOW = {
    'chronologia-sprawy-v1/references/BLUEPRINT-SCHEMA.md':
        'ARCHIWALNY schemat v1, zarejestrowany w drzewie SKILL.md samą nazwą; nazwa nieunikalna (router/anonimizer)',
}

from _lex_common import RefGraph, HIST, INFRA

G = RefGraph(ROOT)
files, texts, words, dirtoks = G.files, G.texts, G.words, G.dirtoks
# Kody modułów (MD1, MP12, MX …) per skill: kod liczy się jako odwołanie tylko wtedy,
# gdy w modules/ skilla nosi go DOKŁADNIE jeden plik (2026-10-10: nowy `MD1-sierota.md`
# przechodził, bo kod MD1 wskazywał już `MD1-klasyfikacja.md`).
MCODE = re.compile(r'^(M[DPX]\d*[a-z]?(?:-NARR)?|MX)-')
code_count = collections.Counter(
    (s_, MCODE.match(os.path.basename(r)).group(1)) for (s_, r) in files
    if r.startswith('modules/') and MCODE.match(os.path.basename(r)))

res = []
for (s, rel) in sorted(files):
    if INFRA.search(rel):
        continue
    own = False; ext = []
    regdirs = set(dirtoks.get((s, 'SKILL.md'), ())) | set(dirtoks.get((s, 'MANIFEST.md'), ()))
    yaml_dir = any(len(d) > 4 and '/' in d.rstrip('/') + '/' and rel.startswith(d.lstrip('./')) and d.lstrip('./') != rel for d in regdirs
                   if d.lstrip('./').count('/') >= 2 or d.lstrip('./').split('/')[0] in ('reports', 'templates', 'examples', 'tests', 'schemas', 'typologies', 'components', 'docs', 'rules', 'integration'))
    mcode = MCODE.match(os.path.basename(rel)) if rel.startswith('modules/') else None
    code_hit = (bool(mcode) and code_count[(s, mcode.group(1))] == 1
                and any(mcode.group(1) in words[k] for k in texts if k[0] == s and k != (s, rel) and not HIST.search(k[1])))
    for src in sorted(G.referrers(s, rel)):
        if HIST.search(src[1]):
            continue
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
