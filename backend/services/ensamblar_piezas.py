from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel
import json

LADO_OPUESTO = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
}

def ensamblar_piezas(driver):
    pieza_model = PiezaModel(driver)
    relacion_model = RelacionModel(driver)

    query = "MATCH (p:Pieza) RETURN p"
    with driver.session() as session:
        piezas = session.run(query).data()

    print(f"Total de piezas encontradas: {len(piezas)}")

    for record in piezas:
        pieza = record["p"]
        id_pieza = pieza["id_pieza"]
        estado = pieza["estado"]

        print(f"\n🔍 Procesando pieza {id_pieza} (estado: {estado})")

        if estado not in ["libre", "ensamblada"]:
            print("⏩ Estado no válido para ensamblaje. Saltando.")
            continue

        vecinos = pieza.get("vecinos", {})
        if isinstance(vecinos, str):
            vecinos = json.loads(vecinos)
        picos = list(range(pieza["cantidad_picos"]))
        usados_picos = set()

        for lado, vecino_id in vecinos.items():

            print(f"➡ Evaluando lado '{lado}' hacia vecino {vecino_id}")

            if lado in pieza.get("bordes", []):
                print(f"⛔ Lado '{lado}' es borde. Saltando.")
                continue

            with driver.session() as session:
                result = session.run(
                    "MATCH (v:Pieza {id_pieza: $id}) RETURN v", id=vecino_id
                ).single()

            if not result:
                print(f"❌ Vecino {vecino_id} no encontrado en DB.")
                continue

            vecino = result["v"]
            lado_opuesto = LADO_OPUESTO[lado]

            if lado_opuesto in vecino.get("bordes", []):
                print(f"⛔ Lado opuesto '{lado_opuesto}' del vecino es borde. Saltando.")
                continue

            with driver.session() as session:
                existe = session.run("""
                    MATCH (a:Pieza {id_pieza: $ida})-[r:CONECTA_CON]->(b:Pieza {id_pieza: $idb})
                    RETURN r
                """, ida=id_pieza, idb=vecino_id).single()

            if existe:
                print(f"🔁 Relación ya existe entre {id_pieza} y {vecino_id}.")
                continue

            hendiduras = [chr(97 + i) for i in range(vecino["cantidad_hendiduras"])]
            usados_hendiduras = set()

            pico = next((p for p in picos if p not in usados_picos), None)
            hendidura = next((h for h in hendiduras if h not in usados_hendiduras), None)

            if pico is None or hendidura is None:
                print("⚠️ No hay pico o hendidura disponibles. Saltando conexión.")
                continue

            print(f"✅ Conectando {id_pieza} -> {vecino_id} usando pico {pico} y hendidura '{hendidura}'")

            relacion_model.crear_conexion(id_pieza, vecino_id, {
                "desde_lado": lado,
                "hacia_lado": lado_opuesto,
                "pico_origen": pico,
                "hendidura_destino": hendidura,
                "valida": True
            })

            relacion_model.crear_conexion(vecino_id, id_pieza, {
                "desde_lado": lado_opuesto,
                "hacia_lado": lado,
                "pico_origen": pico,
                "hendidura_destino": hendidura,
                "valida": True
            })

            usados_picos.add(pico)
            usados_hendiduras.add(hendidura)
