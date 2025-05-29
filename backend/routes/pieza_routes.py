from flask import Blueprint, request, jsonify
from utils.conexion_neo4j import Neo4jConnection
from services.registro_pieza import RegistroPieza
from services.estado_pieza import GestorEstadoPieza
from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel

pieza_bp = Blueprint('pieza_bp', __name__)

@pieza_bp.route('/pieza', methods=['POST'])
def crear_pieza():
    data = request.get_json()
    with Neo4jConnection().session() as session:
        registro = RegistroPieza(session)
        resultado = registro.registrar_pieza(data)
    return jsonify({
        "mensaje": "Pieza registrada exitosamente",
        "pieza_id": data['id'],
        "relaciones_creadas": resultado['conexiones_creadas']
    })

@pieza_bp.route('/pieza/<int:pieza_id>/estado', methods=['PATCH'])
def actualizar_estado(pieza_id):
    data = request.get_json()
    nuevo_estado = data.get("estado")
    with Neo4jConnection().session() as session:
        gestor = GestorEstadoPieza(session)
        resultado = gestor.cambiar_estado(pieza_id, nuevo_estado)
    return jsonify({
        "mensaje": "Estado actualizado y relaciones invalidadas" if resultado['estado_nuevo'] == "omitida" else "Estado actualizado",
        "pieza_id": pieza_id,
        "nuevo_estado": resultado['estado_nuevo'],
        "relaciones_actualizadas": resultado['relaciones_afectadas']
    })

@pieza_bp.route('/pieza/<int:pieza_id>', methods=['GET'])
def obtener_pieza(pieza_id):
    pieza = PiezaModel.obtenerPiezaId(pieza_id)
    relaciones = RelacionModel.obtenerRelacionesPieza(pieza_id)
    if not pieza:
        return jsonify({"error": "Pieza no encontrada"}), 404
    pieza_data = pieza['p'] if 'p' in pieza else pieza
    pieza_data['relaciones'] = relaciones
    return jsonify(pieza_data)

@pieza_bp.route('/pieza/<int:pieza_id>', methods=['DELETE'])
def eliminar_pieza(pieza_id):
    RelacionModel.eliminarRelacionesPieza(pieza_id)
    result = PiezaModel.eliminarPieza(pieza_id)
    return jsonify({
        "mensaje": "Pieza y relaciones eliminadas correctamente",
        "pieza_id": pieza_id,
        "relaciones_eliminadas": 2
    })