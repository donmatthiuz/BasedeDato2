# Etapa 1 – Modelado de la base de datos en MongoDB

## Colecciones implementadas

1. **`restaurante`**
   - Contiene datos básicos del restaurante: nombre, dirección, teléfono y categoría.
   - Usada como referencia en varias otras colecciones (menú, orden, reseña).
   - **Índices sugeridos**: nombre (texto), categoría (simple).

2. **`usuario`**
   - Almacena los datos del cliente: nombre, email, dirección, teléfono, contraseña (enmascarada), y fecha de registro.
   - Relacionado con las colecciones de orden y reseña.
   - **Índices sugeridos**: email (único), fecha_registro (simple).

3. **`articulo_menu`**
   - Representa los productos del menú ofrecidos por los restaurantes.
   - Incluye nombre, precio, descripción, disponibilidad y `restaurante_id` referenciado.
   - **Índices sugeridos**: restaurante_id (compuesto con nombre para búsquedas eficientes).

4. **`orden`**
   - Documento que incluye usuario, restaurante, fecha, estado del pedido y un array de platillos.
   - Cada platillo contiene `menu_item_id`, cantidad y precio unitario → **documento embebido** dentro de la orden.
   - **Índices sugeridos**: usuario_id, fecha (compuesto con estado), restaurante_id.

5. **`resena`**
   - Contiene calificación y comentario que el usuario deja para un restaurante, vinculado además a una orden específica.
   - Relación referenciada a `usuario`, `orden` y `restaurante`.
   - **Índices sugeridos**: restaurante_id (compuesto con calificación), fecha.

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
| Posible integración con GridFS (en etapa 2)    | Aunque no se incluye aún, puede agregarse para subir imágenes de platillos        |

## Precarga de datos (`mongoimport`)

Usando la sintaxis mencionada en el [**siguiente enlace**](https://www.mongodb.com/docs/database-tools/mongoimport/).

Se puede hacer el siguiente comando para poblar la base de datos con los archivos `json` definidos en el repositorio:

```bash
mongoimport --uri "<uri>" --collection "<nombre_coleccion>" --file "<ruta_al_archivo_de_importacion>"
```

```bash
mongoimport --uri "uri" --collection cliente --file "./data/clientes.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_0.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_1.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_2.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_3.json" --jsonArray
mongoimport --uri "uri" --collection orden --file "./data/ordenes_4.json" --jsonArray
mongoimport --uri "uri" --collection resena --file "./data/resenas.json" --jsonArray
mongoimport --uri "uri" --collection restaurante --file "./data/restaurantes.json" --jsonArray
```

## Requisitos faltantes

### Requisitos no cubiertos en Etapa 1

| Requisito                                            | Estado       | Observaciones                                                                 |
|------------------------------------------------------|--------------|-------------------------------------------------------------------------------|
| **Precarga con `mongoimport`**                       | ❌ No cubierto| Aunque es viable, no se ha proporcionado el JSON ni ejecutado `mongoimport`. |
| **Definición de índices específicos (2 por colección)** | ⚠️ Parcial   | Se han sugerido, pero no se han definido ni implementado explícitamente.     |
| **Índices multikey**                                 | ❌ No cubierto| No hay arrays indexados directamente (ej. etiquetas en artículos, etc.).     |
| **Índice geoespacial**                               | ❌ No cubierto| No se ha usado un campo de ubicación tipo `location: { type, coordinates }`. |
| **Índice de texto**                                  | ❌ No cubierto| Falta implementación en campos como `comentario` o `nombre`.                 |

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
