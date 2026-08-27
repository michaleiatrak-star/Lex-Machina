#!/usr/bin/env python3
"""F-108/46: statyczny test wydania, nie dowód skuteczności modelu ani aktualności prawa.

Uruchom: python3 scripts/test_f108_trade.py --repo-root KATALOG_SKILLI
Wzorzec sześciu okresów pochodzi z osobno odczytanych M.P. wymienionych
w module (2026-08-27). Zmianę danych po nowym źródle aktualizuj jawnie
również w teście. Testy mutacyjne działają w pamięci, nie zmieniają plików.
"""
import argparse
from datetime import date, timedelta
from pathlib import Path
import re

MODULE = 'mod-transakcje-handlowe-opoznienia'
EXPECTED = [
    ('2024-01-01', '2024-06-30', '13,75', '15,75', '2023/1465'),
    ('2024-07-01', '2024-12-31', '13,75', '15,75', '2024/546'),
    ('2025-01-01', '2025-06-30', '13,75', '15,75', '2024/1106'),
    ('2025-07-01', '2025-12-31', '13,25', '15,25', '2025/602'),
    ('2026-01-01', '2026-06-30', '12,00', '14,00', '2025/1257'),
    ('2026-07-01', '2026-12-31', '11,75', '13,75', '2026/642'),
]


def rates(text):
    result = []
    for line in text.splitlines():
        if not re.match(r'^\| 20\d\d-\d\d-\d\d \|', line):
            continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if len(cells) != 5:
            return []
        match = re.search(r'https://eli.gov.pl/eli/MP/(\d{4}/\d+)/ogl/pol/pdf', cells[4])
        if not match or '{RZĄD: 1}' not in cells[4]:
            return []
        result.append((*cells[:4], match.group(1)))
    return result


def rate_contract(text):
    rows = rates(text)
    if rows != EXPECTED:
        return False
    return all(date.fromisoformat(a[1]) + timedelta(days=1) == date.fromisoformat(b[0])
               for a, b in zip(rows, rows[1:]))


def inventory_contract(text):
    section = text.split('## Rejestr postępu', 1)[1].split('**Następna transza:**', 1)[0]
    ids = [int(n) for n in re.findall(r'^\| (\d+) \|', section, re.M)]
    return ids == list(range(1, 53))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo-root', required=True)
    args = parser.parse_args()
    root = Path(args.repo_root)
    skills = {}
    for p in root.glob('*/SKILL.md'):
        match = re.search(r'^name: *[\"\']?([^\"\'\n]+)', p.read_text(), re.M)
        if match:
            skills[match.group(1).strip()] = p.parent
    dr = skills['dr-02-prawo-cywilne-rodzinne-gospodarcze']
    audit = skills['audyt-systemu-v4']
    shared = skills['shared']
    pp = skills['prawo-polskie-v2']
    content = (dr / 'modules' / (MODULE + '.md')).read_text()
    inventory = (audit / 'references/F-108-lista-MS-egzamin-2026.md').read_text()
    checks = []
    def check(label, ok):
        checks.append(bool(ok))
        print(('PASS ' if ok else 'FAIL ') + label)
    check('6 półroczy: wartości, źródła, ciągłość', rate_contract(content))
    line = next(x for x in content.splitlines() if x.startswith('| 2025-07-01'))
    check('mutacja: usunięcie półrocza blokuje', not rate_contract(content.replace(line, '')))
    check('mutacja: błędna stopa blokuje', not rate_contract(content.replace('15,25', '15,75')))
    check('mutacja: błędne źródło blokuje', not rate_contract(content.replace('/MP/2025/602/', '/MP/2025/603/')))
    check('jawna luka poza zakresem', '**STOP poza zakresem:**' in content and 'nie ekstrapoluj' in content.lower())
    check('kwalifikacja publiczny i leczniczy', 'publicznego będącego podmiotem\n   leczniczym' in content)
    check('granice rekompensaty', all(x in content for x in ['Do 5 000 zł włącznie | 40 EUR', 'Od 50 000 zł włącznie | 100 EUR', 'poniżej 50 000 zł | 70 EUR']))
    check('odbiór: art. 8 ust. 5', 'art. 7 ust. 4; art. 8 ust. 5' in content)
    check('rejestr 52/52', inventory_contract(inventory))
    check('mutacja: brak ID46 blokuje', not inventory_contract(re.sub(r'^\| 46 .*\n', '', inventory, flags=re.M)))
    for label, path in [('SKILL', dr/'SKILL.md'), ('mapa aktów', dr/'MAPA-AKTOW.md'),
                        ('mapa pokrycia', dr/'MAPA-POKRYCIA.md'), ('routing', pp/'ROUTING-MAP.md'),
                        ('RATE-COMPLETENESS', shared/'RATE-COMPLETENESS.md')]:
        check('rejestracja: '+label, MODULE in path.read_text())
    check('historia nieudawana', 'Nie potwierdzono jednak pełnego rejestru zmian' in content)
    check('13 sekcji wykonawczych', len(re.findall(r'^## \d+\.', content, re.M)) == 13)
    check('limit modułu', len(content.splitlines()) <= 1000)
    print(f'{sum(checks)}/{len(checks)} kontroli PASS; test statyczny, nie zamyka F-108.')
    return 0 if all(checks) else 1


if __name__ == '__main__':
    raise SystemExit(main())
