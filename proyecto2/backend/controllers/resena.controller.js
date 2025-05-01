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

      const insertData = Array.isArray(data) ? data : [data];
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

    if (!Array.isArray(data)) {
      const resena = new Resena(data);
      await resena.save();
      return res.status(201).json(resena);
    }

    const resenas = await Resena.insertMany(data, { ordered: false });
    res.status(201).json(resenas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerResenas = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.restaurante_id) {
      filtro.restaurante_id = req.query.restaurante_id;
    }
    if (req.query.usuario_id) {
      filtro.usuario_id = req.query.usuario_id;
    }

    const resenas = await Resena.find(filtro)
      .hint({
        restaurante_id: 1,
        calificacion: -1,
      })
      .lean(); // índice compuesto

    res.json(resenas);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
