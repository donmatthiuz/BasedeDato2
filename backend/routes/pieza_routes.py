from fastapi import APIRouter, HTTPException, Body, UploadFile, File
from typing import List, Dict
from models.pieza_model import PiezaModel
from services.estado_pieza import cambiar_estado_pieza
from services.registro_pieza import registrar_pieza
from services.ensamblar_piezas import ensamblar_piezas
import tempfile
import shutil
import os
from utils.conexion_neo4j import Neo4jConnection



router = APIRouter()
conexion = Neo4jConnection()
driver = conexion.conectar()

@router.post("/pieza")
def crear_pieza(pieza_data: dict):
    try:
        registrar_pieza(driver, pieza_data)
        return {"mensaje": "Pieza registrada exitosamente"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pieza/{id_pieza}")
def obtener_pieza(id_pieza: int):
    pieza_model = PiezaModel(driver)
    result = pieza_model.obtener_pieza(id_pieza)
    if not result:
        raise HTTPException(status_code=404, detail="Pieza no encontrada")
    return result["p"]


@router.patch("/pieza/{id_pieza}")
def actualizar_estado(id_pieza: int, estado: dict):
    if "estado" not in estado:
        raise HTTPException(status_code=400, detail="Falta el campo 'estado'")
    cambiar_estado_pieza(driver, id_pieza, estado["estado"])
    return {"mensaje": "Estado actualizado"}


@router.delete("/pieza/{id_pieza}")
def eliminar_pieza(id_pieza: int):
    pieza_model = PiezaModel(driver)
    pieza_model.eliminar_pieza(id_pieza)
    return {"mensaje": "Pieza eliminada"}


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
            exitosas.append(pieza_data["id_pieza"])
        except Exception as e:
            print(f"Error al insertar pieza {pieza_data.get('id_pieza', '?')}: {e}")
            fallidas.append({"id_pieza": pieza_data.get("id_pieza", "?"), "error": str(e)})

    return {
        "registradas": exitosas,
        "errores": fallidas
    }

@router.post("/pieza/csv")
def cargar_piezas_csv(file: UploadFile = File(...)):
    try:
        # Crea un archivo temporal de forma segura, sin asumir ruta
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv", mode="wb") as temp_file:
            contents = file.file.read()
            temp_file.write(contents)
            temp_path = temp_file.name

        pieza_model = PiezaModel(driver)
        pieza_model.cargar_desde_csv(temp_path)

        os.remove(temp_path)
        return {"mensaje": "Piezas cargadas desde CSV exitosamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/reset-db")
def borrar_todo():
    try:
        with driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
        return {"mensaje": "Base de datos limpiada exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al limpiar la base de datos: {e}")