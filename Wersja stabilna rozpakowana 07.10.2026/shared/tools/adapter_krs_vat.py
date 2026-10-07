#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""adapter_krs_vat.py — własny adapter KRS + Biała lista VAT (F-204).

Odczyt dwóch rejestrów publicznych, bez klucza API:
  - KRS: api-krs.ms.gov.pl/api/krs/{OdpisAktualny|OdpisPelny}/{nr}?rejestr=P|S&format=json
  - WL (Biała lista VAT): wl-api.mf.gov.pl/api/search/nip/{NIP}?date=RRRR-MM-DD
    (warianty: /bank-account/{26 cyfr}, /nip-bank-account/{NIP}/{26 cyfr})

Ten plik NIE jest źródłem prawa — jest kanałem odczytu rejestru. Interpretacja
skutków prawnych (np. art. 117ba Ordynacji podatkowej i art. 15d ustawy o CIT
dla białej listy) zostaje po stronie modułów merytorycznych (PRAWO-HARDGATE);
adapter zwraca fakty z rejestru, nigdy kwalifikację prawną.

Wpięcie: shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md (elementy E01-E05, F01-F06)
i shared/DOSTEP-MASZYNOWY-API.md §4. Kontrakt endpointów ustalony tam wcześniej
(F-157b/F-152); DOKŁADNY SCHEMAT JSON poniżej zmierzony live w tej sesji
(2026-09-26, patrz STATUS ŹRÓDEŁ niżej) — pierwszy raz udokumentowany jako kod,
nie tylko jako opis endpointu.

STATUS ŹRÓDEŁ (ZASADA 14 / AUDIT-CLAIM-GATE — stan na 2026-09-26):
  - KRS: ✅ [VER: live, api-krs.ms.gov.pl, sesja 2026-09-26] — GET OdpisAktualny
    dla KRS 0000010681 zwrócił HTTP 200 z pełnym, poprawnym JSON (ORANGE POLSKA
    SPÓŁKA AKCYJNA; NIP 5260250995, REGON 01210078400000 — zgodne z przykładem
    już zapisanym dla WL w DOSTEP-MASZYNOWY-API.md, co jest niezależnym
    potwierdzeniem krzyżowym tego samego podmiotu z dwóch różnych rejestrów).
    Numer nieistniejący (0000000001) → HTTP 404, RFC7807 problem+json
    (`{"type":..., "title":"Not Found", "status":404, "traceId":...}`).
    Schemat `dzial1`/`dzial2` niżej odzwierciedla dokładnie tę odpowiedź.
  - WL: ⚠️ [NIEWERYFIKOWANE — HIPOTEZA, z zastrzeżeniem] — schemat pól
    (`result.subject.*`) przejęty z opisu w DOSTEP-MASZYNOWY-API.md §4, KTÓRY
    SAM deklaruje pomiar end-to-end (ta sama para NIP/REGON co wyżej). NIE
    zmierzony PONOWNIE w tej sesji: `wl-api.mf.gov.pl` zwrócił z tego środowiska
    HTTP 200 ze stroną wyzwania Incapsula (JS challenge; nagłówek `x-iinfo`,
    ciasteczko `visid_incap_*`) niezależnie od User-Agent/Accept/Referer
    (4 warianty próbowane, wszystkie zablokowane identycznie). Obserwowany
    OBJAW: blokada WAF na poziomie egress tej sesji, NIE dowód na niedostępność
    hosta w ogóle — ten sam host był zmierzony jako osiągalny z innego
    środowiska. Reprodukcja: `curl -sI https://wl-api.mf.gov.pl/api/search/nip/5260250995?date=RRRR-MM-DD`
    → nagłówek `x-iinfo` obecny = blokada; brak tego nagłówka = przejście.

Transport przez wstrzykiwaną funkcję (`transport`), domyślnie urllib.request
(stdlib, bez zależności zewnętrznych — konwencja z eli_art_extract.py).
Testy offline podstawiają fałszywy transport (shared/tools/test_adapter_krs_vat.py);
sonda live wymaga sieci (LEX_LIVE=1).

Statusy zwracane: FOUND / NOT_FOUND / INVALID_INPUT / ERROR — nigdy nie
awansują same z siebie do statusu prawnego weryfikacji (np. ✅ [VER]); to
wykonuje wywołujący moduł, po ocenie roli tego odczytu w łańcuchu dowodowym
(shared/WERYFIKACJA-SLAD.md).
"""

from __future__ import annotations

import argparse
import datetime
import json
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Callable, Optional, Tuple

KRS_BASE = "https://api-krs.ms.gov.pl/api/krs"
WL_BASE = "https://wl-api.mf.gov.pl/api/search"

# ⚠️ Neutralny UA wg shared/PRAWO-HARDGATE.md „KANAŁ KODU MA WŁASNE WYMOGI":
# niektóre hosty rządowe blokują UA udający pełny łańcuch przeglądarki
# silniej niż uczciwe przedstawienie się jako skrypt. Zmierzone dla KRS
# (2026-09-26): domyślny UA urllib przechodzi bez problemu.
USER_AGENT = "LexMachina-Adapter/1.0 (+shared/tools/adapter_krs_vat.py)"

WL_DAILY_LIMIT = 100
# ⚠️ Limit dobowy białej listy VAT bez klucza — DOSTEP-MASZYNOWY-API.md §4.
# Ten moduł liczy wywołania W RAMACH JEDNEGO PROCESU (LicznikWL); nie ma
# licznika trwałego między procesami/dniami. API nie zwraca nagłówka z
# pozostałym limitem, więc to ostrzeżenie procesowe, nie potwierdzenie
# stanu serwera.

Transport = Callable[[str], Tuple[int, bytes]]


class WLDailyLimitReached(RuntimeError):
    """Podniesione, gdy lokalny licznik wywołań WL przekroczy limit dobowy."""


@dataclass
class WynikRejestru:
    status: str  # FOUND | NOT_FOUND | INVALID_INPUT | ERROR
    zrodlo: str  # "KRS" | "WL"
    dane: dict = field(default_factory=dict)
    surowa_odpowiedz: Optional[dict] = None
    uwagi: list = field(default_factory=list)

    def as_dict(self) -> dict:
        return {
            "status": self.status,
            "zrodlo": self.zrodlo,
            "dane": self.dane,
            "uwagi": self.uwagi,
        }


def _default_transport(url: str, timeout: float = 15.0) -> Tuple[int, bytes]:
    """Domyślny transport — urllib.request, stdlib. Zwraca (kod_http, cialo)."""
    req = urllib.request.Request(
        url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except urllib.error.URLError as e:
        raise ConnectionError(f"brak połączenia z {url}: {e}") from e


def waliduj_nip(nip: str) -> bool:
    """Suma kontrolna NIP: wagi 6,5,7,2,3,4,5,6,7 na pierwszych 9 cyfrach,
    suma mod 11 = 10. cyfra kontrolna. mod 11 == 10 → NIP niepoprawny
    strukturalnie (nie ma takiego prawidłowego NIP).

    To jest algorytm techniczny struktury numeru (jego jedyna publicznie
    znana definicja to sam wzór sumy kontrolnej) — sprawdzenie POPRAWNOŚCI
    FORMALNEJ numeru, nie twierdzenie o stanie prawnym podmiotu. Nie wymaga
    bramki PRAWO-HARDGATE.
    """
    cyfry = re.sub(r"\D", "", nip or "")
    if len(cyfry) != 10:
        return False
    wagi = (6, 5, 7, 2, 3, 4, 5, 6, 7)
    suma = sum(w * int(c) for w, c in zip(wagi, cyfry[:9]))
    kontrolna = suma % 11
    if kontrolna == 10:
        return False
    return kontrolna == int(cyfry[9])


def waliduj_krs(numer: str) -> Optional[str]:
    """Dopełnia numer KRS zerami do 10 cyfr. None, jeśli wejście nie jest
    parsowalne jako numer (puste, nie same cyfry, więcej niż 10 cyfr)."""
    cyfry = re.sub(r"\D", "", numer or "")
    if not cyfry or len(cyfry) > 10:
        return None
    return cyfry.zfill(10)


def zapytaj_krs(
    numer: str,
    *,
    rejestr: str = "P",
    odpis: str = "Aktualny",
    transport: Transport = _default_transport,
) -> WynikRejestru:
    """Odpis KRS. `odpis="Aktualny"` domyślnie; `"Pelny"` bywa dużo dłuższy
    (pełna historia wpisów) — zob. DOSTEP-MASZYNOWY-API.md §4."""
    numer_norm = waliduj_krs(numer)
    if numer_norm is None:
        return WynikRejestru(
            "INVALID_INPUT", "KRS", uwagi=[f"numer KRS nieparsowalny: {numer!r}"]
        )
    if odpis not in ("Aktualny", "Pelny"):
        return WynikRejestru(
            "INVALID_INPUT", "KRS", uwagi=[f"odpis musi być Aktualny/Pelny, nie {odpis!r}"]
        )
    if rejestr not in ("P", "S"):
        return WynikRejestru(
            "INVALID_INPUT", "KRS", uwagi=[f"rejestr musi być P/S, nie {rejestr!r}"]
        )

    url = f"{KRS_BASE}/Odpis{odpis}/{numer_norm}?rejestr={rejestr}&format=json"
    try:
        kod, cialo = transport(url)
    except ConnectionError as e:
        return WynikRejestru("ERROR", "KRS", uwagi=[str(e)])

    if kod == 404:
        return WynikRejestru(
            "NOT_FOUND", "KRS",
            uwagi=[f"KRS {numer_norm} nie istnieje w rejestrze {rejestr}"],
        )
    if kod != 200:
        return WynikRejestru(
            "ERROR", "KRS", uwagi=[f"HTTP {kod}"], surowa_odpowiedz=_bezpieczny_json(cialo)
        )

    try:
        dane = json.loads(cialo)
    except json.JSONDecodeError as e:
        return WynikRejestru("ERROR", "KRS", uwagi=[f"odpowiedź nie jest poprawnym JSON: {e}"])

    uwagi = [
        "odpis JSON jest zanonimizowany względem PDF (inicjały nazwisk, część "
        "PESEL) — DOSTEP-MASZYNOWY-API.md §4; do pełnej reprezentacji użyj odpisu PDF"
    ]
    return WynikRejestru(
        "FOUND", "KRS", dane=_wyciagnij_krs(dane), surowa_odpowiedz=dane, uwagi=uwagi
    )


def _wyciagnij_krs(dane: dict) -> dict:
    """Wyciąga pola najczęściej potrzebne przy identyfikacji strony (E01-E05
    w MOD-IDENTYFIKACJA-STRONY-UMOWY.md: nazwa, NIP, KRS, adres, reprezentacja).
    Schemat zmierzony live 2026-09-26 (KRS 0000010681) — zob. STATUS ŹRÓDEŁ
    w nagłówku pliku. Odporne na brakujące gałęzie (np. dzial2 może nie mieć
    `reprezentacja`, jeśli podmiot ma inny ustrój organów)."""
    odpis = dane.get("odpis", {})
    naglowek = odpis.get("naglowekA", {})
    dzialy = odpis.get("dane", {})
    dzial1 = dzialy.get("dzial1", {})
    dzial2 = dzialy.get("dzial2", {})
    podmiot = dzial1.get("danePodmiotu", {})
    adres = dzial1.get("siedzibaIAdres", {})
    reprezentacja = dzial2.get("reprezentacja", {})

    return {
        "numer_krs": naglowek.get("numerKRS"),
        "rejestr": naglowek.get("rejestr"),
        "stan_z_dnia": naglowek.get("stanZDnia"),
        "data_rejestracji_w_krs": naglowek.get("dataRejestracjiWKRS"),
        "nazwa": podmiot.get("nazwa"),
        "forma_prawna": podmiot.get("formaPrawna"),
        "nip": (podmiot.get("identyfikatory") or {}).get("nip"),
        "regon": (podmiot.get("identyfikatory") or {}).get("regon"),
        "siedziba": (adres.get("siedziba") or {}).get("miejscowosc"),
        "adres": adres.get("adres"),
        "sposob_reprezentacji": reprezentacja.get("sposobReprezentacji"),
        "sklad_organu": [
            {
                "funkcja": osoba.get("funkcjaWOrganie"),
                "zawieszony": osoba.get("czyZawieszona"),
            }
            for osoba in (reprezentacja.get("sklad") or [])
        ],
    }


def zapytaj_wl(
    nip: str,
    *,
    data: Optional[str] = None,
    rachunek: Optional[str] = None,
    transport: Transport = _default_transport,
    licznik: Optional["LicznikWL"] = None,
) -> WynikRejestru:
    """Biała lista VAT. `data` jest OBOWIĄZKOWA — dzień, na który wykaz jest
    odpytywany. Przy kontroli płatności ma być datą TRANSAKCJI, nie dniem
    dzisiejszym (DOSTEP-MASZYNOWY-API.md §4: to ta data rozstrzyga o skutkach
    z art. 117ba Ordynacji podatkowej i art. 15d ustawy o CIT — podstawy
    prawne sprawdź w ELI, nie w tym pliku). Ta funkcja świadomie NIE zgaduje
    daty domyślnej, żeby wywołujący nie podstawił dziś zamiast daty transakcji
    przez przeoczenie."""
    cyfry_nip = re.sub(r"\D", "", nip or "")
    if not waliduj_nip(cyfry_nip):
        return WynikRejestru(
            "INVALID_INPUT", "WL", uwagi=[f"NIP nie przechodzi sumy kontrolnej: {nip!r}"]
        )
    if not data:
        return WynikRejestru(
            "INVALID_INPUT", "WL",
            uwagi=["parametr `data` jest obowiązkowy (dzień odpytania wykazu, RRRR-MM-DD)"],
        )
    try:
        datetime.date.fromisoformat(data)
    except ValueError:
        return WynikRejestru("INVALID_INPUT", "WL", uwagi=[f"data musi być RRRR-MM-DD, nie {data!r}"])

    if rachunek is not None:
        cyfry_rachunek = re.sub(r"\D", "", rachunek)
        if len(cyfry_rachunek) != 26:
            return WynikRejestru(
                "INVALID_INPUT", "WL",
                uwagi=[f"numer rachunku musi mieć 26 cyfr, ma {len(cyfry_rachunek)}"],
            )
        rachunek = cyfry_rachunek

    if licznik is not None:
        licznik.zuzyj()

    if rachunek:
        url = f"{WL_BASE}/nip-bank-account/{cyfry_nip}/{rachunek}?date={data}"
    else:
        url = f"{WL_BASE}/nip/{cyfry_nip}?date={data}"

    try:
        kod, cialo = transport(url)
    except ConnectionError as e:
        return WynikRejestru("ERROR", "WL", uwagi=[str(e)])

    if kod == 400:
        tresc = _bezpieczny_json(cialo)
        kod_bledu = (tresc or {}).get("code")
        wiadomosc = (tresc or {}).get("message")
        return WynikRejestru(
            "INVALID_INPUT", "WL",
            uwagi=[f"HTTP 400 {kod_bledu or ''} {wiadomosc or ''}".strip()],
            surowa_odpowiedz=tresc,
        )
    if kod != 200:
        return WynikRejestru(
            "ERROR", "WL", uwagi=[f"HTTP {kod}"], surowa_odpowiedz=_bezpieczny_json(cialo)
        )

    try:
        dane = json.loads(cialo)
    except json.JSONDecodeError as e:
        return WynikRejestru(
            "ERROR", "WL",
            uwagi=[
                f"odpowiedź nie jest poprawnym JSON ({e}) — jeśli treść to strona "
                "HTML z nagłówkiem x-iinfo, to blokada WAF (Incapsula) na tym "
                "kanale sieciowym, nie brak podmiotu w rejestrze"
            ],
        )

    wynik = dane.get("result", {})
    podmiot = wynik.get("subject")
    if podmiot is None:
        return WynikRejestru(
            "NOT_FOUND", "WL", dane={"request_id": wynik.get("requestId")}, surowa_odpowiedz=dane
        )

    uwagi = [
        "requestId to dowód sprawdzenia — zapisz razem z datą w śladzie weryfikacji "
        "(shared/DOSTEP-MASZYNOWY-API.md §4, shared/WERYFIKACJA-SLAD.md)"
    ]
    return WynikRejestru(
        "FOUND",
        "WL",
        dane={
            "nazwa": podmiot.get("name"),
            "nip": podmiot.get("nip"),
            "regon": podmiot.get("regon"),
            "krs": podmiot.get("krs"),
            "status_vat": podmiot.get("statusVat"),
            "rachunki": podmiot.get("accountNumbers"),
            "reprezentanci": podmiot.get("representatives"),
            "request_id": wynik.get("requestId"),
        },
        surowa_odpowiedz=dane,
        uwagi=uwagi,
    )


def _bezpieczny_json(cialo: bytes) -> Optional[dict]:
    try:
        return json.loads(cialo)
    except Exception:
        return None


@dataclass
class LicznikWL:
    """Licznik wywołań WL w ramach JEDNEGO PROCESU — nie jest trwały między
    procesami ani dniami; portal wdrażający ten adapter w wielu procesach
    musi przenieść licznik na warstwę współdzieloną (Redis, plik, itp.),
    jeśli chce twardego egzekwowania limitu 100/dobę."""

    limit: int = WL_DAILY_LIMIT
    zuzyte: int = 0

    def zuzyj(self) -> None:
        self.zuzyte += 1
        if self.zuzyte > self.limit:
            raise WLDailyLimitReached(
                f"lokalny licznik przekroczył {self.limit} wywołań WL w tym procesie "
                "— serwer nie zwraca nagłówka z pozostałym limitem, to jest "
                "ostrzeżenie procesowe, nie potwierdzenie stanu API"
            )


def _cli() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="polecenie", required=True)

    p_krs = sub.add_parser("krs", help="odpis KRS")
    p_krs.add_argument("numer")
    p_krs.add_argument("--rejestr", default="P", choices=["P", "S"])
    p_krs.add_argument("--odpis", default="Aktualny", choices=["Aktualny", "Pelny"])

    p_wl = sub.add_parser("wl", help="biała lista VAT")
    p_wl.add_argument("nip")
    p_wl.add_argument(
        "--data", default=None,
        help="RRRR-MM-DD — data TRANSAKCJI przy kontroli płatności, nie dzień dzisiejszy",
    )
    p_wl.add_argument("--rachunek", default=None)

    args = parser.parse_args()

    if args.polecenie == "krs":
        wynik = zapytaj_krs(args.numer, rejestr=args.rejestr, odpis=args.odpis)
    else:
        if not args.data:
            print(
                "⛔ --data jest wymagana (dzień transakcji, nie dziś domyślnie) — "
                "patrz docstring zapytaj_wl", file=sys.stderr,
            )
            return 2
        wynik = zapytaj_wl(args.nip, data=args.data, rachunek=args.rachunek)

    print(json.dumps(wynik.as_dict(), ensure_ascii=False, indent=2))
    return 0 if wynik.status == "FOUND" else 1


if __name__ == "__main__":
    sys.exit(_cli())
