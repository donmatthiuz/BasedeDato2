const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    direccion: { type: String },
    telefono: { type: String },
    fecha_registro: { type: Date, default: Date.now },
    contra: { type: String, required: true },
  },
  {
    collection: "usuario",
    versionKey: false,
  }
);

module.exports = mongoose.model("Usuario", UsuarioSchema);
