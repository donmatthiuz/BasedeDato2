from neo4j import GraphDatabase
import csv
import json
class PiezaModel:
    def __init__(self, driver):
        self.driver = driver

    def crear_pieza(self, pieza_data):
        query = """
        CREATE (p:Pieza {
            id_pieza: $id_pieza,
            coordenada_x: $coordenada_x,
            coordenada_y: $coordenada_y,
            cantidad_picos: $cantidad_picos,
            cantidad_hendiduras: $cantidad_hendiduras,
            bordes: $bordes,
            estado: $estado,
            vecinos: $vecinos
        })
        """

        pieza_data["bordes"] = pieza_data["bordes"].split(";") if pieza_data.get("bordes") else []

        if pieza_data.get("vecinos"):
            vecinos_dict = dict(
                item.split(":") for item in pieza_data["vecinos"].split(";") if ":" in item
            )
            vecinos_dict = {k: int(v) for k, v in vecinos_dict.items()}
            pieza_data["vecinos"] = json.dumps(vecinos_dict)  # ← aquí va la conversión a string JSON
        else:
            pieza_data["vecinos"] = json.dumps({})

        # Conversión de enteros
        pieza_data["id_pieza"] = int(pieza_data["id_pieza"])
        pieza_data["coordenada_x"] = int(pieza_data["coordenada_x"])
        pieza_data["coordenada_y"] = int(pieza_data["coordenada_y"])
        pieza_data["cantidad_picos"] = int(pieza_data["cantidad_picos"])
        pieza_data["cantidad_hendiduras"] = int(pieza_data["cantidad_hendiduras"])

        with self.driver.session() as session:
            session.run(query, **pieza_data)


    def cargar_desde_csv(self, ruta_csv):
        with open(ruta_csv, newline='', encoding='utf-8') as archivo:
            lector = csv.DictReader(archivo)
            for fila in lector:
                self.crear_pieza(fila)

    def obtener_pieza(self, id_pieza):
        query = "MATCH (p:Pieza {id_pieza: $id_pieza}) RETURN p"
        with self.driver.session() as session:
            result = session.run(query, id_pieza=id_pieza)
            return result.single()

    def actualizar_pieza(self, id_pieza, nuevos_datos):
        set_clause = ", ".join([f"p.{k} = ${k}" for k in nuevos_datos.keys()])
        query = f"MATCH (p:Pieza {{id_pieza: $id_pieza}}) SET {set_clause} RETURN p"
        with self.driver.session() as session:
            result = session.run(query, id_pieza=id_pieza, **nuevos_datos)
            return result.single()

    def eliminar_pieza(self, id_pieza):
        query = "MATCH (p:Pieza {id_pieza: $id_pieza}) DETACH DELETE p"
        with self.driver.session() as session:
            session.run(query, id_pieza=id_pieza)
