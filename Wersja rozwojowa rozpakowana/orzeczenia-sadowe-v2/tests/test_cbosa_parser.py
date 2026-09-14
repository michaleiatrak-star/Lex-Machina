from cbosa_parser import (
    VerificationStatus,
    extract_doc_ids,
    parse_cbosa_document,
    verify_search_results,
)

SEARCH = '''
<html><body><div>Znaleziono 2 orzeczenia</div>
<a href="/doc/8889489BE0">II FSK 2870/18</a>
<a href="/doc/AAAAAAAAAA">inna sprawa</a>
<a href="/doc/8889489BE0">duplikat linku</a>
</body></html>
'''

DOC_FOUND = '''
<html><head><TITLE>II FSK 2870/18 - Wyrok NSA z 2020-06-18</TITLE></head><body>
<table>
<tr><td class="lista-label">Sąd</td><td class="info-list-value">Naczelny Sąd Administracyjny</td></tr>
<tr><td class="lista-label">Data orzeczenia</td><td class="info-list-value">2020-06-18</td></tr>
</table>
<div class="lista-label">Sentencja</div>
<span class="info-list-value-uzasadnienie"><p>NSA oddala skargę kasacyjną.</p></span>
<div class="lista-label">Uzasadnienie</div>
<span class="info-list-value-uzasadnienie"><p>Pierwszy akapit uzasadnienia.</p><p>Drugi akapit z <b>ważną</b> treścią.<br>Dalszy wiersz.</p></span>
</body></html>
'''

DOC_WRONG = '''
<html><head><TITLE>III FSK 2870/18 - Wyrok NSA z 2020-06-18</TITLE></head><body>
<table>
<tr><td class="lista-label">Sąd</td><td class="info-list-value">Naczelny Sąd Administracyjny</td></tr>
<tr><td class="lista-label">Data orzeczenia</td><td class="info-list-value">2020-06-18</td></tr>
</table>
<div class="lista-label">Sentencja</div><span class="info-list-value-uzasadnienie">Inna sentencja.</span>
<div class="lista-label">Uzasadnienie</div><span class="info-list-value-uzasadnienie">Inne uzasadnienie.</span>
</body></html>
'''


def fetch(doc_id: str) -> str:
    return {"8889489BE0": DOC_FOUND, "AAAAAAAAAA": DOC_WRONG}[doc_id]


def test_extract_doc_ids():
    assert extract_doc_ids(SEARCH) == ["8889489BE0", "AAAAAAAAAA"]


def test_parse_full_document():
    d = parse_cbosa_document(DOC_FOUND, "8889489BE0")
    assert d.case_number == "II FSK 2870/18"
    assert d.court == "Naczelny Sąd Administracyjny"
    assert d.judgment_date == "2020-06-18"
    assert "NSA oddala skargę kasacyjną" in (d.operative_part or "")
    assert "Pierwszy akapit" in (d.reasoning or "")
    assert "Drugi akapit" in (d.reasoning or "")
    assert "Dalszy wiersz" in (d.reasoning or "")
    assert "UZASADNIENIE" in d.full_text


def test_found_and_reject_near_match():
    r = verify_search_results(SEARCH, "ii   f.s.k. 2870 / 18", fetch)
    assert r.status == VerificationStatus.FOUND
    assert r.judgment is not None
    assert r.judgment.case_number == "II FSK 2870/18"
    assert r.rejected_case_numbers == ("III FSK 2870/18",)


def test_not_found_when_only_near_matches():
    search = '<div>Znaleziono 1 orzeczenie</div><a href="/doc/AAAAAAAAAA">wrong</a>'
    r = verify_search_results(search, "II FSK 2870/18", fetch)
    assert r.status == VerificationStatus.NOT_FOUND
    assert not r.matches
    assert r.rejected_case_numbers == ("III FSK 2870/18",)


def test_ambiguous_when_two_exact_documents():
    search = '<div>Znaleziono 2 orzeczenia</div><a href="/doc/8889489BE0">one</a><a href="/doc/BBBBBBBBBB">two</a>'
    def fetch2(doc_id: str) -> str:
        if doc_id == "BBBBBBBBBB":
            return DOC_FOUND.replace("2020-06-18", "2020-06-19")
        return DOC_FOUND
    r = verify_search_results(search, "II FSK 2870/18", fetch2)
    assert r.status == VerificationStatus.AMBIGUOUS
    assert len(r.matches) == 2


def test_out_of_scope_on_incomplete_pagination():
    search = '<div>Znaleziono 11 orzeczeń</div><a href="/doc/8889489BE0">one</a>'
    r = verify_search_results(search, "II FSK 2870/18", fetch)
    assert r.status == VerificationStatus.OUT_OF_SCOPE
    assert "paginacji" in (r.reason or "")


if __name__ == "__main__":
    tests = [
        test_extract_doc_ids,
        test_parse_full_document,
        test_found_and_reject_near_match,
        test_not_found_when_only_near_matches,
        test_ambiguous_when_two_exact_documents,
        test_out_of_scope_on_incomplete_pagination,
    ]
    for test in tests:
        test()
        print("PASS", test.__name__)
    print(f"PASS {len(tests)}/{len(tests)}")
