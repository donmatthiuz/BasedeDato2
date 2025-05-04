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
 *     summary: Crear uno o varios artículos de menú
 *     description: Permite registrar uno o varios artículos del menú. Cada artículo debe contener nombre, precio y restaurante asociado. El campo `disponible` es opcional (por defecto es `true`).
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
 *                     example: "Ensalada César"
 *                   descripcion:
 *                     type: string
 *                     example: "Ensalada con lechuga romana, pollo y aderezo césar"
 *                   precio:
 *                     type: number
 *                     example: 45.5
 *                   disponible:
 *                     type: boolean
 *                     example: true
 *                   restaurante_id:
 *                     type: string
 *                     example: "c3f3bb5f-93a2-4bc8-b15f-085b684e6f62"
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: "Hamburguesa BBQ"
 *                     descripcion:
 *                       type: string
 *                       example: "Hamburguesa con salsa BBQ, queso cheddar y tocino"
 *                     precio:
 *                       type: number
 *                       example: 58.9
 *                     disponible:
 *                       type: boolean
 *                       example: false
 *                     restaurante_id:
 *                       type: string
 *                       example: "c3f3bb5f-93a2-4bc8-b15f-085b684e6f62"
 *     responses:
 *       201:
 *         description: Artículo(s) creado(s)
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", crearArticulo);

/**
 * @swagger
 * /menu/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar artículos del menú
 *     description: Permite cargar un archivo `.json` que contenga uno o varios artículos del menú. El campo del formulario debe llamarse `menu`. El campo `disponible` es opcional (por defecto es `true`).
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
 *                 description: Archivo JSON con uno o varios artículos
 *     responses:
 *       201:
 *         description: Artículos insertados desde archivo
 *       400:
 *         description: Error al procesar el archivo
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
 *         description: Búsqueda parcial por nombre del platillo (regex insensible a mayúsculas)
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
 *         name: exists
 *         schema:
 *           type: string
 *           example: descripcion,-disponible
 *         description: Verifica existencia o ausencia de campos. Usa `-` para negar.
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
 *         description: Ordenar por campo. Usa `-` para ascendente (ej. -precio)
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
 *       400:
 *         description: Consulta no válida o sin índice
 */
router.get("/", obtenerArticulos);

module.exports = router;
