const Resena = require("../models/Resena");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// --- CRUD ---

exports.subirArchivoResena = [
  upload.single("resena"), // nombre del campo esperado: "resena"
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const prepararResena = (r) => ({
        ...r,
        fecha: r.fecha || new Date(),
      });

      const insertData = (Array.isArray(data) ? data : [data]).map(
        prepararResena
      );
      const insertados = await Resena.insertMany(insertData, {
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

exports.crearResena = async (req, res) => {
  try {
    const data = req.body;

    const prepararResena = (r) => ({
      ...r,
      fecha: r.fecha || new Date(),
    });

    if (!Array.isArray(data)) {
      const resena = new Resena(prepararResena(data));
      await resena.save();
      return res.status(201).json(resena);
    }

    const resenas = await Resena.insertMany(data.map(prepararResena), {
      ordered: false,
    });
    res.status(201).json(resenas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerResenas = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtros simples ---
    if (query._id) {
      if (!mongoose.Types.ObjectId.isValid(query._id)) {
        return res
          .status(400)
          .json({ error: "El _id proporcionado no es válido" });
      }
      filtro._id = new mongoose.Types.ObjectId(query._id);
    }
    if (query.restaurante_id) filtro.restaurante_id = query.restaurante_id;
    if (query.usuario_id) filtro.usuario_id = query.usuario_id;
    if (query.orden_id) filtro.orden_id = query.orden_id;

    // --- Filtros por inclusión/exclusión de calificación ---
    if (query.calificacion_in)
      filtro.calificacion = {
        $in: query.calificacion_in.split(",").map(Number),
      };
    if (query.calificacion_nin)
      filtro.calificacion = {
        $nin: query.calificacion_nin.split(",").map(Number),
      };

    // --- Filtros por rango de calificación ---
    if (
      query.calificacion_gt ||
      query.calificacion_gte ||
      query.calificacion_lt ||
      query.calificacion_lte
    ) {
      filtro.calificacion = filtro.calificacion || {};
      if (query.calificacion_gt)
        filtro.calificacion.$gt = parseInt(query.calificacion_gt);
      if (query.calificacion_gte)
        filtro.calificacion.$gte = parseInt(query.calificacion_gte);
      if (query.calificacion_lt)
        filtro.calificacion.$lt = parseInt(query.calificacion_lt);
      if (query.calificacion_lte)
        filtro.calificacion.$lte = parseInt(query.calificacion_lte);
    }

    // --- Filtro por rango de fechas ---
    if (query.fecha_inicio || query.fecha_fin) {
      filtro.fecha = {};

      if (query.fecha_inicio) {
        const inicio = new Date(query.fecha_inicio);
        inicio.setHours(0, 0, 0, 0); // 00:00:00.000
        filtro.fecha.$gte = inicio;
      }

      if (query.fecha_fin) {
        const fin = new Date(query.fecha_fin);
        fin.setHours(23, 59, 59, 999); // 23:59:59.999
        filtro.fecha.$lte = fin;
      }
    }

    // --- Filtros de campos embebidos (menu) ---
    if (query.menu_nombre)
      filtro["menu.nombre"] = new RegExp(query.menu_nombre, "i");

    if (
      query.menu_precio_gt ||
      query.menu_precio_gte ||
      query.menu_precio_lt ||
      query.menu_precio_lte
    ) {
      filtro["menu.precio"] = {};
      if (query.menu_precio_gt)
        filtro["menu.precio"].$gt = parseFloat(query.menu_precio_gt);
      if (query.menu_precio_gte)
        filtro["menu.precio"].$gte = parseFloat(query.menu_precio_gte);
      if (query.menu_precio_lt)
        filtro["menu.precio"].$lt = parseFloat(query.menu_precio_lt);
      if (query.menu_precio_lte)
        filtro["menu.precio"].$lte = parseFloat(query.menu_precio_lte);
    }

    // --- Filtro por comentario (expresión regular, insensible a mayúsculas) ---
    if (query.comentario) filtro.comentario = new RegExp(query.comentario, "i");
    if (query.nombre_usuario)
      filtro.nombre_usuario = new RegExp(query.nombre_usuario, "i");

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
    const resenas = await Resena.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ restaurante_id: 1, calificacion: -1 })
      .lean();

    res.json(resenas);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};

exports.actualizarResena = async (req, res) => {
  try {
    const data = req.body;

    // --- Actualización única ---
    if (!Array.isArray(data)) {
      const { _id, ...update } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const actualizado = await Resena.findByIdAndUpdate(_id, update, {
        new: true,
        runValidators: true,
      });

      if (!actualizado)
        return res.status(404).json({ error: "Reseña no encontrada" });

      return res.json(actualizado);
    }

    // --- Actualización múltiple ---
    const resultados = await Promise.all(
      data.map(async (resena) => {
        const { _id, ...update } = resena;
        if (!_id) return { error: "Falta _id" };

        const actualizado = await Resena.findByIdAndUpdate(_id, update, {
          new: true,
          runValidators: true,
        });

        return actualizado || { _id, error: "No encontrado" };
      })
    );

    res.json(resultados);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al actualizar", detalle: error.message });
  }
};

exports.eliminarResena = async (req, res) => {
  try {
    const data = req.body;

    // Eliminación única
    if (!Array.isArray(data)) {
      const { _id } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const eliminado = await Resena.findByIdAndDelete(_id);
      if (!eliminado)
        return res.status(404).json({ error: "Reseña no encontrada" });

      return res.json({ mensaje: "Reseña eliminada", _id });
    }

    // Eliminación múltiple
    const ids = data.map((r) => r._id).filter(Boolean);
    if (ids.length === 0)
      return res.status(400).json({ error: "Ningún _id válido proporcionado" });

    const resultado = await Resena.deleteMany({ _id: { $in: ids } });

    res.json({
      mensaje: "Reseñas eliminadas",
      eliminadas: resultado.deletedCount,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al eliminar reseña(s)", detalle: error.message });
  }
};

// --- AGREGACIONES ---

// Promedio de calificaciones e identificación de restaurantes mejor valorados
exports.promedioCalificacionesPorRestaurante = async (req, res) => {
  try {
    const {
      ordenar = "desc", // asc | desc
      ordenar_por = "promedio_calificacion", // o total_resenas
      limite = 10,
    } = req.query;

    const sortOrder = ordenar === "asc" ? 1 : -1;

    const resultado = await Resena.aggregate([
      {
        $group: {
          _id: "$restaurante_id",
          promedio_calificacion: { $avg: "$calificacion" },
          total_resenas: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          restaurante_id: "$_id",
          nombre_restaurante: "$restaurante.nombre",
          promedio_calificacion: {
            $round: ["$promedio_calificacion", 2],
          },
          total_resenas: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          [ordenar_por]: sortOrder,
        },
      },
      {
        $limit: parseInt(limite),
      },
    ]).hint({ restaurante_id: 1, calificacion: -1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular promedio de calificaciones",
      detalle: error.message,
    });
  }
};

// Reseñas con calificación baja definida por el usuario
exports.resenasNegativasConComentarios = async (req, res) => {
  try {
    const {
      ordenar = "desc",
      ordenar_por = "fecha",
      limite = 50,
      calificacion_in = "1,2",
    } = req.query;

    const sortOrder = ordenar === "asc" ? 1 : -1;

    const calificaciones = calificacion_in
      .split(",")
      .map((c) => parseInt(c))
      .filter((c) => !isNaN(c));

    if (!calificaciones.length) {
      return res.status(400).json({
        error: "Parámetro calificacion_in inválido o vacío",
      });
    }

    const resultado = await Resena.aggregate([
      {
        $match: {
          calificacion: { $in: calificaciones },
          comentario: { $exists: true, $ne: "" },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "restaurante_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          nombre_restaurante: "$restaurante.nombre",
          nombre_usuario: 1,
          calificacion: 1,
          comentario: 1,
          fecha: 1,
          _id: 0,
        },
      },
      { $sort: { [ordenar_por]: sortOrder } },
      { $limit: parseInt(limite) },
    ]).hint({ restaurante_id: 1, calificacion: -1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener reseñas negativas",
      detalle: error.message,
    });
  }
};

// Análisis de precio vs calificación promedio de platillos
exports.platillosMasResenados = async (req, res) => {
  try {
    const {
      ordenar = "desc",
      ordenar_por = "calificacion_promedio",
      limite = 50,
    } = req.query;
    const sortOrder = ordenar === "asc" ? 1 : -1;

    const resultado = await Resena.aggregate([
      {
        $group: {
          _id: "$menu.nombre",
          precio_promedio: { $avg: "$menu.precio" },
          calificacion_promedio: { $avg: "$calificacion" },
          total_resenas: { $sum: 1 },
        },
      },
      {
        $project: {
          nombre_platillo: "$_id",
          precio_promedio: 1,
          calificacion_promedio: 1,
          total_resenas: 1,
          _id: 0,
        },
      },
      { $sort: { [ordenar_por]: sortOrder } },
      { $limit: parseInt(limite) },
    ]).hint({ "menu.nombre": 1, calificacion: -1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error en el análisis precio vs calificación",
      detalle: error.message,
    });
  }
};

// Top usuarios más activos dejando reseñas
exports.usuariosMasActivosReseñando = async (req, res) => {
  try {
    const { limite = 10, ordenar = "desc" } = req.query;
    const sortOrder = ordenar === "asc" ? 1 : -1;

    const resultado = await Resena.aggregate([
      {
        $group: {
          _id: "$usuario_id",
          nombre_usuario: { $first: "$nombre_usuario" },
          total_reseñas: { $sum: 1 },
          promedio_calificacion: { $avg: "$calificacion" },
        },
      },
      {
        $sort: { total_reseñas: sortOrder },
      },
      {
        $limit: parseInt(limite),
      },
    ]).hint({ usuario_id: 1, fecha: -1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener usuarios más activos reseñando",
      detalle: error.message,
    });
  }
};
