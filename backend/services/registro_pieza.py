from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel

LADO_OPUESTO = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
}

def registrar_pieza(driver, data):
    pieza_model = PiezaModel(driver)
    relacion_model = RelacionModel(driver)

    # Paso 1: Crear nodo
    pieza_model.crear_pieza(data)

    # Generar picos y hendiduras según cantidad
    picos_disponibles = list(range(data["cantidad_picos"]))
    hendiduras_disponibles = [chr(97 + i) for i in range(data["cantidad_hendiduras"])]

    usados_picos = set()
    usados_hendiduras = set()

    # Paso 2: Evaluar vecinos
    vecinos = data.get("vecinos", {})
    for lado in ["top", "right", "bottom", "left"]:
        if lado not in vecinos or lado in data.get("bordes", []):
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
            if lado_vecino in vecino.get("bordes", []):
                continue

            # Asignar pico y hendidura disponibles
            pico = next((p for p in picos_disponibles if p not in usados_picos), None)
            hendidura = next((h for h in hendiduras_disponibles if h not in usados_hendiduras), None)

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

            # Crear relación inversa
            relacion_inversa = {
                "desde_lado": lado_vecino,
                "hacia_lado": lado,
                "pico_origen": pico,
                "hendidura_destino": hendidura,
                "valida": True
            }
            relacion_model.crear_conexion(vecino_id, data["id_pieza"], relacion_inversa)

            usados_picos.add(pico)
            usados_hendiduras.add(hendidura)
