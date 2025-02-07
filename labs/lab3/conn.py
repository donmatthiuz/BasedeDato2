from neo4j import GraphDatabase

# URI examples: "neo4j://localhost", "neo4j+s://xxx.databases.neo4j.io"
URI = "neo4j+s://d75b418a.databases.neo4j.io"
# Instancia Abby
AUTH = ("neo4j", "jQAeKwuVMjIOOtDwpRjfs4RjfrMHXdPhzUzKmJramRw")

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    driver.verify_connectivity()
    print("Connection established.")