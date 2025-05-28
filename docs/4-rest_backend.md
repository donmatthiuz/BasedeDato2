# Servicios REST del Backend

## POST `/pieza`

**Función:** Registrar una nueva pieza y generar automáticamente sus relaciones válidas con vecinos ensamblados.

**Entrada:**

```json
{
  "id": 17,
  "coordenada_x": 4,
  "coordenada_y": 2,
  "cantidad_picos": 2,
  "cantidad_hendiduras": 2,
  "bordes": ["left", "bottom"],
  "vecinos": {
    "top": 14,
    "right": 18
  },
  "estado": "ensamblada"
}
```

**Proceso:**

* Inserta el nodo de la pieza.
* Enumera picos y hendiduras según convención.
* Evalúa conexión con cada vecino ensamblado.
* Crea relaciones `CONECTA_CON` con atributos completos.
* Si el vecino ya tiene relación previa con esta pieza y ahora está omitido, se marca como `valida: false`.

**Salida:**

```json
{
  "mensaje": "Pieza registrada exitosamente",
  "pieza_id": 17,
  "relaciones_creadas": [
    {
      "con_pieza": 14,
      "desde_lado": "top",
      "hacia_lado": "bottom",
      "pico_usado": 0,
      "hendidura_usada": "b",
      "valida": true
    },
    {
      "con_pieza": 18,
      "desde_lado": "right",
      "hacia_lado": "left",
      "pico_usado": 1,
      "hendidura_usada": "a",
      "valida": true
    }
  ]
}
```

## PATCH `/pieza/{id}/estado`

**Función:** Cambiar el estado de una pieza. Al marcar una pieza como `omitida`, todas sus relaciones `CONECTA_CON` se invalidan.

**Entrada:**

```json
{
  "estado": "omitida"
}
```

**Proceso:**

* Actualiza el estado de la pieza.
* Recorre relaciones salientes y entrantes.
* Cambia el atributo `valida` a `false` en las relaciones que involucran a esta pieza.

**Salida:**

```json
{
  "mensaje": "Estado actualizado y relaciones invalidadas",
  "pieza_id": 17,
  "nuevo_estado": "omitida",
  "relaciones_actualizadas": 3
}
```

## GET `/pieza/{id}`

**Función:** Obtener todos los datos de una pieza, incluyendo relaciones actuales.

**Salida:**

```json
{
  "id": 17,
  "coordenada_x": 4,
  "coordenada_y": 2,
  "cantidad_picos": 2,
  "cantidad_hendiduras": 2,
  "bordes": ["left", "bottom"],
  "estado": "ensamblada",
  "relaciones": [
    {
      "con_pieza": 14,
      "desde_lado": "top",
      "hacia_lado": "bottom",
      "pico_usado": 0,
      "hendidura_usada": "b",
      "valida": true
    },
    {
      "con_pieza": 18,
      "desde_lado": "right",
      "hacia_lado": "left",
      "pico_usado": 1,
      "hendidura_usada": "a",
      "valida": true
    }
  ]
}
```

## GET `/sugerencia/{pieza_id}`

**Función:** Sugerir cómo conectar una pieza libre con sus vecinos ensamblados disponibles.

**Salida con sugerencia válida:**

```json
{
  "pieza_actual": 22,
  "pieza_objetivo": 19,
  "lado_objetivo": "top",
  "pico": 1,
  "hendidura": "a",
  "instruccion": "Conecta la pieza 22 al lado top de la pieza 19 usando el pico 1 y la hendidura 'a'"
}
```

**Salida sin posibilidad de conexión:**

```json
{
  "mensaje": "No hay conexión válida disponible para la pieza 22 en este momento"
}
```

## GET `/ensamblado`

**Función:** Listar todas las piezas y su estado actual en el rompecabezas.

**Salida:**

```json
[
  {"id": 1, "estado": "ensamblada", "coordenada_x": 0, "coordenada_y": 0},
  {"id": 2, "estado": "libre", "coordenada_x": 1, "coordenada_y": 0},
  {"id": 3, "estado": "omitida", "coordenada_x": 2, "coordenada_y": 0}
]
```

## GET `/relaciones`

**Función:** Obtener todas las relaciones actuales (útiles para depuración o visualización).

**Salida:**

```json
[
  {
    "pieza_origen": 17,
    "pieza_destino": 14,
    "desde_lado": "top",
    "hacia_lado": "bottom",
    "pico": 0,
    "hendidura": "b",
    "valida": true
  },
  {
    "pieza_origen": 17,
    "pieza_destino": 21,
    "desde_lado": "left",
    "hacia_lado": "right",
    "pico": 1,
    "hendidura": "a",
    "valida": false
  }
]
```

## DELETE `/pieza/{id}`

**Función:** Eliminar una pieza y todas sus relaciones del sistema.

**Salida:**

```json
{
  "mensaje": "Pieza y relaciones eliminadas correctamente",
  "pieza_id": 17,
  "relaciones_eliminadas": 2
}
```
