from __future__ import annotations

import importlib.metadata
import json
from pathlib import Path
import sys


def main() -> int:
    if len(sys.argv) != 2:
        print("PYTHON_PACKAGE_SET_USAGE_ERROR", file=sys.stderr)
        return 2

    manifest_path = Path(sys.argv[1])
    manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
    expected = manifest.get("pythonPackages")
    if not isinstance(expected, dict):
        print("PYTHON_PACKAGE_SET_MANIFEST_INVALID", file=sys.stderr)
        return 2

    bad: list[str] = []
    for name, wanted in expected.items():
        package_name = str(name)
        wanted_version = str(wanted)
        try:
            actual = importlib.metadata.version(package_name)
        except importlib.metadata.PackageNotFoundError:
            actual = None
        if actual != wanted_version:
            bad.append(f"{package_name}:{actual!r}!={wanted_version!r}")

    if bad:
        print(";".join(bad))
        return 1

    print("PYTHON_PACKAGE_SET_PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
