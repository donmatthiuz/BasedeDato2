from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel

def cambiar_estado_pieza(driver, pieza_id, nuevo_estado):
    pieza_model = PiezaModel(driver)
    relacion_model = RelacionModel(driver)

    # Actualizar estado
    pieza_model.actualizar_pieza(pieza_id, {"estado": nuevo_estado})

    # Si se omite, invalidar conexiones
    if nuevo_estado == "omitida":
        relacion_model.invalidar_conexiones_por_pieza(pieza_id)
