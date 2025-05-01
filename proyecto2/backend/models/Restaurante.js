const mongoose = require("mongoose");

const RestauranteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String },
    telefono: { type: String },
    categoria: { type: String },
  },
  {
    collection: "restaurante",
    versionKey: false,
  }
);

module.exports = mongoose.model("Restaurante", RestauranteSchema);
