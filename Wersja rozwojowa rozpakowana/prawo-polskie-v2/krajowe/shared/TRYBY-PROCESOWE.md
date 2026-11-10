# TRYBY-PROCESOWE — centralny rejestr trybów i rygorów

## 1. Cel

Moduł służy do wyboru właściwego trybu przed redakcją pisma. Nie zastępuje przepisów szczególnych. Jeżeli tryb jest niepewny, oznacz to jako ryzyko i nie finalizuj pisma bez weryfikacji.

## 2. Mapa trybów

| Tryb | Typowe pisma | Krytyczne kontrole |
|---|---|---|
| Cywilny KPC | pozew, odpowiedź, apelacja, zażalenie, sprzeciw, wniosek | właściwość, WPS/WPZ, opłata, termin, odpisy, dowody |
| Pracowniczy | pozew pracownika, odwołanie od wypowiedzenia, roszczenia płacowe | termin prawa pracy, właściwość, opłaty pracownicze, ciężar dowodu |
| Gospodarczy | pozew, odpowiedź, sprzeciw, zarzuty | prekluzja, obowiązek powołania twierdzeń i dowodów, dokumenty gospodarcze |
| Karny KPK | zawiadomienie, zażalenie, wniosek dowodowy, prywatny akt oskarżenia | uprawnienie strony, termin, wymogi art. 119 k.p.k., znamiona czynu |
| Administracyjny KPA | podanie, odwołanie, zażalenie, ponaglenie | organ, termin, podpis, forma wniesienia, komplet danych |
| Sądowoadministracyjny PPSA | skarga do WSA, zażalenie, skarga kasacyjna | wyczerpanie środków, termin, wymogi szczególne, przymus adwokacko-radcowski |
| Egzekucyjny | wniosek do komornika, skarga na czynności | tytuł wykonawczy, wierzyciel/dłużnik, świadczenie, właściwość komornika |
| Przedsądowy | wezwanie, reklamacja, próba ugodowa | wymagalność, termin, dowód doręczenia, precyzja roszczenia |

## 3. Obowiązkowy wynik routingu

```text
TRYB: ...
PISMO: ...
ETAP: ...
SĄD/ORGAN: ...
TERMIN: ...
OPŁATA: ...
RYGORY: ...
MODUŁY DO WCZYTANIA: ...
```
