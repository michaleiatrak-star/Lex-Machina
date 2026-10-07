from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from html import unescape
from html.parser import HTMLParser
import re
from typing import Callable, Iterable, Optional, Union

CBOSA_BASE_URL = "https://orzeczenia.nsa.gov.pl"
_DOC_ID_RE = re.compile(r"^[A-Z0-9]{10}$", re.I)
_WS_RE = re.compile(r"\s+")
_TOTAL_RE = re.compile(r"Znaleziono\s+(\d+)\s+orzecze(?:ń|nia|nie)", re.I)


class VerificationStatus(str, Enum):
    FOUND = "FOUND"
    NOT_FOUND = "NOT_FOUND"
    AMBIGUOUS = "AMBIGUOUS"
    OUT_OF_SCOPE = "OUT_OF_SCOPE"


@dataclass(frozen=True)
class FetchedHtml:
    text: str
    transfer_complete: bool = True
    content_length: Optional[int] = None
    received_bytes: Optional[int] = None


@dataclass(frozen=True)
class CbosaSearchCollection:
    status: VerificationStatus
    doc_ids: tuple[str, ...] = field(default_factory=tuple)
    total: Optional[int] = None
    reason: Optional[str] = None


@dataclass(frozen=True)
class CbosaJudgment:
    doc_id: str
    case_number: str
    court: Optional[str]
    judgment_date: Optional[str]
    operative_part: Optional[str]
    reasoning: Optional[str]
    url: str
    reasoning_available: bool = False
    document_complete: bool = True
    finality: Optional[str] = None
    missing_metadata: tuple[str, ...] = ()

    @property
    def full_text(self) -> str:
        parts: list[str] = []
        if self.operative_part:
            parts.append("SENTENCJA\n" + self.operative_part)
        if self.reasoning:
            parts.append("UZASADNIENIE\n" + self.reasoning)
        return "\n\n---\n\n".join(parts)


@dataclass(frozen=True)
class CbosaVerification:
    status: VerificationStatus
    expected_case_number: str
    matches: tuple[CbosaJudgment, ...] = field(default_factory=tuple)
    rejected_case_numbers: tuple[str, ...] = field(default_factory=tuple)
    searched_doc_ids: tuple[str, ...] = field(default_factory=tuple)
    reason: Optional[str] = None

    @property
    def judgment(self) -> Optional[CbosaJudgment]:
        return self.matches[0] if self.status is VerificationStatus.FOUND and len(self.matches) == 1 else None


class _TextCollector:
    def __init__(self) -> None:
        self.parts: list[str] = []

    def add(self, data: str) -> None:
        self.parts.append(data)

    def newline(self) -> None:
        if self.parts and not self.parts[-1].endswith("\n"):
            self.parts.append("\n")

    def text(self) -> str:
        text = unescape("".join(self.parts)).replace("\xa0", " ")
        text = re.sub(r"[ \t\f\v]+", " ", text)
        text = re.sub(r" *\n *", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()


class _SearchParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.doc_ids: list[str] = []
        self._seen: set[str] = set()
        # The "related" section (span.powiazane) is not part of the result list (PR #84).
        self._related_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]) -> None:
        low = tag.lower()
        if low == "span":
            classes = (dict(attrs).get("class") or "").split()
            if self._related_depth > 0 or "powiazane" in classes:
                self._related_depth += 1
                return
        if self._related_depth > 0 or low != "a":
            return
        href = dict(attrs).get("href") or ""
        m = re.fullmatch(r"/doc/([A-Z0-9]{10})/?", href, re.I)
        if not m:
            return
        doc_id = m.group(1).upper()
        if doc_id not in self._seen:
            self._seen.add(doc_id)
            self.doc_ids.append(doc_id)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "span" and self._related_depth > 0:
            self._related_depth -= 1


class _DocumentParser(HTMLParser):
    TABLE_LABEL_CLASS = "lista-label"
    # The label may itself be nested: td.info-list-label > table > td.lista-label
    # (live page, PR #84); the outer cell then carries the label.
    OUTER_LABEL_CLASS = "info-list-label"
    VALUE_CLASS = "info-list-value"
    SECTION_VALUE_CLASS = "info-list-value-uzasadnienie"

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = _TextCollector()
        self._in_title = False

        self._current_td_class: Optional[str] = None
        self._current_td = _TextCollector()
        # CBOSA nests a table in a value cell ("Data orzeczenia": date | "orzeczenie
        # prawomocne"); inner cells belong to the outer value, not new pairs.
        self._td_nesting = 0
        self._pending_table_label: Optional[str] = None
        self.table_values: dict[str, str] = {}

        self._current_div_class: Optional[str] = None
        self._current_div = _TextCollector()
        self._pending_section_label: Optional[str] = None
        self._section_depth = 0
        self._section_collector: Optional[_TextCollector] = None
        self.sections: dict[str, str] = {}
        self.saw_html_end = False
        self.saw_body_end = False
        self.saw_sentencja_label = False
        self.saw_uzasadnienie_label = False

    @staticmethod
    def _classes(attrs: list[tuple[str, Optional[str]]]) -> set[str]:
        raw = dict(attrs).get("class") or ""
        return {x for x in raw.split() if x}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]) -> None:
        low = tag.lower()
        classes = self._classes(attrs)
        if low == "title":
            self._in_title = True
            return
        if low == "td":
            if self._current_td_class is not None:
                self._td_nesting += 1
                self._current_td.add(" ")
                return
            self._current_td_class = next(iter(classes), None) if len(classes) == 1 else " ".join(sorted(classes))
            self._current_td = _TextCollector()
            return
        if low == "div":
            self._current_div_class = next(iter(classes), None) if len(classes) == 1 else " ".join(sorted(classes))
            self._current_div = _TextCollector()
            return
        if low == "span" and self.SECTION_VALUE_CLASS in classes and self._pending_section_label:
            self._section_depth = 1
            self._section_collector = _TextCollector()
            return
        if self._section_depth > 0:
            if low == "br":
                if self._section_collector:
                    self._section_collector.newline()
                return
            if low in {"img", "hr", "meta", "link", "input"}:
                return
            self._section_depth += 1
            if low in {"p", "div", "li", "tr"} and self._section_collector:
                self._section_collector.newline()
        elif low in {"br", "p"}:
            if self._current_td_class:
                self._current_td.newline()
            if self._current_div_class:
                self._current_div.newline()

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, Optional[str]]]) -> None:
        if tag.lower() == "br":
            if self._section_depth > 0 and self._section_collector:
                self._section_collector.newline()
            if self._current_td_class:
                self._current_td.newline()
            if self._current_div_class:
                self._current_div.newline()

    def handle_endtag(self, tag: str) -> None:
        low = tag.lower()
        if low == "html":
            self.saw_html_end = True
        elif low == "body":
            self.saw_body_end = True
        if low == "title":
            self._in_title = False
            return

        if self._section_depth > 0:
            self._section_depth -= 1
            if self._section_depth == 0 and self._section_collector is not None:
                label = (self._pending_section_label or "").strip()
                value = self._section_collector.text()
                if label and value:
                    self.sections[label] = value
                self._section_collector = None
                self._pending_section_label = None
            elif low in {"p", "div", "li", "tr"} and self._section_collector:
                self._section_collector.newline()
            return

        if low == "td" and self._td_nesting > 0:
            self._td_nesting -= 1
            self._current_td.add(" ")
            return
        if low == "td" and self._current_td_class is not None:
            text = self._current_td.text()
            classes = set(self._current_td_class.split())
            if self.TABLE_LABEL_CLASS in classes or self.OUTER_LABEL_CLASS in classes:
                self._pending_table_label = text
            elif self.VALUE_CLASS in classes and self._pending_table_label:
                self.table_values[self._pending_table_label] = text
                self._pending_table_label = None
            self._current_td_class = None
            self._current_td = _TextCollector()
            return

        if low == "div" and self._current_div_class is not None:
            text = self._current_div.text()
            classes = set(self._current_div_class.split())
            if self.TABLE_LABEL_CLASS in classes and text in {"Sentencja", "Uzasadnienie"}:
                self._pending_section_label = text
                if text == "Sentencja":
                    self.saw_sentencja_label = True
                elif text == "Uzasadnienie":
                    self.saw_uzasadnienie_label = True
            self._current_div_class = None
            self._current_div = _TextCollector()

    def handle_data(self, data: str) -> None:
        if self._section_depth > 0 and self._section_collector is not None:
            self._section_collector.add(data)
            return
        if self._in_title:
            self.title.add(data)
        if self._current_td_class is not None:
            self._current_td.add(data)
        if self._current_div_class is not None:
            self._current_div.add(data)


def normalize_case_number(case_number: str) -> str:
    value = unescape(case_number or "").replace("\xa0", " ").strip().upper()
    value = value.replace(".", "")
    value = _WS_RE.sub(" ", value)
    value = re.sub(r"\s*/\s*", "/", value)
    return value


def extract_doc_ids(search_html: str) -> list[str]:
    parser = _SearchParser()
    parser.feed(search_html)
    parser.close()
    return parser.doc_ids


def extract_total_results(search_html: str) -> Optional[int]:
    m = _TOTAL_RE.search(unescape(search_html))
    return int(m.group(1)) if m else None


def _extract_case_from_title(title: str) -> Optional[str]:
    if not title:
        return None
    # CBOSA title contract: "SYGNATURA - Wyrok/Postanowienie/Uchwała ..."
    head = re.split(r"\s+-\s+(?=(?:Wyrok|Postanowienie|Uchwała)\b)", title, maxsplit=1, flags=re.I)[0]
    if head != title:
        normalized = normalize_case_number(head)
        return normalized or None
    return None


def _table_value(table: dict[str, str], labels: tuple[str, ...]) -> Optional[str]:
    """Odczyt pola tabeli z tolerancją etykiety: wprost, z dwukropkiem, oraz po normalizacji
    (bez końcowego ":", bez spacji, bez wielkości liter) — i po liście synonimów.
    Odpowiednik poleTabeli() z portu JS."""
    for label in labels:
        if table.get(label):
            return table[label]
        if table.get(f"{label}:"):
            return table[f"{label}:"]
    want = {label.lower() for label in labels}
    for key, value in table.items():
        if value and re.sub(r":\s*$", "", key).strip().lower() in want:
            return value
    return None


def parse_cbosa_document(document_html: str, doc_id: str) -> CbosaJudgment:
    safe_doc_id = re.sub(r"[^A-Z0-9]", "", doc_id.upper())
    if not _DOC_ID_RE.fullmatch(safe_doc_id):
        raise ValueError(f"Nieprawidłowy CBOSA doc_id: {doc_id!r}")

    parser = _DocumentParser()
    parser.feed(document_html)
    parser.close()

    title = parser.title.text()
    case_number = (
        _extract_case_from_title(title)
        or _table_value(parser.table_values, ("Sygnatura", "Sygnatura akt"))
    )
    if not case_number:
        raise ValueError(f"Brak sygnatury w dokumencie CBOSA {safe_doc_id}")

    case_number = normalize_case_number(case_number)
    court = _table_value(parser.table_values, ("Sąd", "Sąd/Organ", "Sąd orzekający"))
    date_field = _table_value(parser.table_values, ("Data orzeczenia", "Data wyroku")) or ""
    # "2019-05-22 orzeczenie prawomocne" -> data + informacja CBOSA o prawomocności
    date_match = re.search(r"\d{4}-\d{2}-\d{2}", date_field)
    judgment_date = date_match.group(0) if date_match else date_field
    finality_match = re.search(r"orzeczenie\s+(?:nie)?prawomocne", date_field, flags=re.I)
    finality = finality_match.group(0).lower() if finality_match else None
    operative_part = parser.sections.get("Sentencja")
    reasoning = parser.sections.get("Uzasadnienie")

    # KOTWICE poprawności (fail-closed): sygnatura, Sentencja, zamknięty BODY/HTML.
    # "Sąd"/"Data orzeczenia" są BEST-EFFORT — ich brak (inny układ karty) nie przekreśla
    # odczytu treści; zwracamy je jako None z listą missing_metadata (zgł. 2026-10-07:
    # karta bez pól "Sąd, Data orzeczenia" dawała fałszywe OUT_OF_SCOPE mimo realnego orzeczenia).
    if not parser.saw_html_end or not parser.saw_body_end:
        raise ValueError(f"Niekompletny HTML CBOSA {safe_doc_id}: brak zamknięcia BODY/HTML")
    if not operative_part:
        raise ValueError(
            f"Zmiana/niekompletność kontraktu HTML CBOSA {safe_doc_id}: brak Sentencji"
        )
    if parser.saw_uzasadnienie_label and not reasoning:
        raise ValueError(
            f"Niekompletna sekcja Uzasadnienie w dokumencie CBOSA {safe_doc_id}"
        )
    missing_metadata = tuple(
        name for name, value in (("Sąd", court), ("Data orzeczenia", judgment_date)) if not value
    )

    return CbosaJudgment(
        doc_id=safe_doc_id,
        case_number=case_number,
        court=court or None,
        judgment_date=judgment_date or None,
        operative_part=operative_part or None,
        reasoning=reasoning or None,
        url=f"{CBOSA_BASE_URL}/doc/{safe_doc_id}",
        reasoning_available=bool(reasoning),
        document_complete=True,
        finality=finality,
        missing_metadata=missing_metadata,
    )



def _coerce_fetched_html(value: Union[str, FetchedHtml]) -> str:
    if isinstance(value, str):
        return value
    if not value.transfer_complete:
        raise ValueError("Niekompletny transport HTTP (transfer_complete=False)")
    if (
        value.content_length is not None
        and value.received_bytes is not None
        and value.content_length != value.received_bytes
    ):
        raise ValueError(
            "Niekompletny transport HTTP: "
            f"Content-Length={value.content_length}, received={value.received_bytes}"
        )
    return value.text


def collect_search_doc_ids(
    first_html: str,
    fetch_page: Callable[[int], str],
    *,
    max_pages: int = 250,
) -> CbosaSearchCollection:
    total = extract_total_results(first_html)
    if total is None:
        return CbosaSearchCollection(
            status=VerificationStatus.OUT_OF_SCOPE,
            reason="Nie rozpoznano licznika wyników CBOSA — możliwy drift HTML.",
        )
    if total == 0:
        return CbosaSearchCollection(
            status=VerificationStatus.NOT_FOUND,
            doc_ids=tuple(),
            total=0,
        )

    ordered: list[str] = []
    seen: set[str] = set()

    def add_page(html: str) -> int:
        added = 0
        for doc_id in extract_doc_ids(html):
            if doc_id not in seen:
                seen.add(doc_id)
                ordered.append(doc_id)
                added += 1
        return added

    # Nadmiar unikalnych /doc/{ID} ponad licznik „Znaleziono N” NIE jest driftem: strona
    # wyników CBOSA niesie też linki spoza trafień (orzeczenia powiązane, nawigacja). To
    # dodatkowi kandydaci, nie brak kompletności — i tak przechodzą przez exact-match
    # + fail-closed parse_cbosa_document, więc nie dają fałszywego trafienia. Dawna blokada
    # `> total` zwracała fałszywe OUT_OF_SCOPE dla istniejących wyroków (zgł. 2026-10-07).
    add_page(first_html)

    page = 2
    while len(ordered) < total:
        if page > max_pages:
            return CbosaSearchCollection(
                status=VerificationStatus.OUT_OF_SCOPE,
                doc_ids=tuple(ordered),
                total=total,
                reason=f"Przekroczono limit paginacji max_pages={max_pages}.",
            )
        html = fetch_page(page)
        added = add_page(html)
        if added == 0:
            return CbosaSearchCollection(
                status=VerificationStatus.OUT_OF_SCOPE,
                doc_ids=tuple(ordered),
                total=total,
                reason=f"Paginacja zatrzymała się/powtórzyła na stronie p={page}.",
            )
        page += 1

    return CbosaSearchCollection(
        status=VerificationStatus.FOUND,
        doc_ids=tuple(ordered),
        total=total,
    )


def classify_exact_matches(
    expected_case_number: str,
    documents: Iterable[CbosaJudgment],
    searched_doc_ids: Iterable[str] = (),
) -> CbosaVerification:
    expected = normalize_case_number(expected_case_number)
    exact: list[CbosaJudgment] = []
    rejected: list[str] = []

    for document in documents:
        if normalize_case_number(document.case_number) == expected:
            exact.append(document)
        else:
            rejected.append(document.case_number)

    if len(exact) == 1:
        status = VerificationStatus.FOUND
    elif len(exact) == 0:
        status = VerificationStatus.NOT_FOUND
    else:
        status = VerificationStatus.AMBIGUOUS

    return CbosaVerification(
        status=status,
        expected_case_number=expected,
        matches=tuple(exact),
        rejected_case_numbers=tuple(rejected),
        searched_doc_ids=tuple(searched_doc_ids),
    )


def verify_search_results(
    search_html: str,
    expected_case_number: str,
    fetch_document: Callable[[str], Union[str, FetchedHtml]],
) -> CbosaVerification:
    expected = normalize_case_number(expected_case_number)
    doc_ids = extract_doc_ids(search_html)
    total = extract_total_results(search_html)

    if total is None:
        return CbosaVerification(
            status=VerificationStatus.OUT_OF_SCOPE,
            expected_case_number=expected,
            searched_doc_ids=tuple(doc_ids),
            reason="Nie rozpoznano licznika wyników CBOSA — możliwy drift HTML.",
        )

    if total == 0:
        return CbosaVerification(
            status=VerificationStatus.NOT_FOUND,
            expected_case_number=expected,
            searched_doc_ids=tuple(),
            reason="CBOSA zwróciła 0 wyników dla zakończonego wyszukiwania.",
        )

    if not doc_ids:
        return CbosaVerification(
            status=VerificationStatus.OUT_OF_SCOPE,
            expected_case_number=expected,
            searched_doc_ids=tuple(),
            reason=(
                "Nie udało się potwierdzić kompletnego wyniku CBOSA: "
                "HTML nie zawiera /doc/{ID} albo zmienił się kontrakt strony."
            ),
        )

    # CBOSA renderuje 10 wyników na stronę. Dla exact-case lookup wynik musi być
    # kompletny przed nadaniem NOT_FOUND/FOUND/AMBIGUOUS; inaczej brak rekordu na
    # pierwszej stronie mógłby zostać błędnie uznany za brak w bazie.
    if total is not None and total > len(doc_ids):
        return CbosaVerification(
            status=VerificationStatus.OUT_OF_SCOPE,
            expected_case_number=expected,
            searched_doc_ids=tuple(doc_ids),
            reason=(
                f"Wynik CBOSA wymaga paginacji: total={total}, "
                f"odczytano={len(doc_ids)}. Pobierz /cbo/find?p=N w tej samej sesji."
            ),
        )

    documents: list[CbosaJudgment] = []
    try:
        for doc_id in doc_ids:
            fetched = fetch_document(doc_id)
            document_html = _coerce_fetched_html(fetched)
            documents.append(parse_cbosa_document(document_html, doc_id))
    except Exception as exc:
        return CbosaVerification(
            status=VerificationStatus.OUT_OF_SCOPE,
            expected_case_number=expected,
            searched_doc_ids=tuple(doc_ids),
            reason=f"Nie udało się odczytać wszystkich kandydatów CBOSA: {exc}",
        )

    return classify_exact_matches(expected, documents, doc_ids)
