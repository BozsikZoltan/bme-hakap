# Cloud-native immutability

## Ismertető
Alkalmazásaink többségének a megfelelő működéséhez elengedhetetlen a perzisztens adattárolás, függetlenül attól hogy hol helyezkedik el (felhőben / lokális szerveren). A cloud-native világban ennek megvalósítása bonyolulatabb, mint a hagyományos megközelítésbe. Ennek oka az, hogy a cloud-native megközelítsébe az alkalmazást konténerizáció segítségével tudjuk futtatni / működtetni, ami elrejti a futtató környezet elől az alkalmazás sajátosságait. Ez számos előnnyel jár (például: egyszerűbb konfiguráció, automatikus skálázás,...), de cserébe a konténerek csak egy bizonyos formátumot fogadnak el. Ezt a formátumot különböző absztrakciók segítségével érjük el, aminek az eredménye egy képfájl lesz. A képfájl sajátossága az, hogy állapottalanságot (stateless) képvisel, aminek eredményeképp, minden leállás után alap állapotból indul (nem képes beágyazott értékek perzisztens tárolására). A cloud-native világban, a problémának megoldására született az immutability fejlesztési minta. A mostani feladat ezt a jelenséget hivatott személtetni, két egyszerű (egy jó és egy rossz megközelítésben) példán keresztül.

## Feladat
A feladat Linux alatt lett megvalósítva, és tesztelve, de kisebb eltérésekkel Windows alatt is hasonlóan megvalósítható. A megoldásához szükséges Docker (https://docs.docker.com/get-docker/), és Minikube (https://minikube.sigs.k8s.io/docs/start/), illetve npm csomagkezelő. Ezek hiányába az alábbi kódrészek nem működnek.

### Előkészítés

#### Git repository leszedése
Ehhez naviáljunk el egy mappába, ahova szeretnénk leszedni a szükséges fájlokat, majd:

```git clone git@github.com:BozsikZoltan/bme-hakap.git```

```cd bme-hakap```

#### Minikube indítása

```minikube start --vm-driver="virtualbox"```

#### Minikube Docker daemon-ra váltás

```eval $(minikube docker-env)``` 								# Adott terminál ablakra lesz csak érvényes

#### Képfájlok elkészítése, és mentése a Minikube lokális repository-jába

```docker build -t hakap-immutability-good good-approach/.```				# Docker képfájl létrehozása a jó megközelítéshez

```docker build -t hakap-immutability-bad bad-approach/.```					# Docker képfájl létrehozása a rossz megközelítéshez

#### Alkalmazás komponensek létrehozása Minikube alá

```kubectl apply -f manifests/good-approach.yaml```						# Létrehozza a jó megközelítés komponenseit

```kubectl apply -f manifests/bad-approach.yaml```						# Létrehozza a rossz megközelítés komponenseit

#### Ellenőrzés

```kubectl get all```										# Kilistázza az összes komponenst

### Tesztelés
Az elkészült alkalmazásokat böngésző segítségével érjük el:

```minikube service hakap-immutability-good```						# vagy böngészőbe: http://192.168.59.100:30290/

```minikube service hakap-immutability-bad```							# vagy böngészőbe: http://192.168.59.100:30490/

Mind a két megközelítés felülete azonos, ami 3 részből áll:

* Első soron a beviteli mező és egy "OK" gomb. Ha ki van töltve a mező, akkor az "Ok" gomb megnyomásának hatására, hozzáadja a lista végére az elemet.
* Második soron egy "Clear" gomb, aminek megnyomására törlődik a lista tartalma.
* Harmadik soron a lista értékeit lehet látni (kezdetben semmit, mert üres) egymás után vesszővel elválasztva.

Próbáljuk ki!

A immutability teszteléséhez vigyünk be pár tetszőleges értéket mind a két megközelítésbe, majd az alábbi parancsokat adjuk ki:

```kubectl rollout restart deployment hakap-immutability-good```				# Jó megközelítés újraindítása

```kubectl rollout restart deployment hakap-immutability-bad```				# Rossz megközelítés újraindítása

Ezek után frissítsük a böngészőnk ablakiat (vagy nyissuk meg újra). Lehet látni, hogy a rossz megközelítésnél eltűntek a bevitt értékek, míg a jó megközelítés esetében megmaradtak az előzőekben bevitt értékek.
Az immutability mintát úgy siketült megvalósítani, hogy a jó megközelítés esetében a bevitt értékeket egy másik (kulcs-érték tár) alkalmazásba mentjük le, és innen kérjük le az aktuális lista tartalmát. Cloud-native megközelítsében az egyik legnépszerűbb kulcs-érték tár alkalmazás a Redis, ezt az alkalmazást használja a jó megközelítés is. Így esetleges program újraindulás esetén megmaradnak a bevitt értékek a különálló Redis alkalmazásunk segítségével.

