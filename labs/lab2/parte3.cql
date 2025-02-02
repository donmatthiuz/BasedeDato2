// Inciso 1
MATCH(n: Movie {title:'Batman Begins'})
RETURN n
// [No hubo resultados para película, se crea nodo]
CREATE(n: Movie {tagline: 'Its not who you are underneath, but what you do that defines you', 
title:'Batman Begins', released: 2005})
RETURN n
//[Creacion relacion entre Michael Caine y Batman Begins]
MATCH(n:Movie{title:'Batman Begins'})
MATCH(p:Person{name:'Michael Caine'})
MERGE (n)-[r:ACTED_IN {roles: 'Alfred Penny'}]->(p)
RETURN n,r,p

// Inciso 2
MATCH (p:Person {name: 'Michael Caine'})
MATCH (m:Movie {title: 'The Dark Knight'})
MERGE (p)-[r:ACTED_IN {roles: 'Alfred Pennyworth'}]->(m)
RETURN n,r,p

// Inciso 3
MATCH(n:Person {name:'Michael Caine'}) -[r:ACTED_IN]->(m:Movie{title:'The Dark Knight'})
SET r.year = 2008
RETURN n,r,m

// Inciso 4
MATCH (n:Person{name:'Michael Caine'})-[r:ACTED_IN]->(m:Movie{title:'The Dark Knight'})
REMOVE r.roles
RETURN n, r, m

// Inciso 5
//[Creacion nodo Jane Doe]
CREATE(n:Person{name:'Jane Doe'})
// [Creación relacion con The Matrix]
MATCH(n:Person{name:'Jane Doe'})
MATCH(m:Movie{title:'The Matrix'})
MERGE(n)-[r:ACTED_IN]->(m)
RETURN n,r,m

// Inciso 6
MATCH (m:Movie {title: 'The Matrix'})<-[r]-(n)
RETURN m,r,n

// Inciso 7
MATCH (p:Person {name: 'Tom Cruise'})-[r:DIRECTED]->(n:Movie)
RETURN r, n
// [Parece ser que no hay películas que Tom Cruise ha producido en esta base de datos, pero si ha producido peliculas como Top Gun: Maverick, la saga de Mission Impossible, The Last Samurai, etc]

// Inciso 8
MATCH (n)
DETACH DELETE n