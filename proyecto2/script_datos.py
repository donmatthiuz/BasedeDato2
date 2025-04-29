import json
from uuid import uuid4
from faker import Faker
import random
from datetime import datetime

fake = Faker("es_ES")

# Configuración
TOTAL_DOCS = 50000
CATEGORIAS = ["Parrillada", "Asiatica", "Italiana", "Vegetariana", "Rápida"]

def generar_id():
    return str(uuid4())

def generar_nombre_restaurante(categoria):
    nombres = {
        "Parrillada": ["El Asador", "Brasas Maestras", "La Carnicería", "Parrilla Don José", "Los Carbones"],
        "Asiatica": ["Bambú Oriental", "Sakura", "Wok Dynasty", "Dragón Rojo", "Sabores de Oriente"],
        "Italiana": ["Bella Napoli", "Pasta Amore", "Nonno Mario", "Trattoria Romana", "Cucina della Mamma"],
        "Vegetariana": ["Verde Vida", "Raíces", "Jardín Orgánico", "Tierra Verde", "Esencia Vegetal"],
        "Rápida": ["Rápido y Sabroso", "El Rincón Express", "Sabor Instantáneo", "Comida al Vuelo", "La Esquina Rápida"]
    }
    return random.choice(nombres[categoria]) + " " + fake.city_suffix()

def generar_datos():
    # 1. Restaurantes (1 por categoría)
    restaurantes = [{
        "_id": generar_id(),
        "nombre": generar_nombre_restaurante(categoria),
        "categoria": categoria,
        "direccion": fake.address(),
        "telefono": fake.phone_number(),
        "capacidad": random.randint(20, 100)
    } for categoria in CATEGORIAS]

    # 2. Clientes (8% del total = 4,000)
    clientes = [{
        "_id": generar_id(),
        "nombre": fake.name(),
        "email": fake.email(),
        "telefono": fake.phone_number(),
        "fecha_registro": fake.date_time_between(start_date="-1y").strftime("%Y-%m-%dT%H:%M:%SZ"),
        "frecuencia": random.choice(["ocasional", "regular", "frecuente"])
    } for _ in range(int(TOTAL_DOCS * 0.08))]

    # 3. Órdenes (90% del total = 45,000)
    ordenes = []
    for _ in range(int(TOTAL_DOCS * 0.9)):
        restaurante = random.choice(restaurantes)
        cliente = random.choice(clientes)
        fecha = fake.date_time_between(start_date="-1y").strftime("%Y-%m-%dT%H:%M:%SZ")
        
        ordenes.append({
            "_id": generar_id(),
            "restaurante_id": restaurante["_id"],
            "usuario_id": cliente["_id"],
            "fecha": fecha,
            "total": round(random.uniform(80, 400), 2),
            "estado": random.choices(
                ["completada", "cancelada", "en_proceso"],
                weights=[0.85, 0.10, 0.05],
                k=1
            )[0],
            "metodo_pago": random.choice(["efectivo", "tarjeta", "transferencia"])
        })

    # 4. Reseñas (2% del total = 1,000, solo para órdenes completadas)
    ordenes_completadas = [o for o in ordenes if o["estado"] == "completada"]
    resenas = []
    for _ in range(int(TOTAL_DOCS * 0.02)):
        if not ordenes_completadas:
            break
            
        orden = random.choice(ordenes_completadas)
        # Convertir la fecha string a datetime para date_time_between
        fecha_orden = datetime.strptime(orden["fecha"], "%Y-%m-%dT%H:%M:%SZ")
        resenas.append({
            "_id": generar_id(),
            "orden_id": orden["_id"],
            "usuario_id": orden["usuario_id"],
            "restaurante_id": orden["restaurante_id"],
            "calificacion": random.choices(
                [1, 2, 3, 4, 5],
                weights=[0.05, 0.10, 0.15, 0.30, 0.40],
                k=1
            )[0],
            "comentario": fake.paragraph(nb_sentences=2),
            "fecha": fake.date_time_between(start_date=fecha_orden).strftime("%Y-%m-%dT%H:%M:%SZ")
        })

    return {
        "restaurantes": restaurantes,
        "clientes": clientes,
        "ordenes": ordenes,
        "resenas": resenas
    }

def guardar_datos(datos):
    # Guardar en archivos separados
    with open('restaurantes.json', 'w', encoding='utf-8') as f:
        json.dump(datos["restaurantes"], f, indent=2, ensure_ascii=False)
    
    with open('clientes.json', 'w', encoding='utf-8') as f:
        json.dump(datos["clientes"], f, indent=2, ensure_ascii=False)
    
    # Dividir órdenes en archivos de 10,000
    for i in range(0, len(datos["ordenes"]), 10000):
        with open(f'ordenes_{i//10000}.json', 'w', encoding='utf-8') as f:
            json.dump(datos["ordenes"][i:i+10000], f, indent=2, ensure_ascii=False)
    
    with open('resenas.json', 'w', encoding='utf-8') as f:
        json.dump(datos["resenas"], f, indent=2, ensure_ascii=False)

# Ejecución
print("Generando 50,000 documentos...")
datos_generados = generar_datos()
print("Guardando archivos...")
guardar_datos(datos_generados)

print(f"""
Generación completada:
- Restaurantes: {len(datos_generados["restaurantes"])} (1 por categoría)
- Clientes: {len(datos_generados["clientes"])} (8%)
- Órdenes: {len(datos_generados["ordenes"])} (90%)
- Reseñas: {len(datos_generados["resenas"])} (2% de órdenes)
""")