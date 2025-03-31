from conn import connection
from baseMethods import clean_db, create_nodo, create_relation




def create_db():
    driver = connection()
    clean_db(driver=driver)




    driver.close()