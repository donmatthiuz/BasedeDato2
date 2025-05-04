# Modelo

![Diagrama de Modelo de Datos NoSQL](../images/diagrama_final.png "Diagrama de Modelo de Datos NoSQL")

## Restaurante

Este modelo representa un restaurante registrado en la base de datos.

### Estructura del documento

| Campo         | Tipo       | Descripción                                                               |
| ------------- | ---------- | ------------------------------------------------------------------------- |
| `_id`         | `ObjectId` | Identificador único generado automáticamente por MongoDB                  |
| `nombre`      | `string`   | Nombre del restaurante                                                    |
| `direccion`   | `string`   | Dirección completa del restaurante                                        |
| `telefono`    | `string`   | Número de contacto en formato internacional (ej. +34, +502, etc.)         |
| `categoria`   | `string`   | Tipo de comida o categoría (ej. Parrillada, Mexicana, Italiana, etc.)     |
| `coordenadas` | `GeoJSON`  | Coordenadas geográficas en formato GeoJSON (`type: Point`, `coordinates`) |

**Nota:** El campo `coordenadas` debe tener el formato correcto de GeoJSON Point, con el orden `[longitud, latitud]`.

### Ejemplo de documento completo

```json
{
  "nombre": "La Carnicería",
  "direccion": "Plaza Olegario Dueñas 1 Apt. 84 \nLa Coruña, 04962",
  "telefono": "+34 928 766 724",
  "categoria": "Parrillada",
  "coordenadas": {
    "type": "Point",
    "coordinates": [-90.51234, 14.62345]
  }
}
```

### Índices

1. **Índice simple:**

   ```js
   db.restaurante.createIndex({ nombre: 1 })
   ```

   > Búsqueda rápida por nombre del restaurante.

2. **Índice de texto:**

   ```js
   db.restaurante.createIndex({ nombre: "text", categoria: "text" })
   ```

   > Para búsquedas de texto en nombre y categoría.

3. **Índice geoespacial:**

   ```js
   db.restaurante.createIndex({ coordenadas: "2dsphere" })
   ```

   > Para realizar búsquedas geográficas (por ubicación) usando coordenadas \[longitud, latitud].

## **articulo_menu**

**Atributos:**

* `_id`: ObjectId
* `nombre`: string
* `precio`: number
* `descripcion`: string
* `disponible`: boolean
* `restaurante_id`: ObjectId

**Índices:**

1. **Índice compuesto:**  

   ```js
   db.menu.createIndex({ restaurante_id: 1, disponible: 1 })
   ```

   > Para listar artículos disponibles por restaurante.

2. **Índice de texto:**  

   ```js
   db.menu.createIndex({ nombre: "text", descripcion: "text" })
   ```

   > Permite búsquedas por nombre y descripción del platillo.

## **usuario**

**Atributos:**

* `_id`: ObjectId
* `nombre`: string
* `email`: string
* `direccion`: string
* `telefono`: string
* `contra`: string
* `fecha_registro`: ISODate
* `tipo`: string

**Índices:**

1. **Índice compuesto:**  

   ```js
   db.usuario.createIndex({ nombre: 1, tipo: 1 })
   ```

   > Mejora búsquedas por nombre y tipo de usuario (ej. administrador, cliente).

## **orden**

**Atributos:**

* `_id`: ObjectId
* `fecha`: ISODate
* `estado`: string
* `platillo`: array de objetos con:
  * `nombre`: string
  * `precio`: number
  * `descripcion`: string
  * `cantidad`: number
* `total`: number
* `usuario_id`: ObjectId
* `restaurante_id`: ObjectId

**Índices:**

1. **Índice compuesto:**

   ```js
   db.orden.createIndex({ usuario_id: 1, fecha: -1 })
   ```

   > Consultas por órdenes recientes de un usuario.

2. **Índice simple:**

   ```js
   db.orden.createIndex({ restaurante_id: 1 })
   ```

   > Filtrado de órdenes por restaurante.

## **resena**

**Atributos:**

* `_id`: ObjectId
* `menu`:
  * `nombre`: string
  * `precio`: number
  * `descripcion`: string
* `nombre_usuario`: string
* `calificacion`: number
* `comentario`: string
* `fecha`: ISODate
* `usuario_id`: ObjectId
* `restaurante_id`: ObjectId

**Índices:**

1. **Índice compuesto:**

   ```js
   db.resena.createIndex({ restaurante_id: 1, calificacion: -1 })
   ```

   > Consultas por calificaciones de un restaurante.

2. **Índice simple:**

   ```js
   db.resena.createIndex({ usuario_id: 1 })
   ```

   > Para ver reseñas hechas por un usuario.

3. **Índice simple:**

   ```js
   db.resena.createIndex({ nombre_usuario: 1 })
   ```

   > Para buscar reseñas por nombre de usuario.
