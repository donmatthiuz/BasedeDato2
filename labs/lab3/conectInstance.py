# Driver import
from neo4j import GraphDatabase

#Conexión
AURA_CONNECTION_URI="neo4j+s://d75b418a.databases.neo4j.io"
AURA_USERNAME = "neo4j"
AURA_PASSWORD = "jQAeKwuVMjIOOtDwpRjfs4RjfrMHXdPhzUzKmJramRw"

#Driver instancia
driver = GraphDatabase.driver(
    AURA_CONNECTION_URI,
    auth=(AURA_USERNAME, AURA_PASSWORD)
)