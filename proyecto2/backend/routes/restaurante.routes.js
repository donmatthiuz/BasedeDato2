const express = require("express");
const router = express.Router();
const {
  crearRestaurante,
  obtenerRestaurantes,
  subirArchivoRestaurante,
  actualizarRestaurante,
  eliminarRestaurante,
  totalRestaurantes,
  cantidadPorCategoria,
  categoriasUnicas,
  restaurantesPorZona,
  restaurantesPorPrefijo,
  categoriasTopOBottom,
} = require("../controllers/restaurante.controller");

// --- CRUD RESTAURANTE ---

/**
 * @swagger
 * /restaurante:
 *   post:
 *     summary: Crear uno o varios restaurantes
 *     description: Permite registrar uno o varios restaurantes. Si se envía un solo objeto, se crea un restaurante. Si se envía un arreglo, se insertan múltiples restaurantes.
 *     tags:
 *      - Restaurante
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
 *     description: El archivo debe llamarse `restaurante` y contener uno o varios objetos con los campos requeridos.
 *     tags:
 *       - Restaurante
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
 *     tags:
 *       - Restaurante
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
 *       500:
 *        description: Consulta no válida o sin índice
 */
router.get("/", obtenerRestaurantes);

/**
 * @swagger
 * /restaurante:
 *   patch:
 *     summary: Actualizar uno o varios restaurantes
 *     description: Permite actualizar campos específicos de uno o varios restaurantes mediante su `_id`.
 *     tags:
 *       - Restaurante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [_id]
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "681741a5a913f0b464ef950f"
 *                   nombre:
 *                     type: string
 *                     example: "Nuevo Nombre del Restaurante"
 *                   direccion:
 *                     type: string
 *                     example: "Nueva Dirección 123, Ciudad"
 *                   telefono:
 *                     type: string
 *                     example: "+502 5555 8888"
 *                   categoria:
 *                     type: string
 *                     example: "Comida Fusión"
 *                   coordenadas:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Point"
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [-90.512, 14.624]
 *               - type: array
 *                 items:
 *                   type: object
 *                   required: [_id]
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     categoria:
 *                       type: string
 *                     coordenadas:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                         coordinates:
 *                           type: array
 *                           items:
 *                             type: number
 *     responses:
 *       200:
 *         description: Restaurantes actualizados correctamente
 *       400:
 *         description: Error en los datos proporcionados
 *       404:
 *         description: Uno o más artículos no fueron encontrados
 */
router.patch("/", actualizarRestaurante);

/**
 * @swagger
 * /restaurante:
 *   delete:
 *     summary: Eliminar uno o varios restaurantes
 *     description: Elimina uno o varios documentos de restaurante proporcionando el/los `_id`. Acepta un objeto o un arreglo de objetos con el campo `_id`.
 *     tags:
 *       - Restaurante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - _id
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "663bc7a917bac5271c712ca1"
 *               - type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - _id
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "663bc7a917bac5271c712ca2"
 *     responses:
 *       200:
 *         description: Resultado de la eliminación de uno o varios restaurantes
 *       400:
 *         description: Error en la solicitud o falta de campo _id
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/", eliminarRestaurante);

// --- AGREGACIONES ---

/**
 * @swagger
 * /restaurante/total:
 *   get:
 *     summary: Total de restaurantes registrados
 *     tags:
 *       - Restaurante - Agregaciones
 *     responses:
 *       200:
 *         description: Total de documentos en la colección de restaurantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 87
 *       500:
 *         description: Error interno del servidor
 */
router.get("/total", totalRestaurantes);

/**
 * @swagger
 * /restaurante/categorias/conteo:
 *   get:
 *     summary: Cantidad de restaurantes por categoría
 *     tags:
 *       - Restaurante - Agregaciones
 *     parameters:
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordenar por cantidad de forma ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de categorías con su cantidad correspondiente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoria:
 *                     type: string
 *                     example: Mexicana
 *                   cantidad:
 *                     type: integer
 *                     example: 12
 *       500:
 *         description: Error interno del servidor
 */
router.get("/categorias/conteo", cantidadPorCategoria);

/**
 * @swagger
 * /restaurante/categorias/unicas:
 *   get:
 *     summary: Categorías únicas disponibles
 *     tags:
 *       - Restaurante - Agregaciones
 *     parameters:
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Ordenar alfabéticamente las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías únicas y su total
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 8
 *                 categorias:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Parrillada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/categorias/unicas", categoriasUnicas);

/**
 * @swagger
 * /restaurante/zona:
 *   get:
 *     summary: Clasificación de restaurantes por zona geográfica
 *     description: Agrupa los restaurantes según su ubicación geográfica basada en las coordenadas cardinales (`N`, `S`, `E`, `W`, `NE`, `NW`, `SE`, `SW`). Se puede filtrar por una zona específica con el parámetro `region`, y ordenar por cantidad ascendente o descendente con `ordenar`.
 *     tags:
 *       - Restaurante - Agregaciones
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *           enum: [N, S, E, W, NE, NW, SE, SW]
 *           example: SE
 *         description: Región geográfica específica a consultar.
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *         description: Orden del resultado según la cantidad.
 *     responses:
 *       200:
 *         description: Lista de zonas con la cantidad de restaurantes por cada una.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   zona:
 *                     type: string
 *                     example: SE
 *                   cantidad:
 *                     type: integer
 *                     example: 5
 *       500:
 *         description: Error interno del servidor
 */
router.get("/zona", restaurantesPorZona);

/**
 * @swagger
 * /restaurante/prefijos:
 *   get:
 *     summary: Lista detallada de prefijos con números agrupados
 *     description: Muestra los prefijos con la cantidad de restaurantes y sus números telefónicos asociados. Se puede filtrar por un prefijo específico.
 *     tags:
 *       - Restaurante - Agregaciones
 *     parameters:
 *       - in: query
 *         name: prefijo
 *         schema:
 *           type: string
 *           example: "+502"
 *         description: Prefijo telefónico a filtrar (opcional)
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordenar por cantidad de restaurantes (ascendente o descendente)
 *     responses:
 *       200:
 *         description: Prefijos con detalles de restaurantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   prefijo:
 *                     type: string
 *                     example: "+502"
 *                   cantidad:
 *                     type: integer
 *                     example: 8
 *                   telefonos:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "+502 1234 5678"
 *       500:
 *         description: Error interno del servidor
 */
router.get("/prefijos", restaurantesPorPrefijo);

/**
 * @swagger
 * /restaurante/categorias/top-bottom:
 *   get:
 *     summary: Categorías con más o menos restaurantes
 *     description: Retorna las N categorías con mayor o menor cantidad de restaurantes según el parámetro `tipo`.
 *     tags:
 *       - Restaurante - Agregaciones
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [top, bottom]
 *           default: top
 *         description: Define si se devuelven las más comunes (`top`) o las menos comunes (`bottom`).
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Número máximo de categorías a devolver.
 *     responses:
 *       200:
 *         description: Lista de categorías con sus cantidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoria:
 *                     type: string
 *                     example: Parrillada
 *                   cantidad:
 *                     type: integer
 *                     example: 10
 *       500:
 *         description: Error interno del servidor
 */
router.get("/categorias/top-bottom", categoriasTopOBottom);

module.exports = router;
