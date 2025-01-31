// Creación de relaciones 'AVAILABLE' desde Game hacia Store
MATCH (g:Game), (s: Store)
WHERE g.gameName = 'Pacman' AND s.name = 'Amazon'
CREATE (g)-[r:AVAILABLE]->(s)

MATCH (g1:Game), (s1: Store)
WHERE g1.gameName = 'The Last Of Us' AND s1.name = 'PlayStation Plus'
CREATE (g1)-[r1:AVAILABLE]->(s1)

MATCH (g2:Game), (s2: Store)
WHERE g2.gameName = 'Blasphemous' AND s2.name = 'Steam'
CREATE (g2)-[r2:AVAILABLE]->(s2)

MATCH (g3:Game), (s3: Store)
WHERE g3.gameName = 'Final Fantasy' AND s3.name = 'Microsoft Store'
CREATE (g3)-[r3:AVAILABLE]->(s3)

MATCH (g4:Game), (s4: Store)
WHERE g4.gameName = 'Shovel Knignt' AND s4.name = 'Nintendo eShop'
CREATE (g4)-[r4:AVAILABLE]->(s4)

// Creación de relaciones 'SELL_GAME' desde Store hacia Game
MATCH (s:Store {name: 'Amazon'}), (g:Game {gameName: "Pacman"})
CREATE (s)-[r:SELL_GAME]->(g)
SET r.price = 500.00,
    r.sales= 184,
    r.format = 'PHYSICAL'
RETURN s, g, r

MATCH (s:Store {name: 'Steam'}), (g:Game {gameName: "Blasphemous"})
CREATE (s)-[r:SELL_GAME]->(g)
SET r.price = 24.99,
    r.sales= 25000,
    r.format = 'DIGITAL'
RETURN s, g, r

MATCH (s:Store {name: "PlayStation Plus"}), (g:Game {gameName: "The Last Of Us"})
CREATE (s)-[r:SELL_GAME]->(g)
SET r.price = 69.99,
    r.sales= 37000000,
    r.format = 'DIGITAL'
RETURN s, g, r

MATCH (s:Store {name: "Amazon"}), (g:Game {gameName: "Final Fantasy"})
CREATE (g)-[r:AVAILABLE]->(s)
RETURN s, g, r

MATCH (s:Store {name: "Microsoft Store"}), (g:Game {gameName: "Final Fantasy"})
CREATE (s)-[r:SELL_GAME]->(g)
SET r.price = 74.99,
    r.sales= 190,
    r.format = 'DIGITAL'
RETURN s, g, r


MATCH (s:Store {name: "Amazon"}), (g:Game {gameName: "Final Fantasy"})
CREATE (s)-[r:SELL_GAME]->(g)
SET r.price = 74.20,
    r.sales= 192,
    r.format = 'PHYSICAL'
RETURN s, g, r


MATCH (s:Store {name: "Nintendo eShop"}), (g:Game {gameName: "Shovel Knignt"})
CREATE (s)-[r:SELL_GAME]->(g)
SET r.price = 49.99,
    r.sales= 700000,
    r.format = 'DIGITAL'
RETURN s, g, r

// Creación de relaciones 'SELLS' desde Store hacia Platform
MATCH(n:Store{name: "Microsoft Store"})
MATCH(a:Platform{name: "Xbox One"})
MERGE (n)-[r:SELLS]->(a)
RETURN n,r,a;

MATCH(n:Store{name: "Microsoft Store"})
MATCH(a:Platform{name: "Xbox One"})
MERGE (n)-[r:SELLS]->(a)
RETURN n,r,a;

MATCH(n:Store{name: "PlayStation Plus"})
MATCH(a:Platform{name: "Playstation 3"})
MERGE (n)-[r:SELLS]->(a)
RETURN n,r,a;

MATCH(n:Store{name: "Amazon"})
MATCH(a:Platform{name: "Atari2600"})
MERGE (n)-[r:SELLS]->(a)
RETURN n,r,a;

MATCH(n:Store{name: "Nintendo eShop"})
MATCH(a:Platform{name: "Nintendo 3DS"})
MERGE (n)-[r:SELLS]->(a)
RETURN n,r,a;

// Creación de relaciones 'SUPPORTS' desde Platform hacia Game
MATCH (n:Platform {name: "Atari2600"})-[r:SUPPORTS]->(a:Game {gameName: "Pacman"})
SET r.memoryGB = 0.000004
RETURN n,r,a;

MATCH (n:Platform {name: "Nintendo 3DS"})-[r:SUPPORTS]->(a:Game {gameName: "Shovel Knignt"})
SET r.memoryGB = 0.25
RETURN n,r,a;

MATCH (n:Platform {name: 'Xbox One'})-[r:SUPPORTS]->(a:Game {gameName: "Blasphemous"})
SET r.memoryGB = 2.5
RETURN n,r,a;

MATCH (n:Platform {name: 'Playstation 3'})-[r:SUPPORTS]->(a:Game {gameName: "The Last Of Us"})
SET r.memoryGB = 50
RETURN n,r,a;

MATCH (n:Platform {name: 'Playstation 1'})-[r:SUPPORTS]->(a:Game {gameName: "Final Fantasy"})
SET r.memoryGB = 0.00192
RETURN n,r,a;

MATCH(n:Platform{name: "Playstation 1"})
MATCH(a:Game{gameName: "Final Fantasy"})
MERGE (n)-[r:SUPPORTS]->(a)
RETURN n,r,a;

MATCH(n:Platform{name: "Xbox One"})
MATCH(a:Game{gameName: "Blasphemous"})
MERGE (n)-[r:SUPPORTS]->(a)
RETURN n,r,a;

MATCH(n:Platform{name: "Nintendo 3DS"})
MATCH(a:Game{gameName: "Shovel Knignt"})
MERGE (n)-[r:SUPPORTS]->(a)
RETURN n,r,a;

MATCH(n:Platform{name: "Playstation 3"})
MATCH(a:Game{gameName: "The Last Of Us"})
MERGE (n)-[r:SUPPORTS]->(a)
RETURN n,r,a;

MATCH(n:Platform{name: "Atari2600"})
MATCH(a:Game{gameName: "Pacman"})
MERGE (n)-[r:SUPPORTS]->(a)
RETURN n,r,a;

// Creación de relaciones 'PUBLISHES_ON' desde Company hacia Platform
MATCH (c:Company {name: 'Namco'})
WITH c
MATCH (p:Platform {name: 'Playstation 3'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Namco'}), (p:Platform {name: 'Playstation 1'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Namco'}), (p:Platform {name: 'Xbox One'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Namco'}), (p:Platform {name: 'Nintendo 3DS'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Namco'}), (p:Platform {name: 'Atari2600'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'The Game Kitchen'}), (p:Platform {name: 'Xbox One'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Yacht Club Games'}), (p:Platform {name: 'Xbox One'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Yacht Club Games'}), (p:Platform {name: 'Playstation 3'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Yacht Club Games'}), (p:Platform {name: 'Nintendo 3DS'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Square Enix'})
WITH c
MATCH (p:Platform {name: 'Playstation 3'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Square Enix'}), (p:Platform {name: 'Playstation 1'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Square Enix'}), (p:Platform {name: 'Xbox One'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Square Enix'}), (p:Platform {name: 'Nintendo 3DS'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r

MATCH (c:Company {name: 'Naughty Dog'}), (p:Platform {name: 'Playstation 3'})
CREATE (c)-[r:PUBLISHES_ON]->(p)
SET r.exclusiveRights = false
RETURN c, p, r


// Creación de relaciones 'MAKES' desde Company hacia Game
MATCH (c:Company {name: 'Namco'}), (g:Game {gameName: 'Pacman'})
CREATE (c)-[r:MAKES]->(g)
SET r.directorName = 'Toru Iwatani'
RETURN c, g, r

MATCH (c:Company {name: 'Naughty Dog'}), (g:Game {gameName: "The Last Of Us"})
CREATE (c)-[r:MAKES]->(g)
SET r.directorName = 'Jacob Minkoff'
RETURN c, g, r

MATCH (c:Company {name: 'The Game Kitchen'}), (g:Game {gameName: "Blasphemous"})
CREATE (c)-[r:MAKES]->(g)
SET r.directorName = 'Enrique Cabeza'
RETURN c, g, r


MATCH (c:Company {name: 'Yacht Club Games'}), (g:Game {gameName: "Shovel Knignt"})
CREATE (c)-[r:MAKES]->(g)
SET r.directorName = 'Sean Velasco'
RETURN c, g, r


MATCH (c:Company {name: 'Square Enix'}), (g:Game {gameName: "Final Fantasy"})
CREATE (c)-[r:MAKES]->(g)
SET r.directorName = 'Hironobu Sakaguchi'
RETURN c, g, r

// Creación de relaciones 'PARTNER_SHIP' desde Company hacia Store
MATCH (c:Company {name: 'Naughty Dog'}), (s:Store {name: 'Steam'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.30
RETURN c, s, r

MATCH (c:Company {name: 'Naughty Dog'}), (s:Store {name: 'PlayStation Plus'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'EXCLUSIVE',
    r.revenueShare = 0.5
RETURN c, s, r

MATCH (c:Company {name: 'Namco'}), (s:Store {name: 'PlayStation Plus'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.5
RETURN c, s, r

MATCH (c:Company {name: 'Namco'}), (s:Store {name: 'Steam'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.3
RETURN c, s, r

MATCH (c:Company {name: 'Namco'}), (s:Store {name: 'Nintendo eShop'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.3
RETURN c, s, r

MATCH (c:Company {name: 'The Game Kitchen'}), (s:Store {name: 'Steam'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.3
RETURN c, s, r

MATCH (c:Company {name: 'The Game Kitchen'}), (s:Store {name: 'PlayStation Plus'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.08
RETURN c, s, r

MATCH (c:Company {name: 'Yacht Club Games'}), (s:Store {name: 'Nintendo eShop'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.3
RETURN c, s, r

MATCH (c:Company {name: 'Yacht Club Games'}), (s:Store {name: 'Steam'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.3
RETURN c, s, r

MATCH (c:Company {name: 'Yacht Club Games'}), (s:Store {name: 'Amazon'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.08
RETURN c, s, r

MATCH (c:Company {name: 'Yacht Club Games'}), (s:Store {name: 'Microsoft Store'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.5
RETURN c, s, r

MATCH (c:Company {name: 'Square Enix'}), (s:Store {name: 'Nintendo eShop'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.3
RETURN c, s, r

MATCH (c:Company {name: 'Square Enix'}), (s:Store {name: 'Steam'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.3
RETURN c, s, r

MATCH (c:Company {name: 'Square Enix'}), (s:Store {name: 'Microsoft Store'})
CREATE (c)-[r:PARTNERSHIP]->(s)
SET r.contractType = 'NON EXCLUSIVE',
    r.revenueShare = 0.5
RETURN c, s, r
