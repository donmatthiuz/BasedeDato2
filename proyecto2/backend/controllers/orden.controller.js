const Orden = require("../models/Orden");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

const prepararOrden = (orden) => {
  const totalCalculado = (orden.platillos || []).reduce((sum, p) => {
    return sum + p.cantidad * p.precio;
  }, 0);

  return {
    ...orden,
    fecha: orden.fecha ? new Date(orden.fecha) : new Date(),
    total: totalCalculado,
  };
};

exports.subirArchivoOrden = [
  upload.single("orden"), // nombre del campo esperado: "orden"
  async (req, res) => {
    try {
      const path = req.file.path;
      const content = fs.readFileSync(path, "utf8");
      const data = JSON.parse(content);

      const insertData = Array.isArray(data) ? data : [data];
      const ordenesConTotal = insertData.map(prepararOrden);

      const insertados = await Orden.insertMany(ordenesConTotal, {
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

exports.crearOrden = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      const nuevaOrden = new Orden(prepararOrden(data));
      await nuevaOrden.save();
      return res.status(201).json(nuevaOrden);
    }

    const ordenes = await Orden.insertMany(data.map(prepararOrden), {
      ordered: false,
    });
    res.status(201).json(ordenes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerOrdenes = async (req, res) => {
  try {
    const query = req.query;
    const filtro = {};

    // --- Filtros simples ---
    if (query.usuario_id) filtro.usuario_id = query.usuario_id;
    if (query.restaurante_id) filtro.restaurante_id = query.restaurante_id;
    if (query.estado) filtro.estado = query.estado;
    if (query.estado_in) filtro.estado = { $in: query.estado_in.split(",") };
    if (query.estado_nin) filtro.estado = { $nin: query.estado_nin.split(",") };

    // --- Rango de total ---
    if (
      query.total_gt ||
      query.total_gte ||
      query.total_lt ||
      query.total_lte
    ) {
      filtro.total = {};
      if (query.total_gt) filtro.total.$gt = parseFloat(query.total_gt);
      if (query.total_gte) filtro.total.$gte = parseFloat(query.total_gte);
      if (query.total_lt) filtro.total.$lt = parseFloat(query.total_lt);
      if (query.total_lte) filtro.total.$lte = parseFloat(query.total_lte);
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
    const ordenes = await Orden.find(filtro, proyeccion)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .hint({ usuario_id: 1, fecha: -1 })
      .lean();

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({
      error: "Consulta no válida o sin índice",
      detalle: error.message,
    });
  }
};

exports.actualizarOrden = async (req, res) => {
  try {
    const data = req.body;

    // Función para recalcular el total si se actualizan platillos
    const recalcularTotal = async (platillos, ordenId) => {
      const ordenActual = await Orden.findById(ordenId);
      if (!ordenActual) return 0;

      return (platillos || []).reduce((sum, p, i) => {
        const precio =
          typeof p.precio === "number"
            ? p.precio
            : ordenActual.platillos[i]?.precio || 0;
        const cantidad = p.cantidad || ordenActual.platillos[i]?.cantidad || 0;
        return sum + precio * cantidad;
      }, 0);
    };

    // --- Actualización única ---
    if (!Array.isArray(data)) {
      const { _id, total, ...update } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      if (Object.prototype.hasOwnProperty.call(data, "total")) {
        return res.status(400).json({
          error: "El campo 'total' no puede ser modificado directamente",
        });
      }

      if (update.platillos) {
        update.total = await recalcularTotal(update.platillos, _id);
      }

      const actualizado = await Orden.findByIdAndUpdate(_id, update, {
        new: true,
        runValidators: true,
      });

      if (!actualizado)
        return res.status(404).json({ error: "Orden no encontrada" });

      return res.json(actualizado);
    }

    // --- Actualización múltiple ---
    const resultados = await Promise.all(
      data.map(async (orden) => {
        const { _id, total, ...update } = orden;
        if (!_id) return { error: "Falta _id" };

        if (Object.prototype.hasOwnProperty.call(orden, "total")) {
          return {
            _id,
            error: "El campo 'total' no puede ser modificado directamente",
          };
        }

        if (update.platillos) {
          update.total = await recalcularTotal(update.platillos, _id);
        }

        const actualizado = await Orden.findByIdAndUpdate(_id, update, {
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

exports.eliminarOrden = async (req, res) => {
  try {
    const data = req.body;

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return res.status(400).json({ error: "Se requiere al menos un _id" });
    }

    // Eliminación única
    if (!Array.isArray(data)) {
      const { _id } = data;
      if (!_id) return res.status(400).json({ error: "Falta el campo _id" });

      const resultado = await Orden.findByIdAndDelete(_id);
      if (!resultado)
        return res
          .status(404)
          .json({ _id, eliminado: false, error: "Orden no encontrada" });

      return res.json({ _id, eliminado: true });
    }

    // Eliminación múltiple
    const resultados = await Promise.all(
      data.map(async ({ _id }) => {
        if (!_id) return { eliminado: false, error: "Falta _id" };
        const resultado = await Orden.findByIdAndDelete(_id);
        if (!resultado)
          return { _id, eliminado: false, error: "No encontrada" };
        return { _id, eliminado: true };
      })
    );

    res.json(resultados);
  } catch (error) {
    res.status(400).json({
      error: "Error al eliminar orden(es)",
      detalle: error.message,
    });
  }
};
