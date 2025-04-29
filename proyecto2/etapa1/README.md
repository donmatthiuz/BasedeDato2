# Etapa 1 – Modelado de la base de datos en MongoDB

## Colecciones implementadas

1. **`restaurante`**
   - Contiene datos del restaurante: nombre, dirección, teléfono y categoría.
   - Usada como referencia en varias otras colecciones (menú, orden, reseña).
   - **Usos y consultas esperadas**
       - Identificar usuarios registrados.
       - Obtener restaurantes por nombre o categoría.
       - Generar reportes de los restaurantes mejor calificados (agregación con `resena`).
       - Buscar rápidamente un restaurante por texto.
   - **Índices:**
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

2. **`usuario`**
   - Almacena los datos del cliente: nombre, email, dirección, teléfono, contraseña, y fecha de registro.
   - Relacionado con las colecciones de orden y reseña.
   - **Usos y consultas esperadas**
       - Identificar usuarios registrados.
       - Obtener actividad de un usuario (órdenes, reseñas).
   - **Índices:**
      1. **Índice compuesto:**  

         ```js
         db.usuario.createIndex({ nombre: 1, direccion: 1 })
         ```

         > Mejora búsquedas por nombre y ubicación.

3. **`articulo_menu`**
   - Representa los productos del menú ofrecidos por los restaurantes.
   - Incluye nombre, precio, descripción, disponibilidad y `restaurante_id` referenciado.
   - **Usos y consultas esperadas**
       - Listar el menú de un restaurante.
       - Filtrar por disponibilidad.
       - Búsquedas por nombre o descripción del platillo.
   - **Índices:**
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

4. **`orden`**
   - Documento que incluye usuario, restaurante, fecha, estado del pedido y un array de platillos.
   - Cada platillo contiene `menu_item_id`, cantidad y precio unitario -> **documento embebido** dentro de la orden.
   - **Usos y consultas esperadas**
       - Identificar usuarios registrados.
       - Listar pedidos por usuario y fecha.
       - Consultar estado del pedido.
       - Reportes de platillos más vendidos (con `$unwind` + `$group`).
       - Consultas por rango de fechas, estados, o totales.
   - **Índices:**
      1. **Índice compuesto:**  

         ```js
         db.orden.createIndex({ usuario_id: 1, fecha: -1 })
         ```

         > Consultas por órdenes recientes de un usuario.
      2. **Índice multikey (por array):**  

         ```js
         db.orden.createIndex({ "platillos.menu_item_id": 1 })
         ```

         > Mejora consultas por items de menú en pedidos.

5. **`resena`**
   - Contiene calificación y comentario que el usuario deja para un restaurante, vinculado además a una orden específica.
   - Relación referenciada a `usuario`, `orden` y `restaurante`
   - **Usos y consultas esperadas**
       - Ver reseñas de un restaurante.
       - Obtener calificación promedio.
       - Ver comentarios hechos por un usuario.
       - Agregaciones por calificación y fecha.
   - **Índices:**
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

![Diagrama de Modelo de Datos NoSQL](../images/diagrama.jpg "Diagrama de Modelo de Datos NoSQL")

## Justificación de estructuras embebidas vs referenciadas

- Se **embeben los platillos** dentro de la orden para facilitar consultas frecuentes como el detalle completo del pedido.
- Se **referencian usuarios, restaurantes, artículos y órdenes** para evitar redundancia y facilitar mantenibilidad (por ejemplo, si un nombre de restaurante cambia, no hay que actualizar múltiples órdenes).

## Requisitos técnicos cubiertos en esta etapa

| Requisito                                       | Descripción breve de cómo se cumple                                               |
|------------------------------------------------|------------------------------------------------------------------------------------|
| Documentos embebidos                           | Uso del array `platillos` dentro de `orden`                                       |
| Documentos referenciados                       | Relaciones entre `orden`, `usuario`, `restaurante`, `resena`, `articulo_menu`     |
| Mínimo de 5 colecciones                        | Cumplido: restaurante, usuario, articulo_menu, orden, reseña                      |
| Estructura que soporta CRUD                    | Diseño pensado para crear, consultar, actualizar y eliminar documentos            |
| Pensado para uso de índices                    | Colecciones clave tienen campos claros para crear índices (ver sugerencias arriba)|
| Compatible con agregaciones                    | Ej. se podrá agregar para ventas por restaurante, calificación promedio, etc.     |
| Arrays manipulables                            | Array `platillos` en orden soporta `$push`, `$pull`, `$addToSet`, etc.           |

## Precarga de datos (`mongoimport`)

Usando la sintaxis mencionada en el [**siguiente enlace**](https://www.mongodb.com/docs/database-tools/mongoimport/).

Se puede hacer el siguiente comando para poblar la base de datos con los archivos `json` definidos en el repositorio:

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

## Requisitos faltantes

### Requisitos generales aún no cubiertos (etapas futuras)

| Requisito                                          | Etapa esperada | Estado       | Observaciones |
|----------------------------------------------------|----------------|--------------|---------------|
| **Implementación REST API**                        | Etapa 2        | ❌ No iniciado| Se espera el backend (Node.js, Python, etc.). |
| **Operaciones CRUD (completo)**                    | Etapa 2        | ❌ No iniciado| Aún no hay endpoints ni pruebas. |
| **Ordenamiento y proyecciones en consultas**       | Etapa 2        | ❌ No iniciado| Requiere consultas reales desde la API. |
| **Agregaciones simples y complejas**               | Etapa 2        | ❌ No iniciado| No hay pipelines implementados. |
| **Manejo de archivos con GridFS (50k docs)**       | Etapa 2        | ❌ No iniciado| Falta colección para ello, puede ser imágenes de menú o comprobantes. |
| **Manejo de arrays con `$push`, `$pull`, etc.**    | Etapa 2        | ⚠️ Parcial   | El diseño lo permite (ej. array `platillos`), pero falta implementación. |
| **Operaciones `bulkWrite`**                        | Extra          | ❌ No cubierto| No planeado ni implementado aún. |
| **Mongo Charts / BI Connectors / Frontend**        | Extra          | ❌ No cubierto| No hay integración visual ni informes. |
