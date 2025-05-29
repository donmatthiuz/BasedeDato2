from neo4j import GraphDatabase

class RelacionModel:
    def __init__(self, driver):
        self.driver = driver

    def crear_conexion(self, id_origen, id_destino, relacion):
        query = """
        MATCH (a:Pieza {id_pieza: $id_origen}), (b:Pieza {id_pieza: $id_destino})
        CREATE (a)-[:CONECTA_CON {
            desde_lado: $desde_lado,
            hacia_lado: $hacia_lado,
            pico_origen: $pico_origen,
            hendidura_destino: $hendidura_destino,
            valida: $valida
        }]->(b)
        """
        params = {"id_origen": id_origen, "id_destino": id_destino, **relacion}
        with self.driver.session() as session:
            session.run(query, **params)

    def invalidar_conexiones_por_pieza(self, id_pieza):
        query = """
        MATCH (a:Pieza {id_pieza: $id_pieza})-[r:CONECTA_CON]->(:Pieza)
        SET r.valida = false
        """
        with self.driver.session() as session:
            session.run(query, id_pieza=id_pieza)

    def eliminar_conexiones(self, id_pieza):
        query = """
        MATCH (a:Pieza {id_pieza: $id_pieza})-[r:CONECTA_CON]-(:Pieza)
        DELETE r
        """
        with self.driver.session() as session:
            session.run(query, id_pieza=id_pieza)
