# Dodawanie kolejnej ustawy do Lex-Machina

1. Ustal właściwy DR i istniejące moduły. Przeczytaj SKILL.md, mapę aktów,
   pokrycia i centralny ROUTING-MAP; unikaj drugiej sprzecznej kopii reguł.
2. Pobierz z oficjalnego ELI metadane aktu, PDF bieżącego t.j., relacje aktu
   pierwotnego oraz właściwe nowelizacje. Zachowaj strony obwieszczenia,
   przypisy i przepisy przejściowe; data publikacji nie jest stanem prawnym.
3. Zapisz SHA-256, daty i pochodzenie w references/ oraz wpis w `references/REJESTR-ZRODEL.json`.
   Bieżące t.j. tylko jako snapshot czytnika; akty pomocnicze (tekst pierwotny, poprzednie t.j.,
   nowelizacje) wyłącznie jako wskaźnik ELI + sha256 + strony na liście RAG. Nie wkładaj do skilla
   PDF-ów tych aktów i nie linkuj do nich z modułów.
   W razie indeksów górnych skontroluj ekstrakcję z PDF. Nie utożsamiaj
   art. 491¹⁴ z art. 49114. Pominięte/uchylone grupy pozostaw jawne.
4. Dodaj parser/czytnik ze sprawdzeniem integralności, dokładnymi granicami
   artykułów i stroną źródła. Nie dostosowuj oczekiwanej liczby artykułów
   do błędnego parsera. Zweryfikuj wszystkie nagłówki niezależnym odczytem.
5. Opracuj procedury według instytucji: przesłanki, dowody, organ,
   dokumenty, terminy i ich początek, decyzje, kontrola i następstwa.
   Każdy nagłówek powiąż z procedurą i pełnym źródłem. Odesłania do innych
   aktów wymagają własnej weryfikacji; numer bez nazwy aktu jest niejednoznaczny.
6. Jawnie oznacz źródło, procedurę i zakres komentarza. Pełny PDF nie
   uprawnia do oznaczenia pełnego niezależnego audytu merytorycznego.
7. Zarejestruj moduły w SKILL.md, MAPA-AKTOW.md, MAPA-POKRYCIA.md oraz
   prawo-polskie-v2/ROUTING-MAP.md. Uaktualnij licznik modułów, wersje
   SKILL/plugin, changelog, rejestr audytu i CHECKSUMS.sha256.
8. Sprawdź granice i integralność indeksu, kompletność routingu, zachowanie
   przy zmianie źródła/błędzie sieci oraz rzeczywiste scenariusze prawne.
   Uruchom checkery rejestracji/licznika/manifestów/map repozytorium.
9. Przebuduj odpowiednie nieversionowane ZIP-y w WERSJA ROZWOJOWA.
   `scripts/verify_development_archives.py` z korzenia repo sprawdza ich
   bajtową zgodność z rozpakowaną wersją. Wersji stabilnej nie nadpisuj
   przypadkowo jako części prac nad linią rozwojową.

W tej dostawie wzorcem jest scripts/prrestr.py i rejestr scripts/insolvency.py.
Nowa ustawa wymaga własnej granicy początku tekstu, metryki, kontroli parsera
oraz mapy procedur; samo dopisanie jej skrótu nie wystarczy.
