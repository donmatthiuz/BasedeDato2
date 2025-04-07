// 1.4

// Primero se observan las variables a hacer los índices
db["usuarios"]
  .find(
    {},
    {
      activo: "$activo",
      puntos: "$puntos",
      "producto-fecha": "$historial_compras",
      tags: "$tags",
      visitas: "$visitas",
      preferencias: "$preferencias",
      amigos: "$amigos",
    }
  )
  .limit(1);

/*
{
  _id: ObjectId('67ef1a0eb5ce617e919b958a'),
  activo: true,
  puntos: 800,
  'producto-fecha': [
    {
      producto: 'Producto 1',
      fecha: 2023-11-12T00:00:00.000Z
    }
  ],
  tags: [
    'tag2',
    'tag3'
  ],
  visitas: 150,
  preferencias: {
    color: 'rojo',
    idioma: 'español',
    tema: 'oscuro'
  },
  amigos: [
    300,
    410
  ]
}
*/

// Cree un índice compuesto sobre esta colección en los campos activo y puntos.
db["usuarios"].createIndex({ activo: 1, puntos: 1 });

// Cree un índice compuesto sobre los campos embebidos producto (historial_compras) y fecha (historial_compras)
db["usuarios"].createIndex({
  "historial_compras.producto": 1,
  "historial_compras.fecha": 1,
});

// Cree un índice compuesto sobre los campos de tags y visitas.
db["usuarios"].createIndex({ tags: 1, visitas: 1 });

// Cree un índice compuesto sobre el campo embebido color (preferencias) y amigos.
db["usuarios"].createIndex({
  "preferencias.color": 1,
  amigos: 1,
});

// referencia: https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/create-multikey-index-embedded/
// referencia: https://www.mongodb.com/docs/manual/core/indexes/index-types/index-single/

// 1.5

db.usuarios
  .find({ activo: true, puntos: { $gt: 500 } })
  .explain("executionStats");

// Se retornaron 24953 documentos, con un tiempo de 165 milisegundos de tiempo en consulta.

db.usuarios
  .aggregate([
    { $unwind: "$historial_compras" },
    { $match: { "historial_compras.producto": "Producto 1" } },
    { $sort: { "historial_compras.fecha": -1 } },
    { $limit: 7 },
  ])
  .explain("executionStats");

// Se retornaron 100000 documentos, con un tiempo de 437 milisegundos de tiempo en consulta.

db.usuarios
  .find({ tags: "tag2", visitas: { $gt: 100 } })
  .explain("executionStats");

// Se retornaron 89853 documentos, con un tiempo de 179 milisegundos de tiempo en consulta.

db.usuarios
  .find({
    "preferencias.color": "azul",
    amigos: { $gte: 1000, $lte: 2000 },
  })
  .explain("executionStats");

// Se retornaron 4919 documentos, con un tiempo de 686 milisegundos de tiempo en consulta.

// 1.6

db.usuarios
  .find({ activo: true, puntos: { $gt: 500 } })
  .explain("executionStats");

// Se retornaron 37463 documentos, con un tiempo de 201 milisegundos de tiempo en consulta.

db.usuarios
  .aggregate([
    { $unwind: "$historial_compras" },
    { $match: { "historial_compras.producto": "Producto 1" } },
    { $sort: { "historial_compras.fecha": -1 } },
    { $limit: 7 },
  ])
  .explain("executionStats");

// Se retornaron 150000 documentos, con un tiempo de 499 milisegundos de tiempo en consulta.

db.usuarios
  .find({ tags: "tag2", visitas: { $gt: 100 } })
  .explain("executionStats");

// Se retornaron 134719 documentos, con un tiempo de 292 milisegundos de tiempo en consulta.

db.usuarios
  .find({
    "preferencias.color": "azul",
    amigos: { $gte: 1000, $lte: 2000 },
  })
  .explain("executionStats");

// Se retornaron 7340 documentos, con un tiempo de 1069 milisegundos de tiempo en consulta.
