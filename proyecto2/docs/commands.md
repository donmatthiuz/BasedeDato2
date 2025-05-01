# Comandos útiles

## Ver los atributos de una colección

```javascript
db.nombre_coleccion.aggregate([
  { $project: { keys: { $objectToArray: "$$ROOT" } } },
  { $unwind: "$keys" },
  { $group: { _id: null, allKeys: { $addToSet: "$keys.k" } } }
])
```

## Ver los índices

```js
db.getCollectionNames().forEach(function (col) {
  print("Índices en la colección: " + col);
  printjson(db.getCollection(col).getIndexes());
});
```
