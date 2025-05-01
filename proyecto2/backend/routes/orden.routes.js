const express = require("express");
const router = express.Router();
const {
  crearOrden,
  obtenerOrdenes,
} = require("../controllers/orden.controller");

/**
 * @swagger
 * /ordenes:
 *   get:
 *     summary: Obtener órdenes
 *     parameters:
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado del pedido (pendiente, completada, etc.)
 *     responses:
 *       200:
 *         description: Lista de órdenes
 */

router.get("/", obtenerOrdenes);
/**
 * @swagger
 * /ordenes:
 *   post:
 *     summary: Crear una nueva orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: string
 *               restaurante_id:
 *                 type: string
 *               estado:
 *                 type: string
 *               metodo_pago:
 *                 type: string
 *               platillos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menu_item_id:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *                     precio_unitario:
 *                       type: number
 *     responses:
 *       201:
 *         description: Orden creada
 */
router.post("/", crearOrden);

module.exports = router;
