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
 *     description: Permite registrar uno o varios restaurantes. Si se envía un solo objeto, se crea un restaurante. Si se envía un arreglo, se insertan múltiples restaurantes.
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
 *                     example: "La Carnicería"
 *                   direccion:
 *                     type: string
 *                     example: "Plaza Olegario Dueñas 1 Apt. 84 \nLa Coruña, 04962"
 *                   telefono:
 *                     type: string
 *                     example: "+34 928 766 724"
 *                   categoria:
 *                     type: string
 *                     example: "Parrillada"
 *                   coordenadas:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: Point
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [-90.51234, 14.62345]
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: "La Carnicería"
 *                     direccion:
 *                       type: string
 *                       example: "Plaza Olegario Dueñas 1 Apt. 84 \nLa Coruña, 04962"
 *                     telefono:
 *                       type: string
 *                       example: "+34 928 766 724"
 *                     categoria:
 *                       type: string
 *                       example: "Parrillada"
 *                     coordenadas:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: Point
 *                         coordinates:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [-90.51234, 14.62345]
 *     responses:
 *       201:
 *         description: Restaurante(s) creado(s)
 *       400:
 *         description: Error al crear restaurante(s)
 */
router.post("/", crearRestaurante);

/**
 * @swagger
 * /restaurante/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar uno o varios restaurantes
 *     description: El archivo debe llamarse `restaurante` y contener uno o varios objetos con los campos requeridos. Si se omite algún campo no obligatorio, será ignorado.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               restaurante:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con uno o varios restaurantes
 *     responses:
 *       201:
 *         description: Restaurantes insertados desde archivo
 *       400:
 *         description: Error al procesar el archivo
 *     examples:
 *       application/json:
 *         value:
 *           [
 *             {
 *               "nombre": "El Fogón de Paco",
 *               "direccion": "Calle Real 45\nGranada, 18001",
 *               "telefono": "+34 922 444 111",
 *               "categoria": "Tapas",
 *               "coordenadas": {
 *                 "type": "Point",
 *                 "coordinates": [-90.5, 14.6]
 *               }
 *             },
 *             {
 *               "nombre": "La Marisquería",
 *               "direccion": "Paseo del Puerto 23\nValencia, 46002",
 *               "telefono": "+34 933 222 333",
 *               "categoria": "Mariscos",
 *               "coordenadas": {
 *                 "type": "Point",
 *                 "coordinates": [-90.51, 14.62]
 *               }
 *             }
 *           ]
 */
router.post("/upload", subirArchivoRestaurante);

/**
 * @swagger
 * /restaurante:
 *   get:
 *     summary: Obtener restaurantes con filtros avanzados
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *           example: Carnicería
 *         description: Nombre parcial del restaurante (regex insensible a mayúsculas)
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           example: Parrillada
 *         description: Categoría exacta del restaurante
 *       - in: query
 *         name: categoria_in
 *         schema:
 *           type: string
 *           example: Parrillada,Italiana
 *         description: Lista de categorías permitidas (separadas por coma)
 *       - in: query
 *         name: categoria_nin
 *         schema:
 *           type: string
 *           example: Rápida,Mexicana
 *         description: Lista de categorías a excluir
 *       - in: query
 *         name: direccion_regex
 *         schema:
 *           type: string
 *           example: La Coruña
 *         description: Texto parcial de dirección (regex insensible a mayúsculas)
 *       - in: query
 *         name: telefono
 *         schema:
 *           type: string
 *           example: +34 928 766 724
 *         description: Número de teléfono exacto
 *       - in: query
 *         name: exists
 *         schema:
 *           type: string
 *           example: telefono,-coordenadas
 *         description: Verifica existencia o ausencia de campos. Usa `-` para negar.
 *       - in: query
 *         name: coordenadas
 *         schema:
 *           type: string
 *           example: -90.5,14.6
 *         description: Coordenadas exactas para coincidencia [longitud,latitud]
 *       - in: query
 *         name: cerca_de
 *         schema:
 *           type: string
 *           example: -90.5,14.6
 *         description: Coordenadas de ubicación [longitud,latitud] para encontrar restaurantes cercanos
 *       - in: query
 *         name: radio_metros
 *         schema:
 *           type: number
 *           example: 5000
 *         description: Distancia máxima en metros para buscar restaurantes cercanos (requiere `cerca_de`)
 *       - in: query
 *         name: campos
 *         schema:
 *           type: string
 *           example: nombre,categoria,direccion
 *         description: Campos a incluir en la respuesta (separados por coma)
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           example: -nombre
 *         description: Campo por el cual ordenar (usa `-` para ascendente)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Número de resultados a omitir
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Número máximo de resultados a devolver
 *     responses:
 *       200:
 *         description: Lista de restaurantes filtrados
 *       400:
 *        description: Consulta no válida o sin índice
 */
router.get("/", obtenerRestaurantes);

module.exports = router;
