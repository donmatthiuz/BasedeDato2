const express = require("express");
const router = express.Router();
const {
  crearResena,
  obtenerResenas,
  subirArchivoResena,
} = require("../controllers/resena.controller");

/**
 * @swagger
 * /resena:
 *   post:
 *     summary: Crear una o varias reseñas
 *     description: Registra una o varias reseñas. Si no se incluye el campo `fecha`, se asigna automáticamente la fecha y hora actual del servidor.
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
 *                     example: "fe8b0c30-c333-4a50-a9a6-3823cb041d92"
 *                   usuario_id:
 *                     type: string
 *                     example: "52f1d182-6ccd-4475-bac7-fcad0b84cd28"
 *                   orden_id:
 *                     type: string
 *                     example: "cb01f915-357a-4a2c-bcf5-d61f80c57a79"
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
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     restaurante_id:
 *                       type: string
 *                       example: "fe8b0c30-c333-4a50-a9a6-3823cb041d92"
 *                     usuario_id:
 *                       type: string
 *                       example: "52f1d182-6ccd-4475-bac7-fcad0b84cd28"
 *                     orden_id:
 *                       type: string
 *                       example: "cb01f915-357a-4a2c-bcf5-d61f80c57a79"
 *                     calificacion:
 *                       type: integer
 *                       example: 5
 *                     comentario:
 *                       type: string
 *                       example: "Excelente comida y atención"
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-24T12:45:00Z"
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
 *               "restaurante_id": "fe8b0c30-c333-4a50-a9a6-3823cb041d92",
 *               "usuario_id": "52f1d182-6ccd-4475-bac7-fcad0b84cd28",
 *               "orden_id": "cb01f915-357a-4a2c-bcf5-d61f80c57a79",
 *               "calificacion": 4,
 *               "comentario": "Muy buena experiencia",
 *               "fecha": "2025-03-23T09:27:47Z"
 *             },
 *             {
 *               "restaurante_id": "fe8b0c30-c333-4a50-a9a6-3823cb041d92",
 *               "usuario_id": "52f1d182-6ccd-4475-bac7-fcad0b84cd28",
 *               "orden_id": "cb01f915-357a-4a2c-bcf5-d61f80c57a79",
 *               "calificacion": 5,
 *               "comentario": "Excelente servicio"
 *             }
 *           ]
 */
router.post("/upload", subirArchivoResena);

/**
 * @swagger
 * /resena:
 *   get:
 *     summary: Obtener reseñas con filtros avanzados
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
 *         name: orden_id
 *         schema:
 *           type: string
 *           example: cb01f915-357a-4a2c-bcf5-d61f80c57a79
 *         description: ID de la orden relacionada
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
 *           example: doloremque
 *         description: Texto que debe estar incluido en el comentario (búsqueda parcial)
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
 *         description: Número de resultados a omitir (para paginación)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Número máximo de resultados
 *     responses:
 *       200:
 *         description: Lista de reseñas encontradas
 */
router.get("/", obtenerResenas);

module.exports = router;
