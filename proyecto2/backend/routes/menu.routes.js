const express = require("express");
const router = express.Router();
const {
  crearArticulo,
  obtenerArticulos,
  subirArchivoMenu,
} = require("../controllers/menu.controller");

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

/**
 * @swagger
 * /menu/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar artículos del menú
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
 *     responses:
 *       201:
 *         description: Artículos insertados desde archivo
 */
router.post("/upload", subirArchivoMenu);

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

module.exports = router;
