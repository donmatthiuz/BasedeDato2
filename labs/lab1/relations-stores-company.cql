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

// Relaciones en company y store.



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



// Square Enix

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




// Company Makes

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