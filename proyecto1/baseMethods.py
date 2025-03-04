import neo4j
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
    result, summary, _ = driver.execute_query(query, graph_objects=True) 

    nodo_clases = {
        "Customer": Customer,
        "Merchant": Merchant,
        "Bank_Account": Bank_Account,
        "Device": Device,
        "Transaction": Transactiones
    }

    nodos = []

    for record in result:
        node = record["n"]  
        clase = list(node.labels)[0]  
        propiedades = node._properties  

        # 🔥 Convertir valores de tipo Date a string (YYYY-MM-DD)
        for key, value in propiedades.items():
            if isinstance(value, neo4j.time.Date):
                propiedades[key] = value.iso_format()  # "YYYY-MM-DD"

        if clase in nodo_clases:
            nodo_obj = nodo_clases[clase](**propiedades)  
            nodos.append(nodo_obj)

    driver.close()
    return nodos  



def get_node(driver, class_name, param_name, param_value):
    try:
        query = f"""
        MATCH (n:{class_name} {{ {param_name}: $param_value }})
        RETURN n
        """
        result, _, _ = driver.execute_query(query, {"param_value": param_value}, graph_objects=True)

        nodo_clases = {
            "Customer": Customer,
            "Merchant": Merchant,
            "Bank_Account": Bank_Account,
            "Device": Device,
            "Transaction": Transactiones
        }

        if result:
            node = result[0]["n"]
            clase = list(node.labels)[0]  
            propiedades = node._properties  

            # Convertir valores de tipo Date a string (YYYY-MM-DD)
            for key, value in propiedades.items():
                if isinstance(value, neo4j.time.Date):
                    propiedades[key] = value.iso_format()

            if clase in nodo_clases:
                nodo_obj = nodo_clases[clase](**propiedades)
                print(f"Nodo encontrado y convertido: {nodo_obj}")
                return nodo_obj
            else:
                print(f"Advertencia: Nodo '{clase}' no está definido en nodo_clases")
                return None
        else:
            print(f"No se encontró el nodo {class_name} con {param_name} = {param_value}")
            return None

    except Exception as e:
        print(f"Error al obtener el nodo {class_name}: {e}")
        return None
