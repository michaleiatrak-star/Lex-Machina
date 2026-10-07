#!/usr/bin/env python3
"""Indeks i odczyt urzędowego snapshotu PrUp. Python 3, bez zależności.

build odtwarza indeks z załączonej ekstrakcji PDF; article/search/summary czytają
snapshot. --verify-online porównuje PDF i relacje ELI, nie rozstrzyga temporalności
konkretnej sprawy. Nie generuje prawa ani ocen wierzytelności.
"""
import argparse
from bisect import bisect_left
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.request import urlopen, Request

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'references/prup'
SOURCE = DATA / 'sources'
STEM = 'prup'
START_MARKER = 'CZĘŚĆ PIERWSZA'
PATTERN = re.compile(r'^[ \t]*Art\.[ \t]+(\d+(?:\[[0-9a-z]+\])?[a-z]*(?:–\d+)?)\.[ \t]*', re.M)
SUPERSCRIPT = str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹', '0123456789')


def normalize(value):
    value = re.sub(r'^art\.?\s*', '', value.strip(), flags=re.I).rstrip('.')
    value = re.sub(r'\[([0-9a-z]+)\]', r'^\1', value)
    value = re.sub(r'[⁰¹²³⁴⁵⁶⁷⁸⁹]+', lambda m: '^' + m[0].translate(SUPERSCRIPT), value)
    return value.replace(' ', '')


def sha(data):
    return hashlib.sha256(data).hexdigest()


def parse_articles(text):
    start = text.index(START_MARKER)
    matches = list(PATTERN.finditer(text, start))
    result = []
    page_breaks = [m.start() for m in re.finditer('\\f', text)]
    for i, match in enumerate(matches):
        end = matches[i+1].start() if i+1 < len(matches) else len(text)
        body = text[match.end():end]
        state = ('UCHYLONY' if body.lstrip().startswith('(uchylony)') else
                 'POMINIETE_W_TJ' if body.lstrip().startswith('(pominięte)') else 'TEKST_W_TJ')
        result.append({'id': normalize(match[1]), 'label': match[1],
                       'start': match.start(), 'end': end,
                       'page': bisect_left(page_breaks, match.start()) + 1,
                       'source_status': state})
    ids = [r['id'] for r in result]
    if not result or len(ids) != len(set(ids)):
        raise ValueError('Pusty indeks albo powtórzone identyfikatory artykułów')
    return result


def build():
    metadata = json.loads((DATA/'metadata.json').read_text())
    raw = (SOURCE/(STEM+'.txt')).read_text()
    if sha((SOURCE/(STEM+'.pdf')).read_bytes()) != metadata['pdf_sha256']:
        raise ValueError('PDF niezgodny z metryką; wymagany nowy audyt źródła')
    if sha((SOURCE/(STEM+'.txt')).read_bytes()) != metadata['text_sha256']:
        raise ValueError('Ekstrakcja niezgodna z metryką; wymagany nowy audyt źródła')
    articles = parse_articles(raw)
    expected = metadata['expected_article_headings']
    if len(articles) != expected:
        raise ValueError(f'Zmieniona struktura: {len(articles)} zamiast {expected}; sprawdź PDF')
    data = {'source_sha256': metadata['text_sha256'], 'articles': articles}
    (DATA/'index.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    return data


def load():
    metadata = json.loads((DATA/'metadata.json').read_text())
    data = json.loads((DATA/'index.json').read_text())
    text_bytes = (SOURCE/(STEM+'.txt')).read_bytes()
    if sha(text_bytes) != data['source_sha256'] or sha(text_bytes) != metadata['text_sha256']:
        raise ValueError('Naruszona integralność ekstrakcji; odczyt zablokowany')
    # Odtworzenie zapobiega podmianie offsetów/identyfikatorów w indeksie.
    raw = text_bytes.decode('utf-8')
    if parse_articles(raw) != data['articles']:
        raise ValueError('Indeks nie odpowiada tekstowi urzędowemu')
    return metadata, data['articles'], raw


def relations(value):
    return {k: v for k,v in value.items() if k in ('Akty zmieniające', 'Akty uchylające', 'Akty uznające za uchylone', 'Inf. o tekście jednolitym', 'Orzeczenie TK')}


def download(url):
    with urlopen(Request(url, headers={'User-Agent': 'Lex-Machina-PrUp/1.0'}), timeout=30) as response:
        data = response.read()
    if not data:
        raise ValueError('ELI zwróciło pustą treść')
    return data


def verify(metadata):
    pdf = download(metadata['pdf_url'])
    current = json.loads(download(metadata['references_url']))
    baseline = json.loads((SOURCE/'references.json').read_text())
    if sha(pdf) != metadata['pdf_sha256'] or relations(current) != relations(baseline):
        raise ValueError('ZMIANA_ZRODLA: tekst lub relacje ELI zmienione; wymagane odświeżenie i audyt')
    from datetime import datetime, timezone
    return {'checked_at': datetime.now(timezone.utc).isoformat(),
            'result': 'ZGODNOSC_SNAPSHOTU_Z_ELI',
            'scope': 'PDF i relacje ELI; nie ocena prawa właściwego dla dat sprawy'}


def temporal_status(metadata, as_of=None, article=None):
    """Refuse known wrong snapshots; never infer a case's transition regime."""
    from datetime import date
    target = date.fromisoformat(as_of) if as_of else date.today()
    day = target.isoformat()
    changes = [{**a, 'state': 'WESZLA_W_ZYCIE' if a['effective_from'] <= day else 'PRZYSZLA'}
               for a in metadata['later_amendments']
               if article is None or article in a['articles']]
    blocked = False
    reason = 'WYMAGA_USTALENIA_PRZEPISOW_PRZEJSCIOWYCH_DLA_SPRAWY'
    if day < metadata['legal_status_date']:
        blocked, reason = True, 'WERSJA_HISTORYCZNA: data wcześniejsza niż stan prawny snapshotu; użyj tekstu historycznego i nowelizacji'
    elif as_of and day > date.today().isoformat():
        blocked, reason = True, 'DATA_PRZYSZLA: nie można potwierdzić przyszłego stanu prawnego'
    elif any(a['state'] == 'WESZLA_W_ZYCIE' for a in changes):
        blocked, reason = True, 'WYMAGANA_ZMIANA_WERSJI: weszła znana nowelizacja; snapshot wymaga wyboru/scalenia właściwego wariantu'
    return {'as_of': day, 'explicit_date': as_of is not None, 'blocked': blocked,
            'reason': reason, 'changes': changes, 'case_applicability_verified': False}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    sub = ap.add_subparsers(dest='command', required=True)
    sub.add_parser('build')
    sub.add_parser('summary')
    article = sub.add_parser('article')
    article.add_argument('id', help='np. 240, 216aa, 491^14, 491[14], 491¹⁴')
    article.add_argument('--verify-online', action='store_true')
    article.add_argument('--as-of', help='YYYY-MM-DD; kontrola daty prawa, nie automatyczny wybór przepisów przejściowych')
    temporal = sub.add_parser('temporal')
    temporal.add_argument('--as-of', required=True)
    sub.add_parser('verify')
    search = sub.add_parser('search')
    search.add_argument('query')
    search.add_argument('--limit', type=int, default=20)
    args = ap.parse_args()
    try:
        if args.command == 'build':
            out = {'articles': len(build()['articles'])}
        else:
            meta, articles, raw = load()
            if args.command == 'verify':
                out = verify(meta)
            elif args.command == 'temporal':
                out = temporal_status(meta, args.as_of)
            elif args.command == 'summary':
                out = {'metadata': meta, 'articles':len(articles), 'statuses':{
                    s:sum(a['source_status']==s for a in articles)
                    for s in sorted({a['source_status'] for a in articles})}}
            elif args.command == 'article':
                wanted = normalize(args.id)
                found = next((a for a in articles if a['id']==wanted), None)
                if found is None:
                    raise ValueError('BRAK_W_SNAPSHOCIE: nie zgaduj numeru ani treści; sprawdź uchylone/pominięte części PDF')
                if args.as_of:
                    status = temporal_status(meta, args.as_of, wanted)
                    if status['blocked']:
                        raise ValueError(status['reason'])
                freshness = verify(meta) if args.verify_online else {'result':'SNAPSHOT_OFFLINE_NIE_JEST_FRESH_GATE'}
                out = {**found, 'source':meta['pdf_url']+'#page='+str(found['page']),
                       'snapshot_verified_on':meta['verified_on'], 'freshness':freshness,
                       'temporal':temporal_status(meta, args.as_of, wanted),
                       'temporal_warning':'Przed użyciem ustal daty sprawy i przepisy przejściowe. Snapshot nie jest automatycznie właściwą wersją historyczną ani przyszłą.',
                       'amendments':[x for x in meta['later_amendments'] if wanted in x['articles']],
                       'extraction_warning':'Ekstrakcja zawiera nagłówki stron, przypisy i etykiety kolejnych działów. Cytat porównaj z PDF; zapis [n] oznacza indeks górny.',
                       'text':raw[found['start']:found['end']].strip()}
            else:
                if args.limit < 1 or args.limit > 100:
                    raise ValueError('--limit musi być od 1 do 100')
                query = args.query.strip().casefold()
                if not query:
                    raise ValueError('Puste zapytanie')
                hits=[]
                for a in articles:
                    text=raw[a['start']:a['end']]
                    pos=text.casefold().find(query)
                    if pos>=0:
                        hits.append({'id':a['id'], 'page':a['page'], 'snippet':' '.join(text[max(0,pos-70):pos+230].split())})
                out={'snapshot_only':True, 'total':len(hits), 'hits':hits[:args.limit]}
        print(json.dumps(out, ensure_ascii=False, indent=2))
        return 0
    except (ValueError, OSError) as exc:
        print(json.dumps({'error':str(exc)},ensure_ascii=False),file=sys.stderr)
        return 2

if __name__ == '__main__':
    raise SystemExit(main())
