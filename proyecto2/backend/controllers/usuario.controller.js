const Usuario = require("../models/Usuario");

exports.crearUsuario = async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
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
