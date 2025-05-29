from fastapi import APIRouter, HTTPException
from services.sugerencia import sugerir_siguiente
from utils.conexion_neo4j import Neo4jConnection

router = APIRouter()
driver = Neo4jConnection().conectar()

@router.get("/sugerencia/{id}")
def obtener_sugerencia(id: int):
    sugerencia = sugerir_siguiente(driver, id)
    if "error" in sugerencia:
        raise HTTPException(status_code=400, detail=sugerencia["error"])
    return sugerencia
