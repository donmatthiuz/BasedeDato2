from Grafo import *
from neo4j import *
#Métodos de deteccion

#Compras sospechosas:
# Gasto de grandes cantidades en comercios inusuales
def unusual_spending(driver, transaction_id=None):
   if transaction_id:
      query="""
      MATCH (c:Customer)-[r1:PERFORMS]->(t:Transaction {transactionId: $transaction_id})-[r2:INVOLVES]->(m:Merchant)
      WHERE NOT EXISTS{
         MATCH (c)-[sub_r1:PERFORMS]->(t0:Transaction)-[sub_r2:INVOLVES]->(m2:Merchant)
         WHERE m2.merchantCategory = m.merchantCategory
         AND t0.transactionDate > date()-duration({months: 4})
      }
      AND t.isFraudTeoric = TRUE
      RETURN c.customerName AS Name, t.transactionId AS ID, t.transactionDescription AS Description, 
      m.merchantCategory AS Category, t.transactionAmount AS Amount, t.isFraudTeoric AS isFraud
      """
      params = {'transaction_id': transaction_id} if transaction_id else {}
   result, _, _ = driver.execute_query(query, params)
   return result

#Evaluacion de posibles casos
def fraud_detection(driver, transaction_id=None):
   possible_frauds = []
   #metodo
   result = unusual_spending(driver, transaction_id)
   if result:
      possible_frauds.append({'Tipo de Fraude':'Compras inusuales', 'casos':result})
   return possible_frauds