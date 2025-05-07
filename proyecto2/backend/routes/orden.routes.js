const express = require("express");
const router = express.Router();
const {
  crearOrden,
  obtenerOrdenes,
  subirArchivoOrden,
  actualizarOrden,
  eliminarOrden,
  totalOrdenesPorRestaurante,
  ingresosTotalesPorRestaurante,
  topOBottomPlatillosVendidos,
  ingresosPorPlatillo,
  gananciasPorPeriodo,
  gananciasPorBloques,
  gananciasPorRango,
  estadisticasPorEstado,
} = require("../controllers/orden.controller");

// --- CRUD ---

/**
 * @swagger
 * /orden:
 *   post:
 *     summary: Crear una o varias órdenes
 *     description: Permite crear una o varias órdenes. El campo `total` se calcula automáticamente. El campo `fecha` es opcional; si no se incluye, se asigna la fecha actual.
 *     tags:
 *      - Orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   usuario_id:
 *                     type: string
 *                     format: uuid
 *                     example: "3ec19822-f7b4-4d52-b0b0-f541d96551f1"
 *                   restaurante_id:
 *                     type: string
 *                     format: uuid
 *                     example: "84862c31-461c-4706-b43d-d60487400588"
 *                   estado:
 *                     type: string
 *                     example: "pendiente"
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-07-01T12:00:00Z"
 *                   platillos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           example: "Pizza Margarita"
 *                         descripcion:
 *                           type: string
 *                           example: "Pizza con salsa de tomate y queso mozzarella"
 *                         precio:
 *                           type: number
 *                           example: 89.5
 *                         cantidad:
 *                           type: number
 *                           example: 2
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     usuario_id:
 *                       type: string
 *                     restaurante_id:
 *                       type: string
 *                     estado:
 *                       type: string
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                     platillos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nombre:
 *                             type: string
 *                           descripcion:
 *                             type: string
 *                           precio:
 *                             type: number
 *                           cantidad:
 *                             type: number
 *     responses:
 *       201:
 *         description: Orden(es) creada(s)
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", crearOrden);

/**
 * @swagger
 * /ordenes/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar una o varias órdenes
 *     description: El archivo debe llamarse `orden` y contener uno o varios objetos de orden. El campo `total` se calcula automáticamente. El campo `fecha` es opcional.
 *     tags:
 *      - Orden
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               orden:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con una o varias órdenes
 *     responses:
 *       201:
 *         description: Órdenes insertadas desde archivo
 *       400:
 *         description: Error al procesar el archivo
 *     examples:
 *       application/json:
 *         value:
 *           [
 *             {
 *               "usuario_id": "3ec19822-f7b4-4d52-b0b0-f541d96551f1",
 *               "restaurante_id": "84862c31-461c-4706-b43d-d60487400588",
 *               "fecha": { "$date": "2024-06-26T22:34:51Z" },
 *               "estado": "pendiente",
 *               "platillos": [
 *                 {
 *                   "nombre": "Taco al Pastor",
 *                   "descripcion": "Taco con carne de cerdo marinada y piña",
 *                   "precio": 25.5,
 *                   "cantidad": 3
 *                 }
 *               ]
 *             }
 *           ]
 */
router.post("/upload", subirArchivoOrden);

/**
 * @swagger
 * /orden:
 *   get:
 *     summary: Obtener órdenes con filtros avanzados
 *     tags:
 *      - Orden
 *     parameters:
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: string
 *           example: 3ec19822-f7b4-4d52-b0b0-f541d96551f1
 *         description: ID del usuario que realizó la orden
 *       - in: query
 *         name: restaurante_id
 *         schema:
 *           type: string
 *           example: 84862c31-461c-4706-b43d-d60487400588
 *         description: ID del restaurante asociado a la orden
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           example: cancelada
 *         description: Estado exacto de la orden
 *       - in: query
 *         name: estado_in
 *         schema:
 *           type: string
 *           example: cancelada,completada
 *         description: Lista de estados permitidos (separados por coma)
 *       - in: query
 *         name: estado_nin
 *         schema:
 *           type: string
 *           example: pendiente
 *         description: Lista de estados a excluir
 *       - in: query
 *         name: total_gt
 *         schema:
 *           type: number
 *           example: 500
 *         description: Total mayor que
 *       - in: query
 *         name: total_gte
 *         schema:
 *           type: number
 *           example: 600
 *         description: Total mayor o igual que
 *       - in: query
 *         name: total_lt
 *         schema:
 *           type: number
 *           example: 700
 *         description: Total menor que
 *       - in: query
 *         name: total_lte
 *         schema:
 *           type: number
 *           example: 600
 *         description: Total menor o igual que
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2024-06-01T00:00:00Z
 *         description: Fecha inicial (ISO 8601)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2024-07-01T00:00:00Z
 *         description: Fecha final (ISO 8601)
 *       - in: query
 *         name: exists
 *         schema:
 *           type: string
 *           example: estado,-platillos
 *         description: Verifica existencia o ausencia de campos. Usa `-` para negar.
 *       - in: query
 *         name: campos
 *         schema:
 *           type: string
 *           example: estado,total
 *         description: Campos a incluir en la respuesta (separados por coma)
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           example: -fecha
 *         description: Campo por el cual ordenar (usa `-` para descendente)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Cantidad de documentos a omitir
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad máxima de resultados a retornar
 *     responses:
 *       200:
 *         description: Lista de órdenes filtradas
 *       500:
 *         description: Consulta no válida o sin índice
 */
router.get("/", obtenerOrdenes);

/**
 * @swagger
 * /orden:
 *   patch:
 *     summary: Actualizar una o varias órdenes existentes
 *     description: Permite actualizar una o varias órdenes. El campo `total` no puede modificarse directamente; se recalcula automáticamente si se actualizan los platillos.
 *     tags:
 *      - Orden
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
 *                     example: "6817b9b2e33af63113f5a098"
 *                   estado:
 *                     type: string
 *                     example: completada
 *                   platillos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           example: "Nuevo platillo"
 *                         descripcion:
 *                           type: string
 *                           example: "Descripción actualizada"
 *                         precio:
 *                           type: number
 *                           example: 50
 *                         cantidad:
 *                           type: integer
 *                           example: 1
 *               - type: array
 *                 items:
 *                   type: object
 *                   required: [_id]
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6817b9b2e33af63113f5a099"
 *                     estado:
 *                       type: string
 *                       example: cancelada
 *     responses:
 *       200:
 *         description: Orden(es) actualizada(s) exitosamente
 *       400:
 *         description: Error en la actualización (formato inválido, falta _id, intento de modificar `total`, etc.)
 *       404:
 *         description: Una o más órdenes no fueron encontradas
 */
router.patch("/", actualizarOrden);

/**
 * @swagger
 * /orden:
 *   delete:
 *     summary: Eliminar una o varias órdenes
 *     description: Elimina una o varias órdenes enviando uno o más objetos con el campo `_id`.
 *                  Si se envía un solo objeto, se elimina una orden. Si se envía un arreglo, se eliminan múltiples órdenes.
 *     tags:
 *      - Orden
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
 *                     example: "6817b9b2e33af63113f5a098"
 *               - type: array
 *                 items:
 *                   type: object
 *                   required: [_id]
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6817b9b2e33af63113f5a099"
 *     responses:
 *       200:
 *         description: Resultado de la eliminación
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     eliminado:
 *                       type: boolean
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       eliminado:
 *                         type: boolean
 *                       error:
 *                         type: string
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Orden no encontrada
 */
router.delete("/", eliminarOrden);

// --- AGREGACIONES ---

/**
 * @swagger
 * /orden/total-por-restaurante:
 *   get:
 *     summary: Conteo total de órdenes por restaurante
 *     tags:
 *       - Orden - Agregaciones
 *     description: Devuelve la cantidad total de órdenes realizadas por cada restaurante.
 *     responses:
 *       200:
 *         description: Lista con conteo de órdenes por restaurante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurante_id:
 *                     type: string
 *                   nombre_restaurante:
 *                     type: string
 *                   total_ordenes:
 *                     type: integer
 *       500:
 *         description: Error interno del servidor
 */
router.get("/total-por-restaurante", totalOrdenesPorRestaurante);

/**
 * @swagger
 * /orden/ingresos-por-restaurante:
 *   get:
 *     summary: Suma total de ingresos por restaurante
 *     tags:
 *       - Orden - Agregaciones
 *     description: Devuelve la suma total del campo `total` de todas las órdenes agrupadas por restaurante.
 *     responses:
 *       200:
 *         description: Lista de ingresos generados por restaurante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurante_id:
 *                     type: string
 *                   nombre_restaurante:
 *                     type: string
 *                   ingresos_totales:
 *                     type: number
 *       500:
 *         description: Error interno del servidor
 */
router.get("/ingresos-por-restaurante", ingresosTotalesPorRestaurante);

/**
 * @swagger
 * /orden/platillos/top-bottom:
 *   get:
 *     summary: Platillos más o menos vendidos
 *     description: Devuelve los N platillos más o menos vendidos por cantidad total solicitada.
 *     tags:
 *       - Orden - Agregaciones
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [top, bottom]
 *           default: top
 *         description: Define si se devuelven los más vendidos (top) o los menos vendidos (bottom).
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Número máximo de platillos a devolver.
 *     responses:
 *       200:
 *         description: Lista de platillos con su cantidad total vendida.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre_platillo:
 *                     type: string
 *                     example: "Tacos al pastor"
 *                   total_vendido:
 *                     type: integer
 *                     example: 75
 *       500:
 *         description: Error interno del servidor
 */
router.get("/platillos/top-bottom", topOBottomPlatillosVendidos);

/**
 * @swagger
 * /orden/platillos/ingresos:
 *   get:
 *     summary: Ingresos por platillo
 *     description: Calcula el ingreso total generado por cada platillo (precio x cantidad). Se puede ordenar ascendentemente o descendentemente.
 *     tags:
 *       - Orden - Agregaciones
 *     parameters:
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordenar por ingresos generados (ascendente o descendente).
 *     responses:
 *       200:
 *         description: Lista de platillos con su ingreso total.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre_platillo:
 *                     type: string
 *                     example: "Hamburguesa"
 *                   ingresos:
 *                     type: number
 *                     example: 1250.75
 *       500:
 *         description: Error interno del servidor
 */
router.get("/platillos/ingresos", ingresosPorPlatillo);

/**
 * @swagger
 * /orden/ganancias:
 *   get:
 *     summary: Ganancias por periodo (mensual o anual)
 *     description: Retorna las ganancias totales y promedio por mes o año, agrupadas por restaurante. Solo se consideran órdenes con estado "completada".
 *     tags:
 *       - Orden - Agregaciones
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [mensual, anual]
 *           default: mensual
 *         description: Tipo de agrupación (mensual o anual)
 *       - in: query
 *         name: anio
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: Año específico a filtrar
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         description: Mes específico (solo si tipo es mensual)
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           enum: [monto_total, promedio_ganancia, anio, mes]
 *           default: monto_total
 *         description: Campo por el cual ordenar los resultados
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Dirección de ordenamiento
 *     responses:
 *       200:
 *         description: Lista de ganancias por periodo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre_restaurante:
 *                     type: string
 *                     example: Taquería El Mexicano
 *                   monto_total:
 *                     type: number
 *                     example: 12500
 *                   promedio_ganancia:
 *                     type: number
 *                     example: 520.5
 *                   anio:
 *                     type: integer
 *                     example: 2025
 *                   mes:
 *                     type: integer
 *                     example: 3
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/ganancias", gananciasPorPeriodo);

/**
 * @swagger
 * /orden/ganancias/bloques:
 *   get:
 *     summary: Ganancias agrupadas por bloques de meses
 *     description: Retorna las ganancias totales y promedio agrupadas por bloques de meses (ej. mensual, bimestral, trimestral, etc.) por restaurante. Solo se consideran órdenes con estado "completada".
 *     tags:
 *       - Orden - Agregaciones
 *     parameters:
 *       - in: query
 *         name: meses
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4, 6, 12]
 *           default: 1
 *         description: Tamaño del bloque en meses para la agrupación
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           enum: [monto_total, promedio_ganancia, bloque, anio]
 *           default: monto_total
 *         description: Campo por el cual ordenar los resultados
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista de ganancias por bloques de meses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre_restaurante:
 *                     type: string
 *                     example: Taquería El Mexicano
 *                   monto_total:
 *                     type: number
 *                     example: 12500
 *                   promedio_ganancia:
 *                     type: number
 *                     example: 520.5
 *                   anio:
 *                     type: integer
 *                     example: 2025
 *                   bloque:
 *                     type: integer
 *                     example: 1
 *                   meses_incluidos:
 *                     type: array
 *                     items:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/ganancias/bloques", gananciasPorBloques);

/**
 * @swagger
 * /orden/ganancias/rango:
 *   get:
 *     summary: Ganancias por rango de fechas
 *     description: Retorna las ganancias totales y promedio de cada restaurante dentro del rango de fechas especificado. Solo se consideran órdenes con estado "completada".
 *     tags:
 *       - Orden - Agregaciones
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *         description: Fecha inicial del rango (inclusive)
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-12-31
 *         description: Fecha final del rango (inclusive)
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           enum: [monto_total, promedio_ganancia]
 *           default: monto_total
 *         description: Campo por el cual ordenar los resultados
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista de ganancias por restaurante en el rango especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre_restaurante:
 *                     type: string
 *                   monto_total:
 *                     type: number
 *                   promedio_ganancia:
 *                     type: number
 *       500:
 *         description: Error interno del servidor
 */
router.get("/ganancias/rango", gananciasPorRango);

/**
 * @swagger
 * /orden/estadisticas/estado:
 *   get:
 *     summary: Estadísticas de órdenes por estado por restaurante
 *     description: Retorna el porcentaje y el conteo de órdenes de un estado específico agrupadas por restaurante. Permite ordenar por porcentaje o cantidad.
 *     tags:
 *       - Orden - Agregaciones
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           example: cancelada
 *         description: Estado de las órdenes a evaluar (ej. completada, cancelada, pendiente)
 *       - in: query
 *         name: ordenar_por
 *         schema:
 *           type: string
 *           enum: [porcentaje_estado, total_ordenes]
 *           default: porcentaje_estado
 *         description: Campo por el cual ordenar los resultados
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Dirección del ordenamiento
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de restaurantes a retornar
 *     responses:
 *       200:
 *         description: Lista de restaurantes con estadísticas del estado indicado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre_restaurante:
 *                     type: string
 *                     example: Taquería La Esquina
 *                   total_ordenes:
 *                     type: integer
 *                     example: 120
 *                   porcentaje_estado:
 *                     type: number
 *                     example: 27.5
 *                   estado:
 *                     type: string
 *                     example: cancelada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/estadisticas/estado", estadisticasPorEstado);

module.exports = router;
