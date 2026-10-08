#!/usr/bin/env python3
"""Regresje obu korpusów, granic, wersji i routingu; nie symulacja wyroków."""
import contextlib
from datetime import date
import io
import json
from pathlib import Path
import re
import tempfile
import sys
import unittest
from unittest.mock import patch
import insolvency
import prup


class CorpusTest(unittest.TestCase):
    def cli(self, law, *args):
        out,err=io.StringIO(),io.StringIO()
        with insolvency.corpus(law),patch('sys.argv',[law,*args]),contextlib.redirect_stdout(out),contextlib.redirect_stderr(err):
            code=prup.main()
        return code,json.loads(out.getvalue()) if out.getvalue() else None,err.getvalue()

    def test_complete_lossless_partition_both_laws(self):
        for law,count in [('prup',603),('prrestr',407)]:
            with self.subTest(law=law),insolvency.corpus(law):
                meta,aa,raw=prup.load()
                self.assertEqual(len(aa),count)
                self.assertEqual(''.join(raw[a['start']:a['end']] for a in aa),raw[aa[0]['start']:])
                labels=re.findall(r'^\s*Art\.\s+(\S+)\.',raw[raw.index(prup.START_MARKER):],re.M)
                self.assertEqual([prup.normalize(x) for x in labels],[a['id'] for a in aa])
                for a in aa:self.assertEqual(a['page'],raw[:a['start']].count('\f')+1)

    def test_structure_includes_initial_root_and_every_article(self):
        for law,(marker,_) in insolvency.LAWS.items():
            with insolvency.corpus(law):
                _,aa,raw=prup.load()
            heads=insolvency.structure(raw,aa,marker)
            self.assertEqual(heads[0]['heading'],marker)
            represented={x for h in heads for x in h['articles']}
            self.assertEqual(represented,{a['id'] for a in aa})

    def test_new_letter_article_not_confused_with_base(self):
        code,a,_=self.cli('prrestr','article','211b')
        self.assertEqual(code,0);self.assertIn('trzydziestu dni',a['text']);self.assertNotIn('Art. 212.',a['text'])
        _,base,_=self.cli('prrestr','article','211');self.assertNotIn('Art. 211a.',base['text'])

    def test_repealed_partial_arrangement_rules(self):
        for article in ['181','186']:
            code,a,_=self.cli('prrestr','article',article)
            self.assertEqual(code,0);self.assertEqual(a['source_status'],'UCHYLONY')

    def test_group_omitted_distinguished_from_current_law(self):
        for law,label in [('prrestr','401–447'),('prup','524–535')]:
            _,a,_=self.cli(law,'article',label);self.assertEqual(a['source_status'],'POMINIETE_W_TJ')
        code,out,err=self.cli('prrestr','article','410')
        self.assertEqual(code,2);self.assertIsNone(out);self.assertIn('BRAK_W_SNAPSHOCIE',err)

    def test_identical_article_numbers_are_different_laws(self):
        _,a,_=self.cli('prup','article','240');_,b,_=self.cli('prrestr','article','240')
        self.assertNotEqual(a['text'],b['text']);self.assertNotEqual(a['source'],b['source'])

    def test_dates_do_not_claim_case_applicability(self):
        _,a,_=self.cli('prrestr','article','156','--as-of','2026-10-04')
        self.assertFalse(a['temporal']['case_applicability_verified'])
        self.assertEqual(a['amendments'][0]['effective_from'],'2027-02-18')
        self.assertIn('(uchylony)32)',a['text'])
        self.assertEqual(a['freshness']['result'],'SNAPSHOT_OFFLINE_NIE_JEST_FRESH_GATE')

    def test_historical_date_blocks_before_any_online_call(self):
        with patch.object(prup,'download',side_effect=AssertionError('must not fetch')):
            code,out,err=self.cli('prrestr','article','119','--as-of','2025-08-01','--verify-online')
        self.assertEqual(code,2);self.assertIsNone(out);self.assertIn('WERSJA_HISTORYCZNA',err)

    def test_malformed_date_is_error(self):
        code,out,_=self.cli('prrestr','article','119','--as-of','2026-02-30')
        self.assertEqual(code,2);self.assertIsNone(out)

    def test_effective_known_amendment_blocks_snapshot(self):
        class FutureDate(date):
            @classmethod
            def today(cls):return cls(2027,3,1)
        with patch('datetime.date',FutureDate):
            code,out,err=self.cli('prrestr','article','156','--as-of','2027-02-18')
            self.assertEqual(code,2);self.assertIsNone(out);self.assertIn('WYMAGANA_ZMIANA_WERSJI',err)
            code,_,_=self.cli('prrestr','article','156','--as-of','2027-02-17');self.assertEqual(code,0)
            code,_,_=self.cli('prup','article','452','--as-of','2027-01-11');self.assertEqual(code,2)
            code,_,_=self.cli('prup','article','240','--as-of','2027-01-11');self.assertEqual(code,0)

    def test_reform_boundary_and_arrangement_day(self):
        fn=insolvency.reform_regime
        self.assertEqual(fn(['arrangement_date=2025-08-22'])['result'],'PRZEPISY_DOTYCHCZASOWE')
        self.assertEqual(fn(['arrangement_date=2025-08-23'])['result'],'BRAK_STAREGO_REZIMU_W_PODANYCH_ZDARZENIACH')
        result=fn(['arrangement_date=2025-08-22','restructuring_application=2025-09-01'])
        self.assertEqual(result['earlier_events'],{'arrangement_date':'2025-08-22'})

    def test_reform_missing_unknown_and_duplicate_inputs_rejected(self):
        for events in [[],['vote_date=2025-08-20'],['arrangement_date=invalid'],['arrangement_date=2025-01-01','arrangement_date=2025-08-23']]:
            with self.subTest(events=events),self.assertRaises(ValueError):insolvency.reform_regime(events)

    def test_complete_routing_and_auxiliary_integrity(self):
        out=insolvency.coverage_check()
        self.assertEqual(sum(x['routed'] for x in out['laws'].values()),1010)
        self.assertFalse(out['full_commentary'])
        self.assertEqual(len(insolvency.source_manifest()['sources']),11)

    def test_commentary_status_matches_module_class(self):
        for law in ['prup','prrestr']:
            cov=json.loads((insolvency.ROOT/'references'/law/'coverage.json').read_text())
            self.assertFalse(cov['full_commentary'])
            for a in cov['articles']:
                with self.subTest(law=law,article=a['id']):
                    self.assertEqual(a['commentary_status'],insolvency.commentary_status(a,a['procedure_modules']))
                    if a['source_status']!='TEKST_W_TJ':self.assertTrue(a['commentary_status'].startswith('NIE_DOTYCZY_'))

    def test_specific_routes_not_catch_all(self):
        examples=[('prup','56h','wniosek-ogloszenie'),('prup','70^1','skutki-masa'),
                  ('prup','136','skutki-masa'),('prup','149','organy-procedura'),
                  ('prup','266a','uklad-likwidacja'),('prup','342','podzial'),
                  ('prup','425ja','miedzynarodowe'),('prup','491^14a','konsument-workflow'),
                  ('prup','491^25','postepowania-odrebne'),('prup','522','zakonczenie-zakaz'),
                  ('prrestr','139a','pomoc-publiczna'),('prrestr','211b','pzu'),
                  ('prrestr','226h','pzu'),('prrestr','227','ppu-pu'),('prrestr','312','sanacja'),
                  ('prrestr','334','procedura-zakonczenie'),('prrestr','399','odrebne-miedzynarodowe')]
        for law,article,part in examples:
            with self.subTest(law=law,article=article):self.assertIn(part,insolvency.route(law,article)[0])

    def test_online_prrestr_fails_on_new_or_repealing_act(self):
        with insolvency.corpus('prrestr'):
            meta,_,_=prup.load();pdf=(prup.SOURCE/'prrestr.pdf').read_bytes();refs=json.loads((prup.SOURCE/'references.json').read_text())
            for key in ['Akty zmieniające','Akty uchylające','Orzeczenie TK']:
                changed={**refs,key:refs.get(key,[])+[{'act':{'ELI':'DU/2099/1'}}]}
                with self.subTest(key=key),patch.object(prup,'download',side_effect=[pdf,json.dumps(changed).encode()]):
                    with self.assertRaisesRegex(ValueError,'ZMIANA_ZRODLA'):prup.verify(meta)

    def test_online_prrestr_network_failure_is_not_success(self):
        with patch.object(prup,'download',side_effect=OSError('network down')):
            code,out,err=self.cli('prrestr','article','119','--verify-online')
        self.assertEqual(code,2);self.assertIsNone(out);self.assertIn('network down',err)

    def test_online_same_prrestr_source(self):
        with insolvency.corpus('prrestr'):
            meta,_,_=prup.load();payloads=[(prup.SOURCE/'prrestr.pdf').read_bytes(),(prup.SOURCE/'references.json').read_bytes()]
            with patch.object(prup,'download',side_effect=payloads):self.assertEqual(prup.verify(meta)['result'],'ZGODNOSC_SNAPSHOTU_Z_ELI')

    def test_auxiliary_tamper_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            data=Path(d);(data/'sources').mkdir();(data/'sources/a.pdf').write_bytes(b'changed')
            (data/'sources.json').write_text(json.dumps({'sources':[{'files':{'a.pdf':'incorrect'}}]}))
            with patch.object(insolvency,'DATA',data),self.assertRaisesRegex(ValueError,'integralność'):insolvency.source_manifest()

    def test_command_works_outside_skill_directory(self):
        import subprocess,os
        with tempfile.TemporaryDirectory() as cwd:
            p=subprocess.run([sys.executable,str(insolvency.ROOT/'scripts/prrestr.py'),'article','211b'],cwd=cwd,capture_output=True,text=True,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'})
        self.assertEqual(p.returncode,0,p.stderr);self.assertEqual(json.loads(p.stdout)['id'],'211b')

if __name__=='__main__':
    import sys
    unittest.main()
