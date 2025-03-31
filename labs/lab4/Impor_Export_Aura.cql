// Para poder importar un csv en Aura Db se hace lo siguiente


// Tenemos productos  y una ubicacion en una farmacia

LOAD CSV  FROM "./Productos.csv" AS row
LOAD CSV WITH HEADERS from "./ubicaciones.csv" as row2
MERGE (p:Product {productId: row[0], name: row[1]})
MERGE (u:Ubicaciones {ubicacionID: row2[0], name: row2[1], lugar: row2[2]})
MERGE (p)-[r:IS_IN]->(m)
return p, m, r
