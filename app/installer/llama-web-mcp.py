from __future__ import annotations

import argparse
import html
import ipaddress
import json
import os
import re
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from typing import Any

SERVER_NAME = "lex-llama-web"
SERVER_VERSION = "1.0.0"
MCP_PROTOCOL_VERSION = "2024-11-05"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LexMachina-LlamaWeb/1.0"
DEFAULT_TIMEOUT = 15
MAX_DOWNLOAD_BYTES = 2 * 1024 * 1024
MAX_FETCH_CHARS = 24_000


def _is_public_ip(value: str) -> bool:
    try:
        ip = ipaddress.ip_address(value)
    except ValueError:
        return False
    return not (
        ip.is_private
        or ip.is_loopback
        or ip.is_link_local
        or ip.is_multicast
        or ip.is_reserved
        or ip.is_unspecified
    )


def validate_public_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("WEB_URL_SCHEME_UNSUPPORTED")
    if not parsed.hostname:
        raise ValueError("WEB_URL_HOST_MISSING")

    host = parsed.hostname.strip().rstrip(".")
    if host.lower() == "localhost":
        raise ValueError("WEB_URL_PRIVATE_HOST_BLOCKED")

    try:
        literal = ipaddress.ip_address(host)
    except ValueError:
        literal = None

    if literal is not None:
        if not _is_public_ip(host):
            raise ValueError("WEB_URL_PRIVATE_HOST_BLOCKED")
        return url

    try:
        infos = socket.getaddrinfo(host, parsed.port or (443 if parsed.scheme == "https" else 80), type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise ValueError(f"WEB_DNS_FAILED:{exc}") from exc

    addresses = {info[4][0] for info in infos}
    if not addresses or any(not _is_public_ip(address) for address in addresses):
        raise ValueError("WEB_URL_PRIVATE_HOST_BLOCKED")
    return url


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req: urllib.request.Request, fp: Any, code: int, msg: str, headers: Any, newurl: str):
        validate_public_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _opener() -> urllib.request.OpenerDirector:
    return urllib.request.build_opener(SafeRedirectHandler())


def _request(url: str, *, timeout: int = DEFAULT_TIMEOUT, headers: dict[str, str] | None = None) -> tuple[bytes, str, str, int]:
    validate_public_url(url)
    request_headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/json,text/plain,application/pdf;q=0.9,*/*;q=0.5",
        "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.6",
    }
    if headers:
        request_headers.update(headers)
    req = urllib.request.Request(url, headers=request_headers)
    with _opener().open(req, timeout=timeout) as response:
        final_url = response.geturl()
        validate_public_url(final_url)
        content_type = response.headers.get("Content-Type", "application/octet-stream")
        status = int(getattr(response, "status", 200))
        data = response.read(MAX_DOWNLOAD_BYTES + 1)
        if len(data) > MAX_DOWNLOAD_BYTES:
            data = data[:MAX_DOWNLOAD_BYTES]
        return data, final_url, content_type, status


class VisibleTextParser(HTMLParser):
    SKIP = {"script", "style", "svg", "noscript", "template"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.in_title = False
        self.title_parts: list[str] = []
        self.text_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        lower = tag.lower()
        if lower in self.SKIP:
            self.skip_depth += 1
        if lower == "title":
            self.in_title = True
        if lower in {"p", "div", "section", "article", "li", "br", "h1", "h2", "h3", "h4", "tr"} and self.skip_depth == 0:
            self.text_parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        lower = tag.lower()
        if lower == "title":
            self.in_title = False
        if lower in self.SKIP and self.skip_depth > 0:
            self.skip_depth -= 1
        if lower in {"p", "div", "section", "article", "li", "h1", "h2", "h3", "h4", "tr"} and self.skip_depth == 0:
            self.text_parts.append("\n")

    def handle_data(self, data: str) -> None:
        if self.skip_depth:
            return
        value = data.strip()
        if not value:
            return
        if self.in_title:
            self.title_parts.append(value)
        self.text_parts.append(value + " ")

    def result(self) -> tuple[str, str]:
        title = " ".join(self.title_parts).strip()
        text = "".join(self.text_parts)
        text = re.sub(r"[ \t\f\v]+", " ", text)
        text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)
        return title, text.strip()


class DuckDuckGoParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.results: list[dict[str, str]] = []
        self._title_active = False
        self._snippet_active = False
        self._title_parts: list[str] = []
        self._snippet_parts: list[str] = []
        self._href = ""
        self._current_index: int | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "a":
            return
        attr = {k: (v or "") for k, v in attrs}
        classes = set(attr.get("class", "").split())
        if "result__a" in classes:
            self._title_active = True
            self._title_parts = []
            self._href = attr.get("href", "")
        elif "result__snippet" in classes and self._current_index is not None:
            self._snippet_active = True
            self._snippet_parts = []

    def handle_data(self, data: str) -> None:
        if self._title_active:
            self._title_parts.append(data)
        if self._snippet_active:
            self._snippet_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() != "a":
            return
        if self._title_active:
            self._title_active = False
            title = " ".join("".join(self._title_parts).split())
            url = _decode_ddg_url(self._href)
            if title and url.startswith(("http://", "https://")):
                self.results.append({"title": title, "url": url, "snippet": ""})
                self._current_index = len(self.results) - 1
        elif self._snippet_active:
            self._snippet_active = False
            snippet = " ".join("".join(self._snippet_parts).split())
            if self._current_index is not None:
                self.results[self._current_index]["snippet"] = snippet


def _decode_ddg_url(url: str) -> str:
    if url.startswith("//"):
        url = "https:" + url
    parsed = urllib.parse.urlparse(url)
    if parsed.hostname and parsed.hostname.endswith("duckduckgo.com"):
        query = urllib.parse.parse_qs(parsed.query)
        uddg = query.get("uddg")
        if uddg:
            return urllib.parse.unquote(uddg[0])
    return url


def search_brave(query: str, max_results: int) -> list[dict[str, str]]:
    api_key = os.environ.get("BRAVE_SEARCH_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("BRAVE_SEARCH_API_KEY_MISSING")
    params = urllib.parse.urlencode({"q": query, "count": max_results})
    url = "https://api.search.brave.com/res/v1/web/search?" + params
    data, _, _, _ = _request(
        url,
        headers={
            "Accept": "application/json",
            "X-Subscription-Token": api_key,
        },
    )
    payload = json.loads(data.decode("utf-8", errors="replace"))
    results: list[dict[str, str]] = []
    for item in payload.get("web", {}).get("results", []):
        result_url = str(item.get("url", "")).strip()
        title = str(item.get("title", "")).strip()
        description = str(item.get("description", "")).strip()
        if result_url and title:
            results.append({"title": title, "url": result_url, "snippet": description})
        if len(results) >= max_results:
            break
    return results


def search_duckduckgo(query: str, max_results: int) -> list[dict[str, str]]:
    params = urllib.parse.urlencode({"q": query})
    url = "https://html.duckduckgo.com/html/?" + params
    data, _, content_type, _ = _request(url)
    charset = _charset_from_content_type(content_type)
    parser = DuckDuckGoParser()
    parser.feed(data.decode(charset, errors="replace"))
    return parser.results[:max_results]


def web_search(query: str, max_results: int = 5) -> str:
    query = query.strip()
    if not query:
        raise ValueError("WEB_SEARCH_QUERY_EMPTY")
    max_results = max(1, min(int(max_results), 10))

    provider = os.environ.get("LLAMA_WEB_SEARCH_PROVIDER", "auto").strip().lower()
    errors: list[str] = []
    results: list[dict[str, str]] = []

    if provider in {"auto", "brave"} and os.environ.get("BRAVE_SEARCH_API_KEY", "").strip():
        try:
            results = search_brave(query, max_results)
        except Exception as exc:
            errors.append(f"brave:{exc}")
            if provider == "brave":
                raise

    if not results and provider in {"auto", "duckduckgo", "ddg"}:
        try:
            results = search_duckduckgo(query, max_results)
        except Exception as exc:
            errors.append(f"duckduckgo:{exc}")

    if not results:
        detail = "; ".join(errors) if errors else f"provider={provider}"
        raise RuntimeError(f"WEB_SEARCH_NO_RESULTS:{detail}")

    lines = [
        f"WEB_SEARCH_QUERY: {query}",
        "CITATION_RULE: cite only URLs returned below; do not invent or rewrite URLs.",
    ]
    for index, item in enumerate(results, start=1):
        lines.extend(
            [
                f"[S{index}] {item['title']}",
                f"URL: {item['url']}",
                f"SNIPPET: {item.get('snippet', '')}",
            ]
        )
    return "\n".join(lines)


def _charset_from_content_type(content_type: str) -> str:
    match = re.search(r"charset=([^;\s]+)", content_type, flags=re.I)
    if match:
        return match.group(1).strip('\"\'')
    return "utf-8"


def _extract_pdf(data: bytes, max_chars: int) -> tuple[str, str]:
    try:
        import fitz
    except Exception as exc:
        raise RuntimeError(f"WEB_PDF_READER_UNAVAILABLE:{exc}") from exc
    document = fitz.open(stream=data, filetype="pdf")
    parts: list[str] = []
    for page_index in range(min(document.page_count, 20)):
        parts.append(document.load_page(page_index).get_text("text"))
        if sum(len(part) for part in parts) >= max_chars:
            break
    metadata = document.metadata or {}
    title = str(metadata.get("title") or "").strip()
    text = "\n".join(parts)
    return title, text[:max_chars]


def web_fetch(url: str, max_chars: int = MAX_FETCH_CHARS) -> str:
    max_chars = max(1_000, min(int(max_chars), 60_000))
    data, final_url, content_type, status = _request(url)
    lower_type = content_type.lower()
    title = ""
    body = ""

    if "application/pdf" in lower_type or final_url.lower().endswith(".pdf"):
        title, body = _extract_pdf(data, max_chars)
    elif any(kind in lower_type for kind in ("text/html", "application/xhtml+xml")):
        charset = _charset_from_content_type(content_type)
        parser = VisibleTextParser()
        parser.feed(data.decode(charset, errors="replace"))
        title, body = parser.result()
        body = body[:max_chars]
    elif any(kind in lower_type for kind in ("application/json", "text/plain", "text/xml", "application/xml", "text/csv")):
        charset = _charset_from_content_type(content_type)
        body = data.decode(charset, errors="replace")[:max_chars]
    else:
        raise RuntimeError(f"WEB_FETCH_CONTENT_TYPE_UNSUPPORTED:{content_type}")

    if not body.strip():
        raise RuntimeError("WEB_FETCH_EMPTY_CONTENT")

    return "\n".join(
        [
            f"SOURCE_URL: {final_url}",
            f"HTTP_STATUS: {status}",
            f"CONTENT_TYPE: {content_type}",
            f"TITLE: {title}",
            "CITATION_RULE: cite SOURCE_URL exactly as returned; never invent a URL.",
            "CONTENT:",
            body.strip(),
        ]
    )


def web_research(query: str, max_results: int = 5, fetch_results: int = 2, max_chars_per_source: int = 10_000) -> str:
    query = query.strip()
    if not query:
        raise ValueError("WEB_RESEARCH_QUERY_EMPTY")
    max_results = max(1, min(int(max_results), 10))
    fetch_results = max(1, min(int(fetch_results), min(max_results, 4)))
    max_chars_per_source = max(2_000, min(int(max_chars_per_source), 16_000))

    raw = web_search(query, max_results)
    urls = re.findall(r"^URL: (https?://\S+)$", raw, flags=re.M)
    titles = re.findall(r"^\[S\d+\] (.+)$", raw, flags=re.M)
    snippets = re.findall(r"^SNIPPET: (.*)$", raw, flags=re.M)

    output = [
        f"WEB_RESEARCH_QUERY: {query}",
        "GROUNDING_RULE: answer only from the fetched source material below for claims that depend on this research.",
        "CITATION_RULE: cite sources inline as [S1], [S2], ... and include the exact URLs in a Sources section.",
    ]

    for index, url in enumerate(urls[:fetch_results], start=1):
        title = titles[index - 1] if index - 1 < len(titles) else url
        snippet = snippets[index - 1] if index - 1 < len(snippets) else ""
        output.extend([f"\n[S{index}] {title}", f"URL: {url}", f"SEARCH_SNIPPET: {snippet}"])
        try:
            fetched = web_fetch(url, max_chars=max_chars_per_source)
            content_match = re.search(r"\nCONTENT:\n(.*)$", fetched, flags=re.S)
            source_title = re.search(r"^TITLE: (.*)$", fetched, flags=re.M)
            if source_title and source_title.group(1).strip():
                output.append(f"FETCHED_TITLE: {source_title.group(1).strip()}")
            output.append("FETCHED_CONTENT:")
            output.append(content_match.group(1).strip() if content_match else fetched)
        except Exception as exc:
            output.append(f"FETCH_ERROR: {exc}")

    return "\n".join(output)


TOOLS = [
    {
        "name": "search",
        "description": (
            "Search the public web. Use this before answering questions that ask for internet verification, "
            "current facts, named articles/statutes, news, sources, URLs, or anything that may have changed. "
            "Returns real source URLs with [S1], [S2] identifiers. Never claim you searched unless this tool returned results."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query."},
                "max_results": {"type": "integer", "minimum": 1, "maximum": 10, "default": 5},
            },
            "required": ["query"],
            "additionalProperties": False,
        },
    },
    {
        "name": "fetch",
        "description": (
            "Fetch and extract readable content from an exact public HTTP(S) URL, including HTML, text, JSON and PDFs. "
            "Use it to verify what a source actually says before citing it. Private/loopback addresses are blocked."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "Exact public HTTP(S) URL to fetch."},
                "max_chars": {"type": "integer", "minimum": 1000, "maximum": 60000, "default": MAX_FETCH_CHARS},
            },
            "required": ["url"],
            "additionalProperties": False,
        },
    },
    {
        "name": "research",
        "description": (
            "Preferred first-line grounding tool for factual/current/legal/article questions. "
            "It searches the web and fetches the best source pages in one call, returning [S1], [S2] source blocks. "
            "Use this instead of answering from memory when the user asks to check the internet, asks about a legal article, "
            "requests sources, or when freshness/verification matters."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Research question or search query."},
                "max_results": {"type": "integer", "minimum": 1, "maximum": 10, "default": 5},
                "fetch_results": {"type": "integer", "minimum": 1, "maximum": 4, "default": 2},
                "max_chars_per_source": {"type": "integer", "minimum": 2000, "maximum": 16000, "default": 10000},
            },
            "required": ["query"],
            "additionalProperties": False,
        },
    },
]


def tool_call(name: str, arguments: dict[str, Any]) -> str:
    if name == "search":
        return web_search(str(arguments.get("query", "")), int(arguments.get("max_results", 5)))
    if name == "fetch":
        return web_fetch(str(arguments.get("url", "")), int(arguments.get("max_chars", MAX_FETCH_CHARS)))
    if name == "research":
        return web_research(
            str(arguments.get("query", "")),
            int(arguments.get("max_results", 5)),
            int(arguments.get("fetch_results", 2)),
            int(arguments.get("max_chars_per_source", 10000)),
        )
    raise ValueError(f"MCP_TOOL_UNKNOWN:{name}")


def _response(request_id: Any, result: dict[str, Any] | None = None, error: dict[str, Any] | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"jsonrpc": "2.0", "id": request_id}
    if error is not None:
        payload["error"] = error
    else:
        payload["result"] = result or {}
    return payload


def serve() -> int:
    for raw_line in sys.stdin:
        line = raw_line.strip()
        if not line:
            continue
        try:
            message = json.loads(line)
        except json.JSONDecodeError:
            continue

        method = message.get("method")
        request_id = message.get("id")

        if method == "notifications/initialized":
            continue

        try:
            if method == "initialize":
                requested = str(message.get("params", {}).get("protocolVersion") or MCP_PROTOCOL_VERSION)
                result = {
                    "protocolVersion": requested,
                    "capabilities": {"tools": {}},
                    "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
                }
                reply = _response(request_id, result=result)
            elif method == "tools/list":
                reply = _response(request_id, result={"tools": TOOLS})
            elif method == "tools/call":
                params = message.get("params") or {}
                name = str(params.get("name", ""))
                arguments = params.get("arguments") or {}
                if not isinstance(arguments, dict):
                    raise ValueError("MCP_TOOL_ARGUMENTS_INVALID")
                output = tool_call(name, arguments)
                reply = _response(
                    request_id,
                    result={"content": [{"type": "text", "text": output}], "isError": False},
                )
            else:
                reply = _response(
                    request_id,
                    error={"code": -32601, "message": f"Method not found: {method}"},
                )
        except Exception as exc:
            if method == "tools/call":
                reply = _response(
                    request_id,
                    result={
                        "content": [{"type": "text", "text": f"TOOL_ERROR: {type(exc).__name__}: {exc}"}],
                        "isError": True,
                    },
                )
            else:
                reply = _response(
                    request_id,
                    error={"code": -32603, "message": f"{type(exc).__name__}: {exc}"},
                )

        sys.stdout.write(json.dumps(reply, ensure_ascii=False, separators=(",", ":")) + "\n")
        sys.stdout.flush()
    return 0


def self_test() -> int:
    assert _decode_ddg_url("https://duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fx") == "https://example.com/x"
    parser = VisibleTextParser()
    parser.feed("<html><head><title>Test Title</title><style>bad</style></head><body><h1>Hello</h1><script>bad</script><p>World</p></body></html>")
    title, text = parser.result()
    assert title == "Test Title"
    assert "Hello" in text and "World" in text and "bad" not in text
    try:
        validate_public_url("http://127.0.0.1/private")
    except ValueError:
        pass
    else:
        raise AssertionError("loopback URL was not blocked")
    assert [tool["name"] for tool in TOOLS] == ["search", "fetch", "research"]
    print("LLAMA_WEB_MCP_SELFTEST_PASS")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    return serve()


if __name__ == "__main__":
    raise SystemExit(main())
