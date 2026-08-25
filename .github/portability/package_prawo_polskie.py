#!/usr/bin/env python3
from pathlib import Path
import shutil, re, hashlib

SRC=Path('Wersja rozwojowa rozpakowana/prawo-polskie-v2')
OUTP=Path('staging')
OUT=OUTP/'prawo-polskie-v2'
if OUTP.exists(): shutil.rmtree(OUTP)
OUTP.mkdir()
shutil.copytree(SRC,OUT)
orig=[p for p in SRC.rglob('*') if p.is_file()]
staged=[p for p in OUT.rglob('*') if p.is_file()]
assert len(orig)==len(staged), (len(orig),len(staged))

p=OUT/'SKILL.md'
t=p.read_text(encoding='utf-8')
t=t.replace('compatibility: "web_search, web_fetch"','compatibility: "live_web_lookup, cross_skill_file_read"',1)
pat=re.compile(r'description: \|\n(?:  .*\n)+?(?=changelog:)',re.M)
repl='description: "Fasada routingu prawa polskiego: wybiera jeden z DR-01–DR-16 i przekazuje sprawę do właściwego skilla dziedzinowego; nie zawiera treści prawa materialnego."\n'
t,n=pat.subn(repl,t,count=1)
assert n==1, 'description block not found'
adapter='''## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)\n\nTa sekcja zmienia wyłącznie sposób wykonania operacji technicznych. Routing DR-01–DR-16 i decyzja o nieduplikowaniu treści prawnej pozostają bez zmian.\n\n1. `view /mnt/skills/user/prawo-polskie-v2/ROUTING-MAP.md` oznacza świeży odczyt lokalnego `ROUTING-MAP.md` tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.\n2. `view /mnt/skills/user/<skill>/...` oznacza aktywację/odczyt wskazanego osobnego skilla przez mechanizm bieżącego hosta. Nie kopiuj DR-skilli ani `shared` do tej paczki.\n3. `view /mnt/skills/user/shared/<plik>` oznacza świeży odczyt z kanonicznego skilla `shared`; brak obowiązkowego zasobu = fail-closed, nie substytucja pamięcią modelu.\n4. `web_search` / `web_fetch` oznaczają świeżą weryfikację online przez dostępne narzędzie hosta. Dla `ROUTING-MAP.md` zachowaj istniejący reżim weryfikacji numerów Dz.U. i statusów.\n5. Jeżeli ten skill zostanie wywołany bez `prawny-router-v3`, zachowaj istniejącą regułę: najpierw aktywuj router.\n\n**Zasada nadrzędna:** instrukcje zrozumiałe i wykonalne w hoście wykonuj bez konwersji; adapter dotyczy tylko granicy runtime.\n\n'''
marker='---\n\n# prawo-polskie-v2 — Fasada Routera DR-01 do DR-16'
assert marker in t
t=t.replace(marker,'---\n\n'+adapter+'# prawo-polskie-v2 — Fasada Routera DR-01 do DR-16',1)
p.write_text(t,encoding='utf-8')

# validate active local reference
assert (OUT/'ROUTING-MAP.md').is_file()
assert (OUT/'references/CHANGELOG.md').is_file()
# frontmatter description length
m=re.search(r'^description:\s*"(.*?)"\s*$',t,re.M); assert m
assert len(m.group(1))<=200, len(m.group(1))
manifest='''# Portability manifest — prawo-polskie-v2\n\n- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`\n- Pełne własne drzewo skilla zachowane.\n- `shared`, DR-skille i router pozostają osobnymi zależnościami; brak kopii.\n- Zmieniono tylko metadane runtime i dodano adapter operacji technicznych.\n- Routing, `ROUTING-MAP.md`, reżim mapy Dz.U. i logika DR-01–DR-16 nie zostały przepisane.\n'''
(OUT/'PORTABILITY-MANIFEST.md').write_text(manifest,encoding='utf-8')
rows=[]
for f in sorted(x for x in OUT.rglob('*') if x.is_file() and x.name!='CHECKSUMS.sha256'):
    rows.append(f"{hashlib.sha256(f.read_bytes()).hexdigest()}  {f.relative_to(OUT).as_posix()}")
(OUT/'CHECKSUMS.sha256').write_text('\n'.join(rows)+'\n',encoding='utf-8')
assert len([x for x in OUT.rglob('*') if x.is_file()])<=200
print('SOURCE_FILES',len(orig),'FINAL_FILES',len([x for x in OUT.rglob('*') if x.is_file()]),'DESC',len(m.group(1)))
