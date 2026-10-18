"""CER/WER, recall słów, diakrytyki, zgubione linie, pola krytyczne; per strona i łącznie.
Użycie (z katalogu roboczego): python ocr_metrics.py silnik1,silnik2 gold_local.json   (gt/p{n}.txt, out/<silnik>_p{n}.txt)"""
import os, sys, json, re, unicodedata
from collections import Counter
import jiwer
from rapidfuzz import fuzz
N = int(os.environ.get("NPAGES", "5"))
def norm(s):
    s = unicodedata.normalize('NFC', s)
    for a, b in (('„','"'),('”','"'),('“','"'),('’',"'"),('–','-'),('—','-'),('[PIECZĘĆ lub kolorowy tusz]','')):
        s = s.replace(a, b)
    return re.sub(r'\s+', ' ', s).strip()
def words(s): return re.findall(r'[\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ@./-]+', s)
def nospace(s): return re.sub(r'\s+', '', norm(s))
G = json.load(open(sys.argv[2]))
CRIT = G["critical"]
gt = [open(f'gt/p{i}.txt').read() for i in range(1, N + 1)]
res = {}
for e in sys.argv[1].split(','):
    hyp = [open(f'out/{e}_p{i}.txt').read() if os.path.exists(f'out/{e}_p{i}.txt') else '' for i in range(1, N + 1)]
    R = norm(' '.join(gt)); H = norm(' '.join(hyp))
    gw = Counter(words(R)); hw = Counter(words(H)); inter = sum((gw & hw).values())
    dg = Counter(w for w in words(R) if re.search('[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', w))
    miss = []; per = []
    for k, (g, h) in enumerate(zip(gt, hyp), 1):
        hn = norm(h); m = 0
        for line in g.splitlines():
            l = norm(line)
            if len(l) < 12: continue
            if fuzz.partial_ratio(l, hn) < 75: miss.append((k, l)); m += 1
        per.append(dict(page=k, cer=round(jiwer.cer(norm(g), hn or ' ') * 100, 1), missing=m))
    nlines = sum(1 for g in gt for l in g.splitlines() if len(norm(l)) >= 12)
    HS = nospace(' '.join(hyp))
    ok = [c for c in CRIT if nospace(c) in HS]
    res[e] = dict(cer=round(jiwer.cer(R, H) * 100, 2), wer=round(jiwer.wer(R, H) * 100, 2),
                  word_recall=round(inter / sum(gw.values()) * 100, 1), word_precision=round(inter / max(1, sum(hw.values())) * 100, 1),
                  diacritic_word_acc=round(sum((dg & hw).values()) / sum(dg.values()) * 100, 1),
                  missing_lines=len(miss), lines_total=nlines, critical_ok=len(ok), critical_total=len(CRIT),
                  critical_missed=[c for c in CRIT if c not in ok], per_page=per, missing_line_samples=miss)
json.dump(res, open('out/ocr_metrics_' + sys.argv[1].replace(',', '_')[:60] + '.json', 'w'), ensure_ascii=False, indent=1)
for e, r in res.items():
    pp = ' '.join(f"s{p['page']}:{p['cer']}/{p['missing']}" for p in r['per_page'])
    print(f"{e:18s} CER {r['cer']:6} WER {r['wer']:6} Rw {r['word_recall']:5} diak {r['diacritic_word_acc']:5} miss {r['missing_lines']}/{r['lines_total']} crit {r['critical_ok']}/{r['critical_total']} | {pp}")
