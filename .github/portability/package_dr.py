#!/usr/bin/env python3
from __future__ import annotations

import argparse, hashlib, re, shutil
from pathlib import Path

BASE = Path('Wersja rozwojowa rozpakowana')
SHARED = BASE / 'shared'
OUT_BASE = Path('staging')

DESCRIPTIONS = {
'dr-01-ustroj-konstytucyjny-i-zrodla-prawa': 'Prawo konstytucyjne i ustrojowe: Konstytucja, organy państwa, TK, źródła prawa, legislacja i skarga konstytucyjna; analiza z aktualną weryfikacją źródeł.',
'dr-02-prawo-cywilne-rodzinne-gospodarcze': 'Prawo cywilne, rodzinne i gospodarcze: KC, KPC, spadki, rodzina, spółki, upadłość, restrukturyzacja, windykacja i odpowiedzialność kontraktowa/deliktowa.',
'dr-03-prawo-karne-wykroczenia-egzekucja': 'Prawo karne, wykroczenia i egzekucja: KK, KPK, KKW, KW, KPW, KKS, kwalifikacja karnomaterialna, tryby ścigania i wykonanie orzeczeń.',
'dr-04-prawo-pracy-zus-swiadczenia': 'Prawo pracy, ZUS i świadczenia: KP, zatrudnienie, rozwiązanie stosunku pracy, ubezpieczenia społeczne, emerytury, renty, KRUS, PFRON i pomoc społeczna.',
'dr-05-prawo-administracyjne-sadowoadministracyjne': 'Prawo administracyjne i sądowoadministracyjne: KPA, PPSA, decyzje, bezczynność, WSA/NSA, egzekucja administracyjna, cudzoziemcy i postępowania urzędowe.',
'dr-06-podatki-finanse-publiczne-aml': 'Podatki, finanse publiczne i AML: Ordynacja podatkowa, PIT, CIT, VAT, akcyza, cło, KAS, finanse publiczne i obowiązki przeciwdziałania praniu pieniędzy.',
'dr-07-zamowienia-publiczne-fundusze-ue': 'Zamówienia publiczne i fundusze UE: PZP, postępowania zakupowe, KIO, środki ochrony prawnej, finansowanie UE i powiązane zagadnienia realizacyjne.',
'dr-08-samorzad-terytorialny-prawo-lokalne': 'Samorząd terytorialny i prawo lokalne: gmina, powiat, województwo, uchwały, akty prawa miejscowego, nadzór, kompetencje JST i lokalne planowanie.',
'dr-09-budownictwo-srodowisko-energia-transport': 'Budownictwo, środowisko, energia i transport: prawo budowlane, planowanie, odpady, ochrona środowiska, energetyka, drogi i regulacje transportowe.',
'dr-10-zdrowie-farmacja-zywnosc-rolnictwo': 'Zdrowie, farmacja, żywność i rolnictwo: działalność lecznicza, prawa pacjenta, produkty lecznicze, żywność, weterynaria i regulacje sektora rolnego.',
'dr-11-cyfrowe-cyber-ai-dane-ip': 'Prawo cyfrowe, cyber, AI, dane i IP: RODO, KSC/NIS2, AI Act, usługi cyfrowe, prywatność, cyberbezpieczeństwo, prawo autorskie i własność intelektualna.',
'dr-12-sadownictwo-prokuratura-zawody-prawnicze': 'Sądownictwo, prokuratura i zawody prawnicze: ustrój sądów, prokuratura, adwokaci, radcowie, notariusze, komornicy, koszty i odpowiedzialność zawodowa.',
'dr-13-sluzby-bezpieczenstwo-informacje-niejawne': 'Służby, bezpieczeństwo i informacje niejawne: Policja, ABW/AW i inne służby, obrona, ochrona informacji niejawnych oraz publicznoprawne ramy bezpieczeństwa.',
'dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka': 'Prawo UE, międzynarodowe i prawa człowieka: prawo pierwotne i wtórne UE, TSUE, EKPC/ETPC, traktaty, kolizje jurysdykcji i standardy praw człowieka.',
'dr-15-compliance-iso-governance-audyt': 'Compliance, governance i audyt: systemy zgodności, sygnaliści, AML instytucjonalny, zarządzanie ryzykiem, kontrole, ISO i audyt organizacyjno-prawny.',
'dr-16-pisma-strategia-dowody-orzecznictwo': 'Pisma, strategia, dowody i orzecznictwo: routing narzędzi procesowych, analiza dowodowa, research orzeczeń, kalkulatory i wsparcie budowy strategii sprawy.',
}

TEXT_EXT={'.md','.txt','.json','.py','.sh','.yaml','.yml','.html','.jsx','.js','.mjs'}
RUNTIME_TOKENS=['claude.ai','Anthropic','show_widget','visualize:read_me','present_files','create_file','/mnt/skills/user','/mnt/user-data','web_search','web_fetch']


def all_files(root: Path):
    return sorted(p for p in root.rglob('*') if p.is_file())


def read_text(p: Path):
    if p.suffix.lower() not in TEXT_EXT:
        return None
    try: return p.read_text(encoding='utf-8')
    except UnicodeDecodeError: return None


def patch_skill(skill: str, out: Path):
    p=out/'SKILL.md'
    text=p.read_text(encoding='utf-8')
    # Normalize only a single-line compatibility declaration when present.
    text=re.sub(r'^compatibility:\s*.*$', 'compatibility: "live_web_lookup, file_read, cross_skill_file_read, optional_artifact_ui"', text, count=1, flags=re.M)
    # Replace description block/scalar with a concise high-signal trigger description.
    desc=DESCRIPTIONS[skill]
    if len(desc)>200: raise RuntimeError(f'description too long: {len(desc)}')
    block=re.compile(r'^description:\s*[>|][-+]?\s*\n(?:^[ \t]+.*\n?)+',re.M)
    if block.search(text):
        text=block.sub(f'description: "{desc}"\n',text,count=1)
    else:
        scalar=re.compile(r'^description:\s*.*$',re.M)
        if not scalar.search(text): raise RuntimeError('description not found')
        text=scalar.sub(f'description: "{desc}"',text,count=1)

    adapter=f'''## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)\n\nTa sekcja zmienia wyłącznie wykonanie operacji technicznych. Merytoryka dziedzinowa, mapy aktów, hard gate’y, kolejność modułów i kryteria jakości tego DR-skilla pozostają bez zmian.\n\n1. `view /mnt/skills/user/{skill}/<plik>` oraz `view modules/...` / `view references/...` oznaczają świeży odczyt odpowiedniego lokalnego pliku tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.\n2. `view /mnt/skills/user/shared/<plik>` oznacza świeży odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do tej paczki. Brak obowiązkowego zasobu shared = fail-closed, nie substytucja pamięcią modelu.\n3. `view /mnt/skills/user/<inny-skill>/<plik>` oznacza aktywację/odczyt wskazanego osobnego skilla. Nie vendoryzuj innych skilli do tego ZIP-a.\n4. `web_search` / `web_fetch` i podobne nazwy oznaczają świeże wyszukanie/odczyt online przez równoważną funkcję hosta. Zachowaj wymagane źródła oficjalne, statusy weryfikacji i zakaz cytowania prawa z pamięci.\n5. `show_widget`, `visualize:read_me`, `present_files`, `create_file`, shell/Python i podobne operacje są nazwami semantycznymi. Jeśli host nie ma literalnego narzędzia, użyj równoważnej funkcji natywnej bez omijania bramek jakości.\n6. `/mnt/user-data/...` oznacza rzeczywiste załączniki użytkownika dostępne w bieżącym hoście; wymagany ponowny odczyt ma być faktycznym odczytem źródła.\n\n**Zasada nadrzędna:** instrukcje, które są już zrozumiałe i wykonalne w bieżącym hoście, wykonuj bez konwersji. Adapter działa wyłącznie na granicy runtime.\n\n'''
    # first YAML frontmatter close
    if not text.startswith('---\n'): raise RuntimeError('missing YAML frontmatter')
    idx=text.find('\n---\n',4)
    if idx<0: raise RuntimeError('frontmatter closing marker not found')
    insert=idx+5
    text=text[:insert]+'\n'+adapter+text[insert:]
    p.write_text(text,encoding='utf-8')
    return len(desc)


def validate_refs(skill: str, out: Path):
    missing=[]; shared_refs=set(); local_refs=set(); cross_refs=set()
    # Scan all text files, not only SKILL.md, because DR modules can contain runtime references.
    for f in all_files(out):
        data=read_text(f)
        if data is None: continue
        # explicit /mnt skill file references
        for m in re.finditer(r'/mnt/skills/user/([A-Za-z0-9_.-]+)/([A-Za-z0-9_./-]+\.(?:md|json|txt|py|sh|ya?ml|html|jsx|js|mjs))',data):
            target, rel=m.group(1),m.group(2)
            if target=='shared':
                shared_refs.add(rel)
                if not (SHARED/rel).is_file(): missing.append(f'shared/{rel}')
            elif target==skill:
                local_refs.add(rel)
                if not (out/rel).is_file(): missing.append(f'{skill}/{rel}')
            else:
                cross_refs.add((target,rel))
                if not (BASE/target/rel).is_file(): missing.append(f'{target}/{rel}')
        # local view modules/references/assets
        for m in re.finditer(r'\bview\s+`?((?:modules|references|assets)/[A-Za-z0-9_./-]+\.(?:md|json|txt|py|sh|ya?ml|html|jsx|js|mjs))',data):
            rel=m.group(1); local_refs.add(rel)
            if not (out/rel).is_file(): missing.append(f'{skill}/{rel}')
    if missing:
        raise RuntimeError('missing active references: '+', '.join(sorted(set(missing))[:50]))
    return len(shared_refs),len(local_refs),len(cross_refs)


def runtime_report(out: Path):
    counts={t:0 for t in RUNTIME_TOKENS}
    files_hit={t:set() for t in RUNTIME_TOKENS}
    for f in all_files(out):
        data=read_text(f)
        if data is None: continue
        for tok in RUNTIME_TOKENS:
            n=data.count(tok)
            if n:
                counts[tok]+=n; files_hit[tok].add(f.relative_to(out).as_posix())
    return counts,files_hit


def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--skill',required=True,choices=sorted(DESCRIPTIONS)); args=ap.parse_args()
    skill=args.skill; src=BASE/skill; out=OUT_BASE/skill
    if OUT_BASE.exists(): shutil.rmtree(OUT_BASE)
    OUT_BASE.mkdir()
    shutil.copytree(src,out)
    source_files=all_files(src); staged_files=all_files(out)
    if len(source_files)!=len(staged_files): raise RuntimeError('source/staged mismatch')
    if len(source_files)>198: raise RuntimeError(f'{skill}: {len(source_files)} source files; + manifest/checksums exceeds 200')
    desc_len=patch_skill(skill,out)
    srefs,lrefs,xrefs=validate_refs(skill,out)
    counts,hits=runtime_report(out)
    print('RUNTIME REPORT',skill)
    for tok in RUNTIME_TOKENS:
        if counts[tok]: print(f'  {tok}: occurrences={counts[tok]} files={len(hits[tok])}')
    manifest=[
        f'# Portability manifest — {skill}','',
        '- Source baseline: `bdebb4b0b6ba63add44501795c6e4acdc5bfd931`',
        f'- Source files preserved before portability additions: **{len(source_files)}**',
        f'- Frontmatter description: **{desc_len}/200** characters',
        f'- Verified unique active shared file refs: **{srefs}**',
        f'- Verified unique active local file refs: **{lrefs}**',
        f'- Verified unique active cross-skill file refs: **{xrefs}**','',
        '## Zasada shared','',
        '`shared` pozostaje osobnym kanonicznym SSOT. Paczka nie zawiera kopii `shared` ani innych skilli.','',
        '## Zakres zmian','',
        'Zmieniono wyłącznie metadane trigger/capability i dodano adapter runtime. Wszystkie moduły, mapy aktów, checklisty, bramki i pliki pomocnicze źródłowego DR-skilla zachowano.','',
    ]
    (out/'PORTABILITY-MANIFEST.md').write_text('\n'.join(manifest),encoding='utf-8')
    rows=[]
    for f in sorted(x for x in out.rglob('*') if x.is_file() and x.name!='CHECKSUMS.sha256'):
        rows.append(f'{hashlib.sha256(f.read_bytes()).hexdigest()}  {f.relative_to(out).as_posix()}')
    (out/'CHECKSUMS.sha256').write_text('\n'.join(rows)+'\n',encoding='utf-8')
    final=len(all_files(out))
    if final>200: raise RuntimeError(f'final file limit exceeded: {final}')
    print(f'SUCCESS {skill}: SOURCE={len(source_files)} FINAL={final} SHARED_REFS={srefs} LOCAL_REFS={lrefs} CROSS_REFS={xrefs}')

if __name__=='__main__': main()
