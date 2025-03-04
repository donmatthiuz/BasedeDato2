from flask import Flask, jsonify, request
from dotenv import load_dotenv
import neo4j
import neo4j.time
from conn import connection
from baseMethods import *
from flask_cors import CORS
from fraud_detection import *
from Relacion import *
import uuid
import os
from datetime import date
from extras import *

# Cargar variables de entorno desde .env
load_dotenv()

#Conexion Neo4j
URI = "neo4j+s://3b37977c.databases.neo4j.io"
AUTH = ("neo4j", "W_m4ObG8GYoBCCcUVjQTBJlGj44enIFNCPVgvR8GEb4")

app = Flask(__name__)
driver = connection()

CORS(app, origins=["http://localhost:3000"])

# Configuración de Flask con variables de entorno
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

@app.route('/')
def home():
    return f"Flask está corriendo en modo: {os.getenv('FLASK_ENV')}"

@app.route('/clean_db')
def clean_database():
    clean_db(driver)
    return jsonify ({"Se ha limpiado la base de datos."})

@app.route('/create_nodo')
def creating_node():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se han encontrado datos"}), 400
    create_nodo(driver, data)
    return jsonify({"message": "Nodo creado exitosamente"})

@app.route('/create_relationship')
def creating_relationship():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se han encontrado datos'}), 400
    create_relation(driver, data)
    return jsonify({'message': 'Relacion creada exitosamente'})


@app.route('/get_customer_data', methods=['POST'])
def get_customer_data():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se han encontrado datos'}), 400
    
    node = get_node(driver=driver, class_name="Customer", param_name="customerId", param_value=data["customerId"])

    return jsonify(node.ge_propiedades_dic()), 200






@app.route('/transaction_log', methods=['POST'])
def transaction_registration():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se han encontrado datos'}), 400
    
    id_unico = str(uuid.uuid4())
    print(data["customer"][0]["customer_name"])
    transaccion = Transactiones(
            transactionId=id_unico,
            transactionDate=neo4j.time.Date.from_iso_format(date.today().isoformat()),
            transactionAmount=float(data["transactionAmount"]),  # ✅ Acceder con corchetes
            transactionType=data["transactionType"],            # ✅ Acceder con corchetes
            transactionDescription=data["transactionDescription"],
            transactionCurrency="INR",
            transactionLocation="Guatemala",
            isFraudTeoric=False
        )
    
    #Operacion para crear nodo
    create_nodo(driver=driver, nodo=transaccion)

    nodo = get_node(driver, 'Customer', param_name="customerName", param_value=data["customer"][0]["customer_name"])

    back_account = get_node(driver, 'Bank_Account', param_name="bankBranch", param_value=data["account"][0]["branch_account"])


    merchant = get_node(driver, 'Merchant', param_name="merchantId", param_value=data["merchant"])

    device = get_node(driver, 'Device', param_name="deviceType", param_value=data["device"])



    relacion = PERFORMS(
        nodo_b=transaccion, 
        nodo_a=nodo, 
        channel=data["customer"][0]["channel"], 
        deviceUsed=data["customer"][0]["deviceUsed"])
    
    happenat = HAPPENED_AT(
        nodo_a=transaccion,
        nodo_b=back_account,
        balanceAfter=data["account"][0]["balanceAfter"],
        balanceBefore=data["account"][0]["balanceBefore"],
        
    )

    involves = INVOLVES(
        nodo_a=transaccion,
        nodo_b=merchant,
        transactionCount=2,
    )

    uses = USES(

        nodo_a=transaccion,
        nodo_b=device,
        deviceTrustScore=1.0,
        usedAt=neo4j.time.Date.from_iso_format(date.today().isoformat())
    )


    extra_transaction, extra_customers, extra_accounts = detect_extra_properties(data)
        
    #Operacion para agregar una relacion
    create_relation_extraproperties(driver=driver, relacion=relacion, extra_properties=extra_customers[0])
    create_relation(driver=driver, relacion=happenat)
    create_relation(driver=driver, relacion=involves)
    create_relation(driver=driver, relacion=uses)




    add_more_node_properties(driver=driver,
                             class_name="Transaction", 
                             param_name="transactionId", 
                             param_value=id_unico, 
                             extra_properties=extra_transaction)
    
    

    return jsonify({'message':'Transaccion registrada'}), 200


@app.route('/get_customers')
def customers():
    driver = connection()
    nodos = get_all(driver, 'Customer', limitation=200)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.ge_propiedades_dic() for n in nodos]

    driver.close()
    
    # Retornar JSON con los nodos
    return jsonify(nodos_dict)

@app.route('/get_customers_names')
def getnames_customers():
    driver = connection()
    nodos = get_all(driver, 'Customer', limitation=200)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.customerName for n in nodos]

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


@app.route('/get_one_node')
def one_node():
    driver = connection()
    nodo = get_node(driver, 'Bank_Account', param_name="bankBranch", param_value="Nagaon Branch")
    
    # Convertir cada objeto a diccionario
    nodos_dict = nodo.ge_propiedades_dic()

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



@app.route('/get_comerciantes_names')
def merchants_names():
    driver = connection()
    nodos = get_all(driver, 'Merchant', limitation=1000)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.merchantId for n in nodos]

    driver.close()
    
    # Retornar JSON con los nodos
    return jsonify(nodos_dict)

@app.route('/get_transaction')
def transacciones():
    driver = connection()
    nodos = get_all(driver, 'Transaction', limitation=20001)
    
    # Convertir cada objeto a diccionario
    nodos_dict = [n.ge_propiedades_dic() for n in nodos]

    driver.close()
    
    # Retornar JSON con los nodos
    return jsonify(nodos_dict)

@app.route('/detect_frauds')
def detect_frauds():
    fraud_cases = fraud_detection(driver)
    return jsonify({"casos de fraude": fraud_cases})



@app.route('/delete_prop_customer', methods=['POST'])
def delete_customer_property():
    data = request.get_json()  # Recibe los datos en formato JSON
    print(data)
    if not data:
        return jsonify({'error': 'No se han encontrado datos'}), 400
    remove_property(driver=driver, node_class="Customer", param_name="customerId", param_value=data["customerId"], property_name=data["property_name"])

    return jsonify({"Se elimino con exito": True}), 200


@app.route('/delete_customer', methods=['POST'])
def delete_customer():
    data = request.get_json()  # Recibe los datos en formato JSON
    print(data)
    if not data:
        return jsonify({'error': 'No se han encontrado datos'}), 400
    remove_node(driver=driver, class_name="Customer", param_name="customerId", param_value=data["customerId"])

    return jsonify({"Se elimino con exito": True}), 200



@app.route('/get_relation_customer', methods=['GET'])
def get_relation_customer():
    
    relacion  = create_and_get_relation(driver=driver, 
                                        class_name="Customer",
                                        param_name="customerId",
                                        param_value="01d511dd-afbd-40bf-937e-0d5b0fe38ff2",
                                        relation_class=PERFORMS)
    


    return jsonify({"Relacion": relacion.obtener_propiedades(), "Nodo": relacion.nodo_b.ge_propiedades_dic()})



## UPDATE CUSTOMERS


@app.route('/update_customer', methods=['POST'])
def update_customer():
    data = request.get_json()  # Recibe los datos en formato JSON
    print(data)
    if not data:
        return jsonify({'error': 'No se han encontrado datos'}), 400
    print("Siguiente")
    # Crear una instancia de Customer con los datos recibidos
    try:
        customer = Customer(
            customerId=data["customerId"],
            customerName=data["customerName"],
            gender=data["gender"],
            age=data["age"],
            customerContact=data["customerContact"],
            customerEmail=data["customerEmail"],
            state=data["state"],
            city=data["city"]
        )
    except KeyError as e:
        return jsonify({'error': f"Falta el campo {str(e)} en los datos"}), 400
    
    # Ahora actualizamos las propiedades del nodo Customer con la instancia creada
    update_nodo_properties(driver, customer)  # Llamar a la función que actualiza el nodo
    
    # Recuperamos el nodo actualizado para devolverlo en la respuesta
    updated_node = get_node(driver=driver, class_name="Customer", param_name="customerId", param_value=data["customerId"])
    
    if updated_node:
        return jsonify(updated_node.ge_propiedades_dic()), 200
    else:
        return jsonify({'error': 'Error al actualizar el cliente'}), 500




if __name__ == '__main__':
    app.run(debug=True)