import os
import easyocr, time, sys
r = easyocr.Reader(['pl'], gpu=False)
t=time.time()
for i in range(int(os.environ.get("NPAGES", "3"))):
    res = r.readtext(f'doc/img-00{i}.jpg', detail=0, paragraph=False)
    open(f'out/easy_p{i+1}.txt','w').write('\n'.join(res))
print('easy', round(time.time()-t,1))
