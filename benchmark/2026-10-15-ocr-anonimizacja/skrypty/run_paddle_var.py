import os
import sys, time, json, fitz, numpy as np
from paddleocr import PaddleOCR
name, unwarp, dpi = sys.argv[1], sys.argv[2]=='1', int(sys.argv[3])
o = PaddleOCR(lang="pl", ocr_version="PP-OCRv6", use_doc_orientation_classify=True, use_doc_unwarping=unwarp, use_textline_orientation=True, enable_mkldnn=False)
doc = fitz.open('doc/in.pdf'); t=time.time()
for i in range(int(os.environ.get("NPAGES", "3"))):
    pix = doc[i].get_pixmap(dpi=dpi, alpha=False)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:,:,:3]
    txt=[]
    for r in o.predict(img):
        p=r.json; p=json.loads(p) if isinstance(p,str) else p; p=p.get('res',p)
        txt += [s.strip() for s in p.get('rec_texts',[]) if s.strip()]
    open(f'out/{name}_p{i+1}.txt','w').write('\n'.join(txt))
print(name, round(time.time()-t,1))
