import os
import time
from doctr.io import DocumentFile
from doctr.models import ocr_predictor, from_hub
reco = from_hub('Felix92/doctr-torch-parseq-multilingual-v1')
m = ocr_predictor(det_arch='db_resnet50', reco_arch=reco , pretrained=True)
t=time.time()
for i in range(int(os.environ.get("NPAGES", "3"))):
    d = m(DocumentFile.from_images([f'doc/img-00{i}.jpg']))
    lines=[' '.join(w.value for w in l.words) for b in d.pages[0].blocks for l in b.lines]
    open(f'out/doctr_p{i+1}.txt','w').write('\n'.join(lines))
print('doctr', round(time.time()-t,1))
