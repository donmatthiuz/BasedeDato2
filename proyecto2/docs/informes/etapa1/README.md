<!-- ---
header-includes:
  - \usepackage{amsmath}
  - \usepackage{amssymb}
  - \usepackage{fontspec}
  - \setmainfont{FiraCode Nerd Font}
  - \setmonofont{FiraCode Nerd Font Mono}
  - \usepackage{setspace}
  - \setstretch{1.5}
  - \usepackage{fvextra}
  - \DefineVerbatimEnvironment{Highlighting}{Verbatim}{breaklines,commandchars=\\\{\}}
geometry: top=0.67in, bottom=0.67in, left=0.85in, right=0.85in
--- -->

# Etapa 1 – Modelado de la base de datos en MongoDB

## Colecciones implementadas

### Restaurante

Este modelo representa un restaurante registrado en la base de datos.

#### Estructura del documento

| Campo         | Tipo       | Descripción                                                               |
| ------------- | ---------- | ------------------------------------------------------------------------- |
| `_id`         | `ObjectId` | Identificador único generado automáticamente por MongoDB                  |
| `nombre`      | `string`   | Nombre del restaurante                                                    |
| `direccion`   | `string`   | Dirección completa del restaurante                                        |
| `telefono`    | `string`   | Número de contacto en formato internacional (ej. +34, +502, etc.)         |
| `categoria`   | `string`   | Tipo de comida o categoría (ej. Parrillada, Mexicana, Italiana, etc.)     |
| `coordenadas` | `GeoJSON`  | Coordenadas geográficas en formato GeoJSON (`type: Point`, `coordinates`) |

**Nota:** El campo `coordenadas` debe tener el formato correcto de GeoJSON Point, con el orden `[longitud, latitud]`.

#### Ejemplo de documento

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

4. **Índice por prefijo telefónico:**

   ```js
   db.restaurante.createIndex({ telefono: 1 })
   ```

   > Optimiza búsquedas por número telefónico o prefijos internacionales, útil en análisis regionales.

### Artículo del Menú (`Menu`)

Este modelo representa un platillo o producto ofrecido en el menú de un restaurante.

#### Estructura del documento

| Campo            | Tipo       | Descripción                                                             |
| ---------------- | ---------- | ----------------------------------------------------------------------- |
| `_id`            | `ObjectId` | Identificador único generado automáticamente por MongoDB                |
| `nombre`         | `string`   | Nombre del platillo o artículo del menú                                 |
| `precio`         | `number`   | Precio del artículo en la moneda local                                  |
| `descripcion`    | `string`   | Descripción opcional del platillo                                       |
| `disponible`     | `boolean`  | Indica si el artículo está disponible para pedidos (por defecto `true`) |
| `restaurante_id` | `ObjectId` | Referencia al `_id` del restaurante al que pertenece este artículo      |

#### Ejemplo de documento

```json
{
  "nombre": "Hamburguesa BBQ",
  "descripcion": "Hamburguesa con salsa BBQ, queso cheddar y tocino",
  "precio": 58.9,
  "disponible": true,
  "restaurante_id": "681741a5a913f0b464ef950f"
}
```

**Nota:** El campo `restaurante_id`  debe existir en los documentos de `restaurante`.

#### Índices

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

3. **Índice para agregaciones por precio:**

   ```js
   db.menu.createIndex({ restaurante_id: 1, precio: 1 })
   db.menu.createIndex({ restaurante_id: 1})
   ```

   > Mejora el rendimiento de agregaciones como promedio, máximo y mínimo por restaurante.

### Usuario

Este modelo representa un usuario registrado en la plataforma.

#### Estructura del documento

| Campo            | Tipo       | Descripción                                                               |
| ---------------- | ---------- | ------------------------------------------------------------------------- |
| `_id`            | `ObjectId` | Identificador único generado automáticamente por MongoDB                  |
| `nombre`         | `string`   | Nombre completo del usuario                                               |
| `email`          | `string`   | Dirección de correo electrónico única                                     |
| `direccion`      | `string`   | Dirección física del usuario                                              |
| `telefono`       | `string`   | Número de contacto en formato internacional (ej. +502 1234 5678)          |
| `contra`         | `string`   | Contraseña en formato encriptado u ofuscado                               |
| `fecha_registro` | `ISODate`  | Fecha y hora en que el usuario se registró                                |
| `tipo`           | `string`   | Rol o tipo de usuario (ej. cliente, repartidor, administrador, etc.)      |
| `coordenadas`    | `GeoJSON`  | Coordenadas geográficas en formato GeoJSON (`type: Point`, `coordinates`) |

**Nota:** El campo `coordenadas` debe tener el formato correcto de GeoJSON Point, con el orden `[longitud, latitud]`.

#### Ejemplo de documento

```json
{
  "nombre": "Luisa Romero García",
  "email": "luisa.romero@example.com",
  "direccion": "Calle Principal 123\nMadrid, 28001",
  "telefono": "+34 911 223 334",
  "contra": "P@ssword2024",
  "fecha_registro": "2024-06-10T09:00:00Z",
  "tipo": "cliente",
  "coordenadas": {
    "type": "Point",
    "coordinates": [-90.50123, 14.62056]
  }
}
```

**Nota:** Dado que se utilizará `mongoimport` para insertar los datos, se debe declarar los valores utilizando el formato correcto de MongoDB Extended JSON con `"$date"`:

```js
"fecha_registro": {
   "$date": "2024-06-10T09:00:00Z"
}
```

De lo contrario, las fechas se almacenarán como simples strings y no podrán ser consultadas correctamente mediante filtros por rango de fechas (`$gte`, `$lte`, etc.).

#### Índices

1. **Índice compuesto:**  

   ```js
   db.usuario.createIndex({ nombre: 1, tipo: 1 })
   ```

   > Mejora búsquedas por nombre y tipo de usuario (ej. administrador, cliente).

2. **Índice geoespacial:**

   ```js
   db.usuario.createIndex({ coordenadas: "2dsphere" })
   ```

   > Para realizar búsquedas geográficas (por ubicación) usando coordenadas \[longitud, latitud].

### Orden

Este modelo representa una orden realizada por un usuario hacia un restaurante determinado.

#### Estructura del documento

| Campo                     | Tipo       | Descripción                                                                  |
| ------------------------- | ---------- | ---------------------------------------------------------------------------- |
| `_id`                     | `ObjectId` | Identificador único generado automáticamente por MongoDB                     |
| `fecha`                   | `ISODate`  | Fecha en que se realizó la orden. Se asigna automáticamente si no se incluye |
| `estado`                  | `string`   | Estado de la orden (ej. pendiente, completada, cancelada)                    |
| `platillos`               | `array`    | Lista de platillos solicitados en la orden                                   |
| `platillos[].nombre`      | `string`   | Nombre del platillo tal como fue pedido                                      |
| `platillos[].descripcion` | `string`   | Descripción del platillo                                                     |
| `platillos[].precio`      | `number`   | Precio unitario del platillo                                                 |
| `platillos[].cantidad`    | `number`   | Cantidad de unidades solicitadas                                             |
| `total`                   | `number`   | Total monetario calculado de la orden                                        |
| `usuario_id`              | `ObjectId` | Referencia al `_id` del usuario que hizo la orden                            |
| `restaurante_id`          | `ObjectId` | Referencia al `_id` del restaurante al que pertenece la orden                |

#### Ejemplo de documento

```json
{
  "usuario_id": "68174f099a2bb59ba7bb111c",
  "restaurante_id": "681741a5a913f0b464ef950f",
  "estado": "pendiente",
  "fecha": "2024-07-01T10:30:00Z",
  "platillos": [
    {
      "nombre": "Tacos de prueba A",
      "descripcion": "Tacos con ingredientes de prueba para el Restaurante A",
      "precio": 35,
      "cantidad": 2
    }
  ],
  "total": 70
}
```

**Nota:** Dado que se utilizará `mongoimport` para insertar los datos, se debe declarar los valores utilizando el formato correcto de MongoDB Extended JSON con `"$date"`:

De lo contrario, las fechas se almacenarán como simples strings y no podrán ser consultadas correctamente mediante filtros por rango de fechas (`$gte`, `$lte`, etc.).

```js
"fecha": {
   "$date": "2024-07-01T10:30:00Z"
}
```

**Nota:** Los campos `usuario_id` y `restaurante_id` debe existir en los documentos de `restaurante` y `usuario` respectivamente.

#### Índices

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

3. **Índice compuesto:**

   ```js
   db.orden.createIndex({ fecha: 1, restaurante_id: 1 })
   ```

   > Filtrado de órdenes por fecha y restaurante.

4. **Índice compuest:**

   ```js
   db.orden.createIndex({ restaurante_id: 1, estado: 1 })
   ```

   > Filtrado de órdenes por restaurante y estado de la orden.

5. **Índice compuesto:**

   ```js
   db.orden.createIndex({ usuario_id: 1, restaurante_id: 1 })
   ```

   > Filtrado de órdenes restaurantes y sus usuarios.

### Reseña (`Resena`)

Este modelo representa la calificación y comentario que un usuario deja sobre un platillo consumido en un restaurante.

#### Estructura del documento

| Campo              | Tipo       | Descripción                                                                       |
| ------------------ | ---------- | --------------------------------------------------------------------------------- |
| `_id`              | `ObjectId` | Identificador único generado automáticamente por MongoDB                          |
| `menu`             | `object`   | Datos del platillo reseñado, embebidos desde el menú                              |
| `menu.nombre`      | `string`   | Nombre del platillo reseñado                                                      |
| `menu.precio`      | `number`   | Precio del platillo reseñado                                                      |
| `menu.descripcion` | `string`   | Descripción del platillo                                                          |
| `nombre_usuario`   | `string`   | Nombre del usuario que dejó la reseña                                             |
| `calificacion`     | `number`   | Calificación numérica entre 1 y 5                                                 |
| `comentario`       | `string`   | Comentario escrito por el usuario                                                 |
| `fecha`            | `ISODate`  | Fecha y hora en que se creó la reseña. Se asigna automáticamente si no se incluye |
| `usuario_id`       | `ObjectId` | Referencia al `_id` del usuario que hizo la reseña                                |
| `restaurante_id`   | `ObjectId` | Referencia al `_id` del restaurante reseñado                                      |

#### Ejemplo de documento

```json
{
  "menu": {
    "nombre": "Pizza de prueba B",
    "precio": 55,
    "descripcion": "Pizza con ingredientes simulados para el Restaurante B"
  },
  "nombre_usuario": "TEST Usuario B",
  "calificacion": 5,
  "comentario": "Deliciosa pizza, volvería sin duda",
  "fecha": "2024-07-02T17:00:00Z",
  "usuario_id": "68174f099a2bb59ba7bb111d",
  "restaurante_id": "681741a5a913f0b464ef9510"
}
```

**Nota:** Dado que se utilizará `mongoimport` para insertar los datos, se debe declarar los valores utilizando el formato correcto de MongoDB Extended JSON con `"$date"`:

De lo contrario, las fechas se almacenarán como simples strings y no podrán ser consultadas correctamente mediante filtros por rango de fechas (`$gte`, `$lte`, etc.).

```json
"fecha": {
  "$date": "2024-07-02T17:00:00Z"
}
```

**Nota:** Los campos `usuario_id` y `restaurante_id` deben existir en los documentos de las colecciones `usuario` y `restaurante`, respectivamente.

#### Índices

1. **Índice compuesto:**

   ```js
   db.resena.createIndex({ restaurante_id: 1, calificacion: -1 })
   ```

   > Consultas por calificaciones de un restaurante.

2. **Índice simple:**

   ```js
   db.resena.createIndex({ usuario_id: 1, fecha: -1 })
   ```

   > Para ver reseñas hechas por un usuario y fecha.

3. **Índice simple:**

   ```js
   db.resena.createIndex({ nombre_usuario: 1 })
   ```

   > Para buscar reseñas por nombre de usuario.

4. **Índice simple:**

   ```js
   db.resena.createIndex({ "menu.nombre": 1 });
   ```

   > Para búsqueda por nombre de menú.

5. **Índice simple:**

   ```js
   db.resena.createIndex({ "menu.precio": 1 });
   ```

   > Para filtros de precio del menú.

6. **Índice compuesto:**

   ```js
   db.resena.createIndex({"menu.nombre": 1, calificacion: -1 });
   ```

   > Para filtros ordenar por total de reseñas o calificación promedio.

![Diagrama de Modelo de Datos NoSQL](../../../images/diagrama_final.png "Diagrama de Modelo de Datos NoSQL")

## Justificación de estructuras embebidas vs referenciadas

La decisión de utilizar estructuras embebidas en lugar de referenciadas en ciertos modelos de datos, como en el caso de los menús o las reseñas de los restaurantes, se justifica principalmente por la necesidad de mantener la integridad de los datos a lo largo del tiempo. Por ejemplo, cuando un restaurante cambia el precio de un platillo o modifica su descripción, la estructura embebida permite que esos cambios se reflejen de manera inmediata en las órdenes y reseñas previas sin que se pierda la coherencia entre los datos históricos y actuales. Si se usaran referencias, los datos antiguos quedarían desactualizados, ya que las órdenes pasadas seguirían apuntando a los precios antiguos, lo que generaría inconsistencias. De esta manera, las estructuras embebidas proporcionan una solución práctica para mantener la integridad de los datos a medida que evolucionan.

Además, las reseñas de los usuarios pueden incluir información sobre el platillo, como su nombre, descripción y precio, que se encuentra directamente embebida dentro de la reseña misma. Este enfoque permite que los datos del platillo sean consistentes incluso si el platillo ya no está disponible o ha cambiado de alguna manera. Al integrar estos detalles directamente en el documento de la reseña, se facilita una mejor experiencia de consulta, sin necesidad de realizar múltiples búsquedas o uniones de datos entre colecciones. Esto reduce la complejidad y mejora el rendimiento de las consultas, especialmente cuando se consulta información histórica.

Si bien en algunas situaciones los documentos embebidos pueden facilitar las consultas y otros casos, se optó por el enfoque relacional también debido a que ciertos datos no cambiarán frecuentemente, lo que hace innecesario duplicarlos en múltiples documentos. Utilizando referencias, se evita la redundancia de datos y, cuando se realiza un *update*, solo se modifica una parte específica de la base de datos, sin poner en riesgo la consistencia de los datos.

## Precarga de datos (`mongoimport`)

Usando la sintaxis mencionada en el [**siguiente enlace**](https://www.mongodb.com/docs/database-tools/mongoimport/).

Se puede hacer el siguiente comando para poblar la base de datos con los archivos `json` definidos en el repositorio (se recomienda leer el `README` en el **[siguiente enlace](https://github.com/donmatthiuz/BasedeDato2/tree/proyecto2/proyecto2)** ya que contiene instrucciones seguidas para este proceso):

```bash
mongoimport --uri "<uri>" --collection "<nombre_coleccion>" --file "<ruta_al_archivo_de_importacion>"
```

```bash
mongoimport --uri "uri" --collection usuario --file "./data/usuarios.json" --jsonArray
mongoimport --uri "uri" --collection restaurante --file "./data/restaurantes.json" --jsonArray
mongoimport --uri "uri" --collection menu --file "./data/articulos_menu.json" --jsonArray
mongoimport --uri "uri" --collection resena --file "./data/resenas.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_0.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_1.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_2.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_3.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_4.json" --jsonArray
```

## Política para evitar consultas sin índices

Conforme a los requerimientos del proyecto, la base de datos MongoDB debe estar diseñada para **rechazar o prevenir consultas que no utilicen índices**, garantizando una ejecución eficiente y escalable. Para lograrlo, se aplican las siguientes medidas:

### Diseño basado en índices

- Todas las colecciones principales (`restaurante`, `usuario`, `menu`, `orden`, `resena`) cuentan con **al menos dos índices adecuados** (simples, compuestos, multikey o de texto).
- Los índices fueron planificados con base en las futuras consultas REST que se implementarán en la API, considerando filtros, ordenamientos y búsquedas.

### Validación con `explain("executionStats")`

Antes de incorporar una consulta a la API, se valida con:

```js
db.coleccion.find({ campo: valor }).explain("executionStats")
```

Este comando permite verificar el plan de ejecución y asegurarse de que la consulta usa `IXSCAN` (lectura por índice) y no `COLLSCAN` (lectura completa de la colección).

### Uso de `.hint()` en MongoDB

La función `.hint()` permite **forzar explícitamente el uso de un índice específico** durante una consulta. Esto se utiliza para:

- Asegurar que una consulta use un índice existente.
- Forzar un error si se proporciona un índice inexistente o incompatible, ayudando a validar el diseño.

#### Sintaxis

```js
db.coleccion.find(filtro, proyeccion).hint({ campo1: 1, campo2: -1 })
```

- `campo1`, `campo2`, etc.: deben coincidir exactamente con el índice existente.
- Los valores `1` o `-1` indican el orden (ascendente o descendente) del índice.
- Si el índice especificado no existe o no es compatible, la consulta fallará.

#### Ejemplo correcto (índice existente)

```js
db.resena.find(
  { restaurante_id: "22e49f7d-c7d9-42c0-9785-1507f2003c19" },
  { calificacion: 1, comentario: 1, fecha: 1, _id: 0 }
)
.hint({ restaurante_id: 1, calificacion: -1 })
.limit(5)
.explain("executionStats")
```

Esta consulta utiliza correctamente el índice `restaurante_id_1_calificacion_-1` y es eficiente.

#### Ejemplo incorrecto (índice inexistente)

```js
db.resena.find(
  { restaurante_id: "22e49f7d-c7d9-42c0-9785-1507f2003c19" }
)
.hint({ fecha: -1 }) // Este índice no está definido
.limit(5)
```

Resultado esperado:

```bash
MongoServerError: hint provided does not correspond to an existing index
```

Este comportamiento confirma que la base de datos no ejecutará consultas si no pueden resolverse mediante índices definidos, cumpliendo con la política de eficiencia.
