from flask import Blueprint, jsonify
from utils.conexion_neo4j import Neo4jConnection
from neo4j import Session

resumen_bp = Blueprint('resumen_bp', __name__)

@resumen_bp.route('/ensamblado', methods=['GET'])
def resumen_ensamblado():
    query = """
    MATCH (p:Pieza)
    RETURN p.id AS id, p.estado AS estado, p.coordenada_x AS coordenada_x, p.coordenada_y AS coordenada_y
    ORDER BY p.id
    """
    conn = Neo4jConnection()
    piezas = conn.executeQuery(query)
    conn.cerrar()
    return jsonify(piezas)

@resumen_bp.route('/relaciones', methods=['GET'])
def relaciones_actuales():
    query = """
    MATCH (p1:Pieza)-[r:CONECTA_CON]->(p2:Pieza)
    RETURN p1.id AS pieza_origen, p2.id AS pieza_destino, r.desde_lado, r.hacia_lado, r.pico_origen AS pico, r.hendidura_destino AS hendidura, r.valida
    ORDER BY pieza_origen, pieza_destino
    """
    conn = Neo4jConnection()
    relaciones = conn.executeQuery(query)
    conn.cerrar()
    return jsonify(relaciones)
