Instalacja — Lex Machina
Instrukcja krok po kroku dla systemu Lex Machina w Claude AI.

Wymagania wstępne

Zalecane jest konto Claude AI na claude.ai z planem Free, Pro lub Team
(skille użytkownika wymagają planu płatnego, do prostych zapytań darmowe)
Dostęp do repozytorium: https://github.com/michaleiatrak-star/Lex-Machina
Przeglądarka internetowa — brak instalacji oprogramowania


Krok 1 — Pobierz repozytorium
Pobierz całe repozytorium jako ZIP:
GitHub → zielony przycisk Code → Download ZIP
Rozpakuj ZIP w dowolnym miejscu na komputerze. Otrzymasz katalog Lex-Machina/ z podkatalogami skilli.
Alternatywnie, jeśli używasz git:
bashgit clone https://github.com/michaleiatrak-star/Lex-Machina.git

Krok 2 — Wgraj skille do Claude AI
Każdy katalog w repozytorium to osobny skill. Skille wgrywa się jeden po drugim przez interfejs Claude AI.
Jak wgrać pojedynczy skill

Otwórz claude.ai i zaloguj się
Kliknij Customize (lub Dostosuj) w lewym panelu bocznym
Kliknij Nowy skill (lub New skill)
Wybierz Wgraj skill z komputera (lub Upload skill from computer)
Wskaż folder skilla (np. Lex-Machina/prawny-router-v3/)
Potwierdź — skill pojawi się na liście aktywnych skilli


⚠️ Wskazujesz cały folder skilla, nie pojedynczy plik SKILL.md.

Kolejność wgrywania (ważna!)
Wgraj skille w podanej kolejności — niektóre skille wykonawcze odwołują się do shared/ i routera:
Etap 1 — Biblioteka współdzielona (obowiązkowa)
shared/
Etap 2 — Warstwa routingu (obowiązkowa)
prawo-polskie-v2/
prawny-router-v3/
Etap 3 — Dziedzinowe moduły prawne DR (wgraj wszystkie)
dr-01-ustroj-konstytucyjny-i-zrodla-prawa/
dr-02-prawo-cywilne-rodzinne-gospodarcze/
dr-03-prawo-karne-wykroczenia-egzekucja/
dr-04-prawo-pracy-zus-swiadczenia/
dr-05-prawo-administracyjne-sadowoadministracyjne/
dr-06-podatki-finanse-publiczne-aml/
dr-07-zamowienia-publiczne-fundusze-ue/
dr-08-samorzad-terytorialny-prawo-lokalne/
dr-09-budownictwo-srodowisko-energia-transport/
dr-10-zdrowie-farmacja-zywnosc-rolnictwo/
dr-11-cyfrowe-cyber-ai-dane-ip/
dr-12-sadownictwo-prokuratura-zawody-prawnicze/
dr-13-sluzby-bezpieczenstwo-informacje-niejawne/
dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka/
dr-15-compliance-iso-governance-audyt/
dr-16-pisma-strategia-dowody-orzecznictwo/
Etap 4 — Skille wykonawcze (wgraj te, których potrzebujesz)
przewodnik-prawny-v2/          ← zalecany dla wszystkich; punkt wejścia dla laika
pisma-procesowe-v3/            ← pozwy, apelacje, odpowiedzi na pozew
pisma-proste-v2/               ← sprzeciw od nakazu, wezwanie do zapłaty, klauzula
analizator-umow-v1/            ← analiza i redakcja umów
analizator-dowodow-v3/         ← ocena dowodów procesowych
analizator-przepisow-v2/       ← analiza artykułów i przepisów
orzeczenia-sadowe-v2/          ← wyszukiwanie orzeczeń
analiza-sadowa-v6/             ← pełna analiza sprawy (tryb zaawansowany)
chronologia-sprawy-v1/         ← oś czasu zdarzeń prawnych
przesluchanie-swiadkow-v2-min90/  ← pytania do świadków, kontrprzesłuchanie
raport-sytuacyjny-v2/          ← interaktywny raport ryzyk
raport-klienta-v1/             ← raport statusu sprawy dla klienta
Etap 5 — Narzędzie systemowe (opcjonalne, dla administratorów)
audyt-systemu-v4/              ← audyt jakości i aktualności systemu

Krok 3 — Skonfiguruj User Preferences
To kluczowy krok. Bez tej konfiguracji router nie uruchomi się automatycznie.

W Claude AI kliknij ikonę swojego konta (prawy górny róg) → Settings (lub Ustawienia)
Przejdź do sekcji User Preferences (lub Preferencje użytkownika)
Wpisz dokładnie poniższy tekst:

Prawo PL: router→v3 pierwszy, ISAP każdy przepis, HYBRID-VAL przed .docx. Karne: +kwalifikator.

Zapisz.

Co oznaczają te preferencje
FragmentZnaczenierouter→v3 pierwszyprawny-router-v3 jest wczytywany jako pierwszy skill w każdej sprawie prawnejISAP każdy przepisKażdy przepis musi być zweryfikowany w isap.sejm.gov.pl przed powołaniemHYBRID-VAL przed .docxWalidacja hybrydowa uruchamiana przed wygenerowaniem dokumentu WordKarne: +kwalifikatorW sprawach karnych zawsze ładowany moduł kwalifikatora karnomaterialnego

Krok 4 — Weryfikacja instalacji
Otwórz nową rozmowę w Claude AI i napisz:
Mam sprawę prawną. Od czego zacząć?
Poprawnie skonfigurowany system powinien:

Uruchomić prawny-router-v3 (możesz zobaczyć odwołanie do routera w myśleniu modelu)
Zadać pytania o charakter sprawy
Zaproponować dalszy krok przez przewodnik-prawny-v2

Jeśli Claude odpowiada ogólnie bez odwołania do skilli — sprawdź czy User Preferences zostały zapisane poprawnie (Krok 3).

Aktualizacja skilli
Gdy w repozytorium pojawi się nowa wersja skilla:

Pobierz zaktualizowane repozytorium (lub git pull)
W Claude AI → Customize → znajdź skill na liście → Edytuj lub Zastąp
Wgraj nową wersję folderu


Zmiany w shared/AKTY-PRAWNE-MASTER.md i mapach Dz.U. nie wymagają ponownego wgrywania wszystkich skilli — wystarczy zaktualizować skill shared/.


Rozwiązywanie problemów
Claude nie używa routera
Sprawdź User Preferences — tekst musi być wpisany dokładnie. Upewnij się, że prawny-router-v3 jest na liście aktywnych skilli.
Skill nie pojawia się po wgraniu
Upewnij się, że wskazałeś folder (np. prawny-router-v3/), a nie plik SKILL.md. Claude AI wymaga całego folderu.
Claude cytuje przepisy bez weryfikacji
To naruszenie HARDGATE. Napisz: przypomnij sobie zasady HARDGATE — system powinien się zresetować. Jeśli problem się powtarza, sprawdź czy skill shared/ zawiera plik PRAWO-HARDGATE.md.
Błąd "description too long"
Jeden ze skilli przekracza limit 1024 znaków w polu description. Uruchom audyt: przeprowadź audyt systemu — wykryje i wskaże winny skill.

Minimalna instalacja (wersja uproszczona)
Jeśli nie potrzebujesz pełnego systemu, minimum do działania to:
shared/
prawo-polskie-v2/
prawny-router-v3/
przewodnik-prawny-v2/
+ dowolny skill wykonawczy (np. pisma-procesowe-v3/)
+ dziedzinowe DR-skills odpowiednie do Twojej sprawy
Bez skilli DR system nie będzie mógł zidentyfikować właściwych przepisów dla Twojej dziedziny.

Kontakt i zgłaszanie błędów
Błędy i sugestie zgłaszaj przez Issues w repozytorium:
https://github.com/michaleiatrak-star/Lex-Machina/issues
