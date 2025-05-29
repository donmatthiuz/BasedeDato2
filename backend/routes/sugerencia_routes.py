from flask import Blueprint, jsonify
from utils.conexion_neo4j import Neo4jConnection
from services.sugerencia import AlgoritmoSugerencia

sugerencia_bp = Blueprint('sugerencia_bp', __name__)

@sugerencia_bp.route('/sugerencia/<int:pieza_id>', methods=['GET'])
def sugerencia_para_pieza(pieza_id):
    with Neo4jConnection().session() as session:
        algoritmo = AlgoritmoSugerencia(session)
        resultado = algoritmo.sugerir_siguiente_movimiento(pieza_id)
    return jsonify(resultado)
