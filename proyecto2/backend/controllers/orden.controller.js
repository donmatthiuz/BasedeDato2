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

    if (!Array.isArray(data)) {
      const orden = new Orden(data);
      await orden.save();
      return res.status(201).json(orden);
    }

    const ordenes = await Orden.insertMany(data, { ordered: false });
    res.status(201).json(ordenes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerOrdenes = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.usuario_id) {
      filtro.usuario_id = req.query.usuario_id;
    }
    if (req.query.estado) {
      filtro.estado = req.query.estado;
    }

    const ordenes = await Orden.find(filtro)
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
