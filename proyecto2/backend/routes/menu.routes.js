const express = require("express");
const router = express.Router();
const {
  crearArticulo,
  obtenerArticulos,
  subirArchivoMenu,
  actualizarArticulo,
  eliminarArticulo,
  cantidadArticulosPorRestaurante,
  restaurantesSegunCantidadMenus,
  promedioPrecioPorRestaurante,
  articuloExtremosPorRestaurante,
  topOBottomRestaurantesPorPrecioPromedio,
  promedioPrecioPorCategoria,
  distribucionPreciosPorZona,
} = require("../controllers/menu.controller");

// --- CRUD ---

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Crear uno o varios artículos de menú
 *     description: Permite registrar uno o varios artículos del menú. Cada artículo debe contener nombre, precio y restaurante asociado. El campo `disponible` es opcional (por defecto es `true`).
 *     tags:
 *      - Menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     example: "Ensalada César"
 *                   descripcion:
 *                     type: string
 *                     example: "Ensalada con lechuga romana, pollo y aderezo césar"
 *                   precio:
 *                     type: number
 *                     example: 45.5
 *                   disponible:
 *                     type: boolean
 *                     example: true
 *                   restaurante_id:
 *                     type: string
 *                     example: "c3f3bb5f-93a2-4bc8-b15f-085b684e6f62"
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: "Hamburguesa BBQ"
 *                     descripcion:
 *                       type: string
 *                       example: "Hamburguesa con salsa BBQ, queso cheddar y tocino"
 *                     precio:
 *                       type: number
 *                       example: 58.9
 *                     disponible:
 *                       type: boolean
 *                       example: false
 *                     restaurante_id:
 *                       type: string
 *                       example: "c3f3bb5f-93a2-4bc8-b15f-085b684e6f62"
 *     responses:
 *       201:
 *         description: Artículo(s) creado(s)
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", crearArticulo);

/**
 * @swagger
 * /menu/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar artículos del menú
 *     description: Permite cargar un archivo `.json` que contenga uno o varios artículos del menú. El campo del formulario debe llamarse `menu`. El campo `disponible` es opcional (por defecto es `true`).
 *     tags:
 *      - Menu
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               menu:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con uno o varios artículos
 *     responses:
 *       201:
 *         description: Artículos insertados desde archivo
 *       400:
 *         description: Error al procesar el archivo
 */
router.post("/upload", subirArchivoMenu);

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Obtener artículos del menú con filtros avanzados
 *     tags:
 *      - Menu
 *     parameters:
 *       - in: query
 *         name: restaurante_id
 *         schema:
 *           type: string
 *           example: c3f3bb5f-93a2-4bc8-b15f-085b684e6f62
 *         description: ID del restaurante asociado
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filtrar por disponibilidad (true o false)
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *           example: anca
 *         description: Búsqueda parcial por nombre del platillo (regex insensible a mayúsculas)
 *       - in: query
 *         name: precio_min
 *         schema:
 *           type: number
 *           example: 70
 *         description: Precio mínimo (mayor o igual que)
 *       - in: query
 *         name: precio_max
 *         schema:
 *           type: number
 *           example: 100
 *         description: Precio máximo (menor o igual que)
 *       - in: query
 *         name: precio_gt
 *         schema:
 *           type: number
 *           example: 50
 *         description: Precio estrictamente mayor que este valor
 *       - in: query
 *         name: precio_lt
 *         schema:
 *           type: number
 *           example: 90
 *         description: Precio estrictamente menor que este valor
 *       - in: query
 *         name: exists
 *         schema:
 *           type: string
 *           example: descripcion,-disponible
 *         description: Verifica existencia o ausencia de campos. Usa `-` para negar.
 *       - in: query
 *         name: campos
 *         schema:
 *           type: string
 *           example: nombre,precio
 *         description: Campos a incluir en la respuesta (proyección). Separados por coma.
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           example: -precio
 *         description: Ordenar por campo. Usa `-` para ascendente (ej. -precio)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Cuántos resultados omitir (para paginación)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cuántos resultados retornar (para paginación)
 *     responses:
 *       200:
 *         description: Lista de artículos filtrados
 *       500:
 *         description: Consulta no válida o sin índice
 */
router.get("/", obtenerArticulos);

/**
 * @swagger
 * /menu:
 *   patch:
 *     summary: Actualizar uno o varios artículos del menú
 *     description: Permite actualizar cualquier campo de uno o varios artículos del menú. Solo se requiere incluir el campo `_id` y los campos que se deseen modificar.
 *     tags:
 *      - Menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6817492c6d0b0ee7f00fc65d"
 *                   nombre:
 *                     type: string
 *                     example: "Tacos Especiales"
 *                   precio:
 *                     type: number
 *                     example: 42.5
 *                   descripcion:
 *                     type: string
 *                     example: "Tacos con carne premium y guacamole"
 *                   disponible:
 *                     type: boolean
 *                     example: true
 *                   restaurante_id:
 *                     type: string
 *                     example: "681741a5a913f0b464ef950f"
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *                     descripcion:
 *                       type: string
 *                     disponible:
 *                       type: boolean
 *                     restaurante_id:
 *                       type: string
 *     responses:
 *       200:
 *         description: Artículo(s) actualizado(s)
 *       400:
 *         description: Error al actualizar o datos inválidos
 *       404:
 *         description: Uno o más artículos no fueron encontrados
 */
router.patch("/", actualizarArticulo);

/**
 * @swagger
 * /menu:
 *   delete:
 *     summary: Eliminar uno o varios artículos del menú
 *     description: Permite eliminar uno o varios documentos de menú proporcionando sus `_id`. Si se envía un array, elimina múltiples documentos.
 *     tags:
 *      - Menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 681741a5a913f0b464ef960f
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 681741a5a913f0b464ef9610
 *     responses:
 *       200:
 *         description: Resultado de la operación de eliminación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eliminados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       status:
 *                         type: string
 *                         example: eliminado
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       error:
 *                         type: string
 *       400:
 *         description: Error al procesar la solicitud de eliminación
 */
router.delete("/", eliminarArticulo);

// --- AGREGACIONES ---

/**
 * @swagger
 * /menu/cantidad-por-restaurante:
 *   get:
 *     summary: Obtener la cantidad de artículos del menú por restaurante
 *     tags:
 *       - Menú - Agregaciones
 *     responses:
 *       200:
 *         description: Lista de restaurantes con la cantidad de artículos del menú.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurante_id:
 *                     type: string
 *                     example: "663bc7a917bac5271c712ca1"
 *                   nombre_restaurante:
 *                     type: string
 *                     example: "La Parrilla del Chef"
 *                   cantidad_articulos:
 *                     type: integer
 *                     example: 12
 *       500:
 *         description: Error interno del servidor
 */
router.get("/cantidad-por-restaurante", cantidadArticulosPorRestaurante);

/**
 * @swagger
 * /menu/restaurantes-por-menu:
 *   get:
 *     summary: Restaurantes con mayor o menor número de platillos
 *     tags:
 *       - Menú - Agregaciones
 *     parameters:
 *       - in: query
 *         name: min
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Mínimo número de platillos registrados (opcional)
 *       - in: query
 *         name: max
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Máximo número de platillos registrados (opcional)
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *         description: Orden ascendente o descendente por cantidad
 *     responses:
 *       200:
 *         description: Lista de restaurantes con detalle de artículos según cantidad de menús
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurante_id:
 *                     type: string
 *                     example: "663bc7a917bac5271c712ca1"
 *                   nombre_restaurante:
 *                     type: string
 *                     example: "La Parrilla del Chef"
 *                   cantidad_articulos:
 *                     type: integer
 *                     example: 15
 *                   nombres_articulos:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Taco al Pastor"
 *       500:
 *         description: Error interno del servidor
 */
router.get("/restaurantes-por-menu", restaurantesSegunCantidadMenus);

/**
 * @swagger
 * /menu/promedio:
 *   get:
 *     summary: Promedio de precios por restaurante
 *     description: Calcula el precio promedio de artículos del menú por restaurante.
 *     tags:
 *       - Menú - Agregaciones
 *     parameters:
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Orden del promedio (ascendente o descendente)
 *     responses:
 *       200:
 *         description: Lista de restaurantes con precio promedio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurante_id:
 *                     type: string
 *                   nombre_restaurante:
 *                     type: string
 *                   promedio_precio:
 *                     type: number
 *       500:
 *         description: Error interno del servidor
 */
router.get("/promedio", promedioPrecioPorRestaurante);

/**
 * @swagger
 * /menu/extremos:
 *   get:
 *     summary: Artículo más barato y más caro por restaurante
 *     description: Devuelve el platillo más barato y más caro para cada restaurante.
 *     tags:
 *       - Menú - Agregaciones
 *     responses:
 *       200:
 *         description: Lista con extremos de precio por restaurante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurante_id:
 *                     type: string
 *                   nombre_restaurante:
 *                     type: string
 *                   mas_barato:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                       precio:
 *                         type: number
 *                   mas_caro:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                       precio:
 *                         type: number
 *       500:
 *         description: Error interno del servidor
 */
router.get("/extremos", articuloExtremosPorRestaurante);

/**
 * @swagger
 * /menu/precios/top-bottom:
 *   get:
 *     summary: Restaurantes con precios promedio más altos o bajos
 *     description: Retorna los N restaurantes cuyo precio promedio es mayor (`top`) o menor (`bottom`), según el parámetro `tipo`.
 *     tags:
 *       - Menú - Agregaciones
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [top, bottom]
 *           default: top
 *         description: Define si se devuelven los de precios más altos (`top`) o bajos (`bottom`)
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Número máximo de restaurantes a devolver
 *     responses:
 *       200:
 *         description: Lista de restaurantes con su precio promedio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurante_id:
 *                     type: string
 *                   nombre_restaurante:
 *                     type: string
 *                   promedio_precio:
 *                     type: number
 *       500:
 *         description: Error interno del servidor
 */
router.get("/precios/top-bottom", topOBottomRestaurantesPorPrecioPromedio);

/**
 * @swagger
 * /menu/promedio-por-categoria:
 *   get:
 *     summary: Promedio de precios por categoría de restaurante
 *     description: Calcula el precio promedio de los artículos de menú agrupados por la categoría del restaurante.
 *     tags:
 *       - Menú - Agregaciones
 *     responses:
 *       200:
 *         description: Lista de categorías con su precio promedio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoria:
 *                     type: string
 *                     example: Mexicana
 *                   promedio_precio:
 *                     type: number
 *                     example: 85.25
 *                   total_articulos:
 *                     type: integer
 *                     example: 12
 *       500:
 *         description: Error interno del servidor
 */
router.get("/promedio-por-categoria", promedioPrecioPorCategoria);

/**
 * @swagger
 * /menu/precios/zona:
 *   get:
 *     summary: Distribución de precios de menú por región geográfica
 *     description: Calcula el promedio, precio mínimo y máximo de menú por restaurante agrupado por zona (N, S, NE, NW, SE, SW). Se puede ordenar por precio promedio y limitar resultados.
 *     tags:
 *       - Menú - Agregaciones
 *     parameters:
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de los precios promedios
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Límite de resultados por región
 *     responses:
 *       200:
 *         description: Distribución de precios por zona
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   zona:
 *                     type: string
 *                     example: NE
 *                   restaurantes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         restaurante_id:
 *                           type: string
 *                         nombre_restaurante:
 *                           type: string
 *                         promedio_precio:
 *                           type: number
 *                         precio_min:
 *                           type: number
 *                         precio_max:
 *                           type: number
 *       500:
 *         description: Error interno del servidor
 */
router.get("/precios/zona", distribucionPreciosPorZona);

module.exports = router;
