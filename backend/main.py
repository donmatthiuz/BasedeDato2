from utils.conexion_neo4j import Neo4jConnection

def probar_conexion():
    conn = Neo4jConnection()
    try:
        resultado = conn.ejecutar_consulta("RETURN 'Conexión exitosa con Neo4j' AS mensaje", single=True)
        print(resultado["mensaje"])
    except Exception as e:
        print("Error al conectar con Neo4j:", e)
    finally:
        conn.cerrar()

if __name__ == "__main__":
    probar_conexion()
