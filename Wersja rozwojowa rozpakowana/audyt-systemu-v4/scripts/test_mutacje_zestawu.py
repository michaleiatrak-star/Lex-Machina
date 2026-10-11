#!/usr/bin/env python3
"""test_mutacje_zestawu.py — TEST T49: każdy bloker zestawu regresyjnego potrafi się nie udać.

Dodany 2026-10-11 (AUDYT-2026-10-11b, uwaga z zewnętrznego code review: „niektóre skrypty
nie potrafią się nie udać”). Mutacje z AUDYT-2026-10-10a robiono ręcznie w sesji i nie zostały
utrwalone; ten test je utrwala i uruchamia w CI.

Metoda: dla każdej mutacji świeża kopia korpusu (i katalogu paczek ZIP obok, dla T34),
jeden znany defekt, uruchomienie właściwego testu z `--repo-root` kopii. Oczekiwany kod ≠ 0.
Najpierw przebieg kontrolny na kopii BEZ defektu: każdy test musi dać 0, inaczej mutacja
niczego nie dowodzi (test czerwony z innego powodu). Oryginalne drzewo nie jest zmieniane.

Bez mutacji: T19b (test ma własne mutacje w pamięci), T30 (wymaga historii AUDIT-JOURNAL).
Nie-blokery (T3, T8 heurystyki; T15 sieć; T33 pusty w repozytorium) — poza zakresem.

Użycie:  python3 test_mutacje_zestawu.py [--repo-root KORPUS] [--tylko T40,T47]
Kod wyjścia: 0 = każda mutacja wykryta; 1 = co najmniej jedna niewykryta albo kontrola czerwona.
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
ARCHIWA = "WERSJA ROZWOJOWA"


def _sub(path: Path, old: str, new: str, count: int = 1):
    s = path.read_text(encoding="utf-8")
    if old not in s:
        raise RuntimeError(f"mutacja nieaktualna: brak wzorca w {path.name}: {old[:60]!r}")
    path.write_text(s.replace(old, new, count), encoding="utf-8")


def _nazwa(prefiks: str, ext: str) -> str:
    """Nazwa pliku mutacji składana w locie: literalna nazwa w tym źródle byłaby dla T43
    „odwołaniem” i maskowałaby sierotę (zmierzone 2026-10-11)."""
    return prefiks + "-" + "mut" + "acja" + "-" + "x" * 3 + ext


def _pesel() -> str:
    cyfry = [4, 4, 0, 5, 1, 4, 0, 1, 3, 5]
    wagi = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
    k = (10 - sum(c * w for c, w in zip(cyfry, wagi)) % 10) % 10
    return "".join(map(str, cyfry)) + str(k)


def _frontmatter_description(path: Path):
    s = path.read_text(encoding="utf-8")
    m = re.search(r"^description:\s*(.+)$", s, re.M)
    if not m:
        raise RuntimeError(f"brak description w {path}")
    path.write_text(s[:m.end()] + " " + "x" * 250 + s[m.end():], encoding="utf-8")


def _plugin_version(path: Path):
    s = path.read_text(encoding="utf-8")
    path.write_text(re.sub(r'"version":\s*"[^"]+"', '"version": "0.0.1"', s, count=1), encoding="utf-8")


def _drop_table_separator(path: Path):
    """Usuwa pierwszy wiersz separatora tabeli Markdown — tabela przestaje być tabelą dla GFM."""
    linie = path.read_text(encoding="utf-8").splitlines(keepends=True)
    for i, l in enumerate(linie):
        if re.match(r"^\|\s*:?-{3,}", l):
            del linie[i]
            path.write_text("".join(linie), encoding="utf-8")
            return
    raise RuntimeError(f"brak separatora tabeli w {path}")


# (klucz, skrypt, argumenty względem korzenia R, opis, mutacja(R))
MUTACJE = [
    ("T1", "test_module_registration.py", lambda R: ["--repo-root", R], "moduł spoza rejestru SKILL.md",
     lambda R: (R / "dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-MUTACJA-niezarejestrowany.md")
     .write_text("# mod-MUTACJA\n\nTreść.\n", encoding="utf-8")),
    ("T6_T7", "ci_check_shared.py", lambda R: ["--repo-root", R], "zerwane odwołanie do shared",
     lambda R: _sub(R / "pisma-proste-v2/SKILL.md", "view shared/FORMAL-CHECK.md", "view shared/NIEISTNIEJACY-MUTACJA.md")),
    ("T14", "check_description.py", lambda R: [R], "description > 200 znaków",
     lambda R: _frontmatter_description(R / "pisma-proste-v2/SKILL.md")),
    ("T17", "test_router_contract.py", lambda R: ["--repo-root", R], "utrata PATH-SELFTEST w routerze",
     lambda R: (R / "prawny-router-v3/SKILL.md").write_text(
         (R / "prawny-router-v3/SKILL.md").read_text(encoding="utf-8").replace("PATH-SELFTEST", "PATH-XXX"), encoding="utf-8")),
    ("T18", "check_coverage_coherence.py", lambda R: [R], "brak ROUTING-MAP",
     lambda R: (R / "prawo-polskie-v2/ROUTING-MAP.md").unlink()),
    ("T22", "check_frontmatter_rejestracja.py", lambda R: [R], "skrypt w scripts/ bez wpisu we frontmatterze",
     lambda R: (R / "audyt-systemu-v4/scripts" / _nazwa("check", ".py")).write_text("print('x')\n", encoding="utf-8")),
    ("T29", "check_oplaty_mapa.py", lambda R: ["--katalog", R], "brak satelity TABELE-OPLAT",
     lambda R: (R / "shared/oplaty/05-sprawy-karne.md").unlink()),
    ("T34", "check_archiwa_repo.py", lambda R: ["--repo-root", R], "drzewo różne od paczki ZIP",
     lambda R: (R / "shared/DISCLAIMER.md").write_text(
         (R / "shared/DISCLAIMER.md").read_text(encoding="utf-8") + "\nMUTACJA\n", encoding="utf-8")),
    ("T35", "check_wejscie_dokumentu.py", lambda R: ["--repo-root", R], "konsument bez wywołania MOD-WEJSCIE-DOKUMENTU",
     lambda R: (R / "pisma-proste-v2/SKILL.md").write_text(
         (R / "pisma-proste-v2/SKILL.md").read_text(encoding="utf-8").replace("MOD-WEJSCIE-DOKUMENTU", "MOD-XXX"), encoding="utf-8")),
    ("T38", "check_plugin_manifest.py", lambda R: ["--repo-root", R], "plugin.json ≠ SKILL.md (version)",
     lambda R: _plugin_version(R / "pisma-proste-v2/.claude-plugin/plugin.json")),
    ("T39", "check_kontrakt_rachunek.py", lambda R: ["--repo-root", R], "separator tysięcy znów bez spacji",
     lambda R: _sub(R / "analizator-umow-v1/scripts/kontrakt_rachunek.py", 'SEP_TYS = "[. \\u00a0\\u202f]"', 'SEP_TYS = "[.\\u00a0\\u202f]"')),
    ("T40", "check_sekrety.py", lambda R: ["--repo-root", R], "PESEL z poprawną sumą w pliku",
     lambda R: (R / "shared/MUTACJA-dane.md").write_text(f"PESEL klienta: {_pesel()}\n", encoding="utf-8")),
    ("T41", "check_limit_plikow.py", lambda R: ["--repo-root", R], "skill z ≥ 200 plikami",
     lambda R: [(R / f"prawo-polskie-v2/references/mutacja-{i:03d}.md").write_text("x\n", encoding="utf-8") for i in range(200)]),
    ("T43", "check_sieroty.py", lambda R: ["--repo-root", R], "plik bez ścieżki wywołania",
     lambda R: (R / "dr-12-sadownictwo-prokuratura-zawody-prawnicze/references" / _nazwa("SIER", ".md"))
     .write_text("# Sierota\n", encoding="utf-8")),
    ("T44", "check_osiagalnosc_shared.py", lambda R: ["--repo-root", R], "plik shared nieosiągalny ze skilli",
     lambda R: (R / "shared" / _nazwa("NIEOS", ".md")).write_text("# Nieosiągalny\n", encoding="utf-8")),
    ("T45", "check_mapy_aktow.py", lambda R: ["--repo-root", R], "tabela mapy aktów bez separatora",
     lambda R: _drop_table_separator(R / "dr-12-sadownictwo-prokuratura-zawody-prawnicze/MAPA-AKTOW.md")),
    ("T47", "test_konstytucja_tekst_czysty.py", lambda R: ["--repo-root", R], "zły szablon URL tekstu ujednoliconego",
     lambda R: _sub(R / "audyt-systemu-v4/mcp-servers/isap-eli-example/isap-eli-mcp-server.js", "/text/${w.typ}/", "/text/X${w.typ}/")),
    ("T48", "check_testy_skilli.py", lambda R: ["--repo-root", R], "blokada czasowa prup znów tylko z --as-of",
     lambda R: _sub(R / "dr-02-prawo-cywilne-rodzinne-gospodarcze/scripts/prup.py",
                    "                status = temporal_status(meta, args.as_of, wanted)\n                if status['blocked']:",
                    "                status = temporal_status(meta, args.as_of, wanted)\n                if args.as_of and status['blocked']:")),
    ("T2", "test_module_count.py", lambda R: ["--repo-root", R], "licznik modułów ≠ dysk",
     lambda R: (R / "dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-MUTACJA-licznik.md")
     .write_text("# mod-MUTACJA\n", encoding="utf-8")),
    ("T9", "test_moved_to_shared.py", lambda R: ["--repo-root", R], "lokalna kopia modułu przeniesionego do shared",
     lambda R: (R / "dr-16-pisma-strategia-dowody-orzecznictwo/modules/mod-KPC-przesluchanie-swiadkow.md")
     .write_text("# stara kopia\n", encoding="utf-8")),
    ("T11", "check_sync_aktow.py", lambda R: ["--repo-root", R, "--limit", "10"], "akt w mapie DR, brak w ROUTING-MAP",
     lambda R: _sub(R / "dr-12-sadownictwo-prokuratura-zawody-prawnicze/MAPA-AKTOW.md",
                    "| Prawo o adwokaturze |",
                    "| ustawa mutacyjna o testach | Dz.U. 2026 poz. 9999 t.j. | `mod-ustawa-adwokatura` | ✅ |\n| Prawo o adwokaturze |")),
    ("T12", "check_wersje_changelog.py", lambda R: [R], "version w SKILL.md bez changelogu",
     lambda R: _sub(R / "pisma-proste-v2/SKILL.md", 'version: "2.', 'version: "9.')),
    ("T13", "check_dlugosc_modulow.py", lambda R: [R], "moduł > 1000 linii",
     lambda R: (R / "dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-KSCU-koszty-sadowe-i-pomoc-prawna.md")
     .write_text((R / "dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-KSCU-koszty-sadowe-i-pomoc-prawna.md")
                 .read_text(encoding="utf-8") + "linia\n" * 1100, encoding="utf-8")),
    ("T19", "test_f108_consistency.py", lambda R: ["--repo-root", R], "F-108: podsumowanie 52/52 utracone",
     lambda R: _sub(R / "audyt-systemu-v4/references/F-108-lista-MS-egzamin-2026.md",
                    "52/52 aktów ma realny routing/moduł", "51/52 aktów ma realny routing/moduł")),
    ("T23", "test_pokrycie_orkiestratora.py", lambda R: ["--repo-root", R], "skrypt zarejestrowany, poza orkiestratorem",
     lambda R: ((R / "audyt-systemu-v4/scripts/check_mutacja_poza_zestawem.py").write_text("print('x')\n", encoding="utf-8"),
                _sub(R / "audyt-systemu-v4/SKILL.md", "  - scripts/check_testy_skilli.py\n",
                     "  - scripts/check_testy_skilli.py\n  - scripts/check_mutacja_poza_zestawem.py\n"))),
    ("T28", "check_wartosci_prawne.py", lambda R: ["--katalog", R, "--tylko-fail"], "nawrót znanego błędnego cytatu (art. 328¹)",
     lambda R: (R / "pisma-proste-v2/references/SPF-SPG.md").write_text(
         (R / "pisma-proste-v2/references/SPF-SPG.md").read_text(encoding="utf-8") + "\nWniosek z art. 328¹ KPC.\n", encoding="utf-8")),
    ("T32", "check_tabele_satelickie.py", lambda R: ["--repo-root", R], "plik z rejestru tabel opłat nie istnieje",
     lambda R: (R / "pisma-proste-v2/references/M6-oplaty.md").unlink()),
    ("T36", "check_eli_extract.py", lambda R: ["--repo-root", R], "ekstraktor jednostek ELI zepsuty",
     lambda R: _sub(R / "shared/tools/eli_art_extract.py", "def wyciagnij(html: str, cytat: str) -> dict:\n",
                    "def wyciagnij(html: str, cytat: str) -> dict:\n    return {'status': 'NOT_FOUND'}\n")),
    ("T42", "check_graf_przyczynowy.py", lambda R: ["--repo-root", R], "silnik grafu: zły wzór LUB",
     lambda R: _sub(R / "shared/tools/graf_przyczynowy.py", "                    f = 1 - iloczyn", "                    f = iloczyn")),
    ("T46", "test_mac_ce_litery.py", lambda R: ["--repo-root", R], "markery Mac CE w JS zawężone",
     lambda R: _sub(R / "audyt-systemu-v4/mcp-servers/isap-eli-example/isap-eli-mcp-server.js",
                    "const MARKERY_MAC_CE = /[¢´¸∏¡ƒÂÊ˚˝]/;", "const MARKERY_MAC_CE = /[¢]/;")),
    ("MOCK", "mock_eli_server_test.py", lambda R: [], "sync_dzu_eli bez górnej granicy dat",
     lambda R: _sub(R / "audyt-systemu-v4/scripts/sync_dzu_eli.py",
                    "if not (od_daty <= data_publikacji <= do_daty):", "if not (od_daty <= data_publikacji):")),
]


def uruchom(R: Path, skrypt: str, args: list[str]) -> tuple[int, str]:
    """Skrypt z KOPII (mutacja może dotyczyć samego skryptu albo modułu, który importuje)."""
    env = {k: v for k, v in os.environ.items() if k != "LEX_LIVE"}
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    r = subprocess.run([sys.executable, str(R / "audyt-systemu-v4" / "scripts" / skrypt), *args],
                       capture_output=True, text=True, env=env, timeout=900, cwd=str(R))
    return r.returncode, (r.stdout + r.stderr)


def kopia(root: Path, cel: Path) -> Path:
    R = cel / root.name
    shutil.copytree(root, R, ignore=shutil.ignore_patterns("node_modules", "__pycache__", ".git"))
    if (root.parent / ARCHIWA).is_dir():
        shutil.copytree(root.parent / ARCHIWA, cel / ARCHIWA)
    return R


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.environ.get("LEX_MACHINA_ROOT") or str(SCRIPTS.parents[1]))
    ap.add_argument("--tylko", default="")
    a = ap.parse_args()
    root = Path(a.repo_root).resolve()
    wybrane = {x.strip() for x in a.tylko.split(",") if x.strip()}
    mutacje = [m for m in MUTACJE if not wybrane or m[0] in wybrane]
    print(f"TEST T49 — MUTACJE ZESTAWU REGRESYJNEGO ({len(mutacje)} mutacji)")
    bledy = 0
    with tempfile.TemporaryDirectory(prefix="lex-mutacje-") as tmp:
        tmp = Path(tmp)
        czysta = kopia(root, tmp / "czysta")
        kontrola = {}
        for klucz, skrypt, args, _, _ in mutacje:
            if skrypt not in kontrola:
                kontrola[skrypt] = uruchom(czysta, skrypt, args(str(czysta)))[0]
        for klucz, skrypt, args, opis, mutuj in mutacje:
            if kontrola[skrypt] != 0:
                bledy += 1
                print(f"  ❌ {klucz}: przebieg kontrolny {skrypt} na czystej kopii = {kontrola[skrypt]} (oczekiwano 0)")
                continue
            praca = tmp / f"m-{klucz}"
            R = kopia(root, praca)
            try:
                mutuj(R)
            except RuntimeError as exc:
                bledy += 1
                print(f"  ❌ {klucz}: {exc}")
                continue
            kod, out = uruchom(R, skrypt, args(str(R)))
            shutil.rmtree(praca, ignore_errors=True)
            if kod == 0:
                bledy += 1
                print(f"  ❌ {klucz} NIEWYKRYTA: {opis} — {skrypt} zwrócił 0")
            else:
                print(f"  ✅ {klucz}: {opis} → kod {kod}")
    if bledy:
        print(f"WYNIK T49: FAIL — {bledy} z {len(mutacje)} mutacji niewykrytych albo bez ważnej kontroli.")
        return 1
    print(f"WYNIK T49: PASS — każda z {len(mutacje)} mutacji wykryta, kontrole na czystej kopii zielone.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
