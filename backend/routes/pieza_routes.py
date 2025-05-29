from fastapi import APIRouter, HTTPException
from models.pieza_model import PiezaModel
from services.estado_pieza import cambiar_estado_pieza
from services.registro_pieza import registrar_pieza
from utils.conexion_neo4j import Neo4jConnection
from typing import List, Dict
from fastapi import Body

router = APIRouter()
conexion = Neo4jConnection()
driver = conexion.conectar()

@router.post("/pieza")
def crear_pieza(pieza_data: dict):
    try:
        registrar_pieza(driver, pieza_data)
        return {"mensaje": "Pieza registrada exitosamente"}
    except Exception as e:
        print(e)  # <-- AGREGAR ESTO
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pieza/{id}")
def obtener_pieza(id: int):
    pieza_model = PiezaModel(driver)
    result = pieza_model.obtener_pieza(id)
    if not result:
        raise HTTPException(status_code=404, detail="Pieza no encontrada")
    return result["p"]

@router.patch("/pieza/{id}")
def actualizar_estado(id: int, estado: dict):
    if "estado" not in estado:
        raise HTTPException(status_code=400, detail="Falta el campo 'estado'")
    cambiar_estado_pieza(driver, id, estado["estado"])
    return {"mensaje": "Estado actualizado"}

@router.delete("/pieza/{id}")
def eliminar_pieza(id: int):
    pieza_model = PiezaModel(driver)
    pieza_model.eliminar_pieza(id)
    return {"mensaje": "Pieza eliminada"}

from services.ensamblar_piezas import ensamblar_piezas

@router.post("/ensamblar")
def ensamblar():
    try:
        ensamblar_piezas(driver)
        return {"mensaje": "Relaciones generadas exitosamente"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/piezas")
def crear_varias_piezas(piezas: List[Dict] = Body(...)):
    exitosas = []
    fallidas = []

    for pieza_data in piezas:
        try:
            registrar_pieza(driver, pieza_data)
            exitosas.append(pieza_data["id"])
        except Exception as e:
            print(f"Error al insertar pieza {pieza_data['id']}: {e}")
            fallidas.append({"id": pieza_data["id"], "error": str(e)})

    return {
        "registradas": exitosas,
        "errores": fallidas
    }