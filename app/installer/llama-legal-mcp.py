from __future__ import annotations

import argparse
import json
import os
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

SERVER_NAME = "lex-llama-legal"
SERVER_VERSION = "1.0.0"
MCP_PROTOCOL_VERSION = "2024-11-05"
EXPECTED_SKILL_COUNT = 32
MAX_READ_CHARS = 60_000
MAX_SEARCH_FILE_BYTES = 1_500_000

ROUTER_SKILL = "prawny-router-v3"
POLISH_LAW_SKILL = "prawo-polskie-v2"
SHARED_SKILL = "shared"

ROUTE_RULES = [
    (11, "analizator-przepisow-v2", ["porownaj z kluczem", "klucz odpowiedzi", "sprawdz te opinie", "sprawdz tę opinię", "zweryfikuj te analize", "zweryfikuj tę analizę", "czy te przepisy sie zgadzaja", "czy te przepisy się zgadzają", "co jest nie tak w tym pismie", "co jest nie tak w tym piśmie"]),
    (8, "przesluchanie-swiadkow-v2-min90", ["swiadek", "świadek", "cross-examination", "biegly", "biegły", "pytania do swiadka", "pytania do świadka", "zeznani"]),
    (5, "orzeczenia-sadowe-v2", ["znajdz wyrok", "znajdź wyrok", "precedens", "linia orzecznicza", "sygnatur", "orzecznictw"]),
    (3, "pisma-procesowe-v3", ["pozew", "apelac", "odpowiedz na pozew", "odpowiedź na pozew", "zazalenie", "zażalenie", "skarga", "pismo wielowatkowe", "pismo wielowątkowe"]),
    (4, "pisma-proste-v2", ["sprzeciw od nakazu", "przywrocenie terminu", "przywrócenie terminu", "wglad", "wgląd", "uzasadnienie", "wezwanie do zaplaty", "wezwanie do zapłaty"]),
    (1, "analizator-umow-v1", ["umowa", "owu", "kontrakt", "ugoda", "regulamin", "testament", "czy moge podpisac", "czy mogę podpisać", "klauzul"]),
    (2, "analiza-sadowa-v6", ["wyrok", "nakaz zaplaty", "nakaz zapłaty", "wezwanie", "pismo przeciwnika", "jakie mam szanse", "analiza pozycji"]),
    (6, "analizator-dowodow-v3", ["mail", "sms", "nagran", "faktur", "termin proces", "koszt sadow", "koszt sąd", "oplata komorn", "opłata komorn"]),
    (9, "analizator-przepisow-v2", ["art.", "artykuł", "artykul", "paragraf", "§", "przeslank", "przesłank", "wykladni", "wykładni", "czy mnie dotyczy"]),
]

DR_RULES = {
    "dr-01-ustroj-konstytucyjny-i-zrodla-prawa": ["konstytuc", "wybor", "referendum", "zrodla prawa", "źródła prawa", "sejm", "senat", "prezydent", "trybunal konstytuc", "trybunał konstytuc"],
    "dr-02-prawo-cywilne-rodzinne-gospodarcze": ["cywil", "rodzin", "gospodarcz", "aliment", "rozwod", "rozwód", "spad", "zachowek", "wlasnosc", "własność", "odszkod", "umow", "spolk", "spółk", "upadlos", "upadłoś"],
    "dr-03-prawo-karne-wykroczenia-egzekucja": ["karn", "wykroc", "mandat", "oszust", "kradzie", "stalking", "areszt", "prokur", "policj", "przestep", "przestęp", "kk", "kpk", "kw", "kkw", "komorn"],
    "dr-04-prawo-pracy-zus-swiadczenia": ["praca", "pracownik", "pracodawc", "mobbing", "zus", "emeryt", "renta", "swiadczen", "świadczen", "zasilek", "zasiłek"],
    "dr-05-prawo-administracyjne-sadowoadministracyjne": ["administr", "wsa", "nsa", "decyzja administr", "postepowanie administr", "postępowanie administr", "kpa"],
    "dr-06-podatki-finanse-publiczne-aml": ["podat", "vat", "cit", "pit", "akcyz", "ordynacja podat", "finanse public", "aml", "pranie pieniedzy", "pranie pieniędzy"],
    "dr-07-zamowienia-publiczne-fundusze-ue": ["zamowien public", "zamówień public", "pzp", "kio", "przetarg", "fundusz ue", "dotac"],
    "dr-08-samorzad-terytorialny-prawo-lokalne": ["samorzad", "samorząd", "gmina", "powiat", "wojewodztw", "województw", "rada gmin", "uchwala", "uchwała", "akt miejscow"],
    "dr-09-budownictwo-srodowisko-energia-transport": ["budow", "deweloper", "srodow", "środow", "energia", "transport", "droga", "pojazd", "plan zagospodar", "pozwolenie na budow"],
    "dr-10-zdrowie-farmacja-zywnosc-rolnictwo": ["zdrow", "lekar", "szpital", "farmac", "lek", "zywnos", "żywnoś", "rolnict", "weteryn"],
    "dr-11-cyfrowe-cyber-ai-dane-ip": ["rodo", "gdpr", "dane osob", "cyber", "ai act", "sztuczna intelig", "internet", "autorsk", "wlasnosc intelekt", "własność intelekt", "patent", "znak towar"],
    "dr-12-sadownictwo-prokuratura-zawody-prawnicze": ["sadownict", "sądownict", "prokuratur", "adwokat", "radca praw", "notarius", "komornik", "sedzia", "sędzia"],
    "dr-13-sluzby-bezpieczenstwo-informacje-niejawne": ["sluzb", "służb", "bezpieczenstw", "bezpieczeństw", "informacj niejaw", "abw", "cba", "skw", "sww", "kontrwywiad"],
    "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka": ["prawo ue", "unia europejska", "eur-lex", "miedzynarod", "międzynarod", "etpc", "echr", "prawa czlowieka", "prawa człowieka", "konwencj", "traktat"],
    "dr-15-compliance-iso-governance-audyt": ["compliance", "iso", "governance", "audyt", "kontrola wewn", "zarzadzanie ryzykiem", "zarządzanie ryzykiem"],
    "dr-16-pisma-strategia-dowody-orzecznictwo": ["pismo", "strateg", "dowod", "dowód", "orzecznict", "argumentac", "pozew", "apelac", "zazalen", "zażalen"],
}


def normalize(text: str) -> str:
    value = unicodedata.normalize("NFKD", text)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return value.lower()


def root_path() -> Path:
    configured = os.environ.get("LEX_LEGAL_SKILLS_ROOT", "").strip()
    if not configured:
        raise RuntimeError("LEX_LEGAL_SKILLS_ROOT_MISSING")
    root = Path(configured).expanduser().resolve()
    if not root.is_dir():
        raise RuntimeError(f"LEGAL_SKILLS_ROOT_NOT_FOUND:{root}")
    return root


def discover_skills(root: Path) -> dict[str, Path]:
    skills: dict[str, Path] = {}
    for child in sorted(root.iterdir()):
        if child.is_dir() and (child / "SKILL.md").is_file():
            skills[child.name] = child
    return skills


def assert_inventory(skills: dict[str, Path]) -> None:
    required = {ROUTER_SKILL, POLISH_LAW_SKILL, SHARED_SKILL}
    missing_required = sorted(required - set(skills))
    if missing_required:
        raise RuntimeError("LEGAL_SKILLS_REQUIRED_MISSING:" + ",".join(missing_required))
    if len(skills) != EXPECTED_SKILL_COUNT:
        raise RuntimeError(f"LEGAL_SKILLS_COUNT_MISMATCH:expected={EXPECTED_SKILL_COUNT}:actual={len(skills)}")


def safe_path(root: Path, relative: str) -> Path:
    rel = relative.replace("\\", "/").lstrip("/")
    if not rel or rel.startswith("../") or "/../" in rel:
        raise ValueError("LEGAL_RESOURCE_PATH_INVALID")
    target = (root / rel).resolve()
    try:
        target.relative_to(root)
    except ValueError as exc:
        raise ValueError("LEGAL_RESOURCE_OUTSIDE_ROOT") from exc
    if not target.is_file():
        raise FileNotFoundError(f"LEGAL_RESOURCE_NOT_FOUND:{rel}")
    return target


def read_resource(root: Path, relative: str, max_chars: int = MAX_READ_CHARS) -> str:
    target = safe_path(root, relative)
    if target.suffix.lower() not in {".md", ".txt", ".json", ".yaml", ".yml"}:
        raise ValueError("LEGAL_RESOURCE_TYPE_UNSUPPORTED")
    max_chars = max(2_000, min(int(max_chars), MAX_READ_CHARS))
    text = target.read_text(encoding="utf-8", errors="replace")
    clipped = text[:max_chars]
    suffix = "" if len(text) <= max_chars else f"\n\n[TRUNCATED: {len(text) - max_chars} chars; call legal_read again with a more specific resource.]"
    return f"LEGAL_RESOURCE: {relative.replace(os.sep, '/')}\nCONTENT:\n{clipped}{suffix}"


def frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end < 0:
        return {}
    data: dict[str, str] = {}
    for line in text[3:end].splitlines():
        if ":" not in line or line.startswith(" "):
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip('\"\'')
    return data


def inventory_payload(root: Path, skills: dict[str, Path]) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for name, path in skills.items():
        text = (path / "SKILL.md").read_text(encoding="utf-8", errors="replace")
        meta = frontmatter(text)
        rows.append({
            "directory": name,
            "name": meta.get("name", name),
            "version": meta.get("version", ""),
            "type": meta.get("type", ""),
            "description": meta.get("description", ""),
        })
    return rows


def route_primary(query: str) -> tuple[int, str, list[str], str | None]:
    q = normalize(query)
    for route_no, primary, triggers in ROUTE_RULES:
        if any(normalize(trigger) in q for trigger in triggers):
            if route_no == 11:
                return route_no, primary, ["orzeczenia-sadowe-v2"], "przewodnik-prawny-v2"
            if route_no == 8:
                return route_no, primary, ["analizator-dowodow-v3", "analiza-sadowa-v6"], None
            if route_no == 5:
                return route_no, primary, ["analiza-sadowa-v6"], None
            if route_no == 3:
                return route_no, primary, ["orzeczenia-sadowe-v2", "analiza-sadowa-v6"], None
            if route_no == 4:
                return route_no, primary, [], None
            if route_no == 1:
                return route_no, primary, ["orzeczenia-sadowe-v2"], "przewodnik-prawny-v2"
            if route_no == 2:
                return route_no, primary, ["analizator-dowodow-v3", "orzeczenia-sadowe-v2"], "przewodnik-prawny-v2"
            if route_no == 6:
                return route_no, primary, ["analiza-sadowa-v6"], None
            if route_no == 9:
                return route_no, primary, ["orzeczenia-sadowe-v2", "pisma-procesowe-v3"], None
    fallback_triggers = ["co mam zrobic", "co mam zrobić", "od czego zaczac", "od czego zacząć", "wyjasnienie", "wyjaśnienie"]
    if any(normalize(t) in q for t in fallback_triggers):
        return 7, "przewodnik-prawny-v2", [POLISH_LAW_SKILL], None
    return 10, POLISH_LAW_SKILL, [], None


def relevant_drs(query: str) -> list[str]:
    q = normalize(query)
    scored: list[tuple[int, str]] = []
    for skill, triggers in DR_RULES.items():
        score = sum(1 for trigger in triggers if normalize(trigger) in q)
        if score:
            scored.append((score, skill))
    scored.sort(key=lambda pair: (-pair[0], pair[1]))
    return [skill for _, skill in scored[:4]]


def likely_foreign(query: str, jurisdiction: str) -> bool:
    j = normalize(jurisdiction.strip())
    if j and j not in {"pl", "polska", "poland", "prawo polskie"}:
        return True
    q = normalize(query)
    foreign_markers = [
        "prawo niemieck", "prawo francusk", "prawo brytyj", "prawo angielsk",
        "prawo ameryk", "prawo usa", "prawo czesk", "prawo slowack", "prawo słowack",
        "prawo hiszp", "prawo wlosk", "prawo włosk", "jurysdykcja zagran", "prawo obce",
    ]
    return any(normalize(marker) in q for marker in foreign_markers)


def token_set(text: str) -> set[str]:
    return {token for token in re.findall(r"[a-z0-9ąćęłńóśźż]{4,}", normalize(text)) if len(token) >= 4}


def semantic_skill_candidates(query: str, root: Path, skills: dict[str, Path]) -> list[str]:
    q_tokens = token_set(query)
    if not q_tokens:
        return []
    scored: list[tuple[int, str]] = []
    for name, path in skills.items():
        text = (path / "SKILL.md").read_text(encoding="utf-8", errors="replace")
        meta = frontmatter(text)
        haystack = normalize(" ".join([name, meta.get("name", ""), meta.get("description", ""), text[:12_000]]))
        score = sum(3 if token in normalize(meta.get("description", "")) else 1 for token in q_tokens if token in haystack)
        if score:
            scored.append((score, name))
    scored.sort(key=lambda pair: (-pair[0], pair[1]))
    return [name for _, name in scored[:8]]


def router_core_excerpt(root: Path) -> str:
    text = (root / ROUTER_SKILL / "SKILL.md").read_text(encoding="utf-8", errors="replace")
    parts: list[str] = []
    for marker in ["## ŁADOWANE ZAWSZE", "## ADAPTER RUNTIME", "## KROK 2 — ROUTING"]:
        start = text.find(marker)
        if start >= 0:
            next_heading = text.find("\n## ", start + len(marker))
            if next_heading < 0:
                next_heading = min(len(text), start + 12_000)
            parts.append(text[start:next_heading][:12_000])
    return "\n\n".join(parts)[:24_000]


def legal_auto(query: str, jurisdiction: str = "") -> str:
    root = root_path()
    skills = discover_skills(root)
    assert_inventory(skills)

    route_no, primary, secondary, fallback = route_primary(query)
    drs = relevant_drs(query)
    candidates = semantic_skill_candidates(query, root, skills)
    foreign = likely_foreign(query, jurisdiction)

    ordered: list[str] = [ROUTER_SKILL, SHARED_SKILL]
    if not foreign:
        ordered.append(POLISH_LAW_SKILL)
    ordered.append(primary)
    ordered.extend(secondary)
    ordered.extend(drs)
    ordered.extend(candidates)

    deduped: list[str] = []
    for item in ordered:
        if item in skills and item not in deduped:
            deduped.append(item)

    mandatory_resources = [
        f"{ROUTER_SKILL}/references/KROK0A-anonimizer.md",
        f"{ROUTER_SKILL}/references/KROK1-detekcja.md",
        "shared/PRAWO-HARDGATE.md",
        f"{ROUTER_SKILL}/references/SELF-CHECK.md",
        "shared/DISCLAIMER.md",
    ]
    if foreign:
        mandatory_resources.extend([
            "shared/MIEDZYNARODOWE-GATES.md",
            "shared/HIERARCHIA-ZRODEL-MIEDZYNARODOWE.md",
        ])
    else:
        mandatory_resources.append("shared/HIERARCHIA-ZRODEL.md")
        mandatory_resources.append(f"{ROUTER_SKILL}/references/ZRODLA-AKTOW-FALLBACK.md")

    lines = [
        "LEGAL_AUTO_STATUS: OK",
        f"INVENTORY_COUNT: {len(skills)}",
        "INVENTORY_POLICY: all 32 installed skill bundles were discovered and considered for routing.",
        f"JURISDICTION_MODE: {'FOREIGN_OR_TRANSBORDER' if foreign else 'POLISH_OR_UNSPECIFIED'}",
        f"ROUTER_ROUTE: [{route_no}]",
        f"PRIMARY: {primary}",
        f"SECONDARY: {', '.join(secondary) if secondary else 'BRAK'}",
        f"FALLBACK: {fallback or 'BRAK'}",
        f"RELEVANT_DR: {', '.join(drs) if drs else 'BRAK_JEDNOZNACZNEGO_DR'}",
        "AUTO_SELECTED_SKILLS: " + ", ".join(deduped),
        "MANDATORY_NEXT_READS:",
    ]
    lines.extend(f"- {path}" for path in mandatory_resources)
    lines.extend([
        "",
        "EXECUTION_RULES:",
        "1. This tool is the mandatory first step for every legal question.",
        "2. Call lexlegal_read for PRIMARY/SKILL.md and every mandatory resource needed by the router before substantive legal analysis.",
        "3. For Polish law also read prawo-polskie-v2/SKILL.md and the relevant DR skill(s). For foreign law do not load prawo-polskie-v2 merely by habit.",
        "4. Every statute, article, case citation, amount, deadline, current-law statement or named authority must be freshly verified through lexweb_research / lexweb_fetch before it is stated as verified.",
        "5. If a mandatory file or web source cannot be verified, state: ⛔ TRYB ZDEGRADOWANY and mark affected claims ⚠️ [NIEWERYFIKOWANE]. Never silently substitute model memory.",
        "6. Never invent a URL, case signature, quotation, statute wording or source.",
        "",
        "ROUTER_CORE_EXCERPT:",
        router_core_excerpt(root),
    ])
    return "\n".join(lines)


def legal_list() -> str:
    root = root_path()
    skills = discover_skills(root)
    assert_inventory(skills)
    return json.dumps(
        {
            "count": len(skills),
            "expected": EXPECTED_SKILL_COUNT,
            "skills": inventory_payload(root, skills),
        },
        ensure_ascii=False,
        indent=2,
    )


def legal_search(query: str, max_results: int = 12) -> str:
    root = root_path()
    skills = discover_skills(root)
    assert_inventory(skills)
    terms = token_set(query)
    if not terms:
        raise ValueError("LEGAL_SEARCH_QUERY_EMPTY")
    max_results = max(1, min(int(max_results), 30))
    matches: list[tuple[int, str, str]] = []

    for skill_name, skill_dir in skills.items():
        for path in skill_dir.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in {".md", ".txt", ".json", ".yaml", ".yml"}:
                continue
            try:
                if path.stat().st_size > MAX_SEARCH_FILE_BYTES:
                    continue
                text = path.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            normalized = normalize(text)
            score = sum(normalized.count(term) for term in terms)
            if score <= 0:
                continue
            first_pos = min((normalized.find(term) for term in terms if term in normalized), default=0)
            start = max(0, first_pos - 700)
            end = min(len(text), first_pos + 2_300)
            excerpt = text[start:end].replace("\x00", "")
            rel = path.relative_to(root).as_posix()
            matches.append((score, rel, excerpt))

    matches.sort(key=lambda item: (-item[0], item[1]))
    selected = matches[:max_results]
    lines = [
        f"LEGAL_SEARCH_QUERY: {query}",
        f"SKILL_INVENTORY_COUNT: {len(skills)}",
        "SEARCH_SCOPE: all 32 skill bundles and their text resources.",
    ]
    for index, (score, rel, excerpt) in enumerate(selected, start=1):
        lines.extend([f"\n[L{index}] {rel} score={score}", excerpt])
    if not selected:
        lines.append("NO_MATCHES")
    return "\n".join(lines)


TOOLS = [
    {
        "name": "auto",
        "description": (
            "MANDATORY first tool for every legal question. Discovers and validates all 32 installed legal skill bundles, "
            "loads the legal router core, deterministically proposes PRIMARY/SECONDARY/DR routing, and returns mandatory next reads. "
            "Use before any substantive legal answer, in every jurisdiction."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The user's legal question or task."},
                "jurisdiction": {"type": "string", "description": "Optional jurisdiction hint, e.g. PL, DE, EU."},
            },
            "required": ["query"],
            "additionalProperties": False,
        },
    },
    {
        "name": "read",
        "description": (
            "Read an exact resource from the installed 32-skill legal corpus. Use paths returned by legal_auto, "
            "for example prawny-router-v3/references/KROK1-detekcja.md, prawo-polskie-v2/SKILL.md, "
            "dr-03-prawo-karne-wykroczenia-egzekucja/SKILL.md or shared/PRAWO-HARDGATE.md."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Path relative to the legal skills root."},
                "max_chars": {"type": "integer", "minimum": 2000, "maximum": MAX_READ_CHARS, "default": MAX_READ_CHARS},
            },
            "required": ["path"],
            "additionalProperties": False,
        },
    },
    {
        "name": "search",
        "description": (
            "Search across all files inside all 32 installed legal skill bundles and return grounded excerpts with exact resource paths. "
            "Use when the router or a selected skill refers to a concept but the precise module/resource is not yet known."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Legal concept, article, issue or phrase to locate in the skill corpus."},
                "max_results": {"type": "integer", "minimum": 1, "maximum": 30, "default": 12},
            },
            "required": ["query"],
            "additionalProperties": False,
        },
    },
    {
        "name": "list",
        "description": "List and validate the complete installed inventory of 32 legal skill bundles.",
        "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
]


def tool_call(name: str, arguments: dict[str, Any]) -> str:
    if name == "auto":
        return legal_auto(str(arguments.get("query", "")), str(arguments.get("jurisdiction", "")))
    if name == "read":
        return read_resource(root_path(), str(arguments.get("path", "")), int(arguments.get("max_chars", MAX_READ_CHARS)))
    if name == "search":
        return legal_search(str(arguments.get("query", "")), int(arguments.get("max_results", 12)))
    if name == "list":
        return legal_list()
    raise ValueError(f"MCP_TOOL_UNKNOWN:{name}")


def response(request_id: Any, result: dict[str, Any] | None = None, error: dict[str, Any] | None = None) -> dict[str, Any]:
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
                reply = response(
                    request_id,
                    result={
                        "protocolVersion": requested,
                        "capabilities": {"tools": {}},
                        "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
                    },
                )
            elif method == "tools/list":
                reply = response(request_id, result={"tools": TOOLS})
            elif method == "tools/call":
                params = message.get("params") or {}
                name = str(params.get("name", ""))
                arguments = params.get("arguments") or {}
                if not isinstance(arguments, dict):
                    raise ValueError("MCP_TOOL_ARGUMENTS_INVALID")
                output = tool_call(name, arguments)
                reply = response(
                    request_id,
                    result={"content": [{"type": "text", "text": output}], "isError": False},
                )
            else:
                reply = response(request_id, error={"code": -32601, "message": f"Method not found: {method}"})
        except Exception as exc:
            if method == "tools/call":
                reply = response(
                    request_id,
                    result={
                        "content": [{"type": "text", "text": f"TOOL_ERROR: {type(exc).__name__}: {exc}"}],
                        "isError": True,
                    },
                )
            else:
                reply = response(request_id, error={"code": -32603, "message": f"{type(exc).__name__}: {exc}"})

        sys.stdout.write(json.dumps(reply, ensure_ascii=False, separators=(",", ":")) + "\n")
        sys.stdout.flush()
    return 0


def self_test() -> int:
    root = root_path()
    skills = discover_skills(root)
    assert_inventory(skills)
    assert route_primary("sprawdź art. 286 kodeksu karnego")[1] == "analizator-przepisow-v2"
    assert "dr-03-prawo-karne-wykroczenia-egzekucja" in relevant_drs("art. 286 kodeksu karnego oszustwo")
    assert likely_foreign("prawo niemieckie umowa", "") is True
    assert safe_path(root, "prawny-router-v3/SKILL.md").is_file()
    try:
        safe_path(root, "../outside.txt")
    except ValueError:
        pass
    else:
        raise AssertionError("path traversal was not blocked")
    print(f"LLAMA_LEGAL_MCP_SELFTEST_PASS:{len(skills)}")
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
