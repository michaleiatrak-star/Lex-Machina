#!/usr/bin/env python3
"""Inwentarz zeznan swiadka z kilku protokolow (MOD-ATAK-NA-SWIADKA SW-P2/SW-P6, F-240).

Wypisuje KAZDA wypowiedz swiadka (protokol, znacznik czasu, pytajacy, cytat, flagi) oraz pary
miedzy protokolami: deklarowana niepamiec/brak wiedzy wobec wypowiedzi wykazujacej wiedze (SW-A9)
i zaprzeczenie obecne tylko w jednej wersji. Z --pismo oznacza, ktore wypowiedzi pismo wykorzystuje.

python3 -I inwentarz_zeznan.py --swiadek Kast PROTOKOL.txt [PROTOKOL2.txt ...] [--pismo PISMO.txt]
    [--synonimy "informatyk=programista"] [--json]

Kod wyjscia: 0 = brak niewykorzystanych par; 3 = z --pismo: para SW-A9 lub zaprzeczenia,
ktorej zadna strona nie wystepuje w pismie (decyzja autora wymagana: uzyj albo podaj powod).
Testy: shared/tools/test_inwentarz_zeznan.py.
Wejscie: tekst protokolu (np. pdftotext -layout). Narzedzie nie ocenia sprzecznosci; wskazuje
wypowiedzi do porownania.
"""
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

TIME = re.compile(r"^\s*(?:\d+\s+)?(\d{2}:\d{2}:\d{2})\b\s*(.*)$")
CALL = re.compile(r"(?:Staje\s+)?[ŚSśs]wiadek\s*[–-]?\s*(.+)", re.I)
END = re.compile(r"[ŚS]wiadka\s+zwolniono|S[ąa]d\s+postanowi|Zatrzymano\s+rejestracj|Zako[ńn]czono\s+rejestracj", re.I)
QUESTION = re.compile(r"^\s*Na\s+pytani\w*\s*(.*?):?\s*$", re.I)
SIGNATURE = re.compile(r"Sygn\.?\s*akt:?\s*([A-Z]{1,4}\s+[A-Za-z]{1,4}\s+\d+/\d+)")
DATE = re.compile(r"Dnia[,\s]*(\d{1,2}\s+\w+\s+\d{4})")
NOT_TESTIMONY = re.compile(r"^(?:Przewodnicz|Pow[óo]d\s+(?:podnosi|ponosi|wnosi|o[śs]wiadcza|precyzuje)|Pe[łl]nomocnik|W\s+tym\s+miejscu)", re.I)

# Niepamiec / brak wiedzy deklarowany przez swiadka.
NW = re.compile(r"\bnie\s+(?:pami[eę]tam|wiem|wiadomo|s[ąa]\s+mi\s+znan|jest\s+mi\s+(?:wiadom|znan)|widzia[łl]\w*|s[łl]ysza[łl]\w*|mam\s+(?:[żz]adnej\s+)?wiedzy|uczestniczy[łl]\w*)|\bjuz\s+nie\b|\bju[żz]\s+nie\b", re.I)
# Relacja z drugiej reki.
HEARSAY = re.compile(r"skar[żz]yli|zg[łl]aszali|z\s+tego\s+co\s+wiem|dowiedzia[łl]|m[óo]wiono|podobno|pojawi[łl]y?\s+si[eę]\s+informacj", re.I)
# Ocena lub szczegol wskazujace na wiedze.
KNOWLEDGE = re.compile(r"zarz[ąa]dzeni|umow[aey]|notatk|polecen|uk[łl]ada[łl]a?\s+si[eę]|dobrze|[źz]le|problem|na\s+pocz[ąa]tku|p[óo][źz]niej|potem|\b\d{1,4}\b", re.I)

STOP = set("ktore ktory ktora jest bylo byly bedzie oraz przez przy jako tego tych takze wobec sprawie dnia roku "
           "powod powoda powodem powodowi pozwany pozwanej pozwana pozwanego swiadek swiadka mnie sie tylko bardzo "
           "wowczas kiedy jego jeszcze".split())
GENERIC = {"praco", "pracy", "pracu", "zosta", "spolk", "dokla", "czasu", "okres"}
DEFAULT_SYNONYMS = {"programista": "informatyk", "programisty": "informatyk", "rekrutacja": "rekruter",
                    "rekrutowal": "rekruter", "whatsapp": "wiadomosc", "smsowo": "wiadomosc", "sms": "wiadomosc"}


def fold(text):
    text = unicodedata.normalize("NFKD", text.replace("ł", "l").replace("Ł", "L"))
    return "".join(c for c in text if not unicodedata.combining(c)).lower()


def stems(text, synonyms):
    words = re.findall(r"[a-z]{4,}", fold(text))
    out = set()
    for word in words:
        if word in STOP:
            continue
        for key, value in synonyms.items():
            if word.startswith(key[:7]) and len(key) >= 4:
                word = value
                break
        out.add(word[:5])
    return out


def record_label(text, path):
    sig = SIGNATURE.search(text)
    date = DATE.search(text)
    parts = [sig.group(1).strip() if sig else Path(path).stem, date.group(1) if date else ""]
    return ", ".join(p for p in parts if p)


def statements(path, witness):
    text = Path(path).read_text(encoding="utf-8", errors="replace")
    label = record_label(text, path)
    lines = text.splitlines()
    out, active, testimony, stamp, asker, buf = [], False, False, "", "sad", []
    skipping = False

    def flush():
        if buf:
            item = re.sub(r"\s+", " ", " ".join(buf)).strip(" -–")
            if len(item) >= 12 and not NOT_TESTIMONY.match(item):
                out.append({"protokol": label, "czas": stamp, "pytajacy": asker, "tekst": item})
            buf.clear()

    for raw in lines:
        line = raw.rstrip()
        if not line.strip() or re.fullmatch(r"\s*\d{1,3}\s*", line) or "Dziennik Ustaw" in line:
            continue
        match = TIME.match(line)
        if match:
            flush()
            stamp, line = match.group(1), match.group(2)
        call = CALL.search(line)
        if call and fold(witness) in fold(call.group(1)):
            flush()
            active, testimony = True, False
        if not active:
            continue
        if not testimony:
            if re.search(r"zeznaje\s*:?", line, re.I):
                testimony, asker = True, "spontanicznie"
            continue
        if END.search(line):
            flush()
            active = testimony = False
            continue
        question = QUESTION.match(line.strip())
        if question:
            flush()
            asker = question.group(1).strip() or "pytanie"
            skipping = False
            continue
        body = line.strip()
        if body.startswith(("-", "–")):
            flush()
            body = body.lstrip("-– ")
            skipping = False
        if NOT_TESTIMONY.match(body):
            flush()
            skipping = True
            continue
        if not body or skipping:
            continue
        buf.append(body)
    flush()
    return out


def inventory(paths, witness, synonyms):
    items = []
    for path in paths:
        items.extend(statements(path, witness))
    for index, item in enumerate(items, 1):
        item["id"] = f"W-{index:03d}"
        flags = []
        if NW.search(item["tekst"]):
            flags.append("NW")
        if HEARSAY.search(item["tekst"]):
            flags.append("RELACJA")
        if KNOWLEDGE.search(item["tekst"]) and "NW" not in flags:
            flags.append("WIEDZA")
        item["flagi"] = flags
        # Slowa samej deklaracji niepamieci ("nie jest mi wiadomym") nie wyznaczaja tematu.
        item["_stems"] = stems(NW.sub(" ", item["tekst"]), synonyms)
    return items


def pairs(items):
    found = []
    for a in items:
        for b in items:
            if a is b or a["protokol"] == b["protokol"] or a["id"] > b["id"]:
                continue
            shared = sorted(a["_stems"] & b["_stems"])
            na, nb = "NW" in a["flagi"], "NW" in b["flagi"]
            # Niepamiec wobec wiedzy: wystarczy jeden wspolny rdzen tematu (po synonimach),
            # bo slowa deklaracji ("nie pamietam", "nie slyszalem") nie powtarzaja sie w drugiej wersji.
            if not shared or (len(shared) < 2 and not (na != nb and set(shared) - GENERIC)):
                continue
            if na != nb and ("WIEDZA" in (b if na else a)["flagi"]):
                found.append({"typ": "SW-A9 niepamiec/brak wiedzy wobec wiedzy", "a": a["id"], "b": b["id"], "wspolne": shared})
                continue
            nega = bool(re.search(r"\bnie\b", fold(a["tekst"])))
            negb = bool(re.search(r"\bnie\b", fold(b["tekst"])))
            if nega != negb and len(shared) >= 3:
                found.append({"typ": "zaprzeczenie tylko w jednej wersji", "a": a["id"], "b": b["id"], "wspolne": shared})
    return found


def used_in(item, pismo):
    words = re.findall(r"[a-z0-9]+", fold(item["tekst"]))
    source = " ".join(words)
    # Krotki cytat w pismie („...”, min. 3 slowa) obecny w wypowiedzi = wypowiedz wykorzystana.
    for quote in re.findall(r"[„\"]([^”\"]{8,300})[”\"]", pismo):
        qwords = re.findall(r"[a-z0-9]+", fold(quote))
        if len(qwords) >= 3 and " ".join(qwords) in source:
            return True
    target = " ".join(re.findall(r"[a-z0-9]+", fold(pismo)))
    for size in (6, 5):
        for i in range(0, max(0, len(words) - size + 1)):
            if " ".join(words[i:i + size]) in target:
                return True
    return len(words) < 5 and " ".join(words) in target


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("protokoly", nargs="+")
    parser.add_argument("--swiadek", required=True, help="nazwisko lub jego czesc (bez polskich znakow tez)")
    parser.add_argument("--pismo", help="tekst pisma: oznacz wykorzystanie wypowiedzi")
    parser.add_argument("--synonimy", default="", help="pary a=b oddzielone przecinkiem (doklada do domyslnych)")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args(argv)
    synonyms = dict(DEFAULT_SYNONYMS)
    for pair in filter(None, args.synonimy.split(",")):
        key, _, value = pair.partition("=")
        synonyms[fold(key.strip())] = fold(value.strip())
    items = inventory(args.protokoly, args.swiadek, synonyms)
    if not items:
        print(f"BRAK WYPOWIEDZI swiadka '{args.swiadek}' w podanych protokolach", file=sys.stderr)
        return 2
    pismo = Path(args.pismo).read_text(encoding="utf-8", errors="replace") if args.pismo else None
    for item in items:
        item["uzycie"] = ("UZYTE" if used_in(item, pismo) else "POMINIETE") if pismo is not None else ""
    found = pairs(items)
    by_id = {item["id"]: item for item in items}
    unused = [p for p in found if pismo is not None
              and by_id[p["a"]]["uzycie"] == "POMINIETE" and by_id[p["b"]]["uzycie"] == "POMINIETE"]
    partial = [p for p in found if pismo is not None and p not in unused
               and "POMINIETE" in (by_id[p["a"]]["uzycie"], by_id[p["b"]]["uzycie"])]
    if args.json:
        clean = [{k: v for k, v in item.items() if not k.startswith("_")} for item in items]
        print(json.dumps({"wypowiedzi": clean, "pary": found, "niewykorzystane_pary": unused,
                          "pary_wykorzystane_jednostronnie": partial}, ensure_ascii=False, indent=1))
    else:
        print("| ID | Protokol | Czas | Pytajacy | Wypowiedz | Flagi | Uzycie |\n|---|---|---|---|---|---|---|")
        for item in items:
            print(f"| {item['id']} | {item['protokol']} | {item['czas']} | {item['pytajacy']} | {item['tekst']} | "
                  f"{','.join(item['flagi'])} | {item['uzycie']} |")
        print("\nPARY DO POROWNANIA (miedzy protokolami):")
        for p in found:
            mark = " [NIEWYKORZYSTANA]" if p in unused else (" [JEDNOSTRONNIE]" if p in partial else "")
            print(f"- {p['a']} <> {p['b']}: {p['typ']} (wspolne: {', '.join(p['wspolne'])}){mark}")
        if not found:
            print("- brak")
    return 3 if unused else 0


if __name__ == "__main__":
    sys.exit(main())
