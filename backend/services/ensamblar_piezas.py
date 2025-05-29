from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel
import json

# Diccionario para obtener el lado opuesto de cada dirección
LADO_OPUESTO = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
}

def ensamblarPiezas(driver):
    """
    Recorre todas las piezas de la base de datos y genera relaciones CONECTA_CON
    entre piezas que son vecinas y cumplen con las condiciones de ensamblaje.
    """
    piezaModel = PiezaModel(driver)
    relacionModel = RelacionModel(driver)

    query = "MATCH (p:Pieza) RETURN p"
    with driver.session() as session:
        piezas = session.run(query).data()

    print(f"Total de piezas encontradas: {len(piezas)}")

    for record in piezas:
        pieza = record["p"]
        idPieza = pieza["id_pieza"]
        estado = pieza["estado"]

        print(f"\n🔍 Procesando pieza {idPieza} (estado: {estado})")

        if estado not in ["libre", "ensamblada"]:
            print("⏩ Estado no válido para ensamblaje. Saltando.")
            continue

        # Convertir campos si vienen como strings
        vecinos = pieza.get("vecinos", {})
        if isinstance(vecinos, str):
            vecinos = json.loads(vecinos)

        bordes = pieza.get("bordes", [])
        if isinstance(bordes, str):
            bordes = json.loads(bordes)

        picos = pieza.get("picos", {})
        if isinstance(picos, str):
            picos = json.loads(picos)

        hendiduras = pieza.get("hendiduras", {})
        if isinstance(hendiduras, str):
            hendiduras = json.loads(hendiduras)

        for lado, vecinoId in vecinos.items():
            print(f"➡ Evaluando lado '{lado}' hacia vecino {vecinoId}")

            if lado in bordes:
                print(f"⛔ Lado '{lado}' es borde. Saltando.")
                continue

            # Obtener vecino desde DB
            with driver.session() as session:
                result = session.run(
                    "MATCH (v:Pieza {id_pieza: $id}) RETURN v", id=vecinoId
                ).single()

            if not result:
                print(f"❌ Vecino {vecinoId} no encontrado en DB.")
                continue

            vecino = result["v"]

            ladoOpuesto = LADO_OPUESTO[lado]

            # Cargar datos del vecino
            bordesVecino = vecino.get("bordes", [])
            if isinstance(bordesVecino, str):
                bordesVecino = json.loads(bordesVecino)

            if ladoOpuesto in bordesVecino:
                print(f"⛔ Lado opuesto '{ladoOpuesto}' del vecino es borde. Saltando.")
                continue

            picosVecino = vecino.get("picos", {})
            if isinstance(picosVecino, str):
                picosVecino = json.loads(picosVecino)

            hendidurasVecino = vecino.get("hendiduras", {})
            if isinstance(hendidurasVecino, str):
                hendidurasVecino = json.loads(hendidurasVecino)

            # Verificar si ya existe conexión
            with driver.session() as session:
                existe = session.run("""
                    MATCH (a:Pieza {id_pieza: $ida})-[r:CONECTA_CON]->(b:Pieza {id_pieza: $idb})
                    RETURN r
                """, ida=idPieza, idb=vecinoId).single()

            if existe:
                print(f"🔁 Relación ya existe entre {idPieza} y {vecinoId}.")
                continue

            # Seleccionar pico del lado correspondiente de la pieza
            picoDisponible = picos.get(lado, [])
            hendiduraDisponible = hendidurasVecino.get(ladoOpuesto, [])

            if not picoDisponible or not hendiduraDisponible:
                print("⚠️ No hay pico o hendidura disponible en el lado correspondiente. Saltando conexión.")
                continue

            pico = picoDisponible[0]
            hendidura = hendiduraDisponible[0]

            print(f"✅ Conectando {idPieza} -> {vecinoId} usando pico {pico} y hendidura '{hendidura}'")

            # Crear relación en ambas direcciones
            relacionModel.crearConexion(idPieza, vecinoId, {
                "desde_lado": lado,
                "hacia_lado": ladoOpuesto,
                "pico_origen": pico,
                "hendidura_destino": hendidura,
                "valida": True
            })

            relacionModel.crearConexion(vecinoId, idPieza, {
                "desde_lado": ladoOpuesto,
                "hacia_lado": lado,
                "pico_origen": pico,
                "hendidura_destino": hendidura,
                "valida": True
            })