from utils.conexion_neo4j import Neo4jConnection

class PiezaModel:
    """
    Modelo encargado de gestionar los nodos de tipo Pieza en la base de datos Neo4j.
    """

    @staticmethod
    def crearPieza(data):
        """
        Crea una nueva pieza en la base de datos.

        Parámetros:
            data (dict): Diccionario con las claves:
                - id (int)
                - coordenada_x (int)
                - coordenada_y (int)
                - cantidad_picos (int)
                - cantidad_hendiduras (int)
                - bordes (list[str]) - lados donde no hay conexión: "top", "right", "bottom", "left"
                - estado (str): "libre", "ensamblada" u "omitida"

        Retorna:
            dict: Nodo creado con sus atributos.
        """
        query = """
        CREATE (p:Pieza {
            id: $id,
            coordenada_x: $coordenada_x,
            coordenada_y: $coordenada_y,
            cantidad_picos: $cantidad_picos,
            cantidad_hendiduras: $cantidad_hendiduras,
            bordes: $bordes,
            estado: $estado
        })
        RETURN p
        """
        conn = Neo4jConnection()
        result = conn.executeQuery(query, data, single=True)
        conn.cerrar()
        return result

    @staticmethod
    def obtenerPiezaId(pieza_id):
        """
        Obtiene una pieza según su ID.

        Parámetros:
            pieza_id (int): Identificador de la pieza.

        Retorna:
            dict: Datos del nodo de la pieza (si existe), o None.
        """
        query = """
        MATCH (p:Pieza {id: $id})
        RETURN p
        """
        conn = Neo4jConnection()
        result = conn.executeQuery(query, {"id": pieza_id}, single=True)
        conn.cerrar()
        return result

    @staticmethod
    def actualizarEstado(pieza_id, nuevo_estado):
        """
        Actualiza el estado de una pieza (ensamblada, libre u omitida).

        Parámetros:
            pieza_id (int): Identificador de la pieza.
            nuevo_estado (str): Nuevo estado a asignar.

        Retorna:
            dict: Pieza actualizada con el nuevo estado.
        """
        query = """
        MATCH (p:Pieza {id: $id})
        SET p.estado = $estado
        RETURN p
        """
        conn = Neo4jConnection()
        result = conn.executeQuery(query, {
            "id": pieza_id,
            "estado": nuevo_estado
        }, single=True)
        conn.cerrar()
        return result

    @staticmethod
    def eliminarPieza(pieza_id):
        """
        Elimina una pieza junto con todas sus relaciones.

        Parámetros:
            pieza_id (int): Identificador de la pieza.

        Retorna:
            dict: Mensaje de confirmación.
        """
        query = """
        MATCH (p:Pieza {id: $id})
        DETACH DELETE p
        """
        conn = Neo4jConnection()
        conn.executeQuery(query, {"id": pieza_id})
        conn.cerrar()
        return {"mensaje": f"Pieza {pieza_id} eliminada correctamente"}
