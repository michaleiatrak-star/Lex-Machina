#!/usr/bin/env python3
from __future__ import annotations

import argparse, hashlib, re, shutil
from pathlib import Path

BASE=Path('Wersja rozwojowa rozpakowana')
SHARED=BASE/'shared'
OUT_BASE=Path('staging')

DESCRIPTIONS={
'pisma-procesowe-v3':'Zaawansowane pisma procesowe: pozwy, odpowiedzi, apelacje, zażalenia i inne pisma wymagające strategii, faktów, dowodów, weryfikacji prawa i finalnej walidacji dokumentu.',
'pisma-proste-v2':'Proste pisma prawne i urzędowe: wezwania, wnioski, odpowiedzi i krótsze dokumenty; kompletność danych, aktualna weryfikacja prawa i walidacja przed wygenerowaniem pliku.',
'orzeczenia-sadowe-v2':'Research orzecznictwa: wyszukiwanie, weryfikacja sygnatur i tez, hierarchia źródeł, porównanie orzeczeń oraz dobór judykatury do argumentacji prawnej.',
'przesluchanie-swiadkow-v2-min90':'Przygotowanie przesłuchania świadków: analiza akt i dowodów, cele dowodowe, sprzeczności, pytania główne i kontrolne oraz rozbudowane zestawy pytań do świadków.',
'raport-klienta-v1':'Raport dla klienta: przekłada analizę prawną na zrozumiały stan sprawy, ryzyka, warianty działania, priorytety i następne kroki bez utraty podstaw źródłowych.',
'raport-sytuacyjny-v2':'Raport sytuacyjny sprawy: syntetyzuje fakty, ryzyka, dowody, terminy, warianty i priorytety; może generować interaktywny widok sytuacji i eksport danych.',
'przewodnik-prawny-v2':'Przewodnik prawny i fallback routera: pomaga zidentyfikować problem, właściwą ścieżkę postępowania, potrzebne dokumenty i kolejny specjalistyczny skill.',
}
TEXT_EXT={'.md','.txt','.json','.py','.sh','.yaml','.yml','.html','.jsx','.js','.mjs'}
TOKENS=['claude.ai','Anthropic','show_widget','visualize:read_me','present_files','create_file','/mnt/skills/user','/mnt/skills/public','/mnt/user-data','web_search','web_fetch','Cowork']


def files(root): return sorted(p for p in root.rglob('*') if p.is_file())
def text_of(p):
    if p.suffix.lower() not in TEXT_EXT: return None
    try:return p.read_text(encoding='utf-8')
    except UnicodeDecodeError:return None


def patch_skill(skill,out):
    p=out/'SKILL.md'; t=p.read_text(encoding='utf-8')
    desc=DESCRIPTIONS[skill]
    if len(desc)>200: raise RuntimeError(f'description too long {len(desc)}')
    block=re.compile(r'^description:\s*[>|][-+]?\s*\n(?:^[ \t]+.*\n?)+',re.M)
    if block.search(t): t=block.sub(f'description: "{desc}"\n',t,count=1)
    else:
        scalar=re.compile(r'^description:\s*.*$',re.M)
        if not scalar.search(t): raise RuntimeError('description missing')
        t=scalar.sub(f'description: "{desc}"',t,count=1)
    # Normalize only single-line compatibility metadata if present.
    t=re.sub(r'^compatibility:\s*.*$', 'compatibility: "live_web_lookup, file_read, cross_skill_file_read, optional_document_and_interactive_ui"',t,count=1,flags=re.M)
    adapter=f'''## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)\n\nTa sekcja zmienia wyłącznie sposób wykonania operacji technicznych. Metodologia merytoryczna, routing, hard gate’y, checklisty, schematy danych i kryteria finalizacji tego skilla pozostają bez zmian.\n\n1. `view /mnt/skills/user/{skill}/<plik>` oraz względne `view modules/...`, `view references/...`, `view assets/...` oznaczają świeży odczyt lokalnego zasobu tego skilla. Literalny katalog `/mnt/skills/user` nie jest wymagany.\n2. `view /mnt/skills/user/shared/<plik>` oznacza odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do tej paczki. Brak obowiązkowego zasobu = fail-closed.\n3. `view /mnt/skills/user/<inny-skill>/<plik>` oznacza aktywację/odczyt osobnego skilla. Nie vendoryzuj innych skilli.\n4. `web_search` / `web_fetch` oznaczają świeże wyszukanie i odczyt źródła przez równoważną funkcję hosta; zachowaj istniejące wymogi źródeł oficjalnych i statusów weryfikacji.\n5. `present_files`, `create_file` i odwołania do `/mnt/skills/public/docx/SKILL.md` / generatorów PDF oznaczają użycie natywnej funkcji dokumentowej bieżącego hosta. Brak literalnej nazwy narzędzia nie zwalnia z HYBRID-VALIDATION, POST-VALIDATION, STEP-TRACKER ani innych bramek.\n6. `show_widget`, `visualize:read_me`, `.jsx` i HTML są legacy/natywnymi wariantami UI. Jeśli host ma własny renderer interaktywny, użyj równoważnego widoku zachowującego ten sam model danych i funkcje; jeśli nie, zastosuj pełny fallback tekstowy/plikowy.\n7. `/mnt/user-data/...` oznacza rzeczywiste pliki użytkownika dostępne w hoście; wymagany ponowny odczyt musi być faktycznym odczytem pliku.\n8. Shell/Python/Cowork i podobne operacje traktuj jako techniki pomocnicze. Jeżeli host ich nie udostępnia, użyj natywnej funkcji równoważnej, bez fikcyjnego raportowania wykonania.\n\n**Zasada nadrzędna:** jeśli instrukcja jest już zrozumiała i wykonalna w bieżącym hoście, wykonaj ją bez konwersji. Adapter działa tylko na granicy runtime.\n\n'''
    if not t.startswith('---\n'): raise RuntimeError('frontmatter missing')
    idx=t.find('\n---\n',4)
    if idx<0: raise RuntimeError('frontmatter close missing')
    ins=idx+5
    t=t[:ins]+'\n'+adapter+t[ins:]
    p.write_text(t,encoding='utf-8')
    return len(desc)


def validate_refs(skill,out):
    missing=[]; sr=set(); lr=set(); xr=set()
    for f in files(out):
        d=text_of(f)
        if d is None: continue
        for m in re.finditer(r'/mnt/skills/user/([A-Za-z0-9_.-]+)/([A-Za-z0-9_./-]+\.(?:md|json|txt|py|sh|ya?ml|html|jsx|js|mjs))',d):
            target,rel=m.group(1),m.group(2)
            if target=='shared':
                sr.add(rel)
                if not (SHARED/rel).is_file(): missing.append(f'shared/{rel}')
            elif target==skill:
                lr.add(rel)
                if not (out/rel).is_file(): missing.append(f'{skill}/{rel}')
            else:
                xr.add((target,rel))
                if not (BASE/target/rel).is_file(): missing.append(f'{target}/{rel}')
        for m in re.finditer(r'\bview\s+`?((?:modules|references|assets|templates|workflows)/[A-Za-z0-9_./-]+\.(?:md|json|txt|py|sh|ya?ml|html|jsx|js|mjs))',d):
            rel=m.group(1); lr.add(rel)
            if not (out/rel).is_file(): missing.append(f'{skill}/{rel}')
    if missing: raise RuntimeError('missing active refs: '+', '.join(sorted(set(missing))[:80]))
    return len(sr),len(lr),len(xr)


def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--skill',required=True,choices=sorted(DESCRIPTIONS)); a=ap.parse_args(); skill=a.skill
    src=BASE/skill; out=OUT_BASE/skill
    if OUT_BASE.exists(): shutil.rmtree(OUT_BASE)
    OUT_BASE.mkdir(); shutil.copytree(src,out)
    source=files(src)
    if len(source)!=len(files(out)): raise RuntimeError('copy mismatch')
    if len(source)>198: raise RuntimeError(f'{skill}: source files {len(source)} exceed +2 limit')
    desc=patch_skill(skill,out)
    sr,lr,xr=validate_refs(skill,out)
    counts={k:0 for k in TOKENS}
    for f in files(out):
        d=text_of(f)
        if d is None: continue
        for k in TOKENS: counts[k]+=d.count(k)
    print('RUNTIME',skill,{k:v for k,v in counts.items() if v})
    manifest=[f'# Portability manifest — {skill}','',f'- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`',f'- Source files preserved: **{len(source)}**',f'- Description: **{desc}/200**',f'- Active shared refs verified: **{sr}**',f'- Active local refs verified: **{lr}**',f'- Active cross-skill refs verified: **{xr}**','','## Zasada shared','', '`shared` pozostaje osobnym kanonicznym SSOT; paczka nie zawiera jego kopii ani kopii innych skilli.','','## Zakres zmian','', 'Dodano wyłącznie warstwę portability i zwięzłe metadane trigger/capability. Treść merytoryczna oraz komplet własnych plików skilla zostały zachowane.','']
    (out/'PORTABILITY-MANIFEST.md').write_text('\n'.join(manifest),encoding='utf-8')
    rows=[]
    for f in sorted(x for x in out.rglob('*') if x.is_file() and x.name!='CHECKSUMS.sha256'):
        rows.append(f'{hashlib.sha256(f.read_bytes()).hexdigest()}  {f.relative_to(out).as_posix()}')
    (out/'CHECKSUMS.sha256').write_text('\n'.join(rows)+'\n',encoding='utf-8')
    final=len(files(out))
    if final>200: raise RuntimeError(f'final {final}>200')
    print(f'SUCCESS {skill} SOURCE={len(source)} FINAL={final} SHARED={sr} LOCAL={lr} CROSS={xr}')

if __name__=='__main__':main()
