// Creación de nodos Games
CREATE (n: Game {gameName:"Pacman", launchYear:1980, ageRating:6, gameGenre: "maze"})
CREATE (n1: Game {gameName:"The Last Of Us", launchYear:2013, ageRating:12, gameGenre: "action"})
CREATE (n2: Game {gameName:"Blasphemous", launchYear:2019, ageRating:18, gameGenre: "fight"})
CREATE (n3: Game {gameName:"Final Fantasy", launchYear:1987, ageRating:18, gameGenre: "rol"})
CREATE (n4: Game {gameName:"Shovel Knignt", launchYear:2014, ageRating:6, gameGenre: "maze"})

// Creación de relaciones 'AVAILABLE' hacia Store

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
