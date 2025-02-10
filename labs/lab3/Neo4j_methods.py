def clean_db(driver):
    query = """
    MATCH (n) DETACH DELETE n;
    """
    driver.execute_query(
        query
    )
    print(f"Se ha creado limpiado la base de datos")
    driver.close()

def crear_nodo_en_db(driver, nodo):
    propiedades = nodo.ge_propiedades_dic()

   
    query = f"""
    CREATE (n:{nodo.nombre_clase} {{ {", ".join(f"{k}: ${k}" for k in propiedades)} }})
    RETURN n
    """


    driver.execute_query(query, propiedades)
    driver.close()

def crear_relacion_en_db(driver, relacion):
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
    print(f"Se ha creado la relación {relacion.nombre_clase} entre {relacion.nodo_a.nombre_clase} y {relacion.nodo_b.nombre_clase} en la base de datos.")

    driver.close()


