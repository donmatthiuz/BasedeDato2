from neo4j import GraphDatabase
 
#Conexion por driver
def connection(uri: str, auth: tuple)-> GraphDatabase.driver:
    driver = GraphDatabase.driver(uri, auth=auth)
    driver.verify_connectivity()
    print("Connection established.")
    return driver