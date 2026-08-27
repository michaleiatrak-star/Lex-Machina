#!/usr/bin/env python3
"""Rebuild existing development ZIPs from their matching unpacked skills.

Preserves archive names and file bytes. Does not package unrelated directories.
Stages and verifies every archive before replacing any existing ZIP.
"""
import argparse
import json
import tempfile
from pathlib import Path, PurePosixPath
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from verify_development_archives import verify


def repack(repo):
    archives = repo / 'WERSJA ROZWOJOWA'
    unpacked = repo / 'Wersja rozwojowa rozpakowana'
    roots = set()
    with tempfile.TemporaryDirectory(prefix='repack-', dir=repo) as staging:
        stage = Path(staging)
        for archive in sorted(archives.glob('*.zip')):
            with ZipFile(archive) as old:
                names = old.namelist()
            entries = [n for n in names if len(PurePosixPath(n).parts) == 2
                       and n.endswith('/SKILL.md')]
            if len(entries) != 1:
                raise ValueError(f'Ambiguous entrypoint: {archive.name}')
            root = PurePosixPath(entries[0]).parts[0]
            if root in roots or root in ('.', '..') or '\\' in root:
                raise ValueError(f'Unsafe or duplicate root: {archive.name}')
            roots.add(root)
            source = unpacked / root
            if source.is_symlink() or not (source / 'SKILL.md').is_file():
                raise ValueError(f'Missing or unsafe source: {source}')
            paths = sorted(source.rglob('*'))
            if any(p.is_symlink() for p in paths):
                raise ValueError(f'Symlink in source: {source}')
            with ZipFile(stage / archive.name, 'w', ZIP_DEFLATED,
                         compresslevel=9) as new:
                for path in paths:
                    if not path.is_file():
                        continue
                    info = ZipInfo(path.relative_to(unpacked).as_posix(),
                                   date_time=(1980, 1, 1, 0, 0, 0))
                    info.create_system = 3
                    mode = 0o100755 if path.stat().st_mode & 0o111 else 0o100644
                    info.external_attr = mode << 16
                    info.compress_type = ZIP_DEFLATED
                    new.writestr(info, path.read_bytes(), compresslevel=9)
        report = verify(stage, unpacked)
        if report['errors']:
            raise ValueError(report['errors'])
        for archive in sorted(stage.glob('*.zip')):
            archive.replace(archives / archive.name)
    final = verify(archives, unpacked)
    if final['errors']:
        raise ValueError(final['errors'])
    return {'packages': len(final['packages']),
            'files': sum(p['files'] for p in final['packages']),
            'errors': final['errors'],
            'unmanaged_directories': final['unmanaged_directories']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo-root', type=Path,
                        default=Path(__file__).resolve().parents[1])
    print(json.dumps(repack(parser.parse_args().repo_root), indent=2))
