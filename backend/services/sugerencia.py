from models.pieza_model import PiezaModel

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
    pieza_actual = pieza_model.obtener_pieza(pieza_id)
    if not pieza_actual:
        return {"error": "Pieza no encontrada"}

    pieza = pieza_actual["p"]
    if pieza["estado"] != "libre":
        return {"error": "La pieza no está disponible para ensamblar"}

    # Buscar vecinos por coordenadas
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
            if vecino["estado"] != "ensamblada":
                continue

            lado_opuesto = LADO_OPUESTO[lado]
            if lado_opuesto in vecino["bordes"]:
                continue

            # Seleccionar pico y hendidura disponibles
            picos = list(range(pieza["cantidad_picos"]))
            hendiduras = [chr(97 + i) for i in range(vecino["cantidad_hendiduras"])]

            if not picos or not hendiduras:
                continue

            pico = picos[0]
            hendidura = hendiduras[0]

            return {
                "pieza_actual": pieza["id"],
                "pieza_objetivo": vecino["id"],
                "lado_objetivo": lado_opuesto,
                "pico": pico,
                "hendidura": hendidura,
                "instruccion": f"Conecta la pieza {pieza['id']} al lado {lado_opuesto} de la pieza {vecino['id']} usando el pico {pico} y la hendidura '{hendidura}'"
            }

    return {"mensaje": "No hay conexión válida para esta pieza actualmente"}
