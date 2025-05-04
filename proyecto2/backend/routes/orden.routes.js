const express = require("express");
const router = express.Router();
const {
  crearOrden,
  obtenerOrdenes,
  subirArchivoOrden,
} = require("../controllers/orden.controller");

/**
 * @swagger
 * /orden:
 *   post:
 *     summary: Crear una o varias órdenes
 *     description: Permite crear una o varias órdenes. El campo `total` se calcula automáticamente. El campo `fecha` es opcional; si no se incluye, se asigna la fecha actual.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   usuario_id:
 *                     type: string
 *                     format: uuid
 *                     example: "3ec19822-f7b4-4d52-b0b0-f541d96551f1"
 *                   restaurante_id:
 *                     type: string
 *                     format: uuid
 *                     example: "84862c31-461c-4706-b43d-d60487400588"
 *                   estado:
 *                     type: string
 *                     example: "pendiente"
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-07-01T12:00:00Z"
 *                   platillos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           example: "Pizza Margarita"
 *                         descripcion:
 *                           type: string
 *                           example: "Pizza con salsa de tomate y queso mozzarella"
 *                         precio:
 *                           type: number
 *                           example: 89.5
 *                         cantidad:
 *                           type: number
 *                           example: 2
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     usuario_id:
 *                       type: string
 *                     restaurante_id:
 *                       type: string
 *                     estado:
 *                       type: string
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                     platillos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nombre:
 *                             type: string
 *                           descripcion:
 *                             type: string
 *                           precio:
 *                             type: number
 *                           cantidad:
 *                             type: number
 *     responses:
 *       201:
 *         description: Orden(es) creada(s)
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", crearOrden);

/**
 * @swagger
 * /ordenes/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar una o varias órdenes
 *     description: El archivo debe llamarse `orden` y contener uno o varios objetos de orden. El campo `total` se calcula automáticamente. El campo `fecha` es opcional.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               orden:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con una o varias órdenes
 *     responses:
 *       201:
 *         description: Órdenes insertadas desde archivo
 *       400:
 *         description: Error al procesar el archivo
 *     examples:
 *       application/json:
 *         value:
 *           [
 *             {
 *               "usuario_id": "3ec19822-f7b4-4d52-b0b0-f541d96551f1",
 *               "restaurante_id": "84862c31-461c-4706-b43d-d60487400588",
 *               "fecha": { "$date": "2024-06-26T22:34:51Z" },
 *               "estado": "pendiente",
 *               "platillos": [
 *                 {
 *                   "nombre": "Taco al Pastor",
 *                   "descripcion": "Taco con carne de cerdo marinada y piña",
 *                   "precio": 25.5,
 *                   "cantidad": 3
 *                 }
 *               ]
 *             }
 *           ]
 */
router.post("/upload", subirArchivoOrden);

/**
 * @swagger
 * /orden:
 *   get:
 *     summary: Obtener órdenes con filtros avanzados
 *     parameters:
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: string
 *           example: 3ec19822-f7b4-4d52-b0b0-f541d96551f1
 *         description: ID del usuario que realizó la orden
 *       - in: query
 *         name: restaurante_id
 *         schema:
 *           type: string
 *           example: 84862c31-461c-4706-b43d-d60487400588
 *         description: ID del restaurante asociado a la orden
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           example: cancelada
 *         description: Estado exacto de la orden
 *       - in: query
 *         name: estado_in
 *         schema:
 *           type: string
 *           example: cancelada,completada
 *         description: Lista de estados permitidos (separados por coma)
 *       - in: query
 *         name: estado_nin
 *         schema:
 *           type: string
 *           example: pendiente
 *         description: Lista de estados a excluir
 *       - in: query
 *         name: total_gt
 *         schema:
 *           type: number
 *           example: 500
 *         description: Total mayor que
 *       - in: query
 *         name: total_gte
 *         schema:
 *           type: number
 *           example: 600
 *         description: Total mayor o igual que
 *       - in: query
 *         name: total_lt
 *         schema:
 *           type: number
 *           example: 700
 *         description: Total menor que
 *       - in: query
 *         name: total_lte
 *         schema:
 *           type: number
 *           example: 600
 *         description: Total menor o igual que
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2024-06-01T00:00:00Z
 *         description: Fecha inicial (ISO 8601)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2024-07-01T00:00:00Z
 *         description: Fecha final (ISO 8601)
 *       - in: query
 *         name: exists
 *         schema:
 *           type: string
 *           example: estado,-platillos
 *         description: Verifica existencia o ausencia de campos. Usa `-` para negar.
 *       - in: query
 *         name: campos
 *         schema:
 *           type: string
 *           example: estado,total
 *         description: Campos a incluir en la respuesta (separados por coma)
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           example: -fecha
 *         description: Campo por el cual ordenar (usa `-` para descendente)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Cantidad de documentos a omitir
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad máxima de resultados a retornar
 *     responses:
 *       200:
 *         description: Lista de órdenes filtradas
 *       400:
 *         description: Consulta no válida o sin índice
 */
router.get("/", obtenerOrdenes);

module.exports = router;
