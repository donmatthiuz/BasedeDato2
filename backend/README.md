# Backend Proyecto Rompecabezas

## Estructura

```bash
backend/
├── config.py                  # Configuración general (entorno, Neo4j, etc.)
├── models/
│   ├── pieza_model.py         # Acceso y operaciones sobre nodos 'Pieza'
│   ├── relacion_model.py      # Operaciones sobre relaciones CONECTA_CON
├── services/
│   ├── registro_pieza.py      # Lógica de inserción y conexión automática
│   ├── sugerencia.py          # Lógica del algoritmo de ensamblaje
│   ├── estado_pieza.py        # Actualización de estado y validación de relaciones
├── routes/
│   ├── pieza_routes.py        # Endpoints: POST /pieza, PATCH /pieza/{id}/estado, etc.
│   ├── sugerencia_routes.py   # Endpoints: GET /sugerencia/{id}
│   ├── resumen_routes.py      # Endpoints: GET /ensamblado, GET /relaciones
├── utils/
│   ├── conexion_neo4j.py      # Inicialización del driver y sesión con Neo4j
│   ├── helpers.py             # Funciones auxiliares: lado_opuesto, orden de vecinos, etc.
├── main.py                    # Punto de entrada de la aplicación Flask
├── .env                       # Credenciales neo4j y variables de entorno
├── requirements.txt
└── README.md
```

## TO-DO por hacer

### Configuración inicial

* [ ] Configurar entorno virtual.
* [ ] Crear archivo `requirements.txt` (Flask, Flask-Cors, neo4j-driver, python-dotenv, pytest).
* [ ] Definir `config.py` y `.env` con variables de entorno (Neo4j URI, usuario, contraseña).

### Modelo de Datos y Conexión

* [ ] Implementar `conexion_neo4j.py` con conexión segura al driver.
* [ ] Crear funciones en `pieza_model.py` para crear, leer, actualizar y eliminar nodos.
* [ ] Crear funciones en `relacion_model.py` para gestionar relaciones `CONECTA_CON`.

### Lógica del Dominio

* [ ] Implementar `registro_pieza.py`:

  * [ ] Insertar pieza.
  * [ ] Detectar vecinos.
  * [ ] Calcular picos/hendiduras.
  * [ ] Crear relaciones válidas.
* [ ] Implementar `sugerencia.py`:

  * [ ] Obtener vecinos ensamblados.
  * [ ] Detectar conexiones posibles.
  * [ ] Retornar la mejor sugerencia con instrucción.
* [ ] Implementar `estado_pieza.py`:

  * [ ] Cambiar estado.
  * [ ] Invalidar relaciones si la pieza se omite.

### Rutas (API REST)

* [ ] Crear `pieza_routes.py`: POST, PATCH, GET, DELETE.
* [ ] Crear `sugerencia_routes.py`: GET /sugerencia/{id}.
* [ ] Crear `resumen_routes.py`: GET /ensamblado, GET /relaciones.
