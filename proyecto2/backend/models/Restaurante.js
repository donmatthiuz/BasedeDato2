const mongoose = require("mongoose");

const RestauranteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
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
    categoria: { type: String },
  },
  {
    collection: "restaurante",
    versionKey: false,
  }
);

RestauranteSchema.index({ coordenadas: "2dsphere" });

module.exports = mongoose.model("Restaurante", RestauranteSchema);
