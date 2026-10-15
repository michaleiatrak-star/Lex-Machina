import json, os, time, sys, re
pages = [open(f'gt/p{i}.txt').read() for i in range(1, int(os.environ.get("NPAGES", "3")) + 1)]
which = sys.argv[1]
def apply(text, spans):
    spans = sorted(spans, key=lambda s: (s[0], -s[1])); out=[]; pos=0
    for s,e,l in spans:
        if s < pos: 
            continue
        out.append(text[pos:s]); out.append(f'<{l}>'); pos=e
    out.append(text[pos:]); return ''.join(out)
t=time.time(); res=[]
if which=='presidio':
    from presidio_analyzer import AnalyzerEngine, RecognizerRegistry
    from presidio_analyzer.nlp_engine import NlpEngineProvider
    from presidio_analyzer.predefined_recognizers import EmailRecognizer, IbanRecognizer, PhoneRecognizer, SpacyRecognizer
    try:
        from presidio_analyzer.predefined_recognizers import PlPeselRecognizer
    except ImportError: PlPeselRecognizer=None
    conf={"nlp_engine_name":"spacy","models":[{"lang_code":"pl","model_name":"pl_core_news_lg"}],
          "ner_model_configuration":{"model_to_presidio_entity_mapping":{"persName":"PERSON","placeName":"LOCATION","geogName":"LOCATION","orgName":"ORGANIZATION"},"labels_to_ignore":["date","time"]}}
    nlp=NlpEngineProvider(nlp_configuration=conf).create_engine()
    reg=RecognizerRegistry(supported_languages=["pl"])
    reg.add_recognizer(SpacyRecognizer(supported_language="pl", supported_entities=["PERSON","LOCATION","ORGANIZATION"]))
    for R in (EmailRecognizer, IbanRecognizer): reg.add_recognizer(R(supported_language="pl"))
    reg.add_recognizer(PhoneRecognizer(supported_language="pl", supported_regions=("PL",)))
    if PlPeselRecognizer: reg.add_recognizer(PlPeselRecognizer(supported_language="pl"))
    an=AnalyzerEngine(nlp_engine=nlp, registry=reg, supported_languages=["pl"])
    ents=["PERSON","LOCATION","EMAIL_ADDRESS","IBAN_CODE","PHONE_NUMBER","PL_PESEL"]
    for p in pages:
        r=an.analyze(text=p, language="pl", entities=ents)
        res.append(dict(text=apply(p,[(x.start,x.end,x.entity_type) for x in r]), findings=[(x.entity_type,p[x.start:x.end]) for x in r]))
elif which=='spacy':
    import spacy; nlp=spacy.load('pl_core_news_lg')
    for p in pages:
        d=nlp(p); sp=[(e.start_char,e.end_char,e.label_) for e in d.ents if e.label_ in ('persName','placeName','geogName')]
        res.append(dict(text=apply(p,sp), findings=[(l,p[s:e]) for s,e,l in sp]))
elif which=='gliner':
    from gliner import GLiNER
    m=GLiNER.from_pretrained("urchade/gliner_multi_pii-v1")
    labels=["person","address","phone number","email","bank account number","tax identification number","company registration number","professional license number"]
    for p in pages:
        sp=[]; off=0
        for line in p.split('\n'):
            for e in m.predict_entities(line, labels, threshold=0.4):
                sp.append((off+e['start'], off+e['end'], e['label'].upper().replace(' ','_')))
            off+=len(line)+1
        res.append(dict(text=apply(p,sp), findings=[(l,p[s:e]) for s,e,l in sp]))
json.dump(dict(sec=round(time.time()-t,1), pages=res), open(f'out/anon_{which}.json','w'), ensure_ascii=False, indent=1)
print(which, round(time.time()-t,1))
