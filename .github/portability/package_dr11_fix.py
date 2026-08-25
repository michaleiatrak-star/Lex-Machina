#!/usr/bin/env python3
from pathlib import Path
import subprocess, hashlib

skill='dr-11-cyfrowe-cyber-ai-dane-ip'
src=Path('Wersja rozwojowa rozpakowana')/skill/'modules/mod-AI-Act-framework.md'
text=src.read_text(encoding='utf-8')
old='/mnt/skills/user/prawny-router-v3/references/modules/mod-AB-prawo-ai.md'
new=f'/mnt/skills/user/{skill}/modules/mod-AI-Act-framework.md'
if text.count(old)!=1:
    raise SystemExit(f'expected exactly one stale DR11 path, got {text.count(old)}')
src.write_text(text.replace(old,new,1),encoding='utf-8')

subprocess.run(['python','.github/portability/package_dr.py','--skill',skill],check=True)
out=Path('staging')/skill
manifest=out/'PORTABILITY-MANIFEST.md'
with manifest.open('a',encoding='utf-8') as f:
    f.write('\n## Naprawa integralności zależności\n\n')
    f.write('W `modules/mod-AI-Act-framework.md` poprawiono pojedynczą, istniejącą już w źródle błędną metrykę ścieżki: wskazywała na nieistniejący `prawny-router-v3/references/modules/mod-AB-prawo-ai.md`. Kanoniczny moduł jest tym plikiem DR11; odwołanie skierowano do lokalnego `modules/mod-AI-Act-framework.md`. Treści prawa AI nie zmieniono.\n')
chk=out/'CHECKSUMS.sha256'
rows=[]
for p in sorted(x for x in out.rglob('*') if x.is_file() and x.name!='CHECKSUMS.sha256'):
    rows.append(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(out).as_posix()}')
chk.write_text('\n'.join(rows)+'\n',encoding='utf-8')
print('DR11 repair applied and checksums regenerated')
