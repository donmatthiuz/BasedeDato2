from fastapi import APIRouter, HTTPException
from services.sugerencia import sugerir_siguiente
from services.estado_pieza import cambiar_estado_pieza
from utils.conexion_neo4j import Neo4jConnection

router = APIRouter()
driver = Neo4jConnection().conectar()

@router.get("/sugerencia/{id}")
def obtener_sugerencia(id: int):
    sugerencia = sugerir_siguiente(driver, id)
    
    if "error" in sugerencia:
        raise HTTPException(status_code=400, detail=sugerencia["error"])
    
    if "pieza_siguiente" in sugerencia:
        try:
            cambiar_estado_pieza(driver, sugerencia["pieza_siguiente"], "ensamblada")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al actualizar estado: {e}")
    
    return sugerencia

@router.post("/iniciar/{id}")
def iniciar_ensamblaje(id: int):
    try:
        cambiar_estado_pieza(driver, id, "ensamblada")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo iniciar con la pieza: {e}")

    sugerencia = sugerir_siguiente(driver, id)

    if "error" in sugerencia:
        return {"mensaje": "Pieza inicial ensamblada, pero no hay sugerencias inmediatas"}

    # Marcar la sugerida como ensamblada automáticamente
    if "pieza_siguiente" in sugerencia:
        try:
            cambiar_estado_pieza(driver, sugerencia["pieza_siguiente"], "ensamblada")
        except Exception as e:
            return {
                "sugerencia": sugerencia,
                "advertencia": f"La sugerencia fue generada, pero no se pudo ensamblar automáticamente: {e}"
            }

    return sugerencia
