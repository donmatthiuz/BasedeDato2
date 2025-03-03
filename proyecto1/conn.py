from neo4j import GraphDatabase
 
URI = "neo4j+s://3b37977c.databases.neo4j.io"
#Instancia
AUTH = ("neo4j", "W_m4ObG8GYoBCCcUVjQTBJlGj44enIFNCPVgvR8GEb4")

#Conexion por driver
def connection()-> GraphDatabase.driver:
    driver = GraphDatabase.driver(URI, auth=AUTH)
    driver.verify_connectivity()
    print("Conexion Exitosa.")
    return driver