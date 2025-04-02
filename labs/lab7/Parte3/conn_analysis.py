from dotenv import load_dotenv
import os
import psycopg2

# Cargar las variables del archivo .env
load_dotenv()

# Acceder a las variables
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_pass = os.getenv("DB_PASS")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")

# Conexión a la db devolviendo el resultado de la conexión (True/False), el objeto de conexión en caso que sí pudo, y el error en caso lo hubiera
def connection():
  try:
    conn = psycopg2.connect(
      dbname=db_name,
      user=db_user,
      password=db_pass,
      host=db_host,
      port=db_port
    )
    return True, conn, None
  except psycopg2.Error as e:
    return False, None, str(e)

success, conn, error = connection()
if success:
  print("Conexión exitosa\n")
else:
  print("No se pudo conectar. Error:", error)

