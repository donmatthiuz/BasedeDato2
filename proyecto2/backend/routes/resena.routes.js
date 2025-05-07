const express = require("express");
const router = express.Router();
const {
  crearResena,
  obtenerResenas,
  subirArchivoResena,
  actualizarResena,
  eliminarResena,
} = require("../controllers/resena.controller");

// --- CRUD ---

/**
 * @swagger
 * /resena:
 *   post:
 *     summary: Crear una o varias reseñas
 *     description: Registra una o varias reseñas. Si no se incluye el campo `fecha`, se asigna automáticamente la fecha y hora actual del servidor.
 *     tags:
 *      - Reseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   restaurante_id:
 *                     type: string
 *                     example: "681741a5a913f0b464ef950f"
 *                   usuario_id:
 *                     type: string
 *                     example: "68174f099a2bb59ba7bb111c"
 *                   nombre_usuario:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   calificacion:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 4
 *                   comentario:
 *                     type: string
 *                     example: "Muy buena experiencia"
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-23T09:27:47Z"
 *                   menu:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Tacos de prueba A"
 *                       precio:
 *                         type: number
 *                         example: 35
 *                       descripcion:
 *                         type: string
 *                         example: "Tacos con ingredientes de prueba"
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     restaurante_id:
 *                       type: string
 *                     usuario_id:
 *                       type: string
 *                     nombre_usuario:
 *                       type: string
 *                     calificacion:
 *                       type: integer
 *                     comentario:
 *                       type: string
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                     menu:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                         precio:
 *                           type: number
 *                         descripcion:
 *                           type: string
 *     responses:
 *       201:
 *         description: Reseña(s) creada(s)
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", crearResena);

/**
 * @swagger
 * /resenas/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar una o varias reseñas
 *     description: El archivo debe llamarse `resena` y contener uno o varios objetos con los campos requeridos. Si no se proporciona el campo `fecha`, se asignará automáticamente la fecha actual del servidor.
 *     tags:
 *      - Reseña
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resena:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con una o varias reseñas
 *     responses:
 *       201:
 *         description: Reseñas insertadas desde archivo
 *       400:
 *         description: Error al procesar el archivo
 *     examples:
 *       application/json:
 *         value:
 *           [
 *             {
 *               "restaurante_id": "681741a5a913f0b464ef950f",
 *               "usuario_id": "68174f099a2bb59ba7bb111c",
 *               "nombre_usuario": "Juan Pérez",
 *               "calificacion": 4,
 *               "comentario": "Muy buena experiencia",
 *               "fecha": "2025-03-23T09:27:47Z",
 *               "menu": {
 *                 "nombre": "Tacos de prueba A",
 *                 "precio": 35,
 *                 "descripcion": "Tacos con ingredientes de prueba"
 *               }
 *             }
 *           ]
 */
router.post("/upload", subirArchivoResena);

/**
 * @swagger
 * /resena:
 *   get:
 *     summary: Obtener reseñas con filtros avanzados
 *     tags:
 *      - Reseña
 *     parameters:
 *       - in: query
 *         name: restaurante_id
 *         schema:
 *           type: string
 *           example: fe8b0c30-c333-4a50-a9a6-3823cb041d92
 *         description: ID del restaurante
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: string
 *           example: 52f1d182-6ccd-4475-bac7-fcad0b84cd28
 *         description: ID del usuario
 *       - in: query
 *         name: calificacion_in
 *         schema:
 *           type: string
 *           example: 1,2,3
 *         description: Lista de calificaciones permitidas (separadas por coma)
 *       - in: query
 *         name: calificacion_nin
 *         schema:
 *           type: string
 *           example: 4,5
 *         description: Lista de calificaciones a excluir
 *       - in: query
 *         name: calificacion_gt
 *         schema:
 *           type: integer
 *           example: 3
 *         description: Calificación mayor que
 *       - in: query
 *         name: calificacion_gte
 *         schema:
 *           type: integer
 *           example: 4
 *         description: Calificación mayor o igual
 *       - in: query
 *         name: calificacion_lt
 *         schema:
 *           type: integer
 *           example: 3
 *         description: Calificación menor que
 *       - in: query
 *         name: calificacion_lte
 *         schema:
 *           type: integer
 *           example: 2
 *         description: Calificación menor o igual
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-03-01T00:00:00Z
 *         description: Fecha mínima de reseña (ISO 8601)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-04-01T00:00:00Z
 *         description: Fecha máxima de reseña (ISO 8601)
 *       - in: query
 *         name: comentario
 *         schema:
 *           type: string
 *           example: excelente
 *         description: Texto parcial contenido en el comentario (regex insensible a mayúsculas)
 *       - in: query
 *         name: nombre_usuario
 *         schema:
 *           type: string
 *           example: juan
 *         description: Texto parcial del nombre del usuario (regex insensible a mayúsculas)
 *       - in: query
 *         name: menu_nombre
 *         schema:
 *           type: string
 *           example: pizza
 *         description: Búsqueda parcial por nombre del platillo (regex insensible a mayúsculas)
 *       - in: query
 *         name: menu_precio_gt
 *         schema:
 *           type: number
 *           example: 50
 *         description: Precio del platillo mayor que
 *       - in: query
 *         name: menu_precio_gte
 *         schema:
 *           type: number
 *           example: 60
 *         description: Precio del platillo mayor o igual
 *       - in: query
 *         name: menu_precio_lt
 *         schema:
 *           type: number
 *           example: 100
 *         description: Precio del platillo menor que
 *       - in: query
 *         name: menu_precio_lte
 *         schema:
 *           type: number
 *           example: 80
 *         description: Precio del platillo menor o igual
 *       - in: query
 *         name: exists
 *         schema:
 *           type: string
 *           example: comentario,-menu.descripcion
 *         description: Verifica existencia o ausencia de campos. Usa `-` para negar.
 *       - in: query
 *         name: campos
 *         schema:
 *           type: string
 *           example: calificacion,comentario,fecha
 *         description: Campos a incluir en la respuesta (separados por coma)
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           example: -fecha
 *         description: Campo para ordenar (usa `-` para ascendente)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Resultados a omitir (paginación)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Máximo de resultados a retornar
 *     responses:
 *       200:
 *         description: Lista de reseñas encontradas
 *       500:
 *         description: Consulta no válida o sin índice
 */
router.get("/", obtenerResenas);

/**
 * @swagger
 * /resena:
 *   patch:
 *     summary: Actualizar una o varias reseñas
 *     description: Permite actualizar una o múltiples reseñas. Solo se requiere el campo `_id`. Se puede actualizar el menú embebido, comentario, calificación, fecha, etc.
 *     tags:
 *      - Reseña
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
 *                     example: "6817b9b2e33af63113f5a099"
 *                   comentario:
 *                     type: string
 *                     example: "Excelente comida actualizada"
 *                   calificacion:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 5
 *                   menu:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Hamburguesa Doble"
 *                       precio:
 *                         type: number
 *                         example: 68.5
 *                       descripcion:
 *                         type: string
 *                         example: "Con queso y tocino"
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6817b9b2e33af63113f5a098"
 *                     comentario:
 *                       type: string
 *                       example: "Buena atención"
 *                     calificacion:
 *                       type: integer
 *                       example: 4
 *                     menu:
 *                       type: object
 *                       properties:
 *                         precio:
 *                           type: number
 *                           example: 42
 *     responses:
 *       200:
 *         description: Reseña(s) actualizada(s)
 *       400:
 *         description: Error al actualizar reseña(s)
 *       404:
 *         description: Reseña no encontrada
 */
router.patch("/", actualizarResena);

/**
 * @swagger
 * /resena:
 *   delete:
 *     summary: Eliminar una o varias reseñas
 *     description: Elimina una o varias reseñas mediante sus identificadores `_id`. Se puede enviar un solo objeto o un arreglo de objetos.
 *     tags:
 *      - Reseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [_id]
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 6817c161b94ef16d3f5c9001
 *               - type: array
 *                 items:
 *                   type: object
 *                   required: [_id]
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6817c161b94ef16d3f5c9002
 *     responses:
 *       200:
 *         description: Resultado de la eliminación
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     eliminado:
 *                       type: boolean
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       eliminado:
 *                         type: boolean
 *                       error:
 *                         type: string
 *       400:
 *         description: Error en los datos enviados o falta de _id
 */
router.delete("/", eliminarResena);

// --- AGREGACIONES ---

module.exports = router;
