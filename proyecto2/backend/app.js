const express = require("express");
const cors = require("cors");

const restauranteRoutes = require("./routes/restaurante.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const menuRoutes = require("./routes/menu.routes");

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/restaurantes", restauranteRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/menu", menuRoutes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
module.exports = app;
