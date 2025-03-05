from neo4j import GraphDatabase
 
URI = "neo4j+s://0cc39bef.databases.neo4j.io"
#Instancia
AUTH = ("neo4j", "fP3sYIVaTclbu_XvqWmZptzWkj2xObmtZ20xb9_J60o")

#Conexion por driver
def connection()-> GraphDatabase.driver:
    driver = GraphDatabase.driver(URI, auth=AUTH)
    driver.verify_connectivity()
    print("Conexion Exitosa.")
    return driver