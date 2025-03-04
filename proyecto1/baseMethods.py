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




def add_more_node_properties(driver, class_name, param_name, param_value, extra_properties={}):
    try:
        set_clause = ", ".join([f"n.{key} = ${key}" for key in extra_properties])

        query = f"""
        MATCH (n:{class_name} {{ {param_name}: $param_value }})
        SET {set_clause}
        RETURN n
        """

        params = {"param_value": param_value, **extra_properties}

        driver.execute_query(query, params)

        print(f"Nodo {class_name} con {param_name}={param_value} actualizado con nuevas propiedades: {extra_properties}")

    except Exception as e:
        print(f"Error al actualizar el nodo {class_name}: {e}")



def create_relation_extraproperties(driver, relacion, extra_properties={}):
    try:

        atributos = relacion.propiedades
        propiedades_base = ", ".join([f"{k}: '{v}'" for k, v in atributos.items()])


        propiedades_extra = ", ".join([f"{k}: ${k}" for k in extra_properties])
        propiedades_finales = f"{propiedades_base}, {propiedades_extra}" if propiedades_extra else propiedades_base


        prop_nodoa, valora = relacion.nodo_a.obtener_primer_parametro()
        prop_nodob, valorb = relacion.nodo_b.obtener_primer_parametro()


        query = f"""
        MATCH (a:{relacion.nodo_a.nombre_clase} {{{prop_nodoa}: '{valora}'}}), 
              (b:{relacion.nodo_b.nombre_clase} {{{prop_nodob}: '{valorb}'}})
        CREATE (a)-[r:{relacion.nombre_clase} {{ {propiedades_finales} }}]->(b)
        RETURN r
        """


        driver.execute_query(query, extra_properties)

        print(f"✅ Relación {relacion.nombre_clase} creada entre {relacion.nodo_a.nombre_clase} y {relacion.nodo_b.nombre_clase} con propiedades: {extra_properties}")

    except Exception as e:
        print(f"❌ Error al crear la relación {relacion.nombre_clase}: {e}")



def update_nodo_properties(driver, nodo):
    """
    Actualiza las propiedades de un nodo existente en la base de datos.
    La clave para identificar el nodo será el primer parámetro del nodo.
    """
    propiedades = nodo.ge_propiedades_dic()  # Obtener las propiedades del nodo.
    param_name, param_value = nodo.obtener_primer_parametro()  # Obtener el primer parámetro (clave) para identificar el nodo.

    # Construir la consulta SET para actualizar las propiedades del nodo
    set_clause = ", ".join([f"n.{k} = ${k}" for k in propiedades])  # Para cada propiedad, se genera la sintaxis SET.

    query = f"""
    MATCH (n:{nodo.nombre_clase} {{ {param_name}: $param_value }})
    SET {set_clause}
    RETURN n
    """

    params = {"param_value": param_value, **propiedades}  # Parametros para la consulta (valor del parámetro y las nuevas propiedades).
    
    try:
        driver.execute_query(query, params)  # Ejecutar la consulta.
        print(f"Se ha actualizado el nodo {nodo.nombre_clase} con las propiedades: {propiedades}")
    except Exception as e:
        print(f"Error al actualizar el nodo {nodo.nombre_clase}: {e}")



def remove_property(driver, node_class, param_name, param_value, property_name):
    """
    Elimina una propiedad de un nodo en Neo4j.
    
    :param driver: El controlador de la base de datos Neo4j.
    :param node_class: El tipo de nodo, por ejemplo, 'Customer'.
    :param param_name: El nombre del parámetro por el cual buscar el nodo (por ejemplo, 'customerId').
    :param param_value: El valor del parámetro para buscar el nodo.
    :param property_name: El nombre de la propiedad que se desea eliminar.
    :return: Mensaje de éxito o error.
    """
    with driver.session() as session:
        query = f"""
        MATCH (n:{node_class} {{{param_name}: $param_value}})
        REMOVE n.{property_name}
        """
        result = session.run(query, param_value=param_value)
        
        # Verificar si la propiedad se eliminó
        if result.summary().counters.nodes_deleted == 0:
            return f"No se encontró la propiedad {property_name} o el nodo con {param_name} = {param_value}."
        else:
            return f"Propiedad {property_name} eliminada exitosamente del nodo {node_class}."
        



def remove_node(driver, class_name, param_name, param_value):
    """
    Elimina un nodo y todas sus relaciones en Neo4j basado en una condición específica.
    
    :param driver: El controlador de la base de datos Neo4j.
    :param class_name: El tipo de nodo, por ejemplo, 'Customer'.
    :param param_name: El nombre del parámetro por el cual buscar el nodo (por ejemplo, 'customerId').
    :param param_value: El valor del parámetro para buscar el nodo.
    :return: Mensaje de éxito o error.
    """
    with driver.session() as session:
        query = f"""
        MATCH (n:{class_name} {{{param_name}: $param_value}})
        DETACH DELETE n
        """
        
        # Ejecutar la consulta para eliminar el nodo y sus relaciones
        session.run(query, param_value=param_value)
        
        return f"El nodo {class_name} con {param_name} = {param_value} y sus relaciones fueron eliminados exitosamente."
