const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    disponible: { type: Boolean, default: true },
    restaurante_id: { type: String, required: true },
  },
  {
    collection: "menu",
  }
);

module.exports = mongoose.model("Menu", MenuSchema);
