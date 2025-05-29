from neo4j import GraphDatabase
import csv
import json

class PiezaModel:
    def __init__(self, driver):
        self.driver = driver

    def crearPieza(self, piezaData):
        query = """
        CREATE (p:Pieza {
            id_pieza: $id_pieza,
            coordenada_x: $coordenada_x,
            coordenada_y: $coordenada_y,
            picos: $picos,
            hendiduras: $hendiduras,
            bordes: $bordes,
            estado: $estado,
            vecinos: $vecinos
        })
        """

        # Convertir enteros
        piezaData["id_pieza"] = int(piezaData["id_pieza"])
        piezaData["coordenada_x"] = int(piezaData["coordenada_x"])
        piezaData["coordenada_y"] = int(piezaData["coordenada_y"])

        # Bordes a lista
        if isinstance(piezaData.get("bordes"), str):
            piezaData["bordes"] = piezaData["bordes"].split(";") if piezaData["bordes"] else []

        # Vecinos
        vecinos = piezaData.get("vecinos")
        if isinstance(vecinos, dict):
            piezaData["vecinos"] = json.dumps(vecinos)
        elif isinstance(vecinos, str):
            try:
                if vecinos.strip().startswith("{"):
                    piezaData["vecinos"] = json.dumps(json.loads(vecinos))  # JSON ya válido
                else:
                    vecinos_dict = dict(
                        item.split(":") for item in vecinos.split(";") if ":" in item
                    )
                    vecinos_dict = {k: int(v) for k, v in vecinos_dict.items()}
                    piezaData["vecinos"] = json.dumps(vecinos_dict)
            except Exception:
                piezaData["vecinos"] = json.dumps({})
        else:
            piezaData["vecinos"] = json.dumps({})

        # Picos
        picos = piezaData.get("picos", {})
        if isinstance(picos, dict):
            piezaData["picos"] = json.dumps(picos)
        elif isinstance(picos, str):
            try:
                piezaData["picos"] = json.dumps(json.loads(picos))
            except Exception:
                piezaData["picos"] = json.dumps({})
        else:
            piezaData["picos"] = json.dumps({})

        # Hendiduras
        hendiduras = piezaData.get("hendiduras", {})
        if isinstance(hendiduras, dict):
            piezaData["hendiduras"] = json.dumps(hendiduras)
        elif isinstance(hendiduras, str):
            try:
                piezaData["hendiduras"] = json.dumps(json.loads(hendiduras))
            except Exception:
                piezaData["hendiduras"] = json.dumps({})
        else:
            piezaData["hendiduras"] = json.dumps({})

        with self.driver.session() as session:
            session.run(query, **piezaData)

    def cargarDesdeCsv(self, rutaCsv):
        with open(rutaCsv, newline='', encoding='utf-8') as archivo:
            lector = csv.DictReader(archivo)
            for fila in lector:
                try:
                    self.crearPieza(fila)
                except Exception as e:
                    print(f"❌ Error en pieza ID {fila.get('id_pieza')}: {e}")

    def obtenerPieza(self, idPieza):
        query = "MATCH (p:Pieza {id_pieza: $id_pieza}) RETURN p"
        with self.driver.session() as session:
            result = session.run(query, id_pieza=idPieza)
            return result.single()

    def actualizarPieza(self, idPieza, nuevosDatos):
        if "picos" in nuevosDatos:
            nuevosDatos["picos"] = json.dumps(nuevosDatos["picos"])
        if "hendiduras" in nuevosDatos:
            nuevosDatos["hendiduras"] = json.dumps(nuevosDatos["hendiduras"])

        setClause = ", ".join([f"p.{k} = ${k}" for k in nuevosDatos.keys()])
        query = f"MATCH (p:Pieza {{id_pieza: $id_pieza}}) SET {setClause} RETURN p"

        with self.driver.session() as session:
            result = session.run(query, id_pieza=idPieza, **nuevosDatos)
            return result.single()

    def eliminarPieza(self, idPieza):
        query = "MATCH (p:Pieza {id_pieza: $id_pieza}) DETACH DELETE p"
        with self.driver.session() as session:
            session.run(query, id_pieza=idPieza)