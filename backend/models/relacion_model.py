from neo4j import GraphDatabase

class RelacionModel:
    """
    Modelo encargado de gestionar las relaciones CONECTA_CON entre nodos de tipo Pieza en la base de datos Neo4j.
    """

    def __init__(self, driver):
        """
        Inicializa el modelo con el driver de conexión a Neo4j.
        """
        self.driver = driver

    def crearConexion(self, idOrigen, idDestino, relacion):
        """
        Crea una relación CONECTA_CON entre dos piezas.

        Parámetros:
            idOrigen (int): ID de la pieza de origen.
            idDestino (int): ID de la pieza de destino.
            relacion (dict): Atributos de la relación:
                - desde_lado (str)
                - hacia_lado (str)
                - pico_origen (int)
                - hendidura_destino (str)
                - valida (bool)
        """
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
        params = {
            "id_origen": idOrigen,
            "id_destino": idDestino,
            **relacion
        }
        with self.driver.session() as session:
            session.run(query, **params)

    def invalidarConexionesPorPieza(self, idPieza):
        """
        Marca como inválidas todas las relaciones CONECTA_CON salientes de una pieza.

        Parámetros:
            idPieza (int): ID de la pieza cuya relaciones se desean invalidar.
        """
        query = """
        MATCH (a:Pieza {id_pieza: $id_pieza})-[r:CONECTA_CON]->(:Pieza)
        SET r.valida = false
        """
        with self.driver.session() as session:
            session.run(query, id_pieza=idPieza)

    def eliminarConexiones(self, idPieza):
        """
        Elimina todas las relaciones CONECTA_CON asociadas a una pieza (entrantes y salientes).

        Parámetros:
            idPieza (int): ID de la pieza cuyas relaciones serán eliminadas.
        """
        query = """
        MATCH (a:Pieza {id_pieza: $id_pieza})-[r:CONECTA_CON]-(:Pieza)
        DELETE r
        """
        with self.driver.session() as session:
            session.run(query, id_pieza=idPieza)
