#!/usr/bin/env python3
from __future__ import annotations
import hashlib,re,shutil
from pathlib import Path

REPO=Path.cwd(); BASE='bdebb4b0b6ba63add44501795c6e4acdc5bfd931'
SRC=REPO/'Wersja rozwojowa rozpakowana'/'prawny-router-v3'
ALL=REPO/'Wersja rozwojowa rozpakowana'; OUT=REPO/'staging'/'prawny-router-v3'

def files(root): return sorted(p for p in root.rglob('*') if p.is_file())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    shutil.rmtree(REPO/'staging',ignore_errors=True); OUT.parent.mkdir(parents=True)
    shutil.copytree(SRC,OUT)
    source_count=len(files(SRC)); assert source_count==len(files(OUT))
    p=OUT/'SKILL.md'; text=p.read_text(encoding='utf-8')
    text=text.replace('compatibility: "web_search, web_fetch, show_widget, create_file"','compatibility: "live_web_lookup, file_read, optional_interactive_ui_and_document_generation"',1)
    pat=re.compile(r'description: \|\n(?:  .*\n)+?(?=dependencies:)',re.M)
    repl=('description: "Centralny router każdej sprawy prawnej Lex Machina: wykrywa tryb, uruchamia HARD GATE i step tracker, wybiera PRIMARY/SECONDARY/FALLBACK oraz koordynuje odpowiedź i dokumenty."\n')
    text,n=pat.subn(repl,text,count=1)
    if n!=1: raise RuntimeError('description block not found')
    adapter='''## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)\n\nTa sekcja zmienia wyłącznie sposób wykonania operacji technicznych. Routing, HARD GATE, PRIMARY→SECONDARY→FALLBACK, checkpointy, RPK, step tracker, zasady dokumentów i kolejność sekwencji pozostają bez zmian.\n\n1. `view`, `web_search`, `web_fetch`, `show_widget`, `present_files`, `create_file` i podobne nazwy są nazwami operacji semantycznych, jeśli bieżący host nie ma literalnie tak nazwanego narzędzia. Użyj równoważnej funkcji hosta.\n2. `view /mnt/skills/user/prawny-router-v3/...` oznacza świeży odczyt pliku lokalnego tego skilla (`references/`, `anonimizer/`). Literalny katalog `/mnt/skills` nie jest wymagany.\n3. `view /mnt/skills/user/shared/<plik>` oznacza świeży odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do routera. Brak obowiązkowego zasobu shared = fail-closed; nie zastępuj go pamięcią modelu.\n4. `view /mnt/skills/user/<inny-skill>/<plik>` oznacza świeży odczyt z osobnego zainstalowanego skilla wskazanego nazwą. Nie vendoringuj innych skilli do routera. Jeżeli krok obowiązkowy nie może zostać wykonany, jawnie zgłoś brak zamiast zgadywać.\n5. `web_search` / `web_fetch` oznaczają świeżą zewnętrzną weryfikację. HARD GATE nadal wymaga aktualnego źródła dla każdego przepisu i sygnatury; nazwa narzędzia hosta nie ma znaczenia.\n6. `view /mnt/skills/public/docx/SKILL.md`, `create_file` i `present_files` oznaczają użycie natywnego capability dokumentowego bieżącego hosta. Wszystkie checkpointy HYBRID/ST-FINAL pozostają blokujące.\n7. `show_widget` oznacza interaktywny widok, jeśli host go obsługuje; w przeciwnym razie użyj równoważnego natywnego UI lub statycznego fallbacku bez pomijania analizy.\n8. Ścieżki `/mnt/user-data/...` oznaczają rzeczywiste pliki użytkownika dostępne w bieżącym hoście; wymagany reread musi być rzeczywistym odczytem pliku.\n\n**Zasada nadrzędna adaptera:** jeśli istniejąca instrukcja jest zrozumiała i wykonalna przez bieżący host, wykonaj ją bez konwersji. Adapter działa wyłącznie na rzeczywistej granicy runtime.\n\n'''
    marker='---\n\n# ⛔ HARD GATE — PRIORYTET BEZWZGLĘDNY'
    if marker not in text: raise RuntimeError('frontmatter marker missing')
    text=text.replace(marker,'---\n\n'+adapter+'# ⛔ HARD GATE — PRIORYTET BEZWZGLĘDNY',1)
    p.write_text(text,encoding='utf-8')
    m=re.search(r'^description:\s*"(.*?)"\s*$',text,re.M); assert m and len(m.group(1))<=200

    # Validate explicit local/shared/external skill paths without copying dependencies.
    shared=ALL/'shared'; refs=set(re.findall(r'/mnt/skills/user/shared/([A-Za-z0-9_.\-/]+\.(?:md|json|txt|html|jsx|py|sh|ya?ml))',text))
    missing=[r for r in sorted(refs) if not (shared/r).is_file()]
    if missing: raise RuntimeError('missing shared refs: '+', '.join(missing))
    local=set(re.findall(r'/mnt/skills/user/prawny-router-v3/([A-Za-z0-9_.\-/]+\.(?:md|json|txt|html|jsx|py|sh|ya?ml))',text))
    missing=[r for r in sorted(local) if not (OUT/r).is_file()]
    if missing: raise RuntimeError('missing local refs: '+', '.join(missing))
    ext=[]
    for skill,rel in re.findall(r'/mnt/skills/user/([^/\s`]+)/([A-Za-z0-9_.\-/]+\.(?:md|json|txt|html|jsx|py|sh|ya?ml))',text):
        if skill in {'shared','prawny-router-v3'}: continue
        if not (ALL/skill/rel).is_file(): ext.append(f'{skill}/{rel}')
    if ext: raise RuntimeError('missing external skill refs: '+', '.join(sorted(set(ext))))

    manifest=f'''# Portability manifest — prawny-router-v3\n\n- Source baseline: `{BASE}`\n- Original files copied: **{source_count}**\n- Description: **{len(m.group(1))}/200**\n- External shared references verified: **{len(refs)}**\n- Local absolute references verified: **{len(local)}**\n\n`shared` i wszystkie skille wykonawcze/dziedzinowe pozostają osobnymi instalacjami. ZIP routera nie zawiera ich kopii. Zmiany ograniczono do warstwy runtime: metadane capability, semantyka legacy nazw narzędzi i absolutnych ścieżek, natywne dokumenty/UI hosta. Logiki routingu i HARD GATE nie przepisano.\n'''
    (OUT/'PORTABILITY-MANIFEST.md').write_text(manifest,encoding='utf-8')
    rows=[]
    for f in files(OUT):
        if f.name=='CHECKSUMS.sha256': continue
        rows.append(f'{sha(f)}  {f.relative_to(OUT).as_posix()}')
    (OUT/'CHECKSUMS.sha256').write_text('\n'.join(rows)+'\n',encoding='utf-8')
    count=len(files(OUT)); print(f'FINAL_FILES={count} SHARED_REFS={len(refs)} LOCAL_REFS={len(local)}')
    if count>200: raise RuntimeError('file limit')
    for rel in ['SKILL.md','references/CHANGELOG.md','references/KROK1-detekcja.md','references/KROK0A-anonimizer.md','anonimizer/anonimizer-skill.md']:
        if not (OUT/rel).is_file(): raise RuntimeError('missing '+rel)
    if (OUT/'shared').exists(): raise RuntimeError('shared duplicated')
    for row in (OUT/'CHECKSUMS.sha256').read_text().splitlines():
        digest,rel=row.split('  ',1)
        if sha(OUT/rel)!=digest: raise RuntimeError('checksum '+rel)
    print('CHECKSUMS PASS')

if __name__=='__main__': main()
