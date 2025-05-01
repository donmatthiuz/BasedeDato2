const Orden = require("../models/Orden");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

exports.subirArchivoOrden = [
  upload.single("orden"), // nombre del campo esperado: "orden"
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const insertData = Array.isArray(data) ? data : [data];
      const insertados = await Orden.insertMany(insertData, { ordered: false });

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

exports.crearOrden = async (req, res) => {
  try {
    const data = req.body;

    // Función para preparar orden
    const prepararOrden = (orden) => ({
      ...orden,
      fecha: orden.fecha || new Date(),
    });

    if (!Array.isArray(data)) {
      const nuevaOrden = new Orden(prepararOrden(data));
      await nuevaOrden.save();
      return res.status(201).json(nuevaOrden);
    }

    const ordenes = await Orden.insertMany(data.map(prepararOrden), {
      ordered: false,
    });
    res.status(201).json(ordenes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerOrdenes = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtros simples ---
    if (query.usuario_id) filtro.usuario_id = query.usuario_id;
    if (query.restaurante_id) filtro.restaurante_id = query.restaurante_id;
    if (query.estado) filtro.estado = query.estado;
    if (query.estado_in) filtro.estado = { $in: query.estado_in.split(",") };
    if (query.estado_nin) filtro.estado = { $nin: query.estado_nin.split(",") };

    // --- Rango de total ---
    if (
      query.total_gt ||
      query.total_gte ||
      query.total_lt ||
      query.total_lte
    ) {
      filtro.total = {};
      if (query.total_gt) filtro.total.$gt = parseFloat(query.total_gt);
      if (query.total_gte) filtro.total.$gte = parseFloat(query.total_gte);
      if (query.total_lt) filtro.total.$lt = parseFloat(query.total_lt);
      if (query.total_lte) filtro.total.$lte = parseFloat(query.total_lte);
    }

    // --- Filtro por rango de fechas ---
    if (query.fecha_inicio || query.fecha_fin) {
      filtro.fecha = {};
      if (query.fecha_inicio) filtro.fecha.$gte = new Date(query.fecha_inicio);
      if (query.fecha_fin) filtro.fecha.$lt = new Date(query.fecha_fin);
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
    const ordenes = await Orden.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ usuario_id: 1, fecha: -1 })
      .lean();

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
