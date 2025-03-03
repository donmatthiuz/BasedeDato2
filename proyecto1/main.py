from conn import connection
from baseMethods import clean_db, create_nodo, create_relation


URI = "neo4j+s://3b37977c.databases.neo4j.io"
#Instancia
AUTH = ("neo4j", "W_m4ObG8GYoBCCcUVjQTBJlGj44enIFNCPVgvR8GEb4")

def create_db():
    driver = connection(URI,AUTH)
    #limpieza db
    clean_db(driver=driver)
    #create_nodo()
    #create_relation()




    driver.close()