const express = require("express");
const router = express.Router();
const {
  aplicarIndices,
  verIndices,
  eliminarIndices,
} = require("../controllers/index.controller");

/**
 * @swagger
 * /indices:
 *   post:
 *     summary: Aplica índices en las colecciones MongoDB
 *     description: Crea los índices predefinidos en las colecciones de restaurante, menú, usuario, orden y reseña.
 *     tags:
 *       - Indices
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aplicar:
 *                 type: boolean
 *                 example: true
 *                 description: Si es true, se aplican los índices.
 *     responses:
 *       200:
 *         description: Índices aplicados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 detalle:
 *                   type: object
 *       400:
 *         description: Solicitud inválida (por ejemplo, aplicar no es true).
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", aplicarIndices);

/**
 * @swagger
 * /indices:
 *   get:
 *     summary: Lista los índices actuales en todas las colecciones
 *     description: Muestra los índices definidos actualmente en cada colección MongoDB.
 *     tags:
 *       - Indices
 *     responses:
 *       200:
 *         description: Índices listados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 indices:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *       500:
 *         description: Error al obtener los índices.
 */
router.get("/", verIndices);

/**
 * @swagger
 * /indices/eliminar:
 *   post:
 *     summary: Elimina índices de una colección
 *     description: Elimina uno o varios índices de la colección indicada. Si no se especifican índices, elimina todos excepto el índice por defecto (_id).
 *     tags:
 *       - Indices
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coleccion:
 *                 type: string
 *                 example: "menu"
 *               indices:
 *                 type: array
 *                 description: Nombres exactos de los índices a eliminar (opcional)
 *                 items:
 *                   type: string
 *                 example: ["nombre_1", "descripcion_text"]
 *     responses:
 *       200:
 *         description: Índices eliminados exitosamente
 *       400:
 *         description: Datos faltantes o inválidos
 *       500:
 *         description: Error del servidor
 */
router.post("/eliminar", eliminarIndices);

module.exports = router;
