const Menu = require("../models/Menu");

exports.crearArticulo = async (req, res) => {
  try {
    const articulo = new Menu(req.body);
    await articulo.save();
    res.status(201).json(articulo);
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
