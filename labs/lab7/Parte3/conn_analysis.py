from dotenv import load_dotenv
import os
import psycopg2
import pandas as pd
import matplotlib.pyplot as plt

# Cargar las variables del archivo .env
load_dotenv()
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_pass = os.getenv("DB_PASS")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")

"""
Establece una conexión con la base de datos PostgreSQL usando variables de entorno.

Retorna:
  tuple:
    - bool: True si la conexión fue exitosa, False en caso contrario.
    - connection or None: Objeto de conexión a la base de datos si fue exitosa; None si falló.
    - str or None: Mensaje de error en caso de fallo; None si la conexión fue exitosa.

Descripción:
- Utiliza los valores de las variables de entorno (DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT).
- Intenta conectarse a la base de datos PostgreSQL usando psycopg2.
- Devuelve una tupla con el estado de la conexión, el objeto conexión o None, y el error si existiera.
"""
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

"""
Genera un gráfico que muestra la relación entre la tasa de envejecimiento 
y el costo promedio de hospedaje y comida de los 10 países con mayor envejecimiento.

Parámetros:
  conn (psycopg2.extensions.connection): Conexión activa a la base de datos PostgreSQL.

Proceso:
- Ejecuta una consulta SQL para obtener los 10 países con mayor tasa de envejecimiento.
- Calcula el costo promedio entre hospedaje y comida para cada país.
- Genera un gráfico de barras (costo promedio) y línea (tasa de envejecimiento).
- Guarda la imagen generada en la carpeta "./images" como "insight_1.png".
- Muestra el gráfico en pantalla con el título de ventana "Insight 1".

Errores:
  Imprime un mensaje si ocurre algún error durante la consulta o visualización.
"""

def agingCostInsight(conn):
  
  query = """
  SELECT DISTINCT pais, tasa_de_envejecimiento, 
      (hospedaje_costos + comida_costos) / 2 AS costo_promedio
  FROM analysis
  WHERE tasa_de_envejecimiento IS NOT NULL
  ORDER BY tasa_de_envejecimiento DESC
  LIMIT 10;
  """

  try:
    df = pd.read_sql_query(query, conn)

    print("Top 10 países con mayor tasa de envejecimiento y su costo promedio (hospedaje + comida):\n", df)

    # Crear gráfico
    fig, ax1 = plt.subplots(figsize=(12, 6))
    fig.canvas.manager.set_window_title("Insight 1")

    bars = ax1.bar(df["pais"], df["costo_promedio"], color='coral', label='Costo promedio')
    ax1.set_xlabel("País")
    ax1.set_ylabel("Costo promedio (USD)", color='coral')
    ax1.tick_params(axis='y', labelcolor='coral')

    for i, bar in enumerate(bars):
      ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1, f'{bar.get_height():.1f}', ha='center', fontsize=9)

    # Línea en eje secundario para tasa de envejecimiento
    ax2 = ax1.twinx()
    ax2.plot(df["pais"], df["tasa_de_envejecimiento"], color='blue', marker='o', label='Tasa de envejecimiento')
    ax2.set_ylabel("Tasa de envejecimiento (%)", color='blue')
    ax2.tick_params(axis='y', labelcolor='blue')

    plt.title("Relación entre envejecimiento poblacional y costo promedio (hospedaje + comida)")
    plt.xticks(rotation=45)
    fig.tight_layout()

    # Guardar imagen
    os.makedirs("./images", exist_ok=True)
    plt.savefig("./images/insight_1.png")

    plt.show()

  except Exception as e:
    print("Error al ejecutar la consulta:", e)

"""
Genera un gráfico que muestra la relación entre el costo promedio de la comida local 
y el precio del Big Mac en los países donde el costo de la comida es mayor a 50 USD 
y el precio del Big Mac es menor a 3 USD.

Parámetros:
  conn (psycopg2.extensions.connection): Conexión activa a la base de datos PostgreSQL.

Proceso:
- Ejecuta una consulta SQL para obtener países con comida cara (más de 50 USD) 
  y Big Mac barato (menos de 3 USD).
- Genera un gráfico de barras para mostrar el costo promedio de la comida local 
  y una línea para mostrar el precio del Big Mac.
- Guarda la imagen generada en la carpeta "./images" como "insight_2.png".
- Muestra el gráfico en pantalla con el título de ventana "Insight 2".

Errores:
  Imprime un mensaje si ocurre algún error durante la consulta o visualización.
"""
def bigMacCostInsight(conn):
  
  query = """
  SELECT DISTINCT pais, comida_costos, precio_big_mac_usd
  FROM analysis
  WHERE comida_costos > 50 AND precio_big_mac_usd < 3
  ORDER BY comida_costos DESC;
  """

  try:
    df = pd.read_sql_query(query, conn)
    print("Países con comida cara pero Big Mac barato:\n", df)

    # Crear gráfico
    fig, ax1 = plt.subplots(figsize=(12, 6))
    fig.canvas.manager.set_window_title("Insight 2")

    bars = ax1.bar(df["pais"], df["comida_costos"], color='orange', label='Costo comida local')
    ax1.set_xlabel("País")
    ax1.set_ylabel("Costo promedio de comida (USD)", color='orange')
    ax1.tick_params(axis='y', labelcolor='orange')

    for i, bar in enumerate(bars):
      ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1, f'{bar.get_height():.1f}', ha='center', fontsize=9)

    # Línea del precio del Big Mac
    ax2 = ax1.twinx()
    ax2.plot(df["pais"], df["precio_big_mac_usd"], color='green', marker='o', label='Precio Big Mac')
    ax2.set_ylabel("Precio Big Mac (USD)", color='green')
    ax2.tick_params(axis='y', labelcolor='green')

    plt.title("Relación entre costo de comida local y precio del Big Mac")
    plt.xticks(rotation=45)
    fig.tight_layout()

    # Guardar imagen
    os.makedirs("./images", exist_ok=True)
    plt.savefig("./images/insight_2.png")

    plt.show()

  except Exception as e:
    print("Error al ejecutar la consulta:", e)

"""
Genera un gráfico que muestra la relación entre la tasa de envejecimiento 
y el costo de entretenimiento en los países donde el costo de entretenimiento 
es menor a 25 USD y la tasa de envejecimiento es menor a 10%.

Parámetros:
  conn (psycopg2.extensions.connection): Conexión activa a la base de datos PostgreSQL.

Proceso:
- Ejecuta una consulta SQL para obtener países con bajo costo de entretenimiento 
  (menos de 25 USD) y bajo envejecimiento poblacional (menos del 10%).
- Genera un gráfico de barras para mostrar el costo promedio del entretenimiento 
  y una línea para mostrar la tasa de envejecimiento.
- Guarda la imagen generada en la carpeta "./images" como "insight_3.png".
- Muestra el gráfico en pantalla con el título de ventana "Insight 3".

Errores:
  Imprime un mensaje si ocurre algún error durante la consulta o visualización.
"""
def lowAgingLowEntertainmentInsight(conn):
  
  query = """
  SELECT DISTINCT pais, entretenimiento_costos, tasa_de_envejecimiento
  FROM analysis
  WHERE entretenimiento_costos < 25 AND tasa_de_envejecimiento < 10
  ORDER BY entretenimiento_costos ASC;
  """

  try:
    df = pd.read_sql_query(query, conn)
    print("Países con bajo envejecimiento y bajo costo de entretenimiento:\n", df)

    # Crear gráfico
    fig, ax1 = plt.subplots(figsize=(12, 6))
    fig.canvas.manager.set_window_title("Insight 3")

    bars = ax1.bar(df["pais"], df["entretenimiento_costos"], color='mediumseagreen', label='Costo entretenimiento')
    ax1.set_xlabel("País")
    ax1.set_ylabel("Costo entretenimiento (USD)", color='mediumseagreen')
    ax1.tick_params(axis='y', labelcolor='mediumseagreen')

    for i, bar in enumerate(bars):
      ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.5, f'{bar.get_height():.1f}', ha='center', fontsize=9)

    # Línea de tasa de envejecimiento
    ax2 = ax1.twinx()
    ax2.plot(df["pais"], df["tasa_de_envejecimiento"], color='purple', marker='o', label='Tasa de envejecimiento')
    ax2.set_ylabel("Tasa de envejecimiento", color='purple')
    ax2.tick_params(axis='y', labelcolor='purple')

    plt.title("Países con bajo envejecimiento y bajo costo de entretenimiento")
    plt.xticks(rotation=45)
    fig.tight_layout()

    # Guardar imagen
    os.makedirs("./images", exist_ok=True)
    plt.savefig("./images/insight_3.png")

    plt.show()

  except Exception as e:
    print("Error al ejecutar la consulta:", e)

def main():
	success, conn, error = connection()
	if not success:
		print("No se pudo conectar. Error:", error)
		return

	activo = True

	while activo:
		opcion = input(
			"\nSelecciona un insight para visualizar:\n"
			"1 - Envejecimiento vs costo promedio\n"
			"2 - Comida cara vs Big Mac barato\n"
			"3 - Bajo envejecimiento vs bajo entretenimiento\n"
			"0 - Salir\n\n"
			"Opción: "
		)

		if opcion == "1":
			agingCostInsight(conn=conn)
		elif opcion == "2":
			bigMacCostInsight(conn=conn)
		elif opcion == "3":
			lowAgingLowEntertainmentInsight(conn=conn)
		elif opcion == "0":
			print("Saliendo...")
			activo = False
		else:
			print("Opción no válida. Por favor selecciona 1, 2, 3 o 0.")

	conn.close()

if __name__ == "__main__":
	main()
