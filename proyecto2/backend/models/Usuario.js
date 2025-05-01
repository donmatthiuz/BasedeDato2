const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    direccion: { type: String },
    telefono: { type: String },
    fecha_registro: { type: Date, default: Date.now },
    frecuencia: { type: String },
  },
  {
    collection: "usuario",
  }
);

module.exports = mongoose.model("Usuario", UsuarioSchema);
