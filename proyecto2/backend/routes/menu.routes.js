const express = require("express");
const router = express.Router();
const {
  crearArticulo,
  obtenerArticulos,
} = require("../controllers/menu.controller");

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Obtener artículos del menú
 *     parameters:
 *       - in: query
 *         name: restaurante_id
 *         schema:
 *           type: string
 *         description: ID del restaurante
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: boolean
 *         description: Filtrar por disponibilidad
 *     responses:
 *       200:
 *         description: Lista de artículos
 */

router.get("/", obtenerArticulos);

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Crear un nuevo artículo de menú
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               disponible:
 *                 type: boolean
 *               restaurante_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artículo creado
 */
router.post("/", crearArticulo);

module.exports = router;
