# Comandos útiles

## Ver los atributos de una colección

```javascript
db.nombre_coleccion.aggregate([
  { $project: { keys: { $objectToArray: "$$ROOT" } } },
  { $unwind: "$keys" },
  { $group: { _id: null, allKeys: { $addToSet: "$keys.k" } } }
])
```
