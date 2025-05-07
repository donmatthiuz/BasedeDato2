const mongoose = require("mongoose");

exports.aplicarIndices = async (req, res) => {
  try {
    const { aplicar } = req.body;
    if (!aplicar) {
      return res.status(400).json({ error: "Debe enviar { aplicar: true }" });
    }

    const db = mongoose.connection.db;

    await Promise.all([
      // Restaurante
      db.collection("restaurante").createIndex({ nombre: 1 }),
      db
        .collection("restaurante")
        .createIndex({ nombre: "text", categoria: "text" }),
      db.collection("restaurante").createIndex({ coordenadas: "2dsphere" }),
      db.collection("restaurante").createIndex({ telefono: 1 }),

      // Menu
      db.collection("menu").createIndex({ restaurante_id: 1, disponible: 1 }),
      db
        .collection("menu")
        .createIndex({ nombre: "text", descripcion: "text" }),
      db.collection("menu").createIndex({ restaurante_id: 1 }),
      db.collection("menu").createIndex({ restaurante_id: 1, precio: 1 }),

      // Usuario
      db
        .collection("usuario")
        .createIndex({ nombre: 1, tipo: 1, fecha_registro: -1 }),
      db.collection("usuario").createIndex({ coordenadas: "2dsphere" }),

      // Orden
      db.collection("orden").createIndex({ usuario_id: 1, fecha: -1 }),
      db.collection("orden").createIndex({ restaurante_id: 1 }),
      db.collection("orden").createIndex({ fecha: 1, restaurante_id: 1 }),
      db.collection("orden").createIndex({ restaurante_id: 1, estado: 1 }),

      // Reseña
      db
        .collection("resena")
        .createIndex({ restaurante_id: 1, calificacion: -1 }),
      db.collection("resena").createIndex({ usuario_id: 1, fecha: -1 }),
      db.collection("resena").createIndex({ nombre_usuario: 1 }),
      db.collection("resena").createIndex({ "menu.nombre": 1 }),
      db.collection("resena").createIndex({ "menu.precio": 1 }),
    ]);

    res.status(200).json({ status: "Índices aplicados correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al aplicar índices", detalle: error.message });
  }
};

exports.verIndices = async (req, res) => {
  try {
    const colecciones = await mongoose.connection.db
      .listCollections()
      .toArray();

    const resultados = {};
    for (const col of colecciones) {
      const nombre = col.name;
      const indices = await mongoose.connection.db.collection(nombre).indexes();
      resultados[nombre] = indices;
    }

    res.status(200).json({ success: true, indices: resultados });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener los índices",
      detalle: error.message,
    });
  }
};

exports.eliminarIndices = async (req, res) => {
  try {
    const { coleccion, indices } = req.body;

    if (!coleccion) {
      return res
        .status(400)
        .json({ error: "Se requiere el nombre de la colección." });
    }

    const collection = mongoose.connection.db.collection(coleccion);

    let eliminados = [];

    if (Array.isArray(indices) && indices.length > 0) {
      // Eliminar índices específicos
      for (const idx of indices) {
        if (idx === "_id_") continue; // No se puede eliminar índice _id
        await collection.dropIndex(idx);
        eliminados.push(idx);
      }
    } else {
      // Eliminar todos excepto _id
      const todos = await collection.indexes();
      for (const idx of todos) {
        if (idx.name !== "_id_") {
          await collection.dropIndex(idx.name);
          eliminados.push(idx.name);
        }
      }
    }

    res.status(200).json({
      success: true,
      mensaje: `Índices eliminados de ${coleccion}`,
      eliminados,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al eliminar índices",
      detalle: error.message,
    });
  }
};
