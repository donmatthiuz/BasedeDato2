from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel

# Lados y sus opuestos
LADOS = ["top", "right", "bottom", "left"]
LADO_OPUESTO = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
}

def sugerir_siguiente(driver, pieza_id):
    pieza_model = PiezaModel(driver)
    relacion_model = RelacionModel(driver)

    pieza_actual = pieza_model.obtener_pieza(pieza_id)
    if not pieza_actual:
        return {"error": "Pieza no encontrada"}

    pieza = pieza_actual["p"]
    if pieza["estado"] != "ensamblada":
        return {"error": "La pieza base debe estar ensamblada"}

    coord_x = pieza["coordenada_x"]
    coord_y = pieza["coordenada_y"]

    vecinos_pos = {
        "top":    (coord_x, coord_y - 1),
        "right":  (coord_x + 1, coord_y),
        "bottom": (coord_x, coord_y + 1),
        "left":   (coord_x - 1, coord_y)
    }

    with driver.session() as session:
        for lado in LADOS:
            if lado in pieza["bordes"]:
                continue

            x, y = vecinos_pos[lado]
            result = session.run("""
                MATCH (v:Pieza {coordenada_x: $x, coordenada_y: $y})
                RETURN v
            """, x=x, y=y).single()

            if not result:
                continue

            vecino = result["v"]
            if vecino["estado"] != "libre":
                continue

            lado_opuesto = LADO_OPUESTO[lado]
            if lado_opuesto in vecino["bordes"]:
                continue

            picos = list(range(pieza["cantidad_picos"]))
            hendiduras = [chr(97 + i) for i in range(vecino["cantidad_hendiduras"])]

            if not picos or not hendiduras:
                continue

            pico = picos[0]
            hendidura = hendiduras[0]

            # Cambiar estado de la pieza sugerida
            pieza_model.actualizar_pieza(vecino["id"], {"estado": "ensamblada"})

            return {
                "pieza_actual": pieza["id"],
                "pieza_siguiente": vecino["id"],
                "lado_actual": lado,
                "lado_vecino": lado_opuesto,
                "pico": pico,
                "hendidura": hendidura,
                "instruccion": f"Conecta la pieza {vecino['id']} al lado {lado} de la pieza {pieza['id']} usando el pico {pico} y la hendidura '{hendidura}'"
            }


    return {"mensaje": "No hay piezas disponibles para ensamblar desde esta ubicación"}
