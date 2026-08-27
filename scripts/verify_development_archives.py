#!/usr/bin/env python3
"""Check that unpacked development skills exactly match their ZIP sources.

Directories without a corresponding archive are reported, never removed.
This is a byte-integrity check, not a legal-content audit.
"""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
from zipfile import ZipFile


def verify(archives, unpacked):
    errors, packages, roots = [], [], set()
    for archive in sorted(archives.glob('*.zip')):
        with ZipFile(archive) as z:
            files = [i for i in z.infolist() if not i.is_dir()]
            names = [i.filename for i in files]
            if len(names) != len(set(names)):
                errors.append(f'{archive.name}: duplicate paths')
                continue
            if any(PurePosixPath(n).is_absolute() or '..' in PurePosixPath(n).parts
                   or '\\' in n for n in names):
                errors.append(f'{archive.name}: unsafe path')
                continue
            entrypoints = [n for n in names if len(PurePosixPath(n).parts) == 2
                           and n.endswith('/SKILL.md')]
            if len(entrypoints) != 1:
                errors.append(f'{archive.name}: expected one skill entrypoint')
                continue
            root = PurePosixPath(entrypoints[0]).parts[0]
            if root in roots or any(not n.startswith(root + '/') for n in names):
                errors.append(f'{archive.name}: ambiguous package root')
                continue
            roots.add(root)
            actual = {(root + '/' + p.relative_to(unpacked / root).as_posix()): p
                      for p in (unpacked / root).rglob('*') if p.is_file()}
            for n in sorted(set(names) - actual.keys()):
                errors.append(f'missing: {n}')
            for n in sorted(actual.keys() - set(names)):
                errors.append(f'extra: {n}')
            for n in sorted(set(names) & actual.keys()):
                if actual[n].is_symlink() or actual[n].read_bytes() != z.read(n):
                    errors.append(f'different: {n}')
            packages.append({'archive': archive.name, 'skill': root, 'files': len(names),
                             'sha256': hashlib.sha256(archive.read_bytes()).hexdigest()})
    if not packages:
        errors.append('no valid packages')
    extras = sorted(p.name for p in unpacked.iterdir()
                    if p.is_dir() and p.name not in roots) if unpacked.exists() else []
    return {'packages': packages, 'errors': errors, 'unmanaged_directories': extras}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo-root', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    result = verify(args.repo_root / 'WERSJA ROZWOJOWA',
                    args.repo_root / 'Wersja rozwojowa rozpakowana')
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if result['errors'] else 0


if __name__ == '__main__':
    raise SystemExit(main())
