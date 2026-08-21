# PORTALE-LOKALNE — sieć portali orzeczeń sądów powszechnych i administracyjnych

> **Plik:** `orzeczenia-sadowe-v2/references/PORTALE-LOKALNE.md`
> **Wersja:** 1.0 (2026-07-01)
> **Wywołanie:** Faza 1-L, Zasada 5A

---

## 1. Zasada sieci

`orzeczenia.ms.gov.pl` (Portal Orzeczeń Sądów Powszechnych) nie jest jedną
scentralizowaną bazą, lecz **punktem dostępu do federacji odrębnych portali**
prowadzonych przez poszczególne sądy apelacyjne, okręgowe i rejonowe. Każdy
sąd publikuje orzeczenia na własnej subdomenie `*.gov.pl`, indeksowanej
i przeszukiwalnej zbiorczo z poziomu portalu centralnego oraz — dodatkowo —
bezpośrednio pod własnym adresem.

Status weryfikacyjny: portal lokalny = Tier 1 (Zasada 5A), równoważny
portalowi centralnemu. Nie wymagaj podwójnego potwierdzenia.

⚠️ **Zakres publikacji nie jest wyczerpujący.** Publikowane są orzeczenia
z uzasadnieniem, wybrane wg kryteriów ustalonych przez zespół sędziów danego
sądu, z wyłączeniem części spraw objętych wyłączeniami ustawowymi. Brak
trafienia w wyszukiwarce ≠ dowód nieistnienia orzecznictwa danego sądu w tej
materii — traktuj jako lukę wymagającą odnotowania (patrz FALLBACK F-4
w SKILL.md), nie jako ustalenie negatywne.

---

## 2. Wzorzec adresu URL

```
Sąd apelacyjny:  orzeczenia.[symbol-miasta].sa.gov.pl
Sąd okręgowy:    orzeczenia.[symbol-miasta].so.gov.pl
Sąd rejonowy:    orzeczenia.[symbol-miasta].sr.gov.pl
```

`[symbol-miasta]` bywa nazwą miasta, skrótem lub nazwą dzielnicy dla większych
aglomeracji (np. sądy warszawskie mają osobne symbole per dzielnica/rejon).
Wzorzec nie jest w 100% jednolity — gdy sąd nie występuje w tabeli §3, ustal
adres przez `web_search "orzeczenia [pełna nazwa sądu]"` i zweryfikuj domenę
przez `web_fetch` (musi kończyć się na `.gov.pl`, nigdy nie ufaj domenom
komercyjnym podszywającym się pod nazwę sądu).

---

## 3. Portale sądów apelacyjnych (11) — punkty wejścia do okręgów podległych

| Sąd apelacyjny | Portal | Okręgi/sądy podległe (SO/SR) — dostępne z tego portalu |
|---|---|---|
| SA Białystok | orzeczenia.bialystok.sa.gov.pl | SO Białystok, SO Łomża, SO Olsztyn, SO Suwałki + SR podległe |
| SA Gdańsk | orzeczenia.gdansk.sa.gov.pl | SO Gdańsk, SO Bydgoszcz, SO Elbląg, SO Słupsk, SO Toruń, SO Włocławek + SR |
| SA Katowice | orzeczenia.katowice.sa.gov.pl | SO Katowice, SO Bielsko-Biała, SO Częstochowa, SO Gliwice + SR |
| SA Kraków | orzeczenia.krakow.sa.gov.pl | SO Kraków, SO Kielce, SO Nowy Sącz, SO Tarnów + SR |
| SA Lublin | orzeczenia.lublin.sa.gov.pl | SO Lublin, SO Radom, SO Siedlce, SO Zamość + SR |
| SA Łódź | orzeczenia.lodz.sa.gov.pl | SO Łódź, SO Kalisz, SO Piotrków Trybunalski, SO Płock, SO Sieradz + SR |
| SA Poznań | orzeczenia.poznan.sa.gov.pl | SO Poznań, SO Konin, SO Zielona Góra + SR |
| SA Rzeszów | orzeczenia.rzeszow.sa.gov.pl | SO Rzeszów, SO Krosno, SO Przemyśl, SO Tarnobrzeg + SR |
| SA Szczecin | orzeczenia.szczecin.sa.gov.pl | SO Szczecin, SO Gorzów Wielkopolski, SO Koszalin + SR |
| SA Warszawa | orzeczenia.waw.sa.gov.pl | SO Warszawa, SO Warszawa-Praga, SO Ostrołęka, SO Płock, SO Radom, SO Siedlce + SR |
| SA Wrocław | orzeczenia.wroclaw.sa.gov.pl | SO Wrocław, SO Legnica, SO Opole, SO Świdnica, SO Jelenia Góra + SR |

Przykładowe portale sądów rejonowych/okręgowych (zweryfikowane wzorce nazw —
stosuj analogicznie dla innych, weryfikując przez web_search/web_fetch):

- `orzeczenia.warszawa.so.gov.pl` — SO Warszawa
- `orzeczenia.krakow-sr.sr.gov.pl` — SR dla Krakowa-Śródmieścia
- `orzeczenia.plonsk.sr.gov.pl` — SR w Płońsku

Lista sądów rejonowych jest zbyt liczna (>300) do wyczerpującego katalogowania
tutaj — dla konkretnego sądu zawsze potwierdź adres przez web_search/web_fetch
zamiast zgadywać wzorzec URL.

---

## 4. Sądownictwo administracyjne (WSA) — CBOSA jako baza jednolita

**Nie stosuj wzorca z §2 dla WSA.** Wojewódzkie Sądy Administracyjne (16, po
jednym na województwo) NIE prowadzą odrębnych portali orzeczeń — wszystkie
orzeczenia NSA i wszystkich WSA są dostępne w jednej bazie:

```
orzeczenia.nsa.gov.pl (CBOSA — Centralna Baza Orzeczeń Sądów Administracyjnych)
```

Filtrowanie po konkretnym WSA odbywa się przez parametr wyszukiwania (symbol
sądu) w obrębie CBOSA, nie przez osobną domenę. Jedno zapytanie do CBOSA
wystarcza dla całego sądownictwa administracyjnego (NSA + 16 WSA).

---

## 5. Procedura użycia (skrót — pełna wersja: Faza 1-L w SKILL.md)

```
1. Ustal sąd → sprawdź §3 (SA) lub użyj bezpośrednio §4 (sprawy administracyjne).
2. Brak w §3 → web_search "orzeczenia [nazwa sądu]" → web_fetch weryfikacja domeny.
3. web_fetch wyszukiwarki portalu z frazami z Fazy 0-B.
4. Każde trafienie = Tier 1 (Zasada 5A) — 4 obowiązkowe elementy (Zasada 2).
5. Brak wyników → nie twierdź braku orzecznictwa; odnotuj lukę (FALLBACK F-4).
```

---

*PORTALE-LOKALNE v1.0 · orzeczenia-sadowe-v2 · dane portali zweryfikuj każdorazowo
web_fetch przed cytowaniem — struktura sądownictwa i adresy mogą ulec zmianie
(reorganizacje, zmiany domen).*
