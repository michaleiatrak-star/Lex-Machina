#!/usr/bin/env python3
from pathlib import Path
import shutil,re,hashlib

BASE=Path('Wersja rozwojowa rozpakowana')
SRC=BASE/'analiza-sadowa-v6'
SHARED=BASE/'shared'
OUTP=Path('staging'); OUT=OUTP/'analiza-sadowa-v6'
if OUTP.exists(): shutil.rmtree(OUTP)
OUTP.mkdir(); shutil.copytree(SRC,OUT)
source=[p for p in SRC.rglob('*') if p.is_file()]
assert len(source)==len([p for p in OUT.rglob('*') if p.is_file()])
assert len(source)<=198, len(source)

p=OUT/'SKILL.md'; t=p.read_text(encoding='utf-8')
t=t.replace('compatibility: "web_search, web_fetch, show_widget"','compatibility: "live_web_lookup, file_read, cross_skill_file_read, optional_interactive_ui"',1)
pat=re.compile(r'description: \|\n(?:  .*\n)+?(?=changelog:)',re.M)
desc='Czteroprzebiegowa analiza akt, pism, wyroków i dowodów: mapa faktów, kwalifikacja prawna, analiza adversarialna, dwukrotna weryfikacja, ocena szans i raport końcowy.'
t,n=pat.subn(f'description: "{desc}"\n',t,count=1)
assert n==1
adapter='''## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)\n\nTa sekcja zmienia wyłącznie warstwę wykonawczą. Model czteroprzebiegowy, izolacja faktów od oceny prawnej, dwukrotna weryfikacja, moduły MOD-A…MOD-F i wszystkie bramki jakości pozostają bez zmian.\n\n1. `view /mnt/skills/user/analiza-sadowa-v6/<plik>` oraz `view references/...` oznaczają świeży odczyt lokalnego pliku tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.\n2. `view /mnt/skills/user/shared/<plik>` oznacza odczyt z osobnego kanonicznego skilla `shared`. NIE kopiuj żadnego modułu `shared` do tej paczki. Brak obowiązkowego modułu = fail-closed.\n3. Odwołania do `analizator-dowodow-v3`, `raport-sytuacyjny-v2`, DR-skilli i innych skilli oznaczają integracje między-skillowe; nie vendoryzuj ich.\n4. `web_search` / `web_fetch` oznaczają świeże wyszukanie i odczyt źródła przez równoważną funkcję hosta, z zachowaniem oficjalnych źródeł i PRAWO-HARDGATE.\n5. `show_widget`, HTML/JSX i legacy instrukcje renderowania oznaczają opcjonalny interaktywny widok. Jeśli host ma natywny renderer, użyj równoważnego UI; brak UI nie blokuje pełnej analizy tekstowej.\n6. Polecenia `pdftoppm`, `pdftotext`, `openpyxl`, `zipfile`, shell/Python oraz `view` plików użytkownika są technikami odczytu. Użyj natywnego parsera hosta, jeśli zapewnia równoważną kompletność; nie deklaruj wykonania narzędzia, którego faktycznie nie użyto.\n7. `/mnt/user-data/...` oznacza rzeczywiste załączniki użytkownika dostępne w hoście. Ponowna weryfikacja dokumentu ma być faktycznym ponownym odczytem źródła.\n8. Wymóg kolejnych wiadomości opisuje separację etapów i punktów STOP; host może realizować ją natywnie w kolejnych turach rozmowy bez ujawniania prywatnego toku rozumowania. Raportuj ustalenia, źródła, wyniki bramek i wnioski, nie ukryty chain-of-thought.\n\n**Zasada nadrzędna:** instrukcje zrozumiałe i wykonalne w bieżącym hoście wykonuj bez konwersji. Adapter działa tylko na granicy runtime.\n\n'''
marker='\n---\n\n**Zasada progressive disclosure:**'
assert marker in t
t=t.replace(marker,'\n---\n\n'+adapter+'**Zasada progressive disclosure:**',1)
p.write_text(t,encoding='utf-8')

# Verify all explicit shared/local/cross-skill file references across the complete own tree.
TEXT={'.md','.txt','.json','.py','.sh','.yaml','.yml','.html','.jsx','.js','.mjs'}
missing=[]; sr=set(); lr=set(); xr=set()
for f in sorted(x for x in OUT.rglob('*') if x.is_file()):
    if f.suffix.lower() not in TEXT: continue
    try:d=f.read_text(encoding='utf-8')
    except UnicodeDecodeError: continue
    for m in re.finditer(r'/mnt/skills/user/([A-Za-z0-9_.-]+)/([A-Za-z0-9_./-]+\.(?:md|json|txt|py|sh|ya?ml|html|jsx|js|mjs))',d):
        target,rel=m.group(1),m.group(2)
        if target=='shared':
            sr.add(rel)
            if not (SHARED/rel).is_file(): missing.append('shared/'+rel)
        elif target=='analiza-sadowa-v6':
            lr.add(rel)
            if not (OUT/rel).is_file(): missing.append(target+'/'+rel)
        else:
            xr.add((target,rel))
            if not (BASE/target/rel).is_file(): missing.append(target+'/'+rel)
    for m in re.finditer(r'\bview\s+`?(references/[A-Za-z0-9_./-]+\.(?:md|json|html|jsx))',d):
        rel=m.group(1); lr.add(rel)
        if not (OUT/rel).is_file(): missing.append('analiza-sadowa-v6/'+rel)
if missing: raise SystemExit('missing active refs: '+', '.join(sorted(set(missing))[:80]))
if (OUT/'shared').exists(): raise SystemExit('vendored shared directory present')

manifest=[
'# Portability manifest — analiza-sadowa-v6','',
'- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`',
'- Corrected distribution rule: only the complete own `analiza-sadowa-v6` source tree is packaged.',
'- `shared` remains a separate canonical SSOT; no shared files are vendored.',
f'- Source files preserved before portability additions: **{len(source)}**',
f'- Verified active shared refs: **{len(sr)}**',
f'- Verified active local refs: **{len(lr)}**',
f'- Verified active cross-skill refs: **{len(xr)}**','',
'## Zakres zmian','',
'Zmieniono wyłącznie metadane portability i dodano adapter runtime. Czteroprzebiegowa metodologia, references/, engines/, hard gate’y i zasady weryfikacji pozostają merytorycznie bez zmian.','']
(OUT/'PORTABILITY-MANIFEST.md').write_text('\n'.join(manifest),encoding='utf-8')
rows=[]
for f in sorted(x for x in OUT.rglob('*') if x.is_file() and x.name!='CHECKSUMS.sha256'):
    rows.append(f'{hashlib.sha256(f.read_bytes()).hexdigest()}  {f.relative_to(OUT).as_posix()}')
(OUT/'CHECKSUMS.sha256').write_text('\n'.join(rows)+'\n',encoding='utf-8')
final=len([x for x in OUT.rglob('*') if x.is_file()])
assert final<=200
print(f'SUCCESS SOURCE={len(source)} FINAL={final} SHARED={len(sr)} LOCAL={len(lr)} CROSS={len(xr)} DESC={len(desc)}')
