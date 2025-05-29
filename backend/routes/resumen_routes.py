from fastapi import APIRouter, HTTPException
from utils.conexion_neo4j import Neo4jConnection

router = APIRouter()
driver = Neo4jConnection().conectar()

@router.get("/ensamblado")
def obtenerPiezasEnsambladas():
    """
    Retorna todas las piezas que actualmente están en estado 'ensamblada'.

    Returns:
        List[dict]: Lista de nodos Pieza ensamblados.
    """
    query = "MATCH (p:Pieza {estado: 'ensamblada'}) RETURN p"
    with driver.session() as session:
        result = session.run(query)
        return [record["p"] for record in result]


@router.get("/relaciones")
def obtenerRelacionesActivas():
    """
    Retorna todas las relaciones válidas (valida = true) de tipo CONECTA_CON entre piezas.
    Cada relación incluye la información sobre el origen, destino, lados conectados,
    y el pico y la hendidura usados.

    Returns:
        List[dict]: Lista de relaciones activas con detalle.
    """
    query = """
    MATCH (a:Pieza)-[r:CONECTA_CON {valida: true}]->(b:Pieza)
    RETURN 
        a.id_pieza AS origen, 
        r.desde_lado AS desde, 
        r.pico_origen AS pico,
        b.id_pieza AS destino, 
        r.hacia_lado AS hacia, 
        r.hendidura_destino AS hendidura
    """
    with driver.session() as session:
        result = session.run(query)
        return [record.data() for record in result]
    
@router.post("/reset")
def resetear_armado():
    """
    Cambia el estado de todas las piezas a 'libre'.
    Ideal para reiniciar el proceso de ensamblaje.
    """
    query = "MATCH (p:Pieza) SET p.estado = 'libre'"
    try:
        with driver.session() as session:
            session.run(query)
        return {"mensaje": "Todos los nodos fueron reiniciados a 'libre' exitosamente."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al resetear armado: {e}")
