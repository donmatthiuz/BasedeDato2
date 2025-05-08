const Menu = require("../models/Menu");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Middleware para archivo
const upload = multer({ dest: "uploads/" }); // crea carpeta si no existe
const uploadImagen = multer({ dest: "uploads/" });

// --- IMAGEN ---
exports.subirImagenAMenu = [
  uploadImagen.single("imagen"),
  async (req, res) => {
    try {
      const menuId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ error: "No se envió una imagen válida" });
      }

      const conn = mongoose.connection;
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "imagenesMenu",
      });

      const imagenPath = path.join(__dirname, "..", req.file.path);
      const uploadStream = bucket.openUploadStream(req.file.originalname);
      const fileReadStream = fs.createReadStream(imagenPath);

      fileReadStream
        .pipe(uploadStream)
        .on("error", (err) => {
          return res.status(500).json({
            error: "Error al guardar en GridFS",
            detalle: err.message,
          });
        })
        .on("finish", async () => {
          const imagenId = uploadStream.id;

          const actualizado = await Menu.findByIdAndUpdate(
            menuId,
            { imagen_id: imagenId },
            { new: true }
          );

          try {
            fs.unlinkSync(imagenPath);
          } catch (e) {
            console.warn("No se pudo eliminar archivo temporal:", imagenPath);
          }

          if (!actualizado) {
            return res.status(404).json({ error: "Menú no encontrado" });
          }

          res.status(200).json(actualizado);
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al subir imagen", detalle: error.message });
    }
  },
];

exports.obtenerImagenDeMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu || !menu.imagen_id) {
      return res.status(404).json({ error: "Menú sin imagen" });
    }

    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "imagenesMenu",
    });

    const stream = bucket.openDownloadStream(menu.imagen_id);

    res.set({
      "Content-Type": "image/jpeg",
      "Content-Disposition": "inline", // usa "attachment" si quieres forzar descarga
    });

    stream.on("error", () => {
      res.status(404).json({ error: "Imagen no encontrada" });
    });

    stream.pipe(res);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener imagen desde menú",
      detalle: error.message,
    });
  }
};

exports.actualizarImagenDeMenu = [
  uploadImagen.single("imagen"),
  async (req, res) => {
    try {
      const menuId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ error: "No se envió una imagen válida" });
      }

      const conn = mongoose.connection;
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "imagenesMenu",
      });

      const imagenPath = req.file.path;
      const uploadStream = bucket.openUploadStream(req.file.originalname);
      const fileReadStream = fs.createReadStream(imagenPath);

      fileReadStream
        .pipe(uploadStream)
        .on("error", (err) => {
          return res.status(500).json({
            error: "Error al guardar nueva imagen",
            detalle: err.message,
          });
        })
        .on("finish", async () => {
          const nuevaImagenId = uploadStream.id;

          // Buscar menú actual
          const menu = await Menu.findById(menuId);
          if (!menu) {
            fs.unlinkSync(imagenPath);
            return res.status(404).json({ error: "Menú no encontrado" });
          }

          // Eliminar imagen anterior si existe
          if (menu.imagen_id) {
            try {
              await bucket.delete(menu.imagen_id);
            } catch (e) {
              console.warn("No se pudo eliminar imagen anterior:", e.message);
            }
          }

          // Guardar nueva imagen
          menu.imagen_id = nuevaImagenId;
          await menu.save();

          fs.unlinkSync(imagenPath); // limpia archivo temporal
          res.status(200).json(menu);
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al actualizar imagen", detalle: error.message });
    }
  },
];

// --- CRUD ---
exports.subirArchivoMenu = [
  upload.single("menu"), // nombre del campo esperado: "menu"
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const insertData = Array.isArray(data) ? data : [data];
      const insertados = await Menu.insertMany(insertData, { ordered: false });

      fs.unlinkSync(path);
      res.status(201).json({ insertados });
    } catch (error) {
      res.status(400).json({
        error: "Error al procesar el archivo",
        detalle: error.message,
      });
    }
  },
];

exports.crearArticulo = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      const articulo = new Menu(data);
      await articulo.save();
      return res.status(201).json(articulo);
    }

    const articulos = await Menu.insertMany(data, { ordered: false });
    res.status(201).json(articulos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerArticulos = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtros flexibles ---
    if (query._id) {
      if (!mongoose.Types.ObjectId.isValid(query._id)) {
        return res
          .status(400)
          .json({ error: "El _id proporcionado no es válido" });
      }
      filtro._id = new mongoose.Types.ObjectId(query._id);
    }

    if (query.restaurante_id) {
      filtro.restaurante_id = query.restaurante_id;
    }

    if (query.disponible) {
      filtro.disponible = query.disponible === "true";
    }

    if (query.nombre) {
      filtro.nombre = { $regex: query.nombre, $options: "i" };
    }

    if (
      query.precio_gt ||
      query.precio_lt ||
      query.precio_min ||
      query.precio_max
    ) {
      filtro.precio = {};
      if (query.precio_gt) filtro.precio.$gt = parseFloat(query.precio_gt);
      if (query.precio_lt) filtro.precio.$lt = parseFloat(query.precio_lt);
      if (query.precio_min) filtro.precio.$gte = parseFloat(query.precio_min);
      if (query.precio_max) filtro.precio.$lte = parseFloat(query.precio_max);
    }

    // --- Filtros por existencia de campos ---
    if (query.exists) {
      query.exists.split(",").forEach((campo) => {
        const existe = !campo.startsWith("-");
        const campoLimpio = campo.replace(/^-/, "").trim();
        filtro[campoLimpio] = { $exists: existe };
      });
    }

    // --- Proyección ---
    const proyeccion = {};
    if (query.campos) {
      const campos = query.campos.split(",").map((c) => c.trim());
      campos.forEach((campo) => {
        proyeccion[campo] = 1;
      });

      if (!campos.includes("_id")) {
        proyeccion["_id"] = 0; // excluye _id si no fue solicitado
      }
    }

    // --- Ordenamiento ---
    const sort = {};
    if (query.ordenar_por) {
      // Ej: ?ordenar_por=precio o ?ordenar_por=-precio
      const campo = query.ordenar_por;
      sort[campo.replace("-", "")] = campo.startsWith("-") ? 1 : -1;
    }

    // --- Paginación ---
    const skip = parseInt(query.skip) || 0;
    const limit = parseInt(query.limit) || 20;

    // --- Consulta ---
    const articulos = await Menu.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ restaurante_id: 1, disponible: 1 })
      .lean();

    res.json(articulos);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};

exports.actualizarArticulo = async (req, res) => {
  try {
    const data = req.body;

    // --- Actualización única ---
    if (!Array.isArray(data)) {
      const { _id, ...update } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const actualizado = await Menu.findByIdAndUpdate(_id, update, {
        new: true,
        runValidators: true,
      });

      if (!actualizado)
        return res.status(404).json({ error: "Artículo no encontrado", _id });

      return res.status(200).json(actualizado);
    }

    // --- Actualización múltiple ---
    const resultados = await Promise.all(
      data.map(async (item) => {
        const { _id, ...update } = item;
        if (!_id) return { error: "Falta _id" };

        try {
          const actualizado = await Menu.findByIdAndUpdate(_id, update, {
            new: true,
            runValidators: true,
          });

          return actualizado || { _id, error: "No encontrado" };
        } catch (e) {
          return { _id, error: "Error al actualizar", detalle: e.message };
        }
      })
    );

    res.status(200).json(resultados);
  } catch (error) {
    res.status(400).json({
      error: "Error al procesar la solicitud",
      detalle: error.message,
    });
  }
};

exports.eliminarArticulo = async (req, res) => {
  try {
    const data = req.body;

    // Eliminación única
    if (!Array.isArray(data)) {
      const { _id } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const eliminado = await Menu.findByIdAndDelete(_id);
      if (!eliminado)
        return res.status(404).json({ error: "Artículo no encontrado" });

      return res.status(200).json({ _id, eliminado: true });
    }

    // Eliminación múltiple
    const resultados = await Promise.all(
      data.map(async ({ _id }) => {
        if (!_id) return { error: "Falta _id" };

        const eliminado = await Menu.findByIdAndDelete(_id);
        return eliminado
          ? { _id, eliminado: true }
          : { _id, eliminado: false, error: "No encontrado" };
      })
    );

    res.status(200).json(resultados);
  } catch (error) {
    res.status(400).json({
      error: "Error al eliminar artículo(s)",
      detalle: error.message,
    });
  }
};

// --- AGREGACIONES ---
exports.cantidadArticulosPorRestaurante = async (req, res) => {
  try {
    const resultado = await Menu.aggregate([
      {
        $group: {
          _id: "$restaurante_id",
          cantidad_articulos: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      {
        $unwind: "$restaurante",
      },
      {
        $project: {
          restaurante_id: "$_id",
          nombre_restaurante: "$restaurante.nombre",
          cantidad_articulos: 1,
          _id: 0,
        },
      },
      { $sort: { cantidad_articulos: -1 } },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al agrupar artículos por restaurante",
      detalle: error.message,
    });
  }
};

exports.restaurantesSegunCantidadMenus = async (req, res) => {
  try {
    const {
      min = 0,
      max = Number.MAX_SAFE_INTEGER,
      ordenar = "desc",
    } = req.query;
    const sortOrder = ordenar === "asc" ? 1 : -1;

    const resultado = await Menu.aggregate([
      {
        $group: {
          _id: "$restaurante_id",
          cantidad_articulos: { $sum: 1 },
          nombres_articulos: { $addToSet: "$nombre" },
        },
      },
      {
        $match: {
          cantidad_articulos: {
            $gte: parseInt(min),
            $lte: parseInt(max),
          },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          restaurante_id: "$_id",
          nombre_restaurante: "$restaurante.nombre",
          cantidad_articulos: 1,
          nombres_articulos: 1,
          _id: 0,
        },
      },
      { $sort: { cantidad_articulos: sortOrder } },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener restaurantes con más/menos menús",
      detalle: error.message,
    });
  }
};

// Promedio de precio del menú por restaurante
exports.promedioPrecioPorRestaurante = async (req, res) => {
  try {
    const { ordenar = "desc" } = req.query;
    const sortOrder = ordenar === "asc" ? 1 : -1;

    const resultado = await Menu.aggregate([
      {
        $group: {
          _id: "$restaurante_id",
          promedio_precio: { $avg: "$precio" },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          restaurante_id: "$_id",
          nombre_restaurante: "$restaurante.nombre",
          promedio_precio: 1,
          _id: 0,
        },
      },
      { $sort: { promedio_precio: sortOrder } },
    ]).hint({ restaurante_id: 1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular promedios por restaurante",
      detalle: error.message,
    });
  }
};

// Artículo más barato y más caro por restaurante
exports.articuloExtremosPorRestaurante = async (req, res) => {
  try {
    const resultado = await Menu.aggregate([
      { $sort: { precio: 1 } },
      {
        $group: {
          _id: "$restaurante_id",
          mas_barato: { $first: "$$ROOT" },
          mas_caro: { $last: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          restaurante_id: "$_id",
          nombre_restaurante: "$restaurante.nombre",
          mas_barato: {
            nombre: "$mas_barato.nombre",
            precio: "$mas_barato.precio",
          },
          mas_caro: {
            nombre: "$mas_caro.nombre",
            precio: "$mas_caro.precio",
          },
          _id: 0,
        },
      },
    ]).hint({ restaurante_id: 1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener extremos de menú por restaurante",
      detalle: error.message,
    });
  }
};

// Top o bottom N restaurantes por promedio de precios del menú
exports.topOBottomRestaurantesPorPrecioPromedio = async (req, res) => {
  try {
    const { tipo = "top", limite = 5 } = req.query;
    const sortOrder = tipo === "bottom" ? 1 : -1;

    const resultado = await Menu.aggregate([
      {
        $group: {
          _id: "$restaurante_id",
          promedio_precio: { $avg: "$precio" },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          restaurante_id: "$_id",
          nombre_restaurante: "$restaurante.nombre",
          promedio_precio: 1,
          _id: 0,
        },
      },
      { $sort: { promedio_precio: sortOrder } },
      { $limit: parseInt(limite) },
    ]).hint({ restaurante_id: 1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener ranking de restaurantes por precio promedio",
      detalle: error.message,
    });
  }
};

// Promedio de precio por categoría de restaurante
exports.promedioPrecioPorCategoria = async (req, res) => {
  try {
    const resultado = await Menu.aggregate([
      {
        $lookup: {
          from: "restaurante",
          localField: "restaurante_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $group: {
          _id: "$restaurante.categoria",
          promedio_precio: { $avg: "$precio" },
          total_articulos: { $sum: 1 },
        },
      },
      {
        $project: {
          categoria: "$_id",
          promedio_precio: 1,
          total_articulos: 1,
          _id: 0,
        },
      },
      { $sort: { promedio_precio: -1 } },
    ]).hint({ restaurante_id: 1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular el promedio de precios por categoría",
      detalle: error.message,
    });
  }
};

// Distribución de precios por zona + extremos
exports.distribucionPreciosPorZona = async (req, res) => {
  try {
    const { ordenar = "none", limite = 0 } = req.query;
    const sortStage =
      ordenar === "asc"
        ? { $sort: { promedio_precio: 1 } }
        : ordenar === "desc"
        ? { $sort: { promedio_precio: -1 } }
        : null;

    const pipeline = [
      {
        $lookup: {
          from: "restaurante",
          localField: "restaurante_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $addFields: {
          zona: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      {
                        $gt: [
                          {
                            $arrayElemAt: [
                              "$restaurante.coordenadas.coordinates",
                              1,
                            ],
                          },
                          0,
                        ],
                      },
                      {
                        $gte: [
                          {
                            $arrayElemAt: [
                              "$restaurante.coordenadas.coordinates",
                              0,
                            ],
                          },
                          0,
                        ],
                      },
                    ],
                  },
                  then: "NE",
                },
                {
                  case: {
                    $and: [
                      {
                        $gt: [
                          {
                            $arrayElemAt: [
                              "$restaurante.coordenadas.coordinates",
                              1,
                            ],
                          },
                          0,
                        ],
                      },
                      {
                        $lt: [
                          {
                            $arrayElemAt: [
                              "$restaurante.coordenadas.coordinates",
                              0,
                            ],
                          },
                          0,
                        ],
                      },
                    ],
                  },
                  then: "NW",
                },
                {
                  case: {
                    $and: [
                      {
                        $lt: [
                          {
                            $arrayElemAt: [
                              "$restaurante.coordenadas.coordinates",
                              1,
                            ],
                          },
                          0,
                        ],
                      },
                      {
                        $lt: [
                          {
                            $arrayElemAt: [
                              "$restaurante.coordenadas.coordinates",
                              0,
                            ],
                          },
                          0,
                        ],
                      },
                    ],
                  },
                  then: "SW",
                },
                {
                  case: {
                    $and: [
                      {
                        $lt: [
                          {
                            $arrayElemAt: [
                              "$restaurante.coordenadas.coordinates",
                              1,
                            ],
                          },
                          0,
                        ],
                      },
                      {
                        $gte: [
                          {
                            $arrayElemAt: [
                              "$restaurante.coordenadas.coordinates",
                              0,
                            ],
                          },
                          0,
                        ],
                      },
                    ],
                  },
                  then: "SE",
                },
                {
                  case: {
                    $gte: [
                      {
                        $arrayElemAt: [
                          "$restaurante.coordenadas.coordinates",
                          1,
                        ],
                      },
                      0,
                    ],
                  },
                  then: "N",
                },
                {
                  case: {
                    $lt: [
                      {
                        $arrayElemAt: [
                          "$restaurante.coordenadas.coordinates",
                          1,
                        ],
                      },
                      0,
                    ],
                  },
                  then: "S",
                },
              ],
              default: "Desconocido",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            zona: "$zona",
            restaurante_id: "$restaurante._id",
            nombre: "$restaurante.nombre",
          },
          promedio_precio: { $avg: "$precio" },
          max_precio: { $max: "$precio" },
          min_precio: { $min: "$precio" },
        },
      },
      {
        $project: {
          zona: "$_id.zona",
          restaurante_id: "$_id.restaurante_id",
          nombre_restaurante: "$_id.nombre",
          promedio_precio: 1,
          max_precio: 1,
          min_precio: 1,
          _id: 0,
        },
      },
    ];

    if (sortStage) pipeline.push(sortStage);
    if (limite > 0) pipeline.push({ $limit: parseInt(limite) });

    const resultado = await Menu.aggregate(pipeline).hint({
      restaurante_id: 1,
    });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al analizar precios por zona",
      detalle: error.message,
    });
  }
};
