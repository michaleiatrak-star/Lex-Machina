#!/usr/bin/env python3
"""Katalog obu ustaw: pokrycie, routing, źródła i bramka reformy 2025/1085.

Nie wydaje decyzji prawnych. Wszystkie zakresy rozlicza względem tekstu źródłowego.
"""
import argparse
from contextlib import contextmanager
import csv
from datetime import date
import hashlib
import json
from pathlib import Path
import re
import sys
import prup

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'references/insolvency'
LAWS = {'prup': ('CZĘŚĆ PIERWSZA', 'Prawo upadłościowe'),
        'prrestr': ('TYTUŁ I', 'Prawo restrukturyzacyjne')}
EVENTS = {'bankruptcy_application', 'recognition_application',
          'restructuring_application', 'execution_application',
          'modification_application', 'revocation_application', 'arrangement_date'}


@contextmanager
def corpus(law):
    old = prup.DATA, prup.SOURCE, prup.STEM, prup.START_MARKER
    prup.DATA = ROOT / 'references' / law
    prup.SOURCE = prup.DATA / 'sources'
    prup.STEM = law
    prup.START_MARKER = LAWS[law][0]
    try:
        yield prup
    finally:
        prup.DATA, prup.SOURCE, prup.STEM, prup.START_MARKER = old


def route(law, article):
    article = prup.normalize(article)
    n = int(re.match(r'\d+', article)[0])
    if law == 'prup':
        if article.startswith('491^'):
            return ['mod-PrUpad-konsument-workflow.md' if int(re.search(r'\^(\d+)', article)[1]) <= 24
                    else 'mod-PrUpad-postepowania-odrebne-426-491-38.md']
        if re.fullmatch(r'266[a-f]', article): return ['mod-PrUpad-uklad-likwidacja-zakonczenie.md']
        if n <= 56: return ['mod-PrUpad-wniosek-ogloszenie.md']
        if n <= 148: return ['mod-PrUpad-skutki-masa-bezskutecznosc.md']
        if 156 <= n <= 178 or 306 <= n <= 334: return ['mod-PrUpad-syndyk-likwidacja.md']
        if n <= 234: return ['mod-PrUpad-organy-procedura.md']
        if n <= 266: return ['mod-PrUpad-wierzytelnosci-235-266.md']
        if 335 <= n <= 360: return ['mod-PrUpad-podzial-335-360.md']
        if 361 <= n <= 377 or n >= 492: return ['mod-PrUpad-zakonczenie-zakaz-karne.md']
        if 378 <= n <= 425: return ['mod-PrUpad-likwidacja-miedzynarodowe-szczegolne.md']
        if 426 <= n <= 491: return ['mod-PrUpad-postepowania-odrebne-426-491-38.md']
    elif law == 'prrestr':
        ranges = [(1,22,'wejscie-plan-test'), (23,64,'dzial-III-nadzorca-zarzadca'),
                  (65,139,'dzial-IV-uczestnicy-wierzyciele'), (140,149,'dzial-V-pomoc-publiczna'),
                  (150,179,'dzial-VI-uklad'), (180,188,'dzial-VII-uklad-czesciowy'),
                  (189,209,'procedura-zakonczenie'), (210,226,'pzu'), (227,282,'ppu-pu'),
                  (283,323,'sanacja'), (324,337,'procedura-zakonczenie'),
                  (338,456,'odrebne-miedzynarodowe')]
        if article == '139a': return ['mod-PrRestr-dzial-V-pomoc-publiczna.md']
        for lo, hi, module in ranges:
            if lo <= n <= hi: return ['mod-PrRestr-'+module+'.md']
    raise ValueError('Brak jawnej reguły routingu: '+law+' '+article)


def source_manifest():
    manifest = json.loads((DATA/'sources.json').read_text())
    for entry in manifest['sources']:
        for name, expected in entry['files'].items():
            path = DATA/'sources'/name
            if path.parent != DATA/'sources' or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                raise ValueError('Naruszona integralność źródła pomocniczego: '+name)
    return manifest


def structure(raw, articles, marker):
    pattern = re.compile(r'^[ \t]*(CZĘŚĆ [A-ZĄĆĘŁŃÓŚŹŻ]+|TYTUŁ [IVX]+[A-Z]?|DZIAŁ [IVX]+[A-Z]?)[ \t]*$', re.M)
    headings = list(pattern.finditer(raw, raw.rfind('\n', 0, raw.index(marker)) + 1))
    ranks = {'CZĘŚĆ': 0, 'TYTUŁ': 1, 'DZIAŁ': 2}
    rows = []
    for i, h in enumerate(headings):
        rank = ranks[h[1].split()[0]]
        end = next((x.start() for x in headings[i+1:] if ranks[x[1].split()[0]] <= rank), len(raw))
        scoped = [a for a in articles if h.end() < a['start'] < end]
        title = []
        for line in raw[h.end():].lstrip().splitlines():
            t = line.strip()
            if not t or t.startswith(('Art.', 'TYTUŁ', 'DZIAŁ', 'Rozdział', 'CZĘŚĆ')): break
            title.append(t)
        rows.append({'heading': h[1], 'title': ' '.join(title), 'start': h.start(),
                     'end': end, 'articles': [a['id'] for a in scoped]})
    return rows


A_MARKER = 'poziom A / COV-ART'


def commentary_status(article, modules):
    if article['source_status'] != 'TEKST_W_TJ':
        return 'NIE_DOTYCZY_'+article['source_status']
    if modules and all(A_MARKER in (ROOT/'modules'/m).read_text()[:600] for m in modules):
        return 'KOMENTARZ_A_COV_ART'
    return 'PROCEDURA_TEMATYCZNA_I_ODCZYT_JEDNOSTKI'


def build():
    source_manifest()
    counts = {}
    catalog = ['# Katalog Prawa upadłościowego i restrukturyzacyjnego', '',
               'Wszystkie jawne nagłówki z obu tekstów jednolitych. Pełne teksty pierwotne',
               'z przepisami pominiętymi w t.j.: `sources/`. Przepisy uchylone są oznaczone.',
               'Status źródła i routing nie stanowią deklaracji pełnego komentarza doktrynalnego.', '']
    for law, (marker, title) in LAWS.items():
        with corpus(law) as reader:
            meta, articles, raw = reader.load()
        headings = structure(raw, articles, marker)
        rows = []
        catalog += ['## '+title, '', '| Artykuł | Status źródła | PDF | Procedura |', '|---|---|---|---|']
        for a in articles:
            modules = route(law, a['id'])
            source_module = 'mod-PrUpad-zrodla-i-wersje.md' if law == 'prup' else 'mod-PrRestr-zrodla-i-wersje.md'
            for name in modules+[source_module]:
                if not (ROOT/'modules'/name).is_file(): raise ValueError('Brak modułu '+name)
            fragment = raw[a['start']:a['end']]
            candidates = list(dict.fromkeys(re.findall(r'\bart\.\s+(\d+(?:\[[0-9a-z]+\])?[a-z]*)', fragment, re.I)))
            current_context = [h['heading']+' '+h['title'] for h in headings if h['start'] <= a['start'] < h['end']]
            rows.append({**a, 'source_url': meta['pdf_url']+'#page='+str(a['page']),
                         'source_module': source_module, 'procedure_modules': modules,
                         'structure': current_context,
                         'commentary_status': commentary_status(a, modules),
                         'independent_legal_review': 'NIE_JEST_CERTYFIKATEM_WYKLADNI_KAZDEJ_JEDNOSTKI',
                         'reference_candidates': candidates,
                         'reference_policy': 'Kandydaci z tekstu wraz z przypisami; ustal akt docelowy i zakres odesłania przed użyciem.',
                         'jurisdiction_route': 'DR-03' if (law,a['id']) in [('prup','522'),('prup','523'),('prrestr','399'),('prrestr','400')] else 'DR-02'})
            catalog.append('| '+a['id']+' | '+a['source_status']+' | [s. '+str(a['page'])+']('+rows[-1]['source_url']+') | '+', '.join('['+m+'](../../modules/'+m+')' for m in modules)+' |')
        target = ROOT/'references'/law
        coverage = {'verified_source_on':meta['verified_on'], 'scope':'Wszystkie jawne nagłówki, pełny tekst i procedury; źródło odrębne od wykładni.',
                    'full_commentary':False, 'articles':rows, 'excluded_sections':meta['excluded_from_article_index']}
        (target/'coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2)+'\n')
        with (target/'coverage.csv').open('w',newline='') as f:
            w=csv.writer(f,lineterminator='\n');w.writerow(['artykul','strona_pdf','status_zrodla','moduly','status_komentarza'])
            for a in rows:w.writerow([a['id'],a['page'],a['source_status'],'; '.join(a['procedure_modules']),a['commentary_status']])
        lines=['# '+title+' — struktura źródła','','| Jednostka | Tytuł | Pierwszy–ostatni nagłówek | Liczba |','|---|---|---|---|']
        for h in headings:
            span=h['articles'][0]+' – '+h['articles'][-1] if h['articles'] else 'brak indywidualnych nagłówków (zobacz PDF)'
            lines.append('| '+h['heading']+' | '+h['title'].replace('|','/')+' | '+span+' | '+str(len(h['articles']))+' |')
        (target/'struktura.md').write_text('\n'.join(lines)+'\n')
        counts[law]={'headings':len(rows),'routed':len(rows),'unrouted':0,
                     'statuses':{state:sum(a['source_status']==state for a in rows) for state in sorted({a['source_status'] for a in rows})}}
    (DATA/'katalog.md').write_text('\n'.join(catalog)+'\n')
    summary={'laws':counts,'full_commentary':False,'coverage_kind':'PELNY_TEKST_I_ROUTING_PROCEDUR','supplemental_acts':len(source_manifest()['sources'])}
    (DATA/'coverage-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
    return summary


def coverage_check():
    summary={}
    for law in LAWS:
        with corpus(law) as reader:
            meta, articles, raw=reader.load()
        coverage=json.loads((ROOT/'references'/law/'coverage.json').read_text())
        if [a['id'] for a in articles]!=[a['id'] for a in coverage['articles']]:
            raise ValueError('Pokrycie nie odpowiada pełnemu indeksowi '+law)
        for a,c in zip(articles,coverage['articles']):
            if any(a[k]!=c[k] for k in a) or c['procedure_modules']!=route(law,a['id']) or c['commentary_status']!=commentary_status(a,c['procedure_modules']):
                raise ValueError('Niespójne źródło/routing '+law+' '+a['id'])
            for module in c['procedure_modules']+[c['source_module']]:
                if not (ROOT/'modules'/module).is_file():raise ValueError('Brak modułu '+module)
        summary[law]={'source_headings':len(articles),'routed':len(articles),'unrouted':0}
    source_manifest()
    return {'laws':summary,'integrity':'OK','full_commentary':False}


def reform_regime(events):
    parsed={}
    for item in events:
        name, sep, value=item.partition('=')
        if not sep or name not in EVENTS or name in parsed:raise ValueError('Nieznane/powtórzone zdarzenie: '+item)
        parsed[name]=date.fromisoformat(value).isoformat()
        if parsed[name] > date.today().isoformat():raise ValueError('Zdarzenie sprawy nie może być przyszłe: '+item)
    if not parsed:raise ValueError('Podaj zdarzenia tej samej sprawy; nie zgadujemy dat.')
    earlier={k:v for k,v in parsed.items() if v<'2025-08-23'}
    return {'amendment':'DU/2025/1085','basis':'art. 4 i 6','events':parsed,'earlier_events':earlier,
            'result':'PRZEPISY_DOTYCHCZASOWE' if earlier else 'BRAK_STAREGO_REZIMU_W_PODANYCH_ZDARZENIACH',
            'warning':'Wymaga kompletnych danych i dowodów dat z tej samej sprawy; nie rozstrzyga innych nowelizacji ani nie rekonstruuje historycznego tekstu.'}


def main():
    ap=argparse.ArgumentParser(description=__doc__);sub=ap.add_subparsers(dest='command',required=True)
    for command in ['build','coverage','sources']:sub.add_parser(command)
    p=sub.add_parser('route');p.add_argument('law',choices=LAWS);p.add_argument('article')
    p=sub.add_parser('regime');p.add_argument('--event',action='append',required=True)
    args=ap.parse_args()
    try:
        if args.command=='build':out=build()
        elif args.command=='coverage':out=coverage_check()
        elif args.command=='sources':out=source_manifest()
        elif args.command=='regime':out=reform_regime(args.event)
        else:
            with corpus(args.law) as reader:meta,articles,raw=reader.load()
            wanted=prup.normalize(args.article)
            a=next((a for a in articles if a['id']==wanted),None)
            if a is None:raise ValueError('BRAK_W_SNAPSHOCIE: nie zgaduj dawnego ani pominiętego artykułu')
            out={**a,'law':args.law,'modules':route(args.law,wanted),'source':meta['pdf_url']+'#page='+str(a['page']),
                 'text':raw[a['start']:a['end']].strip(),'snapshot_only':True,
                 'next_step':f'python3 scripts/{args.law}.py article {wanted} --verify-online'}
        print(json.dumps(out,ensure_ascii=False,indent=2));return 0
    except (ValueError,OSError,KeyError) as exc:
        print(json.dumps({'error':str(exc)},ensure_ascii=False),file=sys.stderr);return 2

if __name__=='__main__':raise SystemExit(main())
