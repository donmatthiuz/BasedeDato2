const mongoose = require("mongoose");

const PlatilloSchema = new mongoose.Schema(
  {
    menu_item_id: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precio_unitario: { type: Number, required: true },
  },
  { _id: false }
);

const OrdenSchema = new mongoose.Schema(
  {
    usuario_id: { type: String, required: true },
    restaurante_id: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    estado: { type: String, default: "pendiente" },
    metodo_pago: { type: String },
    platillos: [PlatilloSchema],
  },
  {
    collection: "orden",
  }
);

module.exports = mongoose.model("Orden", OrdenSchema);
