const Orden = require("../models/Orden");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// --- CRUD ---

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

// --- AGREGACIONES ---

exports.totalOrdenesPorRestaurante = async (req, res) => {
  try {
    const resultado = await Orden.aggregate([
      {
        $group: {
          _id: "$restaurante_id",
          total_ordenes: { $sum: 1 },
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
          total_ordenes: 1,
          _id: 0,
        },
      },
    ]).hint({ restaurante_id: 1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al contar órdenes por restaurante",
      detalle: error.message,
    });
  }
};

exports.ingresosTotalesPorRestaurante = async (req, res) => {
  try {
    const resultado = await Orden.aggregate([
      {
        $group: {
          _id: "$restaurante_id",
          ingresos_totales: { $sum: "$total" },
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
          ingresos_totales: 1,
          _id: 0,
        },
      },
    ]).hint({ restaurante_id: 1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular ingresos por restaurante",
      detalle: error.message,
    });
  }
};

// Listado de platillos más o menos vendidos por cantidad total solicitada
exports.topOBottomPlatillosVendidos = async (req, res) => {
  try {
    const { tipo = "top", limite = 5 } = req.query;
    const sortOrder = tipo === "bottom" ? 1 : -1;

    const resultado = await Orden.aggregate([
      { $unwind: "$platillos" },
      {
        $group: {
          _id: "$platillos.nombre",
          total_vendido: { $sum: "$platillos.cantidad" },
        },
      },
      {
        $project: {
          nombre_platillo: "$_id",
          total_vendido: 1,
          _id: 0,
        },
      },
      { $sort: { total_vendido: sortOrder } },
      { $limit: parseInt(limite) },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener platillos vendidos",
      detalle: error.message,
    });
  }
};

// Acumulado de ingresos generados por cada platillo
exports.ingresosPorPlatillo = async (req, res) => {
  try {
    const { ordenar = "desc" } = req.query;
    const sortOrder = ordenar === "asc" ? 1 : -1;

    const resultado = await Orden.aggregate([
      { $unwind: "$platillos" },
      {
        $group: {
          _id: "$platillos.nombre",
          ingresos: {
            $sum: { $multiply: ["$platillos.precio", "$platillos.cantidad"] },
          },
        },
      },
      {
        $project: {
          nombre_platillo: "$_id",
          ingresos: 1,
          _id: 0,
        },
      },
      { $sort: { ingresos: sortOrder } },
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular ingresos por platillo",
      detalle: error.message,
    });
  }
};

// Agregación de ganancias por mes y por año
exports.gananciasPorPeriodo = async (req, res) => {
  try {
    const {
      tipo = "mensual",
      anio,
      mes,
      ordenar_por = "monto_total",
      orden = "desc",
    } = req.query;

    const sortOrder = orden === "asc" ? 1 : -1;

    const exprCondiciones = [{ $eq: ["$estado", "cancelada"] }];

    if (anio) {
      exprCondiciones.push({
        $eq: [{ $year: "$fecha" }, parseInt(anio)],
      });
    }

    if (mes) {
      const mesNum = parseInt(mes);
      if (mesNum < 1 || mesNum > 12) {
        return res.status(400).json({ error: "Mes debe estar entre 1 y 12" });
      }
      exprCondiciones.push({
        $eq: [{ $month: "$fecha" }, mesNum],
      });
    }

    const pipeline = [
      {
        $match: {
          $expr: { $and: exprCondiciones },
        },
      },
      {
        $group: {
          _id: {
            restaurante_id: "$restaurante_id",
            ...(tipo === "mensual" && {
              mes: { $month: "$fecha" },
              anio: { $year: "$fecha" },
            }),
            ...(tipo === "anual" && {
              anio: { $year: "$fecha" },
            }),
          },
          monto_total: { $sum: "$total" },
          promedio_ganancia: { $avg: "$total" },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "_id.restaurante_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          nombre_restaurante: "$restaurante.nombre",
          monto_total: 1,
          promedio_ganancia: 1,
          ...(tipo === "mensual" && {
            mes: "$_id.mes",
            anio: "$_id.anio",
          }),
          ...(tipo === "anual" && {
            anio: "$_id.anio",
          }),
          _id: 0,
        },
      },
      {
        $sort: {
          [ordenar_por]: sortOrder,
        },
      },
    ];

    const resultado = await Orden.aggregate(pipeline).hint({
      restaurante_id: 1,
    });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular ganancias",
      detalle: error.message,
    });
  }
};

// Agregación de ganancias agrupadas por bloques de meses
exports.gananciasPorBloques = async (req, res) => {
  try {
    const {
      meses = 1,
      ordenar_por = "monto_total",
      orden = "desc",
    } = req.query;

    const sortOrder = orden === "asc" ? 1 : -1;
    const n = parseInt(meses);
    if (![1, 2, 3, 4, 6, 12].includes(n)) {
      return res.status(400).json({
        error: "Meses inválidos, permite solo: 1, 2, 3, 4, 6, 12",
      });
    }

    const pipeline = [
      {
        $match: {
          $expr: { $eq: ["$estado", "cancelada"] },
        },
      },
      {
        $addFields: {
          mes: { $month: "$fecha" },
          anio: { $year: "$fecha" },
          bloque: {
            $ceil: { $divide: [{ $month: "$fecha" }, n] },
          },
        },
      },
      {
        $group: {
          _id: {
            restaurante_id: "$restaurante_id",
            anio: "$anio",
            bloque: "$bloque",
          },
          monto_total: { $sum: "$total" },
          promedio_ganancia: { $avg: "$total" },
          meses_incluidos: { $addToSet: "$mes" },
        },
      },
      {
        $lookup: {
          from: "restaurante",
          localField: "_id.restaurante_id",
          foreignField: "_id",
          as: "restaurante",
        },
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          nombre_restaurante: "$restaurante.nombre",
          monto_total: 1,
          promedio_ganancia: 1,
          bloque: "$_id.bloque",
          anio: "$_id.anio",
          meses_incluidos: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          [ordenar_por]: sortOrder,
        },
      },
    ];

    const resultado = await Orden.aggregate(pipeline).hint({
      restaurante_id: 1,
    });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular ganancias por bloques",
      detalle: error.message,
    });
  }
};

// Agregación de ganancias por rango de fechas
exports.gananciasPorRango = async (req, res) => {
  try {
    const {
      desde,
      hasta,
      ordenar_por = "monto_total",
      orden = "desc",
    } = req.query;

    const sortOrder = orden === "asc" ? 1 : -1;
    const match = { estado: "cancelada" };

    if (desde || hasta) {
      match.fecha = {};
      if (desde) match.fecha.$gte = new Date(desde);
      if (hasta) match.fecha.$lte = new Date(hasta);
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$restaurante_id",
          monto_total: { $sum: "$total" },
          promedio_ganancia: { $avg: "$total" },
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
          nombre_restaurante: "$restaurante.nombre",
          monto_total: 1,
          promedio_ganancia: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          [ordenar_por]: sortOrder,
        },
      },
    ];

    const resultado = await Orden.aggregate(pipeline).hint({
      fecha: 1,
      restaurante_id: 1,
    });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular ganancias por rango de fechas",
      detalle: error.message,
    });
  }
};

// Conteo por estado y porcentaje por restaurante
exports.estadisticasPorEstado = async (req, res) => {
  try {
    const {
      estado = "cancelada",
      ordenar = "desc",
      ordenar_por = "porcentaje_estado", // porcentaje_estado | total_ordenes
      limite = 10,
    } = req.query;

    const sortOrder = ordenar === "asc" ? 1 : -1;

    const resultado = await Orden.aggregate([
      {
        $group: {
          _id: "$restaurante_id",
          total_ordenes: { $sum: 1 },
          estado_count: {
            $sum: {
              $cond: [{ $eq: ["$estado", estado] }, 1, 0],
            },
          },
        },
      },
      {
        $addFields: {
          porcentaje_estado: {
            $cond: [
              { $gt: ["$total_ordenes", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$estado_count", "$total_ordenes"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
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
          nombre_restaurante: "$restaurante.nombre",
          total_ordenes: 1,
          porcentaje_estado: 1,
          estado: { $literal: estado },
          _id: 0,
        },
      },
      {
        $sort: {
          [ordenar_por]: sortOrder,
        },
      },
      { $limit: parseInt(limite) },
    ]).hint({ restaurante_id: 1, estado: 1 });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al calcular estadísticas por estado",
      detalle: error.message,
    });
  }
};
