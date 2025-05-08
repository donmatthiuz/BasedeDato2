const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
    restaurante_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true,
    },
    imagen_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imagenesMenu",
      required: false,
    },
  },
  {
    collection: "menu",
    versionKey: false,
  }
);

module.exports = mongoose.model("Menu", MenuSchema);
