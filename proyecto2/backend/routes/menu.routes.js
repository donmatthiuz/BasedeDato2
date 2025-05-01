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
 *     summary: Obtener artículos del menú con filtros avanzados
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
 *         description: Búsqueda parcial por nombre del platillo (insensible a mayúsculas)
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
 *         description: Ordenar por campo. Usa `-` para ascendente (ej. precio)
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
 */
router.get("/", obtenerArticulos);

module.exports = router;
