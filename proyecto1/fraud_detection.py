from Grafo import *
from neo4j import *
#Métodos de deteccion mas efectivos#

#Uso de misma tarjeta en multiples partes: 
#Si una tarjeta ha sido utilizada en distintos canales en un corto período
def multiple_channels(driver):
   query = """
    MATCH (n: CreditCard)-[r:MAKES]->(t1: Transaction), (n) -[r:MAKES]->(t2: Transaction)
    WHERE  t1 <> t2
    AND abs(duration.inSeconds(datetime(t1.date+"T"+ t1.time), datetime(t2.date+"T"+t2.time)).seconds)<3600
    AND t1.channel <> t2.channel
    RETURN n, t1, t2
    """
   result, _, _ = driver.execute_query(query)
   return result

#Redes de Fraude:
# Se dientifica si varias tarjetas están relacionadas a la misma identidad/datos personales
def identity_network(driver):
   query = """
    MATCH (n:CardHolder)-[r:USES]->(c1:CreditCard), (n)-[r:USES]->(c2:CreditCard)
    WHERE c1 <> c2
    RETURN n, collect(c1), collect(c2), n.email, n.phoneNumber
    """
   result, _, _ = driver.execute_query(query)
   return result

#Compras sospechosas:
# Gasto de grandes cantidades en comercios inusuales para el usuario
def unusual_spending(driver):
   query="""
    MATCH (n:CreditCard)-[r:MAKES]->(m:Transaction)-[r:IN]->(b:Business)
    WHERE NOT EXISTS {
        MATCH (n)-[r:MAKES]->(m:Transaction)-[r:IN]->(b2:Business)
        WHERE b2.type = b.type AND m.date > date() - duration({months: 6})
    }
    RETURN n, m, b
    """
   result, _, _ = driver.execute_query(query)
   return result

#Evaluacion de posibles fraudes
def fraud_detection(driver):
   possible_frauds = []
   #metodo 1
   result = multiple_channels(driver)
   if result:
      possible_frauds.append({'Tipo de Fraude':'Uso en multiples canales', 'casos':result})
   #metodo 2
   result = identity_network(driver)
   if result:
      possible_frauds.append({'Tipo de Fraude':'Redes de fraude', 'casos': result})
   #metodo 3
   result = unusual_spending(driver)
   if result:
      possible_frauds.append({'Tipo de Fraude':'Compas inusuales', 'casos':result})
   return possible_frauds