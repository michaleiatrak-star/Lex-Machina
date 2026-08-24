#!/usr/bin/env python3
"""Provider-neutral verification-log normalizer for Lex Machina.

Preferred input is the universal format::

    {"session_id":"...", "events":[
      {"tool":"web_fetch", "url":"https://...", "query_context":"art. 211 KC", "status":"success"},
      {"tool":"web_search", "query":"...", "result_urls":["https://..."], "status":"success"}
    ]}

Backward-compatible inputs:
- Claude/Anthropic `server_tool_use` + `web_*_tool_result` blocks;
- generic/OpenAI-compatible `tool_calls` + `role=tool` results;
- completed Responses-style `output[].web_search_call` / `web_fetch_call`.

An unmatched/incomplete tool call never counts as verification.
"""
from __future__ import annotations

import argparse
import json
import sys
from typing import Any

OK = {"success", "succeeded", "ok", "completed", "complete", "done"}
BAD = {"error", "failed", "failure", "cancelled", "canceled", "incomplete"}


def status_ok(obj: dict, default: bool) -> bool:
    status = obj.get("status")
    if status is None:
        return default
    value = str(status).lower()
    if value in BAD:
        return False
    return value in OK or default


def args_dict(value: Any) -> dict:
    if isinstance(value, dict):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, dict) else {}
        except json.JSONDecodeError:
            return {}
    return {}


def urls(value: Any) -> list[str]:
    found: list[str] = []
    def walk(x: Any):
        if isinstance(x, dict):
            for key, val in x.items():
                if key in {"url", "href", "source_url"} and isinstance(val, str) and val.startswith(("http://", "https://")):
                    found.append(val)
                else:
                    walk(val)
        elif isinstance(x, list):
            for item in x:
                walk(item)
    walk(value)
    return list(dict.fromkeys(found))


def tool_name(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    name = value.lower().replace("-", "_")
    if "web_search" in name or name in {"search", "browser_search", "browser.search", "internet_search"}:
        return "web_search"
    if "web_fetch" in name or name in {"fetch", "browser_open", "browser.open", "open_url", "open_page"}:
        return "web_fetch"
    return None


def normalized(payload: dict) -> list[dict] | None:
    raw = payload.get("events")
    if not isinstance(raw, list):
        return None
    out: list[dict] = []
    for ev in raw:
        if not isinstance(ev, dict) or not status_ok(ev, True):
            continue
        tool = tool_name(ev.get("tool") or ev.get("name") or ev.get("type"))
        if tool == "web_search":
            out.append({
                "tool": tool,
                "query": ev.get("query"),
                "result_urls": list(dict.fromkeys(x for x in ev.get("result_urls", urls(ev.get("results", []))) if isinstance(x, str))),
                "query_context": ev.get("query_context") or ev.get("context"),
            })
        elif tool == "web_fetch":
            event_urls = urls(ev)
            out.append({
                "tool": tool,
                "url": ev.get("url") or (event_urls[0] if event_urls else None),
                "query_context": ev.get("query_context") or ev.get("context"),
            })
    return out


def anthropic(payload: dict) -> tuple[list[dict], bool]:
    out: list[dict] = []
    detected = False
    for msg_idx, msg in enumerate(payload.get("messages", [])):
        if not isinstance(msg, dict) or msg.get("role") != "assistant" or not isinstance(msg.get("content"), list):
            continue
        last_text = None
        pending: dict[str, dict] = {}
        for block in msg["content"]:
            if not isinstance(block, dict):
                continue
            typ = block.get("type")
            if typ == "text":
                last_text = block.get("text", "")
            elif typ == "server_tool_use":
                detected = True
                tool = tool_name(block.get("name"))
                if tool:
                    pending[str(block.get("id"))] = {"tool": tool, "args": args_dict(block.get("input", {})), "ctx": last_text}
            elif typ in {"web_search_tool_result", "web_fetch_tool_result"}:
                detected = True
                call_id = str(block.get("tool_use_id"))
                call = pending.pop(call_id, None)
                if not call:
                    print(f"OSTRZEŻENIE: Claude result bez call id={call_id}; pomijam", file=sys.stderr)
                    continue
                if call["tool"] == "web_search":
                    out.append({"tool":"web_search", "query":call["args"].get("query"), "result_urls":urls(block.get("content", [])), "query_context":call["ctx"]})
                else:
                    found = urls(block.get("content", {}))
                    out.append({"tool":"web_fetch", "url":call["args"].get("url") or (found[0] if found else None), "query_context":call["ctx"]})
        for call_id, call in pending.items():
            print(f"OSTRZEŻENIE: {call['tool']} id={call_id} bez wyniku; NIE uznaję za zweryfikowane", file=sys.stderr)
    return out, detected


def generic_messages(payload: dict) -> tuple[list[dict], bool]:
    out: list[dict] = []
    detected = False
    pending: dict[str, dict] = {}
    last_text = None
    messages = payload.get("messages", [])
    if not isinstance(messages, list):
        return out, detected

    for msg in messages:
        if not isinstance(msg, dict):
            continue
        content = msg.get("content")
        if isinstance(content, str):
            last_text = content

        calls = msg.get("tool_calls")
        if isinstance(calls, list):
            detected = True
            for call in calls:
                if not isinstance(call, dict):
                    continue
                func = call.get("function") if isinstance(call.get("function"), dict) else {}
                tool = tool_name(call.get("name") or func.get("name"))
                call_id = call.get("id") or call.get("call_id")
                if tool and call_id:
                    pending[str(call_id)] = {"tool":tool, "args":args_dict(call.get("arguments", func.get("arguments", {}))), "ctx":last_text}

        if msg.get("role") == "tool":
            detected = True
            call_id = msg.get("tool_call_id") or msg.get("call_id")
            call = pending.pop(str(call_id), None) if call_id is not None else None
            if call and status_ok(msg, True):
                found = urls(msg)
                if call["tool"] == "web_search":
                    out.append({"tool":"web_search", "query":call["args"].get("query") or call["args"].get("q"), "result_urls":found, "query_context":call["ctx"]})
                else:
                    out.append({"tool":"web_fetch", "url":call["args"].get("url") or (found[0] if found else None), "query_context":call["ctx"]})
    return out, detected


def responses_style(payload: dict) -> tuple[list[dict], bool]:
    output = payload.get("output")
    if not isinstance(output, list):
        return [], False
    out: list[dict] = []
    detected = False
    searches: list[int] = []
    cited: list[str] = []
    for item in output:
        if not isinstance(item, dict):
            continue
        typ = str(item.get("type") or "").lower()
        if typ in {"web_search_call", "web_fetch_call"}:
            detected = True
            if not status_ok(item, False):
                continue
            action = item.get("action") if isinstance(item.get("action"), dict) else {}
            if typ == "web_search_call" or str(action.get("type") or "").lower() in {"search", "find"}:
                out.append({"tool":"web_search", "query":action.get("query") or item.get("query"), "result_urls":urls(item.get("results", [])), "query_context":item.get("query_context")})
                searches.append(len(out)-1)
            else:
                found = urls(item)
                out.append({"tool":"web_fetch", "url":action.get("url") or item.get("url") or (found[0] if found else None), "query_context":item.get("query_context")})
        elif typ in {"message", "output_text"}:
            cited.extend(urls(item.get("annotations") or item.get("content") or []))
    if cited and searches:
        idx = searches[-1]
        out[idx]["result_urls"] = list(dict.fromkeys(out[idx].get("result_urls", []) + cited))
    return out, detected


def wydobadz_zdarzenia(payload: dict) -> list[dict]:
    if not isinstance(payload, dict):
        raise TypeError("Wejście musi być obiektem JSON")
    direct = normalized(payload)
    if direct is not None:
        return direct
    data, detected = anthropic(payload)
    if detected:
        return data
    data, detected = generic_messages(payload)
    if detected:
        return data
    data, detected = responses_style(payload)
    if detected:
        return data
    print("OSTRZEŻENIE: nierozpoznany format; zalecany neutralny {session_id, events:[...]}", file=sys.stderr)
    return []


def session_id(payload: dict) -> str:
    return str(payload.get("session_id") or payload.get("id") or "nieznana-sesja")


def self_test() -> None:
    direct = {"session_id":"u", "events":[
        {"tool":"web_fetch", "url":"https://eli.gov.pl/x", "status":"success", "query_context":"art. 1"},
        {"tool":"web_search", "query":"SN X", "result_urls":["https://sn.pl/x"], "status":"completed"},
        {"tool":"web_fetch", "url":"https://invalid/", "status":"failed"},
    ]}
    claude = {"messages":[{"role":"assistant","content":[
        {"type":"text","text":"art. 211 KC"},
        {"type":"server_tool_use","id":"a","name":"web_fetch","input":{"url":"https://eli.gov.pl/x"}},
        {"type":"web_fetch_tool_result","tool_use_id":"a","content":{"url":"https://eli.gov.pl/x"}},
        {"type":"server_tool_use","id":"timeout","name":"web_fetch","input":{"url":"https://invalid/"}},
    ]}]}
    generic = {"messages":[
        {"role":"assistant","content":"art. 415 KC","tool_calls":[{"id":"c1","function":{"name":"web_fetch","arguments":"{\"url\":\"https://eli.gov.pl/x\"}"}}]},
        {"role":"tool","tool_call_id":"c1","status":"success","content":{"url":"https://eli.gov.pl/x"}},
    ]}
    responses = {"output":[
        {"type":"web_search_call","id":"w1","status":"completed","action":{"type":"search","query":"SN X"}},
        {"type":"message","content":[{"type":"output_text","annotations":[{"type":"url_citation","url":"https://sn.pl/x"}]}]},
    ]}
    a,b,c,d = map(wydobadz_zdarzenia, (direct, claude, generic, responses))
    ok = len(a)==2 and len(b)==1 and len(c)==1 and len(d)==1 and d[0].get("result_urls")==["https://sn.pl/x"]
    print(json.dumps({"normalized":a,"claude_legacy":b,"generic":c,"responses":d}, ensure_ascii=False, indent=2))
    if not ok:
        raise SystemExit("SELF-TEST NIEUDANY")
    print("SELF-TEST OK: normalized + Claude legacy + generic tool-call + Responses-style")


def main() -> None:
    parser = argparse.ArgumentParser(description="Provider-neutralny normalizator logu weryfikacji")
    parser.add_argument("--input")
    parser.add_argument("--out")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test(); return
    if not (args.input and args.out):
        parser.error("wymagane --input i --out (lub --self-test)")
    with open(args.input, encoding="utf-8") as f:
        payload=json.load(f)
    events=wydobadz_zdarzenia(payload)
    with open(args.out,"w",encoding="utf-8") as f:
        json.dump({"session_id":session_id(payload),"events":events},f,ensure_ascii=False,indent=2)
    print(f"Zapisano {len(events)} zdarzeń weryfikacji do {args.out}")


if __name__ == "__main__":
    main()
