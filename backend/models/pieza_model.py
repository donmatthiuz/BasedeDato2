from neo4j import GraphDatabase
import json

class PiezaModel:
    def __init__(self, driver):
        self.driver = driver

    def crear_pieza(self, pieza_data):
        pieza_data = pieza_data.copy()
        pieza_data["vecinos"] = json.dumps(pieza_data.get("vecinos", {}))  # Convertir a string

        query = """
        CREATE (p:Pieza {
            id: $id,
            coordenada_x: $coordenada_x,
            coordenada_y: $coordenada_y,
            cantidad_picos: $cantidad_picos,
            cantidad_hendiduras: $cantidad_hendiduras,
            bordes: $bordes,
            estado: $estado,
            vecinos: $vecinos
        })
        """
        with self.driver.session() as session:
            session.run(query, **pieza_data)

    def obtener_pieza(self, id):
        query = "MATCH (p:Pieza {id: $id}) RETURN p"
        with self.driver.session() as session:
            result = session.run(query, id=id)
            return result.single()

    def actualizar_pieza(self, id, nuevos_datos):
        set_clause = ", ".join([f"p.{k} = ${k}" for k in nuevos_datos.keys()])
        query = f"MATCH (p:Pieza {{id: $id}}) SET {set_clause} RETURN p"
        with self.driver.session() as session:
            result = session.run(query, id=id, **nuevos_datos)
            return result.single()

    def eliminar_pieza(self, id):
        query = "MATCH (p:Pieza {id: $id}) DETACH DELETE p"
        with self.driver.session() as session:
            session.run(query, id=id)
