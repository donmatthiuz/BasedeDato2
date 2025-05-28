const express = require("express");
const router = express.Router();
const { obtenerCamposDeColeccion } = require("../controllers/utils.controller");

/**
 * @swagger
 * /utils/campos/{coleccion}:
 *   get:
 *     summary: Obtener nombres de campos de una colección
 *     description: Retorna todos los campos encontrados en los documentos de una colección.
 *     tags:
 *       - Utilidades
 *     parameters:
 *       - name: coleccion
 *         in: path
 *         required: true
 *         description: Nombre de la colección de MongoDB
 *         schema:
 *           type: string
 *           example: "usuario"
 *     responses:
 *       200:
 *         description: Lista de campos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coleccion:
 *                   type: string
 *                 campos:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Falta el nombre de la colección
 *       500:
 *         description: Error interno del servidor
 */
router.get("/campos/:coleccion", obtenerCamposDeColeccion);

module.exports = router;
