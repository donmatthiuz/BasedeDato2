const Resena = require("../models/Resena");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

exports.subirArchivoResena = [
  upload.single("resena"), // nombre del campo esperado: "resena"
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const prepararResena = (r) => ({
        ...r,
        fecha: r.fecha || new Date(),
      });

      const insertData = (Array.isArray(data) ? data : [data]).map(
        prepararResena
      );
      const insertados = await Resena.insertMany(insertData, {
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

exports.crearResena = async (req, res) => {
  try {
    const data = req.body;

    const prepararResena = (r) => ({
      ...r,
      fecha: r.fecha || new Date(),
    });

    if (!Array.isArray(data)) {
      const resena = new Resena(prepararResena(data));
      await resena.save();
      return res.status(201).json(resena);
    }

    const resenas = await Resena.insertMany(data.map(prepararResena), {
      ordered: false,
    });
    res.status(201).json(resenas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerResenas = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtros simples ---
    if (query.restaurante_id) filtro.restaurante_id = query.restaurante_id;
    if (query.usuario_id) filtro.usuario_id = query.usuario_id;
    if (query.orden_id) filtro.orden_id = query.orden_id;

    // --- Filtros por inclusión/exclusión de calificación ---
    if (query.calificacion_in)
      filtro.calificacion = {
        $in: query.calificacion_in.split(",").map(Number),
      };
    if (query.calificacion_nin)
      filtro.calificacion = {
        $nin: query.calificacion_nin.split(",").map(Number),
      };

    // --- Filtros por rango de calificación ---
    if (
      query.calificacion_gt ||
      query.calificacion_gte ||
      query.calificacion_lt ||
      query.calificacion_lte
    ) {
      filtro.calificacion = filtro.calificacion || {};
      if (query.calificacion_gt)
        filtro.calificacion.$gt = parseInt(query.calificacion_gt);
      if (query.calificacion_gte)
        filtro.calificacion.$gte = parseInt(query.calificacion_gte);
      if (query.calificacion_lt)
        filtro.calificacion.$lt = parseInt(query.calificacion_lt);
      if (query.calificacion_lte)
        filtro.calificacion.$lte = parseInt(query.calificacion_lte);
    }

    // --- Filtro por rango de fechas ---
    if (query.fecha_inicio || query.fecha_fin) {
      filtro.fecha = {};

      if (query.fecha_inicio) {
        const inicio = new Date(query.fecha_inicio);
        inicio.setHours(0, 0, 0, 0); // 00:00:00.000
        filtro.fecha.$gte = inicio;
      }

      if (query.fecha_fin) {
        const fin = new Date(query.fecha_fin);
        fin.setHours(23, 59, 59, 999); // 23:59:59.999
        filtro.fecha.$lte = fin;
      }
    }

    // --- Filtro por comentario (expresión regular, insensible a mayúsculas) ---
    if (query.comentario) filtro.comentario = new RegExp(query.comentario, "i");

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
    const resenas = await Resena.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ restaurante_id: 1, calificacion: -1 })
      .lean();

    res.json(resenas);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
