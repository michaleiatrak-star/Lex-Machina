# KONEKTORY-REKOMENDOWANE.md
## MCP-INTEGRACJA.md — konkretne projekty OSS do podłączenia (zamiast pisania od zera)

> Ten plik jest rejestrem **rekomendacji infrastrukturalnych dla developera**, nie
> kodem wykonywalnym przez Claude. Weryfikacja aktualności linków/licencji/API —
> obowiązek developera przed wdrożeniem produkcyjnym (te projekty rozwijają się
> niezależnie od tego systemu skilli).

## Dlaczego integracja, nie budowa od zera

Audyt komercyjny (2026-07-13) wskazał, że polski ekosystem MCP dla prawa jest już
częściowo zbudowany i utrzymywany (m.in. przez MateMatic, na licencji MIT dla
samych connectorów). Budowanie własnych connectorów od zera dla ISAP/SAOS/CBOSA
oznaczałoby duplikowanie pracy, którą społeczność już wykonała i utrzymuje —
a jednocześnie systemowi zależy na deterministycznym, aktualnym dostępie do źródeł,
nie na posiadaniu własnego kodu integracyjnego jako takiego.

## Tabela: typ zapytania → rekomendowany connector

| Typ zapytania w systemie | Connector (kategoria funkcjonalna) | Źródło danych | Licencja typowa w tej kategorii |
|---|---|---|---|
| Numer/status/tekst jednolity ustawy, Dz.U./M.P. | MCP server dla Sejm ELI API (Dziennik Ustaw + Monitor Polski) | api.sejm.gov.pl (ELI) | MIT (typowo) |
| Orzecznictwo sądów powszechnych (SO/SA/SN — szeroka baza) | MCP server dla SAOS | orzeczenia.ms.gov.pl / SAOS | MIT (typowo) |
| Orzecznictwo NSA + 16 WSA (administracyjne, podatkowe, RODO) | MCP server dla CBOSA | orzeczenia.nsa.gov.pl (CBOSA) | MIT (typowo) |
| Orzecznictwo KIO (zamówienia publiczne) | MCP server dla bazy KIO | orzeczenia.uzp.gov.pl | Apache-2.0 (typowo) |
| Prawo UE (rozporządzenia/dyrektywy/CELEX/orzeczenia TSUE) | MCP server dla CELLAR/EUR-Lex | eur-lex.europa.eu | MIT (typowo) |
| Status podmiotu (spółka/organ) — używane przez PODMIOT-GATE routera | MCP server dla KRS | KRS (dane rejestrowe) | MIT (typowo) |
| Weryfikacja sygnatury wyroku (czy istnieje, sąd, data) bez pełnej treści | Deterministyczny weryfikator sygnatur (no-LLM, lookup) | SAOS | zależnie od projektu |

## Zasady podłączenia (dla developera portalu)

1. **Każdy connector osobno, nie jeden monolit** — jeśli jeden serwer padnie
   (np. CBOSA niedostępne), reszta ma działać. KROK 1 tego skilla wykrywa
   dostępność per narzędzie, nie per "cała warstwa MCP".
2. **Read-only** — żaden z tych connectorów nie powinien mieć uprawnień zapisu do
   źródeł rządowych (nie dotyczy — to i tak bazy tylko-do-odczytu publicznie), ale
   zasada dotyczy też ew. cache'a: connector może cache'ować odpowiedzi, ale musi
   mieć TTL i nigdy nie serwować danych starszych niż podana data bez ostrzeżenia.
3. **Zwracany schemat** — connector powinien zwracać strukturę zgodną z
   `shared/SCHEMAT-ODPOWIEDZI-MCP.md`, żeby KROK 2 protokołu w MCP-INTEGRACJA.md mógł
   jednoznacznie sklasyfikować wynik jako FOUND/NOT_FOUND/AMBIGUOUS.
4. **Wersjonowanie API rządowych** — Sejm ELI, SAOS i CBOSA to publiczne API bez
   SLA — connector musi mieć własną obsługę timeoutów/retry, żeby KROK 1/3 tego
   skilla mogły poprawnie zakwalifikować "MCP niedostępne" zamiast zawieszać
   rozmowę.
5. **Zgodność z tajemnicą zawodową** — dane samej sprawy klienta (fakty, dokumenty)
   nigdy nie powinny być wysyłane do tych connectorów jako parametr zapytania —
   connectory służą wyłącznie do weryfikacji STANU PRAWNEGO (numer aktu, treść
   przepisu, istnienie orzeczenia), nie do przetwarzania danych sprawy.

## Uwaga o utrzymaniu

Ten system skilli nie jest właścicielem ani opiekunem żadnego z powyższych
connectorów — to niezależne projekty open source. Developer wdrażający tę
rekomendację odpowiada za: (a) wybór konkretnego repozytorium/forka, (b) audyt
bezpieczeństwa i licencji przed wdrożeniem produkcyjnym, (c) monitoring
dostępności. `MCP-INTEGRACJA.md` odpowiada wyłącznie za protokół integracji
po stronie skilli (SKILL.md), nie za same serwery.
