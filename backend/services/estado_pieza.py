from models.pieza_model import PiezaModel
from models.relacion_model import RelacionModel

def cambiar_estado_pieza(driver, id_pieza, nuevo_estado):
    pieza_model = PiezaModel(driver)
    relacion_model = RelacionModel(driver)

    # Actualizar estado
    pieza_model.actualizar_pieza(id_pieza, {"estado": nuevo_estado})

    # Si se omite, invalidar conexiones
    if nuevo_estado == "omitida":
        relacion_model.invalidar_conexiones_por_pieza(id_pieza)
