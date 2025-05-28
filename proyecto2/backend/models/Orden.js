const mongoose = require("mongoose");

const PlatilloSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
  },
  { _id: false }
);

const OrdenSchema = new mongoose.Schema(
  {
    fecha: { type: Date, default: Date.now },
    estado: { type: String, default: "pendiente" },
    platillos: [PlatilloSchema],
    total: { type: Number, required: true },
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    restaurante_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true,
    },
  },
  {
    collection: "orden",
    versionKey: false,
  }
);

module.exports = mongoose.model("Orden", OrdenSchema);
