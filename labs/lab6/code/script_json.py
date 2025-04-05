import json
import random
from datetime import datetime
from faker import Faker

fake = Faker()


def generar_usuarios(cantidad):
    usuarios = []
    for i in range(cantidad):
        # Generar datos básicos
        usuario = {
            "nombre": fake.name(),
            "email": fake.email(),
            "fecha_registro": fake.date_this_year(),
            "puntos": random.randint(0, 1000),
            "historial_compras": [
                {
                    "producto": "Producto 1",
                    "fecha": fake.date_this_year()  # Asegurarnos que 'Producto 1' aparece
                },
                {
                    "producto": "Producto 2",
                    "fecha": fake.date_this_year()
                }
            ],
            "direccion": {
                "calle": fake.street_address(),
                "ciudad": fake.city(),
                "codigo_postal": random.randint(10000, 99999)
            },
            "tags": ["tag1", "tag2", "tag3", "tag2"],  # Asegurar que "tag2" esté presente
            "activo": random.choice([True, False]),
            "notas": "Cliente frecuente",
            "visitas": random.randint(0, 1000),
            "amigos": random.sample(range(1, 1000), random.randint(1, 10)),  # Asegurando que algunos tengan muchos amigos
            "preferencias": {
                "color": "azul",
                "idioma": "español",
                "tema": "oscuro"
            }
        }
        
        # Asegurarnos de que algunos usuarios tengan más de 1000 amigos
        if random.random() < 0.05:  # 5% de probabilidad de tener más de 1000 amigos
            usuario['amigos'] = random.sample(range(1, 100000), 1001)  # Generar más de 1000 amigos

        # Convertir fechas a formato ISO 8601
        usuario['fecha_registro'] = usuario['fecha_registro'].isoformat()
        for compra in usuario['historial_compras']:
            compra['fecha'] = compra['fecha'].isoformat()

        usuarios.append(usuario)

    return usuarios

# Generar 99,989 usuarios
usuarios = generar_usuarios(99989) #cambia el numero por la cantidad de datos que necesites

# Guardar en archivo JSON
with open('usuarios.json', 'w') as f:
    json.dump(usuarios, f, indent=2)

print("Usuarios generados y guardados exitosamente.")