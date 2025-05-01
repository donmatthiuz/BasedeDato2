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
 *                     example: "3ec19822-f7b4-4d52-b0b0-f541d96551f1"
 *                   restaurante_id:
 *                     type: string
 *                     example: "84862c31-461c-4706-b43d-d60487400588"
 *                   estado:
 *                     type: string
 *                     example: "pendiente"
 *                   metodo_pago:
 *                     type: string
 *                     example: "efectivo"
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-07-01T12:00:00Z"
 *                   platillos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         menu_item_id:
 *                           type: string
 *                           example: "908d1f97-b9f4-487c-a0a5-d819017e6d7f"
 *                         cantidad:
 *                           type: number
 *                           example: 2
 *                         precio_unitario:
 *                           type: number
 *                           example: 130
 *               - type: array
 *                 items:
 *                   $ref: '#/components/schemas/Orden'
 *     responses:
 *       201:
 *         description: Orden(es) creada(s)
 */
router.post("/", crearOrden);

/**
 * @swagger
 * /ordenes/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar una o varias órdenes
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               orden:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Órdenes insertadas desde archivo
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
 *         description: Campo por el cual ordenar (usa `-` para ascendente)
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
 */
router.get("/", obtenerOrdenes);

module.exports = router;
