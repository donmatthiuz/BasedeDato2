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
    const filtro = {};
    if (req.query.nombre) {
      filtro.nombre = new RegExp(req.query.nombre, "i"); // búsqueda parcial insensible a mayúsculas
    }

    const restaurantes = await Restaurante.find(filtro).hint({ nombre: 1 }); // fuerza el uso del índice

    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
