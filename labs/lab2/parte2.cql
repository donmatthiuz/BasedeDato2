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
RETURN p, m, r


// Inciso 5

// Inciso 6

// Inciso 7

// Inciso 8
