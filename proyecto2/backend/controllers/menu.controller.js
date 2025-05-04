const Menu = require("../models/Menu");
const multer = require("multer");
const fs = require("fs");

// Middleware para archivo
const upload = multer({ dest: "uploads/" }); // crea carpeta si no existe

exports.subirArchivoMenu = [
  upload.single("menu"), // nombre del campo esperado: "menu"
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const insertData = Array.isArray(data) ? data : [data];
      const insertados = await Menu.insertMany(insertData, { ordered: false });

      fs.unlinkSync(path);
      res.status(201).json({ insertados });
    } catch (error) {
      res.status(400).json({
        error: "Error al procesar el archivo",
        detalle: error.message,
      });
    }
  },
];

exports.crearArticulo = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      const articulo = new Menu(data);
      await articulo.save();
      return res.status(201).json(articulo);
    }

    const articulos = await Menu.insertMany(data, { ordered: false });
    res.status(201).json(articulos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerArticulos = async (req, res) => {
  try {
    const query = req.query;

    // --- Filtros flexibles ---
    const filtro = {};
    if (query.restaurante_id) {
      filtro.restaurante_id = query.restaurante_id;
    }

    if (query.disponible) {
      filtro.disponible = query.disponible === "true";
    }

    if (query.nombre) {
      filtro.nombre = { $regex: query.nombre, $options: "i" };
    }

    if (
      query.precio_gt ||
      query.precio_lt ||
      query.precio_min ||
      query.precio_max
    ) {
      filtro.precio = {};
      if (query.precio_gt) filtro.precio.$gt = parseFloat(query.precio_gt);
      if (query.precio_lt) filtro.precio.$lt = parseFloat(query.precio_lt);
      if (query.precio_min) filtro.precio.$gte = parseFloat(query.precio_min);
      if (query.precio_max) filtro.precio.$lte = parseFloat(query.precio_max);
    }

    // --- Filtros por existencia de campos ---
    if (query.exists) {
      query.exists.split(",").forEach((campo) => {
        const existe = !campo.startsWith("-");
        const campoLimpio = campo.replace(/^-/, "").trim();
        filtro[campoLimpio] = { $exists: existe };
      });
    }

    // --- Proyección ---
    const proyeccion = {};
    if (query.campos) {
      const campos = query.campos.split(",").map((c) => c.trim());
      campos.forEach((campo) => {
        proyeccion[campo] = 1;
      });

      if (!campos.includes("_id")) {
        proyeccion["_id"] = 0; // excluye _id si no fue solicitado
      }
    }

    // --- Ordenamiento ---
    const sort = {};
    if (query.ordenar_por) {
      // Ej: ?ordenar_por=precio o ?ordenar_por=-precio
      const campo = query.ordenar_por;
      sort[campo.replace("-", "")] = campo.startsWith("-") ? 1 : -1;
    }

    // --- Paginación ---
    const skip = parseInt(query.skip) || 0;
    const limit = parseInt(query.limit) || 20;

    // --- Consulta ---
    const articulos = await Menu.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ restaurante_id: 1, disponible: 1 })
      .lean();

    res.json(articulos);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};
