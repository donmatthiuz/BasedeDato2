from neo4j import GraphDatabase
import pandas as pd


URI = "neo4j+s://d31e7fbe.databases.neo4j.io"
USER = "neo4j"
PASSWORD = "7HR_sUARNd_L_N_ca5dDJ2YP-KhqcJvztDzXTkyIo5w"

driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

def get_labels(tx):
    result = tx.run("MATCH (n) RETURN DISTINCT labels(n) AS labels")
    return [record['labels'] for record in result]

def get_relationship_types(tx):
    result = tx.run("MATCH ()-[r]->() RETURN DISTINCT type(r) AS type")
    return [record['type'] for record in result]

def export_nodes(tx, label):
    query = f"MATCH (n:{label}) RETURN n"
    result = tx.run(query)
    

    data = []
    for record in result:
        node_data = record['n'].items()  # Extraer propiedades del nodo
        data.append(dict(node_data))
    
    # Convertir a DataFrame y guardar como CSV
    if data:
        df = pd.DataFrame(data)
        df.to_csv(f"{label}_nodes.csv", index=False)

def export_relationships(tx, rel_type):
    # Exportar todas las relaciones de un tipo específico
    query = f"MATCH (a)-[r:{rel_type}]->(b) RETURN type(r) AS type, properties(r) AS properties, a, b"
    result = tx.run(query)
    
    # Convertir los resultados a un DataFrame de Pandas
    data = []
    for record in result:
        rel_type = record['type']
        properties = record['properties']
        
        # Desglosar las propiedades en columnas separadas
        properties_flat = {key: value for key, value in properties.items()} if properties else {}
        
        # Incluir las propiedades de la relación
        row = {'type': rel_type, 'a': record['a']['name'] if 'name' in record['a'] else None, 
               'b': record['b']['name'] if 'name' in record['b'] else None}
        row.update(properties_flat)  # Añadir las propiedades a la fila
        data.append(row)
    
    # Convertir a DataFrame y guardar como CSV
    if data:
        df = pd.DataFrame(data)
        df.to_csv(f"{rel_type}_relationships.csv", index=False)

# Ejecutar el script
with driver.session() as session:
    # 1. Obtener todas las etiquetas de nodos
    labels = session.read_transaction(get_labels)

    # 2. Exportar nodos para cada etiqueta
    for label_list in labels:
        for label in label_list:
            session.write_transaction(export_nodes, label)

    # 3. Obtener todos los tipos de relaciones
    rel_types = session.read_transaction(get_relationship_types)

    # 4. Exportar relaciones para cada tipo
    for rel_type in rel_types:
        session.write_transaction(export_relationships, rel_type)

print("Exportación completada con éxito.")
driver.close()
