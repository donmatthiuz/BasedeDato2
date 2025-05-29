from fastapi import APIRouter, HTTPException
from services.sugerencia import sugerirSiguiente
from services.estado_pieza import cambiarEstadoPieza
from utils.conexion_neo4j import Neo4jConnection

router = APIRouter()
driver = Neo4jConnection().conectar()

@router.get("/sugerencia/{id_pieza}")
def obtenerSugerencia(id_pieza: int):
    """
    Genera una sugerencia de ensamblaje basada en la pieza dada.
    Si hay una pieza candidata, también actualiza su estado a 'ensamblada'.
    """
    sugerencia = sugerirSiguiente(driver, id_pieza)

    if "error" in sugerencia:
        raise HTTPException(status_code=400, detail=sugerencia["error"])

    if "pieza_siguiente" in sugerencia:
        try:
            cambiarEstadoPieza(driver, sugerencia["pieza_siguiente"], "ensamblada")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al actualizar estado: {e}")

    return sugerencia


@router.post("/iniciar/{id_pieza}")
def iniciarEnsamblaje(id_pieza: int):
    """
    Marca la pieza inicial como ensamblada e intenta sugerir la siguiente.
    Si hay sugerencia, también la marca como ensamblada.
    """
    try:
        cambiarEstadoPieza(driver, id_pieza, "ensamblada")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo iniciar con la pieza: {e}")

    sugerencia = sugerirSiguiente(driver, id_pieza)

    if "error" in sugerencia:
        return {"mensaje": "Pieza inicial ensamblada, pero no hay sugerencias inmediatas"}

    if "pieza_siguiente" in sugerencia:
        try:
            cambiarEstadoPieza(driver, sugerencia["pieza_siguiente"], "ensamblada")
        except Exception as e:
            return {
                "sugerencia": sugerencia,
                "advertencia": f"La sugerencia fue generada, pero no se pudo ensamblar automáticamente: {e}"
            }

    return sugerencia