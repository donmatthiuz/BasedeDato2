const express = require("express");
const router = express.Router();
const {
  crearUsuario,
  obtenerUsuarios,
  subirArchivoUsuario,
} = require("../controllers/usuario.controller");

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               frecuencia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post("/", crearUsuario);

/**
 * @swagger
 * /usuarios/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar uno o varios usuarios
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usuarios insertados desde archivo
 */
router.post("/upload", subirArchivoUsuario);

/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Obtener todos los usuarios
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre parcial del usuario
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", obtenerUsuarios);

module.exports = router;
