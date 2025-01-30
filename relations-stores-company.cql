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

