// 2.1 - Crear una consulta para obtener todas las recetas
db["recetas"].find();

//2.2 - Crear una consulta para obtener todos los usuarios
db["usuarios"].find();

// 2.3 - Crear un nuevo documento en la colección `recetas`
// [OPCIONAL]: eliminar el documento del json con la data actualizada: db["recetas"].deleteOne({ _id: "6" });
db["recetas"].insertOne({
  _id: "6",
  nombre: "Tacos de Carnitas",
  descripcion:
    "Tacos tradicionales mexicanos con carne de cerdo cocida lentamente hasta quedar dorada y jugosa.",
  "tiempo total minutos": 180,
  Porciones: 6,
  calorias: "500",
  dificultad: "Media",
  vegetariana: false,
  ingredientes: [
    { nombre: "carne de cerdo (pierna o lomo)", cantidad: "1 kg" },
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
  preparación: [
    "Corta la carne de cerdo en trozos medianos y colócala en una olla grande.",
    "Añade el jugo de naranja, los ajos enteros, la hoja de laurel, sal, pimienta y comino.",
    "Vierte el agua hasta que la carne quede cubierta y cocina a fuego medio hasta que el agua se evapore (aproximadamente 1.5 horas).",
    "Una vez que el agua se haya evaporado, deja que la carne se dore en su propia grasa hasta que esté bien dorada y crujiente.",
    "Retira la hoja de laurel y desmenuza ligeramente la carne con un tenedor.",
    "Calienta las tortillas de maíz en un comal y arma los tacos con la carne de carnitas.",
    "Decora con cebolla picada, cilantro y salsa al gusto. ¡Disfruta!",
  ],
  ratings: [5, 5],
  rating_promedio: 4.0,
});
