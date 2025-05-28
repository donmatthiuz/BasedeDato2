const express = require("express");
const cors = require("cors");

const restauranteRoutes = require("./routes/restaurante.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const menuRoutes = require("./routes/menu.routes");
const ordenRoutes = require("./routes/orden.routes");
const resenaRoutes = require("./routes/resena.routes");
const indiceRoutes = require("./routes/index.routes");
const utilsRoutes = require("./routes/utils.routes");

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/restaurante", restauranteRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orden", ordenRoutes);
app.use("/api/resena", resenaRoutes);
app.use("/api/indices", indiceRoutes);
app.use("/api/utils", utilsRoutes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
module.exports = app;
