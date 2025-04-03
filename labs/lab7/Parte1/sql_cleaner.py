import psycopg2
import pandas as pd
import unidecode


# Configuración de conexión
DB_HOST = "localhost"  # Cambia si el servidor no está en tu máquina
DB_PORT = "5432"       # Puerto por defecto de PostgreSQL
DB_NAME = "lab7"
DB_USER = "postgres"
DB_PASSWORD = "contraseñapajaro"
TABLE_NAME = "pais_envejecimiento"
CSV_FILE = "./pais_envejecimiento.csv"


try:
    # Conectar a PostgreSQL
    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD
    )
    cursor = conn.cursor()

    # Leer el archivo CSV
    df = pd.read_csv(CSV_FILE, delimiter=",")  # Ajusta el delimitador si es necesario

    # Limpiar nombres de columnas: quitar tildes y caracteres raros
    df.columns = [unidecode.unidecode(col).replace(" ", "_").lower() for col in df.columns]

    # Crear tabla en PostgreSQL (detectando tipos de datos)
    columns_types = []
    for col in df.columns:
        col_type = "TEXT"  # Tipo por defecto
        if df[col].dtype == "int64":
            col_type = "INTEGER"
        elif df[col].dtype == "float64":
            col_type = "FLOAT"
        # Asegurarse de que no haya nombres de columnas que empiecen con números
        if col[0].isdigit():
            col = f"col_{col}"  # Prefijamos con "col_" si comienza con un número
        columns_types.append(f"{col} {col_type}")

    create_table_query = f"""
    CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
        {", ".join(columns_types)}
    );
    """
    print(f"Creando tabla con la consulta: {create_table_query}")  # Verifica la consulta generada
    cursor.execute(create_table_query)
    conn.commit()

    # Insertar datos en la tabla
    for _, row in df.iterrows():
        # Convertir valores vacíos a NULL de PostgreSQL
        values = [
            unidecode.unidecode(str(v)).replace("'", " ") if pd.notna(v) else None
            for v in row
        ]
        # Insertar valores
        insert_query = f"INSERT INTO {TABLE_NAME} VALUES ({', '.join(['%s'] * len(values))});"
        cursor.execute(insert_query, values)

    conn.commit()
    print(f"Datos insertados correctamente en {TABLE_NAME}")

    # Cerrar conexión
    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")