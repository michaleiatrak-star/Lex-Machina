#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
instaluj_serwery_mcp.py — konfiguracja serwerów MCP Lex Machina z katalogu
audyt-systemu-v4/mcp-servers/ (pakiet dist/lex-mcp.mjs — bez npm, bez node_modules).

KIEDY POTRZEBNY (AUDYT-2026-09-27m):
  • Claude Code z pluginem audyt-systemu-v4 — NIE; serwery startują same z `.mcp.json` pluginu.
  • Claude Desktop — ZALECANE rozszerzenie dist/lex-machina.mcpb (bez Pythona i bez Node — Desktop ma
    własny Node.js); ten skrypt (`--scal-desktop`) to wariant zapasowy.
  • Claude Code bez pluginu albo sieć z proxy przechwytującym TLS — TAK: plugin nie może
    przekazać NODE_EXTRA_CA_CERTS / HTTPS_PROXY (w `.mcp.json` pluginu podstawiane są tylko
    CLAUDE_PLUGIN_ROOT i CLAUDE_PLUGIN_DATA), a SDK przekazuje serwerowi tylko HOME/PATH/SHELL/TERM.
  • claude.ai w przeglądarce — nie dotyczy: serwerów stdio tam nie ma, potrzebny HTTPS (F-8).

Wymaga: Python 3.8+, Node.js 18+. Windows, Linux, macOS.
    python instaluj_serwery_mcp.py --scal-desktop   # Claude Desktop (kopia zapasowa konfiguracji)
    python instaluj_serwery_mcp.py                  # tylko mcp-config.json + polecenia `claude mcp add`
    python instaluj_serwery_mcp.py --sprawdz        # handshake MCP każdego serwera (CI), bez zapisu
    python instaluj_serwery_mcp.py --diagnoza       # czy TA maszyna ma Claude Desktop → którą ścieżkę wybrać
    python instaluj_serwery_mcp.py --mcpb KATALOG   # rozszerzenie lex-machina.mcpb (czysty Python, bez sieci)
    python instaluj_serwery_mcp.py --lista          # lista wyboru (numery, grupy, CEIDG z linkiem do klucza)
    python instaluj_serwery_mcp.py --mcpb KATALOG --serwery 1 2 5 ceidg --ceidg-klucz-plik PLIK
                                                    # rozszerzenie z WYBRANYMI serwerami; z kluczem = OSOBISTE
    python instaluj_serwery_mcp.py --ceidg-test --ceidg-klucz-plik ~/ceidg.token   # czy klucz działa (live)
    python instaluj_serwery_mcp.py --scal-desktop --serwery ceidg --ceidg-klucz-plik ~/ceidg.token
                                                    # UZUPEŁNIENIE: dopisz sam CEIDG z kluczem do Desktopu

KLUCZ CEIDG (od 2026-09-29, F-214):
  • Skąd: Hurtownia danych CEIDG i Biznes.gov.pl — https://dane.biznes.gov.pl/pl/portal/034872
    („wypełnij wniosek o dostęp i zarejestruj się”; logowanie Profilem Zaufanym). Token = klucz API (JWT).
  • Kolejność źródeł: --ceidg-klucz-plik → zmienna CEIDG_API_KEY → pytanie w terminalu (ukryte wpisywanie)
    → --ceidg-klucz (odradzane: zostaje w historii powłoki).
  • ⛔ Token to JWT: jego ładunek (base64, NIE szyfrowanie) zawiera PESEL, imię i nazwisko właściciela.
    Nigdy nie zapisuj go w repozytorium. Konfiguracja z kluczem trafia domyślnie do ~/.lex-machina/
    (uprawnienia 600), nie do katalogu skilla. T40 (check_sekrety.py) blokuje commit z JWT.

Pozycja 14 menu audytu (FAZA 0E, od audyt 6.144) uruchamia ten skrypt: `--diagnoza`, potem
`--scal-desktop` (maszyna z Claude Desktop) albo `--mcpb` (piaskownica: claude.ai, czat Desktop, Cowork).
"""
import argparse
import base64
import getpass
import json
import urllib.error
import urllib.request
import os
import platform
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

TU = Path(__file__).resolve().parent
PAKIET = TU / "dist" / "lex-mcp.mjs"
# ⛔ JEDYNE źródło listy wyboru FAZY 0E (od 6.152) — numeracja stała, SKILL.md jej nie powiela.
GRUPY = [
    ("Akty prawne i orzecznictwo", [
        ("isap", "ISAP/ELI — tekst aktu i przepisu (Sejm ELI)"),
        ("eurlex", "EUR-Lex + TSUE — akty UE, status, wyroki"),
        ("saos", "SAOS — agregator orzeczeń SP, SN i KIO (ranga najniższa; zastępczo), cytator"),
        ("cbosa", "CBOSA — orzeczenia NSA/WSA (snapshot 🟨)"),
        ("sn", "SN — orzeczenia Sądu Najwyższego (sn.pl, źródłem karta orzeczenia)"),
        ("sp", "Sądy powszechne — Portal Orzeczeń (stały link do orzeczenia)"),
        ("tk", "TK — orzeczenia Trybunału Konstytucyjnego (IPO, OTK ZU; bez SAOS)"),
        ("kio", "KIO — orzeczenia Krajowej Izby Odwoławczej (wyszukiwarka UZP)"),
        ("etpcz", "ETPCz — orzeczenia Europejskiego Trybunału Praw Człowieka (baza MS, etpcz.ms.gov.pl)"),
    ]),
    ("Rejestry podmiotów", [
        ("krs", "KRS — odpis, reprezentacja (bez klucza)"),
        ("wl", "Biała lista VAT — status i rachunki (bez klucza)"),
        ("ceidg", "CEIDG — przedsiębiorcy-osoby fizyczne (WYMAGA KLUCZA)"),
    ]),
    ("Podatki, finanse, dane osobowe", [
        ("nbp", "NBP — kursy walut"),
        ("eureka", "EUREKA — interpretacje podatkowe"),
        ("sudop", "SUDOP — pomoc publiczna / de minimis"),
        ("uodo", "UODO — decyzje Prezesa UODO"),
    ]),
]
SERWERY = [n for _, g in GRUPY for n, _ in g]
NUMER = {str(i): n for i, n in enumerate(SERWERY, 1)}
WYMAGA_KLUCZA = {"ceidg": "CEIDG_API_KEY"}
PREFIKS = "lex-"
CEIDG_LINK = "https://dane.biznes.gov.pl/pl/portal/034872"   # zweryfikowany 2026-09-29 (HTTP 200)
CEIDG_API = "https://dane.biznes.gov.pl/api/ceidg/v3/firmy?nip=5261040828"  # NIP spółki z KRS → 204 = token działa
KATALOG_PRYWATNY = Path.home() / ".lex-machina"
ZMIENNE = ["HTTPS_PROXY", "HTTP_PROXY", "NO_PROXY", "https_proxy", "http_proxy", "no_proxy", "NODE_EXTRA_CA_CERTS"]


def node():
    p = shutil.which("node")
    if not p:
        raise SystemExit("⛔ Brak Node.js — zainstaluj 18+ (nodejs.org).")
    v = subprocess.run([p, "--version"], capture_output=True, text=True).stdout.strip()
    if not v.startswith("v") or int(v[1:].split(".")[0]) < 18:
        raise SystemExit(f"⛔ Node.js {v or '?'} — wymagany 18+.")
    return p


def handshake(nd, serwer, env):
    """initialize → initialized → tools/list przez stdio (JSON-RPC, linia na komunikat)."""
    wiad = [
        {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
            "protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "lex-instalator", "version": "1"}}},
        {"jsonrpc": "2.0", "method": "notifications/initialized"},
        {"jsonrpc": "2.0", "id": 2, "method": "tools/list"},
    ]
    wejscie = "".join(json.dumps(m) + "\n" for m in wiad)
    try:
        r = subprocess.run([nd, str(PAKIET), serwer], input=wejscie, capture_output=True, text=True,
                           timeout=30, env={**os.environ, **env}, encoding="utf-8")
    except subprocess.TimeoutExpired as e:
        r = e  # serwer czeka na dalsze komunikaty — to normalne; odpowiedzi są już na stdout
    out = r.stdout if isinstance(r.stdout, str) else (r.stdout or b"").decode("utf-8", "replace")
    for linia in out.splitlines():
        try:
            m = json.loads(linia)
        except ValueError:
            continue
        if m.get("id") == 2 and "result" in m:
            return [t["name"] for t in m["result"].get("tools", [])]
    return None


def plik_desktop():
    s = platform.system()
    if s == "Windows":
        return Path(os.environ.get("APPDATA", "")) / "Claude" / "claude_desktop_config.json"
    if s == "Darwin":
        return Path.home() / "Library" / "Application Support" / "Claude" / "claude_desktop_config.json"
    return Path.home() / ".config" / "Claude" / "claude_desktop_config.json"


def diagnoza():
    """Czy skrypt działa na komputerze z Claude Desktop? Tylko wtedy --scal-desktop ma sens."""
    plik = plik_desktop()
    katalog = plik.parent
    jest = katalog.is_dir()
    print(f"system: {platform.system()} | katalog Claude Desktop: {katalog} | istnieje: {'TAK' if jest else 'NIE'}")
    print(f"konfiguracja: {plik} | istnieje: {'TAK' if plik.is_file() else 'NIE'}")
    if jest:
        print("ŚCIEŻKA: --scal-desktop (ta maszyna ma Claude Desktop)")
        return 0
    print("ŚCIEŻKA: --mcpb (brak Claude Desktop na tej maszynie — np. piaskownica; zapis konfiguracji byłby fikcją)")
    return 3


def ceidg_klucz(a, pytaj: bool):
    """Klucz CEIDG z: pliku → CEIDG_API_KEY → pytania w terminalu → --ceidg-klucz. Zwraca str albo None."""
    if a.ceidg_klucz_plik:
        return Path(a.ceidg_klucz_plik).expanduser().read_text(encoding="utf-8").strip() or None
    if os.environ.get("CEIDG_API_KEY"):
        return os.environ["CEIDG_API_KEY"].strip()
    if a.ceidg_klucz:
        print("⚠️ --ceidg-klucz zostaje w historii powłoki — następnym razem użyj --ceidg-klucz-plik.")
        return a.ceidg_klucz.strip()
    if pytaj and sys.stdin.isatty():
        print(f"Klucz CEIDG (opcjonalny) — uzyskasz go tu: {CEIDG_LINK}")
        k = getpass.getpass("Wklej token CEIDG i Enter (puste = pomiń CEIDG): ").strip()
        return k or None
    return None


def ceidg_opis_klucza(k: str) -> str:
    """Kontrola kształtu JWT bez ujawniania treści. Nie wypisuje PESEL ani nazwiska."""
    cz = k.split(".")
    if len(cz) != 3:
        return "⛔ to nie wygląda na token JWT (oczekiwane 3 części rozdzielone kropkami)"
    try:
        b = cz[1] + "=" * (-len(cz[1]) % 4)
        d = json.loads(base64.urlsafe_b64decode(b))
    except Exception:
        return "⛔ nie da się odczytać ładunku JWT — sprawdź, czy wkleiłeś cały token"
    osobowe = [x for x in ("pesel", "given_name", "family_name") if x in d]
    return (f"JWT poprawny składniowo; pola: {', '.join(sorted(d))}"
            + (f" — ⚠️ zawiera dane osobowe ({', '.join(osobowe)}): nie publikuj tokenu" if osobowe else ""))


def ceidg_test(k: str) -> int:
    """Jedno żądanie do API v3 (limit ~50/180 s — nie zapętlaj). 204/200 = token działa; 401 = zły token."""
    req = urllib.request.Request(CEIDG_API, headers={"Authorization": f"Bearer {k}", "Accept": "application/json",
                                                     "User-Agent": "lex-machina-instalator/1"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            kod = r.status
    except urllib.error.HTTPError as e:
        kod = e.code
    except Exception as e:  # sieć, proxy, DNS
        print(f"⛔ CEIDG: brak połączenia ({type(e).__name__}: {e}) — to nie jest ocena klucza."); return 2
    if kod in (200, 204):
        print(f"✅ CEIDG: token działa (HTTP {kod})."); return 0
    if kod == 401:
        print(f"⛔ CEIDG: HTTP 401 — token nieprawidłowy lub wygasły. Nowy: {CEIDG_LINK}"); return 1
    if kod == 429:
        print("⚠️ CEIDG: HTTP 429 — limit zapytań; odczekaj kilka minut, NIE ponawiaj w pętli."); return 2
    print(f"⚠️ CEIDG: nieoczekiwany HTTP {kod}."); return 2


def zapisz_prywatnie(sciezka: Path, tresc: str):
    sciezka.parent.mkdir(parents=True, exist_ok=True)
    sciezka.write_text(tresc, encoding="utf-8")
    try:
        os.chmod(sciezka, 0o600)
    except OSError:
        pass


def lista_wyboru() -> str:
    """Tekst listy do pokazania użytkownikowi (fallback bez przycisków). Numeracja = NUMER."""
    w, i = ["Serwery MCP Lex Machina — odpisz numerami, nazwami albo „wszystkie”:"], 1
    for grupa, poz in GRUPY:
        w.append(f"\n{grupa}:")
        for n, opis in poz:
            w.append(f"  {i:>2}. {n:<7} {opis}"); i += 1
    w.append(f"\nCEIDG: klucz (token JWT) uzyskasz tu: {CEIDG_LINK} — wniosek o dostęp, Profil Zaufany.")
    return "\n".join(w)


def rozwin_wybor(tokeny):
    """['1','krs','wszystkie'] → lista nazw w stałej kolejności. Nieznany token → SystemExit."""
    if not tokeny:
        return None
    wyn = set()
    for t in (x.strip().lower() for x in " ".join(tokeny).replace(",", " ").split()):
        if t in ("wszystkie", "all"):
            wyn |= set(SERWERY)
        elif t in NUMER:
            wyn.add(NUMER[t])
        elif t in SERWERY:
            wyn.add(t)
        else:
            raise SystemExit(f"⛔ nieznany serwer „{t}” — zobacz --lista")
    return [n for n in SERWERY if n in wyn]


def zbuduj_mcpb(wyjscie, wybrane=None, klucz=None):
    """lex-machina.mcpb = ZIP: manifest.json, server/lex-mcp.mjs, server/NOTICE-THIRD-PARTY.txt, LICENSE.
    Czysty Python (bez npm/sieci), stałe znaczniki czasu → powtarzalny wynik.
    `wybrane` (od 6.152): tylko te serwery — argument launchera i lista narzędzi w manifeście.
    `klucz` (od 6.152): wersja OSOBISTA — token CEIDG wpisany w env manifestu; nazwa pliku
    lex-machina-osobisty.mcpb; ⛔ nie udostępniać, nie commitować (ładunek JWT zawiera PESEL)."""
    wyjscie = Path(wyjscie).expanduser().resolve()
    wyjscie.mkdir(parents=True, exist_ok=True)
    wybrane = wybrane or list(SERWERY)
    if klucz and "ceidg" not in wybrane:
        wybrane = wybrane + ["ceidg"]
    man = json.loads((TU / "mcpb-manifest.json").read_text(encoding="utf-8"))
    pelny = set(wybrane) == set(SERWERY)
    man["server"]["mcp_config"]["args"][1] = "wszystkie" if pelny else ",".join(wybrane)
    pref = {"isap": "isap_", "eurlex": "eurlex_", "saos": "saos_", "cbosa": "cbosa_", "sn": "sn_", "sp": "sp_", "tk": "tk_", "kio": "kio_", "etpcz": "etpcz_", "krs": "krs_", "wl": "wl_",
            "ceidg": "ceidg_", "nbp": "nbp_", "eureka": "eureka_", "sudop": "sudop_", "uodo": "uodo_"}
    man["tools"] = [t for t in man["tools"] if any(t["name"].startswith(pref[n]) for n in wybrane)]
    if "ceidg" not in wybrane:
        man["user_config"].pop("ceidg_klucz", None)
        man["server"]["mcp_config"]["env"].pop("CEIDG_API_KEY", None)
    if "sn" not in wybrane:
        man["user_config"].pop("sn_cookie", None)
        man["server"]["mcp_config"]["env"].pop("SN_COOKIE", None)
    if klucz:
        man["server"]["mcp_config"]["env"]["CEIDG_API_KEY"] = klucz
        man["user_config"].pop("ceidg_klucz", None)
        man["display_name"] = man.get("display_name", "Lex Machina") + " (osobiste — z kluczem CEIDG)"
    if not pelny:
        man["description"] = man["description"].split(":")[0] + ": " + ", ".join(wybrane) + "."
    cel = wyjscie / ("lex-machina-osobisty.mcpb" if klucz else "lex-machina.mcpb")
    pliki = [(None, "manifest.json"), (PAKIET, "server/lex-mcp.mjs"),
             (TU / "dist" / "NOTICE-THIRD-PARTY.txt", "server/NOTICE-THIRD-PARTY.txt"), (TU / "LICENSE", "LICENSE")]
    brak = [str(z) for z, _ in pliki if z is not None and not z.is_file()]
    if brak:
        raise SystemExit(f"⛔ brak plików rozszerzenia: {brak}")
    with zipfile.ZipFile(cel, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for zrodlo, nazwa in pliki:
            info = zipfile.ZipInfo(nazwa, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, json.dumps(man, indent=2, ensure_ascii=False).encode() if zrodlo is None else zrodlo.read_bytes())
    if klucz:
        try:
            os.chmod(cel, 0o600)
        except OSError:
            pass
    print(f"✅ {cel} ({cel.stat().st_size} B) — serwery: {', '.join(wybrane)}; narzędzi: {len(man['tools'])}")
    print("   Claude Desktop: Ustawienia → Rozszerzenia → zainstaluj z pliku"
          + (" (jeśli masz już „Lex Machina”, najpierw ją odinstaluj)" if klucz else ""))
    if klucz:
        print("   ⛔ Plik OSOBISTY: zawiera Twój token CEIDG (a w nim PESEL). Nie udostępniaj, nie wrzucaj do repozytorium.")
    return 0


def main():
    ap = argparse.ArgumentParser(description="Serwery MCP Lex Machina z audyt-systemu-v4/mcp-servers.")
    ap.add_argument("--serwery", nargs="+", help="numery z --lista, nazwy albo „wszystkie”")
    ap.add_argument("--lista", action="store_true", help="pokaż listę wyboru serwerów i zakończ")
    ap.add_argument("--ceidg-klucz", help="odradzane (historia powłoki) — użyj --ceidg-klucz-plik")
    ap.add_argument("--ceidg-klucz-plik", help="plik z tokenem CEIDG (jedna linia)")
    ap.add_argument("--ceidg-test", action="store_true", help="sprawdź klucz CEIDG na żywym API i zakończ")
    ap.add_argument("--bez-pytan", action="store_true", help="nie pytaj o klucz CEIDG w terminalu")
    ap.add_argument("--scal-desktop", action="store_true")
    ap.add_argument("--sprawdz", action="store_true", help="tylko handshake MCP (CI)")
    ap.add_argument("--cel", default=str(TU), help="gdzie zapisać mcp-config.json")
    ap.add_argument("--diagnoza", action="store_true", help="czy ta maszyna ma Claude Desktop (kod 0 = tak, 3 = nie)")
    ap.add_argument("--mcpb", metavar="KATALOG", help="zbuduj lex-machina.mcpb w KATALOGU i zakończ")
    a = ap.parse_args()
    if a.lista:
        print(lista_wyboru()); return 0
    a.serwery = rozwin_wybor(a.serwery)
    if a.diagnoza:
        return diagnoza()
    if a.mcpb:
        kl = ceidg_klucz(a, pytaj=False) if (a.ceidg_klucz_plik or a.ceidg_klucz) else None
        if kl:
            print("CEIDG: " + ceidg_opis_klucza(kl))
            if ceidg_test(kl) == 1:
                return 1
        elif a.serwery is None or "ceidg" in a.serwery:
            print(f"ℹ️ Klucz CEIDG wpiszesz w Claude Desktop w polu „Klucz API CEIDG”. Skąd go wziąć: {CEIDG_LINK}")
        return zbuduj_mcpb(a.mcpb, a.serwery, kl)
    klucz = ceidg_klucz(a, pytaj=not (a.bez_pytan or a.sprawdz) and (a.serwery is None or "ceidg" in (a.serwery or [])))
    if a.ceidg_test:
        if not klucz:
            print(f"⛔ Brak klucza CEIDG. Uzyskasz go tu: {CEIDG_LINK}"); return 1
        print(ceidg_opis_klucza(klucz)); return ceidg_test(klucz)
    if klucz:
        print("CEIDG: " + ceidg_opis_klucza(klucz))
    if not PAKIET.is_file():
        raise SystemExit(f"⛔ Brak {PAKIET} — uruchom zbuduj_pakiet.py.")
    nd = node()
    wybrane = a.serwery or [s for s in SERWERY if s not in WYMAGA_KLUCZA or klucz]
    env_wsp = {k: os.environ[k] for k in ZMIENNE if os.environ.get(k)}
    wpisy, bledy = {}, []
    for s in wybrane:
        env = dict(env_wsp)
        if s in WYMAGA_KLUCZA:
            if not klucz and not a.sprawdz:
                print(f"⚠️ {s}: brak klucza — pomijam. Klucz uzyskasz tu: {CEIDG_LINK} "
                      f"(potem: --scal-desktop --serwery ceidg --ceidg-klucz-plik PLIK)"); continue
            if klucz:
                env[WYMAGA_KLUCZA[s]] = klucz
        narz = handshake(nd, s, env)
        if not narz:
            bledy.append(s); print(f"⛔ {PREFIKS}{s}: brak odpowiedzi na tools/list"); continue
        print(f"✅ {PREFIKS}{s}: {', '.join(narz)}")
        w = {"command": nd, "args": [str(PAKIET), s]}
        if env:
            w["env"] = env
        wpisy[PREFIKS + s] = w
    if a.sprawdz:
        return 1 if bledy else 0

    z_kluczem = any(WYMAGA_KLUCZA["ceidg"] in w.get("env", {}) for w in wpisy.values())
    # ⛔ F-214: konfiguracja z tokenem NIE może trafić do katalogu skilla (repozytorium publiczne)
    cel = Path(a.cel) if (a.cel != str(TU) or not z_kluczem) else KATALOG_PRYWATNY
    cfg = cel / "mcp-config.json"
    zapisz_prywatnie(cfg, json.dumps({"mcpServers": wpisy}, indent=2, ensure_ascii=False) + "\n")
    print(f"✅ {cfg}" + (" (zawiera token CEIDG — uprawnienia 600, poza repozytorium)" if z_kluczem else ""))
    if a.scal_desktop and wpisy:
        p = plik_desktop(); dane = {}
        if p.is_file():
            kopia = p.with_suffix(".json.kopia-przed-lex"); shutil.copy2(p, kopia)
            print(f"✅ kopia zapasowa: {kopia}")
            dane = json.loads(p.read_text(encoding="utf-8") or "{}")
        dane.setdefault("mcpServers", {}).update(wpisy)
        p.parent.mkdir(parents=True, exist_ok=True)
        zapisz_prywatnie(p, json.dumps(dane, indent=2, ensure_ascii=False) + "\n")
        print(f"✅ dopisano {len(wpisy)} serwerów do {p} — zrestartuj Claude Desktop.")
    print("\nClaude Code bez pluginu / za proxy (zakres user):")
    for n, w in wpisy.items():
        e = " ".join(f'-e {k}="$(cat PLIK_Z_TOKENEM)"' if k == WYMAGA_KLUCZA["ceidg"] else f'-e {k}="{v}"'
                     for k, v in w.get("env", {}).items())
        print(f'  claude mcp add --scope user {e + " " if e else ""}{n} -- "{w["command"]}" "{w["args"][0]}" {w["args"][1]}')
    print("Kontrola w rozmowie: narzędzia mcp__lex-<serwer>__<narzędzie>.")
    return 1 if bledy else 0


if __name__ == "__main__":
    sys.exit(main())
