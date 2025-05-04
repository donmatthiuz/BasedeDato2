const Restaurante = require("../models/Restaurante");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

exports.subirArchivoRestaurante = [
  upload.single("restaurante"), // nombre del campo esperado: "restaurante"
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const insertData = Array.isArray(data) ? data : [data];
      const insertados = await Restaurante.insertMany(insertData, {
        ordered: false,
      });

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

exports.crearRestaurante = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      // Si es un solo restaurante
      const restaurante = new Restaurante(data);
      await restaurante.save();
      return res.status(201).json(restaurante);
    }

    // Si es un array, inserta múltiples
    const restaurantes = await Restaurante.insertMany(data, { ordered: false });
    res.status(201).json(restaurantes);
  } catch (error) {
    res.status(400).json({
      error: "Error al crear restaurante(s)",
      detalle: error.message,
    });
  }
};

exports.obtenerRestaurantes = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtros simples ---
    if (query.nombre) filtro.nombre = new RegExp(query.nombre, "i");
    if (query.categoria) filtro.categoria = query.categoria;
    if (query.telefono) filtro.telefono = query.telefono;

    // --- Filtros por inclusión/exclusión de categorías ---
    if (query.categoria_in)
      filtro.categoria = { $in: query.categoria_in.split(",") };
    if (query.categoria_nin)
      filtro.categoria = { $nin: query.categoria_nin.split(",") };

    // --- Filtro por coordenadas exactas (GeoJSON) ---
    if (query.coordenadas) {
      const [lng, lat] = query.coordenadas.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        filtro.coordenadas = {
          $geoWithin: {
            $centerSphere: [[lng, lat], 0], // radio cero para coincidencia exacta
          },
        };
      }
    }

    // --- Filtro por coordenadas cercanas ---
    if (query.cerca_de) {
      const [lng, lat] = query.cerca_de.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        filtro.coordenadas = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: parseFloat(query.radio_metros) || 5000, // radio opcional, default 5km
          },
        };
      }
    }

    // --- Búsqueda por expresión regular en dirección -
    if (query.direccion_regex) {
      filtro.direccion = new RegExp(query.direccion_regex, "i");
    }

    // --- Filtros por existencia de campos ---
    if (query.exists) {
      query.exists.split(",").forEach((campo) => {
        const existe = !campo.startsWith("-");
        const campoLimpio = campo.replace(/^-/, "").trim();
        filtro[campoLimpio] = { $exists: existe };
      });
    }

    // --- Proyección de campos ---
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
      const campo = query.ordenar_por;
      sort[campo.replace("-", "")] = campo.startsWith("-") ? 1 : -1;
    }

    // --- Paginación ---
    const skip = parseInt(query.skip) || 0;
    const limit = parseInt(query.limit) || 20;

    // --- Consulta ---
    const restaurantes = await Restaurante.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ nombre: 1 })
      .lean();

    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};

exports.actualizarRestaurante = async (req, res) => {
  try {
    const data = req.body;

    // --- Actualización única ---
    if (!Array.isArray(data)) {
      const { _id, ...update } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const actualizado = await Restaurante.findByIdAndUpdate(_id, update, {
        new: true,
        runValidators: true,
      });

      if (!actualizado) {
        return res
          .status(404)
          .json({ error: "Restaurante no encontrado", _id });
      }

      return res.status(200).json(actualizado);
    }

    // --- Actualización múltiple ---
    const resultados = await Promise.all(
      data.map(async (r) => {
        const { _id, ...update } = r;
        if (!_id) return { error: "Falta _id" };

        try {
          const actualizado = await Restaurante.findByIdAndUpdate(_id, update, {
            new: true,
            runValidators: true,
          });

          return actualizado || { _id, error: "No encontrado" };
        } catch (e) {
          return { _id, error: "Error al actualizar", detalle: e.message };
        }
      })
    );

    res.status(200).json(resultados);
  } catch (error) {
    res.status(400).json({
      error: "Error al procesar la solicitud",
      detalle: error.message,
    });
  }
};

exports.eliminarRestaurante = async (req, res) => {
  try {
    const data = req.body;

    // --- Eliminación única ---
    if (!Array.isArray(data)) {
      const { _id } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const eliminado = await Restaurante.findByIdAndDelete(_id);
      if (!eliminado) {
        return res
          .status(404)
          .json({ error: "Restaurante no encontrado", _id });
      }

      return res.status(200).json({ _id, status: "eliminado" });
    }

    // --- Eliminación múltiple ---
    const resultados = await Promise.all(
      data.map(async (item) => {
        const { _id } = item;
        if (!_id) return { error: "Falta _id" };

        try {
          const eliminado = await Restaurante.findByIdAndDelete(_id);
          return eliminado
            ? { _id, status: "eliminado" }
            : { _id, error: "No encontrado" };
        } catch (e) {
          return { _id, error: "Error al eliminar", detalle: e.message };
        }
      })
    );

    res.status(200).json(resultados);
  } catch (error) {
    res.status(400).json({
      error: "Error al procesar la solicitud",
      detalle: error.message,
    });
  }
};
