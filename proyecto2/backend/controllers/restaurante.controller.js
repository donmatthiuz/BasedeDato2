const Restaurante = require("../models/Restaurante");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

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
    if (query.nombre) filtro.nombre = new RegExp(query.nombre, "i");
    if (query.categoria) filtro.categoria = query.categoria;
    if (query.telefono) filtro.telefono = query.telefono;

    // --- Filtros por inclusión/exclusión de categorías ---
    if (query.categoria_in)
      filtro.categoria = { $in: query.categoria_in.split(",") };
    if (query.categoria_nin)
      filtro.categoria = { $nin: query.categoria_nin.split(",") };

    // --- Búsqueda por expresión regular en dirección -
    if (query.direccion_regex) {
      filtro.direccion = new RegExp(query.direccion_regex, "i");
    }

    // --- Proyección de campos ---
    const proyeccion = {};
    if (query.campos) {
      query.campos.split(",").forEach((campo) => {
        proyeccion[campo.trim()] = 1;
      });
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
