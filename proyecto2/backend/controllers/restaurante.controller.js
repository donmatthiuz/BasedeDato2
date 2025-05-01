const Restaurante = require("../models/Restaurante");

exports.crearRestaurante = async (req, res) => {
  try {
    const restaurante = new Restaurante(req.body);
    await restaurante.save();
    res.status(201).json(restaurante);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
