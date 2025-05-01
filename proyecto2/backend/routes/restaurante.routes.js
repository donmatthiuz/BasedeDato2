const express = require("express");
const router = express.Router();
const {
  crearRestaurante,
  obtenerRestaurantes,
} = require("../controllers/restaurante.controller");

/**
 * @swagger
 * /restaurantes:
 *   post:
 *     summary: Crear un nuevo restaurante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurante creado
 */
router.post("/", crearRestaurante);

/**
 * @swagger
 * /restaurantes:
 *   get:
 *     summary: Obtener todos los restaurantes
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre parcial del restaurante
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
router.get("/", obtenerRestaurantes);

module.exports = router;
