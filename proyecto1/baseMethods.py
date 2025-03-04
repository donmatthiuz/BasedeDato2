from Grafo import *
from neo4j import *
#Borrar todos los conteidos de la base de datos
def clean_db(driver):
    query = """
    MATCH (n) DETACH DELETE n;
    """
    driver.execute_query(
        query
    )
    print(f"Se ha borrado todo en la base de datos")
#crear nodo
def create_nodo(driver, nodo):
    propiedades = nodo.ge_propiedades_dic()
    query = f"""
    CREATE (n:{nodo.nombre_clase} {{ {", ".join(f"{k}: ${k}" for k in propiedades)} }})
    RETURN n
    """
    driver.execute_query(query, propiedades)
    print(f"Se ha creado el nodo {nodo.nombre_clase}")
#crear relacion
def create_relation(driver, relacion):
    atributos = relacion.propiedades
    propiedades = ", ".join([f"{k}: '{v}'" for k, v in atributos.items()])
    
    propieades_nodoa, valora = relacion.nodo_a.obtener_primer_parametro()
    propieades_nodob, valorb = relacion.nodo_b.obtener_primer_parametro()
    
    query = f"""
    MATCH (a:{relacion.nodo_a.nombre_clase} {{{propieades_nodoa}: '{valora}'}}), 
          (b:{relacion.nodo_b.nombre_clase} {{{propieades_nodob}: '{valorb}'}}) 
    CREATE (a)-[r:{relacion.nombre_clase} {{ {propiedades} }}]->(b)
    """

    driver.execute_query(query)
    print(f"Se ha creado la relación {relacion.nombre_clase} entre {relacion.nodo_a.nombre_clase} y {relacion.nodo_b.nombre_clase}")

def transaction_record(driver, nodo):
    propiedad_transaccion = nodo.prop_tran()
    query = f"""
    CREATE (n:Transaction {{ {", ".join(f"{k}: ${k}" for k in propiedad_transaccion)} }})
    RETURN n
    """
    driver.execute_query(query, propiedad_transaccion)

def get_all(driver, nodo_name, limitation=25):
    query = f"MATCH (n:{nodo_name}) RETURN n LIMIT {limitation}"
    
    result, summary, _ = driver.execute_query(query, graph_objects=True)  # 🔥 Extraer solo el resultado

    nodo_clases = {
        "Customer": Customer,
        "Merchant": Merchant,
        "Bank_Account": Bank_Account,
        "Device": Device,
        "Transaction": Transactiones
    }

    nodos = []

    for record in result:  # Iterar sobre los registros devueltos
        node = record["n"]  # 🔥 Acceder correctamente al nodo

        
        clase = list(node.labels)[0]  # Obtener el primer label
        propiedades = node._properties  # Extraer propiedades del nodo
      

        if clase in nodo_clases:
            
            nodo_obj = nodo_clases[clase](**propiedades)  # Crear instancia de la clase correspondiente
            nodos.append(nodo_obj)

    driver.close()
    return nodos