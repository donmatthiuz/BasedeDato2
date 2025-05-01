const Resena = require("../models/Resena");

exports.crearResena = async (req, res) => {
  try {
    const resena = new Resena(req.body);
    await resena.save();
    res.status(201).json(resena);
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

    const resenas = await Resena.find(filtro).hint({
      restaurante_id: 1,
      calificacion: -1,
    }); // índice compuesto

    res.json(resenas);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
