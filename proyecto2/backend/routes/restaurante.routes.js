const express = require("express");
const router = express.Router();
const {
  crearRestaurante,
  obtenerRestaurantes,
  subirArchivoRestaurante,
} = require("../controllers/restaurante.controller");

/**
 * @swagger
 * /restaurante:
 *   post:
 *     summary: Crear uno o varios restaurantes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                   direccion:
 *                     type: string
 *                   telefono:
 *                     type: string
 *                   categoria:
 *                     type: string
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     categoria:
 *                       type: string
 *     responses:
 *       201:
 *         description: Restaurante(s) creado(s)
 */
router.post("/", crearRestaurante);

/**
 * @swagger
 * /restaurante/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar uno o varios restaurantes
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               restaurante:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Documentos insertados desde archivo
 */
router.post("/upload", subirArchivoRestaurante);

/**
 * @swagger
 * /restaurante:
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
