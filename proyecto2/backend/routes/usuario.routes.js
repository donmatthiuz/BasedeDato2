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
 *     summary: Crear uno o varios usuarios
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
 *                     example: "Cristóbal Trujillo Martínez"
 *                   email:
 *                     type: string
 *                     example: "nazario23@example.net"
 *                   direccion:
 *                     type: string
 *                     example: "Alameda de Aurelia Carbajo 63 Piso 1 \nSegovia, 51167"
 *                   telefono:
 *                     type: string
 *                     example: "+34 982 005 692"
 *                   contra:
 *                     type: string
 *                     example: "*#ZwjYnzr2"
 *                   fecha_registro:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-06-22T21:38:28Z"
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     email:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     contra:
 *                       type: string
 *                       example: "*#ZwjYnzr2"
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Usuario(s) creado(s)
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
 *           example: Cristóbal
 *         description: Nombre parcial del usuario
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           example: nazario23@example.net
 *         description: Email exacto
 *       - in: query
 *         name: telefono
 *         schema:
 *           type: string
 *           example: +34 982 005 692
 *         description: Teléfono exacto
 *       - in: query
 *         name: email_regex
 *         schema:
 *           type: string
 *           example: "tapiaeustaquio"
 *         description: Búsqueda por expresión regular en email
 *       - in: query
 *         name: direccion_regex
 *         schema:
 *           type: string
 *           example: Segovia
 *         description: Búsqueda parcial por dirección
 *       - in: query
 *         name: email_in
 *         schema:
 *           type: string
 *           example: a@a.com,nazario23@example.net
 *         description: Lista de emails separados por coma
 *       - in: query
 *         name: telefono_nin
 *         schema:
 *           type: string
 *           example: +34 123,+34 982 005 692
 *         description: Teléfonos a excluir
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-06-01
 *         description: Fecha de registro desde (ISO 8601)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-06-30
 *         description: Fecha de registro hasta (ISO 8601)
 *       - in: query
 *         name: campos
 *         schema:
 *           type: string
 *           example: nombre,email
 *         description: Campos a proyectar separados por coma
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           example: -fecha_registro
 *         description: Campo por el cual ordenar (usa `-` para descendente)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cuántos resultados omitir
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Máximo de resultados a devolver
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", obtenerUsuarios);

module.exports = router;
