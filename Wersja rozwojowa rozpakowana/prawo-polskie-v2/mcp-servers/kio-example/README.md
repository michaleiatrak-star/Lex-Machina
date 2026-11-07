# kio-example — orzeczenia KIO i sądów zamówień publicznych (wyszukiwarka UZP)

Źródło: `https://orzeczenia.uzp.gov.pl`. Strona `GET /Home/Search` nie zawiera wyników — portal pobiera je
przez `POST /Home/GetResults` (formularz `Phrase`, `Fle`, `SCnt`, `Sign`, `Dt`, `Kind`, `Pg`, `CountStats`).
`Sign` filtruje dokładnie (zmierzone 2026-10-02: „KIO 82/18” → 1, „KIO 99999/18” → 0). Treść:
`/Home/ContentHtml/{id}`, metryka: `/Home/Details/{id}`, PDF: `/Home/PdfContent/{id}`.

| Narzędzie | Co robi |
|---|---|
| `kio_szukaj` | fraza (z odmianą, w treści), sygnatura, zakres dat, organ (KIO/SO/SA/SN) → kandydaci |
| `kio_sprawdz_sygnature` | dokładne dopasowanie, także w sprawach łączonych („KIO 2304/23\|KIO 2306/23”) |
| `kio_pobierz` | metryka (rozstrzygnięcie, przewodniczący, zamawiający, tryb, przepisy Pzp, zagadnienia) + treść porcjami |
| `kio_kontrola_sadowa` | wyroki/postanowienia sądu na skargę na orzeczenie KIO (art. 579 ust. 1, art. 580 ust. 1 Pzp) — potwierdzane polem metryki „Sygnatura KIO” |

Zasady: orzeczenie KIO to materiał orzeczniczy (R2A), nie źródło prawa — przepis Pzp przez ELI. Brak trafienia
= OUT_OF_SCOPE (baza UZP nie jest kompletna). Data w źródle bywa błędna (KIO 4983/25: „7 grudnia 2026” w metryce
i treści, pomiar 2026-10-02) — narzędzie dodaje `ostrzezenie_daty`. SAOS ma KIO tylko do 6.09.2018.

Testy: `node test_normalizacja.mjs` (offline, fragmenty prawdziwych odpowiedzi); `node ../test_protokol.mjs`;
`LEX_TYLKO="^KIO" node ../test_na_zywo.mjs`; `LEX_POMIN="^(?!KIO)" node ../test_poprawnosci.mjs`.
