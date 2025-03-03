from flask import Flask, jsonify
from dotenv import load_dotenv
from conn import connection
from baseMethods import *
from flask_cors import CORS

import os

# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

# Configuración de Flask con variables de entorno
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

@app.route('/')
def home():
    return f"Flask está corriendo en modo: {os.getenv('FLASK_ENV')}"



@app.route('/get_customers')
def customers():
    driver = connection()
    nodos = get_all(driver, 'Customer', limitation=200)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.ge_propiedades_dic() for n in nodos]

    driver.close()
    
    # Retornar JSON con los nodos
    return jsonify(nodos_dict)


@app.route('/get_devices')
def devices():
    driver = connection()
    nodos = get_all(driver, 'Device', limitation=10)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.ge_propiedades_dic() for n in nodos]

    driver.close()
    
    # Retornar JSON con los nodos
    return jsonify(nodos_dict)

@app.route('/get_accounts')
def accounts():
    driver = connection()
    nodos = get_all(driver, 'Bank_Account', limitation=10)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.ge_propiedades_dic() for n in nodos]

    driver.close()
    
    # Retornar JSON con los nodos
    return jsonify(nodos_dict)

@app.route('/get_comerciantes')
def merchants():
    driver = connection()
    nodos = get_all(driver, 'Merchant', limitation=2000)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.ge_propiedades_dic() for n in nodos]

    driver.close()
    
    # Retornar JSON con los nodos
    return jsonify(nodos_dict)


@app.route('/get_transaction')
def transacciones():
    driver = connection()
    nodos = get_all(driver, 'Transaction', limitation=2000)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.ge_propiedades_dic() for n in nodos]

    driver.close()
    
    # Retornar JSON con los nodos
    return jsonify(nodos_dict)


if __name__ == '__main__':
    app.run(debug=True)
