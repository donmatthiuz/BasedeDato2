from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel

def cambiarEstadoPieza(driver, idPieza, nuevoEstado):
    """
    Cambia el estado de una pieza en la base de datos.
    Si el nuevo estado es 'omitida', se invalidan las relaciones de conexión de la pieza.

    Parámetros:
        driver: Conexión activa a Neo4j.
        idPieza (int): ID único de la pieza.
        nuevoEstado (str): Nuevo estado a asignar ('libre', 'ensamblada', 'omitida', etc.).
    """
    piezaModel = PiezaModel(driver)
    relacionModel = RelacionModel(driver)

    # Actualizar el estado de la pieza
    piezaModel.actualizarPieza(idPieza, {"estado": nuevoEstado})

    # Invalidar conexiones si el nuevo estado es 'omitida'
    if nuevoEstado == "omitida":
        relacionModel.invalidarConexionesPorPieza(idPieza)
