const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    direccion: { type: String },
    coordenadas: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (v) {
            return Array.isArray(v) && v.length === 2;
          },
          message: "Las coordenadas deben tener formato [longitud, latitud].",
        },
      },
    },
    telefono: { type: String },
    contra: { type: String, required: true },
    fecha_registro: { type: Date, default: Date.now },
    tipo: { type: String },
  },
  {
    collection: "usuario",
    versionKey: false,
  }
);

module.exports = mongoose.model("Usuario", UsuarioSchema);
