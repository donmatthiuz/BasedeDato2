from flask import Flask
from utils.conexion_neo4j import Neo4jConnection

from routes.pieza_routes import pieza_bp
from routes.sugerencia_routes import sugerencia_bp
from routes.resumen_routes import resumen_bp

def probar_conexion():
    conn = Neo4jConnection()
    try:
        resultado = conn.ejecutar_consulta("RETURN 'Conexión exitosa con Neo4j' AS mensaje", single=True)
        print("[✔] Neo4j:", resultado["mensaje"])
    except Exception as e:
        print("[✘] Error al conectar con Neo4j:", e)
    finally:
        conn.cerrar()

def crear_app():
    app = Flask(__name__)

    app.register_blueprint(pieza_bp)
    app.register_blueprint(sugerencia_bp)
    app.register_blueprint(resumen_bp)

    @app.route("/")
    def home():
        return {"mensaje": "API de Rompecabezas funcionando correctamente"}

    return app

if __name__ == "__main__":
    probar_conexion()

    app = crear_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
