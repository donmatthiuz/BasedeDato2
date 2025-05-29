from utils.conexion_neo4j import Neo4jConnection

class RelacionModel:
  
    """
    Modelo encargado de gestionar las relaciones CONECTA_CON entre piezas del rompecabezas.
    """

    @staticmethod
    def crearConexion(origen_id, destino_id, desde_lado, hacia_lado, pico_origen, hendidura_destino, valida=True):
        """
        Crea o actualiza una relación CONECTA_CON entre dos piezas.

        Parámetros:
            origen_id (int): ID de la pieza de origen.
            destino_id (int): ID de la pieza destino.
            desde_lado (str): Lado desde el cual parte la conexión (top, right, bottom, left).
            hacia_lado (str): Lado en el que la pieza destino recibe la conexión.
            pico_origen (int): Índice del pico usado en la pieza de origen.
            hendidura_destino (str): Letra de la hendidura usada en la pieza destino.
            valida (bool): Indica si la relación es válida activamente.

        Retorna:
            dict: Objeto con la relación creada o actualizada.
        """
        query = """
        MATCH (a:Pieza {id: $origen_id}), (b:Pieza {id: $destino_id})
        MERGE (a)-[r:CONECTA_CON {
            desde_lado: $desde_lado,
            hacia_lado: $hacia_lado
        }]->(b)
        SET r.pico_origen = $pico_origen,
            r.hendidura_destino = $hendidura_destino,
            r.valida = $valida
        RETURN r
        """
        conn = Neo4jConnection()
        result = conn.executeQuery(query, {
            "origen_id": origen_id,
            "destino_id": destino_id,
            "desde_lado": desde_lado,
            "hacia_lado": hacia_lado,
            "pico_origen": pico_origen,
            "hendidura_destino": hendidura_destino,
            "valida": valida
        }, single=True)
        conn.cerrar()
        return result

    @staticmethod
    def invalidarRelacionesPieza(pieza_id):
        """
        Invalida todas las relaciones CONECTA_CON de una pieza (salientes y entrantes).

        Parámetros:
            pieza_id (int): ID de la pieza afectada.

        Retorna:
            int: Número de relaciones salientes invalidadas (las entrantes también se invalidan).
        """
        query = """
        MATCH (a:Pieza {id: $id})-[r:CONECTA_CON]->()
        SET r.valida = false
        RETURN count(r) AS invalidadas
        """
        conn = Neo4jConnection()
        result = conn.executeQuery(query, {"id": pieza_id}, single=True)
        conn.executeQuery("""
        MATCH ()-[r:CONECTA_CON]->(a:Pieza {id: $id})
        SET r.valida = false
        """, {"id": pieza_id})
        conn.cerrar()
        return result["invalidadas"]

    @staticmethod
    def obtenerRelacionesPieza(pieza_id):
        """
        Obtiene todas las relaciones salientes CONECTA_CON desde una pieza.

        Parámetros:
            pieza_id (int): ID de la pieza de origen.

        Retorna:
            list[dict]: Lista de relaciones con atributos relevantes.
        """
        query = """
        MATCH (a:Pieza {id: $id})-[r:CONECTA_CON]->(b:Pieza)
        RETURN b.id AS con_pieza, r.desde_lado, r.hacia_lado,
               r.pico_origen, r.hendidura_destino, r.valida
        ORDER BY con_pieza
        """
        conn = Neo4jConnection()
        result = conn.executeQuery(query, {"id": pieza_id})
        conn.cerrar()
        return result

    @staticmethod
    def eliminarRelacionesPieza(pieza_id):
        """
        Elimina completamente todas las relaciones CONECTA_CON (entrantes y salientes) de una pieza.

        Parámetros:
            pieza_id (int): ID de la pieza objetivo.

        Retorna:
            dict: Mensaje de confirmación.
        """
        query = """
        MATCH (a:Pieza {id: $id})-[r:CONECTA_CON]->()
        DELETE r
        """
        conn = Neo4jConnection()
        conn.executeQuery(query, {"id": pieza_id})
        conn.executeQuery("""
        MATCH ()-[r:CONECTA_CON]->(a:Pieza {id: $id})
        DELETE r
        """, {"id": pieza_id})
        conn.cerrar()
        return {"mensaje": f"Relaciones de la pieza {pieza_id} eliminadas"}
