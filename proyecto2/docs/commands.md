# Comandos útiles

## Índices

### **restaurante**

```js
db.restaurante.createIndex({ nombre: 1 })
db.restaurante.createIndex({ nombre: "text", categoria: "text" })
db.restaurante.createIndex({ coordenadas: "2dsphere" })
```

### **articulo\_menu**

```js
db.menu.createIndex({ restaurante_id: 1, disponible: 1 })
db.menu.createIndex({ nombre: "text", descripcion: "text" })
```

### **usuario**

```js
db.usuario.createIndex({ nombre: 1, tipo: 1 })
```

### **orden**

```js
db.orden.createIndex({ usuario_id: 1, fecha: -1 })
db.orden.createIndex({ restaurante_id: 1 })
```

### **resena**

```js
db.resena.createIndex({ restaurante_id: 1, calificacion: -1 })
db.resena.createIndex({ usuario_id: 1 })
db.resena.createIndex({ nombre_usuario: 1 })
```

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
