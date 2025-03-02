from conn import connection
from baseMethods import clean_db, create_nodo, create_relation


URI = "neo4j+s://9ade8666.databases.neo4j.io"
#Instancia
AUTH = ("neo4j", "AnkA4l4xf8uyVAAqRUtIbhUfY5FYB8UhxDzwB3sZJ00")

def create_db():
    driver = connection(URI,AUTH)
    #limpieza db
    clean_db(driver=driver)
    #create_nodo()
    #create_relation()




    driver.close()