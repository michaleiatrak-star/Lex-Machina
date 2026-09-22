from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any

SERVER_NAME = "lex-llama-legal-skills"
SERVER_VERSION = "1.0.0"
MCP_PROTOCOL_VERSION = "2024-11-05"
EXPECTED_SKILL_COUNT = 32
MAX_READ_CHARS = 48_000
MAX_SEARCH_MATCHES = 30

DOMAIN_HINTS: dict[str, tuple[str, ...]] = {
    "dr-01-ustroj-konstytucyjny-i-zrodla-prawa": (
        "konstytuc", "ustroj", "źródła prawa", "zrodla prawa", "trybunal konstytuc", "tk ", "sejm", "senat",
    ),
    "dr-02-prawo-cywilne-rodzinne-gospodarcze": (
        "cywil", "kodeks cywil", "kc", "rodzin", "spad", "umow", "odszkod", "zobowiaz", "wlasnosc", "spolka", "gospodarcz",
    ),
    "dr-03-prawo-karne-wykroczenia-egzekucja": (
        "karn", "kodeks karn", "kk", "wykroc", "przestep", "oszust", "286", "prokur", "egzekuc", "kks",
    ),
    "dr-04-prawo-pracy-zus-swiadczenia": (
        "pracy", "pracownik", "pracodawc", "zus", "emeryt", "renta", "zasilek", "świadczen", "swiadczen", "ubezpieczen społ",
    ),
    "dr-05-prawo-administracyjne-sadowoadministracyjne": (
        "administr", "kpa", "wsa", "nsa", "decyzja administr", "postepowanie administr", "samorzadowe kolegium",
    ),
    "dr-06-podatki-finanse-publiczne-aml": (
        "podat", "vat", "pit", "cit", "ordynacja podat", "finanse public", "aml", "kryptowalut", "skarbow",
    ),
    "dr-07-zamowienia-publiczne-fundusze-ue": (
        "zamowien public", "pzp", "przetarg", "kio", "fundusz ue", "dotacj", "zamawiajac",
    ),
    "dr-08-samorzad-terytorialny-prawo-lokalne": (
        "samorzad", "gmina", "powiat", "wojewodztw", "rada gmin", "uchwala", "prawo miejscow",
    ),
    "dr-09-budownictwo-srodowisko-energia-transport": (
        "budowlan", "pozwolenie na budow", "srodowisk", "środowisk", "energia", "transport", "droga", "plan zagospodar",
    ),
    "dr-10-zdrowie-farmacja-zywnosc-rolnictwo": (
        "zdrow", "medycz", "farmac", "lek", "żywno", "zywno", "rolnict", "pacjent", "szpital",
    ),
    "dr-11-cyfrowe-cyber-ai-dane-ip": (
        "rodo", "gdpr", "dane osob", "cyber", "ai act", "sztuczna intelig", "internet", "autorsk", "ip", "znak towar",
    ),
    "dr-12-sadownictwo-prokuratura-zawody-prawnicze": (
        "sadown", "sędzi", "sedzi", "prokuratur", "adwokat", "radca praw", "notarius", "komornik", "zawod prawn",
    ),
    "dr-13-sluzby-bezpieczenstwo-informacje-niejawne": (
        "sluzb", "służb", "policj", "abw", "cba", "informacje niejaw", "bezpieczenstw", "wojsk",
    ),
    "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka": (
        "prawo ue", "unia europej", "eur-lex", "tsue", "etpc", "echr", "międzynarod", "miedzynarod", "prawa człowieka", "prawa czlowieka",
    ),
    "dr-15-compliance-iso-governance-audyt": (
        "compliance", "iso", "governance", "audyt", "kontrola wewn", "zarzadzanie ryzy",
    ),
    "dr-16-pisma-strategia-dowody-orzecznictwo": (
        "pismo", "pozew", "apelac", "zażalen", "zazalen", "strateg", "dowod", "orzecznict", "argumentac",
    ),
}

FUNCTIONAL_HINTS: dict[str, tuple[str, ...]] = {
    "analiza-sadowa-v6": ("analiza sadow", "analiza sądow", "sprawa sadow", "sprawa sądow", "wyrok", "postepowanie sadow"),
    "analizator-dowodow-v3": ("dowod", "dowód", "nagran", "zeznan", "dokument jako dowod", "material dowod"),
    "analizator-przepisow-v2": ("przepis", "art.", "artykuł", "artykul", "ustawa", "rozporzadzen", "rozporządzen"),
    "analizator-umow-v1": ("umow", "kontrakt", "klauzul", "b2b", "najem", "saas"),
    "audyt-systemu-v4": ("audyt systemu", "audyt skilli", "weryfikacja systemu prawnego"),
    "chronologia-sprawy-v1": ("chronolog", "oś czasu", "os czasu", "timeline", "kolejnosc zdarzen"),
    "orzeczenia-sadowe-v2": ("orzeczen", "wyrok", "uchwala sn", "sygnatur", "saos", "judykat"),
    "pisma-procesowe-v3": ("pozew", "apelac", "zażalen", "zazalen", "sprzeciw", "odpowiedz na pozew", "wniosek proces"),
    "pisma-proste-v2": ("wezwanie", "reklamac", "proste pismo", "odpowiedz na pismo"),
    "przesluchanie-swiadkow-v2-min90": ("świadek", "swiadek", "przesluch", "zeznan"),
    "przewodnik-prawny-v2": ("wyjasnij prawo", "przewodnik", "co moge zrobic", "jakie mam prawa"),
    "raport-klienta-v1": ("raport klient", "dla klienta", "podsumowanie klient"),
    "raport-sytuacyjny-v2": ("raport sytuacyj", "stan sprawy", "sytuacja prawna"),
}

STOPWORDS = {
    "a", "aby", "albo", "ale", "bo", "by", "czy", "dla", "do", "i", "jak", "jest", "na", "nie", "o", "od",
    "po", "pod", "przez", "się", "sie", "to", "w", "we", "z", "za", "ze", "że", "co", "jaki", "jakie", "który",
    "ktory", "oraz", "the", "and", "for", "with", "from", "what", "which", "this", "that", "law", "legal",
}


def normalize(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text.lower())
    ascii_text = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", ascii_text).strip()


def tokenize(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-z0-9]{2,}", normalize(text))
        if token not in STOPWORDS
    }


def safe_skill_name(name: str) -> str:
    if not re.fullmatch(r"[a-zA-Z0-9._-]{1,160}", name):
        raise ValueError("LEGAL_SKILL_NAME_INVALID")
    return name


def safe_relative_path(value: str) -> Path:
    raw = value.replace("\\", "/").strip().lstrip("/")
    if not raw:
        raw = "SKILL.md"
    parts = Path(raw).parts
    if any(part in {"..", ""} for part in parts):
        raise ValueError("LEGAL_SKILL_PATH_INVALID")
    return Path(*parts)


def read_text(path: Path, *, max_chars: int = MAX_READ_CHARS) -> str:
    data = path.read_text(encoding="utf-8", errors="replace")
    return data[:max_chars]


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---"):
        return {}
    closing = text.find("\n---", 3)
    if closing < 0:
        return {}
    block = text[3:closing]
    out: dict[str, str] = {}
    current_key: str | None = None
    multiline: list[str] = []
    for line in block.splitlines():
        if current_key is not None:
            if line.startswith((" ", "\t")):
                multiline.append(line.strip())
                continue
            out[current_key] = " ".join(multiline).strip()
            current_key = None
            multiline = []
        match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if not match:
            continue
        key, value = match.group(1), match.group(2).strip()
        if value in {"|", ">"}:
            current_key = key
            multiline = []
        else:
            out[key] = value.strip('"\'')
    if current_key is not None:
        out[current_key] = " ".join(multiline).strip()
    return out


class SkillCatalog:
    def __init__(self, root: Path) -> None:
        self.root = root.resolve()
        if not self.root.is_dir():
            raise ValueError(f"LEGAL_SKILLS_ROOT_MISSING:{self.root}")
        self.skills: dict[str, dict[str, Any]] = {}
        for child in sorted(self.root.iterdir(), key=lambda p: p.name.lower()):
            if not child.is_dir():
                continue
            skill_file = child / "SKILL.md"
            if not skill_file.is_file():
                continue
            text = read_text(skill_file, max_chars=120_000)
            meta = parse_frontmatter(text)
            self.skills[child.name] = {
                "path": skill_file,
                "name": meta.get("name", child.name),
                "description": meta.get("description", ""),
                "text": text,
                "sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(),
                "chars": len(text),
            }
        if len(self.skills) != EXPECTED_SKILL_COUNT:
            raise ValueError(
                f"LEGAL_SKILL_COUNT_INVALID:expected={EXPECTED_SKILL_COUNT}:actual={len(self.skills)}"
            )
        for required in ("prawny-router-v3", "prawo-polskie-v2", "shared"):
            if required not in self.skills:
                raise ValueError(f"LEGAL_REQUIRED_SKILL_MISSING:{required}")

    def list_text(self) -> str:
        lines = [
            "LEGAL_SKILLS_CATALOG_V1",
            f"SKILL_COUNT: {len(self.skills)}",
            "All entries below are available directly to llama-server through this MCP server.",
        ]
        for index, (slug, item) in enumerate(self.skills.items(), start=1):
            desc = re.sub(r"\s+", " ", str(item["description"])).strip()
            if len(desc) > 280:
                desc = desc[:277] + "..."
            lines.append(f"{index:02d}. {slug} | {item['name']} | {desc}")
        return "\n".join(lines)

    def detect_jurisdiction(self, query: str, requested: str) -> str:
        requested_norm = normalize(requested)
        if requested_norm and requested_norm not in {"auto", "automatic"}:
            return requested.upper()
        q = normalize(query)
        polish_markers = (
            "polsk", "kodeks", "ustawa", "dz.u", "dziennik ustaw", "isap", "sejm", "sad najwyzszy",
            "nsa", "wsa", "zus", "kio", "kpc", "kpk", "kpa", "kk", "kc", "polish law",
        )
        if any(marker in q for marker in polish_markers) or re.search(r"[ąćęłńóśźż]", query.lower()):
            return "PL"
        return "AUTO_UNRESOLVED"

    def _score_generic(self, query: str, slug: str, item: dict[str, Any]) -> float:
        q_tokens = tokenize(query)
        hay = f"{slug} {item['name']} {item['description']}"
        h_tokens = tokenize(hay)
        overlap = len(q_tokens & h_tokens)
        score = float(overlap)
        nq = normalize(query)
        for token in h_tokens:
            if len(token) >= 5 and token in nq:
                score += 0.25
        return score

    def route(self, query: str, jurisdiction: str, max_skills: int) -> str:
        query = query.strip()
        if not query:
            raise ValueError("LEGAL_AUTO_ROUTE_QUERY_EMPTY")
        max_skills = max(1, min(int(max_skills), 8))
        detected = self.detect_jurisdiction(query, jurisdiction)
        nq = normalize(query)

        scores: dict[str, float] = {}
        for slug, item in self.skills.items():
            if slug in {"prawny-router-v3", "prawo-polskie-v2", "shared"}:
                continue
            scores[slug] = self._score_generic(query, slug, item)

        for slug, hints in DOMAIN_HINTS.items():
            for hint in hints:
                if normalize(hint) in nq:
                    scores[slug] = scores.get(slug, 0.0) + 6.0

        for slug, hints in FUNCTIONAL_HINTS.items():
            for hint in hints:
                if normalize(hint) in nq:
                    scores[slug] = scores.get(slug, 0.0) + 4.0

        ranked = [
            slug for slug, score in sorted(scores.items(), key=lambda pair: (-pair[1], pair[0]))
            if score > 0
        ][:max_skills]

        if not any(slug.startswith("dr-") for slug in ranked):
            ranked.insert(0, "analizator-przepisow-v2")
            ranked = ranked[:max_skills]

        mandatory = ["prawny-router-v3", "shared"]
        if detected == "PL":
            mandatory.append("prawo-polskie-v2")

        router = self.skills["prawny-router-v3"]
        router_excerpt = str(router["text"])[:8_000]

        lines = [
            "LEGAL_AUTO_ROUTE_V1",
            f"QUERY: {query}",
            f"JURISDICTION: {detected}",
            f"CATALOG_COUNT: {len(self.skills)}",
            "MODE: AUTO",
            "MANDATORY_SKILLS: " + ", ".join(mandatory),
            "SELECTED_SKILLS: " + (", ".join(ranked) if ranked else "(none)"),
            "EXECUTION_RULES:",
            "1. This is a real read of the installed legal-skill corpus, not model memory.",
            "2. Before a substantive legal answer, call legal_skill_read for every MANDATORY_SKILL and every relevant SELECTED_SKILL.",
            "3. Follow further required_modules / view references named by those skill files by calling legal_skill_read again.",
            "4. For Polish law use prawo-polskie-v2 plus the applicable DR module(s).",
            "5. Verify statutes, article text, Dz.U., case citations, dates, thresholds and current law with web_research/web_fetch in the same turn; do not rely on memory.",
            "6. If a mandatory skill/resource cannot be read or a required legal source cannot be verified, fail closed and say what is missing.",
            "7. Do not claim a skill was loaded unless legal_skill_read returned it in this conversation.",
            "",
            "ROUTER_FILE_SHA256: " + str(router["sha256"]),
            "ROUTER_EXCERPT_BEGIN",
            router_excerpt,
            "ROUTER_EXCERPT_END",
        ]
        return "\n".join(lines)

    def read_skill(self, skill: str, relative_path: str, start_line: int, max_lines: int) -> str:
        skill = safe_skill_name(skill)
        if skill not in self.skills:
            raise ValueError(f"LEGAL_SKILL_UNKNOWN:{skill}")
        rel = safe_relative_path(relative_path)
        base = (self.root / skill).resolve()
        target = (base / rel).resolve()
        try:
            target.relative_to(base)
        except ValueError as exc:
            raise ValueError("LEGAL_SKILL_PATH_ESCAPE") from exc
        if not target.is_file():
            raise ValueError(f"LEGAL_SKILL_FILE_MISSING:{skill}/{rel.as_posix()}")

        text = target.read_text(encoding="utf-8", errors="replace")
        lines = text.splitlines()
        start_line = max(1, int(start_line))
        max_lines = max(1, min(int(max_lines), 500))
        selected = lines[start_line - 1 : start_line - 1 + max_lines]
        body = "\n".join(selected)
        if len(body) > MAX_READ_CHARS:
            body = body[:MAX_READ_CHARS] + "\n[TRUNCATED_BY_MCP]"
        digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
        end_line = start_line + max(0, len(selected) - 1)
        return "\n".join(
            [
                "LEGAL_SKILL_READ_V1",
                f"SKILL: {skill}",
                f"PATH: {rel.as_posix()}",
                f"SHA256: {digest}",
                f"LINES: {start_line}-{end_line} of {len(lines)}",
                "CONTENT_BEGIN",
                body,
                "CONTENT_END",
            ]
        )

    def search(self, query: str, skill: str, max_matches: int) -> str:
        needle = normalize(query)
        if len(needle) < 2:
            raise ValueError("LEGAL_SKILL_SEARCH_QUERY_TOO_SHORT")
        max_matches = max(1, min(int(max_matches), MAX_SEARCH_MATCHES))
        if skill and skill != "*":
            names = [safe_skill_name(skill)]
            if names[0] not in self.skills:
                raise ValueError(f"LEGAL_SKILL_UNKNOWN:{names[0]}")
        else:
            names = list(self.skills.keys())

        matches: list[str] = []
        for name in names:
            base = (self.root / name).resolve()
            for path in sorted(base.rglob("*.md")):
                if not path.is_file():
                    continue
                try:
                    rel = path.relative_to(base).as_posix()
                    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
                except OSError:
                    continue
                for index, line in enumerate(lines, start=1):
                    if needle in normalize(line):
                        excerpt = re.sub(r"\s+", " ", line).strip()
                        if len(excerpt) > 360:
                            excerpt = excerpt[:357] + "..."
                        matches.append(f"{name}/{rel}:{index}: {excerpt}")
                        if len(matches) >= max_matches:
                            return "LEGAL_SKILL_SEARCH_V1\n" + "\n".join(matches)
        if not matches:
            return "LEGAL_SKILL_SEARCH_V1\nNO_MATCHES"
        return "LEGAL_SKILL_SEARCH_V1\n" + "\n".join(matches)


def tools_definition() -> list[dict[str, Any]]:
    return [
        {
            "name": "auto_route",
            "description": (
                "MANDATORY first tool for every legal-law question in AUTO mode. Routes the query across all 32 installed legal skills, "
                "reads the canonical legal router, identifies mandatory/domain skills and tells you exactly which skills must be read next. "
                "Do not answer a substantive legal question from memory before calling this tool."
            ),
            "inputSchema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The user's legal question, preserving jurisdiction and factual context."},
                    "jurisdiction": {"type": "string", "default": "auto", "description": "Jurisdiction such as PL, EU, DE, US, or auto."},
                    "max_skills": {"type": "integer", "minimum": 1, "maximum": 8, "default": 5},
                },
                "required": ["query"],
                "additionalProperties": False,
            },
        },
        {
            "name": "skill_read",
            "description": (
                "Read an installed legal skill file directly from the 32-skill corpus. Use after legal_auto_route for each mandatory and selected skill, "
                "and for any required references/workflows named by those skills. Never claim a skill/resource was loaded without this tool result."
            ),
            "inputSchema": {
                "type": "object",
                "properties": {
                    "skill": {"type": "string", "description": "Skill directory name returned by legal_auto_route."},
                    "path": {"type": "string", "default": "SKILL.md", "description": "Relative file path within the skill."},
                    "start_line": {"type": "integer", "minimum": 1, "default": 1},
                    "max_lines": {"type": "integer", "minimum": 1, "maximum": 500, "default": 220},
                },
                "required": ["skill"],
                "additionalProperties": False,
            },
        },
        {
            "name": "skill_search",
            "description": (
                "Search Markdown files in one legal skill or all 32 skills for a phrase before reading the exact file/lines. "
                "Use this to resolve references named by a skill or locate a gate/module without guessing file paths."
            ),
            "inputSchema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "skill": {"type": "string", "default": "*", "description": "Skill directory or * for all 32."},
                    "max_matches": {"type": "integer", "minimum": 1, "maximum": 30, "default": 12},
                },
                "required": ["query"],
                "additionalProperties": False,
            },
        },
        {
            "name": "skills_list",
            "description": "List all 32 legal skills exposed directly to llama-server, with names and descriptions.",
            "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
        },
    ]


def response(request_id: Any, result: dict[str, Any] | None = None, error: dict[str, Any] | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"jsonrpc": "2.0", "id": request_id}
    if error is not None:
        payload["error"] = error
    else:
        payload["result"] = result or {}
    return payload


def call_tool(catalog: SkillCatalog, name: str, arguments: dict[str, Any]) -> str:
    if name == "auto_route":
        return catalog.route(
            str(arguments.get("query", "")),
            str(arguments.get("jurisdiction", "auto")),
            int(arguments.get("max_skills", 5)),
        )
    if name == "skill_read":
        return catalog.read_skill(
            str(arguments.get("skill", "")),
            str(arguments.get("path", "SKILL.md")),
            int(arguments.get("start_line", 1)),
            int(arguments.get("max_lines", 220)),
        )
    if name == "skill_search":
        return catalog.search(
            str(arguments.get("query", "")),
            str(arguments.get("skill", "*")),
            int(arguments.get("max_matches", 12)),
        )
    if name == "skills_list":
        return catalog.list_text()
    raise ValueError(f"LEGAL_MCP_TOOL_UNKNOWN:{name}")


def serve(catalog: SkillCatalog) -> int:
    tools = tools_definition()
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
                reply = response(request_id, result={"tools": tools})
            elif method == "tools/call":
                params = message.get("params") or {}
                arguments = params.get("arguments") or {}
                if not isinstance(arguments, dict):
                    raise ValueError("LEGAL_MCP_TOOL_ARGUMENTS_INVALID")
                output = call_tool(catalog, str(params.get("name", "")), arguments)
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
                        "content": [{"type": "text", "text": f"LEGAL_TOOL_ERROR: {type(exc).__name__}: {exc}"}],
                        "isError": True,
                    },
                )
            else:
                reply = response(request_id, error={"code": -32603, "message": f"{type(exc).__name__}: {exc}"})
        sys.stdout.write(json.dumps(reply, ensure_ascii=False, separators=(",", ":")) + "\n")
        sys.stdout.flush()
    return 0


def self_test(catalog: SkillCatalog) -> int:
    assert len(catalog.skills) == EXPECTED_SKILL_COUNT
    listing = catalog.list_text()
    assert "SKILL_COUNT: 32" in listing
    assert "prawny-router-v3" in listing
    assert "prawo-polskie-v2" in listing
    assert "shared" in listing

    criminal = catalog.route("Sprawdź art. 286 kodeksu karnego w Polsce i podaj źródła.", "auto", 5)
    assert "JURISDICTION: PL" in criminal
    assert "dr-03-prawo-karne-wykroczenia-egzekucja" in criminal
    assert "prawo-polskie-v2" in criminal

    contract = catalog.route("Przeanalizuj umowę B2B i ryzyko klauzul.", "PL", 5)
    assert "analizator-umow-v1" in contract
    assert "dr-02-prawo-cywilne-rodzinne-gospodarcze" in contract

    readback = catalog.read_skill("prawny-router-v3", "SKILL.md", 1, 20)
    assert "LEGAL_SKILL_READ_V1" in readback
    assert "CONTENT_BEGIN" in readback
    print("LLAMA_LEGAL_SKILLS_MCP_SELFTEST_PASS:32")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skills-root", required=True)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    catalog = SkillCatalog(Path(args.skills_root))
    if args.self_test:
        return self_test(catalog)
    return serve(catalog)


if __name__ == "__main__":
    raise SystemExit(main())
