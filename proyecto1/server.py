from flask import Flask
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde .env
load_dotenv()

#Conexion Neo4j
URI = "neo4j+s://3b37977c.databases.neo4j.io"
AUTH = ("neo4j", "W_m4ObG8GYoBCCcUVjQTBJlGj44enIFNCPVgvR8GEb4")

app = Flask(__name__)

# Configuración de Flask con variables de entorno
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

@app.route('/')
def home():
    return f"Flask está corriendo en modo: {os.getenv('FLASK_ENV')}"

if __name__ == '__main__':
    app.run(debug=True)
