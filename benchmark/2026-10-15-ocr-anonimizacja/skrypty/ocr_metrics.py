"""CER/WER, recall slow, diakrytyki, zgubione linie i pola krytyczne vs ground truth.
Uzycie: python ocr_metrics.py paddleapp,tess,... gold_local.json  (gt/p{1,2,3}.txt, out/<silnik>_p{n}.txt)"""
import os, sys, json, re, unicodedata
from collections import Counter
import jiwer
from rapidfuzz import fuzz
ENGINES = sys.argv[1].split(',')
def norm(s):
    s = unicodedata.normalize('NFC', s)
    s = s.replace('„','"').replace('”','"').replace('“','"').replace('’',"'").replace('–','-').replace('—','-')
    return re.sub(r'\s+', ' ', s).strip()
def words(s): return re.findall(r'[\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ@./-]+', s)
CRIT = json.load(open(sys.argv[2] if len(sys.argv) > 2 else "gold_local.json"))["critical"]  # lokalny plik, poza repo (dane osobowe)
gt = [open(f'gt/p{i}.txt').read() for i in range(1, int(os.environ.get("NPAGES", "3")) + 1)]
res = {}
for e in ENGINES:
    hyp = [open(f'out/{e}_p{i}.txt').read() for i in range(1, int(os.environ.get("NPAGES", "3")) + 1)]
    R=norm(' '.join(gt)); H=norm(' '.join(hyp))
    cer = jiwer.cer(R,H); wer = jiwer.wer(R,H)
    gw=Counter(words(R)); hw=Counter(words(H)); inter=sum((gw&hw).values())
    rec=inter/sum(gw.values()); prec=inter/max(1,sum(hw.values()))
    # diacritic words
    dg=Counter(w for w in words(R) if re.search('[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]',w)); dacc=sum((dg&hw).values())/sum(dg.values())
    # missing lines
    miss=[]
    for g,h in zip(gt,hyp):
        hn=norm(h)
        for line in g.splitlines():
            l=norm(line)
            if len(l)<12: continue
            if fuzz.partial_ratio(l,hn) < 75: miss.append(l)
    nlines=sum(1 for g in gt for l in g.splitlines() if len(norm(l))>=12)
    crit=[c for c in CRIT if norm(c) in H]
    res[e]=dict(cer=round(cer*100,2), wer=round(wer*100,2), word_recall=round(rec*100,1), word_precision=round(prec*100,1),
                diacritic_word_acc=round(dacc*100,1), missing_lines=len(miss), lines_total=nlines,
                critical_ok=len(crit), critical_total=len(CRIT), critical_missed=[c for c in CRIT if c not in crit], missing_line_samples=miss[:12])
json.dump(res, open('out/ocr_metrics.json','w'), ensure_ascii=False, indent=1)
for e,r in res.items():
    print(f"{e:20s} CER {r['cer']:6} WER {r['wer']:6} Rw {r['word_recall']:5} Pw {r['word_precision']:5} diak {r['diacritic_word_acc']:5} miss {r['missing_lines']}/{r['lines_total']} crit {r['critical_ok']}/{r['critical_total']}")
