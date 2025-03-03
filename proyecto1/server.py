from flask import Flask, request, jsonify
from dotenv import load_dotenv
from conn import connection
from baseMethods import clean_db, create_nodo, create_relation, transaction_record
import os

# Cargar variables de entorno desde .env
load_dotenv()

#Conexion Neo4j
URI = "neo4j+s://3b37977c.databases.neo4j.io"
AUTH = ("neo4j", "W_m4ObG8GYoBCCcUVjQTBJlGj44enIFNCPVgvR8GEb4")

app = Flask(__name__)
driver = connection(URI,AUTH)

# Configuración de Flask con variables de entorno
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

@app.route('/')
def home():
    return f"Flask está corriendo en modo: {os.getenv('FLASK_ENV')}"

@app.route('/clean_db', methods=['DELETE'])
def clean_database():
    clean_db(driver)
    return jsonify ({"Se ha limpiado la base de datos."})

@app.route('/create_nodo', methods=['POST'])
def creating_node():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se han encontrado datos"}), 400
    create_nodo(driver, data)
    return jsonify({"message": "Nodo creado exitosamente"})

@app.route('/create_relationship', methods=['POST'])
def creating_relationship():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se han encontrado datos'}), 400
    create_relation(driver, data)
    return jsonify({'message': 'Relacion creada exitosamente'})

@app.route('/transaction_log', method=['POST'])
def transaction_registration():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se han encontrado datos'}), 400
    transaction_record(driver, data)
    return jsonify({'message':'Transaccion registrada'})

if __name__ == '__main__':
    app.run(debug=True)
