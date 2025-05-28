const mongoose = require("mongoose");

exports.obtenerCamposDeColeccion = async (req, res) => {
  try {
    const { coleccion } = req.params;
    if (!coleccion) {
      return res.status(400).json({ error: "Falta el nombre de la colección" });
    }

    const db = mongoose.connection.db;
    const resultados = await db
      .collection(coleccion)
      .aggregate([
        { $project: { keys: { $objectToArray: "$$ROOT" } } },
        { $unwind: "$keys" },
        { $group: { _id: null, allKeys: { $addToSet: "$keys.k" } } },
      ])
      .toArray();

    const campos = resultados[0]?.allKeys || [];

    res.status(200).json({ coleccion, campos });
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener campos",
      detalle: error.message,
    });
  }
};
