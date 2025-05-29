from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel
import json

LADO_OPUESTO = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
}

def registrarPieza(driver, data):
    pieza_model = PiezaModel(driver)
    relacion_model = RelacionModel(driver)

    # Serializar campos complejos antes de guardar
    data["picos"] = json.dumps(data.get("picos", {}))
    data["hendiduras"] = json.dumps(data.get("hendiduras", {}))
    data["bordes"] = json.dumps(data.get("bordes", []))
    data["vecinos"] = json.dumps(data.get("vecinos", {}))

    # Crear el nodo en la base de datos
    pieza_model.crearPieza(data)

    # Restaurar estructuras para la lógica interna
    picos = json.loads(data["picos"])
    hendiduras = json.loads(data["hendiduras"])
    vecinos = json.loads(data["vecinos"])

    for lado in ["top", "right", "bottom", "left"]:
        if lado not in vecinos or lado in json.loads(data["bordes"]):
            continue

        vecino_id = vecinos[lado]
        with driver.session() as session:
            vecino_result = session.run(
                "MATCH (p:Pieza {id_pieza: $id}) RETURN p", id=vecino_id
            ).single()

        if not vecino_result:
            continue

        vecino = vecino_result["p"]
        if vecino.get("estado") != "ensamblada":
            continue

        lado_vecino = LADO_OPUESTO[lado]
        if lado_vecino in json.loads(vecino.get("bordes", "[]")):
            continue

        hendiduras_vecino = json.loads(vecino.get("hendiduras", "{}"))
        hendidura_lado = hendiduras_vecino.get(lado_vecino, [])
        hendidura = hendidura_lado[0] if hendidura_lado else None

        pico_lado = picos.get(lado, [])
        pico = pico_lado[0] if pico_lado else None

        if pico is None or hendidura is None:
            continue

        relacion = {
            "desde_lado": lado,
            "hacia_lado": lado_vecino,
            "pico_origen": pico,
            "hendidura_destino": hendidura,
            "valida": True
        }

        relacion_model.crear_conexion(data["id_pieza"], vecino_id, relacion)

        relacion_inversa = {
            "desde_lado": lado_vecino,
            "hacia_lado": lado,
            "pico_origen": pico,
            "hendidura_destino": hendidura,
            "valida": True
        }

        relacion_model.crear_conexion(vecino_id, data["id_pieza"], relacion_inversa)