"""Benchmark: rebuild a person's full paradigm from ONE form found in a document.

Track A (Polish names, 300 persons): given names from the Cenzor measurement
list, surnames from the Parawan list of frequent PESEL surnames. Each person is
shown to the engine in one random case (random order / capitalisation), with no
gender information. The engine must return gender and all 7 singular cases.
Gold forms come from SGJP (any variant SGJP lists for the case is accepted), so
Track A measures disambiguation, gender and variant consistency - not SGJP.

Track B (foreign/rare names): hand-annotated gold in foreign-names-gold.json.

Baseline: literal restore (the document form re-inserted unchanged), which is
what Cenzor, piast-gate and Poufnik do.

Run: python person_inflection_benchmark.py [--persons 300] [--seed 7]
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))

from polish_person_morphology import CASES, PersonMorphology, _features  # noqa: E402


def sgjp_paradigm(engine, word: str, gender: str, role: str) -> dict[str, set[str]] | None:
    lemma_ids = set()
    for item in engine.analyse(word):
        _orth, lemma_id, tag, name_types, _q = item[2]
        parts = _features(tag)
        if parts[0] == {"subst"} and len(parts) >= 4 and gender in parts[3] and "nom" in parts[2] and role in name_types:
            lemma_ids.add(lemma_id)
    if not lemma_ids:
        return None
    forms: dict[str, set[str]] = {case: set() for case in CASES}
    for lemma_id in lemma_ids:
        for orth, _lemma, tag, *_rest in engine.generate(lemma_id):
            parts = _features(tag)
            if parts[0] == {"subst"} and len(parts) >= 4 and "sg" in parts[1] and gender in parts[3]:
                for case in parts[2] & set(CASES):
                    forms[case].add(orth)
    return forms if all(forms.values()) else None


def feminine_surname(surname: str) -> str:
    for ending in ("ski", "cki", "dzki"):
        if surname.endswith(ending):
            return surname[:-1] + "a"
    return surname


def build_track_a(engine, persons: int, rng: random.Random) -> tuple[list[dict], int]:
    lists = json.loads((HERE / "polish-name-lists.json").read_text(encoding="utf-8"))
    male, female = [], []
    for name in lists["given"]:
        if sgjp_paradigm(engine, name, "m1", "imię"):
            male.append(name)
        elif sgjp_paradigm(engine, name, "f", "imię"):
            female.append(name)
    surnames = [s.capitalize() for s in lists["surnames"]]
    rng.shuffle(surnames)
    items, skipped = [], 0
    for surname in surnames:
        if len(items) >= persons:
            break
        gender = "m1" if len(items) % 2 == 0 else "f"
        given = rng.choice(male if gender == "m1" else female)
        family = surname if gender == "m1" else feminine_surname(surname)
        g_forms = sgjp_paradigm(engine, given, gender, "imię")
        s_forms = sgjp_paradigm(engine, family, gender, "nazwisko")
        if not g_forms or not s_forms:
            skipped += 1
            continue
        gold = {case: {f"{g} {s}" for g in g_forms[case] for s in s_forms[case]} for case in CASES}
        reversed_gold = {case: {f"{s} {g}" for g in g_forms[case] for s in s_forms[case]} for case in CASES}
        observed = rng.choice(CASES)
        order_reversed = rng.random() < 0.2
        chosen_gold = reversed_gold if order_reversed else gold
        surface = rng.choice(sorted(chosen_gold[observed]))
        second = rng.choice([case for case in CASES if case != observed])
        second_surface = rng.choice(sorted(chosen_gold[second]))
        upper = rng.random() < 0.1
        if upper:
            surface, second_surface = surface.upper(), second_surface.upper()
            chosen_gold = {case: {form.upper() for form in forms} for case, forms in chosen_gold.items()}
        items.append({
            "surface": surface,
            "secondSurface": second_surface,
            "gender": gender,
            "observed": observed,
            "gold": chosen_gold,
        })
    return items, skipped


def score(items: list[dict], engine: PersonMorphology) -> dict:
    per_case = Counter()
    per_case_baseline = Counter()
    gender_ok = identity_ok = flagged = 0
    failures = []
    silent_wrong = 0
    for item in items:
        result = engine.analyze(item["surface"])
        second = engine.analyze(item["secondSurface"])
        gender_ok += result["gender"] == item["gender"]
        identity_ok += result["canonical"] == second["canonical"]
        flagged += result["status"] != "ok"
        wrong_here = False
        for case in CASES:
            ok = result["forms"][case]["text"] in item["gold"][case]
            wrong_here |= not ok
            per_case[case] += ok
            per_case_baseline[case] += item["surface"] in item["gold"][case]
            if not ok and len(failures) < 25 and False:
                failures.append(f"{item['surface']} [{item['observed']}] {case}: got {result['forms'][case]['text']!r}, gold {sorted(item['gold'][case])} ({result['status']})")
        silent_wrong += wrong_here and result["status"] == "ok"
        if wrong_here and len(failures) < 25:
            failures.append(f"{item['surface']} [{item['observed']}] -> {result['canonical']} ({result['status']})")
    total = len(items)
    all_cases = sum(per_case.values())
    return {
        "persons": total,
        "genderAccuracy": round(gender_ok / total, 4),
        "sameEntityAcrossTwoForms": round(identity_ok / total, 4),
        "flaggedForReview": flagged,
        "wrongButNotFlagged": silent_wrong,
        "formAccuracy": round(all_cases / (total * len(CASES)), 4),
        "formAccuracyByCase": {case: round(per_case[case] / total, 4) for case in CASES},
        "literalRestoreBaseline": round(sum(per_case_baseline.values()) / (total * len(CASES)), 4),
        "literalRestoreByCase": {case: round(per_case_baseline[case] / total, 4) for case in CASES},
        "sampleFailures": failures,
    }


def track_b(engine: PersonMorphology) -> dict:
    data = json.loads((HERE / "foreign-names-gold.json").read_text(encoding="utf-8"))["persons"]
    right = total = gender_ok = review = silent_wrong = 0
    rows = []
    for person in data:
        result = engine.analyze(person["nom"])
        gender_ok += result["gender"] == person["gender"]
        same = lambda a, b: a.replace("\u2019", "'") == b.replace("\u2019", "'")
        wrong = [case for case, form in person["forms"].items() if not same(result["forms"][case]["text"], form)]
        right += len(person["forms"]) - len(wrong)
        total += len(person["forms"])
        review += result["status"] != "ok"
        silent_wrong += bool(wrong) and result["status"] == "ok"
        rows.append({
            "name": person["nom"],
            "status": result["status"],
            "wrongCases": wrong,
            "confidence": min(result["forms"][case]["confidence"] for case in CASES),
        })
    return {
        "persons": len(data),
        "genderAccuracy": round(gender_ok / len(data), 4),
        "formAccuracy": round(right / total, 4),
        "flaggedForReview": review,
        # Wrong forms NOT flagged for review: the number that must stay at 0.
        "wrongButNotFlagged": silent_wrong,
        "rows": rows,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--persons", type=int, default=300)
    parser.add_argument("--seed", type=int, default=7)
    args = parser.parse_args()
    engine = PersonMorphology()
    items, skipped = build_track_a(engine.engine, args.persons, random.Random(args.seed))
    report = {
        "trackA": {**score(items, engine), "surnamesSkippedNotInSgjp": skipped},
        "trackB": track_b(engine),
    }
    print(json.dumps(report, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
