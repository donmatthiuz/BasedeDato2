const mongoose = require("mongoose");

const MenuResenaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String },
  },
  { _id: false }
);

const ResenaSchema = new mongoose.Schema(
  {
    menu: { type: MenuResenaSchema, required: true },
    nombre_usuario: { type: String, required: true },
    calificacion: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String },
    fecha: { type: Date, default: Date.now },
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
    collection: "resena",
    versionKey: false,
  }
);

module.exports = mongoose.model("Resena", ResenaSchema);
