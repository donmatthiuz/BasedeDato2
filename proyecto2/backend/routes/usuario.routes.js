const express = require("express");
const router = express.Router();
const {
  crearUsuario,
  obtenerUsuarios,
  subirArchivoUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usuario.controller");

// --- CRUD ---

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Crear uno o varios usuarios
 *     description: Permite registrar uno o más usuarios. Si no se proporciona `fecha_registro`, se asignará automáticamente la fecha actual.
 *     tags:
 *      - Usuario
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
 *                   tipo:
 *                     type: string
 *                     example: "cliente"
 *                   coordenadas:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [Point]
 *                         example: "Point"
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         example: [-90.5069, 14.6349]
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
 *                       example: "Luisa Romero García"
 *                     email:
 *                       type: string
 *                       example: "luisa.romero@example.com"
 *                     direccion:
 *                       type: string
 *                       example: "Calle Principal 123\nMadrid, 28001"
 *                     telefono:
 *                       type: string
 *                       example: "+34 911 223 334"
 *                     contra:
 *                       type: string
 *                       example: "P@ssword2024"
 *                     tipo:
 *                       type: string
 *                       example: "admin"
 *                     coordenadas:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           enum: [Point]
 *                           example: "Point"
 *                         coordinates:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [-90.5055, 14.6355]
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-10T09:00:00.000Z"
 *     responses:
 *       201:
 *         description: Usuario(s) creado(s)
 *       400:
 *         description: Error al crear usuario(s)
 */
router.post("/", crearUsuario);

/**
 * @swagger
 * /usuarios/upload:
 *   post:
 *     summary: Subir archivo JSON para insertar uno o varios usuarios
 *     description: El archivo debe llamarse `usuario` y contener uno o varios objetos con los campos requeridos. Si no se incluye `fecha_registro`, se asignará la fecha actual automáticamente.
 *     tags:
 *      - Usuario
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con uno o varios usuarios
 *     responses:
 *       201:
 *         description: Usuarios insertados desde archivo
 *       400:
 *         description: Error al procesar el archivo
 *     examples:
 *       application/json:
 *         value:
 *           [
 *             {
 *               "nombre": "Fernando López Ruiz",
 *               "email": "fernando.lopez@example.net",
 *               "direccion": "Av. de la Constitución 56\nBarcelona, 08001",
 *               "telefono": "+34 933 445 556",
 *               "contra": "1234Abc#",
 *               "tipo": "cliente",
 *               "coordenadas": {
 *                 "type": "Point",
 *                 "coordinates": [-90.51, 14.62]
 *               },
 *               "fecha_registro": { "$date": "2024-06-20T15:30:00.000Z" }
 *             },
 *             {
 *               "nombre": "Carmen Pérez Molina",
 *               "email": "carmen.molina@example.org",
 *               "direccion": "Plaza Mayor 7\nSevilla, 41001",
 *               "telefono": "+34 955 667 778",
 *               "contra": "Molina2024!",
 *               "tipo": "admin",
 *               "coordenadas": {
 *                 "type": "Point",
 *                 "coordinates": [-90.52, 14.63]
 *               },
 *               "fecha_registro": { "$date": "2024-06-25T22:45:00.000Z" }
 *             }
 *           ]
 */
router.post("/upload", subirArchivoUsuario);

/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Usuario
 *     parameters:
 *       - in: query
 *         name: _id
 *         schema:
 *           type: string
 *           example: 66551509f5275a9d88c17258
 *         description: ID exacto del usuario (Mongo ObjectId)
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *           example: Cristóbal
 *         description: Nombre parcial del usuario (regex insensible a mayúsculas)
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
 *         name: tipo
 *         schema:
 *           type: string
 *           example: cliente
 *         description: Tipo de usuario
 *       - in: query
 *         name: email_regex
 *         schema:
 *           type: string
 *           example: "tapiaeustaquio"
 *         description: Búsqueda por expresión regular en email (regex insensible a mayúsculas)
 *       - in: query
 *         name: direccion_regex
 *         schema:
 *           type: string
 *           example: Segovia
 *         description: Búsqueda parcial por dirección (regex insensible a mayúsculas)
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
 *         name: exists
 *         schema:
 *           type: string
 *           example: direccion,-telefono
 *         description: Verifica existencia o ausencia de campos. Usa `-` para negar.
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
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Consulta no válida o error del servidor
 */
router.get("/", obtenerUsuarios);

/**
 * @swagger
 * /usuario:
 *   patch:
 *     summary: Actualizar uno o varios usuarios
 *     description: Actualiza uno o varios usuarios existentes. Se debe incluir el campo `_id` en cada objeto a modificar. Solo se actualizan los campos enviados.
 *     tags:
 *      - Usuario
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
 *                     example: "68174f099a2bb59ba7bb111c"
 *                   nombre:
 *                     type: string
 *                     example: "Luis Pérez"
 *                   telefono:
 *                     type: string
 *                     example: "+502 4444 9999"
 *               - type: array
 *                 items:
 *                   type: object
 *                   required: [_id]
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68174f099a2bb59ba7bb111d"
 *                     nombre:
 *                       type: string
 *                       example: "María Gómez"
 *                     tipo:
 *                       type: string
 *                       example: "repartidor"
 *     responses:
 *       200:
 *         description: Usuario(s) actualizado(s)
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Uno o más usuarios no fueron encontrados
 */
router.patch("/", actualizarUsuario);

/**
 * @swagger
 * /usuario:
 *   delete:
 *     summary: Eliminar uno o varios usuarios por _id
 *     description: Elimina uno o varios usuarios proporcionando su campo `_id`. Devuelve el estado de eliminación de cada uno.
 *     tags:
 *      - Usuario
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
 *                     example: "6634abef1b8a1e23f3c45678"
 *               - type: array
 *                 items:
 *                   type: object
 *                   required: [_id]
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6634abef1b8a1e23f3c45678"
 *     responses:
 *       200:
 *         description: Usuario(s) eliminado(s) con éxito
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "eliminado"
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       status:
 *                         type: string
 *                         example: "eliminado"
 *                       error:
 *                         type: string
 *       400:
 *         description: Error al procesar la solicitud
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/", eliminarUsuario);

module.exports = router;
