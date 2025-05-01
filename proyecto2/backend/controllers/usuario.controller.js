const Usuario = require("../models/Usuario");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

exports.subirArchivoUsuario = [
  upload.single("usuario"), // campo esperado en el formulario
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const insertData = Array.isArray(data) ? data : [data];
      const insertados = await Usuario.insertMany(insertData, {
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

exports.crearUsuario = async (req, res) => {
  try {
    const data = req.body;

    const setFecha = (item) => {
      if (!item.fecha_registro) item.fecha_registro = new Date();
      return item;
    };

    if (!Array.isArray(data)) {
      const usuario = new Usuario(setFecha(data));
      await usuario.save();
      return res.status(201).json(usuario);
    }

    const usuarios = await Usuario.insertMany(data.map(setFecha), {
      ordered: false,
    });
    res.status(201).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtros simples ---
    if (query.nombre) filtro.nombre = new RegExp(query.nombre, "i");
    if (query.email) filtro.email = query.email;
    if (query.telefono) filtro.telefono = query.telefono;

    // --- Filtros con expresiones regulares ---
    if (query.email_regex) filtro.email = new RegExp(query.email_regex, "i");
    if (query.direccion_regex)
      filtro.direccion = new RegExp(query.direccion_regex, "i");

    // --- Filtros por inclusión/exclusión ---
    if (query.email_in) filtro.email = { $in: query.email_in.split(",") };
    if (query.telefono_nin)
      filtro.telefono = { $nin: query.telefono_nin.split(",") };

    // --- Filtro por rango de fechas de registro ---
    if (query.fecha_inicio || query.fecha_fin) {
      filtro.fecha_registro = {};
      if (query.fecha_inicio)
        filtro.fecha_registro.$gte = new Date(query.fecha_inicio);
      if (query.fecha_fin)
        filtro.fecha_registro.$lte = new Date(query.fecha_fin);
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
    const usuarios = await Usuario.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ nombre: 1, direccion: 1 })
      .lean();

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
