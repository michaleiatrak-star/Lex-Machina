#!/usr/bin/env python3
"""Testy integralności źródła, granic artykułów, numeracji i aktualności.
Nie są testem poprawności rozstrzygnięć prawnych ani benchmarkiem modelu.
"""
import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import prup
from build_prup_coverage import routes


class PrUpTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.meta, cls.articles, cls.raw=prup.load()

    def run_cli(self,*args):
        stdout,stderr=io.StringIO(),io.StringIO()
        with patch('sys.argv',['prup.py',*args]),contextlib.redirect_stdout(stdout),contextlib.redirect_stderr(stderr):
            code=prup.main()
        return code,stdout.getvalue(),stderr.getvalue()

    def test_index_matches_all_heading_occurrences(self):
        import re
        labels=re.findall(r'^\s*Art\.\s+(\S+)\.',self.raw[self.raw.index('CZĘŚĆ PIERWSZA'):],re.M)
        self.assertEqual(len(labels),603)
        self.assertEqual([prup.normalize(x) for x in labels],[a['id'] for a in self.articles])

    def test_lossless_partition(self):
        reconstructed=''.join(self.raw[a['start']:a['end']] for a in self.articles)
        self.assertEqual(reconstructed,self.raw[self.articles[0]['start']:])

    def test_superscript_aliases_are_same_article(self):
        for value in ('491^14','491[14]','491¹⁴','Art. 491¹⁴.'):
            code,out,_=self.run_cli('article',value)
            self.assertEqual(code,0)
            self.assertEqual(json.loads(out)['id'],'491^14')

    def test_article_239_not_239a(self):
        code,out,_=self.run_cli('article','239');self.assertEqual(code,0)
        data=json.loads(out)
        self.assertEqual(data['source_status'],'UCHYLONY')
        self.assertNotIn('Art. 239a.',data['text'])

    def test_article_240_boundary(self):
        code,out,_=self.run_cli('article','240');self.assertEqual(code,0)
        data=json.loads(out)
        self.assertIn('numer rachunku bankowego',data['text'])
        self.assertNotIn('Art. 240a.',data['text'])
        self.assertEqual(data['page'],52)

    def test_unknown_does_not_guess(self):
        code,out,err=self.run_cli('article','49114')
        self.assertEqual(code,2);self.assertEqual(out,'')
        self.assertIn('BRAK_W_SNAPSHOCIE',err)

    def test_omitted_group_explicit(self):
        _,out,_=self.run_cli('article','524–535')
        self.assertEqual(json.loads(out)['source_status'],'POMINIETE_W_TJ')

    def test_offline_never_claims_fresh(self):
        _,out,_=self.run_cli('article','240')
        self.assertEqual(json.loads(out)['freshness']['result'],'SNAPSHOT_OFFLINE_NIE_JEST_FRESH_GATE')

    def test_future_amendment_flagged_for_affected_only(self):
        _,out,_=self.run_cli('article','452')
        self.assertEqual(json.loads(out)['amendments'][0]['effective_from'],'2027-01-11')
        _,out,_=self.run_cli('article','240')
        self.assertEqual(json.loads(out)['amendments'],[])

    def test_source_tamper_blocks(self):
        with tempfile.TemporaryDirectory() as directory:
            data=Path(directory);sources=data/'sources';sources.mkdir()
            (data/'metadata.json').write_text(json.dumps(self.meta))
            (data/'index.json').write_bytes((prup.DATA/'index.json').read_bytes())
            (sources/'prup.txt').write_text(self.raw+'Zmiana')
            with patch.object(prup,'DATA',data),patch.object(prup,'SOURCE',sources):
                with self.assertRaisesRegex(ValueError,'integralność'):prup.load()

    def test_index_tamper_blocks(self):
        with tempfile.TemporaryDirectory() as directory:
            data=Path(directory);sources=data/'sources';sources.mkdir()
            (data/'metadata.json').write_text(json.dumps(self.meta))
            idx=json.loads((prup.DATA/'index.json').read_text());idx['articles'][1]['start']+=5
            (data/'index.json').write_text(json.dumps(idx))
            (sources/'prup.txt').write_bytes((prup.SOURCE/'prup.txt').read_bytes())
            with patch.object(prup,'DATA',data),patch.object(prup,'SOURCE',sources):
                with self.assertRaisesRegex(ValueError,'Indeks'):prup.load()

    def test_online_same_sources_pass(self):
        pdf=(prup.SOURCE/'prup.pdf').read_bytes();refs=(prup.SOURCE/'references.json').read_bytes()
        with patch.object(prup,'download',side_effect=[pdf,refs]):
            self.assertEqual(prup.verify(self.meta)['result'],'ZGODNOSC_SNAPSHOTU_Z_ELI')

    def test_online_new_amendment_blocks(self):
        pdf=(prup.SOURCE/'prup.pdf').read_bytes();refs=json.loads((prup.SOURCE/'references.json').read_text())
        refs['Akty zmieniające'].append({'act':{'ELI':'test/new'},'date':'2099-01-01'})
        with patch.object(prup,'download',side_effect=[pdf,json.dumps(refs).encode()]):
            with self.assertRaisesRegex(ValueError,'ZMIANA_ZRODLA'):prup.verify(self.meta)

    def test_online_changed_pdf_blocks(self):
        refs=(prup.SOURCE/'references.json').read_bytes()
        with patch.object(prup,'download',side_effect=[b'changed',refs]):
            with self.assertRaisesRegex(ValueError,'ZMIANA_ZRODLA'):prup.verify(self.meta)

    def test_online_error_does_not_silently_fallback(self):
        with patch.object(prup,'download',side_effect=OSError('ELI unavailable')):
            code,out,err=self.run_cli('article','240','--verify-online')
        self.assertEqual(code,2);self.assertEqual(out,'');self.assertIn('unavailable',err)

    def test_literal_search_has_real_hits(self):
        code,out,_=self.run_cli('search','rachunku bankowego')
        self.assertEqual(code,0)
        self.assertIn('240',[x['id'] for x in json.loads(out)['hits']])

    def test_coverage_matches_index_without_full_claim(self):
        coverage=json.loads((prup.DATA/'coverage.json').read_text())
        self.assertFalse(coverage['full_commentary'])
        self.assertEqual([a['id'] for a in coverage['articles']],[a['id'] for a in self.articles])
        for a in coverage['articles']:
            for m in a['procedure_modules']:
                self.assertTrue((prup.ROOT/'modules'/m).is_file())

    def test_consumer_route_is_distinct(self):
        self.assertNotEqual(routes('491^14'),routes('256'))
        self.assertNotEqual(routes('491^25'),routes('491^14'))
        self.assertNotEqual(routes('266a'),routes('266'))


if __name__=='__main__':unittest.main()
