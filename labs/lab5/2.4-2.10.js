// 2.4 - Crear una consulta que busque la receta que acaba de crear
db.recetas.find({ nombre: "Tacos de Carnitas" });

// 2.5 - Crear una consulta en la que liste las recetas, mostrando únicamente el título y su tiempo de cocción
db.recetas.find(
  {},
  { "Titulo Receta": "$nombre", "Tiempo Coccion": "$tiempo total minutos" }
);

// 2.6 - Crear una consulta en la que se listen las recetas ordenadas por mayor tiempo de cocción
db.recetas
  .find(
    {},
    { "Titulo Receta": "$nombre", "Tiempo Coccion": "$tiempo total minutos" }
  )
  .sort({ "tiempo total minutos": -1 });

// 2.7 - Investigar la instrucción `update()` para agregar un rating más a una receta y actualizar el rating promedio
db.recetas.updateOne(
  { nombre: "Tacos de Carnitas" },
  {
    $push: { ratings: 5 },
    $set: {
      rating_promedio: 5,
    },
  }
);

db.recetas.find(
  { nombre: "Tacos de Carnitas" },
  { nombre: 1, rating_promedio: 1, _id: 0, ratings: 1 }
);

// 2.8 - Crear una consulta en la que elimine un ingrediente de la lista de ingredientes de una receta en específico
db.recetas.updateOne(
  { nombre: "Tacos de Carnitas" },
  { $pull: { ingredientes: { nombre: "cilantro" } } }
);

// 2.9 - Investigar la opción `skip()` de la instrucción `find()` y crear una consulta en la que obtenga la tercera receta con mejor rating promedio
db.recetas
  .find({}, { Nombre: "$nombre", "Rating promedio": "$rating_promedio" })
  .sort({ rating_promedio: -1 })
  .skip(2)
  .limit(1);

// 2.10 - Crear una consulta que busque las recetas que tienen comentarios
db.recetas.find({ comentarios: { $exists: true, $ne: [] } });
