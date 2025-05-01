const mongoose = require("mongoose");

const ResenaSchema = new mongoose.Schema(
  {
    restaurante_id: { type: String, required: true },
    usuario_id: { type: String, required: true },
    orden_id: { type: String, required: true },
    calificacion: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String },
    fecha: { type: Date, default: Date.now },
  },
  {
    collection: "resena",
    versionKey: false,
  }
);

module.exports = mongoose.model("Resena", ResenaSchema);
