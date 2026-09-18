import pytest

from cbosa_parser import (
    FetchedHtml,
    VerificationStatus,
    collect_search_doc_ids,
    extract_doc_ids,
    normalize_case_number,
    parse_cbosa_document,
    verify_search_results,
)

BASE_DOC = """
<html><head><TITLE>{case} - Wyrok NSA z 2026-01-10</TITLE></head><body>
<table>
<tr><td class="lista-label">Sąd</td><td class="info-list-value">Naczelny Sąd Administracyjny</td></tr>
<tr><td class="lista-label">Data orzeczenia</td><td class="info-list-value">2026-01-10</td></tr>
</table>
<div class="lista-label">Sentencja</div>
<span class="info-list-value-uzasadnienie"><p>Oddala skargę kasacyjną.</p></span>
<div class="lista-label">Uzasadnienie</div>
<span class="info-list-value-uzasadnienie"><p>Pełne uzasadnienie.</p><p>Drugi akapit.</p></span>
</body></html>
"""

def doc(case="II FSK 100/24"):
    return BASE_DOC.format(case=case)

def search(total, items):
    links = "".join(f'<a href="/doc/{doc_id}">{label}</a>' for doc_id, label in items)
    return f"<html><body><div>Znaleziono {total} orzeczeń</div>{links}</body></html>"

def test_extract_doc_ids_deduplicates():
    s = search(1, [("AAAAAAAAAA","x"),("AAAAAAAAAA","x2")])
    assert extract_doc_ids(s) == ["AAAAAAAAAA"]

def test_parse_full_document():
    d = parse_cbosa_document(doc(), "AAAAAAAAAA")
    assert d.case_number == "II FSK 100/24"
    assert d.court == "Naczelny Sąd Administracyjny"
    assert d.judgment_date == "2026-01-10"
    assert d.reasoning_available is True
    assert "Pełne uzasadnienie" in (d.reasoning or "")

def test_html_drift_extra_classes_is_tolerated():
    html = doc().replace('class="lista-label"', 'class="new-wrapper lista-label extra"')
    html = html.replace('class="info-list-value"', 'class="info-list-value another"')
    d = parse_cbosa_document(html, "AAAAAAAAAA")
    assert d.case_number == "II FSK 100/24"

def test_html_drift_critical_metadata_change_must_fail_closed():
    html = doc().replace("lista-label", "cbosa-label-v2").replace("info-list-value", "cbosa-value-v2")
    r = verify_search_results(search(1,[("AAAAAAAAAA","one")]), "II FSK 100/24", lambda _: html)
    assert r.status == VerificationStatus.OUT_OF_SCOPE

def test_changed_total_counter_text_must_fail_closed():
    s = '<html><body><div>Liczba wyników: 1</div><a href="/doc/AAAAAAAAAA">one</a></body></html>'
    r = verify_search_results(s, "II FSK 100/24", lambda _: doc())
    assert r.status == VerificationStatus.OUT_OF_SCOPE

def test_incomplete_pagination_is_out_of_scope():
    r = verify_search_results(search(11,[("AAAAAAAAAA","one")]), "II FSK 100/24", lambda _: doc())
    assert r.status == VerificationStatus.OUT_OF_SCOPE

def test_duplicate_links_same_document_are_fetched_once():
    s = '<div>Znaleziono 1 orzeczenie</div><a href="/doc/AAAAAAAAAA">a</a><a href="/doc/AAAAAAAAAA">b</a>'
    calls=[]
    def fetch(doc_id):
        calls.append(doc_id)
        return doc()
    r=verify_search_results(s,"II FSK 100/24",fetch)
    assert r.status == VerificationStatus.FOUND
    assert calls == ["AAAAAAAAAA"]

@pytest.mark.parametrize("returned",[
    "III FSK 100/24",
    "II FSK 100/23",
    "II FSK 101/24",
    "II OSK 100/24",
    "II SA/Wa 100/24",
])
def test_near_matches_are_rejected(returned):
    r=verify_search_results(search(1,[("AAAAAAAAAA","one")]),"II FSK 100/24",lambda _:doc(returned))
    assert r.status == VerificationStatus.NOT_FOUND
    assert normalize_case_number(returned) in r.rejected_case_numbers

@pytest.mark.parametrize("variant",[
    "ii fsk 100/24",
    "II   FSK   100/24",
    "II F.S.K. 100 / 24",
])
def test_cosmetic_case_number_variants_match(variant):
    assert normalize_case_number(variant) == "II FSK 100/24"

def test_two_distinct_docs_same_exact_case_are_ambiguous():
    s=search(2,[("AAAAAAAAAA","one"),("BBBBBBBBBB","two")])
    r=verify_search_results(s,"II FSK 100/24",lambda _:doc())
    assert r.status == VerificationStatus.AMBIGUOUS
    assert len(r.matches)==2

def test_one_candidate_fetch_failure_is_out_of_scope():
    s=search(2,[("AAAAAAAAAA","one"),("BBBBBBBBBB","two")])
    def fetch(doc_id):
        if doc_id=="BBBBBBBBBB":
            raise TimeoutError("partial fetch")
        return doc("III FSK 100/24")
    r=verify_search_results(s,"II FSK 100/24",fetch)
    assert r.status == VerificationStatus.OUT_OF_SCOPE

def test_truncated_reasoning_must_fail_closed():
    truncated = """
    <html><head><TITLE>II FSK 100/24 - Wyrok NSA z 2026-01-10</TITLE></head><body>
    <table><tr><td class="lista-label">Sąd</td><td class="info-list-value">Naczelny Sąd Administracyjny</td></tr>
    <tr><td class="lista-label">Data orzeczenia</td><td class="info-list-value">2026-01-10</td></tr></table>
    <div class="lista-label">Sentencja</div><span class="info-list-value-uzasadnienie">Oddala.</span>
    <div class="lista-label">Uzasadnienie</div><span class="info-list-value-uzasadnienie">Sąd zważył...
    """
    r=verify_search_results(search(1,[("AAAAAAAAAA","one")]),"II FSK 100/24",lambda _:truncated)
    assert r.status == VerificationStatus.OUT_OF_SCOPE

def test_missing_reasoning_is_found_but_flag_false():
    no_reasoning = """
    <html><head><TITLE>II FSK 100/24 - Wyrok NSA z 2026-01-10</TITLE></head><body>
    <table><tr><td class="lista-label">Sąd</td><td class="info-list-value">Naczelny Sąd Administracyjny</td></tr>
    <tr><td class="lista-label">Data orzeczenia</td><td class="info-list-value">2026-01-10</td></tr></table>
    <div class="lista-label">Sentencja</div><span class="info-list-value-uzasadnienie">Oddala.</span>
    </body></html>
    """
    r=verify_search_results(search(1,[("AAAAAAAAAA","one")]),"II FSK 100/24",lambda _:no_reasoning)
    assert r.status == VerificationStatus.FOUND
    assert r.judgment is not None
    assert r.judgment.reasoning_available is False
    assert r.judgment.reasoning is None

def test_captcha_page_is_out_of_scope():
    captcha="<html><body><h1>Potwierdź, że nie jesteś robotem</h1></body></html>"
    r=verify_search_results(search(1,[("AAAAAAAAAA","one")]),"II FSK 100/24",lambda _:captcha)
    assert r.status == VerificationStatus.OUT_OF_SCOPE

def test_repeated_pagination_fails_closed():
    first=search(11,[(f"A{i:09}","x") for i in range(10)])
    repeated=search(11,[(f"A{i:09}","x") for i in range(10)])
    r=collect_search_doc_ids(first,lambda page:repeated)
    assert r.status == VerificationStatus.OUT_OF_SCOPE

def test_pagination_collects_unique_docs():
    first=search(11,[(f"A{i:09}","x") for i in range(10)])
    second=search(11,[("B000000000","last")])
    r=collect_search_doc_ids(first,lambda page:second)
    assert r.status == VerificationStatus.FOUND
    assert len(r.doc_ids)==11
    assert len(set(r.doc_ids))==11

def test_incomplete_http_transfer_fails_closed():
    fetched=FetchedHtml(text=doc(),transfer_complete=False)
    r=verify_search_results(search(1,[("AAAAAAAAAA","one")]),"II FSK 100/24",lambda _:fetched)
    assert r.status == VerificationStatus.OUT_OF_SCOPE

def test_content_length_mismatch_fails_closed():
    html=doc()
    fetched=FetchedHtml(text=html,content_length=len(html)+10,received_bytes=len(html))
    r=verify_search_results(search(1,[("AAAAAAAAAA","one")]),"II FSK 100/24",lambda _:fetched)
    assert r.status == VerificationStatus.OUT_OF_SCOPE
