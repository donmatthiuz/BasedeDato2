const Usuario = require("../models/Usuario");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

exports.subirArchivoUsuario = [
  upload.single("usuario"), // campo esperado en el formulario
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const setFecha = (item) => {
        if (!item.fecha_registro) item.fecha_registro = new Date();
        return item;
      };

      const insertData = (Array.isArray(data) ? data : [data]).map(setFecha);
      const insertados = await Usuario.insertMany(insertData, {
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

exports.crearUsuario = async (req, res) => {
  try {
    const data = req.body;

    const setFecha = (item) => {
      if (!item.fecha_registro) item.fecha_registro = new Date();
      return item;
    };

    if (!Array.isArray(data)) {
      const usuario = new Usuario(setFecha(data));
      await usuario.save();
      return res.status(201).json(usuario);
    }

    const usuarios = await Usuario.insertMany(data.map(setFecha), {
      ordered: false,
    });
    res.status(201).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtro por _id ---
    if (query._id) {
      if (!mongoose.Types.ObjectId.isValid(query._id)) {
        return res
          .status(400)
          .json({ error: "El _id proporcionado no es válido" });
      }
      filtro._id = new mongoose.Types.ObjectId(query._id);
    }

    // --- Filtros simples ---
    if (query.nombre) filtro.nombre = new RegExp(query.nombre, "i");
    if (query.email) filtro.email = query.email;
    if (query.telefono) filtro.telefono = query.telefono;
    if (query.tipo) filtro.tipo = query.tipo;

    // --- Filtros con expresiones regulares ---
    if (query.email_regex) filtro.email = new RegExp(query.email_regex, "i");
    if (query.direccion_regex)
      filtro.direccion = new RegExp(query.direccion_regex, "i");

    // --- Filtros por inclusión/exclusión ---
    if (query.email_in) filtro.email = { $in: query.email_in.split(",") };
    if (query.telefono_nin)
      filtro.telefono = { $nin: query.telefono_nin.split(",") };

    // --- Filtro por rango de fechas de registro ---
    if (query.fecha_inicio || query.fecha_fin) {
      filtro.fecha_registro = {};
      if (query.fecha_inicio) {
        const inicio = new Date(`${query.fecha_inicio}T00:00:00.000Z`);
        filtro.fecha_registro.$gte = inicio;
      }
      if (query.fecha_fin) {
        const fin = new Date(`${query.fecha_fin}T23:59:59.999Z`);
        filtro.fecha_registro.$lte = fin;
      }
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
        proyeccion["_id"] = 0;
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
    const usuarios = await Usuario.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ nombre: 1, tipo: 1, fecha_registro: -1 })
      .lean();

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const data = req.body;

    // --- Actualización única ---
    if (!Array.isArray(data)) {
      const { _id, ...update } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const actualizado = await Usuario.findByIdAndUpdate(_id, update, {
        new: true,
        runValidators: true,
      });

      if (!actualizado)
        return res.status(404).json({ error: "Usuario no encontrado" });

      return res.json(actualizado);
    }

    // --- Actualización múltiple ---
    const resultados = await Promise.all(
      data.map(async (u) => {
        const { _id, ...update } = u;
        if (!_id) return { error: "Falta _id" };

        const actualizado = await Usuario.findByIdAndUpdate(_id, update, {
          new: true,
          runValidators: true,
        });

        return actualizado || { _id, error: "No encontrado" };
      })
    );

    res.json(resultados);
  } catch (error) {
    res.status(400).json({
      error: "Error al actualizar",
      detalle: error.message,
    });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const data = req.body;

    // --- Eliminación única ---
    if (!Array.isArray(data)) {
      const { _id } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const eliminado = await Usuario.findByIdAndDelete(_id);
      if (!eliminado) {
        return res.status(404).json({ error: "Usuario no encontrado", _id });
      }

      return res.status(200).json({ _id, status: "eliminado" });
    }

    // --- Eliminación múltiple ---
    const resultados = await Promise.all(
      data.map(async (item) => {
        const { _id } = item;
        if (!_id) return { error: "Falta _id" };

        try {
          const eliminado = await Usuario.findByIdAndDelete(_id);
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
