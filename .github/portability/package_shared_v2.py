#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

REPO=Path.cwd()
SRC=REPO/'Wersja rozwojowa rozpakowana'/'shared'
STAGING=REPO/'staging'
OUT=STAGING/'shared'
EXTRACTOR=REPO/'.github'/'portability'/'shared-extract-api-verification-log.py'
BASELINE='bdebb4b0b6ba63add44501795c6e4acdc5bfd931'


def fs(root: Path):
    return sorted(p for p in root.rglob('*') if p.is_file())


def sha(p: Path):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def exactly(text: str, old: str, new: str, label: str):
    n=text.count(old)
    if n!=1: raise RuntimeError(f'{label}: expected 1 occurrence, got {n}')
    return text.replace(old,new,1)


def stage():
    shutil.rmtree(STAGING,ignore_errors=True)
    STAGING.mkdir(parents=True)
    shutil.copytree(SRC,OUT)
    a,b=len(fs(SRC)),len(fs(OUT))
    print(f'ORIGINAL_FILES={a} STAGED_FILES={b}')
    if a!=b: raise RuntimeError('copy incomplete')
    return a


def compact_mcp_examples():
    src=OUT/'tools'/'mcp-servers'
    originals=fs(src)
    if not originals: raise RuntimeError('mcp-servers example tree missing')
    checks={p.relative_to(OUT/'tools').as_posix():sha(p) for p in originals}
    temp=OUT/'tools'/'mcp-servers-examples.tmp.zip'
    with zipfile.ZipFile(temp,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for p in originals:
            z.write(p,p.relative_to(OUT/'tools').as_posix())
    with zipfile.ZipFile(temp) as z:
        names=[n for n in z.namelist() if not n.endswith('/')]
        if set(names)!=set(checks): raise RuntimeError('nested MCP archive path set mismatch')
        for name,digest in checks.items():
            if hashlib.sha256(z.read(name)).hexdigest()!=digest:
                raise RuntimeError(f'nested MCP archive checksum mismatch: {name}')
    shutil.rmtree(src)
    src.mkdir(parents=True)
    final=src/'mcp-servers-examples.zip'
    temp.replace(final)
    print(f'MCP_EXAMPLES_ARCHIVED={len(originals)} -> {final.relative_to(OUT)} SHA256={sha(final)}')
    return checks,sha(final)


def patch_skill(nested_count:int,nested_sha:str):
    p=OUT/'SKILL.md'; text=p.read_text(encoding='utf-8')
    pat=re.compile(r'description: >-\n(?:  .*\n)+?(?=dependencies:)',re.M)
    repl='description: "Kanoniczna biblioteka Lex Machina: hardgate, walidacja, definicje, terminy i moduły wspólne. Nie odpowiada użytkownikowi samodzielnie; zasoby wczytują inne skille."\n'
    text,n=pat.subn(repl,text,count=1)
    if n!=1: raise RuntimeError('description block not found')
    adapter=f'''## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

`shared` pozostaje JEDYNYM kanonicznym SSOT. Adapter nie zmienia treści modułów prawnych, tylko sposób rozumienia operacji technicznych.

1. `view /mnt/skills/user/shared/<plik>` oznacza świeży odczyt `<plik>` z rootu zainstalowanego skilla `shared`. Literalna ścieżka `/mnt/skills/user` nie jest wymagana. Obowiązkowego odczytu nie zastępuj pamięcią modelu.
2. Udokumentowane pliki-mosty mogą wskazywać inny osobny skill. `view /mnt/skills/user/<skill>/<plik>` oznacza świeży odczyt zasobu z tego skilla przez mechanizm hosta. Brak obowiązkowego zasobu = fail-closed; NIE kopiuj go do `shared`.
3. `web_search` / `web_fetch` oznaczają świeże wyszukanie lub odczyt źródła. Jeśli host ma inną nazwę narzędzia, użyj równoważnej funkcji. PRAWO-HARDGATE, hierarchia źródeł i statusy pozostają bez zmian.
4. `/mnt/user-data/...` oznacza rzeczywiste pliki użytkownika dostępne w hoście; wymagany ponowny odczyt jest faktycznym odczytem źródła.
5. `show_widget`, `present_files`, `create_file`, shell/Python i podobne operacje wykonuj równoważną natywną funkcją hosta, jeśli literalna nazwa nie istnieje. Nie pomijaj bramek jakości.
6. `tools/` to kod integracyjny portalu. `extract_api_verification_log.py` przyjmuje neutralne `events` i zachowuje zgodność z Claude legacy, generycznymi tool-call oraz Responses-style.
7. Ze względu na twardy limit 200 plików, {nested_count} technicznych plików przykładowych serwerów MCP jest zachowanych bezstratnie w `tools/mcp-servers/mcp-servers-examples.zip` (SHA-256 `{nested_sha}`). Gdy potrzebujesz kodu przykładowego serwera, rozpakuj ten plik; moduły promptowe nie zależą od jego rozwinięcia.

**Zasada nadrzędna:** jeśli istniejąca instrukcja jest zrozumiała i wykonalna w bieżącym hoście, wykonaj ją bez konwersji. Adapter działa tylko na granicy runtime.

'''
    marker='---\n\n# shared/ — Wspólne moduły systemu prawnych skilli'
    text=exactly(text,marker,'---\n\n'+adapter+'# shared/ — Wspólne moduły systemu prawnych skilli','frontmatter marker')
    p.write_text(text,encoding='utf-8')
    m=re.search(r'^description:\s*"(.*?)"\s*$',text,re.M)
    if not m or len(m.group(1))>200: raise RuntimeError('description portability gate failed')
    return len(m.group(1))


def patch_tools(nested_count:int,nested_sha:str):
    shutil.copy2(EXTRACTOR,OUT/'tools'/'extract_api_verification_log.py')
    p=OUT/'tools'/'export_gate.py'; text=p.read_text(encoding='utf-8')
    text=exactly(text,'parser = argparse.ArgumentParser(description="Bramka eksportu: ekstrakcja logu API + walidacja cytowań")','parser = argparse.ArgumentParser(description="Bramka eksportu: provider-neutralna ekstrakcja logu weryfikacji + walidacja cytowań")','export parser')
    old='''parser.add_argument("--api-conversation", required=False,
                         help="Ścieżka do JSON z pełną konwersacją API (format extract_api_verification_log.py)")'''
    new='''parser.add_argument("--api-conversation", "--verification-input", dest="api_conversation", required=False,
                         help="JSON z logiem weryfikacji: neutralne events, Claude legacy, generic tool-call lub Responses-style")'''
    text=exactly(text,old,new,'export input')
    text=exactly(text,'print("Wymagane: --document i --api-conversation (lub --self-test)", file=sys.stderr)','print("Wymagane: --document i --verification-input/--api-conversation (lub --self-test)", file=sys.stderr)','export required')
    text=text.replace('Zdarzeń weryfikacji wydobytych z konwersacji API:','Zdarzeń weryfikacji wydobytych z wejścia:')
    p.write_text(text,encoding='utf-8')
    p=OUT/'tools'/'README.md'
    p.write_text(p.read_text(encoding='utf-8')+f'''\n\n## Portability — neutralny log i archiwum przykładów MCP\n\nDla nowych integracji preferuj `{{"session_id":"...","events":[...]}}`. Event zawiera `tool`, źródło, opcjonalny `query_context` i status. Claude/Anthropic legacy pozostaje obsługiwany; obsługiwane są też generyczne tool-call/result i ukończone wpisy Responses-style. Sam call bez wyniku nie jest weryfikacją.\n\nTwardy limit 200 plików wymaga kompaktowania wyłącznie technicznych przykładów MCP: {nested_count} plików z dawnego `tools/mcp-servers/**` znajduje się byte-for-byte w `tools/mcp-servers/mcp-servers-examples.zip` (SHA-256 `{nested_sha}`). Rozpakuj archiwum przed uruchamianiem przykładowego serwera.\n''',encoding='utf-8')


def validate_code():
    subprocess.run([sys.executable,str(OUT/'tools'/'extract_api_verification_log.py'),'--self-test'],check=True)
    subprocess.run([sys.executable,str(OUT/'tools'/'export_gate.py'),'--self-test'],check=True)
    pys=sorted((OUT/'tools').glob('*.py'))
    subprocess.run([sys.executable,'-m','py_compile',*map(str,pys)],check=True)
    for d in list(OUT.rglob('__pycache__')): shutil.rmtree(d)
    if list(OUT.rglob('*.pyc')): raise RuntimeError('bytecode remains')


def add_manifest(original:int,desc_len:int,nested:dict[str,str],nested_sha:str):
    before=len(fs(OUT))
    listing='\n'.join(f'- `{path}` `{digest}`' for path,digest in sorted(nested.items()))
    manifest=f'''# Portability manifest — shared\n\n- Source baseline: `{BASELINE}`\n- Original files: **{original}**\n- Expanded files after lossless MCP-example compaction, before manifest/checksums: **{before}**\n- Frontmatter description: **{desc_len}/200**\n- Nested MCP archive SHA-256: `{nested_sha}`\n\n`shared` pozostaje jedynym SSOT. Wszystkie moduły promptowe pozostają rozwinięte. Jedynie przykładowe serwery MCP — kod techniczny, którego `SKILL.md` nie każe wczytywać jako prompt — są zapakowane wewnętrznie z pełną listą oryginalnych ścieżek i SHA-256 poniżej.\n\n## Pliki zachowane w `tools/mcp-servers/mcp-servers-examples.zip`\n\n{listing}\n\n## Runtime portability\n\n- adapter semantyczny w istniejącym `SKILL.md`;\n- provider-neutralny `extract_api_verification_log.py` z kompatybilnością Claude legacy;\n- `export_gate.py`: alias `--verification-input`;\n- bez masowego przepisywania instrukcji rozumianych przez host.\n'''
    (OUT/'PORTABILITY-MANIFEST.md').write_text(manifest,encoding='utf-8')
    rows=[]
    for p in fs(OUT):
        if p.name=='CHECKSUMS.sha256': continue
        rows.append(f'{sha(p)}  {p.relative_to(OUT).as_posix()}')
    (OUT/'CHECKSUMS.sha256').write_text('\n'.join(rows)+'\n',encoding='utf-8')


def final_validate(nested:dict[str,str]):
    count=len(fs(OUT)); print(f'FINAL_FILES={count}')
    if count>200: raise RuntimeError(f'file limit exceeded: {count}')
    for rel in ['SKILL.md','PRAWO-HARDGATE.md','MOD-STEP-TRACKER.md','tools/extract_api_verification_log.py','tools/export_gate.py','tools/mcp-servers/mcp-servers-examples.zip']:
        if not (OUT/rel).is_file(): raise RuntimeError(f'missing {rel}')
    archive=OUT/'tools'/'mcp-servers'/'mcp-servers-examples.zip'
    with zipfile.ZipFile(archive) as z:
        names={n for n in z.namelist() if not n.endswith('/')}
        if names!=set(nested): raise RuntimeError('nested archive path set changed')
        for name,digest in nested.items():
            if hashlib.sha256(z.read(name)).hexdigest()!=digest: raise RuntimeError(f'nested mismatch {name}')
    for row in (OUT/'CHECKSUMS.sha256').read_text(encoding='utf-8').splitlines():
        digest,rel=row.split('  ',1)
        if sha(OUT/rel)!=digest: raise RuntimeError(f'outer checksum mismatch {rel}')
    print(f'NESTED_CHECKSUMS_OK={len(nested)} OUTER_CHECKSUMS_OK={len((OUT/"CHECKSUMS.sha256").read_text().splitlines())}')


def main():
    original=stage()
    nested,nested_sha=compact_mcp_examples()
    desc_len=patch_skill(len(nested),nested_sha)
    patch_tools(len(nested),nested_sha)
    validate_code()
    add_manifest(original,desc_len,nested,nested_sha)
    final_validate(nested)

if __name__=='__main__': main()
