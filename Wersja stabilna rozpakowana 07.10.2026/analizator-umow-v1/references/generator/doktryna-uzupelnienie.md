# DOKTRYNA — uzupełnienie (open source/copyleft, wizerunek, notice&action, Polityka AI)
## Analizator Umów v1 · references/generator/ (wczytuj przy triggerach wskazanych niżej)

> Ten plik uzupełnia `mod-J9-ip-prawa-autorskie.md`, `mod-shared-ai-act.md` i
> `mod-shared-regulatory-horizon.md` o cztery zagadnienia doktrynalne, których
> te moduły nie obejmowały wprost. Wczytuj sekcję odpowiednią do triggera —
> nie całość naraz.

---

## D.1 OPEN SOURCE / KLAUZULA COPYLEFT — trigger: umowa IT z komponentami OSS,
## klauzula anty-copyleft, audyt kodu przed przeniesieniem praw

**Rozróżnienie fundamentalne:**
- **Licencje permisywne / non-copyleft** (MIT, BSD 2/3-Clause, Apache 2.0) —
  wymagają zachowania informacji o prawach autorskich twórcy pierwotnego, ale
  pozwalają na dystrybucję utworu pochodnego na własnych warunkach, bez
  obowiązku udostępniania zmodyfikowanego kodu źródłowego — bezpieczne do
  łączenia z kodem właścicielskim [VER przy użyciu].
- **Licencje z klauzulą copyleft** (GPL i pochodne) — każdy utwór pochodny
  (opracowanie w rozumieniu prawa autorskiego) musi być rozpowszechniany na
  tych samych warunkach licencyjnych. Konsekwencja kontraktowa: **twórca
  opracowania nie może** przenieść praw do opracowania na kontrahenta ani
  udzielić licencji na innych zasadach niż wynikające z licencji pierwotnej —
  umowa próbująca to zrobić jest w tym zakresie nieważna (działanie poza
  granicami zezwolenia udzielonego przez licencję copyleft).

**Klauzula anty-copyleft — essentialia:**
1. oświadczenie Wykonawcy o niewykorzystaniu w Utworze komponentów objętych
   licencją copyleft (lub — wariant łagodniejszy — o ujawnieniu wszystkich
   użytych komponentów open source wraz z ich licencjami, załącznik SBOM/lista
   komponentów);
2. zobowiązanie do uzyskania uprzedniej zgody Zamawiającego przed użyciem
   jakiejkolwiek nowej biblioteki OSS w trakcie realizacji umowy;
3. indemnifikacja — Wykonawca odpowiada za roszczenia osób trzecich wynikające
   z naruszenia warunków licencji OSS wbudowanych w dostarczone oprogramowanie;
4. wyłączenie z cappingu odpowiedzialności dla tej kategorii ryzyka (routing:
   `mod-shared-fallback-library.md` § odpowiedzialność — dopisz OSS do listy
   „ZAWSZE WYŁĄCZ Z OGRANICZENIA").

**Pułapka przy przeniesieniu praw autorskich (routing: `mod-J9-ip-prawa-autorskie.md`):**
jeśli Zamawiający wymaga pełnego przeniesienia praw majątkowych do Utworu
(art. 41 PrAut), a Utwór zawiera komponent copyleft — przeniesienie jest
**niewykonalne w tej części**. Zamiast przenoszenia praw do komponentu OSS,
umowa powinna: (a) wyłączyć komponenty OSS z zakresu przenoszonych praw,
(b) udzielić licencji na komponent OSS na warunkach jego pierwotnej licencji,
(c) przenieść prawa wyłącznie do kodu autorskiego Wykonawcy otaczającego
komponent OSS.

## D.2 WIZERUNEK A PRAWA AUTORSKIE — trigger: materiały szkoleniowe, marketing,
## kursy online, zdjęcia/nagrania z udziałem osób fizycznych

**Rozróżnienie fundamentalne (routing: `mod-J9-ip-prawa-autorskie.md` +
ten plik):** ochrona wizerunku (art. 81 ustawy o prawie autorskim i prawach
pokrewnych) to **dobro osobiste** (art. 23 KC), niezależne od praw autorskich
do samego utworu (zdjęcia, nagrania). Fotograf ma prawa autorskie do zdjęcia;
osoba sfotografowana ma odrębne prawo do wizerunku. Przy generowaniu umowy z
udziałem obu elementów — **potrzebne są dwie odrębne zgody/przeniesienia**,
nie jedna.

**Essentialia zgody na rozpowszechnianie wizerunku:**
1. forma dowolna (nawet ustna), ale dla celów dowodowych zawsze pisemna lub
   klauzula w umowie/oświadczeniu odrębnym;
2. zakres rozpowszechniania — pola eksploatacji analogicznie do prawa
   autorskiego (internet, materiały drukowane, materiały szkoleniowe,
   reklama, czas trwania, terytorium) — **nie domniemywaj** zgody szerszej niż
   wyraźnie wskazana (orzecznictwo: sam fakt pozowania/wyboru zdjęć nie oznacza
   zgody na wszelkie formy rozpowszechniania);
3. wyjątki ustawowe od wymogu zgody (art. 81 ust. 2): (a) osoba powszechnie
   znana — tylko w związku z pełnieniem funkcji publicznych, i tylko wobec
   kręgu odbiorców, w którym jest powszechnie znana, (b) osoba stanowiąca
   jedynie szczegół całości (tłum, krajobraz, impreza publiczna) — stosuj
   ostrożnie, wąska wykładnia w orzecznictwie;
4. domniemana zgoda przy zapłacie za pozowanie (art. 81 ust. 1 zd. 2) —
   działa tylko przy braku wyraźnego zastrzeżenia przeciwnego; nie polegaj na
   tym domniemaniu, gdy klient chce pewności — zawsze rekomenduj wyraźną
   zgodę pisemną.

**Zastosowanie praktyczne:** materiały szkoleniowe z wizerunkiem trenera/
uczestników, case studies marketingowe z wizerunkiem klienta, nagrania webinarów
— w każdym z tych przypadków wygeneruj **odrębną klauzulę zgody na wizerunek**
obok (nie zamiast) klauzuli o prawach autorskich do samego nagrania/materiału.

## D.3 NOTICE & ACTION — trigger: regulamin platformy z treściami użytkowników
## (UGC), marketplace, moderacja treści (routing: `workflows/generator-regulaminu.md`)

Akt o usługach cyfrowych (DSA, rozporządzenie UE 2022/2065) rozszerza — nie
zastępuje — obowiązki regulaminowe z art. 8 u.ś.u.d.e. Termin „warunki
korzystania z usług" w DSA jest równoważny „regulaminowi świadczenia usług
drogą elektroniczną" na gruncie polskiej ustawy [VER przy użyciu].

**Essentialia procedury notice & action, jeśli platforma hostuje treści
użytkowników:**
1. łatwo dostępny, elektroniczny mechanizm zgłaszania treści potencjalnie
   bezprawnych (kto może zgłosić, jak, jakie dane musi podać zgłaszający);
2. potwierdzenie otrzymania zgłoszenia i informacja o dalszym postępowaniu;
3. terminowa i niearbitralna decyzja co do zgłoszonej treści, z uzasadnieniem
   przekazywanym dostawcy treści (o ile nie stoją temu na przeszkodzie
   przepisy szczególne, np. ściganie przestępstw);
4. informacja dla dostawcy treści o środkach odwoławczych (wewnętrzny system
   rozpatrywania skarg, pozasądowe rozstrzyganie sporów);
5. zakaz nadużywania mechanizmu (częste, bezpodstawne zgłoszenia — możliwość
   zawieszenia takiego zgłaszającego po uprzednim ostrzeżeniu).

Routing przy generowaniu: dodaj tę sekcję do szkieletu regulaminu w
`workflows/generator-regulaminu.md` KROK 2, punkt „warunki świadczenia usług",
gdy wywiad wykazał UGC/marketplace. Sprawdź aktualny zakres podmiotowy DSA
(progi wielkości platformy) przed narzuceniem pełnego reżimu małemu serwisowi
— nie wszystkie obowiązki DSA dotyczą każdego usługodawcy.

## D.4 POLITYKA AI JAKO SAMODZIELNY DOKUMENT WEWNĘTRZNY — trigger: „napisz
## politykę AI/politykę wykorzystania AI w firmie" (routing: dodaj jako Ścieżkę C
## w `workflows/generator-dokumentow-hr-rodo.md`)

Różnica względem `mod-shared-ai-act.md` (klauzule AI Act **w umowach** z
dostawcą/wdrażającym system AI): Polityka AI to **dokument wewnętrzny
pracodawcy**, regulujący korzystanie z narzędzi AI przez personel — nie jest
wprost wymagana przez AI Act nazwą, ale jest najprostszym sposobem wykazania
realizacji obowiązków z art. 4 (kompetencje AI / „AI literacy", stosowany od
2.02.2025) i art. 50 (przejrzystość wobec odbiorców, od 2.08.2026) [VER przy
użyciu — terminy wdrożenia AI Act weryfikuj każdorazowo, harmonogram bywa
przedmiotem zmian].

**Essentialia Polityki AI:**
1. mapa narzędzi AI dozwolonych w organizacji (rejestr) — w tym narzędzia
   wbudowane w oprogramowanie biurowe, nie tylko dedykowane platformy;
2. zakaz wprowadzania określonych kategorii danych do narzędzi AI (dane
   osobowe klientów, tajemnica przedsiębiorstwa, dane objęte NDA) — routing:
   `mod-shared-rodo.md` dla podstawy prawnej zakazu;
3. zasady weryfikacji wyników generowanych przez AI przed wykorzystaniem
   (kto odpowiada za treść merytoryczną — pracownik, nie narzędzie);
4. obowiązek oznaczania treści wygenerowanych/zmodyfikowanych przez AI, w
   szczególności deepfake i treści syntetyczne (art. 50 AI Act) — zakres i
   forma oznaczenia zależy od kontekstu (materiał publikowany zewnętrznie vs
   wewnętrzny) — dopytaj klienta o konkretne przypadki użycia;
5. plan podnoszenia kompetencji AI („AI literacy") — poziom dostosowany do
   roli (kadra zarządzająca / operacyjni / IT-bezpieczeństwo / prawny),
   z dokumentacją: programy szkoleniowe, wskaźniki uczestnictwa, cykliczna
   aktualizacja (co najmniej raz w roku lub przy istotnej zmianie
   technologicznej) — sama polityka bez dowodu wdrożenia szkoleń nie
   wystarcza jako dowód zgodności;
6. procedura zgłaszania incydentów/nieprawidłowości związanych z użyciem AI
   (błędna treść, wyciek danych do narzędzia AI, podejrzenie „shadow AI" —
   nieautoryzowanego korzystania z narzędzi poza rejestrem);
7. sankcje wewnętrzne za naruszenie polityki (routing: regulamin pracy,
   `mod-J21-rodo-archiwizacja-regulaminy.md § J21.4`, jeśli polityka ma być
   częścią regulaminu pracy, a nie odrębnym dokumentem — ustal to z klientem
   w wywiadzie, obie opcje są praktykowane).

**Wywiad przed generowaniem:** liczba i rodzaj narzędzi AI już używanych
(w tym nieformalnie — „shadow AI"), czy firma jest dostawcą czy wyłącznie
wdrażającym systemy AI (różny zakres obowiązków AI Act), czy działa w
sektorze regulowanym (finanse, ochrona zdrowia — dodatkowe wymogi sektorowe
poza AI Act, zasygnalizuj to zamiast pomijać).

---

## Powiązania

- `mod-J9-ip-prawa-autorskie.md` (D.1, D.2) — essentialia IP, ten plik
  dostarcza wyłącznie brakującą warstwę doktrynalną open source i wizerunku.
- `mod-shared-ai-act.md` (D.4) — klauzule AI Act w umowach; ten plik dotyczy
  dokumentu wewnętrznego, nie klauzuli kontraktowej.
- `mod-shared-regulatory-horizon.md § RH.7` (D.3) — DSA/DMA na poziomie
  regulacyjnym; ten plik dostarcza essentialia samej procedury notice&action
  do wpisania w regulamin.
- `workflows/generator-regulaminu.md`, `workflows/generator-dokumentow-hr-rodo.md`
  — punkty wejścia procesowe dla D.3 i D.4.
