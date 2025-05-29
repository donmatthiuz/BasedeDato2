from fastapi import APIRouter, HTTPException, Body, UploadFile, File
from typing import List, Dict
from models.pieza_model import PiezaModel
from services.estado_pieza import cambiarEstadoPieza
from services.registro_pieza import registrarPieza
from services.ensamblar_piezas import ensamblarPiezas
from utils.conexion_neo4j import Neo4jConnection
import tempfile
import os

router = APIRouter()
conexion = Neo4jConnection()
driver = conexion.conectar()

@router.post("/pieza")
def crearPieza(piezaData: dict):
    """
    Crea una nueva pieza y genera conexiones con vecinos inmediatos.
    """
    try:
        registrarPieza(driver, piezaData)
        return {"mensaje": "Pieza registrada exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pieza/{idPieza}")
def obtenerPieza(idPieza: int):
    """
    Retorna los atributos de una pieza por su ID.
    """
    piezaModel = PiezaModel(driver)
    result = piezaModel.obtenerPieza(idPieza)
    if not result:
        raise HTTPException(status_code=404, detail="Pieza no encontrada")
    return result["p"]


@router.patch("/pieza/{idPieza}")
def actualizarEstado(idPieza: int, estado: dict):
    """
    Actualiza el estado de una pieza ("libre", "ensamblada", "omitida").
    Si se omite, invalida todas sus conexiones.
    """
    if "estado" not in estado:
        raise HTTPException(status_code=400, detail="Falta el campo 'estado'")
    cambiarEstadoPieza(driver, idPieza, estado["estado"])
    return {"mensaje": "Estado actualizado"}


@router.delete("/pieza/{idPieza}")
def eliminarPieza(idPieza: int):
    """
    Elimina una pieza y sus relaciones de forma segura.
    """
    piezaModel = PiezaModel(driver)
    piezaModel.eliminarPieza(idPieza)
    return {"mensaje": "Pieza eliminada"}


@router.post("/ensamblar")
def ensamblarTodas():
    """
    Intenta ensamblar automáticamente todas las piezas posibles.
    """
    try:
        ensamblarPiezas(driver)
        return {"mensaje": "Relaciones generadas exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/piezas")
def crearMultiplesPiezas(piezas: List[Dict] = Body(...)):
    """
    Crea múltiples piezas en lote y reporta cuáles fallaron.
    """
    exitosas, fallidas = [], []

    for piezaData in piezas:
        try:
            registrarPieza(driver, piezaData)
            exitosas.append(piezaData["id_pieza"])
        except Exception as e:
            fallidas.append({"id_pieza": piezaData.get("id_pieza", "?"), "error": str(e)})

    return {"registradas": exitosas, "errores": fallidas}


@router.post("/pieza/csv")
def cargarPiezasDesdeCsv(file: UploadFile = File(...)):
    """
    Carga piezas desde un archivo CSV. Campos requeridos: 
    id_pieza, coordenada_x, coordenada_y, cantidad_picos, cantidad_hendiduras, bordes, estado, vecinos
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv", mode="wb") as tempFile:
            contents = file.file.read()
            tempFile.write(contents)
            tempPath = tempFile.name

        piezaModel = PiezaModel(driver)
        piezaModel.cargarDesdeCsv(tempPath)
        os.remove(tempPath)

        return {"mensaje": "Piezas cargadas desde CSV exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/reset-db")
def borrarTodaLaBase():
    """
    Borra todos los nodos y relaciones de la base de datos.
    """
    try:
        with driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
        return {"mensaje": "Base de datos limpiada exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al limpiar la base de datos: {e}")
