const Orden = require("../models/Orden");

exports.crearOrden = async (req, res) => {
  try {
    const orden = new Orden(req.body);
    await orden.save();
    res.status(201).json(orden);
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

    const ordenes = await Orden.find(filtro).hint({ usuario_id: 1, fecha: -1 });

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
