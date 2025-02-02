// Inciso 1

MERGE (p:Person {name: "Michael Caine", born: 1933})
RETURN p

// Inciso 2

MATCH (p:Person {name: "Michael Caine", born: 1933})
RETURN p

// Inciso 3

MERGE (p:Person {name: 'Katie Holmes'})
MERGE (m:Movie {title: 'The Dark Knight'})
RETURN p, m

// Inciso 4

MATCH (p:Person {name: 'Michael Caine'})
MATCH (m:Movie {title: 'The Dark Knight'})
MERGE (p)-[r:ACTED_IN]->(m)
SET r.roles = 'Alfred Pennyworth'


// Inciso 5

MATCH (p:Person {name: 'Michael Caine'})-[r:ACTED_IN]->(m:Movie {title: 'The Dark Knight'})
RETURN p, r, m

// Inciso 6

MERGE (p:Person {name: "Chadwick Boseman", born: 1976})
MERGE (m:Movie {title: "Black Panther", tagline: "Long live the king", released: 2018})
MERGE (p)-[r:ACTED_IN]->(m)
SET r.roles = 'TChalla'


// Inciso 7

MATCH (p:Person {name: "Chadwick Boseman"})-[r:ACTED_IN]->(m:Movie {title: 'Black Panther'})
RETURN p, r, m

// Inciso 8
MERGE (p:Person {name: "Emily Blunt", born: 1983})-[r:ACTED_IN {roles: 'Evelyn Abbott'}]->(m:Movie {title: "A Quiet Place", tagline: "If they hear you, they hunt you", released: 2018})
RETURN p, m, r
