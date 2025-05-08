const Restaurante = require("../models/Restaurante");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// --- CRUD ---

exports.subirArchivoRestaurante = [
  upload.single("restaurante"), // nombre del campo esperado: "restaurante"
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const insertData = Array.isArray(data) ? data : [data];
      const insertados = await Restaurante.insertMany(insertData, {
        ordered: false,
      });

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

exports.crearRestaurante = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      // Si es un solo restaurante
      const restaurante = new Restaurante(data);
      await restaurante.save();
      return res.status(201).json(restaurante);
    }

    // Si es un array, inserta múltiples
    const restaurantes = await Restaurante.insertMany(data, { ordered: false });
    res.status(201).json(restaurantes);
  } catch (error) {
    res.status(400).json({
      error: "Error al crear restaurante(s)",
      detalle: error.message,
    });
  }
};

exports.obtenerRestaurantes = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtros simples ---
    if (query._id) {
      if (!mongoose.Types.ObjectId.isValid(query._id)) {
        return res
          .status(400)
          .json({ error: "El _id proporcionado no es válido" });
      }
      filtro._id = new mongoose.Types.ObjectId(query._id);
    }

    if (query.nombre) filtro.nombre = new RegExp(query.nombre, "i");
    if (query.categoria) filtro.categoria = query.categoria;
    if (query.telefono) filtro.telefono = query.telefono;

    // --- Filtros por inclusión/exclusión de categorías ---
    if (query.categoria_in)
      filtro.categoria = { $in: query.categoria_in.split(",") };
    if (query.categoria_nin)
      filtro.categoria = { $nin: query.categoria_nin.split(",") };

    // --- Filtro por coordenadas exactas (GeoJSON) ---
    if (query.coordenadas) {
      const [lng, lat] = query.coordenadas.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        filtro.coordenadas = {
          $geoWithin: {
            $centerSphere: [[lng, lat], 0], // radio cero para coincidencia exacta
          },
        };
      }
    }

    // --- Filtro por coordenadas cercanas ---
    if (query.cerca_de) {
      const [lng, lat] = query.cerca_de.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        filtro.coordenadas = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: parseFloat(query.radio_metros) || 5000, // radio opcional, default 5km
          },
        };
      }
    }

    // --- Búsqueda por expresión regular en dirección -
    if (query.direccion_regex) {
      filtro.direccion = new RegExp(query.direccion_regex, "i");
    }

    // --- Filtros por existencia de campos ---
    if (query.exists) {
      query.exists.split(",").forEach((campo) => {
        const existe = !campo.startsWith("-");
        const campoLimpio = campo.replace(/^-/, "").trim();
        filtro[campoLimpio] = { $exists: existe };
      });
    }

    // --- Proyección de campos ---
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
      const campo = query.ordenar_por;
      sort[campo.replace("-", "")] = campo.startsWith("-") ? 1 : -1;
    }

    // --- Paginación ---
    const skip = parseInt(query.skip) || 0;
    const limit = parseInt(query.limit) || 20;

    // --- Consulta ---
    const restaurantes = await Restaurante.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ nombre: 1 })
      .lean();

    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};

exports.actualizarRestaurante = async (req, res) => {
  try {
    const data = req.body;

    // --- Actualización única ---
    if (!Array.isArray(data)) {
      const { _id, ...update } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const actualizado = await Restaurante.findByIdAndUpdate(_id, update, {
        new: true,
        runValidators: true,
      });

      if (!actualizado) {
        return res
          .status(404)
          .json({ error: "Restaurante no encontrado", _id });
      }

      return res.status(200).json(actualizado);
    }

    // --- Actualización múltiple ---
    const resultados = await Promise.all(
      data.map(async (r) => {
        const { _id, ...update } = r;
        if (!_id) return { error: "Falta _id" };

        try {
          const actualizado = await Restaurante.findByIdAndUpdate(_id, update, {
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

exports.eliminarRestaurante = async (req, res) => {
  try {
    const data = req.body;

    // --- Eliminación única ---
    if (!Array.isArray(data)) {
      const { _id } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const eliminado = await Restaurante.findByIdAndDelete(_id);
      if (!eliminado) {
        return res
          .status(404)
          .json({ error: "Restaurante no encontrado", _id });
      }

      return res.status(200).json({ _id, status: "eliminado" });
    }

    // --- Eliminación múltiple ---
    const resultados = await Promise.all(
      data.map(async (item) => {
        const { _id } = item;
        if (!_id) return { error: "Falta _id" };

        try {
          const eliminado = await Restaurante.findByIdAndDelete(_id);
          return eliminado
            ? { _id, status: "eliminado" }
            : { _id, error: "No encontrado" };
        } catch (e) {
          return { _id, error: "Error al eliminar", detalle: e.message };
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

// --- AGREGACIONES ---

// Total de restaurantes registrados
exports.totalRestaurantes = async (req, res) => {
  try {
    const resultado = await Restaurante.aggregate([
      { $count: "total_restaurantes" },
    ]);

    res.status(200).json(resultado[0] || { total_restaurantes: 0 });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el total", detalle: error.message });
  }
};

// Cantidad por categoría
exports.cantidadPorCategoria = async (req, res) => {
  try {
    const { ordenar = "desc" } = req.query;
    const sortOrder = ordenar === "asc" ? 1 : -1;

    const resultado = await Restaurante.aggregate([
      {
        $group: {
          _id: "$categoria",
          cantidad: { $sum: 1 },
        },
      },
      {
        $project: {
          categoria: "$_id",
          cantidad: 1,
          _id: 0,
        },
      },
      {
        $sort: { cantidad: sortOrder },
      },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al agrupar por categoría",
      detalle: error.message,
    });
  }
};

// Categorías únicas disponibles
exports.categoriasUnicas = async (req, res) => {
  try {
    const { ordenar = "asc" } = req.query;
    const sortOrder = ordenar === "desc" ? -1 : 1;

    const categorias = await Restaurante.distinct("categoria");
    const categoriasOrdenadas = categorias.sort((a, b) => {
      if (a < b) return -1 * sortOrder;
      if (a > b) return 1 * sortOrder;
      return 0;
    });

    res.status(200).json({
      total: categoriasOrdenadas.length,
      categorias: categoriasOrdenadas,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener categorías únicas",
      detalle: error.message,
    });
  }
};

// Clasificación de restaurantes por zona geográfica
exports.restaurantesPorZona = async (req, res) => {
  try {
    const { region, ordenar = "desc" } = req.query;
    const sortOrder = ordenar === "asc" ? 1 : -1;

    const pipeline = [
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
                          { $arrayElemAt: ["$coordenadas.coordinates", 1] },
                          0,
                        ],
                      },
                      {
                        $gte: [
                          { $arrayElemAt: ["$coordenadas.coordinates", 0] },
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
                          { $arrayElemAt: ["$coordenadas.coordinates", 1] },
                          0,
                        ],
                      },
                      {
                        $lt: [
                          { $arrayElemAt: ["$coordenadas.coordinates", 0] },
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
                          { $arrayElemAt: ["$coordenadas.coordinates", 1] },
                          0,
                        ],
                      },
                      {
                        $lt: [
                          { $arrayElemAt: ["$coordenadas.coordinates", 0] },
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
                          { $arrayElemAt: ["$coordenadas.coordinates", 1] },
                          0,
                        ],
                      },
                      {
                        $gte: [
                          { $arrayElemAt: ["$coordenadas.coordinates", 0] },
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
                      { $arrayElemAt: ["$coordenadas.coordinates", 1] },
                      0,
                    ],
                  },
                  then: "N",
                },
                {
                  case: {
                    $lt: [{ $arrayElemAt: ["$coordenadas.coordinates", 1] }, 0],
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
          _id: "$zona",
          cantidad: { $sum: 1 },
        },
      },
      {
        $project: {
          zona: "$_id",
          cantidad: 1,
          _id: 0,
        },
      },
      {
        $sort: { cantidad: sortOrder },
      },
    ];

    if (region) {
      pipeline.push({ $match: { zona: region.toUpperCase() } });
    }

    const resultado = await Restaurante.aggregate(pipeline);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al clasificar restaurantes por zona",
      detalle: error.message,
    });
  }
};

// Clasificación de restaurantes por país o región a partir del prefijo telefónico
exports.restaurantesPorPrefijo = async (req, res) => {
  try {
    const { prefijo, ordenar = "desc" } = req.query;
    const sortOrder = ordenar === "asc" ? 1 : -1;

    const matchStage = {
      telefono: { $exists: true, $type: "string", $ne: "" },
    };

    if (prefijo) {
      const escaped = prefijo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchStage.telefono = new RegExp(`^${escaped}`);
    }

    const resultado = await Restaurante.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          prefijo: {
            $arrayElemAt: [{ $split: ["$telefono", " "] }, 0],
          },
        },
      },
      {
        $group: {
          _id: "$prefijo",
          cantidad: { $sum: 1 },
          telefonos: { $push: "$telefono" },
        },
      },
      {
        $project: {
          prefijo: "$_id",
          cantidad: 1,
          telefonos: 1,
          _id: 0,
        },
      },
      {
        $sort: { cantidad: sortOrder },
      },
    ]).option({ hint: { telefono: 1 } });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error en análisis por prefijo",
      detalle: error.message,
    });
  }
};

// Top o bottom 5 categorías por número de restaurantes
exports.categoriasTopOBottom = async (req, res) => {
  try {
    const { tipo = "top", limite = 5 } = req.query;
    const sortOrder = tipo === "bottom" ? 1 : -1;

    const resultado = await Restaurante.aggregate([
      { $group: { _id: "$categoria", cantidad: { $sum: 1 } } },
      { $project: { categoria: "$_id", cantidad: 1, _id: 0 } },
      { $sort: { cantidad: sortOrder } },
      { $limit: parseInt(limite) },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular categorías",
      detalle: error.message,
    });
  }
};
