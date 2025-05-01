const Menu = require("../models/Menu");
const multer = require("multer");
const fs = require("fs");

// Middleware para archivo
const upload = multer({ dest: "uploads/" }); // crea carpeta si no existe

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
    const filtro = {};
    if (req.query.restaurante_id) {
      filtro.restaurante_id = req.query.restaurante_id;
    }
    if (req.query.disponible) {
      filtro.disponible = req.query.disponible === "true";
    }

    const articulos = await Menu.find(filtro).hint({
      restaurante_id: 1,
      disponible: 1,
    });

    res.json(articulos);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
