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
        "Rápida": ["Rápido y Sabroso", "El Rincón Express", "WacDonalds", "Pizza Queen", "Taco Box"]
    }
    return random.choice(nombres[categoria])

def formato_fecha_mongodb(fecha_datetime):
    return {
        "$date": fecha_datetime.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

def generar_datos():
    # 1. Restaurantes (1 por categoría)
    restaurantes = [{
        "_id": generar_id(),
        "nombre": generar_nombre_restaurante(categoria),
        "categoria": categoria,
        "direccion": fake.address(),
        "coordenadas": {
            "type": "Point",
            "coordinates": [float(fake.longitude()), float(fake.latitude())]
        },
        "telefono": fake.phone_number()
    } for categoria in CATEGORIAS]

    # 2. Clientes (8% del total = 4,000)
    usuarios = [{
        "_id": generar_id(),
        "nombre": fake.name(),
        "email": fake.email(),
        "direccion": fake.address(),
        "coordenadas": {
            "type": "Point",
            "coordinates": [float(fake.longitude()), float(fake.latitude())]
        },
        "telefono": fake.phone_number(),
        "contra": fake.password(),
        "fecha_registro": formato_fecha_mongodb(fake.date_time_between(start_date="-1y"))
    } for _ in range(int(TOTAL_DOCS * 0.08))]

    # 3. Menú - Asegurando mínimo 5 platillos por categoría
    platillos_tipicos = {
        "Parrillada": ["Carne Asada", "Pollo a la Parrilla", "Chuleta", "Costilla", "Lomo", "Punta de Anca"],
        "Asiatica": ["Sushi", "Dumplings", "Gimbap", "Pad Thai", "Ramen", "Pollo Teriyaki"],
        "Italiana": ["Pasta Alfredo", "Lasagna", "Pizza Margherita", "Risotto", "Penne Arrabbiata", "Ravioli"],
        "Vegetariana": ["Ensalada César", "Wrap Vegetal", "Curry de Verduras", "Falafel", "Quinoa Bowl"],
        "Rápida": ["Hamburguesa", "Hot Dog", "Burrito", "Papas Fritas", "Alitas", "Sandwich"]
    }

    articulos_menu = []
    for restaurante in restaurantes:
        # Seleccionar entre 3-5 platillos (sin exceder el total disponible)
        num_platillos = random.randint(3, 5)
        platillos = random.sample(platillos_tipicos[restaurante["categoria"]], k=min(num_platillos, len(platillos_tipicos[restaurante["categoria"]])))
        
        for platillo in platillos:
            articulos_menu.append({
                "_id": generar_id(),
                "nombre": platillo,
                "precio": random.randint(50, 150),
                "descripcion": f"{platillo} con acompañamientos",
                "disponible": True,
                "restaurante_id": restaurante["_id"]
            })

    # 4. Ordenes (90% del total = 45,000)
    ordenes = []
    for _ in range(int(TOTAL_DOCS * 0.9)):
        usuario = random.choice(usuarios)
        restaurante = random.choice(restaurantes)
        articulos_rest = [a for a in articulos_menu if a["restaurante_id"] == restaurante["_id"]]
        
        if not articulos_rest:
            continue
            
        platillos = []
        for _ in range(random.randint(1, 4)):  # 1-4 platillos por orden
            articulo = random.choice(articulos_rest)
            platillos.append({
                "menu_item_id": articulo["_id"],
                "nombre": articulo["nombre"],
                "cantidad": random.randint(1, 3),
                "precio_unitario": articulo["precio"]
            })
        
        ordenes.append({
            "_id": generar_id(),
            "usuario_id": usuario["_id"],
            "restaurante_id": restaurante["_id"],
            "fecha": formato_fecha_mongodb(fake.date_time_between(start_date="-1y")),
            "estado": random.choices(["completada", "cancelada", "preparando"], weights=[0.8, 0.1, 0.1])[0],
            "platillos": platillos,
            "total": sum(p["precio_unitario"] * p["cantidad"] for p in platillos)
        })

    # 5. Reseñas (2% del total = 1,000)
    ordenes_completadas = [o for o in ordenes if o["estado"] == "completada"]
    resenas = []
    for _ in range(int(TOTAL_DOCS * 0.02)):
        if not ordenes_completadas:
            break
            
        orden = random.choice(ordenes_completadas)
        if isinstance(orden["fecha"], dict) and "$date" in orden["fecha"]:
            fecha_orden_str = orden["fecha"]["$date"]
            fecha_orden = datetime.strptime(fecha_orden_str, "%Y-%m-%dT%H:%M:%SZ")
        else:
            fecha_orden = datetime.strptime(orden["fecha"], "%Y-%m-%dT%H:%M:%SZ")
        resenas.append({
            "_id": generar_id(),
            "orden_id": orden["_id"],
            "usuario_id": orden["usuario_id"],
            "restaurante_id": orden["restaurante_id"],
            "calificacion": random.randint(1, 5),
            "comentario": fake.paragraph(nb_sentences=2),
            "fecha": formato_fecha_mongodb(fake.date_time_between(start_date=fecha_orden))
        })

    return {
        "restaurantes": restaurantes,
        "usuarios": usuarios,
        "articulos_menu": articulos_menu,
        "ordenes": ordenes,
        "resenas": resenas
    }

def guardar_datos(datos):
    # Guardar en archivos separados
    with open('restaurantes.json', 'w', encoding='utf-8') as f:
        json.dump(datos["restaurantes"], f, indent=2, ensure_ascii=False)
    
    with open('usuarios.json', 'w', encoding='utf-8') as f:
        json.dump(datos["usuarios"], f, indent=2, ensure_ascii=False)
    
    with open('articulos_menu.json', 'w', encoding='utf-8') as f:
        json.dump(datos["articulos_menu"], f, indent=2, ensure_ascii=False)
    
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
- Usuarios: {len(datos_generados["usuarios"])} (8%)
- Artículos de menú: {len(datos_generados["articulos_menu"])}
- Órdenes: {len(datos_generados["ordenes"])} (90%)
- Reseñas: {len(datos_generados["resenas"])} (2% de órdenes completadas)
""")