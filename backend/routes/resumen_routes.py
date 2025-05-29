from fastapi import APIRouter
from utils.conexion_neo4j import Neo4jConnection

router = APIRouter()
driver = Neo4jConnection().conectar()

@router.get("/ensamblado")
def piezas_ensambladas():
    query = "MATCH (p:Pieza {estado: 'ensamblada'}) RETURN p"
    with driver.session() as session:
        result = session.run(query)
        return [record["p"] for record in result]

@router.get("/relaciones")
def relaciones_activas():
    query = """
    MATCH (a:Pieza)-[r:CONECTA_CON {valida: true}]->(b:Pieza)
    RETURN a.id_pieza AS origen, r.desde_lado AS desde, r.pico_origen AS pico,
           b.id_pieza AS destino, r.hacia_lado AS hacia, r.hendidura_destino AS hendidura
    """
    with driver.session() as session:
        result = session.run(query)
        return [record.data() for record in result]
