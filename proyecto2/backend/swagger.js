const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Restaurantes",
      version: "1.0.0",
      description: "Documentación interactiva de la API del proyecto MongoDB",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: ["./routes/*.js"], // Documentación a partir de los comentarios en las rutas
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
