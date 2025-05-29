from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel
import json

LADOS = ["top", "right", "bottom", "left"]
LADO_OPUESTO = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
}

def sugerirSiguiente(driver, idPieza):
    piezaModel = PiezaModel(driver)
    piezaActual = piezaModel.obtenerPieza(idPieza)

    if not piezaActual:
        return {"error": "Pieza no encontrada"}

    pieza = piezaActual["p"]
    if pieza["estado"] != "ensamblada":
        return {"error": "La pieza base debe estar ensamblada"}

    coordX = pieza["coordenada_x"]
    coordY = pieza["coordenada_y"]
    vecinosPos = {
        "top":    (coordX, coordY - 1),
        "right":  (coordX + 1, coordY),
        "bottom": (coordX, coordY + 1),
        "left":   (coordX - 1, coordY)
    }

    try:
        picos = json.loads(pieza.get("picos", "{}"))
    except:
        return {"error": "Formato inválido de picos en pieza actual"}

    with driver.session() as session:
        for lado in LADOS:
            if lado in pieza.get("bordes", []):
                continue

            x, y = vecinosPos[lado]
            result = session.run("""
                MATCH (v:Pieza {coordenada_x: $x, coordenada_y: $y})
                RETURN v
            """, x=x, y=y).single()

            if not result:
                continue

            vecino = result["v"]
            if vecino["estado"] != "libre":
                continue

            ladoOpuesto = LADO_OPUESTO[lado]
            if ladoOpuesto in vecino.get("bordes", []):
                continue

            try:
                hendiduras = json.loads(vecino.get("hendiduras", "{}"))
            except:
                continue

            picoLado = picos.get(lado, [])
            hendiduraLado = hendiduras.get(ladoOpuesto, [])

            if not picoLado or not hendiduraLado:
                continue

            pico = picoLado[0]
            hendidura = hendiduraLado[0]

            return {
                "pieza_actual": pieza["id_pieza"],
                "pieza_siguiente": vecino["id_pieza"],
                "lado_actual": lado,
                "lado_vecino": ladoOpuesto,
                "pico": pico,
                "hendidura": hendidura,
                "instruccion": (
                    f"Conecta la pieza {vecino['id_pieza']} al lado '{lado}' de la pieza {pieza['id_pieza']}.\n"
                    f"Usa el pico #{pico} del lado '{lado}' de la pieza {pieza['id_pieza']} y "
                    f"la hendidura #{hendidura} del lado '{ladoOpuesto}' de la pieza {vecino['id_pieza']}.\n"
                    f"Asegúrate de que ambos lados no sean bordes y que el orden sea "
                    f"{'horario' if lado in ['top', 'right'] else 'antihorario'} para picos y "
                    f"{'antihorario' if ladoOpuesto in ['bottom', 'left'] else 'horario'} para hendiduras."
                )

            }

    return {"mensaje": "No hay piezas disponibles para ensamblar desde esta ubicación"}
