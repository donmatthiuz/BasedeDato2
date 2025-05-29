from fastapi import APIRouter
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