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

    if (!Array.isArray(data)) {
      const usuario = new Usuario(data);
      await usuario.save();
      return res.status(201).json(usuario);
    }

    const usuarios = await Usuario.insertMany(data, { ordered: false });
    res.status(201).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.nombre) {
      filtro.nombre = new RegExp(req.query.nombre, "i");
    }

    const usuarios = await Usuario.find(filtro).hint({
      nombre: 1,
      direccion: 1,
    }); // índice compuesto obligatorio

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
