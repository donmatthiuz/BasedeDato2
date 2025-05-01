const express = require("express");
const router = express.Router();
const {
  crearResena,
  obtenerResenas,
} = require("../controllers/resena.controller");

/**
 * @swagger
 * /resenas:
 *   get:
 *     summary: Obtener reseñas
 *     parameters:
 *       - in: query
 *         name: restaurante_id
 *         schema:
 *           type: string
 *         description: ID del restaurante
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reseñas
 */

router.get("/", obtenerResenas);
/**
 * @swagger
 * /resenas:
 *   post:
 *     summary: Crear una nueva reseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurante_id:
 *                 type: string
 *               usuario_id:
 *                 type: string
 *               orden_id:
 *                 type: string
 *               calificacion:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reseña creada
 */
router.post("/", crearResena);

module.exports = router;
