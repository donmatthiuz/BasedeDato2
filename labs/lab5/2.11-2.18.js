// 2.11 - Cree una consulta en la que liste las recetas que son de postres

// 1. Primero se cambiará las consultas para agregar una categoría
db.recetas.updateOne(
  { nombre: "Tacos de Carnitas" },
  { $set: { tipo: "plato fuerte" } }
);

db.recetas.updateOne(
  { nombre: "Pizza Margarita" },
  { $set: { tipo: "plato fuerte" } }
);

db.recetas.updateOne(
  { nombre: "Sopa de Lentejas" },
  { $set: { tipo: "entrada" } }
);

db.recetas.updateOne(
  { nombre: "Ensalada César" },
  { $set: { tipo: "entrada" } }
);

db.recetas.updateOne(
  { nombre: "Espagueti a la Carbonara" },
  { $set: { tipo: "plato fuerte" } }
);

db.recetas.updateOne(
  { nombre: "Brownies de Chocolate" },
  { $set: { tipo: "postre" } }
);

db.recetas.updateOne(
  { nombre: "Pollo al Curry" },
  { $set: { tipo: "plato fuerte" } }
);

db.recetas.updateOne(
  { nombre: "Ensalada Griega" },
  { $set: { tipo: "entrada" } }
);

db.recetas.updateOne(
  { nombre: "Pasta Alfredo" },
  { $set: { tipo: "plato fuerte" } }
);

db.recetas.updateOne(
  { nombre: "Sopa de Tomate" },
  { $set: { tipo: "entrada" } }
);

// 2. Comprobando cambios
db["recetas"].find({}, { nombre: 1, tipo: 1, _id: 0 });

// 3. Se hará el query para traer los que tienen como categoría "Postres"
db.recetas.find({ tipo: "postre" });

// 2.12 - Crear 3 nuevos documentos de usuarios en una sola instrucción
db.usuarios.insertOne({
  nombre: "Josue",
  apellido: "Say",
  correo: "say_josue@correo.com",
  contraseña: "123",
});

db.usuarios.insertOne({
  nombre: "Mathew",
  apellido: "Cordero",
  correo: "cordero_mathew@correo.com",
  contraseña: "456",
});

db.usuarios.insertOne({
  nombre: "Abby",
  apellido: "Donis",
  correo: "donis_abby@correo.com",
  contraseña: "789",
});

// comprobando resultados
db.usuarios.find({
  correo: {
    $in: [
      "say_josue@correo.com",
      "cordero_mathew@correo.com",
      "donis_abby@correo.com",
    ],
  },
});

// 2.13 - Crear las consultas para agregar la receta favorita a cada uno de los usuarios creados anteriormente
db.usuarios.updateOne(
  { correo: "say_josue@correo.com" },
  { $set: { receta_favorita: "Tacos de Carnitas" } }
);

db.usuarios.updateOne(
  { correo: "donis_abby@correo.com" },
  { $set: { receta_favorita: "Brownies de Chocolate" } }
);

db.usuarios.updateOne(
  { correo: "cordero_mathew@correo.com" },
  { $set: { receta_favorita: "Pasta Alfredo" } }
);

// comprobando cambios
db.usuarios.find(
  {
    correo: {
      $in: [
        "say_josue@correo.com",
        "donis_abby@correo.com",
        "cordero_mathew@correo.com",
      ],
    },
  },
  { nombre: 1, receta_favorita: 1, _id: 0 }
);

// 2.14 - Crear una consulta para consultar los distintos nombres de usuarios
db.usuarios.distinct("nombre");

// 2.15 - Agregar un campo de actividad a los usuarios
db.usuarios.updateMany({}, { $set: { actividad: true } });

// comprobación de cambios
db.usuarios.find({}, { nombre: 1, actividad: 1, _id: 0 });

// 2.16 - Crear una consulta en la que inactive a 2 usuarios
db.usuarios.updateOne({ nombre: "Mathew" }, { $set: { actividad: false } });
db.usuarios.updateOne({ nombre: "Abby" }, { $set: { actividad: false } });
// comprobación de cambios
db.usuarios.find({}, { nombre: 1, actividad: 1, _id: 0 });

// 2.17 - Crear una consulta en la que cambie la unidad de medida de todas las recetas que tienen `lb` a `kg`
db.recetas.find({ "ingredientes.cantidad": /kg/ });
db.recetas.updateOne(
  { nombre: "Tacos de Carnitas" },
  {
    $set: {
      ingredientes: [
        { nombre: "carne de cerdo (pierna o lomo)", cantidad: "1 lb" },
        { nombre: "naranja", cantidad: "1 unidad (jugo)" },
        { nombre: "ajo", cantidad: "3 dientes" },
        { nombre: "hoja de laurel", cantidad: "1 unidad" },
        { nombre: "sal", cantidad: "1 cucharada" },
        { nombre: "pimienta negra", cantidad: "1 cucharadita" },
        { nombre: "comino", cantidad: "1 cucharadita" },
        { nombre: "agua", cantidad: "500 ml" },
        { nombre: "tortillas de maíz", cantidad: "12 unidades" },
        { nombre: "salsa verde o roja", cantidad: "al gusto" },
      ],
    },
  }
);

// 2.18 - Crear una consulta en la que elimine a los usuarios inactivos
db.usuarios.deleteMany({ actividad: false });
